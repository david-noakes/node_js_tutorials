/**
 * v0.0.4 - using socket io
 */
console.log("Using socket.io");

var http = require('http');
var fs = require('fs');
var index = fs.readFileSync(__dirname + '/index.html');	
var server = http.createServer(function(request, response) {
	response.writeHead(200, {'Content-Type':'text/html'});
	response.end(index);
});
var io = require('socket.io')(server);

io.on('connection',function(socket){
	console.log("connection detected");
	io.emit("newConnection",{id:socket.id});
	socket.on('disconnect',function(){
		console.log("client disconnected");
		io.emit("clientDisconnected",{id:socket.id});
	});
	socket.on('chat',function(data){
		var message = data.message;
		// listen for chat event and send it back
		io.emit("chat",data);
	});
});

var port = 3456;
server.listen(port, function() {
	console.log("Server listening on port:" + port);
});