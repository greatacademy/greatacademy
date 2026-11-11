// A1, unit 10: Weather and Nature. Weather, seasons, nature and wild animals, it for the weather and the time, and
// postcards judged by a model.

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
import { interleave, pairUp, vocabularyTopic, word } from "../words.ts";

const weather = vocabularyTopic({
  id: "a1-words-weather",
  title: t("Weather", "天气"),
  summary: t("Sun, rain, snow, wind and clouds, and the words for days like them.", "太阳、雨、雪、风和云，以及描述这些天气的词。"),
  prerequisites: ["a1-words-times-of-day"],
  words: [
    word(
      "weather",
      "how hot, cold, wet or windy it is outside",
      "天气",
      "What's the {weather} like today? — It's sunny.|wind cloud | The {weather} is bad. Let's stay at home.|wind sun | I like hot {weather}.|cloud sun",
      "wind cloud",
    ),
    word(
      "sun suns",
      "the big star in the sky that gives us light and heat",
      "太阳",
      "The {sun} is hot today.|cloud wind | The {sun} comes up in the morning.|cloud snow | Don't look at the {sun}! It's bad for your eyes.|cloud wind",
      "cloud wind",
    ),
    word(
      "sunny sunnier sunniest",
      "with a lot of sun",
      "晴朗的",
      "It's {sunny} today. Let's go to the beach!|rainy snowy | Take your hat. It's very {sunny}.|rainy cloudy | Spain is a {sunny} country.|rainy snowy",
      "rainy cloudy",
    ),
    word(
      "rain rains rained raining",
      "water that falls from clouds; to fall like this",
      "雨；下雨",
      "Take an umbrella. It's {raining}.|snowing winding | The {rain} is very heavy today.|sun snowy | It {rained} all day yesterday.|sunny windy",
      "snow wind",
    ),
    word(
      "rainy rainier rainiest",
      "with a lot of rain",
      "多雨的",
      "It's a {rainy} day, so we are playing inside.|sunny windy | London is often {rainy}.|sunny snowy | I don't like {rainy} weather. My shoes get wet.|sunny snowy",
      "sunny snowy",
    ),
    word(
      "snow snows snowed snowing",
      "soft white pieces of frozen water that fall from the sky; to fall like this",
      "雪；下雪",
      "It's {snowing}! Let's make a snowman!|raining winding | In winter there is {snow} on the mountains.|sun rain | It doesn't often {snow} here.|rain sun",
      "rain wind",
    ),
    word(
      "snowy snowier snowiest",
      "with a lot of snow",
      "多雪的",
      "It's {snowy} today. Everything is white!|sunny rainy | We had a {snowy} winter this year.|sunny windy | Wear warm boots on {snowy} days.|sunny cloudy",
      "rainy sunny",
    ),
    word(
      "wind winds",
      "air that moves fast",
      "风",
      "The {wind} is very strong today. Hold your hat!|sun snow | The {wind} blows the leaves off the trees.|sun rain | There is no {wind}, so our kite won't fly.|sun rain",
      "sun cloud",
    ),
    word(
      "windy windier windiest",
      "with a lot of wind",
      "有风的",
      "It's {windy}. Let's fly a kite!|snowy rainy | It's too {windy} to use an umbrella.|sunny snowy | The beach is {windy} today, and the sand is flying.|snowy rainy",
      "sunny snowy",
    ),
    word(
      "cloud clouds",
      "a white or gray shape in the sky, made of water",
      "云",
      "Look at that big {cloud}! It looks like a rabbit.|sun wind | Gray {clouds} often bring rain.|suns winds | There isn't a {cloud} in the sky today.|wind snow",
      "sun wind",
    ),
    word(
      "cloudy cloudier cloudiest",
      "with a lot of clouds",
      "多云的",
      "It's {cloudy} today, but it's not raining.|sunny snowy | The sky is {cloudy} and gray.|sunny windy | On {cloudy} days, we can't see the sun.|sunny snowy",
      "sunny windy",
    ),
    word(
      "cold colder coldest",
      "not warm; with a low temperature",
      "冷的",
      "It's {cold} today. Wear your coat.|sunny hot | Ice is very {cold}.|hot sunny | I have a {cold}. I can't stop sneezing.|snow wind",
      "hot sunny",
    ),
  ],
});

const seasons = vocabularyTopic({
  id: "a1-words-seasons",
  title: t("Seasons", "季节"),
  summary: t("Spring, summer, fall and winter, hot, warm, cool, the sky and umbrellas.", "春夏秋冬，热、暖、凉爽，天空和雨伞。"),
  prerequisites: ["a1-words-weather"],
  words: [
    word(
      "hot hotter hottest",
      "very warm",
      "热的",
      "It's very {hot} in summer. Let's go swimming!|cool cold | Be careful! The soup is {hot}.|cool cold | July is the {hottest} month here.|coolest coldest",
      "cool cold",
    ),
    word(
      "warm warmer warmest",
      "a little hot, in a nice way",
      "温暖的",
      "It's {warm} in spring, not hot and not cold.|cool cold | This coat is very {warm}.|cool cold | Drink some {warm} milk before bed.|cool cold",
      "cool cold",
    ),
    word(
      "cool cooler coolest",
      "a little cold, in a nice way",
      "凉爽的",
      "In fall, the evenings are {cool}. Bring a jacket.|hot warm | It's hot outside, but it's {cool} under the trees.|hot warm | Wait for the soup to get {cooler}.|hotter warmer",
      "hot warm",
    ),
    word(
      "season seasons",
      "one of the four parts of the year: spring, summer, fall and winter",
      "季节",
      "There are four {seasons} in a year.|skies umbrellas | My favorite {season} is summer.|sky umbrella | Winter is the coldest {season}.|sky umbrella",
      "sky umbrella",
    ),
    word(
      "spring springs",
      "the season after winter, when plants start to grow",
      "春天",
      "In {spring}, the flowers come out.|winter fall | {Spring} comes after winter.|Summer Fall | Birds build nests in {spring}.|winter fall",
      "winter fall",
    ),
    word(
      "summer summers",
      "the hottest season of the year",
      "夏天",
      "In {summer}, we swim in the sea.|winter fall | {Summer} is the hottest season.|Winter Spring | We have a long {summer} holiday from school.|winter spring",
      "winter fall",
    ),
    word(
      "fall falls fell fallen falling",
      "the season after summer, when leaves come down; to come down",
      "秋天；落下",
      "In {fall}, the leaves turn red and yellow.|summer spring | Be careful! Don't {fall}!|stay rain | The apple {fell} from the tree.|stayed rained",
      "summer spring",
    ),
    word(
      "winter winters",
      "the coldest season of the year",
      "冬天",
      "It snows in {winter}.|summer spring | {Winter} is cold here.|Summer Spring | Bears sleep in {winter}.|summer spring",
      "summer spring",
    ),
    word(
      "sky skies",
      "the space above the earth, blue on a sunny day",
      "天空",
      "The {sky} is blue today.|season umbrella | Birds fly in the {sky}.|season umbrella | At night, the {sky} is dark.|season umbrella",
      "season umbrella",
    ),
    word(
      "umbrella umbrellas",
      "a thing you hold over your head when it rains",
      "雨伞",
      "It's raining. Take an {umbrella}.|sky season | My {umbrella} is red with white spots.|sky season | Open your {umbrella}. You're getting wet!|sky season",
      "sky season",
    ),
    word(
      "outside",
      "not in a building",
      "在外面",
      "It's sunny. Let's play {outside}!|warm cool | It's cold {outside}. Wear your coat.|warm cool | The dog is {outside} in the garden.|warm cool",
      "warm cool",
    ),
  ],
});

const nature = vocabularyTopic({
  id: "a1-words-nature",
  title: t("Nature", "自然"),
  summary: t(
    "Trees, flowers, grass, rivers, mountains, the sea, lakes, hills, beaches, islands and forests.",
    "树、花、草、河流、山、海、湖、小山、海滩、岛屿和森林。",
  ),
  prerequisites: ["a1-words-seasons"],
  words: [
    word(
      "tree trees",
      "a tall plant with a wooden trunk and branches",
      "树",
      "The bird is in the {tree}.|grass sea | Apples grow on {trees}.|grasses seas | We sit under a big {tree} for lunch.|grass lake",
      "flower grass",
    ),
    word(
      "flower flowers",
      "the colored part of a plant",
      "花",
      "I give my mom {flowers} for her birthday.|trees hills | This {flower} smells nice.|hill tree | There are red {flowers} in the garden.|hills rivers",
      "tree grass",
    ),
    word(
      "grass grasses",
      "a low green plant that covers the ground",
      "草",
      "The cows are eating {grass}.|tree flower | Don't walk on the {grass}.|tree flower | The {grass} is green after the rain.|sky sea",
      "tree flower",
    ),
    word(
      "river rivers",
      "water that moves across the land to the sea",
      "河流",
      "The Yangtze is a long {river} in China.|lake hill | We swim in the {river} in summer.|hill forest | There is a bridge over the {river}.|hill forest",
      "lake sea",
    ),
    word(
      "mountain mountains",
      "a very high hill",
      "山",
      "There is snow on top of the {mountain}.|beach lake | Everest is the highest {mountain} in the world.|beach lake | We walked up the {mountain} for five hours.|beach lake",
      "hill beach",
    ),
    word(
      "sea seas",
      "the big area of salt water that covers much of the earth",
      "海",
      "Fish and whales live in the {sea}.|hill forest | We swim in the {sea} in summer.|hill forest | The {sea} is blue and salty.|hill forest",
      "lake river",
    ),
    word(
      "lake lakes",
      "a big area of water with land all around it",
      "湖",
      "We take a boat across the {lake}.|hill forest | There are ducks on the {lake}.|hill tree | West {Lake} is in Hangzhou.|Hill Forest",
      "sea river",
    ),
    word(
      "hill hills",
      "high land, not as high as a mountain",
      "小山；山丘",
      "Our school is on a {hill}.|lake sea | Let's ride our bikes down the {hill}!|lake river | From the top of the {hill}, we can see the town.|lake river",
      "mountain lake",
    ),
    word(
      "leaf leaves",
      "one of the flat green parts of a tree or a plant",
      "叶子",
      "In fall, the {leaves} turn yellow.|flowers hills | A {leaf} fell on my head.|hill lake | Caterpillars eat {leaves}.|hills beaches",
      "flower grass",
    ),
    word(
      "beach beaches",
      "the land with sand next to the sea",
      "海滩",
      "We play in the sand on the {beach}.|forest hill | Let's go to the {beach} and swim!|forest hill | This island has white {beaches}.|forests hills",
      "forest hill",
    ),
    word(
      "island islands",
      "land with water all around it",
      "岛",
      "Hainan is an {island} in the south of China.|forest hill | We took a boat to the {island}.|forest hill | Japan has many {islands}.|forests hills",
      "forest beach",
    ),
    word(
      "forest forests",
      "a big area with many trees",
      "森林",
      "Bears live in the {forest}.|beach sea | It's dark in the {forest} because of the trees.|beach sea | We walked in the {forest} and saw a deer.|beach sea",
      "beach island",
    ),
  ],
});

const wildAnimals = vocabularyTopic({
  id: "a1-words-wild-animals",
  title: t("Wild Animals", "野生动物"),
  summary: t(
    "Lions, tigers, elephants, monkeys, bears, snakes, pandas and giraffes, the zoo, and insects.",
    "狮子、老虎、大象、猴子、熊、蛇、熊猫和长颈鹿，动物园和昆虫。",
  ),
  prerequisites: ["pre-a1-words-animals"],
  words: [
    word(
      "lion lions",
      "a big wild cat; the male has long hair around its head",
      "狮子",
      "The {lion} is called the king of the animals.|snake monkey | {Lions} live in Africa.|Snakes Pandas | A {lion} has a big loud roar.|snake panda",
      "tiger bear",
    ),
    word(
      "tiger tigers",
      "a big wild cat, orange with black stripes",
      "老虎",
      "A {tiger} is orange with black stripes.|lion panda | {Tigers} live in the forests of Asia.|Giraffes Sheep | The {tiger} is a big cat that can swim.|giraffe sheep",
      "lion panda",
    ),
    word(
      "elephant elephants",
      "a very big gray animal with a long nose",
      "大象",
      "An {elephant} has a very long nose.|insect snake | {Elephants} are the biggest animals on land.|Insects Snakes | The baby {elephant} drinks with its trunk.|insect monkey",
      "giraffe insect",
    ),
    word(
      "monkey monkeys",
      "an animal with a long tail that climbs trees",
      "猴子",
      "The {monkey} is eating a banana in the tree.|sheep snake | {Monkeys} climb trees very fast.|Sheep Snakes | A {monkey} has hands like ours.|snake sheep",
      "bear snake",
    ),
    word(
      "bear bears",
      "a big heavy wild animal with thick fur",
      "熊",
      "A {bear} sleeps all winter.|monkey insect | Polar {bears} are white.|monkeys insects | The {bear} caught a fish in the river.|snake monkey",
      "panda lion",
    ),
    word(
      "snake snakes",
      "a long thin animal with no legs",
      "蛇",
      "A {snake} has no legs.|bear lion | Some {snakes} are dangerous.|bears giraffes | The {snake} moves along the grass.|bear giraffe",
      "insect monkey",
    ),
    word(
      "sheep",
      "a farm animal with thick white wool",
      "羊；绵羊",
      'We get wool from {sheep}.|lions tigers | There are a hundred {sheep} on the farm.|lions tigers | A {sheep} says "baa".|lion tiger',
      "lion tiger",
    ),
    word(
      "zoo zoos",
      "a place where people can see wild animals",
      "动物园",
      "We saw lions and tigers at the {zoo}.|forest insect | The {zoo} has two pandas.|insect forest | Let's go to the {zoo} on Saturday!|insect island",
      "forest insect",
    ),
    word(
      "panda pandas",
      "a black and white bear from China that eats bamboo",
      "熊猫",
      "{Pandas} eat bamboo.|Lions Tigers | The {panda} is black and white.|lion tiger | Giant {pandas} live in China.|lions tigers",
      "bear tiger",
    ),
    word(
      "giraffe giraffes",
      "a very tall African animal with a long neck",
      "长颈鹿",
      "A {giraffe} has a very long neck.|monkey snake | {Giraffes} eat leaves from tall trees.|Monkeys Snakes | The {giraffe} is the tallest animal.|snake monkey",
      "elephant monkey",
    ),
    word(
      "wild wilder wildest",
      "living free in nature, not with people",
      "野生的",
      "Lions are {wild} animals.|insect zoo | {Wild} birds live in the forest.|Insect Zoo | This cat is not a pet. It's {wild}.|insect zoo",
      "insect zoo",
    ),
    word(
      "insect insects",
      "a small animal with six legs, like a bee",
      "昆虫",
      "A bee is an {insect}.|elephant zoo | {Insects} have six legs.|Elephants Zoos | There are many {insects} in the grass.|elephants zoos",
      "snake elephant",
    ),
  ],
});

// It is raining.

/** weatherStates are what it is: the weather words that follow It's. */
const weatherStates: readonly string[] = [
  "sunny",
  "raining",
  "very cold",
  "windy",
  "snowing",
  "cloudy",
  "hot",
  "warm",
  "rainy",
  "cool",
  "snowy",
  "very windy",
];

const weatherTimes: readonly string[] = ["today", "now", "this morning", "in Beijing", "outside"];

/** clockStates are the time and the day, which also take It's. */
const clockStates: readonly string[] = [
  "seven o'clock",
  "half past four",
  "late",
  "Monday today",
  "my birthday today",
  "a quarter past nine",
  "ten o'clock",
  "early",
  "Saturday today",
  "half past eight",
  "nine o'clock",
  "June 1st today",
];

/** itRests are what follows It's: sixty weather sentences (12 and 5 are coprime) and twelve about the time. */
const weatherRests = pairUp(60, weatherStates, weatherTimes).map(([state, when]) => `${state} ${when}`);
const itRests = (half: 0 | 1): readonly string[] =>
  interleave([weatherRests.slice(half * 30, half * 30 + 30), clockStates.slice(half * 6, half * 6 + 6)]);

const itChoiceBank: readonly ChoiceItem[] = itRests(0).map(
  (rest, k): ChoiceItem => [
    "",
    `It's ${rest}.`,
    k % 2 === 0 ? [`Is ${rest}.`, `It ${rest}.`, `There is ${rest}.`] : [`Is ${rest}.`, `It ${rest}.`],
  ],
);

const itFixBank: readonly TypedItem[] = itRests(1).map((rest, k): TypedItem => {
  const shown = k % 2 === 0 ? `Is ${rest}.` : `${rest.charAt(0).toUpperCase()}${rest.slice(1)}.`;
  const day = clockStates.includes(rest) && rest.endsWith(" today") ? [`Today is ${rest.slice(0, -" today".length)}.`] : [];
  return { shown, accepted: [`[It is|It's] ${rest}.`, ...day], canonical: `It's ${rest}.`, wrong: [shown, `It ${rest}.`] };
});

/** itTalksAbout says whether a sentence with it is about the weather or the time and day. */
const itTalksAbout = (sentence: string): Text =>
  clockStates.some((state) => sentence.includes(state)) ? t("the time or the day", "时间或日期") : t("the weather", "天气");

/** itWhy explains why a sentence about the weather or the time needs it. */
const itWhy = (right: string): Text => {
  const about = itTalksAbout(right);
  return t(
    `This sentence is about ${about.en}. An English sentence needs a subject, and for ${about.en} the subject is *it*, with *is* or *'s* after it: ${right}`,
    `这句说的是${about["zh-CN"]}。英语句子必须有主语，谈${about["zh-CN"]}时主语用 *it*，后面接 *is* 或 *'s*：${right}`,
  );
};

/** whyNotIt explains a sentence that leaves out it or is, or puts there is in place of it. */
const whyNotIt = (wrong: string, right: string, _shown: string, position: number): Text =>
  position === 0
    ? t(
        `*${wrong}* has a verb but no subject. English cannot leave out *it*: *${right}*`,
        `*${wrong}* 有动词却没有主语。英语不能省略 *it*：*${right}*`,
      )
    : position === 1
      ? t(
          `*${wrong}* has a subject but no verb. *It* needs *is* or *'s* after it: *${right}*`,
          `*${wrong}* 有主语却没有动词。*It* 后面要有 *is* 或 *'s*：*${right}*`,
        )
      : t(
          `*${wrong}* uses *there is*, which says that something exists. For ${itTalksAbout(right).en}, the subject is *it*: *${right}*`,
          `*${wrong}* 用了 *there is*，它表示某物存在。谈${itTalksAbout(right)["zh-CN"]}时主语用 *it*：*${right}*`,
        );

const itForWeather: TopicDef = {
  id: "it-for-weather",
  title: t("It Is Raining", "It is raining：用 it 谈天气和时间"),
  summary: t(
    "It is cold. It's raining. English needs it for the weather and the time.",
    "It is cold. It's raining. 英语谈天气和时间时需要 it。",
  ),
  prerequisites: ["present-continuous", "a1-words-weather"],
  encompasses: [
    { topic: "present-continuous", weight: 0.2 },
    { topic: "a1-words-weather", weight: 0.3 },
  ],
  xp: 15,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("It for the weather", "用 it 谈天气"),
      t(
        "An English sentence needs a subject. For the weather, the time and the day, the subject is *it*: *It's sunny. It's raining. It's seven o'clock. It's Monday today.*\n\n*It* means nothing here, but you can't leave it out: not *Is cold* or *Raining now*.",
        "英语句子必须有主语。谈天气、时间和日期时，主语用 *it*：*It's sunny. It's raining. It's seven o'clock. It's Monday today.*\n\n这里的 *it* 没有实际意思，但不能省略。中文说“下雨了”“很冷”“七点了”，都不需要主语，所以学习者常写 *Is cold* 或 *Raining now*。",
      ),
      choiceGenerator(t("Which sentence is right?", "哪个句子是对的？"), itChoiceBank, itWhy, whyNotIt),
    ),
    point(
      "fix",
      t("Putting in it", "补上 it"),
      t(
        "Each sentence leaves out the subject, as Chinese can. Write it again with *It is* or *It's* at the start: *Is cold today.* → *It's cold today.* *Raining now.* → *It's raining now.*",
        "每个句子都像中文一样省略了主语。在句首加上 *It is* 或 *It's* 重写句子：*Is cold today.* → *It's cold today.* *Raining now.* → *It's raining now.*",
      ),
      typedGenerator("sentence-pattern", t("Fix the sentence.", "改正这个句子。"), itFixBank, itWhy),
    ),
  ],
};

// Writing a postcard.

const criterion = (id: string): CriterionSpec => {
  const found = criterionById(id);
  if (!found) throw new Error(`unknown criterion ${id}`);
  return found;
};

/** postcardBank asks for a postcard from a place, in a season or on a trip. */
const postcardBank: readonly WritingItem[] = [
  {
    task: "You are on holiday at the beach. Write a postcard to your grandma.",
    model:
      "Dear Grandma,\nI'm at the beach with Mom and Dad. It's sunny and hot every day. We are swimming in the sea and playing in the sand. I'm having a great time!\nLove, Lily",
  },
  {
    task: "You are visiting your aunt in the mountains in winter. Write a postcard to your friend.",
    model:
      "Hi Tom,\nI'm at my aunt's house in the mountains. It's snowing, and it's very cold. Today we are making a big snowman. See you next week!\nBen",
  },
  {
    task: "You are on a school trip to a big city. Write a postcard to your parents.",
    model:
      "Dear Mom and Dad,\nI'm in Shanghai with my class. It's cloudy today, but it's warm. We are visiting a museum this morning. I love this city!\nLove, Mia",
  },
  {
    task: "You are camping in a forest. Write a postcard to your brother.",
    model:
      "Hi Leo,\nI'm camping in the forest with Dad. It's raining, so we are sitting in our tent and playing cards. Tomorrow we will walk to the lake.\nSam",
  },
  {
    task: "You are on an island in summer. Write a postcard to your teacher.",
    model:
      "Dear Ms. Green,\nI'm on Hainan Island with my family. It's very hot and sunny here. Every day I swim in the sea and eat a lot of fruit. See you in September!\nFrom Anna",
  },
  {
    task: "You are at a farm in spring. Write a postcard to your friend.",
    model:
      "Hi Emma,\nI'm at my uncle's farm. It's spring, and it's warm. There are baby sheep and lots of flowers. I'm helping my uncle feed the chickens every morning.\nLove, Kate",
  },
  {
    task: "You are by a lake in fall. Write a postcard to your grandpa.",
    model:
      "Dear Grandpa,\nI'm at the lake with Mom. It's fall, and the leaves are red and yellow. It's cool and windy, so we are flying a kite. I miss you!\nLove, Jack",
  },
  {
    task: "You are visiting a zoo in another city. Write a postcard to your sister.",
    model:
      "Hi Amy,\nI'm in Chengdu with Dad. It's cloudy and a little rainy today. We are at the zoo, and I'm watching the pandas. They are eating bamboo!\nNora",
  },
  {
    task: "You are on a skiing holiday. Write a postcard to your class.",
    model:
      "Dear class,\nI'm in the mountains with my family. It's snowy and very cold, but the sun is out. I'm learning to ski. It's difficult, but it's fun!\nFrom Max",
  },
  {
    task: "You are staying with your cousin by the sea in winter. Write a postcard to your mom.",
    model:
      "Dear Mom,\nI'm at Cousin Ana's house by the sea. It's windy and cold today. We are walking on the beach and looking for shells. Ana's dog is very funny.\nLove, Lucy",
  },
  {
    task: "You are on a trip to the countryside in summer. Write a postcard to your friend.",
    model:
      "Hi Jun,\nI'm in the countryside with my grandparents. It's hot and sunny. In the afternoon we swim in the river. At night we look at the stars.\nYour friend, Ben",
  },
  {
    task: "You are on a rainy holiday in London. Write a postcard to your dad.",
    model:
      "Dear Dad,\nI'm in London with Mom. It's raining again! We have umbrellas, so we are walking by the river. Tomorrow we are visiting a big museum.\nLove, Mia",
  },
];

const postcardCriteria = ["a1-postcard-place", "a1-postcard-weather", "a1-postcard-doing", "a1-reader-and-name", "a1-sentences"];

const writingAPostcard: TopicDef = {
  id: "writing-a-postcard",
  title: t("Writing a Postcard", "写明信片"),
  summary: t(
    "Write a postcard of three to five sentences: where you are, what the weather is like and what you are doing.",
    "写一张三到五句话的明信片：你在哪里、天气怎么样、你正在做什么。",
  ),
  prerequisites: ["it-for-weather", "writing-a-short-note"],
  encompasses: [
    { topic: "it-for-weather", weight: 0.3 },
    { topic: "writing-a-short-note", weight: 0.3 },
  ],
  xp: 25,
  strand: "writing",
  criteria: postcardCriteria.map(criterion),
  knowledgePoints: [
    point(
      "postcard",
      t("Where, the weather and what you are doing", "在哪里、天气、在做什么"),
      t(
        "A postcard is a short note from a trip. Start with the reader's name (*Dear Grandma,*) and end with yours. In between, say three things:\n\n- where you are: *I'm at the beach with Mom and Dad.*\n- the weather: *It's sunny and hot.*\n- what you are doing: *We are swimming in the sea.*",
        "明信片是旅途中写的短信。开头写收信人的称呼（*Dear Grandma,*），结尾写自己的名字。中间写三件事：\n\n- 你在哪里：*I'm at the beach with Mom and Dad.*\n- 天气怎么样：*It's sunny and hot.*（别忘了 *it*）\n- 你正在做什么：*We are swimming in the sea.*（用现在进行时）",
      ),
      writingGenerator(
        t(
          "Write a postcard in English of three to five sentences: say where you are, what the weather is like and what you are doing.",
          "用英语写一张三到五句话的明信片：说出你在哪里、天气怎么样、你正在做什么。",
        ),
        postcardBank,
        postcardCriteria,
        { minWords: 20, maxChars: 600 },
        (model) => t(`One good postcard:\n\n> ${model.replace(/\n/gu, "\n> ")}`, `一张好的明信片：\n\n> ${model.replace(/\n/gu, "\n> ")}`),
      ),
    ),
  ],
};

/** topics are the topics of the unit Weather and Nature. */
export const topics: readonly TopicDef[] = [weather.topic, seasons.topic, nature.topic, wildAnimals.topic, itForWeather, writingAPostcard];

/** vocabulary are the words the unit Weather and Nature teaches. */
export const vocabulary: readonly WordBatch[] = [weather.batch, seasons.batch, nature.batch, wildAnimals.batch];
