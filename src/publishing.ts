import type { CeramicApi, DocMetadata, DocOpts, Doctype } from '@ceramicnetwork/common'
import { schemas as publishedSchemas } from '@ceramicstudio/idx-constants'
import type {
  IDXDefinitionName,
  IDXPublishedDefinitions,
  IDXPublishedSchemas,
  IDXSchemaName,
} from '@ceramicstudio/idx-constants'
import type { DagJWSResult } from 'dids'
import isEqual from 'fast-deep-equal'

import { signedDefinitions, signedSchemas } from './signed'
import type {
  Definition,
  DefinitionDoc,
  IDXPublishedConfig,
  IDXSignedDefinitions,
  IDXSignedSchemas,
  PublishDoc,
  SchemaDoc,
} from './types'
import { promiseMap, docIDToString } from './utils'
import { isValidDefinition, isSecureSchema } from './validate'

const PUBLISH_OPTS: DocOpts = { anchor: false, publish: false }

export async function createTile<T = unknown>(
  ceramic: CeramicApi,
  content: T,
  metadata: Partial<DocMetadata> = {}
): Promise<Doctype> {
  if (ceramic.did == null) {
    throw new Error('Ceramic instance is not authenticated')
  }

  if (metadata.controllers == null || metadata.controllers.length === 0) {
    metadata.controllers = [ceramic.did.id]
  }

  const doc = await ceramic.createDocument('tile', { content, metadata: metadata as DocMetadata })
  await ceramic.pin.add(doc.id)
  return doc
}

export async function publishDoc<T = unknown>(
  ceramic: CeramicApi,
  doc: PublishDoc<T>
): Promise<Doctype> {
  if (doc.id == null) {
    return await createTile(ceramic, doc.content, {
      controllers: doc.controllers,
      schema: doc.schema ? docIDToString(doc.schema) : undefined,
    })
  }

  const loaded = await ceramic.loadDocument(doc.id)
  if (!isEqual(loaded.content, doc.content)) {
    await loaded.change({ content: doc.content })
  }
  return loaded
}

export async function createDefinition(
  ceramic: CeramicApi,
  definition: Definition
): Promise<Doctype> {
  if (!isValidDefinition(definition)) {
    throw new Error('Invalid definition')
  }
  return await createTile(ceramic, definition, { schema: publishedSchemas.Definition })
}

export async function updateDefinition(ceramic: CeramicApi, doc: DefinitionDoc): Promise<boolean> {
  const loaded = await ceramic.loadDocument(doc.id)
  if (loaded.metadata.schema !== publishedSchemas.Definition) {
    throw new Error('Document is not a valid Definition')
  }

  if (!isEqual(loaded.content, doc.content)) {
    await loaded.change({ content: doc.content })
    return true
  }
  return false
}

export async function publishRecords(
  ceramic: CeramicApi,
  [genesis, ...updates]: Array<DagJWSResult>
): Promise<Doctype> {
  const doc = await ceramic.createDocumentFromGenesis('tile', genesis, PUBLISH_OPTS)
  await ceramic.pin.add(doc.id)
  for (const record of updates) {
    await ceramic.applyRecord(doc.id, record, PUBLISH_OPTS)
  }
  return doc
}

export async function publishSchema(ceramic: CeramicApi, doc: SchemaDoc): Promise<Doctype> {
  if (!isSecureSchema(doc.content)) {
    throw new Error(`Schema ${doc.name} is not secure`)
  }
  return await publishDoc(ceramic, doc)
}

export async function publishSignedMap<T extends string = string>(
  ceramic: CeramicApi,
  signed: Record<T, Array<DagJWSResult>>
): Promise<Record<T, Doctype>> {
  return await promiseMap(signed, async (records) => await publishRecords(ceramic, records))
}

export async function publishIDXSignedDefinitions(
  ceramic: CeramicApi,
  definitions: IDXSignedDefinitions = signedDefinitions
): Promise<IDXPublishedDefinitions> {
  const signedMap = await publishSignedMap(ceramic, definitions)
  return Object.entries(signedMap).reduce((acc, [key, doc]) => {
    acc[key as IDXDefinitionName] = doc.id.toString()
    return acc
  }, {} as IDXPublishedDefinitions)
}

export async function publishIDXSignedSchemas(
  ceramic: CeramicApi,
  schemas: IDXSignedSchemas = signedSchemas
): Promise<IDXPublishedSchemas> {
  const signedMap = await publishSignedMap(ceramic, schemas)
  return Object.entries(signedMap).reduce((acc, [key, doc]) => {
    acc[key as IDXSchemaName] = doc.versionId.toUrl()
    return acc
  }, {} as IDXPublishedSchemas)
}

export async function publishIDXConfig(ceramic: CeramicApi): Promise<IDXPublishedConfig> {
  const [definitions, schemas] = await Promise.all([
    publishIDXSignedDefinitions(ceramic),
    publishIDXSignedSchemas(ceramic),
  ])
  return { definitions, schemas }
}
