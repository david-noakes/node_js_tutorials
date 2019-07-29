const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error-controller');
// const expressHandlebars = require('express-handlebars');
const mockdb = require('./mockdb/mockdb');

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

const adminRoutes = require('./routes/admin-routes');
const shopRoutes = require('./routes/shop-routes');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/admin', adminRoutes.routes);
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

mockdb.initDB();

app.listen(3000);
console.log("simple server listening on port: 3000");
