// A2, unit 1: Last Weekend. Words for the past, relatives, events and the weekend; the past simple of regular and
// irregular verbs with did and didn't; sentences in the past judged by rules, and a weekend judged by a model.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator, type WritingItem } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { vocabularyTopic, word } from "../words.ts";
import { combos, fill, judgedTopic } from "./kit.ts";

const pastTime = vocabularyTopic({
  id: "a2-words-past-time",
  title: t("Words for the Past", "表示过去的词"),
  summary: t(
    "Yesterday, ago, once, recently, soon, suddenly, finally, during, while and until.",
    "yesterday、ago、once、recently、soon、suddenly、finally、during、while 和 until。",
  ),
  prerequisites: ["a1-words-time"],
  words: [
    word(
      "yesterday",
      "the day before today",
      "昨天",
      "I saw Tom {yesterday}.|tomorrow ago | {Yesterday} was Sunday, so today is Monday.|Tomorrow Soon | Where were you {yesterday} afternoon?|tomorrow soon",
      "tomorrow ago",
    ),
    word(
      "ago",
      "back in time from now, after a number of days or years",
      "以前",
      "We moved here two years {ago}.|until during | I had lunch an hour {ago}.|until soon | My grandpa was born a long time {ago}.|until while",
      "until soon",
    ),
    word(
      "once",
      "one time; at one time in the past",
      "一次；曾经",
      "I went to Beijing {once}, when I was six.|ago until | We eat out {once} a week.|ago during | {Once}, a man lived in a small house by the sea.|Ago Until",
      "ago until",
      "recently",
    ),
    word(
      "recently",
      "not long ago",
      "最近",
      "Have you seen any good films {recently}?|soon tomorrow | We {recently} moved to a new flat.|tomorrow ago | My aunt got married {recently}, in May.|tomorrow until",
      "tomorrow soon",
    ),
    word(
      "soon",
      "in a short time from now",
      "很快；不久",
      "Hurry up! The bus will come {soon}.|ago yesterday | See you {soon}!|ago yesterday | It will be dark {soon}, so let's go home.|ago yesterday",
      "ago yesterday",
    ),
    word(
      "suddenly",
      "quickly, when you do not expect it",
      "突然",
      "We were walking home when {suddenly} it started to rain.|once ago | The lights went out {suddenly}.|ago until | The dog {suddenly} ran into the road.|ago until",
      "ago until",
    ),
    word(
      "finally",
      "at the end, after a long time",
      "终于；最后",
      "We waited an hour, and the bus {finally} came.|ago until | After three tries, she {finally} passed the test.|ago until | {Finally}, we got home at midnight.|Ago Until",
      "ago during",
    ),
    word(
      "during",
      "in the time of something",
      "在……期间",
      "Don't talk {during} the test.|while ago | I fell asleep {during} the film.|while until | We stayed inside {during} the rain.|while ago",
      "while ago",
      "while",
    ),
    word(
      "while",
      "in the time that something else is happening",
      "当……的时候",
      "I listen to music {while} I cook.|during ago | Someone called {while} you were out.|during ago | Please wait here {while} I buy the tickets.|during ago",
      "during ago",
    ),
    word(
      "until",
      "up to the time when",
      "直到",
      "Wait here {until} I come back.|during ago | The shop is open {until} nine o'clock.|during ago | We played {until} it got dark.|during ago",
      "during ago",
    ),
  ],
});

const relatives = vocabularyTopic({
  id: "a2-words-relatives",
  title: t("Relatives", "亲戚"),
  summary: t(
    "Uncles, aunts, cousins, parents, grandparents, sons, daughters, husbands and wives, and being married or born.",
    "叔叔阿姨、堂表兄弟姐妹、父母、祖父母、儿子、女儿、丈夫和妻子，以及结婚和出生。",
  ),
  prerequisites: ["pre-a1-words-family"],
  words: [
    word(
      "uncle uncles",
      "the brother of your mother or father",
      "叔叔；舅舅；伯伯",
      "My mom's brother is my {uncle}.|aunt cousin | {Uncle} Jack lives on a farm, and he has a lot of cows.|Aunt Daughter | My {uncle} and his wife have two children.|aunt daughter",
      "aunt cousin",
    ),
    word(
      "aunt aunts",
      "the sister of your mother or father",
      "阿姨；姑姑",
      "My dad's sister is my {aunt}.|uncle son | {Aunt} Mary gave me a dress for my birthday.|Uncle Son | My {aunt} and her husband live in Shanghai.|uncle son",
      "uncle son",
    ),
    word(
      "cousin cousins",
      "a child of your uncle or aunt",
      "堂兄弟姐妹；表兄弟姐妹",
      "My uncle's son is my {cousin}.|aunt husband | Lily and I are {cousins}: our mothers are sisters.|aunts husbands | My {cousin} Tom is my age. His mother is my aunt.|uncle husband",
      "aunt husband",
    ),
    word(
      "parent parents",
      "a mother or a father",
      "父亲或母亲",
      "Your mother and father are your {parents}.|cousins grandparents | Kids, ask your {parents} before you go out.|husbands wives | Each child has two {parents}: a mother and a father.|cousins sons",
      "cousin son",
    ),
    word(
      "grandparent grandparents",
      "the mother or father of your mother or father",
      "祖父母；外祖父母",
      "My mom's parents are my {grandparents}.|cousins uncles | Grandma and Grandpa are my {grandparents}.|parents cousins | My {grandparents} are seventy years old, and they have six grandchildren.|cousins sons",
      "cousin uncle",
    ),
    word(
      "son sons",
      "a boy or man, when you talk about his mother or father",
      "儿子",
      "Mr. and Mrs. Wang have a {son} and a daughter.|husband aunt | Tom is Mrs. Green's {son}.|daughter wife | Their {son} is ten, and he likes football.|daughter wife",
      "daughter wife",
    ),
    word(
      "daughter daughters",
      "a girl or woman, when you talk about her mother or father",
      "女儿",
      "Lily is Mr. Li's {daughter}.|son husband | They have one {daughter}. She is a doctor.|son husband | My {daughter} is five, and she goes to school now. She loves it.|son husband",
      "son husband",
    ),
    word(
      "husband husbands",
      "the man a woman is married to",
      "丈夫",
      "Mrs. Brown's {husband} is a doctor. He works at the hospital.|wife daughter | She met her {husband} at university, and they got married in 2010.|daughter son | Ann is Tom's wife, and Tom is Ann's {husband}.|wife son",
      "wife daughter",
    ),
    word(
      "wife wives",
      "the woman a man is married to",
      "妻子",
      "Mr. Smith and his {wife} have two sons.|husband daughter | Tom is Ann's husband, and Ann is Tom's {wife}.|husband son | My uncle's {wife} is my aunt.|husband son",
      "husband son",
    ),
    word(
      "relative relatives",
      "a person in your family",
      "亲戚",
      "Uncles, aunts and cousins are all {relatives}.|parents sons | Is she your sister? — No, but she is a {relative}: she's my mom's cousin.|son husband | We have {relatives} in Canada, so we visit them every summer.|husbands wives",
      "parent son",
    ),
    word(
      "married",
      "having a husband or a wife",
      "已婚的",
      "My sister got {married} last year.|born relative | Are you {married}? — Yes, this is my husband.|born relative | My uncle is not {married}. He lives alone.|born relative",
      "born relative",
    ),
    word(
      "born",
      "come into the world as a baby",
      "出生",
      "The baby was {born} last night.|married relative | My cat was {born} in May, so she is very young.|married relative | My little brother was {born} three days ago, and he's very small.|married relative",
      "married relative",
    ),
  ],
});

const events = vocabularyTopic({
  id: "a2-words-events",
  title: t("Things That Happen", "发生的事"),
  summary: t(
    "Happen, plan, decide, forget, remember, lose, win, break, catch, drop and hurry, and events.",
    "happen、plan、decide、forget、remember、lose、win、break、catch、drop、hurry 和 event。",
  ),
  prerequisites: ["a2-words-past-time"],
  words: [
    word(
      "happen happens happened happening",
      "to take place",
      "发生",
      "What {happened}? Why are you crying?|decided planned | The story {happened} a long time ago.|decided forgot | Strange things {happen} in this house.|decide remember",
      "decide plan",
    ),
    word(
      "event events",
      "something important or interesting that happens",
      "事件；活动",
      "The school sports day is a big {event}.|hurry drop | The festival is the biggest {event} of the year in our town.|hurry drop | There are many {events} at the library this month, like talks and games.|hurries drops",
      "hurry drop",
    ),
    word(
      "plan plans planned planning",
      "to think about what you will do and how; an idea of what you will do",
      "计划",
      "We {planned} a picnic for Saturday.|happened hurried | What are your {plans} for the summer?|drops hurries | Let's {plan} our trip together.|happen hurry",
      "happen hurry",
    ),
    word(
      "decide decides decided deciding",
      "to choose what to do after thinking",
      "决定",
      "We {decided} to go to the beach.|happened dropped | I can't {decide} which dress to buy.|happen drop | She {decided} to learn the piano.|happened dropped",
      "happen drop",
    ),
    word(
      "forget forgets forgot forgotten forgetting",
      "to not remember",
      "忘记",
      "I {forgot} my keys, so I couldn't open the door.|remembered won | Don't {forget} your umbrella. It's raining!|remember win | Sorry, I {forgot} your birthday!|remembered won",
      "remember win",
    ),
    word(
      "remember remembers remembered remembering",
      "to keep in your mind; to bring back to your mind",
      "记得；想起",
      "Do you {remember} my name? We met last year.|forget lose | I {remember} my first day at school very well.|forget lose | {Remember} to close the window!|Forget Lose",
      "forget lose",
    ),
    word(
      "lose loses lost losing",
      "to not have something any more; to not win",
      "丢失；输",
      "I {lost} my bag on the bus.|won hurried | Our team {lost} the game, 0 to 3.|won dropped | Don't {lose} your ticket!|win catch",
      "win catch",
    ),
    word(
      "win wins won winning",
      "to be first or best in a game or race",
      "赢",
      "Who {won} the race?|broke dropped | Our team {won} the game, 3 to 0.|lost dropped | I hope we {win} tomorrow!|lose break",
      "lose break",
    ),
    word(
      "break breaks broke broken breaking",
      "to make something go into pieces or stop working",
      "打破；弄坏",
      "Be careful! Don't {break} the glass.|win happen | My phone is {broken}. It doesn't work.|caught won | He fell and {broke} his arm.|caught won",
      "catch win",
    ),
    word(
      "catch catches caught catching",
      "to take and hold something that is moving; to get on a bus or train",
      "接住；赶上",
      "{Catch} the ball!|Win Happen | We {caught} the last bus home.|won broke | The cat {caught} a mouse.|won forgot",
      "win break",
    ),
    word(
      "drop drops dropped dropping",
      "to let something fall",
      "掉下；使落下",
      "I {dropped} my phone, and now the screen is broken.|caught won | Don't {drop} the eggs!|win happen | She {dropped} her ice cream on the floor.|caught won",
      "catch win",
    ),
    word(
      "hurry hurries hurried hurrying",
      "to do something or go somewhere quickly",
      "赶快；匆忙",
      "{Hurry} up! The bus is coming!|Drop Happen | We {hurried} to the station.|dropped decided | There's lots of time. Don't {hurry}.|drop happen",
      "drop happen",
    ),
  ],
});

const weekend = vocabularyTopic({
  id: "a2-words-weekend",
  title: t("The Weekend", "周末"),
  summary: t(
    "Relaxing, resting, spending time, picnics, camping, hiking and galleries, and being bored or interested.",
    "放松、休息、度过时光、野餐、露营、徒步和美术馆，以及无聊和有趣。",
  ),
  prerequisites: ["a2-words-events"],
  words: [
    word(
      "relax relaxes relaxed relaxing",
      "to rest and not worry",
      "放松",
      "On Sunday I {relax} at home and read.|camp hike | Take a deep breath and {relax}.|camp hike | We {relaxed} by the pool all afternoon.|hiked spent",
      "camp hike",
      "rest",
    ),
    word(
      "spend spends spent spending",
      "to use time or money",
      "度过；花费",
      "We {spent} the weekend at Grandma's.|relaxed rested | How much money did you {spend}?|relax rest | I {spend} an hour on my homework every day.|relax rest",
      "relax rest",
    ),
    word(
      "rest rests rested resting",
      "to stop working and relax; time when you do this",
      "休息",
      "You look tired. Sit down and {rest}.|spend camp | Let's stop and have a {rest}.|tent crowd | After the long walk, we {rested} under a tree.|spent bored",
      "spend camp",
      "relax",
    ),
    word(
      "picnic picnics",
      "a meal you eat outside, often in a park",
      "野餐",
      "We had a {picnic} by the river.|tent gallery | Let's take some sandwiches and have a {picnic}!|crowd tent | It rained, so we had our {picnic} in the car.|gallery crowd",
      "tent gallery",
    ),
    word(
      "camp camps camped camping",
      "to sleep outside in a tent",
      "露营",
      "We {camped} in the mountains and slept in a tent.|spent happened | Do you like {camping}?|spending happening | Last summer we went {camping} in the forest.|spending happening",
      "spend rest",
    ),
    word(
      "tent tents",
      "a small house of cloth that you sleep in outside",
      "帐篷",
      "We slept in a {tent} by the lake.|picnic gallery | Our {tent} is big enough for four people.|picnic crowd | It rained all night, but we were dry in the {tent}.|picnic crowd",
      "picnic gallery",
    ),
    word(
      "hike hikes hiked hiking",
      "to go for a long walk in the country or the mountains; a walk like this",
      "徒步旅行",
      "We {hiked} up the mountain.|relaxed spent | Wear good shoes for the {hike}.|picnic gallery | Do you like {hiking}? — Yes, I walk in the hills every weekend.|gallery crowd",
      "rest spend",
    ),
    word(
      "gallery galleries",
      "a building where you can look at paintings and other art",
      "美术馆；画廊",
      "We saw some famous paintings at the {gallery}.|tent crowd | The {gallery} is open from ten to five.|tent picnic | There are many art {galleries} in Paris.|tents crowds",
      "tent crowd",
    ),
    word(
      "crowd crowds",
      "a lot of people together in one place",
      "人群",
      "There was a big {crowd} at the football game.|gallery tent | We couldn't see the singer because of the {crowd}.|tent picnic | {Crowds} of people come to the beach in summer.|Tents Galleries",
      "gallery tent",
    ),
    word(
      "bored",
      "not interested; feeling there is nothing to do",
      "感到无聊的",
      "I'm {bored}. There's nothing to do!|boring interesting | The children were {bored} in the long meeting.|boring interesting | Are you {bored}? Let's play a game.|boring interesting",
      "boring interesting",
    ),
    word(
      "boring",
      "not interesting",
      "无聊的；乏味的",
      "This film is {boring}. Let's watch another one.|bored interesting | The lesson was so {boring} that I fell asleep.|bored interesting | I don't like {boring} books.|bored interesting",
      "bored interesting",
    ),
    word(
      "interesting",
      "making you want to know more",
      "有趣的",
      "This book is very {interesting}. I can't stop reading it.|boring bored | The museum was {interesting}, and we learned a lot.|boring bored | What an {interesting} idea!|boring bored",
      "boring bored",
    ),
  ],
});

const useful = vocabularyTopic({
  id: "a2-words-useful-words",
  title: t("Useful Words", "常用词"),
  summary: t(
    "Important, reason, moment, follow, possible and impossible, able, whole, side, sentence, example and difference.",
    "important、reason、moment、follow、possible 和 impossible、able、whole、side、sentence、example 和 difference。",
  ),
  prerequisites: ["a2-words-weekend"],
  words: [
    word(
      "important",
      "that matters a lot",
      "重要的",
      "It's {important} to drink water every day.|whole able | This is an {important} test, so study hard.|whole able | Sleep is very {important} for children.|whole able",
      "whole able",
    ),
    word(
      "reason reasons",
      "why something happens or why you do something",
      "原因；理由",
      "What's the {reason} for your call?|side moment | Tell me the {reason} you were late.|side difference | There's no {reason} to be scared.|side example",
      "side moment",
    ),
    word(
      "moment moments",
      "a very short time",
      "片刻；时刻",
      "Wait a {moment}, please.|reason side | At that {moment}, the phone rang.|reason example | I'm busy at the {moment}. Can I call you later?|reason side",
      "reason side",
    ),
    word(
      "follow follows followed following",
      "to go after someone or something; to do what something says",
      "跟随；遵循",
      "{Follow} me. I'll show you the way.|Able Side | The dog {followed} us home.|remembered decided | Please {follow} the rules of the game.|happen drop",
      "able side",
    ),
    word(
      "possible",
      "that can happen or be done",
      "可能的",
      "Is it {possible} to swim here?|able whole | Come as soon as {possible}.|able whole | It's {possible} that it will rain later.|able whole",
      "able whole",
    ),
    word(
      "impossible",
      "that cannot happen or be done",
      "不可能的",
      "It's {impossible} to see the stars tonight. There are too many clouds.|possible able | I can't do this puzzle. It's {impossible}!|possible able | It's {impossible} to run 100 km in an hour.|possible important",
      "possible able",
    ),
    word(
      "able",
      "can do something",
      "能够",
      "Will you be {able} to come to my party?|possible important | She was {able} to swim when she was four.|possible important | I wasn't {able} to sleep because of the noise.|possible whole",
      "possible important",
    ),
    word(
      "whole",
      "all of something",
      "整个的",
      "I ate the {whole} cake by myself!|able important | We stayed at home the {whole} day.|able possible | The {whole} class went to the zoo.|able possible",
      "able possible",
    ),
    word(
      "side sides",
      "the left or right part of something; one of the flat parts of something",
      "边；侧面",
      "Drive on the right {side} of the road.|reason moment | A box has six {sides}.|reasons moments | Come and sit by my {side}.|reason example",
      "reason moment",
    ),
    word(
      "sentence sentences",
      "a group of words that starts with a capital letter and ends with a period",
      "句子",
      "Write a {sentence} with the word 'happy'.|difference reason | This {sentence} has five words.|reason moment | Start every {sentence} with a capital letter.|example reason",
      "example reason",
    ),
    word(
      "example examples",
      "something that shows what other things of its kind are like",
      "例子",
      "Can you give me an {example}?|sentence reason | Apples and pears, for {example}, are fruits.|sentence difference | Look at the {example} first, then do the rest.|difference reason",
      "sentence reason",
    ),
    word(
      "difference differences",
      "the way two things are not the same",
      "差别；不同",
      "What's the {difference} between a lake and a sea?|reason example | I can't see any {difference} between the two pictures.|reason sentence | There's a big {difference} in age between me and my cousin.|reason example",
      "reason example",
    ),
  ],
});

// The past simple of regular verbs.

/** regulars are a verb, its past form, the rest of a sentence and a likely misspelling of the past. */
const regulars: readonly (readonly [verb: string, past: string, rest: string, misspelt: string])[] = [
  ["play", "played", "football in the park", "plaied"],
  ["visit", "visited", "our grandparents", "visitted"],
  ["stop", "stopped", "at a cafe", "stoped"],
  ["study", "studied", "for the English test", "studyed"],
  ["dance", "danced", "in the school show", "danceed"],
  ["watch", "watched", "a film at home", "watchd"],
  ["carry", "carried", "the bags to the car", "carryed"],
  ["plan", "planned", "a picnic by the river", "planed"],
  ["cook", "cooked", "noodles for the family", "cookd"],
  ["hurry", "hurried", "to the station", "hurryed"],
  ["clean", "cleaned", "the kitchen", "cleant"],
  ["arrive", "arrived", "home at six", "arriveed"],
  ["walk", "walked", "to the lake", "walkt"],
  ["drop", "dropped", "a glass in the kitchen", "droped"],
  ["stay", "stayed", "at home all day", "staied"],
  ["help", "helped", "Grandma in the garden", "helpt"],
  ["try", "tried", "a new game", "tryed"],
];

const pastSubjects: readonly string[] = ["I", "We", "Tom", "My parents", "Lily", "They", "She", "My cousin", "He", "Ben", "Anna"];
const pastTimes: readonly string[] = ["Yesterday", "Last Saturday", "Last night", "Two days ago", "On Sunday", "Last week", "This morning"];

/** inner writes a subject inside a sentence: names and I keep their capital. */
const inner = (subject: string): string =>
  /^(I|Tom|Lily|Ben|Anna|Sam|Grandma)$/u.test(subject) ? subject : subject.charAt(0).toLowerCase() + subject.slice(1);

const regularRows = combos(119, pastSubjects, regulars, pastTimes);

const regularChoiceBank: readonly ChoiceItem[] = regularRows
  .slice(0, 40)
  .map(
    ([subject, [verb, past, rest, misspelt], time]): ChoiceItem => [
      `${time}, ${inner(subject)} ___ ${rest}. (${verb})`,
      past,
      [verb, misspelt],
    ],
  );

const regularTypedBank: readonly TypedItem[] = regularRows.slice(40, 80).map(
  ([subject, [verb, past, rest, misspelt], time]): TypedItem => ({
    shown: `${time}, ${inner(subject)} ___ ${rest}. (${verb})`,
    accepted: [past],
    wrong: [verb, misspelt],
  }),
);

const regularFixBank: readonly TypedItem[] = regularRows.slice(80, 119).map(([subject, [verb, past, rest], time]): TypedItem => {
  const present = ["I", "We", "My parents", "They"].includes(subject)
    ? verb
    : verb === "watch"
      ? "watches"
      : /[^aeiou]y$/u.test(verb)
        ? `${verb.slice(0, -1)}ies`
        : `${verb}s`;
  return {
    shown: `${time}, ${inner(subject)} ${present} ${rest}.`,
    accepted: [`${time}, ${inner(subject)} ${past} ${rest}.`],
    wrong: [`${time}, ${inner(subject)} ${present} ${rest}.`],
  };
});

/** bracketVerb is the verb in brackets at the end of a gapped sentence. */
const bracketVerb = (shown: string): string => /\((\w+)\)$/u.exec(shown)?.[1] ?? "";

/** timeOf is the time phrase that starts a sentence in the past. */
const timeOf = (shown: string): string => shown.split(",")[0] ?? "";

/** regularRule names the spelling rule that makes the past of a regular verb. */
const regularRule = (verb: string, past: string): Text => {
  if (verb.endsWith("e")) return t(`*${verb}* ends in *e*, so it adds only *-d*`, `*${verb}* 以 *e* 结尾，所以只加 *-d*`);
  if (past.endsWith("ied"))
    return t(
      `*${verb}* ends in a consonant and *y*, so the *y* becomes *i* before *-ed*`,
      `*${verb}* 以辅音字母加 *y* 结尾，所以把 *y* 变成 *i* 再加 *-ed*`,
    );
  if (past.length === verb.length + 3)
    return t(
      `*${verb}* ends in one short vowel and one consonant, so the consonant doubles before *-ed*`,
      `*${verb}* 以一个短元音加一个辅音字母结尾，所以双写辅音字母再加 *-ed*`,
    );
  if (verb.endsWith("y"))
    return t(
      `*${verb}* ends in a vowel and *y*, so it keeps the *y* and adds *-ed*`,
      `*${verb}* 以元音字母加 *y* 结尾，保留 *y* 直接加 *-ed*`,
    );
  return t(`*${verb}* is a regular verb that just adds *-ed*`, `*${verb}* 是直接加 *-ed* 的规则动词`);
};

/** regularWhy explains the past form in the gap of shown. */
const regularWhy = (right: string, shown: string): Text => {
  const rule = regularRule(bracketVerb(shown), right);
  return t(
    `*${timeOf(shown)}* is in the past, and ${rule.en}: ${fill(shown, right)}`,
    `*${timeOf(shown)}* 表示过去，${rule["zh-CN"]}：${fill(shown, right)}`,
  );
};

/** whyNotRegular explains the present form or a misspelt past of a regular verb. */
const whyNotRegular = (wrong: string, right: string, shown: string, position: number): Text => {
  if (position === 0)
    return t(
      `*${wrong}* is the present form. *${timeOf(shown)}* is in the past, so the verb needs its past form, *${right}*.`,
      `*${wrong}* 是现在时的形式。*${timeOf(shown)}* 表示过去，动词要用过去式 *${right}*。`,
    );
  const rule = regularRule(bracketVerb(shown), right);
  return t(`*${wrong}* is spelt wrong: ${rule.en}, so it is *${right}*.`, `*${wrong}* 拼错了：${rule["zh-CN"]}，所以是 *${right}*。`);
};

const pastSimpleRegular: TopicDef = {
  id: "past-simple-regular",
  title: t("The Past Simple: Regular Verbs", "一般过去时：规则动词"),
  summary: t("We played. She visited. Regular verbs add -ed for every person.", "We played. She visited. 规则动词无论主语是谁，都加 -ed。"),
  prerequisites: ["was-and-were", "present-simple"],
  encompasses: [
    { topic: "was-and-were", weight: 0.2 },
    { topic: "present-simple", weight: 0.2 },
  ],
  xp: 20,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("Adding -ed", "加 -ed"),
      t(
        "For something finished in the past, a regular verb adds *-ed*: *play* → *played*, *visit* → *visited*. It is the same for *I*, *she*, *they* and everyone.\n\nSpelling:\n\n- a verb ending in *e* adds only *-d*: *dance* → *danced*\n- a consonant and *y* becomes *-ied*: *study* → *studied*; but *play* → *played*\n- one short vowel and one consonant: double it: *stop* → *stopped*, *plan* → *planned*",
        "表示过去已经完成的事，规则动词加 *-ed*：*play* → *played*，*visit* → *visited*。无论主语是 *I*、*she* 还是 *they*，形式都一样。\n\n中文用“了”或“昨天”这样的时间词表示过去，动词本身不变；英语的动词本身必须变成过去式，句子里有 *yesterday* 也一样。\n\n拼写：\n\n- 以 *e* 结尾的只加 *-d*：*dance* → *danced*\n- 辅音字母加 *y* 结尾的，变 *y* 为 *i* 再加 *-ed*：*study* → *studied*；但 *play* → *played*\n- 重读闭音节、末尾只有一个辅音字母的，双写再加 *-ed*：*stop* → *stopped*，*plan* → *planned*",
      ),
      choiceGenerator(t("Choose the word for the gap.", "选出填入空白处的词。"), regularChoiceBank, regularWhy, whyNotRegular),
    ),
    point(
      "spell",
      t("Spelling the past form", "拼写过去式"),
      t(
        "Type the past form of the verb in brackets. Watch the spelling: an *e* at the end adds only *-d* (*danced*), a consonant and *y* becomes *-ied* (*studied*), one short vowel and one consonant doubles (*stopped*), and a vowel and *y* just adds *-ed* (*played*).",
        "写出括号里动词的过去式，注意拼写：以 *e* 结尾只加 *-d*（*danced*），辅音字母加 *y* 变成 *-ied*（*studied*），一个短元音加一个辅音字母要双写（*stopped*），元音字母加 *y* 直接加 *-ed*（*played*）。",
      ),
      typedGenerator("word-form", t("Type the verb in the past.", "输入动词的过去式。"), regularTypedBank, regularWhy),
    ),
    point(
      "fix",
      t("Putting the verb in the past", "把动词改成过去式"),
      t(
        "Each sentence starts with a time in the past, but its verb is in the present. Write it again with the past form.",
        "每个句子开头都是过去的时间，但动词用了现在时。用过去式重写句子。",
      ),
      typedGenerator("sentence", t("Fix the sentence.", "改正这个句子。"), regularFixBank, (right) => {
        const [verb = "", past = ""] = regulars.find(([, p]) => new RegExp(`\\b${p}\\b`, "u").test(right)) ?? [];
        const rule = regularRule(verb, past);
        return t(
          `*${timeOf(right)}* is in the past, so the verb is in the past too, whoever the subject is, and ${rule.en}: ${right}`,
          `*${timeOf(right)}* 表示过去，所以无论主语是谁，动词都用过去式；${rule["zh-CN"]}：${right}`,
        );
      }),
    ),
  ],
};

// The past simple of irregular verbs.

/** irregulars are a verb, its past form, the rest of a sentence and a wrong past made with -ed. */
const irregulars: readonly (readonly [verb: string, past: string, rest: string, made: string])[] = [
  ["go", "went", "to the zoo", "goed"],
  ["see", "saw", "a fox in the garden", "seed"],
  ["buy", "bought", "a new bag", "buyed"],
  ["eat", "ate", "a big bowl of noodles", "eated"],
  ["have", "had", "a bad cold", "haved"],
  ["take", "took", "a lot of photos", "taked"],
  ["make", "made", "a cake for Mom", "maked"],
  ["write", "wrote", "a letter to Grandpa", "writed"],
  ["swim", "swam", "in the sea", "swimmed"],
  ["sleep", "slept", "in a tent", "sleeped"],
  ["meet", "met", "a friend at the station", "meeted"],
  ["lose", "lost", "the key to the house", "losed"],
  ["break", "broke", "a cup in the kitchen", "breaked"],
  ["catch", "caught", "a big fish", "catched"],
  ["win", "won", "the game", "winned"],
  ["ride", "rode", "a bike in the park", "rided"],
  ["tell", "told", "a funny story", "telled"],
  ["leave", "left", "home at eight", "leaved"],
  ["spend", "spent", "an hour at the beach", "spended"],
  ["forget", "forgot", "the tickets", "forgetted"],
  ["come", "came", "home by bus", "comed"],
  ["feel", "felt", "very tired", "feeled"],
  ["drink", "drank", "some hot milk", "drinked"],
];

const irregularRows = combos(207, pastSubjects.slice(0, 9), irregulars, pastTimes);

const irregularChoiceBank: readonly ChoiceItem[] = irregularRows
  .slice(0, 46)
  .map(
    ([subject, [verb, past, rest, made], time]): ChoiceItem => [`${time}, ${inner(subject)} ___ ${rest}. (${verb})`, past, [made, verb]],
  );

const irregularTypedBank: readonly TypedItem[] = irregularRows.slice(46, 92).map(
  ([subject, [verb, past, rest, made], time]): TypedItem => ({
    shown: `${time}, ${inner(subject)} ___ ${rest}. (${verb})`,
    accepted: [past],
    wrong: [made, verb],
  }),
);

/** irregularTable lists the verbs as a table for the explanation. */
const irregularTable = irregulars.map(([verb, past]) => `*${verb}* → *${past}*`).join(", ");

/** irregularWhy explains the irregular past form in the gap of shown. */
const irregularWhy = (right: string, shown: string): Text => {
  const verb = bracketVerb(shown);
  return t(
    `*${timeOf(shown)}* is in the past, and *${verb}* is irregular: its past form is *${right}*, not one made with *-ed*: ${fill(shown, right)}`,
    `*${timeOf(shown)}* 表示过去，而 *${verb}* 是不规则动词，过去式是 *${right}*，不是加 *-ed*：${fill(shown, right)}`,
  );
};

/** whyNotIrregular explains a past made with -ed or the present form of an irregular verb. */
const whyNotIrregular = (wrong: string, right: string, shown: string, position: number): Text => {
  const verb = bracketVerb(shown);
  return position === 0
    ? t(
        `*${wrong}* adds *-ed*, but *${verb}* is irregular and has a past form of its own: *${right}*.`,
        `*${wrong}* 加了 *-ed*，但 *${verb}* 是不规则动词，有自己的过去式：*${right}*。`,
      )
    : t(
        `*${wrong}* is the present form. *${timeOf(shown)}* is in the past, so the verb needs its past form, *${right}*.`,
        `*${wrong}* 是现在时的形式。*${timeOf(shown)}* 表示过去，动词要用过去式 *${right}*。`,
      );
};

const pastSimpleIrregular: TopicDef = {
  id: "past-simple-irregular",
  title: t("The Past Simple: Irregular Verbs", "一般过去时：不规则动词"),
  summary: t(
    "go, went; see, saw; buy, bought. The commonest verbs have past forms of their own.",
    "go → went，see → saw，buy → bought。最常用的动词有自己的过去式。",
  ),
  prerequisites: ["past-simple-regular"],
  encompasses: [{ topic: "past-simple-regular", weight: 0.3 }],
  xp: 20,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("Past forms of their own", "不规则的过去式"),
      t(
        `Many common verbs do not add *-ed*. Their past forms must be learned one by one: ${irregularTable}.\n\nNot *goed* or *buyed*.`,
        `许多常用动词不加 *-ed*，它们的过去式要一个一个地记：${irregularTable}。\n\n不要写成 *goed* 或 *buyed*。`,
      ),
      choiceGenerator(t("Choose the word for the gap.", "选出填入空白处的词。"), irregularChoiceBank, irregularWhy, whyNotIrregular),
    ),
    point(
      "spell",
      t("Writing the past form", "写出过去式"),
      t(
        "Type the past form of the verb in brackets. Each one is irregular, so do not add *-ed*: write the past form you learned for it, like *go* → *went* or *buy* → *bought*.",
        "写出括号里动词的过去式。它们都是不规则动词，不要加 *-ed*，要写出记住的过去式，比如 *go* → *went*、*buy* → *bought*。",
      ),
      typedGenerator("word-form", t("Type the verb in the past.", "输入动词的过去式。"), irregularTypedBank, irregularWhy),
    ),
  ],
};

// Did and didn't.

const didSubjects: readonly (readonly [subject: string, asked: string])[] = [
  ["I", "you"],
  ["We", "you"],
  ["Tom", "Tom"],
  ["My parents", "your parents"],
  ["Lily", "Lily"],
  ["They", "they"],
  ["She", "she"],
  ["He", "he"],
];

const didRows = combos(184, didSubjects, irregulars, pastTimes);

const negativeChoiceBank: readonly ChoiceItem[] = didRows.slice(0, 46).map(([[subject], [verb, past, rest], time]): ChoiceItem => {
  const when = time.charAt(0).toLowerCase() + time.slice(1);
  return [
    `${subject} / not / ${verb} ${rest} / ${when}`,
    `${subject} didn't ${verb} ${rest} ${when}.`,
    [`${subject} didn't ${past} ${rest} ${when}.`, `${subject} not ${past} ${rest} ${when}.`],
  ];
});

const negativeTypedBank: readonly TypedItem[] = didRows.slice(46, 92).map(([[subject], [verb, past, rest], time]): TypedItem => {
  const when = time.charAt(0).toLowerCase() + time.slice(1);
  return {
    shown: `${subject} ${past} ${rest} ${when}.`,
    accepted: [`${subject} [didn't|did not] ${verb} ${rest} ${when}.`],
    canonical: `${subject} didn't ${verb} ${rest} ${when}.`,
    wrong: [`${subject} didn't ${past} ${rest} ${when}.`, `${subject} not ${past} ${rest} ${when}.`],
  };
});

const questionTypedBank: readonly TypedItem[] = didRows.slice(92, 138).map(([[subject, asked], [verb, past, rest], time]): TypedItem => {
  const when = time.charAt(0).toLowerCase() + time.slice(1);
  return {
    shown: `${subject} ${past} ${rest} ${when}.`,
    accepted: [`Did ${asked} ${verb} ${rest} ${when}?`],
    wrong: [`Did ${asked} ${past} ${rest} ${when}?`, `${subject} ${past} ${rest} ${when}?`],
  };
});

const questionChoiceBank: readonly ChoiceItem[] = didRows.slice(138, 184).map(([[, asked], [verb, past, rest], time]): ChoiceItem => {
  const when = time.charAt(0).toLowerCase() + time.slice(1);
  return ["", `Did ${asked} ${verb} ${rest} ${when}?`, [`Did ${asked} ${past} ${rest} ${when}?`, `Do ${asked} ${past} ${rest} ${when}?`]];
});

/** didVerb is the irregular verb after did or didn't in a sentence, as its plain form and its past. */
const didVerb = (sentence: string): readonly [verb: string, past: string] => {
  const plain = /(?:didn't|did not|^Did (?:you|Tom|your parents|Lily|they|she|he)) (\w+)/u.exec(sentence)?.[1] ?? "";
  const found = irregulars.find(([verb]) => verb === plain);
  return [plain, found?.[1] ?? ""];
};

/** negativeWhy explains a negative in the past with didn't. */
const negativeWhy = (right: string): Text => {
  const [verb, past] = didVerb(right);
  return t(
    `To say no about the past, put *didn't* before the verb. *Didn't* already shows the past, so *${past}* goes back to *${verb}*: ${right}`,
    `否定过去的事，在动词前加 *didn't*。*didn't* 已经表示过去，所以 *${past}* 变回原形 *${verb}*：${right}`,
  );
};

/** whyNotNegative explains a past form after didn't, or not without did. */
const whyNotNegative = (wrong: string, right: string, _shown: string, position: number): Text => {
  const [verb, past] = didVerb(right);
  return position === 0
    ? t(
        `*${wrong}* keeps *${past}* after *didn't*. The past is shown once, by *didn't*, so the verb is plain: *${verb}*.`,
        `*${wrong}* 在 *didn't* 后面还用 *${past}*。过去只用 *didn't* 表示一次，所以动词用原形 *${verb}*。`,
      )
    : t(
        `*${wrong}* uses *not* alone. English needs *didn't* before the verb, and then the plain verb *${verb}*.`,
        `*${wrong}* 只用了 *not*。英语要在动词前用 *didn't*，后面接动词原形 *${verb}*。`,
      );
};

/** questionWhy explains a question in the past with did. */
const questionWhy = (right: string): Text => {
  const [verb, past] = didVerb(right);
  return t(
    `A question about the past starts with *Did*, then the subject and the plain verb; *Did* shows the past, so *${past}* goes back to *${verb}*: ${right}`,
    `询问过去的事，用 *Did* 开头，再接主语和动词原形；*Did* 已经表示过去，所以 *${past}* 变回 *${verb}*：${right}`,
  );
};

/** whyNotQuestion explains a past form after did, or a question with do. */
const whyNotQuestion = (wrong: string, right: string, _shown: string, position: number): Text => {
  const [verb, past] = didVerb(right);
  return position === 0
    ? t(
        `*${wrong}* keeps *${past}* after *Did*. The past is shown once, by *Did*, so the verb is plain: *${verb}*.`,
        `*${wrong}* 在 *Did* 后面还用 *${past}*。过去只用 *Did* 表示一次，所以动词用原形 *${verb}*。`,
      )
    : t(
        `*${wrong}* starts with *Do*, which asks about the present. A question about the past starts with *Did*, and the verb is plain.`,
        `*${wrong}* 用 *Do* 开头，问的是现在。询问过去要用 *Did* 开头，动词用原形。`,
      );
};

const pastQuestionsAndNegatives: TopicDef = {
  id: "past-simple-questions-and-negatives",
  title: t("Did and Didn't", "did 和 didn't"),
  summary: t(
    "Did you go? I didn't see it. After did and didn't, the verb goes back to its plain form.",
    "Did you go? I didn't see it. 在 did 和 didn't 后面，动词用原形。",
  ),
  prerequisites: ["past-simple-irregular", "present-simple-questions"],
  encompasses: [
    { topic: "past-simple-irregular", weight: 0.4 },
    { topic: "present-simple-questions", weight: 0.3 },
  ],
  xp: 20,
  strand: "grammar",
  knowledgePoints: [
    point(
      "negative",
      t("Didn't and the plain verb", "didn't 加动词原形"),
      t(
        "To say no about the past, put *didn't* (*did not*) before the verb. *Didn't* already shows the past, so the verb goes back to its plain form:\n\n*I went.* → *I didn't go.* Not *I didn't went* or *I not went*.",
        "否定过去的事，在动词前加 *didn't*（*did not*）。*didn't* 已经表示过去，所以后面的动词要用原形：\n\n*I went.* → *I didn't go.* 不能说 *I didn't went*，也不能像中文“我没去”那样直接说 *I not went*。",
      ),
      choiceGenerator(t("Which sentence matches the notes?", "哪个句子符合笔记？"), negativeChoiceBank, negativeWhy, whyNotNegative),
    ),
    point(
      "write-negative",
      t("Writing the negative", "写出否定句"),
      t(
        "Write the sentence again with *didn't* before the verb, and change the verb back to its plain form: *I went to the zoo.* → *I didn't go to the zoo.* Keep the rest of the sentence as it is.",
        "在动词前加 *didn't* 把句子改成否定句，并把动词变回原形：*I went to the zoo.* → *I didn't go to the zoo.* 句子的其他部分不变。",
      ),
      typedGenerator("sentence-pattern", t("Make the sentence negative.", "把句子改成否定句。"), negativeTypedBank, negativeWhy),
    ),
    point(
      "question",
      t("Questions with did", "用 did 提问"),
      t(
        "To ask about the past, start with *Did*, then the subject and the plain verb: *Did you see the fox? Did Tom win?*\n\nNot *Did you saw?*: *did* shows the past once, and that is enough.",
        "询问过去的事，用 *Did* 开头，后面接主语和动词原形：*Did you see the fox? Did Tom win?*\n\n不能说 *Did you saw?*：过去只需要用 *did* 表示一次。",
      ),
      choiceGenerator(t("Which question is right?", "哪个问句是对的？"), questionChoiceBank, questionWhy, whyNotQuestion),
    ),
    point(
      "write-question",
      t("Writing the question", "写出问句"),
      t(
        "Turn the sentence into a question with *Did*. Ask about the same person: *I* and *we* become *you*.",
        "用 *Did* 把句子改成问句。问的是同一个人：*I* 和 *we* 变成 *you*。",
      ),
      typedGenerator("sentence", t("Make a question.", "把句子改成疑问句。"), questionTypedBank, questionWhy),
    ),
  ],
};

// Writing sentences in the past.

const noteNames: readonly string[] = ["Sam", "Lily", "My uncle", "Anna", "My cousins", "Ben", "Grandma"];
const noteDays: readonly string[] = ["Saturday", "Sunday", "Friday", "Monday", "Tuesday"];

/** noteActions are a plain verb phrase of a note and its past. */
const noteActions: readonly (readonly [plain: string, past: string])[] = [
  ["go to the zoo", "went to the zoo"],
  ["visit the gallery", "visited the gallery"],
  ["have a picnic", "had a picnic"],
  ["buy a new tent", "bought a new tent"],
  ["play tennis", "played tennis"],
  ["see a film", "saw a film"],
  ["hike in the hills", "hiked in the hills"],
  ["clean the house", "cleaned the house"],
  ["make dumplings", "made dumplings"],
  ["meet some friends", "met some friends"],
  ["swim in the lake", "swam in the lake"],
];

const noteRows = combos(77, noteNames, noteActions, noteDays);

const noteChoiceBank: readonly ChoiceItem[] = noteRows
  .slice(0, 38)
  .map(
    ([name, [plain, past], day]): ChoiceItem => [
      `${name} / ${plain} / ${day}`,
      `${name} ${past} on ${day}.`,
      [`${name} ${plain} on ${day}.`, `${name} on ${day} ${past}.`],
    ],
  );

const noteTypedBank: readonly TypedItem[] = noteRows.slice(38, 77).map(
  ([name, [plain, past], day]): TypedItem => ({
    shown: `${name} / ${plain} / ${day}`,
    accepted: [`${name} ${past} [on|last] ${day}.`, `[On|Last] ${day}(,) ${inner(name)} ${past}.`],
    canonical: `${name} ${past} on ${day}.`,
    wrong: [`${name} ${plain} on ${day}.`, `${name} on ${day} ${past}.`],
  }),
);

/** noteWhy explains the sentence in the past for a note. */
const noteWhy = (right: string): Text => {
  const [plain = "", past = ""] = noteActions.find(([, p]) => right.includes(p)) ?? [];
  const verb = plain.split(" ")[0] ?? "";
  const done = past.split(" ")[0] ?? "";
  return t(
    `The note is about the past, so its verb goes into the past (*${verb}* → *${done}*), and the day goes at the end with *on*: ${right}`,
    `笔记说的是过去的事，所以动词改成过去式（*${verb}* → *${done}*），星期放在句末，前面加 *on*：${right}`,
  );
};

/** whyNotNote explains a sentence for a note with the plain verb or with the day in the middle. */
const whyNotNote = (wrong: string, _right: string, _shown: string, position: number): Text =>
  position === 0
    ? t(
        `*${wrong}* keeps the plain verb of the note. The note is about the past, so the verb must be in the past form.`,
        `*${wrong}* 保留了笔记里的动词原形。笔记说的是过去的事，动词必须用过去式。`,
      )
    : t(
        `*${wrong}* puts the day between the subject and the verb, as Chinese does. In English the day goes at the end with *on*, or at the start.`,
        `*${wrong}* 像中文一样把时间放在主语和动词之间。英语里星期放在句末并加 *on*，或者放在句首。`,
      );

const writingSentencesInThePast: TopicDef = {
  id: "writing-sentences-in-the-past",
  title: t("Writing Sentences in the Past", "用过去时写句子"),
  summary: t(
    "Turn notes about last weekend into sentences: Sam / go to the zoo / Saturday becomes Sam went to the zoo on Saturday.",
    "把关于上周末的笔记写成句子：Sam / go to the zoo / Saturday 写成 Sam went to the zoo on Saturday.",
  ),
  prerequisites: ["past-simple-irregular", "writing-sentences-about-routines"],
  encompasses: [
    { topic: "past-simple-irregular", weight: 0.4 },
    { topic: "writing-sentences-about-routines", weight: 0.2 },
  ],
  xp: 20,
  strand: "writing",
  knowledgePoints: [
    point(
      "choose",
      t("The sentence for a note", "选出符合笔记的句子"),
      t(
        "A note gives who, what and when. In the sentence, the verb goes into the past, and the day comes at the end with *on*:\n\n*Sam / go to the zoo / Saturday* → *Sam went to the zoo on Saturday.*",
        "笔记给出“谁、做什么、什么时候”。写成句子时，动词改成过去式，星期放在句末，前面加 *on*：\n\n*Sam / go to the zoo / Saturday* → *Sam went to the zoo on Saturday.*\n\n不要像中文“萨姆星期六去了动物园”那样把时间放在动词前。",
      ),
      choiceGenerator(t("Choose the sentence that matches the note.", "选出与笔记相符的句子。"), noteChoiceBank, noteWhy, whyNotNote),
    ),
    point(
      "write",
      t("Writing the sentence", "写出句子"),
      t(
        "Write a whole sentence for the note, in the past. The day can also come first: *On Saturday, Sam went to the zoo.*",
        "根据笔记用过去时写一个完整的句子。时间也可以放在句首：*On Saturday, Sam went to the zoo.*",
      ),
      typedGenerator("sentence-pattern", t("Write a sentence from the note.", "根据笔记写一个句子。"), noteTypedBank, noteWhy),
    ),
  ],
};

// Writing about your weekend.

const weekendBank: readonly WritingItem[] = [
  {
    task: "Write about what you did last Saturday.",
    model:
      "Last Saturday I got up late. In the morning, I helped my mom in the kitchen, and we made dumplings. After lunch, I met my friend Tom at the park. We played football until it got dark. In the evening, I watched a film with my family. It was a good day.",
  },
  {
    task: "Write about a weekend when you visited relatives.",
    model:
      "Last weekend we visited my grandparents in their village. We took the bus on Saturday morning. Grandma cooked a big lunch for everyone. In the afternoon, my cousins and I walked to the river. On Sunday we said goodbye and came home. I was tired but happy.",
  },
  {
    task: "Write about a weekend when the weather was bad.",
    model:
      "It rained all weekend, so we stayed inside. On Saturday I read a book and played cards with my brother. Then Dad taught us a new game. On Sunday afternoon the rain finally stopped. We went out for a short walk. The air was fresh and cool.",
  },
  {
    task: "Write about a weekend when you went camping or hiking.",
    model:
      "Last weekend my family went camping by a lake. We arrived on Saturday morning and put up our tent. In the afternoon we hiked in the hills. At night we cooked dinner on a fire and looked at the stars. On Sunday we swam in the lake before we drove home.",
  },
  {
    task: "Write about a weekend when something went wrong.",
    model:
      "Last Sunday was a strange day. In the morning, I lost my phone in the park. I looked for it for an hour. Then I went home and told my dad. Suddenly, the phone rang in his pocket! He took it by mistake. We both laughed.",
  },
  {
    task: "Write about a weekend when you visited a museum or a gallery.",
    model:
      "On Saturday my class visited the art gallery in the city. We went there by bus. We saw some famous paintings and a lot of old photos. My favorite was a painting of the sea. After that, we had a picnic in the park. It was an interesting day.",
  },
  {
    task: "Write about a weekend when you helped at home.",
    model:
      "Last weekend I helped at home. On Saturday morning, I cleaned my room and washed the dishes. In the afternoon, my sister and I washed the car. On Sunday I cooked lunch for my parents. They were very happy. I was tired, but I felt good.",
  },
  {
    task: "Write about a weekend when you went to a party.",
    model:
      "Last Saturday was my friend Mia's birthday, so I went to her party. I bought her a book and a card. At the party, we ate cake and played games. Then we danced to music. I got home at nine o'clock. It was a great party.",
  },
  {
    task: "Write about a lazy weekend when you relaxed.",
    model:
      "Last weekend I didn't do much. On Saturday I slept until ten. Then I had a big breakfast and read a comic. In the afternoon, I watched TV with my brother. On Sunday we had a picnic in the garden. It was a quiet weekend, and I liked it.",
  },
  {
    task: "Write about a weekend when you played a sport or a game.",
    model:
      "Last Sunday my team played a basketball game against another school. We practiced on Saturday afternoon. On Sunday the game started at ten. We played well, and we won by five points. After the game, our coach bought us ice cream. I was very proud.",
  },
  {
    task: "Write about a weekend when you went shopping.",
    model:
      "Last Saturday I went shopping with my mom. We took the subway to a big shop in the city. I needed new shoes for school. We looked in five shops, and finally I found some nice black ones. Then we had noodles for lunch. We came home at four.",
  },
  {
    task: "Write about a weekend when you learned something new.",
    model:
      "Last weekend I learned to ride a bike. On Saturday morning, my dad took me to the park. At first I fell a lot. Dad held the bike and ran next to me. On Sunday I tried again, and suddenly I could ride alone! I was so happy.",
  },
];

const writingAboutYourWeekend = judgedTopic({
  id: "writing-about-your-weekend",
  title: t("Writing About Your Weekend", "写你的周末"),
  summary: t(
    "Write five to seven sentences about what you did last weekend, in the past simple, in the order it happened.",
    "用五到七句话写你上周末做了什么，用一般过去时，按事情发生的顺序写。",
  ),
  prerequisites: ["writing-sentences-in-the-past", "writing-a-short-note"],
  encompasses: [{ topic: "writing-sentences-in-the-past", weight: 0.4 }],
  criteria: ["a2-past-simple", "a2-events-in-order", "a1-sentences"],
  point: {
    id: "weekend",
    title: t("What you did, in order", "按顺序写你做了什么"),
    explanation: t(
      "Tell your weekend like a short story. Use the past simple for every thing you did: *I got up late. We made dumplings.*\n\nTell the events in the order they happened, and show the order with time words: *in the morning*, *after lunch*, *then*, *in the evening*, *on Sunday*. End with how the day was: *It was a good day.*",
      "像讲一个小故事一样写你的周末。你做的每件事都用一般过去时：*I got up late. We made dumplings.*\n\n按事情发生的先后顺序写，并用时间词表示顺序：*in the morning*、*after lunch*、*then*、*in the evening*、*on Sunday*。最后说一说这一天怎么样：*It was a good day.*\n\n中文里“昨天我去公园”，动词不变；英语每个动词都要变成过去式。",
    ),
  },
  question: t(
    "Write five to seven sentences in English about the weekend the task names. Use the past simple, and tell the events in order.",
    "根据题目用英语写五到七句话，写你的周末。用一般过去时，按顺序写出发生的事。",
  ),
  bank: weekendBank,
  limits: { minWords: 35, maxChars: 900 },
  what: t("text", "短文"),
});

/** topics are the topics of the unit Last Weekend. */
export const topics: readonly TopicDef[] = [
  pastTime.topic,
  relatives.topic,
  events.topic,
  weekend.topic,
  useful.topic,
  pastSimpleRegular,
  pastSimpleIrregular,
  pastQuestionsAndNegatives,
  writingSentencesInThePast,
  writingAboutYourWeekend,
];

/** vocabulary are the words the unit Last Weekend teaches. */
export const vocabulary: readonly WordBatch[] = [pastTime.batch, relatives.batch, events.batch, weekend.batch, useful.batch];
