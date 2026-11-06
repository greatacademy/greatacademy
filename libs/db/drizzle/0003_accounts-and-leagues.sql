CREATE TABLE "guardian" (
	"user_id" text NOT NULL,
	"learner_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "guardian_user_id_learner_id_pk" PRIMARY KEY("user_id","learner_id")
);
--> statement-breakpoint
CREATE TABLE "guardian_invite" (
	"code" text PRIMARY KEY NOT NULL,
	"learner_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "league_group" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"week" timestamp with time zone NOT NULL,
	"tier" integer NOT NULL,
	"band" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "league_member" (
	"learner_id" uuid NOT NULL,
	"week" timestamp with time zone NOT NULL,
	"group_id" uuid NOT NULL,
	"joined_at" timestamp with time zone NOT NULL,
	CONSTRAINT "league_member_learner_id_week_pk" PRIMARY KEY("learner_id","week")
);
--> statement-breakpoint
ALTER TABLE "learner" ADD COLUMN "username" text;--> statement-breakpoint
ALTER TABLE "learner" ADD COLUMN "leagues" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "learner" ADD COLUMN "goals" integer[];--> statement-breakpoint
ALTER TABLE "learner" ADD COLUMN "goals_paused" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "guardian" ADD CONSTRAINT "guardian_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guardian" ADD CONSTRAINT "guardian_learner_id_learner_id_fk" FOREIGN KEY ("learner_id") REFERENCES "public"."learner"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guardian_invite" ADD CONSTRAINT "guardian_invite_learner_id_learner_id_fk" FOREIGN KEY ("learner_id") REFERENCES "public"."learner"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "league_member" ADD CONSTRAINT "league_member_learner_id_learner_id_fk" FOREIGN KEY ("learner_id") REFERENCES "public"."learner"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "league_member" ADD CONSTRAINT "league_member_group_id_league_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."league_group"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "guardian_learner" ON "guardian" USING btree ("learner_id");--> statement-breakpoint
CREATE INDEX "league_group_week_tier" ON "league_group" USING btree ("week","tier");--> statement-breakpoint
CREATE INDEX "league_member_group" ON "league_member" USING btree ("group_id");--> statement-breakpoint
CREATE UNIQUE INDEX "learner_username" ON "learner" USING btree (lower("username"));