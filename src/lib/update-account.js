'use strict'

const log = require('../services/log')
const twitter = require('../models/api/twitter')

const updateAccount = async (data) => {
  try {
    const twitterDoc = await twitter.findOne(data.concha_user_id)

    if (twitterDoc === null) {
      // @todo
      // Should this code be aware of HTTP status codes?
      const err = new Error('The Twitter data document was not found')
      err.status = 404
      throw err
    }

    twitterDoc.no_of_followers = data.no_of_followers
    twitterDoc.no_of_tweets = data.no_of_tweets
    twitterDoc.no_of_likes_received = data.no_of_likes_received
    twitterDoc.no_of_replies_received = data.no_of_replies_received
    twitterDoc.no_of_retweets_received = data.no_of_retweets_received
    await twitter.save(twitterDoc)
  } catch (err) {
    log.info({
      err: err,
      conchaUserId: data.concha_user_id
    }, 'An error occurred updating the Twitter document')
    throw err
  }
}

module.exports = updateAccount
