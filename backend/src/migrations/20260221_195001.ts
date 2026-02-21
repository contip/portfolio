import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "email_config_internal_recipients_secondary_emails" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL
  );
  
  CREATE TABLE "email_config_internal_recipients" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"primary_email" varchar NOT NULL
  );
  
  CREATE TABLE "email_config_client_templates" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"subject" varchar DEFAULT 'Inquiry received: {{serviceNeed}}',
  	"heading" varchar DEFAULT 'Inquiry Received',
  	"intro" varchar DEFAULT 'Thank you for reaching out. Your project request has been received by our consulting team and is now being reviewed for scope, execution model, and delivery risk.',
  	"cta_label" varchar DEFAULT 'Book a Strategy Call',
  	"closing" varchar DEFAULT 'If this request was sent in error, you can safely ignore this message.'
  );
  
  CREATE TABLE "email_config_internal_templates" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"subject" varchar DEFAULT 'New lead: {{companyOrName}}',
  	"heading" varchar DEFAULT 'New Enterprise Lead',
  	"intro" varchar DEFAULT 'This message was generated from a Payload form submission and logged in Generated Emails.',
  	"closing" varchar DEFAULT 'Open admin and review the full rendered copy under Generated Emails.',
  	"include_field_dump" boolean DEFAULT true
  );
  
  CREATE TABLE "email_config" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"from_name" varchar DEFAULT 'Peter T Conti Consulting' NOT NULL,
  	"from_address" varchar DEFAULT 'noreply@email.petertconti.com' NOT NULL,
  	"default_reply_to" varchar,
  	"fallback_internal_email" varchar DEFAULT '',
  	"default_internal_recipient_key" varchar DEFAULT 'sales',
  	"response_s_l_a" varchar DEFAULT '1 business day',
  	"consultation_u_r_l" varchar DEFAULT '',
  	"logo_u_r_l" varchar DEFAULT '',
  	"default_client_template_key" varchar DEFAULT 'consulting-client-standard',
  	"default_internal_template_key" varchar DEFAULT 'consulting-internal-standard',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "generated_emails" ADD COLUMN "template_key" varchar;
  ALTER TABLE "generated_emails" ADD COLUMN "internal_recipient_key" varchar;
  ALTER TABLE "forms" ADD COLUMN "email_workflow_enable_automated_responses" boolean DEFAULT true;
  ALTER TABLE "forms" ADD COLUMN "email_workflow_send_client_acknowledgement" boolean DEFAULT true;
  ALTER TABLE "forms" ADD COLUMN "email_workflow_send_internal_alert" boolean DEFAULT true;
  ALTER TABLE "forms" ADD COLUMN "email_workflow_include_submission_field_dump" boolean DEFAULT true;
  ALTER TABLE "forms" ADD COLUMN "email_workflow_internal_recipient_key" varchar;
  ALTER TABLE "forms" ADD COLUMN "email_workflow_client_template_key" varchar;
  ALTER TABLE "forms" ADD COLUMN "email_workflow_internal_template_key" varchar;
  ALTER TABLE "email_config_internal_recipients_secondary_emails" ADD CONSTRAINT "email_config_internal_recipients_secondary_emails_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."email_config_internal_recipients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "email_config_internal_recipients" ADD CONSTRAINT "email_config_internal_recipients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."email_config"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "email_config_client_templates" ADD CONSTRAINT "email_config_client_templates_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."email_config"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "email_config_internal_templates" ADD CONSTRAINT "email_config_internal_templates_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."email_config"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "email_config_internal_recipients_secondary_emails_order_idx" ON "email_config_internal_recipients_secondary_emails" USING btree ("_order");
  CREATE INDEX "email_config_internal_recipients_secondary_emails_parent_id_idx" ON "email_config_internal_recipients_secondary_emails" USING btree ("_parent_id");
  CREATE INDEX "email_config_internal_recipients_order_idx" ON "email_config_internal_recipients" USING btree ("_order");
  CREATE INDEX "email_config_internal_recipients_parent_id_idx" ON "email_config_internal_recipients" USING btree ("_parent_id");
  CREATE INDEX "email_config_client_templates_order_idx" ON "email_config_client_templates" USING btree ("_order");
  CREATE INDEX "email_config_client_templates_parent_id_idx" ON "email_config_client_templates" USING btree ("_parent_id");
  CREATE INDEX "email_config_internal_templates_order_idx" ON "email_config_internal_templates" USING btree ("_order");
  CREATE INDEX "email_config_internal_templates_parent_id_idx" ON "email_config_internal_templates" USING btree ("_parent_id");
  ALTER TABLE "generated_emails" DROP COLUMN "timeline";
  ALTER TABLE "generated_emails" DROP COLUMN "budget";
  ALTER TABLE "generated_emails" DROP COLUMN "project_summary";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "email_config_internal_recipients_secondary_emails" CASCADE;
  DROP TABLE "email_config_internal_recipients" CASCADE;
  DROP TABLE "email_config_client_templates" CASCADE;
  DROP TABLE "email_config_internal_templates" CASCADE;
  DROP TABLE "email_config" CASCADE;
  ALTER TABLE "generated_emails" ADD COLUMN "timeline" varchar;
  ALTER TABLE "generated_emails" ADD COLUMN "budget" varchar;
  ALTER TABLE "generated_emails" ADD COLUMN "project_summary" varchar;
  ALTER TABLE "generated_emails" DROP COLUMN "template_key";
  ALTER TABLE "generated_emails" DROP COLUMN "internal_recipient_key";
  ALTER TABLE "forms" DROP COLUMN "email_workflow_enable_automated_responses";
  ALTER TABLE "forms" DROP COLUMN "email_workflow_send_client_acknowledgement";
  ALTER TABLE "forms" DROP COLUMN "email_workflow_send_internal_alert";
  ALTER TABLE "forms" DROP COLUMN "email_workflow_include_submission_field_dump";
  ALTER TABLE "forms" DROP COLUMN "email_workflow_internal_recipient_key";
  ALTER TABLE "forms" DROP COLUMN "email_workflow_client_template_key";
  ALTER TABLE "forms" DROP COLUMN "email_workflow_internal_template_key";`)
}
