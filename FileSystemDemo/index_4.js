/**
 * v0.0.4 - writing files
 */

console.log("Writing Files");
var fs = require('fs');
var data1 = "this is string 1";
var data2 = "this is string 2";

var callback1 = function(err){
	if(err){
		console.log(err);
	} else {
		console.log("data saved to file");
	}
};
var callback2 = function(err){
	if(err){
		console.log(err);
	} else {
		console.log("data appended to file");
	}
};
// asynchronous
fs.writeFile("DirectoryA/myTextText.txt", data1, callback1); // overwrites
fs.appendFile("DirectoryA/myTextText.txt", data2, callback2); // appends

