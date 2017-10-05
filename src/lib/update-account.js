'use strict'

const mongoose = require('mongoose')
const TwitterData = require('../models/twitter-data')

const ObjectId = mongoose.Types.ObjectId

const updateAccount = (data) => {
console.log(1)
  TwitterData.findOne({
    concha_user_id: new ObjectId(data.concha_user_id)
  },
  (err, document) => {
    console.log(2)
    if (err) {
      console.log(3)
      // @todo
      // Log the error and return
      return
    }
    console.log(4)
    if (document === null) {
      console.log(5)
      // @todo
      // Log the error and return
      const err = new Error()
      err.status = 404
      return
    }
    console.log(6)
    document.url = data.url
    document.save((err) => {
      console.log(7)
      if (err) {
        console.log(8)
        // @todo
        // Log the error and return
      }
    })
  })
}

module.exports = updateAccount
