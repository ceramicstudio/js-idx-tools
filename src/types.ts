import type { DagJWSResult, JWSSignature } from 'dids'

import * as schemas from './schemas'

export type DocID = string

export interface Definition<T extends Record<string, unknown> = Record<string, unknown>> {
  name: string
  schema: DocID
  description?: string
  url?: string
  config?: T
}

export type Schema = Record<string, unknown>

export interface EncodedDagJWS {
  payload: string
  signatures: Array<JWSSignature>
  link: string
}

export interface EncodedDagJWSResult {
  jws: EncodedDagJWS
  linkedBlock: string // base64
}

type SignedRecord<K extends string> = Record<K, Array<DagJWSResult>>
type PublishedRecord<K extends string> = Record<K, DocID>

export type IDXDefinitionName = 'basicProfile' | 'cryptoAccountLinks' | 'threeIdKeychain'
export type IDXSignedDefinitions = SignedRecord<IDXDefinitionName>
export type IDXPublishedDefinitions = PublishedRecord<IDXDefinitionName>

export type IDXSchemaName = keyof typeof schemas
export type IDXSignedSchemas = SignedRecord<IDXSchemaName>
export type IDXPublishedSchemas = PublishedRecord<IDXSchemaName>

export interface IDXPublishedConfig {
  definitions: IDXPublishedDefinitions
  schemas: IDXPublishedSchemas
}

export interface PublishDoc<T = unknown> {
  id?: DocID
  content: T
  owners?: Array<string>
  schema?: DocID
}
export interface DefinitionDoc extends PublishDoc<Definition> {
  id: DocID
}
export interface SchemaDoc extends PublishDoc<Schema> {
  name: string
}
