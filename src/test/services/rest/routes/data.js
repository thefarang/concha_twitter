'use strict'

const chai = require('chai')
const expect = require('chai').expect
const chaiHttp = require('chai-http')

const dbService = require('../../../mocks/database')
const mbService = require('../../../mocks/message-broker')
const restService = require('../../../../services/rest/service')
const app = require('../../../../app')(dbService, mbService, restService)

chai.use(chaiHttp)

const conchaUserKnownId = '507f1f77bcf86cd799439011'
const conchaUserUnknownId = '507f1f77bcf86cd799439010'
const testTwitterDoc = {
  concha_user_id: conchaUserKnownId,
  twitter_id: '12345678901234567890',
  oauth_token: '7588892-kagSNqWge8gB1WwE3plnFsJHAZVfxWD7Vb57p0b4&',
  oauth_secret: 'PbKfYqSryyeKDWz4ebtY3o5ogNLG11WJuZBc9fQrQo',
  screenname: 'concha_app',
  url: 'https://twitter.com/concha_app',
  age: '1970-01-01T00:00:00.000Z'
}

/* eslint-disable no-unused-expressions */
/* eslint-disable handle-callback-err */
describe('Twitter Data API Endpoint', () => {
  beforeEach(() => {
    dbService.removeAll()
    mbService.purgeQueue()
  })

  it('Should return 404 if user Twitter data does not exist', (done) => {
    chai
      .request(app)
      .get(`/api/v1/data/${conchaUserUnknownId}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res).to.have.status(404)
        expect(res).to.be.json
        expect(res.text).to.be.empty
        done()
      })
  })

  it('Should return 200 and Twitter data if user Twitter data exists', (done) => {
    // Create a document in the mock database
    dbService.save(testTwitterDoc)

    // Test retrieve the document
    chai
      .request(app)
      .get(`/api/v1/data/${conchaUserKnownId}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        const responseContents = JSON.parse(res.text)
        expect(res).to.have.status(200)
        expect(res).to.be.json
        expect(responseContents.concha_user_id).to.equal('507f1f77bcf86cd799439011')
        expect(responseContents.twitter_id).to.equal('12345678901234567890')
        expect(responseContents.oauth_token).to.equal('7588892-kagSNqWge8gB1WwE3plnFsJHAZVfxWD7Vb57p0b4&')
        expect(responseContents.oauth_secret).to.equal('PbKfYqSryyeKDWz4ebtY3o5ogNLG11WJuZBc9fQrQo')
        expect(responseContents.screenname).to.equal('concha_app')
        expect(responseContents.url).to.equal('https://twitter.com/concha_app')
        expect(responseContents.age).to.equal('1970-01-01T00:00:00.000Z')
        done()
      })
  })

  it('Should return 200 and the age of the Twitter data if user Twitter data exists', (done) => {
    // Create a document in the mock database
    dbService.save(testTwitterDoc)

    // Test retrieve the document age
    chai
      .request(app)
      .get(`/api/v1/data/age/${conchaUserKnownId}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        const responseContents = JSON.parse(res.text)
        expect(res).to.have.status(200)
        expect(res).to.be.json
        expect(responseContents.age).to.equal('1970-01-01T00:00:00.000Z')
        done()
      })
  })
})
/* eslint-enable handle-callback-err */
/* eslint-enable no-unused-expressions */
