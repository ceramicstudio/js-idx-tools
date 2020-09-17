const { inspect } = require('util')
const Ceramic = require('@ceramicnetwork/ceramic-http-client').default
const { outputJSON } = require('fs-extra')
const Wallet = require('identity-wallet').default

const { encodeSignedMap } = require('..')

const SEED =
  process.env.SEED || '0x08b2e655d239e24e3ca9aa17bc1d05c1dee289d6ebf0b3542fd9536912d51ee0'

const ceramic = new Ceramic(process.env.CERAMIC_URL)

async function createWallet() {
  return await Wallet.create({
    ceramic,
    seed: SEED,
    getPermission() {
      return Promise.resolve([])
    },
  })
}

function logJSON(data) {
  console.log(inspect(data, { colors: true, depth: null }))
}

async function writeSigned(path, data) {
  await outputJSON(path, encodeSignedMap(data), { spaces: 2 })
}

module.exports = { ceramic, createWallet, logJSON, writeSigned }
