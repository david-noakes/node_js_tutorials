/**
 * update a movie item
 */
var AWS = require('aws-sdk');
AWS.config.update({region:'ap-south-2', endpoint: new AWS.Endpoint('http://localhost:8000'),
		accessKeyId:'accesskey', secretAccessKey:"dummy"});
var params = {
	TableName: "Movies",
    Key: {
        "year": 2013,
        "title": "Gravity"
   },
   ReturnValues: "ALL_NEW",
   UpdateExpression: "SET Score = :string",
   ExpressionAttributeValues: {
	   ":string": "8 out of 10"
   }
};

function onUpdateItem(err,data){
	if (err) {
		console.log(JSON.stringify(err, null, 2));
	} else {
		console.log(JSON.stringify(data, null, 2));
	}
	
}

//var ddb = new AWS.DynamoDB();
//ddb.getItem(params, onGetItem);
var docClient = new AWS.DynamoDB.DocumentClient();
docClient.update(params, onUpdateItem);
