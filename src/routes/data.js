'use strict'

const express = require('express')
const mongoose = require('mongoose')
const TwitterData = require('../models/twitter-data')

const ObjectId = mongoose.Types.ObjectId
const router = express.Router()

router.get('/:concha_user_id', function (req, res, next) {
  TwitterData.findOne({
    concha_user_id: new ObjectId(req.params.concha_user_id)
  },
  (err, data) => {
    if (err) {
      return next(err)
    }

    if (data === null) {
      const err = new Error()
      err.status = 404
      return next(err)
    }

    res.json(data)
  })
})

router.get('/age/:concha_user_id', function (req, res, next) {
  TwitterData.findOne({
    concha_user_id: new ObjectId(req.params.concha_user_id)
  },
  (err, data) => {
    if (err) {
      return next(err)
    }

    if (data === null) {
      const err = new Error()
      err.status = 404
      return next(err)
    }

    res.json({ age: data.age })
  })
})

module.exports = router
