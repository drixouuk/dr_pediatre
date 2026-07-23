import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_patients_patient_source" AS ENUM(
        'referring_practitioner', 'google', 'facebook', 'instagram',
        'autre_patient', 'connaissance', 'professionnel_sante', 'autre'
      );
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "patient_source" "public"."enum_patients_patient_source";
    ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "patient_source_detail" varchar;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "patients" DROP COLUMN IF EXISTS "patient_source_detail";
    ALTER TABLE "patients" DROP COLUMN IF EXISTS "patient_source";
    DROP TYPE IF EXISTS "public"."enum_patients_patient_source";
  `);
}
