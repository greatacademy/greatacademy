// The topics of A1: words, grammar and writing, by theme. See docs/english-courses/english-a1.md.

import type { TopicDef } from "@ga/content";
import type { WordBatch } from "../../pack.ts";
import * as aboutMe from "./about-me.ts";
import * as clothes from "./clothes.ts";
import * as food from "./food.ts";
import * as freeTime from "./free-time.ts";
import * as home from "./home.ts";
import * as jobs from "./jobs.ts";
import * as library from "./library.ts";
import * as myDay from "./my-day.ts";
import * as school from "./school.ts";
import * as timeAndDates from "./time-and-dates.ts";
import * as town from "./town.ts";
import * as weather from "./weather.ts";

const units = [aboutMe, myDay, timeAndDates, food, clothes, home, freeTime, school, library, weather, jobs, town];

/** topics are the topics of A1. */
export const topics: readonly TopicDef[] = units.flatMap((unit) => unit.topics);

/** vocabulary are the words that the vocabulary topics of A1 teach. */
export const vocabulary: readonly WordBatch[] = units.flatMap((unit) => unit.vocabulary);
