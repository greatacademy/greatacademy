import type { CriterionSpec } from "@ga/content";

/** GRADE_6_CRITERIA are the criteria new to the writing topics of the grade 6 course, with starting questions to be calibrated. */
export const GRADE_6_CRITERIA: readonly CriterionSpec[] = [
  // Explaining how something worked in the past.
  {
    id: "g6-explains-how",
    version: "1",
    question:
      "Does the writing explain how the thing worked, step by step or part by part, so that a reader could describe the process, rather than only saying that it existed or was important?",
    quoteWhenMet: true,
  },
  {
    id: "g6-facts-from-notes",
    version: "1",
    question:
      "Does the writing use the facts given in the notes accurately and in its own sentences, without copying the notes word for word and without adding facts that contradict them?",
    quoteWhenMet: false,
  },
  // Explaining a natural process.
  {
    id: "g6-process-in-order",
    version: "1",
    question:
      "Does the explanation give the stages of the process in the order they happen, with words that show the order or the causes linking one stage to the next?",
    quoteWhenMet: true,
  },
  {
    id: "g6-defines-terms",
    version: "1",
    question:
      "Does the explanation define at least one technical term the first time it is used, in a way a reader new to the subject would understand?",
    quoteWhenMet: true,
  },
  // A compare-and-contrast essay.
  {
    id: "g6-compare-basis",
    version: "1",
    question: "Does the essay name the two things it compares near its start and make clear on what points they will be compared?",
    quoteWhenMet: true,
  },
  {
    id: "g6-likeness-and-difference",
    version: "1",
    question:
      "Does the essay give at least one specific way the two things are alike and at least one specific way they differ, each about both things?",
    quoteWhenMet: true,
  },
  {
    id: "g6-uses-transitions",
    version: "1",
    question:
      "Does the essay use transitions such as *similarly*, *likewise*, *however*, *on the other hand* or *in contrast* to show when it moves between likenesses and differences?",
    quoteWhenMet: true,
  },
  // A memoir scene.
  {
    id: "g6-scene-in-a-moment",
    version: "1",
    question:
      "Does the piece tell one remembered moment as a scene, with what was seen, said or felt at that time, instead of summarizing a long stretch of time?",
    quoteWhenMet: true,
  },
  {
    id: "g6-reflects-on-meaning",
    version: "1",
    question: "Does the piece end by looking back on the moment and saying what it meant to the writer or how it changed them?",
    quoteWhenMet: true,
  },
  // A letter to a leader.
  {
    id: "g6-states-request",
    version: "1",
    question: "Does the letter state early and clearly the one change the writer asks the leader to make?",
    quoteWhenMet: true,
  },
  {
    id: "g6-relevant-reasons",
    version: "1",
    question:
      "Does the letter give at least two reasons that show why the change would help, each backed by a fact or example, without reasons that are off the point?",
    quoteWhenMet: true,
  },
  {
    id: "g6-respectful-tone",
    version: "1",
    question:
      "Does the letter keep a polite, respectful tone toward the leader throughout, with a greeting and closing suited to a letter, and no insults or demands?",
    quoteWhenMet: false,
  },
  // A sports column.
  {
    id: "g6-takes-a-position",
    version: "1",
    question: "Does the column take a clear position on the question it addresses, stated where a reader cannot miss it?",
    quoteWhenMet: true,
  },
  {
    id: "g6-supports-with-examples",
    version: "1",
    question:
      "Does the column support its position with at least two specific examples from sport, such as a game, a team, a rule or a player's experience?",
    quoteWhenMet: true,
  },
  {
    id: "g6-answers-other-side",
    version: "1",
    question:
      "Does the column state a view that disagrees with its position fairly and then give a reason why its own position is still stronger?",
    quoteWhenMet: true,
  },
  // The history of a word.
  {
    id: "g6-word-origin",
    version: "1",
    question:
      "Does the paragraph say where the word came from, naming the language, person or place it began with and what it first meant, as the notes give it?",
    quoteWhenMet: true,
  },
  {
    id: "g6-explains-change",
    version: "1",
    question:
      "Does the paragraph explain how the word's meaning or form changed over time and give the reason for the change, ending with what the word means now?",
    quoteWhenMet: true,
  },
];
