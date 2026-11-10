// Grades 3 to 5: the words the passages of the course use that the lexicon of the skill courses does not list. Each
// spelling is an entry of its own, so that a spelling another pack already lists does not hide the others.

import type { LexiconEntry } from "@ga/content";

const words = `
appears beautiful belt bitterly bounces brighter brightest bands chunk chunks circling closest connect countries
curve darkness degrees dirty dusty escape explore flowed follows footprints freezing highest imagined lump
lunchtime minds mirror moons objects oven peoples photos planets pointed robot robots rockets rocky rovers rust
sending shining shooting solar someday spacecraft spaceship spoon star stars streaks sunrise sun's swings testing
traveled twenty-four unusual
`;

/** lexicon35 are the words of the passages of grades 3 to 5 outside the shared lexicon. */
export const lexicon35: readonly LexiconEntry[] = words
  .split(/\s+/)
  .filter((word) => word !== "")
  .map((word) => ({ word }));
