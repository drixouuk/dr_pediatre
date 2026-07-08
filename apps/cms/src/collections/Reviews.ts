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

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'author',
    defaultColumns: ['author', 'rating', 'source', 'published', 'tenant'],
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
      name: 'author',
      type: 'text',
      required: true,
      label: 'Auteur',
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
      label: 'Note',
    },
    {
      name: 'text',
      type: 'textarea',
      localized: true,
      label: 'Texte',
    },
    {
      name: 'date',
      type: 'date',
      label: 'Date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'source',
      type: 'select',
      options: [
        { label: 'Google', value: 'google' },
        { label: 'Direct', value: 'direct' },
      ],
      label: 'Source',
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: true,
      label: 'Publié',
    },
  ],
}
