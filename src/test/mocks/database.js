'use strict'

const log = require('../../services/log')

let documents = []

const connect = () => { 
}

const disconnect = () => { 
}

const findOne = (conchaUserId) => {
  if (documents.length === 0) {
    return null
  }
  return documents[0]
}

const save = (document) => {
  documents.push(document)
}

const remove = (document) => {
  documents = []
}

const removeAll = () => {
  documents = []
}

module.exports = {
  connect,
  disconnect,
  findOne,
  save,
  remove,
  removeAll
}
