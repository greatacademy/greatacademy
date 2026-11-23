// The character topics of level 1 (docs/chinese-curriculum.md §8.3): a batch of ten characters, each found by its
// meaning, read in pinyin and given its meaning, the meaning in the learner's language.

import { same, slimmed, type Text, type TopicDef, t } from "@ga/content";
import { point, toneless } from "@ga/subject-chinese";

import { knownCharacters } from "../characters/index.ts";
import { toneName } from "../characters/teach.ts";

import { type Asked, askedGenerator, dataLines, fields, nearOf, spread, three, threeOf, toneOf, withTone } from "./kit.ts";

/** LevelOneCharacter is a level 1 character: its readings, its meaning, the characters it looks like and those kept apart. */
export interface LevelOneCharacter {
  readonly char: string;
  readonly reading: string;
  /** others are its other readings, never offered as wrong answers. */
  readonly others: readonly string[];
  /** shownOthers are the other readings an explanation lists, without the changes of tone in speech. */
  readonly shownOthers: readonly string[];
  readonly meaning: Text;
  readonly looks: readonly string[];
  readonly near: readonly string[];
}

const HAN = /^\p{Script=Han}$/u;

/** parseLevelOneCharacters reads a batch of level 1 characters (see character-data.ts). */
export function parseLevelOneCharacters(data: string): readonly LevelOneCharacter[] {
  return parseLevelCharacters(data, 1);
}

/** parseLevelCharacters reads a batch of characters of a level, written as in level 1, naming the level in its errors. */
export function parseLevelCharacters(data: string, level: number): readonly LevelOneCharacter[] {
  return dataLines(data).map((line) => {
    const [head = "", en = "", zh = "", looks = "", near = ""] = fields(line, 4, 5, `level ${level}`);
    const [char = "", readings = ""] = head.split(" ");
    const [reading = "", ...rest] = readings.split("/");
    if (!HAN.test(char) || reading === "") throw new Error(`level ${level} characters: ${line}`);
    if (zh.includes(char)) throw new Error(`level ${level} characters: the meaning of ${char} uses it`);
    const lookalikes = [...looks];
    if (lookalikes.length < 2 || lookalikes.includes(char) || !lookalikes.every((c) => HAN.test(c))) {
      throw new Error(`level ${level} characters: the characters ${char} looks like`);
    }
    return {
      char,
      reading,
      others: rest.map((r) => r.replace(/^~/u, "")),
      shownOthers: rest.filter((r) => !r.startsWith("~")),
      meaning: t(en, zh),
      looks: lookalikes,
      near: [...near],
    };
  });
}

/** clash tells whether two texts agree in some locale. */
const clash = (a: Text, b: Text): boolean => a.en === b.en || a["zh-CN"] === b["zh-CN"];

/** readingsOf lists a character's readings for an explanation. */
const readingsOf = (c: LevelOneCharacter): string => [c.reading, ...c.shownOthers].join(", ");

/** LevelOneCharacterSpec describes a level 1 character topic. */
export interface LevelOneCharacterSpec {
  readonly id: string;
  readonly title: Text;
  readonly prerequisites: readonly string[];
  readonly batch: readonly LevelOneCharacter[];
  /** all are all the level 1 characters, whose meanings may be offered against a character that looks like them. */
  readonly all: ReadonlyMap<string, LevelOneCharacter>;
  /** level names the level in errors; it is 1 when left out. */
  readonly level?: number;
}

/** SOUNDS say how each tone sounds, from the light tone, 0, to the fourth. */
const SOUNDS: readonly Text[] = [
  t("short and light", "又短又轻"),
  t("high and level", "又高又平"),
  t("rising from middle to high", "从中间升到高处"),
  t("low, dipping before it rises", "先降后升，低而曲折"),
  t("falling from high to low", "从高处降到低处"),
];

/** toneOfReading names the tone of a reading and how it sounds. */
const toneOfReading = (reading: string): { readonly name: Text; readonly sound: Text } => ({
  name: toneName(reading),
  sound: SOUNDS[toneOf(reading)]!,
});

/** Other is what a reason knows of another character: a taught one with its meaning, a native one with its words, or nothing. */
type Other =
  | { readonly kind: "taught"; readonly c: LevelOneCharacter }
  | { readonly kind: "native"; readonly reading: string; readonly words: readonly string[] }
  | { readonly kind: "unknown" };

/** otherOf finds what is known of a character: taught in this batch or before, else taught in school, else nothing. */
function otherOf(char: string, all: ReadonlyMap<string, LevelOneCharacter>, batch: ReadonlyMap<string, LevelOneCharacter>): Other {
  const c = batch.get(char) ?? all.get(char);
  if (c) return { kind: "taught", c };
  const n = knownCharacters.get(char);
  if (n) return { kind: "native", reading: n.reading, words: n.words.map((w) => w.text) };
  return { kind: "unknown" };
}

/** lookalikeOf is the first character a character looks like that has a meaning to tell, if any. */
export function lookalikeOf(
  c: LevelOneCharacter,
  all: ReadonlyMap<string, LevelOneCharacter>,
  batch: ReadonlyMap<string, LevelOneCharacter>,
): LevelOneCharacter | undefined {
  for (const l of c.looks) {
    const o = otherOf(l, all, batch);
    if (o.kind === "taught") return o.c;
  }
  return undefined;
}

/**
 * notTheCharacter says why a character is not c, the one with c's reading and meaning: a look-alike or another of the
 * batch by its own reading and meaning, a character of school by its reading and words, or a rarer look-alike.
 */
export function notTheCharacter(
  c: LevelOneCharacter,
  char: string,
  all: ReadonlyMap<string, LevelOneCharacter>,
  batch: ReadonlyMap<string, LevelOneCharacter>,
): Text {
  const o = otherOf(char, all, batch);
  const looks = c.looks.includes(char);
  if (o.kind === "taught") {
    const d = o.c;
    return looks || !batch.has(d.char)
      ? t(
          `${d.char} only looks like ${c.char}: it is read ${d.reading} and means "${d.meaning.en}", not "${c.meaning.en}".`,
          `“${d.char}”只是和“${c.char}”长得像，它读 ${d.reading}，意思是“${d.meaning["zh-CN"]}”，不是“${c.meaning["zh-CN"]}”。`,
        )
      : t(
          `${d.char}, another character of this set, is read ${d.reading} and means "${d.meaning.en}", not "${c.meaning.en}".`,
          `“${d.char}”是这一组的另一个字，读 ${d.reading}，意思是“${d.meaning["zh-CN"]}”，不是“${c.meaning["zh-CN"]}”。`,
        );
  }
  if (o.kind === "native") {
    const apartWords = o.words.filter((w) => !w.includes(c.char));
    const two = [...new Set(apartWords.length > 0 ? apartWords : o.words)].slice(0, 2);
    return t(
      `${char} only looks like ${c.char}: it is read ${o.reading}, the character of ${two.join(" and ")}, and "${c.meaning.en}" is written ${c.char}.`,
      `“${char}”只是和“${c.char}”长得像，它读 ${o.reading}，是${two.map((w) => `“${w}”`).join("")}的“${char}”；“${c.meaning["zh-CN"]}”要写“${c.char}”。`,
    );
  }
  return t(
    `${char} only looks like ${c.char}: it is another, rarer character, and "${c.meaning.en}" is written ${c.char}.`,
    `“${char}”只是和“${c.char}”长得像，是另一个不常用的字；“${c.meaning["zh-CN"]}”要写“${c.char}”。`,
  );
}

/** checkApart checks a character against one it looks like, or against its reading and meaning when none has a meaning to tell. */
export function checkApart(
  c: LevelOneCharacter,
  all: ReadonlyMap<string, LevelOneCharacter>,
  batch: ReadonlyMap<string, LevelOneCharacter>,
): Text {
  const l = lookalikeOf(c, all, batch);
  if (l)
    return t(
      `**Check.** ${c.char} is not ${l.char}, which looks like it: ${l.char} is read ${l.reading} and means "${l.meaning.en}".`,
      `**检验。** “${c.char}”不是和它长得像的“${l.char}”：“${l.char}”读 ${l.reading}，意思是“${l.meaning["zh-CN"]}”。`,
    );
  return t(
    `**Check.** Go the other way: the character read ${c.reading} that means "${c.meaning.en}" is ${c.char}, and its shape is the one asked.`,
    `**检验。** 反过来想：读 ${c.reading}、意思是“${c.meaning["zh-CN"]}”的字是“${c.char}”，字形和题目对得上。`,
  );
}

/** buildLevelOneCharacterTopic builds a level 1 character topic with its three knowledge points. */
function buildLevelOneCharacterTopic(spec: LevelOneCharacterSpec): TopicDef {
  const { batch, all, id } = spec;
  const level = spec.level ?? 1;
  const near = nearOf(
    batch.map((c) => ({ key: c.char, near: c.near })),
    `level ${level}`,
  );
  for (const [i, c] of batch.entries()) {
    for (const d of batch.slice(i + 1))
      if (clash(c.meaning, d.meaning)) throw new Error(`level ${level} characters: ${c.char} and ${d.char} mean the same`);
  }
  const apart = (c: LevelOneCharacter, d: LevelOneCharacter): boolean => d.char !== c.char && !near.get(c.char)!.has(d.char);
  const inBatch = new Map(batch.map((c) => [c.char, c]));

  const looks = (c: LevelOneCharacter, char: string): Text => notTheCharacter(c, char, all, inBatch);
  const apartCheck = (c: LevelOneCharacter): Text => checkApart(c, all, inBatch);
  const lookalike = (c: LevelOneCharacter): LevelOneCharacter | undefined => lookalikeOf(c, all, inBatch);

  const form: readonly Asked[] = batch.map((c, i) => {
    const mates = spread(batch, i).filter((d) => apart(c, d));
    const wrong = three(
      threeOf(
        `the character of ${c.char}`,
        c.char,
        [...c.looks.filter((l) => !near.get(c.char)!.has(l)), ...mates.map((d) => d.char)],
        `level ${level}`,
      ),
    );
    return {
      shown: c.meaning,
      right: same(c.char),
      wrong,
      solution: t(
        `The meaning "${c.meaning.en}" is written **${c.char}**, read ${c.reading}.\n\n${apartCheck(c).en}`,
        `“${c.meaning["zh-CN"]}”这个意思写作 **${c.char}**，读 ${c.reading}。\n\n${apartCheck(c)["zh-CN"]}`,
      ),
      reasons: [looks(c, wrong[0].en), looks(c, wrong[1].en), looks(c, wrong[2].en)],
    };
  });

  const reading: readonly Asked[] = batch.map((c, i) => {
    const own = new Set([c.reading, ...c.others].map((r) => r.normalize("NFC")));
    const tones = [1, 2, 3, 4, 0].map((k) => withTone(c.reading, k)).filter((r) => !own.has(r));
    const mateOf = new Map<string, LevelOneCharacter>();
    for (const d of spread(batch, i)) if (!own.has(d.reading.normalize("NFC")) && !mateOf.has(d.reading)) mateOf.set(d.reading, d);
    const wrong = three(threeOf(`the reading of ${c.char}`, c.reading, [...tones, ...mateOf.keys()], `level ${level}`));
    const tone = toneOfReading(c.reading);
    const notThe = (w: string): Text => {
      if (toneless(w) === toneless(c.reading)) {
        return t(
          `${w} is the same syllable with ${toneName(w).en}, but ${c.char} is read with ${tone.name.en}.`,
          `${w} 音节相同，可它是${toneName(w)["zh-CN"]}；“${c.char}”读${tone.name["zh-CN"]}。`,
        );
      }
      const d = mateOf.get(w);
      if (d) {
        return t(
          `${w} is the reading of ${d.char}, which means "${d.meaning.en}"; ${c.char} is read ${c.reading}.`,
          `${w} 是“${d.char}”的读音，“${d.char}”的意思是“${d.meaning["zh-CN"]}”；“${c.char}”读 ${c.reading}。`,
        );
      }
      return t(`${w} is another syllable; ${c.char} is read ${c.reading}.`, `${w} 是另一个音节；“${c.char}”读 ${c.reading}。`);
    };
    const also =
      c.shownOthers.length > 0
        ? t(
            ` In some words it is read ${c.shownOthers.join(", ")}, but that reading is never among the options.`,
            `在有些词里它读 ${c.shownOthers.join("、")}，但这个读音不会出现在选项里。`,
          )
        : t("", "");
    const mark =
      toneOf(c.reading) === 0
        ? t(
            `**Check.** ${c.reading} has no tone mark, so it is said in the light tone, ${tone.sound.en}.`,
            `**检验。** ${c.reading} 没有声调符号，读轻声，${tone.sound["zh-CN"]}。`,
          )
        : t(
            `**Check.** The mark on ${c.reading} is that of ${tone.name.en}, said ${tone.sound.en}; without its mark the syllable is ${toneless(c.reading)}.`,
            `**检验。** ${c.reading} 上的声调符号是${tone.name["zh-CN"]}，读起来${tone.sound["zh-CN"]}；去掉声调就是音节 ${toneless(c.reading)}。`,
          );
    return {
      shown: same(c.char),
      right: same(c.reading),
      wrong,
      solution: t(
        `**${c.char}** means "${c.meaning.en}" and is one syllable: **${c.reading}**, with ${tone.name.en}.${also.en}\n\n${mark.en}`,
        `**${c.char}**的意思是“${c.meaning["zh-CN"]}”，读一个音节：**${c.reading}**，${tone.name["zh-CN"]}。${also["zh-CN"]}\n\n${mark["zh-CN"]}`,
      ),
      reasons: [notThe(wrong[0].en), notThe(wrong[1].en), notThe(wrong[2].en)],
    };
  });

  const meaning: readonly Asked[] = batch.map((c, i) => {
    const candidates = [
      ...c.looks.map((l) => all.get(l)).filter((d): d is LevelOneCharacter => d !== undefined && !batch.includes(d)),
      ...spread(batch, i),
    ].filter((d) => apart(c, d));
    const picked: LevelOneCharacter[] = [];
    for (const d of candidates) {
      if (picked.length === 3) break;
      if (!clash(d.meaning, c.meaning) && picked.every((p) => !clash(p.meaning, d.meaning))) picked.push(d);
    }
    if (picked.length < 3) throw new Error(`level ${level}: too few wrong meanings for ${c.char}`);
    const notThe = (d: LevelOneCharacter): Text =>
      inBatch.has(d.char) && !c.looks.includes(d.char)
        ? t(
            `"${d.meaning.en}" is the meaning of ${d.char} (${d.reading}), another character of this set.`,
            `“${d.meaning["zh-CN"]}”是这一组另一个字“${d.char}”（${d.reading}）的意思。`,
          )
        : t(
            `"${d.meaning.en}" is the meaning of ${d.char} (${d.reading}), which only looks like ${c.char}.`,
            `“${d.meaning["zh-CN"]}”是“${d.char}”（${d.reading}）的意思，“${d.char}”只是和“${c.char}”长得像。`,
          );
    return {
      shown: same(c.char),
      right: c.meaning,
      wrong: [picked[0]!.meaning, picked[1]!.meaning, picked[2]!.meaning],
      solution: t(
        `**${c.char}** is read ${c.reading}.\n\nIt means "${c.meaning.en}".\n\n${apartCheck(c).en}`,
        `**${c.char}**读 ${c.reading}。\n\n它的意思是“${c.meaning["zh-CN"]}”。\n\n${apartCheck(c)["zh-CN"]}`,
      ),
      reasons: [notThe(picked[0]!), notThe(picked[1]!), notThe(picked[2]!)],
    };
  });

  const list = (locale: "en" | "zh-CN"): string =>
    batch.map((c) => `- **${c.char}** ${readingsOf(c)}${locale === "en" ? ":" : "："} ${c.meaning[locale]}`).join("\n");
  const chars = batch.map((c) => c.char).join("");
  const first = batch[0]!;
  // The instances: a character with a look-alike that has a meaning to tell, a character with its tone.
  const seen = batch.find((c) => lookalike(c)) ?? first;
  const seenLike = lookalike(seen);
  const heard = batch.find((c) => toneOf(c.reading) !== 0) ?? first;
  const heardTone = toneOfReading(heard.reading);
  const heardOwn = new Set([heard.reading, ...heard.others].map((r) => r.normalize("NFC")));
  const heardWrong = [1, 2, 3, 4].map((k) => withTone(heard.reading, k)).find((r) => !heardOwn.has(r.normalize("NFC")))!;
  const mate = spread(batch, batch.indexOf(seen)).find((d) => apart(seen, d)) ?? batch[1]!;
  const likeWatch = (locale: "en" | "zh-CN"): string =>
    seenLike
      ? locale === "en"
        ? `> **Watch out.** ${seen.char} and ${seenLike.char} look alike but mean different things: ${seenLike.char} means "${seenLike.meaning.en}". Check each part of the shape before you choose.`
        : `> **注意。** “${seen.char}”和“${seenLike.char}”长得像，意思却不同：“${seenLike.char}”的意思是“${seenLike.meaning["zh-CN"]}”。选之前要把字形的每一部分看清楚。`
      : locale === "en"
        ? `> **Watch out.** Characters of one set are easy to swap: ${seen.char} means "${seen.meaning.en}", and ${mate.char} means "${mate.meaning.en}". Tie each shape to its own meaning.`
        : `> **注意。** 同一组的字容易记混：“${seen.char}”的意思是“${seen.meaning["zh-CN"]}”，“${mate.char}”的意思是“${mate.meaning["zh-CN"]}”。每个字形要对上它自己的意思。`;
  return {
    id,
    title: spec.title,
    summary: t(
      `The characters ${chars}: finding each by its meaning, reading it in pinyin, and saying what it means.`,
      `认识“${chars}”这十个字：按意思找字，读准拼音，说出字义。`,
    ),
    intro: t(
      `These ${batch.length} characters each write one syllable and one meaning. Take **${first.char}**: it is read **${first.reading}** and means "${first.meaning.en}". You will go from the meaning to the character, from the character to its pinyin, and from the character to its meaning.\n\n${list("en")}`,
      `这${batch.length}个字，每个字读一个音节、表示一个意思。比如 **${first.char}**：读 **${first.reading}**，意思是“${first.meaning["zh-CN"]}”。下面要从意思找字，从字读出拼音，再从字说出意思。\n\n${list("zh-CN")}`,
    ),
    prerequisites: [...spec.prerequisites],
    encompasses: [],
    xp: batch.length,
    strand: "characters",
    knowledgePoints: [
      point(
        `${id}-form`,
        t("Finding the Character", "按意思找字"),
        t(
          `Each character writes a meaning, and it is found by its whole shape. Take "${seen.meaning.en}": it is written **${seen.char}**, read ${seen.reading}.\n\n${list("en")}\n\n${likeWatch("en")}`,
          `每个字表示一个意思，要靠整个字形找到它。比如“${seen.meaning["zh-CN"]}”，写作 **${seen.char}**，读 ${seen.reading}。\n\n${list("zh-CN")}\n\n${likeWatch("zh-CN")}`,
        ),
        askedGenerator(t("Which character has this meaning?", "哪个汉字是这个意思？"), form),
      ),
      point(
        `${id}-reading`,
        t("Reading It", "读准拼音"),
        t(
          `Each character is one syllable, and its tone is part of the syllable. Take **${heard.char}**: it is read **${heard.reading}**, with ${heardTone.name.en}, said ${heardTone.sound.en}. Where a character has another reading, it follows the first in the list.\n\n${list("en")}\n\n> **Watch out.** A wrong tone makes another syllable: ${heardWrong} is not ${heard.reading}. Read the tone mark as well as the letters.`,
          `每个字读一个音节，声调是音节的一部分。比如 **${heard.char}**：读 **${heard.reading}**，${heardTone.name["zh-CN"]}，读起来${heardTone.sound["zh-CN"]}。有两个读音的字，另一个读音写在后面。\n\n${list("zh-CN")}\n\n> **注意。** 声调错了就是另一个音节：${heardWrong} 不是 ${heard.reading}。看拼音时，字母和声调符号都要看。`,
        ),
        askedGenerator(t("Which is the pinyin of this character?", "这个汉字的拼音是什么？"), reading),
      ),
      point(
        `${id}-meaning`,
        t("Knowing the Meaning", "说出字义"),
        t(
          `Say what a character means before you look at the choices. Take **${seen.char}** (${seen.reading}): it means "${seen.meaning.en}".\n\n${list("en")}\n\n${likeWatch("en")}`,
          `先想一想字的意思，再看选项。比如 **${seen.char}**（${seen.reading}）：意思是“${seen.meaning["zh-CN"]}”。\n\n${list("zh-CN")}\n\n${likeWatch("zh-CN")}`,
        ),
        askedGenerator(t("What does this character mean?", "这个汉字是什么意思？"), meaning),
      ),
    ],
  };
}

/** levelOneCharacterTopic builds a level 1 character topic, keeping its problem banks only while they are used (see slimmed). */
export const levelOneCharacterTopic = slimmed(buildLevelOneCharacterTopic);
