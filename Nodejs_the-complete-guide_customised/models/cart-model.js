const axios = require('axios');
const config = require('../util/config');
let getDb;
if (config.environment.dbType === config.environment.DB_MONGODB) {
  getDb = require('../util/database-mongodb').getDb;
}
const mockdb = require('../mockdb/mockdb');
const mongodb = require('mongodb');
const mysqldb = require('../util/database-mysql2');
const Product = require('../models/product-model');

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
    this.id = null;
  }

  static factory(cartData) {
    let id;
    if (config.environment.dbType === config.environment.DB_MONGODB) {
      id = cartData._id+'';
    } else {
      id = cartData.id;
    }
    let cart = new Cart(cartData.userId);
    if (cartData.products) {
      cart.products = cartData.products;
    }
    cart.totalPrice = cartData.totalPrice;
    cart.id = id;
    if (config.environment.dbType === config.environment.DB_MONGODB) {
      cart._id = mongodb.ObjectId(cartData._id);
    }
    return cart;
  }

  static fetchAll() {
    console.log('cart-model.fetchAll:');
    if (config.environment.dbType === config.environment.DB_JSONDB ||
      config.environment.dbType === config.environment.DB_MOCKDB) {
      return axios.get(cartsUrl);
    } else if (config.environment.dbType === config.environment.DB_MONGODB) {
      const db = getDb();
      return db
        .collection(cartsTable)
        .find().toArray();
      } else {
        const eMsg = 'cart-model.getCart:config.environment.dbType:' + config.environment.dbType + ' not supported';
        console.log(eMsg);
        return Promise.resolve({ error: eMsg});
      }
  }

  static getCart(userId, cb) {
    if (config.environment.dbType === config.environment.DB_JSONDB ||
      config.environment.dbType === config.environment.DB_MOCKDB) {
      return axios.get(cartsUrl + '?userId=' + userId);
    } else if (config.environment.dbType === config.environment.DB_MONGODB) {
      const db = getDb();
      console.log('cart-model.getCart:userId:', userId);
      return db
        .collection(cartsTable)
        // .findOne({ userId: new mongodb.ObjectId(userId) });
        .findOne({
          $or: [{userId: new mongodb.ObjectId(userId)},
                {userId: userId}]
           });
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

  save() {
    if (config.environment.dbType === config.environment.DB_JSONDB ||
        config.environment.dbType === config.environment.DB_MOCKDB) {
      if (this.id) {
        return axios.put(cartsUrl + '?id=' + userId, this);
      } else {
        return axios.post(cartsUrl, this);
      }   
    } else if (config.environment.dbType === config.environment.DB_MONGODB) {
      const db = getDb();
      if (this.id) {
        return db.collection(cartsTable).updateOne({ _id: new mongodb.ObjectId(this.id) }, { $set: this });
      } else {
        return db.collection(cartsTable).insertOne(this);
      }
    } else if (config.environment.dbType === config.environment.DB_FILEDB) {
      mockdb.putCart(loggedInUser, this, (result, error) => {
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

  addProduct(id, productPrice) {
    // Analyze the cart => Find existing product
    console.log('cart.addProduct.products:', this.products);
    const existingProductIndex = this.products.findIndex(
      prod => prod.id+'' === id+''  // check this
    );
    const existingProduct = this.products[existingProductIndex];
    let updatedProduct;
    // Add new product/ increase quantity
    if (existingProduct) {
      console.log('existingProduct', existingProduct)
      updatedProduct = { ...existingProduct };
      updatedProduct.qty = updatedProduct.qty + 1;
      this.products = [...this.products];
      this.products[existingProductIndex] = updatedProduct;
    } else {
      updatedProduct = { id: id, qty: 1 };
      console.log('new product', updatedProduct);
      this.products = [...this.products, updatedProduct];
    }
    const a6 = Math.round((this.totalPrice + +productPrice + 0.001) * 100) / 100;
    console.log('new price:', a6);

    this.totalPrice = a6;
    // console.log('cart.addProduct.updatedCart:', this);
    return this.save();

  }

  deleteProduct(id, productPrice) {
      console.log('cart.deleteProduct:id', id);
      const idx = this.products.findIndex(prod => prod.id.toString() === id.toString());
      if (idx < 0) {
        return Promise.resolve({ msg: 'nothing to delete'});
      }
      const product = this.products[idx];
      console.log(product);
      const productQty = product.qty;
      this.products = this.products.filter(
        prod => prod.id.toString() !== id.toString()
      );
      const a7 =
        this.totalPrice - productPrice * productQty;
      const a8 = Math.round((a7 + 0.001) * 100) / 100;
      console.log(a7, a8);
      this.totalPrice = a8;

      return this.save();
    }

  getProducts() {
    return Promise.resolve(this.products);
  }
};
