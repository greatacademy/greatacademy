// The listening topics of A1 (S1): in each unit, the unit's words heard in sentences and short dialogues and
// announcements on its theme; and in the first five units, pairs of sounds that speakers of Chinese often merge.
// In the dialogues, A is the usual voice, a woman's, and B a man's.

import type { TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { frame, pairTopic, unitListening } from "../listening.ts";
// The modules whose vocabulary topics the listening plays, built before it.
import "./topics.ts";

/** pairs are the topics that tell apart two sounds, one in each of the first five units. */
export const pairs: readonly TopicDef[] = [
  pairTopic({
    id: "listening-ship-and-sheep",
    watchOut: {
      which: t(
        "Do not trust the vowel letters: *it* and *eat*, *fill* and *feel* differ only in length. The long sound also lasts through the end of *seat* and *heat*, so listen for a sound you could hold.",
        "别看元音字母：*it* 和 *eat*、*fill* 和 *feel* 只差在长短。长音在 *seat*、*heat* 里一直拖到词尾，听那个能“拉长”的音。",
      ),
      same: t(
        "*ship* said twice and *ship* then *sheep* can sound alike when said fast. Compare the two lengths: if one vowel is clearly longer, they are different words.",
        "快速说时，两遍 *ship* 和 *ship* 加 *sheep* 听起来很像。比较两个元音的长短：其中一个明显更长，就是两个不同的词。",
      ),
    },
    title: t("Hearing Ship and Sheep", "听辨 ship 和 sheep"),
    summary: t("Tell apart the short sound of *ship* and the long sound of *sheep*.", "分辨 *ship* 的短音和 *sheep* 的长音。"),
    prerequisites: [],
    sounds: t(
      "The *i* of *ship* is short and relaxed. The *ee* of *sheep* is long, with the lips spread as in a smile. Many languages, Chinese among them, have only one sound here, so listen for the length.",
      "*ship* 中的 *i* 短而放松；*sheep* 中的 *ee* 长，嘴唇像微笑一样向两边展开。包括汉语在内的许多语言在这里只有一个音，所以要注意听音的长短。",
    ),
    pairs:
      "ship sheep, sit seat, bit beat, fill feel, hit heat, chip cheap, slip sleep, fit feet, still steal, lip leap, mill meal, pick peak, hill heal, rich reach, it eat, sick seek, bin bean, dip deep",
  }),
  pairTopic({
    id: "listening-bad-and-bed",
    watchOut: {
      which: t(
        "*marry* and *merry*, *gas* and *guess* are spelled very differently but differ only in how wide the mouth opens. The *bad* sound is wider and a little longer.",
        "*marry* 和 *merry*、*gas* 和 *guess* 拼写很不同，读音却只差嘴张多大。*bad* 的音更开，也稍长一些。",
      ),
      same: t(
        "In *man* and *men*, the *m* and *n* match, so only the middle changes. Listen to the vowel alone: a wide *a* and a half-open *e* are two different words.",
        "*man* 和 *men* 首尾的 *m*、*n* 都一样，只有中间变了。单独听元音：开口大的 *a* 和半开的 *e* 是两个词。",
      ),
    },
    title: t("Hearing Bad and Bed", "听辨 bad 和 bed"),
    summary: t("Tell apart the open sound of *bad* and the sound of *bed*.", "分辨 *bad* 的开口音和 *bed* 的音。"),
    prerequisites: [],
    sounds: t(
      "For the *a* of *bad*, the mouth opens wide and the jaw drops. For the *e* of *bed*, the mouth is only half open. Listen for how open the vowel sounds.",
      "发 *bad* 中的 *a* 时，嘴张大，下巴下沉；发 *bed* 中的 *e* 时，嘴只张开一半。注意听元音有多“开”。",
    ),
    pairs:
      "bad bed, man men, pan pen, sad said, had head, bag beg, pat pet, sat set, tan ten, land lend, band bend, bat bet, mat met, track trek, marry merry, gas guess, flash flesh, dad dead",
  }),
  pairTopic({
    id: "listening-light-and-right",
    watchOut: {
      which: t(
        "After another consonant the difference is quickest: *glass* and *grass*, *fly* and *fry*, *climb* and *crime*. Listen to the sound right after the first letter.",
        "在辅音后面区别最快：*glass* 和 *grass*、*fly* 和 *fry*、*climb* 和 *crime*。注意听第一个字母后紧跟的那个音。",
      ),
      same: t(
        "In the middle of a word the sound is easy to miss: *collect* and *correct*, *alive* and *arrive*. If one sounds darker, with rounded lips, it is the *r* word.",
        "在词中间这个音容易漏听：*collect* 和 *correct*、*alive* 和 *arrive*。哪个听起来更“暗”、嘴唇更圆，就是带 *r* 的词。",
      ),
    },
    title: t("Hearing Light and Right", "听辨 light 和 right"),
    summary: t("Tell apart *l* and *r* at the start of a word and after another consonant.", "分辨词首和辅音后的 *l* 和 *r*。"),
    prerequisites: [],
    sounds: t(
      "For *l*, the tip of the tongue touches the ridge behind the top teeth. For *r*, the tongue touches nothing and the lips round a little, so *r* sounds darker. Listen for that difference at the start of the word.",
      "发 *l* 时，舌尖抵住上齿后面的齿龈；发 *r* 时，舌头什么也不碰，嘴唇略圆，所以 *r* 听起来更“暗”。注意听词首的这个区别。",
    ),
    pairs:
      "light right, long wrong, lock rock, late rate, glass grass, fly fry, play pray, collect correct, cloud crowd, lane rain, led red, lamp ramp, alive arrive, flee free, lace race, load road, climb crime, blush brush",
  }),
  pairTopic({
    id: "listening-think-and-sink",
    watchOut: {
      which: t(
        "The sound can come at the end too: *path* and *pass*, *mouth* and *mouse*, *math* and *mass*. A soft breath at the end is *th*; a sharp hiss is *s*.",
        "这个音也会出现在词尾：*path* 和 *pass*、*mouth* 和 *mouse*、*math* 和 *mass*。词尾柔和的气流是 *th*，尖锐的嘶声是 *s*。",
      ),
      same: t(
        "*thought* and *sought*, *thaw* and *saw* share the whole rest of the word. Listen only to the first breath: soft and flat means *th*.",
        "*thought* 和 *sought*、*thaw* 和 *saw* 后面完全相同。只听开头的气流：柔和平扁的是 *th*。",
      ),
    },
    title: t("Hearing Think and Sink", "听辨 think 和 sink"),
    summary: t("Tell apart the *th* of *think* and the *s* of *sink*.", "分辨 *think* 中的 *th* 和 *sink* 中的 *s*。"),
    prerequisites: [],
    sounds: t(
      "For *th*, the tongue sits between the teeth and air passes over it: a soft sound. For *s*, the tongue stays behind the teeth: a sharp, hissing sound. Chinese has no *th*, so it is often heard as *s*.",
      "发 *th* 时，舌头放在上下齿之间，气流从舌上通过，声音柔和；发 *s* 时，舌头在牙齿后面，声音尖锐，像“嘶”声。汉语没有 *th*，所以常被听成 *s*。",
    ),
    pairs:
      "think sink, thick sick, thank sank, thin sin, path pass, mouth mouse, worth worse, faith face, thumb sum, theme seem, thought sought, math mass, thing sing, myth miss, forth force, growth gross, thaw saw, tenth tense",
  }),
  pairTopic({
    id: "listening-win-and-wing",
    watchOut: {
      which: t(
        "The plural hides the ending: *wins* and *wings* both end in *s*, so listen to the sound just before it. *ng* is made at the back of the mouth and sounds fuller.",
        "复数会把结尾藏起来：*wins* 和 *wings* 都以 *s* 结尾，要听 *s* 前面那个音。*ng* 在口腔后部发出，听起来更饱满。",
      ),
      same: t(
        "In the middle of a word, *sinner* and *singer* differ by one sound. Do not listen for a *g*: *singer* has no hard *g*, only the *ng* sound.",
        "在词中间，*sinner* 和 *singer* 只差一个音。别去听 *g*：*singer* 里没有硬的 *g*，只有 *ng* 音。",
      ),
    },
    title: t("Hearing Win and Wing", "听辨 win 和 wing"),
    summary: t("Tell apart words that end in *n* and in *ng*.", "分辨以 *n* 和 *ng* 结尾的词。"),
    prerequisites: [],
    sounds: t(
      "*n* is made with the tip of the tongue behind the top teeth; *ng* with the back of the tongue against the soft roof of the mouth, as in Chinese *-ng*. Listen to the very end of the word.",
      "*n* 是舌尖抵住上齿后面发出的；*ng* 是舌根抵住软腭发出的，和汉语的后鼻音 *-ng* 一样。注意听词的最后一个音。",
    ),
    pairs:
      "win wing, sin sing, thin thing, ban bang, ran rang, ton tongue, sun sung, run rung, kin king, fan fang, gone gong, lawn long, sinner singer, tan tang, stun stung, clan clang, pan pang, wins wings",
  }),
];

/** units are the listening topics of the units of A1, in their order. */
export const units: readonly TopicDef[] = [
  unitListening({
    id: "a1-listening-all-about-me",
    watchOut: {
      words: t(
        "*thirteen* and *thirty*, *fourteen* and *forty* sound close. The *-teen* numbers are long and stressed at the end; the *-ty* numbers are stressed at the start.",
        "*thirteen* 和 *thirty*、*fourteen* 和 *forty* 很像。*-teen* 的数字较长、重音在后；*-ty* 的数字重音在前。",
      ),
      dialogues: t(
        "Two numbers or two places come in each answer, and the second belongs to someone else, such as *My sister is* or *My friend Tom is from*. For the phone number, the last *No* gives the right one.",
        "每个回答里有两个数字或地点，后一个属于别人，例如 *My sister is* 或 *My friend Tom is from*。电话号码以最后那句 *No* 后面说的为准。",
      ),
    },
    title: t("Listening: All About Me", "听力：关于我"),
    summary: t("Hear people say their age, where they are from and how they feel.", "听人们说年龄、来自哪里和感受。"),
    words: ["a1-words-numbers-to-hundred", "a1-words-about-me", "a1-words-feelings", "a1-words-everyday-words", "a1-words-little-words-3"],
    frames: [
      frame(
        "A: How old is your brother? | B: He is {x}. My sister is {y}.",
        "How old is the man's brother?",
        "这个男人的哥哥（弟弟）几岁？",
        "eleven, twelve, fourteen, fifteen, sixteen",
      ),
      frame(
        "A: Where are you from? | B: I'm from {x}. My friend Tom is from {y}.",
        "Where is the man from?",
        "这个男人来自哪里？",
        "China, Brazil, Spain, Canada, Japan",
      ),
      frame(
        "A: What's your phone number? | B: It's {x}. | A: Sorry, {y}? | B: No, {x}.",
        "What is the man's phone number?",
        "这个男人的电话号码是多少？",
        "two four six nine, three five seven eight, one eight four two, nine six three one, seven two five four",
      ),
      frame(
        "A: How are you today, Sam? | B: I'm {x}. Yesterday I was {y}.",
        "How is Sam today?",
        "Sam 今天感觉怎么样？",
        "happy, tired, sad, hungry, bored",
      ),
    ],
  }),
  unitListening({
    id: "a1-listening-my-day",
    watchOut: {
      words: t(
        "*get up* and *wake up* run together as one word; listen for the small *up*. *always* and *usually* both start with a long vowel, so wait for the end of the word.",
        "*get up*、*wake up* 连读得像一个词，注意那个小小的 *up*。*always* 和 *usually* 开头都是长元音，要听到词尾再判断。",
      ),
      dialogues: t(
        "Times come in pairs: *half past six* is not *six o'clock*. Words like *usually* and *but today* mark which time or way is the answer; in Anna's message, the time she *can't* meet is the decoy.",
        "时间成对出现：*half past six* 不是 *six o'clock*。*usually*、*but today* 这类词标明哪个才是答案；安娜的留言里，她 *can't* 见面的时间是干扰项。",
      ),
    },
    title: t("Listening: My Day", "听力：我的一天"),
    summary: t(
      "Hear people talk about their day: when they get up, how they travel, what they do after school.",
      "听人们谈论自己的一天：几点起床、怎么出行、放学后做什么。",
    ),
    words: ["a1-words-my-day", "a1-words-times-of-day", "a1-words-how-often", "a1-words-little-words-1"],
    frames: [
      frame(
        "A: What time do you get up? | B: I get up at {x}. My brother gets up at {y}.",
        "When does the man get up?",
        "这个男人几点起床？",
        "six o'clock, half past six, seven o'clock, half past seven, eight o'clock",
      ),
      frame(
        "A: How do you go to school? | B: I usually go by {x}, but today I'm going by {y}.",
        "How does the man usually go to school?",
        "这个男人平时怎么去上学？",
        "bus, bike, car, train, taxi",
      ),
      frame(
        "A: What do you do after school? | B: I usually {x}. On Fridays I {y}.",
        "What does the man usually do after school?",
        "这个男人放学后通常做什么？",
        "play football, read a book, watch TV, play the piano, go swimming",
      ),
      frame(
        "Hi, it's Anna. I can't meet you at {y} today. Can we meet at {x}? See you then!",
        "When does Anna want to meet?",
        "Anna 想几点见面？",
        "four o'clock, five o'clock, six o'clock, half past four, half past five",
      ),
    ],
  }),
  unitListening({
    id: "a1-listening-time-and-dates",
    watchOut: {
      words: t(
        "*Tuesday* and *Thursday* begin alike; listen for *tyooz* or *thurz*. *thirteenth* and *thirtieth* are close: count the beats.",
        "*Tuesday* 和 *Thursday* 开头相似，注意听 *tyooz* 还是 *thurz*。*thirteenth* 和 *thirtieth* 很像，数一数有几拍。",
      ),
      dialogues: t(
        "The birthday dialogue repeats a wrong date as a question; the answer is the one after *No*. For the museum, *today* and *tomorrow* each have a time.",
        "生日对话里会用问句重复一个错日期，答案是 *No* 后面那个。博物馆的通知里，*today* 和 *tomorrow* 各有一个时间。",
      ),
    },
    title: t("Listening: Time and Dates", "听力：时间和日期"),
    summary: t(
      "Hear days, dates, months and times in short dialogues and announcements.",
      "在简短的对话和通知中听日子、日期、月份和时间。",
    ),
    words: ["a1-words-time", "a1-words-days", "a1-words-months", "a1-words-dates", "a1-words-ordinals"],
    frames: [
      frame(
        "A: When is your birthday? | B: It's on the {x} of May. | A: The {y}? | B: No, the {x}.",
        "Which day of May is the man's birthday?",
        "这个男人的生日是五月几号？",
        "first, third, fifth, twelfth, twentieth",
      ),
      frame(
        "A: What day is the party? | B: It's on {x}. It isn't on {y}.",
        "What day is the party?",
        "聚会在星期几？",
        "Monday, Tuesday, Wednesday, Friday, Saturday",
      ),
      frame(
        "The museum is open every day. Today it closes at {x}. Tomorrow it closes at {y}.",
        "When does the museum close today?",
        "博物馆今天几点关门？",
        "four o'clock, five o'clock, six o'clock, seven o'clock, eight o'clock",
      ),
      frame(
        "A: When is your exam? | B: It's in {x}. My sister's exam is in {y}.",
        "When is the man's exam?",
        "这个男人的考试在什么时候？",
        "January, March, June, September, November",
      ),
    ],
  }),
  unitListening({
    id: "a1-listening-food-and-drink",
    watchOut: {
      words: t(
        "*tea* and *tee* sound the same; let the sentence tell you which. *cook* and *cookie*, *ice* and *ice cream* share a start, so listen to the whole word.",
        "*tea* 和 *tee* 读音相同，要靠句子判断。*cook* 和 *cookie*、*ice* 和 *ice cream* 开头一样，要听完整个词。",
      ),
      dialogues: t(
        "An offer or a *not* comes before the real choice: *Would you like*, *Not tea?*, *there is no*. The answer follows *Can I have*, *I usually have* or *Today's lunch is*.",
        "真正的选择之前，常先出现提议或否定：*Would you like*、*Not tea?*、*there is no*。答案跟在 *Can I have*、*I usually have* 或 *Today's lunch is* 后面。",
      ),
    },
    title: t("Listening: Food and Drink", "听力：食物和饮料"),
    summary: t("Hear people order food and drinks, and what is for lunch.", "听人们点餐点饮料，以及午饭吃什么。"),
    words: ["a1-words-food", "a1-words-drinks", "a1-words-meals", "a1-words-favorite-foods"],
    frames: [
      frame(
        "A: Would you like {y}? | B: No, thank you. Can I have {x}, please?",
        "What does the man want?",
        "这个男人想要什么？",
        "some rice, a sandwich, some soup, a salad, some noodles",
      ),
      frame(
        "A: What do you have for breakfast? | B: I usually have {x}. I don't like {y}.",
        "What does the man usually have for breakfast?",
        "这个男人早餐通常吃什么？",
        "eggs, bread, cereal, fruit, rice",
      ),
      frame(
        "A: What would you like to drink? | B: {x}, please. | A: Not {y}? | B: No, thanks.",
        "What does the man want to drink?",
        "这个男人想喝什么？",
        "tea, coffee, milk, orange juice, water",
      ),
      frame(
        "Welcome to the school café. Today's lunch is {x}. Sorry, there is no {y} today.",
        "What is today's lunch?",
        "今天的午饭是什么？",
        "chicken soup, pizza, pasta, fish, rice and beans",
      ),
    ],
  }),
  unitListening({
    id: "a1-listening-clothes-and-shopping",
    watchOut: {
      words: t(
        "*shirt* and *short*, *coat* and *cot* differ in the vowel. *buy*, *by* and *bye* sound the same; the sentence decides.",
        "*shirt* 和 *short*、*coat* 和 *cot* 只差元音。*buy*、*by*、*bye* 读音相同，要靠句子判断。",
      ),
      dialogues: t(
        "Prices come in pairs, *This one* and *That one*, so hear which one the question asks about. In the shop notice, *but not the* marks the decoy.",
        "价格成对出现，*This one* 和 *That one*，要听清问题问的是哪一个。商店通知里，*but not the* 后面的是干扰项。",
      ),
    },
    title: t("Listening: Clothes and Shopping", "听力：衣服和购物"),
    summary: t("Hear prices, colors and what people are looking for in a shop.", "听价格、颜色，以及人们在商店里找什么。"),
    words: ["a1-words-clothes", "a1-words-shopping", "a1-words-at-the-shop"],
    frames: [
      frame(
        "A: How much is this T-shirt? | B: It's {x}. That one is {y}.",
        "How much is this T-shirt?",
        "这件 T 恤多少钱？",
        "five dollars, eight dollars, ten dollars, twelve dollars, fifteen dollars",
      ),
      frame(
        "A: Can I help you? | B: Yes, I'm looking for a {x}. | A: The {y}s are here, and the {x}s are over there.",
        "What is the man looking for?",
        "这个男人在找什么？",
        "jacket, sweater, shirt, hat, coat",
      ),
      frame(
        "A: What is Lucy wearing? | B: She's wearing a {x} dress and {y} shoes.",
        "What color is Lucy's dress?",
        "Lucy 的连衣裙是什么颜色的？",
        "red, blue, green, yellow, black",
      ),
      frame(
        "The shop closes in ten minutes. Today all the {x} are half price, but not the {y}.",
        "What is half price today?",
        "今天什么东西半价？",
        "shoes, bags, hats, coats, jeans",
      ),
    ],
  }),
  unitListening({
    id: "a1-listening-home",
    watchOut: {
      words: t(
        "*floor* and *flower*, *wall* and *well* are close. *bedroom* and *bathroom* both end in *room*: listen to the first beat.",
        "*floor* 和 *flower*、*wall* 和 *well* 很接近。*bedroom* 和 *bathroom* 都以 *room* 结尾，要听第一拍。",
      ),
      dialogues: t(
        "Negatives mark the decoys: *They aren't on the*, *I don't like the*, *You can do that tomorrow*. Keep what comes before them.",
        "否定句标出干扰项：*They aren't on the*、*I don't like the*、*You can ... tomorrow*。答案在它们前面。",
      ),
    },
    title: t("Listening: Home", "听力：家"),
    summary: t("Hear where things are, the rooms of a home and the housework to do.", "听东西在哪里、家里的房间，以及要做的家务。"),
    words: ["a1-words-home", "a1-words-things-at-home", "a1-words-housework"],
    frames: [
      frame(
        "A: Where are my keys? | B: They're on the {x}. They aren't on the {y}.",
        "Where are the keys?",
        "钥匙在哪里？",
        "table, bed, chair, sofa, desk",
      ),
      frame(
        "A: How many bedrooms are there in your house? | B: There are {x}. My old house had {y}.",
        "How many bedrooms are there in the man's house?",
        "这个男人的房子里有几间卧室？",
        "two, three, four, five, six",
      ),
      frame(
        "A: Which room is your favorite? | B: The {x}. I don't like the {y}, it's too small.",
        "What is the man's favorite room?",
        "这个男人最喜欢哪个房间？",
        "kitchen, living room, bedroom, bathroom, dining room",
      ),
      frame(
        "Hi Ben, it's Mom. Please {x} before dinner. You can {y} tomorrow.",
        "What must Ben do before dinner?",
        "Ben 晚饭前必须做什么？",
        "wash the dishes, make your bed, clean the bathroom, do the laundry, wash the car",
      ),
    ],
  }),
  unitListening({
    id: "a1-listening-free-time",
    watchOut: {
      words: t(
        "*ride* and *write*, *film* and *fill* sound close. *football* and *basketball* both end in *ball*: listen for the first part.",
        "*ride* 和 *write*、*film* 和 *fill* 很像。*football*、*basketball* 都以 *ball* 结尾，要听前一部分。",
      ),
      dialogues: t(
        "The man's choice comes before his friend's, or after *but I love*. For the party, *that was last year* tells you the earlier time is wrong.",
        "这个男人的选择在朋友之前，或在 *but I love* 之后。派对那段里，*that was last year* 说明前面那个时间不对。",
      ),
    },
    title: t("Listening: Free Time", "听力：业余时间"),
    summary: t("Hear what people like doing and when clubs and parties are.", "听人们喜欢做什么，以及俱乐部活动和聚会的时间。"),
    words: ["a1-words-sports-and-music", "a1-words-hobbies", "a1-words-parties", "a1-words-actions"],
    frames: [
      frame(
        "A: What do you do on Saturdays? | B: I play {x}. My friend plays {y}.",
        "What does the man play on Saturdays?",
        "这个男人星期六玩什么？",
        "football, tennis, basketball, the guitar, the piano",
      ),
      frame(
        "A: Do you like {y}? | B: It's OK, but I love {x}.",
        "What does the man love?",
        "这个男人非常喜欢什么？",
        "swimming, dancing, cooking, reading, singing",
      ),
      frame(
        "A: When is the party? | B: On Saturday at {x}. | A: Not at {y}? | B: No, that was last year.",
        "When is the party?",
        "聚会在什么时候？",
        "four o'clock, five o'clock, six o'clock, seven o'clock, eight o'clock",
      ),
      frame(
        "The music club meets on {x} after school. The art club meets on {y}.",
        "When does the music club meet?",
        "音乐俱乐部什么时候活动？",
        "Monday, Tuesday, Wednesday, Thursday, Friday",
      ),
    ],
  }),
  unitListening({
    id: "a1-listening-school",
    watchOut: {
      words: t(
        "*learn* and *lean*, *right* and *write* are easy to confuse. *math* ends in a soft *th*, not *s*.",
        "*learn* 和 *lean*、*right* 和 *write* 容易混。*math* 结尾是柔和的 *th*，不是 *s*。",
      ),
      dialogues: t(
        "Two subjects or numbers come each time: *now* and *after lunch*, *room* and *next to room*. On the teacher's notice, *Not page* names the wrong one.",
        "每次都有两个科目或数字：*now* 和 *after lunch*、*room* 和 *next to room*。老师说的 *Not page* 后面是错的那页。",
      ),
    },
    title: t("Listening: School", "听力：学校"),
    summary: t("Hear about subjects, lessons, classrooms and what the teacher asks.", "听有关科目、课程、教室和老师要求的内容。"),
    words: ["a1-words-school-subjects", "a1-words-schoolwork", "a1-words-little-words-2"],
    frames: [
      frame(
        "A: What's your favorite subject? | B: I like {x} best. I don't like {y} very much.",
        "What is the man's favorite subject?",
        "这个男人最喜欢哪门课？",
        "math, art, music, science, history",
      ),
      frame(
        "A: What do we have now? | B: We have {x} now, and {y} after lunch.",
        "What lesson do they have now?",
        "他们现在上什么课？",
        "English, science, music, art, history",
      ),
      frame(
        "A: Where is your classroom? | B: It's room {x}, next to room {y}.",
        "Which room is the man's classroom?",
        "这个男人的教室是几号房间？",
        "ten, twelve, fifteen, twenty, thirty",
      ),
      frame(
        "Good morning, class. Please open your books at page {x}. Not page {y}, page {x}.",
        "Which page must the class open their books at?",
        "全班要把书翻到第几页？",
        "nine, eleven, sixteen, nineteen, twenty-one",
      ),
    ],
  }),
  unitListening({
    id: "a1-listening-the-library",
    watchOut: {
      words: t(
        "*borrow* and *bring*, *return* and *turn* share sounds. *quiet* has two beats, *KWY-ut*; do not hear it as *quite*.",
        "*borrow* 和 *bring*、*return* 和 *turn* 有相同的音。*quiet* 有两拍，*KWY-ut*，不要听成 *quite*。",
      ),
      dialogues: t(
        "Each answer gives a second number for someone else: *on Saturdays*, *Children can borrow*, *the magazine*. Match the question's own words.",
        "每个回答都为别人给出第二个数字：*on Saturdays*、*Children can borrow*、*the magazine*。要对照问题里的原词。",
      ),
    },
    title: t("Listening: The Library", "听力：图书馆"),
    summary: t(
      "Hear when the library opens, how many books you can borrow and where to find them.",
      "听图书馆几点开门、能借几本书、书在哪里。",
    ),
    words: ["a1-words-library", "a1-words-books"],
    frames: [
      frame(
        "A: When does the library open? | B: It opens at {x} on weekdays and at {y} on Saturdays.",
        "When does the library open on weekdays?",
        "图书馆工作日几点开门？",
        "eight o'clock, nine o'clock, ten o'clock, eleven o'clock, half past nine",
      ),
      frame(
        "A: How many books can I borrow? | B: You can borrow {x} books. Children can borrow {y}.",
        "How many books can the woman borrow?",
        "这个女人可以借几本书？",
        "two, three, four, five, six",
      ),
      frame(
        "A: Excuse me, where are the books about {x}? | B: They're on the second floor, next to the books about {y}.",
        "What books is the woman looking for?",
        "这个女人在找什么书？",
        "animals, history, sports, music, cooking",
      ),
      frame(
        "A: How long can I keep this book? | B: You can keep it for {x}. You can keep the magazine for {y}.",
        "How long can the woman keep the book?",
        "这个女人可以借这本书多久？",
        "one week, two weeks, three weeks, ten days, five days",
      ),
    ],
  }),
  unitListening({
    id: "a1-listening-weather-and-nature",
    watchOut: {
      words: t(
        "*sun* and *sunny*, *rain* and *rainy* differ by one ending; listen for the *-y*. *hill* and *heal*, *sea* and *see* need the sentence.",
        "*sun* 和 *sunny*、*rain* 和 *rainy* 只差一个词尾，注意 *-y*。*hill* 和 *heal*、*sea* 和 *see* 要靠句子判断。",
      ),
      dialogues: t(
        "The forecast gives *In the morning* then *In the afternoon*; hear which part the question asks. *Yesterday it was* and *I can't see* mark the decoys.",
        "天气预报先说 *In the morning* 再说 *In the afternoon*，要听清问的是哪段。*Yesterday it was* 和 *I can't see* 标出干扰项。",
      ),
    },
    title: t("Listening: Weather and Nature", "听力：天气和自然"),
    summary: t("Hear the weather, the temperature, the seasons and animals outside.", "听天气、气温、季节和户外的动物。"),
    words: ["a1-words-weather", "a1-words-seasons", "a1-words-nature", "a1-words-wild-animals"],
    frames: [
      frame(
        "Here is the weather for today. In the morning it will be {x}. In the afternoon it will be {y}.",
        "What will the weather be like in the morning?",
        "上午天气怎么样？",
        "sunny, rainy, cloudy, windy, snowy",
      ),
      frame(
        "A: What's the weather like in your city? | B: Today it's {x} degrees. Yesterday it was {y}.",
        "How warm is it in the man's city today?",
        "今天这个男人所在的城市有多少度？",
        "ten, fifteen, twenty, twenty-five, thirty",
      ),
      frame(
        "A: What's your favorite season? | B: I love {x}. I don't like {y} very much.",
        "What is the man's favorite season?",
        "这个男人最喜欢哪个季节？",
        "spring, summer, fall, winter",
      ),
      frame(
        "A: What animal can you see? | B: I can see a {x}. I can't see the {y}.",
        "What animal can the man see?",
        "这个男人能看到什么动物？",
        "bird, rabbit, horse, cow, duck",
      ),
    ],
  }),
  unitListening({
    id: "a1-listening-people-and-jobs",
    watchOut: {
      words: t(
        "*farmer* and *father*, *driver* and *diver* are close. *police officer* is two words; listen for both.",
        "*farmer* 和 *father*、*driver* 和 *diver* 很像。*police officer* 是两个词，两个都要听到。",
      ),
      dialogues: t(
        "Each answer names two people: *my mother* then *my father*, *my brother* then *my sister*. The question names one; hold on to that person.",
        "每个回答提到两个人：先 *my mother* 后 *my father*，先 *my brother* 后 *my sister*。问题只问一个人，要盯住那个人。",
      ),
    },
    title: t("Listening: People and Jobs", "听力：人和职业"),
    summary: t("Hear what people do, where they work and what they look like.", "听人们做什么工作、在哪里工作、长什么样。"),
    words: ["a1-words-jobs", "a1-words-describing-people", "a1-words-work-actions"],
    frames: [
      frame(
        "A: What does your mother do? | B: She's a {x}. My father is a {y}.",
        "What is the man's mother's job?",
        "这个男人的妈妈做什么工作？",
        "doctor, teacher, nurse, driver, cook",
      ),
      frame(
        "A: Where does your brother work? | B: He works in a {x}. My sister works in a {y}.",
        "Where does the man's brother work?",
        "这个男人的兄弟在哪里工作？",
        "hospital, school, bank, shop, restaurant",
      ),
      frame(
        "A: What does Tom look like? | B: He's tall, and he has {x} hair. His brother has {y} hair.",
        "What is Tom's hair like?",
        "Tom 的头发是什么样的？",
        "short, long, black, brown, curly",
      ),
      frame(
        "A: How old is your teacher? | B: She's about {x}. Our music teacher is about {y}.",
        "How old is the man's teacher?",
        "这个男人的老师大约多大年纪？",
        "twenty-five, thirty, forty, fifty, sixty",
      ),
    ],
  }),
  unitListening({
    id: "a1-listening-town-and-travel",
    watchOut: {
      words: t(
        "*left* and *lift*, *road* and *rode* sound alike. *ship* and *sheep* return here: listen for the short vowel of *ship*.",
        "*left* 和 *lift*、*road* 和 *rode* 很像。*ship* 和 *sheep* 又出现了，注意 *ship* 的短元音。",
      ),
      dialogues: t(
        "Platforms and buses come as numbers in pairs; *Don't take* marks the wrong bus. *The park is* gives a second time that is not the answer.",
        "站台和公交都是成对的数字；*Don't take* 后面是不该坐的车。*The park is* 给出的第二个时间不是答案。",
      ),
    },
    title: t("Listening: Town and Travel", "听力：城镇和出行"),
    summary: t("Hear directions, platforms, buses and how far places are.", "听问路、站台、公交车以及地方有多远。"),
    words: ["a1-words-town", "a1-words-directions", "a1-words-trips"],
    frames: [
      frame(
        "A: Excuse me, where is the {x}? | B: Go straight on. It's next to the {y}.",
        "Where does the woman want to go?",
        "这个女人想去哪里？",
        "bank, post office, station, museum, park",
      ),
      frame(
        "The train to London leaves from platform {x}. The train to Oxford leaves from platform {y}.",
        "Which platform does the train to London leave from?",
        "去伦敦的火车从几号站台出发？",
        "one, two, three, four, five",
      ),
      frame(
        "A: How do I get to the station? | B: Take the number {x} bus. Don't take the number {y}, it's very slow.",
        "Which bus should the woman take to the station?",
        "这个女人应该坐几路公交车去车站？",
        "seven, nine, eleven, twelve, fifteen",
      ),
      frame(
        "A: Is the movie theater far? | B: No, it's about {x} minutes on foot. The park is {y} minutes from here.",
        "How long does it take to walk to the movie theater?",
        "走路去电影院要多久？",
        "five, ten, fifteen, twenty, twenty-five",
      ),
    ],
  }),
];

/** topics are the listening topics of A1. */
export const topics: readonly TopicDef[] = [...pairs, ...units];
