import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Add new columns (IF NOT EXISTS for idempotency)
  await db.execute(sql`
    ALTER TABLE "pages_blocks_features_block" ADD COLUMN IF NOT EXISTS "background_color" varchar;
    ALTER TABLE "_pages_v_blocks_features_block" ADD COLUMN IF NOT EXISTS "background_color" varchar;
    ALTER TABLE "posts_blocks_features_block" ADD COLUMN IF NOT EXISTS "background_color" varchar;
    ALTER TABLE "_posts_v_blocks_features_block" ADD COLUMN IF NOT EXISTS "background_color" varchar;
    ALTER TABLE "services_blocks_features_block" ADD COLUMN IF NOT EXISTS "background_color" varchar;
    ALTER TABLE "_services_v_blocks_features_block" ADD COLUMN IF NOT EXISTS "background_color" varchar;
  `)

  // Drop old columns if they exist (they were already dropped in production by CASCADE)
  await db.execute(sql`
    ALTER TABLE "pages_blocks_features_block" DROP COLUMN IF EXISTS "background";
    ALTER TABLE "_pages_v_blocks_features_block" DROP COLUMN IF EXISTS "background";
    ALTER TABLE "posts_blocks_features_block" DROP COLUMN IF EXISTS "background";
    ALTER TABLE "_posts_v_blocks_features_block" DROP COLUMN IF EXISTS "background";
    ALTER TABLE "services_blocks_features_block" DROP COLUMN IF EXISTS "background";
    ALTER TABLE "_services_v_blocks_features_block" DROP COLUMN IF EXISTS "background";
  `)

  // Drop old enum types if they exist
  await db.execute(sql`
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_features_block_background" CASCADE;
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_features_block_background" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_posts_blocks_features_block_background" CASCADE;
    DROP TYPE IF EXISTS "public"."enum__posts_v_blocks_features_block_background" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_services_blocks_features_block_background" CASCADE;
    DROP TYPE IF EXISTS "public"."enum__services_v_blocks_features_block_background" CASCADE;
  `)
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
