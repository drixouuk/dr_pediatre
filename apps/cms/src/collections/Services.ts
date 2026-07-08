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

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'order', 'tenant'],
  },
  access: {
    read: tenantAccess,
    create: tenantAccess,
    update: tenantAccess,
    delete: tenantAccess,
  },
  fields: [
    tenantField,
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: 'Titre',
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
      label: 'Description',
    },
    {
      name: 'icon',
      type: 'text',
      label: 'Icône (Lucide)',
      admin: {
        description: "Nom de l'icône Lucide React (ex: Stethoscope, Heart)",
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Ordre',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
