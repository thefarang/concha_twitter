'use strict'

// * Test script to populate the currently selected database with a test Twitter account
// * The idea is that developers can then manually interact with the application, testing
//   retrieval, update etc.
// * This script is not a formal part of the test suite.

const log = require('../services/log')
const dbService = require('../services/database/service')

const repopulate = () => {
  return new Promise((resolve, reject) => {
    try {
      log.info({}, 'Connecting to the dbase...')
      dbService.connect()
      return resolve()
    } catch (err) {
      log.info({ err: err }, 'Unable to connect to the dbase')
      return reject(err)
    }
  })
  .then(() => {
    return new Promise(async (resolve, reject) => {
      try {
        log.info({}, 'Cleansing the collection...')
        await dbService.removeAll()
        return resolve()
      } catch (err) {
        log.info({ err: err }, 'Unable to cleanse the collection')
        return reject(err)
      }
    })
  })
  .then(() => {
    return new Promise(async (resolve, reject) => {
      try {
        log.info({}, 'Populating the collection...')
        await dbService.save({
          concha_user_id: '507f1f77bcf86cd799439011',
          twitter_id: '12345678901234567890',
          oauth_token: '7588892-kagSNqWge8gB1WwE3plnFsJHAZVfxWD7Vb57p0b4&',
          oauth_secret: 'PbKfYqSryyeKDWz4ebtY3o5ogNLG11WJuZBc9fQrQo',
          screenname: 'concha_app',
          url: 'https://twitter.com/concha_app',
          age: '1970-01-01T00:00:00.000Z'
        })
        return resolve()
      } catch (err) {
        log.info({ err: err }, 'An error occurred saving the Twitter object')
        return reject(err)
      }
    })
  })
  .then(() => {
    return new Promise((resolve, reject) => {
      log.info({}, 'Disconnecting from the dbase...')
      dbService.disconnect()
      return resolve()
    })
  })
  .catch((err) => {
    log.info({ err: err }, 'An error occurred during the Twitter loading process')
    process.exit(0)
  })
}

repopulate()
