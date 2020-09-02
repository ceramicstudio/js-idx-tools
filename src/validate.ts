import Ajv from 'ajv'
import secureSchema from 'ajv/lib/refs/json-schema-secure.json'

const ajv = new Ajv()

export const isSchemaSecure = ajv.compile(secureSchema)

export function validateSchema(schema: Record<string, unknown>): boolean {
  ajv.compile(schema)
  return isSchemaSecure(schema) as boolean
}
