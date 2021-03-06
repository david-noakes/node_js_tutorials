const dateFormat = require('dateformat');
// const keys = require('../../assets/keystore'); // MeanStack_Express
const keys = require('../../../../assets/keystore');  // Nodejs_course

var JWT_token;  // holds JWT

var imageStorePath;

var token;

function dateString(d) {
  let x = d;
  if (!d) {
    x = new Date();
  }
   return dateFormat(x, "yyyymmddHHMMssl");
}


function standardBody(data, status, statusText, nbr, err) {
  let body;
  if (err) {
    body = {
      body: data,
      error: err,
      responseData: {
        status: status,
        msg: statusText,
        nbr: nbr
      }
    };
  } else {
    body = {
      body: data,
      responseData: {
        status: status,
        msg: statusText,
        nbr: nbr
      }
    };
  }
  return body;
}

function parseCookie(cookie) {
  const splitski = cookie.split(';')
  let zz;
  let h = {};
  let key;
  splitski.forEach(s => {
    zz = s.trim().split('=');
    h[zz[0]] = zz[1];
    console.log('hash(key):', zz[0], '=', zz[1]);
  });
  return h;
}

function getFlashMessage(r,m) {
  let message = r.flash(m);
  if (message.length > 0) {
    message = message[0];
  } else {
    message = '';
  }
  return message;

}

function putSessionData(req, key, data) {
  req.session[key] = data;
  return req.session.save(err => {
    console.log(err);
  });
}

function getSessionData(req, key) {
  return req.session[key];
}

function pullSessionData(req, key) {
  let z = getSessionData(req, key);
  putSessionData(req, key, null);
  req.session.save(err => {
    console.log(err);
  });
  return z;
}


module.exports = {
  dateString: dateString,
  getFlashMessage: getFlashMessage,
  parseCookie: parseCookie,
  standardBody: standardBody,
  getSessionData: getSessionData,
  pullSessionData: pullSessionData,
  putSessionData: putSessionData,
  imageStorePath: imageStorePath,
  JWT_token: JWT_token,
  JWT_Key: keys.JWT_Key,
  fbConstants: keys.fbConstants,
  MONGO_Config: keys.MONGO_Config,
  sendGrid: keys.sendGrid,
  stripeKeys: keys.stripeKeys
}
