import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "doctor_profile_id" integer;
    ALTER TABLE "users" ADD CONSTRAINT "users_doctor_profile_id_doctors_id_fk"
      FOREIGN KEY ("doctor_profile_id") REFERENCES "public"."doctors"("id") ON DELETE SET NULL ON UPDATE no action;
    CREATE INDEX IF NOT EXISTS "users_doctor_profile_idx" ON "users" USING btree ("doctor_profile_id");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_doctor_profile_id_doctors_id_fk";
    ALTER TABLE "users" DROP COLUMN IF EXISTS "doctor_profile_id";
  `);
}
