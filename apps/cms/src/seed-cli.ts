import { getPayload } from 'payload'
import config from '../payload.config'
import { seed } from './seed'

async function run() {
  const payload = await getPayload({ config })
  await seed(payload)
  console.log('🎉 Seed CLI complete')
  process.exit(0)
}

run().catch((err) => {
  console.error('❌ Seed CLI failed:', err)
  process.exit(1)
})
