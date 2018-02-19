/**
 * v0.0.5
 */
console.log("Watching for Directory Changes");

var fs = require('fs');

var callback1 = function(event,filename){
	if(event == "rename"){
		console.log("rename event in directory: " + filename);
	} else if(event == "change"){
		console.log("change in directory: " + filename);
	} else {
		console.log("Unknown change:\n" + event + "\n" + filename);
	}
};

fs.watch("DirectoryA", {persistent:true}, callback1)