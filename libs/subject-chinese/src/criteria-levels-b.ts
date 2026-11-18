import type { CriterionSpec } from "@ga/content";

/**
 * LEVEL_CRITERIA_B are the criteria of the paragraph writing of foreign-language levels 6 to 9 (docs/chinese-curriculum.md
 * §8.4), with starting questions to be calibrated against texts scored by teachers of Chinese. Their questions are in
 * English, as the core asks; the texts they are asked of are in Chinese, by learners of Chinese as a foreign language.
 */
export const LEVEL_CRITERIA_B: readonly CriterionSpec[] = [
  // Level 6: comparing two things.
  {
    id: "zhl6-compare-points",
    version: "1",
    question:
      "Does the text compare the two things on at least two named points, such as cost, convenience or feelings, saying for each point how both of them are, rather than describing one thing and then the other?",
    quoteWhenMet: true,
  },
  {
    id: "zhl6-compare-conclusion",
    version: "1",
    question:
      "Does the text end with a conclusion that follows from the points compared, such as which the writer prefers and why, or when each one is the better choice, without bringing in a reason not mentioned before?",
    quoteWhenMet: true,
  },
  {
    id: "zhl6-compare-language",
    version: "1",
    question:
      "Is the text written in connected sentences that use words of comparison and order suited to an upper-intermediate learner, such as 比, 而, 相比之下, 首先……其次, 另外 or 总的来说, even if it has some errors?",
    quoteWhenMet: true,
  },
  // Level 6: arguing a view.
  {
    id: "zhl6-argue-reasons",
    version: "1",
    question:
      "Does the text state one clear view on the question of the task and support it with at least two reasons, at least one of them made concrete by an example?",
    quoteWhenMet: true,
  },
  {
    id: "zhl6-argue-objection",
    version: "1",
    question:
      "Does the text state one objection or opposing view, for example after 有人认为 or 也许有人会说, and answer it with a reason, rather than only repeating its own view?",
    quoteWhenMet: true,
  },
  {
    id: "zhl6-argue-language",
    version: "1",
    question:
      "Is the view argued in connected sentences with connectives suited to an upper-intermediate learner, such as 我认为, 首先……其次, 比如, 虽然……但是, 这话有一定的道理 or 所以, even if it has some errors?",
    quoteWhenMet: true,
  },
  // Level 7: describing a change.
  {
    id: "zhl7-change-contrast",
    version: "1",
    question:
      "Does the text describe both how the thing was before the change and how it is after it, with at least one concrete detail, such as a scene, a number or something people did, for each?",
    quoteWhenMet: true,
  },
  {
    id: "zhl7-change-causes",
    version: "1",
    question:
      "Does the text explain at least one cause of the change and at least one of its effects, linking them clearly to the change, for example with 由于, 之所以……是因为, 因此, 使 or 带来了?",
    quoteWhenMet: true,
  },
  {
    id: "zhl7-change-language",
    version: "1",
    question:
      "Is the text written in a fairly formal written register suited to an advanced learner, with expressions of time and change such as 过去, 如今, 随着, 越来越 and connectives of cause and result, even if it has some errors?",
    quoteWhenMet: true,
  },
  // Level 7: a review.
  {
    id: "zhl7-review-work",
    version: "1",
    question:
      "Does the review tell the reader what the work is, such as its kind and its title or maker, and briefly what it is about or looks like, without retelling all of it, and end with an overall judgement?",
    quoteWhenMet: true,
  },
  {
    id: "zhl7-review-evidence",
    version: "1",
    question:
      "Does the review name at least one strength and at least one weakness of the work, and support each with evidence from the work itself, such as a scene, a detail, a line or a feature?",
    quoteWhenMet: true,
  },
  {
    id: "zhl7-review-language",
    version: "1",
    question:
      "Is the review written in a written register suited to an advanced learner, with words of evaluation such as 优点, 不足, 值得, 然而, 总体来说, and connectives that tie each judgement to its evidence, even if it has some errors?",
    quoteWhenMet: true,
  },
  // Level 8: a problem and its solutions.
  {
    id: "zhl8-problem-causes",
    version: "1",
    question:
      "Does the report state the problem with facts, figures or cases that show how serious it is, and analyse at least two of its causes, rather than only describing the problem again?",
    quoteWhenMet: true,
  },
  {
    id: "zhl8-problem-proposals",
    version: "1",
    question:
      "Does the report put forward two or three concrete proposals, weigh what is good and what is difficult about each, and recommend one or a combination for reasons that follow from that weighing?",
    quoteWhenMet: true,
  },
  {
    id: "zhl8-problem-language",
    version: "1",
    question:
      "Is the report written in an objective, formal written register suited to an advanced learner, with the vocabulary of reports such as 据……统计, 目前, 造成, 针对, 措施, 建议 and clear links between its parts, even if it has some errors?",
    quoteWhenMet: true,
  },
  // Level 8: a commentary.
  {
    id: "zhl8-comment-thesis",
    version: "1",
    question:
      "Does the commentary state one clear thesis, a judgement about the question or the work rather than a topic, early in the text, keep to it throughout and return to it at the end?",
    quoteWhenMet: true,
  },
  {
    id: "zhl8-comment-analysis",
    version: "1",
    question:
      "Does the commentary support its thesis by analysing specific details, such as lines, scenes, passages or cases, and explaining how each bears on the thesis, rather than retelling the work or listing facts?",
    quoteWhenMet: true,
  },
  {
    id: "zhl8-comment-language",
    version: "1",
    question:
      "Is the commentary written in a formal written register suited to an advanced learner, with words of argument and evaluation such as 笔者认为, 固然……但, 值得注意的是, 由此可见, even if it has some errors?",
    quoteWhenMet: true,
  },
  // Level 9: an essay on an idea.
  {
    id: "zhl9-essay-thesis",
    version: "1",
    question:
      "Does the essay explain the idea of the task, such as what the saying or word means, and state in its introduction a clear thesis of its own about it, going beyond the explanation?",
    quoteWhenMet: true,
  },
  {
    id: "zhl9-essay-development",
    version: "1",
    question:
      "Is the essay organised into an introduction, a development in at least two connected stages, such as reasons, examples, a contrast or an objection answered, and a conclusion that draws the argument together?",
    quoteWhenMet: false,
  },
  {
    id: "zhl9-essay-register",
    version: "1",
    question:
      "Is the essay in a written register suited to a near-native learner, with written forms such as 之, 而, 即, 亦, 诚然, 由此可见, idioms or set phrases used correctly, and varied sentence patterns, even if it has a few errors?",
    quoteWhenMet: true,
  },
  // Level 9: formal applied writing.
  {
    id: "zhl9-formal-format",
    version: "1",
    question:
      "Does the text follow the format of its kind of applied writing: a title, an addressee followed by a colon where one belongs, the body, a proper closing such as 特此通知 or 此致 and 敬礼, and the sender and the date at the end?",
    quoteWhenMet: false,
  },
  {
    id: "zhl9-formal-content",
    version: "1",
    question:
      "Does the body state its purpose and give all the information the task calls for, such as time, place, participants, arrangements, requirements or contacts, clearly and in a sensible order, for example in numbered items?",
    quoteWhenMet: true,
  },
  {
    id: "zhl9-formal-register",
    version: "1",
    question:
      "Is the text in the formal, concise register of applied writing, with set expressions such as 为了, 兹定于, 现将……如下, 须, 敬请 or 予以, and without casual spoken words?",
    quoteWhenMet: true,
  },
];
