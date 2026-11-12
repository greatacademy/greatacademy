import type { CriterionSpec } from "@ga/content";

/** GRADE_9_CRITERIA are the criteria new to the writing topics of the grade 9 course, with starting questions to be calibrated. */
export const GRADE_9_CRITERIA: readonly CriterionSpec[] = [
  // A hero's trial.
  {
    id: "g9-trial-stakes",
    version: "1",
    question:
      "Does the story make clear early on what the hero stands to lose or win in the trial set by the task, so that the reader feels the stakes?",
    quoteWhenMet: true,
  },
  {
    id: "g9-trial-choice",
    version: "1",
    question:
      "Does the hero face the trial through a choice or an action of his or her own, shown in a scene, rather than being saved by luck or by someone else?",
    quoteWhenMet: true,
  },
  {
    id: "g9-trial-change",
    version: "1",
    question:
      "Does the ending show how the trial has changed the hero, through a detail, an action or a line of thought, without stating a moral outright?",
    quoteWhenMet: true,
  },
  // An analysis of a soliloquy.
  {
    id: "g9-soliloquy-claim",
    version: "1",
    question:
      "Does the essay open with an arguable claim about what the soliloquy in the task reveals about the speaker, rather than a summary of what the speaker says?",
    quoteWhenMet: true,
  },
  {
    id: "g9-soliloquy-quotes",
    version: "1",
    question:
      "Does the essay quote at least two short phrases from the soliloquy, introduce them in its own sentences and explain how each supports the claim?",
    quoteWhenMet: true,
  },
  {
    id: "g9-soliloquy-language",
    version: "1",
    question:
      "Does the essay analyze at least one choice of language in the soliloquy, such as an image, a repeated word, a question or a shift in tone, and say what it shows?",
    quoteWhenMet: true,
  },
  // An analysis of a character.
  {
    id: "g9-character-claim",
    version: "1",
    question:
      "Does the essay state an arguable claim about the character in the passage given in the task, naming a trait or a change rather than retelling events?",
    quoteWhenMet: true,
  },
  {
    id: "g9-character-evidence",
    version: "1",
    question:
      "Does the essay support the claim with at least two details from the passage, such as actions, words or the reactions of others, each followed by an explanation?",
    quoteWhenMet: true,
  },
  {
    id: "g9-character-method",
    version: "1",
    question:
      "Does the essay say how the writer reveals the character, for example through a contrast with another character, a change, or what the character says compared with what he or she does?",
    quoteWhenMet: true,
  },
  // A coming-of-age narrative.
  {
    id: "g9-coming-turning-point",
    version: "1",
    question:
      "Does the narrative center on one turning point, shown as a scene with action or dialogue, in which the narrator sees something about the world or about himself or herself in a new way?",
    quoteWhenMet: true,
  },
  {
    id: "g9-coming-before-after",
    version: "1",
    question: "Does the narrative make clear how the narrator thought or acted before the turning point and how that changed after it?",
    quoteWhenMet: true,
  },
  {
    id: "g9-coming-reflection",
    version: "1",
    question:
      "Does the narrative end with a reflection that looks back on the experience and suggests its meaning, without stating a simple moral?",
    quoteWhenMet: true,
  },
  // Speculative fiction.
  {
    id: "g9-speculative-world",
    version: "1",
    question:
      "Does the story build the imagined world of the task through concrete details shown in scenes, rather than explaining it in a long block at the start?",
    quoteWhenMet: true,
  },
  {
    id: "g9-speculative-consequence",
    version: "1",
    question:
      "Does the story follow the main difference of its world to a consequence for a character, so that the difference matters to the plot?",
    quoteWhenMet: true,
  },
  {
    id: "g9-speculative-mirror",
    version: "1",
    question: "Does the story suggest, without stating it as a lecture, something about the present world or about being human?",
    quoteWhenMet: false,
  },
  // An argument with sources.
  {
    id: "g9-argument-claim",
    version: "1",
    question:
      "Does the essay state a clear, arguable claim that answers the question in the task and that is qualified where the evidence calls for it?",
    quoteWhenMet: true,
  },
  {
    id: "g9-argument-weighs-sources",
    version: "1",
    question:
      "Does the essay use at least two of the sources given in the task and judge how strong each one is, for example by noting the size of a study, who paid for it or whether it shows a cause?",
    quoteWhenMet: true,
  },
  {
    id: "g9-argument-counterclaim",
    version: "1",
    question:
      "Does the essay present a counterclaim fairly, with its best evidence, and then answer it with reasons or evidence before the conclusion?",
    quoteWhenMet: true,
  },
];
