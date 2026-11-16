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
