let Cart;
let Cartitem;
let Product;
let User;

const config = require('../util/config');
if (config.environment.dbType === config.environment.DB_SQLZ) {
  Cart = require('../models/cart-sqlize');
  CartItem = require('../models/cart-item-sqlize');
  Product = require('../models/product-sqlize');
  User = require('../models/user-sqlize');
} else {
  Cart = require('../models/cart-model');
  Product = require('../models/product-model');
  User = require('../models/user-model');
}
const uuidTools = require('../util/uuid-tools');

if (config.environment.dbType === config.environment.DB_SQLZ) {
  Product = require('../models/product-sqlize');
} else {
  Product = require('../models/product-model');
}

exports.getProducts = (req, res, next) => {
  if (config.environment.dbType === config.environment.DB_FILEDB) {
    Product.fetchAll(products => {
      // console.log("prods:", products);
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    });
  } else if (config.environment.dbType === config.environment.DB_JSONDB) {
    Product.fetchAll()
    .then(result => {
      res.render('shop/product-list', {
        prods: result.data,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(error => {
      console.log('getProducts: error:', error);
      res.status(500).json({
        message: "getProducts failed!",
        error: error
      });
    });
  } else if (config.environment.dbType === config.environment.DB_MYSQL) {
    Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render('shop/product-list', {
        prods: rows,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(error => {
      console.log('getProducts: error:', error);
      res.status(500).json({
        message: "getProducts failed!",
        error: error
      });
    });
  } else if (config.environment.dbType === config.environment.DB_SQLZ) {
    Product.findAll()
    .then(result => {
      console.log(result)
      res.render('shop/product-list', {
        prods: result,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(error => {
      console.log('getProducts: error:', error);
      res.status(500).json({
        message: "getProducts failed!",
        error: error
      });
    });
  } else if (config.environment.dbType === config.environment.DB_MOCKDB) {
    Product.fetchAll()
    .then(result => {
      res.render('shop/product-list', {
        prods: result.data.products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(error => {
      console.log('getProducts: error:', error);
      res.status(500).json({
        message: "getProducts failed!",
        error: error
      });
    });
  } else {
    console.log('getProducts: request dbtype:"' + config.environment.dbType + '" not supported');
}
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  if (config.environment.dbType === config.environment.DB_FILEDB) {
  Product.findById(prodId, product => {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products'
    });
  });
  } else if (config.environment.dbType === config.environment.DB_MYSQL) {
  Product.findById(prodId)
    .then(([product]) => {
      res.render('shop/product-detail', {
        product: product[0],
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(error => {
      console.log('getProduct: error:', error);
      res.status(500).json({
        message: "getProduct failed!",
        error: error
      });
    });
  } else if (config.environment.dbType === config.environment.DB_SQLZL) {
    Product.findByPk(prodId)
      .then( product => {
        res.render('shop/product-detail', {
          product: product,
          pageTitle: product.title,
          path: '/products'
        });
      })
      .catch(error => {
        console.log('getProduct: error:', error);
        res.status(500).json({
          message: "getProduct failed!",
          error: error
        });
      });
  
      // Product.findAll({ where: { id: prodId } })
      // .then(products => {
      //   res.render('shop/product-detail', {
      //     product: products[0],
      //     pageTitle: products[0].title,
      //     path: '/products'
      //   });
      // })
      // .catch(err => console.log(err));
    } else if (config.environment.dbType === config.environment.DB_MOCKDB ||
      config.environment.dbType === config.environment.DB_JSONDB) {
      Product.findById(prodId)
      .then((result) => {
        console.log(result.data);
        const product = result.data;
        res.render('shop/product-detail', {
          product: product,
          pageTitle: product.title,
          path: '/products'
        });
      })
      .catch(error => {
        console.log('getProduct: error:', error);
        res.status(500).json({
          message: "getProduct failed!",
          error: error
        });
      });
    } else {
    console.log('getProduct: request dbtype:"' + config.environment.dbType + '" not supported');
}
};

exports.getIndex = (req, res, next) => {
  if (config.environment.dbType === config.environment.DB_FILEDB) {
    Product.fetchAll(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    });
  } else if (config.environment.dbType === config.environment.DB_MYSQL) {
    Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render('shop/index', {
        prods: rows,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(error => {
      console.log('getIndex: error:', error);
      res.status(500).json({
        message: "getIndex failed!",
        error: error
      });
    });
  } else if (config.environment.dbType === config.environment.DB_JSONDB) {
    Product.fetchAll()
    .then(result => {
      // console.log(result.data);
      res.render('shop/index', {
        prods: result.data,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(error => {
      console.log('getIndex: error:', error);
      res.status(500).json({
        message: "getIndex failed!",
        error: error
      });
    });
  } else if (config.environment.dbType === config.environment.DB_SQLZ) {
    Product.findAll()
    .then(result => {
      // console.log(result);
      res.render('shop/index', {
        prods: result,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(error => {
      console.log('getIndex: error:', error);
      res.status(500).json({
        message: "getIndex failed!",
        error: error
      });
    });
  } else if (config.environment.dbType === config.environment.DB_MOCKDB) {
    Product.fetchAll()
    .then(result => {
      // console.log(result);
      res.render('shop/index', {
        prods: result.data.products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(error => {
      console.log('getIndex: error:', error);
      res.status(500).json({
        message: "getIndex failed!",
        error: error
      });
    });
  } else {
    console.log('getIndexProduct: request dbtype:"' + config.environment.dbType + '" not supported');
  } 
};

exports.getCart = (req, res, next) => {
if (config.environment.dbType === config.environment.DB_SQLZ) {
  req.user
    .getCart()
    .then(cart => {
     console.log('req.user:', Object.keys(cart.__proto__));
      return cart
        .getProducts()
        .then(products => {
          console.log(products);
          res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products: products
          });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
  } else if (config.environment.dbType === config.environment.DB_MOCKDB ||
    config.environment.dbType === config.environment.DB_JSONDB) {
    User.getByEmail(req.user.email)
    .then( user => { // nesting so we can reference the context variables
      user.getCart()
      .then(cart => {
        Product.fetchAll()
        .then(products => {
          const cartProducts = [];
          if (products) {
            for (product of products) {
              console.log('product:', product);
              const cartProductData = cart.products.find(
                prod => prod.id === product.id
              );
              if (cartProductData) {
                console.log('product:', cartProductData, ' is in cart');
                cartProducts.push({ productData: product, qty: cartProductData.qty });
              }
            }
            // if nothing found, return the empty cartProducts
            return res.render('shop/cart', {
              path: '/cart',
              pageTitle: 'Your Cart',
              products: cartProducts
            });
          }  
        }) 
      });
    })  
    .catch(error => {
      console.log('getCart: error:', error);
      res.status(500).json({
        message: "getCart failed!",
        error: error
      });
    });
  } else if (config.environment.dbType === config.environment.DB_FILEDB) {
    Cart.getCart((cart, err1) => {
      if (cart) {
        Product.fetchAll((products, err2) => {
          const cartProducts = [];
          if (products) {
            for (product of products) {
              console.log('product:', product);
              const cartProductData = cart.products.find(
                prod => prod.id === product.id
              );
              if (cartProductData) {
                console.log('product:', cartProductData, ' is in cart');
                cartProducts.push({ productData: product, qty: cartProductData.qty });
              }
            }
            // if nothing found, return the empty cartProducts
            return res.render('shop/cart', {
              path: '/cart',
              pageTitle: 'Your Cart',
              products: cartProducts
            });
          } else {
            console.log('getCart: error:', err2);
            res.status(500).json({
              message: "getCart failed!",
              error: error
            });
          }
        });
      } else {
        console.log('getCart: error:', err1);
        res.status(500).json({
          message: "getCart failed!",
          error: error
        });
      }
    });
  } else {
    console.log('getCart: request dbtype:"' + config.environment.dbType + '" not supported');
  }
};

exports.postCart = (req, res, next) => {
  if (config.environment.dbType === config.environment.DB_JSONDB ||
    config.environment.dbType === config.environment.DB_MOCKDB ||
    config.environment.dbType === config.environment.DB_MYSQL  ||
    config.environment.dbType === config.environment.DB_FILEDB) {
    const userId = req.user.userId; 
    const prodId = req.body.productId;
    let fetchedCart;  // if we chain .then() we need this set
    User.findById(userId)
    .then(user => {
      user.getCart()
      .then(cart => {
        fetchedCart = cart;
        Product.findById(prodId)
        .then(product => {
          cart.addProduct(prodId, product.price);
          res.redirect('/cart');
        })
      })
    })
    .catch(error => {
      console.log('postCart: error:', error);
      res.status(500).json({
        message: "postCart failed!",
        error: error
      });
    });
  } else if (config.environment.dbType === config.environment.DB_SQLZ) {
    const prodId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;
    req.user
      .getCart()
      .then(cart => {
        fetchedCart = cart;
        return cart.getProducts({ where: { id: prodId } });
      })
      .then(products => {
        let product;
        if (products.length > 0) {
          product = products[0];
        }
  
        if (product) {
          const oldQuantity = product.cartItem.quantity;
          newQuantity = oldQuantity + 1;
          return product;
        }
        return Product.findByPk(prodId);
      })
      .then(product => {
        return fetchedCart.addProduct(product, {
          through: { quantity: newQuantity }
        });
      })
      .then(() => {
        res.redirect('/cart');
      })
      .catch(err => console.log(err));
    } else {
    const eMsg = 'postCart: request dbtype:"' + config.environment.dbType + '" not supported';
    console.log(eMsg);
    return Promise.resolve({ error: eMsg});
  }
};

exports.postCartDeleteProduct = (req, res, next) => {
  if (config.environment.dbType === config.environment.DB_JSONDB ||
    config.environment.dbType === config.environment.DB_MOCKDB ||
    config.environment.dbType === config.environment.DB_MYSQL  ||
    config.environment.dbType === config.environment.DB_FILEDB) {
    console.log('postCartDeleteProduct', req.body.productId);
    console.log('postCartDeleteProduct', req.user);
    const prodId = req.body.productId;
    const user = new User(req.user.email, 'password', req.user.name, req.user.id);
    user.getCart()
    .then(cart => {
      Product.findById(prodId, product => {
        console.log('found:', product);
        cart.deleteProduct(prodId, product.price);
        res.redirect('/cart');
      });
    })
    .catch(error => {
      console.log('postCartDeleteProduct: error:', error);
      res.status(500).json({
        message: "postCartDeleteProduct failed!",
        error: error
      });
    });
  } else if (config.environment.dbType === config.environment.DB_SQLZ) {
    const prodId = req.body.productId;
    req.user
      .getCart()
      .then(cart => {
        return cart.getProducts({ where: { id: prodId } });
      })
      .then(products => {
        const product = products[0];
        return product.cartItem.destroy();
        // since we don't store the total, we don't have to adjust it
      })
      .then(result => {
        res.redirect('/cart');
      })
      .catch(error => {
        console.log('postCartDeleteProduct: error:', error);
        res.status(500).json({
          message: "postCartDeleteProduct failed!",
          error: error
        });
      });
  } else {
    const eMsg = 'postCartDeleteProduct: request dbtype:"' + config.environment.dbType + '" not supported';
    console.log(eMsg);
    return Promise.resolve({ error: eMsg});
  }  
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      return req.user
        .createOrder()
        .then(order => {
          return order.addProducts(
            products.map(product => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch(err => console.log(err));
    })
    .then(result => {
      return fetchedCart.setProducts(null);
    })
    .then(result => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({include: ['products']})
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err => console.log(err));
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
