// Whole books (docs/chinese-curriculum.md §9): a grade's whole book is read outside the app, in print, and checked here by
// a topic of questions written for this subject, on its story, its people and what it means. The books are works in the
// public domain that the national standard's reading lists name; the questions quote none of their text at length and
// copy no textbook's or test's questions.

import { joinText, type Problem, type Rng, same, type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-chinese";

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

/** bookId is the id of a book's topic. */
export const bookId = (id: string): string => `book-${id}`;

/** bookTopic builds the topic of a book; it needs the given topic of its grade. */
function bookTopic(book: BookData, after: string): TopicDef {
  const id = bookId(book.id);
  const questions = parseQuestions(id, book.questions);
  const name = `《${book.title.zh}》`;
  const bank = questions.map((q) => (rng: Rng): Problem => {
    const options = rng.shuffle([q.right, ...q.wrong]).map(same);
    const answer = options.findIndex((o) => o.en === q.right);
    return {
      prompt: joinText([same(name), same(q.ask)]),
      answer: { checker: "choice", expected: answer, input: { kind: "choice", options } },
      solution: t(`${q.ask} ${q.right}`, `${q.ask}${q.right}`),
      canonical: String(answer),
      wrong: options.map((_, i) => String(i)).filter((i) => i !== String(answer)),
    };
  });
  return {
    id,
    title: t(`Whole Book: ${book.title.en}`, `整本书阅读：${name}`),
    summary: t(
      `${book.title.en} by ${book.author.en}, read in print, then questions on its story, its people and what it means.`,
      `阅读${book.author.zh}的${name}纸质书，再回答关于它的情节、人物和意义的问题。`,
    ),
    prerequisites: [after],
    encompasses: [],
    xp: 15,
    practiceOnly: true,
    strand: "reading",
    knowledgePoints: [
      point(`${id}-questions`, t(`Reading ${book.title.en}`, `读${name}`), t(book.guide.en, book.guide.zh), fromBank(bank)),
    ],
  };
}

/** bookTopics are the topics of the whole books, by grade, each needing the grade's first word batch. */
export const bookTopics: readonly { readonly grade: number; readonly topic: TopicDef }[] = bookData.map((b) => ({
  grade: b.grade,
  topic: bookTopic(b, `words-${b.grade}-01`),
}));
