/**
 * @jest-environment ceramic
 */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Ed25519Provider } from 'key-did-provider-ed25519'
import { fromString } from 'uint8arrays'

import { DocSet, publishIDXConfig, publishEncodedSignedDocSet } from '../src'

describe('docset', () => {
  beforeAll(async () => {
    const seed = fromString(
      '08b2e655d239e24e3ca9aa17bc1d05c1dee289d6ebf0b3542fd9536912d51ee9',
      'base16'
    )
    await Promise.all([
      ceramic.setDIDProvider(new Ed25519Provider(seed)),
      publishIDXConfig(ceramic),
    ])
  })

  test('publish signed', async () => {
    jest.setTimeout(20000)

    const signedDocSet = {
      definitions: ['myNotes'],
      schemas: ['NotesList', 'Note'],
      docs: {
        kjzl6cwe1jw145fnr3wdhvwnr5xfsivbangh3h19zn9hkdzmipf6nc6eh7l1f35: [
          {
            jws: {
              payload: 'AXESIIetblLn_3GtqjSTq1uQliArtNdecWG-yQhmvf0W4aJ4',
              signatures: [
                {
                  signature:
                    'ADloltapObPCVj6ukP4Ne-YGNXzBhcpnLBXy6bFsZXJc_769r93K4ZgrM6EBO5C8XCmtxa7LzGT2VLrvz1vQDg',
                  protected:
                    'eyJhbGciOiJFZERTQSIsImtpZCI6ImRpZDprZXk6ejZNa296QUVudXN0Z3BLV0hXM2poRmlSQkd3Nm9yWlRSa0sxdFZyNm1heFpycGo5I3o2TWtvekFFbnVzdGdwS1dIVzNqaEZpUkJHdzZvclpUUmtLMXRWcjZtYXhacnBqOSJ9',
                },
              ],
              link: 'bafyreiehvvxffz77ogw2unetvnnzbfrafo2noxtrmg7mscdgxx6rnyncpa',
            },
            linkedBlock:
              'o2RkYXRho2RuYW1lZW5vdGVzZnNjaGVtYXhLY2VyYW1pYzovL2szeTUybDdxYnYxZnJ4bmFtcDc1bnBlMzVxaDY4cnFkeDEwZjVpY3NnOTU4bzM1aTRiN2MzMW5rZHlmZjY3dTJva2Rlc2NyaXB0aW9uaE15IG5vdGVzZmhlYWRlcqJmc2NoZW1heEtjZXJhbWljOi8vazN5NTJsN3FidjFmcnhodWRrYXM3aGoyejlsNDV5M3cxbmhlam1qN3lrb3lybHVrcXdkMTYwMjMzbDdxdXBwOGdrY29udHJvbGxlcnOBeDhkaWQ6a2V5Ono2TWtvekFFbnVzdGdwS1dIVzNqaEZpUkJHdzZvclpUUmtLMXRWcjZtYXhacnBqOWZ1bmlxdWVwbnhrT3NZM0ZzRDlUTFJGNw==',
          },
        ],
        k3y52l7qbv1fryiu2rqm7ckayb3yqulcg3x50my3tmpa3kcuzzg4a48ehgg91qtq8: [
          {
            jws: {
              payload: 'AXESIKbkiLzP8CYr2XzpbrkcnL_j9Z59C6E4Elk-G8z9bWW9',
              signatures: [
                {
                  signature:
                    'Yb6q-frz4ancMOemnfBAzbkwVoVJqOdCabt4iSPMhk3eMz3TlpmKQovNBazpXy0JTT1zD2dE-TqCP8Xya8GEBg',
                  protected:
                    'eyJhbGciOiJFZERTQSIsImtpZCI6ImRpZDprZXk6ejZNa296QUVudXN0Z3BLV0hXM2poRmlSQkd3Nm9yWlRSa0sxdFZyNm1heFpycGo5I3o2TWtvekFFbnVzdGdwS1dIVzNqaEZpUkJHdzZvclpUUmtLMXRWcjZtYXhacnBqOSJ9',
                },
              ],
              link: 'bafyreifg4selzt7qeyv5s7hjn24rzhf74p2z47ilue4bewj6dpgp23lfxu',
            },
            linkedBlock:
              'o2RkYXRhpGR0eXBlZm9iamVjdGV0aXRsZWROb3RlZyRzY2hlbWF4J2h0dHA6Ly9qc29uLXNjaGVtYS5vcmcvZHJhZnQtMDcvc2NoZW1hI2pwcm9wZXJ0aWVzomRkYXRlpGR0eXBlZnN0cmluZ2V0aXRsZWRkYXRlZmZvcm1hdGlkYXRlLXRpbWVpbWF4TGVuZ3RoGB5kdGV4dKNkdHlwZWZzdHJpbmdldGl0bGVkdGV4dGltYXhMZW5ndGgZD6BmaGVhZGVyomZzY2hlbWH3a2NvbnRyb2xsZXJzgXg4ZGlkOmtleTp6Nk1rb3pBRW51c3RncEtXSFczamhGaVJCR3c2b3JaVFJrSzF0VnI2bWF4WnJwajlmdW5pcXVlcEJBNm8xeWozK2JpVlBUYVU=',
          },
        ],
        k3y52l7qbv1frxnamp75npe35qh68rqdx10f5icsg958o35i4b7c31nkdyff67u2o: [
          {
            jws: {
              payload: 'AXESIKm626fp3pDCEQpg3JqR5Ve6h0cXJk_OvEzYmRksZMp2',
              signatures: [
                {
                  signature:
                    'VNwnw4tWG0eKHWphk7imuWBi7vBWnt8EsDUlQphdgKUgfBnUaghy1UiTIWKfLYUl4cFDuSX4ivCy0vdunsxbCA',
                  protected:
                    'eyJhbGciOiJFZERTQSIsImtpZCI6ImRpZDprZXk6ejZNa296QUVudXN0Z3BLV0hXM2poRmlSQkd3Nm9yWlRSa0sxdFZyNm1heFpycGo5I3o2TWtvekFFbnVzdGdwS1dIVzNqaEZpUkJHdzZvclpUUmtLMXRWcjZtYXhacnBqOSJ9',
                },
              ],
              link: 'bafyreifjxln2p2o6sdbbccta3snjdzkxxkduofzgj7hlytgytemsyzgkoy',
            },
            linkedBlock:
              'o2RkYXRhpWR0eXBlZm9iamVjdGV0aXRsZWlOb3Rlc0xpc3RnJHNjaGVtYXgnaHR0cDovL2pzb24tc2NoZW1hLm9yZy9kcmFmdC0wNy9zY2hlbWEjanByb3BlcnRpZXOhZW5vdGVzo2R0eXBlZWFycmF5ZWl0ZW1zo2R0eXBlZm9iamVjdGV0aXRsZWhOb3RlSXRlbWpwcm9wZXJ0aWVzomJpZKFkJHJlZngaIy9kZWZpbml0aW9ucy9DZXJhbWljRG9jSWRldGl0bGWjZHR5cGVmc3RyaW5nZXRpdGxlZXRpdGxlaW1heExlbmd0aBhkZXRpdGxlZW5vdGVza2RlZmluaXRpb25zoWxDZXJhbWljRG9jSWSjZHR5cGVmc3RyaW5nZ3BhdHRlcm54HF5jZXJhbWljOi8vLisoXD92ZXJzaW9uPS4rKT9pbWF4TGVuZ3RoGJZmaGVhZGVyomZzY2hlbWH3a2NvbnRyb2xsZXJzgXg4ZGlkOmtleTp6Nk1rb3pBRW51c3RncEtXSFczamhGaVJCR3c2b3JaVFJrSzF0VnI2bWF4WnJwajlmdW5pcXVlcDk1aG9VM3NHR2lwVDNFSTY=',
          },
        ],
      },
    }

    await expect(publishEncodedSignedDocSet(ceramic, signedDocSet)).resolves.toBeUndefined()
  })

  test('creation flow', async () => {
    jest.setTimeout(20000)

    const NoteSchema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: 'Note',
      type: 'object',
      properties: {
        date: {
          type: 'string',
          format: 'date-time',
          title: 'date',
          maxLength: 30,
        },
        text: {
          type: 'string',
          title: 'text',
          maxLength: 4000,
        },
      },
    }

    const NotesListSchema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: 'NotesList',
      type: 'object',
      properties: {
        notes: {
          type: 'array',
          title: 'notes',
          items: {
            type: 'object',
            title: 'NoteItem',
            properties: {
              id: {
                $ref: '#/definitions/CeramicDocId',
              },
              title: {
                type: 'string',
                title: 'title',
                maxLength: 100,
              },
            },
          },
        },
      },
      definitions: {
        CeramicDocId: {
          type: 'string',
          pattern: '^ceramic://.+(\\?version=.+)?',
          maxLength: 150,
        },
      },
    }

    const docset = new DocSet(ceramic)
    const [notesListSchemaCommitID] = await Promise.all([
      docset.addSchema(NotesListSchema),
      docset.addSchema(NoteSchema),
    ])
    expect(docset.schemas).toEqual(['NotesList', 'Note'])

    await docset.addDefinition(
      {
        name: 'notes',
        description: 'My notes',
        schema: notesListSchemaCommitID.toUrl(),
      },
      'myNotes'
    )
    expect(docset.definitions).toEqual(['myNotes'])

    await expect(docset.toSignedJSON()).resolves.toBeDefined()
  })

  test('creation flow with associated schema', async () => {
    jest.setTimeout(20000)

    const docset = new DocSet(ceramic)

    // TODO: also test with external schema added in docset constructor?
    // or added dynamically

    const NoteSchema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: 'Note',
      type: 'object',
      properties: {
        date: {
          type: 'string',
          format: 'date-time',
          maxLength: 30,
        },
        text: {
          type: 'string',
          maxLength: 4000,
        },
      },
      required: ['date', 'text'],
    }

    const noteSchema = await ceramic.createDocument('tile', { content: NoteSchema })
    const noteSchemaURL = noteSchema.commitId.toUrl()

    const NotesSchema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: 'Notes',
      type: 'object',
      properties: {
        notes: {
          type: 'array',
          title: 'list',
          items: {
            type: 'object',
            title: 'item',
            properties: {
              note: {
                type: 'object',
                $id: 'ceramic://schemaReference',
                title: 'reference',
                properties: {
                  schema: { type: 'string', const: noteSchemaURL },
                  id: { type: 'string' },
                },
              },
              title: {
                type: 'string',
                maxLength: 100,
              },
            },
            required: ['note'],
          },
        },
      },
    }

    const notesSchema = await ceramic.createDocument('tile', { content: NotesSchema })
    const notesSchemaURL = notesSchema.commitId.toUrl()

    const notesDefinitionID = await docset.addDefinition(
      {
        name: 'notes',
        description: 'My notes',
        schema: notesSchemaURL,
      },
      'myNotes'
    )

    const exampleNoteID = await docset.addTile(
      'exampleNote',
      { date: '2020-12-10T11:12:34.567Z', text: 'An example note' },
      { schema: noteSchemaURL }
    )

    await expect(docset.toGraphQLDocSetRecords()).resolves.toEqual({
      index: {
        myNotes: {
          id: notesDefinitionID.toString(),
          schema: notesSchemaURL,
        },
      },
      lists: { NotesList: 'NotesListItem' },
      nodes: {
        [notesSchemaURL]: 'Notes',
        [noteSchemaURL]: 'Note',
      },
      objects: {
        NotesListItem: {
          note: {
            type: 'reference',
            name: 'NotesListItemReference',
            required: true,
          },
          title: {
            type: 'string',
            required: false,
            maxLength: 100,
          },
        },
        Notes: {
          notes: {
            name: 'NotesList',
            required: false,
            type: 'list',
          },
        },
        Note: {
          date: {
            type: 'string',
            required: true,
            format: 'date-time',
            maxLength: 30,
          },
          text: {
            type: 'string',
            required: true,
            maxLength: 4000,
          },
        },
      },
      references: {
        NotesListItemReference: [noteSchemaURL],
      },
      roots: {
        exampleNote: {
          id: exampleNoteID.toString(),
          schema: noteSchemaURL,
        },
      },
    })
  })
})
