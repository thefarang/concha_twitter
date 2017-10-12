'use strict'

// @todo
// Does not yet support HATEOS

// @todo
// Include validation middleware on all incoming user data

const log = require('./lib/log')
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const amqp = require('amqplib/callback_api')
const config = require('config')

const updateAccount = require('./lib/update-account')
const data = require('./routes/data')
const account = require('./routes/account')

mongoose.Promise = global.Promise
mongoose.connect(config.get('mongoConn'), {
  useMongoClient: true
})

// Close the database connection when Node process ends.
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    // @todo add logging here.
    process.exit(0)
  })
})

// @todo - continue page 2 of the tutorial for persistance
amqp.connect(config.get('messageBroker'), (err, conn) => {
  if (err) {
    // @todo add logging here.
    process.exit(0)
  }

  conn.createChannel((err, channel) => {
    if (err) {
      // @todo add logging here.
      process.exit(0)
    }
    const q = config.get('incomingQueue')

    // @todo
    // Make durable (and update the test/lib/update-account.js file too)
    channel.assertQueue(q, { durable: false })

    // Maximum number of unacknowledged messages. RabbitMQ will not despatch
    // any more messages to this worker if 10 concurrent messages are being processed,
    // until one or more of those messages are acknowledged.
    channel.prefetch(10)
    channel.consume(q, msg => updateAccount(JSON.parse(msg.content.toString())), { noAck: false })
  })
})

const app = express()

// Middleware to check each client request specifically accepts JSON responses.
app.use((req, res, next) => {
  const acceptHeader = req.get('accept')
  if ((acceptHeader === undefined) || (acceptHeader.indexOf('application/json') === -1)) {
    const err = new Error()
    err.status = 406
    log.info({ err: err }, 'Client does not accept JSON responses')
    return next(err)
  }
  next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/api/v1/data', data)
app.use('/api/v1/account', account)

// Default 404 handler, called when no routes match the requested route.
app.use((req, res, next) => {
  const err = new Error()
  err.status = 404
  log.info({ err: err }, 'An unknown route has been requested')
  next(err)
})

// Error handler.
app.use((err, req, res, next) => {
  res.set('Cache-Control', 'private, max-age=0, no-cache')
  res.status(err.status || 500)
  res.json()
})

module.exports = app
