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
  localization: {
    locales: ["fr", "en", "ar", "tzm"],
    defaultLocale: "fr",
    fallback: true,
  },
  editor: lexicalEditor({}),
});
