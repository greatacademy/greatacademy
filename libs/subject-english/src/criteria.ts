import type { CriterionSpec } from "@ga/content";

/** WRITING_CRITERIA are the criteria of the first writing levels of docs/english-curriculum.md §8.1: W2 meaning checks and W4 paragraphs, with starting questions to be calibrated. */
export const WRITING_CRITERIA: readonly CriterionSpec[] = [
  {
    id: "w2-keeps-meaning",
    version: "1",
    question: "Does the rewritten sentence keep the meaning of the original sentences, with nothing important lost or added?",
    quoteWhenMet: false,
  },
  {
    id: "w2-one-sentence",
    version: "1",
    question: "Is the response a single complete sentence, rather than the original sentences copied one after another?",
    quoteWhenMet: false,
  },
  {
    id: "w2-because-reason",
    version: "1",
    question: "After the word because, does the sentence give a reason that actually explains the first part?",
    quoteWhenMet: true,
  },
  {
    id: "w2-but-contrast",
    version: "1",
    question: "After the word but, does the sentence give something that contrasts with or limits the first part?",
    quoteWhenMet: true,
  },
  {
    id: "w2-so-result",
    version: "1",
    question: "After the word so, does the sentence give a result or consequence of the first part?",
    quoteWhenMet: true,
  },
  {
    id: "w4-topic-sentence",
    version: "1",
    question: "Does the paragraph open with a sentence that states its main point?",
    quoteWhenMet: true,
  },
  {
    id: "w4-supports-point",
    version: "1",
    question: "Does every sentence after the first support or explain the main point?",
    quoteWhenMet: false,
  },
  {
    id: "w4-gives-detail",
    version: "1",
    question: "Does the paragraph give at least one specific detail, example or fact, rather than only general statements?",
    quoteWhenMet: true,
  },
  {
    id: "w4-concludes",
    version: "1",
    question: "Does the paragraph end with a sentence that closes or sums up its point?",
    quoteWhenMet: true,
  },
  {
    id: "w4-states-opinion",
    version: "1",
    question: "Does the paragraph open with a sentence that clearly states the writer's opinion?",
    quoteWhenMet: true,
  },
  {
    id: "w4-gives-reasons",
    version: "1",
    question: "Does the paragraph give at least two different reasons that support its opinion?",
    quoteWhenMet: false,
  },
  {
    id: "w4-in-order",
    version: "1",
    question: "Are the steps or events of the paragraph told in an order that makes sense?",
    quoteWhenMet: false,
  },
  {
    id: "w4-uses-transitions",
    version: "1",
    question: "Does the paragraph use transition words or phrases, such as first, next, then or finally, to connect its steps or ideas?",
    quoteWhenMet: true,
  },
  {
    id: "w4-answers-prompt",
    version: "1",
    question: "Does the paragraph answer the task it was written for?",
    quoteWhenMet: false,
  },
];

/** criterionById finds a criterion of WRITING_CRITERIA, or undefined. */
export function criterionById(id: string): CriterionSpec | undefined {
  return WRITING_CRITERIA.find((c) => c.id === id);
}
