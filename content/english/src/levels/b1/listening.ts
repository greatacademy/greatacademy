// The listening topics of B1 (S1): in each unit, sentences with four of the unit's vocabulary topics, and dialogues,
// messages and announcements on its theme, longer than A2's and naming more than one thing a question may be about.
// In the dialogues, A is the usual voice, a woman's, and B a man's.

import type { TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { frame, type UnitListeningSpec, unitListening } from "../listening.ts";
// The modules whose vocabulary topics the listening plays, built before it.
import "./topics.ts";

/** units are the units of B1 with listening and speaking: their slug, titles and the vocabulary topics they play. */
export const units = [
  {
    slug: "education-and-learning",
    en: "Education and Learning",
    zh: "教育与学习",
    words: ["b1-words-school-life", "b1-words-learning", "b1-words-school-people", "b1-words-study-skills"],
  },
  {
    slug: "work-and-careers",
    en: "Work and Careers",
    zh: "工作与职业",
    words: ["b1-words-applying", "b1-words-workplace", "b1-words-business", "b1-words-office"],
  },
  {
    slug: "health-and-fitness",
    en: "Health and Fitness",
    zh: "健康与健身",
    words: ["b1-words-illness", "b1-words-healthcare", "b1-words-fitness", "b1-words-nutrition"],
  },
  {
    slug: "the-environment",
    en: "The Environment",
    zh: "环境",
    words: ["b1-words-environment", "b1-words-nature-2", "b1-words-green-living", "b1-words-waste"],
  },
  {
    slug: "media-and-news",
    en: "Media and News",
    zh: "媒体与新闻",
    words: ["b1-words-news", "b1-words-media", "b1-words-crime", "b1-words-communicating"],
  },
  {
    slug: "technology-in-our-lives",
    en: "Technology in Our Lives",
    zh: "生活中的科技",
    words: ["b1-words-digital", "b1-words-online-safety", "b1-words-gadgets", "b1-words-tech-problems"],
  },
  {
    slug: "travel-and-culture",
    en: "Travel and Culture",
    zh: "旅行与文化",
    words: ["b1-words-culture", "b1-words-travel-2", "b1-words-adventure", "b1-words-travel-problems"],
  },
  {
    slug: "relationships",
    en: "Relationships",
    zh: "人际关系",
    words: ["b1-words-relationships", "b1-words-personality", "b1-words-emotions", "b1-words-life-events"],
  },
  {
    slug: "cities-and-transport",
    en: "Cities and Transport",
    zh: "城市与交通",
    words: ["b1-words-city-life", "b1-words-getting-around", "b1-words-city-problems", "b1-words-buildings"],
  },
  {
    slug: "science-and-discovery",
    en: "Science and Discovery",
    zh: "科学与发现",
    words: ["b1-words-science", "b1-words-research", "b1-words-space-2", "b1-words-inventions"],
  },
  {
    slug: "money-and-consumers",
    en: "Money and Consumers",
    zh: "金钱与消费",
    words: ["b1-words-personal-finance", "b1-words-consumers", "b1-words-value", "b1-words-online-shopping"],
  },
  {
    slug: "arts-and-entertainment",
    en: "Arts and Entertainment",
    zh: "艺术与娱乐",
    words: ["b1-words-arts", "b1-words-film-and-theater", "b1-words-music-2", "b1-words-books-and-stories"],
  },
] as const;

const summaries: Record<(typeof units)[number]["slug"], readonly [string, string]> = {
  "education-and-learning": [
    "Hear about courses, deadlines and exams, and what students and teachers decide.",
    "听课程、截止日期和考试的安排，以及学生和老师的决定。",
  ],
  "work-and-careers": [
    "Hear about job interviews, meetings and what colleagues agree to do.",
    "听求职面试、会议安排，以及同事商定要做的事。",
  ],
  "health-and-fitness": [
    "Hear what doctors advise, what is wrong and when the gym or clinic is open.",
    "听医生的建议、哪里不舒服，以及健身房或诊所的开放时间。",
  ],
  "the-environment": [
    "Hear about recycling, local projects and what a town plans to change.",
    "听回收、本地环保项目，以及一个城镇打算做出的改变。",
  ],
  "media-and-news": [
    "Hear short news reports and what people say about the stories in them.",
    "听简短的新闻报道，以及人们对其中事件的看法。",
  ],
  "technology-in-our-lives": [
    "Hear about devices that stop working, passwords and what a helpdesk advises.",
    "听设备出故障、密码问题，以及技术支持给出的建议。",
  ],
  "travel-and-culture": [
    "Hear travel announcements, delays and what travelers decide to do.",
    "听旅行广播、延误信息，以及旅行者决定怎么做。",
  ],
  relationships: ["Hear friends talk about plans, feelings and the news in their lives.", "听朋友谈计划、感受和生活中的新消息。"],
  "cities-and-transport": [
    "Hear directions, timetable changes and what people think of their city.",
    "听问路指路、时刻表变动，以及人们对自己城市的看法。",
  ],
  "science-and-discovery": ["Hear about experiments, discoveries and what a scientist found.", "听实验、发现，以及一位科学家的研究结果。"],
  "money-and-consumers": ["Hear about prices, refunds and what a shop or bank offers.", "听价格、退款，以及商店或银行提供的服务。"],
  "arts-and-entertainment": [
    "Hear what is on, when it starts and what people thought of a show.",
    "听正在上演什么、几点开始，以及人们对演出的评价。",
  ],
};

const frames: Record<(typeof units)[number]["slug"], ReturnType<typeof frame>[]> = {
  "education-and-learning": [
    frame(
      "A: When is the history essay due? | B: The teacher moved it. It was due on {y}, but now we have until {x}.",
      "When is the history essay due now?",
      "历史论文现在什么时候交？",
      "Monday, Tuesday, Wednesday, Thursday, Friday",
    ),
    frame(
      "A: Which course are you going to take next semester? | B: I thought about {y}, but in the end I chose {x}. It fits my plans better.",
      "Which course did the man choose?",
      "这个男人最后选了哪门课？",
      "biology, economics, psychology, chemistry, geography",
    ),
    frame(
      "Good morning, everyone. Please note that today's exam will take place in {x}, not in {y} as it says on your timetable.",
      "Where will the exam take place?",
      "考试在哪里进行？",
      "the library, the main hall, room twelve, the gym, the science lab",
    ),
    frame(
      "A: How do you usually revise for exams? | B: I used to {y}, but these days I {x}. It works much better for me.",
      "How does the man revise these days?",
      "这个男人现在怎么复习？",
      "make flashcards, study with friends, write summaries, do practice tests, record my notes",
    ),
  ],
  "work-and-careers": [
    frame(
      "A: When is your job interview? | B: It was going to be on {y}, but they changed it to {x}.",
      "When is the man's interview now?",
      "这个男人的面试现在是哪天？",
      "Monday, Tuesday, Wednesday, Thursday, Friday",
    ),
    frame(
      "Hi Sam, it's Laura from the office. The team meeting has moved from {y} to {x}. See you there.",
      "What time is the meeting now?",
      "会议现在几点开？",
      "nine thirty, ten fifteen, eleven o'clock, two thirty, four o'clock",
    ),
    frame(
      "A: What do you do at the company? | B: I started in {y}, but for the last two years I've worked in {x}.",
      "Which department does the man work in now?",
      "这个男人现在在哪个部门工作？",
      "sales, marketing, finance, customer service, human resources",
    ),
    frame(
      "A: Could you send the report to the manager? | B: I've already sent it to {y}. I'll send it to {x} now.",
      "Who will the man send the report to now?",
      "这个男人现在要把报告发给谁？",
      "Mr Chen, Ms Lopez, Mrs Patel, Mr Brown, Ms Kim",
    ),
  ],
  "health-and-fitness": [
    frame(
      "A: What did the doctor say? | B: She said it isn't {y}. It's just {x}, so I need to rest for a few days.",
      "What does the man have?",
      "这个男人得了什么病？",
      "a cold, the flu, an allergy, a virus, a stomach bug",
    ),
    frame(
      "Welcome to City Gym. During the holidays we open at {x} instead of {y}. We close at the usual time.",
      "When does the gym open during the holidays?",
      "假期里健身房几点开门？",
      "six o'clock, seven o'clock, eight o'clock, nine o'clock, ten o'clock",
    ),
    frame(
      "A: How much exercise do you get? | B: I used to go running {y}, but now I go {x}.",
      "How often does the man go running now?",
      "这个男人现在多久跑一次步？",
      "every day, twice a week, three times a week, once a week, every weekend",
    ),
    frame(
      "A: Is there anything I should eat less of? | B: You eat enough {y}. Try to eat less {x}.",
      "What should the woman eat less of?",
      "这个女人应该少吃什么？",
      "sugar, salt, bread, red meat, fried food",
    ),
  ],
  "the-environment": [
    frame(
      "Residents are reminded that {x} is now collected on Tuesdays. {y} is still collected on Fridays.",
      "What is now collected on Tuesdays?",
      "现在每周二收什么？",
      "glass, paper, plastic, garden waste, food waste",
    ),
    frame(
      "A: What are you doing to be greener? | B: I already {y}. This year I've started to {x}.",
      "What has the man started to do this year?",
      "这个男人今年开始做什么？",
      "cycle to work, grow vegetables, buy less plastic, save water, eat less meat",
    ),
    frame(
      "A: Where is the clean-up on Saturday? | B: Last month it was at {y}. This time we're meeting at {x}.",
      "Where is the clean-up this Saturday?",
      "这周六的清洁活动在哪里？",
      "the beach, the river, the park, the station, the town square",
    ),
    frame(
      "The council plans to plant {x} trees in the city this year. Last year it planted {y}.",
      "How many trees will the council plant this year?",
      "市政府今年打算种多少棵树？",
      "two hundred, three hundred, five hundred, eight hundred, a thousand",
    ),
  ],
  "media-and-news": [
    frame(
      "And now the local news. Police are looking for a man who stole {x} from a shop on Bridge Street on {y} evening.",
      "What did the man steal?",
      "这个男人偷了什么？",
      "a laptop, a bicycle, some jewelry, a phone, a camera",
    ),
    frame(
      "A: Where do you get your news? | B: I used to read {y}, but now I mostly use {x}.",
      "Where does the man mostly get his news now?",
      "这个男人现在主要从哪里获取新闻？",
      "the radio, a news app, the newspaper, podcasts, the television",
    ),
    frame(
      "A: Did you see the story about the fire? | B: Yes. It started in {x} and spread to {y}. Nobody was hurt.",
      "Where did the fire start?",
      "火是从哪里烧起来的？",
      "a kitchen, a garage, a factory, a restaurant, a school",
    ),
    frame(
      "This is the weather report. Today will be {y}, but tomorrow will be {x} across the whole country.",
      "What will the weather be like tomorrow?",
      "明天天气怎么样？",
      "sunny, rainy, windy, cloudy, foggy",
    ),
  ],
  "technology-in-our-lives": [
    frame(
      "A: What's wrong with your laptop? | B: The {y} is fine. The problem is the {x}. It stopped working yesterday.",
      "What part of the laptop stopped working?",
      "笔记本电脑的哪个部分坏了？",
      "screen, keyboard, battery, speaker, camera",
    ),
    frame(
      "Thank you for calling the helpdesk. To reset your password, press {x}. To report a problem, press {y}.",
      "Which number do you press to reset your password?",
      "重置密码要按几号键？",
      "one, two, three, four, five",
    ),
    frame(
      "A: Which phone did you buy in the end? | B: I liked the {y}, but I bought the {x} because it was cheaper.",
      "Which phone did the man buy?",
      "这个男人最后买了哪款手机？",
      "black one, silver one, blue one, smaller one, older model",
    ),
    frame(
      "A: How long do you spend online every day? | B: On weekdays about {x}. At the weekend it's {y}.",
      "How long does the man spend online on weekdays?",
      "工作日这个男人每天上网多久？",
      "one hour, two hours, three hours, four hours, five hours",
    ),
  ],
  "travel-and-culture": [
    frame(
      "Attention please. The train to Manchester will leave from platform {x}, not platform {y}.",
      "Which platform will the train leave from?",
      "火车从几号站台出发？",
      "two, four, six, eight, nine",
    ),
    frame(
      "A: How long is the flight delayed? | B: At first they said {y}, but now it's {x}.",
      "How long is the flight delayed now?",
      "航班现在延误多久？",
      "thirty minutes, one hour, two hours, three hours, four hours",
    ),
    frame(
      "A: What did you like most about the trip? | B: The {y} was great, but the best part was the {x}.",
      "What was the best part of the trip for the man?",
      "对这个男人来说，旅行中最棒的是什么？",
      "food, people, museums, beaches, mountains",
    ),
    frame(
      "A: Where are you staying in Rome? | B: We booked {y}, but it was full, so we're staying in {x}.",
      "Where is the man staying in Rome?",
      "这个男人在罗马住在哪里？",
      "a hotel, a hostel, an apartment, a friend's house, a guesthouse",
    ),
  ],
  relationships: [
    frame(
      "A: Did you hear Tom's news? | B: No. Is he {y}? | A: No, he's {x}!",
      "What is Tom's news?",
      "Tom 有什么消息？",
      "getting married, moving abroad, starting a new job, having a baby, going to university",
    ),
    frame(
      "A: How did you and Anna meet? | B: Not at {y}, as people think. We met at {x}.",
      "Where did the man meet Anna?",
      "这个男人在哪里认识了 Anna？",
      "school, work, a party, the gym, a concert",
    ),
    frame(
      "A: How are you feeling about the move? | B: I was {y} at first, but now I'm {x}.",
      "How does the man feel about the move now?",
      "这个男人现在对搬家有什么感受？",
      "excited, nervous, worried, relaxed, sad",
    ),
    frame(
      "Hi Mia, it's Jake. I can't come on {y} after all. Could we meet on {x} instead?",
      "When does Jake want to meet?",
      "Jake 想哪天见面？",
      "Monday, Tuesday, Wednesday, Thursday, Friday",
    ),
  ],
  "cities-and-transport": [
    frame(
      "A: Excuse me, how do I get to the museum? | B: Don't take the {y}. The quickest way is the {x}.",
      "What is the quickest way to the museum?",
      "去博物馆最快的方式是什么？",
      "bus, tram, underground, ferry, train",
    ),
    frame(
      "Because of building work, the number {x} bus will not stop at the station this week. Please use the number {y}.",
      "Which bus will not stop at the station?",
      "哪路公交车不在车站停靠？",
      "five, seven, eleven, twelve, fifteen",
    ),
    frame(
      "A: What's the biggest problem in your city? | B: People complain about {y}, but I think the worst thing is {x}.",
      "What does the man think is the worst thing in his city?",
      "这个男人认为他所在城市最糟糕的是什么？",
      "the traffic, the noise, the pollution, the rent, the crowds",
    ),
    frame(
      "A: Is the bank near here? | B: Yes. Go past the {y} and you'll see it next to the {x}.",
      "What is the bank next to?",
      "银行在什么旁边？",
      "library, post office, cinema, hospital, supermarket",
    ),
  ],
  "science-and-discovery": [
    frame(
      "A: What did the experiment show? | B: We expected the plants to grow faster in {y}, but they grew faster in {x}.",
      "Where did the plants grow faster?",
      "植物在哪种条件下长得更快？",
      "the dark, warm water, cold water, the sun, sandy soil",
    ),
    frame(
      "On today's program, a scientist who discovered a new kind of {x} living deep in the ocean, near {y}.",
      "What did the scientist discover?",
      "这位科学家发现了什么？",
      "fish, jellyfish, shark, octopus, crab",
    ),
    frame(
      "A: When did the telescope go into space? | B: It was planned for {y}, but it finally went up in {x}.",
      "When did the telescope go into space?",
      "望远镜是哪一年进入太空的？",
      "nineteen ninety, two thousand, two thousand and ten, two thousand and fifteen, two thousand and twenty-one",
    ),
    frame(
      "A: Which invention do you think changed the world most? | B: Some say {y}, but for me it's {x}.",
      "Which invention does the man think changed the world most?",
      "这个男人认为哪项发明对世界改变最大？",
      "the internet, the wheel, the printing press, electricity, the telephone",
    ),
  ],
  "money-and-consumers": [
    frame(
      "A: How much was the jacket? | B: It was {y}, but it was on sale, so I paid {x}.",
      "How much did the man pay for the jacket?",
      "这个男人买夹克花了多少钱？",
      "twenty dollars, thirty dollars, forty dollars, fifty dollars, sixty dollars",
    ),
    frame(
      "A: Can I get a refund? | B: You can return it within {x}, but only with the receipt. After {y} we can only exchange it.",
      "How long does the woman have to return it for a refund?",
      "这个女人在多长时间内可以退货退款？",
      "seven days, fourteen days, twenty-one days, thirty days, sixty days",
    ),
    frame(
      "A: What are you saving for? | B: I wanted a {y}, but now I'm saving for a {x}.",
      "What is the man saving for now?",
      "这个男人现在在为什么存钱？",
      "car, holiday, laptop, new phone, bicycle",
    ),
    frame(
      "Your order has been sent. It will arrive on {x}. If you are not at home, it will be left at {y}.",
      "When will the order arrive?",
      "订单什么时候送到？",
      "Monday, Tuesday, Wednesday, Thursday, Friday",
    ),
  ],
  "arts-and-entertainment": [
    frame(
      "A: What time does the film start? | B: The ads start at {y}, but the film itself starts at {x}.",
      "What time does the film start?",
      "电影几点开始？",
      "six fifteen, seven o'clock, seven thirty, eight fifteen, nine o'clock",
    ),
    frame(
      "A: What did you think of the play? | B: The {y} was good, but the {x} was amazing.",
      "What did the man think was amazing?",
      "这个男人觉得什么很精彩？",
      "acting, music, costumes, story, ending",
    ),
    frame(
      "This weekend at the arts center: on Saturday, {x}; on Sunday, {y}. Tickets are available online.",
      "What is on at the arts center on Saturday?",
      "周六艺术中心有什么活动？",
      "a jazz concert, a dance show, a comedy night, a photo exhibition, a poetry reading",
    ),
    frame(
      "A: Which book are you reading now? | B: I finished {y} last week. Now I'm reading {x}.",
      "Which book is the man reading now?",
      "这个男人现在在读哪本书？",
      "a mystery, a biography, a fantasy novel, a history book, a travel book",
    ),
  ],
};

/** watchOuts are the Watch outs of the listening topics, by unit. */
const watchOuts: Record<(typeof units)[number]["slug"], NonNullable<UnitListeningSpec["watchOut"]>> = {
  "education-and-learning": {
    words: t(
      "*essay* is stressed at the start, *ES-ay*. *revise* ends in *z*. *principal* sounds just like *principle*. *pupil* and *people* share a start.",
      "*essay* 重音在前，*ES-ay*。*revise* 结尾读 *z*。*principal* 与 *principle* 读音相同。*pupil* 和 *people* 开头相同。",
    ),
    dialogues: t(
      "Changes are said as *It was due on ..., but now*, *I thought about ..., but in the end*, *not in ... as it says*, *I used to ..., but these days*. The answer follows *now*, *in the end* or *these days*.",
      "变化都这样说：*It was due on ..., but now*、*I thought about ..., but in the end*、*not in ... as it says*、*I used to ..., but these days*。答案在 *now*、*in the end*、*these days* 之后。",
    ),
  },
  "work-and-careers": {
    words: t(
      "*employer* and *employee* differ in the last beat: *em-PLOY-er*, *em-ploy-EE*. *loss* and *lost* are close. *profit* sounds like *prophet*.",
      "*employer* 和 *employee* 差在最后一拍：*em-PLOY-er*、*em-ploy-EE*。*loss* 和 *lost* 很接近。*profit* 与 *prophet* 同音。",
    ),
    dialogues: t(
      "*It was going to be*, *moved from*, *I started in* and *I've already sent it to* all give the old answer first. The new one follows *changed it to*, *to*, *for the last two years* or *now*.",
      "*It was going to be*、*moved from*、*I started in*、*I've already sent it to* 先说旧答案。新答案在 *changed it to*、*to*、*for the last two years* 或 *now* 之后。",
    ),
  },
  "health-and-fitness": {
    words: t(
      "*virus* is *VY-rus*. *allergy* is *AL-er-jee*. *muscle* has a silent *c*, like *mussel*. *weight* sounds like *wait*.",
      "*virus* 读作 *VY-rus*。*allergy* 读作 *AL-er-jee*。*muscle* 的 *c* 不发音，与 *mussel* 同音。*weight* 与 *wait* 同音。",
    ),
    dialogues: t(
      "*it isn't ...*, *instead of*, *I used to* and *You eat enough* each name the wrong one first. The answer follows *It's just*, *we open at*, *now* or *eat less*.",
      "*it isn't ...*、*instead of*、*I used to*、*You eat enough* 先说错的。答案在 *It's just*、*we open at*、*now* 或 *eat less* 之后。",
    ),
  },
  "the-environment": {
    words: t(
      "*climate* is *KLY-mut*. *species* is *SPEE-sheez*. *coral* and *choral* sound alike. *waste* sounds like *waist*.",
      "*climate* 读作 *KLY-mut*。*species* 读作 *SPEE-sheez*。*coral* 和 *choral* 读音相同。*waste* 与 *waist* 同音。",
    ),
    dialogues: t(
      "Two things share a sentence: one collected on Tuesdays and one *still* on Fridays. *already*, *Last month* and *Last year* point to the decoy; *started*, *This time* and *this year* to the answer.",
      "一句话里有两样东西：一样周二收，另一样 *still* 周五收。*already*、*Last month*、*Last year* 指向干扰项；*started*、*This time*、*this year* 指向答案。",
    ),
  },
  "media-and-news": {
    words: t(
      "*bulletin* is *BUL-ih-tin*. *steal* sounds like *steel*. *court* and *caught* are close. *whisper* starts with *w*, not *v*.",
      "*bulletin* 读作 *BUL-ih-tin*。*steal* 与 *steel* 同音。*court* 和 *caught* 很接近。*whisper* 以 *w* 开头，不是 *v*。",
    ),
    dialogues: t(
      "News reports pack two facts in one sentence: what was stolen and when, where a fire started and where it spread. Today's and tomorrow's weather are both given; match the question's day.",
      "新闻一句话里装两个事实：偷了什么、什么时候，火从哪里起、蔓延到哪里。今天和明天的天气都说了，要对上问题里的日子。",
    ),
  },
  "technology-in-our-lives": {
    words: t(
      "*data* can be *DAY-tuh* or *DAH-tuh*. *device* ends in *s*, *devise* in *z*. *cable* and *table* rhyme. *crash* and *cash* differ by one sound.",
      "*data* 可读 *DAY-tuh* 或 *DAH-tuh*。*device* 结尾是 *s*，*devise* 是 *z*。*cable* 和 *table* 押韵。*crash* 和 *cash* 只差一个音。",
    ),
    dialogues: t(
      "*The ... is fine*, *To report a problem* and *I liked the ...* name the decoy. Weekdays and the weekend are both given; the question asks about weekdays.",
      "*The ... is fine*、*To report a problem*、*I liked the ...* 说的是干扰项。工作日和周末都说了，问题问的是工作日。",
    ),
  },
  "travel-and-culture": {
    words: t(
      "*custom* is *KUS-tum*, *costume* is *KOS-tyoom*. *queue* is just *kyoo*. *border* and *boarder* sound the same.",
      "*custom* 读作 *KUS-tum*，*costume* 读作 *KOS-tyoom*。*queue* 就读 *kyoo*。*border* 与 *boarder* 读音相同。",
    ),
    dialogues: t(
      "*not platform*, *At first they said*, *The ... was great, but* and *We booked ..., but it was full* each name the decoy first. The answer follows *but*, *now* or *so*.",
      "*not platform*、*At first they said*、*The ... was great, but*、*We booked ..., but it was full* 先说干扰项。答案在 *but*、*now* 或 *so* 之后。",
    ),
  },
  relationships: {
    words: t(
      "*engaged* ends in a short *d*. *shy* and *sly*, *joy* and *jaw* are close. *twin* and *twine* differ in the vowel. *death* has a soft *th*.",
      "*engaged* 结尾是短促的 *d*。*shy* 和 *sly*、*joy* 和 *jaw* 很接近。*twin* 和 *twine* 元音不同。*death* 结尾是轻柔的 *th*。",
    ),
    dialogues: t(
      "A question with a wrong guess, *Is he ...?*, is answered *No, he's*. *Not at ..., as people think*, *at first* and *I can't come on ... after all* name the decoys.",
      "猜错的问题 *Is he ...?* 用 *No, he's* 回答。*Not at ..., as people think*、*at first* 和 *I can't come on ... after all* 后面是干扰项。",
    ),
  },
  "cities-and-transport": {
    words: t(
      "*suburb* is *SUB-urb*. *rent* and *rant*, *lane* and *line* are close. *fare* sounds like *fair*. *steel* sounds like *steal*.",
      "*suburb* 读作 *SUB-urb*。*rent* 和 *rant*、*lane* 和 *line* 很接近。*fare* 与 *fair* 同音。*steel* 与 *steal* 同音。",
    ),
    dialogues: t(
      "*Don't take the*, *Please use the number*, *People complain about* and *Go past the* name the decoy. The bus that *will not stop* is the answer, not the one to use.",
      "*Don't take the*、*Please use the number*、*People complain about*、*Go past the* 后面是干扰项。*will not stop* 的那路车才是答案，不是要改坐的那路。",
    ),
  },
  "science-and-discovery": {
    words: t(
      "*cell* sounds like *sell*. *gene* sounds like *jean*. *comet* and *comment* differ in stress. *steam* and *stem* differ in the vowel.",
      "*cell* 与 *sell* 同音。*gene* 与 *jean* 同音。*comet* 和 *comment* 重音不同。*steam* 和 *stem* 元音不同。",
    ),
    dialogues: t(
      "*We expected*, *It was planned for* and *Some say* give the guess, not the result. Years are said in words: *two thousand and fifteen*; listen to the end.",
      "*We expected*、*It was planned for*、*Some say* 说的是预期，不是结果。年份用英文说，如 *two thousand and fifteen*，要听到最后。",
    ),
  },
  "money-and-consumers": {
    words: t(
      "*debt* has a silent *b*: *det*. *loan* sounds like *lone*. *fee* and *free*, *worth* and *worse* are close.",
      "*debt* 的 *b* 不发音：*det*。*loan* 与 *lone* 同音。*fee* 和 *free*、*worth* 和 *worse* 很接近。",
    ),
    dialogues: t(
      "Prices and periods come in pairs: the full price and the sale price, the refund period and the exchange period. *I wanted* and *If you are not at home* point to the decoy.",
      "价格和期限成对出现：原价和折扣价，退款期限和换货期限。*I wanted* 和 *If you are not at home* 指向干扰项。",
    ),
  },
  "arts-and-entertainment": {
    words: t(
      "*choir* is *KWIRE*. *poem* has two beats, *POH-um*. *tale* sounds like *tail*. *plot* and *pot* differ by the *l*.",
      "*choir* 读作 *KWIRE*。*poem* 读两拍，*POH-um*。*tale* 与 *tail* 同音。*plot* 和 *pot* 差一个 *l*。",
    ),
    dialogues: t(
      "*The ads start at* gives the earlier time; the film *itself* is later. Saturday and Sunday are both listed; *I finished ... last week* names the book that is not the answer.",
      "*The ads start at* 给的是更早的时间，电影 *itself* 更晚。周六和周日的节目都列出来了；*I finished ... last week* 说的书不是答案。",
    ),
  },
};

/** topics are the listening topics of the units of B1, in their order. */
export const topics: readonly TopicDef[] = units.map((u) =>
  unitListening({
    id: `b1-listening-${u.slug}`,
    title: t(`Listening: ${u.en}`, `听力：${u.zh}`),
    summary: t(summaries[u.slug][0], summaries[u.slug][1]),
    words: u.words,
    frames: frames[u.slug],
    watchOut: watchOuts[u.slug],
  }),
);
