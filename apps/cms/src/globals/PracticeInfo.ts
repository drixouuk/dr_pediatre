import type { GlobalConfig } from "payload";

export const PracticeInfo: GlobalConfig = {
  slug: "practice-info",
  admin: {
    group: "Contenu",
  },
  fields: [
    {
      name: "address",
      type: "textarea",
      localized: true,
      label: "Adresse",
    },
    {
      name: "city",
      type: "text",
      localized: true,
      label: "Ville",
    },
    {
      name: "phone",
      type: "text",
      label: "Téléphone",
    },
    {
      name: "email",
      type: "email",
      label: "Email",
    },
    {
      type: "group",
      name: "coordinates",
      label: "Coordonnées GPS",
      fields: [
        {
          name: "lat",
          type: "number",
          label: "Latitude",
          admin: {
            placeholder: "30.3576702",
          },
        },
        {
          name: "lng",
          type: "number",
          label: "Longitude",
          admin: {
            placeholder: "-9.5279038",
          },
        },
      ],
    },
    {
      name: "schedules",
      type: "array",
      label: "Horaires",
      fields: [
        {
          name: "day",
          type: "text",
          required: true,
          label: "Jour",
        },
        {
          name: "open",
          type: "text",
          label: "Ouverture",
          admin: {
            placeholder: "08:30",
          },
        },
        {
          name: "close",
          type: "text",
          label: "Fermeture",
          admin: {
            placeholder: "16:30",
          },
        },
      ],
    },
    {
      name: "pricing",
      type: "richText",
      localized: true,
      label: "Tarifs",
    },
  ],
};
