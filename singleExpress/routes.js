/**
 * v002 - file for routes
 */
var routes = {
	fruits: function(req,res){
		res.end("welcome to the app page abot fruits");
	},
	veg: function(req,res){
		res.end("welcome to the app page about vegies");
	},
	dairy: function(req,res){
		res.end("welcome to the app page about dairy");
	},
	meats: function(req,res){
		res.end("welcome to the app page about meats");
	},
	grains: function(req,res){
		res.end("welcome to the app page about grains");
	}


};

module.exports= routes;