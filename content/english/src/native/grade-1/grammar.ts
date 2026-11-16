// Grade 1: building sentences. A sentence starts with a capital letter and ends with a mark, puts its words in order,
// and is made of naming words, action words and describing words; it can tell or ask, and two can be joined by *and*.

import type { TopicDef } from "@ga/content";
import { choose, type Label, label, topic } from "../grade-6/kit.ts";

/** L builds a label from its Chinese name, why it is right and why it is not. */
const L = (zh: string, whyEn: string, whyZh: string, notEn: string, notZh: string): Label => ({
  zh,
  why: [whyEn, whyZh],
  not: [notEn, notZh],
});

/** filled is a sentence with its blank filled by the right word. */
const filled = (shown: string, right: string) => shown.replace("___", right);

const capitals = topic("grammar", {
  id: "starting-a-sentence-with-a-capital",
  title: ["Starting a Sentence with a Capital", "句子以大写字母开头"],
  summary: [
    "Every sentence starts with a capital letter, and the word *I* is always a capital.",
    "每个句子都以大写字母开头，单词 *I* 总是大写。",
  ],
  after: ["first-and-last-letters"],
  xp: 10,
  points: [
    choose(
      "the-first-letter",
      ["The First Letter", "第一个字母"],
      [
        "A sentence always starts with a **capital letter**: *The cat sat.* not *the cat sat.* Look at the first word: its first letter must be big.",
        "句子总是以**大写字母**开头：要写 *The cat sat.*，不能写 *the cat sat.*。看第一个词：它的首字母必须大写。",
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
      (right) => [`*${right}* starts with a capital letter.`, `*${right}* 以大写字母开头。`],
      [
        ["*{wrong}* starts with a small letter.", "*{wrong}* 以小写字母开头。"],
        [
          "*{wrong}* puts the capital in the wrong place: it belongs on the first letter of the first word.",
          "*{wrong}* 大写的位置不对：应该是第一个词的第一个字母大写。",
        ],
      ],
    ),
    choose(
      "the-word-i",
      ["The Word I", "单词 I"],
      [
        "When you write about yourself, the word **I** is always a capital letter, at the start of a sentence or in the middle: *Mom and **I** ran.*",
        "写自己时，单词 **I** 总是大写，不论在句首还是句中：*Mom and **I** ran.*。",
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
      (right) => [`*${right}*: the word *I* and the first letter are capitals.`, `*${right}*：单词 *I* 和句子的第一个字母都大写。`],
      [
        ["*{wrong}* writes *I* as a small letter, but *I* is always a capital.", "*{wrong}* 把 *I* 写成了小写，但 *I* 总是大写的。"],
        [
          "*{wrong}* puts a capital where it does not belong, or leaves one out.",
          "*{wrong}* 在不该大写的地方用了大写，或漏掉了该有的大写。",
        ],
      ],
    ),
  ],
});

const names = topic("grammar", {
  id: "capitals-for-names",
  title: ["Capitals for Names", "名字用大写"],
  summary: ["The name of a person, a pet, a day or a place starts with a capital letter.", "人名、宠物名、星期名和地名都以大写字母开头。"],
  after: ["starting-a-sentence-with-a-capital"],
  xp: 10,
  points: [
    choose(
      "names-of-people-and-pets",
      ["Names of People and Pets", "人和宠物的名字"],
      [
        "A **name** is the word for one special person or pet, like *Sam*, *Lily* or *Rex*. A name always starts with a capital letter, even in the middle of a sentence: *I see **Sam**.*",
        "**名字**是某一个特定的人或宠物的称呼，比如 *Sam*、*Lily*、*Rex*。名字总是以大写字母开头，在句子中间也是如此：*I see **Sam**.*。",
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
      (right) => [`*${right}*: the name starts with a capital letter.`, `*${right}*：名字以大写字母开头。`],
      [
        ["*{wrong}* starts the name with a small letter.", "*{wrong}* 的名字以小写字母开头。"],
        [
          "*{wrong}* has a capital in the middle of the name; only the first letter is a capital.",
          "*{wrong}* 在名字中间用了大写；只有第一个字母大写。",
        ],
      ],
    ),
    choose(
      "days-and-places",
      ["Days and Places", "星期和地点"],
      [
        "The days of the week and the names of places are names too, so they start with a capital: ***Monday***, ***Sunday***, ***China***, ***London***. A word for any day or any place, like *day* or *park*, does not.",
        "星期的名称和地名也是名字，所以也以大写字母开头：***Monday***、***Sunday***、***China***、***London***。泛指的词，比如 *day*、*park*，不用大写。",
      ],
      ["Which word needs a capital letter?", "哪个词需要大写？"],
      `
      We swim on monday at the pool.|monday|swim|pool
      My aunt lives in china in a big city.|china|aunt|city
      On sunday we go to the park.|sunday|go|park
      We went to london on a bus.|london|went|bus
      The fair is on friday this week.|friday|fair|week
      I saw paris from a plane.|paris|saw|plane
      We have art on tuesday at school.|tuesday|art|school
      My friend is from japan and likes fish.|japan|friend|fish
      On saturday we play in the sand.|saturday|play|sand
      The ship sails to canada at night.|canada|ship|night
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
      (right) => [
        `*${right}* names one day or one place, so it starts with a capital.`,
        `*${right}* 是某一天或某个地方的名字，所以要大写。`,
      ],
      [
        ["*{wrong}* is an action word, not a name.", "*{wrong}* 是动作词，不是名字。"],
        ["*{wrong}* can mean any one of many, so it is not a name.", "*{wrong}* 可以指许多中的任何一个，所以不是名字。"],
      ],
    ),
  ],
});

const marks = topic("grammar", {
  id: "telling-and-asking-sentences",
  title: ["Telling and Asking Sentences", "陈述句和疑问句"],
  summary: ["A telling sentence ends with a period, an asking sentence with a question mark.", "陈述句以句号结尾，疑问句以问号结尾。"],
  after: ["starting-a-sentence-with-a-capital"],
  xp: 10,
  points: [
    label(
      "telling-or-asking",
      ["Telling or Asking", "陈述还是提问"],
      [
        "A **telling sentence** tells something: *The sun is hot.* An **asking sentence** asks something and wants an answer: *Is the sun hot?* Asking sentences often start with *Can*, *Is*, *Do*, *Who*, *What* or *Where*.",
        "**陈述句**说明一件事：*The sun is hot.*。**疑问句**提出问题，需要回答：*Is the sun hot?*。疑问句常以 *Can*、*Is*、*Do*、*Who*、*What* 或 *Where* 开头。",
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
          "It does not ask anything: it tells something.",
          "它没有提问，而是在说明一件事。",
        ),
        asking: L(
          "疑问句",
          "It asks something and wants an answer, so it ends with a question mark.",
          "它在提问，需要回答，所以以问号结尾。",
          "It wants an answer, so it does not just tell.",
          "它需要回答，所以不只是在说明。",
        ),
      },
    ),
    choose(
      "the-end-mark",
      ["The End Mark", "句末标点"],
      [
        "Every sentence ends with a mark. A telling sentence ends with a **period** (.); an asking sentence ends with a **question mark** (?).",
        "每个句子结尾都有标点。陈述句以**句号**（.）结尾；疑问句以**问号**（?）结尾。",
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
      (right, shown) => [
        `"${filled(shown, right).replace(" ?", "?").replace(" .", ".")}": it ${right === "?" ? "asks, so it ends with a question mark" : "tells, so it ends with a period"}.`,
        `“${filled(shown, right).replace(" ?", "?").replace(" .", ".")}”：它${right === "?" ? "在提问，所以以问号结尾" : "在陈述，所以以句号结尾"}。`,
      ],
      [
        ["*{wrong}* is the mark for the other kind of sentence.", "*{wrong}* 是另一种句子用的标点。"],
        ["A comma does not end a sentence.", "逗号不能用来结束句子。"],
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
  after: ["telling-and-asking-sentences"],
  xp: 10,
  points: [
    choose(
      "who-then-what",
      ["Who, Then What", "先说谁，再说做什么"],
      [
        "In a telling sentence, first comes **who or what** the sentence is about, then **what they do**: *The dog runs.* not *Runs the dog.* Mixed-up words do not make sense.",
        "在陈述句中，先说**谁或什么**，再说**做什么**：*The dog runs.*，而不是 *Runs the dog.*。词序打乱了，意思就不通了。",
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
      (right) => [`*${right}* says who first, then what.`, `*${right}* 先说谁，再说做什么。`],
      [
        ["*{wrong}* puts what happens before who does it.", "*{wrong}* 把做什么放在了谁的前面。"],
        ["*{wrong}* mixes up the words, so it does not make sense.", "*{wrong}* 把词序打乱了，意思不通。"],
      ],
    ),
    choose(
      "asking-order",
      ["The Order of an Asking Sentence", "疑问句的词序"],
      [
        "An asking sentence often turns the order around: *You can swim.* becomes ***Can you** swim?* and *The cat is wet.* becomes ***Is the cat** wet?*",
        "疑问句常常把词序倒过来：*You can swim.* 变成 ***Can you** swim?*，*The cat is wet.* 变成 ***Is the cat** wet?*。",
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
      (right, shown) => [
        `*${shown}* becomes *${right}*: the word *Can* or *Is* moves to the front.`,
        `*${shown}* 变成 *${right}*：*Can* 或 *Is* 移到最前面。`,
      ],
      [
        ["*{wrong}* leaves *Can* or *Is* at the end, where it does not belong.", "*{wrong}* 把 *Can* 或 *Is* 留在了句末，位置不对。"],
        ["*{wrong}* mixes up the words.", "*{wrong}* 把词序打乱了。"],
      ],
    ),
  ],
});

/** wordKinds are the kinds of words a first grader names. */
const wordKinds: Readonly<Record<string, Label>> = {
  naming: L(
    "名称词",
    "It names a person, an animal, a place or a thing.",
    "它是人、动物、地方或东西的名称。",
    "It does not name a person, animal, place or thing.",
    "它不是人、动物、地方或东西的名称。",
  ),
  action: L(
    "动作词",
    "It tells what someone or something does.",
    "它说明某人或某物做什么。",
    "It does not tell what someone does.",
    "它没有说明某人做什么。",
  ),
  describing: L(
    "描述词",
    "It tells what something is like: its color, size or how many.",
    "它说明东西是什么样的：颜色、大小或数量。",
    "It does not tell what something is like.",
    "它没有说明东西是什么样的。",
  ),
};

const naming = topic("grammar", {
  id: "naming-words",
  title: ["Naming Words", "名称词"],
  summary: ["Naming words name people, animals, places and things.", "名称词是人、动物、地方和东西的名称。"],
  after: ["starting-a-sentence-with-a-capital"],
  xp: 10,
  points: [
    label(
      "is-it-a-naming-word",
      ["Is It a Naming Word?", "它是名称词吗？"],
      [
        "A **naming word** (a noun) names a person (*mom*), an animal (*dog*), a place (*park*) or a thing (*cup*). You can put *a* or *the* in front of it: *a dog*, *the park*.",
        "**名称词**（名词）是人（*mom*）、动物（*dog*）、地方（*park*）或东西（*cup*）的名称。前面可以加 *a* 或 *the*：*a dog*、*the park*。",
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
    ),
    choose(
      "finding-the-naming-word",
      ["Finding the Naming Word", "找出名称词"],
      [
        "To find the naming word in a sentence, ask *who?* or *what?*: in *The frog sat.*, what sat? The **frog**. *Frog* is the naming word.",
        "要找出句子里的名称词，就问*谁？*或*什么？*：在 *The frog sat.* 中，什么坐着？是 **frog**。*frog* 就是名称词。",
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
      (right, shown) => [`In *${shown}*, *${right}* names who or what.`, `在 *${shown}* 中，*${right}* 说出了是谁或是什么。`],
      [
        [
          "*{wrong}* tells what happens or what it is like, so it is not a naming word.",
          "*{wrong}* 说明发生了什么或是什么样子，所以不是名称词。",
        ],
        ["*{wrong}* is a small helping word, not a name for anything.", "*{wrong}* 是一个小的辅助词，不是任何东西的名称。"],
      ],
    ),
  ],
});

const actions = topic("grammar", {
  id: "action-words",
  title: ["Action Words", "动作词"],
  summary: ["Action words tell what someone or something does.", "动作词说明某人或某物做什么。"],
  after: ["naming-words"],
  xp: 10,
  points: [
    choose(
      "finding-the-action-word",
      ["Finding the Action Word", "找出动作词"],
      [
        "An **action word** (a verb) tells what someone does: *run*, *hop*, *eat*, *sing*. Ask *what does it do?*: in *The dog digs.*, the dog **digs**.",
        "**动作词**（动词）说明某人做什么：*run*、*hop*、*eat*、*sing*。问*它做什么？*：在 *The dog digs.* 中，狗在 **digs**（挖）。",
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
      (right, shown) => [`In *${shown}*, *${right}* tells what is done.`, `在 *${shown}* 中，*${right}* 说明做了什么。`],
      [
        ["*{wrong}* names who or what, so it is a naming word.", "*{wrong}* 说的是谁或什么，所以是名称词。"],
        ["*{wrong}* does not tell what anyone does.", "*{wrong}* 没有说明谁在做什么。"],
      ],
    ),
    choose(
      "an-action-that-fits",
      ["An Action That Fits", "合适的动作"],
      [
        "Pick an action word that makes sense for who does it: a fish can **swim**, but a fish cannot **fly**. Read the whole sentence to check.",
        "选一个对这个人或动物合理的动作词：鱼会 **swim**（游泳），但不会 **fly**（飞）。把整句读一遍来检查。",
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
      (right, shown) => [`*${filled(shown, right)}* makes sense.`, `*${filled(shown, right)}* 说得通。`],
      [
        ["*{wrong}* is an action word, but it does not fit here.", "*{wrong}* 是动作词，但在这里不合理。"],
        ["*{wrong}* does not make sense in this sentence.", "*{wrong}* 放在这个句子里说不通。"],
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
  after: ["naming-words"],
  xp: 10,
  points: [
    label(
      "naming-action-or-describing",
      ["Naming, Action or Describing", "名称、动作还是描述"],
      [
        "A **describing word** (an adjective) tells what a naming word is like: *a **red** hat*, *a **big** dog*, ***two** cats*, *a **soft** bed*. It often comes just before the naming word.",
        "**描述词**（形容词）说明名称词是什么样的：*a **red** hat*、*a **big** dog*、***two** cats*、*a **soft** bed*。它常放在名称词的前面。",
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
    ),
    choose(
      "finding-the-describing-word",
      ["Finding the Describing Word", "找出描述词"],
      [
        "Ask *what kind?* or *how many?*: in *I see a big ship.*, what kind of ship? A **big** one. *Big* is the describing word.",
        "问*什么样的？*或*有多少？*：在 *I see a big ship.* 中，什么样的船？**big**（大的）。*big* 就是描述词。",
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
      (right, shown) => [`In *${shown}*, *${right}* tells what kind or how many.`, `在 *${shown}* 中，*${right}* 说明什么样的或有多少。`],
      [
        ["*{wrong}* names a thing, so it is a naming word.", "*{wrong}* 是东西的名称，所以是名称词。"],
        ["*{wrong}* tells what someone does, so it is an action word.", "*{wrong}* 说明某人做什么，所以是动作词。"],
      ],
    ),
  ],
});

const plurals = topic("grammar", {
  id: "one-and-more-than-one",
  title: ["One and More Than One", "一个和多个"],
  summary: ["Add *s* to a naming word for more than one: one cat, two cats.", "名称词表示多个时加 *s*：one cat，two cats。"],
  after: ["naming-words"],
  xp: 10,
  points: [
    choose(
      "adding-s",
      ["Adding S", "加 s"],
      [
        "Most naming words add **s** for more than one: *one cat*, *two cat**s***; *a pig*, *six pig**s***. A word like *one* or *a* means just one, so no *s*.",
        "大多数名称词表示多个时要加 **s**：*one cat*、*two cat**s***；*a pig*、*six pig**s***。*one* 或 *a* 表示只有一个，所以不加 *s*。",
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
        `*${filled(shown, right)}*: ${right.endsWith("s") ? "more than one, so add *s*" : "just one, so no *s*"}.`,
        `*${filled(shown, right)}*：${right.endsWith("s") ? "多于一个，所以加 *s*" : "只有一个，所以不加 *s*"}。`,
      ],
      [
        ["*{wrong}* does not match how many there are.", "*{wrong}* 和数量不相符。"],
        ["*{wrong}* is not a word: just add *s*.", "*{wrong}* 不是一个词：只要加 *s* 就行了。"],
      ],
    ),
    choose(
      "adding-es",
      ["Adding ES", "加 es"],
      [
        "A naming word that ends in **s**, **x**, **sh** or **ch** adds **es** for more than one, because it is easier to say: *one box*, *two box**es***; *a dish*, *three dish**es***.",
        "以 **s**、**x**、**sh** 或 **ch** 结尾的名称词，表示多个时加 **es**，因为这样更容易读：*one box*、*two box**es***；*a dish*、*three dish**es***。",
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
      (right) => [
        `*${right}*: the word ends in s, x, sh or ch, so it adds *es*.`,
        `*${right}*：这个词以 s、x、sh 或 ch 结尾，所以加 *es*。`,
      ],
      [
        ["*{wrong}* adds only *s*, but this word needs *es*.", "*{wrong}* 只加了 *s*，但这个词要加 *es*。"],
        ["*{wrong}* means just one, but there are more.", "*{wrong}* 表示只有一个，但这里是多个。"],
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
  after: ["naming-words", "reading-short-vowel-words"],
  xp: 10,
  points: [
    choose(
      "a-or-an-before-a-word",
      ["A or An Before a Word", "词前用 a 还是 an"],
      [
        "Use **an** before a word that starts with a vowel, *a*, *e*, *i*, *o* or *u*: ***an** egg*, ***an** ant*. Use **a** before the other letters: ***a** cat*, ***a** dog*.",
        "以元音字母 *a*、*e*、*i*、*o*、*u* 开头的词前用 **an**：***an** egg*、***an** ant*。其他字母开头的词前用 **a**：***a** cat*、***a** dog*。",
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
      (right, shown) => [
        `*${filled(shown, right)}*: the next word starts with ${right.toLowerCase() === "an" ? "a vowel, so *an*" : "a letter that is not a vowel, so *a*"}.`,
        `*${filled(shown, right)}*：下一个词${right.toLowerCase() === "an" ? "以元音开头，所以用 *an*" : "不以元音开头，所以用 *a*"}。`,
      ],
      [["*{wrong}* goes before words that start the other way.", "*{wrong}* 用在另一类开头的词前面。"]],
    ),
    choose(
      "a-or-an-with-a-describing-word",
      ["A or An with a Describing Word", "有描述词时用 a 还是 an"],
      [
        "Look at the word right after *a* or *an*. If a describing word comes first, it decides: ***an** egg*, but ***a** big egg*; ***a** cat*, but ***an** old cat*.",
        "看 *a* 或 *an* 后面紧跟的那个词。如果先出现描述词，就由描述词决定：***an** egg*，但 ***a** big egg*；***a** cat*，但 ***an** old cat*。",
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
      (right, shown) => [
        `*${filled(shown, right)}*: the word right after starts with ${right === "an" ? "a vowel, so *an*" : "a letter that is not a vowel, so *a*"}.`,
        `*${filled(shown, right)}*：紧跟其后的词${right === "an" ? "以元音开头，所以用 *an*" : "不以元音开头，所以用 *a*"}。`,
      ],
      [
        [
          "Look at the word just after the blank, not the naming word: *{wrong}* does not fit it.",
          "看紧跟在空格后面的词，而不是名称词：*{wrong}* 和它不搭配。",
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
  after: ["naming-words"],
  xp: 10,
  points: [
    choose(
      "the-word-that-takes-its-place",
      ["The Word That Takes Its Place", "代替它的词"],
      [
        "So that we do not say a name again and again, a short word takes its place: **he** for a boy or a man, **she** for a girl or a woman, **it** for a thing or an animal, **they** for more than one.",
        "为了不一遍又一遍地重复名字，可以用一个短词来代替：男孩或男人用 **he**，女孩或女人用 **she**，东西或动物用 **it**，多于一个用 **they**。",
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
      (right) => [`*${right}* takes the place of the bold words.`, `*${right}* 可以代替粗体部分。`],
      [
        ["*{wrong}* is for a different kind of person or thing.", "*{wrong}* 用于另一类人或东西。"],
        ["*{wrong}* does not match how many there are.", "*{wrong}* 和数量不相符。"],
      ],
    ),
    choose(
      "i-or-me-and-we-or-us",
      ["I or Me, We or Us", "I 还是 me，we 还是 us"],
      [
        "Use **I** and **we** for who does the action, at the front: ***I** ran.* ***We** sat.* Use **me** and **us** after the action word: *Mom hugs **me**.* *Dad sees **us**.*",
        "做动作的人用 **I** 和 **we**，放在前面：***I** ran.* ***We** sat.*。放在动作词后面的用 **me** 和 **us**：*Mom hugs **me**.* *Dad sees **us**.*。",
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
      (right, shown) => [
        `*${filled(shown, right)}*: ${["I", "We"].includes(right) ? "it does the action, at the front" : "it comes after the action word"}.`,
        `*${filled(shown, right)}*：${["I", "We"].includes(right) ? "它做动作，放在前面" : "它放在动作词后面"}。`,
      ],
      [["*{wrong}* belongs in the other place in the sentence.", "*{wrong}* 应该用在句子的另一个位置。"]],
    ),
  ],
});

const joining = topic("grammar", {
  id: "joining-with-and",
  title: ["Joining with And", "用 and 连接"],
  summary: ["Two short sentences, or two naming words, can be joined with *and*.", "两个短句或两个名称词可以用 *and* 连接起来。"],
  after: ["action-words", "describing-words"],
  xp: 10,
  points: [
    choose(
      "two-into-one",
      ["Two into One", "两句变一句"],
      [
        "When two sentences say the same thing about two people, join them with **and**: *Sam ran. Ben ran.* becomes ***Sam and Ben** ran.* When one person does two things, join the actions: *I sat. I ate.* becomes *I **sat and ate**.*",
        "当两个句子对两个人说了同样的事，就用 **and** 连接：*Sam ran. Ben ran.* 变成 ***Sam and Ben** ran.*。当一个人做了两件事，就把两个动作连起来：*I sat. I ate.* 变成 *I **sat and ate**.*。",
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
      (right) => [`*${right}* joins the two with *and* and makes sense.`, `*${right}* 用 *and* 把两句连了起来，意思通顺。`],
      [
        ["*{wrong}* puts *and* in the wrong place.", "*{wrong}* 把 *and* 放错了位置。"],
        ["*{wrong}* leaves out *and*, so it runs together.", "*{wrong}* 漏掉了 *and*，句子连在一起了。"],
      ],
    ),
    choose(
      "is-or-are-after-and",
      ["Is or Are After And", "and 之后用 is 还是 are"],
      [
        "Two naming words joined by *and* make more than one, so they take **are**: *The cat **is** wet*, but *The cat and the dog **are** wet*.",
        "两个用 *and* 连接的名称词表示多于一个，所以用 **are**：*The cat **is** wet*，但 *The cat and the dog **are** wet*。",
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
        `*${filled(shown, right)}*: ${right === "are" ? "more than one, so *are*" : "just one, so *is*"}.`,
        `*${filled(shown, right)}*：${right === "are" ? "多于一个，所以用 *are*" : "只有一个，所以用 *is*"}。`,
      ],
      [["*{wrong}* does not match how many there are.", "*{wrong}* 和数量不相符。"]],
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
