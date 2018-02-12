/**
 * demo 04 - using modules returning functions
 */

var apple = require('./fruit.js');
console.log(apple);
console.log('---');
console.log(apple());
console.log('---');
console.log(apple().getInfo());
console.log('---');
var banana = require('./fruit.js')();
banana.setName('banana');
console.log(banana.getInfo());
banana.setDescription('grain from the banana grass');
console.log(banana.getInfo());
console.log(apple().getInfo());
console.log('===');

var fruit1 = require('./fruit1.js');
console.log("fruit1:" + fruit1);
console.log("fruit1():" + fruit1());
console.log('---');
var apple1 = fruit1("apple2", "red and round");
var banana1 = fruit1("banana2", "yellow crescent");

console.log(apple1);
console.log('---');
console.log(apple1.getInfo());
console.log('---');
console.log(banana1.getInfo());
console.log('---');
banana1.setName('banana1');
console.log(banana1.getInfo());
banana1.setDescription('grain from the banana1 grass');
console.log(banana1.getInfo());
console.log(apple1.getInfo());
