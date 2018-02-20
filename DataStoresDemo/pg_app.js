/**
 * v0.0.3 postgres
 */

console.log("connecting to a PostgreSQL Server");

var pgDB = require('pg');
var conString = "postgres://postgres:password@localhost:5432/myDemoDb";

var callback1 = function(err,result){
    done();
    if(err){
    	return console.error("there was an error running the query",err);
    }
    console.log(result.rows);
};

pgDB.connect(conString,function(err,client,done){
	if(err){
		return console.log("error getting a client from postgres", err);
	}
	client.query("SELECT * FROM foodgroups",callback1);
});
