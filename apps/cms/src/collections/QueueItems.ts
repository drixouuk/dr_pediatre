import type { CollectionConfig } from 'payload'

function tenantId(user: any): string | undefined {
  if (!user?.tenant) return undefined
  return typeof user.tenant === 'object' ? user.tenant.id : user.tenant
}

export const QueueItems: CollectionConfig = {
  slug: 'queue-items',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['patient', 'status', 'visitReason', 'arrivalTime'],
    group: 'Cabinet',
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
    beforeChange: [
      ({ req, data, operation }: any) => {
        if (operation === 'create' && req.user?.tenant) {
          data.tenant = typeof req.user.tenant === 'object' ? req.user.tenant.id : req.user.tenant
        }
        if (operation === 'create' && req.user?.doctorProfile && !data?.doctor) {
          data.doctor = typeof req.user.doctorProfile === 'object'
            ? req.user.doctorProfile.id
            : req.user.doctorProfile
        }
        return data
      },
    ],
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
      label: 'Patient',
    },
    {
      name: 'doctor',
      type: 'relationship',
      relationTo: 'doctors',
      label: 'Médecin',
      admin: { description: 'Médecin responsable de ce patient dans la file' },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'scheduled',
      options: [
        { label: 'Programmé', value: 'scheduled' },
        { label: 'En salle d\'attente', value: 'waiting' },
        { label: 'En consultation', value: 'in_consultation' },
        { label: 'Terminé', value: 'completed' },
        { label: 'Annulé', value: 'canceled' },
      ],
      label: 'Statut',
    },
    {
      name: 'visitReason',
      type: 'select',
      defaultValue: 'consultation',
      options: [
        { label: 'Consultation', value: 'consultation' },
        { label: 'Contrôle', value: 'controle' },
        { label: 'Vaccin', value: 'vaccin' },
        { label: 'Urgence', value: 'urgence' },
      ],
      label: 'Motif de visite',
    },
    {
      name: 'arrivalTime',
      type: 'date',
      label: 'Heure d\'arrivée',
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
  ],
}
