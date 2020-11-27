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
    const signedDocSet = {
      definitions: ['myNotes'],
      schemas: ['NotesList', 'Note'],
      docs: {
        kjzl6cwe1jw145ush10bp0fq34go56bciwo1k3kbqxcrf5236f8cgy9lt9kmq4m: [
          {
            jws: {
              payload: 'AXESINthJLuwcC2WbzEjEiOcIZsG2YFuyxe2cvoLMDgTsanH',
              signatures: [
                {
                  signature:
                    'awDggK0I_83K6Jxwms-e0coqzL2uawJSRi6T8Yd7kqES5Scqoi9M8UcZcGrmzxNARcYQ9WQmdqBMvSUSlw4BCQ',
                  protected:
                    'eyJhbGciOiJFZERTQSIsImtpZCI6ImRpZDprZXk6ejZNa2pRWTZpV3Z6ekh4S1JIRlZFdzk3YldnV2Y2TUxOY0RVVkVGcXJaYlc5aWRQI3o2TWtqUVk2aVd2enpIeEtSSEZWRXc5N2JXZ1dmNk1MTmNEVVZFRnFyWmJXOWlkUCJ9',
                },
              ],
              link: 'bafyreig3meslxmdqfwlg6mjdcirzyim3a3myc3wlc63hf6qlga4bhmnjy4',
            },
            linkedBlock:
              'o2RkYXRho2RuYW1lZW5vdGVzZnNjaGVtYXhLY2VyYW1pYzovL2szeTUybDdxYnYxZnJ5aDltYTl0N2doOTNzc2d0bmYwOG5vYmw3MXprNzRqeHY0YTRubWpibHc3OXdvY2h4bW8wa2Rlc2NyaXB0aW9uaE15IG5vdGVzZmhlYWRlcqNmc2NoZW1heEtjZXJhbWljOi8vazN5NTJsN3FidjFmcnk2emZuczRpazh4cGw0Z2Z1cWluYWM1MGIxN2ozejBmMzJ2Z2llOHY5cnQyMzVjdjcyZjRnY2hhaW5JZG5pbm1lbW9yeToxMjM0NWtjb250cm9sbGVyc4F4OGRpZDprZXk6ejZNa2pRWTZpV3Z6ekh4S1JIRlZFdzk3YldnV2Y2TUxOY0RVVkVGcXJaYlc5aWRQZnVuaXF1ZXBIREFKUFNjeCtTVmZta2ha',
          },
        ],
        k3y52l7qbv1fryh9ma9t7gh93ssgtnf08nobl71zk74jxv4a4nmjblw79wochxmo0: [
          {
            jws: {
              payload: 'AXESIFlxJu7HpZ1PnDvUqoO7fi280vKPSODBc7bzVnSYlggW',
              signatures: [
                {
                  signature:
                    'u2k9nX4nMUzCHk68pBq-Sh1SSy_QJI-TYYww3gyEwLHidsOsWySAp3FQM75Rc8dGZ_ufnlfuyp2uY92ciENkCg',
                  protected:
                    'eyJhbGciOiJFZERTQSIsImtpZCI6ImRpZDprZXk6ejZNa2pRWTZpV3Z6ekh4S1JIRlZFdzk3YldnV2Y2TUxOY0RVVkVGcXJaYlc5aWRQI3o2TWtqUVk2aVd2enpIeEtSSEZWRXc5N2JXZ1dmNk1MTmNEVVZFRnFyWmJXOWlkUCJ9',
                },
              ],
              link: 'bafyreiczoeto5r5ftvhzyo6uvkb3w7rnxtjpfd2i4daxhnxtkz2jrfqicy',
            },
            linkedBlock:
              'o2RkYXRhpWR0eXBlZm9iamVjdGV0aXRsZWlOb3Rlc0xpc3RnJHNjaGVtYXgnaHR0cDovL2pzb24tc2NoZW1hLm9yZy9kcmFmdC0wNy9zY2hlbWEjanByb3BlcnRpZXOhZW5vdGVzo2R0eXBlZWFycmF5ZWl0ZW1zo2R0eXBlZm9iamVjdGV0aXRsZWhOb3RlSXRlbWpwcm9wZXJ0aWVzomJpZKFkJHJlZngaIy9kZWZpbml0aW9ucy9DZXJhbWljRG9jSWRldGl0bGWjZHR5cGVmc3RyaW5nZXRpdGxlZXRpdGxlaW1heExlbmd0aBhkZXRpdGxlZW5vdGVza2RlZmluaXRpb25zoWxDZXJhbWljRG9jSWSjZHR5cGVmc3RyaW5nZ3BhdHRlcm54HF5jZXJhbWljOi8vLisoXD92ZXJzaW9uPS4rKT9pbWF4TGVuZ3RoGJZmaGVhZGVyo2ZzY2hlbWH3Z2NoYWluSWRuaW5tZW1vcnk6MTIzNDVrY29udHJvbGxlcnOBeDhkaWQ6a2V5Ono2TWtqUVk2aVd2enpIeEtSSEZWRXc5N2JXZ1dmNk1MTmNEVVZFRnFyWmJXOWlkUGZ1bmlxdWVwVVpZakFxSWZnZnNjOXRQRQ==',
          },
        ],
        k3y52l7qbv1frxj8ksxvnh2c2tg5zcc6kvochcs8xs62m29hcstk88x81efd7d8n4: [
          {
            jws: {
              payload: 'AXESIBWrlb7L60sa5uAiGdgLUy9iYRABzCDhRH8G17GOQHqY',
              signatures: [
                {
                  signature:
                    'tKDsomVARoMS7aqr0epVE1J_ATFTbjS4_BplK3kqIxFxBNKJKsxUF1C2R0WiK38MjnOk5y8aiP2yhpRu6iOoBA',
                  protected:
                    'eyJhbGciOiJFZERTQSIsImtpZCI6ImRpZDprZXk6ejZNa2pRWTZpV3Z6ekh4S1JIRlZFdzk3YldnV2Y2TUxOY0RVVkVGcXJaYlc5aWRQI3o2TWtqUVk2aVd2enpIeEtSSEZWRXc5N2JXZ1dmNk1MTmNEVVZFRnFyWmJXOWlkUCJ9',
                },
              ],
              link: 'bafyreiavvok35s7ljmnonybcdhmawuzpmjqraaomedqui7yg26yy4qd2ta',
            },
            linkedBlock:
              'o2RkYXRhpGR0eXBlZm9iamVjdGV0aXRsZWROb3RlZyRzY2hlbWF4J2h0dHA6Ly9qc29uLXNjaGVtYS5vcmcvZHJhZnQtMDcvc2NoZW1hI2pwcm9wZXJ0aWVzomRkYXRlpGR0eXBlZnN0cmluZ2V0aXRsZWRkYXRlZmZvcm1hdGlkYXRlLXRpbWVpbWF4TGVuZ3RoGB5kdGV4dKNkdHlwZWZzdHJpbmdldGl0bGVkdGV4dGltYXhMZW5ndGgZD6BmaGVhZGVyo2ZzY2hlbWH3Z2NoYWluSWRuaW5tZW1vcnk6MTIzNDVrY29udHJvbGxlcnOBeDhkaWQ6a2V5Ono2TWtqUVk2aVd2enpIeEtSSEZWRXc5N2JXZ1dmNk1MTmNEVVZFRnFyWmJXOWlkUGZ1bmlxdWVwTXhQenpMWW9yV2QxRWFMRA==',
          },
        ],
      },
    }

    await expect(publishEncodedSignedDocSet(ceramic, signedDocSet)).resolves.toBeUndefined()
  })

  test('creation flow', async () => {
    jest.setTimeout(10000)

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
    const [notesListSchemaVersionID] = await Promise.all([
      docset.addSchema(NotesListSchema),
      docset.addSchema(NoteSchema),
    ])
    expect(docset.schemas).toEqual(['NotesList', 'Note'])

    await docset.addDefinition(
      {
        name: 'notes',
        description: 'My notes',
        schema: notesListSchemaVersionID.toUrl(),
      },
      'myNotes'
    )
    expect(docset.definitions).toEqual(['myNotes'])

    await expect(docset.toSignedJSON()).resolves.toBeDefined()
  })
})
