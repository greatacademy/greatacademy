// Grade 6: helpers of the grade's topics. Most come from grade 5; parts builds a topic of word parts, roots or
// prefixes, each with three words that carry its meaning.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point } from "@ga/subject-english";
import { bars } from "../../topics/steps.ts";
import { field, type Pair, rows, topic } from "../grade-5/kit.ts";

export { choose, field, type Label, label, type Pair, rows, topic, type Why } from "../grade-5/kit.ts";

/** Part is a root or prefix: what it means, in English and in Chinese, and three words with their definitions. */
export interface Part {
  readonly part: string;
  readonly means: string;
  readonly zh: string;
  readonly words: readonly (readonly [word: string, definition: string])[];
}

/** partLines reads lines of "part|meaning|中文|word|definition|word|definition|word|definition". */
export const partLines = (lines: string): Part[] =>
  rows(lines).map((r) => ({
    part: field(r, 0),
    means: field(r, 1),
    zh: field(r, 2),
    words: [
      [field(r, 3), field(r, 4)],
      [field(r, 5), field(r, 6)],
      [field(r, 7), field(r, 8)],
    ],
  }));

/** PartsSpec describes a topic of word parts: its names, the kind of part and the explanations of its two steps. */
export interface PartsSpec {
  readonly id: string;
  readonly title: Pair;
  readonly summary: Pair;
  readonly after: readonly string[];
  /** kind names the part in questions, such as "Latin root" or "prefix". */
  readonly kind: Pair;
  readonly list: readonly Part[];
  readonly explanations: readonly [Pair, Pair];
}

/** parts builds a vocabulary topic of word parts: the meaning of a part in a word, then the word for a definition. */
export const parts = (spec: PartsSpec): TopicDef => {
  const { list, kind } = spec;
  const meaning: ChoiceItem[] = [];
  const forDefinition: ChoiceItem[] = [];
  list.forEach((p, i) => {
    p.words.forEach(([word, definition], k) => {
      const others = [list[(i + 1 + k) % list.length], list[(i + 4 + k) % list.length]];
      meaning.push([`*${p.part}* in **${word}** (${definition})`, p.means, others.map((o) => o?.means ?? "")]);
      forDefinition.push([definition, word, others.map((o) => o?.words[k]?.[0] ?? "")]);
    });
  });
  const byMeaning = (means: string) => list.find((p) => p.means === means);
  const byWord = (word: string) => list.find((p) => p.words.some(([w]) => w === word));
  return topic("vocabulary", {
    id: spec.id,
    title: spec.title,
    summary: spec.summary,
    after: spec.after,
    points: [
      point(
        "meaning-of-the-part",
        t(`The Meaning of the ${kind[0][0]?.toUpperCase()}${kind[0].slice(1)}`, `${kind[1]}的意思`),
        t(...spec.explanations[0]),
        choiceGenerator(
          t(`What does the ${kind[0]} in italics mean?`, `斜体的${kind[1]}是什么意思？`),
          meaning,
          (right) => {
            const p = byMeaning(right);
            return t(
              `The ${kind[0]} *${p?.part}* means *${right}*: ${p?.words.map(([w]) => `**${w}**`).join(", ")} all carry that meaning.`,
              `${kind[1]} *${p?.part}* 的意思是"${p?.zh}"：${p?.words.map(([w]) => `**${w}**`).join("、")} 都带有这个意思。`,
            );
          },
          (wrong) => {
            const p = byMeaning(wrong);
            return t(
              `*${wrong}* is the meaning of another ${kind[0]}, *${p?.part}*, as in **${p?.words[0]?.[0]}**.`,
              `*${wrong}* 是另一个${kind[1]} *${p?.part}* 的意思，例如 **${p?.words[0]?.[0]}**。`,
            );
          },
        ),
      ),
      point(
        "word-from-the-part",
        t("Choosing the Word from Its Parts", "根据构词成分选词"),
        t(...spec.explanations[1]),
        choiceGenerator(
          t("Which word has this meaning?", "哪个词是这个意思？"),
          forDefinition,
          (right, shown) => {
            const p = byWord(right);
            return t(
              `**${right}** means *${shown}*. Its ${kind[0]} *${p?.part}* means *${p?.means}*, which points to the meaning.`,
              `**${right}** 的意思是 *${shown}*。它的${kind[1]} *${p?.part}* 意为"${p?.zh}"，指向这个意思。`,
            );
          },
          (wrong) => {
            const p = byWord(wrong);
            const def = p?.words.find(([w]) => w === wrong)?.[1];
            return t(
              `**${wrong}** has the ${kind[0]} *${p?.part}* (${p?.means}); it means *${def}*.`,
              `**${wrong}** 的${kind[1]}是 *${p?.part}*（${p?.zh}），意思是 *${def}*。`,
            );
          },
        ),
      ),
    ],
  });
};

/**
 * rival replaces the wrong option at slot of each item with the right option of another item: a longer one in two items
 * of three and a shorter one in the third, so that the right option is not the longest by habit. The kind of mistake at
 * slot must then read as an option that answers some other item.
 */
export const rival = (items: string | readonly ChoiceItem[], slot: number): ChoiceItem[] => {
  const bank = typeof items === "string" ? bars(items) : items;
  return bank.map(([shown, right, wrongs], i) => {
    const others = bank.map((item) => item[1]).filter((r) => r !== right && !wrongs.includes(r));
    const longer = others.filter((r) => r.length >= right.length).sort((a, b) => a.length - b.length);
    const shorter = others.filter((r) => r.length < right.length).sort((a, b) => b.length - a.length);
    const pick =
      (i % 3 === 0 ? (shorter[0] ?? longer[0]) : (longer[i % Math.max(1, Math.min(3, longer.length))] ?? shorter[0])) ?? wrongs[slot];
    if (pick === undefined) throw new Error(`no rival for ${shown}`);
    return [shown, right, wrongs.map((w, j) => (j === slot ? pick : w))];
  });
};
