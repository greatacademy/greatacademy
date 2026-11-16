// Grade 2: the words the passages of the course use that no other lexicon lists.

import type { LexiconEntry } from "@ga/content";

const words = `
ant's beeped bumped grasshopper hunter's dinosaur dolls gulp hoop hummingbird hummingbirds sweepers
`;

/** lexicon2 lists the words of the grade 2 passages that no other lexicon lists. */
export const lexicon2: readonly LexiconEntry[] = words
  .split(/\s+/)
  .filter((word) => word !== "")
  .map((word) => ({ word }));
