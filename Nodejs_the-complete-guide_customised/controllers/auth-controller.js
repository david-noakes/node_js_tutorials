const bcrypt = require('bcryptjs');

const config = require('../util/config');
const globalVars = require('../util/global-vars');
const User = require('../models/user-mongoose');

exports.getLogin = (req, res, next) => {
  console.log('auth-controller.session:', req.session);
  const userName = req.session.userEmail;
  // console.log('auth-controller.getLogin:cookie:', req.get('Cookie'));
  // let pCookie = globalVars.parseCookie(req.get('Cookie'));
  // console.log('pCookie', pCookie);
  // const isLoggedIn = pCookie["loggedIn"] === 'true';
  // console.log('auth-controller.isLoggedIn:', req.session.isLoggedIn);
  // if (req.session.counter) {
  //   req.session.counter++;
  // } else {
  //   req.session.counter = 1;
  // }
  const eMsg = req.query.errorMessage;
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: globalVars.pullSessionData(req, 'error'),
    zerrorMessage: globalVars.getFlashMessage(req, 'error')
    // errorMessage: eMsg,
    // errorMessage: req.flash('error')
  });
};

exports.postLogin = (req, res, next) => {
  console.log('postLogin:');
  // req.isLoggedIn = true;
  // res.setHeader('Set-Cookie', 'loggedIn=true');
  // req.session.userEmail = 'ndj@shadowlands.erehwon'; // req.email
  const email = req.body.email;
  const password = req.body.password;
  User.getByEmail(email)
    .then(user => {
      if (!user) {
        // return res.redirect('/login?errorMessage=error: invalid email or password');
        req.flash('error', 'Error: Invalid email or password.');
        globalVars.putSessionData(req, 'error', 'Error: Invalid email or password.');
        return res.redirect('/login');
      }
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
          // res.redirect('/login?errorMessage=error: invalid password or email');
          req.flash('error', 'Error: Invalid password or email.');
          globalVars.putSessionData(req, 'error', 'Error: Invalid password or email.');
          return res.redirect('/login');
        })
        .catch(err => {
          console.log(err);
          const error = err.toString();
          req.flash('error', 'Error: ' + error);
          globalVars.putSessionData(req, 'error', 'Error: ' + error);
          return res.redirect('/login');
          // res.redirect('/login?errorMessage=error: ' + error);
        });
    })
    .catch(err => console.log(err));
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
    errorMessage: eMsg
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
        // console.log('error: user already exists');
        // return res.redirect('/signup?errorMessage=error: user already exists');
        req.flash('error', 'Error: user already exists.');
        return res.redirect('/signup');
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
