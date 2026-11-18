// The HSK courses (docs/chinese-curriculum.md §8.5): practice for the new HSK over the levels already in the graph. HSK 1
// to 6 each go with the level of the same number, and HSK 7–9 with levels 7 to 9. Each course holds its levels' units and
// three exam topics of its own, all practice-only, that mix the whole level as a test does: choosing the word for a
// gap among five or six, matching words and meanings, and telling a character from those that look like it.

import { type CourseDef, type Generator, joinText, type Problem, type Rng, same, type Text, type TopicDef, t } from "@ga/content";
import { point, quote } from "@ga/subject-chinese";

import type { LevelOneCharacter } from "../level-1/characters.ts";
import { levelOneCourse, levelOneWordId } from "../level-1/index.ts";
import { nearOf, spread } from "../level-1/kit.ts";
import { GAP, type LevelOneWord, pinyinOf } from "../level-1/words.ts";
import { levelTwoCourse, levelTwoLast } from "../level-2/index.ts";
import { levelThreeCourse, levelThreeLast } from "../level-3/index.ts";
import { levelFourCourse, levelFourLast } from "../level-4/index.ts";
import { levelFiveCourse, levelFiveLast } from "../level-5/index.ts";
import { levelSixCourse, levelSixLast } from "../level-6/index.ts";
import { levelSevenCourse } from "../level-7/index.ts";
import { levelEightCourse } from "../level-8/index.ts";
import { levelNineCourse, levelNineLast } from "../level-9/index.ts";
import { type LevelData, levelData } from "./data.ts";

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

/** HskSpec describes an HSK course. */
interface HskSpec {
  /** key names the course in ids, as in 1 or 7-9. */
  readonly key: string;
  /** name names the course in titles, as in 1 or 7–9. */
  readonly name: string;
  /** zh names the levels it tests in Chinese, as in 一级. */
  readonly zh: string;
  readonly levels: readonly LevelData[];
  /** after is the last topic of the levels it tests. */
  readonly after: string;
  readonly courses: readonly CourseDef[];
  readonly buildsOn: readonly string[];
  readonly words: number;
  readonly characters: number;
}

/** examTopics builds the three exam topics of an HSK course. */
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
  ];
}

/** hsk builds an HSK course and its exam topics. */
function hsk(spec: HskSpec): { readonly course: CourseDef; readonly topics: readonly TopicDef[] } {
  const topics = examTopics(spec);
  return {
    topics,
    course: {
      id: `chinese-hsk-${spec.key}`,
      title: t(`HSK ${spec.name}`, `HSK ${spec.name}`),
      description: t(
        `Practice for level ${spec.name} of the new HSK over the ${spec.characters.toLocaleString("en")} characters and ${spec.words.toLocaleString("en")} words of ${spec.levels.length > 1 ? `levels ${spec.name}` : `level ${spec.name}`}: their units, then words in sentences, words and meanings, and characters, with every theme mixed as a test mixes them. It teaches nothing new: its own topics start with practice. Listening, speaking and writing will follow with audio and judged answers.`,
        `新 HSK ${spec.name} 级的练习，覆盖${spec.zh}的 ${spec.characters} 个汉字和 ${spec.words} 个词语：先是这些等级的单元，然后是选词填空、词语和意思、汉字，各个话题像考试一样混在一起。本课程不教新知识：它自己的主题一开始就是练习。听力、口语和写作将在有了音频和评判之后加入。`,
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
      after: levelNineLast.words,
      courses: [levelSevenCourse, levelEightCourse, levelNineCourse],
      buildsOn: ["chinese-level-6"],
      characters: count(levels, "characters"),
      words: count(levels, "words"),
    });
  })(),
];

/** hskTopics are the 21 exam topics of the HSK courses, three a course. */
export const hskTopics: readonly TopicDef[] = built.flatMap((b) => b.topics);

/** hskCourses are the seven HSK courses, HSK 1 to 6 and HSK 7–9. */
export const hskCourses: readonly CourseDef[] = built.map((b) => b.course);
