// A1, unit 12: In Town. Places in town, directions and trips, wh- questions, can for requests, and directions to your
// home judged by a model.

import { type CriterionSpec, type Text, type TopicDef, t } from "@ga/content";
import {
  type ChoiceItem,
  choiceGenerator,
  criterionById,
  point,
  type TypedItem,
  typedGenerator,
  type WritingItem,
  writingGenerator,
} from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { interleave, vocabularyTopic, word } from "../words.ts";

const town = vocabularyTopic({
  id: "a1-words-town",
  title: t("In Town", "城镇里"),
  summary: t(
    "Streets and roads, buses, cars and trains, and the places in a town.",
    "街道和马路，公交车、汽车和火车，以及城镇里的各种地方。",
  ),
  prerequisites: ["a1-words-home"],
  words: [
    word(
      "town towns",
      "a place with many houses and shops, smaller than a city",
      "城镇",
      "I live in a small {town} near the sea.|map bus | There is one museum in our {town}.|map car | The {town} has a big market on Saturdays.|map bus",
      "street road",
    ),
    word(
      "street streets",
      "a road in a town, with houses or shops on it",
      "街道",
      "My school is on Green {Street}.|Bus Train | Look both ways before you cross the {street}.|bus museum | There are many shops on this {street}.|bus map",
      "road town",
    ),
    word(
      "road roads",
      "a way for cars, buses and bikes to go from one place to another",
      "马路；道路",
      "Don't play on the {road}! It's dangerous.|bank map | This {road} goes to the airport.|bank hotel | The {road} is busy in the morning.|map bank",
      "street way",
    ),
    word(
      "bus buses",
      "a big car that carries many people along a set way",
      "公共汽车",
      "I go to school by {bus}.|bank hotel | The number 5 {bus} goes to the zoo.|bank hotel | We waited for the {bus} for ten minutes.|bank map",
      "car train",
    ),
    word(
      "car cars",
      "a machine with four wheels that people drive",
      "汽车",
      "My dad drives a red {car}.|bank hotel | There are a lot of {cars} on the road.|banks maps | Put on your seat belt in the {car}.|bank map",
      "bus train",
    ),
    word(
      "train trains",
      "a line of cars that goes on rails",
      "火车",
      "We go to Shanghai by {train}.|bank map | The {train} leaves from platform 3.|bank map | The fast {train} goes 300 kilometers an hour.|bank museum",
      "bus car",
    ),
    word(
      "station stations",
      "a place where trains or buses stop for people to get on and off",
      "车站",
      "The train is at the {station}.|map museum | Meet me at the bus {station} at four.|map hotel | The {station} is very busy in the morning.|map hotel",
      "street bank",
    ),
    word(
      "bank banks",
      "a place where people keep their money",
      "银行",
      "Mom gets money from the {bank}.|museum map | The {bank} is next to the post office.|map car | The {bank} closes at five.|map car",
      "hotel museum",
    ),
    word(
      "restaurant restaurants",
      "a place where people pay to sit and eat a meal",
      "餐馆",
      "We have dinner at a Chinese {restaurant}.|station bank | This {restaurant} has very good noodles.|station bank | The {restaurant} is full. There are no tables.|station map",
      "hotel museum",
    ),
    word(
      "hotel hotels",
      "a building where people pay to sleep when they travel",
      "旅馆；酒店",
      "We stayed in a {hotel} near the beach.|bank map | Our {hotel} room has a big bed.|bank station | The {hotel} has a swimming pool.|map bank",
      "restaurant museum",
    ),
    word(
      "museum museums",
      "a building where you can look at old or important things",
      "博物馆",
      "We saw dinosaur bones at the {museum}.|bank station | The art {museum} is open on Sundays.|bank road | There are old Chinese bowls in this {museum}.|bank road",
      "hotel bank",
    ),
    word(
      "map maps",
      "a picture that shows where streets, towns and countries are",
      "地图",
      "Let's look at the {map}. Where is the museum?|bank bus | I can't find the hotel. Do you have a {map}?|bank road | This {map} shows all the streets in the town.|bank bus",
      "street road",
    ),
  ],
});

const directions = vocabularyTopic({
  id: "a1-words-directions",
  title: t("Directions", "方向"),
  summary: t(
    "Left, turn, straight, stop, cross and corner, near and far, and getting about.",
    "左、转弯、直走、停、穿过和拐角，远和近，以及出行。",
  ),
  prerequisites: ["a1-words-town"],
  words: [
    word(
      "left",
      "on the side of your body where most people have their heart",
      "左边；向左",
      "Turn {left} at the bank.|ticket plane | Write with your {left} hand.|ticket plane | The museum is on the {left}.|ticket plane",
      "right straight",
    ),
    word(
      "turn turns turned turning",
      "to go in a new way, left or right",
      "转弯；转动",
      "{Turn} right at the corner.|Travel Visit | Don't {turn} left here. Go straight on.|travel visit | The bus {turned} into Park Road.|traveled visited",
      "cross stop",
    ),
    word(
      "straight",
      "not turning; in a line",
      "直；直的",
      "Go {straight} on, then turn left.|far corner | She has long {straight} hair.|far corner | Walk {straight} to the end of the street.|far ticket",
      "left far",
    ),
    word(
      "stop stops stopped stopping",
      "to not move any more; a place where a bus stops",
      "停下；车站",
      "{Stop}! The light is red.|Travel Visit | The bus {stops} outside our school.|travels visits | Get off at the next bus {stop}.|plane ticket",
      "turn cross",
    ),
    word(
      "cross crosses crossed crossing",
      "to go from one side of a road or river to the other",
      "穿过；横过",
      "{Cross} the road at the green light.|Travel Stop | We {crossed} the river by boat.|stopped visited | Be careful when you {cross} the street.|stop travel",
      "turn stop",
    ),
    word(
      "corner corners",
      "the place where two streets meet",
      "拐角",
      "The bank is on the {corner} of Park Road and Green Street.|ticket plane | Turn left at the {corner}.|ticket plane | There's a shop on the {corner}.|plane ticket",
      "way left",
    ),
    word(
      "far farther farthest",
      "a long way away",
      "远的；远",
      "Is the station {far} from here? — No, it's near.|straight left | My school isn't {far}. I can walk there.|straight left | The airport is {farther} than the station.|straighter lefter",
      "straight left",
    ),
    word(
      "way ways",
      "how to get to a place; a road or path",
      "路；方法",
      "Can you tell me the {way} to the station?|ticket plane | Is this the right {way} to the museum?|ticket plane | We lost our {way} in the forest.|ticket plane",
      "corner map",
    ),
    word(
      "ticket tickets",
      "a piece of paper that lets you get on a bus or a train, or go into a place",
      "票",
      "I need a {ticket} for the train.|corner way | Two {tickets} to Beijing, please.|corners ways | Show your {ticket} to the driver.|corner way",
      "map way",
    ),
    word(
      "travel travels traveled traveling",
      "to go from one place to another, often far away",
      "旅行；出行",
      "I want to {travel} around the world.|turn stop | They {travel} to work by train.|turn stop | Last summer we {traveled} to Japan.|turned stopped",
      "visit cross",
    ),
    word(
      "visit visits visited visiting",
      "to go and see a person or a place",
      "拜访；参观",
      "We {visit} Grandma every Sunday.|turn cross | Let's {visit} the museum tomorrow.|turn cross | They {visited} the Great Wall last year.|turned crossed",
      "travel meet",
    ),
    word(
      "plane planes",
      "a machine with wings that flies people through the sky",
      "飞机",
      "We flew to Sydney by {plane}.|corner ticket | The {plane} lands at the airport at six.|corner ticket | Look! A {plane} is flying over our house.|corner ticket",
      "train ship",
    ),
  ],
});

const trips = vocabularyTopic({
  id: "a1-words-trips",
  title: t("Trips", "旅行"),
  summary: t(
    "Trips and holidays, airports and bridges, boats, ships and taxis, arriving and leaving, fast and slow.",
    "旅行和假期，机场和桥，船和出租车，到达和离开，快和慢。",
  ),
  prerequisites: ["a1-words-directions"],
  words: [
    word(
      "trip trips",
      "a short journey to a place and back",
      "旅行；出行",
      "We went on a school {trip} to the zoo.|taxi bridge | Have a good {trip}!|taxi bridge | The {trip} to the beach takes two hours.|taxi bridge",
      "holiday ship",
    ),
    word(
      "holiday holidays",
      "a time with no school or work, often when people travel",
      "假期",
      "We go to the beach in the summer {holiday}.|taxi airport | Today is a {holiday}, so the banks are closed.|taxi bridge | Where did you go on {holiday}?|taxi bridge",
      "trip airport",
    ),
    word(
      "airport airports",
      "a place where planes take off and land",
      "机场",
      "We take a taxi to the {airport}.|bridge holiday | The plane lands at the {airport} at nine.|bridge boat | The {airport} is far from the city.|bridge holiday",
      "station bridge",
    ),
    word(
      "bridge bridges",
      "a road that goes over a river or another road",
      "桥",
      "We walk across the {bridge} to get to school.|taxi airport | There are three {bridges} over the river.|taxis airports | The old {bridge} is made of stone.|taxi holiday",
      "road airport",
    ),
    word(
      "boat boats",
      "a small thing that carries people on water",
      "小船",
      "We crossed the lake in a {boat}.|taxi bridge | My uncle has a fishing {boat}.|taxi bridge | Can you row a {boat}?|taxi bridge",
      "ship taxi",
    ),
    word(
      "ship ships",
      "a big boat that goes across the sea",
      "轮船",
      "The {ship} carries cars across the sea.|taxi bridge | Big {ships} come into the port every day.|taxis bridges | We went to the island by {ship}.|taxi bridge",
      "boat plane",
    ),
    word(
      "taxi taxis",
      "a car with a driver that you pay to take you somewhere",
      "出租车",
      "Let's take a {taxi} to the hotel.|bridge ship | The {taxi} driver knows the way.|bridge ship | Call a {taxi}, please. It's raining.|bridge ship",
      "bus boat",
    ),
    word(
      "arrive arrives arrived arriving",
      "to get to a place",
      "到达",
      "The train {arrives} at ten.|crosses visits | We {arrived} at the hotel late at night.|crossed visited | What time do you {arrive} at school?|cross visit",
      "leave come",
    ),
    word(
      "leave leaving",
      "to go away from a place",
      "离开；出发",
      "We {leave} for school at half past seven.|cross visit | Don't {leave} your bag on the bus!|cross visit | We are {leaving} now. Goodbye!|crossing visiting",
      "arrive stay",
    ),
    word(
      "fast faster fastest",
      "moving quickly",
      "快的；快",
      "The train is very {fast}.|slow far | A cheetah can run very {fast}.|slow far | The plane is {faster} than the train.|slower farther",
      "slow quick",
    ),
    word(
      "slow slower slowest",
      "not fast; taking a long time",
      "慢的",
      "The old bus is very {slow}.|fast far | Turtles are {slow} animals.|fast far | Our old computer is {slower} than the new one.|faster farther",
      "fast late",
    ),
  ],
});

// Wh- questions.

/** WhItem is a question with a wh- word, the statement it asks about, its answer and a wrong way to ask it. */
type WhItem = {
  readonly ask: string;
  readonly question: string;
  readonly statement: string;
  readonly answer: string;
  readonly wrong: string;
};

const whItems: readonly WhItem[] = [
  "Where|Where does Tom live?|Tom lives near the station.|Near the station.|Where Tom lives?",
  "When|When does the train leave?|The train leaves at nine o'clock.|At nine o'clock.|When the train leaves?",
  "What|What does your dad drive?|My dad drives a taxi.|A taxi.|What your dad drives?",
  "Who|Who is your teacher?|Ms. Wang is my teacher.|Ms. Wang.|Who your teacher is?",
  "Where|Where is the bank?|The bank is next to the hotel.|Next to the hotel.|Where the bank is?",
  "How|How do you go to school?|I go to school by bus.|By bus.|How you go to school?",
  "What time|What time does the museum open?|The museum opens at ten.|At ten.|What time the museum opens?",
  "Why|Why are you tired?|I'm tired because I walked a lot.|Because I walked a lot.|Why you are tired?",
  "Where|Where are my keys?|Your keys are on the table.|On the table.|Where my keys are?",
  "Who|Who drives the bus?|Mr. Li drives the bus.|Mr. Li.|Who does drive the bus?",
  "What|What is your address?|My address is 12 Park Road.|12 Park Road.|What your address is?",
  "How old|How old is your brother?|My brother is seven.|He's seven.|How old your brother is?",
  "How many|How many buses go to the airport?|Three buses go to the airport.|Three.|How many buses do go to the airport?",
  "Where|Where do your grandparents live?|My grandparents live on a farm.|On a farm.|Where your grandparents live?",
  "When|When do you visit your grandma?|I visit my grandma on Sundays.|On Sundays.|When you visit your grandma?",
  "What|What do you want for lunch?|I want noodles for lunch.|Noodles.|What you want for lunch?",
  "Who|Who is that man?|That man is my uncle.|My uncle.|Who that man is?",
  "How|How is your mom?|My mom is fine, thanks.|She's fine, thanks.|How your mom is?",
  "Where|Where is the hotel?|The hotel is on Green Street.|On Green Street.|Where the hotel is?",
  "What time|What time do you have dinner?|I have dinner at half past six.|At half past six.|What time you have dinner?",
  "Why|Why do you like trains?|I like trains because they are fast.|Because they are fast.|Why you like trains?",
  "What|What does Lily do on Saturdays?|Lily plays tennis on Saturdays.|She plays tennis.|What Lily does on Saturdays?",
  "Where|Where does this bus go?|This bus goes to the zoo.|To the zoo.|Where this bus goes?",
  "Who|Who lives in that house?|Mrs. Green lives in that house.|Mrs. Green.|Who does live in that house?",
  "How|How does your mom go to work?|My mom goes to work by train.|By train.|How your mom goes to work?",
  "How much|How much is the ticket?|The ticket is five dollars.|Five dollars.|How much the ticket is?",
  "When|When is your birthday?|My birthday is in May.|In May.|When your birthday is?",
  "What|What is in your bag?|My ticket is in my bag.|My ticket.|What in your bag is?",
  "Where|Where are you from?|I'm from China.|From China.|Where you are from?",
  "How old|How old is this bridge?|This bridge is two hundred years old.|Two hundred years old.|How old this bridge is?",
  "Why|Why is the shop closed?|The shop is closed because it's Sunday.|Because it's Sunday.|Why the shop is closed?",
  "Who|Who is your best friend?|Ben is my best friend.|Ben.|Who your best friend is?",
  "What time|What time does the bank close?|The bank closes at five.|At five.|What time the bank closes?",
  "How many|How many people live in your town?|Ten thousand people live in my town.|Ten thousand.|How many people do live in your town?",
  "Where|Where do you play football?|We play football in the park.|In the park.|Where you play football?",
  "What|What does your sister study?|My sister studies math.|Math.|What your sister studies?",
  "When|When do the shops open?|The shops open at nine.|At nine.|When the shops open?",
].map((line): WhItem => {
  const [ask = "", question = "", statement = "", answer = "", wrong = ""] = line.split("|");
  return { ask, question, statement, answer, wrong };
});

/** whDecoys are two wrong question words for each right one; When and What time never stand against each other. */
const whDecoys: Readonly<Record<string, readonly [string, string]>> = {
  Where: ["When", "What"],
  When: ["Where", "Who"],
  What: ["Where", "Who"],
  Who: ["What", "Where"],
  How: ["What", "Where"],
  Why: ["What", "Where"],
};

const firstWord = (s: string): string => s.slice(0, s.indexOf(" "));

const whChoiceBank: readonly ChoiceItem[] = whItems.map(({ question, answer }): ChoiceItem => {
  const wh = firstWord(question);
  return [`___${question.slice(wh.length)} — ${answer}`, wh, whDecoys[wh] ?? ["Where", "Who"]];
});

/** whPattern accepts the question with is shortened after the wh- word, and When or What time for a clock time. */
const whPattern = ({ question, answer }: WhItem): string => {
  const timed = answer.startsWith("At ") ? question.replace(/^(When|What time) /u, "[When|What time] ") : question;
  return timed.replace(/^(Where|What|Who|How) is /u, "[$1 is|$1's] ");
};

const whAskBank: readonly TypedItem[] = whItems.map(
  (item): TypedItem => ({
    shown: item.statement,
    instruction: t(`Ask a question with ${item.ask} about this sentence.`, `用 ${item.ask} 对这个句子提问。`),
    accepted: [whPattern(item)],
    canonical: item.question,
    wrong: [item.wrong, `${item.statement.slice(0, -1)}?`],
  }),
);

/** whKind says what a question word asks about, from the gap and what follows it. */
const whKind = (wh: string, after: string): Text => {
  if (wh === "What" && after.startsWith("time")) return t("a time", "时间");
  if (wh === "How" && after.startsWith("old")) return t("an age", "年龄");
  if (wh === "How" && after.startsWith("many")) return t("a number", "数量");
  if (wh === "How" && after.startsWith("much")) return t("a price", "价钱");
  const kinds: Record<string, Text> = {
    Where: t("a place", "地点"),
    When: t("a time", "时间"),
    What: t("a thing", "事物"),
    Who: t("a person", "人"),
    How: t("the way something is done or how someone is", "方式或状况"),
    Why: t("a reason", "原因"),
  };
  return kinds[wh] ?? t("something", "某事");
};

/** whParts splits a gapped question into the words after the gap and the answer. */
const whParts = (shown: string): readonly [after: string, answer: string] => {
  const [question = "", answer = ""] = shown.split(" — ");
  return [question.replace(/^___ /u, ""), answer];
};

/** whWhy explains the question word that an answer calls for. */
const whWhy = (right: string, shown: string): Text => {
  const [after, answer] = whParts(shown);
  const kind = whKind(right, after);
  const full = shown.replace("___", right);
  return t(
    `The answer *${answer}* gives ${kind.en}, and *${right}${after.startsWith("time") || /^(old|many|much)\b/u.test(after) ? ` ${after.split(" ")[0]}` : ""}* asks about ${kind.en}: ${full}`,
    `回答 *${answer}* 说的是${kind["zh-CN"]}，而 *${right}${after.startsWith("time") || /^(old|many|much)\b/u.test(after) ? ` ${after.split(" ")[0]}` : ""}* 问的正是${kind["zh-CN"]}：${full}`,
  );
};

/** whyNotWh explains a question word that asks about the wrong kind of thing. */
const whyNotWh = (wrong: string, right: string, shown: string): Text => {
  const [after, answer] = whParts(shown);
  const kind = whKind(right, after);
  const wrongKind = whKind(wrong, "");
  return t(
    `*${wrong}* asks about ${wrongKind.en}, but the answer *${answer}* gives ${kind.en}.`,
    `*${wrong}* 问的是${wrongKind["zh-CN"]}，但回答 *${answer}* 说的是${kind["zh-CN"]}。`,
  );
};

/** whAskWhy explains the order of a wh- question. */
const whAskWhy = (right: string, shown: string): Text => {
  const item = whItems.find((it) => it.question === right);
  const ask = item?.ask ?? firstWord(right);
  const next = right.slice(ask.length + 1).split(" ")[0] ?? "";
  return /^(do|does|is|are)$/u.test(next)
    ? t(
        `*${shown}* gives the answer, so put *${ask}* first, then *${next}* before the subject, as in a yes/no question: ${right}`,
        `*${shown}* 里有答案，所以把 *${ask}* 放在句首，再像一般疑问句那样把 *${next}* 放在主语前：${right}`,
      )
    : t(
        `Here *${ask}* asks about the subject itself, so the verb comes straight after it with no *do*: ${right}`,
        `这里 *${ask}* 问的就是主语，所以动词直接跟在后面，不用 *do*：${right}`,
      );
};

const whQuestions: TopicDef = {
  id: "wh-questions",
  title: t("Wh- Questions", "特殊疑问句"),
  summary: t(
    "Where does Tom live? When is your birthday? Questions with where, when, what, who, how and why.",
    "Where does Tom live? When is your birthday? 用 where、when、what、who、how 和 why 提问。",
  ),
  prerequisites: ["present-simple-questions", "questions-with-be"],
  encompasses: [
    { topic: "present-simple-questions", weight: 0.4 },
    { topic: "questions-with-be", weight: 0.4 },
  ],
  xp: 15,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("Which question word", "选哪个疑问词"),
      t(
        "Each question word asks about one thing:\n\n- *where*: a place (*In Beijing.*)\n- *when*, *what time*: a time (*At nine. On Sunday.*)\n- *what*: a thing (*A taxi.*)\n- *who*: a person (*Ms. Wang.*)\n- *how*: the way (*By bus.*); *how old*, *how many*, *how much*\n- *why*: the reason (*Because …*)\n\nLook at the answer to choose the word.",
        "每个疑问词问一类东西：\n\n- *where*：地点（*In Beijing.*）\n- *when*、*what time*：时间（*At nine. On Sunday.*）\n- *what*：事物（*A taxi.*）\n- *who*：人（*Ms. Wang.*）\n- *how*：方式（*By bus.*）；还有 *how old*、*how many*、*how much*\n- *why*：原因（*Because …*）\n\n看回答来选疑问词。",
      ),
      choiceGenerator(t("Choose the question word for the answer.", "根据回答选择疑问词。"), whChoiceBank, whWhy, whyNotWh),
    ),
    point(
      "ask",
      t("Making wh- questions", "构成特殊疑问句"),
      t(
        "Put the question word first, then the question as you know it: *Does Tom live near the station?* → *Where does Tom live?* *Is the bank next to the hotel?* → *Where is the bank?*\n\nWhen *who* or *how many people* is the subject, there is no *do*: *Who drives the bus?*",
        "先写疑问词，再接一般疑问句的语序：*Does Tom live near the station?* → *Where does Tom live?* *Is the bank next to the hotel?* → *Where is the bank?*\n\n中文的疑问词留在原位（“汤姆住在哪里？”），英语要把它放到句首。如果 *who* 或 *how many people* 本身就是主语，就不用 *do*：*Who drives the bus?*",
      ),
      typedGenerator("sentence-pattern", t("Write the question.", "写出问句。"), whAskBank, whAskWhy),
    ),
  ],
};

// Can for requests.

/** youAsks are things to ask someone to do, after Can you. */
const youAsks: readonly string[] = [
  "show me the way to the station",
  "tell me the time",
  "help me carry this bag",
  "open the door",
  "close the window",
  "wait for me",
  "call a taxi",
  "take a photo of us",
  "draw me a map",
  "say that again",
  "speak more slowly",
  "stop here",
  "buy two tickets",
  "pass me the salt",
  "fix my bike",
  "lend me your pen",
  "meet me at the bus station",
  "keep my seat",
  "turn on the light",
  "spell your name",
  "give me a map",
  "read this sign for me",
  "help me find the museum",
  "take me to the airport",
  "turn left at the corner",
  "carry my bag",
  "turn off the TV",
  "write your address here",
  "drive more slowly",
  "show me your ticket",
  "come to my party",
  "help me with my homework",
  "wait at the corner",
  "show me the bridge on the map",
  "cross the road with me",
  "tell me about the museum",
];

/** iAsks are things to ask to do yourself, after Can I. */
const iAsks: readonly string[] = [
  "sit here",
  "have a map",
  "open the window",
  "use your phone",
  "go to the toilet",
  "buy a ticket",
  "ask a question",
  "come in",
  "take a photo",
  "pay by card",
  "borrow your pen",
  "have a glass of water",
  "leave my bag here",
  "park my bike here",
  "see the menu",
  "watch TV now",
  "try this on",
  "have the bill",
  "close the door",
  "turn on the TV",
  "sit next to you",
  "carry your bag",
  "go out to play",
  "visit you on Sunday",
];

const requestChoiceBank: readonly ChoiceItem[] = interleave([
  youAsks.slice(0, 18).map((ask): ChoiceItem => ["", `Can you ${ask}?`, [`Can you to ${ask}?`, `You can ${ask}?`]]),
  iAsks.slice(0, 12).map((ask): ChoiceItem => ["", `Can I ${ask}?`, [`Can I to ${ask}?`, `I can ${ask}?`]]),
]);

const requestTypedBank: readonly TypedItem[] = interleave([
  youAsks.slice(18).map(
    (ask): TypedItem => ({
      shown: `${ask.charAt(0).toUpperCase()}${ask.slice(1)}.`,
      instruction: t("Ask politely with Can you.", "用 Can you 礼貌地请求。"),
      accepted: [`Can you ${ask}(, please)?`, `Please, can you ${ask}?`],
      canonical: `Can you ${ask}, please?`,
      wrong: [`Can you to ${ask}?`, `You can ${ask}?`],
    }),
  ),
  iAsks.slice(12).map(
    (ask): TypedItem => ({
      shown: `I want to ${ask}.`,
      instruction: t("Ask politely with Can I.", "用 Can I 礼貌地请求。"),
      accepted: [`Can I ${ask}(, please)?`],
      canonical: `Can I ${ask}, please?`,
      wrong: [`Can I to ${ask}?`, `I can ${ask}?`],
    }),
  ),
]);

/** requestWhy explains how a request with can is built. */
const requestWhy = (right: string): Text =>
  right.startsWith("Can I")
    ? t(
        `To ask if you may do something, put *Can* first, then *I* and the plain verb, with no *to*: ${right}`,
        `请求允许自己做事时，*Can* 放在句首，再接 *I* 和动词原形，不加 *to*：${right}`,
      )
    : t(
        `To ask someone to do something, put *Can* first, then *you* and the plain verb, with no *to*: ${right}`,
        `请别人做事时，*Can* 放在句首，再接 *you* 和动词原形，不加 *to*：${right}`,
      );

/** whyNotRequest explains a wrong request with can. */
const whyNotRequest = (wrong: string, right: string, _shown: string, position: number): Text => {
  const who = right.startsWith("Can I") ? "I" : "you";
  return position === 0
    ? t(
        `*${wrong}* puts *to* after *can*, but *can* is followed straight away by the plain verb.`,
        `*${wrong}* 在 *can* 后面加了 *to*，但 *can* 后面直接跟动词原形。`,
      )
    : t(
        `*${wrong}* keeps the order of a statement. A question puts *Can* before *${who}*.`,
        `*${wrong}* 保留了陈述句的语序。问句要把 *Can* 放在 *${who}* 前面。`,
      );
};

const canForRequests: TopicDef = {
  id: "can-for-requests",
  title: t("Can You Help Me?", "Can you help me? 用 can 提出请求"),
  summary: t(
    "Can you open the door? Can I sit here? Asking people to do things, and asking to do them yourself.",
    "Can you open the door? Can I sit here? 请别人做事，以及请求允许自己做事。",
  ),
  prerequisites: ["can-for-ability", "a1-words-directions"],
  encompasses: [
    { topic: "can-for-ability", weight: 0.4 },
    { topic: "a1-words-directions", weight: 0.2 },
  ],
  xp: 15,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("Can you, can I", "Can you 和 Can I"),
      t(
        "To ask someone to do something, say *Can you …?*: *Can you open the door?* To ask if you may do something, say *Can I …?*: *Can I sit here?*\n\n*Can* comes first, and the verb after it has no *to* and no *-s*.",
        "请别人做事，说 *Can you …?*：*Can you open the door?* 请求允许自己做事，说 *Can I …?*：*Can I sit here?*\n\n*Can* 放在句首，后面的动词不加 *to*，也不加 *-s*。",
      ),
      choiceGenerator(t("Which request is right?", "哪个请求是对的？"), requestChoiceBank, requestWhy, whyNotRequest),
    ),
    point(
      "ask",
      t("Asking politely", "礼貌地请求"),
      t(
        "An order like *Open the door.* can sound rude. Make it a question with *Can you …?* and add *please*: *Can you open the door, please?* For yourself, *I want to sit here.* becomes *Can I sit here, please?*",
        "*Open the door.* 这样的祈使句听起来可能不礼貌。把它改成 *Can you …?* 的问句，再加上 *please*：*Can you open the door, please?* 为自己请求时，*I want to sit here.* 变成 *Can I sit here, please?*",
      ),
      typedGenerator("sentence-pattern", t("Make it a polite request.", "改成礼貌的请求。"), requestTypedBank, (right) => {
        const why = requestWhy(right);
        return t(`Add *please* to sound polite. ${why.en}`, `加上 *please* 更礼貌。${why["zh-CN"]}`);
      }),
    ),
  ],
};

// Writing directions to your home.

const criterion = (id: string): CriterionSpec => {
  const found = criterionById(id);
  if (!found) throw new Error(`unknown criterion ${id}`);
  return found;
};

/** directionsBank asks for directions to the writer's home from a named place. */
const directionsBank: readonly WritingItem[] = [
  {
    task: "Your friend Tom is coming to your house. Write him directions from the bus station.",
    model:
      "Hi Tom,\nGet off the bus at the bus station. Turn left and walk along Park Road. Go past the bank and turn right at the corner. My house is the blue one next to the park.\nSee you soon, Lily",
  },
  {
    task: "Your cousin is coming to visit by train. Write directions from the train station to your home.",
    model:
      "Dear Sam,\nWhen you leave the train station, cross the road. Go straight on for two minutes. Turn right at the hotel. My building is on the left, opposite the museum. I live on the third floor, number 302.\nBen",
  },
  {
    task: "Write directions from your school to your home for a new classmate.",
    model:
      "Hi Mia,\nGo out of the school gate and turn right. Walk to the end of the street. Cross the bridge over the river. My house is the first house on the left. It has a red door.\nAnna",
  },
  {
    task: "Your grandma is coming by taxi, but the driver doesn't know the way. Write directions from the big supermarket.",
    model:
      "Dear Grandma,\nFrom the supermarket, go straight along Green Street. Turn left at the second corner. Go past the school and the park. Our building is next to the restaurant. Ring number 5.\nLove, Jack",
  },
  {
    task: "A friend wants to come to your birthday party. Write directions from the park.",
    model:
      "Hi Emma,\nCome out of the park by the north gate. Turn right and walk to the traffic lights. Cross the road and turn left. My house is the white one with a big tree in front.\nSee you on Saturday, Kate",
  },
  {
    task: "Your friend's dad is driving your friend to your house. Write directions from the hospital.",
    model:
      "Dear Mr. Lee,\nFrom the hospital, drive straight on to the bank. Turn right at the bank and go over the bridge. Take the first road on the left. Our house is at the end of the road. It's yellow.\nThank you, Nora",
  },
  {
    task: "Your teacher is visiting your family. Write directions from the school bus stop.",
    model:
      "Dear Ms. Green,\nGet off at the bus stop near the post office. Walk past the post office and turn left. Go straight on for five minutes. Our flat is above the bakery. The door is green.\nFrom Max",
  },
  {
    task: "A friend is coming to play. Write directions from the library.",
    model:
      "Hi Leo,\nGo out of the library and turn left. Walk past the museum and the café. At the corner, turn right into Hill Street. I live at number 8. There is a bike outside.\nSam",
  },
  {
    task: "Your aunt is coming from the airport by bus. Write directions from the last bus stop.",
    model:
      "Dear Aunt Mary,\nThe bus stops outside the hotel. Walk along the river to the bridge. Don't cross it. Turn left and go up the hill. Our house is the last one on the right, with a small garden.\nLove, Lucy",
  },
  {
    task: "A new neighbor asks how to get to your home from the market. Write the directions.",
    model:
      "Hello Mrs. Wu,\nFrom the market, walk to the traffic lights and turn right. Go past the bank and the restaurant. My building is on the corner, next to the bus stop. We live on the second floor.\nAmy",
  },
  {
    task: "Your friend is coming to study with you. Write directions from the subway station.",
    model:
      "Hi Jun,\nCome out of the subway station at Exit B. Turn left and walk straight on. Turn right at the second street. My building is opposite the park. It's building 6, and I live on the fifth floor.\nBen",
  },
  {
    task: "Your pen friend is visiting your town for the first time. Write directions from the town square.",
    model:
      "Dear Paul,\nStart at the big clock in the town square. Walk down Station Road towards the river. Turn left after the museum. Our house is the third on the right. It has a green gate.\nSee you soon, Mia",
  },
];

const directionsCriteria = ["a1-directions-start", "a1-directions-steps", "a1-directions-arrive", "a1-reader-and-name"];

const writingDirectionsToYourHome: TopicDef = {
  id: "writing-directions-to-your-home",
  title: t("Writing Directions to Your Home", "写去你家的路线"),
  summary: t(
    "Write a note that tells a visitor how to get to your home: where to start, the steps in order and how to know they've arrived.",
    "写一张便条告诉来访者怎么到你家：从哪里出发、按顺序走哪些路、怎样知道到了。",
  ),
  prerequisites: ["imperatives", "prepositions-of-place", "a1-words-directions", "writing-a-short-note"],
  encompasses: [
    { topic: "imperatives", weight: 0.3 },
    { topic: "prepositions-of-place", weight: 0.2 },
    { topic: "writing-a-short-note", weight: 0.2 },
  ],
  xp: 25,
  strand: "writing",
  criteria: directionsCriteria.map(criterion),
  knowledgePoints: [
    point(
      "directions",
      t("Start, steps and arriving", "出发点、步骤和到达"),
      t(
        "Directions are orders, so they start with the verb: *Turn left. Go past the bank. Cross the road.*\n\n- Start from the place the reader knows: *Get off the bus at the station.*\n- Give the steps in order, with turns and things to look for: *Turn right at the corner. Go past the park.*\n- Say how they will know your home: *My house is the blue one next to the park.*",
        "指路用祈使句，句子以动词开头：*Turn left. Go past the bank. Cross the road.*\n\n- 从对方知道的地方说起：*Get off the bus at the station.*\n- 按顺序说步骤，写清在哪里转弯、会经过什么：*Turn right at the corner. Go past the park.*\n- 说明怎样认出你家：*My house is the blue one next to the park.*",
      ),
      writingGenerator(
        t(
          "Write directions in English to your home, from the place in the task, as a short note of four to six sentences.",
          "用英语写一张四到六句话的便条，告诉对方怎样从题目里的地方到你家。",
        ),
        directionsBank,
        directionsCriteria,
        { minWords: 25, maxChars: 700 },
        (model) => t(`One good note:\n\n> ${model.replace(/\n/gu, "\n> ")}`, `一张好的便条：\n\n> ${model.replace(/\n/gu, "\n> ")}`),
      ),
    ),
  ],
};

/** topics are the topics of the unit In Town. */
export const topics: readonly TopicDef[] = [
  town.topic,
  directions.topic,
  trips.topic,
  whQuestions,
  canForRequests,
  writingDirectionsToYourHome,
];

/** vocabulary are the words the unit In Town teaches. */
export const vocabulary: readonly WordBatch[] = [town.batch, directions.batch, trips.batch];
