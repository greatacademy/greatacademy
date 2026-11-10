import type { CriterionSpec } from "@ga/content";

/** EXAM_CRITERIA are the criteria of the writing topics of the exam courses (IELTS, TOEFL, Cambridge First, Gaokao), with starting questions to be calibrated. */
export const EXAM_CRITERIA: readonly CriterionSpec[] = [
  // IELTS Writing Task 1: a report on a table or chart.
  {
    id: "ielts-t1-overview",
    version: "1",
    question:
      "Does the response include an overview: a sentence or two that states the main trends, the biggest differences or the most important features of the data, rather than only listing figures?",
    quoteWhenMet: true,
  },
  {
    id: "ielts-t1-key-features",
    version: "1",
    question:
      "Does the response report the key features of the data with figures that match the data given in the task, without misreading any number it mentions?",
    quoteWhenMet: false,
  },
  {
    id: "ielts-t1-comparisons",
    version: "1",
    question:
      "Does the response compare figures where the data invites it, such as the largest and smallest or two years, rather than describing each figure on its own?",
    quoteWhenMet: true,
  },
  {
    id: "ielts-t1-objective",
    version: "1",
    question:
      "Does the response report only what the data shows, without giving the writer's opinions or reasons for the figures that the task does not provide?",
    quoteWhenMet: false,
  },
  // IELTS Writing Task 2: an essay.
  {
    id: "ielts-t2-all-parts",
    version: "1",
    question:
      "Does the essay answer every part of the question, such as both views when it asks to discuss both, or both the causes and the solutions when it asks for both?",
    quoteWhenMet: false,
  },
  {
    id: "ielts-t2-position",
    version: "1",
    question:
      "Does the essay present a clear position on the question, in the introduction or early in the essay, and keep the same position to the end?",
    quoteWhenMet: true,
  },
  {
    id: "ielts-t2-developed",
    version: "1",
    question:
      "Is each main idea of the essay explained and supported with a reason, an example or a consequence, rather than only stated or listed?",
    quoteWhenMet: false,
  },
  // IELTS: both tasks.
  {
    id: "ielts-organized",
    version: "1",
    question:
      "Is the response organized in paragraphs, each with one central point, with ideas linked by appropriate linking words and references so that a reader can follow it?",
    quoteWhenMet: false,
  },
  // TOEFL Writing: an email.
  {
    id: "toefl-email-all-tasks",
    version: "1",
    question:
      "Does the email do each of the things that the task lists, with enough detail for the reader to understand or act on each one, rather than leaving one out or only mentioning it?",
    quoteWhenMet: false,
  },
  {
    id: "toefl-email-register",
    version: "1",
    question:
      "Does the email suit the person it is written to, polite and suitably formal for a professor or an office and friendly for a classmate, with a fitting greeting and closing?",
    quoteWhenMet: true,
  },
  {
    id: "toefl-email-clear",
    version: "1",
    question:
      "Does the email make its purpose clear near the beginning, and is it organized so that the reader can find each point and knows what the writer wants?",
    quoteWhenMet: false,
  },
  // TOEFL Writing: a post to an academic discussion.
  {
    id: "toefl-discussion-opinion",
    version: "1",
    question: "Does the post answer the professor's question with a clear opinion that a reader can identify?",
    quoteWhenMet: true,
  },
  {
    id: "toefl-discussion-support",
    version: "1",
    question: "Is the opinion supported with at least one reason, example or explanation that is developed, rather than only stated?",
    quoteWhenMet: false,
  },
  {
    id: "toefl-discussion-contribution",
    version: "1",
    question:
      "Does the post add something of its own to the discussion, such as a new reason, an example or a response to a point that a classmate made, rather than only repeating what the classmates said?",
    quoteWhenMet: true,
  },
];
