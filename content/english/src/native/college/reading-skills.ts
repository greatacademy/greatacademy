// College writing: the reading topics of the course: the moves of an academic argument, telling scholarly sources
// from others, tracing a claim to its source, the parts of a research paper, prose style, numbers in arguments,
// workplace documents and requests for proposals.

import { type KnowledgePointDef, type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point } from "@ga/subject-english";
import {
  abstractMoveStep,
  actionStep,
  dataConclusionStep,
  faithfulReportStep,
  planCheckStep,
  sectionStep,
  sourceForNeedStep,
  styleChoiceStep,
} from "./reading-steps.ts";

/** pick takes an element of a list by an index that may run past its end. */
const pick = <T>(list: readonly T[], i: number): T => list[i % list.length] as T;

/** labelled turns lines of a text and its label, separated by a bar, into items whose wrong options are two other labels. */
const labelled = (lines: string, labels: readonly string[]): ChoiceItem[] =>
  lines
    .trim()
    .split("\n")
    .map((line, i): ChoiceItem => {
      const [shown, right] = line.trim().split("|");
      const others = labels.filter((l) => l !== right);
      const wrong = others.length <= 2 ? others : [pick(others, i), pick(others, i + 1)];
      return [(shown ?? "").replaceAll("\\n", "\n"), right ?? "", wrong];
    });

/** interleave takes one item from each list in turn, so that consecutive items differ in their label. */
const interleave = (lists: readonly (readonly ChoiceItem[])[]): ChoiceItem[] => {
  const longest = Math.max(...lists.map((l) => l.length));
  const out: ChoiceItem[] = [];
  for (let i = 0; i < longest; i++) for (const list of lists) if (i < list.length) out.push(list[i] as ChoiceItem);
  return out;
};

/** labelTopic builds a reading topic of one knowledge point whose items each take one of a few labels. */
const labelTopic = (spec: {
  id: string;
  title: Text;
  summary: Text;
  prerequisites: string[];
  encompasses: { topic: string; weight: number }[];
  point: string;
  pointTitle: Text;
  explanation: Text;
  question: Text;
  bank: readonly ChoiceItem[];
  why: Readonly<Record<string, readonly [string, string]>>;
  zh: Readonly<Record<string, string>>;
  /** next is the knowledge point that follows, from recognizing a part to using it. */
  next: KnowledgePointDef;
}): TopicDef => ({
  id: spec.id,
  title: spec.title,
  summary: spec.summary,
  prerequisites: spec.prerequisites,
  encompasses: spec.encompasses,
  xp: 16,
  strand: "reading",
  knowledgePoints: [
    point(
      spec.point,
      spec.pointTitle,
      spec.explanation,
      choiceGenerator(
        spec.question,
        spec.bank,
        (right) =>
          t(`It is **${right}**. ${spec.why[right]?.[0] ?? ""}`, `这是**${spec.zh[right] ?? right}**。${spec.why[right]?.[1] ?? ""}`),
        (wrong, right) =>
          t(
            `It is not ${wrong} but **${right}**. ${spec.why[right]?.[0] ?? ""}`,
            `这不是${spec.zh[wrong] ?? wrong}，而是**${spec.zh[right] ?? right}**。${spec.why[right]?.[1] ?? ""}`,
          ),
      ),
    ),
    spec.next,
  ],
});

// Reading academic arguments.

const question = "the question";
const earlier = "earlier work";
const claim = "the claim";
const evidence = "the evidence";
const limitation = "a limitation";

const movesBank = labelled(
  `
  This article asks why some cities recover quickly from floods while others take decades.|${question}
  Previous studies have found that sleep improves memory, but almost all of them tested adults.|${earlier}
  We argue that the decline was caused mainly by a change in farming practices.|${claim}
  In our survey of 1,200 students, those who started school a year later scored 8 points higher on reading tests.|${evidence}
  Because every student in our sample came from one city, our results may not hold elsewhere.|${limitation}
  We set out to learn whether children who start school later read better at the age of ten.|${question}
  Smith (2015) and Lee (2018) both argued that the war began over trade, not religion.|${earlier}
  This paper contends that the novel is best read as a satire of the court.|${claim}
  Records from the city archive show that the king was abroad on the date the third letter was written.|${evidence}
  Our survey relied on what teenagers said they did, which may differ from what they actually do.|${limitation}
  The central question of this study is how teenagers decide which news to trust.|${question}
  Most historians have assumed that the letters were written by the king himself.|${earlier}
  Our central claim is that start times matter more than the length of the school day.|${claim}
  Across 40 sites, nests near bright lights were abandoned twice as often as nests in dark areas.|${evidence}
  We could not measure noise and light separately at every site, so their effects may overlap.|${limitation}
  What, then, explains the sudden fall in the number of bees in the 1990s? That is the puzzle this paper addresses.|${question}
  Earlier research on city birds has focused on noise rather than light.|${earlier}
  I will show that the letters were written not by the king but by his secretary.|${claim}
  Hospital admissions for asthma fell by 12% in the two years after the law took effect.|${evidence}
  The records from before 1850 are incomplete, which limits what we can say about the earlier period.|${limitation}
  This essay asks whether the novel's ending should be read as hopeful or as tragic.|${question}
  A large body of work shows that tutoring helps struggling readers.|${earlier}
  The evidence presented here supports a simple conclusion: light, not noise, drives the birds away.|${claim}
  In interviews, 31 of the 40 teenagers said they shared stories without opening them.|${evidence}
  This study followed students for only two years, so the long-term effects remain unknown.|${limitation}
  Our study investigates how much of a language learner's progress depends on time spent speaking.|${question}
  Since the 1970s, economists have debated whether raising the minimum wage costs jobs.|${earlier}
  In short, we find that teenagers trust the friend who shares a story more than the source that published it.|${claim}
  When we compared the handwriting of the letters with known samples, all three matched the secretary's.|${evidence}
  Since participants chose whether to take part, they may have been more motivated than most students.|${limitation}
  The question we address is simple: did the new law actually reduce air pollution?|${question}
  Garcia's influential study of 2009 claimed that homework has no effect before high school.|${earlier}
  We conclude that the law reduced pollution, but by far less than its supporters promised.|${claim}
  Figure 2 shows that the number of hives fell by half in the decade after the new pesticide came into use.|${evidence}
  We studied only one pesticide, so we cannot say whether others have similar effects.|${limitation}
`,
  [question, earlier, claim, evidence, limitation],
);

// Finding scholarly sources.

const scholarly = "a scholarly source";
const popular = "a popular source";
const unreliable = "an unreliable source";

const sourceBank = labelled(
  `
  An article in a journal of psychology, reviewed by three experts before publication, with a methods section and forty references.|${scholarly}
  A magazine feature about sleep, written by a journalist who interviewed two researchers, with no list of references.|${popular}
  A website with no author or date, selling a supplement that it says doctors do not want you to know about.|${unreliable}
  A book from a university press by a historian, with notes citing letters held in national archives.|${scholarly}
  A newspaper article reporting the results of a new study, with a link to the original paper.|${popular}
  A post on social media claiming that a famous scientist said something, with no link to where she said it.|${unreliable}
  A report of a clinical trial in a medical journal, listing its authors' universities and any funding they received.|${scholarly}
  A science book written for general readers by a well-known science writer, with a short reading list.|${popular}
  A video by an anonymous account claiming that the moon landing was faked.|${unreliable}
  A review article in a journal of ecology that sums up 120 earlier studies on the decline of bees.|${scholarly}
  A television documentary about the fall of Rome, presented by a historian.|${popular}
  A study on a company's website showing that the company's own product works best, with no methods given.|${unreliable}
  A paper in a peer-reviewed journal of economics, with an abstract, tables of data and a list of references.|${scholarly}
  A blog post by a teacher describing what she has learned from twenty years in the classroom.|${popular}
  An online article full of spelling errors that cites experts but never names them.|${unreliable}
  A paper by two engineers, checked by a review committee and published in the proceedings of a conference.|${scholarly}
  A newspaper's interview with a climate scientist about her latest findings.|${popular}
  A post on a forum in which a user says he cured his illness with lemon juice.|${unreliable}
  A doctoral thesis held by a university library, with its data and full bibliography.|${scholarly}
  A page on a museum's website explaining how the pyramids were built, written for visitors.|${popular}
  A website whose research page has no references and whose authors cannot be found.|${unreliable}
  An article in a law review by a professor of law, with hundreds of notes citing cases and statutes.|${scholarly}
  A magazine's list of ten tips for a better memory, based on recent research.|${popular}
  An email forwarded many times, claiming that a common food causes cancer.|${unreliable}
  A study in a journal of education comparing test scores in 200 schools, with its survey questions in an appendix.|${scholarly}
  A radio program in which two economists discuss the minimum wage.|${popular}
  A page that copies a news story but changes the numbers and gives no source.|${unreliable}
  A collection from a university press in which each chapter is by a specialist and cites its sources.|${scholarly}
  An encyclopedia entry on honeybees written for students.|${popular}
  A political group's leaflet that reports only the figures supporting its side, without saying where they came from.|${unreliable}
  An article in a journal of linguistics, reviewed anonymously by other linguists, analyzing recordings of 60 speakers.|${scholarly}
  A newspaper column in which a doctor answers readers' questions about diet.|${popular}
  A quotation shared online and credited to a famous writer, which appears in none of her books or speeches.|${unreliable}
`,
  [scholarly, popular, unreliable],
);

// Tracing claims to sources.

const faithful = "faithful to the source";
const exaggerated = "exaggerated";
const broadened = "broadened beyond the source";
const caused = "a link turned into a cause";

/** claimCores are an original finding and four later reports of it: faithful, exaggerated, broadened and causal. */
const claimCores: readonly (readonly [original: string, faithful: string, exaggerated: string, broadened: string, causal: string])[] = [
  [
    "In a study of 300 adults in one city, those who drank coffee daily had a slightly lower rate of heart disease.",
    "A study of 300 adults in one city linked daily coffee to a slightly lower rate of heart disease.",
    "In one city, adults who drank coffee daily had a dramatically lower rate of heart disease, a study found.",
    "Coffee drinkers everywhere have a slightly lower rate of heart disease, a study found.",
    "Drinking coffee every day lowers your risk of heart disease, a study found.",
  ],
  [
    "A survey of 1,000 teenagers in three countries found that those who used social media for more than five hours a day were more likely to report feeling anxious.",
    "In a survey of 1,000 teenagers in three countries, heavy users of social media more often reported anxiety.",
    "A survey found that almost every teenager who spends five hours a day on social media reports anxiety.",
    "People of all ages who use social media heavily are more likely to feel anxious, a survey found.",
    "Five hours a day on social media makes teenagers anxious, a survey found.",
  ],
  [
    "Records from 50 hospitals show that patients stayed for shorter periods, on average, where there were more nurses per bed.",
    "In records from 50 hospitals, patients' stays were shorter on average where each bed had more nurses.",
    "Records from 50 hospitals show that patients stay half as long where there are more nurses.",
    "In clinics and care homes of every kind, more staff goes with shorter stays, records show.",
    "Hiring more nurses will shorten hospital stays, according to records from 50 hospitals.",
  ],
  [
    "At one university, students who took notes by hand scored somewhat higher on questions about ideas than those who typed, with no difference on questions about facts.",
    "At one university, students who wrote their notes by hand did somewhat better on questions about ideas, though not on questions about facts.",
    "At one university, students who wrote their notes by hand did far better on every kind of question.",
    "Learners of all ages who write by hand understand ideas somewhat better, a study found.",
    "Taking notes by hand improves understanding, a study at one university proved.",
  ],
  [
    "In a study of 12 lakes in northern Canada, lakes near roads had higher levels of salt than lakes far from roads.",
    "Of 12 lakes studied in northern Canada, those near roads had higher levels of salt.",
    "Of 12 lakes in northern Canada, those near roads had dangerously high levels of salt.",
    "Lakes near roads all over the world have higher levels of salt, a study found.",
    "Salt from roads is raising the salt in lakes, a study in northern Canada showed.",
  ],
  [
    "Countries that spend more on schools tend to have higher average test scores, though several high-spending countries score below average.",
    "Across countries, higher spending on schools tends to go with higher test scores, but with notable exceptions.",
    "Across countries, higher spending on schools always goes with higher test scores.",
    "Spending more on public services of every kind goes with better results, a study of test scores shows.",
    "Raising school budgets will raise test scores, a study of many countries found.",
  ],
  [
    "A 2019 survey of 500 workers at one company found that those who worked from home two days a week reported higher job satisfaction.",
    "At one company, a 2019 survey of 500 staff found that those working from home two days a week said they were more satisfied with their jobs.",
    "At one company, staff who worked from home two days a week reported vastly higher job satisfaction, a 2019 survey found.",
    "Workers in every industry who work from home report higher job satisfaction, a survey found.",
    "Working from home two days a week raised job satisfaction at one company, a 2019 survey showed.",
  ],
  [
    "Among 2,000 older adults followed for ten years, those who spoke two languages were diagnosed with memory loss about four years later, on average, than those who spoke one.",
    "In a ten-year study of 2,000 older adults, people who spoke two languages were diagnosed with memory loss about four years later on average.",
    "Older adults who speak two languages almost never develop memory loss, a ten-year study found.",
    "People of every age who speak two languages have better memories, a study found.",
    "Learning a second language will delay memory loss by four years, a study found.",
  ],
];

const claimLabels = [faithful, exaggerated, broadened, caused];

const traceBank: ChoiceItem[] = claimCores.flatMap((core, i) => {
  const [original, ...reports] = core;
  return reports
    .map((report, k): ChoiceItem => {
      const right = claimLabels[k] ?? faithful;
      const others = claimLabels.filter((l) => l !== right);
      return [`Original study: ${original}\n\nLater report: ${report}`, right, [pick(others, i + k), pick(others, i + k + 1)]];
    })
    .map((_, k, all) => all[(k + i) % all.length] as ChoiceItem);
});

// Reading a research paper.

const abstract = "the abstract";
const introduction = "the introduction";
const methods = "the methods";
const results = "the results";
const discussion = "the discussion";

const paperBank = interleave([
  labelled(
    `
    This study of 400 teenagers found that each extra hour of sleep was linked to higher scores on a memory test, which suggests that school start times deserve attention.|${abstract}
    Observing 60 nests in three cities, we found that nests near bright lights failed more often, which suggests that light, more than noise, affects birds in cities.|${abstract}
    Comparing 120 primary schools, this study finds no clear link between the amount of homework set and children's progress in reading.|${abstract}
    Using sales records from 500 shops, this paper shows that new bike lanes did not reduce sales, contrary to the fears of many shop owners.|${abstract}
    In a ten-year study of 2,000 older adults, speaking two languages was linked to a later diagnosis of memory loss.|${abstract}
    In an experiment with 150 students, those who took notes by hand understood ideas somewhat better than those who typed, though both groups remembered facts equally well.|${abstract}
    Measuring street temperatures in 14 neighborhoods, this study finds that streets with more trees were up to three degrees cooler on summer afternoons.|${abstract}
  `,
    [abstract, introduction, methods, results, discussion],
  ),
  labelled(
    `
    Teenagers sleep less than any other age group, yet little research has asked how this affects what they remember from school.|${introduction}
    Birds are moving into cities around the world, and researchers have asked how they cope with noise; far fewer have studied light.|${introduction}
    Parents and teachers disagree sharply about homework for young children, and earlier studies have reached opposite conclusions.|${introduction}
    When cities add bike lanes, shop owners often protest that losing parking spaces will drive customers away.|${introduction}
    As populations age, researchers are searching for habits that may protect memory, and the use of languages is one candidate.|${introduction}
    Laptops have become common in lecture halls, and teachers wonder whether typing notes changes what students learn.|${introduction}
    Cities are warmer than the countryside around them, and planners need to know which measures cool streets most cheaply.|${introduction}
  `,
    [abstract, introduction, methods, results, discussion],
  ),
  labelled(
    `
    Each participant wore a sleep tracker for two weeks and then took a standard memory test in the school library.|${methods}
    We visited each nest every three days from April to July and measured the light and noise at night with handheld meters.|${methods}
    We asked teachers in 120 schools how many minutes of homework they set each week and collected the schools' reading results for three years.|${methods}
    We obtained monthly sales figures for 500 shops on streets that gained bike lanes and 500 similar shops on streets that did not.|${methods}
    Participants reported the languages they used each day, and doctors recorded any diagnosis of memory loss during the ten years.|${methods}
    We randomly assigned 150 students to take notes by hand or on a laptop during the same recorded lecture, and tested them a week later.|${methods}
    Sensors on lamp posts recorded the temperature every ten minutes from June to August, and tree cover was measured from aerial photographs.|${methods}
  `,
    [abstract, introduction, methods, results, discussion],
  ),
  labelled(
    `
    Participants who slept more than eight hours a night scored on average 11 points higher than those who slept fewer than six.|${results}
    Of the nests in brightly lit areas, 41% failed, compared with 18% of the nests in dark areas.|${results}
    Schools that set more than an hour of homework a week made the same average progress as schools that set none.|${results}
    Over three years, sales on streets with new lanes rose by 4%, against 3% on the comparison streets.|${results}
    Bilingual participants were diagnosed on average four years later than those who spoke one language.|${results}
    The group who wrote by hand scored 7% higher on questions about ideas, while scores on questions about facts did not differ.|${results}
    For every 10% increase in tree cover, afternoon temperatures were on average 0.6 degrees lower.|${results}
  `,
    [abstract, introduction, methods, results, discussion],
  ),
  labelled(
    `
    These findings agree with studies of adults, but because we measured sleep for only two weeks, longer studies are needed.|${discussion}
    Light may disturb the birds' sleep or attract predators; either explanation would fit our data, and experiments could tell them apart.|${discussion}
    The absence of a link does not prove that homework is useless; its quality, which we did not measure, may matter more than its amount.|${discussion}
    Shop owners may overestimate how many customers arrive by car; a survey of shoppers would help to test this explanation.|${discussion}
    Because people were not assigned to speak two languages, other differences between the groups, such as education, may explain part of the gap.|${discussion}
    Writing by hand may force students to summarize rather than copy, which could explain their better grasp of ideas.|${discussion}
    Trees appear to cool streets more than light-colored roofs do, as earlier models predicted, though our sample of neighborhoods was small.|${discussion}
  `,
    [abstract, introduction, methods, results, discussion],
  ),
]);

// Analyzing prose style.

const short = "short sentences for emphasis";
const long = "a long sentence that builds";
const formal = "formal, technical diction";
const informal = "plain, informal diction";
const repetition = "repetition for rhythm";

const styleBank = interleave([
  labelled(
    `
    The door opened. No one came in. We waited.|${short}
    He lost the race. He lost the prize. He did not lose his temper.|${short}
    The bridge held. Then it didn't.|${short}
    She read the letter twice. Then she burned it.|${short}
    It was cold. It was dark. It was the best night of my life.|${short}
    Nobody spoke. Nobody moved. The clock went on ticking.|${short}
    The town had one road. It flooded every spring.|${short}
  `,
    [short, long, formal, informal, repetition],
  ),
  labelled(
    `
    She walked out of the hospital, past the empty benches and the closed shop and the line of taxis waiting in the rain, and only when she reached the corner did she let herself cry.|${long}
    The river rose through the night, over the path, over the low wall, over the first step of the church and then the second, until by dawn the whole village stood in brown water.|${long}
    He had expected many things of the city, the noise, the crowds, the prices, the lonely evenings in a rented room, but he had not expected to love it.|${long}
    The argument moves slowly, from the history of the law to the cases that tested it to the families those cases ruined, so that by the time it reaches its claim, the reader is ready to accept it.|${long}
    They climbed for six hours, through pine forest and then bare rock and then snow that came up to their knees, and at the top they found only fog.|${long}
    Year after year the factory grew, adding a wing, a second chimney, a railway siding and a thousand workers, until the town seemed to exist only to serve it.|${long}
    The scientist checked the data again, and then a third time, and then asked a colleague to check it, before she allowed herself to believe what it showed.|${long}
  `,
    [short, long, formal, informal, repetition],
  ),
  labelled(
    `
    The administration of the compound resulted in a statistically significant reduction in systolic blood pressure.|${formal}
    Participants were stratified by age and assigned to conditions using a randomized block design.|${formal}
    The tenant shall indemnify the landlord against all claims arising from the use of the premises.|${formal}
    Sediment cores indicate a marked increase in deposition following the clearance of upland forest.|${formal}
    The model assumes that agents maximize expected utility under conditions of perfect information.|${formal}
    Complications after the operation were observed in a minority of cases and resolved without intervention.|${formal}
    The committee notes with concern the absence of adequate provision for the maintenance of existing infrastructure.|${formal}
  `,
    [short, long, formal, informal, repetition],
  ),
  labelled(
    `
    Honestly, the test was a mess, and nobody knew what the second question was even asking.|${informal}
    So we grabbed our bags, ran for the bus, and missed it anyway.|${informal}
    Look, if the plan costs too much, let's just say so and start again.|${informal}
    My grandma never threw anything away; her garage was basically a museum of old jars.|${informal}
    The movie was fine, I guess, but the popcorn was the best part.|${informal}
    Here's the thing: most people don't read the instructions, and that's okay.|${informal}
    We figured the storm would pass us by, but nope, the roof leaked all night long.|${informal}
  `,
    [short, long, formal, informal, repetition],
  ),
  labelled(
    `
    We will rebuild the school, we will rebuild the library, and we will rebuild the hope that the flood took from us.|${repetition}
    Every morning she wrote, every afternoon she walked, and every evening she read what she had written and tore half of it up.|${repetition}
    It was not the money that mattered, not the fame, not the prizes; it was the work.|${repetition}
    They came by train, they came by bus, they came on foot, and still they came.|${repetition}
    Read the question, read it again, and read it once more before you write a single word.|${repetition}
    What we need is more teachers, more books, more time and more patience.|${repetition}
    The house was quiet, the street was quiet, the whole city was quiet in the hour before dawn.|${repetition}
  `,
    [short, long, formal, informal, repetition],
  ),
]);

// Reading charts and statistics.

const supported = "a supported conclusion";
const correlation = "correlation taken as cause";
const small = "too small a sample";
const misleading = "a misleading comparison";

const statsLabels = [supported, correlation, small, misleading];

const statsBank = interleave([
  labelled(
    `
    Data: In a national survey of 20,000 households, spending on food rose from 12% to 15% of income between 2015 and 2020.\\nConclusion: Households spent a larger share of their income on food in 2020 than in 2015.|${supported}
    Data: Across 300 schools chosen at random, those given free breakfast for a year saw attendance rise by 3 points, while similar schools without it saw no change.\\nConclusion: In this trial, free breakfast was followed by a small rise in attendance.|${supported}
    Data: A chart of the city's air shows the number of days of heavy pollution falling every year from 2010 to 2022.\\nConclusion: Days of heavy pollution became less common in the city over the period.|${supported}
    Data: Records from 40 hospitals show that 8% of patients caught an infection in 2018 and 5% in 2022, after a campaign for hand washing began in 2019.\\nConclusion: Infection rates fell after the campaign began, though the records alone cannot show that the campaign caused the fall.|${supported}
    Data: A poll of 2,500 voters, with a margin of error of 2 points, shows Candidate A at 52% and Candidate B at 41%.\\nConclusion: Candidate A leads by more than the margin of error.|${supported}
    Data: Census figures show the city's median age rising from 34 to 39 between 2000 and 2020.\\nConclusion: The city's population grew older on average over those twenty years.|${supported}
    Data: In a controlled trial with 5,000 patients, those given the new drug had 30% fewer heart attacks than those given a sugar pill.\\nConclusion: The drug reduced heart attacks among patients like those in the trial.|${supported}
    Data: Weather records for 150 years show average July temperatures in the region rising by 1.2 degrees.\\nConclusion: July in the region has become warmer, on average, over the period.|${supported}
  `,
    statsLabels,
  ),
  labelled(
    `
    Data: Cities with more libraries have lower rates of crime.\\nConclusion: Building libraries reduces crime.|${correlation}
    Data: Students who eat breakfast get better grades.\\nConclusion: Eating breakfast makes students smarter.|${correlation}
    Data: Countries that drink more milk win more Olympic medals.\\nConclusion: Drinking milk makes athletes better.|${correlation}
    Data: People who own expensive running shoes run more often.\\nConclusion: Buying expensive shoes will make you run more.|${correlation}
    Data: Towns with more police officers report more crimes.\\nConclusion: Police officers cause crime.|${correlation}
    Data: Children who have more books at home score higher on reading tests.\\nConclusion: Giving every family books will raise reading scores.|${correlation}
    Data: Employees who use the company gym take fewer sick days.\\nConclusion: The gym keeps employees healthy.|${correlation}
    Data: Areas that sell more ice cream have more cases of sunburn.\\nConclusion: Eating ice cream causes sunburn.|${correlation}
  `,
    statsLabels,
  ),
  labelled(
    `
    Data: Of the five customers we asked, four preferred the new design.\\nConclusion: Eighty percent of all customers prefer the new design.|${small}
    Data: Two of the three students who used the app improved their grades.\\nConclusion: The app improves the grades of most students.|${small}
    Data: A town of 200 people had three cases of a rare illness this year, against one last year.\\nConclusion: The illness is spreading rapidly across the country.|${small}
    Data: In one week of watching, a single family of foxes ate mostly insects.\\nConclusion: Foxes live mainly on insects.|${small}
    Data: The six volunteers who took the supplement felt more energetic.\\nConclusion: The supplement boosts energy in adults.|${small}
    Data: Of the ten people at the meeting, seven supported the plan.\\nConclusion: Most residents of the city support the plan.|${small}
    Data: A reviewer tried four phones of one brand, and two broke within a month.\\nConclusion: Half of all phones of that brand break within a month.|${small}
    Data: Three of the four restaurants on one street closed after the bike lane opened.\\nConclusion: Bike lanes are closing restaurants across the city.|${small}
  `,
    statsLabels,
  ),
  labelled(
    `
    Data: City A had 500 car thefts last year and City B had 100, but City A has ten times as many people.\\nConclusion: Cars are far safer in City B.|${misleading}
    Data: A chart's vertical axis starts at 95%, so a rise in satisfaction from 96% to 98% looks like a tripling.\\nConclusion: Satisfaction tripled this year.|${misleading}
    Data: The company compares this December's sales with last July's and reports a rise of 40%.\\nConclusion: The company's sales are growing fast.|${misleading}
    Data: Deaths from a disease rose from 1,000 to 1,200 a year over thirty years, while the population doubled.\\nConclusion: The disease has become more deadly.|${misleading}
    Data: A new school reports the average test score of its 20 best students and compares it with the district's average for all students.\\nConclusion: The new school outperforms the district.|${misleading}
    Data: A drug lowered the risk of a rare illness from 2 in 10,000 to 1 in 10,000.\\nConclusion: Because the drug halves the risk, it gives large protection to each person who takes it.|${misleading}
    Data: A chart shows only the three years in which the town's population grew, leaving out the ten in which it shrank.\\nConclusion: The town is growing steadily.|${misleading}
    Data: Country X spends twice as much on health as Country Y in total, but Country X has five times as many people.\\nConclusion: Country X spends more on each person's health.|${misleading}
  `,
    statsLabels,
  ),
]);

// Reading workplace documents.

const required = "a required action";
const optional = "an optional action";
const information = "information only";

const workBank = interleave([
  labelled(
    `
    All staff must complete the online safety course by 30 June.|${required}
    Employees are required to wear their ID badges at all times in the building.|${required}
    Expense claims shall be submitted within 30 days of purchase, with receipts attached.|${required}
    New staff must bring a passport or national ID card on their first day.|${required}
    Before leaving the lab, turn off all gas taps and sign the log.|${required}
    Applicants must include two references with their application.|${required}
    Visitors are required to sign in at reception and wear a visitor's pass.|${required}
    Return the signed contract no later than Friday; the offer lapses after that date.|${required}
    Every report must be checked by a second member of the team before it is sent to a client.|${required}
    All laptops must be locked when left unattended.|${required}
    Requests for leave of more than five days must be approved by your manager two weeks in advance.|${required}
  `,
    [required, optional, information],
  ),
  labelled(
    `
    Staff may work from home on Fridays if their manager agrees.|${optional}
    You are welcome to join the reading group, which meets on the first Tuesday of each month.|${optional}
    Employees who wish to attend the conference may apply for funding.|${optional}
    Applicants may include a portfolio of their work, but this is not required.|${optional}
    Feel free to bring a dish to share at the lunch at the end of the year.|${optional}
    If you would like a printed copy of the handbook, ask at reception.|${optional}
    Staff are encouraged, but not required, to take part in the annual survey.|${optional}
    You may choose either the morning or the afternoon training session.|${optional}
    Volunteers for the charity run can sign up on the board in the kitchen.|${optional}
    Anyone interested in mentoring a new employee can contact Human Resources.|${optional}
    Cycling to work is encouraged; showers are available on the ground floor.|${optional}
  `,
    [required, optional, information],
  ),
  labelled(
    `
    The office will be closed on 1 January.|${information}
    The minutes of last week's meeting are attached for your records.|${information}
    Our new director, Ms. Okafor, joined the company on Monday.|${information}
    Last quarter, sales in the northern region rose by 6%.|${information}
    The cafeteria now serves breakfast from 7:30 a.m.|${information}
    The parking lot behind the building has 40 spaces.|${information}
    At last week's meeting, the managers agreed that the budget will be reviewed in March.|${information}
    For your reference, the policy on overtime is printed on page 12 of the handbook.|${information}
    The new printer on the second floor prints in color.|${information}
    Work on the east wing is expected to finish in May.|${information}
    The company was founded in 1985 by two engineers.|${information}
  `,
    [required, optional, information],
  ),
]);

// Reading requests for proposals.

const eligible = "who may apply";
const judged = "how proposals will be judged";
const submit = "what to submit and when";
const covers = "what the funding covers";

const rfpLabels = [eligible, judged, submit, covers];

const rfpBank = interleave([
  labelled(
    `
    Applicants must be registered charities based in the region.|${eligible}
    Only schools with fewer than 500 students are eligible.|${eligible}
    Proposals are invited from teams that include at least one researcher at a university.|${eligible}
    Individuals under 18 may apply only with a sponsoring teacher.|${eligible}
    The fund is open to community groups that have been active for at least two years.|${eligible}
    Businesses with more than 50 employees are not eligible for this grant.|${eligible}
    Each organization may submit only one proposal in each round.|${eligible}
    Applicants who received a grant in the past twelve months may not apply again this year.|${eligible}
  `,
    rfpLabels,
  ),
  labelled(
    `
    Proposals will be scored out of 100: 40 points for the benefit to the community, 30 for the plan and 30 for the cost.|${judged}
    Reviewers will give priority to projects that can continue after the grant ends.|${judged}
    Each proposal will be judged on the clarity of its objectives and how they will be measured.|${judged}
    Preference will be given to projects that involve young people in planning.|${judged}
    The panel will assess whether the budget is realistic for the work described.|${judged}
    Projects that work with local businesses will receive extra points.|${judged}
    Proposals will be ranked by the number of people they are likely to reach.|${judged}
    Reviewers will consider the team's experience with similar projects.|${judged}
  `,
    rfpLabels,
  ),
  labelled(
    `
    Proposals must not exceed five pages, in a font size of at least 11 points.|${submit}
    The deadline for applications is 5 p.m. on 15 March; late proposals will not be read.|${submit}
    Attach a budget of one page and a letter of support from a partner organization.|${submit}
    Submit your proposal as a single PDF through the online portal.|${submit}
    Include a timeline showing each milestone of the project.|${submit}
    A summary of no more than 200 words must appear on the first page.|${submit}
    Two printed copies must reach our office by 1 April.|${submit}
    The proposal must give the name and role of every member of the team.|${submit}
  `,
    rfpLabels,
  ),
  labelled(
    `
    Grants of up to \\$10,000 are available for projects lasting no more than one year.|${covers}
    Funds may be used for equipment and materials, but not for salaries.|${covers}
    The grant will pay for travel within the country but not abroad.|${covers}
    Up to 10% of the grant may be spent on administration.|${covers}
    Successful projects will receive half the money at the start and half after a progress report.|${covers}
    The fund does not pay for food or entertainment.|${covers}
    Grants can pay for training volunteers but not for buying land or buildings.|${covers}
    Each award covers the full cost of the project, up to a limit of \\$25,000.|${covers}
  `,
    rfpLabels,
  ),
]);

/** readingSkillTopicsCollege are the reading topics of the college writing course. */
export const readingSkillTopicsCollege: readonly TopicDef[] = [
  labelTopic({
    id: "reading-academic-arguments",
    title: t("Reading Academic Arguments", "阅读学术论证"),
    summary: t(
      "The question an article asks, the earlier work it answers, its claim, its evidence and its limits.",
      "一篇文章提出的问题、它所回应的已有研究、它的主张、证据和局限。",
    ),
    prerequisites: ["evaluating-sources", "rhetorical-situation"],
    encompasses: [{ topic: "rhetorical-situation", weight: 0.1 }],
    point: "the-moves-of-an-article",
    pointTitle: t("The Moves of an Article", "文章的论证步骤"),
    explanation: t(
      "An academic article is a turn in a conversation among researchers, and nearly every sentence makes one of five **moves**.\n\n- **The question**: what the article sets out to answer (*This article asks why...*).\n- **Earlier work**: what others have found or argued, often with names and years (*Previous studies have found...*). The article usually answers it by filling a gap, extending it, or disagreeing.\n- **The claim**: the article's own answer (*We argue that...*, *We conclude that...*).\n- **The evidence**: data, records, quotations or results that support the claim, often with numbers.\n- **A limitation**: what the evidence cannot show (*Because our sample came from one city...*).\n\nReading critically starts with sorting the sentences into these moves. Then you can ask whether the evidence really supports the claim, and whether the limitations are as small as the authors hope.",
      "一篇学术文章是研究者之间对话中的一次发言，几乎每个句子都在完成五种**论证步骤**之一。\n\n- **问题**：文章要回答什么（*This article asks why...*）。\n- **已有研究**：别人已经发现或论证了什么，常带有人名和年份（*Previous studies have found...*）。文章通常通过填补空白、加以拓展或提出异议来回应它。\n- **主张**：文章自己的答案（*We argue that...*、*We conclude that...*）。\n- **证据**：支持主张的数据、记录、引文或结果，常带有数字。\n- **局限**：证据无法说明的东西（*Because our sample came from one city...*）。\n\n批判性阅读从把句子归入这些步骤开始。然后你就可以追问：证据是否真的支持主张，局限是否像作者希望的那样小。",
    ),
    question: t("Which move does this sentence from an article make?", "文章中的这个句子完成的是哪一个论证步骤？"),
    bank: movesBank,
    why: {
      [question]: ["It states what the article sets out to find out or explain.", "它说明文章要探究或解释的是什么。"],
      [earlier]: [
        "It reports what other researchers have already found, argued or assumed.",
        "它转述其他研究者已经发现、论证或假定的东西。",
      ],
      [claim]: ["It states the article's own answer, the position the authors defend.", "它陈述文章自己的答案，即作者所捍卫的立场。"],
      [evidence]: ["It gives data, records or results that support the claim.", "它给出支持主张的数据、记录或结果。"],
      [limitation]: [
        "It admits what the evidence cannot show or where it may not apply.",
        "它承认证据无法说明的东西，或可能不适用的范围。",
      ],
    },
    zh: { [question]: "问题", [earlier]: "已有研究", [claim]: "主张", [evidence]: "证据", [limitation]: "局限" },
    next: abstractMoveStep,
  }),
  labelTopic({
    id: "finding-scholarly-sources",
    title: t("Finding Scholarly Sources", "查找学术资料"),
    summary: t(
      "Peer review, abstracts and references, and telling a scholarly source from a popular or an unreliable one.",
      "同行评审、摘要和参考文献，以及区分学术资料、大众资料和不可靠的资料。",
    ),
    prerequisites: ["evaluating-sources"],
    encompasses: [{ topic: "evaluating-sources", weight: 0.3 }],
    point: "telling-sources-apart",
    pointTitle: t("Telling Sources Apart", "区分资料类型"),
    explanation: t(
      "Research papers rest on **scholarly** sources, so learn to recognize them.\n\n- A **scholarly source** is written by experts for experts and checked before publication, usually by **peer review**: other researchers read it anonymously and recommend changes or rejection. It names its authors and their institutions, explains its methods, and lists its references. Journal articles, books from university presses, theses and conference papers are typical.\n- A **popular source**, such as a newspaper, a magazine, a documentary or a book for general readers, can be accurate and useful for background, but it is written for the public, is not peer reviewed and seldom shows its evidence in full. Follow it back to the study it reports.\n- An **unreliable source** gives no author or no evidence, sells something, or cannot be checked. Do not cite it as evidence.\n\nTo search, use the library's databases rather than a general search engine, read the **abstract** first to decide whether a source fits, and use each good source's reference list to find others.",
      "研究论文建立在**学术**资料之上，所以要学会识别它们。\n\n- **学术资料**由专家为专家撰写，发表前经过审核，通常是**同行评审**：其他研究者匿名审读，并建议修改或拒稿。它写明作者及其所属机构，说明研究方法，列出参考文献。期刊论文、大学出版社的书、学位论文和会议论文都是典型的学术资料。\n- **大众资料**，如报纸、杂志、纪录片或面向普通读者的书，可以准确，也可用作背景，但它是写给公众的，未经同行评审，很少完整展示证据。要顺着它找到它所报道的原始研究。\n- **不可靠的资料**没有作者或没有证据，在推销东西，或者无法核实。不要把它当作证据引用。\n\n查找资料时，用图书馆的数据库而不是普通搜索引擎；先读**摘要**，判断资料是否合用；再利用每份好资料的参考文献找到其他资料。",
    ),
    question: t("What kind of source is this?", "这是哪一类资料？"),
    bank: sourceBank,
    why: {
      [scholarly]: [
        "It is written by experts, checked by other experts before publication, and shows its methods and references.",
        "它由专家撰写，发表前经其他专家审核，并展示了研究方法和参考文献。",
      ],
      [popular]: [
        "It is written for the general public and may be accurate, but it is not peer reviewed and does not show its evidence in full.",
        "它是写给普通公众的，可能准确，但未经同行评审，也没有完整展示证据。",
      ],
      [unreliable]: [
        "It has no author or evidence that can be checked, or it is trying to sell or persuade without support.",
        "它没有可以核实的作者或证据，或者在没有依据的情况下推销或说服。",
      ],
    },
    zh: { [scholarly]: "学术资料", [popular]: "大众资料", [unreliable]: "不可靠的资料" },
    next: sourceForNeedStep,
  }),
  labelTopic({
    id: "tracing-claims-to-sources",
    title: t("Tracing Claims to Sources", "追溯说法的来源"),
    summary: t(
      "Following a claim back to the study it came from, and noticing where it changed on the way.",
      "顺着一个说法找到它所出自的研究，并注意它在传播途中哪里发生了变化。",
    ),
    prerequisites: ["evaluating-sources"],
    encompasses: [{ topic: "evaluating-sources", weight: 0.2 }],
    point: "how-claims-change",
    pointTitle: t("How Claims Change", "说法是怎样变化的"),
    explanation: t(
      "A finding often reaches you second or third hand, through a news story, a post or a textbook, and it may have changed on the way. Before you cite a claim, trace it back to the original study and compare the two.\n\n- **Faithful**: the report keeps the finding's size, certainty and scope.\n- **Exaggerated**: the report makes the effect bigger or surer than it was: *slightly* becomes *dramatically*, *more likely* becomes *almost always*.\n- **Broadened**: the report extends the finding to people, places or things the study never included: one city becomes *everywhere*, teenagers become *people of all ages*.\n- **A link turned into a cause**: the study found that two things go together, and the report says that one *makes*, *lowers* or *raises* the other. Only an experiment can show a cause.\n\nCite the original whenever you can, and describe it as carefully as its authors did.",
      "一个研究发现常常是经过新闻报道、帖子或教科书转了两三手才到你这里的，途中可能已经变了样。引用一个说法之前，要追溯到原始研究，把两者加以比较。\n\n- **忠实于原文**：报道保持了发现的程度、确定性和范围。\n- **夸大**：报道让效果显得比实际更大或更确定：*slightly* 变成 *dramatically*，*more likely* 变成 *almost always*。\n- **扩大范围**：报道把发现推广到研究从未涉及的人群、地方或事物：一座城市变成*各地*，青少年变成*所有年龄的人*。\n- **把关联说成因果**：研究发现两件事同时出现，报道却说其中一件*造成*、*降低*或*提高*了另一件。只有实验才能证明因果。\n\n尽可能引用原始研究，并像其作者那样谨慎地描述它。",
    ),
    question: t("How does the later report treat the original finding?", "后来的报道是怎样对待原始发现的？"),
    bank: traceBank,
    why: {
      [faithful]: ["The report keeps the size, certainty and scope of the original finding.", "报道保持了原始发现的程度、确定性和范围。"],
      [exaggerated]: [
        "The report makes the effect larger or more certain than the study found.",
        "报道让效果显得比研究发现的更大或更确定。",
      ],
      [broadened]: [
        "The report extends the finding to people or places the study did not include.",
        "报道把发现推广到研究未涉及的人群或地方。",
      ],
      [caused]: [
        "The study found only that two things go together, but the report says that one causes the other.",
        "研究只发现两件事同时出现，报道却说其中一件导致了另一件。",
      ],
    },
    zh: { [faithful]: "忠实于原文", [exaggerated]: "夸大", [broadened]: "扩大范围", [caused]: "把关联说成因果" },
    next: faithfulReportStep(claimCores),
  }),
  labelTopic({
    id: "reading-a-research-paper",
    title: t("Reading a Research Paper", "阅读研究论文"),
    summary: t(
      "The abstract, introduction, methods, results and discussion, and what each one tells you.",
      "摘要、引言、方法、结果和讨论，以及每一部分告诉你什么。",
    ),
    prerequisites: ["reading-academic-arguments"],
    encompasses: [{ topic: "reading-academic-arguments", weight: 0.3 }],
    point: "the-parts-of-a-paper",
    pointTitle: t("The Parts of a Paper", "论文的各个部分"),
    explanation: t(
      "Most research papers in the sciences and social sciences follow the same order, and knowing it lets you read them efficiently.\n\n- **The abstract**: the whole study in one paragraph, its question, method, main finding and what it suggests.\n- **The introduction**: why the topic matters, what earlier work has found, and the gap or question this study takes up.\n- **The methods**: who or what was studied and exactly how, in enough detail for someone to repeat it.\n- **The results**: what was found, usually as numbers, tables and figures, without interpretation.\n- **The discussion**: what the results mean, how they fit earlier work, their limitations, and what should be studied next.\n\nRead the abstract first to decide whether the paper is relevant, then the discussion to see what the authors claim, and only then the methods and results to judge whether the claim holds.",
      "理科和社会科学的大多数研究论文都按相同的顺序编排，了解这一点能让你高效地阅读。\n\n- **摘要**：用一段话概括整个研究，包括问题、方法、主要发现及其意义。\n- **引言**：这个主题为什么重要，已有研究发现了什么，本研究要填补的空白或要回答的问题。\n- **方法**：研究了谁或什么，具体是怎样研究的，详细到别人可以重复。\n- **结果**：发现了什么，通常用数字、表格和图表呈现，不加解释。\n- **讨论**：结果意味着什么，与已有研究如何对应，有哪些局限，下一步该研究什么。\n\n先读摘要，判断论文是否相关；再读讨论，看作者主张什么；最后读方法和结果，判断主张是否站得住。",
    ),
    question: t("Which part of a research paper does this sentence most likely come from?", "这个句子最可能出自研究论文的哪一部分？"),
    bank: paperBank,
    why: {
      [abstract]: [
        "It sums up the whole study at once: what was studied, what was found and what it suggests.",
        "它一下子概括了整个研究：研究了什么、发现了什么、说明了什么。",
      ],
      [introduction]: [
        "It explains why the topic matters and what earlier work leaves open, before any of this study's work is described.",
        "它说明主题为什么重要、已有研究留下了什么空白，此时还没有描述本研究的工作。",
      ],
      [methods]: ["It describes exactly how the data were gathered.", "它具体描述数据是怎样收集的。"],
      [results]: ["It reports what was found, in numbers, without explaining what it means.", "它用数字报告发现了什么，而不解释其意义。"],
      [discussion]: [
        "It interprets the findings, offers explanations or admits limits, and points to further work.",
        "它解释发现、提出解释或承认局限，并指出进一步的研究方向。",
      ],
    },
    zh: { [abstract]: "摘要", [introduction]: "引言", [methods]: "方法", [results]: "结果", [discussion]: "讨论" },
    next: sectionStep,
  }),
  labelTopic({
    id: "analyzing-prose-style",
    title: t("Analyzing Prose Style", "分析散文风格"),
    summary: t(
      "Diction, sentence length and rhythm, and how they shape a reader's experience.",
      "措辞、句子长短和节奏，以及它们怎样影响读者的感受。",
    ),
    prerequisites: ["rhetorical-devices"],
    encompasses: [{ topic: "rhetorical-devices", weight: 0.2 }],
    point: "naming-a-style",
    pointTitle: t("Naming a Style", "辨识风格"),
    explanation: t(
      "**Style** is how a writer says something, and it changes what the reader feels. Three things make most of it.\n\n- **Diction**, the choice of words. **Formal, technical** diction uses long, precise and specialized words (*administration of the compound*, *indemnify*); it sounds authoritative and distant. **Plain, informal** diction uses everyday words, contractions and the rhythms of speech (*Honestly, the test was a mess*); it sounds close and personal.\n- **Sentence length**. **Short sentences** in a row slow the reader down and make each fact land hard; they suit shock and emphasis. **A long sentence that builds**, adding phrase after phrase, carries the reader forward and often saves its main point for the end.\n- **Rhythm**. **Repetition** of a word or a structure (*we will rebuild..., we will rebuild...*) gives prose the beat of a speech and binds its ideas together.\n\nTo analyze style, name the feature, quote it, and say what it does to the reader.",
      "**风格**是作者表达的方式，它会改变读者的感受。风格主要由三个方面构成。\n\n- **措辞**，即用词的选择。**正式、专业**的措辞使用长而精确的专门词语（*administration of the compound、indemnify*），听起来权威而有距离感。**朴素、随意**的措辞使用日常词语、缩略形式和口语节奏（*Honestly, the test was a mess*），听起来亲近而个人化。\n- **句子长短**。一连串的**短句**让读者放慢速度，让每个事实都掷地有声，适合表现震惊和强调。**层层推进的长句**一个短语接一个短语地添加，带着读者向前走，常把要点留到最后。\n- **节奏**。词语或结构的**重复**（*we will rebuild..., we will rebuild...*）使文章具有演讲的节拍，并把各个意思联结在一起。\n\n分析风格时，要指出特征、引用原文，并说明它对读者产生了什么作用。",
    ),
    question: t("Which feature of style stands out most in this passage?", "这段文字最突出的风格特征是什么？"),
    bank: styleBank,
    why: {
      [short]: [
        "A run of brief sentences makes each fact land on its own and slows the reader down.",
        "一连串的短句让每个事实单独落地，使读者放慢速度。",
      ],
      [long]: [
        "One sentence adds phrase after phrase, carrying the reader forward toward its point.",
        "一个句子不断添加短语，带着读者一步步走向要点。",
      ],
      [formal]: [
        "The words are long, precise and specialized, as in a scientific, legal or official text.",
        "用词长而精确，专业性强，就像科学、法律或公文文本那样。",
      ],
      [informal]: ["The words are everyday ones, with contractions and the rhythms of speech.", "用的是日常词语，带有缩略形式和口语节奏。"],
      [repetition]: ["A word or a structure is repeated, giving the sentence a strong beat.", "某个词或结构反复出现，使句子有强烈的节拍。"],
    },
    zh: {
      [short]: "用短句强调",
      [long]: "层层推进的长句",
      [formal]: "正式、专业的措辞",
      [informal]: "朴素、随意的措辞",
      [repetition]: "用重复营造节奏",
    },
    next: styleChoiceStep,
  }),
  labelTopic({
    id: "reading-charts-and-statistics",
    title: t("Reading Charts and Statistics", "解读图表与统计数据"),
    summary: t(
      "What data show and hide: correlation and cause, small samples, and misleading comparisons and scales.",
      "数据揭示和掩盖了什么：相关与因果、小样本，以及误导性的比较和刻度。",
    ),
    prerequisites: ["evaluating-sources", "logical-fallacies"],
    encompasses: [{ topic: "logical-fallacies", weight: 0.2 }],
    point: "judging-a-conclusion-from-data",
    pointTitle: t("Judging a Conclusion From Data", "判断由数据得出的结论"),
    explanation: t(
      "Numbers make an argument look solid, so check what they can actually support. Three faults are common.\n\n- **Correlation taken as cause**: two things rise and fall together, and the writer concludes that one causes the other. A third factor may drive both (hot weather sells ice cream and causes sunburn), or the cause may run the other way. Only a controlled experiment shows a cause.\n- **Too small a sample**: a few cases, or cases from one place, are used to describe a whole population.\n- **A misleading comparison**: raw totals compared where rates per person are needed, a chart whose axis does not start at zero, months or groups that are not alike, or only the years that suit the argument.\n\nA **supported conclusion** stays within the data: it describes what was measured, among whom, and with the certainty the method allows.",
      "数字让论证看起来很扎实，所以要检查它们究竟能支持什么。常见的错误有三种。\n\n- **把相关当成因果**：两件事一起升降，作者就断定其中一件导致了另一件。可能是第三个因素同时推动了两者（炎热的天气既卖出冰淇淋又造成晒伤），也可能因果方向正好相反。只有对照实验才能证明因果。\n- **样本太小**：用少数几个案例，或者一个地方的案例，来描述整个群体。\n- **误导性的比较**：在需要比较人均比率时比较总数，图表的纵轴不从零开始，比较的月份或群体并不相似，或者只挑选对论点有利的年份。\n\n**有依据的结论**不超出数据的范围：它描述测量了什么、在哪些人中测量，并且只达到研究方法所允许的确定程度。",
    ),
    question: t("Is the conclusion supported, or what is wrong with it?", "这个结论有依据吗？如果没有，问题出在哪里？"),
    bank: statsBank,
    why: {
      [supported]: [
        "The conclusion stays within what the data measured and claims no more certainty than the method allows.",
        "结论没有超出数据所测量的范围，也没有声称超出研究方法所允许的确定性。",
      ],
      [correlation]: [
        "The data show only that two things go together; another factor, or a cause running the other way, could explain the link.",
        "数据只表明两件事同时出现；另一个因素，或者方向相反的因果关系，也可以解释这种关联。",
      ],
      [small]: [
        "A handful of cases, or cases from one place, cannot describe a whole population.",
        "少数几个案例，或者一个地方的案例，不能代表整个群体。",
      ],
      [misleading]: [
        "The comparison is unfair: totals instead of rates, a stretched scale, unlike groups or times, or data chosen to suit the claim.",
        "这个比较不公平：用总数代替比率、拉伸刻度、比较不相似的群体或时间，或者挑选对说法有利的数据。",
      ],
    },
    zh: { [supported]: "有依据的结论", [correlation]: "把相关当成因果", [small]: "样本太小", [misleading]: "误导性的比较" },
    next: dataConclusionStep,
  }),
  labelTopic({
    id: "reading-workplace-documents",
    title: t("Reading Workplace Documents", "阅读职场文件"),
    summary: t(
      "Policies, postings, minutes and instructions, and telling what they require from what they offer or report.",
      "政策、招聘启事、会议纪要和说明，以及区分其中哪些是要求、哪些是可选、哪些只是告知。",
    ),
    prerequisites: ["text-features"],
    encompasses: [{ topic: "text-features", weight: 0.2 }],
    point: "what-a-document-asks-of-you",
    pointTitle: t("What a Document Asks of You", "文件对你有什么要求"),
    explanation: t(
      "Workplace documents mix three kinds of sentence, and reading them well means telling which is which.\n\n- **A required action** is something you must do. Look for *must*, *shall*, *are required to*, a plain command (*Return the form...*), and deadlines with consequences (*the offer lapses*).\n- **An optional action** is something you may do if you wish. Look for *may*, *can*, *are welcome to*, *are encouraged to*, *feel free to*, *if you would like*, and *not required*.\n- **Information only** asks nothing of you: it reports a fact, a change or a decision (*The office will be closed on 1 January*; *The minutes are attached for your records*).\n\nWhen you read a policy, a job posting or a set of instructions, mark every required action and its deadline first; those are the sentences that cost you if you miss them.",
      "职场文件里混杂着三类句子，读好它们就是要分清哪句属于哪类。\n\n- **必须执行的行动**是你一定要做的事。注意 *must、shall、are required to*、直接的祈使句（*Return the form...*）以及带有后果的截止日期（*the offer lapses*）。\n- **可选的行动**是你愿意就可以做的事。注意 *may、can、are welcome to、are encouraged to、feel free to、if you would like* 和 *not required*。\n- **仅供告知**的句子对你没有任何要求：它报告一个事实、一项变化或一个决定（*The office will be closed on 1 January*；*The minutes are attached for your records*）。\n\n阅读政策、招聘启事或说明时，先标出每一项必须执行的行动及其截止日期，因为错过这些句子会让你付出代价。",
    ),
    question: t("What does this sentence from a workplace document ask of the reader?", "职场文件中的这个句子对读者有什么要求？"),
    bank: workBank,
    why: {
      [required]: [
        "It uses must, shall, is required or a plain command: the reader has to do it.",
        "它用了 must、shall、is required 或直接的祈使句：读者必须这样做。",
      ],
      [optional]: [
        "It uses may, can, is welcome, is encouraged or if you would like: the reader can choose.",
        "它用了 may、can、is welcome、is encouraged 或 if you would like：读者可以自己选择。",
      ],
      [information]: ["It reports a fact or a decision and asks the reader to do nothing.", "它报告一个事实或决定，不要求读者做任何事。"],
    },
    zh: { [required]: "必须执行的行动", [optional]: "可选的行动", [information]: "仅供告知" },
    next: actionStep,
  }),
  labelTopic({
    id: "reading-requests-for-proposals",
    title: t("Reading Requests for Proposals", "阅读项目征集书"),
    summary: t(
      "What a funder asks for: who may apply, how proposals will be judged, what to submit, and what the money covers.",
      "资助方的要求：谁可以申请、提案怎样评审、需要提交什么，以及资金可以用于什么。",
    ),
    prerequisites: ["reading-workplace-documents"],
    encompasses: [{ topic: "reading-workplace-documents", weight: 0.3 }],
    point: "the-parts-of-a-request",
    pointTitle: t("The Parts of a Request", "征集书的各个部分"),
    explanation: t(
      "A **request for proposals** (RFP) is a funder's invitation to apply for money or a contract. Before you write a word of a proposal, read the request and sort its sentences into four kinds.\n\n- **Who may apply**: the eligibility rules. If you do not qualify, nothing else matters.\n- **How proposals will be judged**: the criteria and their weights. Your proposal should answer each one, in the funder's own words where you can.\n- **What to submit and when**: page limits, required sections and attachments, the format and the deadline. Funders often reject proposals that break these rules without reading them.\n- **What the funding covers**: the amount, the time it covers, and what the money may and may not be spent on. Your budget must fit.\n\nMake a checklist from the request and tick off each point as your proposal meets it.",
      "**项目征集书**（request for proposals，简称 RFP）是资助方邀请申请资金或合同的文件。在动笔写提案之前，先读征集书，把其中的句子分成四类。\n\n- **谁可以申请**：申请资格。如果你不符合资格，其他一切都无从谈起。\n- **提案怎样评审**：评审标准及其权重。你的提案应该逐条回应，尽可能使用资助方自己的措辞。\n- **需要提交什么、何时提交**：篇幅限制、必需的部分和附件、格式和截止日期。违反这些规则的提案常常不经审阅就被拒绝。\n- **资金可以用于什么**：金额、资助期限，以及资金可以和不可以用于哪些方面。你的预算必须与之相符。\n\n根据征集书列一张清单，提案每满足一项就勾掉一项。",
    ),
    question: t("Which part of the request for proposals does this sentence belong to?", "这个句子属于项目征集书的哪一部分？"),
    bank: rfpBank,
    why: {
      [eligible]: ["It sets a rule about which people or groups may apply.", "它规定哪些人或团体可以申请。"],
      [judged]: ["It tells applicants what reviewers will look for or score.", "它告诉申请者评审人会关注或打分的内容。"],
      [submit]: ["It sets a rule about the format, the contents or the deadline of the proposal.", "它规定提案的格式、内容或截止日期。"],
      [covers]: ["It says how much money is offered or what it may be spent on.", "它说明提供多少资金或资金可以用于什么。"],
    },
    zh: { [eligible]: "谁可以申请", [judged]: "提案怎样评审", [submit]: "需要提交什么、何时提交", [covers]: "资金可以用于什么" },
    next: planCheckStep,
  }),
];
