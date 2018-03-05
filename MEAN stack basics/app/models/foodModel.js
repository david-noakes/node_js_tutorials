/**
 * MEAN Stack refactoring
 */
var mongoose = require('mongoose');

var foodSchema = mongoose.Schema({
	name:String,
	servingSize:String,
	calories:Number,
	gramsCarbs:Number,
	gramsProtein:Number,
	gramsFat:Number
});

module.exports = mongoose.model('Food',foodSchema);