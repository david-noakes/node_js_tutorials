/**
 * create dynamoDB table
 */
var AWS = require('aws-sdk');
AWS.config.update({region:'ap-south-2', endpoint: new AWS.Endpoint('http://localhost:8000'),
		accessKeyId:'accesskey', secretAccessKey:"dummy"});
var params = {
  "AttributeDefinitions": [
    {
      "AttributeName": "WineName",
      "AttributeType": "S"
    },
    {
      "AttributeName": "Vintage",
      "AttributeType": "S"
    }
  ],
  "KeySchema": [
      {
        "AttributeName": "WineName",
        "KeyType": "HASH"
      },
      {
        "AttributeName": "Vintage",
        "KeyType": "RANGE"
      }
    ],
    "ProvisionedThroughput": {
        "ReadCapacityUnits": 10,
        "WriteCapacityUnits": 10
      },
      "TableName": "WinesXX"
};

var ddb = new AWS.DynamoDB();
ddb.createTable(params, function(err, data){
	if (err) {
		console.log(JSON.stringify(err, null, 2));
	} else {
		console.log(JSON.stringify(data, null, 2));
	}
});
