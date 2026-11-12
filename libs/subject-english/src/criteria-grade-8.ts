import type { CriterionSpec } from "@ga/content";

/** GRADE_8_CRITERIA are the criteria new to the writing topics of the grade 8 course, with starting questions to be calibrated. */
export const GRADE_8_CRITERIA: readonly CriterionSpec[] = [
  // An argument about history.
  {
    id: "g8-history-claim",
    version: "1",
    question:
      "Does the essay state a clear, arguable claim that answers the historical question in the task, rather than only retelling events?",
    quoteWhenMet: true,
  },
  {
    id: "g8-history-sources",
    version: "1",
    question:
      "Does the essay quote or closely use at least two of the primary sources given in the task, introduce each with its speaker or writer, and explain how it supports the claim?",
    quoteWhenMet: true,
  },
  {
    id: "g8-history-other-view",
    version: "1",
    question: "Does the essay acknowledge a different view of the question, fairly and with evidence, and answer it before the conclusion?",
    quoteWhenMet: true,
  },
  // An informative report from sources.
  {
    id: "g8-sources-both",
    version: "1",
    question:
      "Does the report use facts from both sources given in the task and combine them, instead of summarizing one source and then the other?",
    quoteWhenMet: false,
  },
  {
    id: "g8-sources-credits",
    version: "1",
    question: "Does the report say which source a number or a key fact comes from, at least twice, with words such as according to?",
    quoteWhenMet: true,
  },
  {
    id: "g8-sources-objective",
    version: "1",
    question: "Does the report keep an objective tone, giving the facts accurately and leaving out the writer's own opinions?",
    quoteWhenMet: false,
  },
  // A scientific explanation.
  {
    id: "g8-science-claim",
    version: "1",
    question: "Does the explanation open with a claim that answers the scientific question in the task?",
    quoteWhenMet: true,
  },
  {
    id: "g8-science-reasoning",
    version: "1",
    question:
      "Does the explanation give evidence from the task's data and then reasoning that connects that evidence to the claim with a scientific idea?",
    quoteWhenMet: true,
  },
  {
    id: "g8-science-qualified",
    version: "1",
    question:
      "Does the explanation keep its claim within the evidence, with words such as most, suggests or in this study, and avoid both overstatement and empty hedging?",
    quoteWhenMet: true,
  },
  // A Gothic tale.
  {
    id: "g8-gothic-atmosphere",
    version: "1",
    question:
      "Does the tale build an atmosphere of dread through details of at least two senses, rather than by naming the feeling with words such as scary?",
    quoteWhenMet: true,
  },
  {
    id: "g8-gothic-elements",
    version: "1",
    question:
      "Does the tale use at least two Gothic elements, such as a gloomy old setting, a secret from the past, a hint of the supernatural or a character in danger?",
    quoteWhenMet: true,
  },
  // A scene for the stage.
  {
    id: "g8-scene-turn",
    version: "1",
    question: "Does the scene set up a conflict between characters and reach a turning point, where something changes, before it ends?",
    quoteWhenMet: true,
  },
  {
    id: "g8-scene-shows",
    version: "1",
    question:
      "Do the stage directions, in the present tense, show actions, sounds or lighting an audience can see or hear, instead of describing thoughts?",
    quoteWhenMet: true,
  },
  // A reflective essay.
  {
    id: "g8-reflect-moment",
    version: "1",
    question: "Does the essay tell a specific moment or experience with concrete details, rather than speaking only in general terms?",
    quoteWhenMet: true,
  },
  {
    id: "g8-reflect-then-now",
    version: "1",
    question: "Does the essay contrast how the writer saw things then with how they see them now, and say what changed their view?",
    quoteWhenMet: true,
  },
  {
    id: "g8-reflect-insight",
    version: "1",
    question: "Does the essay end with an insight about what the experience means, beyond a summary of what happened?",
    quoteWhenMet: true,
  },
  // An essay on a retold tale.
  {
    id: "g8-retold-pattern",
    version: "1",
    question:
      "Does the essay name the old tale and the modern story and identify a pattern, character type or event the modern story keeps?",
    quoteWhenMet: true,
  },
  {
    id: "g8-retold-change",
    version: "1",
    question:
      "Does the essay identify at least one thing the modern story changes, such as the setting, the hero or the ending, with details from the summaries?",
    quoteWhenMet: true,
  },
  {
    id: "g8-retold-meaning",
    version: "1",
    question: "Does the essay explain what the change does to the meaning of the story, rather than only listing the differences?",
    quoteWhenMet: true,
  },
];
