import type { DID } from 'dids'

import { signIDXDefinitions } from './signing'
import type { Definition, IDXPublishedSchemas, IDXSignedDefinitions } from './types'

export function createIDXDefinitions(schemas: IDXPublishedSchemas): Record<string, Definition> {
  return {
    idxBasicProfile: {
      name: 'Basic Profile',
      schema: schemas.BasicProfile,
    },
  }
}

export async function createIDXSignedDefinitions(
  did: DID,
  schemas: IDXPublishedSchemas
): Promise<IDXSignedDefinitions> {
  const definitions = createIDXDefinitions(schemas)
  return await signIDXDefinitions(did, schemas.Definition, definitions)
}
