// Hearing pinyin (docs/chinese-curriculum.md §5, docs/chinese-development-plan.md C2.3): a syllable is played and the
// learner chooses how it is written, among the same syllable in other tones, or among syllables of the same tone whose
// initials or finals sound alike: zh and z, n and l, f and h, an and ang, in and ing. The recordings are of the readings
// of the characters this subject teaches, each said by a character that has it.

import { type Generator, type Problem, type Rng, same, type Text, type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-chinese";

import { heardSyllable } from "../audio.ts";
import { gradesFiveAndSixEntries, gradesOneAndTwoEntries, gradesThreeAndFourEntries } from "../characters/index.ts";
import { mark, parseSyllable, type Syllable } from "./syllables.ts";
import { nasal, PITCH_EN, PITCH_ZH, SYMBOL, said, TONE_EN, TONE_ZH, toneConfusion } from "./teach.ts";

/**
 * Heard is a syllable to play: the syllable, the character with that reading that carries its recording, and the
 * commonest character with that reading, which the solution names.
 */
interface Heard {
  readonly syllable: Syllable;
  readonly char: string;
  readonly common: string;
}

/**
 * commonest maps each reading to its commonest character: the characters of the native courses in their order, grades 1
 * and 2 first, which go by frequency. The recording's own carrier stays, since its phonemes fix the sound it says.
 */
const commonest: ReadonlyMap<string, string> = new Map(
  [...gradesOneAndTwoEntries, ...gradesThreeAndFourEntries, ...gradesFiveAndSixEntries]
    .filter((e) => [...e.char].length === 1)
    .flatMap((e) => {
      const s = parseSyllable(e.reading);
      return s ? [[s.written, e.char] as const] : [];
    })
    .reverse(),
);

/** inventory are the distinct readings of the characters taught, each with the first character that has it. */
const inventory: readonly Heard[] = [
  ...new Map(
    [...gradesThreeAndFourEntries, ...gradesFiveAndSixEntries].flatMap((e) => {
      const s = parseSyllable(e.reading);
      return s && [...e.char].length === 1
        ? [[s.written, { syllable: s, char: e.char, common: commonest.get(s.written) ?? e.char }] as const]
        : [];
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

/** withReasons ends a solution with why each wrong option is wrong, one line an option. */
function withReasons(solution: Text, reasons: readonly Text[]): Text {
  const list = (locale: "en" | "zh-CN") => reasons.map((r) => `- ${r[locale]}`).join("\n");
  return t(`${solution.en}\n\nThe other options:\n\n${list("en")}`, `${solution["zh-CN"]}\n\n其他选项：\n\n${list("zh-CN")}`);
}

/**
 * hearing is a generator that plays an item's syllable and asks for its spelling with two of its wrong ones, cycling
 * through the items in three rounds, so that each item comes with each pair of its wrong answers; each wrong option
 * is answered with its own reason.
 */
function hearing(items: readonly Item[], why: (item: Item) => Text, whyNot: (wrong: string, item: Item) => Text): Generator {
  const asked = PAIRS.flatMap(([a, b]) => items.map((item) => ({ item, wrong: [item.wrong[a], item.wrong[b]] as const })));
  for (const { heard } of items) heardSyllable(heard.char, heard.syllable.plain, heard.syllable.tone);
  return (rng: Rng): Problem => {
    const { item, wrong } = rng.cycle(asked);
    const options = rng.shuffle([item.right, ...wrong]);
    const answer = options.indexOf(item.right);
    const reasons = options.filter((o) => o !== item.right).map((o) => whyNot(o, item));
    return {
      prompt: t("Listen. Which syllable do you hear?", "听录音。你听到的是哪个音节？"),
      listen: [heardSyllable(item.heard.char, item.heard.syllable.plain, item.heard.syllable.tone)],
      answer: { checker: "choice", expected: answer, input: { kind: "choice", options: options.map((o) => same(o)) } },
      solution: withReasons(why(item), reasons),
      canonical: String(answer),
      wrong: options.map((_, i) => String(i)).filter((i) => i !== String(answer)),
      mistakes: wrong.map((w) => ({ response: String(options.indexOf(w)), feedback: whyNot(w, item) })),
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

/** fourTones writes a plain syllable in each of the four tones. */
const fourTones = (plain: string): string => [1, 2, 3, 4].map((x) => mark(plain, x)).join(" ");

/** toneWhy works a heard tone: follow the pitch, then write its mark. */
const toneWhy = ({ heard, right }: Item): Text => {
  const { plain, tone } = heard.syllable;
  const n = tone - 1;
  return t(
    `**Step 1: follow the pitch.** The recording is ${PITCH_EN[n]}: that is the ${TONE_EN[n]} tone.\n\n**Step 2: write its mark.** The ${TONE_EN[n]} tone is marked ${SYMBOL[n]}: ${right}.\n\n**Check.** Say ${plain} in the four tones after the recording, ${fourTones(plain)}: only ${right} moves as the recording does. The recording says ${right}, as in ${heard.common}.`,
    `**第一步：听音高的走向。**录音里的声音${PITCH_ZH[n]}，是${TONE_ZH[n]}。\n\n**第二步：标调号。**${TONE_ZH[n]}的调号是 ${SYMBOL[n]}：${right}。\n\n**检验。** 跟着录音把 ${plain} 的四个声调读一遍：${fourTones(plain)}，只有 ${right} 和录音走向一样。录音读的是 ${right}，如“${heard.common}”。`,
  );
};

/** toneWhyNot says how a wrong tone moves, against the tone heard. */
const toneWhyNot = (wrong: string, { heard }: Item): Text => {
  const w = (parseSyllable(wrong)?.tone ?? 1) - 1;
  const n = heard.syllable.tone - 1;
  const more = toneConfusion(w + 1, n + 1);
  return t(
    `${wrong} is the ${TONE_EN[w]} tone, ${PITCH_EN[w]}; the recording is ${PITCH_EN[n]}.${more.en}`,
    `${wrong} 是${TONE_ZH[w]}，${PITCH_ZH[w]}；录音里的声音${PITCH_ZH[n]}。${more["zh-CN"]}`,
  );
};

/** soundsWhy works a heard syllable: its initial, then its final. */
const soundsWhy = ({ heard, right }: Item): Text => {
  const { initial, final, tone } = heard.syllable;
  const end = nasal(final);
  const start =
    initial === ""
      ? t("The syllable begins with its final, with no initial.", "这个音节没有声母，直接从韵母开始。")
      : t(`The syllable begins with ${initial}, ${said(initial)[0]}.`, `这个音节的声母是 ${initial}，${said(initial)[1]}。`);
  const ending = end
    ? t(`Its final, ${final}, is ${end[0]}.`, `韵母 ${final} 是${end[1]}。`)
    : t(`Its final is ${final}.`, `韵母是 ${final}。`);
  return t(
    `**Step 1: listen to the start.** ${start.en}\n\n**Step 2: listen to the end.** ${ending.en} So you hear ${right}.\n\n**Check.** Every option has the same tone, the ${TONE_EN[tone - 1]}, so only the sounds decide. The recording says ${right}, as in ${heard.common}.`,
    `**第一步：听开头。**${start["zh-CN"]}\n\n**第二步：听收尾。**${ending["zh-CN"]}所以听到的是 ${right}。\n\n**检验。** 几个选项的声调都是${TONE_ZH[tone - 1]}，只能靠声母和韵母来分辨。录音读的是 ${right}，如“${heard.common}”。`,
  );
};

/** soundsWhyNot says which sounds of a wrong syllable differ from the one heard. */
const soundsWhyNot = (wrong: string, { heard }: Item): Text => {
  const w = parseSyllable(wrong);
  const r = heard.syllable;
  if (!w) throw new Error(`pinyin hearing: ${wrong} is not a syllable`);
  const parts: Text[] = [];
  if (w.initial !== r.initial) {
    const [we, wz] = said(w.initial);
    const [re, rz] = said(r.initial);
    parts.push(
      t(
        `${w.initial === "" ? "it has no initial" : `it begins with ${w.initial}, ${we}`}, where the recording ${r.initial === "" ? "has none" : `has ${r.initial}, ${re}`}`,
        `${w.initial === "" ? "它没有声母" : `它的声母是 ${w.initial}，${wz}`}；录音里${r.initial === "" ? "没有声母" : `是 ${r.initial}，${rz}`}`,
      ),
    );
  }
  if (w.final !== r.final) {
    const we = nasal(w.final);
    const re = nasal(r.final);
    parts.push(
      we && re && we[0] !== re[0]
        ? t(
            `its final ${w.final} is ${we[0]}, where the recording's ${r.final} is ${re[0]}`,
            `它的韵母 ${w.final} 是${we[1]}；录音里的 ${r.final} 是${re[1]}`,
          )
        : t(`its final is ${w.final}, where the recording has ${r.final}`, `它的韵母是 ${w.final}；录音里是 ${r.final}`),
    );
  }
  return t(`${wrong}: ${parts.map((p) => p.en).join("; ")}.`, `${wrong}：${parts.map((p) => p["zh-CN"]).join("。")}。`);
};

/** pinyinHearing is the topic of hearing syllables: their tones, and initials and finals that sound alike. */
export const pinyinHearing: TopicDef = {
  id: "pinyin-hearing",
  title: t("Hearing Syllables", "听音节"),
  summary: t(
    "Hearing a syllable's tone, and telling apart initials and finals that sound alike.",
    "听出音节的声调，分辨读音相近的声母和韵母。",
  ),
  intro: t(
    "Hearing a syllable means hearing three things: its tone, its initial and its final. In 山 shān the pitch stays high and level, the first tone; the tongue curls back for sh; the final an ends at the front of the mouth. Change any one and the word changes: sān (三) has a flat-tongued s, shāng (伤) ends in ng.\n\nThe first knowledge point hears the tone, the second hears initials and finals that sound alike.",
    "听一个音节，要听三样东西：声调、声母和韵母。比如“山”shān，音高高而平，是第一声；sh 要翘舌；韵母 an 收音在口腔前部。改了其中任何一样，就成了别的字：sān（三）是平舌的 s，shāng（伤）以 ng 收尾。\n\n第一个知识点听声调，第二个分辨读音相近的声母和韵母。",
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
        "Listen to how the pitch moves: the first tone stays high and level, the second rises, the third dips low and comes back up, the fourth falls sharply. Say the syllable after the recording in all four tones, and hear which one matches.\n\nThe recording of 马 starts low, dips and comes up again: that is the third tone, mǎ.\n\n> **Watch out.** The second and third tones are easy to mix up, since both end higher than they start. The second rises straight away; the third first goes down low.",
        "听音高怎样变化：第一声高而平，第二声往上升，第三声先降后升，第四声从高往下降。跟着录音把这个音节的四个声调都读一读，听听哪一个和录音一样。\n\n比如“马”的录音，先压低再升上来，是第三声：mǎ。\n\n> **注意。** 第二声和第三声容易弄混，因为结尾都比开头高。第二声一开始就往上升；第三声要先降下去。",
      ),
      hearing(toneItems, toneWhy, toneWhyNot),
    ),
    point(
      "pinyin-hearing-sounds",
      t("Hearing Initials and Finals", "听声母和韵母"),
      t(
        "Some initials and finals sound alike. zh ch sh curl the tongue back, z c s keep it behind the teeth; n is said through the nose, l over the sides of the tongue; f touches the lower lip, h comes from the throat. A final with ng ends at the back of the mouth, one with n at the front: an and ang, en and eng, in and ing.\n\nThe recording of 南 begins through the nose and ends at the front: n and an, nán, not lán or náng.\n\n> **Watch out.** Listen to the end of the syllable as well as its start. A syllable that begins right can still end wrong: nán and náng share their initial.",
        "有些声母和韵母读音相近。zh ch sh 要翘舌，z c s 舌尖抵住上齿背；n 是鼻音，l 是边音；f 上齿碰下唇，h 从喉咙发出。后鼻韵母带 ng，收音在口腔后部；前鼻韵母带 n，收音在前部：an 和 ang、en 和 eng、in 和 ing。\n\n比如“南”的录音，开头气流从鼻子出来，收尾在前部：n 加 an，是 nán，不是 lán，也不是 náng。\n\n> **注意。** 既要听开头，也要听收尾。开头对了，结尾还可能错：nán 和 náng 的声母是一样的。",
      ),
      hearing(syllableItems, soundsWhy, soundsWhyNot),
    ),
  ],
};
