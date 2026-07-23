import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_vaccinations_status" AS ENUM('administered', 'contraindicated', 'refused');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
    DO $$ BEGIN
      CREATE TYPE "public"."enum_vaccinations_administration_route" AS ENUM('IM', 'SC', 'oral', 'intradermal');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    ALTER TABLE "vaccinations" ADD COLUMN IF NOT EXISTS "status" "public"."enum_vaccinations_status" DEFAULT 'administered' NOT NULL;
    ALTER TABLE "vaccinations" ALTER COLUMN "date_administered" DROP NOT NULL;
    ALTER TABLE "vaccinations" ALTER COLUMN "date_administered" DROP DEFAULT;
    ALTER TABLE "vaccinations" ADD COLUMN IF NOT EXISTS "administration_route" "public"."enum_vaccinations_administration_route";
    ALTER TABLE "vaccinations" ADD COLUMN IF NOT EXISTS "lot_number" varchar;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "vaccinations" DROP COLUMN IF EXISTS "lot_number";
    ALTER TABLE "vaccinations" DROP COLUMN IF EXISTS "administration_route";
    ALTER TABLE "vaccinations" DROP COLUMN IF EXISTS "status";
    DROP TYPE IF EXISTS "public"."enum_vaccinations_status";
    DROP TYPE IF EXISTS "public"."enum_vaccinations_administration_route";
  `);
}
