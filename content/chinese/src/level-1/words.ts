// The word topics of level 1 (docs/chinese-curriculum.md §8.3): a batch of ten words of one theme, each found by its
// meaning, read in pinyin and put into a short sentence written with the characters taught so far.

import { same, type Text, type TopicDef, t } from "@ga/content";
import { point, toneless } from "@ga/subject-chinese";

import type { LevelOneCharacter } from "./characters.ts";
import { type Asked, askedGenerator, dataLines, fields, nearOf, spread, three, threeOf, toneOf, withTone } from "./kit.ts";

/** GAP marks where the word goes in a sentence. */
export const GAP = "＿＿";

/** LevelOneWord is a level 1 word: its syllables, its meaning, a sentence to fill and the words kept apart from it. */
export interface LevelOneWord {
  readonly word: string;
  readonly syllables: readonly string[];
  readonly meaning: Text;
  readonly sentence: string;
  readonly near: readonly string[];
}

/** parseLevelOneWords reads a batch of level 1 words (see word-data.ts). */
export function parseLevelOneWords(data: string): readonly LevelOneWord[] {
  return parseLevelWords(data, 1);
}

/** parseLevelWords reads a batch of words of a level, written as in level 1, naming the level in its errors. */
export function parseLevelWords(data: string, level: number): readonly LevelOneWord[] {
  return dataLines(data).map((line) => {
    const [word = "", pinyin = "", en = "", zh = "", sentence = "", near = ""] = fields(line, 5, 6, `level ${level}`);
    const syllables = pinyin.split(" ").map((s) => s.normalize("NFC"));
    if ([...word].length !== syllables.length) throw new Error(`level ${level} words: the pinyin of ${word}`);
    if (zh.includes(word)) throw new Error(`level ${level} words: the meaning of ${word} uses it`);
    if (sentence.split(GAP).length !== 2) throw new Error(`level ${level} words: the sentence of ${word} needs one gap`);
    if (sentence.includes(word)) throw new Error(`level ${level} words: the sentence of ${word} gives it away`);
    return { word, syllables, meaning: t(en, zh), sentence, near: near === "" ? [] : near.split(" ") };
  });
}

/** pinyinOf writes the syllables of a word as one word of pinyin, with an apostrophe before a syllable that starts with a, o or e. */
export function pinyinOf(syllables: readonly string[]): string {
  return syllables.map((s, i) => (i > 0 && /^[aoe]/u.test(toneless(s)) ? `'${s}` : s)).join("");
}

/** KEPT are characters whose tone changes in speech; their syllables are not changed to make wrong readings. */
const KEPT = new Set(["一", "不"]);

/** wrongReadings are readings of a word with one tone changed, the syllables taking turns, then the neutral syllables. */
function wrongReadings(w: LevelOneWord, chars: ReadonlyMap<string, LevelOneCharacter>): readonly string[] {
  const own = [...w.word];
  const single = own.length === 1 ? chars.get(own[0]!) : undefined;
  const others = new Set(single ? single.others.map((r) => r.normalize("NFC")) : []);
  const variants = (index: number, tones: readonly number[]): readonly string[] =>
    tones
      .filter((k) => k !== toneOf(w.syllables[index]!))
      .map((k) => withTone(w.syllables[index]!, k))
      .filter((s) => !others.has(s))
      .map((s) => pinyinOf(w.syllables.map((x, j) => (j === index ? s : x))));
  const indices = w.syllables.map((_, i) => i).filter((i) => !KEPT.has(own[i]!));
  const toned = indices.filter((i) => toneOf(w.syllables[i]!) !== 0).map((i) => variants(i, [1, 2, 3, 4]));
  const neutral = indices.filter((i) => toneOf(w.syllables[i]!) === 0).map((i) => variants(i, [1, 2, 3, 4]));
  const turns = (lists: readonly (readonly string[])[]): readonly string[] =>
    [0, 1, 2, 3].flatMap((r) => lists.map((l) => l[r]).filter((s): s is string => s !== undefined));
  return [...turns(toned), ...turns(neutral)];
}

/** LevelOneWordSpec describes a level 1 word topic. */
export interface LevelOneWordSpec {
  readonly id: string;
  readonly title: Text;
  readonly theme: Text;
  readonly prerequisites: readonly string[];
  readonly batch: readonly LevelOneWord[];
  /** chars are all the level 1 characters, whose other readings are never offered as wrong readings of a one-character word. */
  readonly chars: ReadonlyMap<string, LevelOneCharacter>;
  /** level names the level in errors; it is 1 when left out. */
  readonly level?: number;
}

/** levelOneWordTopic builds a level 1 word topic with its three knowledge points. */
export function levelOneWordTopic(spec: LevelOneWordSpec): TopicDef {
  const { batch, id } = spec;
  const level = spec.level ?? 1;
  const near = nearOf(
    batch.map((w) => ({ key: w.word, near: w.near })),
    `level ${level}`,
  );
  for (const [i, w] of batch.entries()) {
    for (const v of batch.slice(i + 1)) {
      if (w.meaning.en === v.meaning.en || w.meaning["zh-CN"] === v.meaning["zh-CN"]) {
        throw new Error(`level ${level} words: ${w.word} and ${v.word} mean the same`);
      }
    }
  }
  const mates = (w: LevelOneWord, i: number): readonly LevelOneWord[] => spread(batch, i).filter((v) => !near.get(w.word)!.has(v.word));
  const pinyin = (w: LevelOneWord): string => pinyinOf(w.syllables);

  const form: readonly Asked[] = batch.map((w, i) => ({
    shown: w.meaning,
    right: same(w.word),
    wrong: three(
      threeOf(
        `the word of ${w.word}`,
        w.word,
        mates(w, i).map((v) => v.word),
        `level ${level}`,
      ),
    ),
    solution: why(w),
  }));

  const reading: readonly Asked[] = batch.map((w, i) => {
    const right = pinyin(w);
    const wrong = threeOf(
      `the reading of ${w.word}`,
      right,
      [...wrongReadings(w, spec.chars), ...spread(batch, i).map(pinyin)],
      `level ${level}`,
    );
    return {
      shown: same(w.word),
      right: same(right),
      wrong: three(wrong),
      solution: t(`**${w.word}** is read **${right}**.`, `**${w.word}**读 **${right}**。`),
    };
  });

  const use: readonly Asked[] = batch.map((w, i) => {
    const whole = w.sentence.replace(GAP, w.word);
    return {
      shown: same(w.sentence),
      right: same(w.word),
      wrong: three(
        threeOf(
          `the gap of ${w.word}`,
          w.word,
          mates(w, i).map((v) => v.word),
          `level ${level}`,
        ),
      ),
      solution: t(
        `The sentence is ${whole} **${w.word}** (${pinyin(w)}) means "${w.meaning.en}".`,
        `完整的句子是：${whole}“**${w.word}**”（${pinyin(w)}）的意思是：${w.meaning["zh-CN"]}。`,
      ),
    };
  });

  const list = (locale: "en" | "zh-CN"): string =>
    batch.map((w) => `- **${w.word}** ${pinyin(w)}${locale === "en" ? ":" : "："} ${w.meaning[locale]}`).join("\n");
  const words = batch.map((w) => w.word).join("、");
  return {
    id,
    title: spec.title,
    summary: t(
      `Ten words about ${spec.theme.en.toLowerCase()}, ${words}: finding each by its meaning, reading it, and using it in a sentence.`,
      `“${spec.theme["zh-CN"]}”的十个词语：${words}。按意思找词，读准拼音，在句子里用对。`,
    ),
    prerequisites: [...spec.prerequisites],
    encompasses: [],
    xp: batch.length,
    strand: "words",
    knowledgePoints: [
      point(
        `${id}-meaning`,
        t("Finding the Word", "按意思找词"),
        t(
          `Each word is written with characters you know. Think of what each character means, then of the word they make together.\n\n${list("en")}`,
          `这些词都是用学过的字写的。想一想每个字的意思，再想它们合起来是什么词。\n\n${list("zh-CN")}`,
        ),
        askedGenerator(t("Which word has this meaning?", "哪个词语是这个意思？"), form),
      ),
      point(
        `${id}-reading`,
        t("Reading the Word", "读准词语"),
        t(
          `A word of pinyin is written as one: its syllables are joined, and an apostrophe comes before a syllable that starts with a, o or e. A syllable with no tone mark is read in the neutral tone, light and short. 一 and 不 are written with their own tones, though they change in speech.\n\n${list("en")}`,
          `一个词的拼音连在一起写；以 a、o、e 开头的音节前面加隔音符号“'”。没有调号的音节读轻声，又轻又短。“一”和“不”按原调标写，说话时会变调。\n\n${list("zh-CN")}`,
        ),
        askedGenerator(t("Which is the pinyin of this word?", "这个词语的拼音是什么？"), reading),
      ),
      point(
        `${id}-use`,
        t("Using the Word", "选词填空"),
        t(
          `Read the whole sentence first, then try each word in the gap: only one makes the sentence say something true and complete.\n\n${list("en")}`,
          `先读完整个句子，再把每个词放进横线处试一试：只有一个词能让句子通顺、意思完整。\n\n${list("zh-CN")}`,
        ),
        askedGenerator(t("Which word fills the gap?", "横线处填哪个词语？"), use),
      ),
    ],
  };
}

/** why explains a word: its reading and its meaning. */
function why(w: LevelOneWord): Text {
  return t(
    `**${w.word}** (${pinyinOf(w.syllables)}) means "${w.meaning.en}".`,
    `**${w.word}**（${pinyinOf(w.syllables)}）的意思是：${w.meaning["zh-CN"]}。`,
  );
}
