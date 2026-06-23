import { getPayload } from 'payload'
import config from '../payload.config'

let _payload: Awaited<ReturnType<typeof getPayload>> | null = null

export async function getPayloadInstance() {
  if (!_payload) {
    _payload = await getPayload({ config })
  }
  return _payload
}
