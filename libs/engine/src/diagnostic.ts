import type { EngineGraph } from "./graph.ts";
import type { Planner } from "./tasks.ts";

/**
 * DiagnosticProgress is the state of a placement diagnostic. Each answer
 * resolves more than the topic asked: a correct answer shows the topic and
 * all of its ancestors are known; a wrong answer (or "I don't know") shows
 * the topic and all of its descendants are not.
 */
export interface DiagnosticProgress {
  /** candidates are the topics to place, in teaching order. */
  readonly candidates: readonly string[];
  readonly known: readonly string[];
  readonly unknown: readonly string[];
  readonly asked: readonly { readonly topic: string; readonly correct: boolean }[];
  readonly maxQuestions: number;
}

/** diagnosticLength is the most questions a diagnostic of n topics asks: enough for a binary search of every chain, bounded by n. */
export function diagnosticLength(n: number): number {
  return Math.min(n, 4 + Math.ceil(2 * Math.log2(n + 1)));
}

/** startDiagnostic begins a diagnostic over candidate topics. */
export function startDiagnostic(candidates: readonly string[]): DiagnosticProgress {
  return { candidates, known: [], unknown: [], asked: [], maxQuestions: diagnosticLength(candidates.length) };
}

function unresolved(d: DiagnosticProgress): string[] {
  const resolved = new Set([...d.known, ...d.unknown]);
  return d.candidates.filter((t) => !resolved.has(t));
}

/**
 * nextDiagnosticTopic picks the question that resolves the most topics in the
 * worst case: the unresolved topic maximizing min(topics resolved if correct,
 * topics resolved if wrong). It returns undefined when the diagnostic is over.
 */
export function nextDiagnosticTopic(g: EngineGraph, d: DiagnosticProgress): string | undefined {
  const open = unresolved(d);
  if (open.length === 0 || d.asked.length >= d.maxQuestions) return undefined;
  const openSet = new Set(open);
  let best: string | undefined;
  let bestScore = -1;
  let bestTotal = -1;
  for (const t of open) {
    let up = 1;
    for (const a of g.graph.ancestors.get(t) ?? []) if (openSet.has(a)) up++;
    let down = 1;
    for (const x of g.descendants.get(t) ?? []) if (openSet.has(x)) down++;
    const score = Math.min(up, down);
    if (score > bestScore || (score === bestScore && up + down > bestTotal)) {
      best = t;
      bestScore = score;
      bestTotal = up + down;
    }
  }
  return best;
}

/** answerDiagnostic records the answer on topic and resolves what it implies. */
export function answerDiagnostic(g: EngineGraph, d: DiagnosticProgress, topic: string, correct: boolean): DiagnosticProgress {
  const candidates = new Set(d.candidates);
  const asked = [...d.asked, { topic, correct }];
  if (correct) {
    const known = new Set(d.known);
    for (const t of [topic, ...(g.graph.ancestors.get(topic) ?? [])]) if (candidates.has(t) && !d.unknown.includes(t)) known.add(t);
    return { ...d, asked, known: d.candidates.filter((t) => known.has(t)) };
  }
  const unknown = new Set(d.unknown);
  for (const t of [topic, ...(g.descendants.get(topic) ?? [])]) if (candidates.has(t) && !d.known.includes(t)) unknown.add(t);
  return { ...d, asked, unknown: d.candidates.filter((t) => unknown.has(t)) };
}

/** Placement is the result of a diagnostic: the topics placed as known, and which of them were tested directly. */
export interface Placement {
  readonly known: readonly string[];
  readonly tested: readonly string[];
}

/**
 * finishDiagnostic ends a diagnostic. Course topics left unresolved are treated
 * as not known: placement errs on the side of teaching. Foundations left
 * unresolved are placed as known only when the answers on foundations show the
 * learner has them: at least inferFoundationsMinAnswers answers, of which at
 * least inferFoundationsRate are correct.
 */
export function finishDiagnostic(pl: Planner, d: DiagnosticProgress): Placement {
  const { inCourse } = pl.scope;
  const correct = new Set(d.asked.filter((a) => a.correct).map((a) => a.topic));
  const foundationAnswers = d.asked.filter((a) => !inCourse.has(a.topic));
  const inferred =
    foundationAnswers.length >= pl.params.inferFoundationsMinAnswers &&
    foundationAnswers.filter((a) => a.correct).length >= pl.params.inferFoundationsRate * foundationAnswers.length;
  const known = new Set(d.known);
  const unknown = new Set(d.unknown);
  const placed = d.candidates.filter((t) => known.has(t) || (inferred && !inCourse.has(t) && !unknown.has(t)));
  return { known: placed, tested: d.known.filter((t) => correct.has(t)) };
}
