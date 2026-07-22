import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "queue_items" ADD COLUMN IF NOT EXISTS "doctor_id" integer;
    ALTER TABLE "queue_items" ADD CONSTRAINT "queue_items_doctor_id_doctors_id_fk"
      FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE SET NULL ON UPDATE no action;
    CREATE INDEX IF NOT EXISTS "queue_items_doctor_idx" ON "queue_items" USING btree ("doctor_id");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "queue_items" DROP CONSTRAINT IF EXISTS "queue_items_doctor_id_doctors_id_fk";
    ALTER TABLE "queue_items" DROP COLUMN IF EXISTS "doctor_id";
  `);
}
