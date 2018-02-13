/*
 * change 0.0.02 dependencies in package.json require >npm install
 * to use pages/userForm.html we need to enter
 * file:///D:/Warehouse/git_clones/node_js_tutorials/web_server_demo/pages/userForm.html
 * change 0.0.03 sending the response
 */
console.log("Basic HTTP server v0.0.03 - Process POST request");

var http = require('http');
var connect = require('connect');
var bodyParser = require('body-parser');

//var handlerMethod = function(req,res){
//	res.end("A simple response from the simple web server");
//}

var app = connect()
//        .use(bodyParser.urlencoded(
//        	{extended:true}	
//        ))
        .use(function(req,res){  // this defines the handler
        	if(req.url == "/hello"){
        		console.log("sending plain");
        		res.statusCode = 200;
        		res.end("Hello from webapp as plaintext");
        	}
        	else if(req.url == "/hello.json"){
        		console.log("sending json");
        		var data = "Hello from webapp as json";
        		var jsonData = JSON.stringify(data);
        		res.statusCode = 200;
        		res.setHeader('Content-Type','application/json');
        		res.end(jsonData);
        	}
        	else if(req.url == "/statusCodeDemo"){
        		console.log("sending 404 status code");
        		res.statusCode = 404;
        		res.end("Oops, you caused an error");
        	}
        	else {
//            	var parsedInfo = {};
//            	parsedInfo.firstName = req.body.userFirstName;
//            	parsedInfo.lastName = req.body.userLastName;
//            	res.end("User info from parsed form: " + parsedInfo.firstName + " " + parsedInfo.lastName);        		
        		res.statusCode = 418;
        		res.end("Oops, I'm a teapot");
        	}
        })
        .listen(3456);

//http.createServer(app).listen(3456, 'localhost');
console.log("HTTP Server listening on port 3456");
