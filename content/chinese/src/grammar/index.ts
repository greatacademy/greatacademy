// The grammar topics of the Chinese subject: punctuation, faulty sentences, connectives, sentence forms and rhetoric for
// native learners (docs/chinese-curriculum.md §6), each topic following the one before it of its kind.

import type { TopicDef } from "@ga/content";

import { drillTopic } from "./drill.ts";
import { type DrillData, drillData } from "./drill-data.ts";
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

/** chained builds the drill topics of a kind, each following the one before it. */
const chained = (data: readonly DrillData[]): readonly GradeTopic[] =>
  data.map(({ grade, ...spec }, i) => ({ grade, topic: drillTopic({ ...spec, prerequisites: i === 0 ? [] : [data[i - 1]!.id] }) }));

/** connectiveTopics are the topics of connectives, in order. */
export const connectiveTopics: readonly GradeTopic[] = chained(drillData.connectives);

/** sentenceTopics are the topics of changing a sentence's form, in order. */
export const sentenceTopics: readonly GradeTopic[] = chained(drillData.sentences);

/** rhetoricTopics are the topics of rhetorical devices, in order. */
export const rhetoricTopics: readonly GradeTopic[] = chained(drillData.rhetoric);

/** grammarTopics are every grammar topic. */
export const grammarTopics: readonly TopicDef[] = [
  ...punctuationTopics,
  ...faultyTopics,
  ...connectiveTopics,
  ...sentenceTopics,
  ...rhetoricTopics,
].map((g) => g.topic);
