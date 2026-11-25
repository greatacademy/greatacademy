// B1, unit 2: Work and Careers. Applying for a job, the workplace, business, getting things done, professions, qualities
// at work, the office and linking words; used to and the present perfect continuous; a formal email judged by a model.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator, type WritingItem } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { fill, judgedTopic } from "../a2/kit.ts";
import { everyPair, interleave, vocabularyTopic, word } from "../words.ts";

const applying = vocabularyTopic({
  id: "b1-words-applying",
  title: t("Applying for a Job", "求职"),
  summary: t(
    "Applying and applications; candidates, employers and employees; qualifications and references; positions, vacancies and advertisements; contracts and what a job requires.",
    "申请和申请书；候选人、雇主和雇员；资格和推荐信；职位、空缺和广告；合同和工作要求。",
  ),
  intro: t(
    "To get a job, a **candidate** sends an **application** with a **reference** and copies of each **qualification** to the **employer**. These words help you look for work and talk about getting a job.",
    "找工作时，**candidate**（应聘者）要把 **application**（申请书）、一封 **reference**（推荐信）和每份 **qualification**（资格证书）的复印件寄给 **employer**（雇主）。这些词帮你找工作、谈论求职。",
  ),
  prerequisites: ["a2-words-work-life"],
  words: [
    word(
      "apply applies applied applying",
      "to ask in writing for a job, a place at a school or something similar",
      "申请",
      "I'm going to {apply} for a job at the new hotel: I'll write to them today. | She {applied} to three universities, asking each one for a place.|traveled moved | How many people are {applying} for the position by sending in a form?",
      "wait train",
    ),
    word(
      "application applications",
      "a written request for a job or a place at a school",
      "申请；申请书",
      "Please send your {application}, the form asking for the job, before the first of May.|candidate employer | I filled in an {application} form online.|employer employee | We received over two hundred {applications} for the job.|vacancies employers",
      "candidate qualification",
    ),
    word(
      "candidate candidates",
      "a person who wants to get a job or to win an election",
      "候选人；应聘者",
      "Five {candidates} for the manager's job are coming in for interviews.|vacancies references | She was the best {candidate}, so we gave her the job.|vacancy contract | Each {candidate} will have an interview on Monday.|vacancy advertisement",
      "employer vacancy",
    ),
    word(
      "employer employers",
      "a person or company that pays people to work for them",
      "雇主",
      "The hospital is the biggest {employer} in the town: 3,000 people work there.|employee candidate | Ask your last {employer}, the company you worked for, for a reference.|employee candidate | {Employers} want to pay workers who can work in a team.|Employees Candidates",
      "employee candidate",
    ),
    word(
      "employee employees",
      "a person who is paid to work for a person or a company",
      "雇员；员工",
      "The company has 500 {employees}, and it pays them all every month.|employers candidates | Every new {employee} who joins the company gets a day of training.|employer candidate | She has been an {employee} of the bank for ten years.|employer advertisement",
      "employer candidate",
    ),
    word(
      "qualification qualifications",
      "an exam you have passed or a course you have finished, which shows that you can do a job",
      "资格；学历",
      "What {qualifications} do you need to be a nurse?|vacancies contracts | She passed her exams and now has a {qualification} in accounting.|vacancy contract | Without any {qualifications}, it's hard to find a good job.|advertisements vacancies",
      "reference application",
    ),
    word(
      "reference references",
      "a letter from someone who knows you, saying what you are like as a worker or a student",
      "推荐信；证明人",
      "My old teacher wrote me a {reference}.|position vacancy | The company asked for two {references}: letters from people who know my work.|vacancies positions | Can I give your name as a {reference}?|vacancy qualification",
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
      "There is a {vacancy} for a cook at the restaurant: nobody does the job now.|reference candidate | The hotel has no {vacancies}: every room is full.|references contracts | We put an advertisement for the {vacancy} online.|reference employee",
      "candidate reference",
      "position",
    ),
    word(
      "advertisement advertisements",
      "a notice in a newspaper, online or on TV that tells people about a job or a product",
      "广告",
      "In the newspaper, I read the {advertisement} that said the hotel needed a cook.|employee candidate | There are too many {advertisements} on TV.|applications contracts | The {advertisement} for the new phone was on every bus.|candidate reference",
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
  teaching: {
    watchOut: {
      complete: t(
        "*Apply* is followed by *for* the job and *to* the company: *apply for a job*, *apply to a university*. *Require* is followed by a thing or by *to*: *you are required to wear a helmet*. Look at the small word after the gap.",
        "*apply* 后面接 *for* 职位、接 *to* 公司：*apply for a job*、*apply to a university*。*require* 后面接名词或 *to*：*you are required to wear a helmet*。看空格后面的小词。",
      ),
      meaning: t(
        "An *employer* pays people to work, and an *employee* is paid to work; a *candidate* only wants the job. Check whether the meaning says who pays, who is paid, or who is hoping.",
        "*employer* 付钱雇人，*employee* 被雇拿工资；*candidate* 只是想得到这份工作。看释义说的是谁付钱、谁拿钱，还是谁在争取。",
      ),
      spell: t(
        "*Employer* and *employee* differ only at the end: *-er* for the one who pays, *-ee* for the one who is paid.",
        "*employer* 和 *employee* 只在词尾不同：付钱的一方是 *-er*，被雇的一方是 *-ee*。",
      ),
    },
    notes: `
      apply|a letter to a new hotel;three universities;forms for a position|to apply is to ask in writing for a job or a place; to require is to need|apply 是申请；require 是需要|wait=to wait for a job is to hope one comes, not to write and ask for it=wait for 是等着，不是写信申请;train=to train for a job is to learn to do it, not to write and ask for it=train for 是为工作接受培训，不是申请;traveled=to travel to a place is to go there, not to ask it for a place=travel 是去那里，不是申请;moved=to move to a place is to go and live there, not to ask it for a place=move 是搬去，不是申请|apply for a job · apply to a university|*applies*, *applied*: y becomes i|*applies*、*applied*：y 变 i
      application|a form sent before May;an online form;two hundred for one job|an application is a written request for a job; a candidate is the person who wants it|application 是申请书；candidate 是应聘者|candidate=a candidate is a person, not a form you send=candidate 是人，不是寄出的表格;employer/employee=an employer or an employee is a person, not a form you fill in=employer 和 employee 都是人，不是表格;vacancies=vacancies are jobs nobody is doing, not forms people send=vacancy 是空缺职位，不是申请书;employers=employers are the people who pay workers, not forms you receive=employer 是雇主，不是申请书|an application form · send an application|verb *apply* + *-cation*|动词 *apply* 变来
      candidate|interviews for a manager's job;the best person for the job;an interview on Monday|a candidate is a person who wants a job; a vacancy is the job itself|candidate 是应聘者；vacancy 是空缺职位|vacancies/vacancy=a vacancy is a job nobody is doing, not a person who wants it=vacancy 是空缺职位，不是人;references=references are letters about you, they do not come to interviews=reference 是推荐信，不来面试;contract=a contract is a paper you sign, not a person who gets a job=contract 是合同，不是人;advertisement=an advertisement is a notice, it does not have an interview=advertisement 是广告，不参加面试|the best candidate · a candidate for|also someone who wants to win an election|也指竞选的人
      employer|a hospital where 3,000 work;the company you worked for;paying workers who work in a team|an employer pays people to work; an employee is paid to work|employer 是雇主；employee 是雇员|employee/Employees=an employee is paid to work, not the one who pays=employee 是拿工资的人，不是付钱的人;candidate/Candidates=a candidate only hopes to get a job, not the one who pays workers=candidate 是应聘者，不是雇主|a big employer · your last employer|*-er*: the one who employs|*-er*：雇人的一方
      employee|500 paid every month;a day of training for a new one;ten years at a bank|an employee is paid to work; an employer pays people|employee 是雇员；employer 是雇主|employers/employer=an employer pays people, it is not paid by the company=employer 是付钱的一方，不是被公司付钱的人;candidates/candidate=a candidate only wants a job and has not joined yet=candidate 是应聘者，还没入职;advertisement=an advertisement is a notice, not a person who works at a bank=advertisement 是广告，不是员工|a new employee · an employee of|*-ee*: the one who is employed|*-ee*：被雇用的一方
      qualification|what a nurse needs;exams passed in accounting;finding a good job without any|a qualification shows you can do a job; a reference is a letter about you|qualification 是资格、学历；reference 是推荐信|vacancies/vacancy=a vacancy is a job nobody is doing, not something you get by passing exams=vacancy 是空缺职位，不是考试得来的;contracts/contract=a contract is a paper you sign with a company, not something you get by passing exams=contract 是合同，不是学历;advertisements=advertisements are notices, not something you need to find a job=advertisement 是广告，不是求职所需的资格|a qualification in · need qualifications|verb *qualify*|动词 *qualify*
      reference|a letter from an old teacher;letters from people who know my work;giving someone's name|a reference is a letter saying what you are like; a qualification shows you can do a job|reference 是推荐信；qualification 是资格|position/positions=a position is a job, not a letter about you=position 是职位，不是推荐信;vacancy/vacancies=a vacancy is a job nobody is doing, not a letter about you=vacancy 是空缺，不是推荐信;qualification=a qualification is an exam passed, not a person who speaks about you=qualification 是资格，不是证明人|write a reference · give a reference|verb *refer*|动词 *refer*
      position|a shop assistant job;a senior job in a bank;two jobs open in a sales team|a position is a job; a candidate is a person who wants a job|position 是职位；candidate 是应聘者|candidate=a candidate is a person, not the job you apply for=candidate 是人，不是职位;reference/references=a reference is a letter about you, not a job=reference 是推荐信，不是职位;vacancy=a vacancy is a job nobody does yet, so she cannot already have one=vacancy 是没人做的职位，她不可能已经占着;qualifications=qualifications are exams you passed, not jobs that are open=qualification 是资格，不是空缺|the position of · a senior position|also where something is|也指位置
      vacancy|a job for a cook nobody does;a full hotel;an advertisement online|a vacancy is a job nobody is doing; a candidate is a person who wants a job|vacancy 是空缺；candidate 是应聘者|reference/references=a reference is a letter about a worker, not a free job or room=reference 是推荐信，不是空缺;candidate=a candidate is a person who wants a job, not the empty job itself=candidate 是应聘者，不是空缺职位;contracts=contracts are papers people sign, not free rooms=contract 是合同，不是空房;employee=an employee already works there, it is not a job to fill=employee 是已入职的员工，不是空缺|no vacancies · a vacancy for|*vacant* means empty|*vacant* 是空的
      advertisement|a newspaper notice that a hotel needs a cook;too many on TV;a new phone on every bus|an advertisement tells people about a job or a product; an application is a request for a job|advertisement 是广告；application 是申请书|employee=an employee is a person who works, not something you read in a newspaper=employee 是员工，不是报上的启事;candidate=a candidate is a person, not a notice about a job or a product=candidate 是人，不是广告;applications=applications are forms people send, not notices on TV=application 是申请书，不是电视广告;contracts=contracts are papers people sign, not notices on TV=contract 是合同，不是广告;reference=a reference is a letter about a worker, not a notice on a bus=reference 是推荐信，不是公交车上的广告|an advertisement for · put an advertisement|short form *ad*|简写 *ad*
      contract|reading before signing;a one-year one with a company;new ones for two players|a contract is an agreement people sign; a reference is a letter about you|contract 是合同；reference 是推荐信|candidate/candidates=a candidate is a person, not a paper you sign=candidate 是人，不是要签的文件;vacancy/vacancies=a vacancy is a free job, not a paper you sign=vacancy 是空缺，不是合同;reference=a reference is a letter about you, not an agreement with a company=reference 是推荐信，不是和公司的协议|sign a contract · a one-year contract|noun stress on *CON*|名词重音在 *CON*
      require|good English for a job;helmets for all visitors;lots of water for a plant|to require is to need; to apply is to ask for a job|require 是需要、要求；apply 是申请|applies/applied=to apply is to ask for a job, not to need something=apply 是申请，不是需要;employs/employed=to employ is to pay someone to work, not to need something=employ 是雇用，不是需要|be required to · require good English|noun *requirement*|名词 *requirement*
    `,
  },
});

const workplace = vocabularyTopic({
  id: "b1-words-workplace",
  title: t("The Workplace", "工作场所"),
  summary: t(
    "Departments, clients and tasks; schedules, reports and shifts; overtime, the workplace and its equipment; headquarters, agendas and conferences.",
    "部门、客户和任务；日程、报告和轮班；加班、工作场所和设备；总部、议程和会议。",
  ),
  intro: t(
    "In a big **workplace**, each **department** has its own **tasks**, and every worker works a **shift** or follows a **schedule**. These words help you talk about how a day at work is organized.",
    "在一个大的 **workplace**（工作场所）里，每个 **department**（部门）有自己的 **tasks**（任务），每位员工上一个 **shift**（班次）或按 **schedule**（日程）工作。这些词帮你谈论一天的工作怎样安排。",
  ),
  prerequisites: ["b1-words-applying"],
  words: [
    word(
      "department departments",
      "one part of a large company, a shop or a school",
      "部门",
      "She works in the sales {department}. | The children's clothes are in the next {department}. | The marketing {department} has its offices on the third floor.",
      "agenda conference",
    ),
    word(
      "client clients",
      "a person who pays a company or a professional for a service",
      "客户",
      "The lawyer is meeting a {client} at ten. | We have {clients} all over the world. | Always be polite to {clients}.",
      "task shift",
    ),
    word(
      "task tasks",
      "a piece of work that you must do",
      "任务",
      "My first {task} every morning is to check my email. | Cleaning the kitchen is not an easy {task}. | She gave each of us three {tasks}: wash, dry and put away the plates.|shifts clients",
      "shift client",
    ),
    word(
      "schedule schedules",
      "a plan that lists when things will happen",
      "日程；时间表",
      "I have a meeting every day this week: my {schedule} is very full. | The train is running on {schedule} and will arrive at 9:05 as planned.|overtime equipment | Let's check our {schedules} and find a day to meet.|departments headquarters",
      "report department",
      "agenda",
    ),
    word(
      "report reports reported reporting",
      "a piece of writing about a subject; to tell someone about something that has happened",
      "报告；汇报",
      "I have to write a {report} on the meeting.|shift client | Please {report} any problems to your manager by telling her at once.|shift schedule | She {reported} the accident to the police.|shifted scheduled",
      "shift task",
    ),
    word(
      "shift shifts",
      "a period of time in which a group of people work, such as at night",
      "轮班；班次",
      "My dad works the night {shift} at the hospital.|agenda client | Nurses often work twelve-hour {shifts}.|agendas clients | My {shift} at the hospital starts at six in the morning and lasts eight hours.|agenda client",
      "task overtime",
    ),
    word(
      "overtime",
      "extra hours that you work after your usual time",
      "加班",
      "I worked {overtime} every day this week to finish the project.|equipment headquarters | Do you get paid for {overtime}, the extra hours after work?|equipment agenda | No more {overtime}! I want to see my family.|equipment headquarters",
      "shift equipment",
    ),
    word(
      "workplace workplaces",
      "the place where you work",
      "工作场所",
      "Smoking is not allowed in the {workplace}.|agenda overtime | A friendly {workplace} makes people happy to go to work every day.|agenda schedule | Many {workplaces} now have a quiet room.|agendas tasks",
      "department equipment",
    ),
    word(
      "equipment",
      "the machines and tools you need for a job or an activity",
      "设备；器材",
      "The hospital needs new {equipment}, such as beds and machines.|overtime agenda | Bring your own sports {equipment}.|agenda overtime | All the office {equipment} is new: computers, printers and phones.|agenda overtime",
      "overtime headquarters",
    ),
    word(
      "headquarters",
      "the main office of a company or an organization",
      "总部",
      "The company's {headquarters}, its main office, is in Shanghai.|overtime equipment | She works at the bank's {headquarters} in London.|overtime agenda | They're moving their {headquarters} to a bigger building.|overtime agenda",
      "department workplace",
    ),
    word(
      "agenda agendas",
      "a list of things to talk about at a meeting",
      "议程",
      "What's on the {agenda} for today's meeting?|equipment overtime | The first point on the {agenda} is the new budget.|equipment headquarters | Please send the {agenda}, the list of points to discuss, before the meeting.|equipment overtime",
      "conference report",
      "schedule",
    ),
    word(
      "conference conferences",
      "a large meeting where people talk about a subject, often for several days",
      "会议；大会",
      "She's speaking at a science {conference} in Tokyo.|overtime equipment | The {conference} brings together 2,000 doctors.|overtime equipment | Big meetings happen in the {conference} room on the second floor.|overtime equipment",
      "agenda department",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Equipment* and *overtime* have no plural and no *a*: say *new equipment*, *work overtime*. *Headquarters* always ends in *-s*, even for one office. Look at whether the gap needs a plural.",
        "*equipment* 和 *overtime* 没有复数，前面不用 *a*：*new equipment*、*work overtime*。*headquarters* 总以 *-s* 结尾，一个总部也这样。看空格需不需要复数。",
      ),
      meaning: t(
        "A *schedule* plans when things happen, while an *agenda* lists what to talk about at one meeting. Check whether the meaning is about times or about points to discuss.",
        "*schedule* 安排事情什么时候发生，*agenda* 列出一次会议要讨论的事项。看释义说的是时间还是讨论要点。",
      ),
      spell: t(
        "*Schedule* has a silent *h* after *sc*; *conference* has *-ence* at the end, not *-ance*.",
        "*schedule* 里 *sc* 后面的 *h* 不发音；*conference* 结尾是 *-ence*，不是 *-ance*。",
      ),
    },
    notes: `
      department|sales;children's clothes in a shop;marketing offices|a department is one part of a company or a shop; a conference is a large meeting|department 是部门；conference 是大会|agenda=an agenda is a list of points for a meeting, not a part of a company where people work=agenda 是会议议程，不是公司的部门;conference=a conference is a large meeting, not a part of a shop or a company with offices=conference 是大会，不是商店或公司的部门|the sales department · a department store|*depart* + *-ment*|*depart* 加 *-ment*
      client|a lawyer's meeting;people all over the world;being polite|a client pays for a service; a task is a piece of work|client 是客户；task 是任务|task/tasks=a task is a piece of work, not a person who pays for a service=task 是任务，不是付钱的客户;shift/shifts=a shift is a period of work, not a person you meet or are polite to=shift 是班次，不是客户|meet a client · our clients|for services; *customer* for shops|服务业用 *client*；商店用 *customer*
      task|checking email first;cleaning the kitchen;washing and drying plates|a task is a piece of work you must do; a shift is a period of time at work|task 是任务；shift 是班次|shift/shifts=a shift is a period of time at work, not a piece of work you must do=shift 是一段上班时间，不是具体的活儿;client/clients=a client is a person who pays for a service, not a piece of work=client 是客户，不是任务|an easy task · my first task|*ask* inside *task*|*task* 里有 *ask*
      schedule|a meeting every day;a train on time;finding a day to meet|a schedule lists when things will happen; an agenda lists points for one meeting|schedule 是日程、时间表；agenda 是议程|report=a report is a piece of writing, it does not get full of meetings=report 是报告，不会被会议排满;department=a department is a part of a company, not a list of meetings this week=department 是部门，不是本周日程;overtime=overtime is extra hours of work, a train does not run on it=overtime 是加班，火车不按它运行;equipment=equipment is machines and tools, it does not say when a train arrives=equipment 是设备，不是时刻表;departments=departments are parts of a company, not plans you check to find a day=department 是部门，不是日程;headquarters=headquarters is a main office, not a plan you check to find a day=headquarters 是总部，不是日程|on schedule · a busy schedule|silent *h* after *sc*|*sc* 后的 *h* 不发音
      report|writing about a meeting;telling a manager about problems;telling the police about an accident|to report is to tell someone what happened; a shift is a period at work|report 是报告、汇报；shift 是班次|shift=to shift is to move something, not to write about a meeting or tell a manager=shift 是移动，不是汇报;client=a client is a person who pays, not a piece of writing about a meeting=client 是客户，不是报告;schedule=to schedule is to plan a time, not to tell a manager what went wrong=schedule 是安排时间，不是汇报;shifted=to shift is to move something, not to tell the police=shift 是移动，不是报警;scheduled=to schedule is to plan a time, not to tell the police about an accident=schedule 是安排时间，不是报警|write a report · report to|noun and verb|既是名词也是动词
      shift|nights at a hospital;twelve hours for nurses;eight hours starting at six|a shift is a period of time when a group works; a task is one piece of work|shift 是轮班、班次；task 是任务|agenda/agendas=an agenda is a list of points for a meeting, not hours you work=agenda 是议程，不是上班时段;client/clients=a client is a person who pays, not a period of work=client 是客户，不是班次;equipment=equipment is tools, not a period that starts at six=equipment 是设备，不是班次|the night shift · work shifts|also a verb: to move|也是动词：移动
      overtime|extra hours to finish a project;pay for extra hours;time with family|overtime is extra hours after your usual time; a shift is your usual period of work|overtime 是加班；shift 是班次|equipment=equipment is tools and machines, not extra hours of work=equipment 是设备，不是加班;headquarters=headquarters is a main office, not hours you work=headquarters 是总部，不是加班;agenda=an agenda is a list of points for a meeting, not extra hours=agenda 是议程，不是加班|work overtime · paid overtime|*over* + *time*: time over the usual|*over* 加 *time*：超出平常的时间
      workplace|no smoking;happy to go to work;quiet rooms|a workplace is where you work; a department is one part of a company|workplace 是工作场所；department 是部门|agenda/agendas=an agenda is a list of points for a meeting, not a place where people work=agenda 是议程，不是工作场所;overtime=overtime is extra hours, not a place where smoking is banned=overtime 是加班，不是场所;schedule=a schedule is a plan of times, not a place people go to every day=schedule 是日程，不是场所;tasks=tasks are pieces of work, not places with quiet rooms=task 是任务，不是场所|in the workplace · a safe workplace|*work* + *place*: one word|*work* 加 *place*，连写
      equipment|beds and machines in a hospital;sports things to bring;computers and printers|equipment is the machines and tools for a job; overtime is extra hours|equipment 是设备、器材；overtime 是加班|overtime=overtime is extra hours of work, not beds or machines=overtime 是加班，不是设备;agenda=an agenda is a list of points for a meeting, not computers or sports things=agenda 是议程，不是器材;headquarters=headquarters is a main office, not things you bring=headquarters 是总部，不是器材|sports equipment · office equipment|no plural: *two pieces of equipment*|没有复数：*two pieces of equipment*
      headquarters|a main office in Shanghai;a bank in London;moving to a bigger building|headquarters is the main office; a department is one part of a company|headquarters 是总部；department 是部门|overtime=overtime is extra hours of work, not an office where people work=overtime 是加班，不是办公地点;equipment=equipment is machines and tools, not the main office=equipment 是设备，不是总部;agenda=an agenda is a list for a meeting, not a building=agenda 是议程，不是大楼|the company's headquarters · move headquarters|always ends in *-s*|总以 *-s* 结尾
      agenda|today's meeting;the new budget first;points to discuss|an agenda is a list of points for a meeting; a schedule says when things happen|agenda 是议程；schedule 是日程|equipment=equipment is tools and machines, not a list of points for a meeting=equipment 是设备，不是议程;overtime=overtime is extra hours of work, not a list of points to discuss=overtime 是加班，不是议程;headquarters=headquarters is a main office, it does not have points in order=headquarters 是总部，没有议题顺序|on the agenda · send the agenda|plural *agendas*|复数 *agendas*
      conference|science in Tokyo;2,000 doctors together;a room for big meetings|a conference is a large meeting, often over days; an agenda is a list of points|conference 是大会、会议；agenda 是议程|overtime=overtime is extra hours of work, not an event where people speak=overtime 是加班，不是大会;equipment=equipment is tools, not an event that brings doctors together=equipment 是设备，不是会议|a conference room · speak at a conference|*-ence*, not *-ance*|结尾是 *-ence*，不是 *-ance*
    `,
  },
});

const business = vocabularyTopic({
  id: "b1-words-business",
  title: t("Business", "商业"),
  summary: t(
    "Business and industry; products and services; trade, profit and loss; income, tax and budgets; investing and brands.",
    "商业和工业；产品和服务；贸易、利润和亏损；收入、税和预算；投资和品牌。",
  ),
  intro: t(
    "A **business** sells a **product** or a **service**, pays **tax** on its **income**, and hopes to make a **profit**, not a **loss**. These words help you talk about how companies make and spend money.",
    "一家 **business**（企业）出售 **product**（产品）或 **service**（服务），为 **income**（收入）缴 **tax**（税），希望获得 **profit**（利润）而不是 **loss**（亏损）。这些词帮你谈论公司怎样赚钱、花钱。",
  ),
  prerequisites: ["b1-words-workplace"],
  words: [
    word(
      "business businesses",
      "the work of buying and selling; a company",
      "商业；企业",
      "My aunt runs a small {business}: she sells cakes from her shop.|profit tax | Is your trip for {business} or pleasure?|industry brand | Many {businesses} closed during the storm.|profits taxes",
      "industry brand",
    ),
    word(
      "industry industries",
      "the businesses that make one kind of thing, or that make things in factories",
      "工业；行业",
      "The car {industry} employs thousands of people.|profit budget | Tourism is the biggest {industry} on the island: most people work in hotels.|budget tax | New {industries}, with factories making cars and phones, are growing in the area.|budgets incomes",
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
      "{Trade}, the buying and selling of goods between the two countries, has grown.|Brand Profit | The city grew rich from the silk {trade}.|budget income | The two boys {traded} stickers at lunch.|invested budgeted",
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
      "The company made a {loss} this year, so nobody got a bonus.|profit brand | The {loss} of his job, when the factory closed, was a shock.|profit income | The storm caused heavy {losses} to farmers.|profits brands",
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
      "My uncle {invested} his savings in a new restaurant, hoping to get more back later.|traded budgeted | It's wise to {invest} in your education.|trade budget | The city is {investing} in new bus lanes.|trading budgeting",
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
  teaching: {
    watchOut: {
      complete: t(
        "*Make* goes with *a profit* and *a loss*; *pay* goes with *tax*; *invest* is followed by *in*. Look at the verb before the gap or the small word after it.",
        "*make* 和 *a profit*、*a loss* 搭配；*pay* 和 *tax* 搭配；*invest* 后面接 *in*。看空格前的动词或空格后的小词。",
      ),
      meaning: t(
        "*Income* is all the money that comes in, while *profit* is what is left after a business has paid its costs. Check whether the meaning takes the costs away.",
        "*income* 是进来的全部钱，*profit* 是企业付完成本后剩下的钱。看释义有没有减去成本。",
      ),
      spell: t(
        "*Business* has an *i* you don't hear: *bus-i-ness*. *Industry* ends in *-y*, which becomes *-ies* in the plural.",
        "*business* 中间有一个不发音的 *i*：*bus-i-ness*。*industry* 结尾的 *-y* 复数变 *-ies*。",
      ),
    },
    notes: `
      business|an aunt's cake shop;a trip for work;companies closed by a storm|a business is a company or the work of buying and selling; an industry is all the businesses of one kind|business 是企业、商业；industry 是行业|profit/profits=a profit is money a business makes, not a company you run=profit 是利润，不是你经营的公司;tax/taxes=a tax is money paid to the government, not a company=tax 是税，不是公司;industry=an industry is all the businesses of one kind, not the reason for one trip=industry 是整个行业，不是出行目的;brand=a brand is the name of a product, not the reason for a trip=brand 是品牌，不是出行目的|run a business · on business|silent *i*: *bus-i-ness*|不发音的 *i*：*bus-i-ness*
      industry|cars and thousands of jobs;tourism and hotels;factories making phones|an industry is the businesses that make one kind of thing; a business is one company|industry 是工业、行业；business 是一家企业|profit=a profit is money a business makes, it does not employ people=profit 是利润，不雇人;budget/budgets=a budget is money to spend, not businesses where people work=budget 是预算，不是行业;tax=a tax is paid to the government, people do not work in it=tax 是税，人们不在其中工作;incomes=incomes are money people get, not businesses with factories=income 是收入，不是有工厂的行业|the car industry · heavy industry|plural *industries*|复数 *industries*
      product|local things sold in a shop;something new in shops;milk and cheese|a product is a thing made to be sold; a service is work done for people|product 是产品；service 是服务|taxes=taxes are money paid to the government, not things a shop sells=tax 是税，不是商品;losses=losses are money a business loses, not things in a shop=loss 是亏损，不是商品;service/services=a service is work done for people, not a thing you can put in shops or eat=service 是服务，不是能摆上货架或吃的东西;income/incomes=income is money you get, not a thing made to be sold=income 是收入，不是产品|a new product · dairy products|verb *produce*|动词 *produce*
      service|slow waiters;buses until midnight;advice from a bank|a service is work a company does for people; a product is a thing it makes|service 是服务；product 是产品|product=a product is a thing that is made, not work done for people=product 是产品，不是服务;brand=a brand is the name of a product, it is not slow or fast=brand 是品牌，没有快慢;tax=a tax is money paid to the government, not buses that run=tax 是税，不是公交服务;taxes=taxes are paid to the government, not things a bank offers=tax 是税，不是银行的业务;profits=profits are money a business makes, not help it gives people=profit 是利润，不是提供的服务|good service · a bus service|verb *serve*|动词 *serve*
      trade|buying and selling between countries;silk;stickers at lunch|trade is buying and selling, or exchanging; to invest is to put money in to get more back|trade 是贸易、交换；invest 是投资|Brand=a brand is the name of a product, not the buying and selling between countries=brand 是品牌，不是国家间的买卖;Profit=profit is money one business makes, not buying and selling between countries=profit 是利润，不是贸易;budget=a budget is money to spend, a city does not grow rich from it=budget 是预算，城市不会靠它致富;income=income is money you get, not the buying and selling of silk=income 是收入，不是丝绸贸易;invested=to invest is to put money in to get more back, not to swap stickers=invest 是投资，不是交换贴纸;budgeted=to budget is to plan spending, not to swap stickers=budget 是做预算，不是交换|the silk trade · trade with|noun and verb|既是名词也是动词
      profit|5,000 yuan last month;selling a car for more;a rise of ten percent|a profit is money made after costs are paid; income is all the money that comes in|profit 是利润；income 是收入|brand/brands=a brand is the name of a product, not money a shop makes=brand 是品牌，不是赚的钱;budget=a budget is money to spend, not money you make from selling=budget 是预算，不是利润;service/services=a service is work done for people, not money made after costs=service 是服务，不是利润|make a profit · at a profit|opposite of *loss*|反义词 *loss*
      loss|no bonus this year;losing a job when a factory closed;farmers after a storm|a loss is money a business loses, or losing something; a profit is money it makes|loss 是亏损、损失；profit 是利润|profit/profits=a profit is money made, so it would not stop a bonus or hurt farmers=profit 是赚的钱，不会让人拿不到奖金或让农民受损;brand/brands=a brand is the name of a product, not money a business loses=brand 是品牌，不是亏损;income=income is money you get, not losing your job=income 是收入，不是失业|make a loss · heavy losses|verb *lose*|动词 *lose*
      income|half on rent;families with little money;double after changing jobs|income is money you get from work; tax is money you pay to the government|income 是收入；tax 是税|tax/taxes=tax is money you pay to the government, not money you get from work=tax 是要交的税，不是收入;brand=a brand is the name of a product, not money you get=brand 是品牌，不是收入;products/product=products are things made to be sold, not money you get from work=product 是产品，不是收入|a low income · income tax|*in* + *come*: money coming in|*in* 加 *come*：进来的钱
      tax|included in a price;paid by everyone who works;raised on cigarettes|tax is money you must pay to the government; income is money you get|tax 是税；income 是收入|income/incomes=income is money you get, not money you pay to the government=income 是收入，不是交给政府的税;brand/brands=a brand is the name of a product, not money paid to the government=brand 是品牌，不是税|pay tax · tax on cigarettes|plural *taxes*|复数 *taxes*
      budget|not eating out;money for school books;each department's plan for the year|a budget is the money you have to spend and a plan for it; tax is money you pay to the government|budget 是预算；tax 是税|brand=a brand is the name of a product, not money you plan to spend=brand 是品牌，不是预算;tax=tax is money you pay to the government, not money you have to spend=tax 是交给政府的钱，不是可支配的预算;product=a product is a thing made to be sold, not money you plan to spend=product 是产品，不是预算|on a tight budget · a budget for|also a verb: to plan spending|也是动词：做预算
      invest|savings in a restaurant;time in education;a city and new bus lanes|to invest is to put money or time in to get more back; to trade is to buy and sell|invest 是投资；trade 是贸易、交换|traded/trade/trading=to trade is to buy and sell or swap, not to put money in to get more back later=trade 是买卖、交换，不是投资;budgeted/budget/budgeting=to budget is to plan how to spend money, not to put it into something to get more back=budget 是规划开支，不是投资|invest in · invest money|noun *investment*|名词 *investment*
      brand|phones;a favorite tea;expensive shoes|a brand is the name of a product made by one company; a product is the thing itself|brand 是品牌；product 是产品本身|service/services=a service is work done for people, not the name of a phone or a tea=service 是服务，不是手机或茶叶的牌子;budget/budgets=a budget is money to spend, not the name of a product=budget 是预算，不是品牌;tax=a tax is money paid to the government, not a name on a tea=tax 是税，不是茶叶的牌子|a brand of · a famous brand|*brand-new*: completely new|*brand-new*：全新的
    `,
  },
});

const workVerbs = vocabularyTopic({
  id: "b1-words-work-verbs",
  title: t("Getting Things Done", "把事情做好"),
  summary: t(
    "Managing and employing; retiring, resigning and being promoted; leading, dealing and handling; arranging, attending, completing and preparing.",
    "管理和雇用；退休、辞职和晋升；领导、应对和处理；安排、出席、完成和准备。",
  ),
  intro: t(
    "At work you may **manage** a team, **handle** a problem, **arrange** a meeting and **attend** it, and one day be **promoted** or **retire**. These words help you talk about what people do in their jobs.",
    "工作中你可能要 **manage**（管理）一个团队、**handle**（处理）问题、**arrange**（安排）会议并 **attend**（出席），有一天还会被 **promoted**（提升）或 **retire**（退休）。这些词帮你谈论人们在工作中做什么。",
  ),
  prerequisites: ["b1-words-workplace"],
  words: [
    word(
      "manage manages managed managing",
      "to be in charge of a business or a group of people; to succeed in doing something difficult",
      "管理；设法做到",
      "She {manages} a team of ten people and tells them what to do each day.|promotes attends | The homework was very hard, but she {managed} to finish it in the end.|arranged prepared | He {managed} the hotel for twenty years.|promoted attended",
      "promote attend",
      "handle",
    ),
    word(
      "employ employs employed employing",
      "to pay someone to work for you",
      "雇用",
      "The factory {employs} 300 workers.|attends arranges | She is {employed} as a teacher at a language school, which pays her well.|promoted retired | The shop {employed} two new assistants.|attended arranged",
      "attend arrange",
    ),
    word(
      "retire retires retired retiring",
      "to stop working, usually because you are old",
      "退休",
      "My grandfather {retired} at sixty-five and stopped working for good.|graduated moved | When I {retire} and stop working, I want to travel. | She's {retiring} next year after forty years at the bank, and then she'll stop working.|graduating moving",
      "graduate move",
      "resign",
    ),
    word(
      "resign resigns resigned resigning",
      "to say officially that you are leaving your job",
      "辞职",
      "He {resigned} at the age of 30 and left his job because he didn't like his new boss.|retired graduated | The young minister {resigned} after the scandal and left the government.|retired graduated | I'm only 28, but I'm going to {resign}, leave this company and start my own business.",
      "retire graduate",
      "retire",
    ),
    word(
      "promote promotes promoted promoting",
      "to give someone a more important job",
      "提升；晋升",
      "After two years in the job, she was {promoted} and given a more important job.|employed trained | If you work hard here, they'll {promote} you and give you a more important job. | He has worked here for five years, and he hopes to be {promoted} soon and get a bigger job.|employed trained",
      "employ train",
    ),
    word(
      "lead leads led leading",
      "to be in charge of a group; to go first and show the way",
      "领导；带领",
      "As captain, she {led} the team to victory.|followed sent | Who will {lead} the walk tomorrow and go first to show us the way?|follow join | The guide {leads} the tourists through the old town, walking in front.|follows sends",
      "follow send",
    ),
    word(
      "deal deals dealt dealing",
      "to do what is needed about a problem or a person (deal with)",
      "处理；应付",
      "I'll {deal} with the problem tomorrow and find a way to fix it. | She {dealt} with the angry customer very well.|agreed played | How do you {deal} with stress?",
      "agree play",
      "handle",
    ),
    word(
      "handle handles handled handling",
      "to deal with a situation, a person or a job",
      "处理；对付",
      "She {handled} the problem calmly and solved it.|attended ignored | Can you {handle} this work on your own and get it done? | He {handles} all the money for the club: he pays the bills and keeps the accounts.|attends ignores",
      "attend ignore",
      "deal manage",
    ),
    word(
      "arrange arranges arranged arranging",
      "to plan something or make the plans for it",
      "安排",
      "I've {arranged} a meeting with the manager for next Monday.|attended completed | Can you {arrange} a taxi to the airport? | She {arranged} the flowers in a vase.|attended completed",
      "attend complete",
    ),
    word(
      "attend attends attended attending",
      "to go to an event, a school or a meeting",
      "出席；参加；上（学）",
      "Over 200 people {attended} the conference.|promoted employed | Which school does your son {attend}?|arrange employ | Please {attend} all your classes and don't stay at home.|arrange complete",
      "promote employ",
    ),
    word(
      "complete completes completed completing",
      "to finish doing or making something",
      "完成",
      "Please {complete} the form in black ink. | The new bridge will be {completed} next year.|attended arranged | She {completed} her studies in 2020 and got her degree.|attended arranged",
      "attend arrange",
    ),
    word(
      "prepare prepares prepared preparing",
      "to make something or someone ready",
      "准备",
      "I need to {prepare} for my interview by reading about the company.|arrange wait | Dad is {preparing} dinner in the kitchen.|completing attending | She {prepared} a short speech for the party.|attended employed",
      "complete attend",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Deal* is followed by *with*: *deal with a problem*. *Manage* is followed by *to* when it means succeed: *manage to finish*. *Promote* and *employ* often come after *be*: *she was promoted*. Look at the small words around the gap.",
        "*deal* 后面接 *with*：*deal with a problem*。*manage* 表示设法做成时后接 *to*：*manage to finish*。*promote* 和 *employ* 常用在 *be* 后面：*she was promoted*。看空格前后的小词。",
      ),
      meaning: t(
        "You *retire* because you are old and stop working for good, but you *resign* to leave one job, at any age. Check whether the meaning talks about age.",
        "*retire* 是因为年纪大而彻底不再工作，*resign* 是辞去某份工作，什么年纪都可以。看释义有没有提到年龄。",
      ),
      spell: t(
        "*Lead* and *deal* change in the past: *led*, *dealt*. *Manage*, *arrange* and *prepare* drop the *e* before *-ing*: *managing*, *arranging*, *preparing*.",
        "*lead* 和 *deal* 的过去式不规则：*led*、*dealt*。*manage*、*arrange*、*prepare* 加 *-ing* 时去掉 *e*：*managing*、*arranging*、*preparing*。",
      ),
    },
    notes: `
      manage|a team of ten;hard homework finished;a hotel for twenty years|to manage is to be in charge, or to succeed in doing something hard; to attend is to go to an event|manage 是管理、设法做成；attend 是出席|promote/promotes/promoted=to promote is to give someone a better job, not to be in charge of a team or a hotel=promote 是提拔，不是管理团队或酒店;attend/attends/attended=to attend is to go to an event, not to be in charge of a team or a hotel=attend 是出席，不是管理;arranged=to arrange to do something is to plan it, not to succeed in doing it=arrange 是安排，不是设法做成;prepared=to be prepared to do something is to be ready, not to succeed in doing it=prepare 是准备，不是做成|manage a team · manage to do|noun *manager*|名词 *manager*
      employ|300 factory workers;a teacher paid well;two new shop assistants|to employ is to pay someone to work for you; to retire is to stop working|employ 是雇用；retire 是退休|attend/attends/attended=to attend is to go to an event, not to pay people to work=attend 是出席，不是雇用;arrange/arranges/arranged=to arrange is to plan something, not to pay people to work=arrange 是安排，不是雇用;promoted=to be promoted is to get a better job, not to be paid as a teacher=promote 是被提拔，不是被雇用;retired=to be retired is to have stopped working, so a school does not pay you=retire 是已退休，学校不再付钱|employ workers · be employed as|nouns *employer*, *employee*|名词 *employer*、*employee*
      retire|stopping at sixty-five;stopping work and traveling;forty years at a bank|to retire is to stop working because you are old; to resign is to leave one job|retire 是退休；resign 是辞职|graduate/graduated/graduating=to graduate is to finish school or university, not to stop working for good=graduate 是毕业，不是彻底停止工作;move/moved/moving=to move is to go and live somewhere else, not to stop working=move 是搬家，不是退休|retire at sixty · retire from|noun *retirement*|名词 *retirement*
      resign|leaving at 30 because of a boss;a young minister after a scandal;starting a business at 28|to resign is to leave your job officially; to retire is to stop working because you are old|resign 是辞职；retire 是退休|retire/retired=to retire is to stop working because you are old, not to leave a job at 28 or 30=retire 是因年老退休，不是二三十岁辞职;graduate/graduated=to graduate is to finish school, not to leave a job or the government=graduate 是毕业，不是辞职|resign from · resign as|the *g* is silent|*g* 不发音
      promote|a more important job after two years;working hard here;five years and a bigger job|to promote is to give someone a more important job; to employ is to give someone a job|promote 是提升；employ 是雇用|employ/employed=to employ is to give someone a job at the start, not a more important one later=employ 是雇用，不是提拔;train/trained=to train someone is to teach them a skill, not to give them a more important job=train 是培训，不是提拔|be promoted to · get promoted|noun *promotion*|名词 *promotion*
      lead|a captain and a team;going first on a walk;a guide in front|to lead is to be in charge or go first; to follow is to go after|lead 是带领；follow 是跟随|followed/follow/follows=to follow is to go after someone, not to be in front or in charge=follow 是跟在后面，不是带头;sent/sends=to send is to make someone go somewhere, not to go first yourself=send 是派去，不是自己带路;join=to join a walk is to go with the others, not to go first=join 是参加，不是带头|lead a team · lead the way|past *led*|过去式 *led*
      deal|a problem fixed tomorrow;an angry customer;stress|to deal with is to do what is needed about a problem; to agree with is to have the same opinion|deal with 是处理；agree with 是同意|agree/agreed=to agree with is to have the same opinion, not to do something about a problem=agree with 是同意，不是处理;play/played=to play with is to have fun with, not to do something about a problem=play with 是玩，不是处理|deal with · deal with stress|past *dealt*|过去式 *dealt*
      handle|a problem solved calmly;work done alone;bills paid for a club|to handle is to deal with a situation or a job; to attend is to go to an event|handle 是处理；attend 是出席|attended/attend/attends=to attend is to go to an event, not to deal with a problem or money=attend 是出席，不是处理;ignored/ignore/ignores=to ignore is to pay no attention, not to deal with something and solve it=ignore 是不理会，不是处理|handle a problem · handle money|noun *handle*: the part you hold|名词 *handle*：把手
      arrange|a meeting next Monday;a taxi to the airport;flowers in a vase|to arrange is to plan something or put it in order; to attend is to go to it|arrange 是安排；attend 是出席|attended/attend=to attend is to go to an event, not to plan something or put it in order=attend 是出席，不是安排;completed/complete=to complete is to finish something, not to plan it or put it in order=complete 是完成，不是安排|arrange a meeting · arrange flowers|noun *arrangement*|名词 *arrangement*
      attend|200 people at a conference;a son's school;classes instead of staying home|to attend is to go to an event or a school; to arrange is to plan it|attend 是出席、上学；arrange 是安排|promoted=to promote is to give a better job, not to go to a conference=promote 是提拔，不是出席;employed=to employ is to pay people to work, not to go to a conference=employ 是雇用，不是出席;arrange=to arrange is to plan something, not to go to it=arrange 是安排，不是去参加;employ=to employ is to pay someone to work, a son does not employ a school=employ 是雇用，不是上学;complete=to complete is to finish something, not to go to classes instead of staying home=complete 是完成，不是去上课|attend a meeting · attend school|no *to*: *attend the meeting*|不加 *to*：*attend the meeting*
      complete|a form in black ink;a bridge next year;studies and a degree|to complete is to finish; to attend is to go to something|complete 是完成；attend 是出席|attend/attended=to attend is to go to something, not to finish it=attend 是出席，不是完成;arrange/arranged=to arrange is to plan something, not to finish it=arrange 是安排，不是完成|complete a form · be completed|adjective *complete*: whole|形容词 *complete*：完整的
      prepare|reading before an interview;dinner in the kitchen;a short speech|to prepare is to make something or someone ready; to complete is to finish|prepare 是准备；complete 是完成|arrange=to arrange for something is to plan it for others, not to get yourself ready by reading=arrange 是安排，不是自己做准备;wait=to wait for an interview is to stay until it starts, not to get ready by reading=wait 是等待，不是准备;completing=to complete is to finish, not to make dinner=complete 是完成，不是做饭;attending=to attend is to go to an event, not to make dinner=attend 是出席，不是做饭;attended=to attend is to go to an event, not to write a speech for it=attend 是出席，不是准备讲稿;employed=to employ is to pay someone to work, not to write a speech=employ 是雇用，不是准备讲稿|prepare for · prepare dinner|noun *preparation*|名词 *preparation*
    `,
  },
});

const professions = vocabularyTopic({
  id: "b1-words-jobs-3",
  title: t("Professions", "职业"),
  summary: t(
    "Accountants, lawyers and journalists; architects, designers and programmers; secretaries and receptionists; electricians, plumbers, pharmacists and assistants.",
    "会计、律师和记者；建筑师、设计师和程序员；秘书和接待员；电工、水管工、药剂师和助理。",
  ),
  intro: t(
    "An **accountant** checks money, a **lawyer** speaks in court, a **journalist** writes the news, and an **architect** designs buildings. These words help you name more jobs and say what people do in them.",
    "**accountant**（会计）核对账目，**lawyer**（律师）在法庭上发言，**journalist**（记者）写新闻，**architect**（建筑师）设计房子。这些词帮你说出更多职业，以及人们在这些岗位上做什么。",
  ),
  prerequisites: ["a2-words-jobs-2"],
  words: [
    word(
      "accountant accountants",
      "a person whose job is to keep or check the money records of a business",
      "会计",
      "Our {accountant} helps us pay the right amount of tax.|plumber receptionist | She studied math and now works as our {accountant}, checking the money records.|plumber designer | The {accountants} found a mistake in the budget.|plumbers receptionists",
      "lawyer secretary",
    ),
    word(
      "lawyer lawyers",
      "a person whose job is to give advice about the law and to speak for people in court",
      "律师",
      "You should talk to a {lawyer} before you sign the contract.|plumber designer | The {lawyer} spoke for her in court.|pharmacist plumber | She's a {lawyer} who helps people in trouble with the law.|plumber designer",
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
  teaching: {
    watchOut: {
      complete: t(
        "Most of these jobs end in a person ending: *-er*, *-ist*, *-ian* or *-ant*. Look for *a* or *an* and for the work described around the gap.",
        "这些职业大多以表示人的词尾结束：*-er*、*-ist*、*-ian* 或 *-ant*。看空格前的 *a* 或 *an*，以及空格周围描述的工作。",
      ),
      meaning: t(
        "An *architect* designs buildings, while a *designer* plans how clothes, websites or other things will look. Check whether the meaning talks about buildings.",
        "*architect* 设计建筑，*designer* 设计衣服、网站等东西的外观。看释义说的是不是建筑。",
      ),
      spell: t(
        "*Plumber* has a silent *b*; *architect* starts with *arch-* said like *ark*.",
        "*plumber* 里的 *b* 不发音；*architect* 开头的 *arch-* 读作 *ark*。",
      ),
    },
    notes: `
      accountant|paying the right tax;money records;a mistake in a budget|an accountant keeps or checks money records; a lawyer gives advice about the law|accountant 是会计；lawyer 是律师|plumber/plumbers=a plumber repairs pipes, not money records=plumber 修水管，不管账目;receptionist/receptionists=a receptionist welcomes visitors, not someone who checks tax and budgets=receptionist 接待来客，不查税和预算;designer=a designer plans how things look, not money records=designer 设计外观，不管账|our accountant · check the accounts|*account* + *-ant*|*account* 加 *-ant*
      lawyer|advice before signing a contract;speaking in court;people in trouble with the law|a lawyer gives advice about the law; an accountant checks money records|lawyer 是律师；accountant 是会计|plumber=a plumber repairs pipes, not someone who gives advice about the law=plumber 修水管，不提供法律建议;pharmacist=a pharmacist sells medicine, not someone who speaks in court=pharmacist 卖药，不上法庭;designer=a designer plans how things look, not someone who helps with the law=designer 做设计，不处理法律问题|talk to a lawyer · in court|*law* + *-yer*|*law* 加 *-yer*
      journalist|an article about a school;questions for a minister;a local newspaper|a journalist writes the news; a lawyer speaks for people in court|journalist 是记者；lawyer 是律师|plumber/plumbers=a plumber repairs pipes, not someone who writes articles=plumber 修水管，不写文章;pharmacist=a pharmacist sells medicine, not someone who works for a newspaper=pharmacist 卖药，不为报社工作;electricians=electricians repair wires, they do not ask ministers questions=electrician 修电线，不采访部长|work as a journalist · a local newspaper|*journal* + *-ist*|*journal* 加 *-ist*
      architect|plans for a library;a famous bridge;how people use a building|an architect designs buildings; a designer plans how other things look|architect 是建筑师；designer 是设计师|pharmacist/Pharmacists=a pharmacist sells medicine, not someone who designs a bridge=pharmacist 卖药，不设计桥梁;journalist=a journalist writes news, not plans for a library=journalist 写新闻，不画图纸;receptionist/Receptionists=a receptionist welcomes visitors, not someone who designs buildings=receptionist 接待来客，不设计建筑|design a building · an architect's plans|*arch-* sounds like *ark*|*arch-* 读作 *ark*
      designer|dresses;colors for a website;clothes in Paris|a designer plans how something will look; an architect designs buildings|designer 是设计师；architect 是建筑师|plumber/plumbers=a plumber repairs pipes, not someone who plans how things look=plumber 修水管，不做设计;pharmacist/pharmacists=a pharmacist sells medicine, not someone who plans how things look=pharmacist 卖药，不做设计;electrician=an electrician repairs wires, not someone who chooses colors for a website=electrician 修电线，不选网站配色|a fashion designer · a web designer|the *g* is silent|*g* 不发音
      programmer|fixing an app;code for games;all day writing code|a programmer writes computer programs; a designer plans how things look|programmer 是程序员；designer 是设计师|plumber/Plumbers=a plumber repairs pipes, not someone who writes code=plumber 修水管，不写代码;pharmacist/Pharmacists=a pharmacist sells medicine, not someone who fixes an app=pharmacist 卖药，不修应用|a computer programmer · write code|double *m*: *programmer*|双写 *m*：*programmer*
      secretary|typing letters and answering phones;booking a meeting room;keeping records for a club|a secretary types, answers the phone and keeps records; an accountant checks money|secretary 是秘书；accountant 是会计|plumber=a plumber repairs pipes, not someone who types letters or keeps records=plumber 修水管，不打字记录;electrician=an electrician repairs wires, not someone who answers the phone in an office=electrician 修电线，不接电话;pharmacist=a pharmacist sells medicine, not someone who books rooms or keeps a club's records=pharmacist 卖药，不订会议室|ask my secretary · the club secretary|plural *secretaries*|复数 *secretaries*
      receptionist|hotel keys;saying your name when you arrive;the front desk|a receptionist welcomes visitors at the front desk; a secretary works in an office|receptionist 是前台接待；secretary 是秘书|plumber/plumbers=a plumber repairs pipes, not someone who gives hotel keys=plumber 修水管，不发房卡;electrician/electricians=an electrician repairs wires, not someone at the front desk=electrician 修电线，不在前台|at reception · the front desk|*reception* + *-ist*|*reception* 加 *-ist*
      electrician|lights that don't work;new wires in a kitchen;fixing lights and wires|an electrician repairs electric wires; a plumber repairs water pipes|electrician 是电工；plumber 是水管工|accountant=an accountant checks money records, not lights and wires=accountant 管账，不修电灯电线;architect=an architect designs buildings, not someone who fixes lights=architect 设计建筑，不修电灯;journalist=a journalist writes news, not someone who puts in wires=journalist 写新闻，不装电线;lawyer=a lawyer gives advice about the law, not someone who puts in wires=lawyer 提供法律建议，不装电线|call an electrician · fix the wiring|*electric* + *-ian*: c sounds like sh|*electric* 加 *-ian*：c 读 sh 音
      plumber|a leaking sink;a toilet fixed;pipes|a plumber repairs water pipes, toilets and sinks; an electrician repairs wires|plumber 是水管工；electrician 是电工|lawyer/Lawyers=a lawyer gives advice about the law, not someone who fixes a sink=lawyer 提供法律建议，不修水槽;journalist/Journalists=a journalist writes news, not someone who works with pipes=journalist 写新闻，不修水管|call a plumber · fix a leak|silent *b*|*b* 不发音
      pharmacist|medicine twice a day;the best cough medicine;drugstores and hospitals|a pharmacist prepares and sells medicines; a receptionist welcomes visitors|pharmacist 是药剂师；receptionist 是接待员|plumber/Plumbers=a plumber repairs pipes, not someone who tells you how to take medicine=plumber 修水管，不教你服药;architect/Architects=an architect designs buildings, not someone who sells medicine=architect 设计建筑，不卖药|ask the pharmacist · at the pharmacy|*ph* sounds like f|*ph* 读 f 音
      assistant|finding the right size in a shop;helping a manager;helping a teacher|an assistant helps someone in their work; a secretary types and keeps records in an office|assistant 是助手、店员；secretary 是秘书|plumber/plumbers=a plumber repairs pipes, not someone who helps another person at work=plumber 修水管，不是助手;lawyer/lawyers=a lawyer gives advice about the law, not someone who helps another person at work=lawyer 提供法律建议，不是助手;architect=an architect designs buildings, not a helper to a manager=architect 设计建筑，不是经理助理;electrician=an electrician repairs wires, not a helper to a manager=electrician 修电线，不是经理助理|a shop assistant · an assistant to|verb *assist*: to help|动词 *assist*：帮助
    `,
  },
});

const workQualities = vocabularyTopic({
  id: "b1-words-work-qualities",
  title: t("Qualities at Work", "工作中的品质"),
  summary: t(
    "Reliable, flexible and punctual; efficient, ambitious and experienced; professional and honest; careless, motivated, practical and interested.",
    "可靠、灵活和准时；高效、有抱负和有经验；专业和诚实；粗心、积极、务实和感兴趣。",
  ),
  intro: t(
    "Employers look for people who are **reliable**, **punctual**, **honest** and **efficient**, and who are **motivated** to learn. These words help you describe a good worker, in a job advertisement or in an interview.",
    "雇主想找 **reliable**（可靠的）、**punctual**（准时的）、**honest**（诚实的）、**efficient**（高效的），并且 **motivated**（有积极性的）去学习的人。这些词帮你在招聘启事或面试中描述一名好员工。",
  ),
  prerequisites: ["b1-words-qualities"],
  words: [
    word(
      "reliable",
      "able to be trusted to do what is needed",
      "可靠的",
      "Tom is very {reliable}. He always does what he promises.|careless ambitious | Our car must be {reliable} for the long trip: it can't break down.|punctual ambitious | Is this news website {reliable}? Can we trust what it says?|punctual ambitious",
      "careless flexible",
    ),
    word(
      "flexible",
      "able to change easily to suit new situations",
      "灵活的",
      "My job has {flexible} hours, so I can start late.|punctual careless | We need someone {flexible} who can change plans and work weekends too.|careless punctual | Our plans are {flexible}. We can go on Saturday or Sunday.|punctual careless",
      "punctual practical",
    ),
    word(
      "punctual",
      "always arriving at the right time",
      "准时的",
      "She is very {punctual}. She has never been late.|careless flexible | Trains in Japan are very {punctual} and always arrive on time.|ambitious honest | Be {punctual}: the interview starts at nine, not five past nine.|flexible careless",
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
      "He's {ambitious}. He wants to be the boss one day.|careless punctual | She's a young lawyer who is very {ambitious} and wants to run her own firm.|careless punctual | To climb ten mountains in a year is a very {ambitious} plan.|careless punctual",
      "motivated careless",
    ),
    word(
      "experienced",
      "having knowledge or skill because you have done something for a long time",
      "有经验的",
      "We need a driver who is {experienced}, with many years of driving buses.|careless punctual | She's a very {experienced} nurse: she has worked for twenty years.|careless punctual | He has worked here for thirty years, so he's very {experienced}.|punctual ambitious",
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
      "Please be {honest}. Did you break the window?|punctual efficient | A man found my wallet and gave it back with all the money: he was very {honest}.|careless punctual | To be {honest}, I didn't like the film.|punctual flexible",
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
      "The students are very {motivated}. They work hard.|careless lazy | Her love of science keeps her {motivated}: she works hard every day.|careless punctual | We want {motivated} people who love their work.|careless punctual",
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
      "I'm very {interested} in history and want to learn all about it. | Do you want this job? If you are {interested} in it, send us your application. | She wasn't {interested} in football, so she read a book.",
      "honest careless",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "These words are adjectives: they come after *be* or *very*, or before a noun. *Interested* is followed by *in*: *interested in history*. Look at the word just before or after the gap.",
        "这些词都是形容词：放在 *be* 或 *very* 后面，或名词前面。*interested* 后接 *in*：*interested in history*。看紧挨空格的词。",
      ),
      meaning: t(
        "*Ambitious* people want to be successful one day, while *motivated* people work hard at what they are doing now. Check whether the meaning looks to the future or at the work in hand.",
        "*ambitious* 的人想将来获得成功，*motivated* 的人在眼下的事情上努力。看释义说的是将来，还是手头的事。",
      ),
      spell: t(
        "*Careless* is *care* + *-less*, with one *l* before *-ess*; *efficient* has *-cient*, said like *shent*.",
        "*careless* 是 *care* 加 *-less*；*efficient* 结尾 *-cient* 读作 *shent*。",
      ),
    },
    notes: `
      reliable|keeping promises;a car for a long trip;news you can trust|reliable means you can trust it to do what is needed; flexible means able to change easily|reliable 是可靠的；flexible 是灵活的|careless=careless means making mistakes, not always doing what you promise=careless 是粗心，不是守信;ambitious=ambitious means wanting success, not able to be trusted=ambitious 是有野心，不是可靠;punctual=punctual means arriving on time, a car or a website is not on time=punctual 是准时，车或网站谈不上准时|a reliable car · reliable news|noun *reliability*; verb *rely*|名词 *reliability*；动词 *rely*
      flexible|starting late;changing plans and working weekends;Saturday or Sunday|flexible means able to change easily; punctual means always on time|flexible 是灵活的；punctual 是准时的|punctual=punctual means always on time, not able to start late or change plans=punctual 是准时，不是能随时变动;careless=careless means making mistakes, not able to change easily=careless 是粗心，不是灵活|flexible hours · be flexible|*-ible*, not *-able*|结尾是 *-ible*，不是 *-able*
      punctual|someone who is never late;trains on time;an interview at nine sharp|punctual means always arriving at the right time; efficient means not wasting time|punctual 是准时的；efficient 是高效的|careless=careless means making mistakes, not never being late=careless 是粗心，不是准时;flexible=flexible means able to change, not arriving exactly at nine=flexible 是灵活，不是准时;ambitious=ambitious means wanting success, trains are not ambitious=ambitious 是有抱负，火车谈不上;honest=honest means telling the truth, not arriving on time=honest 是诚实，不是准时|be punctual · very punctual|*punctual* rhymes with *actual*|*punctual* 和 *actual* 押韵
      efficient|finishing work in half the time;a heater using less electricity;answering emails faster|efficient means working well without wasting time; punctual means on time|efficient 是高效的；punctual 是准时的|careless=careless means making mistakes, not finishing quickly and well=careless 是粗心，不是高效;honest=honest means telling the truth, not working well without wasting time=honest 是诚实，不是高效;ambitious=ambitious means wanting success, a heater or a way of working is not ambitious=ambitious 是有抱负，加热器谈不上|more efficient · an efficient way|*-cient* sounds like *shent*|*-cient* 读作 *shent*
      ambitious|being the boss one day;running her own firm;ten mountains in a year|ambitious means wanting very much to succeed; motivated means working hard now|ambitious 是有抱负的；motivated 是有积极性的|careless=careless means making mistakes, not wanting to be the boss=careless 是粗心，不是有抱负;punctual=punctual means arriving on time, not wanting to run a firm=punctual 是准时，不是有野心|an ambitious plan · ambitious young people|noun *ambition*|名词 *ambition*
      experienced|years of driving buses;twenty years as a nurse;thirty years here|experienced means skilled from doing something a long time; professional means trained or paid|experienced 是有经验的；professional 是专业的|careless=careless means making mistakes, not having years of skill=careless 是粗心，不是有经验;punctual=punctual means on time, not having worked for many years=punctual 是准时，不是有经验;ambitious=ambitious means wanting success, not having thirty years of skill=ambitious 是有抱负，不是有经验|an experienced driver · very experienced|noun *experience* + *-d*|名词 *experience* 加 *-d*
      professional|a paid singer;good advice from a trained person;football as a job|professional means doing something as a paid job or with real skill; experienced means having done it a long time|professional 是职业的、专业的；experienced 是有经验的|careless=careless means making mistakes, not doing something as a trained or paid person=careless 是粗心，不是职业的;punctual=punctual means on time, not doing something as a trained or paid person=punctual 是准时，不是专业的;ambitious=ambitious means wanting success, advice is not ambitious=ambitious 是有抱负，建议谈不上|a professional footballer · professional advice|opposite *amateur*|反义词 *amateur*
      honest|a broken window;a wallet given back;not liking the film|honest means telling the truth and not stealing; reliable means you can trust someone to do things|honest 是诚实的；reliable 是可靠的|punctual=punctual means on time, not telling the truth=punctual 是准时，不是诚实;efficient=efficient means working without waste, not telling the truth about a window=efficient 是高效，不是诚实;careless=careless means making mistakes, not giving back all the money=careless 是粗心，不是诚实;flexible=flexible means able to change, not telling the truth=flexible 是灵活，不是诚实|to be honest · an honest answer|silent *h*: *an honest*|*h* 不发音：*an honest*
      careless|mistakes in a test;driving too fast;spending money badly|careless means not thinking, so you make mistakes; efficient means working well|careless 是粗心的；efficient 是高效的|honest=honest means telling the truth, it does not cause mistakes=honest 是诚实，不会造成错误;punctual=punctual means on time, not making mistakes=punctual 是准时，不是粗心;reliable=reliable means trusted, not driving too fast=reliable 是可靠，不会开快车;flexible=flexible means able to change, not wasting money=flexible 是灵活，不是乱花钱|careless mistakes · careless with|*care* + *-less*: without care|*care* 加 *-less*：不小心
      motivated|students who work hard;a love of science;people who love their work|motivated means wanting to do something and working hard; ambitious means wanting to succeed one day|motivated 是有积极性的；ambitious 是有抱负的|careless=careless means making mistakes, not working hard=careless 是粗心，不是有干劲;lazy=lazy means not wanting to work, the opposite of working hard=lazy 是懒，和努力正相反;punctual=punctual means on time, not working hard out of love=punctual 是准时，不是有干劲|highly motivated · motivated by|noun *motivation*|名词 *motivation*
      practical|advice for a first day;high heels for walking;fixing anything|practical means useful in real life or good at fixing things; flexible means able to change|practical 是实用的、动手能力强的；flexible 是灵活的|punctual=punctual means on time, not useful or good at fixing things=punctual 是准时，不是实用;careless=careless means making mistakes, not useful advice=careless 是粗心，不是实用;honest=honest means telling the truth, not useful or good at fixing things=honest 是诚实，不是实用|practical advice · not very practical|*practice* + *-al*|*practice* 变来
      interested|history;the job and an application;football and a book|interested means wanting to know or learn about something; motivated means working hard|interested 是感兴趣的；motivated 是有积极性的|honest=honest means telling the truth, not wanting to learn about history or a job=honest 是诚实，不是感兴趣;careless=careless means making mistakes, not wanting to know about something=careless 是粗心，不是感兴趣|interested in · not interested|*interested* (a person) vs *interesting* (a thing)|*interested* 指人，*interesting* 指事物
    `,
  },
});

const office = vocabularyTopic({
  id: "b1-words-office",
  title: t("The Office", "办公室"),
  summary: t(
    "Documents, folders and forms; signatures, signing and stamps; memos, calendars and reminders; invoices, staplers and drawers.",
    "文件、文件夹和表格；签名、签署和邮票；备忘录、日历和提醒；发票、订书机和抽屉。",
  ),
  intro: t(
    "In an office, you fill in a **form**, **sign** a **document**, put it in a **folder** and keep it in a **drawer**. These words help you talk about the papers and things you use at a desk.",
    "在办公室里，你填 **form**（表格），在 **document**（文件）上 **sign**（签名），把它放进 **folder**（文件夹），再收进 **drawer**（抽屉）。这些词帮你谈论办公桌上用到的文件和用品。",
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
      "Please write your {signature} at the bottom of the page.|stapler drawer | The letter needs the manager's {signature}: she must sign it.|stapler drawer | We collected 500 {signatures} from people who signed our letter to the mayor.|staplers drawers",
      "stamp form",
    ),
    word(
      "sign signs signed signing",
      "to write your name on something",
      "签名；签署",
      "Please {sign} here: write your name with this pen. | She {signed} the contract with a blue pen.|stamped folded | {Sign} your name on the line in your own handwriting.|Stamp Fold",
      "stamp fold",
    ),
    word(
      "stamp stamps",
      "a small piece of paper you stick on a letter to pay for the post; a tool that prints a mark",
      "邮票；图章",
      "I need a {stamp} for this letter to pay for the post.|memo signature | He collects {stamps} from all over the world.|memos invoices | The officer put a {stamp} in my passport.|memo drawer",
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
      "I marked her birthday on the {calendar}.|stapler drawer | Let me check my {calendar}. Yes, I'm free on Friday.|stapler stamp | We gave our clients {calendars} with a photo of the city for each month.|staplers invoices",
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
      "Please pay the {invoice} within thirty days.|stapler drawer | The plumber sent us his {invoice}: 800 yuan for the work.|stapler drawer | I keep all the {invoices} in a folder.|staplers drawers",
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
      "The scissors are in the top {drawer}.|invoice memo | She opened the {drawer} and took out a pen.|invoice memo | My desk has three {drawers} that slide in and out.|invoices memos",
      "folder stapler",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Sign* is a verb, and *signature* is the noun: you *sign* a letter and put your *signature* on it. You *fill in* a *form* and *pay* an *invoice*. Look at the verb before the gap.",
        "*sign* 是动词，*signature* 是名词：你 *sign* 一封信，在上面留下 *signature*。*fill in* 搭配 *form*，*pay* 搭配 *invoice*。看空格前的动词。",
      ),
      meaning: t(
        "A *memo* is a short note sent to people in an office, while a *reminder* is anything that helps you remember, such as an alarm on your phone. Check whether the meaning says sent to people or helps you remember.",
        "*memo* 是发给办公室同事的简短通知，*reminder* 是任何帮你记住事情的东西，比如手机闹钟。看释义说的是发给大家，还是帮你记住。",
      ),
      spell: t(
        "The *g* in *sign* is silent, but you hear it in *signature*. *Calendar* ends in *-ar*, not *-er*.",
        "*sign* 里的 *g* 不发音，但 *signature* 里要读出来。*calendar* 结尾是 *-ar*，不是 *-er*。",
      ),
    },
    notes: `
      document|reading and signing;a passport;a file on a computer|a document is a paper or file with official information; a folder is where you keep documents|document 是文件；folder 是文件夹|stapler/staplers=a stapler is a tool for joining paper, not a paper you read and sign=stapler 是订书机，不是要读的文件;drawer/drawers=a drawer is a box in a desk, not a paper with information=drawer 是抽屉，不是文件|an official document · save a document|short form *doc*|简写 *doc*
      folder|notes kept together;photos on a computer;the top shelf|a folder is a cover or a computer place for keeping files; a document is the file itself|folder 是文件夹；document 是文件本身|stamp=a stamp goes on a letter or in a passport, you do not keep notes in it=stamp 是邮票或图章，不能装笔记;signature/signatures=a signature is your name written your way, not a place for notes=signature 是签名，不是放笔记的地方;invoice=an invoice is a bill, not a place for photos=invoice 是发票，不是放照片的地方;reminders=reminders help you remember, they are not things on a shelf=reminder 是提醒，不是架上的东西|a new folder · keep in a folder|*fold* + *-er*|*fold* 加 *-er*
      form|filling in;an application from a website;three at the bank|a form is a paper with spaces for information; a document is any official paper|form 是表格；document 是文件|stamp=a stamp goes on a letter, it has no spaces to fill in=stamp 是邮票，没有空格可填;drawer/drawers=a drawer is a box in a desk, not a paper you fill in=drawer 是抽屉，不是表格;stapler/staplers=a stapler joins paper, you cannot download it or fill it in=stapler 是订书机，不能下载或填写|fill in a form · an application form|also means shape or kind|也指形式、形状
      signature|the bottom of a page;a manager's name on a letter;500 people|a signature is your name written your way; a stamp is a printed mark|signature 是签名；stamp 是图章|stapler/staplers=a stapler is a tool, not a name you write=stapler 是订书机，不是签名;drawer/drawers=a drawer is a box in a desk, not a name you write=drawer 是抽屉，不是签名|your signature · collect signatures|*g* is heard in *signature*|*signature* 里 *g* 要读
      sign|writing your name with a pen;a contract;your own handwriting|to sign is to write your name on something; to stamp is to print a mark on it|sign 是签名；stamp 是盖章|stamp/stamped/Stamp=to stamp is to print a mark with a tool, not to write your name with a pen=stamp 是盖章，不是用笔写名字;fold/folded/Fold=to fold paper is to bend it, not to write your name=fold 是折叠，不是签名|sign here · sign a contract|silent *g*|*g* 不发音
      stamp|paying for the post;collecting from all over the world;a passport|a stamp pays for the post or is a printed mark; a signature is your written name|stamp 是邮票、图章；signature 是签名|memo/memos=a memo is a short office note, not something that pays for the post=memo 是便函，不能付邮费;signature=a signature is your written name, not something you stick on a letter=signature 是签名，不贴在信上;invoices=invoices are bills, people do not collect them from all over the world=invoice 是账单，不是收藏品;drawer=a drawer is a box in a desk, not a mark in a passport=drawer 是抽屉，不是护照上的章|a stamp for a letter · collect stamps|also a verb: to stamp|也是动词：盖章
      memo|the boss writing to everyone;new rules;too many at work|a memo is a short note sent in an office; a reminder is anything that helps you remember|memo 是便函；reminder 是提醒|stapler/staplers=a stapler is a tool, the boss does not send it to everyone=stapler 是订书机，老板不会把它发给大家;drawer/drawers=a drawer is a box in a desk, you do not read it=drawer 是抽屉，不能阅读|send a memo · a memo about|short for *memorandum*|*memorandum* 的简写
      calendar|a birthday marked;being free on Friday;a photo for each month|a calendar shows the days and months; a reminder helps you remember one thing|calendar 是日历；reminder 是提醒|stapler/staplers=a stapler joins paper, it does not show the days=stapler 是订书机，不显示日期;drawer=a drawer is a box in a desk, not a page of days=drawer 是抽屉，不是日历;stamp=a stamp goes on a letter, it does not show when you are free=stamp 是邮票，不显示你哪天有空;invoices=invoices are bills, not pages for each month=invoice 是账单，不是每月一页的日历|on the calendar · check my calendar|*-ar*, not *-er*|结尾是 *-ar*，不是 *-er*
      reminder|the dentist on a phone;a meeting at ten;late library books|a reminder helps you remember; a memo is an office note sent to people|reminder 是提醒；memo 是便函|stapler/staplers=a stapler joins paper, it does not help you remember=stapler 是订书机，不能提醒你;drawer/drawers=a drawer is a box in a desk, it does not help you remember=drawer 是抽屉，不能提醒你|set a reminder · a reminder about|verb *remind* + *-er*|动词 *remind* 加 *-er*
      invoice|paying within thirty days;800 yuan from a plumber;bills kept in a folder|an invoice lists work done and the price; a form has spaces you fill in|invoice 是发票、账单；form 是表格|stapler/staplers=a stapler is a tool, not a bill to pay=stapler 是订书机，不是账单;drawer/drawers=a drawer is a box in a desk, not a bill a plumber sends=drawer 是抽屉，不是账单|pay an invoice · send an invoice|*-oice*, like *voice*|结尾 *-oice*，和 *voice* 一样
      stapler|joining pages;more staples;pages joined|a stapler joins paper with metal; a folder keeps papers|stapler 是订书机；folder 是文件夹|calendar=a calendar shows the days, it does not join pages=calendar 是日历，不能订纸;invoice=an invoice is a bill, it does not join pages=invoice 是账单，不能订纸;signature=a signature is your name, not a tool for joining pages=signature 是签名，不是订书工具|borrow a stapler · staple the pages|*staple* + *-r*|*staple* 加 *-r*
      drawer|scissors at the top;a pen taken out;sliding in and out|a drawer is a box that slides in and out of a desk; a folder holds papers|drawer 是抽屉；folder 是文件夹|invoice/invoices=an invoice is a bill, not a box in a desk=invoice 是账单，不是抽屉;memo/memos=a memo is a note, not part of a desk that slides=memo 是便函，不是会滑动的抽屉|the top drawer · open the drawer|*draw* + *-er*: you draw it out|*draw* 加 *-er*：拉出来的东西
    `,
  },
});

const linking = vocabularyTopic({
  id: "b1-words-little-words-5",
  title: t("Linking Words 2", "连接词 2"),
  summary: t(
    "Whenever and wherever; anyway and otherwise; besides, therefore and meanwhile; actually, especially and exactly; simply, rarely and according to.",
    "whenever 和 wherever；anyway 和 otherwise；besides、therefore 和 meanwhile；actually、especially 和 exactly；simply、rarely 和 according to。",
  ),
  intro: t(
    "Little words like **therefore**, **otherwise**, **meanwhile** and **besides** link one idea to the next, and **actually** or **especially** add a small change of meaning. These words help you join sentences and say how ideas fit together.",
    "**therefore**（因此）、**otherwise**（否则）、**meanwhile**（与此同时）、**besides**（此外）这样的小词把一个意思接到下一个，**actually**（其实）或 **especially**（尤其）则给意思加一点变化。这些词帮你连接句子，说明想法之间的关系。",
  ),
  prerequisites: ["b1-words-little-words-4"],
  words: [
    word(
      "whenever",
      "every time that; at any time",
      "每当；无论何时",
      "{Whenever} I hear this song, I think of you.|Unless Although | Come and visit us {whenever} you're free. | She likes him a lot: she smiles {whenever} she sees him.",
      "unless although",
      "wherever",
    ),
    word(
      "wherever",
      "in or to any place",
      "无论在哪里",
      "Sit {wherever} there is a free seat. | My dog follows me {wherever} I go. | The tower is very tall: {wherever} you stand in the city, from north to south, you can see it.|Unless Although",
      "unless although",
      "whenever",
    ),
    word(
      "anyway",
      "but this is not important; still",
      "不管怎样；反正",
      "It was raining, but we went out {anyway}. | I don't really like cake, but I'll have a piece {anyway}. | Well, that's not important. {Anyway}, let's talk about something else.|Otherwise Meanwhile",
      "meanwhile therefore",
    ),
    word(
      "otherwise",
      "if not; or else",
      "否则；不然",
      "Hurry up, {otherwise} we'll miss the bus. | Write it down. {Otherwise}, you'll forget.|Therefore Meanwhile | Wear a coat, {otherwise} you'll get cold.",
      "therefore meanwhile",
    ),
    word(
      "besides",
      "also; as well as",
      "此外；除……之外（还）",
      "I don't want to go out. {Besides}, it's too late.|Otherwise Instead | She speaks French and German {besides} English, so she knows three languages. | Who else came to the party {besides} you and Tom?|without against",
      "without except",
    ),
    word(
      "therefore",
      "for that reason",
      "因此",
      "It was snowing. {Therefore}, the school was closed.|Otherwise Besides | She studied hard and {therefore} passed the exam. | The road is dangerous. Drivers must {therefore} go slowly.",
      "otherwise meanwhile",
    ),
    word(
      "meanwhile",
      "while something else is happening",
      "与此同时",
      "Dad cooked dinner for an hour. {Meanwhile}, during that time, I set the table. | The film starts in an hour. {Meanwhile}, until it starts, let's get something to eat.|Besides Otherwise | I'll call the doctor. {Meanwhile}, while I'm on the phone, you should rest.",
      "Therefore Otherwise",
    ),
    word(
      "actually",
      "really; in fact, often when saying something surprising",
      "实际上；其实",
      "He looks young, but he's {actually} fifty. | You think I love coffee, but {actually}, I don't like it. | Did she {actually} say that? I can't believe it's true.",
      "therefore meanwhile",
    ),
    word(
      "especially",
      "more than usual; more than others",
      "尤其；特别",
      "I love all fruit, {especially} apples: I like them more than any other fruit. | It's cold here all winter, {especially} in January, the coldest month. | This book was written {especially} for children, with big pictures and easy words.|rarely therefore",
      "except actually",
    ),
    word(
      "exactly",
      "with no mistake; not more or less",
      "确切地；正好",
      "It's {exactly} three o'clock: not one minute more or less. | That's {exactly} what I wanted, in the right color and size! | Tell me his words: what {exactly} did he say?|therefore meanwhile",
      "nearly rarely",
    ),
    word(
      "simply",
      "only; just; in a way that is easy to understand",
      "只是；简单地",
      "I'm sorry, but I {simply} don't have time today: I'm too busy. | Explain it {simply}, please, with easy words: I'm new to this.|rarely exactly | Look at the ice on the lake: it's {simply} too cold to swim today.|rarely meanwhile",
      "meanwhile otherwise",
    ),
    word(
      "rarely",
      "not often",
      "很少；难得",
      "My grandfather {rarely} watches TV: maybe once a month. | It {rarely} snows here: we see snow only once every few years. | We {rarely} see each other now that she lives abroad: only once a year.",
      "often always",
    ),
    word(
      "according",
      "as said or shown by someone or something (according to)",
      "根据；据……所说",
      "{According} to the weather forecast, it will rain tomorrow. | {According} to my teacher, who told us this morning, the test will be easy. | The students were put in groups {according} to their age.|next thanks",
      "Next Thanks",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Whenever* and *wherever* start a part of the sentence with its own verb: *whenever I hear it*. *According* is always followed by *to*. Look at what comes right after the gap.",
        "*whenever* 和 *wherever* 引出带自己动词的部分：*whenever I hear it*。*according* 后面总接 *to*。看紧跟空格的是什么。",
      ),
      meaning: t(
        "*Therefore* gives a result, *otherwise* says what happens if not, and *meanwhile* says what happens at the same time. Check whether the meaning talks about a result, an if not, or the same time.",
        "*therefore* 表示结果，*otherwise* 说“如果不这样会怎样”，*meanwhile* 说同一时间发生的事。看释义说的是结果、否则，还是同时。",
      ),
      spell: t(
        "*Actually* and *especially* end in double *l* + *y*: *actual* + *-ly*, *especial* + *-ly*. *Rarely* keeps the *e*: *rare* + *-ly*.",
        "*actually* 和 *especially* 结尾是双 *l* 加 *y*：*actual* 加 *-ly*、*especial* 加 *-ly*。*rarely* 保留 *e*：*rare* 加 *-ly*。",
      ),
    },
    notes: `
      whenever|a song that brings back memories;visiting when free;smiling at him|whenever means every time that; wherever means in any place|whenever 是每当；wherever 是无论在哪里|Unless/unless=unless means if not, but here one thing happens every time the other does=unless 是除非，可这里是每次都会发生;Although/although=although shows a surprise, but here one thing simply happens every time the other does=although 表示让步，可这里是每次都会发生|whenever you like · whenever I can|*when* + *ever*|*when* 加 *ever*
      wherever|a free seat;a dog that follows;a tall tower seen from anywhere|wherever means in or to any place; whenever means every time|wherever 是无论在哪里；whenever 是每当|unless/Unless=unless means if not, but here any place is fine=unless 是除非，这里任何地方都可以;although/Although=although shows a surprise, but here the meaning is in any place=although 表示让步，这里的意思是无论在哪里|wherever you go · sit wherever|*where* + *ever*|*where* 加 *ever*
      anyway|going out in the rain;a piece of cake not liked;changing the subject|anyway means still, or that something is not important; therefore means for that reason|anyway 是不管怎样；therefore 是因此|meanwhile/Meanwhile=meanwhile means at the same time, but here something is still done or is not important=meanwhile 是同时，可这里是照样做或无关紧要;therefore=therefore gives a result, but here something is done even though there was a reason against it=therefore 表示结果，可这里是有理由不做却照样做;Otherwise=otherwise means if not, but here we leave the last point because it is not important=otherwise 是否则，这里是因为不重要而转话题|but ... anyway · anyway, let's|one word: *anyway*|连写：*anyway*
      otherwise|missing the bus;forgetting;getting cold|otherwise means if not; therefore means for that reason|otherwise 是否则；therefore 是因此|therefore/Therefore=therefore means for that reason, but hurrying or writing it down would not cause the bad result=therefore 是因此，可赶快或记下来不会导致坏结果;meanwhile/Meanwhile=meanwhile means at the same time, not what happens if you don't=meanwhile 是同时，不是“不然会怎样”|..., otherwise ... · or else|*other* + *wise*|*other* 加 *wise*
      besides|too late to go out;three languages;others at the party|besides means also, or as well as; instead means in place of|besides 是此外、除……之外还；instead 是代替|Otherwise=otherwise means if not, but here I add one more reason=otherwise 是否则，这里是再加一个理由;Instead=instead means in place of, but here I add one more reason=instead 是代替，这里是再加一个理由;without=without means not having, but here someone or something is added=without 是没有，可这里是再加上;except=except leaves English out, but she knows three languages, English too=except 是除去，可她会三种语言，包括英语;against=against means opposing, but the question asks who else came as well=against 是反对，这里问的是还有谁来了|besides English · besides, it's late|*besides* (also) vs *beside* (next to)|*besides* 是此外，*beside* 是在旁边
      therefore|snow and a closed school;hard study and a passed exam;a dangerous road|therefore means for that reason; otherwise means if not|therefore 是因此；otherwise 是否则|Otherwise/otherwise=otherwise means if not, but the second part is the result of the first=otherwise 是否则，可后半句是前半句的结果;Besides=besides adds another point, but the school closed because of the snow=besides 是此外，可学校停课正是因为下雪;meanwhile=meanwhile means at the same time, but passing and going slowly are results=meanwhile 是同时，可通过考试和慢行都是结果|and therefore · therefore, ...|*there* + *fore*|*there* 加 *fore*
      meanwhile|setting the table during cooking;eating until a film starts;resting during a phone call|meanwhile means at the same time; therefore means for that reason|meanwhile 是与此同时；therefore 是因此|Therefore=therefore means for that reason, but these things happen during the same time=therefore 是因此，可这些事发生在同一时间;Otherwise=otherwise means if not, but these things happen during the same time=otherwise 是否则，可这些事发生在同一时间;Besides=besides adds another point, but here two things happen during the same time=besides 是此外，可这里两件事同时发生|in the meantime · meanwhile, ...|*mean* + *while*|*mean* 加 *while*
      actually|looking young but being fifty;not liking coffee;not believing it|actually means really or in fact; especially means more than others|actually 是实际上；especially 是尤其|therefore=therefore means for that reason, but here the fact is a surprise=therefore 是因此，可这里是意外的事实;meanwhile=meanwhile means at the same time, but here the fact is a surprise=meanwhile 是同时，可这里是意外的事实|but actually · actually, I ...|does not mean *now*: that is *currently*|不是“现在”的意思，“目前”是 *currently*
      especially|apples more than other fruit;January the coldest month;a book for children|especially means more than others, or for one purpose; actually means in fact|especially 是尤其、特别；actually 是实际上|except=except leaves something out, but here one thing is picked out as the most=except 是除去，可这里是挑出最突出的一个;actually=actually corrects what came before, but here one thing is picked out of many=actually 是更正，这里是从多个中挑出一个;rarely=rarely means not often, but the book was written for children on purpose=rarely 是很少，可这本书是专为孩子写的;therefore=therefore gives a result, but here the book has a purpose=therefore 表示结果，这里说的是目的|especially for · especially in|*-ally*: double *l*|*-ally*：双写 *l*
      exactly|a time not one minute more or less;the right color and size;his words|exactly means with no mistake, not more or less; nearly means almost|exactly 是正好、确切地；nearly 是几乎|nearly=nearly means almost, but here it is just right, not more or less=nearly 是几乎，可这里刚好不多不少;rarely=rarely means not often, but the time and the thing are exact=rarely 是很少，可这里时间和东西都刚好;therefore=therefore gives a result, but here I want his words exactly=therefore 表示结果，这里要的是他的原话;meanwhile=meanwhile means at the same time, but here I want his words exactly=meanwhile 是同时，这里要的是他的原话|exactly what · at exactly three|*exact* + *-ly*|*exact* 加 *-ly*
      simply|having no time and being too busy;easy words;ice on a lake|simply means just, or in an easy way; exactly means with no mistake|simply 是只是、简单地；exactly 是确切地|meanwhile=meanwhile means at the same time, but here the meaning is just or only=meanwhile 是同时，这里的意思是“就是、只是”;otherwise=otherwise means if not, but here I just have no time=otherwise 是否则，这里只是没时间;rarely=rarely means not often, but today it is too cold and I want easy words=rarely 是很少，可今天就是太冷，我要的是简单的话;exactly=exactly means with no mistake, but I asked for easy words=exactly 是精确地，可我要的是简单的话|simply too · put simply|*simple* drops *-le*: *simply*|*simple* 去掉 *-le* 加 *-ly*
      rarely|TV once a month;snow every few years;seeing each other once a year|rarely means not often; often means many times|rarely 是很少；often 是经常|often=often means many times, but once a month or once a year is not many=often 是经常，可一个月或一年一次并不多;always=always means every time, but once a month or once a year is far from always=always 是总是，可一月或一年一次远不是总是|rarely see · very rarely|*rare* + *-ly*: keep the *e*|*rare* 加 *-ly*：保留 *e*
      according|a weather forecast;a teacher who told us;groups by age|according to means as said or shown by; thanks to means because of something good|according to 是根据；thanks to 是多亏|Next/next=next to means beside, but a forecast or a teacher tells us something=next to 是在旁边，可天气预报或老师在告诉我们信息;Thanks/thanks=thanks to means because of, but the forecast and the teacher only tell us something=thanks to 是多亏，可预报和老师只是告诉我们|according to · according to her|always with *to*|总是和 *to* 连用
    `,
  },
});

// Used to.

/** habits are a subject, the subject in a question, and a past habit or state that has ended. */
const handHabits: readonly (readonly [string, string, string])[] = [
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

/** habitPeople are a subject and the subject in a question. */
const habitPeople: readonly (readonly [string, string])[] = [
  ["I", "you"],
  ["My dad", "your dad"],
  ["We", "you"],
  ["She", "she"],
  ["They", "they"],
  ["Tom", "Tom"],
  ["My grandma", "your grandma"],
  ["He", "he"],
  ["My parents", "your parents"],
  ["Lisa", "Lisa"],
  ["My brother", "your brother"],
  ["Our neighbors", "your neighbors"],
];

/** pastHabits are past habits or states that anyone could have had. */
const pastHabits: readonly string[] = [
  "live in a small village",
  "go to the beach every summer",
  "have long hair",
  "play football after school",
  "be very shy",
  "work in a factory",
  "hate vegetables",
  "walk to school",
  "ride a bike to work",
  "run a small shop",
  "write to a pen friend",
  "collect stamps",
  "have a dog",
];

const habits: readonly (readonly [string, string, string])[] = [
  ...handHabits,
  ...everyPair(habitPeople, pastHabits).map(([[subject, asked], habit]) => [subject, asked, habit] as const),
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

/** usedRule names why a sentence takes used to or use to. */
function usedRule(sentence: string): Text {
  if (sentence.includes("didn't") || sentence.includes("did not"))
    return t(
      "In a negative, *didn't* already carries the past, so it is *use to*, with no *d*",
      "否定句里 *didn't* 已经表示过去，所以用 *use to*，不加 *d*",
    );
  if (sentence.startsWith("Did "))
    return t(
      "In a question, *did* already carries the past, so it is *use to*, with no *d*",
      "疑问句里 *did* 已经表示过去，所以用 *use to*，不加 *d*",
    );
  return t(
    "A past habit or state that has ended takes *used to* and the base form",
    "过去的习惯或状态、现在已经不这样了，用 *used to* 加动词原形",
  );
}

/** usedWhy puts the rule of used to before a sentence. */
const usedWhy = (sentence: string, shown: string): Text => {
  const rule = usedRule(shown);
  const hasDid = shown.includes("didn't") || shown.includes("did not") || shown.startsWith("Did ");
  return t(
    `${rule.en}: ${sentence}\n\n**Check.** ${hasDid ? "Spot *did/didn't* earlier in the sentence: because *did* already carries the past, drop the *-d* (*use to*)." : "There is no *did* in this statement, so the past *-d* stays on *used to* before the plain verb."}`,
    `${rule["zh-CN"]}：${sentence}\n\n**检验。** ${hasDid ? "看句中已经出现的 *did/didn't*：过去时已由 *did* 承担，所以去掉 *-d* 用 *use to*。" : "这个陈述句里没有 *did*，所以保留过去式 *-d*，用 *used to* 加动词原形。"}`,
  );
};

/** whyNotUsed explains a wrong form of used to. */
const whyNotUsed = (wrong: string): Text => {
  if (wrong === "was used to")
    return t(
      "*was used to* means being accustomed to something and is followed by *-ing* or a noun, not a base verb.",
      "*was used to* 表示“习惯于”，后面接 *-ing* 或名词，不接动词原形。",
    );
  if (wrong === "use to")
    return t("*use to* without *did* has no past tense marking in a positive statement.", "肯定句里没有 *did*，*use to* 缺少过去时标记。");
  if (wrong === "used to")
    return t(
      "*used to* after *did* or *didn't* marks the past twice—once in *did* and again in *-d*.",
      "在 *did* 或 *didn't* 后面用 *used to* 会把过去标记两次（*did* 一次，*-d* 一次）。",
    );
  return t(`*${wrong}* is not a valid form after *did*.`, `*${wrong}* 不是 *did* 后面的正确形式。`);
};

const usedTo: TopicDef = {
  id: "used-to",
  title: t("Used To", "used to：过去常常"),
  summary: t(
    "I used to live in a village, but now I live in a city. Used to tells of a past habit or state that has ended; after did, it is use to.",
    "I used to live in a village, but now I live in a city。used to 表示过去的习惯或状态，现在已经不这样了；did 后面用 use to。",
  ),
  intro: t(
    "Compare *He used to work in a factory* (a past routine that has ended) with *He didn't use to drive to work*. Notice how the *-d* disappears the moment *did* or *didn't* enters the sentence.",
    "比较 *He used to work in a factory*（过去常做、如今不再）和 *He didn't use to drive to work*。注意一旦句中出现 *did* 或 *didn't*，*-d* 就会消失。",
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
        "*Used to* + the base form of a verb tells of something that was true or happened often in the past, but is not true now.\n\n- *I **used to** live in a village.* (Now I live in a city.)\n- *There **used to** be a cinema here.*\n\nIn negatives and questions, *did* carries the past, so the verb is *use to*, with no *d*:\n\n- *I **didn't use to** like coffee.*\n- ***Did** you **use to** play the piano?*\n\n> **Watch out.** Never add *was* before *used to* + base verb (*I was used to live* is wrong), and drop the *-d* after *did/didn't* (*didn't use to*, not *didn't used to*).",
        "*used to* 加动词原形，表示过去常常发生或过去是这样、但现在已经不这样的事情，相当于中文的“以前常常……”“过去曾经……”。\n\n- *I **used to** live in a village.*（现在住在城市。）\n- *There **used to** be a cinema here.*\n\n否定句和疑问句中，过去时已经由 *did* 表示，所以动词用 *use to*，不加 *d*：\n\n- *I **didn't use to** like coffee.*\n- ***Did** you **use to** play the piano?*\n\n> **注意。** 不要在 *used to* + 动词原形前加 *was*（*I was used to live* 是错的），且在 *did/didn't* 后面去掉 *-d*（用 *didn't use to*，不用 *didn't used to*）。",
      ),
      choiceGenerator(
        t("Choose the words for the gap.", "选出填入空白处的词。"),
        usedToChoice,
        (right, shown) => usedWhy(fill(shown, right), shown),
        whyNotUsed,
      ),
    ),
    point(
      "write",
      t("Writing with used to", "用 used to 写句子"),
      t(
        "Write the sentence from the note. For a past habit: *I used to live in a small village.* For one that was not true: *I didn't use to live in a small village.*\n\n> **Watch out.** Keep the verb after *to* in its plain base form (*used to live*, not *used to lived*), and remember *didn't use to* has no *-d*.",
        "根据笔记写句子。过去的习惯：*I used to live in a small village.* 过去不是这样：*I didn't use to live in a small village.*\n\n> **注意。** *to* 后面的动词保持原形（*used to live*，不要写成 *used to lived*），否定句里的 *didn't use to* 不带 *-d*。",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Write a sentence with used to from the note.", "根据笔记用 used to 写一个句子。"),
        usedToTyped,
        (right) => usedWhy(right, right),
      ),
    ),
  ],
};

// The present perfect continuous.

/** activities are a subject, have or has, the base and -ing form of a verb, the rest, a starting point and a length of time. */
const handActivities: readonly (readonly [string, string, string, string, string, string, string])[] = [
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
  ["Lily", "has", "practice", "practicing", "the piano", "2016", "ten years"],
  ["They", "have", "build", "building", "the new bridge", "last spring", "eighteen months"],
];

/** ppcPeople are a subject and its form of have, for the activities anyone could be doing. */
const ppcPeople: readonly (readonly [string, string])[] = [
  ["I", "have"],
  ["She", "has"],
  ["We", "have"],
  ["They", "have"],
  ["My brother", "has"],
  ["Tom", "has"],
  ["You", "have"],
  ["Anna", "has"],
  ["He", "has"],
  ["My parents", "have"],
  ["Lily", "has"],
];

const activities: readonly (readonly [string, string, string, string, string, string, string])[] = [
  ...handActivities,
  ...everyPair(
    ppcPeople,
    handActivities.filter(([subject]) => subject !== "It" && subject !== "The baby"),
  ).map(([[subject, have], [, , base, ing, rest, since, dur]]) => [subject, have, base, ing, rest, since, dur] as const),
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
    return [`${words(s, "___", rest, "for", dur)}.`, `${have} been ${ing}`, [`${be} ${ing}`, `${have} ${ing}`, `${have} being ${ing}`]];
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

/** ppcRule names the form of the present perfect continuous with since or for. */
function ppcRule(sentence: string): Text {
  const time = /.*\b((?:since|for) .+?)\.?$/u.exec(sentence)?.[1] ?? "";
  return t(
    `The action began in the past and is still going on (*${time}*), so use *have* or *has*, *been* and the *-ing* form`,
    `动作从过去开始、现在还在进行（*${time}*），所以用 *have / has*、*been* 加 *-ing*`,
  );
}

/** ppcWhy puts the rule of the present perfect continuous before a sentence. */
const ppcWhy = (sentence: string, shown: string): Text => {
  const rule = ppcRule(shown);
  return t(
    `${rule.en}: ${sentence}\n\n**Check.** Verify all three pieces of the verb phrase: *have/has* (matching the subject) + *been* + *-ing*.`,
    `${rule["zh-CN"]}：${sentence}\n\n**检验。** 核对动词短语的三个部分：与主语一致的 *have/has* + *been* + 动词 *-ing*。`,
  );
};

/** whyNotPpc explains the present continuous, a missing have, or a missing been. */
const whyNotPpc = (wrong: string): Text => {
  const [first0 = ""] = wrong.split(" ");
  if (wrong.includes(" being "))
    return t(
      `*${wrong}* uses *being* (the *-ing* form of *be*), not the past participle *been* required after *${first0}*.`,
      `*${wrong}* 用了 *be* 的 *-ing* 形式 *being*，而不是 *${first0}* 后面要求的过去分词 *been*。`,
    );
  if (/^(am|is|are)$/u.test(first0) && wrong.includes(" been "))
    return t(
      `*${first0}* cannot pair with *been*; the present perfect continuous needs *have* or *has* before *been*.`,
      `*${first0}* 不能和 *been* 连用；现在完成进行时在 *been* 前面要用 *have* 或 *has*。`,
    );
  if (/^(am|is|are)$/u.test(first0))
    return t(
      `*${wrong}* is the present continuous, which cannot be paired with *since* or *for* to show how long an action has lasted.`,
      `*${wrong}* 是现在进行时，不能和 *since* 或 *for* 连用来表示动作持续了多久。`,
    );
  return t(
    `*${wrong}* leaves out *been* between *${first0}* and the *-ing* verb.`,
    `*${wrong}* 在 *${first0}* 和 *-ing* 动词之间漏掉了 *been*。`,
  );
};

/** forSinceRule names why a time takes since or for. */
const forSinceRule = (right: string, shown: string): Text => {
  const time = (shown.split("___ ")[1] ?? "").replace(/\.$/u, "");
  return right === "since"
    ? t(`*${time}* is the point when it began, so it takes *since*`, `*${time}* 是开始的时间点，所以用 *since*`)
    : t(`*${time}* is a length of time, so it takes *for*`, `*${time}* 是一段时间，所以用 *for*`);
};

/** whyNotForSince explains for, since, from or during in the wrong place. */
const whyNotForSince = (wrong: string, _right: string, shown: string): Text => {
  const time = (shown.split("___ ")[1] ?? "").replace(/\.$/u, "");
  const use: Record<string, Text> = {
    for: t(`*for* goes before a length of time, but *${time}* is a starting point.`, `*for* 用在一段时间前，而 *${time}* 是开始的时间点。`),
    since: t(
      `*since* goes before a starting point, but *${time}* is a length of time.`,
      `*since* 用在开始的时间点前，而 *${time}* 是一段时间。`,
    ),
    from: t(
      "*from* needs *to* after it and does not replace *since* in this tense.",
      "*from* 需要和 *to* 搭配，不能在这个时态里表示“自从”。",
    ),
    during: t(
      "*during* says when something happened, not how long an action has continued.",
      "*during* 表示在某段时间里，不表示动作持续了多久。",
    ),
  };
  return use[wrong] ?? t(`*${wrong}* does not fit here.`, `这里不能用 *${wrong}*。`);
};

const presentPerfectContinuous: TopicDef = {
  id: "present-perfect-continuous",
  title: t("The Present Perfect Continuous", "现在完成进行时"),
  summary: t(
    "She has been working here since May. I have been waiting for twenty minutes. Have or has, been and -ing, for something that began in the past and is still going on.",
    "She has been working here since May. I have been waiting for twenty minutes. 用 have/has been 加 -ing，表示从过去开始、现在仍在进行的动作。",
  ),
  intro: t(
    "When an activity started earlier and is still underway—*It has been raining since noon* or *They have been practicing for two hours*—English uses *have/has + been + -ing* to link the duration directly to now.",
    "当一个动作从过去开始、此刻仍在进行（*It has been raining since noon* 或 *They have been practicing for two hours*），英语用 *have/has + been + -ing* 把持续的过程一路连到现在。",
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
        "For an action that began in the past and is still going on now, use *have* or *has* + *been* + the *-ing* form.\n\n- *She **has been working** here since May.* (She started in May and still works here.)\n- *I **have been waiting** for twenty minutes.*\n\n> **Watch out.** Do not use the present continuous with *since* or *for* (*She is working here since May* is wrong), and never drop *have/has* or *been* (*She has working* and *She is been working* are both wrong).",
        "从过去开始、一直持续到现在（可能还会继续）的动作，用 *have / has* + *been* + 动词 *-ing*。\n\n- *She **has been working** here since May.*（她从五月开始在这里工作，现在还在。）\n- *I **have been waiting** for twenty minutes.*\n\n> **注意。** 有 *since* 或 *for* 时不能用现在进行时（*She is working here since May* 是错的），也不要漏掉 *have/has* 或 *been*（*She has working*、*She is been working* 都是错的）。",
      ),
      choiceGenerator(
        t("Choose the words for the gap.", "选出填入空白处的词。"),
        ppcChoice,
        (right, shown) => ppcWhy(fill(shown, right), shown),
        whyNotPpc,
      ),
    ),
    point(
      "for-or-since",
      t("For or since?", "for 还是 since？"),
      t(
        "*Since* gives the point when something began: *since May, since 2020, since eight o'clock, since she was six*.\n\n*For* gives how long it has lasted: *for six months, for five years, for twenty minutes*.\n\n> **Watch out.** Do not use *from* for a starting point or *during* for a duration here (*I have been waiting from eight o'clock* is wrong).",
        "*since* 后面是开始的时间点：*since May, since 2020, since eight o'clock, since she was six*。\n\n*for* 后面是持续了多长时间：*for six months, for five years, for twenty minutes*。\n\n> **注意。** 不要受中文“从八点起”影响写成 *from*，也不要用 *during* 代替 *for*（*I have been waiting from eight o'clock* 是错的）。",
      ),
      choiceGenerator(
        t("Choose the word for the gap.", "选出填入空白处的词。"),
        forSinceChoice,
        (right, shown) => {
          const rule = forSinceRule(right, shown);
          return t(
            `${rule.en}: ${fill(shown, right)}\n\n**Check.** Ask whether the phrase answers “since what point?” (*since*) or “for how long?” (*for*).`,
            `${rule["zh-CN"]}：${fill(shown, right)}\n\n**检验。** 判断后面的短语回答的是“从哪个时间点开始”（*since*）还是“持续了多久”（*for*）。`,
          );
        },
        whyNotForSince,
      ),
    ),
    point(
      "write",
      t("Writing in the present perfect continuous", "用现在完成进行时写句子"),
      t(
        "Write the sentence from the note in the present perfect continuous: *She / work / here / since May* → *She has been working here since May.* You may use short forms such as *I've* and *she's*.\n\n> **Watch out.** Check all three parts (*have/has* + *been* + *-ing*) and watch *-ing* spelling changes like *run* → *running* and *practice* → *practicing*.",
        "根据笔记用现在完成进行时写句子：*She / work / here / since May* → *She has been working here since May.* 可以用 *I've*、*she's* 这样的缩写。\n\n> **注意。** 核对三部分是否齐全（*have/has* + *been* + *-ing*），并留意 *-ing* 拼写变化（如 *run* → *running*、*practice* → *practicing*）。",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Write the sentence in the present perfect continuous.", "用现在完成进行时写出这个句子。"),
        ppcTyped,
        (right) => ppcWhy(right, right),
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
  intro: t(
    "Writing to a manager or university office calls for a crisp, polite register: *Dear Ms. Hall, I am writing to apply for the summer position... I would be grateful if you could confirm the interview dates. Yours sincerely, Alex Chen.*",
    "给经理或学校招生办写信需要简洁、礼貌的正式语体：*Dear Ms. Hall, I am writing to apply for the summer position... I would be grateful if you could confirm the interview dates. Yours sincerely, Alex Chen.*",
  ),
  prerequisites: ["writing-an-informal-email"],
  encompasses: [{ topic: "writing-an-informal-email", weight: 0.3 }],
  criteria: ["b1-formal-email-purpose", "b1-formal-register", "b1-polite-requests", "b1-email-paragraphs"],
  point: {
    id: "email",
    title: t("Purpose, register and requests", "目的、语体和请求"),
    explanation: t(
      "A formal email to someone you do not know has its own shape and words:\n\n- **Opening:** *Dear Ms. Hall,* or, if you do not know the name, *Dear Sir or Madam,*\n- **Purpose first:** *I am writing to apply for…* / *I am writing to ask about…*\n- **One paragraph for each point** the task names: your experience, your dates, your questions.\n- **Polite requests:** *Could you tell me…?* *I would be grateful if you could…* *I would like to know…*, not *Tell me…*\n- **Closing:** *I look forward to hearing from you.* Then *Yours sincerely,* (after a name) or *Yours faithfully,* (after *Sir or Madam*), and your full name.\n\n> **Watch out.** Avoid contractions (*I'm*, *don't*) and chatty words (*hi*, *great*, *really*), and match the sign-off to the greeting (*Dear Ms. Hall* → *Yours sincerely*; *Dear Sir or Madam* → *Yours faithfully*).",
      "给不认识的人写的正式邮件，有自己的结构和用词：\n\n- **开头：** *Dear Ms. Hall,*；不知道名字时写 *Dear Sir or Madam,*\n- **先说目的：** *I am writing to apply for…* / *I am writing to ask about…*\n- 任务要求的**每一点写一段**：你的经验、你的时间、你的问题。\n- **礼貌地请求：** *Could you tell me…?* *I would be grateful if you could…* *I would like to know…*，不要说 *Tell me…*\n- **结尾：** *I look forward to hearing from you.* 然后写 *Yours sincerely,*（开头写了名字时）或 *Yours faithfully,*（开头是 *Sir or Madam* 时），再写全名。\n\n> **注意。** 正式邮件中写完整形式（*I am*、*do not*、*I would*）而不用缩写或口语词，并且开头和落款要配对（*Dear Ms. Hall* 配 *Yours sincerely*；*Dear Sir or Madam* 配 *Yours faithfully*）。",
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
