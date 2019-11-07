const express = require('express');
const { body, check } = require('express-validator');

const authController = require('../controllers/auth-controller');
const isAuth = require('../middleware/is-auth');
const User = require('../models/user-model');

const router = express.Router();

router.put(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .normalizeEmail({all_lowercase: true})
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject('E-Mail address already exists!');
          }
        });
      }),
      body(
        'password',
        'Please enter a password with at least 4 characters.'
      )
      .isLength({ min: 4 })
      .trim(),
      body('password')
      .custom((pValue, { req }) => {
        const hasNumber = /\d/.test(pValue);
        const hasUpper = /[A-Z]/.test(pValue);
        const hasLower = /[a-z]/.test(pValue);
        const hasSpecial = /[!@#$%^&*()_]/.test(pValue);
        if (hasNumber && hasSpecial && hasLower && hasUpper) {
            return true;
        } else {
            throw new Error('Passwords require at least one each of number, lowercase, uppercase and special (!@#$%^&*()_) characters.');  
        };
      }),
      body('name')
      .trim()
      .not()
      .isEmpty()
  ],
  authController.signup
);

router.post('/login',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .normalizeEmail({all_lowercase: true}),
    body(
      'password',
      'Please enter a password with at least 4 characters.'
    )
      .isLength({ min: 4 })
      .trim(),
  ],
  authController.login);

router.get('/status', isAuth, authController.getUserStatus);

router.put(
    '/status',
    isAuth,
    [
      body('status')
        .trim()
        .isLength({ min: 1 })
        .withMessage('cannot be empty'),
      ],
    authController.updateUserStatus
  );
  
module.exports = router;
