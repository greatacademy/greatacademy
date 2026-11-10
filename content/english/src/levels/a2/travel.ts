// A2, unit 7: Travel and Holidays. Holidays, places to visit, transport and the future; going to and will; plans
// judged by a model.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator, type WritingItem } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { interleave, pairUp, vocabularyTopic, word } from "../words.ts";
import { combos, fill, judgedTopic } from "./kit.ts";

const holidays = vocabularyTopic({
  id: "a2-words-holidays",
  title: t("Holidays", "假期"),
  summary: t(
    "Vacations, tourists and guides; packing a suitcase; passports and going abroad; journeys, flights, luggage, souvenirs and postcards.",
    "假期、游客和导游；收拾行李箱；护照和出国；旅程、航班、行李、纪念品和明信片。",
  ),
  prerequisites: ["a1-words-trips"],
  words: [
    word(
      "vacation vacations",
      "time away from work or school, often spent traveling",
      "假期",
      "We're going on {vacation} to the beach in July.|luggage passport | How was your {vacation}? — Great! We went to Thailand.|luggage passport | Dad has two weeks of {vacation} a year.|luggage souvenir",
      "journey flight",
    ),
    word(
      "tourist tourists",
      "a person who visits a place on vacation",
      "游客",
      "The city is full of {tourists} in summer.|suitcases passports | Many {tourists} take photos of the Great Wall.|suitcases luggages | Excuse me, I'm a {tourist}. Where is the museum?|suitcase passport",
      "guide passenger",
    ),
    word(
      "guide guides",
      "a person who shows visitors around a place",
      "导游",
      "Our {guide} told us the history of the palace.|suitcase luggage | Follow the {guide}. She has a red flag.|suitcase luggage | My aunt works as a tour {guide} in Xi'an.|suitcase postcard",
      "tourist passenger",
    ),
    word(
      "pack packs packed packing",
      "to put things in a bag or a suitcase for a trip",
      "收拾（行李）",
      "Have you {packed} your suitcase yet?|flown traveled | Don't forget to {pack} your toothbrush!|fly guide | I'm {packing} for the trip. We leave at six.|flying guiding",
      "fly travel",
    ),
    word(
      "suitcase suitcases",
      "a large box-shaped bag with a handle for carrying clothes on a trip",
      "行李箱",
      "My {suitcase} is too heavy to lift.|passport postcard | Put your clothes in the {suitcase}.|passport postcard | Our {suitcases} have wheels.|passports postcards",
      "passport souvenir",
    ),
    word(
      "passport passports",
      "a small book that shows who you are when you travel to another country",
      "护照",
      "You need a {passport} to travel abroad.|suitcase souvenir | Can I see your {passport}, please?|suitcase luggage | My {passport} photo looks terrible!|luggage souvenir",
      "suitcase postcard",
    ),
    word(
      "abroad",
      "in or to another country",
      "在国外；到国外",
      "Have you ever been {abroad}?|luggage souvenir | My brother is studying {abroad} in Canada.|luggage souvenir | We usually go {abroad} for our summer vacation.|luggage tourist",
      "away luggage",
    ),
    word(
      "journey journeys",
      "a trip from one place to another, especially a long one",
      "旅程",
      "The {journey} from Beijing to Shanghai takes about five hours by train.|souvenir luggage | Have a good {journey}!|souvenir luggage | It was a long {journey}, and we were very tired.|souvenir passport",
      "flight vacation",
    ),
    word(
      "flight flights",
      "a trip on a plane",
      "航班；飞行",
      "Our {flight} leaves at 9 a.m.|luggage souvenir | The {flight} to London takes eleven hours.|luggage souvenir | There are no cheap {flights} in August.|luggages souvenirs",
      "journey passport",
    ),
    word(
      "luggage",
      "the bags and suitcases you take on a trip",
      "行李",
      "How much {luggage} do you have? — Just one suitcase.|journey flight | Please don't leave your {luggage} on the seat.|journey flight | Our {luggage} got lost at the airport.|journey vacation",
      "suitcase passport",
      "suitcase",
    ),
    word(
      "souvenir souvenirs",
      "something you buy to remember a place you visited",
      "纪念品",
      "I bought a little panda as a {souvenir} of Chengdu.|journey flight | The shop near the temple sells {souvenirs}.|journeys flights | This key ring is a {souvenir} from Paris.|journey flight",
      "postcard passport",
    ),
    word(
      "postcard postcards",
      "a card with a picture on one side that you send without an envelope",
      "明信片",
      "Send me a {postcard} from Italy!|luggage journey | The {postcard} has a picture of the Eiffel Tower.|luggage journey | I wrote three {postcards} to my friends.|journeys flights",
      "souvenir passport",
    ),
  ],
});

const placesToVisit = vocabularyTopic({
  id: "a2-words-places-to-visit",
  title: t("Places to Visit", "游览的地方"),
  summary: t(
    "Castles, palaces, towers, temples and statues; views; coasts, deserts, valleys, caves and oceans.",
    "城堡、宫殿、塔、寺庙和雕像；风景；海岸、沙漠、山谷、山洞和海洋。",
  ),
  prerequisites: ["a2-words-holidays"],
  words: [
    word(
      "castle castles",
      "a big old building with thick walls and towers, built to keep people safe",
      "城堡",
      "The king and queen lived in a {castle}.|desert ocean | There are many old {castles} in Scotland.|deserts oceans | We walked around the walls of the {castle}.|ocean view",
      "palace tower",
    ),
    word(
      "palace palaces",
      "a very big, beautiful house where a king or queen lives",
      "宫殿",
      "The Forbidden City was the {palace} of the emperors.|cave valley | The queen lives in Buckingham {Palace}.|Cave Valley | The {palace} has more than nine hundred rooms.|cave coast",
      "castle temple",
    ),
    word(
      "tower towers",
      "a tall narrow building or part of a building",
      "塔",
      "We climbed to the top of the {tower} and looked down at the city.|valley cave | The Eiffel {Tower} is in Paris.|Valley Coast | The clock {tower} is the tallest building in our town.|valley cave",
      "statue palace",
    ),
    word(
      "temple temples",
      "a building where people pray to a god",
      "寺庙",
      "We visited an old Buddhist {temple} in the mountains.|ocean desert | Take off your shoes before you go into the {temple}.|ocean coast | There are many beautiful {temples} in Kyoto.|oceans deserts",
      "palace castle",
    ),
    word(
      "statue statues",
      "a figure of a person or an animal made of stone or metal",
      "雕像",
      "There is a {statue} of a famous poet in the square.|view valley | The {Statue} of Liberty is in New York.|View Valley | The {statues} in the museum are two thousand years old.|views valleys",
      "tower temple",
    ),
    word(
      "view views",
      "what you can see from a place",
      "风景；景色",
      "The {view} from the top of the mountain is amazing.|statue temple | Our hotel room has a {view} of the sea.|statue temple | Let's stop here and enjoy the {view}.|statue cave",
      "statue coast",
    ),
    word(
      "coast coasts",
      "the land next to the sea",
      "海岸",
      "We drove along the {coast} and stopped at every beach.|desert cave | Many big cities are on the {coast}.|desert cave | There's a lighthouse on the west {coast} of the island.|desert valley",
      "ocean valley",
    ),
    word(
      "desert deserts",
      "a large dry area with lots of sand and very little rain",
      "沙漠",
      "It almost never rains in the {desert}.|coast ocean | Camels can walk across the {desert} for days without water.|ocean valley | The Sahara is the biggest hot {desert} in the world.|ocean valley",
      "coast valley",
    ),
    word(
      "valley valleys",
      "the low land between two hills or mountains",
      "山谷",
      "A river runs through the {valley}.|tower statue | From the hill we could see the green {valley} below.|tower statue | The village is in a deep {valley} between the mountains.|tower statue",
      "cave coast",
    ),
    word(
      "cave caves",
      "a big hole in the side of a hill or under the ground",
      "山洞",
      "Bats live in the dark {cave}.|tower palace | People lived in {caves} thousands of years ago.|towers palaces | We need a light to go into the {cave}.|tower view",
      "valley desert",
    ),
    word(
      "ocean oceans",
      "a very big sea",
      "海洋",
      "The Pacific is the biggest {ocean} in the world.|castle tower | Whales live in the {ocean}.|castle valley | More than half of the Earth is covered by {oceans}.|castles towers",
      "coast desert",
    ),
  ],
});

const transport = vocabularyTopic({
  id: "a2-words-transport",
  title: t("Transport", "交通"),
  summary: t(
    "Subways, platforms and seats; ferries, motorbikes and helicopters; traffic; missing a train; delays, gates and passengers.",
    "地铁、站台和座位；渡轮、摩托车和直升机；交通；错过火车；延误、登机口和乘客。",
  ),
  prerequisites: ["a2-words-places-to-visit"],
  words: [
    word(
      "subway subways",
      "a train that runs under the ground in a city",
      "地铁",
      "I take the {subway} to school every day.|ferry helicopter | The {subway} is faster than the bus at rush hour.|ferry helicopter | Line 2 of the {subway} goes to the airport.|ferry gate",
      "ferry platform",
    ),
    word(
      "platform platforms",
      "the place where you wait for a train in a station",
      "站台",
      "The train to Beijing leaves from {platform} 4.|gate seat | Wait on the {platform} behind the yellow line.|traffic gate | The {platform} was full of people.|traffic helicopter",
      "gate seat",
    ),
    word(
      "seat seats",
      "something you sit on in a bus, a train or a plane",
      "座位",
      "Is this {seat} free? — Yes, please sit down.|gate platform | I gave my {seat} to an old lady.|gate traffic | We had {seats} by the window.|gates platforms",
      "gate platform",
    ),
    word(
      "ferry ferries",
      "a boat that carries people and cars across water",
      "渡轮",
      "We took the {ferry} to the island.|motorbike helicopter | The {ferry} leaves every hour from the port.|subway helicopter | Some cars drove onto the {ferry}.|subway platform",
      "subway helicopter",
    ),
    word(
      "motorbike motorbikes",
      "a bike with an engine",
      "摩托车",
      "My uncle rides a {motorbike} to work.|ferry subway | Wear a helmet on a {motorbike}!|ferry platform | There are many {motorbikes} on the streets of Hanoi.|ferries platforms",
      "helicopter ferry",
    ),
    word(
      "helicopter helicopters",
      "an aircraft with blades that turn on top, which can go straight up",
      "直升机",
      "A {helicopter} took the sick man to the hospital.|ferry subway | The {helicopter} landed on the roof.|ferry subway | We heard {helicopters} over the city.|ferries subways",
      "motorbike ferry",
    ),
    word(
      "traffic",
      "the cars and buses on the roads",
      "交通；车流",
      "There's a lot of {traffic} in the city at eight o'clock.|seat passenger | We were late because of the {traffic}.|passenger platform | Turn left at the {traffic} lights.|passenger seat",
      "passenger delay",
    ),
    word(
      "miss misses missed missing",
      "to not catch a bus, a train or a plane; to feel sad that someone is not with you",
      "错过；想念",
      "Hurry up, or we'll {miss} the train!|delay pack | I {missed} the bus, so I walked to school.|delayed packed | I {miss} my grandparents. They live far away.|delay pack",
      "delay lose",
    ),
    word(
      "delay delays delayed delaying",
      "to make something late; a time when something is late",
      "延误；推迟",
      "Our flight was {delayed} because of the snow.|missed packed | Sorry for the {delay}. The train will leave in ten minutes.|miss gate | There are long {delays} on the subway today.|gates seats",
      "miss gate",
    ),
    word(
      "gate gates",
      "the door at an airport where you get on a plane",
      "登机口；大门",
      "Flight CA981 is boarding at {gate} 12.|seat traffic | Please go to the {gate} thirty minutes before your flight.|traffic delay | Close the garden {gate}, or the dog will get out.|traffic delay",
      "platform seat",
    ),
    word(
      "passenger passengers",
      "a person who travels in a car, bus, train or plane but is not driving it",
      "乘客",
      "The bus can carry fifty {passengers}.|traffics delays | All {passengers} must wear a seat belt.|traffics gates | I sat in the {passenger} seat next to my dad.|traffic gate",
      "tourist traffic",
    ),
  ],
});

const future = vocabularyTopic({
  id: "a2-words-future",
  title: t("The Future", "将来"),
  summary: t(
    "Will and won't; tomorrow and the future; probably, maybe and perhaps; expecting, dreaming and promising; someday and forever.",
    "will 和 won't；明天和将来；可能、也许和或许；期待、梦想和承诺；总有一天和永远。",
  ),
  prerequisites: ["a2-words-transport"],
  words: [
    word(
      "will won't I'll you'll he'll she'll we'll they'll it'll",
      "a word used to talk about the future",
      "将；会",
      "It {will} be sunny tomorrow.|was does | Don't worry. I {won't} tell anyone.|isn't wasn't | The bag is heavy. {I'll} help you.|I'm I've",
      "would can",
    ),
    word(
      "tomorrow",
      "the day after today",
      "明天",
      "Today is Monday, so {tomorrow} is Tuesday.|forever someday | See you {tomorrow}!|forever future | I'm going to the dentist {tomorrow} morning.|forever perhaps",
      "yesterday someday",
    ),
    word(
      "future",
      "the time that will come after now",
      "将来；未来",
      "What do you want to be in the {future}?|tomorrow forever | Nobody knows the {future}.|tomorrow promise | In the {future}, cars will drive themselves.|tomorrow promise",
      "past tomorrow",
    ),
    word(
      "probably",
      "almost certainly",
      "很可能",
      "It's very cloudy. It will {probably} rain.|forever tomorrow | She's {probably} at home now.|forever tomorrow | We'll {probably} be late because of the traffic.|forever future",
      "forever someday",
    ),
    word(
      "maybe",
      "it is possible; not sure",
      "也许；可能",
      "{Maybe} it will snow tomorrow.|Forever Future | Are you coming? — {Maybe}. I'm not sure yet.|Forever Future | {Maybe} we can go to the beach on Sunday.|Forever Future",
      "forever probably",
      "perhaps",
    ),
    word(
      "perhaps",
      "it is possible; not sure",
      "或许；可能",
      "{Perhaps} he missed the bus.|Forever Future | {Perhaps} you're right.|Forever Tomorrow | We could {perhaps} meet next week.|forever future",
      "forever probably",
      "maybe",
    ),
    word(
      "expect expects expected expecting",
      "to think that something will happen",
      "预计；期待",
      "I {expect} it will be cold in the mountains.|promise dream | We're {expecting} twenty guests at the party.|promising dreaming | The test was easier than I {expected}.|promised dreamed",
      "promise dream",
    ),
    word(
      "dream dreams dreamed dreaming",
      "pictures in your mind when you sleep; something you really want",
      "梦；梦想",
      "Last night I {dreamed} that I could fly.|expected promised | My {dream} is to travel around the world.|future promise | Sweet {dreams}! Good night.|futures promises",
      "promise expect",
    ),
    word(
      "someday",
      "at some time in the future",
      "总有一天",
      "{Someday} I'm going to visit the pyramids.|Forever Yesterday | I hope I'll meet him {someday}.|forever yesterday | {Someday} you will understand.|Yesterday Forever",
      "forever tomorrow",
    ),
    word(
      "forever",
      "for all time",
      "永远",
      "I will love you {forever}.|someday perhaps | Nothing lasts {forever}.|someday tomorrow | We waited {forever} for the bus! It came after an hour.|someday maybe",
      "someday probably",
    ),
    word(
      "promise promises promised promising",
      "to say that you will certainly do something",
      "承诺；保证",
      "I {promise} I'll be home by ten.|expect dream | You {promised} to help me!|expected dreamed | Don't break your {promise}.|dream future",
      "expect dream",
    ),
  ],
});

// Going to.

/** goSubjects are a subject, its form of be, its short form, and a wrong form of be. */
const goSubjects: readonly (readonly [string, string, string, string])[] = [
  ["I", "am", "I'm", "is"],
  ["We", "are", "We're", "is"],
  ["My sister", "is", "", "are"],
  ["They", "are", "They're", "is"],
  ["Tom", "is", "", "are"],
  ["She", "is", "She's", "are"],
  ["My parents", "are", "", "is"],
];
const goPlans: readonly string[] = [
  "visit the castle",
  "take the night ferry",
  "stay in a hotel by the sea",
  "fly to Beijing",
  "see the old temple",
  "buy some souvenirs",
  "pack a big suitcase",
  "travel by train",
];
const goTimes: readonly string[] = ["next summer", "tomorrow", "on Saturday", "next week", "this weekend"];

const goRows = combos(120, goSubjects, goPlans, goTimes);

const subjectIn = (subject: string) => (/^(I|Tom)$/u.test(subject) ? subject : subject.toLowerCase());
const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const goChoiceBank: readonly ChoiceItem[] = goRows
  .slice(0, 40)
  .map(
    ([[subject, be, , bad], plan, time]): ChoiceItem => [
      `${capital(time)}, ${subjectIn(subject)} ___ ${plan}.`,
      `${be} going to`,
      [`${bad} going to`, `${be} going`],
    ],
  );

const goStatement = (subject: string, be: string, short: string) => (short ? `[${subject} ${be}|${short}]` : `${subject} ${be}`);

const goTypedBank: readonly TypedItem[] = goRows.slice(40, 80).map(
  ([[subject, be, short, bad], plan, time]): TypedItem => ({
    shown: `${subject} / ${plan} / ${time}`,
    accepted: [`${goStatement(subject, be, short)} going to ${plan} ${time}.`],
    canonical: `${subject} ${be} going to ${plan} ${time}.`,
    wrong: [`${subject} ${bad} going to ${plan} ${time}.`, `${subject} ${be} going ${plan} ${time}.`],
  }),
);

const questionSubject = (subject: string) => (subject === "I" ? "you" : subject === "We" ? "you" : subjectIn(subject));
const questionBe = (subject: string, be: string) => (subject === "I" || subject === "We" ? "are" : be);

const goQuestionBank: readonly TypedItem[] = goRows.slice(80, 120).map(([[subject, be], plan, time]): TypedItem => {
  const qs = questionSubject(subject);
  const qb = questionBe(subject, be);
  const statement = `${subject === "I" || subject === "We" ? "You" : subject} ${qb} going to ${plan} ${time}.`;
  return {
    shown: statement,
    accepted: [`${capital(qb)} ${qs} going to ${plan} ${time}?`],
    wrong: [`${capital(qs)} ${qb} going to ${plan} ${time}?`, `Do ${qs} going to ${plan} ${time}?`],
  };
});

const beGoingTo: TopicDef = {
  id: "be-going-to",
  title: t("Going To", "be going to"),
  summary: t(
    "We are going to visit the castle. Going to is for plans already made.",
    "We are going to visit the castle. be going to 表示已经做好的计划。",
  ),
  prerequisites: ["present-continuous", "a2-words-holidays"],
  encompasses: [
    { topic: "present-continuous", weight: 0.3 },
    { topic: "a2-words-holidays", weight: 0.1 },
  ],
  xp: 20,
  strand: "grammar",
  knowledgePoints: [
    point(
      "form",
      t("Am, is or are going to", "am、is 还是 are going to"),
      t(
        "For a plan you have already made, use *am*, *is* or *are* with *going to* and the first form of a verb:\n\n- *I am going to fly to Beijing.* (*I'm*)\n- *She is going to stay in a hotel.* (*She's*)\n- *We are going to visit the castle.* (*We're*)\n\nDo not leave out *to*: *We are going to visit*, not *We are going visit*.",
        "表示已经做好的计划，用 *am / is / are* 加 *going to* 再加动词原形：\n\n- *I am going to fly to Beijing.*（*I'm*）\n- *She is going to stay in a hotel.*（*She's*）\n- *We are going to visit the castle.*（*We're*）\n\n不要漏掉 *to*：说 *We are going to visit*，不说 *We are going visit*。中文“打算”“准备”常常对应 *be going to*，但 *be* 不能省略。",
      ),
      choiceGenerator(t("Choose the words for the gap.", "选出填入空白处的词。"), goChoiceBank, (right, shown) =>
        t(fill(shown, right), `${fill(shown, right)}（计划用 am / is / are going to + 动词原形）`),
      ),
    ),
    point(
      "write",
      t("Writing a plan", "写出计划"),
      t(
        "Write the plan in the note with *going to*. You may use the short forms *I'm*, *we're*, *they're* and *she's*.",
        "用 *going to* 写出笔记里的计划。可以用缩写 *I'm*、*we're*、*they're* 和 *she's*。",
      ),
      typedGenerator("sentence-pattern", t("Write a sentence from the note.", "根据笔记写一个句子。"), goTypedBank, (right) =>
        t(right, `${right}（主语 + am / is / are going to + 动词原形）`),
      ),
    ),
    point(
      "question",
      t("Asking about plans", "询问计划"),
      t(
        "To ask about a plan, put *am*, *is* or *are* before the subject: *You are going to fly.* → *Are you going to fly?* *Tom is going to stay.* → *Is Tom going to stay?* Do not use *do*.",
        "询问计划时，把 *am / is / are* 放到主语前面：*You are going to fly.* → *Are you going to fly?* *Tom is going to stay.* → *Is Tom going to stay?* 不要用 *do*。",
      ),
      typedGenerator("sentence", t("Make the sentence a question.", "把句子改成疑问句。"), goQuestionBank, (right) =>
        t(right, `${right}（be 动词提到主语前面）`),
      ),
    ),
  ],
};

// Will for the future.

/** willVerbs are sentences with a gap, the first form of the verb, and its form with -s. */
const willPredictions: readonly (readonly [string, string, string])[] = [
  ["Take a coat. It ___ cold in the mountains.", "be", "is"],
  ["Don't worry. You ___ the test easily.", "pass", "passes"],
  ["I think Brazil ___ the final.", "win", "wins"],
  ["In the future, robots ___ our homes.", "clean", "cleans"],
  ["The flight is delayed, so we ___ late.", "arrive", "arrives"],
  ["Ask Grandma. She ___ you.", "help", "helps"],
  ["The traffic is terrible. We ___ the train!", "miss", "misses"],
  ["Try the soup. I'm sure you ___ it.", "like", "likes"],
  ["The ferry ___ at six tomorrow morning.", "leave", "leaves"],
  ["People ___ to Mars one day.", "travel", "travels"],
  ["Wait here. The guide ___ back in five minutes.", "come", "comes"],
  ["It's late. The shops ___ soon.", "close", "closes"],
  ["Call me when you land. I ___ you at the airport.", "meet", "meets"],
  ["Don't touch the dog. It ___ you.", "bite", "bites"],
  ["I'm tired. I think I ___ to bed early.", "go", "goes"],
  ["Our team is strong. We ___ them easily.", "beat", "beats"],
];

const willNegatives: readonly (readonly [string, string])[] = [
  ["I promise I ___ anyone your secret.", "tell"],
  ["Don't worry. It ___ long.", "take"],
  ["Take an umbrella, or you ___ dry.", "stay"],
  ["Hurry up, or we ___ a seat.", "find"],
  ["The shop is closed, so I ___ any souvenirs today.", "buy"],
  ["He's sick. He ___ to school tomorrow.", "go"],
  ["It's a long journey, so we ___ there before dark.", "get"],
  ["My suitcase is full. These shoes ___ in it.", "fit"],
  ["She's very busy, so she ___ time to help us.", "have"],
  ["Let's take the subway. It ___ in traffic.", "stop"],
  ["Don't wait for me. I ___ home before ten.", "be"],
  ["The water is too cold. The children ___ in the sea.", "swim"],
  ["I ___ the same mistake again. I promise.", "make"],
  ["The castle is closed today, so we ___ it.", "visit"],
  ["It's too far to walk. We ___ there in time.", "get"],
];

const willChoiceBank: readonly ChoiceItem[] = interleave([
  willPredictions.map(([shown, verb, third]): ChoiceItem => [`${shown} (${verb})`, `will ${verb}`, [`will ${third}`, `will to ${verb}`]]),
  willNegatives.map(([shown, verb]): ChoiceItem => [`${shown} (not ${verb})`, `won't ${verb}`, [`don't will ${verb}`, `won't to ${verb}`]]),
]);

/** planOrNow are a sentence, whether it is a plan made before, and the form of be for its subject. */
const planOrNow: readonly (readonly [string, boolean, string])[] = [
  ["We bought the tickets last month. We ___ fly to Rome on Friday.", true, "are"],
  ["The phone is ringing. — Wait, I ___ answer it.", false, "am"],
  ["I've saved money all year. I ___ buy a new bike in June.", true, "am"],
  ["It's cold in here. — You're right. I ___ close the window.", false, "am"],
  ["She has already packed her suitcase. She ___ stay with her aunt in July.", true, "is"],
  ["I'm thirsty. — Sit down. I ___ get you some water.", false, "am"],
  ["Look at our plan! We ___ visit three castles next week.", true, "are"],
  ["This bag is heavy! — Give it to me. I ___ carry it.", false, "am"],
  ["They've booked a hotel. They ___ spend a week by the sea.", true, "are"],
  ["I don't understand this word. — I ___ explain it to you.", false, "am"],
  ["Mom has decided. She ___ learn to drive this year.", true, "is"],
  ["Oh no, I forgot my wallet! — Don't worry, I ___ pay.", false, "am"],
  ["My brother got a new job last week. He ___ start next Monday.", true, "is"],
  ["The bus isn't coming. — OK, I ___ take a taxi then.", false, "am"],
  ["We talked about it yesterday. We ___ paint the kitchen on Saturday.", true, "are"],
  ["Which cake do you want? — Hmm, I ___ have the chocolate one.", false, "am"],
  ["I've already asked my boss for a day off. I ___ visit my parents on Friday.", true, "am"],
  ["Someone is at the door. — I ___ see who it is.", false, "am"],
  ["Lin has bought paint and brushes. She ___ paint her room this weekend.", true, "is"],
  ["I can't open this jar. — Let me try. I ___ do it.", false, "am"],
  ["The tickets are in my bag. We ___ watch the final on Sunday.", true, "are"],
  ["It's starting to rain! — Wait here. I ___ get an umbrella.", false, "am"],
  ["My cousins planned their trip for months. They ___ travel across Canada by train.", true, "are"],
  ["The baby is crying. — Don't get up. I ___ go.", false, "am"],
  ["Dad has packed the car. He ___ drive us to the coast tomorrow.", true, "is"],
  ["There's no milk. — Really? I ___ buy some on my way home.", false, "am"],
  ["We have already chosen the music. We ___ dance at the wedding.", true, "are"],
  ["You look tired. — I know. I think I ___ go to bed.", false, "am"],
  ["Tom has signed up for the race. He ___ run five kilometers in May.", true, "is"],
  ["I forgot to call Grandma! — It's not too late. I ___ call her now.", false, "am"],
];

const planChoiceBank: readonly ChoiceItem[] = planOrNow.map(
  ([shown, plan, be]): ChoiceItem => (plan ? [shown, `${be} going to`, ["will", be]] : [shown, "'ll", [`${be} going to`, "am"]]),
);

const willSubjects: readonly (readonly [string, string])[] = [
  ["I", "I'll"],
  ["You", "You'll"],
  ["We", "We'll"],
  ["They", "They'll"],
  ["She", "She'll"],
  ["He", "He'll"],
];
const willGuesses: readonly string[] = [
  "be late",
  "pass the test",
  "love the city",
  "win the match",
  "be tired after the flight",
  "miss the bus",
  "like the food",
];

const willTypedBank: readonly TypedItem[] = pairUp(42, willSubjects, willGuesses).map(([[subject, short], guess], k): TypedItem => {
  const not = k % 3 === 0;
  return not
    ? {
        shown: `${subject} / probably not / ${guess}`,
        accepted: [`${subject} probably [won't|will not] ${guess}.`],
        canonical: `${subject} probably won't ${guess}.`,
        wrong: [`${subject} don't probably ${guess}.`, `${subject} probably won't to ${guess}.`],
      }
    : {
        shown: `${subject} / probably / ${guess}`,
        accepted: [`[${subject} will|${short}] probably ${guess}.`],
        canonical: `${subject} will probably ${guess}.`,
        wrong: [`${subject} probably ${guess}.`, `${subject} will probably to ${guess}.`],
      };
});

const willForTheFuture: TopicDef = {
  id: "will-for-the-future",
  title: t("Will and Won't", "will 和 won't"),
  summary: t(
    "It will probably rain. I'll help you. Will is for predictions and for decisions made now.",
    "It will probably rain. I'll help you. will 用于预测和当下做出的决定。",
  ),
  prerequisites: ["a2-words-future", "be-going-to"],
  encompasses: [
    { topic: "be-going-to", weight: 0.3 },
    { topic: "a2-words-future", weight: 0.2 },
  ],
  xp: 20,
  strand: "grammar",
  knowledgePoints: [
    point(
      "form",
      t("Will and won't with a verb", "will 和 won't 加动词"),
      t(
        "*will* and *won't* (*will not*) are the same for every person, and the verb after them stays in its first form:\n\n- *It will be cold. She will help you.* — not *will helps*\n- *I won't tell anyone.* — not *don't will tell*\n\nDo not put *to* after *will*: *will pass*, not *will to pass*.",
        "*will* 和 *won't*（*will not*）对所有人称都一样，后面的动词用原形：\n\n- *It will be cold. She will help you.*，不说 *will helps*\n- *I won't tell anyone.*，不说 *don't will tell*\n\n*will* 后面不加 *to*：说 *will pass*，不说 *will to pass*。",
      ),
      choiceGenerator(t("Choose the words for the gap.", "选出填入空白处的词。"), willChoiceBank, (right, shown) =>
        t(fill(shown, right), `${fill(shown, right)}（will / won't + 动词原形）`),
      ),
    ),
    point(
      "plan-or-now",
      t("A plan or a decision now", "计划还是当下的决定"),
      t(
        "Use *going to* for a plan you made before you speak: *We bought the tickets. We are going to fly to Rome.*\n\nUse *will* (*'ll*) for a decision you make at the moment you speak, often to offer help: *The phone is ringing. — I'll answer it.*",
        "说话之前就已经做好的计划，用 *going to*：*We bought the tickets. We are going to fly to Rome.*\n\n说话时当场做出的决定，常常是主动提供帮助，用 *will*（*'ll*）：*The phone is ringing. — I'll answer it.*",
      ),
      choiceGenerator(t("Choose the best words for the gap.", "选出最适合填入空白处的词。"), planChoiceBank, (right, shown) =>
        t(
          fill(shown, right).replace("I *'ll*", "*I'll*"),
          `${fill(shown, right).replace("I *'ll*", "*I'll*")}（${right === "'ll" ? "当场的决定用 will" : "事先的计划用 going to"}）`,
        ),
      ),
    ),
    point(
      "write",
      t("Writing a prediction", "写出预测"),
      t(
        "Write the prediction with *will* and *probably*. *probably* goes after *will* but before *won't*: *We will probably win. We probably won't win.*",
        "用 *will* 和 *probably* 写出预测。*probably* 放在 *will* 后面，但放在 *won't* 前面：*We will probably win. We probably won't win.*",
      ),
      typedGenerator("sentence-pattern", t("Write a sentence from the note.", "根据笔记写一个句子。"), willTypedBank, (right) =>
        t(right, `${right}（will probably / probably won't + 动词原形）`),
      ),
    ),
  ],
};

// Writing about future plans.

const plansBank: readonly WritingItem[] = [
  {
    task: "Write about a trip to the beach you are going to take.",
    model:
      "Next month my family is going to spend a week at the beach in Sanya. We are going to fly there on the first of August. The flight takes about four hours. We are going to stay in a small hotel near the sea. Every morning I'm going to swim, and in the afternoon we will probably visit some islands by boat. I think it will be very hot. I can't wait!",
  },
  {
    task: "Write about a visit to a big city you are going to make.",
    model:
      "This summer I'm going to visit my uncle in Shanghai. I'm going to take the fast train with my mom on July 10th. The journey is about five hours. We are going to stay at my uncle's flat for two weeks. First we are going to see the Bund at night. Then we will probably go to the science museum. I'm also going to buy some souvenirs for my friends.",
  },
  {
    task: "Write about a camping trip you are going to take.",
    model:
      "Next weekend my class is going to go camping in the mountains. We are going to leave by bus on Saturday morning. We are going to sleep in tents near a lake. In the afternoon we are going to climb to the top of a hill to see the view. At night we will cook dinner on a fire and look at the stars. I think it will be cold, so I'm going to pack a warm sweater.",
  },
  {
    task: "Write about a trip abroad you are going to take.",
    model:
      "In October my parents and I are going to travel to Japan. We are going to fly from Beijing to Tokyo. We already have our passports and our tickets. We are going to stay in Tokyo for four days and then take a fast train to Kyoto. In Kyoto we are going to visit old temples. My mom says we will probably eat sushi every day. I'm going to send postcards to my grandparents.",
  },
  {
    task: "Write about a visit to your grandparents you are going to make.",
    model:
      "During the Spring Festival, we are going to visit my grandparents in their village. We are going to drive there. The journey will probably take six hours because there is always a lot of traffic. We are going to stay for a week. I'm going to help my grandma make dumplings, and my grandpa is going to show me his new chickens. On New Year's Eve, we will watch the fireworks together.",
  },
  {
    task: "Write about a school trip you are going to take.",
    model:
      "Next Friday our class is going to visit the history museum in the city center. We are going to go there by subway with our teacher. The trip will take about forty minutes. At the museum, a guide is going to show us some old statues and coins. After that, we are going to have a picnic in the park. I'm going to take my camera, and I will take lots of photos.",
  },
  {
    task: "Write about a trip to the mountains you are going to take.",
    model:
      "This winter my family is going to go skiing in the mountains in the north. We are going to take a night train on December 28th. We are going to stay in a small wooden hotel for five days. Every day we are going to ski in the morning. My dad is going to teach me, and I will probably fall a lot! In the evenings we are going to sit by the fire and play board games.",
  },
  {
    task: "Write about a boat trip you are going to take.",
    model:
      "On Sunday I'm going to take a ferry to an island with my friend Lisa and her parents. We are going to meet at the port at eight o'clock. The ferry trip is about an hour long. On the island, we are going to walk along the coast and look for a famous cave. Lisa's dad says we will probably see some dolphins from the boat. We are going to come back in the evening.",
  },
  {
    task: "Write about a summer camp you are going to go to.",
    model:
      "This July I'm going to go to a summer camp by a lake. The camp starts on July 15th, and it is two weeks long. My parents are going to drive me there. At the camp, I'm going to learn to sail a boat and to climb. I'm going to share a room with three other children. I think I'll make some new friends. I'm going to call my parents every Sunday.",
  },
  {
    task: "Write about a trip to see a famous place in your country.",
    model:
      "During the October holiday, my family is going to visit the Great Wall. We are going to go there by car, and we are going to leave very early to miss the traffic. First we are going to walk up to the top of a tower and look at the view. Then we are going to have lunch in a village near the wall. It will probably be crowded, but I don't mind.",
  },
  {
    task: "Write about a trip you are going to take with your friends.",
    model:
      "Next Saturday my friends and I are going to ride our bikes to a lake outside the town. We are going to meet in front of the school at nine. It will take about an hour to get there. At the lake, we are going to have a picnic and swim. Tom is going to bring sandwiches, and I'm going to bring fruit and water. We will come home before dark.",
  },
  {
    task: "Write about a trip you dream of taking someday.",
    model:
      "Someday I'm going to travel around the world. First I'm going to fly to Egypt to see the pyramids and the desert. Then I'm going to take a ship across the ocean to South America. In Peru, I'm going to climb to Machu Picchu. I will probably need a lot of money, so I'm going to save every month. I think it will be the best journey of my life.",
  },
];

const writingAboutFuturePlans = judgedTopic({
  id: "writing-about-future-plans",
  title: t("Writing About Plans", "写计划"),
  summary: t(
    "Write six to eight sentences about a trip you are going to take: where, when, how and what you will do there.",
    "写六到八句话，讲一次你将要去的旅行：去哪里、什么时候、怎么去、在那里做什么。",
  ),
  prerequisites: ["be-going-to", "writing-a-postcard"],
  encompasses: [
    { topic: "be-going-to", weight: 0.3 },
    { topic: "writing-a-postcard", weight: 0.2 },
  ],
  criteria: ["a2-future-forms", "a2-trip-details", "a1-sentences"],
  point: {
    id: "plans",
    title: t("Where, when, how and what", "去哪里、什么时候、怎么去、做什么"),
    explanation: t(
      "Talk about the future with *going to* for your plans and *will* for what you think will happen:\n\n- Where and when: *Next month we are going to visit Sanya.*\n- How: *We are going to fly there.*\n- What you will do: *We are going to swim every day. We will probably visit an island.*",
      "用 *going to* 说计划，用 *will* 说你认为会发生的事：\n\n- 去哪里、什么时候：*Next month we are going to visit Sanya.*\n- 怎么去：*We are going to fly there.*\n- 要做什么：*We are going to swim every day. We will probably visit an island.*\n\n不要把将来的事写成一般现在时，比如 *Next month we visit Sanya.*",
    ),
  },
  question: t(
    "Write six to eight sentences in English about the trip the task names: where, when, how and what you will do there.",
    "根据题目用英语写六到八句话：去哪里、什么时候、怎么去、在那里做什么。",
  ),
  bank: plansBank,
  limits: { minWords: 45, maxChars: 900 },
  what: t("plan", "计划"),
});

/** topics are the topics of the unit Travel and Holidays. */
export const topics: readonly TopicDef[] = [
  holidays.topic,
  placesToVisit.topic,
  transport.topic,
  future.topic,
  beGoingTo,
  willForTheFuture,
  writingAboutFuturePlans,
];

/** vocabulary are the words the unit Travel and Holidays teaches. */
export const vocabulary: readonly WordBatch[] = [holidays.batch, placesToVisit.batch, transport.batch, future.batch];
