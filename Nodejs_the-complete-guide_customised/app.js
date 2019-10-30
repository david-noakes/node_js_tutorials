const bodyParser = require('body-parser');
const csrf = require('csurf');
const express = require('express');
const flash = require('connect-flash');

const isAuth = require('./middleware/is-auth');
const config = require('./util/config');
const errorController = require('./controllers/error-controller');
const globalVars = require('./util/global-vars');

// const expressHandlebars = require('express-handlebars');
const mockdb = require('./mockdb/mockdb');  // filedb
let mongoConnect;
if (config.environment.dbType === config.environment.DB_MONGODB) {
  mongoConnect = require('./util/database-mongodb').mongoConnect;
}  
const mongoose = require('mongoose');
const mysqldb = require('./util/database-mysql2');
const path = require('path');
const pathUtil = require('./util/path-util');
const sequelize = require('./util/database-sqlz');
const session = require('express-session');
const shopController = require('./controllers/shop-controller');
const useMulter = require("./middleware/multer-util");
const uuidTools = require('./util/uuid-tools');

let Cart;
let CartItem;
let Order;
let OrderItem;
let Product;
let User;
if (config.environment.dbType === config.environment.DB_SQLZ) {
  Cart = require('./models/cart-sqlize');
  CartItem = require('./models/cart-item-sqlize');
  Order = require('./models/order-sqlize');
  OrderItem = require('./models/order-item-sqlize');
  Product = require('./models/product-sqlize');
  User = require('./models/user-sqlize');
} else if (config.environment.dbType === config.environment.DB_MONGOOSE) {
  Cart = require('./models/cart-mongoose');
  Order = require('./models/order-mongoose');
  Product = require('./models/product-mongoose');
  User = require('./models/user-mongoose');
} else {
  Cart = require('./models/cart-model');
  Order = require('./models/order-model');
  Product = require('./models/product-model');
  User = require('./models/user-model');
}



const app = express();
const MongoDBStore = require('connect-mongodb-session')(session);
const mdbStore = new MongoDBStore({
  uri: globalVars.MONGO_Config.MONGO_LOCAL_NODEJS_COURSE_DB,
  collection: 'sessions'
});

const csrfProtection = csrf();

// app.engine('hbs', expressHandlebars({ // non layout files have the extension named in the engine
//   extname: 'hbs', // layout files have this extension.
//   //layoutsDir: 'views/layouts/', // this is the default
//   defaultLayout: 'main-layout'  // the basic template
// }));
// app.set('view engine', 'hbs'); 
// app.set('view engine', 'pug');
app.set('view engine', 'ejs');
app.set('views', 'views');

// const postsRoutes = require("./routes/posts-routes");
// const userRoutes = require("./routes/user-routes");

const adminRoutes = require('./routes/admin-routes');
const shopRoutes = require('./routes/shop-routes');
const authRoutes = require('./routes/auth-routes');

if (config.environment.dbType === config.environment.DB_FILEDB) {
  mockdb.initDB();
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
// app.use("/images", express.static(path.join("images")));
globalVars.imageStorePath = path.join(pathUtil.mainDir, './images');
app.use("/images", express.static(globalVars.imageStorePath));
console.log("image store:", globalVars.imageStorePath);
// app.use(multer({ storage: fileStorage }).single('image'));
app.use(useMulter);

app.use(
  session({
    secret: globalVars.JWT_Key, 
    resave: false, 
    saveUninitialized: false,
    store: mdbStore,
    cookie: {maxAge: 3600000} // miliseconds 3600000 = 1hour
  })
);

app.use(flash());

app.use((req, res, next) => {
  console.log('add CORS headers');
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE' ) {
    console.log('csurf:', req._csrf);
  }
  if (req.session) {
    console.log('req.session:', req.session);
  } else {
    console.log('*** no session  ***');
  }
  next();
});

// put this here so the redirect from the error handler will not loop
// app.get('/500', errorController.get500);

// get the logged in user
app.use((req, res, next) => {
  const userEmail = req.session.userEmail;
  if (!userEmail) {
    console.log('No Email:', userEmail);
    return next();
  }
  if (config.environment.dbType === config.environment.DB_SQLZ) {
    User.findAll({where: { email: userEmail }})
    .then(users => {
      console.log('logged in user:', users[0]);
      req.user = users[0];
      return next();
    })
    .catch(err => {
      console.log('app.retrieveUser: error:', err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });

  } else if (config.environment.dbType === config.environment.DB_MONGODB ||
             config.environment.dbType === config.environment.DB_JSONDB) {
    User.getByEmail(userEmail)
    .then(user => {
      // user.id = user._id;
      req.user = User.factory(user);
      req.session.user = req.user;
      console.log('mongodb/jsondb: found user:', req.user);
      return next();
    })
    .catch(err => {
      console.log('app.retrieveUser: error:', err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  } else if (config.environment.dbType === config.environment.DB_MONGOOSE) {
    if (req.session) {  // if the session doesn't exist, we get an error setting it
      console.log('app.use User Email:', userEmail, ', session.user:', session.user);
      User.getByEmail(userEmail)
      .then(fUser => { // logged in getUserByEmail
        // console.log('findUser:', fUser);
        req.user = fUser;
        req.session.user = fUser;
        console.log('req.user:', req.user);
        return next();
      })
      .catch(err => {
        console.log('app.retrieveUser: error:', err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
    } else {
      console.log('*** no session ***');
    }
  } else {
    User.getByEmail(userEmail)
    .then(result => {
      console.log('logged in user:', result.data[0]);
      req.user = result.data[0];
      req.session.user = req.user;
      return next();
    })
    .catch(err => {
      console.log('app.retrieveUser: error:', err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  }
});

app.use((req, res, next) => {
  // console.log('res.locals.isAdmin =', (req.session && req.session.user && req.session.user.isAdmin));
  if (req.session) {
    res.locals.userName = req.session.userEmail;
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.isAdmin = (req.session.user && req.session.user.isAdmin);
    console.log('res.locals:', res.locals);
  } else {
    res.locals.userName = '';
    res.locals.isAuthenticated = false;
    res.locals.isAdmin = false;
    console.log('no session - res.locals:', res.locals);
  }
  next();
});

// this one comes from stripe and has no csrf token
app.post('/create-order', isAuth, shopController.postOrder);

// put this here so we can process POST requests that will validly come without a csrf token
app.use(csrfProtection);
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

//app.use('/admin', adminRoutes.routes);  
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

// this one goes after the catchall because it can 
// never be reached unless is has error as the first argument
app.use((error, req, res, next) => {
  // res.status(error.httpStatusCode).render(...);
  console.log('error500:', error);
  globalVars.putSessionData(req, 'error', error.message);
  //res.redirect('/500');
  errorController.get500(req, res, next);
});

if (config.environment.dbType === config.environment.DB_SQLZ) {
  Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
  User.hasMany(Product);
  User.hasOne(Cart);
  Cart.belongsTo(User);
  Cart.belongsToMany(Product, { through: CartItem });
  Product.belongsToMany(Cart, { through: CartItem });
  Order.belongsTo(User);
  User.hasMany(Order);
  Order.belongsToMany(Product, { through: OrderItem });
  
  let newUser;
  
  sequelize
  // .sync({ force: true })   // if you want to recreate all tables
  .sync()
  .then(result => {
    return User.findAll({where: { email: "ndj@shadowlands.erehwon" }});
  })
  .then(users => {
    // console.log('found user:', users);
    if (!users || users.length === 0) {  // not found returns []
      console.log('creating a user');
      return User.create({ 
        id: uuidTools.generateId('aaaaaaaaaaaaaaaa'), 
        name: 'ndj', 
        email: 'ndj@shadowlands.erehwon', 
        password: '1@qW' 
      });
    }
    // console.log('users[0]:', users[0]);
    return users[0]; 
  })
  .then(user => {
    newUser = user;
    console.log('got user:', user);
    return user.getCart();
  })
  .then(cart => {
    console.log(cart);
    if(!cart) {
      return newUser.createCart({id: uuidTools.generateId('aaaaaaaaaaaaaaaa')});
    } else {
      return cart;
    }
  })
  .then(cart => {
    app.listen(3000);
    console.log("mysql server listening on port: 3000");  
  })
  .catch(err => {
    console.log(err);
  });
} else if (config.environment.dbType === config.environment.DB_MONGODB) {
  mongoConnect(() => {
    console.log('connected to mongodb');
    app.listen(3000);
    console.log("mongodb server listening on port: 3000");  
  });
} else if (config.environment.dbType === config.environment.DB_MONGOOSE) {
  mongoose
  .connect(globalVars.MONGO_Config.MONGO_LOCAL_NODEJS_COURSE_DB, { useNewUrlParser: true })
  .then(result => {
    app.listen(3000);
    console.log("mongoose server listening on port: 3000");  
  })
  .catch(err => {
    console.log(err);
  });
} else {
  app.listen(3000);
  console.log("simple server listening on port: 3000");  
}
