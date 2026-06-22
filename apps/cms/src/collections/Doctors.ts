import type { CollectionConfig } from 'payload'

export const Doctors: CollectionConfig = {
  slug: 'doctors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'specialty', 'rpps'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nom',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'Slug',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'specialty',
      type: 'text',
      localized: true,
      label: 'Spécialité',
    },
    {
      name: 'bio',
      type: 'richText',
      localized: true,
      label: 'Biographie',
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Photo',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'rpps',
      type: 'text',
      label: 'RPPS',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'languages',
      type: 'array',
      label: 'Langues parlées',
      fields: [
        {
          name: 'language',
          type: 'text',
          required: true,
          label: 'Langue',
        },
      ],
    },
  ],
}
