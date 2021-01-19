import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import SecureSchema from 'ajv/lib/refs/json-schema-secure.json'

import { Definition } from './schemas'
import type { Schema } from './types'

const ajv = new Ajv({ strict: false })
addFormats(ajv)

export const validateDefinition = ajv.compile(Definition)

export function isValidDefinition(definition: unknown): boolean {
  return validateDefinition(definition) as boolean
}

export const validateSchemaSecure = ajv.compile(SecureSchema)

export function isSecureSchema(schema: Schema): boolean {
  ajv.compile(schema)
  return validateSchemaSecure(schema) as boolean
}
