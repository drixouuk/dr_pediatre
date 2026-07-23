import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "referring_practitioners" (
      "id" serial PRIMARY KEY NOT NULL,
      "tenant_id" integer NOT NULL,
      "name" varchar NOT NULL,
      "specialty" varchar,
      "phone" varchar,
      "city" varchar,
      "notes" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "referring_practitioners_tenant_idx" ON "referring_practitioners" USING btree ("tenant_id");
    CREATE INDEX IF NOT EXISTS "referring_practitioners_updated_at_idx" ON "referring_practitioners" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "referring_practitioners_created_at_idx" ON "referring_practitioners" USING btree ("created_at");
    ALTER TABLE "referring_practitioners" ADD CONSTRAINT "referring_practitioners_tenant_id_tenants_id_fk"
      FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE SET NULL ON UPDATE no action;

    CREATE TABLE IF NOT EXISTS "patients_referring_practitioners" (
      "id" serial PRIMARY KEY NOT NULL,
      "patients_id" integer NOT NULL,
      "referring_practitioners_id" integer NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "patients_referring_practitioners_patients_idx" ON "patients_referring_practitioners" USING btree ("patients_id");
    CREATE INDEX IF NOT EXISTS "patients_referring_practitioners_practitioners_idx" ON "patients_referring_practitioners" USING btree ("referring_practitioners_id");
    ALTER TABLE "patients_referring_practitioners" ADD CONSTRAINT "patients_referring_practitioners_patients_id_fk"
      FOREIGN KEY ("patients_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "patients_referring_practitioners" ADD CONSTRAINT "patients_referring_practitioners_referring_practitioners_id_fk"
      FOREIGN KEY ("referring_practitioners_id") REFERENCES "public"."referring_practitioners"("id") ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "referring_practitioners_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_referring_practitioners_fk"
      FOREIGN KEY ("referring_practitioners_id") REFERENCES "public"."referring_practitioners"("id") ON DELETE cascade ON UPDATE no action;
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_referring_practitioners_id_idx"
      ON "payload_locked_documents_rels" USING btree ("referring_practitioners_id");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_referring_practitioners_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "referring_practitioners_id";
    DROP TABLE IF EXISTS "patients_referring_practitioners" CASCADE;
    DROP TABLE IF EXISTS "referring_practitioners" CASCADE;
  `);
}
