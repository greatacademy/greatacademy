// Writing characters by hand (docs/chinese-curriculum.md §5.2, docs/chinese-development-plan.md C3.5): batches of ten
// characters the learner already reads, written stroke by stroke on the pad and judged by the checker `strokes` against
// the standard medians. A batch first traces each character in its words, then writes it from its pinyin with nothing to
// trace. The characters are those of the recognition batches in their order, the commonest first, so that a child writes
// what it has read a while before; by the end of a grade the cumulative count follows the curriculum standard: 800 by
// grade 2, 1,600 by grade 4, 2,500 by grade 6 and 3,000 by grade 9.

import { formatStrokes, type Generator, type Problem, type Rng, type Stroke, type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-chinese";

import { recognitionByGrade, recognitionId } from "../characters/index.ts";
import type { CharacterEntry, CharacterWord } from "../characters/recognition.ts";
import { mediansData } from "./medians-data.ts";

/** WRITTEN_BY_GRADE is how many characters a learner writes by the end of each grade, from grade 1. */
export const WRITTEN_BY_GRADE = [400, 800, 1200, 1600, 2050, 2500, 2670, 2830, 3000] as const;

/** HAND_BATCH is the number of characters of a writing batch. */
export const HAND_BATCH = 10;

/** FIRST_PREREQUISITE is the topic of stroke order the first writing batch follows. */
const FIRST_PREREQUISITE = "strokes-order";

const NUMERALS = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

/** handwritingId is the id of a grade's writing batch, counted from 1. */
export const handwritingId = (grade: number, n: number): string => `writing-characters-${grade}-${String(n).padStart(2, "0")}`;

/** medians are the standard medians of each writing character, in the order of mediansData. */
export const medians: ReadonlyMap<string, readonly Stroke[]> = new Map(
  mediansData
    .trim()
    .split("\n")
    .map((line) => {
      const space = line.indexOf(" ");
      const [char, strokes] = [line.slice(0, space), line.slice(space + 1)];
      if (space < 1 || !strokes) throw new Error(`medians: ${line.slice(0, 20)}`);
      const parsed = strokes.split(";").map((s) =>
        s.split(" ").map((p): readonly [number, number] => {
          const [x, y] = p.split(",").map(Number);
          return [x!, y!];
        }),
      );
      return [char, parsed] as const;
    }),
);

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

/** reversed draws a character's strokes in the reverse order, or a character of one stroke the other way. */
const reversed = (strokes: readonly Stroke[]): readonly Stroke[] =>
  strokes.length === 1 ? [[...strokes[0]!].reverse()] : [...strokes].reverse();

/** Item is one task of a writing batch: a character in one of its words. */
interface Item {
  readonly entry: CharacterEntry;
  readonly word: CharacterWord;
}

/** gap shows a word with the character to write as its pinyin. */
const gap = (w: CharacterWord, char: string): string => w.text.replaceAll(char, `（${w.reading}）`);

/** listed is a batch's characters with their sound and words, for an explanation. */
const listed = (entries: readonly CharacterEntry[]): string =>
  entries
    .map((e) => `- **${e.char}**（${e.reading}，${medians.get(e.char)?.length} 画）${e.words.map((w) => w.text).join("、")}`)
    .join("\n");

/** handGenerator writes each character of a batch in each of its words, tracing it or not. */
function handGenerator(items: readonly Item[], trace: boolean): Generator {
  return (rng: Rng): Problem => {
    const { entry, word } = rng.cycle(items);
    const standard = medians.get(entry.char)!;
    const n = standard.length;
    return {
      prompt: trace
        ? t(
            `Trace ${entry.char} (${entry.reading}) of **${word.text}**, stroke by stroke in the standard order.`,
            `照着描一描“**${word.text}**”中的“${entry.char}”（${entry.reading}），按笔顺一笔一笔写。`,
          )
        : t(
            `Write the character of the pinyin in brackets, stroke by stroke in the standard order: **${gap(word, entry.char)}**`,
            `写出括号里拼音的字，按笔顺一笔一笔写：**${gap(word, entry.char)}**`,
          ),
      answer: {
        checker: "strokes",
        expected: { medians: standard.map((s) => s.map(([x, y]) => [x, y])) },
        input: { kind: "strokes", strokes: n, ...(trace && { trace: entry.char }) },
      },
      solution: t(
        `The word is **${word.text}**, written with ${entry.char}, of ${n} strokes.`,
        `这个词是“**${word.text}**”，用“${entry.char}”字，共 ${n} 画。`,
      ),
      canonical: formatStrokes(standard),
      wrong: [formatStrokes(reversed(standard))],
    };
  };
}

/** handTopic builds the writing topic of a batch of characters. */
function handTopic(id: string, title: TopicDef["title"], entries: readonly CharacterEntry[], prerequisites: readonly string[]): TopicDef {
  // Character by character within each round of words, so consecutive seeds never show the same character.
  const items: readonly Item[] = ([0, 1, 2] as const).flatMap((r) => entries.map((entry) => ({ entry, word: entry.words[r] })));
  const chars = entries.map((e) => e.char).join("、");
  const list = listed(entries);
  return {
    id,
    title,
    summary: t(`Writing ${chars} by hand, stroke by stroke in the standard order.`, `按笔顺一笔一笔写“${chars}”。`),
    prerequisites: [...prerequisites],
    encompasses: [],
    xp: entries.length,
    strand: "characters",
    knowledgePoints: [
      point(
        `${id}-tracing`,
        t("Tracing Them", "描红"),
        t(
          `Look at the whole character first: which parts it has and where each sits. Then write it as the standard order goes, top before bottom, left before right, outside before inside and closing last, each stroke from where it starts to where it ends, without joining strokes.\n\n${list}`,
          `先看清整个字：由哪几部分组成，每部分在什么位置。再按笔顺规则写：先上后下，先左后右，先外后内再封口；每一笔从起笔写到收笔，笔画之间不要连起来。\n\n${list}`,
        ),
        handGenerator(items, true),
      ),
      point(
        `${id}-writing`,
        t("Writing Them", "默写"),
        t(
          `Now write each character from memory: read the word, think of the character its pinyin stands for, picture it, then write it in order. Count the strokes as you go.\n\n${list}`,
          `这次不描红，凭记忆写：读词语，想一想拼音处是哪个字，先在心里想好字形，再按笔顺写，边写边数笔画。\n\n${list}`,
        ),
        handGenerator(items, false),
      ),
    ],
  };
}

/** handwritingByGrade are each grade's writing batches, in order; each follows the batch before it, across grades. */
export const handwritingByGrade: readonly { readonly grade: number; readonly batches: readonly HandBatch[] }[] = (() => {
  const order = [...medians.keys()];
  if (order.length !== WRITTEN_BY_GRADE.at(-1)) throw new Error(`medians: ${order.length} characters`);
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
      const topic = handTopic(
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
