import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_tenants_settings_specialty" AS ENUM('pediatrie', 'generaliste', 'gynecologie', 'dermatologie', 'autre');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    ALTER TABLE "tenants" ADD COLUMN IF NOT EXISTS "settings_specialty" "enum_tenants_settings_specialty" DEFAULT 'generaliste';
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "tenants" DROP COLUMN IF EXISTS "settings_specialty";
    DROP TYPE IF EXISTS "public"."enum_tenants_settings_specialty";
  `);
}
