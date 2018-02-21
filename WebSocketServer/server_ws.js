/**
 * v0.0.3 - using ws only
 */
console.log("working with WebSockets using ws");

var ws = require('ws');
var WebSocketServer = ws.Server;
var wss = new WebSocketServer({host:'localhost', port:3456});

console.log("Websocket listening on port 3456");

wss.on('connection',function(ws){
	
	ws.on('message',function(message){
		console.log("server received message: " + message);
		ws.send("Thanks for the message.:>" + message,function(err){
			if(err){
				console.log("Error sending to client", err);
				return;
			}
			console.log("server got message and echoed back to client");
		});
	});
});