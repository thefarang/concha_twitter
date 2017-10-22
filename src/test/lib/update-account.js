'use strict'

const chai = require('chai')
const expect = require('chai').expect
const chaiHttp = require('chai-http')

const dbService = require('../mocks/database')
const mbService = require('../mocks/message-broker')
const restService = require('../../services/rest/service')
const app = require('../../app')(dbService, mbService, restService)

chai.use(chaiHttp)
const conchaUserId = '507f1f77bcf86cd799439011'

/* eslint-disable no-unused-expressions */
/* eslint-disable handle-callback-err */
describe('Twitter Account Message Broker', () => {
  beforeEach(() => { 
    dbService.removeAll()
    mbService.purgeQueue()
  })

  it('Should correctly trigger an update of the database', (done) => {
    // Create a document in the mock database
    dbService.upsert({
      concha_user_id: conchaUserId,
      twitter_id: '12345678901234567890',
      oauth_token: '7588892-kagSNqWge8gB1WwE3plnFsJHAZVfxWD7Vb57p0b4&',
      oauth_secret: 'PbKfYqSryyeKDWz4ebtY3o5ogNLG11WJuZBc9fQrQo',
      screenname: 'concha_app',
      url: 'https://twitter.com/concha_app'
    })

    // Create a payload with which to update the document
    const payload = JSON.stringify({
      concha_user_id: conchaUserId,
      no_of_followers: 100,
      no_of_tweets: 50,
      no_of_likes_received: 200,
      no_of_replies_received: 5,
      no_of_retweets_received: 50
    })

    // Publish the payload to the message broker.
    mbService.sendToQueue(Buffer.from(payload, 'UTF-8'))

    // Check to ensure the database was updated correctly
    chai
      .request(app)
      .get(`/api/v1/data/${conchaUserId}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        const responseContents = JSON.parse(res.text)
        expect(res).to.have.status(200)
        expect(res).to.be.json
        expect(responseContents.concha_user_id).to.equal('507f1f77bcf86cd799439011')
        expect(responseContents.no_of_followers).to.equal(100)
        expect(responseContents.no_of_tweets).to.equal(50)
        expect(responseContents.no_of_likes_received).to.equal(200)
        expect(responseContents.no_of_replies_received).to.equal(5)
        expect(responseContents.no_of_retweets_received).to.equal(50)
        done()
      })
  })
})
/* eslint-enable handle-callback-err */
/* eslint-enable no-unused-expressions */
