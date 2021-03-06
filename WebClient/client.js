/**
 * 0.0.01 Basic web client GET
 * 0.0.02 add in POST
 * 0.0.03 add in request2 for event to 3457
 * 
 */
var request = require('request');
var request2 = require('request');
var fs = require('fs');

var nameData = {
	userFirstName: "Ana",
	userLastName: "Peronis"
}

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

request2("http://localhost:3457", function(error,response,body){
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

var options = {
	url:"http://localhost:3456/printRequestHeaders",
	headers:{'X-DEMO-HEADER':"myDemoHeader"}
}

var callback = function(error,response,body){
	if(error) console.log(error);
	else console.log(body);
}

request(options,callback);

// post goes here
request.post('http://localhost:3456').form(nameData);