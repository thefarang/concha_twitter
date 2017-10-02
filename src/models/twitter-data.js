'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

const TwitterDataSchema = new Schema({
  // _id will be created by default
  concha_user_id: {
    type: Schema.ObjectId,
    required: true
  },
  twitter_id: {
    type: String,
    trim: true,
    required: true
  },
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
  screenname: {
    type: String,
    trim: true,
    required: true
  },
  url: {
    type: String,
    trim: true,
    required: true
  },
  age: {
    type: Date,
    required: true
  },
  roles: [Number]
}, {
  collection: 'acl'
})

// Converts a string to an ObjectId before initialising the query
TwitterDataSchema.query.byObjectId = function(stringId) {
  return this.findOne({ concha_user_id: new ObjectId(stringId) });
};

// Generate a Model from the Schema.
let TwitterData = mongoose.model('TwitterData', TwitterDataSchema)

module.exports = TwitterData

/*
			oauth_token, oauth_secret (can be used in the future for federated login and/or authenticating speciic requests)
			twitter_id (to use in retrieving updated data. use application_only authentiction for this in the WORKER)
			screenname (to display on profile)
			url (so providers can access the twitter profile of bloggers)
			age: 1970 (will prompt data update)
*/
