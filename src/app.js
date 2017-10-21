'use strict'

// Bootstrap the database, message broker and rest services
const database = require('./services/database/database')
const messageBroker = require('./services/message-broker')
const rest = require('./services/rest/rest')
const updateAccount = require('./lib/update-account')

database.connect()
process.on('SIGINT', () => database.disconnect())

messageBroker.bootstrap(updateAccount)

const restApp = rest.bootstrap()
module.exports = restApp
