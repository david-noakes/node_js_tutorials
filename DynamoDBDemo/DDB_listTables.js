/**
 * list tables in dynamodb
 */
/*
String DYNAMO_HOST = "http://localhost:8000";
String DYNAMO_REGION = Regions.AP_SOUTHEAST_2.getName();
String AWS_ACCESS_KEY_ID = "accesskey";
String AWS_SECRET_ACCESS_KEY = "dummy";
*/
var AWS = require('aws-sdk');
AWS.config.update({region:'ap-south-2', endpoint: new AWS.Endpoint('http://localhost:8000'),
		accessKeyId:'accesskey', secretAccessKey:"dummy"});
var params = {
	Limit: 10	
};

var ddb = new AWS.DynamoDB();
ddb.listTables(params, function(err, data){
	if (err) {
		console.log(err, err.stack);
	} else {
		for (var i=0;i<data.TableNames.length;i++) {
			console.log(data.TableNames[i]);
		}
	}
});