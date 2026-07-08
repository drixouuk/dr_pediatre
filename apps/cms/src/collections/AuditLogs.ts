import type { CollectionConfig } from 'payload'

export const AuditLogs: CollectionConfig = {
  slug: 'audit-logs',
  admin: {
    useAsTitle: 'action',
    description: 'Registre immuable des accès aux données de santé',
  },
  access: {
    create: (): boolean => false,
    update: (): boolean => false,
    delete: (): boolean => false,
    read: ({ req: { user } }): boolean =>
      !!(
        (user?.roles as string[])?.includes('superadmin') ||
        (user?.roles as string[])?.includes('tenant_admin')
      ),
  },
  fields: [
    {
      name: 'action',
      type: 'select',
      options: ['read', 'write', 'export'],
    },
    { name: 'collectionName', type: 'text' },
    { name: 'documentId', type: 'text' },
    { name: 'user', type: 'relationship', relationTo: 'users' },
    { name: 'tenant', type: 'relationship', relationTo: 'tenants' },
    { name: 'timestamp', type: 'date' },
  ],
}
