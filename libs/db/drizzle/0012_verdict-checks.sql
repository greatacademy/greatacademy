CREATE TABLE "verdict_check" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"judgment_id" uuid NOT NULL,
	"criterion" text NOT NULL,
	"question" text NOT NULL,
	"task" jsonb NOT NULL,
	"provider_id" uuid NOT NULL,
	"model" text NOT NULL,
	"prompt_version" text NOT NULL,
	"met" boolean NOT NULL,
	"person_met" boolean,
	"checked_by" text,
	"sampled_at" timestamp with time zone NOT NULL,
	"checked_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "verdict_check" ADD CONSTRAINT "verdict_check_judgment_id_judgment_id_fk" FOREIGN KEY ("judgment_id") REFERENCES "public"."judgment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verdict_check" ADD CONSTRAINT "verdict_check_provider_id_ai_provider_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."ai_provider"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verdict_check" ADD CONSTRAINT "verdict_check_checked_by_user_id_fk" FOREIGN KEY ("checked_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "verdict_check_waiting" ON "verdict_check" USING btree ("checked_at","sampled_at");--> statement-breakpoint
CREATE INDEX "verdict_check_judgment" ON "verdict_check" USING btree ("judgment_id");