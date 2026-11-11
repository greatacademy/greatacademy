// Grade 5: helpers that list a topic's prerequisites and what it encompasses, as the outline names them.

import type { TopicDef } from "@ga/content";

/** after lists a topic's prerequisites as the outline names them, without repeats. */
export const after = (...ids: readonly string[]): string[] => [...new Set(ids)];

/** covers lists what a topic encompasses, each with the same weight. */
export const covers = (weight: number, ...ids: readonly string[]): TopicDef["encompasses"] =>
  after(...ids).map((topic) => ({ topic, weight }));
