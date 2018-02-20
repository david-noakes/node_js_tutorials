/**
 * v0.0.2 - TCP Client
 */
console.log("Creating a TCP Client Application");

var netMod = require('net');
var options = {
	port: 4567,
	host: "localhost"
};
var demoClientName = "myUniqueClientId";
var clientSocket = netMod.connect(options);

clientSocket.on('connect',function(){
	console.log("Client connected successfully");
	var message = "I am a client with the address " + demoClientName + "\r\n";
	var dataSend = clientSocket.write(message, "utf8", function(){
		console.log("wrote somne data to server");
		console.log("   :   " + clientSocket.bytesWritten);
	});
	clientSocket.on('data',function(data){
		console.log("Received some data from server: ", data.toString());
	});
	clientSocket.on('drain',function(data){
		console.log("Buffer is now completely drained", data.toString());
	});
});