import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_documents_document_type" AS ENUM('radio', 'analyse', 'certificat', 'ordonnance-externe', 'autre');

    ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "health_identifier" varchar;

    CREATE TABLE IF NOT EXISTS "consultations" (
      "id" serial PRIMARY KEY NOT NULL,
      "tenant_id" integer NOT NULL,
      "patient_id" integer NOT NULL,
      "practitioner_id" integer NOT NULL,
      "date" timestamp(3) with time zone NOT NULL,
      "motif" varchar,
      "examen_clinique" varchar,
      "poids" numeric,
      "taille" numeric,
      "perimetre_cranien" numeric,
      "diagnostic" varchar,
      "code_acte" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "prescriptions_medications" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "nom" varchar NOT NULL,
      "dci" varchar,
      "posologie" varchar NOT NULL,
      "duree" varchar NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "prescriptions" (
      "id" serial PRIMARY KEY NOT NULL,
      "tenant_id" integer NOT NULL,
      "patient_id" integer NOT NULL,
      "consultation_id" integer,
      "practitioner_id" integer NOT NULL,
      "date" timestamp(3) with time zone NOT NULL,
      "notes" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "documents" (
      "id" serial PRIMARY KEY NOT NULL,
      "tenant_id" integer NOT NULL,
      "patient_id" integer NOT NULL,
      "consultation_id" integer,
      "document_type" "enum_documents_document_type" NOT NULL,
      "uploaded_by_id" integer NOT NULL,
      "notes" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "url" varchar,
      "thumbnail_u_r_l" varchar,
      "filename" varchar,
      "mime_type" varchar,
      "filesize" numeric,
      "width" numeric,
      "height" numeric,
      "focal_x" numeric,
      "focal_y" numeric
    );

    ALTER TABLE "consultations" ADD CONSTRAINT "consultations_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "consultations" ADD CONSTRAINT "consultations_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "consultations" ADD CONSTRAINT "consultations_practitioner_id_users_id_fk" FOREIGN KEY ("practitioner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "prescriptions_medications" ADD CONSTRAINT "prescriptions_medications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."prescriptions"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_consultation_id_consultations_id_fk" FOREIGN KEY ("consultation_id") REFERENCES "public"."consultations"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_practitioner_id_users_id_fk" FOREIGN KEY ("practitioner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "documents" ADD CONSTRAINT "documents_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "documents" ADD CONSTRAINT "documents_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "documents" ADD CONSTRAINT "documents_consultation_id_consultations_id_fk" FOREIGN KEY ("consultation_id") REFERENCES "public"."consultations"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "documents" ADD CONSTRAINT "documents_uploaded_by_id_users_id_fk" FOREIGN KEY ("uploaded_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;

    CREATE INDEX IF NOT EXISTS "consultations_tenant_idx" ON "consultations" USING btree ("tenant_id");
    CREATE INDEX IF NOT EXISTS "consultations_patient_idx" ON "consultations" USING btree ("patient_id");
    CREATE INDEX IF NOT EXISTS "consultations_practitioner_idx" ON "consultations" USING btree ("practitioner_id");
    CREATE INDEX IF NOT EXISTS "consultations_updated_at_idx" ON "consultations" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "consultations_created_at_idx" ON "consultations" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "prescriptions_medications_order_idx" ON "prescriptions_medications" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "prescriptions_medications_parent_id_idx" ON "prescriptions_medications" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "prescriptions_tenant_idx" ON "prescriptions" USING btree ("tenant_id");
    CREATE INDEX IF NOT EXISTS "prescriptions_patient_idx" ON "prescriptions" USING btree ("patient_id");
    CREATE INDEX IF NOT EXISTS "prescriptions_consultation_idx" ON "prescriptions" USING btree ("consultation_id");
    CREATE INDEX IF NOT EXISTS "prescriptions_practitioner_idx" ON "prescriptions" USING btree ("practitioner_id");
    CREATE INDEX IF NOT EXISTS "prescriptions_updated_at_idx" ON "prescriptions" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "prescriptions_created_at_idx" ON "prescriptions" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "documents_tenant_idx" ON "documents" USING btree ("tenant_id");
    CREATE INDEX IF NOT EXISTS "documents_patient_idx" ON "documents" USING btree ("patient_id");
    CREATE INDEX IF NOT EXISTS "documents_consultation_idx" ON "documents" USING btree ("consultation_id");
    CREATE INDEX IF NOT EXISTS "documents_uploaded_by_idx" ON "documents" USING btree ("uploaded_by_id");
    CREATE INDEX IF NOT EXISTS "documents_updated_at_idx" ON "documents" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "documents_created_at_idx" ON "documents" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "documents_filename_idx" ON "documents" USING btree ("filename");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "documents" CASCADE;
    DROP TABLE IF EXISTS "prescriptions_medications" CASCADE;
    DROP TABLE IF EXISTS "prescriptions" CASCADE;
    DROP TABLE IF EXISTS "consultations" CASCADE;
    ALTER TABLE "patients" DROP COLUMN IF EXISTS "health_identifier";
    DROP TYPE IF EXISTS "enum_documents_document_type";
  `)
}
