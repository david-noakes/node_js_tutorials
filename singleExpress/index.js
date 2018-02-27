/**
 * using node express to create a simple app
 */
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

//app.get('/',function(req, res){
//	res.end("Welcome to a simple app created using the express module")
//});
app.get('/*',function(req, res){
	res.writeHead(404);
	res.end("Resource does not exist.")
});



var port = 3456;
app.listen(port, function(){
	console.log("Listening on port: " + port);
});