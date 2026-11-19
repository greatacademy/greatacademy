// Level 1 of Chinese as a foreign language (docs/chinese-curriculum.md §8.3): 300 characters in 30 batches and 500
// words in 50 batches, in twelve units of daily life. Each unit teaches its characters first, then words and sentences
// written only with the characters taught so far.

import { type CourseDef, type Text, type TopicDef, t } from "@ga/content";

import { characterBatches } from "./character-data.ts";
import { type LevelOneCharacter, levelOneCharacterTopic, parseLevelOneCharacters } from "./characters.ts";
import { dialogues } from "./dialogue-data.ts";
import { unitDialogueTopics } from "./dialogues.ts";
import { unitGrammarTopics } from "./grammar.ts";
import { grammar } from "./grammar-data.ts";
import { unitListeningTopic, unitSpeakingTopic } from "./listening.ts";
import { sentences } from "./sentence-data.ts";
import { unitSentenceTopics } from "./sentences.ts";
import { wordBatches } from "./word-data.ts";
import { GAP, type LevelOneWord, levelOneWordTopic, parseLevelOneWords } from "./words.ts";

/** UNITS are the units of level 1: a theme, how many character batches and how many word batches it has. */
const UNITS: readonly { readonly title: Text; readonly characters: number; readonly words: number }[] = [
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

/** PUNCTUATION may appear in a sentence besides taught characters. */
const PUNCTUATION = new Set([..."，。？！：“”、"]);

const two = (n: number): string => String(n).padStart(2, "0");

/** levelOneCharacterId is the id of the nth character topic of level 1, counting from 1. */
export const levelOneCharacterId = (n: number): string => `level-1-characters-${two(n)}`;

/** levelOneWordId is the id of the nth word topic of level 1, counting from 1. */
export const levelOneWordId = (n: number): string => `level-1-words-${two(n)}`;

const charBatches: readonly (readonly LevelOneCharacter[])[] = characterBatches.map(parseLevelOneCharacters);
const words: readonly (readonly LevelOneWord[])[] = wordBatches.map((b) => parseLevelOneWords(b.data));

/** levelOneCharacters are all the characters of level 1, by character. */
export const levelOneCharacters: ReadonlyMap<string, LevelOneCharacter> = (() => {
  const out = new Map<string, LevelOneCharacter>();
  for (const c of charBatches.flat()) {
    if (out.has(c.char)) throw new Error(`level 1: ${c.char} is taught twice`);
    out.set(c.char, c);
  }
  return out;
})();

/** levelOneWords are all the words of level 1. */
export const levelOneWords: readonly string[] = (() => {
  const all = words.flat().map((w) => w.word);
  const twice = all.find((w, i) => all.indexOf(w) !== i);
  if (twice) throw new Error(`level 1: ${twice} is taught twice`);
  return all;
})();

interface Built {
  readonly topics: readonly TopicDef[];
  readonly units: CourseDef["units"];
}

/** build makes the topics and units of level 1, checking that each word and sentence uses only characters taught by then. */
function build(): Built {
  const characterCount = UNITS.reduce((n, u) => n + u.characters, 0);
  const wordCount = UNITS.reduce((n, u) => n + u.words, 0);
  if (characterCount !== charBatches.length || wordCount !== words.length) throw new Error("level 1: the units do not cover the batches");
  const topics: TopicDef[] = [];
  const units: CourseDef["units"][number][] = [];
  const taught = new Set<string>();
  if (grammar.some((x) => x.unit < 1 || x.unit > UNITS.length)) throw new Error("level 1: a grammar topic names no unit");
  let c = 0;
  let w = 0;
  let g = 1;
  for (const [u, unit] of UNITS.entries()) {
    const characterIds: string[] = [];
    for (let k = 0; k < unit.characters; k++) {
      const batch = charBatches[c]!;
      c++;
      const id = levelOneCharacterId(c);
      for (const ch of batch) taught.add(ch.char);
      const chars = batch.map((x) => x.char).join("");
      topics.push(
        levelOneCharacterTopic({
          id,
          title: t(`Level 1 Characters ${two(c)}: ${chars}`, `一级汉字 ${two(c)}：${chars}`),
          prerequisites: c === 1 ? ["pinyin-spelling"] : [levelOneCharacterId(c - 1)],
          batch,
          all: levelOneCharacters,
        }),
      );
      characterIds.push(id);
    }
    const wordIds: string[] = [];
    const unitWords: LevelOneWord[] = [];
    for (let k = 0; k < unit.words; k++) {
      const batch = words[w]!;
      unitWords.push(...batch);
      const { theme } = wordBatches[w]!;
      w++;
      const id = levelOneWordId(w);
      for (const word of batch) {
        const untaught = [...word.word, ...word.sentence.replace(GAP, "")].filter((ch) => !taught.has(ch) && !PUNCTUATION.has(ch));
        if (untaught.length > 0) throw new Error(`level 1: ${word.word} or its sentence uses ${untaught.join("")}, not taught by ${id}`);
      }
      topics.push(
        levelOneWordTopic({
          id,
          title: t(`Level 1 Words ${two(w)}: ${theme[0]}`, `一级词语 ${two(w)}：${theme[1]}`),
          theme: t(theme[0], theme[1]),
          prerequisites:
            w === 1
              ? [levelOneCharacterId(c), "pinyin-yi-and-bu", "pinyin-third-tones"]
              : k === 0
                ? [levelOneCharacterId(c), levelOneWordId(w - 1)]
                : [levelOneWordId(w - 1)],
          batch,
          chars: levelOneCharacters,
        }),
      );
      wordIds.push(id);
    }
    const unitGrammar = unitGrammarTopics({
      level: 1,
      n: g,
      grammar: grammar.filter((x) => x.unit === u + 1),
      taught,
      after: levelOneWordId(w),
    });
    g += unitGrammar.length;
    topics.push(...unitGrammar);
    const speech = {
      level: 1,
      numeral: "一",
      unit: u + 1,
      theme: unit.title,
      words: unitWords,
      chars: levelOneCharacters,
      after: levelOneWordId(w),
    };
    const listening = [
      unitListeningTopic(speech),
      unitSpeakingTopic(speech),
      ...unitDialogueTopics({ level: 1, numeral: "一", unit: u, dialogues, taught }),
    ];
    topics.push(...listening);
    const unitSentences = unitSentenceTopics({
      level: 1,
      unit: u,
      sentences,
      titles: UNITS.map((x) => x.title),
      taught,
      after: unitGrammar.at(-1)?.id ?? levelOneWordId(w),
    });
    topics.push(...unitSentences);
    units.push({
      title: unit.title,
      modules: [
        { title: t("Characters", "汉字"), topics: characterIds },
        { title: t("Words", "词语"), topics: wordIds },
        ...(unitGrammar.length > 0 ? [{ title: t("Grammar", "语法"), topics: unitGrammar.map((x) => x.id) }] : []),
        { title: t("Listening and Speaking", "听和说"), topics: listening.map((x) => x.id) },
        ...(unitSentences.length > 0 ? [{ title: t("Writing", "写作"), topics: unitSentences.map((x) => x.id) }] : []),
      ],
    });
  }
  return { topics, units };
}

const built = build();

/** levelOneTopics are the 128 topics of level 1: 30 of characters, 50 of words and 48 of grammar. */
export const levelOneTopics: readonly TopicDef[] = built.topics;

/** levelOneCourse is the course of level 1 of Chinese as a foreign language. */
export const levelOneCourse: CourseDef = {
  id: "chinese-level-1",
  title: t("Chinese Level 1", "中文一级"),
  description: t(
    "Level 1 of Chinese as a foreign language: 300 basic characters and 500 words of daily life in twelve units, from greetings to health, each word met in a sentence of characters already taught. Explanations are in the learner's language.",
    "面向把中文作为外语学习的人的一级课程：十二个单元，从问候到健康，学习 300 个基础汉字和 500 个日常词语，每个词都放在只用学过的字写成的句子里。用学习者的语言讲解。",
  ),
  group: t("Chinese", "语文"),
  buildsOn: ["chinese-pinyin"],
  units: built.units,
};
