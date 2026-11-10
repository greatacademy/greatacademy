ALTER TABLE "ai_route" RENAME COLUMN "criterion" TO "target";--> statement-breakpoint
ALTER TABLE "ai_route" DROP CONSTRAINT "ai_route_criterion_position_pk";--> statement-breakpoint
ALTER TABLE "ai_route" ADD COLUMN "use" text NOT NULL DEFAULT 'judgment';--> statement-breakpoint
ALTER TABLE "ai_route" ALTER COLUMN "use" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "ai_route" ADD COLUMN "voice" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "ai_route" ALTER COLUMN "prompt_version" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "ai_route" ADD CONSTRAINT "ai_route_use_target_position_pk" PRIMARY KEY("use","target","position");--> statement-breakpoint
ALTER TABLE "ai_provider" DROP COLUMN "kind";
