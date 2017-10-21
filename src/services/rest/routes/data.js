'use strict'

const log = require('../../log')
const twitter = require('../../database/models/api/twitter')
const express = require('express')

const router = express.Router()

router.get('/:concha_user_id', async (req, res, next) => {
  try {
    const twitterDoc = await twitter.findOne(req.params.concha_user_id)

    if (twitterDoc === null) {
      const err = new Error('Could not locate the users Twitter document')
      err.status = 404
      throw err
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
      const err = new Error('Unable to find the age of the users Twitter document')
      err.status = 404
      throw err
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
