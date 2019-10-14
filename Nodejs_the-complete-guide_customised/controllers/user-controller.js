const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const globals = require('../utils/global-vars');
const uuidTools = require('../utils/uuid-tools');
const User = require("../models/user-model");

exports.createUser = (req, res, next) => {
  console.log('middle1:', req.body);
  console.log('url:', req.url);
  // doesn't check for duplicate
  const name = req.body.email.split("@");
  let uid = req.body.id;
  if (!uid) {
    uid = uuidTools.generateId('aaaaaaaaaaaaaaaa');
  }
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User(
      req.body.email,
      hash,
      name[0],
      uid
    );
    // console.log("user: ", user);
    req.body = {...req.body, ...user};
    console.log('middle2:', req.body);
    console.log('url:', req.url);
    req.url = '/api/users';
    next();
  })
  .catch(err => {
    console.log('user.createUser: error:', err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
};

// POST /api/user/login
exports.userLogin = (req, res, next) => {
  let fetchedUser;
  console.log('userLogin:email:', req.body.email);
  const payload = { email: req.body.email, password: req.body.password, login: true};
  req.headers['payload'] = JSON.stringify(payload);
  req.method = 'GET';
  req.query = {'email':  payload.email};
  req.url = '/api/users';
  console.log('userLogin:forwarding:', payload, req.method, req.url, req.query);
  next();


}

//  GET /api/user - not a login, just a request to find the user
exports.getUser = (req, res, next) => {
  const qParam = req.query; // ?email="xxx"
  console.log('getUser:', qParam)
  req.url = '/api/users';
  console.log('getUser:newURL:', req.url);
  next()
};

//  GET /api/user - not a login, just a request to find the user
// exports.getUserFetch = (req, res, next) => {
//   const qParam = req.query; // ?email="xxx"
//   console.log('getUserFetch:', qParam);
//   if (qParam.fetch) {
//     const body = res.body;
//     console.log('getUserFetch:body:', body);
//     let reply = {};

//   }
//   next()
// };
