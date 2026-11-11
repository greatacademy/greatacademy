// Grade 5: helpers that build the topics of the grade from short specifications, so that each file reads as its
// explanations and its banks.

import { type KnowledgePointDef, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, point, type TypedItem, typedGenerator } from "@ga/subject-english";
import type { Strand } from "../../pack.ts";
import { bars, kindedChoice, type Label, labelChoice, type Pair } from "../../topics/steps.ts";
import { after, covers } from "./links.ts";

export type { Label, Pair };

/** TopicSpec describes a topic of grade 5: its prerequisites as the outline names them and what it encompasses. */
export interface TopicSpec {
  readonly id: string;
  readonly title: Pair;
  readonly summary: Pair;
  readonly after: readonly string[];
  /** covers are the prerequisites (or their ancestors) it encompasses with weight 0.2; the first prerequisite unless given. */
  readonly covers?: readonly string[];
  readonly xp?: number;
  readonly points: readonly KnowledgePointDef[];
}

/** topic builds a topic of a strand, worth 14 XP unless it says otherwise. */
export const topic = (strand: Strand, spec: TopicSpec): TopicDef => {
  const prerequisites = after(...spec.after);
  return {
    id: spec.id,
    title: t(...spec.title),
    summary: t(...spec.summary),
    prerequisites,
    encompasses: covers(0.2, ...(spec.covers ?? prerequisites.slice(0, 1))),
    xp: spec.xp ?? 14,
    strand,
    knowledgePoints: [...spec.points],
  };
};

/** Why builds the teaching solution of a choice from its right option and what was shown. */
export type Why = (right: string, shown: string) => Pair;

/**
 * choose builds a knowledge point of choices whose lines are "shown|right|wrong|wrong", the wrong options of every line
 * listed in the order of the kinds of mistake, each kind with its own feedback; {wrong} and {right} fill in the options.
 */
export const choose = (
  id: string,
  title: Pair,
  explanation: Pair,
  question: Pair,
  lines: string | readonly ChoiceItem[],
  why: Why,
  kinds: readonly Pair[],
): KnowledgePointDef =>
  point(id, t(...title), t(...explanation), kindedChoice(question, typeof lines === "string" ? bars(lines) : lines, why, kinds));

/** label builds a knowledge point of choices among the labels of a table; a line is "shown|right" or "shown|right|wrong|wrong". */
export const label = (
  id: string,
  title: Pair,
  explanation: Pair,
  question: Pair,
  lines: string,
  labels: Readonly<Record<string, Label>>,
): KnowledgePointDef => point(id, t(...title), t(...explanation), labelChoice(question, lines, labels));

/** type builds a knowledge point of typed words, checked by their form. */
export const type = (id: string, title: Pair, explanation: Pair, question: Pair, bank: readonly TypedItem[], why: Why): KnowledgePointDef =>
  point(
    id,
    t(...title),
    t(...explanation),
    typedGenerator("word-form", t(...question), bank, (r, s) => t(...why(r, s))),
  );

/** rows splits lines of fields separated by bars, dropping blank lines. */
export const rows = (lines: string): string[][] =>
  lines
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "")
    .map((line) => line.split("|").map((field) => field.trim()));

/** field takes a field of a row, failing loudly if it is missing. */
export const field = (row: readonly string[], i: number): string => {
  const value = row[i];
  if (value === undefined || value === "") throw new Error(`a row lacks field ${i}: ${row.join("|")}`);
  return value;
};
