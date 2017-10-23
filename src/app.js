'use strict'

const Twitter = require('./lib/twitter')

module.exports = (dbService, mbService, restService) => {
  const app = restService.bootstrap(dbService, mbService)

  dbService.connect()
  process.on('SIGINT', () => dbService.disconnect())

  const twitter = new Twitter(dbService)

  mbService.bootstrap(twitter)
  return app
}
