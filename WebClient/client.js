/**
 * 0.0.01 Basic web client 
 * 
 */
var request = require('request');
var fs = require('fs');

request("http://localhost:3456/hello", function(error,response,body){
	if(error){
		console.log(error);
	}
	//response.body
	console.log(response.body);
	
	//get status code
	console.log(response.statusCode);
	
	//see header
	console.log(response.headers);
})
.pipe(fs.createWriteStream('DataOut/pipedData.txt'));

var options = {
	url:"http://localhost:3456/printRequestHeaders",
	headers:{'X-DEMO-HEADER':"myDemoHeader"}
}

var callback = function(error,response,body){
	if(error) console.log(error);
	else console.log(body);
}

request(options,callback);