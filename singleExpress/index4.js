/**
 * Working with route Parameters in Express
 */
console.log("Working with route Parameters in Express");

var express = require('express');
var _score = require('underscore');
var app = express();
var port = 3456;

var foods = {
	'groups': {
		'fruits':['apples', 'bananas', 'cherries'],
		'vegetables':['brocoli', 'carrot', 'tomatoes'],
		'dairy':['milk', 'eggs', 'cheese'],
		'meats':['beef', 'chicken', 'lamb'],
		'grains':['oats','rice']
	}	
};

// basic route
app.get('/fruits',function(req,res){
	var responseBody = "Examples of Fruits: ";
	var allFruits = foods.groups.fruits;
	_score.each(allFruits,function(fruit){
		responseBody += fruit + ", ";
	});
	res.end(responseBody);
});

// parameterised route
app.get("/fruits/:id",function(req,res){
	var id = req.params.id;
	// alternative method
	var id1 = req.params['id'];
	
	var responseBody = "";
	var allFruits = foods.groups.fruits;
	var selectedFruit = allFruits[id];
	
	if (!selectedFruit) {
		responseBody = "fruit does not exist";
	} else {
		responseBody = "Fruit with id " + id + " is " + selectedFruit;
	}
	res.end(responseBody)
});

//parameterised route
app.get("/:group/:id",function(req,res){
	var id = req.params.id;
	// alternative method
	var group = req.params['group'];
	
	var responseBody = "";
	var allGroups = foods.groups;
	var selectedGroup = allGroups[group];
	var selectedFood;

	console.log("selectedGroup = " + selectedGroup);
	if (!selectedGroup){
		responseBody = "food group does not exist";
	} else {
		selectedFood = selectedGroup[id];
		if (!selectedFood) {
			responseBody = "food does not exist for group:" + group;
		} else {
			responseBody = "group with name " + group +", food with id "  
			+ id + " is " + selectedFood;
		}
	}
	
	res.end(responseBody)
});

app.listen(port, function(){
	console.log("Listening on port: " + port);
});
