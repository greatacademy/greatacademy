import type { CriterionSpec } from "@ga/content";

/** GRADE_3_CRITERIA are the criteria new to the writing topics of the grade 3 course, with starting questions to be calibrated. */
export const GRADE_3_CRITERIA: readonly CriterionSpec[] = [
  // A friendly letter.
  {
    id: "g3-letter-parts",
    version: "1",
    question: "Does the letter have a date, a greeting, a body, a closing and a signature, in that order?",
    quoteWhenMet: false,
  },
  {
    id: "g3-letter-purpose",
    version: "1",
    question:
      "Is it clear why the letter was written, and does the body stay on that reason, such as telling about a place or asking a question?",
    quoteWhenMet: true,
  },
  // A paragraph of facts from notes.
  {
    id: "g3-facts-from-notes",
    version: "1",
    question:
      "Does the paragraph use facts from the notes, turned into whole sentences in the writer's own words, without adding facts that are wrong?",
    quoteWhenMet: true,
  },
  // A fable.
  {
    id: "g3-fable-characters",
    version: "1",
    question:
      "Does the fable have animal characters, and does each main character act in a way that shows what it is like, such as proud, kind or clever?",
    quoteWhenMet: true,
  },
  {
    id: "g3-fable-problem",
    version: "1",
    question: "Does the fable open with who and where, and set up a clear problem that a character must face or a choice it must make?",
    quoteWhenMet: true,
  },
  {
    id: "g3-fable-moral",
    version: "1",
    question: "Does the fable end with a moral stated in one sentence, and does that moral fit what happened in the story?",
    quoteWhenMet: true,
  },
  // An answer to a question about a passage.
  {
    id: "g3-answer-restates",
    version: "1",
    question: "Does the answer begin by turning the words of the question into the start of a complete sentence?",
    quoteWhenMet: true,
  },
  {
    id: "g3-answer-correct",
    version: "1",
    question: "Does the answer answer the question that was asked, correctly according to the passage, in complete sentences?",
    quoteWhenMet: true,
  },
  {
    id: "g3-answer-detail",
    version: "1",
    question: "Does the answer give at least one detail from the passage that supports it?",
    quoteWhenMet: true,
  },
  // A poem about a season.
  {
    id: "g3-poem-subject",
    version: "1",
    question: "Is the poem clearly about one season, with pictures in words that belong to that season?",
    quoteWhenMet: true,
  },
  {
    id: "g3-poem-pattern",
    version: "1",
    question: "Is the poem written in lines, six to ten of them, with a pattern of repeated words or of rhyme?",
    quoteWhenMet: false,
  },
];
