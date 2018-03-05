/**
 * foodServce.js
 */

angular.module('FoodService',[]).factory('Food',['$http','$q',function($http,$q){
	
	return {
		
		getAll:function(){
			var deferred = $q.defer();
			
			$http.get('/api/foods')
			    .success(function(data){
			    	console.log(data);
			    	deferred.resolve(data);
			    })
			    .error(function(err){
			    	console.log(err);
			    	deferred.reject(err);
			    });
			return deferred.promise;
		},
		get:function(id){
			var deferred = $q.defer();
			$http.get('/api/food/id?id=' + id)
			    .success(function(data){
			    	deferred.resolve(data);
			    })
			    .error(function(err){
			    	deferred.reject(err);
			    });
			return deferred.promise;
		},
		create:function(foodData){
			var deferred = $q.defer();
			$http.post('/api/foods',foodData)
			    .success(function(data){
			    	deferred.resolve(data);
			    })
			    .error(function(err){
			    	deferred.reject(err);
			    });
			return deferred.promise;
		},
		update:function(id,foodData){
			var deferred = $q.defer();
			$http.put('/api/food/id',foodData)
			    .success(function(data){
			    	deferred.resolve(data);
			    })
			    .error(function(err){
			    	deferred.reject(err);
			    });
			return deferred.promise;
			
		},
		del:function(id){
			var deferred = $q.defer();
			$http.post('/api/food/id')
			    .success(function(data){
			    	deferred.resolve(data);
			    })
			    .error(function(err){
			    	deferred.reject(err);
			    });
			return deferred.promise;
			
		}
	};
}]);