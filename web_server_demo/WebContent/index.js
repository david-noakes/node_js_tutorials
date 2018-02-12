console.log("Basic HTTP server");

var http = require('http');

var handlerMethod = function(req,res){
	res.end("A simple response from the simple web seerver");
}

http.createServer(handlerMethod).listen(3456, 'localhost');
console.log("HTTP Server listening on port 3456");