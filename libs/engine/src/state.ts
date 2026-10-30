import { DAY, type Params } from "./params.ts";

/** TopicState is a learner's repetition state on one topic. */
export interface TopicState {
  /** learned is true once the lesson is passed or the diagnostic placed the topic as known. */
  readonly learned: boolean;
  /** placed marks topics learned through the diagnostic rather than a lesson. */
  readonly placed?: boolean;
  /** learnedAt is when the topic was learned. */
  readonly learnedAt?: number;
  /** repNum is the (fractional) number of successful spaced repetitions. */
  readonly repNum: number;
  /** last is the effective time of the last repetition: memory is 1 at last and halves every interval. */
  readonly last: number;
  /** speed is how quickly the learner masters this topic, in [minSpeed, maxSpeed]; 1 is typical. */
  readonly speed: number;
  /** failedAt is when the learner last failed the topic's lesson; the lesson waits for its key prerequisites to be reviewed. */
  readonly failedAt?: number;
  /** explicitReviews counts the reviews done on this topic, for analysis. */
  readonly explicitReviews: number;
}

/** LearnerState is everything the engine knows about a learner in one subject. */
export interface LearnerState {
  readonly topics: Readonly<Record<string, TopicState>>;
  /** diagnosed lists the courses whose diagnostic the learner took or skipped. */
  readonly diagnosed: readonly string[];
  readonly xp: number;
  /** xpAtLastQuiz is the XP total when the last quiz was taken. */
  readonly xpAtLastQuiz: number;
  readonly quizzes: number;
}

/** initialState is the state of a new learner. */
export const initialState: LearnerState = { topics: {}, diagnosed: [], xp: 0, xpAtLastQuiz: 0, quizzes: 0 };

/** newTopicState is the state of a topic just learned at time at. */
export function newTopicState(at: number, repNum: number, speed: number, placed: boolean): TopicState {
  return { learned: true, ...(placed && { placed }), learnedAt: at, repNum, last: at, speed, explicitReviews: 0 };
}

/** intervalMs is the review interval for a repetition number. */
export function intervalMs(p: Params, repNum: number): number {
  return Math.min(p.baseIntervalDays * p.intervalGrowth ** repNum, p.maxIntervalDays) * DAY;
}

/** memory is the estimated probability-like retention of a topic at time now, 1 right after a repetition and halving every interval. */
export function memory(p: Params, s: TopicState, now: number): number {
  return 2 ** (-Math.max(0, now - s.last) / intervalMs(p, s.repNum));
}

/** isDue tells whether a learned topic needs review at time now. */
export function isDue(p: Params, s: TopicState, now: number): boolean {
  return s.learned && memory(p, s, now) <= p.dueMemory;
}

/** dueAt is when a topic becomes due: memory reaches dueMemory. */
export function dueAt(p: Params, s: TopicState): number {
  return s.last + intervalMs(p, s.repNum) * Math.log2(1 / p.dueMemory);
}

/** clampSpeed bounds a speed to the parameters' range. */
export function clampSpeed(p: Params, speed: number): number {
  return Math.min(p.maxSpeed, Math.max(p.minSpeed, speed));
}
