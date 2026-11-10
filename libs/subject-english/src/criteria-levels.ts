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
  // A2: telling the past.
  {
    id: "a2-past-simple",
    version: "1",
    question:
      "Does the text tell finished past events in the past simple, with verbs such as went, played or saw, and not in the present, as in I go or we play?",
    quoteWhenMet: false,
  },
  {
    id: "a2-events-in-order",
    version: "1",
    question:
      "Does the text tell at least three things that happened, in the order they happened, with words that show the order such as then, after lunch or in the evening?",
    quoteWhenMet: true,
  },
  // A2: a place.
  {
    id: "a2-place-where",
    version: "1",
    question: "Does the text say where the place is, such as in which part of a town or near what?",
    quoteWhenMet: true,
  },
  {
    id: "a2-place-what",
    version: "1",
    question: "Does the text say at least two things that are in the place, for example with there is or there are?",
    quoteWhenMet: true,
  },
  {
    id: "a2-place-like",
    version: "1",
    question:
      "Does the text say what the place is like, with adjectives such as quiet, crowded or pretty, or with a comparison such as quieter than the city?",
    quoteWhenMet: true,
  },
  // A2: a recipe.
  {
    id: "a2-recipe-ingredients",
    version: "1",
    question:
      "Does the text list what you need for the dish, with an amount for at least three of the things, such as two eggs, a little oil or 200 grams of flour?",
    quoteWhenMet: true,
  },
  {
    id: "a2-recipe-steps",
    version: "1",
    question:
      "Does the text give at least four steps in order as instructions that start with a verb, with words such as first, then, next and finally that show the order?",
    quoteWhenMet: true,
  },
  // A2: a past event.
  {
    id: "a2-event-ending",
    version: "1",
    question: "Does the text say how the event ended, such as who won, the final score or the writer's place?",
    quoteWhenMet: true,
  },
  // A2: plans.
  {
    id: "a2-future-forms",
    version: "1",
    question:
      "Does the text talk about the future with going to or will and the first form of the verb, as in we are going to visit or it will be hot, without writing future plans in the present simple?",
    quoteWhenMet: false,
  },
  {
    id: "a2-trip-details",
    version: "1",
    question:
      "Does the text say where the trip is to, when it is, how the writer will travel and at least two things the writer will do there?",
    quoteWhenMet: true,
  },
  // A2: an experience.
  {
    id: "a2-present-perfect",
    version: "1",
    question:
      "Does the text say that the writer has had the experience with have or has and a past participle, as in I have seen or I have never climbed, without putting a finished time such as last year in the same sentence?",
    quoteWhenMet: true,
  },
];
