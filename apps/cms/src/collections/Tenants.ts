import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'name',
    description: 'Cabinets médicaux (Multi-tenant)',
  },
  access: {
    create: ({ req: { user } }): boolean =>
      !!(user?.roles as string[])?.includes('superadmin'),
    read: () => true,
    update: ({ req: { user }, id }: any): boolean => {
      if ((user?.roles as string[])?.includes('superadmin')) return true
      return (
        user?.tenant === id &&
        !!(user?.roles as string[])?.includes('tenant_admin')
      )
    },
    delete: ({ req: { user } }): boolean =>
      !!(user?.roles as string[])?.includes('superadmin'),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nom du Cabinet',
    },
    {
      name: 'domain',
      type: 'text',
      unique: true,
      label: 'Domaine personnalisé (ex: cabinet-aicha.dr-tabibi.ma)',
    },
    {
      name: 'settings',
      type: 'group',
      fields: [
        {
          name: 'defaultLocale',
          type: 'select',
          options: ['fr', 'ar', 'en', 'tzm'],
          defaultValue: 'fr',
        },
        {
          name: 'activeTier',
          type: 'select',
          options: ['vitrine', 'rdv', 'dossier', 'clinique'],
          defaultValue: 'vitrine',
        },
      ],
    },
    {
      name: 'calcomSettings',
      type: 'group',
      label: 'Cal.com (prise de rendez-vous)',
      fields: [
        {
          name: 'eventSlug',
          type: 'text',
          label: "Slug de l'événement (ex: consultation-pediatrique)",
          admin: { placeholder: 'consultation-pediatrique' },
        },
        {
          name: 'username',
          type: 'text',
          label: "Nom d'utilisateur Cal.com (ex: dr-guinane)",
          admin: { placeholder: 'dr-guinane' },
        },
        {
          name: 'customUrl',
          type: 'text',
          label: 'URL personnalisée de l\'instance Cal.com (optionnel)',
          admin: { placeholder: 'https://calcom.drixou.uk' },
        },
      ],
    },
  ],
}
