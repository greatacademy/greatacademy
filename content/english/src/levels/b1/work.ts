// B1, unit 2: Work and Careers. Applying for a job, the workplace, business, getting things done, professions, qualities
// at work, the office and linking words; used to and the present perfect continuous; a formal email judged by a model.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator, type WritingItem } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { fill, judgedTopic } from "../a2/kit.ts";
import { interleave, vocabularyTopic, word } from "../words.ts";

const applying = vocabularyTopic({
  id: "b1-words-applying",
  title: t("Applying for a Job", "求职"),
  summary: t(
    "Applying and applications; candidates, employers and employees; qualifications and references; positions, vacancies and advertisements; contracts and what a job requires.",
    "申请和申请书；候选人、雇主和雇员；资格和推荐信；职位、空缺和广告；合同和工作要求。",
  ),
  prerequisites: ["a2-words-work-life"],
  words: [
    word(
      "apply applies applied applying",
      "to ask in writing for a job, a place at a school or something similar",
      "申请",
      "I'm going to {apply} for a job at the new hotel.|require employ | She {applied} to three universities.|required employed | How many people are {applying} for the position?|requiring contracting",
      "require employ",
    ),
    word(
      "application applications",
      "a written request for a job or a place at a school",
      "申请；申请书",
      "Please send your {application} before the first of May.|candidate employer | I filled in an {application} form online.|employer employee | We received over two hundred {applications} for the job.|vacancies employers",
      "candidate qualification",
    ),
    word(
      "candidate candidates",
      "a person who wants to get a job or to win an election",
      "候选人；应聘者",
      "There are five {candidates} for the manager's job.|vacancies references | She was the best {candidate}, so we gave her the job.|vacancy contract | Each {candidate} will have an interview on Monday.|vacancy advertisement",
      "employer vacancy",
    ),
    word(
      "employer employers",
      "a person or company that pays people to work for them",
      "雇主",
      "The hospital is the biggest {employer} in the town: 3,000 people work there.|employee candidate | Ask your last {employer} for a reference.|vacancy position | {Employers} want workers who can work in a team.|Vacancies Contracts",
      "employee candidate",
    ),
    word(
      "employee employees",
      "a person who is paid to work for a person or a company",
      "雇员；员工",
      "The company has 500 {employees}.|employers vacancies | Every new {employee} gets a day of training.|employer vacancy | She has been an {employee} of the bank for ten years.|employer advertisement",
      "employer candidate",
    ),
    word(
      "qualification qualifications",
      "an exam you have passed or a course you have finished, which shows that you can do a job",
      "资格；学历",
      "What {qualifications} do you need to be a nurse?|vacancies contracts | She has a {qualification} in accounting.|vacancy contract | Without any {qualifications}, it's hard to find a good job.|advertisements vacancies",
      "reference application",
    ),
    word(
      "reference references",
      "a letter from someone who knows you, saying what you are like as a worker or a student",
      "推荐信；证明人",
      "My old teacher wrote me a {reference}.|position vacancy | The company asked for two {references}.|vacancies positions | Can I give your name as a {reference}?|vacancy qualification",
      "qualification position",
    ),
    word(
      "position positions",
      "a job in a company",
      "职位",
      "I'm writing to apply for the {position} of shop assistant.|candidate reference | She has a senior {position} in a bank.|vacancy reference | We have two {positions} open in our sales team.|references qualifications",
      "candidate contract",
      "vacancy",
    ),
    word(
      "vacancy vacancies",
      "a job that nobody is doing and that a company wants to fill; a free room in a hotel",
      "空缺；空房",
      "There is a {vacancy} for a cook at the restaurant.|reference candidate | The hotel has no {vacancies}: every room is full.|references contracts | We put an advertisement for the {vacancy} online.|reference employee",
      "candidate reference",
      "position",
    ),
    word(
      "advertisement advertisements",
      "a notice in a newspaper, online or on TV that tells people about a job or a product",
      "广告",
      "I saw an {advertisement} for the job in the newspaper.|employee candidate | There are too many {advertisements} on TV.|applications contracts | The {advertisement} for the new phone was on every bus.|candidate reference",
      "application contract",
    ),
    word(
      "contract contracts",
      "a written agreement, for example about a job, that people sign",
      "合同",
      "Read the {contract} carefully before you sign it.|candidate vacancy | She has a one-year {contract} with the company.|candidate reference | Both players signed new {contracts}.|candidates vacancies",
      "reference application",
    ),
    word(
      "require requires required requiring",
      "to need; to say that something must be done",
      "需要；要求",
      "The job {requires} good English.|applies employs | All visitors are {required} to wear a helmet.|applied employed | This plant {requires} a lot of water.|applies employs",
      "apply employ",
    ),
  ],
});

const workplace = vocabularyTopic({
  id: "b1-words-workplace",
  title: t("The Workplace", "工作场所"),
  summary: t(
    "Departments, clients and tasks; schedules, reports and shifts; overtime, the workplace and its equipment; headquarters, agendas and conferences.",
    "部门、客户和任务；日程、报告和轮班；加班、工作场所和设备；总部、议程和会议。",
  ),
  prerequisites: ["b1-words-applying"],
  words: [
    word(
      "department departments",
      "one part of a large company, a shop or a school",
      "部门",
      "She works in the sales {department}.|agenda overtime | The children's clothes are in the next {department}.|agenda conference | The marketing {department} is on the third floor.|agenda overtime",
      "agenda schedule",
    ),
    word(
      "client clients",
      "a person who pays a company or a professional for a service",
      "客户",
      "The lawyer is meeting a {client} at ten.|equipment agenda | We have {clients} all over the world.|overtime agendas | Always be polite to {clients}.|equipment overtime",
      "task equipment",
    ),
    word(
      "task tasks",
      "a piece of work that you must do",
      "任务",
      "My first {task} every morning is to check my email.|equipment overtime | Cleaning the kitchen is not an easy {task}.|equipment agenda | She gave each of us three {tasks}.|agendas headquarters",
      "client shift",
    ),
    word(
      "schedule schedules",
      "a plan that lists when things will happen",
      "日程；时间表",
      "I have a very busy {schedule} this week.|equipment department | The train is running on {schedule}.|equipment overtime | Let's check our {schedules} and find a day to meet.|departments headquarters",
      "department report",
      "agenda",
    ),
    word(
      "report reports reported reporting",
      "a piece of writing about a subject; to tell someone about something that has happened",
      "报告；汇报",
      "I have to write a {report} on the meeting.|shift client | Please {report} any problems to your manager.|shift task | She {reported} the accident to the police.|shifted scheduled",
      "shift task",
    ),
    word(
      "shift shifts",
      "a period of time in which a group of people work, such as at night",
      "轮班；班次",
      "My dad works the night {shift} at the hospital.|agenda client | Nurses often work twelve-hour {shifts}.|agendas clients | My {shift} starts at six in the morning.|equipment client",
      "task overtime",
    ),
    word(
      "overtime",
      "extra hours that you work after your usual time",
      "加班",
      "I worked {overtime} every day this week to finish the project.|equipment headquarters | Do you get paid for {overtime}?|equipment agenda | No more {overtime}! I want to see my family.|equipment headquarters",
      "shift equipment",
    ),
    word(
      "workplace workplaces",
      "the place where you work",
      "工作场所",
      "Smoking is not allowed in the {workplace}.|agenda overtime | A friendly {workplace} makes people happy.|agenda overtime | Many {workplaces} now have a quiet room.|agendas tasks",
      "department equipment",
    ),
    word(
      "equipment",
      "the machines and tools you need for a job or an activity",
      "设备；器材",
      "The hospital needs new {equipment}.|overtime agenda | Bring your own sports {equipment}.|agenda overtime | All the office {equipment} is new: computers, printers and phones.|agenda overtime",
      "overtime headquarters",
    ),
    word(
      "headquarters",
      "the main office of a company or an organization",
      "总部",
      "The company's {headquarters} is in Shanghai.|overtime equipment | She works at the bank's {headquarters} in London.|overtime agenda | They're moving their {headquarters} to a bigger building.|overtime agenda",
      "department workplace",
    ),
    word(
      "agenda agendas",
      "a list of things to talk about at a meeting",
      "议程",
      "What's on the {agenda} for today's meeting?|equipment overtime | The first point on the {agenda} is the new budget.|equipment headquarters | Please send the {agenda} before the meeting.|equipment overtime",
      "conference report",
      "schedule",
    ),
    word(
      "conference conferences",
      "a large meeting where people talk about a subject, often for several days",
      "会议；大会",
      "She's speaking at a science {conference} in Tokyo.|overtime equipment | The {conference} brings together 2,000 doctors.|overtime equipment | We meet in the {conference} room on the second floor.|overtime equipment",
      "agenda department",
    ),
  ],
});

const business = vocabularyTopic({
  id: "b1-words-business",
  title: t("Business", "商业"),
  summary: t(
    "Business and industry; products and services; trade, profit and loss; income, tax and budgets; investing and brands.",
    "商业和工业；产品和服务；贸易、利润和亏损；收入、税和预算；投资和品牌。",
  ),
  prerequisites: ["b1-words-workplace"],
  words: [
    word(
      "business businesses",
      "the work of buying and selling; a company",
      "商业；企业",
      "My aunt runs a small {business}.|profit tax | Is your trip for {business} or pleasure?|industry brand | Many {businesses} closed during the storm.|profits taxes",
      "industry brand",
    ),
    word(
      "industry industries",
      "the businesses that make one kind of thing, or that make things in factories",
      "工业；行业",
      "The car {industry} employs thousands of people.|profit budget | Tourism is the biggest {industry} on the island.|budget tax | New {industries} are growing in the area.|budgets incomes",
      "business product",
    ),
    word(
      "product products",
      "a thing that is made to be sold",
      "产品",
      "This shop sells local {products}.|taxes losses | Our new {product} will be in shops next month.|service income | Milk and cheese are dairy {products}.|services incomes",
      "service brand",
    ),
    word(
      "service services",
      "work that a company does for people, not a thing it makes",
      "服务",
      "The food was good, but the {service} was slow.|product brand | The bus {service} stops at midnight.|product tax | The bank offers many {services}, such as advice about money.|taxes profits",
      "product trade",
    ),
    word(
      "trade trades traded trading",
      "the buying and selling of goods, often between countries; to exchange one thing for another",
      "贸易；交换",
      "{Trade} between the two countries has grown.|Brand Profit | The city grew rich from the silk {trade}.|budget income | The two boys {traded} stickers at lunch.|invested budgeted",
      "invest service",
    ),
    word(
      "profit profits",
      "the money a business makes after it has paid what things cost",
      "利润",
      "The shop made a {profit} of 5,000 yuan last month.|brand budget | We sold the car at a {profit}.|brand service | The company's {profits} rose by ten percent.|brands services",
      "loss income",
    ),
    word(
      "loss losses",
      "money that a business loses; the act of losing something",
      "亏损；损失",
      "The company made a {loss} this year, so nobody got a bonus.|profit brand | The {loss} of his job was a shock.|profit income | The storm caused heavy {losses} to farmers.|profits brands",
      "profit tax",
    ),
    word(
      "income incomes",
      "the money that you get from work or from other things",
      "收入",
      "Half of my {income} goes on rent.|tax brand | Families on low {incomes} can get help.|taxes products | Her {income} has doubled since she changed jobs.|brand product",
      "tax profit",
    ),
    word(
      "tax taxes",
      "money that people and businesses must pay to the government",
      "税",
      "The price includes {tax}.|income brand | Everyone who works pays {taxes}.|incomes brands | The government wants to raise the {tax} on cigarettes.|income brand",
      "income budget",
    ),
    word(
      "budget budgets",
      "the amount of money you have to spend, and a plan for it",
      "预算",
      "We're on a tight {budget}, so we can't eat out.|brand tax | The school's {budget} for books is very small.|brand product | Every department plans its {budget} for the year.|brand product",
      "income tax",
    ),
    word(
      "invest invests invested investing",
      "to put money or time into something to get more back later",
      "投资",
      "My uncle {invested} in a new restaurant.|traded budgeted | It's wise to {invest} in your education.|trade budget | The city is {investing} in new bus lanes.|trading budgeting",
      "trade profit",
    ),
    word(
      "brand brands",
      "the name of a product made by one company",
      "品牌",
      "What {brand} of phone do you have?|service budget | This is my favorite {brand} of tea.|service tax | Some {brands} of shoes are very expensive.|services budgets",
      "product industry",
    ),
  ],
});

const workVerbs = vocabularyTopic({
  id: "b1-words-work-verbs",
  title: t("Getting Things Done", "把事情做好"),
  summary: t(
    "Managing and employing; retiring, resigning and being promoted; leading, dealing and handling; arranging, attending, completing and preparing.",
    "管理和雇用；退休、辞职和晋升；领导、应对和处理；安排、出席、完成和准备。",
  ),
  prerequisites: ["b1-words-workplace"],
  words: [
    word(
      "manage manages managed managing",
      "to be in charge of a business or a group of people; to succeed in doing something difficult",
      "管理；设法做到",
      "She {manages} a team of ten people.|retires resigns | Did you {manage} to finish your homework?|retire attend | He {managed} the hotel for twenty years.|retired resigned",
      "retire resign",
      "handle",
    ),
    word(
      "employ employs employed employing",
      "to pay someone to work for you",
      "雇用",
      "The factory {employs} 300 workers.|retires resigns | She is {employed} as a teacher at a language school.|attended arranged | The shop {employed} two new assistants.|retired resigned",
      "retire attend",
    ),
    word(
      "retire retires retired retiring",
      "to stop working, usually because you are old",
      "退休",
      "My grandfather {retired} at sixty-five.|employed promoted | When I {retire}, I want to travel.|employ attend | She's {retiring} next year after forty years at the bank.|employing promoting",
      "employ promote",
      "resign",
    ),
    word(
      "resign resigns resigned resigning",
      "to say officially that you are leaving your job",
      "辞职",
      "He {resigned} because he didn't like his new boss.|employed promoted | The minister {resigned} after the scandal.|promoted attended | I'm going to {resign} and start my own business.|employ attend",
      "employ promote",
      "retire",
    ),
    word(
      "promote promotes promoted promoting",
      "to give someone a more important job",
      "提升；晋升",
      "She was {promoted} to manager after two years.|retired resigned | If you work hard, they'll {promote} you.|retire resign | He hopes to be {promoted} soon.|resigned attended",
      "retire employ",
    ),
    word(
      "lead leads led leading",
      "to be in charge of a group; to go first and show the way",
      "领导；带领",
      "She {led} the team to victory.|dealt handled | Who will {lead} the walk tomorrow?|deal employ | This road {leads} to the station.|deals handles",
      "deal follow",
    ),
    word(
      "deal deals dealt dealing",
      "to do what is needed about a problem or a person (deal with)",
      "处理；应付",
      "I'll {deal} with the problem tomorrow.|lead promote | She {dealt} with the angry customer very well.|led promoted | How do you {deal} with stress?|lead attend",
      "lead attend",
      "handle",
    ),
    word(
      "handle handles handled handling",
      "to deal with a situation, a person or a job",
      "处理；对付",
      "She {handled} the problem calmly.|attended retired | Can you {handle} this work on your own?|attend retire | He {handles} all the money for the club.|attends retires",
      "attend retire",
      "deal manage",
    ),
    word(
      "arrange arranges arranged arranging",
      "to plan something or make the plans for it",
      "安排",
      "I've {arranged} a meeting with the manager for Monday.|retired employed | Can you {arrange} a taxi to the airport?|attend retire | She {arranged} the flowers in a vase.|attended completed",
      "attend complete",
    ),
    word(
      "attend attends attended attending",
      "to go to an event, a school or a meeting",
      "出席；参加；上（学）",
      "Over 200 people {attended} the conference.|promoted employed | Which school does your son {attend}?|arrange employ | Please {attend} all your classes.|retire resign",
      "arrange complete",
    ),
    word(
      "complete completes completed completing",
      "to finish doing or making something",
      "完成",
      "Please {complete} the form in black ink.|attend retire | The new bridge will be {completed} next year.|attended retired | She {completed} her studies in 2020.|attended retired",
      "attend arrange",
    ),
    word(
      "prepare prepares prepared preparing",
      "to make something or someone ready",
      "准备",
      "I need to {prepare} for my interview.|complete employ | Dad is {preparing} dinner in the kitchen.|completing attending | She {prepared} a short speech for the party.|attended employed",
      "complete arrange",
    ),
  ],
});

const professions = vocabularyTopic({
  id: "b1-words-jobs-3",
  title: t("Professions", "职业"),
  summary: t(
    "Accountants, lawyers and journalists; architects, designers and programmers; secretaries and receptionists; electricians, plumbers, pharmacists and assistants.",
    "会计、律师和记者；建筑师、设计师和程序员；秘书和接待员；电工、水管工、药剂师和助理。",
  ),
  prerequisites: ["a2-words-jobs-2"],
  words: [
    word(
      "accountant accountants",
      "a person whose job is to keep or check the money records of a business",
      "会计",
      "Our {accountant} helps us pay the right amount of tax.|plumber receptionist | She studied math and became an {accountant}.|plumber designer | The {accountants} found a mistake in the budget.|plumbers receptionists",
      "lawyer secretary",
    ),
    word(
      "lawyer lawyers",
      "a person whose job is to give advice about the law and to speak for people in court",
      "律师",
      "You should talk to a {lawyer} before you sign the contract.|plumber electrician | The {lawyer} spoke for her in court.|pharmacist plumber | She's a {lawyer} who helps people in trouble with the law.|plumber designer",
      "accountant journalist",
    ),
    word(
      "journalist journalists",
      "a person who writes news for a newspaper, a magazine or a website",
      "记者",
      "A {journalist} wrote an article about our school.|plumber pharmacist | The {journalists} asked the minister questions.|plumbers electricians | She works as a {journalist} for a local newspaper.|plumber pharmacist",
      "lawyer designer",
    ),
    word(
      "architect architects",
      "a person whose job is to design buildings",
      "建筑师",
      "The {architect} drew plans for the new library.|pharmacist journalist | A famous {architect} designed this bridge.|pharmacist receptionist | {Architects} must think about how people will use a building.|Pharmacists Receptionists",
      "designer electrician",
    ),
    word(
      "designer designers",
      "a person who plans how something new will look, such as clothes or a website",
      "设计师",
      "She's a fashion {designer}. She makes dresses.|plumber pharmacist | The {designer} chose the colors for the website.|plumber electrician | Many {designers} show their clothes in Paris.|plumbers pharmacists",
      "architect programmer",
    ),
    word(
      "programmer programmers",
      "a person whose job is to write computer programs",
      "程序员",
      "The {programmer} fixed the problem in the app.|plumber pharmacist | My brother is a {programmer}. He writes code for games.|plumber pharmacist | {Programmers} spend all day writing code.|Plumbers Pharmacists",
      "designer electrician",
    ),
    word(
      "secretary secretaries",
      "a person who types letters, answers the phone and keeps records in an office",
      "秘书",
      "The {secretary} typed the letters and answered the phone.|plumber electrician | Please ask my {secretary} to book a meeting room.|plumber pharmacist | She was {secretary} of the chess club for two years.|plumber pharmacist",
      "lawyer accountant",
      "receptionist assistant",
    ),
    word(
      "receptionist receptionists",
      "a person who welcomes visitors and answers the phone at a hotel, an office or a clinic",
      "接待员；前台",
      "The {receptionist} at the hotel gave us our keys.|plumber electrician | Tell the {receptionist} your name when you arrive.|plumber electrician | Two {receptionists} work at the front desk.|plumbers electricians",
      "architect pharmacist",
      "secretary assistant",
    ),
    word(
      "electrician electricians",
      "a person whose job is to put in and repair electric wires and machines",
      "电工",
      "The lights don't work. We need an {electrician}.|accountant architect | The {electrician} put new wires in the kitchen.|journalist lawyer | My uncle is an {electrician}. He fixes lights and wires.|accountant architect",
      "plumber programmer",
    ),
    word(
      "plumber plumbers",
      "a person whose job is to put in and repair water pipes, toilets and sinks",
      "水管工",
      "The kitchen sink is leaking. Call a {plumber}!|lawyer journalist | The {plumber} fixed our toilet.|lawyer journalist | {Plumbers} often work with pipes.|Lawyers Journalists",
      "electrician architect",
    ),
    word(
      "pharmacist pharmacists",
      "a person whose job is to prepare and sell medicines",
      "药剂师",
      "The {pharmacist} told me to take the medicine twice a day.|plumber architect | Ask the {pharmacist} which cough medicine is best.|plumber architect | {Pharmacists} work in drugstores and hospitals.|Plumbers Architects",
      "plumber receptionist",
    ),
    word(
      "assistant assistants",
      "a person who helps someone in their work",
      "助手；助理；店员",
      "The shop {assistant} helped me find the right size.|plumber lawyer | She works as an {assistant} to the manager.|architect electrician | The teacher has two {assistants} in her class.|plumbers lawyers",
      "architect plumber",
      "secretary receptionist",
    ),
  ],
});

const workQualities = vocabularyTopic({
  id: "b1-words-work-qualities",
  title: t("Qualities at Work", "工作中的品质"),
  summary: t(
    "Reliable, flexible and punctual; efficient, ambitious and experienced; professional and honest; careless, motivated, practical and interested.",
    "可靠、灵活和准时；高效、有抱负和有经验；专业和诚实；粗心、积极、务实和感兴趣。",
  ),
  prerequisites: ["b1-words-qualities"],
  words: [
    word(
      "reliable",
      "able to be trusted to do what is needed",
      "可靠的",
      "Tom is very {reliable}. He always does what he promises.|careless ambitious | We need a {reliable} car for the long trip.|punctual ambitious | Is this news website {reliable}?|punctual ambitious",
      "careless flexible",
    ),
    word(
      "flexible",
      "able to change easily to suit new situations",
      "灵活的",
      "My job has {flexible} hours, so I can start late.|punctual careless | We need someone {flexible} who can work weekends too.|careless punctual | Our plans are {flexible}. We can go on Saturday or Sunday.|punctual careless",
      "punctual practical",
    ),
    word(
      "punctual",
      "always arriving at the right time",
      "准时的",
      "She is very {punctual}. She has never been late.|careless flexible | Trains in Japan are very {punctual}.|ambitious honest | Be {punctual}: the interview starts at nine, not five past nine.|flexible careless",
      "flexible efficient",
    ),
    word(
      "efficient",
      "working well without wasting time or energy",
      "高效的",
      "She's very {efficient}. She finished the work in half the time.|careless honest | This new heater is more {efficient} and uses less electricity.|honest ambitious | We need a more {efficient} way to answer emails.|honest ambitious",
      "careless punctual",
    ),
    word(
      "ambitious",
      "wanting very much to be successful",
      "有抱负的；有雄心的",
      "He's {ambitious}. He wants to be the boss one day.|careless punctual | She's an {ambitious} young lawyer.|careless punctual | That's an {ambitious} plan: to climb ten mountains in a year.|careless punctual",
      "motivated careless",
    ),
    word(
      "experienced",
      "having knowledge or skill because you have done something for a long time",
      "有经验的",
      "We need an {experienced} driver for the bus trip.|careless punctual | She's an {experienced} nurse. She has worked for twenty years.|careless punctual | He has worked here for thirty years, so he's very {experienced}.|punctual ambitious",
      "professional ambitious",
    ),
    word(
      "professional",
      "having the skills of a trained person; doing something as a paid job",
      "专业的；职业的",
      "She's a {professional} singer, not an amateur.|careless punctual | He gave us very {professional} advice.|punctual ambitious | If you want to be a {professional} footballer, you must train every day.|careless punctual",
      "experienced practical",
    ),
    word(
      "honest",
      "telling the truth and not stealing or cheating",
      "诚实的",
      "Please be {honest}. Did you break the window?|punctual efficient | An {honest} man found my wallet and gave it back.|careless punctual | To be {honest}, I didn't like the film.|punctual flexible",
      "reliable punctual",
    ),
    word(
      "careless",
      "not thinking enough about what you are doing, so that you make mistakes",
      "粗心的",
      "I made some {careless} mistakes in the test.|honest punctual | He's a {careless} driver. He often drives too fast.|reliable punctual | Don't be so {careless} with your money!|punctual flexible",
      "reliable efficient",
    ),
    word(
      "motivated",
      "wanting to do something and working hard to do it",
      "有积极性的",
      "The students are very {motivated}. They work hard.|careless lazy | She's {motivated} by a love of science.|careless punctual | We want {motivated} people who love their work.|careless punctual",
      "ambitious practical",
    ),
    word(
      "practical",
      "useful and sensible in real situations; good at making and fixing things",
      "实用的；动手能力强的",
      "Here is some {practical} advice for your first day at work.|punctual careless | High heels aren't very {practical} for walking.|punctual honest | He's very {practical}. He can fix anything.|punctual honest",
      "flexible professional",
    ),
    word(
      "interested",
      "wanting to know or learn about something",
      "感兴趣的",
      "I'm very {interested} in history.|punctual careless | Are you {interested} in the job? Send us your application.|punctual careless | She wasn't {interested} in football, so she read a book.|punctual flexible",
      "motivated honest",
    ),
  ],
});

const office = vocabularyTopic({
  id: "b1-words-office",
  title: t("The Office", "办公室"),
  summary: t(
    "Documents, folders and forms; signatures, signing and stamps; memos, calendars and reminders; invoices, staplers and drawers.",
    "文件、文件夹和表格；签名、签署和邮票；备忘录、日历和提醒；发票、订书机和抽屉。",
  ),
  prerequisites: ["b1-words-workplace"],
  words: [
    word(
      "document documents",
      "a paper or a computer file with official information",
      "文件",
      "Please read this {document} and sign at the bottom.|stapler drawer | You'll need some {documents}, such as your passport.|staplers drawers | I saved the {document} on my computer.|stapler drawer",
      "folder memo",
    ),
    word(
      "folder folders",
      "a cover of card, or a place on a computer, for keeping papers or files",
      "文件夹",
      "Keep all your notes in this {folder}.|stamp signature | I put the photos in a new {folder} on my computer.|stamp invoice | The {folders} are on the top shelf.|signatures reminders",
      "document drawer",
    ),
    word(
      "form forms",
      "an official paper with spaces where you write information",
      "表格",
      "Please fill in this {form}.|stamp drawer | You can download the application {form} from our website.|stapler drawer | I had to fill in three {forms} at the bank.|staplers drawers",
      "document memo",
    ),
    word(
      "signature signatures",
      "your name written in your own special way",
      "签名",
      "Please put your {signature} at the bottom of the page.|stapler drawer | The letter needs the manager's {signature}.|stapler drawer | We collected 500 {signatures}.|staplers drawers",
      "stamp form",
    ),
    word(
      "sign signs signed signing",
      "to write your name on something",
      "签名；签署",
      "Please {sign} here.|drawer memo | She {signed} the contract with a blue pen.|reminded invoiced | {Sign} your name on the line.|Remind Memo",
      "stamp remind",
    ),
    word(
      "stamp stamps",
      "a small piece of paper you stick on a letter to pay for the post; a tool that prints a mark",
      "邮票；图章",
      "I need a {stamp} for this letter.|memo signature | He collects {stamps} from all over the world.|memos invoices | The officer put a {stamp} in my passport.|memo drawer",
      "signature memo",
    ),
    word(
      "memo memos",
      "a short official note sent to people in an office",
      "备忘录；便函",
      "The boss sent a {memo} to everyone in the office.|stapler drawer | Did you read the {memo} about the new rules?|stapler drawer | I get too many {memos} at work.|staplers drawers",
      "reminder document",
    ),
    word(
      "calendar calendars",
      "a page or a list that shows the days, weeks and months of a year",
      "日历",
      "I marked her birthday on the {calendar}.|stapler drawer | Let me check my {calendar}. Yes, I'm free on Friday.|stapler stamp | We gave our clients {calendars} with photos of the city.|staplers invoices",
      "reminder memo",
    ),
    word(
      "reminder reminders",
      "something that helps you remember",
      "提醒（物）",
      "I set a {reminder} on my phone for the dentist.|stapler drawer | This is a {reminder} that the meeting starts at ten.|stapler drawer | The library sent me two {reminders} about my late books.|staplers drawers",
      "memo calendar",
    ),
    word(
      "invoice invoices",
      "a list of things sold or work done, with the price to pay",
      "发票；账单",
      "Please pay the {invoice} within thirty days.|stapler drawer | The plumber sent us an {invoice} for 800 yuan.|stapler drawer | I keep all the {invoices} in a folder.|staplers drawers",
      "form document",
    ),
    word(
      "stapler staplers",
      "a tool that joins pieces of paper with small pieces of metal",
      "订书机",
      "Can I borrow your {stapler}? I need to join these pages.|calendar invoice | The {stapler} is empty. We need more staples.|calendar invoice | Join the pages with a {stapler}.|calendar signature",
      "drawer folder",
    ),
    word(
      "drawer drawers",
      "a box in a desk or a cupboard that slides in and out",
      "抽屉",
      "The scissors are in the top {drawer}.|invoice memo | She opened the {drawer} and took out a pen.|invoice memo | My desk has three {drawers}.|invoices memos",
      "folder stapler",
    ),
  ],
});

const linking = vocabularyTopic({
  id: "b1-words-little-words-5",
  title: t("Linking Words 2", "连接词 2"),
  summary: t(
    "Whenever and wherever; anyway and otherwise; besides, therefore and meanwhile; actually, especially and exactly; simply, rarely and according to.",
    "whenever 和 wherever；anyway 和 otherwise；besides、therefore 和 meanwhile；actually、especially 和 exactly；simply、rarely 和 according to。",
  ),
  prerequisites: ["b1-words-little-words-4"],
  words: [
    word(
      "whenever",
      "every time that; at any time",
      "每当；无论何时",
      "{Whenever} I hear this song, I think of you.|Besides Therefore | Come and visit us {whenever} you're free.|besides otherwise | She smiles {whenever} she sees him.|besides therefore",
      "besides therefore",
      "wherever",
    ),
    word(
      "wherever",
      "in or to any place",
      "无论在哪里",
      "Sit {wherever} there is a free seat.|besides therefore | My dog follows me {wherever} I go.|besides otherwise | {Wherever} you are in the city, you can see the tower.|Besides Therefore",
      "besides otherwise",
      "whenever",
    ),
    word(
      "anyway",
      "but this is not important; still",
      "不管怎样；反正",
      "It was raining, but we went out {anyway}.|meanwhile therefore | I don't really like cake, but I'll have a piece {anyway}.|therefore especially | {Anyway}, let's talk about something else.|Especially Exactly",
      "therefore especially",
    ),
    word(
      "otherwise",
      "if not; or else",
      "否则；不然",
      "Hurry up, {otherwise} we'll miss the bus.|besides meanwhile | Write it down. {Otherwise}, you'll forget.|Especially Exactly | Wear a coat, {otherwise} you'll get cold.|especially exactly",
      "besides meanwhile",
    ),
    word(
      "besides",
      "also; as well as",
      "此外；除……之外（还）",
      "I don't want to go out. {Besides}, it's too late.|Otherwise Instead | {Besides} English, she speaks French and German.|Otherwise Meanwhile | Who else was there {besides} you?|otherwise instead",
      "instead otherwise",
    ),
    word(
      "therefore",
      "for that reason",
      "因此",
      "It was snowing. {Therefore}, the school was closed.|Otherwise Besides | She studied hard and {therefore} passed the exam.|otherwise besides | The road is dangerous. Drivers must {therefore} go slowly.|otherwise besides",
      "otherwise besides",
    ),
    word(
      "meanwhile",
      "while something else is happening",
      "与此同时",
      "Dad cooked dinner. {Meanwhile}, I set the table.|Therefore Otherwise | The film starts in an hour. {Meanwhile}, let's get something to eat.|Otherwise Exactly | I'll call the doctor. {Meanwhile}, you should rest.|Exactly Especially",
      "therefore otherwise",
    ),
    word(
      "actually",
      "really; in fact, often when saying something surprising",
      "实际上；其实",
      "He looks young, but he's {actually} fifty.|especially otherwise | {Actually}, I don't like coffee.|Especially Otherwise | Did she {actually} say that?|otherwise besides",
      "especially exactly",
    ),
    word(
      "especially",
      "more than usual; more than others",
      "尤其；特别",
      "I love fruit, {especially} apples.|otherwise therefore | It's cold here, {especially} in January.|otherwise therefore | This book is {especially} for children.|otherwise therefore",
      "actually otherwise",
    ),
    word(
      "exactly",
      "with no mistake; not more or less",
      "确切地；正好",
      "It's {exactly} three o'clock.|especially otherwise | That's {exactly} what I wanted!|otherwise besides | What {exactly} did he say?|besides therefore",
      "especially actually",
    ),
    word(
      "simply",
      "only; just; in a way that is easy to understand",
      "只是；简单地",
      "I {simply} don't have time today.|meanwhile otherwise | Explain it {simply}, please. I'm new to this.|whenever wherever | It's {simply} too cold to swim.|whenever wherever",
      "sample supply",
    ),
    word(
      "rarely",
      "not often",
      "很少；难得",
      "My grandfather {rarely} watches TV.|meanwhile wherever | It {rarely} snows here, even in winter.|whenever besides | We {rarely} see each other now that she lives abroad.|wherever whenever",
      "really nearly",
    ),
    word(
      "according",
      "as said or shown by someone or something (according to)",
      "根据；据……所说",
      "{According} to the weather forecast, it will rain tomorrow.|especially exactly | {According} to my teacher, the test will be easy.|besides actually | The students were put in groups {according} to their age.|especially exactly",
      "accident account",
    ),
  ],
});

// Used to.

/** habits are a subject, the subject in a question, and a past habit or state that has ended. */
const habits: readonly (readonly [string, string, string])[] = [
  ["I", "you", "live in a small village"],
  ["My dad", "your dad", "smoke"],
  ["We", "you", "go to the beach every summer"],
  ["She", "she", "have long hair"],
  ["They", "they", "play football after school"],
  ["Tom", "Tom", "be very shy"],
  ["My grandma", "your grandma", "work in a factory"],
  ["I", "you", "hate vegetables"],
  ["We", "you", "walk to school"],
  ["He", "he", "ride his bike to work"],
  ["My parents", "your parents", "run a small shop"],
  ["Lisa", "Lisa", "write to her pen friend every week"],
  ["There", "there", "be a cinema in our town"],
  ["Our teacher", "your teacher", "give us a lot of homework"],
  ["My brother", "your brother", "collect stamps"],
  ["We", "you", "have a dog"],
  ["This street", "this street", "be very quiet"],
];

const usedToChoice: readonly ChoiceItem[] = interleave([
  habits.map(([s, , p]): ChoiceItem => [`${s} ___ ${p}, but not any more.`, "used to", ["use to", "was used to"]]),
  habits.map(([s, , p]): ChoiceItem => [`${s} didn't ___ ${p}.`, "use to", ["used to", "uses to"]]),
  habits.map(([, q, p]): ChoiceItem => [`Did ${q} ___ ${p}?`, "use to", ["used to", "using to"]]),
]);

const usedToTyped: readonly TypedItem[] = interleave([
  habits.map(
    ([s, , p]): TypedItem => ({
      shown: `${s} / ${p} / (a past habit)`,
      accepted: [`${s} used to ${p}.`],
      wrong: [`${s} use to ${p}.`, `${s} was used to ${p}.`],
    }),
  ),
  habits.map(
    ([s, , p]): TypedItem => ({
      shown: `${s} / not / ${p} / (in the past)`,
      accepted: [`${s} [didn't|did not] use to ${p}.`],
      canonical: `${s} didn't use to ${p}.`,
      wrong: [`${s} didn't used to ${p}.`, `${s} not used to ${p}.`],
    }),
  ),
]);

/** usedNote explains in Chinese why a sentence takes used to or use to. */
function usedNote(sentence: string): string {
  if (sentence.includes("didn't") || sentence.startsWith("Did ")) return "否定句和疑问句里已经有 did，后面用原形 use to，不用 used to";
  return "肯定句用 used to 加动词原形，表示过去的习惯或状态，现在已经不这样了";
}

const usedTo: TopicDef = {
  id: "used-to",
  title: t("Used To", "used to"),
  summary: t(
    "I used to live in a village, but now I live in a city. Used to tells of a past habit or state that has ended; after did, it is use to.",
    "I used to live in a village, but now I live in a city。used to 表示过去的习惯或状态，现在已经不这样了；did 后面用 use to。",
  ),
  prerequisites: ["past-simple-questions-and-negatives"],
  encompasses: [
    { topic: "past-simple-irregular", weight: 0.1 },
    { topic: "past-simple-questions-and-negatives", weight: 0.3 },
  ],
  xp: 20,
  strand: "grammar",
  knowledgePoints: [
    point(
      "forms",
      t("Used to or use to?", "used to 还是 use to？"),
      t(
        "*Used to* + the base form of a verb tells of something that was true or happened often in the past, but is not true now.\n\n- *I **used to** live in a village.* (Now I live in a city.)\n- *There **used to** be a cinema here.*\n\nIn negatives and questions, *did* carries the past, so the verb is *use to*, with no *d*:\n\n- *I **didn't use to** like coffee.*\n- ***Did** you **use to** play the piano?*\n\nDo not add *was*: not *I was used to live*.",
        "*used to* 加动词原形，表示过去常常发生或过去是这样、但现在已经不这样的事情，相当于中文的“以前常常……”“过去曾经……”。\n\n- *I **used to** live in a village.*（现在住在城市。）\n- *There **used to** be a cinema here.*\n\n否定句和疑问句中，过去时已经由 *did* 表示，所以动词用 *use to*，不加 *d*：\n\n- *I **didn't use to** like coffee.*\n- ***Did** you **use to** play the piano?*\n\n不要加 *was*：不能说 *I was used to live*。（*be used to doing* 是“习惯于做……”，是另一个意思。）",
      ),
      choiceGenerator(t("Choose the words for the gap.", "选出填入空白处的词。"), usedToChoice, (right, shown) =>
        t(fill(shown, right), `${fill(shown, right)}（${usedNote(shown)}）`),
      ),
    ),
    point(
      "write",
      t("Writing with used to", "用 used to 写句子"),
      t(
        "Write the sentence from the note. For a past habit: *I used to live in a small village.* For one that was not true: *I didn't use to live in a small village.*",
        "根据笔记写句子。过去的习惯：*I used to live in a small village.* 过去不是这样：*I didn't use to live in a small village.*",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Write a sentence with used to from the note.", "根据笔记用 used to 写一个句子。"),
        usedToTyped,
        (right) => t(right, `${right}（${usedNote(right)}）`),
      ),
    ),
  ],
};

// The present perfect continuous.

/** activities are a subject, have or has, the base and -ing form of a verb, the rest, a starting point and a length of time. */
const activities: readonly (readonly [string, string, string, string, string, string, string])[] = [
  ["I", "have", "wait", "waiting", "for the bus", "eight o'clock", "twenty minutes"],
  ["She", "has", "work", "working", "here", "May", "six months"],
  ["We", "have", "live", "living", "in this flat", "2020", "five years"],
  ["It", "has", "rain", "raining", "", "this morning", "three hours"],
  ["They", "have", "learn", "learning", "Chinese", "last September", "a year"],
  ["My brother", "has", "play", "playing", "computer games", "lunch", "four hours"],
  ["Tom", "has", "study", "studying", "for the exam", "Monday", "a week"],
  ["You", "have", "talk", "talking", "on the phone", "dinner", "an hour"],
  ["Anna", "has", "teach", "teaching", "at this school", "2018", "eight years"],
  ["The baby", "has", "cry", "crying", "", "midnight", "two hours"],
  ["I", "have", "read", "reading", "this book", "the weekend", "three days"],
  ["We", "have", "clean", "cleaning", "the house", "ten o'clock", "two hours"],
  ["He", "has", "drive", "driving", "", "six this morning", "five hours"],
  ["My parents", "have", "run", "running", "the restaurant", "2010", "sixteen years"],
  ["Lily", "has", "practice", "practicing", "the piano", "she was six", "ten years"],
  ["They", "have", "build", "building", "the new bridge", "last spring", "eighteen months"],
];

const beOf = (subject: string, have: string) => (subject === "I" ? "am" : have === "has" ? "is" : "are");
const words = (...parts: readonly string[]) => parts.filter((p) => p !== "").join(" ");
const shortPerfect: Readonly<Record<string, string>> = {
  I: "I've",
  You: "You've",
  We: "We've",
  They: "They've",
  She: "She's",
  He: "He's",
  It: "It's",
};

const ppcChoice: readonly ChoiceItem[] = interleave([
  activities.map(([s, have, , ing, rest, since]): ChoiceItem => {
    const be = beOf(s, have);
    return [`${words(s, "___", rest, "since", since)}.`, `${have} been ${ing}`, [`${be} ${ing}`, `${be} been ${ing}`]];
  }),
  activities.map(([s, have, , ing, rest, , dur]): ChoiceItem => {
    const be = beOf(s, have);
    return [`${words(s, "___", rest, "for", dur)}.`, `${have} been ${ing}`, [`${be} ${ing}`, `${have} ${ing}`]];
  }),
]);

const forSinceChoice: readonly ChoiceItem[] = interleave([
  activities.map(
    ([s, have, , ing, rest, since]): ChoiceItem => [`${words(s, have, "been", ing, rest, "___", since)}.`, "since", ["for", "from"]],
  ),
  activities.map(
    ([s, have, , ing, rest, , dur]): ChoiceItem => [`${words(s, have, "been", ing, rest, "___", dur)}.`, "for", ["since", "during"]],
  ),
]);

const ppcTyped: readonly TypedItem[] = interleave(
  (["since", "for"] as const).map((word) =>
    activities.map(([s, have, base, ing, rest, since, dur]): TypedItem => {
      const time = word === "since" ? `since ${since}` : `for ${dur}`;
      const contracted = shortPerfect[s];
      const start = contracted ? `[${s} ${have}|${contracted}]` : `${s} ${have}`;
      const be = beOf(s, have);
      return {
        shown: `${words(s, base, rest)} / ${time}`,
        accepted: [`${words(start, "been", ing, rest, time)}.`],
        canonical: `${words(s, have, "been", ing, rest, time)}.`,
        wrong: [`${words(s, be, ing, rest, time)}.`, `${words(s, be, "been", ing, rest, time)}.`],
      };
    }),
  ),
);

/** ppcNote explains in Chinese the form of the present perfect continuous or the choice of for and since. */
function ppcNote(right: string): string {
  if (right === "since") return "since 后面是开始的时间点（一个日子、一年、一个时刻）";
  if (right === "for") return "for 后面是一段时间（多少分钟、天、年）";
  return "从过去开始、一直持续到现在的动作，用 have/has been 加动词 -ing，不用现在进行时";
}

const presentPerfectContinuous: TopicDef = {
  id: "present-perfect-continuous",
  title: t("The Present Perfect Continuous", "现在完成进行时"),
  summary: t(
    "She has been working here since May. I have been waiting for twenty minutes. Have or has, been and -ing, for something that began in the past and is still going on.",
    "She has been working here since May. I have been waiting for twenty minutes. 用 have/has been 加 -ing，表示从过去开始、现在仍在进行的动作。",
  ),
  prerequisites: ["present-perfect-or-past-simple", "present-continuous", "b1-words-little-words-5"],
  encompasses: [
    { topic: "present-perfect-or-past-simple", weight: 0.3 },
    { topic: "present-continuous", weight: 0.2 },
  ],
  xp: 25,
  strand: "grammar",
  knowledgePoints: [
    point(
      "form",
      t("Have been doing", "have been doing 的形式"),
      t(
        "For an action that began in the past and is still going on now, use *have* or *has* + *been* + the *-ing* form.\n\n- *She **has been working** here since May.* (She started in May and still works here.)\n- *I **have been waiting** for twenty minutes.*\n\nDo not use the present continuous with *since* or *for*: not *She is working here since May*. And do not leave out *have*: not *She been working*.",
        "从过去开始、一直持续到现在（可能还会继续）的动作，用 *have / has* + *been* + 动词 *-ing*。\n\n- *She **has been working** here since May.*（她从五月开始在这里工作，现在还在。）\n- *I **have been waiting** for twenty minutes.*\n\n中文说“她从五月起就一直在这里工作”“我已经等了二十分钟了”，动词没有变化，靠“一直”“已经……了”表达；英语却必须用 *has been working*。有 *since* 或 *for* 时不要用现在进行时：不能说 *She is working here since May*。也不要漏掉 *have*：不能说 *She been working*。",
      ),
      choiceGenerator(t("Choose the words for the gap.", "选出填入空白处的词。"), ppcChoice, (right, shown) =>
        t(fill(shown, right), `${fill(shown, right)}（${ppcNote(right)}）`),
      ),
    ),
    point(
      "for-or-since",
      t("For or since?", "for 还是 since？"),
      t(
        "*Since* gives the point when something began: *since May, since 2020, since eight o'clock, since she was six*.\n\n*For* gives how long it has lasted: *for six months, for five years, for twenty minutes*.\n\nDo not use *from* or *during* here: not *I have been waiting from eight o'clock*.",
        "*since* 后面是开始的时间点：*since May, since 2020, since eight o'clock, since she was six*。\n\n*for* 后面是持续了多长时间：*for six months, for five years, for twenty minutes*。\n\n这里不要用 *from* 或 *during*：不能说 *I have been waiting from eight o'clock*。中文“从八点起”容易让人写成 *from*。",
      ),
      choiceGenerator(t("Choose the word for the gap.", "选出填入空白处的词。"), forSinceChoice, (right, shown) =>
        t(fill(shown, right), `${fill(shown, right)}（${ppcNote(right)}）`),
      ),
    ),
    point(
      "write",
      t("Writing in the present perfect continuous", "用现在完成进行时写句子"),
      t(
        "Write the sentence from the note in the present perfect continuous: *She / work / here / since May* → *She has been working here since May.* You may use short forms such as *I've* and *she's*.",
        "根据笔记用现在完成进行时写句子：*She / work / here / since May* → *She has been working here since May.* 可以用 *I've*、*she's* 这样的缩写。",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Write the sentence in the present perfect continuous.", "用现在完成进行时写出这个句子。"),
        ppcTyped,
        (right) => t(right, `${right}（${ppcNote("")}）`),
      ),
    ),
  ],
};

// A formal email.

const formalBank: readonly WritingItem[] = [
  {
    task: "Write to the manager of the café to apply for the job.",
    source:
      "Summer job: Café assistant at Green Leaf Café. Weekends, July and August. Some experience preferred. Email the manager, Ms. Hall, with your experience and the days you can work.",
    model:
      "Dear Ms. Hall,\n\nI am writing to apply for the position of café assistant that I saw advertised on your website.\n\nI am seventeen years old and I am a student at Riverside High School. Last summer I worked for two months in my uncle's restaurant, where I served customers and helped in the kitchen. I am reliable and punctual, and I enjoy working in a team.\n\nI am free to work every weekend in July and August. I could also work some weekdays in August if you need extra help.\n\nCould you tell me how many hours a day the job would be? I would also be grateful if you could let me know when the interviews will take place.\n\nI look forward to hearing from you.\n\nYours sincerely,\nDaniel Chen",
  },
  {
    task: "Write to the language school to ask for information about its course.",
    source:
      "Evening English courses at City Language School. Small classes, experienced teachers. For more information, email the director, Mr. Brown.",
    model:
      "Dear Mr. Brown,\n\nI am writing to ask for some information about the evening English courses at your school.\n\nI have been learning English for four years, and I would like to improve my speaking before I start university next year. I work during the day, so an evening course would suit me well.\n\nI would be grateful if you could answer a few questions. First, how many students are there in each class? Second, how much does the course cost, and does the price include books? Finally, is there a test to decide which level I should join?\n\nThank you for your help. I look forward to your reply.\n\nYours sincerely,\nSophie Wang",
  },
  {
    task: "Write to the museum to apply to be a volunteer.",
    source:
      "Volunteers wanted at the Science Museum. Help visitors on Saturdays. Training given. Write to Mrs. Lopez and tell us why you would like to volunteer.",
    model:
      "Dear Mrs. Lopez,\n\nI am writing in reply to your advertisement for volunteers at the Science Museum.\n\nI am a sixteen-year-old student, and I have been interested in science since I was a child. My favorite subjects are physics and chemistry. I have visited the museum many times, and I would love to help other visitors enjoy it as much as I do.\n\nI am friendly and patient, and last year I helped younger students in the school science club every week. I am free every Saturday, and I am happy to attend the training.\n\nCould you please tell me when the training takes place and how long it lasts?\n\nThank you for considering my application.\n\nYours sincerely,\nRyan Liu",
  },
  {
    task: "Write to your school principal to ask if you can start a new club.",
    source: "You want to start a photography club at school. Say why, when it could meet, and what you need from the school.",
    model:
      "Dear Mrs. Green,\n\nI am writing to ask if I could start a photography club at our school.\n\nMany students in my class are interested in photography, but at the moment there is no club for them. A club would help students learn new skills, and we could take photos of school events for the school website.\n\nThe club could meet every Wednesday after school, from four to five o'clock. My art teacher, Mr. Davis, has said that he would be happy to help.\n\nWe would need a room to meet in, and it would be very helpful if we could borrow the school's two cameras.\n\nI would be grateful if we could discuss this. Thank you for your time.\n\nYours sincerely,\nEmily Zhang",
  },
  {
    task: "Write to the company to ask for a week of work experience.",
    source:
      "You would like a week of work experience at Bright Design, a company that designs websites, during the school holidays. Write to the manager, Mr. Taylor.",
    model:
      "Dear Mr. Taylor,\n\nI am writing to ask if it would be possible to do a week of work experience at Bright Design.\n\nI am a student in my final year of high school, and I would like to study design at university. I have been designing simple websites in my free time for two years, and I recently made one for my school's drama club.\n\nI would love to see how a real design company works. I am free during the school holidays from the 10th to the 21st of July, and I could come for any week in that time.\n\nCould you please let me know if this would be possible? I can send you some examples of my work.\n\nThank you for your time.\n\nYours sincerely,\nAlex Kim",
  },
  {
    task: "Write to the hotel to ask about a room for a meeting.",
    source:
      "Your school club wants to hold a meeting for 30 people at the Park Hotel on Saturday 12 May. Ask about the price, the equipment and food.",
    model:
      "Dear Sir or Madam,\n\nI am writing on behalf of the Riverside School Debate Club to ask about booking a meeting room at your hotel.\n\nWe would like to hold a meeting for about thirty people on Saturday the 12th of May, from ten in the morning until three in the afternoon.\n\nI would be grateful if you could answer the following questions. How much would it cost to book a room for the day? Does the room have a projector and a screen? We would also like to have lunch during the meeting. Could you send us your menu and prices?\n\nThank you in advance for your help. I look forward to hearing from you.\n\nYours faithfully,\nMichael Brown\nSecretary, Riverside School Debate Club",
  },
  {
    task: "Write to the company to accept the job and ask some questions.",
    source:
      "The Sunshine Hotel has offered you a summer job as a receptionist. Accept the job, and ask about the uniform, your first day, and the hours.",
    model:
      "Dear Ms. Clark,\n\nThank you very much for your email offering me the position of receptionist at the Sunshine Hotel. I am delighted to accept.\n\nBefore I start, I would like to ask a few questions. First, will I need to wear a uniform, and if so, will the hotel provide it? Second, could you tell me what time I should arrive on my first day, and who I should ask for?\n\nFinally, I would be grateful if you could tell me my working hours. I have a university class on Monday mornings until the end of June, so I would prefer to work in the afternoons on Mondays until then.\n\nI am looking forward to working with you.\n\nYours sincerely,\nLaura Smith",
  },
  {
    task: "Write to the company to ask to change the time of your interview.",
    source:
      "You have an interview at Star Bank on Thursday at 10 a.m., but you have an exam at that time. Write to Mr. Evans, apologize and ask for another time.",
    model:
      "Dear Mr. Evans,\n\nThank you for inviting me to an interview for the position of bank assistant on Thursday at ten o'clock.\n\nUnfortunately, I have an important exam at school at that time, and I am not able to change it. I am very sorry for any problem this may cause.\n\nI am still very interested in the position. Would it be possible to have the interview at another time? I am free on Thursday afternoon after two o'clock, and at any time on Friday.\n\nI would be grateful if you could let me know which time would suit you best. Thank you for your understanding.\n\nYours sincerely,\nKevin Zhao",
  },
  {
    task: "Write to your old teacher to ask for a reference.",
    source:
      "You are applying for a summer course at a university. You need a reference from a teacher. Write to Mrs. Adams, who taught you English last year.",
    model:
      "Dear Mrs. Adams,\n\nI hope you are well. I am writing to ask if you would be willing to write a reference for me.\n\nI am applying for a two-week summer course in journalism at Hill University. The course requires a reference from a teacher who knows my work. As you taught me English last year, I think you know my writing better than anyone.\n\nThe deadline for the reference is the 15th of April. If you agree, I will send you the form and the address of the university. I can also send you a copy of my application.\n\nThank you very much for considering my request. I really enjoyed your classes.\n\nBest regards,\nAmy Lin",
  },
  {
    task: "Write to the sports center to ask about a job as a swimming coach.",
    source: "Wanted: assistant swimming coach for children's classes at City Sports Center. Write to Mr. Moore with your qualifications.",
    model:
      "Dear Mr. Moore,\n\nI am writing to apply for the position of assistant swimming coach for children's classes, which I saw advertised in the local newspaper.\n\nI have been swimming since I was five, and I was in my school swimming team for six years. Last year I passed a lifeguard course, and I now have a certificate in first aid.\n\nI have some experience with children, as I have helped at a summer camp for two years. I am patient and responsible, and I enjoy teaching.\n\nCould you please tell me how many hours a week the job is, and whether I would need any other qualifications? I have attached my references.\n\nI look forward to hearing from you.\n\nYours sincerely,\nJason Wu",
  },
  {
    task: "Write to the library to ask about a part-time job.",
    source:
      "You would like a part-time job at the city library after school. You do not know if there are any vacancies. Write to the head librarian.",
    model:
      "Dear Sir or Madam,\n\nI am writing to ask if there are any part-time jobs available at the city library.\n\nI am a student at West High School, and I am free every weekday after half past four and on Saturday mornings. I love reading, and I visit the library at least twice a week, so I know it well.\n\nI am organized and careful, and I have good computer skills. Last summer I helped my school librarian put new books on the shelves and enter them on the computer.\n\nIf there are no jobs at the moment, I would be grateful if you could keep my name for the future.\n\nThank you for reading my email.\n\nYours faithfully,\nNina Patel",
  },
  {
    task: "Write to the university to ask about a place on its course.",
    source:
      "You want to study engineering at Lake University. Write to Professor Hill to ask about the course, the entry requirements and visiting the campus.",
    model:
      "Dear Professor Hill,\n\nI am writing to ask for some information about the engineering course at Lake University.\n\nI am in my last year of high school in Hangzhou, and I have been interested in engineering since I built my first model bridge at the age of twelve. My best subjects are math and physics.\n\nI would be grateful if you could tell me what grades I need to apply for the course. I would also like to know if students can do some work in a real company during the course.\n\nFinally, is it possible to visit the campus before I apply? I will be in the area in March.\n\nThank you for your help.\n\nYours sincerely,\nLeo Sun",
  },
];

const writingAFormalEmail = judgedTopic({
  id: "writing-a-formal-email",
  title: t("Writing a Formal Email", "写正式电子邮件"),
  summary: t(
    "Write an email of 120 to 180 words to someone you do not know, such as an employer, with a formal opening and closing, a clear purpose and polite requests.",
    "给不认识的人（比如雇主）写一封 120 到 180 词的电子邮件：正式的开头和结尾，目的清楚，请求礼貌。",
  ),
  prerequisites: ["writing-an-informal-email"],
  encompasses: [{ topic: "writing-an-informal-email", weight: 0.3 }],
  criteria: ["b1-formal-email-purpose", "b1-formal-register", "b1-polite-requests", "b1-email-paragraphs"],
  point: {
    id: "email",
    title: t("Purpose, register and requests", "目的、语体和请求"),
    explanation: t(
      "A formal email to someone you do not know has its own shape and words:\n\n- **Opening:** *Dear Ms. Hall,* or, if you do not know the name, *Dear Sir or Madam,*\n- **Purpose first:** *I am writing to apply for…* / *I am writing to ask about…*\n- **One paragraph for each point** the task names: your experience, your dates, your questions.\n- **Polite requests:** *Could you tell me…?* *I would be grateful if you could…* *I would like to know…*, not *Tell me…*\n- **Closing:** *I look forward to hearing from you.* Then *Yours sincerely,* (after a name) or *Yours faithfully,* (after *Sir or Madam*), and your full name.\n\nWrite *I am*, *do not* and *I would* in full, and leave out words such as *hi*, *great* and *really*.",
      "给不认识的人写的正式邮件，有自己的结构和用词：\n\n- **开头：** *Dear Ms. Hall,*；不知道名字时写 *Dear Sir or Madam,*\n- **先说目的：** *I am writing to apply for…* / *I am writing to ask about…*\n- 任务要求的**每一点写一段**：你的经验、你的时间、你的问题。\n- **礼貌地请求：** *Could you tell me…?* *I would be grateful if you could…* *I would like to know…*，不要说 *Tell me…*\n- **结尾：** *I look forward to hearing from you.* 然后写 *Yours sincerely,*（开头写了名字时）或 *Yours faithfully,*（开头是 *Sir or Madam* 时），再写全名。\n\n*I am*、*do not*、*I would* 要写完整，不用缩写，也不用 *hi*、*great*、*really* 这类口语词。中文正式信函常以客套话开头，英语正式邮件则第一句就说明来意。",
    ),
  },
  question: t(
    "Read the notes. Write a formal email of 120 to 180 words in English: say why you are writing, cover every point, and make your requests politely.",
    "阅读说明，用英语写一封 120 到 180 词的正式电子邮件：说明写信的目的，写到每一点，礼貌地提出请求。",
  ),
  bank: formalBank,
  limits: { minWords: 100, maxChars: 1600 },
  what: t("formal email", "正式电子邮件"),
});

/** topics are the topics of the unit Work and Careers. */
export const topics: readonly TopicDef[] = [
  applying.topic,
  workplace.topic,
  business.topic,
  workVerbs.topic,
  professions.topic,
  workQualities.topic,
  office.topic,
  linking.topic,
  usedTo,
  presentPerfectContinuous,
  writingAFormalEmail,
];

/** vocabulary are the words the unit Work and Careers teaches. */
export const vocabulary: readonly WordBatch[] = [
  applying.batch,
  workplace.batch,
  business.batch,
  workVerbs.batch,
  professions.batch,
  workQualities.batch,
  office.batch,
  linking.batch,
];
