const fs = require('fs');
const path = require('path');
const pathUtil = require('../util/path-util');
const PDFDocument = require('pdfkit');

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
  Order = require('../models/order-mongoose');
  Product = require('../models/product-mongoose');
  User = require('../models/user-mongoose');
} else {
  Cart = require('../models/cart-model');
  Order = require('../models/order-model');
  Product = require('../models/product-model');
  User = require('../models/user-model');
}
const uuidTools = require('../util/uuid-tools');

const ITEMS_PER_PAGE = 3;


exports.getProducts = (req, res, next) => {
  const userName = req.session.userEmail;
  const page = +req.query.page || 1;
  let totalItems;
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
        path: '/products'
      });
    })
    .catch(err => {
      console.log('getProducts: error:', err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  } else if (config.environment.dbType === config.environment.DB_MONGOOSE) {
    Product.find()
      .countDocuments()
      .then(numProducts => {
        totalItems = numProducts;
        return Product.find()
          .skip((page - 1) * ITEMS_PER_PAGE)
          .limit(ITEMS_PER_PAGE);
      })
      .then(products => {
        res.render('shop/product-list', {
          prods: products,
          pageTitle: 'Products',
          path: '/products',
          currentPage: page,
          hasNextPage: ITEMS_PER_PAGE * page < totalItems,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
        });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
    } else if (config.environment.dbType === config.environment.DB_MONGODB) {
    Product.fetchAll()
    .then(result => {
      res.render('shop/product-list', {
        prods: result,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => {
      console.log('getProducts: error:', err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
    .catch(err => {
      console.log('getProducts: error:', err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
    .catch(err => {
      console.log('getProducts: error:', err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  } else {
    const err = 'getProducts: request dbtype:"' + config.environment.dbType + '" not supported';
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  const userName = req.session.userEmail;
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
    .catch(err => {
      console.log('getProduct: error:', err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
      .catch(err => {
        console.log('getProduct: error:', err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
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
          path: '/products'      
        });
      })
      .catch(err => {
        console.log('getProduct: error:', err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
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
        path: '/products'
      });
    })
    .catch(err => {
      console.log('getProduct: error:', err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  } else {
    const err = 'getProduct: request dbtype:"' + config.environment.dbType + '" not supported';
    console.log('getProduct: error:', err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getIndex = (req, res, next) => {
  const userName = req.session.userEmail;
  const page = +req.query.page || 1;
  let totalItems;

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
        path: '/'
      });
    })
    .catch(err => {
      console.log('getIndex: error:', err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  } else if (config.environment.dbType === config.environment.DB_MONGOOSE) {
    Product.find()
    .countDocuments()
    .then(numProducts => {
      totalItems = numProducts;
      return Product.find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
    })
    .then(products => {
      const p = products.map(product => {
        product.id = product._id;
        return product;
      });
      res.render('shop/index', {
        prods: p,
        pageTitle: 'Shop',
        path: '/',
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
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
        path: '/'
      });
    })
    .catch(err => {
      console.log('getIndex: error:', err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
    .catch(err => {
      console.log('getIndex: error:', err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
    .catch(err => {
      console.log('getIndex: error:', err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  } else {
    const err = 'getIndexProduct: request dbtype:"' + config.environment.dbType + '" not supported';
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  } 
};

exports.getCart = (req, res, next) => {
  const userName = req.session.userEmail;
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
        .catch(err => {
          console.log('getCart: error:', err);
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });
      })
      .catch(err => {
        console.log('getCart: error:', err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
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
          products: cartProducts
        });
      })
    })
    .catch(err => {
      console.log('getCart: error:', err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
              products: cartProducts
            });
          }  
        }) 
      })
      .catch(err => {
        console.log('getCart: error:', err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
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
            const error = new Error(err2);
            error.httpStatusCode = 500;
            return next(error);
          }
        });
      } else {
        console.log('getCart: error:', err1);
        const error = new Error(err1);
        error.httpStatusCode = 500;
        return next(error);
      }
    });
  } else {
    console.log('getCart: request dbtype:"' + config.environment.dbType + '" not supported');
  }
};

exports.postCart = (req, res, next) => {
  const userName = req.session.userEmail;
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
    .catch(err => {
      console.log('postCart: error:', err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
    .catch(err => {
      console.log('postCart: error:', err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
      .catch(err => {
        console.log('postCart: error:', err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  } else {
    const eMsg = 'postCart: request dbtype:"' + config.environment.dbType + '" not supported';
    console.log(eMsg);
    const error = new Error(eMsg);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postCartDeleteProduct = (req, res, next) => {
  const userName = req.session.userEmail;
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
        .catch(err => {
          console.log('postCartDeleteProduct: error:', err);
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });
      });
    })
    .catch(err => {
      console.log('postCartDeleteProduct: error:', err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
      .catch(err => {
        console.log('postCartDeleteProduct: error:', err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
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
      .catch(err => {
        console.log('postCartDeleteProduct: error:', err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  } else {
    const eMsg = 'postCartDeleteProduct: request dbtype:"' + config.environment.dbType + '" not supported';
    console.log(eMsg);
    const error = new Error(eMsg);
    error.httpStatusCode = 500;
    return next(error);
  }  
};

exports.postOrder = (req, res, next) => {
  const userName = req.session.userEmail;
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
    .catch(err => {
      console.log('postOrder: error:', err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getOrders = (req, res, next) => {
  const userName = req.session.userEmail;
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
          orders: orders
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
        orders: realOrders
      });
    })
    .catch(err => {
      console.log('getOrders: error:', err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  } else if (config.environment.dbType === config.environment.DB_MONGOOSE) {
    realUser = new User(req.user);
    return realUser.getOrders()     // includes product data via populate)
    .then(result => {
      console.log('result:', result);
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: result
      });
    })
    .catch(err => {
      console.log('getOrders: error:', err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  } else {
    const eMsg = 'postCartDeleteProduct: request dbtype:"' + config.environment.dbType + '" not supported';
    console.log(eMsg);
    const error = new Error(eMsg);
    error.httpStatusCode = 500;
    return next(error);
  }  

};

exports.getCheckout = (req, res, next) => {
  const userName = req.session.userEmail;
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  console.log('getInvoice:', orderId, 'req.user:', req.user);
  Order.findById(orderId)
    .then(order => {
      if (!order) {
        return next(new Error('No order found.'));
      }
      if (order.userId.toString() !== req.user._id.toString()) {
        return next(new Error('Unauthorized'));
      }
      const invoiceName = 'invoice-' + orderId + '.pdf';
      // const invoicePath = path.join('data', 'invoices', invoiceName);
      const invoicePath = path.join(pathUtil.mainDir, 'data', 'invoices', invoiceName);

      console.log('invoicePath:', invoicePath);
      // ** generate the file
      const pdfDoc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'inline; filename="' + invoiceName + '"'
      );
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      pdfDoc.fontSize(26).text('Invoice: ' + orderId, {
        underline: true
      });
      pdfDoc.text('      ');
      let totalPrice = 0;
      order.items.forEach(prod => {
        totalPrice += prod.qty * prod.price;
        pdfDoc
          .fontSize(14)
          .text(
            prod.title +
              ' - ' +
              prod.qty +
              ' x ' +
              '$' +
              prod.price +
              ' = ' +
              prod.qty * prod.price
          );
      });
      pdfDoc.text('---------------------------');
      pdfDoc.fontSize(20).text('Total Price: $' + totalPrice);

      pdfDoc.end();

      // ** serve the file as a stream
      // const file = fs.createReadStream(invoicePath);
      // res.setHeader('Content-Type', 'application/pdf');
      // res.setHeader(
      //   'Content-Disposition',
      //   'inline; filename="' + invoiceName + '"'
      // );
      // file.pipe(res);

      // ** serve the file as a complete entity
      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) {
      //     console.log('file read error:', req.user);
      //     return next(err);
      //   }
      //   // console.log('getInvoice: sending.');
      //   res.setHeader('Content-Type', 'application/pdf');
      //   res.setHeader(
      //     'Content-Disposition',
      //     'inline; filename="' + invoiceName + '"'
      //   );
      //   res.send(data);
      // });
    })
    .catch(err => {console.log(err); next(err)});
};
