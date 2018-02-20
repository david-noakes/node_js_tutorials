/**
 * v0.0.2 - TCP Client
 */
console.log("Creating a TCP Client Application");

var netMod = require('net');
var options = {
	port: 4567,
	host: "localhost"
};

var clientSocket = netMod.connect(options);

clientSocket.on('connect',function(){
	console.log("Client connected successfully");
});