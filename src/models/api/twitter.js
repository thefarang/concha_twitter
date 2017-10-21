'use strict'

const log = require('../../lib/log')
const mongoose = require('mongoose')
const Twitter = require('../schema/twitter')

const ObjectId = mongoose.Types.ObjectId

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
      return resolve(document)
    })
  })
}

const save = (document) => {
  return new Promise((resolve, reject) => {

    let twitterDoc = null
    if (!(document instanceof Twitter)) {
      twitterDoc = new Twitter()
      twitterDoc.concha_user_id = new ObjectId(document.concha_user_id)
      twitterDoc.twitter_id = document.twitter_id
      twitterDoc.oauth_token = document.oauth_token
      twitterDoc.oauth_secret = document.oauth_secret
      twitterDoc.screenname = document.screenname
      twitterDoc.url = document.url
      document = twitterDoc
    }

    document.save((err) => {
      if (err) {
        log.info({
          err: err,
          document: document
        }, 'An error occurred saving the Twitter document')
        return reject(err)
      }
      return resolve()
    })
  })
}

const remove = (document) => {
  return new Promise((resolve, reject) => {
    if (!(document instanceof Twitter)) {
      const err = new Error('twitter.remove() called with an invalid object')
      return reject(err)
    }

    document.remove((err) => {
      if (err) {
        log.info({
          err: err,
          conchaUserId: document.concha_user_id
        }, 'Unable to delete the users Twitter document')
        return reject(err)
      }
      return resolve()
    })
  })
}

module.exports = {
  findOne,
  save,
  remove
}
