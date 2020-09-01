import { CeramicApi } from '@ceramicnetwork/ceramic-common'

import { publishSchemas, schemasList } from '../src'

declare global {
  const ceramic: CeramicApi
}

describe('lib', () => {
  test('publishSchemas', async () => {
    const res = await publishSchemas({ ceramic, schemas: schemasList })
    expect(res).toMatchSnapshot()
  })
})
