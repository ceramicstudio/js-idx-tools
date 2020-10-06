/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { createTile, publishDoc, publishRecords } from '../src'

describe('publishing', () => {
  describe('createTile', () => {
    test('throw an error if the Ceramic instance is not authenticated', async () => {
      await expect(createTile({} as any, {})).rejects.toThrow(
        'Ceramic instance is not authenticated'
      )
    })

    test('sets the authenticated DID as owner if not set in metadata', async () => {
      const createDocument = jest.fn(() => Promise.resolve({ id: 'ceramic://docID' }))
      const pinAdd = jest.fn(() => Promise.resolve())
      const ceramic = { did: { id: 'did:test:123' }, createDocument, pin: { add: pinAdd } } as any

      await createTile(ceramic, { hello: 'test' }, { schema: 'ceramic://schemaID' })
      expect(createDocument).toBeCalledWith('tile', {
        content: { hello: 'test' },
        metadata: { owners: ['did:test:123'], schema: 'ceramic://schemaID' },
      })
      expect(pinAdd).toBeCalledWith('ceramic://docID')
    })

    test('sets the provided owners', async () => {
      const createDocument = jest.fn(() => Promise.resolve({ id: 'ceramic://docID' }))
      const pinAdd = jest.fn()
      const ceramic = { did: { id: 'did:test:123' }, createDocument, pin: { add: pinAdd } } as any

      await createTile(ceramic, { hello: 'test' }, { owners: ['did:test:456'] })
      expect(createDocument).toBeCalledWith('tile', {
        content: { hello: 'test' },
        metadata: { owners: ['did:test:456'] },
      })
    })
  })

  describe('publishDoc', () => {
    test('creates the document if the DocID is not provided', async () => {
      const createDocument = jest.fn(() => Promise.resolve({ id: 'ceramic://docID' }))
      const pinAdd = jest.fn(() => Promise.resolve())
      const ceramic = { did: { id: 'did:test:123' }, createDocument, pin: { add: pinAdd } } as any

      await expect(
        publishDoc(ceramic, {
          content: { hello: 'test' },
          owners: ['did:test:456'],
          schema: 'ceramic://schemaID',
        })
      ).resolves.toBe('ceramic://docID')
      expect(createDocument).toBeCalledWith('tile', {
        content: { hello: 'test' },
        metadata: { owners: ['did:test:456'], schema: 'ceramic://schemaID' },
      })
      expect(pinAdd).toBeCalledWith('ceramic://docID')
    })

    test('updates the document if contents changed', async () => {
      const change = jest.fn()
      const loadDocument = jest.fn(() => Promise.resolve({ content: { hello: 'world' }, change }))
      const ceramic = { loadDocument } as any

      await expect(
        publishDoc(ceramic, { id: 'ceramic://docID', content: { hello: 'test' } })
      ).resolves.toBe('ceramic://docID')
      expect(loadDocument).toBeCalledWith('ceramic://docID')
      expect(change).toBeCalledWith({ content: { hello: 'test' } })
    })

    test('does not update the document if contents have not changed', async () => {
      const change = jest.fn()
      const loadDocument = jest.fn(() => Promise.resolve({ content: { hello: 'test' }, change }))
      const ceramic = { loadDocument } as any

      await expect(
        publishDoc(ceramic, { id: 'ceramic://docID', content: { hello: 'test' } })
      ).resolves.toBe('ceramic://docID')
      expect(loadDocument).toBeCalledWith('ceramic://docID')
      expect(change).not.toBeCalled()
    })
  })

  test('publishRecords', async () => {
    const createDocument = jest.fn(() => Promise.resolve({ id: 'ceramic://docID' }))
    const applyRecord = jest.fn(() => Promise.resolve({ id: 'ceramic://docID' }))
    const pinAdd = jest.fn(() => Promise.resolve())
    const ceramic = {
      createDocumentFromGenesis: createDocument,
      applyRecord,
      pin: { add: pinAdd },
    } as any

    const records = [{ jws: {}, __genesis: true }, { jws: {} }, { jws: {} }]
    await expect(publishRecords(ceramic, records as any)).resolves.toBe('ceramic://docID')
    expect(createDocument).toBeCalledWith({ jws: {}, __genesis: true })
    expect(pinAdd).toBeCalledWith('ceramic://docID')
    expect(applyRecord).toBeCalledTimes(2)
    expect(applyRecord).toBeCalledWith('ceramic://docID', { jws: {} }, { applyOnly: true })
  })
})
