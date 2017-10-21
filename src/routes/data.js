'use strict'

const log = require('../lib/log')

// @todo
// This should be extracted to the web-framework.js
const express = require('express')
const router = express.Router()

const twitter = require('../models/api/twitter')

router.get('/:concha_user_id', async (req, res, next) => {
  try {
    const twitterDoc = await twitter.findOne(req.params.concha_user_id)

    if (twitterDoc === null) {
      const err = new Error()
      err.status = 404
      log.info({
        err: err,
        conchaUserId: req.params.concha_user_id
      }, 'Could not locate the users Twitter document')
      return next(err)
    }

    res.json(twitterDoc)
  } catch (err) {
    log.info({
      err: err,
      conchaUserId: req.params.concha_user_id
    }, 'An error occurred whilst locating the users Twitter document')
    return next(err)
  }
})

router.get('/age/:concha_user_id', async (req, res, next) => {
  try {
    const twitterDoc = await twitter.findOne(req.params.concha_user_id)

    if (twitterDoc === null) {
      const err = new Error()
      err.status = 404
      log.info({
        err: err,
        conchaUserId: req.params.concha_user_id
      }, 'Unable to find the age of the users Twitter document')
      return next(err)
    }

    res.json({ age: twitterDoc.age })
  } catch (err) {
    log.info({
      err: err,
      conchaUserId: req.params.concha_user_id
    }, 'An error occurred whilst locating the age of the users Twitter document')
    return next(err)
  }
})

module.exports = router
