const express = require('express');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth-routes');
const feedRoutes = require('./routes/feed-routes');
const globalVars = require('./utils/global-vars');
const mongoose = require('mongoose');
const path = require('path');
const pathUtil = require('./utils/path-util');
const useMulter = require("./middleware/multer-util");


const app = express();

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
globalVars.imageStorePath = path.join(pathUtil.mainDir, './images');
app.use("/images", express.static(globalVars.imageStorePath));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', // 'Content-Type, Authorization');
                            'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});
app.use(useMulter);

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
  console.log('error:', error);
  const status = error.statusCode || 500;
  let message = error.message;
  const valErrs = error.validavalidationErrors;
  const data = error.data;
  if (valErrs && valErrs.length > 0) {
    message += ' [';
    let comma = '';
    valErrs.forEach(e => {
      message += comma + JSON.stringify(e);
      comma = ', ';
    });
    message += ']';
  }
  if (data && data.length > 0) {
    message += '[';
    let comma = '';
    data.forEach(e => {
      message += comma + JSON.stringify(e);
      comma = ', ';
    });
    message += ']';
  } else {
    if (data) {
      message += '(' + data + ')'
    }
  }
  console.log('new error message:', message);
  const body = globalVars.standardBody(
    { message: message, data: data },
    status,
    message,
    0,
    error
  );
  console.log('new response:', body);
  res.setHeader('payload', JSON.stringify(body));
  res.status(status).json(body);
});


mongoose
  .connect(
    globalVars.MONGO_Config.MONGO_LOCAL_NODEJS_COURSE_DB,
    {useNewUrlParser: true}
  )
  .then(result => {
    app.listen(8080);
    console.log('restAPI listening on 8080');
  })
  .catch(err => console.log(err));
