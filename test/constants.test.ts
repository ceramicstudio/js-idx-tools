/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { publishedDefinitions, publishedSchemas } from '../src'

describe('constants', () => {
  const DocID = expect.stringMatching(/^ceramic:\/\/[0-9a-z]+$/)

  test('publishedDefinitions', () => {
    expect(publishedDefinitions).toEqual({
      basicProfile: DocID,
      cryptoAccountLinks: DocID,
      threeIdKeychain: DocID,
    })
  })

  test('publishedSchemas', () => {
    expect(publishedSchemas).toEqual({
      BasicProfile: DocID,
      CryptoAccountLinks: DocID,
      Definition: DocID,
      IdentityIndex: DocID,
      ThreeIdKeychain: DocID,
    })
  })
})
