// College writing: the tasks of the executive summary and the research proposal, each with a model answer. The
// organizations and figures are invented.

import type { WritingItem } from "@ga/subject-english";

/** executiveSummaryBank asks for a summary of a report that a busy reader can act on without reading the rest. */
export const executiveSummaryBank: readonly WritingItem[] = [
  {
    task: "Write an executive summary of this report for the city council. State the report's purpose, its main findings and its recommendation, so that a reader who reads nothing else can decide.",
    source:
      "Report: Evening hours at the public library. Purpose: decide whether to keep the library open until 9 p.m. Findings: an average of 140 visitors come between 6 and 9 p.m. each weekday; 60% of them are students, and 25% are adults who work during the day; a survey found that 70% of evening visitors could not come at other times. Evening hours cost 85,000 a year in staff. Cutting them to 8 p.m. would save 30,000 and keep two-thirds of visits.",
    model:
      "This report asks whether the public library should continue to open until 9 p.m. on weekdays. It recommends keeping the evening hours, but closing at 8 p.m. instead of 9 p.m.\n\nThe evening hours are well used. An average of 140 people visit between 6 and 9 p.m. each weekday. Most are students (60%) or adults who work during the day (25%), and 70% of evening visitors told us they could not come at any other time. For these residents, the evening hours are the only access they have to the library.\n\nThe hours cost 85,000 a year in staff. Closing at 8 p.m. would save 30,000 a year while keeping about two-thirds of evening visits, since most visitors arrive before 8. We therefore recommend that the council approve an 8 p.m. closing time from next January and review the number of visitors after one year.",
  },
  {
    task: "Write an executive summary of this report for the school board. State the report's purpose, its main findings and its recommendation, so that a reader who reads nothing else can decide.",
    source:
      "Report: The school recycling trial. Purpose: decide whether to extend a recycling trial from two schools to all twelve. Findings: in the two trial schools, waste sent to landfill fell by 35% in a year; collection costs rose by 4,000 per school, but landfill fees fell by 5,500 per school; students in the trial schools ran the program with one teacher in each school. Extending it to ten more schools would require 20 new bins per school at 50 each.",
    model:
      "This report evaluates a one-year recycling trial in two schools and recommends extending it to all twelve schools in the district from next September.\n\nThe trial worked. In the two schools, the waste sent to landfill fell by 35%. Although recycling collections cost an extra 4,000 per school, landfill fees fell by 5,500, so each school saved 1,500 a year. The program was run largely by students, with one teacher in each school, and required no new staff.\n\nExtending the program to the remaining ten schools would require 20 new bins per school at 50 each, a one-time cost of 10,000. At the trial's rate of savings, this cost would be recovered in less than a year. We recommend that the board approve the purchase and ask each school to name a teacher to lead its program.",
  },
  {
    task: "Write an executive summary of this report for the directors of a company. State the report's purpose, its main findings and its recommendation, so that a reader who reads nothing else can decide.",
    source:
      "Report: Working from home. Purpose: decide whether to make a trial of two days a week at home permanent. Findings: during the six-month trial, productivity stayed the same; staff satisfaction rose from 64% to 81%; sick days fell by 20%; three teams said meetings were harder to organize. Office space could be reduced by a quarter, saving 120,000 a year.",
    model:
      "This report reviews the six-month trial in which staff worked from home two days a week, and recommends making the arrangement permanent.\n\nThe trial brought clear benefits at no cost to output. Productivity stayed the same, while staff satisfaction rose from 64% to 81% and sick days fell by 20%. Because fewer people are in the office on any day, the company could reduce its office space by a quarter, saving about 120,000 a year.\n\nThe main difficulty was organizing meetings: three teams found it harder to bring everyone together. This can be solved by asking each team to choose one shared office day a week.\n\nWe recommend that the directors make two days at home a permanent option from next quarter, require each team to set a shared office day, and begin planning to reduce the office space when the current lease ends.",
  },
  {
    task: "Write an executive summary of this report for the managers of a hospital. State the report's purpose, its main findings and its recommendation, so that a reader who reads nothing else can decide.",
    source:
      "Report: Waiting times in the emergency department. Purpose: find why waits have grown and how to shorten them. Findings: the average wait rose from 2 hours to 3.5 hours in two years; 40% of patients have minor problems that a nurse could treat; the longest waits occur between 6 and 10 p.m.; a nearby hospital cut waits by an hour by opening a nurse-led clinic for minor problems. Cost of such a clinic: 400,000 a year.",
    model:
      "This report examines why waiting times in our emergency department have grown and recommends opening a nurse-led clinic for minor problems.\n\nIn two years, the average wait has risen from 2 hours to 3.5 hours, and the longest waits occur between 6 and 10 p.m. A major cause is that 40% of patients have minor problems, such as small cuts or sprains, which a nurse could treat but which currently wait in the same line as everyone else.\n\nA nearby hospital faced the same problem and cut its waits by an hour by opening a nurse-led clinic for minor problems. A similar clinic here would cost about 400,000 a year.\n\nWe recommend that the hospital open a nurse-led clinic beside the emergency department, staffed at least from 2 p.m. to midnight to cover the busiest hours, and measure its effect on waiting times after six months.",
  },
  {
    task: "Write an executive summary of this report for a charity's board. State the report's purpose, its main findings and its recommendation, so that a reader who reads nothing else can decide.",
    source:
      "Report: The homework club. Purpose: decide whether to continue funding an after-school homework club. Findings: 45 children attended at least twice a week; their teachers reported better completed homework for 38 of them; 30 parents said the club let them work later; attendance fell in the summer term. Cost: 18,000 a year, of which a local business pays 6,000. The business will stop its support next year.",
    model:
      "This report reviews the charity's after-school homework club and recommends continuing it for another year while seeking a new sponsor.\n\nThe club has served its children well. Forty-five children attended at least twice a week, and their teachers reported that 38 of them now complete their homework more fully. The club also helps families: 30 parents said it allows them to work later. Attendance did fall in the summer term, which suggests that the club should consider shorter summer hours.\n\nThe club costs 18,000 a year. A local business currently pays 6,000 of this, but it will end its support next year, leaving a gap of 6,000.\n\nWe recommend that the board fund the club fully for one more year, reduce its hours in the summer term to save money, and begin approaching other local businesses for support before the end of the autumn term.",
  },
  {
    task: "Write an executive summary of this report for the town council. State the report's purpose, its main findings and its recommendation, so that a reader who reads nothing else can decide.",
    source:
      "Report: The proposed bike lane on Main Street. Purpose: decide whether to build a protected bike lane. Findings: a survey of 300 shoppers found that 38% came by car, 41% on foot, 14% by bus and 7% by bicycle; shop owners believed 65% came by car; the lane would remove 30 of 80 parking spaces; in similar towns, sales did not fall after lanes were built. Cost: 250,000, half paid by a national grant.",
    model:
      "This report asks whether the town should build a protected bike lane on Main Street. It recommends building the lane, with measures to reassure shop owners.\n\nThe main concern about the lane is that removing 30 of the street's 80 parking spaces would drive customers away. Our evidence suggests this fear is exaggerated. In a survey of 300 shoppers, only 38% had come by car, while 41% had walked and 21% had come by bus or bicycle. Shop owners, by contrast, believed that 65% came by car. In similar towns, sales did not fall after lanes were built.\n\nThe lane would cost 250,000, half of which would be paid by a national grant.\n\nWe recommend that the council approve the lane and apply for the grant. To address owners' concerns, it should add short-stay parking on two side streets and publish a study of sales one year after the lane opens.",
  },
  {
    task: "Write an executive summary of this report for a university's dean. State the report's purpose, its main findings and its recommendation, so that a reader who reads nothing else can decide.",
    source:
      "Report: The writing center. Purpose: decide whether to expand the writing center's hours. Findings: 1,200 students used the center last year, up from 700; in busy weeks, 35% of students who asked for an appointment could not get one; students who visited three times or more raised their essay grades by half a grade on average. Expansion of 20 hours a week would cost 25,000 a year for two more tutors.",
    model:
      "This report reviews demand for the university's writing center and recommends adding 20 hours of tutoring a week.\n\nUse of the center has grown rapidly: 1,200 students visited last year, compared with 700 the year before. The center can no longer meet demand. In busy weeks, 35% of students who asked for an appointment could not get one, usually just before essays were due.\n\nThe center's tutoring appears to make a difference. Students who visited three or more times raised their essay grades by half a grade on average, although students who return often may also be more motivated than others.\n\nAdding 20 hours a week would require two more part-time tutors, at a cost of 25,000 a year. We recommend that the dean fund the expansion from next term, concentrating the extra hours in the weeks before major deadlines.",
  },
  {
    task: "Write an executive summary of this report for the owner of a small business. State the report's purpose, its main findings and its recommendation, so that a reader who reads nothing else can decide.",
    source:
      "Report: Online sales for the bakery. Purpose: decide whether to start selling online with local delivery. Findings: a survey of 200 customers found that 55% would order online at least once a month; two competitors already deliver; a delivery service would charge 15% of each order; a simple website with ordering would cost 3,000 to build. Expected extra sales: 2,000 a month.",
    model:
      "This report asks whether the bakery should begin selling online with local delivery, and recommends a six-month trial.\n\nThere is clear demand. In a survey of 200 customers, 55% said they would order online at least once a month. Two competitors already offer delivery, so the bakery risks losing customers if it does not.\n\nThe costs are modest. A simple website with ordering would cost 3,000 to build, and a delivery service would charge 15% of each order. If online sales reach the expected 2,000 a month, the bakery would earn about 1,700 a month after delivery fees, recovering the cost of the website in two months.\n\nWe recommend that the bakery build the website and run a six-month trial with the delivery service, then compare actual sales with these estimates before deciding whether to continue.",
  },
  {
    task: "Write an executive summary of this report for a city's parks department. State the report's purpose, its main findings and its recommendation, so that a reader who reads nothing else can decide.",
    source:
      "Report: Lighting in city parks. Purpose: decide whether to dim park lights at night. Findings: in two parks, 7 of 12 nests near lit paths failed, against 3 of 12 in dark areas; residents surveyed want lights on the main paths for safety until 11 p.m.; LED lights that dim after 11 p.m. would cut electricity costs by 40%. Replacing the lights in all parks would cost 180,000.",
    model:
      "This report considers whether the city should dim the lights in its parks at night, and recommends a gradual change to LED lights that dim after 11 p.m.\n\nThe current lighting appears to harm wildlife. In two parks, more than half the nests near lit paths failed, compared with a quarter of those in dark areas. Residents, however, want the main paths lit for safety until 11 p.m.\n\nLED lights that dim automatically after 11 p.m. would meet both needs, keeping the paths bright when people use them and dark later in the night. They would also cut the parks' electricity costs by 40%.\n\nReplacing the lights in all parks would cost 180,000. We recommend that the department replace the lights in the two parks studied first, monitor nests for two springs, and then replace the remaining lights as old ones wear out.",
  },
  {
    task: "Write an executive summary of this report for a school's principal. State the report's purpose, its main findings and its recommendation, so that a reader who reads nothing else can decide.",
    source:
      "Report: The free breakfast program. Purpose: decide whether to continue free breakfast after a one-term trial. Findings: late arrivals fell from 412 to 305; morning visits to the nurse fell from 96 to 71; the bell was also moved five minutes later; about 180 students ate breakfast each day. Cost: 9,000 per term, of which a grant covers 6,000 for one more year.",
    model:
      "This report reviews the first term of the school's free breakfast program and recommends continuing it for at least one more year.\n\nAbout 180 students ate breakfast each day. During the term, late arrivals fell by about a quarter, from 412 to 305, and morning visits to the nurse fell from 96 to 71. Because the bell was moved five minutes later in the same term, not all of the fall in late arrivals can be credited to the breakfast, but the fall in visits to the nurse is a clearer sign of its benefit.\n\nThe program costs 9,000 per term. A grant will cover 6,000 per term for one more year, leaving the school to find 3,000 per term.\n\nWe recommend that the principal continue the program, keep the bell time unchanged next term so that its effect can be measured, and seek a longer-term source of funding before the grant ends.",
  },
  {
    task: "Write an executive summary of this report for the managers of an office. State the report's purpose, its main findings and its recommendation, so that a reader who reads nothing else can decide.",
    source:
      "Report: The staff survey. Purpose: report what staff think and recommend action. Findings: 320 of 400 staff responded; 72% are satisfied with their jobs; 58% say they do not get enough feedback; 64% want more flexible hours; satisfaction is lowest among staff in their first year (55%).",
    model:
      "This report presents the results of the annual staff survey and recommends two actions: regular feedback meetings and a review of flexible hours.\n\nThe survey was answered by 320 of our 400 staff. Overall, 72% are satisfied with their jobs. However, 58% say they do not receive enough feedback on their work, and 64% would like more flexible working hours. Satisfaction is lowest among staff in their first year, only 55%, which suggests that new staff in particular need more support.\n\nWe recommend, first, that every manager hold a feedback meeting with each team member at least twice a year, and monthly with new staff during their first year. Second, we recommend that Human Resources prepare options for flexible hours for the directors to consider by the end of the year.",
  },
  {
    task: "Write an executive summary of this report for a museum's board. State the report's purpose, its main findings and its recommendation, so that a reader who reads nothing else can decide.",
    source:
      "Report: Free entry on Sundays. Purpose: decide whether to make entry free on Sundays. Findings: in a three-month trial, Sunday visitors rose from 600 to 1,900; 40% of Sunday visitors said it was their first visit; ticket income fell by 7,000 a month, but sales in the shop and café rose by 4,500 a month; donations rose by 1,000 a month.",
    model:
      "This report reviews a three-month trial of free entry on Sundays and recommends making it permanent.\n\nThe trial greatly widened the museum's audience. Sunday visitors more than tripled, from 600 to 1,900, and 40% of them said it was their first visit to the museum. Free entry is therefore reaching people the museum has not reached before.\n\nThe financial cost was small. Ticket income fell by 7,000 a month, but sales in the shop and café rose by 4,500 a month and donations by 1,000, so the net cost was about 1,500 a month, or 18,000 a year.\n\nWe recommend that the board make Sunday entry free from next month and seek a sponsor to cover the remaining cost. We also recommend inviting first-time visitors to join the museum's mailing list, so that more of them return.",
  },
];

/** researchProposalBank asks for a short research proposal: the question, its rationale, the method, and a feasible plan. */
export const researchProposalBank: readonly WritingItem[] = [
  {
    task: "Write a short research proposal. Include your research question, why it matters, how you will answer it, and a schedule and budget that show the project is feasible.",
    source:
      "Topic: phone use before bed and sleep among students at your school. Resources: one semester; permission from the school; a budget of 200 for small rewards for participants.",
    model:
      "Research question: Do students at our school who stop using their phones an hour before bed fall asleep sooner and feel more alert in the morning?\n\nRationale: Students are often told to put their phones away before bed, but the advice is rarely tested in real conditions. If it works, it is a free and simple change; if it does not, students and families can stop worrying about it.\n\nMethod: I will recruit 40 volunteers through the school. For two weeks, they will use their phones as usual; for the next two, they will stop an hour before bed. Each morning they will record when they fell asleep and rate their alertness from 1 to 5. I will compare each student's two periods.\n\nSchedule: weeks 1 to 3, permission and recruitment; weeks 4 to 7, data collection; weeks 8 to 11, analysis; weeks 12 to 14, writing.\n\nBudget: 200, for a 5 gift card for each participant who completes the diary.",
  },
  {
    task: "Write a short research proposal. Include your research question, why it matters, how you will answer it, and a schedule and budget that show the project is feasible.",
    source:
      "Topic: why the city's textile mills closed between 1960 and 1980. Resources: one academic year; access to the city archive and the newspaper archive; a budget of 300 for copying and travel.",
    model:
      "Research question: Why did the city's textile mills close between 1960 and 1980, and how did the local newspaper explain the closures to readers at the time?\n\nRationale: The closures cost thousands of jobs and shaped the city that exists today, yet residents still disagree about their causes. Comparing the records with the newspaper's account will show both what happened and what people were told.\n\nMethod: In the city archive, I will study the mills' company records and government reports on the industry to identify the causes of each closure. In the newspaper archive, I will read every article about the mills in the period and record the explanations they gave. I will then compare the two.\n\nSchedule: autumn term, archive research; winter, analysis of the newspaper articles; spring, comparison and writing, with a draft by April.\n\nBudget: 300, of which 200 is for copying documents and 100 for travel to the regional archive.",
  },
  {
    task: "Write a short research proposal. Include your research question, why it matters, how you will answer it, and a schedule and budget that show the project is feasible.",
    source:
      "Topic: whether placing fruit at the front of the school cafeteria line increases how much students eat. Resources: two months; cooperation from cafeteria staff; no budget needed beyond printing.",
    model:
      "Research question: When our school cafeteria places fruit at the front of the line instead of at the end, do students take and eat more of it?\n\nRationale: Studies suggest that where food is placed changes what people choose, but some find the effect fades quickly. A test in our own cafeteria would show whether a free change could improve students' diets here.\n\nMethod: For four weeks, the cafeteria will keep fruit at the end of the line; for the next four, at the front. Cafeteria staff already record how much fruit is served each day, and I will weigh the fruit left on trays at the end of lunch. I will compare the amounts taken and eaten in the two periods, and check whether the effect weakens over the second four weeks.\n\nSchedule: week 1, planning with cafeteria staff; weeks 2 to 9, data collection; weeks 10 and 11, analysis and writing.\n\nBudget: none beyond printing record sheets, which the school will provide.",
  },
  {
    task: "Write a short research proposal. Include your research question, why it matters, how you will answer it, and a schedule and budget that show the project is feasible.",
    source:
      "Topic: who uses the public library in the evening and what they would lose if evening hours were cut. Resources: six weeks; permission from the library; a budget of 100.",
    model:
      "Research question: Who uses our public library between 6 and 9 p.m., and what do they say they would lose if evening hours were cut?\n\nRationale: The library's board will decide next year whether to cut evening hours to save money. At present it knows only how many people visit in the evening, not who they are or how they would be affected. This study will give the board that evidence.\n\nMethod: For three weeks, I will count evening visitors and ask each to complete a short questionnaire about their age, their reason for visiting and whether they could come at another time. I will also interview ten regular evening visitors for about fifteen minutes each.\n\nSchedule: week 1, permission and preparation of the questionnaire; weeks 2 to 4, counts, questionnaires and interviews; weeks 5 and 6, analysis and a report for the board.\n\nBudget: 100, for printing questionnaires and for coffee vouchers for interviewees.",
  },
  {
    task: "Write a short research proposal. Include your research question, why it matters, how you will answer it, and a schedule and budget that show the project is feasible.",
    source:
      "Topic: whether listening to music with or without lyrics affects reading comprehension. Resources: one month; access to a classroom; 60 student volunteers; a budget of 150.",
    model:
      "Research question: Do students who listen to music without lyrics while reading remember more of a passage than students who listen to songs with lyrics or to nothing?\n\nRationale: Most students study with music, and many believe it helps them focus. Earlier research suggests that lyrics may compete with reading for attention, but few studies have tested this with students like ours. The results could help students choose how they study.\n\nMethod: I will divide 60 volunteers at random into three groups of 20. Each group will read the same 800-word passage in the same classroom, one with instrumental music, one with songs with lyrics and one in silence. They will then answer ten questions about the passage. I will compare the groups' average scores.\n\nSchedule: week 1, preparing the passage and questions and recruiting volunteers; week 2, the sessions; weeks 3 and 4, analysis and writing.\n\nBudget: 150, for headphones and snacks for participants.",
  },
  {
    task: "Write a short research proposal. Include your research question, why it matters, how you will answer it, and a schedule and budget that show the project is feasible.",
    source:
      "Topic: how immigration after 2000 changed the small businesses on the city's main street. Resources: one semester; access to the city's business license records; a budget of 250.",
    model:
      "Research question: How did the arrival of immigrant families after 2000 change the number and kinds of small businesses on our city's main street?\n\nRationale: Debates about immigration often rely on national figures or opinions. This study will provide local evidence of how one street changed, which residents and the city council can use in their own discussions.\n\nMethod: Using the city's business license records, I will list every business on the main street in 2000, 2010 and 2020, noting its type and how long it lasted. I will then interview eight owners, including both newer immigrant owners and owners of older shops, about how the street has changed.\n\nSchedule: weeks 1 to 5, collecting and organizing the license records; weeks 6 to 9, interviews; weeks 10 to 12, analysis; weeks 13 to 15, writing.\n\nBudget: 250, for copying records and for small thank-you gifts for interviewees.",
  },
  {
    task: "Write a short research proposal. Include your research question, why it matters, how you will answer it, and a schedule and budget that show the project is feasible.",
    source:
      "Topic: whether students who take notes by hand understand a course better over a whole term. Resources: one term; two sections of the same course; permission from the teacher; no budget.",
    model:
      "Research question: Over a whole term, do students who take notes by hand understand a course's ideas better than students who type their notes?\n\nRationale: Studies of single lectures suggest that handwriting helps students understand ideas, but students take notes over whole courses and review them. No study has compared the methods over a term, which is the setting that matters most to students.\n\nMethod: With the teacher's permission, students in each of two sections of the same course will be assigned at random to take notes either by hand or on a laptop for the whole term. At the end, I will compare the two groups' scores on the final exam's essay questions, which test ideas, and its multiple-choice questions, which test facts.\n\nSchedule: weeks 1 and 2, consent and random assignment; weeks 3 to 14, the course; weeks 15 and 16, analysis of exam scores and writing.\n\nBudget: none; the course and exams already exist.",
  },
  {
    task: "Write a short research proposal. Include your research question, why it matters, how you will answer it, and a schedule and budget that show the project is feasible.",
    source:
      "Topic: whether young people in the Tolo villages would use the language online. Resources: three months; help from a local teacher; a budget of 500 for travel and a simple website.",
    model:
      "Research question: Would young people in the Tolo villages use their language more if it had a place online?\n\nRationale: Tolo has about 300 speakers left, and young people see it as useful only at home. Schools and radio have helped other minority languages, but the villages control neither. The internet could give Tolo a public role that the community controls itself.\n\nMethod: First, with the help of a local teacher, I will survey about 45 people aged 14 to 25 about their use of Tolo and their interest in online content. Then I will create a simple page with Tolo music and short audio news for one month and record how many young people visit and share it, to see whether their stated interest becomes real use.\n\nSchedule: month 1, survey; month 2, building the page and recording content with local speakers; month 3, running the page and analyzing visits.\n\nBudget: 500, of which 300 is for travel to the villages and 200 for the website.",
  },
  {
    task: "Write a short research proposal. Include your research question, why it matters, how you will answer it, and a schedule and budget that show the project is feasible.",
    source:
      "Topic: how much cooler shaded pavement is than sunlit pavement on summer afternoons. Resources: one summer; an infrared thermometer, which costs 60; no other budget.",
    model:
      "Research question: On summer afternoons, how much cooler is pavement in the shade of trees than pavement in full sun, and how does the difference compare with the difference in air temperature?\n\nRationale: Studies of trees in cities measure the temperature of the air, but people walking and children playing also feel the heat of the ground. If trees cool the ground much more than the air, the city's tree-planting plan may be undervaluing them.\n\nMethod: I will choose three streets with different amounts of tree cover. On ten afternoons in July, I will measure the surface temperature at 20 points on each street with an infrared thermometer, half in shade and half in sun, and the air temperature a meter above each point. I will compare the averages.\n\nSchedule: June, choosing streets and testing the thermometer; July, measurements; August, analysis and writing.\n\nBudget: 60, for the infrared thermometer.",
  },
  {
    task: "Write a short research proposal. Include your research question, why it matters, how you will answer it, and a schedule and budget that show the project is feasible.",
    source:
      "Topic: how teenagers judge whether a headline is true when a friend shares it. Resources: two months; access to 120 students through classes; permission from the school; no budget.",
    model:
      "Research question: Are students at our school more likely to believe a false headline when it appears to have been shared by a friend?\n\nRationale: Most teenagers get their news from social media, and interviews suggest that they trust friends more than news outlets. If an experiment confirms this, media lessons should focus on the influence of friends, not only on judging websites.\n\nMethod: With the school's permission, 120 students will each see ten headlines, half true and half false. For half of the students, each headline will appear to be shared by a named friend; for the other half, posted by an unknown account. Students will rate how believable each headline is. I will compare the ratings of false headlines in the two conditions. Afterward, I will explain which headlines were false.\n\nSchedule: weeks 1 to 3, permission and preparation of the headlines; weeks 4 and 5, sessions in classes; weeks 6 to 8, analysis and writing.\n\nBudget: none; the survey will run on school computers.",
  },
  {
    task: "Write a short research proposal. Include your research question, why it matters, how you will answer it, and a schedule and budget that show the project is feasible.",
    source:
      "Topic: how changes in the date the river first freezes have affected local farmers. Resources: one academic year; the city's records of the river since 1950; a budget of 150 for travel.",
    model:
      "Research question: How have the dates on which our city's river first freezes changed since 1950, and what do local farmers say those changes have meant for their planting?\n\nRationale: Climate change can feel distant when it is described only in global averages. This study connects it to a local record that residents know and to the decisions of farmers who depend on the seasons.\n\nMethod: First, I will collect the date on which the river first froze each winter from the city's records since 1950 and look for a trend, using ten-year averages to smooth out unusual years. Second, I will interview six farmers who have worked near the river for at least twenty years about how the seasons have changed and how they have adapted.\n\nSchedule: autumn, collecting and analyzing the records; winter, interviews; spring, combining the two and writing.\n\nBudget: 150, for travel to the farms.",
  },
  {
    task: "Write a short research proposal. Include your research question, why it matters, how you will answer it, and a schedule and budget that show the project is feasible.",
    source:
      "Topic: how the town's high street shops have responded to online shopping since 2010. Resources: one semester; the town's business directories; a budget of 100.",
    model:
      "Research question: How have the shops on our town's high street responded to online shopping since 2010, and which kinds of shop have survived?\n\nRationale: The town council is planning how to support the high street, but it lacks evidence about which shops have succeeded and why. Many people blame online shopping for every empty shop, while rents and parking may matter as much.\n\nMethod: Using the town's business directories, I will list the shops on the high street in 2010, 2015 and 2020, and record which closed, which opened and what kind each was. I will then interview ten owners, five who have stayed and five who have left, about the reasons for their decisions and what they changed in response to online shopping.\n\nSchedule: weeks 1 to 4, directories; weeks 5 to 9, interviews; weeks 10 to 12, analysis; weeks 13 to 15, writing a report for the council.\n\nBudget: 100, for printing and small thank-you gifts for the owners.",
  },
];
