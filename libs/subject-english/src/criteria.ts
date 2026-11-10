import type { CriterionSpec } from "@ga/content";

/** WRITING_CRITERIA are the criteria of the first writing levels of docs/english-curriculum.md §8.1: W2 meaning checks, W4 paragraphs and the moves of W5 essays, with starting questions to be calibrated. */
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
  {
    id: "w5-thesis-position",
    version: "1",
    question: "Does the sentence take a clear side on the question, one that a reasonable person could disagree with?",
    quoteWhenMet: true,
  },
  {
    id: "w5-thesis-reasons",
    version: "1",
    question: "Does the sentence name at least one main reason for its position?",
    quoteWhenMet: true,
  },
  {
    id: "w5-outline-thesis",
    version: "1",
    question: "Does the outline begin with a thesis that takes a clear side on the question?",
    quoteWhenMet: true,
  },
  {
    id: "w5-outline-reasons",
    version: "1",
    question: "Does the outline list at least two different reasons, each of which supports the thesis?",
    quoteWhenMet: false,
  },
  {
    id: "w5-outline-evidence",
    version: "1",
    question: "Does every reason in the outline have evidence or an example under it?",
    quoteWhenMet: false,
  },
  {
    id: "w5-uses-source",
    version: "1",
    question: "Does the paragraph quote or closely paraphrase evidence from the source passage?",
    quoteWhenMet: true,
  },
  {
    id: "w5-explains-evidence",
    version: "1",
    question: "Does the paragraph explain how its evidence supports its point, rather than only repeating the evidence?",
    quoteWhenMet: true,
  },
  {
    id: "w5-states-counterclaim",
    version: "1",
    question: "Does the paragraph fairly state a view that opposes the essay's claim?",
    quoteWhenMet: true,
  },
  {
    id: "w5-rebuts",
    version: "1",
    question: "Does the paragraph answer the opposing view with a reason or evidence for why the essay's claim still holds?",
    quoteWhenMet: true,
  },
  {
    id: "w5-intro-hook",
    version: "1",
    question:
      "Does the introduction open with something meant to interest the reader, such as a striking fact, a short scene or a question, rather than announcing the essay?",
    quoteWhenMet: true,
  },
  {
    id: "w5-intro-thesis",
    version: "1",
    question: "Does the introduction end with a thesis that states the position the essay will argue?",
    quoteWhenMet: true,
  },
  {
    id: "w5-conclusion-restates",
    version: "1",
    question: "Does the conclusion restate the thesis in different words rather than copying it?",
    quoteWhenMet: true,
  },
  {
    id: "w5-conclusion-final-thought",
    version: "1",
    question: "Does the conclusion end with a final thought, such as why the issue matters or what should happen next?",
    quoteWhenMet: true,
  },
  {
    id: "w5-literary-claim",
    version: "1",
    question:
      "Does the paragraph open with a claim about the passage's meaning or the writer's craft, rather than only retelling what happens?",
    quoteWhenMet: true,
  },
  {
    id: "w5-revision-fixes",
    version: "1",
    question: "Does the revision fix the problem that the task names in the draft?",
    quoteWhenMet: false,
  },
  {
    id: "w5-revision-keeps-point",
    version: "1",
    question: "Does the revision keep the main point of the original draft?",
    quoteWhenMet: false,
  },
];

/** criterionById finds a criterion of WRITING_CRITERIA, or undefined. */
export function criterionById(id: string): CriterionSpec | undefined {
  return WRITING_CRITERIA.find((c) => c.id === id);
}
