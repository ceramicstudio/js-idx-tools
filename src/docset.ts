import type { CeramicApi, DocMetadata, Doctype } from '@ceramicnetwork/common'
import type DocID from '@ceramicnetwork/docid'
import type { DagJWSResult } from 'dids'

import { decodeSignedMap, encodeSignedMap } from './encoding'
import { createDefinition, createTile, publishRecords, publishSchema } from './publishing'
import type { Definition, EncodedDagJWSResult, Schema } from './types'
import { docIDToString } from './utils'

export type CreatedDoc = {
  id: DocID
  dependencies: Array<DocID>
}

export type PublishedDocSet = {
  definitions: Record<string, string>
  schemas: Record<string, string>
  tiles: Record<string, string>
}

export type DocSetData<T> = {
  docs: Record<string, T>
  definitions: Array<string>
  schemas: Array<string>
}
export type SignedDocSet = DocSetData<Array<DagJWSResult>>
export type EncodedSignedDocSet = DocSetData<Array<EncodedDagJWSResult>>

export class DocSet {
  _ceramic: CeramicApi
  _docs: Record<string, Promise<Doctype>> = {}
  _definitions: Record<string, Promise<CreatedDoc>> = {}
  _schemas: Record<string, Promise<CreatedDoc>> = {}
  _schemaAliases: Record<string, string> = {}
  _tiles: Record<string, Promise<CreatedDoc>> = {}

  constructor(ceramic: CeramicApi) {
    if (ceramic.did == null) {
      throw new Error('Ceramic instance must be authenticated')
    }
    this._ceramic = ceramic
  }

  async _loadDoc(docID: DocID | string): Promise<Doctype> {
    const id = docIDToString(docID)
    if (this._docs[id] == null) {
      this._docs[id] = this._ceramic.loadDocument(id)
    }
    return await this._docs[id]
  }

  get definitions(): Array<string> {
    return Object.keys(this._definitions)
  }

  get schemas(): Array<string> {
    return Object.keys(this._schemas)
  }

  get tiles(): Array<string> {
    return Object.keys(this._tiles)
  }

  hasSchema(alias: string): boolean {
    return this._schemas[alias] != null
  }

  deleteSchema(alias: string): boolean {
    if (this.hasSchema(alias)) {
      delete this._schemas[alias]
      return true
    }
    return false
  }

  createSchema(
    name: string,
    schema: Schema,
    deps: Array<Promise<DocID>> = []
  ): Promise<CreatedDoc> {
    if (this.hasSchema(name)) {
      throw new Error(`Schema ${name} already exists`)
    }

    this._schemas[name] = Promise.all(deps).then((dependencies) => {
      return publishSchema(this._ceramic, { name, content: schema }).then(
        (doc) => {
          this._schemaAliases[doc.versionId.toUrl()] = name
          return { id: doc.versionId, dependencies }
        },
        (reason: any) => {
          delete this._schemas[name]
          throw reason
        }
      )
    })
    return this._schemas[name]
  }

  async addSchema(schema: Schema, alias?: string): Promise<DocID> {
    const name = alias ?? (schema.title as string | undefined)
    if (name == null) {
      throw new Error('Schema must have a title property or an alias must be provided')
    }

    // TODO: lookup CeramicSchemaRef in the schema definitions
    // If set, add schemas as dependencies

    const created = await this.createSchema(name, schema)
    return created.id
  }

  hasDefinition(alias: string): boolean {
    return this._definitions[alias] != null
  }

  deleteDefinition(alias: string): boolean {
    if (this.hasDefinition(alias)) {
      delete this._definitions[alias]
      return true
    }
    return false
  }

  createDefinition(
    alias: string,
    definition: Definition,
    deps: Array<Promise<DocID>> = []
  ): Promise<CreatedDoc> {
    if (this.hasDefinition(alias)) {
      throw new Error(`Definition ${alias} already exists`)
    }

    this._definitions[alias] = Promise.all(deps).then((dependencies) => {
      return createDefinition(this._ceramic, definition).then(
        (doc) => ({ id: doc.id, dependencies }),
        (reason: any) => {
          delete this._definitions[alias]
          throw reason
        }
      )
    })
    return this._definitions[alias]
  }

  async addDefinition(definition: Definition, alias = definition.name): Promise<DocID> {
    const schemaAlias = this._schemaAliases[definition.schema]
    if (schemaAlias == null) {
      throw new Error('Schema for this definition has not been added')
    }
    const createdSchema = this._schemas[schemaAlias]
    if (createdSchema == null) {
      throw new Error('Schema alias for this definition could not be found')
    }

    const created = await this.createDefinition(alias, definition, [
      createdSchema.then(({ id }) => id),
    ])
    return created.id
  }

  hasTile(alias: string): boolean {
    return this._tiles[alias] != null
  }

  deleteTile(alias: string): boolean {
    if (this.hasTile(alias)) {
      delete this._tiles[alias]
      return true
    }
    return false
  }

  createTile<T extends Record<string, unknown>>(
    alias: string,
    contents: T,
    meta: Partial<DocMetadata> = {},
    deps: Array<Promise<DocID>> = []
  ): Promise<CreatedDoc> {
    if (this.hasTile(alias)) {
      throw new Error(`Tile ${alias} already exists`)
    }

    this._tiles[alias] = Promise.all(deps).then((dependencies) => {
      return createTile(this._ceramic, contents, meta).then(
        (doc) => ({ id: doc.id, dependencies }),
        (reason: any) => {
          delete this._tiles[alias]
          throw reason
        }
      )
    })
    return this._tiles[alias]
  }

  async addTile<T extends Record<string, unknown>>(
    alias: string,
    contents: T,
    meta: Partial<DocMetadata> = {}
  ): Promise<DocID> {
    const deps =
      meta.schema == null ? [] : [this._loadDoc(meta.schema).then((doc) => doc.versionId)]
    const created = await this.createTile(alias, contents, meta, deps)
    return created.id
  }

  async toPublished(): Promise<PublishedDocSet> {
    const definitions: Record<string, string> = {}
    const schemas: Record<string, string> = {}
    const tiles: Record<string, string> = {}

    const handleDefinitions = Object.entries(this._definitions).map(async ([alias, created]) => {
      const { id } = await created
      definitions[alias] = id.toString()
    })
    const handleSchemas = Object.entries(this._schemas).map(async ([alias, created]) => {
      const { id } = await created
      schemas[alias] = id.toUrl()
    })
    const handleTiles = Object.entries(this._tiles).map(async ([alias, created]) => {
      const { id } = await created
      tiles[alias] = id.toString()
    })
    await Promise.all([...handleDefinitions, ...handleSchemas, ...handleTiles])

    return { definitions, schemas, tiles }
  }

  async toSigned(): Promise<SignedDocSet> {
    const deps = new Set<string>()
    const docs: Record<string, Array<DagJWSResult>> = {}
    const definitions: Array<string> = []
    const schemas: Array<string> = []

    const addDoc = async (created: Promise<CreatedDoc>) => {
      const { id, dependencies } = await created
      dependencies.forEach((depid) => {
        deps.add(depid.toString())
      })
      const records = await this._ceramic.loadDocumentRecords(id)
      docs[id.toString()] = records.map((r) => r.value as DagJWSResult)
    }

    const handleDefinitions = Object.entries(this._definitions).map(async ([alias, created]) => {
      definitions.push(alias)
      return await addDoc(created)
    })
    const handleSchemas = Object.entries(this._schemas).map(async ([alias, created]) => {
      schemas.push(alias)
      await addDoc(created)
    })
    const handleTiles = Object.values(this._tiles).map(addDoc)
    await Promise.all([...handleDefinitions, ...handleSchemas, ...handleTiles])

    deps.forEach((id) => {
      if (docs[id] == null) {
        throw new Error(`Missing dependency: ${id}`)
      }
    })

    return { docs, definitions, schemas }
  }

  async toSignedJSON(): Promise<EncodedSignedDocSet> {
    const { docs, ...signed } = await this.toSigned()
    return { ...signed, docs: encodeSignedMap(docs) }
  }
}

export async function publishSignedDocSet(
  ceramic: CeramicApi,
  docSet: SignedDocSet
): Promise<void> {
  const schemas: Array<Promise<Doctype>> = []
  const others: Array<Promise<Doctype>> = []

  Object.entries(docSet.docs).forEach(([id, records]) => {
    const publish = publishRecords(ceramic, records)
    if (docSet.schemas.includes(id)) {
      schemas.push(publish)
    } else {
      others.push(publish)
    }
  })

  await Promise.all(schemas)
  await Promise.all(others)
}

export async function publishEncodedSignedDocSet(
  ceramic: CeramicApi,
  { docs, ...docSet }: EncodedSignedDocSet
): Promise<void> {
  return await publishSignedDocSet(ceramic, { ...docSet, docs: decodeSignedMap(docs) })
}
