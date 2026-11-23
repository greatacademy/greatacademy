// The word topics of level 1 (docs/chinese-curriculum.md §8.3): a batch of ten words of one theme, each found by its
// meaning, read in pinyin and put into a short sentence written with the characters taught so far.

import { same, slimmed, type Text, type TopicDef, t } from "@ga/content";
import { joinPinyin, point, toneless, zhQuote } from "@ga/subject-chinese";

import { toneName } from "../characters/teach.ts";
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

/** pinyinOf writes the syllables of a word as one word of pinyin (see joinPinyin). */
export const pinyinOf = joinPinyin;

/** KEPT are characters whose tone changes in speech; their syllables are not changed to make wrong readings. */
const KEPT = new Set(["一", "不"]);

/** WrongReading is a reading of a word with the syllable `at` changed to `as`. */
interface WrongReading {
  readonly text: string;
  readonly at: number;
  readonly as: string;
}

/** wrongReadings are readings of a word with one tone changed, the syllables taking turns, then the neutral syllables. */
function wrongReadings(w: LevelOneWord, chars: ReadonlyMap<string, LevelOneCharacter>): readonly WrongReading[] {
  const own = [...w.word];
  const single = own.length === 1 ? chars.get(own[0]!) : undefined;
  const others = new Set(single ? single.others.map((r) => r.normalize("NFC")) : []);
  const variants = (index: number, tones: readonly number[]): readonly WrongReading[] =>
    tones
      .filter((k) => k !== toneOf(w.syllables[index]!))
      .map((k) => withTone(w.syllables[index]!, k))
      .filter((s) => !others.has(s))
      .map((s) => ({ text: pinyinOf(w.syllables.map((x, j) => (j === index ? s : x))), at: index, as: s }));
  const indices = w.syllables.map((_, i) => i).filter((i) => !KEPT.has(own[i]!));
  const toned = indices.filter((i) => toneOf(w.syllables[i]!) !== 0).map((i) => variants(i, [1, 2, 3, 4]));
  const neutral = indices.filter((i) => toneOf(w.syllables[i]!) === 0).map((i) => variants(i, [1, 2, 3, 4]));
  const turns = (lists: readonly (readonly WrongReading[])[]): readonly WrongReading[] =>
    [0, 1, 2, 3].flatMap((r) => lists.map((l) => l[r]).filter((s): s is WrongReading => s !== undefined));
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

/** syllablesOf names each character of a word with its syllable and tone, in a locale. */
function syllablesOf(w: LevelOneWord, locale: "en" | "zh-CN"): string {
  return [...w.word]
    .map((ch, i) => {
      const s = w.syllables[i]!;
      return locale === "en" ? `${ch} ${s} (${toneName(s).en})` : `“${ch}”${s}（${toneName(s)["zh-CN"]}）`;
    })
    .join(locale === "en" ? ", " : "，");
}

/** joinedNote says how the syllables of a word are joined, naming an apostrophe where one is written. */
function joinedNote(w: LevelOneWord): Text {
  const marked = w.syllables.filter((s, i) => i > 0 && /^[aoe]/u.test(toneless(s)));
  if (w.syllables.length === 1) return t("It is one syllable, written alone.", "它只有一个音节，单独写。");
  return marked.length > 0
    ? t(
        `Written as one word, they are joined, with an apostrophe before ${marked.join(", ")}, which starts with a, o or e.`,
        `连成一个词来写，${marked.join("、")} 以 a、o、e 开头，前面加隔音符号“'”。`,
      )
    : t("Written as one word, they are joined with no space.", "连成一个词来写，音节之间不空格。");
}

/** backCheck checks a reading of a word the other way, from each syllable of the pinyin back to its character. */
function backCheck(w: LevelOneWord): Text {
  const chars = [...w.word];
  const right = pinyinOf(w.syllables);
  return t(
    `**Check.** Read ${right} back into characters: ${w.syllables.map((s, i) => `${s} is ${chars[i]}`).join(", ")}, which writes ${w.word}.`,
    `**检验。** 从拼音 ${right} 读回汉字：${w.syllables.map((s, i) => `${s} 是“${chars[i]}”`).join("，")}，正好是“${w.word}”。`,
  );
}

/** buildLevelOneWordTopic builds a level 1 word topic with its three knowledge points. */
function buildLevelOneWordTopic(spec: LevelOneWordSpec): TopicDef {
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
  const byWord = new Map(batch.map((w) => [w.word, w]));
  const whole = (w: LevelOneWord, put: string = w.word): string => w.sentence.replace(GAP, put);
  const inSentence = (w: LevelOneWord): Text =>
    t(
      `**Check.** Put it in a sentence: ${whole(w)} It reads well, so the meaning went to the right word.`,
      `**检验。** 把它放进句子里读一读：${whole(w)}句子通顺，说明意思和词对上了。`,
    );
  const otherWord = (w: LevelOneWord, v: LevelOneWord): Text =>
    t(
      `${v.word} (${pinyin(v)}) means "${v.meaning.en}", not "${w.meaning.en}".`,
      `“${v.word}”（${pinyin(v)}）的意思是${zhQuote(v.meaning["zh-CN"])}，不是${zhQuote(w.meaning["zh-CN"])}。`,
    );

  const form: readonly Asked[] = batch.map((w, i) => {
    const wrong = threeOf(
      `the word of ${w.word}`,
      w.word,
      mates(w, i).map((v) => v.word),
      `level ${level}`,
    );
    return {
      shown: w.meaning,
      right: same(w.word),
      wrong: three(wrong),
      solution: t(
        `The meaning "${w.meaning.en}" is the word **${w.word}**, read ${pinyin(w)}.\n\n${inSentence(w).en}`,
        `${zhQuote(w.meaning["zh-CN"])}这个意思，是词语 **${w.word}**，读 ${pinyin(w)}。\n\n${inSentence(w)["zh-CN"]}`,
      ),
      reasons: [otherWord(w, byWord.get(wrong[0])!), otherWord(w, byWord.get(wrong[1])!), otherWord(w, byWord.get(wrong[2])!)],
    };
  });

  const reading: readonly Asked[] = batch.map((w, i) => {
    const right = pinyin(w);
    const changed = new Map<string, WrongReading>();
    for (const r of wrongReadings(w, spec.chars)) if (!changed.has(r.text)) changed.set(r.text, r);
    const ofWord = new Map<string, LevelOneWord>();
    for (const v of spread(batch, i)) if (!changed.has(pinyin(v)) && !ofWord.has(pinyin(v))) ofWord.set(pinyin(v), v);
    const wrong = threeOf(`the reading of ${w.word}`, right, [...changed.keys(), ...ofWord.keys()], `level ${level}`);
    const notThe = (x: string): Text => {
      const r = changed.get(x);
      if (r) {
        const ch = [...w.word][r.at]!;
        const s = w.syllables[r.at]!;
        return t(
          `${x} changes one tone: ${ch} is read ${s}, with ${toneName(s).en}, not ${r.as}.`,
          `${x} 有一个声调错了：“${ch}”读 ${s}，${toneName(s)["zh-CN"]}，不读 ${r.as}。`,
        );
      }
      const v = ofWord.get(x)!;
      return t(
        `${x} is the pinyin of ${v.word}, another word of this set, which means "${v.meaning.en}".`,
        `${x} 是这一组另一个词“${v.word}”的拼音，“${v.word}”的意思是${zhQuote(v.meaning["zh-CN"])}。`,
      );
    };
    const kept = [...w.word].filter((ch) => KEPT.has(ch));
    const keptNote =
      kept.length > 0
        ? t(
            ` ${kept.join(" and ")} is written with its own tone, though it changes in speech.`,
            `“${kept.join("”“")}”按原调标写，说话时会变调。`,
          )
        : t("", "");
    return {
      shown: same(w.word),
      right: same(right),
      wrong: three(wrong),
      solution: t(
        `**${w.word}** means "${w.meaning.en}". Syllable by syllable: ${syllablesOf(w, "en")}.${keptNote.en}\n\n${joinedNote(w).en}\n\n${backCheck(w).en}`,
        `**${w.word}**的意思是${zhQuote(w.meaning["zh-CN"])}。一个字一个字地读：${syllablesOf(w, "zh-CN")}。${keptNote["zh-CN"]}\n\n${joinedNote(w)["zh-CN"]}\n\n${backCheck(w)["zh-CN"]}`,
      ),
      reasons: [notThe(wrong[0]), notThe(wrong[1]), notThe(wrong[2])],
    };
  });

  const use: readonly Asked[] = batch.map((w, i) => {
    const wrong = threeOf(
      `the gap of ${w.word}`,
      w.word,
      mates(w, i).map((v) => v.word),
      `level ${level}`,
    );
    const notThe = (x: string): Text => {
      const v = byWord.get(x)!;
      return t(
        `With ${v.word}, "${v.meaning.en}", the sentence would read ${whole(w, v.word)} That is wrong or makes no sense.`,
        `填“${v.word}”（${v.meaning["zh-CN"]}），句子成了${zhQuote(whole(w, v.word))}，意思不对或说不通。`,
      );
    };
    return {
      shown: same(w.sentence),
      right: same(w.word),
      wrong: three(wrong),
      solution: t(
        `The sentence is ${whole(w)} **${w.word}** (${pinyin(w)}) means "${w.meaning.en}".\n\n**Check.** Read the gap as that meaning: ${whole(w, `[${w.meaning.en}]`)} It still says the same.`,
        `完整的句子是：${whole(w)}“**${w.word}**”（${pinyin(w)}）的意思是：${w.meaning["zh-CN"]}。\n\n**检验。** 把横线换成词义来读：${whole(w, `（${zhQuote(w.meaning["zh-CN"]).slice(1, -1)}）`)}意思仍然通顺。`,
      ),
      reasons: [notThe(wrong[0]), notThe(wrong[1]), notThe(wrong[2])],
    };
  });

  const list = (locale: "en" | "zh-CN"): string =>
    batch.map((w) => `- **${w.word}** ${pinyin(w)}${locale === "en" ? ":" : "："} ${w.meaning[locale]}`).join("\n");
  const words = batch.map((w) => w.word).join("、");
  const first = batch[0]!;
  // The instances: a word and one of the set kept apart from it, a word of several syllables, a sentence and a word that does not fit it.
  const firstMate = mates(first, 0)[0]!;
  const joined =
    batch.find((w) => w.syllables.some((s, i) => i > 0 && /^[aoe]/u.test(toneless(s)))) ??
    batch.find((w) => w.syllables.length > 1) ??
    first;
  const joinedWrong = wrongReadings(joined, spec.chars)[0];
  const readWatch = joinedWrong
    ? t(
        `> **Watch out.** One wrong tone makes another reading: ${joinedWrong.text} is not ${pinyin(joined)}. Read the tone mark of every syllable.`,
        `> **注意。** 一个声调错了，就是另一个读音：${joinedWrong.text} 不是 ${pinyin(joined)}。每个音节的声调符号都要看清。`,
      )
    : t(
        `> **Watch out.** 一 and 不 change their tones in speech, but the pinyin of a word writes their own tones: ${pinyin(joined)}.`,
        `> **注意。** “一”“不”说话时会变调，词语的拼音却按原调标写：${pinyin(joined)}。`,
      );
  return {
    id,
    title: spec.title,
    summary: t(
      `Ten words about ${spec.theme.en.toLowerCase()}, ${words}: finding each by its meaning, reading it, and using it in a sentence.`,
      `“${spec.theme["zh-CN"]}”的十个词语：${words}。按意思找词，读准拼音，在句子里用对。`,
    ),
    intro: t(
      `These ${batch.length} words are about ${spec.theme.en.toLowerCase()}, each written with characters you know. Take **${first.word}**: it is read **${pinyin(first)}** and means "${first.meaning.en}", as in ${whole(first)} You will find each word by its meaning, read it in pinyin and put it into a sentence.\n\n${list("en")}`,
      `这${batch.length}个词语都和“${spec.theme["zh-CN"]}”有关，都是用学过的字写的。比如 **${first.word}**：读 **${pinyin(first)}**，意思是${zhQuote(first.meaning["zh-CN"])}，可以说：${whole(first)}下面要按意思找词，读准拼音，再把词用进句子里。\n\n${list("zh-CN")}`,
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
          `Each word is written with characters you know. Think of what each character means, then of the word they make together. Take "${first.meaning.en}": it is the word **${first.word}**, read ${pinyin(first)}.\n\n${list("en")}\n\n> **Watch out.** The words of one set share a theme, so they are easy to swap: ${first.word} means "${first.meaning.en}", but ${firstMate.word} means "${firstMate.meaning.en}". Match the whole meaning, not only the theme.`,
          `这些词都是用学过的字写的。想一想每个字的意思，再想它们合起来是什么词。比如${zhQuote(first.meaning["zh-CN"])}，就是词语 **${first.word}**，读 ${pinyin(first)}。\n\n${list("zh-CN")}\n\n> **注意。** 同一组的词说的是同一类事，容易混：“${first.word}”的意思是${zhQuote(first.meaning["zh-CN"])}，“${firstMate.word}”的意思却是${zhQuote(firstMate.meaning["zh-CN"])}。要对上整个意思，不能只看是哪一类。`,
        ),
        askedGenerator(t("Which word has this meaning?", "哪个词语是这个意思？"), form),
      ),
      point(
        `${id}-reading`,
        t("Reading the Word", "读准词语"),
        t(
          `A word of pinyin is written as one: its syllables are joined, and an apostrophe comes before a syllable that starts with a, o or e. A syllable with no tone mark is read in the neutral tone, light and short. 一 and 不 are written with their own tones, though they change in speech. Take **${joined.word}**: ${syllablesOf(joined, "en")}; joined, it is **${pinyin(joined)}**.\n\n${list("en")}\n\n${readWatch.en}`,
          `一个词的拼音连在一起写；以 a、o、e 开头的音节前面加隔音符号“'”。没有调号的音节读轻声，又轻又短。“一”和“不”按原调标写，说话时会变调。比如 **${joined.word}**：${syllablesOf(joined, "zh-CN")}，连起来写作 **${pinyin(joined)}**。\n\n${list("zh-CN")}\n\n${readWatch["zh-CN"]}`,
        ),
        askedGenerator(t("Which is the pinyin of this word?", "这个词语的拼音是什么？"), reading),
      ),
      point(
        `${id}-use`,
        t("Using the Word", "选词填空"),
        t(
          `Read the whole sentence first, then try each word in the gap: only one makes the sentence say something true and complete. Take ${first.sentence} With **${first.word}** it reads ${whole(first)}\n\n${list("en")}\n\n> **Watch out.** A word of the same theme can look right at a glance: with ${firstMate.word} the sentence would read ${whole(first, firstMate.word)} Read the words just before and after the gap with the word in place.`,
          `先读完整个句子，再把每个词放进横线处试一试：只有一个词能让句子通顺、意思完整。比如${zhQuote(first.sentence)}，填 **${first.word}**，就是：${whole(first)}\n\n${list("zh-CN")}\n\n> **注意。** 同一类的词乍一看也像能填：填“${firstMate.word}”，句子成了${zhQuote(whole(first, firstMate.word))}，意思不对或说不通。要把词放进去，连着横线前后的词一起读。`,
        ),
        askedGenerator(t("Which word fills the gap?", "横线处填哪个词语？"), use),
      ),
    ],
  };
}

/** levelOneWordTopic builds a level 1 word topic, keeping its problem banks only while they are used (see slimmed). */
export const levelOneWordTopic = slimmed(buildLevelOneWordTopic);

/** firstTwice is the first item that appears a second time in a list, or undefined when each appears once. */
export function firstTwice(items: readonly string[]): string | undefined {
  const seen = new Set<string>();
  for (const x of items) {
    if (seen.has(x)) return x;
    seen.add(x);
  }
  return undefined;
}
