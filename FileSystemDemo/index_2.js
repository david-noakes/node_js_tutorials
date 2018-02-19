/**
 * v0.0.2 - adding and removing directories
 */
console.log("Adding and removing directories");
var fs = require('fs');

var callbackFunction1 = function(err){
	if(err) {
		console.log(err);
	} else {
		console.log("Directory created");
	}
};
var callbackFunction2 = function(err){
	if(err) {
		console.log(err);
	} else {
		console.log("Directory removed");
	}
};

fs.mkdir("DirectoryA/DirectoryE", callbackFunction1);

fs.rmdir("DirectoryA/DirectoryE", callbackFunction2);