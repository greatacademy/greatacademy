// The writing paper's characters from their pinyin (docs/chinese-curriculum.md §8.5): in the structure of the exam
// published in December 2025, the second part of the writing of HSK 2 and the first of HSK 3 give a sentence with a
// character shown only by its pinyin, which the candidate writes by hand. Each course has a practice-only topic of the
// characters its level writes by hand, written stroke by stroke and judged by the checker `strokes`: first in a word of
// the levels, then in a sentence of the levels, as the paper asks.

import { type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-chinese";

import { GAP, type LevelOneWord } from "../level-1/words.ts";
import { gap, type HandTask, handGenerator, handSteps, wordTask } from "../strokes/hand.ts";
import { levelHandwritingByLevel, levelWords } from "../strokes/levels.ts";

/** PINYIN_LEVELS are the HSK levels whose writing paper asks for characters from their pinyin. */
export const PINYIN_LEVELS: readonly number[] = [2, 3];

/** writtenCharactersId is the id of the topic of characters from their pinyin of an HSK level. */
export const writtenCharactersId = (level: number): string => `hsk-${level}-written-characters`;

/** syllableOf is a character's syllable in a word. */
const syllableOf = (w: LevelOneWord, char: string): string => w.syllables[[...w.word].indexOf(char)]!;

/** count is how many times a character appears in a text. */
const count = (text: string, char: string): number => [...text].filter((c) => c === char).length;

/** sentenceTask asks for a character in a sentence of the levels, shown by its pinyin where it stands in the word. */
function sentenceTask(char: string, w: LevelOneWord): HandTask {
  const reading = syllableOf(w, char);
  const shown = w.sentence.replace(GAP, gap({ text: w.word, reading }, char));
  const whole = w.sentence.replace(GAP, w.word);
  const ask = t(
    `Write the character of the pinyin in brackets, stroke by stroke in the standard order: **${shown}**`,
    `看拼音，写出括号里的汉字，按笔顺一笔一笔写：**${shown}**`,
  );
  return {
    char,
    cue: t(`in ${whole}`, `在“${whole}”里`),
    trace: ask,
    write: ask,
    solution: handSteps(
      t(
        `Read the sentence with the word in its place: **${whole}**. The word is ${w.word}, so the character is ${char}, read ${reading}.`,
        `把词放回句子里读：“**${whole}**”。这个词是“${w.word}”，所以是“${char}”字，读 ${reading}。`,
      ),
      char,
      t(`Then read the sentence back with it.`, `再把句子读一遍。`),
    ),
  };
}

/** writtenCharactersTopic builds the topic of characters from their pinyin of an HSK level. */
export function writtenCharactersTopic(level: number): TopicDef {
  const batches = levelHandwritingByLevel.find((l) => l.level === level)?.batches ?? [];
  const last = batches.at(-1);
  if (!last) throw new Error(`hsk-${level}: no handwriting`);
  const words = levelWords.slice(0, level).flat();
  const inWords: HandTask[] = [];
  const inSentences: HandTask[] = [];
  for (const { char } of batches.flatMap((b) => b.chars)) {
    // The latest word of the levels that holds the character, and the latest whose sentence holds it nowhere else.
    const holding = words.filter((w) => w.word !== char && w.word.includes(char) && count(w.word, char) === 1);
    const word = holding.at(-1);
    if (word) inWords.push(wordTask(char, syllableOf(word, char), { text: word.word, reading: syllableOf(word, char) }));
    const said = words.filter(
      (w) => w.word.includes(char) && count(w.word, char) === 1 && w.sentence.includes(GAP) && count(w.sentence, char) === 0,
    );
    const sentence = said.at(-1);
    if (sentence) inSentences.push(sentenceTask(char, sentence));
  }
  if (inWords.length < 30 || inSentences.length < 30) throw new Error(`hsk-${level}: too few characters from their pinyin`);
  const id = writtenCharactersId(level);
  return {
    id,
    title: t(`HSK ${level}: Characters from Pinyin`, `HSK ${level}：看拼音写汉字`),
    summary: t(
      `The writing paper's characters from their pinyin: each character level ${level} writes by hand, written stroke by stroke where its pinyin stands, in a word and then in a sentence.`,
      `写作中的看拼音写汉字：${level}级要求会写的每个字，按笔顺写在拼音所在的位置，先在词语里，再在句子里。`,
    ),
    prerequisites: [last.topic.id],
    encompasses: [],
    xp: 12,
    strand: "characters",
    practiceOnly: true,
    knowledgePoints: [
      point(
        `${id}-words`,
        t("In a Word", "词语中的字"),
        t(
          "Read the word aloud with the pinyin in its place: the other characters tell which word it is, and the word tells which character of that sound it holds. Picture the character, then write it in the standard order.",
          "把拼音放回词语里读一读：词语中其他的字告诉你这是哪个词，这个词又告诉你是哪个同音字。先在心里想好字形，再按笔顺写。",
        ),
        handGenerator(inWords, false),
      ),
      point(
        `${id}-sentences`,
        t("In a Sentence", "句子中的字"),
        t(
          "Read the whole sentence first, then the words around the pinyin: the meaning of the sentence tells which word it is, and the word tells the character, not another of the same sound. Then write it in the standard order.",
          "先读完整个句子，再看拼音前后的字：句子的意思告诉你这是哪个词，这个词告诉你是哪个字，不要写成别的同音字。再按笔顺写。",
        ),
        handGenerator(inSentences, false),
      ),
    ],
  };
}

/** writtenTopics are the topics of characters from their pinyin of an HSK course, by its key. */
export const writtenTopics = (key: string): readonly TopicDef[] =>
  PINYIN_LEVELS.includes(Number(key)) ? [writtenCharactersTopic(Number(key))] : [];
