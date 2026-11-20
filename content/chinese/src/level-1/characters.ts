// The character topics of level 1 (docs/chinese-curriculum.md §8.3): a batch of ten characters, each found by its
// meaning, read in pinyin and given its meaning, the meaning in the learner's language.

import { same, slimmed, type Text, type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-chinese";

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

  const form: readonly Asked[] = batch.map((c, i) => {
    const mates = spread(batch, i).filter((d) => apart(c, d));
    const wrong = threeOf(
      `the character of ${c.char}`,
      c.char,
      [...c.looks.filter((l) => !near.get(c.char)!.has(l)), ...mates.map((d) => d.char)],
      `level ${level}`,
    );
    return { shown: c.meaning, right: same(c.char), wrong: three(wrong), solution: why(c) };
  });

  const reading: readonly Asked[] = batch.map((c, i) => {
    const own = new Set([c.reading, ...c.others].map((r) => r.normalize("NFC")));
    const tones = [1, 2, 3, 4, 0].map((k) => withTone(c.reading, k)).filter((r) => !own.has(r));
    const mates = spread(batch, i)
      .map((d) => d.reading)
      .filter((r) => !own.has(r.normalize("NFC")));
    const wrong = threeOf(`the reading of ${c.char}`, c.reading, [...tones, ...mates], `level ${level}`);
    return {
      shown: same(c.char),
      right: same(c.reading),
      wrong: three(wrong),
      solution: t(
        `**${c.char}** is read **${c.reading}**, in the ${toneName(c.reading).en}.`,
        `**${c.char}**读 **${c.reading}**，${toneName(c.reading)["zh-CN"]}。`,
      ),
    };
  });

  const meaning: readonly Asked[] = batch.map((c, i) => {
    const candidates = [
      ...c.looks.map((l) => all.get(l)).filter((d): d is LevelOneCharacter => d !== undefined && !batch.includes(d)),
      ...spread(batch, i),
    ].filter((d) => apart(c, d));
    const picked: Text[] = [];
    for (const d of candidates) {
      if (picked.length === 3) break;
      if (!clash(d.meaning, c.meaning) && picked.every((p) => !clash(p, d.meaning))) picked.push(d.meaning);
    }
    if (picked.length < 3) throw new Error(`level ${level}: too few wrong meanings for ${c.char}`);
    return { shown: same(c.char), right: c.meaning, wrong: [picked[0]!, picked[1]!, picked[2]!], solution: why(c) };
  });

  const list = (locale: "en" | "zh-CN"): string =>
    batch.map((c) => `- **${c.char}** ${readingsOf(c)}${locale === "en" ? ":" : "："} ${c.meaning[locale]}`).join("\n");
  const chars = batch.map((c) => c.char).join("");
  return {
    id,
    title: spec.title,
    summary: t(
      `The characters ${chars}: finding each by its meaning, reading it in pinyin, and saying what it means.`,
      `认识“${chars}”这十个字：按意思找字，读准拼音，说出字义。`,
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
          `Each character writes a meaning. Look at the whole shape: characters that look alike, like 人 and 入, mean different things.\n\n${list("en")}`,
          `每个字都表示一个意思。要看清整个字形：长得像的字，比如“人”和“入”，意思不一样。\n\n${list("zh-CN")}`,
        ),
        askedGenerator(t("Which character has this meaning?", "哪个汉字是这个意思？"), form),
      ),
      point(
        `${id}-reading`,
        t("Reading It", "读准拼音"),
        t(
          `Each character is one syllable. Read it with its tone: a wrong tone makes another syllable. Where a character has another reading, it follows the first.\n\n${list("en")}`,
          `每个字读一个音节。读的时候要读准声调，声调错了就是另一个音节。有两个读音的字，另一个读音写在后面。\n\n${list("zh-CN")}`,
        ),
        askedGenerator(t("Which is the pinyin of this character?", "这个汉字的拼音是什么？"), reading),
      ),
      point(
        `${id}-meaning`,
        t("Knowing the Meaning", "说出字义"),
        t(
          `Say what each character means before you look at the choices.\n\n${list("en")}`,
          `先想一想每个字的意思，再看选项。\n\n${list("zh-CN")}`,
        ),
        askedGenerator(t("What does this character mean?", "这个汉字是什么意思？"), meaning),
      ),
    ],
  };
}

/** levelOneCharacterTopic builds a level 1 character topic, keeping its problem banks only while they are used (see slimmed). */
export const levelOneCharacterTopic = slimmed(buildLevelOneCharacterTopic);

/** why explains a character: its reading and its meaning. */
function why(c: LevelOneCharacter): Text {
  return t(`**${c.char}** (${c.reading}) means "${c.meaning.en}".`, `**${c.char}**（${c.reading}）的意思是：${c.meaning["zh-CN"]}。`);
}

/** TONES name the tones, the neutral tone first. */
const TONES: readonly Text[] = [
  t("neutral tone", "读轻声"),
  t("first tone", "第一声"),
  t("second tone", "第二声"),
  t("third tone", "第三声"),
  t("fourth tone", "第四声"),
];

/** toneName names the tone of a syllable. */
const toneName = (syllable: string): Text => TONES[toneOf(syllable)]!;
