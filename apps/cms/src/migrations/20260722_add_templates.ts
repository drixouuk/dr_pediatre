import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "templates" (
      "id" serial PRIMARY KEY NOT NULL,
      "tenant_id" integer NOT NULL,
      "name" varchar NOT NULL,
      "type" varchar NOT NULL,
      "motif" varchar,
      "examen_clinique" varchar,
      "diagnostic" varchar,
      "code_acte" varchar,
      "medications" jsonb,
      "notes" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE INDEX IF NOT EXISTS "templates_tenant_idx" ON "templates" USING btree ("tenant_id");
    CREATE INDEX IF NOT EXISTS "templates_updated_at_idx" ON "templates" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "templates_created_at_idx" ON "templates" USING btree ("created_at");

    ALTER TABLE "templates" ADD CONSTRAINT "templates_tenant_id_tenants_id_fk"
      FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE SET NULL ON UPDATE no action;

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "templates_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_templates_fk"
      FOREIGN KEY ("templates_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_templates_id_idx"
      ON "payload_locked_documents_rels" USING btree ("templates_id");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_templates_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "templates_id";
    DROP TABLE IF EXISTS "templates" CASCADE;
  `);
}
