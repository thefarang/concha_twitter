'use strict'

const log = require('../services/log')

const updateAccount = async (data, dbService) => {
  try {
    const twitterDoc = await dbService.findOne(data.concha_user_id)
    if (twitterDoc === null) {
      log.info({
        conchaUserId: data.concha_user_id
      }, 'The Twitter data document was not found')
      return
    }

    // Update the Twitter link object with the updated values, then save
    twitterDoc.no_of_followers = data.no_of_followers
    twitterDoc.no_of_tweets = data.no_of_tweets
    twitterDoc.no_of_likes_received = data.no_of_likes_received
    twitterDoc.no_of_replies_received = data.no_of_replies_received
    twitterDoc.no_of_retweets_received = data.no_of_retweets_received
    twitterDoc.age = data.age
    await dbService.save(twitterDoc)
  } catch (err) {
    log.info({
      err: err,
      conchaUserId: data.concha_user_id
    }, 'An error occurred whilst finding or updating the Twitter document')
  }
}

module.exports = updateAccount
