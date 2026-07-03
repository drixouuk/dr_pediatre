import { s3Storage } from "@payloadcms/storage-s3";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { Users } from "./src/collections/Users";
import { Doctors } from "./src/collections/Doctors";
import { Services } from "./src/collections/Services";
import { Media } from "./src/collections/Media";
import { Reviews } from "./src/collections/Reviews";
import { PracticeInfo } from "./src/globals/PracticeInfo";

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET ?? "dev-secret-change-in-production",
  admin: {
    user: "users",
  },
  collections: [Users, Doctors, Services, Media, Reviews],
  globals: [PracticeInfo],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),

  plugins: [
    s3Storage({
      collections: {
        media: true,
      },
      bucket: process.env.R2_BUCKET || "",
      config: {
        endpoint: process.env.R2_ENDPOINT || "",
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
        },
        region: "garage",
        forcePathStyle: true,
      },
    }),
  ],

  localization: {
    locales: ["fr", "en", "ar", "tzm"],
    defaultLocale: "fr",
    fallback: true,
  },
  editor: lexicalEditor({}),
});
