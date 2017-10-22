'use strict'

// @todo
// Does not yet support HATEOS
// Include validation middleware on all incoming user data

const log = require('../log')
const express = require('express')
const bodyParser = require('body-parser')
const data = require('./routes/data')
const account = require('./routes/account')

const bootstrap = (dbService, mbService) => {
  const restApp = express()

  restApp.set('dbService', dbService)
  restApp.set('mbService', mbService)

  // Middleware to check each client request specifically accepts JSON responses.
  restApp.use((req, res, next) => {
    const acceptHeader = req.get('accept')
    if ((acceptHeader === undefined) || (acceptHeader.indexOf('application/json') === -1)) {
      const err = new Error()
      err.status = 406
      log.info({ err: err }, 'Client does not accept JSON responses')
      return next(err)
    }
    next()
  })

  restApp.use(bodyParser.json())
  restApp.use(bodyParser.urlencoded({ extended: false }))

  restApp.use('/api/v1/data', data)
  restApp.use('/api/v1/account', account)

  // Default 404 handler, called when no routes match the requested route.
  restApp.use((req, res, next) => {
    const err = new Error()
    err.status = 404
    log.info({ err: err }, 'An unknown route has been requested')
    next(err)
  })

  // Error handler.
  restApp.use((err, req, res, next) => {
    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(err.status || 500)
    res.json()
  })

  return restApp
}

module.exports = {
  bootstrap
}
