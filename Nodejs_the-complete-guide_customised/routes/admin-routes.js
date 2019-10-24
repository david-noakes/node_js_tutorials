const path = require('path');
const express = require('express');
const { check, body, validationResult } = require('express-validator'); 

const adminController = require('../controllers/admin-controller');
const isAdmin = require('../middleware/is-admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', isAuth, isAdmin, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', isAuth, isAdmin, adminController.getProducts);

// /admin/add-product => POST
router.post(
    '/add-product',
    [
      body('title')
        .isString()
        .trim()
        .isLength({ min: 3 })
        .withMessage('Please enter at least 3 characters.'),
      // body('imageUrl').isURL().withMessage('is not a valid URL'),
      body('price').isFloat({ min: 0.00 }).withMessage('not a valid positive number, no more than 2 decimal places.'),
      body('description')
      .trim()
      .isLength({ min: 5, max: 400 })
      .withMessage('Please enter at least 5 characters up to 400.')
    ],
    isAuth,
    isAdmin, 
    adminController.postAddProduct
  );
  

router.get('/edit-product/:productId', isAuth, isAdmin, adminController.getEditProduct);

router.post(
    '/edit-product', 
    [
        body('title')
          .isString()
          .trim()
          .isLength({ min: 3 })
          .withMessage('Please enter at least 3 characters.'),
        // body('imageUrl').isURL().withMessage('is not a valid URL'),
        body('price').isFloat().withMessage('not a valid positive number, no more than 2 decimal places.'),
        body('description')
        .trim()
        .isLength({ min: 5, max: 400 })
        .withMessage('Please enter at least 5 characters up to 400.')
    ],
    isAuth, 
    isAdmin,
    adminController.postEditProduct
);
 
// router.post('/delete-product', isAuth, isAdmin, adminController.postDeleteProduct);

router.delete('/product/:productId', isAuth, adminController.deleteProduct);


module.exports = router;
