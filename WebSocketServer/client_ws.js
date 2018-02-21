/**
 * v0.0.3 - ws client
 */
console.log("Working with Websocket using ws");

var WebSocket = require('ws');
var wsClient = new WebSocket('ws://localhost:3456');

wsClient.on('open',function(){
	console.log("socket open. Client connected to server");
	wsClient.send("Hi from web socket client", function(err){
		if(err){
			console.log("error sending to server", err);
			return;
		}
		console.log("Client successfully sent message to server");
	});
	wsClient.on("message",function(data,flags){
		console.log("Client received data: ", data);
		//data.binary is set if data is binary
		//otherwise it is utf8 encoded
		//flags.masked is set if data was masked
		console.log(flags);  // *** Note this is UNDEFINED
	});
});