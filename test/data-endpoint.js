'use strict'

// First load in modules
// Wrap mongoose in Mockgoose
// Populate with test data
// Perform tests...

const chai = require('chai')
const expect = require('chai').expect
const chaiHttp = require('chai-http')
const app = require('../src/app')

chai.use(chaiHttp)

const conchaUserId = '507f1f77bcf86cd799439011';

describe('Data API Endpoint', () => {
  beforeEach((done) => {
    done()
  })

  it ('Should return 404 if user Twitter data does not exist', (done) => {
    chai
      .request(app)
      // http://chaijs.com/plugins/chai-http/
      // .post('/user/me')
      // .set('X-API-Key', 'foobar')
      // .send({ password: '123', confirmPassword: '123' })
      // .field('password', '123')
      .get(`/api/v1/data/${conchaUserId}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(err).to.not.be.null
        expect(res).to.have.status(404)
        expect(res).to.be.json
        expect(res.text).to.be.empty
        done()
      })
  })

  /*
  it ('Should return 200 and Twitter data if user Twitter data exists', (done) => {
    chai
      .request(app)
      // http://chaijs.com/plugins/chai-http/
      // .post('/user/me')
      // .set('X-API-Key', 'foobar')
      // .send({ password: '123', confirmPassword: '123' })
      // .field('password', '123')
      .get(`/api/v1/data/${conchaUserId}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(200)
        expect(res).to.be.json
        console.log('EXTRACT THE CONTENTS OF THE JSON')
        // expect(res.text).to.include()
        done()
      })
  })
  */
})
