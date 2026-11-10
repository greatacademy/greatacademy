// College writing: the reading unit of the fourth theme, the research paper: eight original passages that follow one
// invented study, of green space near schools, from its question to the response of other researchers.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grades-6-8/reading-kit.ts";

const scholarly = { topic: "words-of-scholarly-argument", weight: 0.3 } as const;
const paper = { topic: "reading-a-research-paper", weight: 0.3 } as const;
const cohesion = { topic: "cohesion-old-before-new", weight: 0.1 } as const;

/** academic gives the edge to a batch of the shared academic words, which a passage uses as it goes. */
const academic = (n: 1 | 2 | 3) => ({ topic: `academic-words-${n}`, weight: 0.1 }) as const;

/** names are the invented researchers and places of the study the unit follows. */
const names = ["Nadia", "Ferris", "Ferris's", "Tobias", "Wren", "Wren's", "Leah", "Moreau", "Moreau's", "Eastfield"];

/** insideAResearchPaper is a reading unit of the college writing course that follows one study from start to end. */
export const insideAResearchPaper: ReadingUnitDef = {
  id: "inside-a-research-paper",
  title: t("Inside a Research Paper", "研究论文的内部"),
  passages: [
    passage(
      "the-question-of-the-study",
      t("The Question", "研究问题"),
      `Nadia Ferris did not set out to study trees. As a teacher in the city of Eastfield, before she became a researcher in education, she had noticed something she could not explain. Her students seemed calmer and more attentive after lessons held in a small park beside the school than after lessons held indoors. She wondered whether this was a real effect or simply her imagination, and, if it was real, whether it lasted.

Years later, as a researcher, she returned to the question. This series of passages follows her study from its first idea to its reception by other researchers, and in doing so it follows the parts of a typical research paper.

Every paper begins with a question, and the introduction is where the question is stated and justified. A good introduction does three things in a particular order. It first establishes the context: what is already known, and why the general subject matters. It then identifies a gap: something that is not known, or about which studies disagree. Finally, it states what the present study will do to address that gap. Readers sometimes call this structure a funnel, because it moves from the broad to the narrow.

Ferris's introduction followed this pattern. It began with a broad claim that few would dispute: children's ability to pay attention affects how well they learn, and schools have limited ways of improving it. It then summarized research suggesting that time spent in natural settings can restore attention after mental effort. Much of this research, however, had been done with adults, in laboratories, over periods of a few minutes. Whereas the laboratory studies showed short effects in adults, almost nothing was known about whether everyday exposure to green space near a school affected children's attention over months or years. Hence the question: do children who attend schools with more green space nearby show better attention than similar children who attend schools with less?

The wording of the question repays attention. It does not ask whether green space improves attention, which would require an experiment in which researchers planted trees around some schools and not others. It asks whether children at greener schools show better attention than similar children elsewhere, a question that could be answered by comparing schools that already existed. The difference reflects what was feasible. Ferris could not plant forests, but she could measure the ones already there.

The word "similar" in the question also does important work. Schools with parks nearby tend to be in wealthier neighborhoods, and wealthier children tend to do better on many measures for many reasons. A comparison that ignored this would be meaningless. The question, therefore, already anticipates the main difficulty the method would have to solve.

When reading a research paper, it is often useful to read the introduction last but one, after the abstract and before the rest. The abstract tells you what the paper found; the introduction tells you why the authors thought it worth finding out, and what they believed was missing from earlier work. If you cannot state the gap a paper claims to fill, you will find it hard to judge whether the paper succeeds. Ferris's gap was clear, albeit narrow: an effect known in laboratories had not been tested in the places where children actually spend their days.`,
      [scholarly, paper, cohesion, academic(1), academic(2), academic(3)],
      [
        ask(
          t("What three things does a good introduction do, in order?", "一篇好的引言按顺序做哪三件事？"),
          t("Establish the context, identify a gap, and state what the study will do", "交代背景，指出空白，说明本研究要做什么"),
          [
            t("State the results, list the limits, and thank the funders", "陈述结果，列出局限，感谢资助者"),
            t("Describe the method, report the data, and draw conclusions", "描述方法，报告数据，得出结论"),
            t("Summarize every earlier study in the order it was published", "按发表顺序总结所有先前的研究"),
          ],
          t(
            "The third paragraph describes this funnel: context first, then a gap, then what the present study will do.",
            "第三段描述了这种漏斗结构：先交代背景，再指出空白，最后说明本研究要做的事。",
          ),
        ),
        ask(
          t(
            "Why does Ferris's question ask about existing schools rather than whether green space improves attention?",
            "费里斯的问题为什么针对现有的学校，而不是问绿地能否改善注意力？",
          ),
          t(
            "Planting trees around chosen schools was not feasible, but existing schools could be compared",
            "在选定学校周围种树做不到，但可以比较现有的学校",
          ),
          [
            t("She believed green space could not improve attention", "她认为绿地不可能改善注意力"),
            t("Earlier studies had already proved that it does", "先前的研究已经证明了这一点"),
            t("Schools refused to let researchers measure attention", "学校拒绝让研究者测量注意力"),
          ],
          t(
            "The passage says a question about improvement would need an experiment planting trees; comparing schools that already existed was what was feasible.",
            "文章说，问“改善”就需要种树做实验；比较已有的学校才是可行的。",
          ),
        ),
        ask(
          t('Why is the word "similar" important in the question?', "为什么问题中“相似”一词很重要？"),
          t(
            "Greener schools tend to be in wealthier areas, so the comparison must account for wealth",
            "绿地多的学校往往在较富裕的地区，所以比较时必须考虑财富因素",
          ),
          [
            t("All schools in Eastfield are exactly alike", "伊斯特菲尔德的所有学校完全一样"),
            t("Similar children always get the same scores", "相似的孩子总是得到相同的分数"),
            t("The word makes the question sound more scientific", "这个词让问题听起来更科学"),
          ],
          t(
            "The passage explains that wealthier children do better on many measures, so a comparison ignoring this would be meaningless.",
            "文章解释说，较富裕家庭的孩子在许多指标上表现更好，忽略这一点的比较毫无意义。",
          ),
        ),
      ],
      names,
    ),
    passage(
      "reviewing-the-literature",
      t("The Literature", "文献"),
      `Before designing her study, Ferris spent four months reading. The section of a paper that reports this reading is the literature review, and it is often misunderstood. Students tend to treat it as a list: one paragraph for each earlier study, in the order the writer happened to read them. A strong literature review is not a list but an argument. It organizes earlier work around questions, shows where studies agree and disagree, and thereby leads the reader to the gap that the new study will fill.

Ferris began by gathering everything she could find. She searched databases in psychology, education and urban planning, read the abstracts of more than three hundred papers, and selected about sixty to read in full. For each, she recorded the question, the people studied, the method, the main finding and any weaknesses she noticed. This record, rather than her memory, became the basis of the review.

She then looked for patterns. The studies fell, she found, into three groups. The first group consisted of laboratory experiments, mostly with university students, in which people performed a tiring mental task, then looked at photographs of nature or of city streets, then were tested again. These studies generally found that people who saw nature recovered their attention faster. The effects were consistent, albeit small and short.

The second group consisted of studies of children in everyday settings. These were fewer and more varied. One found that children with attention difficulties concentrated better after a walk in a park than after a walk through a town. Another found that children living near green space scored higher on tests of memory. Most of these studies, however, measured children at a single moment, and few had accounted for differences in family income. Insofar as greener areas are also wealthier, their findings could not separate the effect of nature from the effect of money.

The third group, the smallest, consisted of studies that had found no effect at all. Ferris treated these seriously. A literature review that reports only the studies supporting the author's expectation misleads its readers, and it also deprives the author of useful information. Two of these studies, she noticed, had measured green space only within the school grounds, whereas the studies that found effects had measured it in the wider neighborhood. This difference suggested that the amount of green space children encounter over a whole day, not only at school, might matter.

Her review, as finally written, did not summarize the sixty studies one by one. It moved from the laboratory evidence, which was strong but artificial, to the everyday evidence, which was realistic but weak in design, and ended by identifying what neither group had done: follow the same children over several years while comparing schools in neighborhoods of similar income. The review thus prepared the reader to see her study as the next logical step.

Writing a review of this kind is demanding. It requires the writer to synthesize, not merely summarize: to state what the studies show together that no single study shows alone. A useful test is to look at the first sentence of each paragraph. In a list, each begins with an author's name: "Smith found..." In an argument, each begins with a claim about the field, and the authors appear as evidence for it: "Effects in laboratories are consistent but short, as several studies have shown." The second kind of sentence is harder to write. Nonetheless, it is what turns reading into research.`,
      [scholarly, paper, cohesion, academic(1), academic(2), academic(3)],
      [
        ask(
          t(
            "According to the passage, how does a strong literature review differ from a weak one?",
            "根据文章，好的文献综述与差的文献综述有什么不同？",
          ),
          t(
            "It organizes earlier work around questions and leads to a gap, instead of listing studies one by one",
            "它围绕问题组织已有研究并引出空白，而不是逐一罗列研究",
          ),
          [
            t("It covers more studies than a weak review", "它涵盖的研究比差的综述多"),
            t("It reports only the studies that support the author", "它只报告支持作者观点的研究"),
            t("It lists studies in the order they were read", "它按阅读的先后顺序列出研究"),
          ],
          t(
            "The first paragraph says a strong review is an argument, not a list: it organizes work around questions and leads the reader to the gap.",
            "第一段说，好的综述是论证而不是清单：它围绕问题组织文献，引导读者看到研究空白。",
          ),
        ),
        ask(
          t("Why could the second group of studies not settle the question?", "为什么第二组研究无法解决这个问题？"),
          t("Most measured children once and did not account for family income", "大多数研究只测量过孩子一次，也没有考虑家庭收入"),
          [
            t("They were all done with adults in laboratories", "它们全是在实验室里针对成年人做的"),
            t("They all found no effect at all", "它们全都没有发现任何效果"),
            t("They measured only green space inside schools", "它们只测量了学校内的绿地"),
          ],
          t(
            "The fourth paragraph says most measured children at a single moment and few accounted for income, so nature and money could not be separated.",
            "第四段说，大多数研究只在某一时刻测量孩子，很少考虑收入，因此无法区分自然和财富的影响。",
          ),
        ),
        ask(
          t("What did Ferris learn from the studies that found no effect?", "费里斯从那些没有发现效果的研究中了解到什么？"),
          t(
            "They measured green space only in school grounds, suggesting the wider neighborhood matters",
            "它们只测量了校园内的绿地，这说明更大范围的社区环境可能才是关键",
          ),
          [
            t("That green space has no effect on anyone", "绿地对任何人都没有影响"),
            t("That those studies should be left out of the review", "那些研究应该从综述中删去"),
            t("That laboratory studies are always wrong", "实验室研究总是错的"),
          ],
          t(
            "She noticed two of them measured green space only within school grounds, whereas studies that found effects measured the wider neighborhood.",
            "她注意到其中两项研究只测量了校园内的绿地，而发现效果的研究测量的是更大范围的社区。",
          ),
        ),
      ],
      [...names, "Smith"],
    ),
    passage(
      "designing-the-method",
      t("The Method", "研究方法"),
      `The methods section of a research paper is the part most readers skip and the part on which everything else depends. It describes, in enough detail for another researcher to repeat the study, who was studied, what was measured, and how. A reader who skips it must take the results on trust; a reader who studies it can judge whether the results deserve trust at all.

Ferris faced a central problem in designing her method. She wanted to know whether green space near schools affected children's attention. She could not assign children to schools at random, and schools with more green space differed from others in many ways, most obviously in the wealth of the families they served. Any difference in attention might be caused by wealth, not by trees.

Her solution had several parts. First, she chose schools carefully. Working with Tobias Wren, a geographer, she used satellite images to measure the proportion of land covered by trees, grass and parks within one kilometer of each of the city's primary schools. She then grouped the schools by the average income of the families in their neighborhoods and, within each group, selected pairs: one school with much green space and one with little. In this way, the schools she compared were similar in wealth, albeit different in surroundings.

Second, she followed the same children over time. Measuring children once can show that two groups differ, but not when the difference arose. By testing 2,600 children aged seven to ten every six months for three years, she could see whether the difference grew as children spent more time at their schools, which would be expected if the schools' surroundings played a role.

Third, she chose her measure of attention carefully. Rather than ask teachers to rate their students, which would invite teachers' expectations to influence the results, she used a computer task in which children had to respond to some signals and ignore others. The task had been used in many earlier studies, its results were known to be stable, and it was scored automatically, thereby removing the judgment of the person giving the test.

Fourth, she collected information about other factors that might affect attention: the children's sleep, their families' income and education, air pollution near each school, and the noise of traffic. These could not be controlled, but they could be measured, and the analysis could estimate the effect of green space while holding them constant.

Finally, she wrote down her plan in full before collecting any data and registered it with a public database. The plan stated what she expected to find and exactly how she would analyze the results. Registration of this kind prevents a researcher from trying many analyses after the fact and reporting only the one that works.

No method is perfect, and Ferris's was not. Matching schools on income could not guarantee that they were similar in every other way. Moreover, families might choose where to live partly because of parks, and such families might differ in ways that no measure captured. These weaknesses would return in the discussion. Nonetheless, the method was designed with its main threat in view, and that is what distinguishes a careful method from a careless one: not the absence of weaknesses, but evidence that the researcher saw them coming.`,
      [scholarly, paper, cohesion, academic(1), academic(2), academic(3)],
      [
        ask(
          t("What was the central problem Ferris faced in designing her method?", "费里斯设计研究方法时面临的核心问题是什么？"),
          t(
            "Greener schools differed in wealth, so a difference in attention might be caused by wealth",
            "绿地多的学校在财富上也不同，所以注意力的差异可能是财富造成的",
          ),
          [
            t("No schools in the city had any green space", "城里没有一所学校有绿地"),
            t("Children refused to take the computer task", "孩子们拒绝做电脑测试"),
            t("Teachers wanted to rate their own students", "老师们想给自己的学生打分"),
          ],
          t(
            "The second paragraph says she could not assign children at random, and greener schools differed most obviously in wealth.",
            "第二段说她无法随机分配孩子，而绿地多的学校最明显的不同在于财富。",
          ),
        ),
        ask(
          t(
            "Why did Ferris use a computer task instead of asking teachers to rate attention?",
            "费里斯为什么用电脑任务而不是请老师评估注意力？",
          ),
          t(
            "Teachers' expectations might influence their ratings, while the task was scored automatically",
            "老师的预期可能影响评分，而电脑任务是自动计分的",
          ),
          [
            t("Teachers did not know their students well enough", "老师对学生了解得不够"),
            t("The computer task was cheaper than paying teachers", "电脑任务比付钱给老师便宜"),
            t("Children enjoy computer games more than lessons", "孩子们喜欢电脑游戏胜过上课"),
          ],
          t(
            "The passage says teacher ratings would invite expectations to influence results, whereas the task was scored automatically, removing personal judgment.",
            "文章说，老师评分会让预期影响结果，而电脑任务自动计分，排除了人的判断。",
          ),
        ),
        ask(
          t("Why did Ferris register her plan before collecting data?", "费里斯为什么在收集数据前登记研究计划？"),
          t("To prevent trying many analyses afterward and reporting only the one that works", "以防事后尝试多种分析，只报告有效的那一种"),
          [
            t("Because the city required all schools to register", "因为市政府要求所有学校登记"),
            t("So that other researchers could take her data", "以便其他研究者拿走她的数据"),
            t("To make the study finish more quickly", "为了让研究更快完成"),
          ],
          t(
            "The passage says registration prevents a researcher from trying many analyses after the fact and reporting only the one that works.",
            "文章说，登记计划可以防止研究者事后尝试多种分析，只报告有效的那一种。",
          ),
        ),
      ],
      names,
    ),
    passage(
      "collecting-the-data",
      t("The Data", "数据"),
      `Published papers make research look orderly. The methods section describes a plan, the results section reports what happened, and the reader rarely learns how much effort, improvisation and luck lay between the two. Ferris's three years of data collection were typical in this respect, and the story of them shows why the methods section of a good paper often contains small details that seem unimportant.

The first difficulty was consent. Before any child could be tested, the parents had to agree, and the schools had to agree on their behalf to give the researchers time and space. Ferris had hoped to recruit 3,000 children. Some schools declined; some parents did not reply. She began with 2,600, a number large enough for her analysis, albeit smaller than planned. More importantly, she recorded which families declined and compared them with those who agreed, as far as the schools' records allowed. Families who declined were slightly poorer on average. This mattered, because it meant that her sample was not perfectly representative of the city, and she reported it.

The second difficulty was the test itself. The computer task needed a quiet room, but quiet rooms are scarce in primary schools. In some schools the testing took place in libraries, in others in empty classrooms, and in one, for a term, in a storage room. Wren pointed out that if the greener schools happened to provide quieter rooms, the testing conditions themselves might create a difference between groups. The team therefore recorded the noise level during each session, so that the analysis could take it into account.

The third difficulty was loss. Over three years, children move, change schools, fall ill on testing days or simply grow tired of the study. By the final round, about one in six of the original children had left. Researchers call this attrition, and it can distort results if the children who leave differ from those who stay. Ferris found that children who left had slightly lower scores at the start, and that they left at similar rates from green and less green schools. Hence the loss, though regrettable, was unlikely to explain any difference between the two groups.

The fourth difficulty was unexpected. In the second year, the city built a new park beside one of the schools in the less green group. Strictly speaking, this school no longer belonged in its category. Ferris could have quietly removed it from the study. Instead, she treated it as an opportunity: if green space mattered, the children at this school should improve relative to their partner school after the park opened. She described the change in her paper, analyzed the school separately, and noted that a single school could suggest, but not establish, anything.

Each of these problems appears in the published paper as a sentence or two: a note on consent rates, a sentence on testing rooms, a table of attrition, a paragraph on the new park. Readers who skip such details miss the evidence that the researchers were honest about what went wrong. Conversely, a paper whose methods section reports no problems at all should make a careful reader slightly suspicious. Real data are rarely collected exactly as planned, and the record of how a study departed from its plan is itself part of its evidence.`,
      [scholarly, paper, cohesion, academic(1), academic(3)],
      [
        ask(
          t(
            "Why did Ferris compare the families who declined with those who agreed?",
            "费里斯为什么把拒绝参加的家庭与同意参加的家庭作比较？",
          ),
          t("To see whether her sample represented the city fairly", "为了查看她的样本是否能公平地代表全市"),
          [
            t("To persuade the families who declined to join", "为了说服拒绝的家庭加入"),
            t("To remove the poorer families from the study", "为了把较穷的家庭排除在研究之外"),
            t("Because the schools required her to do so", "因为学校要求她这样做"),
          ],
          t(
            "She found that families who declined were slightly poorer, so the sample was not perfectly representative, and she reported this.",
            "她发现拒绝参加的家庭稍微穷一些，因此样本并不完全具有代表性，她如实报告了这一点。",
          ),
        ),
        ask(
          t("Why did the team record the noise level during each testing session?", "研究团队为什么记录每次测试时的噪音水平？"),
          t(
            "If greener schools had quieter rooms, testing conditions might create a difference",
            "如果绿地多的学校房间更安静，测试条件本身就可能造成差异",
          ),
          [
            t("Because the computer task required a certain noise level", "因为电脑任务需要一定的噪音水平"),
            t("To find the quietest school in the city", "为了找出城里最安静的学校"),
            t("Because parents complained about noisy rooms", "因为家长抱怨房间太吵"),
          ],
          t(
            "Wren pointed out that quieter rooms at greener schools could create a difference, so noise was recorded for the analysis to take into account.",
            "雷恩指出，绿地多的学校房间若更安静就可能造成差异，所以要记录噪音，供分析时考虑。",
          ),
        ),
        ask(
          t("How did Ferris handle the school that gained a new park?", "费里斯怎样处理新建了公园的那所学校？"),
          t(
            "She reported the change and analyzed the school separately, without claiming too much",
            "她报告了这一变化并单独分析这所学校，没有夸大结论",
          ),
          [
            t("She quietly removed it from the study", "她悄悄地把它从研究中剔除"),
            t("She moved it into the greener group without comment", "她不加说明地把它移到绿地多的组"),
            t("She stopped the whole study", "她停止了整个研究"),
          ],
          t(
            "Instead of removing it, she treated it as an opportunity, described the change, analyzed it separately, and noted that one school could only suggest something.",
            "她没有剔除它，而是把它当作机会，说明了变化并单独分析，同时指出一所学校只能提示而不能证明什么。",
          ),
        ),
      ],
      names,
    ),
    passage(
      "reporting-the-results",
      t("The Results", "研究结果"),
      `The results section of a paper reports what the study found, and only that. It does not explain why the findings occurred or what they mean; those questions belong to the discussion. Keeping the two apart is a discipline. It allows readers to see the evidence before they see the author's interpretation of it, and to judge whether the interpretation follows.

Ferris's results section began with a description of the children: their ages, the proportion of girls and boys, the average family income in each group of schools, and the number tested in each round. This may seem dull, but it allows a reader to check that the groups being compared were in fact similar. A table showed that the children at greener and less green schools were close in family income, parents' education and hours of sleep. They differed, as intended, in the green space around their schools: an average of 38 percent of land within one kilometer in the greener group, against 11 percent in the other.

The main finding came next. At the start of the study, children in the two groups scored almost identically on the attention task. Over three years, the scores of both groups improved, as one would expect of growing children. However, the scores of children at greener schools improved somewhat faster. By the end, the difference amounted to about a fifth of the difference typically seen between children one year apart in age. In other words, it was as if children at greener schools had gained, on average, an extra two to three months of development in attention.

A careful results section does not stop at the main finding. Ferris reported several further analyses, all of which she had planned in advance. The difference remained when she took into account air pollution and traffic noise, albeit slightly smaller. It was larger for children who lived, as well as studied, in green neighborhoods. It did not appear for a second measure, a test of memory, which she had included to see whether any effect was specific to attention.

She also reported the school where a park had been built. The children there improved faster after the park opened than before, relative to their partner school. Ferris presented this as an observation, not a finding, since a single school could not establish anything.

How should a reader approach a results section? First, look for the size of the effect, not only whether it exists. A difference can be real and still too small to matter, and many papers emphasize that a result is "significant" without saying how large it is. Ferris stated the size in terms a reader could picture: a few months of development. Second, look at the tables and figures before reading the text, and form your own impression; then check whether the text describes them fairly. Third, notice which analyses were planned and which were added later. Planned analyses deserve more confidence, because the researcher committed to them before seeing the data.

Finally, notice what the results do not show. Ferris's results showed that children at greener schools improved faster. They did not show that the trees caused the improvement. That claim, whether justified or not, would have to wait for the discussion, where the author argues for an interpretation and the reader decides whether to accept it.`,
      [scholarly, paper, cohesion, academic(1), academic(2), academic(3)],
      [
        ask(
          t("Why does a results section keep findings separate from their interpretation?", "为什么研究结果部分要把发现和解释分开？"),
          t(
            "So that readers see the evidence before the author's interpretation and can judge it",
            "让读者先看到证据，再看作者的解释，从而能够加以评判",
          ),
          [
            t("Because interpretation is not allowed in any part of a paper", "因为论文的任何部分都不允许解释"),
            t("Because results are always too complex to explain", "因为结果总是太复杂，无法解释"),
            t("So that the paper is shorter", "为了让论文更短"),
          ],
          t(
            "The first paragraph says keeping the two apart allows readers to see the evidence first and judge whether the interpretation follows.",
            "第一段说，把两者分开能让读者先看到证据，再判断解释是否成立。",
          ),
        ),
        ask(
          t("How large was the main effect Ferris found?", "费里斯发现的主要效应有多大？"),
          t("About two to three extra months of development in attention", "大约相当于注意力多发展了两到三个月"),
          [
            t("About three extra years of development", "大约多发展了三年"),
            t("No difference at all between the groups", "两组之间完全没有差异"),
            t("A large difference in memory but not attention", "记忆力有很大差异，但注意力没有"),
          ],
          t(
            "The passage says the difference was as if children at greener schools gained an extra two to three months of development; the memory test showed no effect.",
            "文章说，这种差异相当于绿地多的学校的孩子多发展了两到三个月；记忆测试没有显示效果。",
          ),
        ),
        ask(
          t("What does the passage say the results did not show?", "文章说研究结果没有表明什么？"),
          t("That the trees caused the improvement", "是树木导致了这种进步"),
          [
            t("That children at greener schools improved faster", "绿地多的学校的孩子进步更快"),
            t("That the groups were similar in income", "两组在收入上相似"),
            t("That all children improved over three years", "所有孩子在三年中都有进步"),
          ],
          t(
            "The last paragraph says the results showed faster improvement but not that the trees caused it; that claim belongs to the discussion.",
            "最后一段说，结果显示了更快的进步，但没有表明是树木造成的；这一观点属于讨论部分。",
          ),
        ),
      ],
      names,
    ),
    passage(
      "writing-the-discussion",
      t("The Discussion", "讨论"),
      `If the results section reports what a study found, the discussion argues for what it means. It is the section where an author is most visible, and where readers should be most alert. A good discussion interprets the findings, relates them to earlier work, considers other explanations, and states what the study implies, all without claiming more than the evidence supports.

Ferris opened her discussion by restating the main finding in a single sentence: over three years, children at schools surrounded by more green space showed faster growth in attention than similar children at schools with less, and the difference could not be explained by family income, air pollution or traffic noise. Restating the finding at the start of the discussion is a courtesy to readers, many of whom will have skipped the results.

She then related the finding to earlier research. Her results were consistent with the laboratory studies, which had shown that natural settings help attention recover after effort. They extended that work, however, in two ways. They showed an effect in children rather than adults, and an effect that accumulated over years rather than lasting minutes. Conversely, her finding that memory was not affected was consistent with the theory that nature restores attention specifically, rather than improving mental ability in general.

The most important part of the discussion addressed other explanations. A careful author asks: if green space did not cause this difference, what else could have? Ferris considered three possibilities. First, families who value nature might choose to live near parks, and such families might also do other things that help their children's attention. Second, greener schools might differ in ways she had not measured, such as the quality of their teachers. Third, children at greener schools might simply spend more time outdoors, and the benefit might come from exercise rather than from nature itself.

She did not claim to rule out these explanations entirely. She argued, rather, that each was less likely given the evidence. The schools had been matched on income and parents' education, which would be expected to capture much of what distinguishes families who choose green neighborhoods. The effect was specific to attention, whereas better teaching would be expected to improve memory as well. And the effect was larger for children who lived as well as studied in green areas, which suggested that the amount of exposure mattered. Insofar as the evidence pointed in one direction, she concluded, the most likely explanation was that green space itself played a role, albeit a modest one.

Finally, she discussed implications. If her interpretation was right, planting trees and creating small parks near schools, particularly in poorer neighborhoods where green space was scarce, might be a modest but lasting way to support children's learning. She was careful to say "might". A policy, she wrote, should wait for experimental evidence, for example from cities that plant trees near some schools before others.

The language of a discussion deserves close reading. Notice the difference between "the findings show", "the findings suggest" and "the findings are consistent with". Each makes a claim of different strength. Ferris used "show" for what her data directly measured and "suggest" for what she inferred from them. A reader who notices these choices can tell where the author is reporting and where the author is arguing.`,
      [scholarly, paper, cohesion, academic(1), academic(2), academic(3)],
      [
        ask(
          t("Why does Ferris restate the main finding at the start of the discussion?", "费里斯为什么在讨论部分开头重述主要发现？"),
          t("As a courtesy to readers, many of whom will have skipped the results", "出于对读者的体谅，因为很多读者会跳过结果部分"),
          [
            t("Because the journal requires every section to begin that way", "因为期刊要求每个部分都这样开头"),
            t("Because she had changed the finding since the results", "因为她在写完结果后改变了发现"),
            t("To make the discussion longer", "为了让讨论部分更长"),
          ],
          t(
            "The passage says restating the finding at the start of the discussion is a courtesy to readers, many of whom will have skipped the results.",
            "文章说，在讨论开头重述发现是对读者的体谅，因为许多读者会跳过结果部分。",
          ),
        ),
        ask(
          t(
            "How did the finding about memory help Ferris argue against better teaching as an explanation?",
            "关于记忆力的发现怎样帮助费里斯反驳“教学更好”这一解释？",
          ),
          t("Better teaching should improve memory too, but only attention improved", "更好的教学应该也会提高记忆力，但只有注意力提高了"),
          [
            t("Teachers at greener schools were worse at teaching memory", "绿地多的学校的老师不擅长教记忆"),
            t("Memory cannot be improved by any kind of teaching", "任何教学都无法提高记忆力"),
            t("The memory test was too easy for all the children", "记忆测试对所有孩子来说都太简单"),
          ],
          t(
            "She argued the effect was specific to attention, whereas better teaching would be expected to improve memory as well.",
            "她认为效应只针对注意力，而如果是教学更好，记忆力也应该会提高。",
          ),
        ),
        ask(
          t('How did Ferris use "show" and "suggest" differently?', "费里斯怎样区别使用“表明”和“提示”？"),
          t(
            "She used show for what her data directly measured and suggest for what she inferred",
            "她用“表明”指数据直接测量的内容，用“提示”指她推断出的内容",
          ),
          [
            t("She used them as words with exactly the same meaning", "她把这两个词当作完全同义"),
            t("She used suggest only for findings from earlier studies", "她只在提到先前研究的发现时用“提示”"),
            t("She used show only for the limitations", "她只在讲局限时用“表明”"),
          ],
          t(
            'The last paragraph says Ferris used "show" for what her data directly measured and "suggest" for what she inferred from them.',
            "最后一段说，费里斯用“show”表示数据直接测量到的内容，用“suggest”表示由此推断的内容。",
          ),
        ),
      ],
      names,
    ),
    passage(
      "admitting-the-limitations",
      t("The Limitations", "局限"),
      `Near the end of almost every research paper is a passage that begins with a phrase such as "This study has several limitations." Students sometimes read it as a ritual of modesty, a few sentences of apology before the conclusion. In a good paper it is much more than that. It tells the reader exactly where the evidence stops, and therefore how far the conclusions can be trusted.

Ferris's limitations section was nearly a page long, and it repays close reading. She began with the most serious limitation: her study was observational, not experimental. She had compared schools that already differed in their surroundings, rather than changing the surroundings of some schools and not others. However carefully schools are matched, an observational study cannot rule out the possibility that some unmeasured difference explains the result. She stated this plainly and noted that it was the main reason her conclusions were phrased as suggestions rather than claims of cause.

The second limitation concerned the sample. Her study took place in a single city, with a particular climate and a particular kind of green space, mostly parks and lines of trees along streets. Whether the finding would hold in a city with a different climate, or in rural areas, was unknown. Moreover, the families who declined to take part had been slightly poorer than those who agreed, so the poorest children, who might benefit most, were somewhat underrepresented.

The third limitation concerned the measure. The computer task captured one kind of attention, the ability to respond to some signals and ignore others, measured in a quiet room over a few minutes. It did not capture attention in a noisy classroom over a whole lesson, which is what teachers actually care about. Ferris noted that the task was widely used and reliable, but she acknowledged that a reliable measure of something narrow is not the same as a measure of what matters most.

The fourth limitation concerned the measure of green space. Satellite images show how much land is covered by trees and grass, but not whether children can reach it, see it or use it. A park behind a locked fence and a park where children play every afternoon look the same from above. Hence the measure may have underestimated the effect of green space that children actually use, or overestimated the effect of green space they never visit.

Ferris ended the section by turning each limitation into a suggestion for future research: an experiment in which trees are planted near some schools first; studies in other cities and climates; measures of attention in real classrooms; and records of how children actually use the green space near them.

How should a reader use such a section? First, notice whether it is specific. A vague statement such as "further research is needed" tells the reader nothing; a precise statement of what was not measured tells the reader a great deal. Second, compare the limitations with the conclusions. If the conclusions claim more than the limitations allow, the paper has overreached. Ferris's conclusions were careful. Nonetheless, a newspaper article about her study, published a week later, announced that "trees make children smarter". The limitations section had said, in effect, that this was precisely the claim the study could not support.`,
      [scholarly, paper, cohesion, academic(1), academic(2)],
      [
        ask(
          t("What did Ferris identify as her most serious limitation?", "费里斯认为她研究中最严重的局限是什么？"),
          t(
            "The study was observational, so an unmeasured difference might explain the result",
            "这是一项观察性研究，未测量的差异可能解释了结果",
          ),
          [
            t("She tested too many children", "她测试的孩子太多"),
            t("The computer task was unreliable", "电脑任务不可靠"),
            t("The newspaper misreported her findings", "报纸误报了她的发现"),
          ],
          t(
            "She began with this: the study compared existing schools rather than changing surroundings, so it could not rule out some unmeasured difference.",
            "她首先指出这一点：研究比较的是现有学校，而没有改变环境，所以无法排除某种未测量的差异。",
          ),
        ),
        ask(
          t("What was the problem with measuring green space from satellite images?", "用卫星图像测量绿地有什么问题？"),
          t(
            "The images show how much land is green but not whether children reach or use it",
            "图像能显示有多少绿地，却显示不出孩子是否能到达或使用",
          ),
          [
            t("Satellite images are too expensive to buy", "卫星图像太贵买不起"),
            t("The images showed no trees at all", "图像上完全看不到树"),
            t("Satellites cannot see grass, only buildings", "卫星看不到草地，只能看到建筑"),
          ],
          t(
            "The passage says a park behind a locked fence and one where children play look the same from above.",
            "文章说，锁着门的公园和孩子们天天玩耍的公园从空中看是一样的。",
          ),
        ),
        ask(
          t('Why is the newspaper headline "trees make children smarter" a problem?', "报纸标题“树木让孩子更聪明”有什么问题？"),
          t(
            "It makes a claim of cause that the limitations said the study could not support",
            "它提出了因果结论，而局限部分恰恰说明研究无法支持这一点",
          ),
          [
            t("It reports the size of the effect too precisely", "它对效应大小的报道过于精确"),
            t("It repeats the paper's conclusions word for word", "它逐字重复了论文的结论"),
            t("It was published before the study began", "它在研究开始之前就发表了"),
          ],
          t(
            "The study was observational and measured attention, not intelligence; the limitations said this kind of causal claim was exactly what it could not support.",
            "这项研究是观察性的，测量的是注意力而不是智力；局限部分说明，这种因果结论正是研究无法支持的。",
          ),
        ),
      ],
      names,
    ),
    passage(
      "the-response-of-other-researchers",
      t("The Response of Other Researchers", "其他研究者的回应"),
      `A published paper is not the end of a study's life but the beginning of its public one. Once Ferris's paper appeared, it entered a conversation she could no longer control. Within two years it had been cited by dozens of other papers, criticized in a published commentary, tested in another city, and used, rather loosely, in a debate about the city budget. Following that response is the final step in understanding what a research paper contributes.

The first response came from Leah Moreau, a statistician, who published a short commentary in the same journal. Moreau did not dispute Ferris's honesty or her main analysis. She argued, however, that matching schools on neighborhood income was too crude. Two neighborhoods with the same average income could differ greatly, one containing a mix of rich and poor families, the other mostly middle-income families. She reanalyzed the data, which Ferris had made public, using a finer measure of income. The effect of green space remained, albeit about a third smaller than Ferris had reported.

Ferris replied in the same issue. She accepted Moreau's point about income and thanked her for the reanalysis, noting that this was precisely why she had shared her data. She argued, nonetheless, that a smaller effect was still a meaningful one, and that the reanalysis had confirmed the direction of the finding. This exchange, polite and specific, is a model of how scholarly disagreement should work. Each side stated its position, offered evidence, and conceded what the evidence required.

The second response was a replication. A team in another country, using Ferris's registered plan, repeated the study in a city with a colder climate. They found a similar pattern, but weaker, and only during the months when children spent time outdoors. This result both supported and complicated the original. It suggested that green space mattered, but only insofar as children were exposed to it, which was consistent with Ferris's own finding that children who lived in green neighborhoods benefited most.

The third response was an experiment. Encouraged by the two studies, the city of Eastfield agreed to plant trees around twenty schools over five years, choosing the order of schools at random so that researchers could compare those planted early with those planted later. This was the experiment Ferris had called for in her limitations section, and it would, for the first time, allow a claim about cause.

The fourth response was less helpful. In a debate about the city's budget, a politician cited Ferris's study as proof that cutting money for parks would "damage children's brains". Ferris wrote to the local newspaper to point out that her study had shown nothing of the kind.

This history illustrates how knowledge grows. No single paper settled the question. Ferris's study made a careful claim; a critic refined it; a replication tested its limits; an experiment set out to answer what an observational study could not. Each step depended on the one before it, and each was possible because Ferris had stated her methods clearly, shared her data and admitted her limitations. A student reading her original paper alone would learn something. A student who also read the response would learn how much more a field knows than any one of its papers.`,
      [scholarly, paper, cohesion, academic(1), academic(2), academic(3)],
      [
        ask(
          t("What was Moreau's criticism of Ferris's study?", "莫罗对费里斯的研究提出了什么批评？"),
          t("Matching schools on average neighborhood income was too crude", "按社区平均收入匹配学校的做法太粗糙"),
          [
            t("Ferris had invented her data", "费里斯编造了数据"),
            t("Green space has no effect on attention at all", "绿地对注意力完全没有影响"),
            t("The study should have been done in a colder city", "研究应该在更冷的城市进行"),
          ],
          t(
            "Moreau argued that two neighborhoods with the same average income could differ greatly, and reanalyzed the data with a finer measure.",
            "莫罗认为，平均收入相同的两个社区可能差别很大，于是用更精细的指标重新分析了数据。",
          ),
        ),
        ask(
          t("Why does the passage call the exchange between Ferris and Moreau a model?", "文章为什么称费里斯与莫罗之间的交流是一个典范？"),
          t(
            "Each side stated its position, offered evidence and conceded what the evidence required",
            "双方都陈述了立场、提供了证据，并承认了证据要求承认的东西",
          ),
          [
            t("Each side refused to accept any criticism", "双方都拒绝接受任何批评"),
            t("Moreau withdrew her commentary after Ferris replied", "费里斯回复后莫罗撤回了评论"),
            t("The journal decided which of them was right", "期刊裁定了谁是对的"),
          ],
          t(
            "The passage calls the exchange polite and specific: each stated a position, offered evidence and conceded what the evidence required.",
            "文章称这次交流礼貌而具体：双方陈述立场、提供证据，并承认证据所要求承认的内容。",
          ),
        ),
        ask(
          t("Why was the city's experiment important?", "市政府的实验为什么重要？"),
          t("Choosing the order of schools at random would allow a claim about cause", "随机决定学校的种树顺序，就能得出因果结论"),
          [
            t("It proved that the politician had been right", "它证明那位政治人物是对的"),
            t("It ended the need for any further research", "它使今后不再需要任何研究"),
            t("It was cheaper than Ferris's original study", "它比费里斯原来的研究便宜"),
          ],
          t(
            "The passage says the random order allowed comparison of schools planted early and later, which would for the first time allow a claim about cause.",
            "文章说，随机顺序可以比较先种树和后种树的学校，这将首次使因果结论成为可能。",
          ),
        ),
      ],
      names,
    ),
  ],
};
