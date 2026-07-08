import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  access: {
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
