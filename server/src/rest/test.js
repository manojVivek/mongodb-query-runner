/*const config = require('../config');
const runner = require('../runner/');

const MongoClient = require('mongodb').MongoClient;

console.log('Starting');
MongoClient.connect(config.mongodb.url)
  .then(client => {
    runner.start(client);
    console.log('Done');
  }).catch
*/

const path = require('path');
console.log(path.join('http://localhost:3001/path/', 'path1'));
