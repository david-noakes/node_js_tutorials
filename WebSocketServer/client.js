/**
 * v0.0.1 - simple websocket client
 */
var websocket = require('websocket');

var WebSocketClient = websocket.client;
var wsClient = new WebSocketClient();

wsClient.on('connectFailed',function(error){
	console.log("Could not connect to server", error.toString());
});

wsClient.on('connect',function(connection){
	console.log("client connected successfully");
	connection.on('close',function(){
		console.log("The connection was closed");
	});
	connection.on('message', function(message) {
		var messageType = message.type;
		if(messageType === "utf8"){
			console.log("Client received UTF8 message: " + message.utf8Data);
		} else if (messageType === 'binary'){
			console.log("Client received binary message. Length " + message.binaryData.length);
		}
		
	});
	function sendRandomFruitEverySoOften(){
		var fruits = ['Apple','Apricot',"Banana",'Cherry','Plum'];
		if(connection.connected){
			var message = fruits[Math.floor(Math.random() * fruits.length)];
			connection.sendUTF(message);
			setTimeout(sendRandomFruitEverySoOften,Math.floor(Math.random() * 3000 + 3000));
		}
	}
	
	sendRandomFruitEverySoOften();
});

wsClient.connect("ws://localhost:3456", "demo-protocol");