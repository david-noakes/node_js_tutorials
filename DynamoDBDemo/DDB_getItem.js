/**
 * read items
 */
var AWS = require('aws-sdk');
AWS.config.update({region:'ap-south-2', endpoint: new AWS.Endpoint('http://localhost:8000'),
		accessKeyId:'accesskey', secretAccessKey:"dummy"});
var params = {
	TableName: "Wines",
    Key: {
        "WineName": { S: "Chateau Neuf - Pinot Noir & Merlot"},
        "Vintage": { S: "1991"}
    }
};

function onGetItem(err,data){
	if (err) {
		console.log(JSON.stringify(err, null, 2));
	} else {
		console.log(JSON.stringify(data, null, 2));
	}
	
}

var ddb = new AWS.DynamoDB();
ddb.getItem(params, onGetItem);

