import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "nav" DROP CONSTRAINT "nav_logo_id_media_id_fk";
  
  DROP INDEX "nav_logo_idx";
  ALTER TABLE "nav" ADD COLUMN "logo_light_id" integer;
  ALTER TABLE "nav" ADD COLUMN "logo_dark_id" integer;
  ALTER TABLE "nav" ADD CONSTRAINT "nav_logo_light_id_media_id_fk" FOREIGN KEY ("logo_light_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "nav" ADD CONSTRAINT "nav_logo_dark_id_media_id_fk" FOREIGN KEY ("logo_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "nav_logo_light_idx" ON "nav" USING btree ("logo_light_id");
  CREATE INDEX "nav_logo_dark_idx" ON "nav" USING btree ("logo_dark_id");
  ALTER TABLE "nav" DROP COLUMN "logo_id";
  ALTER TABLE "nav" DROP COLUMN "logo_type";
  DROP TYPE "public"."enum_nav_logo_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_nav_logo_type" AS ENUM('square', 'rectangular');
  ALTER TABLE "nav" DROP CONSTRAINT "nav_logo_light_id_media_id_fk";
  
  ALTER TABLE "nav" DROP CONSTRAINT "nav_logo_dark_id_media_id_fk";
  
  DROP INDEX "nav_logo_light_idx";
  DROP INDEX "nav_logo_dark_idx";
  ALTER TABLE "nav" ADD COLUMN "logo_id" integer;
  ALTER TABLE "nav" ADD COLUMN "logo_type" "enum_nav_logo_type" DEFAULT 'rectangular';
  ALTER TABLE "nav" ADD CONSTRAINT "nav_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "nav_logo_idx" ON "nav" USING btree ("logo_id");
  ALTER TABLE "nav" DROP COLUMN "logo_light_id";
  ALTER TABLE "nav" DROP COLUMN "logo_dark_id";`)
}
