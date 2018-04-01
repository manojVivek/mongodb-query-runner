'use strict';

require('babel-core/register')({
  presets: ['env'],
});

const async = require('async');
const config = require('../config');
const execute = require('controlled-schedule');
const fs = require('fs');
const isRunning = require('is-running');
const {log: _log} = require('../utils');
const path = require('path');
const scriptsRepo = require('../repo/scripts');
const spawn = require('child_process').spawn;

const RUNNER_BANDWIDTH = config.runner.concurrency;

function start(dbClient) {
  _log('Initializing');
  const db = dbClient.db(config.storeConfig.dbName);
  execute(cb => cycle(db, cb))
    .every('10000s')
    .start();
}

function cycle(db, cb) {
  try {
  _log('Starting cycle run');
  harvestCompletedTasks(db)
    .then(() => getAvailableBandwidth(db))
    .then(availableBandwidth => {
      _log('Available Bandwidth', availableBandwidth);
      if (availableBandwidth < 1) {
        return;
      }
      return startNewTasks(db, availableBandwidth);
    })
    .then(() => cb())
    .catch(err => {
      _log('Error in runner', err);
      cb(err);
    });
  } catch (err) {
    console.log(err);
  }
}

function startNewTasks(db, count) {
  _log('Trying to starting', count, 'new scripts');
  return new Promise((resolve, reject) => {
    async.timesSeries(
      count,
      (_, cb) => startNewTask(db, cb),
      (err, results) => {
        if (err) {
          return reject(err);
        }
        _log('Started', results.filter(r => r).length, 'new scripts');
        return resolve(results);
      }
    );
  });
}

function startNewTask(db, cb) {
  scriptsRepo.getARunEligibleScript(db)
      .then(script => {
        if (!script) {
          return false;
        }
        const scriptPath = tempPath(script._id, 'js');
        fs.writeFileSync(scriptPath, script.code);
        const logPath = tempPath(script._id, 'log');
        const out = fs.openSync(logPath, 'a');
        const err = fs.openSync(logPath, 'a');
        //TODO Add auth
        const child = spawn('mongo', ['--quiet', scriptPath], {
          detached: true,
          stdio: [ 'ignore', out, err ]
        });
        child.unref();
        return scriptsRepo.updatePidAndOutputPath(
          db,
          script._id,
          child.pid,
          logPath
        ).then(() => true);
      })
      .then(res => cb(null, res))
      .catch(err => cb(err));
}

function tempPath(id, extension) {
  return path.join('/tmp', id + '.' + extension);
}

function getAvailableBandwidth(db) {
  _log('Checking available bandwidth');
  return new Promise((resolve, reject) => {
    scriptsRepo.getRunningScripts(db)
    .then(
      runningScripts =>  resolve(RUNNER_BANDWIDTH - runningScripts.length)
    )
    .catch(err => reject(err));
  });
}

function harvestCompletedTasks(db) {
  _log('Harvesting completed scripts');
  return scriptsRepo.getRunningScripts(db)
    .then(scripts => {
      return new Promise((resolve, reject) => {
        let completedCount = 0;
        async.forEach(
          scripts,
          (script, cb) => {
            if (!isCompleted(script)) {
              return cb();
            }
            harvestResults(db, script)
              .then(() => {
                completedCount++;
                cb();
              });
          },
          err => {
            if (err) {
              _log('Error while harvesting scripts', err);
              reject(err);
            }
            _log('Harvested', completedCount, 'scripts');
            resolve(completedCount);
          }
        );
      });
    });
}

function isCompleted(script) {
  return !isRunning(script.pid);
}

function harvestResults(db, script) {
  const bytes = fs.statSync(script.outputPath).size;
  //if result size is greater than 1MB just kept the file and store the path
  if (bytes > 1024 * 1024) {
    deleteFiles(tempPath(script._id, 'js'));
    return scriptsRepo.updateCompletedWithResultPath(
      db,
      script._id,
      script.outputPath
    );
  }
  const content = fs.readFileSync(script.outputPath, 'utf8');
  deleteFiles(tempPath(script._id, 'js'), script.outputPath);
  return scriptsRepo.updateCompletedWithResult(db, script._id, content);
}

function deleteFiles(...files) {
  files.forEach(fs.unlinkSync);
}

module.exports = {start};
