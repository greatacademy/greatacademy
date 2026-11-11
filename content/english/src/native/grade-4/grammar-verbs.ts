// Grade 4: the grammar topics about verbs: helping verbs, agreement after there and here, compound subjects and
// predicates, adverbs that compare, and the tricky pairs lie and lay, sit and set, rise and raise. Most banks are
// frames whose slots take subjects of a list, so each knowledge point has thirty items or more.

import { type TopicDef, t } from "@ga/content";
import { point, type TypedItem, typedGenerator } from "@ga/subject-english";
import { capital, fields, fill, type Item, itemGenerator, nameKind } from "./kit.ts";
import { after } from "./prior.ts";

// Helping verbs.

/** Subject is a subject of a frame: its words and whether it names one or more than one. */
interface Subject {
  readonly words: string;
  readonly zh: string;
  readonly plural: boolean;
}

const helperSubjects: readonly Subject[] = [
  { words: "the ranger", zh: "护林员", plural: false },
  { words: "the scientists", zh: "科学家们", plural: true },
  { words: "my sister", zh: "我姐姐", plural: false },
  { words: "the two hikers", zh: "两个徒步者", plural: true },
  { words: "our teacher", zh: "我们的老师", plural: false },
];

/** HelperFrame is a sentence with a helping verb: its forms for one and for many, wrong forms, and why. */
interface HelperFrame {
  /** text has {S} for the subject and ___ for the helping verb. */
  readonly text: string;
  readonly one: string;
  readonly many: string;
  /** other is a helping verb of another time or kind that does not fit, for one and for many. */
  readonly other: readonly [one: string, many: string];
  readonly main: string;
  /** word is a word of the sentence that is not a verb, with what it does. */
  readonly word: readonly [word: string, en: string, zh: string];
  readonly why: readonly [en: string, zh: string];
}

const helperFrames: readonly HelperFrame[] = [
  {
    text: "Right now {S} ___ watching the lava flow.",
    one: "is",
    many: "are",
    other: ["was", "were"],
    main: "watching",
    word: ["now", "tells when", "表示时间"],
    why: [
      "*Right now* points to the present, so the helping verb is *is* or *are* before the *-ing* verb",
      "*Right now* 指现在，所以 *-ing* 动词前的助动词用 *is* 或 *are*",
    ],
  },
  {
    text: "Last night {S} ___ sleeping when the ground shook.",
    one: "was",
    many: "were",
    other: ["is", "are"],
    main: "sleeping",
    word: ["night", "names a time", "表示时间的名词"],
    why: [
      "*Last night* points to the past, so the helping verb is *was* or *were* before the *-ing* verb",
      "*Last night* 指过去，所以 *-ing* 动词前的助动词用 *was* 或 *were*",
    ],
  },
  {
    text: "{S} ___ already measured the crack in the road.",
    one: "has",
    many: "have",
    other: ["does", "do"],
    main: "measured",
    word: ["already", "tells when", "表示时间"],
    why: [
      "*has* or *have* comes before a past participle such as *measured*, and *already* shows the action is finished",
      "*has* 或 *have* 放在 *measured* 这样的过去分词前，*already* 表示动作已经完成",
    ],
  },
  {
    text: "{S} ___ studied volcanoes for ten years.",
    one: "has",
    many: "have",
    other: ["is", "are"],
    main: "studied",
    word: ["volcanoes", "is a noun, the thing studied", "是名词，表示所研究的对象"],
    why: [
      "*for ten years* reaches from the past up to now, which *has* or *have* with *studied* shows",
      "*for ten years* 从过去一直延续到现在，用 *has* 或 *have* 加 *studied* 来表示",
    ],
  },
  {
    text: "{S} ___ not like the smell of the hot springs.",
    one: "does",
    many: "do",
    other: ["has", "have"],
    main: "like",
    word: ["not", "makes the sentence negative", "使句子成为否定"],
    why: [
      "a present-tense sentence with *not* needs *does* or *do* before the plain verb *like*",
      "含 *not* 的一般现在时句子，要在动词原形 *like* 前用 *does* 或 *do*",
    ],
  },
  {
    text: "{S} ___ climbing the steep trail all afternoon yesterday.",
    one: "was",
    many: "were",
    other: ["is", "are"],
    main: "climbing",
    word: ["trail", "is a noun, the path", "是名词，表示小路"],
    why: [
      "*yesterday* puts the action in the past, so the helping verb is *was* or *were* before *climbing*",
      "*yesterday* 把动作放在过去，所以 *climbing* 前用 *was* 或 *were*",
    ],
  },
  {
    text: "Every morning {S} ___ not forget to check the instruments.",
    one: "does",
    many: "do",
    other: ["is", "are"],
    main: "forget",
    word: ["morning", "names a time", "表示时间的名词"],
    why: [
      "*every morning* is a habit in the present, and with *not* the helping verb is *does* or *do* before the plain verb",
      "*every morning* 表示现在的习惯，含 *not* 时在动词原形前用 *does* 或 *do*",
    ],
  },
  {
    text: "Before the eruption, {S} ___ never seen so much smoke.",
    one: "had",
    many: "had",
    other: ["is", "are"],
    main: "seen",
    word: ["never", "tells how often", "表示频率"],
    why: [
      "*before the eruption* is earlier than another past time, which *had* with the participle *seen* shows, for any subject",
      "*before the eruption* 比过去另一时间更早，用 *had* 加过去分词 *seen* 表示，任何主语都一样",
    ],
  },
];

/** helperRows fills every frame with every subject. */
const helperRows = helperFrames.flatMap((frame) =>
  helperSubjects.map((s) => {
    const right = s.plural ? frame.many : frame.one;
    const subject = frame.text.startsWith("{S}") ? capital(s.words) : s.words;
    const shown = frame.text.replace("{S}", subject);
    const agreeing = s.plural ? frame.one : frame.many;
    const other = s.plural ? frame.other[1] : frame.other[0];
    return { frame, s, right, shown, agreeing, other };
  }),
);

/** findHelperBank asks for the helping verb of a sentence. */
const findHelperBank: readonly Item[] = helperRows.map(({ frame, right, shown }) => ({
  question: t("Which word is the helping verb in this sentence?", "这个句子里哪个词是助动词？"),
  shown: shown.replace("___", right),
  right,
  wrong: [frame.main, frame.word[0]],
  why: t(
    `**${right}** is the helping verb. It comes before the main verb *${frame.main}* and tells the time of the action or makes the sentence negative.`,
    `**${right}** 是助动词。它放在主要动词 *${frame.main}* 前面，表示动作的时间，或者帮助构成否定。`,
  ),
  whyNot: [
    t(
      `*${frame.main}* is the main verb: it names the action itself. The helping verb is the one that comes before it.`,
      `*${frame.main}* 是主要动词，表示动作本身。助动词是放在它前面的那个词。`,
    ),
    t(`*${frame.word[0]}* is not a verb at all: it ${frame.word[1]}.`, `*${frame.word[0]}* 根本不是动词：它${frame.word[2]}。`),
  ],
}));

/** chooseHelperBank asks for the helping verb that agrees with the subject and the time. */
const chooseHelperBank: readonly Item[] = helperRows.map(({ frame, s, right, shown, agreeing, other }) => {
  const wrong = agreeing === right ? [other, s.plural ? frame.other[0] : frame.other[1]] : [agreeing, other];
  return {
    question: t("Which helping verb completes the sentence?", "哪个助动词能补全句子？"),
    shown,
    right,
    wrong,
    why: t(
      `${fill(shown, right)} Here ${frame.why[0]}${frame.one === frame.many ? "" : `, and *${s.words}* ${s.plural ? "names more than one, so it takes" : "names one, so it takes"} *${right}*`}.`,
      `${fill(shown, right)} 这里${frame.why[1]}${frame.one === frame.many ? "" : `；*${s.words}*（${s.zh}）是${s.plural ? "复数" : "单数"}，所以用 *${right}*`}。`,
    ),
    whyNot: wrong.map((w) =>
      w === agreeing
        ? t(
            `*${w}* is the right time but the wrong number: *${s.words}* ${s.plural ? "is plural" : "is singular"}, and *${w}* goes with a ${s.plural ? "singular" : "plural"} subject.`,
            `*${w}* 时间对了，但单复数不对：*${s.words}* 是${s.plural ? "复数" : "单数"}，而 *${w}* 要配${s.plural ? "单数" : "复数"}主语。`,
          )
        : t(
            `*${w}* does not fit the time or the verb after it. Look at the clues of time and at the form of the main verb.`,
            `*${w}* 与时间或后面的动词形式不符。看看表示时间的线索和主要动词的形式。`,
          ),
    ),
  };
});

// There and here.

/** Noun is a subject that can follow there is or there are. */
interface Noun {
  readonly words: string;
  readonly plural: boolean;
}

const desertNouns: readonly Noun[] = [
  { words: "a camel", plural: false },
  { words: "three tall cactuses", plural: true },
  { words: "a pool of fresh water", plural: false },
  { words: "many palm trees", plural: true },
  { words: "an old well", plural: false },
  { words: "two sleeping lizards", plural: true },
  { words: "a tent with a red flag", plural: false },
  { words: "some date palms", plural: true },
  { words: "a herd of goats", plural: false },
  { words: "dozens of footprints", plural: true },
];

/** ThereFrame is a sentence beginning with there or here, with its place and its time. */
interface ThereFrame {
  readonly text: string;
  readonly past: boolean;
  /** place is a noun of the sentence that is not its subject. */
  readonly place: string;
  readonly opener: string;
}

const thereFrames: readonly ThereFrame[] = [
  { text: "There ___ {N} at the far edge of the oasis.", past: false, place: "the far edge of the oasis", opener: "There" },
  { text: "Long ago there ___ {N} beside the old desert road.", past: true, place: "the old desert road", opener: "there" },
  { text: "Here ___ {N} in the photograph of the dunes.", past: false, place: "the photograph of the dunes", opener: "Here" },
  { text: "Yesterday there ___ {N} at the edge of the tent camp.", past: true, place: "the edge of the tent camp", opener: "there" },
];

const thereRows = thereFrames.flatMap((frame, f) =>
  desertNouns
    .filter((_, n) => (n + f) % 4 !== 3)
    .map((noun) => {
      const right = frame.past ? (noun.plural ? "were" : "was") : noun.plural ? "are" : "is";
      const number = frame.past ? (noun.plural ? "was" : "were") : noun.plural ? "is" : "are";
      const time = frame.past ? (noun.plural ? "are" : "is") : noun.plural ? "were" : "was";
      return { frame, noun, right, number, time, shown: frame.text.replace("{N}", noun.words) };
    }),
);

/** thereSubjectBank asks for the real subject of a sentence that begins with there or here. */
const thereSubjectBank: readonly Item[] = thereRows.map(({ frame, noun, right, shown }) => ({
  question: t("What is the real subject of this sentence?", "这个句子真正的主语是什么？"),
  shown: shown.replace("___", right),
  right: noun.words,
  wrong: [frame.opener, frame.place],
  why: t(
    `The subject is **${noun.words}**. In a sentence that begins with *there* or *here*, the subject comes after the verb: ask what *${right}* there, and the answer is ${noun.words}.`,
    `主语是 **${noun.words}**。以 *there* 或 *here* 开头的句子，主语在动词后面：问一问“什么 *${right}* 在那里”，答案就是 ${noun.words}。`,
  ),
  whyNot: [
    t(
      `*${frame.opener}* only starts the sentence and points to a place; it is never the subject. The subject comes after the verb.`,
      `*${frame.opener}* 只是句子的开头，指向一个地方，它从来不是主语。主语在动词后面。`,
    ),
    t(
      `*${frame.place}* tells where, inside a phrase that begins with a preposition. A noun in such a phrase is never the subject.`,
      `*${frame.place}* 表示地点，处在以介词开头的短语里。这种短语里的名词从来不是主语。`,
    ),
  ],
}));

/** thereVerbBank asks for the verb that agrees with the subject after there or here. */
const thereVerbBank: readonly Item[] = thereRows.map(({ frame, noun, right, number, time, shown }) => ({
  question: t("Which verb completes the sentence?", "哪个动词能补全句子？"),
  shown,
  right,
  wrong: [number, time],
  why: t(
    `${fill(shown, right)} The subject comes after the verb: *${noun.words}* is ${noun.plural ? "plural" : "singular"}, and the sentence is about the ${frame.past ? "past" : "present"}, so the verb is *${right}*.`,
    `${fill(shown, right)} 主语在动词后面：*${noun.words}* 是${noun.plural ? "复数" : "单数"}，句子说的是${frame.past ? "过去" : "现在"}，所以动词用 *${right}*。`,
  ),
  whyNot: [
    t(
      `*${number}* has the right time but agrees with a ${noun.plural ? "singular" : "plural"} subject. Find the subject after the verb: *${noun.words}*.`,
      `*${number}* 时间对了，但它配的是${noun.plural ? "单数" : "复数"}主语。找到动词后面的主语：*${noun.words}*。`,
    ),
    t(
      `*${time}* is the wrong time: the sentence is about the ${frame.past ? "past" : "present"}.`,
      `*${time}* 时间不对：句子说的是${frame.past ? "过去" : "现在"}。`,
    ),
  ],
}));

// Compound subjects and predicates.

const compoundKinds = {
  "a compound subject": {
    zh: "复合主语",
    is: [
      "Two or more subjects joined by *and* or *or* share one verb, as in *The heart and the lungs work together*.",
      "两个或更多主语用 *and* 或 *or* 连接，共用一个谓语，例如 *The heart and the lungs work together*。",
    ],
  },
  "a compound predicate": {
    zh: "复合谓语",
    is: [
      "One subject has two or more verbs joined by *and*, *or* or *but*, as in *Blood carries oxygen and removes waste*.",
      "一个主语带有两个或更多用 *and*、*or* 或 *but* 连接的动词，例如 *Blood carries oxygen and removes waste*。",
    ],
  },
  "two complete sentences joined": {
    zh: "两个完整句子相连",
    is: [
      "Each half has its own subject and its own verb, joined by a comma and *and*, *but* or *so*, as in *The heart pumps, and the lungs breathe*.",
      "每一半都有自己的主语和动词，用逗号加 *and*、*but* 或 *so* 连接，例如 *The heart pumps, and the lungs breathe*。",
    ],
  },
} as const;

const compoundLines = `
  The heart and the blood vessels carry blood around the body.|a compound subject
  The stomach mixes food and breaks it down.|a compound predicate
  The brain sends messages, and the nerves carry them.|two complete sentences joined
  Bones and muscles work together to move your arm.|a compound subject
  Your lungs take in air and push it out again.|a compound predicate
  The skin feels heat, but the hair does not.|two complete sentences joined
  The nose and the tongue both help you taste food.|a compound subject
  White blood cells find germs and destroy them.|a compound predicate
  Mia ran fast, so her heart beat quickly.|two complete sentences joined
  Milk, cheese and yogurt help build strong bones.|a compound subject
  The doctor listened to my chest and checked my ears.|a compound predicate
  The nurse cleaned the cut, and my mother held my hand.|two complete sentences joined
  My brother and I brush our teeth before bed.|a compound subject
  The baby yawned, stretched and fell asleep.|a compound predicate
  Tears wash the eye, and eyelashes keep out dust.|two complete sentences joined
  Water or juice is good after a long run.|a compound subject
  The runners stretched their legs and drank some water.|a compound predicate
  I sneezed twice, but my cold was almost gone.|two complete sentences joined
  The ribs and the backbone protect important organs.|a compound subject
  The coach blew her whistle and called us over.|a compound predicate
  The eyes see the ball, and the hands catch it.|two complete sentences joined
  Fruit and vegetables give the body vitamins.|a compound subject
  Our teeth bite and chew the food.|a compound predicate
  The patient rested, and the fever went down.|two complete sentences joined
  The ears and the brain work together to hear.|a compound subject
  The players warmed up and practiced their passes.|a compound predicate
  The dentist checked my teeth, but she found no holes.|two complete sentences joined
  Sleep and exercise keep the body healthy.|a compound subject
  The heart speeds up during exercise and slows down at rest.|a compound predicate
  Some germs are harmful, so we wash our hands.|two complete sentences joined
  My grandmother and my uncle walk every morning.|a compound subject
  The swimmer took a deep breath and dove under the water.|a compound predicate
`;

/** CombineCore is two sentences that share a predicate or a subject, combined into one. */
const combineLines = `
  The heart works all day. The lungs work all day.|The heart and the lungs work all day.|The heart and the lungs works all day.|The heart works all day and the lungs.|s
  Blood carries oxygen. Blood removes waste.|Blood carries oxygen and removes waste.|Blood carries oxygen and removing waste.|Blood carries oxygen and blood.|p
  My brother needs more sleep. My sister needs more sleep.|My brother and my sister need more sleep.|My brother and my sister needs more sleep.|My brother needs more sleep and my sister.|s
  The nurse took my temperature. The nurse wrote it down.|The nurse took my temperature and wrote it down.|The nurse took my temperature and writes it down.|The nurse took my temperature and the nurse.|p
  Carrots are good for your eyes. Spinach is good for your eyes.|Carrots and spinach are good for your eyes.|Carrots and spinach is good for your eyes.|Carrots are good for your eyes and spinach.|s
  The runner stretched. The runner jogged around the track.|The runner stretched and jogged around the track.|The runner stretched and jogging around the track.|The runner stretched and the runner.|p
  The bones protect the brain. The skin protects the brain.|The bones and the skin protect the brain.|The bones and the skin protects the brain.|The bones protect the brain and the skin.|s
  The baby giggles. The baby claps her hands.|The baby giggles and claps her hands.|The baby giggles and clapped her hands.|The baby giggles and the baby.|p
  The teacher was tired after the race. The students were tired after the race.|The teacher and the students were tired after the race.|The teacher and the students was tired after the race.|The teacher was tired after the race and the students.|s
  The dog sniffs the air. The dog follows the smell.|The dog sniffs the air and follows the smell.|The dog sniffs the air and following the smell.|The dog sniffs the air and the dog.|p
  Juice has sugar. Soda has sugar.|Juice and soda have sugar.|Juice and soda has sugar.|Juice has sugar and soda.|s
  Our class washed our hands. Our class ate lunch.|Our class washed our hands and ate lunch.|Our class washed our hands and eats lunch.|Our class washed our hands and our class.|p
  The eyes need rest. The ears need rest.|The eyes and the ears need rest.|The eyes and the ears needs rest.|The eyes need rest and the ears.|s
  The doctor smiled. The doctor gave me a sticker.|The doctor smiled and gave me a sticker.|The doctor smiled and giving me a sticker.|The doctor smiled and the doctor.|p
  Grandpa walks to the park. Grandma walks to the park.|Grandpa and Grandma walk to the park.|Grandpa and Grandma walks to the park.|Grandpa walks to the park and Grandma.|s
  The muscles tighten. The muscles pull on the bones.|The muscles tighten and pull on the bones.|The muscles tighten and pulled on the bones.|The muscles tighten and the muscles.|p
  Apples make a healthy snack. Nuts make a healthy snack.|Apples and nuts make a healthy snack.|Apples and nuts makes a healthy snack.|Apples make a healthy snack and nuts.|s
  The swimmer kicked hard. The swimmer reached the wall first.|The swimmer kicked hard and reached the wall first.|The swimmer kicked hard and reaches the wall first.|The swimmer kicked hard and the swimmer.|p
  The heart is a muscle. The tongue is a muscle.|The heart and the tongue are muscles.|The heart and the tongue is muscles.|The heart is a muscle and the tongue.|s
  Saliva wets the food. Saliva starts to break it down.|Saliva wets the food and starts to break it down.|Saliva wets the food and starting to break it down.|Saliva wets the food and saliva.|p
  Fever was one sign of the flu. Coughing was another.|Fever and coughing were signs of the flu.|Fever and coughing was signs of the flu.|Fever was one sign of the flu and coughing.|s
  The players drank water. The players rested in the shade.|The players drank water and rested in the shade.|The players drank water and rest in the shade.|The players drank water and the players.|p
  My cousin plays soccer every week. My friend plays soccer every week.|My cousin and my friend play soccer every week.|My cousin and my friend plays soccer every week.|My cousin plays soccer every week and my friend.|s
  The patient sat up. The patient asked for some soup.|The patient sat up and asked for some soup.|The patient sat up and asking for some soup.|The patient sat up and the patient.|p
  Rice gives the body energy. Bread gives the body energy.|Rice and bread give the body energy.|Rice and bread gives the body energy.|Rice gives the body energy and bread.|s
  The kidneys clean the blood. The kidneys make urine.|The kidneys clean the blood and make urine.|The kidneys clean the blood and making urine.|The kidneys clean the blood and the kidneys.|p
  The coach was proud of the team. The parents were proud of the team.|The coach and the parents were proud of the team.|The coach and the parents was proud of the team.|The coach was proud of the team and the parents.|s
  The nose warms the air. The nose cleans it.|The nose warms the air and cleans it.|The nose warms the air and cleaned it.|The nose warms the air and the nose.|p
  A helmet protects your head. A seat belt protects your body.|A helmet and a seat belt protect you.|A helmet and a seat belt protects you.|A helmet protects your head and a seat belt.|s
  Our hearts beat faster. Our faces turned red.|Our hearts beat faster, and our faces turned red.|Our hearts beat faster and our faces turning red.|Our hearts and faces beat faster and turned red.|j
`;

const combineBank = fields(combineLines).map(([shown, right, agree, garble, kind]): Item => {
  if (!shown || !right || !agree || !garble || !kind) throw new Error(`a combine line needs five fields: ${shown}`);
  const subject = kind === "s";
  const joined = kind === "j";
  return {
    question: t("Which sentence combines the two sentences correctly?", "哪个句子把这两个句子正确地合并了？"),
    shown,
    right,
    wrong: [agree, garble],
    why: joined
      ? t(
          `**${right}** The two sentences have different subjects and different verbs, so they stay two complete sentences, joined by a comma and *and*.`,
          `**${right}** 这两个句子的主语和动词都不同，所以仍是两个完整的句子，用逗号加 *and* 连接。`,
        )
      : subject
        ? t(
            `**${right}** The two sentences say the same thing about two subjects, so the subjects join with *and* and share one verb. Two subjects joined by *and* make a plural subject, which takes a plural verb.`,
            `**${right}** 两个句子对两个主语说了同样的事，所以把主语用 *and* 连起来，共用一个谓语。用 *and* 连接的两个主语是复数，要用复数动词。`,
          )
        : t(
            `**${right}** The two sentences have the same subject, so it is written once, and its two predicates join with *and*. Both verbs keep the same form and tense.`,
            `**${right}** 两个句子主语相同，所以主语只写一次，两个谓语用 *and* 连接。两个动词保持相同的形式和时态。`,
          ),
    whyNot: [
      joined
        ? t(
            `“${agree}” breaks the pattern: the second verb must match the first, and a comma comes before *and* when two sentences are joined.`,
            `“${agree}” 破坏了结构：第二个动词要和第一个一致，两个句子相连时 *and* 前要有逗号。`,
          )
        : subject
          ? t(
              `“${agree}” joins the subjects but keeps a singular verb. Two subjects joined by *and* are plural.`,
              `“${agree}” 连接了主语，却保留了单数动词。用 *and* 连接的两个主语是复数。`,
            )
          : t(
              `“${agree}” changes the form or tense of the second verb. Verbs that share a subject must match each other.`,
              `“${agree}” 改变了第二个动词的形式或时态。共用一个主语的动词要彼此一致。`,
            ),
      t(
        `“${garble}” tacks a word onto the end instead of joining the matching parts, so it no longer says what the two sentences said.`,
        `“${garble}” 只是在句末加了几个词，而没有把对应的部分连起来，所以意思和原来两个句子不一样了。`,
      ),
    ],
  };
});

// Adverbs that compare.

/** Adverb is an adverb with its forms for comparing two and for comparing more. */
interface Adverb {
  readonly plain: string;
  readonly more: string;
  readonly most: string;
  readonly wrongMore: string;
  readonly wrongMost: string;
  readonly rule: readonly [en: string, zh: string];
}

const short = ["it is short, so it adds *-er* and *-est*", "它很短，所以加 *-er* 和 *-est*"] as const;
const ly = ["it ends in *-ly*, so it takes *more* and *most*", "它以 *-ly* 结尾，所以用 *more* 和 *most*"] as const;
const irregular = ["it is irregular and changes completely", "它是不规则的，形式完全改变"] as const;

const adverbs: readonly Adverb[] = [
  { plain: "fast", more: "faster", most: "fastest", wrongMore: "more fast", wrongMost: "most fast", rule: short },
  { plain: "hard", more: "harder", most: "hardest", wrongMore: "more hard", wrongMost: "most hard", rule: short },
  { plain: "high", more: "higher", most: "highest", wrongMore: "more high", wrongMost: "most high", rule: short },
  {
    plain: "early",
    more: "earlier",
    most: "earliest",
    wrongMore: "more early",
    wrongMost: "most early",
    rule: [
      "it is one word that ends in *-y*, not an *-ly* adverb made from an adjective, so the *y* changes to *i* before *-er* and *-est*",
      "它是以 *-y* 结尾的词，不是由形容词加 *-ly* 构成的副词，所以把 *y* 变成 *i* 再加 *-er*、*-est*",
    ],
  },
  { plain: "late", more: "later", most: "latest", wrongMore: "more late", wrongMost: "most late", rule: short },
  { plain: "quietly", more: "more quietly", most: "most quietly", wrongMore: "quietlier", wrongMost: "quietliest", rule: ly },
  { plain: "brightly", more: "more brightly", most: "most brightly", wrongMore: "brightlier", wrongMost: "brightliest", rule: ly },
  { plain: "carefully", more: "more carefully", most: "most carefully", wrongMore: "carefullier", wrongMost: "carefulliest", rule: ly },
  { plain: "slowly", more: "more slowly", most: "most slowly", wrongMore: "slowlier", wrongMost: "slowliest", rule: ly },
  { plain: "loudly", more: "more loudly", most: "most loudly", wrongMore: "loudlier", wrongMost: "loudliest", rule: ly },
  { plain: "clearly", more: "more clearly", most: "most clearly", wrongMore: "clearlier", wrongMost: "clearliest", rule: ly },
  { plain: "well", more: "better", most: "best", wrongMore: "weller", wrongMost: "wellest", rule: irregular },
  { plain: "badly", more: "worse", most: "worst", wrongMore: "badlier", wrongMost: "baddest", rule: irregular },
  { plain: "smoothly", more: "more smoothly", most: "most smoothly", wrongMore: "smoothlier", wrongMost: "smoothliest", rule: ly },
  { plain: "soon", more: "sooner", most: "soonest", wrongMore: "more soon", wrongMost: "most soon", rule: short },
  { plain: "gently", more: "more gently", most: "most gently", wrongMore: "gentlier", wrongMost: "gentliest", rule: ly },
];

/** compareFrames are sentences comparing two things, with {A} for the adverb. */
const twoFrames = [
  "The new fan spins ___ than the old one.",
  "Our solar lamp glowed ___ than the candle.",
  "This week the wind blew ___ than it did last week.",
];
const allFrames = [
  "Of all the machines in the room, the blender runs ___.",
  "Of the five lamps, the silver one shone ___.",
  "Of everyone in the class, Leo saved energy ___.",
];

const adverbRows = adverbs.flatMap((a, i) => {
  const two = { a, frame: twoFrames[i % 3] as string, many: false };
  const all = { a, frame: allFrames[(i + 1) % 3] as string, many: true };
  return [two, all];
});

/** adverbChoiceBank asks for the form of an adverb that compares two or more. */
const adverbChoiceBank: readonly Item[] = adverbRows.map(({ a, frame, many }) => {
  const right = many ? a.most : a.more;
  const wrongNumber = many ? a.more : a.most;
  const wrongForm = many ? a.wrongMost : a.wrongMore;
  return {
    question: t(`Which form of *${a.plain}* completes the sentence?`, `*${a.plain}* 的哪种形式能补全句子？`),
    shown: frame,
    right,
    wrong: [wrongNumber, wrongForm],
    why: t(
      `${fill(frame, right)} The sentence compares ${many ? "more than two, so it needs the *-est* or *most* form" : "two things, with *than*, so it needs the *-er* or *more* form"}; for *${a.plain}*, ${a.rule[0]}.`,
      `${fill(frame, right)} 句子比较的是${many ? "两个以上的事物，所以要用 *-est* 或 *most* 形式" : "两个事物，有 *than*，所以要用 *-er* 或 *more* 形式"}；*${a.plain}* ${a.rule[1]}。`,
    ),
    whyNot: [
      t(
        `“${wrongNumber}” compares ${many ? "only two things" : "more than two"}, but the sentence compares ${many ? "a whole group" : "two, with *than*"}.`,
        `“${wrongNumber}” 用于比较${many ? "两个事物" : "两个以上的事物"}，而句子比较的是${many ? "一整组" : "两个，有 *than*"}。`,
      ),
      t(
        `“${wrongForm}” is not a correct form of *${a.plain}*: ${a.rule[0]}.`,
        `“${wrongForm}” 不是 *${a.plain}* 的正确形式：${a.rule[1]}。`,
      ),
    ],
  };
});

/** adverbTypedBank asks to type the form of an adverb in other sentences. */
const adverbTypedBank: readonly TypedItem[] = adverbs.flatMap((a, i) => {
  const twoShown = [
    "Grandpa drives ___ than my aunt does.",
    "The second singer sang ___ than the first.",
    "The new washing machine works ___ than the old one.",
  ][i % 3] as string;
  const allShown = [
    "Of all the runners, Ana finished ___.",
    "Of the three bells, the big one rang ___.",
    "Of everyone on the team, Sam worked ___.",
  ][(i + 2) % 3] as string;
  return [
    {
      shown: twoShown,
      accepted: [a.more],
      canonical: a.more,
      wrong: [a.most, a.wrongMore],
      instruction: t(`Use the adverb *${a.plain}*.`, `使用副词 *${a.plain}*。`),
    },
    {
      shown: allShown,
      accepted: [a.most],
      canonical: a.most,
      wrong: [a.more, a.wrongMost],
      instruction: t(`Use the adverb *${a.plain}*.`, `使用副词 *${a.plain}*。`),
    },
  ];
});

const adverbOf = (form: string): Adverb | undefined => adverbs.find((a) => a.more === form || a.most === form);

// Lie and lay, sit and set, rise and raise.

const pairLines = `
  Please ___ the books on the table.|lay|lie|laid|lay: put, it has an object
  The dog likes to ___ in the sun after lunch.|lie|lay|lain|lie: rest, no object
  Grandma will ___ the baby down for a nap.|lay|lie|lying|lay: put, it has an object
  I feel tired, so I will ___ down for a while.|lie|lay|laid|lie: rest, no object
  The hens ___ their eggs in the straw every morning.|lay|lie|lies|lay: put, it has an object
  Do not ___ on the wet grass in your new clothes.|lie|lay|laid|lie: rest, no object
  Come and ___ next to me on the bench.|sit|set|sat|sit: rest in a seat, no object
  Please ___ the plates on the table for dinner.|set|sit|sat|set: put, it has an object
  The cat will ___ on the windowsill for hours.|sit|set|sets|sit: rest in a seat, no object
  Can you ___ the vase down gently?|set|sit|sitting|set: put, it has an object
  We always ___ in the front row at the theater.|sit|set|sets|sit: rest in a seat, no object
  ___ your bag by the door when you come in.|Set|Sit|Sat|set: put, it has an object
  The sun will ___ over the hills at six o'clock.|rise|raise|raised|rise: go up by itself, no object
  Please ___ your hand if you know the answer.|raise|rise|rose|raise: lift, it has an object
  Bread dough will ___ if you leave it in a warm place.|rise|raise|raises|rise: go up by itself, no object
  The workers will ___ the flag at the start of the game.|raise|rise|rising|raise: lift, it has an object
  Smoke began to ___ from the chimney.|rise|raise|raised|rise: go up by itself, no object
  The town plans to ___ money for a new library.|raise|rise|rose|raise: lift, it has an object
  The tired campers wanted to ___ down by the fire.|lie|lay|laid|lie: rest, no object
  ___ the map flat so everyone can see it.|Lay|Lie|Lain|lay: put, it has an object
  The guests will ___ at the long table.|sit|set|sets|sit: rest in a seat, no object
  Mom asked me to ___ the timer for ten minutes.|set|sit|sat|set: put, it has an object
  Prices often ___ when there is not enough of something.|rise|raise|raised|rise: go up by itself, no object
  The farmers ___ sheep and goats on the hills.|raise|rise|rose|raise: lift, it has an object
  Let the puppy ___ on his blanket.|lie|lay|laid|lie: rest, no object
  Workers ___ new bricks along the path every spring.|lay|lie|lies|lay: put, it has an object
  You can ___ anywhere you like.|sit|set|sat|sit: rest in a seat, no object
  ___ the glass down before it spills.|Set|Sit|Sitting|set: put, it has an object
  The river will ___ after the heavy rain.|rise|raise|raised|rise: go up by itself, no object
  ___ the curtain when the music starts.|Raise|Rise|Rose|raise: lift, it has an object
  Our cat loves to ___ on top of the warm laptop.|lie|lay|laid|lie: rest, no object
  The knight will ___ his sword at the king's feet.|lay|lie|lain|lay: put, it has an object
`;

const pastLines = `
  Yesterday I ___ down on the couch and fell asleep.|lay|laid|lied|lie: rest, past lay
  Last night she ___ the books on the shelf.|laid|lay|layed|lay: put, past laid
  The dog ___ in the shade all afternoon yesterday.|lay|laid|layed|lie: rest, past lay
  He ___ his coat over the chair and sat down.|laid|lay|lied|lay: put, past laid
  The hen ___ six eggs last week.|laid|lay|layed|lay: put, past laid
  After the long hike, we ___ in the grass.|lay|laid|lied|lie: rest, past lay
  We ___ in the third row at the concert.|sat|set|sitted|sit: rest in a seat, past sat
  She ___ the table before the guests arrived.|set|sat|setted|set: put, past set
  The cat ___ on the fence and watched the birds.|sat|set|sitted|sit: rest in a seat, past sat
  Dad ___ the alarm for six o'clock.|set|sat|setted|set: put, past set
  The students ___ quietly while the teacher read.|sat|set|sitted|sit: rest in a seat, past sat
  I ___ my bag on the floor and looked around.|set|sat|setted|set: put, past set
  The sun ___ at six this morning.|rose|raised|rised|rise: go up by itself, past rose
  The children ___ their hands to answer.|raised|rose|rised|raise: lift, past raised
  The balloon ___ high into the sky.|rose|raised|rised|rise: go up by itself, past rose
  The class ___ two hundred dollars for the shelter.|raised|rose|rised|raise: lift, past raised
  The water in the river ___ a meter overnight.|rose|raised|rised|rise: go up by itself, past rose
  They ___ the flag on the first day of school.|raised|rose|rised|raise: lift, past raised
  The tired puppy ___ by the fire all evening.|lay|laid|layed|lie: rest, past lay
  The workers ___ the new road last summer.|laid|lay|lied|lay: put, past laid
  My grandparents ___ on the porch every evening last summer.|sat|set|sitted|sit: rest in a seat, past sat
  The waiter ___ a basket of bread on our table.|set|sat|setted|set: put, past set
  Smoke ___ from the campfire.|rose|raised|rised|rise: go up by itself, past rose
  The farmer ___ chickens on her farm for years.|raised|rose|rised|raise: lift, past raised
  The baby ___ quietly in her crib.|lay|laid|lied|lie: rest, past lay
  The knight ___ his shield on the ground.|laid|lay|layed|lay: put, past laid
  We ___ on the beach and watched the boats.|sat|set|sitted|sit: rest in a seat, past sat
  Grandpa ___ the box down carefully.|set|sat|setted|set: put, past set
  The bread ___ while it sat in the warm kitchen.|rose|raised|rised|rise: go up by itself, past rose
  The crowd ___ their voices and cheered.|raised|rose|rised|raise: lift, past raised
  The old dog ___ on the porch all day.|lay|laid|layed|lie: rest, past lay
  The scientist ___ the fossils in a row.|laid|lay|layed|lay: put, past laid
`;

/** pairBank reads lines of a verb pair: the sentence, the right verb, the partner, another form and the rule. */
const pairBank = (lines: string, past: boolean): Item[] =>
  fields(lines).map(([shown, right, partner, form, rule]) => {
    if (!shown || !right || !partner || !form || !rule) throw new Error(`a verb pair line needs five fields: ${shown}`);
    const [verb, meaning] = rule.split(": ");
    const hasObject = /object/.test(meaning ?? "") && !/no object/.test(meaning ?? "");
    return {
      question: t("Which verb completes the sentence?", "哪个动词能补全句子？"),
      shown,
      right,
      wrong: [partner, form],
      why: t(
        `${fill(shown, right)} The verb is *${verb}*, ${meaning?.replace(", past", "; its past form is")}. ${hasObject ? "Here something is being put or lifted, so the verb needs an object." : "Here nothing is being put or lifted: the subject does the action itself."}`,
        `${fill(shown, right)} 这里用 *${verb}*（${meaning?.replace(", past", "，过去式是")}）。${hasObject ? "这里有东西被放或被举起，所以动词需要宾语。" : "这里没有东西被放或被举起：主语自己完成动作。"}`,
      ),
      whyNot: [
        t(
          `“${partner}” is the other verb of the pair. ${past ? "Check which verb the sentence needs, then use its own past form." : "Ask whether the verb acts on something: *lay, set* and *raise* take an object, *lie, sit* and *rise* do not."}`,
          `“${partner}” 是这对动词中的另一个。${past ? "先确定句子需要哪个动词，再用它自己的过去式。" : "问问动词是否作用于某物：*lay、set、raise* 带宾语，*lie、sit、rise* 不带。"}`,
        ),
        t(
          `“${form}” is ${/ed$/.test(form) && !["laid", "raised"].includes(form) ? "not a word of standard English" : "the wrong form for this sentence"}. ${past ? "The past forms are *lay, laid, sat, set, rose* and *raised*." : "After *will, can, please* or *to*, use the plain verb."}`,
          `“${form}” ${/ed$/.test(form) && !["laid", "raised"].includes(form) ? "不是标准英语中的词" : "在这个句子里形式不对"}。${past ? "过去式分别是 *lay、laid、sat、set、rose、raised*。" : "在 *will、can、please* 或 *to* 后面用动词原形。"}`,
        ),
      ],
    };
  });

/** verbTopics4 are the grammar topics of grade 4 about verbs. */
export const verbTopics4: readonly TopicDef[] = [
  {
    id: "helping-verbs",
    title: t("Helping Verbs", "助动词"),
    summary: t(
      "A helping verb such as is, was, has, had, do or did comes before a main verb and adds time or a question.",
      "is、was、has、had、do、did 这样的助动词放在主要动词前面，表示时间或帮助构成疑问。",
    ),
    prerequisites: after("action-and-linking-verbs", "simple-verb-tenses"),
    encompasses: [{ topic: "simple-verb-tenses", weight: 0.2 }],
    xp: 14,
    strand: "grammar",
    knowledgePoints: [
      point(
        "finding-helping-verbs",
        t("Finding the Helping Verb", "找出助动词"),
        t(
          "A **helping verb** comes before the **main verb** and helps it. The main verb names the action: *watching, measured, like*. The helping verb tells when it happens or helps make a question or a negative: *is watching, has measured, does not like*.\n\nThe common helping verbs are forms of *be* (*am, is, are, was, were*), of *have* (*has, have, had*) and of *do* (*do, does, did*). Words such as *not, already* and *never* can stand between the two verbs, but they are not verbs.",
          "**助动词**放在**主要动词**前面帮助它。主要动词表示动作：*watching、measured、like*。助动词表示动作发生的时间，或者帮助构成疑问句和否定句：*is watching、has measured、does not like*。\n\n常见的助动词有 *be* 的各种形式（*am、is、are、was、were*）、*have* 的各种形式（*has、have、had*）和 *do* 的各种形式（*do、does、did*）。*not、already、never* 这样的词可以出现在两个动词中间，但它们不是动词。",
        ),
        itemGenerator(findHelperBank),
      ),
      point(
        "choosing-helping-verbs",
        t("Choosing the Helping Verb", "选择助动词"),
        t(
          "Choose a helping verb in two steps. First, the **time**: *is, are* for now, *was, were* for the past with an *-ing* verb; *has, have* before a participle such as *measured* when the action reaches up to now; *had* for a time before another past time; *do, does, did* with *not* or in questions.\n\nThen the **subject**: one person or thing takes *is, was, has, does*; more than one takes *are, were, have, do*. *Had* and *did* are the same for every subject.",
          "选择助动词分两步。第一看**时间**：现在用 *is、are*，过去带 *-ing* 动词用 *was、were*；动作延续到现在时，在 *measured* 这样的分词前用 *has、have*；比另一个过去时间更早用 *had*；在含 *not* 的句子或疑问句中用 *do、does、did*。\n\n第二看**主语**：一个人或物用 *is、was、has、does*；多个用 *are、were、have、do*。*had* 和 *did* 对任何主语都一样。",
        ),
        itemGenerator(chooseHelperBank),
      ),
    ],
  },
  {
    id: "agreement-with-there-and-here",
    title: t("Agreement After There and Here", "There 和 Here 句中的主谓一致"),
    summary: t(
      "In a sentence that begins with there or here, the subject comes after the verb, and the verb agrees with it.",
      "以 there 或 here 开头的句子，主语在动词之后，动词要与它保持一致。",
    ),
    prerequisites: ["subject-verb-agreement"],
    encompasses: [{ topic: "subject-verb-agreement", weight: 0.3 }],
    xp: 14,
    strand: "grammar",
    knowledgePoints: [
      point(
        "finding-the-subject-after-there",
        t("Finding the Real Subject", "找到真正的主语"),
        t(
          "Most sentences put the subject first. A sentence that begins with *there* or *here* turns this around: *There is a camel near the oasis.* *There* only points; the subject, *a camel*, comes after the verb.\n\nTo find it, ask what *is* or *are* there. The answer is the subject. A noun inside a phrase such as *near the oasis* or *in the picture* is never the subject.",
          "大多数句子把主语放在前面。以 *there* 或 *here* 开头的句子把顺序颠倒了：*There is a camel near the oasis.* *There* 只起指示作用，主语 *a camel* 在动词后面。\n\n要找到主语，就问“什么 *is* 或 *are* 在那里”，答案就是主语。*near the oasis*、*in the picture* 这类短语里的名词从来不是主语。",
        ),
        itemGenerator(thereSubjectBank),
      ),
      point(
        "choosing-is-or-are-after-there",
        t("Choosing Is or Are", "选择 Is 还是 Are"),
        t(
          "After *there* or *here*, look ahead to the subject before you choose the verb. One thing takes *is* or *was*: *There is an old well.* More than one takes *are* or *were*: *There are two sleeping lizards.*\n\nThen check the time: *long ago* and *yesterday* need *was* or *were*.",
          "在 *there* 或 *here* 之后，先往后看主语，再选择动词。一个事物用 *is* 或 *was*：*There is an old well.* 多个事物用 *are* 或 *were*：*There are two sleeping lizards.*\n\n然后看时间：*long ago* 和 *yesterday* 要用 *was* 或 *were*。",
        ),
        itemGenerator(thereVerbBank),
      ),
    ],
  },
  {
    id: "compound-subjects-and-predicates",
    title: t("Compound Subjects and Predicates", "复合主语和复合谓语"),
    summary: t(
      "Two subjects joined by and share one predicate and take a plural verb; two predicates can share one subject.",
      "用 and 连接的两个主语共用一个谓语，并用复数动词；两个谓语也可以共用一个主语。",
    ),
    prerequisites: ["subject-verb-agreement"],
    encompasses: [
      { topic: "subjects-and-predicates", weight: 0.3 },
      { topic: "subject-verb-agreement", weight: 0.2 },
    ],
    xp: 14,
    strand: "grammar",
    knowledgePoints: [
      point(
        "finding-compound-parts",
        t("Finding Compound Parts", "找出复合成分"),
        t(
          "A **compound subject** is two or more subjects that share one predicate: *The heart and the lungs work together.* A **compound predicate** is two or more verbs that share one subject: *Blood carries oxygen and removes waste.*\n\nDo not mix these up with two complete sentences joined by a comma and *and*, *but* or *so*: *The heart pumps, and the lungs breathe.* There, each half has a subject and a verb of its own.",
          "**复合主语**是共用一个谓语的两个或更多主语：*The heart and the lungs work together.* **复合谓语**是共用一个主语的两个或更多动词：*Blood carries oxygen and removes waste.*\n\n不要把它们和用逗号加 *and、but* 或 *so* 连接的两个完整句子混为一谈：*The heart pumps, and the lungs breathe.* 那里每一半都有自己的主语和动词。",
        ),
        nameKind({
          lines: compoundLines,
          kinds: compoundKinds,
          name: ["What does this sentence have?", "这个句子含有什么？"],
          find: (en, zh) => [`Which sentence has ${en}?`, `哪个句子含有${zh}？`],
        }),
      ),
      point(
        "combining-with-compound-parts",
        t("Combining with Compound Parts", "用复合成分合并句子"),
        t(
          "When two sentences say the same thing about two subjects, join the subjects with *and* and write the predicate once: *The heart works. The lungs work.* → *The heart and the lungs work.* Two subjects joined by *and* are plural, so the verb is plural too.\n\nWhen two sentences have the same subject, write it once and join the predicates: *Blood carries oxygen and removes waste.* Keep both verbs in the same form.",
          "两个句子对两个主语说同样的事时，把主语用 *and* 连起来，谓语只写一次：*The heart works. The lungs work.* → *The heart and the lungs work.* 用 *and* 连接的两个主语是复数，所以动词也用复数。\n\n两个句子主语相同时，主语只写一次，把谓语连起来：*Blood carries oxygen and removes waste.* 两个动词保持相同的形式。",
        ),
        itemGenerator(combineBank),
      ),
    ],
  },
  {
    id: "adverbs-that-compare",
    title: t("Adverbs That Compare", "比较级和最高级副词"),
    summary: t(
      "Short adverbs compare with -er and -est, adverbs ending in -ly with more and most, and well and badly change completely.",
      "短副词用 -er 和 -est 比较，以 -ly 结尾的副词用 more 和 most，well 和 badly 则完全变形。",
    ),
    prerequisites: ["comparatives-and-superlatives"],
    encompasses: [
      { topic: "comparatives-and-superlatives", weight: 0.3 },
      { topic: "adjectives-and-adverbs", weight: 0.2 },
    ],
    xp: 14,
    strand: "grammar",
    knowledgePoints: [
      point(
        "choosing-the-form-that-compares",
        t("Comparing Two or More", "比较两个或更多"),
        t(
          "An adverb tells how something is done, and it can compare. To compare **two**, often with *than*, use the *-er* form or *more*: *The new fan spins faster than the old one.* To compare **more than two**, use the *-est* form or *most*: *Of all the lamps, this one shone most brightly.*\n\nShort adverbs add *-er* and *-est*: *fast, faster, fastest*. Adverbs ending in *-ly* take *more* and *most*: *quietly, more quietly, most quietly*. *Well* becomes *better, best*, and *badly* becomes *worse, worst*.",
          "副词说明动作是怎样完成的，也可以用来比较。比较**两个**（常带 *than*）用 *-er* 形式或 *more*：*The new fan spins faster than the old one.* 比较**两个以上**用 *-est* 形式或 *most*：*Of all the lamps, this one shone most brightly.*\n\n短副词加 *-er* 和 *-est*：*fast、faster、fastest*。以 *-ly* 结尾的副词用 *more* 和 *most*：*quietly、more quietly、most quietly*。*well* 变成 *better、best*，*badly* 变成 *worse、worst*。",
        ),
        itemGenerator(adverbChoiceBank),
      ),
      point(
        "writing-the-form-that-compares",
        t("Writing the Form", "写出比较形式"),
        t(
          "To write the form yourself, ask two questions. Does the sentence compare two things (*than*) or a whole group (*of all*)? Is the adverb short, does it end in *-ly*, or is it *well* or *badly*?\n\nNever add *-er* to an *-ly* adverb (*quietlier* is not a word), and never use *more* with *-er* together (*more faster*).",
          "要自己写出比较形式，先问两个问题。句子比较的是两个事物（*than*）还是一整组（*of all*）？这个副词是短词、以 *-ly* 结尾，还是 *well* 或 *badly*？\n\n不要给 *-ly* 副词加 *-er*（没有 *quietlier* 这个词），也不要把 *more* 和 *-er* 同时使用（*more faster*）。",
        ),
        typedGenerator(
          "word-form",
          t("Type the form of the adverb that completes the sentence.", "输入能补全句子的副词形式。"),
          adverbTypedBank,
          (right, shown) => {
            const a = adverbOf(right);
            const many = a?.most === right;
            return t(
              `${fill(shown, right)} The sentence compares ${many ? "a whole group, so it needs the *-est* or *most* form" : "two, with *than*, so it needs the *-er* or *more* form"}; ${a ? `for *${a.plain}*, ${a.rule[0]}` : ""}.`,
              `${fill(shown, right)} 句子比较的是${many ? "一整组，所以用 *-est* 或 *most* 形式" : "两个事物，有 *than*，所以用 *-er* 或 *more* 形式"}；${a ? `*${a.plain}* ${a.rule[1]}` : ""}。`,
            );
          },
        ),
      ),
    ],
  },
  {
    id: "tricky-verb-pairs",
    title: t("Tricky Verb Pairs", "易混淆的动词对"),
    summary: t(
      "Lie and lay, sit and set, rise and raise: the second verb of each pair acts on an object, and each has its own past form.",
      "lie 和 lay、sit 和 set、rise 和 raise：每对中的第二个动词作用于宾语，每个动词都有自己的过去式。",
    ),
    prerequisites: ["simple-verb-tenses"],
    encompasses: [{ topic: "simple-verb-tenses", weight: 0.2 }],
    xp: 14,
    strand: "grammar",
    knowledgePoints: [
      point(
        "choosing-the-verb-of-a-pair",
        t("Choosing the Verb", "选择动词"),
        t(
          "Each pair has a verb for something the subject does by itself and a verb for doing it to something else.\n\n- *lie* means to rest flat: *The dog likes to lie in the sun.* *lay* means to put something down: *Lay the books on the table.*\n- *sit* means to rest in a seat: *Sit next to me.* *set* means to put something somewhere: *Set the plates on the table.*\n- *rise* means to go up by itself: *The sun will rise.* *raise* means to lift something: *Raise your hand.*\n\nIf you can ask *what?* after the verb, use *lay, set* or *raise*.",
          "每对动词中，一个表示主语自己的动作，另一个表示对别的东西做这个动作。\n\n- *lie* 意思是躺：*The dog likes to lie in the sun.* *lay* 意思是放下某物：*Lay the books on the table.*\n- *sit* 意思是坐：*Sit next to me.* *set* 意思是把某物放在某处：*Set the plates on the table.*\n- *rise* 意思是自己升起：*The sun will rise.* *raise* 意思是举起某物：*Raise your hand.*\n\n如果动词后面能问“什么？”，就用 *lay、set* 或 *raise*。",
        ),
        itemGenerator(pairBank(pairLines, false)),
      ),
      point(
        "choosing-the-past-form",
        t("Choosing the Past Form", "选择过去式"),
        t(
          "The past forms are the hardest part, because one of them looks like the other verb: the past of *lie* (rest) is *lay*, and the past of *lay* (put) is *laid*.\n\n- *lie, lay*: *Yesterday I lay down.* — *lay, laid*: *She laid the books on the shelf.*\n- *sit, sat*: *We sat in the front row.* — *set, set*: *She set the table.*\n- *rise, rose*: *The sun rose at six.* — *raise, raised*: *They raised the flag.*",
          "过去式最难，因为其中一个看起来像另一个动词：*lie*（躺）的过去式是 *lay*，*lay*（放）的过去式是 *laid*。\n\n- *lie, lay*：*Yesterday I lay down.* —— *lay, laid*：*She laid the books on the shelf.*\n- *sit, sat*：*We sat in the front row.* —— *set, set*：*She set the table.*\n- *rise, rose*：*The sun rose at six.* —— *raise, raised*：*They raised the flag.*",
        ),
        itemGenerator(pairBank(pastLines, true)),
      ),
    ],
  },
];
