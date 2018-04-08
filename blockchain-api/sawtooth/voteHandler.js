// SPDX-License-Identifier: Apache-2.0

/*
This code was written by Zac Delventhal @delventhalz.
Original source code can be found here: https://github.com/delventhalz/transfer-chain-js/blob/master/processor/handlers.js
 */

'use strict'

const { createHash } = require('crypto')
const { TransactionHandler } = require('sawtooth-sdk/processor/handler')
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions')
const { TransactionHeader } = require('sawtooth-sdk/protobuf')
const {Decoder} = require('cbor')

// Encoding helpers and constants
const getAddress = (key, length = 64) => {
  return createHash('sha512').update(key).digest('hex').slice(0, length)
}

const FAMILY = 'onlinevoting'
const PREFIX = getAddress(FAMILY, 6)

const getAssetAddress = payload => PREFIX + getAddress(payload.ellectionName,20) + getAddress(payload.userNumberB,20) + getAddress(payload.address,24)

const encode = obj => Buffer.from(JSON.stringify(obj, Object.keys(obj).sort()))
const decode = buf => JSON.parse(buf.toString())


// Handler for JSON encoded payloads
class JSONHandler extends TransactionHandler {
  constructor () {
    console.log('Initializing JSON handler for Sawtooth Tuna Chain')
    super(FAMILY, ['0.0.1'], [PREFIX])
  }

  apply (txn, context) {
    console.log("chegando uma nova transacao");

    const payload = JSON.parse(Decoder.decodeFirstSync(txn.payload));

    if(payload.action === 'create') {
      //acho que o asset aqui é a eleicao em si.. vou registrar um monte de voto naquela eleicao.
      const blockAddress = getAssetAddress(payload);
      const {candidateNumber,ellectionName} = payload;
      return context.setState({
        [blockAddress]: encode({candidateNumber,ellectionName})
      });
    }

    return Promise.resolve().then(() => {
      throw new InvalidTransaction(
        'Action must be "create", "transfer", "accept", or "reject"'
      )
    })
  }
}

module.exports = {
  JSONHandler
}
