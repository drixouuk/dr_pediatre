import type { CollectionConfig } from 'payload'

export const ReferringPractitioners: CollectionConfig = {
  slug: 'referring-practitioners',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'specialty', 'city', 'tenant'],
    group: 'Cabinet',
  },
  access: {
    read: ({ req: { user } }: any) => {
      if (user?.roles?.includes('superadmin')) return true
      const tid = typeof user?.tenant === 'object' ? user.tenant.id : user?.tenant
      if (!tid) return false
      return { tenant: { equals: tid } }
    },
    create: ({ req: { user } }: any): boolean => {
      const roles = user?.roles ?? []
      return roles.includes('superadmin') || roles.includes('tenant_admin') || roles.includes('doctor')
    },
    update: ({ req: { user } }: any) => {
      const tid = typeof user?.tenant === 'object' ? user.tenant.id : user?.tenant
      if (!tid) return false
      return { tenant: { equals: tid } }
    },
    delete: ({ req: { user } }: any) => {
      const tid = typeof user?.tenant === 'object' ? user.tenant.id : user?.tenant
      if (!tid) return false
      return { tenant: { equals: tid } }
    },
  },
  hooks: {
    beforeChange: [
      ({ req, data, operation }: any) => {
        if (operation === 'create' && req.user?.tenant) {
          data.tenant = typeof req.user.tenant === 'object' ? req.user.tenant.id : req.user.tenant
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'tenant', type: 'relationship', relationTo: 'tenants', required: true, admin: { readOnly: true } },
    { name: 'name', type: 'text', required: true, label: 'Nom du praticien' },
    { name: 'specialty', type: 'text', label: 'Spécialité' },
    { name: 'phone', type: 'text', label: 'Téléphone' },
    { name: 'city', type: 'text', label: 'Ville' },
    { name: 'notes', type: 'textarea', label: 'Notes' },
  ],
}
