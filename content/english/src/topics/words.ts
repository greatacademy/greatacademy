// Words: how words are built from their parts, and how to work out and choose them.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator } from "@ga/subject-english";
import { academicSentenceBanks, academicSentences1 } from "./words-academic-sentences.ts";

const spelled = (shown: string, right: string, ...wrong: readonly string[]): TypedItem => ({
  shown,
  accepted: [right],
  canonical: right,
  wrong,
});

const baseBank: readonly ChoiceItem[] = [
  ["unhappy", "happy", ["un", "unhap"]],
  ["rewrite", "write", ["re", "rewrit"]],
  ["careless", "care", ["less", "car"]],
  ["kindness", "kind", ["ness", "kin"]],
  ["replay", "play", ["re", "lay"]],
  ["helpful", "help", ["ful", "hel"]],
  ["dislike", "like", ["dis", "lik"]],
  ["quickly", "quick", ["ly", "quic"]],
  ["unfair", "fair", ["un", "air"]],
  ["teacher", "teach", ["er", "each"]],
];

const affixKindBank: readonly ChoiceItem[] = [
  ["The *re-* in *reread*", "Prefix", ["Suffix", "Base word"]],
  ["The *-ful* in *colorful*", "Suffix", ["Prefix", "Base word"]],
  ["The *read* in *reread*", "Base word", ["Prefix", "Suffix"]],
  ["The *dis-* in *disagree*", "Prefix", ["Suffix", "Base word"]],
  ["The *-ness* in *darkness*", "Suffix", ["Prefix", "Base word"]],
  ["The *dark* in *darkness*", "Base word", ["Prefix", "Suffix"]],
  ["The *un-* in *unlock*", "Prefix", ["Suffix", "Base word"]],
  ["The *-er* in *painter*", "Suffix", ["Prefix", "Base word"]],
  ["The *paint* in *painter*", "Base word", ["Prefix", "Suffix"]],
];

const buildBank: readonly TypedItem[] = [
  spelled("un + kind", "unkind", "inkind"),
  spelled("re + build", "rebuild", "rebild"),
  spelled("care + ful", "careful", "carefull"),
  spelled("hope + less", "hopeless", "hopeles"),
  spelled("dark + ness", "darkness", "darknes"),
  spelled("dis + agree", "disagree", "disagre"),
  spelled("slow + ly", "slowly", "slowley"),
  spelled("mis + spell", "misspell", "mispell"),
  spelled("pre + heat", "preheat", "preheet"),
  spelled("paint + er", "painter", "paintor"),
];

const prefixMeaningBank: readonly ChoiceItem[] = [
  ["un-", "not", ["again", "before"]],
  ["re-", "again", ["not", "wrongly"]],
  ["dis-", "not or the opposite of", ["before", "again"]],
  ["pre-", "before", ["after", "not"]],
  ["mis-", "wrongly", ["again", "before"]],
  ["non-", "without or not", ["again", "wrongly"]],
  ["over-", "too much", ["not", "before"]],
  ["under-", "too little", ["again", "too much"]],
];

const prefixWordBank: readonly ChoiceItem[] = [
  ["untrue", "not true", ["true again", "true before"]],
  ["rebuild", "build again", ["not build", "build before"]],
  ["disobey", "refuse to obey", ["obey again", "obey before"]],
  ["preview", "see before", ["see again", "see wrongly"]],
  ["misread", "read wrongly", ["read again", "read before"]],
  ["nonstop", "without stopping", ["stopping again", "stopping before"]],
  ["overcook", "cook too much", ["cook again", "cook too little"]],
  ["underpaid", "paid too little", ["paid again", "paid too much"]],
  ["unsafe", "not safe", ["safe again", "very safe"]],
  ["replant", "plant again", ["not plant", "plant wrongly"]],
];

const prefixTypedBank: readonly TypedItem[] = [
  spelled("not fair", "unfair", "disfair", "infair"),
  spelled("heat again", "reheat", "preheat", "unheat"),
  spelled("the opposite of honest", "dishonest", "unhonest", "mishonest"),
  spelled("pay before", "prepay", "repay", "mispay"),
  spelled("understand wrongly", "misunderstand", "ununderstand", "disunderstand"),
  spelled("not fiction", "nonfiction", "unfiction", "disfiction"),
  spelled("sleep too long", "oversleep", "undersleep", "missleep"),
  spelled("the opposite of appear", "disappear", "unappear", "misappear"),
  spelled("tell again", "retell", "pretell", "untell"),
  spelled("judge wrongly", "misjudge", "disjudge", "prejudge"),
];

const suffixMeaningBank: readonly ChoiceItem[] = [
  ["-ful", "full of", ["without", "a person who"]],
  ["-less", "without", ["full of", "able to be"]],
  ["-er", "a person or thing that does", ["without", "the state of being"]],
  ["-ness", "the state of being", ["able to be", "without"]],
  ["-able", "able to be", ["without", "a person who"]],
  ["-ly", "in a certain way", ["without", "full of"]],
  ["-est", "the most", ["without", "able to be"]],
  ["-ish", "somewhat like", ["without", "able to be"]],
];

const suffixWordBank: readonly ChoiceItem[] = [
  ["fearless", "without fear", ["full of fear", "able to fear"]],
  ["joyful", "full of joy", ["without joy", "someone who brings joy"]],
  ["singer", "a person who sings", ["without singing", "able to sing"]],
  ["sadness", "the state of being sad", ["able to be sad", "without sadness"]],
  ["washable", "able to be washed", ["without washing", "a person who washes"]],
  ["softly", "in a soft way", ["without softness", "softer than others"]],
  ["tallest", "the most tall", ["somewhat tall", "without height"]],
  ["childish", "somewhat like a child", ["without a child", "able to be a child"]],
  ["painless", "without pain", ["full of pain", "a person in pain"]],
  ["breakable", "able to be broken", ["without a break", "someone who breaks"]],
];

const suffixTypedBank: readonly TypedItem[] = [
  spelled("happy + ness", "happiness", "happyness", "hapiness"),
  spelled("beauty + ful", "beautiful", "beautyful", "beautifull"),
  spelled("run + er", "runner", "runer", "runnor"),
  spelled("love + able", "lovable", "lovible", "lovabel"),
  spelled("easy + ly", "easily", "easyly", "easly"),
  spelled("big + est", "biggest", "bigest", "bigist"),
  spelled("bake + er", "baker", "bakeer", "bakker"),
  spelled("penny + less", "penniless", "pennyless", "penniles"),
  spelled("swim + er", "swimmer", "swimer", "swimor"),
  spelled("pity + ful", "pitiful", "pityful", "pitifull"),
];

const classBank: readonly ChoiceItem[] = [
  ["celebration", "Noun", ["Verb", "Adjective"]],
  ["movement", "Noun", ["Verb", "Adjective"]],
  ["memorize", "Verb", ["Noun", "Adjective"]],
  ["simplify", "Verb", ["Noun", "Adjective"]],
  ["dangerous", "Adjective", ["Noun", "Verb"]],
  ["musical", "Adjective", ["Noun", "Verb"]],
  ["darkness", "Noun", ["Verb", "Adjective"]],
  ["strengthen", "Verb", ["Noun", "Adjective"]],
  ["creative", "Adjective", ["Noun", "Verb"]],
  ["argument", "Noun", ["Verb", "Adjective"]],
];

const classTypedBank: readonly TypedItem[] = [
  spelled("The (decide) was fair.", "decision", "decidetion", "decition"),
  spelled("They made a loud (announce).", "announcement", "announcation", "announcment"),
  spelled("The lake is (danger) in winter.", "dangerous", "dangerful", "dangeros"),
  spelled("We must (organ) the files.", "organize", "organify", "organate"),
  spelled("She gave a (nature) smile.", "natural", "naturous", "naturial"),
  spelled("The (invent) changed farming.", "invention", "inventment", "inventness"),
  spelled("This will (pure) the water.", "purify", "purize", "purate"),
  spelled("The storm did great (destroy).", "destruction", "destroyment", "destroytion"),
  spelled("It was a (fame) painting.", "famous", "fameous", "famal"),
  spelled("His (kind) surprised us.", "kindness", "kindment", "kindtion"),
];

const positionMeaningBank: readonly ChoiceItem[] = [
  ["uni-", "one", ["two", "many"]],
  ["bi-", "two", ["one", "half"]],
  ["tri-", "three", ["two", "half"]],
  ["semi-", "half", ["three", "many"]],
  ["multi-", "many", ["one", "half"]],
  ["sub-", "under", ["over", "across"]],
  ["super-", "above", ["under", "between"]],
  ["inter-", "between", ["under", "after"]],
  ["trans-", "across", ["under", "before"]],
  ["post-", "after", ["before", "under"]],
];

const positionWordBank: readonly ChoiceItem[] = [
  ["unicycle", "a cycle with one wheel", ["a cycle with two wheels", "a cycle with many wheels"]],
  ["biweekly", "every two weeks", ["every week", "three times a week"]],
  ["triangle", "a shape with three angles", ["a shape with two angles", "half an angle"]],
  ["semicircle", "half of a circle", ["three circles", "many circles"]],
  ["multicolored", "having many colors", ["having one color", "having half a color"]],
  ["submarine", "a boat that goes under the sea", ["a boat above the sea", "a boat across the sea"]],
  ["superhuman", "above what people can do", ["below what people can do", "between people"]],
  ["international", "between nations", ["within one nation", "after a nation"]],
  ["transatlantic", "across the Atlantic", ["under the Atlantic", "before the Atlantic"]],
  ["postwar", "after a war", ["before a war", "during a war"]],
];

const latin1RootBank: readonly ChoiceItem[] = [
  ["port", "carry", ["see", "write"]],
  ["dict", "say", ["carry", "break"]],
  ["rupt", "break", ["say", "pull"]],
  ["scrib or script", "write", ["see", "build"]],
  ["struct", "build", ["break", "write"]],
  ["tract", "pull", ["build", "say"]],
  ["vis or vid", "see", ["pull", "carry"]],
  ["spect", "look", ["break", "say"]],
];

const latin1WordBank: readonly ChoiceItem[] = [
  ["transport", "to carry across", ["to write across", "to break across"]],
  ["predict", "to say before it happens", ["to see again", "to carry before"]],
  ["erupt", "to break out", ["to pull out", "to say out"]],
  ["inscribe", "to write on something", ["to build on something", "to carry on something"]],
  ["construct", "to build", ["to break", "to pull"]],
  ["extract", "to pull out", ["to break out", "to write out"]],
  ["visible", "able to be seen", ["able to be carried", "able to be said"]],
  ["inspect", "to look at closely", ["to pull in closely", "to build closely"]],
  ["export", "to carry out of a country", ["to look outside a country", "to write about a country"]],
  ["disrupt", "to break apart or interrupt", ["to carry apart", "to say apart"]],
];

const latin2RootBank: readonly ChoiceItem[] = [
  ["ject", "throw", ["send", "hear"]],
  ["mit or miss", "send", ["throw", "lead"]],
  ["duc or duct", "lead", ["believe", "call"]],
  ["cred", "believe", ["send", "carry"]],
  ["aud", "hear", ["lead", "push"]],
  ["fer", "carry or bear", ["hear", "believe"]],
  ["pel or puls", "push", ["call", "believe"]],
  ["voc or vok", "call", ["throw", "push"]],
];

const latin2WordBank: readonly ChoiceItem[] = [
  ["reject", "to throw back or refuse", ["to send ahead", "to call back"]],
  ["transmit", "to send across", ["to throw across", "to hear across"]],
  ["conduct", "to lead", ["to push", "to believe"]],
  ["credible", "able to be believed", ["able to be heard", "able to be sent"]],
  ["audible", "able to be heard", ["able to be believed", "able to be led"]],
  ["transfer", "to carry across", ["to push across", "to call across"]],
  ["propel", "to push forward", ["to lead forward", "to send back"]],
  ["vocal", "of the voice", ["of the ear", "of the hand"]],
  ["projector", "a machine that throws an image forward", ["a machine that hears", "a machine that sends letters"]],
  ["incredible", "hard to believe", ["hard to hear", "hard to send"]],
];

const greekRootBank: readonly ChoiceItem[] = [
  ["tele", "far", ["life", "earth"]],
  ["graph", "write or draw", ["sound", "heat"]],
  ["phon", "sound", ["light", "self"]],
  ["photo", "light", ["sound", "earth"]],
  ["bio", "life", ["heat", "far"]],
  ["geo", "earth", ["life", "small"]],
  ["therm", "heat", ["far", "write"]],
  ["micro", "small", ["earth", "self"]],
  ["auto", "self", ["light", "small"]],
  ["scope", "look at", ["heat", "sound"]],
];

const greekWordBank: readonly ChoiceItem[] = [
  ["telephone", "a device for sound from far away", ["a device for heat from far away", "a device for writing about life"]],
  ["autograph", "a person's own written name", ["a drawing of the earth", "a sound from far away"]],
  ["biography", "the written story of a life", ["a map of the earth", "a tool for measuring heat"]],
  ["geology", "the study of the earth", ["the study of life", "the study of sound"]],
  ["thermometer", "a tool that measures heat", ["a tool that measures sound", "a tool that sees far"]],
  ["microscope", "a tool for looking at small things", ["a tool for hearing small sounds", "a tool for measuring heat"]],
  ["telescope", "a tool for looking at far things", ["a tool for looking at small things", "a device for far sounds"]],
  ["photograph", "an image made with light", ["a sound made with light", "a drawing of the earth"]],
  ["symphony", "many sounds played together", ["many lights together", "a picture of many things"]],
  ["biology", "the study of life", ["the study of the earth", "the study of heat"]],
];

const definitionClueBank: readonly ChoiceItem[] = [
  ["The land was *arid*, which means that it got almost no rain.", "very dry", ["very cold", "very green"]],
  ["A *botanist*, a scientist who studies plants, visited our class.", "a plant scientist", ["a boat builder", "an animal doctor"]],
  ["The cat is *nocturnal*; that is, it is active at night.", "active at night", ["afraid of the dark", "friendly to people"]],
  ["The story had a *moral*, or a lesson about how to behave.", "a lesson", ["a character", "a joke"]],
  ["They will *renovate* the hall, which means to repair and improve it.", "repair and improve", ["close down", "measure"]],
  ["Ana felt *elated*, or extremely happy, when she won.", "extremely happy", ["very tired", "a little angry"]],
  ["The *summit*, the very top of the mountain, was covered in snow.", "the top", ["the base", "the trail"]],
  ["The bird will *migrate*, or move to another region, in the fall.", "move to another region", ["build a nest", "lose its feathers"]],
];

const contrastClueBank: readonly ChoiceItem[] = [
  ["Unlike his *timid* brother, Omar spoke to everyone.", "shy", ["friendly", "tall"]],
  ["The room was *immaculate*, but mine was covered in dirt.", "perfectly clean", ["very large", "quite dark"]],
  ["Although the first path was *treacherous*, the second was safe.", "dangerous", ["short", "pretty"]],
  ["She is *frugal*, whereas her sister spends everything she earns.", "careful with money", ["good at sports", "quick to anger"]],
  ["The first act was *tedious*; the second, by contrast, was exciting.", "boring", ["funny", "short"]],
  ["Instead of being *hostile*, the neighbors welcomed us warmly.", "unfriendly", ["curious", "wealthy"]],
  ["The river is *placid* today, but it was wild last week.", "calm", ["deep", "cold"]],
  ["Far from being *scarce*, apples were everywhere that fall.", "hard to find", ["sweet", "expensive"]],
];

const exampleClueBank: readonly ChoiceItem[] = [
  ["*Precipitation*, such as rain, snow and hail, fell all week.", "water falling from the sky", ["strong wind", "thick clouds"]],
  ["She loves *legumes*, including beans, peas and lentils.", "plants with seeds in pods", ["sweet fruits", "green leaves"]],
  [
    "The shop sells *percussion* instruments like drums and cymbals.",
    "instruments you strike",
    ["instruments you blow", "instruments with strings"],
  ],
  ["He collects *amphibians*, such as frogs, toads and newts.", "animals of land and water", ["birds", "large insects"]],
  ["*Celestial* objects, such as stars and planets, filled the sky.", "of the sky", ["very bright", "very small"]],
  [
    "They bought *utensils*, for example forks, spoons and ladles.",
    "tools for eating and cooking",
    ["kinds of food", "pieces of furniture"],
  ],
  ["*Inclement* weather, such as storms and sleet, closed the road.", "harsh", ["warm", "changing"]],
  ["The zoo has many *primates*, including apes, monkeys and lemurs.", "apes and their relatives", ["big cats", "large birds"]],
];

const academicMeaningBank: readonly ChoiceItem[] = [
  ["analyze", "to study the parts of something", ["to agree with something", "to make something larger"]],
  ["evidence", "facts that show something is true", ["a guess about the future", "a story that is made up"]],
  ["significant", "large or important", ["small and common", "hard to see"]],
  ["predict", "to say what will happen", ["to remember what happened", "to refuse to answer"]],
  ["compare", "to find how things are alike and different", ["to make one thing out of two", "to give up something"]],
  ["sequence", "the order in which things happen", ["the cause of something", "a large group"]],
  ["conclude", "to decide from the facts", ["to start something new", "to doubt the facts"]],
  ["relevant", "connected to what matters here", ["very old", "easy to understand"]],
  ["estimate", "to make a careful guess about an amount", ["to count exactly", "to throw away"]],
  ["source", "where something comes from", ["where something ends", "how much something costs"]],
];

const academicUseBank: readonly ChoiceItem[] = [
  ["The lawyer showed ___ that the letter was fake.", "evidence", ["sequence", "estimate"]],
  ["Scientists ___ the water to learn what is in it.", "analyze", ["predict", "conclude"]],
  ["There was a ___ rise in prices, so many people noticed.", "significant", ["relevant", "credible"]],
  ["Please put the events in the correct ___.", "sequence", ["evidence", "source"]],
  ["From these results, we can ___ that the plan worked.", "conclude", ["compare", "estimate"]],
  ["That fact is not ___ to our question, so leave it out.", "relevant", ["significant", "visible"]],
  ["Can you ___ how many people will come?", "estimate", ["analyze", "conclude"]],
  ["Always check the ___ of what you read online.", "source", ["sequence", "estimate"]],
  ["Let us ___ the two maps to see what changed.", "compare", ["conclude", "predict"]],
  ["Forecasters ___ snow for tomorrow.", "predict", ["compare", "analyze"]],
];

const connotationBank: readonly ChoiceItem[] = [
  ["thrifty, stingy or tight-fisted: Which is the kindest way to describe someone who saves money?", "thrifty", ["stingy", "tight-fisted"]],
  ["curious, nosy or prying: Which is the kindest way to describe someone who asks questions?", "curious", ["nosy", "prying"]],
  ["slim, scrawny or bony: Which is the kindest way to describe a thin person?", "slim", ["scrawny", "bony"]],
  ["confident, arrogant or cocky: Which is the kindest way to describe someone sure of themselves?", "confident", ["arrogant", "cocky"]],
  [
    "stubborn, determined or pigheaded: Which is the kindest way to describe someone who will not give up?",
    "determined",
    ["stubborn", "pigheaded"],
  ],
  ["cheap, affordable or cut-rate: Which makes a price sound best?", "affordable", ["cheap", "cut-rate"]],
  ["cozy, cramped or poky: Which makes a small room sound best?", "cozy", ["cramped", "poky"]],
  ["old, antique or worn-out: Which makes a chair sound most valuable?", "antique", ["old", "worn-out"]],
  ["smell, fragrance or odor: Which makes a scent sound best?", "fragrance", ["smell", "odor"]],
  ["crowd, mob or horde: Which makes a large group sound least dangerous?", "crowd", ["mob", "horde"]],
];

const preciseBank: readonly ChoiceItem[] = [
  ["The tired hikers ___ slowly up the last hill. (walked with difficulty)", "trudged", ["skipped", "strolled"]],
  ["The child ___ happily across the yard. (moved with little hops)", "skipped", ["trudged", "crept"]],
  ["The thief ___ past the sleeping guard. (moved quietly)", "crept", ["stomped", "skipped"]],
  ['"Get out!" she ___. (spoke very loudly)', "shouted", ["whispered", "mumbled"]],
  ["He ___ the secret in my ear. (spoke very softly)", "whispered", ["shouted", "announced"]],
  ["The baby ___ at the bright toy. (looked for a long time)", "stared", ["glanced", "peeked"]],
  ["She ___ at her watch and kept talking. (looked quickly)", "glanced", ["stared", "studied"]],
  ["The hungry boy ___ his dinner. (ate quickly)", "gobbled", ["nibbled", "tasted"]],
  ["The mouse ___ the cheese. (ate in small bites)", "nibbled", ["gobbled", "devoured"]],
  ["The sun ___ on the calm water. (shone with small flashes)", "sparkled", ["glared", "faded"]],
];

/** entry returns the entry of a feedback table, failing loudly when a bank uses an option the table does not cover. */
function entry<V>(table: ReadonlyMap<string, V> | Readonly<Record<string, V>>, key: string): V {
  const found = table instanceof Map ? table.get(key) : (table as Readonly<Record<string, V>>)[key];
  if (found === undefined) throw new Error(`no feedback for the option "${key}"`);
  return found;
}

type Pair = readonly [en: string, zh: string];

const affixes = new Set(["un", "re", "less", "ness", "ful", "dis", "ly", "er"]);

const notBase = (wrong: string) =>
  affixes.has(wrong)
    ? t(
        `“${wrong}” is the part added to the word, a prefix or a suffix. The base word is what is left when that part is taken away.`,
        `“${wrong}” 是加在词上的部分，即前缀或后缀。基础词是去掉这部分后剩下的词。`,
      )
    : t(
        `“${wrong}” cuts through the base word. Take away only the prefix or suffix and keep every letter of what is left.`,
        `“${wrong}” 把基础词切断了。只去掉前缀或后缀，保留剩下部分的每一个字母。`,
      );

const partKind: Readonly<Record<string, Pair>> = {
  Prefix: [
    "A prefix is added at the start of a word and cannot stand alone. Check where this part sits and whether it is a word by itself.",
    "前缀加在词的开头，不能独立成词。看看这部分的位置，以及它本身是不是一个词。",
  ],
  Suffix: [
    "A suffix is added at the end of a word and cannot stand alone. Check where this part sits and whether it is a word by itself.",
    "后缀加在词的末尾，不能独立成词。看看这部分的位置，以及它本身是不是一个词。",
  ],
  "Base word": [
    "A base word can stand alone as a word of its own. Check whether this part is a word by itself.",
    "基础词本身能独立成词。看看这部分本身是不是一个词。",
  ],
};

const wordClassKind: Readonly<Record<string, Pair>> = {
  Noun: [
    "A noun names a person, place, thing or idea, and noun suffixes include *-tion*, *-ment* and *-ness*. Check which group this word's ending belongs to.",
    "名词为人、地点、事物或概念命名，名词后缀有 *-tion*、*-ment*、*-ness* 等。看看这个词的词尾属于哪一类。",
  ],
  Verb: [
    "A verb names an action, and verb suffixes include *-ize*, *-ify* and *-en*. Check which group this word's ending belongs to.",
    "动词表示动作，动词后缀有 *-ize*、*-ify*、*-en* 等。看看这个词的词尾属于哪一类。",
  ],
  Adjective: [
    "An adjective describes a noun, and adjective suffixes include *-ous*, *-al* and *-ive*. Check which group this word's ending belongs to.",
    "形容词描述名词，形容词后缀有 *-ous*、*-al*、*-ive* 等。看看这个词的词尾属于哪一类。",
  ],
};

const label = (table: Readonly<Record<string, Pair>>) => (wrong: string) => {
  const [en, zh] = entry(table, wrong);
  return t(en, zh);
};

/** ownerOf maps each meaning a bank offers to the part that has it: the bank's own parts, then parts taught elsewhere. */
const ownerOf = (bank: readonly ChoiceItem[], elsewhere: Readonly<Record<string, string>> = {}) =>
  new Map([...bank.map(([part, meaning]) => [meaning, part] as const), ...Object.entries(elsewhere)]);

const otherPart = (owners: ReadonlyMap<string, string>) => (wrong: string, _right: string, item: string) => {
  const owner = entry(owners, wrong);
  const shown = item.split(" as in ")[0]!;
  return t(
    `“${wrong}” is what *${owner}* means, not *${shown}*. Think of a word you know with *${shown}* in it, and what that part adds.`,
    `“${wrong}” 是 *${owner}* 的意思，不是 *${shown}* 的意思。想一个含有 *${shown}* 的熟词，看看这部分带来了什么意思。`,
  );
};

const partWord: Readonly<Record<"prefix" | "suffix" | "root", Pair>> = {
  prefix: ["prefix", "前缀"],
  suffix: ["suffix", "后缀"],
  root: ["root", "词根"],
};

const mismatchedPart = (part: keyof typeof partWord) => (wrong: string, _right: string, shown: string) => {
  const [en, zh] = partWord[part];
  return t(
    `“${wrong}” does not match the ${en} of *${shown}*. Find the ${en}, recall what it means, and join that meaning to the rest of the word.`,
    `“${wrong}” 与 *${shown}* 的${zh}不符。找出${zh}，想想它的意思，再把这个意思和词的其余部分合起来。`,
  );
};

const missedDefinition = (wrong: string) =>
  t(
    `“${wrong}” is not what the sentence says the word means. The sentence explains the word itself: look for *or*, *that is*, *which means*, or a phrase set off by commas.`,
    `句子说的词义并不是“${wrong}”。句子本身解释了这个词：找一找 *or*、*that is*、*which means*，或者用逗号隔开的短语。`,
  );

const missedContrast = (wrong: string) =>
  t(
    `“${wrong}” is not the opposite of what the other side of the contrast says. Find the contrast word, such as *unlike* or *but*, and take the opposite of that side.`,
    `“${wrong}” 并不是对比另一边所说内容的反义。找出 *unlike* 或 *but* 这样的对比词，取那一边意思的反面。`,
  );

const missedExamples = (wrong: string) =>
  t(
    `“${wrong}” does not fit all the examples the sentence gives. Ask what every one of the examples has in common.`,
    `“${wrong}” 并不适用于句子给出的所有例子。想一想这些例子共有的特点是什么。`,
  );

const notTheMeaning = (wrong: string, _right: string, shown: string) =>
  t(
    `“${wrong}” is not what *${shown}* means. Picture *${shown}* in a sentence from a textbook and check whether this meaning would make sense there.`,
    `*${shown}* 的意思不是“${wrong}”。设想 *${shown}* 出现在课本的一个句子里，看看这个意思放在那里是否说得通。`,
  );

const academic1 = academicSentenceBanks(academicMeaningBank, academicSentences1);

/** bold finds the word in bold in a sentence, or gives back what is shown when nothing is bold. */
const bold = (shown: string): string => /\*\*(.+?)\*\*/.exec(shown)?.[1] ?? shown;

const glossary = new Map([...academicMeaningBank, ...latin1WordBank, ...latin2WordBank].map(([word, meaning]) => [word, meaning] as const));

const wrongWord = (wrong: string) => {
  const meaning = entry(glossary, wrong);
  return t(
    `“${wrong}” means *${meaning}*, which does not complete the thought of this sentence.`,
    `“${wrong}” 的意思是 *${meaning}*，放进这个句子意思不通。`,
  );
};

const lessFavorable = (wrong: string) =>
  t(
    `“${wrong}” means nearly the same, but it carries a less favorable feeling. Ask which word puts what is described in the best light.`,
    `“${wrong}” 意思几乎相同，但感情色彩没那么正面。想一想哪个词能让所描述的对象显得最好。`,
  );

const shade: Readonly<Record<string, Pair>> = {
  skipped: ["moved with little hops", "轻快地跳着走"],
  strolled: ["walked in a slow, relaxed way", "悠闲地慢慢走"],
  trudged: ["walked with difficulty", "吃力地走"],
  crept: ["moved quietly and slowly", "悄悄地慢慢移动"],
  stomped: ["walked with loud, heavy steps", "重重地跺着脚走"],
  whispered: ["spoke very softly", "很轻声地说"],
  mumbled: ["spoke unclearly", "含糊地说"],
  shouted: ["spoke very loudly", "大声地喊"],
  announced: ["told everyone publicly", "公开地宣布"],
  glanced: ["looked quickly", "很快地看一眼"],
  peeked: ["looked quickly and secretly", "偷偷地很快看一眼"],
  stared: ["looked for a long time", "长时间地盯着看"],
  studied: ["looked at carefully to learn", "仔细地察看"],
  nibbled: ["ate in small bites", "小口地咬着吃"],
  tasted: ["tried a little to see the flavor", "尝一点味道"],
  gobbled: ["ate quickly", "狼吞虎咽地吃"],
  devoured: ["ate all of it hungrily", "饥饿地全部吃光"],
  glared: ["shone with a harsh, strong light", "发出刺眼的强光"],
  faded: ["slowly grew dim", "渐渐变暗"],
};

const otherShade = (wrong: string) => {
  const [en, zh] = entry(shade, wrong);
  return t(`“${wrong}” means *${en}*, which is not what the parentheses describe.`, `“${wrong}” 的意思是“${zh}”，与括号中描述的意思不符。`);
};

// More items, built from hand-written cores by deterministic templates.

/** rows splits hand-written lines of fields separated by bars. */
const rows = (lines: string): string[][] =>
  lines
    .trim()
    .split("\n")
    .map((line) => line.trim().split("|"));

/** choices turns lines of word, meaning and two wrong meanings into choice items. */
const choices = (lines: string): ChoiceItem[] => rows(lines).map(([shown, right, ...wrong]) => [shown!, right!, wrong]);

/** inWords gives each part of a meaning bank in three words that use it, keeping the part's meaning and wrong meanings. */
const inWords = (bank: readonly ChoiceItem[], words: Readonly<Record<string, string>>): ChoiceItem[] =>
  bank.flatMap(([part, right, wrong]) =>
    (words[part] ?? "")
      .split(" ")
      .filter(Boolean)
      .map((word): ChoiceItem => [`${part} as in *${word}*`, right, wrong]),
  );

const prefixMeaningMore = inWords(prefixMeaningBank, {
  "un-": "unafraid unlucky unsafe",
  "re-": "refill retell reopen",
  "dis-": "disagree disappear disconnect",
  "pre-": "preview preschool prepay",
  "mis-": "misspell misread misplace",
  "non-": "nonstop nonfiction nonsense",
  "over-": "overcook overfill oversleep",
  "under-": "undercook underpaid underfed",
});
const suffixMeaningMore = inWords(suffixMeaningBank, {
  "-ful": "hopeful playful painful",
  "-less": "spotless endless sleepless",
  "-er": "teacher baker painter",
  "-ness": "sadness darkness softness",
  "-able": "washable breakable readable",
  "-ly": "quickly softly bravely",
  "-est": "tallest smallest coldest",
  "-ish": "childish greenish foolish",
});
const positionMeaningMore = inWords(positionMeaningBank, {
  "uni-": "uniform unicorn",
  "bi-": "bicycle bilingual",
  "tri-": "tricycle tripod",
  "semi-": "semicircle semisweet",
  "multi-": "multicolor multistory",
  "sub-": "subway submarine",
  "super-": "superscript supersonic",
  "inter-": "international interstate",
  "trans-": "transatlantic transplant",
  "post-": "postwar postscript",
});
const latin1RootMore = inWords(latin1RootBank, {
  port: "portable import export",
  dict: "dictate contradict verdict",
  rupt: "interrupt rupture disrupt",
  "scrib or script": "describe manuscript inscribe",
  struct: "construct instruct structure",
  tract: "tractor attract subtract",
  "vis or vid": "vision video invisible",
  spect: "inspect spectator spectacles",
});
const greekRootMore = inWords(greekRootBank, {
  tele: "telescope television",
  graph: "paragraph autograph",
  phon: "microphone phonics",
  photo: "photograph photocopy",
  bio: "biology biologist",
  geo: "geography geology",
  therm: "thermometer thermos",
  micro: "microscope microchip",
  auto: "automatic autopilot",
  scope: "periscope microscope",
});

const prefixWordMore = choices(`
  unafraid|not afraid|afraid again|afraid before
  unlucky|not lucky|lucky again|lucky before
  unkind|not kind|kind again|kind before
  refill|fill again|not fill|fill before
  retell|tell again|tell wrongly|not tell
  reopen|open again|open before|not open
  disagree|not agree|agree again|agree before
  disappear|the opposite of appear|appear again|appear before
  disconnect|the opposite of connect|connect again|connect wrongly
  preview|view before|view again|not view
  prepay|pay before|pay again|pay too much
  misspell|spell wrongly|spell again|spell before
  misbehave|behave wrongly|behave again|behave before
  misplace|put in the wrong place|put in place again|put in place before
  nonliving|not living|living again|living before
  nonfiction|writing that is not made up|writing made up again|writing made up before
  overeat|eat too much|eat too little|eat again
  oversleep|sleep too long|sleep too little|sleep again
  undercook|cook too little|cook too much|cook before
  underfed|fed too little|fed too much|fed again
  unwrap|take the wrapping off|wrap again|wrap before
`);
const suffixWordMore = choices(`
  hopeful|full of hope|without hope|someone who hopes
  playful|full of play|without play|able to play
  spotless|without a spot|full of spots|able to be spotted
  endless|without an end|full of ends|someone who ends
  sleepless|without sleep|full of sleep|able to sleep
  teacher|a person who teaches|without teaching|able to teach
  baker|a person who bakes|without baking|full of baking
  painter|a person who paints|able to be painted|without paint
  illness|the state of being ill|a person who is ill|in an ill way
  darkness|the state of being dark|without dark|in a dark way
  softness|the state of being soft|able to be soft|a person who is soft
  enjoyable|able to be enjoyed|without joy|a person who enjoys
  drinkable|able to be drunk|without drinking|someone who drinks
  readable|able to be read|without reading|a person who reads
  quickly|in a quick way|the state of being quick|the most quick
  loudly|in a loud way|full of loudness|without loudness
  bravely|in a brave way|without bravery|the most brave
  longest|the most long|somewhat long|in a long way
  coldest|the most cold|somewhat cold|in a cold way
  greenish|somewhat green|the most green|without green
  childish|like a child|without a child|a person who is a child
`);
const positionWordMore = choices(`
  uniform|clothing that is all one style|clothing in two styles|clothing in three styles
  unicorn|a creature with one horn|a creature with two horns|a creature with many horns
  bicycle|a cycle with two wheels|a cycle with one wheel|a cycle with three wheels
  bilingual|speaking two languages|speaking one language|speaking many languages
  tricycle|a cycle with three wheels|a cycle with two wheels|a cycle with one wheel
  tripod|a stand with three legs|a stand with two legs|a stand with many legs
  semicircle|half a circle|three circles|many circles
  multicolor|having many colors|having one color|having two colors
  multistory|having many floors|having one floor|having half a floor
  subway|a train that runs under the ground|a train that runs over the ground|a train that runs across the ground
  submarine|a ship that goes under the sea|a ship that goes above the sea|a ship that goes across the sea
  superscript|writing set above the line|writing set under the line|writing set between lines
  supersonic|above the speed of sound|below the speed of sound|between two speeds of sound
  intercity|between cities|under one city|after the cities
  interstate|a road between states|a road under a state|a road after a state
  transcontinental|across a continent|under a continent|before a continent
  transplant|to move a plant across to a new place|to plant under the ground|to plant before spring
  postdate|to put a date after the real one|to put a date before the real one|to put a date under the real one
  postscript|a note written after the letter|a note written before the letter|a note written under the letter
  postgame|after the game|before the game|between games
`);
const latin1WordMore = choices(`
  portable|able to be carried|able to be seen|able to be written
  import|to carry into a country|to see into a country|to break into a country
  porter|a person who carries bags|a person who writes letters|a person who breaks rocks
  dictate|to say words for someone to write|to carry words to someone|to break words apart
  contradict|to say the opposite|to see the opposite|to build the opposite
  verdict|what a jury says is true|what a jury carries|what a jury builds
  interrupt|to break into a conversation|to say into a conversation|to look into a conversation
  disrupt|to break apart an order|to pull apart an order|to see apart an order
  describe|to write or tell about|to break apart|to pull about
  manuscript|something written by hand|something carried by hand|something broken by hand
  inscribe|to write into a surface|to look into a surface|to carry into a surface
  reconstruct|to build again|to pull again|to say again
  structure|something that is built|something that is carried|something that is said
  tractor|a machine that pulls|a machine that writes|a machine that looks
  attract|to pull toward|to say toward|to break toward
  subtract|to pull away a number|to write a number|to see a number
  vision|the ability to see|the ability to carry|the ability to say
  invisible|not able to be seen|not able to be carried|not able to be built
  inspect|to look into closely|to break into closely|to carry into closely
  spectator|a person who looks on|a person who builds|a person who writes
  rupture|a break or burst|a pull or tug|a written note
`);
const greekWordMore = choices(`
  telescope|a tool for looking at things far away|a tool for hearing life|a tool for measuring heat
  television|pictures sent from far away|sounds of the earth|a picture of oneself
  paragraph|a block of written sentences|a block of sounds|a block of light
  photograph|a picture made with light|a sound recorded far away|a map of the earth
  microphone|a device that picks up small sounds|a device for small lights|a device for measuring heat
  symphony|sounds played together|lights shown together|lives lived together
  geothermal|heat from inside the earth|sound from inside the earth|light from inside the earth
  geography|writing about the earth|the study of life|a picture made with light
  geologist|a scientist who studies the earth|a scientist who studies life|a scientist who studies sound
  thermostat|a device that controls heat|a device that controls sound|a device that controls light
  thermos|a bottle that keeps heat in|a bottle that keeps sound in|a bottle that keeps light in
  microbe|a very small living thing|a very large living thing|a living thing far away
  automatic|working by itself|working far away|working with light
  autopilot|a system that flies a plane by itself|a system that flies a plane far away|a system that flies a plane with sound
  automobile|a vehicle that moves by itself|a vehicle that moves by sound|a vehicle that moves with light
  periscope|a tube for looking around|a tube for sound|a tube for heat
  phonics|the sounds of letters|the light of letters|the life of letters
  telegram|a written message sent far|a sound recorded at home|a picture of the earth
  photocopy|a copy made with light|a copy made with sound|a copy made by hand
  biologist|a scientist who studies life|a scientist who studies heat|a scientist who studies sound
`);

const spelledRows = (lines: string): TypedItem[] => rows(lines).map(([shown, right, ...wrong]) => spelled(shown!, right!, ...wrong));
const prefixTypedMore = spelledRows(`
  not afraid|unafraid|disafraid|inafraid
  fill again|refill|prefill|unfill
  not agree|disagree|unagree|misagree
  view before|preview|review|misview
  spell wrongly|misspell|mispell|disspell
  without stopping|nonstop|unstop|disstop
  cook too much|overcook|undercook|recook
  cook too little|undercook|overcook|miscook
  visit again|revisit|previsit|unvisit
  not lucky|unlucky|dislucky|inlucky
  the opposite of like|dislike|unlike|mislike
  heat before|preheat|reheat|misheat
  read wrongly|misread|reread|disread
  work too much|overwork|underwork|miswork
  not safe|unsafe|dissafe|insafe
  open again|reopen|preopen|unopen
  place wrongly|misplace|displace|replace
  writing that is not fiction|nonfiction|unfiction|disfiction
  the opposite of connect|disconnect|unconnect|misconnect
  fed too little|underfed|overfed|misfed
`);
const suffixTypedMore = spelledRows(`
  hope + ful|hopeful|hopefull|hopful
  play + ful|playful|playfull|plaful
  end + less|endless|endles|endlees
  spot + less|spotless|spotles|spottless
  teach + er|teacher|teachor|teacheer
  write + er|writer|writeer|writter
  sad + ness|sadness|sadnes|saddness
  dark + ness|darkness|darknes|darkniss
  wash + able|washable|washible|washabel
  break + able|breakable|breakible|breakabel
  quick + ly|quickly|quickely|quikly
  brave + ly|bravely|bravly|bravelly
  tall + est|tallest|tallist|talest
  hot + est|hottest|hotest|hottist
  child + ish|childish|childsh|childesh
  win + er|winner|winer|winnor
  lazy + ness|laziness|lazyness|lazines
  plenty + ful|plentiful|plentyful|plentifull
  happy + ly|happily|happyly|happly
  shop + er|shopper|shoper|shoppor
`);
const buildMore = spelledRows(`
  un + able|unable|unabel
  re + fill|refill|refil
  care + less|careless|carless
  help + less|helpless|helples
  dis + obey|disobey|disobay
  re + paint|repaint|repant
  play + er|player|playor
  un + even|uneven|unevan
  sweet + ness|sweetness|sweetnes
  re + write|rewrite|rewright
  sad + ly|sadly|sadley
  thank + ful|thankful|thankfull
  dis + honest|dishonest|dishonist
  un + wrap|unwrap|unrap
  fear + less|fearless|fearles
  re + heat|reheat|reheet
  soft + ness|softness|softnes
  farm + er|farmer|farmor
  un + tie|untie|untye
  dis + trust|distrust|distrus
`);

/** parted are words split into a base and the part added to it, with a cut that splits the base. */
const parted: readonly (readonly [word: string, base: string, affix: string, cut: string])[] = rows(`
  unpack|pack|un|unpa
  refill|fill|re|refi
  hopeless|hope|less|hop
  softness|soft|ness|sof
  playful|play|ful|pla
  disarm|arm|dis|disa
  slowly|slow|ly|slo
  speaker|speak|er|spea
  untie|tie|un|ti
  reheat|heat|re|hea
  fearless|fear|less|fea
  fitness|fit|ness|fi
  thankful|thank|ful|than
  disobey|obey|dis|obe
  quietly|quiet|ly|qui
  climber|climb|er|cli
  unwrap|wrap|un|wra
  retell|tell|re|tel
  sleepless|sleep|less|slee
  kindly|kind|ly|kin
`).map(([w, b, a, c]) => [w!, b!, a!, c!]);
const baseMore: readonly ChoiceItem[] = parted.map(([w, b, a, c]) => [w, b, [a, c]]);
const isPrefix = (affix: string) => ["un", "re", "dis"].includes(affix);
const affixKindMore: readonly ChoiceItem[] = [
  ...parted.map(([w, , a]): ChoiceItem => {
    const kind = isPrefix(a) ? "Prefix" : "Suffix";
    return [`The *${isPrefix(a) ? `${a}-` : `-${a}`}* in *${w}*`, kind, [kind === "Prefix" ? "Suffix" : "Prefix", "Base word"]];
  }),
  ...parted.slice(0, 4).map(([w, b]): ChoiceItem => [`The *${b}* in *${w}*`, "Base word", ["Prefix", "Suffix"]]),
];

const classMore: readonly ChoiceItem[] = rows(`
  government|Noun
  treatment|Noun
  payment|Noun
  invention|Noun
  friendship|Noun
  statement|Noun
  purify|Verb
  sharpen|Verb
  organize|Verb
  brighten|Verb
  terrify|Verb
  apologize|Verb
  solidify|Verb
  poisonous|Adjective
  magical|Adjective
  joyous|Adjective
  famous|Adjective
  natural|Adjective
  active|Adjective
  nervous|Adjective
`).map(([w, c]) => [w!, c!, ["Noun", "Verb", "Adjective"].filter((k) => k !== c)]);

const classTypedMore = spelledRows(`
  We watched the (perform) at the theater.|performance|performence|performation
  The (invent) of the wheel changed history.|invention|inventation|invension
  Please (simple) the instructions.|simplify|simplize|simpleify
  The puppy was very (play).|playful|playfull|playable
  Her (kind) made everyone smile.|kindness|kindment|kindnes
  The trip was full of (excite).|excitement|excitment|excitness
  The ancient vase is very (value).|valuable|valueable|valuful
  The (move) of the clock hands is slow.|movement|movment|movation
  The hike was (adventure).|adventurous|adventureous|adventurful
  The lamp will (bright) the room.|brighten|brightify|brightize
  The town held a (celebrate).|celebration|celebratement|celebrateion
  The (agree) was signed today.|agreement|agreemant|agreetion
  The (create) project won a prize.|creative|createive|creatful
  Their (friend) lasted for years.|friendship|friendment|friendness
  Please (apology) to your sister.|apologize|apologyize|apologate
  The (music) show was fun.|musical|musicful|musicous
  The (explain) was clear.|explanation|explaination|explainment
  We need to (short) the rope.|shorten|shortify|shortize
  The (decorate) on the cake looked great.|decoration|decoratement|decorasion
  The (nature) light came through the window.|natural|naturous|natureal
  The (govern) made a new law.|government|governation|govermant
`);

const definitionClueMore = choices(`
  The desert is home to many *reptiles*, or cold-blooded animals with scales.|cold-blooded animals with scales|birds that cannot fly|small furry animals
  Grandpa is a *carpenter*, a person who builds things out of wood.|a person who builds with wood|a person who drives a truck|a person who grows food
  The *summit*, or top of the mountain, was covered in snow.|the top of a mountain|the bottom of a valley|the edge of a river
  Bears *hibernate*; that is, they sleep through the winter.|sleep through the winter|hunt in the snow|move south for the winter
  A *meteorologist*, a scientist who studies weather, gave the forecast.|a weather scientist|a star scientist|a rock scientist
  The bread was *stale*, which means it was old and dry.|old and dry|warm and soft|sweet and fresh
  We saw a *mirage*, something that looks real but is not there.|something that looks real but is not|a kind of desert plant|a strong sandstorm
  The road was *congested*; in other words, it was full of traffic.|full of traffic|newly paved|very narrow
  The *ancient* coins, which were thousands of years old, sat in a case.|very old|very shiny|very rare
  My aunt is *frugal*, meaning she is careful not to waste money.|careful with money|generous with gifts|quick to anger
  The *larva*, or young form of an insect, wriggled on the leaf.|a young insect|a kind of leaf|an insect's nest
  He felt *drowsy*, which is to say sleepy, after lunch.|sleepy|hungry|cheerful
  The *orchard*, a field of fruit trees, was full of apples.|a field of fruit trees|a large barn|a vegetable stand
  She is *ambidextrous*; that is, she can use both hands equally well.|able to use both hands well|able to run very fast|able to speak two languages
  The *crevice*, a narrow crack in the rock, hid a lizard.|a narrow crack|a tall tower|a deep lake
  The soup was *bland*, meaning it had very little taste.|having little taste|very spicy|too hot
  A *pediatrician*, a doctor for children, checked my ears.|a children's doctor|an animal doctor|a tooth doctor
  The forest was *dense*, or thick and crowded with trees.|thick and crowded|bright and open|wet and muddy
  We need to *conserve*, or save, water during the drought.|save|waste|heat
  The *nomads*, people who move from place to place, set up their tents.|people who keep moving|people who build cities|people who fish
  My brother is *punctual*; in other words, he is always on time.|always on time|always hungry|always loud
  A *glacier*, a huge river of slow-moving ice, filled the valley.|a huge mass of moving ice|a hot spring|a sandy beach
`);
const contrastClueMore = choices(`
  Unlike the *placid* lake, the river rushed and foamed.|calm|deep|cold
  The first test was easy, but the second was *arduous*.|very hard|very short|very new
  Although Mia is usually *talkative*, she was quiet today.|liking to talk a lot|liking to sleep a lot|liking to eat a lot
  The old bridge was *rickety*, but the new one is strong and steady.|shaky and weak|long and wide|painted and bright
  Instead of being *generous*, the king kept all the gold for himself.|willing to give|willing to fight|willing to travel
  The puppy was *docile*, unlike the wild, snapping fox.|gentle and easy to handle|fast and noisy|tiny and fluffy
  Sam's room is *cluttered*, while Ana's is neat and empty.|messy and full of things|large and bright|cold and dark
  The weather was *frigid* yesterday, but today it is warm.|very cold|very windy|very wet
  Unlike his *cautious* sister, Leo jumped in without looking.|careful|tall|sleepy
  The movie was *tedious*, not exciting at all.|boring|scary|funny
  Although the path looked *hazardous*, it turned out to be perfectly safe.|dangerous|long|beautiful
  Most of the fruit was ripe, but a few pears were still *immature*.|not fully grown|too soft|very sweet
  Her answer was *vague*, but his was clear and exact.|unclear|long|loud
  The baby was *wailing* a minute ago, but now she is silent.|crying loudly|laughing quietly|eating slowly
  Unlike the *barren* field, the garden was full of plants.|empty, with nothing growing|wet and muddy|fenced in
  The castle walls were *massive*, but the doors were tiny.|very large|very old|very thin
  Instead of *praising* the team, the coach pointed out every mistake.|saying good things about|watching closely|paying
  The city was *bustling* during the day, but quiet at night.|busy and full of activity|dark and cold|clean and new
  My cat is *aloof*, while my dog is friendly to everyone.|distant and unfriendly|lazy and slow|small and quiet
  The first rope was *taut*, but the second hung loose.|pulled tight|very long|cut short
  Although Ravi felt *anxious* before the race, he was calm afterward.|worried|hungry|proud
  The beach was *pristine* in the morning, but littered by evening.|perfectly clean|very crowded|very windy
`);
const exampleClueMore = choices(`
  *Citrus* fruits, such as lemons, limes and oranges, are full of juice.|a group of tangy, juicy fruits|fruits with hard shells|fruits that grow underground
  *Rodents*, including mice, rats and squirrels, live in the old barn.|small gnawing animals|large hunting cats|birds that swim
  She plays *percussion* instruments like drums, cymbals and bells.|instruments you strike|instruments you blow into|instruments with strings
  *Furniture*, for example chairs, tables and beds, filled the truck.|large movable objects in a home|food for the kitchen|tools for the garden
  *Amphibians*, such as frogs, toads and salamanders, lay eggs in ponds.|cold-blooded animals that start life in water|birds of prey|sea mammals
  *Gems*, such as rubies, emeralds and diamonds, sparkled in the case.|valuable stones|old coins|glass bottles
  *Vehicles* like buses, trucks and vans crowded the road.|machines that carry people or things|traffic signs|street lights
  *Utensils*, including forks, spoons and ladles, hung by the stove.|tools for cooking or eating|kinds of soup|kitchen chairs
  *Celestial* objects, such as stars, planets and moons, fill the night sky.|found in the sky or space|found under the sea|found in caves
  *Insects* such as ants, bees and beetles lived in the old log.|small six-legged creatures|small furry animals|worms and snails
  *Beverages*, for instance juice, milk and tea, were served at the party.|drinks|snacks|desserts
  *Toiletries*, like toothpaste, soap and shampoo, go in this bag.|things for washing and grooming|things for cooking|things for writing
  *Marsupials*, such as kangaroos, koalas and wombats, live in Australia.|animals that carry their young in a pouch|animals that lay eggs in sand|animals that live only in trees
  *Garments* such as coats, skirts and shirts hung in the closet.|pieces of clothing|pieces of furniture|kinds of fabric
  *Condiments*, including ketchup, mustard and relish, sat on the table.|sauces added to food for flavor|main dishes|kinds of bread
  *Predators*, such as lions, wolves and sharks, are feared by many animals.|animals that hunt others|animals that eat only plants|animals that live in herds
  *Hardware*, such as nails, screws and bolts, was sold by the pound.|small metal parts for building|paint and brushes|wooden boards
  *Cereals*, including wheat, rice and oats, are grown on farms.|grains|fruits|root vegetables
  *Primates* like monkeys, apes and lemurs climbed in the zoo's trees.|monkeys and their relatives|cats and their relatives|bears and their relatives
  *Footwear*, for example boots, sandals and sneakers, was on sale.|things worn on the feet|things worn on the head|things carried in the hands
  *Seasonings*, such as salt, pepper and garlic, make food tasty.|things that add flavor|things that keep food cold|things that make food crunchy
  *Stationery*, including paper, envelopes and pens, filled the drawer.|writing supplies|cleaning supplies|sewing supplies
`);

/** wordTopics are the topics of word parts, of context and of word choice. */
export const wordTopics: readonly TopicDef[] = [
  {
    id: "base-words-and-affixes",
    title: t("Base Words and Affixes", "基础词和词缀"),
    summary: t("Many words are a base word with a prefix or a suffix.", "许多词由基础词加前缀或后缀构成。"),
    prerequisites: [],
    encompasses: [],
    xp: 8,
    knowledgePoints: [
      point(
        "finding-the-base",
        t("Finding the Base Word", "找出基础词"),
        t(
          "Many long words are built from a shorter **base word**. *Unhappy* contains *happy*, and *careless* contains *care*. Finding the base word is the first step in working out what a new word means.",
          "许多长词由较短的**基础词**（base word）构成。*unhappy* 含有 *happy*，*careless* 含有 *care*。找出基础词是弄懂生词的第一步。",
        ),
        choiceGenerator(
          t("What is the base word?", "基础词是什么？"),
          [...baseBank, ...baseMore],
          (right, shown) =>
            t(`**${right}** is the word inside *${shown}* that can stand alone.`, `**${right}** 是 *${shown}* 中能独立成词的部分。`),
          notBase,
        ),
      ),
      point(
        "naming-the-parts",
        t("Prefixes and Suffixes", "前缀和后缀"),
        t(
          "A **prefix** goes before a base word: *re* + *read*. A **suffix** goes after it: *color* + *ful*. Together they are called **affixes**, and neither can stand alone as a word in this use.",
          "**前缀**（prefix）加在基础词之前：*re* + *read*。**后缀**（suffix）加在基础词之后：*color* + *ful*。它们合称**词缀**（affix），在这种用法中都不能独立成词。",
        ),
        choiceGenerator(
          t("What is this part of the word?", "这是词的哪个部分？"),
          [...affixKindBank, ...affixKindMore],
          (right) =>
            t(
              `It is a **${right.toLowerCase()}**. Look at where it sits and whether it can stand alone.`,
              `它是 **${right}**。看它的位置，以及能否独立成词。`,
            ),
          label(partKind),
        ),
      ),
      point(
        "building-words",
        t("Building a Word", "构词"),
        t(
          "To build a word, join the parts: *re* + *build* makes *rebuild*. Keep all the letters of a prefix even when this doubles a letter: *mis* + *spell* makes *misspell*.",
          "构词时把各部分连起来：*re* + *build* 构成 *rebuild*。前缀的字母要全部保留，即使出现双写：*mis* + *spell* 构成 *misspell*。",
        ),
        typedGenerator("word-form", t("Type the word these parts make.", "输入这些部分构成的词。"), [...buildBank, ...buildMore], (right) =>
          t(`The word is **${right}**. Its parts join without losing any letters.`, `这个词是 **${right}**。各部分相连时没有丢失字母。`),
        ),
      ),
    ],
  },
  {
    id: "common-prefixes",
    title: t("Common Prefixes", "常见前缀"),
    summary: t("Un-, re-, dis-, pre-, mis- and others change a word's meaning.", "un-、re-、dis-、pre-、mis- 等改变词义。"),
    prerequisites: ["base-words-and-affixes"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      point(
        "prefix-meanings",
        t("What They Mean", "它们的含义"),
        t(
          "A few prefixes appear in a great many words. *Un-*, *dis-* and *non-* mean *not* or the opposite. *Re-* means *again*. *Pre-* means *before*. *Mis-* means *wrongly*. *Over-* means *too much*, and *under-* means *too little*.",
          "少数几个前缀出现在大量词中。*un-*、*dis-*、*non-* 表示“不”或相反。*re-* 表示“再”。*pre-* 表示“之前”。*mis-* 表示“错误地”。*over-* 表示“过多”，*under-* 表示“过少”。",
        ),
        choiceGenerator(
          t("What does this prefix mean?", "这个前缀是什么意思？"),
          [...prefixMeaningBank, ...prefixMeaningMore],
          (right, shown) =>
            t(
              `*${shown}* means **${right}**. Recognizing this in a new word helps you work out what the word means.`,
              `*${shown}* 的意思是 **${right}**。在生词中认出它，有助于推断词义。`,
            ),
          otherPart(ownerOf(prefixMeaningBank, { after: "post-" })),
        ),
      ),
      point(
        "words-with-prefixes",
        t("Reading Words with Prefixes", "读懂带前缀的词"),
        t(
          "Put the meaning of the prefix together with the base word: *misread* is *read* + *wrongly*. This often gives the meaning of a word you have never seen.",
          "把前缀的含义和基础词合起来：*misread* 就是 *read* + “错误地”。这样往往能弄懂从未见过的词。",
        ),
        choiceGenerator(
          t("What does this word mean?", "这个词是什么意思？"),
          [...prefixWordBank, ...prefixWordMore],
          (right, shown) =>
            t(
              `*${shown}* means **${right}**. Recognizing this in a new word helps you work out what the word means.`,
              `*${shown}* 的意思是 **${right}**。在生词中认出它，有助于推断词义。`,
            ),
          mismatchedPart("prefix"),
        ),
      ),
      point(
        "writing-with-prefixes",
        t("Writing Words with Prefixes", "写出带前缀的词"),
        t(
          "Choose the prefix for the meaning you want, then attach it to the base word. Each base word usually goes with particular prefixes: we say *unfair* and *dishonest*, not *disfair* and *unhonest*.",
          "根据想表达的意思选择前缀，再加到基础词上。每个基础词通常只搭配特定前缀：我们说 *unfair* 和 *dishonest*，而不说 *disfair* 和 *unhonest*。",
        ),
        typedGenerator(
          "word-form",
          t("Type one word that means this.", "输入一个表示这个意思的词。"),
          [...prefixTypedBank, ...prefixTypedMore],
          (right) =>
            t(
              `The word is **${right}**. This base word takes this prefix to give that meaning.`,
              `这个词是 **${right}**。这个基础词要用这个前缀才能表达该意思。`,
            ),
        ),
      ),
    ],
  },
  {
    id: "common-suffixes",
    title: t("Common Suffixes", "常见后缀"),
    summary: t("-ful, -less, -er, -ness, -able and others, with their spelling rules.", "-ful、-less、-er、-ness、-able 等及其拼写规则。"),
    prerequisites: ["base-words-and-affixes"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      point(
        "suffix-meanings",
        t("What They Mean", "它们的含义"),
        t(
          "*-ful* means *full of*, and *-less* means *without*. *-er* names one who does something. *-ness* means *the state of being*. *-able* means *able to be*. *-ly* means *in a certain way*, *-est* means *the most*, and *-ish* means *somewhat like*.",
          "*-ful* 表示“充满”，*-less* 表示“没有”。*-er* 表示做某事的人。*-ness* 表示“状态”。*-able* 表示“能够被”。*-ly* 表示“以某种方式”，*-est* 表示“最”，*-ish* 表示“有点像”。",
        ),
        choiceGenerator(
          t("What does this suffix mean?", "这个后缀是什么意思？"),
          [...suffixMeaningBank, ...suffixMeaningMore],
          (right, shown) =>
            t(
              `*${shown}* means **${right}**. Recognizing this in a new word helps you work out what the word means.`,
              `*${shown}* 的意思是 **${right}**。在生词中认出它，有助于推断词义。`,
            ),
          otherPart(ownerOf(suffixMeaningBank, { "a person who": "-er" })),
        ),
      ),
      point(
        "words-with-suffixes",
        t("Reading Words with Suffixes", "读懂带后缀的词"),
        t(
          "As with prefixes, combine the two parts: *fearless* is *fear* + *without*, so it means *without fear*. Notice how far apart *-ful* and *-less* put a word: *painful* and *painless* are opposites.",
          "和前缀一样，把两部分合起来：*fearless* 是 *fear* + “没有”，所以意思是“无所畏惧”。注意 *-ful* 和 *-less* 的意思相反：*painful* 和 *painless* 是反义词。",
        ),
        choiceGenerator(
          t("What does this word mean?", "这个词是什么意思？"),
          [...suffixWordBank, ...suffixWordMore],
          (right, shown) =>
            t(
              `*${shown}* means **${right}**. Recognizing this in a new word helps you work out what the word means.`,
              `*${shown}* 的意思是 **${right}**。在生词中认出它，有助于推断词义。`,
            ),
          mismatchedPart("suffix"),
        ),
      ),
      point(
        "spelling-with-suffixes",
        t("Spelling Changes", "拼写变化"),
        t(
          "Three rules cover most changes. A final *y* after a consonant becomes *i*: *happy* makes *happiness*. A silent *e* drops before a suffix starting with a vowel: *bake* makes *baker*. A short word ending in one vowel and one consonant doubles the consonant before a vowel: *run* makes *runner*.",
          "三条规则涵盖了大多数变化。辅音后的词尾 *y* 变成 *i*：*happy* 变成 *happiness*。词尾不发音的 *e* 在元音开头的后缀前省略：*bake* 变成 *baker*。以一个元音加一个辅音结尾的短词，在元音开头的后缀前双写辅音：*run* 变成 *runner*。",
        ),
        typedGenerator(
          "word-form",
          t("Type the word these parts make, with the right spelling.", "输入这些部分构成的词，注意拼写。"),
          [...suffixTypedBank, ...suffixTypedMore],
          (right) =>
            t(`The word is **${right}**. One of the three spelling rules applies.`, `这个词是 **${right}**。这里用到了三条拼写规则之一。`),
        ),
      ),
    ],
  },
  {
    id: "suffixes-that-change-word-class",
    title: t("Suffixes That Change Word Class", "改变词性的后缀"),
    summary: t("A suffix can turn a verb into a noun, or a noun into an adjective.", "后缀可以把动词变成名词，把名词变成形容词。"),
    prerequisites: ["common-suffixes"],
    encompasses: [{ topic: "common-suffixes", weight: 0.4 }],
    xp: 10,
    knowledgePoints: [
      point(
        "telling-the-class",
        t("Telling the Class", "判断词性"),
        t(
          "A suffix often tells you the class of a word. *-tion, -ment* and *-ness* make nouns. *-ize, -ify* and *-en* make verbs. *-ous, -al* and *-ive* make adjectives.",
          "后缀常能告诉你词性。*-tion, -ment, -ness* 构成名词。*-ize, -ify, -en* 构成动词。*-ous, -al, -ive* 构成形容词。",
        ),
        choiceGenerator(
          t("What class of word is this?", "这个词是什么词性？"),
          [...classBank, ...classMore],
          (right, shown) =>
            t(
              `*${shown}* is a **${right.toLowerCase()}**, as its ending shows. A suffix often tells the class of a word, so look at the last letters first.`,
              `*${shown}* 是 **${right}**，词尾说明了这一点。后缀往往表明词性，所以先看最后几个字母。`,
            ),
          label(wordClassKind),
        ),
      ),
      point(
        "choosing-the-form",
        t("Choosing the Form", "选择词形"),
        t(
          "A sentence calls for a certain class. After *the*, you need a noun: *the decision*. Before a noun, or after *is*, an adjective: *a famous painting*. After *must* or *to*, a verb: *must organize*.\n\nSome words change their spelling too: *decide* becomes *decision*, and *destroy* becomes *destruction*.",
          "句子需要特定词性。*the* 之后要用名词：*the decision*。名词之前或 *is* 之后用形容词：*a famous painting*。*must* 或 *to* 之后用动词：*must organize*。\n\n有些词的拼写也会变化：*decide* 变成 *decision*，*destroy* 变成 *destruction*。",
        ),
        typedGenerator(
          "word-form",
          t("Type the form of the word in parentheses that fits the sentence.", "输入括号中词的合适形式。"),
          [...classTypedBank, ...classTypedMore],
          (right) =>
            t(
              `The word is **${right}**. The place in the sentence calls for this class.`,
              `这个词是 **${right}**。它在句中的位置要求这种词性。`,
            ),
        ),
      ),
    ],
  },
  {
    id: "prefixes-of-number-and-position",
    title: t("Prefixes of Number and Position", "表示数量和位置的前缀"),
    summary: t("Uni-, bi-, tri-, sub-, inter-, trans- and their relatives.", "uni-、bi-、tri-、sub-、inter-、trans- 等前缀。"),
    prerequisites: ["common-prefixes"],
    encompasses: [{ topic: "common-prefixes", weight: 0.3 }],
    xp: 10,
    knowledgePoints: [
      point(
        "number-and-position-meanings",
        t("What They Mean", "它们的含义"),
        t(
          "Some prefixes give a number: *uni-* is one, *bi-* is two, *tri-* is three, *semi-* is half, and *multi-* is many. Others give a position: *sub-* is under, *super-* is above, *inter-* is between, *trans-* is across, and *post-* is after.",
          "有些前缀表示数量：*uni-* 是一，*bi-* 是二，*tri-* 是三，*semi-* 是一半，*multi-* 是多。另一些表示位置：*sub-* 是在下，*super-* 是在上，*inter-* 是在之间，*trans-* 是穿过，*post-* 是在之后。",
        ),
        choiceGenerator(
          t("What does this prefix mean?", "这个前缀是什么意思？"),
          [...positionMeaningBank, ...positionMeaningMore],
          (right, shown) =>
            t(
              `*${shown}* means **${right}**. Recognizing this in a new word helps you work out what the word means.`,
              `*${shown}* 的意思是 **${right}**。在生词中认出它，有助于推断词义。`,
            ),
          otherPart(ownerOf(positionMeaningBank, { over: "over-", before: "pre-" })),
        ),
      ),
      point(
        "words-of-number-and-position",
        t("Reading the Words", "读懂这些词"),
        t(
          "The prefix gives you most of the meaning: a *bicycle* has two wheels, a *submarine* travels under the sea, and an *international* match is played between nations.",
          "前缀提供了大部分含义：*bicycle* 有两个轮子，*submarine* 在海面下航行，*international* 比赛在国家之间进行。",
        ),
        choiceGenerator(
          t("What does this word mean?", "这个词是什么意思？"),
          [...positionWordBank, ...positionWordMore],
          (right, shown) =>
            t(
              `*${shown}* means **${right}**. Recognizing this in a new word helps you work out what the word means.`,
              `*${shown}* 的意思是 **${right}**。在生词中认出它，有助于推断词义。`,
            ),
          mismatchedPart("prefix"),
        ),
      ),
    ],
  },
  {
    id: "latin-roots-1",
    title: t("Latin Roots 1", "拉丁词根 1"),
    summary: t("Port, dict, rupt, scrib, struct, tract, vis and spect.", "port、dict、rupt、scrib、struct、tract、vis 和 spect。"),
    prerequisites: ["common-prefixes", "common-suffixes"],
    encompasses: [
      { topic: "common-prefixes", weight: 0.1 },
      { topic: "common-suffixes", weight: 0.1 },
    ],
    xp: 12,
    knowledgePoints: [
      point(
        "latin-1-meanings",
        t("What the Roots Mean", "词根的含义"),
        t(
          "A **root** carries the core meaning of a word, but unlike a base word it usually cannot stand alone. *Port* means carry, *dict* say, *rupt* break, *scrib* or *script* write, *struct* build, *tract* pull, *vis* or *vid* see, and *spect* look.",
          "**词根**（root）承载词的核心含义，但和基础词不同，通常不能独立成词。*port* 表示携带，*dict* 表示说，*rupt* 表示破裂，*scrib* 或 *script* 表示写，*struct* 表示建造，*tract* 表示拉，*vis* 或 *vid* 表示看见，*spect* 表示看。",
        ),
        choiceGenerator(
          t("What does this root mean?", "这个词根是什么意思？"),
          [...latin1RootBank, ...latin1RootMore],
          (right, shown) =>
            t(
              `*${shown}* means **${right}**. Recognizing this in a new word helps you work out what the word means.`,
              `*${shown}* 的意思是 **${right}**。在生词中认出它，有助于推断词义。`,
            ),
          otherPart(ownerOf(latin1RootBank)),
        ),
      ),
      point(
        "latin-1-words",
        t("Reading the Words", "读懂这些词"),
        t(
          "Combine the root with its prefix or suffix: *trans* (across) + *port* (carry) gives *to carry across*, and *pre* (before) + *dict* (say) gives *to say before it happens*.",
          "把词根和前缀或后缀合起来：*trans*（穿过）+ *port*（携带）表示“运送过去”，*pre*（之前）+ *dict*（说）表示“预言”。",
        ),
        choiceGenerator(
          t("What does this word mean?", "这个词是什么意思？"),
          [...latin1WordBank, ...latin1WordMore],
          (right, shown) =>
            t(
              `*${shown}* means **${right}**. Recognizing this in a new word helps you work out what the word means.`,
              `*${shown}* 的意思是 **${right}**。在生词中认出它，有助于推断词义。`,
            ),
          mismatchedPart("root"),
        ),
      ),
    ],
  },
  {
    id: "latin-roots-2",
    title: t("Latin Roots 2", "拉丁词根 2"),
    summary: t("Ject, mit, duc, cred, aud, fer, pel and voc.", "ject、mit、duc、cred、aud、fer、pel 和 voc。"),
    prerequisites: ["latin-roots-1"],
    encompasses: [{ topic: "latin-roots-1", weight: 0.2 }],
    xp: 12,
    knowledgePoints: [
      point(
        "latin-2-meanings",
        t("What the Roots Mean", "词根的含义"),
        t(
          "*Ject* means throw, *mit* or *miss* send, *duc* or *duct* lead, *cred* believe, *aud* hear, *fer* carry or bear, *pel* or *puls* push, and *voc* or *vok* call.",
          "*ject* 表示扔，*mit* 或 *miss* 表示送，*duc* 或 *duct* 表示引导，*cred* 表示相信，*aud* 表示听，*fer* 表示携带，*pel* 或 *puls* 表示推，*voc* 或 *vok* 表示呼喊。",
        ),
        choiceGenerator(
          t("What does this root mean?", "这个词根是什么意思？"),
          latin2RootBank,
          (right, shown) =>
            t(
              `*${shown}* means **${right}**. Recognizing this in a new word helps you work out what the word means.`,
              `*${shown}* 的意思是 **${right}**。在生词中认出它，有助于推断词义。`,
            ),
          otherPart(ownerOf(latin2RootBank, { carry: "port" })),
        ),
      ),
      point(
        "latin-2-words",
        t("Reading the Words", "读懂这些词"),
        t(
          "These roots work like the first set: *re* (back) + *ject* (throw) gives *to throw back*, and *in* (not) + *cred* (believe) + *ible* (able) gives *not able to be believed*. A word's meaning can drift, so use the root as a strong clue and check it against the sentence.",
          "这些词根的用法和第一组一样：*re*（回）+ *ject*（扔）表示“扔回”，*in*（不）+ *cred*（相信）+ *ible*（能够）表示“难以置信”。词义可能有所引申，所以把词根当作有力的线索，再结合句子验证。",
        ),
        choiceGenerator(
          t("What does this word mean?", "这个词是什么意思？"),
          latin2WordBank,
          (right, shown) =>
            t(
              `*${shown}* means **${right}**. Recognizing this in a new word helps you work out what the word means.`,
              `*${shown}* 的意思是 **${right}**。在生词中认出它，有助于推断词义。`,
            ),
          mismatchedPart("root"),
        ),
      ),
    ],
  },
  {
    id: "greek-roots-1",
    title: t("Greek Roots 1", "希腊词根 1"),
    summary: t("Tele, graph, phon, bio, geo, therm, micro, auto and scope.", "tele、graph、phon、bio、geo、therm、micro、auto 和 scope。"),
    prerequisites: ["common-prefixes", "common-suffixes"],
    encompasses: [
      { topic: "common-prefixes", weight: 0.1 },
      { topic: "common-suffixes", weight: 0.1 },
    ],
    xp: 12,
    knowledgePoints: [
      point(
        "greek-meanings",
        t("What the Roots Mean", "词根的含义"),
        t(
          "Many words of science come from Greek. *Tele* means far, *graph* write or draw, *phon* sound, *photo* light, *bio* life, *geo* earth, *therm* heat, *micro* small, *auto* self, and *scope* look at.",
          "许多科学词汇来自希腊语。*tele* 表示远，*graph* 表示写或画，*phon* 表示声音，*photo* 表示光，*bio* 表示生命，*geo* 表示地球，*therm* 表示热，*micro* 表示小，*auto* 表示自己，*scope* 表示观看。",
        ),
        choiceGenerator(
          t("What does this root mean?", "这个词根是什么意思？"),
          [...greekRootBank, ...greekRootMore],
          (right, shown) =>
            t(
              `*${shown}* means **${right}**. Recognizing this in a new word helps you work out what the word means.`,
              `*${shown}* 的意思是 **${right}**。在生词中认出它，有助于推断词义。`,
            ),
          otherPart(ownerOf(greekRootBank, { write: "graph" })),
        ),
      ),
      point(
        "greek-words",
        t("Reading the Words", "读懂这些词"),
        t(
          "Greek roots often join directly: *tele* + *scope* is a tool for looking at far things, and *bio* + *graph* is the written story of a life. The ending *-logy* means the study of something.",
          "希腊词根常常直接相连：*tele* + *scope* 是看远处事物的工具，*bio* + *graph* 是记述一生的文字。词尾 *-logy* 表示“研究”。",
        ),
        choiceGenerator(
          t("What does this word mean?", "这个词是什么意思？"),
          [...greekWordBank, ...greekWordMore],
          (right, shown) =>
            t(
              `*${shown}* means **${right}**. Recognizing this in a new word helps you work out what the word means.`,
              `*${shown}* 的意思是 **${right}**。在生词中认出它，有助于推断词义。`,
            ),
          mismatchedPart("root"),
        ),
      ),
    ],
  },
  {
    id: "context-clues",
    title: t("Context Clues", "上下文线索"),
    summary: t("The rest of a sentence often explains an unfamiliar word.", "句子的其余部分常常能解释生词。"),
    prerequisites: [],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      point(
        "definition-clues",
        t("Definition Clues", "定义线索"),
        t(
          "A writer may simply explain a hard word. Look for *which means*, *that is*, or a phrase set off by commas after the word: *The summit, the very top of the mountain, was covered in snow.*",
          "作者可能直接解释难词。留意 *which means*、*that is*，或者词后用逗号隔开的短语：*The summit, the very top of the mountain, was covered in snow.*",
        ),
        choiceGenerator(
          t("What does the word in italics mean?", "斜体词是什么意思？"),
          [...definitionClueBank, ...definitionClueMore],
          (right) => t(`It means **${right}**. The sentence explains the word directly.`, `意思是 **${right}**。句子直接解释了这个词。`),
          missedDefinition,
        ),
      ),
      point(
        "contrast-clues",
        t("Contrast Clues", "对比线索"),
        t(
          "Words such as *unlike, but, although, whereas* and *instead of* set up an opposite. If you know the other side, you can reason to the word: *Unlike his timid brother, Omar spoke to everyone* suggests that *timid* means shy.",
          "*unlike, but, although, whereas, instead of* 这样的词表示相反的情况。知道另一面，就能推断这个词：*Unlike his timid brother, Omar spoke to everyone* 暗示 *timid* 的意思是害羞。",
        ),
        choiceGenerator(
          t("What does the word in italics mean?", "斜体词是什么意思？"),
          [...contrastClueBank, ...contrastClueMore],
          (right) =>
            t(`It means **${right}**. The sentence sets it against its opposite.`, `意思是 **${right}**。句子把它和相反的情况作对比。`),
          missedContrast,
        ),
      ),
      point(
        "example-clues",
        t("Example Clues", "举例线索"),
        t(
          "Words such as *such as, like, including* and *for example* introduce examples. Ask what the examples have in common: rain, snow and hail are all water falling from the sky, so that is what *precipitation* means.",
          "*such as, like, including, for example* 这样的词引出例子。问一问这些例子有什么共同点：雨、雪和冰雹都是从天而降的水，这就是 *precipitation* 的意思。",
        ),
        choiceGenerator(
          t("What does the word in italics mean?", "斜体词是什么意思？"),
          [...exampleClueBank, ...exampleClueMore],
          (right) => t(`It means **${right}**. That is what the examples have in common.`, `意思是 **${right}**。这正是这些例子的共同点。`),
          missedExamples,
        ),
      ),
    ],
  },
  {
    id: "academic-words-1",
    title: t("Academic Words 1", "学术词汇 1"),
    summary: t(
      "Words that appear across school subjects: analyze, evidence, conclude and more.",
      "各学科通用的词：analyze、evidence、conclude 等。",
    ),
    prerequisites: ["context-clues"],
    encompasses: [{ topic: "context-clues", weight: 0.3 }],
    xp: 12,
    knowledgePoints: [
      point(
        "academic-meanings",
        t("What They Mean", "它们的含义"),
        t(
          "Some words appear in nearly every school subject and rarely in daily speech. To **analyze** is to study the parts of something, **evidence** is facts that show something is true, and to **conclude** is to decide from the facts. Others here are **significant, predict, compare, sequence, relevant, estimate** and **source**.",
          "有些词几乎出现在每个学科中，却很少用于日常口语。**analyze** 是研究事物的各个部分，**evidence** 是证明某事为真的事实，**conclude** 是根据事实作出判断。这里还有 **significant, predict, compare, sequence, relevant, estimate, source**。",
        ),
        choiceGenerator(
          t("What does the word in bold mean?", "加粗的词是什么意思？"),
          [...academicMeaningBank.map(([word, right, wrong]): ChoiceItem => [`**${word}**`, right, wrong]), ...academic1.meaning],
          (right, shown) => t(`${shown} The word in bold means **${right}**.`, `${shown} 加粗的词的意思是 **${right}**。`),
          (wrong, _right, shown) => notTheMeaning(wrong, _right, bold(shown)),
        ),
      ),
      point(
        "academic-use",
        t("Using Them", "使用它们"),
        t(
          "Knowing a definition is only half of a word. The other half is recognizing where it fits. Read the whole sentence and ask which word's meaning completes the thought.",
          "知道定义只是掌握一个词的一半。另一半是知道它用在哪里。读完整个句子，问一问哪个词的意思能使句子完整。",
        ),
        choiceGenerator(
          t("Which word completes the sentence?", "哪个词能补全句子？"),
          [...academicUseBank, ...academic1.use],
          (right, shown) =>
            t(`${shown.replace("___", `**${right}**`)}`, `${shown.replace("___", `**${right}**`)} 这个词的意思最符合句子。`),
          wrongWord,
        ),
      ),
    ],
  },
  {
    id: "connotation-and-precise-words",
    title: t("Connotation and Precise Words", "词的感情色彩和精确用词"),
    summary: t("Choose among similar words by their feeling and exact meaning.", "根据感情色彩和确切含义在近义词中选择。"),
    prerequisites: ["academic-words-1"],
    encompasses: [{ topic: "academic-words-1", weight: 0.2 }],
    xp: 10,
    knowledgePoints: [
      point(
        "connotation",
        t("Connotation", "感情色彩"),
        t(
          "Words with similar meanings can carry different feelings, called their **connotation**. *Thrifty* and *stingy* both describe someone who spends little, but *thrifty* is praise and *stingy* is criticism.",
          "意思相近的词可能带有不同的感情，这叫作**感情色彩**（connotation）。*thrifty* 和 *stingy* 都形容花钱少的人，但 *thrifty* 是褒义，*stingy* 是贬义。",
        ),
        choiceGenerator(
          t("Choose the word that answers the question.", "选择能回答问题的词。"),
          connotationBank,
          (right) =>
            t(
              `**${right}** carries the most favorable feeling, though the words mean nearly the same.`,
              `**${right}** 带有最正面的感情色彩，尽管这几个词的意思几乎相同。`,
            ),
          lessFavorable,
        ),
      ),
      point(
        "precise-words",
        t("Precise Words", "精确用词"),
        t(
          "A precise word shows the reader more than a general one. *Walked* says little, whereas *trudged* tells you that the walk was slow and tiring, and *skipped* tells you that it was light and cheerful.",
          "精确的词比笼统的词告诉读者更多。*walked* 说明不了什么，而 *trudged* 告诉你走得缓慢而疲惫，*skipped* 告诉你走得轻快而愉悦。",
        ),
        choiceGenerator(
          t("Which word fits the meaning in parentheses?", "哪个词符合括号中的意思？"),
          preciseBank,
          (right, shown) =>
            t(`${shown.replace("___", `**${right}**`)}`, `${shown.replace("___", `**${right}**`)} 这个词符合括号中的意思。`),
          otherShade,
        ),
      ),
    ],
  },
];
