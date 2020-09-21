import Ajv from 'ajv'
import secureSchema from 'ajv/lib/refs/json-schema-secure.json'

import type { Schema } from './types'

const ajv = new Ajv()

export const isSchemaSecure = ajv.compile(secureSchema)

export function validateSchema(schema: Schema): boolean {
  ajv.compile(schema)
  return isSchemaSecure(schema) as boolean
}
