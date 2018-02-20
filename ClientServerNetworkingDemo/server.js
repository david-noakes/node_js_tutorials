/**
 * v0.0.1 - tcp server
 * v0.0.2 - close of numConnections > 1
 */
console.log("Creating a TCP server using the Net Module");

var netMod = require('net');
var server = netMod.createServer();
var numConnections = 0;
var clientSocket;

var callbackFunction = function(socket){
	console.log("TCP Server has received a connection");
	clientSocket = socket;
	numConnections++;
	socket.write("Welcome. there are " + numConnections + " active connections");
//	if(numConnections > 1){
//		console.log("Closing server");
//		server.close(function(){
//			console.log("Server fully closed");
//		});
//	}
	server.getConnections(function(err,count){
		if(!err) console.log("Concurrent connections: " + count);
	})
}; 
server.on('connection', callbackFunction);

server.on('data',function(data){
	console.log("Received some data", data.toString());
	if(clientSocket){
		clientSocket,write("Thanks for dropping by\r\n");
	}
})

server.maxConnections = 2;
server.listen(4567,function(){
	console.log("TCP server listening on 4567");
})