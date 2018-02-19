/**
 * v0.0.3 - reading files
 */

var fs = require('fs');

var callBack1 = function(err,data){
	if(err){
		console.log(err);
	} else {
		console.log(data);
	}
};

fs.readFile("DirectoryA/text1","utf8", callBack1);

// synchronous
var contents = fs.readFileSync("DirectoryA/text1","utf8");
console.log("synchronous \n" + contents);