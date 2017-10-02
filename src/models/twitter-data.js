'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

const TwitterDataSchema = new Schema({
  // _id will be created by default

  // Links to the concha User account
  concha_user_id: {
    type: Schema.ObjectId,
    required: true
  },

  // Twitter id, confirmed during the Twitter web-sign-in process.
  twitter_id: {
    type: String,
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
    trim: true,
    required: true
  },

  // Twitter url
  url: {
    type: String,
    trim: true,
    required: true
  },

  // Age of this data. Can be used by client code to prompt a
  // data refresh.
  age: {
    type: Date,
    required: true
  }
}, {
  collection: 'twitter'
})

// Query helper method. Attach this to a Query chain. Will findOne()
// after converting the conchaUserStringId into a conchaUserObjectId
// Example:
// TwitterData.find().byObjectId('12345').exec((data, err) => {})
TwitterDataSchema.query.byObjectId = function(conchaUserStringId) {
  return this.findOne({ concha_user_id: new ObjectId(conchaUserStringId) });
};

// Generate a Model from the Schema.
let TwitterData = mongoose.model('TwitterData', TwitterDataSchema)

module.exports = TwitterData
