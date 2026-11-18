// The paragraph writing of the levels (docs/chinese-curriculum.md §8.4): after sentence building, the second step of a
// unit's writing, judged by a model against yes-or-no criteria. Levels 2 to 9 end their sixth and twelfth units with a
// topic each. Its two knowledge points share one bank of tasks and judge the work by criteria of their own; every task
// and every model answer uses only the characters taught by the end of its unit, and a character counts as a word.

import { type CriterionSpec, type Text, type TopicDef, t } from "@ga/content";
import { criterionById, point, type WritingItem, writingGenerator } from "@ga/subject-chinese";

/** PUNCTUATION may appear in a task or a model besides taught characters. */
const PUNCTUATION = new Set([..."，。？！：；“”‘’、…—（）《》·"]);

/** MIN_TASKS is how many tasks a topic's bank needs, so that each knowledge point has 12 distinct problems. */
const MIN_TASKS = 12;

/** LevelWritingPoint is a knowledge point of a writing topic: what it teaches and the two criteria that judge it. */
export interface LevelWritingPoint {
  /** suffix ends the knowledge point's id. */
  readonly suffix: string;
  readonly title: Text;
  readonly explanation: Text;
  /** question says what to write, before the task; it names the point's focus. */
  readonly question: Text;
  /** criteria are the ids of the two criteria that judge the point, among the topic's three. */
  readonly criteria: readonly [string, string];
}

/** LevelWriting is a writing topic of a level as written in its data. */
export interface LevelWriting {
  /** unit is the unit the topic ends, counting from 1: the sixth or the twelfth. */
  readonly unit: number;
  readonly title: Text;
  readonly summary: Text;
  /** criteria are the ids of the topic's three criteria. */
  readonly criteria: readonly [string, string, string];
  /** minChars is the fewest characters a response may have; it may have ten times as many. */
  readonly minChars: number;
  readonly points: readonly [LevelWritingPoint, LevelWritingPoint];
  /** bank holds the tasks, each with one good answer written for the subject. */
  readonly bank: readonly WritingItem[];
}

const two = (n: number): string => String(n).padStart(2, "0");

/** levelWritingId is the id of the nth writing topic of a level, counting from 1. */
export const levelWritingId = (level: number, n: number): string => `level-${level}-writing-${two(n)}`;

/** criterion finds a criterion by its id, failing when there is none. */
const criterion = (id: string): CriterionSpec => {
  const found = criterionById(id);
  if (!found) throw new Error(`unknown criterion ${id}`);
  return found;
};

/** quoted quotes every line of a model, so that a letter stays one quotation. */
const quoted = (model: string) =>
  model
    .split("\n")
    .map((line) => (line ? `> ${line}` : ">"))
    .join("\n");

const onePiece = (model: string): Text => t(`One good answer:\n\n${quoted(model)}`, `一篇好的答案：\n\n${quoted(model)}`);

/** WritingSpec says how to build the writing topic that ends a unit. */
export interface WritingSpec {
  readonly level: number;
  /** n is the number of the topic within the level, counting from 1. */
  readonly n: number;
  readonly writing: LevelWriting;
  readonly taught: ReadonlySet<string>;
  /** after is the unit's last topic, its sentence building. */
  readonly after: string;
}

/** writingTopic builds a writing topic, checking its bank's length, characters and the criteria its points use. */
export function writingTopic(spec: WritingSpec): TopicDef {
  const id = levelWritingId(spec.level, spec.n);
  const w = spec.writing;
  if (w.bank.length < MIN_TASKS) throw new Error(`${id}: needs ${MIN_TASKS} tasks, has ${w.bank.length}`);
  for (const item of w.bank) {
    const untaught = [...item.task, ...item.model].filter((ch) => !spec.taught.has(ch) && !PUNCTUATION.has(ch) && ch.trim() !== "");
    if (untaught.length > 0) throw new Error(`${id}: ${item.task} uses ${[...new Set(untaught)].join("")}, not yet taught`);
    const length = [...item.model].filter((ch) => /\p{Script=Han}/u.test(ch)).length;
    if (length < w.minChars || length > w.minChars * 2)
      throw new Error(`${id}: the model of ${item.task} has ${length} characters, not ${w.minChars} to ${w.minChars * 2}`);
  }
  if (new Set(w.bank.map((i) => i.task)).size !== w.bank.length) throw new Error(`${id}: a task is written twice`);
  for (const p of w.points) {
    if (p.criteria.some((c) => !w.criteria.includes(c))) throw new Error(`${id}-${p.suffix}: a criterion is not the topic's`);
  }
  if (new Set(w.points.flatMap((p) => p.criteria)).size !== 3) throw new Error(`${id}: the points must use all three criteria`);
  const limits = { minWords: w.minChars, maxChars: w.minChars * 10 };
  return {
    id,
    title: w.title,
    summary: w.summary,
    prerequisites: [spec.after, ...(spec.n > 1 ? [levelWritingId(spec.level, spec.n - 1)] : [])],
    encompasses: [],
    xp: 18,
    strand: "writing",
    criteria: w.criteria.map(criterion),
    knowledgePoints: w.points.map((p) =>
      point(`${id}-${p.suffix}`, p.title, p.explanation, writingGenerator(p.question, w.bank, [...p.criteria], limits, onePiece)),
    ),
  };
}

/** UnitWriting says where a unit stands in its level, for the writing topic that may end it. */
export interface UnitWriting {
  readonly level: number;
  /** unit is the index of the unit, counting from 0. */
  readonly unit: number;
  readonly writing: readonly LevelWriting[];
  readonly taught: ReadonlySet<string>;
  readonly after: string;
}

/** unitWritingTopics builds the writing topic that ends a unit, if the level's data has one for it. */
export function unitWritingTopics(spec: UnitWriting): readonly TopicDef[] {
  if (spec.unit === 0 && !"6,12".startsWith(spec.writing.map((w) => w.unit).join()))
    throw new Error(`level ${spec.level}: writing topics end units ${spec.writing.map((w) => w.unit).join()}, not 6,12`);
  const k = spec.writing.findIndex((w) => w.unit === spec.unit + 1);
  const writing = spec.writing[k];
  if (writing === undefined) return [];
  return [writingTopic({ level: spec.level, n: k + 1, writing, taught: spec.taught, after: spec.after })];
}
