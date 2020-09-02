import { CeramicApi } from '@ceramicnetwork/ceramic-common'

import * as schemas from './schemas'
import { isSchemaSecure, validateSchema } from './validate'

export { schemas, isSchemaSecure, validateSchema }

export interface SchemaItem {
  docId?: string
  name: string
  schema: Record<string, unknown>
}

export const schemasList: Array<SchemaItem> = Object.entries(schemas).map(([name, schema]) => ({
  name,
  schema,
}))

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
  schemas: list,
}: PublishConfig): Promise<Record<string, string>> {
  const docIds = await Promise.all(
    list.map(async (item: SchemaItem) => await publishSchema(ceramic, item))
  )
  return list.reduce((acc, { name }, i) => {
    acc[name] = docIds[i]
    return acc
  }, {} as Record<string, string>)
}
