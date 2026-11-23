// Whole books (docs/chinese-curriculum.md §9): a grade's whole book is read outside the app, in print, and checked here by
// a topic of questions written for this subject, on its story, its people and what it means. The books are works in the
// public domain that the national standard's reading lists name; the questions quote none of their text at length and
// copy no textbook's or test's questions.

import { joinText, type Problem, type Rng, same, type Text, type TopicDef, t } from "@ga/content";
import { point, zhQuote } from "@ga/subject-chinese";

import { fromBank } from "../level-1/listening.ts";
import { books as bookData } from "./data.ts";

/** MIN_QUESTIONS is how many questions a book needs. */
const MIN_QUESTIONS = 30;

/** OPTIONS is how many answers a question offers. */
const OPTIONS = 4;

/** BookData is a book as written: who wrote it, its grade, what to read for, and its questions. */
export interface BookData {
  /** id ends the topic's id, book-<id>. */
  readonly id: string;
  readonly grade: number;
  readonly title: { readonly en: string; readonly zh: string };
  readonly author: { readonly en: string; readonly zh: string };
  /** guide says how to read the book, the explanation of its knowledge point. */
  readonly guide: { readonly en: string; readonly zh: string };
  /** callout is the warning the explanation ends with: the mix-up this book's questions invite. */
  readonly callout: { readonly en: string; readonly zh: string };
  /** questions are blocks of 问：, 答： and three 错： lines, separated by blank lines. */
  readonly questions: string;
}

/** Question is a question on a book with its right answer and three wrong ones. */
interface Question {
  readonly ask: string;
  readonly right: string;
  readonly wrong: readonly string[];
}

/** parseQuestions reads blocks of a question, its answer and its wrong answers. */
export function parseQuestions(where: string, data: string): readonly Question[] {
  const out = data
    .split(/\n\s*\n/u)
    .map((b) => b.trim())
    .filter((b) => b !== "")
    .map((block): Question => {
      let ask = "";
      let right = "";
      const wrong: string[] = [];
      for (const raw of block.split("\n")) {
        const line = raw.trim();
        const tag = line.slice(0, 2);
        const body = line.slice(2).trim();
        if (body === "") throw new Error(`${where}: an empty line ${line}`);
        if (tag === "问：" && ask === "") ask = body;
        else if (tag === "答：" && right === "") right = body;
        else if (tag === "错：") wrong.push(body);
        else throw new Error(`${where}: the line ${line} is out of place`);
      }
      if (ask === "" || right === "" || wrong.length !== OPTIONS - 1)
        throw new Error(`${where}: ${block.slice(0, 20)} needs a question, an answer and ${OPTIONS - 1} wrong ones`);
      if (new Set([right, ...wrong]).size !== OPTIONS) throw new Error(`${where}: ${ask} repeats an answer`);
      return { ask, right, wrong };
    });
  if (new Set(out.map((q) => q.ask)).size !== out.length) throw new Error(`${where}: a question is asked twice`);
  if (out.length < MIN_QUESTIONS) throw new Error(`${where}: ${out.length} questions, needs ${MIN_QUESTIONS}`);
  return out;
}

/** told is a question with its answer, said whole. */
const told = (q: Question): string => `${q.ask.replace(/[？?]$/u, "")}——${q.right}`;

/** notTold gives a wrong answer its reason: it is not what the book tells, which is the right answer. */
const notTold = (name: string, q: Question, wrong: string): Text =>
  t(
    `${zhQuote(wrong)} is not what the book tells: there, ${zhQuote(told(q))}.`,
    `${zhQuote(wrong)}不是${name}里写的：书里是${zhQuote(told(q))}。`,
  );

/** bookSolution works a question on a book: the part of the book it is about, the answer, each other answer's reason, a check. */
function bookSolution(name: string, q: Question, others: readonly string[]): Text {
  const reasons = others.map((w) => notTold(name, q, w));
  return t(
    `**Step 1: find the part of the book.** The question is ${zhQuote(q.ask)}. Recall the chapter, tale or person of the book it is about before you look at the answers.\n\n**Step 2: answer from the book.** There, ${zhQuote(told(q))}: the answer is ${zhQuote(q.right)}.\n\n${reasons.map((r) => r.en).join("\n\n")}\n\n**Check.** Say the question and the answer together, ${zhQuote(told(q))}, and set it against what happens in the book: it agrees, and it answers this question, not one about another part of the book.`,
    `**第一步：找到书里的那一部分。**题目是${zhQuote(q.ask)}。先回想它说的是${name}的哪一章、哪个故事或哪个人物，再看选项。\n\n**第二步：按书里的内容作答。**书里是${zhQuote(told(q))}，答案是${zhQuote(q.right)}。\n\n${reasons.map((r) => r["zh-CN"]).join("\n\n")}\n\n**检验。** 把问题和答案连起来说一遍：${zhQuote(told(q))}。和书里的情节对照，是一致的，而且回答的正是这个问题，不是书里另一部分的问题。`,
  );
}

/** bookId is the id of a book's topic. */
export const bookId = (id: string): string => `book-${id}`;

/** bookTopic builds the topic of a book; it needs the given topic of its grade. */
function bookTopic(book: BookData, after: string): TopicDef {
  const id = bookId(book.id);
  const questions = parseQuestions(id, book.questions);
  const name = `《${book.title.zh}》`;
  const first = questions[0]!;
  const bank = questions.map((q) => (rng: Rng): Problem => {
    const options = rng.shuffle([q.right, ...q.wrong]).map(same);
    const answer = options.findIndex((o) => o.en === q.right);
    return {
      prompt: joinText([same(name), same(q.ask)]),
      answer: { checker: "choice", expected: answer, input: { kind: "choice", options } },
      solution: bookSolution(name, q, q.wrong),
      canonical: String(answer),
      wrong: [],
      mistakes: q.wrong.map((w) => ({ response: String(options.findIndex((o) => o.en === w)), feedback: notTold(name, q, w) })),
    };
  });
  return {
    id,
    title: t(`Whole Book: ${book.title.en}`, `整本书阅读：${name}`),
    summary: t(
      `${book.title.en} by ${book.author.en}, read in print, then questions on its story, its people and what it means.`,
      `阅读${book.author.zh}的${name}纸质书，再回答关于它的情节、人物和意义的问题。`,
    ),
    intro: t(
      `${book.title.en}, by ${book.author.en}, is read in print, outside the app; here come questions on its story, its people and what it means. Asked ${zhQuote(first.ask)}, you answer ${zhQuote(first.right)}.\n\nThe one knowledge point is the reading of ${book.title.en}: every question is answered from the book, not from what sounds likely.`,
      `${book.author.zh}的${name}要读纸质书，在应用外读完；这里回答关于它的情节、人物和意义的问题。比如问${zhQuote(first.ask)}，答案是${zhQuote(first.right)}。\n\n本主题只有一个知识点：读${name}。每道题都要按书里的内容回答，而不是凭感觉。`,
    ),
    prerequisites: [after],
    encompasses: [],
    xp: 15,
    practiceOnly: true,
    strand: "reading",
    knowledgePoints: [
      point(
        `${id}-questions`,
        t(`Reading ${book.title.en}`, `读${name}`),
        t(
          `${book.guide.en}\n\nFor instance, asked ${zhQuote(first.ask)}, the book answers ${zhQuote(first.right)}; ${notTold(name, first, first.wrong[0]!).en}\n\n> **Watch out.** ${book.callout.en}`,
          `${book.guide.zh}\n\n比如问${zhQuote(first.ask)}，书里的答案是${zhQuote(first.right)}；${notTold(name, first, first.wrong[0]!)["zh-CN"]}\n\n> **注意。** ${book.callout.zh}`,
        ),
        fromBank(bank),
      ),
    ],
  };
}

/** bookTopics are the topics of the whole books, by grade, each needing the grade's first word batch. */
export const bookTopics: readonly { readonly grade: number; readonly topic: TopicDef }[] = bookData.map((b) => ({
  grade: b.grade,
  topic: bookTopic(b, `words-${b.grade}-01`),
}));
