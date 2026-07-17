import type { CollectionConfig } from 'payload'
import { logPatientReadAccess, logPatientWriteAccess } from '../hooks/logPatientAccess'

export const Patients: CollectionConfig = {
  slug: 'patients',
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'gender', 'nationalId', 'updatedAt'],
  },
  access: {
    read: ({ req: { user } }: any) => {
      if ((user?.roles as string[])?.includes('superadmin')) return true
      return { tenant: { equals: user?.tenant } }
    },
    create: ({ req: { user } }: any): boolean => !!(user as any)?.tenant,
    update: ({ req: { user } }: any) => ({
      tenant: { equals: (user as any)?.tenant },
    }),
    delete: ({ req: { user } }: any) => ({
      tenant: { equals: (user as any)?.tenant },
    }),
  },
  hooks: {
    afterRead: [logPatientReadAccess],
    afterChange: [logPatientWriteAccess],
    beforeChange: [
      ({ req, data, operation }: any) => {
        if (operation === 'create' && req.user?.tenant) {
          data.tenant = req.user.tenant
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'healthIdentifier',
      type: 'text',
      label: 'Identifiant santé unique (CNSS) — à connecter plus tard',
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'fullName',
      type: 'text',
      required: true,
    },
    {
      name: 'gender',
      type: 'select',
      required: true,
      options: [
        { label: 'Garçon', value: 'boy' },
        { label: 'Fille', value: 'girl' },
      ],
      label: 'Sexe',
    },
    {
      name: 'birthDate',
      type: 'date',
      label: 'Date de naissance',
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'nationalId',
      type: 'text',
    },
    {
      name: 'medicalNotes',
      type: 'textarea',
      // Accès réservé à superadmin / tenant_admin / doctor.
      // tenant_admin inclus par défaut mais peut être retiré si
      // seuls les médecins doivent voir les notes médicales.
      access: {
        read: ({ req: { user } }: any) => {
          const roles: string[] = user?.roles ?? []
          return roles.includes('superadmin') || roles.includes('tenant_admin') || roles.includes('doctor')
        },
        update: ({ req: { user } }: any) => {
          const roles: string[] = user?.roles ?? []
          return roles.includes('superadmin') || roles.includes('tenant_admin') || roles.includes('doctor')
        },
      },
    },
  ],
}
