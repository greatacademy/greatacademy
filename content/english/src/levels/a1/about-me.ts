// A1, unit 1: All About Me. Numbers to a hundred, where I live and what I speak, feelings, everyday words, and the
// present simple.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { pairUp, vocabularyTopic, word } from "../words.ts";

const numbers = vocabularyTopic({
  id: "a1-words-numbers-to-hundred",
  title: t("Numbers 13 to 100", "数字 13 到 100"),
  summary: t("Counting from thirteen to a hundred.", "从十三数到一百。"),
  prerequisites: ["pre-a1-words-numbers"],
  words: [
    word(
      "thirteen",
      "the number 13",
      "十三（13）",
      "Ten and three is {thirteen}.|thirty fourteen | Twelve, {thirteen}, fourteen.|thirty eleven | My brother is {thirteen}. Next year he will be fourteen.|thirty twelve",
      "thirty fourteen",
    ),
    word(
      "fourteen",
      "the number 14",
      "十四（14）",
      "Ten and four is {fourteen}.|forty thirteen | Thirteen, {fourteen}, fifteen.|forty sixteen | Two weeks is {fourteen} days.|forty twelve",
      "forty thirteen",
    ),
    word(
      "fifteen",
      "the number 15",
      "十五（15）",
      "Ten and five is {fifteen}.|fifty sixteen | Fourteen, {fifteen}, sixteen.|fifty thirteen | A quarter of an hour is {fifteen} minutes.|fifty fourteen",
      "fifty sixteen",
    ),
    word(
      "sixteen",
      "the number 16",
      "十六（16）",
      "Ten and six is {sixteen}.|sixty fifteen | Fifteen, {sixteen}, seventeen.|sixty fourteen | Eight and eight is {sixteen}.|eighteen fifteen",
      "sixty fifteen",
    ),
    word(
      "seventeen",
      "the number 17",
      "十七（17）",
      "Ten and seven is {seventeen}.|seventy sixteen | Sixteen, {seventeen}, eighteen.|seventy nineteen | Twenty take away three is {seventeen}.|seventy thirteen",
      "seventy sixteen",
    ),
    word(
      "eighteen",
      "the number 18",
      "十八（18）",
      "Ten and eight is {eighteen}.|eighty sixteen | Seventeen, {eighteen}, nineteen.|eighty sixteen | Nine and nine is {eighteen}.|eighty nineteen",
      "eighty sixteen",
    ),
    word(
      "nineteen",
      "the number 19",
      "十九（19）",
      "Ten and nine is {nineteen}.|ninety eighteen | Eighteen, {nineteen}, twenty.|ninety seventeen | Twenty take away one is {nineteen}.|ninety eighteen",
      "ninety eighteen",
    ),
    word(
      "twenty",
      "the number 20",
      "二十（20）",
      "Ten and ten is {twenty}.|twelve thirty | I have ten fingers and ten toes: {twenty} in all.|twelve thirty | Nineteen, {twenty}, twenty-one.|twelve thirty",
      "twelve thirty",
    ),
    word(
      "thirty",
      "the number 30",
      "三十（30）",
      "Twenty and ten is {thirty}.|thirteen forty | Many months have {thirty} days.|thirteen forty | Ten, twenty, {thirty}, forty.|thirteen fifty",
      "thirteen forty",
    ),
    word(
      "forty",
      "the number 40",
      "四十（40）",
      "Twenty and twenty is {forty}.|fourteen fifty | Thirty, {forty}, fifty.|fourteen sixty | My dad is {forty}. He was thirty-nine last year.|fourteen fifty",
      "fourteen fifty",
    ),
    word(
      "fifty",
      "the number 50",
      "五十（50）",
      "Twenty-five and twenty-five is {fifty}.|fifteen forty | Half of a hundred is {fifty}.|fifteen forty | Forty, {fifty}, sixty.|fifteen thirty",
      "fifteen forty",
    ),
    word(
      "hundred hundreds",
      "the number 100",
      "百（100）",
      "Ten tens make a {hundred}.|thirty twenty | Fifty and fifty is one {hundred}.|twenty thirty | There are {hundreds} of books in the library.|twenties fifties",
      "thirty twenty",
    ),
  ],
});

const aboutMe = vocabularyTopic({
  id: "a1-words-about-me",
  title: t("Where I Live", "我住在哪里"),
  summary: t(
    "Countries, cities and languages, and how to say where you live and what you speak.",
    "国家、城市和语言，以及怎样说你住在哪里、说什么语言。",
  ),
  prerequisites: ["pre-a1-words-hello"],
  words: [
    word(
      "country countries",
      "a land with its own name and flag, like China or Brazil",
      "国家",
      "China is a big {country}.|city language | Which {country} are you from? I'm from Japan.|city phone | France and Spain are two {countries} in Europe.|cities languages",
      "city language",
    ),
    word(
      "city cities",
      "a big town where many people live",
      "城市",
      "Beijing is a big {city}.|country language | I live in a {city}, not on a farm.|language phone | New York and London are big {cities}.|countries languages",
      "country language",
    ),
    word(
      "live lives lived living",
      "to have your home in a place",
      "住；居住",
      "I {live} in Shanghai.|speak from | Where do you {live}? In a small town.|speak from | My grandma {lives} with us.|speaks emails",
      "speak from",
    ),
    word(
      "from",
      "showing the place where someone or something started",
      "来自；从",
      "I am {from} China.|live speak | Where are you {from}? I'm from Canada.|live speak | This email is {from} my friend.|live speak",
      "live speak",
    ),
    word(
      "speak speaks spoke spoken speaking",
      "to say words; to use a language",
      "说（某种语言）；讲话",
      "I {speak} Chinese and English.|live from | Can you {speak} slowly, please?|live from | She {speaks} three languages.|lives phones",
      "live from",
    ),
    word(
      "English",
      "the language of the US, the UK and many other countries",
      "英语；英国的",
      "People in the US speak {English}.|Chinese country | Hello is an {English} word. In Chinese it is nǐ hǎo.|Chinese city | My {English} teacher is from London.|Chinese phone",
      "Chinese country",
    ),
    word(
      "Chinese",
      "the language of China; from China",
      "中文；中国的",
      "People in China speak {Chinese}.|English country | Nǐ hǎo means hello in {Chinese}.|English city | We eat {Chinese} food with chopsticks.|English email",
      "English country",
    ),
    word(
      "language languages",
      "the words people use to speak and write, like English or Chinese",
      "语言",
      "English is a {language}.|country city | How many {languages} can you speak?|countries cities | Chinese is my first {language}.|country number",
      "country city",
    ),
    word(
      "phone phones",
      "a thing you use to call and talk to people far away",
      "电话；手机",
      "Call me on my {phone}.|email city | My {phone} is ringing!|email language | Turn off your {phones} in class.|languages countries",
      "email city",
    ),
    word(
      "number numbers",
      "a word or sign like one, 2 or ten",
      "数字；号码",
      "What is your phone {number}?|email city | Seven is my lucky {number}.|language country | Write the {numbers} from one to ten.|languages countries",
      "email language",
    ),
    word(
      "email emails",
      "a message you send on a computer or a phone",
      "电子邮件",
      "I send an {email} to my teacher.|phone number | Check your {email}. I sent you a photo.|language city | I get many {emails} every day.|languages countries",
      "phone number",
    ),
  ],
});

const feelings = vocabularyTopic({
  id: "a1-words-feelings",
  title: t("How I Feel", "我的感受"),
  summary: t(
    "Saying how you feel: fine, tired, sick, angry, afraid; and what you hate.",
    "说说你的感受：fine、tired、sick、angry、afraid，以及你讨厌什么。",
  ),
  prerequisites: ["pre-a1-words-little-words"],
  words: [
    word(
      "feel feels felt feeling",
      "to have a feeling in your body or your mind",
      "感觉；觉得",
      "I {feel} happy today.|speak live | How do you {feel}? I feel tired.|speak live | She {felt} sick after lunch.|spoke lived",
      "speak live",
    ),
    word(
      "fine",
      "well, or good enough",
      "好的；不错的",
      "How are you? I'm {fine}, thanks.|angry afraid | Don't worry, it's {fine}. There is no problem.|tired sick | The weather is {fine} today. Let's go out.|tired afraid",
      "angry afraid",
      "okay well",
    ),
    word(
      "well",
      "healthy, not sick; also, in a good way",
      "健康的；好地",
      "I was sick, but now I am {well} again.|sick tired | She sings very {well}.|tired afraid | Get {well} soon!|tired angry",
      "sick tired",
      "fine okay",
    ),
    word(
      "okay",
      "all right; not bad",
      "好的；还行",
      "Is it {okay} if I sit here? — Sure.|tired afraid | Are you {okay}? You look sad.|again now | The food is {okay}, but it's not great.|angry afraid",
      "tired afraid",
      "fine well",
    ),
    word(
      "great greater greatest",
      "very good",
      "很棒的；极好的",
      "You won! That's {great}!|tired sick | We had a {great} time at the party.|tired sick | Your English is {great}!|afraid angry",
      "tired sick",
    ),
    word(
      "tired",
      "needing rest or sleep",
      "累的；疲倦的",
      "I ran ten kilometers. Now I am very {tired}.|afraid well | The baby is {tired}. She needs a sleep.|great again | You look {tired}. Did you sleep well?|great again",
      "great again",
    ),
    word(
      "sick",
      "not well; ill",
      "生病的",
      "I am {sick}. I have a cold.|great fine | Tom is {sick} today, so he is at home.|great okay | I feel {sick}. I ate too much cake.|great fine",
      "great fine",
    ),
    word(
      "angry",
      "feeling very bad about something someone did",
      "生气的",
      "Mom is {angry}. I broke her cup.|tired great | Don't be {angry} with me. I'm sorry.|tired well | The man shouts. He is very {angry}.|tired well",
      "tired great",
    ),
    word(
      "afraid",
      "feeling that something bad will happen",
      "害怕的",
      "I am {afraid} of dogs.|angry tired | Don't be {afraid}. The dog is friendly.|great tired | The little girl is {afraid} of the dark.|angry sick",
      "angry tired",
    ),
    word(
      "now",
      "at this time",
      "现在",
      "It is raining {now}.|again afraid | Do your homework {now}, not later.|again well | I was tired, but {now} I feel fine.|again well",
      "again well",
    ),
    word(
      "again",
      "one more time",
      "再；又",
      "Can you say that {again}, please?|well okay | Hello {again}! Nice to see you.|now fine | I'm sick {again}! This is the third time this month.|now well",
      "now well",
    ),
    word(
      "hate hates hated hating",
      "to dislike someone or something very much",
      "讨厌；憎恨",
      "I {hate} cold weather.|tired sick | My brother {hates} getting up early.|sick angry | She loves cats, but she {hates} dogs.|afraid fine",
      "heat hat",
    ),
  ],
});

const everyday = vocabularyTopic({
  id: "a1-words-everyday-words",
  title: t("Everyday Words", "日常用词"),
  summary: t("Common words for things, places, people and ideas.", "表示东西、地方、人和想法的常用词。"),
  prerequisites: ["pre-a1-words-little-words"],
  words: [
    word(
      "thing things",
      "an object; something you can see or touch",
      "东西；事情",
      "What is that {thing} on the table?|person life | Put your {things} in your bag.|people places | There are many {things} to do today.|persons lives",
      "person life",
    ),
    word(
      "place places",
      "a part of a town or of the world; where something is",
      "地方",
      "This park is a nice {place} to play.|person life | Put the book back in its {place}.|person life | Paris is a beautiful {place}. I want to go there.|person idea",
      "person life",
    ),
    word(
      "person",
      "one man, woman or child",
      "人",
      "She is a very kind {person}.|thing place | One {person} can sit in this chair.|thing place | Who is that {person} at the door?|idea life",
      "thing place",
    ),
    word(
      "life",
      "the time when someone is alive; the way someone lives",
      "生活；生命",
      "My grandma had a long, happy {life}.|thing part | This is the best day of my {life}!|idea part | {Life} in a big city is busy.|Idea Part",
      "idea part",
    ),
    word(
      "idea ideas",
      "a thought or a plan",
      "主意；想法",
      "Let's go to the park! — Good {idea}!|life person | I have an {idea}. Let's make a cake.|place part | Do you have any {ideas} for the party?|lives parts",
      "place part",
    ),
    word(
      "part parts",
      "one of the pieces of a whole thing",
      "部分",
      "The head is a {part} of the body.|life idea | I like the first {part} of the story.|life person | A car has many {parts}.|lives ideas",
      "life idea",
    ),
    word(
      "cry cries cried crying",
      "to have tears come from your eyes",
      "哭",
      "The baby {cries} when he is hungry.|lives speaks | Don't {cry}. Everything is okay.|live speak | She {cried} at the end of the sad movie.|lived spoke",
      "live speak",
    ),
    word(
      "high higher highest",
      "far above the ground; tall",
      "高的",
      "The bird flies {high} in the sky.|low ready | This mountain is very {high}.|low sure | The shelf is too {high}. I can't reach it.|low ready",
      "low ready",
    ),
    word(
      "low lower lowest",
      "near the ground; not high",
      "低的；矮的",
      "The table is {low}. Small children can sit at it.|high sure | The sun is {low} in the sky in the evening.|high real | Speak in a {low} voice in the library.|high ready",
      "high sure",
    ),
    word(
      "sure",
      "knowing that something is true",
      "确定的；肯定的",
      "Are you {sure}? — Yes, I know it's right.|low real | I'm not {sure} where my pen is.|high low | Can I use your phone? — {Sure}, here you are.|Low High",
      "low real",
    ),
    word(
      "ready",
      "prepared and able to start",
      "准备好的",
      "Dinner is {ready}! Come and eat.|sure high | Are you {ready} for school? Let's go!|sure high | I'm {ready} to start the test.|high low",
      "sure high",
    ),
    word(
      "real",
      "true; not made up",
      "真的；真实的",
      "Is that a {real} cat or a toy?|ready sure | This is a {real} story. It happened to my grandpa.|ready high | Dragons are not {real}.|ready sure",
      "ready sure",
    ),
  ],
});

// The present simple with I, you, we and they.

/** plainSubjects take the verb with no ending. */
const plainSubjects: readonly string[] = ["I", "You", "We", "They", "My parents", "Tom and I", "My friends"];

/** verbPhrases are a verb and the rest, true of anyone. */
const verbPhrases: readonly (readonly [verb: string, rest: string, ing: string])[] = [
  ["live", "in Beijing", "living"],
  ["speak", "English", "speaking"],
  ["like", "apples", "liking"],
  ["have", "a cat", "having"],
  ["go", "to school by bus", "going"],
  ["read", "books every day", "reading"],
  ["eat", "rice for lunch", "eating"],
  ["love", "music", "loving"],
  ["walk", "to the park", "walking"],
  ["play", "football", "playing"],
  ["speak", "Chinese at home", "speaking"],
];

const plainBank: readonly (readonly [subject: string, verb: string, rest: string, ing: string])[] = pairUp(
  44,
  plainSubjects,
  verbPhrases,
).map(([subject, [verb, rest, ing]]) => [subject, verb, rest, ing] as const);

const beFor = (subject: string) => (subject === "I" ? "am" : "are");

const presentChoiceBank: readonly ChoiceItem[] = plainBank.map(
  ([subject, verb, rest, ing]): ChoiceItem => [`${subject} ___ ${rest}. (${verb})`, verb, [`${beFor(subject)} ${verb}`, ing]],
);

const presentTypedBank: readonly TypedItem[] = pairUp(35, plainSubjects, verbPhrases.slice(0, 5)).map(
  ([subject, [verb, rest]]): TypedItem => {
    const be = beFor(subject);
    return {
      shown: `${subject} ${be} ${verb} ${rest}.`,
      accepted: [`${subject} ${verb} ${rest}.`],
      wrong: [`${subject} ${be} ${verb} ${rest}.`, `${subject} ${verb}s ${rest}.`],
    };
  },
);

const presentSimple: TopicDef = {
  id: "present-simple",
  title: t("The Present Simple", "一般现在时"),
  summary: t(
    "I live in Beijing. We speak Chinese. What is true or usual, with no ending after I, you, we and they.",
    "I live in Beijing. We speak Chinese. 一般现在时说明真实或经常的情况；I、you、we、they 后面的动词不加词尾。",
  ),
  prerequisites: ["the-verb-be", "a1-words-about-me"],
  encompasses: [{ topic: "a1-words-about-me", weight: 0.3 }],
  xp: 15,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("The plain verb", "动词原形"),
      t(
        "To say what is true or what happens often, use the present simple. With *I*, *you*, *we*, *they* and more than one person, the verb is plain: *I live in Beijing. We speak Chinese. My friends play football.*",
        "说明真实情况或经常发生的事，用一般现在时。主语是 *I*、*you*、*we*、*they* 或多个人时，动词用原形：*I live in Beijing. We speak Chinese. My friends play football.*",
      ),
      choiceGenerator(t("Choose the words for the gap.", "选出填入空白处的词。"), presentChoiceBank, (right, shown) =>
        t(
          shown.replace(/ \(.*\)$/u, "").replace("___", `*${right}*`),
          `${shown.replace(/ \(.*\)$/u, "").replace("___", `*${right}*`)}（一般现在时，动词用原形）`,
        ),
      ),
    ),
    point(
      "no-be",
      t("No am or are before the verb", "动词前不加 am 或 are"),
      t(
        "A sentence with a verb like *live*, *speak* or *like* needs no *am*, *is* or *are*. Not *I am live in Beijing.* but *I live in Beijing.*",
        "句子里已经有 *live*、*speak*、*like* 这样的动词时，就不再需要 *am*、*is*、*are*。说中文的人学了 *I am* 以后，常写出 *I am live in Beijing.*，正确的是 *I live in Beijing.*",
      ),
      typedGenerator("sentence", t("Fix the sentence.", "改正这个句子。"), presentTypedBank, (right, shown) =>
        t(`${shown} → ${right}`, `${shown} → ${right}（已有动词，去掉 am 或 are）`),
      ),
    ),
  ],
};

const littleWords3 = vocabularyTopic({
  id: "a1-words-little-words-3",
  title: t("Little Words 3", "小词 3"),
  summary: t("As, let's, each, alone and onto; oh, wow, hey and yeah.", "as、let's、each、alone 和 onto；oh、wow、hey 和 yeah。"),
  prerequisites: ["a1-words-everyday-words"],
  words: [
    word(
      "as",
      "in the same way; in the job or role of",
      "像……一样；作为",
      "She is {as} tall as her mother.|so than | He works {as} a cook in a big hotel.|so than | Do {as} I do: watch and then try.|than so",
      "so than",
    ),
    word(
      "let's",
      "let us; a way to say what you want to do together",
      "让我们",
      "It's sunny. {Let's} go to the park!|We're Each | {Let's} have pizza for dinner.|Wow Each | I'm hungry. {Let's} eat now.|Hey Each",
      "we're each",
    ),
    word(
      "each",
      "every one of two or more, one by one",
      "每个",
      "The teacher gave a book to {each} child.|alone onto | {Each} room has a window.|Alone Onto | The apples are fifty cents {each}.|alone onto",
      "every alone",
      "every",
    ),
    word(
      "alone",
      "with no other people",
      "独自；单独",
      "My grandpa lives {alone}, so we visit him every Sunday.|each onto | Don't go into the forest {alone}.|each onto | I like to read {alone} in my room.|each onto",
      "each onto",
    ),
    word(
      "onto",
      "to a place on something",
      "到……上",
      "The cat jumped {onto} the table.|alone each | Put the plates {onto} the tray.|alone each | She climbed {onto} the bus with her bags.|alone each",
      "into alone",
    ),
    word(
      "oh",
      "a word you say when you are surprised or you remember something",
      "哦；啊",
      "{Oh}, I forgot my keys!|As Each | {Oh} no! It's raining and I have no umbrella.|As Onto | {Oh}, it's you! Come in.|Each Onto",
      "wow hey",
    ),
    word(
      "wow",
      "a word you say when something is very good or surprising",
      "哇",
      "{Wow}! What a beautiful dress!|Each Onto | {Wow}, you are very good at drawing!|As Alone | You got a new bike? {Wow}!|Each Alone",
      "oh hey",
    ),
    word(
      "hey",
      "a friendly word to say hello or to make someone look at you",
      "嘿",
      "{Hey}, Tom! How are you?|Each As | {Hey}! That's my bag!|Onto Each | {Hey}, look at this photo.|Alone Onto",
      "oh wow",
    ),
    word(
      "yeah",
      "yes, in friendly talk",
      "是啊；对",
      "Are you hungry? — {Yeah}, a little.|Each Alone | Do you like it? — {Yeah}, it's great!|Onto As | {Yeah}, I can come to your party.|Each Onto",
      "hey oh",
    ),
  ],
});

/** topics are the topics of the unit All About Me. */
export const topics: readonly TopicDef[] = [
  numbers.topic,
  aboutMe.topic,
  feelings.topic,
  everyday.topic,
  littleWords3.topic,
  presentSimple,
];

/** vocabulary are the words the unit All About Me teaches. */
export const vocabulary: readonly WordBatch[] = [numbers.batch, aboutMe.batch, feelings.batch, everyday.batch, littleWords3.batch];
