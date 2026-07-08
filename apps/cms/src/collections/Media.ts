import type { CollectionConfig, Field, Access } from 'payload'

export const tenantAccess: Access = ({ req: { user } }) => {
  if (user?.roles?.includes('superadmin')) return true
  if (!user?.tenant) return false
  return {
    tenant: {
      equals: typeof user.tenant === 'object' ? user.tenant.id : user.tenant,
    },
  }
}

export const tenantField: Field = {
  name: 'tenant',
  type: 'relationship',
  relationTo: 'tenants',
  required: true,
  admin: {
    position: 'sidebar',
    condition: (_data: any, _siblingData: any, { user }: any): boolean =>
      !!(user?.roles as string[])?.includes('superadmin'),
  },
  hooks: {
    beforeChange: [
      ({ req, operation, value }) => {
        if (
          operation === 'create' &&
          req.user &&
          !req.user.roles?.includes('superadmin')
        ) {
          return req.user.tenant
        }
        return value
      },
    ],
  },
}

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Fichiers',
  },
  upload: {
    mimeTypes: ['image/*'],
  },
  access: {
    read: () => true,
    create: tenantAccess,
    update: tenantAccess,
    delete: tenantAccess,
  },
  fields: [
    tenantField,
    {
      name: 'alt',
      type: 'text',
      localized: true,
      label: 'Texte alternatif',
    },
  ],
}
