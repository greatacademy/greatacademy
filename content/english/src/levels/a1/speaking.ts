// The speaking topics of A1 (S2–S4): in each unit, after its listening, the unit's words said after a recording,
// its sentences read aloud, and questions on its theme answered aloud in a full sentence with a given word.

import type { TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { say, unitSpeaking } from "../speaking.ts";
// The modules whose vocabulary topics the speaking says, built before it.
import "./topics.ts";

/** topics are the speaking topics of the units of A1, in their order. */
export const topics: readonly TopicDef[] = [
  unitSpeaking({
    id: "a1-speaking-all-about-me",
    title: t("Speaking: All About Me", "口语：关于我"),
    summary: t(
      "Say the unit's words, read its sentences aloud, and answer questions on its theme aloud.",
      "说出“关于我”的词汇，朗读句子，并开口回答相关问题。",
    ),
    listening: "a1-listening-all-about-me",
    words: ["a1-words-numbers-to-hundred", "a1-words-about-me", "a1-words-feelings", "a1-words-everyday-words", "a1-words-little-words-3"],
    frames: [
      say("How old are you?", "I am {x}. / I am {x} years old.", "nine, ten, eleven, twelve, thirteen"),
      say("Where are you from?", "I am from {x}.", "China, Brazil, Spain, Canada, Japan"),
    ],
  }),
  unitSpeaking({
    id: "a1-speaking-my-day",
    title: t("Speaking: My Day", "口语：我的一天"),
    summary: t(
      "Say the unit's words, read its sentences aloud, and answer questions on its theme aloud.",
      "说出“我的一天”的词汇，朗读句子，并开口回答相关问题。",
    ),
    listening: "a1-listening-my-day",
    words: ["a1-words-my-day", "a1-words-times-of-day", "a1-words-how-often", "a1-words-little-words-1"],
    frames: [
      say("What time do you get up?", "I get up at {x}. / I get up at {x} o'clock.", "six, seven, eight, nine, ten"),
      say("Do you walk to school?", "I {x} walk to school.", "always, usually, often, sometimes, never"),
    ],
  }),
  unitSpeaking({
    id: "a1-speaking-time-and-dates",
    title: t("Speaking: Time and Dates", "口语：时间和日期"),
    summary: t(
      "Say the unit's words, read its sentences aloud, and answer questions on its theme aloud.",
      "说出“时间和日期”的词汇，朗读句子，并开口回答相关问题。",
    ),
    listening: "a1-listening-time-and-dates",
    words: ["a1-words-time", "a1-words-days", "a1-words-months", "a1-words-dates", "a1-words-ordinals"],
    frames: [
      say("When is your birthday?", "My birthday is in {x}. / It is in {x}.", "January, March, May, July, October"),
      say("What day is it today?", "It is {x}. / Today is {x}. / It is {x} today.", "Monday, Tuesday, Wednesday, Thursday, Friday"),
    ],
  }),
  unitSpeaking({
    id: "a1-speaking-food-and-drink",
    title: t("Speaking: Food and Drink", "口语：食物和饮料"),
    summary: t(
      "Say the unit's words, read its sentences aloud, and answer questions on its theme aloud.",
      "说出“食物和饮料”的词汇，朗读句子，并开口回答相关问题。",
    ),
    listening: "a1-listening-food-and-drink",
    words: ["a1-words-food", "a1-words-drinks", "a1-words-meals", "a1-words-favorite-foods"],
    frames: [
      say(
        "What would you like to drink?",
        "I would like some {x}, please. / I would like {x}, please. / I would like some {x}. / I would like {x}.",
        "water, milk, juice, tea, coffee",
      ),
      say("What do you have for breakfast?", "I have {x} for breakfast. / I have {x}.", "eggs, bread, rice, fruit, noodles"),
    ],
  }),
  unitSpeaking({
    id: "a1-speaking-clothes-and-shopping",
    title: t("Speaking: Clothes and Shopping", "口语：衣服和购物"),
    summary: t(
      "Say the unit's words, read its sentences aloud, and answer questions on its theme aloud.",
      "说出“衣服和购物”的词汇，朗读句子，并开口回答相关问题。",
    ),
    listening: "a1-listening-clothes-and-shopping",
    words: ["a1-words-clothes", "a1-words-shopping", "a1-words-at-the-shop"],
    frames: [
      say(
        "What are you wearing today?",
        "I am wearing {x}. / I am wearing {x} today.",
        "a blue shirt, a red dress, jeans, a black coat, a green hat",
      ),
      say("How much is the T-shirt?", "It is {x} dollars. / The T-shirt is {x} dollars.", "five, ten, twelve, fifteen, twenty"),
    ],
  }),
  unitSpeaking({
    id: "a1-speaking-home",
    title: t("Speaking: Home", "口语：家"),
    summary: t(
      "Say the unit's words, read its sentences aloud, and answer questions on its theme aloud.",
      "说出“家”的词汇，朗读句子，并开口回答相关问题。",
    ),
    listening: "a1-listening-home",
    words: ["a1-words-home", "a1-words-things-at-home", "a1-words-housework"],
    frames: [
      say("Where is your cat?", "My cat is in the {x}. / It is in the {x}.", "living room, kitchen, bedroom, bathroom, garden"),
      say(
        "How many rooms are there in your home?",
        "There are {x} rooms. / There are {x} rooms in my home.",
        "three, four, five, six, seven",
      ),
    ],
  }),
  unitSpeaking({
    id: "a1-speaking-free-time",
    title: t("Speaking: Free Time", "口语：业余时间"),
    summary: t(
      "Say the unit's words, read its sentences aloud, and answer questions on its theme aloud.",
      "说出“业余时间”的词汇，朗读句子，并开口回答相关问题。",
    ),
    listening: "a1-listening-free-time",
    words: ["a1-words-sports-and-music", "a1-words-hobbies", "a1-words-parties", "a1-words-actions"],
    frames: [
      say(
        "What do you like doing in your free time?",
        "I like {x}. / I like {x} in my free time.",
        "swimming, reading, dancing, painting, playing football",
      ),
      say("What instrument do you play?", "I play the {x}.", "piano, guitar, violin, drums, flute"),
    ],
  }),
  unitSpeaking({
    id: "a1-speaking-school",
    title: t("Speaking: School", "口语：学校"),
    summary: t(
      "Say the unit's words, read its sentences aloud, and answer questions on its theme aloud.",
      "说出“学校”的词汇，朗读句子，并开口回答相关问题。",
    ),
    listening: "a1-listening-school",
    words: ["a1-words-school-subjects", "a1-words-schoolwork", "a1-words-little-words-2"],
    frames: [
      say("What is your favorite subject?", "My favorite subject is {x}. / It is {x}.", "math, music, art, science, history"),
      say("When is your English lesson?", "It is on {x}. / My English lesson is on {x}.", "Monday, Tuesday, Wednesday, Thursday, Friday"),
    ],
  }),
  unitSpeaking({
    id: "a1-speaking-the-library",
    title: t("Speaking: The Library", "口语：图书馆"),
    summary: t(
      "Say the unit's words, read its sentences aloud, and answer questions on its theme aloud.",
      "说出“图书馆”的词汇，朗读句子，并开口回答相关问题。",
    ),
    listening: "a1-listening-the-library",
    words: ["a1-words-library", "a1-words-books"],
    frames: [
      say("What kind of books do you like?", "I like {x}.", "comics, stories, poems, novels, picture books"),
      say("How many books can I borrow?", "You can borrow {x} books.", "two, three, four, five, six"),
    ],
  }),
  unitSpeaking({
    id: "a1-speaking-weather-and-nature",
    title: t("Speaking: Weather and Nature", "口语：天气和自然"),
    summary: t(
      "Say the unit's words, read its sentences aloud, and answer questions on its theme aloud.",
      "说出“天气和自然”的词汇，朗读句子，并开口回答相关问题。",
    ),
    listening: "a1-listening-weather-and-nature",
    words: ["a1-words-weather", "a1-words-seasons", "a1-words-nature", "a1-words-wild-animals"],
    frames: [
      say("What is the weather like today?", "It is {x}. / It is {x} today.", "sunny, rainy, windy, cloudy, cold"),
      say("What is your favorite season?", "My favorite season is {x}. / It is {x}.", "spring, summer, autumn, winter, fall"),
    ],
  }),
  unitSpeaking({
    id: "a1-speaking-people-and-jobs",
    title: t("Speaking: People and Jobs", "口语：人和职业"),
    summary: t(
      "Say the unit's words, read its sentences aloud, and answer questions on its theme aloud.",
      "说出“人和职业”的词汇，朗读句子，并开口回答相关问题。",
    ),
    listening: "a1-listening-people-and-jobs",
    words: ["a1-words-jobs", "a1-words-describing-people", "a1-words-work-actions"],
    frames: [
      say("What does your mother do?", "She is a {x}. / My mother is a {x}.", "teacher, doctor, nurse, farmer, driver"),
      say("What is your friend like?", "He is {x}. / My friend is {x}.", "tall, short, friendly, funny, kind"),
    ],
  }),
  unitSpeaking({
    id: "a1-speaking-town-and-travel",
    title: t("Speaking: Town and Travel", "口语：城镇和出行"),
    summary: t(
      "Say the unit's words, read its sentences aloud, and answer questions on its theme aloud.",
      "说出“城镇和出行”的词汇，朗读句子，并开口回答相关问题。",
    ),
    listening: "a1-listening-town-and-travel",
    words: ["a1-words-town", "a1-words-directions", "a1-words-trips"],
    frames: [
      say("How do you go to school?", "I go to school by {x}. / I go by {x}.", "bus, bike, car, train, taxi"),
      say("Where is the bank?", "It is next to the {x}. / The bank is next to the {x}.", "park, station, school, hotel, library"),
    ],
  }),
];
