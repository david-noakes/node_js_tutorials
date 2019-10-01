const bcrypt = require('bcryptjs');

const config = require('../util/config');
const globalVars = require('../util/global-vars');
const User = require('../models/user-mongoose');

exports.getLogin = (req, res, next) => {
  // console.log('auth-controller.getLogin:cookie:', req.get('Cookie'));
  // let pCookie = globalVars.parseCookie(req.get('Cookie'));
  // console.log('pCookie', pCookie);
  // const isLoggedIn = pCookie["loggedIn"] === 'true';
  console.log('auth-controller.session:', req.session);
  // console.log('auth-controller.isLoggedIn:', req.session.isLoggedIn);
  const isLoggedIn = req.session.isLoggedIn === true;
  // if (req.session.counter) {
  //   req.session.counter++;
  // } else {
  //   req.session.counter = 1;
  // }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  console.log('postLogin:');
  // req.isLoggedIn = true;
  // res.setHeader('Set-Cookie', 'loggedIn=true');
  req.session.userEmail = 'ndj@shadowlands.erehwon'; // req.email
  req.session.isLoggedIn = true;
  req.session.save(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getSignup = (req, res, next) => {
  eMsg = req.query.errorMessage;
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: eMsg,
    isAuthenticated: false
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const name = email.split('@');
  console.log('auth-controller.postSignup:email:', email, ', pwd:', password);
  User.getByEmail(email)
    .then(userDoc => {
      if (userDoc) {
        console.log('error: user already exists');
        return res.redirect('/signup?errorMessage=error: user already exists');
      }
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
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
};
