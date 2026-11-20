// The kit of writing characters by hand (docs/chinese-curriculum.md §5.2): the standard medians of each character, a
// task of tracing and writing a character in a word, its generator judged by the checker `strokes`, and the writing topic
// of a batch. The native grades (writing.ts), the levels (levels.ts) and HSK (hsk/written.ts) build their topics with it.

import { formatStrokes, type Generator, type Problem, type Rng, type Stroke, slimmed, type Text, type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-chinese";

import type { CharacterWord } from "../characters/recognition.ts";
import { mediansData } from "./medians-data.ts";

/** HAND_BATCH is the number of characters of a writing batch. */
export const HAND_BATCH = 10;

/** rawMedians are the strokes of each writing character as written in mediansData, read into points only when asked. */
const rawMedians: ReadonlyMap<string, string> = new Map(
  mediansData
    .trim()
    .split("\n")
    .map((line) => {
      const space = line.indexOf(" ");
      const [char, strokes] = [line.slice(0, space), line.slice(space + 1)];
      if (space < 1 || !strokes) throw new Error(`medians: ${line.slice(0, 20)}`);
      return [char, strokes] as const;
    }),
);

/** readStrokes reads the strokes of a line of mediansData into points. */
const readStrokes = (strokes: string): readonly Stroke[] =>
  strokes.split(";").map((s) =>
    s.split(" ").map((p): readonly [number, number] => {
      const [x, y] = p.split(",").map(Number);
      return [x!, y!];
    }),
  );

/**
 * medians are the standard medians of each writing character, native or of the levels, in the order of mediansData; each
 * is read when asked, since the points of 3,000 characters held at once take more memory than a Worker has to spare.
 */
export const medians: Pick<ReadonlyMap<string, readonly Stroke[]>, "get" | "has" | "keys"> = {
  get: (char) => {
    const strokes = rawMedians.get(char);
    return strokes === undefined ? undefined : readStrokes(strokes);
  },
  has: (char) => rawMedians.has(char),
  keys: () => rawMedians.keys(),
};

/** strokeCount is the number of strokes of a writing character, counted without reading its points. */
export function strokeCount(char: string): number | undefined {
  const strokes = rawMedians.get(char);
  if (strokes === undefined) return undefined;
  let n = 1;
  for (let i = strokes.indexOf(";"); i >= 0; i = strokes.indexOf(";", i + 1)) n++;
  return n;
}

/** reversed draws a character's strokes in the reverse order, or a character of one stroke the other way. */
const reversed = (strokes: readonly Stroke[]): readonly Stroke[] =>
  strokes.length === 1 ? [[...strokes[0]!].reverse()] : [...strokes].reverse();

/** HandTask is one task of a writing batch: a character, how it is asked when traced and when written, and its solution. */
export interface HandTask {
  readonly char: string;
  readonly trace: Text;
  readonly write: Text;
  readonly solution: Text;
}

/** gap shows a word with the character to write as its pinyin. */
export const gap = (w: CharacterWord, char: string): string => w.text.replaceAll(char, `（${w.reading}）`);

/** wordTask writes a character in one of its words: traced in it, or written where the word shows its pinyin. */
export function wordTask(char: string, reading: string, word: CharacterWord): HandTask {
  const n = strokeCount(char);
  return {
    char,
    trace: t(
      `Trace ${char} (${reading}) of **${word.text}**, stroke by stroke in the standard order.`,
      `照着描一描“**${word.text}**”中的“${char}”（${reading}），按笔顺一笔一笔写。`,
    ),
    write: t(
      `Write the character of the pinyin in brackets, stroke by stroke in the standard order: **${gap(word, char)}**`,
      `写出括号里拼音的字，按笔顺一笔一笔写：**${gap(word, char)}**`,
    ),
    solution: t(
      `The word is **${word.text}**, written with ${char}, of ${n} strokes.`,
      `这个词是“**${word.text}**”，用“${char}”字，共 ${n} 画。`,
    ),
  };
}

/** handGenerator writes each task of a batch in turn, tracing the character or not. */
export function handGenerator(tasks: readonly HandTask[], trace: boolean): Generator {
  return (rng: Rng): Problem => {
    const task = rng.cycle(tasks);
    const standard = medians.get(task.char)!;
    const n = standard.length;
    return {
      prompt: trace ? task.trace : task.write,
      answer: {
        checker: "strokes",
        expected: { medians: standard.map((s) => s.map(([x, y]) => [x, y])) },
        input: { kind: "strokes", strokes: n, ...(trace && { trace: task.char }) },
      },
      solution: task.solution,
      canonical: formatStrokes(standard),
      wrong: [formatStrokes(reversed(standard))],
    };
  };
}

/**
 * buildHandTopic builds the writing topic of a batch of characters from its tasks, ordered so that consecutive seeds never
 * show the same character, and the list of its characters each explanation ends with, in English and in Chinese.
 */
function buildHandTopic(
  id: string,
  title: TopicDef["title"],
  chars: readonly string[],
  tasks: readonly HandTask[],
  list: Text,
  prerequisites: readonly string[],
): TopicDef {
  const joined = chars.join("、");
  return {
    id,
    title,
    summary: t(`Writing ${joined} by hand, stroke by stroke in the standard order.`, `按笔顺一笔一笔写“${joined}”。`),
    prerequisites: [...prerequisites],
    encompasses: [],
    xp: chars.length,
    strand: "characters",
    knowledgePoints: [
      point(
        `${id}-tracing`,
        t("Tracing Them", "描红"),
        t(
          `Look at the whole character first: which parts it has and where each sits. Then write it as the standard order goes, top before bottom, left before right, outside before inside and closing last, each stroke from where it starts to where it ends, without joining strokes.\n\n${list.en}`,
          `先看清整个字：由哪几部分组成，每部分在什么位置。再按笔顺规则写：先上后下，先左后右，先外后内再封口；每一笔从起笔写到收笔，笔画之间不要连起来。\n\n${list["zh-CN"]}`,
        ),
        handGenerator(tasks, true),
      ),
      point(
        `${id}-writing`,
        t("Writing Them", "默写"),
        t(
          `Now write each character from memory: read what is given, the word or the reading and meaning, think of the character its pinyin stands for, picture it, then write it in order. Count the strokes as you go.\n\n${list.en}`,
          `这次不描红，凭记忆写：读给出的词语或读音和意思，想一想拼音处是哪个字，先在心里想好字形，再按笔顺写，边写边数笔画。\n\n${list["zh-CN"]}`,
        ),
        handGenerator(tasks, false),
      ),
    ],
  };
}

/** handTopic builds a writing topic, keeping its problem banks only while they are used (see slimmed). */
export const handTopic = slimmed(buildHandTopic);
