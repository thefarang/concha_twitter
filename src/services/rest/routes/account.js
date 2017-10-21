'use strict'

const log = require('../../log')
const express = require('express')
const twitter = require('../../database/models/api/twitter')

const router = express.Router()

// Links the Concha user's account to Twitter
router.post('/link', async (req, res, next) => {
  const twitterDoc = {
    concha_user_id: req.body.concha_user_id,
    twitter_id: req.body.twitter_id,
    oauth_token: req.body.oauth_token,
    oauth_secret: req.body.oauth_secret,
    screenname: req.body.screenname,
    url: req.body.url
  }

  try {
    await twitter.save(twitterDoc)
  } catch (err) {
    // Check for duplicates and mark as 409
    if (err.code && err.code === 11000) {
      err.status = 409
    }

    log.info({
      err: err,
      twitterDoc: twitterDoc
    }, 'An error occurred whilst linking the users Twitter account')

    return next(err)
  }

  return res.json()
})

// Unlinks the Concha user's account from their Twitter account
router.delete('/link/:concha_user_id', async (req, res, next) => {
  let twitterDoc = null
  try {
    twitterDoc = await twitter.findOne(req.params.concha_user_id)

    if (twitterDoc === null) {
      const err = new Error('Unable to find the users Twitter document')
      err.status = 404
      throw err
    }

    await twitter.remove(twitterDoc)
    res.status(204)
    res.json()
  } catch (err) {
    log.info({
      err: err,
      conchaUserId: req.params.concha_user_id,
      twitterDoc: twitterDoc
    }, 'An error occurred whilst unlinking the users Twitter account')
    return next(err)
  }
})

module.exports = router
