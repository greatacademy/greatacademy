// The topics of B1: words, grammar and writing, by theme. See docs/english-courses/english-b1.md.

import type { TopicDef } from "@ga/content";
import type { WordBatch } from "../../pack.ts";
import * as arts from "./arts.ts";
import * as cities from "./cities.ts";
import * as common from "./common.ts";
import * as culture from "./culture.ts";
import * as education from "./education.ts";
import * as environment from "./environment.ts";
import * as health from "./health.ts";
import * as media from "./media.ts";
import * as money from "./money.ts";
import * as relationships from "./relationships.ts";
import * as science from "./science.ts";
import * as technology from "./technology.ts";
import * as work from "./work.ts";

const units = [education, work, health, environment, media, technology, culture, relationships, cities, science, money, arts, common];

/** topics are the topics of B1. */
export const topics: readonly TopicDef[] = units.flatMap((unit) => unit.topics);

/** vocabulary are the words that the vocabulary topics of B1 teach. */
export const vocabulary: readonly WordBatch[] = units.flatMap((unit) => unit.vocabulary);
