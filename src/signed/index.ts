import { decodeDagJWSResult, decodeSignedMap } from '../encoding'

import encodedDefinitions from './definitions.json'
import encodedDID from './did.json'
import encodedSchemas from './schemas.json'

export const signedDefinitions = decodeSignedMap(encodedDefinitions)
export const signedDID = encodedDID.map(decodeDagJWSResult)
export const signedSchemas = decodeSignedMap(encodedSchemas)
