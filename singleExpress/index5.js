/**
 * using the express router object
 */
console.log("using the express router object");

var express = require('express');
var port = 3456;
var app = express();
var router = express.Router();
var foodRouter = express.Router();


var foods = {
		'groups': {
			'fruits':['apples', 'bananas', 'cherries'],
			'vegetables':['brocoli', 'carrot', 'tomatoes'],
			'dairy':['milk', 'eggs', 'cheese'],
			'meats':['beef', 'chicken', 'lamb'],
			'grains':['oats','rice']
		}	
	};


// router
router.get('/home',function(req,res){
	res.end("Welcome to the homepage of our food app");
});

router.get('/aboutUs',function(req,res){
	res.end("This app displays information about foods and food groups");
});

//foodRouter: /foods/aboutUs  see below app.use('/foods', foodRouter)
foodRouter.get('/aboutUs',function(req,res){
	res.end("food groups are: fruits, vegetables, dairy, meats, grains");
});

foodRouter.get("/:group/:id",function(req,res){
	var id = req.params.id;
	// alternative method
	var group = req.params['group'];
	
	var responseBody = "";
	var allGroups = foods.groups;
	var selectedGroup = allGroups[group];
	var selectedFood;

	console.log("selectedGroup = " + selectedGroup);
	if (!selectedGroup){
		responseBody = "food group " + group + " does not exist";
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



app.use('/',router);
app.use('/foods', foodRouter);

app.listen(port, function(){
	console.log("Listening on port: " + port);
});
