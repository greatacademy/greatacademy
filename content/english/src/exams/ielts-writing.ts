// IELTS Writing, judged by a model: Task 1 reports a table given as figures, Task 2 argues an essay. Every task and
// model answer is written for this course.

import { type TopicDef, t } from "@ga/content";
import type { WritingItem } from "@ga/subject-english";
import { judgedExamTopic } from "./kit.ts";

const task1 =
  "Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.";

const task1Bank: readonly WritingItem[] = [
  {
    task: `The table below shows how employees of a city's companies travelled to work in 2004 and 2024. ${task1}`,
    source:
      "Main way of travelling to work (% of employees)\nCar: 2004 52%, 2024 38%\nBus: 2004 21%, 2024 19%\nTrain: 2004 8%, 2024 12%\nBicycle: 2004 2%, 2024 6%\nWalking: 2004 17%, 2024 25%",
    model:
      "The table compares the ways in which employees of a city's companies travelled to work in 2004 and in 2024.\n\nOverall, the car remained the most common way of getting to work, but its share fell considerably, while walking, cycling and the train all became more popular.\n\nIn 2004, just over half of employees (52%) drove to work. Twenty years later, this figure had dropped to 38%, although it was still the highest of all. The bus was the second most common choice in 2004, at 21%, and its share hardly changed, falling only slightly to 19%.\n\nBy contrast, the proportion of people who walked rose from 17% to a quarter, making walking the second most popular way of travelling in 2024. The train also gained users, increasing from 8% to 12%. Cycling remained the least common method in both years, but it saw the largest relative growth: the share of cyclists tripled from 2% to 6%.\n\nIn short, the period saw a clear move away from the car towards walking and other forms of transport.",
  },
  {
    task: `The table below shows the percentage of households with access to the internet in four countries in 2000, 2010 and 2020. ${task1}`,
    source:
      "Households with internet access (%)\nCountry A: 2000 45, 2010 80, 2020 96\nCountry B: 2000 12, 2010 55, 2020 90\nCountry C: 2000 3, 2010 21, 2020 64\nCountry D: 2000 30, 2010 48, 2020 71",
    model:
      "The table shows the proportion of households that could use the internet in four countries in 2000, 2010 and 2020.\n\nOverall, internet access grew in all four countries over the twenty years. Country A had the highest figures throughout, while Country C, despite the lowest starting point, showed the most dramatic growth.\n\nIn 2000, 45% of households in Country A were online, compared with 30% in Country D, 12% in Country B and only 3% in Country C. By 2010, the figure for Country A had reached 80%, and Country B had overtaken Country D, rising more than fourfold to 55%, while Country D increased more gradually to 48%.\n\nIn the following decade, access in Country A rose to almost every household (96%), and Country B came close behind at 90%. Country C, where only a fifth of homes had been connected in 2010, more than tripled its figure to 64%. Country D grew steadily to 71%, which meant that it was now third of the four countries.\n\nIn summary, the gap between the countries narrowed considerably over the period.",
  },
  {
    task: `The table below shows the number of visitors to a museum in each season of 2019 and 2023, in thousands. ${task1}`,
    source:
      "Museum visitors (thousands)\nSpring: 2019 42, 2023 48\nSummer: 2019 95, 2023 70\nAutumn: 2019 38, 2023 55\nWinter: 2019 20, 2023 41\nTotal: 2019 195, 2023 214",
    model:
      "The table gives the number of people who visited a museum in each of the four seasons in 2019 and 2023.\n\nOverall, the total number of visitors rose slightly between the two years, and visits became much more evenly spread across the year. Summer was the busiest season in both years, but it was the only season in which numbers fell.\n\nIn 2019, the museum received 195,000 visitors, almost half of whom (95,000) came in summer. Spring and autumn attracted similar numbers, at 42,000 and 38,000 respectively, while winter was by far the quietest season, with just 20,000 visitors.\n\nBy 2023, the total had grown to 214,000. Summer visits, however, had dropped by about a quarter to 70,000. In contrast, every other season saw an increase. The most striking change was in winter, where the number of visitors roughly doubled to 41,000. Autumn also grew considerably, to 55,000, overtaking spring, which rose more modestly to 48,000.\n\nIn short, the museum became less dependent on its summer visitors over the period.",
  },
  {
    task: `The table below shows the average amount of time that teenagers in one country spent on five activities on a school day in 2010 and 2025, in minutes. ${task1}`,
    source:
      "Average minutes per school day, teenagers\nHomework: 2010 75, 2025 60\nSport and exercise: 2010 50, 2025 35\nWatching television: 2010 110, 2025 40\nUsing a phone online: 2010 30, 2025 160\nReading for pleasure: 2010 25, 2025 15",
    model:
      "The table compares how many minutes teenagers in one country spent on five activities on an average school day in 2010 and 2025.\n\nThe most noticeable feature is the dramatic shift from television to phones. In addition, time spent on every activity except phone use fell over the period.\n\nIn 2010, watching television took up more time than any other activity, at 110 minutes a day, followed by homework at 75 minutes and sport at 50. Teenagers spent only half an hour online on their phones and just 25 minutes reading for pleasure.\n\nBy 2025, the picture had changed completely. Time spent online on phones had increased more than fivefold, to 160 minutes, which made it by far the largest activity. Television viewing, by contrast, dropped sharply to 40 minutes, little more than a third of the earlier figure. Homework and sport both decreased by 15 minutes, to 60 and 35 minutes respectively, and reading fell to just a quarter of an hour.\n\nOverall, phones appear to have taken time from almost every other activity.",
  },
  {
    task: `The table below shows how a town council spent its budget in 2015 and 2025, in millions of dollars. ${task1}`,
    source:
      "Council spending (millions of dollars)\nSchools: 2015 30, 2025 36\nRoads: 2015 18, 2025 12\nParks and sport: 2015 6, 2025 9\nHousing: 2015 14, 2025 25\nLibraries: 2015 5, 2025 3\nTotal: 2015 73, 2025 85",
    model:
      "The table illustrates the spending of a town council on five services in 2015 and 2025.\n\nOverall, the council's total budget increased from 73 million dollars to 85 million dollars, and schools received the largest share in both years. However, the money was divided rather differently, with housing gaining most and roads and libraries losing.\n\nIn 2015, schools took 30 million dollars, roughly two fifths of the total. Roads came second at 18 million dollars, while housing received 14 million dollars. Parks and sport, and libraries, were given the smallest amounts, at 6 million dollars and 5 million dollars.\n\nTen years later, spending on schools had risen to 36 million dollars. The most significant change, though, was in housing, where spending almost doubled to 25 million dollars, making it the second largest area of spending. Parks and sport also received more, 9 million dollars. In contrast, the budget for roads was cut by a third to 12 million dollars, and spending on libraries fell from 5 million dollars to 3 million dollars.\n\nIn summary, the council moved money from roads and libraries towards housing, schools and leisure.",
  },
  {
    task: `The table below shows the sources of electricity in one country in 2000 and 2024, as percentages of the total. ${task1}`,
    source:
      "Electricity produced by source (%)\nCoal: 2000 58, 2024 22\nGas: 2000 25, 2024 31\nNuclear: 2000 12, 2024 14\nWind: 2000 1, 2024 21\nSolar: 2000 0, 2024 9\nWater: 2000 4, 2024 3",
    model:
      "The table shows what proportion of one country's electricity came from six different sources in 2000 and 2024.\n\nOverall, the country moved away from coal towards gas and, above all, renewable sources such as wind and solar power. Nuclear and water power changed very little.\n\nIn 2000, coal was the dominant source, producing well over half of the country's electricity (58%). Gas supplied a quarter, and nuclear power about an eighth. Wind and water power together accounted for only 5%, and solar power produced none at all.\n\nBy 2024, the share of coal had fallen dramatically to 22%, and gas had become the largest single source, at 31%. The most striking growth was in wind power, which rose from just 1% to 21%, almost equal to coal. Solar power, which had not been used in 2000, now produced 9%. Meanwhile, nuclear power increased slightly to 14%, and water power dropped from 4% to 3%.\n\nIn summary, renewable sources made up nearly a third of the total in 2024, compared with 5% in 2000.",
  },
  {
    task: `The table below shows the average price of a two-bedroom flat and average yearly income in a city in four years, in thousands of dollars. ${task1}`,
    source:
      "Average flat price and average yearly income (thousands of dollars)\n2000: price 120, income 30\n2008: price 210, income 38\n2016: price 260, income 44\n2024: price 390, income 52",
    model:
      "The table compares the average price of a two-bedroom flat with average yearly income in a city in 2000, 2008, 2016 and 2024.\n\nOverall, both figures rose throughout the period, but flat prices grew much faster than incomes, so homes became far less affordable.\n\nIn 2000, a typical flat cost 120,000, dollars which was four times the average yearly income of 30,000 dollars. By 2008, the price had risen sharply to 210,000, dollars whereas income had increased only to 38,000, dollars meaning that a flat now cost about five and a half years of income.\n\nThe rise in prices slowed between 2008 and 2016, when they reached 260,000, dollars while incomes grew to 44,000 dollars. After 2016, however, prices increased dramatically again, to 390,000 dollars in 2024. Income, in contrast, continued its slow and steady growth, reaching 52,000 dollars.\n\nAs a result, in 2024 the average flat cost roughly seven and a half times the average income, almost double the ratio of 2000. While prices more than tripled over the period, incomes did not even double.",
  },
  {
    task: `The table below shows the percentage of adults in one country who did sport at least once a week in 2024, by age group and sex. ${task1}`,
    source:
      "Adults doing sport at least once a week (%)\n16–24: men 68, women 55\n25–34: men 58, women 49\n35–49: men 47, women 44\n50–64: men 36, women 38\n65 and over: men 22, women 25",
    model:
      "The table shows the proportion of men and women in five age groups who took part in sport at least once a week in one country in 2024.\n\nOverall, participation in sport fell steadily with age for both sexes. Men were more active than women in the younger age groups, but this difference disappeared and was slightly reversed among older adults.\n\nThe youngest group, aged 16 to 24, was the most active: more than two thirds of men (68%) and over half of women (55%) did sport every week. Among people aged 25 to 34, the figures fell to 58% and 49% respectively.\n\nThe gap between the sexes narrowed in middle age. In the 35–49 group, 47% of men and 44% of women did sport, and in the 50–64 group women were slightly more active than men, at 38% compared with 36%. The same pattern appeared in the oldest group, where only about a quarter of women (25%) and just over a fifth of men (22%) did sport regularly.\n\nIn short, age seems to have a stronger effect than sex on how much people exercise.",
  },
  {
    task: `The table below shows the number of international tourists who visited five regions of a country in 2014, 2019 and 2024, in millions. ${task1}`,
    source:
      "International tourists (millions)\nCapital: 2014 8.2, 2019 10.5, 2024 9.8\nCoast: 2014 6.0, 2019 7.1, 2024 9.4\nMountains: 2014 1.5, 2019 2.9, 2024 4.2\nLakes: 2014 2.2, 2019 2.3, 2024 2.2\nSouth: 2014 0.8, 2019 0.9, 2024 1.7",
    model:
      "The table gives the number of international tourists, in millions, who visited five regions of a country in 2014, 2019 and 2024.\n\nOverall, the capital and the coast received the most visitors throughout the period, but the fastest growth took place in the mountains and the south. The lakes were the only region where numbers did not change.\n\nIn 2014, the capital was the most popular region, with 8.2 million tourists, followed by the coast with 6 million. The other three regions attracted far fewer visitors: 2.2 million went to the lakes, 1.5 million to the mountains and only 0.8 million to the south.\n\nBy 2019, numbers had risen in every region except the lakes, and the capital reached a peak of 10.5 million. Five years later, however, it had fallen slightly to 9.8 million, while the coast grew considerably to 9.4 million and almost caught up. The mountains showed the most dramatic growth over the decade, with numbers nearly tripling to 4.2 million, and visitors to the south roughly doubled to 1.7 million.\n\nIn summary, tourism spread more widely across the country.",
  },
  {
    task: `The table below shows how households in one city disposed of their waste in 2010 and 2024, as percentages of the total. ${task1}`,
    source:
      "Household waste by method of disposal (%)\nBuried in landfill: 2010 64, 2024 27\nRecycled: 2010 18, 2024 41\nComposted: 2010 6, 2024 15\nBurned to produce energy: 2010 12, 2024 17",
    model:
      "The table shows the proportions of household waste in one city that were disposed of in four different ways in 2010 and 2024.\n\nOverall, the city greatly reduced the amount of waste it buried in landfill and increased every other method, particularly recycling.\n\nIn 2010, landfill was by far the most common method, accounting for almost two thirds of all household waste (64%). Less than a fifth was recycled (18%), and an even smaller share was burned to produce energy (12%). Composting was the least used method, at just 6%.\n\nBy 2024, the situation had changed considerably. The proportion of waste sent to landfill had fallen to 27%, less than half of the 2010 figure. Recycling had more than doubled to 41%, which made it the most common method. Composting also rose sharply, to 15%, and the share of waste burned for energy grew more gradually to 17%.\n\nIn summary, by 2024 almost three quarters of the city's household waste was recycled, composted or used to produce energy, compared with just over a third fourteen years earlier.",
  },
  {
    task: `The table below shows the main reasons why students chose their university in 2005 and 2025, as percentages of students. ${task1}`,
    source:
      "Main reason for choosing a university (% of students)\nThe course: 2005 41, 2025 48\nThe location: 2005 25, 2025 21\nThe cost: 2005 4, 2025 15\nThe university's reputation: 2005 22, 2025 12\nFriends or family: 2005 8, 2025 4",
    model:
      "The table compares the main reasons that students gave for choosing their university in 2005 and 2025.\n\nOverall, the course itself was the most important reason in both years, and its importance grew. The most significant changes were a sharp rise in the importance of cost and a fall in the importance of reputation.\n\nIn 2005, 41% of students said that the course was their main reason, while a quarter chose a university because of its location. The university's reputation was the deciding factor for 22%, and only small minorities mentioned friends or family (8%) or the cost (4%).\n\nTwenty years later, the course was the main reason for almost half of students (48%). Cost had become far more important: the proportion of students who chose a university mainly because of its price nearly quadrupled, to 15%. By contrast, the share who were influenced by reputation almost halved, falling to 12%, and location also became slightly less important, at 21%. Friends and family mattered least of all, at 4%.\n\nIn short, students' choices became more practical over the period.",
  },
  {
    task: `The table below shows the average daily water use per person in four countries in 2024, by purpose, in litres. ${task1}`,
    source:
      "Average daily water use per person (litres)\nCountry A: drinking and cooking 10, washing 85, toilet 60, garden 45, total 200\nCountry B: drinking and cooking 8, washing 60, toilet 35, garden 7, total 110\nCountry C: drinking and cooking 6, washing 30, toilet 12, garden 2, total 50\nCountry D: drinking and cooking 9, washing 70, toilet 40, garden 31, total 150",
    model:
      "The table shows how many litres of water a person used each day for four purposes in four countries in 2024.\n\nOverall, people in Country A used the most water and those in Country C the least, and washing was the largest use of water in every country. Drinking and cooking took only a small amount everywhere.\n\nThe average person in Country A used 200 litres a day, four times as much as a person in Country C, at 50 litres. Country D came second, at 150 litres, and Country B third, at 110 litres.\n\nWashing accounted for between 30 litres in Country C and 85 litres in Country A. Toilets were the second largest use in all four countries, ranging from 12 litres to 60 litres. The greatest difference between the countries was in garden use: a person in Country A used 45 litres a day on the garden and one in Country D 31 litres, while people in Countries B and C used very little. By contrast, water for drinking and cooking varied only slightly, from 6 to 10 litres.\n\nIn summary, the differences between the countries came mainly from washing, toilets and gardens.",
  },
];

const task2 =
  "Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.";

const task2Bank: readonly WritingItem[] = [
  {
    task: `Some people think that children should begin learning a foreign language at primary school. Others believe that it is better to start at secondary school. Discuss both views and give your own opinion. ${task2}`,
    model:
      "People disagree about the best age to begin learning a foreign language at school. While some argue that it should wait until secondary school, I believe that the benefits of starting at primary school are greater.\n\nThose who prefer a later start have some reasonable arguments. Young children still need to master their first language, and some parents worry that a second one could confuse them. In addition, primary schools often lack qualified language teachers, and a poor teacher may do more harm than good. Older students, on the other hand, can understand grammar rules and study more efficiently, so they may learn quickly in a short time.\n\nHowever, there are strong reasons to start earlier. Firstly, young children are much better at imitating sounds, so those who begin at seven or eight usually develop more natural pronunciation than those who begin at twelve. Secondly, early learning gives students more years of practice, and language ability depends heavily on the amount of time spent using a language. Finally, young children are less afraid of making mistakes. A ten-year-old will happily sing a song in a new language, while a teenager is often too embarrassed to speak.\n\nThe concern about confusing young children is not supported by experience: millions of children around the world grow up with two languages without any problems. The shortage of teachers is a real issue, but it is a reason to train more teachers rather than to delay learning.\n\nIn conclusion, although secondary school students can learn efficiently, I am convinced that children gain more from starting a foreign language at primary school, provided that they are taught well.",
  },
  {
    task: `In many cities, traffic congestion is becoming a serious problem. What are the causes of this problem, and what measures could be taken to solve it? ${task2}`,
    model:
      "Traffic jams have become part of daily life in many cities, wasting time and polluting the air. This essay will examine the main causes of congestion and suggest some measures that could reduce it.\n\nThe most obvious cause is the growing number of private cars. As incomes rise, more families can afford a car, and many people see driving as more comfortable and convenient than public transport. A second cause is the way cities have developed. When homes are built far from offices, schools and shops, people have to travel long distances every day, often at the same times. Finally, public transport in many cities is slow, crowded or unreliable, so it does not offer a real alternative to driving.\n\nSeveral measures could ease the problem. Firstly, governments should invest in fast and frequent public transport, such as metro lines and buses with their own lanes. When the bus is quicker than the car, people choose it. Secondly, cities could charge drivers for entering the centre at busy times. London, for instance, introduced such a charge, and traffic in the centre fell noticeably. The money raised can then be spent on improving buses and trains. Thirdly, in the long term, city planners should create neighbourhoods where people can live, work and shop without long journeys, and should build safe paths for cycling and walking.\n\nIn conclusion, congestion is caused mainly by rising car ownership, spread-out cities and poor public transport. A combination of better public transport, charges for drivers and smarter planning would make our cities easier to move around and more pleasant to live in.",
  },
  {
    task: `Some people believe that university education should be free for all students. To what extent do you agree or disagree? ${task2}`,
    model:
      "In some countries university is free, while in others students pay high fees. I partly agree that university education should be free: it should be free for those who cannot afford it, but not necessarily for everyone.\n\nThere are strong arguments for free university education. Education benefits society as a whole, not only the individual student. Doctors, engineers and teachers trained at university serve the whole community, so it is reasonable for the community to pay for their training. Free education also gives talented young people from poor families the same chances as wealthy students. When fees are high, many capable students decide not to apply because they fear years of debt, and the country loses their talent.\n\nHowever, making university free for everyone has serious disadvantages. Universities are expensive to run, and if the government pays all the costs, it must either raise taxes or spend less on other services such as health care. Moreover, graduates usually earn considerably more than people without a degree, so it seems fair that they should contribute something towards the education that brings them this advantage. Free places for all also mean that wealthy families, who could easily pay, receive help they do not need.\n\nA better system, in my view, would combine free education for students from low-income families with fees for others, paid back only once a graduate earns above a certain salary. This would protect equal opportunity without placing the whole cost on taxpayers.\n\nIn conclusion, while I agree that no one should be prevented from studying by a lack of money, I do not believe that university should be completely free for all students.",
  },
  {
    task: `In some countries, more and more people are choosing to live alone. Is this a positive or a negative development? ${task2}`,
    model:
      "In many countries the number of people living alone has grown rapidly in recent decades. Although this trend brings some real freedoms, I believe that on balance it is a negative development, both for individuals and for society.\n\nIt is true that living alone has advantages. People who live by themselves can organise their homes and their time exactly as they wish, without needing to agree with anyone else. For many young adults, a flat of their own is a sign of independence and a chance to learn to manage their lives. For some older people, too, staying in their own home is preferable to moving in with their children.\n\nHowever, the disadvantages are more serious. The first is loneliness. People who live alone are more likely to spend long periods without talking to anyone, and research has linked loneliness to depression and even to heart disease. This is especially true for elderly people, who may have no one to notice if they fall ill. The second disadvantage concerns resources. A city where many people live alone needs far more homes, and each home needs its own heating, furniture and appliances. This raises housing costs for everyone and increases the use of energy.\n\nThere are ways to keep the benefits while reducing these problems. Some cities are building shared housing, in which residents have private rooms but share kitchens and gardens. Such projects give people independence without isolation.\n\nIn conclusion, although living alone offers freedom, its effects on people's health and on the cost of housing make it, in my opinion, a largely negative trend.",
  },
  {
    task: `Some people say that the main purpose of schools is to prepare students for work. Others think that schools should help students develop as individuals. Discuss both views and give your own opinion. ${task2}`,
    model:
      "There is a long debate about what schools are for. Some people believe that their main job is to prepare young people for employment, while others think they should help each student grow as a person. In my view, these aims are not opposed, but personal development should come first.\n\nThose who emphasise work have a strong point. Most young people will need to earn a living, and employers often complain that school leavers lack basic skills such as writing clearly, working with numbers or using computers. If schools do not teach these skills, their students may struggle to find jobs, and the economy as a whole will suffer.\n\nOn the other hand, life is much more than work. Schools are where children learn to think for themselves, to get on with people who are different from them and to discover what they enjoy, whether it is music, science or sport. These qualities make people better citizens, friends and parents. Furthermore, the jobs that today's students will do in twenty years may not even exist yet, so training them for particular careers is risky.\n\nIn my opinion, the best preparation for work is in fact a broad education. Students who can solve problems, communicate well and keep learning will adapt to whatever jobs appear in the future. A narrow focus on work, by contrast, may produce employees with skills that soon become out of date.\n\nIn conclusion, although schools must give students practical skills, their main purpose should be to develop curious, confident individuals, who will also be the most valuable workers.",
  },
  {
    task: `Many people believe that social media has had a negative effect on young people. To what extent do you agree or disagree? ${task2}`,
    model:
      "Social media has become a central part of young people's lives, and many adults are worried about its effects. While I accept that social media can cause real harm, I do not agree that its overall effect has been negative.\n\nThe concerns are understandable. Some young people spend many hours a day scrolling through their phones, which can reduce their sleep and the time they spend on homework or exercise. Social media can also damage self-esteem: teenagers constantly compare themselves with the perfect images that others post, and some feel that their own lives are not good enough. In the worst cases, young people are bullied online, and the bullying follows them home in a way that playground bullying never did.\n\nNevertheless, social media also brings important benefits. It allows young people to stay in touch with friends and family who live far away, and it helps those who feel isolated, for example because of illness or an unusual interest, to find others like them. It is also a source of information and creativity. Many young people learn skills from online videos, share their own music or art, and take part in campaigns on issues they care about, such as the environment.\n\nThe effects of social media, therefore, depend largely on how it is used. Rather than condemning it, parents and schools should teach young people to use it wisely: to limit their time, to question what they see and to report bullying.\n\nIn conclusion, social media is neither good nor bad in itself. Its risks are real, but I believe that with guidance its advantages for young people outweigh its disadvantages.",
  },
  {
    task: `Some people think that governments should spend money on protecting old buildings, while others believe the money should be spent on new housing and roads. Discuss both views and give your own opinion. ${task2}`,
    model:
      "Governments must constantly decide how to divide limited budgets. Some people argue that historic buildings deserve public money, while others believe that new homes and roads are more urgent. In my view, both are important, but the protection of old buildings should not be sacrificed.\n\nThe case for spending on new infrastructure is strong. In many growing cities, there is a serious shortage of affordable housing, and people spend hours in traffic every day. Building homes and roads improves the daily lives of millions of people and supports the economy by allowing workers to reach their jobs. When families cannot find a place to live, spending money on an old palace may seem hard to justify.\n\nOn the other hand, old buildings have a value that cannot be replaced. They show how earlier generations lived and give each city its own character. Once a historic building has been demolished, it is lost forever, whereas roads and houses can be built at any time. Moreover, historic areas often bring economic benefits of their own: cities such as Rome and Kyoto attract millions of tourists every year mainly because of their old buildings.\n\nIn my opinion, the choice is often a false one. Protecting historic buildings usually costs only a small part of a government's budget, and many old buildings can be adapted for new uses, such as homes, offices or libraries, which helps to meet modern needs at the same time.\n\nIn conclusion, while new housing and roads are clearly necessary, governments should continue to protect old buildings, because the loss of the past cannot be undone.",
  },
  {
    task: `In many countries, people are living longer than ever before. What problems does this cause, and how can they be solved? ${task2}`,
    model:
      "Thanks to better health care and living conditions, people in many countries now live much longer than their grandparents did. While this is a great achievement, it also creates serious challenges. This essay will discuss the main problems and suggest some solutions.\n\nThe first problem is financial. When a larger proportion of the population is retired, there are fewer workers paying taxes to support pensions and public services. In some countries, the number of workers for each pensioner has fallen sharply, and governments are struggling to pay for pensions. The second problem concerns health care. Older people are more likely to suffer from long-term illnesses, so hospitals and care homes face growing demand, and families often have to care for elderly relatives while working full-time.\n\nSeveral measures could reduce these problems. Firstly, the age of retirement could be raised gradually in line with life expectancy. Many people in their sixties are healthy and able to work, and some would welcome the chance to stay active, perhaps part-time. Secondly, governments should invest in preventing illness rather than only treating it, for example by encouraging exercise and healthy eating throughout life, so that people remain independent for longer. Thirdly, communities could support families who care for older relatives, through day centres and flexible working hours.\n\nIn conclusion, longer lives put pressure on pensions, health services and families. However, by allowing people to work longer, keeping the population healthier and supporting carers, societies can turn longer life into an opportunity rather than a burden.",
  },
  {
    task: `Some people think that it is more important to protect the environment than to develop the economy. Others say that economic growth must come first. Discuss both views and give your own opinion. ${task2}`,
    model:
      "Whether a country should put the environment or economic growth first is one of the most important questions of our time. Both sides have serious arguments, but I believe that protecting the environment must take priority, because a healthy economy depends on it.\n\nThose who put growth first argue that it is the only way to reduce poverty. Economic development creates jobs, pays for schools and hospitals and lifts millions of people out of hardship. For a poor country, strict environmental rules can seem like a luxury that slows down progress. Moreover, wealthy countries became rich by burning coal and cutting down forests, so it may seem unfair to ask poorer countries not to do the same.\n\nHowever, the opposite view is more convincing. The economy depends on natural resources: farming needs fertile soil, regular rainfall and insects to pollinate crops, and fishing needs healthy seas. When these are damaged, the economic cost can be enormous. Floods, droughts and storms linked to climate change already destroy homes, factories and harvests every year. Growth that destroys its own foundations cannot last.\n\nFurthermore, the choice between the two is less sharp than it seems. Clean industries, such as solar and wind energy, are now among the fastest-growing sectors of the world economy and create many jobs. Countries that invest in them early may gain an advantage.\n\nIn conclusion, although economic growth is essential for reducing poverty, I believe that protecting the environment must come first, since without a healthy planet no economy can prosper in the long term.",
  },
  {
    task: `Nowadays many people work from home using computers and the internet. Do the advantages of this outweigh the disadvantages? ${task2}`,
    model:
      "Working from home, once rare, has become normal for millions of office workers. In my opinion, the advantages of this change outweigh the disadvantages, as long as employees still spend some time with their colleagues.\n\nThe benefits are considerable. The most obvious one is the time saved on travel. A worker who used to spend an hour and a half commuting every day gains more than seven hours a week, which can be used for rest, exercise or family. Working from home also reduces traffic and pollution, and it saves money on transport and lunches. Furthermore, many people find that they can concentrate better at home, away from the noise and interruptions of an open-plan office. Finally, it allows companies to employ talented people who live far away, and it helps parents and people with disabilities to work.\n\nThere are, however, real drawbacks. Some people feel isolated without the daily contact of an office, and young employees in particular may miss the chance to learn by watching experienced colleagues. It can also be difficult to separate work from private life when the office is in the kitchen, so some people end up working longer hours rather than shorter ones.\n\nThese problems can largely be solved. Many companies now ask staff to come to the office two or three days a week, which keeps the benefits of both systems. Clear rules about working hours can also protect employees' free time.\n\nIn conclusion, although working from home can be lonely and can blur the line between work and life, its savings in time, money and stress make it, overall, a positive development.",
  },
  {
    task: `Some people think that advertising aimed at children should be banned. To what extent do you agree or disagree? ${task2}`,
    model:
      "Children see thousands of advertisements every year, on television, online and even in games. I largely agree that advertising aimed at children should be banned, because children cannot judge it in the way adults can.\n\nThe main argument for a ban is that young children do not understand the purpose of advertising. Research suggests that until the age of about eight, many children believe that adverts simply give information, and they do not realise that they are designed to persuade. This makes them easy targets. Advertisers know this and use cartoon characters, songs and free toys to make children want products, which children then demand from their parents.\n\nMany of these products are also harmful. A large share of the advertising aimed at children promotes sweets, sugary drinks and fast food, and doctors have linked this to the rise in childhood obesity. Other adverts encourage children to spend money inside games, sometimes without their parents' knowledge. A ban would protect children's health and families' budgets.\n\nOpponents argue that a ban would limit freedom of speech and that parents, not governments, should decide what their children see. They also point out that advertising pays for children's television programmes. These are fair points, but parents cannot watch every screen their children use, and programmes can be funded in other ways, for example by public broadcasters.\n\nIn conclusion, although some advertising for children may be harmless, I believe that a ban would do far more good than harm, because children deserve protection from messages they are too young to understand.",
  },
  {
    task: `In many countries, small shops are closing because people prefer to buy from large supermarkets and online. Why is this happening, and is it a positive or negative development? ${task2}`,
    model:
      "In towns around the world, small independent shops are disappearing, while large supermarkets and online companies grow. This essay will explain the reasons for this change and argue that, overall, it is a negative development.\n\nThe main reason is price. Large companies buy goods in enormous quantities, so they can sell them more cheaply than a small shop ever could. Convenience is another factor. A supermarket offers everything in one place and often stays open late, while online shopping allows people to order from home and have goods delivered the next day. For busy families, these advantages are hard to resist.\n\nFor individual customers, this change has clear benefits: lower prices and more choice. However, I believe that the costs for society are greater. Small shops give a neighbourhood its character and bring people together; the owner of a local shop knows his customers, and the shop is a place where neighbours meet. When these shops close, high streets become empty and towns lose their life. In addition, small shops are often owned by local people, so the money spent in them stays in the community, whereas the profits of large companies frequently go elsewhere.\n\nMoreover, the closure of small shops hurts those who cannot easily drive to a supermarket or shop online, such as many elderly people. For them, the local shop was a lifeline.\n\nIn conclusion, small shops are closing because large companies are cheaper and more convenient. Although customers save money, the loss of community, local jobs and services makes this, in my view, a negative development.",
  },
];

/** writingTask1 is IELTS Writing Task 1, judged by a model. */
export const writingTask1: TopicDef = judgedExamTopic({
  id: "ielts-writing-task-1",
  title: t("IELTS Writing Task 1", "雅思写作 Task 1"),
  summary: t(
    "Describe a table of figures in at least 150 words, as in IELTS Academic Writing Task 1: an overview, the main features and comparisons.",
    "按照雅思学术类写作 Task 1 的要求，用至少 150 词描述一个数据表格：概述、主要特征和比较。",
  ),
  prerequisites: ["ielts-describing-data", "writing-a-report"],
  encompasses: [
    { topic: "ielts-describing-data", weight: 0.4 },
    { topic: "writing-a-report", weight: 0.2 },
  ],
  criteria: ["ielts-t1-overview", "ielts-t1-key-features", "ielts-t1-comparisons", "ielts-t1-objective", "ielts-organized"],
  point: {
    id: "task-1",
    title: t("A report on data", "数据报告"),
    explanation: t(
      "Task 1 asks you to report data, not to explain it. Plan four short paragraphs in about 20 minutes:\n\n1. **Introduction**: say what the table shows in your own words (*The table compares ...*). Do not copy the task.\n2. **Overview**: two sentences on the most important features: the biggest, the smallest, the main trend, the main change (*Overall, ...*). Examiners look for this paragraph first.\n3. **Two body paragraphs**: group the figures and compare them, quoting the key numbers accurately: *rose sharply from 17% to 25%; almost twice as many; the highest, at 52%*.\n\nDo not mention every number, and do not give reasons or opinions that the data does not show. No conclusion with new ideas is needed; the overview does that job.",
      "Task 1 要你报告数据，而不是解释数据。用约 20 分钟写四个短段：\n\n1. **引言**：用自己的话说明表格显示了什么（*The table compares ...*），不要照抄题目。\n2. **概述**：用两句话写出最重要的特征：最大、最小、主要趋势、主要变化（*Overall, ...*）。考官首先找的就是这一段。\n3. **两个主体段**：把数字分组比较，准确引用关键数字：*rose sharply from 17% to 25%; almost twice as many; the highest, at 52%*。\n\n不要提到每个数字，也不要给出数据没有显示的原因或观点。不需要写含新内容的结论，概述已经起到这个作用。",
    ),
  },
  question: t(
    "Write a report of at least 150 words in English on the data below, as in IELTS Writing Task 1. You have about 20 minutes.",
    "按照雅思写作 Task 1 的要求，用英语就下面的数据写一篇至少 150 词的报告。时间约 20 分钟。",
  ),
  bank: task1Bank,
  limits: { minWords: 150, maxChars: 2200 },
  xp: 25,
  what: t("report", "报告"),
});

/** writingTask2 is IELTS Writing Task 2, judged by a model. */
export const writingTask2: TopicDef = judgedExamTopic({
  id: "ielts-writing-task-2",
  title: t("IELTS Writing Task 2", "雅思写作 Task 2"),
  summary: t(
    "Write an essay of at least 250 words on a view, a debate or a problem, as in IELTS Writing Task 2.",
    "按照雅思写作 Task 2 的要求，就一个观点、一场争论或一个问题写一篇至少 250 词的议论文。",
  ),
  prerequisites: ["writing-an-opinion-essay"],
  encompasses: [
    { topic: "writing-an-opinion-essay", weight: 0.5 },
    { topic: "introductions-and-conclusions", weight: 0.2 },
  ],
  criteria: ["ielts-t2-all-parts", "ielts-t2-position", "ielts-t2-developed", "ielts-organized"],
  point: {
    id: "task-2",
    title: t("An essay in 40 minutes", "40 分钟的议论文"),
    explanation: t(
      "First decide what kind of question it is, because each asks for something different:\n\n- *To what extent do you agree?* Give your position, and keep it to the end.\n- *Discuss both views and give your own opinion.* One paragraph on each view, and your opinion clearly stated.\n- *What are the causes, and what are the solutions?* or *What problems ...?* Answer **both** questions.\n- *Is this a positive or negative development? Do the advantages outweigh the disadvantages?* Weigh both sides and say which wins.\n\nThen plan four or five paragraphs: an introduction that rephrases the question and states your position; two or three body paragraphs, each with one main idea explained and supported by an example; a conclusion that sums up. Spend about five minutes planning and leave a few minutes to check.",
      "先判断题型，因为每种题型要求不同：\n\n- *To what extent do you agree?* 表明立场，并坚持到最后。\n- *Discuss both views and give your own opinion.* 每种观点各写一段，并清楚写出自己的看法。\n- *What are the causes, and what are the solutions?* 或 *What problems ...?* **两个**问题都要回答。\n- *Is this a positive or negative development? Do the advantages outweigh the disadvantages?* 权衡两方面，并说明哪一方占上风。\n\n然后安排四到五段：引言换一种说法复述题目并表明立场；两到三个主体段，每段一个主要观点，加以解释并举例支持；结论加以概括。用约五分钟构思，留几分钟检查。中国考生常见的问题是只回答了题目的一部分，或者通篇罗列观点而不展开：每个观点都要说明“为什么”和“例如”。",
    ),
  },
  question: t(
    "Write an essay of at least 250 words in English on the question below, as in IELTS Writing Task 2. You have about 40 minutes.",
    "按照雅思写作 Task 2 的要求，用英语就下面的问题写一篇至少 250 词的议论文。时间约 40 分钟。",
  ),
  bank: task2Bank,
  limits: { minWords: 250, maxChars: 3400 },
  xp: 45,
  what: t("essay", "议论文"),
});
