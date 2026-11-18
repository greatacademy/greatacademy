// The reading of modern texts of the Gaokao course (docs/chinese-curriculum.md §8.5), as the paper asks it: an
// informational text and a literary one, each read with choice questions checked by rules, then answered in a few
// sentences that a model judges. The passages are written for the subject. Each kind has two topics: one checked by
// rules, with a knowledge point of understanding and one of analysis, and one judged, which builds on it.

import { type CriterionSpec, type Generator, joinText, type Problem, type Rng, same, type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, criterionById, point, quote } from "@ga/subject-chinese";

/** ModernChoice is a choice question on a passage: what it asks, the right option and three wrong ones. */
export interface ModernChoice {
  readonly ask: string;
  readonly right: string;
  readonly wrong: readonly [string, string, string];
}

/** ModernAnswer is a question answered in a few sentences, with one good answer written for the subject. */
export interface ModernAnswer {
  readonly ask: string;
  readonly model: string;
}

/** ModernPassage is a passage with its questions. */
export interface ModernPassage {
  readonly title: string;
  /** body is the passage, its paragraphs split by blank lines. */
  readonly body: string;
  /** understanding are two questions on what the passage says. */
  readonly understanding: readonly [ModernChoice, ModernChoice];
  /** analysis are two questions on how it says it: its reasoning, structure or craft. */
  readonly analysis: readonly [ModernChoice, ModernChoice];
  /** answers are two questions to answer in a few sentences. */
  readonly answers: readonly [ModernAnswer, ModernAnswer];
}

/** ModernPointSpec is what a knowledge point teaches and asks. */
export interface ModernPointSpec {
  readonly title: Text;
  readonly explanation: Text;
  readonly question: Text;
}

/** ModernSpec describes one kind of modern text: its two topics and their passages. */
export interface ModernSpec {
  /** id names the kind; the topics are gaokao-<id>-reading and gaokao-<id>-answers. */
  readonly id: string;
  readonly title: Text;
  readonly summary: Text;
  readonly answersTitle: Text;
  readonly answersSummary: Text;
  readonly prerequisites: readonly string[];
  readonly understanding: ModernPointSpec;
  readonly analysis: ModernPointSpec;
  readonly answers: ModernPointSpec;
  /** criteria are the ids of the criteria that judge the answers. */
  readonly criteria: readonly string[];
  readonly passages: readonly ModernPassage[];
}

/** MIN_PASSAGES is how many passages a kind needs: 12 items a choice point, and 12 tasks to answer. */
const MIN_PASSAGES = 6;

/** PAIRS are the pairs of wrong options a question is asked with, one a round. */
const PAIRS = [
  [0, 1],
  [1, 2],
  [0, 2],
] as const;

/** ANSWER_LIMITS are the length of an answer in characters: a few sentences, as the paper asks. */
const ANSWER_LIMITS = { minWords: 30, maxChars: 600 };

/** shownPassage is how a passage is shown before its question: its title, then its text as a quotation. */
const shownPassage = (p: ModernPassage): string => `《${p.title}》\n\n${p.body.trim()}`;

/** criterion finds a criterion by its id, failing when there is none. */
const criterion = (id: string): CriterionSpec => {
  const found = criterionById(id);
  if (!found) throw new Error(`unknown criterion ${id}`);
  return found;
};

/** choicePoint builds a knowledge point of choice questions, each asked with two of its wrong options in three rounds. */
function choicePoint(
  id: string,
  spec: ModernPointSpec,
  passages: readonly ModernPassage[],
  pick: (p: ModernPassage) => readonly ModernChoice[],
) {
  const items = passages.flatMap((p) => pick(p).map((q) => ({ shown: `${shownPassage(p)}\n\n${q.ask}`, q })));
  for (const { q } of items) {
    if (new Set([q.right, ...q.wrong]).size !== 4) throw new Error(`${id}: the options of ${q.ask}`);
  }
  const bank: readonly ChoiceItem[] = PAIRS.flatMap(([a, b]) =>
    items.map(({ shown, q }): ChoiceItem => [shown, q.right, [q.wrong[a], q.wrong[b]]]),
  );
  return point(
    id,
    spec.title,
    spec.explanation,
    choiceGenerator(spec.question, bank, (right) => t(`The right option is: ${right}`, `正确的一项是：${right}`)),
  );
}

/** answerGenerator picks a question by seed; the learner answers in a few sentences that a model judges against the passage. */
function answerGenerator(question: Text, passages: readonly ModernPassage[], criteria: readonly string[]): Generator {
  const bank = passages.flatMap((p) => p.answers.map((a) => ({ p, a })));
  return (rng: Rng): Problem => {
    const { p, a } = rng.cycle(bank);
    return {
      prompt: joinText([question, same(quote(shownPassage(p))), same(a.ask)]),
      answer: {
        checker: "writing",
        expected: { ...ANSWER_LIMITS },
        input: { kind: "writing", ...ANSWER_LIMITS },
        judged: { criteria: [...criteria], source: shownPassage(p) },
      },
      solution: t(`One good answer:\n\n${quote(a.model)}`, `一个好的答案：\n\n${quote(a.model)}`),
      canonical: a.model,
      wrong: [[...a.model].slice(0, 6).join("")],
    };
  };
}

/** modernTopics builds the two practice-only topics of a kind of modern text. */
export function modernTopics(spec: ModernSpec): readonly [TopicDef, TopicDef] {
  const reading = `gaokao-${spec.id}-reading`;
  const answers = `gaokao-${spec.id}-answers`;
  if (spec.passages.length < MIN_PASSAGES) throw new Error(`${reading}: needs ${MIN_PASSAGES} passages`);
  if (new Set(spec.passages.map((p) => p.title)).size !== spec.passages.length) throw new Error(`${reading}: a title is used twice`);
  for (const p of spec.passages) {
    const length = [...p.body].filter((ch) => /\p{Script=Han}/u.test(ch)).length;
    if (length < 800 || length > 2000) throw new Error(`${reading}: 《${p.title}》 has ${length} characters, not 800 to 2000`);
    for (const a of p.answers) {
      const n = [...a.model].filter((ch) => /\p{Script=Han}/u.test(ch)).length;
      if (n < ANSWER_LIMITS.minWords || n > 200) throw new Error(`${answers}: the model of ${a.ask} has ${n} characters, not 30 to 200`);
    }
  }
  return [
    {
      id: reading,
      title: spec.title,
      summary: spec.summary,
      prerequisites: [...spec.prerequisites],
      encompasses: [],
      xp: 16,
      strand: "reading",
      practiceOnly: true,
      knowledgePoints: [
        choicePoint(`${reading}-understanding`, spec.understanding, spec.passages, (p) => p.understanding),
        choicePoint(`${reading}-analysis`, spec.analysis, spec.passages, (p) => p.analysis),
      ],
    },
    {
      id: answers,
      title: spec.answersTitle,
      summary: spec.answersSummary,
      prerequisites: [reading],
      encompasses: [],
      xp: 16,
      strand: "reading",
      practiceOnly: true,
      criteria: spec.criteria.map(criterion),
      knowledgePoints: [
        point(answers, spec.answers.title, spec.answers.explanation, answerGenerator(spec.answers.question, spec.passages, spec.criteria)),
      ],
    },
  ];
}

/** ANSWER_QUESTION asks for an answer in a few sentences. */
const ANSWER_QUESTION = t(
  "Read the passage, then answer the question below in Chinese, in a few sentences.",
  "阅读下面的文章，然后用中文回答问题，写几句话。",
);

/** CHOICE_QUESTION asks for the right option on a passage. */
const CHOICE_QUESTION = t("Read the passage, then choose the right option.", "阅读下面的文章，然后选出正确的一项。");

/** informationalSpec is the informational text of the paper: an argument, an exposition or a report of knowledge. */
export function informationalSpec(prerequisites: readonly string[], passages: readonly ModernPassage[]): ModernSpec {
  return {
    id: "informational",
    title: t("Gaokao: Informational Texts", "高考：信息类文本阅读"),
    summary: t(
      "Read an argument or an exposition of about a thousand characters, as the paper sets it: what it says, then how it reasons.",
      "按试卷的要求读一篇一千字左右的论述或说明文章：先看它说了什么，再看它怎样论证。",
    ),
    answersTitle: t("Gaokao: Short Answers on Informational Texts", "高考：信息类文本简答"),
    answersSummary: t(
      "Answer a question on an informational text in a few sentences, judged by a model: the points it asks for, drawn from the passage.",
      "用几句话回答信息类文本的问题，由 AI 评判：答出题目要的要点，每一点都来自文章。",
    ),
    prerequisites,
    understanding: {
      title: t("What the Passage Says", "理解文意"),
      explanation: t(
        "The wrong options of the paper are made in a few ways: they **widen or narrow** what the passage says (all for some, always for often), **swap cause and effect**, turn a **possibility into a certainty**, or **mix up** who said what. Find the sentence of the passage each option rests on and compare them word by word.",
        "试卷的错误选项常用几种办法设置：**扩大或缩小范围**（把“有些”说成“所有”，把“常常”说成“总是”），**因果倒置**，把**可能说成必然**，或者**张冠李戴**。找到每个选项依据的原句，逐词比较。",
      ),
      question: CHOICE_QUESTION,
    },
    analysis: {
      title: t("How It Reasons", "分析论证"),
      explanation: t(
        "Questions of analysis ask how the passage makes its case: its **thesis** and the sub-points under it, its **evidence** (examples, facts, data, quotations) and its **methods** (comparison, analogy, cause and effect, refutation), and how its paragraphs **follow on** from each other. Check that an option names the method rightly and says rightly what it proves.",
        "分析题问的是文章怎样论证：**中心论点**和分论点，**论据**（事例、事实、数据、引言），**论证方法**（对比、类比、因果、驳论），以及各段之间的**思路**。检查选项是否说对了方法，又是否说对了它证明了什么。",
      ),
      question: CHOICE_QUESTION,
    },
    answers: {
      title: t("Answering in Points", "分点作答"),
      explanation: t(
        "A short answer is marked by its **points**. Read what the question asks, how many points it needs, then find each one in the passage: a reason, a condition, a consequence. Write each point as a sentence of your own, number them, and add nothing the passage does not support.",
        "简答题按**要点**给分。先看题目问什么、需要几点，再到文章里找出每一点：一个原因、一个条件、一个结果。每点用自己的话写成一句，分条列出，不加文章没有的内容。",
      ),
      question: ANSWER_QUESTION,
    },
    criteria: ["zhgk-info-points", "zhgk-info-grounded", "zhgk-info-concise"],
    passages,
  };
}

/** literarySpec is the literary text of the paper: a story or a literary essay. */
export function literarySpec(prerequisites: readonly string[], passages: readonly ModernPassage[]): ModernSpec {
  return {
    id: "literary",
    title: t("Gaokao: Literary Texts", "高考：文学类文本阅读"),
    summary: t(
      "Read a short story or a literary essay, as the paper sets it: what happens and what it means, then how it is written.",
      "按试卷的要求读一篇小说或散文：先看写了什么、表达了什么，再看是怎样写的。",
    ),
    answersTitle: t("Gaokao: Short Answers on Literary Texts", "高考：文学类文本简答"),
    answersSummary: t(
      "Answer a question on a literary text in a few sentences, judged by a model: the technique, its effect, and the words of the passage that show it.",
      "用几句话回答文学类文本的问题，由 AI 评判：答出手法和作用，并联系文章的语句。",
    ),
    prerequisites,
    understanding: {
      title: t("Content and Feeling", "理解内容和情感"),
      explanation: t(
        "Questions of understanding ask what happens, what a character is like and why they act, and what the writer feels. A wrong option often **reads too much** into a detail, gives a character a **motive** the text does not show, or names a **feeling** of the wrong kind. Go back to the sentences an option points to.",
        "理解题问的是情节、人物的性格和行为的原因，以及作者的情感。错误选项常常**过度解读**一个细节，给人物加上文中没有的**动机**，或者把**情感**说错了方向。回到选项指向的句子去核对。",
      ),
      question: CHOICE_QUESTION,
    },
    analysis: {
      title: t("Craft", "鉴赏写法"),
      explanation: t(
        "Questions of craft ask how the passage is written: **description** of setting, action, speech and mind; **narrative** devices such as clues, foreshadowing, contrast and a shift of viewpoint; and **language**, its rhetoric and its tone. A wrong option usually names a technique the passage does not use, or gives a right technique the wrong effect.",
        "鉴赏题问的是文章怎样写：环境、动作、语言、心理等**描写**；线索、伏笔、对比、视角变化等**叙述**手法；以及**语言**的修辞和风格。错误选项通常说了文章没用的手法，或者把对的手法说成了错的作用。",
      ),
      question: CHOICE_QUESTION,
    },
    answers: {
      title: t("Technique, Effect and Text", "手法、作用和文本"),
      explanation: t(
        "An answer on a literary text has three parts: **name** the technique or feature, **point** to the words of the passage where it is used, and **explain** its effect on the character, the feeling, the theme or the structure. An answer that names a technique and stops there gets few marks.",
        "文学类文本的简答一般有三部分：**说出**手法或特点，**指出**它在文中用在哪些语句上，**分析**它对人物、情感、主题或结构的作用。只说出手法而不分析，得分很少。",
      ),
      question: ANSWER_QUESTION,
    },
    criteria: ["zhgk-lit-technique", "zhgk-lit-effect", "zhgk-lit-grounded"],
    passages,
  };
}
