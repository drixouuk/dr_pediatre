import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "address" varchar;
    ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "phone" varchar;
    ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "email" varchar;
  `);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "patients" DROP COLUMN IF EXISTS "address";
    ALTER TABLE "patients" DROP COLUMN IF EXISTS "phone";
    ALTER TABLE "patients" DROP COLUMN IF EXISTS "email";
  `);
}
