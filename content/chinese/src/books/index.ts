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
  /**
   * questions are blocks separated by blank lines: 问： the question, 答： the answer, 据： where the book answers it, three
   * 错： lines each with its own reason, and 验： a check from another angle. 据 and 验 hold Chinese || English; each 错
   * holds the wrong answer || its reason in Chinese || in English. All are written by hand.
   */
  readonly questions: string;
}

/** Question is a question on a book with its answer, its ground, three wrong answers with their reasons, and a check. */
interface Question {
  readonly ask: string;
  readonly right: string;
  readonly ground: Text;
  readonly wrong: readonly string[];
  readonly reasons: readonly Text[];
  readonly check: Text;
}

/** bilingual splits a line of Chinese || English into a text, failing when either half is missing. */
function bilingual(where: string, body: string): Text {
  const [zh, en, ...rest] = body.split("||").map((x) => x.trim());
  if (!zh || !en || rest.length > 0) throw new Error(`${where}: ${body.slice(0, 30)} needs Chinese || English`);
  return t(en, zh);
}

/** parseQuestions reads blocks of a question, its answer, its ground, its wrong answers with their reasons and its check. */
export function parseQuestions(where: string, data: string): readonly Question[] {
  const out = data
    .split(/\n\s*\n/u)
    .map((b) => b.trim())
    .filter((b) => b !== "")
    .map((block): Question => {
      let ask = "";
      let right = "";
      let ground: Text | undefined;
      let check: Text | undefined;
      const wrong: string[] = [];
      const reasons: Text[] = [];
      for (const raw of block.split("\n")) {
        const line = raw.trim();
        const tag = line.slice(0, 2);
        const body = line.slice(2).trim();
        if (body === "") throw new Error(`${where}: an empty line ${line}`);
        if (tag === "问：" && ask === "") ask = body;
        else if (tag === "答：" && right === "") right = body;
        else if (tag === "据：" && !ground) ground = bilingual(where, body);
        else if (tag === "验：" && !check) check = bilingual(where, body);
        else if (tag === "错：") {
          const [w, ...why] = body.split("||");
          wrong.push(w!.trim());
          reasons.push(bilingual(where, why.join("||")));
        } else throw new Error(`${where}: the line ${line} is out of place`);
      }
      if (ask === "" || right === "" || wrong.length !== OPTIONS - 1)
        throw new Error(`${where}: ${block.slice(0, 20)} needs a question, an answer and ${OPTIONS - 1} wrong ones`);
      if (!ground || !check) throw new Error(`${where}: ${ask} needs its ground and its check, written by hand`);
      if (new Set([right, ...wrong]).size !== OPTIONS) throw new Error(`${where}: ${ask} repeats an answer`);
      if (new Set(reasons.map((r) => r["zh-CN"])).size !== reasons.length) throw new Error(`${where}: ${ask} gives one reason twice`);
      if (check["zh-CN"] === ground["zh-CN"]) throw new Error(`${where}: ${ask} checks by repeating its ground`);
      return { ask, right, ground, wrong, reasons, check };
    });
  if (new Set(out.map((q) => q.ask)).size !== out.length) throw new Error(`${where}: a question is asked twice`);
  if (out.length < MIN_QUESTIONS) throw new Error(`${where}: ${out.length} questions, needs ${MIN_QUESTIONS}`);
  return out;
}

/** whyNot is a wrong answer with its own reason. */
const whyNot = (q: Question, i: number): Text =>
  t(`${zhQuote(q.wrong[i]!)} is wrong: ${q.reasons[i]!.en}`, `${zhQuote(q.wrong[i]!)}不对：${q.reasons[i]!["zh-CN"]}`);

/** bookSolution works a question on a book: where the book answers it, the answer, each wrong answer's reason, a check. */
function bookSolution(q: Question): Text {
  const reasons = q.wrong.map((_, i) => whyNot(q, i));
  return t(
    `**Step 1: find the part of the book.** ${q.ground.en}\n\n**Step 2: answer from it.** The answer is ${zhQuote(q.right)}.\n\n${reasons.map((r) => r.en).join("\n\n")}\n\n**Check.** ${q.check.en}`,
    `**第一步：找到书里的那一部分。**${q.ground["zh-CN"]}\n\n**第二步：按书里的内容作答。**答案是${zhQuote(q.right)}。\n\n${reasons.map((r) => r["zh-CN"]).join("\n\n")}\n\n**检验。** ${q.check["zh-CN"]}`,
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
      solution: bookSolution(q),
      canonical: String(answer),
      wrong: [],
      mistakes: q.wrong.map((w, i) => ({ response: String(options.findIndex((o) => o.en === w)), feedback: whyNot(q, i) })),
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
          `${book.guide.en}\n\nFor instance, asked ${zhQuote(first.ask)}, the book answers ${zhQuote(first.right)}: ${first.ground.en} ${whyNot(first, 0).en}\n\n> **Watch out.** ${book.callout.en}`,
          `${book.guide.zh}\n\n比如问${zhQuote(first.ask)}，书里的答案是${zhQuote(first.right)}：${first.ground["zh-CN"]}${whyNot(first, 0)["zh-CN"]}\n\n> **注意。** ${book.callout.zh}`,
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
