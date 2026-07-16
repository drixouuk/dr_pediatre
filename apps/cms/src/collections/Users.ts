import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  access: {
    create: ({ req: { user } }: any): boolean => {
      if (!user) return false
      if ((user.roles as string[])?.includes('superadmin')) return true
      return !!(user.roles as string[])?.includes('tenant_admin')
    },
    read: ({ req: { user } }: any) => {
      if ((user?.roles as string[])?.includes('superadmin')) return true
      if (!user?.tenant) return false
      return {
        tenant: {
          equals:
            typeof user.tenant === 'object'
              ? (user.tenant as any).id
              : user.tenant,
        },
      }
    },
  },
  hooks: {
    beforeChange: [
      ({ req, data }: any) => {
        const user = req.user
        if (!user) return data

        const userRoles: string[] = user.roles ?? []
        const newRoles: string[] = data?.roles ?? []

        if (!userRoles.includes('superadmin') && newRoles.includes('superadmin')) {
          throw new Error('Seul un superadmin peut attribuer le rôle superadmin.')
        }
        if (
          !userRoles.includes('superadmin') &&
          !userRoles.includes('tenant_admin') &&
          newRoles.includes('tenant_admin')
        ) {
          throw new Error('Vous ne pouvez pas attribuer le rôle tenant_admin.')
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nom',
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      options: ['superadmin', 'tenant_admin', 'doctor', 'secretary'],
      defaultValue: ['secretary'],
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      admin: {
        condition: (data: any): boolean =>
          !data?.roles?.includes('superadmin'),
      },
      validate: (value: unknown, { data }: { data?: any }): string | true => {
        const roles: string[] = data?.roles ?? []
        if (!roles.includes('superadmin') && !value) {
          return 'Le tenant est requis pour les utilisateurs non-superadmin.'
        }
        return true
      },
    },
  ],
}
