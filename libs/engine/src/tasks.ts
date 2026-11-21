import type { GraphPassage, Rng } from "@ga/content";

import type { EngineEvent } from "./events.ts";
import type { CourseScope, EngineGraph } from "./graph.ts";
import type { Params } from "./params.ts";
import { isDue, type LearnerState, memory } from "./state.ts";

/** Task is a unit of work offered to the learner. */
export type Task =
  /** supplemental marks a diagnostic of the gaps left below what a diagnosed learner knows; see supplementalCandidates. */
  | { readonly kind: "diagnostic"; readonly supplemental?: true }
  | { readonly kind: "lesson"; readonly topic: string }
  /** covers are the due topics this review is expected to repair, itself included when due. */
  | { readonly kind: "review"; readonly topic: string; readonly covers: readonly string[] }
  /** retake marks the last quiz taken again with new questions, once its follow-up reviews are done. */
  | { readonly kind: "quiz"; readonly retake?: true }
  | { readonly kind: "reading"; readonly passage: string };

/** Planner bundles what task selection needs. */
export interface Planner {
  readonly params: Params;
  readonly graph: EngineGraph;
  readonly scope: CourseScope;
}

/** isKnown tells whether a topic counts as learned: learned in the state, or assumed by the course's mastery floor. */
export function isKnown(pl: Planner, state: LearnerState, topic: string): boolean {
  return pl.scope.assumed.has(topic) || state.topics[topic]?.learned === true;
}

/** unlocked tells whether a topic is not yet known while all its prerequisites are. */
function unlocked(pl: Planner, state: LearnerState, t: string): boolean {
  if (isKnown(pl, state, t)) return false;
  return pl.graph.graph.topics.get(t)!.prerequisites.every((pre) => isKnown(pl, state, pre));
}

/**
 * pendingRemedial lists the key prerequisites that a failed lesson on topic t
 * waits for: those learned (and not assumed) without a repetition since the
 * failure.
 */
function pendingRemedial(pl: Planner, state: LearnerState, t: string): string[] {
  const failedAt = state.topics[t]?.failedAt;
  if (failedAt === undefined) return [];
  return (pl.graph.keyPrerequisites.get(t) ?? []).filter((k) => {
    const s = state.topics[k];
    return !pl.scope.assumed.has(k) && s?.learned === true && s.last <= failedAt;
  });
}

/**
 * frontier lists the topics the learner can learn next, in teaching order:
 * not yet learned, with every prerequisite known. A topic whose lesson was
 * failed waits until each of its key prerequisites has been reviewed since.
 */
export function frontier(pl: Planner, state: LearnerState): string[] {
  return pl.scope.topics.filter((t) => unlocked(pl, state, t) && pendingRemedial(pl, state, t).length === 0);
}

/**
 * remedialTopics lists the key prerequisites that failed lessons wait for, in
 * teaching order of the failed topics. They are reviewed whether due or not:
 * otherwise a learner whose lessons all failed could be left with nothing to
 * learn until those prerequisites happen to come due.
 */
export function remedialTopics(pl: Planner, state: LearnerState): string[] {
  const out = new Set<string>();
  for (const t of pl.scope.topics) if (unlocked(pl, state, t)) for (const k of pendingRemedial(pl, state, t)) out.add(k);
  return [...out];
}

/**
 * quizFollowUps lists the topics missed on the last quiz that are still to be
 * reviewed. They are reviewed at once, due or not: a quiz shows what has
 * slipped, and the review repairs it while the miss is fresh.
 */
export function quizFollowUps(pl: Planner, state: LearnerState): string[] {
  const missed = new Set(state.lastQuiz?.followUps ?? []);
  return pl.scope.topics.filter((t) => missed.has(t) && !pl.scope.assumed.has(t) && state.topics[t]?.learned);
}

/**
 * quizRetakeDue tells whether the last quiz may be taken again: it was not
 * perfect, not yet retaken, its follow-up reviews are done and no new quiz is
 * due. The retake is optional and asks the same topics with new questions.
 */
export function quizRetakeDue(pl: Planner, state: LearnerState): boolean {
  const q = state.lastQuiz;
  if (!q || q.retaken || q.correct >= q.topics.length || quizDue(pl, state)) return false;
  return quizFollowUps(pl, state).length === 0;
}

/** essayTopic tells whether a topic is an essay, which is never reviewed explicitly, quizzed or asked by the diagnostic. */
function essayTopic(pl: Planner, t: string): boolean {
  return pl.graph.graph.topics.get(t)?.essay === true;
}

/** spokenTopic tells whether a topic is answered aloud, which is never quizzed or asked by the diagnostic. */
function spokenTopic(pl: Planner, t: string): boolean {
  return pl.graph.graph.topics.get(t)?.spoken !== undefined;
}

/** dueTopics lists the learned topics in scope due for review at now, most forgotten first; an essay is never due. */
export function dueTopics(pl: Planner, state: LearnerState, now: number): string[] {
  const p = pl.params;
  return pl.scope.topics
    .filter((t) => !pl.scope.assumed.has(t) && !essayTopic(pl, t) && state.topics[t] && isDue(p, state.topics[t]!, now))
    .sort((a, b) => memory(p, state.topics[a]!, now) - memory(p, state.topics[b]!, now));
}

/** coverage lists the due topics that a repetition of topic would repair: itself, and the due topics it encompasses with weight at least minCoverWeight. */
export function coverage(pl: Planner, topic: string, due: ReadonlySet<string>): string[] {
  const out = due.has(topic) ? [topic] : [];
  for (const [t, w] of pl.graph.encompassed.get(topic) ?? []) if (w >= pl.params.minCoverWeight && due.has(t)) out.push(t);
  return out;
}

/**
 * compressReviews chooses explicit reviews that cover the due topics not
 * already covered by `covered` (the planned lessons), greedily: each step
 * takes the learned topic that covers the most uncovered due topics,
 * preferring a topic that is itself due, then the more advanced one. This is
 * repetition compression: one review of an advanced topic repairs the simpler
 * topics it encompasses.
 */
export function compressReviews(pl: Planner, state: LearnerState, due: readonly string[], covered: ReadonlySet<string>): Task[] {
  const open = new Set(due.filter((t) => !covered.has(t)));
  const candidates = pl.scope.topics.filter((t) => !pl.scope.assumed.has(t) && !essayTopic(pl, t) && state.topics[t]?.learned);
  const rank = new Map(pl.graph.graph.order.map((t, i) => [t, i]));
  const reviews: Task[] = [];
  while (open.size > 0) {
    let best: string | undefined;
    let bestCovers: string[] = [];
    for (const c of candidates) {
      const covers = coverage(pl, c, open);
      if (covers.length === 0) continue;
      const better =
        covers.length > bestCovers.length ||
        (covers.length === bestCovers.length && open.has(c) && !open.has(best!)) ||
        (covers.length === bestCovers.length && open.has(c) === open.has(best!) && rank.get(c)! > rank.get(best!)!);
      if (!best || better) {
        best = c;
        bestCovers = covers;
      }
    }
    if (!best) break;
    reviews.push({ kind: "review", topic: best, covers: bestCovers });
    for (const t of bestCovers) open.delete(t);
  }
  return reviews;
}

/** quizDue tells whether a quiz should be offered: enough XP since the last one and enough learned topics. */
export function quizDue(pl: Planner, state: LearnerState): boolean {
  const learned = pl.scope.topics.filter((t) => state.topics[t]?.learned).length;
  return state.xp - state.xpAtLastQuiz >= pl.params.quizEveryXp && learned >= pl.params.quizMinTopics;
}

/**
 * diagnosticCandidates are the topics a diagnostic of the course would place:
 * the topics in scope not yet known, but for essays and spoken topics. Topics
 * learned in another course of the subject are not asked again.
 */
export function diagnosticCandidates(pl: Planner, state: LearnerState): string[] {
  return pl.scope.topics.filter((t) => !isKnown(pl, state, t) && !essayTopic(pl, t) && !spokenTopic(pl, t));
}

/** diagnosticDue tells whether the course's diagnostic is still to be offered: not yet taken or skipped, with topics left to place. */
export function diagnosticDue(pl: Planner, state: LearnerState): boolean {
  return !state.diagnosed.includes(pl.scope.course) && diagnosticCandidates(pl, state).length > 0;
}

/**
 * supplementalCandidates are the gaps a supplemental diagnostic would place:
 * once the course's diagnostic is taken, the topics in scope not known and
 * never attempted, of which the learner knows a topic that builds on them,
 * but for essays, spoken topics and topics asked about before. They appear
 * when the graph or the course changes under a placed learner, as when a
 * course gains foundations: without asking, the learner would sit through
 * lessons on what their later topics show they probably know.
 */
export function supplementalCandidates(pl: Planner, state: LearnerState): string[] {
  if (!state.diagnosed.includes(pl.scope.course)) return [];
  const asked = new Set(state.supplemented ?? []);
  const inScope = new Set(pl.scope.topics);
  return pl.scope.topics.filter((t) => {
    if (isKnown(pl, state, t) || state.topics[t] || asked.has(t) || essayTopic(pl, t) || spokenTopic(pl, t)) return false;
    for (const d of pl.graph.descendants.get(t) ?? []) if (inScope.has(d) && state.topics[d]?.learned) return true;
    return false;
  });
}

/** supplementalDue tells whether a supplemental diagnostic is to be offered: at least supplementalMinTopics gaps. */
export function supplementalDue(pl: Planner, state: LearnerState): boolean {
  return supplementalCandidates(pl, state).length >= pl.params.supplementalMinTopics;
}

/**
 * retakeEvent is the event that starts a course's diagnostic over at time at: it forgets the course's topics that a
 * diagnostic placed, so they are asked again, and keeps those taught in lessons.
 */
export function retakeEvent(pl: Planner, state: LearnerState, at: number): Extract<EngineEvent, { type: "retake" }> {
  const forgotten = pl.scope.topics.filter((t) => state.topics[t]?.placed === true);
  return { type: "retake", at, course: pl.scope.course, forgotten };
}

/** knownWordShare is the share of a passage's running words a learner knows: all but those taught by topics not yet known. */
export function knownWordShare(pl: Planner, state: LearnerState, passage: GraphPassage): number {
  if (passage.words === 0) return 1;
  let unknown = 0;
  for (const [topic, count] of Object.entries(passage.wordsByTopic)) if (!isKnown(pl, state, topic)) unknown += count;
  return 1 - unknown / passage.words;
}

/**
 * nextPassage is the first passage of the course the learner can read: not read
 * yet, after the passage before it in its unit, with its topics known and enough
 * of its words known. A passage read before is never offered again.
 */
export function nextPassage(pl: Planner, state: LearnerState): string | undefined {
  const read = new Set(state.read ?? []);
  return pl.scope.passages.find((id) => {
    const passage = pl.graph.graph.passages.get(id)!;
    if (read.has(id) || (passage.previous !== undefined && !read.has(passage.previous))) return false;
    return passage.topics.every((e) => isKnown(pl, state, e.topic)) && knownWordShare(pl, state, passage) >= pl.params.readingKnownShare;
  });
}

/** readingDue tells whether reading is below its share of the learner's XP. */
export function readingDue(pl: Planner, state: LearnerState): boolean {
  return (state.readingXp ?? 0) < state.xp * pl.params.readingXpShare;
}

/**
 * nextTasks offers the learner's next tasks, at most `limit`:
 * 1. the diagnostic, alone, until the learner is placed in the course;
 * 2. a supplemental diagnostic when one is due, then a quiz when one is due;
 * 3. a passage to read when reading is below its share of the XP, so that a
 *    learner who always takes the first task reads too;
 * 4. remedial reviews: of the topics missed on the last quiz, and of the key
 *    prerequisites that failed lessons wait for; then reviews of the other
 *    due topics, compressed, after removing the due topics the offered
 *    lessons and remedial reviews will repair;
 * 5. lessons from the frontier, at least minLessonShare of the tasks when
 *    any are available, so that reviews never crowd out new learning;
 * 6. last, the optional retake of the last quiz, once it is due.
 * Reviews and lessons alternate, reviews first, unless the learner has
 * taken maxReviewStreak reviews since the last lesson: then a lesson comes
 * first, so that a learner who always takes the first task is not held in
 * reviews that keep coming due.
 */
export function nextTasks(pl: Planner, state: LearnerState, now: number, limit = 6): Task[] {
  if (diagnosticDue(pl, state)) return [{ kind: "diagnostic" }];
  const tasks: Task[] = [];
  if (supplementalDue(pl, state)) tasks.push({ kind: "diagnostic", supplemental: true });
  if (quizDue(pl, state)) tasks.push({ kind: "quiz" });
  const passage = readingDue(pl, state) ? nextPassage(pl, state) : undefined;
  if (passage) tasks.push({ kind: "reading", passage });
  const retake = quizRetakeDue(pl, state);
  const room = limit - tasks.length - (retake ? 1 : 0);
  const due = dueTopics(pl, state, now);
  const lessonsAvailable = frontier(pl, state);
  const minLessons = Math.min(lessonsAvailable.length, Math.ceil(room * pl.params.minLessonShare));
  const lessonsFirst = lessonsAvailable.slice(0, Math.max(minLessons, room));
  const dueSet = new Set(due);
  const remedial = [...new Set([...quizFollowUps(pl, state), ...remedialTopics(pl, state)])];
  const covered = new Set([...lessonsFirst.slice(0, minLessons), ...remedial].flatMap((t) => coverage(pl, t, dueSet)));
  const remedialReviews = remedial.map((topic): Task => ({ kind: "review", topic, covers: coverage(pl, topic, dueSet) }));
  const reviews = [...remedialReviews, ...compressReviews(pl, state, due, covered)].slice(0, room - minLessons);
  const lessons = lessonsFirst.slice(0, room - reviews.length).map((topic): Task => ({ kind: "lesson", topic }));
  const lessonFirst = state.reviewsSinceLesson >= pl.params.maxReviewStreak;
  const [first, second] = lessonFirst ? [lessons, reviews] : [reviews, lessons];
  for (let i = 0; i < Math.max(reviews.length, lessons.length); i++) {
    if (first[i]) tasks.push(first[i]!);
    if (second[i]) tasks.push(second[i]!);
  }
  if (retake) tasks.push({ kind: "quiz", retake: true });
  return tasks;
}

/**
 * quizPlan chooses the topics a quiz asks, one question each. A retake asks
 * the topics of the last quiz again. Otherwise the most recently learned
 * topics come first (the quiz checks what was learned since the last one),
 * then a random sample of older ones; topics the last quiz asked, and topics
 * another chosen topic encompasses and so already tests, are left for later
 * unless there are too few others.
 */
export function quizPlan(pl: Planner, state: LearnerState, rng: Rng, retake = false): string[] {
  if (retake && state.lastQuiz) return rng.shuffle([...state.lastQuiz.topics]);
  const lastAsked = new Set(state.lastQuiz?.topics ?? []);
  const learned = pl.scope.topics
    .filter((t) => state.topics[t]?.learned && !essayTopic(pl, t) && !spokenTopic(pl, t))
    .sort((a, b) => (state.topics[b]!.learnedAt ?? 0) - (state.topics[a]!.learnedAt ?? 0));
  const n = Math.min(pl.params.quizQuestions, learned.length);
  const fresh = learned.filter((t) => !lastAsked.has(t));
  const pool = fresh.length >= n ? fresh : [...fresh, ...learned.filter((t) => lastAsked.has(t))];
  const tested = (chosen: readonly string[], t: string) =>
    chosen.some((c) => (pl.graph.encompassed.get(c)?.get(t) ?? 0) >= pl.params.minCoverWeight);
  const recent: string[] = [];
  for (const t of pool) if (recent.length < Math.ceil(n * 0.75) && !tested(recent, t)) recent.push(t);
  const rest = pool.filter((t) => !recent.includes(t));
  const untested = rest.filter((t) => !tested(recent, t));
  const older = rng.sample(untested, Math.min(untested.length, n - recent.length));
  const filler = rest.filter((t) => !older.includes(t)).slice(0, n - recent.length - older.length);
  return rng.shuffle([...recent, ...older, ...filler]);
}

/** quizTimeLimitMs is how long a quiz of n questions may take. */
export function quizTimeLimitMs(p: Params, n: number): number {
  return n * p.quizSecondsPerQuestion * 1000;
}

/** CourseProgress summarizes a learner's progress in a course. */
export interface CourseProgress {
  readonly learned: number;
  readonly total: number;
  readonly due: number;
}

/** courseProgress counts the course topics learned (placed or taught) and the topics due. */
export function courseProgress(pl: Planner, state: LearnerState, now: number): CourseProgress {
  const inCourse = [...pl.scope.inCourse];
  return {
    learned: inCourse.filter((t) => state.topics[t]?.learned).length,
    total: inCourse.length,
    due: dueTopics(pl, state, now).length,
  };
}
