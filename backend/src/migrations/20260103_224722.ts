import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_lizards_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__lizards_v_version_species" AS ENUM('sagrei', 'baracoa', 'barbatus');
  CREATE TYPE "public"."enum__lizards_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "_lizards_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_species" "enum__lizards_v_version_species",
  	"version_age" numeric,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__lizards_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_lizards_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  ALTER TABLE "lizards" ALTER COLUMN "name" DROP NOT NULL;
  ALTER TABLE "lizards" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "lizards" ADD COLUMN "_status" "enum_lizards_status" DEFAULT 'draft';
  ALTER TABLE "_lizards_v" ADD CONSTRAINT "_lizards_v_parent_id_lizards_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."lizards"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_lizards_v" ADD CONSTRAINT "_lizards_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_lizards_v_rels" ADD CONSTRAINT "_lizards_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_lizards_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_lizards_v_rels" ADD CONSTRAINT "_lizards_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "_lizards_v_parent_idx" ON "_lizards_v" USING btree ("parent_id");
  CREATE INDEX "_lizards_v_version_version_slug_idx" ON "_lizards_v" USING btree ("version_slug");
  CREATE INDEX "_lizards_v_version_version_image_idx" ON "_lizards_v" USING btree ("version_image_id");
  CREATE INDEX "_lizards_v_version_version_updated_at_idx" ON "_lizards_v" USING btree ("version_updated_at");
  CREATE INDEX "_lizards_v_version_version_created_at_idx" ON "_lizards_v" USING btree ("version_created_at");
  CREATE INDEX "_lizards_v_version_version__status_idx" ON "_lizards_v" USING btree ("version__status");
  CREATE INDEX "_lizards_v_created_at_idx" ON "_lizards_v" USING btree ("created_at");
  CREATE INDEX "_lizards_v_updated_at_idx" ON "_lizards_v" USING btree ("updated_at");
  CREATE INDEX "_lizards_v_latest_idx" ON "_lizards_v" USING btree ("latest");
  CREATE INDEX "_lizards_v_rels_order_idx" ON "_lizards_v_rels" USING btree ("order");
  CREATE INDEX "_lizards_v_rels_parent_idx" ON "_lizards_v_rels" USING btree ("parent_id");
  CREATE INDEX "_lizards_v_rels_path_idx" ON "_lizards_v_rels" USING btree ("path");
  CREATE INDEX "_lizards_v_rels_media_id_idx" ON "_lizards_v_rels" USING btree ("media_id");
  CREATE INDEX "lizards__status_idx" ON "lizards" USING btree ("_status");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "_lizards_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_lizards_v_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "_lizards_v" CASCADE;
  DROP TABLE "_lizards_v_rels" CASCADE;
  DROP INDEX "lizards__status_idx";
  ALTER TABLE "lizards" ALTER COLUMN "name" SET NOT NULL;
  ALTER TABLE "lizards" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "lizards" DROP COLUMN "_status";
  DROP TYPE "public"."enum_lizards_status";
  DROP TYPE "public"."enum__lizards_v_version_species";
  DROP TYPE "public"."enum__lizards_v_version_status";`)
}
