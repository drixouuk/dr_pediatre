import type { CollectionConfig } from 'payload'
import { auditReadHook, auditWriteHook } from '../hooks/logPatientAccess'

export const Vaccinations: CollectionConfig = {
  slug: 'vaccinations',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['patient', 'vaccineName', 'doseLabel', 'dateAdministered'],
    group: 'Dossier médical',
  },
  access: {
    read: ({ req: { user } }: any) => {
      const roles: string[] = user?.roles ?? []
      if (roles.includes('superadmin')) return true
      if (!(roles.includes('tenant_admin') || roles.includes('doctor'))) return false
      return {
        tenant: {
          equals:
            typeof user.tenant === 'object' ? user.tenant.id : user.tenant,
        },
      }
    },
    create: ({ req: { user } }: any): boolean => {
      const roles: string[] = user?.roles ?? []
      return roles.includes('superadmin') || roles.includes('tenant_admin') || roles.includes('doctor')
    },
    update: ({ req: { user } }: any) => {
      const roles: string[] = user?.roles ?? []
      if (roles.includes('superadmin')) return true
      if (!(roles.includes('tenant_admin') || roles.includes('doctor'))) return false
      return {
        tenant: {
          equals:
            typeof user.tenant === 'object' ? user.tenant.id : user.tenant,
        },
      }
    },
    delete: ({ req: { user } }: any) => {
      const roles: string[] = user?.roles ?? []
      if (roles.includes('superadmin')) return true
      if (!(roles.includes('tenant_admin') || roles.includes('doctor'))) return false
      return {
        tenant: {
          equals:
            typeof user.tenant === 'object' ? user.tenant.id : user.tenant,
        },
      }
    },
  },
  hooks: {
    beforeChange: [
      ({ req, data, operation }: any) => {
        if (operation === 'create' && req.user?.tenant) {
          data.tenant = typeof req.user.tenant === 'object' ? req.user.tenant.id : req.user.tenant
        }
        if (operation === 'create' && req.user) {
          data.practitioner = req.user.id
        }
        return data
      },
    ],
    afterRead: [auditReadHook('vaccinations')],
    afterChange: [auditWriteHook('vaccinations')],
  },
  fields: [
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'patient',
      type: 'relationship',
      relationTo: 'patients',
      required: true,
      index: true,
      label: 'Patient',
    },
    {
      name: 'vaccineName',
      type: 'text',
      required: true,
      label: 'Vaccin',
    },
    {
      name: 'doseLabel',
      type: 'text',
      required: true,
      label: 'Dose',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'administered',
      required: true,
      options: [
        { label: 'Administré', value: 'administered' },
        { label: 'Contre-indiqué', value: 'contraindicated' },
        { label: 'Refusé (parents)', value: 'refused' },
      ],
      label: 'Statut',
    },
    {
      name: 'dateAdministered',
      type: 'date',
      label: 'Date d\'administration',
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'administrationRoute',
      type: 'select',
      options: [
        { label: 'Intramusculaire (IM)', value: 'IM' },
        { label: 'Sous-cutanée (SC)', value: 'SC' },
        { label: 'Orale', value: 'oral' },
        { label: 'Intradermique', value: 'intradermal' },
      ],
      label: 'Voie d\'administration',
    },
    {
      name: 'lotNumber',
      type: 'text',
      label: 'Numéro de lot',
    },
    {
      name: 'practitioner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Praticien',
    },
  ],
}
