'use strict'

const log = require('../services/log')
const express = require('express')

const router = express.Router()

router.get('/:concha_user_id', async (req, res, next) => {
  try {
    const twitterDoc = await req.app.get('dbService').findOne(req.params.concha_user_id)
    if (twitterDoc === null) {
      log.info({
        conchaUserId: req.params.concha_user_id
      }, 'Unable to locate the users Twitter document')

      // Flow through to 404 handler
      return next()
    }

    res.json(twitterDoc)
  } catch (err) {
    log.info({
      err: err.stack,
      conchaUserId: req.params.concha_user_id
    }, 'An error occurred whilst locating the users Twitter document')
    return next(err)
  }
})

router.get('/age/:concha_user_id', async (req, res, next) => {
  try {
    const twitterDoc = await req.app.get('dbService').findOne(req.params.concha_user_id)
    if (twitterDoc === null) {
      log.info({
        conchaUserId: req.params.concha_user_id
      }, 'Unable to find the age of the users Twitter document')

      // Flow through to 404 handler
      return next()
    }

    res.json({ age: twitterDoc.age })
  } catch (err) {
    log.info({
      err: err.stack,
      conchaUserId: req.params.concha_user_id
    }, 'An error occurred whilst locating the age of the users Twitter document')
    return next(err)
  }
})

module.exports = router
