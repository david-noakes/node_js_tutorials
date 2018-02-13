/**
 * change 0.0.04 - client application
 */
var request = require('request');

request('http://www.fuguesoftware.com',function(error, response, body){
	if (!error && response.statusCode == 200) {
		console.log("=======  status 200 response  ========");
		console.log(body);
	}
	if (error){
		console.log("=======  status error response  ========");
		console.log(error);
	}
});