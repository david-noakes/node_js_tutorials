/**
 * building a restful api
 */
console.log("Building a RESTful API");

var express = require('express');
var bodyParser = require('body-parser');
var AWS = require('aws-sdk');
AWS.config.update({region:'ap-south-2', endpoint: new AWS.Endpoint('http://localhost:8000'),
		accessKeyId:'accesskey', secretAccessKey:"dummy"});
var ddb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();
//var npm_dynamodb = require('dynamodb');
var npm_dynamodb_model = require('dynamodb-model');

// model type 1 Joi does not exist - resolve later
//var islandsSchemaDB =  new npm_dynamodb.define('islands',{
//    hashKey: "_id",
//    schema:{
//    	_id: Joi.string()._id(),
//		name: Joi.string(),
//		population: Joi.number(),
//		popularFor: Joi.string
//    }
//  });

//model type 2
var islandsSchema =  new npm_dynamodb_model.Schema({
    _id: {type: String, key: 'hash'},
	name:String,
	population: Number,
	popularFor: String  
  });

var params = {
		TableName: "islands"
	};

var app = express();

//--------------------------------------------------
var router = express.Router();
router.route('/islands')
.post(function(req,res){
	// CREATE a new island document
	console.log("POST /api/islands");
	res.header("Content-Type",'application/json');
//	res.header("Content-Type",'application/xml');
//	res.header("Content-Type",'text/text');
//	res.json("CREATE a new island document");
	res.end("CREATE a new island document");
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


app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use('/api',router);
//--------------------------------------------------
var port = 3456;
app.listen(port,function(){
	console.log("RESTful API online @" + port);
});
