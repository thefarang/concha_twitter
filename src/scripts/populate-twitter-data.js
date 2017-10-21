'use strict'

const log = require('../lib/log')
const config = require('config')
const mongoose = require('mongoose')
let TwitterData = require('../models/schema/twitter')

const ObjectId = mongoose.Types.ObjectId

mongoose.Promise = global.Promise
mongoose.connect(config.get('mongoConn')) // @todo use test database?

new Promise((resolve, reject) => {
  TwitterData.find().remove((err) => {
    if (err) {
      log.info({ err: err }, 'Unable to find and remove existing TwitterData objects')
      return reject(err)
    }
    resolve()
  })
})
.then(() => {
  return new Promise((resolve, reject) => {
    const twitterData = new TwitterData()
    twitterData.concha_user_id = new ObjectId('507f1f77bcf86cd799439011')
    twitterData.twitter_id = '12345678901234567890'
    twitterData.oauth_token = '7588892-kagSNqWge8gB1WwE3plnFsJHAZVfxWD7Vb57p0b4&'
    twitterData.oauth_secret = 'PbKfYqSryyeKDWz4ebtY3o5ogNLG11WJuZBc9fQrQo'
    twitterData.screenname = '@concha_app'
    twitterData.url = 'https://twitter.com/concha_app'
    twitterData.age = new Date('1970-01-01T00:00:00Z')
    twitterData.save((err) => {
      if (err) {
        log.info({
          err: err,
          twitterData: twitterData
        }, 'An error occurred saving the TwitterData object')
        return reject(err)
      }

      log.info({ twitterData: twitterData }, 'Saved TwitterData object')
      resolve()
    })
  })
})
.then(() => {
  process.exit(0)
})
.catch((err) => {
  log.info({ err: err }, 'An error occurred populating the TwitterData collection. Exiting...')
  process.exit(0)
})
