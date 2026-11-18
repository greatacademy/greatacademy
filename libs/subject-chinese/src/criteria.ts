import type { CriterionSpec } from "@ga/content";

/**
 * WRITING_CRITERIA are the criteria of the judged writing of native grades 3 to 6 (docs/chinese-curriculum.md §11): W4
 * paragraphs and W5 compositions, with starting questions to be calibrated against texts scored by teachers of Chinese.
 * Their questions are in English, as the core asks; the texts they are asked of are in Chinese.
 */
export const WRITING_CRITERIA: readonly CriterionSpec[] = [
  // Grade 3: a paragraph about one idea.
  {
    id: "zh3-paragraph-idea",
    version: "1",
    question:
      "Does the paragraph, written in Chinese, open with or clearly state one main idea, such as a sentence telling what it is about?",
    quoteWhenMet: true,
  },
  {
    id: "zh3-paragraph-stays",
    version: "1",
    question: "Does every sentence of the paragraph help show that one idea, without wandering to something else?",
    quoteWhenMet: false,
  },
  {
    id: "zh3-paragraph-details",
    version: "1",
    question:
      "Does the paragraph show the idea with at least two concrete things, such as examples, actions or things seen, rather than saying it again in other words?",
    quoteWhenMet: true,
  },
  // Grade 3: an observation diary.
  {
    id: "zh3-diary-form",
    version: "1",
    question:
      "Is the text written as a diary entry: a first line with the date, the day of the week and the weather, then what happened that day, told by the writer?",
    quoteWhenMet: false,
  },
  {
    id: "zh3-diary-observed",
    version: "1",
    question:
      "Does the entry describe what the writer observed of the thing named in the task, with details such as its colour, shape, size or movement?",
    quoteWhenMet: true,
  },
  {
    id: "zh3-diary-change",
    version: "1",
    question:
      "Does the entry tell how the thing observed has changed or what the writer noticed for the first time, and how the writer felt or what they wondered about it?",
    quoteWhenMet: true,
  },
  // Grade 4: telling an event.
  {
    id: "zh4-event-parts",
    version: "1",
    question:
      "Does the text tell one event with its beginning (what started it), its course (what happened) and its end (how it came out), in that order?",
    quoteWhenMet: false,
  },
  {
    id: "zh4-event-detail",
    version: "1",
    question:
      "Is the course of the event told in detail, with what people did, said or thought at its most important moment, rather than in one or two sentences?",
    quoteWhenMet: true,
  },
  {
    id: "zh4-event-feeling",
    version: "1",
    question:
      "Does the text show how the writer felt about the event or what they learned from it, in a way that follows from what happened?",
    quoteWhenMet: true,
  },
  // Grade 4: a letter.
  {
    id: "zh4-letter-form",
    version: "1",
    question:
      "Does the letter follow the form of a Chinese letter: the person written to on the first line followed by a colon, a greeting, the body, a closing wish such as 祝你 or 此致 and the wish itself on lines of their own, and the writer's name and the date at the end?",
    quoteWhenMet: false,
  },
  {
    id: "zh4-letter-purpose",
    version: "1",
    question: "Is it clear why the letter was written, and does its body keep to that purpose and suit the person written to?",
    quoteWhenMet: true,
  },
  {
    id: "zh4-letter-detail",
    version: "1",
    question: "Does the body give concrete news, reasons or questions that the reader would want to know, rather than only general words?",
    quoteWhenMet: true,
  },
  // Grade 5: writing about a person.
  {
    id: "zh5-person-trait",
    version: "1",
    question: "Does the text make clear one main quality of the person it is about, such as being patient, brave or careless?",
    quoteWhenMet: true,
  },
  {
    id: "zh5-person-example",
    version: "1",
    question:
      "Does the text show that quality through at least one concrete event the person took part in, told so that the quality can be seen in it?",
    quoteWhenMet: true,
  },
  {
    id: "zh5-person-description",
    version: "1",
    question:
      "Does the text describe the person's actions, words, looks or expressions in a way that brings out the quality, rather than only naming it?",
    quoteWhenMet: true,
  },
  // Grade 5: explaining a thing.
  {
    id: "zh5-explain-features",
    version: "1",
    question:
      "Does the text explain the thing named in the task by its features, such as what it looks like, what it is made of, how it works or what it is used for, each part about one feature?",
    quoteWhenMet: false,
  },
  {
    id: "zh5-explain-methods",
    version: "1",
    question:
      "Does the text use at least one method of explaining, such as giving numbers, comparing with something familiar, giving an example or classifying?",
    quoteWhenMet: true,
  },
  {
    id: "zh5-explain-plain",
    version: "1",
    question:
      "Is the explanation plain and accurate, without statements that are clearly wrong and without a story or feelings taking the place of the explanation?",
    quoteWhenMet: false,
  },
  // Grade 6: an argument.
  {
    id: "zh6-argue-claim",
    version: "1",
    question: "Does the text state one clear view on the question of the task, near its beginning?",
    quoteWhenMet: true,
  },
  {
    id: "zh6-argue-evidence",
    version: "1",
    question:
      "Does the text support the view with at least two pieces of evidence, such as examples, facts or sayings, that really bear on it?",
    quoteWhenMet: true,
  },
  {
    id: "zh6-argue-reasoning",
    version: "1",
    question:
      "Does the text explain how its evidence supports the view, and end by coming back to the view, rather than only listing examples?",
    quoteWhenMet: false,
  },
  // Grade 6: a scene.
  {
    id: "zh6-scene-order",
    version: "1",
    question: "Does the text describe the scene in a clear order, such as from near to far, from top to bottom, or as time passes?",
    quoteWhenMet: false,
  },
  {
    id: "zh6-scene-senses",
    version: "1",
    question:
      "Does the description use at least two senses, such as what is seen and what is heard or smelled, and at least one comparison or other figure of speech?",
    quoteWhenMet: true,
  },
  {
    id: "zh6-scene-feeling",
    version: "1",
    question:
      "Does the text carry a feeling through the scene, so that what is described shows the writer's mood, and does it say or make clear what that feeling is?",
    quoteWhenMet: true,
  },
];

/** criterionById finds a criterion of WRITING_CRITERIA, or undefined. */
export function criterionById(id: string): CriterionSpec | undefined {
  return WRITING_CRITERIA.find((c) => c.id === id);
}
