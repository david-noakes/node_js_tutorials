/**
 * v001 routing basics
 */
console.log('simple food server');

var express = require('express');
var routes = require('./routes');
var app = express();
var port = 3456;

app.get('/',function(req,res){
	res.end("welcome to the root URL of our food server app");
});

app.get('/testRoute',function(req,res){
	res.end('welcome to the testRoute URL of food server app');
});

//doesn't quite work yet
app.get('/public/TestPage', function(req,res){
	//res.end(__dirname + '/public/TestPage.html');
	res.render(__dirname + '/public/TestPage.html');
});

// use the exported routes
app.get("/fruits",routes.fruits);
app.get("/veg",routes.veg);
app.get("/dairy",routes.dairy);
app.get("/meats",routes.meats);
app.get("/grains",routes.grains);

// catch all
app.get('*',function(req,res){
	res.end("not a valid page");
})

app.listen(port, function(){
	console.log("Food server listening on port: " + port);
});