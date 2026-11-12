// A2, unit 11: Festivals and Celebrations. Festivals, wishes, feelings and people together; verbs followed by to; an
// invitation and a reply judged by a model. Subordinating conjunctions, the unit's other grammar, already exist.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator, type WritingItem } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { everyPair, vocabularyTopic, word } from "../words.ts";
import { combos, fill, judgedTopic } from "./kit.ts";

const festivalWords = vocabularyTopic({
  id: "a2-words-festivals",
  title: t("Festivals", "节日"),
  summary: t(
    "Festivals and celebrating; traditions; lanterns, fireworks, parades and costumes; candles and decorating; weddings and anniversaries.",
    "节日和庆祝；传统；灯笼、烟花、游行和服装；蜡烛和装饰；婚礼和周年纪念日。",
  ),
  prerequisites: ["a1-words-parties"],
  words: [
    word(
      "festival festivals",
      "a special day or time when people celebrate something",
      "节日；节",
      "The Spring {Festival} is the most important holiday in China.|Parade Wedding | There's a music {festival} in the park this weekend.|candle anniversary | Every country has its own {festivals} and holidays.|candles lanterns",
      "parade tradition",
    ),
    word(
      "celebrate celebrates celebrated celebrating",
      "to do something special because of an important day or good news",
      "庆祝",
      "How do you {celebrate} New Year in your country?|decorate wrap | We {celebrated} Grandma's 80th birthday with a big dinner.|decorated wrapped | Let's {celebrate}! You passed the exam!|decorate welcome",
      "decorate welcome",
    ),
    word(
      "tradition traditions",
      "something people have done in the same way for a very long time",
      "传统",
      "It's a {tradition} to eat dumplings at New Year in the north of China.|costume parade | Every family has its own {traditions}.|costumes candles | Giving red envelopes is an old {tradition}.|costume lantern",
      "costume festival",
    ),
    word(
      "traditional",
      "done in the same way for a very long time; old in style",
      "传统的",
      "She wore a {traditional} dress at the wedding.|dear proud | We cooked a {traditional} dish for the festival.|proud dear | Dragon boat racing is a {traditional} sport.|nervous dear",
      "special proud",
    ),
    word(
      "lantern lanterns",
      "a light in a box or a paper ball, often hung up",
      "灯笼",
      "Red {lanterns} hang in the streets at New Year.|costumes parades | At the Lantern Festival children carry paper {lanterns}.|parades anniversaries | We hung a big red {lantern} over the door.|costume parade",
      "candle firework",
    ),
    word(
      "firework fireworks",
      "a thing that explodes in the sky with bright colors",
      "烟花",
      "We watched the {fireworks} light up the sky at midnight.|costumes candles | The {fireworks} were very loud. The dog was scared.|lanterns candles | You can't buy {fireworks} in the city center. They are dangerous.|costumes lanterns",
      "lantern candle",
    ),
    word(
      "parade parades",
      "a lot of people walking through the streets to celebrate, often with music",
      "游行",
      "Thousands of people watched the {parade}.|candle lantern | The band played music at the front of the {parade}.|candle anniversary | There's a {parade} through the town on National Day.|candle costume",
      "festival costume",
    ),
    word(
      "costume costumes",
      "special clothes that make you look like someone or something else",
      "戏服；装扮服装",
      "He wore a tiger {costume} to the party.|candle lantern | The dancers wore beautiful {costumes}.|candles parades | My mom made my {costume} for the school play.|candle anniversary",
      "uniform tradition",
    ),
    word(
      "candle candles",
      "a stick of wax with a string in it, which you burn for light",
      "蜡烛",
      "Blow out the {candles} on your birthday cake!|lanterns fireworks | There was no power, so we lit a {candle}.|costume parade | There are ten {candles} on the cake.|lanterns costumes",
      "lantern firework",
    ),
    word(
      "decorate decorates decorated decorating",
      "to make something look pretty for a special day",
      "装饰",
      "We {decorated} the classroom with paper flowers.|celebrated welcomed | Let's {decorate} the tree with lights.|celebrate welcome | They are {decorating} the hall for the wedding.|celebrating welcoming",
      "celebrate wrap",
    ),
    word(
      "wedding weddings",
      "the ceremony when two people get married",
      "婚礼",
      "My cousin's {wedding} is in June.|tradition costume | Everybody danced at the {wedding}.|tradition candle | They had a small {wedding} on the beach.|tradition candle",
      "anniversary festival",
    ),
    word(
      "anniversary anniversaries",
      "the same day as a special day in an earlier year",
      "周年纪念日",
      "My parents' wedding {anniversary} is on May 5th.|tradition costume | Today is the 100th {anniversary} of our school.|costume candle | We had dinner at a nice restaurant for our {anniversary}.|costume lantern",
      "birthday wedding",
    ),
  ],
});

const wishes = vocabularyTopic({
  id: "a2-words-wishes",
  title: t("Wishes and Invitations", "祝福和邀请"),
  summary: t(
    "Congratulations and welcome; invitations and envelopes; special days; wrapping a surprise; dear and luck; mooncakes; midnight.",
    "祝贺和欢迎；请柬和信封；特别的日子；包装惊喜；亲爱的和运气；月饼；午夜。",
  ),
  prerequisites: ["a2-words-festivals"],
  words: [
    word(
      "congratulations",
      "a word you say when someone has done something good",
      "祝贺；恭喜",
      "{Congratulations} on your new job!|Welcome Luck | You passed? {Congratulations}!|Welcome Dear | We sent our {congratulations} to the happy couple.|lucks midnights",
      "welcome luck",
    ),
    word(
      "welcome welcomes welcomed welcoming",
      "to say hello to a guest in a friendly way; a word you say to guests",
      "欢迎",
      "{Welcome} to our home!|Congratulations Dear | The children {welcomed} the new student to the class.|wrapped surprised | Thank you! — You're {welcome}.|special dear",
      "congratulations surprise",
    ),
    word(
      "invitation invitations",
      "a card or a message that asks you to come to a party or an event",
      "邀请；请柬",
      "Thanks for the {invitation}! I'd love to come.|envelope surprise | Did you get an {invitation} to Lucy's wedding?|envelope surprise | We sent sixty {invitations} for the party.|lucks midnights",
      "envelope surprise",
    ),
    word(
      "special",
      "different from usual, and better or more important",
      "特别的",
      "Today is a {special} day. It's my birthday!|dear midnight | We cook {special} food for the festival.|dear proud | You are very {special} to me.|midnight luck",
      "dear calm",
    ),
    word(
      "wrap wraps wrapped wrapping",
      "to cover something with paper, often a present",
      "包；包装",
      "Can you help me {wrap} this present?|welcome surprise | She {wrapped} the gift in red paper.|welcomed surprised | We spent the evening {wrapping} presents.|welcoming surprising",
      "welcome decorate",
    ),
    word(
      "surprise surprises",
      "something that you did not expect",
      "惊喜；意外",
      "Don't tell Mom about the party. It's a {surprise}!|invitation envelope | What a nice {surprise}! I didn't know you were coming.|invitation luck | Life is full of {surprises}.|invitations envelopes",
      "invitation luck",
    ),
    word(
      "dear",
      "a word at the start of a letter; loved very much",
      "亲爱的",
      "{Dear} Grandma, thank you for the lovely present.|Special Welcome | She is a very {dear} friend.|midnight luck | Oh {dear}! I've lost my keys.|luck special",
      "special welcome",
    ),
    word(
      "luck",
      "good things that happen by chance",
      "运气",
      "Good {luck} in your exam!|surprise welcome | I found ten yuan in the street. What {luck}!|welcome dear | Red is the color of good {luck} in China.|surprise welcome",
      "surprise welcome",
    ),
    word(
      "mooncake mooncakes",
      "a round cake that people eat at the Mid-Autumn Festival",
      "月饼",
      "We eat {mooncakes} at the Mid-Autumn Festival.|envelopes lanterns | This {mooncake} has an egg in the middle.|envelope lantern | Grandma gave us a box of {mooncakes}.|lucks welcomes",
      "envelope lantern",
    ),
    word(
      "envelope envelopes",
      "a paper cover that you put a letter in",
      "信封",
      "Put the letter in the {envelope} and write the address.|invitation surprise | At New Year, children get red {envelopes} with money in them.|invitations mooncakes | The {envelope} had no stamp on it.|mooncake candle",
      "invitation mooncake",
    ),
    word(
      "midnight",
      "twelve o'clock at night",
      "午夜；半夜十二点",
      "The fireworks start at {midnight}.|luck dear | We stayed up until {midnight} to see the New Year.|luck welcome | It's after {midnight}. Go to bed!|luck dear",
      "luck special",
    ),
  ],
});

const feelings2 = vocabularyTopic({
  id: "a2-words-feelings-2",
  title: t("More Feelings", "更多感受"),
  summary: t(
    "Excited and exciting; surprised, pleased and glad; nervous and calm; proud and cheerful; upset, embarrassed and jealous.",
    "兴奋的和令人兴奋的；惊讶、满意和高兴；紧张和平静；自豪和开朗；难过、尴尬和嫉妒。",
  ),
  prerequisites: ["a2-words-wishes", "a1-words-feelings"],
  words: [
    word(
      "excited",
      "very happy because something good is going to happen",
      "兴奋的",
      "The children were {excited} about the trip to the zoo.|exciting calm | I'm so {excited}! We're going to Disneyland tomorrow!|exciting calm | He was too {excited} to sleep the night before his birthday.|exciting calm",
      "exciting calm",
    ),
    word(
      "exciting",
      "making you feel excited",
      "令人兴奋的",
      "The football match was very {exciting}.|excited jealous | It's an {exciting} story about pirates.|excited embarrassed | Traveling to a new country is {exciting}.|excited jealous",
      "excited jealous",
    ),
    word(
      "surprised",
      "feeling something because you did not expect it",
      "惊讶的",
      "I was {surprised} to see Tom at the party. I thought he was in London.|calm jealous | I was {surprised} that the test was so easy.|jealous upset | We were {surprised} by the snow. It never snows here in May!|jealous proud",
      "jealous calm",
    ),
    word(
      "pleased",
      "happy about something",
      "高兴的；满意的",
      "I'm very {pleased} with my exam results.|nervous jealous | {Pleased} to meet you.|Nervous Jealous | The teacher was {pleased} with our work.|nervous embarrassed",
      "nervous jealous",
    ),
    word(
      "nervous",
      "a little afraid because something is going to happen",
      "紧张的",
      "I'm {nervous} about my job interview tomorrow.|proud cheerful | She was so {nervous} before the test that her hands were shaking.|proud calm | Don't be {nervous}. You'll do well.|proud glad",
      "proud calm",
    ),
    word(
      "proud prouder proudest",
      "happy about something you, or someone close to you, did well",
      "骄傲的；自豪的",
      "My parents were very {proud} of me when I won the prize.|nervous jealous | I'm {proud} of my team. They played well.|nervous jealous | It was the {proudest} day of my life.|jealousest nervousest",
      "nervous jealous",
    ),
    word(
      "glad",
      "happy and pleased",
      "高兴的",
      "I'm {glad} you could come.|jealous nervous | We were {glad} to be home after the long trip.|jealous embarrassed | I'm so {glad} it's Friday!|jealous upset",
      "jealous upset",
    ),
    word(
      "upset",
      "unhappy or worried because something bad happened",
      "难过的；不安的",
      "She was {upset} because she lost her ring.|proud cheerful | Don't be {upset}. It wasn't your fault.|proud glad | He got {upset} when his friends laughed at him.|proud calm",
      "proud cheerful",
    ),
    word(
      "embarrassed",
      "feeling silly because people saw you do something wrong",
      "尴尬的；难为情的",
      "I was so {embarrassed} when I fell over in front of the whole class.|proud calm | He felt {embarrassed} because he forgot her name.|proud cheerful | Don't be {embarrassed}. Everyone makes mistakes.|proud excited",
      "proud cheerful",
    ),
    word(
      "calm calmer calmest",
      "quiet and not worried or angry",
      "平静的；镇静的",
      "Stay {calm} and walk to the door.|nervous jealous | The sea was {calm} this morning, so we went sailing.|nervous embarrassed | She is always {calm}, even when things go wrong.|jealous embarrassed",
      "nervous upset",
    ),
    word(
      "cheerful",
      "happy and smiling",
      "快乐的；开朗的",
      "Our neighbor is a {cheerful} old man who always says hello.|jealous nervous | The room is painted in {cheerful} colors.|jealous nervous | She's always {cheerful} in the morning.|jealous embarrassed",
      "jealous nervous",
    ),
    word(
      "jealous",
      "unhappy because someone has something you want",
      "嫉妒的",
      "He was {jealous} of his brother's new bike.|cheerful calm | Don't be {jealous}. You'll get one too.|proud calm | My sister gets {jealous} when Mom plays with the baby.|proud glad",
      "proud cheerful",
    ),
  ],
});

const peopleTogether = vocabularyTopic({
  id: "a2-words-people-together",
  title: t("People Together", "人与人"),
  summary: t(
    "Hugs, kisses and waves; shaking hands; agreeing and arguing; friendship and jokes; introducing people; everybody; hosts.",
    "拥抱、亲吻和挥手；握手；同意和争吵；友谊和笑话；介绍别人；大家；主人。",
  ),
  prerequisites: ["a2-words-feelings-2"],
  words: [
    word(
      "hug hugs hugged hugging",
      "to put your arms around someone",
      "拥抱",
      "She {hugged} her mother at the airport.|argued agreed | Come here and give me a {hug}!|friendship argue | The two friends {hugged} each other.|argued agreed",
      "argue joke",
    ),
    word(
      "kiss kisses kissed kissing",
      "to touch someone with your lips",
      "吻；亲",
      "Grandma {kissed} me on the cheek.|waved agreed | Give Mom a {kiss} goodnight.|joke friendship | In some countries, people {kiss} when they meet.|introduce host",
      "wave argue",
    ),
    word(
      "wave waves waved waving",
      "to move your hand from side to side to say hello or goodbye; a line of water moving on the sea",
      "挥手；波浪",
      "She {waved} goodbye from the window of the train.|hugged argued | The children {waved} at the people in the parade.|agreed introduced | Big {waves} hit the boat.|jokes hugs",
      "hug shake",
    ),
    word(
      "shake shakes shook shaken shaking",
      "to move something quickly up and down or from side to side",
      "摇；握（手）",
      "When you meet someone, {shake} hands.|wave kiss | {Shake} the bottle before you open it.|Wave Hug | The ground {shook} during the earthquake.|waved argued",
      "wave hug",
    ),
    word(
      "agree agrees agreed agreeing",
      "to have the same idea as someone",
      "同意",
      "I {agree} with you. It's a great idea.|argue introduce | We all {agreed} to meet at six.|argued joked | My brother and I never {agree} about which film to watch.|introduce hug",
      "argue introduce",
    ),
    word(
      "argue argues argued arguing",
      "to talk angrily with someone because you have different ideas",
      "争吵；争论",
      "My parents sometimes {argue} about money.|hug introduce | Stop {arguing}, you two!|agreeing introducing | They {argued} all night, and now they aren't speaking.|agreed joked",
      "agree joke",
    ),
    word(
      "friendship friendships",
      "being friends",
      "友谊",
      "Their {friendship} started at primary school.|joke host | {Friendship} is more important than winning.|Joke Host | A good {friendship} needs time.|joke host",
      "joke host",
    ),
    word(
      "joke jokes",
      "something funny that you say to make people laugh",
      "笑话",
      "He told a funny {joke}, and everybody laughed.|friendship hug | Don't be angry. It was just a {joke}!|hug friendship | My dad knows lots of {jokes}.|hugs friendships",
      "friendship hug",
    ),
    word(
      "introduce introduces introduced introducing",
      "to tell people each other's names when they first meet",
      "介绍",
      "Let me {introduce} my friend Lisa.|agree argue | She {introduced} me to her parents.|agreed argued | Can you {introduce} yourself to the class?|agree host",
      "agree argue",
    ),
    word(
      "everybody",
      "every person",
      "每个人；大家",
      "{Everybody} loves a good story.|Host Friendship | Is {everybody} here? Let's start.|host joke | Say goodbye to {everybody}.|host friendship",
      "host friendship",
    ),
    word(
      "host hosts hosted hosting",
      "a person who has guests; to have guests or to hold an event",
      "主人；主办",
      "Our {host} cooked a wonderful dinner for us.|joke friendship | Which city will {host} the next Olympic Games?|hug introduce | Thank your {host} before you leave the party.|joke friendship",
      "guest joke",
    ),
  ],
});

// Verbs followed by to.

/** toVerbs are the start of a sentence with a verb that takes to. */
const toVerbs: readonly string[] = [
  "I want",
  "She hopes",
  "We decided",
  "They plan",
  "My brother needs",
  "Tom promised",
  "I'd like",
  "We agreed",
  "He refused",
];
/** toActions are a verb and the rest of an action. */
const toActions: readonly (readonly [string, string])[] = [
  ["visit", "Grandma at the weekend"],
  ["buy", "a new phone"],
  ["call", "the hotel"],
  ["make", "dumplings for the festival"],
  ["book", "the tickets"],
  ["clean", "the kitchen"],
  ["send", "the invitations"],
  ["learn", "the dragon dance"],
  ["watch", "the lantern parade"],
  ["help", "with the dinner"],
  ["paint", "the lanterns"],
  ["cook", "a big meal"],
];

const toChoiceBank: readonly ChoiceItem[] = everyPair(toVerbs, toActions).map(([start, [verb, rest]]): ChoiceItem => {
  const ing = verb === "make" ? "making" : `${verb}ing`;
  return [`${start} ___ ${rest}. (${verb})`, `to ${verb}`, [verb, ing]];
});

/** toSubjects are a subject and whether it takes a verb with -s. */
const toSubjects: readonly (readonly [string, boolean])[] = [
  ["She", true],
  ["I", false],
  ["My brother", true],
  ["We", false],
  ["Tom", true],
  ["They", false],
  ["My parents", false],
];
/** toVerbForms are a verb that takes to, its form with -s and its past, and whether the item is about the past. */
const toVerbForms: readonly (readonly [string, string, string, boolean])[] = [
  ["want", "wants", "wanted", false],
  ["decide", "decides", "decided", true],
  ["hope", "hopes", "hoped", false],
  ["promise", "promises", "promised", true],
  ["need", "needs", "needed", false],
];
const toRests: readonly string[] = [
  "visit the castle",
  "learn Japanese",
  "go to the festival",
  "stay at home",
  "see the fireworks",
  "help Grandma",
  "find a new job",
  "travel by train",
  "watch the parade",
  "buy some mooncakes",
  "move to the city",
];

// Seven subjects, five verbs and eleven actions have no common factor, so 385 rows give every combination once.
const toTypedBank: readonly TypedItem[] = combos(385, toSubjects, toVerbForms, toRests).map(
  ([[subject, s], [verb, third, past, isPast], rest]): TypedItem => {
    if (isPast) {
      return {
        shown: `${subject} / ${verb} / ${rest} / yesterday`,
        accepted: [
          `${subject} ${past} to ${rest} yesterday.`,
          `Yesterday ${subject === "I" || subject === "Tom" ? subject : subject.charAt(0).toLowerCase() + subject.slice(1)} ${past} to ${rest}.`,
        ],
        canonical: `${subject} ${past} to ${rest} yesterday.`,
        wrong: [`${subject} ${past} ${rest} yesterday.`, `${subject} ${verb} to ${rest} yesterday.`],
      };
    }
    const form = s ? third : verb;
    return {
      shown: `${subject} / ${verb} / ${rest}`,
      accepted: [`${subject} ${form} to ${rest}.`],
      wrong: [`${subject} ${s ? verb : third} to ${rest}.`, `${subject} ${form} ${rest}.`],
    };
  },
);

/** toVerbIn is the verb that takes to at the start of a sentence, as its learner would look it up. */
const toVerbIn = (sentence: string): string => {
  const start = toVerbs.find((v) => sentence.startsWith(v)) ?? "";
  return start.endsWith("'d like") ? "would like" : (start.split(" ").pop() ?? "");
};

/** whyNotTo explains a verb after want, hope or decide without to, or with -ing. */
const whyNotTo = (wrong: string, right: string, shown: string, position: number): Text => {
  const verb = toVerbIn(shown);
  return position === 0
    ? t(
        `*${wrong}* leaves out *to*. After *${verb}*, English puts *to* before the next verb: *${right}*.`,
        `*${wrong}* 漏了 *to*。在 *${verb}* 后面，下一个动词前要加 *to*：*${right}*。`,
      )
    : t(
        `*${wrong}* is the *-ing* form. *${verb}* takes *to* and the first form, not *-ing*: *${right}*.`,
        `*${wrong}* 是 *-ing* 形式。*${verb}* 后面接 *to* 加原形，不接 *-ing*：*${right}*。`,
      );
};

/** firstToVerb is the first verb of a written sentence, in the form it takes there. */
const firstToVerb = (sentence: string): string => {
  const forms = toVerbForms.flatMap(([verb, third, past]) => [third, past, verb]);
  return forms.find((form) => new RegExp(`\\b${form}\\b`, "u").test(sentence)) ?? "";
};

const verbsFollowedByTo: TopicDef = {
  id: "verbs-followed-by-to",
  title: t("Want To, Decide To", "want to、decide to：动词后接 to"),
  summary: t(
    "I want to go. She decided to stay. We hope to see you. Some verbs take to and the first form of another verb after them.",
    "I want to go. She decided to stay. We hope to see you. 有些动词后面接 to 加另一个动词的原形。",
  ),
  prerequisites: ["present-simple", "a2-words-events"],
  encompasses: [
    { topic: "present-simple", weight: 0.2 },
    { topic: "a2-words-events", weight: 0.1 },
  ],
  xp: 20,
  strand: "grammar",
  knowledgePoints: [
    point(
      "form",
      t("To and the verb", "to 加动词"),
      t(
        "After *want*, *would like*, *hope*, *decide*, *plan*, *need*, *promise*, *agree* and *refuse*, use *to* and the first form of the next verb:\n\n- *I want to buy a new phone.*\n- *We decided to stay at home.*\n- *He refused to clean the kitchen.*\n\nDo not leave out *to*: not *I want buy*. Do not add *-ing*: not *We decided staying*.",
        "在 *want*、*would like*、*hope*、*decide*、*plan*、*need*、*promise*、*agree* 和 *refuse* 后面，用 *to* 加下一个动词的原形：\n\n- *I want to buy a new phone.*\n- *We decided to stay at home.*\n- *He refused to clean the kitchen.*\n\n中文说“我想买”，两个动词直接连在一起，英语中间要加 *to*：不说 *I want buy*，也不说 *We decided staying*。",
      ),
      choiceGenerator(
        t("Choose the words for the gap.", "选出填入空白处的词。"),
        toChoiceBank,
        (right, shown) => {
          const verb = toVerbIn(shown);
          return t(
            `*${verb}* is one of the verbs that take *to* and the first form of the next verb: ${fill(shown, right)}`,
            `*${verb}* 属于后面接 *to* 加下一个动词原形的动词：${fill(shown, right)}`,
          );
        },
        whyNotTo,
      ),
    ),
    point(
      "write",
      t("Writing with want to and decided to", "用 want to 和 decided to 写句子"),
      t(
        "Write the sentence from the note. The first verb changes: *-s* after *he*, *she* and one person (*She wants*), *-ed* for the past (*We decided*). The second verb never changes: *to* and its first form.\n\n*She wants to visit the castle. They decided to stay at home yesterday.*",
        "根据笔记写句子。第一个动词要变：*he*、*she* 和单个人后面加 *-s*（*She wants*），过去的事加 *-ed*（*We decided*）。第二个动词永远不变：*to* 加原形。\n\n*She wants to visit the castle. They decided to stay at home yesterday.*",
      ),
      typedGenerator("sentence", t("Write a sentence from the note.", "根据笔记写一个句子。"), toTypedBank, (right) => {
        const first = firstToVerb(right);
        const how = right.includes("yesterday")
          ? t("takes *-ed* for the past", "因为是过去的事，加 *-ed*")
          : first.endsWith("s")
            ? t("takes *-s* after one person", "单个人作主语时加 *-s*")
            : t("stays plain after this subject", "在这个主语后面用原形");
        return t(
          `The first verb ${how.en} (*${first}*), and the second is always *to* with its first form: ${right}`,
          `第一个动词${how["zh-CN"]}（*${first}*），第二个动词总是 *to* 加原形：${right}`,
        );
      }),
    ),
  ],
};

// An invitation and a reply.

const invitationBank: readonly WritingItem[] = [
  {
    task: "Write an invitation to your birthday party.",
    model:
      "Dear Sam,\n\nI'm having a birthday party next Saturday, June 12th, and I'd like you to come! It's at my house, 25 Green Street, from three o'clock to six. We are going to play games in the garden and have a big cake. My mom will make pizza too. Please tell me by Thursday if you can come.\n\nSee you soon,\nLily",
  },
  {
    task: "Write an invitation to a picnic in the park.",
    model:
      "Hi everybody,\n\nLet's have a picnic in People's Park this Sunday! We can meet at the main gate at eleven o'clock. Please bring some food or drinks to share. I'll bring a big blanket and a ball, so we can play football after lunch. If it rains, we'll go to my house instead. Can you come?\n\nTom",
  },
  {
    task: "Write an invitation to a Mid-Autumn Festival dinner at your home.",
    model:
      "Dear Mr. and Mrs. Brown,\n\nWe would like to invite you to dinner at our home for the Mid-Autumn Festival. It's on Friday, September 17th, at seven o'clock. We live in Flat 8, Building 3, on River Road. My parents are going to cook a traditional dinner, and after that we will eat mooncakes and look at the full moon. We hope you can come.\n\nBest wishes,\nWang Lei",
  },
  {
    task: "Write an invitation to your school concert.",
    model:
      "Dear Grandma and Grandpa,\n\nOur school is having a concert next Friday evening, and I'm going to play the piano! It starts at half past six in the school hall. The concert is free, and there will be drinks and snacks after it. Mom will pick you up at six. I really want you to be there. Please come!\n\nLove,\nMia",
  },
  {
    task: "Write an invitation to a film night at your home.",
    model:
      "Hi Jack,\n\nDo you want to come to a film night at my house on Saturday? A few friends from our class are coming too. We're going to watch the new space film and eat lots of popcorn. Come at about seven o'clock. My address is 14 Park Road, near the supermarket. Let me know if you can come!\n\nCheers,\nDavid",
  },
  {
    task: "Write an invitation to your sister's wedding for a friend of the family.",
    model:
      "Dear Mrs. Chen,\n\nMy sister Anna is getting married, and our family would like to invite you to her wedding. It is on Saturday, October 2nd, at the Garden Hotel on Lake Street. The wedding starts at eleven o'clock, and lunch will follow. Please reply by September 15th so we know how many guests are coming.\n\nBest wishes,\nThe Li family",
  },
  {
    task: "Reply to the invitation and say yes.",
    source: "Hi! I'm having a barbecue in my garden on Sunday at four o'clock. There will be music and lots of food. Can you come? Mark",
    model:
      "Hi Mark,\n\nThanks for the invitation! Yes, I'd love to come to your barbecue on Sunday. I'll be there at four. Can I bring something? I can make a fruit salad or bring some drinks. Is it OK if my brother comes too? He loves barbecues! See you on Sunday.\n\nBest,\nPeter",
  },
  {
    task: "Reply to the invitation and say no, with a reason.",
    source:
      "Dear friend, we are having a party for our grandparents' 50th wedding anniversary on Saturday evening at the Rose Restaurant. We would love you to come! Ella",
    model:
      "Dear Ella,\n\nThank you very much for the invitation. Fifty years is wonderful! I'm really sorry, but I can't come on Saturday evening. My family is going to visit my aunt in another city that weekend, and we're leaving on Friday. Please say congratulations to your grandparents from me. I hope you have a lovely party.\n\nLove,\nSophie",
  },
  {
    task: "Reply to the invitation and say yes.",
    source:
      "Hello! Our class is going to watch the Lantern Festival parade together on Tuesday evening. We will meet at the school gate at six. Do you want to come with us? Ms. Lin",
    model:
      "Dear Ms. Lin,\n\nThank you for asking me. Yes, I would like to come to the parade with the class on Tuesday. I will meet you at the school gate at six o'clock. Should I bring a lantern? My grandfather made me a beautiful red one, and I would like to carry it. I'm very excited!\n\nBest wishes,\nZhou Jie",
  },
  {
    task: "Reply to the invitation and say no, with a reason.",
    source:
      "Hi! Do you want to come to the beach with my family on Saturday? We're leaving at eight in the morning and coming back in the evening. Zoe",
    model:
      "Hi Zoe,\n\nThanks so much for asking me! I'd really love to come, but I can't this Saturday. I have a big math exam on Monday, and I need to study all weekend. My parents won't let me go out. Maybe we can go to the beach together next month, after the exams? Have a great time!\n\nLove,\nAmy",
  },
  {
    task: "Reply to the invitation and say yes.",
    source:
      "Dear neighbor, we are having a small party on the first floor to welcome the new families in our building. It's on Friday at seven. Everybody is welcome! The Wus",
    model:
      "Dear Mr. and Mrs. Wu,\n\nThank you for your kind invitation. My husband and I would be glad to come to the party on Friday at seven. It's a lovely idea to welcome the new families. We will bring some homemade cookies. We look forward to meeting everybody.\n\nBest wishes,\nMaria Garcia, Flat 4B",
  },
  {
    task: "Reply to the invitation and say no, with a reason.",
    source: "Hi! I've got two tickets for the football final next Wednesday evening. Would you like to come with me? Ben",
    model:
      "Hi Ben,\n\nWow, tickets for the final! Thank you for thinking of me. I'm so sorry, but I can't come on Wednesday evening. It's my mom's birthday, and we are having dinner at a restaurant with the whole family. Why don't you ask Tom? He loves football too. Tell me all about the match on Thursday!\n\nSee you,\nLeo",
  },
];

const writingAnInvitationAndAReply = judgedTopic({
  id: "writing-an-invitation-and-a-reply",
  title: t("Writing an Invitation and a Reply", "写邀请和回复"),
  summary: t(
    "Write an invitation that says what, when and where, or a reply that says yes, or says no with a reason.",
    "写一份邀请，说明是什么活动、什么时间、在哪里；或者写一封回复，接受邀请，或者说明理由并拒绝。",
  ),
  prerequisites: ["writing-a-short-note", "will-for-the-future"],
  encompasses: [
    { topic: "writing-a-short-note", weight: 0.3 },
    { topic: "will-for-the-future", weight: 0.2 },
  ],
  criteria: ["a2-invitation-details", "a1-reader-and-name", "a1-sentences"],
  point: {
    id: "invitation",
    title: t("What, when and where; yes or no", "什么、何时、何地；接受还是拒绝"),
    explanation: t(
      "**An invitation** says what the event is, when it is and where it is: *I'm having a birthday party next Saturday at my house, from three to six.* Then ask: *Can you come?*\n\n**A reply** thanks the writer first: *Thanks for the invitation!* Then say yes (*I'd love to come*) or no with a reason (*I'm sorry, but I can't come. We're visiting my aunt that weekend.*)",
      "**邀请**要说明是什么活动、什么时间、在哪里：*I'm having a birthday party next Saturday at my house, from three to six.* 然后问：*Can you come?*\n\n**回复**先感谢对方：*Thanks for the invitation!* 然后接受（*I'd love to come*），或者说明理由并拒绝（*I'm sorry, but I can't come. We're visiting my aunt that weekend.*）。直接说 *No, I can't* 不够礼貌，要加上 *sorry* 和理由。",
    ),
  },
  question: t(
    "Write five to eight sentences in English: the invitation or the reply the task asks for.",
    "根据题目用英语写五到八句话：写一份邀请或一封回复。",
  ),
  bank: invitationBank,
  limits: { minWords: 40, maxChars: 900 },
  what: t("text", "文字"),
});

/** topics are the topics of the unit Festivals and Celebrations. */
export const topics: readonly TopicDef[] = [
  festivalWords.topic,
  wishes.topic,
  feelings2.topic,
  peopleTogether.topic,
  verbsFollowedByTo,
  writingAnInvitationAndAReply,
];

/** vocabulary are the words the unit Festivals and Celebrations teaches. */
export const vocabulary: readonly WordBatch[] = [festivalWords.batch, wishes.batch, feelings2.batch, peopleTogether.batch];
