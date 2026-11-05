import type { KnowledgePointDef, TopicDef } from "@ga/content";

import { oneOfFourTopic } from "./one-of-four.ts";
import { polishTopic } from "./polish.ts";

/** AddedPoints maps topic ids to knowledge points added after the topic's own. */
export type AddedPoints = Readonly<Record<string, readonly KnowledgePointDef[]>>;

/** finishTopics applies the passes every topic goes through: added knowledge points, in the order of the maps, then one-of-four choices and text polish. */
export function finishTopics(topics: readonly TopicDef[], added: readonly AddedPoints[]): readonly TopicDef[] {
  return topics.map((topic) =>
    polishTopic(
      oneOfFourTopic({ ...topic, knowledgePoints: [...topic.knowledgePoints, ...added.flatMap((points) => points[topic.id] ?? [])] }),
    ),
  );
}
