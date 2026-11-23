import type { CriterionSpec } from "@ga/content";

import { LEVEL_CRITERIA_A } from "./criteria-levels-a.ts";
import { LEVEL_CRITERIA_B } from "./criteria-levels-b.ts";

/**
 * WRITING_CRITERIA are the criteria of the judged writing of native grades 1 to 11, the essay of the Gaokao, its short answers on modern texts and its judged use of language (docs/chinese-curriculum.md §11 and §18.9): the
 * first written sentences of grades 1 and 2, W4 paragraphs and W5 compositions, with starting questions to be calibrated against texts scored by teachers of Chinese.
 * Their questions are in English, as the core asks; the texts they are asked of are in Chinese.
 */
export const WRITING_CRITERIA: readonly CriterionSpec[] = [
  // Grade 1: writing what one wants to say.
  {
    id: "zh1-say-self",
    version: "1",
    question:
      "Is the text, written in Chinese, made of complete sentences about the writer, saying something true of them such as their name, their family or what they do, as the task asks?",
    quoteWhenMet: true,
  },
  {
    id: "zh1-say-ends",
    version: "1",
    question:
      "Does each sentence say one whole thing and end with a full stop, a question mark or an exclamation mark, rather than running on without an end?",
    quoteWhenMet: false,
  },
  {
    id: "zh1-say-like",
    version: "1",
    question:
      "Does the text name the one thing the task asks about that the writer likes, and say at least two things about it, such as what it looks like, what it does or why the writer likes it?",
    quoteWhenMet: true,
  },
  // Grade 2: writing about a picture.
  {
    id: "zh2-picture-who",
    version: "1",
    question: "Does the text say who is in the scene the task describes, and where and when it is, as the scene shows?",
    quoteWhenMet: true,
  },
  {
    id: "zh2-picture-what",
    version: "1",
    question:
      "Does the text say what the people or animals in the scene are doing, keeping to what the scene shows and adding nothing that goes against it?",
    quoteWhenMet: true,
  },
  {
    id: "zh2-picture-order",
    version: "1",
    question:
      "Are the sentences in an order that makes sense, such as what happens first, next and last, so that they read as one connected piece rather than a list?",
    quoteWhenMet: false,
  },
  // Grade 2: writing what one imagines.
  {
    id: "zh2-imagine-like",
    version: "1",
    question:
      "Does the text say what the imagined thing of the task is like, with at least two details such as how it looks, how it sounds or what it can do?",
    quoteWhenMet: true,
  },
  {
    id: "zh2-imagine-happens",
    version: "1",
    question: "Does the text tell something that happens with the imagined thing, one event after another, rather than only describing it?",
    quoteWhenMet: true,
  },
  {
    id: "zh2-imagine-stays",
    version: "1",
    question: "Does every sentence keep to the imagined thing of the task, without wandering to something else?",
    quoteWhenMet: false,
  },
  // Grade 3: a paragraph about one idea.
  {
    id: "zh3-paragraph-idea",
    version: "1",
    question:
      "Does the paragraph, written in Chinese, open with or clearly state one main idea, such as a sentence telling what it is about?",
    quoteWhenMet: true,
  },
  {
    id: "zh3-paragraph-stays",
    version: "1",
    question: "Does every sentence of the paragraph help show that one idea, without wandering to something else?",
    quoteWhenMet: false,
  },
  {
    id: "zh3-paragraph-details",
    version: "1",
    question:
      "Does the paragraph show the idea with at least two concrete things, such as examples, actions or things seen, rather than saying it again in other words?",
    quoteWhenMet: true,
  },
  // Grade 3: an observation diary.
  {
    id: "zh3-diary-form",
    version: "1",
    question:
      "Is the text written as a diary entry: a first line with the date, the day of the week and the weather, then what happened that day, told by the writer?",
    quoteWhenMet: false,
  },
  {
    id: "zh3-diary-observed",
    version: "1",
    question:
      "Does the entry describe what the writer observed of the thing named in the task, with details such as its colour, shape, size or movement?",
    quoteWhenMet: true,
  },
  {
    id: "zh3-diary-change",
    version: "1",
    question:
      "Does the entry tell how the thing observed has changed or what the writer noticed for the first time, and how the writer felt or what they wondered about it?",
    quoteWhenMet: true,
  },
  // Grade 3: an imagined story.
  {
    id: "zh3-story-imagined",
    version: "1",
    question:
      "Does the text tell a story that is imagined, such as one in which animals or things talk or something impossible happens, with a beginning, what happens and an ending?",
    quoteWhenMet: true,
  },
  {
    id: "zh3-story-vivid",
    version: "1",
    question:
      "Does the story show what its characters do, say or feel at its main moment, in at least a few sentences, rather than only naming what happened?",
    quoteWhenMet: true,
  },
  {
    id: "zh3-story-stays",
    version: "1",
    question: "Does the story keep to the subject and the characters that the task gives, without wandering to something else?",
    quoteWhenMet: false,
  },
  // Grade 3: a note left for someone.
  {
    id: "zh3-note-form",
    version: "1",
    question:
      "Is the text set out as a Chinese note: the person it is for on the first line followed by a colon, the message, and the writer's name and the date or time at the end?",
    quoteWhenMet: false,
  },
  {
    id: "zh3-note-clear",
    version: "1",
    question:
      "Does the note say clearly what the reader needs to know or do, with the time, the place or the thing that matters, as the task asks?",
    quoteWhenMet: true,
  },
  {
    id: "zh3-note-polite",
    version: "1",
    question: "Is the note polite and does it suit the person it is for, for example with 请, 谢谢 or 您 where they fit?",
    quoteWhenMet: true,
  },
  // Grade 3: something one likes.
  {
    id: "zh3-thing-look",
    version: "1",
    question:
      "Does the text describe what the thing looks like with at least two concrete details, such as its colour, shape, size or parts?",
    quoteWhenMet: true,
  },
  {
    id: "zh3-thing-why",
    version: "1",
    question:
      "Does the text make clear why the writer likes the thing, through what it can do, how the writer uses it or something that happened with it?",
    quoteWhenMet: true,
  },
  {
    id: "zh3-thing-stays",
    version: "1",
    question: "Does every part of the text keep to the one thing of the task, without wandering to something else?",
    quoteWhenMet: false,
  },
  // Grade 4: telling an event.
  {
    id: "zh4-event-parts",
    version: "1",
    question:
      "Does the text tell one event with its beginning (what started it), its course (what happened) and its end (how it came out), in that order?",
    quoteWhenMet: false,
  },
  {
    id: "zh4-event-detail",
    version: "1",
    question:
      "Is the course of the event told in detail, with what people did, said or thought at its most important moment, rather than in one or two sentences?",
    quoteWhenMet: true,
  },
  {
    id: "zh4-event-feeling",
    version: "1",
    question:
      "Does the text show how the writer felt about the event or what they learned from it, in a way that follows from what happened?",
    quoteWhenMet: true,
  },
  // Grade 4: a letter.
  {
    id: "zh4-letter-form",
    version: "1",
    question:
      "Does the letter follow the form of a Chinese letter: the person written to on the first line followed by a colon, a greeting, the body, a closing wish such as 祝你 or 此致 and the wish itself on lines of their own, and the writer's name and the date at the end?",
    quoteWhenMet: false,
  },
  {
    id: "zh4-letter-purpose",
    version: "1",
    question: "Is it clear why the letter was written, and does its body keep to that purpose and suit the person written to?",
    quoteWhenMet: true,
  },
  {
    id: "zh4-letter-detail",
    version: "1",
    question: "Does the body give concrete news, reasons or questions that the reader would want to know, rather than only general words?",
    quoteWhenMet: true,
  },
  // Grade 4: an observation.
  {
    id: "zh4-observe-detail",
    version: "1",
    question:
      "Does the text give concrete details of what was observed, seen, heard, touched or smelt, such as its colour, shape, size or movements, rather than only saying it is nice?",
    quoteWhenMet: true,
  },
  {
    id: "zh4-observe-change",
    version: "1",
    question:
      "Does the text tell how the thing changed or what it did over time, in a clear order, such as day by day, from morning to night or season by season?",
    quoteWhenMet: true,
  },
  {
    id: "zh4-observe-stays",
    version: "1",
    question: "Does every part of the text keep to the one thing observed in the task, without wandering to something else?",
    quoteWhenMet: false,
  },
  // Grade 4: continuing a story.
  {
    id: "zh4-continue-follows",
    version: "1",
    question:
      "Does the story go on from the beginning given in the task, with the same characters and what has already happened, without contradicting it?",
    quoteWhenMet: true,
  },
  {
    id: "zh4-continue-ends",
    version: "1",
    question: "Does the story come to an ending in which what began in the given beginning is resolved?",
    quoteWhenMet: true,
  },
  {
    id: "zh4-continue-vivid",
    version: "1",
    question:
      "At the main moment of the story, does the text show what the characters do, say or feel, rather than telling it in a single sentence?",
    quoteWhenMet: true,
  },
  // Grade 4: a place.
  {
    id: "zh4-place-look",
    version: "1",
    question:
      "Does the text show what the place is like with at least two concrete details, such as its sights, sounds or what is found there?",
    quoteWhenMet: true,
  },
  {
    id: "zh4-place-why",
    version: "1",
    question:
      "Does the text make clear why the place is good or dear to the writer, through what one can do there or something that happened there?",
    quoteWhenMet: true,
  },
  {
    id: "zh4-place-order",
    version: "1",
    question:
      "Does the text describe the place in a clear order, such as part by part, from near to far or by the way one walks through it?",
    quoteWhenMet: false,
  },
  // Grade 5: writing about a person.
  {
    id: "zh5-person-trait",
    version: "1",
    question: "Does the text make clear one main quality of the person it is about, such as being patient, brave or careless?",
    quoteWhenMet: true,
  },
  {
    id: "zh5-person-example",
    version: "1",
    question:
      "Does the text show that quality through at least one concrete event the person took part in, told so that the quality can be seen in it?",
    quoteWhenMet: true,
  },
  {
    id: "zh5-person-description",
    version: "1",
    question:
      "Does the text describe the person's actions, words, looks or expressions in a way that brings out the quality, rather than only naming it?",
    quoteWhenMet: true,
  },
  // Grade 5: explaining a thing.
  {
    id: "zh5-explain-features",
    version: "1",
    question:
      "Does the text explain the thing named in the task by its features, such as what it looks like, what it is made of, how it works or what it is used for, each part about one feature?",
    quoteWhenMet: false,
  },
  {
    id: "zh5-explain-methods",
    version: "1",
    question:
      "Does the text use at least one method of explaining, such as giving numbers, comparing with something familiar, giving an example or classifying?",
    quoteWhenMet: true,
  },
  {
    id: "zh5-explain-plain",
    version: "1",
    question:
      "Is the explanation plain and accurate, without statements that are clearly wrong and without a story or feelings taking the place of the explanation?",
    quoteWhenMet: false,
  },
  // Grade 6: an argument.
  {
    id: "zh6-argue-claim",
    version: "1",
    question: "Does the text state one clear view on the question of the task, near its beginning?",
    quoteWhenMet: true,
  },
  {
    id: "zh6-argue-evidence",
    version: "1",
    question:
      "Does the text support the view with at least two pieces of evidence, such as examples, facts or sayings, that really bear on it?",
    quoteWhenMet: true,
  },
  {
    id: "zh6-argue-reasoning",
    version: "1",
    question:
      "Does the text explain how its evidence supports the view, and end by coming back to the view, rather than only listing examples?",
    quoteWhenMet: false,
  },
  // Grade 6: a scene.
  {
    id: "zh6-scene-order",
    version: "1",
    question: "Does the text describe the scene in a clear order, such as from near to far, from top to bottom, or as time passes?",
    quoteWhenMet: false,
  },
  {
    id: "zh6-scene-senses",
    version: "1",
    question:
      "Does the description use at least two senses, such as what is seen and what is heard or smelled, and at least one comparison or other figure of speech?",
    quoteWhenMet: true,
  },
  {
    id: "zh6-scene-feeling",
    version: "1",
    question:
      "Does the text carry a feeling through the scene, so that what is described shows the writer's mood, and does it say or make clear what that feeling is?",
    quoteWhenMet: true,
  },
  // Grade 5: an imaginative composition.
  {
    id: "zh5-imagine-world",
    version: "1",
    question:
      "Is the story built on something that could not happen in real life, as the task gives it, and does it keep to the rules of that imagined world from beginning to end?",
    quoteWhenMet: true,
  },
  {
    id: "zh5-imagine-plot",
    version: "1",
    question:
      "Does the story have a clear course: a beginning, a difficulty or turn that the characters meet, and an ending in which it is settled?",
    quoteWhenMet: true,
  },
  {
    id: "zh5-imagine-detail",
    version: "1",
    question:
      "Are the imagined things and the main moment described concretely, with what they look like, how they work, or what the characters do and say, rather than only named?",
    quoteWhenMet: true,
  },
  // Grade 5: reading notes.
  {
    id: "zh5-notes-source",
    version: "1",
    question:
      "Does the note name the book or text it is about, and copy out or sum up a part of it that agrees with the text the task gives or with the well-known book?",
    quoteWhenMet: true,
  },
  {
    id: "zh5-notes-pick",
    version: "1",
    question:
      "Does the note say why the part it chose is worth noting, pointing to something particular in it such as a word, a deed or a way of telling?",
    quoteWhenMet: true,
  },
  {
    id: "zh5-notes-own",
    version: "1",
    question: "Does the note add the writer's own thought, question or plan that comes from that part, rather than only repeating it?",
    quoteWhenMet: true,
  },
  // Grade 5: notices and announcements.
  {
    id: "zh5-notice-form",
    version: "1",
    question:
      "Is the text set out as a Chinese notice or announcement: a title such as 通知, 寻物启事 or 失物招领 on the first line, then the body, and at the end who issues it and the date?",
    quoteWhenMet: false,
  },
  {
    id: "zh5-notice-complete",
    version: "1",
    question:
      "Does the notice give everything its readers need for what the task asks, such as what, when, where, who, and how to get in touch or what to bring?",
    quoteWhenMet: true,
  },
  {
    id: "zh5-notice-brief",
    version: "1",
    question:
      "Is the notice brief and plain, keeping to what readers need without a story or feelings, in words that suit a public notice?",
    quoteWhenMet: false,
  },
  // Grade 6: a true event, truly felt.
  {
    id: "zh6-event-whole",
    version: "1",
    question:
      "Does the text tell one event the writer could really have lived through, making clear when and where it happened, who was there, how it began, how it went and how it ended?",
    quoteWhenMet: true,
  },
  {
    id: "zh6-event-detail",
    version: "1",
    question:
      "Is the most important part of the event told in detail, with what people did, said and thought, rather than summed up in a sentence?",
    quoteWhenMet: true,
  },
  {
    id: "zh6-event-feeling",
    version: "1",
    question:
      "Does the text show a sincere feeling or thought that grows out of the event itself, rather than a general slogan that could end any story?",
    quoteWhenMet: true,
  },
  // Grade 6: thoughts after reading.
  {
    id: "zh6-reflect-summary",
    version: "1",
    question:
      "Does the text say briefly what was read, with its title and its main content in a few sentences, without retelling the whole of it?",
    quoteWhenMet: true,
  },
  {
    id: "zh6-reflect-point",
    version: "1",
    question:
      "Does the text pick out one thing in the reading that moved or struck the writer, and state clearly the thought it gave them?",
    quoteWhenMet: true,
  },
  {
    id: "zh6-reflect-link",
    version: "1",
    question:
      "Does the text connect that thought with the writer's own life or the world around them through at least one concrete example, and come back to the reading at the end?",
    quoteWhenMet: true,
  },
  // Grade 6: an activity plan and an activity summary.
  {
    id: "zh6-plan-parts",
    version: "1",
    question:
      "Is the text set out as a plan or a summary: a title naming the activity, then its parts in order, such as purpose, time and place, people and steps for a plan, or what was done, how it went and what was learned for a summary?",
    quoteWhenMet: false,
  },
  {
    id: "zh6-plan-concrete",
    version: "1",
    question: "Is the text concrete enough to act on or to check, with dates, places, numbers, and who does or did what?",
    quoteWhenMet: true,
  },
  {
    id: "zh6-plan-review",
    version: "1",
    question: "Does the summary say what went well and what did not, each with a reason, and what to do differently next time?",
    quoteWhenMet: true,
  },
  // Grade 7: making the centre stand out.
  {
    id: "zh7-center-clear",
    version: "1",
    question:
      "Does the text have one clear central idea, about a person, an event or a feeling, that a reader could state after reading it?",
    quoteWhenMet: true,
  },
  {
    id: "zh7-center-material",
    version: "1",
    question: "Is the material chosen to serve that central idea, with nothing included that has no bearing on it?",
    quoteWhenMet: false,
  },
  {
    id: "zh7-center-emphasis",
    version: "1",
    question: "Is the part that best shows the central idea told in detail, and the other parts told briefly?",
    quoteWhenMet: true,
  },
  // Grade 7: details.
  {
    id: "zh7-detail-telling",
    version: "1",
    question:
      "Does the text include at least one closely observed detail, of an action, an expression, a word said or an object, described precisely rather than in general terms?",
    quoteWhenMet: true,
  },
  {
    id: "zh7-detail-meaning",
    version: "1",
    question:
      "Does that detail reveal something about a person's character or feeling, or about the meaning of the event, rather than being decoration?",
    quoteWhenMet: true,
  },
  {
    id: "zh7-detail-whole",
    version: "1",
    question: "Does the text tell one event or show one person completely and in a clear order, so that the detail sits inside a whole?",
    quoteWhenMet: false,
  },
  // Grade 7: writing with feeling.
  {
    id: "zh7-feeling-source",
    version: "1",
    question:
      "Does the feeling grow out of a real experience, person, thing or scene of the writer's life that the text tells concretely, as the task asks?",
    quoteWhenMet: true,
  },
  {
    id: "zh7-feeling-carry",
    version: "1",
    question:
      "Is the feeling carried by what is told and described, such as a scene, an object, an action or a detail, rather than only named, with at least one passage in which a description itself conveys it?",
    quoteWhenMet: true,
  },
  {
    id: "zh7-feeling-express",
    version: "1",
    question:
      "Is the feeling also said outright at a fitting point, such as the climax or the end, in the writer's own sincere words that agree with what came before, rather than in a borrowed slogan?",
    quoteWhenMet: true,
  },
  // Grade 7: expanding and condensing.
  {
    id: "zh7-rewrite-faithful",
    version: "1",
    question:
      "Does the text keep to the original the task gives: its people, events, order and ending, all of them when expanding and the main ones when condensing, without changing or contradicting them?",
    quoteWhenMet: true,
  },
  {
    id: "zh7-expand-detail",
    version: "1",
    question:
      "Does the expansion add concrete, fitting detail the original only implies, such as the scene, actions, words, looks and thoughts of the people, so that the key moments can be seen, reaching the length the task asks?",
    quoteWhenMet: true,
  },
  {
    id: "zh7-condense-brief",
    version: "1",
    question:
      "Is the condensed text within the length the task asks, dropping description and minor detail, and joined into a smooth whole in plain words rather than a string of copied fragments?",
    quoteWhenMet: false,
  },
  // Grade 7: association and imagination.
  {
    id: "zh7-imagine-link",
    version: "1",
    question:
      "Does the text start from the thing, picture, word or situation the task gives, and lead from it by association or imagination along links a reader can follow?",
    quoteWhenMet: true,
  },
  {
    id: "zh7-imagine-vivid",
    version: "1",
    question: "Are the imagined or associated scenes described concretely, with what is seen, heard or felt, rather than only listed?",
    quoteWhenMet: true,
  },
  {
    id: "zh7-imagine-meaning",
    version: "1",
    question:
      "Does the imagining carry a feeling or thought and come back to real life by the end, rather than drifting from one fancy to the next?",
    quoteWhenMet: true,
  },
  // Grade 7: applications and suggestions.
  {
    id: "zh7-practical-form",
    version: "1",
    question:
      "Is the text set out as a Chinese application or letter of suggestion: a title such as 申请书 or 建议书, the addressee at the margin with a colon, the body, a closing such as 此致 and 敬礼, and the writer's name and the date at the bottom right?",
    quoteWhenMet: false,
  },
  {
    id: "zh7-practical-reason",
    version: "1",
    question:
      "Does the text say plainly what is asked for or suggested, and give real reasons for it, such as the facts of the situation or the problem it would solve?",
    quoteWhenMet: true,
  },
  {
    id: "zh7-practical-concrete",
    version: "1",
    question:
      "Does the text give concrete, workable steps, for a suggestion the measures proposed and for an application what the writer will do, set out one by one, in a respectful tone that suits its reader?",
    quoteWhenMet: true,
  },
  // Grade 8: explaining in order.
  {
    id: "zh8-explain-feature",
    version: "1",
    question: "Does the explanation grasp the main features of the thing named in the task, the ones that make it what it is?",
    quoteWhenMet: true,
  },
  {
    id: "zh8-explain-order",
    version: "1",
    question:
      "Does the explanation follow a clear order, in space, in time or in logic, that the reader can follow from paragraph to paragraph?",
    quoteWhenMet: false,
  },
  {
    id: "zh8-explain-accurate",
    version: "1",
    question:
      "Is the language accurate, with qualifying words such as 大约 or 一般 where a statement is not always true, and with no statement that is clearly wrong?",
    quoteWhenMet: false,
  },
  // Grade 8: a speech.
  {
    id: "zh8-speech-audience",
    version: "1",
    question:
      "Is the text written as a speech to the audience of the task, with a form of address at the start and a closing such as thanks at the end?",
    quoteWhenMet: false,
  },
  {
    id: "zh8-speech-view",
    version: "1",
    question: "Does the speech put forward one clear view or appeal and support it with reasons or examples?",
    quoteWhenMet: true,
  },
  {
    id: "zh8-speech-spoken",
    version: "1",
    question:
      "Does the speech suit being spoken: addressing the listeners directly, in sentences easy to follow by ear, with at least one device such as a question to the audience, repetition or a call to act?",
    quoteWhenMet: true,
  },
  // Grade 8: news.
  {
    id: "zh8-news-form",
    version: "1",
    question:
      "Is the text set out as a news report: a headline that states the main fact, a lead that gives when, where, who and what happened in a sentence or two, then a body that tells it more fully?",
    quoteWhenMet: false,
  },
  {
    id: "zh8-news-facts",
    version: "1",
    question:
      "Does the report tell facts the reader could check, such as times, numbers, names and what people did or said, with the writer's own opinion kept out or limited to a short closing?",
    quoteWhenMet: true,
  },
  {
    id: "zh8-news-order",
    version: "1",
    question:
      "Does the report put the most important fact first and the rest after it in order of importance, keeping to the one event of the task without wandering?",
    quoteWhenMet: false,
  },
  // Grade 8: travel writing.
  {
    id: "zh8-travel-route",
    version: "1",
    question:
      "Is the route of the visit clear, the reader always knowing where the writer is, with words of moving such as 走进, 沿着 or 登上 that lead from one place to the next?",
    quoteWhenMet: true,
  },
  {
    id: "zh8-travel-scene",
    version: "1",
    question:
      "Does the writing pick out and describe in concrete detail what is special about the main sights, rather than listing every place in the same few words?",
    quoteWhenMet: true,
  },
  {
    id: "zh8-travel-feeling",
    version: "1",
    question:
      "Does the writer's own feeling or thought about the place come through, woven into the scenes or said at the end, so that it grows from what was seen?",
    quoteWhenMet: true,
  },
  // Grade 8: rewriting.
  {
    id: "zh8-rewrite-faithful",
    version: "1",
    question:
      "Does the rewriting keep the people, the events, the ending and the meaning of the original the task gives, contradicting none of them?",
    quoteWhenMet: false,
  },
  {
    id: "zh8-rewrite-change",
    version: "1",
    question:
      "Does the rewriting make the change the task asks for, such as telling it in another person, in another order or in another form, and keep to that change throughout?",
    quoteWhenMet: true,
  },
  {
    id: "zh8-rewrite-detail",
    version: "1",
    question:
      "Does the rewriting fill out the original with fitting detail, scenes, actions, words and thoughts that suit its time and people, so that it reads as a whole new piece?",
    quoteWhenMet: true,
  },
  // Grade 8: a simple research report.
  {
    id: "zh8-report-form",
    version: "1",
    question:
      "Is the text set out as a simple research report, with a title and parts for the question, the method, the findings and the conclusion?",
    quoteWhenMet: false,
  },
  {
    id: "zh8-report-findings",
    version: "1",
    question:
      "Does the report say how the information was gathered and give concrete findings, such as figures, observations or what sources say, naming the sources it uses?",
    quoteWhenMet: true,
  },
  {
    id: "zh8-report-conclusion",
    version: "1",
    question:
      "Does the conclusion follow from the findings and answer the question the report set, without claiming more than they show, and does any suggestion fit them?",
    quoteWhenMet: true,
  },
  // Grade 9: an argument.
  {
    id: "zh9-argue-thesis",
    version: "1",
    question: "Does the essay state one clear and sound central claim on the question of the task, early in the text?",
    quoteWhenMet: true,
  },
  {
    id: "zh9-argue-evidence",
    version: "1",
    question: "Does the essay support the claim with evidence, facts, examples or sound reasoning, that really bears on it?",
    quoteWhenMet: true,
  },
  {
    id: "zh9-argue-methods",
    version: "1",
    question:
      "Does the essay use at least two methods of argument, such as giving examples, reasoning, contrast or analogy, and explain how the evidence proves the claim?",
    quoteWhenMet: true,
  },
  // Grade 9: a full narrative.
  {
    id: "zh9-story-thread",
    version: "1",
    question:
      "Is the narrative held together by a clear thread or order, such as an object, a feeling or the passing of time, that links its parts?",
    quoteWhenMet: false,
  },
  {
    id: "zh9-story-detail",
    version: "1",
    question: "Is the key scene described vividly, through actions, words, thoughts or the surroundings?",
    quoteWhenMet: true,
  },
  {
    id: "zh9-story-theme",
    version: "1",
    question: "Does a theme emerge from the story itself, and does the ending bring it out without a moral simply tacked on?",
    quoteWhenMet: true,
  },
  // Grade 9: a modern poem with a note on how it was made.
  {
    id: "zh9-poem-image",
    version: "1",
    question:
      "Does the poem carry its feeling or thought through concrete images, rather than stating it outright, and do the images fit together?",
    quoteWhenMet: true,
  },
  {
    id: "zh9-poem-form",
    version: "1",
    question:
      "Is the poem set out in lines and stanzas of at least the length the task asks, with breaks, repetition or rhythm that serve its sense rather than prose cut into pieces?",
    quoteWhenMet: true,
  },
  {
    id: "zh9-poem-note",
    version: "1",
    question:
      "Does the note on how the poem was made name its images and methods and say truly what they carry, matching the poem as written?",
    quoteWhenMet: true,
  },
  // Grade 9: a very short story.
  {
    id: "zh9-short-focus",
    version: "1",
    question:
      "Is the story built on a few people and one or two closely linked scenes, told economically, without side events that lead nowhere?",
    quoteWhenMet: false,
  },
  {
    id: "zh9-short-turn",
    version: "1",
    question:
      "Does the story turn at or near its end in a way that surprises yet is prepared for by earlier details, so that it makes sense on rereading?",
    quoteWhenMet: true,
  },
  {
    id: "zh9-short-people",
    version: "1",
    question:
      "Are the people shown through a telling detail, action or line of speech, so that the theme comes out of them rather than being explained?",
    quoteWhenMet: true,
  },
  // Grade 9: a review.
  {
    id: "zh9-review-object",
    version: "1",
    question:
      "Does the review say clearly what it judges, a work, a person in it or a matter of life, and give briefly only what the reader needs to follow the judgment?",
    quoteWhenMet: false,
  },
  {
    id: "zh9-review-judgment",
    version: "1",
    question: "Does the review make one clear judgment of its own, stated early, rather than only retelling or describing?",
    quoteWhenMet: true,
  },
  {
    id: "zh9-review-grounds",
    version: "1",
    question:
      "Is the judgment argued from the thing reviewed, its lines, events or facts, fairly, granting what speaks on the other side before answering it?",
    quoteWhenMet: true,
  },
  // Grade 9: a refutation.
  {
    id: "zh9-refute-target",
    version: "1",
    question: "Does the essay state the view it refutes fairly and clearly, and say early that, and in short why, it is wrong?",
    quoteWhenMet: true,
  },
  {
    id: "zh9-refute-flaw",
    version: "1",
    question:
      "Does the essay show where the view goes wrong, in its claim, its grounds or its reasoning, with facts and reasons that bear on that very fault?",
    quoteWhenMet: true,
  },
  {
    id: "zh9-refute-stand",
    version: "1",
    question:
      "Does the essay, having refuted the view, set up a sound view of its own and grant what is right in the other, without overstating either?",
    quoteWhenMet: true,
  },
  // Grade 10: writing on given material.
  {
    id: "zh10-task-material",
    version: "1",
    question: "Is the essay's view drawn from the material and the task given, rather than from a topic the material does not raise?",
    quoteWhenMet: true,
  },
  {
    id: "zh10-task-depth",
    version: "1",
    question:
      "Does the argument develop in stages, for example from what the matter is to why it matters and what to do, rather than repeating the same point?",
    quoteWhenMet: false,
  },
  {
    id: "zh10-task-evidence",
    version: "1",
    question: "Is the evidence specific and relevant, and is each piece analysed to show how it supports the view?",
    quoteWhenMet: true,
  },
  // Grade 10: a commentary.
  {
    id: "zh10-comment-event",
    version: "1",
    question:
      "Does the commentary state the event or phenomenon of the task briefly and accurately, without inventing facts that change it?",
    quoteWhenMet: false,
  },
  {
    id: "zh10-comment-view",
    version: "1",
    question: "Does the commentary take one clear, reasoned view of it, avoiding sweeping or extreme judgments?",
    quoteWhenMet: true,
  },
  {
    id: "zh10-comment-analysis",
    version: "1",
    question: "Does the commentary analyse causes or consequences and end with a reasoned suggestion or conclusion?",
    quoteWhenMet: true,
  },
  // Grade 11: weighing both sides.
  {
    id: "zh11-dialectic-sides",
    version: "1",
    question: "Does the essay consider more than one side of the question, or the conditions under which each holds?",
    quoteWhenMet: true,
  },
  {
    id: "zh11-dialectic-position",
    version: "1",
    question:
      "Does the essay reach a reasoned position of its own that takes account of both sides, rather than only saying that both have a point?",
    quoteWhenMet: true,
  },
  {
    id: "zh11-dialectic-reasoning",
    version: "1",
    question: "Are the steps of reasoning clearly linked, with concessions, conditions or contrasts where the argument turns?",
    quoteWhenMet: false,
  },
  // Grade 11: a proposal.
  {
    id: "zh11-proposal-form",
    version: "1",
    question:
      "Does the text follow the form of a proposal (倡议书): a title, the people addressed, the body, then the proposer and the date at the end?",
    quoteWhenMet: false,
  },
  {
    id: "zh11-proposal-reason",
    version: "1",
    question: "Does the proposal explain the background and the reasons for what it proposes?",
    quoteWhenMet: true,
  },
  {
    id: "zh11-proposal-actions",
    version: "1",
    question: "Does the proposal give concrete, feasible actions, set out clearly, and end with a call to act?",
    quoteWhenMet: true,
  },
  // The Gaokao essay.
  {
    id: "zhgk-essay-thesis",
    version: "1",
    question: "Does the essay answer the material and task of the prompt with a clear, apt thesis, without straying from them?",
    quoteWhenMet: true,
  },
  {
    id: "zhgk-essay-structure",
    version: "1",
    question:
      "Is the essay complete and well organised, with paragraphs that each do one job and a progression from opening to conclusion?",
    quoteWhenMet: false,
  },
  {
    id: "zhgk-essay-argument",
    version: "1",
    question: "Does the essay argue with substance: apt evidence, analysed, and reasoning that goes beyond the obvious?",
    quoteWhenMet: true,
  },
  // The short answers of the Gaokao's reading of modern texts.
  {
    id: "zhgk-info-points",
    version: "1",
    question: "Does the answer give the points the question asks for, each one that the passage supports, as many as the question needs?",
    quoteWhenMet: true,
  },
  {
    id: "zhgk-info-grounded",
    version: "1",
    question:
      "Is every point drawn from the passage, its reasoning or its evidence, without adding what the passage does not say or misreading what it does?",
    quoteWhenMet: true,
  },
  {
    id: "zhgk-info-concise",
    version: "1",
    question: "Is the answer concise and orderly, its points set out one by one in the learner's own words rather than copied at length?",
    quoteWhenMet: false,
  },
  {
    id: "zhgk-lit-technique",
    version: "1",
    question: "Does the answer name the technique, structure or feature of language the question asks about, correctly for the passage?",
    quoteWhenMet: true,
  },
  {
    id: "zhgk-lit-effect",
    version: "1",
    question:
      "Does the answer explain the effect: what the feature does for the character, the feeling, the theme or the structure of the passage?",
    quoteWhenMet: true,
  },
  {
    id: "zhgk-lit-grounded",
    version: "1",
    question: "Does the answer tie what it says to particular words, details or sentences of the passage, without misreading them?",
    quoteWhenMet: true,
  },
  // The Gaokao's judged use of language: filling gaps in a passage, and rewriting as asked.
  {
    id: "zhgk-fill-fit",
    version: "1",
    question:
      "Does each sentence written into a gap fit where it goes: following from the sentence before it and leading into the one after it in the passage's logic, such as a cause, a turn, an example or a conclusion?",
    quoteWhenMet: true,
  },
  {
    id: "zhgk-fill-content",
    version: "1",
    question:
      "Does each sentence written into a gap say what the passage needs there, as the text around it implies, without adding what the passage does not support?",
    quoteWhenMet: true,
  },
  {
    id: "zhgk-fill-form",
    version: "1",
    question:
      "Does the answer fill every gap, in order, each with one complete and correct sentence within the number of characters the task allows?",
    quoteWhenMet: false,
  },
  {
    id: "zhgk-rewrite-meaning",
    version: "1",
    question:
      "Does the rewriting keep the meaning and every piece of information of the original that the task asks to keep, without changing or adding to it?",
    quoteWhenMet: true,
  },
  {
    id: "zhgk-rewrite-form",
    version: "1",
    question:
      "Does the rewriting do what the task asks of its form, such as the number of sentences, the kind of sentence, the structure to imitate or the most characters?",
    quoteWhenMet: true,
  },
  {
    id: "zhgk-rewrite-fluent",
    version: "1",
    question: "Does the rewriting read as correct, natural Chinese, without faults of grammar, word order or wording?",
    quoteWhenMet: false,
  },
  // The tasks of the new HSK's writing paper that the levels' paragraph writing lacks.
  {
    id: "hsk-word-use",
    version: "1",
    question: "Does the sentence use the given word, unchanged, in its right meaning, in a place and with words its part of speech allows?",
    quoteWhenMet: true,
  },
  {
    id: "hsk-word-sense",
    version: "1",
    question:
      "Does the sentence say something complete and meaningful about a situation, more than the word with filler around it, such as 这是 and the word alone?",
    quoteWhenMet: true,
  },
  {
    id: "hsk-word-grammar",
    version: "1",
    question: "Is the sentence correct, natural Chinese, without faults of grammar, word order or wrong characters?",
    quoteWhenMet: false,
  },
  {
    id: "hsk-scenes-all",
    version: "1",
    question: "Does the story tell what happens in every one of the four scenes, in their order, without contradicting any of them?",
    quoteWhenMet: true,
  },
  {
    id: "hsk-scenes-linked",
    version: "1",
    question:
      "Is it one story rather than four separate descriptions: are the scenes joined by time, cause and the reactions of the people, so that it has a beginning, a turn and an end?",
    quoteWhenMet: true,
  },
  {
    id: "hsk-scenes-language",
    version: "1",
    question:
      "Is the story written in correct Chinese of an intermediate learner, with varied sentences and connectives and few wrong characters?",
    quoteWhenMet: false,
  },
  {
    id: "hsk-practical-points",
    version: "1",
    question: "Does the text include every point the task asks for, each with the details a reader would need?",
    quoteWhenMet: true,
  },
  {
    id: "hsk-practical-form",
    version: "1",
    question:
      "Does the text have the form and tone its purpose and reader call for, such as a title, a greeting, a signature, contact details or a polite request, as that kind of text usually has?",
    quoteWhenMet: true,
  },
  {
    id: "hsk-practical-language",
    version: "1",
    question:
      "Is the text written in correct, clear Chinese of an advanced learner, in a register that suits its reader, with few wrong characters?",
    quoteWhenMet: false,
  },
  // HSK 7–9: a chart described and analysed, an essay arguing a position, and a text translated into Chinese.
  {
    id: "hsk-chart-data",
    version: "1",
    question:
      "Does the text report the chart's main figures and its overall trend or largest differences correctly, without numbers or claims the chart does not support?",
    quoteWhenMet: true,
  },
  {
    id: "hsk-chart-analysis",
    version: "1",
    question:
      "Does the text go beyond listing figures, comparing them and offering at least one reasonable explanation, cause or conclusion drawn from the chart?",
    quoteWhenMet: true,
  },
  {
    id: "hsk-chart-language",
    version: "1",
    question:
      "Is the text written in correct, formal Chinese of an advanced learner, with words for numbers and change such as 增长, 下降, 占, 比例 or 约 used correctly, and few wrong characters?",
    quoteWhenMet: false,
  },
  {
    id: "hsk-essay-position",
    version: "1",
    question: "Does the essay take a clear position on the question asked, stated near its start and kept to the end?",
    quoteWhenMet: true,
  },
  {
    id: "hsk-essay-support",
    version: "1",
    question:
      "Does the essay support its position with at least two distinct reasons, each developed with an example, evidence or explanation, and does it answer at least one opposing view?",
    quoteWhenMet: true,
  },
  {
    id: "hsk-essay-language",
    version: "1",
    question:
      "Is the essay organised in paragraphs with clear connections between them, in correct, varied Chinese of an advanced learner with few wrong characters?",
    quoteWhenMet: false,
  },
  {
    id: "hsk-translate-complete",
    version: "1",
    question:
      "Does the translation carry over every piece of information of the source text, leaving nothing out and adding nothing of its own?",
    quoteWhenMet: false,
  },
  {
    id: "hsk-translate-accurate",
    version: "1",
    question:
      "Does the translation render the meaning of each sentence of the source correctly, including its numbers, names, negations and the relations between its ideas?",
    quoteWhenMet: false,
  },
  {
    id: "hsk-translate-natural",
    version: "1",
    question:
      "Does the translation read as natural Chinese, in a register that suits the source, rather than following the source's word order word by word?",
    quoteWhenMet: true,
  },
];

/** LEVEL_WRITING_CRITERIA are the criteria of the paragraph writing of foreign-language levels 2 to 9. */
export const LEVEL_WRITING_CRITERIA: readonly CriterionSpec[] = [...LEVEL_CRITERIA_A, ...LEVEL_CRITERIA_B];

/** criterionById finds a criterion of WRITING_CRITERIA or LEVEL_WRITING_CRITERIA, or undefined. */
export function criterionById(id: string): CriterionSpec | undefined {
  return WRITING_CRITERIA.find((c) => c.id === id) ?? LEVEL_WRITING_CRITERIA.find((c) => c.id === id);
}
