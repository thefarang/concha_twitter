'use strict'

const chai = require('chai')
const expect = require('chai').expect
const chaiHttp = require('chai-http')
const mongoose = require('mongoose')
const TwitterData = require('../src/models/twitter-data')
const app = require('../src/app')

const ObjectId = mongoose.Types.ObjectId
chai.use(chaiHttp)

const conchaUserUnknownId = '507f1f77bcf86cd799439010'
const conchaUserKnownId = '507f1f77bcf86cd799439011'

describe('Data API Endpoint', () => {
  
  before(async () => {
    return new Promise((resolve, reject) => {

      // Connect to the test database
      mongoose.Promise = global.Promise
      mongoose.connect('mongodb://mongo:27017/local', { useMongoClient: true }, (err) => {
        if (err) {
          return reject(err)
        }
        return resolve()
      })

    })
    .then(() => {

      return new Promise((resolve, reject) => {
        // Clear down the test database
        for (var i in mongoose.connection.collections) {
          mongoose.connection.collections[i].remove(function() {});
        }
        return resolve();
      })
    
    })
    .then(() => {

      // Populate the test database with test data.
      return new Promise((resolve, reject) => {
        const twitterData = new TwitterData()
        twitterData.concha_user_id = new ObjectId('507f1f77bcf86cd799439011')
        twitterData.twitter_id = '12345678901234567890'
        twitterData.oauth_token = '7588892-kagSNqWge8gB1WwE3plnFsJHAZVfxWD7Vb57p0b4&'
        twitterData.oauth_secret = 'PbKfYqSryyeKDWz4ebtY3o5ogNLG11WJuZBc9fQrQo'
        twitterData.screenname = 'concha_app'
        twitterData.url = 'https://twitter.com/concha_app'
        twitterData.age = new Date('1970-01-01T00:00:00.000Z')
        twitterData.save((err) => {
          if (err) {
            return reject(err)
          }
          return resolve()
        })

      })
      .catch((err) => {
        console.log(err)
        process.exit(0)
      })
    })
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
})
