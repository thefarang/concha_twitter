'use strict'

const chai = require('chai')
const expect = require('chai').expect
const chaiHttp = require('chai-http')
const dbService = require('../../../support/database/service')
const app = require('../../../../app')

chai.use(chaiHttp)

/* eslint-disable no-unused-expressions */
/* eslint-disable handle-callback-err */
describe('Twitter Account API Endpoint', () => {
  before(async () => {
    await dbService.connect()
    await dbService.clean()
    await dbService.populate()
  })

  after(async () => {
    await dbService.disconnect()
  })

  it('Should return 409 if user Twitter account is already linked', (done) => {
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
