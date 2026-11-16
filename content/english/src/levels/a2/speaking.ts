// The speaking topics of A2 (S2–S4): in each unit, after its listening, the unit's words said after a recording,
// its sentences read aloud, and questions on its theme answered aloud in a full sentence with a given word.

import type { TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { say, unitSpeaking } from "../speaking.ts";
// The modules whose vocabulary topics the speaking says, built before it.
import "./topics.ts";

/** topics are the speaking topics of the units of A2, in their order. */
export const topics: readonly TopicDef[] = [
  unitSpeaking({
    id: "a2-speaking-last-weekend",
    title: t("Speaking: Last Weekend", "口语：上个周末"),
    summary: t("Say the unit's words, and read its sentences aloud.", "说出“上个周末”的词汇，并朗读句子。"),
    listening: "a2-listening-last-weekend",
    words: [
      "a2-words-past-time",
      "a2-words-relatives",
      "a2-words-events",
      "a2-words-weekend",
      "a2-words-useful-words",
      "a2-words-family-food-and-measures",
    ],
    frames: [
      say(
        "What did you do last weekend?",
        "I {x} last weekend. / I {x}.",
        "played tennis, visited my grandmother, watched a film, went swimming, cleaned my room",
      ),
      say("Where did you go on Saturday?", "I went to the {x} on Saturday. / I went to the {x}.", "park, beach, cinema, museum, zoo"),
    ],
  }),
  unitSpeaking({
    id: "a2-speaking-health-and-the-body",
    title: t("Speaking: Health and the Body", "口语：健康和身体"),
    summary: t("Say the unit's words, and read its sentences aloud.", "说出“健康和身体”的词汇，并朗读句子。"),
    listening: "a2-listening-health-and-the-body",
    words: ["a2-words-health", "a2-words-body-2", "a2-words-staying-well", "a2-words-at-the-doctor"],
    frames: [
      say("What's the matter?", "I have a {x}. / I have got a {x}.", "headache, cold, cough, stomachache, sore throat"),
      say("How often do you exercise?", "I exercise {x}.", "every day, twice a week, three times a week, once a week, every morning"),
    ],
  }),
  unitSpeaking({
    id: "a2-speaking-neighbors-and-community",
    title: t("Speaking: Neighbors and Community", "口语：邻里和社区"),
    summary: t("Say the unit's words, and read its sentences aloud.", "说出“邻里和社区”的词汇，并朗读句子。"),
    listening: "a2-listening-neighbors-and-community",
    words: [
      "a2-words-neighborhood",
      "a2-words-community-actions",
      "a2-words-people-around",
      "a2-words-describing-places",
      "a2-words-pronouns",
      "a2-words-positions-and-shapes",
    ],
    frames: [
      say(
        "Where is the post office?",
        "It is opposite the {x}. / The post office is opposite the {x}.",
        "bank, library, park, police station, supermarket",
      ),
      say(
        "What can we do at the community center?",
        "We can {x} there. / We can {x} at the community center. / We can {x}.",
        "play games, learn to cook, read books, meet friends, take a dance class",
      ),
    ],
  }),
  unitSpeaking({
    id: "a2-speaking-cooking",
    title: t("Speaking: Cooking", "口语：烹饪"),
    summary: t("Say the unit's words, and read its sentences aloud.", "说出“烹饪”的词汇，并朗读句子。"),
    listening: "a2-listening-cooking",
    words: ["a2-words-cooking", "a2-words-ingredients", "a2-words-taste", "a2-words-quantities"],
    frames: [
      say(
        "What do we do first?",
        "First, we {x} the vegetables. / First, {x} the vegetables. / We {x} the vegetables first.",
        "wash, cut, peel, chop, boil",
      ),
      say("How does it taste?", "It tastes {x}.", "sweet, salty, sour, spicy, delicious"),
    ],
  }),
  unitSpeaking({
    id: "a2-speaking-sports-and-games",
    title: t("Speaking: Sports and Games", "口语：运动和游戏"),
    summary: t("Say the unit's words, and read its sentences aloud.", "说出“运动和游戏”的词汇，并朗读句子。"),
    listening: "a2-listening-sports-and-games",
    words: ["a2-words-sports", "a2-words-competition", "a2-words-movement", "a2-words-games", "a2-words-adverbs"],
    frames: [
      say("Which sport are you good at?", "I am good at {x}.", "running, swimming, basketball, tennis, table tennis"),
      say("Who won the match?", "The {x} team won. / The {x} team won the match.", "red, blue, green, yellow, white"),
    ],
  }),
  unitSpeaking({
    id: "a2-speaking-animals-and-pets",
    title: t("Speaking: Animals and Pets", "口语：动物和宠物"),
    summary: t("Say the unit's words, and read its sentences aloud.", "说出“动物和宠物”的词汇，并朗读句子。"),
    listening: "a2-listening-animals-and-pets",
    words: ["a2-words-pets", "a2-words-wildlife", "a2-words-animal-life", "a2-words-farm-and-care"],
    frames: [
      say("What pet would you like?", "I would like a {x}.", "dog, cat, rabbit, parrot, hamster"),
      say("What does your dog eat?", "It eats {x}. / My dog eats {x}.", "meat, biscuits, rice, fish, vegetables"),
    ],
  }),
  unitSpeaking({
    id: "a2-speaking-travel-and-holidays",
    title: t("Speaking: Travel and Holidays", "口语：旅行和假期"),
    summary: t("Say the unit's words, and read its sentences aloud.", "说出“旅行和假期”的词汇，并朗读句子。"),
    listening: "a2-listening-travel-and-holidays",
    words: ["a2-words-holidays", "a2-words-places-to-visit", "a2-words-transport", "a2-words-future"],
    frames: [
      say("How are you going to travel?", "We are going to travel by {x}. / We are going by {x}.", "plane, train, boat, bus, car"),
      say(
        "Where are you going this summer?",
        "I am going to {x} this summer. / I am going to {x}.",
        "London, Paris, Beijing, Sydney, New York",
      ),
    ],
  }),
  unitSpeaking({
    id: "a2-speaking-the-natural-world",
    title: t("Speaking: The Natural World", "口语：自然世界"),
    summary: t("Say the unit's words, and read its sentences aloud.", "说出“自然世界”的词汇，并朗读句子。"),
    listening: "a2-listening-the-natural-world",
    words: ["a2-words-landscape", "a2-words-weather-2", "a2-words-space", "a2-words-plants", "a2-words-little-words-3"],
    frames: [
      say("What can you see in the sky at night?", "I can see the {x}.", "moon, stars, planets, clouds, lights"),
      say("What will the weather be like tomorrow?", "It will be {x} tomorrow. / It will be {x}.", "sunny, rainy, windy, snowy, foggy"),
    ],
  }),
  unitSpeaking({
    id: "a2-speaking-shopping-and-money",
    title: t("Speaking: Shopping and Money", "口语：购物和金钱"),
    summary: t("Say the unit's words, and read its sentences aloud.", "说出“购物和金钱”的词汇，并朗读句子。"),
    listening: "a2-listening-shopping-and-money",
    words: ["a2-words-money", "a2-words-shops", "a2-words-things-we-buy", "a2-words-materials"],
    frames: [
      say("How much does it cost?", "It costs {x} dollars.", "ten, twenty, thirty, forty, fifty"),
      say("What is the bag made of?", "It is made of {x}.", "leather, cotton, plastic, paper, wool"),
    ],
  }),
  unitSpeaking({
    id: "a2-speaking-technology",
    title: t("Speaking: Technology", "口语：科技"),
    summary: t("Say the unit's words, and read its sentences aloud.", "说出“科技”的词汇，并朗读句子。"),
    listening: "a2-listening-technology",
    words: ["a2-words-technology", "a2-words-using-tech", "a2-words-communication", "a2-words-machines", "a2-words-sounds-and-messages"],
    frames: [
      say(
        "What do you use your phone for?",
        "I use it to {x}. / I use my phone to {x}.",
        "call my friends, take photos, listen to music, play games, send messages",
      ),
      say(
        "How long do you spend online every day?",
        "I spend {x} hours online. / I spend about {x} hours online. / I spend {x} hours online every day.",
        "two, three, four, five, six",
      ),
    ],
  }),
  unitSpeaking({
    id: "a2-speaking-festivals-and-celebrations",
    title: t("Speaking: Festivals and Celebrations", "口语：节日和庆祝"),
    summary: t("Say the unit's words, and read its sentences aloud.", "说出“节日和庆祝”的词汇，并朗读句子。"),
    listening: "a2-listening-festivals-and-celebrations",
    words: ["a2-words-festivals", "a2-words-wishes", "a2-words-feelings-2", "a2-words-people-together"],
    frames: [
      say(
        "What do you eat at the Spring Festival?",
        "We eat {x}. / We eat {x} at the Spring Festival.",
        "dumplings, fish, noodles, rice cakes, sweets",
      ),
      say("When is the festival?", "It is in {x}. / The festival is in {x}.", "January, February, April, September, December"),
    ],
  }),
  unitSpeaking({
    id: "a2-speaking-jobs-and-dreams",
    title: t("Speaking: Jobs and Dreams", "口语：工作和梦想"),
    summary: t("Say the unit's words, and read its sentences aloud.", "说出“工作和梦想”的词汇，并朗读句子。"),
    listening: "a2-listening-jobs-and-dreams",
    words: ["a2-words-jobs-2", "a2-words-work-life", "a2-words-ambitions", "a2-words-everyday-ideas"],
    frames: [
      say(
        "What do you want to be in the future?",
        "I want to be a {x}. / I want to be a {x} in the future.",
        "pilot, scientist, chef, vet, singer",
      ),
      say(
        "Why do you want to be a doctor?",
        "Because I want to {x}. / I want to {x}.",
        "help sick people, work in a hospital, save lives, learn about medicine, help children",
      ),
    ],
  }),
].flat();
