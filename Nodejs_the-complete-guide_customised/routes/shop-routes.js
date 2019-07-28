const path = require('path');

const express = require('express');

const rootDir = require('../util/path-util');
const mockdb = require('../mockdb/mockdb');

const router = express.Router();

router.get('/', (req, res, next) => {
  const products = mockdb.products;
  res.render('shop', {
    prods: products,
    pageTitle: 'Shop',
    path: '/',
    hasProducts: products.length > 0,
    activeShop: true,
    productCSS: true
  });
});

module.exports = router;
