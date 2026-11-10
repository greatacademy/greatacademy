// The topics of B2: words, grammar and writing, by theme. See docs/english-courses/english-b2.md.

import type { TopicDef } from "@ga/content";
import type { WordBatch } from "../../pack.ts";
import * as climate from "./climate.ts";
import * as culture from "./culture.ts";
import * as economy from "./economy.ts";
import * as education from "./education.ts";
import * as law from "./law.ts";
import * as media from "./media.ts";
import * as mind from "./mind.ts";
import * as science from "./science.ts";
import * as society from "./society.ts";
import * as technology from "./technology.ts";

const units = [society, economy, science, climate, media, education, culture, technology, law, mind];

/** topics are the topics of B2. */
export const topics: readonly TopicDef[] = units.flatMap((unit) => unit.topics);

/** vocabulary are the words that the vocabulary topics of B2 teach. */
export const vocabulary: readonly WordBatch[] = units.flatMap((unit) => unit.vocabulary);
