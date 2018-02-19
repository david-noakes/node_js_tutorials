/**
 * v.0.0.6 - watching for file changes
 */
console.log("Watching for File Changes");

var fs=require('fs');
var nameOfFile="DirectoryA/text1.txt";
var callback1 = function(event,filename){
	console.log("change in watched file: " + filename);
};

//fs.watch(nameOfFile, {persistent:true}, callback1);
fs.watchFile(nameOfFile, {persistent:true, interval: 5000}, callback1);