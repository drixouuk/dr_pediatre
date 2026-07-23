import type { CollectionConfig } from 'payload'
import { auditReadHook, auditWriteHook } from '../hooks/logPatientAccess'

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
      if (!user) return false
      const roles: string[] = user.roles ?? []
      if (roles.includes('superadmin') || roles.includes('tenant_admin')) return true
      const tid = tenantId(user)
      if (!tid) return false
      if (roles.includes('doctor')) {
        const filter: any = {
          and: [
            { tenant: { equals: tid } },
            {
              or: [
                { followedBy: { in: [user.id] } },
                { sharedWith: { in: [user.id] } },
                { and: [{ followedBy: { exists: false } }, { sharedWith: { exists: false } }] },
              ],
            },
          ],
        }
        return filter
      }
      return { tenant: { equals: tid } }
    },
    create: ({ req: { user } }: any): boolean => {
      const roles: string[] = user?.roles ?? []
      if (roles.includes('superadmin') || roles.includes('tenant_admin')) return true
      if (roles.includes('doctor')) return !!tenantId(user)
      return false
    },
    update: ({ req: { user } }: any) => {
      const tid = tenantId(user)
      if (!tid) return false
      const roles: string[] = user?.roles ?? []
      if (roles.includes('superadmin') || roles.includes('tenant_admin')) return true
      if (roles.includes('doctor')) {
        const filter: any = {
          and: [
            { tenant: { equals: tid } },
            {
              or: [
                { followedBy: { in: [user.id] } },
                { sharedWith: { in: [user.id] } },
                { and: [{ followedBy: { exists: false } }, { sharedWith: { exists: false } }] },
              ],
            },
          ],
        }
        return filter
      }
      return false
    },
    delete: ({ req: { user } }: any) => {
      const tid = tenantId(user)
      if (!tid) return false
      const roles: string[] = user?.roles ?? []
      if (roles.includes('superadmin') || roles.includes('tenant_admin')) return true
      if (roles.includes('doctor')) {
        const filter: any = {
          and: [
            { tenant: { equals: tid } },
            {
              or: [
                { followedBy: { in: [user.id] } },
                { and: [{ followedBy: { exists: false } }, { sharedWith: { exists: false } }] },
              ],
            },
          ],
        }
        return filter
      }
      return false
    },
  },
  hooks: {
    afterRead: [auditReadHook('patients')],
    afterChange: [auditWriteHook('patients')],
    beforeChange: [
      ({ req, data, operation }: any) => {
        if (operation === 'create' && req.user?.tenant) {
          data.tenant = typeof req.user.tenant === 'object' ? req.user.tenant.id : req.user.tenant
        }
        if (operation === 'create' && req.user && (!data?.followedBy || data.followedBy.length === 0)) {
          data.followedBy = [req.user.id]
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
    {
      name: 'referringPractitioners',
      type: 'relationship',
      relationTo: 'referring-practitioners',
      hasMany: true,
      label: 'Médecins référents',
      admin: { description: 'Praticiens ayant adressé ce patient' },
    },
    {
      name: 'followedBy',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      label: 'Suivi par',
      admin: { description: 'Médecins responsables du suivi de ce patient' },
    },
    {
      name: 'sharedWith',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      label: 'Partagé avec',
      admin: { description: 'Médecins ayant reçu un accès ponctuel à ce dossier' },
    },
  ],
}
