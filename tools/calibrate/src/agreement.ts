/** MIN_TEXTS is how many texts scored by two people a criterion needs before a route on it can pass (*starting*). */
export const MIN_TEXTS = 100;

/** MAX_KAPPA_GAP is how far below the people's agreement with each other a route's agreement with people may fall and still pass (*starting*). */
export const MAX_KAPPA_GAP = 0.05;

/** ScoredText is one text of a calibration set: the task it answers and what two people said of each criterion. */
export interface ScoredText {
  readonly id: string;
  readonly task: { readonly prompt: string; readonly modelAnswer: string; readonly source?: string };
  readonly text: string;
  /** scores holds, for each criterion key (id@version), whether the first and the second person found it met. */
  readonly scores: Readonly<Record<string, readonly [boolean, boolean]>>;
}

const isTask = (v: unknown): v is ScoredText["task"] => {
  const t = v as Record<string, unknown> | null;
  return (
    typeof t === "object" &&
    t !== null &&
    typeof t.prompt === "string" &&
    typeof t.modelAnswer === "string" &&
    (t.source === undefined || typeof t.source === "string")
  );
};

/** parseScoredSet reads a calibration set in JSON Lines, one ScoredText per line, and throws naming the first bad line. */
export function parseScoredSet(jsonl: string): ScoredText[] {
  const out: ScoredText[] = [];
  const seen = new Set<string>();
  jsonl.split("\n").forEach((line, i) => {
    if (!line.trim()) return;
    const bad = (why: string) => new Error(`line ${i + 1}: ${why}`);
    let v: Record<string, unknown>;
    try {
      v = JSON.parse(line) as Record<string, unknown>;
    } catch {
      throw bad("not JSON");
    }
    if (typeof v.id !== "string" || !v.id) throw bad("no id");
    if (seen.has(v.id)) throw bad(`id ${v.id} repeats`);
    if (!isTask(v.task)) throw bad("task needs a prompt and a modelAnswer");
    if (typeof v.text !== "string" || !v.text.trim()) throw bad("no text");
    const scores = v.scores as Record<string, unknown> | undefined;
    if (typeof scores !== "object" || scores === null) throw bad("no scores");
    for (const [key, s] of Object.entries(scores))
      if (!Array.isArray(s) || s.length !== 2 || s.some((x) => typeof x !== "boolean")) throw bad(`scores of ${key} are not two booleans`);
    seen.add(v.id);
    out.push({ id: v.id, task: v.task, text: v.text, scores: scores as ScoredText["scores"] });
  });
  return out;
}

/**
 * cohensKappa is the agreement of two raters on yes-or-no labels beyond what
 * chance gives. When chance alone predicts full agreement, it is 1 if they
 * agree throughout and 0 otherwise.
 */
export function cohensKappa(a: readonly boolean[], b: readonly boolean[]): number {
  if (a.length !== b.length || a.length === 0) throw new Error("kappa needs two label lists of the same nonzero length");
  const n = a.length;
  const agree = a.filter((x, i) => x === b[i]).length / n;
  const yesA = a.filter(Boolean).length / n;
  const yesB = b.filter(Boolean).length / n;
  const chance = yesA * yesB + (1 - yesA) * (1 - yesB);
  if (chance === 1) return agree === 1 ? 1 : 0;
  return (agree - chance) / (1 - chance);
}

/** Agreement is how a route's labels compare with people's on one criterion. */
export interface Agreement {
  readonly texts: number;
  /** kappa is the mean of the route's kappa with each person. */
  readonly kappa: number;
  /** humanKappa is the people's kappa with each other. */
  readonly humanKappa: number;
  readonly passed: boolean;
  /** disagreements are the ids of texts on which the route differs from both people. */
  readonly disagreements: readonly string[];
}

/**
 * agreement compares a route's labels with two people's: it passes when enough
 * texts were scored and the route's kappa is within MAX_KAPPA_GAP of the
 * people's. A text the route failed to judge has no label and counts against it,
 * as a label opposite to the first person's.
 */
export function agreement(
  ids: readonly string[],
  people: readonly (readonly [boolean, boolean])[],
  route: readonly (boolean | undefined)[],
  minTexts = MIN_TEXTS,
): Agreement {
  const first = people.map((p) => p[0]);
  const second = people.map((p) => p[1]);
  const labels = route.map((r, i) => r ?? !first[i]);
  const kappa = (cohensKappa(labels, first) + cohensKappa(labels, second)) / 2;
  const humanKappa = cohensKappa(first, second);
  return {
    texts: ids.length,
    kappa,
    humanKappa,
    passed: ids.length >= minTexts && kappa >= humanKappa - MAX_KAPPA_GAP,
    disagreements: ids.filter((_, i) => labels[i] !== first[i] && labels[i] !== second[i]),
  };
}
