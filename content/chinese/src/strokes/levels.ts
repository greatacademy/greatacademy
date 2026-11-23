// Writing characters by hand in the levels of Chinese as a foreign language (docs/chinese-curriculum.md §8.3): batches of
// ten characters the learner already reads, written stroke by stroke as in the native writing topics of writing.ts. The
// characters are taken in the levels' teaching order, so that a learner writes what it has read a while before; by the
// end of each level the cumulative count meets the bands of the handwriting list of GF 0025-2021, 300 by level 3, 700 by
// level 6 and 1,200 by level 9, spread over the levels as 100, 200, 300, 400, 550, 700, 870, 1,030 and 1,200. A character is traced and written in up to three words of the levels taught so far, and in its
// reading and meaning when it has fewer.

import { type Text, type TopicDef, t } from "@ga/content";

import type { LevelOneCharacter } from "../level-1/characters.ts";
import { levelOnePlan } from "../level-1/plan.ts";
import type { LevelOneWord } from "../level-1/words.ts";
import { levelCharacterId } from "../level-2/level.ts";
import { levelTwoPlan } from "../level-2/plan.ts";
import { levelThreePlan } from "../level-3/plan.ts";
import { levelFourPlan } from "../level-4/plan.ts";
import { levelFivePlan } from "../level-5/plan.ts";
import { levelSixPlan } from "../level-6/plan.ts";
import { levelSevenPlan } from "../level-7/plan.ts";
import { levelEightPlan } from "../level-8/plan.ts";
import { levelNinePlan } from "../level-9/plan.ts";
import { HAND_BATCH, type HandTask, handSteps, handTopic, medians, strokeCount, wordTask } from "./hand.ts";

/** WRITTEN_BY_LEVEL is how many characters a learner writes by the end of each level, from level 1. */
export const WRITTEN_BY_LEVEL = [100, 200, 300, 400, 550, 700, 870, 1030, 1200] as const;

/** TASKS is how many tasks each character of a batch has: its words first, then its reading and meaning. */
const TASKS = 3;

/** levelHandwritingId is the id of a level's writing batch, counted from 1. */
export const levelHandwritingId = (level: number, n: number): string => `level-${level}-handwriting-${String(n).padStart(2, "0")}`;

/** LEVELS are the plans of the levels, from level 1: each level's characters, its own and the earlier ones', and its batches. */
const LEVELS = [
  levelOnePlan,
  levelTwoPlan,
  levelThreePlan,
  levelFourPlan,
  levelFivePlan,
  levelSixPlan,
  levelSevenPlan,
  levelEightPlan,
  levelNinePlan,
] as const;

/** levelWords are each level's own words, from level 1, in teaching order. */
export const levelWords: readonly (readonly LevelOneWord[])[] = LEVELS.map((l) => l.wordBatches.flat());

/** taughtIn maps each character to the level that teaches it and its character batch there, counted from 1. */
const taughtIn: ReadonlyMap<string, { readonly level: number; readonly batch: number }> = (() => {
  const out = new Map<string, { level: number; batch: number }>();
  let from = 0;
  for (const [i, { characters, characterBatches }] of LEVELS.entries()) {
    const level = i + 1;
    const own = [...characters.keys()].slice(from);
    for (const [k, char] of own.entries()) {
      const batch = Math.floor(k / HAND_BATCH) + 1;
      if (!characterBatches[batch - 1]?.some((c) => c.char === char)) throw new Error(`level ${level}: no character batch for ${char}`);
      out.set(char, { level, batch });
    }
    from = characters.size;
  }
  return out;
})();

/** LevelHandBatch is a level's writing topic and its characters. */
export interface LevelHandBatch {
  readonly level: number;
  readonly topic: TopicDef;
  readonly chars: readonly LevelOneCharacter[];
}

/** readingIn is a character's syllable in a word. */
const readingIn = (w: LevelOneWord, char: string): string => w.syllables[[...w.word].indexOf(char)]!;

/** fillTask asks for a character by its reading and meaning, in the kth way, for one with too few words. */
function fillTask(c: LevelOneCharacter, k: number): HandTask {
  const n = strokeCount(c.char)!;
  const [en, zh] = [c.meaning.en, c.meaning["zh-CN"]];
  const looks = c.looks.join("、");
  const ways: readonly (readonly [Text, Text])[] = [
    [
      t(
        `Trace ${c.char} (${c.reading}), “${en}”, stroke by stroke in the standard order.`,
        `照着描一描“${c.char}”（${c.reading}，${zh}），按笔顺一笔一笔写。`,
      ),
      t(
        `Write the character read ${c.reading} that means “${en}”, stroke by stroke in the standard order.`,
        `写出读 ${c.reading}、意思是“${zh}”的字，按笔顺一笔一笔写。`,
      ),
    ],
    [
      t(
        `Trace ${c.char} (${c.reading}), “${en}”, not ${looks}, stroke by stroke in the standard order.`,
        `照着描一描“${c.char}”（${c.reading}，${zh}），不要写成“${looks}”，按笔顺一笔一笔写。`,
      ),
      t(
        `Write the character read ${c.reading} that means “${en}”, not ${looks}, stroke by stroke in the standard order.`,
        `写出读 ${c.reading}、意思是“${zh}”的字，不要写成“${looks}”，按笔顺一笔一笔写。`,
      ),
    ],
    [
      t(
        `Trace ${c.char} (${c.reading}), “${en}”, its ${n} strokes one by one in the standard order.`,
        `照着描一描“${c.char}”（${c.reading}，${zh}），共 ${n} 画，按笔顺一笔一笔写。`,
      ),
      t(
        `Write the character of ${n} strokes read ${c.reading} that means “${en}”, stroke by stroke in the standard order.`,
        `写出读 ${c.reading}、意思是“${zh}”、共 ${n} 画的字，按笔顺一笔一笔写。`,
      ),
    ],
  ];
  const [trace, write] = ways[k]!;
  return {
    char: c.char,
    cue: t(`read ${c.reading}, “${en}”`, `读 ${c.reading}，意思是“${zh}”`),
    trace,
    write,
    solution: handSteps(
      t(
        `The character read ${c.reading} that means “${en}” is **${c.char}**${looks ? `, not ${c.looks.join(" or ")}, which only look like it` : ""}.`,
        `读 ${c.reading}、意思是“${zh}”的字是“**${c.char}**”${looks ? `，不是长得像它的“${c.looks.join("”或“")}”` : ""}。`,
      ),
      c.char,
      t(`Then read it: ${c.char}, ${c.reading}, “${en}”.`, `再读一读：“${c.char}”读 ${c.reading}，意思是“${zh}”。`),
    ),
  };
}

/** wordsWith are, for each character, the words of every level it is in but itself, in order, with the level of each. */
const wordsWith: ReadonlyMap<string, readonly { readonly level: number; readonly word: LevelOneWord }[]> = (() => {
  const out = new Map<string, { level: number; word: LevelOneWord }[]>();
  for (const [i, words] of levelWords.entries())
    for (const word of words)
      for (const char of new Set(word.word)) {
        if (word.word === char) continue;
        const list = out.get(char) ?? [];
        if (list.length === 0) out.set(char, list);
        list.push({ level: i + 1, word });
      }
  return out;
})();

/** tasksOf are a character's tasks at a level: in its first words of the levels so far but itself, then by its reading and meaning. */
function tasksOf(c: LevelOneCharacter, level: number): readonly HandTask[] {
  const words = (wordsWith.get(c.char) ?? [])
    .filter((w) => w.level <= level)
    .slice(0, TASKS)
    .map((w) => w.word);
  return [
    ...words.map((w) => wordTask(c.char, readingIn(w, c.char), { text: w.word, reading: readingIn(w, c.char) })),
    ...Array.from({ length: TASKS - words.length }, (_, k) => fillTask(c, k)),
  ];
}

/** listed is a batch's characters with their reading, strokes and meaning, for an explanation. */
const listed = (chars: readonly LevelOneCharacter[]): Text =>
  t(
    chars.map((c) => `- **${c.char}** (${c.reading}, ${strokeCount(c.char)} strokes) ${c.meaning.en}`).join("\n"),
    chars.map((c) => `- **${c.char}**（${c.reading}，${strokeCount(c.char)} 画）${c.meaning["zh-CN"]}`).join("\n"),
  );

/** levelHandwritingByLevel are each level's writing batches, in order; each follows the batch before it, across levels. */
export const levelHandwritingByLevel: readonly { readonly level: number; readonly batches: readonly LevelHandBatch[] }[] = (() => {
  const all = levelNinePlan.characters;
  const order = [...all.keys()];
  let previous: string | undefined;
  // The latest character batch of each level an earlier writing batch needs: those before it are implied.
  const needed = new Map<number, number>();
  return WRITTEN_BY_LEVEL.map((upTo, i) => {
    const level = i + 1;
    const from = i === 0 ? 0 : WRITTEN_BY_LEVEL[i - 1]!;
    const batches: LevelHandBatch[] = [];
    for (let k = from; k < upTo; k += HAND_BATCH) {
      const chars = order.slice(k, Math.min(k + HAND_BATCH, upTo)).map((char) => {
        const taught = taughtIn.get(char);
        if (!taught || taught.level > level) throw new Error(`writing ${char} in level ${level}: it is not read by then`);
        if (!medians.has(char)) throw new Error(`writing ${char} in level ${level}: no medians`);
        return all.get(char)!;
      });
      if (chars.length !== HAND_BATCH) throw new Error(`writing level ${level}: a batch of ${chars.length}`);
      const id = levelHandwritingId(level, batches.length + 1);
      // A level's character batches each follow the one before, so only the latest of each level is a prerequisite.
      const latest = new Map<number, number>();
      for (const c of chars) {
        const { level: from, batch } = taughtIn.get(c.char)!;
        latest.set(from, Math.max(latest.get(from) ?? 0, batch));
      }
      const reading = [...latest]
        .filter(([from, batch]) => batch > (needed.get(from) ?? 0))
        .map(([from, batch]) => levelCharacterId(from, batch));
      for (const [from, batch] of latest) needed.set(from, Math.max(needed.get(from) ?? 0, batch));
      // Character by character within each round of tasks, so consecutive seeds never show the same character.
      const each = chars.map((c) => tasksOf(c, level));
      const tasks = Array.from({ length: TASKS }, (_, r) => each.map((x) => x[r]!)).flat();
      const n = batches.length + 1;
      const topic = handTopic(
        id,
        t(`Level ${level} Handwriting, Set ${n}`, `${level}级写汉字 第${n}组`),
        chars.map((c) => c.char),
        tasks,
        listed(chars),
        [...(previous ? [previous] : []), ...reading],
      );
      batches.push({ level, topic, chars });
      previous = id;
    }
    return { level, batches };
  });
})();

/** levelHandwritingTopics are every writing topic of the levels. */
export const levelHandwritingTopics: readonly TopicDef[] = levelHandwritingByLevel.flatMap((l) => l.batches.map((b) => b.topic));
