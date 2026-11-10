// College writing: the tasks of revising for clarity and of writing about data, each with a model answer.

import type { WritingItem } from "@ga/subject-english";

/** clarityBank asks for a dense paragraph rewritten with its characters as subjects and its actions as verbs. */
export const clarityBank: readonly WritingItem[] = [
  {
    task: "Revise this paragraph for clarity. Keep all of its meaning, but make the people and groups the subjects of your sentences and their actions the verbs.",
    source:
      "The implementation of the new attendance policy by the school was followed by a reduction in absences. A determination was made by the principal that a review of the policy's effects should be conducted at the end of the year, with the participation of teachers and parents in the evaluation process being considered essential.",
    model:
      "After the school put its new attendance policy into effect, students missed fewer days. The principal decided that the school should review the policy's effects at the end of the year, and that teachers and parents must take part in judging how well it had worked.",
  },
  {
    task: "Revise this paragraph for clarity. Keep all of its meaning, but make the people and groups the subjects of your sentences and their actions the verbs.",
    source:
      "There was a failure on the part of the committee to reach a decision regarding the allocation of funds, due to the existence of disagreement among its members about the prioritization of the library over the sports field. A postponement of the vote until the next meeting was the result.",
    model:
      "The committee could not decide how to spend the money, because its members disagreed about whether the library or the sports field should come first. As a result, they postponed the vote until their next meeting.",
  },
  {
    task: "Revise this paragraph for clarity. Keep all of its meaning, but make the people and groups the subjects of your sentences and their actions the verbs.",
    source:
      "An analysis of the survey data by the researchers revealed the existence of a strong preference among customers for delivery in the evening. The recommendation of the researchers was the extension of delivery hours, although the possibility of increased costs was acknowledged by them.",
    model:
      "When the researchers analyzed the survey, they found that customers strongly preferred evening deliveries. They recommended that the company extend its delivery hours, although they acknowledged that doing so might cost more.",
  },
  {
    task: "Revise this paragraph for clarity. Keep all of its meaning, but make the people and groups the subjects of your sentences and their actions the verbs.",
    source:
      "The occurrence of the flood resulted in the displacement of over two hundred families. The provision of emergency shelter was undertaken by the city, and an appeal for donations was issued by local charities, the response to which was considered by organizers to be exceptional.",
    model:
      "The flood drove more than two hundred families from their homes. The city provided emergency shelter, and local charities appealed for donations; the organizers said the public responded exceptionally well.",
  },
  {
    task: "Revise this paragraph for clarity. Keep all of its meaning, but make the people and groups the subjects of your sentences and their actions the verbs.",
    source:
      "The decision of the board to proceed with the merger was made despite the expression of strong opposition by a number of employees. Concerns about job losses were the primary motivation for this opposition, and the provision of assurances by management had little effect on its reduction.",
    model:
      "The board decided to go ahead with the merger, even though many employees strongly opposed it. They opposed it mainly because they feared losing their jobs, and management's reassurances did little to change their minds.",
  },
  {
    task: "Revise this paragraph for clarity. Keep all of its meaning, but make the people and groups the subjects of your sentences and their actions the verbs.",
    source:
      "Improvement in students' writing was observed by teachers following the introduction of weekly peer review. It is believed by the teachers that the process of giving feedback to others led to an increase in students' awareness of problems in their own drafts.",
    model:
      "After the school introduced weekly peer review, teachers noticed that students wrote better. The teachers believe that when students commented on one another's work, they became more aware of the problems in their own drafts.",
  },
  {
    task: "Revise this paragraph for clarity. Keep all of its meaning, but make the people and groups the subjects of your sentences and their actions the verbs.",
    source:
      "The expansion of the bus network was the subject of a proposal by the transport department, with the justification being the anticipated growth of the city's population. However, the approval of the proposal by the council is dependent on the identification of a source of funding.",
    model:
      "The transport department proposed expanding the bus network, because it expects the city's population to grow. The council, however, will approve the proposal only if someone finds a way to pay for it.",
  },
  {
    task: "Revise this paragraph for clarity. Keep all of its meaning, but make the people and groups the subjects of your sentences and their actions the verbs.",
    source:
      "Among patients, there was a reported reduction in pain following the administration of the new treatment. Nevertheless, the conclusion of the doctors was that further testing would be necessary prior to its recommendation for general use, because of the small size of the trial.",
    model:
      "Patients said they felt less pain after they received the new treatment. Nevertheless, the doctors concluded that they must test it further before recommending it for general use, because the trial was small.",
  },
  {
    task: "Revise this paragraph for clarity. Keep all of its meaning, but make the people and groups the subjects of your sentences and their actions the verbs.",
    source:
      "A misunderstanding of the instructions by several applicants led to the submission of incomplete forms. A revision of the instructions was carried out by the office, and the issuing of an extension of the deadline to all affected applicants was also decided upon.",
    model:
      "Several applicants misunderstood the instructions and submitted incomplete forms. The office revised the instructions and decided to give every affected applicant more time.",
  },
  {
    task: "Revise this paragraph for clarity. Keep all of its meaning, but make the people and groups the subjects of your sentences and their actions the verbs.",
    source:
      "The discovery of the error in the calculations was made by a student during the review of the published paper. A correction was subsequently issued by the authors, and an expression of gratitude to the student for the identification of the mistake was included in it.",
    model:
      "While reviewing the published paper, a student discovered an error in its calculations. The authors then issued a correction, in which they thanked the student for finding the mistake.",
  },
  {
    task: "Revise this paragraph for clarity. Keep all of its meaning, but make the people and groups the subjects of your sentences and their actions the verbs.",
    source:
      "Reliance on volunteers for the staffing of the festival was a necessity for the organizers, owing to the limitations of the budget. The recruitment of volunteers was conducted through social media, and the success of this approach exceeded the expectations of the organizers.",
    model:
      "Because the organizers had a limited budget, they had to rely on volunteers to staff the festival. They recruited volunteers through social media, and the approach worked better than they had expected.",
  },
  {
    task: "Revise this paragraph for clarity. Keep all of its meaning, but make the people and groups the subjects of your sentences and their actions the verbs.",
    source:
      "The closure of the factory had a serious impact on the town, with the loss of employment affecting nearly a third of households. Attempts at the attraction of new businesses have been made by the town council, but the achievement of significant results has not yet occurred.",
    model:
      "When the factory closed, it hurt the town badly: in nearly a third of households, someone lost a job. The town council has tried to attract new businesses, but it has not yet achieved much.",
  },
];

/** dataBank asks for a paragraph that reports a table or chart accurately and draws only the conclusion it supports. */
export const dataBank: readonly WritingItem[] = [
  {
    task: "Write a paragraph that reports what this table shows. Give the main pattern with exact figures, point out one exception or detail, and draw only the conclusion the data support.",
    source:
      "Average hours of sleep on school nights, by grade, in a survey of 2,400 students: grade 9, 7.6 hours; grade 10, 7.2; grade 11, 6.9; grade 12, 6.8. In every grade, students who started school after 8:30 slept about 40 minutes more than those who started before 8:00.",
    model:
      "The survey of 2,400 students shows that sleep on school nights declines through high school, from 7.6 hours in grade 9 to 6.8 hours in grade 12. The fall is steepest early: students lose 0.4 hours between grades 9 and 10, but only 0.1 hours between grades 11 and 12. In every grade, those whose school started after 8:30 slept about 40 minutes more than those who started before 8:00. The data show that later starts go with more sleep at every age, but because the survey compares different schools rather than one school before and after a change, it cannot show that the later start itself caused the difference.",
  },
  {
    task: "Write a paragraph that reports what this table shows. Give the main pattern with exact figures, point out one exception or detail, and draw only the conclusion the data support.",
    source:
      "Share of trips to work by bicycle in five cities, 2010 and 2020: City A, 2% and 6%; City B, 4% and 9%; City C, 3% and 3%; City D, 1% and 5%; City E, 5% and 11%. Cities A, B, D and E built protected bike lanes between 2012 and 2018; City C did not.",
    model:
      "Between 2010 and 2020, the share of trips to work made by bicycle rose in four of the five cities. City E saw the largest rise, from 5% to 11%, followed by City B, from 4% to 9%, while Cities A and D each gained four percentage points. City C was the exception: its share stayed at 3%. City C was also the only city that did not build protected bike lanes during the period. The data therefore show that cycling grew where lanes were built and stalled where they were not, which is consistent with the lanes encouraging cycling; however, five cities are too few to rule out other differences between them.",
  },
  {
    task: "Write a paragraph that reports what this chart shows. Give the main pattern with exact figures, point out one exception or detail, and draw only the conclusion the data support.",
    source:
      "A line chart of the median price of a home in a city, 2015 to 2023: 2015, 210,000; 2017, 240,000; 2019, 275,000; 2020, 270,000; 2021, 310,000; 2023, 345,000. Over the same years, the median household income rose from 52,000 to 61,000.",
    model:
      "The median price of a home in the city rose by about 64%, from 210,000 in 2015 to 345,000 in 2023. Prices climbed steadily except in 2020, when they dipped slightly from 275,000 to 270,000, before rising sharply to 310,000 the following year. Over the same period, median household income rose much more slowly, by about 17%, from 52,000 to 61,000. The data show that homes became much less affordable: in 2015, the median home cost about four times the median income, and by 2023, it cost more than five and a half times. They do not, however, explain why prices rose.",
  },
  {
    task: "Write a paragraph that reports what this table shows. Give the main pattern with exact figures, point out one exception or detail, and draw only the conclusion the data support.",
    source:
      "Average daily screen time outside school, in hours, by age, from a national survey: age 8, 2.1; age 10, 3.0; age 12, 4.4; age 14, 5.6; age 16, 5.9. Share of that time spent on social media: age 8, 5%; age 12, 30%; age 16, 55%.",
    model:
      "According to the national survey, children's screen time outside school nearly triples between the ages of 8 and 16, from 2.1 to 5.9 hours a day. The largest increases come between ages 10 and 14, when daily use rises by 2.6 hours; after 14, it grows by only 0.3 hours. The way that time is spent also changes: social media accounts for 5% of screen time at age 8 but 55% at age 16. The data show that screen time rises fastest in early adolescence and that social media takes a growing share of it. They say nothing, however, about whether this time is harmful, since the survey measured only how long children used screens.",
  },
  {
    task: "Write a paragraph that reports what this table shows. Give the main pattern with exact figures, point out one exception or detail, and draw only the conclusion the data support.",
    source:
      "Average math test scores (out of 100) in four schools, before and after a tutoring program: School A, 61 and 68; School B, 58 and 66; School C, 70 and 71; School D, 55 and 64. Schools A, B and D offered tutoring twice a week; School C offered it once a month.",
    model:
      "After the tutoring program, average math scores rose in all four schools, but by very different amounts. School D gained the most, nine points, from 55 to 64, followed by School B with eight and School A with seven. School C rose by only one point, from 70 to 71. School C was also the only school that offered tutoring once a month rather than twice a week, and it began with the highest scores, leaving less room to improve. The data suggest that frequent tutoring was followed by larger gains, but with no school that went without tutoring, they cannot show how much of the rise the program caused.",
  },
  {
    task: "Write a paragraph that reports what this chart shows. Give the main pattern with exact figures, point out one exception or detail, and draw only the conclusion the data support.",
    source:
      "A bar chart of the number of days each year on which air pollution in a city exceeded the safe limit: 2016, 48; 2017, 44; 2018, 39; 2019, 31; 2020, 18; 2021, 27; 2022, 24. A low-emission zone for vehicles came into force in 2018.",
    model:
      "The number of days on which the city's air pollution exceeded the safe limit fell by half between 2016 and 2022, from 48 to 24. The decline was steady before and after the low-emission zone came into force in 2018, with the sharpest drop in 2020, when only 18 days exceeded the limit. In 2021, however, the number rose again to 27. The unusually low figure for 2020 may reflect a year of reduced travel rather than lasting change. Overall, the chart shows a clear improvement, but because pollution was already falling before 2018, it cannot show how much of the improvement the zone itself produced.",
  },
  {
    task: "Write a paragraph that reports what this table shows. Give the main pattern with exact figures, point out one exception or detail, and draw only the conclusion the data support.",
    source:
      "Life expectancy at birth, in years, in three regions of a country: 1990, North 71, Center 74, South 69; 2020, North 77, Center 80, South 73. Spending on health per person rose in all three regions, most in the North.",
    model:
      "Life expectancy at birth rose in all three regions between 1990 and 2020. The North and the Center each gained six years, reaching 77 and 80, while the South gained only four, rising from 69 to 73. As a result, the gap between the South and the Center widened from five to seven years. Spending on health per person also rose everywhere, most in the North. The data show that people in every region are living longer but that the South is falling further behind; they do not show whether higher spending caused the gains, since other conditions changed over the same thirty years.",
  },
  {
    task: "Write a paragraph that reports what this information shows. Give the main pattern with exact figures, point out one important detail, and draw only the conclusion the data support.",
    source:
      'A study of 10,000 adults found that a common medicine raised the risk of a rare stomach illness from 2 in 10,000 to 4 in 10,000 people per year. A news headline reported: "Medicine doubles the risk of stomach illness."',
    model:
      "The study of 10,000 adults found that people taking the medicine were twice as likely to develop a rare stomach illness: 4 in 10,000 each year, compared with 2 in 10,000 among those not taking it. The headline is accurate in saying that the risk doubled, but it leaves out how small the risk is. The increase amounts to two extra cases for every 10,000 people a year, or 0.02 percentage points. The data support the conclusion that the medicine raises the risk of the illness, but not the alarm the headline suggests; whether the medicine is worth taking depends on how much it helps the people who use it.",
  },
  {
    task: "Write a paragraph that reports what this table shows. Give the main pattern with exact figures, point out one exception or detail, and draw only the conclusion the data support.",
    source:
      "Median hourly pay of full-time workers in a country, 2022, by age: 18 to 29, women 15.20 and men 15.60; 30 to 39, women 19.80 and men 21.90; 40 to 49, women 21.00 and men 24.50; 50 to 59, women 20.40 and men 24.80.",
    model:
      "Among full-time workers, men earn more per hour than women at every age, but the gap is small for the young and widens with age. Between 18 and 29, women's median pay is 15.20 and men's 15.60, a difference of 40 cents. By ages 40 to 49, the gap has grown to 3.50, and between 50 and 59 it reaches 4.40, as women's pay slightly falls while men's continues to rise. The data show that the gender pay gap grows over a working life. Because they compare only medians by age, they cannot show the reasons, such as differences in jobs, hours or career breaks, or discrimination.",
  },
  {
    task: "Write a paragraph that reports what this table shows. Give the main pattern with exact figures, point out one exception or detail, and draw only the conclusion the data support.",
    source:
      "A basketball player's shooting record over four seasons: season 1, 120 of 300 shots (40%); season 2, 150 of 340 (44%); season 3, 45 of 90 (50%); season 4, 160 of 350 (46%). The player was injured for most of season 3.",
    model:
      "Over four seasons, the player's shooting improved from 40% in season 1 to 46% in season 4. The highest rate, 50%, came in season 3, but the player was injured for most of that season and took only 90 shots, compared with 300 to 350 in the others. That figure rests on too few shots to be compared fairly with the rest. Leaving season 3 aside, the record shows steady improvement: 40%, then 44%, then 46%. The data support the conclusion that the player became a more accurate shooter, but not that season 3 was the best season.",
  },
  {
    task: "Write a paragraph that reports what this chart shows. Give the main pattern with exact figures, point out one exception or detail, and draw only the conclusion the data support.",
    source:
      "A poll of 1,500 likely voters one week before a city election, with a margin of error of 3 points: Candidate Reyes 44%, Candidate Liu 41%, Candidate Novak 9%, undecided 6%. A poll a month earlier showed Reyes at 46% and Liu at 37%.",
    model:
      "One week before the election, the poll of 1,500 likely voters shows Candidate Reyes at 44% and Candidate Liu at 41%, with Novak far behind at 9% and 6% undecided. Reyes's lead of three points is within the poll's margin of error of three points, so the race is effectively too close to call. The trend favors Liu: a month earlier, Reyes led by nine points, 46% to 37%. The data show that the race has tightened sharply, but they do not show who will win, especially since the undecided voters alone could decide the result.",
  },
  {
    task: "Write a paragraph that reports what this table shows. Give the main pattern with exact figures, point out one exception or detail, and draw only the conclusion the data support.",
    source:
      "Reported burglaries in two towns, 2018 and 2022: Town A, 400 and 320; Town B, 90 and 81. Population: Town A, 80,000 in both years; Town B, 15,000 in 2018 and 18,000 in 2022.",
    model:
      "Reported burglaries fell in both towns between 2018 and 2022. In Town A, the number dropped from 400 to 320, a fall of 20%, while its population stayed at 80,000, so the rate fell from 5 to 4 burglaries per 1,000 people. In Town B, the number fell only from 90 to 81, but its population grew from 15,000 to 18,000, so its rate fell more steeply, from 6 to 4.5 per 1,000. Comparing raw numbers would suggest that Town B is far safer, but per person, the two towns now have similar rates. The data show fewer reported burglaries in both towns, though reports may not capture every crime.",
  },
];
