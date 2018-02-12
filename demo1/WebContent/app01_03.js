console.log("NPM Modules");

var _ = require('underscore');
var names = [ "Ana", "Danny", "Nalini", "Saodat", "Paula", "Jarnissa"];

_.each(names, function(name){
	console.log("Name is: "+ name);
})