// A pack is what one directory of English content contributes to the subject, so that several authors can each
// work in a directory of their own while the subject gathers them in `packs.ts`.

import type { ConversationDef, CourseDef, LexiconEntry, ReadingUnitDef, TopicDef } from "@ga/content";

/** Strand is the id of one of the strands English declares in `index.ts`. */
export type Strand = "vocabulary" | "grammar" | "listening" | "speaking" | "reading" | "writing";

/** WordBatch is the words a vocabulary topic teaches, as every spelling a passage may use. */
export interface WordBatch {
  readonly topic: string;
  readonly words: readonly string[];
}

/** Pack is the content of one directory: its topics, courses, reading units, conversations and words. */
export interface Pack {
  readonly topics: readonly TopicDef[];
  readonly courses: readonly CourseDef[];
  readonly reading: readonly ReadingUnitDef[];
  readonly conversations: readonly ConversationDef[];
  /** lexicon are the words its passages use that no other pack's lexicon lists. */
  readonly lexicon: readonly LexiconEntry[];
  /**
   * vocabulary are the words its vocabulary topics teach. In a pack of a level, every word of a passage is taught
   * by a batch of this level or a lower one, and the passage needs that batch's topic.
   */
  readonly vocabulary: readonly WordBatch[];
  /** passageWords are the fewest and most running words of its passages. */
  readonly passageWords: readonly [min: number, max: number];
}

/** emptyPack is a pack with nothing in it yet. */
export const emptyPack: Pack = {
  topics: [],
  courses: [],
  reading: [],
  conversations: [],
  lexicon: [],
  vocabulary: [],
  passageWords: [140, 260],
};

/** inStrand gives each topic the strand, unless it names one itself. */
export function inStrand(strand: Strand, topics: readonly TopicDef[]): readonly TopicDef[] {
  return topics.map((topic) => (topic.strand === undefined ? { ...topic, strand } : topic));
}
