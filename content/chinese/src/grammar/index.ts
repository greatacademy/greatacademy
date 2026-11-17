// The grammar topics of the Chinese subject: punctuation and faulty sentences for native learners
// (docs/chinese-curriculum.md §6), each topic following the one before it of its kind.

import type { TopicDef } from "@ga/content";

import { faultyTopic } from "./faulty.ts";
import { faultyData } from "./faulty-data.ts";
import { punctuationTopic } from "./punctuation.ts";
import { punctuationData } from "./punctuation-data.ts";

/** GradeTopic is a topic and the grade that teaches it. */
export interface GradeTopic {
  readonly grade: number;
  readonly topic: TopicDef;
}

/** punctuationTopics are the punctuation topics, in order. */
export const punctuationTopics: readonly GradeTopic[] = punctuationData.map(({ grade, ...spec }, i) => ({
  grade,
  topic: punctuationTopic({ ...spec, prerequisites: i === 0 ? [] : [punctuationData[i - 1]!.id] }),
}));

/** faultyTopics are the faulty-sentence topics, in order. */
export const faultyTopics: readonly GradeTopic[] = faultyData.map(({ grade, ...spec }, i) => ({
  grade,
  topic: faultyTopic({ ...spec, prerequisites: i === 0 ? [] : [faultyData[i - 1]!.id] }),
}));

/** grammarTopics are every grammar topic. */
export const grammarTopics: readonly TopicDef[] = [...punctuationTopics, ...faultyTopics].map((g) => g.topic);
