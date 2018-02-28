/**
 * Handling Errors with the Domain Module
 */
// *** this example code does not work ***
// restore to the looping version 

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
//	var server = http.createServer(function(req,res){
//		var domain = require('domain').create();
//		domain.on('error',function(error){
//			console.log("caught the error: " + error.code);
//			try {
//				var timeout = setTimeout(function(){
//					process.exit(1);
//				},10000);
//				timeout.unref();
//				server.close();
//				cluster.worker.disconnect();
//				res.statusCode = 500;
//				res.end("Something went wrong internally");
//			} catch (anotherError){
//				console.log("Error attempting to respond to domain error");
//			}
//		});
//	});
	server.listen(port,function(){
		console.log("slave http server online on port:" + port +" [pid:" + process.pid + "]");
	});
}

//this creates a loop where new process is forked, process dies retrying

function requestListener(req,res){
	if(req.url == "/simulateError"){
		throw new Error("Simulated error");
	} else {
		res.end("Hi from our simple cluster based server");
	}
}

//process.on('uncaughtException',function(error){
//	console.log("Caught the exception:" + error.code);
//	process.exit();
//});





