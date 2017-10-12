'use strict'

const config = require('config')
const amqp = require('amqplib/callback_api')

const messagebroker = config.get('messageBroker')
const q = config.get('incomingQueue')

const connect = () => {
  return new Promise((resolve, reject) => {
    amqp.connect(messagebroker, (err, conn) => {
      if (err) {
        return reject(err)
      }
      return resolve(conn)
    })
  })
}

const createChannel = (conn) => {
  return new Promise((resolve, reject) => {
    conn.createChannel((err, channel) => {
      if (err) {
        return reject(err)
      }
      return resolve(channel)
    })
  })
}

const assertQueue = (channel) => {
  return new Promise((resolve, reject) => {
    channel.assertQueue(q, {durable: false}, (err) => {
      if (err) {
        return reject(err)
      }
      return resolve(q)
    })
  })
}

const cleanQueue = (channel) => {
  return new Promise((resolve, reject) => {
    channel.purgeQueue(q, (err) => {
      if (err) {
        return reject(err)
      }
      return resolve(q)
    })
  })
}

module.exports = {
  connect,
  createChannel,
  cleanQueue,
  assertQueue
}
