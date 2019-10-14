const express = require('express');
// const expValidator = require('express-validator/check');  // old fashioned
const { check, body, validationResult } = require('express-validator');  // nextgen destructuring

const authController = require('../controllers/auth-controller');
const config = require('../util/config');
const globalVars = require('../util/global-vars');

let User;
if (config.environment.dbType === config.environment.DB_MONGOOSE) {
  User = require('../models/user-mongoose');
} else {
  User = require('../models/user');
}

const router = express.Router();

router.get('/login', authController.getLogin);

router.post(
    '/login', 
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
    body('email')
      .custom((value, { req }) => {
        const xerr = validationResult(req);
        // console.log('validationResult(req):', xerr.array());
        if (xerr.array().find(e => e.param === 'email')) {
          return true
        } else {
          return User.getByEmail(value)
          // return  User.findOne({ email: value })
            .then(userDoc => {
            if (!userDoc) {
              return Promise.reject(
                'E-Mail or password invalid.'
              );
            } else {
              req.user = userDoc;
              return true;
            }
          });
          }
      })
    ],
    authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);

router.post(
    '/signup',
    [
        check('email')
          .isEmail()
          .withMessage('Please enter a valid email.')
          .normalizeEmail({all_lowercase: true})
          .custom((value, { req }) => {
            // if (value === 'test@test.com') {
            //   throw new Error('This email address if forbidden.');
            // }
            // return true;
            return User.getByEmail(value).then(userDoc => {
              if (userDoc) {
                return Promise.reject(
                  'E-Mail [' + value + '] exists already, please pick a different one.'
                );
              }
            });
          }),
        body(
          'password',
          'Please enter a password with at least 4 characters.'
        )
          .isLength({ min: 4 })
          .trim(),
        //   .isAlphanumeric(),
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
        body('confirmPassword')
        .trim()
        .custom((value, { req }) => {
          if (value !== req.body.password) {
            throw new Error('Passwords have to match!');
          }
          return true;
        })
    ],
    authController.postSignup
  );
  
router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post(
  '/new-password', 
  [
    body(
      'password',
      'Please enter a password with at least 4 characters.'
    )
      .isLength({ min: 4 })
      .trim(),
    //   .isAlphanumeric(),
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
    })
  ],
  authController.postNewPassword
  );

module.exports = router;
