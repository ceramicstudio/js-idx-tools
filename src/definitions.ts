import type { DID } from 'dids'

import { signIDXDefinitions } from './signing'
import type {
  Definition,
  IDXDefinitionName,
  IDXPublishedSchemas,
  IDXSignedDefinitions,
} from './types'

export function createIDXDefinitions(
  schemas: IDXPublishedSchemas
): Record<IDXDefinitionName, Definition> {
  return {
    basicProfile: {
      name: 'Basic Profile',
      schema: schemas.BasicProfile,
    },
    cryptoAccountLinks: {
      name: 'Crypto Account Links',
      schema: schemas.CryptoAccountLinks,
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
