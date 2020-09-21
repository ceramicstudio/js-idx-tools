import { CeramicApi } from '@ceramicnetwork/ceramic-common'

import { publishSchemas, schemasList } from '../src'

declare global {
  const ceramic: CeramicApi
}

describe('lib', () => {
  const DocID = expect.stringMatching(/^ceramic:\/\/[0-9a-z]+$/) as jest.Expect

  test('publishSchemas', async () => {
    const res = await publishSchemas({ ceramic, schemas: schemasList })
    expect(res).toEqual({
      BasicProfile: DocID,
      Definition: DocID,
      DocIdDocIdMap: DocID,
      DocIdMap: DocID,
      IdentityIndex: DocID,
      StringMap: DocID,
      CryptoAccountLinks: DocID,
    })
  })
})
