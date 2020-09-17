const {
  publishIDXSignedDefinitions,
  publishIDXSignedSchemas,
  signedDefinitions,
  signedSchemas,
} = require('..')
const { ceramic, createWallet, logJSON } = require('./common')

async function run() {
  const wallet = await createWallet()
  await ceramic.setDIDProvider(wallet.getDidProvider())
  console.log('Connected to Ceramic')

  const schemas = await publishIDXSignedSchemas(ceramic, signedSchemas)
  console.log('Schemas published')
  logJSON(schemas)

  const definitions = await publishIDXSignedDefinitions(ceramic, signedDefinitions)
  console.log('Definitions published')
  logJSON(definitions)

  process.exit(0)
}

run().catch(console.error)
