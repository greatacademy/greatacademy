import type { CriterionSpec } from "@ga/content";

/** NATIVE_CRITERIA are the criteria of the writing topics added for the native courses by grade band, with starting questions to be calibrated. */
export const NATIVE_CRITERIA: readonly CriterionSpec[] = [
  // Grades 3 to 5: a story.
  {
    id: "g35-narrative-situation",
    version: "1",
    question: "Does the paragraph introduce at least one character and the situation or setting near its start?",
    quoteWhenMet: true,
  },
  {
    id: "g35-narrative-sequence",
    version: "1",
    question: "Do the events follow one another in an order the reader can follow, without gaps that leave the reader lost?",
    quoteWhenMet: false,
  },
  {
    id: "g35-narrative-shows",
    version: "1",
    question:
      "Does the paragraph use dialogue or specific details of what a character does, thinks or feels, rather than only listing events?",
    quoteWhenMet: true,
  },
  {
    id: "g35-narrative-ending",
    version: "1",
    question:
      "Does the paragraph end in a way that closes the events, such as how the problem turned out or what the character learned or felt?",
    quoteWhenMet: true,
  },
  // Grades 3 to 5: a summary of a source.
  {
    id: "g35-summary-main-idea",
    version: "1",
    question: "Does the summary state the main idea of the source text?",
    quoteWhenMet: true,
  },
  {
    id: "g35-summary-key-points",
    version: "1",
    question: "Does the summary include the most important points of the source and leave out minor details?",
    quoteWhenMet: false,
  },
  {
    id: "g35-summary-own-words",
    version: "1",
    question: "Is the summary written mostly in the writer's own words, rather than in sentences copied from the source?",
    quoteWhenMet: false,
  },
  {
    id: "g35-summary-no-opinion",
    version: "1",
    question: "Does the summary leave out the writer's own opinions and anything the source does not say?",
    quoteWhenMet: false,
  },
  // Grades 3 to 5: comparing two things.
  {
    id: "g35-compare-names-both",
    version: "1",
    question: "Does the paragraph open by naming the two things it compares?",
    quoteWhenMet: true,
  },
  {
    id: "g35-compare-likeness",
    version: "1",
    question: "Does the paragraph give at least one specific way in which the two things are alike?",
    quoteWhenMet: true,
  },
  {
    id: "g35-compare-difference",
    version: "1",
    question: "Does the paragraph give at least one specific way in which the two things are different?",
    quoteWhenMet: true,
  },
  {
    id: "g35-compare-signals",
    version: "1",
    question: "Does the paragraph use words such as both, also, like, but, however, unlike or while to show likenesses and differences?",
    quoteWhenMet: true,
  },
  // Grades 3 to 5: causes and effects.
  {
    id: "g35-cause-names-cause",
    version: "1",
    question: "Does the paragraph clearly name a cause: what makes something happen?",
    quoteWhenMet: true,
  },
  {
    id: "g35-cause-names-effect",
    version: "1",
    question: "Does the paragraph clearly name at least one effect: what happens as a result?",
    quoteWhenMet: true,
  },
  {
    id: "g35-cause-explains-link",
    version: "1",
    question: "Does the paragraph explain how the cause leads to the effect, rather than only naming the two?",
    quoteWhenMet: true,
  },
  {
    id: "g35-cause-signals",
    version: "1",
    question: "Does the paragraph use words such as because, so, as a result, therefore or this causes to connect causes and effects?",
    quoteWhenMet: true,
  },
  // Grades 3 to 5: a description.
  {
    id: "g35-describe-subject",
    version: "1",
    question: "Does the paragraph open by naming what it describes?",
    quoteWhenMet: true,
  },
  {
    id: "g35-describe-senses",
    version: "1",
    question: "Does the paragraph give details that appeal to at least two senses, such as sight, sound, touch, smell or taste?",
    quoteWhenMet: true,
  },
  {
    id: "g35-describe-precise",
    version: "1",
    question: "Does the paragraph use precise words or a comparison such as a simile, rather than only vague words like nice, big or good?",
    quoteWhenMet: true,
  },
  {
    id: "g35-describe-stays",
    version: "1",
    question: "Does every sentence of the paragraph describe the same subject, without wandering to something else?",
    quoteWhenMet: false,
  },
];
