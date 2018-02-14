/**
 * 0.0.1 - Parsing URLs
 */
console.log("Parsing URLs");
var url = require('url');
var testUrl = "http://john:7654321@localhost:3456/path/to/resourse?resourceId=someValue&resourceType=someType";

var parsedUrlObject = url.parse(testUrl);
var parsedUrlObject1 = url.parse(testUrl,true);  //true = parse query into json
var urlString = url.format(parsedUrlObject1);

console.log(parsedUrlObject);
console.log(parsedUrlObject1);
console.log(urlString);