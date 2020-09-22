const { DID } = require('dids')
const { resolve } = require('path')

const { createIDXSignedDefinitions, publishIDXSignedSchemas, signIDXSchemas } = require('../dist')
const { ceramic, createWallet, writeSigned } = require('./common')

const DEFINITIONS_PATH = resolve(__dirname, '../src/signed/definitions.json')
const SCHEMAS_PATH = resolve(__dirname, '../src/signed/schemas.json')

async function run() {
  const wallet = await createWallet()
  const did = new DID({ provider: wallet.getDidProvider() })

  await did.authenticate()
  console.log('DID authenticated')

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
