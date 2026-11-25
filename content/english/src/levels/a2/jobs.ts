// A2, unit 12: Jobs and Dreams. More jobs, work life and ambitions; questions about the subject and about the object;
// a dream job judged by a model.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator, type WritingItem } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { everyPair, interleave, vocabularyTopic, word } from "../words.ts";
import { judgedTopic } from "./kit.ts";
import { subjectAndObjectQuestionsWriteNot } from "./mistakes.ts";

const jobs2 = vocabularyTopic({
  id: "a2-words-jobs-2",
  title: t("More Jobs", "更多职业"),
  summary: t(
    "Engineers, scientists and mechanics; artists, singers, actors and writers; pilots, waiters and chefs; firefighters and businessmen.",
    "工程师、科学家和机修工；艺术家、歌手、演员和作家；飞行员、服务员和厨师；消防员和商人。",
  ),
  intro: t(
    "At careers day, a **pilot**, a **chef** and an **engineer** told us about their work, and then a famous **singer** sang for everyone. These words help you name jobs and say what people do at work.",
    "职业日那天，一位 **pilot**（飞行员）、一位 **chef**（厨师）和一位 **engineer**（工程师）给我们讲了他们的工作，然后一位著名的 **singer**（歌手）为大家唱了歌。这些词帮你说出各种职业，以及人们在工作中做什么。",
  ),
  prerequisites: ["a1-words-jobs"],
  words: [
    word(
      "engineer engineers",
      "a person who designs and builds machines, roads or bridges",
      "工程师",
      "The {engineer} designed a new bridge over the river. | My mom is the {engineer} who planned the new road to the airport. | {Engineers} are building a new subway line.|Mechanics Scientists",
      "mechanic scientist",
    ),
    word(
      "scientist scientists",
      "a person who studies how nature and the world work",
      "科学家",
      "The {scientist} did an experiment in her lab. | {Scientists} are looking for a cure for the disease.|Engineers Artists | Marie Curie was a famous {scientist}: she studied chemistry and physics.",
      "engineer artist",
    ),
    word(
      "artist artists",
      "a person who paints or draws pictures",
      "艺术家；画家",
      "The {artist} painted a picture of the sea. | There are paintings by local {artists} in the gallery.|actors writers | She loves painting, so she wants to be a famous {artist}.",
      "actor writer",
    ),
    word(
      "singer singers",
      "a person who sings, often as a job",
      "歌手",
      "She's a famous pop {singer}. | The {singer} sang three songs at the concert. | My brother is the {singer} in a rock band: he has a great voice.",
      "actor writer",
    ),
    word(
      "actor actors",
      "a person who plays a part in a film or a play",
      "演员",
      "Jackie Chan is a famous {actor} who has been in over a hundred films. | The {actors} played their parts well in the school play.|singers artists | He wants to be a film {actor} and play parts in movies.",
      "singer artist",
    ),
    word(
      "pilot pilots",
      "a person who flies a plane",
      "飞行员",
      "The {pilot} flying the plane said we would land in ten minutes. | My uncle is a {pilot}. He flies planes to Europe every week. | The two {pilots} sat at the front and flew the plane.|passengers mechanics",
      "passenger mechanic",
    ),
    word(
      "waiter waiters",
      "a person who brings food to your table in a restaurant",
      "服务员",
      "The {waiter} brought us the menu. | Let's ask the {waiter} for the bill. | She worked as a {waiter} in a cafe last summer, carrying food to the tables.",
      "chef customer",
    ),
    word(
      "chef chefs",
      "a person who cooks in a restaurant",
      "厨师",
      "The {chef} cooked us a special dish. | My dream is to be a {chef} and cook in a big hotel kitchen. | There are five {chefs} cooking in the restaurant's kitchen.|waiters customers",
      "waiter customer",
    ),
    word(
      "writer writers",
      "a person who writes books or stories",
      "作家",
      "Lu Xun was a famous Chinese {writer} who wrote many stories. | The {writer} is signing her new book at the bookstore. | She writes stories every day because she wants to be a famous {writer}.",
      "artist singer",
    ),
    word(
      "mechanic mechanics",
      "a person who repairs cars and machines",
      "机修工",
      "The {mechanic} fixed my car in an hour. | Your motorbike is broken: take it to the {mechanic} at the garage. | My dad repairs cars, buses and trucks: he is the {mechanic} at our village garage.",
      "engineer pilot",
    ),
    word(
      "firefighter firefighters",
      "a person whose job is to stop fires",
      "消防员",
      "The {firefighters} put out the fire quickly.|police mechanics | The {firefighter} climbed a ladder into the burning house and saved the cat. | {Firefighters} are very brave: they run into fires to save people.|Police Mechanics",
      "police mechanic",
    ),
    word(
      "businessman businessmen",
      "a man who works in business, buying and selling things",
      "商人",
      "He's a {businessman} who buys and sells phones in three shops. | Many {businessmen} came to the city to buy and sell their goods.|managers waiters | The {businessman} sold his company for a lot of money.",
      "manager waiter",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Waiter* and *chef* both work in a restaurant: the *chef* cooks in the kitchen, and the *waiter* brings the menu, the food and the bill to your table. Look for cooking or the table in the sentence.",
        "*waiter* 和 *chef* 都在餐馆工作：*chef* 在厨房做饭，*waiter* 把菜单、饭菜和账单送到你桌上。在句子里找做饭或餐桌的线索。",
      ),
      meaning: t(
        "*Engineer* and *mechanic* both work with machines: an *engineer* designs and builds new things like bridges, roads and subways, and a *mechanic* repairs cars and machines that are broken.",
        "*engineer* 和 *mechanic* 都和机器打交道：*engineer* 设计、建造桥梁、道路、地铁这样的新东西，*mechanic* 修理坏了的汽车和机器。",
      ),
      spell: t(
        "*Engineer* ends in -eer, and *businessman* has a u said like short i: bus · i · ness · man, with the plural *businessmen*.",
        "*engineer* 以 -eer 结尾；*businessman* 里的 u 读短元音 i：bus · i · ness · man，复数是 *businessmen*。",
      ),
    },
    notes: `
      engineer|designing a bridge;planning a road;building a subway line|an engineer designs and builds new things; a mechanic repairs broken ones|engineer 设计建造新东西；mechanic 修理坏了的东西|mechanic=mechanic repairs broken cars and machines, not designing and building bridges, roads or subways=mechanic 修理坏了的汽车和机器，不设计建造桥梁、道路或地铁;scientist=scientist studies how nature and the world work, not designing and building bridges, roads or subways=scientist 研究自然和世界的规律，不设计建造桥梁、道路或地铁|a civil engineer · an engineer|-eer at the end, as in *volunteer*|结尾是 -eer，和 *volunteer* 一样
      scientist|an experiment in a lab;looking for a cure;Marie Curie's studies|a scientist studies how the world works; an engineer builds things|scientist 研究世界的规律；engineer 建造东西|engineer=engineer designs and builds machines, roads or bridges, not studies and experiments about nature=engineer 设计建造机器、道路或桥梁，不做自然研究和实验;artist=artist paints or draws pictures, not studies and experiments about nature=artist 画画，不做自然研究和实验|a famous scientist|sc said like s, and -ist at the end: sci · en · tist|sc 读作 s，结尾是 -ist：sci · en · tist
      artist|painting the sea;paintings in a gallery;loving painting|an artist paints or draws; an actor plays parts in films|artist 画画；actor 演戏|actor=actor plays parts in films and plays, not painting pictures=actor 在电影和戏剧里演角色，不画画;writer=writer writes books and stories, not painting pictures=writer 写书写故事，不画画|a famous artist · local artists|art + -ist|art 加 -ist
      singer|pop music;three songs at a concert;a rock band and a great voice|a singer sings; an actor plays parts|singer 唱歌；actor 演戏|actor=actor plays parts in films and plays, not singing songs in a band or at a concert=actor 演角色，不在乐队里或音乐会上唱歌;writer=writer writes books and stories, not singing songs=writer 写书写故事，不唱歌|a pop singer|sing + -er, with ng said as one sound|sing 加 -er，ng 读作一个音
      actor|a hundred films;parts in a school play;playing parts in movies|an actor plays parts; a singer sings songs|actor 演角色；singer 唱歌|singer=singer sings songs, not playing parts in films or plays=singer 唱歌，不在电影或戏剧里演角色;artist=artist paints or draws pictures, not playing parts in films or plays=artist 画画，不在电影或戏剧里演角色|a film actor · a famous actor|-or at the end, not -er|结尾是 -or，不是 -er
      pilot|a plane landing in ten minutes;flying planes to Europe;two people at the front|a pilot flies the plane; a passenger travels in it|pilot 驾驶飞机；passenger 是乘客|passenger/passengers=passenger travels in a plane but does not fly it=passenger 乘坐飞机，但不驾驶飞机;mechanic=mechanic repairs cars and machines on the ground, not flying a plane=mechanic 在地面修理汽车和机器，不驾驶飞机|an airline pilot|pi · lot, with i that says its name|pi · lot，i 读字母本音
      waiter|bringing a menu;the bill;carrying food to tables|a waiter brings food to your table; a chef cooks it|waiter 把饭菜端到桌上；chef 做饭|chef=chef cooks in the kitchen, not bringing the menu, the bill or food to the tables=chef 在厨房做饭，不送菜单、账单或饭菜上桌;customer=customer eats and pays in a restaurant, not bringing things to the tables=customer 在餐馆吃饭付钱，不把东西送上桌|ask the waiter · work as a waiter|wait + -er|wait 加 -er
      chef|a special dish;cooking in a hotel kitchen;cooking in a restaurant kitchen|a chef cooks in a restaurant; a waiter brings the food|chef 在餐馆做饭；waiter 上菜|waiter=waiter brings food to the tables, not cooking it in the kitchen=waiter 把饭菜送上桌，不在厨房做饭;customer/customers=customer eats and pays in a restaurant, not cooking in the kitchen=customer 在餐馆吃饭付钱，不在厨房做饭|a hotel chef|ch said like *sh*, from French|ch 读作 *sh*，来自法语
      writer|many stories;a new book at a bookstore;writing stories every day|a writer writes books; an artist paints pictures|writer 写书；artist 画画|artist=artist paints or draws pictures, not writing books or stories=artist 画画，不写书写故事;singer=singer sings songs, not writing books or stories=singer 唱歌，不写书写故事|a famous writer|a silent w: w-r-i-t-e-r|w 不发音：w-r-i-t-e-r
      mechanic|a car fixed in an hour;a broken motorbike;repairing cars, buses and trucks|a mechanic repairs machines; an engineer designs new ones|mechanic 修理机器；engineer 设计新机器|engineer=engineer designs and builds new roads, bridges and machines, not repairing a broken car or motorbike=engineer 设计建造新的道路、桥梁和机器，不修理坏了的汽车或摩托车;pilot=pilot flies a plane, not repairing cars, buses or motorbikes=pilot 驾驶飞机，不修理汽车、公交车或摩托车|take it to a mechanic|ch said like k: me · chan · ic|ch 读作 k：me · chan · ic
      firefighter|putting out a fire;a burning house and a ladder;running into fires|a firefighter stops fires; the police stop crime|firefighter 灭火；police 打击犯罪|police=police stop crime and catch thieves, not putting out fires=police 打击犯罪、抓小偷，不灭火;mechanic=mechanic repairs cars and machines, not fighting fires=mechanic 修理汽车和机器，不救火|put out a fire|fire + fight + -er, one word|fire + fight + -er，合成一个词
      businessman|buying and selling phones;buying and selling goods;selling his own company|a businessman buys and sells things; a manager runs a shop or a hotel for a company|businessman 做买卖；manager 替公司管理商店或酒店|manager/managers=manager runs a shop, a hotel or part of a company for others, not someone who buys, sells or owns a company=manager 替别人管理商店、酒店或公司的一部分，不是做买卖、拥有公司的人;waiter=waiter brings food to tables, not buying and selling things=waiter 把饭菜送上桌，不做买卖|a rich businessman|bus · i · ness · man, plural *businessmen*|bus · i · ness · man，复数是 *businessmen*
    `,
  },
});

const workLife = vocabularyTopic({
  id: "a2-words-work-life",
  title: t("Work Life", "工作生活"),
  summary: t(
    "Companies, bosses, managers, colleagues and staff; earning a salary; careers, interviews, skills and experience; part-time work.",
    "公司、老板、经理、同事和员工；挣工资；职业、面试、技能和经验；兼职工作。",
  ),
  intro: t(
    "My aunt works for a big **company**: her **boss** is kind, her **colleagues** help her, and her **salary** is good. These words help you talk about jobs, the people you work with and the money you earn.",
    "我姑姑在一家大 **company**（公司）工作：她的 **boss**（老板）很和善，**colleagues**（同事）常帮她，**salary**（工资）也不错。这些词帮你谈论工作、一起工作的人和挣到的钱。",
  ),
  prerequisites: ["a2-words-jobs-2"],
  words: [
    word(
      "company companies",
      "a business that sells things or services",
      "公司",
      "My mom works for a big {company} in Shanghai that has two thousand workers. | The {company} makes phones. | Many {companies} are looking for new workers.|salaries careers",
      "salary career",
    ),
    word(
      "boss bosses",
      "the person who tells you what to do at work",
      "老板；上司",
      "My {boss} let me go home early. | I asked my {boss} for a day off. | She's the {boss}: she tells everyone at the small company what to do.",
      "salary staff",
    ),
    word(
      "earn earns earned earning",
      "to get money for work you do",
      "挣（钱）",
      "She {earns} a lot of money from her work as a doctor.|spends wins | Dad paid me, so I {earned} fifty yuan for washing his car.|spent won | How much do waiters {earn} for a day's work?",
      "spend win",
    ),
    word(
      "salary salaries",
      "the money you get every month for your job",
      "工资",
      "His {salary} is 8,000 yuan a month. | Teachers should get higher {salaries}: more money every month.|careers skills | She spends half her {salary} on rent.",
      "career skill",
    ),
    word(
      "career careers",
      "the jobs you do in your life, in one kind of work",
      "职业；事业",
      "She had a long {career} as a teacher. | I want a {career} in medicine. | A football player's {career} is short: most stop playing at thirty-five.",
      "salary staff",
    ),
    word(
      "interview interviews",
      "a meeting where someone asks you questions to see if you are right for a job",
      "面试；采访",
      "I have a job {interview} tomorrow at ten. | Wear nice clothes to the {interview}. | The singer answered questions in a TV {interview}.",
      "career salary",
    ),
    word(
      "skill skills",
      "something you can do well because you learned it",
      "技能",
      "Speaking two languages is a useful {skill}. | What {skills} do you need for this job?|salaries careers | Cooking is a {skill} you can learn.",
      "salary career",
    ),
    word(
      "experience experiences",
      "what you learn from doing something; something that happens to you",
      "经验；经历",
      "Do you have any {experience} of working with children? | Visiting the Great Wall was an amazing {experience}. | She has five years of {experience} as a nurse, so she knows the job well.",
      "career salary",
    ),
    word(
      "colleague colleagues",
      "a person you work with",
      "同事",
      "I had lunch with my {colleagues}, who sit at the desks next to mine.|bosses salaries | My {colleague} at the next desk helped me with the report. | She is friendly with all her {colleagues}, the ten people in her team.|bosses salaries",
      "boss salary",
    ),
    word(
      "manager managers",
      "a person who runs a shop, a hotel or part of a company",
      "经理",
      "I'd like to speak to the {manager}, the person who runs this shop. | The hotel {manager}, who runs the whole hotel, gave us a better room. | She became the {manager} of the shop after five years and now runs it.",
      "staff salary",
    ),
    word(
      "staff",
      "all the people who work for a company or a school",
      "员工；全体职员",
      "All the hotel {staff} were friendly, from the cooks to the cleaners. | Our school has a {staff} of forty teachers. | The shop needs more {staff} at weekends to help all the customers.",
      "boss career",
    ),
    word(
      "part-time",
      "working only some of the day or the week",
      "兼职的",
      "My sister has a {part-time} job at a cafe: she works only on Saturday mornings. | She has a baby, so she wants a {part-time} job of three hours a day. | Many students do {part-time} work for a few hours after classes.",
      "hard-working useful",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Boss*, *manager* and *colleague* are all people at work: your *boss* tells you what to do, a *manager* runs a shop, a hotel or a team, and a *colleague* works beside you. Ask who the person in the sentence is to you.",
        "*boss*、*manager* 和 *colleague* 都是工作中的人：*boss* 安排你做什么，*manager* 管理商店、酒店或一个团队，*colleague* 和你并肩工作。想想句子里的人和你是什么关系。",
      ),
      meaning: t(
        "*Salary* and *career* are both about work: your *salary* is the money you get every month, and your *career* is all the years you work in one kind of job.",
        "*salary* 和 *career* 都和工作有关：*salary* 是每月拿到的钱，*career* 是你在一种工作上做的所有年头。",
      ),
      spell: t(
        "*Colleague* has a double l and ends in -gue: col · league. *Salary* ends in -ary, and its plural is *salaries*.",
        "*colleague* 双写 l，以 -gue 结尾：col · league。*salary* 以 -ary 结尾，复数是 *salaries*。",
      ),
    },
    notes: `
      company|two thousand workers;making phones;looking for new workers|a company is a business; a salary is the money it pays you|company 是公司；salary 是公司付给你的钱|salary=salary is the money you get every month, not a business with workers that makes things=salary 是每月拿的钱，不是有员工、能生产东西的公司;career=career is the jobs you do in your life, not a business with workers=career 是一生中做的工作，不是有员工的公司|work for a company|y becomes ie in *companies*|复数 *companies* 里 y 变 ie
      boss|going home early;a day off;telling everyone what to do|your boss tells you what to do at work; the staff are all the workers|boss 安排你的工作；staff 是全体员工|salary=salary is money, and money cannot let you go, give you a day off or tell people what to do=salary 是钱，钱不会放你走、准你假，也不会给人安排工作;staff=staff is all the workers of a company, not the one person who tells them what to do=staff 是公司的全体员工，不是给他们安排工作的那个人|ask my boss · the boss of a company|the double s, and -es for *bosses*|双写 s，复数是 *bosses*
      earn|work as a doctor;being paid to wash a car;a day's work|you earn money for work; you spend money in shops|earn 是工作挣钱；spend 是花钱|spend/spends/spent=spend means giving money for things you buy, not getting money for your work=spend 是买东西花钱，不是工作挣钱;win/wins/won=win means getting a prize in a game or a race, not money for work you do=win 是在比赛中赢得奖品，不是工作挣的钱|earn money · earn a living|ear said like *er*, as in *learn*|ear 读作 *er*，和 *learn* 一样
      salary|8,000 yuan a month;more money every month;rent|a salary is money you get every month; a career is the work of your life|salary 是每月的工资；career 是一生的事业|career=career is the jobs you do in your life, not an amount of money each month=career 是一生中做的工作，不是每月多少钱;skill=skill is something you can do well, not money you get each month=skill 是你擅长的本领，不是每月拿到的钱|a good salary · half her salary|sal · a · ry, with -ary at the end|sal · a · ry，结尾是 -ary
      career|being a teacher for many years;medicine;stopping at thirty-five|a career is the work of your life; a salary is money you get monthly|career 是一生的事业；salary 是每月的工资|salary=salary is money you get each month, not the years of work in one kind of job=salary 是每月拿的钱，不是在一种工作上做的年头;staff=staff is all the workers of a company, not the years of one person's work=staff 是公司全体员工，不是一个人工作的年头|a career in medicine · a long career|ca · reer, with -eer at the end|ca · reer，结尾是 -eer
      interview|a job tomorrow at ten;nice clothes;questions on TV|an interview is a meeting with questions; a career is your work life|interview 是提问的面谈；career 是职业生涯|career=career is the jobs you do in your life, not one meeting where someone asks you questions=career 是一生中做的工作，不是一次提问的会面;salary=salary is money you get each month, not a meeting with questions=salary 是每月拿的钱，不是提问的会面|a job interview · give an interview|inter + view, one word|inter + view，合成一个词
      skill|two languages;what a job needs;learning to cook|a skill is something you can do well; a salary is money|skill 是本领；salary 是工资|salary=salary is money you get each month, not something you can do well=salary 是每月拿的钱，不是擅长的本领;career=career is the jobs you do in your life, not one thing you can do well=career 是一生中做的工作，不是某一项本领|a useful skill · learn a skill|the double l at the end|结尾双写 l
      experience|working with children;the Great Wall;knowing a job well|experience is what you learn by doing something, or something that happens to you; a career is your work life|experience 是做事得来的经验或经历；career 是职业生涯|career=career is the jobs you do in your life, not something you learned or something that happened to you=career 是一生中做的工作，不是学到的经验或遇到的经历;salary=salary is money you get each month, not something you learned or lived through=salary 是每月拿的钱，不是学到的经验或经历|have experience · an amazing experience|ex · pe · ri · ence, with -ence at the end|ex · pe · ri · ence，结尾是 -ence
      colleague|lunch with people at nearby desks;help at the next desk;being friendly with a whole team|a colleague works with you; a boss tells you what to do|colleague 和你一起工作；boss 安排你的工作|boss=boss is the one person who tells you what to do, not the people who work beside you=boss 是给你安排工作的那个人，不是在你身边一起工作的人;salary=salary is money, not a person you work with=salary 是钱，不是一起工作的人|my colleagues · a colleague at work|col · league, with the double l and -gue at the end|col · league，双写 l，结尾是 -gue
      manager|the person who runs a shop;running a whole hotel;running a shop after five years|a manager runs a shop or a hotel; the staff are the people who work there|manager 管理商店或酒店；staff 是在那里工作的人|staff=staff is all the people who work in a place, not the one person who runs it=staff 是在那里工作的所有人，不是管理它的那个人;salary=salary is money you get each month, not a person who runs a shop or a hotel=salary 是每月拿的钱，不是管理商店或酒店的人|the hotel manager · speak to the manager|man · a · ger, with g said like j|man · a · ger，g 读作 j
      staff|cooks and cleaners;forty teachers;helping customers at weekends|the staff are all the people who work in a place; a boss is one person|staff 是一个地方的全体员工；boss 是一个人|boss=boss is the one person who tells others what to do, not all the people who work in a place=boss 是给别人安排工作的那一个人，不是所有员工;career=career is the jobs one person does in life, not the people who work in a place=career 是一个人一生做的工作，不是在那里工作的人|the hotel staff · more staff|the double f, and no -s for more people|双写 f，指多人时也不加 -s
      part-time|only Saturday mornings;three hours a day;a few hours after classes|part-time means working only some of the day or week; hard-working means working a lot|part-time 是只工作一部分时间；hard-working 是勤奋|hard-working=hard-working describes a person who works a lot with care, not a job of only a few hours=hard-working 形容勤奋认真的人，不形容只做几个小时的工作;useful=useful means helpful, and it says nothing about working only a few hours=useful 是有用，和只工作几个小时无关|a part-time job · work part-time|part + time with a hyphen|part 和 time 之间有连字符
    `,
  },
});

const ambitions = vocabularyTopic({
  id: "a2-words-ambitions",
  title: t("Ambitions", "抱负"),
  summary: t(
    "Becoming something; success and failure; improving and studying; universities, colleges, courses and graduating; ambitions; working hard.",
    "成为什么；成功和失败；进步和学习；大学、学院、课程和毕业；抱负；勤奋。",
  ),
  intro: t(
    "My cousin's **ambition** was to **become** a doctor, so she worked hard, went to **university** and **graduated** last summer. These words help you talk about studying, your plans and what you want to do in life.",
    "我表姐的 **ambition**（抱负）是 **become**（成为）一名医生，所以她努力学习，上了 **university**（大学），去年夏天 **graduated**（毕业）了。这些词帮你谈论学习、计划和人生中想做的事。",
  ),
  prerequisites: ["a2-words-work-life"],
  words: [
    word(
      "become becomes became becoming",
      "to start to be",
      "成为；变得",
      "She wants to {become} a doctor. | He {became} a famous singer at nineteen. | It's {becoming} cold. Winter is coming.|improving succeeding",
      "succeed improve",
    ),
    word(
      "succeed succeeds succeeded succeeding",
      "to do what you tried to do",
      "成功",
      "If you work hard, you will {succeed}. | She {succeeded} in passing the exam.|failed became | He tried three times, and the third time he finally {succeeded} and won.|failed became",
      "fail become",
    ),
    word(
      "success successes",
      "getting what you tried to get",
      "成功",
      "The party was a big {success}. Everybody had fun. | Hard work is the key to {success}. | Her new book is a great {success}: millions of people have bought it.",
      "ambition course",
    ),
    word(
      "fail fails failed failing",
      "to not pass a test; to not do what you tried to do",
      "失败；不及格",
      "I {failed} my driving test, so I have to take it again.|succeeded improved | Don't be afraid to {fail}: everyone gets things wrong sometimes. | He {failed} to finish the race because he hurt his leg.|succeeded improved",
      "succeed improve",
    ),
    word(
      "improve improves improved improving",
      "to make or become better",
      "提高；改善",
      "Read more to {improve} your English. | Her English has {improved} a lot this year.|succeeded graduated | The weather is {improving}. The sun is out.|succeeding graduating",
      "succeed graduate",
    ),
    word(
      "study studies studied studying",
      "to learn about a subject; to read and learn for a test",
      "学习；研究",
      "She is a student who {studies} biology at university.|graduates teaches | I {studied} for three hours for the test.|graduated taught | Where did you {study} English before you could speak it so well?",
      "graduate teach",
    ),
    word(
      "university universities",
      "a place where people study after high school for a degree",
      "大学",
      "My sister goes to {university} in Beijing. | He studied law at {university}. | There are three {universities} in our city, with thousands of students.|courses ambitions",
      "course ambition",
    ),
    word(
      "college colleges",
      "a school for study after high school, often for a job",
      "学院；大学",
      "After high school, she went to {college} to study art. | My brother is in his first year at {college}. | This {college} has big buildings where it trains nurses.",
      "course ambition",
    ),
    word(
      "graduate graduates graduated graduating",
      "to finish your studies at a school or a university; a person who has done this",
      "毕业；毕业生",
      "She {graduated} from university last year.|succeeded improved | When I {graduate} from high school, I want to travel. | The {graduates} threw their hats in the air.|ambitions successes",
      "succeed improve",
    ),
    word(
      "course courses",
      "a set of lessons about one subject",
      "课程",
      "I'm taking a cooking {course} on Saturdays. | The English {course} lasts ten weeks. | She did an online {course} in photography.",
      "ambition success",
    ),
    word(
      "ambition ambitions",
      "something you really want to do in your life",
      "抱负；雄心",
      "My {ambition} is to become a pilot. | He has big {ambitions} for his company: he wants it to be the best in China.|courses successes | She worked hard to reach her {ambition}.",
      "course success",
    ),
    word(
      "hard-working",
      "working a lot and with care",
      "勤奋的",
      "She's very {hard-working}. She's always the last to leave. | {Hard-working} students usually do well.|Part-time Lazy | My grandparents were {hard-working} farmers who worked in the fields from morning to night.",
      "part-time lazy",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Succeed* is a verb and *success* is a noun: you *succeed* when you do what you tried to do, but a party or a book is *a success*. Check whether the gap needs an action or a thing.",
        "*succeed* 是动词，*success* 是名词：做成了想做的事叫 *succeed*，而一场派对或一本书是 *a success*。看空格需要的是动作还是事物。",
      ),
      meaning: t(
        "*University* and *college* are places where you study after high school, but a *course* is one set of lessons about one subject, and you can take a *course* anywhere, even online.",
        "*university* 和 *college* 是高中毕业后学习的地方，而 *course* 是关于一门学科的一套课，在哪儿都能上，网上也行。",
      ),
      spell: t(
        "*Succeed* and *success* both start with a double c said like *ks*: suc · ceed, suc · cess; *succeed* ends in -eed.",
        "*succeed* 和 *success* 开头都双写 c，读作 *ks*：suc · ceed、suc · cess；*succeed* 以 -eed 结尾。",
      ),
    },
    notes: `
      become|a doctor;a famous singer at nineteen;winter coming|become means to start to be; succeed means to do what you tried to do|become 是变成、成为；succeed 是成功|succeed=succeed means doing what you tried to do, and it is never followed by *a doctor* or *cold*=succeed 是做成想做的事，后面不接 *a doctor* 或 *cold*;improve=improve means making or getting better, not starting to be a doctor, a singer or cold=improve 是变好，不是成为医生、歌手或变冷|become a doctor · become cold|the past is *became*, not *becomed*|过去式是 *became*，不是 *becomed*
      succeed|working hard;passing an exam;a third try that won|succeed means doing what you tried; fail means not doing it|succeed 是成功；fail 是失败|fail=fail means not doing what you tried to do, the opposite of succeed=fail 是没做成，和 succeed 意思相反;become=become means to start to be something, and it needs a word after it like *a doctor*=become 是变成什么，后面要接 *a doctor* 这类词|succeed in doing something|the double c and the double e: suc · ceed|双写 c，也双写 e：suc · ceed
      success|a party where everybody had fun;hard work;millions buying a book|success is getting what you tried to get; an ambition is what you want to get|success 是得到想要的结果；ambition 是想实现的目标|ambition=ambition is something you want to do in the future, not something that already went well=ambition 是将来想做的事，不是已经办成的事;course=course is a set of lessons, not something that went well=course 是一套课程，不是办成功的事|a big success · the key to success|the double c and the double s: suc · cess|双写 c，也双写 s：suc · cess
      fail|taking a test again;getting things wrong;a hurt leg in a race|fail means not passing or not doing what you tried; succeed is the opposite|fail 是失败或不及格；succeed 意思相反|succeed/succeeded=succeed means doing what you tried to do, the opposite of not passing or not finishing=succeed 是做成想做的事，和没通过、没完成正相反;improve/improved=improve means getting better, not failing a test or a race=improve 是变好，不是考试或比赛失败|fail a test · fail to finish|ai for the long a sound|ai 发长 a 音
      improve|reading more;a lot of progress this year;the sun coming out|improve means to get better; succeed means to do what you tried|improve 是变好；succeed 是成功|succeed/succeeded/succeeding=succeed means doing what you tried to do once, not getting better little by little=succeed 是做成一件事，不是一点点变好;graduate/graduated/graduating=graduate means finishing your studies at a school, not getting better=graduate 是完成学业毕业，不是变好|improve your English|drop the e before -ing: improving|加 -ing 前去掉 e：improving
      study|a biology student;three hours before a test;learning to speak English well|you study to learn; a teacher teaches|study 是学习；teach 是教|graduate/graduates/graduated=graduate means finishing your studies, not reading and learning about a subject=graduate 是完成学业，不是学习某门学科;teach/teaches/taught=teach means helping others learn, not learning something yourself=teach 是教别人，不是自己学|study for a test · study English|y becomes ie: studies, studied|y 变 ie：studies、studied
      university|going to Beijing;law;thousands of students in a city|a university is a place to study after high school; a course is one set of lessons|university 是高中后学习的地方；course 是一套课程|course=course is one set of lessons about one subject, not a big place you go to after high school=course 是关于一门学科的一套课，不是高中后去的大学;ambition=ambition is something you want to do in life, not a place where you study=ambition 是人生想做的事，不是学习的地方|go to university · at university|u that says its name: u · ni · ver · si · ty|u 读字母本音：u · ni · ver · si · ty
      college|studying art after high school;a first year;buildings for training nurses|a college is a school after high school; a course is a set of lessons|college 是高中后的学院；course 是一套课程|course=course is one set of lessons, not a school with buildings that you go to after high school=course 是一套课，不是高中后去的、有楼房的学校;ambition=ambition is something you want to do in life, not a school=ambition 是人生想做的事，不是学校|go to college · at college|the double l, and -ege at the end|双写 l，结尾是 -ege
      graduate|finishing university last year;finishing high school;hats in the air|you graduate when you finish your studies; you succeed when you do what you tried|graduate 是毕业；succeed 是成功|succeed/succeeded=succeed means doing what you tried to do, not finishing your studies at a school=succeed 是做成想做的事，不是从学校毕业;improve/improved=improve means getting better, not finishing your studies=improve 是变好，不是完成学业;ambition/ambitions=ambition is something you want to do, not people who finished their studies=ambition 是想做的事，不是完成学业的人;success/successes=success is something that went well, not people who finished their studies=success 是办成的事，不是完成学业的人|graduate from university|-ate at the end, and d before u|结尾是 -ate，u 前面是 d
      course|cooking on Saturdays;ten weeks;photography online|a course is a set of lessons; an ambition is what you want in life|course 是一套课程；ambition 是人生目标|ambition=ambition is something you want to do in life, not lessons you take=ambition 是人生想做的事，不是要上的课;success=success is something that went well, not lessons you take=success 是办成的事，不是要上的课|take a course · an online course|our said like *or*: course|our 读作 *or*：course
      ambition|becoming a pilot;wanting a company to be the best;working hard to reach it|an ambition is what you really want to do; a success is what went well|ambition 是很想做成的事；success 是已经办成的事|course=course is a set of lessons, not something you really want to do in life=course 是一套课，不是人生很想做的事;success=success is something that already went well, not what you want to do in the future=success 是已经办成的事，不是将来想做的事|my ambition is to · big ambitions|-tion at the end, said like *shun*|结尾 -tion 读作 *shun*
      hard-working|the last to leave;doing well;farming from morning to night|hard-working means working a lot and with care; lazy means not wanting to work|hard-working 是勤奋；lazy 是懒|part-time=part-time means working only some of the day or week, not working a lot with care=part-time 是只工作一部分时间，不是勤奋认真;lazy=lazy means not wanting to work, the opposite of hard-working=lazy 是不想干活，和 hard-working 意思相反|a hard-working student|hard + working with a hyphen|hard 和 working 之间有连字符
    `,
  },
});

// Questions about the subject and about the object.

/**
 * deeds are a subject, its question word, whether it keeps its capital inside a sentence, the past of the verb, its
 * first form, the object and the object's question word.
 */
const handDeeds: readonly (readonly [string, string, boolean, string, string, string, string])[] = [
  ["Lily", "Who", true, "called", "call", "Sam", "Who"],
  ["My uncle", "Who", false, "met", "meet", "the manager", "Who"],
  ["The waiter", "Who", false, "helped", "help", "the old man", "Who"],
  ["Tom", "Who", true, "invited", "invite", "Anna", "Who"],
  ["The boss", "Who", false, "chose", "choose", "Mr. Lee", "Who"],
  ["My sister", "Who", false, "saw", "see", "a famous actor", "Who"],
  ["The firefighters", "Who", false, "saved", "save", "the children", "Who"],
  ["Jack", "Who", true, "kicked", "kick", "the ball", "What"],
  ["The dog", "What", false, "ate", "eat", "my sandwich", "What"],
  ["The storm", "What", false, "broke", "break", "the window", "What"],
  ["Dad", "Who", true, "cooked", "cook", "dinner", "What"],
  ["Mia", "Who", true, "wrote", "write", "the email", "What"],
  ["Grandma", "Who", true, "sent", "send", "a card", "What"],
  ["The chef", "Who", false, "made", "make", "the cake", "What"],
  ["The cat", "What", false, "woke", "wake", "the baby", "Who"],
  ["Ben", "Who", true, "found", "find", "the keys", "What"],
  ["The mechanic", "Who", false, "fixed", "fix", "my car", "What"],
  ["Our class", "Who", false, "won", "win", "the prize", "What"],
  ["The noise", "What", false, "scared", "scare", "the children", "Who"],
  ["My colleague", "Who", false, "interviewed", "interview", "the singer", "Who"],
  ["The teacher", "Who", false, "praised", "praise", "my essay", "What"],
];

/** doers are people who do the deeds, and whether each keeps its capital inside a sentence. */
const doers: readonly (readonly [string, boolean])[] = [
  ["Lily", true],
  ["My uncle", false],
  ["The waiter", false],
  ["Tom", true],
  ["The boss", false],
  ["My sister", false],
  ["Dad", true],
  ["Mia", true],
  ["Grandma", true],
  ["The chef", false],
  ["Ben", true],
  ["Our teacher", false],
];

/** acts are the past of a verb, its first form, its object and the object's question word, for any person to do. */
const acts: readonly (readonly [string, string, string, string])[] = [
  ["called", "call", "Sam", "Who"],
  ["met", "meet", "the manager", "Who"],
  ["helped", "help", "the old man", "Who"],
  ["invited", "invite", "Anna", "Who"],
  ["saw", "see", "a famous actor", "Who"],
  ["cooked", "cook", "dinner", "What"],
  ["wrote", "write", "the email", "What"],
  ["sent", "send", "a card", "What"],
  ["found", "find", "the keys", "What"],
  ["fixed", "fix", "the printer", "What"],
  ["visited", "visit", "the new office", "What"],
];

const deeds: readonly (readonly [string, string, boolean, string, string, string, string])[] = [
  ...handDeeds,
  ...everyPair(doers, acts).map(
    ([[subject, keep], [past, base, object, what]]) => [subject, "Who", keep, past, base, object, what] as const,
  ),
];

type Deed = (typeof deeds)[number];

const inside = ([subject, , keep]: Deed) => (keep ? subject : subject.charAt(0).toLowerCase() + subject.slice(1));

/** aboutSubject is the question about the doer, its sentence with the doer in bold, and two wrong questions. */
const aboutSubject = (d: Deed) => {
  const [subject, who, , past, base, object] = d;
  return {
    shown: `**${subject}** ${past} ${object}.`,
    right: `${who} ${past} ${object}?`,
    other: `${d[6]} did ${inside(d)} ${base}?`,
    bad: [`${who} did ${past} ${object}?`, `${who} ${base} ${object}?`],
  };
};

/** aboutObject is the question about the one the action is done to. */
const aboutObject = (d: Deed) => {
  const [subject, who, , past, base, object, what] = d;
  return {
    shown: `${subject} ${past} **${object}**.`,
    right: `${what} did ${inside(d)} ${base}?`,
    other: `${who} ${past} ${object}?`,
    bad: [`${what} did ${inside(d)} ${past}?`, `${what} ${inside(d)} ${past}?`],
  };
};

const askChoiceBank: readonly ChoiceItem[] = interleave([
  deeds.map((d): ChoiceItem => {
    const q = aboutSubject(d);
    return [q.shown, q.right, [q.other, q.bad[0] ?? ""]];
  }),
  deeds.map((d): ChoiceItem => {
    const q = aboutObject(d);
    return [q.shown, q.right, [q.other, q.bad[0] ?? ""]];
  }),
]);

const askTypedBank: readonly TypedItem[] = interleave([
  deeds.map((d): TypedItem => {
    const q = aboutObject(d);
    return { shown: q.shown, accepted: [q.right], wrong: [...q.bad, q.other] };
  }),
  deeds.map((d): TypedItem => {
    const q = aboutSubject(d);
    return { shown: q.shown, accepted: [q.right], wrong: [...q.bad, q.other] };
  }),
]);

/** askWhy explains a question about the words in bold of shown. */
const askWhy = (right: string, shown: string): Text => {
  const bold = /\*\*(.+?)\*\*/u.exec(shown)?.[1] ?? "";
  const word = right.split(" ")[0] ?? "Who";
  const kind = word === "Who" ? t("a person", "人") : t("a thing", "物");
  return shown.startsWith("**")
    ? t(
        `*${bold}* did the action, so *${word}* (for ${kind.en}) takes its place and the verb stays in the past, with no *did*: ${right}\n\n**Check.** Replace *${word}* with *${bold}*—the original statement reappears word for word, confirming no *did* is needed.`,
        `*${bold}* 是动作的发出者，所以用 *${word}*（问${kind["zh-CN"]}）直接代替它，动词保持过去式，不用 *did*：${right}\n\n**检验。** 把 *${bold}* 代回 *${word}* 的位置——原句原样出现，说明这是主语问句，不需要 *did*。`,
      )
    : t(
        `The action was done to *${bold}*, so ask with *${word}* (for ${kind.en}), then *did*, the subject and the first form of the verb: ${right}\n\n**Check.** Verify the object-question pattern: *${word}* + *did* + subject + plain verb, with *${bold}* removed.`,
        `*${bold}* 是动作的对象，所以用 *${word}*（问${kind["zh-CN"]}）提问，再接 *did*、主语和动词原形：${right}\n\n**检验。** 核对宾语问句结构：*${word}* + *did* + 主语 + 动词原形，且问句里不再出现 *${bold}*。`,
      );
};

/** whyNotAsk explains a question that asks about the other one or builds the question wrong. */
const whyNotAsk = (wrong: string, _right: string, shown: string, position: number): Text => {
  const bold = /\*\*(.+?)\*\*/u.exec(shown)?.[1] ?? "";
  if (position === 0)
    return t(
      `*${wrong}* asks about the other one in the sentence, not about *${bold}*.`,
      `*${wrong}* 问的是句子里的另一方，不是 *${bold}*。`,
    );
  return shown.startsWith("**")
    ? t(
        `*${wrong}* adds *did* and keeps the past form. A question about the one who did it has no *did*.`,
        `*${wrong}* 加了 *did* 又保留了过去式。问动作发出者的问句不用 *did*。`,
      )
    : t(
        `*${wrong}* keeps the past form after *did*. After *did* the verb goes back to its first form.`,
        `*${wrong}* 在 *did* 后面还用过去式。*did* 后面的动词要用原形。`,
      );
};

const subjectAndObjectQuestions: TopicDef = {
  id: "subject-and-object-questions",
  title: t("Who Called You? Who Did You Call?", "Who called you? 和 Who did you call?"),
  summary: t(
    "Who called you? asks about the one who did it and has no did. Who did you call? asks about the other one.",
    "Who called you? 问的是动作的发出者，不用 did；Who did you call? 问的是动作的对象。",
  ),
  intro: t(
    "Compare *Who fixed the bike?* (asking who did the fixing—no *did*) with *What did the mechanic fix?* (asking what received the action—uses *did* + base verb). One extra word completely changes who you are asking about.",
    "比较 *Who fixed the bike?*（问谁修的——不用 *did*）和 *What did the mechanic fix?*（问修了什么——用 *did* + 动词原形）。多一个 *did*，问的对象就完全不同。",
  ),
  prerequisites: ["wh-questions", "past-simple-questions-and-negatives"],
  encompasses: [
    { topic: "past-simple-questions-and-negatives", weight: 0.3 },
    { topic: "wh-questions", weight: 0.2 },
  ],
  xp: 20,
  strand: "grammar",
  knowledgePoints: [
    point(
      "which-question",
      t("Asking about the doer or the other one", "问发出者还是问对象"),
      t(
        "*Lily called Sam.* You can ask about either person.\n\n- About the one who did it (**Lily**): *who* or *what* takes the place of the subject, and the verb stays as it is, with no *did*: *Who called Sam?*\n- About the other one (**Sam**): use *did* and the first form of the verb, as in other questions: *Who did Lily call?*\n\n> **Watch out.** Never write *Who did called Sam?* (no *did* in a subject question) and never write *Who did Lily called?* (the verb after *did* must return to its plain form).",
        "*Lily called Sam.* 两个人都可以问。\n\n- 问动作的发出者（**Lily**）：*who* 或 *what* 直接代替主语，动词不变，不用 *did*：*Who called Sam?*\n- 问动作的对象（**Sam**）：和别的问句一样，用 *did* 加动词原形：*Who did Lily call?*\n\n> **注意。** 问发出者不要加 *did*（不说 *Who did called Sam?*），问对象时 *did* 后面的动词要还原（不说 *Who did Lily called?*）。",
      ),
      choiceGenerator(
        t("Choose the question that asks about the words in bold.", "选出就加粗部分提问的问句。"),
        askChoiceBank,
        askWhy,
        whyNotAsk,
      ),
    ),
    point(
      "write",
      t("Writing the question", "写出问句"),
      t(
        "Write a question about the words in bold. If they did the action, put *who* or *what* in their place: *Who called Sam?* If the action was done to them, use *did* + subject + plain verb: *Who did Lily call?*\n\n> **Watch out.** Check whether the bold words are a person (*Who*) or a thing (*What*), and drop the bold words from the question itself.",
        "就加粗部分写一个问句。如果加粗部分是动作的发出者，用 *who* 或 *what* 代替它：*Who called Sam?* 如果加粗部分是动作的对象，用 *did* + 主语 + 动词原形：*Who did Lily call?*\n\n> **注意。** 先分清加粗部分是人（*Who*）还是物（*What*），并确保加粗部分不再出现在问句里。",
      ),
      typedGenerator(
        "sentence",
        t("Write a question about the words in bold.", "就加粗部分写一个问句。"),
        askTypedBank,
        askWhy,
        subjectAndObjectQuestionsWriteNot,
      ),
    ),
  ],
};

// A dream job.

const dreamJobBank: readonly WritingItem[] = [
  {
    task: "Write about your dream job: a pilot.",
    model:
      "When I grow up, I would like to be a pilot. I love planes, and I want to see the world. Pilots fly to many different countries, so they meet interesting people. It's also a well-paid job. But it isn't easy. I'm going to study hard at math and physics, because pilots need them. I will also go to flight school after high school.",
  },
  {
    task: "Write about your dream job: a doctor.",
    model:
      "My dream job is to be a doctor. I want to help sick people get better. My grandmother was very ill last year, and the doctors saved her life. Since then, I have wanted to do the same. Doctors need to study for many years, so I'm going to work hard at biology and chemistry. I will also volunteer at a hospital in the summer.",
  },
  {
    task: "Write about your dream job: a chef.",
    model:
      "I would like to become a chef in a big restaurant. I love cooking, and I often make dinner for my family. I enjoy trying new recipes from different countries. People are happy when they eat good food, and I want to make them happy. After school I'm going to go to a cooking college. I will also work part-time in a restaurant to get experience.",
  },
  {
    task: "Write about your dream job: a vet.",
    model:
      "My dream is to be a vet. I have loved animals since I was very small, and I have two cats and a rabbit. Vets help animals that are sick or hurt, and I think that is very important. I also like science. To become a vet, I'm going to study biology at university. Now I help at an animal center every Saturday.",
  },
  {
    task: "Write about your dream job: an engineer.",
    model:
      "I would like to be an engineer and build bridges. I love math, and I'm good at solving problems. Bridges connect towns and help people, so the work is useful. Engineers also earn a good salary. I'm going to study engineering at university. At the moment I'm in the robot club at school, and I'm learning to design machines.",
  },
  {
    task: "Write about your dream job: a teacher.",
    model:
      "My dream job is to be an English teacher. I like children, and I enjoy explaining things to people. My own English teacher is very kind, and she made me love the language. I also want to work in different countries. I'm going to study English at university, and I will practice by helping my little cousins with their homework.",
  },
  {
    task: "Write about your dream job: an artist.",
    model:
      "I would like to be an artist. I have painted pictures since I was five, and I draw every day. When I paint, I feel calm and happy. I want to show people beautiful things in my pictures. It is hard to earn money as an artist, but I don't mind. I'm going to go to art college, and I will try to sell my paintings online.",
  },
  {
    task: "Write about your dream job: a firefighter.",
    model:
      "When I'm older, I want to be a firefighter. Firefighters are brave, and they save people's lives. I also like doing sports, and this job needs a strong body. My uncle is a firefighter, and he told me many stories about his work. I'm going to keep fit by running every morning, and I will learn first aid next year.",
  },
  {
    task: "Write about your dream job: a scientist.",
    model:
      "My ambition is to become a scientist. I am very curious, and I always ask why things happen. I would like to find new ways to make clean energy, because the earth needs it. Scientists do experiments every day, and I love experiments. I'm going to study chemistry at university, and now I read science magazines every week.",
  },
  {
    task: "Write about your dream job: a writer.",
    model:
      "I would like to be a writer of children's books. I love reading, and I have written lots of short stories. Books can take children to other worlds, and I want to give them that. Writers can also work from home, which I like. I'm going to read as many books as I can. I will also enter a story competition this year.",
  },
  {
    task: "Write about your dream job: a football player.",
    model:
      "My dream job is to be a football player. I have played football since I was six, and I'm in my school team. I love the feeling when I score a goal, and the crowds make me excited. Football players are also famous. But only a few people succeed, so I'm going to practice every day. I will also try to join a club next year.",
  },
  {
    task: "Write about your dream job: a game designer.",
    model:
      "I would like to become a game designer. I love playing computer games, and I always have ideas for new ones. Game designers are creative, and they work with artists and programmers. It's also a job with a good salary. I'm going to learn to write computer programs, and I will take an online course in game design this summer.",
  },
];

const writingAboutYourDreamJob = judgedTopic({
  id: "writing-about-your-dream-job",
  title: t("Writing About a Dream Job", "写理想的工作"),
  summary: t(
    "Write six to eight sentences about a job you would like: what it is, why you want it, and what you will do to get it.",
    "写六到八句话，讲一份你想做的工作：是什么、为什么想做、你将怎样得到它。",
  ),
  intro: t(
    "A strong paragraph about a dream job connects your goal, your reasons, and your next steps: *I would like to be an architect because I love drawing buildings. I'm going to study math and art, and I will visit famous buildings to learn from them.*",
    "写理想工作的段落会把目标、理由和行动连成一线：*I would like to be an architect because I love drawing buildings. I'm going to study math and art, and I will visit famous buildings to learn from them.*",
  ),
  prerequisites: ["writing-about-future-plans", "expanding-with-because-but-so"],
  encompasses: [
    { topic: "writing-about-future-plans", weight: 0.3 },
    { topic: "expanding-with-because-but-so", weight: 0.3 },
  ],
  criteria: ["a2-job-and-reasons", "a2-job-steps", "a2-future-forms", "a1-sentences"],
  point: {
    id: "dream-job",
    title: t("The job, why and how", "工作、原因和做法"),
    explanation: t(
      "Say what job you would like: *I would like to be a pilot. My dream job is to be a doctor.*\n\nGive reasons with *because* and *so*: *I love planes, so I want to fly.*\n\nSay what you will do to get it with *going to* or *will*: *I'm going to study math. I will go to flight school.*\n\n> **Watch out.** Always put *a* or *an* before a singular job name (*a doctor*, *an engineer*—never *I want to be doctor*), and use *going to* or *will* for your future steps.",
      "说出你想做的工作：*I would like to be a pilot. My dream job is to be a doctor.*\n\n用 *because* 和 *so* 说明理由：*I love planes, so I want to fly.*\n\n用 *going to* 或 *will* 说你将怎样做：*I'm going to study math. I will go to flight school.*\n\n> **注意。** 单数职业名词前不能漏掉 *a* 或 *an*（要说 *a doctor*、*an engineer*，不说 *I want to be doctor*），写未来打算时用 *going to* 或 *will*。",
    ),
  },
  question: t(
    "Write six to eight sentences in English about the job the task names: what it is, why you want it, and what you will do to get it.",
    "根据题目用英语写六到八句话：这是什么工作、你为什么想做、你将怎样得到它。",
  ),
  bank: dreamJobBank,
  limits: { minWords: 45, maxChars: 900 },
  what: t("text", "文字"),
});

/** topics are the topics of the unit Jobs and Dreams. */
export const topics: readonly TopicDef[] = [
  jobs2.topic,
  workLife.topic,
  ambitions.topic,
  subjectAndObjectQuestions,
  writingAboutYourDreamJob,
];

/** vocabulary are the words the unit Jobs and Dreams teaches. */
export const vocabulary: readonly WordBatch[] = [jobs2.batch, workLife.batch, ambitions.batch];
