'use strict'

const config = require('config')
const log = require('../log')
const mongoose = require('mongoose')
const Twitter = require('./models/twitter')

const ObjectId = mongoose.Types.ObjectId
let isConnected = false

const connect = () => {
  if (!isConnected) {
    mongoose.Promise = global.Promise
    mongoose.connect(config.get('mongoConn'), {
      useMongoClient: true
    })
    isConnected = true
  }
}

const disconnect = () => {
  mongoose.connection.close(() => {
    log.info({}, 'Closed Mongo connection successfully. Exiting...')
    process.exit(0)
  })
}

const findOne = (conchaUserId) => {
  return new Promise((resolve, reject) => {
    Twitter.findOne({
      concha_user_id: new ObjectId(conchaUserId)
    },
    (err, document) => {
      if (err) {
        log.info({
          err: err,
          conchaUserId: conchaUserId
        }, 'An error occurred finding the Twitter document')
        return reject(err)
      }

      if (document === null) {
        return resolve(null)
      }

      // Transform the Twitter schema object into a generic JSON object
      const twitterDoc = {
        concha_user_id: conchaUserId,
        twitter_id: document.twitter_id,
        oauth_token: document.oauth_token,
        oauth_secret: document.oauth_secret,
        screenname: document.screenname,
        url: document.url,
        age: document.age,
        no_of_followers: document.no_of_followers,
        no_of_tweets: document.no_of_tweets,
        no_of_likes_received: document.no_of_likes_received,
        no_of_replies_received: document.no_of_replies_received,
        no_of_retweets_received: document.no_of_retweets_received
      }
      return resolve(twitterDoc)
    })
  })
}

const save = async (document) => {
  return new Promise((resolve, reject) => {
    Twitter.findOneAndUpdate(
      { concha_user_id: document.concha_user_id },
      document,
      { upsert: true },
      (err) => {
        // Here
        if (err) {
          log.info({
            err: err,
            document: document
          }, 'An error occurred saving the Twitter document')
          return reject(err)
        }
        return resolve(document)
      })
  })
}

const remove = (conchaUserId) => {
  return new Promise((resolve, reject) => {
    Twitter.remove({ concha_user_id: conchaUserId }, (err) => {
      if (err) {
        log.info({
          err: err,
          conchaUserId: document.concha_user_id
        }, 'Unable to delete the users Twitter document')
        return reject(err)
      }
      return resolve(conchaUserId)
    })
  })
}

module.exports = {
  connect,
  disconnect,
  findOne,
  save,
  remove
}
