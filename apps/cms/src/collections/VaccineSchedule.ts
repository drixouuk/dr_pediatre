import type { CollectionConfig } from 'payload'

export const VaccineSchedule: CollectionConfig = {
  slug: 'vaccine-schedule',
  admin: {
    useAsTitle: 'vaccineName',
    defaultColumns: ['vaccineName', 'doseLabel', 'ageMonths', 'order'],
    group: 'Référentiels',
    description: 'Calendrier vaccinal de référence (PNI). Partagé entre tous les cabinets.',
  },
  access: {
    read: ({ req: { user } }: any): boolean => !!user,
    create: ({ req: { user } }: any): boolean =>
      !!(user?.roles as string[])?.includes('superadmin'),
    update: ({ req: { user } }: any): boolean =>
      !!(user?.roles as string[])?.includes('superadmin'),
    delete: ({ req: { user } }: any): boolean =>
      !!(user?.roles as string[])?.includes('superadmin'),
  },
  fields: [
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
      name: 'ageMonths',
      type: 'number',
      required: true,
      label: 'Âge recommandé (mois)',
    },
    {
      name: 'order',
      type: 'number',
      label: 'Ordre d\'affichage',
    },
    {
      name: 'notes',
      type: 'text',
      label: 'Notes',
    },
  ],
}
