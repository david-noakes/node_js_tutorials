/**
 * this is another module. it has exports
 */

module.exports = function(name, description){
	
	var name = name;
	var description = description;

	var functions = {
		setName: function(nameIn){
			this.name = nameIn;  // do not use this to set things it does not refer to the vars above
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
