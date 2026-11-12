import type { CriterionSpec } from "@ga/content";

/** GRADE_11_CRITERIA are the criteria new to the writing topics of the grade 11 course, with starting questions to be calibrated. */
export const GRADE_11_CRITERIA: readonly CriterionSpec[] = [
  // A motif analysis.
  {
    id: "g11-motif-claim",
    version: "1",
    question:
      "Does the analysis open with a claim about what the motif in the task stands for and what its changes show, rather than only naming or describing the motif?",
    quoteWhenMet: true,
  },
  {
    id: "g11-motif-trace",
    version: "1",
    question:
      "Does the analysis trace the motif through at least three of its appearances in order, including the turning point and the last appearance, and say what changes each time?",
    quoteWhenMet: true,
  },
  {
    id: "g11-motif-quotes",
    version: "1",
    question:
      "Does the analysis quote at least two short phrases from the text and explain what each shows about the motif, rather than leaving the quotations to speak for themselves?",
    quoteWhenMet: true,
  },
  // A meditative essay.
  {
    id: "g11-meditation-observation",
    version: "1",
    question:
      "Does the essay begin with a close, concrete observation of the scene or object in the task, with specific details of color, shape, sound or change, rather than general words such as beautiful?",
    quoteWhenMet: true,
  },
  {
    id: "g11-meditation-movement",
    version: "1",
    question:
      "Does the essay move clearly from the observed details to a larger idea, showing the step from the thing to the thought rather than jumping to a lesson unconnected to the details?",
    quoteWhenMet: true,
  },
  {
    id: "g11-meditation-insight",
    version: "1",
    question:
      "Does the essay end with an insight about life that grows out of its details and is applied to the writer's own life or to people in general, without becoming a lecture?",
    quoteWhenMet: true,
  },
  // A critique of an argument.
  {
    id: "g11-critique-summary",
    version: "1",
    question: "Does the critique summarize the argument's claim and main reasons fairly, in neutral words, before judging it?",
    quoteWhenMet: true,
  },
  {
    id: "g11-critique-assumption",
    version: "1",
    question:
      "Does the critique name at least one unstated assumption of the argument and explain why it is questionable, and point out at least one piece of weak evidence or one fallacy?",
    quoteWhenMet: true,
  },
  {
    id: "g11-critique-judgment",
    version: "1",
    question:
      "Does the critique give the argument credit where it is strong and end with a balanced overall judgment, saying what would make the argument better?",
    quoteWhenMet: true,
  },
  // An open letter.
  {
    id: "g11-open-letter-audience",
    version: "1",
    question:
      "Does the letter address the named reader directly and respectfully, make clear that it is written for the public as well, and acknowledge the reader's position fairly?",
    quoteWhenMet: true,
  },
  {
    id: "g11-open-letter-case",
    version: "1",
    question: "Does the letter support a specific, practical request with concrete facts or examples rather than only feelings?",
    quoteWhenMet: true,
  },
  {
    id: "g11-open-letter-ending",
    version: "1",
    question:
      "Does the letter end by widening the view to why the issue matters beyond the letter, rather than only repeating the request?",
    quoteWhenMet: true,
  },
  // A narrative of two worlds.
  {
    id: "g11-worlds-contrast",
    version: "1",
    question: "Is the narrative written in the third person, and does it set the character's two worlds side by side in concrete details?",
    quoteWhenMet: true,
  },
  {
    id: "g11-worlds-inner-voice",
    version: "1",
    question:
      "Does the narrative present the character's thoughts at least twice through free indirect discourse, in the third person and the past tense without quotation marks or a verb such as thought?",
    quoteWhenMet: true,
  },
  {
    id: "g11-worlds-change",
    version: "1",
    question:
      "Does the narrative end with a small but clear change in how the character sees one of the two worlds, shown through an action or a detail rather than explained?",
    quoteWhenMet: true,
  },
];
