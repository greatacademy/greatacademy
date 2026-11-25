// The listening topics of B2 (S1): in each unit, sentences with four of the unit's vocabulary topics, and talks,
// reports and discussions on its theme, where a speaker corrects, compares or changes their mind, so that only a
// listener who follows the argument answers right. In the dialogues, A is the usual voice, a woman's, and B a man's.

import type { TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { frame, type UnitListeningSpec, unitListening } from "../listening.ts";
// The modules whose vocabulary topics the listening plays, built before it.
import "./topics.ts";

/** units are the units of B2 with listening and speaking: their slug, titles and the vocabulary topics they play. */
export const units = [
  {
    slug: "society-and-change",
    en: "Society and Change",
    zh: "社会与变迁",
    words: ["b2-words-society", "b2-words-population", "b2-words-history", "b2-words-social-issues"],
  },
  {
    slug: "work-and-the-economy",
    en: "Work and the Economy",
    zh: "工作与经济",
    words: ["b2-words-economy", "b2-words-companies", "b2-words-employment", "b2-words-finance"],
  },
  {
    slug: "science-ethics-and-medicine",
    en: "Science, Ethics and Medicine",
    zh: "科学、伦理与医学",
    words: ["b2-words-medicine", "b2-words-ethics", "b2-words-genetics", "b2-words-mental-health"],
  },
  {
    slug: "climate-and-sustainability",
    en: "Climate and Sustainability",
    zh: "气候与可持续发展",
    words: ["b2-words-climate-change", "b2-words-energy", "b2-words-ecosystems", "b2-words-sustainability"],
  },
  {
    slug: "media-and-persuasion",
    en: "Media and Persuasion",
    zh: "媒体与说服",
    words: ["b2-words-journalism", "b2-words-persuasion", "b2-words-advertising", "b2-words-online-media"],
  },
  {
    slug: "education-and-opportunity",
    en: "Education and Opportunity",
    zh: "教育与机会",
    words: ["b2-words-higher-education", "b2-words-learning-2", "b2-words-assessment", "b2-words-opportunity"],
  },
  {
    slug: "culture-identity-and-globalization",
    en: "Culture, Identity and Globalization",
    zh: "文化、身份与全球化",
    words: ["b2-words-identity", "b2-words-globalization", "b2-words-language", "b2-words-traditions"],
  },
  {
    slug: "technology-and-the-future",
    en: "Technology and the Future",
    zh: "科技与未来",
    words: ["b2-words-ai", "b2-words-innovation", "b2-words-cyber", "b2-words-space-future"],
  },
  {
    slug: "law-rights-and-justice",
    en: "Law, Rights and Justice",
    zh: "法律、权利与正义",
    words: ["b2-words-law", "b2-words-court", "b2-words-crime-2", "b2-words-rights"],
  },
  {
    slug: "mind-and-behavior",
    en: "Mind and Behavior",
    zh: "心理与行为",
    words: ["b2-words-psychology", "b2-words-decisions", "b2-words-behavior", "b2-words-memory-and-sleep"],
  },
] as const;

type Slug = (typeof units)[number]["slug"];

const summaries: Record<Slug, readonly [string, string]> = {
  "society-and-change": [
    "Follow reports and discussions on population, history and social change, where figures and views are compared.",
    "听关于人口、历史和社会变迁的报道与讨论，其中会比较数字和观点。",
  ],
  "work-and-the-economy": [
    "Follow business news and conversations at work, where plans and figures change.",
    "听商业新闻和职场对话，其中计划和数字会有变化。",
  ],
  "science-ethics-and-medicine": [
    "Follow talks on medicine and research, and what experts conclude.",
    "听关于医学和研究的讲座，以及专家得出的结论。",
  ],
  "climate-and-sustainability": [
    "Follow reports on energy and climate, and what governments and towns decide.",
    "听关于能源和气候的报道，以及政府和城镇做出的决定。",
  ],
  "media-and-persuasion": [
    "Follow discussions of news, advertising and how people are persuaded.",
    "听关于新闻、广告以及人们如何被说服的讨论。",
  ],
  "education-and-opportunity": [
    "Follow advice on universities, courses and applications, where speakers change their plans.",
    "听关于大学、课程和申请的建议，说话人会改变计划。",
  ],
  "culture-identity-and-globalization": [
    "Follow conversations about languages, traditions and living abroad.",
    "听关于语言、传统和海外生活的对话。",
  ],
  "technology-and-the-future": [
    "Follow talks and news on artificial intelligence, security and space.",
    "听关于人工智能、网络安全和太空的讲座与新闻。",
  ],
  "law-rights-and-justice": ["Follow court reports and discussions of rights and laws.", "听法庭报道以及关于权利和法律的讨论。"],
  "mind-and-behavior": [
    "Follow talks on memory, sleep and decisions, and what studies found.",
    "听关于记忆、睡眠和决策的讲座，以及研究的发现。",
  ],
};

const frames: Record<Slug, ReturnType<typeof frame>[]> = {
  "society-and-change": [
    frame(
      "The population of the region has grown quickly. Twenty years ago it was about {y} people; today it is closer to {x}.",
      "What is the population of the region today?",
      "这个地区现在的人口大约是多少？",
      "two million, three million, four million, five million, six million",
    ),
    frame(
      "A: What do you think is the biggest problem young people face? | B: Many people would say {y}, and that matters, but in my view the real issue is {x}.",
      "What does the man think is the real issue?",
      "这个男人认为真正的问题是什么？",
      "housing, unemployment, loneliness, inequality, debt",
    ),
    frame(
      "A: When was the bridge built? | B: Most guidebooks say {y}, but the records show it was actually finished in {x}.",
      "When was the bridge actually finished?",
      "这座桥实际上是哪一年建成的？",
      "eighteen fifty, eighteen seventy, eighteen ninety, nineteen ten, nineteen thirty",
    ),
    frame(
      "In today's survey, {x} of people said they trusted their neighbors, compared with {y} ten years ago.",
      "How many people said they trusted their neighbors in today's survey?",
      "在今天的调查中，多少人表示信任邻居？",
      "forty percent, fifty percent, sixty percent, seventy percent, eighty percent",
    ),
  ],
  "work-and-the-economy": [
    frame(
      "Shares in the company fell by {x} this morning, after it said profits would be lower than the {y} that investors had expected.",
      "By how much did the company's shares fall?",
      "这家公司的股价下跌了多少？",
      "two percent, five percent, eight percent, ten percent, twelve percent",
    ),
    frame(
      "A: Are we still opening the new office in {y}? | B: No, the board has decided on {x} instead. The rents are lower there.",
      "Where will the new office open?",
      "新办公室开在哪里？",
      "Berlin, Madrid, Dublin, Warsaw, Lisbon",
    ),
    frame(
      "A: How many people are they hiring? | B: The first plan was {y}, but because of the budget it's now just {x}.",
      "How many people are they hiring now?",
      "他们现在要招多少人？",
      "five, ten, fifteen, twenty, thirty",
    ),
    frame(
      "A: What's your main concern about the merger? | B: Not {y}, to be honest. What worries me most is {x}.",
      "What worries the man most about the merger?",
      "关于合并，这个男人最担心的是什么？",
      "job losses, the cost, the timing, the new managers, the company's culture",
    ),
  ],
  "science-ethics-and-medicine": [
    frame(
      "In the trial, the new drug helped {x} of patients. The older treatment helped only {y}.",
      "How many patients did the new drug help?",
      "新药帮助了多少病人？",
      "a third, half, two thirds, three quarters, most",
    ),
    frame(
      "A: Is the main risk of the treatment {y}? | B: That's possible, but it's rare. The main risk is actually {x}.",
      "What is the main risk of the treatment?",
      "这种治疗的主要风险是什么？",
      "infection, headaches, tiredness, weight gain, sleep problems",
    ),
    frame(
      "A: Which part of the study raised ethical questions? | B: People expected it to be {y}, but the committee was more worried about {x}.",
      "What was the committee more worried about?",
      "伦理委员会更担心什么？",
      "the consent forms, the use of animals, the patients' privacy, the funding, the age of the volunteers",
    ),
    frame(
      "Today's speaker is a doctor who has worked on mental health for {x}. Before that she spent {y} in a children's hospital.",
      "How long has the speaker worked on mental health?",
      "演讲者从事心理健康工作多久了？",
      "five years, ten years, fifteen years, twenty years, twenty-five years",
    ),
  ],
  "climate-and-sustainability": [
    frame(
      "Last year the country produced {x} of its electricity from wind and solar power, up from {y} the year before.",
      "How much of the country's electricity came from wind and solar last year?",
      "去年该国有多少电力来自风能和太阳能？",
      "twenty percent, twenty-five percent, thirty percent, thirty-five percent, forty percent",
    ),
    frame(
      "A: Which project will the town fund first? | B: We discussed {y}, but we've agreed to start with {x}.",
      "Which project will the town fund first?",
      "这个城镇会先资助哪个项目？",
      "solar panels on schools, new cycle lanes, a tree planting scheme, electric buses, home insulation",
    ),
    frame(
      "A: What caused the flooding? | B: Some blamed {y}, but the report found the main cause was {x}.",
      "What did the report find was the main cause of the flooding?",
      "报告认为洪水的主要原因是什么？",
      "heavy rain, blocked drains, new buildings, cutting down forests, rising sea levels",
    ),
    frame(
      "The government aims to cut emissions by half by {x}. Its earlier target was {y}.",
      "By when does the government now aim to cut emissions by half?",
      "政府现在计划在哪一年之前把排放量减半？",
      "twenty thirty, twenty thirty-five, twenty forty, twenty forty-five, twenty fifty",
    ),
  ],
  "media-and-persuasion": [
    frame(
      "A: Where did the story first appear? | B: Everyone thinks it was {y}, but it actually started on {x}.",
      "Where did the story actually start?",
      "这条新闻实际上最早出现在哪里？",
      "a radio show, a blog, a podcast, a local paper, a video site",
    ),
    frame(
      "A: What makes this advert so persuasive? | B: It isn't really {y}. It works because of {x}.",
      "Why does the man think the advert works?",
      "这个男人认为这则广告为什么有效？",
      "the music, the humor, the famous actor, the slogan, the images",
    ),
    frame(
      "According to the study, people now spend {x} a day on social media, compared with {y} five years ago.",
      "How long do people now spend on social media each day?",
      "根据研究，人们现在每天在社交媒体上花多少时间？",
      "one hour, ninety minutes, two hours, two and a half hours, three hours",
    ),
    frame(
      "A: Did the editor agree to publish the article? | B: Not on {y}, as we'd hoped. It'll go out on {x}.",
      "When will the article be published?",
      "这篇文章什么时候发表？",
      "Monday, Tuesday, Wednesday, Thursday, Friday",
    ),
  ],
  "education-and-opportunity": [
    frame(
      "A: Which university have you applied to? | B: My parents wanted me to apply to {y}, but I chose {x} because of its engineering course.",
      "Which university did the man choose?",
      "这个男人选择了哪所大学？",
      "Leeds, Bristol, Glasgow, Cardiff, York",
    ),
    frame(
      "Applications for the scholarship close on {x}. Please note that this is earlier than the {y} deadline for other courses.",
      "When do applications for the scholarship close?",
      "奖学金申请什么时候截止？",
      "the first of March, the fifteenth of March, the first of April, the fifteenth of April, the first of May",
    ),
    frame(
      "A: How is the course assessed? | B: There used to be {y}, but now it's mainly {x}.",
      "How is the course mainly assessed now?",
      "这门课现在主要怎么考核？",
      "written exams, coursework, a final project, group presentations, online tests",
    ),
    frame(
      "A: What's the best thing about the apprenticeship? | B: The {y} is good, but the best thing is {x}.",
      "What is the best thing about the apprenticeship for the man?",
      "对这个男人来说，学徒制最好的地方是什么？",
      "the pay, the training, the experience, the people, the job at the end",
    ),
  ],
  "culture-identity-and-globalization": [
    frame(
      "A: Which language do you speak at home? | B: My parents speak {y} to each other, but with us they always speak {x}.",
      "Which language do the man's parents speak with their children?",
      "这个男人的父母和孩子们说什么语言？",
      "Spanish, Arabic, Polish, Hindi, Mandarin",
    ),
    frame(
      "A: What did you find hardest about living abroad? | B: People expect it to be {y}, but for me it was {x}.",
      "What did the man find hardest about living abroad?",
      "这个男人觉得在国外生活最难的是什么？",
      "the language, the food, the weather, being far from family, making friends",
    ),
    frame(
      "The festival, which began as a small local event in {y}, now attracts visitors from more than {x} countries.",
      "How many countries do visitors now come from?",
      "现在游客来自多少个国家？",
      "twenty, thirty, forty, fifty, sixty",
    ),
    frame(
      "A: Which tradition do you most want to keep? | B: Not {y}, really. I'd most like to keep {x}.",
      "Which tradition does the man most want to keep?",
      "这个男人最想保留哪项传统？",
      "the family dinners, the songs, the dances, the stories, the festivals",
    ),
  ],
  "technology-and-the-future": [
    frame(
      "A: What do you use artificial intelligence for at work? | B: I tried it for {y}, but now I mainly use it for {x}.",
      "What does the man mainly use artificial intelligence for now?",
      "这个男人现在主要用人工智能做什么？",
      "writing emails, translating, checking code, planning meetings, summarizing reports",
    ),
    frame(
      "The company says the attack affected about {x} customers, not the {y} reported earlier.",
      "How many customers did the attack affect?",
      "这次攻击影响了大约多少客户？",
      "ten thousand, fifty thousand, a hundred thousand, half a million, a million",
    ),
    frame(
      "The mission to Mars, first planned for {y}, is now expected to launch in {x}.",
      "When is the mission now expected to launch?",
      "这次火星任务现在预计哪一年发射？",
      "twenty thirty, twenty thirty-two, twenty thirty-four, twenty thirty-six, twenty thirty-eight",
    ),
    frame(
      "A: What's the biggest risk of new technology, in your view? | B: People talk a lot about {y}, but I think the bigger risk is {x}.",
      "What does the man think is the bigger risk?",
      "这个男人认为更大的风险是什么？",
      "lost jobs, privacy, fake news, cyber attacks, people's attention",
    ),
  ],
  "law-rights-and-justice": [
    frame(
      "The court found the company guilty and ordered it to pay {x}. The prosecution had asked for {y}.",
      "How much did the court order the company to pay?",
      "法院判这家公司赔多少钱？",
      "ten thousand pounds, fifty thousand pounds, a hundred thousand pounds, half a million pounds, a million pounds",
    ),
    frame(
      "A: Which right do you think matters most? | B: Many people would say {y}, but for me it's {x}.",
      "Which right matters most to the man?",
      "对这个男人来说，哪项权利最重要？",
      "free speech, privacy, education, a fair trial, the right to vote",
    ),
    frame(
      "A: When does the new law come into force? | B: It was meant to be {y}, but it's been delayed until {x}.",
      "When does the new law come into force?",
      "新法律什么时候生效？",
      "January, March, May, September, November",
    ),
    frame(
      "The man was sentenced to {x} in prison. He could have received up to {y}.",
      "How long was the man sentenced to?",
      "这个男人被判了多久？",
      "two years, three years, five years, seven years, ten years",
    ),
  ],
  "mind-and-behavior": [
    frame(
      "In the study, people who slept {x} a night remembered the most words. Those who slept {y} remembered fewer.",
      "How much sleep did the people who remembered the most words get?",
      "记住单词最多的人每晚睡多久？",
      "five hours, six hours, seven hours, eight hours, nine hours",
    ),
    frame(
      "A: What helps you make a hard decision? | B: I used to rely on {y}, but now I find {x} works better.",
      "What does the man now find works better?",
      "这个男人现在觉得什么更有效？",
      "making a list, sleeping on it, asking a friend, going for a walk, writing it down",
    ),
    frame(
      "A: Why do you think people behave differently in groups? | B: It's partly {y}, but mostly it's {x}.",
      "What does the man think is the main reason?",
      "这个男人认为主要原因是什么？",
      "the fear of standing out, the wish to belong, the lack of responsibility, the pressure of others, the need to be liked",
    ),
    frame(
      "Our next talk, on how habits form, has moved from room {y} to room {x}.",
      "Which room is the talk in now?",
      "讲座现在在哪个房间？",
      "two hundred, two hundred and five, three hundred, three hundred and ten, four hundred",
    ),
  ],
};

/** watchOuts are the Watch outs of the listening topics, by unit. */
const watchOuts: Record<(typeof units)[number]["slug"], NonNullable<UnitListeningSpec["watchOut"]>> = {
  "society-and-change": {
    words: t(
      "*emigrate* and *immigrate* differ only in the first vowel: *EM-* leaves, *IM-* arrives. *era* and *error* are close. *century* is *SEN-chuh-ree*.",
      "*emigrate* 和 *immigrate* 只差第一个元音：*EM-* 是移出，*IM-* 是移入。*era* 和 *error* 很接近。*century* 读作 *SEN-chuh-ree*。",
    ),
    dialogues: t(
      "Figures and dates come in pairs: *Twenty years ago* and *today*, *Most guidebooks say* and *the records show*, *compared with ... ten years ago*. *Many people would say* introduces a view the speaker does not hold.",
      "数字和年代成对出现：*Twenty years ago* 与 *today*、*Most guidebooks say* 与 *the records show*、*compared with ... ten years ago*。*Many people would say* 引出的是说话人并不认同的看法。",
    ),
  },
  "work-and-the-economy": {
    words: t(
      "*export* and *import* stress the first beat as nouns and the second as verbs. *firm* and *farm*, *boom* and *broom* are close. *audit* is *AW-dit*.",
      "*export*、*import* 作名词重音在前，作动词重音在后。*firm* 和 *farm*、*boom* 和 *broom* 很接近。*audit* 读作 *AW-dit*。",
    ),
    dialogues: t(
      "Expected and real figures sit together: shares fell by one number, profits were expected at another. *Are we still ... in*, *The first plan was* and *Not ..., to be honest* name the decoy.",
      "预期和实际数字放在一起：股价跌了一个数，利润预期是另一个数。*Are we still ... in*、*The first plan was* 和 *Not ..., to be honest* 后面是干扰项。",
    ),
  },
  "science-ethics-and-medicine": {
    words: t(
      "*chronic* and *acute* are opposites; *chronic* starts with *k*. *dose* rhymes with *close*. *moral* and *morale* differ in stress: *MOR-ul*, *muh-RAL*.",
      "*chronic* 和 *acute* 意思相反；*chronic* 以 *k* 开头。*dose* 与 *close* 押韵。*moral* 和 *morale* 重音不同：*MOR-ul*、*muh-RAL*。",
    ),
    dialogues: t(
      "Fractions and periods come in pairs: the new drug and the older treatment, years on mental health and years in a hospital. *Is the main risk ...?* is a wrong guess; *actually* brings the answer.",
      "分数和时长成对出现：新药与旧疗法，从事心理健康的年数与在医院的年数。*Is the main risk ...?* 是猜错的；*actually* 后面才是答案。",
    ),
  },
  "climate-and-sustainability": {
    words: t(
      "*methane* is *METH-ane*. *ozone* is *OH-zone*. *reef* and *leaf*, *marsh* and *mash* are close. *emit* is stressed at the end.",
      "*methane* 读作 *METH-ane*。*ozone* 读作 *OH-zone*。*reef* 和 *leaf*、*marsh* 和 *mash* 很接近。*emit* 重音在后。",
    ),
    dialogues: t(
      "Percentages pair *last year* with *the year before*; targets pair *now* with *Its earlier target*. *We discussed* and *Some blamed* name the decoy; *agreed* and *found* name the answer.",
      "百分比把 *last year* 和 *the year before* 配在一起；目标把现在和 *Its earlier target* 配在一起。*We discussed*、*Some blamed* 后是干扰项；*agreed*、*found* 后是答案。",
    ),
  },
  "media-and-persuasion": {
    words: t(
      "*column* has a silent *n*: *KOL-um*. *tabloid* is *TAB-loyd*. *viral* is *VY-rul*. *meme* rhymes with *team*.",
      "*column* 的 *n* 不发音：*KOL-um*。*tabloid* 读作 *TAB-loyd*。*viral* 读作 *VY-rul*。*meme* 与 *team* 押韵。",
    ),
    dialogues: t(
      "*Everyone thinks it was*, *It isn't really*, *compared with ... five years ago* and *Not on ..., as we'd hoped* name the decoy. The answer follows *actually*, *because of*, *now* or *It'll go out on*.",
      "*Everyone thinks it was*、*It isn't really*、*compared with ... five years ago* 和 *Not on ..., as we'd hoped* 后面是干扰项。答案在 *actually*、*because of*、*now* 或 *It'll go out on* 之后。",
    ),
  },
  "education-and-opportunity": {
    words: t(
      "*thesis* is *THEE-sis*. *faculty* is *FAK-ul-tee*. *grasp* and *grass* differ at the end. *merit* and *married* are close.",
      "*thesis* 读作 *THEE-sis*。*faculty* 读作 *FAK-ul-tee*。*grasp* 和 *grass* 结尾不同。*merit* 和 *married* 很接近。",
    ),
    dialogues: t(
      "*My parents wanted me to*, *the ... deadline for other courses*, *There used to be* and *The ... is good, but* name the decoy. Dates use ordinals: *the fifteenth of March*.",
      "*My parents wanted me to*、*the ... deadline for other courses*、*There used to be* 和 *The ... is good, but* 后面是干扰项。日期用序数词：*the fifteenth of March*。",
    ),
  },
  "culture-identity-and-globalization": {
    words: t(
      "*myth* has a soft *th*. *ritual* is *RICH-oo-ul*. *idiom* is *ID-ee-um*. *taboo* is stressed at the end, *tuh-BOO*.",
      "*myth* 结尾是轻柔的 *th*。*ritual* 读作 *RICH-oo-ul*。*idiom* 读作 *ID-ee-um*。*taboo* 重音在后，*tuh-BOO*。",
    ),
    dialogues: t(
      "*to each other* and *with us* split the parents' two languages. *People expect it to be* and *Not ..., really* name the decoy. In the festival report, the year it began is not the number asked.",
      "*to each other* 和 *with us* 把父母的两种语言分开。*People expect it to be* 和 *Not ..., really* 后面是干扰项。节日报道里，开始的年份不是所问的数字。",
    ),
  },
  "technology-and-the-future": {
    words: t(
      "*neural* is *NOOR-ul*. *lunar* is *LOO-ner*. *breach* sounds like *breech*. *hack* and *heck* differ in the vowel.",
      "*neural* 读作 *NOOR-ul*。*lunar* 读作 *LOO-ner*。*breach* 与 *breech* 同音。*hack* 和 *heck* 元音不同。",
    ),
    dialogues: t(
      "*I tried it for*, *not the ... reported earlier*, *first planned for* and *People talk a lot about* name the decoy. Big numbers and years in words need the whole phrase: *twenty thirty-four*.",
      "*I tried it for*、*not the ... reported earlier*、*first planned for* 和 *People talk a lot about* 后面是干扰项。用英文说的大数和年份要听完整：*twenty thirty-four*。",
    ),
  },
  "law-rights-and-justice": {
    words: t(
      "*jury* is *JOOR-ee*. *verdict* is *VER-dikt*. *fraud* is *frawd*. *civil* and *evil* rhyme only in spelling: *SIV-ul*, *EE-vul*.",
      "*jury* 读作 *JOOR-ee*。*verdict* 读作 *VER-dikt*。*fraud* 读作 *frawd*。*civil* 和 *evil* 只是拼写相似：*SIV-ul*、*EE-vul*。",
    ),
    dialogues: t(
      "Sentences and fines come in pairs: what was ordered and what the prosecution asked for, the sentence and the most he could have received. *It was meant to be* and *Many people would say* name the decoy.",
      "刑期和罚款成对出现：判了多少与检方要求多少，判了几年与最多可判几年。*It was meant to be* 和 *Many people would say* 后面是干扰项。",
    ),
  },
  "mind-and-behavior": {
    words: t(
      "*doze* and *dose* differ only in *z* and *s*. *tend* and *tent* differ at the end. *nightmare* is stressed at the start. *psychologist* has a silent *p*.",
      "*doze* 和 *dose* 只差 *z* 和 *s*。*tend* 和 *tent* 结尾不同。*nightmare* 重音在前。*psychologist* 的 *p* 不发音。",
    ),
    dialogues: t(
      "Two sleep times are compared; the question asks about those who remembered *the most*. *I used to rely on*, *It's partly* and *moved from room* name the decoy; *now*, *mostly* and *to room* bring the answer.",
      "比较两个睡眠时长，问题问的是记住 *the most* 的那组。*I used to rely on*、*It's partly*、*moved from room* 后是干扰项；*now*、*mostly*、*to room* 后是答案。",
    ),
  },
};

/** topics are the listening topics of the units of B2, in their order. */
export const topics: readonly TopicDef[] = units.map((u) =>
  unitListening({
    id: `b2-listening-${u.slug}`,
    title: t(`Listening: ${u.en}`, `听力：${u.zh}`),
    summary: t(summaries[u.slug][0], summaries[u.slug][1]),
    words: u.words,
    frames: frames[u.slug],
    watchOut: watchOuts[u.slug],
  }),
);
