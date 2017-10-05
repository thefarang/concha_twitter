'use strict'

const mongoose = require('mongoose')
const TwitterData = require('../../models/twitter-data')

const ObjectId = mongoose.Types.ObjectId

// @todo
// Use the test database and set in config
const connect = () => {
  return new Promise((resolve, reject) => {
    mongoose.Promise = global.Promise
    mongoose.connect('mongodb://mongo:27017/local', { useMongoClient: true }, (err) => {
      if (err) {
        return reject(err)
      }
      return resolve()
    })

  })
}

const clean = () => {
  return new Promise((resolve, reject) => {
    // Clear down the test database
    for (var i in mongoose.connection.collections) {
      mongoose.connection.collections[i].remove(function() {});
    }
    return resolve();
  })
}

const populate = () => {
  return new Promise((resolve, reject) => {
    const twitterData = new TwitterData()
    twitterData.concha_user_id = new ObjectId('507f1f77bcf86cd799439011')
    twitterData.twitter_id = '12345678901234567890'
    twitterData.oauth_token = '7588892-kagSNqWge8gB1WwE3plnFsJHAZVfxWD7Vb57p0b4&'
    twitterData.oauth_secret = 'PbKfYqSryyeKDWz4ebtY3o5ogNLG11WJuZBc9fQrQo'
    twitterData.screenname = 'concha_app'
    twitterData.url = 'https://twitter.com/concha_app'
    twitterData.save((err) => {
      if (err) {
        return reject(err)
      }
      return resolve()
    })

  })
}

const close = () => {
  return new Promise((resolve, reject) => {
    mongoose.connection.close(() => {
      return resolve()
    })
  })
}

module.exports = {
  connect,
  clean,
  populate,
  close
}
