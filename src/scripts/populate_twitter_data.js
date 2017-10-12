'use strict'

const config = require('config')
const mongoose = require('mongoose')
let TwitterData = require('../models/twitter-data')

const ObjectId = mongoose.Types.ObjectId

mongoose.Promise = global.Promise
mongoose.connect(config.get('mongoConn')) // @todo test database?

new Promise((resolve, reject) => {
  TwitterData.find().remove((err) => {
    if (err) {
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
        return reject(err)
      }

      console.log('Populated Twitter Data') // 59d1f5e08c75f30072dfcb5e
      console.log(twitterData._id)
      resolve()
    })
  })
})
.then(() => {
  process.exit(0)
})
.catch((err) => {
  console.log('An error occurred populating the twitter table.')
  console.log(err)
  process.exit(0)
})
