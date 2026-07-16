import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE "practice_info_schedules_locales" (
      "day" varchar NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" varchar NOT NULL
    );

    ALTER TABLE "practice_info_schedules_locales" ADD CONSTRAINT "practice_info_schedules_locales_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."practice_info_schedules"("id") ON DELETE cascade ON UPDATE no action;

    CREATE UNIQUE INDEX "practice_info_schedules_locales_locale_parent_id_unique"
      ON "practice_info_schedules_locales" USING btree ("_locale","_parent_id");

    ALTER TABLE "practice_info_schedules" DROP COLUMN "day";
  `);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "practice_info_schedules" ADD COLUMN "day" varchar NOT NULL DEFAULT '';
    DROP TABLE "practice_info_schedules_locales" CASCADE;
  `);
}
