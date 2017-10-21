'use strict'

const chai = require('chai')
const expect = require('chai').expect
const chaiHttp = require('chai-http')
const dbService = require('../support/database/service')
const testMb = require('../support/mb')
const app = require('../../app')

chai.use(chaiHttp)

// Message broker channel and queue
let mbChannel = null
let mbQueue = null
const conchaUserId = '507f1f77bcf86cd799439011'

/* eslint-disable no-unused-expressions */
/* eslint-disable handle-callback-err */
describe('Twitter Account Message Broker', () => {
  before(async () => {
    await dbService.connect()
    await dbService.clean()
    await dbService.populate()

    const conn = await testMb.connect()
    mbChannel = await testMb.createChannel(conn)
    mbQueue = await testMb.assertQueue(mbChannel)
    mbQueue = await testMb.cleanQueue(mbChannel)
  })

  after(async () => {
    await dbService.disconnect()
  })

  it('Should correctly trigger an update of the database', (done) => {
    // First create a payload and publish an update to the message broker.
    const payload = JSON.stringify({
      concha_user_id: conchaUserId,
      no_of_followers: 100,
      no_of_tweets: 50,
      no_of_likes_received: 200,
      no_of_replies_received: 5,
      no_of_retweets_received: 50
    })
    mbChannel.sendToQueue(mbQueue, Buffer.from(payload, 'UTF-8'), { persistent: false })

    // Wait a couple of seconds to allow the message to be picked up off
    // the queue and processed, then check to ensure the database was
    // updated correctly
    setTimeout(() => {
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
    }, 2000)
  })
})
/* eslint-enable handle-callback-err */
/* eslint-enable no-unused-expressions */
