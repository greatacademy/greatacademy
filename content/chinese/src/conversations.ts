// The spoken conversations of the Chinese levels 4 to 9 (docs/chinese-curriculum.md §8): four a level, each closing units
// 3, 6, 9 and 12 on the themes of the units before it. The tutor plays a part in Mandarin at the learner's level, through
// the voice service and the conversation prompt `conversation-zh-1`; an admin gives each a route before it is offered.

import type { ConversationDef, CourseDef, Text, UnitDef } from "@ga/content";

import { conversationData } from "./conversation-data.ts";

/** LevelConversation is a conversation of a level as written: the unit it closes, its parts and the tutor's scenario as lines. */
export interface LevelConversation {
  readonly level: number;
  /** unit is the unit it closes: 3, 6, 9 or 12. */
  readonly unit: number;
  /** id starts with `chinese-` and is kebab case; it never changes once published. */
  readonly id: string;
  readonly title: Text;
  readonly task: Text;
  /** scenario tells the tutor, in English, its part and what the learner must do, a line each. */
  readonly scenario: readonly string[];
  /** opening is the tutor's first line, in Chinese of the level. */
  readonly opening: string;
}

/** CLOSING_UNITS are the units a level's conversations close. */
const CLOSING_UNITS = [3, 6, 9, 12] as const;

/** levelPreamble tells the tutor the learner's level and to keep to Mandarin of that level. */
const levelPreamble = (level: number): string[] => [
  `The learner studies Chinese as a foreign language at level ${level} of 9, about HSK level ${level >= 7 ? "7–9" : level}. Speak only Mandarin, with words and grammar of that level, in short sentences.`,
  "If the learner seems lost, say the same thing again more simply in Mandarin; never switch to another language.",
];

/** checkConversations checks that each level from 4 to 9 has one conversation for each closing unit, with distinct ids. */
export function checkConversations(data: readonly LevelConversation[]): void {
  const ids = new Set<string>();
  for (const c of data) {
    if (!/^chinese-[a-z0-9]+(-[a-z0-9]+)*$/.test(c.id)) throw new Error(`conversation ${c.id}: the id must be chinese-… in kebab case`);
    if (ids.has(c.id)) throw new Error(`conversation ${c.id} appears twice`);
    ids.add(c.id);
    if (!/[一-鿿]/u.test(c.opening)) throw new Error(`conversation ${c.id}: the opening must be in Chinese`);
  }
  for (let level = 4; level <= 9; level++) {
    const units = data.filter((c) => c.level === level).map((c) => c.unit);
    if (units.join(",") !== CLOSING_UNITS.join(",")) throw new Error(`level ${level}: conversations close units ${units}, not 3,6,9,12`);
  }
}

checkConversations(conversationData);

/** chineseConversations are the subject's conversations, spoken in Mandarin. */
export const chineseConversations: readonly ConversationDef[] = conversationData.map((c) => ({
  id: c.id,
  title: c.title,
  task: c.task,
  scenario: [...levelPreamble(c.level), ...c.scenario].join("\n"),
  opening: c.opening,
  spoken: "zh-CN",
  minutes: 5,
}));

/** withConversations closes a level's units with its conversations and lists them as the course's. */
export function withConversations(level: number, units: readonly UnitDef[]): Pick<CourseDef, "units" | "conversations"> {
  const own = conversationData.filter((c) => c.level === level);
  return {
    units: units.map((unit, u) => {
      const closing = own.find((c) => c.unit === u + 1);
      return closing ? { ...unit, conversation: closing.id } : unit;
    }),
    conversations: own.map((c) => c.id),
  };
}
