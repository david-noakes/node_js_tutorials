/**
 *  MEAN Stack configuration
 */
var mongoose = require('mongoose');

module.exports = function(config){
	
	mongoose.connect(config.dbx);
	
	var db = mongoose.connection;
	db.on('error',console.error.bind(console,'connection error'));
	db.once('open',function(){console.log('Connected to DB')});


}