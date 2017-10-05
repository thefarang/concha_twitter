'use strict'

const mongoose = require('mongoose')
const TwitterData = require('../models/twitter-data')

const ObjectId = mongoose.Types.ObjectId

const updateAccount = (data) => {
  TwitterData.findOne({
    concha_user_id: new ObjectId(data.concha_user_id)
  },
  (err, document) => {
    if (err) {
      // @todo
      // Log the error and return
      return
    }

    if (document === null) {
      // @todo
      // Log the error and return
      const err = new Error()
      err.status = 404
      return
    }

    document.no_of_followers = data.no_of_followers
    document.no_of_tweets = data.no_of_tweets
    document.no_of_likes_received = data.no_of_likes_received
    document.no_of_replies_received = data.no_of_replies_received
    document.no_of_retweets_received = data.no_of_retweets_received

    document.save((err) => {
      if (err) {
        // @todo
        // Log the error and return
      }
    })
  })
}

module.exports = updateAccount
