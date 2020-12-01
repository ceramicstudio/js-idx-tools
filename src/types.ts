import type DocID from '@ceramicnetwork/docid'
import type {
  IDXDefinitionName,
  IDXSchemaName,
  IDXPublishedDefinitions,
  IDXPublishedSchemas,
} from '@ceramicstudio/idx-constants'
import type { DagJWSResult, JWSSignature } from 'dids'
export interface Definition<T extends Record<string, any> = Record<string, any>> {
  name: string
  schema: string
  description: string
  url?: string
  config?: T
}

export type Schema = Record<string, any>

export interface EncodedDagJWS {
  payload: string
  signatures: Array<JWSSignature>
  link?: string
}

export interface EncodedDagJWSResult {
  jws: EncodedDagJWS
  linkedBlock: string // base64
}

type SignedRecord<K extends string> = Record<K, Array<DagJWSResult>>
export type IDXSignedDefinitions = SignedRecord<IDXDefinitionName>
export type IDXSignedSchemas = SignedRecord<IDXSchemaName>

export interface IDXPublishedConfig {
  definitions: IDXPublishedDefinitions
  schemas: IDXPublishedSchemas
}

export interface PublishDoc<T = unknown> {
  id?: DocID | string
  content: T
  controllers?: Array<string>
  schema?: DocID | string
}
export interface DefinitionDoc extends PublishDoc<Definition> {
  id: DocID | string
}
export interface SchemaDoc extends PublishDoc<Schema> {
  name: string
}
