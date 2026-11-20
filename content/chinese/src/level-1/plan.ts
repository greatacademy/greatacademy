// The plan of level 1 of Chinese as a foreign language: its units and batches, read and checked without building its
// topics, which index.ts builds. Level 2, the HSK courses and the writing of the levels need only this.

import { type Text, t } from "@ga/content";

import { characterBatches } from "./character-data.ts";
import { type LevelOneCharacter, parseLevelOneCharacters } from "./characters.ts";
import { registerUnitSpeech, type UnitSpeechSpec } from "./listening.ts";
import { wordBatches } from "./word-data.ts";
import { firstTwice, type LevelOneWord, parseLevelOneWords } from "./words.ts";

/** LEVEL_ONE_UNITS are the units of level 1: a theme, how many character batches and how many word batches it has. */
export const LEVEL_ONE_UNITS: readonly { readonly title: Text; readonly characters: number; readonly words: number }[] = [
  { title: t("Greetings and Introductions", "问候和介绍"), characters: 4, words: 3 },
  { title: t("Numbers and Age", "数字和年龄"), characters: 2, words: 2 },
  { title: t("Family", "家庭"), characters: 2, words: 3 },
  { title: t("Time and Dates", "时间和日期"), characters: 3, words: 4 },
  { title: t("Food and Drink", "吃的和喝的"), characters: 3, words: 4 },
  { title: t("Shopping and Money", "购物和钱"), characters: 3, words: 4 },
  { title: t("School and Study", "学校和学习"), characters: 3, words: 5 },
  { title: t("Places and Directions", "地点和方向"), characters: 3, words: 6 },
  { title: t("Transport and Travel", "交通和出行"), characters: 2, words: 4 },
  { title: t("Weather and Seasons", "天气和季节"), characters: 1, words: 3 },
  { title: t("Hobbies and Free Time", "爱好和空闲"), characters: 2, words: 7 },
  { title: t("Body and Health", "身体和健康"), characters: 2, words: 5 },
];

const two = (n: number): string => String(n).padStart(2, "0");

/** levelOneCharacterId is the id of the nth character topic of level 1, counting from 1. */
export const levelOneCharacterId = (n: number): string => `level-1-characters-${two(n)}`;

/** levelOneWordId is the id of the nth word topic of level 1, counting from 1. */
export const levelOneWordId = (n: number): string => `level-1-words-${two(n)}`;

/** levelOneCharacterBatches are the character batches of level 1, in order. */
export const levelOneCharacterBatches: readonly (readonly LevelOneCharacter[])[] = characterBatches.map(parseLevelOneCharacters);

/** levelOneWordBatches are the word batches of level 1, in order. */
export const levelOneWordBatches: readonly (readonly LevelOneWord[])[] = wordBatches.map((b) => parseLevelOneWords(b.data));

/** levelOneCharacters are all the characters of level 1, by character. */
export const levelOneCharacters: ReadonlyMap<string, LevelOneCharacter> = (() => {
  const out = new Map<string, LevelOneCharacter>();
  for (const c of levelOneCharacterBatches.flat()) {
    if (out.has(c.char)) throw new Error(`level 1: ${c.char} is taught twice`);
    out.set(c.char, c);
  }
  return out;
})();

/** levelOneWords are all the words of level 1. */
export const levelOneWords: readonly string[] = (() => {
  const all = levelOneWordBatches.flat().map((w) => w.word);
  const twice = firstTwice(all);
  if (twice) throw new Error(`level 1: ${twice} is taught twice`);
  return all;
})();

/** levelOneSpeech are the listening and speaking of each unit of level 1, registered for the speaking of later units. */
export const levelOneSpeech: readonly UnitSpeechSpec[] = (() => {
  const characterCount = LEVEL_ONE_UNITS.reduce((n, u) => n + u.characters, 0);
  const wordCount = LEVEL_ONE_UNITS.reduce((n, u) => n + u.words, 0);
  if (characterCount !== levelOneCharacterBatches.length || wordCount !== levelOneWordBatches.length) {
    throw new Error("level 1: the units do not cover the batches");
  }
  let w = 0;
  const speech = LEVEL_ONE_UNITS.map((unit, u): UnitSpeechSpec => {
    const words = levelOneWordBatches.slice(w, w + unit.words).flat();
    w += unit.words;
    return { level: 1, numeral: "一", unit: u + 1, theme: unit.title, words, chars: levelOneCharacters, after: levelOneWordId(w) };
  });
  registerUnitSpeech(1, speech);
  return speech;
})();

/** levelOnePlan is level 1 read from its data and checked, as the later levels build on it. */
export const levelOnePlan: {
  readonly characters: ReadonlyMap<string, LevelOneCharacter>;
  readonly words: readonly string[];
  readonly characterBatches: readonly (readonly LevelOneCharacter[])[];
  readonly wordBatches: readonly (readonly LevelOneWord[])[];
  readonly speech: readonly UnitSpeechSpec[];
  readonly last: { readonly characters: string; readonly words: string };
} = {
  characters: levelOneCharacters,
  words: levelOneWords,
  characterBatches: levelOneCharacterBatches,
  wordBatches: levelOneWordBatches,
  speech: levelOneSpeech,
  last: { characters: levelOneCharacterId(levelOneCharacterBatches.length), words: levelOneWordId(levelOneWordBatches.length) },
};
