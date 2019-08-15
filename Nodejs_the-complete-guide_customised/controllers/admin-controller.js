let Cart;
let Product;
let User;

const config = require('../util/config');
if (config.environment.dbType === config.environment.DB_SQLZ) {
  Cart = require('../models/cart-sqlize');
  Product = require('../models/product-sqlize');
  User = require('../models/user-sqlize');
} else {
  Cart = require('../models/cart-model');
  Product = require('../models/product-model');
  User = require('../models/user-model');
}
const uuidTools = require('../util/uuid-tools');


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
  const userId = req.user.id;
  console.log('postAddProduct:', title, imageUrl, price, description, userId)
  let product = new Product(null, title, imageUrl, description, price, userId);
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
      console.log(result.status);
      console.log(result.data);
      res.redirect('/admin/add-product');
      })
    .catch(err => {
      console.log(err);
    });
  } else if (config.environment.dbType === config.environment.DB_MYSQL) {
    product.create()
      .then(result => {
        console.log(result);
        res.redirect('/admin/add-product');
      })
      .catch(err => {
        console.log(err);
      });
  } else if (config.environment.dbType === config.environment.DB_SQLZ) {
    const currentUser = req.user;
    // console.log('req.user:', Object.keys(currentUser.__proto__));
    req.user.createProduct({
      // req.user.createProduct({
        id: uuidTools.generateId('aaaaaaaaaaaaaaaa'),
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description
        // userId: userId 
      })
    // Product.create({
    //   id: uuidTools.generateId('aaaaaaaaaaaaaaaa'),
    //   title: title,
    //   price: price,
    //   imageUrl: imageUrl,
    //   description: description,
    //   userId: userId  
    // })
      .then(result => {
        console.log(result);
        res.redirect('/admin/add-product');
      })
      .catch(err => {
        console.log(err);
      });
    } else {
      console.log('postAddProduct: request dbtype:"' + config.environment.dbType + '" not supported');
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
    } else if (config.environment.dbType === config.environment.DB_SQLZ) {
      // console.log('req.user:', Object.keys(req.user.__proto__));
      req.user.getProducts({where: {id: prodId}})   // select only for the user as owner
      // Product.findByPk(prodId)
        // .then( product => {
          .then( products => {
            const product = products[0];
            res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: editMode,
            product: product
          });
        })
        .catch(err => console.log(err));
      } else if (config.environment.dbType === config.environment.DB_JSONDB) {
        Product.findById(prodId)
        .then((result) => {
          console.log('result.data:', result.data);
          const product = result.data;
          res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: editMode,
            product: product
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
      console.log('getEditProduct: request dbtype:"' + config.environment.dbType + '" not supported');
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
    .catch(err => console.log(err));
  } else if (config.environment.dbType === config.environment.DB_JSONDB) {
    Product.fetchAll()
    .then(result => {
      console.log(result);
      res.render('admin/products', {
        prods: result.data,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => console.log(err));
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
    .catch(err => console.log(err));
  } else {
    console.log('getProducts: request dbtype:"' + config.environment.dbType + '" not supported');
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
        res.status(200).redirect("/admin/products");
    })
    .catch(error => {
      console.log('postDeleteProduct: error:', error);
      res.status(500).json({
        message: "Deleting product failed!",
        error: error
      });
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
  } else if (config.environment.dbType === config.environment.DB_JSONDB) {
    Product.deleteById(prodId)
    .then(result => {
      // console.log(result.data);  empty
      console.log(result.status);

      // if (data.n > 0) {
        // Product.deleteImage(product.id.imageToDelete);
        // Cart.deleteProduct(data.id.id, data.id.price);
        res.status(200).redirect("/admin/products");
      // } else {
      //   res.status(401).json({ message: "Not authorized!" });
      // }
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
  } else {
    console.log('postDeleteProduct: request dbtype:"' + config.environment.dbType + '" not supported');
  }
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  const createDate = req.body.productCreateDate;
  const updatedProduct = new Product(
    prodId,
    updatedTitle,
    updatedImageUrl,
    updatedDesc,
    updatedPrice,
    createDate
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
      res.status(201).redirect("/admin/products");
    })
    .catch(error => {
      console.log('postEditProduct: error:', error);
      res.status(500).json({
        message: "Saving product failed!",
        error: error
      });
    });
  } else if (config.environment.dbType === config.environment.DB_MYSQL ||
    config.environment.dbType === config.environment.DB_MOCKDB ||
    config.environment.dbType === config.environment.DB_JSONDB) {
    console.log('admin-controller:updatedProduct:', updatedProduct);
    updatedProduct.update()
      .then(result => {
        console.log(result);
        res.status(201).redirect("/admin/products");
      })
      .catch(error => {
        console.log('postEditProduct: error:', error);
        res.status(500).json({
          message: "Saving product failed!",
          error: error
        });
      });
    } else {
      console.log('posttEditProduct: request dbtype:"' + config.environment.dbType + '" not supported');
  }
};
