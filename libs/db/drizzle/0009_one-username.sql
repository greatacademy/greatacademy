UPDATE "user" SET "username" = lower("learner"."username"), "display_username" = "learner"."username" FROM "learner" WHERE "learner"."user_id" = "user"."id" AND "user"."username" IS NULL AND "learner"."username" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM "user" AS "other" WHERE "other"."username" = lower("learner"."username"));--> statement-breakpoint
DROP INDEX "learner_username";--> statement-breakpoint
ALTER TABLE "learner" DROP COLUMN "username";
