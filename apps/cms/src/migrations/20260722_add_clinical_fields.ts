import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "antecedents" varchar;
    ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "allergies" varchar;
    ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "traitements_en_cours" varchar;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "patients" DROP COLUMN IF EXISTS "antecedents";
    ALTER TABLE "patients" DROP COLUMN IF EXISTS "allergies";
    ALTER TABLE "patients" DROP COLUMN IF EXISTS "traitements_en_cours";
  `);
}
