/** DAY is one day in milliseconds; the engine measures time in milliseconds since the epoch. */
export const DAY = 86_400_000;

/**
 * Params are the tunable constants of the engine. They are documented, with
 * their rationale, in docs/learning-engine.md §8.
 */
export interface Params {
  /** baseIntervalDays is the review interval after a first successful lesson (repNum 0). */
  readonly baseIntervalDays: number;
  /** intervalGrowth is the factor by which the interval grows per repetition. */
  readonly intervalGrowth: number;
  /** maxIntervalDays caps the review interval. */
  readonly maxIntervalDays: number;
  /** dueMemory is the memory at or below which a topic is due for review. */
  readonly dueMemory: number;
  /** failPenalty is the number of repetitions an explicit failure removes. */
  readonly failPenalty: number;
  /** implicitPenaltyScale scales the penalty that flows from a failed topic to the topics that encompass it. */
  readonly implicitPenaltyScale: number;
  /** minCoverWeight is the smallest encompassing weight for which a review counts as covering a due topic. */
  readonly minCoverWeight: number;
  /** minSpeed and maxSpeed bound a learner's speed on a topic. */
  readonly minSpeed: number;
  readonly maxSpeed: number;
  /** placedRepNum is the repetition number of topics the diagnostic places as known. */
  readonly placedRepNum: number;
  /** kpStreak is the number of consecutive correct answers that passes a knowledge point. */
  readonly kpStreak: number;
  /** kpMaxQuestions is the number of questions after which an unpassed knowledge point fails the lesson. */
  readonly kpMaxQuestions: number;
  /** reviewQuestions and reviewPass: a review asks reviewQuestions questions and passes with reviewPass correct. */
  readonly reviewQuestions: number;
  readonly reviewPass: number;
  /** quizEveryXp is the XP earned between quizzes. */
  readonly quizEveryXp: number;
  /** quizQuestions is the number of questions of a quiz; quizMinTopics the learned topics needed before the first. */
  readonly quizQuestions: number;
  readonly quizMinTopics: number;
  /** quizCredit is the explicit credit of one correct quiz answer, as a fraction of a full review. */
  readonly quizCredit: number;
  /** quizXp is the XP of a perfect quiz. */
  readonly quizXp: number;
  /** minLessonShare is the smallest fraction of offered tasks that are lessons when lessons are available. */
  readonly minLessonShare: number;
}

/** defaultParams are the engine's parameters until calibration (roadmap P10). */
export const defaultParams: Params = {
  baseIntervalDays: 1,
  intervalGrowth: 2.5,
  maxIntervalDays: 365,
  dueMemory: 0.5,
  failPenalty: 1,
  implicitPenaltyScale: 0.5,
  minCoverWeight: 0.5,
  minSpeed: 0.5,
  maxSpeed: 1.5,
  placedRepNum: 1,
  kpStreak: 2,
  kpMaxQuestions: 5,
  reviewQuestions: 3,
  reviewPass: 2,
  quizEveryXp: 150,
  quizQuestions: 8,
  quizMinTopics: 4,
  quizCredit: 0.5,
  quizXp: 15,
  minLessonShare: 0.25,
};
