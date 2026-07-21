import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "vaccine_schedule" (
      "id" serial PRIMARY KEY NOT NULL,
      "vaccine_name" varchar NOT NULL,
      "dose_label" varchar NOT NULL,
      "age_months" numeric NOT NULL,
      "order" numeric,
      "notes" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE INDEX IF NOT EXISTS "vaccine_schedule_updated_at_idx" ON "vaccine_schedule" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "vaccine_schedule_created_at_idx" ON "vaccine_schedule" USING btree ("created_at");

    CREATE TABLE IF NOT EXISTS "vaccinations" (
      "id" serial PRIMARY KEY NOT NULL,
      "tenant_id" integer NOT NULL,
      "patient_id" integer NOT NULL,
      "vaccine_name" varchar NOT NULL,
      "dose_label" varchar NOT NULL,
      "date_administered" timestamp(3) with time zone NOT NULL,
      "practitioner_id" integer NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE INDEX IF NOT EXISTS "vaccinations_tenant_idx" ON "vaccinations" USING btree ("tenant_id");
    CREATE INDEX IF NOT EXISTS "vaccinations_patient_idx" ON "vaccinations" USING btree ("patient_id");
    CREATE INDEX IF NOT EXISTS "vaccinations_updated_at_idx" ON "vaccinations" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "vaccinations_created_at_idx" ON "vaccinations" USING btree ("created_at");

    ALTER TABLE "vaccinations" ADD CONSTRAINT "vaccinations_tenant_id_tenants_id_fk"
      FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE SET NULL ON UPDATE no action;
    ALTER TABLE "vaccinations" ADD CONSTRAINT "vaccinations_patient_id_patients_id_fk"
      FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE SET NULL ON UPDATE no action;
    ALTER TABLE "vaccinations" ADD CONSTRAINT "vaccinations_practitioner_id_users_id_fk"
      FOREIGN KEY ("practitioner_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE no action;

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "vaccine_schedule_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "vaccinations_id" integer;

    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_vaccine_schedule_fk"
      FOREIGN KEY ("vaccine_schedule_id") REFERENCES "public"."vaccine_schedule"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_vaccinations_fk"
      FOREIGN KEY ("vaccinations_id") REFERENCES "public"."vaccinations"("id") ON DELETE cascade ON UPDATE no action;

    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_vaccine_schedule_id_idx"
      ON "payload_locked_documents_rels" USING btree ("vaccine_schedule_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_vaccinations_id_idx"
      ON "payload_locked_documents_rels" USING btree ("vaccinations_id");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_vaccinations_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_vaccine_schedule_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "vaccinations_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "vaccine_schedule_id";
    ALTER TABLE "vaccinations" DROP CONSTRAINT IF EXISTS "vaccinations_practitioner_id_users_id_fk";
    ALTER TABLE "vaccinations" DROP CONSTRAINT IF EXISTS "vaccinations_patient_id_patients_id_fk";
    ALTER TABLE "vaccinations" DROP CONSTRAINT IF EXISTS "vaccinations_tenant_id_tenants_id_fk";
    DROP TABLE IF EXISTS "vaccinations" CASCADE;
    DROP TABLE IF EXISTS "vaccine_schedule" CASCADE;
  `);
}
