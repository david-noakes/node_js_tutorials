const Product = require('../models/product-model');
const Cart = require('../models/cart-model');

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
  product.create((result, err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
  });
  res.redirect('/');
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  console.log('prodid:', prodId);
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
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
};

exports.postDeleteProduct = (req, res, next) => {
  console.log(req.body);
  const prodId = req.body.productId;
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
        Cart.deleteProduct(result.id[0].id, result.id[0].price);
        res.status(200).redirect("/admin/products");
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    }
  });
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
  updatedProduct.update((result, err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
  });
  res.redirect('/admin/products');
};
