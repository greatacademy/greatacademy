// A1, unit 3: Time and Dates. Telling the time, days, months and dates, at, on and in for time, and capital letters
// for names.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { everyPair, interleave, sentenceCase, vocabularyTopic, word } from "../words.ts";

const time = vocabularyTopic({
  id: "a1-words-time",
  title: t("Telling the Time", "看时间"),
  summary: t("O'clock, half past, a quarter past, minutes and hours, early and late.", "整点、半点、一刻钟，分钟和小时，早和晚。"),
  intro: t(
    "Look at the **clock**: it's **half** **past** seven. School starts at eight **o'clock**, so we aren't **late**. These words help you tell the time.",
    "看 **clock**（钟）：现在是七点 **half**（半）**past**（过）。学校八 **o'clock**（点整）上课，所以我们没 **late**（迟到）。这些词帮你说时间。",
  ),
  prerequisites: ["a1-words-times-of-day"],
  words: [
    word(
      "time times",
      "what a clock shows; the hour and the minutes",
      "时间；时刻",
      "What {time} is it? — It's half past three. | It's {time} for bed. Good night! | We have no {time}. Hurry up!",
      "clock hour",
    ),
    word(
      "clock clocks",
      "a thing on a wall or a table that shows the time",
      "钟",
      "Look at the {clock}. It's ten o'clock. | The {clock} in the kitchen is slow. | There is a big {clock} on the station wall.",
      "minute hour",
    ),
    word(
      "o'clock",
      "used after a number from one to twelve to say an hour",
      "……点钟（整点）",
      "School starts at eight {o'clock}. | It's six {o'clock}. Time for dinner! | At nine {o'clock} I go to bed.",
      "half quarter",
    ),
    word(
      "half halves",
      "one of two equal parts",
      "一半；半",
      "It's {half} past seven: seven thirty. | Thirty minutes is {half} an hour. | Cut the apple in {half}, one part for you and one for me.",
      "quarter hour",
    ),
    word(
      "quarter quarters",
      "one of four equal parts; fifteen minutes",
      "四分之一；一刻钟",
      "It's a {quarter} past nine: nine fifteen. | Fifteen minutes is a {quarter} of an hour. | Cut the pizza into four. Each {quarter} is for one of us.",
      "half minute",
    ),
    word(
      "past",
      "after; used to say the minutes after an hour",
      "（时间）过；在……之后",
      "It's half {past} six: six thirty. | It's ten {past} four: four ten. | We walked {past} the school without going in.",
      "to before",
    ),
    word(
      "minute minutes",
      "sixty seconds; there are sixty in an hour",
      "分钟",
      "Wait a {minute}, please. I'm coming. | There are sixty {minutes} in an hour.|hours weeks | The bus comes in five {minutes}. It's almost here!|hours weeks",
      "hour week",
    ),
    word(
      "hour hours",
      "sixty minutes",
      "小时",
      "There are twenty-four {hours} in a day. | The movie is two {hours} long. | I sleep for nine {hours} every night.",
      "minute week",
    ),
    word(
      "week weeks",
      "seven days",
      "星期；周",
      "There are seven days in a {week}. | We have English three times a {week}. | We visit Grandma next {week}, in seven days.",
      "hour minute",
    ),
    word(
      "weekend weekends",
      "Saturday and Sunday",
      "周末",
      "We have no school on the {weekend}. We play all day. | Saturday and Sunday are the {weekend}. | What do you do on the {weekend}? — I visit my grandma.",
      "week hour",
    ),
    word(
      "late later latest",
      "after the right time",
      "迟的；晚",
      "Hurry! We are {late} for school! | The bus came at nine, not eight. It was {late}. | It's {late}. Go to bed now.",
      "early ready",
    ),
    word(
      "early earlier earliest",
      "before the usual or right time",
      "早的；早",
      "I get up {early}, at five o'clock. | The class starts at nine. We are {early}: it's only eight thirty. | Let's go to bed {early} tonight. We're tired.",
      "late ready",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "Read the numbers after the colon: *seven thirty* is *half past seven*, *nine fifteen* is *a quarter past nine*, and an hour with no minutes is *o'clock*.",
        "看冒号后的数字：*seven thirty* 是 *half past seven*，*nine fifteen* 是 *a quarter past nine*，没有分钟的整点用 *o'clock*。",
      ),
      meaning: t(
        "A *minute* is sixty seconds, an *hour* is sixty minutes, and a *week* is seven days. You are *late* after the right time and *early* before it.",
        "*minute* 是六十秒，*hour* 是六十分钟，*week* 是七天。过了该到的时间是 *late*，还没到就是 *early*。",
      ),
      spell: t(
        "*Hour* starts with a silent h, so we say *an hour*. *O'clock* has an apostrophe, and *half* has a silent l.",
        "*hour* 开头的 h 不发音，所以说 *an hour*。*o'clock* 里有撇号，*half* 里的 l 不发音。",
      ),
    },
    notes: `
      time|half past three;bed;no time so hurry|time is what a clock shows; a clock is the thing that shows it|time 是钟显示的时间；clock 是显示时间的东西|clock=clock is the thing on the wall, so you do not ask *what clock is it*, and it is not *clock for bed*=clock 是墙上的钟，不问 *what clock is it*，也没有 *clock for bed*;hour=hour is sixty minutes, but *half past three*, *hour for bed* and *no hour* do not fit=hour 是六十分钟，可 *half past three*、*hour for bed*、*no hour* 都不合适|time|i said like *eye*, and a silent e|i 读作 *eye*，词尾 e 不发音
      clock|ten o'clock on it;slow in the kitchen;big on the station wall|a clock is a thing that shows the time; a minute is sixty seconds|clock 是钟；minute 是一分钟|minute=minute is a short time, so you cannot look at one, hang it on a wall or have it in a kitchen=minute 是一段时间，不能看它、挂在墙上，也不能放在厨房;hour=hour is sixty minutes, not a thing on a wall or in a kitchen=hour 是六十分钟，不是挂在墙上或放在厨房的东西|clock|ck at the end|结尾是 ck
      o'clock|eight for school;six for dinner;nine for bed|o'clock is an hour with no minutes; half is thirty minutes past|o'clock 是整点；half 是过了三十分钟|half=half needs *past*, as in *half past eight*, and *eight half* is not English=half 要和 *past* 连用，比如 *half past eight*，没有 *eight half* 的说法;quarter=quarter needs *a* and *past* or *to*, and *eight quarter* is not English=quarter 要说 *a quarter past* 或 *a quarter to*，没有 *eight quarter* 的说法|o'·clock|an apostrophe after the o|o 后面有撇号
      half|seven thirty;thirty minutes;two parts of an apple|half is one of two parts; a quarter is one of four parts|half 是两份之一；quarter 是四份之一|quarter=quarter is one of four parts or fifteen minutes, but seven thirty, thirty minutes and two parts are halves=quarter 是四份之一或十五分钟，可七点三十、三十分钟和两份都是一半;hour=hour is sixty minutes, and *hour past seven*, *hour an hour* and *in hour* are not English=hour 是六十分钟，没有 *hour past seven*、*hour an hour*、*in hour* 的说法|half|a silent l|l 不发音
      quarter|nine fifteen;fifteen minutes;one of four pizza parts|a quarter is one of four parts; a half is one of two|quarter 是四份之一；half 是两份之一|half=half is thirty minutes or one of two parts, but nine fifteen, fifteen minutes and four parts are quarters=half 是三十分钟或两份之一，可九点十五、十五分钟和四份都是四分之一;minute=minute is one sixtieth of an hour, not fifteen minutes or one of four pizza parts=minute 是一小时的六十分之一，不是十五分钟或四分之一个比萨|quar · ter|qu at the start, and ar said like *or*|开头是 qu，ar 读作 *or*
      past|six thirty;four ten;walking by the school|past is after the hour or going by something; to is before the hour|past 是几点过或从旁边经过；to 是差几分到几点|to=to is for minutes before the hour, but six thirty and four ten are after it, and *walked to the school without going in* does not fit=to 用于差几分到整点，可六点三十和四点十分都是过了整点，*walked to the school without going in* 也不合适;before=before is not used to tell the time, and *walked before the school* is not English=before 不用来报时，也没有 *walked before the school* 的说法|past|st at the end, the same sound as *passed*|结尾是 st，和 *passed* 同音
      minute|a short wait;sixty in an hour;five until the bus|a minute is sixty seconds; an hour is sixty minutes|minute 是六十秒；hour 是六十分钟|hour/hours=hour is sixty minutes, so *a hour* is not English, an hour does not have sixty hours and a bus that is almost here comes in less=hour 是六十分钟，没有 *a hour* 的说法，一小时没有六十小时，马上到的公交车也不用几小时;week/weeks=week is seven days, too long for a short wait or a bus that is almost here=week 是七天，太长，不是短暂等待或马上到的车|min · ute|-ute at the end|结尾是 -ute
      hour|twenty-four in a day;a two-hour movie;nine for sleep|an hour is sixty minutes; a minute is much shorter|hour 是六十分钟；minute 短得多|minute/minutes=minute is too short, as a day has more than twenty-four minutes and a movie or a night's sleep is longer=minute 太短，一天远不止二十四分钟，电影和一夜的睡眠也更长;week/weeks=week is seven days, so a day does not have twenty-four weeks=week 是七天，一天不会有二十四周|hour|a silent h, so *an hour*|h 不发音，所以说 *an hour*
      week|seven days;three times a week;in seven days|a week is seven days; an hour is sixty minutes|week 是七天；hour 是六十分钟|hour=hour is sixty minutes, so it does not have seven days, *a hour* is not English and next hour is not in seven days=hour 是六十分钟，没有七天，没有 *a hour* 的说法，下个小时也不是七天后;minute=minute is sixty seconds, not seven days=minute 是六十秒，不是七天|week|a double e|双写 e
      weekend|no school and play all day;Saturday and Sunday;visiting Grandma on days off|the weekend is Saturday and Sunday; a week is seven days|weekend 是周六和周日；week 是七天|week=week is all seven days, and most of them have school, so it is not just Saturday and Sunday=week 是全部七天，其中大多要上学，不只是周六和周日;hour=hour is sixty minutes, not a day with no school or Saturday and Sunday=hour 是六十分钟，不是不上学的日子或周六周日|week · end|*week* + *end*, one word|*week* 加 *end*，一个词
      late|hurrying for school;nine not eight;time to go to bed now|late means after the right time; early means before it|late 是晚了；early 是早|early=early means before the right time, but we hurry, the bus came after eight and it is bedtime now=early 是提早，可我们在赶时间，公交车八点后才来，现在该睡了;ready=ready means prepared, but *Hurry!*, *nine not eight* and *go to bed now* are about the hour=ready 是准备好，可 *Hurry!*、*nine not eight*、*go to bed now* 说的是时间|late|a silent e that makes the a say its name|词尾 e 不发音，让 a 读字母本音
      early|up at five;only eight thirty for nine;bed early because we're tired|early means before the usual time; late means after it|early 是早；late 是晚|late=late means after the right time, but five o'clock is early, eight thirty is before nine and tired people go to bed sooner=late 是晚，可五点很早，八点半在九点之前，累了就该早睡;ready=ready means prepared, and *get up ready* or *go to bed ready* does not tell the time=ready 是准备好，*get up ready*、*go to bed ready* 都不说时间|ear · ly|ear said like *er*, and y at the end|ear 读作 *er*，结尾是 y
    `,
  },
});

const days = vocabularyTopic({
  id: "a1-words-days",
  title: t("Days of the Week", "星期"),
  summary: t("Monday to Sunday, the month, next and last.", "星期一到星期日，月，next 和 last。"),
  intro: t(
    "School starts on **Monday** and ends on **Friday**. On **Saturday** I play football, and **next** **Sunday** I visit Grandma. These words help you plan your week.",
    "学校 **Monday**（星期一）开学，**Friday**（星期五）放学。**Saturday**（星期六）我踢足球，**next**（下个）**Sunday**（星期日）我去看奶奶。这些词帮你安排一周。",
  ),
  prerequisites: ["a1-words-times-of-day"],
  words: [
    word(
      "Monday Mondays",
      "the day after Sunday",
      "星期一",
      "{Monday} is the first day of the school week. | Sunday, then {Monday}, then Tuesday. | I don't like {Mondays}. The weekend is over!|Fridays Saturdays",
      "Friday Saturday",
    ),
    word(
      "Tuesday Tuesdays",
      "the day after Monday",
      "星期二",
      "Monday, {Tuesday}, Wednesday. | {Tuesday} comes after Monday. | Today is Monday, so tomorrow is {Tuesday}.",
      "Thursday Friday",
    ),
    word(
      "Wednesday Wednesdays",
      "the day after Tuesday",
      "星期三",
      "Tuesday, {Wednesday}, Thursday. | {Wednesday} is in the middle of the school week. | Today is Tuesday, so tomorrow is {Wednesday}.",
      "Monday Friday",
    ),
    word(
      "Thursday Thursdays",
      "the day after Wednesday",
      "星期四",
      "Wednesday, {Thursday}, Friday. | {Thursday} comes before Friday. | Today is Wednesday, so tomorrow is {Thursday}.",
      "Tuesday Monday",
    ),
    word(
      "Friday Fridays",
      "the day after Thursday; the last school day of the week",
      "星期五",
      "{Friday} is the last day of the school week. | Thursday, {Friday}, Saturday. | Today is Thursday, so tomorrow is {Friday}.",
      "Monday Tuesday",
    ),
    word(
      "Saturday Saturdays",
      "the day after Friday; the first day of the weekend",
      "星期六",
      "{Saturday} is the first day of the weekend. | Friday, {Saturday}, Sunday. | Today is Friday, so tomorrow is {Saturday}.",
      "Monday Wednesday",
    ),
    word(
      "Sunday Sundays",
      "the day after Saturday",
      "星期日",
      "{Sunday} is the last day of the weekend. | Saturday, {Sunday}, Monday. | Today is Saturday, so tomorrow is {Sunday}.",
      "Monday Friday",
    ),
    word(
      "month months",
      "one of the twelve parts of a year, like May",
      "月；月份",
      "There are twelve {months} in a year.|weeks days | May is my favorite {month}. | My birthday is next {month}, in June.",
      "week day",
    ),
    word(
      "next",
      "the one after this one",
      "下一个的",
      "See you {next} week. That's seven days from now! | This week is Monday's test. {Next} week is the art show.|Last Every | Who is {next}? It's your turn now.",
      "last every",
    ),
    word(
      "last",
      "the one before this one; at the end",
      "上一个的；最后的",
      "{Last} Sunday, I went to the zoo for the first time. | Z is the {last} letter of the alphabet. | Sunday is the {last} day of the week.",
      "next every",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "Count along the week: Monday, Tuesday, Wednesday, Thursday, Friday, then Saturday and Sunday for the weekend. *Today is Monday, so tomorrow is* means the next day in that line.",
        "按顺序数一周：Monday、Tuesday、Wednesday、Thursday、Friday，然后周末是 Saturday 和 Sunday。*Today is Monday, so tomorrow is* 要接下一天。",
      ),
      meaning: t(
        "*Next* week is the one after this one, and *last* week is the one before it. *Tuesday* and *Thursday* both start with T, so check which one comes after Monday.",
        "*next* week 是下一周，*last* week 是上一周。*Tuesday* 和 *Thursday* 都以 T 开头，要看哪一个在星期一之后。",
      ),
      spell: t(
        "Days of the week always start with a capital letter. *Wednesday* has a silent d, said like *Wenzday*, and *Thursday* starts with th.",
        "星期名称总是大写开头。*Wednesday* 里的 d 不发音，读作 *Wenzday*；*Thursday* 以 th 开头。",
      ),
    },
    notes: `
      Monday|the first school day;after Sunday;the end of the weekend|Monday starts the school week; Friday ends it|Monday 是一周上学的第一天；Friday 是最后一天|friday/fridays=Friday is the last school day, so it does not start the school week, come after Sunday or end the weekend=Friday 是最后一个上学日，不是一周的第一天，不在星期天之后，也不是周末结束的日子;saturday/saturdays=Saturday is the start of the weekend, not the first school day or the day after Sunday=Saturday 是周末的开始，不是第一个上学日，也不在星期天之后|Mon · day|*Mon* + *day*, with a capital M|*Mon* 加 *day*，M 大写
      Tuesday|between Monday and Wednesday;after Monday;tomorrow after Monday|Tuesday comes after Monday; Thursday comes after Wednesday|Tuesday 在星期一后；Thursday 在星期三后|thursday=Thursday comes after Wednesday, not right after Monday=Thursday 在星期三之后，不紧跟星期一;friday=Friday comes after Thursday, not right after Monday=Friday 在星期四之后，不紧跟星期一|Tues · day|ue after the T, so not *Thursday*|T 后面是 ue，不是 *Thursday*
      Wednesday|between Tuesday and Thursday;the middle of the school week;tomorrow after Tuesday|Wednesday is the middle of the school week; Monday is the start|Wednesday 在一周中间；Monday 在开头|monday=Monday starts the week and comes before Tuesday, not after it=Monday 是一周的开头，在星期二之前，不在之后;friday=Friday ends the school week and comes after Thursday, not right after Tuesday=Friday 是上学周的最后一天，在星期四之后，不紧跟星期二|Wednes · day|a silent d, said like *Wenzday*|d 不发音，读作 *Wenzday*
      Thursday|between Wednesday and Friday;just before Friday;tomorrow after Wednesday|Thursday comes after Wednesday; Tuesday comes after Monday|Thursday 在星期三后；Tuesday 在星期一后|tuesday=Tuesday comes after Monday, not after Wednesday or just before Friday=Tuesday 在星期一之后，不在星期三之后，也不紧挨在星期五前;monday=Monday starts the week, not after Wednesday or just before Friday=Monday 是一周的开头，不在星期三之后，也不紧挨在星期五前|Thurs · day|th at the start, and ur said like *er*|开头是 th，ur 读作 *er*
      Friday|the last school day;between Thursday and Saturday;tomorrow after Thursday|Friday ends the school week; Monday starts it|Friday 是上学周的最后一天；Monday 是第一天|monday=Monday is the first school day and comes after Sunday, not after Thursday=Monday 是第一个上学日，在星期天之后，不在星期四之后;tuesday=Tuesday comes after Monday, not after Thursday, and it is not the last school day=Tuesday 在星期一之后，不在星期四之后，也不是最后一个上学日|Fri · day|i said like *eye*|i 读作 *eye*
      Saturday|the first day of the weekend;between Friday and Sunday;tomorrow after Friday|Saturday starts the weekend; Monday starts the school week|Saturday 是周末第一天；Monday 是上学周第一天|monday=Monday is a school day after Sunday, not part of the weekend or the day after Friday=Monday 是星期天之后的上学日，不属于周末，也不在星期五之后;wednesday=Wednesday is in the middle of the school week, not the weekend or the day after Friday=Wednesday 在上学周中间，不是周末，也不在星期五之后|Sat · ur · day|ur in the middle, said like *er*|中间是 ur，读作 *er*
      Sunday|the last day of the weekend;between Saturday and Monday;tomorrow after Saturday|Sunday ends the weekend; Monday starts the school week|Sunday 是周末最后一天；Monday 是上学周第一天|monday=Monday comes after Sunday and is a school day, not the end of the weekend=Monday 在星期天之后，是上学日，不是周末的最后一天;friday=Friday comes before Saturday, not after it, and it is not part of the weekend=Friday 在星期六之前，不在之后，也不属于周末|Sun · day|*Sun* + *day*, with u said like *up*|*Sun* 加 *day*，u 读作 *up* 里的音
      month|twelve in a year;May;June as the next one|a month is one of twelve parts of a year; a week is seven days|month 是一年的十二分之一；week 是七天|week/weeks=week is seven days, so a year has more than twelve weeks, and May and June are not weeks=week 是七天，一年远不止十二周，五月和六月也不是周;day/days=day is twenty-four hours, so a year has far more than twelve days, and May and June are not days=day 是二十四小时，一年远不止十二天，五月和六月也不是天|month|o said like the u in *up*, and th at the end|o 读作 *up* 里的 u，结尾是 th
      next|seven days from now;the week after this one;my turn now|next is the one after this one; last is the one before|next 是下一个；last 是上一个|last=last is the one before this one, but seven days from now, *is* after *this week* and *your turn now* look ahead=last 是上一个，可七天以后、*this week* 之后的 *is*、*your turn now* 都是往后看;every=every means each one, but here it is one week or one person, not all of them=every 是每一个，可这里说的是某一周或某一个人，不是全部|next|xt at the end|结尾是 xt
      last|the zoo for the first time;Z at the end;the end of the week|last is the one before this one or at the end; next is the one after|last 是上一个或最后的；next 是下一个|next=next is the one after this one, but *went* is past, and Z and Sunday are at the end=next 是下一个，可 *went* 是过去，Z 和星期天都在最后;every=every means each one, but *for the first time* is only once, and there is only one end=every 是每一个，可 *for the first time* 只有一次，最后的也只有一个|last|st at the end|结尾是 st
    `,
  },
});

const months = vocabularyTopic({
  id: "a1-words-months",
  title: t("Months", "月份"),
  summary: t("January to December.", "一月到十二月。"),
  intro: t(
    "The year starts in **January**. My birthday is in **May**, school starts again in **September**, and we have snow in **December**. These words help you name the twelve months.",
    "一年从 **January**（一月）开始。我的生日在 **May**（五月），**September**（九月）重新开学，**December**（十二月）会下雪。这些词帮你说出十二个月。",
  ),
  prerequisites: ["a1-words-days"],
  words: [
    word(
      "January",
      "the first month of the year",
      "一月",
      "{January} is the first month of the year. | The year starts in {January}. | December, {January}, February.",
      "March June",
    ),
    word(
      "February",
      "the second month of the year",
      "二月",
      "{February} is the second month. | January, {February}, March. | {February} is the shortest month. It has 28 days.",
      "April October",
    ),
    word(
      "March",
      "the third month of the year",
      "三月",
      "{March} comes after February. | February, {March}, April. | {March} is the third month.",
      "May January",
    ),
    word(
      "April",
      "the fourth month of the year",
      "四月",
      "{April} comes after March. | March, {April}, May. | {April} is the fourth month.",
      "August June",
    ),
    word(
      "May",
      "the fifth month of the year",
      "五月",
      "{May} comes after April. | April, {May}, June. | {May} is the fifth month.",
      "March July",
    ),
    word(
      "June",
      "the sixth month of the year",
      "六月",
      "{June} comes after May. | May, {June}, July. | {June} is the sixth month.",
      "July January",
    ),
    word(
      "July",
      "the seventh month of the year",
      "七月",
      "{July} comes after June. | June, {July}, August. | {July} is the seventh month.",
      "June May",
    ),
    word(
      "August",
      "the eighth month of the year",
      "八月",
      "{August} comes after July. | July, {August}, September. | {August} is the eighth month.",
      "April October",
    ),
    word(
      "September",
      "the ninth month of the year",
      "九月",
      "{September} comes after August. | August, {September}, October. | {September} is the ninth month.",
      "November December",
    ),
    word(
      "October",
      "the tenth month of the year",
      "十月",
      "{October} comes after September. | September, {October}, November. | {October} is the tenth month.",
      "August February",
    ),
    word(
      "November",
      "the eleventh month of the year",
      "十一月",
      "{November} comes after October. | October, {November}, December. | {November} is the eleventh month.",
      "September December",
    ),
    word(
      "December",
      "the twelfth and last month of the year",
      "十二月",
      "{December} is the last month of the year. | November, {December}, January. | {December} is the twelfth month.",
      "January November",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "Say the months in order before you choose: the word before and after the gap tells you exactly which month it is, as in *April, ___, June*.",
        "选之前先按顺序念一遍月份：空格前后的月份告诉你答案，比如 *April, ___, June*。",
      ),
      meaning: t(
        "*June* and *July* both start with J and sit side by side, and so do *January* and *June* at the start of the list. *June* is the sixth month and *July* the seventh.",
        "*June* 和 *July* 都以 J 开头而且相邻，*January* 也以 J 开头。*June* 是第六个月，*July* 是第七个月。",
      ),
      spell: t(
        "Months start with a capital letter. *February* has r after the b, *September*, *November* and *December* end in -ber, and *August* starts with Au.",
        "月份首字母大写。*February* 的 b 后面有 r；*September*、*November*、*December* 以 -ber 结尾；*August* 以 Au 开头。",
      ),
    },
    notes: `
      January|the first month;the start of the year;between December and February|January is the first month; March is the third|January 是一月；March 是三月|march=March is the third month, so it does not start the year or come between December and February=March 是三月，不是一年的开始，也不在十二月和二月之间;june=June is the sixth month, so it does not start the year or come between December and February=June 是六月，不是一年的开始，也不在十二月和二月之间|Jan · u · ar · y|-uary at the end, like *February*|结尾是 -uary，和 *February* 一样
      February|the second month;between January and March;the shortest with 28 days|February is the second and shortest month; April is the fourth|February 是二月，最短；April 是四月|april=April is the fourth month with thirty days, not the second or between January and March=April 是四月，有三十天，不是第二个月，也不在一月和三月之间;october=October is the tenth month with thirty-one days, not the second or the shortest=October 是十月，有三十一天，不是第二个月，也不是最短的|Feb · ru · ar · y|r after the b, so not *Febuary*|b 后面有 r，不是 *Febuary*
      March|after February;between February and April;the third month|March is the third month; May is the fifth|March 是三月；May 是五月|may=May is the fifth month and comes after April, not after February=May 是五月，在四月之后，不在二月之后;january=January is the first month and comes before February, not after it=January 是一月，在二月之前，不在之后|March|ar said like *car*, and ch at the end|ar 读作 *car*，结尾是 ch
      April|after March;between March and May;the fourth month|April is the fourth month; August is the eighth|April 是四月；August 是八月|august=August is the eighth month and comes after July, not after March=August 是八月，在七月之后，不在三月之后;june=June is the sixth month and comes after May, not after March=June 是六月，在五月之后，不在三月之后|A · pril|one p, and -il at the end|只有一个 p，结尾是 -il
      May|after April;between April and June;the fifth month|May is the fifth month; March is the third|May 是五月；March 是三月|march=March is the third month and comes before April, not after it=March 是三月，在四月之前，不在之后;july=July is the seventh month and comes after June, not before it=July 是七月，在六月之后，不在六月之前|May|ay said like *say*|ay 读作 *say*
      June|after May;between May and July;the sixth month|June is the sixth month; July is the seventh|June 是六月；July 是七月|july=July is the seventh month and comes after June, so it is not right after May=July 是七月，在六月之后，不紧跟五月;january=January is the first month, not after May or the sixth=January 是一月，不在五月之后，也不是第六个月|June|u said like *moon*, and a silent e|u 读作 *moon*，词尾 e 不发音
      July|after June;between June and August;the seventh month|July is the seventh month; June is the sixth|July 是七月；June 是六月|june=June is the sixth month and comes before July, so it is not after June or the seventh=June 是六月，在七月之前，不在六月之后，也不是第七个月;may=May is the fifth month and comes before June, not after it=May 是五月，在六月之前，不在之后|Ju · ly|y at the end said like *eye*|结尾的 y 读作 *eye*
      August|after July;between July and September;the eighth month|August is the eighth month; April is the fourth|August 是八月；April 是四月|april=April is the fourth month and comes after March, not after July=April 是四月，在三月之后，不在七月之后;october=October is the tenth month and comes after September, not before it=October 是十月，在九月之后，不在九月之前|Au · gust|Au at the start, said like *aw*|开头是 Au，读作 *aw*
      September|after August;between August and October;the ninth month|September is the ninth month; November is the eleventh|September 是九月；November 是十一月|november=November is the eleventh month and comes after October, not right after August=November 是十一月，在十月之后，不紧跟八月;december=December is the twelfth and last month, not right after August=December 是十二月，最后一个月，不紧跟八月|Sep · tem · ber|-ber at the end|结尾是 -ber
      October|after September;between September and November;the tenth month|October is the tenth month; August is the eighth|October 是十月；August 是八月|august=August is the eighth month and comes before September, not after it=August 是八月，在九月之前，不在之后;february=February is the second month and comes after January, not after September=February 是二月，在一月之后，不在九月之后|Oc · to · ber|c then t, and -ber at the end|c 后面是 t，结尾是 -ber
      November|after October;between October and December;the eleventh month|November is the eleventh month; September is the ninth|November 是十一月；September 是九月|september=September is the ninth month and comes before October, not after it=September 是九月，在十月之前，不在之后;december=December is the twelfth month and comes after November, so it is not right after October=December 是十二月，在十一月之后，不紧跟十月|No · vem · ber|v in the middle, and -ber at the end|中间是 v，结尾是 -ber
      December|the last month;between November and January;the twelfth month|December is the twelfth and last month; January is the first|December 是十二月，最后一个月；January 是一月|january=January is the first month, not the last one or the one between November and January=January 是一月，不是最后一个月，也不在十一月和一月之间;november=November is the eleventh month, not the last or the twelfth=November 是十一月，不是最后一个月，也不是第十二个月|De · cem · ber|c said like s, and -ber at the end|c 读作 s，结尾是 -ber
    `,
  },
});

const dates = vocabularyTopic({
  id: "a1-words-dates",
  title: t("Dates and Birthdays", "日期与生日"),
  summary: t("Sixty to ninety, zero, first to fifth, birthdays and dates.", "六十到九十、零、第一到第五、生日和日期。"),
  intro: t(
    "My **birthday** is on the **first** of May. The **date** today is the **third** of May, so I was born two days before. These words help you say dates and numbers in order.",
    "我的 **birthday**（生日）在五月 **first**（一日）。今天的 **date**（日期）是五月 **third**（三日），所以我的生日在两天前。这些词帮你说日期和顺序。",
  ),
  prerequisites: ["a1-words-numbers-to-hundred", "a1-words-months"],
  words: [
    word(
      "sixty",
      "the number 60",
      "六十",
      "There are {sixty} minutes in an hour. | Fifty, {sixty}, seventy. | Thirty and thirty make {sixty}.",
      "seventy eighty",
    ),
    word(
      "seventy",
      "the number 70",
      "七十",
      "Sixty, {seventy}, eighty. | Seven tens make {seventy}. | Thirty and forty make {seventy}.",
      "sixty eighty",
    ),
    word(
      "eighty",
      "the number 80",
      "八十",
      "Seventy, {eighty}, ninety. | Forty and forty make {eighty}. | Eight tens make {eighty}.",
      "ninety seventy",
    ),
    word(
      "ninety",
      "the number 90",
      "九十",
      "Eighty, {ninety}, one hundred. | Nine tens make {ninety}. | Ten more than eighty is {ninety}.",
      "eighty seventy",
    ),
    word(
      "zero",
      "the number 0; nothing",
      "零",
      "Ten minus ten is {zero}. | One, two, three... wait, before one comes {zero}. | It's very cold: {zero} degrees, and the water turns to ice.",
      "one ten",
    ),
    word(
      "first",
      "number one in order; before all the others",
      "第一",
      "January is the {first} month of the year. | A is the {first} letter of the alphabet. | I was {first} in the race! I won!",
      "second third",
    ),
    word(
      "second seconds",
      "number two in order; also a very short time",
      "第二；秒",
      "February is the {second} month. | Tuesday is the {second} day of the school week. | Wait a {second}! I'm coming.",
      "first third",
    ),
    word(
      "third",
      "number three in order",
      "第三",
      "March is the {third} month. | C is the {third} letter of the alphabet. | First, second, {third}.",
      "second fourth",
    ),
    word(
      "fourth",
      "number four in order",
      "第四",
      "April is the {fourth} month. | Thursday is the {fourth} day of the school week. | Third, {fourth}, fifth.",
      "third fifth",
    ),
    word(
      "fifth",
      "number five in order",
      "第五",
      "May is the {fifth} month. | Friday is the {fifth} day of the school week. | E is the {fifth} letter of the alphabet.",
      "fourth third",
    ),
    word(
      "birthday birthdays",
      "the day of the year you were born",
      "生日",
      "Happy {birthday}! You are ten today. | My {birthday} is on May 5th. I was born on that day. | We have a cake on my {birthday}.",
      "date month",
    ),
    word(
      "date dates",
      "the day of the month, like May 5th",
      "日期",
      "What's the {date} today? — It's June 1st. | Write today's {date}, May 3rd, at the top of the page. | The {date} of the test is Friday, May 12th.",
      "birthday time",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "Work out the sum or the order first: *thirty and forty* is *seventy*, and *first, second, third* go one by one. For a month, its number in the year gives the word: May is the *fifth*.",
        "先算出数或排出顺序：*thirty and forty* 是 *seventy*，*first, second, third* 一个接一个。说月份时，它在一年中的位置就是答案：五月是 *fifth*。",
      ),
      meaning: t(
        "*Sixty* tells how many, but *first* to *fifth* tell the order. Your *birthday* is the day you were born; a *date* is any day of the month, like June 1st.",
        "*sixty* 说有多少，*first* 到 *fifth* 说顺序。*birthday* 是你出生的日子；*date* 是一个月里的任何一天，比如 June 1st。",
      ),
      spell: t(
        "*Forty* has no u, but *fourth* keeps the u of *four*. *Fifth* has f-th at the end, and *eighty* keeps the gh of *eight*.",
        "*forty* 没有 u，*fourth* 保留 *four* 里的 u。*fifth* 结尾是 f 加 th，*eighty* 保留 *eight* 里的 gh。",
      ),
    },
    notes: `
      sixty|minutes in an hour;after fifty;thirty and thirty|sixty is 60; seventy is 70|sixty 是 60；seventy 是 70|seventy=seventy is 70, but an hour has 60 minutes, 60 comes after 50 and thirty and thirty make 60=seventy 是 70，可一小时 60 分钟，50 之后是 60，30 加 30 是 60;eighty=eighty is 80, which is 20 too many for each of these=eighty 是 80，对这几句都多了 20|six · ty|*six* + *-ty*|*six* 加 *-ty*
      seventy|between sixty and eighty;seven tens;thirty and forty|seventy is 70; sixty is 60|seventy 是 70；sixty 是 60|sixty=sixty is 60, but here it is after 60, seven tens and thirty plus forty, which are 70=sixty 是 60，可这里是 60 之后、七个十和三十加四十，都是 70;eighty=eighty is 80, but here it comes before 80, and seven tens or thirty and forty make 70=eighty 是 80，可这里在 80 之前，七个十或三十加四十都是 70|sev · en · ty|*seven* + *-ty*|*seven* 加 *-ty*
      eighty|between seventy and ninety;forty and forty;eight tens|eighty is 80; ninety is 90|eighty 是 80；ninety 是 90|ninety=ninety is 90, but here it comes before 90, and forty and forty or eight tens make 80=ninety 是 90，可这里在 90 之前，四十加四十或八个十都是 80;seventy=seventy is 70, but here it comes after 70, and forty and forty or eight tens make 80=seventy 是 70，可这里在 70 之后，四十加四十或八个十都是 80|eigh · ty|*eight* without the t, then *-ty*|*eight* 去掉 t，再加 *-ty*
      ninety|before one hundred;nine tens;ten more than eighty|ninety is 90; eighty is 80|ninety 是 90；eighty 是 80|eighty=eighty is 80, but here it comes after 80, and nine tens or ten more than eighty make 90=eighty 是 80，可这里在 80 之后，九个十或八十加十都是 90;seventy=seventy is 70, which is 20 too few for each of these=seventy 是 70，对这几句都少了 20|nine · ty|*nine* keeps its e, then *-ty*|*nine* 保留 e，再加 *-ty*
      zero|ten minus ten;before one;ice-cold degrees|zero is 0, nothing; one is 1|zero 是 0；one 是 1|one=one is 1, but ten minus ten leaves nothing, the number before one is not one and water turns to ice at 0=one 是 1，可十减十什么也不剩，一前面的数不是一，水在 0 度结冰;ten=ten is 10, but ten minus ten is not ten, ten does not come before one and water is not ice at 10 degrees=ten 是 10，可十减十不等于十，十不在一前面，水在 10 度也不结冰|ze · ro|z at the start, and o at the end|开头是 z，结尾是 o
      first|January in the year;A in the alphabet;winning the race|first is number one in order; second is number two|first 是第一；second 是第二|second=second is number two, but January, A and the winner are number one=second 是第二，可一月、A 和得冠军的都是第一;third=third is number three, but January, A and the winner are number one=third 是第三，可一月、A 和得冠军的都是第一|first|ir said like *er*, and st at the end|ir 读作 *er*，结尾是 st
      second|February in the year;Tuesday in the school week;a short wait|second is number two in order, or a very short time; first is number one|second 是第二或一秒；first 是第一|first=first is number one, but February and Tuesday are number two, and *wait a first* is not English=first 是第一，可二月和星期二都排第二，也没有 *wait a first* 的说法;third=third is number three, but February and Tuesday are number two, and *wait a third* is not English=third 是第三，可二月和星期二都排第二，也没有 *wait a third* 的说法|sec · ond|c said like k, and -ond at the end|c 读作 k，结尾是 -ond
      third|March in the year;C in the alphabet;after first and second|third is number three; second is number two|third 是第三；second 是第二|second=second is number two, but March and C are number three, and second is already in the list=second 是第二，可三月和 C 都排第三，second 也已经在序列里了;fourth=fourth is number four, but March and C are number three, and fourth comes after third=fourth 是第四，可三月和 C 都排第三，fourth 在 third 之后|third|th at the start, and ir said like *er*|开头是 th，ir 读作 *er*
      fourth|April in the year;Thursday in the school week;between third and fifth|fourth is number four; third is number three|fourth 是第四；third 是第三|third=third is number three, but April and Thursday are number four, and third is already in the list=third 是第三，可四月和星期四都排第四，third 也已经在序列里了;fifth=fifth is number five, but April and Thursday are number four, and fifth is already in the list=fifth 是第五，可四月和星期四都排第四，fifth 也已经在序列里了|fourth|*four* + *th*, keeping the u|*four* 加 *th*，保留 u
      fifth|May in the year;Friday in the school week;E in the alphabet|fifth is number five; fourth is number four|fifth 是第五；fourth 是第四|fourth=fourth is number four, but May, Friday and E are number five=fourth 是第四，可五月、星期五和 E 都排第五;third=third is number three, but May, Friday and E are number five=third 是第三，可五月、星期五和 E 都排第五|fifth|f then th at the end, not *five* + *th*|结尾是 f 加 th，不是 *five* 加 *th*
      birthday|happy and ten today;the day I was born;a cake|your birthday is the day you were born; a date is any day of the month|birthday 是出生的日子；date 是某月某日|date=date is any day of the month, so *happy date*, being born on *my date* and a cake on any date do not fit=date 是某月某日，*happy date*、出生在 *my date*、任何日期吃蛋糕都不合适;month=month is a whole part of the year, so it is not one day you were born or a day for cake=month 是一整个月，不是出生的那一天，也不是吃蛋糕的那天|birth · day|*birth* + *day*, one word|*birth* 加 *day*，一个词
      date|June 1st today;May 3rd on the page;Friday May 12th|a date is the day of the month; a birthday is the day you were born|date 是日期；birthday 是生日|birthday=birthday is only the day you were born, but today, the page and the test have dates that are not birthdays=birthday 只是你出生的日子，可今天、纸上和考试的日子都不是生日;time=time is what a clock shows, but June 1st, May 3rd and May 12th are days=time 是钟上的时间，可 June 1st、May 3rd、May 12th 都是日子|date|a silent e that makes the a say its name|词尾 e 不发音，让 a 读字母本音
    `,
  },
});

// At, on and in for time.

/** timeFrames are sentences that a time phrase can end. */
const timeFrames: readonly string[] = [
  "We have art",
  "My party is",
  "I visit my grandma",
  "The shop opens",
  "We play football",
  "The test is",
  "Our school trip is",
];

/** phrases are the time phrases that take each word. */
const phrases: Readonly<Record<"at" | "on" | "in", readonly string[]>> = {
  at: ["seven o'clock", "half past four", "a quarter past nine", "night", "ten o'clock", "6:30", "noon", "a quarter past two"],
  on: ["Monday", "Friday", "Saturday morning", "May 5th", "my birthday", "Sunday afternoon", "Tuesday", "June 1st"],
  in: ["May", "summer", "the morning", "the afternoon", "December", "spring", "the evening", "July"],
};

const preps = ["at", "on", "in"] as const;

/** prepAll are every frame with every phrase of every word. */
const prepAll = interleave(
  preps.map((prep) =>
    everyPair(timeFrames, phrases[prep]).map(([frame, phrase]) => ({
      prep,
      sentence: `${frame} ___ ${phrase}.`,
      others: preps.filter((p) => p !== prep),
    })),
  ),
);

/** prepItems are all the items starting at the given place, so each bank opens on different sentences. */
const prepItems = (skip: number) => [...prepAll.slice(skip), ...prepAll.slice(0, skip)];

const prepChoiceBank: readonly ChoiceItem[] = prepItems(0).map(({ prep, sentence, others }): ChoiceItem => [sentence, prep, others]);

const prepTypedBank: readonly TypedItem[] = prepItems(42).map(
  ({ prep, sentence, others }): TypedItem => ({ shown: sentence, accepted: [prep], wrong: [...others] }),
);

/** noPrepFrames are sentences that end in next week, this morning or every day, which take no at, on or in. */
const noPrepFrames: readonly string[] = [
  "We have art",
  "I visit my grandma",
  "The shop is closed",
  "We play football",
  "Our class has a test",
  "I see my friends",
  "We go swimming",
  "My dad works late",
  "We clean the house",
  "I have a piano lesson",
  "The children go to the park",
  "We start a new book",
  "My mom goes shopping",
  "I call my grandpa",
  "We eat fish",
];

const noPrepPhrases: readonly (readonly [phrase: string, wrongPrep: string])[] = [
  ["next week", "in"],
  ["next Monday", "on"],
  ["this morning", "in"],
  ["every Sunday", "on"],
  ["this evening", "in"],
  ["every day", "on"],
  ["next month", "in"],
];

const noPrepBank: readonly TypedItem[] = everyPair(noPrepFrames, noPrepPhrases).map(
  ([frame, [phrase, wrongPrep]]): TypedItem => ({
    shown: `${frame} ${wrongPrep} ${phrase}.`,
    accepted: [`${frame} ${phrase}.`],
    wrong: [`${frame} ${wrongPrep} ${phrase}.`, `${frame} at ${phrase}.`],
  }),
);

/** phraseIn is the time phrase after the gap of sentence. */
const phraseIn = (sentence: string): string => sentence.replace(/^.*___ /u, "").replace(/\.$/u, "");

/** prepKind says what kind of time phrase takes prep. */
const prepKind = (prep: string, phrase: string): Text =>
  prep === "at"
    ? phrase === "night"
      ? t("*night* is the one part of the day that takes *at*", "*night* 是唯一用 *at* 的时段")
      : t(`*${phrase}* is a time on the clock, and clock times take *at*`, `*${phrase}* 是钟点，钟点用 *at*`)
    : prep === "on"
      ? /\d/u.test(phrase)
        ? t(`*${phrase}* is a date, and dates take *on*`, `*${phrase}* 是日期，日期用 *on*`)
        : t(`*${phrase}* is one day, and days take *on*`, `*${phrase}* 是某一天，某一天用 *on*`)
      : /morning|afternoon|evening/u.test(phrase)
        ? t(`*${phrase}* is a part of the day, and parts of the day take *in*`, `*${phrase}* 是一天中的时段，时段用 *in*`)
        : /summer|spring|autumn|winter/u.test(phrase)
          ? t(`*${phrase}* is a season, and seasons take *in*`, `*${phrase}* 是季节，季节用 *in*`)
          : t(`*${phrase}* is a month, and months take *in*`, `*${phrase}* 是月份，月份用 *in*`);

/** prepWhy explains the word for the gap of shown. */
const prepWhy = (right: string, shown: string): Text => {
  const phrase = phraseIn(shown);
  const kind = prepKind(right, phrase);
  const sentence = shown.replace("___", `*${right}*`);
  return t(
    `${kind.en}: ${sentence}\n\n**Check.** Classify *${phrase}* by scale—exact clock point or *night* (*at*), single day or date (*on*), or month/season/part of the day (*in*)—and confirm *${right}* matches.`,
    `${kind["zh-CN"]}：${sentence}\n\n**检验。** 按时间尺度归类 *${phrase}*——具体钟点或 *night*（*at*）、某一天或日期（*on*）、月份/季节/时段（*in*）——确认 *${right}* 对应正确。`,
  );
};

/** prepUse says what each of at, on and in is for. */
const prepUse: Readonly<Record<string, Text>> = {
  at: t("*at* is for clock times and *night*", "*at* 用于钟点和 *night*"),
  on: t("*on* is for days and dates", "*on* 用于某一天和日期"),
  in: t("*in* is for months, seasons and parts of the day", "*in* 用于月份、季节和一天中的时段"),
};

/** whyNotPrep explains a wrong word for the gap of shown without revealing the answer. */
const whyNotPrep = (wrong: string, _right: string, shown: string): Text => {
  const use = prepUse[wrong] ?? t(`*${wrong}*`, `*${wrong}*`);
  const phrase = phraseIn(shown);
  return t(`${use.en}, which does not fit *${phrase}*.`, `${use["zh-CN"]}，与 *${phrase}* 不搭配。`);
};

const prepositionsOfTime: TopicDef = {
  id: "prepositions-of-time",
  title: t("At, On and In for Time", "表示时间的 at、on 和 in"),
  summary: t("At seven o'clock, on Monday, in May.", "at seven o'clock、on Monday、in May。"),
  intro: t(
    "Think of time prepositions from smallest to largest: *at 6:30* (an exact clock point), *on Friday* (one specific day), and *in December* (a whole month)—while phrases starting with *next*, *this*, or *every* need no preposition at all. In this topic, you choose, type, and fix time prepositions.",
    "按时间跨度从小到大记时间介词：*at 6:30*（具体钟点）、*on Friday*（具体某一天）、*in December*（整月或更长时段）；而以 *next*、*this*、*every* 开头的时间短语前面不加任何介词。本主题带你选择、拼写并改正时间介词。",
  ),
  prerequisites: ["a1-words-days", "a1-words-time"],
  encompasses: [
    { topic: "a1-words-days", weight: 0.3 },
    { topic: "a1-words-time", weight: 0.3 },
  ],
  xp: 20,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("At, on or in", "at、on 还是 in"),
      t(
        "*at* a time on the clock: *at seven o'clock*, *at half past four*, and *at night*.\n\n*on* a day: *on Monday*, *on May 5th*, *on my birthday*, *on Saturday morning*.\n\n*in* a longer time: *in May*, *in summer*, *in the morning*.\n\n> **Watch out.** Notice two tricky pairs: *in the morning* takes *in*, but *on Saturday morning* (with a specific day) takes *on*; and *at night* takes *at*, unlike *in the evening*.",
        "*at* 用于钟点：*at seven o'clock*、*at half past four*，还有 *at night*。\n\n*on* 用于某一天：*on Monday*、*on May 5th*、*on my birthday*、*on Saturday morning*。\n\n*in* 用于较长的时间：*in May*、*in summer*、*in the morning*。\n\n中文说“七点”“星期一”“五月”时前面不加词，英语却必须加，而且三个词不能混用。\n\n> **注意。** 留心两组易混搭配：泛指上午用 *in the morning*，带具体星期几时用 *on Saturday morning*；晚上用 *in the evening*，而夜间用 *at night*。",
      ),
      choiceGenerator(t("Choose the word for the gap.", "选出填入空白处的词。"), prepChoiceBank, prepWhy, whyNotPrep),
    ),
    point(
      "type",
      t("Writing at, on or in", "写出 at、on 或 in"),
      t(
        "Type the word: *at* for the clock (*at noon*), *on* for a day (*on June 1st*), *in* for a month, a season or a part of the day (*in spring*).\n\n> **Watch out.** Check whether the phrase names a specific day/date (*on*) versus just a month or part of the day (*in*): *on May 5th*, but *in May*.",
        "输入这个词：钟点用 *at*（*at noon*），某一天用 *on*（*on June 1st*），月份、季节和一天中的时段用 *in*（*in spring*）。\n\n> **注意。** 区分“具体某一天/日期”（*on*）和“整个月份/时段”（*in*）：*on May 5th* 用 *on*，单说 *in May* 用 *in*。",
      ),
      typedGenerator("word-form", t("Type the word for the gap.", "输入填入空白处的词。"), prepTypedBank, prepWhy),
    ),
    point(
      "no-word",
      t("Next week, this morning, every day", "next week、this morning、every day"),
      t(
        "Before *next*, *last*, *this* and *every*, there is no *at*, *on* or *in*: *We have a test next Monday.* *I visit my grandma every Sunday.*\n\n> **Watch out.** Do not replace the wrong preposition with another preposition (like changing *in next week* to *at next week*)—delete the preposition completely.",
        "在 *next*、*last*、*this*、*every* 前面不用 *at*、*on*、*in*：*We have a test next Monday.* *I visit my grandma every Sunday.* 不要说 *on next Monday*。\n\n> **注意。** 不要把错误的介词换成另一个介词（如把 *in next week* 改成 *at next week*）——直接彻底删掉介词。",
      ),
      typedGenerator("sentence", t("Fix the sentence.", "改正这个句子。"), noPrepBank, (right) => {
        const phrase = /(next|this|every) \w+/u.exec(right)?.[0] ?? "next week";
        const first = phrase.split(" ")[0] ?? "next";
        return t(
          `*${phrase}* starts with *${first}*, and a time that starts with *next*, *last*, *this* or *every* takes no *at*, *on* or *in*: ${right}\n\n**Check.** Look right before *${first}* in your fixed sentence—confirm that *at*, *on*, and *in* are completely gone.`,
          `*${phrase}* 以 *${first}* 开头；以 *next*、*last*、*this*、*every* 开头的时间前不加 *at*、*on*、*in*：${right}\n\n**检验。** 检查改后句子里 *${first}* 前面的位置——确认 *at*、*on*、*in* 都已彻底去掉。`,
        );
      }),
    ),
  ],
};

// Capital letters for names.

const people: readonly string[] = ["Anna", "Tom", "Li Wei", "Sara", "Ben", "Mia"];
const languages: readonly string[] = ["English", "Chinese", "French", "Spanish", "Japanese"];
const cities: readonly string[] = ["Beijing", "London", "Paris", "Sydney", "Shanghai", "Tokyo", "Toronto"];
const countries: readonly string[] = ["China", "Canada", "Japan", "Spain", "France"];
const dayNames: readonly string[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const monthNames: readonly string[] = ["January", "March", "April", "June", "July", "August", "October", "November", "December"];

const at = <T>(list: readonly T[], k: number): T => list[k % list.length] as T;

/** nameSentence k is the k-th sentence full of names, days and months. */
const nameSentence = (k: number): string => {
  switch (k % 5) {
    case 0:
      return `On ${at(dayNames, k)}, ${at(people, k)} speaks ${at(languages, k)}.`;
    case 1:
      return `${at(people, k)} is from ${at(countries, k)}, but she lives in ${at(cities, k)}.`.replace(
        /^(Tom|Ben|Li Wei) is from (\w+), but she/u,
        "$1 is from $2, but he",
      );
    case 2:
      return `My birthday is in ${at(monthNames, k)}, and my party is on a ${at(dayNames, k + 3)}.`;
    case 3:
      return `We go to ${at(cities, k)} every ${at(monthNames, k + 2)}.`;
    default:
      return `My friend ${at(people, k)} learns ${at(languages, k + 1)} on ${at(dayNames, k + 1)}s.`;
  }
};

const nameSentences: readonly string[] = (() => {
  const seen = new Set<string>();
  for (let k = 0; seen.size < 40 && k < 400; k++) seen.add(nameSentence(k));
  if (seen.size < 40) throw new Error("capital letters for names: too few sentences");
  return [...seen];
})();

/** careless writes a sentence with no capitals except the first letter. */
const careless = (s: string): string => sentenceCase(s.toLowerCase());

/** tooMany writes every word with a capital letter. */
const tooMany = (s: string): string => s.replace(/\b([a-z])/gu, (c) => c.toUpperCase());

const namesTypedBank: readonly TypedItem[] = nameSentences.map(
  (s): TypedItem => ({ shown: careless(s), accepted: [s], wrong: [careless(s), tooMany(s)] }),
);

const namesChoiceBank: readonly ChoiceItem[] = nameSentences.map((s): ChoiceItem => ["", s, [careless(s), tooMany(s)]]);

/** namesIn are the names in sentence s. */
const namesIn = (s: string): readonly string[] =>
  [...people, ...languages, ...cities, ...countries, ...dayNames, ...monthNames].filter((name) => s.includes(name));

/** namesWhy explains which words of a sentence take a capital letter. */
const namesWhy = (right: string): Text => {
  const names = namesIn(right)
    .map((name) => `*${name}*`)
    .join(", ");
  return t(
    `Names of people, places, languages, days and months begin with a capital letter, here ${names}, and other words do not: ${right}\n\n**Check.** Scan every word after the first: only proper names (${names}) are capitalized, while ordinary nouns like *friend*, *birthday*, and *party* stay lowercase.`,
    `人名、地名、语言、星期和月份以大写字母开头，这里是 ${names}，其他词不大写：${right}\n\n**检验。** 逐词检查句首之后的每个词：只有专有名词（${names}）首字母大写，而 *friend*、*birthday*、*party* 等普通词全部小写。`,
  );
};

/** whyNotNames explains a sentence with too few or too many capitals. */
const whyNotNames = (wrong: string, right: string, _shown: string, position: number): Text => {
  if (position === 0) {
    const name = namesIn(right).find((n) => !wrong.startsWith(n)) ?? namesIn(right)[0] ?? "";
    return t(
      `This writes names with a small letter, like *${name.toLowerCase()}*. A name always begins with a capital: *${name}*.`,
      `这句把名字写成了小写，如 *${name.toLowerCase()}*。名字总是以大写字母开头：*${name}*。`,
    );
  }
  const plain = /\b[a-z]{3,}\b/u.exec(right)?.[0] ?? "and";
  return t(
    `This gives every word a capital letter. Only names and the first word take one, so *${plain}* stays small.`,
    `这句给每个词都加了大写。只有名字和句首的词大写，所以 *${plain}* 仍然小写。`,
  );
};

const capitalLettersForNames: TopicDef = {
  id: "writing-capital-letters-for-names",
  title: t("Capital Letters for Names", "专有名词的大写"),
  summary: t(
    "Names of people, places, languages, days and months begin with a capital letter: On Monday, Anna speaks English.",
    "人名、地名、语言、星期和月份以大写字母开头：On Monday, Anna speaks English.",
  ),
  intro: t(
    "Look at *My friend Sara visits Tokyo in October.* Every proper name—people, cities, countries, languages, days of the week, and months—takes a capital letter, while everyday nouns like *friend* stay lowercase. In this topic, you spot and write sentences with exact proper-noun capitalization.",
    "看看 *My friend Sara visits Tokyo in October.* 所有专有名词——人名、城市、国家、语言、星期和月份——都要大写首字母，而 *friend* 这类普通名词保持小写。本主题带你辨认并写出专有名词大小写完全规范的句子。",
  ),
  prerequisites: ["writing-capitals-and-periods", "a1-words-months"],
  encompasses: [
    { topic: "writing-capitals-and-periods", weight: 0.3 },
    { topic: "a1-words-months", weight: 0.2 },
  ],
  xp: 15,
  strand: "writing",
  knowledgePoints: [
    point(
      "choose",
      t("Which words need a capital", "哪些词要大写"),
      t(
        "A name begins with a capital letter: people (*Anna*), cities (*London*), countries (*China*), languages (*English*), days (*Monday*) and months (*May*). Other words do not: *birthday*, *party*, *friend*.\n\n> **Watch out.** Do not leave days (*Tuesday*), months (*March*), or languages (*French*) lowercase—and do not capitalize ordinary words in the middle of the sentence.",
        "名字以大写字母开头：人名（*Anna*）、城市（*London*）、国家（*China*）、语言（*English*）、星期（*Monday*）和月份（*May*）。其他词不大写：*birthday*、*party*、*friend*。\n\n中文没有大小写，所以要特别留意：星期和月份在英语里也算名字，必须大写。\n\n> **注意。** 不要漏大写星期（*Tuesday*）、月份（*March*）或语言（*French*），也不要把句中的普通名词全部大写。",
      ),
      choiceGenerator(t("Which sentence is written right?", "哪个句子写对了？"), namesChoiceBank, namesWhy, whyNotNames),
    ),
    point(
      "write",
      t("Writing names with capitals", "名字大写"),
      t(
        "Copy the sentence and give every name a capital letter: people, cities, countries, languages, days and months—for example, *We go to Paris every July.* Keep the first word capital, and write every other word with a small letter.\n\n> **Watch out.** Watch two-word names like *Li Wei* (capitalize *both* parts) and plural days like *Tuesdays* (still capitalized).",
        "抄写句子，给每个名字加上大写字母：人名、城市、国家、语言、星期和月份，例如 *We go to Paris every July.* 句首的词保持大写，其他词都用小写。\n\n> **注意。** 留心由两个词组成的人名（如 *Li Wei* 两部分都要大写）以及复数星期（如 *Tuesdays* 依然首字母大写）。",
      ),
      typedGenerator(
        "sentence",
        t("Write the sentence again with the right capital letters.", "用正确的大写字母重写句子。"),
        namesTypedBank,
        namesWhy,
      ),
    ),
  ],
};

const ordinals = vocabularyTopic({
  id: "a1-words-ordinals",
  title: t("Sixth to Thirtieth", "第六到第三十"),
  summary: t(
    "Numbers in order from sixth to twelfth, twentieth and thirtieth, for floors, months and dates.",
    "表示顺序的数：第六到第十二、第二十和第三十，用于楼层、月份和日期。",
  ),
  intro: t(
    "We live on the **tenth** floor. My birthday is on the **twentieth** of June, the **sixth** month, and Dad's is on the **thirtieth**. These words help you say floors, months and dates.",
    "我们住在 **tenth**（第十）层。我的生日在 **sixth**（第六个）月六月的 **twentieth**（二十日），爸爸的在 **thirtieth**（三十日）。这些词帮你说楼层、月份和日期。",
  ),
  prerequisites: ["a1-words-dates"],
  words: [
    word(
      "sixth",
      "number six in order",
      "第六",
      "June is the {sixth} month of the year. | F is the {sixth} letter of the alphabet. | Fifth, {sixth}, seventh. | Our flat is on the {sixth} floor, one above the fifth.",
      "seventh six",
    ),
    word(
      "seventh",
      "number seven in order",
      "第七",
      "July is the {seventh} month. | G is the {seventh} letter of the alphabet. | Sixth, {seventh}, eighth. | Yesterday was the sixth of March, so today is the {seventh}.",
      "eighth seven",
    ),
    word(
      "eighth",
      "number eight in order",
      "第八",
      "August is the {eighth} month. | H is the {eighth} letter of the alphabet. | Seventh, {eighth}, ninth. | Seven runners came before him, so he came {eighth}.",
      "ninth eight",
    ),
    word(
      "ninth",
      "number nine in order",
      "第九",
      "September is the {ninth} month. | I is the {ninth} letter of the alphabet. | Eighth, {ninth}, tenth.",
      "tenth nine",
    ),
    word(
      "tenth",
      "number ten in order",
      "第十",
      "October is the {tenth} month. | J is the {tenth} letter of the alphabet. | We live on the {tenth} floor, one floor above the ninth.",
      "eleventh ten",
    ),
    word(
      "eleventh",
      "number eleven in order",
      "第十一",
      "November is the {eleventh} month. | Tenth, {eleventh}, twelfth. | K is the {eleventh} letter of the alphabet.",
      "twelfth eleven",
    ),
    word(
      "twelfth",
      "number twelve in order",
      "第十二",
      "December is the {twelfth} and last month. | Eleventh, {twelfth}, thirteenth. | L is the {twelfth} letter of the alphabet.",
      "eleventh twelve",
    ),
    word(
      "twentieth",
      "number twenty in order",
      "第二十",
      "My birthday is on the {twentieth} of May, ten days after the tenth. | Nineteenth, {twentieth}, twenty-first. | T is the {twentieth} letter of the alphabet.",
      "thirtieth twenty",
    ),
    word(
      "thirtieth",
      "number thirty in order",
      "第三十",
      "April has thirty days, so its last day is the {thirtieth}. | Grandma's party is on the {thirtieth} of June, the last day of the month. | Twenty-ninth, {thirtieth}, thirty-first.",
      "twentieth thirty",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "After *the*, a floor, a date or a place in a race needs the order word: *the sixth floor*, *the seventh of March*, *he came eighth*, never *the six floor*.",
        "在 *the* 后面，楼层、日期或比赛名次要用序数词：*the sixth floor*、*the seventh of March*、*he came eighth*，不能说 *the six floor*。",
      ),
      meaning: t(
        "*Six* tells how many, but *sixth* tells the place in a line. *Twentieth* and *thirtieth* come from *twenty* and *thirty*, and the thirtieth is often the last day of a month.",
        "*six* 说有多少，*sixth* 说排第几。*twentieth*、*thirtieth* 来自 *twenty*、*thirty*，*thirtieth* 常是一个月的最后一天。",
      ),
      spell: t(
        "*Ninth* drops the e of *nine*, *twelfth* turns ve into f, and *eighth* keeps the t of *eight* before -h. *Twenty* and *thirty* change y to -ieth.",
        "*ninth* 去掉 *nine* 的 e，*twelfth* 把 ve 变成 f，*eighth* 保留 *eight* 的 t 再加 h。*twenty*、*thirty* 把 y 变成 -ieth。",
      ),
    },
    notes: `
      sixth|June;F;between fifth and seventh;one floor above the fifth|sixth is number six in order; six tells how many|sixth 是第六；six 是六个|seventh=seventh is number seven, but June, F and the floor above the fifth are number six, and seventh is already in the list=seventh 是第七，可六月、F 和五楼上一层都排第六，seventh 也已在序列里;six=six tells how many, and *the six month* or *the six floor* is not English=six 说有多少，没有 *the six month*、*the six floor* 的说法|sixth|*six* + *th*|*six* 加 *th*
      seventh|July;G;between sixth and eighth;the day after the sixth|seventh is number seven in order; seven tells how many|seventh 是第七；seven 是七个|eighth=eighth is number eight, but July, G and the day after the sixth are number seven, and eighth is already in the list=eighth 是第八，可七月、G 和六日的后一天都排第七，eighth 也已在序列里;seven=seven tells how many, and *the seven month* or *today is the seven* is not English=seven 说有多少，没有 *the seven month*、*today is the seven* 的说法|sev · enth|*seven* + *th*|*seven* 加 *th*
      eighth|August;H;between seventh and ninth;after seven runners|eighth is number eight in order; eight tells how many|eighth 是第八；eight 是八个|ninth=ninth is number nine, but August, H and the runner after seven others are number eight, and ninth is already in the list=ninth 是第九，可八月、H 和排在七人之后的选手都是第八，ninth 也已在序列里;eight=eight tells how many, and *the eight month* or *he came eight* is not English=eight 说有多少，没有 *the eight month*、*he came eight* 的说法|eighth|*eight* + *h*, keeping the t|*eight* 加 *h*，保留 t
      ninth|September;I;between eighth and tenth|ninth is number nine in order; nine tells how many|ninth 是第九；nine 是九个|tenth=tenth is number ten, but September and I are number nine, and tenth is already in the list=tenth 是第十，可九月和 I 都排第九，tenth 也已在序列里;nine=nine tells how many, and *the nine month* or *eighth, nine, tenth* is not English=nine 说有多少，没有 *the nine month*、*eighth, nine, tenth* 的说法|ninth|*nine* without its e, then *th*|*nine* 去掉 e，再加 *th*
      tenth|October;J;one floor above the ninth|tenth is number ten in order; ten tells how many|tenth 是第十；ten 是十个|eleventh=eleventh is number eleven, but October, J and the floor above the ninth are number ten=eleventh 是第十一，可十月、J 和九楼上一层都排第十;ten=ten tells how many, and *the ten month* or *the ten floor* is not English=ten 说有多少，没有 *the ten month*、*the ten floor* 的说法|tenth|*ten* + *th*|*ten* 加 *th*
      eleventh|November;between tenth and twelfth;K|eleventh is number eleven in order; eleven tells how many|eleventh 是第十一；eleven 是十一个|twelfth=twelfth is number twelve, but November and K are number eleven, and twelfth is already in the list=twelfth 是第十二，可十一月和 K 都排第十一，twelfth 也已在序列里;eleven=eleven tells how many, and *the eleven month* or *tenth, eleven, twelfth* is not English=eleven 说有多少，没有 *the eleven month*、*tenth, eleven, twelfth* 的说法|e · lev · enth|*eleven* + *th*|*eleven* 加 *th*
      twelfth|December as the last month;between eleventh and thirteenth;L|twelfth is number twelve in order; twelve tells how many|twelfth 是第十二；twelve 是十二个|eleventh=eleventh is number eleven, but December and L are number twelve, and eleventh is already in the list=eleventh 是第十一，可十二月和 L 都排第十二，eleventh 也已在序列里;twelve=twelve tells how many, and *the twelve month* or *eleventh, twelve, thirteenth* is not English=twelve 说有多少，没有 *the twelve month*、*eleventh, twelve, thirteenth* 的说法|twelfth|ve of *twelve* turning into f, then th|*twelve* 的 ve 变成 f，再加 th
      twentieth|ten days after the tenth;between nineteenth and twenty-first;T|twentieth is number twenty in order; twenty tells how many|twentieth 是第二十；twenty 是二十个|thirtieth=thirtieth is number thirty, but ten days after the tenth, the day after the nineteenth and T are number twenty=thirtieth 是第三十，可十日后十天、十九日后一天和 T 都排第二十;twenty=twenty tells how many, and *the twenty of May* or *nineteenth, twenty, twenty-first* is not English=twenty 说有多少，没有 *the twenty of May*、*nineteenth, twenty, twenty-first* 的说法|twen · ti · eth|y of *twenty* turning into -ieth|*twenty* 的 y 变成 -ieth
      thirtieth|April's last day;the last day of June;between twenty-ninth and thirty-first|thirtieth is number thirty in order; thirty tells how many|thirtieth 是第三十；thirty 是三十个|twentieth=twentieth is number twenty, but April and June have thirty days, so their last day is not the twentieth, and it comes after twenty-ninth=twentieth 是第二十，可四月和六月有三十天，最后一天不是二十日，而且它在二十九日之后;thirty=thirty tells how many, and *the last day is the thirty* or *the thirty of June* is not English=thirty 说有多少，没有 *the last day is the thirty*、*the thirty of June* 的说法|thir · ti · eth|y of *thirty* turning into -ieth|*thirty* 的 y 变成 -ieth
    `,
  },
});

const tensWords = ["twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
const unitWords = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const unitOrdinals = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth"];

/** compoundNumbers are twenty-one to ninety-nine, written with a hyphen; the numbers to a hundred teach them. */
const compoundNumbers: WordBatch = {
  topic: "a1-words-numbers-to-hundred",
  words: tensWords.flatMap((tens) => unitWords.map((unit) => `${tens}-${unit}`)),
};

/** compoundOrdinals are thirteenth to nineteenth and twenty-first to thirty-first, for dates. */
const compoundOrdinals: WordBatch = {
  topic: "a1-words-ordinals",
  words: [
    "thirteenth",
    "fourteenth",
    "fifteenth",
    "sixteenth",
    "seventeenth",
    "eighteenth",
    "nineteenth",
    ...unitOrdinals.map((o) => `twenty-${o}`),
    "thirty-first",
  ],
};

/** topics are the topics of the unit Time and Dates. */
export const topics: readonly TopicDef[] = [
  time.topic,
  days.topic,
  months.topic,
  dates.topic,
  ordinals.topic,
  prepositionsOfTime,
  capitalLettersForNames,
];

/** vocabulary are the words the unit Time and Dates teaches. */
export const vocabulary: readonly WordBatch[] = [
  time.batch,
  days.batch,
  months.batch,
  dates.batch,
  ordinals.batch,
  compoundNumbers,
  compoundOrdinals,
];
