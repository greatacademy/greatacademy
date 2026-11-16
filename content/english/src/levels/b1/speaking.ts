// The speaking topics of B1 (S2–S4): in each unit, after its listening, the words of four of its vocabulary topics
// said after a recording, their sentences read aloud, and questions on its theme answered aloud in a full sentence with
// a given word.

import type { TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type SayFrame, say, unitSpeaking } from "../speaking.ts";
import { units } from "./listening.ts";

const frames: Record<(typeof units)[number]["slug"], readonly SayFrame[]> = {
  "education-and-learning": [
    say(
      "Which subject do you find most difficult?",
      "I find {x} the most difficult. / {x} is the most difficult for me. / {x} is the most difficult subject for me.",
      "math, physics, chemistry, history, English",
    ),
    say(
      "How do you prepare for an exam?",
      "I {x} before an exam. / I prepare by trying to {x}. / I {x}.",
      "make flashcards, write summaries, do practice tests, study with friends, read my notes again",
    ),
  ],
  "work-and-careers": [
    say(
      "What job would you like to do in the future?",
      "I would like to be {x}. / I'd like to be {x} in the future. / I want to be {x}.",
      "a doctor, an engineer, a teacher, a lawyer, a designer",
    ),
    say(
      "What is most important to you in a job?",
      "{x} is the most important thing to me. / The most important thing is {x}. / For me, {x} is most important.",
      "a good salary, interesting work, friendly colleagues, free time, a short journey",
    ),
  ],
  "health-and-fitness": [
    say(
      "What do you do to stay fit?",
      "I {x} to stay fit. / I stay fit by trying to {x}. / I {x}.",
      "go running, swim, play football, go to the gym, ride my bike",
    ),
    say("What healthy food do you like?", "I like {x}. / I really like {x}. / I like eating {x}.", "fish, vegetables, fruit, salad, nuts"),
  ],
  "the-environment": [
    say(
      "What do you do to help the environment?",
      "I {x} to help the environment. / I help by trying to {x}. / I {x}.",
      "recycle paper, save water, walk to school, turn off the lights, use a reusable bag",
    ),
    say(
      "What is the biggest environmental problem where you live?",
      "The biggest problem is {x}. / {x} is the biggest problem. / I think {x} is the biggest problem.",
      "air pollution, plastic waste, traffic, noise, dirty rivers",
    ),
  ],
  "media-and-news": [
    say(
      "Where do you get your news?",
      "I get my news from {x}. / I usually get my news from {x}.",
      "the radio, a news app, the newspaper, the television, the internet",
    ),
    say(
      "What kind of news interests you most?",
      "{x} interests me most. / I am most interested in {x}. / I like {x} most.",
      "sports news, science news, local news, world news, entertainment news",
    ),
  ],
  "technology-in-our-lives": [
    say(
      "Which device do you use most?",
      "I use my {x} most. / My {x} is the device I use most. / I use my {x} the most.",
      "phone, laptop, tablet, computer, smartwatch",
    ),
    say(
      "What do you usually do online?",
      "I usually {x} online. / Online I usually {x}. / I {x}.",
      "watch videos, chat with friends, read the news, play games, do my homework",
    ),
  ],
  "travel-and-culture": [
    say(
      "Which country would you most like to visit?",
      "I would most like to visit {x}. / I'd like to visit {x}. / I want to visit {x}.",
      "Japan, Italy, Brazil, Canada, Egypt",
    ),
    say("How do you prefer to travel?", "I prefer to travel by {x}. / I like traveling by {x}.", "train, plane, car, bus, boat"),
  ],
  relationships: [
    say(
      "What do you like doing with your friends?",
      "I like {x} with my friends. / With my friends I like {x}. / I like {x}.",
      "playing games, going to the cinema, cooking, playing football, talking",
    ),
    say(
      "What kind of person is your best friend?",
      "My best friend is {x}. / He is {x}. / She is {x}.",
      "funny, kind, honest, clever, friendly",
    ),
  ],
  "cities-and-transport": [
    say("How do you usually get to school or work?", "I usually go by {x}. / I usually get there by {x}.", "bus, train, bike, car, tram"),
    say(
      "What is your favorite place in your city?",
      "My favorite place is the {x}. / I like the {x} best. / The {x} is my favorite place.",
      "park, museum, library, market, river",
    ),
  ],
  "science-and-discovery": [
    say(
      "Which science do you find most interesting?",
      "I find {x} the most interesting. / {x} is the most interesting for me. / I like {x} best.",
      "biology, physics, chemistry, astronomy, geology",
    ),
    say(
      "Which invention could you not live without?",
      "I could not live without {x}. / I couldn't live without {x}.",
      "the internet, my phone, electricity, the fridge, the washing machine",
    ),
  ],
  "money-and-consumers": [
    say(
      "What do you spend most of your money on?",
      "I spend most of my money on {x}. / Most of my money goes on {x}.",
      "food, clothes, books, games, travel",
    ),
    say(
      "Where do you like shopping?",
      "I like shopping {x}. / I prefer shopping {x}. / I usually shop {x}.",
      "online, at the market, in small shops, in the mall, at the supermarket",
    ),
  ],
  "arts-and-entertainment": [
    say(
      "What kind of films do you like?",
      "I like {x}. / I really like {x}. / I enjoy {x}.",
      "comedies, action films, cartoons, horror films, documentaries",
    ),
    say(
      "What do you like doing in the evening?",
      "I like {x} in the evening. / In the evening I like {x}. / I like {x}.",
      "reading, watching films, listening to music, drawing, playing the guitar",
    ),
  ],
};

/** topics are the speaking topics of the units of B1, two to a unit, in their order. */
export const topics: readonly TopicDef[] = units.flatMap((u) =>
  unitSpeaking({
    id: `b1-speaking-${u.slug}`,
    title: t(`Speaking: ${u.en}`, `口语：${u.zh}`),
    summary: t("Say the unit's words, and read its sentences aloud.", `说出“${u.zh}”的词汇，并朗读句子。`),
    listening: `b1-listening-${u.slug}`,
    words: u.words,
    frames: frames[u.slug],
  }),
);
