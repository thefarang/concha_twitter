'use strict'

let twitter = null

const bootstrap = async (twitterIn) => {
  twitter = twitterIn
}

const purgeQueue = () => {
}

const sendToQueue = (payload) => {
  twitter.update(JSON.parse(payload.toString()))
}

module.exports = {
  bootstrap,
  purgeQueue,
  sendToQueue
}
