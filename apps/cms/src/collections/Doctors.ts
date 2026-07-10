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

export const Doctors: CollectionConfig = {
  slug: 'doctors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'specialty', 'rpps', 'tenant'],
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
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nom',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'Slug',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'specialty',
      type: 'text',
      localized: true,
      label: 'Spécialité',
    },
    {
      name: 'bio',
      type: 'richText',
      localized: true,
      label: 'Biographie',
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Photo',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'rpps',
      type: 'text',
      label: 'RPPS',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'languages',
      type: 'array',
      label: 'Langues parlées',
      fields: [
        {
          name: 'language',
          type: 'text',
          required: true,
          label: 'Langue',
        },
      ],
    },
  ],
}
