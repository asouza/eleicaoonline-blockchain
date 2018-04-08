// SPDX-License-Identifier: Apache-2.0

/*
This code was written by Zac Delventhal @delventhalz.
Original source code can be found here: https://github.com/delventhalz/transfer-chain-js/blob/master/client/src/state.js
 */

'use strict'

const {createHash} = require('crypto')
const {protobuf} = require('sawtooth-sdk')
const {createContext, CryptoFactory} = require('sawtooth-sdk/signing')
const {Secp256k1PrivateKey} = require('sawtooth-sdk/signing/secp256k1')
const cbor = require('cbor')
const {Decoder} = require('cbor')

const request = require('request');

const getAddress = (key, length) => {
  return createHash('sha512').update(key).digest('hex').slice(0, length)
}


const FAMILY = 'onlinevoting';
const VERSION = '0.0.1';
const PREFIX = 'e659db';
const API_URL = 'http://localhost:8008';

const decode = buf => JSON.parse(buf.toString())

function parseState(error, response, body) {
    if(error) {
      return [];
    }
    const votes = JSON.parse(body);

    const allVotes = votes.data.reduce((processed, datum) => {
      if (datum.data !== '') {
        //quem encodou com base64?
        const parsed = JSON.parse(new Buffer(datum.data, 'base64').toString());
        processed.push(parsed)
      }
      return processed
    },[]);

    return allVotes;
}

function voterVotes(ellectionName,publicKey,cb) {
  request({
      url:`${API_URL}/state?address=${PREFIX}${getAddress(ellectionName,20)}${getAddress(publicKey,20)}`,
      method:'GET'
      },
      (error, response, body) => {
        cb(parseState(error,response,body));
      }
  );
}

function ellectionVotes(ellectionName,cb) {
  request({
      url:`${API_URL}/state?address=${PREFIX}${getAddress(ellectionName,20)}`,
      method:'GET'
      },
      (error, response, body) => {
        cb(parseState(error,response,body));
      }
  );
}

// Submit signed Transaction to validator
const submitUpdate = (privateKey,payload, cb) => {

  const context = createContext('secp256k1');
  const privateKeyInstance = Secp256k1PrivateKey.fromHex(privateKey);
  const signer = new CryptoFactory(context).newSigner(privateKeyInstance);

  const payloadBytes = cbor.encode(JSON.stringify({publicKey:signer.getPublicKey().asHex(),...payload}));

  const transactionHeaderBytes = protobuf.TransactionHeader.encode({
    familyName: FAMILY,
    familyVersion: VERSION,
    inputs: [PREFIX],
    outputs: [PREFIX],
    signerPublicKey: signer.getPublicKey().asHex(),
    batcherPublicKey: signer.getPublicKey().asHex(),
    payloadSha512: createHash('sha512').update(payloadBytes).digest('hex'),
    nonce: payload.nonce
  }).finish();

  const signature = signer.sign(transactionHeaderBytes);

  const transaction = protobuf.Transaction.create({
      header: transactionHeaderBytes,
      headerSignature: signature,
      payload: payloadBytes
  });

  const batchHeaderBytes = protobuf.BatchHeader.encode({
      signerPublicKey: signer.getPublicKey().asHex(),
      transactionIds: [transaction.headerSignature],
  }).finish();

  const batchSignature = signer.sign(batchHeaderBytes);

  const batch = protobuf.Batch.create({
      header: batchHeaderBytes,
      headerSignature: batchSignature,
      transactions: [transaction]
  });

  const batchBytes = protobuf.BatchList.encode({
      batches: [batch]
  }).finish();


  request({
      url: `${API_URL}/batches?wait`,
      method: 'POST',
      body: batchBytes,
      encoding: null,
      headers: {'Content-Type': 'application/octet-stream'}
    }, (error, response, body) => {
      if (error) {
        console.log(error);
        cb(false);
      } else {
        const res = new Buffer(response.body, 'base64').toString()
        console.log('Response: ', res);
        cb(true);
      }
    })

}

module.exports = {
  submitUpdate,ellectionVotes,voterVotes
}
