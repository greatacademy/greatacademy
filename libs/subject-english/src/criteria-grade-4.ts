import type { CriterionSpec } from "@ga/content";

/** GRADE_4_CRITERIA are the criteria new to the writing topics of the grade 4 course, with starting questions to be calibrated. */
export const GRADE_4_CRITERIA: readonly CriterionSpec[] = [
  // A report of two paragraphs.
  {
    id: "g4-report-topic",
    version: "1",
    question:
      "Does the report make its topic clear at the start and give each of its two paragraphs a heading that names what the paragraph is about?",
    quoteWhenMet: true,
  },
  {
    id: "g4-report-grouped",
    version: "1",
    question:
      "Are the facts grouped so that each paragraph keeps to its own part of the topic, without facts that belong in the other paragraph?",
    quoteWhenMet: false,
  },
  {
    id: "g4-report-facts",
    version: "1",
    question:
      "Does the report give specific facts and at least one definition of a word or one example, rather than only general statements?",
    quoteWhenMet: true,
  },
  {
    id: "g4-report-close",
    version: "1",
    question: "Does the report end with a sentence that closes or sums up the topic?",
    quoteWhenMet: true,
  },
  // A persuasive letter.
  {
    id: "g4-letter-request",
    version: "1",
    question: "Does the letter state clearly, near its start, the one change the writer is asking for and whom they are asking?",
    quoteWhenMet: true,
  },
  {
    id: "g4-letter-facts",
    version: "1",
    question: "Is at least one reason of the letter backed by a fact, a number or a specific example, rather than only by feelings?",
    quoteWhenMet: true,
  },
  {
    id: "g4-letter-audience",
    version: "1",
    question:
      "Is the letter written as a letter to its reader, with a greeting and a closing, in a polite tone that suits someone like a principal or a town council?",
    quoteWhenMet: false,
  },
  // A tall tale.
  {
    id: "g4-talltale-hero",
    version: "1",
    question: "Does the tale introduce a hero with one extraordinary power or quality, such as great size, strength or speed?",
    quoteWhenMet: true,
  },
  {
    id: "g4-talltale-exaggeration",
    version: "1",
    question: "Does the tale use exaggeration that grows bigger from one event to the next?",
    quoteWhenMet: true,
  },
  {
    id: "g4-talltale-ending",
    version: "1",
    question: "Does the tale end by explaining, in a playful way, how something in nature or the world came to be?",
    quoteWhenMet: true,
  },
  // A response to a work of art.
  {
    id: "g4-art-details-support",
    version: "1",
    question: "Does the response point to specific details of the work of art to explain why the writer thinks what they do about it?",
    quoteWhenMet: true,
  },
  // A short script.
  {
    id: "g4-script-format",
    version: "1",
    question:
      "Is the scene written in script format, each line starting with the speaker's name and a colon, with no quotation marks and stage directions in brackets?",
    quoteWhenMet: false,
  },
  {
    id: "g4-script-conflict",
    version: "1",
    question: "Does the scene have a problem or a disagreement between the characters that comes to some kind of end?",
    quoteWhenMet: true,
  },
  {
    id: "g4-script-dialogue",
    version: "1",
    question: "Does what the characters say show who they are, such as what they want or how they feel, rather than only reporting events?",
    quoteWhenMet: true,
  },
  {
    id: "g4-script-directions",
    version: "1",
    question: "Does the scene include at least two stage directions that tell the actors what to do or how to speak?",
    quoteWhenMet: true,
  },
  // A paragraph of biography.
  {
    id: "g4-bio-person",
    version: "1",
    question: "Does the paragraph open by saying who the person was and what they are known for?",
    quoteWhenMet: true,
  },
  {
    id: "g4-bio-order",
    version: "1",
    question: "Are the key events of the person's life told in the order they happened?",
    quoteWhenMet: false,
  },
  {
    id: "g4-bio-facts",
    version: "1",
    question: "Are the facts of the paragraph taken from the notes, without facts the notes do not give or facts changed from them?",
    quoteWhenMet: false,
  },
  {
    id: "g4-bio-importance",
    version: "1",
    question: "Does the paragraph end by explaining why the person's work or life still matters today?",
    quoteWhenMet: true,
  },
];
