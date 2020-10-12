/**
 * @jest-environment ceramic
 */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { DID } from 'dids'

import { createIDXDefinitions, createIDXSignedDefinitions } from '../src'

describe('definitions', () => {
  const DagJWSResult = expect.objectContaining({
    jws: expect.any(Object),
    linkedBlock: expect.any(Uint8Array),
  })
  const Records = expect.arrayContaining([DagJWSResult])

  const schemas = {
    BasicProfile: 'ceramic://BasicProfileSchema',
    CryptoAccountLinks: 'ceramic://CryptoAccountLinksSchema',
    ThreeIdKeychain: 'ceramic://ThreeIdKeychainSchema',
  } as any

  it('createIDXDefinitions', () => {
    expect(createIDXDefinitions(schemas)).toEqual({
      basicProfile: {
        name: 'Basic Profile',
        schema: 'ceramic://BasicProfileSchema',
      },
      cryptoAccountLinks: {
        name: 'Crypto Account Links',
        schema: 'ceramic://CryptoAccountLinksSchema',
      },
      threeIdKeychain: {
        name: '3ID Keychain',
        schema: 'ceramic://ThreeIdKeychainSchema',
      },
    })
  })

  it('createIDXSignedDefinitions', async () => {
    const did = new DID({ provider: wallet.getDidProvider() })
    await did.authenticate()
    await expect(createIDXSignedDefinitions(did, schemas)).resolves.toEqual({
      basicProfile: Records,
      cryptoAccountLinks: Records,
      threeIdKeychain: Records,
    })
  })
})
