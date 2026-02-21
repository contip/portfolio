import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_generated_emails_status" AS ENUM('captured', 'queued', 'delegated', 'sent', 'failed');
  CREATE TYPE "public"."enum_generated_emails_delivery_mode" AS ENUM('jobs', 'direct', 'capture');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'sendGeneratedEmail');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'sendGeneratedEmail');
  CREATE TABLE "generated_emails_to" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL
  );
  
  CREATE TABLE "generated_emails_cc" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL
  );
  
  CREATE TABLE "generated_emails_bcc" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL
  );
  
  CREATE TABLE "generated_emails" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"status" "enum_generated_emails_status" DEFAULT 'queued' NOT NULL,
  	"delivery_mode" "enum_generated_emails_delivery_mode" DEFAULT 'jobs' NOT NULL,
  	"form_id" integer,
  	"form_submission_id" integer,
  	"from" varchar NOT NULL,
  	"reply_to" varchar,
  	"subject" varchar NOT NULL,
  	"html" varchar NOT NULL,
  	"provider_message_id" varchar,
  	"sent_at" timestamp(3) with time zone,
  	"error" varchar,
  	"submission_snapshot" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "generated_emails_id" integer;
  ALTER TABLE "generated_emails_to" ADD CONSTRAINT "generated_emails_to_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."generated_emails"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "generated_emails_cc" ADD CONSTRAINT "generated_emails_cc_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."generated_emails"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "generated_emails_bcc" ADD CONSTRAINT "generated_emails_bcc_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."generated_emails"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "generated_emails" ADD CONSTRAINT "generated_emails_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "generated_emails" ADD CONSTRAINT "generated_emails_form_submission_id_form_submissions_id_fk" FOREIGN KEY ("form_submission_id") REFERENCES "public"."form_submissions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "generated_emails_to_order_idx" ON "generated_emails_to" USING btree ("_order");
  CREATE INDEX "generated_emails_to_parent_id_idx" ON "generated_emails_to" USING btree ("_parent_id");
  CREATE INDEX "generated_emails_cc_order_idx" ON "generated_emails_cc" USING btree ("_order");
  CREATE INDEX "generated_emails_cc_parent_id_idx" ON "generated_emails_cc" USING btree ("_parent_id");
  CREATE INDEX "generated_emails_bcc_order_idx" ON "generated_emails_bcc" USING btree ("_order");
  CREATE INDEX "generated_emails_bcc_parent_id_idx" ON "generated_emails_bcc" USING btree ("_parent_id");
  CREATE INDEX "generated_emails_form_idx" ON "generated_emails" USING btree ("form_id");
  CREATE INDEX "generated_emails_form_submission_idx" ON "generated_emails" USING btree ("form_submission_id");
  CREATE INDEX "generated_emails_updated_at_idx" ON "generated_emails" USING btree ("updated_at");
  CREATE INDEX "generated_emails_created_at_idx" ON "generated_emails" USING btree ("created_at");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_generated_emails_fk" FOREIGN KEY ("generated_emails_id") REFERENCES "public"."generated_emails"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_generated_emails_id_idx" ON "payload_locked_documents_rels" USING btree ("generated_emails_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "generated_emails_to" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "generated_emails_cc" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "generated_emails_bcc" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "generated_emails" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_jobs_log" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_jobs" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "generated_emails_to" CASCADE;
  DROP TABLE "generated_emails_cc" CASCADE;
  DROP TABLE "generated_emails_bcc" CASCADE;
  DROP TABLE "generated_emails" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_generated_emails_fk";
  
  DROP INDEX "payload_locked_documents_rels_generated_emails_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "generated_emails_id";
  DROP TYPE "public"."enum_generated_emails_status";
  DROP TYPE "public"."enum_generated_emails_delivery_mode";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";`)
}
