import type DocID from '@ceramicnetwork/docid'
import type { DagJWSResult, DID } from 'dids'

import * as schemas from './schemas'
import type { Definition, IDXSignedSchemas, Schema } from './types'
import { docIDToString, promiseMap } from './utils'

const DEFAULT_CHAIN_ID = 'inmemory:12345' // 'eip155:3'

export type SignOptions = {
  chainId?: string
  schema?: DocID | string
}

export async function signTile<T = unknown>(
  did: DID,
  data: T,
  options: SignOptions = {}
): Promise<DagJWSResult> {
  if (!did.authenticated) {
    throw new Error('DID must be authenticated')
  }

  const header = {
    chainId: options.chainId ?? DEFAULT_CHAIN_ID,
    controllers: [did.id],
    schema: options.schema ? docIDToString(options.schema) : undefined,
  }
  return await did.createDagJWS({ data, doctype: 'tile', header }, { did: did.id })
}

export async function signIDXDefinitions(
  did: DID,
  definitionSchema: DocID | string,
  definitions: Record<string, Definition>,
  chainId?: string
): Promise<Record<string, Array<DagJWSResult>>> {
  const schema = docIDToString(definitionSchema)
  return await promiseMap(definitions, async (definition: Definition) => {
    return [await signTile(did, definition, { chainId, schema })]
  })
}

export async function signIDXSchemas(did: DID, chainId?: string): Promise<IDXSignedSchemas> {
  return await promiseMap(schemas, async (schema: Schema) => {
    return [await signTile(did, schema, { chainId })]
  })
}
