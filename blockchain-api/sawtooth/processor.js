// SPDX-License-Identifier: Apache-2.0

/*
This code was written by Zac Delventhal @delventhalz.
Original source code can be found here: https://github.com/delventhalz/transfer-chain-js/blob/master/processor/index.js
 */


'use strict'

const { TransactionProcessor } = require('sawtooth-sdk/processor');
const VALIDATOR_URL = 'tcp://localhost:4004';

module.exports = (handler) => {
  const tp = new TransactionProcessor(VALIDATOR_URL)
  tp.addHandler(handler)
  tp.start()
}
