import type { CollectionConfig } from 'payload'

export const ContactMessages: CollectionConfig = {
  slug: 'contact-messages',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'createdAt'],
    group: 'Public',
  },
  access: {
    create: () => true,
    read: ({ req: { user } }: any) => !!user,
    update: () => false,
    delete: () => false,
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Nom' },
    { name: 'phone', type: 'text', required: true, label: 'Téléphone' },
    { name: 'message', type: 'textarea', required: true, label: 'Message' },
  ],
}
