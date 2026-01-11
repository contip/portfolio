import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_redirects_to_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_redirects_type" AS ENUM('307', '308');
  CREATE TYPE "public"."enum_nav_nav_items_dd_settings_hero_hero_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_nav_nav_items_dd_settings_hero_hero_link_appearance" AS ENUM('default', 'outline');
  ALTER TYPE "public"."enum_pages_hero_links_link_appearance" ADD VALUE 'secondary';
  ALTER TYPE "public"."enum_pages_hero_links_link_appearance" ADD VALUE 'ghost';
  ALTER TYPE "public"."enum_pages_hero_links_link_appearance" ADD VALUE 'link';
  ALTER TYPE "public"."enum__pages_v_version_hero_links_link_appearance" ADD VALUE 'secondary';
  ALTER TYPE "public"."enum__pages_v_version_hero_links_link_appearance" ADD VALUE 'ghost';
  ALTER TYPE "public"."enum__pages_v_version_hero_links_link_appearance" ADD VALUE 'link';
  ALTER TYPE "public"."enum_services_hero_links_link_appearance" ADD VALUE 'secondary';
  ALTER TYPE "public"."enum_services_hero_links_link_appearance" ADD VALUE 'ghost';
  ALTER TYPE "public"."enum_services_hero_links_link_appearance" ADD VALUE 'link';
  ALTER TYPE "public"."enum__services_v_version_hero_links_link_appearance" ADD VALUE 'secondary';
  ALTER TYPE "public"."enum__services_v_version_hero_links_link_appearance" ADD VALUE 'ghost';
  ALTER TYPE "public"."enum__services_v_version_hero_links_link_appearance" ADD VALUE 'link';
  CREATE TABLE "redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" varchar NOT NULL,
  	"to_type" "enum_redirects_to_type" DEFAULT 'reference',
  	"to_url" varchar,
  	"type" "enum_redirects_type" NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer,
  	"categories_id" integer,
  	"lizards_id" integer,
  	"services_id" integer
  );
  
  ALTER TABLE "nav" DROP CONSTRAINT "nav_logo_light_id_media_id_fk";
  
  ALTER TABLE "nav" DROP CONSTRAINT "nav_logo_dark_id_media_id_fk";
  
  DROP INDEX "nav_logo_light_idx";
  DROP INDEX "nav_logo_dark_idx";
  ALTER TABLE "pages" ADD COLUMN "hero_bg_color" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_bg_color" varchar;
  ALTER TABLE "services" ADD COLUMN "hero_bg_color" varchar;
  ALTER TABLE "_services_v" ADD COLUMN "version_hero_bg_color" varchar;
  ALTER TABLE "lizards" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "lizards" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "lizards" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "_lizards_v" ADD COLUMN "version_meta_title" varchar;
  ALTER TABLE "_lizards_v" ADD COLUMN "version_meta_description" varchar;
  ALTER TABLE "_lizards_v" ADD COLUMN "version_meta_image_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "redirects_id" integer;
  ALTER TABLE "nav_nav_items_dd_settings_dd_links" ADD COLUMN "description" varchar;
  ALTER TABLE "nav_nav_items" ADD COLUMN "dd_settings_enable_hero" boolean DEFAULT false;
  ALTER TABLE "nav_nav_items" ADD COLUMN "dd_settings_hero_title" varchar;
  ALTER TABLE "nav_nav_items" ADD COLUMN "dd_settings_hero_description" varchar;
  ALTER TABLE "nav_nav_items" ADD COLUMN "dd_settings_hero_hero_link_type" "enum_nav_nav_items_dd_settings_hero_hero_link_type" DEFAULT 'reference';
  ALTER TABLE "nav_nav_items" ADD COLUMN "dd_settings_hero_hero_link_new_tab" boolean;
  ALTER TABLE "nav_nav_items" ADD COLUMN "dd_settings_hero_hero_link_url" varchar;
  ALTER TABLE "nav_nav_items" ADD COLUMN "dd_settings_hero_hero_link_label" varchar;
  ALTER TABLE "nav_nav_items" ADD COLUMN "dd_settings_hero_hero_link_appearance" "enum_nav_nav_items_dd_settings_hero_hero_link_appearance" DEFAULT 'default';
  ALTER TABLE "nav" ADD COLUMN "logo_id" integer;
  ALTER TABLE "nav" ADD COLUMN "brand_name" varchar DEFAULT 'Conti Digital';
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_lizards_fk" FOREIGN KEY ("lizards_id") REFERENCES "public"."lizards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  CREATE INDEX "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE INDEX "redirects_rels_order_idx" ON "redirects_rels" USING btree ("order");
  CREATE INDEX "redirects_rels_parent_idx" ON "redirects_rels" USING btree ("parent_id");
  CREATE INDEX "redirects_rels_path_idx" ON "redirects_rels" USING btree ("path");
  CREATE INDEX "redirects_rels_pages_id_idx" ON "redirects_rels" USING btree ("pages_id");
  CREATE INDEX "redirects_rels_posts_id_idx" ON "redirects_rels" USING btree ("posts_id");
  CREATE INDEX "redirects_rels_categories_id_idx" ON "redirects_rels" USING btree ("categories_id");
  CREATE INDEX "redirects_rels_lizards_id_idx" ON "redirects_rels" USING btree ("lizards_id");
  CREATE INDEX "redirects_rels_services_id_idx" ON "redirects_rels" USING btree ("services_id");
  ALTER TABLE "lizards" ADD CONSTRAINT "lizards_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_lizards_v" ADD CONSTRAINT "_lizards_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nav" ADD CONSTRAINT "nav_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "lizards_meta_meta_image_idx" ON "lizards" USING btree ("meta_image_id");
  CREATE INDEX "_lizards_v_version_meta_version_meta_image_idx" ON "_lizards_v" USING btree ("version_meta_image_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX "nav_logo_idx" ON "nav" USING btree ("logo_id");
  ALTER TABLE "nav" DROP COLUMN "logo_light_id";
  ALTER TABLE "nav" DROP COLUMN "logo_dark_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "redirects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "redirects_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "redirects_rels" CASCADE;
  ALTER TABLE "lizards" DROP CONSTRAINT "lizards_meta_image_id_media_id_fk";
  
  ALTER TABLE "_lizards_v" DROP CONSTRAINT "_lizards_v_version_meta_image_id_media_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_redirects_fk";
  
  ALTER TABLE "nav" DROP CONSTRAINT "nav_logo_id_media_id_fk";
  
  ALTER TABLE "pages_hero_links" ALTER COLUMN "link_appearance" SET DATA TYPE text;
  ALTER TABLE "pages_hero_links" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::text;
  DROP TYPE "public"."enum_pages_hero_links_link_appearance";
  CREATE TYPE "public"."enum_pages_hero_links_link_appearance" AS ENUM('default', 'outline');
  ALTER TABLE "pages_hero_links" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::"public"."enum_pages_hero_links_link_appearance";
  ALTER TABLE "pages_hero_links" ALTER COLUMN "link_appearance" SET DATA TYPE "public"."enum_pages_hero_links_link_appearance" USING "link_appearance"::"public"."enum_pages_hero_links_link_appearance";
  ALTER TABLE "_pages_v_version_hero_links" ALTER COLUMN "link_appearance" SET DATA TYPE text;
  ALTER TABLE "_pages_v_version_hero_links" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::text;
  DROP TYPE "public"."enum__pages_v_version_hero_links_link_appearance";
  CREATE TYPE "public"."enum__pages_v_version_hero_links_link_appearance" AS ENUM('default', 'outline');
  ALTER TABLE "_pages_v_version_hero_links" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::"public"."enum__pages_v_version_hero_links_link_appearance";
  ALTER TABLE "_pages_v_version_hero_links" ALTER COLUMN "link_appearance" SET DATA TYPE "public"."enum__pages_v_version_hero_links_link_appearance" USING "link_appearance"::"public"."enum__pages_v_version_hero_links_link_appearance";
  ALTER TABLE "services_hero_links" ALTER COLUMN "link_appearance" SET DATA TYPE text;
  ALTER TABLE "services_hero_links" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::text;
  DROP TYPE "public"."enum_services_hero_links_link_appearance";
  CREATE TYPE "public"."enum_services_hero_links_link_appearance" AS ENUM('default', 'outline');
  ALTER TABLE "services_hero_links" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::"public"."enum_services_hero_links_link_appearance";
  ALTER TABLE "services_hero_links" ALTER COLUMN "link_appearance" SET DATA TYPE "public"."enum_services_hero_links_link_appearance" USING "link_appearance"::"public"."enum_services_hero_links_link_appearance";
  ALTER TABLE "_services_v_version_hero_links" ALTER COLUMN "link_appearance" SET DATA TYPE text;
  ALTER TABLE "_services_v_version_hero_links" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::text;
  DROP TYPE "public"."enum__services_v_version_hero_links_link_appearance";
  CREATE TYPE "public"."enum__services_v_version_hero_links_link_appearance" AS ENUM('default', 'outline');
  ALTER TABLE "_services_v_version_hero_links" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::"public"."enum__services_v_version_hero_links_link_appearance";
  ALTER TABLE "_services_v_version_hero_links" ALTER COLUMN "link_appearance" SET DATA TYPE "public"."enum__services_v_version_hero_links_link_appearance" USING "link_appearance"::"public"."enum__services_v_version_hero_links_link_appearance";
  DROP INDEX "lizards_meta_meta_image_idx";
  DROP INDEX "_lizards_v_version_meta_version_meta_image_idx";
  DROP INDEX "payload_locked_documents_rels_redirects_id_idx";
  DROP INDEX "nav_logo_idx";
  ALTER TABLE "nav" ADD COLUMN "logo_light_id" integer;
  ALTER TABLE "nav" ADD COLUMN "logo_dark_id" integer;
  ALTER TABLE "nav" ADD CONSTRAINT "nav_logo_light_id_media_id_fk" FOREIGN KEY ("logo_light_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "nav" ADD CONSTRAINT "nav_logo_dark_id_media_id_fk" FOREIGN KEY ("logo_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "nav_logo_light_idx" ON "nav" USING btree ("logo_light_id");
  CREATE INDEX "nav_logo_dark_idx" ON "nav" USING btree ("logo_dark_id");
  ALTER TABLE "pages" DROP COLUMN "hero_bg_color";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_bg_color";
  ALTER TABLE "services" DROP COLUMN "hero_bg_color";
  ALTER TABLE "_services_v" DROP COLUMN "version_hero_bg_color";
  ALTER TABLE "lizards" DROP COLUMN "meta_title";
  ALTER TABLE "lizards" DROP COLUMN "meta_description";
  ALTER TABLE "lizards" DROP COLUMN "meta_image_id";
  ALTER TABLE "_lizards_v" DROP COLUMN "version_meta_title";
  ALTER TABLE "_lizards_v" DROP COLUMN "version_meta_description";
  ALTER TABLE "_lizards_v" DROP COLUMN "version_meta_image_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "redirects_id";
  ALTER TABLE "nav_nav_items_dd_settings_dd_links" DROP COLUMN "description";
  ALTER TABLE "nav_nav_items" DROP COLUMN "dd_settings_enable_hero";
  ALTER TABLE "nav_nav_items" DROP COLUMN "dd_settings_hero_title";
  ALTER TABLE "nav_nav_items" DROP COLUMN "dd_settings_hero_description";
  ALTER TABLE "nav_nav_items" DROP COLUMN "dd_settings_hero_hero_link_type";
  ALTER TABLE "nav_nav_items" DROP COLUMN "dd_settings_hero_hero_link_new_tab";
  ALTER TABLE "nav_nav_items" DROP COLUMN "dd_settings_hero_hero_link_url";
  ALTER TABLE "nav_nav_items" DROP COLUMN "dd_settings_hero_hero_link_label";
  ALTER TABLE "nav_nav_items" DROP COLUMN "dd_settings_hero_hero_link_appearance";
  ALTER TABLE "nav" DROP COLUMN "logo_id";
  ALTER TABLE "nav" DROP COLUMN "brand_name";
  DROP TYPE "public"."enum_redirects_to_type";
  DROP TYPE "public"."enum_redirects_type";
  DROP TYPE "public"."enum_nav_nav_items_dd_settings_hero_hero_link_type";
  DROP TYPE "public"."enum_nav_nav_items_dd_settings_hero_hero_link_appearance";`)
}
