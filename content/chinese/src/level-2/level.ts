// The builder of a level after the first (docs/chinese-curriculum.md §8.3): it lays a level's character and word
// batches out in themed units as level 1 does, with the topic builders of level 1, and checks that each word and sentence
// uses only characters taught in that level or an earlier one.

import type { CourseDef, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";

import { type LevelOneCharacter, levelOneCharacterTopic, parseLevelCharacters } from "../level-1/characters.ts";
import { GAP, type LevelOneWord, levelOneWordTopic, parseLevelWords } from "../level-1/words.ts";

/** LevelUnit is a unit of a level: a theme, how many character batches and how many word batches it has. */
export interface LevelUnit {
  readonly title: Text;
  readonly characters: number;
  readonly words: number;
}

/** LevelWordBatch is a batch of a level's words: its theme and its lines, written as in level 1. */
export interface LevelWordBatch {
  readonly theme: readonly [en: string, zh: string];
  readonly data: string;
}

/** LevelSpec describes a level after the first. */
export interface LevelSpec {
  /** level is the number of the level, from 2. */
  readonly level: number;
  /** numeral names the level in Chinese, as in 二级. */
  readonly numeral: string;
  readonly units: readonly LevelUnit[];
  readonly characterBatches: readonly string[];
  readonly wordBatches: readonly LevelWordBatch[];
  /** earlierCharacters are the characters of the earlier levels, by character. */
  readonly earlierCharacters: ReadonlyMap<string, LevelOneCharacter>;
  /** earlierWords are the words of the earlier levels. */
  readonly earlierWords: readonly string[];
  /** after is the last word topic of the level before, which itself needs the rest of that level. */
  readonly after: string;
}

/** Level is a built level: its characters and words, its topics, and the units of its course. */
export interface Level {
  /** characters are the characters of this level and the earlier ones, by character. */
  readonly characters: ReadonlyMap<string, LevelOneCharacter>;
  /** words are the words of this level and the earlier ones. */
  readonly words: readonly string[];
  readonly topics: readonly TopicDef[];
  readonly units: CourseDef["units"];
  /** last are the last character topic and the last word topic of this level. */
  readonly last: { readonly characters: string; readonly words: string };
}

/** PUNCTUATION may appear in a sentence besides taught characters. */
const PUNCTUATION = new Set([..."，。？！：“”、"]);

const two = (n: number): string => String(n).padStart(2, "0");

/** levelCharacterId is the id of the nth character topic of a level, counting from 1. */
export const levelCharacterId = (level: number, n: number): string => `level-${level}-characters-${two(n)}`;

/** levelWordId is the id of the nth word topic of a level, counting from 1. */
export const levelWordId = (level: number, n: number): string => `level-${level}-words-${two(n)}`;

/** buildLevel makes the topics and units of a level, checking that each word and sentence uses only characters taught by then. */
export function buildLevel(spec: LevelSpec): Level {
  const { level, numeral } = spec;
  const where = `level ${level}`;
  const charBatches = spec.characterBatches.map((b) => parseLevelCharacters(b, level));
  const words: readonly (readonly LevelOneWord[])[] = spec.wordBatches.map((b) => parseLevelWords(b.data, level));

  const characters = new Map(spec.earlierCharacters);
  for (const c of charBatches.flat()) {
    if (characters.has(c.char)) throw new Error(`${where}: ${c.char} is taught twice`);
    characters.set(c.char, c);
  }
  const all = [...spec.earlierWords, ...words.flat().map((w) => w.word)];
  const twice = all.find((w, i) => all.indexOf(w) !== i);
  if (twice) throw new Error(`${where}: ${twice} is taught twice`);

  const characterCount = spec.units.reduce((n, u) => n + u.characters, 0);
  const wordCount = spec.units.reduce((n, u) => n + u.words, 0);
  if (characterCount !== charBatches.length || wordCount !== words.length) throw new Error(`${where}: the units do not cover the batches`);

  const topics: TopicDef[] = [];
  const units: CourseDef["units"][number][] = [];
  const taught = new Set(spec.earlierCharacters.keys());
  let c = 0;
  let w = 0;
  for (const unit of spec.units) {
    const characterIds: string[] = [];
    for (let k = 0; k < unit.characters; k++) {
      const batch = charBatches[c]!;
      c++;
      const id = levelCharacterId(level, c);
      for (const ch of batch) taught.add(ch.char);
      const chars = batch.map((x) => x.char).join("");
      topics.push(
        levelOneCharacterTopic({
          id,
          title: t(`Level ${level} Characters ${two(c)}: ${chars}`, `${numeral}级汉字 ${two(c)}：${chars}`),
          prerequisites: [c === 1 ? spec.after : levelCharacterId(level, c - 1)],
          batch,
          all: characters,
          level,
        }),
      );
      characterIds.push(id);
    }
    const wordIds: string[] = [];
    for (let k = 0; k < unit.words; k++) {
      const batch = words[w]!;
      const { theme } = spec.wordBatches[w]!;
      w++;
      const id = levelWordId(level, w);
      for (const word of batch) {
        const untaught = [...word.word, ...word.sentence.replace(GAP, "")].filter((ch) => !taught.has(ch) && !PUNCTUATION.has(ch));
        if (untaught.length > 0) throw new Error(`${where}: ${word.word} or its sentence uses ${untaught.join("")}, not taught by ${id}`);
      }
      topics.push(
        levelOneWordTopic({
          id,
          title: t(`Level ${level} Words ${two(w)}: ${theme[0]}`, `${numeral}级词语 ${two(w)}：${theme[1]}`),
          theme: t(theme[0], theme[1]),
          // The first word topic needs only its characters, which lead back to the level before.
          prerequisites:
            w === 1
              ? [levelCharacterId(level, c)]
              : k === 0
                ? [levelCharacterId(level, c), levelWordId(level, w - 1)]
                : [levelWordId(level, w - 1)],
          batch,
          chars: characters,
          level,
        }),
      );
      wordIds.push(id);
    }
    units.push({
      title: unit.title,
      modules: [
        { title: t("Characters", "汉字"), topics: characterIds },
        { title: t("Words", "词语"), topics: wordIds },
      ],
    });
  }
  return {
    characters,
    words: all,
    topics,
    units,
    last: { characters: levelCharacterId(level, c), words: levelWordId(level, w) },
  };
}
