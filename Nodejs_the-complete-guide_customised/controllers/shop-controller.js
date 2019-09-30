let Cart;
let Cartitem;
let Order;
let Product;
let User;

const config = require('../util/config');
if (config.environment.dbType === config.environment.DB_SQLZ) {
  Cart = require('../models/cart-sqlize');
  CartItem = require('../models/cart-item-sqlize');
  Product = require('../models/product-sqlize');
  User = require('../models/user-sqlize');
} else if (config.environment.dbType === config.environment.DB_MONGOOSE) {
  Cart = require('../models/cart-mongoose');
  Product = require('../models/product-mongoose');
  User = require('../models/user-mongoose');
} else {
  Cart = require('../models/cart-model');
  Order = require('../models/order-model');
  Product = require('../models/product-model');
  User = require('../models/user-model');
}
const uuidTools = require('../util/uuid-tools');

exports.getProducts = (req, res, next) => {
  if (config.environment.dbType === config.environment.DB_FILEDB) {
    Product.fetchAll(products => {
      // console.log("prods:", products);
      return res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    });
  } else if (config.environment.dbType === config.environment.DB_JSONDB ||
             config.environment.dbType === config.environment.DB_MOCKDB)  {
    Product.fetchAll()
    .then(result => {
      res.render('shop/product-list', {
        prods: result.data,
        pageTitle: 'All Products',
        path: '/products',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(error => {
      console.log('getProducts: error:', error);
      res.status(500).json({
        message: "getProducts failed!",
        error: error
      });
    });
  } else if (config.environment.dbType === config.environment.DB_MONGOOSE) {
    Product.find()
    .then(products => {
      const p = products.map(product => {
        product.id = product._id;
        return product;
      });
      const isLoggedIn = (req.session && req.session.isLoggedIn === true)
      res.render('shop/product-list', {
        prods: p,
        pageTitle: 'All Products',
        path: '/products',
        isAuthenticated: isLoggedIn
      });
    })
    .catch(error => {
      console.log('getProducts: error:', error, error.message);
      return res.status(500).json({
        message: "getProducts failed!",
        error: error
      });
    });
  } else if (config.environment.dbType === config.environment.DB_MONGODB) {
    Product.fetchAll()
    .then(result => {
      res.render('shop/product-list', {
        prods: result,
        pageTitle: 'All Products',
        path: '/products',
        isAuthenticated: req.session.isLoggedIn
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
  } else {
    console.log('getProducts: request dbtype:"' + config.environment.dbType + '" not supported');
  }
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  if (config.environment.dbType === config.environment.DB_FILEDB) {
  Product.findById(prodId, product => {
    return res.render('shop/product-detail', {
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
    } else if (config.environment.dbType === config.environment.DB_MONGODB ||
               config.environment.dbType === config.environment.DB_MONGOOSE) {
      Product.findById(prodId)
      .then(product => {
        if (config.environment.dbType === config.environment.DB_MONGOOSE) {
          product.id = product._id;
        }
        res.render('shop/product-detail', {
          product: product,
          pageTitle: product.title,
          path: '/products',
          isAuthenticated: req.session.isLoggedIn
        });
      })
      .catch(error => {
        console.log('getProduct: error:', error);
        res.status(500).json({
          message: "getProduct failed!",
          error: error
        });
      });
    } else if (config.environment.dbType === config.environment.DB_MOCKDB ||
      config.environment.dbType === config.environment.DB_JSONDB) {
      Product.findById(prodId)
      .then((result) => {
        console.log(result.data);
        const product = result.data;
        res.render('shop/product-detail', {
          product: product,
          pageTitle: product.title,
          path: '/products',
          isAuthenticated: req.session.isLoggedIn
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
      return res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    });
  } else if (config.environment.dbType === config.environment.DB_MONGODB) {
    Product.fetchAll()
    .then(result => {
      // console.log(result);
      res.render('shop/index', {
        prods: result,
        pageTitle: 'Shop',
        path: '/',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(error => {
      console.log('getIndex: error:', error);
      res.status(500).json({
        message: "getIndex failed!",
        error: error
      });
    });
  } else if (config.environment.dbType === config.environment.DB_MONGOOSE) {
    Product.find()
    .then(products => {
      const p = products.map(product => {
        product.id = product._id;
        return product;
      });
      res.render('shop/index', {
        prods: p,
        pageTitle: 'Shop',
        path: '/',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(error => {
      console.log('getIndex: error:', error, error.message);
      res.status(500).json({
        message: "getIndex failed!",
        error: error
      });
    });
  } else if (config.environment.dbType === config.environment.DB_JSONDB ||
             config.environment.dbType === config.environment.DB_MOCKDB) {
    Product.fetchAll()
    .then(result => {
      // console.log(result.data);
      res.render('shop/index', {
        prods: result.data,
        pageTitle: 'Shop',
        path: '/',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(error => {
      console.log('getIndex: error:', error);
      res.status(500).json({
        message: "getIndex failed!",
        error: error
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
  } else {
    console.log('getIndexProduct: request dbtype:"' + config.environment.dbType + '" not supported');
  } 
};

exports.getCart = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    error = new Error('You are not logged');
    console.log('getCart: error:', error);
    return res.status(401).json({
      message: "You must login for this action.",
      error: error
    });
  }
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
  } else if (config.environment.dbType === config.environment.DB_MONGOOSE) {
    console.log('shop.getCart:req.user:', req.user);
    const user = req.user; // new User(req.user);  // the mongoose object retains all its functions
    user.getCart()
    .then(cart => {
      cart.populate('products.id')
      .execPopulate()  // this returns the promise that can go to the then
      .then( pCart => {
        console.log('cart.getCart:populate', pCart.products);
        const cartProducts = [];
        if (pCart.products && pCart.products.length > 0) {
          for (product of pCart.products) {
            product.id.id = product.id._id;
            console.log('product:', product, product.id);
            cartProducts.push({ productData: product.id, qty: product.qty });
          }
        }
        return res.render('shop/cart', {
          path: '/cart',
          pageTitle: 'Your Cart',
          products: cartProducts,
          isAuthenticated: req.session.isLoggedIn
        });
      })
    })
    .catch(error => {
      console.log('getCart: error:', error);
      res.status(500).json({
        message: "getCart failed!",
        error: error
      });
    });

  } else if (config.environment.dbType === config.environment.DB_MOCKDB ||
    config.environment.dbType === config.environment.DB_JSONDB || 
    config.environment.dbType === config.environment.DB_MONGODB) {
      const user = User.factory(req.user);
      user.getCart()
      .then(cart => {
        Product.fetchAll()
        .then(products => {
          const cartProducts = [];
          if (products) {
            if (cart.products.length > 0) {
              let cartProductData;
              for (product of products) {
                console.log('product:', product);
                cartProductData = cart.products.find(p => {
                  if (config.environment.dbType === config.environment.DB_MONGODB) {
                    // console.log(p.id+'' === product._id+'', p.id);
                    return p.id+'' === product._id.toString();
                  } else {
                    // console.log(p.id+'' === product.id+'', p.id);
                    return p.id='' === product.id.toString();
                  }
                });
                if (cartProductData) {
                  console.log('product:', cartProductData, ' is in cart');
                  cartProducts.push({ productData: Product.factory(product), qty: cartProductData.qty });
                }
              }
            }
            // if nothing found, return the empty cartProducts
            return res.render('shop/cart', {
              path: '/cart',
              pageTitle: 'Your Cart',
              products: cartProducts,
              isAuthenticated: req.session.isLoggedIn
            });
          }  
        }) 
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
  if (!req.session.isLoggedIn) {
    error = new Error('You are not logged in');
    console.log('postCart: error:', error);
    return res.status(401).json({
      message: "You must login for this action.",
      error: error
    });
  }

  if (config.environment.dbType === config.environment.DB_JSONDB ||
      config.environment.dbType === config.environment.DB_MONGODB ||
      config.environment.dbType === config.environment.DB_MOCKDB ||
      config.environment.dbType === config.environment.DB_MYSQL  ||
      config.environment.dbType === config.environment.DB_FILEDB) {
    console.log('postCart:', req.user, 'product:', req.body);
    const prodId = req.body.productId;
    // let fetchedCart;  // if we chain .then() we need this set
    let fetchedUser = User.factory(req.user);
    // console.log('fetchedUser:', fetchedUser);
    return Product.findById(prodId)
    .then(product => {
      // console.log('shop-controller.postCart:with product:', product);
      return fetchedUser.addToCart(product)
      .then(result => {
        // console.log('shop-controller.postCart:result', result);
        res.redirect('/cart');
      });
    })
    .catch(error => {
      console.log('postCart: error:', error);
      res.status(500).json({
        message: "postCart failed!",
        error: error
      });
    });
  } else if (config.environment.dbType === config.environment.DB_MONGOOSE) {
    console.log('postCart:', req.user, 'product:', req.body);
    const prodId = req.body.productId;
    // let fetchedCart;  // if we chain .then() we need this set
    const fetchedUser = new User(req.user);
    console.log('shop-controller.postCart:fetchedUser:', fetchedUser);
    return Product.findById(prodId)
    .then(product => {
      console.log('shop-controller.postCart:with product:', product);
      return fetchedUser.addToCart(product)
      .then(result => {
        // console.log('shop-controller.postCart:result', result);
        res.redirect('/cart');
      });
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
  if (!req.session.isLoggedIn) {
    error = new Error('You are not logged in');
    console.log('postCartDeleteProduct: error:', error);
    return res.status(401).json({
      message: "You must login for this action.",
      error: error
    });
  }
  if (config.environment.dbType === config.environment.DB_JSONDB ||
    config.environment.dbType === config.environment.DB_MONGODB ||
    config.environment.dbType === config.environment.DB_MOCKDB ||
    config.environment.dbType === config.environment.DB_MYSQL  ||
    config.environment.dbType === config.environment.DB_FILEDB) {
    console.log('postCartDeleteProduct', req.body.productId);
    console.log('postCartDeleteProduct', req.user);
    const prodId = req.body.productId;
    const user = User.factory(req.user);
    user.getCart()
    .then(cart => {
      let realCart = Cart.factory(cart);
      console.log('postCartDeleteProduct:realcart:', realCart);
      Product.findById(prodId).then(product => {
        console.log('postCartDeleteProduct:found:', product);
        realCart.deleteProduct(prodId, product.price)
        .then(result => {
          console.log(result);
          res.redirect('/cart');
        })
        .catch(error => {
          console.log('postCartDeleteProduct: error:', error);
          res.status(500).json({
            message: "postCartDeleteProduct failed!",
            error: error
          });
        });  
      });
    })
    .catch(error => {
      console.log('postCartDeleteProduct: error:', error);
      res.status(500).json({
        message: "postCartDeleteProduct failed!",
        error: error
      });
    });
  } else if (config.environment.dbType === config.environment.DB_MONGOOSE) {
    console.log('postCartDeleteProduct', req.body.productId);
    console.log('postCartDeleteProduct', req.user);
    const prodId = req.body.productId;
    req.user
      .removeFromCart(prodId)
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
  if (!req.session.isLoggedIn) {
    error = new Error('You are not logged in');
    console.log('postOrder: error:', error);
    return res.status(401).json({
      message: "You must login for this action.",
      error: error
    });
  }
  // let fetchedCart;
  let realUser;
  if (config.environment.dbType === config.environment.DB_JSONDB ||
      config.environment.dbType === config.environment.DB_MONGODB) {
    realUser = User.factory(req.user);
  } else if (config.environment.dbType === config.environment.DB_MONGOOSE) {
    realUser = new User(req.user);
  } else {
    const eMsg = 'postCartDeleteProduct: request dbtype:"' + config.environment.dbType + '" not supported';
    console.log(eMsg);
    return Promise.resolve({ error: eMsg});
  }  

  return realUser.addOrder()
    .then(result => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    error = new Error('You are not logged in');
    console.log('getOrders: error:', error);
    return res.status(401).json({
      message: "You must login for this action.",
      error: error
    });
  }

  let realUser;
  let realOrders;
  if (config.environment.dbType === config.environment.DB_JSONDB ||
    config.environment.dbType === config.environment.DB_MONGODB) {
    realUser = User.factory(req.user);
  // not mongoose, get the product data
  realUser
    .getOrders()     // {include: ['products']})
    .then(orders => {
      console.log('getOrders:', orders);
      if (orders.length <= 0) {
        res.render('shop/orders', {
          path: '/orders',
          pageTitle: 'Your Orders',
          orders: orders,
          isAuthenticated: req.session.isLoggedIn
        });
      }
      // console.log('order.items:', orders[0].items);
      realOrders = orders;
      // return orders;
      return Product.fetchAll();
    })
    .then(products => {
        console.log('products:', products, 'realOrders:', realOrders, 'this.realOrders:', this.realOrders);
        if (products) {
          console.log('got products');
          if (realOrders && realOrders.length > 0) {
            console.log('got orders');
            if (config.environment.dbType === config.environment.DB_MONGODB) {
              for (order of realOrders) {
                order.id = order._id.toString();
              }  
            }
            let orderItemData; let idx;
            for (product of products) {
              console.log('product:', product);
              for (order of realOrders) {
                orderItemData = order.items.find(p => {
                  if (config.environment.dbType === config.environment.DB_MONGODB) {
                    console.log(p.id+'' === product._id+'', p.id);
                    return p.id+'' === product._id.toString();
                  } else {
                    // console.log(p.id+'' === product.id+'', p.id);
                    return p.id='' === product.id.toString();
                  }
                });
                if (orderItemData) {
                  orderItemData.title = product.title;
                  orderItemData.price = product.price;
                  idx = order.items.find(p => {
                    if (config.environment.dbType === config.environment.DB_MONGODB) {
                      return p.id+'' === product._id.toString();
                    } else {
                      return p.id='' === product.id.toString();
                    }
                  });
                  order.items[idx] = orderItemData;
                }
              }
            }
          }
          return realOrders;
        }  
        return realOrders;
    })
    .then(result => {
      console.log('result:', result);
      console.log('realOrders:', realOrders);
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: realOrders,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
  } else if (config.environment.dbType === config.environment.DB_MONGOOSE) {
    realUser = new User(req.user);
    return realUser.getOrders()     // includes product data via populate)
    .then(result => {
      console.log('result:', result);
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: result,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(error => {
      console.log('shop.getOrders: error:', error);
      res.status(500).json({
        message: "shop.getOrders failed!",
        error: error
      });
    })
  } else {
    const eMsg = 'postCartDeleteProduct: request dbtype:"' + config.environment.dbType + '" not supported';
    console.log(eMsg);
    return Promise.resolve({ error: eMsg});
  }  

};

exports.getCheckout = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    error = new Error('You are not logged');
    console.log('getCart: error:', error);
    return res.status(401).json({
      message: "You must login for this action.",
      error: error
    });
  }

  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
    isAuthenticated: req.session.isLoggedIn
  });
};
