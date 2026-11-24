// Grade 1: building sentences. A sentence starts with a capital letter and ends with a mark, puts its words in order,
// and is made of naming words, action words and describing words; it can tell or ask, and two can be joined by *and*.

import type { TopicDef } from "@ga/content";
import { choose, type Label, label, type Pair, topic } from "../grade-6/kit.ts";

/** L builds a label from its Chinese name, why it is right and why it is not. */
const L = (zh: string, whyEn: string, whyZh: string, notEn: string, notZh: string): Label => ({
  zh,
  why: [whyEn, whyZh],
  not: [notEn, notZh],
});

/** filled is a sentence with its blank filled by the right word. */
const filled = (shown: string, right: string) => shown.replace("___", right);

/** wordAfterBlank returns the word right after ___ in a fill-in-the-blank prompt. */
const wordAfterBlank = (shown: string) => {
  const after = shown.split("___")[1]?.trim() ?? "";
  return after.split(/\s+/u)[0]?.replace(/[.,!?]+$/u, "") ?? "";
};

const capitals = topic("grammar", {
  id: "starting-a-sentence-with-a-capital",
  title: ["Starting a Sentence with a Capital", "句子以大写字母开头"],
  summary: [
    "Every sentence starts with a capital letter, and the word *I* is always a capital.",
    "每个句子都以大写字母开头，单词 *I* 总是大写。",
  ],
  intro: [
    "You write a short note on your drawing: *My dog runs fast.* Look at the very first letter—it is a big **M** so the reader knows a new sentence starts there. In this lesson, you will start sentences with a capital letter and always write **I** big.",
    "你在自己的画下面写了一句话：*My dog runs fast.* 看最前面那个字母——它是个大写的 **M**，告诉看画的人新的一句话从这里开始。这节课，你会练习句首大写，以及把 **I** 永远写成大写。",
  ],
  after: ["first-and-last-letters"],
  xp: 10,
  points: [
    choose(
      "the-first-letter",
      ["The First Letter", "第一个字母"],
      [
        "A sentence always starts with a **capital letter**: ***T**he cat sat.*, not *the cat sat.* Look at the very first letter of the first word and make it big.\n\n> **Watch out.** Do not put the capital on the second letter or the second word by mistake.",
        "句子总是以**大写字母**开头：要写 ***T**he cat sat.*，不能写 *the cat sat.*。盯住第一个词的首字母，把它写成大写。\n\n> **注意。** 不要错把大写放到第二个字母或第二个词上。",
      ],
      ["Which sentence starts the right way?", "哪个句子的开头是对的？"],
      `
      the dog can run|The dog can run.|the dog can run.|tHe dog can run.
      a cat is on the mat|A cat is on the mat.|a cat is on the mat.|a Cat is on the mat.
      my hat is red|My hat is red.|my hat is red.|my Hat is red.
      we sit in the sun|We sit in the sun.|we sit in the sun.|we Sit in the sun.
      the bug is on a log|The bug is on a log.|the bug is on a log.|the Bug is on a log.
      dad has a big van|Dad has a big van.|dad has a big van.|dad Has a big van.
      it is hot|It is hot.|it is hot.|iT is hot.
      sam can hop|Sam can hop.|sam can hop.|sam Can hop.
      mom got a pen|Mom got a pen.|mom got a pen.|mom Got a pen.
      ten pigs sit in the mud|Ten pigs sit in the mud.|ten pigs sit in the mud.|ten Pigs sit in the mud.
      the sun is up|The sun is up.|the sun is up.|the Sun is up.
      a fox ran off|A fox ran off.|a fox ran off.|a Fox ran off.
      we have a pet|We have a pet.|we have a pet.|we Have a pet.
      my bag is big|My bag is big.|my bag is big.|my Bag is big.
      the bus is red|The bus is red.|the bus is red.|the Bus is red.
      kim can sing|Kim can sing.|kim can sing.|kim Can sing.
      the hen sat on an egg|The hen sat on an egg.|the hen sat on an egg.|the Hen sat on an egg.
      six ducks swim|Six ducks swim.|six ducks swim.|six Ducks swim.
      a bird is in the tree|A bird is in the tree.|a bird is in the tree.|a Bird is in the tree.
      we like the park|We like the park.|we like the park.|we Like the park.
      my mom can run fast|My mom can run fast.|my mom can run fast.|my Mom can run fast.
      the cup is on the desk|The cup is on the desk.|the cup is on the desk.|the Cup is on the desk.
      ben has a cap|Ben has a cap.|ben has a cap.|ben Has a cap.
      it is time for lunch|It is time for lunch.|it is time for lunch.|it Is time for lunch.
      the frog can jump|The frog can jump.|the frog can jump.|the Frog can jump.
      we got wet in the rain|We got wet in the rain.|we got wet in the rain.|we Got wet in the rain.
      a big ship is in the sea|A big ship is in the sea.|a big ship is in the sea.|a Big ship is in the sea.
      dad can fix the bed|Dad can fix the bed.|dad can fix the bed.|dad Can fix the bed.
      my cat naps a lot|My cat naps a lot.|my cat naps a lot.|my Cat naps a lot.
      the kids sit on the rug|The kids sit on the rug.|the kids sit on the rug.|the Kids sit on the rug.
      `,
      (right) => [
        `*${right}* starts with a capital **${right[0]}** on the first word.\n\n**Check.** Point to the very first letter (**${right[0]}**): it is big, and the rest of the first word stays small.`,
        `*${right}* 的第一个词以大写字母 **${right[0]}** 开头。\n\n**检验。** 指着最前面那个字母（**${right[0]}**）：它是大写的，第一个词后面的字母都是小写。`,
      ],
      [
        ["*{wrong}* starts with a small letter, so it is missing its starting capital.", "*{wrong}* 以小写字母开头，漏掉了句首大写。"],
        [
          "*{wrong}* puts the capital in the wrong spot instead of on the very first letter.",
          "*{wrong}* 把大写放错了位置，应该放在最前面的第一个字母上。",
        ],
      ],
    ),
    choose(
      "the-word-i",
      ["The Word I", "单词 I"],
      [
        "When you write about yourself, the word **I** is always a capital letter—at the start or in the middle: *Mom and **I** ran.* Remember to start the sentence with a capital too.\n\n> **Watch out.** Never write the word *I* as a small *i*, even in the middle of a sentence.",
        "写自己时，单词 **I** 永远要大写，不管在句首还是句中：*Mom and **I** ran.* 别忘了句子开头也要大写。\n\n> **注意。** 即使在句子中间，也绝不能把表示“我”的 *I* 写成小写 *i*。",
      ],
      ["Which sentence is written the right way?", "哪个句子写对了？"],
      `
      I am six|I am six.|i am six.|I Am six.
      can I|Can I go?|Can i go?|can I go?
      Mom and I|Mom and I ran.|Mom and i ran.|mom and I ran.
      I had fun|I had fun.|i had fun.|I had Fun.
      Dad and I|Dad and I sat.|Dad and i sat.|dad and I sat.
      I got a cup|I got a cup.|i got a cup.|I Got a cup.
      I can hop|I can hop.|i can hop.|I can Hop.
      Then I hid|Then I hid.|Then i hid.|then I hid.
      I like it|I like it.|i like it.|I Like it.
      Sam and I|Sam and I dig.|Sam and i dig.|sam and I dig.
      I am at home|I am at home.|i am at home.|I Am at home.
      I can see it|I can see it.|i can see it.|I can See it.
      Mom and I sing|Mom and I sing.|Mom and i sing.|mom and I sing.
      Can I sit here|Can I sit here?|Can i sit here?|can I sit here?
      I ran to the bus|I ran to the bus.|i ran to the bus.|I Ran to the bus.
      Ben and I swim|Ben and I swim.|Ben and i swim.|ben and I swim.
      I have a red pen|I have a red pen.|i have a red pen.|I have a Red pen.
      May I go out|May I go out?|May i go out?|may I go out?
      I like my cat|I like my cat.|i like my cat.|I like My cat.
      Then I sat down|Then I sat down.|Then i sat down.|then I sat down.
      I got a new hat|I got a new hat.|i got a new hat.|I got a New hat.
      Kim and I play|Kim and I play.|Kim and i play.|kim and I play.
      Do I get a cup|Do I get a cup?|Do i get a cup?|do I get a cup?
      I fed the dog|I fed the dog.|i fed the dog.|I Fed the dog.
      Gran and I bake|Gran and I bake.|Gran and i bake.|gran and I bake.
      I see the moon|I see the moon.|i see the moon.|I see the Moon.
      Can I help|Can I help?|Can i help?|can I help?
      I am in the van|I am in the van.|i am in the van.|I am in the Van.
      Dad and I dig|Dad and I dig.|Dad and i dig.|dad and I dig.
      I hid in the box|I hid in the box.|i hid in the box.|I Hid in the box.
      `,
      (right) => [
        `*${right}* capitalizes both the first word and the word **I**, and keeps ordinary words small.\n\n**Check.** Run two quick checks on *${right}*: (1) the first letter (**${right[0]}**) is big, and (2) the word **I** stands tall as a capital.`,
        `*${right}* 把第一个词和单词 **I** 都写成了大写，其他普通词保持小写。\n\n**检验。** 对 *${right}* 做两步检查：（1）第一个字母（**${right[0]}**）是大写；（2）单词 **I** 是大写的。`,
      ],
      [
        [
          "*{wrong}* writes *I* as a small letter, but *I* is always a capital.",
          "*{wrong}* 把 *I* 写成了小写，但表示“我”的 *I* 总是大写的。",
        ],
        [
          "*{wrong}* either forgets the capital at the start or puts an extra capital on an ordinary word.",
          "*{wrong}* 要么漏掉了句首大写，要么把普通词写成了大写。",
        ],
      ],
    ),
  ],
});

const names = topic("grammar", {
  id: "capitals-for-names",
  title: ["Capitals for Names", "名字用大写"],
  summary: ["The name of a person, a pet, a day or a place starts with a capital letter.", "人名、宠物名、星期名和地名都以大写字母开头。"],
  intro: [
    "Look at the cubby tags in your classroom: *Maya*, *Leo*, *Nora*. Every name starts with a big letter because it belongs to one special person. Days and places get a big letter too!",
    "看看教室里收纳格上的名字牌：*Maya*、*Leo*、*Nora*。每个名字都以大写字母开头，因为它属于某一个特别的人。星期几和地名也一样要大写！",
  ],
  after: ["starting-a-sentence-with-a-capital"],
  xp: 10,
  points: [
    choose(
      "names-of-people-and-pets",
      ["Names of People and Pets", "人和宠物的名字"],
      [
        "A **name** is the special word for one person or pet, like ***S**am*, ***L**ily*, or ***R**ex*. It always starts with a capital letter, even in the middle of a sentence: *I see **Sam**.*\n\n> **Watch out.** Capitalize only the first letter of a name—not the second letter too.",
        "**名字**是某一个特定的人或宠物的称呼，比如 ***S**am*、***L**ily*、***R**ex*。不管在句首还是句中，名字的首字母都要大写：*I see **Sam**.*\n\n> **注意。** 名字只需要第一个字母大写，不要把后面的字母也写成大写。",
      ],
      ["Which sentence writes the name the right way?", "哪个句子的名字写对了？"],
      `
      Sam|I see Sam.|I see sam.|I see SAm.
      Lily|This is Lily.|This is lily.|This is LIly.
      Rex|Our dog is Rex.|Our dog is rex.|Our dog is ReX.
      Ben|I sat with Ben.|I sat with ben.|I sat with bEn.
      Max|The cat is Max.|The cat is max.|The cat is mAx.
      Ann|Ann has a hat.|ann has a hat.|aNn has a hat.
      Tom|Tom can swim.|tom can swim.|tOm can swim.
      Meg|Meg and I run.|meg and I run.|mEg and I run.
      Kim|I like Kim.|I like kim.|I like KIm.
      Dan|Dan got a bat.|dan got a bat.|dAn got a bat.
      Pam|I met Pam.|I met pam.|I met PAm.
      Jack|Jack has a dog.|jack has a dog.|jAck has a dog.
      Rosa|Rosa can read.|rosa can read.|rOsa can read.
      Spot|Our pup is Spot.|Our pup is spot.|Our pup is SPot.
      Nick|I play with Nick.|I play with nick.|I play with NIck.
      Ella|Ella sat down.|ella sat down.|eLla sat down.
      Fluffy|My cat is Fluffy.|My cat is fluffy.|My cat is FLuffy.
      Omar|Omar likes to sing.|omar likes to sing.|oMar likes to sing.
      Sue|I wave to Sue.|I wave to sue.|I wave to SUe.
      Gus|Gus is a fish.|gus is a fish.|gUs is a fish.
      Mia|Mia has a red bag.|mia has a red bag.|mIa has a red bag.
      Leo|I sit by Leo.|I sit by leo.|I sit by LEo.
      Bella|The hen is Bella.|The hen is bella.|The hen is BElla.
      Raj|Raj can kick the ball.|raj can kick the ball.|rAj can kick the ball.
      Nina|I help Nina.|I help nina.|I help NIna.
      Coco|Our bird is Coco.|Our bird is coco.|Our bird is COco.
      Jen|Jen got a cup.|jen got a cup.|jEn got a cup.
      Ted|I hug Ted.|I hug ted.|I hug TEd.
      Ava|Ava ran fast.|ava ran fast.|aVa ran fast.
      Bo|The pig is Bo.|The pig is bo.|The pig is BO.
      `,
      (right, shown) => [
        `*${right}* starts the name **${shown}** with a capital **${shown[0]}**.\n\n**Check.** Look at **${shown}** letter by letter: only the first letter (**${shown[0]}**) is big, and the rest (${shown.slice(1)}) are small.`,
        `*${right}* 把名字 **${shown}** 的首字母 **${shown[0]}** 写成了大写。\n\n**检验。** 逐字母看 **${shown}**：只有第一个字母（**${shown[0]}**）是大写，后面的字母（${shown.slice(1)}）都是小写。`,
      ],
      [
        ["*{wrong}* writes the name with a small first letter.", "*{wrong}* 把名字的第一个字母写成了小写。"],
        [
          "*{wrong}* puts an extra capital inside the name; only the very first letter should be big.",
          "*{wrong}* 在名字里面多用了大写；只有第一个字母该大写。",
        ],
      ],
    ),
    choose(
      "days-and-places",
      ["Days and Places", "星期和地点"],
      [
        "The days of the week and the names of real places are special names too, so they start with a capital: ***M**onday*, ***S**unday*, ***C**hina*, ***L**ondon*. Ordinary words like *day* or *park* stay small.\n\n> **Watch out.** Do not capitalize a word just because it is a place—*park* or *city* can mean any park or city, so it stays small.",
        "星期几和真实地名也是专有名字，所以首字母要大写：***M**onday*、***S**unday*、***C**hina*、***L**ondon*。普通词如 *day*、*park* 保持小写。\n\n> **注意。** 不要看到表示地方的词就大写——*park* 或 *city* 可以指任何公园或城市，所以保持小写。",
      ],
      ["Which word needs a capital letter?", "哪个词需要大写？"],
      `
      We swim on monday at the pool.|monday|swim|pool
      My aunt lives in china in a big city.|china|lives|city
      On sunday we go to the park.|sunday|go|park
      We went to london on a bus.|london|went|bus
      The fair is on friday this week.|friday|fair|week
      I saw paris from a plane.|paris|saw|plane
      We have art on tuesday at school.|tuesday|have|school
      My friend is from japan and likes fish.|japan|likes|fish
      On saturday we play in the sand.|saturday|play|sand
      The ship sails to canada at night.|canada|sails|night
      We run on wednesday in the hall.|wednesday|run|hall
      My uncle lives in mexico by the sea.|mexico|lives|sea
      On thursday we bake a cake.|thursday|bake|cake
      Gran flew to india on a plane.|india|flew|plane
      We sing on monday at the school.|monday|sing|school
      We drove to texas in the van.|texas|drove|van
      On friday I read with my class.|friday|read|class
      My pen pal writes from spain about her cat.|spain|writes|cat
      We visit tokyo in the spring.|tokyo|visit|spring
      We kick a ball on sunday at the park.|sunday|kick|park
      My cousin lives in brazil near a farm.|brazil|lives|farm
      On tuesday the bus comes late.|tuesday|comes|bus
      We sailed to egypt on a boat.|egypt|sailed|boat
      The art club meets on thursday after lunch.|thursday|meets|lunch
      I sent a card to kenya for my aunt.|kenya|sent|card
      On wednesday we swim in the lake.|wednesday|swim|lake
      My dad works in boston at a shop.|boston|works|shop
      We fly to france in the summer.|france|fly|summer
      On saturday we clean the yard.|saturday|clean|yard
      The train goes to chicago at noon.|chicago|goes|train
      `,
      (right) => {
        const cap = `${right[0]?.toUpperCase() ?? ""}${right.slice(1)}`;
        return [
          `**${right}** is the special name of one day or one place, so it should be written **${cap}**.\n\n**Check.** Ask: *Can I find **${cap}** on a calendar or a map?* Yes—so it needs a capital letter.`,
          `**${right}** 是某一天或某个地方的专有名称，应该写成 **${cap}**。\n\n**检验。** 问自己：*能在日历或地图上找到 **${cap}** 吗？* 能——所以它需要大写。`,
        ];
      },
      [
        [
          "*{wrong}* is not a day on a calendar or a place on a map, so it stays small.",
          "*{wrong}* 不是日历上的星期，也不是地图上的地名，所以保持小写。",
        ],
        [
          "*{wrong}* can mean any one of many, not one special place or day.",
          "*{wrong}* 可以指许多同类中的一个，不是某个特定的地名或星期。",
        ],
      ],
    ),
  ],
});

const marks = topic("grammar", {
  id: "telling-and-asking-sentences",
  title: ["Telling and Asking Sentences", "陈述句和疑问句"],
  summary: ["A telling sentence ends with a period, an asking sentence with a question mark.", "陈述句以句号结尾，疑问句以问号结尾。"],
  intro: [
    "At lunch, Mia says, *I have an apple.* Then Leo asks, *Can I have a slice?* One sentence gives news, and the other wants an answer. In this lesson, you will tell them apart and pick the right end mark.",
    "吃午饭时，米娅说：*I have an apple.* 接着利奥问：*Can I have a slice?* 一句是在告诉你一件事，另一句是在等回答。这节课，你会区分这两种句子，并选对句末标点。",
  ],
  after: ["starting-a-sentence-with-a-capital"],
  xp: 10,
  points: [
    label(
      "telling-or-asking",
      ["Telling or Asking", "陈述还是提问"],
      [
        "A **telling sentence** tells a fact: *The sun is hot.* An **asking sentence** asks for an answer: *Is the sun hot?* Asking sentences often start with *Can*, *Is*, *Do*, *Who*, *What*, or *Where*.\n\n> **Watch out.** Read the first word carefully: *The bus is big* tells, while *Is the bus big* asks.",
        "**陈述句**说明一件事：*The sun is hot.* **疑问句**提出问题、等着回答：*Is the sun hot?* 疑问句常以 *Can*、*Is*、*Do*、*Who*、*What* 或 *Where* 开头。\n\n> **注意。** 看清第一个词：*The bus is big* 是在陈述，而 *Is the bus big* 是在提问。",
      ],
      ["Does this sentence tell or ask?", "这个句子是在陈述还是在提问？"],
      `
      The cat is on the bed|telling
      Is the cat on the bed|asking
      Can you see the bus|asking
      We had fish for lunch|telling
      Where is my red cup|asking
      The duck swims in the pond|telling
      Do you like to sing|asking
      My mom has a big bag|telling
      Who is at the door|asking
      The frog jumps on a log|telling
      What is in the box|asking
      Ten ducks sit by the pond|telling
      The bus is big|telling
      Is the bus big|asking
      Can the bird sing|asking
      We play in the sand|telling
      Where is the dog|asking
      The cake is hot|telling
      Do you have a pen|asking
      I see a red kite|telling
      Who has my hat|asking
      The pig is in the mud|telling
      What can you see|asking
      Mom is at the shop|telling
      Is it time to go|asking
      The fish swims fast|telling
      Can we go to the park|asking
      My cat likes milk|telling
      Where are my socks|asking
      We sing a song|telling
      `,
      {
        telling: L(
          "陈述句",
          "It tells something, so it is a telling sentence and ends with a period.",
          "它在说明一件事，所以是陈述句，以句号结尾。",
          "*{shown}* wants an answer—it is asking, not telling.",
          "*{shown}* 需要回答，它是在提问，不是在陈述。",
        ),
        asking: L(
          "疑问句",
          "It asks something and wants an answer, so it ends with a question mark.",
          "它在提问，需要回答，所以以问号结尾。",
          "*{shown}* just gives information—it does not ask for an answer.",
          "*{shown}* 只是告诉你一件事，并没有提出问题。",
        ),
      },
      (right, shown, entry) => [
        `*${shown}* is a **${right}** sentence. ${entry.why[0]}\n\n**Check.** Imagine a friend says *${shown}* to you. ${right === "asking" ? "You need to answer back, so it is an asking sentence." : "You do not need to answer a question—you just hear the news, so it is a telling sentence."}`,
        `*${shown}* 是**${entry.zh}**。${entry.why[1]}\n\n**检验。** 想象朋友对你说了 *${shown}*。${right === "asking" ? "你需要给出回答，所以这是疑问句。" : "你不需要回答问题，只是听到了一个消息，所以这是陈述句。"}`,
      ],
    ),
    choose(
      "the-end-mark",
      ["The End Mark", "句末标点"],
      [
        "Every sentence ends with a mark. A telling sentence ends with a **period** (.): *The cat is wet**.** An asking sentence ends with a **question mark** (?): *Is the cat wet**?***\n\n> **Watch out.** A comma (,) pauses inside a sentence; it can never end a sentence.",
        "每个句子末尾都有标点。陈述句用**句号**（.）：*The cat is wet**.** 疑问句用**问号**（?）：*Is the cat wet**?***\n\n> **注意。** 逗号（,）只能用在句子中间停顿，不能用来结束句子。",
      ],
      ["Which mark ends this sentence?", "这个句子末尾该用哪个标点？"],
      `
      Can I pet the dog ___|?|.|,
      The dog is big ___|.|?|,
      Is it time for bed ___|?|.|,
      I like the red hat ___|.|?|,
      Where did the cat go ___|?|.|,
      We ran up the hill ___|.|?|,
      Do frogs like the rain ___|?|.|,
      The bell rang at ten ___|.|?|,
      What is your name ___|?|.|,
      My dad can fix the van ___|.|?|,
      Is the dog wet ___|?|.|,
      The dog is wet ___|.|?|,
      Can you hop on one leg ___|?|.|,
      I can hop on one leg ___|.|?|,
      Where is the cat ___|?|.|,
      The cat is on the bed ___|.|?|,
      Do you like milk ___|?|.|,
      I like milk ___|.|?|,
      Who is at the door ___|?|.|,
      Gran is at the door ___|.|?|,
      What is in the bag ___|?|.|,
      A cake is in the bag ___|.|?|,
      Can we play now ___|?|.|,
      We can play now ___|.|?|,
      Is the sun up ___|?|.|,
      The sun is up ___|.|?|,
      Where did you go ___|?|.|,
      We went to the zoo ___|.|?|,
      Do ducks swim ___|?|.|,
      Ducks swim in the pond ___|.|?|,
      `,
      (right, shown) => {
        const sentence = filled(shown, right).replace(" ?", "?").replace(" .", ".");
        return [
          `*${sentence}* — it ${right === "?" ? "asks something, so it ends with a question mark (**?**)" : "tells something, so it ends with a period (**.**)"}.\n\n**Check.** Say *${sentence}* aloud. ${right === "?" ? "You wait for an answer, which matches **?**." : "Your voice drops at the end to share a fact, which matches **.**."}`,
          `*${sentence}* —— 它${right === "?" ? "在提问，所以以问号（**?**）结尾" : "在陈述，所以以句号（**.**）结尾"}。\n\n**检验。** 大声读一遍 *${sentence}*。${right === "?" ? "读完你在等对方回答，正好配问号 **?**。" : "读完语调落下来，是在说一件事，正好配句号 **.**。"}`,
        ];
      },
      [
        ["*{wrong}* is the end mark for the other kind of sentence.", "*{wrong}* 是另一种句子的句末标点。"],
        ["A comma (,) cannot end a sentence.", "逗号（,）不能用来结束句子。"],
      ],
    ),
  ],
});

const order = topic("grammar", {
  id: "word-order-in-a-sentence",
  title: ["Word Order in a Sentence", "句子中的词序"],
  summary: [
    "The words of a sentence go in an order that makes sense: who, then what they do.",
    "句子里的词要按合理的顺序排列：先说谁，再说做什么。",
  ],
  intro: [
    "Suppose your word cards fall on the floor: *hops / bunny / the*. If you read them in that order, it sounds silly! Put *who* first and *what it does* next, and you get *The bunny hops.* Now let's put telling and asking sentences in order.",
    "假如你的单词卡片掉在了地上：*hops / bunny / the*。照这样读出来会怪怪的！先把“谁”放前面，再把“做什么”放后面，就成了 *The bunny hops.* 这节课我们来排好陈述句和疑问句的词序。",
  ],
  after: ["telling-and-asking-sentences"],
  xp: 10,
  points: [
    choose(
      "who-then-what",
      ["Who, Then What", "先说谁，再说做什么"],
      [
        "In a telling sentence, put **who or what** first, then **what they do** (or what they are like): *The dog runs.*, not *Runs the dog.*\n\n> **Watch out.** *The* or *a* always stays right in front of its naming word—*the dog*, never *dog the*.",
        "在陈述句里，先说**谁或什么**，再说**做什么**（或怎么样）：*The dog runs.*，不能说 *Runs the dog.*\n\n> **注意。** *the* 或 *a* 总是紧挨在名称词前面——要说 *the dog*，不能说 *dog the*。",
      ],
      ["Which sentence has its words in the right order?", "哪个句子的词序是对的？"],
      `
      dog, runs, the|The dog runs.|Runs the dog.|Dog the runs.
      cat, sits, the|The cat sits.|Sits the cat.|Cat sits the.
      sun, hot, is, the|The sun is hot.|Hot is the sun the.|Is the hot sun.
      can, I, swim|I can swim.|Swim can I.|Can swim I.
      bus, red, the, is|The bus is red.|Red the bus is.|Is red the bus.
      fish, a, has, Sam|Sam has a fish.|A fish Sam has.|Has Sam a fish.
      we, the, see, moon|We see the moon.|The moon see we.|See we the moon.
      hops, the, frog|The frog hops.|Hops the frog.|Frog the hops.
      bed, in, I, am|I am in bed.|In bed am I.|Am bed in I.
      big, my, is, cup|My cup is big.|Big is my cup.|Cup my is big.
      kid, the, sings|The kid sings.|Sings the kid.|Kid the sings.
      cow, the, eats|The cow eats.|Eats the cow.|Cow eats the.
      I, run, can|I can run.|Run can I.|Can run I.
      Mom, cake, a, bakes|Mom bakes a cake.|A cake bakes Mom.|Bakes Mom a cake.
      pig, the, wet, is|The pig is wet.|Wet is the pig the.|Is the wet pig.
      bird, a, sings|A bird sings.|Sings a bird.|Bird a sings.
      we, the, bus, see|We see the bus.|The bus see we.|See we the bus.
      naps, cat, my|My cat naps.|Naps my cat.|Cat my naps.
      hat, is, the, red|The hat is red.|Red is the hat.|Is red the hat.
      ball, the, kicks, Ben|Ben kicks the ball.|The ball kicks Ben.|Kicks Ben the ball.
      swim, ducks, the|The ducks swim.|Swim the ducks.|Ducks the swim.
      sit, we, can|We can sit.|Sit can we.|Can sit we.
      dog, the, barks|The dog barks.|Barks the dog.|Dog the barks.
      Dad, van, the, fixes|Dad fixes the van.|The van fixes Dad.|Fixes Dad the van.
      cup, my, hot, is|My cup is hot.|Hot is my cup.|Cup my is hot.
      I, a, see, frog|I see a frog.|A frog see I.|See I a frog.
      fox, the, ran|The fox ran.|Ran the fox.|Fox the ran.
      Kim, book, a, reads|Kim reads a book.|A book reads Kim.|Reads Kim a book.
      bed, soft, is, the|The bed is soft.|Soft is the bed.|Is soft the bed.
      jump, can, we|We can jump.|Jump can we.|Can jump we.
      `,
      (right) => [
        `*${right}* puts who or what first, then what happens.\n\n**Check.** Read *${right}* aloud and ask two questions in order: *Who or what?* (at the start) and *What happens?* (next). It sounds natural and makes sense.`,
        `*${right}* 先说谁或什么，再说发生了什么。\n\n**检验。** 把 *${right}* 大声读出来，依次问两个问题：*谁或什么？*（在句首）和*怎么样/做什么？*（在后面），读起来自然通顺。`,
      ],
      [
        [
          "*{wrong}* puts the words backwards, so who does the action is in the wrong spot.",
          "*{wrong}* 把词序颠倒了，发出动作的人或物不在正确位置。",
        ],
        ["*{wrong}* scrambles the words so the sentence does not make sense.", "*{wrong}* 把词序打乱了，整句话说不通。"],
      ],
    ),
    choose(
      "asking-order",
      ["The Order of an Asking Sentence", "疑问句的词序"],
      [
        "To turn a telling sentence into an asking sentence, move **Can** or **Is** to the very front: *You **can** swim.* → ***Can** you swim?* and *The cat **is** wet.* → ***Is** the cat wet?*\n\n> **Watch out.** Do not leave *can* or *is* at the end of the question.",
        "把陈述句变成疑问句，要把 **Can** 或 **Is** 移到最前面：*You **can** swim.* → ***Can** you swim?*，*The cat **is** wet.* → ***Is** the cat wet?*\n\n> **注意。** 不要把 *can* 或 *is* 留在问句的末尾。",
      ],
      ["Which asking sentence is in the right order?", "哪个疑问句的词序是对的？"],
      `
      You can swim.|Can you swim?|You swim can?|Swim can you?
      The cat is wet.|Is the cat wet?|The cat wet is?|Wet the cat is?
      Sam can run.|Can Sam run?|Sam run can?|Run Sam can?
      The bus is here.|Is the bus here?|The bus here is?|Here the bus is?
      It is hot.|Is it hot?|It hot is?|Hot it is?
      You can see it.|Can you see it?|You see can it?|See it can you?
      The box is big.|Is the box big?|The box big is?|Big the box is?
      Dad is at home.|Is Dad at home?|Dad at home is?|Home is Dad at?
      We can go.|Can we go?|We go can?|Go can we?
      The pen is red.|Is the pen red?|The pen red is?|Red the pen is?
      You can hop.|Can you hop?|You hop can?|Hop can you?
      The dog is big.|Is the dog big?|The dog big is?|Big the dog is?
      Ben can swim.|Can Ben swim?|Ben swim can?|Swim Ben can?
      The sun is up.|Is the sun up?|The sun up is?|Up the sun is?
      We can sing.|Can we sing?|We sing can?|Sing can we?
      The cake is hot.|Is the cake hot?|The cake hot is?|Hot the cake is?
      Mom is here.|Is Mom here?|Mom here is?|Here Mom is?
      You can read it.|Can you read it?|You read can it?|Read it can you?
      The cup is full.|Is the cup full?|The cup full is?|Full the cup is?
      Kim can jump.|Can Kim jump?|Kim jump can?|Jump Kim can?
      The bus is late.|Is the bus late?|The bus late is?|Late the bus is?
      It can fly.|Can it fly?|It fly can?|Fly it can?
      The hat is red.|Is the hat red?|The hat red is?|Red the hat is?
      They can come.|Can they come?|They come can?|Come can they?
      The frog is green.|Is the frog green?|The frog green is?|Green the frog is?
      We can play.|Can we play?|We play can?|Play can we?
      The bed is soft.|Is the bed soft?|The bed soft is?|Soft the bed is?
      Sam is sad.|Is Sam sad?|Sam sad is?|Sad Sam is?
      You can see me.|Can you see me?|You see can me?|See me can you?
      The van is new.|Is the van new?|The van new is?|New the van is?
      `,
      (right, shown) => {
        const front = right.split(" ")[0] ?? "";
        return [
          `Move **${front}** to the front of *${shown}* to get *${right}*\n\n**Check.** Move **${front}** back after the naming word: you get the original sentence *${shown}* again, so the order is right.`,
          `把 **${front}** 移到 *${shown}* 的最前面，就得到 *${right}*\n\n**检验。** 把 **${front}** 放回主语后面，正好还原成原句 *${shown}*，说明词序没错。`,
        ];
      },
      [
        [
          "*{wrong}* puts *can* or *is* after the action or describing word instead of at the front.",
          "*{wrong}* 把 *can* 或 *is* 放在了后面，而不是句首。",
        ],
        ["*{wrong}* mixes up the words so the question does not sound right.", "*{wrong}* 把词序打乱了，读起来不通顺。"],
      ],
    ),
  ],
});

/** wordKinds are the kinds of words a first grader names. */
const wordKinds: Readonly<Record<string, Label>> = {
  naming: L(
    "名称词",
    "It names a person, an animal, a place, or a thing.",
    "它是人、动物、地方或东西的名称。",
    "*{shown}* does not name a person, animal, place, or thing—you cannot say *a {shown}* by itself.",
    "*{shown}* 不是人、动物、地方或东西的名称，不能单独说 *a {shown}*。",
  ),
  action: L(
    "动作词",
    "It tells what someone or something does.",
    "它说明某人或某物做什么。",
    "*{shown}* is not something you can do—try saying *I can {shown}*, and it does not fit.",
    "*{shown}* 不是能做出来的动作，试试说 *I can {shown}*，说不通。",
  ),
  describing: L(
    "描述词",
    "It tells what something is like—its color, size, or feel.",
    "它说明东西是什么样的，比如颜色、大小或触感。",
    "*{shown}* does not tell what a thing looks or feels like.",
    "*{shown}* 没有说明一样东西是什么样子的。",
  ),
};

/** wordKindCheck builds an independent frame-test check for naming, action, or describing words. */
const wordKindCheck = (right: string, shown: string, entry: Label): Pair => {
  if (right === "naming")
    return [
      `**${shown}** is a **naming** word. ${entry.why[0]}\n\n**Check.** Put *the* in front of it: *the ${shown}* makes sense, so **${shown}** is a naming word.`,
      `**${shown}** 是**${entry.zh}**。${entry.why[1]}\n\n**检验。** 在它前面加上 *the*：*the ${shown}* 说得通，所以 **${shown}** 是名称词。`,
    ];
  if (right === "action")
    return [
      `**${shown}** is an **action** word. ${entry.why[0]}\n\n**Check.** Put it in *I can ___*: *I can ${shown}* makes sense and is something you can do, so **${shown}** is an action word.`,
      `**${shown}** 是**${entry.zh}**。${entry.why[1]}\n\n**检验。** 把它放进 *I can ___*：*I can ${shown}* 说得通，也是能做出来的动作，所以 **${shown}** 是动作词。`,
    ];
  return [
    `**${shown}** is a **describing** word. ${entry.why[0]}\n\n**Check.** Put it before a naming word like *cat* or *box*: *a ${shown} box* tells what kind of box, so **${shown}** is a describing word.`,
    `**${shown}** 是**${entry.zh}**。${entry.why[1]}\n\n**检验。** 把它放在 *cat* 或 *box* 这样的名称词前面：*a ${shown} box* 说明是什么样的盒子，所以 **${shown}** 是描述词。`,
  ];
};

const naming = topic("grammar", {
  id: "naming-words",
  title: ["Naming Words", "名称词"],
  summary: ["Naming words name people, animals, places and things.", "名称词是人、动物、地方和东西的名称。"],
  intro: [
    "Look around your room and point to three things: a *bed*, a *lamp*, a *book*. Every word you just said is a **naming word**. Naming words name people, animals, places, and things.",
    "看看你的房间，指一指三样东西：*bed*、*lamp*、*book*。你刚才说出的每个词都是**名称词**。名称词用来称呼人、动物、地方和东西。",
  ],
  after: ["starting-a-sentence-with-a-capital"],
  xp: 10,
  points: [
    label(
      "is-it-a-naming-word",
      ["Is It a Naming Word?", "它是名称词吗？"],
      [
        "A **naming word** (a noun) names a person (*mom*), an animal (*dog*), a place (*park*), or a thing (*cup*). You can put *a* or *the* in front of it: *a dog*, *the park*.\n\n> **Watch out.** Words like *run* (an action) or *red* (a color) do not name a thing by themselves.",
        "**名称词**（名词）是人（*mom*）、动物（*dog*）、地方（*park*）或东西（*cup*）的名称。前面可以加 *a* 或 *the*：*a dog*、*the park*。\n\n> **注意。** 像 *run*（动作）或 *red*（颜色）这样的词本身不是名称词。",
      ],
      ["What kind of word is it?", "这是哪一类词？"],
      `
      dog|naming|action|describing
      run|action|naming|describing
      red|describing|naming|action
      park|naming|action|describing
      jump|action|naming|describing
      big|describing|naming|action
      cup|naming|action|describing
      sing|action|naming|describing
      hot|describing|naming|action
      girl|naming|action|describing
      swim|action|naming|describing
      sad|describing|naming|action
      cat|naming|action|describing
      hop|action|naming|describing
      blue|describing|naming|action
      desk|naming|action|describing
      clap|action|naming|describing
      tall|describing|naming|action
      boy|naming|action|describing
      dig|action|naming|describing
      cold|describing|naming|action
      tree|naming|action|describing
      read|action|naming|describing
      happy|describing|naming|action
      shop|naming|action|describing
      kick|action|naming|describing
      small|describing|naming|action
      cake|naming|action|describing
      nap|action|naming|describing
      wet|describing|naming|action
      `,
      wordKinds,
      wordKindCheck,
    ),
    choose(
      "finding-the-naming-word",
      ["Finding the Naming Word", "找出名称词"],
      [
        "To find the naming word in a sentence, ask *who?* or *what?*: in *The frog sat.*, what sat? The **frog**. So *frog* is the naming word.\n\n> **Watch out.** Small words like *the*, *a*, and *is* help the sentence, but they are not naming words.",
        "要找出句子里的名称词，就问*谁？*或*什么？*：在 *The frog sat.* 中，什么坐着？是 **frog**。所以 *frog* 是名称词。\n\n> **注意。** *the*、*a*、*is* 这样的小词只是帮着连句，不是名称词。",
      ],
      ["Which word is a naming word?", "哪个词是名称词？"],
      `
      The frog sat.|frog|sat|the
      A bird sings.|bird|sings|a
      The bus is red.|bus|red|is
      My cat naps.|cat|naps|my
      The kid ran fast.|kid|ran|fast
      A duck can swim.|duck|swim|can
      The sun is hot.|sun|hot|is
      Mom hugs me.|Mom|hugs|me
      The bell rang.|bell|rang|the
      A fox hid.|fox|hid|a
      The pig ran.|pig|ran|the
      A hen sits.|hen|sits|a
      The cake is hot.|cake|hot|is
      My dog barks.|dog|barks|my
      The man ran fast.|man|ran|fast
      A bee can buzz.|bee|buzz|can
      The bed is soft.|bed|soft|is
      Dad hugs me.|Dad|hugs|me
      The ship sank.|ship|sank|the
      A cow eats.|cow|eats|a
      The girl sang.|girl|sang|the
      The bug is red.|bug|red|is
      My hat fell.|hat|fell|my
      A ball can roll.|ball|roll|can
      The cup is full.|cup|full|is
      Gran naps a lot.|Gran|naps|a
      The tree is tall.|tree|tall|is
      A crab hid.|crab|hid|a
      The kite flew high.|kite|flew|high
      My pen is new.|pen|new|is
      `,
      (right, shown) => [
        `In *${shown}*, **${right}** names who or what the sentence is about.\n\n**Check.** Picture the sentence in your head: you can point right to **${right}** as a person, animal, or thing.`,
        `在 *${shown}* 中，**${right}** 说出了句子讲的是谁或是什么。\n\n**检验。** 在脑海里画出这幅画面：你能直接指出 **${right}** 这个人、动物或东西。`,
      ],
      [
        [
          "*{wrong}* tells what happens or what something is like, so it is not a naming word.",
          "*{wrong}* 说明发生了什么或是什么样子，所以不是名称词。",
        ],
        [
          "*{wrong}* is a helper or detail word, not a name for a person, animal, place, or thing.",
          "*{wrong}* 是辅助词或修饰词，不是人、动物、地方或东西的名称。",
        ],
      ],
    ),
  ],
});

const actions = topic("grammar", {
  id: "action-words",
  title: ["Action Words", "动作词"],
  summary: ["Action words tell what someone or something does.", "动作词说明某人或某物做什么。"],
  intro: [
    "At recess, Mia jumps, Leo kicks a ball, and a bird lands on the fence. Every word that tells what they do is an **action word**. Without an action word, a picture stays frozen!",
    "课间休息时，米娅跳起来，利奥踢球，一只小鸟落在篱笆上。每个说出“做什么”的词都是**动作词**。没有动作词，画面就动不起来啦！",
  ],
  after: ["naming-words"],
  xp: 10,
  points: [
    choose(
      "finding-the-action-word",
      ["Finding the Action Word", "找出动作词"],
      [
        "An **action word** (a verb) tells what someone or something does: *run*, *hop*, *eat*, *sing*. Ask *what does it do?* In *The dog digs.*, the dog **digs**.\n\n> **Watch out.** Do not pick the person or animal doing the action—pick the word that shows the move.",
        "**动作词**（动词）说明某人或某物做什么：*run*、*hop*、*eat*、*sing*。问*它做什么？* 在 *The dog digs.* 中，狗在 **digs**（挖）。\n\n> **注意。** 不要选出做动作的人或动物，要选出表示动作的那个词。",
      ],
      ["Which word is the action word?", "哪个词是动作词？"],
      `
      The dog digs.|digs|dog|the
      A bird flies.|flies|bird|a
      Sam kicks the ball.|kicks|Sam|ball
      The cat naps.|naps|cat|the
      We sing a song.|sing|song|we
      The frog hops.|hops|frog|the
      Mom cuts the cake.|cuts|cake|Mom
      The fish swims.|swims|fish|the
      I eat a plum.|eat|plum|I
      The kids clap.|clap|kids|the
      The cow eats.|eats|cow|the
      A duck swims.|swims|duck|a
      Kim throws the ball.|throws|Kim|ball
      The baby naps.|naps|baby|the
      We read a book.|read|book|we
      The pig rolls.|rolls|pig|the
      Dad fixes the van.|fixes|van|Dad
      The bee buzzes.|buzzes|bee|the
      I drink my milk.|drink|milk|I
      The girls run.|run|girls|the
      The hen pecks.|pecks|hen|the
      Mom bakes a pie.|bakes|pie|Mom
      The cat jumps.|jumps|cat|the
      We paint a box.|paint|box|we
      The bird sings.|sings|bird|the
      Ben digs a hole.|digs|hole|Ben
      The fox runs.|runs|fox|the
      I hug my gran.|hug|gran|I
      The bell rings.|rings|bell|the
      The kids wave.|wave|kids|the
      `,
      (right, shown) => [
        `In *${shown}*, **${right}** tells the action that happens.\n\n**Check.** Act out *${shown}* like a tiny movie: **${right}** is the part that moves or happens.`,
        `在 *${shown}* 中，**${right}** 说出了发生的动作。\n\n**检验。** 把 *${shown}* 当成一段小动画演出来：动起来的那一下就是 **${right}**。`,
      ],
      [
        ["*{wrong}* names a person, animal, or thing, so it is a naming word.", "*{wrong}* 是人、动物或东西的名称，所以是名称词。"],
        ["*{wrong}* is a helper word or another naming word, not the action.", "*{wrong}* 是小词或另一个名称词，不是动作。"],
      ],
    ),
    choose(
      "an-action-that-fits",
      ["An Action That Fits", "合适的动作"],
      [
        "Pick an action word that makes sense for who does it: a fish can **swim**, but a fish cannot **fly**. Read the whole sentence to see if the picture makes sense.\n\n> **Watch out.** All the choices are real action words, so check *who* is doing the action first.",
        "选一个符合主语的动作词：鱼会 **swim**（游泳），但不会 **fly**（飞）。把整句话读一遍，看看画面合不合理。\n\n> **注意。** 几个选项都是动作词，所以要先看清楚是*谁*在做这个动作。",
      ],
      ["Which action word makes sense?", "哪个动作词说得通？"],
      `
      The fish can ___.|swim|sing|read
      The bird can ___.|fly|bark|swim
      The dog can ___.|bark|fly|read
      I ___ my lunch.|eat|run|fly
      The baby ___ in bed.|naps|digs|flies
      We ___ a book.|read|eat|bark
      The frog can ___.|hop|read|bark
      The bell ___ at ten.|rings|swims|eats
      Kim ___ a song.|sings|digs|hops
      The cow ___ grass.|eats|reads|rings
      The duck can ___.|swim|read|sing
      The cat can ___.|jump|read|fly
      I ___ my milk.|drink|sing|read
      The cow can ___.|moo|bark|fly
      We ___ a song.|sing|eat|dig
      The hen can ___ an egg.|lay|read|sing
      Dad ___ the van.|drives|eats|sings
      The bee can ___.|buzz|bark|read
      I ___ my teeth.|brush|eat|fly
      Mom ___ a cake.|bakes|reads|barks
      The baby ___ in the crib.|sleeps|digs|flies
      The dog ___ a bone.|chews|reads|sings
      We ___ to the park.|walk|eat|read
      The kids ___ in the pool.|swim|read|bake
      The frog ___ on the log.|sits|reads|bakes
      I ___ my hands.|wash|read|fly
      The bird ___ a nest.|builds|reads|barks
      Kim ___ a picture.|draws|eats|barks
      The horse can ___.|run|read|sing
      Gran ___ a story.|reads|barks|digs
      `,
      (right, shown) => [
        `*${filled(shown, right)}* matches what the subject really does.\n\n**Check.** Picture *${filled(shown, right)}* in your mind: it is a real, everyday action, while the other choices sound silly here.`,
        `*${filled(shown, right)}* 符合主语真正会做的动作。\n\n**检验。** 在脑海里想象 *${filled(shown, right)}* 的画面：这是合情合理的动作，而另两个词放进去会很奇怪。`,
      ],
      [
        [
          "Think about who is in the sentence: *{wrong}* is not an action they do here.",
          "想想句子里是谁：在这里它不会做 *{wrong}* 这个动作。",
        ],
        [
          "Put *{wrong}* into the sentence and picture it—that action does not match the sentence.",
          "把 *{wrong}* 放进句子里想一想画面——这个动作和句子搭不上。",
        ],
      ],
    ),
  ],
});

const describing = topic("grammar", {
  id: "describing-words",
  title: ["Describing Words", "描述词"],
  summary: [
    "Describing words tell what a thing is like: its color, size, shape or how many.",
    "描述词说明东西是什么样的：颜色、大小、形状或数量。",
  ],
  intro: [
    "Suppose your friend says, *I lost my hat.* You ask, *Which one?* Your friend says, *My **yellow** hat!* The word **yellow** paints a picture. Words that tell color, size, feel, or how many are **describing words**.",
    "假如朋友说：*I lost my hat.* 你会问：*哪一顶？* 朋友说：*My **yellow** hat!* 单词 **yellow** 一下子画出了样子。说明颜色、大小、触感或数量的词就是**描述词**。",
  ],
  after: ["naming-words"],
  xp: 10,
  points: [
    label(
      "naming-action-or-describing",
      ["Naming, Action or Describing", "名称、动作还是描述"],
      [
        "A **describing word** (an adjective) tells what a naming word is like: *a **red** hat*, *a **big** dog*, ***two** cats*, *a **soft** bed*. It often sits right before the naming word.\n\n> **Watch out.** A describing word cannot be the thing itself—*soft* tells how a bed feels, while *bed* is the naming word.",
        "**描述词**（形容词）说明名称词是什么样的：*a **red** hat*、*a **big** dog*、***two** cats*、*a **soft** bed*。它常紧挨在名称词前面。\n\n> **注意。** 描述词本身不是东西——*soft* 说的是床摸起来的感觉，*bed* 才是名称词。",
      ],
      ["What kind of word is it?", "这是哪一类词？"],
      `
      soft|describing|naming|action
      hat|naming|action|describing
      hop|action|naming|describing
      little|describing|naming|action
      bed|naming|action|describing
      clap|action|naming|describing
      green|describing|naming|action
      pond|naming|action|describing
      dig|action|naming|describing
      wet|describing|naming|action
      ship|naming|action|describing
      kick|action|naming|describing
      fluffy|describing|naming|action
      mop|naming|action|describing
      skip|action|naming|describing
      yellow|describing|naming|action
      coat|naming|action|describing
      swim|action|naming|describing
      round|describing|naming|action
      lamp|naming|action|describing
      sing|action|naming|describing
      cold|describing|naming|action
      truck|naming|action|describing
      dance|action|naming|describing
      pink|describing|naming|action
      chair|naming|action|describing
      throw|action|naming|describing
      sticky|describing|naming|action
      doll|naming|action|describing
      climb|action|naming|describing
      `,
      wordKinds,
      wordKindCheck,
    ),
    choose(
      "finding-the-describing-word",
      ["Finding the Describing Word", "找出描述词"],
      [
        "To find a describing word in a sentence, ask *what kind?* or *how many?* In *I see a big ship.*, what kind of ship? A **big** one—so *big* is the describing word.\n\n> **Watch out.** Number words like *two* and *six* are describing words too when they tell how many.",
        "要找出句子里的描述词，就问*什么样的？*或*有多少？* 在 *I see a big ship.* 中，什么样的船？**big**（大的）——所以 *big* 是描述词。\n\n> **注意。** *two*、*six* 这样说明数量的数字词放在名称词前面时，也是描述词。",
      ],
      ["Which word is the describing word?", "哪个词是描述词？"],
      `
      I see a big ship.|big|ship|see
      The red hen sat.|red|hen|sat
      We have two cats.|two|cats|have
      She has a soft bed.|soft|bed|has
      A tall man ran.|tall|man|ran
      The hot sun shines.|hot|sun|shines
      I got a new cup.|new|cup|got
      Six ducks swim.|six|ducks|swim
      The wet dog shakes.|wet|dog|shakes
      He has a long stick.|long|stick|has
      I see a red kite.|red|kite|see
      The fat cat naps.|fat|cat|naps
      We have three hens.|three|hens|have
      He has a blue cap.|blue|cap|has
      A small bug ran.|small|bug|ran
      The cold wind blows.|cold|wind|blows
      I got a big box.|big|box|got
      Two frogs hop.|two|frogs|hop
      The sad pup sits.|sad|pup|sits
      She has a short stick.|short|stick|has
      I like the pink hat.|pink|hat|like
      The happy kid sings.|happy|kid|sings
      We ate four plums.|four|plums|ate
      He has a fast bike.|fast|bike|has
      The soft rug is warm.|soft|rug|is
      I see a tall tree.|tall|tree|see
      A green frog hops.|green|frog|hops
      We have one dog.|one|dog|have
      The old man naps.|old|man|naps
      She got a long rope.|long|rope|got
      `,
      (right, shown) => [
        `In *${shown}*, **${right}** tells what kind or how many.\n\n**Check.** Cover up **${right}** and read the rest of *${shown}*: you still know the main thing, just without the detail of what kind or how many.`,
        `在 *${shown}* 中，**${right}** 说明是什么样的或有多少。\n\n**检验。** 遮住 **${right}** 再读 *${shown}*：句子的大意还在，只是少了“什么样的”或“多少个”的细节。`,
      ],
      [
        [
          "*{wrong}* names the person, animal, or thing itself, so it is a naming word.",
          "*{wrong}* 本身是人、动物或东西的名称，所以是名称词。",
        ],
        [
          "*{wrong}* tells the action (or links the sentence), not what a thing is like.",
          "*{wrong}* 表示动作（或连接句子），不是说明东西是什么样的。",
        ],
      ],
    ),
  ],
});

const plurals = topic("grammar", {
  id: "one-and-more-than-one",
  title: ["One and More Than One", "一个和多个"],
  summary: ["Add *s* to a naming word for more than one: one cat, two cats.", "名称词表示多个时加 *s*：one cat，two cats。"],
  intro: [
    "On the table sits *one cup*. Your mom brings another, so now there are *two cups*. Adding a tiny ending tells the reader whether there is one or more than one!",
    "桌上放着 *one cup*（一个杯子）。妈妈又拿来一个，现在是 *two cups*（两个杯子）。在词尾加上一点变化，就能告诉读者是一个还是多个！",
  ],
  after: ["naming-words"],
  xp: 10,
  points: [
    choose(
      "adding-s",
      ["Adding S", "加 s"],
      [
        "Most naming words add **s** for more than one: *one cat*, *two cat**s***; *a pig*, *six pig**s***. Words like *one* or *a* mean just one, so no *s*.\n\n> **Watch out.** Do not add *es* to an ordinary word like *cat* or *dog*—just add *s*.",
        "大多数名称词表示多个时直接加 **s**：*one cat*、*two cat**s***；*a pig*、*six pig**s***。*one* 或 *a* 表示只有一个，所以不加 *s*。\n\n> **注意。** 像 *cat*、*dog* 这样的普通词不要加 *es*，只要加 *s*。",
      ],
      ["Which word fits?", "哪个词合适？"],
      `
      I see two ___.|cats|cat|cates
      I have one ___.|hat|hats|hates
      Six ___ sat in the mud.|pigs|pig|piges
      A ___ is on the log.|frog|frogs|frogses
      Ten ___ are in the box.|pens|pen|penes
      We have three ___.|dogs|dog|doges
      Mom got a ___.|cup|cups|cupes
      Five ___ hop on the grass.|bugs|bug|buges
      I can see one ___.|ship|ships|shipes
      Four ___ are in the nest.|eggs|egg|egges
      I see three ___.|hens|hen|henes
      I have one ___.|cap|caps|capes
      Two ___ sat on the log.|cats|cat|cates
      A ___ is in the pond.|duck|ducks|duckes
      Six ___ are in the jar.|bugs|bug|buges
      We have two ___.|bikes|bike|bikess
      Dad got a ___.|map|maps|mapes
      We have two ___.|vans|van|vanes
      I can see one ___.|kite|kites|kitees
      Four ___ are on the tree.|apples|apple|applees
      I have ten ___.|toys|toy|toyes
      One ___ is in the sky.|bird|birds|birdes
      Three ___ are on the desk.|books|book|bookes
      We ate two ___.|plums|plum|plumes
      A ___ sat on the mat.|cat|cats|cates
      Seven ___ hop on the grass.|frogs|frog|froges
      I have one ___.|sock|socks|sockes
      Two ___ ran to the barn.|pigs|pig|piges
      Mom has a ___.|bag|bags|bages
      Eight ___ are in the nest.|eggs|egg|egges
      `,
      (right, shown) => [
        `*${filled(shown, right)}* — there ${right.endsWith("s") ? "is more than one, so add **s**" : "is only one, so leave off **s**"}.\n\n**Check.** Find the number word in *${shown}* and hold up that many fingers: ${right.endsWith("s") ? "more than one finger means the naming word ends in **s**." : "one finger means the naming word stays plain with no **s**."}`,
        `*${filled(shown, right)}* —— 这里${right.endsWith("s") ? "多于一个，所以词尾加 **s**" : "只有一个，所以不加 **s**"}。\n\n**检验。** 找出 *${shown}* 里表示数量的词，伸出对应根数的手指：${right.endsWith("s") ? "多于一根手指，名称词末尾要加 **s**。" : "只有一根手指，名称词保持原形不加 **s**。"}`,
      ],
      [
        ["*{wrong}* does not match the count in the sentence (one vs. more than one).", "*{wrong}* 和句子里的数量（一个还是多个）对不上。"],
        [
          "*{wrong}* has the wrong ending—this word only needs a plain *s* for more than one.",
          "*{wrong}* 的词尾不对——这个词变复数只需要直接加 *s*。",
        ],
      ],
    ),
    choose(
      "adding-es",
      ["Adding ES", "加 es"],
      [
        "A naming word that ends in **s**, **x**, **sh**, or **ch** adds **es** for more than one so it is easy to say: *one box*, *two box**es***; *a dish*, *three dish**es***.\n\n> **Watch out.** Adding only *s* makes a hiss you cannot say clearly, like *boxs*—use *es* instead.",
        "以 **s**、**x**、**sh** 或 **ch** 结尾的名称词，表示多个时加 **es**，这样才读得顺口：*one box*、*two box**es***；*a dish*、*three dish**es***。\n\n> **注意。** 只加 *s* 会变成难读的 *boxs*，要加 *es*。",
      ],
      ["Which word fits?", "哪个词合适？"],
      `
      I have two ___.|boxes|boxs|box
      Mom washed three ___.|dishes|dishs|dish
      We sat on the ___ at lunch.|benches|benchs|bench
      Two ___ are on the table.|glasses|glasss|glass
      The fox has four ___.|foxes|foxs|fox
      I got five ___ for my bag.|brushes|brushs|brush
      Two ___ stop by the school.|buses|buss|bus
      We ate six ___ of bread.|lunches|lunchs|lunch
      The tree has lots of ___.|branches|branchs|branch
      I made ten ___ on the page.|wishes|wishs|wish
      I see two ___.|foxes|foxs|fox
      We have three ___.|dresses|dresss|dress
      Mom has four ___.|boxes|boxs|box
      The kids ate their ___.|lunches|lunchs|lunch
      I use two ___.|brushes|brushs|brush
      Two ___ stop at the school.|buses|buss|bus
      We sat on the ___.|benches|benchs|bench
      I made three ___.|wishes|wishs|wish
      The bird sat on the ___.|branches|branchs|branch
      I got two ___ of milk.|glasses|glasss|glass
      Gran has six ___.|dishes|dishs|dish
      I saw two ___ on the farm.|foxes|foxs|fox
      The farmer has two ___.|axes|axs|ax
      We have two ___ of grapes.|bunches|bunchs|bunch
      I lit five ___.|matches|matchs|match
      The baby gets three ___.|kisses|kisss|kiss
      We ate two ___.|peaches|peachs|peach
      I have four ___.|watches|watchs|watch
      I counted ten ___.|inches|inchs|inch
      We heard two loud ___.|crashes|crashs|crash
      `,
      (right, shown) => [
        `*${filled(shown, right)}* — the base word ends in *s*, *x*, *sh*, or *ch*, so it adds **es**.\n\n**Check.** Say **${right}** aloud: you hear an extra beat at the end (*-es*), which tells you *es* is needed.`,
        `*${filled(shown, right)}* —— 原词以 *s*、*x*、*sh* 或 *ch* 结尾，所以要加 **es**。\n\n**检验。** 大声读出 **${right}**：词尾多出一个清楚的音节（*-es*），说明这里必须加 *es*。`,
      ],
      [
        [
          "*{wrong}* adds only *s*, which is hard to say after *s*, *x*, *sh*, or *ch*—it needs *es*.",
          "*{wrong}* 只加了 *s*，在 *s*、*x*、*sh*、*ch* 后面很难读出来，需要加 *es*。",
        ],
        ["*{wrong}* means only one, but the sentence talks about more than one.", "*{wrong}* 只表示一个，但句子里说的是多个。"],
      ],
    ),
  ],
});

const articles = topic("grammar", {
  id: "a-or-an",
  title: ["A or An", "a 还是 an"],
  summary: [
    "Use *an* before a word that starts with a vowel sound, and *a* before the others.",
    "以元音开头的词前用 *an*，其他词前用 *a*。",
  ],
  intro: [
    "Try saying *a apple* fast—your mouth bumps between the two *a* sounds! Put a tiny *n* in between and say *an apple*: smooth and easy. That is why we choose **a** or **an** by the sound that comes next.",
    "试着快一点读 *a apple*——两个元音撞在一起，嘴巴会卡一下！中间加上一个 *n* 读 *an apple*，一下子就顺口了。这就是我们要看后面词的开头来选 **a** 还是 **an** 的原因。",
  ],
  after: ["naming-words", "reading-short-vowel-words"],
  xp: 10,
  points: [
    choose(
      "a-or-an-before-a-word",
      ["A or An Before a Word", "词前用 a 还是 an"],
      [
        "Use **an** before a word that starts with a vowel (*a*, *e*, *i*, *o*, *u*): ***an** egg*, ***an** ant*. Use **a** before the other letters: ***a** cat*, ***a** dog*.\n\n> **Watch out.** Check the very first letter of the word right after the blank.",
        "以元音字母（*a*、*e*、*i*、*o*、*u*）开头的词前面用 **an**：***an** egg*、***an** ant*。其他字母开头的词前面用 **a**：***a** cat*、***a** dog*。\n\n> **注意。** 盯住空格后面那个词的第一个字母。",
      ],
      ["Which word fits?", "哪个词合适？"],
      `
      I have ___ egg.|an|a
      I see ___ cat.|a|an
      ___ ant is on the log.|An|A
      She has ___ hat.|a|an
      We saw ___ owl.|an|a
      He got ___ pen.|a|an
      It is ___ apple.|an|a
      Dad has ___ van.|a|an
      ___ insect sat on my hand.|An|A
      I want ___ bun.|a|an
      There is ___ ox in the barn.|an|a
      Mom got ___ box.|a|an
      I see ___ egg in the nest.|an|a
      She has ___ dog.|a|an
      ___ owl sat in the tree.|An|A
      He has ___ cap.|a|an
      We have ___ igloo of snow.|an|a
      I got ___ bag.|a|an
      That is ___ ox.|an|a
      Mom has ___ cup.|a|an
      ___ elf hid in the box.|An|A
      I want ___ bike.|a|an
      It is ___ inch long.|an|a
      Dad has ___ map.|a|an
      She ate ___ apple at lunch.|an|a
      I see ___ fox.|a|an
      ___ eel swims in the sea.|An|A
      We have ___ hen.|a|an
      He saw ___ ant on the jam.|an|a
      I need ___ pen.|a|an
      `,
      (right, shown) => {
        const next = wordAfterBlank(shown);
        const vowel = right.toLowerCase() === "an";
        return [
          `*${filled(shown, right)}* — **${next}** starts with ${vowel ? `the vowel **${next[0]}**, so use **${right}**` : `**${next[0]}** (not a vowel), so use **${right}**`}.\n\n**Check.** Say *${right.toLowerCase()} ${next}* aloud: ${vowel ? `the *n* in *an* keeps the two vowel sounds smooth instead of bumping.` : `it flows smoothly without an extra *n*.`}`,
          `*${filled(shown, right)}* —— **${next}** 以${vowel ? `元音 **${next[0]}** 开头，所以用 **${right}**` : `非元音 **${next[0]}** 开头，所以用 **${right}**`}。\n\n**检验。** 大声连读 *${right.toLowerCase()} ${next}*：${vowel ? `*an* 里的 *n* 把两个元音隔开，读起来很顺口。` : `不需要多加 *n*，直接读就很顺口。`}`,
        ];
      },
      [["*{wrong}* does not match the first letter of the word right after the blank.", "*{wrong}* 和空格后面那个词的首字母不匹配。"]],
    ),
    choose(
      "a-or-an-with-a-describing-word",
      ["A or An with a Describing Word", "有描述词时用 a 还是 an"],
      [
        "Look at the word **right after** *a* or *an*. When a describing word comes first, it decides: ***an** egg*, but ***a** big egg*; ***a** cat*, but ***an** old cat*.\n\n> **Watch out.** Do not jump ahead to the naming word—only the very next word counts.",
        "只看紧跟在 *a* 或 *an* 后面的那个词。前面加了描述词时，就由描述词来决定：***an** egg*，但 ***a** big egg*；***a** cat*，但 ***an** old cat*。\n\n> **注意。** 不要跳过描述词去看后面的名称词——只看紧挨着的第一个词。",
      ],
      ["Which word fits?", "哪个词合适？"],
      `
      I see ___ big egg.|a|an
      She has ___ old cat.|an|a
      It is ___ red apple.|a|an
      We saw ___ odd bug.|an|a
      He has ___ empty cup.|an|a
      I got ___ little ant.|a|an
      That is ___ ugly hat.|an|a
      We met ___ funny owl.|a|an
      It was ___ easy test.|an|a
      I ate ___ big plum.|a|an
      I see ___ old hen.|an|a
      She has ___ big egg.|a|an
      It is ___ odd hat.|an|a
      We saw ___ red ant.|a|an
      He has ___ empty box.|an|a
      I got ___ new apple.|a|an
      That is ___ ugly bug.|an|a
      We met ___ little owl.|a|an
      It was ___ easy game.|an|a
      I ate ___ green egg.|a|an
      She has ___ awful cold.|an|a
      I got ___ wet umbrella.|a|an
      He saw ___ angry cat.|an|a
      We have ___ small igloo.|a|an
      It is ___ icy road.|an|a
      I see ___ long eel.|a|an
      That was ___ odd sound.|an|a
      She has ___ fun idea.|a|an
      It is ___ old van.|an|a
      We saw ___ fat ox.|a|an
      `,
      (right, shown) => {
        const next = wordAfterBlank(shown);
        const vowel = right === "an";
        return [
          `*${filled(shown, right)}* — the word right after the blank is **${next}**, which starts with ${vowel ? `the vowel **${next[0]}**, so use **an**` : `**${next[0]}** (not a vowel), so use **a**`}.\n\n**Check.** Say *${right} ${next}* aloud together: your mouth glides right through it.`,
          `*${filled(shown, right)}* —— 紧跟空格的词是 **${next}**，它以${vowel ? `元音 **${next[0]}** 开头，所以用 **an**` : `非元音 **${next[0]}** 开头，所以用 **a**`}。\n\n**检验。** 把 *${right} ${next}* 连起来大声读一遍，顺口不卡嘴。`,
        ];
      },
      [
        [
          "Look at the describing word right after the blank, not the naming word: *{wrong}* does not match its first sound.",
          "看紧跟在空格后面的描述词，而不是后面的名称词：*{wrong}* 和它的开头读音不搭配。",
        ],
      ],
    ),
  ],
});

const pronouns = topic("grammar", {
  id: "he-she-it-and-they",
  title: ["He, She, It and They", "he、she、it 和 they"],
  summary: [
    "Words like *he*, *she*, *it* and *they* take the place of naming words.",
    "*he*、*she*、*it*、*they* 这样的词可以代替名称词。",
  ],
  intro: [
    "Listen to this: *Maya got a kite. Maya ran up the hill. Maya flew the kite.* Saying *Maya* over and over sounds bumpy! Swap in **she**—*She ran up the hill*—and the story flows smoothly.",
    "听听这段话：*Maya got a kite. Maya ran up the hill. Maya flew the kite.* 一遍遍重复 *Maya* 好拗口！换成 **she**——*She ran up the hill*——故事一下子就顺畅多了。",
  ],
  after: ["naming-words"],
  xp: 10,
  points: [
    choose(
      "the-word-that-takes-its-place",
      ["The Word That Takes Its Place", "代替它的词"],
      [
        "A short word (a pronoun) can take the place of a naming word: **he** for a boy or man, **she** for a girl or woman, **it** for one thing or animal, **they** for more than one, and **we** for someone and *I*.\n\n> **Watch out.** Count how many people or things are in bold: two or more always take *they* (or *we* if *I* is included).",
        "可以用一个短词（代词）代替名称词：男孩或男人用 **he**，女孩或女人用 **she**，一个东西或动物用 **it**，多于一个用 **they**，别人和 *I* 一起用 **we**。\n\n> **注意。** 数一数粗体部分有几个人或东西：两个及以上用 *they*（如果包含 *I* 就用 *we*）。",
      ],
      ["Which word can take the place of the bold words?", "哪个词可以代替粗体部分？"],
      `
      **Sam** has a red cap.|He|She|They
      **Mom** is at home.|She|He|It
      **The ball** is in the box.|It|He|They
      **The kids** run to the bus.|They|He|It
      **Dad** can fix it.|He|She|They
      **Lily** likes to sing.|She|He|It
      **The cup** is hot.|It|She|They
      **Ben and Kim** sit on the rug.|They|He|She
      **The ducks** swim in the pond.|They|It|He
      **My aunt** has a cat.|She|He|They
      **Ben** has a dog.|He|She|They
      **Gran** bakes a pie.|She|He|It
      **The kite** is up high.|It|He|They
      **The girls** sing.|They|She|It
      **Uncle Sam** can fish.|He|She|It
      **Kim** has a red bike.|She|He|They
      **The box** is big.|It|He|They
      **Mom and Dad** sit down.|They|He|It
      **The pigs** roll in the mud.|They|It|She
      **My sister** likes to read.|She|He|They
      **The man** is tall.|He|She|It
      **The bus** is late.|It|She|They
      **The boys** play ball.|They|He|It
      **Aunt Meg** has a cat.|She|He|They
      **The hat** is on the bed.|It|He|They
      **Sam and I** run.|We|They|He
      **My brother** can swim.|He|She|It
      **The frogs** hop.|They|It|He
      **The cake** is sweet.|It|She|They
      **Lily** sings a song.|She|He|They
      `,
      (right, shown) => {
        const swapped = shown.replace(/\*\*[^*]+\*\*/u, right);
        return [
          `**${right}** takes the place of the bold words.\n\n**Check.** Swap **${right}** into the sentence and read it aloud: *${swapped}* — it matches who and how many.`,
          `**${right}** 可以代替粗体部分。\n\n**检验。** 把 **${right}** 代回原句大声读一遍：*${swapped}* —— 人称和数量都对得上。`,
        ];
      },
      [
        ["*{wrong}* stands for a different kind of person or thing.", "*{wrong}* 指的是另一类人或东西。"],
        ["*{wrong}* does not match how many (or whether *I* is included).", "*{wrong}* 和数量（或是否包含“我”）不匹配。"],
      ],
    ),
    choose(
      "i-or-me-and-we-or-us",
      ["I or Me, We or Us", "I 还是 me，we 还是 us"],
      [
        "Use **I** and **we** for who does the action, at the front: ***I** ran.* ***We** sat.* Use **me** and **us** after the action word or *to/with*: *Mom hugs **me**.* *Dad sees **us**.*\n\n> **Watch out.** Do not say *Me can hop*—at the start of a sentence doing the action, use *I* or *We*.",
        "做动作的人用 **I** 和 **we**，放在句首：***I** ran.* ***We** sat.* 放在动作词或 *to/with* 后面的用 **me** 和 **us**：*Mom hugs **me**.* *Dad sees **us**.*\n\n> **注意。** 不要说 *Me can hop*——在句首做动作时要用 *I* 或 *We*。",
      ],
      ["Which word fits?", "哪个词合适？"],
      `
      ___ can hop.|I|Me
      Mom hugs ___.|me|I
      ___ sat on the bench.|We|Us
      Dad sees ___.|us|we
      ___ like the red bus.|I|Me
      The dog licks ___.|me|I
      ___ ran to the park.|We|Us
      Gran gave ___ a cake.|us|we
      ___ have a pet fish.|I|Me
      The teacher helps ___.|us|we
      ___ can jump.|I|Me
      Dad helps ___.|me|I
      ___ sit on the rug.|We|Us
      Mom hugs ___.|us|we
      ___ have a red cap.|I|Me
      The cat sees ___.|me|I
      ___ play in the park.|We|Us
      Gran reads to ___.|us|we
      ___ like to sing.|I|Me
      Sam waves to ___.|me|I
      ___ eat lunch at noon.|We|Us
      The teacher sees ___.|us|we
      ___ am six.|I|Me
      Give the ball to ___.|me|I
      ___ go to school.|We|Us
      Come with ___.|us|we
      ___ can read.|I|Me
      The pup licks ___.|me|I
      ___ ride the bus.|We|Us
      Kim plays with ___.|us|we
      `,
      (right, shown) => {
        const subject = ["I", "We"].includes(right);
        return [
          `*${filled(shown, right)}* — ${subject ? `**${right}** does the action at the front of the sentence` : `**${right}** comes after the action word`}.\n\n**Check.** Find the action word in *${filled(shown, right)}*: **${right}** sits ${subject ? "before it, doing the action" : "after it, receiving the action"}, so it sounds right aloud.`,
          `*${filled(shown, right)}* —— ${subject ? `**${right}** 在句首做动作` : `**${right}** 在动作词后面`}。\n\n**检验。** 找出 *${filled(shown, right)}* 里的动作词：**${right}** 在动作词${subject ? "前面（发出动作）" : "后面（接受动作）"}，大声读起来顺口。`,
        ];
      },
      [
        [
          "*{wrong}* belongs in the other spot—before vs. after the action word.",
          "*{wrong}* 应该放在句子的另一个位置（动作词前面还是后面）。",
        ],
      ],
    ),
  ],
});

const joining = topic("grammar", {
  id: "joining-with-and",
  title: ["Joining with And", "用 and 连接"],
  summary: ["Two short sentences, or two naming words, can be joined with *and*.", "两个短句或两个名称词可以用 *and* 连接起来。"],
  intro: [
    "Writing *Maya swims. Leo swims.* takes two bumpy sentences. Glue the two names together with **and**: *Maya and Leo swim.* One smooth sentence says it all!",
    "写 *Maya swims. Leo swims.* 显得两句话一顿一顿的。用 **and** 把两个名字粘在一起：*Maya and Leo swim.* 一句顺畅的话就全说明白了！",
  ],
  after: ["action-words", "describing-words"],
  xp: 10,
  points: [
    choose(
      "two-into-one",
      ["Two into One", "两句变一句"],
      [
        "When two people do the same thing, join their names with **and**: *Sam ran. Ben ran.* → ***Sam and Ben** ran.* When one person does two things, join the actions: *I sat. I ate.* → *I **sat and ate**.*\n\n> **Watch out.** Put *and* right between the two matching parts—never leave *and* out or stick it at the very start.",
        "当两个人做同一件事，用 **and** 把名字连起来：*Sam ran. Ben ran.* → ***Sam and Ben** ran.* 当一个人做两件事，把两个动作连起来：*I sat. I ate.* → *I **sat and ate**.*\n\n> **注意。** 把 *and* 放在两个并列词的中间——不要漏掉，也不要放到奇怪的位置。",
      ],
      ["Which sentence joins the two?", "哪个句子把两句连起来了？"],
      `
      Sam ran. Ben ran.|Sam and Ben ran.|Sam ran and Ben.|Sam Ben ran.
      I sat. I ate.|I sat and ate.|I sat I ate.|I and sat ate.
      The cat naps. The dog naps.|The cat and the dog nap.|The cat naps and the dog.|The cat the dog naps.
      Mom sings. Mom claps.|Mom sings and claps.|Mom sings Mom claps.|Mom and sings claps.
      Kim swims. Meg swims.|Kim and Meg swim.|Kim swims and Meg.|Kim Meg swim.
      The frog hops. The frog swims.|The frog hops and swims.|The frog hops the frog swims.|The frog and hops swims.
      I have a hat. I have a bag.|I have a hat and a bag.|I have a hat I have a bag.|I have and a hat a bag.
      Dad digs. Dad plants.|Dad digs and plants.|Dad digs Dad plants.|Dad and digs plants.
      The duck quacks. The hen clucks.|The duck quacks and the hen clucks.|The duck quacks the hen clucks.|The duck and quacks the hen clucks.
      We read. We nap.|We read and nap.|We read we nap.|We and read nap.
      Ben sat. Kim sat.|Ben and Kim sat.|Ben sat and Kim.|Ben Kim sat.
      I ran. I hid.|I ran and hid.|I ran I hid.|I and ran hid.
      The pig eats. The cow eats.|The pig and the cow eat.|The pig eats and the cow.|The pig the cow eats.
      Dad sings. Dad dances.|Dad sings and dances.|Dad sings Dad dances.|Dad and sings dances.
      Mia reads. Leo reads.|Mia and Leo read.|Mia reads and Leo.|Mia Leo read.
      The dog runs. The dog jumps.|The dog runs and jumps.|The dog runs the dog jumps.|The dog and runs jumps.
      I have a cup. I have a plate.|I have a cup and a plate.|I have a cup I have a plate.|I have and a cup a plate.
      Mom cooks. Mom cleans.|Mom cooks and cleans.|Mom cooks Mom cleans.|Mom and cooks cleans.
      The cat naps. The dog barks.|The cat naps and the dog barks.|The cat naps the dog barks.|The cat and naps the dog barks.
      We sing. We clap.|We sing and clap.|We sing we clap.|We and sing clap.
      Sam swims. Ann swims.|Sam and Ann swim.|Sam swims and Ann.|Sam Ann swim.
      The bird sings. The bird flies.|The bird sings and flies.|The bird sings the bird flies.|The bird and sings flies.
      I see a hen. I see a duck.|I see a hen and a duck.|I see a hen I see a duck.|I see and a hen a duck.
      Gran knits. Gran reads.|Gran knits and reads.|Gran knits Gran reads.|Gran and knits reads.
      The sun is up. The sky is blue.|The sun is up and the sky is blue.|The sun is up the sky is blue.|The sun and is up the sky is blue.
      Tom digs. Tom plants.|Tom digs and plants.|Tom digs Tom plants.|Tom and digs plants.
      The frog hops. The fish swims.|The frog hops and the fish swims.|The frog hops the fish swims.|The frog and hops the fish swims.
      I have a pen. I have a book.|I have a pen and a book.|I have a pen I have a book.|I have and a pen a book.
      Meg runs. Max runs.|Meg and Max run.|Meg runs and Max.|Meg Max run.
      We eat. We drink.|We eat and drink.|We eat we drink.|We and eat drink.
      `,
      (right, shown) => [
        `*${right}* puts **and** between the two matching parts to join the sentences cleanly.\n\n**Check.** Split *${right}* back apart at **and**: you get the same two ideas as *${shown}*, with no missing or jumbled words.`,
        `*${right}* 把 **and** 放在两个并列部分之间，把两句自然连成了一句。\n\n**检验。** 从 **and** 处把 *${right}* 拆回两句，意思正好和原来的 *${shown}* 一致，没有漏词也没有乱序。`,
      ],
      [
        [
          "*{wrong}* either puts *and* in the wrong spot or leaves out *and* between the two sentences.",
          "*{wrong}* 要么把 *and* 放错了位置，要么两句之间漏了 *and*。",
        ],
        [
          "*{wrong}* puts *and* in the wrong place or drops it, so the words collide.",
          "*{wrong}* 把 *and* 放错了地方或漏掉了，词语撞在了一起。",
        ],
      ],
    ),
    choose(
      "is-or-are-after-and",
      ["Is or Are After And", "and 之后用 is 还是 are"],
      [
        "Two naming words joined by **and** make more than one, so they take **are**: *The cat **is** wet*, but *The cat and the dog **are** wet*.\n\n> **Watch out.** Count everyone before the blank—if there is an *and*, there are at least two, so use *are*.",
        "两个用 **and** 连起来的名称词表示多于一个，所以要用 **are**：*The cat **is** wet*，但 *The cat and the dog **are** wet*。\n\n> **注意。** 数一数空格前面有几个——只要有 *and*，就是两个及以上，要用 *are*。",
      ],
      ["Which word fits?", "哪个词合适？"],
      `
      The cat and the dog ___ wet.|are|is
      The cat ___ wet.|is|are
      Sam and Ben ___ at home.|are|is
      Mom ___ in the van.|is|are
      The hat and the bag ___ red.|are|is
      The sun ___ hot.|is|are
      Kim and I ___ six.|are|is
      The bus ___ late.|is|are
      The ducks and the hens ___ in the barn.|are|is
      My pen ___ black.|is|are
      The pig and the cow ___ big.|are|is
      The pig ___ big.|is|are
      Ben and Kim ___ at school.|are|is
      Dad ___ in the yard.|is|are
      The cup and the plate ___ clean.|are|is
      The sky ___ blue.|is|are
      Mom and I ___ in the van.|are|is
      The cake ___ sweet.|is|are
      The cats and the dogs ___ wet.|are|is
      My bike ___ red.|is|are
      The hat and the coat ___ on the bed.|are|is
      The bird ___ in the nest.|is|are
      Sam and Ann ___ seven.|are|is
      The pond ___ cold.|is|are
      The pen and the book ___ on the desk.|are|is
      Gran ___ at home.|is|are
      The bus and the van ___ late.|are|is
      The frog ___ green.|is|are
      Lily and I ___ friends.|are|is
      The milk ___ cold.|is|are
      `,
      (right, shown) => [
        `*${filled(shown, right)}* — there ${right === "are" ? "is more than one (joined by *and*), so use **are**" : "is only one, so use **is**"}.\n\n**Check.** Swap the front words for *${right === "are" ? "They" : "It"}*: *${right === "are" ? "They are" : "It is"}...* sounds right, confirming **${right}**.`,
        `*${filled(shown, right)}* —— 前面${right === "are" ? "有 *and* 连接的多于一个，所以用 **are**" : "只有一个，所以用 **is**"}。\n\n**检验。** 把主语换成 *${right === "are" ? "They" : "It"}*：*${right === "are" ? "They are" : "It is"}...* 读起来顺口，确认该用 **${right}**。`,
      ],
      [
        [
          "*{wrong}* does not match how many are before the blank (one takes *is*, two or more take *are*).",
          "*{wrong}* 和空格前面的数量不匹配（一个用 *is*，两个及以上用 *are*）。",
        ],
      ],
    ),
  ],
});

/** grammarTopics1 are the grammar topics of grade 1: building sentences. */
export const grammarTopics1: readonly TopicDef[] = [
  capitals,
  names,
  marks,
  order,
  naming,
  actions,
  describing,
  plurals,
  articles,
  pronouns,
  joining,
];
