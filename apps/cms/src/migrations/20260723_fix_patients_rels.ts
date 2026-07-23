import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "patients_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "referring_practitioners_id" integer,
      "users_id" integer,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "patients_rels_parent_id_idx" ON "patients_rels" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "patients_rels_path_idx" ON "patients_rels" USING btree ("path");
    ALTER TABLE "patients_rels" ADD CONSTRAINT "patients_rels_parent_id_fk"
      FOREIGN KEY ("parent_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;

    -- Migrate referringPractitioners data from the wrong pivot table
    INSERT INTO "patients_rels" ("parent_id", "path", "referring_practitioners_id", "order")
    SELECT "patients_id", 'referringPractitioners', "referring_practitioners_id", row_number() OVER (PARTITION BY "patients_id" ORDER BY "id") - 1
    FROM "patients_referring_practitioners";

    -- Drop the wrong pivot tables
    DROP TABLE IF EXISTS "patients_referring_practitioners" CASCADE;
    DROP TABLE IF EXISTS "patients_followed_by" CASCADE;
    DROP TABLE IF EXISTS "patients_shared_with" CASCADE;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "patients_rels" CASCADE;
  `);
}
