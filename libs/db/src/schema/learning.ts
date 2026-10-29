import type { EngineEvent, LearnerState } from "@ga/engine";
import { sql } from "drizzle-orm";
import { bigint, boolean, index, integer, jsonb, pgTable, primaryKey, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { user } from "./auth.ts";

const at = (name: string) => timestamp(name, { withTimezone: true, mode: "date" });

/**
 * learner is a person who studies. Today each user has exactly one learner;
 * managed profiles (a parent's children) will add more learners per user.
 */
export const learner = pgTable("learner", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: at("created_at").notNull().defaultNow(),
});

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
