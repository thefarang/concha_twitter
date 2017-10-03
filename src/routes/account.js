'use strict'

const express = require('express')
const mongoose = require('mongoose')
const TwitterData = require('../models/twitter-data')

const ObjectId = mongoose.Types.ObjectId
const router = express.Router()

// Links the Concha user's account to Twitter
router.post('/link', (req, res, next) => {
  const twitterData = new TwitterData()
  twitterData.concha_user_id = new ObjectId(req.body.concha_user_id)
  twitterData.twitter_id = req.body.twitter_id
  twitterData.oauth_token = req.body.oauth_token
  twitterData.oauth_secret = req.body.oauth_secret
  twitterData.screenname = req.body.screenname
  twitterData.url = req.body.url
  twitterData.save((err) => {
    if (err) {
      // Check for duplicates and mark as 409
      if (err.code && err.code === 11000) {
        err.status = 409
      }
      return next(err)
    }
    res.json()
  })
})

// Unlinks the Concha user's account from their Twitter account
router.delete('/link/:concha_user_id', (req, res, next) => {
  TwitterData.findOne({
    concha_user_id: new ObjectId(req.params.concha_user_id)
  },
  (err, data) => {
    if (err) {
      return next(err)
    }

    if (data === null) {
      const err = new Error()
      err.status = 404
      return next(err)
    }

    data.remove((err) => {
      if (err) {
        return next(err)
      }
      res.status(204)
      res.json()
    })
  })
})

module.exports = router
