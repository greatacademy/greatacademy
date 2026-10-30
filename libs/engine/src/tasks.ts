import type { Rng } from "@ga/content";

import type { CourseScope, EngineGraph } from "./graph.ts";
import type { Params } from "./params.ts";
import { isDue, type LearnerState, memory } from "./state.ts";

/** Task is a unit of work offered to the learner. */
export type Task =
  | { readonly kind: "diagnostic" }
  | { readonly kind: "lesson"; readonly topic: string }
  /** covers are the due topics this review is expected to repair, itself included when due. */
  | { readonly kind: "review"; readonly topic: string; readonly covers: readonly string[] }
  | { readonly kind: "quiz" };

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

/** dueTopics lists the learned topics in scope due for review at now, most forgotten first. */
export function dueTopics(pl: Planner, state: LearnerState, now: number): string[] {
  const p = pl.params;
  return pl.scope.topics
    .filter((t) => !pl.scope.assumed.has(t) && state.topics[t] && isDue(p, state.topics[t]!, now))
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
  const candidates = pl.scope.topics.filter((t) => !pl.scope.assumed.has(t) && state.topics[t]?.learned);
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
 * the topics in scope not yet known. Topics learned in another course of the
 * subject are not asked again.
 */
export function diagnosticCandidates(pl: Planner, state: LearnerState): string[] {
  return pl.scope.topics.filter((t) => !isKnown(pl, state, t));
}

/** diagnosticDue tells whether the course's diagnostic is still to be offered: not yet taken or skipped, with topics left to place. */
export function diagnosticDue(pl: Planner, state: LearnerState): boolean {
  return !state.diagnosed.includes(pl.scope.course) && diagnosticCandidates(pl, state).length > 0;
}

/**
 * nextTasks offers the learner's next tasks, at most `limit`:
 * 1. the diagnostic, alone, until the learner is placed in the course;
 * 2. a quiz when one is due;
 * 3. remedial reviews of the key prerequisites that failed lessons wait
 *    for, then reviews of the other due topics, compressed, after removing
 *    the due topics the offered lessons and remedial reviews will repair;
 * 4. lessons from the frontier, at least minLessonShare of the tasks when
 *    any are available, so that reviews never crowd out new learning.
 * Reviews and lessons alternate, reviews first, unless the learner has
 * taken maxReviewStreak reviews since the last lesson: then a lesson comes
 * first, so that a learner who always takes the first task is not held in
 * reviews that keep coming due.
 */
export function nextTasks(pl: Planner, state: LearnerState, now: number, limit = 6): Task[] {
  if (diagnosticDue(pl, state)) return [{ kind: "diagnostic" }];
  const tasks: Task[] = [];
  if (quizDue(pl, state)) tasks.push({ kind: "quiz" });
  const room = limit - tasks.length;
  const due = dueTopics(pl, state, now);
  const lessonsAvailable = frontier(pl, state);
  const minLessons = Math.min(lessonsAvailable.length, Math.ceil(room * pl.params.minLessonShare));
  const lessonsFirst = lessonsAvailable.slice(0, Math.max(minLessons, room));
  const dueSet = new Set(due);
  const remedial = remedialTopics(pl, state);
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
  return tasks;
}

/**
 * quizPlan chooses the topics a quiz asks, one question each: the most
 * recently learned topics first (the quiz checks what was learned since the
 * last one), then a random sample of older ones.
 */
export function quizPlan(pl: Planner, state: LearnerState, rng: Rng): string[] {
  const learned = pl.scope.topics
    .filter((t) => state.topics[t]?.learned)
    .sort((a, b) => (state.topics[b]!.learnedAt ?? 0) - (state.topics[a]!.learnedAt ?? 0));
  const n = Math.min(pl.params.quizQuestions, learned.length);
  const recent = learned.slice(0, Math.ceil(n * 0.75));
  const older = rng.sample(learned.slice(recent.length), n - recent.length);
  return rng.shuffle([...recent, ...older]);
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
