'use strict';

const config = require('../config');

const COLLECTION = config.storeConfig.scriptsCollection;

const statuses = {
  COMPLETED: 'COMPLETED',
  RUNNING: 'RUNNING',
  SEEDED: 'SEEDED',
}

const resultTypes = {
  CONTENT: 'CONTENT',
  FILE_PATH: 'FILE_PATH',
}

function getScripts(db, limit, lastId) {
  const query = {};
  if (lastId) {
    query._id = {$gt: lastId};
  }
  return db.collection(COLLECTION).find(query)
    .sort({_id: -1})
    .limit(limit)
    .toArray();
}

function seedScript(db, scriptCode) {
  const now = new Date();
  return db.collection(COLLECTION).insert({
    code: scriptCode,
    createTs: now,
    status: statuses.SEEDED,
    updateTs: now,
  });
}

function getRunningScripts(db) {
  return db.collection(COLLECTION).find({status: statuses.RUNNING}).toArray();
}

function updateCompletedWithResultPath(db, _id, path) {
  return updateCompleted(db, _id, {resultType: resultTypes.FILE_PATH, path});
}

function updateCompletedWithResult(db, _id, content) {
  return updateCompleted(db, _id, {resultType: resultTypes.CONTENT, content});
}

function  updateCompleted(db, _id, result) {
  return db.collection(COLLECTION).update(
    {_id},
    {$set: {status: statuses.COMPLETED, result, updateTs: new Date()}}
  );
}

function updatePidAndOutputPath(db, _id, pid, outputPath) {
  return db.collection(COLLECTION).update(
    {_id},
    {$set: {outputPath, pid}}
  );
}

function getARunEligibleScript(db) {
  return db.collection(COLLECTION).findOneAndUpdate(
    {status: statuses.SEEDED},
    {$set: {status: statuses.RUNNING, updateTs: new Date()}},
    {sort: {_id: 1}}
  ).then(res => res.value);
}

module.exports = {
  getARunEligibleScript,
  getRunningScripts,
  getScripts,
  seedScript,
  updateCompletedWithResult,
  updateCompletedWithResultPath,
  updatePidAndOutputPath,
}
