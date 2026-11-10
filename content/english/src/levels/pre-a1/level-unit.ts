// A builder of the units of the level courses, used by every level from Pre-A1 up.

import { type Text, t, type UnitDef } from "@ga/content";

const modules = {
  words: t("Words", "词汇"),
  grammar: t("Grammar", "语法"),
  reading: t("Reading", "阅读"),
  writing: t("Writing", "写作"),
} as const;

/** UnitParts are the topics of a unit by strand, each in teaching order. */
export interface UnitParts {
  readonly words?: readonly string[];
  readonly grammar?: readonly string[];
  readonly reading?: readonly string[];
  readonly writing?: readonly string[];
}

/** levelUnit builds a unit of a level course on a theme, with a module for each strand that has topics, its reading unit and its conversation. */
export function levelUnit(title: Text, parts: UnitParts, readingUnit: string, conversation: string): UnitDef {
  const strands = ["words", "grammar", "reading", "writing"] as const;
  return {
    title,
    modules: strands
      .map((strand) => ({ title: modules[strand], topics: parts[strand] ?? [] }))
      .filter((module) => module.topics.length > 0),
    reading: [readingUnit],
    conversation,
  };
}
