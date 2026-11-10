DELETE FROM "ai_provider" WHERE "kind" NOT IN ('model', 'speech');--> statement-breakpoint
ALTER TABLE "ai_provider" DROP COLUMN "region";
