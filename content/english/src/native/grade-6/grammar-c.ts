// Grade 6: a third knowledge point for each grammar topic of the grade, most of them applying the rule in editing.

import type { KnowledgePointDef } from "@ga/content";
import { choose, type Label, label } from "./kit.ts";

const join = (lines: readonly string[]) => lines.join("\n");

/** L builds a label from its Chinese name, why it is right and why it is not. */
const L = (zh: string, whyEn: string, whyZh: string, notEn: string, notZh: string): Label => ({
  zh,
  why: [whyEn, whyZh],
  not: [notEn, notZh],
});

const relative = choose(
  "the-noun-the-clause-describes",
  ["The Noun the Clause Describes", "从句修饰的名词"],
  [
    "A relative clause describes the noun right before its relative word: in *The girl who won the race lives next door*, *who won the race* tells which **girl**. The other nouns of the sentence, such as *race* or *door*, are not what the clause describes.",
    "关系从句修饰紧挨在关系词前面的名词：在 *The girl who won the race lives next door* 中，*who won the race* 说明的是哪个 **girl**。句子里的其他名词，如 *race* 或 *door*，不是从句修饰的对象。",
  ],
  ["Which noun does the relative clause describe?", "关系从句修饰的是哪个名词？"],
  `
  The girl who won the race lives next door.|girl|race|door
  The book that I borrowed from Tom is about whales.|book|Tom|whales
  We visited the town where my mother was born.|town|mother|We
  The dog that chased the cat belongs to Mr. Lee.|dog|cat|Mr. Lee
  My uncle, who drives a truck, crossed the desert.|uncle|truck|desert
  The cake that Ana baked won a prize at the fair.|cake|Ana|fair
  I met the teacher whose class went to the museum.|teacher|class|museum
  The river that runs past our school floods in spring.|river|school|spring
  She found the key that opens the old shed.|key|shed|She
  The players who trained all summer won the cup.|players|summer|cup
  `,
  (right) => [`The clause comes right after *${right}* and tells which one is meant.`, `从句紧跟在 *${right}* 后面，说明指的是哪一个。`],
  [
    ["*{wrong}* is a noun inside the clause, not the one it describes.", "*{wrong}* 是从句里面的名词，不是从句修饰的名词。"],
    [
      "*{wrong}* is another noun of the sentence, not the one before the relative word.",
      "*{wrong}* 是句子里的另一个名词，不是关系词前面的那个。",
    ],
  ],
);

const pronounCase = choose(
  "pronouns-after-than-and-as",
  ["Pronouns After Than and As", "than 和 as 后面的代词"],
  [
    "After *than* or *as* in a comparison, a verb is often left out: *She is taller than **I** (am)*. Finish the comparison in your head to choose the case. *Than I am* needs the subject form *I*; *She likes you more than (she likes) **me*** needs the object form. In formal writing, the subject form is right when the pronoun would be the subject of the missing verb.",
    "在 *than* 或 *as* 引导的比较中，动词常被省略：*She is taller than **I** (am)*。在心里把比较补完整，再选择代词的格。*than I am* 需要主格 *I*；*She likes you more than (she likes) **me*** 需要宾格。在正式写作中，如果代词是省略动词的主语，就用主格。",
  ],
  ["Which pronoun is right in formal writing?", "在正式写作中，哪个代词正确？"],
  `
  My sister is taller than ___.|I|me|myself
  Nobody in the class runs as fast as ___.|he|him|himself
  They finished the project sooner than ___.|we|us|ourselves
  Our team scored more points than ___.|they|them|themselves
  He is not as patient as ___.|she|her|herself
  You read more books than ___ do.|I|me|myself
  My brother is as old as ___.|she|her|herself
  The twins are younger than ___.|we|us|ourselves
  The coach praised Lena more than ___ (than the coach praised me).|me|I|myself
  The story surprised my parents as much as ___ (as it surprised us).|us|we|ourselves
  `,
  (right, shown) => [
    `Finish the comparison: "${shown.replace("___", right)}" The missing words show the case.`,
    `把比较补完整：“${shown.replace("___", right)}” 省略的词决定了代词的格。`,
  ],
  [
    ["*{wrong}* is the wrong case once the missing words are put back.", "把省略的词补回去后，*{wrong}* 的格就不对了。"],
    ["*{wrong}* is a self-pronoun, which needs a subject it refers back to.", "*{wrong}* 是反身代词，需要一个它所回指的主语。"],
  ],
);

const whom = choose(
  "whom-after-a-preposition",
  ["Whom After a Preposition", "介词后面的 whom"],
  [
    "When a preposition comes right before the pronoun, use **whom**: *To **whom** should I send the letter?*, *the friend with **whom** I traveled*. A preposition always takes the object form, and *whom* is the object form of *who*. *Whose* shows ownership and needs a noun after it.",
    "当介词紧挨在代词前面时，用 **whom**：*To **whom** should I send the letter?*，*the friend with **whom** I traveled*。介词后面总是用宾格，而 *whom* 是 *who* 的宾格。*whose* 表示所属，后面要跟名词。",
  ],
  ["Which word completes the sentence?", "哪个词能补全句子？"],
  `
  To ___ should I send the letter?|whom|who|whose
  The friend with ___ I traveled lives in Spain.|whom|who|whose
  For ___ did you buy the flowers?|whom|who|whose
  She is the coach from ___ I learned the most.|whom|who|whose
  The author about ___ we read was born in Chile.|whom|who|whose
  With ___ will you share the prize?|whom|who|whose
  The man to ___ I gave the map thanked me.|whom|who|whose
  Ask the girl beside ___ you sat in class.|whom|who|whose
  From ___ did you hear the news?|whom|who|whose
  The neighbors for ___ we cooked dinner were grateful.|whom|who|whose
  `,
  (_right, shown) => [
    `"${shown.replace("___", "whom")}": a preposition comes right before the pronoun, so it takes the object form.`,
    `“${shown.replace("___", "whom")}”：介词紧挨在代词前，所以用宾格。`,
  ],
  [
    ["*{wrong}* is the subject form, but a preposition takes the object form.", "*{wrong}* 是主格，但介词后面要用宾格。"],
    ["*{wrong}* shows ownership and needs a noun after it.", "*{wrong}* 表示所属，后面需要跟名词。"],
  ],
);

const appositiveLines = join([
  ...[
    "The poet Langston Hughes wrote about Harlem.",
    "My friend Maya plays the cello.",
    "The novel *Holes* is set in Texas.",
    "The scientist Marie Curie won two Nobel Prizes.",
    "The singer Bob Marley came from Jamaica.",
    "Our neighbor Mr. Diaz grows tomatoes.",
    "The painting *The Starry Night* hangs in New York.",
    "The inventor Thomas Edison held many patents.",
  ].map((s) => `${s}|no commas: the name tells which one`),
  ...[
    "Langston Hughes, a poet, wrote about Harlem.",
    "Maya, my best friend, plays the cello.",
    "*Holes*, a novel by Louis Sachar, is set in Texas.",
    "Marie Curie, a scientist, won two Nobel Prizes.",
    "Bob Marley, a famous singer, came from Jamaica.",
    "Mr. Diaz, our neighbor, grows tomatoes.",
    "Paris, the capital of France, sits on the Seine.",
    "Mount Everest, the highest mountain on Earth, lies in Nepal.",
  ].map((s) => `${s}|commas: the appositive adds information`),
]);

const appositive = label(
  "commas-or-none-with-an-appositive",
  ["Commas or None with an Appositive", "同位语用不用逗号"],
  [
    "An appositive that **tells which one** is essential and takes no commas: *The poet Langston Hughes wrote about Harlem*, since there are many poets. An appositive that only **adds information** about a noun already clear is nonessential and takes commas: *Langston Hughes, a poet, wrote about Harlem*.",
    "**说明是哪一个**的同位语是必要的，不加逗号：*The poet Langston Hughes wrote about Harlem*，因为诗人有很多。只是给已经明确的名词**补充信息**的同位语是非必要的，要加逗号：*Langston Hughes, a poet, wrote about Harlem*。",
  ],
  ["Why is the appositive punctuated this way?", "这个同位语为什么这样加标点？"],
  appositiveLines,
  {
    "no commas: the name tells which one": L(
      "不加逗号：名字说明是哪一个",
      "Without the name, the reader would not know which one is meant, so the appositive is essential.",
      "去掉名字，读者就不知道指的是哪一个，所以这个同位语是必要的。",
      "The noun is already clear, so the appositive only adds information.",
      "这个名词已经很明确，同位语只是补充信息。",
    ),
    "commas: the appositive adds information": L(
      "加逗号：同位语补充信息",
      "The noun is already clear, so the appositive only adds information and is set off by commas.",
      "这个名词已经很明确，同位语只是补充信息，所以用逗号隔开。",
      "The appositive is needed to tell which one is meant.",
      "需要这个同位语来说明是哪一个。",
    ),
  },
);

const participle = choose(
  "ing-or-ed-participles",
  ["-ing or -ed Participles", "-ing 还是 -ed 分词"],
  [
    "A participle ending in **-ing** describes what causes a feeling: *an exciting game*, *a boring speech*. A participle ending in **-ed** describes the one who has the feeling: *the excited fans*, *a bored audience*. Ask whether the noun causes the feeling or feels it.",
    "以 **-ing** 结尾的分词描述引起某种感受的事物：*an exciting game*、*a boring speech*。以 **-ed** 结尾的分词描述有这种感受的人：*the excited fans*、*a bored audience*。要问名词是引起感受的，还是感受到的。",
  ],
  ["Which participle completes the sentence?", "哪个分词能补全句子？"],
  `
  The ___ fans cheered when the goal went in.|excited|exciting|excite
  It was an ___ game from start to finish.|exciting|excited|excite
  The speech was so ___ that people left early.|boring|bored|bore
  The ___ students yawned through the film.|bored|boring|bore
  We were ___ by the ending of the story.|surprised|surprising|surprise
  The news was ___ to everyone in town.|surprising|surprised|surprise
  The ___ puppy hid under the bed during the storm.|frightened|frightening|frighten
  The thunder made a ___ noise.|frightening|frightened|frighten
  The test results were ___, so we studied harder.|disappointing|disappointed|disappoint
  The ___ team walked slowly off the field.|disappointed|disappointing|disappoint
  `,
  (right, shown) => [
    `"${shown.replace("___", right)}": the participle shows whether the noun causes the feeling or feels it.`,
    `“${shown.replace("___", right)}”：分词表明名词是引起感受的，还是感受到的。`,
  ],
  [
    ["*{wrong}* mixes up the one who feels with what causes the feeling.", "*{wrong}* 把感受者和引起感受的事物弄混了。"],
    ["*{wrong}* is the base verb, not a participle.", "*{wrong}* 是动词原形，不是分词。"],
  ],
);

const misplaced = choose(
  "what-the-sentence-really-says",
  ["What the Sentence Really Says", "句子实际上说了什么"],
  [
    "A misplaced modifier attaches to the wrong word, so the sentence says something the writer did not mean, often something absurd. Read it literally: in *I saw a dog running down the street in my pajamas*, the dog is wearing the pajamas. Seeing the literal meaning is how you catch the error.",
    "错位修饰语依附在了错误的词上，所以句子说出了作者本不想表达的意思，而且常常很荒谬。按字面读：在 *I saw a dog running down the street in my pajamas* 中，穿着睡衣的是狗。看出字面意思，才能发现错误。",
  ],
  ["Read literally, what does the sentence say?", "按字面理解，这个句子说的是什么？"],
  `
  I saw a dog running down the street in my pajamas.|The dog was wearing my pajamas.|I was wearing my pajamas.|The street was in my pajamas.
  We gave the cake to the children covered in frosting.|The children were covered in frosting.|The cake was covered in frosting.|We were covered in frosting.
  She served sandwiches to the guests on paper plates.|The guests were on paper plates.|The sandwiches were on paper plates.|She was on paper plates.
  The man bought a hat for his wife with a feather.|His wife had a feather.|The hat had a feather.|The man had a feather.
  Barking loudly, the mail carrier ran from the dog.|The mail carrier was barking.|The dog was barking.|The mail was barking.
  We found a wallet walking to school.|The wallet was walking to school.|We were walking to school.|The school was walking.
  He wore a coat to the party that was too big.|The party was too big.|The coat was too big.|He was too big.
  The teacher returned the tests to the students with red marks.|The students had red marks.|The tests had red marks.|The teacher had red marks.
  Covered in mud, Mom washed the boots.|Mom was covered in mud.|The boots were covered in mud.|The water was covered in mud.
  I read about the fire that destroyed the barn in the newspaper.|The barn was in the newspaper.|I read about it in the newspaper.|The fire was a newspaper.
  `,
  (right) => [`Read literally, the modifier attaches to the wrong word: ${right}`, `按字面理解，修饰语依附在了错误的词上：${right}`],
  [
    ["That is what the writer meant, not what the sentence says as written.", "这是作者想表达的意思，而不是句子按原样写出来的意思。"],
    ["The modifier does not attach to that word either.", "修饰语也没有依附在那个词上。"],
  ],
);

const thatWhich = choose(
  "which-after-a-comma",
  ["Which After a Comma", "逗号后面用 which"],
  [
    "*That* begins only essential clauses, so it never follows a comma. A clause set off by commas, which adds information, begins with **which** for things and **who** for people: *The book, **which** I borrowed, was long*; *My aunt, **who** lives in Ohio, is visiting*.",
    "*that* 只引导必要从句，所以从不跟在逗号后面。用逗号隔开、补充信息的从句，指物时用 **which** 开头，指人时用 **who** 开头：*The book, **which** I borrowed, was long*；*My aunt, **who** lives in Ohio, is visiting*。",
  ],
  ["Which word completes the sentence?", "哪个词能补全句子？"],
  `
  The book, ___ I borrowed from the library, was long.|which|that|who
  Our car, ___ is twelve years old, still runs well.|which|that|who
  The Nile, ___ flows north, is the longest river in Africa.|which|that|who
  My grandmother, ___ grew up in Peru, speaks three languages.|who|that|which
  The museum, ___ opened last year, has a dinosaur hall.|which|that|who
  Mr. Ortiz, ___ coaches the soccer team, teaches math.|who|that|which
  The old bridge, ___ was built in 1900, needs repairs.|which|that|who
  Our principal, ___ loves jazz, plays the trumpet.|who|that|which
  The play, ___ the students wrote themselves, ran for a week.|which|that|who
  My cousins, ___ live in Toronto, visit every summer.|who|that|which
  `,
  (right) => [
    `After a comma the clause adds information, so it begins with *${right}*.`,
    `逗号后面的从句补充信息，所以用 *${right}* 开头。`,
  ],
  [
    ["*{wrong}* begins only essential clauses, so it cannot follow a comma.", "*{wrong}* 只引导必要从句，不能跟在逗号后面。"],
    [
      "*{wrong}* is for the wrong kind of noun: *who* for people, *which* for things.",
      "*{wrong}* 用错了对象：指人用 *who*，指物用 *which*。",
    ],
  ],
);

const secondComma = choose(
  "the-second-comma",
  ["The Second Comma", "第二个逗号"],
  [
    "A nonessential element in the middle of a sentence needs **two** commas, one before and one after, like a pair of brackets: *My aunt, who lives in Ohio, is visiting*. Leaving out the second comma, or the first, joins the element to the rest of the sentence and confuses the reader.",
    "句子中间的非必要成分需要**两个**逗号，前后各一个，就像一对括号：*My aunt, who lives in Ohio, is visiting*。漏掉第二个或第一个逗号，都会把这个成分和句子的其他部分连在一起，让读者困惑。",
  ],
  ["Which sentence is punctuated correctly?", "哪个句子的标点正确？"],
  join(
    [
      ["My aunt", "who lives in Ohio", "is visiting next week"],
      ["The Amazon", "the largest rainforest on Earth", "is shrinking"],
      ["Our dog", "a shaggy old terrier", "sleeps all day"],
      ["The test", "which lasted two hours", "was hard"],
      ["Mr. Chen", "our science teacher", "built a robot"],
      ["My brother", "who hates mornings", "missed the bus again"],
      ["The castle", "built in 1250", "still stands"],
      ["Venus", "the hottest planet", "is covered in clouds"],
      ["The recipe", "which my grandfather wrote", "uses three eggs"],
      ["Sara", "the fastest runner in our class", "won the medal"],
    ].map(([a, middle, b]) => `${a} ___ ${middle} ___ ${b}.|${a}, ${middle}, ${b}.|${a}, ${middle} ${b}.|${a} ${middle}, ${b}.`),
  ),
  (right) => [`"${right}" puts a comma on each side of the nonessential element.`, `“${right}”在非必要成分的两边各加了一个逗号。`],
  [
    ['"{wrong}" leaves out the comma after the element.', "“{wrong}”漏掉了成分后面的逗号。"],
    ['"{wrong}" leaves out the comma before the element.', "“{wrong}”漏掉了成分前面的逗号。"],
  ],
);

const myself = choose(
  "self-pronoun-or-object-pronoun",
  ["Self-Pronoun or Object Pronoun", "反身代词还是宾格代词"],
  [
    "A self-pronoun needs a word in the same sentence that it refers back to: *I hurt **myself***, *I **myself** saw it*. With no such word, use the ordinary pronoun: *Please give the tickets to Maria or **me***, not *or myself*. Using *myself* to sound polite is a common error.",
    "反身代词需要同一个句子里有一个它所回指的词：*I hurt **myself***，*I **myself** saw it*。如果没有这样的词，就用普通代词：*Please give the tickets to Maria or **me***，而不是 *or myself*。为了显得礼貌而用 *myself* 是常见的错误。",
  ],
  ["Which pronoun completes the sentence?", "哪个代词能补全句子？"],
  `
  Please give the tickets to Maria or ___.|me|myself|I
  The coach invited Leo and ___ to the camp.|me|myself|I
  If you have questions, ask Mrs. Park or ___.|me|myself|I
  The prize was shared by Ben and ___.|me|myself|I
  Our parents took my sister and ___ to the zoo.|me|myself|I
  I made ___ a sandwich after school.|myself|me|I
  I fixed the bike ___, without any help.|myself|me|I
  The letter was addressed to you and ___.|me|myself|I
  Between you and ___, the plan will not work.|me|myself|I
  I reminded ___ to bring an umbrella.|myself|me|I
  `,
  (right, shown) => [
    `"${shown.replace("___", right)}": a self-pronoun only when the sentence has a word it refers back to.`,
    `“${shown.replace("___", right)}”：只有句中有它所回指的词时才用反身代词。`,
  ],
  [
    [
      "*{wrong}* is the wrong choice: a self-pronoun needs a word it refers back to, and the ordinary pronoun fits when it has none.",
      "*{wrong}* 选错了：反身代词需要一个它所回指的词，没有时就用普通代词。",
    ],
    ["*{wrong}* is the subject form, but the pronoun here is an object.", "*{wrong}* 是主格，但这里的代词是宾语。"],
  ],
);

const thisNoun = choose(
  "this-with-a-noun",
  ["This with a Noun", "this 加名词"],
  [
    "*This* or *that* standing alone often points at a whole idea, and the reader may not know which: *The bus was late again. This made us miss the play.* Add a noun that names the idea: ***This delay** made us miss the play.* The noun turns a vague pointer into a clear one.",
    "单独使用的 *this* 或 *that* 常常指代一整个意思，读者可能不知道指的是什么：*The bus was late again. This made us miss the play.* 加一个名词把这个意思说出来：***This delay** made us miss the play.* 名词让含糊的指代变得清楚。",
  ],
  ["Which opening makes the second sentence clear?", "哪个开头能让第二句清楚？"],
  `
  The bus was late again. ___ made us miss the play.|This delay|This|It
  Our town banned plastic bags. ___ has cut litter in half.|This ban|This|It
  The river rose two meters overnight. ___ forced families to leave.|This flood|This|It
  Many students skip breakfast. ___ makes it hard to focus.|This habit|This|It
  The team practiced every day in July. ___ paid off in the finals.|This effort|This|It
  The school added a garden. ___ gives classes fresh vegetables.|This garden|This|It
  Prices rose sharply last year. ___ hurt small shops most.|This rise|This|It
  Scientists found water on the moon. ___ could help future astronauts.|This discovery|This|It
  The city closed the main road. ___ sent traffic through our street.|This closure|This|It
  The coach changed the lineup. ___ surprised the fans.|This change|This|It
  `,
  (right) => [`*${right}* names the idea the pronoun points at.`, `*${right}* 把代词所指的意思说了出来。`],
  [
    ["*{wrong}* alone points at the whole idea without naming it.", "单独的 *{wrong}* 指代整个意思，却没有把它说出来。"],
    [
      "*{wrong}* could point at a noun of the first sentence instead of the idea.",
      "*{wrong}* 可能被理解为指代第一句中的某个名词，而不是那个意思。",
    ],
  ],
);

const agreementLabels = join([
  ...[
    "The box of old letters is in the attic.",
    "The color of the flowers changes in autumn.",
    "The students in the back row are quiet.",
    "A bowl of cherries sits on the table.",
    "The keys to the car are on the hook.",
    "The leader of the climbers carries the map.",
    "The members of the band practice daily.",
    "The sound of the waves helps me sleep.",
  ].map((s) => `${s}|correct`),
  ...[
    "The box of old letters are in the attic.",
    "The color of the flowers change in autumn.",
    "The students in the back row is quiet.",
    "A bowl of cherries sit on the table.",
    "The keys to the car is on the hook.",
    "The leader of the climbers carry the map.",
    "The members of the band practices daily.",
    "The sound of the waves help me sleep.",
  ].map((s) => `${s}|agrees with the noun in the phrase`),
]);

const agreement = label(
  "proofreading-for-agreement",
  ["Proofreading for Agreement", "校对主谓一致"],
  [
    "To proofread a sentence with a phrase between subject and verb, cover the phrase and read the subject with the verb: *The box (of old letters) **is** in the attic*. If the verb fits the noun inside the phrase instead, *are*, it **agrees with the noun in the phrase** and must be fixed.",
    "校对主语和动词之间有短语的句子时，把短语遮住，只读主语和动词：*The box (of old letters) **is** in the attic*。如果动词与短语里的名词一致，如 *are*，那它就是**与短语中的名词一致**了，必须改正。",
  ],
  ["Is the verb in this sentence correct?", "这个句子中的动词正确吗？"],
  agreementLabels,
  {
    correct: L(
      "正确",
      "With the phrase covered, the verb agrees with the subject.",
      "遮住短语后，动词与主语一致。",
      "With the phrase covered, the verb does not fit the subject.",
      "遮住短语后，动词与主语不一致。",
    ),
    "agrees with the noun in the phrase": L(
      "与短语中的名词一致",
      "The verb fits the noun inside the phrase, not the subject before it.",
      "动词与短语里的名词一致，而不是与前面的主语一致。",
      "The verb agrees with the subject.",
      "动词与主语一致。",
    ),
  },
);

const numberStart = choose(
  "a-number-at-the-start",
  ["A Number at the Start", "句首的数字"],
  [
    "Never begin a sentence with a figure. Spell the number out, with a hyphen between tens and ones from *twenty-one* to *ninety-nine*: ***Twenty-five** students signed up*. If the number is long, rewrite the sentence so it does not come first.",
    "句子不能以阿拉伯数字开头。要把数字拼写出来，*twenty-one* 到 *ninety-nine* 的十位和个位之间加连字符：***Twenty-five** students signed up*。如果数字很长，就改写句子，不让它放在句首。",
  ],
  ["Which opening is correct?", "哪个开头是正确的？"],
  `
  ___ students signed up for the trip.|Twenty-five|25|Twenty five
  ___ runners finished the race.|Forty-two|42|Forty two
  ___ people came to the concert.|Thirty-eight|38|Thirty eight
  ___ eggs were in the basket.|Twenty-four|24|Twenty four
  ___ books were sold at the fair.|Sixty-three|63|Sixty three
  ___ birds landed on the lake.|Fifty-one|51|Fifty one
  ___ days passed before the rain came.|Ninety-nine|99|Ninety nine
  ___ teams entered the contest.|Thirty-six|36|Thirty six
  ___ steps lead to the top of the tower.|Seventy-two|72|Seventy two
  ___ children joined the choir this year.|Eighty-five|85|Eighty five
  `,
  (right) => [
    `*${right}* spells the number out, with a hyphen, at the start of the sentence.`,
    `*${right}* 在句首把数字拼写了出来，并加了连字符。`,
  ],
  [
    ["*{wrong}* begins the sentence with a figure.", "*{wrong}* 用阿拉伯数字开头。"],
    ["*{wrong}* needs a hyphen between the tens and the ones.", "*{wrong}* 的十位和个位之间需要连字符。"],
  ],
);

const plural = choose(
  "fixing-a-shift-with-the-plural",
  ["Fixing a Shift with the Plural", "用复数纠正数的变换"],
  [
    "A sentence that starts with a singular word such as *every student* and then says *their* shifts number. One clean fix is to make the whole sentence **plural**: *Every student must bring his or her lunch* becomes ***All students** must bring **their** lunches*. Check that the verb and the nouns change too.",
    "以 *every student* 这样的单数词开头、后面却用 *their* 的句子发生了数的变换。一个干净的改法是把整个句子改成**复数**：*Every student must bring his or her lunch* 变成 ***All students** must bring **their** lunches*。注意动词和名词也要跟着变。",
  ],
  ["Which revision is plural throughout?", "哪个修改从头到尾都是复数？"],
  `
  Every student must bring their lunch.|All students must bring their lunches.|All students must bring his or her lunch.|Every students must bring their lunches.
  Each player should clean their boots.|All players should clean their boots.|All players should clean his or her boots.|Each players should clean their boots.
  A driver must show their license.|Drivers must show their licenses.|Drivers must show his or her license.|A drivers must show their licenses.
  Every member pays their dues in May.|All members pay their dues in May.|All members pays his or her dues in May.|Every members pay their dues in May.
  Each visitor has to sign their name.|All visitors have to sign their names.|All visitors has to sign his or her name.|Each visitors have to sign their names.
  A good writer revises their work.|Good writers revise their work.|Good writers revises his or her work.|A good writers revise their work.
  Every camper packs their own bag.|All campers pack their own bags.|All campers packs his or her own bag.|Every campers pack their own bags.
  Each singer chooses their own song.|All singers choose their own songs.|All singers chooses his or her own song.|Each singers choose their own songs.
  A pilot checks their plane before takeoff.|Pilots check their planes before takeoff.|Pilots checks his or her plane before takeoff.|A pilots check their planes before takeoff.
  Every voter must show their card.|All voters must show their cards.|All voters must show his or her card.|Every voters must show their cards.
  `,
  (right) => [`"${right}" makes the subject, the pronoun and the verb all plural.`, `“${right}”让主语、代词和动词都成了复数。`],
  [
    ['"{wrong}" makes the subject plural but keeps a singular pronoun.', "“{wrong}”把主语改成了复数，但代词仍是单数。"],
    [
      '"{wrong}" puts a plural noun after a word such as *every* or *a*, which needs a singular.',
      "“{wrong}”在 *every* 或 *a* 这样要求单数的词后面用了复数名词。",
    ],
  ],
);

const passiveParticiple = choose(
  "the-participle-after-be",
  ["The Participle After Be", "be 后面的过去分词"],
  [
    "The passive is a form of *be* plus a **past participle**: *The window **was broken** by the ball*. With an irregular verb the participle is not the simple past: *broken*, not *broke*; *written*, not *wrote*. A made-up form such as *breaked* is never right.",
    "被动语态由 *be* 的某种形式加**过去分词**构成：*The window **was broken** by the ball*。不规则动词的过去分词不同于一般过去式：是 *broken* 而不是 *broke*，是 *written* 而不是 *wrote*。*breaked* 这样编造的形式永远是错的。",
  ],
  ["Which form completes the sentence?", "哪个形式能补全句子？"],
  `
  The window was ___ by the ball.|broken|broke|breaked
  This letter was ___ in 1890.|written|wrote|writed
  The bike was ___ from the garage.|stolen|stole|stealed
  The bell is ___ every hour.|rung|rang|ringed
  The cake was ___ before we arrived.|eaten|ate|eated
  The song was ___ by the whole school.|sung|sang|singed
  The prize was ___ to the youngest player.|given|gave|gived
  The fish were ___ in the river.|caught|catched|caughted
  The lake was ___ solid all winter.|frozen|froze|freezed
  The book has been ___ by millions.|read|readed|reading
  `,
  (right) => [
    `After a form of *be*, the passive takes the past participle *${right}*.`,
    `在 *be* 的某种形式后面，被动语态用过去分词 *${right}*。`,
  ],
  [
    ["*{wrong}* is the simple past or another form, not the past participle.", "*{wrong}* 是一般过去式或其他形式，不是过去分词。"],
    ["*{wrong}* is not a form of the verb at all.", "*{wrong}* 根本不是这个动词的形式。"],
  ],
);

const possessiveOrPlural = choose(
  "possessive-or-plural",
  ["Possessive or Plural", "所有格还是复数"],
  [
    "A plural only counts: *The girls ran*. A possessive owns something, and the noun after it shows what: *the girls' coats* (more than one girl), *the girl's coat* (one girl). Ask two questions: does the word own the next noun, and is it one or more than one?",
    "复数只表示数量：*The girls ran*。所有格表示拥有某物，后面的名词说明拥有的是什么：*the girls' coats*（不止一个女孩），*the girl's coat*（一个女孩）。要问两个问题：这个词是否拥有后面的名词？它是一个还是不止一个？",
  ],
  ["Which word completes the sentence?", "哪个词能补全句子？"],
  `
  All the ___ coats were wet after the storm.|girls'|girls|girl's
  The ___ ran onto the field together.|players|players'|player's
  Both ___ parents came to the play.|twins'|twins|twin's
  The three ___ lunches were left on the bus.|boys'|boys|boy's
  The ___ waited at the gate for an hour.|visitors|visitors'|visitor's
  The two ___ owners met in the park.|dogs'|dogs|dog's
  Many ___ live in the old forest.|owls|owls'|owl's
  The ___ desks were moved for the test.|students'|students|student's
  Our ___ voices filled the hall.|singers'|singers|singer's
  Several ___ were planted along the road.|trees|trees'|tree's
  `,
  (right, shown) => [
    `"${shown.replace("___", right)}": the word is ${right.endsWith("'") ? "a plural that owns the next noun" : "a plural that only counts"}.`,
    `“${shown.replace("___", right)}”：这个词是${right.endsWith("'") ? "拥有后面名词的复数" : "只表示数量的复数"}。`,
  ],
  [
    [
      "*{wrong}* gets the job of the word wrong: it owns something here, or it does not.",
      "*{wrong}* 弄错了这个词的作用：它在这里是否拥有某物。",
    ],
    ["*{wrong}* is a singular possessive, but the sentence speaks of more than one.", "*{wrong}* 是单数所有格，但句子说的是不止一个。"],
  ],
);

const noDouble = choose(
  "when-not-to-double",
  ["When Not to Double", "什么时候不双写"],
  [
    "Double the final consonant only after **one** short vowel: *stop*, *stopping*. Do not double when the word ends in **two consonants** (*jump*, *jumping*), has **two vowels** before the last consonant (*rain*, *raining*), ends in *w*, *x* or *y* (*box*, *boxing*), or is stressed on an earlier syllable (*open*, *opening*).",
    "只有在**一个**短元音后面才双写末尾辅音：*stop*、*stopping*。以下情况不双写：词以**两个辅音**结尾（*jump*、*jumping*），最后一个辅音前有**两个元音**（*rain*、*raining*），以 *w*、*x* 或 *y* 结尾（*box*、*boxing*），或者重音在前面的音节上（*open*、*opening*）。",
  ],
  ["Which spelling is correct?", "哪个拼写正确？"],
  `
  rain + ing|raining|rainning|rainin
  jump + ed|jumped|jumpped|jumpt
  box + ing|boxing|boxxing|boxeing
  open + ing|opening|openning|openeing
  heat + ed|heated|heatted|heatd
  snow + ing|snowing|snowwing|snoing
  visit + ed|visited|visitted|visitd
  help + er|helper|helpper|helpr
  play + ed|played|playyed|plaied
  listen + ing|listening|listenning|listning
  `,
  (right) => [
    `*${right}* keeps a single consonant: the rule for doubling does not apply.`,
    `*${right}* 保留单个辅音：双写规则在这里不适用。`,
  ],
  [
    ["*{wrong}* doubles a consonant that should stay single.", "*{wrong}* 双写了本应保持单个的辅音。"],
    ["*{wrong}* drops or changes a letter of the base word or the ending.", "*{wrong}* 漏掉或改变了词根或词尾的字母。"],
  ],
);

const colonLabels = join([
  ...[
    "We need three things: flour, eggs and milk.",
    "She had one goal: to win the race.",
    "Bring the following: a pencil, a ruler and an eraser.",
    "The answer was simple: we would walk.",
    "He packed his favorite foods: apples, cheese and bread.",
    "The rule is clear: no phones in class.",
    "Our team has two strengths: speed and teamwork.",
    "There was only one problem: the door was locked.",
  ].map((s) => `${s}|correct colon`),
  ...[
    "My favorite sports are: soccer, tennis and swimming.",
    "We need: flour, eggs and milk.",
    "The trip includes: a museum, a park and a zoo.",
    "She likes to read: novels, comics and poems.",
    "The box was full of: old photos and letters.",
    "Our club meets on: Monday and Thursday.",
    "The recipe calls for: rice, beans and salt.",
    "He is good at: drawing and singing.",
  ].map((s) => `${s}|colon after a verb or preposition`),
]);

const colon = label(
  "colons-that-do-not-belong",
  ["Colons That Do Not Belong", "不该用的冒号"],
  [
    "A colon follows a **complete sentence**: *We need three things: flour, eggs and milk*. A colon that comes right after a verb or a preposition splits a sentence in the middle: *My favorite sports are: soccer…* is wrong. Delete the colon, or add words such as *the following* to complete the sentence first.",
    "冒号要跟在一个**完整的句子**后面：*We need three things: flour, eggs and milk*。紧跟在动词或介词后面的冒号会把句子从中间截断：*My favorite sports are: soccer…* 是错的。删掉冒号，或者先加上 *the following* 之类的词把句子补完整。",
  ],
  ["Is the colon used correctly?", "这个冒号用得对吗？"],
  colonLabels,
  {
    "correct colon": L(
      "冒号正确",
      "The words before the colon form a complete sentence.",
      "冒号前面的词组成了一个完整的句子。",
      "The colon comes right after a verb or a preposition.",
      "冒号紧跟在动词或介词后面。",
    ),
    "colon after a verb or preposition": L(
      "冒号用在动词或介词之后",
      "The colon splits the sentence right after a verb or a preposition.",
      "冒号紧跟在动词或介词后面，把句子截断了。",
      "The words before the colon form a complete sentence.",
      "冒号前面的词组成了一个完整的句子。",
    ),
  },
);

const neitherOf = choose(
  "neither-of-and-either-of",
  ["Neither Of and Either Of", "neither of 和 either of"],
  [
    "*Either* and *neither* on their own, or followed by *of*, mean **one** of two, so in formal writing they take a singular verb: *Neither of the twins **is** ready*; *Either of the roads **leads** to town*. This differs from *neither … nor*, where the verb agrees with the nearer subject.",
    "单独使用或后接 *of* 的 *either* 和 *neither* 表示两者中的**一个**，所以在正式写作中用单数动词：*Neither of the twins **is** ready*；*Either of the roads **leads** to town*。这与 *neither … nor* 不同，后者的动词与较近的主语一致。",
  ],
  ["Which verb is right in formal writing?", "在正式写作中，哪个动词正确？"],
  `
  Neither of the twins ___ ready to leave.|is|are|being
  Either of the roads ___ to town.|leads|lead|leading
  Neither of my answers ___ correct.|was|were|being
  Either of these books ___ a good choice.|is|are|being
  Neither of the dogs ___ to the vet.|wants to go|want to go|wanting to go
  Either of the teams ___ win the cup.|has a chance to|have a chance to|having a chance to
  Neither of the windows ___ properly.|closes|close|closing
  Either of the buses ___ at the station.|stops|stop|stopping
  Neither of the plans ___ enough money.|saves|save|saving
  Either of my sisters ___ drive us.|is able to|are able to|being able to
  `,
  (right, shown) => [
    `"${shown.replace("___", right)}": *either* or *neither* means one of two, so the verb is singular.`,
    `“${shown.replace("___", right)}”：*either* 或 *neither* 表示两者中的一个，所以动词用单数。`,
  ],
  [
    [
      "*{wrong}* agrees with the plural noun after *of*, not with *either* or *neither*.",
      "*{wrong}* 与 *of* 后面的复数名词一致，而不是与 *either* 或 *neither* 一致。",
    ],
    ["*{wrong}* is not a finite verb, so the sentence would have none.", "*{wrong}* 不是限定动词，句子就没有谓语动词了。"],
  ],
);

const linking = choose(
  "after-a-linking-verb",
  ["After a Linking Verb", "系动词之后"],
  [
    "A linking verb, such as *be*, *seem*, *look*, *taste*, *smell*, *sound* and *feel*, connects the subject to a word that describes it, so it takes an **adjective**: *The soup tastes **good***; *The milk smells **bad***. An action verb takes an adverb: *She sings **well***. *Well* can be an adjective too, meaning healthy: *I feel well today*.",
    "系动词，如 *be*、*seem*、*look*、*taste*、*smell*、*sound* 和 *feel*，把主语和描述它的词连接起来，所以后面用**形容词**：*The soup tastes **good***；*The milk smells **bad***。行为动词后面用副词：*She sings **well***。*well* 也可以作形容词，表示身体健康：*I feel well today*。",
  ],
  ["Which word completes the sentence?", "哪个词能补全句子？"],
  `
  This soup tastes ___.|good|well|goodly
  The milk smells ___, so throw it out.|bad|badly|worse
  Your idea sounds ___ to me.|good|well|goodly
  The garden looks ___ after the rain.|beautiful|beautifully|beauty
  The bread smells ___.|delicious|deliciously|delight
  She feels ___ about missing the party.|bad|badly|worse
  The music sounds ___ tonight.|loud|loudly|loudness
  He seems ___ with his new job.|happy|happily|happiness
  The baby grew ___ during the long drive.|quiet|quietly|quietness
  The room felt ___ after we lit the fire.|warm|warmly|warmth
  `,
  (right, shown) => [
    `"${shown.replace("___", right)}": a linking verb connects the subject to an adjective that describes it.`,
    `“${shown.replace("___", right)}”：系动词把主语和描述它的形容词连接起来。`,
  ],
  [
    [
      "*{wrong}* is an adverb, but a linking verb takes an adjective that describes the subject.",
      "*{wrong}* 是副词，但系动词后面要用描述主语的形容词。",
    ],
    ["*{wrong}* is the wrong word or form here.", "*{wrong}* 在这里是错误的词或形式。"],
  ],
);

const titleColon = choose(
  "after-a-colon-in-a-title",
  ["After a Colon in a Title", "标题中冒号之后"],
  [
    "In a title, the first word after a **colon** is capitalized, even a small word such as *a*, *the* or *of*: *Star Wars: **A** New Hope*. So are the first and the last word of the title. Other short articles, conjunctions and prepositions stay small.",
    "在标题中，**冒号**后的第一个词要大写，即使是 *a*、*the* 或 *of* 这样的小词：*Star Wars: **A** New Hope*。标题的第一个词和最后一个词也要大写。其他短小的冠词、连词和介词保持小写。",
  ],
  ["Which title is capitalized correctly?", "哪个标题的大写正确？"],
  `
  star wars: a new hope|Star Wars: A New Hope|Star Wars: a New Hope|Star wars: A new hope
  rivers of the world: a guide|Rivers of the World: A Guide|Rivers of the World: a Guide|Rivers Of The World: A Guide
  the moon: an introduction|The Moon: An Introduction|The Moon: an Introduction|the Moon: an Introduction
  dogs: the story of a friendship|Dogs: The Story of a Friendship|Dogs: the Story of a Friendship|Dogs: The Story Of A Friendship
  volcanoes: a hot history|Volcanoes: A Hot History|Volcanoes: a Hot History|Volcanoes: A hot history
  my life: the early years|My Life: The Early Years|My Life: the Early Years|My life: The early years
  the ocean: a world below|The Ocean: A World Below|The Ocean: a World Below|The Ocean: A World below
  baking bread: from flour to loaf|Baking Bread: From Flour to Loaf|Baking Bread: from Flour to Loaf|Baking Bread: From Flour To Loaf
  space travel: the next step|Space Travel: The Next Step|Space Travel: the Next Step|Space travel: The next step
  ancient egypt: a land of pharaohs|Ancient Egypt: A Land of Pharaohs|Ancient Egypt: a Land of Pharaohs|Ancient Egypt: A Land Of Pharaohs
  `,
  (right) => [
    `"${right}" capitalizes the first word after the colon and keeps other small words small.`,
    `“${right}”把冒号后的第一个词大写，其他小词保持小写。`,
  ],
  [
    ['"{wrong}" keeps the first word after the colon small.', "“{wrong}”没有把冒号后的第一个词大写。"],
    ['"{wrong}" capitalizes the wrong words.', "“{wrong}”大写了不该大写的词，或漏掉了该大写的词。"],
  ],
);

const hyphenPrefix = choose(
  "prefixes-that-take-a-hyphen",
  ["Prefixes That Take a Hyphen", "要加连字符的前缀"],
  [
    "Most prefixes join the base word with no hyphen: *rewrite*, *preview*, *unhappy*. A hyphen is needed before a **capital letter** or a **number** (*anti-American*, *pre-1900*), after *self-*, *ex-* meaning former and *all-* (*self-made*, *ex-president*, *all-star*), and when the prefix would make a double vowel that is hard to read or a different word (*re-elect*, *re-cover* meaning cover again).",
    "大多数前缀与词根直接相连，不加连字符：*rewrite*、*preview*、*unhappy*。以下情况需要连字符：词根以**大写字母**或**数字**开头（*anti-American*、*pre-1900*），前缀是 *self-*、表示“前任”的 *ex-* 和 *all-*（*self-made*、*ex-president*、*all-star*），以及加前缀后会出现难读的双元音或变成另一个词（*re-elect*，表示“重新覆盖”的 *re-cover*）。",
  ],
  ["Which spelling is correct?", "哪个拼写正确？"],
  `
  self + made|self-made|selfmade|self made
  ex + president (former)|ex-president|expresident|ex president
  re + write|rewrite|re-write|re write
  pre + view|preview|pre-view|pre view
  anti + American|anti-American|antiAmerican|anti American
  un + happy|unhappy|un-happy|un happy
  all + star|all-star|allstar|all star
  re + elect|re-elect|reelect|re elect
  mis + spell|misspell|mis-spell|mispell
  self + confident|self-confident|selfconfident|self confident
  `,
  (right) => [`*${right}* follows the rule for this prefix.`, `*${right}* 符合这个前缀的规则。`],
  [
    ["*{wrong}* gets the hyphen wrong for this prefix.", "*{wrong}* 在这个前缀上用错了连字符。"],
    ["*{wrong}* splits the word or drops a letter.", "*{wrong}* 把词拆开了，或者漏掉了字母。"],
  ],
);

/** deeper6 are the third knowledge points of the grammar topics of grade 6, by topic id. */
export const deeper6: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "relative-clauses": [relative],
  "pronoun-case": [pronounCase],
  "who-and-whom": [whom],
  appositives: [appositive],
  "participial-phrases": [participle],
  "misplaced-modifiers": [misplaced],
  "who-which-and-that": [thatWhich],
  "commas-with-nonessential-elements": [secondComma],
  "intensive-pronouns": [myself],
  "vague-pronouns": [thisNoun],
  "subject-verb-agreement-with-phrases-between": [agreement],
  "numbers-in-words-or-figures": [numberStart],
  "shifts-in-pronoun-number": [plural],
  "irregular-past-participles": [passiveParticiple],
  "possessives-of-plural-and-compound-nouns": [possessiveOrPlural],
  "spelling-doubling-final-consonants": [noDouble],
  "colons-before-lists-and-explanations": [colon],
  "agreement-with-either-or-and-neither-nor": [neitherOf],
  "good-and-well-bad-and-badly": [linking],
  "capitals-in-titles-and-headings": [titleColon],
  "spelling-words-with-prefixes": [hyphenPrefix],
};
