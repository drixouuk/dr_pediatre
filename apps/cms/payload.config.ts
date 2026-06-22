import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { Users } from './src/collections/Users'
import { Doctors } from './src/collections/Doctors'
import { Services } from './src/collections/Services'
import { Media } from './src/collections/Media'
import { PracticeInfo } from './src/globals/PracticeInfo'

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET ?? 'dev-secret-change-in-production',
  admin: {
    user: 'users',
  },
  collections: [Users, Doctors, Services, Media],
  globals: [PracticeInfo],
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI ?? 'file:./drpediatre.db',
    },
  }),
  localization: {
    locales: ['fr', 'en', 'ar', 'tzm'],
    defaultLocale: 'fr',
    fallback: true,
  },
  editor: lexicalEditor({}),
})
