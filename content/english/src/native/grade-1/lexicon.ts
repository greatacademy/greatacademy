// Grade 1: the words the passages of the course use that no other lexicon lists.

import type { LexiconEntry } from "@ga/content";

const words = `
chick gran licks pal plums pup twigs worm
`;

/** lexicon1 lists the words of the grade 1 passages that no other lexicon lists. */
export const lexicon1: readonly LexiconEntry[] = words
  .split(/\s+/)
  .filter((word) => word !== "")
  .map((word) => ({ word }));
