import type { KnowledgePointDef, TopicDef } from "@ga/content";

import { oneOfFourTopic } from "./one-of-four.ts";
import { polishTopic } from "./polish.ts";

/** AddedPoints maps topic ids to knowledge points added after the topic's own. */
export type AddedPoints = Readonly<Record<string, readonly KnowledgePointDef[]>>;

/** addedPointXp is the expected minutes that one added knowledge point adds to its topic. */
export const addedPointXp = 3;

/** finishTopics applies the passes every topic goes through: added knowledge points, in the order of the maps, each adding to the topic's XP, then one-of-four choices and text polish. */
export function finishTopics(topics: readonly TopicDef[], added: readonly AddedPoints[]): readonly TopicDef[] {
  return topics.map((topic) => {
    const points = added.flatMap((map) => map[topic.id] ?? []);
    return polishTopic(
      oneOfFourTopic({
        ...topic,
        xp: topic.xp + points.length * addedPointXp,
        knowledgePoints: [...topic.knowledgePoints, ...points],
      }),
    );
  });
}
