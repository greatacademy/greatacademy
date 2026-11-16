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
  The boy who lost his jacket asked at the office.|boy|jacket|office
  The song that we sang at the concert was new.|song|concert|we
  I know a place where we can swim safely.|place|we|I
  The bakery that sells bagels opens at six.|bakery|bagels|six
  My cousin, who studies in Paris, sent a postcard.|cousin|Paris|postcard
  The photo that hangs in the hall shows my grandparents.|photo|hall|grandparents
  We thanked the woman whose dog found the lost child.|woman|dog|child
  The bridge that crosses the bay is closed for repairs.|bridge|bay|repairs
  He returned the bike that he borrowed from Sam.|bike|Sam|He
  The students who painted the mural got an award.|students|mural|award
  The tree that fell in the storm crushed a fence.|tree|storm|fence
  I still have the letter that my grandfather wrote in 1960.|letter|grandfather|I
  The city where my parents met is on the coast.|city|parents|coast
  The doctor who treated my arm works at the clinic.|doctor|arm|clinic
  The game that we played at recess has simple rules.|game|recess|rules
  Our neighbor, whose garden is full of roses, won a prize.|neighbor|garden|prize
  The shoes that I wore to the wedding hurt my feet.|shoes|wedding|feet
  The river where we fished last summer is now dry.|river|summer|we
  The pilot who flew the plane spoke to the passengers.|pilot|plane|passengers
  The map that the explorer drew showed a hidden lake.|map|explorer|lake
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
  My cousin can swim farther than ___.|I|me|myself
  No one sings as well as ___.|she|her|herself
  Our neighbors have lived here longer than ___.|we|us|ourselves
  The other team trained harder than ___.|they|them|themselves
  Dad is not as tall as ___.|he|him|himself
  She has visited more countries than ___ have.|I|me|myself
  Is your brother older than ___?|she|her|herself
  The new students are as friendly as ___.|we|us|ourselves
  Mom trusts my sister more than ___ (than she trusts me).|me|I|myself
  The noise bothered our dog as much as ___ (as it bothered him).|him|he|himself
  Few people work as hard as ___.|they|them|themselves
  You finished the race faster than ___ did.|he|him|himself
  The teacher knows the answer better than ___.|we|us|ourselves
  The joke amused Dad more than ___ (than it amused me).|me|I|myself
  Nobody in our family cooks as well as ___.|she|her|herself
  My friends spent more money than ___.|I|me|myself
  They are just as tired as ___.|we|us|ourselves
  The storm scared the cats more than ___ (than it scared them).|them|they|themselves
  His sister reads faster than ___.|he|him|himself
  Grandma likes you as much as ___ (as she likes us).|us|we|ourselves
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
  To ___ did you lend your bike?|whom|who|whose
  The singer for ___ we waited never came.|whom|who|whose
  With ___ did you go to the fair?|whom|who|whose
  The teacher to ___ I wrote sent a reply.|whom|who|whose
  About ___ is the new film?|whom|who|whose
  The children for ___ the toys were bought were thrilled.|whom|who|whose
  From ___ did this package come?|whom|who|whose
  The woman next to ___ I sat was a doctor.|whom|who|whose
  By ___ was this poem written?|whom|who|whose
  The cousin with ___ I share a room snores.|whom|who|whose
  The players against ___ we played were very fast.|whom|who|whose
  For ___ is this seat saved?|whom|who|whose
  The guide from ___ we got the map was kind.|whom|who|whose
  To ___ should we give the award?|whom|who|whose
  The friend behind ___ I stood in line was late.|whom|who|whose
  Of ___ were you thinking?|whom|who|whose
  The scientist about ___ we wrote won a prize.|whom|who|whose
  With ___ are you working on the project?|whom|who|whose
  The boy to ___ the dog belongs lives nearby.|whom|who|whose
  Among ___ did you divide the cake?|whom|who|whose
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
    "The composer Ludwig van Beethoven lost his hearing.",
    "My cousin Ella lives in Denver.",
    "The film *Finding Nemo* takes place in the ocean.",
    "The explorer Roald Amundsen reached the South Pole.",
    "Our teacher Mrs. Grant coaches the debate team.",
    "The athlete Jesse Owens won four gold medals.",
    "The poem *The Road Not Taken* is about a choice.",
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
    "Beethoven, a German composer, lost his hearing.",
    "Ella, my youngest cousin, lives in Denver.",
    "Tokyo, the capital of Japan, is a huge city.",
    "Roald Amundsen, a Norwegian explorer, reached the South Pole.",
    "Mrs. Grant, our English teacher, coaches the debate team.",
    "Jesse Owens, an American runner, won four gold medals.",
    "The Nile, the longest river in Africa, flows north.",
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
  The ___ crowd waited for the band to start.|excited|exciting|excite
  The roller coaster was the most ___ ride in the park.|exciting|excited|excite
  The lecture was long and ___.|boring|bored|bore
  The ___ children asked to go home early.|bored|boring|bore
  The ___ guests gasped when the lights went out.|surprised|surprising|surprise
  The ending of the movie was very ___.|surprising|surprised|surprise
  The ___ kitten would not come out of the box.|frightened|frightening|frighten
  The movie had a ___ scene in a dark forest.|frightening|frightened|frighten
  The ___ fans left before the game ended.|disappointed|disappointing|disappoint
  The team's ___ season ended in March.|disappointing|disappointed|disappoint
  The ___ hikers sat down to rest.|tired|tiring|tire
  Carrying the boxes upstairs was a ___ job.|tiring|tired|tire
  The ___ student raised her hand to ask again.|confused|confusing|confuse
  The directions to the farm were ___.|confusing|confused|confuse
  We were ___ by the size of the whale.|amazed|amazing|amaze
  The magician did an ___ trick with a coin.|amazing|amazed|amaze
  The ___ visitors looked at the giant painting.|interested|interesting|interest
  She told an ___ story about her trip.|interesting|interested|interest
  The ___ boy waved to his friends from the stage.|embarrassed|embarrassing|embarrass
  Tripping on stage was an ___ moment.|embarrassing|embarrassed|embarrass
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
  She showed the photo to her friend with a big smile.|The photo had a big smile.|She had a big smile.|The friend was a photo.
  We saw a bear hiking in the mountains.|The bear was hiking in the mountains.|We were hiking in the mountains.|The mountains were hiking.
  The boy fed the duck wearing a red cap.|The duck was wearing a red cap.|The boy was wearing a red cap.|The cap fed the duck.
  Running for the bus, my backpack fell open.|My backpack was running for the bus.|I was running for the bus.|The bus was running.
  The waiter brought soup to the man in a bowl.|The man was in a bowl.|The soup was in a bowl.|The waiter was in a bowl.
  Hanging on the wall, Dad admired the painting.|Dad was hanging on the wall.|The painting was hanging on the wall.|The wall admired the painting.
  The girl walked the dog in a yellow raincoat.|The dog was in a yellow raincoat.|The girl was in a yellow raincoat.|The walk was in a raincoat.
  Flying over the city, the buildings looked tiny.|The buildings were flying over the city.|We were flying over the city.|The city was flying.
  She gave the flowers to her mother in a glass vase.|Her mother was in a glass vase.|The flowers were in a glass vase.|She was in a glass vase.
  Sitting on the shelf, I noticed the old clock.|I was sitting on the shelf.|The old clock was sitting on the shelf.|The shelf noticed the clock.
  The coach handed medals to the players made of gold.|The players were made of gold.|The medals were made of gold.|The coach was made of gold.
  We bought a puppy for my sister with floppy ears.|My sister had floppy ears.|The puppy had floppy ears.|We had floppy ears.
  Swimming in the pond, Grandpa watched the ducks.|Grandpa was swimming in the pond.|The ducks were swimming in the pond.|The pond was swimming.
  The chef served pasta to the diners covered in sauce.|The diners were covered in sauce.|The pasta was covered in sauce.|The chef was covered in sauce.
  Melting in the sun, the children ate their ice cream.|The children were melting in the sun.|The ice cream was melting in the sun.|The sun was melting.
  He mailed a package to his aunt wrapped in brown paper.|His aunt was wrapped in brown paper.|The package was wrapped in brown paper.|He was wrapped in brown paper.
  Barking at the mailman, I tried to calm the dog.|I was barking at the mailman.|The dog was barking at the mailman.|The mailman was barking.
  The nurse gave a sticker to the boy shaped like a star.|The boy was shaped like a star.|The sticker was shaped like a star.|The nurse was shaped like a star.
  Chewing on a bone, we found the puppy under the table.|We were chewing on a bone.|The puppy was chewing on a bone.|The table was chewing.
  The teacher read a story to the class about dragons.|The class was about dragons.|The story was about dragons.|The teacher was about dragons.
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
  The lake, ___ freezes every winter, is popular with skaters.|which|that|who
  My uncle, ___ fixes old cars, lives on a farm.|who|that|which
  Our school, ___ was built in 1950, needs a new roof.|which|that|who
  The mayor, ___ spoke at the fair, promised a new park.|who|that|which
  The Amazon, ___ crosses several countries, is full of life.|which|that|who
  Ms. Kim, ___ teaches art, painted the mural.|who|that|which
  The library, ___ stays open late, is always busy.|which|that|who
  My best friend, ___ moved to Texas, writes every week.|who|that|which
  The movie, ___ lasted three hours, was worth it.|which|that|who
  Our dog, ___ is afraid of thunder, hid under the bed.|which|that|who
  The pilot, ___ had flown for thirty years, landed smoothly.|who|that|which
  Mount Fuji, ___ is in Japan, is a volcano.|which|that|who
  My grandfather, ___ was a sailor, tells great stories.|who|that|which
  The garden, ___ my mother planted, is full of roses.|which|that|who
  Dr. Lee, ___ works at the clinic, gave me a shot.|who|that|which
  The new bike, ___ cost a lot, is already scratched.|which|that|who
  The twins, ___ are in sixth grade, play the violin.|who|that|which
  The river, ___ floods every spring, runs past our town.|which|that|who
  Our coach, ___ played for a national team, is very strict.|who|that|which
  The old clock, ___ belonged to my grandmother, still works.|which|that|who
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
      ["My grandmother", "who grew up on a farm", "still bakes bread"],
      ["The Pacific", "the largest ocean", "covers a third of Earth"],
      ["Our car", "an old blue van", "broke down again"],
      ["The museum", "which opened in May", "has free tickets on Sundays"],
      ["Dr. Patel", "our family doctor", "moved to Chicago"],
      ["My sister", "who loves spiders", "wants to be a scientist"],
      ["The bridge", "finished in 1937", "is painted orange"],
      ["Mars", "the red planet", "has two small moons"],
      ["The movie", "which I watched twice", "has a sad ending"],
      ["Leo", "the youngest player on the team", "scored the goal"],
      ["Our principal", "a former soccer coach", "plays at recess"],
      ["The library", "which is near the park", "stays open late"],
      ["Tom", "who sits next to me", "forgot his lunch"],
      ["The cheetah", "the fastest land animal", "can run seventy miles an hour"],
      ["My bike", "a gift from my uncle", "has a flat tire"],
      ["The volcano", "which last erupted in 1980", "is quiet now"],
      ["Ms. Rivera", "the new music teacher", "plays the harp"],
      ["The storm", "the worst in ten years", "knocked out the power"],
      ["Our neighbor", "who keeps bees", "gave us honey"],
      ["The book", "written by my aunt", "won a prize"],
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
  The teacher asked Sam and ___ to help.|me|myself|I
  Call Dad or ___ when you get there.|me|myself|I
  The cookies were for Grace and ___.|me|myself|I
  Grandma sent a card to my brother and ___.|me|myself|I
  The judges chose Lily and ___ for the final.|me|myself|I
  I taught ___ to play the guitar.|myself|me|I
  I painted the whole fence ___.|myself|me|I
  The coach wants to see you and ___ after practice.|me|myself|I
  Thank you for inviting my family and ___.|me|myself|I
  I told ___ not to give up.|myself|me|I
  The waiter brought menus to Jen and ___.|me|myself|I
  I cut ___ while chopping onions.|myself|me|I
  Please send the photos to Tom or ___.|me|myself|I
  The prize goes to whoever answers first: you or ___.|me|myself|I
  I bought ___ a new notebook.|myself|me|I
  Mom drove Eva and ___ to the library.|me|myself|I
  The story was written by my friend and ___.|me|myself|I
  I wrote the whole speech ___.|myself|me|I
  Uncle Ray took Max and ___ fishing.|me|myself|I
  I promised ___ I would finish the book.|myself|me|I
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
  The power went out for two days. ___ spoiled all our food.|This outage|This|It
  The school started later in the morning. ___ helped students sleep more.|This change|This|It
  Our team lost five games in a row. ___ worried the coach.|This losing streak|This|It
  Bees are disappearing from many farms. ___ threatens our food supply.|This decline|This|It
  The town planted a thousand trees. ___ made the streets cooler.|This project|This|It
  Sara practiced the piano every night. ___ helped her win the contest.|This practice|This|It
  The bridge was closed for repairs. ___ added an hour to our drive.|This closure|This|It
  Many people now work from home. ___ has emptied city offices.|This trend|This|It
  The library cut its hours in half. ___ upset many readers.|This cut|This|It
  The weather turned freezing overnight. ___ killed the young plants.|This frost|This|It
  The class raised money for the shelter. ___ paid for new beds.|This fundraiser|This|It
  The river was full of plastic. ___ harmed the fish.|This pollution|This|It
  Our neighbor built a tall fence. ___ blocked our view of the hills.|This fence|This|It
  Students voted to ban phones at lunch. ___ made the cafeteria louder with talk.|This rule|This|It
  The factory shut down last year. ___ cost the town many jobs.|This shutdown|This|It
  The coach added an extra practice each week. ___ made the players stronger.|This extra practice|This|It
  Ticket prices doubled this year. ___ kept many fans away.|This increase|This|It
  The volcano erupted without warning. ___ covered the village in ash.|This eruption|This|It
  Our class read a book every week. ___ improved our vocabulary.|This routine|This|It
  The road was repaved over the summer. ___ made biking much safer.|This repair|This|It
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
    "The cost of the tickets is too high.",
    "The books on the top shelf are dusty.",
    "A team of scientists studies the volcano.",
    "The pictures on the wall show our trip.",
    "The girl with the red shoes runs fast.",
    "The flowers in the garden need water.",
    "One of my friends lives in Spain.",
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
    "The cost of the tickets are too high.",
    "The books on the top shelf is dusty.",
    "A team of scientists study the volcano.",
    "The pictures on the wall shows our trip.",
    "The girl with the red shoes run fast.",
    "The flowers in the garden needs water.",
    "One of my friends live in Spain.",
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
  ___ players tried out for the team.|Twenty-seven|27|Twenty seven
  ___ cars were parked along the street.|Thirty-four|34|Thirty four
  ___ students wrote poems for the contest.|Forty-six|46|Forty six
  ___ apples fell from the tree in the storm.|Fifty-three|53|Fifty three
  ___ musicians played in the orchestra.|Sixty-one|61|Sixty one
  ___ kites flew over the beach.|Twenty-two|22|Twenty two
  ___ ducks swam across the pond.|Thirty-nine|39|Thirty nine
  ___ families moved into the new building.|Forty-eight|48|Forty eight
  ___ volunteers cleaned the park on Saturday.|Fifty-seven|57|Fifty seven
  ___ countries sent athletes to the games.|Ninety-two|92|Ninety two
  ___ seats were empty at the show.|Seventy-three|73|Seventy three
  ___ pages of the book were torn.|Eighty-one|81|Eighty one
  ___ boats sailed in the race.|Sixty-eight|68|Sixty eight
  ___ stars were visible through the telescope.|Ninety-four|94|Ninety four
  ___ cookies were baked for the sale.|Seventy-six|76|Seventy six
  ___ dogs entered the show this year.|Thirty-one|31|Thirty one
  ___ trees were planted along the river.|Eighty-seven|87|Eighty seven
  ___ letters arrived on Monday.|Forty-three|43|Forty three
  ___ bikes were stolen last month.|Twenty-nine|29|Twenty nine
  ___ climbers reached the top of the mountain.|Fifty-two|52|Fifty two
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
  Every child should wash their hands.|All children should wash their hands.|All children should wash his or her hands.|Every children should wash their hands.
  Each runner must wear their number.|All runners must wear their numbers.|All runners must wear his or her number.|Each runners must wear their numbers.
  A swimmer needs their own towel.|Swimmers need their own towels.|Swimmers need his or her own towel.|A swimmers need their own towels.
  Every guest signs their name at the door.|All guests sign their names at the door.|All guests signs his or her name at the door.|Every guests sign their names at the door.
  Each worker gets their pay on Friday.|All workers get their pay on Friday.|All workers gets his or her pay on Friday.|Each workers get their pay on Friday.
  A reader can choose their own book.|Readers can choose their own books.|Readers can choose his or her own book.|A readers can choose their own books.
  Every passenger must show their ticket.|All passengers must show their tickets.|All passengers must show his or her ticket.|Every passengers must show their tickets.
  Each artist signs their painting.|All artists sign their paintings.|All artists signs his or her painting.|Each artists sign their paintings.
  A cook washes their hands first.|Cooks wash their hands first.|Cooks washes his or her hands first.|A cooks wash their hands first.
  Every patient waits for their turn.|All patients wait for their turns.|All patients waits for his or her turn.|Every patients wait for their turns.
  Each scout carries their own water.|All scouts carry their own water.|All scouts carries his or her own water.|Each scouts carry their own water.
  A traveler should keep their passport safe.|Travelers should keep their passports safe.|Travelers should keep his or her passport safe.|A travelers should keep their passports safe.
  Every athlete stretches before their race.|All athletes stretch before their races.|All athletes stretches before his or her race.|Every athletes stretch before their races.
  Each child hangs up their coat.|All children hang up their coats.|All children hangs up his or her coat.|Each children hang up their coats.
  A student who is late must give their reason.|Students who are late must give their reasons.|Students who are late must give his or her reason.|A students who are late must give their reasons.
  Every dancer brings their own shoes.|All dancers bring their own shoes.|All dancers brings his or her own shoes.|Every dancers bring their own shoes.
  Each driver parks their car in the lot.|All drivers park their cars in the lot.|All drivers parks his or her car in the lot.|Each drivers park their cars in the lot.
  A hiker should carry their own map.|Hikers should carry their own maps.|Hikers should carry his or her own map.|A hikers should carry their own maps.
  Every author reads their book aloud.|All authors read their books aloud.|All authors reads his or her book aloud.|Every authors read their books aloud.
  Each team member wears their jersey.|All team members wear their jerseys.|All team members wears his or her jersey.|Each team members wear their jerseys.
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
  The vase was ___ during the move.|broken|broke|breaked
  The poem was ___ by a young girl.|written|wrote|writed
  My wallet was ___ on the train.|stolen|stole|stealed
  The house was ___ in 1920.|built|build|builded
  The cookies were ___ before lunch.|eaten|ate|eated
  The anthem was ___ before the game.|sung|sang|singed
  The award was ___ to our coach.|given|gave|gived
  The thief was ___ by the police.|caught|catched|caughted
  The pond was ___ by morning.|frozen|froze|freezed
  The rules were ___ aloud to the class.|read|readed|reading
  The ball was ___ over the fence.|thrown|threw|throwed
  The race was ___ by a runner from Kenya.|won|win|winned
  The picture was ___ by my aunt.|drawn|drew|drawed
  The truth was finally ___.|told|tell|telled
  The keys were ___ under the couch.|found|find|finded
  The boat was ___ away by the waves.|driven|drove|drived
  The shirt was ___ only once.|worn|wore|weared
  The letter was ___ to the wrong house.|sent|send|sended
  The tree was ___ down by the wind.|blown|blew|blowed
  The trophy was ___ in the front window.|hidden|hid|hided
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
  The ___ bikes were parked by the gate.|boys'|boys|boy's
  Six ___ marched in the parade.|bands|bands'|band's
  Both ___ tails were wagging.|dogs'|dogs|dog's
  The ___ uniforms were washed after the game.|players'|players|player's
  Three ___ sang at the wedding.|singers|singers'|singer's
  The two ___ nests were in the same tree.|birds'|birds|bird's
  Many ___ came to the open house.|parents|parents'|parent's
  All the ___ backpacks were on the floor.|students'|students|student's
  The ___ roots spread under the road.|trees'|trees|tree's
  Hundreds of ___ filled the sky.|kites|kites'|kite's
  The ___ hats blew off in the wind.|girls'|girls|girl's
  Five ___ arrived late to the meeting.|teachers|teachers'|teacher's
  The ___ voices echoed in the cave.|hikers'|hikers|hiker's
  Several ___ crossed the road at dawn.|horses|horses'|horse's
  The ___ wings were bright blue.|butterflies'|butterflies|butterfly's
  The ___ lined up at the bus stop.|kids|kids'|kid's
  Both ___ owners came to pick them up.|cats'|cats|cat's
  The ___ rang at noon in every church.|bells|bells'|bell's
  The ___ cages were cleaned every day.|rabbits'|rabbits|rabbit's
  Our ___ names were called one by one.|cousins'|cousins|cousin's
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
  cook + ing|cooking|cookking|cookin
  paint + ed|painted|paintted|paintd
  fix + ing|fixing|fixxing|fixeing
  happen + ed|happened|happenned|happend
  float + ing|floating|floatting|floatng
  show + ed|showed|showwed|shoed
  limit + ed|limited|limitted|limitd
  teach + er|teacher|teachher|teachr
  stay + ing|staying|stayying|staing
  order + ing|ordering|orderring|ordring
  look + ed|looked|lookked|lookd
  mix + ed|mixed|mixxed|mixd
  enter + ing|entering|enterring|entring
  clean + er|cleaner|cleanner|cleanr
  need + ed|needed|needded|neded
  blow + ing|blowing|blowwing|bloing
  edit + ed|edited|editted|editd
  sing + er|singer|singger|singr
  pray + ed|prayed|prayyed|praied
  offer + ing|offering|offerring|offring
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
    "I have one wish: a week at the beach.",
    "Pack these items: a tent, a lamp and a sleeping bag.",
    "The reason was obvious: the bus was late.",
    "She speaks three languages: English, Spanish and French.",
    "We learned an important lesson: always check the weather.",
    "The menu had two choices: soup or salad.",
    "The coach gave one order: run faster.",
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
    "The colors of the flag are: red, white and blue.",
    "We visited: Rome, Paris and London.",
    "My lunch includes: a sandwich, an apple and juice.",
    "The kit comes with: glue, tape and scissors.",
    "Her best subjects are: math and science.",
    "The team needs: a goalie and two defenders.",
    "I am afraid of: spiders, snakes and heights.",
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
  Neither of the girls ___ the answer.|knows|know|knowing
  Either of the paths ___ to the river.|goes|go|going
  Neither of the cakes ___ ready yet.|is|are|being
  Either of these shirts ___ fine for the party.|looks|look|looking
  Neither of my brothers ___ to swim.|likes|like|liking
  Either of the doctors ___ see you today.|is able to|are able to|being able to
  Neither of the lights ___ on.|was|were|being
  Either of the trains ___ at noon.|leaves|leave|leaving
  Neither of the songs ___ my favorite.|is|are|being
  Either of the rooms ___ a view of the sea.|has|have|having
  Neither of the players ___ hurt.|was|were|being
  Either of the answers ___ correct.|seems|seem|seeming
  Neither of the computers ___ working.|is|are|being
  Either of my parents ___ sign the form.|is allowed to|are allowed to|being allowed to
  Neither of the boxes ___ heavy.|feels|feel|feeling
  Either of the stores ___ milk.|sells|sell|selling
  Neither of the keys ___ the lock.|fits|fit|fitting
  Either of the coaches ___ the drills.|runs|run|running
  Neither of the stories ___ true.|was|were|being
  Either of the cats ___ on my bed.|sleeps|sleep|sleeping
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
  The pie smells ___.|good|well|goodly
  The fish tasted ___, so we sent it back.|bad|badly|worse
  That plan sounds ___ to me.|good|well|goodly
  The sky looked ___ at sunset.|beautiful|beautifully|beauty
  The coffee smells ___.|wonderful|wonderfully|wonder
  I feel ___ about forgetting your birthday.|bad|badly|worse
  The class became ___ when the principal walked in.|silent|silently|silence
  She seemed ___ after the long trip.|tired|tiredly|tiredness
  The water felt ___ on my hot feet.|cool|coolly|coolness
  The puppy looks ___ in its new bed.|comfortable|comfortably|comfort
  The answer seems ___ to me.|correct|correctly|correctness
  His voice sounded ___ on the phone.|calm|calmly|calmness
  The streets grew ___ after dark.|quiet|quietly|quietness
  The roses smell ___.|sweet|sweetly|sweetness
  The test looked ___ at first.|easy|easily|ease
  My grandmother stays ___ by walking every day.|healthy|healthily|health
  The leaves turned ___ in October.|red|redly|redness
  The kitten seemed ___ during the storm.|nervous|nervously|nerve
  The cake tastes ___.|delicious|deliciously|delight
  The baby looks ___ in that hat.|cute|cutely|cuteness
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
  the rainforest: a living world|The Rainforest: A Living World|The Rainforest: a Living World|The rainforest: A living world
  cats: the inside story|Cats: The Inside Story|Cats: the Inside Story|Cats: The Inside story
  the civil war: a short history|The Civil War: A Short History|The Civil War: a Short History|The Civil War: A Short history
  robots: how they work|Robots: How They Work|Robots: how They Work|Robots: How they work
  the arctic: a frozen land|The Arctic: A Frozen Land|The Arctic: a Frozen Land|The Arctic: A Frozen land
  soccer: the beautiful game|Soccer: The Beautiful Game|Soccer: the Beautiful Game|Soccer: The Beautiful game
  the human body: an owner's guide|The Human Body: An Owner's Guide|The Human Body: an Owner's Guide|The Human Body: An Owner's guide
  bees: the tiny farmers|Bees: The Tiny Farmers|Bees: the Tiny Farmers|Bees: The tiny farmers
  the moon landing: one giant leap|The Moon Landing: One Giant Leap|The Moon Landing: one Giant Leap|The Moon landing: One giant leap
  music: a world of sound|Music: A World of Sound|Music: a World of Sound|Music: A World Of Sound
  dinosaurs: the last days|Dinosaurs: The Last Days|Dinosaurs: the Last Days|Dinosaurs: The Last days
  the great lakes: a journey|The Great Lakes: A Journey|The Great Lakes: a Journey|The Great lakes: A journey
  growing up: a memoir|Growing Up: A Memoir|Growing Up: a Memoir|Growing up: A memoir
  storms: the power of weather|Storms: The Power of Weather|Storms: the Power of Weather|Storms: The Power Of Weather
  the brain: an introduction|The Brain: An Introduction|The Brain: an Introduction|The brain: An introduction
  chess: the game of kings|Chess: The Game of Kings|Chess: the Game of Kings|Chess: The Game Of Kings
  deserts: life in the dry lands|Deserts: Life in the Dry Lands|Deserts: life in the Dry Lands|Deserts: Life In The Dry Lands
  the sea: a history|The Sea: A History|The Sea: a History|The sea: A history
  inventions: the ideas that changed us|Inventions: The Ideas That Changed Us|Inventions: the Ideas That Changed Us|Inventions: The ideas that changed us
  gardens: a year of growing|Gardens: A Year of Growing|Gardens: a Year of Growing|Gardens: A Year Of Growing
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
  self + taught|self-taught|selftaught|self taught
  ex + champion (former)|ex-champion|exchampion|ex champion
  re + build|rebuild|re-build|re build
  pre + heat|preheat|pre-heat|pre heat
  anti + British|anti-British|antiBritish|anti British
  un + kind|unkind|un-kind|un kind
  all + inclusive|all-inclusive|allinclusive|all inclusive
  re + enter|re-enter|reenter|re enter
  dis + agree|disagree|dis-agree|dis agree
  self + aware|self-aware|selfaware|self aware
  pre + Columbian|pre-Columbian|preColumbian|pre Columbian
  un + tie|untie|un-tie|un tie
  ex + mayor (former)|ex-mayor|exmayor|ex mayor
  re + paint|repaint|re-paint|re paint
  all + around|all-around|allaround|all around
  mis + read|misread|mis-read|mis read
  self + respect|self-respect|selfrespect|self respect
  un + American|un-American|unAmerican|un American
  over + cook|overcook|over-cook|over cook
  semi + circle|semicircle|semi-circle|semi circle
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
