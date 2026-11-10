import type { CriterionSpec } from "@ga/content";

/** LEVEL_CRITERIA are the criteria of the writing topics of the foreign-language courses, Pre-A1 to B2, with starting questions to be calibrated. */
export const LEVEL_CRITERIA: readonly CriterionSpec[] = [
  // A1: what every short text needs.
  {
    id: "a1-sentences",
    version: "1",
    question:
      "Is the text written in complete sentences, each with a subject and a verb, beginning with a capital letter and ending with a period, a question mark or an exclamation mark?",
    quoteWhenMet: false,
  },
  {
    id: "a1-reader-and-name",
    version: "1",
    question: "Does the text begin by naming its reader, such as Dear Mom or Hi Tom, and end with the writer's name?",
    quoteWhenMet: false,
  },
  // A1: a short note.
  {
    id: "a1-note-purpose",
    version: "1",
    question:
      "Does the note do what the task asks: give the information it names, such as where the writer is and when they will be back, or make the request or the thanks it names?",
    quoteWhenMet: true,
  },
  // A1: a postcard.
  {
    id: "a1-postcard-place",
    version: "1",
    question: "Does the postcard say where the writer is?",
    quoteWhenMet: true,
  },
  {
    id: "a1-postcard-weather",
    version: "1",
    question: "Does the postcard say what the weather is like there, in a sentence such as It is sunny or It's raining?",
    quoteWhenMet: true,
  },
  {
    id: "a1-postcard-doing",
    version: "1",
    question: "Does the postcard say at least one thing the writer is doing or does there?",
    quoteWhenMet: true,
  },
  // A1: a person.
  {
    id: "a1-person-who",
    version: "1",
    question: "Does the text say who the person is, such as a family member or a friend, and give their name?",
    quoteWhenMet: true,
  },
  {
    id: "a1-person-looks",
    version: "1",
    question: "Does the text say what the person looks like or what kind of person they are?",
    quoteWhenMet: true,
  },
  {
    id: "a1-person-does",
    version: "1",
    question: "Does the text say what the person does, such as their job, or what they like doing?",
    quoteWhenMet: true,
  },
  {
    id: "a1-person-verb-s",
    version: "1",
    question:
      "Where the text tells what the person does or likes now, with he, she or the person's name before the verb, does the verb end in -s, as in she works or he likes?",
    quoteWhenMet: false,
  },
  // A1: directions.
  {
    id: "a1-directions-start",
    version: "1",
    question: "Do the directions start from the place the task names?",
    quoteWhenMet: true,
  },
  {
    id: "a1-directions-steps",
    version: "1",
    question:
      "Do the directions give the steps in order, with turns or places to look for, such as turn left at the bank or go past the park?",
    quoteWhenMet: true,
  },
  {
    id: "a1-directions-arrive",
    version: "1",
    question:
      "Do the directions tell the reader how to know they have arrived, such as which building, house or door is the writer's home?",
    quoteWhenMet: true,
  },
];
