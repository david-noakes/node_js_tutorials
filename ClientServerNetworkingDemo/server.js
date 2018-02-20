/**
 * v0.0.1 - tcp server
 * v0.0.2 - close of numConnections > 1
 * v0.0.3 - 
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
	socket.write("Welcome, you are now connected");
	server.getConnections(function(err,count){
		if(!err) console.log("Concurrent connections: " + count);
	});
	socket.on('data',function(data){
		console.log("Received some data", data.toString());
		if(clientSocket){
			clientSocket.write("Thanks for dropping by\r\n");
		}
	});
	socket.on('error',function(e){
		console.log("error caught:" + e.code);
	});
	socket.on('close', function(had_error){
		var message = "Client disconected";
		message += had_error ? " due to error " : " normally";
		console.log(message);
	});

}; 
server.on('error',function(e){
	console.log("Error caught:" + e.code);
	if(e.code == 'EADDRINUSE'){
		console.log("Switching to fallback port");
		setTimeout(function(){
			server.listen(4568, function(){
				console.log("Listening on port 4568");
			});
		}, 1000);  // miliseconds
	}
})
server.on('connection', callbackFunction);


server.maxConnections = 2;
server.listen(4567,function(){
	console.log("TCP server listening on 4567");
});