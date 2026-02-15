import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_code_language" AS ENUM('typescript', 'javascript', 'css', 'c', 'python');
  CREATE TYPE "public"."enum__pages_v_blocks_code_language" AS ENUM('typescript', 'javascript', 'css', 'c', 'python');
  CREATE TYPE "public"."enum_posts_blocks_code_language" AS ENUM('typescript', 'javascript', 'css', 'c', 'python');
  CREATE TYPE "public"."enum__posts_v_blocks_code_language" AS ENUM('typescript', 'javascript', 'css', 'c', 'python');
  CREATE TYPE "public"."enum_services_blocks_code_language" AS ENUM('typescript', 'javascript', 'css', 'c', 'python');
  CREATE TYPE "public"."enum__services_v_blocks_code_language" AS ENUM('typescript', 'javascript', 'css', 'c', 'python');
  CREATE TYPE "public"."enum_case_studies_hero_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_case_studies_hero_links_link_appearance" AS ENUM('default', 'outline', 'secondary', 'ghost', 'link');
  CREATE TYPE "public"."enum_case_studies_blocks_content_columns_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum_case_studies_blocks_cta_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_case_studies_blocks_cta_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_case_studies_blocks_code_language" AS ENUM('typescript', 'javascript', 'css', 'c', 'python');
  CREATE TYPE "public"."enum_case_studies_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact');
  CREATE TYPE "public"."enum_case_studies_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__case_studies_v_version_hero_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__case_studies_v_version_hero_links_link_appearance" AS ENUM('default', 'outline', 'secondary', 'ghost', 'link');
  CREATE TYPE "public"."enum__case_studies_v_blocks_content_columns_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum__case_studies_v_blocks_cta_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__case_studies_v_blocks_cta_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__case_studies_v_blocks_code_language" AS ENUM('typescript', 'javascript', 'css', 'c', 'python');
  CREATE TYPE "public"."enum__case_studies_v_version_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact');
  CREATE TYPE "public"."enum__case_studies_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "pages_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"link" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_media_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"caption" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_code" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"language" "enum_pages_blocks_code_language" DEFAULT 'typescript',
  	"code" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"link" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_media_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"caption" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_code" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"language" "enum__pages_v_blocks_code_language" DEFAULT 'typescript',
  	"code" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"link" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_media_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"caption" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_code" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"language" "enum_posts_blocks_code_language" DEFAULT 'typescript',
  	"code" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"link" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_media_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"caption" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_code" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"language" "enum__posts_v_blocks_code_language" DEFAULT 'typescript',
  	"code" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"link" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_media_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"caption" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_code" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"language" "enum_services_blocks_code_language" DEFAULT 'typescript',
  	"code" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_services_v_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"link" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_services_v_blocks_media_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"caption" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_services_v_blocks_code" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"language" "enum__services_v_blocks_code_language" DEFAULT 'typescript',
  	"code" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "case_studies_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_case_studies_hero_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_case_studies_hero_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "case_studies_key_results" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "case_studies_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_case_studies_blocks_content_columns_size" DEFAULT 'oneThird',
  	"rich_text" jsonb,
  	"background_color" varchar
  );
  
  CREATE TABLE "case_studies_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "case_studies_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"link_type" "enum_case_studies_blocks_cta_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_case_studies_blocks_cta_link_appearance" DEFAULT 'default',
  	"background_color" varchar,
  	"bg_image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "case_studies_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"enable_intro" boolean,
  	"intro_content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "case_studies_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"link" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "case_studies_blocks_media_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"caption" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "case_studies_blocks_code" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"language" "enum_case_studies_blocks_code_language" DEFAULT 'typescript',
  	"code" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "case_studies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"summary" varchar,
  	"client_name" varchar,
  	"industry" varchar,
  	"engagement_duration" varchar,
  	"hero_image_id" integer,
  	"hero_type" "enum_case_studies_hero_type" DEFAULT 'lowImpact',
  	"hero_rich_text" jsonb,
  	"hero_media_id" integer,
  	"hero_bg_color" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"slug" varchar,
  	"case_study" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_case_studies_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "case_studies_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer,
  	"services_id" integer,
  	"case_studies_id" integer,
  	"categories_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "_case_studies_v_version_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__case_studies_v_version_hero_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__case_studies_v_version_hero_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_case_studies_v_version_key_results" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_case_studies_v_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__case_studies_v_blocks_content_columns_size" DEFAULT 'oneThird',
  	"rich_text" jsonb,
  	"background_color" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_case_studies_v_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_case_studies_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"link_type" "enum__case_studies_v_blocks_cta_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__case_studies_v_blocks_cta_link_appearance" DEFAULT 'default',
  	"background_color" varchar,
  	"bg_image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_case_studies_v_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"enable_intro" boolean,
  	"intro_content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_case_studies_v_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"link" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_case_studies_v_blocks_media_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"caption" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_case_studies_v_blocks_code" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"language" "enum__case_studies_v_blocks_code_language" DEFAULT 'typescript',
  	"code" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_case_studies_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_summary" varchar,
  	"version_client_name" varchar,
  	"version_industry" varchar,
  	"version_engagement_duration" varchar,
  	"version_hero_image_id" integer,
  	"version_hero_type" "enum__case_studies_v_version_hero_type" DEFAULT 'lowImpact',
  	"version_hero_rich_text" jsonb,
  	"version_hero_media_id" integer,
  	"version_hero_bg_color" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_slug" varchar,
  	"version_case_study" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__case_studies_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_case_studies_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer,
  	"services_id" integer,
  	"case_studies_id" integer,
  	"categories_id" integer,
  	"media_id" integer
  );
  
  ALTER TABLE "pages_rels" ADD COLUMN "services_id" integer;
  ALTER TABLE "pages_rels" ADD COLUMN "case_studies_id" integer;
  ALTER TABLE "pages_rels" ADD COLUMN "media_id" integer;
  ALTER TABLE "_pages_v_rels" ADD COLUMN "services_id" integer;
  ALTER TABLE "_pages_v_rels" ADD COLUMN "case_studies_id" integer;
  ALTER TABLE "_pages_v_rels" ADD COLUMN "media_id" integer;
  ALTER TABLE "posts" ADD COLUMN "featured" boolean DEFAULT false;
  ALTER TABLE "posts" ADD COLUMN "featured_rank" numeric;
  ALTER TABLE "posts" ADD COLUMN "reading_time" numeric;
  ALTER TABLE "posts_rels" ADD COLUMN "services_id" integer;
  ALTER TABLE "posts_rels" ADD COLUMN "case_studies_id" integer;
  ALTER TABLE "posts_rels" ADD COLUMN "categories_id" integer;
  ALTER TABLE "posts_rels" ADD COLUMN "media_id" integer;
  ALTER TABLE "_posts_v" ADD COLUMN "version_featured" boolean DEFAULT false;
  ALTER TABLE "_posts_v" ADD COLUMN "version_featured_rank" numeric;
  ALTER TABLE "_posts_v" ADD COLUMN "version_reading_time" numeric;
  ALTER TABLE "_posts_v_rels" ADD COLUMN "services_id" integer;
  ALTER TABLE "_posts_v_rels" ADD COLUMN "case_studies_id" integer;
  ALTER TABLE "_posts_v_rels" ADD COLUMN "categories_id" integer;
  ALTER TABLE "_posts_v_rels" ADD COLUMN "media_id" integer;
  ALTER TABLE "services_rels" ADD COLUMN "services_id" integer;
  ALTER TABLE "services_rels" ADD COLUMN "case_studies_id" integer;
  ALTER TABLE "services_rels" ADD COLUMN "categories_id" integer;
  ALTER TABLE "services_rels" ADD COLUMN "media_id" integer;
  ALTER TABLE "_services_v_rels" ADD COLUMN "services_id" integer;
  ALTER TABLE "_services_v_rels" ADD COLUMN "case_studies_id" integer;
  ALTER TABLE "_services_v_rels" ADD COLUMN "categories_id" integer;
  ALTER TABLE "_services_v_rels" ADD COLUMN "media_id" integer;
  ALTER TABLE "categories" ADD COLUMN "featured" boolean DEFAULT false;
  ALTER TABLE "categories" ADD COLUMN "featured_rank" numeric;
  ALTER TABLE "redirects_rels" ADD COLUMN "case_studies_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "case_studies_id" integer;
  ALTER TABLE "footer_rels" ADD COLUMN "services_id" integer;
  ALTER TABLE "footer_rels" ADD COLUMN "case_studies_id" integer;
  ALTER TABLE "footer_rels" ADD COLUMN "categories_id" integer;
  ALTER TABLE "nav_rels" ADD COLUMN "services_id" integer;
  ALTER TABLE "nav_rels" ADD COLUMN "case_studies_id" integer;
  ALTER TABLE "nav_rels" ADD COLUMN "categories_id" integer;
  ALTER TABLE "pages_blocks_media_block" ADD CONSTRAINT "pages_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_block" ADD CONSTRAINT "pages_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_grid" ADD CONSTRAINT "pages_blocks_media_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_code" ADD CONSTRAINT "pages_blocks_code_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_block" ADD CONSTRAINT "_pages_v_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_block" ADD CONSTRAINT "_pages_v_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_grid" ADD CONSTRAINT "_pages_v_blocks_media_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_code" ADD CONSTRAINT "_pages_v_blocks_code_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_media_block" ADD CONSTRAINT "posts_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_media_block" ADD CONSTRAINT "posts_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_media_grid" ADD CONSTRAINT "posts_blocks_media_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_code" ADD CONSTRAINT "posts_blocks_code_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_media_block" ADD CONSTRAINT "_posts_v_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_media_block" ADD CONSTRAINT "_posts_v_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_media_grid" ADD CONSTRAINT "_posts_v_blocks_media_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_code" ADD CONSTRAINT "_posts_v_blocks_code_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_media_block" ADD CONSTRAINT "services_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_blocks_media_block" ADD CONSTRAINT "services_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_media_grid" ADD CONSTRAINT "services_blocks_media_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_code" ADD CONSTRAINT "services_blocks_code_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_media_block" ADD CONSTRAINT "_services_v_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_media_block" ADD CONSTRAINT "_services_v_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_media_grid" ADD CONSTRAINT "_services_v_blocks_media_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_code" ADD CONSTRAINT "_services_v_blocks_code_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_hero_links" ADD CONSTRAINT "case_studies_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_key_results" ADD CONSTRAINT "case_studies_key_results_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_content_columns" ADD CONSTRAINT "case_studies_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_content" ADD CONSTRAINT "case_studies_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_cta" ADD CONSTRAINT "case_studies_blocks_cta_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_cta" ADD CONSTRAINT "case_studies_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_form_block" ADD CONSTRAINT "case_studies_blocks_form_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_form_block" ADD CONSTRAINT "case_studies_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_media_block" ADD CONSTRAINT "case_studies_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_media_block" ADD CONSTRAINT "case_studies_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_media_grid" ADD CONSTRAINT "case_studies_blocks_media_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_code" ADD CONSTRAINT "case_studies_blocks_code_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_hero_media_id_media_id_fk" FOREIGN KEY ("hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies_rels" ADD CONSTRAINT "case_studies_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_rels" ADD CONSTRAINT "case_studies_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_rels" ADD CONSTRAINT "case_studies_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_rels" ADD CONSTRAINT "case_studies_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_rels" ADD CONSTRAINT "case_studies_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_rels" ADD CONSTRAINT "case_studies_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_rels" ADD CONSTRAINT "case_studies_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_version_hero_links" ADD CONSTRAINT "_case_studies_v_version_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_version_key_results" ADD CONSTRAINT "_case_studies_v_version_key_results_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_blocks_content_columns" ADD CONSTRAINT "_case_studies_v_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_blocks_content" ADD CONSTRAINT "_case_studies_v_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_blocks_cta" ADD CONSTRAINT "_case_studies_v_blocks_cta_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v_blocks_cta" ADD CONSTRAINT "_case_studies_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_blocks_form_block" ADD CONSTRAINT "_case_studies_v_blocks_form_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v_blocks_form_block" ADD CONSTRAINT "_case_studies_v_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_blocks_media_block" ADD CONSTRAINT "_case_studies_v_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v_blocks_media_block" ADD CONSTRAINT "_case_studies_v_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_blocks_media_grid" ADD CONSTRAINT "_case_studies_v_blocks_media_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_blocks_code" ADD CONSTRAINT "_case_studies_v_blocks_code_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v" ADD CONSTRAINT "_case_studies_v_parent_id_case_studies_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."case_studies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v" ADD CONSTRAINT "_case_studies_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v" ADD CONSTRAINT "_case_studies_v_version_hero_media_id_media_id_fk" FOREIGN KEY ("version_hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v" ADD CONSTRAINT "_case_studies_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v_rels" ADD CONSTRAINT "_case_studies_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_rels" ADD CONSTRAINT "_case_studies_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_rels" ADD CONSTRAINT "_case_studies_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_rels" ADD CONSTRAINT "_case_studies_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_rels" ADD CONSTRAINT "_case_studies_v_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_rels" ADD CONSTRAINT "_case_studies_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_rels" ADD CONSTRAINT "_case_studies_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_media_block_order_idx" ON "pages_blocks_media_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_media_block_parent_id_idx" ON "pages_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_media_block_path_idx" ON "pages_blocks_media_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_media_block_media_idx" ON "pages_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "pages_blocks_media_grid_order_idx" ON "pages_blocks_media_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_media_grid_parent_id_idx" ON "pages_blocks_media_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_media_grid_path_idx" ON "pages_blocks_media_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_code_order_idx" ON "pages_blocks_code" USING btree ("_order");
  CREATE INDEX "pages_blocks_code_parent_id_idx" ON "pages_blocks_code" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_code_path_idx" ON "pages_blocks_code" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_media_block_order_idx" ON "_pages_v_blocks_media_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_media_block_parent_id_idx" ON "_pages_v_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_media_block_path_idx" ON "_pages_v_blocks_media_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_media_block_media_idx" ON "_pages_v_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_media_grid_order_idx" ON "_pages_v_blocks_media_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_media_grid_parent_id_idx" ON "_pages_v_blocks_media_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_media_grid_path_idx" ON "_pages_v_blocks_media_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_code_order_idx" ON "_pages_v_blocks_code" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_code_parent_id_idx" ON "_pages_v_blocks_code" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_code_path_idx" ON "_pages_v_blocks_code" USING btree ("_path");
  CREATE INDEX "posts_blocks_media_block_order_idx" ON "posts_blocks_media_block" USING btree ("_order");
  CREATE INDEX "posts_blocks_media_block_parent_id_idx" ON "posts_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_media_block_path_idx" ON "posts_blocks_media_block" USING btree ("_path");
  CREATE INDEX "posts_blocks_media_block_media_idx" ON "posts_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "posts_blocks_media_grid_order_idx" ON "posts_blocks_media_grid" USING btree ("_order");
  CREATE INDEX "posts_blocks_media_grid_parent_id_idx" ON "posts_blocks_media_grid" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_media_grid_path_idx" ON "posts_blocks_media_grid" USING btree ("_path");
  CREATE INDEX "posts_blocks_code_order_idx" ON "posts_blocks_code" USING btree ("_order");
  CREATE INDEX "posts_blocks_code_parent_id_idx" ON "posts_blocks_code" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_code_path_idx" ON "posts_blocks_code" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_media_block_order_idx" ON "_posts_v_blocks_media_block" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_media_block_parent_id_idx" ON "_posts_v_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_media_block_path_idx" ON "_posts_v_blocks_media_block" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_media_block_media_idx" ON "_posts_v_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "_posts_v_blocks_media_grid_order_idx" ON "_posts_v_blocks_media_grid" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_media_grid_parent_id_idx" ON "_posts_v_blocks_media_grid" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_media_grid_path_idx" ON "_posts_v_blocks_media_grid" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_code_order_idx" ON "_posts_v_blocks_code" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_code_parent_id_idx" ON "_posts_v_blocks_code" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_code_path_idx" ON "_posts_v_blocks_code" USING btree ("_path");
  CREATE INDEX "services_blocks_media_block_order_idx" ON "services_blocks_media_block" USING btree ("_order");
  CREATE INDEX "services_blocks_media_block_parent_id_idx" ON "services_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_media_block_path_idx" ON "services_blocks_media_block" USING btree ("_path");
  CREATE INDEX "services_blocks_media_block_media_idx" ON "services_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "services_blocks_media_grid_order_idx" ON "services_blocks_media_grid" USING btree ("_order");
  CREATE INDEX "services_blocks_media_grid_parent_id_idx" ON "services_blocks_media_grid" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_media_grid_path_idx" ON "services_blocks_media_grid" USING btree ("_path");
  CREATE INDEX "services_blocks_code_order_idx" ON "services_blocks_code" USING btree ("_order");
  CREATE INDEX "services_blocks_code_parent_id_idx" ON "services_blocks_code" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_code_path_idx" ON "services_blocks_code" USING btree ("_path");
  CREATE INDEX "_services_v_blocks_media_block_order_idx" ON "_services_v_blocks_media_block" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_media_block_parent_id_idx" ON "_services_v_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_media_block_path_idx" ON "_services_v_blocks_media_block" USING btree ("_path");
  CREATE INDEX "_services_v_blocks_media_block_media_idx" ON "_services_v_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "_services_v_blocks_media_grid_order_idx" ON "_services_v_blocks_media_grid" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_media_grid_parent_id_idx" ON "_services_v_blocks_media_grid" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_media_grid_path_idx" ON "_services_v_blocks_media_grid" USING btree ("_path");
  CREATE INDEX "_services_v_blocks_code_order_idx" ON "_services_v_blocks_code" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_code_parent_id_idx" ON "_services_v_blocks_code" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_code_path_idx" ON "_services_v_blocks_code" USING btree ("_path");
  CREATE INDEX "case_studies_hero_links_order_idx" ON "case_studies_hero_links" USING btree ("_order");
  CREATE INDEX "case_studies_hero_links_parent_id_idx" ON "case_studies_hero_links" USING btree ("_parent_id");
  CREATE INDEX "case_studies_key_results_order_idx" ON "case_studies_key_results" USING btree ("_order");
  CREATE INDEX "case_studies_key_results_parent_id_idx" ON "case_studies_key_results" USING btree ("_parent_id");
  CREATE INDEX "case_studies_blocks_content_columns_order_idx" ON "case_studies_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "case_studies_blocks_content_columns_parent_id_idx" ON "case_studies_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "case_studies_blocks_content_order_idx" ON "case_studies_blocks_content" USING btree ("_order");
  CREATE INDEX "case_studies_blocks_content_parent_id_idx" ON "case_studies_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "case_studies_blocks_content_path_idx" ON "case_studies_blocks_content" USING btree ("_path");
  CREATE INDEX "case_studies_blocks_cta_order_idx" ON "case_studies_blocks_cta" USING btree ("_order");
  CREATE INDEX "case_studies_blocks_cta_parent_id_idx" ON "case_studies_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "case_studies_blocks_cta_path_idx" ON "case_studies_blocks_cta" USING btree ("_path");
  CREATE INDEX "case_studies_blocks_cta_bg_image_idx" ON "case_studies_blocks_cta" USING btree ("bg_image_id");
  CREATE INDEX "case_studies_blocks_form_block_order_idx" ON "case_studies_blocks_form_block" USING btree ("_order");
  CREATE INDEX "case_studies_blocks_form_block_parent_id_idx" ON "case_studies_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX "case_studies_blocks_form_block_path_idx" ON "case_studies_blocks_form_block" USING btree ("_path");
  CREATE INDEX "case_studies_blocks_form_block_form_idx" ON "case_studies_blocks_form_block" USING btree ("form_id");
  CREATE INDEX "case_studies_blocks_media_block_order_idx" ON "case_studies_blocks_media_block" USING btree ("_order");
  CREATE INDEX "case_studies_blocks_media_block_parent_id_idx" ON "case_studies_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "case_studies_blocks_media_block_path_idx" ON "case_studies_blocks_media_block" USING btree ("_path");
  CREATE INDEX "case_studies_blocks_media_block_media_idx" ON "case_studies_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "case_studies_blocks_media_grid_order_idx" ON "case_studies_blocks_media_grid" USING btree ("_order");
  CREATE INDEX "case_studies_blocks_media_grid_parent_id_idx" ON "case_studies_blocks_media_grid" USING btree ("_parent_id");
  CREATE INDEX "case_studies_blocks_media_grid_path_idx" ON "case_studies_blocks_media_grid" USING btree ("_path");
  CREATE INDEX "case_studies_blocks_code_order_idx" ON "case_studies_blocks_code" USING btree ("_order");
  CREATE INDEX "case_studies_blocks_code_parent_id_idx" ON "case_studies_blocks_code" USING btree ("_parent_id");
  CREATE INDEX "case_studies_blocks_code_path_idx" ON "case_studies_blocks_code" USING btree ("_path");
  CREATE INDEX "case_studies_hero_image_idx" ON "case_studies" USING btree ("hero_image_id");
  CREATE INDEX "case_studies_hero_hero_media_idx" ON "case_studies" USING btree ("hero_media_id");
  CREATE INDEX "case_studies_meta_meta_image_idx" ON "case_studies" USING btree ("meta_image_id");
  CREATE INDEX "case_studies_slug_idx" ON "case_studies" USING btree ("slug");
  CREATE INDEX "case_studies_updated_at_idx" ON "case_studies" USING btree ("updated_at");
  CREATE INDEX "case_studies_created_at_idx" ON "case_studies" USING btree ("created_at");
  CREATE INDEX "case_studies__status_idx" ON "case_studies" USING btree ("_status");
  CREATE INDEX "case_studies_rels_order_idx" ON "case_studies_rels" USING btree ("order");
  CREATE INDEX "case_studies_rels_parent_idx" ON "case_studies_rels" USING btree ("parent_id");
  CREATE INDEX "case_studies_rels_path_idx" ON "case_studies_rels" USING btree ("path");
  CREATE INDEX "case_studies_rels_pages_id_idx" ON "case_studies_rels" USING btree ("pages_id");
  CREATE INDEX "case_studies_rels_posts_id_idx" ON "case_studies_rels" USING btree ("posts_id");
  CREATE INDEX "case_studies_rels_services_id_idx" ON "case_studies_rels" USING btree ("services_id");
  CREATE INDEX "case_studies_rels_case_studies_id_idx" ON "case_studies_rels" USING btree ("case_studies_id");
  CREATE INDEX "case_studies_rels_categories_id_idx" ON "case_studies_rels" USING btree ("categories_id");
  CREATE INDEX "case_studies_rels_media_id_idx" ON "case_studies_rels" USING btree ("media_id");
  CREATE INDEX "_case_studies_v_version_hero_links_order_idx" ON "_case_studies_v_version_hero_links" USING btree ("_order");
  CREATE INDEX "_case_studies_v_version_hero_links_parent_id_idx" ON "_case_studies_v_version_hero_links" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_version_key_results_order_idx" ON "_case_studies_v_version_key_results" USING btree ("_order");
  CREATE INDEX "_case_studies_v_version_key_results_parent_id_idx" ON "_case_studies_v_version_key_results" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_blocks_content_columns_order_idx" ON "_case_studies_v_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "_case_studies_v_blocks_content_columns_parent_id_idx" ON "_case_studies_v_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_blocks_content_order_idx" ON "_case_studies_v_blocks_content" USING btree ("_order");
  CREATE INDEX "_case_studies_v_blocks_content_parent_id_idx" ON "_case_studies_v_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_blocks_content_path_idx" ON "_case_studies_v_blocks_content" USING btree ("_path");
  CREATE INDEX "_case_studies_v_blocks_cta_order_idx" ON "_case_studies_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_case_studies_v_blocks_cta_parent_id_idx" ON "_case_studies_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_blocks_cta_path_idx" ON "_case_studies_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_case_studies_v_blocks_cta_bg_image_idx" ON "_case_studies_v_blocks_cta" USING btree ("bg_image_id");
  CREATE INDEX "_case_studies_v_blocks_form_block_order_idx" ON "_case_studies_v_blocks_form_block" USING btree ("_order");
  CREATE INDEX "_case_studies_v_blocks_form_block_parent_id_idx" ON "_case_studies_v_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_blocks_form_block_path_idx" ON "_case_studies_v_blocks_form_block" USING btree ("_path");
  CREATE INDEX "_case_studies_v_blocks_form_block_form_idx" ON "_case_studies_v_blocks_form_block" USING btree ("form_id");
  CREATE INDEX "_case_studies_v_blocks_media_block_order_idx" ON "_case_studies_v_blocks_media_block" USING btree ("_order");
  CREATE INDEX "_case_studies_v_blocks_media_block_parent_id_idx" ON "_case_studies_v_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_blocks_media_block_path_idx" ON "_case_studies_v_blocks_media_block" USING btree ("_path");
  CREATE INDEX "_case_studies_v_blocks_media_block_media_idx" ON "_case_studies_v_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "_case_studies_v_blocks_media_grid_order_idx" ON "_case_studies_v_blocks_media_grid" USING btree ("_order");
  CREATE INDEX "_case_studies_v_blocks_media_grid_parent_id_idx" ON "_case_studies_v_blocks_media_grid" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_blocks_media_grid_path_idx" ON "_case_studies_v_blocks_media_grid" USING btree ("_path");
  CREATE INDEX "_case_studies_v_blocks_code_order_idx" ON "_case_studies_v_blocks_code" USING btree ("_order");
  CREATE INDEX "_case_studies_v_blocks_code_parent_id_idx" ON "_case_studies_v_blocks_code" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_blocks_code_path_idx" ON "_case_studies_v_blocks_code" USING btree ("_path");
  CREATE INDEX "_case_studies_v_parent_idx" ON "_case_studies_v" USING btree ("parent_id");
  CREATE INDEX "_case_studies_v_version_version_hero_image_idx" ON "_case_studies_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_case_studies_v_version_hero_version_hero_media_idx" ON "_case_studies_v" USING btree ("version_hero_media_id");
  CREATE INDEX "_case_studies_v_version_meta_version_meta_image_idx" ON "_case_studies_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_case_studies_v_version_version_slug_idx" ON "_case_studies_v" USING btree ("version_slug");
  CREATE INDEX "_case_studies_v_version_version_updated_at_idx" ON "_case_studies_v" USING btree ("version_updated_at");
  CREATE INDEX "_case_studies_v_version_version_created_at_idx" ON "_case_studies_v" USING btree ("version_created_at");
  CREATE INDEX "_case_studies_v_version_version__status_idx" ON "_case_studies_v" USING btree ("version__status");
  CREATE INDEX "_case_studies_v_created_at_idx" ON "_case_studies_v" USING btree ("created_at");
  CREATE INDEX "_case_studies_v_updated_at_idx" ON "_case_studies_v" USING btree ("updated_at");
  CREATE INDEX "_case_studies_v_latest_idx" ON "_case_studies_v" USING btree ("latest");
  CREATE INDEX "_case_studies_v_rels_order_idx" ON "_case_studies_v_rels" USING btree ("order");
  CREATE INDEX "_case_studies_v_rels_parent_idx" ON "_case_studies_v_rels" USING btree ("parent_id");
  CREATE INDEX "_case_studies_v_rels_path_idx" ON "_case_studies_v_rels" USING btree ("path");
  CREATE INDEX "_case_studies_v_rels_pages_id_idx" ON "_case_studies_v_rels" USING btree ("pages_id");
  CREATE INDEX "_case_studies_v_rels_posts_id_idx" ON "_case_studies_v_rels" USING btree ("posts_id");
  CREATE INDEX "_case_studies_v_rels_services_id_idx" ON "_case_studies_v_rels" USING btree ("services_id");
  CREATE INDEX "_case_studies_v_rels_case_studies_id_idx" ON "_case_studies_v_rels" USING btree ("case_studies_id");
  CREATE INDEX "_case_studies_v_rels_categories_id_idx" ON "_case_studies_v_rels" USING btree ("categories_id");
  CREATE INDEX "_case_studies_v_rels_media_id_idx" ON "_case_studies_v_rels" USING btree ("media_id");
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_rels" ADD CONSTRAINT "_services_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_rels" ADD CONSTRAINT "_services_v_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_rels" ADD CONSTRAINT "_services_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_rels" ADD CONSTRAINT "_services_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nav_rels" ADD CONSTRAINT "nav_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nav_rels" ADD CONSTRAINT "nav_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nav_rels" ADD CONSTRAINT "nav_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_rels_services_id_idx" ON "pages_rels" USING btree ("services_id");
  CREATE INDEX "pages_rels_case_studies_id_idx" ON "pages_rels" USING btree ("case_studies_id");
  CREATE INDEX "pages_rels_media_id_idx" ON "pages_rels" USING btree ("media_id");
  CREATE INDEX "_pages_v_rels_services_id_idx" ON "_pages_v_rels" USING btree ("services_id");
  CREATE INDEX "_pages_v_rels_case_studies_id_idx" ON "_pages_v_rels" USING btree ("case_studies_id");
  CREATE INDEX "_pages_v_rels_media_id_idx" ON "_pages_v_rels" USING btree ("media_id");
  CREATE INDEX "posts_rels_services_id_idx" ON "posts_rels" USING btree ("services_id");
  CREATE INDEX "posts_rels_case_studies_id_idx" ON "posts_rels" USING btree ("case_studies_id");
  CREATE INDEX "posts_rels_categories_id_idx" ON "posts_rels" USING btree ("categories_id");
  CREATE INDEX "posts_rels_media_id_idx" ON "posts_rels" USING btree ("media_id");
  CREATE INDEX "_posts_v_rels_services_id_idx" ON "_posts_v_rels" USING btree ("services_id");
  CREATE INDEX "_posts_v_rels_case_studies_id_idx" ON "_posts_v_rels" USING btree ("case_studies_id");
  CREATE INDEX "_posts_v_rels_categories_id_idx" ON "_posts_v_rels" USING btree ("categories_id");
  CREATE INDEX "_posts_v_rels_media_id_idx" ON "_posts_v_rels" USING btree ("media_id");
  CREATE INDEX "services_rels_services_id_idx" ON "services_rels" USING btree ("services_id");
  CREATE INDEX "services_rels_case_studies_id_idx" ON "services_rels" USING btree ("case_studies_id");
  CREATE INDEX "services_rels_categories_id_idx" ON "services_rels" USING btree ("categories_id");
  CREATE INDEX "services_rels_media_id_idx" ON "services_rels" USING btree ("media_id");
  CREATE INDEX "_services_v_rels_services_id_idx" ON "_services_v_rels" USING btree ("services_id");
  CREATE INDEX "_services_v_rels_case_studies_id_idx" ON "_services_v_rels" USING btree ("case_studies_id");
  CREATE INDEX "_services_v_rels_categories_id_idx" ON "_services_v_rels" USING btree ("categories_id");
  CREATE INDEX "_services_v_rels_media_id_idx" ON "_services_v_rels" USING btree ("media_id");
  CREATE INDEX "redirects_rels_case_studies_id_idx" ON "redirects_rels" USING btree ("case_studies_id");
  CREATE INDEX "payload_locked_documents_rels_case_studies_id_idx" ON "payload_locked_documents_rels" USING btree ("case_studies_id");
  CREATE INDEX "footer_rels_services_id_idx" ON "footer_rels" USING btree ("services_id");
  CREATE INDEX "footer_rels_case_studies_id_idx" ON "footer_rels" USING btree ("case_studies_id");
  CREATE INDEX "footer_rels_categories_id_idx" ON "footer_rels" USING btree ("categories_id");
  CREATE INDEX "nav_rels_services_id_idx" ON "nav_rels" USING btree ("services_id");
  CREATE INDEX "nav_rels_case_studies_id_idx" ON "nav_rels" USING btree ("case_studies_id");
  CREATE INDEX "nav_rels_categories_id_idx" ON "nav_rels" USING btree ("categories_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_media_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_media_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_code" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_media_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_media_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_code" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_media_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_media_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_code" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_media_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_media_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_code" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_media_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_media_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_code" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_media_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_media_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_code" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_hero_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_key_results" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_content_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_content" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_cta" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_form_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_media_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_media_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_code" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_version_hero_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_version_key_results" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_content_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_content" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_cta" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_form_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_media_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_media_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_code" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_media_block" CASCADE;
  DROP TABLE "pages_blocks_media_grid" CASCADE;
  DROP TABLE "pages_blocks_code" CASCADE;
  DROP TABLE "_pages_v_blocks_media_block" CASCADE;
  DROP TABLE "_pages_v_blocks_media_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_code" CASCADE;
  DROP TABLE "posts_blocks_media_block" CASCADE;
  DROP TABLE "posts_blocks_media_grid" CASCADE;
  DROP TABLE "posts_blocks_code" CASCADE;
  DROP TABLE "_posts_v_blocks_media_block" CASCADE;
  DROP TABLE "_posts_v_blocks_media_grid" CASCADE;
  DROP TABLE "_posts_v_blocks_code" CASCADE;
  DROP TABLE "services_blocks_media_block" CASCADE;
  DROP TABLE "services_blocks_media_grid" CASCADE;
  DROP TABLE "services_blocks_code" CASCADE;
  DROP TABLE "_services_v_blocks_media_block" CASCADE;
  DROP TABLE "_services_v_blocks_media_grid" CASCADE;
  DROP TABLE "_services_v_blocks_code" CASCADE;
  DROP TABLE "case_studies_hero_links" CASCADE;
  DROP TABLE "case_studies_key_results" CASCADE;
  DROP TABLE "case_studies_blocks_content_columns" CASCADE;
  DROP TABLE "case_studies_blocks_content" CASCADE;
  DROP TABLE "case_studies_blocks_cta" CASCADE;
  DROP TABLE "case_studies_blocks_form_block" CASCADE;
  DROP TABLE "case_studies_blocks_media_block" CASCADE;
  DROP TABLE "case_studies_blocks_media_grid" CASCADE;
  DROP TABLE "case_studies_blocks_code" CASCADE;
  DROP TABLE "case_studies" CASCADE;
  DROP TABLE "case_studies_rels" CASCADE;
  DROP TABLE "_case_studies_v_version_hero_links" CASCADE;
  DROP TABLE "_case_studies_v_version_key_results" CASCADE;
  DROP TABLE "_case_studies_v_blocks_content_columns" CASCADE;
  DROP TABLE "_case_studies_v_blocks_content" CASCADE;
  DROP TABLE "_case_studies_v_blocks_cta" CASCADE;
  DROP TABLE "_case_studies_v_blocks_form_block" CASCADE;
  DROP TABLE "_case_studies_v_blocks_media_block" CASCADE;
  DROP TABLE "_case_studies_v_blocks_media_grid" CASCADE;
  DROP TABLE "_case_studies_v_blocks_code" CASCADE;
  DROP TABLE "_case_studies_v" CASCADE;
  DROP TABLE "_case_studies_v_rels" CASCADE;
  ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_services_fk";
  
  ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_case_studies_fk";
  
  ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_media_fk";
  
  ALTER TABLE "_pages_v_rels" DROP CONSTRAINT "_pages_v_rels_services_fk";
  
  ALTER TABLE "_pages_v_rels" DROP CONSTRAINT "_pages_v_rels_case_studies_fk";
  
  ALTER TABLE "_pages_v_rels" DROP CONSTRAINT "_pages_v_rels_media_fk";
  
  ALTER TABLE "posts_rels" DROP CONSTRAINT "posts_rels_services_fk";
  
  ALTER TABLE "posts_rels" DROP CONSTRAINT "posts_rels_case_studies_fk";
  
  ALTER TABLE "posts_rels" DROP CONSTRAINT "posts_rels_categories_fk";
  
  ALTER TABLE "posts_rels" DROP CONSTRAINT "posts_rels_media_fk";
  
  ALTER TABLE "_posts_v_rels" DROP CONSTRAINT "_posts_v_rels_services_fk";
  
  ALTER TABLE "_posts_v_rels" DROP CONSTRAINT "_posts_v_rels_case_studies_fk";
  
  ALTER TABLE "_posts_v_rels" DROP CONSTRAINT "_posts_v_rels_categories_fk";
  
  ALTER TABLE "_posts_v_rels" DROP CONSTRAINT "_posts_v_rels_media_fk";
  
  ALTER TABLE "services_rels" DROP CONSTRAINT "services_rels_services_fk";
  
  ALTER TABLE "services_rels" DROP CONSTRAINT "services_rels_case_studies_fk";
  
  ALTER TABLE "services_rels" DROP CONSTRAINT "services_rels_categories_fk";
  
  ALTER TABLE "services_rels" DROP CONSTRAINT "services_rels_media_fk";
  
  ALTER TABLE "_services_v_rels" DROP CONSTRAINT "_services_v_rels_services_fk";
  
  ALTER TABLE "_services_v_rels" DROP CONSTRAINT "_services_v_rels_case_studies_fk";
  
  ALTER TABLE "_services_v_rels" DROP CONSTRAINT "_services_v_rels_categories_fk";
  
  ALTER TABLE "_services_v_rels" DROP CONSTRAINT "_services_v_rels_media_fk";
  
  ALTER TABLE "redirects_rels" DROP CONSTRAINT "redirects_rels_case_studies_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_case_studies_fk";
  
  ALTER TABLE "footer_rels" DROP CONSTRAINT "footer_rels_services_fk";
  
  ALTER TABLE "footer_rels" DROP CONSTRAINT "footer_rels_case_studies_fk";
  
  ALTER TABLE "footer_rels" DROP CONSTRAINT "footer_rels_categories_fk";
  
  ALTER TABLE "nav_rels" DROP CONSTRAINT "nav_rels_services_fk";
  
  ALTER TABLE "nav_rels" DROP CONSTRAINT "nav_rels_case_studies_fk";
  
  ALTER TABLE "nav_rels" DROP CONSTRAINT "nav_rels_categories_fk";
  
  DROP INDEX "pages_rels_services_id_idx";
  DROP INDEX "pages_rels_case_studies_id_idx";
  DROP INDEX "pages_rels_media_id_idx";
  DROP INDEX "_pages_v_rels_services_id_idx";
  DROP INDEX "_pages_v_rels_case_studies_id_idx";
  DROP INDEX "_pages_v_rels_media_id_idx";
  DROP INDEX "posts_rels_services_id_idx";
  DROP INDEX "posts_rels_case_studies_id_idx";
  DROP INDEX "posts_rels_categories_id_idx";
  DROP INDEX "posts_rels_media_id_idx";
  DROP INDEX "_posts_v_rels_services_id_idx";
  DROP INDEX "_posts_v_rels_case_studies_id_idx";
  DROP INDEX "_posts_v_rels_categories_id_idx";
  DROP INDEX "_posts_v_rels_media_id_idx";
  DROP INDEX "services_rels_services_id_idx";
  DROP INDEX "services_rels_case_studies_id_idx";
  DROP INDEX "services_rels_categories_id_idx";
  DROP INDEX "services_rels_media_id_idx";
  DROP INDEX "_services_v_rels_services_id_idx";
  DROP INDEX "_services_v_rels_case_studies_id_idx";
  DROP INDEX "_services_v_rels_categories_id_idx";
  DROP INDEX "_services_v_rels_media_id_idx";
  DROP INDEX "redirects_rels_case_studies_id_idx";
  DROP INDEX "payload_locked_documents_rels_case_studies_id_idx";
  DROP INDEX "footer_rels_services_id_idx";
  DROP INDEX "footer_rels_case_studies_id_idx";
  DROP INDEX "footer_rels_categories_id_idx";
  DROP INDEX "nav_rels_services_id_idx";
  DROP INDEX "nav_rels_case_studies_id_idx";
  DROP INDEX "nav_rels_categories_id_idx";
  ALTER TABLE "pages_rels" DROP COLUMN "services_id";
  ALTER TABLE "pages_rels" DROP COLUMN "case_studies_id";
  ALTER TABLE "pages_rels" DROP COLUMN "media_id";
  ALTER TABLE "_pages_v_rels" DROP COLUMN "services_id";
  ALTER TABLE "_pages_v_rels" DROP COLUMN "case_studies_id";
  ALTER TABLE "_pages_v_rels" DROP COLUMN "media_id";
  ALTER TABLE "posts" DROP COLUMN "featured";
  ALTER TABLE "posts" DROP COLUMN "featured_rank";
  ALTER TABLE "posts" DROP COLUMN "reading_time";
  ALTER TABLE "posts_rels" DROP COLUMN "services_id";
  ALTER TABLE "posts_rels" DROP COLUMN "case_studies_id";
  ALTER TABLE "posts_rels" DROP COLUMN "categories_id";
  ALTER TABLE "posts_rels" DROP COLUMN "media_id";
  ALTER TABLE "_posts_v" DROP COLUMN "version_featured";
  ALTER TABLE "_posts_v" DROP COLUMN "version_featured_rank";
  ALTER TABLE "_posts_v" DROP COLUMN "version_reading_time";
  ALTER TABLE "_posts_v_rels" DROP COLUMN "services_id";
  ALTER TABLE "_posts_v_rels" DROP COLUMN "case_studies_id";
  ALTER TABLE "_posts_v_rels" DROP COLUMN "categories_id";
  ALTER TABLE "_posts_v_rels" DROP COLUMN "media_id";
  ALTER TABLE "services_rels" DROP COLUMN "services_id";
  ALTER TABLE "services_rels" DROP COLUMN "case_studies_id";
  ALTER TABLE "services_rels" DROP COLUMN "categories_id";
  ALTER TABLE "services_rels" DROP COLUMN "media_id";
  ALTER TABLE "_services_v_rels" DROP COLUMN "services_id";
  ALTER TABLE "_services_v_rels" DROP COLUMN "case_studies_id";
  ALTER TABLE "_services_v_rels" DROP COLUMN "categories_id";
  ALTER TABLE "_services_v_rels" DROP COLUMN "media_id";
  ALTER TABLE "categories" DROP COLUMN "featured";
  ALTER TABLE "categories" DROP COLUMN "featured_rank";
  ALTER TABLE "redirects_rels" DROP COLUMN "case_studies_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "case_studies_id";
  ALTER TABLE "footer_rels" DROP COLUMN "services_id";
  ALTER TABLE "footer_rels" DROP COLUMN "case_studies_id";
  ALTER TABLE "footer_rels" DROP COLUMN "categories_id";
  ALTER TABLE "nav_rels" DROP COLUMN "services_id";
  ALTER TABLE "nav_rels" DROP COLUMN "case_studies_id";
  ALTER TABLE "nav_rels" DROP COLUMN "categories_id";
  DROP TYPE "public"."enum_pages_blocks_code_language";
  DROP TYPE "public"."enum__pages_v_blocks_code_language";
  DROP TYPE "public"."enum_posts_blocks_code_language";
  DROP TYPE "public"."enum__posts_v_blocks_code_language";
  DROP TYPE "public"."enum_services_blocks_code_language";
  DROP TYPE "public"."enum__services_v_blocks_code_language";
  DROP TYPE "public"."enum_case_studies_hero_links_link_type";
  DROP TYPE "public"."enum_case_studies_hero_links_link_appearance";
  DROP TYPE "public"."enum_case_studies_blocks_content_columns_size";
  DROP TYPE "public"."enum_case_studies_blocks_cta_link_type";
  DROP TYPE "public"."enum_case_studies_blocks_cta_link_appearance";
  DROP TYPE "public"."enum_case_studies_blocks_code_language";
  DROP TYPE "public"."enum_case_studies_hero_type";
  DROP TYPE "public"."enum_case_studies_status";
  DROP TYPE "public"."enum__case_studies_v_version_hero_links_link_type";
  DROP TYPE "public"."enum__case_studies_v_version_hero_links_link_appearance";
  DROP TYPE "public"."enum__case_studies_v_blocks_content_columns_size";
  DROP TYPE "public"."enum__case_studies_v_blocks_cta_link_type";
  DROP TYPE "public"."enum__case_studies_v_blocks_cta_link_appearance";
  DROP TYPE "public"."enum__case_studies_v_blocks_code_language";
  DROP TYPE "public"."enum__case_studies_v_version_hero_type";
  DROP TYPE "public"."enum__case_studies_v_version_status";`)
}
