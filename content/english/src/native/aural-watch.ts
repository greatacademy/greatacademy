// The Watch outs of the listening and reading-aloud topics of the native grades, written for each unit: what is easy
// to mishear in its passages, and which of its words and sentences are hard to read aloud.

import type { Text } from "@ga/content";

/** AuralWatch is a unit's own Watch outs: for its passages heard, and for its sentences and stretches read aloud. */
export interface AuralWatch {
  readonly passages: Text;
  readonly sentences: Text;
  readonly stretches: Text;
}

/** auralWatchOuts are the units' Watch outs, keyed by grade and unit: grade-6-ancient-rome. */
export const auralWatchOuts: Readonly<Record<string, AuralWatch>> = {};
