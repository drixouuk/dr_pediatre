import { getPayload } from 'payload'
import config from '../payload.config'
import { seedDemo } from './seed-demo'

async function run() {
  const payload = await getPayload({ config })
  await seedDemo(payload)
  process.exit(0)
}

run()
