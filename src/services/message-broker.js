'use strict'

const config = require('config')
const log = require('./log')
const amqp = require('amqplib/callback_api')

const MAX_NO_OF_UNACK_MESSAGES = 10

const bootstrap = async (consumeAction) => {
  try {
    const conn = await connect(config.get('messageBroker'))
    const channel = await createChannel(conn)
    const incomingQueueName = config.get('incomingQueue')
    await assertQueue(channel, incomingQueueName)
    consume(channel, incomingQueueName, consumeAction)
  } catch (err) {
    log.info({ err: err }, 'An error occurred whilst booting the message broker')
  }
}

const connect = (messageBroker) => {
  return new Promise((resolve, reject) => {
    amqp.connect(messageBroker, (err, conn) => {
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

const assertQueue = (channel, incomingQueueName) => {
  return new Promise((resolve, reject) => {
    channel.assertQueue(incomingQueueName, { durable: false }, (err) => {
      if (err) {
        return reject(err)
      }
      return resolve(incomingQueueName)
    })
  })
}

const consume = (channel, incomingQueueName, consumeAction) => {
  // Maximum number of unacknowledged messages. RabbitMQ will not despatch
  // any more messages to this worker if 10 concurrent messages are being processed,
  // until one or more of those messages are acknowledged.
  channel.prefetch(MAX_NO_OF_UNACK_MESSAGES)
  channel.consume(
    incomingQueueName,
    msg => consumeAction(JSON.parse(msg.content.toString())), { noAck: false })
}

const cleanQueue = (channel, incomingQueueName) => {
  return new Promise((resolve, reject) => {
    channel.purgeQueue(incomingQueueName, (err) => {
      if (err) {
        return reject(err)
      }
      return resolve(incomingQueueName)
    })
  })
}

module.exports = {
  bootstrap,
  cleanQueue
}
