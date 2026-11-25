// A1, unit 2: My Day. Daily routines, times of day, how often, little words, the -s of he and she, words like
// always and never, and sentences about routines.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { everyPair, interleave, pairUp, vocabularyTopic, word } from "../words.ts";

const myDay = vocabularyTopic({
  id: "a1-words-my-day",
  title: t("My Day", "我的一天"),
  summary: t("Getting up, going to school, meals and going to bed.", "起床、上学、吃饭和睡觉。"),
  intro: t(
    "I **wake** up at seven, **brush** my teeth and eat **breakfast**. At nine at night I go to **bed** and **sleep**. These words help you tell someone about your day.",
    "我七点 **wake**（醒来），**brush**（刷）牙，吃 **breakfast**（早餐）。晚上九点我上 **bed**（床）**sleep**（睡觉）。这些词帮你向别人讲述你的一天。",
  ),
  prerequisites: ["pre-a1-words-classroom-actions"],
  words: [
    word(
      "get gets got gotten getting",
      "to receive something; with *up*, to leave your bed",
      "得到；（get up）起床",
      "I {get} up at seven. | I {got} a new bike for my birthday.|slept brushed | It's {getting} dark. Let's go home.|sleeping brushing",
      "sleep brush",
    ),
    word(
      "up",
      "toward a higher place; out of bed",
      "向上；起来",
      "Wake {up}! It's time for school. | Stand {up}, please, and come to the board. | The cat climbs {up} the tree to the top.",
      "down out",
    ),
    word(
      "wake wakes woke woken waking",
      "to stop sleeping",
      "醒；叫醒",
      "I {wake} up at six every day. | Shh! Don't {wake} the baby up. | I {woke} up early this morning.|slept brushed",
      "sleep brush",
    ),
    word(
      "go goes went gone going",
      "to move to another place",
      "去",
      "I {go} to school by bus. | We {went} to the zoo yesterday.|woke slept | Where are you {going}? To the shop.|waking sleeping",
      "wake sleep",
    ),
    word(
      "come comes came coming",
      "to move toward the person speaking, or to a place",
      "来",
      "{Come} here, please! | Can you {come} to my party? | My dad {comes} home at six.|wakes brushes",
      "wake brush",
    ),
    word(
      "home homes",
      "the place where you live",
      "家",
      "I go {home} after school. | My {home} is a small apartment. | Is Mom at {home}? No, she isn't in the house.",
      "bed lunch",
    ),
    word(
      "bed beds",
      "a piece of furniture you sleep on",
      "床",
      "I go to {bed} at nine. | The cat sleeps under the blanket on my {bed}. | Our bedroom has two {beds} for sleeping.|tables desks",
      "table desk",
    ),
    word(
      "sleep sleeps slept sleeping",
      "to rest with your eyes closed",
      "睡觉",
      "I {sleep} eight hours a night. | The baby is {sleeping}. Be quiet.|going coming | I {slept} in my bed for ten hours last night.|went came",
      "go come",
    ),
    word(
      "breakfast breakfasts",
      "the first meal of the day",
      "早餐",
      "In the morning, I eat {breakfast}. | {Breakfast} is the first meal of the day. | I eat {breakfast} at seven, before school.",
      "dinner lunch",
    ),
    word(
      "lunch lunches",
      "the meal you eat in the middle of the day",
      "午餐",
      "We eat {lunch} at twelve. | I take my {lunch} to school and eat it at noon. | {Lunch} is in the middle of the day.",
      "breakfast dinner",
    ),
    word(
      "dinner dinners",
      "the meal you eat in the evening",
      "晚餐",
      "We eat {dinner} at seven in the evening. | What's for {dinner} tonight? | After {dinner}, I go to bed.",
      "breakfast lunch",
    ),
    word(
      "brush brushes brushed brushing",
      "to clean something with a brush",
      "刷",
      "I {brush} my teeth every morning. | {Brush} your hair before school. | She is {brushing} the dog's long hair.|waking sleeping",
      "wake sleep",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "The meal tells the time: *breakfast* in the morning, *lunch* at twelve, *dinner* in the evening. *Wake* and *get* go with *up*, but *go to bed* and *sleep* come at night.",
        "饭名看时间：早上 *breakfast*，十二点 *lunch*，晚上 *dinner*。*wake*、*get* 和 *up* 连用，*go to bed* 和 *sleep* 在晚上。",
      ),
      meaning: t(
        "You *wake up* when you stop sleeping and *get up* when you leave your bed. You *go* to another place, but someone *comes* to where you are.",
        "停止睡眠是 *wake up*，离开床是 *get up*。去别的地方用 *go*，来到你这里用 *come*。",
      ),
      spell: t(
        "Watch the past forms of a day: *get* to *got*, *wake* to *woke*, *go* to *went*, *come* to *came* and *sleep* to *slept*.",
        "留意一天里这些动词的过去式：*get* 变 *got*，*wake* 变 *woke*，*go* 变 *went*，*come* 变 *came*，*sleep* 变 *slept*。",
      ),
    },
    notes: `
      get|up at seven;a new bike for my birthday;dark outside|get up means to leave your bed; sleep means to rest with your eyes closed|get up 是起床；sleep 是睡觉|sleep/slept/sleeping=sleep means to rest, and *sleep up*, *slept a bike* and *sleeping dark* are not English=sleep 是睡觉，没有 *sleep up*、*slept a bike*、*sleeping dark* 的说法;brush/brushed/brushing=brush means to clean with a brush, not to leave your bed, receive a bike or become dark=brush 是刷，不是起床、收到自行车或天变黑|get|the past *got*|过去式是 *got*
      up|waking for school;standing to come to the board;climbing to the top of a tree|up is toward a higher place; down is toward a lower place|up 是向上；down 是向下|down=down is toward a lower place, but you wake up, stand to walk to the board and climb to the top=down 是向下，可这里是醒来、站起来走到黑板前、爬到树顶;out=out is away from the inside, and *wake out*, *stand out to the board* and *climb out the tree* do not mean this=out 是向外，*wake out*、*stand out to the board*、*climb out the tree* 都不是这个意思|up|u said like the u in *cup*|u 读作 *cup* 里的 u
      wake|getting up at six;not stopping a baby's sleep;getting up early|you wake up when sleep ends; you sleep when you rest|wake 是醒来；sleep 是睡觉|sleep/slept=sleep means to rest, but *sleep up* and *slept up early* are not English, and you cannot sleep a baby up=sleep 是睡觉，没有 *sleep up*、*slept up early* 的说法，也不能把婴儿 sleep up;brush/brushed=brush means to clean with a brush, not to stop sleeping=brush 是刷，不是醒来|wake|a silent e, and the past *woke*|词尾 e 不发音，过去式是 *woke*
      go|to school by bus;to the zoo;to the shop|go means to move to another place; wake means to stop sleeping|go 是去别处；wake 是醒来|wake/woke/waking=wake means to stop sleeping, not to move to school, the zoo or a shop=wake 是醒来，不是去学校、动物园或商店;sleep/slept/sleeping=sleep means to rest in bed, not to move to another place=sleep 是在床上睡，不是去别处|go|the past *went*, a new word|过去式是 *went*，完全不同的词
      come|to me here;to my party;home at six|come is moving to where the speaker is or to a place; wake is stopping sleep|come 是来；wake 是醒来|wake/wakes=wake means to stop sleeping, not to move here, to a party or home=wake 是醒来，不是来这里、去派对或回家;brush/brushes=brush means to clean with a brush, not to move to a place=brush 是刷，不是去哪里|come|o said like the u in *up*, and a silent e|o 读作 *up* 里的 u，词尾 e 不发音
      home|after school;a small apartment;inside the house|home is where you live; a bed is what you sleep on|home 是住的地方；bed 是睡觉的家具|bed=bed is what you sleep on, so *go bed* is not English and a bed is not an apartment or a house=bed 是睡觉的家具，没有 *go bed* 的说法，床也不是公寓或房子;lunch=lunch is a meal, not a place you go after school, an apartment or a house=lunch 是一顿饭，不是放学去的地方、公寓或房子|home|o said like *go*, and a silent e|o 读作 *go*，词尾 e 不发音
      bed|going there at nine;a blanket on it for the cat;two for sleeping|a bed is for sleeping; a table is for eating or working|bed 用来睡觉；table 用来吃饭或工作|table/tables=table is for eating or working, so you do not *go to table* at nine, cover it with a blanket or sleep on it=table 是吃饭或工作的，九点不会 *go to table*，不盖毯子也不在上面睡;desk/desks=desk is for writing and reading, not for sleeping under a blanket=desk 是写字读书的，不是盖毯子睡觉的|bed|a short e|短元音 e
      sleep|eight hours a night;a baby so be quiet;ten hours in bed|you sleep with your eyes closed; you go to another place|sleep 是闭眼睡觉；go 是去别处|go/going/went=go means to move to another place, but *go eight hours*, a quiet baby and ten hours in bed are about resting=go 是去别处，可八小时、安静的婴儿和在床上十小时说的都是休息;come/coming/came=come means to move toward a place, not to rest in bed=come 是来，不是在床上休息|sleep|a double e, and the past *slept*|双写 e，过去式是 *slept*
      breakfast|the morning;the first meal;seven before school|breakfast is the first meal; dinner is the evening meal|breakfast 是早饭；dinner 是晚饭|dinner=dinner is the evening meal, not the first meal in the morning before school=dinner 是晚饭，不是上学前早上的第一顿饭;lunch=lunch is in the middle of the day, not the first meal in the morning=lunch 在中午，不是早上的第一顿饭|break · fast|*break* + *fast*, said like *brek-fust*|*break* 加 *fast*，读作 *brek-fust*
      lunch|twelve o'clock;eaten at school at noon;the middle of the day|lunch is the midday meal; dinner is the evening meal|lunch 是午饭；dinner 是晚饭|breakfast=breakfast is the morning meal, not the one at twelve or noon=breakfast 是早饭，不在十二点或中午;dinner=dinner is the evening meal, not the one in the middle of the day=dinner 是晚饭，不在中午|lunch|nch at the end|结尾是 nch
      dinner|seven in the evening;tonight;the meal before bed|dinner is the evening meal; breakfast is the morning meal|dinner 是晚饭；breakfast 是早饭|breakfast=breakfast is the morning meal, not one in the evening, tonight or before bed=breakfast 是早饭，不在晚上、今晚或睡前;lunch=lunch is at midday, not in the evening, tonight or before bed=lunch 在中午，不在晚上、今晚或睡前|din · ner|a double n|双写 n
      brush|teeth;hair before school;a dog's long hair|you brush to clean or tidy something; you wake when sleep ends|brush 是刷；wake 是醒|wake/waking=wake means to stop sleeping, but teeth and hair do not sleep=wake 是醒来，可牙齿和头发不会睡觉;sleep/sleeping=sleep means to rest, and you cannot sleep your teeth or hair=sleep 是睡觉，不能“睡”牙齿或头发|brush|sh at the end, and -es in *brushes*|结尾是 sh，第三人称是 *brushes*
    `,
  },
});

const timesOfDay = vocabularyTopic({
  id: "a1-words-times-of-day",
  title: t("Times of Day", "一天中的时段"),
  summary: t("Morning, afternoon, evening and night, and words for when.", "早上、下午、傍晚和夜晚，以及表示时间先后的词。"),
  intro: t(
    "In the **morning** I go to school, in the **afternoon** I play, and **after** dinner I read. At **night** I sleep. These words help you say when you do things.",
    "我 **morning**（早上）上学，**afternoon**（下午）玩，晚饭 **after**（之后）看书，**night**（夜里）睡觉。这些词帮你说出什么时候做事。",
  ),
  prerequisites: ["pre-a1-words-little-words"],
  words: [
    word(
      "morning mornings",
      "the early part of the day, before twelve",
      "早上；上午",
      "I have breakfast in the {morning}. | Good {morning}! Did you sleep well? | I go to school every {morning} at eight.",
      "evening night",
    ),
    word(
      "afternoon afternoons",
      "the part of the day after twelve and before the evening",
      "下午",
      "Lunch is at twelve, and in the {afternoon} we play. | Good {afternoon}! It's two o'clock. | School ends at four in the {afternoon}.",
      "morning night",
    ),
    word(
      "evening evenings",
      "the part of the day between the afternoon and the night",
      "傍晚；晚上",
      "We eat dinner in the {evening}. | Good {evening}, everyone. It's seven o'clock. | The sun goes down in the {evening}.",
      "morning afternoon",
    ),
    word(
      "night nights",
      "the dark time when people sleep",
      "夜晚",
      "I sleep at {night}. | Stars come out at {night}. | Good {night}! Sleep well.",
      "morning afternoon",
    ),
    word(
      "day days",
      "a time of twenty-four hours; also the light part of it",
      "天；白天",
      "There are seven {days} in a week.|weeks hours | Have a nice {day}! See you tomorrow. | I brush my teeth twice a {day}, in the morning and at night.",
      "week hour",
    ),
    word(
      "today",
      "on this day",
      "今天",
      "It's my birthday {today}! Let's eat the cake now. | What day is it {today}, right now? It's Monday. | {Today} is sunny, but tomorrow it will rain.",
      "tomorrow yesterday",
    ),
    word(
      "every",
      "each one of a group; all",
      "每个；每一",
      "I go to school {every} day, five days a week. | {Every} child has a book. | We visit Grandma {every} Sunday, once a week.",
      "all both",
    ),
    word(
      "then",
      "after that; next",
      "然后；那时",
      "I get up, and {then} I have breakfast. | First open the box, {then} take out the toy. | Wash your hands. {Then} you can eat.|First Before",
      "first before",
    ),
    word(
      "after",
      "later than something",
      "在……之后",
      "I go to bed {after} dinner. First dinner, then bed. | Monday comes {after} Sunday. | Seven comes {after} six.",
      "before until",
    ),
    word(
      "before",
      "earlier than something",
      "在……之前",
      "Sunday comes {before} Monday. | Five comes {before} six. | I brush my teeth {before} bed, not after.",
      "after until",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "Use the clock and the sun as clues: *morning* is before twelve, *afternoon* is after lunch, *evening* is when the sun goes down, and *night* is when you sleep and see stars.",
        "看钟点和太阳：十二点前是 *morning*，午饭后是 *afternoon*，太阳落山是 *evening*，睡觉、看星星是 *night*。",
      ),
      meaning: t(
        "*Before* means earlier and *after* means later: Sunday comes *before* Monday, and Monday comes *after* Sunday. *Then* tells you what comes next.",
        "*before* 是更早，*after* 是更晚：星期天在星期一 *before*，星期一在星期天 *after*。*then* 说接下来是什么。",
      ),
      spell: t(
        "*Afternoon* is *after* + *noon*, with a double o; *evening* has no a, so not *evning* or *evenning*.",
        "*afternoon* 是 *after* 加 *noon*，双写 o；*evening* 里没有 a，也不是 *evning* 或 *evenning*。",
      ),
    },
    notes: `
      morning|breakfast;good morning after sleep;school at eight|morning is before twelve; evening is when the sun goes down|morning 在十二点前；evening 是太阳落山的时候|evening=evening is after the afternoon, not the time of breakfast, waking up or eight o'clock school=evening 在下午之后，不是吃早饭、刚醒或八点上学的时候;night=night is the dark time for sleeping, not for breakfast or going to school=night 是睡觉的黑夜，不是吃早饭或上学的时候|morn · ing|no u, so not *mourning*|没有 u，不是 *mourning*
      afternoon|play after lunch;two o'clock;four when school ends|afternoon is after twelve and before evening; morning is before twelve|afternoon 在十二点后、傍晚前；morning 在十二点前|morning=morning is before twelve, but here it is after lunch, two or four=morning 在十二点前，可这里是午饭后、两点或四点;night=night is the dark time for sleeping, not two or four in the day=night 是睡觉的黑夜，不是白天的两点或四点|af · ter · noon|*after* + *noon*, with a double o|*after* 加 *noon*，双写 o
      evening|dinner;seven o'clock;the sun going down|evening comes after the afternoon; morning is the start of the day|evening 在下午之后；morning 是一天的开始|morning/mornings=morning is the start of the day, not dinner, seven at night or sunset=morning 是一天的开始，不是吃晚饭、晚上七点或日落;afternoon/afternoons=afternoon is before the evening, not dinner, seven o'clock or the sun going down=afternoon 在傍晚前，不是吃晚饭、七点或日落|eve · ning|no a, and one n in the middle|没有 a，中间只有一个 n
      night|sleeping;stars;good night before sleep|night is dark and for sleeping; morning is light and for getting up|night 黑、用来睡觉；morning 亮、用来起床|morning/mornings=morning is when you get up, not when you sleep or see stars=morning 是起床的时候，不是睡觉或看星星的时候;afternoon/afternoons=afternoon is light, not the time for sleep or stars=afternoon 天还亮，不是睡觉或看星星的时候|night|igh with a silent gh|igh 里的 gh 不发音
      day|seven in a week;see you tomorrow;morning and night|a day is twenty-four hours; a week is seven days|day 是二十四小时；week 是七天|week/weeks=week is seven days, so a week does not have seven weeks, does not end tomorrow and does not go from morning to night=week 是七天，一周没有七周，不会明天就结束，也不是从早到晚;hour/hours=hour is sixty minutes, so a week has far more than seven hours and an hour is not morning and night=hour 是六十分钟，一周远不止七小时，一小时也不包括早上和晚上|day|ay said like *say*|ay 读作 *say*
      today|the cake now;right now Monday;sunny before rain tomorrow|today is this day; tomorrow is the next day|today 是今天；tomorrow 是明天|tomorrow=tomorrow is the next day, but here it is now, right now, and tomorrow comes later in the sentence=tomorrow 是明天，可这里说的是现在，后面还另提到了明天;yesterday=yesterday is the day before, but *is* and *now* talk about this day=yesterday 是昨天，可 *is* 和 *now* 说的是今天|to · day|*to* + *day*|*to* 加 *day*
      every|five days a week;each child;once a week|every is for each one, with a singular word; all is for the whole group|every 指每一个，后接单数；all 指全部|all=all goes with plural words like *all children*, and *all day* means the whole day, not five days a week or once a week=all 后接复数，比如 *all children*，*all day* 是一整天，不是一周五天或一周一次;both=both is for exactly two, and *both day*, *both child* and *both Sunday* are not English=both 只用于两个，没有 *both day*、*both child*、*both Sunday* 的说法|ev · ery|ev at the start, and y at the end|开头是 ev，结尾是 y
      then|breakfast after getting up;taking out the toy after opening the box;eating after washing|then tells what comes next; first tells what comes at the start|then 说接下来；first 说最先|first=first is for the start, but each sentence tells what comes second=first 说最先，可每句说的都是第二步;before=before needs something after it, and *before I have breakfast* or *before take out* does not finish the sentence=before 后面要接内容，*before I have breakfast*、*before take out* 都不能把句子说完|then|th said like in *this*, with e not a|th 读作 *this* 里的音，是 e 不是 a
      after|bed later than dinner;Monday later than Sunday;seven later than six|after means later than; before means earlier than|after 是之后；before 是之前|before=before means earlier, but bed comes later than dinner, Monday later than Sunday and seven later than six=before 是之前，可睡觉在晚饭后，星期一在星期天后，七在六后;until=until means up to a time, and *comes until Sunday* is not English=until 是直到，没有 *comes until Sunday* 的说法|af · ter|*a* + *ft* + *er*|a 后面是 ft，再加 er
      before|Sunday earlier than Monday;five earlier than six;teeth not after bed|before means earlier than; after means later than|before 是之前；after 是之后|after=after means later, but Sunday comes earlier than Monday, five than six, and *not after* rules it out=after 是之后，可星期天比星期一早，五比六早，*not after* 也排除了它;until=until means up to a time, and *comes until Monday* is not English=until 是直到，没有 *comes until Monday* 的说法|be · fore|*be* + *fore*, said like *four*|*be* 加 *fore*，读作 *four*
    `,
  },
});

const howOften = vocabularyTopic({
  id: "a1-words-how-often",
  title: t("How Often", "多久一次"),
  summary: t(
    "Always, usually, sometimes and never, and the verbs of a day: start, finish, work, watch, play.",
    "always、usually、sometimes、never，以及日常动词 start、finish、work、watch、play。",
  ),
  intro: t(
    "I **always** do my **homework** first, I **usually** **watch** TV after dinner, and I **never** drink coffee. These words help you say how often you do things.",
    "我 **always**（总是）先做 **homework**（作业），晚饭后 **usually**（通常）**watch**（看）电视，**never**（从不）喝咖啡。这些词帮你说做事的频率。",
  ),
  prerequisites: ["a1-words-my-day"],
  words: [
    word(
      "always",
      "every time",
      "总是",
      "The sun {always} comes up in the east. | I {always} brush my teeth. I do it every day. | She is {always} late! Every day she comes at nine.",
      "never sometimes",
    ),
    word(
      "usually",
      "most times",
      "通常",
      "I {usually} walk to school, but sometimes I take the bus. | We {usually} eat at seven, but today we are late. | It is {usually} sunny here, but today it's raining.",
      "never always",
    ),
    word(
      "often",
      "many times",
      "经常",
      "I {often} visit my grandma, about twice a week. | He is {often} tired after work, but not every day. | It {often} rains here in spring, but not every day.",
      "never always",
    ),
    word(
      "sometimes",
      "at some times, but not always",
      "有时",
      "I {sometimes} take the bus, but I usually walk. | {Sometimes} I am happy, and sometimes I am sad. | We {sometimes} eat out, maybe once a month.",
      "always never",
    ),
    word(
      "never",
      "not at any time",
      "从不",
      "I {never} drink coffee. I don't like it. | Cats {never} bark. | She is {never} late. She is always on time.",
      "always often",
    ),
    word(
      "start starts started starting",
      "to begin",
      "开始",
      "School {starts} at eight and finishes at three.|finishes watches | {Start} the test now. You have one hour. | The movie {started} at seven, and it ended at nine.|finished watched",
      "finish watch",
    ),
    word(
      "finish finishes finished finishing",
      "to end; to do the last part of something",
      "完成；结束",
      "I start at five and {finish} at six. | Did you {finish} your lunch? Your plate is empty. | School {finishes} at three. Then we go home.|starts watches",
      "start watch",
    ),
    word(
      "work works worked working",
      "to do a job",
      "工作",
      "My mom {works} in a hospital. She is a nurse.|plays watches | I {work} hard at school and do all my lessons. | Dad is at {work} in his office. He comes home at six.",
      "play watch",
    ),
    word(
      "watch watches watched watching",
      "to look at something for some time",
      "观看；看",
      "I {watch} TV after dinner. | Let's {watch} a movie tonight. | She is {watching} the birds in the garden.|playing working",
      "play work",
    ),
    word(
      "play plays played playing",
      "to have fun with a game or a toy; to make music on something",
      "玩；打（球）；弹奏",
      "The children {play} with a ball in the park. | I {play} the piano. | Let's {play} football. I'll kick the ball to you.",
      "watch work",
    ),
    word(
      "homework",
      "work a teacher gives you to do at home",
      "家庭作业",
      "I do my {homework} for my teacher at home after school. | The teacher gives us {homework} to do at home every day. | Did you finish your math {homework} at home last night?",
      "housework classwork",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "Read the rest of the sentence for how often: *every day* or *every time* calls for *always*, *but sometimes* or *but today* for *usually*, and *I don't like it* for *never*.",
        "看句子其余部分判断频率：*every day*、*every time* 用 *always*，*but sometimes*、*but today* 用 *usually*，*I don't like it* 用 *never*。",
      ),
      meaning: t(
        "From most to least: *always*, *usually*, *often*, *sometimes*, *never*. *Start* is the beginning and *finish* is the end, so a movie *starts* at seven and *finishes* at nine.",
        "频率从高到低：*always*、*usually*、*often*、*sometimes*、*never*。*start* 是开始，*finish* 是结束，电影七点 *starts*，九点 *finishes*。",
      ),
      spell: t(
        "*Usually* has a double l, from *usual* + *-ly*. *Sometimes* is one word, and *finish* adds -es in *finishes*.",
        "*usually* 是 *usual* 加 *-ly*，双写 l。*sometimes* 是一个词，*finish* 的第三人称是 *finishes*。",
      ),
    },
    notes: `
      always|the sun in the east;every day;late every day|always means every time; sometimes means only at some times|always 是每次都；sometimes 是有时|never=never means not at any time, but the sun does come up, I do brush every day and she is late every day=never 是从不，可太阳确实升起，我每天刷牙，她每天迟到;sometimes=sometimes means only at some times, but the sun, brushing and being late here happen every time=sometimes 是有时，可这里太阳、刷牙和迟到每次都发生|al · ways|one l, and ways at the end|只有一个 l，结尾是 ways
      usually|walking but sometimes the bus;seven but late today;sunny but rain today|usually means most times; always means every time|usually 是大多数时候；always 是每次|never=never means not at any time, but *but sometimes* and *but today* show it does happen most times=never 是从不，可 *but sometimes*、*but today* 说明大多数时候会发生;always=always means every time, but *sometimes* and *today* show that it does not happen every time=always 是每次，可 *sometimes* 和 *today* 说明不是每次|u · su · al · ly|*usual* + *-ly*, with a double l|*usual* 加 *-ly*，双写 l
      often|twice a week;tired but not every day;rain but not every day|often means many times; always means every time|often 是经常；always 是每次|never=never means not at any time, but twice a week and many tired days or rainy days do happen=never 是从不，可一周两次、常常累、常下雨都会发生;always=always means every time, but *twice a week* and *not every day* show it does not happen every time=always 是每次，可 *twice a week* 和 *not every day* 说明不是每次|of · ten|the t is often silent|t 常常不发音
      sometimes|the bus but usually walking;happy and sometimes sad;once a month|sometimes means at some times; always means every time|sometimes 是有时；always 是每次|always=always means every time, but *usually walk*, *sometimes sad* and *once a month* show it is only some times=always 是每次，可 *usually walk*、*sometimes sad* 和 *once a month* 说明只是有时;never=never means not at any time, but each sentence says it does happen sometimes=never 是从不，可每句都说它有时会发生|some · times|*some* + *times*, one word with s at the end|*some* 加 *times*，一个词，结尾有 s
      never|no coffee because I don't like it;cats and barking;always on time|never means not at any time; always means every time|never 是从不；always 是每次|always=always means every time, but I don't like coffee, cats do not bark and she is on time=always 是每次，可我不喜欢咖啡，猫不会叫，她总是准时;often=often means many times, but these things do not happen at all=often 是经常，可这些事根本不会发生|nev · er|one v, and -er at the end|只有一个 v，结尾是 -er
      start|school at eight;the test now with an hour;a movie at seven|start means to begin; finish means to end|start 是开始；finish 是结束|finish/finishes/finished=finish means to end, but school finishes at three, the test has an hour left and the movie ended at nine=finish 是结束，可学校三点才结束，考试还有一小时，电影九点才结束;watch/watches/watched=watch means to look at, and school or a movie cannot watch=watch 是观看，学校和电影不会“看”|start|ar said like *car*|ar 读作 *car* 里的音
      finish|six after starting at five;an empty plate;school at three then home|finish means to end; start means to begin|finish 是结束；start 是开始|start/starts=start means to begin, but here it is the end: after five, an empty plate, then home=start 是开始，可这里是结束：五点之后、盘子空了、然后回家;watch/watches=watch means to look at something, not to end a job, a lunch or school=watch 是看，不是结束工作、午饭或上课|fin · ish|sh at the end, and -es in *finishes*|结尾是 sh，第三人称是 *finishes*
      work|a nurse in a hospital;lessons at school;Dad in his office|you work at a job; you play for fun|work 是工作；play 是玩|play/plays=play means to have fun, but a nurse's job, lessons and an office are work=play 是玩，可护士的工作、功课和办公室都是工作;watch/watches=watch means to look at something, and *watches in a hospital* or *at watch* does not mean a job=watch 是看，*watches in a hospital*、*at watch* 都不是工作|work|or said like *er*|or 读作 *er*
      watch|TV;a movie;the birds|you watch with your eyes; you play with a game or a toy|watch 是用眼睛看；play 是玩游戏或玩具|play/playing=play means to have fun with a game, and you do not play TV, a movie or birds=play 是玩游戏，不说 play 电视、电影或鸟;work/working=work means to do a job, and you cannot work TV, a movie or birds=work 是工作，不能 work 电视、电影或鸟|watch|tch at the end|结尾是 tch
      play|a ball in the park;the piano;football with a kick|you play a game or music; you watch when you only look|play 是玩或弹奏；watch 是只看|watch=watch means only to look, but here you use a ball, the piano and your foot=watch 只是看，可这里要用球、钢琴和脚;work=work means to do a job, not to have fun with a ball or make music on a piano=work 是工作，不是玩球或弹钢琴|play|ay said like *say*|ay 读作 *say*
      homework|for my teacher at home;to do at home;math done at home last night|homework is school work done at home; classwork is done in class|homework 是在家做的功课；classwork 是在课堂上做的|housework=housework is cleaning and cooking at home, not work a teacher gives you or math=housework 是在家打扫做饭，不是老师布置的作业或数学;classwork=classwork is done in class, but here the work is done at home=classwork 在课堂上做，可这里是在家做|home · work|*home* + *work*, one word with no plural|*home* 加 *work*，一个词，没有复数
    `,
  },
});

const littleWords1 = vocabularyTopic({
  id: "a1-words-little-words-1",
  title: t("Little Words 1", "小词 1"),
  summary: t("For, out, down, off, over, by, into, just, really and why.", "for、out、down、off、over、by、into、just、really 和 why。"),
  intro: t(
    "The cat jumps **off** the bed, runs **out** of the room and jumps **into** a box. **Why**? It's **just** a game. These words help you say where things go and why.",
    "猫跳 **off**（离开）床，跑 **out**（出）房间，跳 **into**（进）箱子里。**why**（为什么）？这 **just**（只是）个游戏。这些词帮你说东西往哪里去、为什么。",
  ),
  prerequisites: ["pre-a1-words-little-words"],
  words: [
    word(
      "for",
      "used to say who gets something, or how long something lasts",
      "为；给；（时长）……之久",
      "This gift is {for} you. | I waited {for} an hour. | Thank you {for} the cake!",
      "to of",
    ),
    word(
      "out",
      "away from the inside",
      "出去；向外",
      "Let's go {out} and play. | Take your book {out} of your bag. | The cat ran {out} of the house.",
      "for into",
    ),
    word(
      "down",
      "toward a lower place",
      "向下",
      "Sit {down}, please. | The ball rolls {down} the hill. | Put your pens {down} and listen.",
      "up into",
    ),
    word(
      "off",
      "away from; not on",
      "离开；（关）掉",
      "Turn {off} the light. It's time to sleep. | Take {off} your shoes. | The cat jumped {off} the table and landed on the floor.",
      "on into",
    ),
    word(
      "over",
      "above or across something; finished",
      "在……上方；越过；结束",
      "The bird flies high {over} the house. | The dog jumped {over} the wall to the other side. | Is the movie {over}? Yes, it ended.",
      "under into",
    ),
    word(
      "by",
      "next to; using",
      "在……旁边；乘（交通工具）",
      "I go to school {by} bus. | Come and sit {by} me. | The book is {by} the bed, next to the lamp.",
      "for into",
    ),
    word(
      "into",
      "to the inside of",
      "进入",
      "Put the toys {into} the box. | She walked {into} the room. | The frog jumped {into} the water.",
      "out off",
    ),
    word(
      "just",
      "only; a moment ago",
      "只是；刚刚",
      "I'm {just} looking, thank you. | It's {just} a small cat. Don't be afraid. | I {just} got home. I need a rest.",
      "very too",
    ),
    word(
      "really",
      "very; truly",
      "真的；非常",
      "This cake is {really} good! | Do you {really} like it? — Yes, I do! | I'm {really} sorry.",
      "much why",
    ),
    word(
      "why",
      "the word you use to ask for a reason",
      "为什么",
      "{Why} are you sad? — Because my dog is sick. | {Why} is the sky blue? | I don't know {why} she is angry. Is it because I was late?",
      "what where",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "Think of the way it moves: *into* goes to the inside, *out of* comes from the inside, *off* leaves a top like a table, and *over* goes above or across a wall.",
        "想想移动方向：*into* 是进到里面，*out of* 是从里面出来，*off* 是离开桌面这样的上面，*over* 是从上方越过墙。",
      ),
      meaning: t(
        "*Why* asks for a reason, so the answer often starts with *because*. *Just* means only or a moment ago, while *really* means very or truly.",
        "*why* 问原因，回答常用 *because* 开头。*just* 是只是或刚刚，*really* 是非常或真的。",
      ),
      spell: t(
        "*Into* is one word, from *in* + *to*. *Off* has a double f, but *of* has one; *really* is *real* + *-ly*, with a double l.",
        "*into* 是 *in* 加 *to* 合成的一个词。*off* 双写 f，*of* 只有一个；*really* 是 *real* 加 *-ly*，双写 l。",
      ),
    },
    notes: `
      for|a gift you get;an hour of waiting;thanks for the cake|for says who gets it or how long; to says where it goes|for 说给谁或多久；to 说去哪里|to=to says where something goes, and *waited to an hour* or *thank you to the cake* is not English=to 说去哪里，没有 *waited to an hour* 或 *thank you to the cake* 的说法;of=of says what something belongs to, and *a gift is of you* or *waited of an hour* is not English=of 表示所属，没有 *a gift is of you* 或 *waited of an hour* 的说法|for|or said like *four*|or 读作 *four*
      out|going to play outside;from inside a bag;from inside the house|out is away from the inside; into is to the inside|out 是向外；into 是向里|for=for says who gets it or how long, and *go for and play* or *for of your bag* is not English=for 说给谁或多久，没有 *go for and play*、*for of your bag* 的说法;into=into is to the inside, and *into of* is not English=into 是向里，没有 *into of* 的说法|out|ou said like *ow*|ou 读作 *ow*
      down|sitting;rolling down a hill;pens on the desk|down is toward a lower place; up is toward a higher place|down 是向下；up 是向上|up=up is toward a higher place, but you sit, a ball rolls lower and pens go on the desk=up 是向上，可坐下、球往低处滚、笔放到桌上都是向下;into=into is to the inside, and *sit into* or *put pens into and listen* is not English=into 是向里，没有 *sit into*、*put pens into and listen* 的说法|down|ow said like *now*|ow 读作 *now*
      off|the light at sleep time;shoes;jumping from a table to the floor|off means away from or not working; on means on top or working|off 是离开或关掉；on 是在上面或打开|on=on means working or on top, but it is time to sleep, the shoes come off and the cat lands on the floor=on 是打开或在上面，可要睡觉了，鞋要脱掉，猫落到地上;into=into is to the inside, and you do not turn into a light or take into your shoes=into 是向里，不能 turn into 灯或 take into 鞋|off|a double f, so not *of*|双写 f，不是 *of*
      over|a bird high above a house;a dog across a wall;a movie that ended|over is above or across; under is below|over 是上方或越过；under 是下方|under=under is below, but a bird flies high, a dog jumps to the other side and a movie that ended is over=under 是下方，可鸟飞得高，狗跳到墙那边，电影已经结束;into=into is to the inside, and a bird does not fly high into a house or a dog jump into a wall to the other side=into 是向里，鸟不会高高飞进房子，狗也不会跳进墙到另一边|o · ver|o said like *go*, then -ver|o 读作 *go*，后面是 -ver
      by|a bus;sitting next to me;next to the lamp|by means next to or using; for says who gets it|by 是旁边或乘坐；for 说给谁|for=for says who gets it, but here it is how you travel and where things are=for 说给谁，可这里说的是怎么去和在哪里;into=into is to the inside, and you do not go into bus or sit into me=into 是向里，没有 go into bus 或 sit into me 的说法|by|y said like *eye*|y 读作 *eye*
      into|toys in a box;walking in a room;a frog in the water|into is to the inside; out is away from the inside|into 是进到里面；out 是向外|out=out is away from the inside, but the toys, she and the frog go inside=out 是向外，可玩具、她和青蛙都进到里面;off=off is away from a top, not to the inside of a box, a room or water=off 是离开上面，不是进到箱子、房间或水里|in · to|*in* + *to*, one word|*in* 加 *to*，一个词
      just|only looking;only a small cat;a moment ago|just means only or a moment ago; very makes a word stronger|just 是只是或刚刚；very 加强语气|very=very goes before words like *big* or *happy*, and *very looking*, *very a small cat* and *very got* are not English=very 放在 *big*、*happy* 这类词前，没有 *very looking*、*very a small cat*、*very got* 的说法;too=too means more than you want or also, and *too looking*, *too a small cat* and *too got* are not English=too 是太或也，没有 *too looking*、*too a small cat*、*too got* 的说法|just|u said like the u in *up*|u 读作 *up* 里的 u
      really|good cake;liking it for sure;sorry|really means very or truly; much goes with *very* or *so*|really 是非常或真的；much 常和 *very*、*so* 连用|much=much is for amounts, and *much good*, *much like it* and *much sorry* are not English=much 说数量，没有 *much good*、*much like it*、*much sorry* 的说法;why=why asks for a reason, and *why good*, *do you why like it* and *I'm why sorry* are not English=why 问原因，没有 *why good*、*do you why like it*、*I'm why sorry* 的说法|re · al · ly|*real* + *-ly*, with a double l|*real* 加 *-ly*，双写 l
      why|an answer with because;the sky's color as a reason;a reason she is angry|why asks for a reason; what asks about a thing|why 问原因；what 问东西|what=what asks about a thing, but the answers here are reasons with *because*, and *what is the sky blue* is not English=what 问东西，可这里的回答是 *because* 说的原因，也没有 *what is the sky blue* 的说法;where=where asks about a place, but *because* and *is it because* give reasons, not places=where 问地点，可 *because* 和 *is it because* 说的是原因，不是地点|why|wh with a silent h, and y said like *eye*|wh 里 h 不发音，y 读作 *eye*
    `,
  },
});

// The -s of he, she and it.

/** routines are a verb, its form after he or she, and the rest of a sentence about a day. */
const routines: readonly (readonly [verb: string, third: string, rest: string, wrong: string])[] = [
  ["get", "gets", "up at seven", "getes"],
  ["go", "goes", "to school by bus", "gos"],
  ["watch", "watches", "TV after dinner", "watchs"],
  ["play", "plays", "football on Sundays", "plaies"],
  ["study", "studies", "English every day", "studys"],
  ["have", "has", "breakfast at eight", "haves"],
  ["do", "does", "homework after school", "dos"],
  ["finish", "finishes", "work at five", "finishs"],
  ["work", "works", "in a hospital", "workes"],
  ["wash", "washes", "the dishes after dinner", "washs"],
  ["walk", "walks", "to school with a friend", "walkes"],
  ["brush", "brushes", "the dog every week", "brushs"],
  ["read", "reads", "a book before bed", "reades"],
];

/** singleSubjects take the -s form. */
const singleSubjects: readonly string[] = [
  "She",
  "He",
  "Tom",
  "My mom",
  "Lily",
  "My brother",
  "Our teacher",
  "My dad",
  "Anna",
  "My sister",
  "Ben",
];

const thirdChoiceBank: readonly ChoiceItem[] = everyPair(singleSubjects, routines).map(
  ([subject, [verb, third, rest, wrong]]): ChoiceItem => [`${subject} ___ ${rest}. (${verb})`, third, [verb, wrong]],
);

const thirdTypedBank: readonly TypedItem[] = everyPair(singleSubjects, routines).map(
  ([subject, [verb, third, rest, wrong]]): TypedItem => ({
    shown: `${subject} ___ ${rest}. (${verb})`,
    accepted: [third],
    wrong: [verb, wrong],
  }),
);

const thirdFixBank: readonly TypedItem[] = everyPair([...singleSubjects.slice(5), ...singleSubjects.slice(0, 5)], routines).map(
  ([subject, [verb, third, rest, wrong]]): TypedItem => ({
    shown: `${subject} ${verb} ${rest}.`,
    accepted: [`${subject} ${third} ${rest}.`],
    wrong: [`${subject} ${verb} ${rest}.`, `${subject} ${wrong} ${rest}.`],
  }),
);

/** thirdRule says how a verb makes its form after he, she or one person, in every locale. */
const thirdRule = (verb: string, third: string): Text => {
  if (verb === "have") return t("*have* is irregular: after one person it becomes *has*", "*have* 不规则：单数第三人称后变成 *has*");
  if (third.endsWith("ies"))
    return t(`*${verb}* ends in a consonant and *y*, so *y* becomes *-ies*`, `*${verb}* 以辅音字母加 *y* 结尾，变 *y* 为 *-ies*`);
  if (third.endsWith("es"))
    return t(
      `*${verb}* ends in *${verb.match(/(ch|sh|s|x|o)$/u)?.[0]}*, so it adds *-es*`,
      `*${verb}* 以 *${verb.match(/(ch|sh|s|x|o)$/u)?.[0]}* 结尾，所以加 *-es*`,
    );
  return t(`*${verb}* just adds *-s*`, `*${verb}* 直接加 *-s*`);
};

/** thirdWhy explains the -s form in a gapped sentence about one person. */
const thirdWhy = (right: string, shown: string): Text => {
  const sentence = shown.replace(/ \(.*\)$/u, "").replace("___", `*${right}*`);
  const verb = shown.match(/\((.*)\)$/u)?.[1] ?? "";
  const rule = thirdRule(verb, right);
  return t(
    `*${shown.split(" ___")[0]}* is one person, so the verb needs an ending, and ${rule.en}: ${sentence}\n\n**Check.** Look at the base verb *${verb}*—its final letters tell you whether to add *-s*, *-es*, change *y* to *-ies*, or use *has*.`,
    `*${shown.split(" ___")[0]}* 是单个的人，动词要加词尾；${rule["zh-CN"]}：${sentence}\n\n**检验。** 看原形动词 *${verb}* 的末尾字母——据此确认是加 *-s*、加 *-es*、变 *y* 为 *-ies*，还是用不规则的 *has*。`,
  );
};

const thirdPersonS: TopicDef = {
  id: "third-person-s",
  title: t("He Plays, She Watches", "He plays, she watches：动词加 -s"),
  summary: t(
    "After he, she, it or one person, a verb in the present simple ends in -s or -es.",
    "主语是 he、she、it 或单个的人时，一般现在时的动词加 -s 或 -es。",
  ),
  intro: t(
    "Compare *I walk to school* with *Ben walks to school*, and *I wash the dishes* with *My mom washes the dishes*. Whenever the subject is *he*, *she*, *it*, or one person, the present-simple verb takes an ending (*-s*, *-es*, *-ies*, or *has*). In this topic, you choose, spell, and fix third-person singular verbs.",
    "比较 *I walk to school* 和 *Ben walks to school*，以及 *I wash the dishes* 和 *My mom washes the dishes*。只要主语是 *he*、*she*、*it* 或单个的人，一般现在时的动词就要变化词尾（*-s*、*-es*、*-ies* 或 *has*）。本主题带你选择、拼写并改正第三人称单数动词。",
  ),
  prerequisites: ["present-simple", "he-she-and-it"],
  encompasses: [{ topic: "present-simple", weight: 0.5 }],
  xp: 20,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("Adding -s after he and she", "he 和 she 后面加 -s"),
      t(
        "After *he*, *she*, *it* or one person, the verb ends in *-s*: *She gets up at seven. Tom plays football.*\n\nAdd *-es* after *ch*, *sh*, *s*, *x* and *o*: *watches*, *brushes*, *goes*, *does*. A consonant and *y* becomes *-ies*: *study* → *studies*. *Have* becomes *has*.\n\n> **Watch out.** Check the letter right before *y*: *study* (consonant + *y*) becomes *studies*, while *play* (vowel + *y*) simply adds *-s* (*plays*, never *plaies*).",
        "主语是 *he*、*she*、*it* 或单个的人时，动词要加 *-s*：*She gets up at seven. Tom plays football.* 中文动词从不变化，所以漏掉这个 *-s* 是最常见的错误。\n\n以 *ch*、*sh*、*s*、*x*、*o* 结尾的动词加 *-es*：*watches*、*brushes*、*goes*、*does*。辅音字母加 *y* 结尾的，变 *y* 为 *i* 再加 *-es*：*study* → *studies*。*have* 变成 *has*。\n\n> **注意。** 看清 *y* 前面的字母：*study*（辅音 + *y*）变成 *studies*，而 *play*（元音 + *y*）直接加 *-s*（*plays*，绝不是 *plaies*）。",
      ),
      choiceGenerator(
        t("Choose the word for the gap.", "选出填入空白处的词。"),
        thirdChoiceBank,
        (right, shown) => thirdWhy(right, shown),
        (wrong, _right, shown, position) =>
          position === 0
            ? t(
                `*${wrong}* has no ending, but after one person like *${shown.split(" ___")[0]}* the verb needs one.`,
                `*${wrong}* 没有词尾，可主语是 *${shown.split(" ___")[0]}* 这样的单个人时，动词要加词尾。`,
              )
            : t(
                `*${wrong}* is not how this verb is spelled: *-es* goes after *ch*, *sh*, *s*, *x* and *o*, and *-ies* only after a consonant and *y*.`,
                `*${wrong}* 拼错了：*-es* 用在 *ch*、*sh*、*s*、*x*、*o* 后面，*-ies* 只用在辅音字母加 *y* 后面。`,
              ),
      ),
    ),
    point(
      "spell",
      t("Spelling the -s form", "拼写 -s 形式"),
      t(
        "Type the verb with its ending after one person: most verbs add *-s* (*works*), verbs that end in *ch*, *sh*, *s*, *x* or *o* add *-es* (*finishes*, *goes*), a consonant and *y* becomes *-ies* (*studies*), and *have* becomes *has*.\n\n> **Watch out.** Never write *haves*, *gos*, or *dos*—remember the special spellings *has*, *goes*, and *does*.",
        "写出单数第三人称后加了词尾的动词：大多数动词加 *-s*（*works*）；以 *ch*、*sh*、*s*、*x*、*o* 结尾的加 *-es*（*finishes*、*goes*）；辅音字母加 *y* 结尾的变成 *-ies*（*studies*）；*have* 变成 *has*。\n\n> **注意。** 切勿写成 *haves*、*gos* 或 *dos*——牢记特殊拼写 *has*、*goes* 和 *does*。",
      ),
      typedGenerator("word-form", t("Type the verb in the right form.", "输入动词的正确形式。"), thirdTypedBank, thirdWhy),
    ),
    point(
      "fix",
      t("Finding the missing -s", "找出漏掉的 -s"),
      t(
        "Each sentence is about one person, like *Tom* or *my mom*, but its verb has no ending, the way a Chinese verb never changes: *Ben finish work at five.* → *Ben finishes work at five.* Give the verb the ending it needs and write the sentence again.\n\n> **Watch out.** Change only the verb's ending—keep the subject, the rest of the sentence, the capital letter, and the period intact.",
        "每个句子说的都是一个人，比如 *Tom* 或 *my mom*，但动词像中文一样没有变化：*Ben finish work at five.* → *Ben finishes work at five.* 给动词加上需要的词尾，把句子重写一遍。\n\n> **注意。** 只改动词词尾——主语、其余部分、句首大写和句末句号都保持不变。",
      ),
      typedGenerator("sentence", t("Fix the sentence.", "改正这个句子。"), thirdFixBank, (right, shown) => {
        const subject = singleSubjects.find((s) => shown.startsWith(`${s} `)) ?? "";
        const verb = shown.slice(subject.length + 1).split(" ")[0] ?? "";
        const third = right.slice(subject.length + 1).split(" ")[0] ?? "";
        const rule = thirdRule(verb, third);
        return t(
          `*${subject}* is one person, so the verb needs an ending, and ${rule.en}: ${shown} → ${right}\n\n**Check.** Verify that *${verb}* changed to *${third}* after singular subject *${subject}* while every other word stayed unchanged.`,
          `*${subject}* 是单个的人，动词要加词尾；${rule["zh-CN"]}：${shown} → ${right}\n\n**检验。** 确认单数主语 *${subject}* 后的 *${verb}* 已改为 *${third}*，句子其余部分保持不变。`,
        );
      }),
    ),
  ],
};

// Always, usually, sometimes, never.

/** frequencyVerbs are routines with a plain subject and a verb. */
const frequencyActions: readonly (readonly [subject: string, verb: string, rest: string])[] = [
  ["I", "get", "up at seven"],
  ["We", "walk", "to school"],
  ["She", "watches", "TV after dinner"],
  ["They", "play", "football on Saturday"],
  ["Tom", "eats", "rice for lunch"],
  ["My dad", "works", "at home"],
  ["I", "do", "my homework after school"],
  ["You", "brush", "your teeth at night"],
  ["Lily", "reads", "before bed"],
  ["He", "rides", "his bike to school"],
  ["We", "have", "pizza on Friday"],
  ["My sister", "plays", "the piano after school"],
  ["They", "go", "to the park on Sunday"],
  ["I", "drink", "milk at breakfast"],
  ["Ben", "takes", "the bus to school"],
  ["My mom", "cooks", "dinner"],
  ["You", "help", "your dad on Saturday"],
  ["Anna", "walks", "the dog in the morning"],
  ["We", "eat", "fish on Friday"],
  ["My grandpa", "sleeps", "after lunch"],
  ["The cat", "sleeps", "on my bed"],
  ["They", "watch", "a film on Friday night"],
];

/** frequencyStates are sentences with be, where the word goes after the verb. */
const frequencyStates: readonly (readonly [subject: string, be: string, rest: string])[] = [
  ["I", "am", "tired on Monday"],
  ["She", "is", "late for school"],
  ["They", "are", "at home on Sunday"],
  ["The bus", "is", "full"],
  ["We", "are", "happy at the weekend"],
  ["He", "is", "hungry after school"],
  ["My mom", "is", "busy"],
  ["The shop", "is", "open on Sunday"],
  ["My room", "is", "clean"],
  ["Our teacher", "is", "kind"],
  ["You", "are", "late"],
  ["The park", "is", "busy at the weekend"],
];

/** placedAdverbs are the words of frequency that can't also end a sentence, so a sentence ending in one is wrong. */
const placedAdverbs: readonly string[] = ["always", "usually", "never"];

const frequencyChoiceBank: readonly ChoiceItem[] = interleave([
  everyPair(frequencyActions, placedAdverbs).map(
    ([[subject, verb, rest], adverb]): ChoiceItem => [
      `${subject} / ${verb} ${rest} (${adverb})`,
      `${subject} ${adverb} ${verb} ${rest}.`,
      [`${subject} ${verb} ${adverb} ${rest}.`, `${subject} ${verb} ${rest} ${adverb}.`],
    ],
  ),
  everyPair(frequencyStates, placedAdverbs).map(
    ([[subject, be, rest], adverb]): ChoiceItem => [
      `${subject} / ${be} ${rest} (${adverb})`,
      `${subject} ${be} ${adverb} ${rest}.`,
      [`${subject} ${adverb} ${be} ${rest}.`, `${subject} ${be} ${rest} ${adverb}.`],
    ],
  ),
]);

const frequencyTypedBank: readonly TypedItem[] = interleave([
  everyPair(frequencyActions, [...placedAdverbs].reverse()).map(
    ([[subject, verb, rest], adverb]): TypedItem => ({
      shown: `${subject} ${verb} ${rest}. (${adverb})`,
      accepted: [`${subject} ${adverb} ${verb} ${rest}.`],
      wrong: [`${subject} ${verb} ${adverb} ${rest}.`, `${subject} ${verb} ${rest} ${adverb}.`],
      instruction: t("Put the word in brackets in the sentence.", "把括号里的词放进句子。"),
    }),
  ),
  everyPair(frequencyStates, [...placedAdverbs].reverse()).map(
    ([[subject, be, rest], adverb]): TypedItem => ({
      shown: `${subject} ${be} ${rest}. (${adverb})`,
      accepted: [`${subject} ${be} ${adverb} ${rest}.`],
      wrong: [`${subject} ${adverb} ${be} ${rest}.`, `${subject} ${be} ${rest} ${adverb}.`],
      instruction: t("Put the word in brackets in the sentence.", "把括号里的词放进句子。"),
    }),
  ),
]);

/** frequencyWhy says where a word like always goes in a sentence, before the verb or after be. */
const frequencyWhy = (right: string, shown: string): Text => {
  const adverb = shown.match(/\((\w+)\)$/u)?.[1] ?? "";
  const verb = (shown.includes(" / ") ? shown.split(" / ")[1] : shown.split(" ").slice(1).join(" "))?.split(" ")[0] ?? "";
  return ["am", "is", "are"].includes(verb)
    ? t(
        `*${adverb}* goes after *${verb}*, not before it: ${right}\n\n**Check.** Spot the verb *${verb}*—because it is a form of *be*, *${adverb}* sits right after it (not before it and not at the end).`,
        `*${adverb}* 放在 *${verb}* 后面，而不是前面：${right}\n\n**检验。** 找到动词 *${verb}*——它是 *be* 动词，所以 *${adverb}* 紧跟在它后面（不在前面，也不在句末）。`,
      )
    : t(
        `*${adverb}* goes in the middle of the sentence, right before a verb like *${verb}*: ${right}\n\n**Check.** Spot the action verb *${verb}*—because it is not *be*, *${adverb}* sits right in front of it (never at the end of the sentence).`,
        `*${adverb}* 放在句子中间，紧挨在 *${verb}* 这样的动词前面：${right}\n\n**检验。** 找到实义动词 *${verb}*——它不是 *be*，所以 *${adverb}* 紧挨在它前面（绝不放在句末）。`,
      );
};

/** whyNotFrequency says where a wrong sentence puts a word like always. */
const whyNotFrequency = (_wrong: string, _right: string, shown: string, position: number): Text => {
  const verb = shown.split(" / ")[1]?.split(" ")[0] ?? "";
  if (position === 1)
    return t(
      "This puts the word at the end, as a Chinese speaker might, but it goes in the middle, next to the verb.",
      "这句把这个词放在了句末，可它要放在句子中间，紧挨着动词。",
    );
  return ["am", "is", "are"].includes(verb)
    ? t(
        `This puts the word before *${verb}*, but with *am*, *is* and *are* it goes after.`,
        `这句把这个词放在了 *${verb}* 前面，可遇到 *am*、*is*、*are* 时要放在后面。`,
      )
    : t(
        `This puts the word after *${verb}*, but with a verb like this it goes before.`,
        `这句把这个词放在了 *${verb}* 后面，可遇到这样的动词时要放在前面。`,
      );
};

const adverbsOfFrequency: TopicDef = {
  id: "adverbs-of-frequency",
  title: t("Always, Usually, Never", "always、usually、never：频度副词"),
  summary: t(
    "I always get up at seven. She is never late. These words go before the verb, but after am, is and are.",
    "I always get up at seven. She is never late. 这些词放在动词前，但放在 am、is、are 之后。",
  ),
  intro: t(
    "Compare *We usually walk to school.* with *The bus is usually full.* Notice the flip: frequency words like *always*, *usually*, and *never* stand *before* ordinary verbs (*walk*) but *after* *am*, *is*, and *are*. In this topic, you place frequency adverbs in the exact right slot.",
    "比较 *We usually walk to school.* 和 *The bus is usually full.* 注意位置变化：*always*、*usually*、*never* 等频度副词放在实义动词（*walk*）*前面*，但放在 *am*、*is*、*are* *后面*。本主题带你把频度副词放到准确位置。",
  ),
  prerequisites: ["present-simple", "a1-words-how-often"],
  encompasses: [{ topic: "a1-words-how-often", weight: 0.4 }],
  xp: 15,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("Where the word goes", "这些词放在哪里"),
      t(
        "*always* (every time), *usually*, *often*, *sometimes*, *never* (not at any time).\n\nThey go before the verb: *I always get up at seven.* But they go after *am*, *is* and *are*: *She is never late.*\n\n> **Watch out.** Check whether the verb is *am/is/are* or an action verb before placing the adverb, and never push *always*, *usually*, or *never* to the very end of the sentence.",
        "*always*（总是）、*usually*（通常）、*often*（经常）、*sometimes*（有时）、*never*（从不）。\n\n它们放在一般动词前面：*I always get up at seven.* 但放在 *am*、*is*、*are* 后面：*She is never late.* 不要像中文“我七点起床总是”那样放在句末。\n\n> **注意。** 放词前先看谓语是 *am/is/are* 还是实义动词，且切勿把 *always*、*usually*、*never* 放到句末。",
      ),
      choiceGenerator(
        t("Which sentence puts the word in the right place?", "哪个句子把这个词放对了位置？"),
        frequencyChoiceBank,
        frequencyWhy,
        whyNotFrequency,
      ),
    ),
    point(
      "write",
      t("Putting the word in", "把词放进句子"),
      t(
        "Write the sentence with the word: before a verb like *get* or *walk* (*Tom usually eats rice*), and after *am*, *is* or *are* (*My room is always clean*).\n\n> **Watch out.** Keep every other word in the sentence unchanged—just drop the bracketed adverb into the one right slot next to the verb.",
        "把这个词放进句子：放在 *get*、*walk* 这样的动词前（*Tom usually eats rice*），放在 *am*、*is*、*are* 后（*My room is always clean*）。\n\n> **注意。** 句子其余词保持不变，只需把括号里的频度副词准确放进紧挨动词的那一侧。",
      ),
      typedGenerator("sentence", t("Write the sentence again.", "重写这个句子。"), frequencyTypedBank, frequencyWhy),
    ),
  ],
};

// Writing about routines.

/** clock turns an hour into digits and words. */
const clock: Readonly<Record<number, readonly [digits: string, words: string]>> = {
  4: ["4:00", "four"],
  5: ["5:00", "five"],
  6: ["6:00", "six"],
  7: ["7:00", "seven"],
  8: ["8:00", "eight"],
  9: ["9:00", "nine"],
  10: ["10:00", "ten"],
  12: ["12:00", "twelve"],
};

const routineNames: readonly string[] = ["Lily", "Tom", "My mom", "Ben", "My sister", "Our teacher"];

/** routineNotes are a routine, its -s form and two likely hours for it. */
const routineNotes: readonly (readonly [verb: string, third: string, hours: readonly [number, number]])[] = [
  ["get up", "gets up", [6, 7]],
  ["have breakfast", "has breakfast", [7, 8]],
  ["go to school", "goes to school", [8, 7]],
  ["eat lunch", "eats lunch", [12, 12]],
  ["finish school", "finishes school", [4, 5]],
  ["watch TV", "watches TV", [7, 8]],
  ["go to bed", "goes to bed", [9, 10]],
  ["do homework", "does homework", [5, 6]],
  ["feed the cat", "feeds the cat", [7, 6]],
  ["walk the dog", "walks the dog", [6, 5]],
  ["come home", "comes home", [5, 4]],
];

const routineItems = pairUp(42, routineNames, routineNotes).map(([name, [verb, third, hours]], k) => {
  const [digits, words] = clock[hours[Math.floor(k / routineNotes.length) % 2] ?? 7] ?? ["7:00", "seven"];
  const note = `${name} / ${verb} / ${digits}`;
  const right = `${name} ${third} at ${words} o'clock.`;
  return { note, right, pattern: `${name} ${third} at [${words}( o'clock)|${digits}].`, verb, words, name };
});

const routineTypedBank: readonly TypedItem[] = routineItems.map(
  ({ note, right, pattern, verb, words, name }): TypedItem => ({
    shown: note,
    accepted: [pattern],
    canonical: right,
    wrong: [`${name} ${verb} at ${words} o'clock.`, `${name} at ${words} o'clock ${verb}.`],
  }),
);

const routineChoiceBank: readonly ChoiceItem[] = routineItems.map(
  ({ note, right, verb, words, name }, i): ChoiceItem => [
    note,
    right,
    [
      `${name} ${verb} at ${words} o'clock.`,
      `At ${words} o'clock ${name.charAt(0).toLowerCase()}${name.slice(1)} ${i % 2 === 0 ? verb : (right.slice(name.length + 1).split(" at ")[0] ?? verb)}.`,
    ],
  ],
);

/** routineWhy explains a sentence about a routine from its note: the -s after one person, then at and the time. */
const routineWhy = (right: string, shown: string): Text => {
  const [name = "", verb = ""] = shown.split(" / ");
  const third = right.slice(name.length + 1).split(" at ")[0] ?? "";
  return t(
    `*${name}* is one person, so *${verb}* becomes *${third}*, and the time goes last, after *at*: ${right}\n\n**Check.** Verify all three pieces in order: *${name}* (who) + *${third}* (with third-person ending) + *at [time]* at the end, closing with a period.`,
    `*${name}* 是单个的人，所以 *${verb}* 变成 *${third}*；时间放在句末，前面加 *at*：${right}\n\n**检验。** 按顺序核对三处：主语 *${name}* + 带单三词尾的 *${third}* + 句末的 *at [时间]*，并以句号结尾。`,
  );
};

const routinesWriting: TopicDef = {
  id: "writing-sentences-about-routines",
  title: t("Writing About Routines", "写日常作息"),
  summary: t(
    "Turn notes into sentences about a day: Lily / get up / 7:00 becomes Lily gets up at seven o'clock.",
    "把笔记写成描述一天的句子：Lily / get up / 7:00 写成 Lily gets up at seven o'clock.",
  ),
  intro: t(
    "Turn a short schedule note like `Tom / eat lunch / 12:00` into a natural English sentence: *Tom eats lunch at twelve o'clock.* Three small details turn notes into real sentences—the third-person verb ending, *at* before the clock time, and putting the time at the end. In this topic, you pick and write complete routine sentences from notes.",
    "把作息笔记 `Tom / eat lunch / 12:00` 写成自然的英语句子：*Tom eats lunch at twelve o'clock.* 三个细节把笔记变成完整句子——单三动词词尾、钟点前的 *at*，以及把时间放在句末。本主题带你把笔记准确写成日常作息句。",
  ),
  prerequisites: ["third-person-s", "writing-capitals-and-periods"],
  encompasses: [
    { topic: "third-person-s", weight: 0.4 },
    { topic: "writing-capitals-and-periods", weight: 0.2 },
  ],
  xp: 20,
  strand: "writing",
  knowledgePoints: [
    point(
      "choose",
      t("The sentence for a note", "选出符合笔记的句子"),
      t(
        "A note gives who, what and when. The sentence keeps that order and adds what the note leaves out: the *-s* after one person, *at* before the time, a capital letter and a period.\n\n*Lily / get up / 7:00* → *Lily gets up at seven o'clock.*\n\n> **Watch out.** Check *both* the verb ending (*gets*, *has*, *goes*, *watches*) and the word order—do not put *At seven o'clock* in front of the subject.",
        "笔记给出“谁、做什么、什么时候”。写成句子时保持这个顺序，并补上笔记省略的部分：单数主语后动词加 *-s*，时间前加 *at*，句首大写，句末加句号。\n\n*Lily / get up / 7:00* → *Lily gets up at seven o'clock.*\n\n注意时间放在句末，不像中文“莉莉七点起床”那样放在动词前。\n\n> **注意。** 同时核对动词词尾（*gets*、*has*、*goes*、*watches*）和语序——不要把 *At seven o'clock* 放到主语前面。",
      ),
      choiceGenerator(
        t("Choose the sentence that matches the note.", "选出与笔记相符的句子。"),
        routineChoiceBank,
        routineWhy,
        (wrong, _right, shown, position) =>
          position === 0
            ? t(
                "This leaves the verb as it is in the note, but after one person it needs *-s*.",
                "这句的动词照抄了笔记，可单数主语后的动词要加 *-s*。",
              )
            : !wrong.endsWith(` ${shown.split(" / ")[1] ?? ""}.`)
              ? t(
                  "The verb has its *-s*, but this puts the time first, as Chinese does. In English the time goes last, after *at*.",
                  "这句动词加了 *-s*，却像中文一样把时间放在前面。英语里时间要放在句末，前面加 *at*。",
                )
              : t(
                  "This puts the time first, as Chinese does, and leaves out the *-s* the verb needs after one person.",
                  "这句像中文一样把时间放在前面，单数主语后的动词也漏了 *-s*。",
                ),
      ),
    ),
    point(
      "write",
      t("Writing the sentence", "写出句子"),
      t(
        "Write a whole sentence for the note, such as *Ben / do homework / 5:00* → *Ben does homework at five o'clock.* You can write the time in words or in numbers: *at seven o'clock* or *at 7:00*.\n\n> **Watch out.** Do not copy the base verb unchanged (*have* -> *has*, *go* -> *goes*, *do* -> *does*, *finish* -> *finishes*), and remember *at* before the time.",
        "根据笔记写一个完整的句子，例如 *Ben / do homework / 5:00* → *Ben does homework at five o'clock.* 时间可以用英文单词或数字表示：*at seven o'clock* 或 *at 7:00*。\n\n> **注意。** 不要直接照抄原形动词（*have* -> *has*、*go* -> *goes*、*do* -> *does*、*finish* -> *finishes*），也别漏掉时间前的 *at*。",
      ),
      typedGenerator("sentence-pattern", t("Write a sentence from the note.", "根据笔记写一个句子。"), routineTypedBank, routineWhy),
    ),
  ],
};

/** topics are the topics of the unit My Day. */
export const topics: readonly TopicDef[] = [
  myDay.topic,
  timesOfDay.topic,
  howOften.topic,
  littleWords1.topic,
  thirdPersonS,
  adverbsOfFrequency,
  routinesWriting,
];

/** vocabulary are the words the unit My Day teaches. */
export const vocabulary: readonly WordBatch[] = [myDay.batch, timesOfDay.batch, howOften.batch, littleWords1.batch];
