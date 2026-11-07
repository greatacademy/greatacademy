CREATE TABLE "admin_log" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "admin_log_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"actor" text NOT NULL,
	"action" text NOT NULL,
	"target" text DEFAULT '' NOT NULL,
	"detail" text DEFAULT '' NOT NULL,
	"at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_provider" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"kind" text NOT NULL,
	"api" text NOT NULL,
	"base_url" text DEFAULT '' NOT NULL,
	"region" text DEFAULT '' NOT NULL,
	"key_cipher" text,
	"key_hint" text,
	"enabled" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "ai_provider_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "ai_route" (
	"criterion" text NOT NULL,
	"position" text NOT NULL,
	"provider_id" uuid NOT NULL,
	"model" text NOT NULL,
	"prompt_version" text NOT NULL,
	"live" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "ai_route_criterion_position_pk" PRIMARY KEY("criterion","position")
);
--> statement-breakpoint
CREATE TABLE "calibration" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"criterion" text NOT NULL,
	"provider_id" uuid NOT NULL,
	"model" text NOT NULL,
	"prompt_version" text NOT NULL,
	"kappa" real NOT NULL,
	"human_kappa" real NOT NULL,
	"passed" boolean NOT NULL,
	"at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "consent" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"learner_id" uuid NOT NULL,
	"scope" text NOT NULL,
	"granted_by" text,
	"role" text NOT NULL,
	"method" text NOT NULL,
	"notice_version" text NOT NULL,
	"country" text NOT NULL,
	"assent_at" timestamp with time zone,
	"granted_at" timestamp with time zone NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"reminded_at" timestamp with time zone,
	"withdrawn_at" timestamp with time zone,
	"withdrawn_by" text
);
--> statement-breakpoint
CREATE TABLE "guardian_verification" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"method" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"form_key" text,
	"form_type" text,
	"submitted_at" timestamp with time zone NOT NULL,
	"decided_at" timestamp with time zone,
	"decided_by" text,
	"reason" text
);
--> statement-breakpoint
CREATE TABLE "market_launch" (
	"country" text PRIMARY KEY NOT NULL,
	"minors_open" boolean DEFAULT false NOT NULL,
	"signed_off_by" text,
	"signed_off_on" text,
	"language_gap_accepted" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"updated_by" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notice" (
	"version" text PRIMARY KEY NOT NULL,
	"vendors" uuid[] DEFAULT '{}'::uuid[] NOT NULL,
	"published_at" timestamp with time zone NOT NULL,
	"published_by" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "platform_admin" (
	"user_id" text PRIMARY KEY NOT NULL,
	"granted_at" timestamp with time zone NOT NULL,
	"granted_by" text
);
--> statement-breakpoint
CREATE TABLE "vendor_check" (
	"provider_id" uuid NOT NULL,
	"country" text NOT NULL,
	"serves_market" boolean NOT NULL,
	"minors_allowed" boolean NOT NULL,
	"no_training" boolean NOT NULL,
	"short_retention" boolean NOT NULL,
	"processing_agreement" boolean NOT NULL,
	"transfer_mechanism" boolean NOT NULL,
	"region" text DEFAULT '' NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"checked_at" timestamp with time zone NOT NULL,
	"checked_by" text NOT NULL,
	CONSTRAINT "vendor_check_provider_id_country_pk" PRIMARY KEY("provider_id","country")
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "username" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "display_username" text;--> statement-breakpoint
ALTER TABLE "learner" ADD COLUMN "band" text;--> statement-breakpoint
ALTER TABLE "learner" ADD COLUMN "band_ends_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "learner" ADD COLUMN "country" text;--> statement-breakpoint
ALTER TABLE "learner" ADD COLUMN "managed" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "learner" ADD COLUMN "daily_minutes" integer;--> statement-breakpoint
ALTER TABLE "learner" ADD COLUMN "inactive_notice_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "ai_route" ADD CONSTRAINT "ai_route_provider_id_ai_provider_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."ai_provider"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calibration" ADD CONSTRAINT "calibration_provider_id_ai_provider_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."ai_provider"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consent" ADD CONSTRAINT "consent_learner_id_learner_id_fk" FOREIGN KEY ("learner_id") REFERENCES "public"."learner"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consent" ADD CONSTRAINT "consent_granted_by_user_id_fk" FOREIGN KEY ("granted_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guardian_verification" ADD CONSTRAINT "guardian_verification_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "platform_admin" ADD CONSTRAINT "platform_admin_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_check" ADD CONSTRAINT "vendor_check_provider_id_ai_provider_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."ai_provider"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "admin_log_at" ON "admin_log" USING btree ("at");--> statement-breakpoint
CREATE INDEX "admin_log_action" ON "admin_log" USING btree ("action","at");--> statement-breakpoint
CREATE INDEX "calibration_route" ON "calibration" USING btree ("criterion","provider_id","model","prompt_version");--> statement-breakpoint
CREATE INDEX "consent_learner_scope" ON "consent" USING btree ("learner_id","scope");--> statement-breakpoint
CREATE INDEX "consent_expires" ON "consent" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "guardian_verification_user" ON "guardian_verification" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "guardian_verification_status" ON "guardian_verification" USING btree ("status","submitted_at");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_username_unique" UNIQUE("username");