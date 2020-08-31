import { CeramicApi } from '@ceramicnetwork/ceramic-common'

import { allSchemas, publishSchemas } from '../src'

declare global {
  const ceramic: CeramicApi
}

describe('lib', () => {
  test('publishSchemas', async () => {
    const schemas = Object.entries(allSchemas).map(([name, schema]) => ({ name, schema }))
    // eslint-disable-next-line
    const res = await publishSchemas({ ceramic, schemas })
    expect(res).toMatchSnapshot()
  })
})
