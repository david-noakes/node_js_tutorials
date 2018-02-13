console.log("Basic HTTP server v0.0.02 - Process POST request");
/*
 * change 0.0.02 dependencies in package.json require >npm install
 * to use pages/userForm.html we need to enter
 * file:///D:/Warehouse/git_clones/node_js_tutorials/web_server_demo/pages/userForm.html
 */

var http = require('http');
var connect = require('connect');
var bodyParser = require('body-parser');

//var handlerMethod = function(req,res){
//	res.end("A simple response from the simple web server");
//}

var app = connect()
        .use(bodyParser.urlencoded(
        	{extended:true}	
        ))
        .use(function(req,res){  // this defines the handler
        	var parsedInfo = {};
        	
        	parsedInfo.firstName = req.body.userFirstName;
        	parsedInfo.lastName = req.body.userLastName;
        	
        	res.end("User info from parsed form: " + parsedInfo.firstName + " " + parsedInfo.lastName);
        });

http.createServer(app).listen(3456, 'localhost');
console.log("HTTP Server listening on port 3456");
