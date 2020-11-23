/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { publishedDefinitions, publishedSchemas } from '../src'

describe('constants', () => {
  const DocID = expect.stringMatching(/^[0-9a-z]+$/)
  const DocURL = expect.stringMatching(/^ceramic:\/\/[0-9a-z]+$/)

  test('publishedDefinitions', () => {
    expect(publishedDefinitions).toEqual({
      basicProfile: DocID,
      cryptoAccounts: DocID,
      threeIdKeychain: DocID,
    })
  })

  test('publishedSchemas', () => {
    expect(publishedSchemas).toEqual({
      BasicProfile: DocURL,
      CryptoAccounts: DocURL,
      Definition: DocURL,
      IdentityIndex: DocURL,
      ThreeIdKeychain: DocURL,
    })
  })
})
