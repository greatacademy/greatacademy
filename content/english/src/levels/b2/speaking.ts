// The speaking topics of B2 (S2–S4): in each unit, after its listening, the words of four of its vocabulary topics
// said after a recording, their sentences read aloud, and questions on its theme answered aloud in a full sentence with
// a given word or phrase.

import type { TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type SayFrame, say, unitSpeaking } from "../speaking.ts";
import { units } from "./listening.ts";

const frames: Record<(typeof units)[number]["slug"], readonly SayFrame[]> = {
  "society-and-change": [
    say(
      "What do you think is the biggest change in society in the last twenty years?",
      "I think the biggest change is {x}. / The biggest change is {x}. / In my opinion, the biggest change is {x}.",
      "the internet, social media, working from home, an older population, climate awareness",
    ),
    say(
      "Which social problem should governments deal with first?",
      "Governments should deal with {x} first. / I think governments should deal with {x} first. / They should deal with {x} first.",
      "poverty, homelessness, unemployment, inequality, loneliness",
    ),
  ],
  "work-and-the-economy": [
    say(
      "Would you rather work for a large company or a small one?",
      "I would rather work for {x}. / I'd rather work for {x}. / I would prefer to work for {x}.",
      "a large company, a small company, a start-up, a family business, myself",
    ),
    say(
      "What makes a good manager?",
      "A good manager is {x}. / I think a good manager is {x}. / In my view, a good manager is {x}.",
      "fair, organized, honest, supportive, a good listener",
    ),
  ],
  "science-ethics-and-medicine": [
    say(
      "What medical advance do you think is the most important?",
      "I think {x} is the most important. / The most important advance is {x}. / In my view, {x} is the most important.",
      "vaccines, antibiotics, organ transplants, gene therapy, anesthesia",
    ),
    say(
      "How do you look after your mental health?",
      "I look after my mental health by {x}. / I try to look after it by {x}. / I look after it by {x}.",
      "getting enough sleep, talking to friends, doing exercise, spending time outdoors, taking breaks from my phone",
    ),
  ],
  "climate-and-sustainability": [
    say(
      "Which source of energy should we use more?",
      "We should use more {x}. / I think we should use more {x}. / In my view, we should use more {x}.",
      "solar power, wind power, nuclear power, hydroelectric power, geothermal energy",
    ),
    say(
      "What is the most effective thing a person can do for the climate?",
      "The most effective thing is to {x}. / I think the most effective thing is to {x}. / A person can {x}.",
      "fly less, eat less meat, use public transport, save energy at home, buy fewer things",
    ),
  ],
  "media-and-persuasion": [
    say(
      "Which source of news do you trust most?",
      "I trust {x} most. / I trust {x} the most. / The source I trust most is {x}.",
      "public radio, a national newspaper, the BBC, a news agency, my local paper",
    ),
    say(
      "What makes an advert persuasive?",
      "An advert is persuasive when it uses {x}. / I think {x} makes an advert persuasive. / {x} makes an advert persuasive.",
      "humor, famous people, strong images, catchy music, a clear message",
    ),
  ],
  "education-and-opportunity": [
    say(
      "What would you like to study at university?",
      "I would like to study {x}. / I'd like to study {x} at university. / I want to study {x}.",
      "medicine, engineering, law, economics, computer science",
    ),
    say(
      "What is the best way to be assessed?",
      "The best way is {x}. / I think the best way is {x}. / In my view, the best way is {x}.",
      "coursework, written exams, oral exams, projects, presentations",
    ),
  ],
  "culture-identity-and-globalization": [
    say(
      "Which tradition from your culture would you share with the world?",
      "I would share {x}. / I'd share {x} with the world. / I would like to share {x}.",
      "our food, our music, our festivals, our language, our stories",
    ),
    say(
      "What is the main benefit of globalization?",
      "The main benefit is {x}. / I think the main benefit is {x}. / In my opinion, the main benefit is {x}.",
      "cheaper goods, cultural exchange, more jobs, faster communication, international cooperation",
    ),
  ],
  "technology-and-the-future": [
    say(
      "How do you think artificial intelligence will change our lives?",
      "I think it will change {x}. / It will change {x}. / I believe it will change {x}.",
      "how we work, how we learn, how we travel, medicine, communication",
    ),
    say(
      "Would you like to travel to space?",
      "I would like to travel to {x}. / I'd love to travel to {x}. / I would like to go to {x}.",
      "the Moon, Mars, the space station, Jupiter, Venus",
    ),
  ],
  "law-rights-and-justice": [
    say(
      "Which right do you think is most important?",
      "I think {x} is the most important. / The most important right is {x}. / In my view, {x} is the most important.",
      "free speech, privacy, education, a fair trial, the right to vote",
    ),
    say(
      "What is the best way to reduce crime?",
      "The best way is {x}. / I think the best way is {x}. / In my opinion, the best way is {x}.",
      "better education, more police, more jobs, community programs, better street lighting",
    ),
  ],
  "mind-and-behavior": [
    say(
      "What helps you remember new information?",
      "{x} helps me remember. / I remember better by {x}. / What helps me is {x}.",
      "writing notes, repeating things, drawing pictures, teaching others, sleeping well",
    ),
    say(
      "How do you make important decisions?",
      "I make important decisions by {x}. / I usually decide by {x}. / I decide by {x}.",
      "making a list, asking my family, thinking for a long time, following my feelings, sleeping on it",
    ),
  ],
};

/** topics are the speaking topics of the units of B2, two to a unit, in their order. */
export const topics: readonly TopicDef[] = units.flatMap((u) =>
  unitSpeaking({
    id: `b2-speaking-${u.slug}`,
    title: t(`Speaking: ${u.en}`, `口语：${u.zh}`),
    summary: t("Say the unit's words, and read its sentences aloud.", `说出“${u.zh}”的词汇，并朗读句子。`),
    listening: `b2-listening-${u.slug}`,
    words: u.words,
    frames: frames[u.slug],
  }),
);
