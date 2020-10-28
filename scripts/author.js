const { DID } = require('dids')
const { resolve } = require('path')
const Wallet = require('identity-wallet').default
const fromString = require('uint8arrays/from-string')

const {
  createIDXSignedDefinitions,
  encodeDagJWSResult,
  publishIDXSignedSchemas,
  signIDXSchemas,
} = require('../dist')
const { ceramic, writeJSON, writeSigned } = require('./common')

const DID_PATH = resolve(__dirname, '../src/signed/did.json')
const DEFINITIONS_PATH = resolve(__dirname, '../src/signed/definitions.json')
const SCHEMAS_PATH = resolve(__dirname, '../src/signed/schemas.json')

if (!process.env.SEED) {
  throw new Error('Missing SEED environment variable')
}

async function run() {
  const wallet = await await Wallet.create({
    ceramic,
    seed: fromString(process.env.SEED),
    getPermission() {
      return Promise.resolve([])
    },
    disableIDX: true,
  })
  const did = new DID({ provider: wallet.getDidProvider() })
  await did.authenticate()

  const records = await ceramic.loadDocumentRecords(did.id.replace('did:3:', ''))
  const encodedDID = records.map((record) => encodeDagJWSResult(record.value))
  await writeJSON(DID_PATH, encodedDID)
  console.log(`DID written to ${DID_PATH}`)

  const signedSchemas = await signIDXSchemas(did)
  console.log('Schemas signed')

  await writeSigned(SCHEMAS_PATH, signedSchemas)
  console.log(`Schemas written to ${SCHEMAS_PATH}`)

  const publishedSchemas = await publishIDXSignedSchemas(ceramic, signedSchemas)
  console.log('Schemas published')

  const signedDefinitions = await createIDXSignedDefinitions(did, publishedSchemas)
  console.log('Definitions signed')

  await writeSigned(DEFINITIONS_PATH, signedDefinitions)
  console.log(`Definitions written to ${DEFINITIONS_PATH}`)

  process.exit(0)
}

run().catch(console.error)
