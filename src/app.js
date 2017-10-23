'use strict'

const log = require('./services/log')
const express = require('express')
const bodyParser = require('body-parser')
const data = require('./routes/data')
const account = require('./routes/account')

module.exports = (dbService, mbService) => {
  const app = express()

  app.set('dbService', dbService)
  app.set('mbService', mbService)

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
    log.info({ err: err }, 'An unknown resource has been requested')
    next(err)
  })

  // Error handler.
  app.use((err, req, res, next) => {
    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(err.status || 500)
    res.json()
  })

  return app
}
