const { publishIDXConfig } = require('..')
const { ceramic, createWallet, logJSON } = require('./common')

async function run() {
  const wallet = await createWallet()
  await ceramic.setDIDProvider(wallet.getDidProvider())
  console.log('Connected to Ceramic')

  const config = await publishIDXConfig(ceramic)
  console.log('IDX config published:')
  logJSON(config)

  process.exit(0)
}

run().catch(console.error)
