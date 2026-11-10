// A2, everyday words that the units on themes left out: where things are and their shapes, sounds and messages,
// family, food and measures, and everyday ideas. Passages of A2 and above may use them once these batches are taught.

import { type TopicDef, t } from "@ga/content";
import type { WordBatch } from "../../pack.ts";
import { vocabularyTopic, word } from "../words.ts";

const positions = vocabularyTopic({
  id: "a2-words-positions-and-shapes",
  title: t("Where, Who and What Shape", "在哪里、谁和什么形状"),
  summary: t(
    "The top, the middle and inside; away, everywhere and nobody; a box, a shape and a fire.",
    "顶部、中间和里面；离开、到处和没有人；盒子、形状和火。",
  ),
  prerequisites: ["a1-words-things-at-home"],
  words: [
    word(
      "top tops",
      "the highest part of something",
      "顶部；上面",
      "We climbed to the {top} of the hill.|box fire | Write your name at the {top} of the page.|fire shape | The {tops} of the mountains are white with snow.|boxes fires",
      "middle shape",
    ),
    word(
      "middle",
      "the part that is the same distance from all the sides or ends",
      "中间",
      "There is a big table in the {middle} of the room.|fire away | I woke up in the {middle} of the night.|top fire | She sits in the {middle}, between Tom and Anna.|nobody away",
      "inside away",
    ),
    word(
      "inside",
      "in a room, a building or a container; not outside",
      "在……里面；在室内",
      "It's raining. Let's play {inside}.|middle nobody | What's {inside} the box?|away nobody | The children ran {inside} when it started to snow.|nobody middle",
      "away middle",
    ),
    word(
      "away",
      "to or at another place; not here",
      "离开；在别处",
      "Go {away}! I'm doing my homework.|middle nobody | My grandparents live two hours {away}.|inside middle | She looked at the dog and then ran {away}.|middle nobody",
      "inside everywhere",
    ),
    word(
      "everywhere",
      "in all places",
      "到处；处处",
      "I've looked {everywhere}, but I can't find my keys.|nobody middle | There were people {everywhere} in the market.|nobody middle | Snow was {everywhere} after the storm.|nobody top",
      "nobody away",
    ),
    word(
      "nobody",
      "no person; not anyone",
      "没有人",
      "I knocked on the door, but {nobody} answered.|everywhere away | {Nobody} in my class can swim.|everywhere middle | The shop was empty. There was {nobody} there.|everywhere middle",
      "everywhere inside",
    ),
    word(
      "box boxes",
      "a container with straight sides, often made of paper or wood",
      "盒子；箱子",
      "Put the old toys in a {box}.|shape top | We bought a {box} of chocolates for Grandma.|fire shape | The kitchen is full of {boxes} because we're moving house.|shapes fires",
      "shape fire",
    ),
    word(
      "shape shapes",
      "the form of something, such as round or square",
      "形状",
      "A ball has a round {shape}.|fire middle | Cut the paper into a heart {shape}.|fire middle | Circles and squares are {shapes}.|boxes fires",
      "box middle",
    ),
    word(
      "fire fires",
      "the heat and flames that come when something burns",
      "火；火灾",
      "We sat around the {fire} and sang songs.|shape nobody | Call 119 if you see a {fire}!|shape top | The {fire} burned the old house to the ground.|shape middle",
      "box shape",
    ),
  ],
});

const sounds = vocabularyTopic({
  id: "a2-words-sounds-and-messages",
  title: t("Sounds and Messages", "声音和信息"),
  summary: t(
    "Noise, sounds and voices; letters, the radio and touch; secrets, guesses and mistakes.",
    "噪音、声音和嗓音；信、收音机和触摸；秘密、猜测和错误。",
  ),
  prerequisites: ["a2-words-communication"],
  words: [
    word(
      "noise noises",
      "a sound, often one that is loud or not nice",
      "噪音；响声",
      "Please don't make so much {noise}. The baby is sleeping.|voice letter | What was that {noise}? Is someone at the door?|mistake secret | The old car makes strange {noises}.|letters secrets",
      "voice secret",
      "sound",
    ),
    word(
      "sound sounds",
      "something that you hear",
      "声音",
      "I love the {sound} of the sea.|letter mistake | Can you hear that {sound}? I think it's a bird.|letter secret | The word 'cat' has three {sounds}.|letters secrets",
      "letter voice",
      "noise",
    ),
    word(
      "voice voices",
      "the sounds a person makes when they speak or sing",
      "嗓音；说话声",
      "She has a beautiful singing {voice}.|letter radio | I can hear {voices} in the next room.|letters secrets | Please speak in a quiet {voice}. We're in the library.|radio letter",
      "noise letter",
    ),
    word(
      "letter letters",
      "a written message that you send by post; a sign such as A, B or C",
      "信；字母",
      "I wrote a {letter} to my pen friend in Canada.|voice radio | The English alphabet has 26 {letters}.|voices sounds | Did the postman bring any {letters} today?|voices noises",
      "radio voice",
    ),
    word(
      "radio radios",
      "a machine that you listen to music, news and talk on",
      "收音机；广播",
      "My dad listens to the news on the {radio} every morning.|letter voice | Turn the {radio} down, please. It's too loud.|letter secret | I heard my favorite song on the {radio}.|letter mistake",
      "letter voice",
    ),
    word(
      "touch touches touched touching",
      "to put your hand on something",
      "触摸；碰",
      "Please don't {touch} the paintings.|guess sound | The baby {touched} my face with her small hand.|guessed sounded | Be careful! Don't {touch} the hot plate.|guess sound",
      "guess voice",
    ),
    word(
      "secret secrets",
      "something that you tell nobody, or only a few people",
      "秘密",
      "Can you keep a {secret}? Don't tell anyone.|mistake radio | The party is a {secret}. Mom doesn't know.|radio letter | We share all our {secrets}.|radios voices",
      "mistake noise",
    ),
    word(
      "guess guesses guessed guessing",
      "to give an answer when you are not sure it is right",
      "猜；猜测",
      "{Guess} what? I won the race!|Touch Sound | I don't know the answer, so I'll {guess}.|touch sound | She {guessed} my age: fourteen. She was right!|touched sounded",
      "touch secret",
    ),
    word(
      "mistake mistakes",
      "something that is not right",
      "错误",
      "I made three {mistakes} in my spelling test.|secrets voices | Sorry, it was a {mistake}. I took your bag.|voice radio | Everyone makes {mistakes}. That's how we learn.|secrets letters",
      "secret guess",
    ),
  ],
});

const family = vocabularyTopic({
  id: "a2-words-family-food-and-measures",
  title: t("Family, Food and Measures", "家人、食物和度量"),
  summary: t(
    "Grandfathers, grandmothers and age; cheese, chocolate and the cinema; kilometers and meters; quick and bright.",
    "祖父、祖母和年龄；奶酪、巧克力和电影院；千米和米；快的和明亮的。",
  ),
  prerequisites: ["a1-words-numbers-to-hundred"],
  words: [
    word(
      "grandfather grandfathers",
      "the father of your father or mother",
      "祖父；外祖父",
      "My {grandfather} is eighty, but he still walks every day.|grandmother cinema | My {grandfather} was a farmer, and he loved his cows.|grandmother cheese | My mom's father and my dad's father are my two {grandfathers}.|grandmothers meters",
      "grandmother age",
    ),
    word(
      "grandmother grandmothers",
      "the mother of your father or mother",
      "祖母；外祖母",
      "My {grandmother} is seventy, and she still works in her garden.|grandfather cinema | My {grandmother} tells me stories about her childhood.|grandfather cheese | My mom's mother and my dad's mother are my two {grandmothers}.|grandfathers kilometers",
      "grandfather age",
    ),
    word(
      "age ages",
      "how old a person or thing is",
      "年龄",
      "What {age} is your sister? She's twelve.|meter cheese | He started school at the {age} of six.|meter cinema | Children of all {ages} can join the club.|meters kilometers",
      "meter cinema",
    ),
    word(
      "cheese cheeses",
      "a yellow or white food made from milk",
      "奶酪",
      "I'd like a {cheese} sandwich, please.|cinema age | Mice love {cheese}.|cinema age | France is famous for its {cheeses}.|cinemas kilometers",
      "chocolate cinema",
    ),
    word(
      "chocolate chocolates",
      "a sweet brown food made from cocoa",
      "巧克力",
      "Would you like a cup of hot {chocolate}?|cinema age | I bought a box of {chocolates} for my teacher.|cinemas meters | Don't eat too much {chocolate}. It's bad for your teeth.|cinema age",
      "cheese cinema",
    ),
    word(
      "cinema cinemas",
      "a building where you go to watch films",
      "电影院",
      "Let's go to the {cinema} tonight. There's a new film.|cheese age | The {cinema} is next to the shopping center.|cheese chocolate | There are three {cinemas} in our town.|cheeses ages",
      "chocolate meter",
    ),
    word(
      "kilometer kilometers",
      "a thousand meters, used to measure long distances",
      "千米；公里",
      "The station is two {kilometers} from my house.|ages cheeses | I run five {kilometers} every morning.|ages chocolates | The train goes at 300 {kilometers} an hour.|ages cinemas",
      "meter age",
    ),
    word(
      "meter meters",
      "a measure of length; there are 100 centimeters in a meter",
      "米",
      "The wall is two {meters} high.|ages kilometers | She swam a hundred {meters} in two minutes.|ages cheeses | This room is four {meters} long.|ages cinemas",
      "kilometer age",
    ),
    word(
      "quick quicker quickest",
      "fast; taking only a short time",
      "快的；迅速的",
      "Can I ask a {quick} question?|bright old | Walking is {quicker} than taking the bus at this time of day.|brighter older | The {quickest} way to the station is through the park.|brightest loudest",
      "bright slow",
    ),
    word(
      "bright brighter brightest",
      "full of light; strong in color",
      "明亮的；鲜艳的",
      "The sun is very {bright} today. Wear your sunglasses.|quick slow | She painted her room a {bright} yellow.|quick slow | This is the {brightest} room in the house.|quickest slowest",
      "quick dark",
    ),
  ],
});

const ideas = vocabularyTopic({
  id: "a2-words-everyday-ideas",
  title: t("Everyday Ideas", "日常概念"),
  summary: t(
    "Lists, news and facts; results and the brain; simple and clear; seeming; anyone and somebody; since and instead.",
    "清单、消息和事实；结果和大脑；简单和清楚；似乎；任何人和某人；自从和代替。",
  ),
  prerequisites: ["a2-words-useful-words"],
  words: [
    word(
      "list lists",
      "a set of names or things written one below the other",
      "清单；名单",
      "I wrote a shopping {list}: eggs, milk and bread.|fact brain | Is my name on the {list}?|news brain | Make a {list} of things to take on the trip.|fact result",
      "fact news",
    ),
    word(
      "simple simpler simplest",
      "easy to understand or do",
      "简单的",
      "The question was very {simple}. Everyone knew the answer.|anyone instead | It's a {simple} recipe with only three things in it.|brain fact | The rules of the game are {simple}.|instead since",
      "brain list",
      "clear",
    ),
    word(
      "clear clearer clearest clearly",
      "easy to see, hear or understand; with no clouds",
      "清楚的；晴朗的",
      "The sky is {clear} today. There are no clouds.|anyone instead | Is that {clear}, or shall I explain again?|instead since | Please speak {clearly}.|instead since",
      "brain news",
      "simple",
    ),
    word(
      "seem seems seemed seeming",
      "to look or feel like something",
      "似乎；看起来",
      "You {seem} tired. Did you sleep well?|list result | The new teacher {seems} very nice.|lists results | It {seemed} like a good idea at the time.|listed resulted",
      "list result",
    ),
    word(
      "anyone",
      "any person, used in questions, after not, or to mean every person",
      "任何人",
      "Is {anyone} at home?|instead since | I didn't tell {anyone} your secret.|instead since | {Anyone} can learn to swim.|Since Instead",
      "since instead",
      "somebody",
    ),
    word(
      "somebody",
      "a person, when you do not know or do not say who",
      "某人；有人",
      "There's {somebody} at the door.|anyone instead | {Somebody} has taken my pen!|Anyone Instead | I need {somebody} to help me carry this box.|instead since",
      "since instead",
      "anyone",
    ),
    word(
      "news",
      "new information about something that has happened",
      "消息；新闻",
      "Have you heard the {news}? Anna is going to have a baby!|list brain | I watch the {news} on TV every evening.|list fact | That's great {news}!|list brain",
      "fact list",
    ),
    word(
      "fact facts",
      "something that is true",
      "事实",
      "It's a {fact} that the earth goes around the sun.|news list | Here are some {facts} about pandas.|lists brains | In {fact}, I've never been to Paris.|list result",
      "news result",
    ),
    word(
      "result results",
      "what happens because of something; your mark in an exam",
      "结果；成绩",
      "When will we get our exam {results}?|lists facts | As a {result} of the rain, the game was stopped.|list fact | The {result} of the match was 2–1.|brain list",
      "fact list",
    ),
    word(
      "brain brains",
      "the part inside your head that you think with",
      "脑；大脑",
      "Your {brain} controls your whole body.|list news | Reading is good for your {brain}.|list result | Use your {brain}! Think about it.|list fact",
      "list result",
    ),
    word(
      "since",
      "from a time in the past until now; because",
      "自从；因为",
      "I've lived here {since} 2015.|instead anyone | We haven't seen her {since} the party.|instead somebody | {Since} it's raining, let's stay at home.|Instead Anyone",
      "instead anyone",
    ),
    word(
      "instead",
      "in place of someone or something",
      "代替；反而",
      "There's no tea, so I'll have coffee {instead}.|since anyone | Let's walk {instead} of taking the bus.|since anyone | He didn't study. {Instead}, he watched TV all night.|Since Anyone",
      "since anyone",
    ),
  ],
});

/** topics are the extra word topics of A2. */
export const topics: readonly TopicDef[] = [positions.topic, sounds.topic, family.topic, ideas.topic];

/** vocabulary are the extra words of A2. */
export const vocabulary: readonly WordBatch[] = [positions.batch, sounds.batch, family.batch, ideas.batch];
