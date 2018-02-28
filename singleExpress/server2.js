/**
 * Handling Errors with the Domain Module
 */
console.log("Handling Errors with the Domain Module");

var cluster = require('cluster');
var http = require('http');

var port = 3456
var numProcesses = 3;
var numRunningSlaves = 0;

if (cluster.isMaster){
	console.log("Master");
	for(var i=0;i<numProcesses;i++){
		cluster.fork();
		numRunningSlaves++;
	}
	
	cluster.on("disconnect",function(worker,code,signal){
		console.log("A worker died. Forking a new process");
		numRunningSlaves--;
		if(numRunningSlaves < numProcesses){
			cluster.fork();
		}
	});
} else {
	var server = http.createServer(requestListener);
	server.listen(port,function(){
		console.log("slave http server online:" + process.pid);
	});
}

function requestListener(req,res){
	if(req.url == "/simulateError"){
		throw new Error("Simulated error");
	} else {
		res.end("Hi from our simple cluster based server");
	}
}

// this is needed to prevent a loop where new process is formed, process dies retrying
process.on('uncaughtException',function(error){
	console.log("Caught the exception:" + error.code);
	process.exit();
});