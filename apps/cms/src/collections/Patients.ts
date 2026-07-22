import type { CollectionConfig } from 'payload'
import { logPatientReadAccess, logPatientWriteAccess } from '../hooks/logPatientAccess'

function tenantId(user: any): string | undefined {
  if (!user?.tenant) return undefined
  return typeof user.tenant === 'object' ? user.tenant.id : user.tenant
}

export const Patients: CollectionConfig = {
  slug: 'patients',
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'gender', 'nationalId', 'updatedAt'],
  },
  access: {
    read: ({ req: { user } }: any) => {
      if (user?.roles?.includes('superadmin')) return true
      const id = tenantId(user)
      if (!id) return false
      return { tenant: { equals: id } }
    },
    create: ({ req: { user } }: any): boolean => !!tenantId(user),
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
    afterRead: [logPatientReadAccess],
    afterChange: [logPatientWriteAccess],
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
      name: 'address',
      type: 'text',
      label: 'Adresse',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Téléphone',
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
    },
    {
      name: 'nationalId',
      type: 'text',
    },
    {
      name: 'antecedents',
      type: 'textarea',
      label: 'Antécédents médicaux',
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
    {
      name: 'allergies',
      type: 'textarea',
      label: 'Allergies connues',
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
    {
      name: 'traitementsEnCours',
      type: 'textarea',
      label: 'Traitements en cours',
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
