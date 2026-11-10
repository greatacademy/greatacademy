// Cambridge B2 First, Reading and Use of English Parts 1 to 4: a multiple-choice cloze, an open cloze, word formation
// and key word transformations. The test sets each part as a text with eight gaps, or six sentences; here every item
// is one gap in a sentence or two, so that each can be explained on its own. Every sentence is written for this course.

import { type Generator, joinText, type Problem, type Rng, same, type Text, type TopicDef, t } from "@ga/content";
import { expandPattern, point } from "@ga/subject-english";
import { examTopic, quote, type SolvedChoice, solvedChoiceGenerator } from "./kit.ts";

/** gap is how a gap is shown: a line the reader can see, escaped for Markdown. */
export const gap = "\\_\\_\\_\\_\\_";

/** shownGap shows the gap of a sentence, written as three underscores. */
export const shownGap = (s: string) => s.replace("___", gap);
/** filled shows a sentence with its gap filled in bold. */
export const filled = (s: string, word: string) => s.replace("___", `**${word}**`);

/** GapItem is one typed item: what to show, what the checker accepts, the answer to show, wrong responses and the solution. */
export interface GapItem {
  readonly shown: string;
  readonly accepted: readonly string[];
  readonly canonical: string;
  readonly wrong: readonly string[];
  readonly solution: Text;
}

/** gapGenerator picks an item by seed; the learner types what fills its gap. */
export function gapGenerator(checker: "word-form" | "sentence-pattern", question: Text, bank: readonly GapItem[]): Generator {
  return (rng: Rng): Problem => {
    const item = rng.cycle(bank);
    return {
      prompt: joinText([question, same(quote(item.shown))]),
      answer: { checker, expected: [...item.accepted], input: { kind: "text" } },
      solution: item.solution,
      canonical: item.canonical,
      wrong: [...item.wrong],
    };
  };
}

// Part 1: multiple-choice cloze.

/** Collocation is a gap whose word belongs to a phrase: the sentence, the right word, three wrong ones and the phrase. */
type Collocation = readonly [shown: string, right: string, wrong: readonly [string, string, string], phrase: string];

const collocations: readonly Collocation[] = [
  ["My brother ___ a lot of progress with his Spanish last year.", "made", ["did", "got", "took"], "make progress"],
  ["The two companies finally ___ an agreement after months of talks.", "reached", ["arrived", "got", "came"], "reach an agreement"],
  ["It took the committee a long time to ___ to a conclusion.", "come", ["reach", "arrive", "make"], "come to a conclusion"],
  ["Please ___ close attention to the safety instructions.", "pay", ["put", "take", "make"], "pay attention"],
  ["Doctors say that regular exercise ___ a big difference to how well you sleep.", "makes", ["does", "gives", "has"], "make a difference"],
  ["The new manager ___ a good impression on everyone at the meeting.", "made", ["did", "took", "got"], "make an impression on"],
  ["It's important to ___ your promises, or people won't trust you.", "keep", ["hold", "save", "stay"], "keep a promise"],
  ["Can you ___ a secret? Don't tell anyone about the party.", "keep", ["hold", "save", "put"], "keep a secret"],
  ["The storm ___ serious damage to the old bridge.", "caused", ["made", "gave", "brought"], "cause damage"],
  ["There was ___ traffic on the motorway, so we arrived late.", "heavy", ["strong", "big", "thick"], "heavy traffic"],
  ["I always drink a cup of ___ coffee in the morning to wake up.", "strong", ["heavy", "hard", "powerful"], "strong coffee"],
  ["The forecast says there will be ___ winds along the coast tonight.", "strong", ["thick", "hard", "deep"], "strong winds"],
  ["He ___ his best, but he still failed his driving test.", "did", ["made", "gave", "put"], "do your best"],
  ["Don't ___ fun of your little sister; it isn't kind.", "make", ["do", "have", "take"], "make fun of"],
  ["We ___ a great time at the festival.", "had", ["spent", "made", "did"], "have a great time"],
  ["Children should learn to ___ responsibility for their actions.", "take", ["make", "carry", "hold"], "take responsibility for"],
  ["The museum ___ an important role in the life of the town.", "plays", ["does", "makes", "acts"], "play a role"],
  ["The company has ___ a lot of money on advertising this year.", "spent", ["paid", "used", "given"], "spend money on"],
  ["My grandparents ___ a small shop for over thirty years.", "ran", ["led", "drove", "made"], "run a shop"],
  ["I'm afraid I've ___ my mind; I don't want to go after all.", "changed", ["moved", "turned", "switched"], "change your mind"],
  ["She ___ a speech at her sister's wedding.", "gave", ["said", "told", "spoke"], "give a speech"],
  ["Could you ___ me the truth about what happened?", "tell", ["say", "speak", "talk"], "tell the truth"],
  ["The film ___ place in a small village in the mountains.", "takes", ["has", "gets", "makes"], "take place"],
  ["Sales ___ a peak in December and then fell.", "reached", ["arrived", "got", "came"], "reach a peak"],
  ["The president will ___ a statement to the press this afternoon.", "make", ["do", "say", "tell"], "make a statement"],
  ["In the end, he found the ___ to ask for a pay rise.", "courage", ["bravery", "heart", "power"], "find the courage to"],
  ["Tourism is a major ___ of income for the island.", "source", ["origin", "spring", "root"], "a source of income"],
  ["The bad news came as a complete ___ to everyone.", "surprise", ["wonder", "amazement", "mystery"], "come as a surprise"],
  ["He has a good ___ of humour and makes everyone laugh.", "sense", ["feeling", "idea", "taste"], "a sense of humour"],
  ["I'm in ___ of my brother's cat while he's away.", "charge", ["duty", "head", "command"], "in charge of"],
  ["It isn't easy to ___ a balance between work and rest.", "strike", ["hit", "beat", "knock"], "strike a balance"],
  ["You can ___ a lot of time by booking your tickets online.", "save", ["keep", "spare", "win"], "save time"],
  ["I'd like to ___ a complaint about the noise from the flat upstairs.", "make", ["do", "tell", "say"], "make a complaint"],
  ["Our strange costumes ___ a lot of attention when we arrived.", "attracted", ["pulled", "called", "raised"], "attract attention"],
  ["My sister and I ___ a lot in common, although we are very different in age.", "have", ["hold", "keep", "own"], "have a lot in common"],
  ["The plan has a good ___ of success.", "chance", ["luck", "hope", "fortune"], "a chance of success"],
  ["Stop ___ so much noise; the baby is sleeping.", "making", ["doing", "giving", "playing"], "make a noise"],
  ["It's time to ___ an end to this argument.", "put", ["make", "give", "set"], "put an end to"],
];

/** Pattern is a gap in a phrasal verb, a linking phrase or a word with its preposition, with its meaning in English and Chinese. */
type Pattern = readonly [shown: string, right: string, wrong: readonly [string, string, string], phrase: string, en: string, zh: string];

const patterns: readonly Pattern[] = [
  ["The meeting was ___ off because the manager was ill.", "called", ["taken", "turned", "set"], "call off", "cancel", "取消"],
  ["I can't ___ up with the noise any longer.", "put", ["stand", "keep", "take"], "put up with", "accept something unpleasant", "忍受"],
  ["She ___ down the job offer because the pay was too low.", "turned", ["put", "set", "let"], "turn down", "refuse", "拒绝"],
  ["Can you ___ after my plants while I'm on holiday?", "look", ["take", "care", "watch"], "look after", "take care of", "照看"],
  ["We ran ___ of milk, so I went to the shop.", "out", ["off", "down", "away"], "run out of", "have none left", "用完"],
  ["It took him two weeks to get ___ his cold.", "over", ["off", "by", "out"], "get over", "recover from", "从（疾病等）中恢复"],
  ["Please fill ___ this form and give it to the receptionist.", "in", ["on", "at", "off"], "fill in", "complete a form", "填写"],
  [
    "I came ___ an old photo of my grandfather while I was tidying up.",
    "across",
    ["over", "along", "into"],
    "come across",
    "find by chance",
    "偶然发现",
  ],
  ["The plane took ___ an hour late.", "off", ["out", "up", "away"], "take off", "leave the ground", "起飞"],
  ["He gave ___ smoking last year.", "up", ["off", "out", "away"], "give up", "stop doing", "放弃、戒掉"],
  ["The fire alarm went ___ in the middle of the night.", "off", ["out", "up", "on"], "go off", "start ringing", "（警报）响起"],
  ["Let's ___ up a meeting with the new clients.", "set", ["put", "make", "take"], "set up", "arrange", "安排"],
  ["I'm looking ___ to seeing you next month.", "forward", ["ahead", "up", "after"], "look forward to", "wait for with pleasure", "盼望"],
  ["My grandmother brought ___ six children on her own.", "up", ["out", "over", "along"], "bring up", "raise a child", "抚养"],
  ["Sales have ___ off since a bigger shop opened nearby.", "fallen", ["gone", "turned", "run"], "fall off", "become fewer", "减少"],
  ["I'll pick you ___ from the station at six.", "up", ["on", "out", "in"], "pick up", "collect in a car", "（开车）接"],
  ["The police are going to ___ into the cause of the accident.", "look", ["see", "find", "search"], "look into", "investigate", "调查"],
  [
    "___ the rain, the match went ahead as planned.",
    "Despite",
    ["Although", "However", "Even"],
    "despite",
    "even with (before a noun)",
    "尽管（后接名词）",
  ],
  [
    "She studied hard; ___, she didn't pass the exam.",
    "however",
    ["although", "despite", "unless"],
    "however",
    "but (between two sentences)",
    "然而",
  ],
  [
    "You can borrow my bike as ___ as you bring it back by six.",
    "long",
    ["much", "far", "well"],
    "as long as",
    "on condition that",
    "只要",
  ],
  ["Take an umbrella in ___ it rains.", "case", ["order", "spite", "fact"], "in case", "because it might happen", "以防"],
  ["He went to bed early so ___ he would feel fresh for the interview.", "that", ["as", "for", "to"], "so that", "in order that", "以便"],
  [
    "___ of the fog, all the flights were cancelled.",
    "Because",
    ["Due", "Since", "Although"],
    "because of",
    "as a result of (before a noun)",
    "因为（后接名词）",
  ],
  ["The concert was cancelled ___ to the bad weather.", "due", ["because", "result", "cause"], "due to", "because of", "由于"],
  ["___ you hurry, you'll miss the train.", "Unless", ["If", "Otherwise", "Although"], "unless", "if not", "除非"],
  ["I like most sports, ___ from golf, which I find boring.", "apart", ["except", "besides", "instead"], "apart from", "except", "除了"],
  ["She is very good ___ solving difficult puzzles.", "at", ["in", "on", "with"], "good at", "able to do well", "擅长"],
  ["He apologised ___ being late.", "for", ["about", "of", "to"], "apologise for", "say sorry for", "为……道歉"],
  ["Are you interested ___ joining the drama club?", "in", ["on", "for", "about"], "interested in", "wanting to know or do", "对……感兴趣"],
  ["The town is famous ___ its old castle.", "for", ["of", "about", "with"], "famous for", "known for", "因……而出名"],
  ["Whether we go or not depends ___ the weather.", "on", ["of", "from", "at"], "depend on", "be decided by", "取决于"],
  ["I'm not used ___ getting up so early.", "to", ["for", "with", "at"], "be used to (+ -ing)", "be familiar with", "习惯于"],
  ["She succeeded ___ getting a place at the university.", "in", ["on", "at", "with"], "succeed in (+ -ing)", "manage to do", "成功做到"],
  ["He insisted ___ paying for the meal.", "on", ["to", "for", "at"], "insist on (+ -ing)", "say firmly that you will", "坚持"],
  ["We're all very proud ___ what you've achieved.", "of", ["for", "about", "with"], "proud of", "pleased about", "为……感到骄傲"],
  ["Thank you ___ inviting me to your party.", "for", ["to", "of", "about"], "thank someone for", "say thanks for", "为……感谢"],
  ["My little sister is afraid ___ spiders.", "of", ["from", "with", "for"], "afraid of", "frightened by", "害怕"],
  [
    "The hotel was expensive. ___, the food was excellent.",
    "Nevertheless",
    ["Despite", "Although", "Because"],
    "nevertheless",
    "even so",
    "尽管如此",
  ],
];

const solvedCollocation = ([shown, right, wrong, phrase]: Collocation): SolvedChoice => ({
  shown: shownGap(shown),
  right,
  wrong,
  solution: joinText([
    t(
      `We say *${phrase}*, so the answer is **${right}**. The other words do not go with it in this meaning.`,
      `英语说 *${phrase}*，所以答案是 **${right}**。其他几个词在这个意思上不能这样搭配。`,
    ),
    same(quote(filled(shown, right))),
  ]),
});

const solvedPattern = ([shown, right, wrong, phrase, en, zh]: Pattern): SolvedChoice => ({
  shown: shownGap(shown),
  right,
  wrong,
  solution: joinText([
    t(`*${phrase}* means "${en}", so the answer is **${right}**.`, `*${phrase}* 的意思是“${zh}”，所以答案是 **${right}**。`),
    same(quote(filled(shown, right))),
  ]),
});

const clozeQuestion = t("Choose the word that best fits the gap.", "选出最适合填入空格的词。");

/** multipleChoiceCloze is Part 1 of Reading and Use of English. */
export const multipleChoiceCloze: TopicDef = examTopic({
  id: "fce-multiple-choice-cloze",
  title: t("Multiple-Choice Cloze", "多项选择完形填空"),
  summary: t(
    "Choose the one word of four that fits a gap, as in Part 1 of B2 First Reading and Use of English: collocations, then phrasal verbs, linking words and words with their prepositions.",
    "按照 B2 First 阅读与英语运用第 1 部分的形式，从四个词中选出适合空格的一个：先是固定搭配，再是短语动词、连接词和词语与介词的搭配。",
  ),
  strand: "vocabulary",
  prerequisites: ["phrasal-verbs"],
  encompasses: [{ topic: "phrasal-verbs", weight: 0.2 }],
  xp: 8,
  points: [
    point(
      "collocations",
      t("Collocations and fixed phrases", "固定搭配"),
      t(
        "In Part 1 the four words usually have similar meanings, so meaning alone does not decide. Read the words on both sides of the gap: a noun often chooses its verb (*make progress*, *pay attention*, *take place*) and an adjective (*heavy traffic*, *strong coffee*). Learn such pairs whole, and when two options seem right, ask which one English speakers actually say with the next word.",
        "第 1 部分的四个选项意思往往相近，单靠意思无法判断。要看空格两边的词：名词常常决定与它搭配的动词（*make progress*、*pay attention*、*take place*）和形容词（*heavy traffic*、*strong coffee*）。这类搭配要整体记忆；两个选项似乎都对时，想一想英语中实际上和后面那个词连用的是哪一个。",
      ),
      solvedChoiceGenerator(clozeQuestion, collocations.map(solvedCollocation)),
    ),
    point(
      "phrasal-verbs-and-linkers",
      t("Phrasal verbs, linking words and prepositions", "短语动词、连接词和介词搭配"),
      t(
        "Some gaps test a word that only fits one pattern. In a phrasal verb, the particle after the gap (*off*, *up*, *with*) decides the verb: *call off*, *put up with*. A linking word must fit the grammar after it: *despite* and *because of* take a noun, *although* and *unless* a clause, and *however* joins two sentences. Many adjectives and verbs take one preposition (*good at*, *depend on*, *insist on*), and *to* in *be used to* and *look forward to* is followed by *-ing*.",
        "有些空格考的是只符合一种结构的词。在短语动词中，空格后的小品词（*off*、*up*、*with*）决定用哪个动词：*call off*、*put up with*。连接词必须符合后面的语法：*despite* 和 *because of* 后接名词，*although* 和 *unless* 后接从句，*however* 连接两个句子。许多形容词和动词只与一个介词搭配（*good at*、*depend on*、*insist on*），*be used to* 和 *look forward to* 中的 *to* 后接 -ing 形式。",
      ),
      solvedChoiceGenerator(clozeQuestion, patterns.map(solvedPattern)),
    ),
  ],
});

// Part 2: open cloze.

type ClozeKind = "article" | "preposition" | "auxiliary" | "pronoun" | "linker" | "relative" | "quantifier" | "fixed";

const clozeWhy: Record<ClozeKind, Text> = {
  article: t(
    "A singular countable noun needs an article: *the* when the reader knows which one, *a* or *an* when it is one of many, and *an* before a vowel sound.",
    "单数可数名词前要用冠词：读者知道是哪一个时用 *the*，泛指其中之一时用 *a* 或 *an*，元音音素前用 *an*。",
  ),
  preposition: t(
    "The gap comes before a noun or an *-ing* form, and the words around it take this preposition.",
    "空格在名词或 -ing 形式前，前后的词决定要用这个介词。",
  ),
  auxiliary: t(
    "The verb needs a helping verb, *be*, *have* or *do*, in the tense and form the sentence asks for.",
    "动词需要一个助动词（*be*、*have* 或 *do*），时态和形式由句子决定。",
  ),
  pronoun: t(
    "The gap stands for a noun already mentioned, or the sentence needs a word such as *it*, *there*, *one* or *themselves*.",
    "空格代替前面提到的名词，或者句子需要 *it*、*there*、*one*、*themselves* 这样的词。",
  ),
  linker: t("The gap joins two ideas, and the relation between them decides the word.", "空格连接两个意思，两者之间的关系决定用哪个词。"),
  relative: t(
    "The gap begins a relative clause about the noun before it, or *what* means *the thing that*.",
    "空格引导修饰前面名词的定语从句，或者用 *what* 表示“……的东西”。",
  ),
  quantifier: t("The gap says how much or how many, and the noun after it decides the word.", "空格表示多少，后面的名词决定用哪个词。"),
  fixed: t("The gap is part of a fixed phrase that is learned whole.", "空格是一个需要整体记忆的固定短语的一部分。"),
};

/** OpenGap is an open-cloze item: the sentence, the accepted words with the usual one first, wrong ones and the kind of word. */
type OpenGap = readonly [shown: string, accepted: readonly string[], wrong: readonly string[], kind: ClozeKind];

const grammarWords: readonly OpenGap[] = [
  ["She plays ___ violin in the school orchestra.", ["the"], ["a"], "article"],
  ["My cousin works as ___ engineer in Hong Kong.", ["an"], ["a"], "article"],
  ["___ sun was shining when we left the house.", ["the"], ["a"], "article"],
  ["It was ___ honour to meet such a famous writer.", ["an"], ["a"], "article"],
  ["Twice ___ week, he goes swimming before work.", ["a", "per"], ["the", "in"], "article"],
  ["This is ___ best pizza I've ever eaten.", ["the"], ["a", "most"], "article"],
  ["What ___ beautiful view!", ["a"], ["the", "an"], "article"],
  ["The train arrives ___ half past seven.", ["at"], ["in", "on"], "preposition"],
  ["We met ___ Saturday morning outside the cinema.", ["on"], ["in", "at"], "preposition"],
  ["He has lived in this town ___ 2015.", ["since"], ["for", "from"], "preposition"],
  ["She has been waiting ___ over an hour.", ["for"], ["since", "during"], "preposition"],
  ["I'll finish the report ___ Friday at the latest.", ["by"], ["until", "in"], "preposition"],
  ["The book was written ___ a famous scientist.", ["by"], ["from", "of"], "preposition"],
  ["Is there anything good ___ TV tonight?", ["on"], ["in", "at"], "preposition"],
  ["I prefer tea ___ coffee.", ["to"], ["than", "from"], "preposition"],
  ["We stayed indoors ___ the storm.", ["during"], ["while", "since"], "preposition"],
  ["She is married ___ a doctor.", ["to"], ["with", "by"], "preposition"],
  ["I'm sorry, the manager is busy ___ the moment.", ["at"], ["in", "for"], "preposition"],
  ["By the time we arrived, the film ___ already started.", ["had"], ["has", "was"], "auxiliary"],
  ["Not only ___ he win the race, but he also broke the record.", ["did"], ["has", "was"], "auxiliary"],
  ["The new bridge ___ being built at the moment.", ["is"], ["was", "has"], "auxiliary"],
  ["This is the first time I ___ ever been to a concert.", ["have"], ["had", "was"], "auxiliary"],
  ["You ___ better hurry, or you'll miss the bus.", ["had"], ["have", "would"], "auxiliary"],
  ["If I ___ known about the party, I would have come.", ["had"], ["have", "would"], "auxiliary"],
  ["___ you ever been to Paris?", ["have"], ["did", "are"], "auxiliary"],
  ["The letter ___ posted yesterday, so it should arrive soon.", ["was"], ["has", "had"], "auxiliary"],
  ["___ is a café on the corner where we can have lunch.", ["there"], ["it"], "pronoun"],
  ["The children made the cake all by ___.", ["themselves"], ["them", "they"], "pronoun"],
  ["___ is important to drink plenty of water when it's hot.", ["it"], ["this", "there"], "pronoun"],
  ["My phone is broken, so can I borrow ___?", ["yours"], ["your", "you"], "pronoun"],
  ["They have known each ___ since they were children.", ["other"], ["another", "others"], "pronoun"],
  ["Everybody brought ___ own lunch.", ["their"], ["they", "them"], "pronoun"],
  ["I lost my umbrella, so I need to buy a new ___.", ["one"], ["it", "that"], "pronoun"],
  ["Help ___ to a drink; there's plenty in the fridge.", ["yourself", "yourselves"], ["you", "your"], "pronoun"],
];

const linkingWords: readonly OpenGap[] = [
  ["I'll lend you the money as long ___ you pay it back next week.", ["as"], ["so", "that"], "linker"],
  ["___ it was raining, we went for a walk.", ["although", "though"], ["despite", "however", "but"], "linker"],
  ["He didn't study. As a ___, he failed the test.", ["result", "consequence"], ["reason", "cause"], "fixed"],
  ["I'll call you as ___ as I get home.", ["soon"], ["long", "quick"], "linker"],
  ["Take a map in ___ you get lost.", ["case"], ["order", "fact"], "linker"],
  ["I don't like horror films, and ___ does my brother.", ["neither", "nor"], ["so", "either"], "linker"],
  ["___ of the two hotels had a room free, so we slept in the car.", ["neither"], ["none", "either", "both"], "quantifier"],
  ["She speaks ___ French and Spanish.", ["both"], ["either", "neither"], "quantifier"],
  ["He is ___ a good cook that his friends always ask him to make dinner.", ["such"], ["so", "very"], "fixed"],
  ["The film was ___ boring that I fell asleep.", ["so"], ["such", "too"], "fixed"],
  ["Whether you agree ___ not, we have to leave now.", ["or"], ["nor", "and"], "fixed"],
  ["___ than take the bus, we decided to walk.", ["rather"], ["instead", "other"], "fixed"],
  ["The woman ___ lives next door is a pilot.", ["who", "that"], ["which", "she", "whose"], "relative"],
  ["That's the house ___ I was born.", ["where"], ["which", "that"], "relative"],
  ["The boy ___ bike was stolen went to the police.", ["whose"], ["who", "which", "who's"], "relative"],
  ["I'll never forget the day ___ we first met.", ["when", "that"], ["where", "which"], "relative"],
  ["She passed all her exams, ___ surprised everyone.", ["which"], ["that", "what", "it"], "relative"],
  ["The book, ___ I bought last week, is already falling apart.", ["which"], ["that", "what", "who"], "relative"],
  ["___ I need now is a long holiday.", ["what"], ["that", "which"], "relative"],
  ["The people ___ we met on holiday sent us a card.", ["who", "whom", "that"], ["which", "whose"], "relative"],
  ["There isn't ___ milk left; can you buy some?", ["much", "any"], ["many", "some"], "quantifier"],
  ["Very ___ people came to the meeting, so it finished early.", ["few"], ["little", "less"], "quantifier"],
  ["We've still got a ___ time before the train leaves, so let's have a coffee.", ["little"], ["few", "lot"], "quantifier"],
  ["___ of my friends has a car, so we always take the bus.", ["none", "neither"], ["no", "nobody", "any"], "quantifier"],
  ["___ student in the class has to give a short talk.", ["every", "each"], ["all", "both"], "quantifier"],
  ["I've been to Paris three times, but I'd like to go there ___ more time.", ["one"], ["another", "a"], "quantifier"],
  ["Most ___ the students passed the test.", ["of"], ["from", "in"], "quantifier"],
  ["There were ___ many people at the concert that we couldn't see the stage.", ["so"], ["such", "too"], "fixed"],
  ["I'm looking forward ___ hearing from you.", ["to"], ["for", "at"], "fixed"],
  ["___ the end, they decided to stay at home.", ["in"], ["at", "on", "by"], "fixed"],
  ["She does yoga every day in ___ to stay healthy.", ["order"], ["case", "fact"], "fixed"],
  ["As far ___ I know, the shop opens at nine.", ["as"], ["so", "that"], "fixed"],
  ["The festival went ahead in ___ of the rain.", ["spite"], ["case", "despite"], "fixed"],
  ["It's no ___ worrying about it now.", ["use", "good"], ["point", "help"], "fixed"],
  ["___ to the map, the hotel is near the station.", ["according"], ["due", "because"], "fixed"],
  ["He got the job ___ the fact that he had no experience.", ["despite"], ["although", "because"], "linker"],
];

const openGap = ([shown, accepted, wrong, kind]: OpenGap): GapItem => {
  const word = accepted[0] as string;
  const shownWord = shown.startsWith("___") ? `${word.charAt(0).toUpperCase()}${word.slice(1)}` : word;
  const others = accepted.slice(1);
  return {
    shown: shownGap(shown),
    accepted,
    canonical: word,
    wrong,
    solution: joinText([
      t(`The word is **${shownWord}**.`, `这个词是 **${shownWord}**。`),
      clozeWhy[kind],
      ...(others.length > 0 ? [t(`*${others.join("*, *")}* is also right.`, `*${others.join("*、*")}* 也正确。`)] : []),
      same(quote(filled(shown, shownWord))),
    ]),
  };
};

const openQuestion = t("Type the one word that fits the gap.", "在空格中填入一个合适的词。");

/** openCloze is Part 2 of Reading and Use of English. */
export const openCloze: TopicDef = examTopic({
  id: "fce-open-cloze",
  title: t("Open Cloze", "开放式完形填空"),
  summary: t(
    "Type the one word that a gap needs, with no options, as in Part 2 of B2 First Reading and Use of English: first grammar words, then linking words, relative words, quantifiers and parts of fixed phrases.",
    "按照 B2 First 阅读与英语运用第 2 部分的形式，在没有选项的空格中填入一个词：先是语法功能词，再是连接词、关系词、数量词和固定短语的一部分。",
  ),
  strand: "grammar",
  prerequisites: ["relative-clauses", "articles-in-general-and-specific"],
  encompasses: [
    { topic: "relative-clauses", weight: 0.2 },
    { topic: "articles-in-general-and-specific", weight: 0.2 },
  ],
  xp: 8,
  points: [
    point(
      "grammar-words",
      t("Articles, prepositions, auxiliaries and pronouns", "冠词、介词、助动词和代词"),
      t(
        "The words of Part 2 are short and grammatical: they carry little meaning of their own, so the sentence around the gap decides them. Ask what is missing. Before a noun, is it an article or a preposition? Next to a verb, is a helping verb needed for the tense or the passive (*had started*, *is being built*)? Does the gap stand for a noun, or is it *there* or *it* at the start of a sentence? Write one word only, and spell it exactly.",
        "第 2 部分要填的词很短，是语法功能词：它们本身意思不多，由空格周围的句子决定。先问缺的是什么。在名词前，是冠词还是介词？在动词旁，是否需要助动词构成时态或被动语态（*had started*、*is being built*）？空格是代替一个名词，还是句首的 *there* 或 *it*？只写一个词，并且拼写准确。",
      ),
      gapGenerator("word-form", openQuestion, grammarWords.map(openGap)),
    ),
    point(
      "linkers-and-phrases",
      t("Linking words, relative words, quantifiers and fixed phrases", "连接词、关系词、数量词和固定短语"),
      t(
        "Other gaps link ideas or complete a phrase. Find the relation between the two parts (contrast, reason, result, condition) and the grammar that follows: *although* takes a clause, *despite* a noun. After a noun, a relative word may begin a clause: *who*, *which*, *whose*, *where*, *when*. Before a noun, a quantifier must match it: *few* with plurals, *little* and *much* with uncountable nouns. Many gaps are one word of a fixed phrase, such as *as soon as*, *in order to*, *so ... that* or *such a ... that*.",
        "另一些空格用来连接意思或补全短语。找出两部分之间的关系（转折、原因、结果、条件）以及后面的语法：*although* 后接从句，*despite* 后接名词。名词之后可能是关系词引导的从句：*who*、*which*、*whose*、*where*、*when*。名词之前的数量词必须与名词一致：*few* 与复数名词连用，*little* 和 *much* 与不可数名词连用。许多空格是固定短语中的一个词，例如 *as soon as*、*in order to*、*so ... that* 或 *such a ... that*。",
      ),
      gapGenerator("word-form", openQuestion, linkingWords.map(openGap)),
    ),
  ],
});

// Part 3: word formation.

type FormKind = "noun" | "adjective" | "verb" | "negative" | "adverb" | "plural";

const formWhy: Record<FormKind, Text> = {
  noun: t(
    "The gap follows an article, a possessive or an adjective, or is the subject of the verb, so it needs a noun.",
    "空格在冠词、所有格或形容词之后，或者作动词的主语，所以需要名词。",
  ),
  adjective: t(
    "The gap describes a noun, or follows *be*, *become* or *seem*, so it needs an adjective.",
    "空格修饰名词，或者在 *be*、*become*、*seem* 之后，所以需要形容词。",
  ),
  verb: t(
    "The gap needs a verb, often made with *en-*, *-en*, *-ify* or *re-*, in the form the sentence asks for.",
    "空格需要一个动词，常常带有 *en-*、*-en*、*-ify* 或 *re-*，形式由句子决定。",
  ),
  negative: t(
    "The sentence means the opposite of the stem, so the word needs a negative prefix such as *un-*, *in-*, *im-*, *il-*, *ir-*, *dis-* or *mis-*, as well as the right form.",
    "句子表达的是词根的反义，所以除了正确的词形，还要加上否定前缀，例如 *un-*、*in-*、*im-*、*il-*、*ir-*、*dis-* 或 *mis-*。",
  ),
  adverb: t(
    "The gap describes a verb, an adjective or the whole sentence, so it needs an adverb, usually in *-ly*.",
    "空格修饰动词、形容词或整个句子，所以需要副词，通常以 -ly 结尾。",
  ),
  plural: t(
    "More than one is meant, so the noun made from the stem also needs its plural ending.",
    "这里指不止一个，所以由词根变成的名词还要用复数形式。",
  ),
};

/** FormGap is a word-formation item: the sentence, the stem, the accepted words, wrong ones and the kind of change. */
type FormGap = readonly [shown: string, stem: string, accepted: readonly string[], wrong: readonly string[], kind: FormKind];

const stems: readonly FormGap[] = [
  ["The ___ of the new stadium took three years.", "CONSTRUCT", ["construction"], ["construct", "constructive"], "noun"],
  ["Her ___ to help others is what makes her a good nurse.", "WILLING", ["willingness"], ["willing", "will"], "noun"],
  ["There has been a big ___ in the number of tourists.", "GROW", ["growth"], ["grow", "grown"], "noun"],
  ["Thank you for your ___; I couldn't have done it without you.", "ASSIST", ["assistance"], ["assist", "assistant"], "noun"],
  ["The ___ between the two brothers is easy to see.", "SIMILAR", ["similarity"], ["similar", "similarly"], "noun"],
  ["He showed great ___ when he ran into the burning house.", "BRAVE", ["bravery"], ["brave", "bravely"], "noun"],
  ["My grandfather was a well-known ___ in the 1960s.", "POLITICS", ["politician"], ["political", "politics"], "noun"],
  ["The ___ of the bridge is fifty metres.", "LONG", ["length"], ["long", "longer"], "noun"],
  ["The ___ of the river at this point is two kilometres.", "WIDE", ["width"], ["wide", "widen"], "noun"],
  ["We were all surprised by his sudden ___ from the team.", "DEPART", ["departure"], ["depart", "departing"], "noun"],
  ["There is a strong ___ that the meeting will be cancelled.", "POSSIBLE", ["possibility"], ["possible", "possibly"], "noun"],
  ["The ___ of the competition will receive a prize.", "WIN", ["winner"], ["win", "winning"], "noun"],
  ["His ___ of the city was very helpful when we got lost.", "KNOW", ["knowledge"], ["know", "known"], "noun"],
  ["The museum has an ___ collection of old coins.", "IMPRESS", ["impressive"], ["impressed", "impression"], "adjective"],
  ["It was a ___ day, so we stayed by the pool.", "SUN", ["sunny"], ["sun", "sunshine"], "adjective"],
  ["The film was so ___ that I watched it twice.", "ENJOY", ["enjoyable"], ["enjoying", "enjoyed"], "adjective"],
  [
    "My little brother is very ___; he wants to know how everything works.",
    "CURIOSITY",
    ["curious"],
    ["curiosity", "curiously"],
    "adjective",
  ],
  ["The weather in the mountains can be very ___.", "CHANGE", ["changeable"], ["changed", "changing"], "adjective"],
  ["Be ___ when you cross the road.", "CARE", ["careful"], ["care", "carefully"], "adjective"],
  ["Learning a second language is ___ for your career.", "BENEFIT", ["beneficial"], ["benefit", "benefited"], "adjective"],
  ["The village is ___ for its cheese.", "FAME", ["famous"], ["fame", "famously"], "adjective"],
  ["She gave a very ___ talk about her travels.", "INFORM", ["informative"], ["informed", "information"], "adjective"],
  ["Our neighbours are always ___ and helpful.", "FRIEND", ["friendly"], ["friend", "friendship"], "adjective"],
  ["The children were ___ by the magician's tricks.", "AMAZE", ["amazed"], ["amazing", "amazement"], "adjective"],
  ["They plan to ___ the road so that two lorries can pass.", "WIDE", ["widen"], ["wide", "width"], "verb"],
  ["Could you ___ what you mean by that?", "CLEAR", ["clarify"], ["clear", "clarity"], "verb"],
  ["The school wants to ___ students to read more.", "COURAGE", ["encourage"], ["courage", "courageous"], "verb"],
  ["We need to ___ our team if we want to win.", "STRONG", ["strengthen"], ["strong", "strength"], "verb"],
  ["Scientists are trying to ___ the cause of the disease.", "IDENTITY", ["identify"], ["identity", "identical"], "verb"],
  ["The heat had ___ the chocolate in my bag.", "SOFT", ["softened"], ["soften", "soft"], "verb"],
  ["You should ___ your passport before it runs out.", "NEW", ["renew"], ["new", "news"], "verb"],
  ["The shop had to ___ its prices to attract more customers.", "LOW", ["lower"], ["low", "lowered"], "verb"],
  ["The new law will ___ shops to open on Sundays.", "ABLE", ["enable"], ["able", "ability"], "verb"],
];

const changes: readonly FormGap[] = [
  ["The instructions were completely ___, so nobody could put the table together.", "CLEAR", ["unclear"], ["clear", "clearly"], "negative"],
  ["It is ___ to drive without a licence.", "LEGAL", ["illegal"], ["legal", "unlegal"], "negative"],
  ["I'm afraid it's ___ to finish the work by Friday.", "POSSIBLE", ["impossible"], ["possible", "unpossible"], "negative"],
  ["He was very ___ and never arrived on time.", "RESPONSIBLE", ["irresponsible"], ["responsible", "unresponsible"], "negative"],
  ["Sorry, I think I ___ what you said.", "UNDERSTAND", ["misunderstood"], ["understood", "disunderstood"], "negative"],
  ["Many people ___ with the new plan and signed a letter against it.", "AGREE", ["disagreed"], ["agreed", "unagreed"], "negative"],
  ["The story sounded ___, but it was true.", "BELIEVE", ["unbelievable"], ["believable", "believing"], "negative"],
  ["Waiting for hours at the airport was very ___.", "COMFORT", ["uncomfortable"], ["comfortable", "discomfortable"], "negative"],
  [
    "The doctor said it was ___ for me to stay in hospital, so I went home.",
    "NECESSARY",
    ["unnecessary"],
    ["necessary", "innecessary"],
    "negative",
  ],
  ["It was ___ of him to leave without saying goodbye.", "POLITE", ["impolite"], ["polite", "unpolite"], "negative"],
  ["The weather this summer has been very ___.", "PREDICT", ["unpredictable"], ["predictable", "predicted"], "negative"],
  ["My keys have ___; I can't find them anywhere.", "APPEAR", ["disappeared"], ["appeared", "unappeared"], "negative"],
  [
    "Most customers were ___ with the service and asked for their money back.",
    "SATISFY",
    ["dissatisfied", "unsatisfied"],
    ["satisfied", "satisfying"],
    "negative",
  ],
  ["The manager was ___ to hear that the work was late again.", "PLEASE", ["displeased"], ["pleased", "unpleased", "pleasing"], "negative"],
  ["She sings ___, and everyone stops to listen.", "BEAUTY", ["beautifully"], ["beautiful", "beauty"], "adverb"],
  ["The job is ___ paid, so few people want to do it.", "BAD", ["badly"], ["bad", "worse"], "adverb"],
  ["___, nobody was hurt in the accident.", "LUCK", ["luckily"], ["lucky", "luck"], "adverb"],
  ["He drives very ___, so I feel safe with him.", "CARE", ["carefully"], ["careful", "care"], "adverb"],
  ["The price of houses has risen ___ this year.", "DRAMA", ["dramatically"], ["dramatic", "drama"], "adverb"],
  ["The children waited ___ for the show to begin.", "PATIENT", ["patiently"], ["patient", "patience"], "adverb"],
  ["I'm ___ sorry for what I said.", "TRUE", ["truly"], ["truely", "true"], "adverb"],
  ["She answered every question ___ and got full marks.", "CORRECT", ["correctly"], ["correct", "incorrectly"], "adverb"],
  ["The shop is ___ closed on Mondays.", "USUAL", ["usually"], ["usual", "unusually"], "adverb"],
  ["___, I don't think it's a good idea.", "HONEST", ["honestly"], ["honest", "honesty"], "adverb"],
  ["The bus was ___ late, so I missed my first class.", "TERRIBLE", ["terribly"], ["terrible", "terror"], "adverb"],
  ["He had ___ forgotten his own birthday.", "COMPLETE", ["completely"], ["complete", "completion"], "adverb"],
  [
    "Many ___ believe that the climate is changing faster than expected.",
    "SCIENCE",
    ["scientists"],
    ["scientist", "science", "scientific"],
    "plural",
  ],
  ["There are three ___ from our school in the final.", "COMPETE", ["competitors"], ["competitor", "competition"], "plural"],
  ["All ___ must show their tickets at the door.", "VISIT", ["visitors"], ["visitor", "visit"], "plural"],
  ["We need to find ___ to these problems quickly.", "SOLVE", ["solutions"], ["solution", "solve"], "plural"],
  ["There are many ___ between British and American English.", "DIFFER", ["differences"], ["difference", "different"], "plural"],
  ["Both ___ in the final played brilliantly.", "PLAY", ["players"], ["player", "playing"], "plural"],
  ["We asked a group of ___ for directions to the station.", "LOCAL", ["locals"], ["local", "location"], "plural"],
  ["The ___ of the town voted against the new road.", "RESIDE", ["residents"], ["resident", "residence"], "plural"],
];

const formGap = ([shown, stem, accepted, wrong, kind]: FormGap): GapItem => {
  const word = accepted[0] as string;
  const shownWord = shown.startsWith("___") ? `${word.charAt(0).toUpperCase()}${word.slice(1)}` : word;
  const others = accepted.slice(1);
  return {
    shown: `${shownGap(shown)} **(${stem})**`,
    accepted,
    canonical: word,
    wrong,
    solution: joinText([
      t(`From *${stem.toLowerCase()}*: **${shownWord}**.`, `由 *${stem.toLowerCase()}* 变成：**${shownWord}**。`),
      formWhy[kind],
      ...(others.length > 0 ? [t(`*${others.join("*, *")}* is also right.`, `*${others.join("*、*")}* 也正确。`)] : []),
      same(quote(filled(shown, shownWord))),
    ]),
  };
};

const formQuestion = t(
  "Use the word in capitals to form a word that fits the gap. Type that word.",
  "用括号中大写的词构成一个适合空格的词，并输入这个词。",
);

/** wordFormation is Part 3 of Reading and Use of English. */
export const wordFormation: TopicDef = examTopic({
  id: "fce-word-formation",
  title: t("Word Formation", "构词"),
  summary: t(
    "Change a given word so that it fits a gap, as in Part 3 of B2 First Reading and Use of English: first nouns, adjectives and verbs made from a stem, then negative prefixes, adverbs and plurals.",
    "按照 B2 First 阅读与英语运用第 3 部分的形式，改变所给词的形式使之适合空格：先是由词根构成的名词、形容词和动词，再是否定前缀、副词和复数。",
  ),
  strand: "vocabulary",
  prerequisites: ["b2-words-linking-1", "suffixes-that-change-word-class", "common-prefixes"],
  encompasses: [
    { topic: "suffixes-that-change-word-class", weight: 0.3 },
    { topic: "common-prefixes", weight: 0.2 },
  ],
  xp: 8,
  points: [
    point(
      "word-classes",
      t("Nouns, adjectives and verbs from a stem", "由词根构成名词、形容词和动词"),
      t(
        "First decide what kind of word the gap needs: after *the*, *a*, *his* or an adjective, a noun; before a noun or after *be*, an adjective; after *to* or a modal, a verb. Then choose the ending: nouns in *-tion*, *-ness*, *-ity*, *-ment*, *-th*, *-ance*, *-er* for a person; adjectives in *-ive*, *-ful*, *-able*, *-ous*, *-y*, *-ly*; verbs in *-en* and *-ify*, or with *en-* and *re-*. Some words change inside: *long*, *length*; *wide*, *width*; *know*, *knowledge*. Finally check the spelling and the form, such as a past participle.",
        "先判断空格需要什么词：在 *the*、*a*、*his* 或形容词之后用名词；在名词之前或 *be* 之后用形容词；在 *to* 或情态动词之后用动词。再选择词尾：名词常用 *-tion*、*-ness*、*-ity*、*-ment*、*-th*、*-ance*，表示人用 *-er*；形容词常用 *-ive*、*-ful*、*-able*、*-ous*、*-y*、*-ly*；动词常用 *-en*、*-ify*，或者加 *en-*、*re-*。有些词内部也会变化：*long*、*length*；*wide*、*width*；*know*、*knowledge*。最后检查拼写和形式，例如是否要用过去分词。",
      ),
      gapGenerator("word-form", formQuestion, stems.map(formGap)),
    ),
    point(
      "prefixes-adverbs-plurals",
      t("Negative prefixes, adverbs and plurals", "否定前缀、副词和复数"),
      t(
        "Many gaps need two changes. Read for meaning: if the sentence means the opposite, add a negative prefix: *un-* is the most common, *im-* comes before *p* and *m*, *il-* before *l*, *ir-* before *r*, *in-* before many others, and *dis-* and *mis-* go with verbs (*disagree*, *misunderstand*). If the gap describes a verb, an adjective or the whole sentence, form an adverb (*luckily*, *dramatically*, *truly*). If a noun is countable and more than one is meant, add the plural (*scientists*, *solutions*). Most wrong answers in Part 3 have the right word but miss one of these changes.",
        "很多空格需要两处变化。先看意思：如果句子表示相反的意思，就加否定前缀：最常见的是 *un-*，*p* 和 *m* 前用 *im-*，*l* 前用 *il-*，*r* 前用 *ir-*，许多其他词前用 *in-*，*dis-* 和 *mis-* 常用于动词（*disagree*、*misunderstand*）。如果空格修饰动词、形容词或整个句子，就构成副词（*luckily*、*dramatically*、*truly*）。如果是可数名词并且指不止一个，就加复数词尾（*scientists*、*solutions*）。第 3 部分的大多数错误答案都选对了词，却少了其中一处变化。",
      ),
      gapGenerator("word-form", formQuestion, changes.map(formGap)),
    ),
  ],
});

// Part 4: key word transformations.

type TransformKind = "passive" | "comparison" | "pattern" | "conditional" | "reported" | "modal" | "phrasal";

const transformWhy: Record<TransformKind, Text> = {
  passive: t(
    "The second sentence begins with what received the action, so the verb is passive in the same tense: a form of *be* and a past participle.",
    "第二句以动作的承受者开头，所以动词用同一时态的被动语态：*be* 的某种形式加过去分词。",
  ),
  comparison: t(
    "The key word turns the comparison around: *not as ... as*, *than*, *the best* or *enough* say the same thing another way.",
    "关键词把比较换了一个方向：*not as ... as*、*than*、*the best* 或 *enough* 用另一种方式表达同一个意思。",
  ),
  pattern: t(
    "The key word brings its own pattern, such as *-ing* or *to* after a verb, or an object before *to*.",
    "关键词有自己的固定结构，例如动词后接 -ing 或 *to*，或者 *to* 之前要有宾语。",
  ),
  conditional: t(
    "The first sentence says what really happened or is true, so the second imagines the opposite with *if*, *unless* or *wish*, one tense further back.",
    "第一句说的是真实发生的事或事实，所以第二句用 *if*、*unless* 或 *wish* 设想相反的情况，时态往前推一步。",
  ),
  reported: t(
    "Reported speech moves the tense back and turns the speaker's words into a verb such as *tell*, *suggest* or *deny* with its own pattern.",
    "间接引语要把时态往前推，并把说话人的话变成 *tell*、*suggest*、*deny* 等动词及其固定结构。",
  ),
  modal: t(
    "A modal with *have* and a past participle says how sure we are about the past, or what was a good idea: *must have*, *can't have*, *should have*, *needn't have*.",
    "情态动词加 *have* 和过去分词表示对过去的推测有多肯定，或者过去本该怎样：*must have*、*can't have*、*should have*、*needn't have*。",
  ),
  phrasal: t(
    "The key word is part of a phrasal verb or a fixed phrase that means the same as the words it replaces.",
    "关键词是一个短语动词或固定短语的一部分，与它替换的词意思相同。",
  ),
};

/**
 * Transformation is a key word item: the first sentence, the key word, the second sentence with its gap, the patterns of
 * the accepted answers with the usual one first, wrong answers and the kind of change. Contractions count as two words.
 */
type Transformation = readonly [
  first: string,
  key: string,
  second: string,
  patterns: readonly string[],
  wrong: readonly string[],
  kind: TransformKind,
];

const passivesAndPatterns: readonly Transformation[] = [
  [
    "They will open the new library next month.",
    "OPENED",
    "The new library ___ next month.",
    ["will be opened"],
    ["will opened", "is opened"],
    "passive",
  ],
  ["Someone stole my bike last night.", "WAS", "My bike ___ last night.", ["was stolen"], ["was stole", "stolen"], "passive"],
  [
    "People say that the castle is haunted.",
    "SAID",
    "The castle ___ haunted.",
    ["is said to be"],
    ["is said that", "said to be"],
    "passive",
  ],
  [
    "They have cancelled the concert.",
    "BEEN",
    "The concert ___.",
    ["has been [cancelled|canceled]"],
    ["was been cancelled", "has cancelled"],
    "passive",
  ],
  [
    "Nobody told me about the change of plan.",
    "WAS",
    "I ___ about the change of plan.",
    ["[was not|wasn't] told"],
    ["was told", "didn't tell"],
    "passive",
  ],
  [
    "They are repairing the road at the moment.",
    "BEING",
    "The road ___ at the moment.",
    ["is being repaired"],
    ["is repairing", "being repaired"],
    "passive",
  ],
  [
    "A famous architect designed this building.",
    "BY",
    "This building ___ a famous architect.",
    ["was designed by"],
    ["designed by", "is designed by"],
    "passive",
  ],
  [
    "They should have told us earlier.",
    "BEEN",
    "We ___ earlier.",
    ["should have been told"],
    ["should been told", "should have told"],
    "passive",
  ],
  [
    "A hairdresser cut my hair yesterday.",
    "HAD",
    "I ___ yesterday.",
    ["had my hair cut"],
    ["had cut my hair", "had my hair cutted"],
    "passive",
  ],
  [
    "Someone is going to repaint our kitchen next week.",
    "HAVE",
    "We are going ___ next week.",
    ["to have [our|the] kitchen repainted"],
    ["to repaint our kitchen", "to have repainted our kitchen"],
    "passive",
  ],
  [
    "Tom is taller than his brother.",
    "AS",
    "Tom's brother ___ Tom.",
    ["[is not|isn't] as tall as"],
    ["is as tall as", "is not taller than"],
    "comparison",
  ],
  [
    "I've never seen such a good film.",
    "BEST",
    "It's ___ I've ever seen.",
    ["the best film"],
    ["the better film", "a best film"],
    "comparison",
  ],
  [
    "The bus is slower than the train.",
    "QUICKLY",
    "The bus doesn't travel ___ the train.",
    ["[as|so] quickly as"],
    ["as quick as", "quicker than"],
    "comparison",
  ],
  [
    "This box is too heavy for me to lift.",
    "ENOUGH",
    "I'm ___ lift this box.",
    ["not strong enough to"],
    ["enough strong to", "strong enough to"],
    "comparison",
  ],
  [
    "The test was easier than I expected.",
    "AS",
    "The test was ___ I expected.",
    ["not [as|so] [difficult|hard] as"],
    ["as easy as", "not as easy as"],
    "comparison",
  ],
  [
    "She is the fastest runner in the team.",
    "FASTER",
    "Nobody in the team ___ she does.",
    ["runs faster than"],
    ["is faster than", "run faster than"],
    "comparison",
  ],
  [
    "I prefer walking to taking the bus.",
    "RATHER",
    "I ___ take the bus.",
    ["[would|'d] rather walk than"],
    ["would rather to walk than", "rather walk than"],
    "comparison",
  ],
  [
    "There were fewer people at the party than we expected.",
    "MANY",
    "There ___ people at the party as we expected.",
    ["[were not|weren't] [as|so] many"],
    ["were as many", "were not as much"],
    "comparison",
  ],
  [
    "If you practise more, you'll get better.",
    "BETTER",
    "The more you practise, ___ get.",
    ["the better [you will|you'll]"],
    ["better you will", "the best you will"],
    "comparison",
  ],
  [
    "My sister is two years older than me.",
    "YOUNGER",
    "I am ___ my sister.",
    ["two years younger than"],
    ["younger two years than", "two years younger as"],
    "comparison",
  ],
  [
    "It isn't worth repairing this old phone.",
    "POINT",
    "There's ___ this old phone.",
    ["no point( in) repairing"],
    ["no point to repair", "not point repairing"],
    "pattern",
  ],
  [
    "I don't mind if you open the window.",
    "OBJECT",
    "I don't ___ the window.",
    ["object to [you|your] opening"],
    ["object you to open", "object to open"],
    "pattern",
  ],
  [
    "He managed to finish the race, although his leg hurt.",
    "SUCCEEDED",
    "He ___ the race, although his leg hurt.",
    ["succeeded in finishing"],
    ["succeeded to finish", "succeeded finishing"],
    "pattern",
  ],
  [
    "My parents didn't let me go to the party.",
    "ALLOWED",
    "I ___ go to the party.",
    ["[was not|wasn't] allowed to"],
    ["was not allowed", "didn't allowed to"],
    "pattern",
  ],
  [
    "Please don't smoke in the building.",
    "MIND",
    "Would you ___ in the building?",
    ["mind not smoking"],
    ["mind to not smoke", "mind not to smoke"],
    "pattern",
  ],
  ["I'm sure I locked the door.", "REMEMBER", "I ___ the door.", ["remember locking"], ["remember to lock", "remember lock"], "pattern"],
  [
    "It was difficult for us to find the hotel.",
    "DIFFICULTY",
    "We ___ the hotel.",
    ["had difficulty( in) finding"],
    ["had difficulty to find", "were difficulty finding"],
    "pattern",
  ],
  [
    "Do you want me to carry your bag?",
    "LIKE",
    "Would you ___ your bag?",
    ["like me to carry"],
    ["like that I carry", "like I carry"],
    "pattern",
  ],
  [
    "She started learning the piano five years ago.",
    "BEEN",
    "She ___ the piano for five years.",
    ["[has|'s] been learning"],
    ["has learning", "is learning"],
    "pattern",
  ],
  [
    "It took me two hours to write the essay.",
    "SPENT",
    "I ___ the essay.",
    ["spent two hours [writing|on]"],
    ["spent two hours to write", "spent two hours for writing"],
    "pattern",
  ],
  [
    "Remember to call the bank, please.",
    "FORGET",
    "Please don't ___ the bank.",
    ["forget to call"],
    ["forget calling", "forget call"],
    "pattern",
  ],
  [
    "I'd prefer you not to tell anyone.",
    "RATHER",
    "I'd ___ tell anyone.",
    ["rather you [did not|didn't]"],
    ["rather you don't", "rather you not"],
    "pattern",
  ],
  [
    "I haven't been to the cinema for months.",
    "SINCE",
    "It's months ___ to the cinema.",
    ["since I [last went|went|have been|'ve been]"],
    ["since I go", "since I was going"],
    "pattern",
  ],
];

const conditionalsAndModals: readonly Transformation[] = [
  [
    "I didn't know you were in hospital, so I didn't visit you.",
    "HAD",
    "If I ___ you were in hospital, I would have visited you.",
    ["had known"],
    ["have known", "knew"],
    "conditional",
  ],
  [
    "We missed the train because we left late.",
    "IF",
    "We would have caught the train ___ earlier.",
    ["if [we had|we'd] left"],
    ["if we left", "if we would have left"],
    "conditional",
  ],
  [
    "You won't pass the exam if you don't study.",
    "UNLESS",
    "You won't pass the exam ___.",
    ["unless you study"],
    ["unless you don't study", "if you study"],
    "conditional",
  ],
  [
    "I'm sorry I didn't take the job.",
    "WISH",
    "I ___ the job.",
    ["wish [I had|I'd] taken"],
    ["wish I took", "wish I have taken"],
    "conditional",
  ],
  [
    "I don't have a car, so I can't drive you home.",
    "WOULD",
    "If I had a car, I ___ home.",
    ["[would|'d] drive you"],
    ["will drive you", "would have driven you"],
    "conditional",
  ],
  [
    "It's a pity you can't come to the party.",
    "WISH",
    "I ___ come to the party.",
    ["wish you could"],
    ["wish you can", "wish you would can"],
    "conditional",
  ],
  [
    "Without your help, I would have failed.",
    "BEEN",
    "If it ___ your help, I would have failed.",
    ["[had not|hadn't] been for"],
    ["was not for", "had been for"],
    "conditional",
  ],
  [
    "Take your coat, because it might get cold.",
    "CASE",
    "Take your coat ___ cold.",
    ["in case it gets"],
    ["in case it will get", "in case of it gets"],
    "conditional",
  ],
  [
    "He was ill, so he didn't play in the final.",
    "WOULD",
    "He ___ in the final if he hadn't been ill.",
    ["[would|'d] have played"],
    ["would play", "would had played"],
    "conditional",
  ],
  [
    "I'll only lend you the money if you promise to pay it back.",
    "LONG",
    "I'll lend you the money ___ promise to pay it back.",
    ["[as|so] long as you"],
    ["as long you", "as soon as you"],
    "conditional",
  ],
  [
    "'I'll call you tomorrow,' Sam said to me.",
    "WOULD",
    "Sam told me ___ me the next day.",
    ["[he would call|that he would call]"],
    ["he will call", "that he would called"],
    "reported",
  ],
  [
    "'Why don't we go to the beach?' said Anna.",
    "SUGGESTED",
    "Anna ___ to the beach.",
    ["suggested [going|that we go|that we should go|we go|we should go]"],
    ["suggested to go", "suggested us to go"],
    "reported",
  ],
  [
    "'Don't touch the paintings,' the guide told us.",
    "NOT",
    "The guide told ___ the paintings.",
    ["us not to touch"],
    ["us don't touch", "us not touch"],
    "reported",
  ],
  [
    "'Where do you live?' she asked me.",
    "WHERE",
    "She asked ___ lived.",
    ["[me where I|where I]"],
    ["me where did I", "me where do I"],
    "reported",
  ],
  [
    "'I'm sorry I broke your glasses,' Tom said to Ana.",
    "APOLOGISED",
    "Tom ___ Ana's glasses.",
    ["apologised for [breaking|having broken]"],
    ["apologised to break", "apologised for broke"],
    "reported",
  ],
  [
    "'You should see a doctor,' my mother said to me.",
    "ADVISED",
    "My mother ___ a doctor.",
    ["advised me to see"],
    ["advised me seeing", "advised to me see"],
    "reported",
  ],
  [
    "'Did you enjoy the film?' he asked us.",
    "WHETHER",
    "He asked us ___ the film.",
    ["whether [we had enjoyed|we'd enjoyed|we enjoyed]"],
    ["whether did we enjoy", "whether we have enjoyed"],
    "reported",
  ],
  [
    "'I didn't take the money,' said the boy.",
    "DENIED",
    "The boy ___ the money.",
    ["denied [taking|having taken|that he took|that he had taken|that he'd taken]"],
    ["denied to take", "denied take"],
    "reported",
  ],
  [
    "'You can borrow my laptop,' Lucy said to me.",
    "OFFERED",
    "Lucy ___ her laptop.",
    ["offered [to lend me|me]"],
    ["offered me to borrow", "offered me borrowing"],
    "reported",
  ],
  [
    "'Remember to bring your passport,' Dad said to me.",
    "REMINDED",
    "Dad ___ my passport.",
    ["reminded me to bring"],
    ["reminded me bringing", "reminded to me bring"],
    "reported",
  ],
  [
    "I'm sure she forgot about the meeting.",
    "MUST",
    "She ___ about the meeting.",
    ["[must have|must've] forgotten"],
    ["must forget", "must have forgot"],
    "modal",
  ],
  [
    "It's impossible that he saw us; it was too dark.",
    "HAVE",
    "He ___ us; it was too dark.",
    ["[can't|cannot|couldn't|could not] have seen"],
    ["mustn't have seen", "can't see"],
    "modal",
  ],
  [
    "It was a mistake to leave the door open.",
    "SHOULD",
    "You ___ the door open.",
    ["[should not|shouldn't] have left"],
    ["should not leave", "should have not left"],
    "modal",
  ],
  [
    "It wasn't necessary for us to bring food, but we did.",
    "NEEDN'T",
    "We ___ food.",
    ["needn't have brought"],
    ["needn't bring", "needn't have bring"],
    "modal",
  ],
  [
    "Perhaps they took the wrong road.",
    "MIGHT",
    "They ___ the wrong road.",
    ["[might have|might've] taken"],
    ["might take", "might have took"],
    "modal",
  ],
  [
    "I'm sure it wasn't Paul you saw; he's in Spain.",
    "BEEN",
    "It ___ Paul you saw; he's in Spain.",
    ["[can't|cannot|couldn't|could not] have been"],
    ["mustn't have been", "can't be"],
    "modal",
  ],
  [
    "It was possible for me to go, but I decided not to.",
    "COULD",
    "I ___, but I decided not to.",
    ["could have gone"],
    ["could go", "could have went"],
    "modal",
  ],
  [
    "They have postponed the meeting until Friday.",
    "PUT",
    "They have ___ until Friday.",
    ["put [off the meeting|the meeting off]"],
    ["put the meeting", "put out the meeting"],
    "phrasal",
  ],
  [
    "I'm really excited about the holiday.",
    "FORWARD",
    "I'm really ___ the holiday.",
    ["looking forward to"],
    ["looking forward", "looking forward for"],
    "phrasal",
  ],
  [
    "She stopped eating meat last year.",
    "GAVE",
    "She ___ meat last year.",
    ["gave up( eating)"],
    ["gave eating up", "gave off eating"],
    "phrasal",
  ],
  [
    "I can't stand his rudeness any more.",
    "PUT",
    "I can't ___ his rudeness any more.",
    ["put up with"],
    ["put up", "stand up with"],
    "phrasal",
  ],
  ["We have no sugar left.", "RUN", "We have ___ sugar.", ["run out of"], ["run out", "run off of"], "phrasal"],
  ["The plane left the ground at the right time.", "TOOK", "The plane ___ time.", ["took off on"], ["took on", "took off in"], "phrasal"],
  [
    "My aunt raised me after my parents died.",
    "BROUGHT",
    "I ___ my aunt after my parents died.",
    ["was brought up by"],
    ["brought up by", "was brought by"],
    "phrasal",
  ],
  [
    "It's my job to look after the money.",
    "CHARGE",
    "I'm ___ the money.",
    ["in charge of( looking after)"],
    ["in the charge of", "charge of"],
    "phrasal",
  ],
];

const transformation = ([first, key, second, accepted, wrong, kind]: Transformation): GapItem => {
  const canonical = expandPattern(accepted[0] as string)[0] as string;
  return {
    shown: `${first}\n\n**${key}**\n\n${shownGap(second)}`,
    accepted,
    canonical,
    wrong,
    solution: joinText([
      t(`The gap is **${canonical}**.`, `空格处是 **${canonical}**。`),
      transformWhy[kind],
      same(quote(filled(second, canonical))),
    ]),
  };
};

const transformQuestion = t(
  "Complete the second sentence so that it means the same as the first. Use the word in capitals without changing it, and type two to five words, including that word.",
  "完成第二个句子，使它与第一个句子意思相同。必须使用大写的词，不能改变它的形式；输入二至五个词，包括这个词。",
);

/** keyWordTransformations is Part 4 of Reading and Use of English. */
export const keyWordTransformations: TopicDef = examTopic({
  id: "fce-key-word-transformations",
  title: t("Key Word Transformations", "关键词句型转换"),
  summary: t(
    "Rewrite a sentence in two to five words around a given word, as in Part 4 of B2 First Reading and Use of English: first passives, comparisons and verb patterns, then conditionals, reported speech, past modals and phrasal verbs.",
    "按照 B2 First 阅读与英语运用第 4 部分的形式，用包含所给词在内的二至五个词改写句子：先是被动语态、比较和动词结构，再是条件句、间接引语、过去情态和短语动词。",
  ),
  strand: "grammar",
  prerequisites: ["third-conditional", "reported-speech", "passive-with-modals-and-perfect-forms"],
  encompasses: [
    { topic: "third-conditional", weight: 0.2 },
    { topic: "reported-speech", weight: 0.2 },
    { topic: "passive-with-modals-and-perfect-forms", weight: 0.2 },
  ],
  xp: 10,
  points: [
    point(
      "passives-comparisons-patterns",
      t("Passives, comparisons and verb patterns", "被动语态、比较和动词结构"),
      t(
        "Each item tests two things at once, usually a structure and a word or phrase. Start from the key word: what pattern does it bring? *BY* or *BEEN* signals a passive; *AS*, *THAN* or *ENOUGH* a comparison turned around; a verb such as *SUCCEEDED*, *MIND* or *SPENT* its own pattern (*succeeded in finishing*, *spent two hours writing*). Then compare the two sentences word by word, keep the tense and every piece of meaning, and count: two to five words, with a contraction such as *wasn't* counted as two. Never change the key word.",
        "每道题通常同时考两点：一个结构和一个词或短语。先看关键词：它带来什么结构？*BY* 或 *BEEN* 提示被动语态；*AS*、*THAN* 或 *ENOUGH* 提示换个方向的比较；*SUCCEEDED*、*MIND*、*SPENT* 等动词有自己的结构（*succeeded in finishing*、*spent two hours writing*）。然后逐词比较两个句子，保持时态和每一点意思，再数词数：二至五个词，*wasn't* 这样的缩写算两个词。绝不能改变关键词。",
      ),
      gapGenerator("sentence-pattern", transformQuestion, passivesAndPatterns.map(transformation)),
    ),
    point(
      "conditionals-reporting-modals",
      t("Conditionals, reported speech, past modals and phrasal verbs", "条件句、间接引语、过去情态和短语动词"),
      t(
        "These items change how a sentence relates to reality or to a speaker. If the first sentence states a fact, the second often imagines the opposite: *I didn't know* becomes *If I had known*, and *I'm sorry I didn't* becomes *I wish I had*. A quotation becomes reported speech with its tense moved back, or a reporting verb with its pattern: *suggested going*, *denied taking*, *advised me to see*. *I'm sure* and *it's impossible* become *must have* and *can't have*; *it was a mistake* becomes *should have*. A phrasal verb often replaces a single verb: *postpone*, *put off*; *tolerate*, *put up with*.",
        "这些题改变的是句子与事实或与说话人的关系。第一句陈述事实时，第二句常常设想相反的情况：*I didn't know* 变成 *If I had known*，*I'm sorry I didn't* 变成 *I wish I had*。直接引语变成时态后移的间接引语，或者变成带固定结构的转述动词：*suggested going*、*denied taking*、*advised me to see*。*I'm sure* 和 *it's impossible* 变成 *must have* 和 *can't have*；*it was a mistake* 变成 *should have*。短语动词常常替换单个动词：*postpone* 换成 *put off*，*tolerate* 换成 *put up with*。",
      ),
      gapGenerator("sentence-pattern", transformQuestion, conditionalsAndModals.map(transformation)),
    ),
  ],
});
