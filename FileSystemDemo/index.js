/**
 * v0.0.1 - navigating directories
 */
console.log("Navigating Directories");


var fs = require('fs'); // core - no changes to package.json
var baseDir = 'DirectoryA'; 

// recurse version still needs work
var recurseDir=function(err,files){
	if (err){
		console.log(err);
	} else {
		console.log("--------- Directory Listing ---------");
		
		files.forEach(function(file){
			var filePath = baseDir + '/' + file;
			fs.stat(filePath,function(error,stats){
				if(error){
					console.log(error);
				} else if (stats) {
					if(stats.isFile()){
						console.log(file + " is a file");
					} else if(stats.isDirectory()) {
						console.log(file + " is a directory");
						fs.readdir(filePath, recurseDir);
					}
				}
			})
		})
	} 
};

fs.readdir(baseDir, recurseDir);
//fs.readdir(baseDir, function(err,files){
//	if (err){
//		console.log(err);
//	} else {
//		console.log("--------- Directory Listing ---------");
//		
//		files.forEach(function(file){
//			var filePath = baseDir + '/' + file;
//			fs.stat(filePath,function(error,stats){
//				if(error){
//					console.log(error);
//				} else if (stats) {
//					if(stats.isFile()){
//						console.log(file + " is a file");
//					} else if(stats.isDirectory()) {
//						console.log(file + " is a directory");
//						
//					}
//				}
//			})
//		})
//	}
//});

var contentsSync = fs.readdirSync(baseDir);
console.log(contentsSync);