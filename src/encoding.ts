import CID from 'cids'
import type { DagJWS, DagJWSResult } from 'dids'

import type { EncodedDagJWS, EncodedDagJWSResult } from './types'
import { applyMap } from './utils'

export function decodeDagJWS({ payload, signatures, link }: EncodedDagJWS): DagJWS {
  return { payload, signatures, link: new CID(link) }
}

export function encodeDagJWS({ payload, signatures, link }: DagJWS): EncodedDagJWS {
  // eslint-disable-next-line
  return { payload, signatures, link: link.toString() }
}

export function decodeDagJWSResult({ jws, linkedBlock }: EncodedDagJWSResult): DagJWSResult {
  // eslint-disable-next-line
  return { jws: decodeDagJWS(jws), linkedBlock: Buffer.from(linkedBlock, 'base64') }
}

export function encodeDagJWSResult({ jws, linkedBlock }: DagJWSResult): EncodedDagJWSResult {
  return { jws: encodeDagJWS(jws), linkedBlock: Buffer.from(linkedBlock).toString('base64') }
}

export function decodeSignedMap<K extends string>(
  data: Record<K, EncodedDagJWSResult>
): Record<K, DagJWSResult> {
  return applyMap(data, decodeDagJWSResult)
}

export function encodeSignedMap<K extends string>(
  data: Record<K, DagJWSResult>
): Record<K, EncodedDagJWSResult> {
  return applyMap(data, encodeDagJWSResult)
}
