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
  // Grades 9 to 12: a literary analysis essay.
  {
    id: "g912-litessay-thesis",
    version: "1",
    question:
      "Does the essay state, near its start, a thesis that makes an arguable claim about the meaning of the story, not just a summary of what happens?",
    quoteWhenMet: true,
  },
  {
    id: "g912-litessay-evidence",
    version: "1",
    question: "Do the body paragraphs quote or closely cite specific words or details from the source to support the thesis?",
    quoteWhenMet: true,
  },
  {
    id: "g912-litessay-analysis",
    version: "1",
    question:
      "Does the essay explain how each piece of evidence supports the thesis, rather than leaving the quotations to speak for themselves?",
    quoteWhenMet: true,
  },
  {
    id: "g912-litessay-structure",
    version: "1",
    question:
      "Is the essay organized into an introduction, at least two body paragraphs with their own points, and a conclusion that returns to the thesis?",
    quoteWhenMet: false,
  },
  // Grades 9 to 12: a scene of drama.
  {
    id: "g912-scene-format",
    version: "1",
    question: "Is the scene written in script form, with character names before their lines and at least one stage direction?",
    quoteWhenMet: false,
  },
  {
    id: "g912-scene-conflict",
    version: "1",
    question: "Does the scene present a clear conflict between characters that is carried mainly by their dialogue?",
    quoteWhenMet: true,
  },
  {
    id: "g912-scene-character",
    version: "1",
    question: "Do the characters' words and actions reveal what they are like or what they want, without a narrator explaining it?",
    quoteWhenMet: true,
  },
  {
    id: "g912-scene-shape",
    version: "1",
    question: "Does the scene build to a turning point or ending that changes the situation from where it began?",
    quoteWhenMet: true,
  },
  // Grades 9 to 12: an argumentative essay.
  {
    id: "g912-argument-thesis",
    version: "1",
    question: "Does the essay state a clear, arguable position on the question in its introduction?",
    quoteWhenMet: true,
  },
  {
    id: "g912-argument-evidence",
    version: "1",
    question: "Do the body paragraphs support the position with specific reasons and evidence, such as facts or examples from the notes?",
    quoteWhenMet: true,
  },
  {
    id: "g912-argument-counterclaim",
    version: "1",
    question: "Does the essay fairly state an opposing view and answer it with a reasoned rebuttal?",
    quoteWhenMet: true,
  },
  {
    id: "g912-argument-structure",
    version: "1",
    question: "Is the essay organized into an introduction, body paragraphs and a conclusion, with transitions that connect the reasoning?",
    quoteWhenMet: false,
  },
  // Grades 9 to 12: an explanatory essay.
  {
    id: "g912-explain-focus",
    version: "1",
    question: "Does the introduction state the topic and a controlling idea that the rest of the essay explains?",
    quoteWhenMet: true,
  },
  {
    id: "g912-explain-development",
    version: "1",
    question: "Does the essay develop the topic with relevant facts, definitions, examples or causes from the notes?",
    quoteWhenMet: false,
  },
  {
    id: "g912-explain-organization",
    version: "1",
    question: "Are the paragraphs in a logical order, such as by cause and effect or by time, linked by transitions?",
    quoteWhenMet: false,
  },
  {
    id: "g912-explain-objective",
    version: "1",
    question: "Does the essay keep an objective, informative tone without arguing for the writer's own opinion, and end with a conclusion?",
    quoteWhenMet: false,
  },
  // Grades 9 to 12: an analysis of a poem.
  {
    id: "g912-poetry-claim",
    version: "1",
    question: "Does the essay make a clear claim about the poem's meaning or effect, beyond a summary of it?",
    quoteWhenMet: true,
  },
  {
    id: "g912-poetry-quotes",
    version: "1",
    question: "Does the essay quote specific words or lines of the poem as evidence?",
    quoteWhenMet: true,
  },
  {
    id: "g912-poetry-craft",
    version: "1",
    question:
      "Does the essay explain how at least one element of the poem's form or sound, such as its stanzas, line breaks, rhyme, meter, repetition or imagery, creates its meaning or effect?",
    quoteWhenMet: true,
  },
  {
    id: "g912-poetry-structure",
    version: "1",
    question: "Is the analysis organized into paragraphs with an introduction and a conclusion?",
    quoteWhenMet: false,
  },
  // Grades 9 to 12: a personal essay.
  {
    id: "g912-personal-experience",
    version: "1",
    question: "Does the essay tell one specific experience with concrete details of what happened?",
    quoteWhenMet: true,
  },
  {
    id: "g912-personal-reflection",
    version: "1",
    question: "Does the essay reflect on what the experience meant or how it changed the writer, beyond telling what happened?",
    quoteWhenMet: true,
  },
  {
    id: "g912-personal-voice",
    version: "1",
    question:
      "Is the essay written in the first person in an honest, individual voice, with vivid description or dialogue in at least one moment?",
    quoteWhenMet: true,
  },
  {
    id: "g912-personal-shape",
    version: "1",
    question: "Does the essay open in a way that draws the reader in and end in a way that closes the reflection?",
    quoteWhenMet: true,
  },
  // Grades 9 to 12: a college application essay.
  {
    id: "g912-college-prompt",
    version: "1",
    question: "Does the essay answer the question the prompt asks?",
    quoteWhenMet: false,
  },
  {
    id: "g912-college-specific",
    version: "1",
    question: "Is the essay built on specific moments, actions or examples from the writer's life rather than general statements?",
    quoteWhenMet: true,
  },
  {
    id: "g912-college-insight",
    version: "1",
    question:
      "Does the essay show what the writer values, how they think or how they have grown, so that a reader learns something about them?",
    quoteWhenMet: true,
  },
  {
    id: "g912-college-craft",
    version: "1",
    question:
      "Does the essay have an engaging opening, keep one clear focus, and end with a conclusion that leaves the reader with a final insight?",
    quoteWhenMet: true,
  },
];
