CREATE TABLE "judgment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"learner_id" uuid NOT NULL,
	"index" integer NOT NULL,
	"attempt" integer NOT NULL,
	"topic_id" text NOT NULL,
	"kp" integer NOT NULL,
	"seed" bigint NOT NULL,
	"response" text NOT NULL,
	"criteria" jsonb NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"verdict" jsonb,
	"score" double precision,
	"provider_id" text,
	"model" text,
	"prompt_version" text,
	"input_tokens" integer DEFAULT 0 NOT NULL,
	"output_tokens" integer DEFAULT 0 NOT NULL,
	"cost" double precision DEFAULT 0 NOT NULL,
	"tries" integer DEFAULT 0 NOT NULL,
	"error" text,
	"created_at" timestamp with time zone NOT NULL,
	"next_at" timestamp with time zone NOT NULL,
	"finished_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "answer" ADD COLUMN "score" double precision;--> statement-breakpoint
ALTER TABLE "judgment" ADD CONSTRAINT "judgment_session_id_task_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."task_session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "judgment" ADD CONSTRAINT "judgment_learner_id_learner_id_fk" FOREIGN KEY ("learner_id") REFERENCES "public"."learner"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "judgment_session" ON "judgment" USING btree ("session_id","index");--> statement-breakpoint
CREATE INDEX "judgment_due" ON "judgment" USING btree ("status","next_at");