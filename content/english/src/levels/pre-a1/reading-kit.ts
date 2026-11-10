// A kit for the passages of the levels, used by every level from Pre-A1 up. A passage of a level may use only the
// words that the vocabulary batches of its level and the levels below teach, and it needs the topics of the batches
// it uses; the kit finds those topics in the body, so that the list of topics always matches the words.

import { bodyWords, type PassageDef, type PassageQuestionDef, t } from "@ga/content";
import type { WordBatch } from "../../pack.ts";

/** Pair is a text in English and in Simplified Chinese, in that order. */
export type Pair = readonly [en: string, zh: string];

/** QuestionSpec is a comprehension question as pairs: the prompt, the right option, the wrong ones and the solution. */
export type QuestionSpec = readonly [prompt: Pair, right: Pair, wrong: readonly Pair[], solution: Pair];

/** PassageSpec is a passage of a level before its vocabulary topics are found. */
export interface PassageSpec {
  readonly id: string;
  readonly title: Pair;
  readonly body: string;
  /** grammar are the grammar and writing topics the passage practices, besides the batches of its words. */
  readonly grammar?: readonly string[];
  readonly names?: readonly string[];
  readonly glossed?: readonly string[];
  readonly questions: readonly QuestionSpec[];
}

/** ownWeight is the weight of a batch of the passage's own unit, and of a grammar topic it practices. */
const ownWeight = 0.3;
/** earlierWeight is the weight of a batch of another unit whose words the passage also uses. */
const earlierWeight = 0.2;

/** passageXp gives the minutes of reading a passage of so many words and answering its questions at a low level. */
export const passageXp = (words: number) => 2 + Math.ceil(words / 40);

/**
 * passageMaker returns a builder of passages for a unit. batches are the vocabulary of the level and the levels
 * below; own are the topics of the unit, whose batches weigh more. A word no batch teaches is left for the tests
 * of the packs to report.
 */
export function passageMaker(batches: readonly WordBatch[], own: readonly string[]) {
  const topicOf = new Map<string, string>();
  for (const batch of batches) for (const word of batch.words) topicOf.set(word.toLowerCase(), batch.topic);
  const mine = new Set(own);
  return (spec: PassageSpec): PassageDef => {
    const free = new Set([...(spec.names ?? []), ...(spec.glossed ?? [])].map((w) => w.toLowerCase()));
    const words = bodyWords(spec.body);
    const used = new Set<string>();
    for (const word of words) {
      const topic = free.has(word) ? undefined : topicOf.get(word);
      if (topic !== undefined) used.add(topic);
    }
    const topics = [
      ...[...used].map((topic) => ({ topic, weight: mine.has(topic) ? ownWeight : earlierWeight })),
      ...(spec.grammar ?? []).filter((topic) => !used.has(topic)).map((topic) => ({ topic, weight: ownWeight })),
    ];
    const questions = spec.questions.map(
      ([prompt, right, wrong, solution]): PassageQuestionDef => ({
        prompt: t(...prompt),
        right: t(...right),
        wrong: wrong.map((w) => t(...w)),
        solution: t(...solution),
      }),
    );
    return {
      id: spec.id,
      title: t(...spec.title),
      body: spec.body,
      topics,
      ...(spec.names !== undefined && { names: spec.names }),
      ...(spec.glossed !== undefined && { glossed: spec.glossed }),
      xp: passageXp(words.length),
      questions,
    };
  };
}
