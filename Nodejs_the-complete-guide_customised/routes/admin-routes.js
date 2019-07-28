const path = require('path');

const express = require('express');

const rootDir = require('../util/path-util');
const mockdb = require('../mockdb/mockdb');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', (req, res, next) => {
  res.render('add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true
  });
});

// /admin/add-product => POST
router.post('/add-product', (req, res, next) => {
  mockdb.products.push({ title: req.body.title });
  res.redirect('/');
});

module.exports = router;
