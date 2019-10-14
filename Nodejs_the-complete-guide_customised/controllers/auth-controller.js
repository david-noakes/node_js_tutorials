const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { check, validationResult } = require('express-validator');  // nextgen destructuring
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const config = require('../util/config');
const globalVars = require('../util/global-vars');
let User;
if (config.environment.dbType === config.environment.DB_MONGOOSE) {
  User = require('../models/user-mongoose');
} else {
  User = require('../models/user');
}

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        globalVars.sendGrid.nodeTraining
    }
  })
);

exports.getLogin = (req, res, next) => {
  console.log('auth-controller.session:', req.session);
  const userName = req.session.userEmail;
  // console.log('auth-controller.getLogin:cookie:', req.get('Cookie'));
  // let pCookie = globalVars.parseCookie(req.get('Cookie'));
  // console.log('pCookie', pCookie);
  // const isLoggedIn = pCookie["loggedIn"] === 'true';
  const eMsg = req.query.errorMessage;
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: globalVars.pullSessionData(req, 'error'),
    // zerrorMessage: globalVars.getFlashMessage(req, 'error'),
    oldInput: {
      email: '',
      password: ''
    },
    validationErrors: []
  });
};

exports.postLogin = (req, res, next) => {
  // console.log('postLogin:user:', req.user);
  const email = req.body.email;
  const password = req.body.password;
  const user = req.user;
  const errors = validationResult(req);
  console.log('auth-controller.postLogin: email: [', email, '], password: [', password, ']');
  if (!errors.isEmpty()) {
    console.log('auth-controller.postLogin: errors:', errors.array());
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: null,
      oldInput: {
        email: email,
        password: password
      },
      validationErrors: errors.array()
    });
  }
  console.log('auth-controller.postLogin: req.user: ', user );
  bcrypt
    .compare(password, user.password)
    .then(doMatch => {
      if (doMatch) {
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.userEmail = email;
        return req.session.save(err => {
          console.log(err);
          res.redirect('/');
        });
      }
      return res.status(422).render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: 'Error: Invalid password or email.',
        oldInput: {
          email: email,
          password: password
        },
        validationErrors: []
      });
    })
    .catch(err => {
      console.log(err);
      // req.flash('error', 'Error: ' + err.toString());
      // globalVars.putSessionData(req, 'error', 'Error: ' + err.toString());
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getSignup = (req, res, next) => {
  const userName = req.session.userEmail;
  // const eMsg = req.query.errorMessage;
  const eMsg = globalVars.getFlashMessage(req, 'error');
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: eMsg,
    oldInput: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationErrors: []
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  // const confirmPassword = req.body.confirmPassword; this is checked in middleware
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: null,
      oldInput: {
        email: email,
        password: '', // password,
        confirmPassword: '' // req.body.confirmPassword
      },
      validationErrors: errors.array()
    });
  }
  const name = email.split('@');
  console.log('auth-controller.postSignup:email:', email, ', pwd:', password);
  return bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      console.log('hashedpwd:', hashedPassword);
      const user = new User({
        name: name[0],
        email: email,
        password: hashedPassword
      });
      return user.save();
    })
    .then(result => {
      res.redirect('/login');
    //   return transporter.sendMail({
    //     to: email,
    //     from: 'shop@fugueSoftware.com',
    //     subject: 'Signup succeeded!',
    //     html: '<h1>You successfully signed up!</h1>'
    //   });
    })
    .catch(err => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};


exports.getReset = (req, res, next) => {
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: globalVars.pullSessionData(req, 'error')
  });
};

exports.postReset = (req, res, next) => {
  console.log('postReset:', req.body.email);
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      globalVars.putSessionData(req, 'error', 'Error: [' + err + ']');
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.getByEmail(req.body.email)
      .then(user => {
        if (!user) {
          // req.flash('error', 'No account with that email found.');
          globalVars.putSessionData(req, 'error', 'Error: No account with that email found.');
          return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
        if (result) {  // the redirect above will also flow through here as null
          res.redirect('/');
        }
        console.log('reset token:', token, 'email:', req.body.email);
        transporter.sendMail({
          to: req.body.email,
          from: 'shop@fugueSoftware.com',
          subject: 'Password reset',
          html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
          `
        })
        .catch(err => {
          console.log('transporter failure:', err);
          globalVars.putSessionData(req, 'error', 'Error: [' + err + ']');
          return res.redirect('/reset');
        });
      })
      .catch(err => {
        console.log(err);
        globalVars.putSessionData(req, 'error', 'Error: [' + err + ']');
        return res.redirect('/reset');
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      if (user) {
        res.render('auth/new-password', {
          path: '/new-password',
          pageTitle: 'New Password',
          errorMessage: globalVars.pullSessionData(req, 'error'),
          userId: user._id.toString(),
          userEmail: user.email,
          passwordToken: token,
          oldInput: {
            email: user.email,
            password: '', // password,
          },
          validationErrors: []
        });
      } else {
        globalVars.putSessionData(req, 'error', 'Error: Your token has expired.');
        res.redirect('/reset');
      }
    })
    .catch(err => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const userEmail = req.body.userEmail;
  const passwordToken = req.body.passwordToken;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('auth/new-password', {
      path: '/new-password',
      pageTitle: 'New Password',
      errorMessage: globalVars.pullSessionData(req, 'error'),
      userId: userId,
      userEmail: userEmail,
      passwordToken: passwordToken,
      oldInput: {
        email: userEmail,
        password: newPassword // password,
      },
      validationErrors: errors.array()
    });
  }
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId
  })
    .then(user => {
      if (user) {
        resetUser = user;
        return bcrypt.hash(newPassword, 12);
      } else {
        globalVars.putSessionData(req, 'error', 'Error: Your token has expired.');
        return null;    // pass to next then block    
      }
    })
    .then(hashedPassword => {
      if (!hashedPassword) {
        return null
      } else {
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        return resetUser.save();
      }
    })
    .then(result => {
      if (result) {
        res.redirect('/login');
      } else {
        res.redirect('/reset');
      }
    })
    .catch(err => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
