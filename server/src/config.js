module.exports = {
  mongodb: {
    url: 'mongodb://127.0.0.1',
  },
  server: {
    port: 3001,
  },
  store: 'mongodb',
  storeConfig: {
    dbName: 'query_runner',
    scriptsCollection: 'scripts',
    rpp: 10,
  },
  runner: {
    concurrency: 1,
  },
}
