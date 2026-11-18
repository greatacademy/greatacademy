import type { CriterionSpec } from "@ga/content";

/**
 * LEVEL_CRITERIA_A are the criteria of the paragraph writing of foreign-language levels 2 to 5 (docs/chinese-curriculum.md
 * §8.4), with starting questions to be calibrated against texts scored by teachers of Chinese. Their questions are in
 * English, as the core asks; the texts they are asked of are in Chinese, by learners of Chinese as a foreign language.
 */
export const LEVEL_CRITERIA_A: readonly CriterionSpec[] = [
  // Level 2: my day.
  {
    id: "zhl2-day-order",
    version: "1",
    question:
      "Does the paragraph tell the day, the routine or the home in a clear order, using words of time or place such as 早上, 先, 然后, 以后 or 晚上, without jumping back and forth?",
    quoteWhenMet: true,
  },
  {
    id: "zhl2-day-details",
    version: "1",
    question:
      "Does the paragraph say, for at least three parts of the day or the home, what is done or what is there, adding at least one detail such as where, with whom, what is eaten or how often (每天, 常常, 有时候)?",
    quoteWhenMet: true,
  },
  {
    id: "zhl2-day-language",
    version: "1",
    question:
      "Written by a beginning learner of Chinese, can the paragraph's sentences be understood without guessing, with the basic word order right (the time and the place before the verb, as in 我七点在家吃早饭), even if a few words are wrong?",
    quoteWhenMet: false,
  },
  // Level 2: a message to a friend.
  {
    id: "zhl2-message-form",
    version: "1",
    question:
      "Is the text written as a note or a text message to a friend: the friend's name on the first line followed by a colon or a greeting, the message in a few sentences, and the writer's name at the end?",
    quoteWhenMet: false,
  },
  {
    id: "zhl2-message-plan",
    version: "1",
    question:
      "Does the message make clear what the plan or the news is, when it is and where, and what the writer wants the friend to do, for example to come, to bring something or to answer?",
    quoteWhenMet: true,
  },
  {
    id: "zhl2-message-language",
    version: "1",
    question:
      "Written by a beginning learner of Chinese, can the message's sentences be understood without guessing, with the basic word order right and questions formed with 吗, 吧 or a question word, even if a few words are wrong?",
    quoteWhenMet: false,
  },
  // Level 3: an opinion and its reasons.
  {
    id: "zhl3-opinion-view",
    version: "1",
    question:
      "Does the paragraph answer the question of the task with one clear view near its beginning, such as 我认为…… or 我不同意……, and keep to that view to the end?",
    quoteWhenMet: true,
  },
  {
    id: "zhl3-opinion-reasons",
    version: "1",
    question:
      "Does the paragraph give at least two different reasons for the view, each explained in a sentence or more or shown with an example, rather than only named?",
    quoteWhenMet: true,
  },
  {
    id: "zhl3-opinion-language",
    version: "1",
    question:
      "Written by a learner of Chinese at an elementary level, can the paragraph's sentences be understood without guessing, with the reasons joined by words such as 因为, 所以, 而且, 但是 or 第一 and 第二, even if a few words are wrong?",
    quoteWhenMet: false,
  },
  // Level 3: telling what happened.
  {
    id: "zhl3-event-setting",
    version: "1",
    question:
      "Does the text say when the event happened, where, and who was there, concretely enough for a reader to picture it (for example 上个星期六上午 rather than only 有一天)?",
    quoteWhenMet: true,
  },
  {
    id: "zhl3-event-sequence",
    version: "1",
    question:
      "Does the text tell one event in the order it happened, with words such as 先, 然后, 后来 or 最后, and go on to how it ended or what came of it?",
    quoteWhenMet: false,
  },
  {
    id: "zhl3-event-language",
    version: "1",
    question:
      "Written by a learner of Chinese at an elementary level, can the text's sentences be understood without guessing, with 了 and 过 used for what happened often enough that the past is clear, even if a few words are wrong?",
    quoteWhenMet: false,
  },
  // Level 4: an account of a trip.
  {
    id: "zhl4-trip-order",
    version: "1",
    question:
      "Does the text tell the trip or the experience in order from its start to its end, with words of time or place leading from one part to the next, and with the most interesting part told in more detail than the rest?",
    quoteWhenMet: false,
  },
  {
    id: "zhl4-trip-feeling",
    version: "1",
    question:
      "Does the text say how the writer felt at one or more moments of the trip and why, or how the feeling changed, and end with what the trip meant to the writer?",
    quoteWhenMet: true,
  },
  {
    id: "zhl4-trip-language",
    version: "1",
    question:
      "Written by a learner of Chinese at an intermediate level, can the text's sentences be understood without guessing, with word order right and some longer sentences joined by words such as 虽然……但是, 一边……一边 or ……的时候, even if a few words are wrong?",
    quoteWhenMet: false,
  },
  // Level 4: explaining something.
  {
    id: "zhl4-explain-steps",
    version: "1",
    question:
      "Does the text explain how the thing of the task works, is done or comes about in a clear order of steps or of causes and results, marked with words such as 首先, 然后, 最后, 因为 or 所以?",
    quoteWhenMet: true,
  },
  {
    id: "zhl4-explain-clear",
    version: "1",
    question:
      "Could a reader who did not know the thing understand it from the text, which keeps to facts without clearly wrong statements and makes at least one point concrete with an example or a comparison?",
    quoteWhenMet: true,
  },
  {
    id: "zhl4-explain-language",
    version: "1",
    question:
      "Written by a learner of Chinese at an intermediate level, can the text's sentences be understood without guessing, with word order right and the words needed for the explanation used correctly, even if a few words are wrong?",
    quoteWhenMet: false,
  },
  // Level 5: a letter or an email.
  {
    id: "zhl5-letter-form",
    version: "1",
    question:
      "Does the letter or email have the form of a Chinese letter to a teacher, a school, a company or an office: the reader named on the first line with a fitting title and a colon, a greeting such as 您好, a closing wish such as 祝您工作顺利 or 此致敬礼, and the writer's name and the date at the end?",
    quoteWhenMet: false,
  },
  {
    id: "zhl5-letter-request",
    version: "1",
    question:
      "Does the letter say who the writer is and why they write, give the facts or reasons the reader needs, and make one clear, concrete request or suggestion?",
    quoteWhenMet: true,
  },
  {
    id: "zhl5-letter-language",
    version: "1",
    question:
      "Written by a learner of Chinese at an intermediate level, is the letter polite to its reader, using 您 and words such as 请 and 谢谢, and can its sentences be understood without guessing, even if a few words are wrong?",
    quoteWhenMet: false,
  },
  // Level 5: introducing a custom or a dish.
  {
    id: "zhl5-custom-what",
    version: "1",
    question:
      "Does the text say what the custom or dish is and when or where it belongs, and describe what people do or how it is made, in order and with concrete details?",
    quoteWhenMet: true,
  },
  {
    id: "zhl5-custom-meaning",
    version: "1",
    question:
      "Does the text explain what the custom or dish means, stands for or wishes for, or why people keep it, such as 团圆 or 健康长寿, rather than only describing it?",
    quoteWhenMet: true,
  },
  {
    id: "zhl5-custom-language",
    version: "1",
    question:
      "Written by a learner of Chinese at an intermediate level, can the text's sentences be understood without guessing, with word order right and its parts clearly joined, even if a few words are wrong?",
    quoteWhenMet: false,
  },
];
