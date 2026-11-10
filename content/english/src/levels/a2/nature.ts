// A2, unit 8: The Natural World. Land and water, storms and ice, space, plants and little words; the present perfect
// with ever and never; an experience judged by a model.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator, type WritingItem } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { interleave, pairUp, vocabularyTopic, word } from "../words.ts";
import { combos, fill, judgedTopic } from "./kit.ts";

const landscape = vocabularyTopic({
  id: "a2-words-landscape",
  title: t("Land and Water", "陆地和水"),
  summary: t(
    "The earth, land and ground; stones, rocks and sand; woods and jungles; ponds, waterfalls and streams; paths.",
    "地球、陆地和地面；石头、岩石和沙子；树林和丛林；池塘、瀑布和小溪；小路。",
  ),
  prerequisites: ["a1-words-nature"],
  words: [
    word(
      "earth",
      "the world we live on; the soil that plants grow in",
      "地球；泥土",
      "The {earth} goes around the sun.|sand path | Plant the seeds in the {earth} and water them.|path pond | The moon is smaller than the {earth}.|pond stream",
      "land sand",
    ),
    word(
      "land lands",
      "the part of the world that is not sea",
      "陆地；土地",
      "After ten days at sea, the sailors saw {land}.|pond stream | My grandparents have a small piece of {land} with a garden.|pond path | Frogs live on {land} and in water.|path stream",
      "ground earth",
      "ground",
    ),
    word(
      "ground grounds",
      "the surface of the earth that you walk on",
      "地面",
      "The apple fell to the {ground}.|pond jungle | Sit on the {ground}. There are no chairs.|pond jungle | The {ground} is wet after the rain.|jungle waterfall",
      "land floor",
      "land",
    ),
    word(
      "stone stones",
      "a small hard piece of rock",
      "石头",
      "He threw a {stone} into the river.|pond path | The old house has thick {stone} walls.|pond sand | There's a {stone} in my shoe!|pond path",
      "rock sand",
      "rock",
    ),
    word(
      "rock rocks",
      "the hard material of mountains; a big stone",
      "岩石",
      "We sat on a big {rock} by the sea.|pond path | Mountains are made of {rock}.|pond sand | Be careful! The {rocks} are wet and slippery.|ponds paths",
      "stone sand",
      "stone",
    ),
    word(
      "wood woods",
      "what trees are made of; a small forest",
      "木头；树林",
      "The table is made of {wood}.|sand stream | We went for a walk in the {woods}.|sands streams | Put some more {wood} on the fire.|sand stream",
      "jungle stone",
    ),
    word(
      "jungle jungles",
      "a thick hot wet forest with many plants and animals",
      "丛林",
      "Tigers and monkeys live in the {jungle}.|desert pond | It rains almost every day in the {jungle}.|desert pond | The explorers walked through the {jungle} for days.|pond stream",
      "wood desert",
    ),
    word(
      "pond ponds",
      "a small area of water, smaller than a lake",
      "池塘",
      "There are fish and frogs in the {pond}.|path sand | The children threw bread to the ducks on the {pond}.|path rock | In winter the {pond} freezes.|path rock",
      "stream lake",
    ),
    word(
      "waterfall waterfalls",
      "water that falls down from a high place",
      "瀑布",
      "Niagara Falls is a famous {waterfall}.|pond path | We heard the {waterfall} before we saw it.|pond path | You can swim under the {waterfall} in summer.|path sand",
      "stream pond",
    ),
    word(
      "stream streams",
      "a small, narrow river",
      "小溪",
      "We crossed the {stream} on some stones.|sand rock | Fresh water runs down the hill in a little {stream}.|pond path | The {stream} goes into the big river.|path sand",
      "pond waterfall",
    ),
    word(
      "sand",
      "the very small pieces of rock on a beach or in a desert",
      "沙子",
      "The children are building a castle in the {sand}.|stream pond | There's {sand} in my shoes after the beach.|stream pond | The desert is full of {sand}.|stream pond",
      "stone earth",
    ),
    word(
      "path paths",
      "a narrow way for walking",
      "小路",
      "Follow the {path} through the woods.|pond sand | Stay on the {path}. Don't walk on the grass.|pond sand | A narrow {path} goes up to the top of the hill.|pond sand",
      "stream road",
    ),
  ],
});

const weather2 = vocabularyTopic({
  id: "a2-words-weather-2",
  title: t("Storms and Ice", "风暴和冰"),
  summary: t(
    "Storms, thunder and lightning; fog; freezing and melting; the sun shining; degrees; wet and dry.",
    "风暴、雷和闪电；雾；结冰和融化；阳光照耀；度数；湿的和干的。",
  ),
  prerequisites: ["a2-words-landscape"],
  words: [
    word(
      "storm storms",
      "very bad weather with strong winds and heavy rain",
      "暴风雨",
      "A big {storm} broke the windows of the school.|degree fog | The ships stayed in the port because of the {storm}.|degree path | After the {storm}, the sky was clear.|degree lightning",
      "fog thunder",
    ),
    word(
      "thunder",
      "the loud noise in the sky during a storm",
      "雷",
      "My dog is scared of {thunder}.|degree sand | We heard {thunder} in the distance.|fog degree | First you see the lightning, then you hear the {thunder}.|fog storm",
      "lightning storm",
    ),
    word(
      "lightning",
      "the bright flash of light in the sky during a storm",
      "闪电",
      "The tree was hit by {lightning}.|thunder fog | A flash of {lightning} lit up the sky.|thunder fog | Don't stand under a tree when there is {lightning}.|fog degree",
      "thunder storm",
    ),
    word(
      "fog",
      "thick cloud near the ground that makes it hard to see",
      "雾",
      "We couldn't see the road because of the {fog}.|thunder lightning | The {fog} came in from the sea in the morning.|thunder lightning | The plane couldn't land in the thick {fog}.|thunder degree",
      "storm thunder",
    ),
    word(
      "foggy foggier foggiest",
      "with a lot of fog",
      "有雾的",
      "It's very {foggy} this morning. Drive carefully.|dry shining | London is famous for its {foggy} weather.|dry melting | On {foggy} days, the ships stay in the port.|dry shining",
      "wet dry",
    ),
    word(
      "freeze freezes froze frozen freezing",
      "to become ice because it is very cold",
      "结冰；冻",
      "Water {freezes} at zero degrees.|melts shines | The lake {froze} last winter, and we skated on it.|melted shone | It's {freezing} outside! Wear a hat.|melting shining",
      "melt shine",
    ),
    word(
      "melt melts melted melting",
      "to change from ice to water because it gets warm",
      "融化",
      "The ice cream {melted} in the sun.|froze shone | When the snow {melts}, the rivers get bigger.|freezes shines | Put the chocolate in a bowl and let it {melt}.|freeze shine",
      "freeze dry",
    ),
    word(
      "shine shines shone shining",
      "to give out bright light",
      "照耀；发光",
      "The sun is {shining}. Let's go out!|melting freezing | The stars {shone} in the dark sky.|melted froze | Her eyes {shine} when she talks about horses.|melt freeze",
      "melt freeze",
    ),
    word(
      "degree degrees",
      "a unit for measuring how hot or cold something is",
      "度",
      "It's thirty {degrees} today. It's very hot!|storms fogs | Water boils at a hundred {degrees}.|storms fogs | The temperature fell to minus ten {degrees}.|storms thunders",
      "storm fog",
    ),
    word(
      "wet wetter wettest",
      "covered with water; not dry",
      "湿的",
      "I forgot my umbrella and got very {wet}.|dry foggy | Don't sit there. The paint is still {wet}.|dry foggy | Take off your {wet} shoes.|dry frozen",
      "dry foggy",
    ),
    word(
      "dry dries dried drying drier driest",
      "with no water; to make something dry",
      "干的；弄干",
      "The ground is very {dry}. It hasn't rained for weeks.|wet foggy | Hang the clothes outside to {dry}.|wet melt | {Dry} your hands on this towel.|Wet Melt",
      "wet foggy",
    ),
  ],
});

const space = vocabularyTopic({
  id: "a2-words-space",
  title: t("Space", "太空"),
  summary: t(
    "Space, stars, moons and planets; the world; light and dark; rockets and spaceships; sunrise; air; millions.",
    "太空、星星、卫星和行星；世界；光明和黑暗；火箭和宇宙飞船；日出；空气；百万。",
  ),
  prerequisites: ["a2-words-weather-2"],
  words: [
    word(
      "space",
      "the area outside the earth, where the stars and planets are; room to put things",
      "太空；空间",
      "The rocket flew into {space}.|air light | There's no {space} in my suitcase for these shoes.|air light | From {space}, the earth looks blue.|air sunrise",
      "air world",
    ),
    word(
      "star stars",
      "a very far sun that you see as a small light in the sky at night",
      "星星",
      "Look at all the {stars} in the sky tonight!|planets rockets | The sun is a {star}.|planet rocket | I wish I could fly to the {stars}.|rockets spaceships",
      "planet moon",
    ),
    word(
      "moon moons",
      "the round thing that goes around the earth and shines at night",
      "月亮；卫星",
      "The {moon} is full tonight. It's very bright.|star planet | People first walked on the {moon} in 1969.|star sunrise | Jupiter has many {moons}.|stars rockets",
      "star planet",
    ),
    word(
      "planet planets",
      "a large round thing in space that goes around a star",
      "行星",
      "The earth is a {planet}.|star moon | Mars is called the red {planet}.|star rocket | There are eight {planets} around our sun.|stars rockets",
      "star moon",
    ),
    word(
      "world worlds",
      "the earth and all the people and places on it",
      "世界",
      "Mount Everest is the highest mountain in the {world}.|space air | She wants to travel around the {world}.|space air | There are about two hundred countries in the {world}.|space air",
      "space planet",
    ),
    word(
      "light lights",
      "what makes it possible to see; a lamp",
      "光；灯",
      "Plants need {light} and water to grow.|dark space | Turn off the {light} when you leave the room.|dark air | The {lights} of the city are beautiful at night.|darks airs",
      "dark star",
    ),
    word(
      "dark darker darkest",
      "with little or no light",
      "黑暗的；深色的",
      "It gets {dark} early in winter.|light million | I'm scared of the {dark}.|light air | She has {dark} hair and brown eyes.|million space",
      "light black",
    ),
    word(
      "rocket rockets",
      "a long thin machine that flies into space",
      "火箭",
      "The {rocket} took off with a loud noise.|planet star | China sent a {rocket} to the moon.|planet star | We made a small paper {rocket} in class.|sunrise million",
      "spaceship planet",
    ),
    word(
      "spaceship spaceships",
      "a vehicle that carries people through space",
      "宇宙飞船",
      "In the film, a {spaceship} lands in the desert.|planet star | The crew lived in the {spaceship} for six months.|planet star | Can a {spaceship} fly to another star?|planet moon",
      "rocket planet",
    ),
    word(
      "sunrise sunrises",
      "the time in the morning when the sun comes up",
      "日出",
      "We got up early to watch the {sunrise}.|million space | The farmers start work at {sunrise}.|million space | The {sunrise} over the sea was beautiful.|million air",
      "sunset morning",
    ),
    word(
      "air",
      "what you breathe; the space above the ground",
      "空气",
      "Open the window and let in some fresh {air}.|space light | There is no {air} on the moon.|million space | The bird flew up into the {air}.|light sunrise",
      "space light",
    ),
    word(
      "million millions",
      "1,000,000",
      "百万",
      "About ten {million} people live in this city.|sunrise space | The sun is about 150 {million} kilometers from the earth.|sunrise space | {Millions} of people watched the match on TV.|Sunrises Spaces",
      "thousand hundred",
    ),
  ],
});

const plants = vocabularyTopic({
  id: "a2-words-plants",
  title: t("Plants", "植物"),
  summary: t(
    "Seeds, roots, branches and bushes; roses and sunflowers; picking; nature and natural; rainbows; bamboo.",
    "种子、根、树枝和灌木；玫瑰和向日葵；采摘；大自然和自然的；彩虹；竹子。",
  ),
  prerequisites: ["a2-words-space"],
  words: [
    word(
      "seed seeds",
      "the small thing that a new plant grows from",
      "种子",
      "Plant the {seeds} in spring.|roots branches | A sunflower {seed} is black and white.|root branch | Birds eat {seeds} in winter.|roots bushes",
      "root branch",
    ),
    word(
      "root roots",
      "the part of a plant that grows under the ground",
      "根",
      "The {roots} of the tree are very deep.|seeds roses | Plants drink water through their {roots}.|branches roses | This {root} is good to eat. It's a carrot!|branch rose",
      "seed branch",
    ),
    word(
      "branch branches",
      "a part of a tree that grows out from the middle",
      "树枝",
      "A bird is sitting on the {branch}.|root seed | The wind broke some {branches} off the tree.|roots seeds | The monkey jumped from one {branch} to another.|root seed",
      "root bush",
    ),
    word(
      "bush bushes",
      "a plant like a small tree with many branches",
      "灌木",
      "The cat is hiding behind the {bush}.|seed root | There are rose {bushes} in front of the house.|seeds roots | We picked berries from the {bushes}.|seeds roots",
      "branch tree",
    ),
    word(
      "rose roses",
      "a flower with a sweet smell and sharp parts on its stem",
      "玫瑰",
      "He gave her a red {rose}.|bamboo root | {Roses} smell sweet.|Roots Bamboos | My grandma grows {roses} in her garden.|bamboos roots",
      "sunflower bush",
    ),
    word(
      "pick picks picked picking",
      "to take a flower or fruit from a plant; to choose",
      "采摘；挑选",
      "We {picked} apples at the farm.|grew rooted | Please don't {pick} the flowers in the park.|grow root | {Pick} a card, any card.|Grow Root",
      "grow plant",
    ),
    word(
      "nature",
      "all the plants, animals and things in the world that people did not make",
      "大自然",
      "I love walking in {nature}.|natural rainbow | We watched a {nature} program about whales.|natural bamboo | {Nature} is beautiful in autumn.|Natural Rainbow",
      "natural world",
      "natural",
    ),
    word(
      "natural",
      "made by nature, not by people",
      "自然的；天然的",
      "This juice is {natural}. There's no sugar in it.|nature rainbow | Is your hair color {natural}?|nature bamboo | Floods and storms are {natural} problems.|nature bamboo",
      "nature normal",
      "nature",
    ),
    word(
      "rainbow rainbows",
      "a curve of colors in the sky after rain",
      "彩虹",
      "After the rain, there was a {rainbow} in the sky.|bamboo seed | A {rainbow} has seven colors.|bamboo root | Look! A double {rainbow}!|bamboo seed",
      "sunflower sunrise",
    ),
    word(
      "sunflower sunflowers",
      "a very tall plant with a big yellow flower",
      "向日葵",
      "{Sunflowers} turn to face the sun.|Bamboos Roots | The {sunflower} in our garden is taller than my dad.|bamboo root | We eat {sunflower} seeds as a snack.|rainbow root",
      "rose rainbow",
    ),
    word(
      "bamboo bamboos",
      "a tall plant with hard hollow stems",
      "竹子",
      "Pandas eat {bamboo}.|roses rainbows | These chopsticks are made of {bamboo}.|rose rainbow | {Bamboo} grows very quickly.|Rainbow Rose",
      "rose bush",
    ),
  ],
});

const littleWords3 = vocabularyTopic({
  id: "a2-words-little-words-3",
  title: t("Little Words 3", "小词 3"),
  summary: t(
    "Could, ever, even, still and else; around, across, through and along; above, below and without.",
    "could、ever、even、still 和 else；around、across、through 和 along；above、below 和 without。",
  ),
  prerequisites: ["a2-words-plants"],
  words: [
    word(
      "could couldn't",
      "the past of can; a polite way to ask",
      "能（can 的过去式）；可以",
      "When I was five, I {could} swim.|ever still | {Could} you open the window, please?|Ever Even | We {couldn't} see the stars because of the clouds.|wasn't isn't",
      "can should",
    ),
    word(
      "ever",
      "at any time",
      "曾经；在任何时候",
      "Have you {ever} seen a whale?|even else | Nothing {ever} happens in this town.|across below | It's the best film I've {ever} seen.|else across",
      "never even",
    ),
    word(
      "even",
      "a word that shows something is surprising",
      "甚至",
      "It's very cold. It's {even} snowing in the south!|ever else | Everyone came, {even} my grandpa.|ever else | He doesn't {even} know my name.|else ever",
      "ever still",
    ),
    word(
      "still",
      "continuing until now",
      "仍然；还",
      "It's ten o'clock and he is {still} in bed.|ever else | Are you {still} hungry?|else across | I {still} remember my first day at school.|else across",
      "already even",
    ),
    word(
      "else",
      "other; more",
      "别的；其他",
      "Do you want anything {else}?|still even | Everyone {else} has gone home.|still even | Let's go somewhere {else}. It's too crowded here.|still across",
      "other even",
    ),
    word(
      "around",
      "in a circle; in different places",
      "围绕；到处",
      "The earth goes {around} the sun.|without below | We walked {around} the old town.|without below | There were trees all {around} the house.|without below",
      "across through",
    ),
    word(
      "across",
      "from one side to the other",
      "穿过；横过",
      "We swam {across} the river.|above below | Look both ways before you walk {across} the road.|above without | There is a bridge {across} the stream.|without below",
      "through along",
    ),
    word(
      "through",
      "in at one side and out at the other",
      "穿过；通过",
      "The train went {through} a long tunnel.|above below | We walked {through} the forest.|above below | The cat came in {through} the window.|above below",
      "across along",
    ),
    word(
      "along",
      "from one end toward the other end of something long",
      "沿着",
      "We walked {along} the beach.|above below | There are shops all {along} the street.|above below | Drive {along} this road for two kilometers.|above below",
      "across through",
    ),
    word(
      "above",
      "higher than",
      "在……上方",
      "The plane flew {above} the clouds.|without along | There's a picture {above} the bed.|without along | The temperature is {above} thirty degrees.|without along",
      "below over",
    ),
    word(
      "below",
      "lower than",
      "在……下方",
      "From the plane, we saw the city {below} us.|without along | The temperature fell {below} zero.|without along | Write your name {below} the line.|without through",
      "above under",
    ),
    word(
      "without",
      "not having; not with",
      "没有；不带",
      "I can't see {without} my glasses.|along below | Plants die {without} water.|along around | He left {without} saying goodbye.|along around",
      "with along",
    ),
  ],
});

// The present perfect with ever and never.

/** experiences are a verb, its past simple, its past participle and the rest of the experience. */
const experiences: readonly (readonly [string, string, string, string])[] = [
  ["see", "saw", "seen", "a waterfall"],
  ["eat", "ate", "eaten", "raw fish"],
  ["swim", "swam", "swum", "in the ocean"],
  ["fly", "flew", "flown", "in a helicopter"],
  ["ride", "rode", "ridden", "a horse"],
  ["take", "took", "taken", "a night train"],
  ["write", "wrote", "written", "a poem"],
  ["be", "was", "been", "to a desert"],
  ["break", "broke", "broken", "a bone"],
  ["drink", "drank", "drunk", "coconut water"],
  ["climb", "climbed", "climbed", "a mountain"],
  ["sleep", "slept", "slept", "in a tent"],
  ["visit", "visited", "visited", "a cave"],
];

/** ppSubjects are a subject, its form of have, the short form, and whether it keeps its capital inside a sentence. */
const ppSubjects: readonly (readonly [string, string, string, boolean])[] = [
  ["I", "have", "I've", true],
  ["You", "have", "You've", false],
  ["My brother", "has", "", false],
  ["We", "have", "We've", false],
  ["She", "has", "She's", false],
  ["My parents", "have", "", false],
  ["Tom", "has", "", true],
];

const irregular = experiences.filter(([, past, participle]) => past !== participle);

const participleFrames: readonly ((rest: string) => string)[] = [
  (rest) => `Have you ever ___ ${rest}?`,
  (rest) => `I have never ___ ${rest}.`,
  (rest) => `My sister has ___ ${rest} twice.`,
];

const participleBank: readonly ChoiceItem[] = interleave(
  participleFrames.map((frame) =>
    irregular.map(([verb, past, participle, rest]): ChoiceItem => [`${frame(rest)} (${verb})`, participle, [past, verb]]),
  ),
);

const ppIn = (s: readonly [string, string, string, boolean]) => (s[3] ? s[0] : s[0].toLowerCase());
const other = (have: string) => (have === "have" ? "has" : "have");
const beFor = (subject: string) => (subject === "I" ? "am" : /^(My brother|She|Tom)$/u.test(subject) ? "is" : "are");

const ppRows = combos(91, ppSubjects, experiences, [0]);

const haveBank: readonly ChoiceItem[] = interleave([
  ppRows
    .slice(0, 20)
    .map(([s, [, , participle, rest]]): ChoiceItem => [`${s[0]} ___ never ${participle} ${rest}.`, s[1], [other(s[1]), beFor(s[0])]]),
  ppRows
    .slice(20, 40)
    .filter(([s]) => s[0] !== "I" && s[0] !== "We")
    .map(([s, [, , participle, rest]]): ChoiceItem => {
      const have = s[0] === "You" ? "Have" : s[1] === "has" ? "Has" : "Have";
      return [`___ ${ppIn(s)} ever ${participle} ${rest}?`, have, [have === "Have" ? "Has" : "Have", "Did"]];
    }),
]);

const ppTypedBank: readonly TypedItem[] = pairUp(52, ppSubjects, experiences)
  .slice(0, 52)
  .flatMap(([s, [, past, participle, rest]], k): TypedItem[] => {
    if (k % 2 === 0) {
      const [subject, have, short] = s;
      const start = short ? `[${subject} ${have}|${short}]` : `${subject} ${have}`;
      return [
        {
          shown: `${subject} / never / ${experiences.find((e) => e[2] === participle)?.[0]} ${rest}`,
          accepted: [`${start} never ${participle} ${rest}.`],
          canonical: `${subject} ${have} never ${participle} ${rest}.`,
          wrong: [
            `${subject} ${other(have)} never ${participle} ${rest}.`,
            `${subject} ${have} never ${past === participle ? `${past}s` : past} ${rest}.`,
          ],
        },
      ];
    }
    if (s[0] === "I" || s[0] === "We") return [];
    const have = s[0] === "You" ? "Have" : s[1] === "has" ? "Has" : "Have";
    return [
      {
        shown: `${ppIn(s)} / ever / ${experiences.find((e) => e[2] === participle)?.[0]} ${rest}`,
        accepted: [`${have} ${ppIn(s)} ever ${participle} ${rest}?`],
        wrong: [
          `Did ${ppIn(s)} ever ${participle} ${rest}?`,
          `${have} ${ppIn(s)} ever ${past === participle ? `${past}s` : past} ${rest}?`,
        ],
      },
    ];
  });

const presentPerfectEverNever: TopicDef = {
  id: "present-perfect-with-ever-and-never",
  title: t("Have You Ever...?", "Have you ever...?"),
  summary: t(
    "Have you ever seen a waterfall? I have never climbed a mountain. Have with a past participle, for experiences at any time up to now.",
    "Have you ever seen a waterfall? I have never climbed a mountain. have 加过去分词，表示到现在为止的经历。",
  ),
  prerequisites: ["past-simple-irregular", "have-and-has"],
  encompasses: [
    { topic: "past-simple-irregular", weight: 0.3 },
    { topic: "have-and-has", weight: 0.2 },
  ],
  xp: 20,
  strand: "grammar",
  knowledgePoints: [
    point(
      "participle",
      t("The past participle", "过去分词"),
      t(
        "The present perfect is *have* or *has* with the past participle. For regular verbs the past participle is the same as the past simple: *climbed*, *visited*. Many common verbs have their own:\n\n- *see – saw – seen*\n- *eat – ate – eaten*\n- *swim – swam – swum*\n- *fly – flew – flown*\n- *ride – rode – ridden*\n- *be – was – been*\n\n*Have you ever seen a whale?* not *Have you ever saw a whale?*",
        "现在完成时由 *have / has* 加过去分词构成。规则动词的过去分词和过去式一样：*climbed*、*visited*。很多常用动词有自己的形式：\n\n- *see – saw – seen*\n- *eat – ate – eaten*\n- *swim – swam – swum*\n- *fly – flew – flown*\n- *ride – rode – ridden*\n- *be – was – been*\n\n说 *Have you ever seen a whale?*，不说 *Have you ever saw a whale?*",
      ),
      choiceGenerator(t("Choose the word for the gap.", "选出填入空白处的词。"), participleBank, (right, shown) =>
        t(fill(shown, right), `${fill(shown, right)}（have / has 后面用过去分词）`),
      ),
    ),
    point(
      "have-has",
      t("Have or has", "have 还是 has"),
      t(
        "Use *has* with *he*, *she*, *it* and one person, and *have* with *I*, *you*, *we*, *they* and more than one: *My brother has never flown. My parents have never flown.*\n\nIn questions, *have* or *has* comes first: *Has Tom ever ridden a horse?* Do not use *did* with *ever* and a past participle.\n\n*ever* means *at any time*, and goes in questions; *never* means *not at any time*, and goes in statements.",
        "*he*、*she*、*it* 和单个人用 *has*；*I*、*you*、*we*、*they* 和多个人用 *have*：*My brother has never flown. My parents have never flown.*\n\n疑问句把 *have / has* 放在最前面：*Has Tom ever ridden a horse?* 不要用 *did* 和过去分词一起问。\n\n*ever* 意思是“曾经”，用在疑问句；*never* 意思是“从来没有”，用在陈述句。中文“去过”“吃过”里的“过”常常对应现在完成时。",
      ),
      choiceGenerator(t("Choose the word for the gap.", "选出填入空白处的词。"), haveBank, (right, shown) =>
        t(fill(shown, right), `${fill(shown, right)}（${/^(has|Has)$/u.test(right) ? "单数第三人称用 has" : "其他人称用 have"}）`),
      ),
    ),
    point(
      "write",
      t("Writing about experiences", "写经历"),
      t(
        "Write the sentence from the note. *never* makes a statement: *My brother has never ridden a horse.* *ever* makes a question: *Have you ever ridden a horse?* Use the past participle of the verb.",
        "根据笔记写句子。有 *never* 就写陈述句：*My brother has never ridden a horse.* 有 *ever* 就写疑问句：*Have you ever ridden a horse?* 动词用过去分词。",
      ),
      typedGenerator("sentence-pattern", t("Write a sentence from the note.", "根据笔记写一个句子。"), ppTypedBank, (right) =>
        t(right, `${right}（have / has + 过去分词）`),
      ),
    ),
  ],
};

/** been and the short forms of have are the word forms this topic teaches. */
const been: WordBatch = {
  topic: "present-perfect-with-ever-and-never",
  words: ["been", "i've", "you've", "we've", "they've"],
};

// Writing about an experience.

const experienceBank: readonly WritingItem[] = [
  {
    task: "Write about a time you have seen a waterfall or a big river.",
    model:
      "I have seen a big waterfall once. It was two years ago, on a trip to Guizhou with my family. We walked along a path through the woods for an hour. Then we heard a loud noise. Suddenly we saw the waterfall in front of us. It was huge, and the water was white. We walked behind it, and we got very wet! I have never forgotten that day.",
  },
  {
    task: "Write about a time you have climbed a mountain or a big hill.",
    model:
      "I have climbed a mountain only once. Last October, my dad and I climbed Mount Tai. We started at night because we wanted to see the sunrise from the top. The path was steep, and there were thousands of stone steps. My legs hurt, but I didn't stop. We reached the top at five in the morning. The sunrise was beautiful. I have never been so tired and so happy.",
  },
  {
    task: "Write about a time you have slept outside or in a tent.",
    model:
      "I have slept in a tent three times. The best time was last summer at a lake in the mountains. My cousins and I put up the tent near the water. In the evening we cooked fish on a fire. At night there was no light, so we could see millions of stars. Then a storm came, and there was thunder and lightning. We were scared, but the tent stayed dry.",
  },
  {
    task: "Write about a time you have swum in the sea, a lake or a river.",
    model:
      "I have swum in the sea many times, but one day was special. Last August we went to a small island. The water was clear and blue, and I could see fish below me. I swam along the coast with my mom. Suddenly a big turtle swam past us! It moved slowly and didn't look scared. I have never seen a turtle so close before.",
  },
  {
    task: "Write about a time you have seen snow or ice.",
    model:
      "I live in the south, so I have seen snow only once. It was last January, when we visited my aunt in Harbin. It was minus twenty degrees, and the river was frozen. We walked across the ice! We also saw huge ice statues in a park. At night, lights shone inside them in all the colors of the rainbow. I have never been so cold, but it was amazing.",
  },
  {
    task: "Write about a time you have seen a wild animal.",
    model:
      "Have you ever seen a wild fox? I have seen one. It was last spring, in the woods near my grandparents' village. I was walking along a path early in the morning. Suddenly a fox came out of the bushes. It had red fur and a long tail. It looked at me for a few seconds. Then it ran away through the trees. I didn't have time to take a photo.",
  },
  {
    task: "Write about a time you have planted something or grown a plant.",
    model:
      "I have grown sunflowers twice. Last year I planted ten seeds in our garden in April. I watered them every evening after school. After two weeks, small green plants came out of the ground. By August, the sunflowers were taller than my dad! Their big yellow flowers turned to the sun every day. In autumn we picked the seeds and ate them.",
  },
  {
    task: "Write about a time you have been in a storm.",
    model:
      "I have been in a big storm once. It was last summer, on a holiday by the sea. In the afternoon the sky became very dark. Then the wind started to blow hard, and it rained heavily. We ran back to the hotel. There was loud thunder and lightning all night, and the lights went out. In the morning the sun was shining again, and there were branches all over the beach.",
  },
  {
    task: "Write about a time you have watched the stars or the moon.",
    model:
      "I have watched the stars from the desert. Two years ago my family went on a trip to Inner Mongolia. We stayed in a tent far from the city. At night it was very dark, and the sky was full of stars. My dad showed me some planets. We even saw a shooting star! It was cold, so we drank hot milk. I have never seen so many stars.",
  },
  {
    task: "Write about a time you have visited a cave or a forest.",
    model:
      "I have visited a big cave once. Last winter we went to a famous cave in Guilin. A guide took us through it. Inside it was dark and wet, and the air was cool. There were strange rocks of every shape, with colored lights on them. One rock looked like an elephant! We walked for about an hour. I have never been in such a strange place.",
  },
  {
    task: "Write about a time you have seen a rainbow or a sunrise.",
    model:
      "I have seen a double rainbow once. It was last May, after a storm. My sister and I were looking out of the window. The rain stopped, and the sun came out. Suddenly we saw two rainbows above the hills. All the colors were very bright. We ran outside to take photos. A few minutes later the rainbows were gone. I have never seen one again.",
  },
  {
    task: "Write about something in nature that you have never done but want to do.",
    model:
      "I have never seen a whale, but I really want to. I have read many books about them. They are the biggest animals in the world, and they sing to each other. My uncle has seen whales near Iceland, and he showed me his photos. Someday I'm going to take a boat into the ocean to see them. I hope I will hear them sing.",
  },
];

const writingAboutAnExperience = judgedTopic({
  id: "writing-about-an-experience",
  title: t("Writing About an Experience", "写一次经历"),
  summary: t(
    "Write six to eight sentences about something you have done in nature: say that you have done it, then tell when and what happened.",
    "写六到八句话，讲你在大自然中做过的一件事：先说你做过，再讲是什么时候、发生了什么。",
  ),
  prerequisites: ["present-perfect-with-ever-and-never", "writing-about-your-weekend"],
  encompasses: [
    { topic: "present-perfect-with-ever-and-never", weight: 0.3 },
    { topic: "writing-about-your-weekend", weight: 0.3 },
  ],
  criteria: ["a2-present-perfect", "a2-past-simple", "a1-sentences"],
  point: {
    id: "experience",
    title: t("Have done, then what happened", "做过什么，然后发生了什么"),
    explanation: t(
      "Start with the present perfect to say that you have had the experience, at some time up to now: *I have seen a big waterfall once.*\n\nThen change to the past simple to tell when it was and what happened: *It was two years ago. We walked along a path. Suddenly we saw the waterfall.*\n\nDo not put a finished time like *two years ago* with the present perfect: *I saw it two years ago*, not *I have seen it two years ago*.",
      "先用现在完成时说你有过这样的经历：*I have seen a big waterfall once.*\n\n然后改用一般过去时讲是什么时候、发生了什么：*It was two years ago. We walked along a path. Suddenly we saw the waterfall.*\n\n现在完成时不能和 *two years ago* 这样明确的过去时间一起用：说 *I saw it two years ago*，不说 *I have seen it two years ago*。",
    ),
  },
  question: t(
    "Write six to eight sentences in English about the experience the task names: say that you have done it, then tell when and what happened.",
    "根据题目用英语写六到八句话：先说你做过这件事，再讲是什么时候、发生了什么。",
  ),
  bank: experienceBank,
  limits: { minWords: 45, maxChars: 900 },
  what: t("story", "记叙"),
});

/** topics are the topics of the unit The Natural World. */
export const topics: readonly TopicDef[] = [
  landscape.topic,
  weather2.topic,
  space.topic,
  plants.topic,
  littleWords3.topic,
  presentPerfectEverNever,
  writingAboutAnExperience,
];

/** vocabulary are the words the unit The Natural World teaches. */
export const vocabulary: readonly WordBatch[] = [landscape.batch, weather2.batch, space.batch, plants.batch, littleWords3.batch, been];
