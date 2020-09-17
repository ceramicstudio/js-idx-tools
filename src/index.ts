import { decodeSignedMap } from './encoding'
import * as schemas from './schemas'
import encodedDefinitions from './signed/definitions.json'
import encodedSchemas from './signed/schemas.json'

export { schemas }
export const signedDefinitions = decodeSignedMap(encodedDefinitions)
export const signedSchemas = decodeSignedMap(encodedSchemas)

export * from './definitions'
export * from './encoding'
export * from './publishing'
export * from './signing'
export * from './types'
export * from './utils'
export * from './validate'
