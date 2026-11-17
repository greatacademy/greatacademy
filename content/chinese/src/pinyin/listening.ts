// Hearing pinyin (docs/chinese-curriculum.md §5, docs/chinese-development-plan.md C2.3): a syllable is played and the
// learner chooses how it is written, among the same syllable in other tones, or among syllables of the same tone whose
// initials or finals sound alike: zh and z, n and l, f and h, an and ang, in and ing. The recordings are of the readings
// of the characters this subject teaches, each said by a character that has it.

import { type Generator, type Problem, type Rng, same, type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-chinese";

import { heardSyllable } from "../audio.ts";
import { gradesFiveAndSixEntries, gradesThreeAndFourEntries } from "../characters/index.ts";
import { mark, parseSyllable, type Syllable } from "./syllables.ts";

/** Heard is a syllable to play: the syllable and a character with that reading that says it. */
interface Heard {
  readonly syllable: Syllable;
  readonly char: string;
}

/** inventory are the distinct readings of the characters taught, each with the first character that has it. */
const inventory: readonly Heard[] = [
  ...new Map(
    [...gradesThreeAndFourEntries, ...gradesFiveAndSixEntries].flatMap((e) => {
      const s = parseSyllable(e.reading);
      return s && [...e.char].length === 1 ? [[s.written, { syllable: s, char: e.char }] as const] : [];
    }),
  ).values(),
];

/** plains are the syllables of Mandarin among the readings taught, without their tones. */
const plains = new Set(inventory.map((h) => h.syllable.plain));

/** SWAPS are the initials and finals that sound alike, each way round. */
const SWAPS: readonly (readonly [RegExp, string])[] = [
  [/^zh/u, "z"],
  [/^ch/u, "c"],
  [/^sh/u, "s"],
  [/^z(?!h)/u, "zh"],
  [/^c(?!h)/u, "ch"],
  [/^s(?!h)/u, "sh"],
  [/^n/u, "l"],
  [/^l/u, "n"],
  [/^f/u, "h"],
  [/^h/u, "f"],
  [/^r/u, "l"],
  [/ang$/u, "an"],
  [/eng$/u, "en"],
  [/ing$/u, "in"],
  [/an$/u, "ang"],
  [/en$/u, "eng"],
  [/in$/u, "ing"],
  [/ong$/u, "eng"],
];

/** alike are the syllables of Mandarin that sound like a plain syllable, by one swap or two. */
function alike(plain: string): readonly string[] {
  const once = SWAPS.flatMap(([from, to]) => (from.test(plain) ? [plain.replace(from, to)] : []));
  const twice = once.flatMap((p) => SWAPS.flatMap(([from, to]) => (from.test(p) ? [p.replace(from, to)] : [])));
  return [...new Set([...once, ...twice])].filter((p) => p !== plain && plains.has(p));
}

/** spread reorders a list so that neighbours are far apart: every seventh item, then the next offset, and so on. */
const spread = <T>(items: readonly T[], step = 7): readonly T[] =>
  Array.from({ length: step }, (_, k) => k).flatMap((k) => items.filter((_, i) => i % step === k));

/** Item is a syllable to hear, the right spelling and three wrong ones. */
interface Item {
  readonly heard: Heard;
  readonly right: string;
  readonly wrong: readonly [string, string, string];
}

/** PAIRS are the two wrong answers of three offered with an item in each of its three rounds. */
const PAIRS = [
  [0, 1],
  [1, 2],
  [0, 2],
] as const;

/**
 * hearing is a generator that plays an item's syllable and asks for its spelling with two of its wrong ones, cycling
 * through the items in three rounds, so that each item comes with each pair of its wrong answers.
 */
function hearing(items: readonly Item[], why: (item: Item) => ReturnType<typeof t>): Generator {
  const asked = PAIRS.flatMap(([a, b]) => items.map((item) => ({ item, wrong: [item.wrong[a], item.wrong[b]] as const })));
  for (const { heard } of items) heardSyllable(heard.char, heard.syllable.plain, heard.syllable.tone);
  return (rng: Rng): Problem => {
    const { item, wrong } = rng.cycle(asked);
    const options = rng.shuffle([item.right, ...wrong]);
    const answer = options.indexOf(item.right);
    return {
      prompt: t("Listen. Which syllable do you hear?", "听录音。你听到的是哪个音节？"),
      listen: [heardSyllable(item.heard.char, item.heard.syllable.plain, item.heard.syllable.tone)],
      answer: { checker: "choice", expected: answer, input: { kind: "choice", options: options.map((o) => same(o)) } },
      solution: why(item),
      canonical: String(answer),
      wrong: options.map((_, i) => String(i)).filter((i) => i !== String(answer)),
    };
  };
}

/** COUNT is how many syllables each knowledge point plays. */
const COUNT = 40;

const toneItems: readonly Item[] = spread(inventory)
  .slice(0, COUNT)
  .map((heard) => {
    const { plain, tone, written } = heard.syllable;
    const others = [1, 2, 3, 4].filter((x) => x !== tone).map((x) => mark(plain, x));
    return { heard, right: written, wrong: [others[0]!, others[1]!, others[2]!] as const };
  });

const syllableItems: readonly Item[] = spread(inventory)
  .flatMap((heard): readonly Item[] => {
    const { plain, tone, written } = heard.syllable;
    const near = alike(plain).map((p) => mark(p, tone));
    return near.length >= 3 ? [{ heard, right: written, wrong: [near[0]!, near[1]!, near[2]!] as const }] : [];
  })
  .slice(0, COUNT);

/** TONE_ORDINALS name the four tones. */
const TONE_ORDINALS = ["第一声", "第二声", "第三声", "第四声"];
const TONE_EN = ["first", "second", "third", "fourth"];

/** pinyinHearing is the topic of hearing syllables: their tones, and initials and finals that sound alike. */
export const pinyinHearing: TopicDef = {
  id: "pinyin-hearing",
  title: t("Hearing Syllables", "听音节"),
  summary: t(
    "Hearing a syllable's tone, and telling apart initials and finals that sound alike.",
    "听出音节的声调，分辨读音相近的声母和韵母。",
  ),
  prerequisites: ["pinyin-spelling"],
  encompasses: [],
  xp: 8,
  strand: "pinyin",
  knowledgePoints: [
    point(
      "pinyin-hearing-tones",
      t("Hearing the Tone", "听声调"),
      t(
        "Listen to how the pitch moves: the first tone stays high and level, the second rises, the third dips low and comes back up, the fourth falls sharply. Say the syllable after the recording in all four tones, and hear which one matches.",
        "听音高怎样变化：第一声高而平，第二声往上升，第三声先降后升，第四声从高往下降。跟着录音把这个音节的四个声调都读一读，听听哪一个和录音一样。",
      ),
      hearing(toneItems, ({ heard, right }) =>
        t(
          `You hear ${right}, in the ${TONE_EN[heard.syllable.tone - 1]} tone, as in ${heard.char}.`,
          `你听到的是 ${right}，${TONE_ORDINALS[heard.syllable.tone - 1]}，如“${heard.char}”。`,
        ),
      ),
    ),
    point(
      "pinyin-hearing-sounds",
      t("Hearing Initials and Finals", "听声母和韵母"),
      t(
        "Some initials and finals sound alike. zh ch sh curl the tongue back, z c s keep it behind the teeth; n is said through the nose, l over the sides of the tongue; f touches the lower lip, h comes from the throat. A final with ng ends at the back of the mouth, one with n at the front: an and ang, en and eng, in and ing.",
        "有些声母和韵母读音相近。zh ch sh 要翘舌，z c s 舌尖抵住上齿背；n 是鼻音，l 是边音；f 上齿碰下唇，h 从喉咙发出。后鼻韵母带 ng，收音在口腔后部；前鼻韵母带 n，收音在前部：an 和 ang、en 和 eng、in 和 ing。",
      ),
      hearing(syllableItems, ({ heard, right }) =>
        t(`You hear ${right}, as in ${heard.char}.`, `你听到的是 ${right}，如“${heard.char}”。`),
      ),
    ),
  ],
};
