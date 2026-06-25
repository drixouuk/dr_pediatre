import type { CollectionConfig } from 'payload'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'author',
    defaultColumns: ['author', 'rating', 'source', 'published'],
  },
  fields: [
    {
      name: 'author',
      type: 'text',
      required: true,
      label: 'Auteur',
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
      label: 'Note',
    },
    {
      name: 'text',
      type: 'textarea',
      localized: true,
      label: 'Texte',
    },
    {
      name: 'date',
      type: 'date',
      label: 'Date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'source',
      type: 'select',
      options: [
        { label: 'Google', value: 'google' },
        { label: 'Direct', value: 'direct' },
      ],
      label: 'Source',
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: true,
      label: 'Publié',
    },
  ],
}
