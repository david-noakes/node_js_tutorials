const { check, validationResult } = require('express-validator');  // nextgen destructuring
// const fs = require('fs');
const fUtil = require('../util/file-util');
const globals = require('../util/global-vars');
// const path = require('path');
// const pathUtil = require('../util/path-util');

let Cart;
let mongoose;
let Product;
let Schema;
let User;

const config = require('../util/config');
if (config.environment.dbType === config.environment.DB_SQLZ) {
  Cart = require('../models/cart-sqlize');
  Product = require('../models/product-sqlize');
  User = require('../models/user-sqlize');
} else if (config.environment.dbType === config.environment.DB_MONGOOSE) {
  mongoose = require('mongoose');
  Schema = mongoose.Schema;
  Cart = require('../models/cart-mongoose');
  Product = require('../models/product-mongoose');
  User = require('../models/user-mongoose');
} else {
  Cart = require('../models/cart-model');
  Product = require('../models/product-model');
  User = require('../models/user-model');
}
const uuidTools = require('../util/uuid-tools');

exports.getAddProduct = (req, res, next) => {
  res.userName = req.session.userEmail;
  const userName = req.session.userEmail;
  console.log('sending admin/edit-product');
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: []
  });
};

exports.postAddProduct = (req, res, next) => {
  const userName = req.session.userEmail;

  console.log('req.body:', req.body, 'req.user:', req.user);
  const title = req.body.title;
  // const imageUrl = req.body.imageUrl;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  const createDate = globals.dateString();
  const userId  = req.user.id;
  if (!image) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description
      },
      errorMessage: 'Attached file is not an image (png, jpg, gif).',
      validationErrors: []
    });
  }
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/edit-product',
      editing: false,
      hasError: true,
      product: {
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description
      },
      errorMessage: null,
      validationErrors: errors.array()
    });
  }

  const url = req.protocol + '://' + req.get('host');
  // const imageUrl = image.path;  // this is the entire path on the file system
  const imageUrl = url + '/images/' + image.filename;
  console.log(imageUrl);

  let product;
  if (config.environment.dbType === config.environment.DB_SQLZ) {
    product = new Product(null, title, imageUrl, description, price, userId);
  } else if (config.environment.dbType === config.environment.DB_MONGOOSE) {
    product = new Product({
      // _id: new mongoose.Types.ObjectId('5d9e9eb2ca1d7d1c4c4d4ca7'),  //** deliberate duplicate key error */
      title: title,
      price: price,
      description: description,
      imageUrl: imageUrl,
      userId: req.user,
      createDate: createDate,
      modifyDate: createDate
    });
    console.log(product);
  } else {
    product = new Product(null, title, imageUrl, description, price, createDate, createDate, userId);
  }
  console.log('postAddProduct:', title, imageUrl, price, description, userId)
  console.log('req.user:', req.user);
  if (config.environment.dbType === config.environment.DB_FILEDB) {
    product.create((result, err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.redirect('/admin/add-product');
    }
  });
  } else if (config.environment.dbType === config.environment.DB_MOCKDB ||
      config.environment.dbType === config.environment.DB_JSONDB) {
    product.create()
    .then(result => {
      console.log('Created Product1:', result.status);
      console.log('Created Product2:', result.data);
      res.redirect('/admin/add-product');
      })
    .catch(err => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  } else if (config.environment.dbType === config.environment.DB_MONGODB) {
    product.create()
    .then(result => {
      console.log('Created Product:result.ops:', result.ops);
      // result.ops: [ Product ]
      console.log('Created Product:result.insertedCount:', result.insertedCount);
      console.log('Created Product:result.result:', result.result);
      // result.result: { n: 1, ok: 1 }
      res.redirect('/admin/add-product');
      })
    .catch(err => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  } else if (config.environment.dbType === config.environment.DB_MONGOOSE) {
    product
    .save()
    .then(result => {
      // console.log(result);
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
      // globals.putSessionData(req, 'error', err.message); // **** err.stack is too long for a message
      // res.redirect('/500');
      // return res.status(500).render('admin/edit-product', {
      //   pageTitle: 'Add Product',
      //   path: '/admin/add-product',
      //   editing: false,
      //   hasError: true,
      //   product: {
      //     title: title,
      //     imageUrl: imageUrl,
      //     price: price,
      //     description: description
      //   },
      //   errorMessage: 'Database operation failed, please try again.',
      //   validationErrors: []
      // });
    });
  } else if (config.environment.dbType === config.environment.DB_MYSQL) {
    product.create()
      .then(result => {
        console.log(result);
        res.redirect('/admin/add-product');
      })
      .catch(err => {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  } else if (config.environment.dbType === config.environment.DB_SQLZ) {
    const currentUser = req.user;
    // console.log('req.user:', Object.keys(currentUser.__proto__));
    req.user.createProduct({
        id: uuidTools.generateId('aaaaaaaaaaaaaaaa'),
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description
        // userId: userId 
      })
      .then(result => {
        console.log(result);
        res.redirect('/admin/add-product');
      })
      .catch(err => {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
    } else {
      const err = 'postAddProduct: request dbtype:"' + config.environment.dbType + '" not supported';
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
  }
};

exports.getEditProduct = (req, res, next) => {
  const userName = req.session.userEmail;
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
        product: product,
        hasError: false,
        errorMessage: null,
        validationErrors: []
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
          product: product[0],
          hasError: false,
          errorMessage: null,
          validationErrors: []  
        });
      })
      .catch(err => {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  } else if (config.environment.dbType === config.environment.DB_SQLZ) {
      // console.log('req.user:', Object.keys(req.user.__proto__));
      req.user.getProducts({where: {id: prodId}})   // select only for the user as owner
          .then( products => {
            const product = products[0];
            if (!product) {
              return res.redirect('/');
            }
            res.render('admin/edit-product', {
              pageTitle: 'Edit Product',
              path: '/admin/edit-product',
              editing: editMode,
              product: product,
              hasError: false,
              errorMessage: null,
              validationErrors: []      
            });
        })
        .catch(err => {
          console.log(err);
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });
    } else if (config.environment.dbType === config.environment.DB_JSONDB) {
        Product.findById(prodId)
        .then((result) => {
          console.log('result.data:', result.data);
          const product = result.data;
          if (!product) {
            return res.redirect('/');
          }
          res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: editMode,
            product: product,
            hasError: false,
            errorMessage: null,
            validationErrors: []    
          });
        })
        .catch(err => {
          console.log(err);
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });
    } else if (config.environment.dbType === config.environment.DB_MONGODB ||
             config.environment.dbType === config.environment.DB_MONGOOSE) {
        Product.findById(prodId)
        .then((product) => {
          if (config.environment.dbType === config.environment.DB_MONGOOSE) {
            product.id = product._id;
          }
          console.log('result:', product);
          if (!product) {
            return res.redirect('/');
          }
          res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: editMode,
            product: product,
            hasError: false,
            errorMessage: null,
            validationErrors: []    
          });
        })
        .catch(err => {
          console.log(err);
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });
    } else if (config.environment.dbType === config.environment.DB_MOCKDB) {
      Product.findById(prodId)
      .then((result) => {
        console.log('result.data:', result.data);
        const product = result.data.product;
        if (!product) {
          return res.redirect('/');
        }
        res.render('admin/edit-product', {
          pageTitle: 'Edit Product',
          path: '/admin/edit-product',
          editing: editMode,
          product: product,
          hasError: false,
          errorMessage: null,
          validationErrors: []  
        });
      })
      .catch(err => {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  } else {
      const err = 'getEditProduct: request dbtype:"' + config.environment.dbType + '" not supported';
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
  }
};

exports.getProducts = (req, res, next) => {
  const userName = req.session.userEmail;
  const user = req.user;

  console.log('admin-controller.getProducts:user:', user);
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
    .catch(err => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
} else if (config.environment.dbType === config.environment.DB_SQLZ) {
    req.user.getProducts()   // select only for the user as owner
    // Product.findAll()
    .then(result => {
      console.log(result);
      res.render('admin/products', {
        prods: result,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
} else if (config.environment.dbType === config.environment.DB_JSONDB) {
    Product.fetchAll({ userId: user.id })
    .then(result => {
      console.log(result);
      res.render('admin/products', {
        prods: result.data,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => {
      console.log('getProducts: error:', err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  } else if (config.environment.dbType === config.environment.DB_MONGODB) {
    Product.fetchAll({
      $or: [{userId: new mongodb.ObjectId(user._id)},
            {userId: user.id.toString()}]
       })
    .then(result => {
      res.render('admin/products', {
        prods: result,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => {
      console.log('getProducts: error:', err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  } else if (config.environment.dbType === config.environment.DB_MONGOOSE) {
    Product.find({ userId: user._id } )
    //  {  $or: [ {userId: new Schema.Types.ObjectId(user._id)},  ** fails with cast failed
    //            {userId: user._id.toString()},  *** matches only userIds === ObjectId
    //            {userId: user._id}]             *** matches only userIds === ObjectId
    //   })
    // .select('title price -_id')
    .populate('userId', 'name')  // userId by itself will populate all fields from user
    .then(products => {
      return products.map(product => {
        product.id = product._id;
        return product;
      })
    })
    .then(products => {
      console.log(products);
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => {
      console.log('getProducts: error:', err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  } else if (config.environment.dbType === config.environment.DB_MOCKDB) {
    Product.fetchAll()
    .then(result => {
      console.log(result);
      res.render('admin/products', {
        prods: result.data.products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
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
    console.log('getProducts: error:', err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postDeleteProduct = (req, res, next) => {
  const userName = req.session.userEmail;
  console.log('postDeleteProduct', req.body);
  const prodId = req.body.productId;
  const prodPrice = req.body.productPrice;
  let imageToDelete = req.body.imageUrl;
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
        fUtil.deleteImage(imageToDelete);
        res.status(200).redirect("/admin/products");
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    }
  });
  } else if (config.environment.dbType === config.environment.DB_SQLZ) {
    Product.findByPk(prodId)
    .then(product => {
      return product.destroy();
    })
    .then(result => {
      // console.log(result);
      console.log('DESTROYED PRODUCT');
        // Product.deleteImage(product.id.imageToDelete);
        // Cart.deleteProduct(data.id.id, data.id.price);
        fUtil.deleteImage(imageToDelete);
        res.status(200).redirect("/admin/products");
    })
    .catch(err => {
      console.log('postDeleteProduct: error:', err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  } else if (config.environment.dbType === config.environment.DB_MYSQL) {
    Product.deleteById(prodId)
    .then(([result]) => {
      console.log(result);
      // Cart.deleteProduct(result.data.id[0].id, result.id[0].price);
      if (result.affectedRows > 0) {
        // Product.deleteImage(product.id.imageToDelete);
        // Cart.deleteProduct(data.id.id, data.id.price);
        fUtil.deleteImage(imageToDelete);
        res.status(200).redirect("/admin/products");
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(err => {
      console.log('postDeleteProduct: error:', err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  } else if (config.environment.dbType === config.environment.DB_MONGOOSE) {
    Product.deleteOne({ _id: prodId, userId: req.user._id })
    .then(result => {
      fUtil.deleteImage(imageToDelete);
      return Cart.find();
    })
    .then(fetchedCarts => {
      console.log(fetchedCarts);
      if (fetchedCarts && fetchedCarts.length > 0) {
        fetchedCarts.forEach(fCart => {
          console.log('fCart:', fCart);
          fCart.deleteProduct(prodId, prodPrice).then(xx => {return null})
        });
      }
      console.log('fetchCarts:', fetchedCarts); 
      return fetchedCarts; 
    })
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.status(200).redirect('/admin/products');
    })
    .catch(err => {
      console.log('postDeleteProduct: error:', err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  } else if (config.environment.dbType === config.environment.DB_JSONDB || 
             config.environment.dbType === config.environment.DB_MOCKDB ||
             config.environment.dbType === config.environment.DB_MONGODB) {
    Product.deleteById(prodId)
    .then(result => {
      fUtil.deleteImage(imageToDelete);
      return Cart.fetchAll();
    })
    .then(fetchedCarts => {
      let realCart = new Cart('');
      if (fetchedCarts && fetchedCarts.length > 0) {
        fetchedCarts.forEach(fCart => {
          realCart = Cart.factory(fCart);
          realCart.deleteProduct(prodId, prodPrice).then(xx => {return null})
        });
      }
      console.log('fetchCarts:', fetchedCarts);  
      res.status(200).redirect("/admin/products");
    })
    .catch(err => {
      console.log('postDeleteProduct: error:', err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  } else {
    const err = 'postDeleteProduct: request dbtype:"' + config.environment.dbType + '" not supported';
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postEditProduct = (req, res, next) => {
  const userName = req.session.userEmail;
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  let updatedImageUrl = req.body.imageUrl;  // this could change
  let imageToDelete;
  const image = req.file;
  const updatedDesc = req.body.description;
  const createDate = req.body.productCreateDate;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/edit-product',
      editing: true,
      hasError: true,
      product: {
        title: updatedTitle,
        imageUrl: updatedImageUrl,
        price: updatedPrice,
        description: updatedDesc,
        id: prodId
      },
      errorMessage: null,
      validationErrors: errors.array()
    });
  }

  if (image) {
    const url = req.protocol + '://' + req.get('host');
    // const imageUrl = image.path;  // this is the entire path on the file system
    imageToDelete = req.body.imageUrl;
    updatedImageUrl = url + '/images/' + image.filename;
  }
  console.log('editProduct:imageURL:' , updatedImageUrl);

  let updatedProduct;
  if (config.environment.dbType === config.environment.DB_FILEDB || 
      config.environment.dbType === config.environment.DB_MYSQL ||
      config.environment.dbType === config.environment.DB_MOCKDB ||
      config.environment.dbType === config.environment.DB_JSONDB ||
      config.environment.dbType === config.environment.DB_MONGODB) {  
    updatedProduct = new Product(
      prodId,
      updatedTitle,
      updatedImageUrl,
      updatedDesc,
      updatedPrice,
      createDate
    );
  }
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
      fUtil.deleteImage(imageToDelete);
      res.status(200).redirect("/admin/products");
    }
  });
  } else if (config.environment.dbType === config.environment.DB_SQLZ) {
    console.log('admin-controller:updatedProduct:', updatedProduct);
    Product.findByPk(prodId)
    .then(product => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageUrl = updatedImageUrl;
      return product.save();
    })
    .then(result => {
      console.log('UPDATED PRODUCT!');
      fUtil.deleteImage(imageToDelete);
      res.status(201).redirect("/admin/products");
    })
    .catch(err => {
      console.log('postEditProduct: error:', err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  } else if (config.environment.dbType === config.environment.DB_MYSQL ||
    config.environment.dbType === config.environment.DB_MOCKDB ||
    config.environment.dbType === config.environment.DB_JSONDB ||
    config.environment.dbType === config.environment.DB_MONGODB) {
    console.log('admin-controller:updatedProduct:', updatedProduct);
    updatedProduct.update()
      .then(result => {
        console.log(result);
        fUtil.deleteImage(imageToDelete);
        res.status(201).redirect("/admin/products");
      })
      .catch(err => {
        console.log('postEditProduct: error:', err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  } else if (config.environment.dbType === config.environment.DB_MONGOOSE) {
      Product.findById(prodId)
        .then(product => {
          if (product.userId.toString() !== req.user._id.toString()) {
            return res.redirect('/');
          }
          product.title = updatedTitle;
          product.price = updatedPrice;
          product.description = updatedDesc;
          // product.imageUrl = updatedImageUrl;
          if (image) {
            product.imageUrl = updatedImageUrl;
          }
          product.modifyDate = globals.dateString();
          return product.save().then(result => {
            console.log('UPDATED PRODUCT!');
            fUtil.deleteImage(imageToDelete);
            res.redirect('/admin/products');
          });
        })
        .catch(err => {
          console.log('postEditProduct: error:', err);
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });
    } else {
      const err = 'posttEditProduct: request dbtype:"' + config.environment.dbType + '" not supported';
      console.log('postEditProduct: error:', err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    }
};
