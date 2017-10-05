'use strict'

// @todo
// Does not yet support HATEOS

// @todo
// Include validation middleware on all incoming user data

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const amqp = require('amqplib/callback_api')

const updateAccount = require('./lib/update-account')
const data = require('./routes/data')
const account = require('./routes/account')

// Database connection
// @todo replace this with config
mongoose.Promise = global.Promise
mongoose.connect('mongodb://mongo:27017/local', {
  useMongoClient: true
})

// Close the database connection when Node process ends.
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    // @todo add logging here.
    process.exit(0)
  })
})

// Message broker connection
// @todo config
amqp.connect('amqp://rabbitmq', (err, conn) => {
  conn.createChannel((err, ch) => {

    // @todo config
    const q = 'twitter_receive';
    ch.assertQueue(q, {durable: false});
    ch.consume(q, msg => updateAccount(JSON.parse(msg.content.toString())), { noAck: true })

    // @todo
    // TESTING CODE
    /*
    const payload = JSON.stringify({
      concha_user_id: '507f1f77bcf86cd799439011',
      twitter_id: 12345678901,
      username: "concha_app",
      link: "https://www.twitter.com/concha_app",
      no_of_followers: 100,
      no_of_tweets: 50,
      no_of_likes_received: 200,
      no_of_replies_received: 5,
      no_of_retweets_received: 50
    })
    */
    /*
    const payload = JSON.stringify({
      concha_user_id: '507f1f77bcf86cd799439011',
      url: "THE BIG FISH"
    })
    ch.sendToQueue(q, new Buffer(payload, 'UTF-8'))
    */
  })
})

const app = express()

// Middleware to check each client request specifically accepts JSON responses.
app.use((req, res, next) => {
  const acceptHeader = req.get('accept')
  if ((acceptHeader === undefined) || (acceptHeader.indexOf('application/json') === -1)) {
    const err = new Error()
    err.status = 406
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
  next(err)
})

// Error handler.
app.use((err, req, res, next) => {
  res.set('Cache-Control', 'private, max-age=0, no-cache')
  res.status(err.status || 500)
  res.json()
})

module.exports = app
