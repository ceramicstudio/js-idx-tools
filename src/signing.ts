import type { DagJWSResult, DID } from 'dids'

import * as schemas from './schemas'
import type { Definition, DocID, IDXSignedSchemas, Schema } from './types'
import { promiseMap } from './utils'

export async function signTile<T = unknown>(
  did: DID,
  data: T,
  schema?: DocID
): Promise<DagJWSResult> {
  if (!did.authenticated) {
    throw new Error('DID must be authenticated')
  }
  return await did.createDagJWS(
    { doctype: 'tile', data, header: { owners: [did.id], schema } },
    { did: did.id }
  )
}

export async function signIDXDefinitions(
  did: DID,
  definitionSchema: DocID,
  definitions: Record<string, Definition>
): Promise<Record<string, Array<DagJWSResult>>> {
  return await promiseMap(definitions, async (definition: Definition) => {
    return [await signTile(did, definition, definitionSchema)]
  })
}

export async function signIDXSchemas(did: DID): Promise<IDXSignedSchemas> {
  return await promiseMap(schemas, async (schema: Schema) => {
    return [await signTile(did, schema)]
  })
}
