import type { CollectionConfig } from 'payload'

function tenantId(user: any): string | undefined {
  if (!user?.tenant) return undefined
  return typeof user.tenant === 'object' ? user.tenant.id : user.tenant
}

export const Templates: CollectionConfig = {
  slug: 'templates',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'tenant'],
    group: 'Cabinet',
  },
  access: {
    read: ({ req: { user } }: any) => {
      if (user?.roles?.includes('superadmin')) return true
      const id = tenantId(user)
      if (!id) return false
      return { tenant: { equals: id } }
    },
    create: ({ req: { user } }: any): boolean => {
      const roles: string[] = user?.roles ?? []
      return roles.includes('superadmin') || roles.includes('tenant_admin') || roles.includes('doctor')
    },
    update: ({ req: { user } }: any) => {
      const id = tenantId(user)
      if (!id) return false
      return { tenant: { equals: id } }
    },
    delete: ({ req: { user } }: any) => {
      const id = tenantId(user)
      if (!id) return false
      return { tenant: { equals: id } }
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
    { name: 'name', type: 'text', required: true, label: 'Nom du modèle' },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Consultation', value: 'consultation' },
        { label: 'Ordonnance', value: 'prescription' },
      ],
      label: 'Type',
    },
    { name: 'motif', type: 'text', label: 'Motif (consultation)' },
    { name: 'examenClinique', type: 'textarea', label: 'Examen clinique (consultation)' },
    { name: 'diagnostic', type: 'textarea', label: 'Diagnostic (consultation)' },
    { name: 'codeActe', type: 'text', label: 'Code acte (consultation)' },
    { name: 'medications', type: 'json', label: 'Médicaments (ordonnance)', admin: { description: 'Array de { nom, dci, posologie, duree }' } },
    { name: 'notes', type: 'textarea', label: 'Notes (ordonnance)' },
  ],
}
