// College writing: the reading unit of the first theme, academic prose: eight original passages in the manner of
// journal articles, each asking a question, answering earlier work and weighing its own evidence.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grades-6-8/reading-kit.ts";

const discourse = { topic: "words-of-academic-discourse", weight: 0.3 } as const;
const moves = { topic: "reading-academic-arguments", weight: 0.3 } as const;
const hedging = { topic: "hedging-and-qualification", weight: 0.1 } as const;

/** academic gives the edge to a batch of the shared academic words, which a passage uses as it goes. */
const academic = (n: 1 | 2 | 3) => ({ topic: `academic-words-${n}`, weight: 0.1 }) as const;

/** academicProse is a reading unit of the college writing course in the manner of journal articles. */
export const academicProse: ReadingUnitDef = {
  id: "academic-prose",
  title: t("Academic Prose", "学术文章"),
  passages: [
    passage(
      "spacing-and-memory",
      t("Spacing and Memory", "间隔与记忆"),
      `Most students prepare for an examination in the same way: they study hard the night before. A large body of research suggests that this is one of the least efficient ways to learn. The present study asks a narrower question. If a student has a fixed amount of time to study, does it matter how that time is divided?

The phenomenon at issue is known as the spacing effect. Since the late nineteenth century, researchers have observed that material studied in several short sessions, separated by gaps, is remembered better than the same material studied in one long session. Most of this work, however, has been carried out in laboratories, with lists of unrelated words and tests given a few minutes or hours later. Critics contend that such conditions tell us little about real classrooms, where students learn connected ideas and are tested weeks later. Our study was designed to address that critique.

We worked with 240 students in eight secondary schools, all taking the same course in biology. Each student studied a unit on the human heart for a total of three hours. Half the students, chosen at random, studied for three hours on a single day. The other half studied for one hour on each of three days, a week apart. All students then took the same test one month later, with questions about both facts and ideas.

Students in the spaced group scored, on average, 14 points higher out of 100 than students in the single-session group. The difference was larger for questions that asked students to explain how the heart works than for questions that asked them to recall names of its parts. Students in the single-session group, interestingly, had predicted that they would do better.

This last result deserves comment. When students study for a long time in one session, the material feels familiar by the end, and that feeling is easily mistaken for learning. Spaced study feels harder, because each session begins with the discomfort of having forgotten part of what was learned before. Several earlier studies have reported the same pattern: learners tend to prefer the method that feels easier, even when it produces worse results. If this is true more generally, it may explain why so many students continue to study the night before an examination, even after they have been told that it does not work well. It also suggests that simply informing students about the spacing effect may not be enough to change how they study.

These findings suggest that the spacing effect is not merely a curiosity of the laboratory. It appears to hold for connected material, in real schools, over a realistic delay. One possible explanation is that each new session forces the learner to retrieve what was partly forgotten, and that this effort strengthens memory. Our design, however, cannot show which explanation is correct, and it has other limitations. All the schools were in one region, and the material came from a single subject. It is possible that spacing helps less with skills such as writing, which develop more slowly.

The practical implication is nonetheless clear. Teachers and students who have limited time may be able to learn more simply by dividing it differently. The assumption that a long, concentrated session is the most serious way to study deserves to be questioned.`,
      [discourse, moves, hedging, academic(2), academic(3)],
      [
        ask(
          t("What question does this study ask?", "这项研究提出了什么问题？"),
          t(
            "Whether dividing a fixed amount of study time into several sessions affects how much is remembered",
            "把固定的学习时间分成几次是否会影响记住的内容",
          ),
          [
            t("Whether students should study more hours in total", "学生是否应该学习更多的总时数"),
            t("Whether biology is harder than other school subjects", "生物是否比其他学科更难"),
            t("Whether students can predict their own test scores", "学生能否预测自己的考试成绩"),
          ],
          t(
            "The first paragraph states it: with a fixed amount of time, does it matter how the time is divided?",
            "第一段就说明了：在时间固定的情况下，时间怎样分配是否有影响？",
          ),
        ),
        ask(
          t("Which criticism of earlier research does the study set out to answer?", "这项研究要回应对已有研究的哪一种批评？"),
          t(
            "That laboratory tests with word lists and short delays tell us little about real classrooms",
            "用单词表和短时间间隔做的实验室测试很难说明真实课堂的情况",
          ),
          [
            t("That earlier studies used too many students", "已有研究使用的学生太多"),
            t("That the spacing effect was discovered too recently", "间隔效应发现得太晚"),
            t("That teachers refused to take part in research", "教师拒绝参与研究"),
          ],
          t(
            "Critics contend that lists of unrelated words and tests a few hours later do not reflect classrooms; the study was designed to address that critique.",
            "批评者认为，不相关的单词表和几小时后的测试不能反映课堂情况；这项研究就是为回应这种批评而设计的。",
          ),
        ),
        ask(
          t("Which limitation do the authors themselves admit?", "作者自己承认了哪一项局限？"),
          t("All the schools were in one region and the material came from one subject", "所有学校都在同一地区，学习材料只来自一个学科"),
          [
            t("The students were not chosen at random", "学生不是随机分组的"),
            t("The test was given too soon after studying", "测试离学习的时间太近"),
            t("The spaced group studied for more hours in total", "间隔组的总学习时间更长"),
          ],
          t(
            "The authors note that the schools were in one region and the material came from a single subject, so the effect may differ for other skills.",
            "作者指出学校都在同一地区、材料只来自一个学科，因此对其他技能而言效果可能不同。",
          ),
        ),
      ],
    ),
    passage(
      "the-minimum-wage-and-young-workers",
      t("The Minimum Wage and Young Workers", "最低工资与年轻劳动者"),
      `Few questions in economics have been argued as long, or as fiercely, as whether a minimum wage costs jobs. The traditional framework is simple. If the price of something rises, people buy less of it; if the price of labor rises, employers will hire fewer workers. On this view, a law that raises the lowest wages helps those who keep their jobs but harms those who lose them, and the harm falls hardest on the young and the unskilled.

For several decades, this premise was accepted by most economists. In the 1990s, however, a series of studies challenged it. Researchers compared restaurants on either side of a border between two regions, one of which had raised its minimum wage. If the traditional view were correct, jobs should have fallen on the side where wages rose. In many such comparisons, they did not fall, or fell only slightly. These results provoked a long debate about methods, and the debate continues.

The present article contributes to that debate by examining a case that earlier studies had not considered: a rise that was large, not modest. In 2019, one region increased its minimum wage by 25 percent over two years, while a neighboring region with a similar economy made no change. We collected records of employment and hours for workers under 25 in shops, restaurants and hotels in both regions from 2017 to 2022.

Our central finding is that the number of jobs for young workers fell by about 4 percent more in the region that raised its wage than in its neighbor. This effect is larger than most studies of modest increases have found. A second finding may be more important. Among young workers who kept their jobs, average weekly hours fell by about 3 hours, so that many earned only slightly more each week than before, despite the higher hourly wage.

We contend that these results help to reconcile the two sides of the debate. Modest increases may cost few jobs because employers can absorb them, for example by raising prices slightly or accepting smaller profits. Larger increases, by contrast, appear to push employers toward other responses, including cutting hours and hiring fewer people. The question, then, is not whether a minimum wage costs jobs, but at what level and in what form the costs appear.

Several limitations should be noted. Two regions, however similar, are never identical, and part of the difference we observe may reflect changes in tourism, which affected hotels in one region more than the other. Our records also cannot tell us what happened to workers who left employment: some may have returned to school, which would be a different outcome from unemployment.

The implication for policy is cautious. A higher minimum wage remains one of the few tools that directly raises the pay of the lowest-paid workers. Our findings suggest, however, that its benefits depend on its size, and that studies which count only jobs, and not hours, may give an incomplete picture of its effects. Future research should measure both, and should follow workers over several years rather than a few months.`,
      [discourse, moves, hedging, academic(1), academic(2), academic(3)],
      [
        ask(
          t(
            "According to the traditional framework, why would a minimum wage cost jobs?",
            "按照传统的分析框架，最低工资为什么会造成失业？",
          ),
          t("If the price of labor rises, employers will hire fewer workers", "如果劳动力的价格上涨，雇主就会雇用更少的工人"),
          [
            t("Because young workers prefer to stay in school", "因为年轻工人更愿意留在学校"),
            t("Because restaurants are always near borders", "因为餐馆总是在边界附近"),
            t("Because prices never change when wages rise", "因为工资上涨时价格从不变化"),
          ],
          t(
            "The first paragraph explains it: when the price of something rises, people buy less of it, and labor is no exception.",
            "第一段解释了这一点：一样东西的价格上涨，人们就会少买，劳动力也不例外。",
          ),
        ),
        ask(
          t("What new case does this article examine?", "这篇文章研究了什么新的情况？"),
          t("A large increase of 25 percent, rather than a modest one", "一次幅度达25%的大幅上涨，而不是小幅上涨"),
          [
            t("A region that lowered its minimum wage", "一个降低了最低工资的地区"),
            t("Workers over the age of 65", "65岁以上的工人"),
            t("A country with no minimum wage at all", "一个完全没有最低工资的国家"),
          ],
          t(
            "The authors say earlier studies had not considered a rise that was large, not modest, and they study a 25 percent increase.",
            "作者说已有研究没有考虑过大幅而非小幅的上涨，于是他们研究了一次25%的上涨。",
          ),
        ),
        ask(
          t("How do the authors use their findings to answer the earlier debate?", "作者怎样用自己的发现回应先前的争论？"),
          t(
            "They argue that small rises cost few jobs, while large rises lead employers to cut jobs and hours",
            "他们认为小幅上涨造成的失业很少，而大幅上涨会使雇主削减岗位和工时",
          ),
          [
            t("They show that earlier studies were dishonest", "他们证明已有研究不诚实"),
            t("They prove that a minimum wage never costs jobs", "他们证明最低工资从不造成失业"),
            t("They argue that hours do not matter to workers", "他们认为工时对工人无关紧要"),
          ],
          t(
            "They contend that the results reconcile the two sides: the costs depend on the size of the rise and may appear as fewer hours.",
            "他们认为这些结果调和了双方：代价取决于上涨的幅度，还可能表现为工时减少。",
          ),
        ),
      ],
    ),
    passage(
      "a-debate-among-historians",
      t("A Debate Among Historians", "历史学家之间的争论"),
      `In the summer of 1788, the town of Marrow, a small port on the northern coast, was nearly destroyed by fire. More than two hundred houses burned, and the town's records describe weeks of hunger that followed. For most of the following two centuries, the fire was remembered as an accident: a spark from a baker's oven, carried by a strong wind. In the past thirty years, however, the fire has become the subject of a lively debate, and the debate reveals a good deal about how historians work.

The first challenge came from a historian who noticed something odd in the town's tax records. In the year before the fire, a group of merchants had tried, and failed, to buy the land along the harbor, where poorer families lived in crowded wooden houses. Within a year of the fire, the same merchants had bought most of that land at low prices and built warehouses on it. The historian contended that the fire may have been set deliberately, to clear the harbor for trade.

This argument was widely discussed, partly because it changed the meaning of the event. An accident is a misfortune; a fire set for profit is a crime, and it turns the story of Marrow into a story about power and class. Critics, however, pointed out that the evidence was entirely indirect. No document recorded an accusation of arson at the time. The merchants' purchase of the land, they argued, was exactly what one would expect after any fire, deliberate or not: burned land is cheap, and people with money buy cheap land.

A second line of research looked at a different kind of evidence. Using letters and diaries, another historian reconstructed the weather on the day of the fire. The summer had been unusually dry, and several letters mention a powerful wind from the southwest that afternoon. A fire starting near the bakery, which lay to the southwest of the harbor, would have been carried directly toward the wooden houses. This finding does not disprove the arson theory, but it shows that an accident could easily have produced the destruction that occurred.

The most recent contribution takes a third approach. Rather than asking what caused the fire, it asks why people at the time believed what they did. It shows that rumors of arson did circulate in 1788, but only among the poor families who lost their homes, and that they were never written down by the town's officials, who were themselves connected to the merchants. The absence of an accusation in the records, on this view, may tell us more about who kept the records than about what happened.

The debate has not been resolved, and it may never be. What it illustrates is that historical evidence rarely speaks for itself. Every source was produced by someone, for some purpose, and the silences in an archive can be as meaningful as its contents. Historians who disagree about Marrow are not simply disagreeing about facts; they are disagreeing about which evidence to trust, and why. That is a question every reader of history must answer too.`,
      [discourse, moves, hedging, academic(1), academic(2), academic(3)],
      [
        ask(
          t(
            "What evidence led the first historian to suggest that the fire was set deliberately?",
            "第一位历史学家根据什么证据提出火灾是有人故意放的？",
          ),
          t(
            "Merchants who had failed to buy the harbor land bought most of it cheaply soon after the fire",
            "曾经没能买下港口土地的商人在火灾后不久就低价买下了其中大部分",
          ),
          [
            t("A letter in which a merchant confessed to starting the fire", "一封商人承认纵火的信"),
            t("A record of a trial for arson in 1788", "1788年一次纵火案审判的记录"),
            t("Reports that the baker had left the town", "面包师离开了小镇的报道"),
          ],
          t(
            "The historian noticed in the tax records that the merchants bought the land at low prices within a year of the fire.",
            "这位历史学家在税务记录中发现，商人们在火灾后一年内就低价买下了这片土地。",
          ),
        ),
        ask(
          t("What did the study of the weather show?", "对天气的研究说明了什么？"),
          t(
            "That an accident could easily have caused the destruction, though arson is not ruled out",
            "意外完全可能造成这样的破坏，不过纵火的可能也没有被排除",
          ),
          [
            t("That the fire must have been set deliberately", "火一定是有人故意放的"),
            t("That there was no wind on the day of the fire", "火灾当天没有风"),
            t("That the merchants' warehouses caused the fire", "商人的仓库引起了火灾"),
          ],
          t(
            "A dry summer and a strong southwest wind would have carried a fire from the bakery to the houses; the passage says this does not disprove arson.",
            "干燥的夏天和强劲的西南风会把火从面包房带到房屋；文章说这并不能否定纵火说。",
          ),
        ),
        ask(
          t("What is the main point of the final paragraph?", "最后一段的主要观点是什么？"),
          t(
            "Historians disagree about which evidence to trust, because every source was made by someone for a purpose",
            "历史学家对该相信哪些证据存在分歧，因为每一份资料都是某人出于某种目的留下的",
          ),
          [
            t("The fire of 1788 was certainly an accident", "1788年的火灾肯定是意外"),
            t("Historians should stop studying events with little evidence", "历史学家不应再研究证据很少的事件"),
            t("Archives always record everything that happened", "档案总是记录了发生的一切"),
          ],
          t(
            "It says evidence rarely speaks for itself and that the silences in an archive can be as meaningful as its contents.",
            "它说证据很少能不言自明，档案中的空白和其中的内容一样意味深长。",
          ),
        ),
      ],
      ["Marrow"],
    ),
    passage(
      "how-children-learn-grammar",
      t("How Children Learn Grammar", "儿童怎样学会语法"),
      `By the age of four, most children speak in long, correct sentences, although no one has taught them the rules of grammar. How they manage this is one of the oldest questions in the study of language, and two broad answers have dominated the discussion.

The first answer holds that children are born with a framework for language already in place. On this view, the input children hear is too limited and too messy to explain how quickly they learn. Adults speak in fragments, make mistakes, and rarely correct their children's grammar. Yet children everywhere acquire the basic structures of their language in a similar order and at a similar age. Supporters of this view contend that this could happen only if the mind already contains some general principles that all human languages share.

The second answer places much more weight on experience. It argues that children are powerful learners of patterns, and that the language they hear is richer than the first view assumes. Children hear millions of words in their first years, and the same structures are repeated again and again. A child who hears "the dog is running," "the cat is sleeping" and "the baby is crying" may gradually notice a pattern and begin to use it with new words.

One of the most useful kinds of evidence in this debate comes from children's errors. A child who says "I goed to the park" or "two mouses" has never heard an adult say these words. The errors show that the child is not simply copying but applying a rule, in this case the regular rule for the past tense or the plural, to words that are exceptions. Both sides accept this evidence, but they interpret it differently. For the first view, such errors reveal the mind's built-in tendency to form rules. For the second, they show that children have extracted a pattern from the language around them and are applying it too widely.

The present study approached the question by recording the speech of 30 families at home, one hour each week, from the time each child was eighteen months old until the age of three. We counted how often each child heard particular structures and compared this with the age at which each child began to use them. Children who heard a structure more often tended to use it earlier. The relationship was strongest for structures that are common in everyday speech and weakest for rare ones.

These results are consistent with the view that experience plays a large role in learning grammar. They do not, however, rule out the existence of a built-in framework. A child might need both: an inborn readiness to look for certain kinds of patterns, and plenty of examples from which to learn them. Indeed, many researchers now believe that the old opposition between nature and experience is too simple. The more productive question may be how the two work together, and which parts of grammar depend more on one than on the other. Answering it will require studies that follow the same children over many years.`,
      [discourse, moves, hedging, academic(1), academic(2), academic(3)],
      [
        ask(
          t("What do supporters of the first view argue?", "第一种观点的支持者主张什么？"),
          t(
            "That children are born with general principles of language, because what they hear is too limited",
            "儿童生来就具有语言的一般原则，因为他们听到的语言太有限",
          ),
          [
            t("That children learn grammar mainly from being corrected", "儿童主要通过被纠正来学习语法"),
            t("That adults always speak in complete, correct sentences", "成年人总是说完整、正确的句子"),
            t("That children learn languages in different orders", "儿童学习语言的顺序各不相同"),
          ],
          t(
            "They say input is too limited and messy, yet children learn in a similar order everywhere, so the mind must contain shared principles.",
            "他们说语言输入太有限、太杂乱，而各地儿童却以相似的顺序习得语言，所以头脑中一定有共通的原则。",
          ),
        ),
        ask(
          t('Why are errors such as "I goed" useful evidence?', "为什么像 “I goed” 这样的错误是有用的证据？"),
          t("They show the child is applying a rule rather than copying what adults say", "它们表明儿童是在运用规则，而不是模仿成年人的话"),
          [
            t("They prove that children never hear the past tense", "它们证明儿童从未听过过去时"),
            t("They show that parents teach their children incorrect grammar", "它们表明父母教给孩子错误的语法"),
            t("They show that children cannot learn irregular words", "它们表明儿童学不会不规则的词"),
          ],
          t(
            "No adult says these words, so the child must be using the regular rule on an exception.",
            "没有成年人会这样说，所以儿童一定是把规则用在了例外的词上。",
          ),
        ),
        ask(
          t("How do the authors interpret their own results?", "作者怎样解释自己的研究结果？"),
          t(
            "As consistent with a large role for experience, without ruling out a built-in framework",
            "认为结果与经验起重要作用的观点相符，但并不排除先天框架的存在",
          ),
          [
            t("As proof that grammar is entirely inborn", "认为这证明语法完全是天生的"),
            t("As proof that experience explains everything", "认为这证明经验能解释一切"),
            t("As evidence that rare structures are learned first", "认为这证明罕见的结构最先被学会"),
          ],
          t(
            "They write that the results are consistent with experience mattering but do not rule out a framework; a child may need both.",
            "他们写道，结果与经验很重要的观点相符，但并不排除先天框架；儿童可能两者都需要。",
          ),
        ),
      ],
    ),
    passage(
      "birds-in-the-city",
      t("Birds in the City", "城市里的鸟"),
      `Cities are among the newest environments on Earth, and the animals that live in them face conditions that their ancestors never met: noise, artificial light, glass, traffic, and food left by people. Birds have proved especially interesting to researchers, because many species have moved into cities only recently and because their songs and habits are relatively easy to observe. The question this article examines is whether city birds are simply tolerating these conditions or changing in response to them.

A large body of research has focused on song. In many species, birds in cities sing at a higher pitch than birds of the same species in forests. A common explanation is that traffic noise is mostly low in pitch, so a higher song is easier to hear above it. Some studies have also found that city birds sing louder, or sing more at night, when traffic is quieter. These changes appear to help birds communicate, but it is not always clear whether they are learned by individual birds or inherited across generations.

Fewer studies have looked at behavior other than song. Our research focused on boldness: how close a bird allows a person to approach before it flies away. We measured this distance for blackbirds in the center of three large cities and in forests nearby, approaching more than 600 birds in total. On average, city birds allowed a person to come within about four meters, while forest birds flew away at about twelve.

There are at least two possible explanations for this difference. One is that individual birds in cities learn, through experience, that people are rarely dangerous. The other is that city populations have changed over generations, because bolder birds were more likely to survive and breed in places full of people. These explanations are not mutually exclusive, and our data cannot distinguish between them on their own.

To address this question, we raised young birds from city and forest nests under identical conditions in a research center, so that none had experience of either environment. Even under these conditions, the birds from city nests were somewhat bolder than those from forest nests, although the difference was smaller than in the wild. This suggests that part of the difference is inherited and part is learned. We cannot yet say how large each part is, and the answer may differ from one city to another. A study that followed the same city population over many generations would be needed to settle the question, and such a study would take decades.

Our findings add to a growing body of evidence that cities are not only a challenge for wildlife but also a force that shapes it. They also raise a broader question. If animals can change in a few decades in response to cities, our assumption that evolution is always a slow process may need to be revised. At the same time, we should be careful not to overstate the case. Our study examined one species and one behavior, and boldness may bring costs as well as benefits, such as a greater risk from cats and cars.`,
      [discourse, moves, hedging, academic(1), academic(2), academic(3)],
      [
        ask(
          t("Why might city birds sing at a higher pitch?", "城市里的鸟为什么可能用更高的音调歌唱？"),
          t("Traffic noise is mostly low, so a higher song is easier to hear", "交通噪音大多是低音，所以高音的歌声更容易被听到"),
          [
            t("Higher songs attract more food from people", "高音的歌声能从人那里吸引更多食物"),
            t("City birds are smaller than forest birds", "城市里的鸟比森林里的鸟小"),
            t("Artificial light changes the shape of their throats", "人造光改变了它们喉咙的形状"),
          ],
          t(
            "The passage gives this as the common explanation: low traffic noise would cover a low song.",
            "文章给出了这个常见解释：低沉的交通噪音会掩盖低音的歌声。",
          ),
        ),
        ask(
          t("Why did the researchers raise young birds in a research center?", "研究者为什么在研究中心饲养幼鸟？"),
          t("To tell whether boldness is learned from experience or inherited", "为了区分大胆的性格是从经验中学来的还是遗传的"),
          [
            t("To protect the birds from cats and cars", "为了保护鸟免受猫和汽车的伤害"),
            t("To teach the birds to sing at a higher pitch", "为了教鸟用更高的音调歌唱"),
            t("To count how many birds lived in each city", "为了统计每座城市里有多少鸟"),
          ],
          t(
            "Raising birds under identical conditions removes experience, so any remaining difference must be inherited.",
            "在相同条件下饲养幼鸟排除了经验的作用，所以剩下的差异一定来自遗传。",
          ),
        ),
        ask(
          t("Which statement shows the authors hedging their conclusion?", "哪一句话表明作者在谨慎地限定自己的结论？"),
          t(
            "They note that they studied one species and one behavior, and that boldness may have costs",
            "他们指出只研究了一个物种和一种行为，而且大胆可能也有代价",
          ),
          [
            t("They say cities are among the newest environments on Earth", "他们说城市是地球上最新的环境之一"),
            t("They say city birds came within about four meters", "他们说城市里的鸟让人走近到大约四米"),
            t("They say forest birds flew away at about twelve meters", "他们说森林里的鸟在大约十二米处飞走"),
          ],
          t(
            "The last sentences warn against overstating the case by naming the study's narrow scope and possible costs.",
            "最后几句通过指出研究范围狭窄和可能的代价，提醒不要夸大结论。",
          ),
        ),
      ],
    ),
    passage(
      "teenagers-and-social-media",
      t("Teenagers and Social Media", "青少年与社交媒体"),
      `Public discussion of teenagers and social media is often alarmed. News stories regularly report that young people who spend hours on their phones are more anxious, more lonely and less happy than earlier generations. Some writers have gone further, contending that social media is the main cause of a rise in mental health problems among teenagers in many countries. This article examines the evidence for that claim and argues that it is weaker, and more complicated, than the public discussion suggests.

It is important to begin with what is not in dispute. In many countries, the share of teenagers who report feeling anxious or depressed has risen over the past fifteen years, and this rise roughly coincides with the spread of smartphones. Most studies also find that teenagers who use social media heavily report somewhat lower well-being, on average, than those who use it lightly.

The difficulty lies in interpreting these findings. First, most studies measure use and well-being at a single point in time. They can show that the two go together, but not which comes first. It is plausible that heavy use makes teenagers unhappy; it is equally plausible that unhappy teenagers turn to their phones for distraction or company. Second, the size of the relationship is usually small. In several large surveys, the link between screen time and well-being is about as strong as the link between well-being and eating potatoes, a comparison that suggests caution about strong claims.

Third, "social media use" is not one thing. Sending messages to close friends, scrolling through images of celebrities, and arguing with strangers are very different activities, and there is growing evidence that they have different effects. Studies that measure only the number of hours may hide these differences. A teenager who spends two hours a day talking with friends online may be doing something quite different from one who spends the same time comparing her life with the lives of others.

A smaller number of studies have followed the same teenagers over several years. Their results are mixed. Some find that heavy use predicts slightly lower well-being later; others find the reverse, or no relationship at all. A few experiments, in which adults were asked to stop using social media for a period, have found small improvements in mood, but it is not clear whether the same would be true of teenagers, or whether the effect would last.

None of this means that social media is harmless. For some teenagers, particularly those who are already vulnerable, certain kinds of use may be genuinely damaging. But the evidence does not yet support the claim that social media is the main cause of a general decline in teenagers' mental health. Other factors, such as pressure at school, economic insecurity, and changes in how often young people see friends in person, deserve attention too.

The implication for research is that future studies should measure what teenagers actually do online, not only how long they do it, and should follow them over time. The implication for parents and teachers is perhaps more modest: rather than counting hours, it may be more useful to ask young people what they do on their phones, and how it makes them feel.`,
      [discourse, moves, hedging, academic(1), academic(2), academic(3)],
      [
        ask(
          t("What claim does the article set out to examine?", "这篇文章要检验的是什么说法？"),
          t(
            "That social media is the main cause of rising mental health problems among teenagers",
            "社交媒体是青少年心理健康问题增多的主要原因",
          ),
          [
            t("That teenagers today own fewer phones than before", "如今青少年拥有的手机比以前少"),
            t("That teenagers never feel anxious", "青少年从不感到焦虑"),
            t("That adults use social media more than teenagers", "成年人比青少年更多地使用社交媒体"),
          ],
          t(
            "The first paragraph names this claim and says the article argues that the evidence for it is weaker than the public discussion suggests.",
            "第一段点明了这一说法，并说文章将论证支持它的证据比公众讨论所暗示的要弱。",
          ),
        ),
        ask(
          t("Why does the author mention eating potatoes?", "作者为什么提到吃土豆？"),
          t("To show that the link between screen time and well-being is very small", "为了说明屏幕时间与幸福感之间的关联非常小"),
          [
            t("To recommend a healthier diet for teenagers", "为了推荐青少年更健康的饮食"),
            t("To prove that potatoes cause unhappiness", "为了证明土豆导致不快乐"),
            t("To show that teenagers eat while using their phones", "为了说明青少年边用手机边吃东西"),
          ],
          t(
            "The comparison shows that the relationship is about as weak as one no one takes seriously, which suggests caution about strong claims.",
            "这个比较表明，这种关联就像一个没人当真的关联那样微弱，所以对强烈的说法要谨慎。",
          ),
        ),
        ask(
          t(
            "What problem do studies that measure use and well-being at one point in time have?",
            "在同一时间点测量使用情况和幸福感的研究有什么问题？",
          ),
          t(
            "They cannot show whether heavy use causes unhappiness or unhappiness leads to heavy use",
            "它们无法说明是大量使用导致不快乐，还是不快乐导致大量使用",
          ),
          [
            t("They always include too few teenagers", "它们包含的青少年总是太少"),
            t("They only study adults", "它们只研究成年人"),
            t("They measure the kind of use but not the hours", "它们只测量使用类型而不测量时长"),
          ],
          t("Such studies show that the two go together, but not which comes first.", "这样的研究能说明两者同时出现，却不能说明哪个在先。"),
        ),
      ],
    ),
    passage(
      "the-problem-of-free-will",
      t("The Problem of Free Will", "自由意志问题"),
      `When we make a choice, it usually feels as though we could have chosen otherwise. You decided to read this article, but it seems that you could have decided to do something else. This experience is so familiar that it is easy to overlook how puzzling it is. The problem of free will asks whether that feeling is accurate, and the question has occupied philosophers for more than two thousand years.

The difficulty can be stated simply. Most of us accept that every event in the physical world has causes, and that those causes have causes of their own, stretching back long before we were born. Our brains are physical objects, and our decisions are events in our brains. If every decision is the result of earlier causes, including our genes, our upbringing and the state of our brain a moment before, then it seems that no decision could have turned out differently. And if no decision could have turned out differently, in what sense are we free?

Philosophers have responded to this argument in three main ways. The first response accepts the premise that everything is caused and concludes that free will is an illusion. On this view, our sense that we could have done otherwise is a feeling produced by the brain, not an accurate picture of how decisions are made. Some who hold this view argue that we should rethink practices, such as punishment, that assume people deserve blame.

The second response rejects the premise. It holds that at least some human decisions are not fully determined by earlier causes. Some writers have pointed to physics, which suggests that some events at a very small scale are a matter of chance. Critics reply that this does not help: a decision that happens by chance is no more free than one that was determined, since in neither case is it under our control.

The third response, which is probably the most widely held among philosophers today, argues that the problem rests on a mistaken idea of freedom. On this view, being free does not mean that our choices have no causes. It means that they are caused in the right way: by our own reasons, desires and values, rather than by force or by a condition that prevents us from thinking clearly. A person who hands over money because a robber is pointing a gun at her is not free; a person who gives money to a charity because she values its work is free, even though her values themselves have causes.

Critics of this third response contend that it changes the subject. They argue that what people care about, when they ask whether they are free, is precisely whether they could have done otherwise, and that this response simply defines that question away. Its defenders reply that the ordinary idea of freedom, the one we use when we praise and blame each other, has never required anything more.

The debate continues, and recent work in psychology and brain science has given it new energy. What is clear is that the question is not merely academic. How we answer it shapes how we think about responsibility, punishment and what it means to be a person. Each reader, in the end, must decide which answer seems most convincing.`,
      [discourse, moves, hedging, academic(1), academic(2), academic(3)],
      [
        ask(
          t("What premise leads to the problem of free will?", "哪一个前提引出了自由意志问题？"),
          t(
            "That every event, including every decision, is the result of earlier causes",
            "每一个事件，包括每一个决定，都是先前原因的结果",
          ),
          [
            t("That people never feel they could have chosen otherwise", "人们从不觉得自己本可以作出别的选择"),
            t("That philosophers have only recently studied choice", "哲学家直到最近才研究选择"),
            t("That brains are not physical objects", "大脑不是物理实体"),
          ],
          t(
            "The second paragraph states it: if every decision has earlier causes, it seems no decision could have turned out differently.",
            "第二段说明了这一点：如果每个决定都有先前的原因，似乎没有哪个决定能有不同的结果。",
          ),
        ),
        ask(
          t("Why do critics say that chance does not save free will?", "为什么批评者说偶然性救不了自由意志？"),
          t(
            "A decision that happens by chance is no more under our control than one that was determined",
            "偶然发生的决定和被决定的决定一样，都不在我们的控制之下",
          ),
          [
            t("Because physics has proved that nothing happens by chance", "因为物理学已经证明没有什么是偶然发生的"),
            t("Because chance only affects large objects", "因为偶然性只影响大的物体"),
            t("Because people always make decisions slowly", "因为人们总是缓慢地作决定"),
          ],
          t(
            "The passage says that in neither case, chance or determination, is the decision under our control.",
            "文章说，无论是偶然还是被决定，决定都不在我们的控制之下。",
          ),
        ),
        ask(
          t("According to the third response, what makes a choice free?", "按照第三种回应，什么使一个选择是自由的？"),
          t("Being caused by the person's own reasons and values, not by force", "由这个人自己的理由和价值观而不是强迫所引起"),
          [
            t("Having no causes at all", "完全没有原因"),
            t("Being made by chance", "出于偶然"),
            t("Being made very quickly", "作出得非常快"),
          ],
          t(
            "The third response says freedom means being caused in the right way, by our own reasons, desires and values.",
            "第三种回应说，自由意味着以正确的方式被引起，即由我们自己的理由、欲望和价值观引起。",
          ),
        ),
      ],
    ),
    passage(
      "a-language-that-is-dying",
      t("A Language That Is Dying", "一种正在消亡的语言"),
      `Of the roughly seven thousand languages spoken in the world today, about half are expected to have no speakers by the end of this century. Most of these languages are spoken by small communities, often in remote places, and many have never been written down. When the last speaker of such a language dies, a whole way of describing the world disappears with them. This article describes one such language, Tolo, and asks what can be learned from its decline.

Tolo is spoken by about 300 people in three villages in a mountain valley. Almost all fluent speakers are over sixty. Their children understand the language but rarely speak it, and their grandchildren, in most cases, neither speak nor understand it. Within a single lifetime, the language has gone from being the ordinary speech of the valley to being the language of the old.

Earlier accounts of language loss have often emphasized pressure from outside: governments that banned minority languages in schools, or punished children for speaking them. Such pressure was real in many places, and it did exist in the valley in the first half of the twentieth century. But it does not fully explain what happened to Tolo, because the decline accelerated after the pressure had ended, when the government had begun to tolerate, and even to celebrate, the language.

Our interviews with residents of all ages point to a different explanation. Young people described Tolo with affection, and very few said they were ashamed of it. Their reason for not speaking it was practical. The regional language was the language of school, of work in the towns, of television and of the internet. Tolo, as one young woman put it, was "the language of the kitchen." Parents, wanting their children to succeed, spoke to them in the regional language, and Tolo gradually ceased to be passed on.

This finding has important implications. If a language declines mainly because of punishment and shame, then removing those pressures may allow it to recover. If it declines because it has no use outside the home, then tolerance is not enough. The language must gain a role in the places where young people actually spend their lives. In other parts of the world, communities have tried to create such roles through schools that teach in the minority language, radio stations, written literature and, more recently, the internet. The results have been mixed, but some languages that were close to disappearing now have a growing number of young speakers.

Our study has clear limits. It is based on three villages, and the experience of Tolo may not be typical. We also relied on an interpreter for some of our interviews with older speakers, which may have reduced the detail of their accounts.

Nonetheless, the case of Tolo suggests that the survival of a language depends less on whether people value it than on whether they need it. That is a sobering conclusion for those who hope to save endangered languages, but it also points to where efforts should be directed. A language that is needed at school and at work has a far better chance of being passed on.`,
      [discourse, moves, hedging, academic(1), academic(2)],
      [
        ask(
          t(
            "Why does the article say that outside pressure does not fully explain the decline of Tolo?",
            "文章为什么说外部压力不能完全解释托罗语的衰落？",
          ),
          t("The decline grew faster after the pressure had ended", "压力结束之后，衰落反而加快了"),
          [
            t("No government ever tried to ban the language", "从来没有政府试图禁止这种语言"),
            t("Young people said they were ashamed of the language", "年轻人说他们为这种语言感到羞耻"),
            t("Tolo has always been a written language", "托罗语一直是一种书面语言"),
          ],
          t(
            "The passage says the decline accelerated when the government had begun to tolerate and even celebrate the language.",
            "文章说，在政府开始容忍甚至颂扬这种语言之后，衰落反而加快了。",
          ),
        ),
        ask(
          t('What does the phrase "the language of the kitchen" suggest about Tolo?', "“厨房里的语言”这个说法说明了托罗语的什么情况？"),
          t("It is used only at home and has no role in school, work or the internet", "它只在家里使用，在学校、工作或网络上没有用处"),
          [
            t("It has many words for food and cooking", "它有很多关于食物和烹饪的词"),
            t("Young people are ashamed to speak it in public", "年轻人羞于在公开场合说它"),
            t("It is spoken mainly by cooks", "它主要由厨师使用"),
          ],
          t(
            "The young woman means that Tolo belongs to home life, while the regional language is needed everywhere else.",
            "这位年轻女子的意思是，托罗语属于家庭生活，而其他所有场合都需要地区通用语。",
          ),
        ),
        ask(
          t("What is the article's main conclusion?", "文章的主要结论是什么？"),
          t(
            "A language survives less because people value it than because they need it",
            "一种语言能否存续，与其说取决于人们是否珍视它，不如说取决于人们是否需要它",
          ),
          [
            t("Tolo will certainly disappear within ten years", "托罗语肯定会在十年内消失"),
            t("Governments are the only cause of language loss", "政府是语言消亡的唯一原因"),
            t("Small languages cannot be saved by any means", "小语种无论如何都救不回来"),
          ],
          t(
            "The last paragraph states this conclusion and says it points to where efforts to save languages should be directed.",
            "最后一段陈述了这一结论，并说它指明了拯救语言的努力应该朝向哪里。",
          ),
        ),
      ],
      ["Tolo"],
    ),
  ],
};
