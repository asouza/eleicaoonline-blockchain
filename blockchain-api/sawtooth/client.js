'use strict'

const cbor = require('cbor')
const {buildSawtoothPackage,sendToSawtoothApi} = require('./infra');

const registerBlockchain = (privateKey,payload) => {

  const payloadBytes = cbor.encode(JSON.stringify(payload));

  const batchBytes = buildSawtoothPackage(payloadBytes,privateKey);

  sendToSawtoothApi(batchBytes);

}

module.exports = { registerBlockchain }
