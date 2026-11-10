import { sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  real,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { user } from "./auth.ts";
import { judgment, learner } from "./learning.ts";

const at = (name: string) => timestamp(name, { withTimezone: true, mode: "date" });

/** ConsentScope is a purpose that needs its own consent. */
export type ConsentScope = "basic" | "writing" | "speech" | "conversation" | "research";

/**
 * consent records one grant for one purpose. Rows are never deleted while the
 * account lives: a withdrawal sets withdrawnAt, and a new grant is a new row.
 */
export const consent = pgTable(
  "consent",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    learnerId: uuid("learner_id")
      .notNull()
      .references(() => learner.id, { onDelete: "cascade" }),
    scope: text("scope").notNull().$type<ConsentScope>(),
    /** grantedBy is the guardian, or the teen's own account; null once that account is gone. */
    grantedBy: text("granted_by").references(() => user.id, { onDelete: "set null" }),
    /** role says whether a guardian or the learner gave it. */
    role: text("role").notNull().$type<"guardian" | "self">(),
    /** method is how the guardian was verified; "self" for a teen. */
    method: text("method").notNull(),
    noticeVersion: text("notice_version").notNull(),
    country: text("country").notNull(),
    /** assentAt is when the child agreed too, for the scopes that ask. */
    assentAt: at("assent_at"),
    grantedAt: at("granted_at").notNull(),
    expiresAt: at("expires_at").notNull(),
    /** remindedAt is when the guardian or teen was told that it will soon expire. */
    remindedAt: at("reminded_at"),
    withdrawnAt: at("withdrawn_at"),
    withdrawnBy: text("withdrawn_by"),
  },
  (t) => [index("consent_learner_scope").on(t.learnerId, t.scope), index("consent_expires").on(t.expiresAt)],
);

/** VerificationStatus is the life cycle of a guardian verification. */
export type VerificationStatus = "pending" | "approved" | "refused";

/** guardianVerification is a person's proof of being an adult who can consent; a signed form is deleted once decided. */
export const guardianVerification = pgTable(
  "guardian_verification",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    method: text("method").notNull(),
    status: text("status").notNull().$type<VerificationStatus>().default("pending"),
    /** formKey and formType locate the waiting scan in storage; both are cleared on decision. */
    formKey: text("form_key"),
    formType: text("form_type"),
    submittedAt: at("submitted_at").notNull(),
    decidedAt: at("decided_at"),
    decidedBy: text("decided_by"),
    reason: text("reason"),
  },
  (t) => [index("guardian_verification_user").on(t.userId), index("guardian_verification_status").on(t.status, t.submittedAt)],
);

/** platformAdmin holds the role that opens the admin console. */
export const platformAdmin = pgTable("platform_admin", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  grantedAt: at("granted_at").notNull(),
  grantedBy: text("granted_by"),
});

/** marketLaunch is whether a market is open to minors, with its sign-off; a market with no row is closed. */
export const marketLaunch = pgTable("market_launch", {
  country: text("country").primaryKey(),
  minorsOpen: boolean("minors_open").notNull().default(false),
  signedOffBy: text("signed_off_by"),
  signedOffOn: text("signed_off_on"),
  /** languageGapAccepted records that counsel accepted missing notice languages. */
  languageGapAccepted: boolean("language_gap_accepted").notNull().default(false),
  updatedAt: at("updated_at").notNull(),
  updatedBy: text("updated_by").notNull(),
});

/** aiProvider is a configured vendor. keyCipher is encrypted outside the database's knowledge and never leaves the server. */
export const aiProvider = pgTable("ai_provider", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  /** catalog is the id of the named vendor in pi-ai's catalog the vendor was picked from, or empty for one configured by hand. */
  catalog: text("catalog").notNull().default(""),
  /** api is the wire protocol pi-ai speaks to the vendor, such as openai-completions. */
  api: text("api").notNull(),
  baseUrl: text("base_url").notNull().default(""),
  keyCipher: text("key_cipher"),
  keyHint: text("key_hint"),
  enabled: boolean("enabled").notNull().default(false),
  /** dailyBudget and monthlyBudget cap what the vendor may cost, in US dollars per UTC day and month; one left empty sets no limit. */
  dailyBudget: doublePrecision("daily_budget"),
  monthlyBudget: doublePrecision("monthly_budget"),
  createdAt: at("created_at").notNull(),
  updatedAt: at("updated_at").notNull(),
});

/** aiPrice is what a vendor charges for a model, in US dollars per million tokens; a route whose model has no price serves no learner. */
export const aiPrice = pgTable(
  "ai_price",
  {
    providerId: uuid("provider_id")
      .notNull()
      .references(() => aiProvider.id, { onDelete: "cascade" }),
    model: text("model").notNull(),
    inputPerMillion: doublePrecision("input_per_million").notNull(),
    outputPerMillion: doublePrecision("output_per_million").notNull(),
    updatedAt: at("updated_at").notNull(),
  },
  (t) => [primaryKey({ columns: [t.providerId, t.model] })],
);

/** AiUse is what a model call was for. */
export type AiUse = "judgment" | "calibration";

/**
 * aiCall is one call to a vendor, failed ones included, with its tokens and
 * cost. It holds no text; learnerId is cleared when the learner is deleted, so
 * the spending stays counted.
 */
export const aiCall = pgTable(
  "ai_call",
  {
    id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    providerId: uuid("provider_id")
      .notNull()
      .references(() => aiProvider.id, { onDelete: "cascade" }),
    model: text("model").notNull(),
    use: text("use").$type<AiUse>().notNull(),
    learnerId: uuid("learner_id").references(() => learner.id, { onDelete: "set null" }),
    inputTokens: integer("input_tokens").notNull(),
    outputTokens: integer("output_tokens").notNull(),
    cost: doublePrecision("cost").notNull(),
    ok: boolean("ok").notNull(),
    at: at("at").notNull(),
  },
  (t) => [index("ai_call_at").on(t.at), index("ai_call_learner").on(t.learnerId, t.at)],
);

/** vendorCheck is the register: what a person verified of a vendor for a market, and when. */
export const vendorCheck = pgTable(
  "vendor_check",
  {
    providerId: uuid("provider_id")
      .notNull()
      .references(() => aiProvider.id, { onDelete: "cascade" }),
    country: text("country").notNull(),
    servesMarket: boolean("serves_market").notNull(),
    minorsAllowed: boolean("minors_allowed").notNull(),
    noTraining: boolean("no_training").notNull(),
    shortRetention: boolean("short_retention").notNull(),
    processingAgreement: boolean("processing_agreement").notNull(),
    transferMechanism: boolean("transfer_mechanism").notNull(),
    region: text("region").notNull().default(""),
    notes: text("notes").notNull().default(""),
    checkedAt: at("checked_at").notNull(),
    checkedBy: text("checked_by").notNull(),
  },
  (t) => [primaryKey({ columns: [t.providerId, t.country] })],
);

/** RoutePosition tells a route's place: the one used first, or the calibrated one it falls back to. */
export type RoutePosition = "primary" | "backup";

/**
 * RouteUse is what a route does: judging writing, answering in conversation,
 * speech-to-text, text-to-speech or pronunciation scoring.
 */
export type RouteUse = "judgment" | "conversation" | "stt" | "tts" | "pronunciation";

/**
 * aiRoute says which vendor's model serves one target of a use: a criterion
 * key such as w4-topic-sentence@1 for judgment, a conversation's id, or a
 * language such as en for speech.
 */
export const aiRoute = pgTable(
  "ai_route",
  {
    use: text("use").notNull().$type<RouteUse>(),
    target: text("target").notNull(),
    position: text("position").notNull().$type<RoutePosition>(),
    providerId: uuid("provider_id")
      .notNull()
      .references(() => aiProvider.id, { onDelete: "restrict" }),
    model: text("model").notNull(),
    /** promptVersion is the prompt a judgment or conversation route uses, and empty for speech. */
    promptVersion: text("prompt_version").notNull().default(""),
    /** voice is the voice a text-to-speech route speaks with, and empty for any other use. */
    voice: text("voice").notNull().default(""),
    live: boolean("live").notNull().default(false),
    updatedAt: at("updated_at").notNull(),
  },
  (t) => [primaryKey({ columns: [t.use, t.target, t.position] })],
);

/** calibration is a measured agreement with people, written by tools/calibrate and read-only in the console. */
export const calibration = pgTable(
  "calibration",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    criterion: text("criterion").notNull(),
    providerId: uuid("provider_id")
      .notNull()
      .references(() => aiProvider.id, { onDelete: "cascade" }),
    model: text("model").notNull(),
    promptVersion: text("prompt_version").notNull(),
    kappa: real("kappa").notNull(),
    humanKappa: real("human_kappa").notNull(),
    passed: boolean("passed").notNull(),
    at: at("at").notNull(),
  },
  (t) => [index("calibration_route").on(t.criterion, t.providerId, t.model, t.promptVersion)],
);

/** notice is a version of the notices and the vendors it names; the newest is current. */
export const notice = pgTable("notice", {
  version: text("version").primaryKey(),
  vendors: uuid("vendors").array().notNull().default(sql`'{}'::uuid[]`),
  publishedAt: at("published_at").notNull(),
  publishedBy: text("published_by").notNull(),
});

/** adminLog is the append-only record of changes made in the console and by scheduled jobs. Details never hold secrets or learners' text. */
export const adminLog = pgTable(
  "admin_log",
  {
    id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    /** actor is an administrator's user id, or "system" for scheduled jobs. */
    actor: text("actor").notNull(),
    action: text("action").notNull(),
    target: text("target").notNull().default(""),
    detail: text("detail").notNull().default(""),
    at: at("at").notNull(),
  },
  (t) => [index("admin_log_at").on(t.at), index("admin_log_action").on(t.action, t.at)],
);

/** CheckTask is the task a sampled text answered, as the person checking it reads it. */
export interface CheckTask {
  readonly prompt: string;
  readonly source?: string;
}

/**
 * verdictCheck is one criterion of a live judgment sampled for a person to
 * check: the route that judged it, its verdict, and the person's, once given.
 * The text stays in the judgment, so it expires with it, and the sample with
 * no text left is never shown.
 */
export const verdictCheck = pgTable(
  "verdict_check",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    judgmentId: uuid("judgment_id")
      .notNull()
      .references(() => judgment.id, { onDelete: "cascade" }),
    criterion: text("criterion").notNull(),
    question: text("question").notNull(),
    task: jsonb("task").$type<CheckTask>().notNull(),
    providerId: uuid("provider_id")
      .notNull()
      .references(() => aiProvider.id, { onDelete: "cascade" }),
    model: text("model").notNull(),
    promptVersion: text("prompt_version").notNull(),
    met: boolean("met").notNull(),
    personMet: boolean("person_met"),
    checkedBy: text("checked_by").references(() => user.id, { onDelete: "set null" }),
    sampledAt: at("sampled_at").notNull(),
    checkedAt: at("checked_at"),
  },
  (t) => [index("verdict_check_waiting").on(t.checkedAt, t.sampledAt), index("verdict_check_judgment").on(t.judgmentId)],
);
