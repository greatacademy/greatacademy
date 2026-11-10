// Helpers of the exam courses. An exam topic teaches nothing new: it asks what topics already in the graph teach, in
// the formats of a test, so it is practice-only, as the exam topics of mathematics are. A learner meets its
// explanations only after failing its practice.

import {
  type CriterionSpec,
  type EncompassingDef,
  type Generator,
  joinText,
  type KnowledgePointDef,
  type Problem,
  type Rng,
  same,
  type Text,
  type TopicDef,
  t,
} from "@ga/content";
import { criterionById, point, type WritingItem, type WritingLimits, writingGenerator } from "@ga/subject-english";
import type { Strand } from "../pack.ts";

/** examGroup is the shelf of the exam courses. */
export const examGroup = t("English Exams", "英语考试");

/** criterion finds a writing criterion by id, failing for an unknown one. */
export function criterion(id: string): CriterionSpec {
  const found = criterionById(id);
  if (!found) throw new Error(`unknown criterion ${id}`);
  return found;
}

/** ExamTopicSpec is what an exam topic judged by rules is made of: two knowledge points of rising difficulty. */
export interface ExamTopicSpec {
  readonly id: string;
  readonly title: Text;
  readonly summary: Text;
  readonly strand: Strand;
  readonly prerequisites: readonly string[];
  readonly encompasses: readonly EncompassingDef[];
  readonly xp: number;
  readonly points: readonly [KnowledgePointDef, KnowledgePointDef];
}

/** examTopic builds a practice-only topic judged by rules. */
export function examTopic(spec: ExamTopicSpec): TopicDef {
  return {
    id: spec.id,
    title: spec.title,
    summary: spec.summary,
    strand: spec.strand,
    prerequisites: spec.prerequisites,
    encompasses: spec.encompasses,
    xp: spec.xp,
    practiceOnly: true,
    knowledgePoints: spec.points,
  };
}

/** JudgedExamSpec is what an exam writing topic judged by a model is made of: one knowledge point and at least 12 tasks. */
export interface JudgedExamSpec {
  readonly id: string;
  readonly title: Text;
  readonly summary: Text;
  readonly prerequisites: readonly string[];
  readonly encompasses: readonly EncompassingDef[];
  readonly criteria: readonly string[];
  readonly point: { readonly id: string; readonly title: Text; readonly explanation: Text };
  readonly question: Text;
  readonly bank: readonly WritingItem[];
  readonly limits: WritingLimits;
  readonly xp: number;
  /** what names the kind of text in the solution, such as an essay. */
  readonly what: Text;
}

/** quote shows a text as a block quote, every line of it. */
export const quote = (text: string) => `> ${text.replace(/\n/gu, "\n> ")}`;

/** judgedExamTopic builds a practice-only writing topic judged by a model against criteria of the exams. */
export function judgedExamTopic(spec: JudgedExamSpec): TopicDef {
  if (spec.bank.length < 12) throw new Error(`${spec.id}: fewer than 12 tasks`);
  return {
    id: spec.id,
    title: spec.title,
    summary: spec.summary,
    strand: "writing",
    prerequisites: spec.prerequisites,
    encompasses: spec.encompasses,
    xp: spec.xp,
    practiceOnly: true,
    criteria: spec.criteria.map(criterion),
    knowledgePoints: [
      point(
        spec.point.id,
        spec.point.title,
        spec.point.explanation,
        writingGenerator(spec.question, spec.bank, spec.criteria, spec.limits, (model) =>
          t(`One good ${spec.what.en}:\n\n${quote(model)}`, `一篇好的${spec.what["zh-CN"]}：\n\n${quote(model)}`),
        ),
      ),
    ],
  };
}

/** LabelledItem is one item whose options are a fixed list of labels, as in True/False/Not given: what to show, the right label and its solution. */
export interface LabelledItem {
  readonly shown: string;
  readonly right: number;
  readonly solution: Text;
}

/**
 * labelGenerator asks a question whose options are the same labels in the same order every time, as the tests print
 * them; the bank must spread its right labels so that no position is right too often.
 */
export function labelGenerator(question: Text, labels: readonly string[], bank: readonly LabelledItem[]): Generator {
  return (rng: Rng): Problem => {
    const item = rng.cycle(bank);
    return {
      prompt: joinText([question, same(quote(item.shown))]),
      answer: { checker: "choice", expected: item.right, input: { kind: "choice", options: labels.map(same) } },
      solution: item.solution,
      canonical: String(item.right),
      wrong: labels.map((_, i) => String(i)).filter((i) => i !== String(item.right)),
    };
  };
}

/** interleave takes one item of each list in turn, so that a bank cycled by seed moves between texts and kinds. */
export function interleave<T>(lists: readonly (readonly T[])[]): readonly T[] {
  const out: T[] = [];
  const longest = Math.max(0, ...lists.map((l) => l.length));
  for (let i = 0; i < longest; i++) for (const list of lists) if (i < list.length) out.push(list[i] as T);
  return out;
}

/** SolvedChoice is one bank item of a choice whose solution is written for it: what to show, the right option, the wrong ones and the solution. */
export interface SolvedChoice {
  readonly shown: string;
  readonly right: string;
  readonly wrong: readonly string[];
  readonly solution: Text;
}

/** solvedChoiceGenerator picks an item of a bank by seed and shuffles its options; each item brings its own solution. */
export function solvedChoiceGenerator(question: Text, bank: readonly SolvedChoice[]): Generator {
  return (rng: Rng): Problem => {
    const item = rng.cycle(bank);
    const options = rng.shuffle([item.right, ...item.wrong]);
    const answer = options.indexOf(item.right);
    return {
      prompt: item.shown === "" ? question : joinText([question, same(quote(item.shown))]),
      answer: { checker: "choice", expected: answer, input: { kind: "choice", options: options.map(same) } },
      solution: item.solution,
      canonical: String(answer),
      wrong: options.map((_, i) => String(i)).filter((i) => i !== String(answer)),
    };
  };
}

/** ReplyItem is one bank item of Build a Sentence: what another speaker said, and the reply in chunks in a right order. */
export interface ReplyItem {
  readonly said: string;
  /** chunks are the words and phrases of the reply in a right order, without the final mark. */
  readonly chunks: readonly string[];
  /** end is the mark that ends the reply. */
  readonly end: "." | "?";
  /** alsoRight lists further right orders, as indexes into chunks. */
  readonly alsoRight?: readonly (readonly number[])[];
}

/** sentenceOf writes chunks in an order as a sentence, with a capital first letter and its final mark. */
export function sentenceOf(chunks: readonly string[], end: string): string {
  const text = chunks.join(" ");
  return `${text.charAt(0).toUpperCase()}${text.slice(1)}${end}`;
}

/**
 * replyGenerator shows what another speaker said and the chunks of a reply in a shuffled order, never already in a
 * right order; the learner puts them in order.
 */
export function replyGenerator(question: Text, bank: readonly ReplyItem[]): Generator {
  return (rng: Rng): Problem => {
    const item = rng.cycle(bank);
    const rightOrders = [item.chunks.map((_, i) => i), ...(item.alsoRight ?? [])];
    const isRight = (order: readonly number[]) => rightOrders.some((o) => o.join() === order.join());
    let shuffled = rng.shuffle(item.chunks.map((_, i) => i));
    // A rotation of a right order keeps the chunks out of order, so this ends after one pass.
    for (let tries = 0; isRight(shuffled) && tries < item.chunks.length; tries++) shuffled = [...shuffled.slice(1), shuffled[0] as number];
    const expected = rightOrders.map((order) => order.map((original) => shuffled.indexOf(original)));
    const reply = sentenceOf(item.chunks, item.end);
    return {
      prompt: joinText([question, same(quote(`**A:** ${item.said}\n\n**B:** …${item.end === "?" ? "?" : ""}`))]),
      answer: {
        checker: "order",
        expected: expected.map((o) => [...o]),
        input: { kind: "order", items: shuffled.map((i) => same(item.chunks[i] as string)) },
      },
      solution: t(`A good reply:\n\n${quote(reply)}`, `合适的回答：\n\n${quote(reply)}`),
      canonical: (expected[0] as number[]).join(","),
      wrong: isRight(shuffled) ? [] : [shuffled.map((_, i) => i).join(",")],
    };
  };
}
