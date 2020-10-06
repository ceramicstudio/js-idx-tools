/**
 * @jest-environment ceramic
 */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { DID } from 'dids'

import { schemas, signTile, signIDXDefinitions, signIDXSchemas } from '../src'

describe('signing', () => {
  const DagJWSResult = expect.objectContaining({
    jws: expect.any(Object),
    linkedBlock: expect.any(Uint8Array),
  })
  const Records = expect.arrayContaining([DagJWSResult])

  let did: DID
  beforeAll(async () => {
    did = new DID({ provider: wallet.getDidProvider() })
    await did.authenticate()
  })

  it('signTile', async () => {
    const tile = await signTile(did, { hello: 'test' })
    expect(tile).toEqual(DagJWSResult)
  })

  it('signIDXDefinitions', async () => {
    const signed = await signIDXDefinitions(did, 'ceramic://definitionId', {
      first: {
        name: 'First definition',
        schema: 'ceramic://first',
      },
      second: {
        name: 'Second definition',
        schema: 'ceramic://second',
      },
    })
    expect(signed).toEqual({
      first: Records,
      second: Records,
    })
  })

  it('signIDXSchemas', async () => {
    const expected = Object.keys(schemas).reduce((acc, name) => {
      acc[name] = Records
      return acc
    }, {})
    const signed = await signIDXSchemas(did)
    expect(signed).toEqual(expected)
  })
})
