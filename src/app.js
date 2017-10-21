'use strict'

// Bootstrap the database, message broker and rest services
const dbService = require('./services/database/service')
const messageBroker = require('./services/message-broker')
const restService = require('./services/rest/service')
const updateAccount = require('./lib/update-account')

dbService.connect()
process.on('SIGINT', () => dbService.disconnect())

messageBroker.bootstrap(updateAccount)

const restfulApp = restService.bootstrap()
module.exports = restfulApp
