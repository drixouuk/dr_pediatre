import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'order'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: 'Titre',
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
      label: 'Description',
    },
    {
      name: 'icon',
      type: 'text',
      label: 'Icône (Lucide)',
      admin: {
        description: "Nom de l'icône Lucide React (ex: Stethoscope, Heart)",
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Ordre',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
