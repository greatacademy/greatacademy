// The HSK courses (docs/chinese-curriculum.md §8.5): practice for the new HSK over the levels already in the graph. HSK 1
// to 6 each go with the level of the same number, and HSK 7–9 with levels 7 to 9. Each course holds its levels' units and
// four exam topics of its own, all practice-only, that mix the whole level as a test does: choosing the word for a
// gap among five or six, matching words and meanings, telling a character from those that look like it, and putting
// the parts of a sentence in order, practice in word order. Two more mix the units' listening and speaking: words and
// sentences heard without being seen, words said after a recording and sentences read aloud. From HSK 3 on, a further
// topic, judged by a model, writes the kinds of text of its levels' paragraph writing; HSK 2 and 3 add the paper's
// characters from their pinyin of written.ts, and HSK 4 to 6 the paper's own tasks of paper.ts.

import { type CourseDef, type CriterionSpec, type Generator, same, slimTopics, type Text, type TopicDef, t } from "@ga/content";
import { criterionById, point, quote, toneless, writingGenerator, zhQuote } from "@ga/subject-chinese";
import { checkApart, type LevelOneCharacter, lookalikeOf, notTheCharacter } from "../level-1/characters.ts";
import { nearOf, spread } from "../level-1/kit.ts";
import {
  type Asked,
  fromBank,
  levelListeningId,
  levelSpeakingId,
  listeningBanks,
  speakingBanks,
  unitSpeechSpecs,
} from "../level-1/listening.ts";
import { levelOnePlan } from "../level-1/plan.ts";
import { sentences as levelOneSentences } from "../level-1/sentence-data.ts";
import {
  type LevelSentences,
  LONG_EXPLANATION,
  levelSentencesId,
  parseSentences,
  SHORT_EXPLANATION,
  sentenceGenerator,
} from "../level-1/sentences.ts";
import { GAP, type LevelOneWord, pinyinOf } from "../level-1/words.ts";
import { type LevelWriting, levelWritingId } from "../level-1/writing.ts";
import { levelTwoPlan } from "../level-2/plan.ts";
import { sentences as levelTwoSentences } from "../level-2/sentence-data.ts";
import { levelThreePlan } from "../level-3/plan.ts";
import { sentences as levelThreeSentences } from "../level-3/sentence-data.ts";
import { writing as levelThreeWriting } from "../level-3/writing-data.ts";
import { levelFourPlan } from "../level-4/plan.ts";
import { sentences as levelFourSentences } from "../level-4/sentence-data.ts";
import { writing as levelFourWriting } from "../level-4/writing-data.ts";
import { levelFivePlan } from "../level-5/plan.ts";
import { sentences as levelFiveSentences } from "../level-5/sentence-data.ts";
import { writing as levelFiveWriting } from "../level-5/writing-data.ts";
import { levelSixPlan } from "../level-6/plan.ts";
import { sentences as levelSixSentences } from "../level-6/sentence-data.ts";
import { writing as levelSixWriting } from "../level-6/writing-data.ts";
import { sentences as levelSevenSentences } from "../level-7/sentence-data.ts";
import { writing as levelSevenWriting } from "../level-7/writing-data.ts";
import { sentences as levelEightSentences } from "../level-8/sentence-data.ts";
import { writing as levelEightWriting } from "../level-8/writing-data.ts";
import { levelNinePlan } from "../level-9/plan.ts";
import { sentences as levelNineSentences } from "../level-9/sentence-data.ts";
import { writing as levelNineWriting } from "../level-9/writing-data.ts";
import { answeringOne, answeringThree, answeringTwo } from "./answering-data.ts";
import { type ComprehensionData, comprehensionTopics } from "./comprehension.ts";
import { comprehension as comprehensionOne } from "./comprehension-data/hsk-1.ts";
import { comprehension as comprehensionTwo } from "./comprehension-data/hsk-2.ts";
import { comprehension as comprehensionThree } from "./comprehension-data/hsk-3.ts";
import { comprehension as comprehensionFour } from "./comprehension-data/hsk-4.ts";
import { comprehension as comprehensionFive } from "./comprehension-data/hsk-5.ts";
import { comprehension as comprehensionSix } from "./comprehension-data/hsk-6.ts";
import { comprehension as comprehensionSevenToNine } from "./comprehension-data/hsk-7-9.ts";
import { type LevelData, levelData } from "./data.ts";
import { type Ask, examChoice, examGroup } from "./exam.ts";
import { oralTopics } from "./oral.ts";
import { paperTopics } from "./paper.ts";
import { writtenTopics } from "./written.ts";

/** interleave takes one item of each batch in turn, so that consecutive seeds come from different batches, as a test mixes them. */
function interleave<T>(batches: readonly (readonly T[])[]): readonly T[] {
  const out: T[] = [];
  const longest = Math.max(...batches.map((b) => b.length));
  for (let i = 0; i < longest; i++) for (const b of batches) if (i < b.length) out.push(b[i]!);
  return out;
}

/** take is the first n distinct candidates, or as many as there are; it throws, naming what for, if there are fewer than `least`. */
function take(what: string, n: number, candidates: readonly string[], least = n): readonly string[] {
  const out = [...new Set(candidates)].slice(0, n);
  if (out.length < least) throw new Error(`hsk: too few wrong answers for ${what}`);
  return out;
}

/** wordMates are, for each word of a batch, the others of the batch not kept apart from it, every third first. */
function wordMates(batch: readonly LevelOneWord[], level: number): readonly (readonly LevelOneWord[])[] {
  const near = nearOf(
    batch.map((w) => ({ key: w.word, near: w.near })),
    `level ${level}`,
  );
  return batch.map((w, i) => spread(batch, i).filter((v) => !near.get(w.word)!.has(v.word)));
}

const pinyin = (w: LevelOneWord): string => pinyinOf(w.syllables);

/** gapWhole is a sentence of a word with the gap filled by `put`, the word itself when left out. */
const gapWhole = (w: LevelOneWord, put: string = w.word): string => w.sentence.replace(GAP, put);

/** gapItems ask for the word of each sentence among `wrong` + 1 words of its batch, or five where the batch has no more that could not also fit. */
function gapItems(levels: readonly LevelData[], wrong: number): readonly Ask[] {
  return interleave(
    levels.flatMap((l) =>
      l.words.map((batch) => {
        const mates = wordMates(batch, l.level);
        const byWord = new Map(batch.map((v) => [v.word, v]));
        return batch.map((w, i): Ask => {
          const others = take(
            `the gap of ${w.word}`,
            wrong,
            mates[i]!.map((v) => v.word),
            4,
          );
          const clue = w.clue;
          const reason = (x: string): Text => {
            const v = byWord.get(x)!;
            if (clue)
              return t(
                `${clue.why.en} ${v.word} (${pinyin(v)}) means "${v.meaning.en}", so it does not fit.`,
                `${clue.why["zh-CN"]}，而“${v.word}”（${pinyin(v)}）的意思是${zhQuote(v.meaning["zh-CN"])}，填不进去。`,
              );
            return t(
              `${v.word} (${pinyin(v)}) means "${v.meaning.en}". Put in the gap it reads ${gapWhole(w, v.word)} Read the words on both sides of the gap with that meaning: they do not go with it.`,
              `“${v.word}”（${pinyin(v)}）的意思是${zhQuote(v.meaning["zh-CN"])}。放进横线处，句子成了${zhQuote(gapWhole(w, v.word))}；连着横线前后的词按这个意思读，搭配不上。`,
            );
          };
          return {
            shown: same(w.sentence),
            right: same(w.word),
            wrong: others.map(same),
            solution: t(
              `The sentence is ${gapWhole(w)}\n\n${clue ? `${clue.why.en} ` : ""}**${w.word}** (${pinyin(w)}) means "${w.meaning.en}", which is what the words around the gap call for.\n\n**Check.** Read the gap as that meaning: ${gapWhole(w, `[${w.meaning.en}]`)} It still says the same.`,
              `完整的句子是：${gapWhole(w)}\n\n${clue ? `${clue.why["zh-CN"]}，` : ""}“**${w.word}**”（${pinyin(w)}）的意思是${zhQuote(w.meaning["zh-CN"])}，正是横线前后的词要求的意思。\n\n**检验。** 把横线换成词义来读：${gapWhole(w, `（${zhQuote(w.meaning["zh-CN"]).slice(1, -1)}）`)}意思仍然通顺。`,
            ),
            reasons: others.map(reason),
          };
        });
      }),
    ),
  );
}

/** meaningItems ask for each word by its meaning, or with `reverse` for the meaning of each word, among four. */
function meaningItems(levels: readonly LevelData[], reverse: boolean): readonly Ask[] {
  return interleave(
    levels.flatMap((l) =>
      l.words.map((batch) => {
        const mates = wordMates(batch, l.level);
        return batch.map((w, i): Ask => {
          const others = mates[i]!.slice(0, 3);
          if (others.length < 3) throw new Error(`hsk: too few wrong answers for the meaning of ${w.word}`);
          const check = t(
            `**Check.** Put it in its sentence: ${gapWhole(w)} The meaning fits there.`,
            `**检验。** 把它放进句子里读：${gapWhole(w)}按这个意思读，句子通顺。`,
          );
          const solution = t(
            `**${w.word}** (${pinyin(w)}) means "${w.meaning.en}".\n\n${check.en}`,
            `**${w.word}**（${pinyin(w)}）的意思是${zhQuote(w.meaning["zh-CN"])}。\n\n${check["zh-CN"]}`,
          );
          const reasons = others.map((v) =>
            reverse
              ? t(
                  `"${v.meaning.en}" is the meaning of ${v.word} (${pinyin(v)}), not of ${w.word}.`,
                  `${zhQuote(v.meaning["zh-CN"])}是“${v.word}”（${pinyin(v)}）的意思，不是“${w.word}”的意思。`,
                )
              : t(
                  `${v.word} (${pinyin(v)}) means "${v.meaning.en}", another meaning.`,
                  `“${v.word}”（${pinyin(v)}）的意思是${zhQuote(v.meaning["zh-CN"])}，和题目给的意思不同。`,
                ),
          );
          return reverse
            ? { shown: same(w.word), right: w.meaning, wrong: others.map((v) => v.meaning), solution, reasons }
            : { shown: w.meaning, right: same(w.word), wrong: others.map((v) => same(v.word)), solution, reasons };
        });
      }),
    ),
  );
}

/** lookalikes are the wrong characters offered against a character: those it looks like, then others of its batch. */
function lookalikes(c: LevelOneCharacter, batch: readonly LevelOneCharacter[], i: number): readonly string[] {
  const near = new Set([...c.near, ...batch.filter((d) => d.near.includes(c.char)).map((d) => d.char)]);
  return take(`the character ${c.char}`, 3, [
    ...c.looks.filter((l) => l !== c.char && !near.has(l)),
    ...spread(batch, i)
      .map((d) => d.char)
      .filter((d) => !near.has(d)),
  ]);
}

/** allCharacters are the characters of every level, by character, for the reasons of the character topics. */
const allCharacters: ReadonlyMap<string, LevelOneCharacter> = new Map(
  levelData.flatMap((l) => l.characters.flat().map((c) => [c.char, c])),
);

/** batchOf maps the characters of a batch by character. */
const batchOf = (batch: readonly LevelOneCharacter[]): ReadonlyMap<string, LevelOneCharacter> => new Map(batch.map((c) => [c.char, c]));

/** characterItems ask for each character by its reading and meaning among four, three of them like it in look. */
function characterItems(levels: readonly LevelData[]): readonly Ask[] {
  return interleave(
    levels.flatMap((l) =>
      l.characters.map((batch) => {
        const mates = batchOf(batch);
        return batch.map((c, i): Ask => {
          const wrong = lookalikes(c, batch, i);
          return {
            shown: t(`${c.reading}: ${c.meaning.en}`, `${c.reading}：${c.meaning["zh-CN"]}`),
            right: same(c.char),
            wrong: wrong.map(same),
            solution: t(
              `**${c.char}** is read **${c.reading}** and means "${c.meaning.en}".\n\n${checkApart(c, allCharacters, mates).en}`,
              `**${c.char}**读 **${c.reading}**，意思是${zhQuote(c.meaning["zh-CN"])}。\n\n${checkApart(c, allCharacters, mates)["zh-CN"]}`,
            ),
            reasons: wrong.map((w) => notTheCharacter(c, w, allCharacters, mates)),
          };
        });
      }),
    ),
  );
}

/**
 * inWordWrong are the wrong characters offered for a gap in a word: as lookalikes gives them, but none the word already
 * has; where too few are left, characters of the other levels that look like it, then characters of the same syllable
 * with another tone, which cannot make a word of the same sound.
 */
function inWordWrong(c: LevelOneCharacter, batch: readonly LevelOneCharacter[], i: number, word: string): readonly string[] {
  const near = new Set([...c.near, ...batch.filter((d) => d.near.includes(c.char)).map((d) => d.char)]);
  const fine = (x: string): boolean => x !== c.char && !near.has(x) && !word.includes(x);
  const syllable = toneless(c.reading.normalize("NFC"));
  const tone = (r: string) => r.normalize("NFC");
  return take(`the character ${c.char} in ${word}`, 3, [
    ...c.looks.filter(fine),
    ...spread(batch, i)
      .map((d) => d.char)
      .filter(fine),
    ...[...allCharacters.values()].filter((d) => d.looks.includes(c.char) && fine(d.char)).map((d) => d.char),
    ...[...allCharacters.values()]
      .filter((d) => toneless(d.reading.normalize("NFC")) === syllable && tone(d.reading) !== tone(c.reading) && fine(d.char))
      .map((d) => d.char),
  ]);
}

/** notInWord says why a character is not the one missing from a word: by its own reading, else by its meaning. */
function notInWord(c: LevelOneCharacter, char: string, w: LevelOneWord, mates: ReadonlyMap<string, LevelOneCharacter>): Text {
  const d = mates.get(char) ?? allCharacters.get(char);
  if (d && d.reading.normalize("NFC") !== c.reading.normalize("NFC"))
    return t(
      `${char} is read ${d.reading}, not ${c.reading}, and means "${d.meaning.en}": it does not write ${w.word}.`,
      `“${char}”读 ${d.reading}，不读 ${c.reading}，意思是${zhQuote(d.meaning["zh-CN"])}，写不成“${w.word}”。`,
    );
  if (d)
    return t(
      `${char} is also read ${d.reading}, but it means "${d.meaning.en}": ${w.word} is written with ${c.char}.`,
      `“${char}”也读 ${d.reading}，可它的意思是${zhQuote(d.meaning["zh-CN"])}；“${w.word}”要用“${c.char}”。`,
    );
  return notTheCharacter(c, char, allCharacters, mates);
}

/** inWordItems ask for each character in a word of its level that has it once and whose meaning does not give it away, given the word's pinyin and meaning, among four. */
function inWordItems(levels: readonly LevelData[]): readonly Ask[] {
  return interleave(
    levels.flatMap((l) => {
      const words = l.words.flat();
      return l.characters.map((batch) => {
        const mates = batchOf(batch);
        return batch.flatMap((c, i): Ask[] => {
          const w = words.find(
            (v) => [...v.word].length > 1 && [...v.word].filter((x) => x === c.char).length === 1 && !v.meaning["zh-CN"].includes(c.char),
          );
          if (!w) return [];
          const blank = [...w.word].map((x) => (x === c.char ? "＿" : x)).join("");
          const wrong = inWordWrong(c, batch, i, w.word);
          return [
            {
              shown: t(`${blank} (${pinyin(w)}): ${w.meaning.en}`, `${blank}（${pinyin(w)}）：${w.meaning["zh-CN"]}`),
              right: same(c.char),
              wrong: wrong.map(same),
              solution: t(
                `The word is **${w.word}** (${pinyin(w)}), "${w.meaning.en}".\n\nIts missing character is **${c.char}**, read **${c.reading}**, which means "${c.meaning.en}".\n\n**Check.** Put ${c.char} back and read the word syllable by syllable: ${w.word}, ${pinyin(w)}.`,
                `这个词是**${w.word}**（${pinyin(w)}），意思是${zhQuote(w.meaning["zh-CN"])}。\n\n缺的字是**${c.char}**，读 **${c.reading}**，意思是${zhQuote(c.meaning["zh-CN"])}。\n\n**检验。** 把“${c.char}”放回去，一个音节一个音节地读：${w.word}，${pinyin(w)}。`,
              ),
              reasons: wrong.map((x) => notInWord(c, x, w, mates)),
            },
          ];
        });
      });
    }),
  );
}

/** SENTENCES are the sentence-building topics of each level, level 1 first. */
const SENTENCES: readonly (readonly LevelSentences[])[] = [
  levelOneSentences,
  levelTwoSentences,
  levelThreeSentences,
  levelFourSentences,
  levelFiveSentences,
  levelSixSentences,
  levelSevenSentences,
  levelEightSentences,
  levelNineSentences,
];

/** sentenceBank mixes the sentences of the given levels, short or long, one of each topic in turn; the levels checked their characters. */
function sentenceBank(levels: readonly number[], kind: "short" | "long") {
  return interleave(
    levels.flatMap((level) =>
      (SENTENCES[level - 1] ?? []).map((s, k) =>
        parseSentences(`hsk level ${level} sentences ${k + 1}`, s[kind], kind === "short" ? [3, 4] : [5, 7]),
      ),
    ),
  );
}

/** ESSAY_MINIMUMS are the fewest characters the paper's essay asks for, by HSK course, where more than its levels' writing asks; the explanations name them, and the tasks keep the levels' lengths. */
const ESSAY_MINIMUMS: Readonly<Record<string, number>> = { "5": 200, "6": 300 };

/** WRITING are the paragraph-writing topics of levels 3 to 9, from which the HSK courses that have writing draw. */
const WRITING: Readonly<Record<number, readonly LevelWriting[]>> = {
  3: levelThreeWriting,
  4: levelFourWriting,
  5: levelFiveWriting,
  6: levelSixWriting,
  7: levelSevenWriting,
  8: levelEightWriting,
  9: levelNineWriting,
};

/** criterion finds a criterion by its id, failing when there is none. */
const criterion = (id: string): CriterionSpec => {
  const found = criterionById(id);
  if (!found) throw new Error(`unknown criterion ${id}`);
  return found;
};

/** onePiece shows a model answer as one quotation. */
const onePiece = (model: string): Text => t(`One good answer:\n\n${quote(model)}`, `一篇好的答案：\n\n${quote(model)}`);

/**
 * writingExam builds the writing topic of an HSK course from level 3 on, judged by a model: a knowledge point for each
 * paragraph-writing topic of its levels, asked with that topic's tasks and judged by all three of its criteria.
 */
function writingExam(spec: HskSpec): readonly TopicDef[] {
  const kinds = spec.numbers.flatMap((level) => (WRITING[level] ?? []).map((w, k) => ({ level, n: k + 1, w })));
  if (kinds.length === 0) return [];
  const last = kinds.at(-1)!;
  const id = `hsk-${spec.key}-writing`;
  return [
    {
      id,
      title: t(`HSK ${spec.name}: Writing`, `HSK ${spec.name}：写作`),
      summary: t(
        `Writing short texts in Chinese as the writing paper asks, judged by a model: every kind of writing of the levels HSK ${spec.name} tests.`,
        `按写作试卷的要求用中文写短文，由 AI 评判：HSK ${spec.name} 所考等级的各种写作。`,
      ),
      prerequisites: [levelWritingId(last.level, last.n)],
      encompasses: [],
      xp: 18,
      strand: "writing",
      practiceOnly: true,
      criteria: [...new Set(kinds.flatMap((k) => k.w.criteria))].map(criterion),
      knowledgePoints: kinds.map(({ level, n, w }) => {
        const least = w.minChars;
        const paper = ESSAY_MINIMUMS[spec.key];
        const longer = paper
          ? {
              en: ` In the paper of HSK ${spec.name} the essay needs at least ${paper} characters: once this length comes easily, write that much.`,
              zh: `HSK ${spec.name} 考试的作文要求不少于 ${paper} 字：这个长度写得顺手以后，就按考试的字数写。`,
            }
          : { en: "", zh: "" };
        return point(
          `${id}-level-${level}-${String(n).padStart(2, "0")}`,
          w.title,
          t(
            `In the paper, a text is marked on all of it at once: what it says, how it is put together, and its language. Plan before you write, keep to the task, and leave time to check your characters. ${w.summary.en}${longer.en}`,
            `考试时，一篇短文的内容、结构和语言一起评分。先想好再写，紧扣题目，留出时间检查有没有写错字。${w.summary["zh-CN"]}${longer.zh}`,
          ),
          writingGenerator(
            t(`Write the text below in Chinese, of at least ${least} characters.`, `按下面的要求，用中文写一篇不少于 ${least} 字的短文。`),
            w.bank,
            [...w.criteria],
            { minWords: least, maxChars: least * 10 },
            onePiece,
          ),
        );
      }),
    },
  ];
}

/** HskSpec describes an HSK course. */
interface HskSpec {
  /** key names the course in ids, as in 1 or 7-9. */
  readonly key: string;
  /** name names the course in titles, as in 1 or 7–9. */
  readonly name: string;
  /** zh names the levels it tests in Chinese, as in 一级. */
  readonly zh: string;
  readonly levels: readonly LevelData[];
  /** numbers are the numbers of the levels it tests. */
  readonly numbers: readonly number[];
  /** after is the last topic of the levels it tests. */
  readonly after: string;
  readonly words: number;
  readonly characters: number;
}

/** examTopics builds the four exam topics of an HSK course. */
function examTopics(spec: HskSpec): readonly TopicDef[] {
  const { key, name, levels } = spec;
  const id = (s: string): string => `hsk-${key}-${s}`;
  const base = { prerequisites: [spec.after], encompasses: [], xp: 12, practiceOnly: true };
  // The instances of the character topic: a character with a look-alike that has a meaning to tell, and a word missing it.
  const tested = levels.flatMap((l) => l.characters.flat());
  const seen = tested.find((c) => lookalikeOf(c, allCharacters, new Map())) ?? tested[0]!;
  const like = lookalikeOf(seen, allCharacters, new Map());
  const likeText = like
    ? t(
        `${like.char} looks like it but is read ${like.reading} and means "${like.meaning.en}"`,
        `“${like.char}”和它长得像，却读 ${like.reading}，意思是${zhQuote(like.meaning["zh-CN"])}`,
      )
    : t(`no character of these levels looks just like it`, `这些等级里没有和它完全一样的字`);
  const wordOf = levels
    .flatMap((l) => l.words.flat())
    .find((v) => [...v.word].length > 1 && [...v.word].filter((x) => x === seen.char).length === 1);
  // The instances of the word topics: the first word of the levels, its sentence and a word of its set that does not fit it.
  const firstBatch = levels[0]!.words[0]!;
  const fw = firstBatch[0]!;
  const fm = wordMates(firstBatch, levels[0]!.level)[0]![0]!;
  return [
    {
      ...base,
      id: id("gaps"),
      title: t(`HSK ${name}: Words in Sentences`, `HSK ${name}：选词填空`),
      summary: t(
        `Choosing the word that fills a sentence among five, then among six, with words from every theme of the levels HSK ${name} tests.`,
        `在五个词、再在六个词中选出填进句子的那个，词语来自 HSK ${name} 所考等级的各个话题。`,
      ),
      intro: t(
        `As in the reading paper of HSK ${name}, a sentence has a gap, and one of five or six words fills it, the words drawn from every theme of the levels at once. Take ${fw.sentence} The word is **${fw.word}** (${pinyin(fw)}), "${fw.meaning.en}": ${gapWhole(fw)}`,
        `和 HSK ${name} 阅读试卷一样，句子里有一个空，要从五个或六个词中选一个填进去，词语来自这些等级的各个话题。比如${zhQuote(fw.sentence)}，要填 **${fw.word}**（${pinyin(fw)}），意思是${zhQuote(fw.meaning["zh-CN"])}：${gapWhole(fw)}`,
      ),
      strand: "words",
      knowledgePoints: [
        point(
          id("gaps-five"),
          t("Five Words", "五选一"),
          t(
            `Read the whole sentence before the options. Ask what kind of word the gap needs, a thing, an action or a description, then try only the words of that kind. Take ${fw.sentence} The words around the gap call for "${fw.meaning.en}", so it is **${fw.word}**: ${gapWhole(fw)}\n\n> **Watch out.** A word that is near in theme can still be wrong: ${fm.word} means "${fm.meaning.en}", and with it the sentence reads ${gapWhole(fw, fm.word)} Read the words just before and after the gap with the word in place.`,
            `先读完整个句子再看选项。想一想横线处需要什么样的词，是事物、动作还是描写，再只拿这一类词去试。比如${zhQuote(fw.sentence)}，横线前后的词要的是${zhQuote(fw.meaning["zh-CN"])}这个意思，所以填 **${fw.word}**：${gapWhole(fw)}\n\n> **注意。** 话题相近的词也可能不对：“${fm.word}”的意思是${zhQuote(fm.meaning["zh-CN"])}，填进去句子成了${zhQuote(gapWhole(fw, fm.word))}。要把词放进去，连着横线前后的词一起读。`,
          ),
          examChoice(t("Which word fills the gap?", "横线处填哪个词语？"), gapItems(levels, 4)),
        ),
        point(
          id("gaps-six"),
          t("Six Words", "六选一"),
          t(
            `With more options, rule words out: a word that does not fit the words right before and after the gap cannot be the answer, however well it fits the theme. Take ${fw.sentence} Try ${fm.word}, "${fm.meaning.en}", and the sentence reads ${gapWhole(fw, fm.word)} so it is ruled out; the one left that fits is **${fw.word}**.\n\n> **Watch out.** Ruling out is not enough by itself: read the sentence once more with the word you kept, ${gapWhole(fw)} and make sure it says something complete.`,
            `选项多的时候，先排除：和横线前后的词搭配不上的词，不管和话题多相关，都不是答案。比如${zhQuote(fw.sentence)}，试“${fm.word}”（${fm.meaning["zh-CN"]}），句子成了${zhQuote(gapWhole(fw, fm.word))}，搭配不上，排除；剩下能填的是 **${fw.word}**。\n\n> **注意。** 只排除还不够：把留下的词放进去再读一遍，${zhQuote(gapWhole(fw))}，确认句子意思完整。`,
          ),
          examChoice(t("Which word fills the gap?", "横线处填哪个词语？"), gapItems(levels, 5)),
        ),
      ],
    },
    {
      ...base,
      id: id("meanings"),
      title: t(`HSK ${name}: Words and Meanings`, `HSK ${name}：词语和意思`),
      summary: t(
        `Matching the words of the levels HSK ${name} tests with their meanings, both ways, with words of every theme mixed.`,
        `把 HSK ${name} 所考等级的词语和意思对应起来，两个方向都练，各个话题的词混在一起。`,
      ),
      intro: t(
        `The words of the levels HSK ${name} tests are matched with their meanings, both ways, the themes mixed as in the paper. Take **${fw.word}** (${pinyin(fw)}): it means "${fw.meaning.en}", as in ${gapWhole(fw)}`,
        `把 HSK ${name} 所考等级的词语和意思对应起来，两个方向都练，各个话题像试卷里一样混在一起。比如 **${fw.word}**（${pinyin(fw)}），意思是${zhQuote(fw.meaning["zh-CN"])}，可以说：${gapWhole(fw)}`,
      ),
      strand: "words",
      knowledgePoints: [
        point(
          id("meanings-word"),
          t("The Word of a Meaning", "按意思找词"),
          t(
            `Think of the characters that carry the meaning, then look for the word written with them. Take "${fw.meaning.en}": it is **${fw.word}**, read ${pinyin(fw)}.\n\n> **Watch out.** Words of one theme are easy to swap: ${fm.word} means "${fm.meaning.en}", not "${fw.meaning.en}". Match the whole meaning, not only the theme.`,
            `先想表达这个意思要用哪些字，再找用这些字写成的词。比如${zhQuote(fw.meaning["zh-CN"])}，就是 **${fw.word}**，读 ${pinyin(fw)}。\n\n> **注意。** 同一话题的词容易混：“${fm.word}”的意思是${zhQuote(fm.meaning["zh-CN"])}，不是${zhQuote(fw.meaning["zh-CN"])}。要对上整个意思，不能只看是哪一类。`,
          ),
          examChoice(t("Which word has this meaning?", "哪个词语是这个意思？"), meaningItems(levels, false)),
        ),
        point(
          id("meanings-meaning"),
          t("The Meaning of a Word", "看词选意思"),
          t(
            `Read the word and recall the meaning of each of its characters; the meaning of the word grows from them. Take **${fw.word}** (${pinyin(fw)}): it means "${fw.meaning.en}", as in ${gapWhole(fw)}\n\n> **Watch out.** "${fm.meaning.en}" belongs to the same theme but is the meaning of ${fm.word}. Put the meaning back into a sentence with the word to be sure.`,
            `读这个词，回想每个字的意思；词的意思往往由字义组合而来。比如 **${fw.word}**（${pinyin(fw)}），意思是${zhQuote(fw.meaning["zh-CN"])}，可以说：${gapWhole(fw)}\n\n> **注意。** ${zhQuote(fm.meaning["zh-CN"])}属于同一个话题，却是“${fm.word}”的意思。把意思放回带这个词的句子里读一读，才能确定。`,
          ),
          examChoice(t("What does this word mean?", "这个词语是什么意思？"), meaningItems(levels, true)),
        ),
      ],
    },
    {
      ...base,
      id: id("characters"),
      title: t(`HSK ${name}: Characters`, `HSK ${name}：汉字`),
      summary: t(
        `Telling each character of the levels HSK ${name} tests from those that look like it, first by its reading and meaning, then in a word.`,
        `把 HSK ${name} 所考等级的每个字和形近字区分开，先按读音和意思，再放在词里。`,
      ),
      intro: t(
        `The paper asks you to tell a character from those that look like it. Take **${seen.char}**: it is read ${seen.reading} and means "${seen.meaning.en}", and ${likeText.en}. This topic picks each character of the levels HSK ${name} tests, first by its reading and meaning, then in a word.`,
        `试卷要求把一个字和形近字区分开。比如 **${seen.char}**：读 ${seen.reading}，意思是${zhQuote(seen.meaning["zh-CN"])}；${likeText["zh-CN"]}。这个专题先按读音和意思、再在词里，选出 HSK ${name} 所考等级的每个字。`,
      ),
      strand: "characters",
      knowledgePoints: [
        point(
          id("characters-reading"),
          t("By Reading and Meaning", "按读音和意思选字"),
          t(
            `Characters that look alike usually differ in one component: the meaning component tells what the character is about, the sound component how it is read. Take ${seen.reading}, "${seen.meaning.en}": it is **${seen.char}**, and ${likeText.en}.\n\n> **Watch out.** Read the pinyin and the meaning together: a look-alike may share a sound component and sound close, but it means something else.`,
            `形近字往往只差一个部件：形旁表示字和什么有关，声旁提示字的读音。比如读 ${seen.reading}、意思是${zhQuote(seen.meaning["zh-CN"])}的字是 **${seen.char}**；${likeText["zh-CN"]}。\n\n> **注意。** 读音和意思要一起看：形近字可能声旁相同、读音相近，意思却不一样。`,
          ),
          examChoice(t("Which character is this?", "这是哪个字？"), characterItems(levels)),
        ),
        point(
          id("characters-word"),
          t("In a Word", "在词里选字"),
          t(
            `Read the whole word in pinyin and think of its meaning; the missing character must give both.${wordOf ? ` Take ${wordOf.word} (${pinyin(wordOf)}), "${wordOf.meaning.en}": its character ${seen.char} is read ${seen.reading}.` : ""}\n\n> **Watch out.** A character of the right sound is not enough: it must also give the word its meaning, so check both before you choose.`,
            `读出整个词的拼音，想一想词的意思；缺的那个字要同时对得上读音和意思。${wordOf ? `比如“${wordOf.word}”（${pinyin(wordOf)}），意思是${zhQuote(wordOf.meaning["zh-CN"])}，其中的“${seen.char}”读 ${seen.reading}。` : ""}\n\n> **注意。** 光读音对还不够，字还要合乎词的意思；读音和意思都对上了再选。`,
          ),
          examChoice(t("Which character is missing?", "缺的是哪个字？"), inWordItems(levels)),
        ),
      ],
    },
    {
      ...base,
      id: id("sentences"),
      title: t(`HSK ${name}: Building Sentences`, `HSK ${name}：连词成句`),
      summary: t(
        `Putting the parts of sentences in order, to practise the word order every part of the paper needs, with sentences from every unit of the levels HSK ${name} tests.`,
        `把词语排成句子，练习试卷各部分都要用到的语序，句子来自 HSK ${name} 所考等级的各个单元。`,
      ),
      prerequisites: [levelSentencesId(spec.numbers.at(-1) ?? 1, SENTENCES[(spec.numbers.at(-1) ?? 1) - 1]?.length ?? 4)],
      strand: "writing",
      knowledgePoints: [
        point(
          id("sentences-short"),
          t("Short Sentences", "短句"),
          SHORT_EXPLANATION,
          sentenceGenerator(sentenceBank(spec.numbers, "short")),
        ),
        point(id("sentences-long"), t("Longer Sentences", "长句"), LONG_EXPLANATION, sentenceGenerator(sentenceBank(spec.numbers, "long"))),
      ],
    },
  ];
}

/** speechExam builds the listening and speaking topics of an HSK course, each mixing every unit of the levels it tests. */
function speechExam(spec: HskSpec): readonly TopicDef[] {
  const id = (s: string): string => `hsk-${spec.key}-${s}`;
  const units = spec.numbers.flatMap(unitSpeechSpecs);
  const last = units.at(-1);
  if (!last) throw new Error(`HSK ${spec.name}: no units with listening`);
  const listening = units.map(listeningBanks);
  const speaking = units.map(speakingBanks);
  const mixed = (banks: readonly (readonly Asked[])[]): Generator => fromBank(interleave(banks));
  return [
    {
      id: id("listening"),
      title: t(`HSK ${spec.name}: Listening`, `HSK ${spec.name}：听力`),
      summary: t(
        `Words and sentences of every unit of the levels HSK ${spec.name} tests, heard without being seen, every theme mixed.`,
        `不看文字，听 HSK ${spec.name} 所考等级各个单元的词语和句子，各个话题混在一起。`,
      ),
      prerequisites: [levelListeningId(last.level, last.unit)],
      encompasses: [],
      xp: 12,
      practiceOnly: true,
      strand: "listening",
      knowledgePoints: [
        point(
          id("listening-words"),
          t("Words You Hear", "听词语"),
          t(
            "Listen to every syllable and its tone before you look at the meanings: words of different themes may sound alike but for one tone.",
            "先听清每个音节和它的声调，再看意思：不同话题的词可能只差一个声调。",
          ),
          mixed(listening.map((b) => b.hearWord)),
        ),
        point(
          id("listening-sentences"),
          t("Words in Sentences", "句子里的词"),
          t(
            "Listen to the whole sentence first; then check each word offered for its syllables, one after another, in what you heard.",
            "先听完整个句子，再看每个选项的几个音节是不是连着出现在你听到的话里。",
          ),
          mixed(listening.map((b) => b.hearSentence)),
        ),
      ],
    },
    {
      id: id("speaking"),
      title: t(`HSK ${spec.name}: Speaking`, `HSK ${spec.name}：口语`),
      summary: t(
        `Saying words after a recording and reading sentences aloud, from every unit of the levels HSK ${spec.name} tests, every theme mixed.`,
        `跟着录音说词语，朗读句子，内容来自 HSK ${spec.name} 所考等级的各个单元，各个话题混在一起。`,
      ),
      prerequisites: [levelSpeakingId(last.level, last.unit)],
      encompasses: [],
      xp: 12,
      practiceOnly: true,
      strand: "speaking",
      spoken: "zh-CN",
      knowledgePoints: [
        point(
          id("speaking-words"),
          t("Saying Words", "说词语"),
          t(
            "Listen, then say the word at the same pace, each syllable in its tone, copying the recording where tones change in speech.",
            "先听录音，再用同样的速度说出这个词，每个音节读准声调；说话时变调的地方，照录音说。",
          ),
          mixed(speaking.map((b) => b.sayWord)),
        ),
        point(
          id("speaking-sentences"),
          t("Reading Sentences Aloud", "朗读句子"),
          t(
            "Read at a calm speed, keeping the words of a phrase together and pausing at the commas.",
            "用平稳的速度朗读，一个词组里的字连起来读，在逗号处稍作停顿。",
          ),
          mixed(speaking.map((b) => b.readSentence)),
        ),
      ],
    },
  ];
}

/** COMPREHENSION are the dialogues and passages of the HSK courses, by key. */
const COMPREHENSION: Readonly<Record<string, ComprehensionData>> = {
  "1": comprehensionOne,
  "2": comprehensionTwo,
  "3": comprehensionThree,
  "4": comprehensionFour,
  "5": comprehensionFive,
  "6": comprehensionSix,
  "7-9": comprehensionSevenToNine,
};

/** comprehensionExam builds the dialogues and passages of an HSK course, after its listening and its gaps. */
function comprehensionExam(spec: HskSpec): readonly TopicDef[] {
  const data = COMPREHENSION[spec.key];
  if (!data) return [];
  const id = (s: string): string => `hsk-${spec.key}-${s}`;
  const top = Math.max(...spec.levels.map((l) => l.level));
  // A course tests its own levels and every level before them.
  const taught = new Set(levelData.filter((l) => l.level <= top).flatMap((l) => l.characters.flat().map((c) => c.char)));
  return comprehensionTopics(
    { key: spec.key, name: spec.name, top, taught, listeningAfter: id("listening"), readingAfter: id("gaps") },
    data,
  );
}

/** ANSWERING are the questions the HSK courses of the elementary speaking test answer, by key. */
const ANSWERING: Readonly<Record<string, string>> = { "1": answeringOne, "2": answeringTwo, "3": answeringThree };

/** oralExam builds the answering of questions of HSK 1 to 3, and the reading aloud of the courses after them. */
function oralExam(spec: HskSpec): readonly TopicDef[] {
  const top = Math.max(...spec.numbers);
  const taught = new Set(levelData.filter((l) => l.level <= top).flatMap((l) => l.characters.flat().map((c) => c.char)));
  const answering = ANSWERING[spec.key];
  const passages = top >= 4 ? COMPREHENSION[spec.key]?.passages.short : undefined;
  return oralTopics({
    key: spec.key,
    name: spec.name,
    taught,
    after: `hsk-${spec.key}-speaking`,
    ...(answering && { answering }),
    ...(passages && { passages }),
  });
}

/** HskPart is an HSK course's exam topics and how its course is made from the courses of the levels it tests. */
export interface HskPart {
  readonly key: string;
  readonly topics: readonly TopicDef[];
  readonly course: (courses: readonly CourseDef[], buildsOn: readonly string[]) => CourseDef;
}

/** hsk builds the exam topics of an HSK course; its course is made in courses.ts, with the courses of its levels. */
function hsk(spec: HskSpec): HskPart {
  // Each part apart, so that the banks of only one are built at a time.
  const topics = [
    ...slimTopics(() => examTopics(spec)),
    ...slimTopics(() => speechExam(spec)),
    ...slimTopics(() => comprehensionExam(spec)),
    ...slimTopics(() => oralExam(spec)),
    ...slimTopics(() => writtenTopics(spec.key)),
    ...slimTopics(() => writingExam(spec)),
    ...slimTopics(() => paperTopics(spec.key)),
  ];
  return {
    key: spec.key,
    topics,
    course: (courses, buildsOn) => {
      const conversations = courses.flatMap((c) => c.conversations ?? []);
      return {
        id: `chinese-hsk-${spec.key}`,
        title: t(`HSK ${spec.name}`, `HSK ${spec.name}`),
        description: t(
          `Practice for level ${spec.name} of the new HSK over the ${spec.characters.toLocaleString("en")} characters and ${spec.words.toLocaleString("en")} words of ${spec.levels.length > 1 ? `levels ${spec.name}` : `level ${spec.name}`}: their units, then words in sentences, words and meanings, characters, and building sentences, with every theme mixed as a test mixes them${spec.numbers[0]! >= 3 ? ", and writing, judged by a model" : ""}, and listening and speaking. It teaches nothing new: its own topics start with practice.`,
          `新 HSK ${spec.name} 级的练习，覆盖${spec.zh}的 ${spec.characters} 个汉字和 ${spec.words} 个词语：先是这些等级的单元，然后是选词填空、词语和意思、汉字和连词成句${spec.numbers[0]! >= 3 ? "，以及由 AI 评判的写作" : ""}，还有听力和口语，各个话题像考试一样混在一起。本课程不教新知识：它自己的主题一开始就是练习。`,
        ),
        group: examGroup,
        buildsOn: [...buildsOn],
        units: [
          ...courses.flatMap((c) => c.units),
          {
            title: t("Exam Practice", "考试练习"),
            modules: [{ title: t(`HSK ${spec.name}`, `HSK ${spec.name}`), topics: topics.map((x) => x.id) }],
          },
        ],
        ...(conversations.length > 0 ? { conversations } : {}),
      };
    },
  };
}

const count = (levels: readonly LevelData[], k: "characters" | "words"): number => levels.reduce((n, l) => n + l[k].flat().length, 0);

const PLANS = [levelOnePlan, levelTwoPlan, levelThreePlan, levelFourPlan, levelFivePlan, levelSixPlan] as const;

const built = [
  ...PLANS.map((plan, i) => {
    const levels = [levelData[i]!];
    return hsk({
      key: String(i + 1),
      name: String(i + 1),
      zh: `${"一二三四五六"[i]}级`,
      levels,
      numbers: [i + 1],
      after: plan.last.words,
      characters: count(levels, "characters"),
      words: count(levels, "words"),
    });
  }),
  (() => {
    const levels = levelData.slice(6, 9);
    return hsk({
      key: "7-9",
      name: "7–9",
      zh: "七至九级",
      levels,
      numbers: [7, 8, 9],
      after: levelNinePlan.last.words,
      characters: count(levels, "characters"),
      words: count(levels, "words"),
    });
  })(),
];

/** hskParts are the seven HSK courses' exam topics, HSK 1 to 6 and HSK 7–9. */
export const hskParts: readonly HskPart[] = built;

/** hskTopics are the exam topics of the HSK courses: those every course has, and the writing of some. */
export const hskTopics: readonly TopicDef[] = built.flatMap((b) => b.topics);
