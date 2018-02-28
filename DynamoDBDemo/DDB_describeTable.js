/**
 * describe table
 */
var AWS = require('aws-sdk');
AWS.config.update({region:'ap-south-2', endpoint: new AWS.Endpoint('http://localhost:8000'),
		accessKeyId:'accesskey', secretAccessKey:"dummy"});
var params = {
	TableName: 'Movies'	
};

var ddb = new AWS.DynamoDB();
ddb.describeTable(params, function(err, data){
	if (err) {
		console.log(JSON.stringify(err, null, 2));		
	} else {
		console.log(JSON.stringify(data, null, 2));
	}
});

var params2 = {
		TableName: 'VerificationGroup'	
};

ddb.describeTable(params2, function(err, data){
	if (err) {
		console.log(JSON.stringify(err, null, 2));		
	} else {
		console.log(JSON.stringify(data, null, 2));
	}
});

var params3 = {
		TableName: 'Wines'	
};

ddb.describeTable(params3, function(err, data){
	if (err) {
		console.log(JSON.stringify(err, null, 2));		
	} else {
		console.log(JSON.stringify(data, null, 2));
	}
});

var params4 = {
		TableName: 'islands'	
};

ddb.describeTable(params4, function(err, data){
	if (err) {
		console.log(JSON.stringify(err, null, 2));		
	} else {
		console.log(JSON.stringify(data, null, 2));
	}
});
