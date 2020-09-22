const { inspect } = require('util')
const Ceramic = require('@ceramicnetwork/ceramic-http-client').default
const { outputJSON } = require('fs-extra')
const Wallet = require('identity-wallet').default

const { encodeSignedMap } = require('..')

const seed = process.env.SEED
if (!seed) {
  throw new Error('Missing SEED environment variable')
}

const ceramic = new Ceramic(process.env.CERAMIC_URL)

async function createWallet() {
  return await Wallet.create({
    ceramic,
    seed,
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
