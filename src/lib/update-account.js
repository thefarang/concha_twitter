'use strict'

const log = require('../lib/log')
const mongoose = require('mongoose')
const TwitterData = require('../models/twitter-data')

const ObjectId = mongoose.Types.ObjectId

const updateAccount = (data) => {
  TwitterData.findOne({
    concha_user_id: new ObjectId(data.concha_user_id)
  },
  (err, document) => {
    if (err) {
      log.info({
        err: err,
        conchaUserId: data.concha_user_id
      }, 'An error occurred locating the Twitter data document')
      return err
    }

    if (document === null) {
      const err = new Error()
      err.status = 404
      log.info({
        err: err,
        conchaUserId: data.concha_user_id
      }, 'The Twitter data document was not found')
      return err
    }

    document.no_of_followers = data.no_of_followers
    document.no_of_tweets = data.no_of_tweets
    document.no_of_likes_received = data.no_of_likes_received
    document.no_of_replies_received = data.no_of_replies_received
    document.no_of_retweets_received = data.no_of_retweets_received

    document.save((err) => {
      if (err) {
        log.info({
          err: err,
          document: document
        }, 'An error occurred saving the Twitter data document')
        return err
      }
    })
  })
}

module.exports = updateAccount
