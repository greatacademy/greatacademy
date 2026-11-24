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
  intro: [
    "At breakfast, you tell your friend, *Yesterday I **walked** to the park.* That little **-ed** at the end tells your friend the walk already happened. In this lesson, you will use **-ed** for the past and spell it carefully.",
    "吃早饭时，你对朋友说：*Yesterday I **walked** to the park.* 词尾那个小小的 **-ed** 告诉朋友，去公园是已经发生过的事。这节课，你会练习用 **-ed** 表示过去，并把词尾拼对。",
  ],
  after: ["joining-with-and"],
  xp: 10,
  points: [
    choose(
      "now-or-already",
      ["Now or Already", "现在还是已经"],
      [
        "An action word tells **when**. *I jump* happens now; *I jump**ed*** already happened. Clue words like *yesterday*, *last night*, and *this morning* tell you to add **-ed**.\n\n> **Watch out.** An *-ing* word like *jumping* cannot stand alone to tell the past.",
        "动作词能说明**时间**。*I jump* 是现在；*I jump**ed*** 是已经发生过的事。看到 *yesterday*、*last night*、*this morning* 这样的时间词，动作词就要加 **-ed**。\n\n> **注意。** 像 *jumping* 这样带 *-ing* 的词不能单独用来表示过去。",
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
        `*${filled(shown, right)}* — the action already happened, so the verb ends in **-ed**.\n\n**Check.** Point to the time clue at the start of *${filled(shown, right)}* (like *Yesterday* or *Last night*): it tells you the action is finished, which matches **${right}**.`,
        `*${filled(shown, right)}* —— 这件事已经发生了，所以动作词以 **-ed** 结尾。\n\n**检验。** 指一指 *${filled(shown, right)}* 开头的时间线索词（如 *Yesterday* 或 *Last night*）：它说明事情已经过去，正配 **${right}**。`,
      ],
      [
        [
          "*{wrong}* tells about right now, but the time clue says it already happened.",
          "*{wrong}* 表示现在，但时间词说明事情已经发生了。",
        ],
        [
          "*{wrong}* needs a helping word like *was*, and it does not show the past by itself.",
          "*{wrong}* 需要 *was* 这样的辅助词，不能单独表示过去。",
        ],
      ],
    ),
    choose(
      "spelling-the-ed",
      ["Spelling the -ed", "-ed 的拼写"],
      [
        "Check the end of the base word before adding *-ed*: most words just add **-ed** (*jump**ed***); a word ending in **e** adds only **-d** (*bake* → *bake**d***); a short word ending in one vowel and one consonant doubles that last letter (*hop* → *ho**pped***).\n\n> **Watch out.** Forgetting to double the last letter can turn *hopped* into *hoped*—a completely different word!",
        "加 *-ed* 前先看原词结尾：大多数词直接加 **-ed**（*jump**ed***）；以 **e** 结尾的词只加 **-d**（*bake* → *bake**d***）；以一个短元音加一个辅音结尾的短词，双写末尾字母再加 **-ed**（*hop* → *ho**pped***）。\n\n> **注意。** 忘了双写末尾字母会把 *hopped*（跳）变成 *hoped*（希望），意思全变了！",
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
      (right, shown) => {
        const ruleEn = shown.endsWith("e")
          ? `**${shown}** already ends in *e*, so just add **-d** to spell **${right}**.`
          : right.length === shown.length + 3
            ? `**${shown}** is a short word ending in one vowel and one consonant, so double the **${shown.at(-1)}** before **-ed** to spell **${right}**.`
            : `**${shown}** ends in two consonants, so just add **-ed** to spell **${right}**.`;
        const ruleZh = shown.endsWith("e")
          ? `**${shown}** 已经以 *e* 结尾，直接加 **-d** 得到 **${right}**。`
          : right.length === shown.length + 3
            ? `**${shown}** 是以单个元音加单个辅音结尾的短词，双写末尾字母 **${shown.at(-1)}** 再加 **-ed**，得到 **${right}**。`
            : `**${shown}** 末尾有两个辅音，直接加 **-ed** 得到 **${right}**。`;
        return [
          `${ruleEn}\n\n**Check.** Look at the vowel in **${right}**: ${shown.endsWith("e") ? "keeping one *e* avoids a double *ee* and keeps the vowel saying its name." : right.length === shown.length + 3 ? "the doubled consonant protects the short vowel sound." : "the two consonants at the end already protect the short vowel, so no extra letter is needed."}`,
          `${ruleZh}\n\n**检验。** 看 **${right}** 里的元音：${shown.endsWith("e") ? "只留一个 *e* 不会出现多余的 *ee*，也能保住长元音。" : right.length === shown.length + 3 ? "双写辅音能保住前面的短元音读法。" : "词尾本来就有两个辅音，能保住短元音，不需要再双写。"}`,
        ];
      },
      [
        [
          "*{wrong}* breaks the ending rule (doubling, silent *e*, or plain *-ed*) for *{shown}*.",
          "*{wrong}* 违反了 *{shown}* 词尾加 *-ed* 的拼写规则。",
        ],
        [
          "*{wrong}* leaves out the *e* or doubles a letter that should not be doubled.",
          "*{wrong}* 漏掉了 *e*，或者在不该双写的地方双写了字母。",
        ],
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
  intro: [
    "No one says, *Yesterday I **goed** to the zoo*—we say, *Yesterday I **went** to the zoo!* A group of everyday action words change shape instead of adding *-ed*. Let's practice using and spotting them.",
    "没有人会说 *Yesterday I **goed** to the zoo*，我们都说 *Yesterday I **went** to the zoo!* 有一批常用的动作词表示过去时不加 *-ed*，而是直接变形。这节课我们来练熟它们。",
  ],
  after: ["past-tense-with-ed"],
  xp: 10,
  points: [
    choose(
      "the-past-that-changes",
      ["The Past That Changes", "会变的过去式"],
      [
        "Some action words do not add *-ed* for the past—they change: *run* → **ran**, *go* → **went**, *see* → **saw**, *eat* → **ate**, *sit* → **sat**, *come* → **came**.\n\n> **Watch out.** Adding *-ed* to these words (*runned*, *eated*, *goed*) makes a word that does not exist in English.",
        "有些动作词表示过去时不加 *-ed*，而是变形：*run* → **ran**、*go* → **went**、*see* → **saw**、*eat* → **ate**、*sit* → **sat**、*come* → **came**。\n\n> **注意。** 给这些词加 *-ed*（如 *runned*、*eated*、*goed*）会拼出英语里不存在的词。",
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
        `*${filled(shown, right)}* — this verb changes its form for the past instead of adding *-ed*.\n\n**Check.** Say *${filled(shown, right)}* aloud: **${right}** sounds natural with the past time clue, while the *-ed* form sounds made up.`,
        `*${filled(shown, right)}* —— 这个动作词表示过去时要变形，不能加 *-ed*。\n\n**检验。** 大声读一遍 *${filled(shown, right)}*：**${right}** 搭配前面的过去时间词很自然，而加 *-ed* 的写法读起来生硬不对劲。`,
      ],
      [
        [
          "*{wrong}* tries to add *-ed*, but this verb changes its spelling for the past.",
          "*{wrong}* 硬加了 *-ed*，但这个词的过去式要变形。",
        ],
        ["*{wrong}* is the present form (now), not the past form.", "*{wrong}* 是现在时形式，不能用来配表示过去的时间词。"],
      ],
    ),
    choose(
      "fixing-the-past",
      ["Fixing the Past", "改正过去式"],
      [
        "When you check your own writing, look at every past action word. If you added *-ed* to a word that changes, fix it: *I **runned*** → *I **ran***.\n\n> **Watch out.** Also check that you did not leave the present form (*run*) in a sentence with *yesterday* or *last week*.",
        "检查自己写的句子时，盯住每个表示过去的动作词。如果给会变形的词加了 *-ed*，就改过来：*I **runned*** → *I **ran***。\n\n> **注意。** 还要检查有没有在带 *yesterday*、*last week* 的句子里误用原形（如 *run*）。",
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
      (right, shown) => [
        `*${right}* uses the true past form of **${shown}**.\n\n**Check.** Read *${right}* aloud and compare it to **${shown}**: it shows the past without tacking *-ed* onto **${shown}**.`,
        `*${right}* 用了 **${shown}** 正确的过去式。\n\n**检验。** 大声读一遍 *${right}*，并和原形 **${shown}** 对照：它既准确表达了过去，又没有硬加 *-ed*。`,
      ],
      [
        [
          "*{wrong}* adds *-ed* to *{shown}*, which is a verb that changes instead.",
          "*{wrong}* 给 *{shown}* 加了 *-ed*，但这个词表示过去时要变形。",
        ],
        ["*{wrong}* uses the present form *{shown}* with a past time word.", "*{wrong}* 在过去时间里用了原形 *{shown}*，时态不对。"],
      ],
    ),
  ],
});

const beVerbs = topic("grammar", {
  id: "is-are-was-were",
  title: ["Is, Are, Was and Were", "is、are、was 和 were"],
  summary: ["Use *is* and *was* for one, *are* and *were* for more than one.", "一个用 *is* 和 *was*，多个用 *are* 和 *were*。"],
  intro: [
    "Point to one puddle: *My shoe **is** wet.* Point to both: *My shoes **are** wet!* Yesterday, those same sentences used **was** and **were**. Let's match these four helper words to how many and when.",
    "指着一只湿鞋说：*My shoe **is** wet.* 指着两只湿鞋说：*My shoes **are** wet!* 要是说昨天，它们就变成 **was** 和 **were**。这节课我们来把这四个词和数量、时间配对好。",
  ],
  after: ["past-tense-with-ed"],
  xp: 10,
  points: [
    choose(
      "is-or-are",
      ["Is or Are", "is 还是 are"],
      [
        "For right now, use **is** for one person or thing (*The cat **is** wet*) and **are** for more than one (*The cats **are** wet*). Always use **are** with *you* and *we* (*We **are** ready*).\n\n> **Watch out.** Check for an *-s* at the end of the naming word—*my shoes* is more than one, so it takes *are*.",
        "表示现在时，一个人或一样东西用 **is**（*The cat **is** wet*），多个用 **are**（*The cats **are** wet*）。*you* 和 *we* 总是用 **are**（*We **are** ready*）。\n\n> **注意。** 留意名称词末尾有没有 *-s*——*my shoes* 是两只（多个），所以要用 *are*。",
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
        `*${filled(shown, right)}* — use **${right}** ${right === "is" ? "for one person or thing" : "for more than one, or with *you* or *we*"}.\n\n**Check.** Swap the subject for *${right === "is" ? "It" : "They"}* (or keep *you/we*): *${right === "is" ? "It is" : "They are"}...* sounds right aloud.`,
        `*${filled(shown, right)}* —— ${right === "is" ? "主语是一个，所以用 **is**" : "主语是多个（或是 *you*、*we*），所以用 **are**"}。\n\n**检验。** 把主语换成 *${right === "is" ? "It" : "They"}*（或保留 *you/we*）：*${right === "is" ? "It is" : "They are"}...* 读起来顺口。`,
      ],
      [["*{wrong}* does not match how many (or *you/we*) in this sentence.", "*{wrong}* 和句子里的数量（或 *you/we*）不匹配。"]],
    ),
    choose(
      "was-or-were",
      ["Was or Were", "was 还是 were"],
      [
        "For the past, *is* becomes **was** (*The cat **was** wet*, *I **was** tired*) and *are* becomes **were** (*The cats **were** wet*, *We **were** late*, *You **were** funny*).\n\n> **Watch out.** *I* takes *was*, while *you* and *we* always take *were*.",
        "表示过去时，*is* 变成 **was**（*The cat **was** wet*、*I **was** tired*），*are* 变成 **were**（*The cats **were** wet*、*We **were** late*、*You **were** funny*）。\n\n> **注意。** *I* 配 *was*，而 *you* 和 *we* 总是配 *were*。",
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
        `*${filled(shown, right)}* — use **${right}** in the past ${right === "was" ? "for one (or *I*)" : "for more than one, or with *you* or *we*"}.\n\n**Check.** Think of the present version first: *${right === "was" ? "is/am" : "are"}* turns into **${right}** in the past.`,
        `*${filled(shown, right)}* —— 表示过去时，${right === "was" ? "一个（或 *I*）用 **was**" : "多个（或 *you*、*we*）用 **were**"}。\n\n**检验。** 先想它对应的现在时：*${right === "was" ? "is/am" : "are"}* 变成过去时正好是 **${right}**。`,
      ],
      [["*{wrong}* does not match how many (or *I/you/we*) in this sentence.", "*{wrong}* 和句子里的数量（或 *I/you/we*）不匹配。"]],
    ),
  ],
});

const owning = topic("grammar", {
  id: "owning-with-apostrophe-s",
  title: ["Owning with 's", "用 's 表示所属"],
  summary: ["Add *'s* to a naming word to show who owns something: *Sam's hat*.", "在名称词后加 *'s* 表示东西属于谁：*Sam's hat*。"],
  intro: [
    "You find a red mitten on the bench and ask, *Whose mitten is this?* Maya calls out, *That is **Maya's** mitten!* That tiny mark—an apostrophe plus *s* (**'s**)—shows who owns something.",
    "你在长椅上捡到一只红手套，问：*这是谁的手套？* 米娅喊道：*That is **Maya's** mitten!* 那个小小的撇号加 *s*（**'s**），用来说明东西属于谁。",
  ],
  after: ["is-are-was-were"],
  xp: 10,
  points: [
    choose(
      "whose-is-it",
      ["Whose Is It", "是谁的"],
      [
        "To show who owns something, put **'s** on the **owner**: *the hat that Sam has* → ***Sam's** hat*; *the bone of the dog* → *the **dog's** bone*.\n\n> **Watch out.** Put *'s* on the owner, not on the thing they own (*Sam's hat*, never *Sam hat's*).",
        "要表示东西属于谁，在**拥有者**后面加 **'s**：*the hat that Sam has* → ***Sam's** hat*；*the bone of the dog* → *the **dog's** bone*。\n\n> **注意。** 把 *'s* 加在拥有者后面，不要加在东西后面（要写 *Sam's hat*，不能写 *Sam hat's*）。",
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
      (right) => [
        `**${right}** puts **'s** right on the owner.\n\n**Check.** Ask *Who owns it?* Then look at **${right}**: the apostrophe and *s* sit right after the owner's name, before the thing they own.`,
        `**${right}** 把 **'s** 加在了拥有者后面。\n\n**检验。** 问*是谁的？* 再看 **${right}**：撇号和 *s* 正好紧跟在拥有者后面、物品前面。`,
      ],
      [
        [
          "*{wrong}* leaves out the apostrophe, so it looks like more than one instead of owning.",
          "*{wrong}* 漏掉了撇号，看起来像复数而不是所属。",
        ],
        ["*{wrong}* puts *'s* on the thing instead of on the owner.", "*{wrong}* 把 *'s* 加在了东西上，应该加在拥有者上。"],
      ],
    ),
    choose(
      "owning-or-more-than-one",
      ["Owning or More Than One", "所属还是复数"],
      [
        "An *s* at the end can do two jobs. With an apostrophe, **'s** shows owning (*the cat's bowl*). Without an apostrophe, **s** means more than one (*two cats*).\n\n> **Watch out.** Never add an apostrophe just to make a word plural—write *two cats*, not *two cat's*.",
        "词尾的 *s* 有两种用法：带撇号的 **'s** 表示所属（*the cat's bowl*）；不带撇号的 **s** 表示多个（*two cats*）。\n\n> **注意。** 只表示多个时绝不要加撇号——写 *two cats*，不写 *two cat's*。",
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
      (right, shown) => {
        const owns = right.includes("'");
        return [
          `*${filled(shown, right)}* — ${owns ? "it shows owning, so it takes **'s**" : "it means more than one, so it takes plain **s** with no apostrophe"}.\n\n**Check.** Look right after the blank in *${shown}*: ${owns ? "there is a thing that belongs to it, so you need **'s**." : "there is no owned thing right after it—it just counts more than one, so leave out the apostrophe."}`,
          `*${filled(shown, right)}* —— ${owns ? "这里表示所属，所以用 **'s**" : "这里表示多个，所以直接加 **s**，不加撇号"}。\n\n**检验。** 看 *${shown}* 空格后面：${owns ? "紧跟着一样属于它的东西，所以需要 **'s**。" : "后面没有跟着属于它的东西，只是数了多个，所以不加撇号。"}`,
        ];
      },
      [["*{wrong}* is the other kind of *s* (owning vs. more than one).", "*{wrong}* 用成了另一种 *s*（把所属和复数搞混了）。"]],
    ),
  ],
});

const comparing = topic("grammar", {
  id: "adjectives-that-compare",
  title: ["Describing Words That Compare", "表示比较的描述词"],
  summary: ["Add *-er* to compare two things and *-est* to compare three or more.", "比较两样东西加 *-er*，比较三样或更多加 *-est*。"],
  intro: [
    "You line up three pencils on your desk. The green one is **longer** than the blue one, and the yellow one is the **longest** of all! Adding **-er** or **-est** lets you compare sizes, speeds, and more.",
    "你把三支铅笔排在桌上：绿色的比蓝色的**更长**（longer），黄色的则是三支里**最长**（longest）的！在描述词后加 **-er** 或 **-est**，就能比较大小、快慢和高矮。",
  ],
  after: ["is-are-was-were"],
  xp: 10,
  points: [
    choose(
      "er-or-est",
      ["-er or -est", "-er 还是 -est"],
      [
        "To compare **two** things, add **-er**: *A dog is big**ger** than a cat.* To compare **three or more**, add **-est**: *The elephant is the big**gest** of all.* Look for *than* (two) or *the … of all* (three or more).\n\n> **Watch out.** Do not use *-est* when you are only comparing two things with *than*.",
        "比较**两样**东西加 **-er**：*A dog is big**ger** than a cat.* 比较**三样或更多**加 **-est**：*The elephant is the big**gest** of all.* 留意线索词 *than*（比两个）或 *the … of all*（三个及以上）。\n\n> **注意。** 句子里有 *than* 只比较两样东西时，不要用 *-est*。",
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
      (right, shown) => {
        const superlative = right.endsWith("est");
        return [
          `*${filled(shown, right)}* — ${superlative ? "it compares three or more, so use **-est**" : "it compares two things, so use **-er**"}.\n\n**Check.** Spot the clue word in *${shown}*: ${superlative ? "*the* + a whole group points to **-est**." : "*than* compares just two things, which points to **-er**."}`,
          `*${filled(shown, right)}* —— ${superlative ? "这是三个及以上相比，所以用 **-est**" : "这是两样东西相比，所以用 **-er**"}。\n\n**检验。** 找 *${shown}* 里的线索词：${superlative ? "*the* 加上一个整体范围，对应 **-est**。" : "*than* 只比较两样东西，对应 **-er**。"}`,
        ];
      },
      [
        [
          "*{wrong}* compares the wrong number of things (two vs. three or more).",
          "*{wrong}* 比较的数量不对（把两者比较和三者及以上搞混了）。",
        ],
        ["*{wrong}* is the plain describing word—it does not compare at all.", "*{wrong}* 只是普通的描述词，没有表达比较。"],
      ],
    ),
    choose(
      "spelling-er-and-est",
      ["Spelling -er and -est", "-er 和 -est 的拼写"],
      [
        "Check the end of the base word before adding *-er* or *-est*: ending in **e** adds only *-r* or *-st* (*nice* → *nicer*); one short vowel + one consonant doubles the last letter (*big* → *bi**gg**er*); ending in **y** changes *y* to **i** (*happy* → *happ**i**er*).\n\n> **Watch out.** Do not keep *y* before *-er* or *-est* (*happyer* is wrong—change *y* to *i*).",
        "加 *-er* 或 *-est* 前先看原词结尾：以 **e** 结尾只加 *-r* 或 *-st*（*nice* → *nicer*）；一个短元音加一个辅音结尾要双写末字母（*big* → *bi**gg**er*）；以 **y** 结尾把 *y* 改成 **i**（*happy* → *happ**i**er*）。\n\n> **注意。** 不要在 *-er* 或 *-est* 前保留 *y*（*happyer* 是错的，要把 *y* 改成 *i*）。",
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
      (right, shown) => {
        const base = shown.split("+")[0]?.trim() ?? "";
        const ruleEn = base.endsWith("e")
          ? `**${base}** ends in *e*, so drop the extra *e* and spell **${right}**.`
          : base.endsWith("y")
            ? `**${base}** ends in *y*, so change *y* to *i* to spell **${right}**.`
            : `**${base}** ends in one short vowel and one consonant, so double the **${base.at(-1)}** to spell **${right}**.`;
        const ruleZh = base.endsWith("e")
          ? `**${base}** 以 *e* 结尾，不重复写 *e*，拼成 **${right}**。`
          : base.endsWith("y")
            ? `**${base}** 以 *y* 结尾，把 *y* 改成 *i* 再加词尾，拼成 **${right}**。`
            : `**${base}** 以一个短元音加一个辅音结尾，双写末字母 **${base.at(-1)}** 再加词尾，拼成 **${right}**。`;
        return [
          `${ruleEn}\n\n**Check.** Look at where the ending joins **${base}** in **${right}**: there is no double *ee*, no leftover *y*, and short-vowel words keep their doubled letter.`,
          `${ruleZh}\n\n**检验。** 看 **${right}** 词根和词尾的连接处：没有多余的 *ee*，也没有留着没改的 *y*，短元音词也保住了双写辅音。`,
        ];
      },
      [
        ["*{wrong}* skips the spelling change needed at the end of the base word.", "*{wrong}* 漏掉了原词结尾该做的拼写变化。"],
        ["*{wrong}* drops a needed letter or spells the ending wrong.", "*{wrong}* 漏写了必需的字母，或词尾拼错了。"],
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
  intro: [
    "Put on one sock, then two socks—easy, just add *s*! Now look at your feet: you have *one foot* and *two **feet***, never *two foots*. A small group of naming words change their shape for more than one.",
    "一只袜子是 *sock*，两只袜子加 *s* 变成 *socks*——很简单！可看看你的脚：一只脚是 *one foot*，两只脚是 *two **feet***，不能说 *two foots*。有一小批名称词变复数时会直接变形。",
  ],
  after: ["one-and-more-than-one"],
  xp: 10,
  points: [
    choose(
      "the-plural-that-changes",
      ["The Plural That Changes", "会变的复数"],
      [
        "A few naming words change for more than one instead of adding *s*: *man* → **men**, *woman* → **women**, *child* → **children**, *foot* → **feet**, *tooth* → **teeth**, *mouse* → **mice**, *goose* → **geese**. Some stay the same: *one sheep*, *two **sheep***.\n\n> **Watch out.** Never add an extra *s* onto a changed plural—write *children* and *feet*, never *childrens* or *feets*.",
        "有少数名称词变复数时不加 *s*，而是直接变形：*man* → **men**、*woman* → **women**、*child* → **children**、*foot* → **feet**、*tooth* → **teeth**、*mouse* → **mice**、*goose* → **geese**。还有一些单复数同形：*one sheep*、*two **sheep***。\n\n> **注意。** 变形后的复数已经表示多个，绝不要再多加一个 *s*（不能写 *childrens* 或 *feets*）。",
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
        `*${filled(shown, right)}* — **${right}** is the true plural form, with no *-s* added.\n\n**Check.** Say *${filled(shown, right)}* aloud: **${right}** already means more than one all by itself, so adding *-s* would double up the plural.`,
        `*${filled(shown, right)}* —— **${right}** 是正确的复数形式，不需要再加 *-s*。\n\n**检验。** 大声读一遍 *${filled(shown, right)}*：**${right}** 本身就表示多个，再加 *-s* 就画蛇添足了。`,
      ],
      [
        [
          "*{wrong}* tries to add *s* to the singular word, but this word changes instead (or stays the same).",
          "*{wrong}* 直接给单数加了 *s*，但这个词变复数要变形（或保持不变）。",
        ],
        ["*{wrong}* adds an extra *s* on top of a word that is already plural.", "*{wrong}* 在已经表示多个的词后面又多加了一个 *s*。"],
      ],
    ),
    choose(
      "one-or-more",
      ["One or More", "一个还是多个"],
      [
        "Look for count clues before the blank: *a*, *one*, *each*, or *that* means **one** (*a child*, *one mouse*); *two*, *three*, *both*, *all*, or *those* means **more than one** (*three children*, *two mice*).\n\n> **Watch out.** Words like *each* and *that* always go with one, while *both* and *those* always go with more than one.",
        "先看空格前面的数量线索：*a*、*one*、*each*、*that* 表示**一个**（*a child*、*one mouse*）；*two*、*three*、*both*、*all*、*those* 表示**多个**（*three children*、*two mice*）。\n\n> **注意。** *each* 和 *that* 总是配单数，*both* 和 *those* 总是配复数。",
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
      (right, shown) => {
        const plural = ["children", "mice", "feet", "teeth", "men", "geese", "women"].includes(right);
        return [
          `*${filled(shown, right)}* — the sentence talks about ${plural ? "more than one" : "just one"}, so use **${right}**.\n\n**Check.** Circle the clue word in *${shown}* (such as *a/one/each* vs. *two/both/all/those*): it matches **${right}** (${plural ? "plural" : "singular"}).`,
          `*${filled(shown, right)}* —— 句子里说的是${plural ? "多个" : "一个"}，所以用 **${right}**。\n\n**检验。** 圈出 *${shown}* 里的数量线索词（如 *a/one/each* 对应一个，*two/both/all/those* 对应多个）：和 **${right}** 完全一致。`,
        ];
      },
      [["*{wrong}* is for the other count (one vs. more than one).", "*{wrong}* 表示的是另一种数量（单复数弄反了）。"]],
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
  intro: [
    "When we talk, we often squeeze two short words into one: instead of *I am ready*, we say ***I'm** ready!* The little apostrophe mark (**'**) sits right where the squeezed-out letters used to be.",
    "说话时，我们常把两个短词挤成一个：不说 *I am ready*，而是说 ***I'm** ready!* 那个小小的撇号（**'**）正好放在被省掉的字母原来待的位置。",
  ],
  after: ["owning-with-apostrophe-s"],
  xp: 10,
  points: [
    choose(
      "two-words-into-one",
      ["Two Words into One", "两个词变一个"],
      [
        "A **contraction** squeezes two words into one and puts an **apostrophe (')** where the missing letters were: *do not* → *don**'**t* (missing *o*), *I am* → *I**'**m* (missing *a*), *it is* → *it**'**s* (missing *i*).\n\n> **Watch out.** Put the apostrophe right where the letters vanished—in *n't* words, it always replaces the *o* in *not*.",
        "**缩写形式**把两个词合在一起，并用**撇号（'）**标出省掉的字母：*do not* → *don**'**t*（省了 *o*）、*I am* → *I**'**m*（省了 *a*）、*it is* → *it**'**s*（省了 *i*）。\n\n> **注意。** 撇号一定要放在字母消失的原位置——以 *n't* 结尾的词，撇号总是代替 *not* 里的 *o*。",
      ],
      ["Which is the contraction?", "哪个是缩写形式？"],
      `
      do not|don't|do'nt|dont
      I am|I'm|I'am|Im
      it is|it's|i'ts|its
      cannot|can't|ca'nt|cant
      is not|isn't|is'nt|isnt
      we are|we're|w'ere|were
      you are|you're|yo'ure|your
      did not|didn't|did'nt|didnt
      she is|she's|sh'es|shes
      they are|they're|the'yre|theyre
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
        `*${shown}* becomes **${right}**: the apostrophe stands in for the dropped letter(s).\n\n**Check.** Put the missing letter(s) back where the apostrophe sits in **${right}**: you get *${shown}* again, so the apostrophe is in the right spot.`,
        `*${shown}* 缩写成 **${right}**：撇号代替了被省掉的字母。\n\n**检验。** 把省掉的字母填回 **${right}** 撇号所在的位置，正好还原成 *${shown}*，说明撇号放对了地方。`,
      ],
      [
        [
          "*{wrong}* puts the apostrophe in the wrong spot (not where the letters were dropped).",
          "*{wrong}* 把撇号放错了位置，没有放在省掉字母的地方。",
        ],
        [
          "*{wrong}* leaves out the apostrophe completely, turning it into another word or a misspelling.",
          "*{wrong}* 完全漏掉了撇号，变成了别的词或错拼。",
        ],
      ],
    ),
    choose(
      "what-the-contraction-means",
      ["What the Contraction Means", "缩写形式的意思"],
      [
        "To unpack a contraction, put the missing letters back: *We **can't** go* means *We **cannot** go*; *I'll* means *I will*; *won't* means *will not*.\n\n> **Watch out.** Check the time word too: *isn't* means *is not* (now), while *wasn't* means *was not* (past).",
        "要看懂缩写形式，就把省掉的字母补回去：*We **can't** go* 就是 *We **cannot** go*；*I'll* 是 *I will*；*won't* 是 *will not*。\n\n> **注意。** 还要看清时态：*isn't* 是 *is not*（现在），*wasn't* 是 *was not*（过去）。",
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
      (right, shown) => {
        const expanded = shown.replace(/\*\*[^*]+\*\*/u, right);
        return [
          `The contraction stands for **${right}**.\n\n**Check.** Put **${right}** back into the sentence and read it aloud: *${expanded}* — it keeps the exact same meaning and time.`,
          `这个缩写形式代表 **${right}**。\n\n**检验。** 把 **${right}** 代回原句大声读一遍：*${expanded}* —— 意思和时态完全一致。`,
        ];
      },
      [
        ["*{wrong}* changes the time or picks the wrong helper word for this contraction.", "*{wrong}* 改变了时态，或选错了对应的助词。"],
        ["*{wrong}* does not shrink into the bold contraction shown in the sentence.", "*{wrong}* 缩写后并不能变成句子里粗体的那个词。"],
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
  intro: [
    "Three little glue words do very different jobs: *I drew a cat, **and** I colored it* (adds more), *It was sunny, **but** it felt chilly* (a surprise), *Do you want red, **or** do you want blue?* (a choice). Let's pick the right glue word and put the comma in the right spot.",
    "三个小小的连接词各有分工：*I drew a cat, **and** I colored it*（补充更多），*It was sunny, **but** it felt chilly*（转折意外），*Do you want red, **or** do you want blue?*（二选一）。这节课我们来选对连接词，并把逗号放对位置。",
  ],
  after: ["past-tense-with-ed"],
  xp: 10,
  points: [
    choose(
      "the-joining-word",
      ["The Joining Word", "连接词"],
      [
        "Choose the joining word by how the two ideas connect: **and** adds more (*I ran, **and** I jumped*); **but** shows a difference or surprise (*I ran, **but** I was slow*); **or** gives a choice (*We can walk, **or** we can ride*).\n\n> **Watch out.** Read both halves before choosing—a surprise or contrast needs *but*, not *and*.",
        "根据前后两句的关系选连接词：**and** 表示补充（*I ran, **and** I jumped*）；**but** 表示不同或意外（*I ran, **but** I was slow*）；**or** 表示选择（*We can walk, **or** we can ride*）。\n\n> **注意。** 选之前先读完前后两半句——如果前后相反或出人意料，要用 *but* 而不是 *and*。",
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
      (right, shown) => [
        `*${filled(shown, right)}* — **${right}** fits because the second half ${right === "and" ? "adds one more idea" : right === "but" ? "shows a contrast or surprise" : "offers a choice"}.\n\n**Check.** Ask what the two halves do together: ${right === "and" ? "both happen together (add → **and**)." : right === "but" ? "the second part pushes against the first (contrast → **but**)." : "you pick one of the two (choice → **or**)."}`,
        `*${filled(shown, right)}* —— 用 **${right}**，因为后半句${right === "and" ? "补充了一件事" : right === "but" ? "表示转折或意外" : "提供了另一个选择"}。\n\n**检验。** 想想前后两半句的关系：${right === "and" ? "两件事顺着发生（补充 → **and**）。" : right === "but" ? "后半句和前半句相反或出人意料（转折 → **but**）。" : "在两件事里选一个（选择 → **or**）。"}`,
      ],
      [
        [
          "Put *{wrong}* in the sentence—it signals a different link (adding vs. contrast vs. choice).",
          "把 *{wrong}* 放进去读一读，它表达的是另一种逻辑关系（补充、转折或选择）。",
        ],
        ["*{wrong}* does not match how the two halves relate to each other.", "*{wrong}* 和前后两半句之间的关系对不上。"],
      ],
    ),
    choose(
      "the-comma-before-the-joining-word",
      ["The Comma Before the Joining Word", "连接词前的逗号"],
      [
        "When *and*, *but*, or *or* joins two whole sentences, put a **comma** right **before** the joining word: *I was hungry**,** and I ate.*\n\n> **Watch out.** Never join two whole sentences with only a comma—and never put the comma *after* the joining word.",
        "用 *and*、*but* 或 *or* 连接两个完整句子时，在连接词**前面**加一个**逗号**：*I was hungry**,** and I ate.*\n\n> **注意。** 不要只用逗号硬连两个完整句子，也不要把逗号放到连接词*后面*。",
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
      (right) => [
        `*${right}* puts the comma right before the joining word.\n\n**Check.** Find the joining word (*and*, *but*, or *or*) in *${right}*: the comma sits directly to its left, with a complete sentence on each side.`,
        `*${right}* 把逗号放在了连接词的正前面。\n\n**检验。** 找到 *${right}* 里的连接词（*and*、*but* 或 *or*）：逗号紧贴在它左边，而且逗号左右两边各自都是完整的句子。`,
      ],
      [
        [
          "*{wrong}* tries to glue two whole sentences with only a comma—it is missing the joining word.",
          "*{wrong}* 只用逗号硬连两个完整句子，漏掉了连接词。",
        ],
        ["*{wrong}* puts the comma *after* the joining word instead of before it.", "*{wrong}* 把逗号放到了连接词*后面*，应该放在前面。"],
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
  intro: [
    "When you write a postcard to your grandma, commas show where to pause at the top and bottom: *May 4, 2026*, *Dear Nana,*, and *Love, Leo*. Let's place every comma and capital in the right spot.",
    "给外婆写明信片时，逗号标出了开头和结尾的停顿：*May 4, 2026*、*Dear Nana,*、*Love, Leo*。这节课我们来把书信里的逗号和大写都写对。",
  ],
  after: ["and-but-and-or"],
  xp: 10,
  points: [
    choose(
      "greeting-and-closing",
      ["Greeting and Closing", "称呼和结束语"],
      [
        "A letter begins with a **greeting** (*Dear Gran**,***) and ends with a **closing** (*Love**,*** *Sam*). Start the first word with a capital letter and put a **comma** after the greeting or closing.\n\n> **Watch out.** Use a comma—never a period—after *Dear Gran* or *Love*.",
        "书信以**称呼**（*Dear Gran**,***）开头，以**结束语**（*Love**,*** *Sam*）结尾。第一个词要大写，称呼或结束语后面用**逗号**。\n\n> **注意。** 在 *Dear Gran* 或 *Love* 后面要用逗号，不要用句号。",
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
        `*${right}* starts with a capital letter and uses a comma right after the greeting or closing.\n\n**Check.** Do a two-point check on *${right}*: (1) the first letter (**${right[0]}**) is capital, and (2) the mark after the greeting or closing is a comma (**,**), not a period.`,
        `*${right}* 开头大写，且在称呼或结束语后面用了逗号。\n\n**检验。** 对 *${right}* 做两步检查：（1）第一个字母（**${right[0]}**）是大写；（2）称呼或结束语后面是逗号（**,**），不是句号。`,
      ],
      [
        ["*{wrong}* uses a period instead of a comma.", "*{wrong}* 在该用逗号的地方用了句号。"],
        ["*{wrong}* starts with a small letter instead of a capital.", "*{wrong}* 开头漏掉了大写。"],
      ],
    ),
    choose(
      "commas-in-dates",
      ["Commas in Dates", "日期中的逗号"],
      [
        "In a full date (month, day, year), capitalize the month and put a **comma** between the **day** and the **year**: *May 4**,** 2026*.\n\n> **Watch out.** Do not put the comma between the month and the day—it separates the two numbers.",
        "写完整日期（月、日、年）时，月份首字母大写，在**日**和**年**之间加**逗号**：*May 4**,** 2026*。\n\n> **注意。** 不要把逗号放在月和日之间——逗号是用来隔开日和年这两个数字的。",
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
      (right) => [
        `**${right}** capitalizes the month and puts the comma between the day and the year.\n\n**Check.** Find the two numbers in **${right}**: the comma sits right between them so they do not run together, and the month starts with a capital **${right[0]}**.`,
        `**${right}** 的月份首字母大写，逗号放在了日和年之间。\n\n**检验。** 找 **${right}** 里的两个数字：逗号正好把日和年隔开，且月份首字母 **${right[0]}** 是大写。`,
      ],
      [
        [
          "*{wrong}* puts the comma between the month and the day instead of between the two numbers.",
          "*{wrong}* 把逗号放在了月和日之间，应该放在日和年两个数字之间。",
        ],
        [
          "*{wrong}* starts the month with a small letter, but month names are always capitalized.",
          "*{wrong}* 的月份用了小写，但月份名总是要大写的。",
        ],
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
