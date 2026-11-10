// Grammar: what a sentence is made of, up to its verbs and agreement.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, typed, typedGenerator } from "@ga/subject-english";

const subjectBank: readonly ChoiceItem[] = [
  ["The tired farmer fed the horses.", "The tired farmer", ["fed the horses", "the horses"]],
  ["My older sister plays the trumpet.", "My older sister", ["plays the trumpet", "the trumpet"]],
  ["A cold wind blew across the lake.", "A cold wind", ["blew across the lake", "the lake"]],
  ["Three small boats drifted past the dock.", "Three small boats", ["drifted past the dock", "the dock"]],
  ["Our new neighbor baked bread for everyone.", "Our new neighbor", ["baked bread for everyone", "bread"]],
  ["The red kite tangled in the branches.", "The red kite", ["tangled in the branches", "the branches"]],
  ["Dr. Patel checked the patient's chart.", "Dr. Patel", ["checked the patient's chart", "the patient's chart"]],
  ["Wild rabbits live under the old shed.", "Wild rabbits", ["live under the old shed", "the old shed"]],
  ["The heavy door closed behind them.", "The heavy door", ["closed behind them", "them"]],
  ["Every student in the class voted.", "Every student in the class", ["voted", "the class"]],
];

const predicateBank: readonly ChoiceItem[] = [
  ["The hungry puppy chewed my shoe.", "chewed my shoe", ["The hungry puppy", "my shoe"]],
  ["Lena painted a mural on the wall.", "painted a mural on the wall", ["Lena", "a mural"]],
  ["The old clock stopped at noon.", "stopped at noon", ["The old clock", "noon"]],
  ["Two geese landed on the pond.", "landed on the pond", ["Two geese", "the pond"]],
  ["My uncle fixes bicycles in his garage.", "fixes bicycles in his garage", ["My uncle", "bicycles"]],
  ["The bright stars appeared after sunset.", "appeared after sunset", ["The bright stars", "sunset"]],
  ["The baker sold the last loaf.", "sold the last loaf", ["The baker", "the last loaf"]],
  ["A small crowd waited outside the theater.", "waited outside the theater", ["A small crowd", "the theater"]],
  ["The river flooded the lower fields.", "flooded the lower fields", ["The river", "the lower fields"]],
  ["Our team practiced before the game.", "practiced before the game", ["Our team", "the game"]],
];

const movedSubjectBank: readonly ChoiceItem[] = [
  ["After lunch, the students returned to class.", "the students", ["lunch", "class"]],
  ["Under the bridge, a heron waited for fish.", "a heron", ["the bridge", "fish"]],
  ["During the storm, the lights went out.", "the lights", ["the storm", "out"]],
  ["In the morning, my brother walks the dog.", "my brother", ["the morning", "the dog"]],
  ["Behind the barn, the children built a fort.", "the children", ["the barn", "a fort"]],
  ["Across the street, a new shop opened.", "a new shop", ["the street", "opened"]],
  ["Without a map, the hikers lost the trail.", "the hikers", ["a map", "the trail"]],
  ["Near the door, a wet umbrella dripped.", "a wet umbrella", ["the door", "dripped"]],
  ["Before dinner, the twins set the table.", "the twins", ["dinner", "the table"]],
  ["At the end of the race, the runners rested.", "the runners", ["the race", "the end"]],
];

const nounBank: readonly ChoiceItem[] = [
  ["The quiet library opened late.", "library", ["quiet", "opened", "late"]],
  ["She carefully wrapped the gift.", "gift", ["She", "carefully", "wrapped"]],
  ["We quickly crossed the bridge.", "bridge", ["We", "quickly", "crossed"]],
  ["The brave firefighter climbed down.", "firefighter", ["brave", "climbed", "down"]],
  ["They sang loudly at the concert.", "concert", ["They", "sang", "loudly"]],
  ["His honesty surprised me.", "honesty", ["His", "surprised", "me"]],
  ["The sleepy kitten purred softly.", "kitten", ["sleepy", "purred", "softly"]],
  ["Nobody saw the bright comet.", "comet", ["Nobody", "saw", "bright"]],
  ["I felt great joy today.", "joy", ["I", "felt", "great"]],
  ["The tall trees swayed gently.", "trees", ["tall", "swayed", "gently"]],
];

const pronounBank: readonly ChoiceItem[] = [
  ["Sam lost the keys, but he found them later.", "them", ["keys", "lost", "later"]],
  ["The girls waved when they saw the bus.", "they", ["girls", "waved", "bus"]],
  ["Nina called us from the station.", "us", ["Nina", "called", "station"]],
  ["The cat licked its paw.", "its", ["cat", "licked", "paw"]],
  ["Our teacher gave me a new book.", "me", ["teacher", "gave", "book"]],
  ["The boys said the idea was theirs.", "theirs", ["boys", "said", "idea"]],
  ["Mara thanked her coach.", "her", ["Mara", "thanked", "coach"]],
  ["When the bell rang, it startled the dog.", "it", ["bell", "rang", "dog"]],
  ["You left the gate open.", "You", ["left", "gate", "open"]],
  ["The workers ate lunch, and then they went home.", "they", ["workers", "lunch", "home"]],
];

const pronounFormBank: readonly ChoiceItem[] = [
  ["Marcus is late, so ___ will miss the bus.", "he", ["him", "his"]],
  ["Please give the letter to ___. (Ana)", "her", ["she", "hers"]],
  ["My friends and ___ went to the park.", "I", ["me", "my"]],
  ["The coach praised Theo and ___.", "me", ["I", "mine"]],
  ["The dogs wagged ___ tails.", "their", ["them", "they"]],
  ["___ are going to the museum on Friday. (my class and I)", "We", ["Us", "Our"]],
  ["Aunt Rosa invited ___ to dinner. (my family and me)", "us", ["we", "our"]],
  ["The robot lifted ___ arm.", "its", ["it", "it's"]],
  ["Jin and ___ wrote the report. (Priya)", "she", ["her", "hers"]],
  ["This coat belongs to Omar, so it is ___.", "his", ["he", "him"]],
];

const fragmentChoices = ["Complete sentence", "Fragment"];
const judge = (s: string, complete: boolean): ChoiceItem => [s, fragmentChoices[complete ? 0 : 1]!, [fragmentChoices[complete ? 1 : 0]!]];

const missingPartBank: readonly ChoiceItem[] = [
  judge("The small boat near the shore.", false),
  judge("The small boat rocked near the shore.", true),
  judge("Ran all the way to school.", false),
  judge("Tess ran all the way to school.", true),
  judge("My favorite song on the radio.", false),
  judge("My favorite song played on the radio.", true),
  judge("Jumped over the fence and kept going.", false),
  judge("The horse jumped over the fence.", true),
  judge("A box of old photographs in the attic.", false),
  judge("We found old photographs in the attic.", true),
];

const clauseFragmentBank: readonly ChoiceItem[] = [
  judge("Because the road was closed.", false),
  judge("The road was closed.", true),
  judge("When the rain finally stopped.", false),
  judge("When the rain finally stopped, we went out.", true),
  judge("Although she practiced every day.", false),
  judge("She practiced every day.", true),
  judge("If you see my brother.", false),
  judge("If you see my brother, tell him to call.", true),
  judge("Since the store opened last year.", false),
  judge("We left because the store closed.", true),
];

const fixFragmentBank: readonly ChoiceItem[] = [
  [
    "The tall man in the green coat.",
    "The tall man in the green coat waved.",
    ["The tall man and the green coat.", "Tall man in the green coat."],
  ],
  ["Sang in the school play.", "Lucia sang in the school play.", ["Singing in the school play.", "Sang in the play at school."]],
  [
    "Because it was too cold.",
    "We stayed inside because it was too cold.",
    ["Because it was much too cold.", "Because of it was too cold."],
  ],
  [
    "A jar of honey on the shelf.",
    "A jar of honey sat on the shelf.",
    ["A jar of honey sitting on the shelf.", "A jar on the shelf of honey."],
  ],
  ["After the game ended.", "After the game ended, we went home.", ["After the game ended today.", "After the game and the end."]],
  [
    "Barked at the mail carrier.",
    "The dog barked at the mail carrier.",
    ["Barking at the mail carrier.", "Barked at the mail carrier again."],
  ],
  ["When the bell rings.", "When the bell rings, line up at the door.", ["When the bell rings loudly.", "When the bell and the door."]],
  ["The last slice of pizza.", "Dad ate the last slice of pizza.", ["The very last slice of pizza.", "The last slice of the pizza."]],
];

const tenseBank: readonly ChoiceItem[] = [
  ["Yesterday, we ___ a movie.", "watched", ["watch", "will watch"]],
  ["Tomorrow, the class ___ the museum.", "will visit", ["visited", "visits"]],
  ["Every morning, my dad ___ coffee.", "makes", ["made", "will make"]],
  ["Last week, the team ___ two games.", "played", ["plays", "will play"]],
  ["Next year, my sister ___ college.", "will start", ["started", "starts"]],
  ["In summer, the sun usually ___ at six.", "rises", ["rose", "will rise"]],
  ["Last night, I ___ my homework.", "finished", ["finish", "will finish"]],
  ["In two days, they ___ home.", "will return", ["returned", "return"]],
  ["Each spring, the birds ___ north.", "fly", ["flew", "will fly"]],
  ["Two years ago, she ___ to Canada.", "moved", ["moves", "will move"]],
];

const irregularBank = [
  typed("Today I go. Yesterday I ___.", "went", ["goed", "gone"]),
  typed("Today we run. Yesterday we ___.", "ran", ["runned", "run"]),
  typed("Today she writes. Yesterday she ___.", "wrote", ["writed", "written"]),
  typed("Today they eat. Yesterday they ___.", "ate", ["eated", "eaten"]),
  typed("Today he brings. Yesterday he ___.", "brought", ["bringed", "brang"]),
  typed("Today I think. Yesterday I ___.", "thought", ["thinked", "thoght"]),
  typed("Today we swim. Yesterday we ___.", "swam", ["swimmed", "swum"]),
  typed("Today the bell rings. Yesterday the bell ___.", "rang", ["ringed", "rung"]),
  typed("Today you catch. Yesterday you ___.", "caught", ["catched", "cought"]),
  typed("Today the water freezes. Yesterday the water ___.", "froze", ["freezed", "frozen"]),
];

const agreementBank: readonly ChoiceItem[] = [
  ["The dog ___ at strangers.", "barks", ["bark"]],
  ["The dogs ___ at strangers.", "bark", ["barks"]],
  ["My brother ___ the piano.", "plays", ["play"]],
  ["These apples ___ sweet.", "taste", ["tastes"]],
  ["She ___ to school.", "walks", ["walk"]],
  ["They ___ near the river.", "live", ["lives"]],
  ["The teacher ___ the answer.", "knows", ["know"]],
  ["The children ___ a story.", "want", ["wants"]],
  ["He ___ his lunch every day.", "packs", ["pack"]],
  ["Birds ___ nests in spring.", "build", ["builds"]],
];

const hardAgreementBank: readonly ChoiceItem[] = [
  ["The box of crayons ___ on the desk.", "is", ["are"]],
  ["The keys to the car ___ missing.", "are", ["is"]],
  ["One of the students ___ absent.", "is", ["are"]],
  ["The flowers in the vase ___ wilting.", "are", ["is"]],
  ["Tom and Ana ___ the same bus.", "ride", ["rides"]],
  ["A bowl of cherries ___ on the table.", "sits", ["sit"]],
  ["The sound of the waves ___ me calm.", "keeps", ["keep"]],
  ["My cousin and her friends ___ soccer.", "play", ["plays"]],
  ["The pages of this book ___ torn.", "are", ["is"]],
  ["The leader of the hikers ___ the map.", "carries", ["carry"]],
];

const antecedentBank: readonly ChoiceItem[] = [
  ["The students opened ___ books.", "their", ["his", "its"]],
  ["The company lowered ___ prices.", "its", ["their", "his"]],
  ["Maria forgot ___ jacket.", "her", ["their", "its"]],
  ["The bird fed ___ chicks.", "its", ["their", "them"]],
  ["The players shook ___ opponents' hands.", "their", ["its", "her"]],
  ["Ben lost ___ pencil.", "his", ["their", "its"]],
  ["The trees dropped ___ leaves.", "their", ["its", "his"]],
  ["The team won ___ final game.", "its", ["his", "her"]],
  ["The sisters shared ___ snacks.", "their", ["her", "its"]],
  ["The river overflowed ___ banks.", "its", ["their", "his"]],
];

const clearReferenceBank: readonly ChoiceItem[] = [
  [
    "Which sentence makes it clear who was late?",
    'Jon told Eli, "I am late."',
    ["Jon told Eli that he was late.", "Jon and Eli said he was late."],
  ],
  [
    "Which sentence makes it clear what broke?",
    "The vase broke when I set it on the table.",
    ["When I set the vase on the table, it broke.", "The vase and the table: it broke."],
  ],
  [
    "Which sentence makes it clear who won?",
    "Ella won when she played against Grace.",
    ["When Ella played Grace, she won.", "Ella played Grace and she won."],
  ],
  [
    "Which sentence makes it clear what was heavy?",
    "I took the box off the shelf because the box was heavy.",
    ["I took the box off the shelf because it was heavy.", "The box and the shelf, it was heavy."],
  ],
  [
    "Which sentence makes it clear who was angry?",
    "Rosa was angry when she spoke to Mia.",
    ["When Rosa spoke to Mia, she was angry.", "Rosa spoke to Mia, and she was angry."],
  ],
  [
    "Which sentence makes it clear what needed cleaning?",
    "Clean the bowl after you take the fruit out of it.",
    ["Take the fruit out of the bowl and clean it.", "Take it out of the bowl and clean it."],
  ],
  [
    "Which sentence makes it clear who needed help?",
    "Kai needed help, so he called Noah.",
    ["Kai called Noah because he needed help.", "When Kai called Noah, he needed help."],
  ],
  [
    "Which sentence makes it clear what was new?",
    "The bike was new, and it hit the car.",
    ["The bike hit the car, and it was new.", "When the bike hit the car, it was new."],
  ],
];

/** entry returns the entry of a feedback table, failing loudly when a bank uses an option the table does not cover. */
function entry<V>(table: Readonly<Record<string, V>>, key: string): V {
  const found = table[key];
  if (found === undefined) throw new Error(`no feedback for the option "${key}"`);
  return found;
}

type WordClass = "noun" | "verb" | "adjective" | "adverb" | "pronoun";

const wordClass: Readonly<Record<string, WordClass>> = {
  quiet: "adjective",
  opened: "verb",
  late: "adverb",
  She: "pronoun",
  carefully: "adverb",
  wrapped: "verb",
  We: "pronoun",
  quickly: "adverb",
  crossed: "verb",
  brave: "adjective",
  climbed: "verb",
  down: "adverb",
  They: "pronoun",
  sang: "verb",
  loudly: "adverb",
  His: "pronoun",
  surprised: "verb",
  me: "pronoun",
  sleepy: "adjective",
  purred: "verb",
  softly: "adverb",
  Nobody: "pronoun",
  saw: "verb",
  bright: "adjective",
  I: "pronoun",
  felt: "verb",
  great: "adjective",
  tall: "adjective",
  swayed: "verb",
  gently: "adverb",
  keys: "noun",
  lost: "verb",
  later: "adverb",
  girls: "noun",
  waved: "verb",
  bus: "noun",
  Nina: "noun",
  called: "verb",
  station: "noun",
  cat: "noun",
  licked: "verb",
  paw: "noun",
  teacher: "noun",
  gave: "verb",
  book: "noun",
  boys: "noun",
  said: "verb",
  idea: "noun",
  Mara: "noun",
  thanked: "verb",
  coach: "noun",
  bell: "noun",
  rang: "verb",
  dog: "noun",
  left: "verb",
  gate: "noun",
  open: "adjective",
  workers: "noun",
  lunch: "noun",
  home: "adverb",
};

const classMeaning: Readonly<Record<WordClass, readonly [en: string, zh: string]>> = {
  noun: ["names a person, place or thing directly", "直接为人、地点或事物命名"],
  verb: ["shows an action, so it is a verb", "表示动作，所以是动词"],
  adjective: ["describes a noun, so it is an adjective", "描述名词，所以是形容词"],
  adverb: ["tells how, when or where something happens, so it is an adverb", "说明事情怎样、何时或在哪里发生，所以是副词"],
  pronoun: ["stands in for a noun, so it is a pronoun", "代替名词，所以是代词"],
};

const notNoun = (wrong: string) => {
  const [en, zh] = classMeaning[entry(wordClass, wrong)];
  return t(
    `“${wrong}” ${en}. A noun names a person, place, thing or idea itself; try putting *the* in front of the word.`,
    `“${wrong}” ${zh}。名词本身为人、地点、事物或概念命名；试试在词前加 *the*。`,
  );
};

const notPronoun = (wrong: string) => {
  const [en, zh] = classMeaning[entry(wordClass, wrong)];
  return t(
    `“${wrong}” ${en}. A pronoun is a short word such as *he* or *them* that takes the place of a noun.`,
    `“${wrong}” ${zh}。代词是 *he*、*them* 这类代替名词的短词。`,
  );
};

type PronounForm = "subject" | "object" | "owner" | "it" | "contraction";

const pronounForm: Readonly<Record<string, PronounForm>> = {
  he: "subject",
  she: "subject",
  i: "subject",
  we: "subject",
  they: "subject",
  him: "object",
  her: "object",
  me: "object",
  them: "object",
  us: "object",
  his: "owner",
  hers: "owner",
  my: "owner",
  mine: "owner",
  our: "owner",
  it: "it",
  "it's": "contraction",
};

const formFeedback: Readonly<Record<PronounForm, (wrong: string) => readonly [en: string, zh: string]>> = {
  subject: (w) => [
    `“${w}” is the form for the one doing the action, before a verb. Try the pronoun alone in the sentence to hear whether that is its job here.`,
    `“${w}” 是动作发出者的形式，用在动词前。把代词单独放进句子里读一读，听听它在这里是不是这个作用。`,
  ],
  object: (w) => [
    `“${w}” is the form used after a verb or a word like *to*. Try the pronoun alone in the sentence to hear whether that is its job here.`,
    `“${w}” 是用在动词或 *to* 之类的词后面的形式。把代词单独放进句子里读一读，听听它在这里是不是这个作用。`,
  ],
  owner: (w) => [
    `“${w}” shows ownership. Ask whether the word in the gap owns something here, or acts or receives the action.`,
    `“${w}” 表示所属。想一想空格里的词在这里是拥有某物，还是发出或承受动作。`,
  ],
  it: (w) => [
    `“${w}” names a thing itself; it cannot show that something belongs to that thing.`,
    `“${w}” 指事物本身，不能表示某物属于它。`,
  ],
  contraction: (w) => [
    `“${w}” is short for *it is*. Read the sentence with *it is* in the gap and hear whether it makes sense.`,
    `“${w}” 是 *it is* 的缩写。把 *it is* 放进空格读一读，看看是否说得通。`,
  ],
};

const notThisForm = (wrong: string) => {
  const [en, zh] = formFeedback[entry(pronounForm, wrong.toLowerCase())](wrong);
  return t(en, zh);
};

const fragmentLabelFeedback: Readonly<Record<string, readonly [en: string, zh: string]>> = {
  "Complete sentence": [
    "A complete sentence needs both a subject and a predicate. Ask who or what this is about, and what that person or thing does: one of the two answers is missing.",
    "完整句需要主语和谓语。问一问这句话谈的是谁或什么，那个人或物做了什么：其中一个答案找不到。",
  ],
  Fragment: [
    "A fragment is missing a subject or a predicate. Ask who or what this is about, and what that person or thing does: check whether both answers are there.",
    "片段缺少主语或谓语。问一问这句话谈的是谁或什么，那个人或物做了什么：检查两个答案是否都在。",
  ],
};

const clauseLabelFeedback: Readonly<Record<string, readonly [en: string, zh: string]>> = {
  "Complete sentence": [
    "A subject and a verb are not enough. A group of words that begins with a word like *because* or *when* leaves the reader waiting unless a complete thought goes with it.",
    "有主语和动词还不够。以 *because* 或 *when* 这类词开头的一组词，如果没有接上完整的意思，读者就仍在等待。",
  ],
  Fragment: [
    "A word like *when* makes a fragment only when nothing completes the thought. Check whether a complete part follows it, or whether the words begin with such a word at all.",
    "*when* 这类词只有在没有接上完整意思时才构成片段。检查后面是否接上了完整的部分，或者这组词是否根本没有以这类词开头。",
  ],
};

const fromTable = (table: Readonly<Record<string, readonly [en: string, zh: string]>>) => (wrong: string) => {
  const [en, zh] = entry(table, wrong);
  return t(en, zh);
};

const stillFragment = (wrong: string, _right: string, shown: string) => {
  const first = shown.split(" ")[0]!;
  if (["Because", "After", "When"].includes(first))
    return t(
      `“${wrong}” still leaves the thought that *${first.toLowerCase()}* starts unfinished. Adding or changing words inside it does not complete it.`,
      `“${wrong}” 仍没有说完 *${first.toLowerCase()}* 开启的意思。在里面增加或改动词语并不能补全它。`,
    );
  if (["Sang", "Barked"].includes(first))
    return t(
      `“${wrong}” still does not say who did the action, so it has no subject.`,
      `“${wrong}” 仍没有说明是谁做了这个动作，所以没有主语。`,
    );
  return t(
    `“${wrong}” still names something without saying what it does or is, so it has no predicate.`,
    `“${wrong}” 仍只是说出了某个事物，没有说明它做什么或是什么，所以没有谓语。`,
  );
};

const tenseFeedback = (wrong: string) => {
  if (wrong.startsWith("will "))
    return t(
      `“${wrong}” is the future tense, for something that has not happened yet. Check which time the time words point to.`,
      `“${wrong}” 是将来时，表示还没发生的事。看看时间词指向什么时候。`,
    );
  if (wrong.endsWith("ed") || ["made", "rose", "flew"].includes(wrong))
    return t(
      `“${wrong}” is the past tense, for something that already happened. Check which time the time words point to.`,
      `“${wrong}” 是过去时，表示已经发生的事。看看时间词指向什么时候。`,
    );
  return t(
    `“${wrong}” is the present tense, for what is true now or happens regularly. Check which time the time words point to.`,
    `“${wrong}” 是现在时，表示现在的事实或经常发生的事。看看时间词指向什么时候。`,
  );
};

const agreementFeedback = (wrong: string) =>
  wrong.endsWith("s")
    ? t(
        `“${wrong}” ends in *-s*, the form for one person or thing, such as *he* or *the dog*. Check whether the subject is one or more than one.`,
        `“${wrong}” 以 *-s* 结尾，是用于单个人或物（如 *he*、*the dog*）的形式。看看主语是一个还是多个。`,
      )
    : t(
        `“${wrong}” has no *-s*, the form for more than one, such as *they* or *the dogs*. Check whether the subject is one or more than one.`,
        `“${wrong}” 不带 *-s*，是用于多个（如 *they*、*the dogs*）的形式。看看主语是一个还是多个。`,
      );

const hardAgreementFeedback = (wrong: string) =>
  wrong === "is" || wrong.endsWith("s")
    ? t(
        `“${wrong}” is the singular form, as if the subject were one thing. Find the whole subject: a noun inside a phrase such as *of the car* does not count, and two subjects joined by *and* are plural.`,
        `“${wrong}” 是单数形式，好像主语只有一个。找出完整的主语：*of the car* 这类短语里的名词不算，用 *and* 连接的两个主语是复数。`,
      )
    : t(
        `“${wrong}” is the plural form, perhaps matched to a plural noun in a phrase between the subject and the verb. Cover that phrase and check the subject alone.`,
        `“${wrong}” 是复数形式，可能是与主语和动词之间短语里的复数名词搭配了。遮住这个短语，只看主语。`,
      );

const antecedentFeedback: Readonly<Record<string, readonly [en: string, zh: string]>> = {
  his: ["“his” points to one male person.", "“his” 指一个男性。"],
  her: ["“her” points to one female person.", "“her” 指一个女性。"],
  its: ["“its” points to one thing, or one group treated as a whole.", "“its” 指一个事物，或被视为整体的一个群体。"],
  their: ["“their” points to more than one person or thing.", "“their” 指不止一个人或事物。"],
  them: [
    "“them” does not show ownership, yet the word before the noun must say whose it is.",
    "“them” 不表示所属，而名词前的词必须说明是谁的。",
  ],
};

const notAntecedent = (wrong: string) => {
  const [en, zh] = entry(antecedentFeedback, wrong);
  return t(`${en} Find the noun the pronoun stands for and check whether it matches.`, `${zh} 找出代词所指的名词，看看是否一致。`);
};

/** sentenceTopics are the topics of what a sentence is made of. */
export const sentenceTopics: readonly TopicDef[] = [
  {
    id: "subjects-and-predicates",
    title: t("Subjects and Predicates", "主语和谓语"),
    summary: t("Every sentence names someone or something and says something about it.", "每个句子都点出某人或某物，并对其作出陈述。"),
    prerequisites: [],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      point(
        "complete-subject",
        t("Finding the Subject", "找出主语"),
        t(
          "A sentence has two main parts. The **subject** tells who or what the sentence is about. It includes all the words that belong with that person or thing.\n\nIn *The old bridge shook*, the sentence is about the old bridge, so the subject is **The old bridge**. To find it, ask: who or what is doing this, or being described?",
          "句子有两个主要部分。**主语**（subject）说明句子谈的是谁或什么，包括与该人或物相关的所有词。\n\n在 *The old bridge shook* 中，句子谈的是那座旧桥，所以主语是 **The old bridge**。找主语时问自己：是谁或什么在做这件事，或被描述？",
        ),
        choiceGenerator(
          t("What is the subject of this sentence?", "这句话的主语是什么？"),
          subjectBank,
          (right) =>
            t(
              `The sentence is about **${right}**, so that is the subject. The rest tells what happens.`,
              `句子谈的是 **${right}**，所以它是主语。其余部分说明发生了什么。`,
            ),
          (wrong, _right, _shown, position) =>
            position === 0
              ? t(
                  `“${wrong}” tells what happens, so it belongs to the predicate. The subject is who or what does it.`,
                  `“${wrong}” 说明发生了什么，属于谓语。主语是做这件事的人或物。`,
                )
              : t(
                  `“${wrong}” is in the sentence, but the sentence is not about it. Ask who or what does the action or is described.`,
                  `“${wrong}” 在句子里，但句子谈的不是它。问一问是谁或什么在做这个动作或被描述。`,
                ),
        ),
      ),
      point(
        "complete-predicate",
        t("Finding the Predicate", "找出谓语"),
        t(
          "The **predicate** tells what the subject does or is. It contains the verb and the words that go with it.\n\nIn *The old bridge shook in the wind*, the predicate is **shook in the wind**. Once you have found the subject, the predicate is usually everything else.",
          "**谓语**（predicate）说明主语做什么或是什么，包含动词及与之相关的词。\n\n在 *The old bridge shook in the wind* 中，谓语是 **shook in the wind**。找到主语后，其余部分通常就是谓语。",
        ),
        choiceGenerator(
          t("What is the predicate of this sentence?", "这句话的谓语是什么？"),
          predicateBank,
          (right) =>
            t(`**${right}** tells what the subject does, so it is the predicate.`, `**${right}** 说明主语做了什么，所以它是谓语。`),
          (wrong, _right, _shown, position) =>
            position === 0
              ? t(
                  `“${wrong}” tells who or what the sentence is about, so it is the subject, not the predicate.`,
                  `“${wrong}” 说明句子谈的是谁或什么，所以它是主语，不是谓语。`,
                )
              : t(
                  `“${wrong}” is only part of what the subject does. The predicate includes the verb and all the words that go with it.`,
                  `“${wrong}” 只是主语所做之事的一部分。谓语包括动词以及与之相关的所有词。`,
                ),
        ),
      ),
      point(
        "subject-after-opening",
        t("When the Sentence Opens with Something Else", "句子以其他内容开头时"),
        t(
          "The subject is not always first. A sentence can open with a phrase that tells when or where, usually followed by a comma. The subject comes after it.\n\nIn *After the game, the players rested*, ask who rested. The players did, so the subject is **the players**, not *the game*.",
          "主语不一定在最前面。句子可以用说明时间或地点的短语开头，后面通常有逗号，主语在它后面。\n\n在 *After the game, the players rested* 中，问一问是谁休息了。是球员，所以主语是 **the players**，而不是 *the game*。",
        ),
        choiceGenerator(
          t("What is the subject of this sentence?", "这句话的主语是什么？"),
          movedSubjectBank,
          (right) =>
            t(
              `Ask who or what does the action: **${right}**. The opening phrase only tells when or where.`,
              `问一问是谁或什么在做这个动作：**${right}**。开头的短语只说明时间或地点。`,
            ),
          (wrong, _right, shown) =>
            shown.split(",")[0]!.includes(wrong)
              ? t(
                  `“${wrong}” belongs to the opening phrase, which only tells when or where. The subject comes after the comma.`,
                  `“${wrong}” 属于开头的短语，它只说明时间或地点。主语在逗号后面。`,
                )
              : t(
                  `“${wrong}” belongs to the part that tells what happens, not to who or what does it.`,
                  `“${wrong}” 属于说明发生了什么的部分，而不是做这件事的人或物。`,
                ),
        ),
      ),
    ],
  },
  {
    id: "nouns-and-pronouns",
    title: t("Nouns and Pronouns", "名词和代词"),
    summary: t("Nouns name things; pronouns stand in for them, in the right form.", "名词为事物命名；代词代替名词，并要用对形式。"),
    prerequisites: [],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      point(
        "nouns",
        t("Nouns", "名词"),
        t(
          "A **noun** names a person, place, thing or idea: *teacher*, *Paris*, *pencil*, *courage*. You can usually put *the* or *a* in front of it, or make it plural.\n\nWords that describe (*tall*) or show action (*jump*) are not nouns, even when they sit next to one.",
          "**名词**（noun）为人、地点、事物或概念命名：*teacher*、*Paris*、*pencil*、*courage*。名词前通常可以加 *the* 或 *a*，也可以变成复数。\n\n描述性的词（*tall*）或表示动作的词（*jump*）不是名词，即使它们紧挨着名词。",
        ),
        choiceGenerator(
          t("Which word in this sentence is a noun?", "这句话中哪个词是名词？"),
          nounBank,
          (right) =>
            t(
              `**${right}** names a person, place, thing or idea, so it is a noun.`,
              `**${right}** 为人、地点、事物或概念命名，所以是名词。`,
            ),
          notNoun,
        ),
      ),
      point(
        "pronouns",
        t("Pronouns", "代词"),
        t(
          "A **pronoun** takes the place of a noun so that we need not repeat it. Common pronouns are *I, you, he, she, it, we, they, me, him, her, us, them, his, its, their*.\n\nIn *Ana lost her hat, but she found it*, the words *her* and *she* stand for Ana, and *it* stands for the hat.",
          "**代词**（pronoun）代替名词，免得重复。常见代词有 *I, you, he, she, it, we, they, me, him, her, us, them, his, its, their*。\n\n在 *Ana lost her hat, but she found it* 中，*her* 和 *she* 指 Ana，*it* 指帽子。",
        ),
        choiceGenerator(
          t("Which word in this sentence is a pronoun?", "这句话中哪个词是代词？"),
          pronounBank,
          (right) =>
            t(
              `**${right}** stands in for a noun, so it is a pronoun. The other words name, describe or show action, but none of them takes the place of a noun.`,
              `**${right}** 代替名词，所以是代词。其他词或命名、或描述、或表示动作，但都不能代替名词。`,
            ),
          notPronoun,
        ),
      ),
      point(
        "pronoun-forms",
        t("Choosing the Form of a Pronoun", "选择代词的形式"),
        t(
          "A pronoun changes form with its job. Before a verb, as the one acting, use *I, he, she, we, they*. After a verb or a word like *to*, use *me, him, her, us, them*. To show ownership, use *my, his, her, our, their, its*.\n\nWhen two people are named, try the pronoun alone: *Mia and I left*, because you would say *I left*, not *me left*.",
          "代词的形式随它的作用而变。在动词前作为动作发出者时，用 *I, he, she, we, they*。在动词或 *to* 之类的词后面，用 *me, him, her, us, them*。表示所属时，用 *my, his, her, our, their, its*。\n\n提到两个人时，单独试一下代词：*Mia and I left*，因为你会说 *I left*，而不是 *me left*。",
        ),
        choiceGenerator(
          t("Which pronoun completes the sentence?", "哪个代词能补全句子？"),
          pronounFormBank,
          (right, shown) =>
            t(
              `The right form is **${right}**: ${shown.replace("___", right)} Try the pronoun alone to hear which form fits its job.`,
              `正确的形式是 **${right}**：${shown.replace("___", right)} 单独试读代词，判断哪种形式符合它的作用。`,
            ),
          notThisForm,
        ),
      ),
    ],
  },
  {
    id: "complete-sentences-and-fragments",
    title: t("Complete Sentences and Fragments", "完整句和句子片段"),
    summary: t("A sentence needs a subject and a predicate and must stand alone.", "句子需要主语和谓语，并且能独立成句。"),
    prerequisites: ["subjects-and-predicates"],
    encompasses: [{ topic: "subjects-and-predicates", weight: 0.4 }],
    xp: 12,
    knowledgePoints: [
      point(
        "missing-part",
        t("Fragments Missing a Part", "缺少成分的片段"),
        t(
          "A **complete sentence** has a subject and a predicate. A group of words missing one of them is a **fragment**, even if it starts with a capital and ends with a period.\n\n*The boat near the shore* has no predicate: what about the boat? *Rocked near the shore* has no subject: what rocked?",
          "**完整句**（complete sentence）有主语和谓语。缺少其中之一的一组词是**片段**（fragment），即使它以大写字母开头、以句号结尾。\n\n*The boat near the shore* 没有谓语：船怎么了？*Rocked near the shore* 没有主语：什么在摇晃？",
        ),
        choiceGenerator(
          t("Is this a complete sentence or a fragment?", "这是完整句还是片段？"),
          missingPartBank,
          (right) =>
            t(
              `This is a **${right.toLowerCase()}**. Look for a subject and a predicate: a complete sentence needs both.`,
              `答案是 **${right}**。找一找主语和谓语：完整句两者都需要。`,
            ),
          fromTable(fragmentLabelFeedback),
        ),
      ),
      point(
        "clause-fragment",
        t("Fragments That Cannot Stand Alone", "不能独立成句的片段"),
        t(
          "Words such as *because, when, although, if* and *since* make a group of words depend on something else. *Because the road was closed* has a subject and a verb, yet it leaves the reader waiting: what happened because of that?\n\nIt is still a fragment unless it joins a complete thought: *We turned back because the road was closed.*",
          "*because, when, although, if* 和 *since* 这类词会让一组词依赖其他内容。*Because the road was closed* 有主语和动词，但读者仍在等待：因此发生了什么？\n\n它仍然是片段，除非接上完整的意思：*We turned back because the road was closed.*",
        ),
        choiceGenerator(
          t("Is this a complete sentence or a fragment?", "这是完整句还是片段？"),
          clauseFragmentBank,
          (right) =>
            t(
              `This is a **${right.toLowerCase()}**. A group of words that begins with a word like *because* needs another complete thought.`,
              `答案是 **${right}**。以 *because* 这类词开头的一组词，需要另一个完整的意思。`,
            ),
          fromTable(clauseLabelFeedback),
        ),
      ),
      point(
        "fixing-fragments",
        t("Fixing a Fragment", "修改片段"),
        t(
          "To fix a fragment, add what is missing: a predicate, a subject, or the complete thought that a word like *because* is waiting for. Adding more description does not help.\n\n*The tall man in the green coat* stays a fragment however long it gets, until the man does something: *The tall man in the green coat waved.*",
          "修改片段时，补上缺少的部分：谓语、主语，或者 *because* 这类词等待的完整意思。增加描述没有用。\n\n*The tall man in the green coat* 不论多长都仍是片段，直到这个人做了什么：*The tall man in the green coat waved.*",
        ),
        choiceGenerator(
          t("Which one fixes this fragment?", "哪一项修改了这个片段？"),
          fixFragmentBank,
          (right) =>
            t(
              `**${right}** has a subject and a predicate and stands alone. The other choices are still fragments.`,
              `**${right}** 有主语和谓语，并且能独立成句。其他选项仍是片段。`,
            ),
          stillFragment,
        ),
      ),
    ],
  },
  {
    id: "simple-verb-tenses",
    title: t("Simple Verb Tenses", "一般时态"),
    summary: t("Past, present and future, including common irregular verbs.", "过去、现在和将来，包括常见的不规则动词。"),
    prerequisites: ["subjects-and-predicates"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      point(
        "choosing-tense",
        t("Past, Present and Future", "过去、现在和将来"),
        t(
          "A verb's **tense** tells when something happens. The past usually adds *-ed* (*walked*). The present describes what is true or happens regularly (*walks*). The future uses *will* (*will walk*).\n\nTime words such as *yesterday*, *every day* and *tomorrow* show which tense a sentence needs.",
          "动词的**时态**（tense）说明事情发生的时间。过去时通常加 *-ed*（*walked*）。现在时描述事实或经常发生的事（*walks*）。将来时用 *will*（*will walk*）。\n\n*yesterday*、*every day*、*tomorrow* 这样的时间词说明句子需要哪种时态。",
        ),
        choiceGenerator(
          t("Which verb completes the sentence?", "哪个动词能补全句子？"),
          tenseBank,
          (right, shown) =>
            t(
              `The time words call for **${right}**: ${shown.replace("___", right)}`,
              `时间词要求使用 **${right}**：${shown.replace("___", right)}`,
            ),
          tenseFeedback,
        ),
      ),
      point(
        "irregular-past",
        t("Irregular Past Forms", "不规则过去式"),
        t(
          "Many common verbs do not add *-ed* in the past. They change in their own way: *go* becomes *went*, *see* becomes *saw*, *teach* becomes *taught*. These forms have to be learned one by one, and using them often is what makes them stick.",
          "许多常用动词的过去式不加 *-ed*，而是有自己的变化：*go* 变成 *went*，*see* 变成 *saw*，*teach* 变成 *taught*。这些形式要逐个学习，多用才能记住。",
        ),
        typedGenerator("word-form", t("Type the past form of the verb.", "输入动词的过去式。"), irregularBank, (right) =>
          t(`The past form is **${right}**. This verb does not add *-ed*.`, `过去式是 **${right}**。这个动词不加 *-ed*。`),
        ),
      ),
    ],
  },
  {
    id: "subject-verb-agreement",
    title: t("Subject-Verb Agreement", "主谓一致"),
    summary: t("A verb matches its subject, even when other words come between them.", "动词要与主语一致，即使中间隔着其他词。"),
    prerequisites: ["simple-verb-tenses"],
    encompasses: [{ topic: "simple-verb-tenses", weight: 0.2 }],
    xp: 12,
    knowledgePoints: [
      point(
        "basic-agreement",
        t("Singular and Plural Subjects", "单数和复数主语"),
        t(
          "In the present tense, a verb must **agree** with its subject. A singular subject (*he, she, it, the dog*) takes a verb ending in *-s*: *The dog barks*. A plural subject (*they, we, the dogs*) takes the verb without it: *The dogs bark*.\n\nThe *-s* moves: nouns add it to become plural, and verbs drop it.",
          "在现在时中，动词必须与主语**一致**（agree）。单数主语（*he, she, it, the dog*）的动词以 *-s* 结尾：*The dog barks*。复数主语（*they, we, the dogs*）的动词不加 *-s*：*The dogs bark*。\n\n*-s* 会移动：名词加上它变成复数，动词则去掉它。",
        ),
        choiceGenerator(
          t("Which verb agrees with the subject?", "哪个动词与主语一致？"),
          agreementBank,
          (right, shown) =>
            t(
              `${shown.replace("___", `**${right}**`)} The verb matches its subject in number.`,
              `${shown.replace("___", `**${right}**`)} 动词与主语的单复数一致。`,
            ),
          agreementFeedback,
        ),
      ),
      point(
        "words-between",
        t("Words Between the Subject and the Verb", "主语和动词之间的词"),
        t(
          "Words that come between a subject and its verb do not change the agreement. In *The box of crayons is on the desk*, the subject is *box*, not *crayons*, so the verb is singular. To check, cover the phrase: *The box is on the desk.*\n\nTwo subjects joined by *and* are plural: *Tom and Ana ride the bus.*",
          "主语和动词之间的词不影响一致关系。在 *The box of crayons is on the desk* 中，主语是 *box*，不是 *crayons*，所以动词用单数。检查时可以遮住短语：*The box is on the desk.*\n\n用 *and* 连接的两个主语是复数：*Tom and Ana ride the bus.*",
        ),
        choiceGenerator(
          t("Which verb agrees with the subject?", "哪个动词与主语一致？"),
          hardAgreementBank,
          (right, shown) =>
            t(
              `${shown.replace("___", `**${right}**`)} Find the real subject, ignoring any phrase between it and the verb.`,
              `${shown.replace("___", `**${right}**`)} 找到真正的主语，忽略它和动词之间的短语。`,
            ),
          hardAgreementFeedback,
        ),
      ),
    ],
  },
  {
    id: "pronoun-antecedent-agreement",
    title: t("Pronoun-Antecedent Agreement", "代词与先行词一致"),
    summary: t("A pronoun matches the noun it stands for and points to it clearly.", "代词要与所指的名词一致，并且指代清楚。"),
    prerequisites: ["nouns-and-pronouns"],
    encompasses: [{ topic: "nouns-and-pronouns", weight: 0.3 }],
    xp: 10,
    knowledgePoints: [
      point(
        "matching-antecedent",
        t("Matching the Antecedent", "与先行词一致"),
        t(
          "The noun a pronoun stands for is its **antecedent**. The two must match: *The students opened their books*, with *their* for the plural *students*. *The company lowered its prices*, since a company is treated as one thing, and so is a team.",
          "代词所指的名词是它的**先行词**（antecedent），两者必须一致：*The students opened their books*，*their* 对应复数 *students*。*The company lowered its prices*，因为公司被视为一个整体，球队也一样。",
        ),
        choiceGenerator(
          t("Which pronoun completes the sentence?", "哪个代词能补全句子？"),
          antecedentBank,
          (right, shown) =>
            t(
              `${shown.replace("___", `**${right}**`)} The pronoun matches the noun it stands for.`,
              `${shown.replace("___", `**${right}**`)} 代词与它所指的名词一致。`,
            ),
          notAntecedent,
        ),
      ),
      point(
        "clear-reference",
        t("Making the Reference Clear", "让指代清楚"),
        t(
          'A pronoun confuses the reader when it could point to two nouns. In *Jon told Eli that he was late*, who was late? Rewrite so that only one reading is possible: *Jon told Eli, "I am late."*\n\nThe usual cures are to repeat the noun or to reorder the sentence, so that the pronoun has one possible antecedent.',
          '当代词可能指向两个名词时，读者就会困惑。在 *Jon told Eli that he was late* 中，到底是谁迟到了？改写后应该只有一种理解：*Jon told Eli, "I am late."*\n\n常用的办法是重复名词或调整语序，让代词只有一个可能的先行词。',
        ),
        choiceGenerator(
          t("Choose the clearest sentence.", "选出最清楚的句子。"),
          clearReferenceBank,
          (right) =>
            t(
              `**${right}** can be read only one way. In the others, the pronoun could point to either noun.`,
              `**${right}** 只有一种理解。在其他句子中，代词可能指向任一名词。`,
            ),
          (wrong) =>
            t(
              `In “${wrong}”, a pronoun could point to more than one noun, so the reader cannot be sure which one is meant.`,
              `在“${wrong}”中，代词可能指向不止一个名词，读者无法确定指的是哪一个。`,
            ),
        ),
      ),
    ],
  },
];
