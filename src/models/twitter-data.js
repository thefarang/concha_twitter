'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TwitterDataSchema = new Schema({
  // _id will be created by default

  // Links to the concha User account
  concha_user_id: {
    type: Schema.ObjectId,
    unique: true,
    required: true
  },

  // @todo
  // Test for this, what do we do if a duplicate is submitted?
  // Twitter id, confirmed during the Twitter web-sign-in process.
  twitter_id: {
    type: String,
    unique: true,
    trim: true,
    required: true
  },

  // Received at the end of the Twitter web-sign-in process. Can be
  // used for future federated login.
  oauth_token: {
    type: String,
    trim: true,
    required: true
  },
  oauth_secret: {
    type: String,
    trim: true,
    required: true
  },

  // Twitter screenname
  screenname: {
    type: String,
    unique: true,
    trim: true,
    required: true
  },

  // Twitter url
  url: {
    type: String,
    unique: true,
    trim: true,
    required: true
  },

  // Age of this data. Can be used by client code to prompt a
  // data refresh.
  age: {
    type: Date,
    required: true,
    default: '1970-01-01T00:00:00.000Z'
  },

  no_of_followers: {
    type: Number
  },
  no_of_tweets: {
    type: Number
  },
  no_of_likes_received: {
    type: Number
  },
  no_of_replies_received: {
    type: Number
  },
  no_of_retweets_received: {
    type: Number
  }
}, {
  collection: 'twitter'
})

// Generate a Model from the Schema.
let TwitterData = mongoose.model('TwitterData', TwitterDataSchema)

module.exports = TwitterData
