const { inspect } = require('util')
const Ceramic = require('@ceramicnetwork/ceramic-http-client').default
const { outputJSON } = require('fs-extra')

const { encodeSignedMap } = require('..')

const ceramic = new Ceramic(process.env.CERAMIC_URL)

function logJSON(data) {
  console.log(inspect(data, { colors: true, depth: null }))
}

async function writeSigned(path, data) {
  await outputJSON(path, encodeSignedMap(data), { spaces: 2 })
}

module.exports = { ceramic, logJSON, writeSigned }
