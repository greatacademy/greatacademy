// College writing: the reading unit of the sixth theme, numbers in arguments: eight original articles, each built
// around a table or figure described in words. The places, polls and figures are invented.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grades-6-8/reading-kit.ts";

const statistics = { topic: "words-of-statistics", weight: 0.3 } as const;
const charts = { topic: "reading-charts-and-statistics", weight: 0.3 } as const;
const numbers = { topic: "numbers-in-writing", weight: 0.1 } as const;

/** academic gives the edge to a batch of the shared academic words, which a passage uses as it goes. */
const academic = (n: 1 | 2 | 3) => ({ topic: `academic-words-${n}`, weight: 0.1 }) as const;

/** numbersInTheNews is a reading unit of the college writing course on figures in public argument. */
export const numbersInTheNews: ReadingUnitDef = {
  id: "numbers-in-the-news",
  title: t("Numbers in the News", "新闻中的数字"),
  passages: [
    passage(
      "a-poll-before-an-election",
      t("A Poll Before an Election", "选举前的民调"),
      `Three weeks before the election for mayor of Port Avery, a local newspaper published a poll under the headline "Lin Pulls Ahead". The poll, which surveyed 600 likely voters, found that 46 percent supported Grace Lin and 43 percent supported her opponent, Mark Dale, with the rest undecided. The article described Lin as the clear favorite.

A table printed beside the article told a more complicated story. Beneath the figures, in small type, it stated that the margin of error was plus or minus 4 percentage points. This number is easy to ignore, and the article ignored it. It means that if the poll were repeated many times with different samples of 600 voters, most results would fall within 4 points of the true figure. Lin's real support could plausibly be anywhere from 42 to 50 percent, and Dale's anywhere from 39 to 47. The ranges overlap. The poll, in other words, could not say with any confidence who was ahead.

Why does a poll of 600 people have such a margin? A poll works by measuring a small group and using it to estimate a much larger one. If the sample is chosen at random, it will usually resemble the whole population, but not exactly; by chance, it may include slightly more supporters of one candidate than the population does. The larger the sample, the smaller this chance error. A sample of 600 gives a margin of about 4 points; a sample of 2,400 gives about 2. Notice that quadrupling the sample only halves the margin, which is why most polls stop at a size that is affordable rather than perfect.

The margin of error, however, describes only one kind of error: the chance variation that comes from sampling. It says nothing about other problems, which are often larger. If the people who answer polls differ from those who refuse, the sample will be biased no matter how large it is. If the question is worded in a way that favors one answer, the results will lean accordingly. And if the poll asks about "likely voters", the result depends on how the pollster decided who was likely to vote, a judgment that can be badly wrong. A poll with a margin of 4 points may in practice be off by more.

A further point concerns change over time. A week after the first poll, a second poll by the same company found Lin at 44 percent and Dale at 45. A radio station reported that Dale had "surged into the lead". But a shift of 2 or 3 points in each candidate's figure is well within the margin of error of both polls. The two results are consistent with no change at all. A real trend can be detected only when many polls, ideally from different companies, move in the same direction over several weeks.

How, then, should a careful reader treat a single poll? First, find the margin of error and apply it to the gap between candidates, not just to each figure. Second, ask who was surveyed, how and when. Third, compare the poll with others, and look at the average of several rather than at any one. An average of polls is not perfect, but its errors tend to cancel.

The election itself was won by Dale, 51 percent to 49. The newspaper's headline had not been a lie; Lin may well have been ahead on the days of its poll. But a margin of error is not small print. It is part of the result, and a report that leaves it out reports something the data do not show.`,
      [statistics, charts, numbers, academic(1), academic(3)],
      [
        ask(
          t("What does a margin of error of 4 points mean for Lin's 46 percent?", "4个百分点的误差范围对林的46%意味着什么？"),
          t("Her real support could plausibly be anywhere from 42 to 50 percent", "她的真实支持率可能在42%到50%之间的任何位置"),
          [
            t("Exactly 4 percent of voters lied to the pollster", "恰好有4%的选民对民调人员撒了谎"),
            t("She was certain to win by at least 4 points", "她肯定会以至少4个百分点的优势获胜"),
            t("The poll surveyed 4 percent of all voters", "民调调查了全体选民的4%"),
          ],
          t(
            "The passage explains that most repeated samples would fall within 4 points of the true figure, so Lin's support could be from 42 to 50 percent.",
            "文章解释说，大多数重复抽样的结果会落在真实数字上下4个百分点内，所以林的支持率可能在42%到50%之间。",
          ),
        ),
        ask(
          t("Why was the radio station wrong to say that Dale had surged into the lead?", "为什么电台说戴尔“一跃领先”是错的？"),
          t("The change between the two polls was within the margin of error", "两次民调之间的变化在误差范围之内"),
          [
            t("The second poll was taken by a different company", "第二次民调是另一家公司做的"),
            t("Dale's support had actually fallen", "戴尔的支持率实际上下降了"),
            t("The second poll had no margin of error", "第二次民调没有误差范围"),
          ],
          t(
            "The passage says a shift of 2 or 3 points is well within the margin of error of both polls, so the results are consistent with no change at all.",
            "文章说两三个百分点的变化完全在两次民调的误差范围内，所以结果与“没有变化”是一致的。",
          ),
        ),
        ask(
          t("What does the margin of error not account for?", "误差范围没有考虑到什么？"),
          t(
            "Bias from who answers, how questions are worded, or who counts as a likely voter",
            "由回答者构成、问题措辞或“可能投票者”的界定带来的偏差",
          ),
          [
            t("Chance variation that comes from sampling", "抽样带来的随机变化"),
            t("The size of the sample", "样本的大小"),
            t("The difference between 600 and 2,400 people", "600人与2400人之间的差别"),
          ],
          t(
            "The fourth paragraph says the margin describes only chance error from sampling and says nothing about these other, often larger, problems.",
            "第四段说，误差范围只描述抽样产生的随机误差，对其他往往更大的问题却无从说明。",
          ),
        ),
      ],
      ["Port", "Avery", "Lin", "Lin's", "Grace", "Mark", "Dale", "Dale's", "pollster"],
    ),
    passage(
      "crime-rates-and-what-they-count",
      t("Crime Rates and What They Count", "犯罪率统计的是什么"),
      `"Burglaries Up 30 Percent", announced a headline in the city of Halden last spring. The figure came from police records, which showed 1,040 burglaries reported in the year, against 800 the year before. Residents were alarmed, and candidates for the city council promised more police.

A chart published with the story showed reported burglaries over ten years. For most of the decade, the line declined steadily, from about 1,500 to about 800, before rising sharply in the final year. Seen in that context, the latest figure was still lower than in any year before the sixth. A rise of 30 percent from a low point is real, but it is not the same as a return to the levels of a decade earlier, and the headline did not say which it was.

A more important question is what the figures count. Police records count crimes that are reported to the police, and not every crime is. People report burglaries when they expect it to be worth doing: when they need a police report for an insurance claim, for instance, or when they believe the police will act. If something changes the probability that a crime is reported, the number of reported crimes can change even if the number of crimes does not.

In Halden, something had changed. In the previous year, the city had introduced an online system for reporting minor crimes, replacing a process that required a visit to a police station. The system made reporting much easier. Police officials, asked about the rise, said that a significant proportion of the new reports involved small thefts from garages and sheds, exactly the kind of crime that people had previously not bothered to report.

There is a second source of evidence about crime: surveys that ask a random sample of residents whether they have been victims, whether or not they told the police. Halden conducted such a survey every two years. Its most recent results, published in the same month as the headline, showed that the proportion of households experiencing a burglary had been roughly stable for four years. A table in the survey report put the figure at 2.1 percent of households in both of the last two surveys, a difference too small to be distinguished from chance.

Taken together, the two sources suggest a different story from the headline. The number of burglaries probably did not rise much; the number reported to the police did, because reporting had become easier. This is not a certainty. The survey has its own margin of error, and the police records may also reflect a real increase in some neighborhoods. But a reader who saw only the headline would have no idea that the question was even open.

Statisticians sometimes summarize this problem with a simple rule: before interpreting a change in a number, ask whether the way the number is collected has changed. Crime statistics are especially prone to this problem, because they depend on the behavior of victims, the priorities of the police and the rules for recording crimes, all of which shift over time. Changes in the definition of a crime, in the number of officers, or in how cases are classified can all move the figures.

None of this means that crime figures are useless. It means that they measure something narrower than they appear to. A rise in reported crime is a fact about reports. Whether it is also a fact about crime is a question that requires other evidence, and a careful writer says so.`,
      [statistics, charts, numbers, academic(1), academic(2), academic(3)],
      [
        ask(
          t("What did the ten-year chart show about the latest figure?", "十年图表显示了最新数字的什么情况？"),
          t("It was a rise from a low point, still lower than in most earlier years", "它是从低点回升，仍然低于前几年的大多数年份"),
          [
            t("It was the highest figure in ten years", "它是十年来的最高值"),
            t("It continued a steady rise over the decade", "它延续了十年来的稳定上升"),
            t("It was exactly the same as ten years earlier", "它与十年前完全相同"),
          ],
          t(
            "The chart showed a decline from about 1,500 to about 800 before the final rise; the latest figure was lower than in any year before the sixth.",
            "图表显示数字从约1500降到约800，最后一年才上升；最新数字仍低于第六年之前的任何一年。",
          ),
        ),
        ask(
          t("Why might reported burglaries rise even if burglaries did not?", "为什么即使入室盗窃没有增加，报案数也可能上升？"),
          t("A new online system made reporting minor crimes much easier", "新的网上报案系统让报告轻微案件容易多了"),
          [
            t("The police invented burglaries to get more money", "警察为了多拿经费编造了盗窃案"),
            t("Residents moved away from the city", "居民搬离了这座城市"),
            t("The survey asked the wrong households", "调查问错了住户"),
          ],
          t(
            "The passage says the city introduced an online system that made reporting easier, and many new reports were small thefts people had previously not reported.",
            "文章说该市推出了让报案更容易的网上系统，许多新报案都是人们以前不会去报的小偷窃。",
          ),
        ),
        ask(
          t(
            "What rule do statisticians suggest before interpreting a change in a number?",
            "统计学家建议在解读数字变化之前先遵循什么规则？",
          ),
          t("Ask whether the way the number is collected has changed", "先问一问这个数字的收集方式是否改变了"),
          [
            t("Always trust police records over surveys", "总是相信警方记录而不是调查"),
            t("Ignore any change smaller than 50 percent", "忽略任何小于50%的变化"),
            t("Compare it only with the previous year", "只与前一年比较"),
          ],
          t(
            "The passage states the rule: before interpreting a change in a number, ask whether the way the number is collected has changed.",
            "文章说明了这条规则：在解读数字变化之前，先问数字的收集方式是否发生了变化。",
          ),
        ),
      ],
      ["Halden"],
    ),
    passage(
      "the-price-of-a-home",
      t("The Price of a Home", "住房的价格"),
      `A property website in the city of Brannock recently reported that "the average home now costs 610,000", a figure that, it said, had risen by 12 percent in a year. A government agency, publishing figures for the same city in the same month, put the typical price at 420,000, up 4 percent. Both organizations were measuring the same houses in the same city. How could they disagree so widely?

Part of the answer lies in the word "average". In everyday speech it is used loosely, but in statistics there are several kinds. The mean is what most people think of: add up all the prices and divide by the number of sales. The median is the middle value: if all the sales were lined up from cheapest to most expensive, the median is the one in the middle, with half the sales below it and half above.

For house prices, the difference matters. The distribution of prices is not symmetrical. Most homes sell within a fairly narrow range, but a small number of very expensive ones sell for many times the typical price. In Brannock, a handful of large houses by the river sold during the year for more than five million each. These outliers pull the mean upward, because every price counts in the sum, but they hardly affect the median, which depends only on which sale is in the middle. A table in the agency's report showed this clearly: a mean of 598,000 and a median of 420,000 for the same set of sales.

The website had reported the mean, which was higher; the agency had reported the median. Neither was wrong, but the median gave a better picture of what a typical buyer paid, which is usually what readers want to know. When a distribution has a long tail of very high values, as incomes and house prices do, the median is generally the more informative figure.

The second part of the answer lies in what was counted. The website's figure was based on the prices at which homes were listed for sale on its own pages, which tend to be more expensive homes and which are asking prices rather than final prices. The agency's figure was based on records of completed sales across the whole city. The website's sample was therefore not representative of all sales, and its figures reflected what sellers hoped to get rather than what buyers paid.

The third part concerns the rise. A change in an average can reflect a change in prices, or a change in which homes are sold. If, in a given year, more large houses happen to be sold than usual, the average price will rise even if the price of every individual house stays the same. Careful agencies correct for this by comparing the prices of similar homes over time, or by following the same homes through repeated sales. The agency's 4 percent figure was calculated in this way; the website's 12 percent was simply the difference between this year's average and last year's.

For a reader, the lesson is to ask three questions of any average. Which kind is it, mean or median? What was counted: listings or sales, one website or the whole market? And does a change reflect a change in prices, or a change in what was sold? The answers will not always be printed with the figure. But a figure without them is closer to an advertisement than to a measurement.`,
      [statistics, charts, numbers, academic(1)],
      [
        ask(
          t("Why was the mean much higher than the median for Brannock's house prices?", "为什么布兰诺克房价的平均数比中位数高得多？"),
          t(
            "A few very expensive houses pulled the mean up but hardly affected the median",
            "少数非常昂贵的房子拉高了平均数，却几乎不影响中位数",
          ),
          [
            t("The median includes only the most expensive houses", "中位数只包括最贵的房子"),
            t("The agency made an error in its calculations", "政府机构的计算出了错"),
            t("Most houses sold for more than five million", "大多数房子卖到了五百万以上"),
          ],
          t(
            "The third paragraph explains that outliers pull the mean upward because every price counts in the sum, while the median depends only on the middle sale.",
            "第三段解释说，离群值会拉高平均数，因为每个价格都计入总和，而中位数只取决于居中的那笔交易。",
          ),
        ),
        ask(
          t("Why was the website's sample not representative?", "为什么网站的样本不具代表性？"),
          t(
            "It used asking prices of homes on its own pages, which tend to be more expensive",
            "它用的是自己网页上挂牌房屋的要价，而这些房屋往往更贵",
          ),
          [
            t("It counted every completed sale in the city", "它统计了城里每一笔成交"),
            t("It used the median instead of the mean", "它用了中位数而不是平均数"),
            t("It included only homes sold by the government", "它只包括政府出售的房屋"),
          ],
          t(
            "The fifth paragraph says the figure was based on listings on its own pages, more expensive homes and asking prices rather than final prices.",
            "第五段说，该数字基于网站自己的挂牌房源，房屋偏贵，而且是要价而非成交价。",
          ),
        ),
        ask(
          t(
            "How could an average price rise even if no individual house became more expensive?",
            "为什么即使没有一套房子涨价，平均房价也可能上升？",
          ),
          t("More large houses might happen to be sold that year", "那一年碰巧卖出了更多的大房子"),
          [
            t("The median always rises faster than the mean", "中位数总是比平均数涨得快"),
            t("Sellers always ask for less than they receive", "卖家要价总是低于成交价"),
            t("Agencies add a fixed amount every year", "机构每年都加上一个固定数额"),
          ],
          t(
            "The passage says a change in an average can reflect a change in which homes are sold, not only a change in prices.",
            "文章说，平均数的变化可能反映的是卖出了哪些房子，而不仅仅是价格的变化。",
          ),
        ),
      ],
      ["Brannock", "agency's"],
    ),
    passage(
      "screen-time-and-sleep",
      t("Screen Time and Sleep", "屏幕时间与睡眠"),
      `A widely shared report last year carried a striking chart. It plotted the number of hours teenagers spent on screens each day against the number of hours they slept, for a sample of about 5,000 students aged thirteen to seventeen. The points sloped downward: students who used screens more tended to sleep less. The report's summary concluded that "screens are stealing our children's sleep" and recommended that schools ban phones.

The chart was accurate. The conclusion, however, went further than the chart could. What the data showed was a correlation: two quantities that tend to move together. A correlation is consistent with several different explanations, and the chart alone cannot distinguish among them.

The first explanation is the one the report preferred: using screens causes students to sleep less, perhaps because they stay up late watching videos, or because light from screens delays sleep. This is plausible, and some experiments support it. The second explanation reverses the direction: students who sleep poorly, for any reason, may spend their sleepless hours on their phones. Then poor sleep would cause screen use, not the other way around. The third explanation is that some other factor causes both. Students under stress, for example, might both sleep less and spend more time on screens, without either causing the other. Older students, who have more homework and later schedules, might also do both.

The report's own table, printed at the end, offered a clue. When the data were divided by age, the slope of the line became much flatter within each age group. A large part of the overall correlation, in other words, came from the fact that older students both used screens more and slept less. Age explained much of what had looked like an effect of screens.

A second issue concerned the size of the relationship. The report stated that the correlation was "statistically significant". In statistics, this phrase has a narrow meaning: the relationship is unlikely to have arisen by chance in a sample of this size. It does not mean that the relationship is large or important. With 5,000 students, even a tiny relationship can be significant in this technical sense. In this case, according to the report's own figures, each additional hour of screen time was associated with about six fewer minutes of sleep, after taking age into account. That is not nothing, but it is far from the dramatic effect the headline implied.

A third issue concerned how screen time and sleep were measured. Both were reported by the students themselves, in answer to questions such as "How many hours do you usually spend on screens on a school day?" Most people estimate such figures poorly. If students who underestimate their sleep also tend to overestimate their screen time, the measurement itself could create part of the correlation.

None of this proves that screens do not affect sleep. Experiments in which people are randomly asked to avoid screens before bed suggest a modest effect, and it is sensible advice to put phones away at night. But the chart in the report could not, on its own, show what it was said to show. A reader faced with such a chart should ask three questions: could the direction of cause be reversed, could a third factor explain both, and how large is the relationship once those possibilities are considered?`,
      [statistics, charts, numbers, academic(1), academic(2), academic(3)],
      [
        ask(
          t("What did the chart in the report actually show?", "报告中的图表实际上显示了什么？"),
          t("A correlation: students who used screens more tended to sleep less", "一种相关关系：用屏幕时间较多的学生往往睡得较少"),
          [
            t("That screens cause students to sleep less", "屏幕导致学生睡得少"),
            t("That schools which ban phones have better results", "禁用手机的学校成绩更好"),
            t("That older students sleep more than younger ones", "年龄大的学生比年龄小的睡得多"),
          ],
          t(
            "The second paragraph says what the data showed was a correlation, consistent with several explanations, which the chart alone cannot distinguish.",
            "第二段说，数据显示的是相关关系，它与多种解释都相符，仅凭图表无法区分。",
          ),
        ),
        ask(
          t("What did dividing the data by age reveal?", "按年龄划分数据后发现了什么？"),
          t(
            "Much of the correlation came from older students both using screens more and sleeping less",
            "相关关系很大一部分来自年龄较大的学生既用屏幕多又睡得少",
          ),
          [
            t("The correlation became much stronger in each age group", "每个年龄组内的相关性都强了很多"),
            t("Younger students used screens the most", "年龄最小的学生用屏幕最多"),
            t("Age had no connection to sleep at all", "年龄与睡眠毫无关系"),
          ],
          t(
            "The slope became much flatter within each age group, so age explained much of what had looked like an effect of screens.",
            "在每个年龄组内，斜率都平缓了许多，所以看起来像是屏幕影响的东西，很大程度上可以用年龄来解释。",
          ),
        ),
        ask(
          t('What does "statistically significant" mean in this passage?', "在本文中，“统计上显著”是什么意思？"),
          t("The relationship is unlikely to have arisen by chance, not that it is large", "这种关系不太可能是偶然产生的，并不是说它很大"),
          [
            t("The relationship is large and important", "这种关系很大而且重要"),
            t("Screens cause at least an hour less sleep", "屏幕至少导致少睡一个小时"),
            t("The students measured their sleep exactly", "学生们准确测量了自己的睡眠"),
          ],
          t(
            "The passage says the phrase has a narrow meaning, unlikely by chance, and with 5,000 students even a tiny relationship, about six minutes per hour, can be significant.",
            "文章说这个说法含义很窄，即不太可能出于偶然；在5000名学生中，即使是每小时约六分钟这样微小的关系也可能显著。",
          ),
        ),
      ],
      ["report's"],
    ),
    passage(
      "test-scores-and-rankings",
      t("Test Scores and Rankings", "考试成绩与排名"),
      `Every year, the education ministry of the province of Corlan publishes a table ranking its 240 secondary schools by the average score of their students on a national examination. Newspapers reprint the table, parents study it, and the schools at the top advertise their position. This year, Westmere School rose from place 118 to place 41, and its head teacher was widely praised. Northgate School fell from place 52 to place 130, and its head teacher was asked to explain.

A closer look at the figures behind the table suggests that both reactions were mistaken. The ministry's own report, published alongside the rankings, includes a chart showing the average score of every school. Most schools are bunched closely together in the middle of the distribution. The difference between the school in place 41 and the school in place 130 is only about 3 points on a scale of 100. In a crowded middle, a small change in score produces a large change in rank.

Westmere and Northgate are both small schools, with about 60 students taking the examination each year. With so few students, a school's average score varies considerably from year to year by chance alone: one year's group may simply include a few more strong or weak students than the next. The report's table of results over five years shows that both schools have moved up and down the rankings repeatedly. Westmere's rise this year is about the size of its fall two years ago. Neither school's change is a reliable sign of improvement or decline.

This pattern is a familiar one in statistics, sometimes called regression to the mean. When a measurement includes an element of chance, unusually high or low results tend to be followed by results closer to the average. A school that has an unusually bad year is likely to do better the next year even if nothing changes, and one that has an unusually good year is likely to do worse. Head teachers who are praised after a good year and blamed after a bad one are often being praised and blamed for luck.

A second problem with the rankings concerns what the scores measure. A school's average score depends heavily on the students it admits. Schools in wealthy areas, or schools that select students by examination, start with students who are already likely to score well. Their high position in the table may say more about their intake than about their teaching. The ministry's report includes a second measure that attempts to address this: a "progress" score, which compares students' results with their scores on an earlier test at age eleven. On the progress measure, several schools near the bottom of the main table rank among the top 50, and several near the top fall to the middle.

The progress measure has limitations of its own, including a wide margin of error for small schools. But it answers a better question. Parents who want to know how well a school teaches are asking about progress, not about the scores of students who were already strong when they arrived.

For a reader, the lessons are general. Rankings magnify small differences, especially where many values are close together. Results for small groups are unstable and should be judged over several years rather than one. And a raw average often reflects who is being measured as much as what has been done to them. A ranking is a list, not an explanation, and the figures behind it usually tell a more careful story than its order does.`,
      [statistics, charts, numbers, academic(1)],
      [
        ask(
          t("Why can a small change in score produce a large change in rank?", "为什么分数的小变化会导致排名的大变化？"),
          t("Most schools are bunched closely together in the middle of the distribution", "大多数学校都集中在分布的中间，彼此非常接近"),
          [
            t("The ministry changes the scale every year", "教育部每年都改变计分标准"),
            t("Only the top schools take the examination", "只有排名靠前的学校参加考试"),
            t("The rankings are decided by newspapers", "排名是由报纸决定的"),
          ],
          t(
            "The chart shows most schools crowded in the middle, where the schools in places 41 and 130 differ by only about 3 points.",
            "图表显示大多数学校挤在中间，排第41名和第130名的学校只相差约3分。",
          ),
        ),
        ask(
          t("What does regression to the mean suggest about Westmere's rise?", "均值回归现象对威斯特米尔学校的名次上升意味着什么？"),
          t(
            "An unusually good year is likely to be followed by a result closer to average",
            "一个异常好的年份之后，结果很可能更接近平均水平",
          ),
          [
            t("The school will certainly keep rising next year", "这所学校明年肯定会继续上升"),
            t("The head teacher deserves all the credit", "校长应该得到全部功劳"),
            t("The school's teaching has greatly improved", "这所学校的教学大大改进了"),
          ],
          t(
            "The passage explains that where chance plays a part, unusually high or low results tend to be followed by results closer to the average.",
            "文章解释说，只要有偶然因素，异常高或低的结果之后往往会出现更接近平均值的结果。",
          ),
        ),
        ask(
          t(
            "Why does the progress score answer a better question than the average score?",
            "为什么“进步分”比平均分回答的是一个更好的问题？",
          ),
          t(
            "It compares students' results with their earlier scores, so it reflects teaching rather than intake",
            "它把学生的成绩与早先的分数相比较，因而反映的是教学而不是生源",
          ),
          [
            t("It has no margin of error at all", "它完全没有误差范围"),
            t("It always puts wealthy schools at the top", "它总是把富裕地区的学校排在前面"),
            t("It counts only the strongest students", "它只计算最强的学生"),
          ],
          t(
            "The passage says average scores depend heavily on whom a school admits, while progress compares results with scores at age eleven.",
            "文章说平均分在很大程度上取决于学校招收什么样的学生，而进步分是把成绩与十一岁时的分数相比较。",
          ),
        ),
      ],
      ["Corlan", "Westmere", "Westmere's", "Northgate", "ministry's"],
    ),
    passage(
      "air-on-a-bad-day",
      t("Air on a Bad Day", "空气糟糕的日子"),
      `On the morning of 14 January, air quality monitors in the city of Tessaly recorded the highest level of fine particles in the air since measurements began. Fine particles, tiny pieces of dust and smoke small enough to be breathed deep into the lungs, are among the most harmful forms of air pollution. A news website illustrated its report with a chart showing the daily level of particles over the previous five years, with a sharp peak on 14 January. The headline read: "Air Pollution at Record High".

The headline was accurate about the day. It was misleading about the trend. The same chart, read carefully, showed something else. The daily figures jumped up and down a great deal, as daily figures always do, depending on the weather, the wind and the season. But a line added by the city's environment office, showing the average over each twelve months, had fallen steadily throughout the five years, by about a quarter in total. The record day was an outlier, caused, the office explained, by an unusual combination of still, cold air and heavy use of wood fires during a period of extreme cold. On most days, the air was cleaner than it had been five years earlier.

This distinction between a single extreme value and a long-term trend matters for nearly every kind of data that varies from day to day, from temperatures to prices. A chart that shows daily values invites the eye to the peaks, which are dramatic, rather than to the underlying direction, which is gradual. A careful reader looks for the trend line, or for averages over longer periods, before drawing conclusions.

A second feature of the chart deserves attention: its vertical axis. In the news website's version, the axis began not at zero but at 20 units, so that the lowest values sat at the bottom of the chart and the peak rose to the top. This made the variation look much larger than it was. In the environment office's version of the same chart, with the axis beginning at zero, the daily changes looked smaller and the long-term fall more visible. Neither chart was false; both plotted the same numbers. But the choice of scale changed what a reader was likely to notice.

A third point concerns what the numbers mean for health. The level of particles is reported in units that mean little to most readers. Health agencies publish limits: levels above which, on average, the risk of breathing problems and heart disease rises. On 14 January, Tessaly's level was roughly four times the daily limit. Over the year as a whole, however, the average level was slightly below the annual limit for the first time. Both facts are true, and both are relevant to health, since long exposure to moderate pollution affects more people than brief exposure to extreme levels.

How should a writer report such data? A responsible report might say: "Pollution reached a record level on 14 January because of unusual weather, but average levels have fallen by about a quarter in five years." That sentence is less exciting than the headline, but it reports both the event and the trend, and it does not leave the reader with a false impression.

Numbers about the environment are often used in arguments, and every side has an interest in particular figures. One side points to the record day; the other to the falling average. A reader who knows to ask for both, and to check the scale of every chart, is much harder to mislead.`,
      [statistics, charts, numbers, academic(2), academic(3)],
      [
        ask(
          t("What did the twelve-month average line show?", "十二个月平均值的曲线显示了什么？"),
          t("Pollution had fallen steadily over five years, by about a quarter", "五年来污染稳步下降，降幅约四分之一"),
          [
            t("Pollution had risen every month for five years", "五年来污染每个月都在上升"),
            t("The record day happened every winter", "每年冬天都会出现创纪录的日子"),
            t("The air was dirtier on most days than before", "大多数日子的空气比以前更脏"),
          ],
          t(
            "The second paragraph says the twelve-month average fell steadily throughout the five years, by about a quarter in total; the record day was an outlier.",
            "第二段说，十二个月平均值五年来稳步下降，总共降了约四分之一；创纪录的那一天是一个离群值。",
          ),
        ),
        ask(
          t("What effect did starting the vertical axis at 20 rather than zero have?", "纵轴从20而不是从0开始，产生了什么效果？"),
          t("It made the daily variation look much larger than it was", "它让每天的波动看起来比实际大得多"),
          [
            t("It changed the numbers that were plotted", "它改变了所绘制的数字"),
            t("It made the long-term fall easier to see", "它让长期下降更容易看出"),
            t("It hid the record day from the chart", "它在图表上隐藏了创纪录的那一天"),
          ],
          t(
            "The passage says the axis beginning at 20 made the variation look larger, while the version starting at zero made the long-term fall more visible.",
            "文章说，从20开始的纵轴使波动显得更大，而从0开始的版本让长期下降更明显。",
          ),
        ),
        ask(
          t("Why does the author consider the suggested sentence a responsible report?", "作者为什么认为文中建议的那句话是负责任的报道？"),
          t("It reports both the record event and the long-term trend", "它既报道了创纪录的事件，也报道了长期趋势"),
          [
            t("It leaves out the record day entirely", "它完全略去了创纪录的那一天"),
            t("It uses more exciting words than the headline", "它用词比标题更吸引人"),
            t("It avoids mentioning any numbers", "它避免提及任何数字"),
          ],
          t(
            "The passage says the sentence reports both the event and the trend and does not leave the reader with a false impression.",
            "文章说这句话既报道了事件也报道了趋势，不会给读者留下错误印象。",
          ),
        ),
      ],
      ["Tessaly", "Tessaly's", "website's", "office's"],
    ),
    passage(
      "a-medical-risk",
      t("A Medical Risk", "一项医疗风险"),
      `"New Study: Common Painkiller Doubles Risk of Stroke". The headline, which appeared on several news sites last autumn, frightened many readers who took the medicine regularly. Some stopped taking it; doctors reported calls from worried patients. The study behind the headline was real, carefully conducted and published in a respected journal. The headline was not exactly wrong. But it gave readers almost none of the information they needed to judge their own risk.

The study followed about 40,000 adults for five years. Among those who did not take the painkiller, about 2 in every 1,000 had a stroke during that period. Among those who took it daily, about 4 in every 1,000 did. The risk had indeed doubled. But it had doubled from a very small number to another small number.

Statisticians distinguish between two ways of expressing such a change. Relative risk compares the two groups as a ratio: 4 in 1,000 is twice 2 in 1,000, so the relative risk is 2, or "double". Absolute risk describes the actual difference in probability: 4 in 1,000 minus 2 in 1,000 is 2 in 1,000, or 0.2 percent. Put another way, if 1,000 people took the painkiller daily for five years, about 2 more of them would have a stroke than if they had not.

Both figures are accurate, and both are useful. But they create very different impressions. "Doubles the risk" sounds alarming; "an extra 2 strokes for every 1,000 people over five years" sounds much less so. Research on how people understand risk has found that relative figures consistently make effects seem larger than absolute figures do, and that people make better decisions when they are given absolute figures, ideally expressed as numbers of people out of a round total.

The study's own summary, notably, gave both figures. The news reports that followed mostly gave only the relative one, perhaps because "doubles" makes a stronger headline. The same pattern appears in reports of benefits as well as harms. A treatment that reduces the risk of a disease from 2 in 1,000 to 1 in 1,000 can be described as "cutting the risk in half", which sounds dramatic, or as preventing one case for every thousand people treated, which may not justify its cost or its side effects.

Absolute figures also allow a sensible comparison of risks and benefits. For people who take the painkiller because of serious, constant pain, an extra 2 strokes per 1,000 over five years might be a reasonable price for relief. For people who take it daily out of habit, for occasional headaches, the same risk might not be worth it. Neither judgment can be made from the word "doubles".

Finally, the study measured the risk in a particular population: adults over fifty, many with other health problems. Its findings may not apply equally to younger, healthier people, whose baseline risk of stroke is much lower. A doubling of a tiny probability is a smaller absolute increase still.

When reading about a medical risk, then, a reader should ask: doubled from what to what? How many people out of a thousand are affected, over what period? And does the population studied resemble me? A report that cannot answer these questions has given its readers a fright, not information.`,
      [statistics, charts, numbers, academic(1), academic(2)],
      [
        ask(
          t("What was the absolute increase in risk found by the study?", "这项研究发现的绝对风险增加了多少？"),
          t("About 2 more strokes for every 1,000 people over five years", "五年内每1000人中大约多2例中风"),
          [
            t("The risk of stroke became 100 percent", "中风的风险变成了100%"),
            t("About 4 more strokes for every 100 people each year", "每年每100人中大约多4例中风"),
            t("There was no increase at all", "完全没有增加"),
          ],
          t(
            "The passage calculates 4 in 1,000 minus 2 in 1,000, which is 2 in 1,000, or 0.2 percent, over the five years of the study.",
            "文章计算出：千分之四减去千分之二，即在五年研究期内为千分之二，也就是0.2%。",
          ),
        ),
        ask(
          t(
            "According to research on understanding risk, what helps people make better decisions?",
            "根据有关风险理解的研究，什么能帮助人们做出更好的决定？",
          ),
          t("Absolute figures, expressed as numbers of people out of a round total", "绝对数字，用整数总人数中的人数来表示"),
          [
            t("Relative figures, such as doubles or halves", "相对数字，例如翻倍或减半"),
            t("Headlines that use strong words", "使用强烈字眼的标题"),
            t("Avoiding all numbers in reports", "报道中避免使用任何数字"),
          ],
          t(
            "The fourth paragraph says people make better decisions when given absolute figures, ideally as numbers of people out of a round total.",
            "第四段说，给人们绝对数字时，他们会做出更好的决定，最好表示为整数总人数中有多少人。",
          ),
        ),
        ask(
          t(
            "Why might the study's findings not apply equally to younger, healthier people?",
            "为什么这项研究的发现不一定同样适用于更年轻、更健康的人？",
          ),
          t(
            "The study was of adults over fifty, and younger people have a much lower baseline risk",
            "研究对象是五十岁以上的成年人，而年轻人的基础风险要低得多",
          ),
          [
            t("Younger people never take painkillers", "年轻人从不服用止痛药"),
            t("The study included only young people", "研究只包括年轻人"),
            t("Younger people are more likely to have strokes", "年轻人更容易中风"),
          ],
          t(
            "The passage says the population was adults over fifty, and for younger people a doubling of a tiny probability is a smaller absolute increase still.",
            "文章说研究人群是五十岁以上的成年人，对年轻人来说，一个极小概率翻倍后的绝对增量还要更小。",
          ),
        ),
      ],
    ),
    passage(
      "the-best-shooter-in-the-league",
      t("The Best Shooter in the League", "联赛最佳投手"),
      `Halfway through the basketball season, a sports website declared that Jonah Pike was "the best shooter in the league". The evidence was a single statistic: Pike had made 62 percent of his shots, the highest proportion of any player. A table in the article listed the top ten, with Pike first and the league's most famous scorer, Theo Marsh, ninth at 48 percent.

Fans who watched the games were puzzled. Marsh seemed to make difficult shots all the time; Pike rarely seemed to shoot at all. Both impressions turn out to be correct, and the table hides the reason.

The first problem is the size of the sample. Pike, a defensive player who spent much of each game on the bench, had taken 50 shots in the half season. Marsh had taken 520. A proportion based on 50 attempts is much less reliable than one based on 520, because chance plays a larger role in a small sample. If Pike had missed just six more of his shots, his percentage would have fallen to 50, below several other players. Marsh's figure, by contrast, would barely change with a few more misses. Leagues recognize this problem: to qualify for official shooting records, a player must usually take a minimum number of shots. The website had ignored that rule.

The second problem is what kinds of shots each player took. Pike took almost all his shots from very close to the basket, often after a teammate's pass left him unguarded. Such shots succeed most of the time for any player. Marsh, as his team's main scorer, took many shots from far away and many while closely guarded, often because the game required someone to shoot as time ran out. A table in a later, more careful analysis divided each player's shots by distance. At every distance, Marsh's success rate was higher than the league average; Pike's was about average. Marsh's overall figure was lower only because he attempted many more difficult shots.

This is an instance of a common statistical trap: comparing overall rates for groups that differ in composition. When one player's shots are mostly easy and another's mostly hard, their overall percentages say more about the mix of shots than about their skill. The same trap appears outside sports. A hospital that treats the most serious cases may have a higher death rate than one that treats mild ones, even if it provides better care for every type of patient. Comparing overall rates without looking at the composition of each group can make the better performer look worse.

The third problem concerns what the statistic leaves out. Shooting percentage counts only successful and missed shots. It ignores the value of a shot, since shots from far away are worth more points, and it ignores everything else a player does. A player who creates chances for teammates, or who takes difficult shots so that others do not have to, may contribute more than his percentage suggests.

By the end of the season, after more games and more shots, Pike's percentage had fallen to 54, still respectable but no longer first. Marsh's had risen slightly. The website did not publish a correction.

The lesson applies well beyond sports. Before accepting that one figure shows who is best, ask how many attempts it is based on, whether the groups being compared faced the same conditions, and what the figure does not measure. A single number can rank; it rarely explains.`,
      [statistics, charts, numbers, academic(1), academic(3)],
      [
        ask(
          t("Why was Pike's 62 percent less reliable than Marsh's 48 percent?", "为什么派克的62%不如马什的48%可靠？"),
          t("It was based on only 50 shots, so chance played a larger role", "它只基于50次投篮，偶然因素的影响更大"),
          [
            t("Pike's shots were counted by a different website", "派克的投篮是由另一家网站统计的"),
            t("Marsh had played in more seasons", "马什参加过更多赛季"),
            t("Percentages are never reliable in sports", "体育中的百分比从来都不可靠"),
          ],
          t(
            "The passage says Pike took 50 shots and Marsh 520, and a proportion based on few attempts is much less reliable because chance plays a larger role.",
            "文章说派克投了50次，马什投了520次，基于少量尝试的比例要不可靠得多，因为偶然因素影响更大。",
          ),
        ),
        ask(
          t("What did dividing each player's shots by distance show?", "按距离划分每位球员的投篮后，发现了什么？"),
          t(
            "Marsh was better than average at every distance, while Pike was about average",
            "马什在每个距离上都高于平均水平，而派克大约处于平均水平",
          ),
          [
            t("Pike was better than Marsh at every distance", "派克在每个距离上都比马什好"),
            t("Both players took only close shots", "两名球员都只在近距离投篮"),
            t("Marsh never shot from far away", "马什从不远距离投篮"),
          ],
          t(
            "The later analysis showed Marsh above the league average at every distance; his overall figure was lower only because he attempted many more difficult shots.",
            "后来的分析显示，马什在每个距离上都高于联赛平均水平；他的总命中率较低只是因为他尝试了多得多的高难度投篮。",
          ),
        ),
        ask(
          t("How does the hospital example illustrate the same trap?", "医院的例子怎样说明了同样的陷阱？"),
          t(
            "A hospital treating the most serious cases may look worse overall while giving better care",
            "收治最重病人的医院总体数据可能更差，但医疗质量其实更好",
          ),
          [
            t("Hospitals always report their death rates honestly", "医院总是如实报告死亡率"),
            t("Hospitals with more patients always provide better care", "病人多的医院总是医疗更好"),
            t("Death rates cannot be compared at all", "死亡率根本无法比较"),
          ],
          t(
            "The passage says comparing overall rates without looking at the composition of each group can make the better performer look worse.",
            "文章说，不看各组的构成就比较总体比率，可能会让表现更好的一方看起来更差。",
          ),
        ),
      ],
      ["Jonah", "Pike", "Pike's", "Theo", "Marsh", "Marsh's", "league's", "teammate's"],
    ),
  ],
};
