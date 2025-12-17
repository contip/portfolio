import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_lizards_species" AS ENUM('sagrei', 'baracoa', 'barbatus');
  ALTER TABLE "cats" RENAME TO "lizards";
  ALTER TABLE "payload_locked_documents_rels" RENAME COLUMN "cats_id" TO "lizards_id";
  ALTER TABLE "lizards" DROP CONSTRAINT "cats_image_id_media_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_cats_fk";
  
  DROP INDEX "cats_image_idx";
  DROP INDEX "cats_updated_at_idx";
  DROP INDEX "cats_created_at_idx";
  DROP INDEX "payload_locked_documents_rels_cats_id_idx";
  ALTER TABLE "lizards" ADD COLUMN "species" "enum_lizards_species";
  ALTER TABLE "lizards" ADD COLUMN "generate_slug" boolean DEFAULT true;
  ALTER TABLE "lizards" ADD CONSTRAINT "lizards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lizards_fk" FOREIGN KEY ("lizards_id") REFERENCES "public"."lizards"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "lizards_slug_idx" ON "lizards" USING btree ("slug");
  CREATE INDEX "lizards_image_idx" ON "lizards" USING btree ("image_id");
  CREATE INDEX "lizards_updated_at_idx" ON "lizards" USING btree ("updated_at");
  CREATE INDEX "lizards_created_at_idx" ON "lizards" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_lizards_id_idx" ON "payload_locked_documents_rels" USING btree ("lizards_id");
  ALTER TABLE "lizards" DROP COLUMN "breed";
  ALTER TABLE "lizards" DROP COLUMN "weight";
  DROP TYPE "public"."enum_cats_breed";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_cats_breed" AS ENUM('siamese', 'maine_coon', 'persian', 'ragdoll', 'british_shorthair', 'tomcat');
  CREATE TABLE "cats" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"breed" "enum_cats_breed",
  	"weight" numeric,
  	"age" numeric,
  	"slug" varchar NOT NULL,
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "lizards" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "lizards" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_lizards_fk";
  
  DROP INDEX "payload_locked_documents_rels_lizards_id_idx";
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "cats_id" integer;
  ALTER TABLE "cats" ADD CONSTRAINT "cats_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "cats_image_idx" ON "cats" USING btree ("image_id");
  CREATE INDEX "cats_updated_at_idx" ON "cats" USING btree ("updated_at");
  CREATE INDEX "cats_created_at_idx" ON "cats" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cats_fk" FOREIGN KEY ("cats_id") REFERENCES "public"."cats"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_cats_id_idx" ON "payload_locked_documents_rels" USING btree ("cats_id");
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "lizards_id";
  DROP TYPE "public"."enum_lizards_species";`)
}
