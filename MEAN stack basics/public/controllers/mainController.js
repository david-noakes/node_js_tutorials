/**
 * http://usejsdoc.org/
 */
angular.module('foodApp').controller('mainController',function($scope,Food){
	
	$scope.foods = [];
	$scope.activefoodItem = {};
	$scope.showDetailsForm = false;
	$scope.showCreateForm = false;
	//Configuring controllers and the index page. Still to be done
	
	$scope.getAllFoods = function(){
		
    	console.log("mainController::getAllFoods ");
		Food.getAll()
		    .then(function(data){
		    	$scope.foods = data;
		    },
		    function(err){
		    	console.log("Could not load foods");
		    });
	}
	
	$scope.getAllFoods();
	
	$scope.createFood = function(data){
		
		Food.create(data)
		    .then(function(data){
		    	console.log("food created");
		    	$scope.getAllFoods();
		    },function(err){
		    	console.log("coult not create food");
		    });
		$scope.showCreateForm = false;
	}
	
	$scope.updateFood = function(foodItem){
		
		Food.update(foodItem._id, foodItem)
		    .then(function(data){
		    	console.log("food updated");
		    	$scope.foods.concat(data);
		    	
		    	$scope.showDetailsForm = false;
		    	$scope.activefoodItem = {};
		    },function(err){
		    	console.log("could not update food");
		    	$scope.showDetailsForm = false;
		    	$scope.activefoodItem = {};
		    });
	}
	
	$scope.deleteFood = function(foodItem){
		
		console.log("delete food");
		Food.del(foodItem._id)
		    .then(function(data){
		    	console.log("food item deleted");
		    	$scope.getAllFoods();
		    },function(err){
		    	console.log("could not delete food");
		    	$scope.showDetailsForm = false;
		    	$scope.activefoodItem = {};
		    });
	}
	
	$scope.shoeDetails = function(foodItem){
		
		console.log(foodItem);
    	$scope.showDetailsForm = true;
    	$scope.activefoodItem = foodItem;
    	
	}
});