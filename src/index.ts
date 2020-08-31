import { CeramicApi } from '@ceramicnetwork/ceramic-common'

import { isSchemaSecure } from './validate'

export * as allSchemas from './schemas'
export { isSchemaSecure } from './validate'

export interface SchemaItem {
  docId?: string
  name: string
  schema: Record<string, any>
}

export async function publishSchema(ceramic: CeramicApi, item: SchemaItem): Promise<string> {
  if (!isSchemaSecure(item.schema)) {
    throw new Error(`Schema ${item.name} is not secure`)
  }

  if (item.docId == null) {
    const doc = await ceramic.createDocument('tile', { content: item.schema })
    return doc.id
  }

  const doc = await ceramic.loadDocument(item.docId)
  await doc.change({ content: item.schema })
  return doc.id
}

export interface PublishConfig {
  ceramic: CeramicApi
  schemas: Array<SchemaItem>
}

export async function publishSchemas({
  ceramic,
  schemas,
}: PublishConfig): Promise<Record<string, string>> {
  const docIds = await Promise.all(
    schemas.map(async (item: SchemaItem) => await publishSchema(ceramic, item))
  )
  return schemas.reduce((acc, { name }, i) => {
    acc[name] = docIds[i]
    return acc
  }, {} as Record<string, string>)
}
