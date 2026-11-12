import type { CriterionSpec } from "@ga/content";

/** GRADE_7_CRITERIA are the criteria new to the writing topics of the grade 7 course, with starting questions to be calibrated. */
export const GRADE_7_CRITERIA: readonly CriterionSpec[] = [
  // An informative essay organized by category.
  {
    id: "g7-inform-preview",
    version: "1",
    question:
      "Does the introduction name the topic and preview the categories the essay will cover, so a reader knows how it is organized?",
    quoteWhenMet: true,
  },
  {
    id: "g7-inform-categories",
    version: "1",
    question: "Is the essay organized into paragraphs by category, each with a clear focus and only facts that belong to that category?",
    quoteWhenMet: false,
  },
  // Historical fiction.
  {
    id: "g7-hist-period",
    version: "1",
    question:
      "Does the story include at least three specific details of daily life, objects or setting that fit its period, with nothing from a later time?",
    quoteWhenMet: true,
  },
  {
    id: "g7-hist-facts",
    version: "1",
    question:
      "Does the story keep the historical facts given in the task accurate, inventing characters and dialogue but not changing what really happened?",
    quoteWhenMet: false,
  },
  {
    id: "g7-hist-scene",
    version: "1",
    question:
      "Does the story show a character facing a problem in a scene, with action or dialogue, and bring the problem to some resolution or turning point?",
    quoteWhenMet: true,
  },
  // A report with data.
  {
    id: "g7-data-accurate",
    version: "1",
    question: "Does the report give numbers from the data accurately, naming the trend and backing it with the exact values given?",
    quoteWhenMet: true,
  },
  {
    id: "g7-data-compares",
    version: "1",
    question:
      "Does the report compare at least two amounts correctly, with words such as more than, twice or half, and say what the comparison shows?",
    quoteWhenMet: true,
  },
  {
    id: "g7-data-limits",
    version: "1",
    question: "Does the report's conclusion stay within what the data show, without claiming a cause or a rule the data cannot support?",
    quoteWhenMet: false,
  },
  // A cause-and-effect essay.
  {
    id: "g7-cause-chain",
    version: "1",
    question:
      "Does the essay trace a chain in which one event leads to another and then to a further effect, rather than only listing separate causes?",
    quoteWhenMet: true,
  },
  {
    id: "g7-cause-evidence",
    version: "1",
    question:
      "Does the essay support each link in the chain with a fact or example from the notes, explaining how the cause produced the effect?",
    quoteWhenMet: true,
  },
  // A suspense story.
  {
    id: "g7-suspense-builds",
    version: "1",
    question:
      "Does the story build tension step by step, with a danger or question the reader wants answered and details that raise the stakes before the climax?",
    quoteWhenMet: true,
  },
  {
    id: "g7-suspense-pacing",
    version: "1",
    question:
      "Does the story vary its pace, using short sentences at the moment of greatest action and longer ones to slow down a tense moment?",
    quoteWhenMet: true,
  },
  {
    id: "g7-suspense-ending",
    version: "1",
    question: "Does the story resolve the danger or question in an ending that follows from what came before?",
    quoteWhenMet: true,
  },
  // A five-paragraph argument.
  {
    id: "g7-argument-claim",
    version: "1",
    question: "Does the introduction end with a clear claim that states the writer's position and the reasons the body will develop?",
    quoteWhenMet: true,
  },
  {
    id: "g7-argument-evidence",
    version: "1",
    question:
      "Does each body paragraph give one reason supported by relevant and sufficient evidence, such as a fact, a number or an example, and explain how it supports the claim?",
    quoteWhenMet: true,
  },
  {
    id: "g7-argument-structure",
    version: "1",
    question:
      "Is the essay organized as an introduction, body paragraphs and a conclusion, with transitions between them and a conclusion that restates the claim?",
    quoteWhenMet: false,
  },
  // A persuasive speech.
  {
    id: "g7-speech-opening",
    version: "1",
    question:
      "Does the speech open by speaking to its listeners and grabbing attention with a question, a picture or a story before stating the issue?",
    quoteWhenMet: true,
  },
  {
    id: "g7-speech-moves",
    version: "1",
    question:
      "Does the speech use at least two different moves to persuade, such as a personal story, a fact or statistic, or an answer to an objection?",
    quoteWhenMet: true,
  },
  {
    id: "g7-speech-call",
    version: "1",
    question: "Does the speech end with a call to action that tells listeners exactly what to do, and when or where?",
    quoteWhenMet: true,
  },
];
