/**
 * v0.0.1 - mySql
 */
console.log("Connecting to a MySQL Server");
var mySql = require('mysql');
var underscore = require('underscore');

var connection = mySql.createConnection({
	user:'admin',
	password:'admin',
	database:'myDemoDb',
	host:'localhost',
	port:'3306'
});

connection.connect(function(err){
	if(err){
		throw new Error('Could not connect to db');
	}
});

var queryString = "SELECT * FROM foodgroups";
connection.query(queryString, function(err,rows,fields){
	if(err){
		throw new error('Error performing query');
	}
	underscore.each(rows,function(row){
		console.log(row.id, row.name, row.description);
	})
});

var insertString = "INSERT INTO foodgroups SET ?";
var insertObj = { name:'testFoodGroupName', descriotion:'test food group description'};
var queryString = mySql.format(insertString, insertObj);

var qry2 = connection.query(queryString, function(err, result){
	if(err){
		throw new error('Error performing insert');
	}
	console.log(result);
});