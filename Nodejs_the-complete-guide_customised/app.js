const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const config = require('./util/config');
const errorController = require('./controllers/error-controller');

// const expressHandlebars = require('express-handlebars');
const mockdb = require('./mockdb/mockdb');  // filedb
const mongoConnect = require('./util/database-mongodb').mongoConnect;
const mysqldb = require('./util/database-mysql2');
const sequelize = require('./util/database-sqlz');
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
} else {
  Cart = require('./models/cart-model');
  Product = require('./models/product-model');
  User = require('./models/user-model');
}

const app = express();

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

if (config.environment.dbType === config.environment.DB_FILEDB) {
  mockdb.initDB();
}

if (config.environment.dbType === config.environment.DB_MYSQL) {
  // mysqldb.execute('SELECT * FROM products')
  // .then(result => {
  //   console.log(result[0], result[1]);
  // })
  // .catch(err => {
  //   console.log(err);
  // });
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use("/images", express.static(path.join("images")));


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
  next();
});

// get the logged in user
app.use((req, res, next) => {
  if (config.environment.dbType === config.environment.DB_SQLZ) {
    User.findAll({where: { email: "ndj@shadowlands.erehwon" }})
    .then(users => {
      console.log('logged in user:', users[0]);
      req.user = users[0];
      next();
    })
    .catch(err => console.log(err));
  } else if (config.environment.dbType === config.environment.DB_MONGODB) {
    User.getByEmail('ndj@shadowlands.erehwon')
    .then(user => {
      // user.id = user._id;
      req.user = User.factory(user);
      console.log('mongodb: found user:', req.user);
      next();
    })
    .catch(err => {
      console.log(err);
      console.log('mongodb: fake user');
      const uu = new User('ndj@shadowlands.erehwon', '1qQ@', 'ndj', '4cddfd1dec7695560c98d329');
      req.user = uu;
      next();
    });
  } else {
    User.getByEmail("ndj@shadowlands.erehwon")
    .then(result => {
      console.log('logged in user:', result.data[0]);
      req.user = result.data[0];
      next();
    })
    .catch(err => {console.log(err);   next();    });
  }
});

//app.use('/admin', adminRoutes.routes);  
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

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
} else {
  app.listen(3000);
  console.log("simple server listening on port: 3000");  
}
