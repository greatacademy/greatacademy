// Pre-A1, unit 3: My Family. Family and people, my and your, he, she and it, and have and has.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { interleave, pairUp, sentenceCase, vocabularyTopic, word } from "../words.ts";

const family = vocabularyTopic({
  id: "pre-a1-words-family",
  title: t("Family", "家人"),
  summary: t("The people in a family, and the question word who.", "家庭成员，以及疑问词 who。"),
  prerequisites: ["pre-a1-words-hello"],
  words: [
    word(
      "family families",
      "a mother, a father and their children",
      "家；家庭；家人",
      "There are four people in my {family}.|baby name | My {family} is big: Mom, Dad, two sisters and me.|baby friend | Many {families} have a dog.|names years",
      "baby name",
    ),
    word(
      "mother mothers",
      "a woman who has a child",
      "母亲",
      "My {mother} is a teacher. She is kind.|father brother | Ann is the {mother} of two children. She loves them.|father brother | His father is Tom, and his {mother} is Ann.|brother grandpa",
      "father brother",
      "mom",
    ),
    word(
      "father fathers",
      "a man who has a child",
      "父亲",
      "My {father} is a doctor. He is tall.|mother sister | Mr. Wang is the {father} of one girl.|mother sister | My {father} and his brother are farmers. They are tall men.|mother sister",
      "mother sister",
      "dad",
    ),
    word(
      "mom moms",
      "mother, as a child says it",
      "妈妈",
      "Happy Mother's Day, {Mom}!|Dad Grandpa | My {mom} is a nurse. She works at night.|dad brother | {Mom} is in the kitchen. She is making lunch.|Dad Grandpa",
      "dad brother",
      "mother",
    ),
    word(
      "dad dads",
      "father, as a child says it",
      "爸爸",
      "Happy Father's Day, {Dad}!|Mom Grandma | My {dad} is tall. He has short hair.|mom sister | {Dad} is in the garden. He is with the dog.|Mom Sister",
      "mom sister",
      "father",
    ),
    word(
      "sister sisters",
      "a girl or woman with the same mother and father as you",
      "姐姐；妹妹",
      "Anna is my {sister}. She is six.|brother dad | I have two brothers and one {sister}. She is the baby of the family.|dad grandpa | My {sisters} are both girls with long hair.|brothers dads",
      "brother dad",
    ),
    word(
      "brother brothers",
      "a boy or man with the same mother and father as you",
      "哥哥；弟弟",
      "Tom is my {brother}. He is nine.|sister mom | My big {brother} is fifteen. He is tall.|sister grandma | I have two {brothers}. They are boys.|sisters moms",
      "sister mom",
    ),
    word(
      "baby babies",
      "a very young child",
      "婴儿",
      "The {baby} is one month old. She sleeps a lot.|grandpa dad | A {baby} can't walk or talk.|grandpa sister | Our cat has three {babies}.|grandmas sisters",
      "grandpa dad",
    ),
    word(
      "grandma grandmas",
      "the mother of your mother or of your father",
      "奶奶；外婆",
      "My {grandma} is my mom's mother.|grandpa sister | {Grandma} is eighty. She is my dad's mom.|Grandpa Brother | My two {grandmas} are my mom's mother and my dad's mother.|grandpas brothers",
      "grandpa sister",
    ),
    word(
      "grandpa grandpas",
      "the father of your mother or of your father",
      "爷爷；外公",
      "My {grandpa} is my dad's father.|grandma sister | {Grandpa} is very old. He is my mom's dad.|Grandma Sister | My {grandpa} has a long white beard.|grandma baby",
      "grandma sister",
    ),
    word(
      "who who's",
      "the word you use to ask about a person",
      "谁",
      "{Who} is she? She is my sister.|What How | {Who's} that man? He's my dad.|What's How's | {Who} is your best friend? It's Sam.|How Many",
      "what how",
    ),
  ],
});

const myAndYour = vocabularyTopic({
  id: "pre-a1-words-my-and-your",
  title: t("My, Your, Me and You", "我的、你的、我和你"),
  summary: t(
    "Words for whose (my, your, his, her) and me, him, us and them.",
    "表示“谁的”的词（my、your、his、her），以及 me、him、us、them。",
  ),
  prerequisites: ["pre-a1-words-i-and-you"],
  words: [
    word(
      "my",
      "of me; that I have",
      "我的",
      "I am Ben. {My} name is Ben.|Your His | I have a dog. {My} dog is black.|Your Their | I write {my} name on my book.|your his",
      "your his",
    ),
    word(
      "your",
      "of you; that you have",
      "你的；你们的",
      "Hello! What is {your} name?|my his | You have a cat. Is {your} cat white?|my our | Open {your} books, children.|my his",
      "my his",
    ),
    word(
      "his",
      "of him; that a man or boy has",
      "他的",
      "Tom has a bike. {His} bike is blue.|Her Its | This is my dad. {His} name is Jack.|Her Its | Ben is with {his} mom.|her its",
      "her its",
    ),
    word(
      "her",
      "of her; that a woman or girl has",
      "她的",
      "Anna has a cat. {Her} cat is gray.|His Its | This is my mom. {Her} name is Mary.|His Their | Lily is with {her} grandma.|his its",
      "his its",
    ),
    word(
      "its",
      "of it; that a thing or an animal has",
      "它的",
      "The dog has a ball. {Its} ball is red.|It's His | The cat is in {its} bed.|it's their | The bird can open {its} wings.|it's their",
      "it's their",
    ),
    word(
      "our",
      "of us; that we have",
      "我们的",
      "We have a dog. {Our} dog is big.|Their Your | Tom and I are in one class. {Our} teacher is Ms. Li.|Their His | My sister and I have a room. {Our} room is pink.|Their Its",
      "their your",
    ),
    word(
      "their",
      "of them; that they have",
      "他们的；她们的；它们的",
      "Tom and Ann have a cat. {Their} cat is white.|Our My | The children open {their} books.|our its | My friends are with {their} dad.|our its",
      "our there",
    ),
    word(
      "me",
      "the word for *I* after a verb or after a word like *with* or *to*",
      "我（用在动词或介词后）",
      "Can you help {me}?|I my | Look at {me}!|I my | My dog is always with {me}.|I my",
      "I my",
    ),
    word(
      "him",
      "the word for *he* after a verb or after a word like *with* or *to*",
      "他（用在动词或介词后）",
      "Tom is my friend. I like {him}.|he his | That is Ben. Say hello to {him}.|he his | Dad is in the garden. I am with {him}.|he his",
      "he his",
    ),
    word(
      "us",
      "the word for *we* after a verb or after a word like *with* or *to*",
      "我们（用在动词或介词后）",
      "Come and play with {us}!|we our | Our teacher can see {us}.|we our | Grandma loves {us} very much.|we our",
      "we our",
    ),
    word(
      "them",
      "the word for *they* after a verb or after a word like *with* or *to*",
      "他们；她们；它们（用在动词或介词后）",
      "I have two cats. I love {them}.|they their | Where are my books? I can't see {them}.|they their | My friends are here. Come and meet {them}.|they their",
      "they their",
    ),
  ],
});

const people = vocabularyTopic({
  id: "pre-a1-words-people",
  title: t("People", "人"),
  summary: t("Men, women, boys and girls, and the verbs have and love.", "男人、女人、男孩和女孩，以及动词 have 和 love。"),
  prerequisites: ["pre-a1-words-family"],
  words: [
    word(
      "man men",
      "a grown-up male person",
      "男人",
      "My dad is a tall {man}.|woman girl | Mr. Li is a kind old {man}. He is seventy.|woman girl | Two {men} and a woman are at the door.|women girls",
      "woman girl",
    ),
    word(
      "woman women",
      "a grown-up female person",
      "女人；妇女",
      "My mom is a tall {woman}.|man boy | Ms. Li is a nice {woman}. She is our teacher.|man boy | The {women} are all mothers.|men boys",
      "man boy",
    ),
    word(
      "boy boys",
      "a male child",
      "男孩",
      "Tom is a {boy}. He is eight.|girl woman | My brother is a little {boy}.|girl woman | The {boys} play football. They are my brothers.|girls women",
      "girl woman",
    ),
    word(
      "girl girls",
      "a female child",
      "女孩",
      "Lily is a {girl}. She is nine.|boy man | My sister is a little {girl}.|boy man | The {girls} are my sisters.|boys men",
      "boy man",
    ),
    word(
      "child children",
      "a young boy or girl",
      "孩子；儿童",
      "She is a {child}. She is six years old.|man woman | My mom has three {children}: me and my two brothers.|men women | This book is for {children}, not for grown-ups.|men women",
      "man woman",
    ),
    word(
      "people",
      "men, women and children; more than one person",
      "人；人们",
      "There are five {people} in my family.|man child | Many {people} are in the park today.|man woman | How many {people} are in your class?|child woman",
      "man child",
    ),
    word(
      "have has had having haven't hasn't",
      "to own something or to be with someone",
      "有；拥有",
      "I {have} a cat and a dog.|has am | She {has} long hair.|have is | Tom {has} two sisters.|have is | Do you {have} a pen? Yes, I do.|has are",
      "has am",
    ),
    word(
      "love loves loved loving",
      "to like someone or something very, very much",
      "爱；非常喜欢",
      "I {love} my mom and dad.|with too | My sister {loves} cats. She has four.|with too | We {love} our grandma very much.|with too",
      "with too",
    ),
    word(
      "with",
      "together; next to; having",
      "和……一起；带有",
      "I play {with} my friends.|too love | Come {with} me!|too love | A girl {with} long hair is my sister.|too love",
      "too love",
    ),
    word(
      "too",
      "also; the same",
      "也",
      "I have a cat. My friend has a cat {too}.|with love | I am happy, and you are happy {too}.|with not | Tom is ten. Ben is ten {too}.|with and",
      "with love",
    ),
  ],
});

// He, she and it.

type Kind = "man" | "woman" | "thing";

const pronounOf: Record<Kind, string> = { man: "he", woman: "she", thing: "it" };

/** referents are people, animals and things, each with the word that stands for it. */
const referents: readonly (readonly [noun: string, kind: Kind])[] = [
  ["My mom", "woman"],
  ["My dad", "man"],
  ["The cat", "thing"],
  ["Tom", "man"],
  ["Anna", "woman"],
  ["My book", "thing"],
  ["The girl", "woman"],
  ["The boy", "man"],
  ["My grandpa", "man"],
  ["My grandma", "woman"],
  ["The bag", "thing"],
  ["My brother", "man"],
  ["My sister", "woman"],
  ["The dog", "thing"],
  ["Mr. Li", "man"],
  ["Ms. Wang", "woman"],
  ["The pen", "thing"],
];

const pronounChoiceBank: readonly ChoiceItem[] = pairUp(45, referents, [
  "X is here. ___ is very nice.",
  "Look at X. ___ is very big.",
  "Where is X? ___ is at home.",
]).map(([[noun, kind], frame]): ChoiceItem => {
  const lower = noun.startsWith("My") || noun.startsWith("The") ? noun.charAt(0).toLowerCase() + noun.slice(1) : noun;
  const shown = frame.startsWith("X") ? frame.replace("X", noun) : frame.replace("X", lower);
  const right = sentenceCase(pronounOf[kind]);
  return [shown, right, ["He", "She", "It"].filter((p) => p !== right)];
});

const personComplements: readonly string[] = ["is at school.", "is very kind.", "is in the garden.", "is my friend.", "is not at home."];
const thingComplements: readonly string[] = ["is red.", "is very small.", "is on the desk.", "is not big."];

const pronounTypedBank: readonly TypedItem[] = interleave([
  pairUp(
    26,
    referents.filter(([, kind]) => kind !== "thing"),
    personComplements,
  ),
  pairUp(
    10,
    referents.filter(([, kind]) => kind === "thing"),
    thingComplements.slice(0, 2),
  ),
]).map(([[noun, kind], rest]): TypedItem => {
  const right = sentenceCase(pronounOf[kind]);
  const others = ["He", "She", "It"].filter((p) => p !== right);
  return {
    shown: `${noun} ${rest}`,
    accepted: [`${right} ${rest}`],
    wrong: others.map((p) => `${p} ${rest}`),
  };
});

/** pronounFor says what each of he, she and it stands for, in every locale. */
const pronounFor: Record<string, Text> = {
  He: t("a man or a boy", "男人或男孩"),
  She: t("a woman or a girl", "女人或女孩"),
  It: t("a thing or an animal", "东西或动物"),
};

/** referentIn finds the person or thing a sentence talks about. */
const referentIn = (shown: string) => referents.find(([noun]) => shown.toLowerCase().includes(noun.toLowerCase()))?.[0] ?? "";

const heSheAndIt: TopicDef = {
  id: "he-she-and-it",
  title: t("He, She and It", "he、she 和 it"),
  summary: t(
    "He for a man or boy, she for a woman or girl, it for a thing or an animal.",
    "he 指男人或男孩，she 指女人或女孩，it 指东西或动物。",
  ),
  prerequisites: ["pre-a1-words-family", "the-verb-be"],
  encompasses: [{ topic: "the-verb-be", weight: 0.2 }],
  xp: 15,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("He, she or it?", "用 he、she 还是 it？"),
      t(
        "Use *he* for a man or a boy: *Tom is here. He is nice.* Use *she* for a woman or a girl: *Anna is here. She is nice.* Use *it* for a thing or an animal: *The cat is here. It is nice.*",
        "中文口语里“他”“她”“它”都读“tā”，所以说中文的人常把 *he* 和 *she* 用混。英语中，*he* 指男人或男孩：*Tom is here. He is nice.* *she* 指女人或女孩：*Anna is here. She is nice.* *it* 指东西或动物：*The cat is here. It is nice.*",
      ),
      choiceGenerator(
        t("Choose the word for the gap.", "选出填入空白处的词。"),
        pronounChoiceBank,
        (right, shown) =>
          t(
            `*${referentIn(shown)}* is ${pronounFor[right]?.en}, so the word for it is *${right.toLowerCase()}*: ${shown.replace("___", `*${right}*`)}`,
            `*${referentIn(shown)}* 是${pronounFor[right]?.["zh-CN"]}，所以用 *${right.toLowerCase()}*：${shown.replace("___", `*${right}*`)}`,
          ),
        (wrong, _right, shown) =>
          t(
            `*${wrong}* stands for ${pronounFor[wrong]?.en}, and *${referentIn(shown)}* is not one.`,
            `*${wrong}* 指${pronounFor[wrong]?.["zh-CN"]}，可 *${referentIn(shown)}* 不是。`,
          ),
      ),
    ),
    point(
      "replace",
      t("Saying he, she or it instead", "用 he、she 或 it 代替"),
      t(
        "Once we know who or what we mean, we say *he*, *she* or *it* instead of the name: *My mom is kind.* → *She is kind.*",
        "知道说的是谁或什么之后，就用 *he*、*she* 或 *it* 代替名字：*My mom is kind.* → *She is kind.*",
      ),
      typedGenerator(
        "sentence",
        t("Write the sentence again. Put he, she or it in place of the words before is.", "重写句子，用 he、she 或 it 代替 is 前面的词。"),
        pronounTypedBank,
        (right, shown) => {
          const pronoun = right.split(" ")[0] ?? "";
          return t(
            `*${referentIn(shown)}* is ${pronounFor[pronoun]?.en}, so *${pronoun.toLowerCase()}* takes its place: ${shown} → ${right}`,
            `*${referentIn(shown)}* 是${pronounFor[pronoun]?.["zh-CN"]}，所以用 *${pronoun.toLowerCase()}* 代替：${shown} → ${right}`,
          );
        },
      ),
    ),
  ],
};

// My, your, his and her.

/** owners say who has a thing, with their verb and the word for whose. */
const owners: readonly (readonly [owner: string, verb: string, whose: string, wrong: readonly [string, string]])[] = [
  ["I", "have", "My", ["Me", "I"]],
  ["You", "have", "Your", ["You", "You're"]],
  ["Tom", "has", "His", ["Her", "He"]],
  ["Anna", "has", "Her", ["His", "She"]],
  ["We", "have", "Our", ["Us", "We"]],
  ["They", "have", "Their", ["There", "They"]],
  ["The dog", "has", "Its", ["It's", "His"]],
  ["My dad", "has", "His", ["Her", "He"]],
  ["My mom", "has", "Her", ["His", "She"]],
  ["Ben and Sam", "have", "Their", ["Our", "They"]],
  ["My sister", "has", "Her", ["His", "She"]],
];

const owned: readonly (readonly [thing: string, color: string])[] = [
  ["bag", "red"],
  ["ball", "blue"],
  ["pen", "green"],
  ["book", "yellow"],
  ["chair", "white"],
];

const ownedSentence = (owner: string, verb: string, thing: string, color: string) =>
  `${owner} ${verb} a ${thing}. ___ ${thing} is ${color}.`;

const whoseChoiceBank: readonly ChoiceItem[] = pairUp(44, owners, owned).map(
  ([[owner, verb, whose, wrong], [thing, color]]): ChoiceItem => [ownedSentence(owner, verb, thing, color), whose, wrong],
);

const whoseTypedBank: readonly TypedItem[] = pairUp(33, owners, [
  ["cat", "gray"],
  ["kite", "pink"],
  ["desk", "brown"],
] as const).map(
  ([[owner, verb, whose, wrong], [thing, color]]): TypedItem => ({
    shown: ownedSentence(owner, verb, thing, color),
    accepted: [whose],
    wrong: [...wrong],
  }),
);

/** whoseOf says which word each word for whose goes with, in every locale. */
const whoseOf: Record<string, Text> = {
  My: t("*my* goes with *I*", "*my* 对应 *I*"),
  Your: t("*your* goes with *you*", "*your* 对应 *you*"),
  His: t("*his* is for a man or a boy, like *he*", "*his* 指男的，对应 *he*"),
  Her: t("*her* is for a woman or a girl, like *she*", "*her* 指女的，对应 *she*"),
  Its: t("*its* is for a thing or an animal, like *it*", "*its* 指东西或动物，对应 *it*"),
  Our: t("*our* goes with *we*, a group that includes you", "*our* 对应 *we*，指包括你自己在内的一群人"),
  Their: t("*their* goes with *they*, more than one other person", "*their* 对应 *they*，指别的几个人"),
};

/** ownerIn finds who has the thing in a sentence, the words before have or has. */
const ownerIn = (shown: string) => shown.split(/ ha(?:ve|s) /u)[0] ?? "";

/** whyNotWhose says what a wrong word for whose shows the learner misread. */
const whyNotWhose = (wrong: string, _right: string, shown: string): Text => {
  if (wrong === "You're")
    return t("*You're* means *you are*; it does not say whose the thing is.", "*You're* 的意思是 *you are*，不表示“谁的”。");
  if (wrong === "It's") return t("*It's* means *it is*; it does not say whose the thing is.", "*It's* 的意思是 *it is*，不表示“谁的”。");
  if (wrong === "There")
    return t(
      "*There* says where something is; it only sounds like the word for whose.",
      "*There* 表示“在那里”，只是读音和表示“谁的”的词相近。",
    );
  if (whoseOf[wrong])
    return t(
      `${whoseOf[wrong]?.en.replace(/^\*(.)/u, (_, c: string) => `*${c.toUpperCase()}`)}, but the owner here is *${ownerIn(shown)}*.`,
      `${whoseOf[wrong]?.["zh-CN"]}，可这里东西的主人是 *${ownerIn(shown)}*。`,
    );

  return t(
    `*${wrong}* is not a word for whose; before a noun you need a word like *my*, *his* or *their*.`,
    `*${wrong}* 不表示“谁的”；名词前面要用 *my*、*his*、*their* 这样的词。`,
  );
};

const myYourHisHer: TopicDef = {
  id: "my-your-his-her",
  title: t("My, Your, His and Her", "my、your、his 和 her"),
  summary: t(
    "My mom, his sister, their dog: the word for whose comes before the noun.",
    "my mom、his sister、their dog：表示“谁的”的词放在名词前。",
  ),
  prerequisites: ["pre-a1-words-my-and-your", "he-she-and-it"],
  encompasses: [
    { topic: "pre-a1-words-my-and-your", weight: 0.4 },
    { topic: "he-she-and-it", weight: 0.3 },
  ],
  xp: 15,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("Choosing the word for whose", "选择表示“谁的”的词"),
      t(
        "*I* → *my*, *you* → *your*, *he* → *his*, *she* → *her*, *it* → *its*, *we* → *our*, *they* → *their*.\n\n*Tom has a bike. His bike is blue.* (*his* for a man or boy)\n*Anna has a bike. Her bike is red.* (*her* for a woman or girl)\n\nDo not mix *its* with *it's* (= *it is*), or *their* with *there*.",
        "*I* → *my*，*you* → *your*，*he* → *his*，*she* → *her*，*it* → *its*，*we* → *our*，*they* → *their*。\n\n中文说“我的妈妈”“他的书”，英语没有“的”，直接把 *my*、*his* 放在名词前：*my mom*、*his book*。*his* 指男的，*her* 指女的——中文“他的”“她的”读音一样，英语却要分清。\n\n不要把 *its* 和 *it's*（= *it is*）、*their* 和 *there* 弄混。",
      ),
      choiceGenerator(
        t("Choose the word for the gap.", "选出填入空白处的词。"),
        whoseChoiceBank,
        (right, shown) =>
          t(
            `The owner in the sentence is *${ownerIn(shown)}*, and ${whoseOf[right]?.en}: ${shown.replace("___", `*${right}*`)}`,
            `东西是 *${ownerIn(shown)}* 的，${whoseOf[right]?.["zh-CN"]}：${shown.replace("___", `*${right}*`)}`,
          ),
        whyNotWhose,
      ),
    ),
    point(
      "type",
      t("Writing the word for whose", "写出表示“谁的”的词"),
      t(
        "Look at who has the thing, then write *my*, *your*, *his*, *her*, *its*, *our* or *their*.",
        "看看东西是谁的，再写出 *my*、*your*、*his*、*her*、*its*、*our* 或 *their*。",
      ),
      typedGenerator("word-form", t("Type the missing word.", "输入缺少的词。"), whoseTypedBank, (right, shown) =>
        t(
          `The owner in the sentence is *${ownerIn(shown)}*, and ${whoseOf[right]?.en}: ${shown.replace("___", `*${right}*`)}`,
          `东西是 *${ownerIn(shown)}* 的，${whoseOf[right]?.["zh-CN"]}：${shown.replace("___", `*${right}*`)}`,
        ),
      ),
    ),
  ],
};

// Have and has.

const haveSubjects: readonly (readonly [subject: string, verb: "have" | "has"])[] = [
  ["I", "have"],
  ["You", "have"],
  ["He", "has"],
  ["She", "has"],
  ["We", "have"],
  ["They", "have"],
  ["Tom", "has"],
  ["My mom", "has"],
  ["The cat", "has"],
  ["My friends", "have"],
  ["Anna and Ben", "have"],
];

const haveObjects: readonly string[] = ["a red bag", "two sisters", "long hair", "a big dog", "many books"];

const haveChoiceBank: readonly ChoiceItem[] = pairUp(44, haveSubjects, haveObjects).map(
  ([[subject, verb], object]): ChoiceItem => [
    `${subject} ___ ${object}.`,
    verb,
    [verb === "have" ? "has" : "have", verb === "have" ? "is" : "are"],
  ],
);

const haveTypedBank: readonly TypedItem[] = pairUp(33, haveSubjects, ["a cat", "black hair", "three pens"]).map(
  ([[subject, verb], object]): TypedItem => {
    const wrongVerb = verb === "have" ? "has" : "have";
    return {
      shown: `${subject} ${wrongVerb} ${object}.`,
      accepted: [`${subject} ${verb} ${object}.`],
      wrong: [`${subject} ${wrongVerb} ${object}.`],
    };
  },
);

/** haveRule says which subjects take have and which take has, in every locale. */
const haveRule: Record<string, Text> = {
  have: t("*have* goes with *I*, *you*, *we*, *they* and more than one", "*have* 跟 *I*、*you*、*we*、*they* 和多个人连用"),
  has: t("*has* goes with *he*, *she*, *it* and one person or thing", "*has* 跟 *he*、*she*、*it* 和单个的人或东西连用"),
};

const haveAndHas: TopicDef = {
  id: "have-and-has",
  title: t("Have and Has", "have 和 has"),
  summary: t("I have, you have, but she has, he has, it has.", "I have、you have，但 she has、he has、it has。"),
  prerequisites: ["pre-a1-words-people", "he-she-and-it"],
  encompasses: [{ topic: "pre-a1-words-people", weight: 0.3 }],
  xp: 15,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("Have or has?", "用 have 还是 has？"),
      t(
        "*I have*, *you have*, *we have*, *they have*, and more than one person *have*. But *he has*, *she has*, *it has*, and one person or thing *has*.\n\n*I have a cat. My sister has a dog.*",
        "*I*、*you*、*we*、*they* 和多个人后面用 *have*；*he*、*she*、*it* 和单个的人或东西后面用 *has*。中文“有”从不变化，英语却要跟着主语变。\n\n*I have a cat. My sister has a dog.*",
      ),
      choiceGenerator(
        t("Choose the word for the gap.", "选出填入空白处的词。"),
        haveChoiceBank,
        (right, shown) =>
          t(
            `The subject is *${shown.split(" ___")[0]}*, and ${haveRule[right]?.en}: ${shown.replace("___", `*${right}*`)}`,
            `主语是 *${shown.split(" ___")[0]}*，${haveRule[right]?.["zh-CN"]}：${shown.replace("___", `*${right}*`)}`,
          ),
        (wrong, _right, shown, position) =>
          position === 0
            ? t(
                `${haveRule[wrong]?.en}, but the subject here is *${shown.split(" ___")[0]}*.`,
                `${haveRule[wrong]?.["zh-CN"]}，可这里的主语是 *${shown.split(" ___")[0]}*。`,
              )
            : t(
                `*${wrong}* is a form of *be*, which says how or where someone is; to say what someone owns, use *have* or *has*.`,
                `*${wrong}* 是 *be* 的形式，说明人怎么样或在哪里；要说某人有什么，用 *have* 或 *has*。`,
              ),
      ),
    ),
    point(
      "fix",
      t("Fixing have and has", "改正 have 和 has"),
      t(
        "Each sentence has the wrong one of *have* and *has*. Look at the words before it and fix it.",
        "每个句子里的 *have* 或 *has* 用错了。看看它前面的词，把它改正。",
      ),
      typedGenerator("sentence", t("Fix the sentence.", "改正这个句子。"), haveTypedBank, (right) => {
        const [subject, verb] = right.split(/ (have|has) /u);
        return t(
          `The subject is *${subject}*, and ${haveRule[verb ?? ""]?.en}: ${right}`,
          `主语是 *${subject}*，${haveRule[verb ?? ""]?.["zh-CN"]}：${right}`,
        );
      }),
    ),
  ],
};

/** topics are the topics of the unit My Family. */
export const topics: readonly TopicDef[] = [family.topic, myAndYour.topic, people.topic, heSheAndIt, myYourHisHer, haveAndHas];

/** vocabulary are the words the unit My Family teaches. */
export const vocabulary: readonly WordBatch[] = [family.batch, myAndYour.batch, people.batch];
