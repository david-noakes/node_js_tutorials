const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const config = require('./util/config');

const errorController = require('./controllers/error-controller');
// const expressHandlebars = require('express-handlebars');
const mockdb = require('./jsonDB/mockdb');  // filedb
const mysqldb = require('./util/database');

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

//app.use('/admin', adminRoutes.routes);
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);


app.listen(3000);
console.log("simple server listening on port: 3000");
