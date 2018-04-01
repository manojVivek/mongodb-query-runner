'use strict';

const config = require('../config');
const express = require('express');
const scriptsRepo = require('../repo/scripts');
const {log: _log} = require('../utils');

const router = express();

const RPP = config.storeConfig.rpp;

module.exports = () => {
  router.get('/query/status', getScriptStatus);
  router.post('/query/new', addNewScript);

  return router;
};

function getScriptStatus(req, res, next) {
  const {lastId} = req.params;
  _log('getScriptStatus', lastId, req.params);
  scriptsRepo.getScripts(req.db, RPP, lastId)
    .then((result) => res.json(result))
    .catch(err => next(err));
}

function addNewScript(req, res, next) {
  _log('Recieved',  req.body);
  const {code} = req.body;
  scriptsRepo.seedScript(req.db, Buffer.from(code, 'base64').toString())
    .then(() => res.json({}))
    .catch(err => {
      _log("Error adding new script", err);
      next(err);
    });
}
