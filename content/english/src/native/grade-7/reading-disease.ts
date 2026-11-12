// Grade 7: the reading unit of the fifth theme, infection and medicine, from the idea of bad air to vaccines,
// antibiotics and the evidence behind health claims.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grade-5/reading-kit.ts";

const infectionWords = { topic: "words-of-infection", weight: 0.3 } as const;
const medicineWords = { topic: "words-of-medicine", weight: 0.3 } as const;
const healthWords = { topic: "words-of-public-health", weight: 0.3 } as const;
const graphs = { topic: "reading-graphs-in-science", weight: 0.2 } as const;
const correlation = { topic: "correlation-or-cause", weight: 0.2 } as const;
const checking = { topic: "checking-a-claim-against-the-evidence", weight: 0.2 } as const;
const observation = { topic: "distinguishing-observation-and-inference", weight: 0.2 } as const;
const suffixes = { topic: "suffixes-of-science-and-medicine", weight: 0.1 } as const;
const academic1 = { topic: "academic-words-1", weight: 0.1 } as const;
const academic2 = { topic: "academic-words-2", weight: 0.1 } as const;
const academic3 = { topic: "academic-words-3", weight: 0.1 } as const;

/** theInvisibleEnemy is a reading unit of grade 7 on germs, the people who discovered how to fight them and the evidence they used. */
export const theInvisibleEnemy: ReadingUnitDef = {
  id: "the-invisible-enemy",
  title: t("The Invisible Enemy", "看不见的敌人"),
  passages: [
    passage(
      "the-trouble-with-bad-air",
      t("The Trouble with Bad Air", "“坏空气”的问题"),
      `For most of human history, no one knew what caused disease. People could see that illnesses spread, especially in crowded cities, but they could not see the cause. So they looked for explanations in what they could notice.

One of the most popular explanations was the miasma theory. Miasma is a Greek word meaning "pollution." According to this theory, diseases such as cholera and plague were caused by bad air, a poisonous vapor that rose from rotting garbage, dirty water and swamps. The idea seemed to fit the evidence. Diseases really were more common in places that smelled terrible, such as the crowded, filthy streets of poor neighborhoods.

The miasma theory led people to do some strange things. During outbreaks of plague, doctors wore masks shaped like long beaks, stuffed with sweet-smelling herbs, to protect themselves from the bad air. Towns burned fires in the streets to "cleanse" the air.

It also led to some helpful things, though for the wrong reasons. Believing that bad smells caused illness, cities in the 1800s began to build sewers, collect garbage and clean the streets. These changes really did reduce disease, not because they removed smells, but because they removed the germs that lived in filth and dirty water.

The miasma theory was eventually replaced by the germ theory: the idea that many diseases are caused by tiny living things, too small to see without a microscope, that pass from one person to another. But its story shows something important about science. A theory can seem to match the evidence and even lead to useful actions, and still be wrong about the cause.`,
      [infectionWords, healthWords, correlation, academic2, academic1],
      [
        ask(
          t("According to the miasma theory, what caused disease?", "根据瘴气说，疾病是由什么引起的？"),
          t("A poisonous vapor rising from rotting garbage, dirty water and swamps", "从腐烂垃圾、脏水和沼泽中升起的有毒气体"),
          [
            t("Tiny living things passed from person to person", "在人与人之间传播的微小生物"),
            t("Masks shaped like long beaks", "形似长喙的面具"),
            t("Sewers built under the streets", "修在街道下面的下水道"),
          ],
          t(
            "The second paragraph says the theory held that diseases were caused by bad air, a poisonous vapor that rose from rotting garbage, dirty water and swamps.",
            "第二段说这个理论认为疾病是由坏空气引起的，即从腐烂垃圾、脏水和沼泽中升起的有毒气体。",
          ),
        ),
        ask(
          t("Why did building sewers really reduce disease?", "修建下水道为什么真的减少了疾病？"),
          t("They removed the germs that lived in filth and dirty water", "它们清除了生活在污物和脏水中的病菌"),
          [
            t("They removed the bad smells that caused illness", "它们消除了致病的臭味"),
            t("They cleansed the air with fire", "它们用火净化了空气"),
            t("They filled the streets with sweet-smelling herbs", "它们让街道充满了芳香的草药"),
          ],
          t(
            "The fourth paragraph says the changes reduced disease not because they removed smells, but because they removed germs. The smell and the disease were linked, but the smell was not the cause.",
            "第四段说这些改变减少疾病不是因为消除了臭味，而是因为清除了病菌。臭味和疾病相互关联，但臭味不是原因。",
          ),
        ),
        ask(
          t("What lesson about science does the author draw from the miasma theory?", "作者从瘴气说中得出了什么关于科学的教训？"),
          t("A theory can match the evidence and still be wrong about the cause", "一个理论可以与证据相符，却仍在原因上出错"),
          [
            t("Theories that lead to useful actions are always right", "能带来有用行动的理论总是正确的"),
            t("Doctors should always wear masks", "医生应该一直戴口罩"),
            t("Bad smells are a sign of good health", "难闻的气味是健康的标志"),
          ],
          t(
            "The last sentence states it: a theory can seem to match the evidence and even lead to useful actions, and still be wrong about the cause.",
            "最后一句点明了这一点：一个理论可以看起来与证据相符，甚至带来有用的行动，却仍然在原因上出错。",
          ),
        ),
      ],
      ["Greek"],
      ["miasma"],
    ),
    passage(
      "the-doctor-who-asked-for-clean-hands",
      t("The Doctor Who Asked for Clean Hands", "要求洗手的医生"),
      `In the 1840s, the General Hospital of Vienna had two clinics where women came to give birth. In both clinics, many new mothers caught a terrible illness called childbed fever, and many of them died. But a young Hungarian doctor named Ignaz Semmelweis noticed something strange. The fever was far more deadly in the First Clinic than in the Second.

Semmelweis collected the numbers. In some years, about one mother in ten died in the First Clinic, while in the Second Clinic the rate was closer to one in twenty-five. Women knew the difference, too. Some begged to be admitted to the Second Clinic.

The two clinics were alike in many ways. So what was different? The First Clinic was run by doctors and medical students. The Second was run by midwives. And the doctors and students often came straight to the clinic from the room where they examined the bodies of patients who had died.

In 1847, a friend of Semmelweis cut his finger during one of these examinations and died of an illness much like childbed fever. Semmelweis made an inference: the doctors were carrying "particles" from the dead bodies on their hands to the mothers.

He ordered everyone in the First Clinic to wash their hands in a solution of chlorine before examining patients. Within months, the death rate fell sharply, to about the same level as the Second Clinic.

Many doctors refused to believe him. Semmelweis could not explain what the particles were, and some doctors were offended by the idea that they themselves spread disease. Only years after his death in 1865, when scientists proved that germs cause infection, was he recognized as a pioneer.`,
      [infectionWords, observation, graphs, academic2],
      [
        ask(
          t("What did Semmelweis observe before he made his inference?", "塞麦尔维斯在作出推断之前观察到了什么？"),
          t("The death rate was much higher in the First Clinic than in the Second", "第一诊室的死亡率远高于第二诊室"),
          [
            t("Particles from dead bodies were on the doctors' hands", "医生手上有来自尸体的微粒"),
            t("Germs caused childbed fever", "病菌导致产褥热"),
            t("Chlorine killed the particles", "氯杀死了这些微粒"),
          ],
          t(
            "The difference in death rates was an observation he could count. That particles were carried on the doctors' hands was his inference, an explanation he could not yet see.",
            "死亡率的差别是他能够统计的观察结果。微粒被医生的手带过去，则是他的推断，是一种他当时还看不见的解释。",
          ),
        ),
        ask(
          t("What was the key difference between the two clinics?", "两个诊室之间的关键区别是什么？"),
          t("Doctors in the First Clinic came straight from examining dead bodies", "第一诊室的医生检查完尸体后直接过来"),
          [
            t("The Second Clinic was much cleaner and newer", "第二诊室更干净、更新"),
            t("The First Clinic had more mothers", "第一诊室有更多的产妇"),
            t("The midwives washed their hands in chlorine", "助产士用氯水洗手"),
          ],
          t(
            "The third paragraph says the First Clinic was run by doctors and students, who often came straight from the room where they examined the bodies of patients who had died.",
            "第三段说第一诊室由医生和学生负责，他们常常直接从检查死者尸体的房间过来。",
          ),
        ),
        ask(
          t("What evidence supported Semmelweis's idea?", "什么证据支持了塞麦尔维斯的观点？"),
          t("After handwashing began, the death rate fell sharply", "开始洗手之后，死亡率急剧下降"),
          [
            t("Many doctors agreed with him at once", "许多医生立即赞同他"),
            t("He could explain exactly what the particles were", "他能准确解释这些微粒是什么"),
            t("Women begged to enter the First Clinic", "妇女们恳求进入第一诊室"),
          ],
          t(
            "The fifth paragraph says that within months of the chlorine handwashing, the death rate fell to about the level of the Second Clinic.",
            "第五段说用氯水洗手几个月之内，死亡率就降到了与第二诊室大致相同的水平。",
          ),
        ),
      ],
      ["Vienna", "Hungarian", "Ignaz", "Semmelweis", "Semmelweis's"],
    ),
    passage(
      "the-map-of-broad-street",
      t("The Map of Broad Street", "宽街地图"),
      `In late August of 1854, cholera struck the Soho district of London. Within ten days, more than five hundred people died. Most doctors blamed miasma, the bad air of the crowded neighborhood. But a doctor named John Snow suspected something else: the water.

Snow went door to door, asking which households had lost someone and where they got their water. Then he marked each death on a map of the streets. The marks formed a cluster around a single public water pump on Broad Street.

A cluster alone did not prove that the pump caused the disease. People who lived near the pump also breathed the same air. So Snow looked for cases that did not fit the pattern, because they could test his idea.

He found several. A workhouse near the pump held more than five hundred people, yet very few of them died. The workhouse had its own well. A brewery on Broad Street had seventy workers, and none died; they were given beer to drink and rarely used the pump. Meanwhile, a woman who lived far away died of cholera. Snow learned that she liked the taste of the Broad Street water so much that she had it brought to her house every day.

These cases pointed to the water, not the air. Snow presented his evidence to the local officials, and on September 8 they removed the handle of the pump. The outbreak was already declining by then, so the removal may not have ended it. But Snow's careful work helped convince people, slowly, that cholera spreads through dirty water. Later, it was discovered that a cesspool near the well had been leaking into it.`,
      [healthWords, correlation, infectionWords, academic2, academic1],
      [
        ask(
          t(
            "Why did the cluster of deaths around the pump not prove that the water caused cholera?",
            "为什么水泵周围的死亡聚集并不能证明是水导致了霍乱？",
          ),
          t("People near the pump also breathed the same air", "水泵附近的人也呼吸着同样的空气"),
          [
            t("The map was drawn incorrectly", "地图画错了"),
            t("Most people did not use the pump", "大多数人不用这个水泵"),
            t("The deaths happened in different years", "死亡发生在不同的年份"),
          ],
          t(
            "The third paragraph explains that a cluster alone did not prove the pump was the cause, because people who lived near it also breathed the same air.",
            "第三段解释说，单凭聚集不能证明水泵是原因，因为住在附近的人也呼吸着同样的空气。",
          ),
        ),
        ask(
          t("Why were the brewery workers important evidence?", "为什么酿酒厂的工人是重要的证据？"),
          t("They lived near the pump but rarely drank its water, and none died", "他们就在水泵附近，却很少喝它的水，没有一个人死亡"),
          [
            t("They drank the most water from the pump", "他们从水泵喝的水最多"),
            t("They helped Snow draw his map", "他们帮助斯诺画了地图"),
            t("They lived far away from Broad Street", "他们住得离宽街很远"),
          ],
          t(
            "The fourth paragraph says the brewery was on Broad Street, its workers drank beer and rarely used the pump, and none died. Same air, different water, different result.",
            "第四段说酿酒厂就在宽街上，工人们喝啤酒，很少用这个水泵，没有一个人死亡。同样的空气，不同的水，不同的结果。",
          ),
        ),
        ask(
          t("Why does the author say the removal of the handle may not have ended the outbreak?", "作者为什么说拆掉把手不一定终结了疫情？"),
          t("The outbreak was already declining before it was removed", "拆掉之前疫情已经在消退"),
          [
            t("People kept using the pump without a handle", "人们在没有把手的情况下继续用水泵"),
            t("The officials put the handle back the next day", "官员们第二天就把把手装了回去"),
            t("Cholera spreads through the air", "霍乱通过空气传播"),
          ],
          t(
            "The last paragraph says the outbreak was already declining by September 8, so the fall in deaths after the removal cannot be credited to it alone.",
            "最后一段说到9月8日疫情已经在消退，所以拆除之后死亡人数的下降不能完全归功于它。",
          ),
        ),
      ],
      ["Soho", "London", "John", "Snow", "Snow's", "Broad", "September", "August"],
      ["cesspool"],
    ),
    passage(
      "the-flask-with-a-swan-neck",
      t("The Flask with a Swan Neck", "鹅颈烧瓶"),
      `If you leave a bowl of soup on the table for a few days, it will turn cloudy and begin to smell. For centuries, many people believed that this happened through spontaneous generation: that tiny living things arose on their own from the soup itself.

In the early 1860s, the French scientist Louis Pasteur designed an experiment to test this idea. He suspected that the tiny living things did not come from the soup but from the air, carried on specks of dust.

Pasteur poured a nutrient broth into glass flasks. Then he heated the necks of the flasks and bent them into long S-shaped curves, like the neck of a swan. The ends of the necks were left open, so air could still reach the broth. Next, he boiled the broth to kill anything living in it.

The flasks sat for weeks, and the broth stayed clear. Air could travel through the curved necks, but dust and the microbes riding on it were trapped in the bend, where moisture collected. They never reached the broth.

Then Pasteur broke the neck off some of the flasks, or tilted them so the broth touched the dust in the curve. Within a day or two, the broth turned cloudy, full of growing microbes.

Pasteur concluded that the microbes came from the air, not from the broth. Life did not arise from nonliving matter; it came from other life. Some of the original flasks are still kept in Paris today, and the broth inside them is still clear.

His experiment helped support the germ theory of disease and led to many practical uses, including pasteurization, the heating of milk to kill harmful bacteria.`,
      [infectionWords, observation, suffixes],
      [
        ask(
          t("What is spontaneous generation?", "自然发生说是什么？"),
          t("The idea that living things arise on their own from nonliving matter", "认为生物可以从非生命物质中自行产生的观点"),
          [
            t("The heating of milk to kill bacteria", "加热牛奶以杀死细菌"),
            t("The bending of glass into a curve", "把玻璃弯成曲线"),
            t("The spread of microbes on dust", "微生物借尘埃传播"),
          ],
          t(
            "The first paragraph defines it: the belief that tiny living things arose on their own from the soup itself.",
            "第一段给出了定义：认为微小的生物会从汤本身自行产生。",
          ),
        ),
        ask(
          t("Why did the broth in the swan-neck flasks stay clear?", "为什么鹅颈烧瓶里的肉汤保持清澈？"),
          t("Dust and microbes were trapped in the bend before reaching it", "灰尘和微生物在到达肉汤之前被困在弯曲处"),
          [
            t("No air could reach the broth", "空气无法到达肉汤"),
            t("The broth was too hot for microbes", "肉汤太热，微生物无法生存"),
            t("Pasteur added chlorine to the broth", "巴斯德往肉汤里加了氯"),
          ],
          t(
            "The fourth paragraph says air could travel through the curved necks, but dust and the microbes riding on it were trapped in the bend and never reached the broth.",
            "第四段说空气可以通过弯曲的瓶颈，但灰尘及其携带的微生物被困在弯曲处，始终没有到达肉汤。",
          ),
        ),
        ask(
          t("Which statement is Pasteur's inference rather than an observation?", "哪一句是巴斯德的推断而不是观察？"),
          t("The microbes came from the air, not from the broth", "微生物来自空气，而不是来自肉汤"),
          [
            t("The broth in the unbroken flasks stayed clear", "未破损烧瓶中的肉汤保持清澈"),
            t("The broth turned cloudy after the neck was broken", "瓶颈折断后肉汤变浑浊了"),
            t("Moisture collected in the bend of the neck", "水汽聚集在瓶颈的弯曲处"),
          ],
          t(
            "Clear and cloudy broth and moisture in the bend are things he could see. That the microbes came from the air is the conclusion he drew from those observations.",
            "清澈或浑浊的肉汤、弯曲处的水汽都是他能看到的。微生物来自空气，是他根据这些观察得出的结论。",
          ),
        ),
      ],
      ["Louis", "Pasteur", "French", "Paris"],
    ),
    passage(
      "the-milkmaid-and-the-cowpox",
      t("The Milkmaid and the Cowpox", "挤奶女工和牛痘"),
      `For centuries, smallpox was one of the most feared diseases in the world. It caused high fever and painful blisters that covered the body, and it killed about three in every ten people who caught it. Many survivors were left with deep scars or were blinded.

In the English countryside, people had long noticed something curious. Milkmaids, the women who milked cows, rarely caught smallpox. Many of them had caught cowpox, a mild disease of cows that caused a few sores on the hands. A country doctor named Edward Jenner wondered whether catching cowpox protected a person from smallpox.

In 1796, Jenner tested his idea. A milkmaid named Sarah Nelmes had fresh cowpox sores. Jenner took material from one of her sores and scratched it into the arm of an eight-year-old boy named James Phipps. The boy developed a mild fever and a small sore, then recovered.

Several weeks later, Jenner did something that would never be allowed today. He exposed James to material from a smallpox sore. James did not get sick. Jenner repeated the test with other people and published his results.

Jenner called his method vaccination, from vacca, the Latin word for cow. The idea spread quickly across Europe and beyond, and over the next century, vaccination saved millions of lives.

In the 1960s and 1970s, the World Health Organization led a worldwide effort to vaccinate people wherever smallpox still appeared. In 1980, it announced that smallpox had been eradicated. It was the first human disease ever wiped out completely, and it began with a question about milkmaids.`,
      [medicineWords, healthWords, observation, academic2, academic3],
      [
        ask(
          t("What observation led Jenner to his question?", "什么观察让詹纳提出了他的问题？"),
          t("Milkmaids who had caught cowpox rarely caught smallpox", "得过牛痘的挤奶女工很少得天花"),
          [
            t("Smallpox killed three in every ten people", "天花导致十分之三的感染者死亡"),
            t("Cows often died of smallpox", "奶牛经常死于天花"),
            t("Boys were more likely to catch cowpox", "男孩更容易得牛痘"),
          ],
          t(
            "The second paragraph says people had noticed that milkmaids rarely caught smallpox, and many had caught cowpox, so Jenner wondered whether cowpox protected them.",
            "第二段说人们注意到挤奶女工很少得天花，而她们中很多人得过牛痘，所以詹纳想知道牛痘是否保护了她们。",
          ),
        ),
        ask(
          t("Why does the author say Jenner's test would never be allowed today?", "作者为什么说詹纳的试验在今天绝不会被允许？"),
          t("He deliberately exposed a child to a deadly disease", "他故意让一个孩子接触致命疾病"),
          [
            t("He used material from a milkmaid's hand", "他用了挤奶女工手上的物质"),
            t("He published his results", "他发表了他的结果"),
            t("He tested his idea on more than one person", "他在不止一个人身上测试了他的想法"),
          ],
          t(
            "The fourth paragraph says he exposed James, an eight-year-old, to material from a smallpox sore. Exposing a child to a disease that killed three in ten would be far too dangerous today.",
            "第四段说他让八岁的詹姆斯接触了天花脓疮的物质。让孩子接触一种致死率达十分之三的疾病，在今天是极其危险的。",
          ),
        ),
        ask(
          t("Where does the word vaccination come from?", "vaccination 这个词来自哪里？"),
          t("From vacca, the Latin word for cow", "来自拉丁语中表示奶牛的 vacca"),
          [
            t("From the name of a milkmaid", "来自一位挤奶女工的名字"),
            t("From the World Health Organization", "来自世界卫生组织"),
            t("From a Greek word for fever", "来自希腊语中表示发烧的词"),
          ],
          t(
            "The fifth paragraph says Jenner called his method vaccination, from vacca, the Latin word for cow.",
            "第五段说詹纳把他的方法称为 vaccination，来自拉丁语中表示奶牛的 vacca。",
          ),
        ),
      ],
      [
        "Edward",
        "Jenner",
        "Jenner's",
        "Sarah",
        "Nelmes",
        "James",
        "Phipps",
        "Latin",
        "Europe",
        "World",
        "Health",
        "Organization",
        "English",
      ],
      ["milkmaids", "milkmaid's"],
    ),
    passage(
      "a-lucky-mold",
      t("A Lucky Mold", "幸运的霉菌"),
      `In September 1928, a Scottish scientist named Alexander Fleming returned to his laboratory in London after a summer holiday. Before leaving, he had left a stack of glass dishes on his bench, each one coated with a jelly on which colonies of bacteria were growing.

As he sorted through them, Fleming noticed something odd about one dish. A blue-green mold had grown on it, probably from a spore that had drifted in through a window or from another lab. Around the mold was a clear ring where the bacteria had died. Farther away, the bacteria were growing normally.

Fleming could have thrown the dish away. Instead, he asked why. He grew the mold, a kind called Penicillium, and found that it produced a substance that killed many kinds of harmful bacteria. He named the substance penicillin.

But Fleming could not make enough of it to treat patients, and it was difficult to purify. For about ten years, penicillin remained a laboratory curiosity.

Then, around 1940, a team at the University of Oxford led by Howard Florey and Ernst Chain found ways to purify and test it. In 1941, they treated a police officer who was dying of an infection. He began to recover, but the team ran out of penicillin and he died. The lesson was clear: they needed far more.

During the Second World War, companies in the United States developed ways to grow huge amounts of the mold in tanks. By 1944, there was enough penicillin to treat many wounded soldiers.

In 1945, Fleming, Florey and Chain shared the Nobel Prize. Fleming's luck had mattered, but so had his curiosity, and the long work of others.`,
      [medicineWords, infectionWords, observation],
      [
        ask(
          t("What did Fleming notice about the dish?", "弗莱明注意到这个培养皿有什么异常？"),
          t("There was a clear ring with no bacteria around the mold", "霉菌周围有一圈没有细菌的透明区域"),
          [
            t("All the bacteria in the dish had died", "培养皿里所有的细菌都死了"),
            t("The mold had killed the jelly", "霉菌毁掉了培养基"),
            t("The bacteria were growing on the mold", "细菌长在霉菌上"),
          ],
          t(
            "The second paragraph says there was a clear ring around the mold where the bacteria had died, while farther away the bacteria grew normally.",
            "第二段说霉菌周围有一圈细菌死亡的透明区域，而更远处的细菌生长正常。",
          ),
        ),
        ask(
          t("Why did penicillin remain a laboratory curiosity for about ten years?", "为什么青霉素大约十年里一直只是实验室里的稀奇之物？"),
          t("Fleming could not make enough or purify it", "弗莱明无法大量生产或提纯它"),
          [
            t("It did not kill any bacteria", "它不能杀死任何细菌"),
            t("Fleming threw the dish away", "弗莱明把培养皿扔了"),
            t("Doctors were not allowed to use it", "医生不被允许使用它"),
          ],
          t(
            "The fourth paragraph says Fleming could not make enough of it to treat patients, and it was difficult to purify.",
            "第四段说弗莱明无法制造足够的量来治疗病人，而且它很难提纯。",
          ),
        ),
        ask(
          t("What does the last sentence suggest about the discovery of penicillin?", "最后一句话暗示了青霉素的发现有什么特点？"),
          t("It needed luck, curiosity and the work of many people", "它需要运气、好奇心和许多人的工作"),
          [
            t("Fleming deserved all the credit alone", "所有功劳都应归于弗莱明一人"),
            t("It was found only by luck", "它完全是靠运气发现的"),
            t("Florey and Chain discovered the mold first", "弗洛里和钱恩最先发现了霉菌"),
          ],
          t(
            "The last sentence says Fleming's luck mattered, but so did his curiosity and the long work of others, such as Florey, Chain and the companies that grew the mold.",
            "最后一句说弗莱明的运气很重要，但他的好奇心和其他人长期的工作同样重要，比如弗洛里、钱恩和大量培养霉菌的公司。",
          ),
        ),
      ],
      [
        "Scottish",
        "Alexander",
        "Fleming",
        "Fleming's",
        "London",
        "Penicillium",
        "Oxford",
        "Howard",
        "Florey",
        "Ernst",
        "Chain",
        "Nobel",
        "Prize",
        "United",
        "States",
        "Second",
        "World",
        "War",
        "September",
        "University",
      ],
    ),
    passage(
      "when-the-medicine-stops-working",
      t("When the Medicine Stops Working", "当药物失效时"),
      `Antibiotics such as penicillin changed medicine. Infections that had once killed people, such as infected wounds and pneumonia, could suddenly be cured in days. But almost as soon as antibiotics were in use, scientists noticed a problem: some bacteria were no longer killed by them.

To understand why, imagine a large group of bacteria infecting a person. Just by chance, a few of them have a small difference, a change in their genes, that lets them survive the antibiotic. When the person takes the medicine, most of the bacteria die, but those few survive. They multiply, and soon the infection is caused by bacteria that the antibiotic cannot kill. The bacteria have become resistant.

This is natural selection, the same process that shapes all living things. But people speed it up. Every time an antibiotic is used, it gives resistant bacteria a chance to take over. Antibiotics are sometimes used when they cannot help, such as for colds and flu, which are caused by viruses, not bacteria. They are also given in large amounts to farm animals to make them grow faster.

Patients can make the problem worse, too. If someone stops taking an antibiotic as soon as they feel better, the toughest bacteria may survive and spread.

Alexander Fleming warned about this danger in 1945, in his speech when he received the Nobel Prize. Today, health experts call antibiotic resistance one of the greatest threats to public health. Some infections can no longer be treated by the usual medicines.

Scientists are searching for new antibiotics, but the most powerful tool may be simpler: using the antibiotics we have only when they are truly needed.`,
      [medicineWords, healthWords, correlation, academic2],
      [
        ask(
          t("Why do a few bacteria survive an antibiotic?", "为什么少数细菌能在抗生素中存活？"),
          t("By chance, they have a change in their genes that protects them", "它们碰巧有一种基因变化保护了它们"),
          [
            t("They hide inside viruses", "它们躲在病毒里面"),
            t("The patient took too much medicine", "病人吃了太多药"),
            t("They are the largest bacteria in the group", "它们是群体中最大的细菌"),
          ],
          t(
            "The second paragraph says that just by chance, a few bacteria have a change in their genes that lets them survive the antibiotic.",
            "第二段说，纯属偶然，少数细菌的基因发生了变化，使它们能在抗生素中存活。",
          ),
        ),
        ask(
          t("Why is taking an antibiotic for a cold not helpful?", "为什么因感冒而服用抗生素没有帮助？"),
          t("Colds are caused by viruses, which antibiotics do not kill", "感冒是由病毒引起的，抗生素杀不死病毒"),
          [
            t("Colds are caused by resistant bacteria", "感冒是由耐药细菌引起的"),
            t("Antibiotics only work on farm animals", "抗生素只对农场动物有效"),
            t("Colds go away before the medicine works", "感冒在药物起效之前就好了"),
          ],
          t(
            "The third paragraph says antibiotics are sometimes used when they cannot help, such as for colds and flu, which are caused by viruses, not bacteria.",
            "第三段说抗生素有时被用在无效的场合，比如感冒和流感，它们是由病毒而不是细菌引起的。",
          ),
        ),
        ask(
          t("What does the author suggest may be the most powerful tool against resistance?", "作者认为对抗耐药性最有力的工具可能是什么？"),
          t("Using antibiotics only when they are truly needed", "只在真正需要时使用抗生素"),
          [
            t("Giving more antibiotics to farm animals", "给农场动物使用更多抗生素"),
            t("Stopping antibiotics as soon as you feel better", "一感觉好转就停用抗生素"),
            t("Waiting for Fleming's warning to come true", "等待弗莱明的警告应验"),
          ],
          t(
            "The last paragraph says that while scientists search for new antibiotics, the most powerful tool may be using the ones we have only when truly needed.",
            "最后一段说，在科学家寻找新抗生素的同时，最有力的工具可能是只在真正需要时使用现有的抗生素。",
          ),
        ),
      ],
      ["Alexander", "Fleming", "Nobel", "Prize"],
    ),
    passage(
      "can-vitamin-c-stop-a-cold",
      t("Can Vitamin C Stop a Cold?", "维生素C能预防感冒吗？"),
      `Many people believe that taking extra vitamin C every day will keep them from catching colds. The idea became popular in the 1970s, when a famous chemist named Linus Pauling wrote a best-selling book recommending large daily doses. Pauling had won two Nobel Prizes, so many readers trusted him. But was he right?

A famous name is not evidence. To test the claim, scientists ran many controlled studies. In a typical study, volunteers are divided into two groups by chance. One group takes vitamin C every day, and the other takes a pill that looks the same but contains no vitamin, called a placebo. Neither the volunteers nor the researchers know who is taking which, so their expectations cannot affect the results. Then the researchers count how many colds each group catches and how long they last.

Over the years, researchers have gathered the results of dozens of such studies, involving many thousands of people. When the results are combined, they show that for most people, taking vitamin C every day does not reduce the number of colds they catch. The two groups catch about the same number.

The studies did find two smaller effects. People who took vitamin C regularly had colds that ended slightly sooner, by less than a day on average for adults. And among people under heavy physical stress, such as marathon runners and soldiers training in very cold places, vitamin C did seem to cut the number of colds.

So the popular claim is mostly not supported. Vitamin C will not stop most people from catching a cold, though it may shorten one a little. The best evidence came not from a famous name but from careful comparisons.`,
      [checking, healthWords, medicineWords, academic1, academic2],
      [
        ask(
          t("Why did many readers trust Pauling's claim?", "为什么许多读者相信鲍林的说法？"),
          t("He was a famous chemist who had won two Nobel Prizes", "他是获得过两次诺贝尔奖的著名化学家"),
          [
            t("Controlled studies had proved him right", "对照研究证明他是对的"),
            t("He had tested vitamin C on marathon runners", "他在马拉松运动员身上测试过维生素C"),
            t("He took a placebo every day", "他每天服用安慰剂"),
          ],
          t(
            "The first paragraph says Pauling had won two Nobel Prizes, so many readers trusted him. The second paragraph points out that a famous name is not evidence.",
            "第一段说鲍林获得过两次诺贝尔奖，所以许多读者相信他。第二段指出，名气不是证据。",
          ),
        ),
        ask(
          t(
            "Why do neither the volunteers nor the researchers know who takes the placebo?",
            "为什么志愿者和研究人员都不知道谁在服用安慰剂？",
          ),
          t("So their expectations cannot affect the results", "这样他们的预期就不会影响结果"),
          [
            t("So the volunteers will catch more colds", "这样志愿者会得更多感冒"),
            t("Because the pills look different", "因为药片看起来不一样"),
            t("Because the study has no second group", "因为这项研究没有第二组"),
          ],
          t(
            "The second paragraph says neither group knows who is taking which, so their expectations cannot affect the results.",
            "第二段说双方都不知道谁吃的是哪种药，这样他们的预期就不会影响结果。",
          ),
        ),
        ask(
          t(
            "What does the evidence show about the claim that vitamin C keeps people from catching colds?",
            "关于维生素C能让人不感冒的说法，证据说明了什么？",
          ),
          t("For most people it does not, though it may shorten a cold a little", "对大多数人来说并非如此，不过它可能让感冒稍短一点"),
          [
            t("It is completely true for everyone", "它对每个人都完全正确"),
            t("Vitamin C makes colds last longer", "维生素C让感冒持续得更久"),
            t("No studies have ever tested it", "从来没有研究测试过它"),
          ],
          t(
            "The third and fourth paragraphs say the combined studies show no drop in the number of colds for most people, but colds ended slightly sooner. The last paragraph sums up: the claim is mostly not supported.",
            "第三、四段说综合研究显示对大多数人来说感冒次数没有减少，但感冒结束得稍早一些。最后一段总结说：这一说法基本得不到支持。",
          ),
        ),
      ],
      ["Linus", "Pauling", "Pauling's", "Nobel", "Prizes"],
      ["placebo"],
    ),
  ],
};
