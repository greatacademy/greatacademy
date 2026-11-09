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
  /** inferFoundationsMinAnswers is the fewest answers on foundations from which a diagnostic may infer the foundations it did not resolve. */
  readonly inferFoundationsMinAnswers: number;
  /** inferFoundationsRate is the fraction of those answers that must be correct for it to place them as known. */
  readonly inferFoundationsRate: number;
  /** adviceMinTopics is the fewest topics of an earlier course a diagnostic must have resolved before it may point the learner to that course. */
  readonly adviceMinTopics: number;
  /** adviceWeakShare is the share of that XP the answers showed unknown that makes an earlier course the better start. */
  readonly adviceWeakShare: number;
  /** adviceAheadShare is the share of a course's XP placed as known that makes the course after it the better start. */
  readonly adviceAheadShare: number;
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
  /** maxReviewStreak is how many reviews in a row put a lesson, when one is available, first among the offered tasks. */
  readonly maxReviewStreak: number;
  /** xpPerfectBonus is the XP added to a task with every answer correct. */
  readonly xpPerfectBonus: number;
  /** xpNearlyPerfect is the accuracy from which a passed lesson earns its full XP. */
  readonly xpNearlyPerfect: number;
  /** xpNearlyPassable is the accuracy from which a failed lesson still earns xpNearlyPassableShare of its XP. */
  readonly xpNearlyPassable: number;
  readonly xpNearlyPassableShare: number;
  /** rushSeconds is the time under which a wrong answer counts as rushed, from serving the question to receiving the answer. */
  readonly rushSeconds: number;
  /** rushMinAnswers is the fewest rushed wrong answers that make a task blown off. */
  readonly rushMinAnswers: number;
  /** blowOffStep is how many blown-off tasks raise the penalty by one XP; the first of them cost nothing. */
  readonly blowOffStep: number;
  /** blowOffMaxPenalty caps the XP one blown-off task can cost. */
  readonly blowOffMaxPenalty: number;
  /** blowOffDecay is how much each passed task reduces the count of recent blown-off tasks. */
  readonly blowOffDecay: number;
  /** readingKnownShare is the share of a passage's running words a learner must know for it to be offered; contested in the literature, so to calibrate. */
  readonly readingKnownShare: number;
  /** readingXpShare is the most of a learner's XP that reading tasks are offered up to, so that reading never crowds out lessons. */
  readonly readingXpShare: number;
  /** readingCredit is the repetition a passage understood gives a topic it practices with weight 1. */
  readonly readingCredit: number;
  /** readingFailedXpShare is the share of a passage's XP earned when its check is failed: the time was spent reading all the same. */
  readonly readingFailedXpShare: number;
  /** readingRushWpm is the speed in words per minute above which a passage with a failed check counts as blown off. */
  readonly readingRushWpm: number;
  /** forecastOverhead is the XP of reviews and quizzes per XP of lessons, for estimating what a course still takes. */
  readonly forecastOverhead: number;
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
  inferFoundationsMinAnswers: 8,
  inferFoundationsRate: 0.85,
  adviceMinTopics: 5,
  adviceWeakShare: 0.3,
  adviceAheadShare: 0.8,
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
  maxReviewStreak: 4,
  xpPerfectBonus: 2,
  xpNearlyPerfect: 0.8,
  xpNearlyPassable: 0.5,
  xpNearlyPassableShare: 0.15,
  rushSeconds: 6,
  rushMinAnswers: 2,
  blowOffStep: 3,
  blowOffMaxPenalty: 10,
  blowOffDecay: 0.2,
  readingKnownShare: 0.98,
  readingXpShare: 0.2,
  readingCredit: 0.25,
  readingFailedXpShare: 0.5,
  readingRushWpm: 600,
  forecastOverhead: 1,
};
