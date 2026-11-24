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
    "A relative clause describes the noun directly before its relative word (*who*, *which*, *that*, *whose*, *where*). In *The girl who won the race lives next door*, *who won the race* identifies which **girl**—not *race* or *door*.\n\n> **Watch out.** Nouns sitting *inside* the relative clause (like *race*) or at the end of the main clause (like *door*) are not what the clause modifies.",
    "关系从句修饰紧挨在关系词（*who*、*which*、*that*、*whose*、*where*）前面的名词。在 *The girl who won the race lives next door* 中，*who won the race* 限定的是哪个 **girl**，而不是 *race* 或 *door*。\n\n> **注意。** 出现在从句*里面*的名词（如 *race*）或主句末尾的名词（如 *door*）都不是从句修饰的对象。",
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
  (right) => [
    `The relative clause sits right after **${right}** and tells which one is meant.\n\n**Check.** Find the relative word (*who*, *that*, *whose*, *where*) and look one word to its left: it points directly back to **${right}**.`,
    `关系从句紧跟在 **${right}** 后面，说明指的是哪一个。\n\n**检验。** 找到关系词（*who*、*that*、*whose*、*where*）并往左看紧挨着的名词：它直接指回 **${right}**。`,
  ],
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
    "In comparisons after *than* or *as*, the second verb is often left unspoken: *She is taller than **I** (am)*. Silently finish the clause to test the pronoun's job: *than **I** am* needs subject case, while *She likes you more than (she likes) **me*** needs object case.\n\n> **Watch out.** Do not pick a *self*-pronoun (*myself*, *himself*) after *than* or *as* just to dodge the choice—complete the hidden verb instead.",
    "在 *than* 或 *as* 引导的比较中，后面的动词常被省略：*She is taller than **I** (am)*。在心里把省略的词补完整来判断代词成分：*than **I** am* 作主语用主格，而 *She likes you more than (she likes) **me*** 作宾语用宾格。\n\n> **注意。** 别为了回避主宾格选择而在 *than* 或 *as* 后面乱用反身代词（*myself*、*himself*）——补出省略的动词就能一眼看清。",
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
    `Complete the comparison: *${shown.replace("___", `**${right}**`)}*\n\n**Check.** Supply the implied verb (such as *am*, *is*, *do*, *did*, or *praised*): only **${right}** fits the subject or object slot once the full clause is spoken aloud.`,
    `把比较补完整：*${shown.replace("___", `**${right}**`)}*\n\n**检验。** 补出省略的动词（如 *am*、*is*、*do*、*did* 或 *praised*）再读一遍：只有 **${right}** 符合这个主语或宾语位置。`,
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
    "When a preposition (*to*, *for*, *with*, *from*, *about*, *by*) sits directly before the pronoun, use the object form **whom**: *To **whom** should I send the letter?* or *the friend with **whom** I traveled*.\n\n> **Watch out.** *Whose* shows possession and must be followed by a noun (*whose bag*), never used as the object of a preposition on its own.",
    "当介词（*to*、*for*、*with*、*from*、*about*、*by*）紧挨在代词前面时，用宾格 **whom**：*To **whom** should I send the letter?* 或 *the friend with **whom** I traveled*。\n\n> **注意。** *whose* 表示所属，后面必须跟名词（*whose bag*），不能单独作介词宾语。",
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
    `Because a preposition comes immediately before the blank, the object form **whom** is required: *${shown.replace("___", "**whom**")}*\n\n**Check.** Substitute *him* or *her* after the preposition (*to him*, *with her*, *from him*): since object *him* works instead of *he*, **whom** is right.`,
    `空格前面紧挨着介词，因此必须用宾格 **whom**：*${shown.replace("___", "**whom**")}*\n\n**检验。** 把空格换成 *him* 或 *her* 试试（*to him*、*with her*、*from him*）：能用宾格 *him* 而不是 *he*，就证明该用 **whom**。`,
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
    "An appositive that **identifies which one** is essential and takes **no commas**: *The poet Langston Hughes wrote about Harlem* (there are many poets, so the name is needed). An appositive that only **adds bonus information** about an already named person or place takes **commas**: *Langston Hughes, a poet, wrote about Harlem*.\n\n> **Watch out.** Test by crossing out the appositive—if the sentence suddenly loses who or what you mean (*The poet wrote about Harlem*), leave out the commas.",
    "**用来指明是哪一个**的同位语是必要成分，**不加逗号**：*The poet Langston Hughes wrote about Harlem*（诗人有很多，必须靠名字确定）。只是给已经明确的人或地名**补充信息**的同位语则要**加逗号**：*Langston Hughes, a poet, wrote about Harlem*。\n\n> **注意。** 试着划掉同位语——如果句子一下子说不清指的是谁（*The poet wrote about Harlem*），就不要加逗号。",
  ],
  ["Why is the appositive punctuated this way?", "这个同位语为什么这样加标点？"],
  appositiveLines,
  {
    "no commas: the name tells which one": L(
      "不加逗号：名字说明是哪一个",
      "Without the name, the reader would not know which one is meant, so the appositive is essential and takes **no commas**.\n\n**Check.** Drop the name from the sentence: the general noun before it (*the poet*, *my friend*, *the novel*) is no longer specific enough on its own.",
      "去掉名字，读者就不知道指的是哪一个，所以这个同位语是必要成分，**不加逗号**。\n\n**检验。** 试着把名字删掉：前面的普通名词（*the poet*、*my friend*、*the novel*）单独留下来指代就不够明确。",
      "The noun is already clear, so the appositive only adds information.",
      "这个名词已经很明确，同位语只是补充信息。",
    ),
    "commas: the appositive adds information": L(
      "加逗号：同位语补充信息",
      "The noun before the comma is already specific, so the appositive merely adds extra information and is set off with **commas**.\n\n**Check.** Lift the phrase between the commas out of the sentence: you still know the exact person, place, or work being discussed.",
      "逗号前面的名词已经足够明确，同位语只是补充信息，所以用**逗号**隔开。\n\n**检验。** 把两个逗号之间的短语拿掉：句子依然清楚地指着同一个人、地点或作品。",
      "The appositive is needed to tell which one is meant.",
      "需要这个同位语来说明是哪一个。",
    ),
  },
);

const participle = choose(
  "ing-or-ed-participles",
  ["-ing or -ed Participles", "-ing 还是 -ed 分词"],
  [
    "An **-ing** participle describes what *causes* a feeling (*an exciting game*, *a tiring climb*). An **-ed** participle describes the person or creature who *experiences* the feeling (*the excited fans*, *the tired hikers*).\n\n> **Watch out.** Ask whether the noun gives off the feeling (-ing) or feels it inside (-ed)—a *boring* student makes others yawn, while a *bored* student is the one yawning.",
    "以 **-ing** 结尾的分词描述*引起*某种感受的事物（*an exciting game*、*a tiring climb*）；以 **-ed** 结尾的分词描述*体验到*这种感受的人或动物（*the excited fans*、*the tired hikers*）。\n\n> **注意。** 分清名词是在制造感受（-ing）还是在感受情绪（-ed）——*boring* student 是让别人犯困的学生，而 *bored* student 才是自己觉得无聊的学生。",
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
    `The matching participle is **${right}**: *${shown.replace("___", `**${right}**`)}*\n\n**Check.** Ask whether the noun experiences the feeling (**-ed**) or causes it (**-ing**): **${right}** matches that direction.`,
    `正确的分词是 **${right}**：*${shown.replace("___", `**${right}**`)}*\n\n**检验。** 问问这个名词是在体验感受（**-ed**）还是在引发感受（**-ing**）：**${right}** 正好符合这个方向。`,
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
    "A misplaced modifier hooks onto the nearest noun—even if that creates a comical picture. Read literally: in *I saw a dog running down the street in my pajamas*, *in my pajamas* sits beside *dog*, so the sentence claims **the dog was wearing my pajamas**. Spotting the literal absurdity is how you catch misplaced modifiers in your own drafts.\n\n> **Watch out.** Do not pick what the writer *meant* to say—read the words in their actual order to see which noun the modifier accidentally grabs.",
    "错位修饰语会黏在离它最近的名词上，即使画面非常荒唐。按字面读：在 *I saw a dog running down the street in my pajamas* 中，*in my pajamas* 紧挨着狗，所以句子字面上说的是**狗穿着我的睡衣**。看出这种字面笑话，就能在自己的草稿里揪出错位修饰语。\n\n> **注意。** 别选作者*本来想说*的意思——按句子实际词序去读，看修饰语错抓住了哪个名词。",
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
  (right) => [
    `Read literally, the modifier attaches to the nearest noun, claiming: **${right}**\n\n**Check.** Trace a line from the modifying phrase to the noun right beside it (or right after the opening comma): that unintended pairing produces this exact comical claim.`,
    `按字面理解，修饰语依附在了紧挨着的名词上，变成了：**${right}**\n\n**检验。** 把修饰短语和紧挨着它的名词（或开头逗号后的主语）连起来看：正是这个错配造出了这句荒唐的字面意思。`,
  ],
  [
    ["That is what the writer meant, not what the sentence says as written.", "这是作者想表达的意思，而不是句子按原样写出来的意思。"],
    ["The modifier does not attach to that word either.", "修饰语也没有依附在那个词上。"],
  ],
);

const thatWhich = choose(
  "which-after-a-comma",
  ["Which After a Comma", "逗号后面用 which"],
  [
    "*That* introduces only essential clauses, so it never follows a comma. When a clause is set off by commas to add extra information, begin with **which** for things (*The book, **which** I borrowed, was long*) and **who** for people (*My aunt, **who** lives in Ohio, is visiting*).\n\n> **Watch out.** Check two things after a comma: first rule out *that*, then check whether the noun before the comma is a person (**who**) or a thing (**which**).",
    "*that* 只引导必要从句，所以绝不能跟在逗号后面。用逗号隔开、补充信息的非必要从句，指物用 **which**（*The book, **which** I borrowed, was long*），指人用 **who**（*My aunt, **who** lives in Ohio, is visiting*）。\n\n> **注意。** 看到逗号后先检查两件事：先排除 *that*，再看逗号前的名词是人（**who**）还是物（**which**）。",
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
    `After a comma, the nonessential clause cannot use *that*, so it takes **${right}**.\n\n**Check.** Look at the noun before the comma: because it is a ${right === "who" ? "person" : "thing or animal"} and the clause sits inside commas, **${right}** is the only valid relative pronoun.`,
    `逗号后面的非必要从句不能用 *that*，因此这里填 **${right}**。\n\n**检验。** 看逗号前的名词：它指${right === "who" ? "人" : "物或动物"}，且从句由逗号隔开，只有 **${right}** 符合规则。`,
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
    "A nonessential phrase or clause in the middle of a sentence needs **paired commas**—one to open it and one to close it: *My aunt, who lives in Ohio, is visiting*. Dropping either comma leaves the side comment glued to the subject or verb.\n\n> **Watch out.** Test your commas by lifting out everything between them: if the leftover sentence still reads cleanly (*My aunt is visiting*), both commas are in the right spots.",
    "插在句子中间的非必要短语或从句需要**成对的逗号**——一开一合：*My aunt, who lives in Ohio, is visiting*。漏掉任意一个逗号，都会把补充说明和主语或动词粘在一起。\n\n> **注意。** 检验方法很简单：把两个逗号之间的内容整段抽走，如果剩下的部分仍是一句通顺完整的话（*My aunt is visiting*），两个逗号就都放对了。",
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
  (right) => [
    `The correctly punctuated sentence is: **${right}** It sets off the nonessential middle element with both an opening and a closing comma.\n\n**Check.** Lift out the words between the two commas: the subject and verb on either side still link up into a complete, grammatical sentence.`,
    `标点正确的句子是：**${right}** 它用一前一后两个逗号把中间的非必要成分完整隔开。\n\n**检验。** 把两个逗号之间的内容抽掉：前后的主语和谓语依然能直接拼成一个通顺完整的句子。`,
  ],
  [
    ['"{wrong}" leaves out the comma after the element.', "“{wrong}”漏掉了成分后面的逗号。"],
    ['"{wrong}" leaves out the comma before the element.', "“{wrong}”漏掉了成分前面的逗号。"],
  ],
);

const myself = choose(
  "self-pronoun-or-object-pronoun",
  ["Self-Pronoun or Object Pronoun", "反身代词还是宾格代词"],
  [
    "A *self*-pronoun (*myself*) is valid only when *I* already appears as the subject in the same clause: *I taught **myself** guitar* or *I fixed it **myself***. When there is no *I* to point back to, use the ordinary object pronoun **me**: *Please give the tickets to Maria or **me***.\n\n> **Watch out.** Do not slip *myself* into a compound object (*to Maria or myself*) to sound polite—drop *Maria or* and test: you would never say *give the tickets to myself*.",
    "反身代词（*myself*）只有在同一个从句里已经出现主语 *I* 时才能使用：*I taught **myself** guitar* 或 *I fixed it **myself***。句中没有 *I* 可以回指时，用普通宾格 **me**：*Please give the tickets to Maria or **me***。\n\n> **注意。** 别为了听起来客气就在并列宾语里用 *myself*（*to Maria or myself*）——把 *Maria or* 去掉试试：没人会说 *give the tickets to myself*。",
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
    `The right pronoun is **${right}**: *${shown.replace("___", `**${right}**`)}*\n\n**Check.** Look at the subject of the sentence: ${right === "myself" ? "the subject is *I*, so **myself** refers directly back to it" : "the subject is not *I*, so there is no antecedent for *myself*—and dropping the other name leaves **me** alone after the verb or preposition"}.`,
    `这里该用 **${right}**：*${shown.replace("___", `**${right}**`)}*\n\n**检验。** 看句子的主语：${right === "myself" ? "主语正是 *I*，所以 **myself** 可以直接回指主语" : "主语不是 *I*，没有供 *myself* 回指的对象；而且去掉另一个人名后，动词或介词后面自然只剩 **me**"}。`,
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
    "Starting a second sentence with a bare *This* or *It* leaves readers guessing which detail you mean: *The bus was late again. This made us miss the play.* Adding a summary noun right after *This* locks in the meaning: ***This delay** made us miss the play.*\n\n> **Watch out.** Whenever you start a sentence with *This*, ask yourself *This what?*—if you can name the idea in one word (*this delay*, *this rule*, *this discovery*), write that noun.",
    "第二句开头只写一个光秃秃的 *This* 或 *It*，会让读者猜不准指代的是哪件事：*The bus was late again. This made us miss the play.* 在 *This* 后面加上概括名词就能锁死指代：***This delay** made us miss the play.*\n\n> **注意。** 每次用 *This* 开头时，问自己一句*这个什么？*——只要能用一个词概括前面的意思（*this delay*、*this rule*、*this discovery*），就把它写出来。",
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
  (right) => [
    `**${right}** names the idea from the first sentence directly instead of leaving a bare pronoun hanging.\n\n**Check.** Read the second sentence on its own: **${right}** tells the reader what happened without forcing them to hunt back through the first sentence.`,
    `**${right}** 直接点明了前一句说的那件事，而不是留下一个含糊的光杆代词。\n\n**检验。** 单独读第二句：**${right}** 让读者立刻明白指什么，不必回头在前一句里猜。`,
  ],
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
    "To proofread a sentence with a prepositional phrase between subject and verb, cover the phrase with your thumb and read what remains: *The box (of old letters) **is** in the attic*. If the verb matches the noun inside the phrase (*letters are*) instead of the true subject (*box*), it **agrees with the noun in the phrase**.\n\n> **Watch out.** Phrases beginning with *of*, *in*, *on*, *to*, or *with* never contain the subject—always jump left past the preposition to find the real subject.",
    "校对主语和动词之间夹着介词短语的句子时，用手遮住短语再读剩下的部分：*The box (of old letters) **is** in the attic*。如果动词跟着短语里的名词变（*letters are*）而不是跟着真正的主语（*box*），它就**与短语中的名词一致**了。\n\n> **注意。** 由 *of*、*in*、*on*、*to*、*with* 引导的短语里绝不会出现主语——务必越过介词往左找真正的主语。",
  ],
  ["Is the verb in this sentence correct?", "这个句子中的动词正确吗？"],
  agreementLabels,
  {
    correct: L(
      "正确",
      "Covering the phrase between subject and verb shows that the verb matches the true subject; this sentence is **correct**.\n\n**Check.** Read just the subject and verb side by side without the middle phrase: singular subject pairs with singular verb, or plural with plural.",
      "遮住主语和动词之间的短语后，动词与真正的主语一致，所以这句**正确**。\n\n**检验。** 去掉中间的介词短语，把主语和动词挨在一起读：单数配单数，复数配复数，完全吻合。",
      "With the phrase covered, the verb does not fit the subject.",
      "遮住短语后，动词与主语不一致。",
    ),
    "agrees with the noun in the phrase": L(
      "与短语中的名词一致",
      "The verb mistakenly matches the noun inside the prepositional phrase instead of the real subject before it; it **agrees with the noun in the phrase**.\n\n**Check.** Cross out the *of/in/on/to/with* phrase and read the subject straight into the verb: the mismatch jumps out right away.",
      "动词误跟介词短语里的名词保持一致，而忽略了前面真正的主语，因此属于**与短语中的名词一致**。\n\n**检验。** 划掉 *of/in/on/to/with* 短语，直接把主语和动词连起来读：单复数不搭配立刻暴露出来。",
      "The verb agrees with the subject.",
      "动词与主语一致。",
    ),
  },
);

const numberStart = choose(
  "a-number-at-the-start",
  ["A Number at the Start", "句首的数字"],
  [
    "Never begin a sentence with a numeral like *25*. Spell the number out in words, and put a hyphen between tens and ones from *twenty-one* to *ninety-nine*: ***Twenty-five** students signed up*.\n\n> **Watch out.** Two traps appear together here: leaving a digit at the start (*25*) and forgetting the hyphen in a compound number (*Twenty five*).",
    "句首不要直接写阿拉伯数字（如 *25*），而要把数字拼写出来，并且在 *twenty-one* 到 *ninety-nine* 的十位和个位之间加连字符：***Twenty-five** students signed up*。\n\n> **注意。** 这里常同时踩两个坑：句首保留数字（*25*），或者忘了给复合数字加连字符（*Twenty five*）。",
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
    `**${right}** spells the sentence-opening number out in words and connects tens and ones with a hyphen.\n\n**Check.** Verify both rules at once: no Arabic numeral starts the sentence, and the compound number between 21 and 99 carries a hyphen.`,
    `**${right}** 在句首把数字拼写成了英文单词，并用连字符连接十位和个位。\n\n**检验。** 同时核对两条规则：句首不用阿拉伯数字，且 21 到 99 之间的复合数字中间带有连字符。`,
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
    "A sentence that opens with singular *every student* and switches to *their* shifts number. One clean fix is to shift the **entire** sentence to plural: *Every student must bring their lunch* → ***All students** must bring **their** lunches*. Remember to update the determiner, noun, verb, and pronoun together.\n\n> **Watch out.** Never write *Every students* or *A drivers*—*every*, *each*, and *a* only work with singular nouns, so drop them or change them to *all* when making the subject plural.",
    "句子用单数 *every student* 开头，后面却换成 *their*，就出现了数的变换。一个利落的改法是把**整句**都改成复数：*Every student must bring their lunch* → ***All students** must bring **their** lunches*。注意限定词、名词、动词和代词要一起改。\n\n> **注意。** 千万别写成 *Every students* 或 *A drivers*——*every*、*each* 和 *a* 只能配单数名词，改复数时要把它们删掉或换成 *all*。",
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
  (right) => [
    `The consistent plural revision is: **${right}** Subject, verb, and pronoun all stay plural from start to finish.\n\n**Check.** Scan three spots in order—the opening noun phrase, the main verb, and the pronoun *their*—and confirm no singular marker (*every*, *each*, *a*, *his or her*, or *-s* verb) remains.`,
    `通篇保持复数的改写是：**${right}** 主语、动词和代词从头到尾都是复数。\n\n**检验。** 依次核对三处——开头名词短语、主谓动词和代词 *their*——确认没有残留任何单数标记（*every*、*each*、*a*、*his or her* 或单三动词）。`,
  ],
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
    "The passive voice pairs a form of *be* (*is*, *was*, *were*, *has been*) with a **past participle**: *The window **was broken** by the ball*. Irregular verbs often have a different past participle from their simple past (*broken*, not *broke*; *written*, not *wrote*), and invented *-ed* forms like *breaked* never exist.\n\n> **Watch out.** Test the verb in the frame *have ___* (*have broken*, *have written*, *have sung*)—the exact same form goes after *was* or *were* in the passive.",
    "被动语态由 *be* 的某种形式（*is*、*was*、*were*、*has been*）加**过去分词**构成：*The window **was broken** by the ball*。不规则动词的过去分词往往不同于一般过去式（是 *broken* 而非 *broke*，是 *written* 而非 *wrote*），而 *breaked* 这类生造的 *-ed* 形式根本不存在。\n\n> **注意。** 用 *have ___* 框架测试一下（*have broken*、*have written*、*have sung*）——被动语态里 *was* 或 *were* 后面用的正是同一个形式。",
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
    `After a form of *be*, the passive voice requires the past participle **${right}**.\n\n**Check.** Put **${right}** after *has/have* (*has ${right}*): it is the genuine past participle, whereas the simple past or a made-up *-ed* form fails that test.`,
    `在 *be* 动词后面，被动语态必须使用过去分词 **${right}**。\n\n**检验。** 把 **${right}** 放进 *has/have ___*（*has ${right}*）检验：它正是标准的过去分词，而一般过去式或生造的 *-ed* 形式都通不过这个检验。`,
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
    "A plain **plural** only counts (*The players ran onto the field*). A **plural possessive** owns the noun right after it (*the players' uniforms*). Ask two quick questions: does the word own the next noun, and are there several owners (*s'*) or just one (*'s*)?\n\n> **Watch out.** Do not add an apostrophe to a plain plural just because it ends in *-s*—if a verb follows immediately (*The players ran*), no ownership is being shown.",
    "普通**复数**只表示数量（*The players ran onto the field*）；**复数所有格**则拥有紧跟在后面的名词（*the players' uniforms*）。快速问自己两个问题：这个词有没有拥有后面的名词？拥有者是多个（*s'*）还是一个（*'s*）？\n\n> **注意。** 别一看到词尾有 *-s* 就顺手加撇号——如果后面紧跟着动词（*The players ran*），并没有表示所属关系。",
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
    `The completed sentence is *${shown.replace("___", `**${right}**`)}* Here **${right}** is ${right.endsWith("'") ? "a plural possessive owning the noun right after it" : "a plain plural with nothing owned after it"}.\n\n**Check.** Look at the word directly after the blank: ${right.endsWith("'") ? "it is a noun belonging to more than one owner, so the apostrophe goes *after* the *-s*" : "it is a verb or preposition rather than an owned noun, so no apostrophe belongs here"}.`,
    `完整的句子是 *${shown.replace("___", `**${right}**`)}* 这里的 **${right}** 是${right.endsWith("'") ? "拥有后面名词的复数所有格" : "只表示数量的普通复数"}。\n\n**检验。** 看空格紧后面的词：${right.endsWith("'") ? "它是属于多个拥有者的名词，所以撇号放在 *-s* 后面" : "它是动词或介词，不是被拥有的名词，所以不需要撇号"}。`,
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
    "Double the final consonant before *-ing*, *-ed*, or *-er* only after a **single stressed short vowel** followed by **one** consonant (*stop* → *stopping*). Do **not** double after two vowels (*rain* → *raining*), two consonants (*jump* → *jumped*), final *w/x/y* (*box* → *boxing*), or an unstressed final syllable (*open* → *opening*).\n\n> **Watch out.** Say two-syllable words aloud to hear the stress: *OP-en* and *VIS-it* stress the first syllable, so the final consonant stays single.",
    "只有在**重读的单个短元音**后接**单个**辅音时，加 *-ing*、*-ed* 或 *-er* 才双写末尾辅音（*stop* → *stopping*）。以下情况**不**双写：前面有两个元音（*rain* → *raining*）、末尾有两个辅音（*jump* → *jumped*）、以 *w/x/y* 结尾（*box* → *boxing*），或末尾音节非重读（*open* → *opening*）。\n\n> **注意。** 把双音节词大声读出来听重音：*OP-en* 和 *VIS-it* 的重音都在第一音节，所以末尾辅音不双写。",
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
    `**${right}** keeps the final consonant single because the base word does not meet the doubling rule.\n\n**Check.** Inspect the end of the base word: it has two vowels, two consonants, *w/x/y*, or an unstressed ending—so simply attach the suffix directly without doubling or dropping letters.`,
    `**${right}** 保留了单个末尾辅音，因为原词不符合双写条件。\n\n**检验。** 检查原词词尾：它要么前面有两个元音、要么以双辅音或 *w/x/y* 结尾、要么尾音节不重读——因此直接接后缀，既不双写也不删字母。`,
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
    "A colon must follow a **complete sentence**: *We need three things: flour, eggs and milk*. Putting a colon right after a verb or preposition cuts the sentence in half: *My favorite sports are: soccer…* is wrong. Either delete the colon or finish the sentence with words like *the following*.\n\n> **Watch out.** Cover everything from the colon to the end—if what is left before the colon cannot stand as a complete sentence (*We need*, *The box was full of*), the colon does not belong.",
    "冒号必须跟在**完整的句子**后面：*We need three things: flour, eggs and milk*。把冒号直接放在动词或介词后面会把句子拦腰截断：*My favorite sports are: soccer…* 是错的。要么删掉冒号，要么加上 *the following* 把前半句说完整。\n\n> **注意。** 遮住冒号及后面的所有内容——如果冒号前面剩下的部分不能独立成句（如 *We need*、*The box was full of*），这个冒号就不该用。",
  ],
  ["Is the colon used correctly?", "这个冒号用得对吗？"],
  colonLabels,
  {
    "correct colon": L(
      "冒号正确",
      "The words before the colon form a complete sentence that introduces the list or explanation; this is a **correct colon**.\n\n**Check.** Put a period right where the colon sits and read the first half alone: it stands cleanly as a full sentence.",
      "冒号前面的部分本身就是完整句子，用来引出后面的列举或解释，因此**冒号正确**。\n\n**检验。** 把冒号临时换成句号，单读前半句：意思完整，可以独立成句。",
      "The colon comes right after a verb or a preposition.",
      "冒号紧跟在动词或介词后面。",
    ),
    "colon after a verb or preposition": L(
      "冒号用在动词或介词之后",
      "The colon interrupts the sentence directly after a verb (*are*, *need*, *includes*) or a preposition (*of*, *on*, *with*); this is a **colon after a verb or preposition**.\n\n**Check.** Stop reading at the colon: the words before it leave you hanging with an unfinished thought, proving the colon splits the sentence improperly.",
      "冒号紧跟在动词（*are*、*need*、*includes*）或介词（*of*、*on*、*with*）后面，把句子硬生生切开，属于**冒号用在动词或介词之后**。\n\n**检验。** 读到冒号就停下：前半截话明显没说完，证明冒号不该插在这里。",
      "The words before the colon form a complete sentence.",
      "冒号前面的词组成了一个完整的句子。",
    ),
  },
);

const neitherOf = choose(
  "neither-of-and-either-of",
  ["Neither Of and Either Of", "neither of 和 either of"],
  [
    "Standing before *of*, **either** (either one) and **neither** (not one) are singular in formal writing and take a singular verb: *Neither of the twins **is** ready*; *Either of the roads **leads** to town*. That differs from *neither … nor*, where the verb matches the nearer subject.\n\n> **Watch out.** Do not let the plural noun after *of* (*twins*, *roads*, *answers*) pull the verb into the plural—mentally insert *one*: *Neither [one] of the twins **is** ready*.",
    "放在 *of* 前面的 **either**（两者中任一个）和 **neither**（两者中哪一个都不）在正式写作中都作单数，配单数动词：*Neither of the twins **is** ready*；*Either of the roads **leads** to town*。这和 *neither … nor* 不同，后者的动词看就近主语。\n\n> **注意。** 别被 *of* 后面的复数名词（*twins*、*roads*、*answers*）带偏成复数动词——在心里补一个 *one*：*Neither [one] of the twins **is** ready*。",
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
    `In formal writing, *either* and *neither* are singular, so **${right}** is right: *${shown.replace("___", `**${right}**`)}*\n\n**Check.** Cover the *of* phrase and read *Neither/Either one **${right}***: the singular finite verb agrees cleanly with *one*.`,
    `在正式写作中，*either* 和 *neither* 作单数，所以该用 **${right}**：*${shown.replace("___", `**${right}**`)}*\n\n**检验。** 遮住 *of* 短语，读作 *Neither/Either one **${right}***：单数限定动词和 *one* 严丝合缝。`,
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
    "Linking verbs (*be*, *seem*, *look*, *taste*, *smell*, *sound*, *feel*, *grow*, *become*, *stay*, *turn*) connect the subject to an **adjective** that describes the subject: *The soup tastes **good***; *The milk smells **bad***. Action verbs take adverbs (*She sings **well***).\n\n> **Watch out.** Replace the verb with *is* or *was*—if the sentence still makes sense (*The soup **is** good*, *The garden **is** beautiful*), the verb is acting as a linking verb and takes an adjective, not an *-ly* adverb.",
    "系动词（*be*、*seem*、*look*、*taste*、*smell*、*sound*、*feel*、*grow*、*become*、*stay*、*turn*）把主语和描述主语的**形容词**连起来：*The soup tastes **good***；*The milk smells **bad***。行为动词后面才用副词（*She sings **well***）。\n\n> **注意。** 把动词临时换成 *is* 或 *was*——如果句子依然说得通（*The soup **is** good*、*The garden **is** beautiful*），它就是系动词，后面要用形容词，而不是 *-ly* 副词。",
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
    `The linking verb calls for the adjective **${right}**: *${shown.replace("___", `**${right}**`)}*\n\n**Check.** Swap the verb for *is* or *was* (*It is **${right}***): the adjective describes the subject directly, whereas an *-ly* adverb or noun does not fit.`,
    `系动词后面要用形容词 **${right}**：*${shown.replace("___", `**${right}**`)}*\n\n**检验。** 把动词换成 *is* 或 *was*（*It is **${right}***）：形容词直接描述主语，而 *-ly* 副词或名词都放不进去。`,
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
    "In a title, always capitalize the **first word after a colon**, even if it is a short article or preposition like *a*, *an*, *the*, or *from*: *Star Wars: **A** New Hope*. Also capitalize the first word, the last word, and all major words, while keeping other short articles, conjunctions, and prepositions lowercase.\n\n> **Watch out.** Treat the subtitle after a colon like a fresh title—so *a*, *the*, and *of* stay lowercase inside the title, *except* right at the start or right after the colon.",
    "在标题中，**冒号后的第一个词**一律大写，哪怕它是 *a*、*an*、*the* 或 *from* 这样的小词：*Star Wars: **A** New Hope*。标题的首词、尾词和所有实词也要大写，其余短冠词、连词和介词保持小写。\n\n> **注意。** 把冒号后的副标题当成新标题的开头——*a*、*the*、*of* 在标题中间小写，但出现在最开头或紧跟冒号后面时必须大写。",
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
    `**${right}** follows every title-capitalization rule, including capitalizing the first word right after the colon.\n\n**Check.** Check three checkpoints in **${right}**: the first word, the first word after the colon, and the last word are all capitalized, while short inner words like *of*, *in*, and *the* stay lowercase.`,
    `**${right}** 完整遵守了标题大小写规则，包括把冒号后的第一个词大写。\n\n**检验。** 核对 **${right}** 中的三个关键位置：首词、冒号后首词和尾词都已大写，而中间的 *of*、*in*、*the* 等小词保持小写。`,
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
    "Most prefixes join straight onto the base word with **no hyphen**: *rewrite*, *preview*, *unhappy*, *misspell*. Add a hyphen before a **capital letter** or **number** (*anti-American*, *pre-1900*), after *self-*, *ex-* (former), and *all-* (*self-made*, *ex-president*, *all-star*), or to separate a confusing double vowel (*re-elect*).\n\n> **Watch out.** Do not drop a double consonant when prefix and root meet—*mis + spell* joins cleanly into *misspell* with both *s*'s and no hyphen.",
    "大多数前缀直接连在词根上，**不加连字符**：*rewrite*、*preview*、*unhappy*、*misspell*。遇到**大写字母**或**数字**前（*anti-American*、*pre-1900*），在 *self-*、表示“前任”的 *ex-* 和 *all-* 后（*self-made*、*ex-president*、*all-star*），或为了隔开易混淆的双元音（*re-elect*）时，才加连字符。\n\n> **注意。** 前缀和词根相接时别删掉重复辅音——*mis + spell* 直接合成 *misspell*，保留两个 *s* 且不加连字符。",
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
  (right) => [
    `**${right}** applies the hyphenation rule for this prefix accurately.\n\n**Check.** Ask whether the word triggers one of the hyphen exceptions (*self-*, *ex-*, *all-*, a capital letter, or awkward double *e*): ${right.includes("-") ? "yes, so the hyphen is required" : "no, so the prefix joins directly as one solid word"}.`,
    `**${right}** 准确遵守了这个前缀的连字符规则。\n\n**检验。** 对照连字符例外清单（*self-*、*ex-*、*all-*、大写字母或难读的双元音 *ee*）：${right.includes("-") ? "触发了例外，因此必须加连字符" : "未触发例外，因此直接合写成一个词"}。`,
  ],
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
