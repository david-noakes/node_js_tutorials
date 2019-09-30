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
    isAuthenticated: isLoggedIn
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
