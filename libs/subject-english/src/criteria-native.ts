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
  // Grades 6 to 8: a retold myth.
  {
    id: "g68-myth-conflict",
    version: "1",
    question: "Does the retelling make clear what the main character wants or faces and what stands in the way?",
    quoteWhenMet: true,
  },
  {
    id: "g68-myth-sequence",
    version: "1",
    question:
      "Are the main events of the notes told in order, up to the turning point and its outcome, without leaving out a step the ending depends on?",
    quoteWhenMet: false,
  },
  {
    id: "g68-myth-telling",
    version: "1",
    question:
      "Is it told as a story in the writer's own words, in two or more paragraphs, with at least one line of dialogue or vivid detail, rather than copied notes or a list of events?",
    quoteWhenMet: true,
  },
  {
    id: "g68-myth-lesson",
    version: "1",
    question: "Does the ending make the myth's lesson or what it explains clear?",
    quoteWhenMet: true,
  },
  // Grades 6 to 8: a response to a poem.
  {
    id: "g68-poem-feeling",
    version: "1",
    question:
      "Does the paragraph open with a claim that names the feeling or mood the poem creates, with a precise word rather than only sad or happy?",
    quoteWhenMet: true,
  },
  {
    id: "g68-poem-quotes",
    version: "1",
    question: "Does the paragraph quote at least two words or phrases of the poem, in quotation marks, accurately?",
    quoteWhenMet: true,
  },
  {
    id: "g68-poem-how",
    version: "1",
    question:
      "For the quotations it gives, does the paragraph explain how the image, comparison, sound or line creates the feeling, rather than only repeating what the poem says?",
    quoteWhenMet: true,
  },
  {
    id: "g68-poem-focus",
    version: "1",
    question: "Does every sentence of the paragraph stay on the given poem and the feeling it creates?",
    quoteWhenMet: false,
  },
  // Grades 6 to 8: an informative paragraph.
  {
    id: "g68-inform-topic",
    version: "1",
    question: "Does the paragraph open with a topic sentence that names the topic and its main point?",
    quoteWhenMet: true,
  },
  {
    id: "g68-inform-facts",
    version: "1",
    question:
      "Does the paragraph use at least four facts from the notes accurately, and define or explain at least one word the reader may not know?",
    quoteWhenMet: true,
  },
  {
    id: "g68-inform-order",
    version: "1",
    question: "Are the facts given in a clear order, such as steps, causes and effects or parts, and linked with transitions?",
    quoteWhenMet: true,
  },
  {
    id: "g68-inform-close",
    version: "1",
    question: "Does the paragraph stay informative, without the writer's opinion, and end with a sentence that sums up the topic?",
    quoteWhenMet: false,
  },
  // Grades 6 to 8: an objective summary.
  {
    id: "g68-summary-central",
    version: "1",
    question: "Does the summary open by stating the central idea of the whole text?",
    quoteWhenMet: true,
  },
  {
    id: "g68-summary-development",
    version: "1",
    question:
      "Does the summary give the main points by which the text develops its central idea, in the text's order, and leave out minor examples and details?",
    quoteWhenMet: true,
  },
  {
    id: "g68-summary-objective",
    version: "1",
    question: "Is the summary free of the writer's opinions, judgments and anything the text does not say?",
    quoteWhenMet: false,
  },
  {
    id: "g68-summary-concise",
    version: "1",
    question: "Is the summary in the writer's own words, without copying whole sentences of the text, and much shorter than it?",
    quoteWhenMet: false,
  },
  // Grades 6 to 8: a narrative from a point of view.
  {
    id: "g68-pov-consistent",
    version: "1",
    question: "Is the narrative told throughout by the character the task names, without slipping into another person's voice?",
    quoteWhenMet: false,
  },
  {
    id: "g68-pov-limits",
    version: "1",
    question:
      "Does the narrator tell only what that character could see, hear or know, guessing at others' thoughts rather than stating them?",
    quoteWhenMet: false,
  },
  {
    id: "g68-pov-inner",
    version: "1",
    question: "Does the narrative show the narrator's own thoughts and feelings through details such as their body, words or reactions?",
    quoteWhenMet: true,
  },
  {
    id: "g68-pov-event",
    version: "1",
    question: "Does the narrative tell the event the task gives, with a beginning and an ending that shows what it meant to the narrator?",
    quoteWhenMet: true,
  },
];
