/**
 * v0.0.1 - tcp server
 */
console.log("Creating a TCP server using the Net Module");

var netMod = require('net');
var server = netMod.createServer();
var numConnections = 0;

var callbackFunction = function(socket){
	console.log("TCP Server has received a connection");
	numConnections++;
	socket.write("Welcome. there are " + numConnections + " active connections");
}; 
server.on('connection', callbackFunction);

server.listen(4567,function(){
	console.log("TCP server listening on 4567");
})