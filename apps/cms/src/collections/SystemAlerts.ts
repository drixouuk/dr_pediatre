import type { CollectionConfig } from 'payload'

export const SystemAlerts: CollectionConfig = {
  slug: 'system-alerts',
  admin: {
    useAsTitle: 'message',
    defaultColumns: ['level', 'message', 'timestamp'],
    group: 'Système',
  },
  access: {
    read: ({ req: { user } }: any) => !!(user?.roles as string[])?.includes('superadmin'),
    create: ({ req: { user } }: any) => !!(user?.roles as string[])?.includes('superadmin'),
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: 'level',
      type: 'select',
      required: true,
      options: ['error', 'critical'],
      defaultValue: 'error',
    },
    {
      name: 'message',
      type: 'text',
      required: true,
    },
    {
      name: 'context',
      type: 'json',
    },
    {
      name: 'timestamp',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
    },
  ],
}
