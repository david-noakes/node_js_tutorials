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
	TableName: "Wines",	
    Key: {
        "WineName": { S: "Chateau Neuf - Pinot Noir & Merlot"},
        "Vintage": { S: "1991"}
    },
	UpdateExpression: 'set #attrName = :attrValue',
	ExpressionAttributeNames: {
		"#attrName": "Description"
	},
	ExpressionAttributeValues:{
	    ":attrValue": {
	    	'S':"Grapes from 10 yo vines on the slopes of the Loire valley. Blended as 60% merlot, 40% Pinot Noir. Aged in oak for 1 year before bottling. This will reach its peak in 7 to 12 years."
	    }
	}
};
var ddb = new AWS.DynamoDB();
ddb.updateItem(params, function(err, data){
	if (err) {
		console.log(JSON.stringify(err, null, 2));
	} else {
		console.log(JSON.stringify(data, null, 2));
	}

});
