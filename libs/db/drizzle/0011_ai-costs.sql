CREATE TABLE "ai_call" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ai_call_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"provider_id" uuid NOT NULL,
	"model" text NOT NULL,
	"use" text NOT NULL,
	"learner_id" uuid,
	"input_tokens" integer NOT NULL,
	"output_tokens" integer NOT NULL,
	"cost" double precision NOT NULL,
	"ok" boolean NOT NULL,
	"at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_price" (
	"provider_id" uuid NOT NULL,
	"model" text NOT NULL,
	"input_per_million" double precision NOT NULL,
	"output_per_million" double precision NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "ai_price_provider_id_model_pk" PRIMARY KEY("provider_id","model")
);
--> statement-breakpoint
ALTER TABLE "ai_provider" ADD COLUMN "daily_budget" double precision;--> statement-breakpoint
ALTER TABLE "ai_provider" ADD COLUMN "monthly_budget" double precision;--> statement-breakpoint
ALTER TABLE "ai_call" ADD CONSTRAINT "ai_call_provider_id_ai_provider_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."ai_provider"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_call" ADD CONSTRAINT "ai_call_learner_id_learner_id_fk" FOREIGN KEY ("learner_id") REFERENCES "public"."learner"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_price" ADD CONSTRAINT "ai_price_provider_id_ai_provider_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."ai_provider"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ai_call_at" ON "ai_call" USING btree ("at");--> statement-breakpoint
CREATE INDEX "ai_call_learner" ON "ai_call" USING btree ("learner_id","at");--> statement-breakpoint
CREATE INDEX "judgment_learner" ON "judgment" USING btree ("learner_id","created_at");