ALTER TABLE "enrollment" ADD COLUMN "chosen_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "enrollment" ADD COLUMN "ended_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "enrollment" ADD COLUMN "decided_at" timestamp with time zone;--> statement-breakpoint
UPDATE "enrollment" e SET "ended_at" = now() WHERE EXISTS (SELECT 1 FROM "enrollment" o WHERE o."learner_id" = e."learner_id" AND o."subject_id" = e."subject_id" AND (o."created_at", o."course_id") > (e."created_at", e."course_id"));--> statement-breakpoint
CREATE UNIQUE INDEX "enrollment_current" ON "enrollment" USING btree ("learner_id","subject_id") WHERE "enrollment"."ended_at" is null;