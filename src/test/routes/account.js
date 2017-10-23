'use strict'

const chai = require('chai')
const expect = require('chai').expect
const chaiHttp = require('chai-http')

const Twitter = require('../../lib/twitter')
const dbService = require('../mocks/database')
const mbService = require('../mocks/message-broker')

// Inject app dependencies
const app = require('../../app')(dbService, mbService)
const twitter = new Twitter(dbService)
mbService.bootstrap(twitter)

chai.use(chaiHttp)

const testTwitterDoc = {
  concha_user_id: '507f1f77bcf86cd799439011',
  twitter_id: '2222333344445555',
  oauth_token: '7588892-kagSNqWge8gB1WwE3plnFsJHAZVfxWD7Vb57p0b4&',
  oauth_secret: 'PbKfYqSryyeKDWz4ebtY3o5ogNLG11WJuZBc9fQrQo',
  screenname: 'concha_app',
  url: 'https://twitter.com/concha_app'
}

/* eslint-disable no-unused-expressions */
/* eslint-disable handle-callback-err */
describe('Twitter Account API Endpoint', () => {
  beforeEach(() => {
    dbService.removeAll()
    mbService.purgeQueue()
  })

  it('Should return 409 if user Twitter account is already linked', (done) => {
    // Create a linked document in the mock database
    dbService.save(testTwitterDoc)

    // Test to ensure linking an already linked document is impossible
    chai
      .request(app)
      .post(`/api/v1/account/link`)
      .set('Accept', 'application/json')
      .send(testTwitterDoc)
      .end((err, res) => {
        expect(res).to.have.status(409)
        expect(res).to.be.json
        expect(res.text).to.be.empty
        done()
      })
  })

  it('Should return 200 if user Twitter account is successfully linked', (done) => {
    chai
      .request(app)
      .post(`/api/v1/account/link`)
      .set('Accept', 'application/json')
      .send(testTwitterDoc)
      .end((err, res) => {
        expect(res).to.have.status(200)
        expect(res).to.be.json
        expect(res.text).to.be.empty
        done()
      })
  })

  it('Should return 204 if users Twitter account is successfully unlinked', (done) => {
    // Create a linked document in the mock database
    dbService.save(testTwitterDoc)

    chai
      .request(app)
      .del(`/api/v1/account/link/507f1f77bcf86cd799439011`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res).to.have.status(204)
        expect(res.text).to.be.empty
        done()
      })
  })

  it('Should return 404 if users Twitter account does not exist and cannot be unlinked', (done) => {
    chai
      .request(app)
      .del(`/api/v1/account/link/507f1f77bcf86cd799439099`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res).to.have.status(404)
        expect(res).to.be.json
        expect(res.text).to.be.empty
        done()
      })
  })
})
/* eslint-enable handle-callback-err */
/* eslint-enable no-unused-expressions */
