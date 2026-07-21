import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "calbookings" (
      "id" serial PRIMARY KEY NOT NULL,
      "booking_uid" varchar NOT NULL,
      "tenant_id" integer NOT NULL,
      "event_type_slug" varchar NOT NULL,
      "title" varchar,
      "status" varchar DEFAULT 'pending',
      "start_time" timestamp(3) with time zone NOT NULL,
      "end_time" timestamp(3) with time zone NOT NULL,
      "attendee_name" varchar,
      "attendee_email" varchar,
      "attendee_phone" varchar,
      "attendee_timezone" varchar,
      "location" varchar,
      "duration" numeric,
      "rescheduled_from_uid" varchar,
      "rescheduled_to_uid" varchar,
      "cancellation_reason" varchar,
      "responses" jsonb,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE UNIQUE INDEX IF NOT EXISTS "calbookings_booking_uid_idx" ON "calbookings" USING btree ("booking_uid");
    CREATE INDEX IF NOT EXISTS "calbookings_tenant_idx" ON "calbookings" USING btree ("tenant_id");
    CREATE INDEX IF NOT EXISTS "calbookings_start_time_idx" ON "calbookings" USING btree ("start_time");
    CREATE INDEX IF NOT EXISTS "calbookings_updated_at_idx" ON "calbookings" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "calbookings_created_at_idx" ON "calbookings" USING btree ("created_at");

    ALTER TABLE "calbookings" ADD CONSTRAINT "calbookings_tenant_id_tenants_id_fk"
      FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE SET NULL ON UPDATE no action;

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "calbookings_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_calbookings_fk"
      FOREIGN KEY ("calbookings_id") REFERENCES "public"."calbookings"("id") ON DELETE cascade ON UPDATE no action;
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_calbookings_id_idx"
      ON "payload_locked_documents_rels" USING btree ("calbookings_id");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_calbookings_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "calbookings_id";
    DROP TABLE IF EXISTS "calbookings" CASCADE;
  `);
}
