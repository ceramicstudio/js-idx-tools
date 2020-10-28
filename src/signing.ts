import type DocID from '@ceramicnetwork/docid'
import type { DagJWSResult, DID } from 'dids'

import * as schemas from './schemas'
import type { Definition, IDXSignedSchemas, Schema } from './types'
import { docIDToString, promiseMap } from './utils'

export async function signTile<T = unknown>(
  did: DID,
  data: T,
  schema?: DocID | string
): Promise<DagJWSResult> {
  if (!did.authenticated) {
    throw new Error('DID must be authenticated')
  }
  return await did.createDagJWS(
    {
      doctype: 'tile',
      data,
      header: { controllers: [did.id], schema: schema ? docIDToString(schema) : undefined },
    },
    { did: did.id }
  )
}

export async function signIDXDefinitions(
  did: DID,
  definitionSchema: DocID | string,
  definitions: Record<string, Definition>
): Promise<Record<string, Array<DagJWSResult>>> {
  const schema = docIDToString(definitionSchema)
  return await promiseMap(definitions, async (definition: Definition) => {
    return [await signTile(did, definition, schema)]
  })
}

export async function signIDXSchemas(did: DID): Promise<IDXSignedSchemas> {
  return await promiseMap(schemas, async (schema: Schema) => {
    return [await signTile(did, schema)]
  })
}
