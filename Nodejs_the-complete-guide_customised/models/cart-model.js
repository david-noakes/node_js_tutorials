const mockdb = require('../jsonDB/mockdb');
const config = require('../util/config');
const mysqldb = require('../util/database-mysql2');
const config = require('../util/config');
const axios = require('axios');
const axiosUrl = config.environment.apiUrl;

const cartsTable = "carts";
const cartsUrl = axiosUrl + '/' + cartsTable;
const productTable = "products";
const productsUrl = axiosUrl + '/' + productTable;

const uuidTools = require('../util/uuid-tools');

module.exports = class Cart {
  constructor(userId) {
    this.userId = userId;
    this.products = [];
    this.totalPrice = 0;
  }
    

  addProduct(id, productPrice) {
    // Analyze the cart => Find existing product
    const existingProductIndex = products.findIndex(
      prod => prod.id === id
    );
    const existingProduct = products[existingProductIndex];
    let updatedProduct;
    // Add new product/ increase quantity
    if (existingProduct) {
      console.log('existingProduct', existingProduct)
      updatedProduct = { ...existingProduct };
      updatedProduct.qty = updatedProduct.qty + 1;
      cart.products = [...cart.products];
      cart.products[existingProductIndex] = updatedProduct;
    } else {
      updatedProduct = { id: id, qty: 1 };
      console.log('new product', updatedProduct);
      cart.products = [...cart.products, updatedProduct];
    }
    // const a1 = cart.totalPrice + +productPrice;
    // const a2 = a1 + 0.001;
    // const a3 = a2 * 100;
    // const a4 = Math.round(a3);
    // const a5 = a4 / 100;
    const a6 = Math.round((cart.totalPrice + +productPrice + 0.001) * 100) / 100;
    console.log('new price:', a6);
    // console.log(a1, a2, a3, a4, a5, a6);

    cart.totalPrice = a6;

    if (config.environment.dbType === config.environment.DB_JSONDB ||
      config.environment.dbType === config.environment.DB_MOCKDB) {
      return axios.put(cartsUrl + '?id=' + userId, cart);
    } else if (config.environment.dbType === config.environment.DB_MYSQL) {
      return mysqldb.execute('SELECT * FROM carts WHERE carts.userId = ?', [userId]);
    } else if (config.environment.dbType === config.environment.DB_FILEDB) {
      mockdb.putCart(loggedInUser, cart, (result, error) => {
        if (error) {
          console.log(error);
        } else {
          console.log(result);
        }
      });
    } else {
    const eMsg = 'cart-model.addProduct:config.environment.dbType:' + config.environment.dbType + ' not supported';
    console.log(eMsg);
    return Promise.resolve({ error: eMsg});
  }

  }

  static deleteProduct(id, productPrice) {
    if (config.environment.dbType === config.environment.DB_FILEDB) {
      // Fetch the previous cart
    console.log('delete product from cart');
    let cart = mockdb.getCart(loggedInUser);
    console.log('cart', cart);
    if (!cart) {
      cart = { userId: loggedInUser, products: [], totalPrice: 0 };
      mockdb.addCart(cart);
      return;
    }
    const updatedCart = { ...cart };
    console.log('id', id);
    const idx = updatedCart.products.findIndex(prod => prod.id === id);
    if (idx < 0) {
      return;
    }
    const product = updatedCart.products[idx];
    console.log(product);
    const productQty = product.qty;
    updatedCart.products = updatedCart.products.filter(
      prod => prod.id !== id
    );
    const a7 =
      updatedCart.totalPrice - productPrice * productQty;
    const a8 = Math.round((a7 + 0.001) * 100) / 100;
    console.log(a7, a8);
    updatedCart.totalPrice = a8;
    mockdb.putCart(loggedInUser, updatedCart, (result, error) => { 
      if (error) {
        console.log(error);
      } else {
        console.log(result);
      }
    });
  } else {
    const eMsg = 'cart-model.addProduct:config.environment.dbType:' + config.environment.dbType + ' not supported';
    console.log(eMsg);
    return Promise.resolve({ error: eMsg});
  }
}

  static getCart(userId, cb) {
    if (config.environment.dbType === config.environment.DB_JSONDB ||
      config.environment.dbType === config.environment.DB_MOCKDB) {
      return axios.get(cartsUrl + '?email=' + userId);
    } else if (config.environment.dbType === config.environment.DB_MYSQL) {
      return mysqldb.execute('SELECT * FROM carts WHERE carts.userId = ?', [userId]);
    } else if (config.environment.dbType === config.environment.DB_FILEDB) {
      let cart = mockdb.getCart(userId);
      console.log('cart', cart);
      if (!cart) {
        cart = { userId: loggedInUser, products: [], totalPrice: 0 };
        mockdb.addCart(cart);
      }
      if (cb) {
        cb(cart, null);
      } else {
        return Promise.resolve(cart);
      }
    } else {
      const eMsg = 'cart-model.getCart:config.environment.dbType:' + config.environment.dbType + ' not supported';
      console.log(eMsg);
      return Promise.resolve({ error: eMsg});
    }
  }

  getProducts() {
    return Promise.resolve(this.products);
  }
};