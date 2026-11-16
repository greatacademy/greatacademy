// Grade 2: building sentences further: the past with *-ed* and irregular past verbs, *is*, *are*, *was* and *were*,
// owning with *'s*, comparing with *-er* and *-est*, plurals that change, contractions, joining with *and*, *but* and
// *or*, and the commas of a letter.

import type { TopicDef } from "@ga/content";
import { choose, topic } from "../grade-6/kit.ts";

/** filled is a sentence with its blank filled by the right word. */
const filled = (shown: string, right: string) => shown.replace("___", right);

const pastEd = topic("grammar", {
  id: "past-tense-with-ed",
  title: ["The Past with -ed", "用 -ed 表示过去"],
  summary: ["Add *-ed* to an action word to tell what already happened.", "在动作词后加 *-ed*，表示已经发生的事。"],
  after: ["joining-with-and"],
  xp: 10,
  points: [
    choose(
      "now-or-already",
      ["Now or Already", "现在还是已经"],
      [
        "An action word tells **when**. *I jump* is now; *I jump**ed*** already happened. Words like *yesterday*, *last night* and *this morning* tell you it already happened, so the action word adds **-ed**.",
        "动作词能表示**时间**。*I jump* 是现在；*I jump**ed*** 是已经发生的。*yesterday*、*last night*、*this morning* 这样的词告诉你事情已经发生了，所以动作词要加 **-ed**。",
      ],
      ["Which word fits?", "哪个词合适？"],
      `
      Yesterday, I ___ rope with Kim.|jumped|jump|jumping
      Last night, we ___ a show.|watched|watch|watching
      This morning, Dad ___ the car.|washed|wash|washing
      Yesterday, the baby ___ all day.|played|play|playing
      Last week, it ___ a lot.|rained|rain|raining
      Yesterday, Mom ___ me a story.|showed|show|showing
      Last year, we ___ to a new town.|moved|move|moving
      This morning, I ___ my teeth.|brushed|brush|brushing
      Last night, the dog ___ at the moon.|barked|bark|barking
      Yesterday, we ___ the plants.|watered|water|watering
      Yesterday, we ___ in the pool.|played|play|playing
      Last night, Mom ___ the dishes.|washed|wash|washing
      This morning, the bus ___ at my house.|stopped|stop|stopping
      Yesterday, I ___ my room.|cleaned|clean|cleaning
      Last week, Ben ___ a kite.|painted|paint|painting
      Yesterday, the cat ___ on my bed.|jumped|jump|jumping
      Last night, I ___ to music.|listened|listen|listening
      This morning, Gran ___ a pie.|baked|bake|baking
      Yesterday, the kids ___ in the snow.|rolled|roll|rolling
      Last summer, we ___ my uncle.|visited|visit|visiting
      Yesterday, Dad ___ the fence.|fixed|fix|fixing
      Last night, the baby ___ a lot.|cried|cry|crying
      This morning, I ___ for the bus.|waited|wait|waiting
      Yesterday, Kim ___ her friend.|called|call|calling
      Last week, the class ___ a song.|learned|learn|learning
      Yesterday, we ___ the leaves.|raked|rake|raking
      Last night, the owl ___ in the tree.|hooted|hoot|hooting
      This morning, Sam ___ his bike.|locked|lock|locking
      Yesterday, I ___ my mom with the bags.|helped|help|helping
      Last week, we ___ a box of toys.|packed|pack|packing
      `,
      (right, shown) => [
        `*${filled(shown, right)}*: it already happened, so the action word adds *-ed*.`,
        `*${filled(shown, right)}*：事情已经发生了，所以动作词加 *-ed*。`,
      ],
      [
        ["*{wrong}* tells about now, but the sentence says it already happened.", "*{wrong}* 说的是现在，但句子说的是已经发生的事。"],
        [
          "*{wrong}* needs a helping word such as *was*, and it does not tell the past here.",
          "*{wrong}* 需要 *was* 这样的助词，在这里不能表示过去。",
        ],
      ],
    ),
    choose(
      "spelling-the-ed",
      ["Spelling the -ed", "-ed 的拼写"],
      [
        "Most words just add **-ed**: *jump**ed***. A word ending in **e** adds only **-d**: *bake*, *bake**d***. A short word ending in one vowel and one consonant doubles the last letter: *hop*, *ho**pped***; *stop*, *sto**pped***.",
        "大多数词直接加 **-ed**：*jump**ed***。以 **e** 结尾的词只加 **-d**：*bake*、*bake**d***。以一个元音加一个辅音结尾的短词，要双写最后一个字母：*hop*、*ho**pped***；*stop*、*sto**pped***。",
      ],
      ["Which is the right spelling?", "哪个拼写是对的？"],
      `
      hop|hopped|hoped|hopd
      bake|baked|bakeed|bakked
      stop|stopped|stoped|stopd
      smile|smiled|smileed|smilled
      clap|clapped|claped|clapd
      wave|waved|waveed|wavved
      jump|jumped|jumpped|jumpd
      skip|skipped|skiped|skipd
      like|liked|likeed|likked
      rub|rubbed|rubed|rubd
      plan|planned|planed|pland
      hope|hoped|hopeed|hopped
      drop|dropped|droped|dropd
      use|used|useed|ussed
      grab|grabbed|grabed|grabd
      love|loved|loveed|lovved
      shop|shopped|shoped|shopd
      bike|biked|bikeed|bikked
      nod|nodded|noded|nodd
      pat|patted|pated|patd
      tape|taped|tapeed|tapped
      step|stepped|steped|stepd
      close|closed|closeed|clossed
      hug|hugged|huged|hugd
      dance|danced|danceed|dancced
      trip|tripped|triped|tripd
      mop|mopped|moped|mopd
      rake|raked|rakeed|rakked
      tug|tugged|tuged|tugd
      joke|joked|jokeed|jokked
      `,
      (right, shown) => [`*${shown}* becomes *${right}*.`, `*${shown}* 变成 *${right}*。`],
      [
        ["*{wrong}* does not follow the rule for this word's ending.", "*{wrong}* 不符合这个词结尾的拼写规则。"],
        ["*{wrong}* is not how the past is spelled.", "*{wrong}* 不是过去式的正确拼写。"],
      ],
    ),
  ],
});

const pastIrregular = topic("grammar", {
  id: "irregular-past-verbs",
  title: ["Past Verbs That Change", "不规则的过去式"],
  summary: [
    "Some action words change their spelling for the past: *run*, *ran*; *go*, *went*.",
    "有些动作词表示过去时会改变拼写：*run*、*ran*；*go*、*went*。",
  ],
  after: ["past-tense-with-ed"],
  xp: 10,
  points: [
    choose(
      "the-past-that-changes",
      ["The Past That Changes", "会变的过去式"],
      [
        "Some action words do not add *-ed*. They change: *run* → ***ran***, *go* → ***went***, *see* → ***saw***, *eat* → ***ate***, *sit* → ***sat***, *come* → ***came***. You learn them by using them.",
        "有些动作词不加 *-ed*，而是变形：*run* → ***ran***，*go* → ***went***，*see* → ***saw***，*eat* → ***ate***，*sit* → ***sat***，*come* → ***came***。多用就记住了。",
      ],
      ["Which word fits?", "哪个词合适？"],
      `
      Yesterday, I ___ to the park.|went|goed|go
      Last night, we ___ fish for dinner.|ate|eated|eat
      This morning, the cat ___ fast.|ran|runned|run
      Yesterday, I ___ a big bird.|saw|seed|see
      Last week, Gran ___ to visit.|came|comed|come
      Yesterday, we ___ on the bench.|sat|sitted|sit
      Last night, Ben ___ a good dream.|had|haved|have
      This morning, I ___ a picture.|drew|drawed|draw
      Yesterday, Kim ___ me a gift.|gave|gived|give
      Last week, I ___ a tooth.|lost|losed|lose
      Yesterday, Sam ___ a race.|won|winned|win
      Last night, I ___ in my own bed.|slept|sleeped|sleep
      This morning, Mom ___ the car.|drove|drived|drive
      Yesterday, we ___ a song.|sang|singed|sing
      Last week, I ___ a fish.|caught|catched|catch
      Yesterday, the bird ___ away.|flew|flied|fly
      Last night, Dad ___ me a story.|told|telled|tell
      This morning, I ___ my milk.|drank|drinked|drink
      Yesterday, Kim ___ her bike.|rode|rided|ride
      Last week, we ___ a big tree.|found|finded|find
      Yesterday, Ben ___ his arm.|broke|breaked|break
      Last night, I ___ my friend a letter.|wrote|writed|write
      This morning, the sun ___ up.|came|comed|come
      Yesterday, I ___ a cold.|had|haved|have
      Last week, Gran ___ me a hat.|made|maked|make
      Yesterday, the kids ___ to school.|went|goed|go
      Last night, the dog ___ a bone.|hid|hided|hide
      This morning, we ___ the bus.|took|taked|take
      Yesterday, I ___ my name.|said|sayed|say
      Last week, the baby ___ two teeth.|grew|growed|grow
      `,
      (right, shown) => [
        `*${filled(shown, right)}*: this action word changes for the past.`,
        `*${filled(shown, right)}*：这个动作词的过去式要变形。`,
      ],
      [
        ["*{wrong}* adds *-ed*, but this word changes instead.", "*{wrong}* 加了 *-ed*，但这个词要变形。"],
        ["*{wrong}* tells about now, not the past.", "*{wrong}* 说的是现在，不是过去。"],
      ],
    ),
    choose(
      "fixing-the-past",
      ["Fixing the Past", "改正过去式"],
      [
        "Read your writing and check each action word that tells the past. If you wrote *-ed* on a word that changes, fix it: *I **runned*** → *I **ran***.",
        "读一读自己写的东西，检查每个表示过去的动作词。如果给一个要变形的词加了 *-ed*，就改正它：*I **runned*** → *I **ran***。",
      ],
      ["Which sentence is right?", "哪个句子是对的？"],
      `
      run|I ran home after school.|I runned home after school.|I run home yesterday.
      see|We saw a frog in the pond.|We seed a frog in the pond.|We see a frog last week.
      go|Mom went to the shop.|Mom goed to the shop.|Mom go to the shop last night.
      eat|The dog ate my sock.|The dog eated my sock.|The dog eat my sock yesterday.
      sit|We sat on the rug.|We sitted on the rug.|We sit on the rug last night.
      come|Dad came home late.|Dad comed home late.|Dad come home late last night.
      give|Sam gave me a pen.|Sam gived me a pen.|Sam give me a pen yesterday.
      get|I got a new hat.|I getted a new hat.|I get a new hat last week.
      make|We made a cake.|We maked a cake.|We make a cake yesterday.
      take|Ann took the bus.|Ann taked the bus.|Ann take the bus last week.
      win|Kim won the game.|Kim winned the game.|Kim win the game yesterday.
      sleep|I slept late.|I sleeped late.|I sleep late last night.
      drive|Dad drove to work.|Dad drived to work.|Dad drive to work yesterday.
      sing|We sang a song.|We singed a song.|We sing a song last night.
      catch|Ben caught the ball.|Ben catched the ball.|Ben catch the ball yesterday.
      fly|The bird flew away.|The bird flied away.|The bird fly away yesterday.
      drink|I drank my juice.|I drinked my juice.|I drink my juice last night.
      ride|Mom rode a horse.|Mom rided a horse.|Mom ride a horse last week.
      find|We found a shell.|We finded a shell.|We find a shell yesterday.
      break|The cup broke.|The cup breaked.|The cup break yesterday.
      write|I wrote a note.|I writed a note.|I write a note last night.
      hide|The cat hid under the bed.|The cat hided under the bed.|The cat hide under the bed yesterday.
      grow|The plant grew tall.|The plant growed tall.|The plant grow tall last year.
      say|Gran said hello.|Gran sayed hello.|Gran say hello yesterday.
      throw|Sam threw the ball.|Sam throwed the ball.|Sam throw the ball yesterday.
      know|I knew the answer.|I knowed the answer.|I know the answer yesterday.
      tell|Dad told a joke.|Dad telled a joke.|Dad tell a joke last night.
      buy|We bought some milk.|We buyed some milk.|We buy some milk yesterday.
      swim|The kids swam in the lake.|The kids swimmed in the lake.|The kids swim in the lake last week.
      fall|The leaf fell down.|The leaf falled down.|The leaf fall down yesterday.
      `,
      (right) => [`*${right}* uses the right past form.`, `*${right}* 用了正确的过去式。`],
      [
        ["*{wrong}* adds *-ed* to a word that changes.", "*{wrong}* 给要变形的词加了 *-ed*。"],
        ["*{wrong}* tells about the past with a word for now.", "*{wrong}* 用表示现在的词来说过去的事。"],
      ],
    ),
  ],
});

const beVerbs = topic("grammar", {
  id: "is-are-was-were",
  title: ["Is, Are, Was and Were", "is、are、was 和 were"],
  summary: ["Use *is* and *was* for one, *are* and *were* for more than one.", "一个用 *is* 和 *was*，多个用 *are* 和 *were*。"],
  after: ["past-tense-with-ed"],
  xp: 10,
  points: [
    choose(
      "is-or-are",
      ["Is or Are", "is 还是 are"],
      [
        "Use **is** for one person or thing, and **are** for more than one: *The cat **is** wet. The cats **are** wet.* With *you* and *we*, use *are*: *We **are** ready.*",
        "一个人或一样东西用 **is**，多个用 **are**：*The cat **is** wet. The cats **are** wet.*。*you* 和 *we* 也用 *are*：*We **are** ready.*。",
      ],
      ["Which word fits?", "哪个词合适？"],
      `
      The cats ___ wet.|are|is
      The cat ___ wet.|is|are
      We ___ ready to go.|are|is
      My sister ___ seven.|is|are
      The apples ___ red.|are|is
      You ___ my best friend.|are|is
      The sky ___ blue.|is|are
      The kids ___ in the yard.|are|is
      This book ___ funny.|is|are
      My shoes ___ too small.|are|is
      The dog ___ hungry.|is|are
      The dogs ___ hungry.|are|is
      My hands ___ cold.|are|is
      The pie ___ hot.|is|are
      They ___ at school.|are|is
      Gran ___ in the garden.|is|are
      The flowers ___ pretty.|are|is
      I think the movie ___ long.|is|are
      The birds ___ in the tree.|are|is
      My hat ___ blue.|is|are
      The boys ___ on the bus.|are|is
      This apple ___ sweet.|is|are
      The stars ___ bright tonight.|are|is
      Ben ___ my cousin.|is|are
      The cups ___ on the table.|are|is
      The water ___ cold.|is|are
      My friends ___ here.|are|is
      The baby ___ asleep.|is|are
      These shoes ___ new.|are|is
      The road ___ wet.|is|are
      `,
      (right, shown) => [
        `*${filled(shown, right)}*: ${right === "is" ? "one, so *is*" : "more than one, or *you* or *we*, so *are*"}.`,
        `*${filled(shown, right)}*：${right === "is" ? "一个，所以用 *is*" : "多个，或是 *you*、*we*，所以用 *are*"}。`,
      ],
      [["*{wrong}* does not match how many there are.", "*{wrong}* 和数量不相符。"]],
    ),
    choose(
      "was-or-were",
      ["Was or Were", "was 还是 were"],
      [
        "For the past, *is* becomes **was** and *are* becomes **were**: *The cat **was** wet. The cats **were** wet.* With *you* and *we*, use *were*: *We **were** late.*",
        "表示过去时，*is* 变成 **was**，*are* 变成 **were**：*The cat **was** wet. The cats **were** wet.*。*you* 和 *we* 用 *were*：*We **were** late.*。",
      ],
      ["Which word fits?", "哪个词合适？"],
      `
      Yesterday, the dogs ___ muddy.|were|was
      Last night, the moon ___ big.|was|were
      We ___ late for school.|were|was
      The cake ___ good.|was|were
      The kids ___ happy at the party.|were|was
      My bike ___ in the shed.|was|were
      You ___ funny in the play.|were|was
      The room ___ dark.|was|were
      The ducks ___ in the pond.|were|was
      Gran ___ at the park.|was|were
      Last night, the dog ___ muddy.|was|were
      Yesterday, the cats ___ hungry.|were|was
      I ___ tired after the game.|was|were
      The cookies ___ yummy.|were|was
      The sun ___ hot at the beach.|was|were
      My friends ___ at my house.|were|was
      The test ___ easy.|was|were
      The leaves ___ red and gold.|were|was
      Mom ___ happy with my card.|was|were
      The boys ___ in the yard.|were|was
      The water ___ cold.|was|were
      You ___ right about the rain.|were|was
      The baby ___ asleep.|was|were
      The stars ___ bright last night.|were|was
      My shoe ___ under the bed.|was|were
      The pigs ___ in the mud.|were|was
      The game ___ fun.|was|were
      We ___ at the zoo all day.|were|was
      The door ___ open.|was|were
      The apples ___ green.|were|was
      `,
      (right, shown) => [
        `*${filled(shown, right)}*: ${right === "was" ? "one, in the past, so *was*" : "more than one, or *you* or *we*, in the past, so *were*"}.`,
        `*${filled(shown, right)}*：${right === "was" ? "一个，过去，所以用 *was*" : "多个，或是 *you*、*we*，过去，所以用 *were*"}。`,
      ],
      [["*{wrong}* does not match how many there are.", "*{wrong}* 和数量不相符。"]],
    ),
  ],
});

const owning = topic("grammar", {
  id: "owning-with-apostrophe-s",
  title: ["Owning with 's", "用 's 表示所属"],
  summary: ["Add *'s* to a naming word to show who owns something: *Sam's hat*.", "在名称词后加 *'s* 表示东西属于谁：*Sam's hat*。"],
  after: ["is-are-was-were"],
  xp: 10,
  points: [
    choose(
      "whose-is-it",
      ["Whose Is It", "是谁的"],
      [
        "To show that something belongs to someone, add an **apostrophe and s**: *the hat that Sam has* is ***Sam's** hat*; *the bone of the dog* is *the **dog's** bone*.",
        "要表示某样东西属于某人，就加**撇号和 s**：*the hat that Sam has* 就是 ***Sam's** hat*；*the bone of the dog* 就是 *the **dog's** bone*。",
      ],
      ["Which words fit?", "哪些词合适？"],
      `
      The hat that Sam has is ___.|Sam's hat|Sams hat|Sam hat's
      The bone the dog has is ___.|the dog's bone|the dogs bone|the dog bone's
      The bike that Kim has is ___.|Kim's bike|Kims bike|Kim bike's
      The nest the bird made is ___.|the bird's nest|the birds nest|the bird nest's
      The car that Dad has is ___.|Dad's car|Dads car|Dad car's
      The toy the baby has is ___.|the baby's toy|the babys toy|the baby toy's
      The bag that Ann has is ___.|Ann's bag|Anns bag|Ann bag's
      The tail the cat has is ___.|the cat's tail|the cats tail|the cat tail's
      The book that Mom has is ___.|Mom's book|Moms book|Mom book's
      The ball the pup has is ___.|the pup's ball|the pups ball|the pup ball's
      The cap that Ben has is ___.|Ben's cap|Bens cap|Ben cap's
      The egg the hen laid is ___.|the hen's egg|the hens egg|the hen egg's
      The doll that Mia has is ___.|Mia's doll|Mias doll|Mia doll's
      The paw the dog hurt is ___.|the dog's paw|the dogs paw|the dog paw's
      The pen that Gran has is ___.|Gran's pen|Grans pen|Gran pen's
      The bed the cat sleeps in is ___.|the cat's bed|the cats bed|the cat bed's
      The kite that Sam has is ___.|Sam's kite|Sams kite|Sam kite's
      The web the spider made is ___.|the spider's web|the spiders web|the spider web's
      The coat that Ann has is ___.|Ann's coat|Anns coat|Ann coat's
      The shell the crab has is ___.|the crab's shell|the crabs shell|the crab shell's
      The desk that Kim has is ___.|Kim's desk|Kims desk|Kim desk's
      The cup the baby has is ___.|the baby's cup|the babys cup|the baby cup's
      The truck that Dad has is ___.|Dad's truck|Dads truck|Dad truck's
      The hole the mole dug is ___.|the mole's hole|the moles hole|the mole hole's
      The ring that Mom has is ___.|Mom's ring|Moms ring|Mom ring's
      The barn the horse lives in is ___.|the horse's barn|the horses barn|the horse barn's
      The drum that Leo has is ___.|Leo's drum|Leos drum|Leo drum's
      The tail the fox has is ___.|the fox's tail|the foxs tail|the fox tail's
      The song that Pam sings is ___.|Pam's song|Pams song|Pam song's
      The horn the car has is ___.|the car's horn|the cars horn|the car horn's
      `,
      (right) => [`*${right}*: *'s* goes on the one who owns it.`, `*${right}*：*'s* 加在拥有者后面。`],
      [
        ["*{wrong}* leaves out the apostrophe.", "*{wrong}* 漏掉了撇号。"],
        ["*{wrong}* puts *'s* on the thing, not on the one who owns it.", "*{wrong}* 把 *'s* 加在了东西上，而不是拥有者上。"],
      ],
    ),
    choose(
      "owning-or-more-than-one",
      ["Owning or More Than One", "所属还是复数"],
      [
        "An *s* at the end can mean two things. With an apostrophe, ***'s*** shows owning: *the cat's bowl*. With no apostrophe, ***s*** means more than one: *two cats*. Do not use an apostrophe just to make more than one.",
        "词尾的 *s* 有两种意思。带撇号的 ***'s*** 表示所属：*the cat's bowl*。不带撇号的 ***s*** 表示多个：*two cats*。不要只为了表示多个而加撇号。",
      ],
      ["Which word fits?", "哪个词合适？"],
      `
      I have two ___.|cats|cat's
      The ___ bowl is empty.|cat's|cats
      Three ___ swim in the pond.|ducks|duck's
      The ___ bill is orange.|duck's|ducks
      We saw five ___.|frogs|frog's
      The ___ legs are long.|frog's|frogs
      I picked six ___.|apples|apple's
      My ___ name is Rex.|dog's|dogs
      The ___ are on the shelf.|books|book's
      The ___ cover is red.|book's|books
      The ___ milk is warm.|cat's|cats
      Four ___ play in the yard.|cats|cat's
      The ___ eggs are in the nest.|hen's|hens
      We have ten ___ on the farm.|hens|hen's
      The ___ tail is long.|dog's|dogs
      Two ___ ran to the gate.|dogs|dog's
      The ___ shell is hard.|crab's|crabs
      I saw three ___ on the sand.|crabs|crab's
      My ___ bike is red.|sister's|sisters
      I have two ___.|sisters|sister's
      The ___ hat is big.|clown's|clowns
      Five ___ came to the party.|clowns|clown's
      The ___ roof is red.|house's|houses
      There are six ___ on our street.|houses|house's
      The ___ nest is in the tree.|bird's|birds
      Many ___ sing in the morning.|birds|bird's
      The ___ leaves are green.|tree's|trees
      We planted four ___.|trees|tree's
      The ___ wheels are big.|truck's|trucks
      I see two ___ on the road.|trucks|truck's
      `,
      (right, shown) => [
        `*${filled(shown, right)}*: ${right.includes("'") ? "it shows owning, so it takes *'s*" : "it means more than one, so no apostrophe"}.`,
        `*${filled(shown, right)}*：${right.includes("'") ? "它表示所属，所以用 *'s*" : "它表示多个，所以不加撇号"}。`,
      ],
      [["*{wrong}* is the other kind of *s*.", "*{wrong}* 是另一种 *s*。"]],
    ),
  ],
});

const comparing = topic("grammar", {
  id: "adjectives-that-compare",
  title: ["Describing Words That Compare", "表示比较的描述词"],
  summary: ["Add *-er* to compare two things and *-est* to compare three or more.", "比较两样东西加 *-er*，比较三样或更多加 *-est*。"],
  after: ["is-are-was-were"],
  xp: 10,
  points: [
    choose(
      "er-or-est",
      ["-er or -est", "-er 还是 -est"],
      [
        "To compare **two** things, add **-er**: *A dog is big**ger** than a cat.* To compare **three or more**, add **-est**: *The elephant is the big**gest** of all.* Look for *than* (two) or *the … of all* (more).",
        "比较**两样**东西时加 **-er**：*A dog is big**ger** than a cat.*。比较**三样或更多**时加 **-est**：*The elephant is the big**gest** of all.*。找一找 *than*（两样）或 *the … of all*（更多）。",
      ],
      ["Which word fits?", "哪个词合适？"],
      `
      A dog is ___ than a cat.|bigger|biggest|big
      The elephant is the ___ of all.|biggest|bigger|big
      Sam is ___ than Ben.|taller|tallest|tall
      Kim is the ___ in the class.|tallest|taller|tall
      A car is ___ than a bike.|faster|fastest|fast
      The jet is the ___ of the three.|fastest|faster|fast
      Today is ___ than yesterday.|colder|coldest|cold
      This is the ___ day of the year.|coldest|colder|cold
      My cup is ___ than yours.|smaller|smallest|small
      The mouse is the ___ of all the pets.|smallest|smaller|small
      A horse is ___ than a dog.|bigger|biggest|big
      The whale is the ___ of all.|biggest|bigger|big
      Ben is ___ than his sister.|older|oldest|old
      Gran is the ___ in our family.|oldest|older|old
      A cat is ___ than a turtle.|faster|fastest|fast
      The cheetah is the ___ of all.|fastest|faster|fast
      Ice is ___ than water.|colder|coldest|cold
      This is the ___ room in the house.|coldest|colder|cold
      A bus is ___ than a car.|longer|longest|long
      That snake is the ___ in the zoo.|longest|longer|long
      My bag is ___ than yours.|lighter|lightest|light
      This feather is the ___ of all.|lightest|lighter|light
      A rock is ___ than a sponge.|harder|hardest|hard
      This is the ___ test of the year.|hardest|harder|hard
      Kim is ___ than Pam.|shorter|shortest|short
      Leo is the ___ in our class.|shortest|shorter|short
      Today is ___ than yesterday.|warmer|warmest|warm
      July is the ___ month here.|warmest|warmer|warm
      A mouse is ___ than a rat.|smaller|smallest|small
      The ant is the ___ bug I saw.|smallest|smaller|small
      `,
      (right, shown) => [
        `*${filled(shown, right)}*: ${right.endsWith("est") ? "three or more, so *-est*" : "two things, so *-er*"}.`,
        `*${filled(shown, right)}*：${right.endsWith("est") ? "三样或更多，所以用 *-est*" : "两样东西，所以用 *-er*"}。`,
      ],
      [
        ["*{wrong}* compares the wrong number of things.", "*{wrong}* 比较的数量不对。"],
        ["*{wrong}* does not compare at all.", "*{wrong}* 根本没有比较。"],
      ],
    ),
    choose(
      "spelling-er-and-est",
      ["Spelling -er and -est", "-er 和 -est 的拼写"],
      [
        "Spell with care: a word ending in **e** adds only *-r* or *-st* (*nice*, *nicer*, *nicest*); a short word ending in one vowel and one consonant doubles it (*big*, *bi**gg**er*); a word ending in **y** changes it to **i** (*happy*, *happ**i**er*).",
        "拼写时要小心：以 **e** 结尾的词只加 *-r* 或 *-st*（*nice*、*nicer*、*nicest*）；以一个元音加一个辅音结尾的短词要双写（*big*、*bi**gg**er*）；以 **y** 结尾的词把 **y** 变成 **i**（*happy*、*happ**i**er*）。",
      ],
      ["Which is the right spelling?", "哪个拼写是对的？"],
      `
      big + er|bigger|biger|bigr
      nice + er|nicer|niceer|nicor
      happy + er|happier|happyer|happer
      hot + est|hottest|hotest|hotst
      funny + est|funniest|funnyest|funest
      large + est|largest|largeest|largst
      sad + er|sadder|sader|sadr
      busy + er|busier|busyer|buser
      wide + er|wider|wideer|widdr
      thin + est|thinnest|thinest|thinst
      fat + er|fatter|fater|fatr
      cute + er|cuter|cuteer|cutter
      silly + er|sillier|sillyer|siller
      wet + est|wettest|wetest|wetst
      easy + est|easiest|easyest|easest
      safe + est|safest|safeest|saffest
      red + er|redder|reder|redr
      tiny + er|tinier|tinyer|tiner
      late + er|later|lateer|latter
      fit + est|fittest|fitest|fitst
      lucky + est|luckiest|luckyest|luckest
      close + est|closest|closeest|clossest
      dim + er|dimmer|dimer|dimr
      happy + est|happiest|happyest|happest
      nice + est|nicest|niceest|nicst
      flat + er|flatter|flater|flatr
      funny + er|funnier|funnyer|funer
      brave + er|braver|braveer|bravver
      mad + est|maddest|madest|madst
      pretty + er|prettier|prettyer|pretter
      `,
      (right, shown) => [`*${shown}* makes *${right}*.`, `*${shown}* 变成 *${right}*。`],
      [
        ["*{wrong}* misses the change this ending needs.", "*{wrong}* 没有按这个词尾的规则变化。"],
        ["*{wrong}* is not a word.", "*{wrong}* 不是一个词。"],
      ],
    ),
  ],
});

const irregularPlurals = topic("grammar", {
  id: "irregular-plurals",
  title: ["Plurals That Change", "不规则复数"],
  summary: [
    "Some naming words change for more than one: *child*, *children*; *mouse*, *mice*.",
    "有些名称词表示多个时会变形：*child*、*children*；*mouse*、*mice*。",
  ],
  after: ["one-and-more-than-one"],
  xp: 10,
  points: [
    choose(
      "the-plural-that-changes",
      ["The Plural That Changes", "会变的复数"],
      [
        "Most naming words add *s*, but a few change: *man* → ***men***, *woman* → ***women***, *child* → ***children***, *foot* → ***feet***, *tooth* → ***teeth***, *mouse* → ***mice***, *goose* → ***geese***. Some stay the same: *one sheep*, *two **sheep***; *one fish*, *two **fish***.",
        "大多数名称词加 *s*，但有一些会变形：*man* → ***men***，*woman* → ***women***，*child* → ***children***，*foot* → ***feet***，*tooth* → ***teeth***，*mouse* → ***mice***，*goose* → ***geese***。还有一些不变：*one sheep*、*two **sheep***；*one fish*、*two **fish***。",
      ],
      ["Which word fits?", "哪个词合适？"],
      `
      I have two ___.|feet|foots|feets
      The cat saw three ___.|mice|mouses|mices
      Six ___ played in the park.|children|childs|childrens
      I brush my ___.|teeth|tooths|teeths
      Two ___ fixed the road.|men|mans|mens
      Five ___ swam on the lake.|geese|gooses|geeses
      We saw ten ___ on the hill.|sheep|sheeps|sheepes
      Four ___ sang a song.|women|womans|womens
      The farmer has six ___.|sheep|sheeps|sheepes
      Lots of ___ ran into the hole.|mice|mouses|mices
      The dentist looked at my ___.|teeth|tooths|teeths
      Three ___ hopped across the road.|mice|mouses|mices
      The ___ ran to the playground.|children|childs|childrens
      My ___ are wet from the rain.|feet|foots|feets
      Four ___ waited for the bus.|men|mans|mens
      The ___ honked by the pond.|geese|gooses|geeses
      Two ___ chatted at the shop.|women|womans|womens
      The baby has two new ___.|teeth|tooths|teeths
      I saw many ___ on the farm.|geese|gooses|geeses
      The ___ in the play wore hats.|children|childs|childrens
      Ten ___ hid in the barn.|mice|mouses|mices
      Both of my ___ hurt.|feet|foots|feets
      The ___ built a fence.|men|mans|mens
      The ___ grew lots of corn.|women|womans|womens
      The ___ ate grass on the hill.|sheep|sheeps|sheepes
      We counted twelve ___.|sheep|sheeps|sheepes
      The pond had five ___ in it.|geese|gooses|geeses
      I wiggled my ___ in the sand.|feet|foots|feets
      The cat chased two ___.|mice|mouses|mices
      The ___ sang at the party.|children|childs|childrens
      `,
      (right, shown) => [
        `*${filled(shown, right)}*: this word changes for more than one.`,
        `*${filled(shown, right)}*：这个词的复数要变形。`,
      ],
      [
        ["*{wrong}* adds *s*, but this word changes instead.", "*{wrong}* 加了 *s*，但这个词要变形。"],
        ["*{wrong}* changes the word and adds *s* too.", "*{wrong}* 既变了形又加了 *s*。"],
      ],
    ),
    choose(
      "one-or-more",
      ["One or More", "一个还是多个"],
      [
        "Read for *how many*: one is ***child***, more is ***children***. A word like *a*, *one* or *my* (for one thing) needs the word for one.",
        "看清*有多少*：一个是 ***child***，多个是 ***children***。*a*、*one* 这样的词后面要用表示一个的词。",
      ],
      ["Which word fits?", "哪个词合适？"],
      `
      A ___ sat on the swing.|child|children
      Three ___ sat on the swing.|children|child
      One ___ hid in the box.|mouse|mice
      Two ___ hid in the box.|mice|mouse
      My left ___ hurts.|foot|feet
      Both my ___ are cold.|feet|foot
      A ___ fell out!|tooth|teeth
      I have lots of ___.|teeth|tooth
      A ___ came to the door.|man|men
      Two ___ came to the door.|men|man
      One ___ honked at me.|goose|geese
      Three ___ honked at me.|geese|goose
      My right ___ is cold.|foot|feet
      A ___ read a book to us.|woman|women
      Two ___ read books to us.|women|woman
      I lost a baby ___.|tooth|teeth
      I brush all my ___.|teeth|tooth
      One ___ ran up the clock.|mouse|mice
      Many ___ ran up the clock.|mice|mouse
      I hopped on one ___.|foot|feet
      I jumped with both ___.|feet|foot
      A ___ waved at us.|man|men
      Some ___ waved at us.|men|man
      Each ___ got a sticker.|child|children
      All the ___ got stickers.|children|child
      A ___ swam on the lake.|goose|geese
      Six ___ swam on the lake.|geese|goose
      That ___ is my aunt.|woman|women
      Those ___ are my aunts.|women|woman
      One ___ fixed the car.|man|men
      `,
      (right, shown) => [`*${filled(shown, right)}* matches how many there are.`, `*${filled(shown, right)}* 和数量相符。`],
      [["*{wrong}* is the word for the other number.", "*{wrong}* 是表示另一种数量的词。"]],
    ),
  ],
});

const contractions = topic("grammar", {
  id: "making-contractions",
  title: ["Contractions", "缩写形式"],
  summary: [
    "Two words can be pushed together, with an apostrophe for the missing letters: *do not*, *don't*.",
    "两个词可以合在一起，用撇号代替省去的字母：*do not*、*don't*。",
  ],
  after: ["owning-with-apostrophe-s"],
  xp: 10,
  points: [
    choose(
      "two-words-into-one",
      ["Two Words into One", "两个词变一个"],
      [
        "A **contraction** joins two words and leaves out a letter or two. An **apostrophe** goes where the letters were: *do not* → *don**'**t*; *I am* → *I**'**m*; *it is* → *it**'**s*; *cannot* → *can**'**t*.",
        "**缩写形式**把两个词合在一起，并省去一两个字母。**撇号**放在字母省去的地方：*do not* → *don**'**t*；*I am* → *I**'**m*；*it is* → *it**'**s*；*cannot* → *can**'**t*。",
      ],
      ["Which is the contraction?", "哪个是缩写形式？"],
      `
      do not|don't|do'nt|dont
      I am|I'm|Im|I'am
      it is|it's|its|i'ts
      cannot|can't|ca'nt|cant
      is not|isn't|is'nt|isnt
      we are|we're|were|w'ere
      you are|you're|your|yo'ure
      did not|didn't|did'nt|didnt
      she is|she's|shes|sh'es
      they are|they're|theyre|the'yre
      he is|he's|h'es|hes
      was not|wasn't|was'nt|wasnt
      are not|aren't|are'nt|arent
      does not|doesn't|does'nt|doesnt
      have not|haven't|have'nt|havent
      has not|hasn't|has'nt|hasnt
      could not|couldn't|could'nt|couldnt
      should not|shouldn't|should'nt|shouldnt
      would not|wouldn't|would'nt|wouldnt
      were not|weren't|were'nt|werent
      I will|I'll|I'wll|Ill
      we will|we'll|w'ell|well
      you will|you'll|yo'ull|youll
      she will|she'll|sh'ell|shell
      it will|it'll|i'tll|itll
      that is|that's|tha'ts|thats
      what is|what's|wha'ts|whats
      let us|let's|le'ts|lets
      I have|I've|I'hve|Ive
      you have|you've|yo'uve|youve
      `,
      (right, shown) => [
        `*${shown}* becomes *${right}*: the apostrophe takes the place of the missing letter.`,
        `*${shown}* 变成 *${right}*：撇号代替了省去的字母。`,
      ],
      [
        ["*{wrong}* puts the apostrophe in the wrong place.", "*{wrong}* 把撇号放错了地方。"],
        ["*{wrong}* leaves out the apostrophe, so it is another word or no word.", "*{wrong}* 漏掉了撇号，成了另一个词或者不成词。"],
      ],
    ),
    choose(
      "what-the-contraction-means",
      ["What the Contraction Means", "缩写形式的意思"],
      [
        "To read a contraction, say the two words it stands for: *We **can't** go* means *We **cannot** go*. *I'll* is *I will*; *won't* is *will not*.",
        "读缩写形式时，说出它代表的两个词：*We **can't** go* 就是 *We **cannot** go*。*I'll* 是 *I will*；*won't* 是 *will not*。",
      ],
      ["What do the bold words mean?", "粗体部分是什么意思？"],
      `
      We **can't** go out.|cannot|can it|could not
      **I'm** six.|I am|I will|I had
      **It's** hot today.|It is|It was|Its
      I **don't** like peas.|do not|did not|does not
      **I'll** help you.|I will|I am|I would
      She **isn't** here.|is not|was not|it is
      **We're** at home.|We are|We were|We will
      He **won't** stop.|will not|was not|would not
      **They're** late.|They are|They were|There are
      You **didn't** eat.|did not|do not|does not
      **He's** my brother.|He is|He was|He will
      It **wasn't** me.|was not|is not|were not
      We **aren't** ready.|are not|were not|is not
      She **doesn't** know.|does not|did not|do not
      I **haven't** seen it.|have not|had not|has not
      He **hasn't** come yet.|has not|had not|have not
      I **couldn't** sleep.|could not|can not|would not
      You **shouldn't** run here.|should not|could not|shall not
      She **wouldn't** stop laughing.|would not|will not|could not
      They **weren't** home.|were not|was not|are not
      **We'll** see you soon.|We will|We would|We are
      **You'll** like it.|You will|You are|You would
      **She'll** be here.|She will|She is|She would
      **That's** my bike.|That is|That was|That will
      **What's** your name?|What is|What was|What will
      **Let's** play outside.|Let us|Let is|Lets go
      **I've** got a cat.|I have|I am|I had
      **You've** done it!|You have|You are|You had
      **He'll** win the race.|He will|He is|He would
      **Who's** at the door?|Who is|Who was|Whose
      `,
      (right) => [`The contraction stands for *${right}*.`, `这个缩写形式代表 *${right}*。`],
      [
        ["*{wrong}* uses the wrong first or second word.", "*{wrong}* 第一个或第二个词不对。"],
        ["*{wrong}* tells a different time or a different word.", "*{wrong}* 表示的时间或词不对。"],
      ],
    ),
  ],
});

const andButOr = topic("grammar", {
  id: "and-but-and-or",
  title: ["And, But and Or", "and、but 和 or"],
  summary: [
    "Join two sentences with *and* to add, *but* to show a difference, and *or* to give a choice.",
    "用 *and* 连接表示补充，用 *but* 表示不同，用 *or* 表示选择。",
  ],
  after: ["past-tense-with-ed"],
  xp: 10,
  points: [
    choose(
      "the-joining-word",
      ["The Joining Word", "连接词"],
      [
        "Pick the joining word that fits the meaning: **and** adds one more thing (*I ran, **and** I jumped*); **but** shows something different or surprising (*I ran, **but** I was slow*); **or** gives a choice (*We can walk, **or** we can ride*).",
        "根据意思选连接词：**and** 再补充一件事（*I ran, **and** I jumped*）；**but** 表示不同或意外（*I ran, **but** I was slow*）；**or** 提供选择（*We can walk, **or** we can ride*）。",
      ],
      ["Which word fits?", "哪个词合适？"],
      `
      I like milk, ___ I do not like tea.|but|and|or
      We can walk, ___ we can ride a bike.|or|but|and
      Sam has a dog, ___ he has a cat too.|and|but|or
      It was sunny, ___ it was cold.|but|or|and
      Do you want an apple, ___ do you want a plum?|or|and|but
      I read a book, ___ then I went to bed.|and|or|but
      The box was big, ___ it was not heavy.|but|and|or
      We can play tag, ___ we can play ball.|or|but|and
      Kim sang, ___ Ben played the drum.|and|or|but
      I looked for my hat, ___ I could not find it.|but|or|and
      I wanted to play, ___ it was raining.|but|and|or
      Mom made soup, ___ Dad made bread.|and|or|but
      Is your cat black, ___ is it white?|or|but|and
      The cake was small, ___ it was very good.|but|or|and
      We can paint, ___ we can draw.|or|and|but
      Ben ate lunch, ___ then he went out.|and|but|or
      I called her, ___ she did not answer.|but|and|or
      Do you want to swim, ___ do you want to read?|or|and|but
      The dog barked, ___ the cat ran away.|and|or|but
      The hill was steep, ___ we got to the top.|but|or|and
      You can have juice, ___ you can have milk.|or|but|and
      Pam picked flowers, ___ she put them in a vase.|and|or|but
      I was sleepy, ___ I stayed up to see the stars.|but|and|or
      Should we go left, ___ should we go right?|or|but|and
      We went to the zoo, ___ we saw a lion.|and|or|but
      My bike is old, ___ it still goes fast.|but|or|and
      Kim can sing, ___ she can dance too.|and|or|but
      You can wear the red hat, ___ you can wear the blue one.|or|and|but
      The door was open, ___ nobody was inside.|but|or|and
      I fed the fish, ___ then I fed the dog.|and|or|but
      `,
      (right) => [
        `*${right}* fits: it ${right === "and" ? "adds one more thing" : right === "but" ? "shows something different" : "gives a choice"}.`,
        `*${right}* 合适：它${right === "and" ? "补充了一件事" : right === "but" ? "表示不同" : "提供了选择"}。`,
      ],
      [
        ["*{wrong}* joins the sentences, but it does not fit the meaning.", "*{wrong}* 能连接句子，但不符合意思。"],
        ["*{wrong}* gives the wrong meaning here.", "*{wrong}* 在这里表达的意思不对。"],
      ],
    ),
    choose(
      "the-comma-before-the-joining-word",
      ["The Comma Before the Joining Word", "连接词前的逗号"],
      [
        "When *and*, *but* or *or* joins two whole sentences, put a **comma** before it: *I was hungry**,** and I ate.* Do not join two whole sentences with only a comma.",
        "当 *and*、*but* 或 *or* 连接两个完整的句子时，在它前面加**逗号**：*I was hungry**,** and I ate.*。不要只用逗号连接两个完整的句子。",
      ],
      ["Which sentence is joined the right way?", "哪个句子连接得对？"],
      `
      I was tired / I went to bed|I was tired, and I went to bed.|I was tired, I went to bed.|I was tired and, I went to bed.
      It rained / we stayed in|It rained, and we stayed in.|It rained, we stayed in.|It rained and, we stayed in.
      I like cats / Dad likes dogs|I like cats, but Dad likes dogs.|I like cats, Dad likes dogs.|I like cats but, Dad likes dogs.
      We can swim / we can fish|We can swim, or we can fish.|We can swim, we can fish.|We can swim or, we can fish.
      The sun came out / the snow melted|The sun came out, and the snow melted.|The sun came out, the snow melted.|The sun came out and, the snow melted.
      I ran fast / I did not win|I ran fast, but I did not win.|I ran fast, I did not win.|I ran fast but, I did not win.
      You can draw / you can paint|You can draw, or you can paint.|You can draw, you can paint.|You can draw or, you can paint.
      Ben fell / he got up|Ben fell, but he got up.|Ben fell, he got up.|Ben fell but, he got up.
      The bell rang / the kids ran out|The bell rang, and the kids ran out.|The bell rang, the kids ran out.|The bell rang and, the kids ran out.
      I wanted cake / there was none|I wanted cake, but there was none.|I wanted cake, there was none.|I wanted cake but, there was none.
      The baby cried / Mom picked her up|The baby cried, and Mom picked her up.|The baby cried, Mom picked her up.|The baby cried and, Mom picked her up.
      I looked everywhere / I could not find my shoe|I looked everywhere, but I could not find my shoe.|I looked everywhere, I could not find my shoe.|I looked everywhere but, I could not find my shoe.
      We can stay in / we can go out|We can stay in, or we can go out.|We can stay in, we can go out.|We can stay in or, we can go out.
      The wind blew / the leaves fell|The wind blew, and the leaves fell.|The wind blew, the leaves fell.|The wind blew and, the leaves fell.
      Sam studied hard / he passed the test|Sam studied hard, and he passed the test.|Sam studied hard, he passed the test.|Sam studied hard and, he passed the test.
      The water was cold / we swam anyway|The water was cold, but we swam anyway.|The water was cold, we swam anyway.|The water was cold but, we swam anyway.
      You can sit here / you can sit there|You can sit here, or you can sit there.|You can sit here, you can sit there.|You can sit here or, you can sit there.
      The dog was muddy / we gave it a bath|The dog was muddy, and we gave it a bath.|The dog was muddy, we gave it a bath.|The dog was muddy and, we gave it a bath.
      I tried to lift the box / it was too heavy|I tried to lift the box, but it was too heavy.|I tried to lift the box, it was too heavy.|I tried to lift the box but, it was too heavy.
      We could bake cookies / we could make a cake|We could bake cookies, or we could make a cake.|We could bake cookies, we could make a cake.|We could bake cookies or, we could make a cake.
      The lights went out / we lit a candle|The lights went out, and we lit a candle.|The lights went out, we lit a candle.|The lights went out and, we lit a candle.
      Ann was sick / she still came to the party|Ann was sick, but she still came to the party.|Ann was sick, she still came to the party.|Ann was sick but, she still came to the party.
      You can read a book / you can play a game|You can read a book, or you can play a game.|You can read a book, you can play a game.|You can read a book or, you can play a game.
      Dad cooked dinner / I set the table|Dad cooked dinner, and I set the table.|Dad cooked dinner, I set the table.|Dad cooked dinner and, I set the table.
      The bus was late / we still got to school on time|The bus was late, but we still got to school on time.|The bus was late, we still got to school on time.|The bus was late but, we still got to school on time.
      We can go to the beach / we can go to the park|We can go to the beach, or we can go to the park.|We can go to the beach, we can go to the park.|We can go to the beach or, we can go to the park.
      The snow fell all night / the roads were white|The snow fell all night, and the roads were white.|The snow fell all night, the roads were white.|The snow fell all night and, the roads were white.
      I knocked on the door / no one came|I knocked on the door, but no one came.|I knocked on the door, no one came.|I knocked on the door but, no one came.
      Kim planted seeds / she watered them every day|Kim planted seeds, and she watered them every day.|Kim planted seeds, she watered them every day.|Kim planted seeds and, she watered them every day.
      You can take the bus / you can walk to school|You can take the bus, or you can walk to school.|You can take the bus, you can walk to school.|You can take the bus or, you can walk to school.
      `,
      (right) => [`*${right}*: the comma comes before the joining word.`, `*${right}*：逗号放在连接词前面。`],
      [
        ["*{wrong}* joins two whole sentences with only a comma.", "*{wrong}* 只用逗号连接了两个完整的句子。"],
        ["*{wrong}* puts the comma after the joining word.", "*{wrong}* 把逗号放在了连接词后面。"],
      ],
    ),
  ],
});

const letters = topic("grammar", {
  id: "commas-in-letters",
  title: ["Commas in Letters", "书信中的逗号"],
  summary: [
    "Put a comma after the greeting and the closing of a letter, and between the day and the year.",
    "在书信的称呼和结束语后面加逗号，在日期的日和年之间加逗号。",
  ],
  after: ["and-but-and-or"],
  xp: 10,
  points: [
    choose(
      "greeting-and-closing",
      ["Greeting and Closing", "称呼和结束语"],
      [
        "A letter starts with a **greeting** and ends with a **closing**. Both are followed by a **comma**: *Dear Gran**,*** … *Love**,*** *Sam*. The first word of each starts with a capital.",
        "书信以**称呼**开头，以**结束语**结尾。二者后面都要加**逗号**：*Dear Gran**,*** … *Love**,*** *Sam*。它们的第一个词都要大写。",
      ],
      ["Which is written the right way?", "哪个写对了？"],
      `
      the greeting to Gran|Dear Gran,|Dear Gran.|dear Gran,
      the closing, from Sam|Love, Sam|Love. Sam|love, Sam
      the greeting to Mr. Lee|Dear Mr. Lee,|Dear Mr. Lee.|dear Mr. Lee,
      the closing, from Kim|Your friend, Kim|Your friend. Kim|your friend, Kim
      the greeting to Aunt May|Dear Aunt May,|Dear Aunt May.|dear Aunt May,
      the closing, from Ben|Thank you, Ben|Thank you. Ben|thank you, Ben
      the greeting to Dad|Dear Dad,|Dear Dad.|dear Dad,
      the closing, from Ann|Best wishes, Ann|Best wishes. Ann|best wishes, Ann
      the greeting to Ms. Green|Dear Ms. Green,|Dear Ms. Green.|dear Ms. Green,
      the closing, from Tom|See you soon, Tom|See you soon. Tom|see you soon, Tom
      the greeting to Uncle Joe|Dear Uncle Joe,|Dear Uncle Joe.|dear Uncle Joe,
      the closing, from Mia|Your pal, Mia|Your pal. Mia|your pal, Mia
      the greeting to Mrs. Diaz|Dear Mrs. Diaz,|Dear Mrs. Diaz.|dear Mrs. Diaz,
      the closing, from Leo|Thanks again, Leo|Thanks again. Leo|thanks again, Leo
      the greeting to Grandpa|Dear Grandpa,|Dear Grandpa.|dear Grandpa,
      the closing, from Nina|Your cousin, Nina|Your cousin. Nina|your cousin, Nina
      the greeting to Mom|Dear Mom,|Dear Mom.|dear Mom,
      the closing, from Raj|Hugs, Raj|Hugs. Raj|hugs, Raj
      the greeting to Ms. Park|Dear Ms. Park,|Dear Ms. Park.|dear Ms. Park,
      the closing, from Ava|Sincerely, Ava|Sincerely. Ava|sincerely, Ava
      the greeting to Cousin Ray|Dear Cousin Ray,|Dear Cousin Ray.|dear Cousin Ray,
      the closing, from Omar|Your student, Omar|Your student. Omar|your student, Omar
      the greeting to Mr. Brown|Dear Mr. Brown,|Dear Mr. Brown.|dear Mr. Brown,
      the closing, from Zoe|Love always, Zoe|Love always. Zoe|love always, Zoe
      the greeting to Aunt Rose|Dear Aunt Rose,|Dear Aunt Rose.|dear Aunt Rose,
      the closing, from Max|All the best, Max|All the best. Max|all the best, Max
      the greeting to Nana|Dear Nana,|Dear Nana.|dear Nana,
      the closing, from Eli|Your grandson, Eli|Your grandson. Eli|your grandson, Eli
      the greeting to Coach Kim|Dear Coach Kim,|Dear Coach Kim.|dear Coach Kim,
      the closing, from Ivy|Many thanks, Ivy|Many thanks. Ivy|many thanks, Ivy
      `,
      (right) => [
        `*${right}*: a capital at the start and a comma after the greeting or closing.`,
        `*${right}*：开头大写，称呼或结束语后面加逗号。`,
      ],
      [
        ["*{wrong}* uses a period where a comma belongs.", "*{wrong}* 在该用逗号的地方用了句号。"],
        ["*{wrong}* does not start with a capital.", "*{wrong}* 开头没有大写。"],
      ],
    ),
    choose(
      "commas-in-dates",
      ["Commas in Dates", "日期中的逗号"],
      [
        "A date that has the month, the day and the year puts a **comma** between the day and the year: *May 4**,** 2026*. The month starts with a capital.",
        "包含月、日、年的日期，在日和年之间加**逗号**：*May 4**,** 2026*。月份要大写。",
      ],
      ["Which date is written the right way?", "哪个日期写对了？"],
      `
      the fourth of May, 2026|May 4, 2026|May, 4 2026|may 4, 2026
      the first of June, 2025|June 1, 2025|June, 1 2025|june 1, 2025
      the tenth of March, 2027|March 10, 2027|March, 10 2027|march 10, 2027
      the second of July, 2024|July 2, 2024|July, 2 2024|july 2, 2024
      the fifth of April, 2026|April 5, 2026|April, 5 2026|april 5, 2026
      the ninth of October, 2025|October 9, 2025|October, 9 2025|october 9, 2025
      the third of January, 2026|January 3, 2026|January, 3 2026|january 3, 2026
      the sixth of August, 2027|August 6, 2027|August, 6 2027|august 6, 2027
      the eighth of December, 2024|December 8, 2024|December, 8 2024|december 8, 2024
      the seventh of November, 2026|November 7, 2026|November, 7 2026|november 7, 2026
      the eleventh of February, 2024|February 11, 2024|February, 11 2024|february 11, 2024
      the twelfth of September, 2025|September 12, 2025|September, 12 2025|september 12, 2025
      the thirteenth of May, 2026|May 13, 2026|May, 13 2026|may 13, 2026
      the fourteenth of June, 2027|June 14, 2027|June, 14 2027|june 14, 2027
      the fifteenth of March, 2028|March 15, 2028|March, 15 2028|march 15, 2028
      the sixteenth of July, 2024|July 16, 2024|July, 16 2024|july 16, 2024
      the seventeenth of April, 2025|April 17, 2025|April, 17 2025|april 17, 2025
      the eighteenth of October, 2026|October 18, 2026|October, 18 2026|october 18, 2026
      the nineteenth of January, 2027|January 19, 2027|January, 19 2027|january 19, 2027
      the twentieth of August, 2028|August 20, 2028|August, 20 2028|august 20, 2028
      the twenty-first of December, 2024|December 21, 2024|December, 21 2024|december 21, 2024
      the twenty-second of November, 2025|November 22, 2025|November, 22 2025|november 22, 2025
      the twenty-third of February, 2026|February 23, 2026|February, 23 2026|february 23, 2026
      the twenty-fourth of September, 2027|September 24, 2027|September, 24 2027|september 24, 2027
      the twenty-fifth of May, 2028|May 25, 2028|May, 25 2028|may 25, 2028
      the twenty-sixth of June, 2024|June 26, 2024|June, 26 2024|june 26, 2024
      the twenty-seventh of March, 2025|March 27, 2025|March, 27 2025|march 27, 2025
      the twenty-eighth of July, 2026|July 28, 2026|July, 28 2026|july 28, 2026
      the twenty-ninth of April, 2027|April 29, 2027|April, 29 2027|april 29, 2027
      the thirtieth of October, 2028|October 30, 2028|October, 30 2028|october 30, 2028
      `,
      (right) => [`*${right}*: the comma goes between the day and the year.`, `*${right}*：逗号放在日和年之间。`],
      [
        ["*{wrong}* puts the comma between the month and the day.", "*{wrong}* 把逗号放在了月和日之间。"],
        ["*{wrong}* starts the month with a small letter.", "*{wrong}* 的月份没有大写。"],
      ],
    ),
  ],
});

/** grammarTopics2 are the grammar topics of grade 2. */
export const grammarTopics2: readonly TopicDef[] = [
  pastEd,
  pastIrregular,
  beVerbs,
  owning,
  comparing,
  irregularPlurals,
  contractions,
  andButOr,
  letters,
];
