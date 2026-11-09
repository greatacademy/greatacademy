CREATE TABLE "learner_subject" (
	"learner_id" uuid NOT NULL,
	"subject_id" text NOT NULL,
	"goals" integer[],
	"goals_paused" boolean DEFAULT false NOT NULL,
	"end_date" date,
	CONSTRAINT "learner_subject_learner_id_subject_id_pk" PRIMARY KEY("learner_id","subject_id")
);
--> statement-breakpoint
ALTER TABLE "learner_subject" ADD CONSTRAINT "learner_subject_learner_id_learner_id_fk" FOREIGN KEY ("learner_id") REFERENCES "public"."learner"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learner" DROP COLUMN "goals";--> statement-breakpoint
ALTER TABLE "learner" DROP COLUMN "goals_paused";