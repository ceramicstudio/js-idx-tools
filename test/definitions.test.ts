/**
 * @jest-environment ceramic
 */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { DID } from 'dids'
import Wallet from 'identity-wallet'
import { fromString } from 'uint8arrays'

import { createIDXDefinitions, createIDXSignedDefinitions } from '../src'

describe('definitions', () => {
  const DagJWSResult = expect.objectContaining({
    jws: expect.any(Object),
    linkedBlock: expect.any(Uint8Array),
  })
  const Records = expect.arrayContaining([DagJWSResult])

  const schemas = {
    BasicProfile: 'kjzl6cwe1jw147dvq16zluojmraqvwdmbh61dx9e0c59i344lcrsgqfohexp012',
    CryptoAccounts: 'kjzl6cwe1jw147dvq16zluojmraqvwdmbh61dx9e0c59i344lcrsgqfohexp123',
    Definition: 'kjzl6cwe1jw147dvq16zluojmraqvwdmbh61dx9e0c59i344lcrsgqfohexp234',
    IdentityIndex: 'kjzl6cwe1jw147dvq16zluojmraqvwdmbh61dx9e0c59i344lcrsgqfohexp345',
    ThreeIdKeychain: 'kjzl6cwe1jw147dvq16zluojmraqvwdmbh61dx9e0c59i344lcrsgqfohexp456',
  } as any

  it('createIDXDefinitions', () => {
    expect(createIDXDefinitions(schemas)).toEqual({
      basicProfile: {
        name: 'Basic Profile',
        schema: 'kjzl6cwe1jw147dvq16zluojmraqvwdmbh61dx9e0c59i344lcrsgqfohexp012',
        description: 'Basic profile information for a DID',
      },
      cryptoAccounts: {
        name: 'Crypto Accounts',
        schema: 'kjzl6cwe1jw147dvq16zluojmraqvwdmbh61dx9e0c59i344lcrsgqfohexp123',
        description: 'Crypto accounts linked to your DID',
      },
      threeIdKeychain: {
        name: '3ID Keychain',
        schema: 'kjzl6cwe1jw147dvq16zluojmraqvwdmbh61dx9e0c59i344lcrsgqfohexp456',
        description: 'Key data for 3ID',
      },
    })
  })

  it('createIDXSignedDefinitions', async () => {
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
    await expect(createIDXSignedDefinitions(did, schemas)).resolves.toEqual({
      basicProfile: Records,
      cryptoAccounts: Records,
      threeIdKeychain: Records,
    })
  })
})
