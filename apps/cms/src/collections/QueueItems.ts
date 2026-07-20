import type { CollectionConfig } from 'payload'

export const QueueItems: CollectionConfig = {
  slug: 'queue-items',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['patient', 'status', 'visitReason', 'arrivalTime'],
    group: 'Cabinet',
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
