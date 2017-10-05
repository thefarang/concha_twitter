'use strict'

const chai = require('chai')
const expect = require('chai').expect
const chaiHttp = require('chai-http')
const testDb = require('../support/db')
const app = require('../../app')

chai.use(chaiHttp)

const conchaUserUnknownId = '507f1f77bcf86cd799439010'
const conchaUserKnownId = '507f1f77bcf86cd799439011'

describe('Twitter Data API Endpoint', () => {
  
  before(async () => {
    await testDb.connect()
    await testDb.clean()
    await testDb.populate()
  })

  after(async () => {
    await testDb.close()
  })

  it ('Should return 404 if user Twitter data does not exist', (done) => {
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

  it ('Should return 200 and Twitter data if user Twitter data exists', (done) => {
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

  it ('Should return 200 and the age of the Twitter data if user Twitter data exists', (done) => {
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
