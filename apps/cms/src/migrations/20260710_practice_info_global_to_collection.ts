import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

const TENANT_ID = 1  // dr-guinane.dr-tabibi.ma

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1. Create new Collection tables with tenant_id
  await db.execute(sql`
    CREATE TABLE "practice_info_new" (
      "id" serial PRIMARY KEY NOT NULL,
      "tenant_id" integer,
      "phone" varchar,
      "email" varchar,
      "coordinates_lat" numeric,
      "coordinates_lng" numeric,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );
  `)

  await db.execute(sql`
    CREATE TABLE "practice_info_new_locales" (
      "address" varchar,
      "city" varchar,
      "pricing" jsonb,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );
  `)

  await db.execute(sql`
    CREATE TABLE "practice_info_new_schedules" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "day" varchar NOT NULL,
      "open" varchar,
      "close" varchar
    );
  `)

  // 2. Migrate data from Global to Collection
  await db.execute(sql`
    INSERT INTO "practice_info_new" ("tenant_id", "phone", "email", "coordinates_lat", "coordinates_lng", "updated_at", "created_at")
    SELECT ${TENANT_ID}, "phone", "email", "coordinates_lat", "coordinates_lng", "updated_at", "created_at"
    FROM "practice_info";
  `)

  await db.execute(sql`
    INSERT INTO "practice_info_new_locales" ("address", "city", "pricing", "_locale", "_parent_id")
    SELECT l."address", l."city", l."pricing", l."_locale", l."_parent_id"
    FROM "practice_info_locales" l;
  `)

  await db.execute(sql`
    INSERT INTO "practice_info_new_schedules" ("_order", "_parent_id", "id", "day", "open", "close")
    SELECT s."_order", s."_parent_id", s."id", s."day", s."open", s."close"
    FROM "practice_info_schedules" s;
  `)

  // 3. Drop old Global tables
  await db.execute(sql`DROP TABLE "practice_info_schedules" CASCADE;`)
  await db.execute(sql`DROP TABLE "practice_info_locales" CASCADE;`)
  await db.execute(sql`DROP TABLE "practice_info" CASCADE;`)

  // 4. Rename new Collection tables to original names
  await db.execute(sql`ALTER TABLE "practice_info_new" RENAME TO "practice_info";`)
  await db.execute(sql`ALTER TABLE "practice_info_new_locales" RENAME TO "practice_info_locales";`)
  await db.execute(sql`ALTER TABLE "practice_info_new_schedules" RENAME TO "practice_info_schedules";`)

  // 5. Rename sequences (RENAME TABLE does not rename the auto-created sequence)
  await db.execute(sql`ALTER SEQUENCE "practice_info_new_id_seq" RENAME TO "practice_info_id_seq";`)
  await db.execute(sql`ALTER SEQUENCE "practice_info_new_locales_id_seq" RENAME TO "practice_info_locales_id_seq";`)

  // 6. Update sequences
  await db.execute(sql`
    SELECT setval('practice_info_id_seq', COALESCE((SELECT MAX(id) FROM practice_info), 1));
  `)
  await db.execute(sql`
    SELECT setval('practice_info_locales_id_seq', COALESCE((SELECT MAX(id) FROM practice_info_locales), 1));
  `)


  // 6. Recreate foreign keys and indexes
  await db.execute(sql`
    ALTER TABLE "practice_info" ADD CONSTRAINT "practice_info_tenant_id_tenants_id_fk"
    FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  `)

  await db.execute(sql`
    ALTER TABLE "practice_info_schedules" ADD CONSTRAINT "practice_info_schedules_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."practice_info"("id") ON DELETE cascade ON UPDATE no action;
  `)

  await db.execute(sql`
    ALTER TABLE "practice_info_locales" ADD CONSTRAINT "practice_info_locales_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."practice_info"("id") ON DELETE cascade ON UPDATE no action;
  `)

  await db.execute(sql`
    CREATE INDEX "practice_info_tenant_idx" ON "practice_info" USING btree ("tenant_id");
  `)
  await db.execute(sql`
    CREATE INDEX "practice_info_schedules_order_idx" ON "practice_info_schedules" USING btree ("_order");
  `)
  await db.execute(sql`
    CREATE INDEX "practice_info_schedules_parent_id_idx" ON "practice_info_schedules" USING btree ("_parent_id");
  `)
  await db.execute(sql`
    CREATE UNIQUE INDEX "practice_info_locales_locale_parent_id_unique" ON "practice_info_locales" USING btree ("_locale","_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Reverse: create temp Global tables, copy back, drop Collection tables, rename back
  await db.execute(sql`
    CREATE TABLE "practice_info_old" (
      "id" serial PRIMARY KEY NOT NULL,
      "phone" varchar,
      "email" varchar,
      "coordinates_lat" numeric,
      "coordinates_lng" numeric,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );
  `)

  await db.execute(sql`
    CREATE TABLE "practice_info_old_locales" (
      "address" varchar,
      "city" varchar,
      "pricing" jsonb,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );
  `)

  await db.execute(sql`
    CREATE TABLE "practice_info_old_schedules" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "day" varchar NOT NULL,
      "open" varchar,
      "close" varchar
    );
  `)

  await db.execute(sql`
    INSERT INTO "practice_info_old" ("phone", "email", "coordinates_lat", "coordinates_lng", "updated_at", "created_at")
    SELECT "phone", "email", "coordinates_lat", "coordinates_lng", "updated_at", "created_at"
    FROM "practice_info";
  `)

  await db.execute(sql`
    INSERT INTO "practice_info_old_locales" ("address", "city", "pricing", "_locale", "_parent_id")
    SELECT "address", "pricing", "_locale", "_parent_id"
    FROM "practice_info_locales";
  `)

  await db.execute(sql`
    INSERT INTO "practice_info_old_schedules" ("_order", "_parent_id", "id", "day", "open", "close")
    SELECT "_order", "_parent_id", "id", "day", "open", "close"
    FROM "practice_info_schedules";
  `)

  await db.execute(sql`DROP TABLE "practice_info_schedules" CASCADE;`)
  await db.execute(sql`DROP TABLE "practice_info_locales" CASCADE;`)
  await db.execute(sql`DROP TABLE "practice_info" CASCADE;`)

  await db.execute(sql`ALTER TABLE "practice_info_old" RENAME TO "practice_info";`)
  await db.execute(sql`ALTER TABLE "practice_info_old_locales" RENAME TO "practice_info_locales";`)
  await db.execute(sql`ALTER TABLE "practice_info_old_schedules" RENAME TO "practice_info_schedules";`)

  // Rename sequences back
  await db.execute(sql`ALTER SEQUENCE "practice_info_id_seq" RENAME TO "practice_info_old_id_seq";`)
  await db.execute(sql`ALTER SEQUENCE "practice_info_locales_id_seq" RENAME TO "practice_info_old_locales_id_seq";`)

  await db.execute(sql`
    SELECT setval('practice_info_old_id_seq', COALESCE((SELECT MAX(id) FROM practice_info), 1));
  `)
  await db.execute(sql`
    SELECT setval('practice_info_old_locales_id_seq', COALESCE((SELECT MAX(id) FROM practice_info_locales), 1));
  `)

  await db.execute(sql`
    ALTER TABLE "practice_info_schedules" ADD CONSTRAINT "practice_info_schedules_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."practice_info"("id") ON DELETE cascade ON UPDATE no action;
  `)
  await db.execute(sql`
    ALTER TABLE "practice_info_locales" ADD CONSTRAINT "practice_info_locales_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."practice_info"("id") ON DELETE cascade ON UPDATE no action;
  `)

  await db.execute(sql`
    CREATE INDEX "practice_info_schedules_order_idx" ON "practice_info_schedules" USING btree ("_order");
  `)
  await db.execute(sql`
    CREATE INDEX "practice_info_schedules_parent_id_idx" ON "practice_info_schedules" USING btree ("_parent_id");
  `)
  await db.execute(sql`
    CREATE UNIQUE INDEX "practice_info_locales_locale_parent_id_unique" ON "practice_info_locales" USING btree ("_locale","_parent_id");
  `)
}
