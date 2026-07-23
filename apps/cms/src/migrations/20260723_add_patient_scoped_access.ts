import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "patients_followed_by" (
      "id" serial PRIMARY KEY NOT NULL,
      "patients_id" integer NOT NULL,
      "users_id" integer NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "patients_followed_by_patients_idx" ON "patients_followed_by" USING btree ("patients_id");
    CREATE INDEX IF NOT EXISTS "patients_followed_by_users_idx" ON "patients_followed_by" USING btree ("users_id");
    ALTER TABLE "patients_followed_by" ADD CONSTRAINT "patients_followed_by_patients_id_fk"
      FOREIGN KEY ("patients_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "patients_followed_by" ADD CONSTRAINT "patients_followed_by_users_id_fk"
      FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;

    CREATE TABLE IF NOT EXISTS "patients_shared_with" (
      "id" serial PRIMARY KEY NOT NULL,
      "patients_id" integer NOT NULL,
      "users_id" integer NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "patients_shared_with_patients_idx" ON "patients_shared_with" USING btree ("patients_id");
    CREATE INDEX IF NOT EXISTS "patients_shared_with_users_idx" ON "patients_shared_with" USING btree ("users_id");
    ALTER TABLE "patients_shared_with" ADD CONSTRAINT "patients_shared_with_patients_id_fk"
      FOREIGN KEY ("patients_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "patients_shared_with" ADD CONSTRAINT "patients_shared_with_users_id_fk"
      FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  `);

  // Backfill followedBy pour les patients existants
  if (payload) {
    try {
      const patients = await (payload as any).find({
        collection: 'patients',
        where: { followedBy: { exists: false } },
        limit: 1000,
        depth: 0,
      })
      for (const patient of patients.docs || []) {
        const tid = typeof patient.tenant === 'object' ? patient.tenant.id : patient.tenant
        if (!tid) continue
        const doctors = await (payload as any).find({
          collection: 'users',
          where: { tenant: { equals: tid }, roles: { contains: 'doctor' } },
          limit: 1, depth: 0,
        })
        if (doctors.docs?.length > 0) {
          await (payload as any).update({
            collection: 'patients', id: patient.id,
            data: { followedBy: [doctors.docs[0].id] },
          })
        }
      }
      if ((patients.docs || []).length > 0) console.log(`✅ Backfill followedBy for ${patients.docs.length} patients`)
    } catch (e) {
      console.error('Backfill followedBy failed (non-blocking):', String(e))
    }
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "patients_shared_with" CASCADE;
    DROP TABLE IF EXISTS "patients_followed_by" CASCADE;
  `);
}
