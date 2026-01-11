import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "nav" DROP CONSTRAINT "nav_logo_id_media_id_fk";
  
  DROP INDEX "nav_logo_idx";
  ALTER TABLE "nav" DROP COLUMN "logo_id";
  ALTER TABLE "nav" DROP COLUMN "brand_name";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "nav" ADD COLUMN "logo_id" integer;
  ALTER TABLE "nav" ADD COLUMN "brand_name" varchar DEFAULT 'Conti Digital';
  ALTER TABLE "nav" ADD CONSTRAINT "nav_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "nav_logo_idx" ON "nav" USING btree ("logo_id");`)
}
