// The HSK courses (docs/chinese-curriculum.md §8.5): practice for the new HSK over the levels already in the graph. HSK 1
// to 6 each go with the level of the same number, and HSK 7–9 with levels 7 to 9. Each course holds its levels' units and
// four exam topics of its own, all practice-only, that mix the whole level as a test does: choosing the word for a
// gap among five or six, matching words and meanings, telling a character from those that look like it, and putting
// the parts of a sentence in order, practice in word order. Two more mix the units' listening and speaking: words and
// sentences heard without being seen, words said after a recording and sentences read aloud. From HSK 3 on, a further
// topic, judged by a model, writes the kinds of text of its levels' paragraph writing; HSK 2 and 3 add the paper's
// characters from their pinyin of written.ts, and HSK 4 to 6 the paper's own tasks of paper.ts.

import {
  type CourseDef,
  type CriterionSpec,
  type Generator,
  joinText,
  type Problem,
  type Rng,
  same,
  type Text,
  type TopicDef,
  t,
} from "@ga/content";
import { criterionById, point, quote, writingGenerator } from "@ga/subject-chinese";

import type { LevelOneCharacter } from "../level-1/characters.ts";
import { levelOneCourse, levelOneWordId } from "../level-1/index.ts";
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
import { levelTwoCourse, levelTwoLast } from "../level-2/index.ts";
import { sentences as levelTwoSentences } from "../level-2/sentence-data.ts";
import { levelThreeCourse, levelThreeLast } from "../level-3/index.ts";
import { sentences as levelThreeSentences } from "../level-3/sentence-data.ts";
import { writing as levelThreeWriting } from "../level-3/writing-data.ts";
import { levelFourCourse, levelFourLast } from "../level-4/index.ts";
import { sentences as levelFourSentences } from "../level-4/sentence-data.ts";
import { writing as levelFourWriting } from "../level-4/writing-data.ts";
import { levelFiveCourse, levelFiveLast } from "../level-5/index.ts";
import { sentences as levelFiveSentences } from "../level-5/sentence-data.ts";
import { writing as levelFiveWriting } from "../level-5/writing-data.ts";
import { levelSixCourse, levelSixLast } from "../level-6/index.ts";
import { sentences as levelSixSentences } from "../level-6/sentence-data.ts";
import { writing as levelSixWriting } from "../level-6/writing-data.ts";
import { levelSevenCourse } from "../level-7/index.ts";
import { sentences as levelSevenSentences } from "../level-7/sentence-data.ts";
import { writing as levelSevenWriting } from "../level-7/writing-data.ts";
import { levelEightCourse } from "../level-8/index.ts";
import { sentences as levelEightSentences } from "../level-8/sentence-data.ts";
import { writing as levelEightWriting } from "../level-8/writing-data.ts";
import { levelNineCourse, levelNineLast } from "../level-9/index.ts";
import { sentences as levelNineSentences } from "../level-9/sentence-data.ts";
import { writing as levelNineWriting } from "../level-9/writing-data.ts";
import { type LevelData, levelData } from "./data.ts";
import { paperTopics } from "./paper.ts";
import { writtenTopics } from "./written.ts";

/** examGroup is the shelf of the Chinese exam courses. */
export const examGroup = t("Chinese Exams", "中文考试");

/** Ask is one item of an exam choice: what is shown, the right option, the wrong ones and the solution. */
export interface Ask {
  readonly shown: Text;
  readonly right: Text;
  readonly wrong: readonly Text[];
  readonly solution: Text;
}

/** quoted sets a text as a block quote in each locale. */
const quoted = (s: Text): Text => t(quote(s.en), quote(s["zh-CN"]));

/** examChoice asks the items in turn, one a seed, with all their wrong options, shuffled by seed. */
export function examChoice(question: Text, items: readonly Ask[]): Generator {
  return (rng: Rng): Problem => {
    const item = rng.cycle(items);
    const options = rng.shuffle([item.right, ...item.wrong]);
    const answer = options.indexOf(item.right);
    return {
      prompt: joinText([question, quoted(item.shown)]),
      answer: { checker: "choice", expected: answer, input: { kind: "choice", options } },
      solution: item.solution,
      canonical: String(answer),
      wrong: options.map((_, i) => String(i)).filter((i) => i !== String(answer)),
    };
  };
}

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

/** gapItems ask for the word of each sentence among `wrong` + 1 words of its batch, or five where the batch has no more that could not also fit. */
function gapItems(levels: readonly LevelData[], wrong: number): readonly Ask[] {
  return interleave(
    levels.flatMap((l) =>
      l.words.map((batch) => {
        const mates = wordMates(batch, l.level);
        return batch.map((w, i): Ask => {
          const whole = w.sentence.replace(GAP, w.word);
          return {
            shown: same(w.sentence),
            right: same(w.word),
            wrong: take(
              `the gap of ${w.word}`,
              wrong,
              mates[i]!.map((v) => v.word),
              4,
            ).map(same),
            solution: t(
              `The sentence is ${whole} **${w.word}** (${pinyin(w)}) means "${w.meaning.en}".`,
              `完整的句子是：${whole}“**${w.word}**”（${pinyin(w)}）的意思是：${w.meaning["zh-CN"]}。`,
            ),
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
          const solution = t(
            `**${w.word}** (${pinyin(w)}) means "${w.meaning.en}".`,
            `**${w.word}**（${pinyin(w)}）的意思是：${w.meaning["zh-CN"]}。`,
          );
          return reverse
            ? { shown: same(w.word), right: w.meaning, wrong: others.map((v) => v.meaning), solution }
            : { shown: w.meaning, right: same(w.word), wrong: others.map((v) => same(v.word)), solution };
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

/** characterItems ask for each character by its reading and meaning among four, three of them like it in look. */
function characterItems(levels: readonly LevelData[]): readonly Ask[] {
  return interleave(
    levels.flatMap((l) =>
      l.characters.map((batch) =>
        batch.map(
          (c, i): Ask => ({
            shown: t(`${c.reading}: ${c.meaning.en}`, `${c.reading}：${c.meaning["zh-CN"]}`),
            right: same(c.char),
            wrong: lookalikes(c, batch, i).map(same),
            solution: t(
              `**${c.char}** is read **${c.reading}** and means "${c.meaning.en}".`,
              `**${c.char}**读 **${c.reading}**，意思是：${c.meaning["zh-CN"]}。`,
            ),
          }),
        ),
      ),
    ),
  );
}

/** inWordItems ask for each character in a word of its level that has it once and whose meaning does not give it away, given the word's pinyin and meaning, among four. */
function inWordItems(levels: readonly LevelData[]): readonly Ask[] {
  return interleave(
    levels.flatMap((l) => {
      const words = l.words.flat();
      return l.characters.map((batch) =>
        batch.flatMap((c, i): Ask[] => {
          const w = words.find(
            (v) => [...v.word].length > 1 && [...v.word].filter((x) => x === c.char).length === 1 && !v.meaning["zh-CN"].includes(c.char),
          );
          if (!w) return [];
          const blank = [...w.word].map((x) => (x === c.char ? "＿" : x)).join("");
          return [
            {
              shown: t(`${blank} (${pinyin(w)}): ${w.meaning.en}`, `${blank}（${pinyin(w)}）：${w.meaning["zh-CN"]}`),
              right: same(c.char),
              wrong: lookalikes(c, batch, i).map(same),
              solution: t(
                `The word is **${w.word}** (${pinyin(w)}), and **${c.char}** is read **${c.reading}**.`,
                `这个词是**${w.word}**（${pinyin(w)}），**${c.char}**读 **${c.reading}**。`,
              ),
            },
          ];
        }),
      );
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
  readonly courses: readonly CourseDef[];
  readonly buildsOn: readonly string[];
  readonly words: number;
  readonly characters: number;
}

/** examTopics builds the four exam topics of an HSK course. */
function examTopics(spec: HskSpec): readonly TopicDef[] {
  const { key, name, levels } = spec;
  const id = (s: string): string => `hsk-${key}-${s}`;
  const base = { prerequisites: [spec.after], encompasses: [], xp: 12, practiceOnly: true };
  return [
    {
      ...base,
      id: id("gaps"),
      title: t(`HSK ${name}: Words in Sentences`, `HSK ${name}：选词填空`),
      summary: t(
        `Choosing the word that fills a sentence among five, then among six, with words from every theme of the levels HSK ${name} tests.`,
        `在五个词、再在六个词中选出填进句子的那个，词语来自 HSK ${name} 所考等级的各个话题。`,
      ),
      strand: "words",
      knowledgePoints: [
        point(
          id("gaps-five"),
          t("Five Words", "五选一"),
          t(
            "Read the whole sentence before the options. Ask what kind of word the gap needs, a thing, an action or a description, then try only the words of that kind.",
            "先读完整个句子再看选项。想一想横线处需要什么样的词，是事物、动作还是描写，再只拿这一类词去试。",
          ),
          examChoice(t("Which word fills the gap?", "横线处填哪个词语？"), gapItems(levels, 4)),
        ),
        point(
          id("gaps-six"),
          t("Six Words", "六选一"),
          t(
            "With more options, rule words out: a word that does not fit the words right before and after the gap cannot be the answer, however well it fits the theme.",
            "选项多的时候，先排除：和横线前后的词搭配不上的词，不管和话题多相关，都不是答案。",
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
      strand: "words",
      knowledgePoints: [
        point(
          id("meanings-word"),
          t("The Word of a Meaning", "按意思找词"),
          t(
            "Think of the characters that carry the meaning, then look for the word written with them.",
            "先想表达这个意思要用哪些字，再找用这些字写成的词。",
          ),
          examChoice(t("Which word has this meaning?", "哪个词语是这个意思？"), meaningItems(levels, false)),
        ),
        point(
          id("meanings-meaning"),
          t("The Meaning of a Word", "看词选意思"),
          t(
            "Read the word and recall the meaning of each of its characters; the meaning of the word grows from them.",
            "读这个词，回想每个字的意思；词的意思往往由字义组合而来。",
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
      strand: "characters",
      knowledgePoints: [
        point(
          id("characters-reading"),
          t("By Reading and Meaning", "按读音和意思选字"),
          t(
            "Characters that look alike usually differ in one component: the meaning component tells what the character is about, the sound component how it is read.",
            "形近字往往只差一个部件：形旁表示字和什么有关，声旁提示字的读音。",
          ),
          examChoice(t("Which character is this?", "这是哪个字？"), characterItems(levels)),
        ),
        point(
          id("characters-word"),
          t("In a Word", "在词里选字"),
          t(
            "Read the whole word in pinyin and think of its meaning; the missing character must give both.",
            "读出整个词的拼音，想一想词的意思；缺的那个字要同时对得上读音和意思。",
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

/** hsk builds an HSK course and its exam topics. */
function hsk(spec: HskSpec): { readonly course: CourseDef; readonly topics: readonly TopicDef[] } {
  const topics = [...examTopics(spec), ...speechExam(spec), ...writtenTopics(spec.key), ...writingExam(spec), ...paperTopics(spec.key)];
  const conversations = spec.courses.flatMap((c) => c.conversations ?? []);
  return {
    topics,
    course: {
      id: `chinese-hsk-${spec.key}`,
      title: t(`HSK ${spec.name}`, `HSK ${spec.name}`),
      description: t(
        `Practice for level ${spec.name} of the new HSK over the ${spec.characters.toLocaleString("en")} characters and ${spec.words.toLocaleString("en")} words of ${spec.levels.length > 1 ? `levels ${spec.name}` : `level ${spec.name}`}: their units, then words in sentences, words and meanings, characters, and building sentences, with every theme mixed as a test mixes them${spec.numbers[0]! >= 3 ? ", and writing, judged by a model" : ""}, and listening and speaking. It teaches nothing new: its own topics start with practice.`,
        `新 HSK ${spec.name} 级的练习，覆盖${spec.zh}的 ${spec.characters} 个汉字和 ${spec.words} 个词语：先是这些等级的单元，然后是选词填空、词语和意思、汉字和连词成句${spec.numbers[0]! >= 3 ? "，以及由 AI 评判的写作" : ""}，还有听力和口语，各个话题像考试一样混在一起。本课程不教新知识：它自己的主题一开始就是练习。`,
      ),
      group: examGroup,
      buildsOn: [...spec.buildsOn],
      units: [
        ...spec.courses.flatMap((c) => c.units),
        {
          title: t("Exam Practice", "考试练习"),
          modules: [{ title: t(`HSK ${spec.name}`, `HSK ${spec.name}`), topics: topics.map((x) => x.id) }],
        },
      ],
      ...(conversations.length > 0 ? { conversations } : {}),
    },
  };
}

const count = (levels: readonly LevelData[], k: "characters" | "words"): number => levels.reduce((n, l) => n + l[k].flat().length, 0);

const ONE = [levelOneCourse, levelTwoCourse, levelThreeCourse, levelFourCourse, levelFiveCourse, levelSixCourse] as const;
const LAST = [levelOneWordId(50), levelTwoLast.words, levelThreeLast.words, levelFourLast.words, levelFiveLast.words, levelSixLast.words];

const built = [
  ...ONE.map((course, i) => {
    const levels = [levelData[i]!];
    return hsk({
      key: String(i + 1),
      name: String(i + 1),
      zh: `${"一二三四五六"[i]}级`,
      levels,
      numbers: [i + 1],
      after: LAST[i]!,
      courses: [course],
      buildsOn: course.buildsOn ?? [],
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
      after: levelNineLast.words,
      courses: [levelSevenCourse, levelEightCourse, levelNineCourse],
      buildsOn: ["chinese-level-6"],
      characters: count(levels, "characters"),
      words: count(levels, "words"),
    });
  })(),
];

/** hskTopics are the exam topics of the HSK courses: those every course has, and the writing of some. */
export const hskTopics: readonly TopicDef[] = built.flatMap((b) => b.topics);

/** hskCourses are the seven HSK courses, HSK 1 to 6 and HSK 7–9. */
export const hskCourses: readonly CourseDef[] = built.map((b) => b.course);
