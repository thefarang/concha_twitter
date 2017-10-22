'use strict'

const log = require('../../log')
const express = require('express')

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
    // Check for duplicates
    const existingTwitterDoc = await req.app.get('dbService').findOne(twitterDoc.concha_user_id)
    if (existingTwitterDoc !== null) {
      // Mark duplicates as a 409 error
      log.info({
        twitterDoc: twitterDoc
      }, 'The users twitter account is already linked')

      const err = new Error()
      err.status = 409
      return next(err)
    }
    return res.json()
  } catch (err) {
    log.info({
      err: err,
      twitterDoc: twitterDoc
    }, 'An error occurred whilst linking the users Twitter account')
    return next(err)
  }
})

// Unlinks the Concha user's account from their Twitter account
router.delete('/link/:concha_user_id', async (req, res, next) => {
  try {
    const twitterDoc = await req.app.get('dbService').findOne(req.params.concha_user_id)
    if (twitterDoc === null) {
      log.info({
        conchaUserId: req.params.concha_user_id
      }, 'Unable to find the users Twitter document prior to deletion')

      // Flow through to 404 handler
      return next()
    }

    await req.app.get('dbService').remove(req.params.concha_user_id)
    res.status(204)
    res.json()
  } catch (err) {
    log.info({
      err: err,
      conchaUserId: req.params.concha_user_id
    }, 'An error occurred whilst unlinking the users Twitter account')
    return next(err)
  }
})

module.exports = router
