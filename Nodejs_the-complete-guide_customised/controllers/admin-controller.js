const Product = require('../models/product-model');
const Cart = require('../models/cart-model');
const config = require('../util/config');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(null, title, imageUrl, description, price);
  if (config.environment.dbType === config.environment.DB_FILEDB) {
    product.create((result, err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.redirect('/admin/add-product');
    }
  });
  } else if (config.environment.dbType === config.environment.DB_MYSQL ||
             config.environment.dbType === config.environment.DB_MOCKDB) {
    product.create()
      .then(result => {
        console.log(result);
        res.redirect('/admin/add-product');
      })
      .catch(err => {
        console.log(err);
      });
  } else {
    product.create()
      .then(result => {
        console.log(result);
        res.redirect('/admin/add-product');
      })
      .catch(err => {
        console.log(err);
      });
  }
  // res.redirect('/admin/add-product');
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  console.log('prodid:', prodId);
  if (config.environment.dbType === config.environment.DB_FILEDB) {
    Product.findById(prodId, (product, err) => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      });
    });
  } else if (config.environment.dbType === config.environment.DB_MYSQL) {
    Product.findById(prodId)
      .then(([product]) => {
        console.log('result:', product);
        res.render('admin/edit-product', {
          pageTitle: 'Edit Product',
          path: '/admin/edit-product',
          editing: editMode,
          product: product[0]
        });
      })
      .catch(err => console.log(err));
    } else if (config.environment.dbType === config.environment.DB_MOCKDB) {
      Product.findById(prodId)
      .then((result) => {
        console.log('result.data:', result.data);
        const product = result.data.product;
          res.render('admin/edit-product', {
          pageTitle: 'Edit Product',
          path: '/admin/edit-product',
          editing: editMode,
          product: product
        });
      })
      .catch(err => console.log(err));
    } else {
      console.log('getEditProduct: request dbtype"' + config.environment.dbType + '" not supported');
    }
};

exports.getProducts = (req, res, next) => {
  if (config.environment.dbType === config.environment.DB_FILEDB) {
    Product.fetchAll(products => {
      // console.log("prods:", products);
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    });
  } else if (config.environment.dbType === config.environment.DB_MYSQL) {
    Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render('admin/products', {
        prods: rows,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => console.log(err));
  } else if (config.environment.dbType === config.environment.DB_MOCKDB) {
    Product.fetchAll()
    .then(result => {
      res.render('admin/products', {
        prods: result.data.products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => console.log(err));
  }
};

exports.postDeleteProduct = (req, res, next) => {
  console.log('postDeleteProduct', req.body);
  const prodId = req.body.productId;
  if (config.environment.dbType === config.environment.DB_FILEDB) {
    Product.deleteById(prodId, (result, error) => {
    if (error) {
      console.log('postDeleteProduct: error:', error);
      res.status(500).json({
        message: "Deleting product failed!",
        error: error
      });
    } else {  // the whole deleted item is returned - allow chaining of deletes
      console.log(result);
      if (result.n > 0) {
        // Product.deleteImage(product.id.imageToDelete);
        // Cart.deleteProduct(data.id.id, data.id.price);
        res.status(200).redirect("/admin/products");
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    }
  });
  } else if (config.environment.dbType === config.environment.DB_MYSQL) {
    Product.deleteById(prodId)
    .then(([result]) => {
      console.log(result);
      // Cart.deleteProduct(result.data.id[0].id, result.id[0].price);
      if (result.affectedRows > 0) {
        // Product.deleteImage(product.id.imageToDelete);
        // Cart.deleteProduct(data.id.id, data.id.price);
        res.status(200).redirect("/admin/products");
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      console.log('postDeleteProduct: error:', error);
      res.status(500).json({
        message: "Deleting product failed!",
        error: error
      });
    });
  } else if (config.environment.dbType === config.environment.DB_MOCKDB) {
    Product.deleteById(prodId)
    .then(result => {
      const data = result.data.result;

      if (data.n > 0) {
        // Product.deleteImage(product.id.imageToDelete);
        // Cart.deleteProduct(data.id.id, data.id.price);
        res.status(200).redirect("/admin/products");
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      console.log('postDeleteProduct: error:', error);
      res.status(500).json({
        message: "Deleting product failed!",
        error: error
      });
    });
  }
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  const updatedProduct = new Product(
    prodId,
    updatedTitle,
    updatedImageUrl,
    updatedDesc,
    updatedPrice
  );
  if (config.environment.dbType === config.environment.DB_FILEDB) {
    updatedProduct.update((result, err) => {
    if (err) {
      console.log('postEditProduct: error:', err);
      res.status(500).json({
        message: "Saving product failed!",
        error: error
      });
    } else {
      console.log(result);
      res.redirect('/admin/products');
    }
  });
  } else if (config.environment.dbType === config.environment.DB_MYSQL ||
    config.environment.dbType === config.environment.DB_MOCKDB) {
    // console.log('admin-controller:updatedProduct:', updatedProduct);
    updatedProduct.update()
      .then(result => {
        console.log(result);
        res.redirect('/admin/products');
      })
      .catch(error => {
        console.log('postEditProduct: error:', error);
        res.status(500).json({
          message: "Saving product failed!",
          error: error
        });
      });
  } else {
    updatedProduct.update()
      .then(result => {
        console.log(result);
        res.redirect('/admin/products');
      })
      .catch(error => {
        console.log('postEditProduct: error:', error);
        res.status(500).json({
          message: "Saving product failed!",
          error: error
        });
      });
  }
};

======================  shop-controller.js  =========================
const Product = require('../models/product-model');
const config = require('../util/config');
const Cart = require('../models/cart-model');

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
  } else if (config.environment.dbType === config.environment.DB_MYSQL) {
    Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render('shop/product-list', {
        prods: rows,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => console.log(err));
  } else if (config.environment.dbType === config.environment.DB_MOCKDB) {
    Product.fetchAll()
    .then(result => {
      res.render('shop/product-list', {
        prods: result.data.products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => console.log(err));
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
    .catch(err => console.log(err));
  } else if (config.environment.dbType === config.environment.DB_MOCKDB) {
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
    .catch(err => console.log(err));
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
    .catch(err => console.log(err));
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
    .catch(err => console.log(err));
  }
};

exports.getCart = (req, res, next) => {
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
        }
        // if nothing found, return the empty cartProducts
        return res.render('shop/cart', {
          path: '/cart',
          pageTitle: 'Your Cart',
          products: cartProducts
        });
      });
    } else {
      console.log(err1);
      return (err1);
    }
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect('/cart');
};

exports.postCartDeleteProduct = (req, res, next) => {
  console.log('postCartDeleteProduct', req.body.productId);
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    console.log('found:', product);
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/cart');
  });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
