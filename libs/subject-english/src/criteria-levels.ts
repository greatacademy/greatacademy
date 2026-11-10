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
  // A2: a message to a shop.
  {
    id: "a2-shop-problem",
    version: "1",
    question:
      "Does the message say what the writer bought, and what is wrong with it, such as that it is too small, broken or the wrong color?",
    quoteWhenMet: true,
  },
  {
    id: "a2-shop-request",
    version: "1",
    question:
      "Does the message say politely what the writer would like the shop to do, such as change the thing, repair it or give the money back, with words such as I would like or Could you?",
    quoteWhenMet: true,
  },
  // A2: an email to a friend.
  {
    id: "a2-email-answers",
    version: "1",
    question: "Does the email answer the friend's email: does it reply to their news or to at least one of their questions?",
    quoteWhenMet: true,
  },
  {
    id: "a2-email-news-and-question",
    version: "1",
    question: "Does the email give at least one piece of the writer's own news and ask the friend at least one question?",
    quoteWhenMet: true,
  },
  // A2: an invitation and a reply.
  {
    id: "a2-invitation-details",
    version: "1",
    question:
      "If the task asks for an invitation, does it say what the event is, when it is and where it is? If the task asks for a reply, does it say yes or no to the invitation, and give a reason when the answer is no?",
    quoteWhenMet: true,
  },
  // A2: a dream job.
  {
    id: "a2-job-and-reasons",
    version: "1",
    question: "Does the text name the job the writer would like and give at least two reasons for wanting it?",
    quoteWhenMet: true,
  },
  {
    id: "a2-job-steps",
    version: "1",
    question:
      "Does the text say at least one thing the writer will do or is going to do to get the job, such as study a subject or practice a skill?",
    quoteWhenMet: true,
  },
  // B1: an informal email.
  {
    id: "b1-informal-email-answers",
    version: "1",
    question: "Does the email answer every question in the friend's email, and react to their news?",
    quoteWhenMet: true,
  },
  {
    id: "b1-informal-email-news-and-plan",
    version: "1",
    question:
      "Does the email give some of the writer's own news and suggest a plan to do something together, with at least a time or a place?",
    quoteWhenMet: true,
  },
  {
    id: "b1-informal-tone",
    version: "1",
    question:
      "Is the tone friendly and informal throughout, as between friends, with an informal greeting and ending, and without stiff, formal phrases?",
    quoteWhenMet: true,
  },
  {
    id: "b1-email-paragraphs",
    version: "1",
    question:
      "Is the email set out as a greeting, two or more short paragraphs each about one main idea, and an ending with the writer's name?",
    quoteWhenMet: false,
  },
  // B1: a formal email.
  {
    id: "b1-formal-email-purpose",
    version: "1",
    question: "Does the email say near its start why the writer is writing, and does it cover every point that the task names?",
    quoteWhenMet: true,
  },
  {
    id: "b1-formal-register",
    version: "1",
    question:
      "Is the email formal throughout: an opening such as Dear Ms. Hall or Dear Sir or Madam, a closing such as Yours sincerely or Yours faithfully with the writer's full name, no short forms such as I'm or don't, and no slang?",
    quoteWhenMet: true,
  },
  {
    id: "b1-polite-requests",
    version: "1",
    question:
      "Does the email make at least one request, and make every request politely, with forms such as Could you…, I would be grateful if… or I would like to know…, rather than as an order?",
    quoteWhenMet: true,
  },
  // B1: an article.
  {
    id: "b1-article-title-and-opening",
    version: "1",
    question:
      "Does the article have a title, and does it open with something that catches the reader's interest, such as a question, a surprising fact or a short scene?",
    quoteWhenMet: true,
  },
  {
    id: "b1-article-paragraphs",
    version: "1",
    question:
      "After the opening, does the article have two or more paragraphs, each about one main idea on the topic the task names, joined with linking words?",
    quoteWhenMet: false,
  },
  {
    id: "b1-article-reader",
    version: "1",
    question:
      "Does the article speak to its readers, for example as you, and end with something for them, such as advice, a question or an invitation?",
    quoteWhenMet: true,
  },
  // B1: a story.
  {
    id: "b1-story-shape",
    version: "1",
    question:
      "Does the story begin with the sentence the task gives and go on from it, with a beginning that sets the scene, a problem or a surprise in the middle, and an ending that tells how it turned out?",
    quoteWhenMet: false,
  },
  {
    id: "b1-story-past-tenses",
    version: "1",
    question:
      "Is the story told in the past throughout, with the past simple for the main events and the past continuous or the past perfect where they fit, and without slipping into the present for the events?",
    quoteWhenMet: true,
  },
  {
    id: "b1-story-details",
    version: "1",
    question:
      "Does the story bring its events to life with details of what people saw, felt or said, such as a description, a feeling or a line of speech in quotation marks?",
    quoteWhenMet: true,
  },
  // B1: a letter of advice.
  {
    id: "b1-advice-understanding",
    version: "1",
    question: "Does the reply show near its start that the writer understands the problem in the letter and how its writer feels?",
    quoteWhenMet: true,
  },
  {
    id: "b1-advice-with-reasons",
    version: "1",
    question:
      "Does the reply give at least two different pieces of advice that fit the problem, each with a reason or a likely result, using forms such as I think you should, Why don't you or If you…?",
    quoteWhenMet: true,
  },
  {
    id: "b1-advice-kind-ending",
    version: "1",
    question: "Does the reply end kindly, with hope or encouragement for the writer of the letter, before the writer's name?",
    quoteWhenMet: true,
  },
  // B1: a summary.
  {
    id: "b1-summary-main-point",
    version: "1",
    question:
      "Does the summary state the main point of the whole source text, usually near its start, so that a reader who has not read the text knows what it is about?",
    quoteWhenMet: true,
  },
  {
    id: "b1-summary-key-details",
    version: "1",
    question:
      "Does the summary include the key facts, steps or reasons of the source text, leave out minor examples and repetition, and add no opinion or information that is not in the source?",
    quoteWhenMet: false,
  },
  {
    id: "b1-summary-own-words",
    version: "1",
    question:
      "Is the summary written mostly in the writer's own words, without copying whole sentences or long phrases of the source text?",
    quoteWhenMet: false,
  },
  // B1: a letter of complaint.
  {
    id: "b1-complaint-what-happened",
    version: "1",
    question:
      "Does the letter say near its start what it complains about, and then describe what happened with facts such as dates, places, prices or what the writer has already done?",
    quoteWhenMet: true,
  },
  {
    id: "b1-complaint-why-a-problem",
    version: "1",
    question: "Does the letter explain why what happened is a problem for the writer?",
    quoteWhenMet: true,
  },
  {
    id: "b1-complaint-what-you-want",
    version: "1",
    question:
      "Does the letter say clearly and politely what the writer wants the reader to do, such as a refund, a repair, a replacement or an explanation?",
    quoteWhenMet: true,
  },
  // B1: a review.
  {
    id: "b1-review-what-it-is",
    version: "1",
    question:
      "Does the review say near its start what it reviews, with its name and kind, such as a film, a book, a show or an exhibition, and briefly what it is about without giving away the ending?",
    quoteWhenMet: true,
  },
  {
    id: "b1-review-good-and-bad",
    version: "1",
    question:
      "Does the review describe at least one good point and at least one weaker point, each with a reason or an example, using describing words such as dramatic, dull, original or impressive?",
    quoteWhenMet: true,
  },
  {
    id: "b1-review-recommendation",
    version: "1",
    question: "Does the review end by saying clearly whether the writer recommends it and to whom, or for what kind of person?",
    quoteWhenMet: true,
  },
  // B2: shared by its formal texts.
  {
    id: "b2-neutral-register",
    version: "1",
    question:
      "Is the text written in a neutral or formal register throughout, without contractions, slang or emotional language, using impersonal phrases where they suit, such as It was found that or It is recommended that?",
    quoteWhenMet: false,
  },
  // B2: a report.
  {
    id: "b2-report-purpose",
    version: "1",
    question: "Does the report state in its opening section what it is about and why it was written, and who it is for?",
    quoteWhenMet: true,
  },
  {
    id: "b2-report-headings",
    version: "1",
    question:
      "Is the report divided into sections with short headings, such as Introduction, Findings and Recommendations, each section dealing with one part of the subject?",
    quoteWhenMet: false,
  },
  {
    id: "b2-report-findings",
    version: "1",
    question:
      "Does the report present what was found with specific facts, figures or examples, such as how many people said something, rather than only general statements?",
    quoteWhenMet: true,
  },
  {
    id: "b2-report-recommendations",
    version: "1",
    question: "Does the report end with clear, practical recommendations that follow from its findings?",
    quoteWhenMet: true,
  },
  // B2: essays.
  {
    id: "b2-essay-opinion",
    version: "1",
    question:
      "Does the introduction answer the question with a clear opinion, and does the rest of the essay keep to that opinion and support it, without changing sides?",
    quoteWhenMet: true,
  },
  {
    id: "b2-essay-body",
    version: "1",
    question:
      "Does the essay have at least two body paragraphs, each opening with a topic sentence that gives one main point and developing that point with an explanation and an example, a fact or other evidence?",
    quoteWhenMet: false,
  },
  {
    id: "b2-essay-conclusion",
    version: "1",
    question:
      "Does the essay end with a conclusion that restates its position in different words and sums up the main points, without adding a new argument?",
    quoteWhenMet: true,
  },
  {
    id: "b2-essay-linking",
    version: "1",
    question:
      "Are the paragraphs and sentences linked with a range of linking words and phrases, such as Firstly, Moreover, However, As a result and In conclusion, each used with its correct meaning?",
    quoteWhenMet: false,
  },
  {
    id: "b2-balanced-introduction",
    version: "1",
    question:
      "Does the introduction present the question the task gives and show that there are arguments on both sides, without yet taking a side?",
    quoteWhenMet: true,
  },
  {
    id: "b2-essay-balance",
    version: "1",
    question:
      "Does the essay give the arguments for and the arguments against in separate paragraphs, with each side given at least two points that are explained and supported, and with the side the writer disagrees with presented fairly?",
    quoteWhenMet: false,
  },
  {
    id: "b2-balanced-conclusion",
    version: "1",
    question:
      "Does the essay end with a conclusion that weighs the two sides and reaches a judgment, such as which side is stronger or under what conditions each is right, without adding a new argument?",
    quoteWhenMet: true,
  },
  // B2: proposals.
  {
    id: "b2-proposal-need",
    version: "1",
    question: "Does the proposal open by stating its purpose and the need or problem it answers, supported by a fact or an example?",
    quoteWhenMet: true,
  },
  {
    id: "b2-proposal-headings",
    version: "1",
    question:
      "Is the proposal divided into sections with short headings, such as Introduction, The proposal, How it would work and Why it should be chosen, each section dealing with one part of the plan?",
    quoteWhenMet: false,
  },
  {
    id: "b2-proposal-plan",
    version: "1",
    question:
      "Does the proposal say clearly what is proposed and how it would work in practice, with specific details such as who would do what, when, where or at what cost?",
    quoteWhenMet: false,
  },
  {
    id: "b2-proposal-benefits",
    version: "1",
    question:
      "Does the proposal explain why it should be chosen, giving specific benefits that follow from the plan, and end with a confident closing recommendation?",
    quoteWhenMet: true,
  },
  // B2: problem-solution essays.
  {
    id: "b2-problem-explained",
    version: "1",
    question:
      "Does the essay open by explaining the problem the task names, saying what causes it and who it affects, with a specific fact or example?",
    quoteWhenMet: true,
  },
  {
    id: "b2-problem-solutions",
    version: "1",
    question:
      "Does the essay propose two distinct solutions, each in its own paragraph, saying how it would work and what it would change?",
    quoteWhenMet: false,
  },
  {
    id: "b2-problem-drawbacks",
    version: "1",
    question:
      "Does the essay weigh each solution honestly, naming at least one limit, cost or difficulty of each rather than only its advantages?",
    quoteWhenMet: true,
  },
  {
    id: "b2-problem-judgment",
    version: "1",
    question:
      "Does the conclusion judge which solution would work better, or how the two should be combined, and give a reason that follows from the body of the essay?",
    quoteWhenMet: true,
  },
  // B2: letters to an editor.
  {
    id: "b2-editor-response",
    version: "1",
    question: "Does the letter open by naming the article it responds to and summing up in a sentence what the article said or proposed?",
    quoteWhenMet: true,
  },
  {
    id: "b2-editor-view",
    version: "1",
    question:
      "Does the letter state the writer's own view clearly near the start, and acknowledge fairly at least one point on the other side?",
    quoteWhenMet: true,
  },
  {
    id: "b2-editor-support",
    version: "1",
    question:
      "Is the view supported with specific reasons and evidence, such as figures, examples from other places or personal experience, each explained rather than only listed?",
    quoteWhenMet: false,
  },
  {
    id: "b2-editor-action",
    version: "1",
    question:
      "Does the letter propose specifically what should be done and by whom, and end with a closing line and a formal sign-off such as Yours faithfully?",
    quoteWhenMet: true,
  },
];
