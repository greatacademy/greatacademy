/** Mark is how one segment of a session's steps bar shows: judged right or wrong, gone through, the one now, or to come. */
export type Mark = "right" | "wrong" | "done" | "current" | "future";

/** StepTarget is what a segment of the bar opens to look at: a lesson's explanation or worked example, an answered question, or the step now. */
export type StepTarget =
  | { readonly kind: "intro"; readonly knowledgePoint: number }
  | { readonly kind: "example"; readonly knowledgePoint: number }
  | { readonly kind: "answered"; readonly index: number }
  | { readonly kind: "current" };

/** Step is one segment of the bar; a multistep problem has a mark per part, other steps one. */
export interface Step {
  readonly kind: "intro" | "example" | "question";
  /** target is set where the step may be opened: those gone through and the one now. */
  readonly target?: StepTarget;
  readonly marks: readonly Mark[];
}

/** StepGroup is the steps of one knowledge point of a lesson, or every step of another session. */
export interface StepGroup {
  readonly knowledgePoint?: number;
  readonly steps: readonly Step[];
}

/** Stage is where a learner is in the knowledge point now: reading its explanation, its worked example, or answering. */
export type Stage = "intro" | "example" | "question";

/** AnsweredStep is a question answered earlier: its knowledge point and, per part, whether it was right (undefined where not judged yet). */
export interface AnsweredStep {
  readonly index: number;
  readonly knowledgePoint: number;
  readonly parts: readonly (boolean | undefined)[];
}

/** StepsInput is what the bar is drawn from, as a session tells it. */
export interface StepsInput {
  readonly kind: "lesson" | "review" | "reading" | "quiz" | "diagnostic";
  /** index is the question asked now. */
  readonly index: number;
  /** total is the number of questions where known in advance; for the diagnostic, the most it may ask; 0 otherwise. */
  readonly total: number;
  readonly lesson?: {
    readonly knowledgePoint: number;
    readonly knowledgePoints: number;
    readonly streak: number;
    readonly needed: number;
    readonly practice: boolean;
    readonly pass: number;
  };
  /** intros are the knowledge points whose explanation was reached, with whether each has a worked example. */
  readonly intros: readonly { readonly knowledgePoint: number; readonly example: boolean }[];
  readonly stage: Stage;
  readonly answered: readonly AnsweredStep[];
  /** current is the problem asked now: its parts, how many were answered, those parts' verdicts, and the verdict on the one asked once given. */
  readonly current: {
    readonly parts: number;
    readonly earlier: readonly (boolean | undefined)[];
    readonly verdict?: boolean;
  };
  /** slots are a quiz's questions, each answered or not. */
  readonly slots?: readonly { readonly answered: boolean }[];
}

const judged = (right: boolean | undefined): Mark => (right === undefined ? "done" : right ? "right" : "wrong");

function answeredStep(a: AnsweredStep): Step {
  return { kind: "question", target: { kind: "answered", index: a.index }, marks: a.parts.length ? a.parts.map(judged) : ["done"] };
}

function currentStep(input: StepsInput, live: boolean): Step {
  const { parts, earlier, verdict } = input.current;
  const marks: Mark[] = [];
  for (let i = 0; i < Math.max(1, parts); i++) {
    if (i < earlier.length) marks.push(judged(earlier[i]));
    else if (i === earlier.length) marks.push(!live ? "future" : verdict === undefined ? "current" : judged(verdict));
    else marks.push("future");
  }
  return { kind: "question", ...(live && { target: { kind: "current" } as const }), marks };
}

const future = (kind: Step["kind"]): Step => ({ kind, marks: ["future"] });

/**
 * sessionSteps lays out the bar of a session: in a lesson, a group per knowledge point with its explanation, worked
 * example and questions, the questions still needed to come; elsewhere a group of the questions. Questions added after
 * a wrong answer appear only once asked.
 */
export function sessionSteps(input: StepsInput): StepGroup[] {
  if (input.kind === "quiz" && input.slots) {
    return [
      {
        steps: input.slots.map((s, i) => ({
          kind: "question" as const,
          target: i === input.index ? { kind: "current" as const } : { kind: "answered" as const, index: i },
          marks: [i === input.index ? "current" : s.answered ? "done" : "future"],
        })),
      },
    ];
  }
  const lesson = input.lesson;
  if (!lesson) {
    // Where answers are judged only at the end, as in the diagnostic, the questions before show as gone through, not to open.
    const byIndex = new Map(input.answered.map((a) => [a.index, a]));
    const steps: Step[] = Array.from({ length: input.index }, (_, i): Step => {
      const a = byIndex.get(i);
      return a ? answeredStep(a) : { kind: "question", marks: ["done"] };
    });
    steps.push(currentStep(input, true));
    const left = Math.max(0, input.total - input.index - 1);
    for (let i = 0; i < left; i++) steps.push(future("question"));
    return [{ steps }];
  }
  const groups: StepGroup[] = [];
  const intros = new Map(input.intros.map((i) => [i.knowledgePoint, i.example]));
  for (let kp = 0; kp < lesson.knowledgePoints; kp++) {
    const steps: Step[] = [];
    const now = kp === lesson.knowledgePoint;
    if (kp > lesson.knowledgePoint) {
      if (!lesson.practice) steps.push(future("intro"), future("example"));
      for (let i = 0; i < lesson.pass; i++) steps.push(future("question"));
      groups.push({ knowledgePoint: kp, steps });
      continue;
    }
    const example = intros.get(kp);
    if (example !== undefined) {
      const at = (stage: Stage): Mark =>
        !now ? "done" : stage === input.stage ? "current" : order(stage) < order(input.stage) ? "done" : "future";
      const reached = (stage: Stage) => at(stage) !== "future";
      steps.push({
        kind: "intro",
        ...(reached("intro") && { target: { kind: "intro", knowledgePoint: kp } as const }),
        marks: [at("intro")],
      });
      if (example)
        steps.push({
          kind: "example",
          ...(reached("example") && { target: { kind: "example", knowledgePoint: kp } as const }),
          marks: [at("example")],
        });
    }
    steps.push(...input.answered.filter((a) => a.knowledgePoint === kp).map(answeredStep));
    if (now) {
      steps.push(currentStep(input, input.stage === "question"));
      // Counted as before a verdict, right or wrong: a question added after a wrong answer shows once asked.
      const left = Math.max(0, lesson.needed - lesson.streak - 1);
      for (let i = 0; i < left; i++) steps.push(future("question"));
    }
    groups.push({ knowledgePoint: kp, steps });
  }
  return groups;
}

const order = (stage: Stage) => (stage === "intro" ? 0 : stage === "example" ? 1 : 2);

/** stepTargets lists the steps that may be opened, in the bar's order, for moving back and forth through them. */
export function stepTargets(groups: readonly StepGroup[]): StepTarget[] {
  return groups.flatMap((g) => g.steps.flatMap((s) => (s.target ? [s.target] : [])));
}

/** sameTarget is true when two targets open the same step. */
export function sameTarget(a: StepTarget | undefined, b: StepTarget | undefined): boolean {
  if (!a || !b || a.kind !== b.kind) return false;
  if (a.kind === "current") return true;
  if (a.kind === "answered") return a.index === (b as typeof a).index;
  return a.knowledgePoint === (b as typeof a).knowledgePoint;
}
