/**
 * MEAN Stack server
 */
console.log("MEAN Stack server");
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');

var config = require('./config/config');

//====================
require('./config/mongoose_cfg')(config);



var port = 3456;

var app = express();


//-----------------------------------------------

app.use(logger('dev'));
app.use(bodyParser({'extended':'true'}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

require('./app/routes')(app);

//-----------------------------------------------
app.listen(port,function(){
	console.log("MongoDB RESTful API online @" + port);
});
