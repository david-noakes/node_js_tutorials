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
/* reequest body is in this format
 {"body":{
	"name": "Mystique",
	"population": 125000,
	"popularfor": "relaxation, sexy women"
	}
  }
*/
	console.log("input:"+JSON.stringify(req.body.body) + "\n");
	var body = req.body.body;
	var name = req.body.body.name;
	var popularfor = req.body.body.popularfor;
	var population = req.body.body.population;
	
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
	res.end("RETRIEVE all island documents");
});

router.route('/islands/:id')
.post(function(req,res){
	// CREATE/UPDATE a new island document by id
	var id = req.params.id;
	res.header("Content-Type",'application/json');
	res.end("POST /api/islands/" + id + "   CREATE/UPDATE a new island document by id");
})
.get(function(req,res){
	//RETRIEVE a single island document by id
	var id = req.params.id;
	res.header("Content-Type",'application/json');
	res.end("/GET /api/islands/" + id + "   RETRIEVE a single island document by id");
})
.put(function(req,res){
	//UPDATE a single island document by id
	var id = req.params.id;
	res.header("Content-Type",'application/json');
	res.end("/PUT /api/islands/" + id + "   UPDATE a single island document by id");
})
.delete(function(req,res){
	//DELETE a single island document by id
	var id = req.params.id;
	res.header("Content-Type",'application/json');
	res.end("/POST /api/islands/" + id + "   DELETE a single island document by id");
});


app.use('/api',router);
//--------------------------------------------------
var port = 3456;
app.listen(port,function(){
	console.log("MongoDB RESTful API online @" + port);
});
