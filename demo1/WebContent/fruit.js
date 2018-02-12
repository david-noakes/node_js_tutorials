/**
 * this is another module. it has exports
 * note that this.xxx is different from var xxx
 */

// don't do this - refer to fruit1.js for the correct method

var name = "Apple";
var description = "Fruit from the apple tree";

module.exports = function(){
	var functions = {
		setName: function(nameIn){
			this.name = nameIn;
		},
		
		setDescription: function(descriptionIn){
			this.description = descriptionIn;
		},
		
		getInfo: function(){
			return {name: name, description: description, 
				thisName: this.name, thisDesc: this.description}
		}
			
	};
	
	return functions;
}
