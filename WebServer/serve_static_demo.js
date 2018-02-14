/**
 * 0.0.1 - serving static files
 */
console.log("Serving Static Files");
var connect = require('connect');
var serveStatic = require('serve-static');

var app = connect()
    .use(serveStatic("publicPageFolder"))
    .use(function(req,res){
    	res.end("Welcome to our demo app")
    })
    .listen(3456);

console.log("serve static server listening on port 3456");