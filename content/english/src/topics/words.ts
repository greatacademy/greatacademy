// Words: how words are built from their parts, and how to work out and choose them.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator } from "@ga/subject-english";

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
  ["thrifty or stingy: Which is the kinder way to describe someone who saves money?", "thrifty", ["stingy"]],
  ["curious or nosy: Which is the kinder way to describe someone who asks questions?", "curious", ["nosy"]],
  ["slim or scrawny: Which is the kinder way to describe a thin person?", "slim", ["scrawny"]],
  ["confident or arrogant: Which is the kinder way to describe someone sure of themselves?", "confident", ["arrogant"]],
  ["stubborn or determined: Which is the kinder way to describe someone who will not give up?", "determined", ["stubborn"]],
  ["cheap or affordable: Which makes a price sound better?", "affordable", ["cheap"]],
  ["cozy or cramped: Which makes a small room sound better?", "cozy", ["cramped"]],
  ["old or antique: Which makes a chair sound more valuable?", "antique", ["old"]],
  ["smell or fragrance: Which makes a scent sound better?", "fragrance", ["smell"]],
  ["crowd or mob: Which makes a large group sound less dangerous?", "crowd", ["mob"]],
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
        choiceGenerator(t("What is the base word?", "基础词是什么？"), baseBank, (right, shown) =>
          t(`**${right}** is the word inside *${shown}* that can stand alone.`, `**${right}** 是 *${shown}* 中能独立成词的部分。`),
        ),
      ),
      point(
        "naming-the-parts",
        t("Prefixes and Suffixes", "前缀和后缀"),
        t(
          "A **prefix** goes before a base word: *re* + *read*. A **suffix** goes after it: *color* + *ful*. Together they are called **affixes**, and neither can stand alone as a word in this use.",
          "**前缀**（prefix）加在基础词之前：*re* + *read*。**后缀**（suffix）加在基础词之后：*color* + *ful*。它们合称**词缀**（affix），在这种用法中都不能独立成词。",
        ),
        choiceGenerator(t("What is this part of the word?", "这是词的哪个部分？"), affixKindBank, (right) =>
          t(
            `It is a **${right.toLowerCase()}**. Look at where it sits and whether it can stand alone.`,
            `它是 **${right}**。看它的位置，以及能否独立成词。`,
          ),
        ),
      ),
      point(
        "building-words",
        t("Building a Word", "构词"),
        t(
          "To build a word, join the parts: *re* + *build* makes *rebuild*. Keep all the letters of a prefix even when this doubles a letter: *mis* + *spell* makes *misspell*.",
          "构词时把各部分连起来：*re* + *build* 构成 *rebuild*。前缀的字母要全部保留，即使出现双写：*mis* + *spell* 构成 *misspell*。",
        ),
        typedGenerator("word-form", t("Type the word these parts make.", "输入这些部分构成的词。"), buildBank, (right) =>
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
        choiceGenerator(t("What does this prefix mean?", "这个前缀是什么意思？"), prefixMeaningBank, (right, shown) =>
          t(
            `*${shown}* means **${right}**. Recognizing this in a new word helps you work out what the word means.`,
            `*${shown}* 的意思是 **${right}**。在生词中认出它，有助于推断词义。`,
          ),
        ),
      ),
      point(
        "words-with-prefixes",
        t("Reading Words with Prefixes", "读懂带前缀的词"),
        t(
          "Put the meaning of the prefix together with the base word: *misread* is *read* + *wrongly*. This often gives the meaning of a word you have never seen.",
          "把前缀的含义和基础词合起来：*misread* 就是 *read* + “错误地”。这样往往能弄懂从未见过的词。",
        ),
        choiceGenerator(t("What does this word mean?", "这个词是什么意思？"), prefixWordBank, (right, shown) =>
          t(
            `*${shown}* means **${right}**. Recognizing this in a new word helps you work out what the word means.`,
            `*${shown}* 的意思是 **${right}**。在生词中认出它，有助于推断词义。`,
          ),
        ),
      ),
      point(
        "writing-with-prefixes",
        t("Writing Words with Prefixes", "写出带前缀的词"),
        t(
          "Choose the prefix for the meaning you want, then attach it to the base word. Each base word usually goes with particular prefixes: we say *unfair* and *dishonest*, not *disfair* and *unhonest*.",
          "根据想表达的意思选择前缀，再加到基础词上。每个基础词通常只搭配特定前缀：我们说 *unfair* 和 *dishonest*，而不说 *disfair* 和 *unhonest*。",
        ),
        typedGenerator("word-form", t("Type one word that means this.", "输入一个表示这个意思的词。"), prefixTypedBank, (right) =>
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
        choiceGenerator(t("What does this suffix mean?", "这个后缀是什么意思？"), suffixMeaningBank, (right, shown) =>
          t(
            `*${shown}* means **${right}**. Recognizing this in a new word helps you work out what the word means.`,
            `*${shown}* 的意思是 **${right}**。在生词中认出它，有助于推断词义。`,
          ),
        ),
      ),
      point(
        "words-with-suffixes",
        t("Reading Words with Suffixes", "读懂带后缀的词"),
        t(
          "As with prefixes, combine the two parts: *fearless* is *fear* + *without*, so it means *without fear*. Notice how far apart *-ful* and *-less* put a word: *painful* and *painless* are opposites.",
          "和前缀一样，把两部分合起来：*fearless* 是 *fear* + “没有”，所以意思是“无所畏惧”。注意 *-ful* 和 *-less* 的意思相反：*painful* 和 *painless* 是反义词。",
        ),
        choiceGenerator(t("What does this word mean?", "这个词是什么意思？"), suffixWordBank, (right, shown) =>
          t(
            `*${shown}* means **${right}**. Recognizing this in a new word helps you work out what the word means.`,
            `*${shown}* 的意思是 **${right}**。在生词中认出它，有助于推断词义。`,
          ),
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
          suffixTypedBank,
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
        choiceGenerator(t("What class of word is this?", "这个词是什么词性？"), classBank, (right, shown) =>
          t(`*${shown}* is a **${right.toLowerCase()}**, as its ending shows.`, `*${shown}* 是 **${right}**，词尾说明了这一点。`),
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
          classTypedBank,
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
        choiceGenerator(t("What does this prefix mean?", "这个前缀是什么意思？"), positionMeaningBank, (right, shown) =>
          t(
            `*${shown}* means **${right}**. Recognizing this in a new word helps you work out what the word means.`,
            `*${shown}* 的意思是 **${right}**。在生词中认出它，有助于推断词义。`,
          ),
        ),
      ),
      point(
        "words-of-number-and-position",
        t("Reading the Words", "读懂这些词"),
        t(
          "The prefix gives you most of the meaning: a *bicycle* has two wheels, a *submarine* travels under the sea, and an *international* match is played between nations.",
          "前缀提供了大部分含义：*bicycle* 有两个轮子，*submarine* 在海面下航行，*international* 比赛在国家之间进行。",
        ),
        choiceGenerator(t("What does this word mean?", "这个词是什么意思？"), positionWordBank, (right, shown) =>
          t(
            `*${shown}* means **${right}**. Recognizing this in a new word helps you work out what the word means.`,
            `*${shown}* 的意思是 **${right}**。在生词中认出它，有助于推断词义。`,
          ),
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
        choiceGenerator(t("What does this root mean?", "这个词根是什么意思？"), latin1RootBank, (right, shown) =>
          t(
            `*${shown}* means **${right}**. Recognizing this in a new word helps you work out what the word means.`,
            `*${shown}* 的意思是 **${right}**。在生词中认出它，有助于推断词义。`,
          ),
        ),
      ),
      point(
        "latin-1-words",
        t("Reading the Words", "读懂这些词"),
        t(
          "Combine the root with its prefix or suffix: *trans* (across) + *port* (carry) gives *to carry across*, and *pre* (before) + *dict* (say) gives *to say before it happens*.",
          "把词根和前缀或后缀合起来：*trans*（穿过）+ *port*（携带）表示“运送过去”，*pre*（之前）+ *dict*（说）表示“预言”。",
        ),
        choiceGenerator(t("What does this word mean?", "这个词是什么意思？"), latin1WordBank, (right, shown) =>
          t(
            `*${shown}* means **${right}**. Recognizing this in a new word helps you work out what the word means.`,
            `*${shown}* 的意思是 **${right}**。在生词中认出它，有助于推断词义。`,
          ),
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
        choiceGenerator(t("What does this root mean?", "这个词根是什么意思？"), latin2RootBank, (right, shown) =>
          t(
            `*${shown}* means **${right}**. Recognizing this in a new word helps you work out what the word means.`,
            `*${shown}* 的意思是 **${right}**。在生词中认出它，有助于推断词义。`,
          ),
        ),
      ),
      point(
        "latin-2-words",
        t("Reading the Words", "读懂这些词"),
        t(
          "These roots work like the first set: *re* (back) + *ject* (throw) gives *to throw back*, and *in* (not) + *cred* (believe) + *ible* (able) gives *not able to be believed*. A word's meaning can drift, so use the root as a strong clue and check it against the sentence.",
          "这些词根的用法和第一组一样：*re*（回）+ *ject*（扔）表示“扔回”，*in*（不）+ *cred*（相信）+ *ible*（能够）表示“难以置信”。词义可能有所引申，所以把词根当作有力的线索，再结合句子验证。",
        ),
        choiceGenerator(t("What does this word mean?", "这个词是什么意思？"), latin2WordBank, (right, shown) =>
          t(
            `*${shown}* means **${right}**. Recognizing this in a new word helps you work out what the word means.`,
            `*${shown}* 的意思是 **${right}**。在生词中认出它，有助于推断词义。`,
          ),
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
        choiceGenerator(t("What does this root mean?", "这个词根是什么意思？"), greekRootBank, (right, shown) =>
          t(
            `*${shown}* means **${right}**. Recognizing this in a new word helps you work out what the word means.`,
            `*${shown}* 的意思是 **${right}**。在生词中认出它，有助于推断词义。`,
          ),
        ),
      ),
      point(
        "greek-words",
        t("Reading the Words", "读懂这些词"),
        t(
          "Greek roots often join directly: *tele* + *scope* is a tool for looking at far things, and *bio* + *graph* is the written story of a life. The ending *-logy* means the study of something.",
          "希腊词根常常直接相连：*tele* + *scope* 是看远处事物的工具，*bio* + *graph* 是记述一生的文字。词尾 *-logy* 表示“研究”。",
        ),
        choiceGenerator(t("What does this word mean?", "这个词是什么意思？"), greekWordBank, (right, shown) =>
          t(
            `*${shown}* means **${right}**. Recognizing this in a new word helps you work out what the word means.`,
            `*${shown}* 的意思是 **${right}**。在生词中认出它，有助于推断词义。`,
          ),
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
        choiceGenerator(t("What does the word in italics mean?", "斜体词是什么意思？"), definitionClueBank, (right) =>
          t(`It means **${right}**. The sentence explains the word directly.`, `意思是 **${right}**。句子直接解释了这个词。`),
        ),
      ),
      point(
        "contrast-clues",
        t("Contrast Clues", "对比线索"),
        t(
          "Words such as *unlike, but, although, whereas* and *instead of* set up an opposite. If you know the other side, you can reason to the word: *Unlike his timid brother, Omar spoke to everyone* suggests that *timid* means shy.",
          "*unlike, but, although, whereas, instead of* 这样的词表示相反的情况。知道另一面，就能推断这个词：*Unlike his timid brother, Omar spoke to everyone* 暗示 *timid* 的意思是害羞。",
        ),
        choiceGenerator(t("What does the word in italics mean?", "斜体词是什么意思？"), contrastClueBank, (right) =>
          t(`It means **${right}**. The sentence sets it against its opposite.`, `意思是 **${right}**。句子把它和相反的情况作对比。`),
        ),
      ),
      point(
        "example-clues",
        t("Example Clues", "举例线索"),
        t(
          "Words such as *such as, like, including* and *for example* introduce examples. Ask what the examples have in common: rain, snow and hail are all water falling from the sky, so that is what *precipitation* means.",
          "*such as, like, including, for example* 这样的词引出例子。问一问这些例子有什么共同点：雨、雪和冰雹都是从天而降的水，这就是 *precipitation* 的意思。",
        ),
        choiceGenerator(t("What does the word in italics mean?", "斜体词是什么意思？"), exampleClueBank, (right) =>
          t(`It means **${right}**. That is what the examples have in common.`, `意思是 **${right}**。这正是这些例子的共同点。`),
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
        choiceGenerator(t("What does this word mean?", "这个词是什么意思？"), academicMeaningBank, (right, shown) =>
          t(
            `*${shown}* means **${right}**. Recognizing this in a new word helps you work out what the word means.`,
            `*${shown}* 的意思是 **${right}**。在生词中认出它，有助于推断词义。`,
          ),
        ),
      ),
      point(
        "academic-use",
        t("Using Them", "使用它们"),
        t(
          "Knowing a definition is only half of a word. The other half is recognizing where it fits. Read the whole sentence and ask which word's meaning completes the thought.",
          "知道定义只是掌握一个词的一半。另一半是知道它用在哪里。读完整个句子，问一问哪个词的意思能使句子完整。",
        ),
        choiceGenerator(t("Which word completes the sentence?", "哪个词能补全句子？"), academicUseBank, (right, shown) =>
          t(`${shown.replace("___", `**${right}**`)}`, `${shown.replace("___", `**${right}**`)} 这个词的意思最符合句子。`),
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
        choiceGenerator(t("Choose the word that answers the question.", "选择能回答问题的词。"), connotationBank, (right) =>
          t(
            `**${right}** carries the more favorable feeling, though the two words mean nearly the same.`,
            `**${right}** 带有更正面的感情色彩，尽管两个词的意思几乎相同。`,
          ),
        ),
      ),
      point(
        "precise-words",
        t("Precise Words", "精确用词"),
        t(
          "A precise word shows the reader more than a general one. *Walked* says little, whereas *trudged* tells you that the walk was slow and tiring, and *skipped* tells you that it was light and cheerful.",
          "精确的词比笼统的词告诉读者更多。*walked* 说明不了什么，而 *trudged* 告诉你走得缓慢而疲惫，*skipped* 告诉你走得轻快而愉悦。",
        ),
        choiceGenerator(t("Which word fits the meaning in parentheses?", "哪个词符合括号中的意思？"), preciseBank, (right, shown) =>
          t(`${shown.replace("___", `**${right}**`)}`, `${shown.replace("___", `**${right}**`)} 这个词符合括号中的意思。`),
        ),
      ),
    ],
  },
];
