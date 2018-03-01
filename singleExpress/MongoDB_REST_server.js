/**
 * building a restful api
 */
console.log("MongoDB via REST API");

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//------------------------------------------------

mongoose.connect('mongodb://localhost/tutorials');
var db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error'));

//create schema
var islandsSchema =  mongoose.Schema({
	name: String,
	population: Number,
	popularFor: String  
  });

// create model that uses schema
var Island = mongoose.model('Island',islandsSchema);

//--------------------------------------------------


var app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


//--------------------------------------------------
var router = express.Router();
router.route('/islands')
.post(function(req,res){
	// CREATE a new island document
	console.log("POST /api/islands");
	res.header("Content-Type",'application/json');
/* request body is in this format
 {
	"name": "Mystique",
	"population": 125000,
	"popularfor": "relaxation, sexy women"
  }
*/
	console.log("input:"+JSON.stringify(req.body) + "\n");
	var body = req.body;
	var name = req.body.name;
	var popularfor = req.body.popularfor;
	var population = req.body.population;
	
	var island = new Island({
		name:name,
		population:population,
		popularFor:popularfor
	});
	console.log(" name:" + name + ", population:" + population + ", popularFor:" + popularfor);
	island.save(function(err,island){
		if(err) res.send({error:err});
		res.json({message: 'Island added', island:island});
	});
})
.get(function(req,res){
	//RETRIEVE all island documents
	console.log("GET /api/islands");
	res.header("Content-Type",'application/json');
	//res.end("RETRIEVE all island documents");
	Island.find({},function(err,islands){
		if (err) res.send({error:err});
		res.json(islands);
	});
});

router.route('/islands/:id')
.post(function(req,res){
	// CREATE/UPDATE a new island document by id
/*
 {
	"id":"5a9795587b61f72f9cd3bf5a",  ** OR spaces
	"name": "St. Claire",
	"population":234000,
	"popularfor":" fun in the sun, fun after dark"
}

 */	
	console.log("input:"+JSON.stringify(req.body) + "\n");
	console.log("POST /api/islands/id   CREATE/UPDATE a new island document by id");
	var id = req.body.id;
	var name = req.body.name;
	var popularfor = req.body.popularfor;
	var population = req.body.population;

	console.log("  id:" + id + ", name:" + name + ", population:" + population + ", popularFor:" + popularfor);
	res.header("Content-Type",'application/json');
	if (id) {
	Island.findById(id,function(err,island){
		if (err) res.send({error:err});
		
		island.name = name;
		island.population = population;
		island.popularFor = popularfor;
		island.save(function(err, island){
			if (err) res.send({error:err});
			res.json({message: "Island Updated," + island });
		});
		
	});
	} else {
		var island = new Island({
			name:name,
			population:population,
			popularFor:popularfor
		});
		console.log(" name:" + name + ", population:" + population + ", popularFor:" + popularfor);
		island.save(function(err,island){
			if(err) res.send({error:err});
			res.json({message: 'Island added', island:island});
		});
	}
})
.get(function(req,res){
	//RETRIEVE a single island document by id
	var id = req.params.id;
	if(id == "id") id = req.query.id;
	console.log(JSON.stringify(req.params));
	console.log(JSON.stringify(req.query));
	res.header("Content-Type",'application/json');
//	res.end("/GET /api/islands/" + id + "   RETRIEVE a single island document by id");
	Island.findById(id,function(err,islands){
		if (err) res.send({error:err});
		res.json(islands);
	});

})
.put(function(req,res){
	//UPDATE a single island document by id
/*
 {
	"id":"5a9795587b61f72f9cd3bf5a",
	"name": "St. Claire",
	"population":234000,
	"popularfor":" fun in the sun, fun after dark"
}

 */	
	console.log("input:"+JSON.stringify(req.body) + "\n");
//	console.log(JSON.stringify(req.params));
//	console.log(JSON.stringify(req.query));
	//var id = req.params.id;
	var id = req.body.id;
	var name = req.body.name;
	var popularfor = req.body.popularfor;
	var population = req.body.population;

	console.log("  id:" + id + ", name:" + name + ", population:" + population + ", popularFor:" + popularfor);
	res.header("Content-Type",'application/json');
	Island.findById(id,function(err,island){
		if (err) res.send({error:err});
		
		island.name = name;
		island.population = population;
		island.popularFor = popularfor;
		island.save(function(err, island){
			if (err) res.send({error:err});
			res.json({message: "Island Updated," + island });
		});
		
	});

})
.delete(function(req,res){
	//DELETE a single island document by id
/*
{
	"id":"5a9789bfaaa60315acca986b"
}

 */	
	console.log("/POST /api/islands/id   DELETE a single island document by id");
	console.log("input:"+JSON.stringify(req.body) + "\n");

	var id = req.body.id;
	console.log("  id:" + id);
	res.header("Content-Type",'application/json');
	Island.findById(id,function(err,island){
		if (err) res.send({error:err});
		// not found is not an error, but will crash removing null
		if(island){
			island.remove({_id:id},function(err,island){
				if (err) res.send({error:err});
				console.log("island = " + JSON.stringify(island));
				res.json({message: "Island Deleted," + island });
			});
	    } else {
			res.json({message: "Island could not be deleted," + id });
	    }
		//res.json({message: "Island would be deleted," + island });
	});
});


app.use('/api',router);
//--------------------------------------------------
var port = 3456;
app.listen(port,function(){
	console.log("MongoDB RESTful API online @" + port);
});
