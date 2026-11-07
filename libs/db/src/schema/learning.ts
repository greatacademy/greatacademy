import type { EngineEvent, LearnerState } from "@ga/engine";
import { sql } from "drizzle-orm";
import { bigint, boolean, index, integer, jsonb, pgTable, primaryKey, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { user } from "./auth.ts";

const at = (name: string) => timestamp(name, { withTimezone: true, mode: "date" });

/** AgeBand is what the age question decides: child needs a guardian, teen has an account with protective defaults. */
export type AgeBand = "child" | "teen" | "adult";

/** learner is a person who studies; each user has exactly one, and guardians follow learners through guardian. */
export const learner = pgTable(
  "learner",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: at("created_at").notNull().defaultNow(),
    /** username is the public name in leagues, unique ignoring case; the account's own name is never shown to others. */
    username: text("username"),
    /** leagues tells whether the learner takes part in leagues. */
    leagues: boolean("leagues").notNull().default(false),
    /** goals holds the XP goal of each weekday, Monday first; null until set. */
    goals: integer("goals").array(),
    goalsPaused: boolean("goals_paused").notNull().default(false),
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
  },
  (t) => [uniqueIndex("learner_username").on(sql`lower(${t.username})`)],
);

/** enrollment is a learner in a course. */
export const enrollment = pgTable(
  "enrollment",
  {
    learnerId: uuid("learner_id")
      .notNull()
      .references(() => learner.id, { onDelete: "cascade" }),
    courseId: text("course_id").notNull(),
    subjectId: text("subject_id").notNull(),
    createdAt: at("created_at").notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.learnerId, t.courseId] })],
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
    at: at("at").notNull(),
  },
  (t) => [uniqueIndex("answer_session_index").on(t.sessionId, t.index)],
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
