'use strict'

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
        await dbService.save(dbService.getDefinitions())
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
