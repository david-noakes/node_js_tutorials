/**
 * v0.0.2 MSSSQL
 */
console.log("Conecting to MSSQL database");

var mySql = require('mssql');
var config = {
	user: 'mydemouser',
	password: '1234567',
	server:'localhost',
	database:"mydemodb",
	options: {
		instanceName:"DEMOSQLEXPRESS"
	}
};

var callback1 = function(err){
  if(err) console.log(err);	
  var request = new sql.Request();
	request.query("select * from fd_groups",function(err,recordset){
		if(err) console.log(err);
		console.dir(recordset);
	});
};

var connexion = new mySql.connect(config, callback1);