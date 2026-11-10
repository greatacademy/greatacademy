// The topics of A2: words, grammar and writing, by theme. See docs/english-courses/english-a2.md.

import type { TopicDef } from "@ga/content";
import type { WordBatch } from "../../pack.ts";
import * as animals from "./animals.ts";
import * as cooking from "./cooking.ts";
import * as festivals from "./festivals.ts";
import * as health from "./health.ts";
import * as jobs from "./jobs.ts";
import * as lastWeekend from "./last-weekend.ts";
import * as nature from "./nature.ts";
import * as neighbors from "./neighbors.ts";
import * as shopping from "./shopping.ts";
import * as sports from "./sports.ts";
import * as technology from "./technology.ts";
import * as travel from "./travel.ts";

const units = [lastWeekend, health, neighbors, cooking, sports, animals, travel, nature, shopping, technology, festivals, jobs];

/** topics are the topics of A2. */
export const topics: readonly TopicDef[] = units.flatMap((unit) => unit.topics);

/** vocabulary are the words that the vocabulary topics of A2 teach. */
export const vocabulary: readonly WordBatch[] = units.flatMap((unit) => unit.vocabulary);
