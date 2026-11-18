// The sentence-building topics of the levels (docs/chinese-curriculum.md §8.4): the first writing of a unit, checked by
// rules. The learner puts the parts of a sentence in order. A topic comes at the end of every third unit and uses the
// grammar and words of those three units; it has two knowledge points, short sentences of three or four parts and long
// ones of five to seven. Every part uses only the characters taught by the end of its unit.

import { type Generator, type Problem, type Rng, same, type Text, type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-chinese";

/** PUNCTUATION may appear in a sentence besides taught characters. */
const PUNCTUATION = new Set([..."，。？！：“”、…"]);

/** SentenceItem is a sentence split into its parts in a right order, and any other orders that are also right. */
export interface SentenceItem {
  readonly parts: readonly string[];
  /** alsoRight lists further right orders, as indexes into parts. */
  readonly alsoRight: readonly (readonly number[])[];
}

/** LevelSentences is a sentence-building topic of a level as written in its data. */
export interface LevelSentences {
  /** unit is the unit the topic ends, counting from 1: the third, sixth, ninth or twelfth. */
  readonly unit: number;
  /** short holds sentences of three or four parts, a line each: the parts split by `/`, then optionally ` | ` and further right orders split by `;`, each its indexes split by `,`. */
  readonly short: string;
  /** long holds sentences of five to seven parts, written as short is. */
  readonly long: string;
}

/** MIN_ITEMS is how many sentences a knowledge point needs, so that it has 30 distinct problems. */
const MIN_ITEMS = 30;

const two = (n: number): string => String(n).padStart(2, "0");

/** levelSentencesId is the id of the nth sentence-building topic of a level, counting from 1. */
export const levelSentencesId = (level: number, n: number): string => `level-${level}-sentences-${two(n)}`;

/** parseSentences reads the sentences of a knowledge point, checking their parts, their orders and their characters. */
export function parseSentences(
  where: string,
  data: string,
  parts: readonly [min: number, max: number],
  taught: ReadonlySet<string>,
): readonly SentenceItem[] {
  const items = data
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "")
    .map((line): SentenceItem => {
      const [sentence = "", orders] = line.split(" | ");
      const split = sentence.split("/").map((p) => p.trim());
      if (split.length < parts[0] || split.length > parts[1])
        throw new Error(`${where}: ${sentence} has ${split.length} parts, not ${parts[0]} to ${parts[1]}`);
      if (split.some((p) => p === "") || new Set(split).size !== split.length)
        throw new Error(`${where}: ${sentence} has an empty or repeated part`);
      if (!/[。？！]$/u.test(split.at(-1) ?? "")) throw new Error(`${where}: ${sentence} must end its last part with 。？ or ！`);
      const untaught = [...split.join("")].filter((ch) => !taught.has(ch) && !PUNCTUATION.has(ch));
      if (untaught.length > 0) throw new Error(`${where}: ${sentence} uses ${[...new Set(untaught)].join("")}, not yet taught`);
      const alsoRight = (orders ?? "")
        .split(";")
        .map((o) => o.trim())
        .filter((o) => o !== "")
        .map((o) => o.split(",").map(Number));
      for (const o of alsoRight) {
        if (o.length !== split.length || [...o].sort((a, b) => a - b).join() !== split.map((_, i) => i).join())
          throw new Error(`${where}: ${sentence} lists an order that is not a reordering of its parts`);
      }
      return { parts: split, alsoRight };
    });
  const sentences = items.map((i) => i.parts.join(""));
  const twice = sentences.find((s, i) => sentences.indexOf(s) !== i);
  if (twice) throw new Error(`${where}: ${twice} is written twice`);
  if (items.length < MIN_ITEMS) throw new Error(`${where}: needs ${MIN_ITEMS} sentences, has ${items.length}`);
  return items;
}

/** QUESTION asks for the parts in order. */
const QUESTION = t("Put the parts in order to make a sentence.", "把下面的词语排成一个句子。");

/**
 * sentenceGenerator picks a sentence by seed and shuffles its parts, never showing them already in a right order. The
 * shown order is the listed wrong response: submitting the parts as they come.
 */
export function sentenceGenerator(bank: readonly SentenceItem[]): Generator {
  return (rng: Rng): Problem => {
    const { parts, alsoRight } = rng.cycle(bank);
    const rightOrders = [parts.map((_, i) => i), ...alsoRight];
    const isRight = (order: readonly number[]) => rightOrders.some((o) => o.join() === order.join());
    let shuffled = rng.shuffle(parts.map((_, i) => i));
    // A rotation of a right order keeps the parts out of order; trying every rotation ends after one pass.
    for (let tries = 0; isRight(shuffled) && tries < parts.length; tries++) shuffled = [...shuffled.slice(1), shuffled[0] ?? 0];
    const position = (from: readonly number[]) => from.map((original) => shuffled.indexOf(original));
    const expected = rightOrders.map(position);
    const whole = parts.join("");
    return {
      prompt: QUESTION,
      answer: {
        checker: "order",
        expected: expected.map((o) => [...o]),
        input: { kind: "order", items: shuffled.map((i) => same(parts[i] ?? "")) },
      },
      solution: t(`The sentence reads: ${whole}`, `句子是：${whole}`),
      canonical: (expected[0] ?? []).join(","),
      wrong: isRight(shuffled) ? [] : [shuffled.map((_, i) => i).join(",")],
    };
  };
}

/** SHORT_EXPLANATION teaches the order of a simple Chinese sentence. */
const SHORT_EXPLANATION = t(
  [
    "A Chinese sentence keeps a firm order: **who** (the subject) comes first, then **when** and **where**, then the **verb**, then **what** (the object).",
    "",
    "- 我 / 明天 / 去 / 学校。 — *I / tomorrow / go / school.*",
    "- 他 / 在家里 / 看书。 — *He / at home / reads.*",
    "",
    "Words of time may also open the sentence (明天我去学校), but places with 在 always come before the verb, never after it as in English. Question words such as 什么 and 哪儿 stay where the answer would go.",
  ].join("\n"),
  [
    "中文句子的语序比较固定：先说**谁**（主语），再说**什么时候**、**在哪儿**，然后是**动作**（动词），最后是**什么**（宾语）。",
    "",
    "- 我 / 明天 / 去 / 学校。",
    "- 他 / 在家里 / 看书。",
    "",
    "表示时间的词也可以放在句子开头（明天我去学校），但“在＋地点”一定放在动词前面。什么、哪儿这样的疑问词放在答案应该在的位置。",
  ].join("\n"),
);

/** LONG_EXPLANATION teaches how longer sentences add their parts in order. */
const LONG_EXPLANATION = t(
  [
    "A longer sentence adds its parts in the same order, from what frames the action to the action itself:",
    "",
    "**subject — time — place or manner — 和 / 跟 / 给 + someone — verb — object**",
    "",
    "- 我 / 上个星期 / 跟朋友 / 在饭馆 / 吃了 / 一顿饭。",
    "",
    "A word that describes a noun comes before it with 的 (我买的书); a clause of reason or time comes before the main clause (因为下雨，……). When two orders are both right, either is accepted.",
  ].join("\n"),
  [
    "长一些的句子也按同样的顺序加进各个部分，从说明动作的情况到动作本身：",
    "",
    "**主语 — 时间 — 地点或方式 — 和 / 跟 / 给＋人 — 动词 — 宾语**",
    "",
    "- 我 / 上个星期 / 跟朋友 / 在饭馆 / 吃了 / 一顿饭。",
    "",
    "修饰名词的成分用“的”放在名词前面（我买的书）；表示原因或时间的分句放在主句前面（因为下雨，……）。两种顺序都对的时候，哪一种都算对。",
  ].join("\n"),
);

/** SentenceSpec says how to build the sentence-building topic that ends a unit, if it has one. */
export interface SentenceSpec {
  readonly level: number;
  /** n is the number of the topic within the level, counting from 1. */
  readonly n: number;
  readonly sentences: LevelSentences;
  /** themes are the titles of the units the topic covers. */
  readonly themes: readonly Text[];
  /** taught are the characters taught by the end of the unit. */
  readonly taught: ReadonlySet<string>;
  /** after is the unit's last topic of words or grammar. */
  readonly after: string;
}

/** sentenceTopic builds a sentence-building topic, which needs the unit's last topic and the sentence topic before it. */
export function sentenceTopic(spec: SentenceSpec): TopicDef {
  const id = levelSentencesId(spec.level, spec.n);
  const short = parseSentences(`${id}-short`, spec.sentences.short, [3, 4], spec.taught);
  const long = parseSentences(`${id}-long`, spec.sentences.long, [5, 7], spec.taught);
  const en = spec.themes.map((x) => x.en).join(", ");
  const zh = spec.themes.map((x) => x["zh-CN"]).join("、");
  return {
    id,
    title: t(`Building Sentences ${spec.n}: ${en}`, `连词成句 ${spec.n}：${zh}`),
    summary: t(
      `Putting the parts of sentences in order, with the words and grammar of ${en}.`,
      `用${zh}这几个单元的词语和语法，把词语排成句子。`,
    ),
    prerequisites: [spec.after, ...(spec.n > 1 ? [levelSentencesId(spec.level, spec.n - 1)] : [])],
    encompasses: [],
    xp: 12,
    strand: "writing",
    knowledgePoints: [
      point(
        `${id}-short`,
        t(`Building Sentences ${spec.n}: Short Sentences`, `连词成句 ${spec.n}：短句`),
        SHORT_EXPLANATION,
        sentenceGenerator(short),
      ),
      point(
        `${id}-long`,
        t(`Building Sentences ${spec.n}: Longer Sentences`, `连词成句 ${spec.n}：长句`),
        LONG_EXPLANATION,
        sentenceGenerator(long),
      ),
    ],
  };
}

/** checkSentenceUnits checks that a level's sentence topics end its third, sixth, ninth and twelfth units, once each and in order. */
export function checkSentenceUnits(level: number, sentences: readonly LevelSentences[]): void {
  const units = sentences.map((s) => s.unit).join();
  if (!"3,6,9,12".startsWith(units)) throw new Error(`level ${level}: sentence topics end units ${units}, not 3,6,9,12`);
}

/** UnitSentences says where a unit stands in its level, for the sentence-building topic that may end it. */
export interface UnitSentences {
  readonly level: number;
  /** unit is the index of the unit, counting from 0. */
  readonly unit: number;
  readonly sentences: readonly LevelSentences[];
  /** titles are the titles of all the level's units. */
  readonly titles: readonly Text[];
  readonly taught: ReadonlySet<string>;
  readonly after: string;
}

/** unitSentenceTopics builds the sentence-building topic that ends a unit, if the level's data has one for it. */
export function unitSentenceTopics(spec: UnitSentences): readonly TopicDef[] {
  if (spec.unit === 0) checkSentenceUnits(spec.level, spec.sentences);
  const k = spec.sentences.findIndex((s) => s.unit === spec.unit + 1);
  const sentences = spec.sentences[k];
  if (sentences === undefined) return [];
  return [
    sentenceTopic({
      level: spec.level,
      n: k + 1,
      sentences,
      themes: spec.titles.slice(spec.unit - 2, spec.unit + 1),
      taught: spec.taught,
      after: spec.after,
    }),
  ];
}
