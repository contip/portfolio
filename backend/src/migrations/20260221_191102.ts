import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_generated_emails_recipient_type" AS ENUM('client', 'internal');
  ALTER TABLE "generated_emails" ADD COLUMN "recipient_type" "enum_generated_emails_recipient_type" DEFAULT 'internal' NOT NULL;
  ALTER TABLE "generated_emails" ADD COLUMN "form_title" varchar;
  ALTER TABLE "generated_emails" ADD COLUMN "contact_name" varchar;
  ALTER TABLE "generated_emails" ADD COLUMN "contact_email" varchar;
  ALTER TABLE "generated_emails" ADD COLUMN "company" varchar;
  ALTER TABLE "generated_emails" ADD COLUMN "service_need" varchar;
  ALTER TABLE "generated_emails" ADD COLUMN "timeline" varchar;
  ALTER TABLE "generated_emails" ADD COLUMN "budget" varchar;
  ALTER TABLE "generated_emails" ADD COLUMN "project_summary" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "generated_emails" DROP COLUMN "recipient_type";
  ALTER TABLE "generated_emails" DROP COLUMN "form_title";
  ALTER TABLE "generated_emails" DROP COLUMN "contact_name";
  ALTER TABLE "generated_emails" DROP COLUMN "contact_email";
  ALTER TABLE "generated_emails" DROP COLUMN "company";
  ALTER TABLE "generated_emails" DROP COLUMN "service_need";
  ALTER TABLE "generated_emails" DROP COLUMN "timeline";
  ALTER TABLE "generated_emails" DROP COLUMN "budget";
  ALTER TABLE "generated_emails" DROP COLUMN "project_summary";
  DROP TYPE "public"."enum_generated_emails_recipient_type";`)
}
