/**
 * 0.0.01 - WebServer
 * 0.0.02 - process POST
 */
var connect = require('connect');
var port = 3456;
var version = "0.0.02";
var formidable = require('formidable');

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
    	else if(req.method.toLowerCase() == "post") {
    		var form = new formidable.IncomingForm();
    		//configure the form
    		form.uploadDir = __dirname + '/uploads';
    		form.keepExtensions = true;
    		form.type = "multipart";
    		//console.log(form);
    		
    		form.parse(req, function(err,fields,files){
    			// parse fields
        		//console.log("fields:" + fields);
    			var firstName = fields.userFirstName;
    			var lastName = fields.userLastName;
    			console.log("User info parsed from form: " + firstName + " " + lastName);
    			res.writeHead(200, {'content-type': 'text/plain'});
    			res.end("Form data received");
    		});
    		return;
    	}
    	else {
    		res.end("Nothing else matched");
    	}
    });
webApp.listen(port);

console.log("webserver v" + version + " listening on port " + port);