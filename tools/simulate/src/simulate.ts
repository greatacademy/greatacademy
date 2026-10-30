import { type CompiledSubject, createRng, type Rng } from "@ga/content";
import {
  answerDiagnostic,
  answerLesson,
  applyEvent,
  courseScope,
  DAY,
  defaultParams,
  diagnosticCandidates,
  type EngineEvent,
  engineGraph,
  finishDiagnostic,
  initialState,
  type LearnerState,
  memory,
  nextDiagnosticTopic,
  nextTasks,
  type Params,
  type Planner,
  quizPlan,
  reviewPlan,
  startDiagnostic,
  startLesson,
} from "@ga/engine";

/** Student describes a simulated learner. */
export interface Student {
  /** ability is the probability of answering a freshly learned question correctly. */
  readonly ability: number;
  /** xpPerDay is the XP the student earns each study day before stopping. */
  readonly xpPerDay: number;
  /** knows are topics the student knows before starting; the diagnostic should find them. */
  readonly knows?: readonly string[];
}

/** Report summarizes a simulation. */
export interface Report {
  readonly days: number;
  readonly finished: boolean;
  readonly lessons: number;
  readonly failedLessons: number;
  readonly reviews: number;
  readonly quizzes: number;
  readonly taughtTopics: number;
  readonly reviewsPerTopic: number;
  readonly xp: number;
}

/**
 * simulate runs a student through a course one study day at a time, always
 * taking the first offered task, until every course topic is learned or
 * maxDays pass. The chance of a correct answer is ability, reduced as the
 * engine's memory estimate decays: ability · (0.6 + 0.4 · memory).
 */
export function simulate(
  subject: CompiledSubject,
  courseId: string,
  student: Student,
  seed: number,
  maxDays = 365,
  params: Params = defaultParams,
): Report {
  const graph = engineGraph(subject.graph);
  const course = subject.courses.get(courseId);
  if (!course) throw new Error(`unknown course ${courseId}`);
  const pl: Planner = { params, graph, scope: courseScope(graph, course) };
  const ctx = { params, graph };
  const rng: Rng = createRng(seed);
  const knows = new Set(student.knows ?? []);
  let state: LearnerState = initialState;
  let lessons = 0;
  let failedLessons = 0;
  let reviews = 0;
  const start = Date.UTC(2026, 0, 5, 16);
  const record = (e: EngineEvent) => {
    state = applyEvent(ctx, state, e);
  };
  const chance = (topic: string, now: number) => {
    const s = state.topics[topic];
    return student.ability * (s ? 0.6 + 0.4 * memory(params, s, now) : knows.has(topic) ? 1 : 0.15);
  };

  for (let day = 0; day < maxDays; day++) {
    let now = start + day * DAY;
    const xpGoal = state.xp + student.xpPerDay;
    let guard = 0;
    while (state.xp < xpGoal && guard++ < 50) {
      const task = nextTasks(pl, state, now, 6)[0];
      if (!task) break;
      if (task.kind === "diagnostic") {
        let d = startDiagnostic(diagnosticCandidates(pl, state));
        for (let t = nextDiagnosticTopic(graph, d); t; t = nextDiagnosticTopic(graph, d))
          d = answerDiagnostic(graph, d, t, rng.bool(knows.has(t) ? 0.95 : 0.05));
        const placement = finishDiagnostic(d);
        record({ type: "placed", at: now, course: courseId, ...placement });
      } else if (task.kind === "lesson") {
        const kpCount = graph.graph.topics.get(task.topic)!.knowledgePoints.length;
        let l = startLesson(task.topic, kpCount);
        while (!l.outcome) l = answerLesson(params, l, rng.bool(student.ability));
        lessons++;
        if (l.outcome === "failed") failedLessons++;
        record({ type: "lesson", at: now, topic: task.topic, passed: l.outcome === "passed", asked: l.asked, correct: l.correct });
      } else if (task.kind === "review") {
        const kps = reviewPlan(params, graph.graph.topics.get(task.topic)!.knowledgePoints.length, rng);
        const correct = kps.filter(() => rng.bool(chance(task.topic, now))).length;
        reviews++;
        record({ type: "review", at: now, topic: task.topic, correct, total: kps.length });
      } else {
        const topics = quizPlan(pl, state, rng);
        record({ type: "quiz", at: now, results: topics.map((topic) => ({ topic, correct: rng.bool(chance(topic, now)) })) });
      }
      now += 20 * 60_000;
    }
    const learned = [...pl.scope.inCourse].every((t) => state.topics[t]?.learned);
    if (learned) return report(day + 1, true);
  }
  return report(maxDays, false);

  function report(days: number, finished: boolean): Report {
    const taught = Object.values(state.topics).filter((s) => s.learned && !s.placed).length;
    return {
      days,
      finished,
      lessons,
      failedLessons,
      reviews,
      quizzes: state.quizzes,
      taughtTopics: taught,
      reviewsPerTopic: taught === 0 ? 0 : reviews / taught,
      xp: state.xp,
    };
  }
}
