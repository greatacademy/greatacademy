// The reading of modern texts of the Gaokao course (docs/chinese-curriculum.md §8.5), as the paper asks it: an
// informational text and a literary one, each read with choice questions checked by rules, then answered in a few
// sentences that a model judges. The passages are written for the subject. Each kind has two topics: one checked by
// rules, with a knowledge point of understanding and one of analysis, and one judged, which builds on it.

import { type CriterionSpec, type Generator, joinText, type Problem, type Rng, same, type Text, type TopicDef, t } from "@ga/content";
import { criterionById, point, quote, zhQuote } from "@ga/subject-chinese";

/**
 * ModernChoice is a choice question on a passage: what it asks, the right option and three wrong ones, each written by
 * hand with the words of the passage the right option rests on, the reason each wrong one fails, and a check of its own.
 */
export interface ModernChoice {
  readonly ask: string;
  readonly right: string;
  readonly wrong: readonly [string, string, string];
  /** ground is the words of the passage the right option rests on, copied from it exactly. */
  readonly ground: string;
  /** reasons say why each wrong option fails, in the order of wrong: the kind of error and where it lies. */
  readonly reasons: readonly [Text, Text, Text];
  /** check tests the right option from another angle: another place in the passage it explains or agrees with. */
  readonly check: Text;
}

/** ModernAnswer is a question answered in a few sentences, with one good answer written for the subject. */
export interface ModernAnswer {
  readonly ask: string;
  readonly model: string;
}

/** ModernPassage is a passage with its questions. */
export interface ModernPassage {
  readonly title: string;
  /** author is the writer of a classical poem, shown after its title with the dynasty, as in 〔唐〕杜甫. */
  readonly author?: string;
  /** body is the passage, its paragraphs split by blank lines. */
  readonly body: string;
  /** understanding are two questions on what the passage says. */
  readonly understanding: readonly [ModernChoice, ModernChoice];
  /** analysis are two questions on how it says it: its reasoning, structure or craft. */
  readonly analysis: readonly [ModernChoice, ModernChoice];
  /** answers are two questions to answer in a few sentences. */
  readonly answers: readonly [ModernAnswer, ModernAnswer];
}

/** ModernPointSpec is what a knowledge point teaches and asks, and the warning its explanation ends with. */
export interface ModernPointSpec {
  readonly title: Text;
  readonly explanation: Text;
  readonly callout: Text;
  readonly question: Text;
}

/** ModernAnswersSpec is a judged knowledge point: what it teaches, and how its worked answer plans and checks. */
export interface ModernAnswersSpec extends ModernPointSpec {
  readonly plan: Text;
  readonly check: Text;
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
  readonly answers: ModernAnswersSpec;
  /** criteria are the ids of the criteria that judge the answers. */
  readonly criteria: readonly string[];
  readonly passages: readonly ModernPassage[];
  /** length is the fewest and most Han characters a passage may have; 800 to 2000 unless given. */
  readonly length?: readonly [min: number, max: number];
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
const shownPassage = (p: ModernPassage): string => `《${p.title}》${p.author ? `　${p.author}` : ""}\n\n${p.body.trim()}`;

/** criterion finds a criterion by its id, failing when there is none. */
const criterion = (id: string): CriterionSpec => {
  const found = criterionById(id);
  if (!found) throw new Error(`unknown criterion ${id}`);
  return found;
};

/** whereText says where the right option of a question points: the words of the passage it rests on. */
const whereText = (q: ModernChoice): Text => t(`goes back to ${zhQuote(q.ground)}`, `依据的是原文${zhQuote(q.ground)}`);

/** whyNot says why the wrong option at index i of a question fails. */
const whyNot = (q: ModernChoice, i: number): Text =>
  t(`${zhQuote(q.wrong[i]!)} is wrong. ${q.reasons[i]!.en}`, `${zhQuote(q.wrong[i]!)}不对。${q.reasons[i]!["zh-CN"]}`);

/** choiceSolution works a choice question: where the right option points, why each wrong one shown fails, a check. */
function choiceSolution(q: ModernChoice, shown: readonly number[]): Text {
  const reasons = shown.map((i) => whyNot(q, i));
  const list = (l: "en" | "zh-CN") => reasons.map((r) => r[l]).join("\n\n");
  return t(
    `**Step 1: find where each option points.** The question is **${q.ask}** Take each option back to the words of the passage it rests on.\n\n**Step 2: compare, word by word.** The right option, ${zhQuote(q.right)}, ${whereText(q).en}, and says what it says, no more and no less.\n\n${list("en")}\n\n**Check.** ${q.check.en}`,
    `**第一步：找出每个选项的依据。**题目是“${q.ask}”。把每个选项带回文中，找到它依据的语句。\n\n**第二步：逐词比较。**正确选项${zhQuote(q.right)}${whereText(q)["zh-CN"]}，说的正是原文的意思，不多也不少。\n\n${list("zh-CN")}\n\n**检验。** ${q.check["zh-CN"]}`,
  );
}

/** choiceInstance walks the first question of a knowledge point: where its right option and one wrong option point. */
function choiceInstance(p: ModernPassage, q: ModernChoice): Text {
  const why = whyNot(q, 0);
  return t(
    `In 《${p.title}》, asked **${q.ask}**, the right option ${zhQuote(q.right)} ${whereText(q).en}. ${why.en}`,
    `比如《${p.title}》问“${q.ask}”，正确选项${zhQuote(q.right)}${whereText(q)["zh-CN"]}。${why["zh-CN"]}`,
  );
}

/** squeezed is a text without its white space, so a ground can be found in a passage or poem across its line breaks. */
const squeezed = (text: string): string => text.replace(/\s+/gu, "");

/**
 * explainedChoice fails unless a question rests on words of its passage, gives a reason of its own for each wrong option,
 * and checks its answer in words other than the ground's.
 */
function explainedChoice(id: string, p: ModernPassage, q: ModernChoice): void {
  if (!q.ground.trim() || !squeezed(p.body).includes(squeezed(q.ground)))
    throw new Error(`${id}: the ground of ${q.ask} in 《${p.title}》 is not in the passage`);
  if (q.reasons.length !== q.wrong.length) throw new Error(`${id}: ${q.ask} in 《${p.title}》 needs a reason for each wrong option`);
  for (const r of q.reasons) {
    if (!r.en.trim() || !r["zh-CN"].trim()) throw new Error(`${id}: a reason of ${q.ask} in 《${p.title}》 is empty`);
  }
  if (new Set(q.reasons.map((r) => r["zh-CN"])).size !== q.reasons.length)
    throw new Error(`${id}: ${q.ask} in 《${p.title}》 gives one reason twice`);
  if (!q.check.en.trim() || !q.check["zh-CN"].trim() || squeezed(q.check["zh-CN"]) === squeezed(q.ground))
    throw new Error(`${id}: ${q.ask} in 《${p.title}》 needs a check of its own, not the ground again`);
}

/** explained is a knowledge point's explanation, then its instance, then its warning. */
const explained = (spec: ModernPointSpec, instance: Text): Text =>
  t(
    `${spec.explanation.en}\n\n${instance.en}\n\n> **Watch out.** ${spec.callout.en}`,
    `${spec.explanation["zh-CN"]}\n\n${instance["zh-CN"]}\n\n> **注意。** ${spec.callout["zh-CN"]}`,
  );

/** answerSolution works a judged answer: what to answer, a good answer, and a check against what the question asks. */
const answerSolution = (spec: ModernAnswersSpec, model: string): Text =>
  t(
    `**Step 1: find what to answer.** ${spec.plan.en}\n\n**Step 2: write it.** One good answer:\n\n${quote(model)}\n\n**Check.** ${spec.check.en}`,
    `**第一步：想清楚答什么。**${spec.plan["zh-CN"]}\n\n**第二步：写下来。**一个好的答案：\n\n${quote(model)}\n\n**检验。** ${spec.check["zh-CN"]}`,
  );

/** choicePoint builds a knowledge point of choice questions, each asked with two of its wrong options in three rounds. */
function choicePoint(
  id: string,
  spec: ModernPointSpec,
  passages: readonly ModernPassage[],
  pick: (p: ModernPassage) => readonly ModernChoice[],
) {
  const items = passages.flatMap((p) => pick(p).map((q) => ({ p, q })));
  for (const { p, q } of items) {
    if (new Set([q.right, ...q.wrong]).size !== 4) throw new Error(`${id}: the options of ${q.ask}`);
    explainedChoice(id, p, q);
  }
  const bank = PAIRS.flatMap(([a, b]) => items.map(({ p, q }) => ({ p, q, shown: [a, b] as const })));
  const generate = (rng: Rng): Problem => {
    const { p, q, shown } = rng.cycle(bank);
    const options = rng.shuffle([q.right, ...shown.map((i) => q.wrong[i])]);
    const answer = options.indexOf(q.right);
    return {
      prompt: joinText([spec.question, same(quote(`${shownPassage(p)}\n\n${q.ask}`))]),
      answer: { checker: "choice", expected: answer, input: { kind: "choice", options: options.map((o) => same(o)) } },
      solution: choiceSolution(q, shown),
      canonical: String(answer),
      wrong: [],
      mistakes: shown.map((i) => ({ response: String(options.indexOf(q.wrong[i])), feedback: whyNot(q, i) })),
    };
  };
  const first = items[0]!;
  return point(id, spec.title, explained(spec, choiceInstance(first.p, first.q)), generate);
}

/** answerGenerator picks a question by seed; the learner answers in a few sentences that a model judges against the passage. */
function answerGenerator(spec: ModernAnswersSpec, passages: readonly ModernPassage[], criteria: readonly string[]): Generator {
  const question = spec.question;
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
      solution: answerSolution(spec, a.model),
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
    const [min, max] = spec.length ?? [800, 2000];
    if (length < min || length > max) throw new Error(`${reading}: 《${p.title}》 has ${length} characters, not ${min} to ${max}`);
    for (const a of p.answers) {
      const n = [...a.model].filter((ch) => /\p{Script=Han}/u.test(ch)).length;
      if (n < ANSWER_LIMITS.minWords || n > 200) throw new Error(`${answers}: the model of ${a.ask} has ${n} characters, not 30 to 200`);
    }
  }
  const first = spec.passages[0]!;
  const asked = first.understanding[0];
  const answered = first.answers[0];
  const where = whereText(asked);
  return [
    {
      id: reading,
      title: spec.title,
      summary: spec.summary,
      intro: t(
        `${spec.summary.en} Take 《${first.title}》: asked **${asked.ask}**, the right option is ${zhQuote(asked.right)}; it ${where.en}.\n\nThe first knowledge point is ${spec.understanding.title.en}; the second is ${spec.analysis.title.en}. In both, every option is taken back to the passage.`,
        `${spec.summary["zh-CN"]}比如《${first.title}》问“${asked.ask}”，正确选项是${zhQuote(asked.right)}，它${where["zh-CN"]}。\n\n第一个知识点是${spec.understanding.title["zh-CN"]}，第二个是${spec.analysis.title["zh-CN"]}。两者都要把每个选项带回原文核对。`,
      ),
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
      intro: t(
        `${spec.answersSummary.en} Take 《${first.title}》, asked **${answered.ask}**. One good answer:\n\n${quote(answered.model)}\n\nThe one knowledge point is ${spec.answers.title.en}.`,
        `${spec.answersSummary["zh-CN"]}比如《${first.title}》问“${answered.ask}”，一个好的答案是：\n\n${quote(answered.model)}\n\n本主题只有一个知识点：${spec.answers.title["zh-CN"]}。`,
      ),
      prerequisites: [reading],
      encompasses: [],
      xp: 16,
      strand: "reading",
      practiceOnly: true,
      criteria: spec.criteria.map(criterion),
      knowledgePoints: [
        point(
          answers,
          spec.answers.title,
          explained(
            spec.answers,
            t(
              `In 《${first.title}》, asked **${answered.ask}**, one good answer reads:\n\n${quote(answered.model)}`,
              `比如《${first.title}》问“${answered.ask}”，一个好的答案是：\n\n${quote(answered.model)}`,
            ),
          ),
          answerGenerator(spec.answers, spec.passages, spec.criteria),
        ),
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
      callout: t(
        "An option can copy the passage's words and still be wrong: one changed word, 都 for 有的 or 必然 for 可能, turns it. Compare the meaning, not the words shared.",
        "选项可以照抄原文的词，却仍然是错的：换掉一个词，把“有的”换成“都”，把“可能”换成“必然”，意思就变了。要比意思，不要只看相同的词。",
      ),
      question: CHOICE_QUESTION,
    },
    analysis: {
      title: t("How It Reasons", "分析论证"),
      explanation: t(
        "Questions of analysis ask how the passage makes its case: its **thesis** and the sub-points under it, its **evidence** (examples, facts, data, quotations) and its **methods** (comparison, analogy, cause and effect, refutation), and how its paragraphs **follow on** from each other. Check that an option names the method rightly and says rightly what it proves.",
        "分析题问的是文章怎样论证：**中心论点**和分论点，**论据**（事例、事实、数据、引言），**论证方法**（对比、类比、因果、驳论），以及各段之间的**思路**。检查选项是否说对了方法，又是否说对了它证明了什么。",
      ),
      callout: t(
        "A method named rightly can still be wrong in what it proves: an example used to support the second sub-point is not proof of the thesis as a whole. Check both halves of the option.",
        "论证方法说对了，证明的对象也可能说错：用来证明第二个分论点的事例，不是在证明整个中心论点。选项的前后两半都要核对。",
      ),
      question: CHOICE_QUESTION,
    },
    answers: {
      title: t("Answering in Points", "分点作答"),
      explanation: t(
        "A short answer is marked by its **points**. Read what the question asks, how many points it needs, then find each one in the passage: a reason, a condition, a consequence. Write each point as a sentence of your own, number them, and add nothing the passage does not support.",
        "简答题按**要点**给分。先看题目问什么、需要几点，再到文章里找出每一点：一个原因、一个条件、一个结果。每点用自己的话写成一句，分条列出，不加文章没有的内容。",
      ),
      callout: t(
        "A point copied out at length is not a point made: one sentence in your own words for each, and only as many as the question asks.",
        "大段照抄原文不等于答出要点：每点用自己的话写一句，题目要几点就写几点。",
      ),
      plan: t(
        "Read what the question asks and how many points it needs, then mark in the passage the sentence each point comes from: a reason, a condition, a consequence.",
        "看清题目问什么、要几点，再在文中标出每一点所在的句子：一个原因、一个条件或一个结果。",
      ),
      check: t(
        "Count the points against what the question asks, and find each one in the passage: none is missing, none is copied out at length, and nothing is added that the passage does not support.",
        "对照题目数一数要点，每一点都能在文中找到出处：没有漏掉，没有大段照抄，也没有文章不支持的内容。",
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
      callout: t(
        "A feeling must be read from the words, not brought to them: if no sentence shows the character angry or the writer longing, an option that says so is wrong, however likely it sounds.",
        "情感要从字句里读出来，不能凭想象加上去：如果没有哪一句写出人物生气或作者思念，说他生气、思念的选项就是错的，听起来再合理也不行。",
      ),
      question: CHOICE_QUESTION,
    },
    analysis: {
      title: t("Craft", "鉴赏写法"),
      explanation: t(
        "Questions of craft ask how the passage is written: **description** of setting, action, speech and mind; **narrative** devices such as clues, foreshadowing, contrast and a shift of viewpoint; and **language**, its rhetoric and its tone. A wrong option usually names a technique the passage does not use, or gives a right technique the wrong effect.",
        "鉴赏题问的是文章怎样写：环境、动作、语言、心理等**描写**；线索、伏笔、对比、视角变化等**叙述**手法；以及**语言**的修辞和风格。错误选项通常说了文章没用的手法，或者把对的手法说成了错的作用。",
      ),
      callout: t(
        "Name a technique only where the words show it: a contrast needs two things set side by side, foreshadowing needs a later event it points to. Find both in the passage before you accept the option.",
        "只有字句里确实有的手法才能说：对比要有两样东西放在一起，伏笔要有后文照应的情节。在文中找到这两样，才能认定选项是对的。",
      ),
      question: CHOICE_QUESTION,
    },
    answers: {
      title: t("Technique, Effect and Text", "手法、作用和文本"),
      explanation: t(
        "An answer on a literary text has three parts: **name** the technique or feature, **point** to the words of the passage where it is used, and **explain** its effect on the character, the feeling, the theme or the structure. An answer that names a technique and stops there gets few marks.",
        "文学类文本的简答一般有三部分：**说出**手法或特点，**指出**它在文中用在哪些语句上，**分析**它对人物、情感、主题或结构的作用。只说出手法而不分析，得分很少。",
      ),
      callout: t(
        "The effect must be this passage's effect: “it makes the writing vivid” fits any text and earns little. Say what it does to this character, this feeling or this theme.",
        "作用要说到这篇文章上：“使文章生动形象”放在哪篇都行，得分很少。要说出它对这个人物、这种情感或这个主题起了什么作用。",
      ),
      plan: t(
        "Name what the question asks about, a technique, a feature or a feeling, and mark the sentences of the passage where it is found.",
        "说出题目问的是什么，手法、特点还是情感，再在文中标出体现它的语句。",
      ),
      check: t(
        "Read the answer against its three parts: the technique named, the words of the passage pointed to, and its effect on this character, feeling or theme said, not an effect any text would have.",
        "对照三部分检查答案：说出了手法，指出了文中的语句，说明了它对这个人物、情感或主题的作用，而不是放在哪篇文章都成立的作用。",
      ),
      question: ANSWER_QUESTION,
    },
    criteria: ["zhgk-lit-technique", "zhgk-lit-effect", "zhgk-lit-grounded"],
    passages,
  };
}

/** poetrySpec is the classical poem of the paper: a poem outside the recited texts, read for its feeling and its craft. */
export function poetrySpec(prerequisites: readonly string[], passages: readonly ModernPassage[]): ModernSpec {
  return {
    id: "poetry",
    title: t("Gaokao: Classical Poems", "高考：古代诗歌阅读"),
    summary: t(
      "Read a classical poem not among the recited texts, as the paper sets it: what it shows and feels, then how it is written.",
      "按试卷的要求读一首课外的古代诗词：先看写了什么、表达了什么情感，再看是怎样写的。",
    ),
    answersTitle: t("Gaokao: Short Answers on Classical Poems", "高考：古代诗歌简答"),
    answersSummary: t(
      "Answer a question on a classical poem in a few sentences, judged by a model: the technique, its effect, and the words of the poem that show it.",
      "用几句话回答古代诗歌的问题，由 AI 评判：答出手法和作用，并联系诗句。",
    ),
    prerequisites,
    understanding: {
      title: t("Content and Feeling", "理解内容和情感"),
      explanation: t(
        "First read the title, the author and the period, and any note: they often name the occasion, a parting, a journey, a visit or a festival. Then find the **images** of each line and the **feeling** they carry. A wrong option often misreads a line, or gives the poet a feeling of the wrong kind, joy for grief or resentment for calm.",
        "先读标题、作者和时代，以及注释：它们常常点明写作的缘由，送别、行旅、登临或节日。再找出每一句的**意象**和它们寄托的**情感**。错误选项常常把诗句理解错，或者把情感说反，把悲说成喜，把闲适说成怨愤。",
      ),
      callout: t(
        "A bright scene does not always carry a bright feeling: a poem can set spring flowers against grief. Read the feeling from the whole poem, its title and its last line, before you judge an option.",
        "明丽的景色不一定寄托欢快的情感：诗人可以用春花反衬悲伤。判断选项前，要结合标题和末句，从整首诗读出情感。",
      ),
      question: CHOICE_QUESTION,
    },
    analysis: {
      title: t("Craft", "鉴赏手法"),
      explanation: t(
        "Questions of craft ask how the poem is made: **description** (motion and stillness, sound and sight, near and far), **expression** (feeling through scene, the scene set against the feeling, allusion, reasoning through things), **rhetoric** (personification, metaphor, exaggeration, contrast), and **structure** (an opening that sets the tone, a turn, an ending that leaves the feeling open). Check both that the technique is used and that its effect is stated rightly.",
        "鉴赏题问的是诗怎样写：**描写**（动静、声色、远近），**表达方式**（借景抒情、以乐景写哀情、用典、托物言志），**修辞**（拟人、比喻、夸张、对比），以及**结构**（起句定调、转折、以景结情）。既要核对诗中是否用了这种手法，也要核对作用是否说对。",
      ),
      callout: t(
        "A personification needs a thing that acts like a person, an allusion needs a story behind the words: name a device only when the line shows it.",
        "拟人要有像人一样行动的事物，用典要有字面背后的故事：诗句里确实有，才能说用了这种手法。",
      ),
      question: CHOICE_QUESTION,
    },
    answers: {
      title: t("Technique, Effect and Lines", "手法、作用和诗句"),
      explanation: t(
        "An answer on a poem has three parts: **name** the technique or feeling, **point** to the lines and images where it is found, and **explain** what it does: the scene it builds, the feeling it carries, or the way it closes the poem.",
        "古代诗歌的简答一般有三部分：**说出**手法或情感，**指出**体现它的诗句和意象，**分析**它的作用：营造了怎样的画面，寄托了怎样的情感，或怎样收束全诗。",
      ),
      callout: t(
        "Quote the line, do not only name it: an answer on 以景结情 that never says which scene ends the poem has not shown it.",
        "要引出诗句，不能只说手法名称：答“以景结情”却不说是哪一句景物收束全诗，就没有答到点上。",
      ),
      plan: t(
        "Name what the question asks about, a technique or a feeling, and mark the lines and images of the poem where it is found.",
        "说出题目问的是手法还是情感，再标出体现它的诗句和意象。",
      ),
      check: t(
        "Read the answer against its three parts: the technique or feeling named, the lines quoted, and what it does in this poem, the scene, the feeling or the close, said.",
        "对照三部分检查答案：说出了手法或情感，引出了诗句，说明了它在这首诗里的作用：画面、情感或收束。",
      ),
      question: t(
        "Read the poem, then answer the question below in Chinese, in a few sentences.",
        "阅读下面的诗词，然后用中文回答问题，写几句话。",
      ),
    },
    criteria: ["zhgk-lit-technique", "zhgk-lit-effect", "zhgk-lit-grounded"],
    passages,
    length: [20, 300],
  };
}
