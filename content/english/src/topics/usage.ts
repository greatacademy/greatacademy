// Usage: the forms of words that standard written English expects, and the words that sound alike.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typed, typedGenerator } from "@ga/subject-english";
import { everyPair } from "../levels/words.ts";

const form = (shown: string, right: string, ...wrong: readonly string[]): TypedItem => ({
  shown,
  accepted: [right],
  canonical: right,
  wrong,
});

const fixed = (shown: string, right: string, ...wrong: readonly string[]): TypedItem => typed(shown, right, wrong);

const erEstBank: readonly TypedItem[] = [
  form("tall: comparing two trees", "taller", "tallest", "more tall"),
  form("big: comparing two dogs", "bigger", "biger", "more big"),
  form("happy: comparing two children", "happier", "happyer", "more happy"),
  form("fast: the quickest of all the runners", "fastest", "faster", "most fast"),
  form("hot: the warmest day of the year", "hottest", "hotest", "hotter"),
  form("easy: comparing two tests", "easier", "easyer", "more easy"),
  form("large: the greatest in size of all the rooms", "largest", "larger", "largeest"),
  form("small: comparing two boxes", "smaller", "smallest", "more small"),
  form("funny: the most amusing of all the jokes", "funniest", "funnyest", "funnier"),
  form("wet: comparing two towels", "wetter", "weter", "more wet"),
];

const moreMostBank: readonly ChoiceItem[] = [
  ["This puzzle is ___ than the last one.", "more difficult", ["difficulter", "most difficult"]],
  ["She is the ___ singer in the choir.", "most careful", ["carefullest", "more careful"]],
  ["Of the two paintings, this one is ___.", "more colorful", ["colorfuller", "most colorful"]],
  ["That was the ___ movie I have ever seen.", "most exciting", ["excitingest", "more exciting"]],
  ["The new park is ___ than the old one.", "more beautiful", ["beautifuler", "most beautiful"]],
  ["He gave the ___ answer in the whole class.", "most interesting", ["interestinger", "more interesting"]],
  ["Today the river is ___ than it was yesterday.", "more dangerous", ["dangerouser", "most dangerous"]],
  ["Of all the plans, this one is the ___.", "most useful", ["usefuller", "more useful"]],
  ["My sister is ___ than I am about her homework.", "more patient", ["patienter", "most patient"]],
];

const irregularBank: readonly ChoiceItem[] = [
  ["My cold is ___ today than it was yesterday.", "worse", ["badder", "worst"]],
  ["This is the ___ pizza in town.", "best", ["goodest", "better"]],
  ["Her second drawing was ___ than her first.", "better", ["gooder", "more good"]],
  ["That was the ___ storm in fifty years.", "worst", ["baddest", "worse"]],
  ["Which of the two roads is ___ from here?", "farther", ["farrer", "farthest"]],
  ["I have ___ homework than my brother.", "less", ["littler", "least"]],
  ["He ate the ___ of all, just one bite.", "least", ["littlest", "less"]],
  ["She has ___ books than anyone in her class.", "more", ["mucher", "most"]],
  ["This team played ___ than the other one.", "better", ["more well", "best"]],
  ["Of the three songs, I like this one ___.", "best", ["better", "most good"]],
];

const doubleBank: readonly ChoiceItem[] = [
  [
    "Which sentence is correct?",
    "This box is heavier than that one.",
    ["This box is more heavier than that one.", "This box is most heavy than that one."],
  ],
  [
    "Which sentence is correct?",
    "She is the kindest person I know.",
    ["She is the most kindest person I know.", "She is the kinder person I know."],
  ],
  [
    "Which sentence is correct?",
    "Our team is stronger this year.",
    ["Our team is more stronger this year.", "Our team is strongest this year than last."],
  ],
  [
    "Which sentence is correct?",
    "That was the scariest part of the book.",
    ["That was the most scariest part of the book.", "That was the scarier part of the whole book."],
  ],
  [
    "Which sentence is correct?",
    "Of the two twins, Sam is taller.",
    ["Of the two twins, Sam is tallest.", "Of the two twins, Sam is more taller."],
  ],
  [
    "Which sentence is correct?",
    "The lake is deeper than the pond.",
    ["The lake is more deeper than the pond.", "The lake is deepest than the pond."],
  ],
  [
    "Which sentence is correct?",
    "This is the oldest tree in the park.",
    ["This is the most oldest tree in the park.", "This is the older tree in the whole park."],
  ],
  [
    "Which sentence is correct?",
    "My new shoes are more comfortable.",
    ["My new shoes are more comfortabler.", "My new shoes are comfortabler."],
  ],
];

const singularPossessiveBank: readonly TypedItem[] = [
  form("the bone that belongs to the dog", "dog's", "dogs", "dogs'"),
  form("the book that belongs to Maria", "Maria's", "Marias", "Marias'"),
  form("the car that belongs to my uncle", "uncle's", "uncles", "uncles'"),
  form("the nest that belongs to the bird", "bird's", "birds", "birds'"),
  form("the hat that belongs to James", "James's", "Jameses", "Jame's"),
  form("the tail that belongs to the cat", "cat's", "cats", "cats'"),
  form("the desk that belongs to the teacher", "teacher's", "teachers", "teachers'"),
  form("the bike that belongs to Chris", "Chris's", "Chrises", "Chri's"),
  form("the roof that belongs to the house", "house's", "houses", "houses'"),
  form("the toy that belongs to the baby", "baby's", "babies", "babys"),
];

const pluralPossessiveBank: readonly TypedItem[] = [
  form("the coats that belong to the girls", "girls'", "girl's", "girls's"),
  form("the toys that belong to the children", "children's", "childrens'", "childrens"),
  form("the nests that belong to the birds", "birds'", "bird's", "birds's"),
  form("the books that belong to the students", "students'", "student's", "students's"),
  form("the tools that belong to the men", "men's", "mens'", "mans'"),
  form("the classroom that belongs to the teachers", "teachers'", "teacher's", "teachers's"),
  form("the barn that belongs to the horses", "horses'", "horse's", "horses's"),
  form("the shoes that belong to the women", "women's", "womens'", "womans'"),
  form("the den that belongs to the foxes", "foxes'", "fox's", "foxes's"),
  form("the tails that belong to the mice", "mice's", "mices'", "mouses'"),
];

const itsBank: readonly ChoiceItem[] = [
  ["The dog wagged ___ tail.", "its", ["it's", "its'"]],
  ["___ raining again this morning.", "It's", ["Its", "Its'"]],
  ["The tree lost all of ___ leaves.", "its", ["it's", "its'"]],
  ["I think ___ time to go home.", "it's", ["its", "its'"]],
  ["The company changed ___ name.", "its", ["it's", "its'"]],
  ["___ been a long week.", "It's", ["Its", "Its'"]],
  ["The bird built ___ nest in the barn.", "its", ["it's", "its'"]],
  ["Do you know if ___ true?", "it's", ["its", "its'"]],
  ["The team won ___ first game.", "its", ["it's", "its'"]],
  ["___ too cold to swim today.", "It's", ["Its", "Its'"]],
];

const theirBank: readonly ChoiceItem[] = [
  ["The students left ___ bags by the door.", "their", ["there", "they're"]],
  ["Put the boxes over ___.", "there", ["their", "they're"]],
  ["___ going to the park after lunch.", "They're", ["Their", "There"]],
  ["___ are three apples in the bowl.", "There", ["Their", "They're"]],
  ["My neighbors painted ___ fence green.", "their", ["there", "they're"]],
  ["I hope ___ not late for the bus.", "they're", ["their", "there"]],
  ["Is ___ any milk left?", "there", ["their", "they're"]],
  ["The birds flew back to ___ nests.", "their", ["there", "they're"]],
  ["___ the best players on the team.", "They're", ["Their", "There"]],
  ["We waited ___ for an hour.", "there", ["their", "they're"]],
];

const yourToBank: readonly ChoiceItem[] = [
  ["Is this ___ jacket?", "your", ["you're", "yore"]],
  ["___ going to love this book.", "You're", ["Your", "Youre"]],
  ["We walked ___ the store.", "to", ["too", "two"]],
  ["This soup is ___ hot to eat.", "too", ["to", "two"]],
  ["I have ___ brothers and a sister.", "two", ["to", "too"]],
  ["Can I come ___?", "too", ["to", "two"]],
  ["Please wash ___ hands before dinner.", "your", ["you're", "yore"]],
  ["Tell me when ___ ready.", "you're", ["your", "youre"]],
  ["She gave the letter ___ her friend.", "to", ["too", "two"]],
  ["The movie lasted ___ hours.", "two", ["to", "too"]],
];

const thenThanBank: readonly ChoiceItem[] = [
  ["My brother is older ___ me.", "than", ["then", "that"]],
  ["We ate dinner, and ___ we watched a movie.", "then", ["than", "that"]],
  ["I would rather walk ___ ride the bus.", "than", ["then", "that"]],
  ["Mix the flour, and ___ add the eggs.", "then", ["than", "that"]],
  ["This bag is lighter ___ that one.", "than", ["then", "that"]],
  ["Back ___, there were no phones.", "then", ["than", "that"]],
  ["The noise made the baby cry, and the loss of sleep had a bad ___ on all of us.", "effect", ["affect", "effort"]],
  ["Does the weather ___ your mood?", "affect", ["effect", "afford"]],
  ["The new rule will ___ every student.", "affect", ["effect", "afford"]],
  ["What ___ did the medicine have?", "effect", ["affect", "effort"]],
];

const thenThanWhy = new Map([
  ["than", t("It compares.", "它用于比较。")],
  ["then", t("It tells when.", "它表示时间。")],
  ["affect", t("It is the verb.", "这里需要动词。")],
  ["effect", t("It is the noun.", "这里需要名词。")],
]);

const shiftBank: readonly ChoiceItem[] = [
  [
    "Which sentence keeps its verbs in the same time?",
    "She opened the door and saw a cat.",
    ["She opened the door and sees a cat.", "She opens the door and saw a cat."],
  ],
  [
    "Which sentence keeps its verbs in the same time?",
    "Every morning he wakes up and brushes his teeth.",
    ["Every morning he wakes up and brushed his teeth.", "Every morning he woke up and brushes his teeth."],
  ],
  [
    "Which sentence keeps its verbs in the same time?",
    "We ran to the bus, but it left without us.",
    ["We ran to the bus, but it leaves without us.", "We run to the bus, but it left without us."],
  ],
  [
    "Which sentence keeps its verbs in the same time?",
    "The puppy jumps up and licks my face.",
    ["The puppy jumps up and licked my face.", "The puppy jumped up and licks my face."],
  ],
  [
    "Which sentence keeps its verbs in the same time?",
    "Yesterday I baked bread and gave some to my friend.",
    ["Yesterday I baked bread and give some to my friend.", "Yesterday I bake bread and gave some to my friend."],
  ],
  [
    "Which sentence keeps its verbs in the same time?",
    "The bell rings, and the students walk to class.",
    ["The bell rings, and the students walked to class.", "The bell rang, and the students walk to class."],
  ],
  [
    "Which sentence keeps its verbs in the same time?",
    "Last summer we camped by a lake and swam every day.",
    ["Last summer we camped by a lake and swim every day.", "Last summer we camp by a lake and swam every day."],
  ],
  [
    "Which sentence keeps its verbs in the same time?",
    "He reads the note and smiles.",
    ["He reads the note and smiled.", "He read the note and smiles."],
  ],
  [
    "Which sentence keeps its verbs in the same time?",
    "The storm knocked out the power, and the room went dark.",
    ["The storm knocked out the power, and the room goes dark.", "The storm knocks out the power, and the room went dark."],
  ],
];

const shiftFixBank: readonly TypedItem[] = [
  fixed(
    "Yesterday we went to the zoo and see a lion.",
    "Yesterday we went to the zoo and saw a lion.",
    "Yesterday we went to the zoo and see a lion.",
    "Yesterday we go to the zoo and saw a lion.",
  ),
  fixed(
    "Last night the wind blew and the windows shake.",
    "Last night the wind blew and the windows shook.",
    "Last night the wind blew and the windows shake.",
    "Last night the wind blew and the windows shaked.",
  ),
  fixed(
    "Last week Tom found a wallet and gives it to the police.",
    "Last week Tom found a wallet and gave it to the police.",
    "Last week Tom found a wallet and gives it to the police.",
    "Last week Tom found a wallet and gived it to the police.",
  ),
  fixed(
    "This morning I ate breakfast and catch the bus.",
    "This morning I ate breakfast and caught the bus.",
    "This morning I ate breakfast and catch the bus.",
    "This morning I ate breakfast and catched the bus.",
  ),
  fixed(
    "On Monday she wrote a story and reads it to the class.",
    "On Monday she wrote a story and read it to the class.",
    "On Monday she wrote a story and reads it to the class.",
    "On Monday she wrote a story and readed it to the class.",
  ),
  fixed(
    "Last spring the farmer planted corn and grows beans.",
    "Last spring the farmer planted corn and grew beans.",
    "Last spring the farmer planted corn and grows beans.",
    "Last spring the farmer planted corn and growed beans.",
  ),
  fixed(
    "Two days ago the cat climbed the tree and gets stuck.",
    "Two days ago the cat climbed the tree and got stuck.",
    "Two days ago the cat climbed the tree and gets stuck.",
    "Two days ago the cat climbed the tree and getted stuck.",
  ),
  fixed(
    "Last year we moved to a new town and make new friends.",
    "Last year we moved to a new town and made new friends.",
    "Last year we moved to a new town and make new friends.",
    "Last year we moved to a new town and maked new friends.",
  ),
  fixed(
    "After school yesterday, I fed the fish and drink some juice.",
    "After school yesterday, I fed the fish and drank some juice.",
    "After school yesterday, I fed the fish and drink some juice.",
    "After school yesterday, I fed the fish and drinked some juice.",
  ),
];

/** entry returns the entry of a feedback table, failing loudly when a bank uses an option the table does not cover. */
function entry<V>(table: Readonly<Record<string, V>>, key: string): V {
  const found = table[key];
  if (found === undefined) throw new Error(`no feedback for the option "${key}"`);
  return found;
}

type Pair = readonly [en: string, zh: string];

const moreMostFeedback = (wrong: string) =>
  wrong.startsWith("most ")
    ? t(
        `“${wrong}” is the form for one that stands out from three or more. Check how many things the sentence compares.`,
        `“${wrong}” 用于从三个或更多中突出一个。看看句子比较的是几个事物。`,
      )
    : wrong.startsWith("more ")
      ? t(
          `“${wrong}” is the form for comparing two things. Check how many things the sentence compares.`,
          `“${wrong}” 用于比较两个事物。看看句子比较的是几个事物。`,
        )
      : t(
          `“${wrong}” adds an ending to a long adjective. Words like this compare with *more* or *most* instead of *-er* or *-est*.`,
          `“${wrong}” 给长形容词加了词尾。这类词用 *more* 或 *most* 比较，而不是加 *-er* 或 *-est*。`,
        );

const regularized = (w: string): Pair => [
  `“${w}” follows the regular pattern, but this word has an irregular form of its own.`,
  `“${w}” 套用了规则变化，但这个词有自己的不规则形式。`,
];
const forTwo = (w: string): Pair => [
  `“${w}” is the form for comparing two. Check whether the sentence compares two things or picks one out of a larger group.`,
  `“${w}” 是比较两者的形式。看看句子是比较两个事物，还是从更多事物中挑出一个。`,
];
const forGroup = (w: string): Pair => [
  `“${w}” is the form for one out of three or more. Check whether the sentence compares two things or picks one out of a larger group.`,
  `“${w}” 是从三者或更多中挑出一个的形式。看看句子是比较两个事物，还是从更多事物中挑出一个。`,
];

const irregularForm: Readonly<Record<string, (w: string) => Pair>> = {
  badder: regularized,
  goodest: regularized,
  gooder: regularized,
  "more good": regularized,
  baddest: regularized,
  farrer: regularized,
  littler: regularized,
  littlest: regularized,
  mucher: regularized,
  "more well": regularized,
  "most good": regularized,
  worse: forTwo,
  better: forTwo,
  less: forTwo,
  worst: forGroup,
  farthest: forGroup,
  least: forGroup,
  most: forGroup,
  best: forGroup,
};

const doubledFeedback: Readonly<Record<string, Pair>> = {
  double: [
    "compares twice: *more* or *most* with an *-er* or *-est* word. Use one way of comparing.",
    "比较了两次：*more* 或 *most* 和 *-er* 或 *-est* 形式一起用。只用一种比较方式。",
  ],
  mostThan: [
    "uses the form for one out of a group together with *than*, which compares two.",
    "把用于一组中挑出一个的形式和比较两者的 *than* 一起用了。",
  ],
  erForGroup: [
    "uses the *-er* form, which compares two, yet one stands out from a whole group here.",
    "用了比较两者的 *-er* 形式，可这里是从一整组中突出一个。",
  ],
  estForTwo: ["uses the *-est* form for a comparison of only two.", "只比较两个，却用了 *-est* 形式。"],
  erOnLong: ["adds *-er* to a long word, which compares with *more* instead.", "给长词加了 *-er*，而这种词要用 *more* 比较。"],
};

const doubledKind: Readonly<Record<string, keyof typeof doubledFeedback>> = {
  "This box is more heavier than that one.": "double",
  "This box is most heavy than that one.": "mostThan",
  "She is the most kindest person I know.": "double",
  "She is the kinder person I know.": "erForGroup",
  "Our team is more stronger this year.": "double",
  "Our team is strongest this year than last.": "mostThan",
  "That was the most scariest part of the book.": "double",
  "That was the scarier part of the whole book.": "erForGroup",
  "Of the two twins, Sam is tallest.": "estForTwo",
  "Of the two twins, Sam is more taller.": "double",
  "The lake is more deeper than the pond.": "double",
  "The lake is deepest than the pond.": "mostThan",
  "This is the most oldest tree in the park.": "double",
  "This is the older tree in the whole park.": "erForGroup",
  "My new shoes are more comfortabler.": "double",
  "My new shoes are comfortabler.": "erOnLong",
};

const irregularOrDoubled = (wrong: string, _right: string, shown: string) => {
  if (shown.includes("___")) {
    const [en, zh] = entry(irregularForm, wrong)(wrong);
    return t(en, zh);
  }
  const [en, zh] = entry(doubledFeedback, entry(doubledKind, wrong));
  return t(`“${wrong}” ${en}`, `“${wrong}” ${zh}`);
};

const soundAlike: ReadonlyMap<string, Pair> = new Map<string, Pair>([
  [
    "it's",
    [
      "“it's” means *it is* or *it has*. Read the sentence with those words in the gap and hear whether it makes sense.",
      "“it's” 的意思是 *it is* 或 *it has*。把它们放进空格读一读，看看是否说得通。",
    ],
  ],
  [
    "its",
    [
      "“its” shows ownership, so a noun that belongs to *it* would follow. Check whether *it is* or *it has* fits instead.",
      "“its” 表示所属，后面应跟属于 *it* 的名词。看看这里是否换成 *it is* 或 *it has* 才说得通。",
    ],
  ],
  [
    "its'",
    ["“its'” is not an English word: *its* never takes an apostrophe after the *s*.", "“its'” 不是英语单词：*its* 的 *s* 后面从不加撇号。"],
  ],
  [
    "their",
    [
      "“their” shows ownership, so a noun that belongs to them would follow. Check whether anything here belongs to someone.",
      "“their” 表示所属，后面应跟属于他们的名词。看看这里有没有东西属于某人。",
    ],
  ],
  [
    "there",
    [
      "“there” names a place or begins a sentence such as *There is*. Check whether the gap is about a place.",
      "“there” 表示地点，或用于 *There is* 这样的句子开头。看看空格是否与地点有关。",
    ],
  ],
  [
    "they're",
    [
      "“they're” means *they are*. Read the sentence with *they are* in the gap and hear whether it makes sense.",
      "“they're” 的意思是 *they are*。把 *they are* 放进空格读一读，看看是否说得通。",
    ],
  ],
  [
    "your",
    [
      "“your” shows ownership, so a noun that belongs to you would follow. Check whether *you are* fits instead.",
      "“your” 表示所属，后面应跟属于你的名词。看看这里是否换成 *you are* 才说得通。",
    ],
  ],
  [
    "you're",
    [
      "“you're” means *you are*. Read the sentence with *you are* in the gap and hear whether it makes sense.",
      "“you're” 的意思是 *you are*。把 *you are* 放进空格读一读，看看是否说得通。",
    ],
  ],
  [
    "yore",
    [
      "“yore” is an old word meaning *long ago*. It sounds alike but means something else.",
      "“yore” 是一个古词，意思是“很久以前”。它发音相近，但意思不同。",
    ],
  ],
  [
    "youre",
    [
      "“youre” is not an English word: a contraction keeps its apostrophe where letters are left out.",
      "“youre” 不是英语单词：缩写要在省略字母的地方保留撇号。",
    ],
  ],
  [
    "to",
    [
      "“to” goes before a place or a verb, as in *to the store* or *to eat*. Check whether the gap means a number or *also* or *more than enough*.",
      "“to” 用在地点或动词前，例如 *to the store*、*to eat*。看看空格是否表示数字、“也”或“太”。",
    ],
  ],
  [
    "too",
    [
      "“too” means *also* or *more than enough*. Check whether either meaning fits the gap.",
      "“too” 的意思是“也”或“太”。看看哪种意思能放进空格。",
    ],
  ],
  ["two", ["“two” is the number 2. Check whether the sentence counts anything here.", "“two” 是数字 2。看看句子在这里是否在数数。"]],
  [
    "than",
    [
      "“than” compares two things, as in *older than*. Check whether the sentence compares anything here.",
      "“than” 用于比较两个事物，例如 *older than*。看看句子在这里是否在比较。",
    ],
  ],
  [
    "then",
    [
      "“then” tells when, as in *and then we left*. Check whether the sentence is about time here.",
      "“then” 表示时间，例如 *and then we left*。看看句子在这里是否在说时间。",
    ],
  ],
  [
    "that",
    [
      "“that” points to something or begins a clause; it neither compares nor tells when.",
      "“that” 指代某物或引出从句；它既不表示比较，也不表示时间。",
    ],
  ],
  [
    "affect",
    [
      "“affect” is usually a verb, to change something. Check whether the gap needs an action or a thing, such as a word after *a* or *what*.",
      "“affect” 通常是动词，意思是影响某事物。看看空格需要的是动作，还是 *a* 或 *what* 后面的事物。",
    ],
  ],
  [
    "effect",
    [
      "“effect” is usually a noun, a result. Check whether the gap needs a thing or an action, such as a word after *will* or *does*.",
      "“effect” 通常是名词，意思是结果。看看空格需要的是事物，还是 *will* 或 *does* 后面的动作。",
    ],
  ],
  [
    "effort",
    [
      "“effort” means hard work, not a result. It only looks like the word the sentence needs.",
      "“effort” 的意思是努力，不是结果。它只是看起来像句子需要的词。",
    ],
  ],
  [
    "afford",
    [
      "“afford” means to have enough money or time for something, not to change it. It only looks like the word the sentence needs.",
      "“afford” 的意思是买得起或抽得出时间，不是影响。它只是看起来像句子需要的词。",
    ],
  ],
]);

const confusedWord = (wrong: string) => {
  const found = soundAlike.get(wrong.toLowerCase());
  if (found === undefined) throw new Error(`no feedback for the option "${wrong}"`);
  return t(found[0], found[1]);
};

const tenseShift = (wrong: string, _right: string, _shown: string, position: number) =>
  position === 0
    ? t(
        `In “${wrong}”, the second verb leaves the tense of the first, though both actions happen at the same time.`,
        `在“${wrong}”中，第二个动词偏离了第一个动词的时态，可两个动作发生在同一时间。`,
      )
    : t(
        `In “${wrong}”, the first verb is in a different tense from the second, though both actions happen at the same time.`,
        `在“${wrong}”中，第一个动词和第二个动词时态不同，可两个动作发生在同一时间。`,
      );

// More items, built from hand-written cores by deterministic templates.

/** shortAdjectives are adjectives that compare with *-er* and *-est*: the word, its two forms, likely misspellings, and two things to compare. */
const shortAdjectives: readonly (readonly [
  word: string,
  er: string,
  est: string,
  badEr: string,
  badEst: string,
  two: string,
  group: string,
])[] = [
  ["short", "shorter", "shortest", "", "", "two pencils", "all the ropes"],
  ["thin", "thinner", "thinnest", "thiner", "thinest", "two slices of bread", "all the books on the shelf"],
  ["sad", "sadder", "saddest", "sader", "sadest", "two songs", "all the stories in the book"],
  ["busy", "busier", "busiest", "busyer", "busyest", "two streets", "all the days of the week"],
  ["cold", "colder", "coldest", "", "", "two winters", "all the months of the year"],
  ["heavy", "heavier", "heaviest", "heavyer", "heavyest", "two backpacks", "all the boxes"],
  ["nice", "nicer", "nicest", "niceer", "niceest", "two hotels", "all the neighbors"],
  ["brave", "braver", "bravest", "braveer", "braveest", "two knights", "all the firefighters"],
  ["sunny", "sunnier", "sunniest", "sunnyer", "sunnyest", "two afternoons", "all the days this month"],
  ["wide", "wider", "widest", "wideer", "wideest", "two rivers", "all the roads in town"],
];
/** moreShortAdjectives are more adjectives that compare with *-er* and *-est*, each with two pairs to compare and two groups. */
const moreShortAdjectives: readonly (readonly [string, string, string, string, string, string, string, string, string])[] = [
  ["tall", "taller", "tallest", "", "", "two trees", "two brothers", "all the buildings in town", "all the players"],
  ["big", "bigger", "biggest", "biger", "bigest", "two dogs", "two houses", "all the fish in the tank", "all the cities in the country"],
  ["hot", "hotter", "hottest", "hoter", "hotest", "two cups of tea", "two summers", "all the days in July", "all the dishes on the menu"],
  ["happy", "happier", "happiest", "happyer", "happyest", "two children", "two endings", "all the puppies", "all the songs on the radio"],
  ["large", "larger", "largest", "largeer", "largeest", "two pizzas", "two rooms", "all the lakes", "all the boxes in the shop"],
  ["fast", "faster", "fastest", "", "", "two runners", "two trains", "all the cars in the race", "all the birds"],
  ["easy", "easier", "easiest", "easyer", "easyest", "two tests", "two puzzles", "all the questions", "all the recipes in the book"],
  ["old", "older", "oldest", "", "", "two castles", "two cousins", "all the trees in the park", "all the people in the village"],
  ["young", "younger", "youngest", "", "", "two sisters", "two kittens", "all the players on the team", "all the children in the class"],
  ["safe", "safer", "safest", "safeer", "safeest", "two roads", "two cars", "all the beaches", "all the bridges in the city"],
  [
    "wet",
    "wetter",
    "wettest",
    "weter",
    "wetest",
    "two towels",
    "two springs",
    "all the months of the year",
    "all the towns in the country",
  ],
  ["funny", "funnier", "funniest", "funnyer", "funnyest", "two jokes", "two films", "all the clowns", "all the stories"],
  ["long", "longer", "longest", "", "", "two rivers", "two queues", "all the bridges", "all the days of the year"],
  ["close", "closer", "closest", "closeer", "closeest", "two shops", "two friends", "all the stations", "all the stars"],
  ["dry", "drier", "driest", "dryer", "dryest", "two shirts", "two summers", "all the places in the country", "all the deserts"],
  ["fat", "fatter", "fattest", "fater", "fatest", "two cats", "two books", "all the pigs on the farm", "all the pumpkins"],
  ["loud", "louder", "loudest", "", "", "two drums", "two voices", "all the bands", "all the children in the room"],
  ["pretty", "prettier", "prettiest", "prettyer", "prettyest", "two gardens", "two dresses", "all the villages", "all the flowers"],
  ["late", "later", "latest", "lateer", "lateest", "two buses", "two trains", "all the guests", "all the flights"],
  ["early", "earlier", "earliest", "earlyer", "earlyest", "two flights", "two classes", "all the birds", "all the guests"],
];
const erEstMore: readonly TypedItem[] = [
  ...moreShortAdjectives.flatMap(([w, er, est, badEr, badEst, two1, two2, group1, group2]) => [
    form(`${w}: comparing ${two1}`, er, badEr || est, `more ${w}`),
    form(`${w}: standing out among ${group1}`, est, badEst || er, `most ${w}`),
    form(`${w}: comparing ${two2}`, er, badEr || est, `more ${w}`),
    form(`${w}: standing out among ${group2}`, est, badEst || er, `most ${w}`),
  ]),
  ...shortAdjectives.flatMap(([w, er, est, badEr, badEst, two, group]) => [
    form(`${w}: comparing ${two}`, er, badEr || est, `more ${w}`),
    form(`${w}: standing out among ${group}`, est, badEst || er, `most ${w}`),
  ]),
];

/** longAdjectives are adjectives that compare with *more* and *most*, with a sentence comparing two and one picking from a group. */
const longAdjectives: readonly (readonly [word: string, er: string, two: string, group: string])[] = [
  ["famous", "famouser", "This singer is ___ than her sister.", "He is the ___ chef in the country."],
  ["important", "importanter", "Sleep is ___ than staying up late.", "This is the ___ rule of the game."],
  ["delicious", "deliciouser", "The apple pie was ___ than the cake.", "That was the ___ meal of the trip."],
  ["comfortable", "comfortabler", "This chair is ___ than the bench.", "It is the ___ bed in the house."],
  ["expensive", "expensiver", "The red bike is ___ than the blue one.", "It is the ___ hotel in the city."],
  ["popular", "popularer", "Soccer is ___ than chess at our school.", "She is the ___ author in the library."],
  ["peaceful", "peacefuler", "The lake is ___ than the busy beach.", "Dawn is the ___ time of the day."],
  ["curious", "curiouser", "The kitten is ___ than the old cat.", "Ali is the ___ student in our class."],
  ["helpful", "helpfuler", "The second map was ___ than the first.", "That was the ___ tip of all."],
  ["powerful", "powerfuler", "The new engine is ___ than the old one.", "It is the ___ storm on record."],
  ["surprising", "surprisinger", "The ending was ___ than I expected.", "That was the ___ news of the year."],
];
/** longNouns are adjectives that compare with *more* and *most*, and things each can describe. */
const longNouns: readonly (readonly [word: string, nouns: readonly string[]])[] = [
  ["famous", ["singer", "painting", "building", "actor"]],
  ["important", ["rule", "lesson", "meeting", "letter"]],
  ["delicious", ["cake", "soup", "pie", "meal"]],
  ["comfortable", ["chair", "bed", "sofa", "car"]],
  ["expensive", ["hotel", "bike", "phone", "coat"]],
  ["popular", ["game", "song", "café", "sport"]],
  ["beautiful", ["garden", "beach", "photo", "village"]],
  ["interesting", ["book", "museum", "story", "film"]],
  ["difficult", ["test", "puzzle", "question", "climb"]],
  ["dangerous", ["road", "river", "trip", "job"]],
];
const moreFrames: readonly string[] = ["This {n} is ___ than that one.", "The new {n} is ___ than the old one."];
const mostFrames: readonly string[] = ["It is the ___ {n} of all.", "That was the ___ {n} I have ever seen."];
const moreMostMore: readonly ChoiceItem[] = [
  ...longAdjectives.flatMap(([w, er, two, group]): ChoiceItem[] => [
    [two, `more ${w}`, [er, `most ${w}`]],
    [group, `most ${w}`, [`${er.slice(0, -2)}est`, `more ${w}`]],
  ]),
  ...longNouns.flatMap(([w, nouns]): ChoiceItem[] =>
    nouns.flatMap((n, k): ChoiceItem[] => [
      [moreFrames[k % 2]!.replace("{n}", n), `more ${w}`, [`${w}er`, `most ${w}`]],
      [mostFrames[k % 2]!.replace("{n}", n), `most ${w}`, [`${w}est`, `more ${w}`]],
    ]),
  ),
];

/** irregularFrames are sentences for good and bad, with the right form and the wrong ones. */
const irregularFrames: readonly (readonly [frame: string, right: string, wrong: readonly [string, string]])[] = [
  ["Your {n} is ___ than mine. (good)", "better", ["gooder", "best"]],
  ["It was the ___ {n} in the class. (good)", "best", ["goodest", "better"]],
  ["My {n} was ___ than yours. (bad)", "worse", ["badder", "worst"]],
  ["That was the ___ {n} of all. (bad)", "worst", ["baddest", "worse"]],
  ["This {n} is even ___ than the last one. (good)", "better", ["gooder", "best"]],
  ["Which was the ___ {n}, do you think? (bad)", "worst", ["baddest", "worse"]],
];
const irregularNouns: readonly string[] = [
  "idea",
  "plan",
  "photo",
  "story",
  "joke",
  "song",
  "drawing",
  "answer",
  "seat",
  "cake",
  "map",
  "game",
  "poem",
  "result",
];
const irregularMore: readonly ChoiceItem[] = [
  ...everyPair(irregularFrames, irregularNouns).map(([[frame, right, wrong], n]): ChoiceItem => [frame.replace("{n}", n), right, wrong]),
  ["Your idea is ___ than mine.", "better", ["gooder", "best"]],
  ["This is the ___ cold I have ever had.", "worst", ["baddest", "worse"]],
  ["The second test was ___ than the first.", "worse", ["badder", "worst"]],
  ["She is the ___ swimmer on the team.", "best", ["goodest", "better"]],
  ["The library is ___ away than the park.", "farther", ["farrer", "farthest"]],
  ["There is ___ milk in this jug than in that one.", "less", ["littler", "least"]],
  ["Of the three drinks, this one has the ___ sugar.", "least", ["littlest", "less"]],
  ["We have ___ snow this year than last year.", "more", ["mucher", "most"]],
  ["He sings ___ than his brother.", "better", ["more well", "best"]],
  ["Of all the fruits, I like mangoes ___.", "best", ["better", "most good"]],
  ["My knee feels ___ today than yesterday.", "worse", ["badder", "worst"]],
  ["That was the ___ meal of the whole trip.", "best", ["goodest", "better"]],
  ["Today the traffic was the ___ all week.", "worst", ["baddest", "worse"]],
];

/** singularOwners are one owner and one thing it owns, with the plural of the owner. */
const singularOwners: readonly (readonly [thing: string, owner: string, possessive: string, wrong1: string, wrong2: string])[] = [
  ["whistle", "the coach", "coach's", "coaches", "coachs'"],
  ["tractor", "the farmer", "farmer's", "farmers", "farmers'"],
  ["map", "the pilot", "pilot's", "pilots", "pilots'"],
  ["crown", "the queen", "queen's", "queens", "queens'"],
  ["bag", "the doctor", "doctor's", "doctors", "doctors'"],
  ["scarf", "Emma", "Emma's", "Emmas", "Emmas'"],
  ["bowl", "the puppy", "puppy's", "puppies", "puppys"],
  ["arm", "the robot", "robot's", "robots", "robots'"],
  ["brush", "the artist", "artist's", "artists", "artists'"],
  ["office", "the boss", "boss's", "bosses", "boss'"],
  ["kite", "the girl", "girl's", "girls", "girls'"],
  ["garden", "Mr. Lee", "Mr. Lee's", "Mr. Lees", "Mr. Lees'"],
  ["diary", "my sister", "sister's", "sisters", "sisters'"],
  ["saddle", "the horse", "horse's", "horses", "horses'"],
  ["castle", "the king", "king's", "kings", "kings'"],
  ["drum", "Lucas", "Lucas's", "Lucases", "Luca's"],
  ["rules", "the library", "library's", "libraries", "librarys"],
  ["ship", "the captain", "captain's", "captains", "captains'"],
  ["locker", "the student", "student's", "students", "students'"],
  ["apron", "the chef", "chef's", "chefs", "chefs'"],
];
/** ownedThings are things any person can own. */
const ownedThings: readonly string[] = ["bag", "hat", "phone", "umbrella", "notebook", "coat", "key", "photo"];
const singularPeople = singularOwners.filter(([, owner]) => !/horse|puppy|robot|library/u.test(owner));
const singularPossessiveMore: readonly TypedItem[] = [
  ...singularOwners.map(([thing, owner, right, w1, w2]) =>
    form(`the ${thing} that ${thing.endsWith("s") ? "belong" : "belongs"} to ${owner}`, right, w1, w2),
  ),
  ...everyPair(singularPeople, ownedThings).map(([[, owner, right, w1, w2], thing]) =>
    form(`the ${thing} that belongs to ${owner}`, right, w1, w2),
  ),
];

/** pluralOwners are many owners and what they own, with the forms learners write by mistake. */
const pluralOwners: readonly (readonly [thing: string, owners: string, possessive: string, wrong1: string, wrong2: string])[] = [
  ["uniforms", "the players", "players'", "player's", "players's"],
  ["station", "the nurses", "nurses'", "nurse's", "nurses's"],
  ["market", "the farmers", "farmers'", "farmer's", "farmers's"],
  ["basket", "the kittens", "kittens'", "kitten's", "kittens's"],
  ["lounge", "the pilots", "pilots'", "pilot's", "pilots's"],
  ["room", "my sisters", "sisters'", "sister's", "sisters's"],
  ["leashes", "the dogs", "dogs'", "dog's", "dogs's"],
  ["flags", "the teams", "teams'", "team's", "teams's"],
  ["bikes", "my cousins", "cousins'", "cousin's", "cousins's"],
  ["helmets", "the workers", "workers'", "worker's", "workers's"],
  ["blankets", "the babies", "babies'", "baby's", "babies's"],
  ["den", "the wolves", "wolves'", "wolf's", "wolves's"],
  ["trucks", "the firefighters", "firefighters'", "firefighter's", "firefighters's"],
  ["toys", "the puppies", "puppies'", "puppy's", "puppies's"],
  ["umbrellas", "the people", "people's", "peoples'", "peoples"],
  ["feathers", "the geese", "geese's", "geeses'", "gooses'"],
  ["cart", "the oxen", "oxen's", "oxens'", "oxes'"],
  ["playground", "the children", "children's", "childrens'", "childs'"],
  ["pen", "the sheep", "sheep's", "sheeps'", "sheeps"],
  ["choir", "the men", "men's", "mens'", "mens"],
];
/** ownedThingsMany are things many people can own together. */
const ownedThingsMany: readonly string[] = ["bags", "coats", "photos", "lockers", "tickets", "names", "seats", "books", "shoes", "room"];
const pluralPeople = pluralOwners.filter(([, owners]) => !/kittens|dogs|teams|babies|wolves|puppies|geese|oxen|sheep/u.test(owners));
const pluralPossessiveMore: readonly TypedItem[] = [
  ...pluralOwners.map(([thing, owners, right, w1, w2]) =>
    form(`the ${thing} that ${thing.endsWith("s") ? "belong" : "belongs"} to ${owners}`, right, w1, w2),
  ),
  ...everyPair(pluralPeople, ownedThingsMany).map(([[, owners, right, w1, w2], thing]) =>
    form(`the ${thing} that ${thing.endsWith("s") ? "belong" : "belongs"} to ${owners}`, right, w1, w2),
  ),
];

/** itsParts are a thing and a part of it, for its. */
const itsParts: readonly (readonly [string, string])[] = [
  ["bird", "wings"],
  ["cat", "tail"],
  ["tree", "leaves"],
  ["car", "wheel"],
  ["shop", "sign"],
  ["phone", "screen"],
  ["school", "gate"],
  ["team", "captain"],
  ["kite", "string"],
  ["house", "roof"],
  ["town", "market"],
  ["dog", "ball"],
  ["clock", "hands"],
  ["book", "cover"],
  ["river", "banks"],
];
const itsFrames: readonly string[] = ["Look at the {o} and ___ {p}.", "I like the {o}, but not ___ {p}.", "The {o} has lost ___ {p}."];
/** itIsStates are what it is, for it's. */
const itIsStates: readonly string[] = [
  "sunny",
  "too late",
  "cold outside",
  "ready",
  "open",
  "my turn",
  "time to go",
  "windy",
  "warm",
  "quiet",
  "dark",
];
const itIsFrames: readonly string[] = ["I think ___ {s}.", "Tell me if ___ {s}.", "We can go when ___ {s}.", "Do you know if ___ {s}?"];
const itsMore: readonly ChoiceItem[] = [
  ...everyPair(itsFrames, itsParts).map(
    ([frame, [o, p]]): ChoiceItem => [frame.replace("{o}", o).replace("{p}", p), "its", ["it's", "its'"]],
  ),
  ...everyPair(itIsFrames, itIsStates).map(([frame, state]): ChoiceItem => [frame.replace("{s}", state), "it's", ["its", "its'"]]),
  ["The bird flapped ___ wings.", "its", ["it's", "its'"]],
  ["___ too windy to fly a kite.", "It's", ["Its", "Its'"]],
  ["The bakery changed ___ hours.", "its", ["it's", "its'"]],
  ["I hope ___ sunny on Saturday.", "it's", ["its", "its'"]],
  ["The car needs ___ oil changed.", "its", ["it's", "its'"]],
  ["___ been a long day.", "It's", ["Its", "Its'"]],
  ["The cat licked ___ paw.", "its", ["it's", "its'"]],
  ["Grab your coat; ___ starting to snow.", "it's", ["its", "its'"]],
  ["Every flower turned ___ face to the sun.", "its", ["it's", "its'"]],
  ["___ my turn to choose the game.", "It's", ["Its", "Its'"]],
  ["The river overflowed ___ banks.", "its", ["it's", "its'"]],
  ["Do you know if ___ open on Sunday?", "it's", ["its", "its'"]],
  ["The school painted ___ gym blue.", "its", ["it's", "its'"]],
  ["___ hard to see in the fog.", "It's", ["Its", "Its'"]],
  ["The spider fixed ___ web.", "its", ["it's", "its'"]],
  ["The movie is long, but ___ worth it.", "it's", ["its", "its'"]],
  ["The team won ___ last game.", "its", ["it's", "its'"]],
  ["___ already eight o'clock!", "It's", ["Its", "Its'"]],
  ["The phone lost ___ signal.", "its", ["it's", "its'"]],
  ["Tell me when ___ ready.", "it's", ["its", "its'"]],
  ["The kite lost ___ tail in the wind.", "its", ["it's", "its'"]],
  ["Wear a hat if ___ windy.", "it's", ["its", "its'"]],
  ["The hive buzzed as ___ bees returned.", "its", ["it's", "its'"]],
];

const theirMore: readonly ChoiceItem[] = [
  ["The twins rode ___ bikes to school.", "their", ["there", "they're"]],
  ["Is anyone sitting over ___?", "there", ["their", "they're"]],
  ["___ coming over for dinner tonight.", "They're", ["Their", "There"]],
  ["The neighbors painted ___ house green.", "their", ["there", "they're"]],
  ["___ are two cats on the porch.", "There", ["Their", "They're"]],
  ["I think ___ lost.", "they're", ["their", "there"]],
  ["The players shook ___ coach's hand.", "their", ["there", "they're"]],
  ["We stopped ___ for lunch.", "there", ["their", "they're"]],
  ["___ both very good at chess.", "They're", ["Their", "There"]],
  ["The birds left ___ nest.", "their", ["there", "they're"]],
  ["___ is a spider in the bath!", "There", ["Their", "They're"]],
  ["My friends said ___ too tired to play.", "they're", ["their", "there"]],
  ["The students handed in ___ reports.", "their", ["there", "they're"]],
  ["Put your shoes down ___ by the door.", "there", ["their", "they're"]],
  ["___ moving to a new town next month.", "They're", ["Their", "There"]],
  ["The kids lost ___ ball in the bushes.", "their", ["there", "they're"]],
  ["Was ___ any mail today?", "there", ["their", "they're"]],
  ["I hope ___ on time.", "they're", ["their", "there"]],
  ["Both dogs wagged ___ tails.", "their", ["there", "they're"]],
  ["___ goes the bus!", "There", ["Their", "They're"]],
  ["The swans fed ___ young by the shore.", "their", ["there", "they're"]],
  ["Ask the twins if ___ ready to leave.", "they're", ["their", "there"]],
];

const yourToMore: readonly ChoiceItem[] = [
  ["Don't forget ___ lunch.", "your", ["you're", "yore"]],
  ["___ the fastest runner I know.", "You're", ["Your", "Youre"]],
  ["We drove ___ the beach.", "to", ["too", "two"]],
  ["This box is ___ heavy to lift.", "too", ["to", "two"]],
  ["She has ___ cats and a dog.", "two", ["to", "too"]],
  ["Is that ___ dog in the yard?", "your", ["you're", "youre"]],
  ["Call me when ___ home.", "you're", ["your", "yore"]],
  ["I want to come ___!", "too", ["to", "two"]],
  ["Give the book ___ Mr. Park.", "to", ["too", "two"]],
  ["The game starts at ___ o'clock.", "two", ["to", "too"]],
  ["Put on ___ boots; it is muddy.", "your", ["you're", "yore"]],
  ["I think ___ right about that.", "you're", ["your", "youre"]],
  ["The tea is ___ hot to drink.", "too", ["to", "two"]],
  ["Walk ___ the corner and turn left.", "to", ["too", "two"]],
  ["We waited for ___ hours.", "two", ["to", "too"]],
  ["Thank you for ___ help.", "your", ["you're", "youre"]],
  ["___ going to need a jacket.", "You're", ["Your", "Yore"]],
  ["My sister likes pizza, ___.", "too", ["to", "two"]],
  ["Send a card ___ your aunt.", "to", ["too", "two"]],
  ["Cut the paper into ___ pieces.", "two", ["to", "too"]],
];

const thenThanMore: readonly ChoiceItem[] = [
  ["A cheetah is faster ___ a horse.", "than", ["then", "that"]],
  ["Brush your teeth, and ___ go to bed.", "then", ["than", "that"]],
  ["The test was easier ___ I thought.", "than", ["then", "that"]],
  ["We hiked to the top and ___ ate lunch.", "then", ["than", "that"]],
  ["My cat is smaller ___ my dog.", "than", ["then", "that"]],
  ["First stir the paint, ___ dip the brush.", "then", ["than", "that"]],
  ["I would rather read ___ watch TV.", "than", ["then", "that"]],
  ["Back ___, the town had only one road.", "then", ["than", "that"]],
  ["This road is longer ___ that one.", "than", ["then", "that"]],
  ["Finish your work, and ___ you can play.", "then", ["than", "that"]],
  ["Loud noise can ___ how well you sleep.", "affect", ["effect", "afford"]],
  ["The rain had a good ___ on the garden.", "effect", ["affect", "effort"]],
  ["Will the snow ___ our trip?", "affect", ["effect", "afford"]],
  ["The movie had a strong ___ on me.", "effect", ["affect", "effort"]],
  ["Too little sleep can ___ your mood.", "affect", ["effect", "afford"]],
  ["What is the ___ of the new rule?", "effect", ["affect", "effort"]],
  ["The cold did not ___ the plants.", "affect", ["effect", "afford"]],
  ["One side ___ of the medicine is sleepiness.", "effect", ["affect", "effort"]],
  ["How will the move ___ your family?", "affect", ["effect", "afford"]],
  ["The music had a calming ___ on the baby.", "effect", ["affect", "effort"]],
];

// Crossed items for the words that sound alike: people, things and frames multiply into a hundred items or more.

/** groupOwners are plural subjects; groupActs leave a gap for the word that owns the thing. */
const groupOwners = ["The twins", "My cousins", "The players", "Our neighbors", "The children", "The hikers"] as const;
const groupActs = ["packed ___ bags", "washed ___ hands", "found ___ seats", "fed ___ dog", "cleaned ___ rooms"] as const;
const groupStates = [
  "ready for the trip",
  "hungry after the game",
  "late for the show",
  "busy this weekend",
  "excited about the fair",
] as const;
const lostThings = ["a cat", "a letter", "a puddle", "a key", "a spider", "a note"] as const;
const lostPlaces = ["on the step", "under the mat", "by the sink", "in the box", "near the gate"] as const;
const theirCross: readonly ChoiceItem[] = [
  ...everyPair(groupOwners, groupActs).map(([who, act]): ChoiceItem => [`${who} ${act}.`, "their", ["there", "they're"]]),
  ...everyPair(groupOwners, groupStates).map(([who, state]): ChoiceItem => [`${who} said ___ ${state}.`, "they're", ["their", "there"]]),
  ...everyPair(lostThings, lostPlaces).flatMap(([thing, place]): ChoiceItem[] => [
    [`___ is ${thing} ${place}.`, "There", ["Their", "They're"]],
    [`Is ___ ${thing} ${place}?`, "there", ["their", "they're"]],
  ]),
];

const yourThings = ["coat", "ticket", "lunch", "phone", "umbrella", "library card", "homework", "scarf"] as const;
const yourFrames = ["Don't forget ___ {x}.", "Is this ___ {x}?", "Please put ___ {x} away.", "I found ___ {x} on the bus."] as const;
const youreStates = ["ready", "late", "right", "tired", "welcome", "next", "lucky", "early"] as const;
const youreFrames = ["I think ___ {x}.", "Tell me if ___ {x}.", "Mom says ___ {x}."] as const;
const toPlaces = ["the park", "the store", "school", "the beach", "the library", "the station", "the zoo", "the market"] as const;
const toFrames = ["We walked ___ {x}.", "Grandpa drove ___ {x}.", "The bus goes ___ {x}."] as const;
const tooLimits: readonly (readonly [adjective: string, verb: string])[] = [
  ["hot", "drink"],
  ["cold", "swim"],
  ["heavy", "lift"],
  ["late", "go in"],
  ["dark", "read"],
  ["tired", "play"],
  ["full", "eat more"],
  ["far", "walk"],
];
const tooFoods = ["some soup", "a sandwich", "an apple", "more rice", "a glass of milk", "some cake", "a pear", "some tea"] as const;
const twoThings = ["dogs", "sisters", "tickets", "apples", "pencils", "goals", "hours", "days"] as const;
const fill = (frame: string, x: string) => frame.replace("{x}", x);
const yourToCross: readonly ChoiceItem[] = [
  ...everyPair(yourFrames, yourThings).map(([frame, x]): ChoiceItem => [fill(frame, x), "your", ["you're", "yore"]]),
  ...everyPair(youreFrames, youreStates).map(([frame, x]): ChoiceItem => [fill(frame, x), "you're", ["your", "youre"]]),
  ...everyPair(toFrames, toPlaces).map(([frame, x]): ChoiceItem => [fill(frame, x), "to", ["too", "two"]]),
  ...tooLimits.map(([adjective, verb]): ChoiceItem => [`It is ___ ${adjective} to ${verb}.`, "too", ["to", "two"]]),
  ...tooFoods.map((food): ChoiceItem => [`I would like ${food}, ___.`, "too", ["to", "two"]]),
  ...twoThings.flatMap((x): ChoiceItem[] => [
    [`We have ___ ${x}.`, "two", ["to", "too"]],
    [`She found ___ ${x}.`, "two", ["to", "too"]],
  ]),
];

/** comparisons are two things and the word that compares them. */
const comparisons: readonly (readonly [a: string, compared: string, b: string])[] = [
  ["an elephant", "heavier", "a horse"],
  ["a mouse", "smaller", "a cat"],
  ["the sun", "hotter", "the moon"],
  ["a car", "faster", "a bike"],
  ["summer", "warmer", "winter"],
  ["a river", "longer", "a stream"],
  ["a mountain", "taller", "a hill"],
  ["a lake", "bigger", "a pond"],
  ["a rock", "harder", "a sponge"],
  ["an hour", "longer", "a minute"],
  ["a lemon", "sourer", "an orange"],
  ["a whale", "larger", "a shark"],
];
/** steps are two things done one after the other. */
const steps: readonly (readonly [first: string, second: string])[] = [
  ["finish your homework", "go outside"],
  ["wash the apples", "cut them"],
  ["read the question", "write your answer"],
  ["put on your socks", "put on your shoes"],
  ["boil the water", "add the pasta"],
  ["look both ways", "cross the street"],
  ["warm up", "start the race"],
  ["pack your bag", "check the tickets"],
  ["water the seeds", "cover the pots"],
  ["sweep the floor", "mop it"],
  ["knock on the door", "wait"],
  ["plan the story", "write the first page"],
];
const causes = ["Noise", "The weather", "Lack of sleep", "Food", "Music", "Exercise"] as const;
const touched = ["your mood", "your grades", "your health", "how you feel", "your focus"] as const;
const thenThanCross: readonly ChoiceItem[] = [
  ...comparisons.flatMap(([a, compared, b]): ChoiceItem[] => [
    [`${a[0]!.toUpperCase()}${a.slice(1)} is ${compared} ___ ${b}.`, "than", ["then", "that"]],
    [`Is ${a} ${compared} ___ ${b}?`, "than", ["then", "that"]],
  ]),
  ...steps.flatMap(([first, second]): ChoiceItem[] => [
    [`First ${first}, and ___ ${second}.`, "then", ["than", "that"]],
    [`We will ${first}, and ___ we will ${second}.`, "then", ["than", "that"]],
  ]),
  ...everyPair(causes, touched).flatMap(([cause, what]): ChoiceItem[] => [
    [`${cause} can ___ ${what}.`, "affect", ["effect", "afford"]],
    [`${cause} has a big ___ on ${what}.`, "effect", ["affect", "effort"]],
  ]),
];

/** shiftScenes are two actions at one time: lead words, the first verb in past and present, its rest, the second verb in past and present, its rest, and whether the time is past. */
const handShiftScenes: readonly (readonly [
  lead: string,
  v1: string,
  v1Now: string,
  rest1: string,
  v2: string,
  v2Now: string,
  rest2: string,
  past: boolean,
])[] = [
  ["Last week Grandpa", "fixed", "fixes", "the fence", "painted", "paints", "the gate", true],
  ["Every night my sister", "read", "reads", "a chapter", "turned", "turns", "off the light", false],
  ["Yesterday the chef", "chopped", "chops", "the onions", "stirred", "stirs", "the soup", true],
  ["Each morning the baker", "opened", "opens", "the shop", "lit", "lights", "the ovens", false],
  ["On Saturday Leo", "cleaned", "cleans", "his room", "found", "finds", "an old coin", true],
  ["Every spring the bird", "built", "builds", "a nest", "laid", "lays", "three eggs", false],
  ["Last night the dog", "heard", "hears", "a noise", "ran", "runs", "to the door", true],
  ["Each day the mail carrier", "walked", "walks", "our street", "waved", "waves", "at us", false],
  ["This morning Mom", "made", "makes", "pancakes", "sang", "sings", "a song", true],
  ["Every weekend my uncle", "drove", "drives", "to the lake", "fished", "fishes", "for hours", false],
  ["During the storm the tree", "shook", "shakes", "hard", "lost", "loses", "a branch", true],
  ["Each evening the cat", "climbed", "climbs", "onto the bed", "fell", "falls", "asleep", false],
  ["Last year our class", "planted", "plants", "a garden", "grew", "grows", "tomatoes", true],
  ["Every summer Ana", "visited", "visits", "her grandmother", "swam", "swims", "in the river", false],
  ["After lunch yesterday the teacher", "collected", "collects", "the papers", "graded", "grades", "them", true],
  ["Every Friday the coach", "blew", "blows", "the whistle", "called", "calls", "the team together", false],
  ["Two days ago the river", "rose", "rises", "quickly", "flooded", "floods", "the road", true],
  ["Each winter the bear", "ate", "eats", "a lot", "slept", "sleeps", "for months", false],
  ["On his birthday Sam", "opened", "opens", "his gifts", "thanked", "thanks", "everyone", true],
  ["Every afternoon my brother", "practiced", "practices", "the piano", "did", "does", "his homework", false],
  ["Yesterday the wind", "blew", "blows", "all day", "knocked", "knocks", "over our fence", true],
];
/** shiftTimes are a time and whether it is past; shiftPeople do two things at that time. */
const shiftTimes: readonly (readonly [string, boolean])[] = [
  ["Last week", true],
  ["Every morning", false],
  ["Yesterday", true],
  ["Each weekend", false],
  ["On Saturday", true],
  ["Every evening", false],
  ["Last night", true],
  ["Every day", false],
];
const shiftPeople = ["Tom", "my aunt", "our neighbor", "Grandma", "the coach"] as const;
/** shiftActs are two things done one after the other, each in the past and the present, with its rest. */
const shiftActs: readonly (readonly [string, string, string, string, string, string])[] = [
  ["walked", "walks", "to the park", "fed", "feeds", "the ducks"],
  ["cooked", "cooks", "dinner", "washed", "washes", "the dishes"],
  ["read", "reads", "the news", "drank", "drinks", "a coffee"],
  ["watered", "waters", "the plants", "swept", "sweeps", "the porch"],
  ["called", "calls", "a friend", "talked", "talks", "for an hour"],
  ["wrote", "writes", "a letter", "posted", "posts", "it"],
  ["went", "goes", "to the market", "bought", "buys", "some fruit"],
  ["took", "takes", "the bus", "met", "meets", "a friend downtown"],
];

/** shiftScenes are the hand-written scenes and one for every time, person and pair of acts. */
const shiftScenes: typeof handShiftScenes = [
  ...handShiftScenes,
  ...everyPair(everyPair(shiftTimes, shiftPeople), shiftActs).map(
    ([[[time, past], who], [v1, v1Now, r1, v2, v2Now, r2]]) => [`${time} ${who}`, v1, v1Now, r1, v2, v2Now, r2, past] as const,
  ),
];
const shiftForms = ([lead, v1, v1Now, r1, v2, v2Now, r2, past]: (typeof shiftScenes)[number]) => {
  const [a1, a2, b1, b2] = past ? [v1, v2, v1Now, v2Now] : [v1Now, v2Now, v1, v2];
  return {
    right: `${lead} ${a1} ${r1} and ${a2} ${r2}.`,
    secondShifted: `${lead} ${a1} ${r1} and ${b2} ${r2}.`,
    firstShifted: `${lead} ${b1} ${r1} and ${a2} ${r2}.`,
    bothShifted: `${lead} ${b1} ${r1} and ${b2} ${r2}.`,
  };
};
const shiftMore: readonly ChoiceItem[] = shiftScenes.map((scene) => {
  const f = shiftForms(scene);
  return ["Which sentence keeps its verbs in the same time?", f.right, [f.secondShifted, f.firstShifted]];
});
const shiftFixMore: readonly TypedItem[] = shiftScenes.map((scene, i) => {
  const f = shiftForms(scene);
  const shown = i % 2 === 0 ? f.secondShifted : f.firstShifted;
  return fixed(shown, f.right, shown, f.bothShifted);
});

/** usageTopics are the topics of usage: comparing, possessives, words that sound alike, and keeping tense. */
export const usageTopics: readonly TopicDef[] = [
  {
    id: "comparatives-and-superlatives",
    title: t("Comparatives and Superlatives", "比较级和最高级"),
    summary: t(
      "Compare two things with -er or more, and three or more with -est or most.",
      "用 -er 或 more 比较两者，用 -est 或 most 比较三者及以上。",
    ),
    prerequisites: ["adjectives-and-adverbs"],
    encompasses: [{ topic: "adjectives-and-adverbs", weight: 0.2 }],
    xp: 10,
    knowledgePoints: [
      point(
        "er-and-est",
        t("Adding -er and -est", "加 -er 和 -est"),
        t(
          "To compare **two** things, add *-er* to a short adjective: *tall, taller*. To compare **three or more**, add *-est*: *tallest*.\n\nSpelling changes: a final *e* is dropped (*large, larger*); a final *y* after a consonant becomes *i* (*happy, happier*); a short word ending in one vowel and one consonant doubles the consonant (*big, bigger*; *hot, hottest*).",
          "比较**两个**事物时，在短形容词后加 *-er*：*tall, taller*。比较**三个或更多**时，加 *-est*：*tallest*。\n\n拼写变化：词尾的 *e* 去掉（*large, larger*）；辅音后的 *y* 变成 *i*（*happy, happier*）；以“一个元音加一个辅音”结尾的短词要双写辅音（*big, bigger*；*hot, hottest*）。",
        ),
        typedGenerator(
          "word-form",
          t("Write the form of the adjective that fits.", "写出符合要求的形容词形式。"),
          [...erEstBank, ...erEstMore],
          (right, shown) =>
            t(
              `**${right}**. ${shown.includes("comparing two") ? "Two things are compared, so the word takes the -er form, with any spelling change." : "One stands out from a whole group, so the word takes the -est form, with any spelling change."}`,
              `**${right}**。${shown.includes("comparing two") ? "比较的是两个事物，所以用 -er 形式，并注意拼写变化。" : "从一组中突出一个，所以用 -est 形式，并注意拼写变化。"}`,
            ),
        ),
      ),
      point(
        "more-and-most",
        t("More and Most", "more 和 most"),
        t(
          "Most adjectives of three or more syllables, and many of two, do not take *-er* or *-est*. Use *more* for two things and *most* for three or more: *more difficult*, *the most careful*.\n\nNever use both: *more heavier* and *most kindest* are wrong.",
          "大多数三个或更多音节的形容词，以及许多两个音节的形容词，不加 *-er* 或 *-est*。比较两者用 *more*，三者及以上用 *most*：*more difficult*、*the most careful*。\n\n两者不能同时使用：*more heavier* 和 *most kindest* 都是错的。",
        ),
        choiceGenerator(
          t("Which words complete the sentence?", "哪个选项能补全句子？"),
          [...moreMostBank, ...moreMostMore],
          (right, shown) =>
            right.startsWith("more ")
              ? t(
                  `${shown.replace("___", `**${right}**`)} A long adjective takes *more*, not *-er*, and *more* is right because only two things are compared.`,
                  `${shown.replace("___", `**${right}**`)} 长形容词用 *more*，不加 *-er*；这里只比较两个事物，所以用 *more*。`,
                )
              : t(
                  `${shown.replace("___", `**${right}**`)} A long adjective takes *most*, not *-est*, and *most* is right because one stands out from a group of three or more.`,
                  `${shown.replace("___", `**${right}**`)} 长形容词用 *most*，不加 *-est*；这里是从三个或更多之中突出一个，所以用 *most*。`,
                ),
          moreMostFeedback,
        ),
      ),
      point(
        "irregular-and-double",
        t("Irregular Forms and Doubled Comparisons", "不规则形式和重复比较"),
        t(
          "A few common words change completely: *good, better, best*; *bad, worse, worst*; *far, farther, farthest*; *little, less, least*; *much* or *many, more, most*. The adverb *well* also becomes *better* and *best*.\n\nUse one way of comparing, not two: *heavier*, not *more heavier*.",
          "少数常用词的形式完全改变：*good, better, best*；*bad, worse, worst*；*far, farther, farthest*；*little, less, least*；*much* 或 *many, more, most*。副词 *well* 也变成 *better* 和 *best*。\n\n只用一种比较方式，不能重复：*heavier*，而不是 *more heavier*。",
        ),
        choiceGenerator(
          t("Choose the correct form.", "选择正确的形式。"),
          [...irregularBank, ...doubleBank, ...irregularMore],
          (right, shown) =>
            shown.includes("___")
              ? t(
                  `${shown.replace("___", `**${right}**`)} This word has an irregular form.`,
                  `${shown.replace("___", `**${right}**`)} 这个词的比较形式是不规则的。`,
                )
              : t(
                  `**${right}** It compares in one way only, with the right form for the number of things.`,
                  `**${right}** 只用一种比较方式，并且形式符合比较对象的数量。`,
                ),
          irregularOrDoubled,
        ),
      ),
    ],
  },
  {
    id: "apostrophes-and-possessives",
    title: t("Apostrophes and Possessives", "撇号和所有格"),
    summary: t("Show who owns something with an apostrophe, and tell its from it's.", "用撇号表示所属，并区分 its 和 it's。"),
    prerequisites: ["nouns-and-pronouns"],
    encompasses: [{ topic: "nouns-and-pronouns", weight: 0.2 }],
    xp: 10,
    knowledgePoints: [
      point(
        "singular-possessive",
        t("One Owner", "一个所有者"),
        t(
          "To show that something belongs to one person or thing, add **'s**: *the dog's bone*, *Maria's book*. Add *'s* even when the name ends in *s*: *James's hat*.\n\nA plain *s* with no apostrophe makes a plural, not a possessive: *two dogs*.",
          "表示某物属于一个人或一个事物时，加 **'s**：*the dog's bone*、*Maria's book*。即使名字以 *s* 结尾，也加 *'s*：*James's hat*。\n\n只加 *s* 不加撇号是复数，不是所有格：*two dogs*。",
        ),
        typedGenerator(
          "word-form",
          t("Write the possessive word, such as dog's.", "写出所有格形式，例如 dog's。"),
          [...singularPossessiveBank, ...singularPossessiveMore],
          (right) =>
            t(
              `**${right}**. There is one owner, so the word takes an apostrophe and then *s*, even after a final *s*.`,
              `**${right}**。所有者只有一个，所以加撇号再加 *s*，即使词尾已经是 *s* 也一样。`,
            ),
        ),
      ),
      point(
        "plural-possessive",
        t("Several Owners", "多个所有者"),
        t(
          "When the owners are a plural that ends in *s*, add only an apostrophe after it: *the girls' coats*, *the foxes' den*.\n\nWhen the plural does not end in *s*, add **'s** as for one owner: *the children's toys*, *the women's shoes*.",
          "所有者是以 *s* 结尾的复数时，只在后面加撇号：*the girls' coats*、*the foxes' den*。\n\n复数不以 *s* 结尾时，像单个所有者一样加 **'s**：*the children's toys*、*the women's shoes*。",
        ),
        typedGenerator(
          "word-form",
          t("Write the possessive word, such as girls'.", "写出所有格形式，例如 girls'。"),
          [...pluralPossessiveBank, ...pluralPossessiveMore],
          (right) =>
            t(
              right.endsWith("s'")
                ? `**${right}**. The plural already ends in *s*, so only an apostrophe follows.`
                : `**${right}**. The plural does not end in *s*, so it takes *'s*.`,
              right.endsWith("s'") ? `**${right}**。复数已经以 *s* 结尾，所以只加撇号。` : `**${right}**。复数不以 *s* 结尾，所以加 *'s*。`,
            ),
        ),
      ),
      point(
        "its-and-its",
        t("Its and It's", "its 和 it's"),
        t(
          "*It's* is short for *it is* or *it has*: *It's raining.* *Its* shows ownership, like *his* and *her*, and has no apostrophe: *The dog wagged its tail.*\n\nTest it: if *it is* or *it has* fits, write *it's*.",
          "*It's* 是 *it is* 或 *it has* 的缩写：*It's raining.* *Its* 表示所属，就像 *his* 和 *her* 一样，没有撇号：*The dog wagged its tail.*\n\n检验方法：如果换成 *it is* 或 *it has* 讲得通，就写 *it's*。",
        ),
        choiceGenerator(
          t("Which word completes the sentence?", "哪个词能补全句子？"),
          [...itsBank, ...itsMore],
          (right, shown) =>
            t(
              `${shown.replace("___", `**${right}**`)} ${right.toLowerCase() === "it's" ? "*It is* or *it has* fits here." : "The word shows ownership, so it has no apostrophe."}`,
              `${shown.replace("___", `**${right}**`)} ${right.toLowerCase() === "it's" ? "这里可以换成 *it is* 或 *it has*。" : "这个词表示所属，所以没有撇号。"}`,
            ),
          confusedWord,
        ),
      ),
    ],
  },
  {
    id: "commonly-confused-words",
    title: t("Commonly Confused Words", "常见易混词"),
    summary: t(
      "Words that sound alike: there, their and they're; your and you're; to, too and two; then and than.",
      "发音相近的词：there、their 和 they're；your 和 you're；to、too 和 two；then 和 than。",
    ),
    prerequisites: ["nouns-and-pronouns"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      point(
        "there-their-theyre",
        t("There, Their and They're", "there、their 和 they're"),
        t(
          "*Their* shows ownership: *their bags*. *There* names a place or begins a sentence such as *There are three apples*. *They're* is short for *they are*.\n\nTest it: if *they are* fits, write *they're*; if the word owns a noun after it, write *their*.",
          "*Their* 表示所属：*their bags*。*There* 表示地点，或用于 *There are three apples* 这样的句子开头。*They're* 是 *they are* 的缩写。\n\n检验方法：如果换成 *they are* 讲得通，就写 *they're*；如果这个词后面跟着它所拥有的名词，就写 *their*。",
        ),
        choiceGenerator(
          t("Which word completes the sentence?", "哪个词能补全句子？"),
          [...theirBank, ...theirMore, ...theirCross],
          (right, shown) =>
            t(
              `${shown.replace("___", `**${right}**`)} ${right.toLowerCase() === "their" ? "It shows ownership." : right.toLowerCase() === "there" ? "It names a place or begins the sentence." : "It means *they are*."}`,
              `${shown.replace("___", `**${right}**`)} ${right.toLowerCase() === "their" ? "它表示所属。" : right.toLowerCase() === "there" ? "它表示地点或用于句首。" : "它的意思是 *they are*。"}`,
            ),
          confusedWord,
        ),
      ),
      point(
        "your-to-too-two",
        t("Your, You're, To, Too and Two", "your、you're、to、too 和 two"),
        t(
          "*Your* shows ownership: *your jacket*. *You're* is short for *you are*.\n\n*Two* is the number 2. *Too* means *also* or *more than enough*: *too hot*. *To* is used everywhere else: *to the store*, *to eat*.",
          "*Your* 表示所属：*your jacket*。*You're* 是 *you are* 的缩写。\n\n*Two* 是数字 2。*Too* 的意思是“也”或“太”：*too hot*。其他情况都用 *to*：*to the store*、*to eat*。",
        ),
        choiceGenerator(
          t("Which word completes the sentence?", "哪个词能补全句子？"),
          [...yourToBank, ...yourToMore, ...yourToCross],
          (right, shown) =>
            t(
              `${shown.replace("___", `**${right}**`)} ${{ your: "It shows ownership.", "you're": "It means *you are*.", two: "It is the number 2.", too: "It means *also* or *more than enough*.", to: "It is neither the number nor *also*." }[right.toLowerCase()] ?? ""}`,
              `${shown.replace("___", `**${right}**`)} ${{ your: "它表示所属。", "you're": "它的意思是 *you are*。", two: "它是数字 2。", too: "它的意思是“也”或“太”。", to: "它既不是数字，也不表示“也”。" }[right.toLowerCase()] ?? ""}`,
            ),
          confusedWord,
        ),
      ),
      point(
        "then-than-affect-effect",
        t("Then and Than, Affect and Effect", "then 和 than，affect 和 effect"),
        t(
          "*Than* compares: *older than me*. *Then* tells when: *and then we left*.\n\n*Affect* is usually a verb, to change something: *Does the weather affect you?* *Effect* is usually a noun, the result: *The medicine had an effect.* If *a*, *an* or *the* can come before it, it is the noun *effect*.",
          "*Than* 用于比较：*older than me*。*Then* 表示时间：*and then we left*。\n\n*Affect* 通常是动词，意思是影响某事物：*Does the weather affect you?* *Effect* 通常是名词，意思是结果：*The medicine had an effect.* 如果前面能加 *a*、*an* 或 *the*，就是名词 *effect*。",
        ),
        choiceGenerator(
          t("Which word completes the sentence?", "哪个词能补全句子？"),
          [...thenThanBank, ...thenThanMore, ...thenThanCross],
          (right, shown) =>
            t(
              `${shown.replace("___", `**${right}**`)} ${thenThanWhy.get(right)?.en ?? ""}`,
              `${shown.replace("___", `**${right}**`)} ${thenThanWhy.get(right)?.["zh-CN"] ?? ""}`,
            ),
          confusedWord,
        ),
      ),
    ],
  },
  {
    id: "verb-tense-consistency",
    title: t("Keeping Verb Tense Consistent", "保持动词时态一致"),
    summary: t(
      "Keep the verbs of a sentence in the same time unless the time really changes.",
      "除非时间真的改变，句子中的动词要保持同一时态。",
    ),
    prerequisites: ["simple-verb-tenses"],
    encompasses: [{ topic: "simple-verb-tenses", weight: 0.3 }],
    xp: 10,
    knowledgePoints: [
      point(
        "spotting-shifts",
        t("Spotting a Shift", "找出时态的转换"),
        t(
          "When the actions of a sentence happen at the same time, their verbs stay in the same tense. *She opened the door and sees a cat* jumps from past to present for no reason.\n\nA change is right only when the time really changes: *I lived here before, but now I live in town.*",
          "句子中的动作发生在同一时间时，动词要保持同一时态。*She opened the door and sees a cat* 无缘无故地从过去时跳到了现在时。\n\n只有时间真的改变时，时态才可以改变：*I lived here before, but now I live in town.*",
        ),
        choiceGenerator(
          t("Choose the sentence.", "选择句子。"),
          [...shiftBank, ...shiftMore],
          (right) =>
            t(
              `**${right}** Both actions happen at the same time, so their verbs share a tense.`,
              `**${right}** 两个动作发生在同一时间，所以动词时态相同。`,
            ),
          tenseShift,
        ),
      ),
      point(
        "fixing-shifts",
        t("Fixing a Shift", "改正时态的转换"),
        t(
          "Find the words that tell the time, such as *yesterday* or *last week*. Then change the verb that does not match so that every verb agrees with that time. Many common verbs have irregular past forms: *see, saw*; *catch, caught*; *give, gave*.",
          "找出表示时间的词，例如 *yesterday* 或 *last week*。然后改动不一致的动词，使每个动词都符合那个时间。许多常用动词的过去式是不规则的：*see, saw*；*catch, caught*；*give, gave*。",
        ),
        typedGenerator(
          "sentence",
          t("Rewrite the sentence so its verbs agree in tense.", "改写句子，使动词时态一致。"),
          [...shiftFixBank, ...shiftFixMore],
          (right) =>
            t(`**${right}** The time is past, so the second verb is past as well.`, `**${right}** 时间是过去，所以第二个动词也用过去时。`),
        ),
      ),
    ],
  },
];
