CREATE TABLE "conversation_session" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"learner_id" uuid NOT NULL,
	"subject_id" text NOT NULL,
	"course_id" text NOT NULL,
	"conversation_id" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"turns" integer DEFAULT 0 NOT NULL,
	"reason" text,
	"duration_secs" double precision,
	"learner_lines" integer,
	"lines" jsonb,
	"started_at" timestamp with time zone NOT NULL,
	"ended_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "conversation_session" ADD CONSTRAINT "conversation_session_learner_id_learner_id_fk" FOREIGN KEY ("learner_id") REFERENCES "public"."learner"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "conversation_learner" ON "conversation_session" USING btree ("learner_id","started_at");--> statement-breakpoint
CREATE INDEX "conversation_ended" ON "conversation_session" USING btree ("ended_at");