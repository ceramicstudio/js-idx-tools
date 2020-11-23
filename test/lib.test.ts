/**
 * @jest-environment ceramic
 */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { CeramicApi } from '@ceramicnetwork/ceramic-common'
import { DID } from 'dids'
import Wallet from 'identity-wallet'
import { fromString } from 'uint8arrays'

import {
  createIDXSignedDefinitions,
  publishIDXConfig,
  publishIDXSignedDefinitions,
  publishIDXSignedSchemas,
  publishedDefinitions,
  publishedSchemas,
  signIDXSchemas,
} from '..'

declare global {
  const ceramic: CeramicApi
}

describe('lib', () => {
  const DocID = expect.stringMatching(/^[0-9a-z]+$/) as jest.Expect
  const DocURL = expect.stringMatching(/^ceramic:\/\/[0-9a-z]+$/) as jest.Expect
  const DagJWSResult = expect.objectContaining({
    jws: expect.any(Object),
    linkedBlock: expect.any(Uint8Array),
  })
  const Records = expect.arrayContaining([DagJWSResult])

  test('publish config', async () => {
    jest.setTimeout(60000)

    const config = await publishIDXConfig(ceramic)
    expect(config).toEqual({
      definitions: publishedDefinitions,
      schemas: publishedSchemas,
    })
  })

  test('signing and publishing flow', async () => {
    const wallet = await Wallet.create({
      ceramic,
      seed: fromString('08b2e655d239e24e3ca9aa17bc1d05c1dee289d6ebf0b3542fd9536912d51ee0'),
      getPermission() {
        return Promise.resolve([])
      },
      disableIDX: true,
    })
    const did = new DID({ provider: wallet.getDidProvider() })
    await did.authenticate()

    // Wallet.create() attaches itself to the Ceramic instance, so we need to create a new instance
    // to ensure the schemas and definitions author is different from the publishing DID
    await Wallet.create({
      ceramic,
      seed: fromString('9a4a9470cf014277f58a8f5761611662b38b5306ddf5403b3417d2e9d28aaf1e'),
      getPermission() {
        return Promise.resolve([])
      },
      disableIDX: true,
    })
    expect(did.id).not.toBe(ceramic.did.id)

    // First sign all the schemas using the DID
    const signedSchemas = await signIDXSchemas(did)
    expect(signedSchemas).toEqual({
      BasicProfile: Records,
      CryptoAccounts: Records,
      Definition: Records,
      IdentityIndex: Records,
      ThreeIdKeychain: Records,
    })

    // Publish the signed schemas to Ceramic, no need to be the authoring DID
    const schemas = await publishIDXSignedSchemas(ceramic, signedSchemas)
    expect(schemas).toEqual({
      BasicProfile: DocURL,
      CryptoAccounts: DocURL,
      Definition: DocURL,
      IdentityIndex: DocURL,
      ThreeIdKeychain: DocURL,
    })

    // Create and sign the definitions, we need the published schemas DocIDs for this
    const signedDefinitions = await createIDXSignedDefinitions(did, publishedSchemas)
    expect(signedDefinitions).toEqual({
      basicProfile: Records,
      cryptoAccounts: Records,
      threeIdKeychain: Records,
    })

    // Publish the definitions to Ceramic
    const definitions = await publishIDXSignedDefinitions(ceramic, signedDefinitions)
    expect(definitions).toEqual({
      basicProfile: DocID,
      cryptoAccounts: DocID,
      threeIdKeychain: DocID,
    })
  })
})
