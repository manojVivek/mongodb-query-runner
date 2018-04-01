'use strict';

require('babel-core/register')({
  presets: ['env'],
});

const config = require('./config');
const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const {log: _log} = require('./utils');
const MongoClient = require('mongodb').MongoClient;
const path = require('path');
const runner = require('./runner');

const app = express();
const REST_PATH = 'rest';

let dbClient = null;

MongoClient.connect(config.mongodb.url)
  .then(client => {
    dbClient = client;
    runner.start(dbClient);
    app.use(bodyParser.json({limit: '20mb'}));
    app.use(bodyParser.urlencoded({
      extended: false,
      limit: '20mb',
      parameterLimit: 10000,
    }));

    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });

    app.use((req, res, next) => {
      req.db = dbClient.db(config.storeConfig.dbName);
      next();
    });

    const restApiPath = path.join(__dirname, REST_PATH);
    app.use(
      path.join('/mongoDBQueryRunner', REST_PATH),
      require(restApiPath)()
    );

    app.listen(config.server.port, () => {
      _log('Listening on port', config.server.port);
    });
  })
  .catch(err => {
    _log('Error while connecting to Mongodb', err);
    process.exit(-1);
  });
