import type { CriterionSpec } from "@ga/content";

/** c builds a criterion of grade 12 at version 1 that quotes the writing when met. */
const c = (id: string, question: string): CriterionSpec => ({ id, version: "1", question, quoteWhenMet: true });

/** GRADE_12_CRITERIA are the criteria new to the writing topics of the grade 12 course, with starting questions to be calibrated. */
export const GRADE_12_CRITERIA: readonly CriterionSpec[] = [
  // A profile of a person of conscience.
  c(
    "g12-profile-choice",
    "Is the profile built around the person's moral choice in the task, saying what they saw, what they were told to do, what they did instead and what it cost them, and does it open with a concrete scene or fact rather than a summary?",
  ),
  c(
    "g12-profile-detail",
    "Does the profile use the facts of the task accurately, including at least one number or specific detail and the person's own words, and explain what the quotation shows rather than leaving it to speak for itself?",
  ),
  c(
    "g12-profile-meaning",
    "Does the profile end by explaining why the choice matters beyond the person, to an institution or to people in general, without turning into empty praise or a sermon?",
  ),
  // A philosophical essay.
  c(
    "g12-philosophy-definition",
    "Does the essay define its key term in plain words with clear limits, not circularly and not in a way that builds in its own conclusion, and state a clear position on the question?",
  ),
  c(
    "g12-philosophy-case",
    "Does the essay test its position with a specific example or thought experiment and explain what most people's response to that case shows?",
  ),
  c(
    "g12-philosophy-objection",
    "Does the essay state the strongest objection to its position fairly and answer it with reasons, admitting what the objection gets right, before reaching a conclusion?",
  ),
  // A review of a work of art.
  c(
    "g12-review-description",
    "Does the review give an overall judgment and describe the work in the task briefly and accurately, so that a reader who has not seen it knows what it is?",
  ),
  c(
    "g12-review-reasons",
    "Does the review support its judgments by pointing to at least two specific features of the work and explaining the effect of each, rather than relying on strong words, popularity or fame?",
  ),
  c(
    "g12-review-verdict",
    "Does the review name at least one weakness of the work fairly and end with a clear verdict that says who the work is for?",
  ),
  // A comparison of translations.
  c(
    "g12-translation-claim",
    "Does the comparison open with a claim about the main difference between the two translations in the task and what that difference does, checked against the word-for-word gloss?",
  ),
  c(
    "g12-translation-evidence",
    "Does the comparison quote the specific words that differ from both translations and explain the effect of each choice on the reader, in word choice, sentence shape or meaning added or lost?",
  ),
  c(
    "g12-translation-judgment",
    "Does the comparison give each translation credit for what it does well and end with a reasoned judgment of which serves the original, or which kind of reader, better?",
  ),
  // A proposal to reduce a risk.
  c(
    "g12-proposal-risk",
    "Does the proposal state what it proposes and to whom, and show the size of the risk with the absolute numbers from the task, who is affected and a comparison, in calm words?",
  ),
  c(
    "g12-proposal-plan",
    "Does the proposal set out specific measures, say what each would do and what it costs using the figures in the task, and explain why they are worth the cost?",
  ),
  c(
    "g12-proposal-objection",
    "Does the proposal state the objection in the task fairly, answer it with reasons or numbers, and end by asking for a specific action?",
  ),
];
