import type { CeramicApi, DocMetadata } from '@ceramicnetwork/ceramic-common'
import type { DagJWSResult } from 'dids'
import isEqual from 'fast-deep-equal'

import { signedDefinitions, signedSchemas } from './signed'
import type {
  DefinitionDoc,
  DocID,
  IDXPublishedConfig,
  IDXPublishedDefinitions,
  IDXPublishedSchemas,
  IDXSignedDefinitions,
  IDXSignedSchemas,
  PublishDoc,
  SchemaDoc,
} from './types'
import { promiseMap } from './utils'
import { validateSchema } from './validate'

export async function createTile<T = unknown>(
  ceramic: CeramicApi,
  content: T,
  metadata: Partial<DocMetadata> = {}
): Promise<DocID> {
  if (ceramic.did == null) {
    throw new Error('Ceramic instance is not authenticated')
  }

  if (metadata.owners == null || metadata.owners.length === 0) {
    metadata.owners = [ceramic.did.id]
  }

  const doc = await ceramic.createDocument('tile', { content, metadata: metadata as DocMetadata })
  await ceramic.pin.add(doc.id)
  return doc.id
}

export async function publishDoc<T = unknown>(
  ceramic: CeramicApi,
  doc: PublishDoc<T>
): Promise<DocID> {
  if (doc.id == null) {
    return await createTile(ceramic, doc.content, { owners: doc.owners, schema: doc.schema })
  }

  const loaded = await ceramic.loadDocument(doc.id)
  if (!isEqual(loaded.content, doc.content)) {
    await loaded.change({ content: doc.content })
  }
  return doc.id
}

export async function publishGenesis(ceramic: CeramicApi, genesis: DagJWSResult): Promise<DocID> {
  const doc = await ceramic.createDocumentFromGenesis(genesis)
  await ceramic.pin.add(doc.id)
  return doc.id
}

export async function publishDefinition(ceramic: CeramicApi, doc: DefinitionDoc): Promise<DocID> {
  return await publishDoc(ceramic, doc)
}

export async function publishSchema(ceramic: CeramicApi, doc: SchemaDoc): Promise<string> {
  if (!validateSchema(doc.content)) {
    throw new Error(`Schema ${doc.name} is invalid or not secure`)
  }
  return await publishDoc(ceramic, doc)
}

export async function publishSignedMap<T extends string = string>(
  ceramic: CeramicApi,
  signed: Record<T, DagJWSResult>
): Promise<Record<T, DocID>> {
  return await promiseMap(signed, async (genesis) => await publishGenesis(ceramic, genesis))
}

export async function publishIDXSignedDefinitions(
  ceramic: CeramicApi,
  definitions: IDXSignedDefinitions = signedDefinitions
): Promise<IDXPublishedDefinitions> {
  return await publishSignedMap(ceramic, definitions)
}

export async function publishIDXSignedSchemas(
  ceramic: CeramicApi,
  schemas: IDXSignedSchemas = signedSchemas
): Promise<IDXPublishedSchemas> {
  return await publishSignedMap(ceramic, schemas)
}

export async function publishIDXConfig(ceramic: CeramicApi): Promise<IDXPublishedConfig> {
  const [definitions, schemas] = await Promise.all([
    publishIDXSignedDefinitions(ceramic),
    publishIDXSignedSchemas(ceramic),
  ])
  return { definitions, schemas }
}
