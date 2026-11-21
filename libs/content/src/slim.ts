// Topics whose problem banks are built when asked rather than kept: a subject with many large banks would otherwise hold
// them all in memory, more than the API server's heap holds (docs/content.md §4).

import type { Rng } from "./rng.ts";
import type { Difficulty, Problem, TopicDef } from "./types.ts";

/** KEPT is how many rebuilt builds are held strongly, the most recently used, across every slim topic. */
export const KEPT = 2;

/** recent are the rebuilt builds most recently used, the latest first, held so that a lesson does not rebuild its bank. */
const recent: (readonly TopicDef[])[] = [];

/** use marks a rebuilt build as the most recently used, letting go of the oldest beyond KEPT. */
function use(made: readonly TopicDef[]): void {
  if (recent[0] === made) return;
  const at = recent.indexOf(made);
  if (at >= 0) recent.splice(at, 1);
  recent.unshift(made);
  recent.length = Math.min(recent.length, KEPT);
}

/**
 * slimTopics builds topics once, keeping each topic but its knowledge points' generators, which build the topics again
 * on first use. The KEPT builds used last are held; the others weakly, so that memory can take them back. The build must
 * be deterministic.
 */
export function slimTopics(build: () => readonly TopicDef[]): readonly TopicDef[] {
  let held: WeakRef<readonly TopicDef[]> | undefined;
  const full = (): readonly TopicDef[] => {
    const made = held?.deref() ?? build();
    held = new WeakRef(made);
    use(made);
    return made;
  };
  return build().map((topic, j) => ({
    ...topic,
    knowledgePoints: topic.knowledgePoints.map(({ generate: _, ...kp }, i) => {
      // Only the id is held, not the knowledge point first built, whose generator holds its bank.
      const { id } = kp;
      return {
        ...kp,
        generate: (rng: Rng, difficulty?: Difficulty): Problem => {
          const again = full()[j]?.knowledgePoints[i];
          if (again?.id !== id) throw new Error(`slimTopics: ${id} built differently`);
          return again.generate(rng, difficulty);
        },
      };
    }),
  }));
}

/** slimmed makes a builder of one topic build slim topics (see slimTopics). */
export function slimmed<A extends readonly unknown[]>(build: (...args: A) => TopicDef): (...args: A) => TopicDef {
  return (...args: A): TopicDef => slimTopics(() => [build(...args)])[0]!;
}
