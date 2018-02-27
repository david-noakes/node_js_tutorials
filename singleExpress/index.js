/**
 * using node express to create a simple app
 */
var express = require('express');
var app = express();
// using jade. We do not need to require it
// note - jade has been superceded by pug
//app.use(express.static(__dirname + '/public'));

app.set('views',__dirname + '/views');
app.set('view engine','jade');

app.get('/',function(req, res){
	res.render('index');
});
app.get('/pageA', function(req,res){
	res.render('pageA',{firstName:'Ana',lastName:'Zaloumis'})
});
app.get('/public/TestPage', function(req,res){
	res.render(__dirname + '/public/TestPage');
});
//app.get('/*',function(req, res){
//	res.writeHead(404);
//	res.end("Resource does not exist.")
//});



var port = 3456;
app.listen(port, function(){
	console.log("Listening on port: " + port);
});