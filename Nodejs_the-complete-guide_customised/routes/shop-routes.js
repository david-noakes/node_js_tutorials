const path = require('path');

const express = require('express');

const isAdmin = require('../middleware/is-admin');
const isAuth = require('../middleware/is-auth');
const shopController = require('../controllers/shop-controller');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', isAuth, shopController.getCart);

router.post('/cart', isAuth, shopController.postCart);

router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);

router.get('/checkout', isAuth, shopController.getCheckout);

// moved to app.js since this comes from stripe and doesn't have a csrf token
// router.post('/create-order', isAuth, shopController.postOrder);

router.get('/checkout/success', shopController.getCheckoutSuccess);

router.get('/checkout/cancel', shopController.getCheckout);


router.get('/orders', isAuth, shopController.getOrders);

router.get('/orders/:orderId', isAuth, shopController.getInvoice);

router.get('/checkout', isAuth, shopController.getCheckout);

router.get('', shopController.getIndex);

module.exports = router;
