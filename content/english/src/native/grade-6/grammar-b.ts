// Grade 6: grammar of verbs, possessives, spelling, colons, agreement with either and neither, good and well, and
// capitals in titles.

import type { TopicDef } from "@ga/content";
import { choose, type Label, label, topic } from "./kit.ts";

const participles = topic("grammar", {
  id: "irregular-past-participles",
  title: ["Irregular Past Participles", "不规则过去分词"],
  summary: [
    "Irregular verbs have a past participle of their own after has, have and had: has gone, had written, have swum.",
    "不规则动词在 has、have 和 had 后面有自己的过去分词形式：has gone、had written、have swum。",
  ],
  after: ["perfect-verb-tenses"],
  points: [
    choose(
      "participle-after-have",
      ["The Participle After Have", "have 之后的过去分词"],
      [
        "The perfect tenses join *has*, *have* or *had* to the **past participle**. Regular verbs use the *-ed* form for both the past and the participle, but many common verbs are irregular and have a separate participle: *go, went, gone*; *write, wrote, written*; *swim, swam, swum*. After *has*, *have* or *had*, use the third form, never the simple past.",
        "完成时由 *has*、*have* 或 *had* 加**过去分词**构成。规则动词的过去式和过去分词都用 *-ed* 形式，但许多常用动词是不规则的，有单独的过去分词：*go, went, gone*；*write, wrote, written*；*swim, swam, swum*。在 *has*、*have* 或 *had* 后面要用第三种形式，绝不用一般过去式。",
      ],
      ["Which form completes the sentence?", "哪种形式能补全句子？"],
      `
        She has ___ to the library. (go)|gone|went|goed
        I have ___ three letters this week. (write)|written|wrote|writed
        We had ___ across the lake before lunch. (swim)|swum|swam|swimmed
        The bell has already ___. (ring)|rung|rang|ringed
        He had ___ the whole pizza. (eat)|eaten|ate|eated
        Have you ever ___ a horse? (ride)|ridden|rode|rided
        The pond has ___ solid. (freeze)|frozen|froze|freezed
        Someone had ___ my lunch. (steal)|stolen|stole|stealed
        She has ___ a new name for the cat. (choose)|chosen|chose|choosed
        The baby has ___ asleep. (fall)|fallen|fell|falled
        I have ___ that film twice. (see)|seen|saw|seed
        She had ___ the vase by accident. (break)|broken|broke|breaked
        The wind has ___ all night. (blow)|blown|blew|blowed
        We have ___ our homework. (do)|done|did|doed
        He had ___ a cold drink. (drink)|drunk|drank|drinked
        The river has ___ over its banks. (rise)|risen|rose|rised
        Have you ___ my keys anywhere? (see)|seen|saw|seened
        The kite has ___ into the tree. (fly)|flown|flew|flied
        She had ___ the answer before the teacher asked. (know)|known|knew|knowed
        They have ___ the bus to school. (take)|taken|took|taked
        The ship had ___ before help came. (sink)|sunk|sank|sinked
        I have ___ my old shoes. (wear)|worn|wore|weared
        The choir has ___ at three concerts. (sing)|sung|sang|singed
        He has ___ the ball over the fence. (throw)|thrown|threw|throwed
        We had ___ to bed early. (go)|gone|went|wented
        He has ___ to the principal. (speak)|spoken|spoke|speaked
        She has ___ a picture of the sea. (draw)|drawn|drew|drawed
        They had ___ their lunches at home. (forget)|forgotten|forgot|forgetted
        The tree has ___ tall. (grow)|grown|grew|growed
        I have ___ my bike to school. (ride)|ridden|rode|ridded
      `,
      (right, shown) => [
        `${shown.replace("___", `**${right}**`).replace(/ \([a-z]+\)$/, "")} After *has*, *have* or *had*, an irregular verb takes its past participle, **${right}**.`,
        `${shown.replace("___", `**${right}**`).replace(/ \([a-z]+\)$/, "")} 在 *has*、*have* 或 *had* 后面，不规则动词用过去分词 **${right}**。`,
      ],
      [
        [
          "*{wrong}* is the simple past, which never follows *has*, *have* or *had*.",
          "*{wrong}* 是一般过去式，不能跟在 *has*、*have* 或 *had* 后面。",
        ],
        ["*{wrong}* is not a real form of this irregular verb.", "*{wrong}* 不是这个不规则动词的真实形式。"],
      ],
    ),
    choose(
      "past-or-participle",
      ["Simple Past or Participle", "一般过去式还是过去分词"],
      [
        "The **simple past** stands alone: *Yesterday I swam.* The **past participle** needs a helping verb: *I have swum*, *it was broken*. So when there is no *has*, *have*, *had*, *is*, *was* or *were* before the gap, use the simple past; when there is, use the participle. Saying *I seen it* or *she has went* mixes the two.",
        "**一般过去式**单独使用：*Yesterday I swam.* **过去分词**需要助动词：*I have swum*、*it was broken*。所以空格前没有 *has*、*have*、*had*、*is*、*was* 或 *were* 时，用一般过去式；有的话，用过去分词。说 *I seen it* 或 *she has went* 就是把两者混淆了。",
      ],
      ["Which form completes the sentence?", "哪种形式能补全句子？"],
      `
        Yesterday we ___ in the lake. (swim)|swam|swum|swimmed
        The window was ___ by a ball. (break)|broken|broke|breaked
        Last week I ___ a letter to my aunt. (write)|wrote|written|writed
        The cookies were ___ before dinner. (eat)|eaten|ate|eated
        She ___ the bell at noon. (ring)|rang|rung|ringed
        The song was ___ by the whole school. (sing)|sung|sang|singed
        I ___ the answer right away. (know)|knew|known|knowed
        The vase was ___ from the shelf. (steal)|stolen|stole|stealed
        We ___ home after the game. (go)|went|gone|goed
        The key was ___ under the mat. (hide)|hidden|hid|hided
        He ___ a glass of milk. (drink)|drank|drunk|drinked
        The letter was ___ in red ink. (write)|written|wrote|writed
        The plane ___ over the mountains. (fly)|flew|flown|flied
        The lake was ___ all winter. (freeze)|frozen|froze|freezed
        My brother ___ a new bike. (choose)|chose|chosen|choosed
        The bag was ___ on the bus. (forget)|forgotten|forgot|forgetted
        I ___ a deer in the woods. (see)|saw|seen|seed
        The ball was ___ over the wall. (throw)|thrown|threw|throwed
        She ___ asleep during the film. (fall)|fell|fallen|falled
        The secret was ___ to everyone. (know)|known|knew|knowed
        We ___ our bikes to the park. (ride)|rode|ridden|rided
        The tree was ___ down by the wind. (blow)|blown|blew|blowed
        He ___ a map of the island. (draw)|drew|drawn|drawed
        The picture was ___ by a famous artist. (draw)|drawn|drew|drawed
        The sun ___ at six this morning. (rise)|rose|risen|rised
        The tomatoes were ___ in our garden. (grow)|grown|grew|growed
        They ___ the bus to the city. (take)|took|taken|taked
        The coat was ___ until it had holes. (wear)|worn|wore|weared
        The ship ___ in the storm. (sink)|sank|sunk|sinked
        The work was ___ by noon. (do)|done|did|doed
      `,
      (right, shown) => [
        `${shown.replace("___", `**${right}**`).replace(/ \([a-z]+\)$/, "")} Check for a helping verb before the gap: with one, use the participle; without one, the simple past.`,
        `${shown.replace("___", `**${right}**`).replace(/ \([a-z]+\)$/, "")} 看空格前有没有助动词：有就用过去分词，没有就用一般过去式。`,
      ],
      [
        [
          "*{wrong}* is the other form of the verb: the helping verb, or its absence, calls for **{right}**.",
          "*{wrong}* 是这个动词的另一种形式：有没有助动词决定了要用 **{right}**。",
        ],
        ["*{wrong}* is not a real form of this irregular verb.", "*{wrong}* 不是这个不规则动词的真实形式。"],
      ],
    ),
  ],
});

const possessives = topic("grammar", {
  id: "possessives-of-plural-and-compound-nouns",
  title: ["Possessives of Plural and Compound Nouns", "复数名词和复合名词的所有格"],
  summary: [
    "A plural ending in s takes only an apostrophe (the girls' room); other plurals take 's (the children's toys); a compound adds 's at its end.",
    "以 s 结尾的复数只加撇号（the girls' room）；其他复数加 's（the children's toys）；复合名词在末尾加 's。",
  ],
  after: ["plural-nouns"],
  points: [
    choose(
      "plural-possessives",
      ["Possessives of Plurals", "复数名词的所有格"],
      [
        "First write the plural, then show belonging. If the plural ends in **s**, add only an apostrophe: *the dogs' bowls*, *the Smiths' car*. If the plural does not end in *s*, add **'s**: *the children's games*, *the women's team*, *the mice's nest*. Never add *'s* to a plural that already ends in *s*.",
        "先写出复数，再表示所属。如果复数以 **s** 结尾，只加撇号：*the dogs' bowls*、*the Smiths' car*。如果复数不以 *s* 结尾，加 **'s**：*the children's games*、*the women's team*、*the mice's nest*。已经以 *s* 结尾的复数绝不再加 *'s*。",
      ],
      ["Which possessive completes the sentence?", "哪个所有格能补全句子？"],
      `
        All the ___ lockers are painted blue. (students)|students'|student's|students's
        The ___ playground has new swings. (children)|children's|childrens'|childs'
        The two ___ tails were wagging. (dogs)|dogs'|dog's|dogs's
        The ___ locker room is down the hall. (women)|women's|womens'|womans'
        Both ___ nests were in the oak tree. (birds)|birds'|bird's|birds's
        The ___ tracks led into the snow. (mice)|mice's|mices'|mouses'
        The ___ new house has a big yard. (Garcias)|Garcias'|Garcia's|Garcias's
        The ___ boots were muddy. (men)|men's|mens'|mans'
        All the ___ uniforms were washed. (players)|players'|player's|players's
        The ___ wool is thick in winter. (sheep)|sheep's|sheeps'|sheeps's
        The ___ desks were in rows. (teachers)|teachers'|teacher's|teachers's
        The ___ teeth were checked by the dentist. (people)|people's|peoples'|persons'
        Our ___ bedroom is upstairs. (parents)|parents'|parent's|parents's
        The ___ honking woke us up. (geese)|geese's|geeses'|gooses'
        The ___ bikes were lined up outside. (girls)|girls'|girl's|girls's
        The ___ shell was cracked. (turtles)|turtles'|turtle's|turtles's
        The ___ choir sang first. (men)|men's|mens'|mens's
        The ___ voices filled the hall. (singers)|singers'|singer's|singers's
        The ___ kites flew high. (boys)|boys'|boy's|boys's
        The ___ antlers were huge. (deer)|deer's|deers'|deers's
        The ___ cabins were near the lake. (campers)|campers'|camper's|campers's
        The ___ books are on the bottom shelf. (children)|children's|childrens'|childrens's
        The ___ porch light was on. (Joneses)|Joneses'|Jones's|Joneses's
        The ___ fur was soft. (kittens)|kittens'|kitten's|kittens's
        The ___ shoes were by the door. (guests)|guests'|guest's|guests's
        The ___ footprints were tiny. (mice)|mice's|mices'|mices's
        The ___ wings were blue and orange. (butterflies)|butterflies'|butterfly's|butterflies's
        The ___ union met on Monday. (workers)|workers'|worker's|workers's
        The ___ coats hung in the hall. (women)|women's|womens'|womens's
        The ___ lunches were in the fridge. (twins)|twins'|twin's|twins's
      `,
      (right) => [
        `**${right}** Form the plural first, then add an apostrophe after an *s*, or *'s* when the plural has no final *s*.`,
        `**${right}** 先构成复数，再在 *s* 后加撇号；复数不以 *s* 结尾时加 *'s*。`,
      ],
      [
        [
          "*{wrong}* shows one owner or misplaces the apostrophe in the plural.",
          "*{wrong}* 表示的是一个所有者，或者把复数的撇号放错了位置。",
        ],
        [
          "*{wrong}* adds extra letters; a plural ending in *s* takes only an apostrophe.",
          "*{wrong}* 多加了字母；以 *s* 结尾的复数只加撇号。",
        ],
      ],
    ),
    choose(
      "compound-and-joint-possessives",
      ["Compound and Joint Possessives", "复合名词与共同所有"],
      [
        "A **compound noun** shows belonging at its end: *my sister-in-law's car*, *the editor in chief's desk*. When two people own **one thing together**, only the last name takes *'s*: *Ana and Ben's house* (one house). When each owns **a separate thing**, both take *'s*: *Ana's and Ben's bikes* (two bikes).",
        "**复合名词**在末尾表示所属：*my sister-in-law's car*、*the editor in chief's desk*。两个人**共同拥有一件东西**时，只有后一个名字加 *'s*：*Ana and Ben's house*（一所房子）。各自拥有**不同的东西**时，两个名字都加 *'s*：*Ana's and Ben's bikes*（两辆自行车）。",
      ],
      ["Which possessive is correct?", "哪个所有格正确？"],
      `
        the car that belongs to my brother-in-law|my brother-in-law's car|my brother's-in-law car|my brothers-in-law car
        one shop owned by Mia and Leo together|Mia and Leo's shop|Mia's and Leo's shop|Mia and Leos' shop
        two separate bikes, one of Kim and one of Raj|Kim's and Raj's bikes|Kim and Raj's bikes|Kims' and Rajs' bikes
        the office of the editor in chief|the editor in chief's office|the editor's in chief office|the editors in chief office
        one farm run together by my aunt and uncle|my aunt and uncle's farm|my aunt's and uncle's farm|my aunts and uncles farm
        two separate reports, one by Sara and one by Tom|Sara's and Tom's reports|Sara and Tom's reports|Saras' and Toms' reports
        the advice of my mother-in-law|my mother-in-law's advice|my mother's-in-law advice|my mothers-in-law advice
        one dog shared by Jin and Omar|Jin and Omar's dog|Jin's and Omar's dog|Jin and Omars' dog
        the speech of the attorney general|the attorney general's speech|the attorney's general speech|the attorneys general speech
        two separate cakes, one by Grandma and one by Mom|Grandma's and Mom's cakes|Grandma and Mom's cakes|Grandmas' and Moms' cakes
        one project made by Lucy and Zoe together|Lucy and Zoe's project|Lucy's and Zoe's project|Lucy and Zoes' project
        the room of my father-in-law|my father-in-law's room|my father's-in-law room|my fathers-in-law room
        two separate rooms, Ella's and Nina's|Ella's and Nina's rooms|Ella and Nina's rooms|Ellas' and Ninas' rooms
        one band started by Max and Eli together|Max and Eli's band|Max's and Eli's band|Max and Elis' band
        the plan of the commander in chief|the commander in chief's plan|the commander's in chief plan|the commanders in chief plan
        one garden kept by Mr. and Mrs. Wu together|Mr. and Mrs. Wu's garden|Mr.'s and Mrs. Wu's garden|Mr. and Mrs. Wus' garden
        two separate phones, Dad's and Ravi's|Dad's and Ravi's phones|Dad and Ravi's phones|Dads' and Ravis' phones
        the birthday of my sister-in-law|my sister-in-law's birthday|my sister's-in-law birthday|my sisters-in-law birthday
        one store owned by Lee and Park together|Lee and Park's store|Lee's and Park's store|Lee and Parks' store
        two separate poems, one by Ana and one by Rosa|Ana's and Rosa's poems|Ana and Rosa's poems|Anas' and Rosas' poems
        the desk of the secretary of state|the secretary of state's desk|the secretary's of state desk|the secretaries of state desk
        one boat bought by Tom and Ben together|Tom and Ben's boat|Tom's and Ben's boat|Tom and Bens' boat
        the coat of the passer-by|the passer-by's coat|the passer's-by coat|the passers-by coat
        two separate dogs, Maya's and Kai's|Maya's and Kai's dogs|Maya and Kai's dogs|Mayas' and Kais' dogs
        one song written by Luis and Ivy together|Luis and Ivy's song|Luis's and Ivy's song|Luis and Ivys' song
        the opinion of the runner-up|the runner-up's opinion|the runner's-up opinion|the runners-up opinion
        two separate grades, Sam's and Lily's|Sam's and Lily's grades|Sam and Lily's grades|Sams' and Lilys' grades
        one house shared by my grandma and grandpa|my grandma and grandpa's house|my grandma's and grandpa's house|my grandmas and grandpas house
        the wedding of my brother-in-law|my brother-in-law's wedding|my brother's-in-law wedding|my brothers-in-law wedding
        two separate jackets, Noah's and Finn's|Noah's and Finn's jackets|Noah and Finn's jackets|Noahs' and Finns' jackets
      `,
      (right, shown) => [
        `**${right}** names ${shown}: a compound adds *'s* at its end, joint owners share one *'s*, and separate owners each take one.`,
        `**${right}** 表示 ${shown}：复合名词在末尾加 *'s*，共同所有者共用一个 *'s*，各自所有者各加一个。`,
      ],
      [
        [
          "*{wrong}* puts the *'s* in the wrong place: it shows the wrong owners or splits the compound.",
          "*{wrong}* 把 *'s* 放错了位置：它表示了错误的所有者，或者把复合名词拆开了。",
        ],
        ["*{wrong}* turns the names into plurals instead of showing who owns what.", "*{wrong}* 把名字变成了复数，而没有表示谁拥有什么。"],
      ],
    ),
  ],
});

const doubling = topic("grammar", {
  id: "spelling-doubling-final-consonants",
  title: ["Doubling Final Consonants", "双写末尾辅音字母"],
  summary: [
    "Double the last consonant before -ed, -ing, -er or -est when a short vowel comes before it in a stressed syllable: hop, hopping; begin, beginning.",
    "当重读音节中末尾辅音字母前是短元音时，加 -ed、-ing、-er 或 -est 前要双写该辅音：hop, hopping；begin, beginning。",
  ],
  after: ["common-suffixes"],
  points: [
    choose(
      "doubling-in-short-words",
      ["Doubling in Short Words", "短词中的双写"],
      [
        "In a one-syllable word that ends in **one vowel and one consonant**, double the consonant before a suffix that starts with a vowel: *hop, hopping, hopped*; *big, bigger*; *run, runner*. Do not double when the word ends in two consonants (*jump, jumping*), has two vowels (*rain, rained*), or ends in *w*, *x* or *y* (*snow, snowing*; *fix, fixed*).",
        "一个音节的词如果以**一个元音字母加一个辅音字母**结尾，在加以元音开头的后缀前要双写这个辅音：*hop, hopping, hopped*；*big, bigger*；*run, runner*。如果词以两个辅音结尾（*jump, jumping*）、有两个元音（*rain, rained*），或以 *w*、*x*、*y* 结尾（*snow, snowing*；*fix, fixed*），就不双写。",
      ],
      ["Which spelling is correct?", "哪个拼写正确？"],
      `
        stop + ed|stopped|stoped|stopt
        run + ing|running|runing|runnning
        big + er|bigger|biger|biggar
        jump + ing|jumping|jumpping|jumpin
        rain + ed|rained|rainned|raind
        hot + est|hottest|hotest|hotist
        swim + er|swimmer|swimer|swimmor
        snow + ing|snowing|snowwing|snoing
        fix + ed|fixed|fixxed|fixd
        plan + ed|planned|planed|plannd
        sit + ing|sitting|siting|sittin
        sad + ly|sadly|saddly|sadley
        clap + ed|clapped|claped|clapt
        dream + ing|dreaming|dreamming|dreamin
        thin + er|thinner|thiner|thinnar
        play + ed|played|playyed|plaid
        shop + ing|shopping|shoping|shopin
        help + er|helper|helpper|helpor
        drop + ed|dropped|droped|dropt
        wet + est|wettest|wetest|wettist
        cook + ing|cooking|cookking|cookin
        dig + ing|digging|diging|diggin
        mix + ing|mixing|mixxing|mixin
        hug + ed|hugged|huged|hugd
        fit + ness|fitness|fittness|fitniss
        win + er|winner|winer|winnar
        rob + ed|robbed|robed|robbd
        float + ed|floated|floatted|floatd
        grab + ing|grabbing|grabing|grabbin
        mad + est|maddest|madest|maddist
      `,
      (right, shown) => [
        `${shown} makes **${right}**: double the last consonant only after one short vowel, and only before a suffix that starts with a vowel.`,
        `${shown} 构成 **${right}**：只有在一个短元音之后、并且后缀以元音开头时，才双写末尾辅音。`,
      ],
      [
        [
          "*{wrong}* gets the doubling rule wrong: it doubles where it should not, or misses a double it needs.",
          "*{wrong}* 用错了双写规则：在不该双写时双写了，或者该双写时没有双写。",
        ],
        ["*{wrong}* misspells the suffix itself.", "*{wrong}* 把后缀本身拼错了。"],
      ],
    ),
    choose(
      "doubling-in-longer-words",
      ["Doubling in Longer Words", "多音节词中的双写"],
      [
        "In a word of two or more syllables that ends in one vowel and one consonant, double the consonant only if the **last syllable is stressed**: *be-GIN, beginning*; *pre-FER, preferred*; *for-GET, forgetting*. If the stress falls earlier, do not double: *O-pen, opened*; *VIS-it, visiting*; *LIS-ten, listener*.",
        "在两个或更多音节、以一个元音加一个辅音结尾的词中，只有**最后一个音节重读**时才双写辅音：*be-GIN, beginning*；*pre-FER, preferred*；*for-GET, forgetting*。如果重音在前面，就不双写：*O-pen, opened*；*VIS-it, visiting*；*LIS-ten, listener*。",
      ],
      ["Which spelling is correct?", "哪个拼写正确？"],
      `
        begin + ing|beginning|begining|beginnig
        open + ed|opened|openned|opend
        prefer + ed|preferred|prefered|preferd
        visit + ing|visiting|visitting|visitin
        forget + ing|forgetting|forgeting|forgettin
        listen + er|listener|listenner|listenor
        admit + ed|admitted|admited|admittd
        happen + ing|happening|happenning|happenin
        control + ed|controlled|controled|controld
        forbid + en|forbidden|forbiden|forbiddn
        permit + ing|permitting|permiting|permittin
        limit + ed|limited|limitted|limitd
        occur + ed|occurred|occured|occurd
        garden + er|gardener|gardenner|gardenor
        refer + ing|referring|refering|referrin
        enter + ed|entered|enterred|enterd
        commit + ed|committed|commited|committd
        offer + ing|offering|offerring|offerin
        regret + ed|regretted|regreted|regrettd
        budget + ed|budgeted|budgetted|budgetd
        upset + ing|upsetting|upseting|upsettin
        rebel + ing|rebelling|rebeling|rebellin
        submit + ing|submitting|submiting|submittin
        wonder + ed|wondered|wonderred|wonderd
        omit + ed|omitted|omited|omittd
        profit + ing|profiting|profitting|profitin
        equip + ed|equipped|equiped|equippd
        target + ed|targeted|targetted|targetd
        compel + ing|compelling|compeling|compellin
        gallop + ing|galloping|gallopping|gallopin
      `,
      (right, shown) => [
        `${shown} makes **${right}**: double only when the stress falls on the last syllable of the base word.`,
        `${shown} 构成 **${right}**：只有重音落在基础词最后一个音节上时才双写。`,
      ],
      [
        ["*{wrong}* gets the doubling wrong for where the stress falls in this word.", "*{wrong}* 没有按照这个词的重音位置正确处理双写。"],
        ["*{wrong}* misspells the suffix or drops a letter of it.", "*{wrong}* 拼错了后缀或漏掉了后缀的字母。"],
      ],
    ),
  ],
});

const colonLabels: Readonly<Record<string, Label>> = {
  "a list": {
    zh: "引出列举",
    why: ["A complete sentence comes before the colon, and a list follows it.", "冒号前是完整的句子，冒号后是列举。"],
    not: ["What follows the colon is not a list of items.", "冒号后面的内容不是一组列举项。"],
  },
  "an explanation": {
    zh: "引出解释",
    why: [
      "A complete sentence comes before the colon, and what follows explains or sums it up.",
      "冒号前是完整的句子，冒号后的内容对它进行解释或概括。",
    ],
    not: ["What follows the colon is not an explanation of the sentence before it.", "冒号后面的内容不是对前面句子的解释。"],
  },
  "no colon": {
    zh: "不该用冒号",
    why: [
      "The words before the colon are not a complete sentence: a colon never comes right after a verb or a preposition.",
      "冒号前的词不是完整的句子：冒号绝不能紧跟在动词或介词后面。",
    ],
    not: ["A complete sentence comes before this colon, so the colon is correct.", "这个冒号前是一个完整的句子，所以冒号用得对。"],
  },
};

const colons = topic("grammar", {
  id: "colons-before-lists-and-explanations",
  title: ["Colons Before Lists and Explanations", "列举和解释前的冒号"],
  summary: [
    "A colon follows a complete sentence and introduces a list or an explanation; it never comes right after a verb or a preposition.",
    "冒号跟在完整的句子后面，引出列举或解释；它绝不能紧跟在动词或介词后面。",
  ],
  after: ["commas-in-a-series"],
  points: [
    label(
      "what-the-colon-does",
      ["What the Colon Does", "冒号的作用"],
      [
        "A **colon** (:) says *here it comes*. It follows a **complete sentence** and introduces either **a list** (*Bring three things: a hat, water and a map.*) or **an explanation** (*We stayed inside for one reason: it was pouring.*). Use **no colon** after a verb or a preposition, where the sentence is not yet complete: *We need ~~:~~ eggs and milk.*",
        "**冒号**（:）的意思是“下面就来了”。它跟在**完整的句子**后面，引出**列举**（*Bring three things: a hat, water and a map.*）或**解释**（*We stayed inside for one reason: it was pouring.*）。在动词或介词后面，句子还不完整，**不该用冒号**：*We need eggs and milk.*",
      ],
      ["What does the colon do in this sentence?", "这个句子中的冒号起什么作用？"],
      `
        You will need three tools: a hammer, nails and a saw.|a list
        I knew why the dog was barking: someone was at the door.|an explanation
        My favorite foods are: pizza, tacos and soup.|no colon
        The recipe calls for four things: flour, eggs, milk and sugar.|a list
        The game was canceled for one reason: the field was flooded.|an explanation
        We went to: the zoo, the park and the museum.|no colon
        Pack these items for camp: a sleeping bag, a flashlight and boots.|a list
        Mia had a problem: she had lost her ticket.|an explanation
        The colors of the flag are: red, white and green.|no colon
        The club has three officers: a president, a secretary and a treasurer.|a list
        The answer was simple: we needed more practice.|an explanation
        For lunch I ate: a sandwich and an apple.|no colon
        Our garden grows many vegetables: beans, carrots and squash.|a list
        I finally understood the joke: the cat was the thief.|an explanation
        The planets closest to the Sun include: Mercury, Venus and Earth.|no colon
        The trip has three stops: Rome, Florence and Venice.|a list
        Leo was tired for a good reason: he had run ten kilometers.|an explanation
        Please bring: a pencil, an eraser and a ruler.|no colon
        The store sells two kinds of bread: white and whole wheat.|a list
        The plan worked for one reason: everyone did their part.|an explanation
        My brothers are: Sam, Ben and Joe.|no colon
        The kit includes several parts: wheels, a motor and a battery.|a list
        She gave us some advice: never give up.|an explanation
        The team needs: a new coach and better shoes.|no colon
        Three students won prizes: Ana, Raj and Lily.|a list
        The truth was clear: the bridge was not safe.|an explanation
        We saw animals such as: lions, zebras and giraffes.|no colon
        The class voted on two choices: a picnic or a film.|a list
        The sky had turned dark for a reason: a storm was coming.|an explanation
        The best parts of the book are: the ending and the map.|no colon
      `,
      colonLabels,
    ),
    choose(
      "placing-a-colon",
      ["Placing a Colon", "冒号的位置"],
      [
        "To place a colon correctly, make sure the words before it could stand alone as a sentence. *The kit holds: a map and a compass* is wrong, because *The kit holds* is not complete. Either drop the colon (*The kit holds a map and a compass*) or add words such as *the following* or *two things* before it (*The kit holds two things: a map and a compass*).",
        "要正确使用冒号，先确认冒号前的词能独立成句。*The kit holds: a map and a compass* 是错的，因为 *The kit holds* 不完整。要么去掉冒号（*The kit holds a map and a compass*），要么在冒号前加上 *the following* 或 *two things* 之类的词（*The kit holds two things: a map and a compass*）。",
      ],
      ["Which sentence uses the colon correctly?", "哪个句子的冒号用得正确？"],
      `
        a list of supplies|Bring the following: paper, glue and scissors.|Bring: paper, glue and scissors.|Bring the following, paper: glue and scissors.
        an explanation of the delay|The bus was late for one reason: it had a flat tire.|The bus was late for: one reason, it had a flat tire.|The bus was: late for one reason it had a flat tire.
        a list of sports|Our school offers three sports: soccer, tennis and track.|Our school offers: soccer, tennis and track.|Our school offers three: sports soccer, tennis and track.
        a list of cities|We visited two cities: Lima and Cusco.|We visited: Lima and Cusco.|We visited two: cities Lima and Cusco.
        an explanation of a rule|Remember one rule: always wear a helmet.|Remember: one rule always wear a helmet.|Remember one: rule, always wear a helmet.
        a list of pets|Rosa has several pets: a dog, two cats and a parrot.|Rosa has: a dog, two cats and a parrot.|Rosa has several: pets a dog, two cats and a parrot.
        a list of chores|I have two chores today: dishes and laundry.|I have: two chores today, dishes and laundry.|I have two: chores today dishes and laundry.
        an explanation of a result|The plants died for a simple reason: no one watered them.|The plants died for: a simple reason no one watered them.|The plants: died for a simple reason no one watered them.
        a list of colors|The rainbow showed every color: red, orange, yellow, green, blue and violet.|The rainbow showed: red, orange, yellow, green, blue and violet.|The rainbow: showed every color red, orange and yellow.
        a list of subjects|My best subjects are these: math, art and science.|My best subjects are: math, art and science.|My best: subjects are math, art and science.
        a list of tools|The kit holds two things: a map and a compass.|The kit holds: a map and a compass.|The kit: holds two things a map and a compass.
        an explanation of a feeling|Leo felt proud: he had finished the marathon.|Leo felt: proud he had finished the marathon.|Leo: felt proud he had finished the marathon.
        a list of ingredients|The soup has four ingredients: beans, onions, carrots and salt.|The soup has: beans, onions, carrots and salt.|The soup has four: ingredients beans, onions and salt.
        a list of winners|The judges chose three winners: Ella, Omar and Kim.|The judges chose: Ella, Omar and Kim.|The judges: chose three winners Ella, Omar and Kim.
        an explanation of a choice|We chose the trail for one reason: it had the best views.|We chose: the trail for one reason it had the best views.|We: chose the trail for one reason it had the best views.
        a list of instruments|The band uses three instruments: drums, guitar and piano.|The band uses: drums, guitar and piano.|The band uses three: instruments drums, guitar and piano.
        a list of countries|We have relatives in two countries: Kenya and Ghana.|We have relatives in: Kenya and Ghana.|We have relatives: in two countries Kenya and Ghana.
        an explanation of a warning|The sign said one thing: keep out.|The sign said: one thing keep out.|The sign: said one thing keep out.
        a list of fruits|The basket held three fruits: apples, pears and plums.|The basket held: apples, pears and plums.|The basket held three: fruits apples, pears and plums.
        a list of days|The library is closed on two days: Sunday and Monday.|The library is closed on: Sunday and Monday.|The library is closed: on two days Sunday and Monday.
        an explanation of a win|The team won for one reason: it never stopped running.|The team won for: one reason it never stopped running.|The team: won for one reason it never stopped running.
        a list of books|I read three books this summer: two mysteries and a biography.|I read: two mysteries and a biography this summer.|I read three: books two mysteries and a biography.
        a list of rules|The pool has two rules: no running and no diving.|The pool has: no running and no diving.|The pool has two: rules no running and no diving.
        an explanation of a mistake|I made one mistake: I forgot to save my work.|I made: one mistake I forgot to save my work.|I: made one mistake I forgot to save my work.
        a list of animals|The farm keeps four animals: cows, pigs, goats and hens.|The farm keeps: cows, pigs, goats and hens.|The farm keeps four: animals cows, pigs and hens.
        a list of jobs|My aunt has had three jobs: nurse, pilot and teacher.|My aunt has had: nurse, pilot and teacher.|My aunt has had three: jobs nurse, pilot and teacher.
        an explanation of a surprise|The box held a surprise: a tiny kitten.|The box held: a surprise a tiny kitten.|The box: held a surprise a tiny kitten.
        a list of foods|We bought the following: rice, beans and tea.|We bought: rice, beans and tea.|We bought the following, rice: beans and tea.
        a list of steps|The test has two parts: reading and writing.|The test has: reading and writing.|The test has two: parts reading and writing.
        an explanation of a plan|Our plan was clear: leave early and avoid traffic.|Our plan was: clear leave early and avoid traffic.|Our plan: was clear leave early and avoid traffic.
      `,
      (right) => [
        `**${right}** The words before the colon form a complete sentence, and what follows is a list or an explanation.`,
        `**${right}** 冒号前的词是一个完整的句子，冒号后是列举或解释。`,
      ],
      [
        [
          "*{wrong}* puts the colon right after a verb or a preposition, before the sentence is complete.",
          "*{wrong}* 把冒号紧放在动词或介词后面，句子还没有完整。",
        ],
        ["*{wrong}* puts the colon in the middle of words that belong together.", "*{wrong}* 把冒号放在了本该连在一起的词中间。"],
      ],
    ),
  ],
});

const eitherNeither = topic("grammar", {
  id: "agreement-with-either-or-and-neither-nor",
  title: ["Agreement with Either/Or and Neither/Nor", "either/or 与 neither/nor 的一致"],
  summary: [
    "With either … or and neither … nor, the verb and the pronoun agree with the nearer subject: Neither the coach nor the players are ready.",
    "使用 either … or 和 neither … nor 时，动词和代词与较近的主语一致：Neither the coach nor the players are ready。",
  ],
  after: ["correlative-conjunctions"],
  points: [
    choose(
      "verb-with-the-nearer-subject",
      ["The Verb Agrees with the Nearer Subject", "动词与较近的主语一致"],
      [
        "When two subjects are joined by *or*, *either … or* or *neither … nor*, the verb agrees with the subject **nearer to it**: *Neither the coach nor the players **are** ready. Neither the players nor the coach **is** ready.* Unlike *and*, these words do not add the subjects together. Putting the plural subject second usually sounds more natural.",
        "两个主语由 *or*、*either … or* 或 *neither … nor* 连接时，动词与**离它较近的**主语一致：*Neither the coach nor the players **are** ready. Neither the players nor the coach **is** ready.* 与 *and* 不同，这些词不会把主语加在一起。把复数主语放在后面通常更自然。",
      ],
      ["Which verb completes the sentence?", "哪个动词能补全句子？"],
      `
        Neither the coach nor the players ___ ready.|are|is|being
        Either my sisters or my brother ___ the dishes.|washes|wash|washing
        Neither the cat nor the dogs ___ hungry.|are|is|being
        Either the teacher or the students ___ the plants.|water|waters|watering
        Neither Ana nor her friends ___ the answer.|know|knows|knowing
        Either the buses or the train ___ at noon.|leaves|leave|leaving
        Neither the girls nor their mother ___ coming.|is|are|being
        Either Leo or his cousins ___ the boat.|own|owns|owning
        Neither the apples nor the bread ___ fresh.|is|are|being
        Either the pens or the pencil ___ in the drawer.|is|are|being
        Neither my parents nor my aunt ___ to swim.|likes|like|liking
        Either the students or the principal ___ the bell.|rings|ring|ringing
        Neither the twins nor Sam ___ the rules.|understands|understand|understanding
        Either the kittens or the puppy ___ the toy.|has|have|having
        Neither the manager nor the workers ___ happy.|are|is|being
        Either my brother or my sisters ___ me to school.|drive|drives|driving
        Neither the plates nor the cup ___ broken.|is|are|being
        Either the dog or the cats ___ on the sofa.|sleep|sleeps|sleeping
        Neither the clowns nor the ringmaster ___ funny.|is|are|being
        Either Kim or her parents ___ dinner tonight.|cook|cooks|cooking
        Neither the shoes nor the hat ___ me.|fits|fit|fitting
        Either the boys or their father ___ the lawn.|mows|mow|mowing
        Neither the windows nor the door ___ locked.|is|are|being
        Either the mayor or the council members ___ the plan.|approve|approves|approving
        Neither the soup nor the sandwiches ___ ready.|are|is|being
        Either the players or the captain ___ the trophy.|carries|carry|carrying
        Neither my uncle nor my cousins ___ in Spain.|live|lives|living
        Either the books or the map ___ the answer.|shows|show|showing
        Neither the singer nor the dancers ___ tired.|are|is|being
        Either the chairs or the table ___ to be moved.|needs|need|needing
      `,
      (right, shown) => [
        `${shown.replace("___", `**${right}**`)} The verb agrees with the subject nearer to it, the one just before the verb.`,
        `${shown.replace("___", `**${right}**`)} 动词与离它较近的主语，即紧挨在动词前面的那个主语一致。`,
      ],
      [
        [
          "*{wrong}* agrees with the farther subject; the verb follows the one nearer to it.",
          "*{wrong}* 与较远的主语一致了，而动词应该与较近的主语一致。",
        ],
        ["*{wrong}* is not a form that can be the main verb of the sentence.", "*{wrong}* 不能作句子的谓语动词。"],
      ],
    ),
    choose(
      "pronoun-with-the-nearer-noun",
      ["The Pronoun Agrees with the Nearer Noun", "代词与较近的名词一致"],
      [
        "A pronoun that points back to subjects joined by *or* or *nor* follows the same rule: it agrees with the **nearer** one. *Either Sam or Leo will bring **his** guitar* (one boy). *Neither the girls nor their mother forgot **her** umbrella* sounds awkward, so put the plural last: *Neither the mother nor the girls forgot **their** umbrellas.*",
        "回指由 *or* 或 *nor* 连接的主语的代词遵循同样的规则：与**较近的**那个一致。*Either Sam or Leo will bring **his** guitar*（一个男孩）。*Neither the girls nor their mother forgot **her** umbrella* 听起来别扭，所以把复数放在后面：*Neither the mother nor the girls forgot **their** umbrellas.*",
      ],
      ["Which pronoun completes the sentence?", "哪个代词能补全句子？"],
      `
        Either Sam or Leo will bring ___ guitar.|his|their|its
        Neither the coach nor the players forgot ___ water bottles.|their|his|its
        Either Ana or Rosa left ___ scarf on the bus.|her|their|its
        Neither the teacher nor the students raised ___ hands.|their|her|its
        Either the cat or the kittens knocked over ___ bowl.|their|its|her
        Neither the boys nor their father finished ___ dinner.|his|their|its
        Either Mia or her sisters will lend you ___ bikes.|their|her|its
        Neither Dad nor Grandpa could find ___ glasses.|his|their|its
        Either the dogs or the cat ate ___ food early.|its|their|his
        Neither Kim nor Ella remembered ___ lines in the play.|her|their|its
        Either the members or the president will give ___ report.|his|their|its
        Neither the girls nor their aunt brought ___ camera.|her|their|its
        Either Omar or Raj will show you ___ drawings.|his|their|its
        Neither the twins nor their brother cleaned ___ room.|his|their|its
        Either the birds or the squirrel will find ___ way to the feeder.|its|their|his
        Neither Lily nor her friends wore ___ coats.|their|her|its
        Either the captain or the sailors will raise ___ flag.|their|his|its
        Neither Mom nor Aunt Rosa could start ___ car.|her|their|its
        Either the puppies or the dog chewed ___ toy.|its|their|his
        Neither Ben nor his cousins have done ___ homework.|their|his|its
        Either Nina or Zoe will read ___ poem first.|her|their|its
        Neither the singers nor the conductor took ___ bow.|his|their|its
        Either the parents or the principal will sign ___ name.|her|their|its
        Neither Tom nor Jake has paid for ___ ticket.|his|their|its
        Either the students or their teacher left ___ books outside.|her|their|its
        Neither the mother nor the girls forgot ___ umbrellas.|their|her|its
        Either the farmers or the farmer's wife will sell ___ eggs.|her|their|its
        Neither Leo nor Max wants ___ picture taken.|his|their|its
        Either the club members or the leader will plan ___ trip.|his|their|its
        Neither the actors nor the director liked ___ costumes.|his|their|its
      `,
      (right, shown) => [
        `${shown.replace("___", `**${right}**`)} The pronoun agrees with the nearer of the two nouns joined by *or* or *nor*.`,
        `${shown.replace("___", `**${right}**`)} 代词与由 *or* 或 *nor* 连接的两个名词中较近的那个一致。`,
      ],
      [
        ["*{wrong}* agrees with the farther noun instead of the nearer one.", "*{wrong}* 与较远的名词一致了，而不是较近的那个。"],
        [
          "*{wrong}* matches neither noun: it is for a thing, not for the people or animals named.",
          "*{wrong}* 与两个名词都不一致：它用于事物，而不是句中提到的人或动物。",
        ],
      ],
    ),
  ],
});

const goodWell = topic("grammar", {
  id: "good-and-well-bad-and-badly",
  title: ["Good and Well, Bad and Badly", "good 与 well，bad 与 badly"],
  summary: [
    "Good and bad are adjectives that describe nouns; well and badly are adverbs that describe actions; better, best, worse and worst compare.",
    "good 和 bad 是形容词，修饰名词；well 和 badly 是副词，修饰动作；better、best、worse 和 worst 用于比较。",
  ],
  after: ["adjectives-and-adverbs"],
  points: [
    choose(
      "good-or-well",
      ["Good or Well", "good 还是 well"],
      [
        "**Good** is an adjective: it describes a noun (*a good book*) or follows a linking verb such as *is*, *looks*, *tastes* or *smells* (*The soup tastes good*). **Well** is an adverb: it tells *how* someone does something (*She sings well*). *Well* is also an adjective meaning *healthy*: *I feel well today.* To compare, use **better** for two and **best** for three or more.",
        "**good** 是形容词：修饰名词（*a good book*），或跟在 *is*、*looks*、*tastes*、*smells* 等系动词后面（*The soup tastes good*）。**well** 是副词：说明某人*怎样*做某事（*She sings well*）。*well* 也是形容词，意为“健康的”：*I feel well today.* 比较时，两者用 **better**，三者或更多用 **best**。",
      ],
      ["Which word completes the sentence?", "哪个词能补全句子？"],
      `
        Maya plays the violin very ___.|well|good|gooder
        This is a ___ book about space.|good|well|gooder
        Of the three cakes, this one tastes ___.|best|good|well
        The team played ___ in the final.|well|good|gooder
        The pizza smells ___.|good|well|gooder
        My brother writes ___ than I do.|better|well|good
        Our new teacher explains things ___.|well|good|gooder
        That was a ___ idea.|good|well|gooder
        Ella is the ___ swimmer in our class.|best|better|good
        The plan worked ___.|well|good|gooder
        The flowers look ___ in that vase.|good|well|gooder
        Raj spoke ___ at the assembly.|well|good|gooder
        This road is ___ than the old one.|better|good|well
        He did ___ on the math test.|well|good|gooder
        Grandma makes ___ soup.|good|well|gooder
        Which of the four songs did you like ___?|best|good|well
        The dog behaved ___ at the vet.|well|good|gooder
        The weather is ___ today.|good|well|gooder
        Sam can run ___ than his cousin.|better|well|good
        You did a ___ job on the poster.|good|well|gooder
        The new bike rides ___.|well|good|gooder
        That was the ___ film I have ever seen.|best|better|good
        Lily draws horses really ___.|well|good|gooder
        The bread tastes ___ with butter.|good|well|gooder
        Our team did ___ this year than last year.|better|well|good
        The kids listened ___ to the story.|well|good|gooder
        It is a ___ day for a picnic.|good|well|gooder
        Of all the players, Omar kicks ___.|best|better|good
        The machine works ___ after the repair.|well|good|gooder
        She has a ___ memory for names.|good|well|gooder
      `,
      (right, shown) => [
        `${shown.replace("___", `**${right}**`)} *Good* describes a noun, *well* describes an action, and *better* and *best* compare two or more.`,
        `${shown.replace("___", `**${right}**`)} *good* 修饰名词，*well* 修饰动作，*better* 和 *best* 用于比较两者或更多。`,
      ],
      [
        [
          "*{wrong}* does not fit: ask whether the word describes a thing or an action, and whether the sentence compares.",
          "*{wrong}* 不合适：先问这个词修饰的是事物还是动作，以及句子是否在比较。",
        ],
        [
          "*{wrong}* is not standard English, or it compares the wrong number of things.",
          "*{wrong}* 不是标准英语，或者比较的对象数量不对。",
        ],
      ],
    ),
    choose(
      "bad-or-badly",
      ["Bad or Badly", "bad 还是 badly"],
      [
        "**Bad** is an adjective: *a bad storm*, and after a linking verb, *I feel bad about the mistake* or *The milk smells bad*. **Badly** is an adverb: it tells how something is done, *The team played badly*. To compare, use **worse** for two and **worst** for three or more. *I feel badly* says something about how well you can touch things, not how sorry you are.",
        "**bad** 是形容词：*a bad storm*，用在系动词后：*I feel bad about the mistake*、*The milk smells bad*。**badly** 是副词：说明事情做得怎样，*The team played badly*。比较时，两者用 **worse**，三者或更多用 **worst**。*I feel badly* 说的是你的触觉不灵，而不是你很抱歉。",
      ],
      ["Which word completes the sentence?", "哪个词能补全句子？"],
      `
        The milk smells ___.|bad|badly|badder
        Our team played ___ in the rain.|badly|bad|badder
        This is the ___ storm in fifty years.|worst|worse|bad
        I feel ___ about breaking your pen.|bad|badly|badder
        He sang so ___ that the dog howled.|badly|bad|badder
        My cold is ___ today than yesterday.|worse|worst|bad
        That was a ___ mistake.|bad|badly|badder
        The fence was ___ damaged by the wind.|badly|bad|badder
        Of all the roads, this one is ___.|worst|worse|bad
        The fish looks ___; don't eat it.|bad|badly|badder
        The car runs ___ in cold weather.|badly|bad|badder
        Her second try was ___ than her first.|worse|worst|bad
        It was a ___ idea to skip breakfast.|bad|badly|badder
        The plants grew ___ without sun.|badly|bad|badder
        That was the ___ film of the year.|worst|worse|bad
        The room smells ___ after the party.|bad|badly|badder
        He wrote the essay ___ because he rushed.|badly|bad|badder
        Traffic is ___ on Fridays than on Mondays.|worse|worst|bad
        We had ___ luck on the trip.|bad|badly|badder
        The window was ___ cracked.|badly|bad|badder
        Of the five songs, the last was the ___.|worst|worse|bad
        The soup tastes ___ without salt.|bad|badly|badder
        The play went ___ because the actors forgot their lines.|badly|bad|badder
        My handwriting is ___ than my sister's.|worse|worst|bad
        She felt ___ for laughing at him.|bad|badly|badder
        The boy was ___ hurt in the fall.|badly|bad|badder
        This is the ___ weather I have seen.|worst|worse|bad
        The news sounds ___.|bad|badly|badder
        The old radio works ___.|badly|bad|badder
        The second storm was ___ than the first.|worse|worst|bad
      `,
      (right, shown) => [
        `${shown.replace("___", `**${right}**`)} *Bad* describes a noun or follows a linking verb, *badly* describes an action, and *worse* and *worst* compare.`,
        `${shown.replace("___", `**${right}**`)} *bad* 修饰名词或跟在系动词后，*badly* 修饰动作，*worse* 和 *worst* 用于比较。`,
      ],
      [
        [
          "*{wrong}* does not fit: ask whether the word describes a thing or an action, and whether the sentence compares.",
          "*{wrong}* 不合适：先问这个词修饰的是事物还是动作，以及句子是否在比较。",
        ],
        [
          "*{wrong}* is not standard English, or it compares the wrong number of things.",
          "*{wrong}* 不是标准英语，或者比较的对象数量不对。",
        ],
      ],
    ),
  ],
});

const titleCapitals = topic("grammar", {
  id: "capitals-in-titles-and-headings",
  title: ["Capitals in Titles and Headings", "标题中的大写"],
  summary: [
    "Capitalize the first and last words of a title and every important word; keep short articles, conjunctions and prepositions lowercase.",
    "标题的第一个词、最后一个词和每个重要的词首字母大写；短的冠词、连词和介词小写。",
  ],
  after: ["titles-in-italics-and-quotation-marks"],
  points: [
    choose(
      "capitalizing-a-title",
      ["Capitalizing a Title", "标题的大写"],
      [
        "In a title, capitalize the **first and last words** and every **important word**: nouns, pronouns, verbs, adjectives and adverbs, even short ones such as *Is*, *It* and *Be*. Keep **lowercase** the small words *a*, *an*, *the*, *and*, *but*, *or*, *for*, *nor* and short prepositions such as *of*, *in*, *on*, *to*, *at* and *by*, unless one comes first or last.",
        "在标题中，**第一个词和最后一个词**以及每个**重要的词**首字母大写：名词、代词、动词、形容词和副词，即使是 *Is*、*It*、*Be* 这样的短词也要大写。小词 *a*、*an*、*the*、*and*、*but*、*or*、*for*、*nor* 以及 *of*、*in*、*on*、*to*、*at*、*by* 等短介词**小写**，除非它们在开头或结尾。",
      ],
      ["Which title is capitalized correctly?", "哪个标题的大写正确？"],
      `
        a book about a lost dog|The Dog Who Came Home|The Dog who Came Home|The dog Who came Home
        a film about the sea|A Voyage to the Bottom of the Sea|A Voyage To The Bottom Of The Sea|a Voyage to the Bottom of the Sea
        a poem about winter|The Snow Is Falling|The Snow is Falling|the Snow Is Falling
        a story about two friends|Friends in the City|Friends In The City|friends in the City
        a song about home|Home Is Where We Are|Home is Where we Are|Home Is where We are
        a report on bees|Bees and the Flowers They Visit|Bees And The Flowers They Visit|Bees and the flowers they Visit
        a book about space|Journey to the Stars|Journey To The Stars|Journey to the stars
        a play about a king|The King and His Castle|The King And His Castle|The King and his Castle
        a magazine article about food|What to Eat for Breakfast|What To Eat For Breakfast|what to Eat for Breakfast
        a film about a robot|The Robot Builds a Bridge|The Robot builds a Bridge|The Robot Builds A Bridge
        a book about Rome|Life in Ancient Rome|Life In Ancient Rome|Life in ancient Rome
        a story about a fox|How the Fox Got Its Tail|How the Fox got its Tail|How The Fox Got Its Tail
        a song about summer|Under the Summer Sun|Under The Summer Sun|under the Summer Sun
        a poem about rain|Rain on the Roof|Rain On The Roof|Rain on the roof
        a book about a girl|A Girl Called Hope|A Girl called Hope|a Girl Called Hope
        a guide to camping|Camping for Beginners|Camping For Beginners|camping for Beginners
        a story about a dragon|The Dragon of the North|The Dragon Of The North|The dragon of the North
        a film about friendship|Stand by Me|Stand By Me|stand by Me
        a report on volcanoes|Volcanoes: Fire from Below|Volcanoes: Fire From Below|Volcanoes: fire from Below
        a song about the night|The Night Is Young|The Night is Young|The night Is Young
        a book about pirates|Pirates of the Caribbean Sea|Pirates Of The Caribbean Sea|Pirates of the caribbean Sea
        a story about a lost key|The Key Under the Mat|The Key Under The Mat|The key under the Mat
        a poem about the moon|To the Moon and Back|To The Moon And Back|to the Moon and Back
        a guide to drawing|How to Draw Animals|How To Draw Animals|How to draw Animals
        a story about a storm|After the Storm Was Over|After the Storm was Over|After The Storm Was Over
        a book about inventors|Great Inventors and Their Ideas|Great Inventors And Their Ideas|Great Inventors and their Ideas
        a song about a river|Down by the River|Down By The River|down by the River
        a film about a cat|A Cat on the Run|A Cat On The Run|a Cat on the Run
        a story about a dream|What She Dreamed Of|What She Dreamed of|What she Dreamed Of
        a book about trees|The Life of a Tree|The Life Of A Tree|The life of a Tree
      `,
      (right, shown) => [
        `**${right}** is the title of ${shown}: its first and last words and its important words are capitalized, and its small words are not.`,
        `**${right}** 是${shown}的标题：第一个词、最后一个词和重要的词大写，小词不大写。`,
      ],
      [
        [
          "*{wrong}* capitalizes the wrong words: small words that should stay lowercase, or important words left small.",
          "*{wrong}* 大写错了词：本该小写的小词大写了，或者重要的词没有大写。",
        ],
        ["*{wrong}* leaves the first word or other important words lowercase.", "*{wrong}* 第一个词或其他重要的词没有大写。"],
      ],
    ),
    choose(
      "the-word-that-stays-small",
      ["The Word That Stays Lowercase", "保持小写的词"],
      [
        "Short verbs and pronouns are important words: *Is*, *Are*, *Be*, *It*, *He* and *Its* are always capitalized in a title. Only the short **articles**, **conjunctions** and **prepositions** stay lowercase in the middle. The word after a colon in a title is capitalized, because it begins a new part.",
        "短的动词和代词是重要的词：*Is*、*Are*、*Be*、*It*、*He* 和 *Its* 在标题中总是大写。只有短的**冠词**、**连词**和**介词**在中间保持小写。标题中冒号后的词要大写，因为它开始了新的部分。",
      ],
      ["In this title, which word should stay lowercase?", "这个标题中哪个词应该保持小写？"],
      `
        THE BOY WHO LIVED IN A TREE|in|who|tree
        WHEN THE RIVER IS HIGH|the|is|when
        A STORY OF HOPE AND COURAGE|of|story|hope
        WHERE IT ALL BEGAN|nobody: every word is capitalized|it|all
        THE CASTLE ON THE HILL|on|castle|hill
        HOW TO BE A GOOD FRIEND|to|be|good
        WHAT HE FOUND IN THE ATTIC|in|he|found
        BIRDS OF THE WORLD: A GUIDE|of|a|guide
        THE SUN AND ITS PLANETS|and|its|sun
        LIFE AT THE BOTTOM OF THE SEA|at|life|bottom
        THE DOG THAT WOULD NOT BARK|nobody: every word is capitalized|that|not
        A GIRL WITH A RED KITE|with|girl|red
        WHO IS AT THE DOOR?|at|who|is
        RUNNING FOR THE BUS|for|running|bus
        THE KING BUT NOT THE QUEEN|but|not|king
        WHY THE SKY IS BLUE|the|is|why
        A HOUSE BY THE LAKE|by|house|lake
        WHY WE SLEEP|nobody: every word is capitalized|we|sleep
        TALES FROM THE OLD WEST|from|tales|old
        A TRIP TO THE MOUNTAINS|to|trip|mountains
        IT IS TIME TO GO|to|it|is
        THE STARS AND THE MOON|and|stars|moon
        FOOD FOR THOUGHT|for|food|thought
        WHERE ARE YOU GOING?|nobody: every word is capitalized|are|you
        THE GIRL ON THE BRIDGE|on|girl|bridge
        A HISTORY OF FLIGHT|of|history|flight
        HOME AT LAST|at|home|last
        RICE OR BEANS FOR DINNER|or|rice|dinner
        THE BOOK UNDER THE BED|the|book|bed
        CATS, DOGS AND OTHER PETS|and|other|pets
      `,
      (right, shown) => [
        right.startsWith("nobody")
          ? `In *${shown}*, every word is a verb, pronoun, adverb or other important word, so ${right}.`
          : `In *${shown}*, **${right}** is a small article, conjunction or preposition in the middle of the title, so it stays lowercase.`,
        right.startsWith("nobody")
          ? `在 *${shown}* 中，每个词都是动词、代词、副词或其他重要的词，所以每个词都要大写。`
          : `在 *${shown}* 中，**${right}** 是标题中间的短冠词、连词或介词，所以保持小写。`,
      ],
      [
        [
          "*{wrong}* is an important word, such as a verb, pronoun or adverb, so it is capitalized.",
          "*{wrong}* 是重要的词，比如动词、代词或副词，所以要大写。",
        ],
        ["*{wrong}* is a noun, adjective or a first word, so it is capitalized.", "*{wrong}* 是名词、形容词或第一个词，所以要大写。"],
      ],
    ),
  ],
});

const prefixSpelling = topic("grammar", {
  id: "spelling-words-with-prefixes",
  title: ["Spelling Words with Prefixes", "带前缀的词的拼写"],
  summary: [
    "A prefix never changes the spelling of the base word, so mis + spell has two s's and dis + appear has one.",
    "前缀从不改变基础词的拼写，所以 mis + spell 有两个 s，dis + appear 只有一个。",
  ],
  after: ["prefixes-in-im-il-and-ir"],
  points: [
    choose(
      "double-letters-at-the-seam",
      ["Double Letters at the Seam", "接缝处的双写字母"],
      [
        "A prefix is simply added to the front of a word, and neither part loses a letter. When the prefix ends with the same letter that the base begins with, the word has a **double letter**: *mis + spell = misspell*, *un + necessary = unnecessary*, *dis + satisfied = dissatisfied*, *over + run = overrun*. Split the word at the seam to check.",
        "前缀只是加在词的前面，两部分都不会丢掉字母。如果前缀的最后一个字母和基础词的第一个字母相同，这个词就会出现**双写字母**：*mis + spell = misspell*，*un + necessary = unnecessary*，*dis + satisfied = dissatisfied*，*over + run = overrun*。在接缝处把词拆开来检查。",
      ],
      ["Which spelling is correct?", "哪个拼写正确？"],
      `
        mis + spell|misspell|mispell|missspell
        un + necessary|unnecessary|unecessary|unneccessary
        dis + satisfied|dissatisfied|disatisfied|disssatisfied
        im + mature|immature|imature|immmature
        il + legal|illegal|ilegal|illegle
        ir + regular|irregular|iregular|irreguler
        over + run|overrun|overun|overrunn
        un + natural|unnatural|unatural|unnatrual
        mis + step|misstep|mistep|missstep
        dis + similar|dissimilar|disimilar|dissimiler
        im + mobile|immobile|imobile|immobil
        il + logical|illogical|ilogical|illogicle
        ir + responsible|irresponsible|iresponsible|irresponsable
        inter + related|interrelated|interelated|interrelatted
        un + noticed|unnoticed|unoticed|unnotised
        dis + service|disservice|diservice|disservise
        im + measurable|immeasurable|imeasurable|immesurable
        ir + replaceable|irreplaceable|ireplaceable|irreplacable
        under + rated|underrated|underated|underratted
        un + numbered|unnumbered|unumbered|unnumberred
        mis + shapen|misshapen|mishapen|misshappen
        il + literate|illiterate|iliterate|illitterate
        ir + relevant|irrelevant|irelevant|irrelevent
        over + ride|override|overide|overridde
        im + moral|immoral|imoral|immorral
        un + named|unnamed|unamed|unnammed
        dis + solve|dissolve|disolve|dissolv
        ir + rational|irrational|irational|irrationel
        un + needed|unneeded|uneeded|unneded
        mis + sent|missent|misent|misssent
      `,
      (right, shown) => [
        `${shown} gives **${right}**: the prefix keeps all its letters and so does the base word.`,
        `${shown} 构成 **${right}**：前缀保留全部字母，基础词也是如此。`,
      ],
      [
        ["*{wrong}* drops one of the two letters that meet at the seam.", "*{wrong}* 丢掉了接缝处相遇的两个字母之一。"],
        ["*{wrong}* adds a letter or misspells the base word.", "*{wrong}* 多加了字母，或者拼错了基础词。"],
      ],
    ),
    choose(
      "keeping-the-base-word",
      ["Keeping the Base Word", "保持基础词不变"],
      [
        "When the prefix and the base word do **not** share a letter at the seam, there is no double letter: *dis + appear = disappear*, *dis + agree = disagree*, *mis + behave = misbehave*, *un + able = unable*. Spelling mistakes come from adding a letter that is in neither part. Ask: what is the prefix, what is the base, and does each keep its own spelling?",
        "如果前缀和基础词在接缝处**没有**相同的字母，就不会有双写字母：*dis + appear = disappear*，*dis + agree = disagree*，*mis + behave = misbehave*，*un + able = unable*。拼写错误往往来自多加了一个两部分都没有的字母。问一问：前缀是什么，基础词是什么，它们各自的拼写保持不变了吗？",
      ],
      ["Which spelling is correct?", "哪个拼写正确？"],
      `
        dis + appear|disappear|dissappear|disapear
        dis + agree|disagree|dissagree|disagre
        mis + behave|misbehave|missbehave|misbehav
        un + able|unable|unnable|unabel
        dis + appoint|disappoint|dissappoint|disapoint
        re + arrange|rearrange|rearange|rerrange
        pre + view|preview|previeu|prevue
        mis + understand|misunderstand|missunderstand|misunderstan
        un + even|uneven|unneven|unevin
        dis + honest|dishonest|disshonest|dishonist
        re + build|rebuild|rebiuld|rebuilld
        dis + order|disorder|dissorder|disordor
        mis + place|misplace|missplace|misplase
        un + usual|unusual|unnusual|unusuel
        in + accurate|inaccurate|innaccurate|inaccurat
        dis + obey|disobey|dissobey|disobay
        mis + lead|mislead|misslead|misleed
        pre + arrange|prearrange|prearange|prerrange
        un + armed|unarmed|unnarmed|unarmd
        dis + advantage|disadvantage|dissadvantage|disadvantige
        re + appear|reappear|reapear|rreappear
        mis + inform|misinform|missinform|misinfrom
        un + aware|unaware|unnaware|unawair
        in + active|inactive|innactive|inactiv
        dis + approve|disapprove|dissapprove|disaprove
        over + eat|overeat|overreat|overet
        un + afraid|unafraid|unnafraid|unafrade
        mis + use|misuse|missuse|misuze
        dis + infect|disinfect|dissinfect|disinfeckt
        re + open|reopen|reopenn|ropen
      `,
      (right, shown) => [
        `${shown} gives **${right}**: the parts share no letter at the seam, so there is no double letter.`,
        `${shown} 构成 **${right}**：两部分在接缝处没有相同字母，所以没有双写字母。`,
      ],
      [
        [
          "*{wrong}* adds a letter that belongs to neither the prefix nor the base word.",
          "*{wrong}* 多加了一个既不属于前缀也不属于基础词的字母。",
        ],
        ["*{wrong}* changes or drops a letter of the base word.", "*{wrong}* 改变或丢掉了基础词的一个字母。"],
      ],
    ),
  ],
});

/** grammarTopics6b are the grade 6 topics of verbs, possessives, spelling, colons and usage. */
export const grammarTopics6b: readonly TopicDef[] = [
  participles,
  possessives,
  doubling,
  colons,
  eitherNeither,
  goodWell,
  titleCapitals,
  prefixSpelling,
];
