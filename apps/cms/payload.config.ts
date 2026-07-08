import { s3Storage } from '@payloadcms/storage-s3'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { Tenants } from './src/collections/Tenants'
import { Users } from './src/collections/Users'
import { Patients } from './src/collections/Patients'
import { AuditLogs } from './src/collections/AuditLogs'
import { QueueItems } from './src/collections/QueueItems'
import { Doctors } from './src/collections/Doctors'
import { Services } from './src/collections/Services'
import { Reviews } from './src/collections/Reviews'
import { Media } from './src/collections/Media'
import { PracticeInfo } from './src/globals/PracticeInfo'
import { seed } from './src/seed'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET ?? 'dev-secret-change-in-production',
  admin: {
    user: Users.slug,
  },
  collections: [
    Tenants,
    Users,
    Patients,
    AuditLogs,
    QueueItems,
    Doctors,
    Services,
    Reviews,
    Media,
  ],
  globals: [PracticeInfo],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
  plugins: [
    s3Storage({
      collections: {
        media: true,
      },
      bucket: process.env.R2_BUCKET || '',
      config: {
        endpoint: process.env.R2_ENDPOINT || '',
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
        },
        region: 'garage',
        forcePathStyle: true,
      },
    }),
  ],
  localization: {
    locales: ['fr', 'en', 'ar', 'tzm'],
    defaultLocale: 'fr',
    fallback: true,
  },
  editor: lexicalEditor({}),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  onInit: async (payload) => {
    if (process.env.PAYLOAD_SEED === 'true') {
      await seed(payload)
    }
  },
})
