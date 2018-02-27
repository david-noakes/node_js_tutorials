/**
 * Using Handlebars
 */
var express = require('express');
var hBars = require('express-handlebars');
var app = express();

app.engine('handlebars',hBars({defaultLayout:'main'}));
app.set('view engine','handlebars');

app.get('/home', function(req, res){
	res.render('demoHomePage',{firstName:'Ana',lastName:'Zaloumis'});
});

app.get('/noLayoutHome',function(req,res){
	// renders demoHomePage standalone with no default layout
	res.render('demoHomePage',{firstName:'Ana',lastName:'Zaloumis',layout:false});
});

var port = 3456;
app.listen(port, function(){
	console.log("Handlebars demo listening on port: " + port);
});