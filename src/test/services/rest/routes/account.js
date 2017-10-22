'use strict'

const chai = require('chai')
const expect = require('chai').expect
const chaiHttp = require('chai-http')

const dbService = require('../../../mocks/database')
const mbService = require('../../../mocks/message-broker')
const restService = require('../../../../services/rest/service')
const app = require('../../../../app')(dbService, mbService, restService)

chai.use(chaiHttp)

/* eslint-disable no-unused-expressions */
/* eslint-disable handle-callback-err */
describe('Twitter Account API Endpoint', () => {
  beforeEach(() => {
    dbService.removeAll()
    mbService.purgeQueue()
  })

  /*
  it('Should return 409 if user Twitter account is already linked', (done) => {
    // Create a linked document in the mock database
    const testTwitterAccount = {
      concha_user_id: '507f1f77bcf86cd799439011',
      twitter_id: '2222333344445555',
      oauth_token: '7588892-kagSNqWge8gB1WwE3plnFsJHAZVfxWD7Vb57p0b4&',
      oauth_secret: 'PbKfYqSryyeKDWz4ebtY3o5ogNLG11WJuZBc9fQrQo',
      screenname: 'concha_app',
      url: 'https://twitter.com/concha_app'
    }
    dbService.upsert(testTwitterAccount)

    // Test to ensure linking an already linked document is impossible
    chai
      .request(app)
      .post(`/api/v1/account/link`)
      .set('Accept', 'application/json')
      .send(testTwitterAccount)
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

  it('Should return 204 if users Twitter account is successfully unlinked', (done) => {
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
  */

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
