const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
// const expressHandlebars = require('express-handlebars');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
// app.engine('hbs', expressHandlebars({ // non layout files have the extension named in the engine
//   extname: 'hbs', // layout files have this extension.
//   //layoutsDir: 'views/layouts/', // this is the default
//   defaultLayout: 'main-layout'  // the basic template
// }));
// app.set('view engine', 'hbs'); 
// app.set('view engine', 'pug');

const adminRoutes = require('./routes/admin-routes');
const shopRoutes = require('./routes/shop-routes');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).render('404', { pageTitle: 'Page Not Found', path: req.url });
});

app.listen(3000);
console.log('nodejs course app listening on port 3000');