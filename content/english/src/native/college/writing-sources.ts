// College writing: the tasks of the critical summary, the research question, the annotated bibliography and the
// paraphrase, each with a model answer. The articles summarized are invented, with invented authors.

import type { WritingItem } from "@ga/subject-english";

/** criticalSummaryBank asks for an article's argument in a paragraph, then one strength and one limitation. */
export const criticalSummaryBank: readonly WritingItem[] = [
  {
    task: "Write a critical summary of the article: state its question, claim and evidence in a few sentences, then name one strength and one limitation.",
    source:
      "Okafor, N. (2021). Sleep and memory in adolescence. Okafor asked whether teenagers who sleep longer remember more of what they learn. She tracked the sleep of 400 students aged 14 to 17 for two weeks with wrist trackers, then gave them a standard memory test. Students who slept more than eight hours scored on average 11 points higher than those who slept fewer than six, even after she accounted for their grades the year before. She argues that schools should treat sleep as part of learning and consider later start times. All the students attended schools in one city, and sleep was measured for only two weeks.",
    model:
      "Okafor (2021) asks whether longer sleep helps teenagers remember what they learn. Tracking 400 students aged 14 to 17 for two weeks, she found that those who slept more than eight hours scored about 11 points higher on a memory test than those who slept fewer than six, even when earlier grades were taken into account. She concludes that schools should treat sleep as part of learning and consider starting later. The study's main strength is that it measured sleep with trackers rather than relying on what students remembered, and that it controlled for prior achievement, which rules out the simple explanation that stronger students also sleep more. Its main limitation is scope: two weeks in one city cannot show whether the link holds over a school year or elsewhere, and because sleep was observed rather than changed, the study shows a link, not a cause.",
  },
  {
    task: "Write a critical summary of the article: state its question, claim and evidence in a few sentences, then name one strength and one limitation.",
    source:
      "Brandt, L., & Moreau, J. (2019). Bright nights: artificial light and the nesting success of city birds. The authors asked why birds in cities raise fewer young than birds in the countryside. Most earlier work blamed noise. They monitored 60 nests in three cities from April to July and measured light and noise at each nest at night. Of the nests in brightly lit areas, 41% failed, compared with 18% in dark areas; noise made little difference once light was taken into account. They argue that light, more than noise, harms city birds, and call for dimmer street lamps near parks. Light and noise were often high at the same sites.",
    model:
      "Brandt and Moreau (2019) ask why city birds raise fewer young than country birds, a question earlier work had answered mainly with noise. Monitoring 60 nests in three cities and measuring light and noise at each, they found that 41% of nests in bright areas failed against 18% in dark ones, while noise mattered little once light was considered. They conclude that light is the greater threat and recommend dimmer street lamps near parks. A strength of the study is that it measured both suspected causes at the same nests, so it could test the older explanation directly rather than simply offering a new one. A limitation, which the authors acknowledge, is that bright sites were often noisy too; with only 60 nests, the two effects are hard to separate, and an experiment that changes the lighting would be needed to show that light itself is the cause.",
  },
  {
    task: "Write a critical summary of the article: state its question, claim and evidence in a few sentences, then name one strength and one limitation.",
    source:
      "Haddad, S. (2020). Homework and reading progress in primary school. Haddad asked whether children who receive more homework make faster progress in reading. She asked teachers in 120 primary schools how many minutes of homework they set each week and compared the schools' reading results over three years. Schools that set more than an hour a week made the same average progress as schools that set none. She argues that primary schools should reduce homework and spend the time on reading for pleasure. She did not measure what kind of homework was set or whether children completed it.",
    model:
      "Haddad (2020) asks whether more homework helps primary school children make faster progress in reading. Comparing teachers' reports of weekly homework in 120 schools with three years of reading results, she found that schools setting more than an hour a week made no more progress than schools setting none. On this basis she argues that schools should cut homework and use the time for reading for pleasure. The study's strength is its size and length: three years of results across 120 schools make it unlikely that the finding is a fluke of one class or one year. Its limitation is that it measured only the amount of homework, not its kind or whether it was done. A school that sets an hour of careful reading practice and one that sets an hour of worksheets are counted alike, so the study cannot show that homework itself is useless, only that more minutes alone do not help.",
  },
  {
    task: "Write a critical summary of the article: state its question, claim and evidence in a few sentences, then name one strength and one limitation.",
    source:
      "Lindqvist, P. (2018). Who pays for the minimum wage? Lindqvist asked whether raising the minimum wage reduces the number of jobs for young workers. He compared employment in restaurants in two neighboring regions over four years, one of which raised its minimum wage by 15% while the other did not. Employment of workers under 25 fell by 2% in the region that raised wages and by 1% in the other, a difference he calls small. He argues that modest increases cost few jobs. The two regions differed in their tourism industries, and the study covered only restaurants.",
    model:
      "Lindqvist (2018) asks whether a higher minimum wage costs young workers their jobs. Comparing restaurant employment over four years in two neighboring regions, one of which raised its minimum wage by 15%, he found that jobs for workers under 25 fell by 2% where wages rose and by 1% where they did not. He argues that this gap is small and that modest increases cost few jobs. The design is the study's strength: by comparing neighboring regions over the same years, it removes national changes, such as a recession, that would affect both. Its limitation is that the regions are not truly alike, since they differ in tourism, which can change restaurant hiring on its own, and restaurants are only one industry. The finding supports his conclusion for restaurants in similar regions, but it is too narrow to settle the wider debate.",
  },
  {
    task: "Write a critical summary of the article: state its question, claim and evidence in a few sentences, then name one strength and one limitation.",
    source:
      "Ferreira, A., & Kim, D. (2022). Shared, not read: how teenagers decide which news to trust. The authors asked how teenagers judge whether a news story is reliable. They interviewed 40 teenagers aged 15 to 18 and watched them scroll through their feeds. Thirty-one said they had shared stories without opening them, and most trusted a story more when a friend shared it than when they recognized the outlet. The authors argue that media lessons should focus on the social pressures of sharing rather than on checklists for judging websites. The participants were volunteers from two schools.",
    model:
      "Ferreira and Kim (2022) ask how teenagers decide which news stories to trust. Through interviews with 40 teenagers and observation of them scrolling their feeds, they found that 31 had shared stories without opening them and that most trusted the friend who shared a story more than the outlet that published it. They argue that media education should address the social pressures of sharing instead of teaching checklists for judging websites. The study's strength is that it watched teenagers use their own feeds rather than asking them to judge sample websites in a classroom, so it captures how they actually behave. Its limitation is its sample: 40 volunteers from two schools may be more thoughtful, or more open about their habits, than teenagers in general. The findings suggest a useful direction for teaching, but a larger survey would be needed before schools rebuild their lessons around them.",
  },
  {
    task: "Write a critical summary of the article: state its question, claim and evidence in a few sentences, then name one strength and one limitation.",
    source:
      "Mensah, K. (2017). The secretary's hand: rethinking the authorship of the royal letters. Mensah asked who wrote three letters long attributed to King Edmund. Most historians had assumed the king wrote them himself. Mensah compared their handwriting with known samples from the king and from his secretary, Thomas Hale, and checked court records of the king's travels. All three letters matched Hale's hand, and the king was abroad when the third was written. Mensah argues that Hale wrote the letters and that their bold policies may have been his. The court records for the first two letters are incomplete.",
    model:
      "Mensah (2017) asks who wrote three letters that historians have long attributed to King Edmund. Comparing their handwriting with known samples from the king and his secretary, Thomas Hale, and checking court records of the king's travels, he found that all three letters match Hale's hand and that the king was abroad when the third was written. He argues that Hale wrote them and that the bold policies they announce may have been Hale's rather than the king's. The argument's strength is that it rests on two independent kinds of evidence, handwriting and travel records, which point the same way for the third letter. Its limitation is that the second claim goes further than the first: a secretary often wrote down what a king dictated, so Hale's handwriting shows who held the pen, not who made the policy, and the records for the first two letters are too incomplete to decide.",
  },
  {
    task: "Write a critical summary of the article: state its question, claim and evidence in a few sentences, then name one strength and one limitation.",
    source:
      "Novak, E. (2021). Handwritten notes and conceptual understanding. Novak asked whether students who take notes by hand learn differently from those who type. She randomly assigned 150 university students to take notes by hand or on a laptop during the same recorded lecture and tested them a week later. The handwriting group scored 7% higher on questions about ideas, while both groups did equally well on questions about facts. She argues that handwriting forces students to summarize, which deepens understanding, and that lecturers should encourage it. The lecture was 20 minutes long and on a single topic.",
    model:
      "Novak (2021) asks whether taking notes by hand changes what students learn compared with typing. She randomly assigned 150 university students to one method or the other during the same recorded lecture and found, a week later, that the handwriting group scored 7% higher on questions about ideas but no differently on questions about facts. She argues that writing by hand forces students to summarize rather than copy, and that lecturers should encourage it. The study's chief strength is random assignment: because chance, not preference, decided who wrote by hand, the difference is likely caused by the method rather than by the kind of student who chooses it. Its limitation is that a single 20-minute lecture on one topic is far from a real course, where students review their notes over weeks, so the advantage may shrink or grow in practice.",
  },
  {
    task: "Write a critical summary of the article: state its question, claim and evidence in a few sentences, then name one strength and one limitation.",
    source:
      "Tanaka, H. (2019). Two languages and the ageing mind. Tanaka asked whether speaking two languages protects memory in old age. He followed 2,000 adults over 65 for ten years, recording the languages they used daily and any diagnosis of memory loss. Those who spoke two languages were diagnosed on average four years later than those who spoke one. He argues that using a second language builds a reserve that delays decline. Bilingual participants had, on average, more years of education.",
    model:
      "Tanaka (2019) asks whether speaking two languages protects memory in old age. Following 2,000 adults over 65 for ten years, he found that those who used two languages daily were diagnosed with memory loss about four years later, on average, than those who used one. He argues that a second language builds a mental reserve that delays decline. The study's strength is its long, large design: ten years of follow-up with 2,000 people captures real diagnoses rather than test scores on a single day. Its limitation is that the bilingual participants also had more years of education, and education is itself linked to later memory loss. Unless the analysis separates the two, the four-year gap may reflect schooling as much as language, so the evidence supports a link but not yet the claim that languages themselves build the reserve.",
  },
  {
    task: "Write a critical summary of the article: state its question, claim and evidence in a few sentences, then name one strength and one limitation.",
    source:
      "Osei, R. (2023). Cooling the street: tree cover and summer heat in fourteen neighborhoods. Osei asked which neighborhoods in a large city suffer most from summer heat and why. Sensors on lamp posts in 14 neighborhoods recorded temperatures every ten minutes from June to August, and tree cover was measured from aerial photographs. Every 10% increase in tree cover was linked to afternoon temperatures 0.6 degrees lower. The poorest neighborhoods had the least tree cover. Osei argues that the city should plant trees first where incomes are lowest. Neighborhoods with fewer trees also had more paved surfaces.",
    model:
      "Osei (2023) asks which neighborhoods of a large city suffer most from summer heat and why. Using lamp-post sensors in 14 neighborhoods through a summer and tree cover measured from aerial photographs, Osei found that each 10% increase in tree cover was linked to afternoon temperatures 0.6 degrees lower, and that the poorest neighborhoods had the fewest trees. The article argues that new trees should be planted first where incomes are lowest. Its strength is the quality of its measurements: readings every ten minutes for three months give a far more reliable picture than a few hot days. Its limitation is that neighborhoods with fewer trees also had more paved surfaces, which hold heat. Some of the cooling credited to trees may come from less pavement, so planting trees alone may not cool streets as much as the figure suggests.",
  },
  {
    task: "Write a critical summary of the article: state its question, claim and evidence in a few sentences, then name one strength and one limitation.",
    source:
      "Duarte, M. (2020). Bike lanes and local business. Duarte asked whether adding bike lanes, which removes parking spaces, harms shops on the street. Using monthly sales figures from 500 shops on streets that gained bike lanes and 500 similar shops on streets that did not, she compared sales over three years. Sales rose by 4% on streets with new lanes and by 3% on the others. She argues that shop owners' fears are unfounded. The city chose which streets received lanes, often busy streets in growing areas.",
    model:
      "Duarte (2020) asks whether bike lanes, which take away parking, hurt the shops on the streets where they are built. Comparing three years of monthly sales from 500 shops on streets that gained lanes with 500 similar shops elsewhere, she found that sales rose by 4% on the new lanes' streets and by 3% on the others. She argues that shop owners' fears are unfounded. Her strength is the comparison group: by tracking similar shops without lanes over the same years, she separates the effect of the lanes from changes in the economy as a whole. Her limitation is that the city chose where to build, often on busy streets in growing areas. Those streets might have done better than average anyway, so the lanes may have cost some sales that growth concealed. The study shows that the lanes did not ruin business, but not that they had no cost.",
  },
  {
    task: "Write a critical summary of the article: state its question, claim and evidence in a few sentences, then name one strength and one limitation.",
    source:
      "Abara, C. (2018). The last speakers of Tolo. Abara asked why young people in three villages had stopped speaking Tolo, a language now spoken by about 300 people. She lived in the villages for a year and interviewed 60 residents of all ages. Most young people said that Tolo was useful only at home, while the regional language was needed for school, work and the internet. Abara argues that the language will survive only if it gains a role outside the home, for example in local schools and radio. She worked through an interpreter for older speakers.",
    model:
      "Abara (2018) asks why the young people of three villages have stopped speaking Tolo, a language with about 300 speakers left. Living in the villages for a year and interviewing 60 residents of all ages, she found that young people saw Tolo as useful only at home, while the regional language opened school, work and the internet. She argues that Tolo can survive only if it gains a role beyond the home, in local schools and on the radio. The study's strength is its depth: a year in the villages let her understand the reasons behind young people's choices, which a survey could not reveal. Its limitation is that she relied on an interpreter for older speakers, whose views may have lost detail in translation; and because the study describes three villages, its recommendation rests on what residents expect to work rather than on evidence from places that have tried it.",
  },
  {
    task: "Write a critical summary of the article: state its question, claim and evidence in a few sentences, then name one strength and one limitation.",
    source:
      "Petrov, I. (2022). Free breakfast and school attendance. Petrov asked whether free school breakfasts raise attendance. Three hundred schools were chosen at random; half began serving free breakfast for a year and half did not. Attendance rose by 3 percentage points in the breakfast schools and did not change in the others, with the largest rise among students from low-income families. Petrov argues that free breakfast is a cheap way to improve attendance. The study lasted one year, and test scores were not measured.",
    model:
      "Petrov (2022) asks whether free school breakfasts raise attendance. In a trial of 300 randomly chosen schools, half served free breakfast for a year; attendance rose by 3 percentage points in those schools and did not change in the others, with the largest rise among low-income students. Petrov argues that free breakfast is an inexpensive way to get more students into school. The study's strength is its design: because schools were assigned at random, the rise can be credited to the breakfasts rather than to differences between schools that chose to offer them. Its limitation is that it measures only attendance over one year. It cannot say whether the effect lasts once the program is no longer new, or whether students who attend more also learn more, which is the outcome schools ultimately care about.",
  },
];

/** researchQuestionBank asks for a research question narrow enough to answer and open enough to argue, with a sentence on why it matters. */
export const researchQuestionBank: readonly WritingItem[] = [
  {
    task: "Turn this broad topic into a focused research question. Write the question, then two or three sentences explaining why it is answerable, arguable and worth asking.",
    source: "Topic: social media and teenagers.",
    model:
      "Question: Does turning off notifications for two weeks change how much time teenagers in my school spend on social media, and how anxious they report feeling?\n\nThis question is narrow enough to answer: it names one change, one group and two outcomes I can measure with phones' screen-time reports and a short survey. It is open enough to argue, because the result could go either way, and people disagree about whether teenagers' habits depend on design or on willpower. It matters because if a simple setting helps, schools and families could act on it at once.",
  },
  {
    task: "Turn this broad topic into a focused research question. Write the question, then two or three sentences explaining why it is answerable, arguable and worth asking.",
    source: "Topic: climate change.",
    model:
      "Question: How have the dates on which our city's river first freezes changed since 1950, and what do local farmers say those changes have meant for their planting?\n\nThe question is answerable because the city has kept records of the river's freezing for over seventy years, and farmers can be interviewed. It is arguable because the records may show a clear trend or a noisy one, and farmers may disagree about how much it matters. It is worth asking because it connects a global problem to evidence and lives that local readers know.",
  },
  {
    task: "Turn this broad topic into a focused research question. Write the question, then two or three sentences explaining why it is answerable, arguable and worth asking.",
    source: "Topic: video games.",
    model:
      "Question: Do players of cooperative online games report more friendships that continue offline than players of games played alone?\n\nThis can be answered with a survey of players about the games they play and the friends they made through them. It is arguable, because many people believe games isolate players while others say they connect them, and a survey could support either side. It matters because the answer would help parents and teachers judge games by how they are played, not by the time spent on them.",
  },
  {
    task: "Turn this broad topic into a focused research question. Write the question, then two or three sentences explaining why it is answerable, arguable and worth asking.",
    source: "Topic: the history of the city.",
    model:
      "Question: Why did the city's textile mills close between 1960 and 1980, and how did the local newspaper explain their closing to readers at the time?\n\nThe question is answerable from company records, government reports and the newspaper's archive, which the library holds. It is arguable because the causes, such as foreign competition, new machines or poor management, can be weighed differently, and the newspaper's account may differ from the records. It matters because the closures shaped the city that exists today, and the way they were reported shows what people were told about their own lives.",
  },
  {
    task: "Turn this broad topic into a focused research question. Write the question, then two or three sentences explaining why it is answerable, arguable and worth asking.",
    source: "Topic: school lunches.",
    model:
      "Question: When our school cafeteria put fruit at the front of the line instead of the end, did students take and eat more of it?\n\nThis is answerable because the cafeteria records how much fruit it serves and how much is thrown away, and those numbers can be compared before and after the change. It is arguable because some researchers find that placement changes what people eat while others find the effect fades quickly. It matters because a free change that improves students' diets would be easy for other schools to copy.",
  },
  {
    task: "Turn this broad topic into a focused research question. Write the question, then two or three sentences explaining why it is answerable, arguable and worth asking.",
    source: "Topic: learning languages.",
    model:
      "Question: Among adult learners of English at our community college, do those who talk with a conversation partner once a week improve their speaking more in one term than those who study only in class?\n\nThis can be answered by testing learners' speaking at the start and end of a term and comparing the two groups. It is arguable because learners who choose partners may already be more motivated, so the result needs careful interpretation. It matters because the college could set up partnerships cheaply if they help.",
  },
  {
    task: "Turn this broad topic into a focused research question. Write the question, then two or three sentences explaining why it is answerable, arguable and worth asking.",
    source: "Topic: public libraries.",
    model:
      "Question: Who uses our public library in the evening, and what do they say they would lose if evening hours were cut?\n\nThe question is answerable with a count of evening visitors and short interviews over a few weeks. It is arguable because the library's board believes evening use is too low to justify the cost, while regular visitors say the hours are essential. It matters because the board will decide on the hours next year, and it has no evidence beyond the number of visitors.",
  },
  {
    task: "Turn this broad topic into a focused research question. Write the question, then two or three sentences explaining why it is answerable, arguable and worth asking.",
    source: "Topic: advertising.",
    model:
      "Question: How did advertisements for cereal in children's magazines change between 1980 and 2020 in the health claims they made?\n\nThis is answerable, because the magazines are held in libraries and their advertisements can be sorted by year and by claim. It is arguable because the change could be read as a response to parents' concerns or as a new way to sell the same products. It matters because the answer shows how companies adapt their messages to children as public worries about health grow.",
  },
  {
    task: "Turn this broad topic into a focused research question. Write the question, then two or three sentences explaining why it is answerable, arguable and worth asking.",
    source: "Topic: sleep.",
    model:
      "Question: Do students at my school who stop using their phones an hour before bed fall asleep sooner and feel more alert in first period?\n\nThis can be answered by asking volunteers to keep a sleep diary for two weeks with phones and two without, and to rate their alertness each morning. It is arguable because some studies blame the light of screens and others blame what students read on them, and a diary may not settle the matter. It matters because the advice to put phones away is common but rarely tested by students themselves.",
  },
  {
    task: "Turn this broad topic into a focused research question. Write the question, then two or three sentences explaining why it is answerable, arguable and worth asking.",
    source: "Topic: immigration.",
    model:
      "Question: How did the arrival of immigrant families after 2000 change the number and kinds of small businesses on our city's main street?\n\nThe question is answerable with business licenses from the city archive, old photographs and interviews with owners. It is arguable because people disagree about whether newcomers revived the street or pushed out older shops, and the records may support parts of both views. It matters because debates about immigration often lack local evidence, and this question supplies some.",
  },
  {
    task: "Turn this broad topic into a focused research question. Write the question, then two or three sentences explaining why it is answerable, arguable and worth asking.",
    source: "Topic: music and studying.",
    model:
      "Question: Do students who listen to music without lyrics while reading remember more of a passage than students who listen to songs with lyrics or to nothing?\n\nThis can be answered with a simple experiment: three groups read the same passage under different conditions and then answer the same questions. It is arguable because many students insist that music helps them focus, while earlier studies suggest lyrics compete with reading for attention. It matters because nearly every student studies with music, and the answer could change how they do it.",
  },
  {
    task: "Turn this broad topic into a focused research question. Write the question, then two or three sentences explaining why it is answerable, arguable and worth asking.",
    source: "Topic: online shopping.",
    model:
      "Question: How have the shops on our town's high street responded to online shopping since 2010, and which kinds of shop have survived?\n\nThe question is answerable from the town's business directories for each year and from interviews with shop owners who stayed and those who left. It is arguable because some blame online shopping for every empty shop, while rents and parking may matter as much. It matters because the town council is planning how to help the high street, and it needs to know what has actually worked.",
  },
];

/** annotatedBibliographyBank asks for two entries of an annotated bibliography, each a citation with a summary, an evaluation and its use. */
export const annotatedBibliographyBank: readonly WritingItem[] = [
  {
    task: "Write two entries of an annotated bibliography in APA style for a paper on whether schools should start later. For each source, give the reference, then a short annotation that summarizes it, evaluates it and says how you will use it.",
    source:
      'Source 1: Okafor, Nkem. 2021. "Sleep and Memory in Adolescence." Journal of School Health Research, volume 14, issue 2, pages 33-51. A study of 400 students\' sleep and memory over two weeks in one city.\nSource 2: Reyes, Paul. 2022. "Why Teens Can\'t Wake Up." City Weekly magazine, 4 March, pages 18-20. A journalist\'s feature that interviews two sleep researchers and three families.',
    model:
      "Okafor, N. (2021). Sleep and memory in adolescence. *Journal of School Health Research, 14*(2), 33-51.\n\nOkafor tracked the sleep of 400 students aged 14 to 17 for two weeks and found that those who slept more than eight hours scored about 11 points higher on a memory test, even after accounting for earlier grades. As a peer-reviewed study with measured sleep, it is the strongest evidence I have found, though it covers only one city and shows a link rather than a cause. I will use it as the main evidence that sleep affects learning, and I will note its limits when I discuss start times.\n\nReyes, P. (2022, March 4). Why teens can't wake up. *City Weekly*, 18-20.\n\nReyes explains, through interviews with two sleep researchers and three families, why teenagers' body clocks make early mornings hard and how families cope. Because it is a magazine feature, it is not peer reviewed and gives no data of its own, but it explains the science clearly and shows its human cost. I will use it for background in my introduction and for one family's example, and I will cite the researchers' studies directly where I can.",
  },
  {
    task: "Write two entries of an annotated bibliography in MLA style for a paper on light pollution and wildlife. For each source, give the works-cited entry, then a short annotation that summarizes it, evaluates it and says how you will use it.",
    source:
      "Source 1: Lena Brandt and Jules Moreau. 2019. \"Bright Nights: Artificial Light and the Nesting Success of City Birds.\" Urban Ecology Quarterly, volume 8, issue 3, pages 201-219. A study of 60 nests in three cities.\nSource 2: Hana Ito. 2020. Book: The Vanishing Dark: How Light Changed the Night. Riverside University Press. A historian's account of how electric light spread and how people's views of the night changed.",
    model:
      'Brandt, Lena, and Jules Moreau. "Bright Nights: Artificial Light and the Nesting Success of City Birds." *Urban Ecology Quarterly*, vol. 8, no. 3, 2019, pp. 201-19.\n\nBrandt and Moreau monitored 60 nests in three cities and found that 41% of nests in bright areas failed, against 18% in dark ones, while noise mattered little. The study is peer reviewed and measures light and noise at every nest, though its sample is small and the two were often found together. It will be my central evidence that light harms birds, and I will use its admission about noise to show why experiments are still needed.\n\nIto, Hana. *The Vanishing Dark: How Light Changed the Night*. Riverside UP, 2020.\n\nIto traces how electric light spread through cities from the 1880s and how people came to see darkness as dangerous. Written by a historian and published by a university press, it is well documented, but it says little about animals. I will use it in my introduction to explain why cities are so bright and why proposals to dim them meet resistance.',
  },
  {
    task: "Write two entries of an annotated bibliography in APA style for a paper on homework in primary school. For each source, give the reference, then a short annotation that summarizes it, evaluates it and says how you will use it.",
    source:
      'Source 1: Haddad, Samira. 2020. "Homework and Reading Progress in Primary School." Educational Review, volume 72, issue 5, pages 610-628. A comparison of homework and reading results in 120 schools over three years.\nSource 2: Wells, Grace. 2019. Website article: "The Case for Homework." National Parents\' Forum, published 12 September, at parentsforum.org/homework. A parents\' group\'s article arguing that homework builds good habits, citing surveys of parents.',
    model:
      "Haddad, S. (2020). Homework and reading progress in primary school. *Educational Review, 72*(5), 610-628.\n\nHaddad compared the weekly homework set in 120 primary schools with three years of reading results and found that schools setting over an hour a week progressed no faster than schools setting none. The study is large and long, which makes it persuasive, but it measured only the amount of homework, not its type. I will use it as my main evidence that more homework does not mean more progress, while noting that it cannot rule out the value of good homework.\n\nWells, G. (2019, September 12). *The case for homework*. National Parents' Forum. https://parentsforum.org/homework\n\nWells argues that homework teaches children responsibility and keeps parents informed about what their children are learning, citing surveys of parents. As an advocacy group's article, it presents one side and offers opinions rather than evidence of learning, but it shows clearly why many parents value homework. I will use it to state the opposing view fairly before I respond to it.",
  },
  {
    task: "Write two entries of an annotated bibliography in MLA style for a paper on the minimum wage. For each source, give the works-cited entry, then a short annotation that summarizes it, evaluates it and says how you will use it.",
    source:
      'Source 1: Per Lindqvist. 2018. "Who Pays for the Minimum Wage?" Journal of Labor Studies, volume 39, issue 1, pages 45-70. A comparison of restaurant jobs in two regions over four years.\nSource 2: Dana Okoro. 2021. "Living on the Minimum." The Daily Ledger newspaper, 9 May. A reporter follows three workers in fast-food restaurants for a month.',
    model:
      'Lindqvist, Per. "Who Pays for the Minimum Wage?" *Journal of Labor Studies*, vol. 39, no. 1, 2018, pp. 45-70.\n\nLindqvist compared restaurant employment in two neighboring regions over four years, one of which raised its minimum wage by 15%, and found that jobs for workers under 25 fell by 2% there and by 1% in the other region. The comparison of neighbors is a strong design, but the regions differ in tourism, and only restaurants were studied. I will use it as evidence that modest increases cost few jobs, and I will raise its narrow scope when I weigh it against other studies.\n\nOkoro, Dana. "Living on the Minimum." *The Daily Ledger*, 9 May 2021.\n\nOkoro follows three fast-food workers for a month and describes how they budget for rent, food and travel. A newspaper report of three people cannot show what is typical, but it is vivid and specific about the costs of living on a low wage. I will use one worker\'s story to open my paper and show what is at stake, without treating it as evidence of a trend.',
  },
  {
    task: "Write two entries of an annotated bibliography in APA style for a paper on how teenagers judge news. For each source, give the reference, then a short annotation that summarizes it, evaluates it and says how you will use it.",
    source:
      'Source 1: Ferreira, Ana, and Kim, Daniel. 2022. "Shared, Not Read: How Teenagers Decide Which News to Trust." Journal of Youth and Media, volume 5, issue 1, pages 12-30. Interviews and observation of 40 teenagers.\nSource 2: Global Media Survey Group. 2023. Report: Young People and News 2023. Published by the Global Media Survey Group. A survey of 20,000 people aged 13 to 24 in 15 countries about where they get news.',
    model:
      "Ferreira, A., & Kim, D. (2022). Shared, not read: How teenagers decide which news to trust. *Journal of Youth and Media, 5*(1), 12-30.\n\nFerreira and Kim interviewed 40 teenagers and watched them scroll their feeds, finding that most had shared stories without opening them and trusted a friend's share more than the outlet. Its close observation of real behavior is its strength, though 40 volunteers from two schools are not a representative sample. I will use it to explain why teenagers trust what they trust, the part of my argument that numbers alone cannot show.\n\nGlobal Media Survey Group. (2023). *Young people and news 2023*.\n\nThis report surveys 20,000 people aged 13 to 24 in 15 countries about where they find news and how much they trust it. Its size and range make it a reliable picture of habits across countries, but it records what people say rather than what they do, and it does not explain their reasons. I will use its figures to show how widespread news on social media has become, and pair them with Ferreira and Kim's explanations.",
  },
  {
    task: "Write two entries of an annotated bibliography in MLA style for a paper on who wrote King Edmund's letters. For each source, give the works-cited entry, then a short annotation that summarizes it, evaluates it and says how you will use it.",
    source:
      'Source 1: Kwame Mensah. 2017. "The Secretary\'s Hand: Rethinking the Authorship of the Royal Letters." Historical Journal of the North, volume 60, issue 4, pages 377-399. An argument from handwriting and travel records that the secretary wrote the letters.\nSource 2: Margaret Hollis. 1962. Book: Edmund the Bold: A Life. Crown Street Press. A biography that treats the king as the author of the letters.',
    model:
      "Mensah, Kwame. \"The Secretary's Hand: Rethinking the Authorship of the Royal Letters.\" *Historical Journal of the North*, vol. 60, no. 4, 2017, pp. 377-99.\n\nMensah compares the handwriting of three royal letters with samples from King Edmund and his secretary, Thomas Hale, and uses court records to show that the king was abroad when the third was written; he concludes that Hale wrote them. The handwriting evidence is strong, but his further claim that Hale shaped the policies goes beyond it. I will use this article as the center of my paper, accepting the claim about the pen and testing the claim about the policies.\n\nHollis, Margaret. *Edmund the Bold: A Life*. Crown Street Press, 1962.\n\nHollis's biography presents Edmund as a forceful king and treats the letters as his own words, the view most historians held before Mensah. It is detailed and widely cited, but it never examines the letters' handwriting. I will use it to show the traditional view that Mensah challenges and to explain why that view lasted so long.",
  },
  {
    task: "Write two entries of an annotated bibliography in APA style for a paper on note-taking in university lectures. For each source, give the reference, then a short annotation that summarizes it, evaluates it and says how you will use it.",
    source:
      'Source 1: Novak, Eva. 2021. "Handwritten Notes and Conceptual Understanding." Learning and Instruction Today, volume 33, pages 88-104. An experiment with 150 students and one recorded lecture.\nSource 2: Park, Joon. 2023. Conference paper: "Typing, Reviewing, Remembering: A Semester-Long Study of Laptop Notes." Proceedings of the Conference on Teaching in Higher Education, pages 55-63. A study of 90 students who typed notes and reviewed them over a semester.',
    model:
      "Novak, E. (2021). Handwritten notes and conceptual understanding. *Learning and Instruction Today, 33*, 88-104.\n\nNovak randomly assigned 150 students to take notes by hand or on laptops during one recorded lecture and found that the handwriting group did 7% better on questions about ideas a week later, with no difference on facts. Random assignment makes the result credible, but one 20-minute lecture is far from a real course. I will use it as evidence that the method of note-taking can matter, while stressing that it tests a single sitting.\n\nPark, J. (2023). Typing, reviewing, remembering: A semester-long study of laptop notes. In *Proceedings of the Conference on Teaching in Higher Education* (pp. 55-63).\n\nPark followed 90 students who typed their notes over a semester and found that those who reviewed and rewrote them each week did as well as handwriters in earlier studies. A reviewed conference paper, it covers a real course but has no handwriting group of its own. I will use it to argue that what students do with their notes may matter more than how they take them.",
  },
  {
    task: "Write two entries of an annotated bibliography in MLA style for a paper on bilingualism and ageing. For each source, give the works-cited entry, then a short annotation that summarizes it, evaluates it and says how you will use it.",
    source:
      'Source 1: Hiroshi Tanaka. 2019. "Two Languages and the Ageing Mind." Journal of Ageing Studies, volume 22, issue 2, pages 140-162. A ten-year study of 2,000 adults over 65.\nSource 2: Sara Lind. 2021. "Does Speaking Two Languages Really Protect the Brain?" Mind Matters website, published 3 June. A science writer\'s article reviewing studies on both sides of the question.',
    model:
      'Tanaka, Hiroshi. "Two Languages and the Ageing Mind." *Journal of Ageing Studies*, vol. 22, no. 2, 2019, pp. 140-62.\n\nTanaka followed 2,000 adults over 65 for ten years and found that those who used two languages daily were diagnosed with memory loss about four years later than those who used one. The study\'s size and length are impressive, but bilingual participants also had more education, which may explain part of the gap. I will present it as the strongest evidence for a protective effect and use its weakness to frame the debate.\n\nLind, Sara. "Does Speaking Two Languages Really Protect the Brain?" *Mind Matters*, 3 June 2021.\n\nLind reviews studies on both sides and concludes that the evidence is mixed, with larger and more careful studies finding smaller effects. As a science writer\'s summary, it is not original research, but it is balanced and points to the studies themselves. I will use it to find the studies that disagree with Tanaka and to explain to readers why researchers have not reached agreement.',
  },
  {
    task: "Write two entries of an annotated bibliography in APA style for a paper on trees and heat in cities. For each source, give the reference, then a short annotation that summarizes it, evaluates it and says how you will use it.",
    source:
      'Source 1: Osei, Ruth. 2023. "Cooling the Street: Tree Cover and Summer Heat in Fourteen Neighborhoods." Journal of Urban Climate, volume 11, pages 220-241. A study of temperature sensors and aerial photographs in one city.\nSource 2: City Planning Department. 2022. Report: Heat Action Plan 2022-2030. Published by the city. The city\'s plan for reducing heat, including a budget for planting 20,000 trees.',
    model:
      "Osei, R. (2023). Cooling the street: Tree cover and summer heat in fourteen neighborhoods. *Journal of Urban Climate, 11*, 220-241.\n\nOsei recorded temperatures across 14 neighborhoods through a summer and found that each 10% increase in tree cover was linked to afternoon temperatures 0.6 degrees lower, with the poorest areas having the fewest trees. The measurements are thorough, but areas with fewer trees also had more pavement, so the trees' effect may be overstated. I will use it as the main evidence for my claim that tree planting should begin in low-income neighborhoods.\n\nCity Planning Department. (2022). *Heat action plan 2022-2030*.\n\nThe city's plan sets out how it will reduce summer heat, including a budget to plant 20,000 trees, but it does not say where the trees will go first. As an official document, it is authoritative about the city's intentions, though not a source of evidence about what works. I will use it to show what the city has already promised and to argue that Osei's findings should decide where the trees are planted.",
  },
  {
    task: "Write two entries of an annotated bibliography in MLA style for a paper on bike lanes. For each source, give the works-cited entry, then a short annotation that summarizes it, evaluates it and says how you will use it.",
    source:
      'Source 1: Marta Duarte. 2020. "Bike Lanes and Local Business." Transport Policy Review, volume 17, issue 2, pages 99-118. A comparison of sales in 1,000 shops over three years.\nSource 2: Main Street Traders\' Association. 2021. Leaflet: "Save Our Parking." Published by the association. A leaflet opposing a new bike lane, stating that 70% of customers arrive by car.',
    model:
      "Duarte, Marta. \"Bike Lanes and Local Business.\" *Transport Policy Review*, vol. 17, no. 2, 2020, pp. 99-118.\n\nDuarte compared three years of sales from 500 shops on streets that gained bike lanes with 500 similar shops elsewhere and found that sales rose slightly faster where lanes were built. The comparison group makes the study convincing, although the city often built lanes on busy streets that may have done well anyway. I will use it as my main evidence that bike lanes do not harm local shops.\n\nMain Street Traders' Association. *Save Our Parking*. Main Street Traders' Association, 2021.\n\nThis leaflet opposes a new bike lane and states that 70% of customers arrive by car, without saying where the figure comes from. As a document produced by an interested group, it cannot be trusted as evidence, but it shows clearly what shop owners fear. I will use it to present their concern fairly and then test its claim against Duarte's data.",
  },
  {
    task: "Write two entries of an annotated bibliography in APA style for a paper on endangered languages. For each source, give the reference, then a short annotation that summarizes it, evaluates it and says how you will use it.",
    source:
      'Source 1: Abara, Chioma. 2018. Book: The Last Speakers of Tolo. Lakeside University Press. A year of fieldwork and 60 interviews in three villages.\nSource 2: Moreno, Luis. 2020. "Radio and the Revival of Minority Languages." Language Policy Journal, volume 19, issue 3, pages 301-322. A study of six radio stations that broadcast in minority languages.',
    model:
      "Abara, C. (2018). *The last speakers of Tolo*. Lakeside University Press.\n\nAbara spent a year in three villages and interviewed 60 residents, finding that young people saw Tolo as useful only at home and turned to the regional language for school and work. Her long fieldwork gives rare insight into young people's reasons, though she depended on an interpreter for older speakers. I will use her book to explain why languages like Tolo decline, which is the starting point of my paper.\n\nMoreno, L. (2020). Radio and the revival of minority languages. *Language Policy Journal, 19*(3), 301-322.\n\nMoreno studied six radio stations broadcasting in minority languages and found that young listeners rose where stations played music and local news rather than only traditional programs. The study is peer reviewed and compares several places, but six stations are a small sample. I will use it to test Abara's recommendation of radio, showing what has worked where it has been tried.",
  },
  {
    task: "Write two entries of an annotated bibliography in MLA style for a paper on free school breakfast. For each source, give the works-cited entry, then a short annotation that summarizes it, evaluates it and says how you will use it.",
    source:
      'Source 1: Ivan Petrov. 2022. "Free Breakfast and School Attendance." Journal of Education Policy, volume 37, issue 6, pages 812-830. A randomized trial in 300 schools over one year.\nSource 2: Aisha Bello. 2023. Website article: "What We Learned From Five Years of Free Breakfast." Food in Schools charity, published 20 January. A charity\'s account of running breakfast clubs in 40 schools, with comments from teachers.',
    model:
      'Petrov, Ivan. "Free Breakfast and School Attendance." *Journal of Education Policy*, vol. 37, no. 6, 2022, pp. 812-30.\n\nPetrov ran a trial in 300 randomly chosen schools and found that attendance rose by 3 percentage points where free breakfast was served for a year, most of all among low-income students. Random assignment makes the result trustworthy, but the trial lasted one year and did not measure learning. I will use it as my central evidence that breakfast raises attendance.\n\nBello, Aisha. "What We Learned From Five Years of Free Breakfast." *Food in Schools*, 20 Jan. 2023.\n\nBello describes five years of breakfast clubs in 40 schools, with teachers reporting calmer mornings and better concentration. As a charity reporting on its own work, it may emphasize success, and its evidence is teachers\' impressions rather than data. Still, it covers a longer period than Petrov\'s trial, so I will use it to suggest that the benefits may last, while noting that this needs testing.',
  },
];

/** paraphraseBank asks for a passage restated faithfully in new words and structure, with its citation. */
export const paraphraseBank: readonly WritingItem[] = [
  {
    task: "Paraphrase this passage: keep all its meaning, change both its words and its sentence structure, and end with an APA in-text citation.",
    source:
      '"Because teenagers\' internal clocks shift later during puberty, a school day that begins at 7:30 a.m. requires many of them to learn at a time when their bodies would otherwise still be asleep." (Okafor, 2021, p. 34)',
    model:
      "Many teenagers are being asked to study while their bodies are, in effect, still in the night. During puberty the body's clock moves later, so classes that start at 7:30 in the morning fall in hours that would naturally be spent sleeping (Okafor, 2021, p. 34).",
  },
  {
    task: "Paraphrase this passage: keep all its meaning, change both its words and its sentence structure, and end with an MLA in-text citation.",
    source:
      '"While much of the research on urban birds has concentrated on the effects of traffic noise, our data indicate that artificial light at night is the stronger predictor of whether a nest succeeds." (Brandt and Moreau 204)',
    model:
      "Studies of birds in cities have mostly asked how the noise of traffic affects them. However, Brandt and Moreau found that the amount of electric light around a nest at night tells us more about its chances of success than noise does (204).",
  },
  {
    task: "Paraphrase this passage: keep all its meaning, change both its words and its sentence structure, and end with an APA in-text citation.",
    source:
      '"Schools that assigned more than sixty minutes of homework each week did not, on average, make greater gains in reading than schools that assigned none at all." (Haddad, 2020, p. 619)',
    model:
      "Setting over an hour of homework a week did not help schools improve reading faster: on average, their progress matched that of schools that gave children no homework whatsoever (Haddad, 2020, p. 619).",
  },
  {
    task: "Paraphrase this passage: keep all its meaning, change both its words and its sentence structure, and end with an MLA in-text citation.",
    source:
      '"The difference in youth employment between the two regions amounted to a single percentage point, a gap far smaller than opponents of the increase had predicted." (Lindqvist 61)',
    model:
      "Opponents of the wage increase had forecast a much larger effect, but jobs for young workers in the region that raised its wage fell by only one percentage point more than in its neighbor (Lindqvist 61).",
  },
  {
    task: "Paraphrase this passage: keep all its meaning, change both its words and its sentence structure, and end with an APA in-text citation.",
    source:
      '"For most of the teenagers we interviewed, the identity of the friend who shared a story mattered more to its credibility than the reputation of the outlet that had published it." (Ferreira & Kim, 2022, p. 21)',
    model:
      "When deciding whether to believe a story, most of the teenagers interviewed paid more attention to who had passed it on to them than to where it first appeared; a trusted friend counted for more than a respected news source (Ferreira & Kim, 2022, p. 21).",
  },
  {
    task: "Paraphrase this passage: keep all its meaning, change both its words and its sentence structure, and end with an MLA in-text citation.",
    source:
      '"On the date the third letter was written, the court records place the king more than two hundred miles away, in the port of Calder, which makes it impossible that he wrote it with his own hand." (Mensah 390)',
    model:
      "The king could not have written the third letter himself. According to the court records, he was in the port of Calder, over two hundred miles from where the letter was written, on the very day it was dated (Mensah 390).",
  },
  {
    task: "Paraphrase this passage: keep all its meaning, change both its words and its sentence structure, and end with an APA in-text citation.",
    source:
      '"Students who wrote by hand could not record every word of the lecture, and so they were forced to decide what mattered, which appears to have deepened their grasp of its ideas." (Novak, 2021, p. 97)',
    model:
      "Because writing by hand is too slow to capture a lecture word for word, students who took notes this way had to choose what was important. That act of choosing seems to have helped them understand the ideas more fully (Novak, 2021, p. 97).",
  },
  {
    task: "Paraphrase this passage: keep all its meaning, change both its words and its sentence structure, and end with an MLA in-text citation.",
    source:
      '"Participants who used two languages every day received a diagnosis of memory loss, on average, four years later than those who used only one, although the bilingual group had also spent more years in school." (Tanaka 151)',
    model:
      "On average, memory loss was diagnosed about four years later among people who spoke two languages daily than among those who spoke one. The bilingual participants, however, also had more education (Tanaka 151).",
  },
  {
    task: "Paraphrase this passage: keep all its meaning, change both its words and its sentence structure, and end with an APA in-text citation.",
    source:
      '"The neighborhoods with the lowest household incomes had the least tree cover and, consequently, the hottest streets on summer afternoons." (Osei, 2023, p. 233)',
    model:
      "On hot summer afternoons, the warmest streets were found in the poorest parts of the city, where there were also the fewest trees (Osei, 2023, p. 233).",
  },
  {
    task: "Paraphrase this passage: keep all its meaning, change both its words and its sentence structure, and end with an MLA in-text citation.",
    source:
      '"Contrary to the fears expressed by many shop owners, streets that gained bike lanes saw sales grow slightly faster over three years than comparable streets that kept their parking." (Duarte 110)',
    model:
      "Many shop owners worried that losing parking to bike lanes would hurt business. Over a three-year period, however, sales on the streets with new lanes actually rose a little more quickly than on similar streets where parking remained (Duarte 110).",
  },
  {
    task: "Paraphrase this passage: keep all its meaning, change both its words and its sentence structure, and end with an APA in-text citation.",
    source:
      '"Young people did not reject Tolo out of shame; they simply found that it opened no doors beyond the family kitchen, while the regional language opened all of them." (Abara, 2018, p. 87)',
    model:
      "According to Abara (2018), young people gave up Tolo not because they were embarrassed by it but because it was of no use outside their homes. The regional language, by contrast, gave them access to school, work and everything else they wanted (p. 87).",
  },
  {
    task: "Paraphrase this passage: keep all its meaning, change both its words and its sentence structure, and end with an MLA in-text citation.",
    source:
      '"The rise in attendance was concentrated among students from low-income families, for whom the breakfast may have been the most reliable meal of the morning." (Petrov 821)',
    model:
      "Students from poorer families accounted for most of the increase in attendance. Petrov suggests that for these children, the free breakfast may have been the one meal they could count on before school (821).",
  },
];
