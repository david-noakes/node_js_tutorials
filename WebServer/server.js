/**
 * 0.0.01 - WebServer
 */
var connect = require('connect');

var webApp = connect()
    .use(function(req,res){
    	if(req.url == "/hello"){
    		console.log("sending plain");
    		res.end("Hello from webApp");
    	}
    	else if(req.url == "/printRequestHeaders"){
    		var headers = req.headers;
    		console.log("echoing headers");
    		console.log(headers);
    		res.end("Headers printed in console");
    	}
    	else {
    		res.end("Nothing else matched");
    	}
    })
    .listen(3456);

console.log("webserver listening on port 3456");