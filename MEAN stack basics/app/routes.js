/**
 * MEAN Stack refactoring
 */
var express = require('express');
var Food = require('./models/foodModel');

module.exports = function(app){
	
	var router = express.Router();
	
	router.route('/foods')
	.post(function(req,res){
		// create and store a new food document based on passed in data
//		res.end("create and store a new food document based on passed in data");
		var name = req.body.name;
		var servingSize = req.body.servingSize;
		var calories = req.body.calories;
		var gramsCarbs = req.body.gramsCarbs;
		var gramsProtein = req.body.gramsProtein;
		var gramsFat = req.body.gramsFat;
		
		console.log("POST /foods: " + req.body);
		
		var food = new Food({
			//_id:id,
			name:name,
			servingSize:servingSize,
			calories:calories,
			gramsCarbs:gramsCarbs,
			gramsProtein:gramsProtein,
			gramsFat:gramsFat
		});
		
		food.save(function(err,food){
			if(err) {res.send({error:err});}
			res.json({message:'Food item added',food:food});
		});
	})
	.get(function(req,res){
		//return a list of food documents from collection
		//res.end("return a list of food documents from collection");
		console.log("GET /foods: " + req.body);
		
		Food.find({},function(err,foods){
			if (err) { res.send({error:err});}
			res.json(foods);
		});
	});

	//router.route('/foods/:id')  // work with food documents using id
	router.route('/food/id')  // work with food documents using id
	.get(function(req,res){
		//return a specific food document identified by id
		//res.end("return a specific food document identified by id");
		var id = req.query.id;
		Food.findById(id,function(err,food){
			if (err) { res.send(({error:err}));}
			res.json(food);
		});
	})
	.put(function(req,res){
		//update a specific food document identified by id
		//res.end("update a specific food document identified by id");
		
		var id = req.body.id;
		
		if (id) {
			Food.findById(id, function(err,food){
				if (err) { res.send({error:err});}
				food.name = req.body.name;
				food.servingSize = req.body.servingSize;
				food.calories = req.body.calories;
				food.gramsCarbs = req.body.gramsCarbs;
				food.gramsProtein = req.body.gramsProtein;
				food.gramsFat = req.body.gramsFat;
				
				food.save(function(err,food){
					if(err) {res.send({error:err});}
					res.json({message:'Food item updated',food:food});
				});
				
			});
		} else {
			res.end("update a food failed because id was undefined");
		}
		
	})
	.post(function(req,res){
		//update a specific food document identified by id
		//res.end("update a specific food document identified by id");
		
		var id = req.body.id;
		
		if (id) {
			Food.findById(id, function(err,food){
				if (err) { res.send({error:err});}
				food.name = req.body.name;
				food.servingSize = req.body.servingSize;
				food.calories = req.body.calories;
				food.gramsCarbs = req.body.gramsCarbs;
				food.gramsProtein = req.body.gramsProtein;
				food.gramsFat = req.body.gramsFat;
				
				food.save(function(err,food){
					if(err) {res.send({error:err});}
					res.json({message:'Food item updated',food:food});
				});
				
			});
		} else {
			res.end("update a food failed because id was undefined");
		}

	})
	.delete(function(req,res){
		//delete a specific food document identified by id
		//res.end("delete a specific food document identified by id");
		
		var id = req.body.id;
		
		if (id) {
			Food.findById(id, function(err,food){
				if (err) { res.send({error:err});}
				
				if (food) {
					food.remove(function(err,food){
						if(err) {res.send({error:err});}
						res.json({message:'Food item deleted',food:food});
					});
					
			    } else {
					res.json({message: "food could not be deleted," + id });
			    }
				
			});
		} else {
			res.end("delete a food failed because id was undefined");
		}

	});

	var indexRouter = express.Router();

	indexRouter.get("/*",function(req,res){
		//res.end("You will be getting back the angular single page app");
		res.sendFile(__dirname + '/views/index.html');
	//})
	//.post("/*",function(req,res){
//		//res.end("You will be getting back the angular single page app");
//		res.sendFile(__dirname + '/public/index.html');
	});

	// set app to use our routers
	app.use('/api',router);
	app.use('/',indexRouter);

}