const dateFormat = require('dateformat');

var JWT_token;  // holds JWT

var JWT_Secret_Sign = "QhdsRlbwJbdajNxvHRNOpoRFnKs2wOoDU1B8ueENmAY2Y7";

var mongoDBConstants = {
  MONGO_ATLAS_USER: 'ndj4096-a',
  MONGO_ATLAS_PW: 'Ndj%24%240519zxq',
  MONGO_ATLAS_DB_201: '@cluster0-klig6.mongodb.net/angularcourse?retryWrites=true',
  MONGO_LOCAL_NODEJS_COURSE_DB: 'mongodb://127.0.0.1:27017/nodejscourse',
  MONGO_LOCAL_ANGULAR_MEAN_STACK_DB: 'mongodb://127.0.0.1:27017/angularMeanStackCourse'
}

// firebase
var fbConstants = {
  fireBaseURL: 'https://angular-training-201.firebaseio.com/',
  fbRecipeBookURL: 'recipes',
  fbShoppingListURL: 'shoppingList',
  fbUserListURL: 'testAuth',
  fbHeroTableURL: 'heroTable',
  fbPostsURL: 'posts',
  zodEmail: 'zod4096@shadowlands.com',
  zodPassword: 'Ndj$1913',
  zodUuid: 'QhdsRlbwJbdajNxvHRNOpoRFnKs2',
  djnEmail: 'david.noakes@gmail.com',
  djnPassword: 'F$$0719zxq',
  djnUuid: 'aIffoSyapCTKiTU7HZpDHrCdy173'
}

var fbconfig = {
  apiKey: "AIzaSyC_wOoDU1B8ueENmAY2Y7_JqNZhyz2Bu-0",
  authDomain: "angular-training-201.firebaseapp.com",
  databaseURL: "https://angular-training-201.firebaseio.com",
  projectId: "angular-training-201",
  storageBucket: "angular-training-201.appspot.com",
  messagingSenderId: "83927608324"
};
var firebaseConnected = false;

// firebase.initializeApp(fbconfig);
  // Get a reference to the database service
var fbDatabase; // = firebase.database();
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


module.exports = {
  dateString: dateString,
  parseCookie: parseCookie,
  standardBody: standardBody,
  JWT_token: JWT_token,
  JWT_Key: JWT_Secret_Sign,
  fbConstants: fbConstants,
  MONGO_ATLAS_PW: mongoDBConstants.MONGO_ATLAS_PW,
  MONGO_Config: mongoDBConstants
}
