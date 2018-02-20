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
  var request = new mySql.Request();
	request.query("select * from fd_groups",function(err,recordset){
		if(err) console.log(err);
		console.dir(recordset);
	});
};

var ps = new mySql.PreparedStatement(connexion);
var callback2 = function(err,result){
	if(err) throw err;
    ps.execute({name:'testfoodgroup',description:'test food group description'},function(err,result){
       if(err) throw err;
       console.log(result);
    })	
};

var connexion = new mySql.connect(config, callback1);

ps.input('name',mySql.Varchar(50));
ps.input('description',mySql.Varchar(50));
ps.prepare('insert into fd_groups (name,description) values (@name,@description)',callback2);