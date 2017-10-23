'use strict'

let consumeAction = null
let dbService = null

const bootstrap = async (consumeActionIn, dbServiceIn) => {
  consumeAction = consumeActionIn
  dbService = dbServiceIn
}

const purgeQueue = () => {
}

const sendToQueue = (payload) => {
  consumeAction(JSON.parse(payload.toString()), dbService)
}

module.exports = {
  bootstrap,
  purgeQueue,
  sendToQueue
}
