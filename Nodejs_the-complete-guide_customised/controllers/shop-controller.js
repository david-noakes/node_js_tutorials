const Product = require('../models/product-model');
const Cart = require('../models/cart-model');

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    // console.log("prods:", products);
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId, product => {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products'
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  });
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
