/**
 * create and load the islands table for node.js tutorial
 */
var AWS = require('aws-sdk');
AWS.config.update({region:'ap-south-2', endpoint: new AWS.Endpoint('http://localhost:8000'),
		accessKeyId:'accesskey', secretAccessKey:"dummy"});
var params = {
  "AttributeDefinitions": [
	    {
	      "AttributeName": "_id",
	      "AttributeType": "S"
	    }
    ],
  "KeySchema": [
      {
        "AttributeName": "_id",
        "KeyType": "HASH"
      }
    ],
    "ProvisionedThroughput": {
        "ReadCapacityUnits": 10,
        "WriteCapacityUnits": 10
      },
      "TableName": "islands"
};

var ddb = new AWS.DynamoDB();
//ddb.createTable(params, function(err, data){
//	if (err) {
//		console.log(JSON.stringify(err, null, 2));
//	} else {
//		console.log(JSON.stringify(data, null, 2));
//	}
//});

var params1 = {
    TableName: "islands",
    Item:{
	    "_id": { S:"aaabbbcccdddeeefff111222"},
	    "name": { S:"Jamaica"},
	    "population": { N: "2900000"},
	    "popularFor": { S: "Reggae Music"}
    }
};
var params2 = {
    TableName: "islands",
    Item:{
	    "_id": { S:"bbbcccdddeeefff111222333"},
	    "name": { S:"Trinidad"},
	    "population": { N: "1300000"},
	    "popularFor": { S: "Carnival Festival"}
    }
};
var params3 = {
    TableName: "islands",
    Item:{
	    "_id": { S:"cccdddeeefff111222333444"},
	    "name": { S:"Bahamas"},
	    "population": { N: "250000"},
	    "popularFor": { S: "Music Festival"}
    }
};
var params4 = {
    TableName: "islands",
    Item:{
	    "_id": { S:"dddeeefff111222333444555"},
	    "name": { S:"St. Honore"},
	    "population": { N: "750000"},
	    "popularFor": { S: "Death In Paradise is filmed there"}
    }
};
ddb.putItem(params1, function(err, data){
	if (err) {
		console.log(JSON.stringify(err, null, 2));
	} else {
		console.log(JSON.stringify(data, null, 2));
	}

});
ddb.putItem(params2, function(err, data){
	if (err) {
		console.log(JSON.stringify(err, null, 2));
	} else {
		console.log(JSON.stringify(data, null, 2));
	}

});
ddb.putItem(params3, function(err, data){
	if (err) {
		console.log(JSON.stringify(err, null, 2));
	} else {
		console.log(JSON.stringify(data, null, 2));
	}

});
ddb.putItem(params4, function(err, data){
	if (err) {
		console.log(JSON.stringify(err, null, 2));
	} else {
		console.log(JSON.stringify(data, null, 2));
	}

});
