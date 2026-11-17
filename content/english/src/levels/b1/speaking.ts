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
    say(
      "Which subject do you enjoy most?",
      "I enjoy {x} most. / {x} is my favorite subject. / I like {x} the most.",
      "art, biology, geography, music, literature",
    ),
    say(
      "How do you learn new words?",
      "I learn new words by trying to {x}. / I {x}.",
      "read a lot, use a dictionary, write them down, use an app, watch films in English",
    ),
    say(
      "What would you change about your school?",
      "I would change {x}. / I would like to change {x}.",
      "the timetable, the uniform, the canteen food, the homework rules, the start time",
    ),
    say(
      "Who helps you most with your studies?",
      "My {x} helps me most. / I get most help from my {x}.",
      "teacher, mother, father, older sister, best friend",
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
    say(
      "Would you prefer to work indoors or outdoors?",
      "I would prefer to work {x}. / I'd rather work {x}.",
      "indoors, outdoors, at home, in an office, in a garden",
    ),
    say(
      "What skill is most useful at work?",
      "{x} is the most useful skill. / I think {x} is most useful.",
      "teamwork, communication, problem solving, time management, creativity",
    ),
    say(
      "How many hours a week would you like to work?",
      "I would like to work {x} hours a week. / About {x} hours.",
      "twenty, thirty, thirty-five, forty, forty-five",
    ),
    say(
      "What kind of company would you like to work for?",
      "I would like to work for {x}. / I'd like to work for {x}.",
      "a big company, a small business, a charity, a hospital, a school",
    ),
  ],
  "health-and-fitness": [
    say(
      "What do you do to stay fit?",
      "I {x} to stay fit. / I stay fit by trying to {x}. / I {x}.",
      "go running, swim, play football, go to the gym, ride my bike",
    ),
    say("What healthy food do you like?", "I like {x}. / I really like {x}. / I like eating {x}.", "fish, vegetables, fruit, salad, nuts"),
    say("How many hours of sleep do you need?", "I need {x} hours of sleep. / I need about {x} hours.", "six, seven, eight, nine, ten"),
    say(
      "What do you eat when you want to be healthy?",
      "I eat {x}. / I try to eat {x}.",
      "more vegetables, less sugar, fresh fruit, whole grains, more fish",
    ),
    say(
      "What do you do when you feel stressed?",
      "I {x} when I feel stressed. / I {x}.",
      "go for a walk, listen to music, talk to a friend, do yoga, take a hot bath",
    ),
    say(
      "How often do you go to the gym?",
      "I go to the gym {x}. / I go {x}.",
      "every day, twice a week, three times a week, once a week, every weekend",
    ),
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
    say(
      "How do you travel to save energy?",
      "I travel {x} to save energy. / I usually go {x}.",
      "by bike, on foot, by bus, by train, by tram",
    ),
    say(
      "What can schools do for the environment?",
      "Schools can {x}. / They can {x}.",
      "plant trees, recycle paper, save water, use solar power, grow vegetables",
    ),
    say(
      "Which animal is most in danger?",
      "I think the {x} is most in danger. / The {x} is most in danger.",
      "tiger, polar bear, panda, elephant, gorilla",
    ),
    say("What do you recycle at home?", "I recycle {x} at home. / We recycle {x}.", "paper, plastic bottles, glass, cans, old clothes"),
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
    say(
      "How often do you read the news?",
      "I read the news {x}. / I read it {x}.",
      "every day, every morning, once a week, on weekends, now and then",
    ),
    say(
      "Which TV program do you watch most?",
      "I watch {x} most. / I mostly watch {x}.",
      "the news, quiz shows, documentaries, cooking shows, sports programs",
    ),
    say("Do you trust news on social media?", "I trust it {x}. / I {x} trust it.", "sometimes, rarely, never, often, usually"),
    say(
      "What would you write about as a journalist?",
      "I would write about {x}. / I'd write about {x}.",
      "sport, politics, music, travel, science",
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
    say(
      "What would you do without your phone?",
      "I would {x}. / Without my phone, I would {x}.",
      "read more, talk to people, go outside, get bored, feel lost",
    ),
    say(
      "Which app could you not live without?",
      "I could not live without {x}. / I couldn't live without {x}.",
      "my music app, my map app, my messaging app, my camera, my calendar",
    ),
    say(
      "How do you keep your data safe?",
      "I keep it safe by trying to {x}. / I {x}.",
      "use strong passwords, update my phone, avoid strange links, back up my files, lock my screen",
    ),
    say(
      "How many hours do you spend on screens?",
      "I spend {x} hours a day on screens. / About {x} hours a day.",
      "two, three, four, five, six",
    ),
  ],
  "travel-and-culture": [
    say(
      "Which country would you most like to visit?",
      "I would most like to visit {x}. / I'd like to visit {x}. / I want to visit {x}.",
      "Japan, Italy, Brazil, Canada, Egypt",
    ),
    say("How do you prefer to travel?", "I prefer to travel by {x}. / I like traveling by {x}.", "train, plane, car, bus, boat"),
    say(
      "What do you always pack for a trip?",
      "I always pack {x}. / I never travel without {x}.",
      "a phone charger, a good book, sunscreen, a map, a warm jacket",
    ),
    say(
      "Where would you like to stay on holiday?",
      "I would like to stay in {x}. / I'd like to stay in {x}.",
      "a hotel, a tent, a small flat, a farmhouse, a cabin by a lake",
    ),
    say(
      "What do you like to try in another country?",
      "I like to try {x}. / I always try {x}.",
      "the local food, the language, the music, the markets, the festivals",
    ),
    say(
      "Where did you go on your last trip?",
      "I went to {x}. / My last trip was to {x}.",
      "the coast, the mountains, a big city, my grandparents' village, another country",
    ),
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
    say(
      "How do you keep in touch with old friends?",
      "I keep in touch by trying to {x}. / I {x}.",
      "send messages, call them, meet for coffee, write emails, visit them",
    ),
    say(
      "What makes a good friend?",
      "{x} makes a good friend. / A good friend needs {x}.",
      "honesty, kindness, loyalty, patience, a sense of humor",
    ),
    say(
      "Who do you talk to when you have a problem?",
      "I talk to my {x}. / I usually talk to my {x}.",
      "mother, father, best friend, sister, brother",
    ),
    say(
      "What do you argue about with your family?",
      "We argue about {x}. / We sometimes argue about {x}.",
      "housework, money, homework, my phone, the TV",
    ),
  ],
  "cities-and-transport": [
    say("How do you usually get to school or work?", "I usually go by {x}. / I usually get there by {x}.", "bus, train, bike, car, tram"),
    say(
      "What is your favorite place in your city?",
      "My favorite place is the {x}. / I like the {x} best. / The {x} is my favorite place.",
      "park, museum, library, market, river",
    ),
    say(
      "What is the worst thing about traffic in your city?",
      "The worst thing is {x}. / I think {x} is the worst thing.",
      "the noise, the air, the delays, the parking, the crowded buses",
    ),
    say(
      "What would make your city better?",
      "{x} would make it better. / I think {x} would make it better.",
      "more parks, cleaner streets, cheaper buses, more bike lanes, less traffic",
    ),
    say(
      "How long is your journey to school?",
      "It takes {x} minutes. / My journey takes about {x} minutes.",
      "ten, fifteen, twenty, thirty, forty",
    ),
    say(
      "What is the biggest problem in your city?",
      "The biggest problem is {x}. / I think it is {x}.",
      "traffic, pollution, noise, high rents, crowded buses",
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
    say(
      "Which scientist do you admire most?",
      "I admire {x} most. / I most admire {x}.",
      "Marie Curie, Albert Einstein, Isaac Newton, Charles Darwin, Ada Lovelace",
    ),
    say(
      "What would you like to discover?",
      "I would like to discover {x}. / I'd like to discover {x}.",
      "a new planet, a cure for cancer, a new animal, clean energy, life on Mars",
    ),
    say(
      "Which science lesson do you remember best?",
      "I remember the lesson on {x} best. / The one on {x}.",
      "the solar system, volcanoes, the human heart, electricity, plants",
    ),
    say(
      "Where would you like to do research?",
      "I would like to do research in {x}. / In {x}.",
      "the Arctic, the rainforest, the ocean, space, a big laboratory",
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
    say(
      "How do you save money?",
      "I save money by trying to {x}. / I {x}.",
      "cook at home, walk instead of driving, buy second-hand clothes, compare prices, avoid eating out",
    ),
    say(
      "What was the last thing you bought online?",
      "The last thing I bought online was {x}. / I bought {x}.",
      "a book, some shoes, a phone case, a game, a jacket",
    ),
    say(
      "How do you usually pay in shops?",
      "I usually pay {x}. / I pay {x}.",
      "by card, in cash, with my phone, by bank transfer, with a voucher",
    ),
    say("What would you buy with a lot of money?", "I would buy {x}. / I'd buy {x}.", "a house, a car, a boat, a plane ticket, a farm"),
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
    say("What kind of music do you listen to?", "I listen to {x}. / I mostly listen to {x}.", "pop, rock, jazz, classical music, hip hop"),
    say(
      "Which instrument would you like to learn?",
      "I would like to learn {x}. / I'd like to learn {x}.",
      "the piano, the guitar, the violin, the drums, the saxophone",
    ),
    say(
      "Where do you like watching films?",
      "I like watching films {x}. / I prefer watching them {x}.",
      "at the cinema, at home, on my laptop, with friends, outdoors",
    ),
    say(
      "What was the last concert you went to?",
      "The last concert was {x}. / I went to {x}.",
      "a rock concert, a jazz concert, a school concert, an opera, a festival",
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
