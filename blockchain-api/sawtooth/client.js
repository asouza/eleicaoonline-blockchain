// SPDX-License-Identifier: Apache-2.0

/*
This code was written by Zac Delventhal @delventhalz.
Original source code can be found here: https://github.com/delventhalz/transfer-chain-js/blob/master/client/src/state.js
 */

'use strict'

const cbor = require('cbor')
const {buildSawtoothPackage,sendToSawtoothApi} = require('./infra');

const registerBlockchain = (privateKey,payload) => {

  const payloadBytes = cbor.encode(JSON.stringify(payload));

  const batchBytes = buildSawtoothPackage(payloadBytes,privateKey);

  sendToSawtoothApi(batchBytes);

}

module.exports = { registerBlockchain }
