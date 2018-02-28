/**
 * Working with failed requests
 */
console.log("Working with failed requests");

var port = 3456;
var express = require('express');
var app = express();

app.get('/fruits', function(req,res){
	res.end("welcome to the app page abot fruits");
});
app.get('/vegies',function(req,res){
	res.end("welcome to the app page about vegies");
});
app.get('*',function(req,res,next){
	var err = new Error("Failed to load resource");
	err.status = 404;
	next(err);  // ==> next handler in the stack, BUT
	            // when err is passed, it looks for function(err,req,res,next)
});

// define the next function as error handler
app.use(function(err,req,res,next){
	if(err.status == 404){
		console.log("status is 404 ");
		res.status(404);
		res.send("I'm sorry. What you are looking for does not exist.");
		return;
	} else {
		return next();
	}
});

app.listen(port, function(){
	console.log("Listening on port: " + port);
});
