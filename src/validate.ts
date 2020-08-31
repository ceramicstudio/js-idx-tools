import Ajv from 'ajv'
import secureSchema from 'ajv/lib/refs/json-schema-secure.json'

const ajv = new Ajv()

export const isSchemaSecure = ajv.compile(secureSchema)
