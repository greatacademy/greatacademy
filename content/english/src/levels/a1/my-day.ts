// A1, unit 2: My Day. Daily routines, times of day, how often, little words, the -s of he and she, words like
// always and never, and sentences about routines.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { everyPair, interleave, pairUp, vocabularyTopic, word } from "../words.ts";

const myDay = vocabularyTopic({
  id: "a1-words-my-day",
  title: t("My Day", "我的一天"),
  summary: t("Getting up, going to school, meals and going to bed.", "起床、上学、吃饭和睡觉。"),
  prerequisites: ["pre-a1-words-classroom-actions"],
  words: [
    word(
      "get gets got gotten getting",
      "to receive something; with *up*, to leave your bed",
      "得到；（get up）起床",
      "I {get} up at seven.|sleep brush | I {got} a new bike for my birthday.|slept woke | It's {getting} dark. Let's go home.|sleeping brushing",
      "sleep brush",
    ),
    word(
      "up",
      "toward a higher place; out of bed",
      "向上；起来",
      "Wake {up}! It's time for school.|home bed | Stand {up}, please.|home bed | The cat climbs {up} the tree.|home bed",
      "home bed",
    ),
    word(
      "wake wakes woke woken waking",
      "to stop sleeping",
      "醒；叫醒",
      "I {wake} up at six every day.|sleep brush | Don't {wake} the baby. She is sleeping.|brush come | I {woke} up early this morning.|slept went",
      "sleep brush",
    ),
    word(
      "go goes went gone going",
      "to move to another place",
      "去",
      "I {go} to school by bus.|wake sleep | We {went} to the zoo yesterday.|woke slept | Where are you {going}? To the shop.|waking sleeping",
      "wake sleep",
    ),
    word(
      "come comes came coming",
      "to move toward the person speaking, or to a place",
      "来",
      "{Come} here, please!|Go Sleep | Can you {come} to my party?|wake brush | My dad {comes} home at six.|wakes brushes",
      "wake brush",
    ),
    word(
      "home homes",
      "the place where you live",
      "家",
      "I go {home} after school.|bed breakfast | My {home} is a small apartment.|bed lunch | Is Mom at {home}? No, she's at work.|bed up",
      "bed lunch",
    ),
    word(
      "bed beds",
      "a piece of furniture you sleep on",
      "床",
      "I go to {bed} at nine.|home up | The cat sleeps on my {bed}.|lunch home | Our bedroom has two {beds}.|homes lunches",
      "home lunch",
    ),
    word(
      "sleep sleeps slept sleeping",
      "to rest with your eyes closed",
      "睡觉",
      "I {sleep} eight hours a night.|go come | The baby is {sleeping}. Be quiet.|brushing getting | I {slept} well last night.|woke brushed",
      "go come",
    ),
    word(
      "breakfast breakfasts",
      "the first meal of the day",
      "早餐",
      "In the morning, I eat {breakfast}.|dinner bed | {Breakfast} is the first meal of the day.|Dinner Lunch | I eat {breakfast} at seven, before school.|dinner lunch",
      "dinner lunch",
    ),
    word(
      "lunch lunches",
      "the meal you eat in the middle of the day",
      "午餐",
      "We eat {lunch} at twelve.|breakfast dinner | I take my {lunch} to school in a box.|bed home | {Lunch} is in the middle of the day.|Breakfast Dinner",
      "breakfast dinner",
    ),
    word(
      "dinner dinners",
      "the meal you eat in the evening",
      "晚餐",
      "We eat {dinner} at seven in the evening.|breakfast lunch | What's for {dinner} tonight?|breakfast lunch | After {dinner}, I go to bed.|breakfast bed",
      "breakfast lunch",
    ),
    word(
      "brush brushes brushed brushing",
      "to clean something with a brush",
      "刷",
      "I {brush} my teeth every morning.|wake sleep | {Brush} your hair before school.|Wake Go | She is {brushing} the dog.|going coming",
      "wake sleep",
    ),
  ],
});

const timesOfDay = vocabularyTopic({
  id: "a1-words-times-of-day",
  title: t("Times of Day", "一天中的时段"),
  summary: t("Morning, afternoon, evening and night, and words for when.", "早上、下午、傍晚和夜晚，以及表示时间先后的词。"),
  prerequisites: ["pre-a1-words-little-words"],
  words: [
    word(
      "morning mornings",
      "the early part of the day, before twelve",
      "早上；上午",
      "I have breakfast in the {morning}.|evening night | Good {morning}! Did you sleep well?|evening night | I go to school every {morning} at eight.|night evening",
      "evening night",
    ),
    word(
      "afternoon afternoons",
      "the part of the day after twelve and before the evening",
      "下午",
      "Lunch is at twelve, and in the {afternoon} we play.|morning night | Good {afternoon}! It's two o'clock.|morning night | School ends at four in the {afternoon}.|morning night",
      "morning night",
    ),
    word(
      "evening evenings",
      "the part of the day between the afternoon and the night",
      "傍晚；晚上",
      "We eat dinner in the {evening}.|morning afternoon | Good {evening}, everyone. It's seven o'clock.|morning afternoon | The sun goes down in the {evening}.|morning afternoon",
      "morning afternoon",
    ),
    word(
      "night nights",
      "the dark time when people sleep",
      "夜晚",
      "I sleep at {night}.|morning afternoon | Stars come out at {night}.|morning afternoon | Good {night}! Sleep well.|morning afternoon",
      "morning afternoon",
    ),
    word(
      "day days",
      "a time of twenty-four hours; also the light part of it",
      "天；白天",
      "There are seven {days} in a week.|times hours | Have a nice {day}!|today every | I brush my teeth twice a {day}.|today every",
      "today every",
    ),
    word(
      "today",
      "on this day",
      "今天",
      "It's my birthday {today}!|every after | What day is it {today}? It's Monday.|every before | {Today} is sunny, but tomorrow it will rain.|Every After",
      "every after",
    ),
    word(
      "every",
      "each one of a group; all",
      "每个；每一",
      "I go to school {every} day.|today then | {Every} child has a book.|Today Then | We visit Grandma {every} Sunday.|after then",
      "today then",
    ),
    word(
      "then",
      "after that; next",
      "然后；那时",
      "I get up, and {then} I have breakfast.|every before | First open the box, {then} take out the toy.|every after | Wash your hands. {Then} you can eat.|Every Before",
      "every before",
    ),
    word(
      "after",
      "later than something",
      "在……之后",
      "I go to bed {after} dinner. First dinner, then bed.|before every | Monday comes {after} Sunday.|before then | Seven comes {after} six.|before then",
      "before then",
    ),
    word(
      "before",
      "earlier than something",
      "在……之前",
      "Sunday comes {before} Monday.|after then | Five comes {before} six.|after then | I brush my teeth {before} bed, not after.|after every",
      "after then",
    ),
  ],
});

const howOften = vocabularyTopic({
  id: "a1-words-how-often",
  title: t("How Often", "多久一次"),
  summary: t(
    "Always, usually, sometimes and never, and the verbs of a day: start, finish, work, watch, play.",
    "always、usually、sometimes、never，以及日常动词 start、finish、work、watch、play。",
  ),
  prerequisites: ["a1-words-my-day"],
  words: [
    word(
      "always",
      "every time",
      "总是",
      "The sun {always} comes up in the east.|never sometimes | I {always} brush my teeth. I do it every day.|never sometimes | She is {always} late! Every day she comes at nine.|never sometimes",
      "never sometimes",
    ),
    word(
      "usually",
      "most times",
      "通常",
      "I {usually} walk to school, but sometimes I take the bus.|never always | We {usually} eat at seven, but today we are late.|never always | It is {usually} sunny here, but today it's raining.|never always",
      "never always",
    ),
    word(
      "often",
      "many times",
      "经常",
      "I {often} visit my grandma, about twice a week.|never always | He is {often} tired after work, but not every day.|never always | It {often} rains here in spring, so take an umbrella.|never always",
      "never always",
    ),
    word(
      "sometimes",
      "at some times, but not always",
      "有时",
      "I {sometimes} take the bus, but I usually walk.|always never | {Sometimes} I am happy, and sometimes I am sad.|Always Never | We {sometimes} eat out, maybe once a month.|always often",
      "always never",
    ),
    word(
      "never",
      "not at any time",
      "从不",
      "I {never} drink coffee. I don't like it.|always often | Cats {never} bark.|always sometimes | She is {never} late. She is always on time.|always often",
      "always often",
    ),
    word(
      "start starts started starting",
      "to begin",
      "开始",
      "School {starts} at eight and finishes at three.|finishes works | {Start} the test now. You have one hour.|Watch Play | The movie {started} at seven, and it ended at nine.|finished worked",
      "finish watch",
    ),
    word(
      "finish finishes finished finishing",
      "to end; to do the last part of something",
      "完成；结束",
      "I start at five and {finish} at six.|watch play | Did you {finish} your lunch? Your plate is empty.|start watch | School {finishes} at three. Then we go home.|starts works",
      "start watch",
    ),
    word(
      "work works worked working",
      "to do a job",
      "工作",
      "My mom {works} in a hospital. She is a nurse.|plays watches | I {work} hard at school.|watch homework | Dad is at {work}. He comes home at six.|homework watch",
      "play watch",
    ),
    word(
      "watch watches watched watching",
      "to look at something for some time",
      "观看；看",
      "I {watch} TV after dinner.|play work | Let's {watch} a movie tonight.|play work | She is {watching} the birds in the garden.|working playing",
      "play work",
    ),
    word(
      "play plays played playing",
      "to have fun with a game or a toy; to make music on something",
      "玩；打（球）；弹奏",
      "The children {play} in the park.|watch finish | I {play} the piano.|watch work | Let's {play} football after school.|watch finish",
      "watch work",
    ),
    word(
      "homework",
      "work a teacher gives you to do at home",
      "家庭作业",
      "I do my {homework} after school.|play watch | The teacher gives us {homework} every day.|play watch | Did you finish your math {homework}?|play watch",
      "play watch",
    ),
  ],
});

const littleWords1 = vocabularyTopic({
  id: "a1-words-little-words-1",
  title: t("Little Words 1", "小词 1"),
  summary: t("For, out, down, off, over, by, into, just, really and why.", "for、out、down、off、over、by、into、just、really 和 why。"),
  prerequisites: ["pre-a1-words-little-words"],
  words: [
    word(
      "for",
      "used to say who gets something, or how long something lasts",
      "为；给；（时长）……之久",
      "This gift is {for} you.|out down | I waited {for} an hour.|off into | Thank you {for} the cake!|off into",
      "out down",
    ),
    word(
      "out",
      "away from the inside",
      "出去；向外",
      "Let's go {out} and play.|for into | Take your book {out} of your bag.|for into | The cat ran {out} of the house.|for down",
      "for into",
    ),
    word(
      "down",
      "toward a lower place",
      "向下",
      "Sit {down}, please.|for into | The ball rolls {down} the hill.|for into | Put your pens {down} and listen.|for into",
      "for into",
    ),
    word(
      "off",
      "away from; not on",
      "离开；（关）掉",
      "Turn {off} the light.|for into | Take {off} your shoes.|for into | The cat jumped {off} the table.|for just",
      "for into",
    ),
    word(
      "over",
      "above or across something; finished",
      "在……上方；越过；结束",
      "The bird flies {over} the house.|into for | The dog jumped {over} the wall.|for out | Is the movie {over}? Yes, it ended.|for into",
      "into for",
    ),
    word(
      "by",
      "next to; using",
      "在……旁边；乘（交通工具）",
      "I go to school {by} bus.|for over | Come and sit {by} me.|for out | The book is {by} the bed, next to the lamp.|for into",
      "for over",
    ),
    word(
      "into",
      "to the inside of",
      "进入",
      "Put the toys {into} the box.|out off | She walked {into} the room.|off for | The frog jumped {into} the water.|off for",
      "out off",
    ),
    word(
      "just",
      "only; a moment ago",
      "只是；刚刚",
      "I'm {just} looking, thank you.|by over | It's {just} a small cat. Don't be afraid.|why over | I {just} got home. I need a rest.|why by",
      "why by",
    ),
    word(
      "really",
      "very; truly",
      "真的；非常",
      "This cake is {really} good!|why by | Do you {really} like it? — Yes, I do!|why by | I'm {really} sorry.|why by",
      "why by",
    ),
    word(
      "why",
      "the word you use to ask for a reason",
      "为什么",
      "{Why} are you sad? — Because my dog is sick.|What Where | {Why} is the sky blue?|Just By | I don't know {why} she is angry.|just by",
      "just by",
    ),
  ],
});

// The -s of he, she and it.

/** routines are a verb, its form after he or she, and the rest of a sentence about a day. */
const routines: readonly (readonly [verb: string, third: string, rest: string, wrong: string])[] = [
  ["get", "gets", "up at seven", "getes"],
  ["go", "goes", "to school by bus", "gos"],
  ["watch", "watches", "TV after dinner", "watchs"],
  ["play", "plays", "football on Sundays", "plaies"],
  ["study", "studies", "English every day", "studys"],
  ["have", "has", "breakfast at eight", "haves"],
  ["do", "does", "homework after school", "dos"],
  ["finish", "finishes", "work at five", "finishs"],
  ["work", "works", "in a hospital", "workes"],
  ["wash", "washes", "the dishes after dinner", "washs"],
  ["walk", "walks", "to school with a friend", "walkes"],
  ["brush", "brushes", "the dog every week", "brushs"],
  ["read", "reads", "a book before bed", "reades"],
];

/** singleSubjects take the -s form. */
const singleSubjects: readonly string[] = [
  "She",
  "He",
  "Tom",
  "My mom",
  "Lily",
  "My brother",
  "Our teacher",
  "My dad",
  "Anna",
  "My sister",
  "Ben",
];

const thirdChoiceBank: readonly ChoiceItem[] = everyPair(singleSubjects, routines).map(
  ([subject, [verb, third, rest, wrong]]): ChoiceItem => [`${subject} ___ ${rest}. (${verb})`, third, [verb, wrong]],
);

const thirdTypedBank: readonly TypedItem[] = everyPair(singleSubjects, routines).map(
  ([subject, [verb, third, rest, wrong]]): TypedItem => ({
    shown: `${subject} ___ ${rest}. (${verb})`,
    accepted: [third],
    wrong: [verb, wrong],
  }),
);

const thirdFixBank: readonly TypedItem[] = everyPair([...singleSubjects.slice(5), ...singleSubjects.slice(0, 5)], routines).map(
  ([subject, [verb, third, rest, wrong]]): TypedItem => ({
    shown: `${subject} ${verb} ${rest}.`,
    accepted: [`${subject} ${third} ${rest}.`],
    wrong: [`${subject} ${verb} ${rest}.`, `${subject} ${wrong} ${rest}.`],
  }),
);

/** thirdRule says how a verb makes its form after he, she or one person, in every locale. */
const thirdRule = (verb: string, third: string): Text => {
  if (verb === "have") return t("*have* is irregular: after one person it becomes *has*", "*have* 不规则：单数第三人称后变成 *has*");
  if (third.endsWith("ies"))
    return t(`*${verb}* ends in a consonant and *y*, so *y* becomes *-ies*`, `*${verb}* 以辅音字母加 *y* 结尾，变 *y* 为 *-ies*`);
  if (third.endsWith("es"))
    return t(
      `*${verb}* ends in *${verb.match(/(ch|sh|s|x|o)$/u)?.[0]}*, so it adds *-es*`,
      `*${verb}* 以 *${verb.match(/(ch|sh|s|x|o)$/u)?.[0]}* 结尾，所以加 *-es*`,
    );
  return t(`*${verb}* just adds *-s*`, `*${verb}* 直接加 *-s*`);
};

/** thirdWhy explains the -s form in a gapped sentence about one person. */
const thirdWhy = (right: string, shown: string): Text => {
  const sentence = shown.replace(/ \(.*\)$/u, "").replace("___", `*${right}*`);
  const rule = thirdRule(shown.match(/\((.*)\)$/u)?.[1] ?? "", right);
  return t(
    `*${shown.split(" ___")[0]}* is one person, so the verb needs an ending, and ${rule.en}: ${sentence}`,
    `*${shown.split(" ___")[0]}* 是单个的人，动词要加词尾；${rule["zh-CN"]}：${sentence}`,
  );
};

const thirdPersonS: TopicDef = {
  id: "third-person-s",
  title: t("He Plays, She Watches", "He plays, she watches：动词加 -s"),
  summary: t(
    "After he, she, it or one person, a verb in the present simple ends in -s or -es.",
    "主语是 he、she、it 或单个的人时，一般现在时的动词加 -s 或 -es。",
  ),
  prerequisites: ["present-simple", "he-she-and-it"],
  encompasses: [{ topic: "present-simple", weight: 0.5 }],
  xp: 20,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("Adding -s after he and she", "he 和 she 后面加 -s"),
      t(
        "After *he*, *she*, *it* or one person, the verb ends in *-s*: *She gets up at seven. Tom plays football.*\n\nAdd *-es* after *ch*, *sh*, *s*, *x* and *o*: *watches*, *brushes*, *goes*, *does*. A consonant and *y* becomes *-ies*: *study* → *studies*. *Have* becomes *has*.",
        "主语是 *he*、*she*、*it* 或单个的人时，动词要加 *-s*：*She gets up at seven. Tom plays football.* 中文动词从不变化，所以漏掉这个 *-s* 是最常见的错误。\n\n以 *ch*、*sh*、*s*、*x*、*o* 结尾的动词加 *-es*：*watches*、*brushes*、*goes*、*does*。辅音字母加 *y* 结尾的，变 *y* 为 *i* 再加 *-es*：*study* → *studies*。*have* 变成 *has*。",
      ),
      choiceGenerator(
        t("Choose the word for the gap.", "选出填入空白处的词。"),
        thirdChoiceBank,
        (right, shown) => thirdWhy(right, shown),
        (wrong, _right, shown, position) =>
          position === 0
            ? t(
                `*${wrong}* has no ending, but after one person like *${shown.split(" ___")[0]}* the verb needs one.`,
                `*${wrong}* 没有词尾，可主语是 *${shown.split(" ___")[0]}* 这样的单个人时，动词要加词尾。`,
              )
            : t(
                `*${wrong}* is not how this verb is spelled: *-es* goes after *ch*, *sh*, *s*, *x* and *o*, and *-ies* only after a consonant and *y*.`,
                `*${wrong}* 拼错了：*-es* 用在 *ch*、*sh*、*s*、*x*、*o* 后面，*-ies* 只用在辅音字母加 *y* 后面。`,
              ),
      ),
    ),
    point(
      "spell",
      t("Spelling the -s form", "拼写 -s 形式"),
      t(
        "Type the verb with its ending after one person: most verbs add *-s*, verbs that end in *ch*, *sh*, *s*, *x* or *o* add *-es*, a consonant and *y* becomes *-ies*, and *have* becomes *has*.",
        "写出单数第三人称后加了词尾的动词：大多数动词加 *-s*；以 *ch*、*sh*、*s*、*x*、*o* 结尾的加 *-es*；辅音字母加 *y* 结尾的变成 *-ies*；*have* 变成 *has*。",
      ),
      typedGenerator("word-form", t("Type the verb in the right form.", "输入动词的正确形式。"), thirdTypedBank, thirdWhy),
    ),
    point(
      "fix",
      t("Finding the missing -s", "找出漏掉的 -s"),
      t(
        "Each sentence is about one person, like *Tom* or *my mom*, but its verb has no ending, the way a Chinese verb never changes. Give the verb the ending it needs and write the sentence again.",
        "每个句子说的都是一个人，比如 *Tom* 或 *my mom*，但动词像中文一样没有变化。给动词加上需要的词尾，把句子重写一遍。",
      ),
      typedGenerator("sentence", t("Fix the sentence.", "改正这个句子。"), thirdFixBank, (right, shown) => {
        const subject = singleSubjects.find((s) => shown.startsWith(`${s} `)) ?? "";
        const verb = shown.slice(subject.length + 1).split(" ")[0] ?? "";
        const third = right.slice(subject.length + 1).split(" ")[0] ?? "";
        const rule = thirdRule(verb, third);
        return t(
          `*${subject}* is one person, so the verb needs an ending, and ${rule.en}: ${shown} → ${right}`,
          `*${subject}* 是单个的人，动词要加词尾；${rule["zh-CN"]}：${shown} → ${right}`,
        );
      }),
    ),
  ],
};

// Always, usually, sometimes, never.

/** frequencyVerbs are routines with a plain subject and a verb. */
const frequencyActions: readonly (readonly [subject: string, verb: string, rest: string])[] = [
  ["I", "get", "up at seven"],
  ["We", "walk", "to school"],
  ["She", "watches", "TV after dinner"],
  ["They", "play", "football on Saturday"],
  ["Tom", "eats", "rice for lunch"],
  ["My dad", "works", "at home"],
  ["I", "do", "my homework after school"],
  ["You", "brush", "your teeth at night"],
  ["Lily", "reads", "before bed"],
  ["He", "rides", "his bike to school"],
  ["We", "have", "pizza on Friday"],
  ["My sister", "plays", "the piano after school"],
  ["They", "go", "to the park on Sunday"],
  ["I", "drink", "milk at breakfast"],
  ["Ben", "takes", "the bus to school"],
  ["My mom", "cooks", "dinner"],
  ["You", "help", "your dad on Saturday"],
  ["Anna", "walks", "the dog in the morning"],
  ["We", "eat", "fish on Friday"],
  ["My grandpa", "sleeps", "after lunch"],
  ["The cat", "sleeps", "on my bed"],
  ["They", "watch", "a film on Friday night"],
];

/** frequencyStates are sentences with be, where the word goes after the verb. */
const frequencyStates: readonly (readonly [subject: string, be: string, rest: string])[] = [
  ["I", "am", "tired on Monday"],
  ["She", "is", "late for school"],
  ["They", "are", "at home on Sunday"],
  ["The bus", "is", "full"],
  ["We", "are", "happy at the weekend"],
  ["He", "is", "hungry after school"],
  ["My mom", "is", "busy"],
  ["The shop", "is", "open on Sunday"],
  ["My room", "is", "clean"],
  ["Our teacher", "is", "kind"],
  ["You", "are", "late"],
  ["The park", "is", "busy at the weekend"],
];

/** placedAdverbs are the words of frequency that can't also end a sentence, so a sentence ending in one is wrong. */
const placedAdverbs: readonly string[] = ["always", "usually", "never"];

const frequencyChoiceBank: readonly ChoiceItem[] = interleave([
  everyPair(frequencyActions, placedAdverbs).map(
    ([[subject, verb, rest], adverb]): ChoiceItem => [
      `${subject} / ${verb} ${rest} (${adverb})`,
      `${subject} ${adverb} ${verb} ${rest}.`,
      [`${subject} ${verb} ${adverb} ${rest}.`, `${subject} ${verb} ${rest} ${adverb}.`],
    ],
  ),
  everyPair(frequencyStates, placedAdverbs).map(
    ([[subject, be, rest], adverb]): ChoiceItem => [
      `${subject} / ${be} ${rest} (${adverb})`,
      `${subject} ${be} ${adverb} ${rest}.`,
      [`${subject} ${adverb} ${be} ${rest}.`, `${subject} ${be} ${rest} ${adverb}.`],
    ],
  ),
]);

const frequencyTypedBank: readonly TypedItem[] = interleave([
  everyPair(frequencyActions, [...placedAdverbs].reverse()).map(
    ([[subject, verb, rest], adverb]): TypedItem => ({
      shown: `${subject} ${verb} ${rest}. (${adverb})`,
      accepted: [`${subject} ${adverb} ${verb} ${rest}.`],
      wrong: [`${subject} ${verb} ${adverb} ${rest}.`, `${subject} ${verb} ${rest} ${adverb}.`],
      instruction: t("Put the word in brackets in the sentence.", "把括号里的词放进句子。"),
    }),
  ),
  everyPair(frequencyStates, [...placedAdverbs].reverse()).map(
    ([[subject, be, rest], adverb]): TypedItem => ({
      shown: `${subject} ${be} ${rest}. (${adverb})`,
      accepted: [`${subject} ${be} ${adverb} ${rest}.`],
      wrong: [`${subject} ${adverb} ${be} ${rest}.`, `${subject} ${be} ${rest} ${adverb}.`],
      instruction: t("Put the word in brackets in the sentence.", "把括号里的词放进句子。"),
    }),
  ),
]);

/** frequencyWhy says where a word like always goes in a sentence, before the verb or after be. */
const frequencyWhy = (right: string, shown: string): Text => {
  const adverb = shown.match(/\((\w+)\)$/u)?.[1] ?? "";
  const verb = (shown.includes(" / ") ? shown.split(" / ")[1] : shown.split(" ").slice(1).join(" "))?.split(" ")[0] ?? "";
  return ["am", "is", "are"].includes(verb)
    ? t(`*${adverb}* goes after *${verb}*, not before it: ${right}`, `*${adverb}* 放在 *${verb}* 后面，而不是前面：${right}`)
    : t(
        `*${adverb}* goes in the middle of the sentence, right before a verb like *${verb}*: ${right}`,
        `*${adverb}* 放在句子中间，紧挨在 *${verb}* 这样的动词前面：${right}`,
      );
};

/** whyNotFrequency says where a wrong sentence puts a word like always. */
const whyNotFrequency = (_wrong: string, _right: string, shown: string, position: number): Text => {
  const verb = shown.split(" / ")[1]?.split(" ")[0] ?? "";
  if (position === 1)
    return t(
      "This puts the word at the end, as a Chinese speaker might, but it goes in the middle, next to the verb.",
      "这句把这个词放在了句末，可它要放在句子中间，紧挨着动词。",
    );
  return ["am", "is", "are"].includes(verb)
    ? t(
        `This puts the word before *${verb}*, but with *am*, *is* and *are* it goes after.`,
        `这句把这个词放在了 *${verb}* 前面，可遇到 *am*、*is*、*are* 时要放在后面。`,
      )
    : t(
        `This puts the word after *${verb}*, but with a verb like this it goes before.`,
        `这句把这个词放在了 *${verb}* 后面，可遇到这样的动词时要放在前面。`,
      );
};

const adverbsOfFrequency: TopicDef = {
  id: "adverbs-of-frequency",
  title: t("Always, Usually, Never", "always、usually、never：频度副词"),
  summary: t(
    "I always get up at seven. She is never late. These words go before the verb, but after am, is and are.",
    "I always get up at seven. She is never late. 这些词放在动词前，但放在 am、is、are 之后。",
  ),
  prerequisites: ["present-simple", "a1-words-how-often"],
  encompasses: [{ topic: "a1-words-how-often", weight: 0.4 }],
  xp: 15,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("Where the word goes", "这些词放在哪里"),
      t(
        "*always* (every time), *usually*, *often*, *sometimes*, *never* (not at any time).\n\nThey go before the verb: *I always get up at seven.* But they go after *am*, *is* and *are*: *She is never late.*",
        "*always*（总是）、*usually*（通常）、*often*（经常）、*sometimes*（有时）、*never*（从不）。\n\n它们放在一般动词前面：*I always get up at seven.* 但放在 *am*、*is*、*are* 后面：*She is never late.* 不要像中文“我七点起床总是”那样放在句末。",
      ),
      choiceGenerator(
        t("Which sentence puts the word in the right place?", "哪个句子把这个词放对了位置？"),
        frequencyChoiceBank,
        frequencyWhy,
        whyNotFrequency,
      ),
    ),
    point(
      "write",
      t("Putting the word in", "把词放进句子"),
      t(
        "Write the sentence with the word: before a verb like *get* or *walk*, after *am*, *is* or *are*.",
        "把这个词放进句子：放在 *get*、*walk* 这样的动词前，放在 *am*、*is*、*are* 后。",
      ),
      typedGenerator("sentence", t("Write the sentence again.", "重写这个句子。"), frequencyTypedBank, frequencyWhy),
    ),
  ],
};

// Writing about routines.

/** clock turns an hour into digits and words. */
const clock: Readonly<Record<number, readonly [digits: string, words: string]>> = {
  4: ["4:00", "four"],
  5: ["5:00", "five"],
  6: ["6:00", "six"],
  7: ["7:00", "seven"],
  8: ["8:00", "eight"],
  9: ["9:00", "nine"],
  10: ["10:00", "ten"],
  12: ["12:00", "twelve"],
};

const routineNames: readonly string[] = ["Lily", "Tom", "My mom", "Ben", "My sister", "Our teacher"];

/** routineNotes are a routine, its -s form and two likely hours for it. */
const routineNotes: readonly (readonly [verb: string, third: string, hours: readonly [number, number]])[] = [
  ["get up", "gets up", [6, 7]],
  ["have breakfast", "has breakfast", [7, 8]],
  ["go to school", "goes to school", [8, 7]],
  ["eat lunch", "eats lunch", [12, 12]],
  ["finish school", "finishes school", [4, 5]],
  ["watch TV", "watches TV", [7, 8]],
  ["go to bed", "goes to bed", [9, 10]],
  ["do homework", "does homework", [5, 6]],
  ["feed the cat", "feeds the cat", [7, 6]],
  ["walk the dog", "walks the dog", [6, 5]],
  ["come home", "comes home", [5, 4]],
];

const routineItems = pairUp(42, routineNames, routineNotes).map(([name, [verb, third, hours]], k) => {
  const [digits, words] = clock[hours[Math.floor(k / routineNotes.length) % 2] ?? 7] ?? ["7:00", "seven"];
  const note = `${name} / ${verb} / ${digits}`;
  const right = `${name} ${third} at ${words} o'clock.`;
  return { note, right, pattern: `${name} ${third} at [${words}( o'clock)|${digits}].`, verb, words, name };
});

const routineTypedBank: readonly TypedItem[] = routineItems.map(
  ({ note, right, pattern, verb, words, name }): TypedItem => ({
    shown: note,
    accepted: [pattern],
    canonical: right,
    wrong: [`${name} ${verb} at ${words} o'clock.`, `${name} at ${words} o'clock ${verb}.`],
  }),
);

const routineChoiceBank: readonly ChoiceItem[] = routineItems.map(
  ({ note, right, verb, words, name }, i): ChoiceItem => [
    note,
    right,
    [
      `${name} ${verb} at ${words} o'clock.`,
      `At ${words} o'clock ${name.charAt(0).toLowerCase()}${name.slice(1)} ${i % 2 === 0 ? verb : (right.slice(name.length + 1).split(" at ")[0] ?? verb)}.`,
    ],
  ],
);

/** routineWhy explains a sentence about a routine from its note: the -s after one person, then at and the time. */
const routineWhy = (right: string, shown: string): Text => {
  const [name = "", verb = ""] = shown.split(" / ");
  const third = right.slice(name.length + 1).split(" at ")[0] ?? "";
  return t(
    `*${name}* is one person, so *${verb}* becomes *${third}*, and the time goes last, after *at*: ${right}`,
    `*${name}* 是单个的人，所以 *${verb}* 变成 *${third}*；时间放在句末，前面加 *at*：${right}`,
  );
};

const routinesWriting: TopicDef = {
  id: "writing-sentences-about-routines",
  title: t("Writing About Routines", "写日常作息"),
  summary: t(
    "Turn notes into sentences about a day: Lily / get up / 7:00 becomes Lily gets up at seven o'clock.",
    "把笔记写成描述一天的句子：Lily / get up / 7:00 写成 Lily gets up at seven o'clock.",
  ),
  prerequisites: ["third-person-s", "writing-capitals-and-periods"],
  encompasses: [
    { topic: "third-person-s", weight: 0.4 },
    { topic: "writing-capitals-and-periods", weight: 0.2 },
  ],
  xp: 20,
  strand: "writing",
  knowledgePoints: [
    point(
      "choose",
      t("The sentence for a note", "选出符合笔记的句子"),
      t(
        "A note gives who, what and when. The sentence keeps that order and adds what the note leaves out: the *-s* after one person, *at* before the time, a capital letter and a period.\n\n*Lily / get up / 7:00* → *Lily gets up at seven o'clock.*",
        "笔记给出“谁、做什么、什么时候”。写成句子时保持这个顺序，并补上笔记省略的部分：单数主语后动词加 *-s*，时间前加 *at*，句首大写，句末加句号。\n\n*Lily / get up / 7:00* → *Lily gets up at seven o'clock.*\n\n注意时间放在句末，不像中文“莉莉七点起床”那样放在动词前。",
      ),
      choiceGenerator(
        t("Choose the sentence that matches the note.", "选出与笔记相符的句子。"),
        routineChoiceBank,
        routineWhy,
        (wrong, _right, shown, position) =>
          position === 0
            ? t(
                "This leaves the verb as it is in the note, but after one person it needs *-s*.",
                "这句的动词照抄了笔记，可单数主语后的动词要加 *-s*。",
              )
            : !wrong.endsWith(` ${shown.split(" / ")[1] ?? ""}.`)
              ? t(
                  "The verb has its *-s*, but this puts the time first, as Chinese does. In English the time goes last, after *at*.",
                  "这句动词加了 *-s*，却像中文一样把时间放在前面。英语里时间要放在句末，前面加 *at*。",
                )
              : t(
                  "This puts the time first, as Chinese does, and leaves out the *-s* the verb needs after one person.",
                  "这句像中文一样把时间放在前面，单数主语后的动词也漏了 *-s*。",
                ),
      ),
    ),
    point(
      "write",
      t("Writing the sentence", "写出句子"),
      t(
        "Write a whole sentence for the note. You can write the time in words or in numbers: *at seven o'clock* or *at 7:00*.",
        "根据笔记写一个完整的句子。时间可以用英文单词或数字表示：*at seven o'clock* 或 *at 7:00*。",
      ),
      typedGenerator("sentence-pattern", t("Write a sentence from the note.", "根据笔记写一个句子。"), routineTypedBank, routineWhy),
    ),
  ],
};

/** topics are the topics of the unit My Day. */
export const topics: readonly TopicDef[] = [
  myDay.topic,
  timesOfDay.topic,
  howOften.topic,
  littleWords1.topic,
  thirdPersonS,
  adverbsOfFrequency,
  routinesWriting,
];

/** vocabulary are the words the unit My Day teaches. */
export const vocabulary: readonly WordBatch[] = [myDay.batch, timesOfDay.batch, howOften.batch, littleWords1.batch];
