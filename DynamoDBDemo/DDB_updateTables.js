/**
 * update a table
 */
var AWS = require('aws-sdk');
AWS.config.update({region:'ap-south-2', endpoint: new AWS.Endpoint('http://localhost:8000'),
		accessKeyId:'accesskey', secretAccessKey:"dummy"});
//var params = {
//    "TableName": "Wines",
//    "WineName": "Chateau Neuf - Pinot Noir & Merlot",
//    "Vintage": "1991",
//    "TastingNotes": "Light, refreshing. Long finish, no heavy tanins. Floral notes, fruit notes"
//};
var params = {
	"TableName": "Wines",	
    "ProvisionedThroughput": {
        "ReadCapacityUnits": 12,
        "WriteCapacityUnits": 12
      },
};
var ddb = new AWS.DynamoDB();
ddb.updateTable(params, function(err, data){
	if (err) {
		console.log(JSON.stringify(err, null, 2));
	} else {
		console.log(JSON.stringify(data, null, 2));
	}

});