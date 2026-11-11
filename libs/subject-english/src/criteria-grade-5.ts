import type { CriterionSpec } from "@ga/content";

/** GRADE_5_CRITERIA are the criteria new to the writing topics of the grade 5 course, with starting questions to be calibrated. */
export const GRADE_5_CRITERIA: readonly CriterionSpec[] = [
  // Writing up an experiment.
  {
    id: "g5-lab-question",
    version: "1",
    question: "Does the write-up state at its start the question the experiment set out to answer?",
    quoteWhenMet: true,
  },
  {
    id: "g5-lab-method",
    version: "1",
    question: "Does the write-up describe what was done in the order it was done, clearly enough for someone else to repeat it?",
    quoteWhenMet: false,
  },
  {
    id: "g5-lab-result",
    version: "1",
    question: "Does the write-up report what was observed or measured, kept apart from what the writer thinks it means?",
    quoteWhenMet: true,
  },
  {
    id: "g5-lab-conclusion",
    version: "1",
    question: "Does the write-up end with a conclusion that answers the question and that the reported results actually support?",
    quoteWhenMet: true,
  },
  // Answering with evidence from a text.
  {
    id: "g5-response-answer",
    version: "1",
    question: "Does the response begin with a clear, direct answer to the question asked about the passage?",
    quoteWhenMet: true,
  },
  {
    id: "g5-response-evidence",
    version: "1",
    question: "Does the response give a specific detail or a short, accurately quoted phrase from the passage as evidence for its answer?",
    quoteWhenMet: true,
  },
  {
    id: "g5-response-explains",
    version: "1",
    question: "Does the response explain in its own words how the evidence supports the answer, rather than only repeating the evidence?",
    quoteWhenMet: true,
  },
  // A report of three paragraphs.
  {
    id: "g5-report-preview",
    version: "1",
    question:
      "Does the introduction catch the reader's interest and then say what the report will cover, in the order the report covers it?",
    quoteWhenMet: true,
  },
  {
    id: "g5-report-sections",
    version: "1",
    question: "Does each body paragraph keep to one main point, stated near its start, without facts that belong to another paragraph?",
    quoteWhenMet: false,
  },
  {
    id: "g5-report-evidence",
    version: "1",
    question: "Are the main points supported by specific facts taken from the given notes or sources, rather than by general statements?",
    quoteWhenMet: true,
  },
  {
    id: "g5-report-conclusion",
    version: "1",
    question: "Does the report end with a conclusion that pulls its main points together without bringing in new facts?",
    quoteWhenMet: true,
  },
  // An opinion piece of several paragraphs.
  {
    id: "g5-opinion-reasons-ordered",
    version: "1",
    question:
      "Does the piece give at least two reasons, each in its own paragraph, in an order the reader can follow, such as saving the strongest for last?",
    quoteWhenMet: false,
  },
  {
    id: "g5-opinion-evidence",
    version: "1",
    question: "Is each reason supported by at least one fact, number or specific example?",
    quoteWhenMet: true,
  },
  {
    id: "g5-opinion-conclusion",
    version: "1",
    question: "Does the piece end with a conclusion that restates the opinion in new words and sums up the reasons?",
    quoteWhenMet: true,
  },
  // Writing about two texts.
  {
    id: "g5-twotexts-both",
    version: "1",
    question: "Does the writing use information from both texts, not just one of them?",
    quoteWhenMet: false,
  },
  {
    id: "g5-twotexts-connects",
    version: "1",
    question:
      "Does the writing say how the information of the two texts connects, agrees or differs, rather than only summarizing each text in turn?",
    quoteWhenMet: true,
  },
  {
    id: "g5-twotexts-evidence",
    version: "1",
    question: "Does the writing give at least one specific detail from each text, accurate to what the text says?",
    quoteWhenMet: true,
  },
  // A news article.
  {
    id: "g5-news-lead",
    version: "1",
    question: "Does the first sentence or two tell who, what, when and where, and does the article make clear why or how it happened?",
    quoteWhenMet: true,
  },
  {
    id: "g5-news-order",
    version: "1",
    question: "Do the facts come in order of importance, with the most important first and the smaller details later?",
    quoteWhenMet: false,
  },
  {
    id: "g5-news-quote",
    version: "1",
    question: "Does the article include a quotation from someone involved, in quotation marks and with the speaker named?",
    quoteWhenMet: true,
  },
  {
    id: "g5-news-objective",
    version: "1",
    question: "Does the article keep the writer's own opinions and feelings out, reporting facts in a formal style?",
    quoteWhenMet: false,
  },
  // A mystery.
  {
    id: "g5-mystery-puzzle",
    version: "1",
    question: "Does the story set up its puzzle early: something missing, strange or unexplained that a character sets out to solve?",
    quoteWhenMet: true,
  },
  {
    id: "g5-mystery-clues",
    version: "1",
    question:
      "Does the story place clues the reader can notice before the solution, and at least one red herring that points the wrong way?",
    quoteWhenMet: true,
  },
  {
    id: "g5-mystery-solution",
    version: "1",
    question: "Is the puzzle solved in a way that the clues given earlier explain, rather than by luck or by a fact the reader never saw?",
    quoteWhenMet: true,
  },
  // A personal narrative.
  {
    id: "g5-personal-pacing",
    version: "1",
    question:
      "Does the narrative slow down at its most important moment with detail or dialogue, and move quickly through the less important parts?",
    quoteWhenMet: true,
  },
  {
    id: "g5-personal-feelings",
    version: "1",
    question:
      "Does the narrative show what the writer felt at the time, through thoughts, actions or the body, not only by naming the feeling?",
    quoteWhenMet: true,
  },
  {
    id: "g5-personal-reflection",
    version: "1",
    question: "Does the narrative end by saying what the writer learned or how they changed because of the experience?",
    quoteWhenMet: true,
  },
  // A diary from history.
  {
    id: "g5-diary-voice",
    version: "1",
    question: "Is the diary written in the first person by an invented person of the past, as if on the day of each entry?",
    quoteWhenMet: false,
  },
  {
    id: "g5-diary-period",
    version: "1",
    question:
      "Does the diary include details true to its time and place, such as tools, work, travel or news of the period, without things that did not exist then?",
    quoteWhenMet: true,
  },
  {
    id: "g5-diary-feelings",
    version: "1",
    question: "Does the diary show the writer's feelings about the events they describe?",
    quoteWhenMet: true,
  },
  {
    id: "g5-diary-order",
    version: "1",
    question: "Does the diary have at least two dated entries, with the events in order of time?",
    quoteWhenMet: false,
  },
];
