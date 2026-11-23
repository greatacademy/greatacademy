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
  /** cue is how the task gives the character, for the explanations: “in 你好”, or by its reading and meaning. */
  readonly cue: Text;
  readonly trace: Text;
  readonly write: Text;
  readonly solution: Text;
}

/** BOX is the side of the square the medians are drawn in, y running down. */
const BOX = 1024;

/** whereIs names the part of the box a point is in: the top left, the middle, and so on. */
function whereIs([x, y]: readonly [number, number]): Text {
  const third = (v: number) => (v < BOX / 3 ? 0 : v < (2 * BOX) / 3 ? 1 : 2);
  const rows = [t("top", "上"), t("middle", "中"), t("bottom", "下")] as const;
  const cols = [t("left", "左"), t("middle", "中"), t("right", "右")] as const;
  const [r, c] = [rows[third(y)], cols[third(x)]];
  if (third(y) === 1 && third(x) === 1) return t("the middle", "正中");
  if (third(x) === 1) return t(`the ${r.en}`, `${r["zh-CN"]}部`);
  if (third(y) === 1) return t(`the ${c.en}`, `${c["zh-CN"]}边`);
  return t(`the ${r.en} ${c.en}`, `${c["zh-CN"]}${r["zh-CN"]}方`);
}

/** wayOf says which way a stroke goes, from where it starts to where it ends. */
function wayOf(stroke: Stroke): Text {
  const [x0, y0] = stroke[0]!;
  const [x1, y1] = stroke.at(-1)!;
  const [dx, dy] = [x1 - x0, y1 - y0];
  if (Math.abs(dy) <= 0.3 * Math.abs(dx)) return dx > 0 ? t("goes from left to right", "从左向右写") : t("goes to the left", "向左写");
  if (Math.abs(dx) <= 0.35 * Math.abs(dy)) return dy > 0 ? t("goes straight down", "从上往下写") : t("goes up", "向上写");
  if (dy > 0) return dx < 0 ? t("goes down to the left", "向左下方写") : t("ends down to the right", "向右下方写");
  return dx > 0 ? t("goes up to the right", "向右上方写") : t("goes up to the left", "向左上方写");
}

/** firstStroke says where a character's first stroke starts and which way it goes, from its medians. */
export function firstStroke(char: string): Text {
  const first = medians.get(char)?.[0];
  if (!first) throw new Error(`medians: none for ${char}`);
  const [where, way] = [whereIs(first[0]!), wayOf(first)];
  return t(`its first stroke starts at ${where.en} and ${way.en}`, `第一笔从${where["zh-CN"]}起笔，${way["zh-CN"]}`);
}

/**
 * handSteps is the solution of a writing task in steps: how the task gives the character, its strokes in order, and a
 * check by the count and by reading it back.
 */
export function handSteps(find: Text, char: string, back: Text): Text {
  const n = strokeCount(char);
  const first = firstStroke(char);
  return t(
    `${find.en}\n\n${char} has ${n} strokes, and ${first.en}. Write them in the standard order, each from where it starts to where it ends, without joining two strokes into one.\n\n**Check.** Count your strokes: ${n}, no more and no fewer. ${back.en}`,
    `${find["zh-CN"]}\n\n“${char}”共 ${n} 画，${first["zh-CN"]}。按笔顺写，每一笔从起笔写到收笔，不要把两笔连成一笔。\n\n**检验。** 数一数写了几画：${n} 画，不多也不少。${back["zh-CN"]}`,
  );
}

/** gap shows a word with the character to write as its pinyin. */
export const gap = (w: CharacterWord, char: string): string => w.text.replaceAll(char, `（${w.reading}）`);

/** wordTask writes a character in one of its words: traced in it, or written where the word shows its pinyin. */
export function wordTask(char: string, reading: string, word: CharacterWord): HandTask {
  return {
    char,
    cue: t(`in ${word.text}`, `在“${word.text}”里`),
    trace: t(
      `Trace ${char} (${reading}) of **${word.text}**, stroke by stroke in the standard order.`,
      `照着描一描“**${word.text}**”中的“${char}”（${reading}），按笔顺一笔一笔写。`,
    ),
    write: t(
      `Write the character of the pinyin in brackets, stroke by stroke in the standard order: **${gap(word, char)}**`,
      `写出括号里拼音的字，按笔顺一笔一笔写：**${gap(word, char)}**`,
    ),
    solution: handSteps(
      t(
        `The word is **${word.text}**, and the character read ${reading} in it is ${char}.`,
        `这个词是“**${word.text}**”，其中读 ${reading} 的字是“${char}”。`,
      ),
      char,
      t(`Then read the word back: ${word.text}.`, `再把词读一遍：“${word.text}”。`),
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
  const task = tasks[0];
  if (!task) throw new Error(`${id}: no tasks`);
  const c = task.char;
  const n = strokeCount(c);
  const first = firstStroke(c);
  return {
    id,
    title,
    summary: t(`Writing ${joined} by hand, stroke by stroke in the standard order.`, `按笔顺一笔一笔写“${joined}”。`),
    prerequisites: [...prerequisites],
    encompasses: [],
    xp: chars.length,
    strand: "characters",
    intro: t(
      `These ${chars.length} characters are ones you already read; now you write them. Take ${c}, ${task.cue.en}: it has ${n} strokes, and ${first.en}. You trace each character first, then write it from memory, always in the standard order, and count the strokes as you go.`,
      `这 ${chars.length} 个字你已经认识了，现在来写。比如“${c}”，${task.cue["zh-CN"]}：它共 ${n} 画，${first["zh-CN"]}。每个字先描红，再凭记忆写，都按笔顺写，边写边数笔画。`,
    ),
    knowledgePoints: [
      point(
        `${id}-tracing`,
        t("Tracing Them", "描红"),
        t(
          `Look at the whole character first: which parts it has and where each sits. Then write it as the standard order goes, top before bottom, left before right, outside before inside and closing last, each stroke from where it starts to where it ends, without joining strokes.\n\nTake ${c}: ${first.en}. Follow its ${n} strokes one by one over the model, counting: when you lift the pen after the last, the count is ${n}.\n\n> **Watch out.** A stroke written the wrong way or out of order, or two strokes joined into one, is marked wrong even when the character looks right: ${c} must come out as ${n} strokes in the standard order.\n\n${list.en}`,
          `先看清整个字：由哪几部分组成，每部分在什么位置。再按笔顺规则写：先上后下，先左后右，先外后内再封口；每一笔从起笔写到收笔，笔画之间不要连起来。\n\n比如“${c}”：${first["zh-CN"]}。照着字一笔一笔描，边描边数，写完最后一笔，正好是 ${n} 画。\n\n> **注意。** 笔画方向写反、笔顺写错，或者把两笔连成一笔，就算字的样子对，也算写错：“${c}”要按笔顺写满 ${n} 画。\n\n${list["zh-CN"]}`,
        ),
        handGenerator(tasks, true),
      ),
      point(
        `${id}-writing`,
        t("Writing Them", "默写"),
        t(
          `Now write each character from memory: read what is given, the word or the reading and meaning, think of the character its pinyin stands for, picture it, then write it in order. Count the strokes as you go.\n\nTake ${c}, ${task.cue.en}: say what is given, picture ${c}, then write its ${n} strokes in order; when the count reaches ${n}, it is done.\n\n> **Watch out.** Another character of the same sound is not the one asked for: write the character of this word or meaning. A stroke left out or added changes the count, and ${c} has ${n}.\n\n${list.en}`,
          `这次不描红，凭记忆写：读给出的词语或读音和意思，想一想拼音处是哪个字，先在心里想好字形，再按笔顺写，边写边数笔画。\n\n比如“${c}”，${task.cue["zh-CN"]}：先读给出的内容，在心里想好“${c}”的样子，再按笔顺写 ${n} 画，数到 ${n} 画就写完了。\n\n> **注意。** 读音相同的别的字不是要写的字：要写这个词、这个意思的字。少写或多写一笔，笔画数就不对了，“${c}”共 ${n} 画。\n\n${list["zh-CN"]}`,
        ),
        handGenerator(tasks, false),
      ),
    ],
  };
}

/** handTopic builds a writing topic, keeping its problem banks only while they are used (see slimmed). */
export const handTopic = slimmed(buildHandTopic);
