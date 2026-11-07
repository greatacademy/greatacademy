CREATE TABLE "payment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subscription_id" uuid NOT NULL,
	"account" text NOT NULL,
	"payment_intent" text NOT NULL,
	"amount" integer NOT NULL,
	"currency" text NOT NULL,
	"paid_at" timestamp with time zone NOT NULL,
	"first" boolean DEFAULT false NOT NULL,
	"refunded_at" timestamp with time zone,
	CONSTRAINT "payment_payment_intent_unique" UNIQUE("payment_intent")
);
--> statement-breakpoint
CREATE TABLE "subscription" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"payer_id" text NOT NULL,
	"learner_id" uuid,
	"scope" text NOT NULL,
	"interval" text NOT NULL,
	"account" text NOT NULL,
	"stripe_subscription" text,
	"customer" text,
	"checkout" text,
	"paid_until" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"cancelled_at" timestamp with time zone,
	"refunded_at" timestamp with time zone,
	"reminded_for" timestamp with time zone,
	CONSTRAINT "subscription_stripe_subscription_unique" UNIQUE("stripe_subscription"),
	CONSTRAINT "subscription_checkout_unique" UNIQUE("checkout")
);
--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_subscription_id_subscription_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscription"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_payer_id_user_id_fk" FOREIGN KEY ("payer_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_learner_id_learner_id_fk" FOREIGN KEY ("learner_id") REFERENCES "public"."learner"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "payment_subscription" ON "payment" USING btree ("subscription_id");--> statement-breakpoint
CREATE INDEX "subscription_learner" ON "subscription" USING btree ("learner_id");--> statement-breakpoint
CREATE INDEX "subscription_payer" ON "subscription" USING btree ("payer_id");--> statement-breakpoint
CREATE INDEX "subscription_paid_until" ON "subscription" USING btree ("paid_until");