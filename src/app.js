'use strict'

const updateAccount = require('./lib/update-account')

module.exports = (dbService, mbService, restService) => {
  const app = restService.bootstrap(dbService, mbService)
  dbService.connect()
  process.on('SIGINT', () => dbService.disconnect())
  mbService.bootstrap(updateAccount, dbService)
  return app
}
