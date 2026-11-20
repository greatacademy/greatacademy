// Writing characters by hand (docs/chinese-curriculum.md §5.2, docs/chinese-development-plan.md C3.5): batches of ten
// characters the learner already reads, written stroke by stroke on the pad and judged by the checker `strokes` against
// the standard medians. A batch first traces each character in its words, then writes it from its pinyin with nothing to
// trace. The characters are those of the recognition batches in their order, the commonest first, so that a child writes
// what it has read a while before; by the end of a grade the cumulative count follows the curriculum standard: 800 by
// grade 2, 1,600 by grade 4, 2,500 by grade 6 and 3,000 by grade 9.

import { type TopicDef, t } from "@ga/content";

import { recognitionByGrade, recognitionId } from "../characters/index.ts";
import type { CharacterEntry } from "../characters/recognition.ts";
import { HAND_BATCH, handTopic, medians, strokeCount, wordTask } from "./hand.ts";

/** WRITTEN_BY_GRADE is how many characters a learner writes by the end of each grade, from grade 1. */
export const WRITTEN_BY_GRADE = [400, 800, 1200, 1600, 2050, 2500, 2670, 2830, 3000] as const;

/** FIRST_PREREQUISITE is the topic of stroke order the first writing batch follows. */
const FIRST_PREREQUISITE = "strokes-order";

const NUMERALS = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

/** handwritingId is the id of a grade's writing batch, counted from 1. */
export const handwritingId = (grade: number, n: number): string => `writing-characters-${grade}-${String(n).padStart(2, "0")}`;

/** HandBatch is a writing topic and its characters. */
export interface HandBatch {
  readonly grade: number;
  readonly topic: TopicDef;
  readonly entries: readonly CharacterEntry[];
}

/** recognizedIn maps each character to its recognition batch and the grade that teaches it. */
const recognizedIn = new Map(
  recognitionByGrade.flatMap((g) =>
    g.batches.flatMap((b, i) => b.entries.map((e) => [e.char, { grade: g.grade, batch: i + 1, entry: e }] as const)),
  ),
);

/** listed is a batch's characters with their sound and words, for an explanation. */
const listed = (entries: readonly CharacterEntry[]): string =>
  entries.map((e) => `- **${e.char}**（${e.reading}，${strokeCount(e.char)} 画）${e.words.map((w) => w.text).join("、")}`).join("\n");

/** nativeTopic builds the writing topic of a batch of native characters, each written in each of its three words. */
function nativeTopic(id: string, title: TopicDef["title"], entries: readonly CharacterEntry[], prerequisites: readonly string[]): TopicDef {
  // Character by character within each round of words, so consecutive seeds never show the same character.
  const tasks = ([0, 1, 2] as const).flatMap((r) => entries.map((e) => wordTask(e.char, e.reading, e.words[r])));
  const list = listed(entries);
  return handTopic(
    id,
    title,
    entries.map((e) => e.char),
    tasks,
    t(list, list),
    prerequisites,
  );
}

/** nativeOrder is the order the native grades write their characters in: grades 1 and 2 one after the other, then each later stage's grades' recognition batches in turn. */
const nativeOrder: readonly string[] = (() => {
  const batches = (grade: number) => recognitionByGrade.find((x) => x.grade === grade)?.batches ?? [];
  const chars = (b: { readonly entries: readonly CharacterEntry[] }) => b.entries.map((e) => e.char);
  const order = [1, 2].flatMap((g) => batches(g).flatMap(chars));
  for (const stage of [
    [3, 4],
    [5, 6],
    [7, 8, 9],
  ]) {
    const bs = stage.map(batches);
    const most = Math.max(...bs.map((b) => b.length));
    for (let i = 0; i < most; i++) for (const b of bs) if (b[i]) order.push(...chars(b[i]!));
  }
  const written = order.slice(0, WRITTEN_BY_GRADE.at(-1));
  const missing = written.filter((c) => !medians.has(c));
  if (missing.length > 0) throw new Error(`medians: none for ${missing.join("")}`);
  return written;
})();

/** handwritingByGrade are each grade's writing batches, in order; each follows the batch before it, across grades. */
export const handwritingByGrade: readonly { readonly grade: number; readonly batches: readonly HandBatch[] }[] = (() => {
  const order = nativeOrder;
  let previous = FIRST_PREREQUISITE;
  // The latest recognition batch of each grade an earlier writing batch needs: those before it are implied.
  const needed = new Map<number, number>();
  return WRITTEN_BY_GRADE.map((upTo, g) => {
    const grade = g + 1;
    const from = g === 0 ? 0 : WRITTEN_BY_GRADE[g - 1]!;
    const batches: HandBatch[] = [];
    for (let i = from; i < upTo; i += HAND_BATCH) {
      const entries = order.slice(i, Math.min(i + HAND_BATCH, upTo)).map((c) => {
        const found = recognizedIn.get(c);
        if (!found || found.grade > grade) throw new Error(`writing ${c} in grade ${grade}: it is not read by then`);
        return found.entry;
      });
      if (entries.length !== HAND_BATCH) throw new Error(`writing grade ${grade}: a batch of ${entries.length}`);
      const id = handwritingId(grade, batches.length + 1);
      // A grade's recognition batches each follow the one before, so only the latest of each grade is a prerequisite.
      const latest = new Map<number, number>();
      for (const e of entries) {
        const { grade: from, batch } = recognizedIn.get(e.char)!;
        latest.set(from, Math.max(latest.get(from) ?? 0, batch));
      }
      const reading = [...latest]
        .filter(([from, batch]) => batch > (needed.get(from) ?? 0))
        .map(([from, batch]) => recognitionId(from, batch));
      for (const [from, batch] of latest) needed.set(from, Math.max(needed.get(from) ?? 0, batch));
      const topic = nativeTopic(
        id,
        t(`Grade ${grade} Writing, Set ${batches.length + 1}`, `${NUMERALS[grade]}年级写字 第${batches.length + 1}组`),
        entries,
        [previous, ...reading],
      );
      batches.push({ grade, topic, entries });
      previous = id;
    }
    return { grade, batches };
  });
})();

/** handwritingTopics are every writing topic. */
export const handwritingTopics: readonly TopicDef[] = handwritingByGrade.flatMap((g) => g.batches.map((b) => b.topic));
