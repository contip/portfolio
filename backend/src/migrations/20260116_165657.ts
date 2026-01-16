import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_features_block" ADD COLUMN "background_color" varchar;
  ALTER TABLE "_pages_v_blocks_features_block" ADD COLUMN "background_color" varchar;
  ALTER TABLE "posts_blocks_features_block" ADD COLUMN "background_color" varchar;
  ALTER TABLE "_posts_v_blocks_features_block" ADD COLUMN "background_color" varchar;
  ALTER TABLE "services_blocks_features_block" ADD COLUMN "background_color" varchar;
  ALTER TABLE "_services_v_blocks_features_block" ADD COLUMN "background_color" varchar;
  ALTER TABLE "pages_blocks_features_block" DROP COLUMN "background";
  ALTER TABLE "_pages_v_blocks_features_block" DROP COLUMN "background";
  ALTER TABLE "posts_blocks_features_block" DROP COLUMN "background";
  ALTER TABLE "_posts_v_blocks_features_block" DROP COLUMN "background";
  ALTER TABLE "services_blocks_features_block" DROP COLUMN "background";
  ALTER TABLE "_services_v_blocks_features_block" DROP COLUMN "background";
  DROP TYPE "public"."enum_pages_blocks_features_block_background";
  DROP TYPE "public"."enum__pages_v_blocks_features_block_background";
  DROP TYPE "public"."enum_posts_blocks_features_block_background";
  DROP TYPE "public"."enum__posts_v_blocks_features_block_background";
  DROP TYPE "public"."enum_services_blocks_features_block_background";
  DROP TYPE "public"."enum__services_v_blocks_features_block_background";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_features_block_background" AS ENUM('light', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_features_block_background" AS ENUM('light', 'dark');
  CREATE TYPE "public"."enum_posts_blocks_features_block_background" AS ENUM('light', 'dark');
  CREATE TYPE "public"."enum__posts_v_blocks_features_block_background" AS ENUM('light', 'dark');
  CREATE TYPE "public"."enum_services_blocks_features_block_background" AS ENUM('light', 'dark');
  CREATE TYPE "public"."enum__services_v_blocks_features_block_background" AS ENUM('light', 'dark');
  ALTER TABLE "pages_blocks_features_block" ADD COLUMN "background" "enum_pages_blocks_features_block_background" DEFAULT 'dark';
  ALTER TABLE "_pages_v_blocks_features_block" ADD COLUMN "background" "enum__pages_v_blocks_features_block_background" DEFAULT 'dark';
  ALTER TABLE "posts_blocks_features_block" ADD COLUMN "background" "enum_posts_blocks_features_block_background" DEFAULT 'dark';
  ALTER TABLE "_posts_v_blocks_features_block" ADD COLUMN "background" "enum__posts_v_blocks_features_block_background" DEFAULT 'dark';
  ALTER TABLE "services_blocks_features_block" ADD COLUMN "background" "enum_services_blocks_features_block_background" DEFAULT 'dark';
  ALTER TABLE "_services_v_blocks_features_block" ADD COLUMN "background" "enum__services_v_blocks_features_block_background" DEFAULT 'dark';
  ALTER TABLE "pages_blocks_features_block" DROP COLUMN "background_color";
  ALTER TABLE "_pages_v_blocks_features_block" DROP COLUMN "background_color";
  ALTER TABLE "posts_blocks_features_block" DROP COLUMN "background_color";
  ALTER TABLE "_posts_v_blocks_features_block" DROP COLUMN "background_color";
  ALTER TABLE "services_blocks_features_block" DROP COLUMN "background_color";
  ALTER TABLE "_services_v_blocks_features_block" DROP COLUMN "background_color";`)
}
