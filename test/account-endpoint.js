'use strict'

const chai = require('chai')
const expect = require('chai').expect
const chaiHttp = require('chai-http')
const mongoose = require('mongoose')
const TwitterData = require('../src/models/twitter-data')
const app = require('../src/app')

const ObjectId = mongoose.Types.ObjectId
chai.use(chaiHttp)

describe('Twitter Account API Endpoint', () => {

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

  after((done) => {
    mongoose.connection.close(() => {
      done()
    })
  })

  it ('Should return 409 if user Twitter account is already linked', (done) => {
    chai
      .request(app)
      .post(`/api/v1/account/link`)
      .set('Accept', 'application/json')
      .send({ 
        concha_user_id: '507f1f77bcf86cd799439011',
        twitter_id: '2222333344445555',
        oauth_token: '7588892-kagSNqWge8gB1WwE3plnFsJHAZVfxWD7Vb57p0b4&',
        oauth_secret: 'PbKfYqSryyeKDWz4ebtY3o5ogNLG11WJuZBc9fQrQo',
        screenname: 'test_user',
        url: 'https://twitter.com/test_user'
      })
      .end((err, res) => {
        expect(res).to.have.status(409)
        expect(res).to.be.json
        expect(res.text).to.be.empty
        done()
      })
  })

  it ('Should return 200 if user Twitter account is successfully linked', (done) => {
    chai
      .request(app)
      .post(`/api/v1/account/link`)
      .set('Accept', 'application/json')
      .send({ 
        concha_user_id: '507f1f77bcf86cd799439020',
        twitter_id: '2222333344445566',
        oauth_token: '7588892-kagSNqWge8gB1WwE3plnFsJHAZVfxWD7Vb57p0b4&',
        oauth_secret: 'PbKfYqSryyeKDWz4ebtY3o5ogNLG11WJuZBc9fQrQo',
        screenname: 'test_user2',
        url: 'https://twitter.com/test_user2'
      })
      .end((err, res) => {
        expect(res).to.have.status(200)
        expect(res).to.be.json
        expect(res.text).to.be.empty
        done()
      })
  })

  it ('Should return 204 if users Twitter account is successfully unlinked', (done) => {
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

  it ('Should return 404 if users Twitter account does not exist and cannot be unlinked', (done) => {
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
