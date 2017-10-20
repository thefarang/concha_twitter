'use strict'

// Bootstrap the database, message broker and web application
const database = require('./lib/database')
const messageBroker = require('./lib/message-broker')
const updateAccount = require('./lib/update-account')
const webFramework = require('./lib/web-framework')

database.bootstrap()
process.on('SIGINT', () => database.disconnect())

messageBroker.bootstrap(updateAccount)

const webApp = webFramework.bootstrap()
module.exports = webApp
