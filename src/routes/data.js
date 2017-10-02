'use strict'

const express = require('express')
const TwitterData = require('../models/twitter-data')
const router = express.Router()

router.get('/:concha_user_id', function (req, res, next) {
  TwitterData.find().byObjectId(req.params.concha_user_id).exec((err, data) => {
    if (err) {
      return next(err)
    }

    if (data === null) {
      const err = new Error()
      err.status = 404
      return next(err)
    }

    // @todo
    // Prune hidden fields, implement this in the TwitterData class.
    res.json(data)
  })
})

module.exports = router
