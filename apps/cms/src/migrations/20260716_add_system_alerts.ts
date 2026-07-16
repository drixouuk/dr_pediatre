import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_system_alerts_level" AS ENUM('error', 'critical');

    CREATE TABLE "system_alerts" (
      "id" serial PRIMARY KEY NOT NULL,
      "level" "enum_system_alerts_level" DEFAULT 'error' NOT NULL,
      "message" varchar NOT NULL,
      "context" jsonb,
      "timestamp" timestamp(3) with time zone NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE INDEX "system_alerts_updated_at_idx" ON "system_alerts" USING btree ("updated_at");
    CREATE INDEX "system_alerts_created_at_idx" ON "system_alerts" USING btree ("created_at");

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "system_alerts_id" integer;

    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_system_alerts_fk"
      FOREIGN KEY ("system_alerts_id") REFERENCES "public"."system_alerts"("id") ON DELETE cascade ON UPDATE no action;

    CREATE INDEX "payload_locked_documents_rels_system_alerts_id_idx"
      ON "payload_locked_documents_rels" USING btree ("system_alerts_id");
  `);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_system_alerts_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "system_alerts_id";
    DROP TABLE "system_alerts" CASCADE;
    DROP TYPE "public"."enum_system_alerts_level";
  `);
}
