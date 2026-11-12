// Grade 10: the batches of words of courses and campus, of college life, of crime, of travel, of the city, of
// the office, of media and of amounts and cases.

import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const courses = batch(
  "words-of-courses-and-campus",
  ["Words of Courses and Campus", "课程与校园的词"],
  ["what is taught, when and where in a school or college", "学校或大学里教什么、何时与何地"],
  `
  curriculum|the subjects that make up a course of study|课程(总体)|Music is part of the ___.|The new ___ starts next year.|Schools follow a national ___.|syllabus,seminar|curricula,curriculums
  syllabus|an outline of the topics in one course|教学大纲|Read the ___ before class.|The exam covers the whole ___.|The ___ lists every book.|curriculum,transcript|syllabi,syllabuses
  seminar|a class at which a small group discusses a topic|研讨课|She led a ___ on poetry.|The ___ meets on Fridays.|We have a history ___.|tutorial,curriculum|seminars
  tutorial|a period of teaching given to one student or a small group; a guide that explains how to do something|个别辅导；教程|I have a ___ with my professor.|Watch the video ___.|The ___ explains each step.|seminar,semester|tutorials
  semester|half of a school or college year|学期|The ___ starts in September.|She studied abroad for a ___.|Finals come at the end of the ___.|tutorial,enroll|semesters
  enroll|to officially register as a member of a course or school|注册，入学|You must ___ by Friday.|She chose to ___ in a dance class.|Thousands ___ each year.|semester,faculty|enrolled,enrollment
  faculty|the teaching staff of a college; a natural ability|全体教员；能力|The ___ met to vote.|He lost the ___ of speech.|She joined the ___ last year.|campus,enroll|faculties
  campus|the grounds and buildings of a college|校园|She lives on ___.|The ___ is near the sea.|We toured the ___.|dormitory,faculty|campuses
  dormitory|a building where students live|宿舍|First-year students live in a ___.|The ___ was noisy.|Lights go out in the ___ at ten.|campus,transcript|dormitories
  transcript|an official record of a student's grades; a written copy of speech|成绩单；文字记录|Send your ___ with the form.|Read the ___ of the speech.|Her ___ shows straight A's.|syllabus,dormitory|transcripts
  `,
);

const college = batch(
  "words-of-college-life",
  ["Words of College Life", "大学生活的词"],
  ["paying for study, the years of college, finishing and cheating", "求学费用、大学各年级、毕业与作弊"],
  `
  tuition|money paid for teaching; teaching|学费；教学|___ rises every year.|She gets private ___ in math.|Who pays your ___?|scholarship,diploma|
  scholarship|money given to support a student; serious study|奖学金；学问|She won a ___ to Oxford.|His ___ is admired.|The ___ covers her fees.|tuition,diploma|scholarships
  freshman|a first-year student|一年级学生|She is a ___ at college.|___ year was hard.|The ___ got lost on campus.|sophomore,undergraduate|freshmen
  sophomore|a second-year student|二年级学生|He is a ___ in high school.|My ___ year was the best.|The ___ class won.|freshman,alumni|sophomores
  undergraduate|a student studying for a first degree|本科生|She is an ___ at Yale.|___ courses are full.|He teaches ___ students.|graduate,freshman|undergraduates
  graduate|to complete a degree; a person who has one|毕业；毕业生|She will ___ in June.|He is a law ___.|Few ___ without debt.|undergraduate,dropout|graduated,graduation
  dropout|a person who leaves school before finishing|辍学者|He was a high school ___.|The ___ rate is falling.|She is a college ___.|graduate,alumni|dropouts
  alumni|former students of a school or college|校友(复数)|The ___ gave money to the school.|She met ___ at the party.|Famous ___ include two presidents.|dropout,sophomore|alumnus
  diploma|a certificate given for completing a course|毕业证书|She received her ___.|He framed his ___.|A ___ in nursing.|scholarship,tuition|diplomas
  plagiarism|taking someone else's work and passing it off as one's own|剽窃|___ is cheating.|He was expelled for ___.|Software checks for ___.|dropout,diploma|plagiarize,plagiarized
  `,
);

const crime = batch(
  "words-of-crime",
  ["Words of Crime", "犯罪的词"],
  ["stealing, damaging, fire, taking people and getting out", "偷窃、破坏、纵火、劫持与释放"],
  `
  theft|the action of stealing|盗窃|He was charged with ___.|Car ___ is rising.|Report the ___ to the police.|burglar,forgery|thefts
  burglar|a person who breaks into a building to steal|入室窃贼|A ___ broke into our house.|The ___ took the TV.|Lock the door to stop a ___.|theft,vandal|burglars,burglary
  shoplift|to steal goods from a shop|在商店行窃|Kids may ___ for fun.|It is a crime to ___.|She was caught trying to ___.|theft,smuggling|shoplifted,shoplifter,shoplifting
  vandal|a person who deliberately damages property|破坏公物者|A ___ smashed the window.|Who is the ___?|The ___ sprayed paint.|burglar,arson|vandals,vandalism,vandalize
  arson|the crime of deliberately setting fire to property|纵火罪|Police suspect ___.|He was jailed for ___.|The fire was ___.|vandal,ransom|arsonist
  smuggling|moving goods illegally into or out of a country|走私|Drug ___ is a serious crime.|They were caught ___ cigarettes.|___ is common at the border.|shoplift,forgery|smuggle,smuggler,smuggled
  forgery|making a false copy of a document or painting; such a copy|伪造；伪造品|The painting was a ___.|He was jailed for ___.|The ___ fooled the bank.|smuggling,theft|forger
  ransom|money demanded for the release of a captive|赎金|They paid a ___.|The kidnappers demanded a ___.|He was held for ___.|hostage,parole|ransoms
  hostage|a person held captive to force others to act|人质|Rebels took a ___.|The ___ was set free.|Two ___ are still held.|ransom,parole|hostages
  parole|the release of a prisoner before the end of a sentence|假释|He was released on ___.|She broke her ___.|The board denied ___.|hostage,arson|paroled
  `,
);

const travel = batch(
  "words-of-travel",
  ["Words of Travel", "旅行的词"],
  ["plans, bags, leaving, trips, stops and tiredness from flying", "行程、行李、出发、出游、中转与时差"],
  `
  itinerary|a planned route or journey|旅行计划|Check the ___ before you go.|Our ___ includes Rome.|The guide gave us an ___.|excursion,layover|itineraries
  luggage|suitcases and bags for travel|行李|Don't leave your ___ alone.|My ___ was lost.|Put the ___ in the trunk.|cabin,hostel|
  departure|the act of leaving; a change from the usual|离开；背离|Check the ___ time.|The new plan is a ___ from the past.|Her ___ was sudden.|layover,disembark|departures
  excursion|a short journey for pleasure|远足，短途旅行|We went on an ___ to the lake.|The school ___ is next week.|The ship offers an ___.|cruise,itinerary|excursions
  cruise|a voyage on a ship for pleasure; to sail or drive at a steady speed|乘船游览；巡航|We went on a ___.|Cars ___ along the coast.|The ___ ship docked.|excursion,cabin|cruised,cruising
  cabin|a small wooden house; a room on a ship or plane|小木屋；船舱|We stayed in a ___ by the lake.|The ___ crew served drinks.|Go to your ___.|hostel,luggage|cabins
  hostel|a cheap place for travelers to stay|旅舍|We slept in a youth ___.|The ___ was full.|A ___ is cheap.|cabin,cruise|hostels
  layover|a short stay at a place on a long journey|中途停留|We have a ___ in Dubai.|The ___ lasted six hours.|A long ___ is tiring.|departure,jet lag|layovers
  disembark|to leave a ship or plane|下船，下飞机|Passengers may now ___.|We ___ at the port.|Please wait to ___.|departure,layover|disembarked
  jet lag|tiredness after a long flight across time zones|时差反应|I had bad ___.|___ kept me awake.|Drink water to fight ___.|layover,luggage|
  `,
);

const city = batch(
  "words-of-the-city",
  ["Words of the City", "城市的词"],
  ["the center, the edges, traffic, police areas and renting", "市中心、市郊、交通、警区与租房"],
  `
  downtown|the central area of a city|市中心(的)|Let's go ___.|The ___ shops close early.|She works ___.|suburban,boulevard|
  suburban|relating to the area at the edge of a city|郊区的|They live in a ___ house.|___ life is quiet.|___ trains are crowded.|downtown,sprawl|
  sprawl|the spread of a city into the countryside; to sit or lie with limbs spread out|扩张；四肢摊开|Urban ___ eats up farmland.|He chose to ___ on the sofa.|The city continues to ___.|congestion,suburban|sprawled,sprawling
  congestion|overcrowding, especially of traffic|拥堵|Traffic ___ is bad today.|A tax may cut ___.|Nasal ___ is a cold sign.|sprawl,commuter|congested
  commuter|a person who travels regularly to work|通勤者|The train was full of ___.|A ___ may spend hours on the road.|Every ___ hates delays.|congestion,tenant|commuters
  boulevard|a wide street, often lined with trees|林荫大道|They walked along the ___.|The ___ was lit up.|Shops line the ___.|downtown,precinct|boulevards
  precinct|a district of a city for police; an area closed to traffic|警区；步行区|The ___ has a new chief.|Shoppers fill the ___.|Each ___ has a station.|zoning,boulevard|precincts
  zoning|dividing land into areas for different uses|分区规划|___ laws ban factories here.|The ___ board met.|Change the ___ to build homes.|precinct,landlord|zoned
  tenant|a person who rents a place from a landlord|房客|The ___ pays rent each month.|She is a good ___.|The new ___ moved in.|landlord,commuter|tenants
  landlord|a person who rents out property|房东|The ___ raised the rent.|Call the ___ about the leak.|Our ___ is kind.|tenant,zoning|landlords,landlady
  `,
);

const office = batch(
  "words-of-the-office",
  ["Words of the Office", "职场的词"],
  ["bosses, notes, pay, rising up and leaving work", "上司、便条、薪水、晋升与离职"],
  `
  supervisor|a person who oversees work|主管|Ask your ___ for help.|The ___ checked our work.|She was made ___.|intern,payroll|supervisors,supervise
  intern|a student or trainee who works to gain experience|实习生|She is an ___ at the bank.|The ___ made coffee.|Each summer we hire an ___.|supervisor,memo|interns,internship
  memo|a short written message in an office|备忘录|Read the ___ from the boss.|She sent a ___ to all staff.|The ___ was leaked.|payroll,workload|memos
  workload|the amount of work to be done|工作量|My ___ is heavy.|They shared the ___.|Cut your ___.|schedule,memo|workloads
  schedule|a plan of times for events; to arrange for a time|日程表；安排|Check the train ___.|Let's ___ a meeting.|We are behind ___.|workload,promotion|scheduled,schedules
  payroll|a list of employees and what they are paid|工资单|There are 50 people on the ___.|The ___ is done monthly.|___ costs are high.|memo,supervisor|payrolls
  promotion|being raised to a higher position; publicity for a product|升职；促销|She got a ___.|The ___ boosted sales.|He hopes for a ___.|schedule,resign|promotions
  resign|to give up a job|辞职|He chose to ___ after the scandal.|She may ___ next week.|Why did you ___?|retire,promotion|resigned,resignation
  retire|to leave one's job and stop working, usually because of age|退休|He plans to ___ at sixty.|She chose to ___ early.|Most people ___ later now.|resign,intern|retired,retirement
  task|a piece of work to be done|任务|Finish each ___ on time.|It was a hard ___.|She gave me a ___.|workload,supervisor|tasks
  `,
);

const media = batch(
  "words-of-media",
  ["Words of Media", "媒体的词"],
  ["newspapers, shows, attention and online worlds", "报纸、节目、关注与网络世界"],
  `
  editorial|a newspaper article giving the editor's opinion|社论|The ___ attacked the plan.|She writes the ___.|Read today's ___.|columnist,publicity|editorials
  columnist|a journalist who writes a regular column|专栏作家|The ___ writes on sport.|A famous ___ came to school.|The ___ was fired.|editorial,subscriber|columnists
  subscriber|a person who pays to receive a publication or service|订户|The paper lost a ___ last week.|Each ___ gets a free gift.|She is a ___ to the magazine.|columnist,podcast|subscribers,subscribe,subscription
  podcast|a digital audio program one can download|播客|I listen to a ___ on the bus.|She hosts a ___.|The ___ is about history.|subscriber,series|podcasts
  series|a number of similar things coming one after another; a set of TV shows|系列；连续剧|The TV ___ has ten episodes.|A ___ of events led to war.|He wrote a ___ of books.|podcast,medium|
  medium|a means of sending information; middle in size|媒介；中等的|TV is a powerful ___.|I'd like a ___ coffee.|Clay is her favorite ___.|series,virtual|media
  publicity|notice or attention given by the media|宣传，名声|The film got lots of ___.|She hates ___.|Bad ___ hurt sales.|editorial,label|publicize
  label|a piece of paper attached to something giving information; to describe unfairly|标签；贴标签|Read the ___ on the bottle.|Don't ___ people.|The ___ shows the price.|publicity,device|labeled,labels
  device|a thing made for a particular purpose|装置，设备|Turn off every ___.|A clever ___ opens cans.|Phones are a useful ___.|label,virtual|devices
  virtual|almost as described; existing on computers|实际上的；虚拟的|We had a ___ meeting.|It was a ___ certainty.|She visited a ___ museum.|medium,device|virtually
  `,
);

const amounts = batch(
  "academic-words-of-amounts-and-cases",
  ["Academic Words of Amounts and Cases", "数量与事例的学术词"],
  ["size, how often, examples, rules and stress", "规模、频率、例子、规范与强调"],
  `
  bulk|the mass or size of something large; the greater part|大量；大部分|Buy rice in ___.|The ___ of the work is done.|His ___ filled the door.|capacity,incidence|bulky
  capacity|the maximum amount something can hold; ability|容量；能力|The hall has a ___ of 500.|She has a ___ for hard work.|The tank is at full ___.|bulk,mode|capacities
  incidence|the rate at which something happens|发生率|The ___ of crime is falling.|There is a high ___ of flu.|Study the ___ of the disease.|instance,bulk|
  instance|an example of something|实例|For ___, take apples.|This is an ___ of bad luck.|In this ___ we agree.|incidence,guideline|instances
  guideline|a general rule or principle|指导方针|Follow the safety ___.|The school gave us a ___.|Each ___ is clear.|instance,emphasis|guidelines
  emphasis|special importance given to something|强调|The ___ is on safety.|She spoke with ___.|Put the ___ on the first word.|guideline,ignorance|emphasize,emphases
  mode|a way in which something is done; a setting on a device|方式；模式|Put your phone in silent ___.|Travel by ___ of transport.|The camera has a night ___.|capacity,dispose|modes
  dispose|to get rid of; to throw away|处理，丢弃|___ of waste safely.|How do we ___ of old phones?|Please ___ of your trash.|mode,implicate|disposed,disposal,disposable
  implicate|to show someone to be involved in a crime|牵连|The letter may ___ the mayor.|Evidence will ___ him.|Don't ___ me.|dispose,ignorance|implicated
  ignorance|lack of knowledge|无知|___ of the law is no excuse.|His ___ shocked us.|Fear comes from ___.|emphasis,implicate|ignorant,ignore
  `,
);

/** batchesF are the batches of courses, college, crime, travel, the city, the office, media and amounts. */
export const batchesF: readonly BatchSpec[] = [courses, college, crime, travel, city, office, media, amounts];
