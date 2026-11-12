import type { CriterionSpec } from "@ga/content";

/** GRADE_10_CRITERIA are the criteria new to the writing topics of the grade 10 course, with starting questions to be calibrated. */
export const GRADE_10_CRITERIA: readonly CriterionSpec[] = [
  // A thematic analysis.
  {
    id: "g10-theme-statement",
    version: "1",
    question:
      "Does the analysis state the theme of the text in the task as a complete idea about life, rather than naming only a topic such as greed or retelling the plot?",
    quoteWhenMet: true,
  },
  {
    id: "g10-theme-development",
    version: "1",
    question:
      "Does the analysis trace how the text develops the theme from beginning to end, through a pattern, a symbol, a turning point or the ending, rather than treating one moment alone?",
    quoteWhenMet: true,
  },
  {
    id: "g10-theme-quotes",
    version: "1",
    question:
      "Does the analysis quote at least two short phrases from the text and explain what each adds to the theme, rather than leaving the quotations to speak for themselves?",
    quoteWhenMet: true,
  },
  // A comparison of two texts.
  {
    id: "g10-compare-claim",
    version: "1",
    question:
      "Does the essay open with a claim about how the two texts in the task present their shared subject differently, rather than describing each text separately?",
    quoteWhenMet: true,
  },
  {
    id: "g10-compare-language",
    version: "1",
    question:
      "Does the essay point to specific words or details from both texts and explain how the language of each shapes the reader's view of the subject?",
    quoteWhenMet: true,
  },
  {
    id: "g10-compare-purpose",
    version: "1",
    question: "Does the essay explain why the texts differ, linking the differences to the purpose, audience or form of each text?",
    quoteWhenMet: true,
  },
  // A descriptive essay on a place.
  {
    id: "g10-place-senses",
    version: "1",
    question:
      "Does the essay describe the place in the task with precise details drawn from at least three of the senses, rather than general words such as nice or beautiful?",
    quoteWhenMet: true,
  },
  {
    id: "g10-place-impression",
    version: "1",
    question:
      "Do the details build one dominant impression or mood of the place, which the essay makes clear without listing unrelated facts?",
    quoteWhenMet: true,
  },
  {
    id: "g10-place-order",
    version: "1",
    question:
      "Does the essay follow a clear order, such as a walk through space or a change over time, so that the reader can picture the place step by step?",
    quoteWhenMet: true,
  },
  // An editorial.
  {
    id: "g10-editorial-position",
    version: "1",
    question:
      "Does the editorial state a clear position on the issue in the task early on, in a sentence that says what should or should not be done?",
    quoteWhenMet: true,
  },
  {
    id: "g10-editorial-evidence",
    version: "1",
    question:
      "Does the editorial support its position with at least two pieces of evidence that readers could check, such as figures, surveys, examples or the experience of another place?",
    quoteWhenMet: true,
  },
  {
    id: "g10-editorial-other-side",
    version: "1",
    question:
      "Does the editorial name a reasonable objection to its position, answer it fairly and end with what readers or leaders should do?",
    quoteWhenMet: true,
  },
  // A letter of application.
  {
    id: "g10-application-purpose",
    version: "1",
    question:
      "Does the letter say in its opening what the writer is applying for, as named in the task, and where the writer learned of it?",
    quoteWhenMet: true,
  },
  {
    id: "g10-application-evidence",
    version: "1",
    question:
      "Does the letter support the writer's suitability with at least two specific pieces of evidence, such as what the writer did, for how long and with what result, rather than only listing qualities?",
    quoteWhenMet: true,
  },
  {
    id: "g10-application-format",
    version: "1",
    question:
      "Does the letter keep the conventions of a formal letter, with a greeting, a polite and confident tone, a closing that gives availability and thanks the reader, and a formal sign-off?",
    quoteWhenMet: true,
  },
  // A satire.
  {
    id: "g10-satire-target",
    version: "1",
    question:
      "Does the satire aim at the real folly named in the task, so that a reader can tell what serious point it makes about that folly?",
    quoteWhenMet: true,
  },
  {
    id: "g10-satire-exaggeration",
    version: "1",
    question:
      "Does the satire push the folly to an absurd extreme through specific exaggerated details, rather than simply complaining about it?",
    quoteWhenMet: true,
  },
  {
    id: "g10-satire-voice",
    version: "1",
    question:
      "Does the satire keep the form named in the task and a straight-faced voice in which the speaker treats the folly as sensible, without stepping out to explain the joke?",
    quoteWhenMet: true,
  },
];
