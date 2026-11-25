// A2, unit 1: Last Weekend. Words for the past, relatives, events and the weekend; the past simple of regular and
// irregular verbs with did and didn't; sentences in the past judged by rules, and a weekend judged by a model.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator, type WritingItem } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { everyTriple, vocabularyTopic, word } from "../words.ts";
import { fill, judgedTopic } from "./kit.ts";
import {
  pastSimpleIrregularSpellNot,
  pastSimpleQuestionsAndNegativesWriteNegativeNot,
  pastSimpleQuestionsAndNegativesWriteQuestionNot,
  pastSimpleRegularFixNot,
  pastSimpleRegularSpellNot,
  writingSentencesInThePastWriteNot,
} from "./mistakes.ts";

const pastTime = vocabularyTopic({
  id: "a2-words-past-time",
  title: t("Words for the Past", "表示过去的词"),
  summary: t(
    "Yesterday, ago, once, recently, soon, suddenly, finally, during, while and until.",
    "yesterday、ago、once、recently、soon、suddenly、finally、during、while 和 until。",
  ),
  intro: t(
    "**Yesterday** we waited an hour for the bus, and it **finally** came; then **suddenly** it started to rain, so we stayed inside **until** it stopped. These words help you say when things happened and in what order.",
    "**Yesterday**（昨天）我们等了一个小时公交车，车 **finally**（终于）来了；接着 **suddenly**（突然）下起雨来，我们就待在屋里，**until**（直到）雨停。这些词帮你说出事情是什么时候、按什么顺序发生的。",
  ),
  prerequisites: ["a1-words-time"],
  words: [
    word(
      "yesterday",
      "the day before today",
      "昨天",
      "I saw Tom {yesterday}. | {Yesterday} was Sunday, so today is Monday. | Where were you {yesterday} afternoon?",
      "tomorrow ago",
    ),
    word(
      "ago",
      "back in time from now, after a number of days or years",
      "以前",
      "We moved here two years {ago}. | I had lunch an hour {ago}. | My grandpa was born a long time {ago}.",
      "until soon",
    ),
    word(
      "once",
      "one time; at one time in the past",
      "一次；曾经",
      "I went to Beijing {once}, when I was six. | We eat out {once} a week. | {Once}, a man lived in a small house by the sea.",
      "ago until",
      "recently",
    ),
    word(
      "recently",
      "not long ago",
      "最近",
      "Have you seen any good films {recently}? | We have {recently} moved to a new flat, and we love it. | My aunt got married {recently}: just last month.",
      "tomorrow soon",
    ),
    word(
      "soon",
      "in a short time from now",
      "很快；不久",
      "Hurry up! The bus will come {soon}. | See you {soon}! | It will be dark {soon}, so let's go home.",
      "ago yesterday",
    ),
    word(
      "suddenly",
      "quickly, when you do not expect it",
      "突然",
      "We were walking home when {suddenly}, with no warning, it started to rain. | The lights went out {suddenly}, and we were all surprised. | The dog {suddenly} ran into the road, and the driver didn't expect it.",
      "finally recently",
    ),
    word(
      "finally",
      "at the end, after a long time",
      "终于；最后",
      "We waited and waited, and after an hour the bus {finally} came. | After three tries, she {finally} passed the test. | {Finally}, after a long drive, we got home at midnight.",
      "suddenly soon",
    ),
    word(
      "during",
      "in the time of something",
      "在……期间",
      "Don't talk {during} the test: stay quiet from start to end. | I fell asleep {during} the film. | We stayed inside {during} the rain and went out after it stopped.",
      "while until",
      "while",
    ),
    word(
      "while",
      "in the time that something else is happening",
      "当……的时候",
      "I listen to music {while} I cook, so I do both at the same time. | Someone called {while} you were out. | Can you watch the children {while} I am in the shop?",
      "during until",
    ),
    word(
      "until",
      "up to the time when",
      "直到",
      "Wait here {until} I come back. | The shop is open {until} nine o'clock. | We played outside {until} it got dark, and then we went home.",
      "while since",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*During* comes before a noun, as in *during the film*, and *while* comes before a whole action with its own doer, as in *while I cook*. Check what follows the gap.",
        "*during* 后面接名词，如 *during the film*；*while* 后面接带主语的完整动作，如 *while I cook*。看空格后面接的是什么。",
      ),
      meaning: t(
        "*Suddenly* and *finally* both tell when something happened: *suddenly* is when nobody expected it, and *finally* is at the end of a long wait or many tries.",
        "*suddenly* 和 *finally* 都说明事情发生的时间：*suddenly* 是谁都没想到的时候，*finally* 是等了很久或试了很多次之后。",
      ),
      spell: t(
        "*Recently* keeps the t of *recent* before -ly, and *suddenly* has a double d but one l: sud · den · ly.",
        "*recently* 在 -ly 前保留 *recent* 的 t；*suddenly* 双写 d，结尾只有一个 l：sud · den · ly。",
      ),
    },
    notes: `
      yesterday|seeing Tom;Sunday before Monday;where someone was in the afternoon|yesterday is the day before today; tomorrow is the day after|yesterday 是昨天；tomorrow 是明天|tomorrow=tomorrow is the day after today, so it never goes with past words like *saw*, *was* or *were*=tomorrow 是明天，不和 *saw*、*was*、*were* 这类过去的词连用;ago=ago comes after a length of time, as in *two days ago*, and never stands alone=ago 放在一段时间后面，如 *two days ago*，不能单独用|yesterday afternoon · the day before yesterday|yes + ter + day, with -day at the end|yes + ter + day，结尾是 -day
      ago|moving two years back;lunch an hour back;a grandpa born long back|ago comes after a length of time back from now; until means up to a time|ago 放在一段时间后，表示多久以前；until 是直到|until=until means up to a time and comes before it, as in *until nine*, never after *two years* or *an hour*=until 是直到，放在时间前面，如 *until nine*，不放在 *two years*、*an hour* 后面;soon=soon means in a short time from now, so it never goes with past words like *moved*, *had* or *was born*=soon 是不久以后，不和 *moved*、*had*、*was born* 这类过去的词连用|two years ago · a long time ago|a said like *uh*, and go at the end|a 读作 *uh*，结尾是 go
      once|Beijing at six;eating out every week;the start of a story|once means one time, or at one time in the past; ago needs a length of time before it|once 是一次或曾经；ago 前面要有一段时间|ago=ago needs a length of time before it, as in *two years ago*, and cannot mean one time=ago 前面要有一段时间，如 *two years ago*，不能表示一次;until=until means up to a time, not one time=until 是直到某时，不是一次|once a week · once upon a time|o said like *w*: once|o 读作 *w*：once
      recently|seeing good films;a new flat;a wedding last month|recently means not long ago; soon means not long from now|recently 是不久以前；soon 是不久以后|tomorrow=tomorrow is the day after today, so it never goes with *have seen*, *have moved* or *got married*=tomorrow 是明天，不和 *have seen*、*have moved*、*got married* 连用;soon=soon means a short time from now, not a short time back in the past=soon 是不久以后，不是不久以前|recently · have recently moved|recent + -ly, keeping the t|recent 加 -ly，保留 t
      soon|a bus coming;saying goodbye;darkness coming|soon means in a short time from now; ago means back in the past|soon 是不久以后；ago 是以前|ago=ago means back in the past after a length of time, so it never goes with *will* or *see you*=ago 是若干时间以前，不和 *will*、*see you* 连用;yesterday=yesterday is the day before today, so it never goes with *will* or *see you*=yesterday 是昨天，不和 *will*、*see you* 连用|See you soon! · will come soon|the double o: s-o-o-n|两个 o：s-o-o-n
      suddenly|rain with no warning;lights going out by surprise;a dog the driver didn't expect|suddenly means quickly and not expected; finally means at the end of a long wait|suddenly 是突然、没想到；finally 是等了很久之后终于|finally=finally means at the end of a long wait, but nobody was waiting for this=finally 是等了很久之后，而这件事没有人在等;recently=recently means not long ago, and it does not say that something was a surprise=recently 是不久以前，并不表示出人意料|suddenly it started to rain|sud · den · ly, with the double d|sud · den · ly，双写 d
      finally|waiting an hour for a bus;three tries at a test;a long drive home|finally means at the end, after a long time; suddenly means not expected|finally 是终于、最后；suddenly 是突然|suddenly=suddenly means quickly when nobody expects it, not at the end of a long wait or many tries=suddenly 是谁都没想到的时候突然发生，不是等了很久或试了很多次之后;soon=soon means a short time from now, not at the end of something that took a long time=soon 是不久以后，不是花了很长时间之后|finally came · finally passed|final + -ly, with the double l|final 加 -ly，双写 l
      during|quiet from start to end of a test;falling asleep in a film;going out after the rain stopped|during comes before a noun, as in *during the film*; while comes before an action with a doer|during 后接名词，如 *during the film*；while 后接带主语的动作|while=while comes before a whole action like *I cook*, not before a noun like *the test* or *the rain*=while 后面接 *I cook* 这样的完整动作，不接 *the test*、*the rain* 这样的名词;until=until means up to a time and then stopping, not all through something=until 是到某时为止，不是整个过程当中|during the film · during the night|dur · ing, with u said like *yoo* or *oo*|dur · ing，u 读作 *yoo* 或 *oo*
      while|doing two things at the same time;a call when you were out;watching children when I'm in a shop|while means in the same time as another action; until means up to a time|while 是在另一个动作进行的同时；until 是直到|during=during comes before a noun like *the film*, not before an action like *I cook* or *you were out*=during 后面接 *the film* 这样的名词，不接 *I cook*、*you were out* 这样的动作;until=until means up to the moment something happens and then stopping, not at the same time as it=until 是到某事发生为止，不是和它同时|while I cook · while you were out|wh said like w, and the silent e at the end|wh 读作 w，词尾 e 不发音
      until|waiting for someone to come back;nine o'clock closing;going home when it got dark|until means up to a time and then stopping; since means from a time in the past|until 是到某时为止；since 是从过去某时起|while=while means at the same time as an action, not up to a time and then stopping=while 是与某个动作同时，不是到某时为止;since=since means from a time in the past until now, not up to a time ahead=since 是从过去某时到现在，不是到将来某时为止|until nine o'clock · wait until|one l at the end: un · til|结尾只有一个 l：un · til
    `,
  },
});

const relatives = vocabularyTopic({
  id: "a2-words-relatives",
  title: t("Relatives", "亲戚"),
  summary: t(
    "Uncles, aunts, cousins, parents, grandparents, sons, daughters, husbands and wives, and being married or born.",
    "叔叔阿姨、堂表兄弟姐妹、父母、祖父母、儿子、女儿、丈夫和妻子，以及结婚和出生。",
  ),
  intro: t(
    "At Grandma's birthday, all our **relatives** came: my **uncle** and **aunt**, their two children, who are my **cousins**, and my **grandparents** at the head of the table. These words help you name the people in your family and say how they are related.",
    "奶奶过生日那天，所有 **relatives**（亲戚）都来了：我的 **uncle**（舅舅）和 **aunt**（舅妈），他们的两个孩子，也就是我的 **cousins**（表兄妹），还有坐在桌子上首的 **grandparents**（祖父母）。这些词帮你说出家里的人，以及他们之间是什么关系。",
  ),
  prerequisites: ["pre-a1-words-family"],
  words: [
    word(
      "uncle uncles",
      "the brother of your mother or father",
      "叔叔；舅舅；伯伯",
      "My mom's brother is my {uncle}. | {Uncle} Jack, my dad's brother, lives on a farm with a lot of cows. | My {uncle} and his wife, my aunt, have two children: my cousins.",
      "aunt cousin",
    ),
    word(
      "aunt aunts",
      "the sister of your mother or father",
      "阿姨；姑姑",
      "My dad's sister is my {aunt}. | {Aunt} Mary, my mom's sister, gave me a dress for my birthday. | My {aunt} and her husband, my uncle, live in Shanghai.",
      "uncle cousin",
    ),
    word(
      "cousin cousins",
      "a child of your uncle or aunt",
      "堂兄弟姐妹；表兄弟姐妹",
      "My uncle's son is my {cousin}. | Lily and I are {cousins}: our mothers are sisters.|aunts uncles | My {cousin} Tom is my age. His mother is my aunt.",
      "aunt uncle",
    ),
    word(
      "parent parents",
      "a mother or a father",
      "父亲或母亲",
      "Your mother and father are your {parents}.|cousins grandparents | Kids, ask your {parents} before you go out: your mom or your dad must say yes.|cousins grandparents | Each child has two {parents}: a mother and a father.|cousins grandparents",
      "cousin grandparent",
    ),
    word(
      "grandparent grandparents",
      "the mother or father of your mother or father",
      "祖父母；外祖父母",
      "My mom's parents are my {grandparents}.|parents cousins | Grandma and Grandpa are my {grandparents}.|parents cousins | My {grandparents} are seventy years old, and they have six grandchildren.|parents cousins",
      "parent cousin",
    ),
    word(
      "son sons",
      "a boy or man, when you talk about his mother or father",
      "儿子",
      "Mr. and Mrs. Wang have a {son} and a daughter. | Tom is Mrs. Green's {son}. | Their {son} is ten, and he likes football.",
      "daughter wife",
    ),
    word(
      "daughter daughters",
      "a girl or woman, when you talk about her mother or father",
      "女儿",
      "Lily is Mr. Li's {daughter}. | They have one {daughter}. She is a doctor. | My {daughter} is five, and she goes to school now. She loves it.",
      "son husband",
    ),
    word(
      "husband husbands",
      "the man a woman is married to",
      "丈夫",
      "Mrs. Brown's {husband} is a doctor: she married him in 2005. | She met her {husband} at university, and they got married in 2010. | Ann is Tom's wife, and Tom is Ann's {husband}.",
      "wife son",
    ),
    word(
      "wife wives",
      "the woman a man is married to",
      "妻子",
      "Mr. Smith and his {wife} got married ten years ago, and they have two sons. | Tom is Ann's husband, and Ann is Tom's {wife}. | My uncle's {wife} is my aunt.",
      "husband daughter",
    ),
    word(
      "relative relatives",
      "a person in your family",
      "亲戚",
      "Uncles, aunts and cousins are all {relatives}.|parents sons | Is she your sister? — No, but she is a {relative}: she's my mom's cousin. | We have {relatives} in Canada, like my aunt and two cousins.|parents sons",
      "parent son",
    ),
    word(
      "married",
      "having a husband or a wife",
      "已婚的",
      "My sister got {married} last year, and her husband is very kind. | Are you {married}? — Yes, this is my husband. | My uncle is not {married}: he has no wife.",
      "born ill",
    ),
    word(
      "born",
      "come into the world as a baby",
      "出生",
      "The baby was {born} at two in the morning, so today is her birthday. | My cat was {born} in May, so she is very young. | My little brother was {born} three days ago, so he is only three days old.",
      "married ill",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Uncle* and *aunt* are your parents' brother and sister, and their children are your *cousins*. Look for *brother*, *sister*, *son*, *mother* or *wife* in the sentence to find who the person is.",
        "*uncle* 和 *aunt* 是父母的兄弟和姐妹，他们的孩子是你的 *cousins*。在句子里找 *brother*、*sister*、*son*、*mother* 或 *wife*，判断说的是谁。",
      ),
      meaning: t(
        "*Parents* are only your mother and father, but *relatives* are all the people in your family, like uncles, aunts and cousins.",
        "*parents* 只指爸爸妈妈，*relatives* 则是家里所有的人，比如叔叔、阿姨和堂表兄弟姐妹。",
      ),
      spell: t(
        "*Daughter* has a silent gh: d-a-u-g-h-t-e-r, and *wife* has the irregular plural *wives*.",
        "*daughter* 里的 gh 不发音：d-a-u-g-h-t-e-r；*wife* 的复数不规则，是 *wives*。",
      ),
    },
    notes: `
      uncle|a mom's brother;a dad's brother;the husband of an aunt|an uncle is a man, the brother of a parent; an aunt is a woman|uncle 是父母的兄弟，男性；aunt 是女性|aunt=aunt is a woman, the sister of a parent or the wife of an uncle, not a brother=aunt 是女性，是父母的姐妹或叔叔的妻子，不是兄弟;cousin=cousin is a child of your uncle or aunt, not your parent's brother=cousin 是叔叔阿姨的孩子，不是父母的兄弟|my uncle · Uncle Jack|-cle at the end, said like *kl*|结尾 -cle 读作 *kl*
      aunt|a dad's sister;a mom's sister;the wife of an uncle|an aunt is a woman, the sister of a parent; an uncle is a man|aunt 是父母的姐妹，女性；uncle 是男性|uncle=uncle is a man, the brother of a parent or the husband of an aunt, not a sister=uncle 是男性，是父母的兄弟或阿姨的丈夫，不是姐妹;cousin=cousin is a child of your uncle or aunt, not your parent's sister=cousin 是叔叔阿姨的孩子，不是父母的姐妹|my aunt · Aunt Mary|au, said like *ah* or like *ant*|au 读作 *ah* 或像 *ant*
      cousin|an uncle's son;mothers who are sisters;someone whose mother is my aunt|a cousin is the child of your uncle or aunt; an aunt is your parent's sister|cousin 是叔叔阿姨的孩子；aunt 是父母的姐妹|aunt=aunt is your parent's sister, one generation older, not the child of your uncle or aunt=aunt 是父母的姐妹，比你大一辈，不是叔叔阿姨的孩子;uncle=uncle is your parent's brother, one generation older, not the child of your uncle or aunt=uncle 是父母的兄弟，比你大一辈，不是叔叔阿姨的孩子|my cousin Tom|ou said like short u: cous · in|ou 读短元音 u：cous · in
      parent|a mother and a father;a mom or dad saying yes;two for each child|your parents are your mother and father; your grandparents are their parents|parents 是爸爸妈妈；grandparents 是爸爸妈妈的父母|cousin/cousins=cousin is a child of your uncle or aunt, not your mother or father=cousin 是叔叔阿姨的孩子，不是爸爸妈妈;grandparent/grandparents=grandparent is the mother or father of your mother or father, not your own mom or dad=grandparent 是爸爸妈妈的父母，不是自己的爸爸妈妈|ask your parents|par · ent, with -ent at the end|par · ent，结尾是 -ent
      grandparent|a mom's parents;Grandma and Grandpa;six grandchildren|grandparents are your parents' parents; parents are your mother and father|grandparents 是父母的父母；parents 是爸爸妈妈|parent/parents=parent is your own mother or father, not the parents of your mom or dad=parent 是自己的爸爸妈妈，不是爸爸妈妈的父母;cousin/cousins=cousin is a child of your uncle or aunt, not Grandma or Grandpa=cousin 是叔叔阿姨的孩子，不是爷爷奶奶|my grandparents|grand + parent, one word|grand + parent，合成一个词
      son|a brother for a daughter;Tom and his mother;a ten-year-old boy|a son is a boy; a daughter is a girl|son 是儿子；daughter 是女儿|daughter=daughter is a girl or woman, not a boy like Tom=daughter 是女孩或女人，不是 Tom 这样的男孩;wife=wife is the woman a man is married to, not a child=wife 是男人的妻子，不是孩子|a son and a daughter|o said like short u, the same sound as *sun*|o 读短元音 u，和 *sun* 同音
      daughter|Lily and her father;a child who is a doctor;a five-year-old girl|a daughter is a girl; a son is a boy|daughter 是女儿；son 是儿子|son=son is a boy or man, not a girl called *she*=son 是男孩或男人，不是用 *she* 指的女孩;husband=husband is the man a woman is married to, not a child=husband 是女人的丈夫，不是孩子|one daughter · my daughter|a silent gh: daugh · ter|gh 不发音：daugh · ter
      husband|the man Mrs. Brown married;a wedding in 2010;Ann and Tom|a husband is the man a woman is married to; a wife is the woman|husband 是丈夫；wife 是妻子|wife=wife is the woman a man is married to, not the man=wife 是男人的妻子，不是男的;son=son is a child, not the man a woman married=son 是孩子，不是女人嫁的人|her husband|hus · band, with s said like z|hus · band，s 读作 z
      wife|a wedding ten years ago;Tom and Ann;an aunt married to an uncle|a wife is the woman a man is married to; a husband is the man|wife 是妻子；husband 是丈夫|husband=husband is the man a woman is married to, not the woman=husband 是女人的丈夫，不是女的;daughter=daughter is a child, not the woman a man married=daughter 是孩子，不是男人娶的人|his wife|one *wife*, two *wives*|一位 *wife*，两位 *wives*
      relative|uncles, aunts and cousins;a mom's cousin;an aunt and two cousins|relatives are all the people in your family; parents are only your mother and father|relatives 是所有亲戚；parents 只指爸爸妈妈|parent/parents=parent is only your mother or father, not uncles, aunts or cousins=parent 只指爸爸妈妈，不包括叔叔、阿姨或堂表兄弟姐妹;son/sons=son is a boy or man in relation to his parents, not uncles, aunts or cousins=son 是儿子，不是叔叔、阿姨或堂表兄弟姐妹|a relative · relatives in Canada|rel · a · tive, with -tive at the end|rel · a · tive，结尾是 -tive
      married|a sister's kind husband;this is my husband;an uncle with no wife|married means having a husband or a wife; born means come into the world|married 是已婚；born 是出生|born=born means coming into the world as a baby, not having a husband or a wife=born 是出生，不是有丈夫或妻子;ill=ill means not well, not having a husband or a wife=ill 是生病，不是有丈夫或妻子|get married · be married|the double r, and -ied at the end|双写 r，结尾是 -ied
      born|a birthday at two in the morning;a young cat born in May;a brother only three days old|born means come into the world as a baby; married means having a husband or a wife|born 是出生；married 是已婚|married=married means having a husband or a wife, not coming into the world=married 是有丈夫或妻子，不是出生;ill=ill means not well, and it does not tell how old someone is or when their birthday is=ill 是生病，不表示几岁或哪天生日|be born in May|always *was born* or *were born*, never *borned*|总是说 *was born* 或 *were born*，没有 *borned*
    `,
  },
});

const events = vocabularyTopic({
  id: "a2-words-events",
  title: t("Things That Happen", "发生的事"),
  summary: t(
    "Happen, plan, decide, forget, remember, lose, win, break, catch, drop and hurry, and events.",
    "happen、plan、decide、forget、remember、lose、win、break、catch、drop、hurry 和 event。",
  ),
  intro: t(
    "On sports day, I **hurried** to the field, **caught** the ball in the last minute and helped our team **win**, but then I **dropped** my medal in the mud! These words help you tell what happened, what you decided and what went wrong.",
    "运动会那天，我 **hurried**（匆匆）赶到操场，在最后一分钟 **caught**（接住）了球，帮我们队 **win**（赢）了比赛，可接着我把奖牌 **dropped**（掉）进了泥里！这些词帮你讲述发生了什么、你做了什么决定，以及出了什么差错。",
  ),
  prerequisites: ["a2-words-past-time"],
  words: [
    word(
      "happen happens happened happening",
      "to take place",
      "发生",
      "What {happened}? Why are you crying?|decided planned | The story {happened} a long time ago.|decided planned | Strange things {happen} in this house.",
      "decide plan",
    ),
    word(
      "event events",
      "something important or interesting that happens",
      "事件；活动",
      "The school sports day is a big {event}: everyone comes to watch. | The festival is the biggest {event} of the year in our town. | There are many {events} at the library this month, like talks and games.|plans accidents",
      "plan accident",
    ),
    word(
      "plan plans planned planning",
      "to think about what you will do and how; an idea of what you will do",
      "计划",
      "We {planned} a picnic for Saturday.|happened hurried | What are your {plans} for the summer?|events accidents | Let's {plan} our trip together: where to go, and what to do each day.",
      "happen hurry",
    ),
    word(
      "decide decides decided deciding",
      "to choose what to do after thinking",
      "决定",
      "We {decided} to go to the beach after we thought about it for a while.|happened hurried | I can't {decide} which dress to buy. | After thinking about it, she {decided} to learn the piano.|happened hurried",
      "happen hurry",
    ),
    word(
      "forget forgets forgot forgotten forgetting",
      "to not remember",
      "忘记",
      "I {forgot} my keys at home, so I couldn't open the office door.|remembered lost | Don't {forget} to take your umbrella. It's raining! | Sorry, I {forgot} your birthday!|remembered lost",
      "remember lose",
    ),
    word(
      "remember remembers remembered remembering",
      "to keep in your mind; to bring back to your mind",
      "记得；想起",
      "Do you {remember} my name? We met last year. | I {remember} my first day at school very well. | {Remember} to close the window!",
      "forget lose",
    ),
    word(
      "lose loses lost losing",
      "to not have something any more; to not win",
      "丢失；输",
      "I {lost} my bag on the bus.|won caught | Our team {lost} the game, 0 to 3.|won caught | Don't {lose} your ticket, or you can't get on the train!",
      "win catch",
    ),
    word(
      "win wins won winning",
      "to be first or best in a game or race",
      "赢",
      "Who {won} the race and got the gold medal?|lost caught | Our team {won} the game, 3 to 0.|lost caught | I hope we {win} tomorrow!",
      "lose catch",
    ),
    word(
      "break breaks broke broken breaking",
      "to make something go into pieces or stop working",
      "打破；弄坏",
      "Be careful! Don't {break} the glass into pieces. | My phone is {broken}. It doesn't work.|caught won | He fell and {broke} his arm.|caught won",
      "catch win",
    ),
    word(
      "catch catches caught catching",
      "to take and hold something that is moving; to get on a bus or train",
      "接住；赶上",
      "{Catch} the ball with both hands! | We {caught} the last bus home.|won broke | The cat {caught} a mouse.|won broke",
      "win break",
    ),
    word(
      "drop drops dropped dropping",
      "to let something fall",
      "掉下；使落下",
      "I {dropped} my phone, and now the screen is broken.|caught won | Don't {drop} the eggs! | She {dropped} her ice cream on the floor.|caught won",
      "catch win",
    ),
    word(
      "hurry hurries hurried hurrying",
      "to do something or go somewhere quickly",
      "赶快；匆忙",
      "{Hurry} up! The bus is coming! | We {hurried} to the station.|dropped happened | There's lots of time. Don't {hurry}.",
      "drop happen",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Win* and *lose* are opposites in a game: you *win* when your team scores more, and you *lose* when the other team does. Read the score or the medal in the sentence before you choose.",
        "*win* 和 *lose* 在比赛中意思相反：自己队得分多是 *win*，对方得分多是 *lose*。先看句子里的比分或奖牌，再作选择。",
      ),
      meaning: t(
        "*Forget* and *lose* are different: you *forget* something when it goes out of your mind, like a birthday or your keys at home, and you *lose* a thing, like a bag or a ticket, when you cannot find it any more.",
        "*forget* 和 *lose* 不一样：*forget* 是忘记，比如忘了生日或把钥匙落在家里；*lose* 是丢失，比如包或票找不到了。",
      ),
      spell: t(
        "*Forget*, *win* and *catch* are irregular: *forgot*, *won* and *caught*, never *forgetted*, *winned* or *catched*.",
        "*forget*、*win* 和 *catch* 是不规则动词，过去式是 *forgot*、*won* 和 *caught*，不能写成 *forgetted*、*winned* 或 *catched*。",
      ),
    },
    notes: `
      happen|crying;a story long ago;strange things in a house|happen means to take place; decide means to choose after thinking|happen 是发生；decide 是想好后决定|decide/decided=decide means a person chooses after thinking, and a story or a thing cannot decide=decide 是人想好后作选择，故事或事情不会作决定;plan/planned=plan means a person thinks about what to do, and a story or a thing cannot plan=plan 是人考虑要做什么，故事或事情不会计划|What happened? · happen a long time ago|the double p: hap · pen|双写 p：hap · pen
      event|everyone watching sports day;the biggest thing in a town's year;talks and games at a library|an event is something important that happens; a plan is an idea of what you will do|event 是重要的活动或事件；plan 是打算|plan/plans=plan is an idea of what someone will do, not something big that people come to watch or take part in=plan 是某人的打算，不是大家来看、来参加的大活动;accident/accidents=accident is something bad that happens by chance, not a big day people look forward to=accident 是偶然发生的坏事，不是大家盼望的大日子|a big event · events at the library|e · vent, with the stress on -vent|e · vent，重音在 -vent
      plan|a picnic for Saturday;the summer;a trip together|you plan what you will do; things happen without anyone planning them|plan 是计划；happen 是发生|happen/happened=happen means to take place, and nobody can happen a picnic or a trip=happen 是发生，不能“发生”一次野餐或旅行;hurry/hurried=hurry means doing something quickly, not thinking about what you will do and how=hurry 是赶快，不是考虑要做什么、怎么做;event/events=event is something that happens, not an idea of what you will do=event 是发生的活动，不是你的打算;accident/accidents=accident is something bad that happens by chance, not an idea of what you will do=accident 是偶然发生的坏事，不是你的打算|plan a trip · plans for the summer|the n doubles: planned, planning|n 要双写：planned、planning
      decide|thinking for a while about the beach;choosing a dress;thinking about the piano|you decide when you choose after thinking; things happen by themselves|decide 是想好后选择；happen 是事情自己发生|happen/happened=happen means to take place by itself, not to choose after thinking=happen 是自己发生，不是想好后选择;hurry/hurried=hurry means doing something quickly, not choosing after thinking=hurry 是赶快，不是想好后选择|decide to go · can't decide which|c said like s, and d before -ide: de · cide|c 读作 s：de · cide
      forget|keys left at home;rain and an umbrella;a birthday|forget means to not remember; lose means to not be able to find a thing|forget 是忘记；lose 是丢失|remember/remembered=remember means keeping something in your mind, the opposite of forget=remember 是记得，和 forget 意思相反;lose/lost=lose means you cannot find a thing any more, not that it went out of your mind=lose 是东西找不到了，不是忘记|forget your keys · forget to take|the past is *forgot*, and the t doubles in *forgetting*|过去式是 *forgot*，*forgetting* 双写 t
      remember|a name from last year;a first day at school;closing the window|remember means to keep in your mind; forget means to not remember|remember 是记得；forget 是忘记|forget=forget means not keeping something in your mind, the opposite of remember=forget 是忘记，和 remember 意思相反;lose=lose means not being able to find a thing, not keeping something in your mind=lose 是丢东西，不是记在心里|remember to close · remember my name|re · mem · ber, with -ber at the end|re · mem · ber，结尾是 -ber
      lose|a bag on a bus;a score of 0 to 3;a ticket for a train|lose means to not have something any more, or to not win; win is the opposite|lose 是丢失或输掉；win 意思相反|win/won=win means being first or scoring more, not losing a thing or scoring less=win 是第一名或得分多，不是丢东西或得分少;catch/caught=catch means taking and holding something moving, not losing it=catch 是接住移动的东西，不是丢失|lose a game · lose your ticket|one o, not *loose*: lose, lost|只有一个 o，不是 *loose*：lose、lost
      win|a gold medal;3 to 0;hoping for tomorrow|win means to be first or score more; lose is the opposite|win 是赢；lose 是输|lose/lost=lose means scoring less or not being first, the opposite of win=lose 是得分少或没得第一，和 win 意思相反;catch/caught=catch means taking and holding something moving, not being first in a game or race=catch 是接住移动的东西，不是比赛得第一|win a race · win the game|the past is *won*, said like *one*|过去式是 *won*，读音和 *one* 一样
      break|a glass in pieces;a phone that doesn't work;an arm after a fall|break means to make something go into pieces or stop working; catch means to take and hold|break 是打破、弄坏；catch 是接住|catch/caught=catch means taking and holding something moving, not making it go into pieces or stop working=catch 是接住移动的东西，不是把它打碎或弄坏;win/won=win means being first in a game, not making something go into pieces=win 是比赛得第一，不是把东西打碎|break the glass · broken phone|*broke*, then *broken*|过去式 *broke*，过去分词 *broken*
      catch|a ball and both hands;the last bus home;a cat and a mouse|catch means to take and hold something moving, or to get on a bus; win means to be first|catch 是接住或赶上；win 是赢|win/won=win means being first in a game or race, not taking and holding a ball or a mouse=win 是比赛得第一，不是接住球或抓住老鼠;break/broke=break means making something go into pieces, not taking and holding it=break 是把东西打碎，不是接住它|catch the ball · catch a bus|tch at the end, and the past is *caught*|结尾是 tch，过去式是 *caught*
      drop|a broken screen;eggs;ice cream on the floor|drop means to let something fall; catch means to take and hold it|drop 是失手掉下；catch 是接住|catch/caught=catch means taking and holding something, the opposite of letting it fall=catch 是接住东西，和让它掉下去正相反;win/won=win means being first in a game, not letting something fall=win 是比赛得第一，不是让东西掉下去|drop the eggs · drop it on the floor|the p doubles: dropped, dropping|p 要双写：dropped、dropping
      hurry|a bus coming;going quickly to a station;having lots of time|hurry means to go or do something quickly; drop means to let something fall|hurry 是赶快；drop 是失手掉下|drop/dropped=drop means letting something fall, not going quickly=drop 是让东西掉下去，不是赶快走;happen/happened=happen means to take place, and a person cannot happen to a station=happen 是发生，人不能“发生”到车站|Hurry up! · hurry to the station|the double r, and y becomes ie: hurried|双写 r，y 变 ie：hurried
    `,
  },
});

const weekend = vocabularyTopic({
  id: "a2-words-weekend",
  title: t("The Weekend", "周末"),
  summary: t(
    "Relaxing, resting, spending time, picnics, camping, hiking and galleries, and being bored or interested.",
    "放松、休息、度过时光、野餐、露营、徒步和美术馆，以及无聊和有趣。",
  ),
  intro: t(
    "Last weekend we went **camping** by a lake: we put up our **tent**, had a **picnic** on the grass and went for a long **hike** in the hills. These words help you talk about what you do in your free time and how it feels.",
    "上周末我们去湖边 **camping**（露营）：搭起 **tent**（帐篷），在草地上吃了顿 **picnic**（野餐），还去山里走了很长一段 **hike**（徒步）。这些词帮你谈论空闲时做什么，以及感觉怎么样。",
  ),
  prerequisites: ["a2-words-events"],
  words: [
    word(
      "relax relaxes relaxed relaxing",
      "to rest and not worry",
      "放松",
      "On Sunday I {relax} at home and read. | Take a deep breath and {relax}. | We {relaxed} by the pool all afternoon, lying in the sun.|camped hiked",
      "camp hike",
      "rest",
    ),
    word(
      "spend spends spent spending",
      "to use time or money",
      "度过；花费",
      "We {spent} the weekend at Grandma's.|relaxed rested | How much money did you {spend}? | I {spend} an hour on my homework every day.",
      "relax rest",
    ),
    word(
      "rest rests rested resting",
      "to stop working and relax; time when you do this",
      "休息",
      "You look tired. Sit down and {rest}. | Let's stop walking and have a {rest}.|hike crowd | After the long walk, we {rested} under a tree for ten minutes.|spent camped",
      "spend camp",
      "relax",
    ),
    word(
      "picnic picnics",
      "a meal you eat outside, often in a park",
      "野餐",
      "We had a {picnic} by the river and ate sandwiches on the grass. | Let's take some sandwiches and have a {picnic}! | It rained, so we ate our {picnic} in the car.",
      "tent gallery",
    ),
    word(
      "camp camps camped camping",
      "to sleep outside in a tent",
      "露营",
      "We {camped} in the mountains: we slept in a tent for three nights.|hiked relaxed | Do you like {camping}, sleeping outside in a tent?|hiking relaxing | Last summer we went {camping} in the forest and put up our tent by a river.|hiking relaxing",
      "hike relax",
    ),
    word(
      "tent tents",
      "a small house of cloth that you sleep in outside",
      "帐篷",
      "We slept in a {tent} by the lake. | Our {tent} is big enough for four people to sleep in. | It rained all night, but we were dry in our {tent} by the lake.",
      "picnic gallery",
    ),
    word(
      "hike hikes hiked hiking",
      "to go for a long walk in the country or the mountains; a walk like this",
      "徒步旅行",
      "We {hiked} up the mountain.|rested relaxed | Wear good walking shoes for the {hike}.|picnic crowd | Do you like {hiking}? — Yes, I walk in the hills every weekend.|resting relaxing",
      "rest relax",
    ),
    word(
      "gallery galleries",
      "a building where you can look at paintings and other art",
      "美术馆；画廊",
      "We saw some famous paintings at the {gallery}. | The {gallery} is open from ten to five. | There are many art {galleries} in Paris.|tents crowds",
      "tent crowd",
    ),
    word(
      "crowd crowds",
      "a lot of people together in one place",
      "人群",
      "There was a big {crowd} at the football game. | We couldn't see the singer because of the {crowd}. | {Crowds} of people come to the beach in summer.|Galleries Tents",
      "gallery tent",
    ),
    word(
      "bored",
      "not interested; feeling there is nothing to do",
      "感到无聊的",
      "I'm {bored}. There's nothing to do! | The children felt {bored} in the long meeting. | Are you {bored}? Let's play a game.",
      "boring interesting",
    ),
    word(
      "boring",
      "not interesting",
      "无聊的；乏味的",
      "This film is {boring}. Let's watch another one. | The lesson was so {boring} that I fell asleep. | I don't like {boring} books.",
      "bored interesting",
    ),
    word(
      "interesting",
      "making you want to know more",
      "有趣的",
      "This book is very {interesting}. I can't stop reading it. | The museum was {interesting}, and we learned a lot. | That's a really {interesting} idea: tell me more!",
      "boring bored",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Bored* and *boring* look alike: a person feels *bored*, and the film, the lesson or the book that makes them feel that way is *boring*. Ask whether the gap describes a person or a thing.",
        "*bored* 和 *boring* 长得很像：人感到 *bored*（无聊的），让人觉得无聊的电影、课或书是 *boring*（乏味的）。想想空格描述的是人还是事物。",
      ),
      meaning: t(
        "*Camp* and *hike* are both things you do outside: you *camp* when you sleep in a tent, and you *hike* when you take a long walk in the hills or the mountains.",
        "*camp* 和 *hike* 都是户外活动：*camp* 是睡在帐篷里，*hike* 是在山里长途步行。",
      ),
      spell: t(
        "*Gallery* has a double l and ends in -ery, with the plural *galleries*; *picnic* ends in c, but *picnicking* adds a k.",
        "*gallery* 双写 l，以 -ery 结尾，复数是 *galleries*；*picnic* 以 c 结尾，但 *picnicking* 要加 k。",
      ),
    },
    notes: `
      relax|staying home and reading;a deep breath;lying by a pool|you relax when you rest and stop worrying; you camp when you sleep in a tent|relax 是放松休息；camp 是睡帐篷露营|camp/camped=camp means sleeping outside in a tent, not resting at home, by a pool or with a deep breath=camp 是睡在户外帐篷里，不是在家、泳池边休息或深呼吸放松;hike/hiked=hike means taking a long walk in the hills, the opposite of resting=hike 是在山里长途步行，和休息正相反|relax at home · relax by the pool|-ax at the end, said like *ks*|结尾 -ax 读作 *ks*
      spend|a weekend at Grandma's;money;an hour on homework|you spend time or money; you relax when you rest|spend 是花时间或花钱；relax 是放松|relax/relaxed=relax means resting, and it cannot take *the weekend*, *money* or *an hour* after it=relax 是休息，后面不能直接接 *the weekend*、*money*、*an hour*;rest/rested=rest means stopping work, and it cannot take *the weekend*, *money* or *an hour* after it=rest 是停下休息，后面不能直接接 *the weekend*、*money*、*an hour*|spend money · spend the weekend|the past is *spent*, not *spended*|过去式是 *spent*，不是 *spended*
      rest|being tired;stopping walking;ten minutes under a tree|you rest when you stop and relax; you spend time or money|rest 是停下休息；spend 是花时间或钱|spend/spent=spend means using time or money, and it needs something after it like *an hour*=spend 是花时间或钱，后面要接 *an hour* 这类词;camp/camped=camp means sleeping outside in a tent for the night, not stopping for a short time=camp 是在户外帐篷里过夜，不是停下来歇一会儿;hike=hike is a long walk, the opposite of stopping to rest=hike 是长途步行，和停下休息正相反;crowd=crowd is a lot of people in one place, not a short time when you stop=crowd 是一大群人，不是停下来歇一会儿|have a rest · sit down and rest|-st at the end|结尾是 -st
      picnic|sandwiches on the grass;taking sandwiches;eating in the car|a picnic is a meal outside; a tent is a cloth house you sleep in|picnic 是户外野餐；tent 是睡觉的帐篷|tent=tent is a small cloth house you sleep in, not a meal you eat=tent 是睡觉的布帐篷，不是吃的饭;gallery=gallery is a building with paintings, not a meal you eat=gallery 是放画的美术馆，不是吃的饭|have a picnic|pic + nic, with c at both ends|pic + nic，两头都是 c
      camp|three nights in a tent;sleeping outside;putting up a tent|you camp when you sleep in a tent; you hike when you walk a long way|camp 是睡帐篷露营；hike 是长途步行|hike/hiked/hiking=hike means walking a long way in the hills, not sleeping in a tent=hike 是在山里长途步行，不是睡帐篷;relax/relaxed/relaxing=relax means resting and not worrying, and it says nothing about a tent=relax 是放松休息，和帐篷无关|go camping · camp in the mountains|-mp at the end|结尾是 -mp
      tent|sleeping by a lake;four people sleeping;a rainy night by a lake|a tent is a cloth house you sleep in; a picnic is a meal outside|tent 是睡觉的帐篷；picnic 是户外野餐|picnic=picnic is a meal you eat outside, not a cloth house you sleep in=picnic 是户外吃的饭，不是睡觉的布帐篷;gallery=gallery is a building with paintings, not a cloth house you sleep in by a lake=gallery 是放画的建筑，不是湖边睡觉的布帐篷|put up a tent · sleep in a tent|e said like short e, and -nt at the end|e 读短元音 e，结尾是 -nt
      hike|climbing a mountain;good walking shoes;walking in the hills|a hike is a long walk in the country; a rest is a stop|hike 是长途步行；rest 是停下休息|rest/rested/resting=rest means stopping and relaxing, the opposite of walking a long way=rest 是停下休息，和长途步行正相反;relax/relaxed/relaxing=relax means resting and not worrying, the opposite of walking up a mountain=relax 是放松休息，和爬山步行正相反;picnic=picnic is a meal outside, not a long walk you need good shoes for=picnic 是户外野餐，不是要穿好鞋的长途步行;crowd=crowd is a lot of people, not a long walk=crowd 是一大群人，不是长途步行|go hiking · hike up the mountain|i that says its name before the silent e|不发音的 e 前面，i 读字母本音
      gallery|famous paintings;opening hours;art in Paris|a gallery is a building with art; a crowd is a lot of people|gallery 是美术馆；crowd 是一大群人|tent=tent is a small cloth house for sleeping, not a building with paintings=tent 是睡觉的小布帐篷，不是放画的建筑;crowd=crowd is a lot of people together, not a building with paintings=crowd 是聚在一起的一大群人，不是放画的建筑|an art gallery|the double l, and -ery at the end|双写 l，结尾是 -ery
      crowd|a football game;not being able to see a singer;people at the beach in summer|a crowd is a lot of people together; a gallery is a building|crowd 是一大群人；gallery 是建筑|gallery=gallery is a building with paintings, not a lot of people together=gallery 是放画的建筑，不是一大群人;tent=tent is a small cloth house, not a lot of people together=tent 是小布帐篷，不是一大群人|a big crowd · crowds of people|ow said like *now*|ow 和 *now* 里的一样
      bored|nothing to do;a long meeting;wanting to play a game|bored is how a person feels; boring describes the thing|bored 描述人的感受；boring 描述事物|boring=boring describes a thing like a film or a lesson, not how a person feels=boring 描述电影、课这类事物，不描述人的感受;interesting=interesting means making you want to know more, the opposite of feeling there is nothing to do=interesting 是让人想多了解，和觉得无事可做正相反|I'm bored · feel bored|-ed at the end for the feeling|表示感受的结尾是 -ed
      boring|watching another film;falling asleep in a lesson;books I don't like|boring describes a thing; bored describes a person|boring 描述事物；bored 描述人|bored=bored describes how a person feels, not a film, a lesson or a book=bored 描述人的感受，不描述电影、课或书;interesting=interesting describes something you want to know more about, the opposite of boring=interesting 描述让人想多了解的东西，和 boring 意思相反|a boring film · so boring that|-ing at the end for the thing|表示事物的结尾是 -ing
      interesting|a book I can't stop reading;learning a lot in a museum;wanting to hear more|interesting means making you want to know more; boring is the opposite|interesting 是有趣、让人想多了解；boring 意思相反|boring=boring means not interesting, the opposite of making you want to know more=boring 是乏味，和让人想多了解正相反;bored=bored describes how a person feels, not a book, a museum or an idea=bored 描述人的感受，不描述书、博物馆或想法|very interesting · an interesting idea|in · ter · est · ing, with the middle e often quiet|in · ter · est · ing，中间的 e 常常读得很轻
    `,
  },
});

const useful = vocabularyTopic({
  id: "a2-words-useful-words",
  title: t("Useful Words", "常用词"),
  summary: t(
    "Important, reason, moment, follow, possible and impossible, able, whole, side, sentence, example and difference.",
    "important、reason、moment、follow、possible 和 impossible、able、whole、side、sentence、example 和 difference。",
  ),
  intro: t(
    'Our teacher said, "It\'s **important** to read the rules, and **follow** them. If something is not clear, ask for an **example**, and tell me the **reason** for any question." These words help you explain, give reasons and say what can and cannot be done.',
    "老师说：“读规则是很 **important**（重要的），还要 **follow**（遵守）它们。哪里不清楚，就请人举个 **example**（例子）；有什么问题，告诉我 **reason**（原因）。”这些词帮你解释、说明理由，以及说出什么能做、什么不能做。",
  ),
  prerequisites: ["a2-words-weekend"],
  words: [
    word(
      "important",
      "that matters a lot",
      "重要的",
      "It's {important} to drink water every day, because your body needs it. | This test really matters, so study hard: it's very {important}. | Sleep is very {important} for children.",
      "possible impossible",
    ),
    word(
      "reason reasons",
      "why something happens or why you do something",
      "原因；理由",
      "What's the {reason} for your call? | Tell me the {reason} why you were late. | There's no {reason} to be scared.",
      "moment example",
    ),
    word(
      "moment moments",
      "a very short time",
      "片刻；时刻",
      "Wait a {moment}, please. | At that {moment}, the phone rang. | I'm busy at the {moment}. Can I call you later?",
      "reason side",
    ),
    word(
      "follow follows followed following",
      "to go after someone or something; to do what something says",
      "跟随；遵循",
      "{Follow} me. I'll show you the way.|Catch Forget | The dog {followed} us home.|caught forgot | Please {follow} the rules of the game.",
      "catch forget",
    ),
    word(
      "possible",
      "that can happen or be done",
      "可能的",
      "The water is safe, so it's {possible} to swim here. | Come as soon as {possible}. | Take an umbrella: it's {possible} that it will rain later.",
      "impossible important",
    ),
    word(
      "impossible",
      "that cannot happen or be done",
      "不可能的",
      "It's {impossible} to see the stars tonight. There are too many clouds. | I can't do this puzzle. It's {impossible}! | It's {impossible} to run 100 km in an hour.",
      "possible important",
    ),
    word(
      "able",
      "can do something",
      "能够",
      "Will you be {able} to come to my party? | She was {able} to swim when she was four. | I wasn't {able} to sleep because of the noise.",
      "possible important",
    ),
    word(
      "whole",
      "all of something",
      "整个的",
      "I ate the {whole} cake by myself! | We stayed at home the {whole} day, from morning to night. | The {whole} class, all forty students, went to the zoo.",
      "important possible",
    ),
    word(
      "side sides",
      "the left or right part of something; one of the flat parts of something",
      "边；侧面",
      "Drive on the right {side} of the road. | A box has six {sides}.|reasons moments | Come and sit by my {side}.",
      "reason moment",
    ),
    word(
      "sentence sentences",
      "a group of words that starts with a capital letter and ends with a period",
      "句子",
      "Read the {sentence} on the board aloud: it has six words. | This {sentence} has five words. | Start every {sentence} with a capital letter and end it with a period.",
      "word example",
    ),
    word(
      "example examples",
      "something that shows what other things of its kind are like",
      "例子",
      "Can you give me one {example} of a fruit? — An apple. | Apples and pears, for {example}, are fruits. | The teacher did number one on the board, and we used the {example} to do the rest.",
      "sentence reason",
    ),
    word(
      "difference differences",
      "the way two things are not the same",
      "差别；不同",
      "What's the {difference} between a lake and a sea? | I can't see any {difference} between the two pictures. | There's a big {difference} in age between me and my cousin.",
      "reason example",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Possible* and *able* both talk about what can be done: *possible* describes a thing, as in *it's possible to swim here*, and *able* describes a person, as in *she was able to swim*. Look at who or what comes before the gap.",
        "*possible* 和 *able* 都说能不能做：*possible* 形容事情，如 *it's possible to swim here*；*able* 形容人，如 *she was able to swim*。看空格前面是人还是事情。",
      ),
      meaning: t(
        "*Reason*, *example* and *difference* each answer a different question: a *reason* answers *why?*, an *example* shows what things of one kind are like, and a *difference* answers *how are they not the same?*",
        "*reason*、*example* 和 *difference* 各回答不同的问题：*reason* 回答“为什么”，*example* 说明一类东西是什么样的，*difference* 回答“哪里不一样”。",
      ),
      spell: t(
        "*Impossible* is im- + *possible*, with a double s: im · pos · si · ble. *Whole* has a silent w and sounds like *hole*.",
        "*impossible* 是 im- 加 *possible*，双写 s：im · pos · si · ble。*whole* 里的 w 不发音，读音和 *hole* 一样。",
      ),
    },
    notes: `
      important|a body needing water;a test that really matters;sleep for children|important means it matters a lot; possible means it can happen|important 是很重要；possible 是可能发生|possible=possible means that something can happen or be done, not that it matters a lot=possible 是能发生、能做到，不是很重要;impossible=impossible means that something cannot happen or be done, not that it matters a lot=impossible 是不能发生、做不到，不是很重要|It's important to · an important test|im · por · tant, with -ant at the end|im · por · tant，结尾是 -ant
      reason|a phone call;being late;nothing to be scared of|a reason answers *why?*; a moment is a short time|reason 回答“为什么”；moment 是片刻|moment=moment is a very short time, and it does not answer *why?*=moment 是片刻，不回答“为什么”;example=example shows what things of one kind are like, and it does not answer *why?*=example 说明一类东西是什么样的，不回答“为什么”|the reason for · no reason to|ea for the long e, and s said like z|ea 发长 e 音，s 读作 z
      moment|waiting a little;the phone ringing just then;being busy now|a moment is a very short time; a reason answers *why?*|moment 是片刻；reason 回答“为什么”|reason=reason answers *why?*, not a very short time=reason 回答“为什么”，不是片刻;side=side is the left or right part of something, not a short time=side 是左边或右边，不是片刻|Wait a moment · at the moment|mo · ment, with o that says its name|mo · ment，o 读字母本音
      follow|being shown the way;a dog walking behind us home;the rules of a game|follow means to go after someone or do what something says; catch means to take and hold|follow 是跟随或遵守；catch 是接住|catch/caught=catch means taking and holding something moving, not going after someone or doing what rules say=catch 是接住移动的东西，不是跟着走或照规则做;forget/forgot=forget means not remembering, not going after someone or doing what rules say=forget 是忘记，不是跟着走或照规则做|follow me · follow the rules|the double l, and -ow at the end|双写 l，结尾是 -ow
      possible|safe water;as soon as you can;an umbrella for later|possible means it can happen or be done; impossible means it cannot|possible 是可能；impossible 是不可能|impossible=impossible means that something cannot happen or be done, the opposite of possible=impossible 是不可能，和 possible 意思相反;important=important means that something matters a lot, not that it can happen=important 是很重要，不是能发生|as soon as possible · it's possible that|the double s: pos · si · ble|双写 s：pos · si · ble
      impossible|stars behind too many clouds;a puzzle I can't do;running 100 km in an hour|impossible means it cannot happen; possible means it can|impossible 是不可能；possible 是可能|possible=possible means that something can happen or be done, the opposite of impossible=possible 是可能，和 impossible 意思相反;important=important means that something matters a lot, not that it cannot happen=important 是很重要，不是不可能|It's impossible to|im- before p, never in-|p 前面用 im-，不用 in-
      able|coming to a party;swimming at four;sleeping through a noise|able says that a person can do something; possible says that a thing can happen|able 说人能做某事；possible 说事情可能发生|possible=possible describes a thing that can happen, as in *it is possible*, not a person who can do something=possible 形容可能发生的事，如 *it is possible*，不形容能做某事的人;important=important means that something matters a lot, not that a person can do something=important 是很重要，不是人能做某事|be able to|always *be able to*: a · ble|总是 *be able to*：a · ble
      whole|a cake eaten alone;from morning to night;all forty students|whole means all of something; important means it matters|whole 是全部、整个；important 是重要|important=important means that something matters a lot, not all of something=important 是很重要，不是全部;possible=possible means that something can happen, not all of something=possible 是可能，不是全部|the whole day · the whole class|a silent w: whole, said like *hole*|w 不发音：whole 读作 *hole*
      side|the right of a road;six on a box;sitting next to me|a side is the left or right part, or a flat part; a reason answers *why?*|side 是边或面；reason 回答“为什么”|reason=reason answers *why?*, not a part of a road, a box or a place next to you=reason 回答“为什么”，不是路边、盒子的面或你身边的位置;moment=moment is a very short time, not a part of something=moment 是片刻，不是东西的一部分|the right side · by my side|i that says its name before the silent e|不发音的 e 前面，i 读字母本音
      sentence|reading the board aloud;five words;a capital letter and a period|a sentence is a group of words; a word is one of them|sentence 是一组词构成的句子；word 是其中一个词|word=word is one part of a sentence, so it cannot have words in it or end with a period=word 是句子里的一个词，里面不能有好几个词，也不以句号结尾;example=example shows what things of one kind are like, not a group of words that starts with a capital letter=example 说明一类东西是什么样的，不是以大写字母开头的一组词|write a sentence|sen · tence, with -ence at the end|sen · tence，结尾是 -ence
      example|an apple as a fruit;apples and pears;number one on the board|an example shows what things of one kind are like; a sentence is a group of words|example 说明一类东西是什么样的；sentence 是句子|sentence=sentence is a group of words ending with a period, not something that shows what others of its kind are like=sentence 是以句号结尾的一组词，不是说明同类东西的例子;reason=reason answers *why?*, not something that shows what others of its kind are like=reason 回答“为什么”，不是说明同类东西的例子|for example · give an example|x said like *gz*: ex · am · ple|x 读作 *gz*：ex · am · ple
      difference|a lake and a sea;two pictures;age between cousins|a difference is how two things are not the same; a reason answers *why?*|difference 是不同之处；reason 回答“为什么”|reason=reason answers *why?*, not how two things are not the same=reason 回答“为什么”，不是两样东西哪里不同;example=example shows what things of one kind are like, not how two things are not the same=example 说明同类东西是什么样的，不是两样东西哪里不同|the difference between|the double f, and -ence at the end|双写 f，结尾是 -ence
    `,
  },
});

// The past simple of regular verbs.

/** regulars are a verb, its past form, the rest of a sentence and a likely misspelling of the past. */
const regulars: readonly (readonly [verb: string, past: string, rest: string, misspelt: string])[] = [
  ["play", "played", "football in the park", "plaied"],
  ["visit", "visited", "our grandparents", "visitted"],
  ["stop", "stopped", "at a cafe", "stoped"],
  ["study", "studied", "for the English test", "studyed"],
  ["dance", "danced", "in the school show", "danceed"],
  ["watch", "watched", "a film at home", "watchd"],
  ["carry", "carried", "the bags to the car", "carryed"],
  ["plan", "planned", "a picnic by the river", "planed"],
  ["cook", "cooked", "noodles for the family", "cookd"],
  ["hurry", "hurried", "to the station", "hurryed"],
  ["clean", "cleaned", "the kitchen", "cleant"],
  ["arrive", "arrived", "home at six", "arriveed"],
  ["walk", "walked", "to the lake", "walkt"],
  ["drop", "dropped", "a glass in the kitchen", "droped"],
  ["stay", "stayed", "at home all day", "staied"],
  ["help", "helped", "Grandma in the garden", "helpt"],
  ["try", "tried", "a new game", "tryed"],
];

const pastSubjects: readonly string[] = ["I", "We", "Tom", "My parents", "Lily", "They", "She", "My cousin", "He", "Ben", "Anna"];
const pastTimes: readonly string[] = ["Yesterday", "Last Saturday", "Last night", "Two days ago", "On Sunday", "Last week", "This morning"];

/** inner writes a subject inside a sentence: names and I keep their capital. */
const inner = (subject: string): string =>
  /^(I|Tom|Lily|Ben|Anna|Sam|Grandma)$/u.test(subject) ? subject : subject.charAt(0).toLowerCase() + subject.slice(1);

const regularRows = everyTriple(pastSubjects, regulars, pastTimes);

const regularChoiceBank: readonly ChoiceItem[] = regularRows.map(
  ([subject, [verb, past, rest, misspelt], time]): ChoiceItem => [
    `${time}, ${inner(subject)} ___ ${rest}. (${verb})`,
    past,
    [verb, misspelt],
  ],
);

const regularTypedBank: readonly TypedItem[] = regularRows.map(
  ([subject, [verb, past, rest, misspelt], time]): TypedItem => ({
    shown: `${time}, ${inner(subject)} ___ ${rest}. (${verb})`,
    accepted: [past],
    wrong: [verb, misspelt],
  }),
);

const regularFixBank: readonly TypedItem[] = regularRows.map(([subject, [verb, past, rest], time]): TypedItem => {
  const present = ["I", "We", "My parents", "They"].includes(subject)
    ? verb
    : verb === "watch"
      ? "watches"
      : /[^aeiou]y$/u.test(verb)
        ? `${verb.slice(0, -1)}ies`
        : `${verb}s`;
  return {
    shown: `${time}, ${inner(subject)} ${present} ${rest}.`,
    accepted: [`${time}, ${inner(subject)} ${past} ${rest}.`],
    wrong: [`${time}, ${inner(subject)} ${present} ${rest}.`],
  };
});

/** bracketVerb is the verb in brackets at the end of a gapped sentence. */
const bracketVerb = (shown: string): string => /\((\w+)\)$/u.exec(shown)?.[1] ?? "";

/** timeOf is the time phrase that starts a sentence in the past. */
const timeOf = (shown: string): string => shown.split(",")[0] ?? "";

/** regularRule names the spelling rule that makes the past of a regular verb. */
const regularRule = (verb: string, past: string): Text => {
  if (verb.endsWith("e")) return t(`*${verb}* ends in *e*, so it adds only *-d*`, `*${verb}* 以 *e* 结尾，所以只加 *-d*`);
  if (past.endsWith("ied"))
    return t(
      `*${verb}* ends in a consonant and *y*, so the *y* becomes *i* before *-ed*`,
      `*${verb}* 以辅音字母加 *y* 结尾，所以把 *y* 变成 *i* 再加 *-ed*`,
    );
  if (past.length === verb.length + 3)
    return t(
      `*${verb}* ends in one short vowel and one consonant, so the consonant doubles before *-ed*`,
      `*${verb}* 以一个短元音加一个辅音字母结尾，所以双写辅音字母再加 *-ed*`,
    );
  if (verb.endsWith("y"))
    return t(
      `*${verb}* ends in a vowel and *y*, so it keeps the *y* and adds *-ed*`,
      `*${verb}* 以元音字母加 *y* 结尾，保留 *y* 直接加 *-ed*`,
    );
  return t(`*${verb}* is a regular verb that just adds *-ed*`, `*${verb}* 是直接加 *-ed* 的规则动词`);
};

/** regularWhy explains the past form in the gap of shown. */
const regularWhy = (right: string, shown: string): Text => {
  const verb = bracketVerb(shown);
  const rule = regularRule(verb, right);
  return t(
    `*${timeOf(shown)}* is in the past, and ${rule.en}: ${fill(shown, right)}\n\n**Check.** Verify the ending of *${verb}* → *${right}*: it fits the spelling rule and matches the past time phrase *${timeOf(shown)}*.`,
    `*${timeOf(shown)}* 表示过去，${rule["zh-CN"]}：${fill(shown, right)}\n\n**检验。** 核对 *${verb}* → *${right}* 的词尾变化：既符合拼写规则，也与句首的过去时间 *${timeOf(shown)}* 一致。`,
  );
};

/** whyNotRegular explains the present form or a misspelt past of a regular verb. */
const whyNotRegular = (wrong: string, right: string, shown: string, position: number): Text => {
  if (position === 0)
    return t(
      `*${wrong}* is the present form, but *${timeOf(shown)}* places the action in the past.`,
      `*${wrong}* 是现在时的形式，可 *${timeOf(shown)}* 说明动作发生在过去。`,
    );
  const rule = regularRule(bracketVerb(shown), right);
  return t(`*${wrong}* is spelt wrong: ${rule.en}.`, `*${wrong}* 拼错了：${rule["zh-CN"]}。`);
};

const pastSimpleRegular: TopicDef = {
  id: "past-simple-regular",
  title: t("The Past Simple: Regular Verbs", "一般过去时：规则动词"),
  summary: t("We played. She visited. Regular verbs add -ed for every person.", "We played. She visited. 规则动词无论主语是谁，都加 -ed。"),
  intro: t(
    "Compare *We walk to school every day* with *Yesterday, we walked to the park*. For a finished past event, regular verbs add *-ed*—and the same past form works for every subject.",
    "比较 *We walk to school every day* 和 *Yesterday, we walked to the park*。表达过去完成的事，规则动词加 *-ed*，而且不管主语是谁，形式都一样。",
  ),
  prerequisites: ["was-and-were", "present-simple"],
  encompasses: [
    { topic: "was-and-were", weight: 0.2 },
    { topic: "present-simple", weight: 0.2 },
  ],
  xp: 20,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("Adding -ed", "加 -ed"),
      t(
        "For something finished in the past, a regular verb adds *-ed*: *play* → *played*, *visit* → *visited*. It is the same for *I*, *she*, *they* and everyone.\n\nSpelling:\n\n- a verb ending in *e* adds only *-d*: *dance* → *danced*\n- a consonant and *y* becomes *-ied*: *study* → *studied*; but *play* → *played*\n- one short vowel and one consonant: double it: *stop* → *stopped*, *plan* → *planned*\n\n> **Watch out.** Do not leave the verb in the present just because the sentence already has a past time word like *yesterday* or *last week*.",
        "表示过去已经完成的事，规则动词加 *-ed*：*play* → *played*，*visit* → *visited*。无论主语是 *I*、*she* 还是 *they*，形式都一样。\n\n拼写：\n\n- 以 *e* 结尾的只加 *-d*：*dance* → *danced*\n- 辅音字母加 *y* 结尾的，变 *y* 为 *i* 再加 *-ed*：*study* → *studied*；但 *play* → *played*\n- 重读闭音节、末尾只有一个辅音字母的，双写再加 *-ed*：*stop* → *stopped*，*plan* → *planned*\n\n> **注意。** 中文用“昨天”“了”表示过去、动词不变，但英语即使句中有 *yesterday* 或 *last week*，动词本身也必须变成过去式。",
      ),
      choiceGenerator(t("Choose the word for the gap.", "选出填入空白处的词。"), regularChoiceBank, regularWhy, whyNotRegular),
    ),
    point(
      "spell",
      t("Spelling the past form", "拼写过去式"),
      t(
        "Type the past form of the verb in brackets. Check the ending before adding *-ed*: an *e* at the end adds only *-d* (*danced*), a consonant and *y* becomes *-ied* (*studied*), one short vowel and one consonant doubles (*stopped*), and a vowel and *y* just adds *-ed* (*played*).\n\n> **Watch out.** Do not double the final letter after a vowel + *y* (*played*, never *playyed*), and do not write *-eed* after silent *-e* (*danced*, never *danceed*).",
        "写出括号里动词的过去式，动笔前先看词尾：以 *e* 结尾只加 *-d*（*danced*），辅音字母加 *y* 变成 *-ied*（*studied*），一个短元音加一个辅音字母要双写（*stopped*），元音字母加 *y* 直接加 *-ed*（*played*）。\n\n> **注意。** 元音加 *y* 结尾不要双写（*played*，不要写成 *playyed*），以不发音 *e* 结尾也不要多加一个 *e*（*danced*，不要写成 *danceed*）。",
      ),
      typedGenerator(
        "word-form",
        t("Type the verb in the past.", "输入动词的过去式。"),
        regularTypedBank,
        regularWhy,
        pastSimpleRegularSpellNot,
      ),
    ),
    point(
      "fix",
      t("Putting the verb in the past", "把动词改成过去式"),
      t(
        "Each sentence starts with a time in the past, but its verb is still in the present: *Yesterday, she visits her aunt.* → *Yesterday, she visited her aunt.* Rewrite the whole sentence with the past form.\n\n> **Watch out.** Drop any present *-s*/*-es* before adding *-ed* (*watches* → *watched*, *studies* → *studied*), and keep the rest of the sentence unchanged.",
        "每个句子开头都是过去的时间，但动词还留在现在时：*Yesterday, she visits her aunt.* → *Yesterday, she visited her aunt.* 用过去式重写整个句子。\n\n> **注意。** 先去掉现在时的 *-s*/*-es* 再变过去式（*watches* → *watched*，*studies* → *studied*），句子的其余部分保持不变。",
      ),
      typedGenerator(
        "sentence",
        t("Fix the sentence.", "改正这个句子。"),
        regularFixBank,
        (right) => {
          const [verb = "", past = ""] = regulars.find(([, p]) => new RegExp(`\\b${p}\\b`, "u").test(right)) ?? [];
          const rule = regularRule(verb, past);
          return t(
            `*${timeOf(right)}* is in the past, so the verb is in the past too, whoever the subject is, and ${rule.en}: ${right}\n\n**Check.** Read the time phrase at the start and the verb (*${past}*): both now point to the past, with no present *-s* left behind.`,
            `*${timeOf(right)}* 表示过去，所以无论主语是谁，动词都用过去式；${rule["zh-CN"]}：${right}\n\n**检验。** 对照句首的时间词和动词 *${past}*：两者现在都指向过去，且没有残留现在时的 *-s*。`,
          );
        },
        pastSimpleRegularFixNot,
      ),
    ),
  ],
};

// The past simple of irregular verbs.

/** irregulars are a verb, its past form, the rest of a sentence and a wrong past made with -ed. */
const irregulars: readonly (readonly [verb: string, past: string, rest: string, made: string])[] = [
  ["go", "went", "to the zoo", "goed"],
  ["see", "saw", "a fox in the garden", "seed"],
  ["buy", "bought", "a new bag", "buyed"],
  ["eat", "ate", "a big bowl of noodles", "eated"],
  ["have", "had", "a bad cold", "haved"],
  ["take", "took", "a lot of photos", "taked"],
  ["make", "made", "a cake for Mom", "maked"],
  ["write", "wrote", "a letter to Grandpa", "writed"],
  ["swim", "swam", "in the sea", "swimmed"],
  ["sleep", "slept", "in a tent", "sleeped"],
  ["meet", "met", "a friend at the station", "meeted"],
  ["lose", "lost", "the key to the house", "losed"],
  ["break", "broke", "a cup in the kitchen", "breaked"],
  ["catch", "caught", "a big fish", "catched"],
  ["win", "won", "the game", "winned"],
  ["ride", "rode", "a bike in the park", "rided"],
  ["tell", "told", "a funny story", "telled"],
  ["leave", "left", "home at eight", "leaved"],
  ["spend", "spent", "an hour at the beach", "spended"],
  ["forget", "forgot", "the tickets", "forgetted"],
  ["come", "came", "home by bus", "comed"],
  ["feel", "felt", "very tired", "feeled"],
  ["drink", "drank", "some hot milk", "drinked"],
];

const irregularRows = everyTriple(pastSubjects.slice(0, 9), irregulars, pastTimes);

const irregularChoiceBank: readonly ChoiceItem[] = irregularRows.map(
  ([subject, [verb, past, rest, made], time]): ChoiceItem => [`${time}, ${inner(subject)} ___ ${rest}. (${verb})`, past, [made, verb]],
);

const irregularTypedBank: readonly TypedItem[] = irregularRows.map(
  ([subject, [verb, past, rest, made], time]): TypedItem => ({
    shown: `${time}, ${inner(subject)} ___ ${rest}. (${verb})`,
    accepted: [past],
    wrong: [made, verb],
  }),
);

/** irregularTable lists the verbs as a table for the explanation. */
const irregularTable = irregulars.map(([verb, past]) => `*${verb}* → *${past}*`).join(", ");

/** irregularWhy explains the irregular past form in the gap of shown. */
const irregularWhy = (right: string, shown: string): Text => {
  const verb = bracketVerb(shown);
  return t(
    `*${timeOf(shown)}* is in the past, and *${verb}* is irregular: its past form is *${right}*, not one made with *-ed*: ${fill(shown, right)}\n\n**Check.** Verify that *${right}* is the irregular past form of *${verb}* (no *-ed* tacked on) and matches *${timeOf(shown)}*.`,
    `*${timeOf(shown)}* 表示过去，而 *${verb}* 是不规则动词，过去式是 *${right}*，不是加 *-ed*：${fill(shown, right)}\n\n**检验。** 确认 *${right}* 是 *${verb}* 的不规则过去式（没有生硬加 *-ed*），并且与 *${timeOf(shown)}* 时态一致。`,
  );
};

/** whyNotIrregular explains a past made with -ed or the present form of an irregular verb. */
const whyNotIrregular = (wrong: string, _right: string, shown: string, position: number): Text => {
  const verb = bracketVerb(shown);
  return position === 0
    ? t(
        `*${wrong}* adds *-ed*, but *${verb}* is irregular and has a past form of its own.`,
        `*${wrong}* 加了 *-ed*，但 *${verb}* 是不规则动词，有自己专门的过去式。`,
      )
    : t(
        `*${wrong}* is the present form, but *${timeOf(shown)}* places the action in the past.`,
        `*${wrong}* 是现在时的形式，可 *${timeOf(shown)}* 说明动作发生在过去。`,
      );
};

const pastSimpleIrregular: TopicDef = {
  id: "past-simple-irregular",
  title: t("The Past Simple: Irregular Verbs", "一般过去时：不规则动词"),
  summary: t(
    "go, went; see, saw; buy, bought. The commonest verbs have past forms of their own.",
    "go → went，see → saw，buy → bought。最常用的动词有自己的过去式。",
  ),
  intro: t(
    "You cannot say *I goed to the beach* or *We eated lunch*. Many of English's most frequent verbs—like *go → went* and *eat → ate*—have their own irregular past forms.",
    "英语不能说 *I goed to the beach* 或 *We eated lunch*。许多最高频的动词（如 *go → went*、*eat → ate*）都有各自的不规则过去式。",
  ),
  prerequisites: ["past-simple-regular"],
  encompasses: [{ topic: "past-simple-regular", weight: 0.3 }],
  xp: 20,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("Past forms of their own", "不规则的过去式"),
      t(
        `Many common verbs do not add *-ed*. Their past forms must be learned one by one: ${irregularTable}.\n\n> **Watch out.** Never add *-ed* to an irregular verb (*goed*, *buyed*, *catched* are all wrong), and do not leave the base form in a past sentence.`,
        `许多常用动词不加 *-ed*，它们的过去式要一个一个地记：${irregularTable}。\n\n> **注意。** 切勿给不规则动词强加 *-ed*（*goed*、*buyed*、*catched* 都是错的），也不要在过去时间句里留着动词原形。`,
      ),
      choiceGenerator(t("Choose the word for the gap.", "选出填入空白处的词。"), irregularChoiceBank, irregularWhy, whyNotIrregular),
    ),
    point(
      "spell",
      t("Writing the past form", "写出过去式"),
      t(
        "Type the past form of the verb in brackets. Each one is irregular, so recall its exact spelling—for example, *go* → *went*, *buy* → *bought*, *catch* → *caught*, *write* → *wrote*.\n\n> **Watch out.** Pay close attention to tricky vowel changes and silent letters (*bought*, *caught*, *slept*, *left*) instead of guessing by sound alone.",
        "写出括号里动词的过去式。它们都是不规则动词，需要准确拼写——例如 *go* → *went*、*buy* → *bought*、*catch* → *caught*、*write* → *wrote*。\n\n> **注意。** 留意元音变化和不发音字母（如 *bought*、*caught*、*slept*、*left*），不要只凭读音猜测拼写。",
      ),
      typedGenerator(
        "word-form",
        t("Type the verb in the past.", "输入动词的过去式。"),
        irregularTypedBank,
        irregularWhy,
        pastSimpleIrregularSpellNot,
      ),
    ),
  ],
};

// Did and didn't.

const didSubjects: readonly (readonly [subject: string, asked: string])[] = [
  ["I", "you"],
  ["We", "you"],
  ["Tom", "Tom"],
  ["My parents", "your parents"],
  ["Lily", "Lily"],
  ["They", "they"],
  ["She", "she"],
  ["He", "he"],
];

const didRows = everyTriple(didSubjects, irregulars, pastTimes);

const negativeChoiceBank: readonly ChoiceItem[] = didRows.map(([[subject], [verb, past, rest], time]): ChoiceItem => {
  const when = time.charAt(0).toLowerCase() + time.slice(1);
  return [
    `${subject} / not / ${verb} ${rest} / ${when}`,
    `${subject} didn't ${verb} ${rest} ${when}.`,
    [`${subject} didn't ${past} ${rest} ${when}.`, `${subject} not ${past} ${rest} ${when}.`],
  ];
});

const negativeTypedBank: readonly TypedItem[] = didRows.map(([[subject], [verb, past, rest], time]): TypedItem => {
  const when = time.charAt(0).toLowerCase() + time.slice(1);
  return {
    shown: `${subject} ${past} ${rest} ${when}.`,
    accepted: [`${subject} [didn't|did not] ${verb} ${rest} ${when}.`],
    canonical: `${subject} didn't ${verb} ${rest} ${when}.`,
    wrong: [`${subject} didn't ${past} ${rest} ${when}.`, `${subject} not ${past} ${rest} ${when}.`],
  };
});

const questionTypedBank: readonly TypedItem[] = didRows.map(([[subject, asked], [verb, past, rest], time]): TypedItem => {
  const when = time.charAt(0).toLowerCase() + time.slice(1);
  return {
    shown: `${subject} ${past} ${rest} ${when}.`,
    accepted: [`Did ${asked} ${verb} ${rest} ${when}?`],
    wrong: [`Did ${asked} ${past} ${rest} ${when}?`, `${subject} ${past} ${rest} ${when}?`],
  };
});

const questionChoiceBank: readonly ChoiceItem[] = didRows.map(([[, asked], [verb, past, rest], time]): ChoiceItem => {
  const when = time.charAt(0).toLowerCase() + time.slice(1);
  return ["", `Did ${asked} ${verb} ${rest} ${when}?`, [`Did ${asked} ${past} ${rest} ${when}?`, `Do ${asked} ${past} ${rest} ${when}?`]];
});

/** didVerb is the irregular verb after did or didn't in a sentence, as its plain form and its past. */
const didVerb = (sentence: string): readonly [verb: string, past: string] => {
  const plain = /(?:didn't|did not|^Did (?:you|Tom|your parents|Lily|they|she|he)) (\w+)/u.exec(sentence)?.[1] ?? "";
  const found = irregulars.find(([verb]) => verb === plain);
  return [plain, found?.[1] ?? ""];
};

/** negativeWhy explains a negative in the past with didn't. */
const negativeWhy = (right: string): Text => {
  const [verb, past] = didVerb(right);
  return t(
    `To say no about the past, put *didn't* before the verb. *Didn't* already shows the past, so *${past}* goes back to *${verb}*: ${right}\n\n**Check.** Verify that *didn't* carries the past tense and the verb right after it (*${verb}*) is in its plain base form.`,
    `否定过去的事，在动词前加 *didn't*。*didn't* 已经表示过去，所以 *${past}* 变回原形 *${verb}*：${right}\n\n**检验。** 确认过去时由 *didn't* 承担，紧跟在后面的动词 *${verb}* 已恢复原形。`,
  );
};

/** whyNotNegative explains a past form after didn't, or not without did. */
const whyNotNegative = (wrong: string, right: string, _shown: string, position: number): Text => {
  const [, past] = didVerb(right);
  return position === 0
    ? t(
        `*${wrong}* keeps *${past}* after *didn't*. The past is shown once, by *didn't*, so the main verb must return to its plain form.`,
        `*${wrong}* 在 *didn't* 后面还保留了过去式 *${past}*。过去只由 *didn't* 表示一次，实义动词要恢复原形。`,
      )
    : t(
        `*${wrong}* uses *not* alone. English needs *didn't* before the verb, followed by the plain verb.`,
        `*${wrong}* 只用了 *not*。英语否定过去要在动词前加 *didn't*，后面接动词原形。`,
      );
};

/** questionWhy explains a question in the past with did. */
const questionWhy = (right: string): Text => {
  const [verb, past] = didVerb(right);
  return t(
    `A question about the past starts with *Did*, then the subject and the plain verb; *Did* shows the past, so *${past}* goes back to *${verb}*: ${right}\n\n**Check.** Check the three parts in order: *Did* at the front, the subject next, then the plain base verb *${verb}* and a question mark.`,
    `询问过去的事，用 *Did* 开头，再接主语和动词原形；*Did* 已经表示过去，所以 *${past}* 变回 *${verb}*：${right}\n\n**检验。** 按顺序核对三处：句首 *Did*、接着主语、然后动词原形 *${verb}* 和句末问号。`,
  );
};

/** whyNotQuestion explains a past form after did, or a question with do. */
const whyNotQuestion = (wrong: string, right: string, _shown: string, position: number): Text => {
  const [, past] = didVerb(right);
  return position === 0
    ? t(
        `*${wrong}* keeps *${past}* after *Did*. The past is shown once, by *Did*, so the main verb must return to its plain form.`,
        `*${wrong}* 在 *Did* 后面还保留了过去式 *${past}*。过去只由 *Did* 表示一次，实义动词要恢复原形。`,
      )
    : t(
        `*${wrong}* starts with *Do*, which asks about the present. A question about the past starts with *Did*, and the verb stays plain.`,
        `*${wrong}* 用 *Do* 开头，问的是现在。询问过去要用 *Did* 开头，后面的动词用原形。`,
      );
};

const pastQuestionsAndNegatives: TopicDef = {
  id: "past-simple-questions-and-negatives",
  title: t("Did and Didn't", "did 和 didn't"),
  summary: t(
    "Did you go? I didn't see it. After did and didn't, the verb goes back to its plain form.",
    "Did you go? I didn't see it. 在 did 和 didn't 后面，动词用原形。",
  ),
  intro: t(
    "In *She bought a map*, the past tense sits on *bought*. When you turn it negative (*She didn't buy a map*) or ask (*Did she buy a map?*), *did* takes over the past tense and *buy* returns to its plain form.",
    "在 *She bought a map* 里，过去时落在 *bought* 上；变成否定（*She didn't buy a map*）或疑问（*Did she buy a map?*）时，由 *did* 承担过去时，实义动词变回原形 *buy*。",
  ),
  prerequisites: ["past-simple-irregular", "present-simple-questions"],
  encompasses: [
    { topic: "past-simple-irregular", weight: 0.4 },
    { topic: "present-simple-questions", weight: 0.3 },
  ],
  xp: 20,
  strand: "grammar",
  knowledgePoints: [
    point(
      "negative",
      t("Didn't and the plain verb", "didn't 加动词原形"),
      t(
        "To say no about the past, put *didn't* (*did not*) before the verb. *Didn't* already shows the past, so the verb goes back to its plain form:\n\n*I went.* → *I didn't go.*\n\n> **Watch out.** Never mark the past twice (*I didn't went* is wrong), and never use *not* without *did* (*I not went* is wrong).",
        "否定过去的事，在动词前加 *didn't*（*did not*）。*didn't* 已经表示过去，所以后面的动词要用原形：\n\n*I went.* → *I didn't go.*\n\n> **注意。** 不要把过去标记两次（*I didn't went* 是错的），也不要像中文“我没去”那样省掉 *did* 只写 *I not went*。",
      ),
      choiceGenerator(t("Which sentence matches the notes?", "哪个句子符合笔记？"), negativeChoiceBank, negativeWhy, whyNotNegative),
    ),
    point(
      "write-negative",
      t("Writing the negative", "写出否定句"),
      t(
        "Write the sentence again with *didn't* before the verb, and change the verb back to its plain form: *I went to the zoo.* → *I didn't go to the zoo.* Keep the rest of the sentence as it is.\n\n> **Watch out.** Remember to change irregular past forms all the way back to their base form (*saw* → *see*, *bought* → *buy*, *ate* → *eat*) after *didn't*.",
        "在动词前加 *didn't* 把句子改成否定句，并把动词变回原形：*I went to the zoo.* → *I didn't go to the zoo.* 句子的其他部分不变。\n\n> **注意。** 在 *didn't* 后面，要把不规则过去式完整还原成原形（*saw* → *see*、*bought* → *buy*、*ate* → *eat*）。",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Make the sentence negative.", "把句子改成否定句。"),
        negativeTypedBank,
        negativeWhy,
        pastSimpleQuestionsAndNegativesWriteNegativeNot,
      ),
    ),
    point(
      "question",
      t("Questions with did", "用 did 提问"),
      t(
        "To ask about the past, start with *Did*, then the subject and the plain verb: *Did you see the fox? Did Tom win?*\n\n> **Watch out.** Do not use *Do* for a past time (*Do you saw...?* is wrong) and do not keep the past form after *Did* (*Did you saw...?* is wrong).",
        "询问过去的事，用 *Did* 开头，后面接主语和动词原形：*Did you see the fox? Did Tom win?*\n\n> **注意。** 问过去的事不能用 *Do* 开头，也不要在 *Did* 后面留着过去式（*Did you saw...?* 是错的）。",
      ),
      choiceGenerator(t("Which question is right?", "哪个问句是对的？"), questionChoiceBank, questionWhy, whyNotQuestion),
    ),
    point(
      "write-question",
      t("Writing the question", "写出问句"),
      t(
        "Turn the sentence into a question with *Did* and the plain verb: *I saw a fox yesterday.* → *Did you see a fox yesterday?* Ask about the same person: *I* and *we* become *you*, and *my* becomes *your*.\n\n> **Watch out.** Do not forget to change the verb back to its plain form, switch *I/we* to *you*, and end with a question mark.",
        "用 *Did* 加动词原形把句子改成问句：*I saw a fox yesterday.* → *Did you see a fox yesterday?* 问同一个人时，*I* 和 *we* 变成 *you*，*my* 变成 *your*。\n\n> **注意。** 别忘了把动词变回原形、把 *I/we* 换成 *you*，并在句末加上问号。",
      ),
      typedGenerator(
        "sentence",
        t("Make a question.", "把句子改成疑问句。"),
        questionTypedBank,
        questionWhy,
        pastSimpleQuestionsAndNegativesWriteQuestionNot,
      ),
    ),
  ],
};

// Writing sentences in the past.

const noteNames: readonly string[] = ["Sam", "Lily", "My uncle", "Anna", "My cousins", "Ben", "Grandma"];
const noteDays: readonly string[] = ["Saturday", "Sunday", "Friday", "Monday", "Tuesday"];

/** noteActions are a plain verb phrase of a note and its past. */
const noteActions: readonly (readonly [plain: string, past: string])[] = [
  ["go to the zoo", "went to the zoo"],
  ["visit the gallery", "visited the gallery"],
  ["have a picnic", "had a picnic"],
  ["buy a new tent", "bought a new tent"],
  ["play tennis", "played tennis"],
  ["see a film", "saw a film"],
  ["hike in the hills", "hiked in the hills"],
  ["clean the house", "cleaned the house"],
  ["make dumplings", "made dumplings"],
  ["meet some friends", "met some friends"],
  ["swim in the lake", "swam in the lake"],
];

const noteRows = everyTriple(noteNames, noteActions, noteDays);

const noteChoiceBank: readonly ChoiceItem[] = noteRows.map(
  ([name, [plain, past], day]): ChoiceItem => [
    `${name} / ${plain} / ${day}`,
    `${name} ${past} on ${day}.`,
    [`${name} ${plain} on ${day}.`, `${name} on ${day} ${past}.`],
  ],
);

const noteTypedBank: readonly TypedItem[] = noteRows.map(
  ([name, [plain, past], day]): TypedItem => ({
    shown: `${name} / ${plain} / ${day}`,
    accepted: [`${name} ${past} [on|last] ${day}.`, `[On|Last] ${day}(,) ${inner(name)} ${past}.`],
    canonical: `${name} ${past} on ${day}.`,
    wrong: [`${name} ${plain} on ${day}.`, `${name} on ${day} ${past}.`],
  }),
);

/** noteWhy explains the sentence in the past for a note. */
const noteWhy = (right: string): Text => {
  const [plain = "", past = ""] = noteActions.find(([, p]) => right.includes(p)) ?? [];
  const verb = plain.split(" ")[0] ?? "";
  const done = past.split(" ")[0] ?? "";
  return t(
    `The note is about the past, so its verb goes into the past (*${verb}* → *${done}*), and the day goes at the end with *on*: ${right}\n\n**Check.** Verify two things: the verb is in the past tense (*${done}*), and the day phrase sits at the end (or very start), never between the subject and the verb.`,
    `笔记说的是过去的事，所以动词改成过去式（*${verb}* → *${done}*），星期放在句末，前面加 *on*：${right}\n\n**检验。** 核对两处：动词已改为过去式 *${done}*，且星期短语放在句末（或句首），没有插在主语和动词之间。`,
  );
};

/** whyNotNote explains a sentence for a note with the plain verb or with the day in the middle. */
const whyNotNote = (wrong: string, _right: string, _shown: string, position: number): Text =>
  position === 0
    ? t(
        `*${wrong}* keeps the plain verb of the note. The note is about the past, so the verb must be in the past form.`,
        `*${wrong}* 保留了笔记里的动词原形。笔记说的是过去的事，动词必须用过去式。`,
      )
    : t(
        `*${wrong}* puts the day between the subject and the verb, as Chinese does. In English the day goes at the end with *on*, or at the start.`,
        `*${wrong}* 像中文一样把时间放在主语和动词之间。英语里星期放在句末并加 *on*，或者放在句首。`,
      );

const writingSentencesInThePast: TopicDef = {
  id: "writing-sentences-in-the-past",
  title: t("Writing Sentences in the Past", "用过去时写句子"),
  summary: t(
    "Turn notes about last weekend into sentences: Sam / go to the zoo / Saturday becomes Sam went to the zoo on Saturday.",
    "把关于上周末的笔记写成句子：Sam / go to the zoo / Saturday 写成 Sam went to the zoo on Saturday.",
  ),
  intro: t(
    "Short notes like *Ben / visit the gallery / Sunday* give the raw facts. Turning them into a clean English sentence takes two moves: put the verb in the past (*visited*) and place *on Sunday* at the end (or front).",
    "简短笔记如 *Ben / visit the gallery / Sunday* 只给了素材。要写成地道的英语句子需要两步：把动词改成过去式（*visited*），并把 *on Sunday* 放到句末（或句首）。",
  ),
  prerequisites: ["past-simple-irregular", "writing-sentences-about-routines"],
  encompasses: [
    { topic: "past-simple-irregular", weight: 0.4 },
    { topic: "writing-sentences-about-routines", weight: 0.2 },
  ],
  xp: 20,
  strand: "writing",
  knowledgePoints: [
    point(
      "choose",
      t("The sentence for a note", "选出符合笔记的句子"),
      t(
        "A note gives who, what and when. In the sentence, the verb goes into the past, and the day comes at the end with *on*:\n\n*Sam / go to the zoo / Saturday* → *Sam went to the zoo on Saturday.*\n\n> **Watch out.** Never put the day between the subject and the verb (*Sam on Saturday went...* is wrong), and do not leave the verb in its plain form.",
        "笔记给出“谁、做什么、什么时候”。写成句子时，动词改成过去式，星期放在句末，前面加 *on*：\n\n*Sam / go to the zoo / Saturday* → *Sam went to the zoo on Saturday.*\n\n> **注意。** 不要像中文“萨姆星期六去了动物园”那样把时间插在主语和动词中间，也不要把动词留在原形。",
      ),
      choiceGenerator(t("Choose the sentence that matches the note.", "选出与笔记相符的句子。"), noteChoiceBank, noteWhy, whyNotNote),
    ),
    point(
      "write",
      t("Writing the sentence", "写出句子"),
      t(
        "Write a whole sentence for the note, in the past. You can put the day at the end (*Sam went to the zoo on Saturday.*) or at the start (*On Saturday, Sam went to the zoo.*).\n\n> **Watch out.** Remember *on* (or *last*) before the day of the week, capitalize the day, and end the sentence with a period.",
        "根据笔记用过去时写一个完整的句子。时间可以放在句末（*Sam went to the zoo on Saturday.*），也可以放在句首（*On Saturday, Sam went to the zoo.*）。\n\n> **注意。** 星期前别漏掉 *on*（或 *last*），星期首字母要大写，句末加句号。",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Write a sentence from the note.", "根据笔记写一个句子。"),
        noteTypedBank,
        noteWhy,
        writingSentencesInThePastWriteNot,
      ),
    ),
  ],
};

// Writing about your weekend.

const weekendBank: readonly WritingItem[] = [
  {
    task: "Write about what you did last Saturday.",
    model:
      "Last Saturday I got up late. In the morning, I helped my mom in the kitchen, and we made dumplings. After lunch, I met my friend Tom at the park. We played football until it got dark. In the evening, I watched a film with my family. It was a good day.",
  },
  {
    task: "Write about a weekend when you visited relatives.",
    model:
      "Last weekend we visited my grandparents in their village. We took the bus on Saturday morning. Grandma cooked a big lunch for everyone. In the afternoon, my cousins and I walked to the river. On Sunday we said goodbye and came home. I was tired but happy.",
  },
  {
    task: "Write about a weekend when the weather was bad.",
    model:
      "It rained all weekend, so we stayed inside. On Saturday I read a book and played cards with my brother. Then Dad taught us a new game. On Sunday afternoon the rain finally stopped. We went out for a short walk. The air was fresh and cool.",
  },
  {
    task: "Write about a weekend when you went camping or hiking.",
    model:
      "Last weekend my family went camping by a lake. We arrived on Saturday morning and put up our tent. In the afternoon we hiked in the hills. At night we cooked dinner on a fire and looked at the stars. On Sunday we swam in the lake before we drove home.",
  },
  {
    task: "Write about a weekend when something went wrong.",
    model:
      "Last Sunday was a strange day. In the morning, I lost my phone in the park. I looked for it for an hour. Then I went home and told my dad. Suddenly, the phone rang in his pocket! He took it by mistake. We both laughed.",
  },
  {
    task: "Write about a weekend when you visited a museum or a gallery.",
    model:
      "On Saturday my class visited the art gallery in the city. We went there by bus. We saw some famous paintings and a lot of old photos. My favorite was a painting of the sea. After that, we had a picnic in the park. It was an interesting day.",
  },
  {
    task: "Write about a weekend when you helped at home.",
    model:
      "Last weekend I helped at home. On Saturday morning, I cleaned my room and washed the dishes. In the afternoon, my sister and I washed the car. On Sunday I cooked lunch for my parents. They were very happy. I was tired, but I felt good.",
  },
  {
    task: "Write about a weekend when you went to a party.",
    model:
      "Last Saturday was my friend Mia's birthday, so I went to her party. I bought her a book and a card. At the party, we ate cake and played games. Then we danced to music. I got home at nine o'clock. It was a great party.",
  },
  {
    task: "Write about a lazy weekend when you relaxed.",
    model:
      "Last weekend I didn't do much. On Saturday I slept until ten. Then I had a big breakfast and read a comic. In the afternoon, I watched TV with my brother. On Sunday we had a picnic in the garden. It was a quiet weekend, and I liked it.",
  },
  {
    task: "Write about a weekend when you played a sport or a game.",
    model:
      "Last Sunday my team played a basketball game against another school. We practiced on Saturday afternoon. On Sunday the game started at ten. We played well, and we won by five points. After the game, our coach bought us ice cream. I was very proud.",
  },
  {
    task: "Write about a weekend when you went shopping.",
    model:
      "Last Saturday I went shopping with my mom. We took the subway to a big shop in the city. I needed new shoes for school. We looked in five shops, and finally I found some nice black ones. Then we had noodles for lunch. We came home at four.",
  },
  {
    task: "Write about a weekend when you learned something new.",
    model:
      "Last weekend I learned to ride a bike. On Saturday morning, my dad took me to the park. At first I fell a lot. Dad held the bike and ran next to me. On Sunday I tried again, and suddenly I could ride alone! I was so happy.",
  },
];

const writingAboutYourWeekend = judgedTopic({
  id: "writing-about-your-weekend",
  title: t("Writing About Your Weekend", "写你的周末"),
  summary: t(
    "Write five to seven sentences about what you did last weekend, in the past simple, in the order it happened.",
    "用五到七句话写你上周末做了什么，用一般过去时，按事情发生的顺序写。",
  ),
  intro: t(
    "A short weekend story links past actions in time order: *On Saturday morning I rode my bike to the river. After lunch we played chess, and in the evening we cooked noodles.* Clear time words and consistent past verbs make the story easy to follow.",
    "写周末短文要把过去发生的事按时间连起来：*On Saturday morning I rode my bike to the river. After lunch we played chess, and in the evening we cooked noodles.* 清晰的时间词加上前后一致的过去式，读起来才顺畅。",
  ),
  prerequisites: ["writing-sentences-in-the-past", "writing-a-short-note"],
  encompasses: [{ topic: "writing-sentences-in-the-past", weight: 0.4 }],
  criteria: ["a2-past-simple", "a2-events-in-order", "a1-sentences"],
  point: {
    id: "weekend",
    title: t("What you did, in order", "按顺序写你做了什么"),
    explanation: t(
      "Tell your weekend like a short story. Use the past simple for every thing you did: *I got up late. We made dumplings.*\n\nTell the events in the order they happened, and show the order with time words: *in the morning*, *after lunch*, *then*, *in the evening*, *on Sunday*. End with how the day was: *It was a good day.*\n\n> **Watch out.** Check every single verb in your story—do not slip back into the present tense halfway through (*then we go home* → *then we went home*).",
      "像讲一个小故事一样写你的周末。你做的每件事都用一般过去时：*I got up late. We made dumplings.*\n\n按事情发生的先后顺序写，并用时间词表示顺序：*in the morning*、*after lunch*、*then*、*in the evening*、*on Sunday*。最后说一说这一天怎么样：*It was a good day.*\n\n> **注意。** 中文说“昨天我去公园”动词不变，但英语写故事时每个动词都要用过去式，别写到一半滑回现在时（*then we go home* → *then we went home*）。",
    ),
  },
  question: t(
    "Write five to seven sentences in English about the weekend the task names. Use the past simple, and tell the events in order.",
    "根据题目用英语写五到七句话，写你的周末。用一般过去时，按顺序写出发生的事。",
  ),
  bank: weekendBank,
  limits: { minWords: 35, maxChars: 900 },
  what: t("text", "短文"),
});

/** topics are the topics of the unit Last Weekend. */
export const topics: readonly TopicDef[] = [
  pastTime.topic,
  relatives.topic,
  events.topic,
  weekend.topic,
  useful.topic,
  pastSimpleRegular,
  pastSimpleIrregular,
  pastQuestionsAndNegatives,
  writingSentencesInThePast,
  writingAboutYourWeekend,
];

/** vocabulary are the words the unit Last Weekend teaches. */
export const vocabulary: readonly WordBatch[] = [pastTime.batch, relatives.batch, events.batch, weekend.batch, useful.batch];
