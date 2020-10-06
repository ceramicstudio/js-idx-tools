/**
 * @jest-environment ceramic
 */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { CeramicApi } from '@ceramicnetwork/ceramic-common'
import { DID } from 'dids'
import Wallet from 'identity-wallet'

import {
  createIDXSignedDefinitions,
  publishIDXConfig,
  publishIDXSignedDefinitions,
  publishIDXSignedSchemas,
  signIDXSchemas,
} from '..'

const SEED = '0x08b2e655d239e24e3ca9aa17bc1d05c1dee289d6ebf0b3542fd9536912d51ee0'

declare global {
  const ceramic: CeramicApi
  const wallet: Wallet
}

describe('lib', () => {
  const DocID = expect.stringMatching(/^ceramic:\/\/[0-9a-z]+$/) as jest.Expect
  const DagJWSResult = expect.objectContaining({
    jws: expect.any(Object),
    linkedBlock: expect.any(Uint8Array),
  })
  const Records = expect.arrayContaining([DagJWSResult])

  test('publish config', async () => {
    jest.setTimeout(60000)

    const config = await publishIDXConfig(ceramic)
    expect(config).toEqual({
      definitions: {
        basicProfile: DocID,
        cryptoAccountLinks: DocID,
      },
      schemas: {
        BasicProfile: DocID,
        CryptoAccountLinks: DocID,
        Definition: DocID,
        IdentityIndex: DocID,
      },
    })
  })

  test('signing and publishing flow', async () => {
    const wallet = await Wallet.create({
      ceramic,
      seed: SEED,
      getPermission() {
        return Promise.resolve([])
      },
    })
    const did = new DID({ provider: wallet.getDidProvider() })
    await did.authenticate()

    // Wallet.create() attaches itself to the Ceramic instance, so we need to create a new instance
    // to ensure the schemas and definitions author is different from the publishing DID
    await Wallet.create({
      ceramic,
      seed: '0x9a4a9470cf014277f58a8f5761611662b38b5306ddf5403b3417d2e9d28aaf1e',
      getPermission() {
        return Promise.resolve([])
      },
    })
    expect(did.id).not.toBe(ceramic.did.id)

    // First sign all the schemas using the DID
    const signedSchemas = await signIDXSchemas(did)
    expect(signedSchemas).toEqual({
      BasicProfile: Records,
      CryptoAccountLinks: Records,
      Definition: Records,
      IdentityIndex: Records,
    })

    // Publish the signed schemas to Ceramic, no need to be the authoring DID
    const publishedSchemas = await publishIDXSignedSchemas(ceramic, signedSchemas)
    expect(publishedSchemas).toEqual({
      BasicProfile: DocID,
      CryptoAccountLinks: DocID,
      Definition: DocID,
      IdentityIndex: DocID,
    })

    // Create and sign the definitions, we need the published schemas DocIDs for this
    const signedDefinitions = await createIDXSignedDefinitions(did, publishedSchemas)
    expect(signedDefinitions).toEqual({
      basicProfile: Records,
      cryptoAccountLinks: Records,
    })

    // Publish the definitions to Ceramic
    const publishedDefinitions = await publishIDXSignedDefinitions(ceramic, signedDefinitions)
    expect(publishedDefinitions).toEqual({
      basicProfile: DocID,
      cryptoAccountLinks: DocID,
    })
  })
})
