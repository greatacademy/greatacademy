import type { EngineEvent, LearnerState } from "@ga/engine";
import { sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  date,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { user } from "./auth.ts";

const at = (name: string) => timestamp(name, { withTimezone: true, mode: "date" });

/** AgeBand is what the age question decides: child needs a guardian, teen has an account with protective defaults. */
export type AgeBand = "child" | "teen" | "adult";

/** learner is a person who studies; each user has exactly one, and guardians follow learners through guardian. */
export const learner = pgTable("learner", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: at("created_at").notNull().defaultNow(),
  /** leagues tells whether the learner takes part in leagues. */
  leagues: boolean("leagues").notNull().default(false),
  /** band is the age band, null until the learner has answered the age question; the birth date is never stored. */
  band: text("band").$type<AgeBand>(),
  /** bandEndsAt is when the band ends; null for adults. */
  bandEndsAt: at("band_ends_at"),
  /** country is the market the learner answered with, an ISO 3166 code or "other". */
  country: text("country"),
  /** managed marks a child's account, created by a guardian, with no real email address. */
  managed: boolean("managed").notNull().default(false),
  /** dailyMinutes is the study limit a guardian set; null for none. */
  dailyMinutes: integer("daily_minutes"),
  /** inactiveNoticeAt is when the notice of coming deletion for inactivity was sent. */
  inactiveNoticeAt: at("inactive_notice_at"),
});

/**
 * learnerSubject holds a learner's decisions about a subject that are not its course: the weekly goals and the date
 * the current course should be finished by. A missing row means none of them.
 */
export const learnerSubject = pgTable(
  "learner_subject",
  {
    learnerId: uuid("learner_id")
      .notNull()
      .references(() => learner.id, { onDelete: "cascade" }),
    subjectId: text("subject_id").notNull(),
    /** goals holds the XP goal of each weekday, Monday first; null until set. */
    goals: integer("goals").array(),
    goalsPaused: boolean("goals_paused").notNull().default(false),
    /** endDate is the day the current course should be finished by, "YYYY-MM-DD"; null for none. Changing course clears it. */
    endDate: date("end_date", { mode: "string" }),
  },
  (t) => [primaryKey({ columns: [t.learnerId, t.subjectId] })],
);

/**
 * enrollment is a course a learner was given. A learner has one current
 * course per subject, the one not ended; the others are the courses taken
 * before, kept as history.
 */
export const enrollment = pgTable(
  "enrollment",
  {
    learnerId: uuid("learner_id")
      .notNull()
      .references(() => learner.id, { onDelete: "cascade" }),
    courseId: text("course_id").notNull(),
    subjectId: text("subject_id").notNull(),
    createdAt: at("created_at").notNull().defaultNow(),
    /** chosenAt is when the course last became the current one. */
    chosenAt: at("chosen_at").notNull().defaultNow(),
    /** endedAt is when another course of the subject replaced it; null while current. */
    endedAt: at("ended_at"),
    /** decidedAt is when whoever chooses the course kept it or took another after its diagnostic report; null before. */
    decidedAt: at("decided_at"),
  },
  (t) => [
    primaryKey({ columns: [t.learnerId, t.courseId] }),
    uniqueIndex("enrollment_current").on(t.learnerId, t.subjectId).where(sql`${t.endedAt} is null`),
  ],
);

/**
 * event is the append-only log of completed tasks, per learner and subject.
 * seq numbers the events of a learner in a subject from 1 without gaps; the
 * unique index makes concurrent writers conflict instead of interleaving.
 */
export const event = pgTable(
  "event",
  {
    id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    learnerId: uuid("learner_id")
      .notNull()
      .references(() => learner.id, { onDelete: "cascade" }),
    subjectId: text("subject_id").notNull(),
    seq: integer("seq").notNull(),
    at: at("at").notNull(),
    type: text("type").notNull().$type<EngineEvent["type"]>(),
    courseId: text("course_id"),
    sessionId: uuid("session_id"),
    /** xp is the XP the event earned, kept for reporting; the engine recomputes it on replay. */
    xp: integer("xp").notNull(),
    data: jsonb("data").notNull().$type<EngineEvent>(),
  },
  (t) => [uniqueIndex("event_learner_subject_seq").on(t.learnerId, t.subjectId, t.seq), index("event_learner_at").on(t.learnerId, t.at)],
);

/** learnerState is a snapshot of the fold of a learner's events in a subject, up to seq. It can always be rebuilt by replay. */
export const learnerState = pgTable(
  "learner_state",
  {
    learnerId: uuid("learner_id")
      .notNull()
      .references(() => learner.id, { onDelete: "cascade" }),
    subjectId: text("subject_id").notNull(),
    seq: integer("seq").notNull(),
    state: jsonb("state").notNull().$type<LearnerState>(),
    updatedAt: at("updated_at").notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.learnerId, t.subjectId] })],
);

/** SessionStatus is the life cycle of a task session. */
export type SessionStatus = "active" | "completed" | "abandoned";

/**
 * taskSession is a task being carried out: a lesson, review, quiz or
 * diagnostic. state is the runner's state, opaque to the database. A learner
 * has at most one active session per course.
 */
export const taskSession = pgTable(
  "task_session",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    learnerId: uuid("learner_id")
      .notNull()
      .references(() => learner.id, { onDelete: "cascade" }),
    subjectId: text("subject_id").notNull(),
    courseId: text("course_id").notNull(),
    kind: text("kind").notNull(),
    topicId: text("topic_id"),
    status: text("status").notNull().$type<SessionStatus>().default("active"),
    state: jsonb("state").notNull().$type<unknown>(),
    startedAt: at("started_at").notNull(),
    updatedAt: at("updated_at").notNull(),
    completedAt: at("completed_at"),
  },
  (t) => [uniqueIndex("task_session_one_active").on(t.learnerId, t.courseId).where(sql`${t.status} = 'active'`)],
);

/** answer is the append-only log of every response, judged on the server. */
export const answer = pgTable(
  "answer",
  {
    id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    sessionId: uuid("session_id")
      .notNull()
      .references(() => taskSession.id, { onDelete: "cascade" }),
    learnerId: uuid("learner_id")
      .notNull()
      .references(() => learner.id, { onDelete: "cascade" }),
    index: integer("index").notNull(),
    topicId: text("topic_id").notNull(),
    kp: integer("kp").notNull(),
    seed: bigint("seed", { mode: "number" }).notNull(),
    response: text("response").notNull(),
    skipped: boolean("skipped").notNull().default(false),
    correct: boolean("correct").notNull(),
    /** score is the fraction of criteria met, for an answer judged by a model. */
    score: doublePrecision("score"),
    at: at("at").notNull(),
  },
  (t) => [uniqueIndex("answer_session_index").on(t.sessionId, t.index)],
);

/** JudgmentStatus is where a judgment is: waiting for a model, done, failed for good, or replaced by a rewrite. */
export type JudgmentStatus = "pending" | "done" | "failed" | "superseded";

/** StoredVerdict is a model's checked verdict as a judgment keeps it: per criterion, with quotations, and at most two points of feedback. */
export interface StoredVerdict {
  readonly criteria: readonly {
    readonly id: string;
    readonly version: string;
    readonly met: boolean;
    readonly quotation: string;
    readonly note: string;
  }[];
  readonly feedback: readonly { readonly point: string; readonly quotation: string }[];
}

/**
 * judgment is one learner text sent to be judged by a model, for one attempt at
 * a question of a session. The answer is recorded, and the event appended, only
 * once its verdict is in, so replaying the log never calls a model.
 */
export const judgment = pgTable(
  "judgment",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sessionId: uuid("session_id")
      .notNull()
      .references(() => taskSession.id, { onDelete: "cascade" }),
    learnerId: uuid("learner_id")
      .notNull()
      .references(() => learner.id, { onDelete: "cascade" }),
    index: integer("index").notNull(),
    /** attempt counts the learner's tries at the question, from 1; a rewrite is the next attempt. */
    attempt: integer("attempt").notNull(),
    topicId: text("topic_id").notNull(),
    kp: integer("kp").notNull(),
    seed: bigint("seed", { mode: "number" }).notNull(),
    response: text("response").notNull(),
    /** criteria are the keys (id@version) of the criteria judged. */
    criteria: jsonb("criteria").$type<readonly string[]>().notNull(),
    status: text("status").$type<JudgmentStatus>().notNull().default("pending"),
    verdict: jsonb("verdict").$type<StoredVerdict>(),
    score: doublePrecision("score"),
    providerId: text("provider_id"),
    model: text("model"),
    promptVersion: text("prompt_version"),
    inputTokens: integer("input_tokens").notNull().default(0),
    outputTokens: integer("output_tokens").notNull().default(0),
    cost: doublePrecision("cost").notNull().default(0),
    /** tries counts the calls made; error is the reason the last one failed, never the learner's text. */
    tries: integer("tries").notNull().default(0),
    error: text("error"),
    createdAt: at("created_at").notNull(),
    /** nextAt is when the judgment may be tried again. */
    nextAt: at("next_at").notNull(),
    finishedAt: at("finished_at"),
  },
  (t) => [
    index("judgment_session").on(t.sessionId, t.index),
    index("judgment_due").on(t.status, t.nextAt),
    index("judgment_learner").on(t.learnerId, t.createdAt),
  ],
);

/** leagueGroup is a group of learners competing in a tier for a week, which starts at week. */
export const leagueGroup = pgTable(
  "league_group",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    week: at("week").notNull(),
    tier: integer("tier").notNull(),
    band: integer("band").notNull(),
  },
  (t) => [index("league_group_week_tier").on(t.week, t.tier)],
);

/** leagueMember is a learner in a group; a learner is in one group per week. */
export const leagueMember = pgTable(
  "league_member",
  {
    learnerId: uuid("learner_id")
      .notNull()
      .references(() => learner.id, { onDelete: "cascade" }),
    week: at("week").notNull(),
    groupId: uuid("group_id")
      .notNull()
      .references(() => leagueGroup.id, { onDelete: "cascade" }),
    joinedAt: at("joined_at").notNull(),
  },
  (t) => [primaryKey({ columns: [t.learnerId, t.week] }), index("league_member_group").on(t.groupId)],
);

/** guardian lets a user follow a learner and set the learner's goals. */
export const guardian = pgTable(
  "guardian",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    learnerId: uuid("learner_id")
      .notNull()
      .references(() => learner.id, { onDelete: "cascade" }),
    createdAt: at("created_at").notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.learnerId] }), index("guardian_learner").on(t.learnerId)],
);

/** guardianInvite is a code a learner gives to someone to make them a guardian; it works once. */
export const guardianInvite = pgTable("guardian_invite", {
  code: text("code").primaryKey(),
  learnerId: uuid("learner_id")
    .notNull()
    .references(() => learner.id, { onDelete: "cascade" }),
  expiresAt: at("expires_at").notNull(),
});
