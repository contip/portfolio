import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cats" ADD COLUMN "image_id" integer;
  ALTER TABLE "cats" ADD CONSTRAINT "cats_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "cats_image_idx" ON "cats" USING btree ("image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cats" DROP CONSTRAINT "cats_image_id_media_id_fk";
  
  DROP INDEX "cats_image_idx";
  ALTER TABLE "cats" DROP COLUMN "image_id";`)
}
