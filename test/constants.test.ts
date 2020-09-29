/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { publishedDefinitions, publishedSchemas } from '../src'

describe('constants', () => {
  const DocID = expect.stringMatching(/^ceramic:\/\/[0-9a-z]+$/)

  test('publisheDefinitions', () => {
    expect(publishedDefinitions).toEqual({
      basicProfile: DocID,
      cryptoAccountLinks: DocID,
    })
  })

  test('publishedSchemas', () => {
    expect(publishedSchemas).toEqual({
      BasicProfile: DocID,
      CryptoAccountLinks: DocID,
      Definition: DocID,
      IdentityIndex: DocID,
    })
  })
})
