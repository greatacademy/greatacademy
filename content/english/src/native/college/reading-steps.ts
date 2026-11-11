// College reading: the second step of eight reading topics, from naming a part to using it: finding a move in an
// abstract, choosing a source for a research need, choosing a faithful report, knowing where to look in a paper,
// choosing a style for a purpose, judging what data support, finding what a message asks of you, and checking a plan
// against a request for proposals.

import { type KnowledgePointDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point } from "@ga/subject-english";
import { bars, fields, kindedChoice, type Label, labelChoice, type Pair } from "../../topics/steps.ts";

// Finding a move in an abstract.

const moveNames = ["the claim", "the evidence", "a limitation"] as const;

const moveUse: Readonly<Record<string, Pair>> = {
  "the claim": ["it states the authors' own answer to the question", "它陈述作者自己对问题的回答"],
  "the evidence": ["it gives the data or results that support the answer", "它给出支持这一回答的数据或结果"],
  "a limitation": ["it admits what the study cannot show or where it may not apply", "它承认研究无法说明的东西或可能不适用的范围"],
  "the question": ["it states what the study set out to find out", "它说明研究想要探究的是什么"],
};

const moveZh: Readonly<Record<string, string>> = {
  "the claim": "主张",
  "the evidence": "证据",
  "a limitation": "局限",
  "the question": "问题",
};

/** abstractLines are the four moves of an abstract: question, claim, evidence and limitation. */
const abstractLines = fields(`
  This study asks whether later school start times improve teenagers' sleep.|We argue that starting school an hour later gives teenagers substantially more sleep.|Students at the eight schools that changed their schedules slept an average of 45 minutes more per night.|Because all eight schools were in one district, the results may not hold elsewhere.
  We ask why some city parks are used far more than others.|We argue that visibility from the street matters more than size or facilities.|Counts at 60 parks showed that parks visible from main roads had three times as many visitors.|Our counts were made only in summer, so seasonal patterns remain unknown.
  This article examines how the printing press changed letter writing in the 1500s.|We claim that printed letter-writing manuals made private letters more uniform.|Of 400 surviving letters, those written after 1550 follow the manuals' formulas far more often.|Surviving letters come mostly from wealthy families, whose habits may not represent others.
  We investigate whether bilingual children switch between tasks more easily.|We find that bilingual children switch tasks faster than monolingual children.|In three timed tests, 120 bilingual children were on average 15% faster.|The study cannot tell whether bilingualism causes the difference or whether other factors explain it.
  Why do some online petitions succeed while others fail?|We argue that a petition's first 24 hours decide its fate.|Petitions that gained 1,000 signatures in their first day were ten times more likely to reach their goal.|We studied only one petition website, so other platforms may behave differently.
  This paper asks how drought affected farming villages in the region from 1870 to 1900.|We contend that drought led families to move to towns rather than to change crops.|Census records show village populations fell by a third during drought years, while crop records barely changed.|Census records may undercount families who moved more than once.
  We ask whether reading on screens reduces comprehension.|We find that readers understand long texts less well on screens than on paper.|In a trial with 300 students, paper readers scored 12% higher on comprehension questions.|The texts were all non-fiction, so the effect on reading fiction is unknown.
  This study examines why volunteers leave community organizations.|We argue that a lack of clear roles drives volunteers away more than a lack of time.|Interviews with 85 former volunteers found that most cited confusion about their tasks.|Former volunteers who agreed to be interviewed may differ from those who did not.
  We investigate how street trees affect summer temperatures in cities.|We find that streets with full tree cover are markedly cooler at midday.|Sensors on 200 streets recorded temperatures up to 4 °C lower under full tree cover.|Measurements covered only one summer, which was unusually hot.
  This article asks how factory closures changed the politics of small towns.|We claim that closures made voters less trusting of all political parties.|Surveys in 40 towns showed trust in parties fell twice as fast where a factory had closed.|Surveys measure what people say, which may differ from how they vote.
`);

const abstractBank: ChoiceItem[] = [];
const abstractMove = new Map<string, string>();
for (const [i, [question, ...rest]] of abstractLines.entries()) {
  if (!question || rest.length !== 3) throw new Error(`an abstract line needs four moves: ${question}`);
  const sentences = [question, ...rest];
  abstractMove.set(question, "the question");
  for (const [k, s] of rest.entries()) abstractMove.set(s, moveNames[k] ?? "");
  const shown = sentences.map((s, k) => `(${k + 1}) ${s}`).join(" ");
  for (const step of [0, 1, 2]) {
    const k = (i + step) % 3;
    const right = rest[k] ?? "";
    const wrong = [rest.filter((_, j) => j !== k)[step % 2] ?? "", question];
    abstractBank.push([`${shown}\n\nWhich sentence states **${moveNames[k]}**?`, right, wrong]);
  }
}

/** abstractMoveStep asks for the sentence of an abstract that makes a named move. */
export const abstractMoveStep = point(
  "finding-the-move",
  t("Finding the Move", "找出论证步骤"),
  t(
    "When you read an abstract or an introduction, you often need one move in particular: what the authors claim, what their evidence is, or what they admit they cannot show. Look for the signals of each.\n\n- **The claim** often follows *we argue*, *we find*, *we contend* or *we claim*, and gives an answer, not a number.\n- **The evidence** gives what was measured or found: numbers, counts, records, results of tests.\n- **A limitation** often contains *may not*, *cannot tell*, *only*, *remains unknown* or *may differ*.\n\nDo not confuse the claim with the question: *This study asks whether...* sets up the inquiry, while *We find that...* answers it.",
    "读摘要或引言时，你常常需要特定的某个步骤：作者主张什么、他们的证据是什么，或者他们承认自己无法说明什么。要找出每一种步骤的信号。\n\n- **主张**常常跟在 *we argue*、*we find*、*we contend*、*we claim* 后面，给出的是一个回答，而不是一个数字。\n- **证据**给出测量或发现的东西：数字、统计、记录、测试结果。\n- **局限**常常含有 *may not*、*cannot tell*、*only*、*remains unknown*、*may differ*。\n\n不要把主张和问题混淆：*This study asks whether...* 提出探究的问题，而 *We find that...* 回答这个问题。",
  ),
  choiceGenerator(
    t("Which sentence of the abstract makes the move named?", "摘要中的哪个句子完成了所指定的论证步骤？"),
    abstractBank,
    (right) => {
      const move = abstractMove.get(right) ?? "";
      const [en, zh] = moveUse[move] ?? ["", ""];
      return t(`*${right}* It states ${move}: ${en}.`, `*${right}* 它陈述的是${moveZh[move] ?? move}：${zh}。`);
    },
    (wrong) => {
      const move = abstractMove.get(wrong) ?? "";
      const [en, zh] = moveUse[move] ?? ["", ""];
      return t(`This sentence states ${move} instead: ${en}.`, `这个句子陈述的是${moveZh[move] ?? move}：${zh}。`);
    },
  ),
);

// Choosing the source for a research need.

/** needBank gives a research need; its wrong options are a popular source on the topic, then a scholarly one that does not fit. */
const needBank = bars(
  `
  Your paper argues about the effect of sleep on memory in teenagers.|A 2021 study in a peer-reviewed psychology journal testing memory in 400 sleep-deprived teenagers|A popular magazine article titled "Ten Sleep Tricks Every Teen Should Know"|A peer-reviewed study from 1965 testing short-term memory in 300 adult factory workers on night shifts
  You need current evidence on how many species of coral are threatened.|A 2023 peer-reviewed survey of coral species published by marine biologists|A travel blog post by a diver describing how many reefs she has seen bleached and dying over twenty years|A peer-reviewed article on coral reproduction in aquariums, with no data on threats
  Your essay examines how the 1918 flu affected city schools.|A peer-reviewed history article analyzing school records from five cities in 1918|A television documentary about famous pandemics|A peer-reviewed medical study comparing the genes of the 2009 flu virus with samples from 1918 patients
  You are researching whether remote work changes employee productivity.|A peer-reviewed economics paper comparing output of 10,000 remote and office workers|A newspaper column in which a manager describes how much more her own team got done after it began working from home|A peer-reviewed paper on the history of office architecture
  Your paper is about the effect of social media on teenage self-esteem.|A peer-reviewed study surveying 3,000 teenagers about social media use and self-esteem|A popular website's list of "Signs You Spend Too Long Online"|A peer-reviewed study of self-esteem in elderly adults who do not use social media
  You need evidence on how well a new reading method works in primary schools.|A peer-reviewed education journal article reporting a trial in 40 primary schools|A teacher's personal blog praising the method after trying it for one week with her own primary school class|A peer-reviewed article on the reading method's use in adult literacy classes in 1980
  Your project asks how a river's pollution affects local fish.|A peer-reviewed environmental science study measuring toxins in the river's fish|A local newspaper story about a fisherman's complaint that the river's fish have grown sick since the factory opened|A peer-reviewed study of pollution in an ocean bay on another continent
  You are writing about the causes of the French Revolution.|A scholarly book by a historian, published by a university press, with archival sources|A best-selling historical novel set in Paris in 1789, about a family caught up in the storming of the Bastille|A scholarly journal article on the Russian Revolution
  You need data on the health effects of air pollution in cities.|A peer-reviewed public health study tracking asthma cases across 50 cities|A celebrity's interview about moving to the countryside for cleaner air|A peer-reviewed study on air quality inside spacecraft
  Your essay is about how children learn to talk.|A peer-reviewed linguistics study recording speech in 200 children from ages one to four|A parenting magazine article titled "Help Your Baby Say Their First Word"|A peer-reviewed study recording how young parrots learn to imitate the sounds and words of their owners
  You are researching whether minimum wage increases affect employment.|A peer-reviewed economics study comparing employment in neighboring states before and after wage increases|A political party's leaflet arguing that higher wages cost jobs|A peer-reviewed study on wages in ancient Rome
  Your paper examines the decline of honeybee populations in Europe.|A 2022 peer-reviewed study counting hives across twelve European countries|A gardening website's article about planting flowers that bees like|A peer-reviewed article from 1970 counting the decline of honeybee populations across South America
  You need evidence on whether video games improve problem-solving.|A peer-reviewed psychology experiment comparing problem-solving in gamers and non-gamers|A gaming company's press release claiming its new puzzle game improves the problem-solving skills of players|A peer-reviewed article on the history of board games in medieval Europe
  Your project asks how climate change affects wheat harvests.|A peer-reviewed agricultural study modeling wheat yields under rising temperatures|A farmer's social media post blaming this year's unusually hot summer for a bad wheat harvest on his land|A peer-reviewed study on rice farming techniques in the nineteenth century
  You are writing about the effects of music lessons on children's math skills.|A peer-reviewed study comparing math scores of 500 children with and without music lessons|A music school's advertisement saying its lessons "make kids smarter" and raise math scores|A peer-reviewed article on the acoustics of concert halls
  Your essay examines how the internet changed newspaper journalism.|A scholarly book by a media researcher analyzing newsroom data from 1995 to 2020|An opinion piece by a retired reporter about the good old days|A scholarly article on how radio changed journalism in the 1930s
  You need evidence on whether a vaccine is safe for children.|A peer-reviewed medical trial testing the vaccine in 5,000 children|A parent's forum thread sharing stories about vaccines|A peer-reviewed trial testing the safety of the same vaccine in 5,000 adults over the age of sixty
  Your paper is about the effect of green spaces on mental health.|A peer-reviewed study linking access to parks with depression rates in 10,000 adults|A wellness influencer's video about how walking in the park every morning cured her depression|A peer-reviewed study of plant growth in urban parks
  You are researching how migration affects language use in families.|A peer-reviewed sociolinguistics study interviewing 300 immigrant families about home language|A popular article about the funniest mistakes people make in a new language|A peer-reviewed study of how birds change songs when they migrate
  Your project asks whether homework improves high school grades.|A peer-reviewed meta-analysis of 60 studies on homework and high school achievement|A student newspaper editorial calling for less homework, written by students who say it lowers their grades|A peer-reviewed study on homework in primary schools in 1950
  You need data on the safety of self-driving cars.|A peer-reviewed engineering study analyzing crash records of self-driving test vehicles|A car maker's advertisement promising that its self-driving car "never crashes"|A peer-reviewed study on horse-drawn carriage accidents in the 1800s
  Your essay is about how sugar taxes affect what people drink.|A peer-reviewed public health study of soft drink sales before and after a sugar tax|A soft drink company's blog post opposing the tax|A peer-reviewed study on sugar's chemical structure
  You are writing about how the Silk Road spread ideas.|A scholarly book by a historian using texts and objects found along the trade routes|A tourism brochure advertising tours of the ancient cities along the Silk Road, with stories about the traders|A scholarly article on trade routes in the Pacific Islands
  Your paper examines the effects of loneliness on older adults' health.|A peer-reviewed study following 2,000 older adults over ten years|A greeting card company's survey asking older customers how often they feel lonely and how many friends they have|A peer-reviewed study on loneliness in laboratory mice
  You need current figures on global plastic recycling rates.|A 2023 peer-reviewed analysis of recycling data from 100 countries|A recycling company's social media post about how much plastic it has recycled this year|A peer-reviewed article on glass recycling from 1985
  Your project asks how sleep affects athletes' performance.|A peer-reviewed sports science study testing sprint times after nights of short and long sleep|A sports drink advertisement featuring a famous runner|A peer-reviewed study on sleep patterns in office workers
  You are researching how earthquakes are predicted.|A peer-reviewed geophysics paper evaluating prediction methods against past earthquake data|A website claiming that animals always sense earthquakes days in advance, with stories from people who saw it happen|A peer-reviewed paper on volcanic eruptions on the Moon
  Your essay is about the effects of bilingual education on reading.|A peer-reviewed study comparing reading scores in bilingual and English-only programs|A school's open-day brochure praising its bilingual classes for raising the reading scores of all its pupils|A peer-reviewed study on reading speed in adults learning to read music
  You need evidence on whether a diet reduces heart disease.|A peer-reviewed trial following 7,000 adults assigned to the diet or a control diet|A best-selling diet book by a television chef who claims the diet cured his own heart disease|A peer-reviewed study on the diet's effect on the growth of cattle
  Your paper examines how the Great Depression affected farm families.|A scholarly history article analyzing farm records and letters from the 1930s|A film set on a farm during the Depression|A scholarly article on the economic boom of the 1950s
  `,
  2,
);

/** sourceForNeedStep asks which source best serves a research need. */
export const sourceForNeedStep = point(
  "the-source-for-the-need",
  t("The Source for the Need", "满足需要的资料"),
  t(
    "Knowing what a scholarly source is does not finish the job: you must find one that serves **your** question. A source fits a research need when three things line up.\n\n- **It is scholarly**: peer-reviewed, written by researchers, with methods and references, when your paper needs evidence. A magazine article, a blog, an advertisement or a novel may be interesting, but it cannot carry an academic claim.\n- **It is on your exact topic**: the same population, place and question. A study of adults does not answer a question about teenagers.\n- **It is current enough**: recent work for a question about the present, while an old source can be the right one for a question about the past.\n\nThe tempting wrong choices are popular sources on the right topic, and scholarly sources on the wrong one.",
    "知道什么是学术资料还不够：你必须找到能服务于**你的**问题的那一份。当三点都吻合时，资料才符合研究需要。\n\n- **它是学术性的**：经过同行评审，由研究者撰写，有方法和参考文献，适合论文需要证据的时候。杂志文章、博客、广告或小说也许有趣，但不能支撑学术主张。\n- **它恰好针对你的主题**：同样的人群、地点和问题。对成年人的研究回答不了关于青少年的问题。\n- **它足够新**：关于现在的问题需要近期的研究，而对于关于过去的问题，旧资料可能恰恰是合适的。\n\n容易误选的是主题对路的大众资料，以及主题不对的学术资料。",
  ),
  kindedChoice(
    ["Which source best serves this research need?", "哪份资料最能满足这一研究需要？"],
    needBank,
    (right) => [
      `*${right}* It is scholarly, it addresses the exact population and question of the paper, and it is from a fitting time.`,
      `*${right}* 它是学术资料，针对的正是论文的人群和问题，而且时间也合适。`,
    ],
    [
      [
        "*{wrong}* is on the right topic, but it is a popular source with no research methods, so it cannot support an academic claim.",
        "*{wrong}* 主题对路，但它是没有研究方法的大众资料，不能支撑学术主张。",
      ],
      [
        "*{wrong}* is scholarly, but it studies a different population, place or period, so it does not answer this question.",
        "*{wrong}* 是学术资料，但它研究的是不同的人群、地点或时期，所以回答不了这个问题。",
      ],
    ],
  ),
);

// Choosing a faithful report.

/** Core is a study's finding and four later reports of it: faithful, exaggerated, broadened, and turned into a cause. */
export type Core = readonly [original: string, faithful: string, exaggerated: string, broadened: string, causal: string];

const moreCores: readonly Core[] = fields(`
  In a survey of 500 workers at three firms, those who worked from home reported slightly higher job satisfaction.|A survey at three firms found that remote workers reported slightly higher job satisfaction.|Remote workers at three firms are far happier with their jobs than office workers, a survey found.|Working from home makes employees everywhere slightly more satisfied, a survey found.|Working from home raises job satisfaction, a survey found.
  Among 200 children in one school district, those who read for fun at least an hour a day had larger vocabularies.|In one district, children who read for fun an hour a day had larger vocabularies, a study found.|Children in one district who read for fun an hour a day had vastly larger vocabularies, a study found.|Children who read for fun have larger vocabularies, a study of all children found.|Reading for fun an hour a day builds children's vocabularies, a study found.
  A study of 80 older adults found that those who gardened weekly had somewhat lower blood pressure.|A study of 80 older adults linked weekly gardening to somewhat lower blood pressure.|Older adults who garden weekly have dramatically lower blood pressure, a study found.|Gardening is linked to lower blood pressure in people of all ages, a study found.|Gardening every week lowers older adults' blood pressure, a study found.
  In one city's records, neighborhoods with more streetlights had fewer reported burglaries.|One city's records show that neighborhoods with more streetlights reported fewer burglaries.|In one city, neighborhoods with more streetlights had almost no reported burglaries, records show.|Streetlights are linked to fewer burglaries in every city, records show.|More streetlights prevent burglaries, one city's records show.
  A survey of 1,000 teenagers in one country found that those who ate dinner with their families reported less stress.|A survey in one country found that teenagers who ate dinner with family reported less stress.|Teenagers in one country who eat family dinners are free of stress, a survey found.|Family dinners are linked to less stress in teenagers in every country around the world, a survey found.|Eating dinner with family reduces teenagers' stress, a survey found.
  In tests on 50 laboratory mice, a new compound slowed the growth of tumors by about a fifth.|In tests on mice, a new compound slowed tumor growth by about a fifth.|A new compound stopped tumor growth in mice, tests found.|A new compound slows tumor growth in humans, tests found.|A new compound cures tumors by slowing their growth by about a fifth, tests found.
  A study of 300 students at one university found that those who sat in the front rows earned slightly higher grades.|At one university, students who sat in front rows earned slightly higher grades, a study found.|Students who sat in the front rows at one university earned much higher grades, a study found.|Students everywhere who sit in front rows earn higher grades, a study found.|Sitting in the front row raises students' grades, a study found.
  In one region, towns with more cycle lanes had a modestly lower rate of traffic injuries.|In one region, towns with more cycle lanes had modestly fewer traffic injuries.|In one region, towns with more cycle lanes had hardly any traffic injuries at all.|Cycle lanes are linked to fewer traffic injuries in towns worldwide.|Building cycle lanes cuts traffic injuries, a regional study found.
  Among 120 office workers, those who took a short walk at lunch reported feeling a little more alert in the afternoon.|Among 120 office workers, those who walked at lunch reported feeling a little more alert later.|Office workers who walk at lunch are full of energy all afternoon, a study found.|Walking at lunch is linked to more alertness for all workers, a study found.|A lunchtime walk makes office workers more alert, a study found.
  A survey of 400 families in one city found that households with a dog reported slightly more outdoor exercise.|A survey in one city found that dog-owning households reported slightly more outdoor exercise.|Families with a dog in one city exercise outdoors constantly, almost every day, a survey of 400 households found.|Dog owners everywhere get more outdoor exercise, a survey found.|Owning a dog makes families exercise more, a survey found.
  In one hospital, patients whose rooms faced a garden left on average half a day sooner.|In one hospital, patients with garden-facing rooms left about half a day sooner on average.|Patients in garden-facing rooms recovered remarkably faster at one hospital.|Patients with a view of a garden recover sooner in every hospital, a study of hospital stays found.|A view of a garden speeds patients' recovery, a hospital study found.
  A study of 90 musicians found that those who practiced in the morning made slightly fewer errors in performance.|A study of 90 musicians linked morning practice to slightly fewer performance errors.|Musicians who practice in the morning make almost no errors, a study found.|Morning practice is linked to fewer errors in every skill, a study found.|Practicing in the morning reduces musicians' errors, a study found.
  Across 30 schools in one state, those with longer recess had somewhat fewer discipline problems.|Across 30 schools in one state, longer recess went with somewhat fewer discipline problems.|Schools in one state with longer recess have no discipline problems at all, a study of 30 schools found.|Longer recess is linked to fewer discipline problems in schools across the country.|Longer recess prevents discipline problems, a study of 30 schools found.
  In a survey of 600 adults, those who used their phones in bed reported sleeping about twenty minutes less.|A survey of 600 adults linked phone use in bed to about twenty minutes less sleep.|Adults who use phones in bed lose hours of sleep, a survey found.|Phone use in bed is linked to less sleep for people of all ages, a survey of adults found.|Using a phone in bed cuts twenty minutes from your sleep, a survey found.
  One study of 150 shoppers found that those who shopped with a list spent slightly less money.|A study of 150 shoppers linked shopping with a list to slightly lower spending.|Shoppers with a list spend far less money, a study found.|Shopping with a list is linked to lower spending in every kind of store, a study found.|Shopping with a list makes people spend less, a study found.
  In one country's data, regions with more libraries had a slightly higher rate of adult literacy.|One country's data show that regions with more libraries had slightly higher adult literacy.|Regions with more libraries in one country have near-perfect adult literacy, that country's data show.|More libraries are linked to higher literacy in every country, data show.|Building libraries raises adult literacy, one country's data show.
  A study of 70 runners found that those who stretched before races had about the same injury rate as those who did not.|A study of 70 runners found that stretching before races made little difference to injury rates.|Stretching before races is completely useless, a study of runners found.|Stretching makes no difference to injuries in any sport, a study found.|Not stretching before races does not cause injuries, a study found.
  Among 250 employees at one company, those who had a mentor were somewhat more likely to be promoted.|At one company, employees with a mentor were somewhat more likely to be promoted, a study found.|Employees with a mentor at one company were almost always promoted within a year, a study found.|Workers everywhere with a mentor are more likely to be promoted, a study found.|Having a mentor gets employees promoted, a study at one company found.
  In a survey of 800 voters in one state, those who received a reminder text were a little more likely to vote.|A survey in one state found that voters who got a reminder text were a little more likely to vote.|A reminder text made voters in one state far more likely to vote, a survey found.|Reminder texts are linked to higher turnout in every election, a survey found.|Reminder texts make people vote, a survey in one state found.
  A survey of 350 nurses at two hospitals found that those on rotating shifts reported somewhat more back pain.|A survey at two hospitals linked rotating shifts to somewhat more back pain among nurses.|Nurses on rotating shifts at two hospitals suffer constant back pain, a survey of 350 nurses found.|Rotating shifts are linked to back pain in every profession, a survey found.|Rotating shifts give nurses back pain, a survey found.
  In one city's records, blocks with community gardens had slightly fewer reports of litter.|One city's records show that blocks with community gardens had slightly fewer litter reports.|Blocks with community gardens in one city are spotless, records show.|Community gardens are linked to less litter in cities everywhere, records show.|Community gardens stop people from dropping litter, one city's records show.
  A study of 60 classrooms found that those with more natural light had slightly higher test scores.|A study of 60 classrooms linked more natural light to slightly higher test scores.|Classrooms with more natural light have far higher test scores, a study of 60 classrooms found.|Natural light is linked to higher scores in every school, a study found.|Natural light raises students' test scores, a study of 60 classrooms found.
`).map(([o, f, e, b, c]): Core => {
  if (!o || !f || !e || !b || !c) throw new Error(`a core needs five fields: ${o}`);
  return [o, f, e, b, c];
});

/** faithfulReportStep asks for the report that stays faithful to a study, from the earlier cores and more of its own. */
export const faithfulReportStep = (earlier: readonly Core[]): KnowledgePointDef => {
  const bank: ChoiceItem[] = [...earlier, ...moreCores].map(
    ([original, faithful, exaggerated, broadened, causal]): ChoiceItem => [
      `Original study: ${original}`,
      faithful,
      [exaggerated, broadened, causal],
    ],
  );
  return point(
    "choosing-the-faithful-report",
    t("Choosing the Faithful Report", "选出忠实的转述"),
    t(
      "When you report a study in your own writing, you are the next link in the chain, so check your sentence against the original in three ways.\n\n- **Strength**: keep the size of the effect. *Slightly lower* must not become *dramatically lower*, and *about a fifth* must not become *stopped*.\n- **Scope**: keep the group studied. *300 adults in one city* must not become *coffee drinkers everywhere*, and mice are not humans.\n- **Kind of finding**: a survey or a set of records shows a **link**. Unless the study was a controlled experiment, do not write that one thing *lowers*, *raises*, *makes* or *prevents* another.\n\nThe faithful report may sound less exciting than the others. That is usually the sign that it is right.",
      "在自己的文章中转述研究时，你就是链条上的下一环，所以要从三个方面拿原文检查你的句子。\n\n- **强度**：保持效果的大小。*slightly lower* 不能变成 *dramatically lower*，*about a fifth* 不能变成 *stopped*。\n- **范围**：保持被研究的群体。*一个城市的 300 名成年人* 不能变成 *各地喝咖啡的人*，老鼠也不是人。\n- **发现的类型**：调查或记录显示的是**关联**。除非研究是对照实验，否则不要写一件事 *lowers*、*raises*、*makes* 或 *prevents* 另一件事。\n\n忠实的转述听起来可能不如其他转述激动人心。这通常恰恰说明它是对的。",
    ),
    kindedChoice(
      ["Which later report stays faithful to the original study?", "哪一条后来的转述忠实于原来的研究？"],
      bank,
      (right) => [
        `*${right}* It keeps the strength of the finding, the group that was studied, and the fact that the study shows only what it shows.`,
        `*${right}* 它保持了发现的强度和被研究的群体，并且只说出了研究实际表明的东西。`,
      ],
      [
        [
          "*{wrong}* exaggerates: it makes the effect much larger or more complete than the study found.",
          "*{wrong}* 夸大了：它把效果说得比研究发现的大得多或彻底得多。",
        ],
        [
          "*{wrong}* broadens the finding beyond the group studied, to everyone, everywhere or another species.",
          "*{wrong}* 把发现扩大到被研究群体之外，扩大到所有人、所有地方或另一个物种。",
        ],
        [
          "*{wrong}* turns a link into a cause, though the study only found that two things go together.",
          "*{wrong}* 把关联说成了因果，而研究只发现两件事同时出现。",
        ],
      ],
    ),
  );
};

// Where to look in a paper.

const sectionLabels: Readonly<Record<string, Label>> = {
  "the abstract": {
    zh: "摘要",
    why: [
      "You only need the gist of the whole study, and the abstract gives question, method, finding and meaning in one paragraph.",
      "你只需要了解整个研究的大意，而摘要用一段话就给出了问题、方法、发现和意义。",
    ],
    not: [
      "The abstract only summarizes; for this question you need the detail of one particular part.",
      "摘要只是概括；这个问题需要某一具体部分的细节。",
    ],
  },
  "the introduction": {
    zh: "引言",
    why: [
      "The introduction explains why the topic matters, what earlier work found, and what gap this study fills.",
      "引言说明主题为什么重要、已有研究发现了什么，以及本研究要填补什么空白。",
    ],
    not: [
      "The introduction covers background and earlier work, not this study's own procedure, numbers or interpretation.",
      "引言讲的是背景和已有研究，而不是本研究自己的步骤、数据或解读。",
    ],
  },
  "the methods": {
    zh: "方法",
    why: [
      "The methods describe who or what was studied, how many, and exactly how the data were gathered and measured.",
      "方法部分描述研究了谁或什么、数量多少，以及数据具体是怎样收集和测量的。",
    ],
    not: [
      "The methods describe how the study was done, not what it found or what it means.",
      "方法部分描述研究是怎样做的，而不是发现了什么或意味着什么。",
    ],
  },
  "the results": {
    zh: "结果",
    why: [
      "The results report what was found, in numbers, tables and figures, before the authors interpret it.",
      "结果部分在作者解读之前，用数字、表格和图报告发现了什么。",
    ],
    not: [
      "The results report the findings themselves, not how the study was done or what the authors think they mean.",
      "结果部分报告的是发现本身，而不是研究怎样做的，或作者认为它们意味着什么。",
    ],
  },
  "the discussion": {
    zh: "讨论",
    why: [
      "The discussion interprets the findings: what they mean, how they compare with earlier work, their limits and what should come next.",
      "讨论部分解读发现：它们意味着什么、与已有研究相比如何、有什么局限，以及下一步该做什么。",
    ],
    not: [
      "The discussion interprets findings; this question is about something reported before the interpretation.",
      "讨论部分是解读发现的；这个问题关心的是解读之前报告的内容。",
    ],
  },
};

const sectionLines = `
  You want to know how many people took part in the study.|the methods
  You want to know whether the study is relevant before reading it.|the abstract
  You want to know the exact percentage by which scores improved.|the results
  You want to know what the authors think their findings mean for teachers.|the discussion
  You want to know what earlier researchers found on the topic.|the introduction
  You want to know how the participants were chosen.|the methods
  You want to know the main finding in one or two sentences.|the abstract
  You want to know what the table of test scores showed.|the results
  You want to know what limits the authors admit.|the discussion
  You want to know why the topic matters and what gap the study fills.|the introduction
  You want to know what survey questions were asked.|the methods
  You want to decide which of twenty papers to read in full.|the abstract
  You want to know whether the difference between the groups was statistically significant.|the results
  You want to know what further research the authors recommend.|the discussion
  You want to know which theory the study is testing.|the introduction
  You want to know how long the experiment lasted.|the methods
  You want a quick overview of the question, method and finding.|the abstract
  You want to know the average sleep time of each group.|the results
  You want to know how the findings compare with earlier studies.|the discussion
  You want to know what question the researchers set out to answer and why.|the introduction
  You want to know what equipment measured the temperatures.|the methods
  You want to cite the study's main conclusion in a short note.|the abstract
  You want to see the graph of results over time.|the results
  You want to know whether the authors think the results apply to other countries.|the discussion
  You want to know the history of research on the question.|the introduction
  You want to know whether the participants were randomly assigned.|the methods
  You want to know in brief what the study found and suggests.|the abstract
  You want to know how many participants dropped out in each group.|the results
  You want to know the authors' explanation for an unexpected result.|the discussion
  You want to know what earlier studies got wrong, according to the authors.|the introduction
`;

/** sectionStep asks where in a research paper to look for an answer. */
export const sectionStep = point(
  "where-to-look",
  t("Where to Look", "到哪里去找"),
  t(
    "Researchers rarely read a paper from start to finish. They go straight to the part that answers their question.\n\n- To decide whether a paper is relevant, or to get its gist: **the abstract**.\n- For background, earlier work and the gap the study fills: **the introduction**.\n- For who was studied, how many, and how the data were gathered: **the methods**.\n- For the findings themselves, numbers, tables and graphs: **the results**.\n- For what the findings mean, how they compare with earlier work, their limits and next steps: **the discussion**.\n\nA common mistake is to look for numbers in the discussion: the discussion may mention them, but the results report them in full.",
    "研究者很少从头到尾读一篇论文。他们会直接去看能回答自己问题的那一部分。\n\n- 要判断论文是否相关，或者了解大意：**摘要**。\n- 要了解背景、已有研究和本研究要填补的空白：**引言**。\n- 要了解研究了谁、多少人、数据怎样收集：**方法**。\n- 要了解发现本身、数字、表格和图：**结果**。\n- 要了解发现意味着什么、与已有研究相比如何、有什么局限和下一步：**讨论**。\n\n常见的错误是到讨论部分去找数字：讨论部分可能会提到它们，但完整报告它们的是结果部分。",
  ),
  labelChoice(["Which part of the paper should you read first?", "你应该先读论文的哪一部分？"], sectionLines, sectionLabels),
);

// Choosing a style for a purpose.

const styleLabels: Readonly<Record<string, Label>> = {
  "short sentences for emphasis": {
    zh: "用短句强调",
    why: [
      "Short, blunt sentences stop the reader and give each fact its full weight, which suits a moment of shock or a firm point.",
      "简短有力的句子让读者停下来，让每个事实都有充分的分量，适合表现震惊的时刻或坚定的观点。",
    ],
    not: [
      "Short, abrupt sentences would chop up what this purpose needs, which is something other than sudden emphasis.",
      "简短突兀的句子会把这个目的所需的内容切碎，而这里需要的不是突然的强调。",
    ],
  },
  "a long sentence that builds": {
    zh: "层层推进的长句",
    why: [
      "A long sentence that adds clause after clause carries the reader forward, which suits a journey, a slow build or a pile of detail.",
      "一个分句接一个分句的长句带着读者向前，适合表现旅程、慢慢积聚的过程或大量细节。",
    ],
    not: ["A long, building sentence would slow down or blur what this purpose needs.", "层层推进的长句会拖慢或模糊这个目的所需的内容。"],
  },
  "formal, technical diction": {
    zh: "正式的专业用词",
    why: [
      "Exact technical terms and a formal tone suit expert readers who need precision, such as in a lab report or a contract.",
      "准确的专业术语和正式的语气适合需要精确性的专业读者，比如实验报告或合同。",
    ],
    not: [
      "Formal, technical words would put off or confuse the readers this purpose has in mind.",
      "正式的专业用词会让这个目的所针对的读者望而却步或感到困惑。",
    ],
  },
  "plain, informal diction": {
    zh: "平实的口语用词",
    why: [
      "Everyday words and a friendly tone suit general readers, such as children, the public or a newsletter audience.",
      "日常词语和友好的语气适合普通读者，比如孩子、公众或通讯的读者。",
    ],
    not: [
      "Plain, chatty words would sound out of place for these readers or this purpose.",
      "平实随意的词语对这些读者或这个目的来说会显得不合适。",
    ],
  },
  "repetition for rhythm": {
    zh: "用重复营造节奏",
    why: [
      "Repeating a word or phrase at the start of clauses builds a rhythm that listeners remember, which suits a speech or a rallying call.",
      "在分句开头重复一个词或短语，能营造让听众记住的节奏，适合演讲或号召。",
    ],
    not: [
      "Deliberate repetition would sound forced here; this purpose does not call for a rhythm to rally an audience.",
      "刻意的重复在这里会显得生硬；这个目的不需要鼓动听众的节奏。",
    ],
  },
};

const styleLines = `
  A novelist wants the reader to feel the shock of learning that a character has died.|short sentences for emphasis
  A travel writer wants to carry the reader through a whole day's journey across a desert.|a long sentence that builds
  A chemist is writing the methods section of a lab report for other chemists.|formal, technical diction
  A museum is writing a sign explaining dinosaurs to young children.|plain, informal diction
  A speaker wants a crowd to remember three demands at a rally.|repetition for rhythm
  A reporter wants to stress that a factory fire killed no one.|short sentences for emphasis
  A writer wants to show a flood rising slowly through a village, step by step.|a long sentence that builds
  A lawyer is drafting a contract that must be exact in every term.|formal, technical diction
  A company is writing a friendly welcome email to new customers.|plain, informal diction
  A principal wants her graduation speech to build to a stirring ending.|repetition for rhythm
  A thriller writer wants the moment the door opens to feel sudden.|short sentences for emphasis
  An essayist wants to list everything a grandmother's kitchen held, one thing after another.|a long sentence that builds
  An engineer is writing a safety specification for other engineers.|formal, technical diction
  A health service is writing a leaflet for patients with no medical training.|plain, informal diction
  A campaigner wants a slogan-like passage that listeners will chant back.|repetition for rhythm
  A memoirist wants to stress, after a long description, that her father never came home.|short sentences for emphasis
  A historian wants to show how one event led to the next, and the next, across a decade.|a long sentence that builds
  A researcher is writing a paper for a specialist medical journal.|formal, technical diction
  A school is writing a newsletter for parents about a fun day out.|plain, informal diction
  A coach wants his halftime talk to fire up the team.|repetition for rhythm
  A writer wants to show that a character's answer was a flat refusal.|short sentences for emphasis
  A nature writer wants to follow a river from the mountains all the way to the sea.|a long sentence that builds
  A government agency is writing technical regulations for food factories.|formal, technical diction
  A blogger is writing a cheerful guide to cooking for students.|plain, informal diction
  A leader wants a speech that repeats its central promise so that it echoes.|repetition for rhythm
  A sports writer wants to stress the final score after describing the whole match.|short sentences for emphasis
  A writer wants a sentence that piles up the sights of a busy market.|a long sentence that builds
  An accountant is writing an audit report for a company's board.|formal, technical diction
  A library is writing posters inviting teenagers to a summer reading club.|plain, informal diction
  A poet wants a passage read aloud at a memorial, with a line that returns again and again.|repetition for rhythm
`;

/** styleChoiceStep asks which choice of style suits a writer's purpose. */
export const styleChoiceStep = point(
  "choosing-a-style",
  t("Choosing a Style", "选择风格"),
  t(
    "Style is a set of tools, and a skilled writer picks the one that suits the purpose and the reader.\n\n- **Short sentences for emphasis** stop the reader cold: use them for shock, for a firm point, or after a long build.\n- **A long sentence that builds** carries the reader forward through a journey, a process or a pile of detail.\n- **Formal, technical diction** gives experts the precision they need, in reports, contracts and specifications.\n- **Plain, informal diction** welcomes general readers: children, the public, customers.\n- **Repetition for rhythm** makes words memorable when they are heard, as in speeches and calls to action.\n\nAsk two questions: who will read or hear this, and what should they feel or do?",
    "风格是一套工具，熟练的作者会挑选适合目的和读者的那一种。\n\n- **用短句强调**让读者猛然停住：用于表现震惊、坚定的观点，或者在长长的铺垫之后。\n- **层层推进的长句**带着读者经历一段旅程、一个过程或大量细节。\n- **正式的专业用词**为专家提供所需的精确性，用于报告、合同和规范。\n- **平实的口语用词**让普通读者感到亲切：孩子、公众、顾客。\n- **用重复营造节奏**让听到的话令人难忘，比如演讲和号召。\n\n问两个问题：谁会读到或听到这些话？他们应该感受到什么或做什么？",
  ),
  labelChoice(["Which choice of style suits this purpose best?", "哪种风格最适合这个目的？"], styleLines, styleLabels),
);

// The conclusion the data support.

/** dataBank gives findings; its wrong options take a link for a cause, then go beyond what was measured. */
const dataBank = bars(
  `
  A chart shows that in 20 towns, those with more ice cream sales also had more drownings.|Ice cream sales and drownings rose together, perhaps both because of hot weather.|Eating ice cream causes people to drown.|Every town in the world has more drownings when ice cream sales rise.
  A table shows that students who used the tutoring service in one school had higher average grades.|In this school, students who used tutoring had higher average grades.|The tutoring service raised students' grades.|Tutoring raises students' average grades in every school, in every subject and at every age.
  A graph shows that a city's bus ridership fell by 10% in the year fares rose.|In the year fares rose, the city's bus ridership fell by 10%.|The fare rise alone drove away exactly 10% of the city's bus riders.|Raising bus fares always cuts ridership by 10%.
  A survey shows that 60% of 500 parents in one town support a later school start.|Most of the parents surveyed in this town support a later school start.|A later start would improve the town's schools.|Most parents across the whole country support a later start to the school day.
  A study chart shows that employees who took more breaks reported fewer headaches.|Employees who took more breaks reported fewer headaches.|Taking breaks prevents headaches.|Taking more breaks reduces headaches and every other kind of illness at work.
  A table shows that countries with more doctors per person had longer life expectancy.|Countries with more doctors per person tended to have longer life expectancy.|Adding doctors makes people live longer.|In every country, each new doctor adds a year to life expectancy.
  A chart shows that a shop's sales rose in the month it began playing music.|The shop's sales rose in the month it began playing music.|Playing music increased the shop's sales, so the shop should keep it on.|Playing music raises sales in every kind of business.
  A graph shows that across 15 years, a region's rainfall and its wheat harvests rose and fell together.|In this region, wheat harvests tended to be larger in years with more rain.|Rain is the only thing that decides the size of the harvest.|Wheat harvests everywhere depend on rainfall in the same way.
  A survey of 300 commuters shows that cyclists reported less stress than drivers.|In this survey, cyclists reported less stress than drivers.|Cycling to work reduces stress.|All cyclists have less stress than all drivers, wherever and however far they travel.
  A table shows that schools with bigger libraries had higher reading scores.|Schools with bigger libraries tended to have higher reading scores.|Building bigger libraries in every school will raise its reading scores.|Reading scores depend only on the size of the library.
  A chart shows that people who own pets reported visiting the doctor less often.|Pet owners in the study reported fewer doctor visits.|Owning a pet keeps people healthy, so they need to visit the doctor less often.|Pet owners in every country are healthier than other people.
  A study shows that in one hospital, patients given a new drug recovered two days sooner than those given the old one, in a randomized trial.|In this randomized trial, the new drug shortened recovery by about two days.|The new drug is a cure for the illness.|The new drug will shorten recovery for every illness.
  A graph shows that a website's visits doubled after it changed its color scheme, during the same month as a big news story about it.|Visits doubled in the month the site changed its colors, which was also the month of a big news story.|The new colors doubled the site's visits.|Changing its color scheme doubles visits to any website, whatever it is about.
  A survey shows that teenagers who play sports report higher self-esteem.|Teenagers in the survey who play sports reported higher self-esteem.|Playing sports raises teenagers' self-esteem, so every school should require it.|All teenagers who play sports have high self-esteem.
  A table shows that neighborhoods with more trees had lower summer temperatures.|Neighborhoods with more trees tended to be cooler in summer.|Planting one tree will cool a neighborhood.|Trees lower summer temperatures by the same amount in every climate.
  A chart shows that in one company, teams that met daily finished more projects on time.|In this company, teams that met daily finished more projects on time.|Daily meetings make teams finish their projects on time.|Daily meetings improve every kind of team in every company.
  A study shows that people who sleep more than eight hours report better moods.|People in the study who slept more than eight hours reported better moods.|Sleeping more than eight hours puts people in a good mood.|Everyone who sleeps eight hours will always be in a good mood.
  A graph shows that a town's crime fell in the same years that its population aged.|Crime fell in the same years that the town's population grew older.|Older residents made the town's crime fall.|Crime falls in every town whose population ages, whatever else is happening there.
  A survey shows that 70% of 200 readers of a cooking magazine prefer recipes with photos.|Most readers surveyed from this magazine prefer recipes with photos.|Photos make recipes taste better.|Most people everywhere, not only readers of this magazine, prefer recipes with photos.
  A table shows that students who ate breakfast had better attendance.|Students who ate breakfast tended to have better attendance.|Eating breakfast makes students come to school.|Breakfast is the main reason any student attends school.
  A chart shows that sales of umbrellas and of rain boots rise in the same weeks.|Umbrella sales and rain boot sales tend to rise in the same weeks.|Buying umbrellas makes people buy rain boots.|Every shop sells umbrellas and rain boots in equal numbers in every week of the year.
  A study shows that in a randomized trial of 400 adults, a daily walk lowered blood pressure slightly.|In this trial, a daily walk lowered adults' blood pressure slightly.|A daily walk cures high blood pressure.|A daily walk lowers blood pressure in children and the elderly by the same amount.
  A graph shows that the number of phone owners and the number of car accidents both rose over twenty years.|Phone ownership and car accidents both rose over the twenty years.|Phones caused the rise in car accidents over those twenty years.|Car accidents rise wherever phones are sold.
  A survey shows that workers who work from home report saving about an hour a day.|Workers in the survey who work from home reported saving about an hour a day.|Working from home gives everyone an extra hour of free time.|All workers would save an hour a day by working from home.
  A table shows that cities with more cycle lanes had fewer cycling injuries per rider.|Cities with more cycle lanes tended to have fewer injuries per cyclist.|Every new cycle lane prevents an injury.|Building more cycle lanes will end cycling injuries in every city.
  A chart shows that a school's test scores rose in the year it hired a new principal and also bought new books.|Scores rose in the year the school hired a new principal and bought new books.|The new principal raised the test scores, not the new books.|Hiring a new principal raises scores at any school.
  A study shows that in one country, people who use public libraries report reading more books.|Library users in this country reported reading more books.|Using a library makes people read more.|People in every country who use libraries read twice as many books as those who do not.
  A graph shows that a city's air pollution fell in the year it banned old diesel cars.|The city's air pollution fell in the year it banned old diesel cars.|The diesel ban alone cleaned the city's air.|Banning diesel cars cleans the air in every city by the same amount.
  A survey shows that 80% of 100 gym members say exercise improves their sleep.|Most of the gym members surveyed said exercise improves their sleep.|Exercise is proven to improve the sleep of everyone who goes to the gym.|Most people in the world sleep better when they exercise.
  A table shows that in one region, farms using a new fertilizer had larger harvests, but they were also on richer soil.|Farms using the new fertilizer had larger harvests, though they also had richer soil.|The new fertilizer made the harvests larger.|The fertilizer will increase harvests on any farm, whatever its soil.
  `,
  2,
);

/** dataConclusionStep asks which conclusion the data support. */
export const dataConclusionStep = point(
  "what-the-data-support",
  t("What the Data Support", "数据支持什么结论"),
  t(
    "Before you write a sentence about a chart or a table, test it against what was actually measured.\n\n- **Link or cause?** Most charts and surveys show that two things go together. Unless a randomized trial changed one of them on purpose, write *tended to*, *was linked to* or *rose together*, not *caused*, *made* or *raised*. Look for a third factor, such as hot weather, that could drive both.\n- **How far?** Stay with the group, place and size of effect measured. Twenty towns do not speak for every town in the world, and *slightly* is not *cures*.\n\nThe supported conclusion usually sounds modest, and it often names the very limits that the overreaching ones ignore.",
    "在写一句关于图表的话之前，要拿实际测量的内容来检验它。\n\n- **关联还是因果？**大多数图表和调查显示的是两件事同时出现。除非随机试验有意改变了其中一个，否则要写 *tended to*、*was linked to* 或 *rose together*，而不是 *caused*、*made* 或 *raised*。要找一找可能同时推动两者的第三个因素，比如炎热的天气。\n- **能推多远？**不要超出所测量的群体、地点和效果大小。二十个城镇代表不了世界上所有的城镇，*slightly* 也不等于 *cures*。\n\n有依据的结论听起来往往很谨慎，它常常正好说出了那些过度推论所忽视的局限。",
  ),
  kindedChoice(
    ["Which conclusion do these data support?", "这些数据支持哪个结论？"],
    dataBank,
    (right) => [
      `*${right}* It stays with what was measured: it reports the link without claiming a cause, and it does not reach beyond the data.`,
      `*${right}* 它没有超出测量的内容：它报告了关联而没有断言因果，也没有超出数据的范围。`,
    ],
    [
      [
        "*{wrong}* turns a link into a cause, or claims more than a single trial or chart can show.",
        "*{wrong}* 把关联说成了因果，或者断言了一项试验或一张图表所不能说明的东西。",
      ],
      [
        "*{wrong}* reaches beyond the data, to every place, every person or an effect larger than the one measured.",
        "*{wrong}* 超出了数据的范围，扩大到所有地方、所有人，或者比测量到的效果更大。",
      ],
    ],
  ),
);

// What a message asks of you.

/** actionBank gives a message; its wrong options are an optional action, then information that asks nothing. */
const actionBank = bars(
  `
  From HR: All staff must complete the new safety course by 30 June. Lunch will be provided at the optional workshop on 15 June. The course takes about an hour.|Complete the safety course by 30 June.|Attend the workshop on 15 June.|Note that the course takes about an hour.
  From your manager: Please send me your budget figures by Friday noon. If you have time, you might also look at last year's report. The finance team moved to the third floor.|Send the budget figures by Friday noon.|Look at last year's report.|Note that the finance team is now on the third floor.
  From the building office: The car park will close on Saturday for repairs, so remove any cars by Friday evening. Staff may use the public car park nearby if they wish. The repairs should take two days.|Remove your car from the car park by Friday evening.|Use the public car park nearby.|Note that the repairs should take two days.
  From IT: Every user must change their password before Monday, or their account will be locked. You can also turn on two-step sign-in for extra security. The new system was installed last week.|Change your password before Monday.|Turn on two-step sign-in.|Note that the new system was installed last week.
  From the conference organizers: Registered speakers must upload their slides by 1 May. Speakers are welcome to join the dinner on the first night. The venue has free wireless internet.|Upload your slides by 1 May.|Join the dinner on the first night.|Note that the venue has free wireless internet.
  From a client: Please confirm the delivery date in writing by Wednesday. Feel free to call if you want to discuss the details. Our offices close at five.|Confirm the delivery date in writing by Wednesday.|Call to discuss the details.|Note that their offices close at five.
  From the team leader: Everyone needs to submit their holiday requests by the end of the month. You may also suggest dates for the team outing. The office will close for two days in August.|Submit your holiday request by the end of the month.|Suggest dates for the team outing.|Note that the office will close for two days in August.
  From the lab manager: Before you leave each evening, you must sign the equipment log. You can borrow the spare microscope if yours is busy. The lab was painted last month.|Sign the equipment log before leaving each evening.|Borrow the spare microscope.|Note that the lab was painted last month.
  From accounts: Expense claims must include receipts and be filed within 30 days. You may submit claims online or on paper. The accounts team has a new manager.|File expense claims with receipts within 30 days.|Submit claims on paper instead of online.|Note that the accounts team has a new manager.
  From the school office: Parents must return the signed permission form by Thursday for the trip. Parents who wish to help on the trip can contact the class teacher. The bus leaves at eight.|Return the signed permission form by Thursday.|Contact the teacher to help on the trip.|Note that the bus leaves at eight.
  From the landlord: Tenants are required to let the inspector in on Tuesday morning. Tenants may be present during the inspection if they choose. The inspection is done every year.|Let the inspector in on Tuesday morning.|Be present during the inspection.|Note that the inspection is done every year.
  From your editor: The article must be cut to 800 words before it goes to print tomorrow. You could add a photo if you have a good one. The magazine's design has changed this month.|Cut the article to 800 words before tomorrow.|Add a photo to the article.|Note that the magazine's design has changed.
  From the travel office: Travelers must book flights through the company portal to be reimbursed. You are welcome to choose your own seat. The portal was updated in March.|Book flights through the company portal.|Choose your own seat.|Note that the portal was updated in March.
  From the project manager: Each team must send a progress report every Monday. Teams can use the new template if they like it. The client visited the site last week.|Send a progress report every Monday.|Use the new template.|Note that the client visited the site last week.
  From the gym: Members must show their card at the front desk on every visit. Members may bring a guest once a month. The pool reopens next week.|Show your card at the front desk on every visit.|Bring a guest once a month.|Note that the pool reopens next week.
  From the university: Students must register for next term's courses by 15 November. Students may attend an advice session before registering. The library extends its hours during exams.|Register for next term's courses by 15 November.|Attend an advice session.|Note that the library extends its hours during exams.
  From the safety officer: Anyone who uses the ladder must have a second person holding it. Staff can request extra training if they want it. The ladder was bought in 2019.|Have a second person hold the ladder when you use it.|Request extra training.|Note that the ladder was bought in 2019.
  From your supervisor: You need to return the signed contract by Friday, or the offer will lapse. You can ask HR any questions about benefits. The company has offices in four countries.|Return the signed contract by Friday.|Ask HR about benefits.|Note that the company has offices in four countries.
  From the event planner: All volunteers must arrive by 7 a.m. for the briefing. Volunteers may wear the event T-shirt if they wish. The event has run for ten years.|Arrive by 7 a.m. for the briefing.|Wear the event T-shirt.|Note that the event has run for ten years.
  From the publisher: Authors must return corrected proofs within one week. Authors may suggest a cover image. The book will be printed in Italy.|Return the corrected proofs within one week.|Suggest a cover image.|Note that the book will be printed in Italy.
  From the clinic: Patients must not eat for eight hours before the blood test. Patients may bring a book to read while they wait. The clinic has free parking.|Do not eat for eight hours before the blood test.|Bring a book to read while waiting.|Note that the clinic has free parking.
  From the office manager: Staff must clear their desks by Friday before the move. Staff can take home any old stationery they want. The new office is near the station.|Clear your desk by Friday.|Take home old stationery.|Note that the new office is near the station.
  From the grant office: Applicants must attach a budget to the application. Applicants may include letters of support. Last year, 40 grants were awarded.|Attach a budget to the application.|Include letters of support.|Note that 40 grants were awarded last year.
  From the restaurant manager: Kitchen staff must wash their hands before handling food, every time. Staff can choose the music in the break room. The restaurant opened in 2015.|Wash your hands before handling food, every time.|Choose the music in the break room.|Note that the restaurant opened in 2015.
  From the head of department: Every teacher must enter final grades into the system by 20 June. Teachers may share lesson plans in the new online folder. The department won an award this year.|Enter final grades by 20 June.|Share lesson plans in the online folder.|Note that the department won an award.
  From the hotel: Guests must check out by 11 a.m. or pay for an extra night. Guests may leave luggage at reception after checking out. Breakfast is served until ten.|Check out by 11 a.m.|Leave luggage at reception.|Note that breakfast is served until ten.
  From the library: Borrowers must return the laptop within 48 hours. Borrowers can reserve a study room online. The library has 20 laptops.|Return the laptop within 48 hours.|Reserve a study room online.|Note that the library has 20 laptops.
  From the sales director: Each sales rep must log every client call in the system on the same day. Reps may join the optional product webinar on Thursday. Sales rose 5% last quarter.|Log every client call in the system on the same day.|Join the product webinar on Thursday.|Note that sales rose 5% last quarter.
  From the club secretary: Members must renew their membership by 1 January to keep their place. Members may nominate someone for the committee. The club was founded in 1952.|Renew your membership by 1 January.|Nominate someone for the committee.|Note that the club was founded in 1952.
  From the printer: Files must be sent as PDFs at least three days before printing. Customers can request a paper sample. The shop is closed on Sundays.|Send the files as PDFs at least three days before printing.|Request a paper sample.|Note that the shop is closed on Sundays.
  `,
  2,
);

/** actionStep asks what a workplace message requires the reader to do. */
export const actionStep = point(
  "what-you-must-do",
  t("What You Must Do", "你必须做什么"),
  t(
    "Workplace messages often mix three things in a few lines: what you **must** do, what you **may** do, and what you only need to **know**. Read for the required action first.\n\n- **Required**: *must*, *need to*, *are required to*, *shall*, a deadline, or a consequence such as *or your account will be locked*.\n- **Optional**: *may*, *can*, *if you wish*, *feel free to*, *you are welcome to*, *you could*.\n- **Information only**: facts with no action at all, such as when something opened or where a team now sits.\n\nMissing the required action is costly; treating an optional one as required wastes time. When a message holds several, find the one with *must* and a deadline.",
    "工作中的信息常常在短短几行里混杂三种内容：你**必须**做的、你**可以**做的，以及你只需要**知道**的。先找出必须做的事。\n\n- **必须做的**：*must*、*need to*、*are required to*、*shall*、截止日期，或者 *or your account will be locked* 这样的后果。\n- **可选的**：*may*、*can*、*if you wish*、*feel free to*、*you are welcome to*、*you could*。\n- **仅供了解**：不要求任何行动的事实，比如某样东西什么时候开放，或者某个团队现在在哪里办公。\n\n漏掉必须做的事代价很大；把可选的事当作必须做的则浪费时间。当一条信息包含好几项时，要找出带有 *must* 和截止日期的那一项。",
  ),
  kindedChoice(
    ["What does this message require you to do?", "这条信息要求你做什么？"],
    actionBank,
    (right) => [
      `*${right}* The message uses *must*, *need to* or *required*, often with a deadline, so this is the action you cannot skip.`,
      `*${right}* 信息中用了 *must*、*need to* 或 *required*，常常还带有截止日期，所以这是你不能不做的事。`,
    ],
    [
      [
        "*{wrong}* is optional: the message offers it with *may*, *can*, *if you wish* or *feel free to*, so you can skip it.",
        "*{wrong}* 是可选的：信息用 *may*、*can*、*if you wish* 或 *feel free to* 提出它，所以你可以不做。",
      ],
      [
        "*{wrong}* is information only: the message states a fact and asks nothing of you.",
        "*{wrong}* 仅供了解：信息只是陈述了一个事实，并没有要求你做什么。",
      ],
    ],
  ),
);

// Checking a plan against a request for proposals.

const meets = "it meets the request";
const notEligible = "the applicant is not eligible";
const notCovered = "it asks for a cost the fund does not cover";
const missesRule = "it breaks a submission rule";

const planLabels: Readonly<Record<string, Label>> = {
  [meets]: {
    zh: "符合要求",
    why: [
      "The applicant may apply, the costs are ones the fund covers, and the proposal follows the rules for what to submit and when.",
      "申请者有资格申请，费用属于资助范围，提案也遵守了提交内容和时间的规定。",
    ],
    not: [
      "The plan fails one of the request's tests: who may apply, what the money covers, or how and when to submit.",
      "这个计划没有通过要求中的某项检验：谁可以申请、资金涵盖什么，或者怎样以及何时提交。",
    ],
  },
  [notEligible]: {
    zh: "申请者不符合资格",
    why: [
      "The request limits who may apply, and this applicant falls outside that limit, so the proposal will not be considered at all.",
      "要求限定了谁可以申请，而这个申请者不在限定范围内，所以提案根本不会被考虑。",
    ],
    not: [
      "The applicant fits the request's rule on who may apply, so eligibility is not the problem.",
      "申请者符合要求中关于谁可以申请的规定，所以资格不是问题所在。",
    ],
  },
  [notCovered]: {
    zh: "申请了不在资助范围内的费用",
    why: [
      "The request says what the money can pay for, and this plan asks for something the fund excludes.",
      "要求说明了资金可以用来支付什么，而这个计划申请的是资助所排除的项目。",
    ],
    not: ["Every cost in the plan is one the request says the fund will pay for.", "计划中的每一项费用都是要求中说明会资助的。"],
  },
  [missesRule]: {
    zh: "违反了提交规定",
    why: [
      "The request sets rules for what to submit and when, such as a deadline, a page limit or a required document, and the plan breaks one.",
      "要求规定了提交什么以及何时提交，比如截止日期、页数限制或必须附上的文件，而这个计划违反了其中一条。",
    ],
    not: [
      "The plan follows the request's rules on deadline, length and documents.",
      "这个计划遵守了要求中关于截止日期、篇幅和文件的规定。",
    ],
  },
};

const planLines = `
  Request: open to registered charities in the region; funds cover staff and materials; apply by 1 March.\\nPlan: a registered local charity asks for materials for a reading club, applying on 10 February.|${meets}
  Request: open to registered charities in the region; funds cover staff and materials; apply by 1 March.\\nPlan: a private company in the region asks for staff costs, applying on 15 February.|${notEligible}
  Request: open to registered charities in the region; funds cover staff and materials; apply by 1 March.\\nPlan: a registered local charity asks for money to buy a minibus, applying on 20 February.|${notCovered}
  Request: open to registered charities in the region; funds cover staff and materials; apply by 1 March.\\nPlan: a registered local charity asks for staff costs, applying on 5 March.|${missesRule}
  Request: schools with fewer than 500 students; funds cover equipment, not buildings; proposals of up to five pages.\\nPlan: a school of 320 students asks for science equipment in a four-page proposal.|${meets}
  Request: schools with fewer than 500 students; funds cover equipment, not buildings; proposals of up to five pages.\\nPlan: a school of 1,200 students asks for computers in a three-page proposal.|${notEligible}
  Request: schools with fewer than 500 students; funds cover equipment, not buildings; proposals of up to five pages.\\nPlan: a school of 300 students asks to build a new gym in a five-page proposal.|${notCovered}
  Request: schools with fewer than 500 students; funds cover equipment, not buildings; proposals of up to five pages.\\nPlan: a school of 410 students asks for musical instruments in a twelve-page proposal.|${missesRule}
  Request: teams with at least one university researcher; funds cover research costs, not travel; include a budget.\\nPlan: a team led by a university biologist asks for lab supplies and includes a budget.|${meets}
  Request: teams with at least one university researcher; funds cover research costs, not travel; include a budget.\\nPlan: a team of three high school teachers with no university partner asks for lab supplies, with a budget.|${notEligible}
  Request: teams with at least one university researcher; funds cover research costs, not travel; include a budget.\\nPlan: a team with a university historian asks for flights to an archive abroad, with a budget.|${notCovered}
  Request: teams with at least one university researcher; funds cover research costs, not travel; include a budget.\\nPlan: a team with a university chemist asks for testing costs but sends no budget.|${missesRule}
  Request: community groups active for two years or more; funds cover events and publicity; submit online.\\nPlan: a neighborhood group founded five years ago asks for festival costs and submits online.|${meets}
  Request: community groups active for two years or more; funds cover events and publicity; submit online.\\nPlan: a group formed last month asks for posters for its first event and submits online.|${notEligible}
  Request: community groups active for two years or more; funds cover events and publicity; submit online.\\nPlan: a ten-year-old group asks for the salary of a full-time director and submits online.|${notCovered}
  Request: community groups active for two years or more; funds cover events and publicity; submit online.\\nPlan: a group active for six years asks for concert costs and mails a paper copy.|${missesRule}
  Request: businesses with fewer than 50 employees; funds cover training, not equipment; one proposal per business.\\nPlan: a bakery with twelve staff asks for food-safety training in a single proposal.|${meets}
  Request: businesses with fewer than 50 employees; funds cover training, not equipment; one proposal per business.\\nPlan: a factory with 300 staff asks for safety training in one proposal.|${notEligible}
  Request: businesses with fewer than 50 employees; funds cover training, not equipment; one proposal per business.\\nPlan: a shop with eight staff asks for a new cash register in one proposal.|${notCovered}
  Request: businesses with fewer than 50 employees; funds cover training, not equipment; one proposal per business.\\nPlan: a café with ten staff sends three separate proposals for different training courses.|${missesRule}
  Request: individuals aged 18 to 30; funds cover tuition, not living costs; include two references.\\nPlan: a 24-year-old asks for course fees and includes two references.|${meets}
  Request: individuals aged 18 to 30; funds cover tuition, not living costs; include two references.\\nPlan: a 45-year-old asks for course fees and includes two references.|${notEligible}
  Request: individuals aged 18 to 30; funds cover tuition, not living costs; include two references.\\nPlan: a 22-year-old asks for rent during the course and includes two references.|${notCovered}
  Request: individuals aged 18 to 30; funds cover tuition, not living costs; include two references.\\nPlan: a 27-year-old asks for course fees and includes one reference.|${missesRule}
  Request: museums in the country; funds cover conservation of objects; apply by 30 September with photos.\\nPlan: a national museum asks to restore an old painting, applying in August with photos.|${meets}
  Request: museums in the country; funds cover conservation of objects; apply by 30 September with photos.\\nPlan: a private art collector asks to restore a painting, applying in August with photos.|${notEligible}
  Request: museums in the country; funds cover conservation of objects; apply by 30 September with photos.\\nPlan: a city museum asks for money to run a gift shop, applying in July with photos.|${notCovered}
  Request: museums in the country; funds cover conservation of objects; apply by 30 September with photos.\\nPlan: a town museum asks to repair old maps, applying in September without any photos.|${missesRule}
  Request: farms in the region; funds cover water-saving systems; proposals in English or the local language.\\nPlan: a regional dairy farm asks for a drip-irrigation system, writing in the local language.|${meets}
  Request: farms in the region; funds cover water-saving systems; proposals in English or the local language.\\nPlan: a regional fruit farm asks for a new tractor, writing in English.|${notCovered}
`;

/** planCheckStep asks whether a plan meets a request for proposals, and if not, which rule it breaks. */
export const planCheckStep = point(
  "checking-the-plan",
  t("Checking the Plan", "核对计划"),
  t(
    "Before you write a proposal, check your plan against the request, one test at a time. A proposal that fails any of them is usually rejected without being read.\n\n1. **Who may apply?** Size, age, location, type of organization. If you are outside the limit, nothing else matters.\n2. **What does the money cover?** Many funds pay for some costs and exclude others, such as buildings, travel, equipment or salaries. Ask only for what is covered.\n3. **What must you submit, and when?** The deadline, the page limit, the format, and required documents such as a budget, photos or references.\n\nIf the plan passes all three, it meets the request, and you can turn to how proposals will be judged.",
    "在写提案之前，要拿计划逐项对照要求进行检验。没有通过其中任何一项的提案，通常连读都不会被读就被拒绝了。\n\n1. **谁可以申请？**规模、年龄、地点、组织类型。如果你不在限定范围内，其他一切都无关紧要。\n2. **资金涵盖什么？**很多资助只支付某些费用，排除其他费用，比如建筑、差旅、设备或薪水。只申请涵盖范围内的费用。\n3. **必须提交什么，何时提交？**截止日期、页数限制、格式，以及预算、照片或推荐信等必须附上的文件。\n\n如果计划通过了全部三项检验，它就符合要求，你就可以转而考虑提案将怎样被评审了。",
  ),
  labelChoice(
    ["Does this plan meet the request for proposals? If not, why not?", "这个计划符合征集提案的要求吗？如果不符合，原因是什么？"],
    planLines,
    planLabels,
  ),
);
