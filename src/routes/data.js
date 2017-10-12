'use strict'

const log = require('../lib/log')
const express = require('express')
const mongoose = require('mongoose')
const TwitterData = require('../models/twitter-data')

const ObjectId = mongoose.Types.ObjectId
const router = express.Router()

router.get('/:concha_user_id', function (req, res, next) {
  TwitterData.findOne({
    concha_user_id: new ObjectId(req.params.concha_user_id)
  },
  (err, data) => {
    if (err) {
      log.info({
        err: err,
        conchaUserId: req.params.concha_user_id
      }, 'An error occurred whilst locating the users Twitter data')
      return next(err)
    }

    if (data === null) {
      const err = new Error()
      err.status = 404
      log.info({
        err: err,
        conchaUserId: req.params.concha_user_id
      }, 'Could not locate the users Twitter data')
      return next(err)
    }

    res.json(data)
  })
})

router.get('/age/:concha_user_id', function (req, res, next) {
  TwitterData.findOne({
    concha_user_id: new ObjectId(req.params.concha_user_id)
  },
  (err, data) => {
    if (err) {
      log.info({
        err: err,
        conchaUserId: req.params.concha_user_id
      }, 'An error occurred whilst locating the age of the users Twitter data')
      return next(err)
    }

    if (data === null) {
      const err = new Error()
      err.status = 404
      log.info({
        err: err,
        conchaUserId: req.params.concha_user_id
      }, 'Unable to find the age of the users Twitter data')
      return next(err)
    }

    res.json({ age: data.age })
  })
})

module.exports = router
