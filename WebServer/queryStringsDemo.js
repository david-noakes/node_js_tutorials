/**
 * http://usejsdoc.org/
 */
console.log("Working with Query Strings");

var queryString = require('queryString');

var testBaseUrl = "http://localhost:3456/path/to/resource";

var queryDataObject = {
	'resourceID':'1',
	'username':'danny'
}

var stringFromObject = queryString.stringify(queryDataObject);
//var stringFromObject = queryString.stringify(queryDataObject,";",":");
//   separator = ";" instead of "&" and assignment = ":" instead of "="

console.log(testBaseUrl + "?" + stringFromObject);