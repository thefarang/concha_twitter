'use strict'

let queue = []
let consumeAction = null
let dbService = null

const bootstrap = async (consumeActionIn, dbServiceIn) => {
  consumeAction = consumeActionIn
  dbService = dbServiceIn
}

const purgeQueue = () => {
  queue = []

}

const sendToQueue = (payload) => {
  consumeAction(JSON.parse(payload.toString()), dbService)
}

module.exports = {
  bootstrap,
  purgeQueue,
  sendToQueue
}
