import { getPayload } from 'payload'
import config from '../payload.config.js'

async function createAdmin() {
  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: 'admin@dr-tabibi.ma' } },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    console.log('→ Admin already exists')
    process.exit(0)
  }

  await payload.create({
    collection: 'users',
    data: {
      email: 'admin@dr-tabibi.ma',
      password: process.env.ADMIN_PASSWORD ?? (() => { throw new Error('ADMIN_PASSWORD manquant — définis cette variable d\'environnement avant de lancer le script.') })(),
      name: 'Admin',
      roles: ['superadmin'],
    },
  })

  console.log('✅ Admin user created')
  process.exit(0)
}

createAdmin().catch((err) => {
  console.error('❌ Failed:', err)
  process.exit(1)
})
