import { answer, type Db, event, schema } from "@ga/db";
import { and, asc, eq, gte } from "drizzle-orm";

/** AnswerRow is one logged response of a course's learners. */
export interface AnswerRow {
  readonly learnerId: string;
  readonly topicId: string;
  readonly kp: number;
  readonly response: string;
  readonly skipped: boolean;
  readonly correct: boolean;
}

/** SessionRow is one task session of a course's learners. */
export interface SessionRow {
  readonly learnerId: string;
  readonly kind: string;
  readonly status: string;
}

/** LessonRow is the end of one lesson. */
export interface LessonRow {
  readonly learnerId: string;
  readonly topicId: string;
  readonly passed: boolean;
}

/** ActivityRow is one logged event of a course's learners, for pace. */
export interface ActivityRow {
  readonly learnerId: string;
  readonly type: string;
  readonly xp: number;
  /** day is the calendar day of the event, "YYYY-MM-DD" in UTC. */
  readonly day: string;
}

/** PilotData is what a report is computed from. */
export interface PilotData {
  readonly answers: readonly AnswerRow[];
  readonly sessions: readonly SessionRow[];
  readonly lessons: readonly LessonRow[];
  readonly activity: readonly ActivityRow[];
}

/** PaceStats compares how learners work with the simulated students of tools/simulate. */
export interface PaceStats {
  /** xpPerActiveDay is the median across learners of their XP per day they studied. */
  readonly xpPerActiveDay: number;
  /** activeDays is the median across learners of the days they studied. */
  readonly activeDays: number;
  /** reviewsPerLearnedTopic is the reviews ended per lesson passed, over all learners. */
  readonly reviewsPerLearnedTopic: number;
}

/** KpStats sums up the answers to one knowledge point. */
export interface KpStats {
  readonly topicId: string;
  readonly kp: number;
  readonly answers: number;
  readonly learners: number;
  /** firstTryRate is the share of learners whose first answer was correct. */
  readonly firstTryRate: number;
  readonly correctRate: number;
  readonly skipRate: number;
  /** wrong lists the most common wrong responses and how many learners gave each. */
  readonly wrong: readonly { readonly response: string; readonly learners: number }[];
  /** rejectedSentences lists every different wrong response of several words, since one of them may be a valid sentence that a checker does not accept. */
  readonly rejectedSentences: readonly string[];
}

/** TopicStats sums up the lessons of one topic. */
export interface TopicStats {
  readonly topicId: string;
  readonly lessons: number;
  readonly learners: number;
  readonly failRate: number;
}

/** SessionStats sums up the sessions of one kind. */
export interface SessionStats {
  readonly kind: string;
  readonly started: number;
  readonly completed: number;
  readonly abandoned: number;
}

/** PilotReport is the result of a pilot, for finding where teaching fails. */
export interface PilotReport {
  readonly learners: number;
  readonly sessions: readonly SessionStats[];
  readonly lessonsEnded: number;
  readonly lessonsPassed: number;
  readonly pace: PaceStats;
  /** responses counts every answer given, skipped ones excluded. */
  readonly responses: number;
  /** rejected counts the wrong answers of several words, which a person reads for valid sentences. */
  readonly rejected: number;
  /** kps are the knowledge points with enough learners, hardest first. */
  readonly kps: readonly KpStats[];
  /** topics are the topics with enough learners, most failed first. */
  readonly topics: readonly TopicStats[];
  /** tooFew counts the knowledge points left out for having too few learners. */
  readonly tooFew: number;
}

/** ReportOptions are the thresholds of a report. */
export interface ReportOptions {
  /** minLearners is how many learners a knowledge point or topic needs to be listed; below it a rate says little. */
  readonly minLearners: number;
  /** wrongPerKp is how many wrong responses to list per knowledge point. */
  readonly wrongPerKp: number;
}

/** defaultReportOptions are the thresholds of a report unless given otherwise. */
export const defaultReportOptions: ReportOptions = { minLearners: 5, wrongPerKp: 3 };

const groupBy = <T>(rows: readonly T[], key: (row: T) => string): T[][] => {
  const groups = new Map<string, T[]>();
  for (const row of rows) {
    const k = key(row);
    const group = groups.get(k);
    if (group) group.push(row);
    else groups.set(k, [row]);
  }
  return [...groups.values()];
};

const share = (part: number, whole: number) => (whole === 0 ? 0 : part / whole);

/** normalizeResponse makes responses that differ only by spacing or case count as one. */
export function normalizeResponse(response: string): string {
  return response.replace(/\s+/g, "").toLowerCase();
}

/** isSentence tells a typed sentence from a chosen option or a single word. */
function isSentence(response: string): boolean {
  return /[A-Za-z]+\s+[A-Za-z]+/.test(response);
}

/**
 * summarize computes a report. The answers must be in the order they were
 * given, since the first answer of each learner counts on its own: it says
 * more about the teaching than the answers after seeing a solution.
 */
export function summarize(data: PilotData, options: ReportOptions = defaultReportOptions): PilotReport {
  const allKps = groupBy(data.answers, (a) => `${a.topicId}#${a.kp}`);
  const kps = allKps
    .filter((rows) => new Set(rows.map((r) => r.learnerId)).size >= options.minLearners)
    .map((rows): KpStats => {
      const first = new Map<string, AnswerRow>();
      for (const r of rows) if (!first.has(r.learnerId)) first.set(r.learnerId, r);
      const wrongRows = rows.filter((r) => !r.correct && !r.skipped);
      const wrong = groupBy(wrongRows, (r) => normalizeResponse(r.response))
        .map((same) => ({ response: same[0]!.response, learners: new Set(same.map((r) => r.learnerId)).size }))
        .sort((a, b) => b.learners - a.learners || a.response.localeCompare(b.response))
        .slice(0, options.wrongPerKp);
      return {
        topicId: rows[0]!.topicId,
        kp: rows[0]!.kp,
        answers: rows.length,
        learners: first.size,
        firstTryRate: share([...first.values()].filter((r) => r.correct).length, first.size),
        correctRate: share(rows.filter((r) => r.correct).length, rows.length),
        skipRate: share(rows.filter((r) => r.skipped).length, rows.length),
        wrong,
        rejectedSentences: [
          ...new Map(wrongRows.filter((r) => isSentence(r.response)).map((r) => [normalizeResponse(r.response), r.response])).values(),
        ],
      };
    })
    .sort((a, b) => a.firstTryRate - b.firstTryRate || b.learners - a.learners || a.topicId.localeCompare(b.topicId) || a.kp - b.kp);
  const topics = groupBy(data.lessons, (l) => l.topicId)
    .filter((rows) => new Set(rows.map((r) => r.learnerId)).size >= options.minLearners)
    .map(
      (rows): TopicStats => ({
        topicId: rows[0]!.topicId,
        lessons: rows.length,
        learners: new Set(rows.map((r) => r.learnerId)).size,
        failRate: share(rows.filter((r) => !r.passed).length, rows.length),
      }),
    )
    .sort((a, b) => b.failRate - a.failRate || b.learners - a.learners || a.topicId.localeCompare(b.topicId));
  const sessions = groupBy(data.sessions, (s) => s.kind)
    .map(
      (rows): SessionStats => ({
        kind: rows[0]!.kind,
        started: rows.length,
        completed: rows.filter((s) => s.status === "completed").length,
        abandoned: rows.filter((s) => s.status === "abandoned").length,
      }),
    )
    .sort((a, b) => a.kind.localeCompare(b.kind));
  return {
    learners: new Set([...data.sessions.map((s) => s.learnerId), ...data.answers.map((a) => a.learnerId)]).size,
    sessions,
    lessonsEnded: data.lessons.length,
    lessonsPassed: data.lessons.filter((l) => l.passed).length,
    pace: paceOf(data),
    responses: data.answers.filter((a) => !a.skipped).length,
    rejected: data.answers.filter((a) => !a.correct && !a.skipped && isSentence(a.response)).length,
    kps,
    topics,
    tooFew: allKps.length - kps.length,
  };
}

function median(values: readonly number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = sorted.length / 2;
  if (sorted.length === 0) return 0;
  return Number.isInteger(middle) ? (sorted[middle - 1]! + sorted[middle]!) / 2 : sorted[Math.floor(middle)]!;
}

function paceOf(data: PilotData): PaceStats {
  const learners = groupBy(data.activity, (a) => a.learnerId).map((rows) => ({
    xp: rows.reduce((total, r) => total + r.xp, 0),
    days: new Set(rows.map((r) => r.day)).size,
  }));
  return {
    xpPerActiveDay: median(learners.map((l) => l.xp / l.days)),
    activeDays: median(learners.map((l) => l.days)),
    reviewsPerLearnedTopic: share(data.activity.filter((a) => a.type === "review").length, data.lessons.filter((l) => l.passed).length),
  };
}

/** loadPilotData reads a course's sessions, answers and ended lessons, from a given time on. */
export async function loadPilotData(db: Db, courseId: string, since: Date = new Date(0)): Promise<PilotData> {
  const { taskSession } = schema;
  const answers = await db
    .select({
      learnerId: answer.learnerId,
      topicId: answer.topicId,
      kp: answer.kp,
      response: answer.response,
      skipped: answer.skipped,
      correct: answer.correct,
    })
    .from(answer)
    .innerJoin(taskSession, eq(answer.sessionId, taskSession.id))
    .where(and(eq(taskSession.courseId, courseId), gte(answer.at, since)))
    .orderBy(asc(answer.at), asc(answer.index));
  const sessions = await db
    .select({ learnerId: taskSession.learnerId, kind: taskSession.kind, status: taskSession.status })
    .from(taskSession)
    .where(and(eq(taskSession.courseId, courseId), gte(taskSession.startedAt, since)));
  const ended = await db
    .select({ learnerId: event.learnerId, data: event.data })
    .from(event)
    .where(and(eq(event.courseId, courseId), eq(event.type, "lesson"), gte(event.at, since)))
    .orderBy(asc(event.at));
  const lessons = ended.flatMap(({ learnerId, data }) =>
    data.type === "lesson" ? [{ learnerId, topicId: data.topic, passed: data.passed }] : [],
  );
  const logged = await db
    .select({ learnerId: event.learnerId, type: event.type, xp: event.xp, at: event.at })
    .from(event)
    .where(and(eq(event.courseId, courseId), gte(event.at, since)));
  const activity = logged.map(({ at, ...e }) => ({ ...e, day: at.toISOString().slice(0, 10) }));
  return { answers, sessions, lessons, activity };
}

const percent = (rate: number) => `${Math.round(rate * 100)}%`;
const cell = (text: string) => text.replaceAll("|", "\\|").replaceAll("\n", " ");

/** PilotNames gives the names to show for topics and knowledge points. */
export interface PilotNames {
  topic(id: string): string;
  kp(topicId: string, kp: number): string;
}

/** renderPilotReport writes a report as Markdown. */
export function renderPilotReport(course: string, report: PilotReport, names: PilotNames, limit = 30): string {
  const lines = [
    `# Pilot report: ${course}`,
    "",
    `- Learners: ${report.learners}`,
    `- Lessons ended: ${report.lessonsEnded}, passed: ${report.lessonsPassed} (${percent(share(report.lessonsPassed, report.lessonsEnded))})`,
    `- Knowledge points left out for too few learners: ${report.tooFew}`,
    `- Responses: ${report.responses}, rejected sentences to read: ${report.rejected}`,
    `- Pace, median per learner: ${report.pace.xpPerActiveDay.toFixed(1)} XP on each of ${report.pace.activeDays} days studied`,
    `- Reviews per learned topic: ${report.pace.reviewsPerLearnedTopic.toFixed(2)}`,
    "",
    "## Sessions",
    "",
    "| Kind | Started | Completed | Abandoned |",
    "| :--- | ---: | ---: | ---: |",
    ...report.sessions.map(
      (s) => `| ${s.kind} | ${s.started} | ${s.completed} (${percent(share(s.completed, s.started))}) | ${s.abandoned} |`,
    ),
    "",
    "## Topics by failed lessons",
    "",
    "| Topic | Learners | Lessons | Failed |",
    "| :--- | ---: | ---: | ---: |",
    ...report.topics
      .slice(0, limit)
      .map((t) => `| ${cell(names.topic(t.topicId))} | ${t.learners} | ${t.lessons} | ${percent(t.failRate)} |`),
    "",
    "## Knowledge points by first answers",
    "",
    "| Topic | Knowledge point | Learners | Right first time | Right overall | Skipped |",
    "| :--- | :--- | ---: | ---: | ---: | ---: |",
    ...report.kps
      .slice(0, limit)
      .map(
        (k) =>
          `| ${cell(names.topic(k.topicId))} | ${cell(names.kp(k.topicId, k.kp))} | ${k.learners} | ${percent(k.firstTryRate)} | ${percent(k.correctRate)} | ${percent(k.skipRate)} |`,
      ),
    "",
    "## Common wrong responses",
    "",
    "Each deserves a listed mistake with feedback of its own, or a sentence in the explanation.",
    "",
    "| Topic | Knowledge point | Response | Learners |",
    "| :--- | :--- | :--- | ---: |",
    ...report.kps
      .flatMap((k) => k.wrong.filter((w) => w.learners >= 2).map((w) => ({ k, w })))
      .sort((a, b) => b.w.learners - a.w.learners)
      .slice(0, limit)
      .map(
        ({ k, w }) => `| ${cell(names.topic(k.topicId))} | ${cell(names.kp(k.topicId, k.kp))} | \`${cell(w.response)}\` | ${w.learners} |`,
      ),
    "",
    "## Rejected sentences to read",
    "",
    "A person reads these: a valid sentence among them is a defect of the item, and its pattern must accept it.",
    "",
    "| Topic | Knowledge point | Response |",
    "| :--- | :--- | :--- |",
    ...report.kps.flatMap((k) =>
      k.rejectedSentences.map((response) => `| ${cell(names.topic(k.topicId))} | ${cell(names.kp(k.topicId, k.kp))} | ${cell(response)} |`),
    ),
    "",
  ];
  return lines.join("\n");
}
