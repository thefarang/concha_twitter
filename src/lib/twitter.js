'use strict'

const log = require('../services/log')

class Twitter {
  constructor (dbService) {
    this.dbService = dbService
  }

  async update (data) {
    try {
      const twitterDoc = await this.dbService.findOne(data.concha_user_id)
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
      await this.dbService.save(twitterDoc)
    } catch (err) {
      log.info({
        err: err,
        conchaUserId: data.concha_user_id
      }, 'An error occurred whilst finding or updating the Twitter document')
    }
  }
}

module.exports = Twitter
