// Grade 7: the reading unit of the eighth theme, rights and reform, from the vote for women and the Salt March to
// the speeches and the evidence that moved people to change their laws.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grade-5/reading-kit.ts";

const rightsWords = { topic: "words-of-rights-and-equality", weight: 0.3 } as const;
const protestWords = { topic: "words-of-protest-and-reform", weight: 0.3 } as const;
const speechWords = { topic: "words-of-speeches", weight: 0.3 } as const;
const evidence = { topic: "relevant-and-sufficient-evidence", weight: 0.2 } as const;
const speaker = { topic: "how-a-speaker-builds-an-argument", weight: 0.2 } as const;
const loaded = { topic: "loaded-language", weight: 0.2 } as const;
const latin5 = { topic: "latin-roots-5", weight: 0.1 } as const;
const academic1 = { topic: "academic-words-1", weight: 0.1 } as const;
const academic3 = { topic: "academic-words-3", weight: 0.1 } as const;

/** voicesForChange is a reading unit of grade 7 on rights, the people who struggled for them and the words they used. */
export const voicesForChange: ReadingUnitDef = {
  id: "voices-for-change",
  title: t("Voices for Change", "变革之声"),
  passages: [
    passage(
      "rights-for-everyone-everywhere",
      t("Rights for Everyone, Everywhere", "人人享有、处处适用的权利"),
      `The Second World War ended in 1945, leaving tens of millions of people dead and much of the world in ruins. Many of the war's worst horrors had been committed by governments against their own people. Leaders around the world asked how such things could be prevented. One answer was to write down, for the first time, a list of rights that belong to every human being, whatever country they live in.

The task was given to a committee of the newly formed United Nations. It was led by Eleanor Roosevelt, the widow of the American president Franklin Roosevelt, and its members came from many countries, including China, Lebanon, France and Chile. They held very different beliefs about religion, government and the economy. For two years, they argued over every word.

On December 10, 1948, the United Nations adopted the Universal Declaration of Human Rights. Its first article states that all human beings are born free and equal in dignity and rights. Its thirty articles include the right to life, liberty and safety; freedom from slavery and torture; equality before the law; freedom of thought, religion and expression; and the right to education and to work.

The Declaration is not a law. No court can punish a country for breaking it. Some critics said that made it nothing more than a list of fine words. But it became a standard that people everywhere could use to measure their governments. It has been translated into more than five hundred languages, and many countries have used it as a model when writing their own constitutions.

Every year, December 10 is celebrated as Human Rights Day.`,
      [rightsWords, latin5],
      [
        ask(
          t("Why did leaders decide to write a list of human rights after the war?", "为什么领导人在战后决定写一份人权清单？"),
          t("To help prevent governments from committing such horrors again", "为了防止政府再次犯下这样的暴行"),
          [
            t("To punish the countries that had lost the war", "为了惩罚战败国"),
            t("To choose a new leader for the United Nations", "为了选出联合国的新领导人"),
            t("To replace the laws of every country", "为了取代每个国家的法律"),
          ],
          t(
            "The first paragraph says many horrors had been committed by governments against their own people, and leaders asked how such things could be prevented.",
            "第一段说许多暴行是政府对本国人民犯下的，领导人们思考如何防止这类事情发生。",
          ),
          [
            t("Punishing the losers is never the aim given.", "文中从没说目的是惩罚战败国。"),
            t("The committee had a leader already; it wrote rights.", "委员会已有主席，任务是写权利。"),
            t("It is not a law and replaced none.", "它不是法律，也没有取代任何法律。"),
          ],
        ),
        ask(
          t("Why did the committee argue over every word for two years?", "为什么委员会花了两年时间字斟句酌地争论？"),
          t("Its members held very different beliefs", "委员们的信仰差异很大"),
          [
            t("Eleanor Roosevelt did not speak their languages", "埃莉诺·罗斯福不会说他们的语言"),
            t("No one wanted to write about rights", "没有人想写关于权利的内容"),
            t("The war was still being fought", "战争仍在进行"),
          ],
          t(
            "The second paragraph says the members came from many countries and held very different beliefs about religion, government and the economy.",
            "第二段说委员们来自许多国家，在宗教、政府和经济方面的信仰差异很大。",
          ),
          [
            t("Language is never named as the problem.", "文中从没说语言是问题。"),
            t("They did want to write it; they argued about wording.", "他们愿意写，只是在措辞上争论。"),
            t("The war had ended in 1945.", "战争在 1945 年已经结束。"),
          ],
        ),
        ask(
          t(
            "How does the author answer the critics who called the Declaration only fine words?",
            "作者如何回应那些说《宣言》只是漂亮话的批评者？",
          ),
          t("It became a standard used to measure governments and a model for constitutions", "它成了衡量政府的标准和制定宪法的范本"),
          [
            t("Courts can punish countries that break it", "法院可以惩罚违反它的国家"),
            t("It was written by a single famous person", "它是由一位名人独自写成的"),
            t("It contains only one article", "它只有一条"),
          ],
          t(
            "The fourth paragraph admits it is not a law, but says it became a standard people could use to measure governments, and many countries used it as a model for their constitutions.",
            "第四段承认它不是法律，但说它成为人们衡量政府的标准，许多国家以它为范本制定宪法。",
          ),
          [
            t("No court can punish a country for breaking it.", "没有法院能因违反它而惩罚国家。"),
            t("A whole committee wrote it.", "它是整个委员会写的。"),
            t("It has thirty articles.", "它有三十条。"),
          ],
        ),
        ask(
          t("Who led the committee that wrote the Declaration?", "谁领导了起草《世界人权宣言》的委员会？"),
          t("Eleanor Roosevelt", "埃莉诺·罗斯福"),
          [t("Franklin Roosevelt", "富兰克林·罗斯福"), t("Kate Sheppard", "凯特·谢泼德"), t("Mohandas Gandhi", "甘地")],
          t(
            "The committee was led by Eleanor Roosevelt, the widow of President Franklin Roosevelt.",
            "委员会由罗斯福总统的遗孀埃莉诺·罗斯福领导。",
          ),
          [
            t("Franklin Roosevelt was her late husband.", "富兰克林·罗斯福是她已故的丈夫。"),
            t("Kate Sheppard led women in New Zealand.", "凯特·谢泼德领导的是新西兰的妇女。"),
            t("Gandhi led the Salt March.", "甘地领导的是食盐进军。"),
          ],
        ),
      ],
      [
        "Second",
        "World",
        "War",
        "United",
        "Nations",
        "Eleanor",
        "Franklin",
        "Roosevelt",
        "American",
        "China",
        "Lebanon",
        "France",
        "Chile",
        "December",
        "Universal",
        "Declaration",
        "Human",
        "Rights",
        "Day",
      ],
    ),
    passage(
      "the-petition-that-filled-a-hall",
      t("The Petition That Filled a Hall", "铺满大厅的请愿书"),
      `In the 1880s, women in New Zealand could own property, pay taxes and run businesses, but they could not vote. A group of women, led by a writer and organizer named Kate Sheppard, set out to change that.

Their main tool was the petition, a written request to the government signed by as many people as possible. Women went door to door in towns and on farms, collecting signatures. They held meetings, wrote letters to newspapers and printed leaflets explaining their arguments. Women paid taxes and obeyed the laws, they said, so they should have a say in making them.

The first petitions were rejected by Parliament. The women did not give up. Each year, they collected more signatures. In 1893, they presented their largest petition yet. It was signed by about twenty-four thousand women, nearly a quarter of the adult women in the country. The sheets were glued together into a single roll more than two hundred and seventy meters long. When it was delivered to Parliament, it was unrolled across the floor of the debating chamber.

Opponents argued that women belonged at home and that politics would harm them. Some tried to delay the vote with tricks. But the size of the petition was hard to ignore. In September 1893, a new law was passed, and New Zealand became the first self-governing country in the world in which all women had the right to vote in national elections.

Two months later, women voted for the first time. Kate Sheppard's face now appears on New Zealand's ten-dollar note, a reminder that a roll of paper, carried door to door, can change a nation.`,
      [protestWords, rightsWords, evidence],
      [
        ask(
          t("What was the women's main argument for the vote?", "妇女争取选举权的主要论点是什么？"),
          t("Women paid taxes and obeyed the laws, so they should help make them", "妇女纳税、守法，所以应该参与制定法律"),
          [
            t("Women already ran Parliament", "妇女已经掌管议会"),
            t("Politics would harm women", "政治会伤害妇女"),
            t("Women belonged at home", "妇女应该待在家里"),
          ],
          t(
            "The second paragraph gives their argument: women paid taxes and obeyed the laws, so they should have a say in making them. The other options are what opponents said, or not in the passage.",
            "第二段给出了她们的论点：妇女纳税、守法，所以应该在立法中有发言权。其他选项是反对者的说法，或文中没有提及。",
          ),
          [
            t("Women could not even vote, let alone run Parliament.", "女性连投票权都没有，更别说掌管议会。"),
            t("Politics harming women was the opponents' argument.", "政治会伤害女性是反对者的说法。"),
            t("Belonging at home was also the opponents' argument.", "女性属于家庭也是反对者的说法。"),
          ],
        ),
        ask(
          t("Why was the 1893 petition hard to ignore?", "为什么1893年的请愿书让人难以忽视？"),
          t("It was signed by nearly a quarter of the country's adult women", "它由全国近四分之一的成年女性签名"),
          [
            t("It was written by members of Parliament", "它是由议员写的"),
            t("It was printed in every newspaper", "它刊登在每份报纸上"),
            t("It was the first petition ever sent", "它是有史以来第一份请愿书"),
          ],
          t(
            "The third paragraph says about twenty-four thousand women signed, nearly a quarter of the adult women, and the roll stretched more than two hundred and seventy meters.",
            "第三段说大约两万四千名妇女签了名，接近成年女性的四分之一，纸卷长达两百七十多米。",
          ),
          [
            t("Women signed it, not members of Parliament.", "签名的是女性，不是议员。"),
            t("Newspapers printed letters, not the petition.", "报纸刊登的是来信，不是请愿书。"),
            t("The first petitions had been rejected earlier.", "最早的请愿书早已被驳回。"),
          ],
        ),
        ask(
          t("Why does the author describe the petition being unrolled across the floor?", "作者为什么描写请愿书铺满地板的情景？"),
          t("To make its great size, and the support behind it, easy to picture", "为了让人容易想象它的巨大篇幅及其背后的支持"),
          [
            t("To show that Parliament was too small", "为了说明议会太小"),
            t("To explain how petitions are glued", "为了解释请愿书是怎样粘起来的"),
            t("To prove that the opponents had tricked the women", "为了证明反对者欺骗了妇女"),
          ],
          t(
            "A roll stretched across the debating chamber turns a number into an image: lawmakers could literally see the support they were being asked to answer.",
            "铺满辩论厅的纸卷把数字变成了画面：议员们可以真切地看到他们需要回应的支持有多大。",
          ),
          [
            t("The size of the chamber is not the point.", "议事厅的大小不是重点。"),
            t("Gluing is a detail, not the purpose.", "粘贴只是细节，不是目的。"),
            t("The tricks were delays, unrelated to the unrolling.", "那些花招是拖延，与展开请愿书无关。"),
          ],
        ),
        ask(
          t("Whose face appears on New Zealand's ten-dollar note?", "新西兰十元纸币上印着谁的头像？"),
          t("Kate Sheppard's", "凯特·谢泼德"),
          [t("Eleanor Roosevelt's", "埃莉诺·罗斯福"), t("The queen's", "女王"), t("A prime minister's", "一位总理")],
          t("Kate Sheppard's face now appears on New Zealand's ten-dollar note.", "凯特·谢泼德的头像如今印在新西兰十元纸币上。"),
          [
            t("Eleanor Roosevelt was American.", "埃莉诺·罗斯福是美国人。"),
            t("No queen is mentioned.", "文中没提女王。"),
            t("No prime minister is mentioned.", "文中没提总理。"),
          ],
        ),
      ],
      ["New", "Zealand", "Zealand's", "Kate", "Sheppard", "Sheppard's", "Parliament", "September"],
    ),
    passage(
      "a-speech-of-ten-sentences",
      t("A Speech of Ten Sentences", "十句话的演讲"),
      `In November 1863, in the middle of the American Civil War, a crowd of about fifteen thousand people gathered at Gettysburg, Pennsylvania, where a terrible battle had been fought four months earlier. They came to dedicate a cemetery for the soldiers who had died.

The main speaker that day was Edward Everett, a famous speaker, who talked for about two hours. Then President Abraham Lincoln rose. He spoke ten sentences, about two hundred and seventy words, in roughly two minutes. Some in the crowd hardly realized he had begun before he finished. Yet his short speech, the Gettysburg Address, became one of the most famous in American history.

Lincoln built his argument by moving through time. He began with the past: "Four score and seven years ago," eighty-seven years earlier, the nation's founders had created a country dedicated to the idea that all men are created equal. Then he turned to the present: the nation was now being tested by a great civil war, and the crowd had come to dedicate part of a battlefield.

Next came a turn. In a sense, he said, the living could not truly dedicate this ground. The brave men who had fought there had already done so, far better than any words could. The world would little note what was said there, but it could never forget what the soldiers did.

Finally, Lincoln looked to the future. It was for the living, he said, to finish the work the soldiers had begun, so that the nation would have "a new birth of freedom," and so that government "of the people, by the people, for the people" would not disappear from the earth.

In two minutes, Lincoln turned a ceremony for the dead into a call to the living.`,
      [speechWords, speaker],
      [
        ask(
          t("How did Lincoln organize his argument?", "林肯是怎样组织他的论证的？"),
          t("By moving from the past to the present to the future", "从过去到现在再到未来"),
          [
            t("By listing the names of the soldiers", "列出士兵的名字"),
            t("By answering Edward Everett's points one by one", "逐条回应爱德华·埃弗里特的观点"),
            t("By describing the battle in detail", "详细描述这场战斗"),
          ],
          t(
            "The third paragraph says he built his argument by moving through time: the founding in the past, the war in the present and, in the fifth paragraph, the work of the future.",
            "第三段说他通过时间的推进来构建论证：过去的建国，现在的战争，以及第五段中未来的任务。",
          ),
          [
            t("He named no soldiers.", "他没有点任何士兵的名。"),
            t("He did not reply to Everett.", "他没有回应埃弗里特。"),
            t("He did not describe the fighting.", "他没有描述战斗。"),
          ],
        ),
        ask(
          t("What turn does Lincoln make in the fourth paragraph?", "林肯在第四段作了什么转折？"),
          t(
            "He says the soldiers had already dedicated the ground better than words could",
            "他说士兵们已经以言语无法企及的方式让这片土地变得神圣",
          ),
          [
            t("He says the cemetery should not be built", "他说不应该建这座公墓"),
            t("He admits that the nation would lose the war", "他承认国家会输掉战争"),
            t("He criticizes the crowd for coming", "他批评人群前来"),
          ],
          t(
            "The crowd had come to dedicate the ground, but Lincoln says the living cannot truly do it: the soldiers had already done so, far better than any words could.",
            "人们来是为了献祭这片土地，但林肯说生者无法真正做到：士兵们已经做到了，远胜于任何言语。",
          ),
          [
            t("He dedicated the cemetery; he did not oppose it.", "他为墓地举行献词，并不反对建墓地。"),
            t("He never said the nation would lose.", "他从没说国家会输。"),
            t("He did not criticize the crowd.", "他没有批评人群。"),
          ],
        ),
        ask(
          t("What does the last sentence suggest was the purpose of the speech?", "最后一句暗示了这篇演讲的目的是什么？"),
          t("To urge the living to finish the work the soldiers had begun", "敦促生者完成士兵们开创的事业"),
          [
            t("To describe how the battle was won", "描述这场战斗是如何获胜的"),
            t("To introduce Edward Everett", "介绍爱德华·埃弗里特"),
            t("To mourn the dead and nothing more", "只是哀悼死者，别无其他"),
          ],
          t(
            "The last sentence says Lincoln turned a ceremony for the dead into a call to the living, matching the fifth paragraph, where he says it is for the living to finish the soldiers' work.",
            "最后一句说林肯把悼念死者的仪式变成了对生者的号召，这与第五段相呼应，他在那里说生者应当完成士兵们的事业。",
          ),
          [
            t("The battle's outcome is not described.", "文中没描写战役的结果。"),
            t("Everett spoke before him.", "埃弗里特在他之前讲话。"),
            t("He turned mourning into a call to act.", "他把哀悼变成了行动的号召。"),
          ],
        ),
        ask(
          t("How long did Edward Everett speak?", "爱德华·埃弗里特讲了多久？"),
          t("About two hours", "大约两小时"),
          [t("About two minutes", "大约两分钟"), t("About ten minutes", "大约十分钟"), t("All day", "一整天")],
          t("The main speaker, Edward Everett, talked for about two hours.", "主讲人爱德华·埃弗里特讲了大约两小时。"),
          [
            t("Two minutes was Lincoln's speech.", "两分钟是林肯的演讲。"),
            t("Ten minutes is never mentioned.", "文中从没提十分钟。"),
            t("All day is far too long.", "一整天太长了。"),
          ],
        ),
      ],
      [
        "November",
        "American",
        "Civil",
        "War",
        "Gettysburg",
        "Pennsylvania",
        "Edward",
        "Everett",
        "Everett's",
        "President",
        "Abraham",
        "Lincoln",
        "Address",
      ],
    ),
    passage(
      "the-march-to-the-sea",
      t("The March to the Sea", "向大海进军"),
      `In 1930, India was ruled by Britain, and one of the laws that angered Indians most was a law about salt. Indians were not allowed to collect or sell their own salt. They had to buy salt from the government and pay a tax on it. Salt is something everyone needs, rich or poor, so the tax fell hardest on the poorest people.

Mohandas Gandhi, the leader of the movement for Indian independence, chose this law as the target of a protest. Many of his followers were puzzled. Why salt, when there were so many larger injustices? But Gandhi understood that salt was something every Indian could understand. And breaking the salt law was simple: all you had to do was pick up salt from the seashore.

On March 12, Gandhi and seventy-eight followers set out from his home near Ahmedabad and walked toward the sea. They walked about three hundred and ninety kilometers in twenty-four days. In each village, Gandhi spoke to the crowds, and more people joined the march. Newspaper reporters from around the world followed.

On April 6, at the coastal village of Dandi, Gandhi bent down and picked up a lump of natural salt from the mud. It was a small act, but it broke the law. Across India, millions followed his example, making and selling salt. Tens of thousands of people, including Gandhi, were arrested.

The march did not win independence at once. That would not come until 1947. But the Salt March showed the world the power of nonviolent protest: refusing to obey an unjust law peacefully, and accepting the punishment. Leaders of later movements around the world would study what Gandhi had done.`,
      [protestWords, rightsWords, evidence],
      [
        ask(
          t("Why did the salt tax fall hardest on the poorest people?", "为什么盐税对最贫穷的人打击最大？"),
          t("Everyone needs salt, rich or poor, so the poor paid the same tax", "无论贫富每个人都需要盐，所以穷人交的税一样多"),
          [
            t("Only poor people were allowed to buy salt", "只有穷人才被允许买盐"),
            t("The rich made their own salt", "富人自己制盐"),
            t("The tax was higher in poor villages", "贫穷村庄的税更高"),
          ],
          t(
            "The first paragraph says salt is something everyone needs, rich or poor, so the tax fell hardest on the poorest. The same tax is a much larger share of a small income.",
            "第一段说盐是无论贫富每个人都需要的东西，所以这种税对最贫穷的人打击最大。同样的税在微薄收入中占比大得多。",
          ),
          [
            t("Everyone had to buy salt, not only the poor.", "人人都得买盐，不只是穷人。"),
            t("No one was allowed to make their own salt.", "谁都不准自己制盐。"),
            t("The tax is not said to vary by village.", "文中没说税额因村而异。"),
          ],
        ),
        ask(
          t("Why did Gandhi choose the salt law as his target?", "甘地为什么选择盐法作为抗议目标？"),
          t("Every Indian could understand it, and breaking it was simple", "每个印度人都能理解它，而且违反它很简单"),
          [
            t("It was the largest injustice of British rule", "它是英国统治中最大的不公"),
            t("His followers asked him to choose it", "他的追随者要求他选择它"),
            t("Salt was the most expensive good in India", "盐是印度最贵的商品"),
          ],
          t(
            "The second paragraph says Gandhi understood that salt was something every Indian could understand, and breaking the law only meant picking up salt from the seashore.",
            "第二段说甘地明白盐是每个印度人都能理解的东西，而违反这条法律只需从海边捡起盐。",
          ),
          [
            t("His followers were puzzled; they saw larger injustices.", "他的追随者很困惑，觉得还有更大的不公。"),
            t("His followers were puzzled by the choice.", "他的追随者对这个选择感到困惑。"),
            t("Salt's price is not compared with other goods.", "文中没把盐价和别的商品比较。"),
          ],
        ),
        ask(
          t("What is nonviolent protest, as the passage describes it?", "文章所描述的非暴力抗议是什么？"),
          t("Peacefully refusing to obey an unjust law and accepting the punishment", "和平地拒绝服从不公正的法律，并接受惩罚"),
          [
            t("Writing letters to the government", "给政府写信"),
            t("Selling salt for a lower price", "以更低的价格卖盐"),
            t("Walking long distances for exercise", "为了锻炼而长途步行"),
          ],
          t(
            "The last paragraph defines it: refusing to obey an unjust law peacefully, and accepting the punishment.",
            "最后一段给出了定义：和平地拒绝服从不公正的法律，并接受惩罚。",
          ),
          [
            t("Writing letters is not the method described.", "写信不是文中描述的方法。"),
            t("Selling salt broke the law, but price is not the point.", "卖盐是违法，但重点不在价格。"),
            t("The walk was a protest, not exercise.", "步行是抗议，不是锻炼。"),
          ],
        ),
        ask(
          t("At which village did Gandhi pick up the salt?", "甘地在哪个村子拾起了盐？"),
          t("Dandi", "丹迪"),
          [t("Ahmedabad", "艾哈迈达巴德"), t("Delhi", "德里"), t("Montgomery", "蒙哥马利")],
          t(
            "On April 6, at the coastal village of Dandi, Gandhi picked up a lump of natural salt.",
            "4月6日，甘地在海边村庄丹迪拾起一块天然盐。",
          ),
          [
            t("Ahmedabad was where they set out.", "艾哈迈达巴德是出发地。"),
            t("Delhi is never mentioned.", "文中从没提德里。"),
            t("Montgomery is in Alabama.", "蒙哥马利在亚拉巴马州。"),
          ],
        ),
      ],
      ["India", "Indians", "Indian", "Britain", "British", "Mohandas", "Gandhi", "Ahmedabad", "Dandi", "Salt", "March", "April"],
    ),
    passage(
      "the-children-in-the-photographs",
      t("The Children in the Photographs", "照片中的孩子"),
      `In the early 1900s, nearly two million children under sixteen worked in the factories, mines, mills and fields of the United States. Some were as young as five. They worked ten or twelve hours a day, often in dangerous conditions, and many never went to school.

Reformers had tried for years to change the laws. They gave speeches and wrote articles. But many Americans did not believe the problem was serious. Factory owners claimed the children were happy, well treated and helping their families.

In 1908, a group called the National Child Labor Committee hired a teacher and photographer named Lewis Hine. His job was to collect evidence. Over the next ten years, Hine traveled tens of thousands of kilometers. He photographed boys sorting coal in mines, their faces black with dust; girls standing barefoot beside spinning machines; and children shucking oysters at dawn.

Factory owners often tried to keep him out, so Hine sometimes pretended to be a salesman or a fire inspector. To show how young the children were, he measured their height against the buttons on his coat. For each photograph, he wrote down the child's name, age, job and hours whenever he could.

These careful notes made his photographs more than pictures. They were evidence that could be checked. Reformers printed them in pamphlets, displayed them at meetings and showed them to lawmakers. It became much harder to claim that working children were happy.

Change came slowly, and many states passed their own laws first. In 1938, the United States passed a national law that limited child labor in many industries. Hine lived to see it, though he died two years later, poor and almost forgotten. His photographs had helped make that change possible.`,
      [protestWords, evidence, rightsWords, academic1],
      [
        ask(
          t("What claim did factory owners make about working children?", "工厂主对童工提出了什么说法？"),
          t("That the children were happy, well treated and helping their families", "孩子们很快乐、受到善待，还在帮助家庭"),
          [
            t("That the children went to school every day", "孩子们每天都上学"),
            t("That no children worked in mines", "没有孩子在矿井工作"),
            t("That Hine's photographs were fake", "海因的照片是假的"),
          ],
          t(
            "The second paragraph says factory owners claimed the children were happy, well treated and helping their families.",
            "第二段说工厂主声称孩子们很快乐、受到善待，还在帮助家庭。",
          ),
          [
            t("Many working children never went to school.", "许多童工从没上过学。"),
            t("Children did work in mines.", "孩子们确实在矿井里干活。"),
            t("The owners kept him out but did not call photos fake.", "工厂主不让他进去，但没说照片是假的。"),
          ],
        ),
        ask(
          t("Why did Hine measure children against the buttons on his coat?", "海因为什么用外套上的纽扣测量孩子的身高？"),
          t("To show how young the children were", "为了显示孩子们有多小"),
          [
            t("To disguise himself as a fire inspector", "为了伪装成消防检查员"),
            t("To sell coats to the factory owners", "为了向工厂主卖外套"),
            t("To decide which children to photograph", "为了决定给哪些孩子拍照"),
          ],
          t(
            "The fourth paragraph says he did it to show how young the children were. His buttons were at known heights, so he could estimate a child's height without a ruler.",
            "第四段说他这样做是为了显示孩子们有多小。他的纽扣高度已知，所以不用尺子也能估算孩子的身高。",
          ),
          [
            t("The disguise was pretending, not measuring.", "伪装是假扮身份，不是测量。"),
            t("He did not sell coats.", "他不卖外套。"),
            t("Measuring showed age, not who to choose.", "测量是为了显示年龄，不是挑人拍照。"),
          ],
        ),
        ask(
          t("Why did Hine's notes make his photographs stronger evidence?", "为什么海因的记录让他的照片成为更有力的证据？"),
          t("Names, ages, jobs and hours could be checked", "姓名、年龄、工种和工时都可以核实"),
          [
            t("They made the photographs more beautiful", "它们让照片更美"),
            t("They were written by the factory owners", "它们是工厂主写的"),
            t("They proved Hine had been a teacher", "它们证明海因当过老师"),
          ],
          t(
            "The fifth paragraph says the notes made his photographs more than pictures: they were evidence that could be checked, which made the owners' claims much harder to defend.",
            "第五段说这些记录让他的照片不只是图片：它们是可以核实的证据，这让工厂主的说法难以自圆其说。",
          ),
          [
            t("Notes made them checkable, not prettier.", "记录让照片可以查证，不是更好看。"),
            t("Hine wrote the notes himself.", "记录是海因自己写的。"),
            t("His job as a teacher is not what the notes prove.", "记录证明的不是他当过老师。"),
          ],
        ),
        ask(
          t("What did Hine sometimes pretend to be?", "海因有时会假扮成什么人？"),
          t("A salesman or a fire inspector", "推销员或消防检查员"),
          [t("A factory owner", "工厂老板"), t("A lawmaker", "立法者"), t("A child worker", "童工")],
          t("Hine sometimes pretended to be a salesman or a fire inspector.", "海因有时假扮成推销员或消防检查员。"),
          [
            t("The owners tried to keep him out.", "工厂主想把他挡在外面。"),
            t("Lawmakers saw his photographs.", "议员们看过他的照片。"),
            t("He photographed the child workers.", "他拍的是童工。"),
          ],
        ),
      ],
      ["United", "States", "Americans", "National", "Child", "Labor", "Committee", "Lewis", "Hine"],
      ["shucking"],
    ),
    passage(
      "the-boycott-that-lasted-a-year",
      t("The Boycott That Lasted a Year", "持续一年的抵制运动"),
      `In 1955, in the city of Montgomery, Alabama, the law required Black and white passengers to sit apart on city buses. Black passengers had to sit at the back, and if the white seats filled up, they could be ordered to give up their seats.

On December 1, 1955, a woman named Rosa Parks was riding home from her job as a seamstress. When the driver ordered her to give her seat to a white passenger, she refused. She was arrested.

Parks was not simply a tired woman who happened to refuse, as some later stories claimed. She was an experienced activist who had worked for years for civil rights. Local leaders had been waiting for the right case to challenge the bus laws, and they acted quickly. Within days, they called on Black residents to boycott the buses: to stop riding them until the rules changed. A young minister named Martin Luther King Jr. was chosen to lead the protest.

The boycott was hard. Black riders made up most of the bus company's passengers, and many of them had no other way to get to work. They walked for miles in rain and heat. They organized a system of carpools, with hundreds of volunteer drivers. Some leaders' homes were attacked, and many protesters were arrested.

Still, they kept going, not for a week or a month, but for 381 days. The bus company lost much of its income. Meanwhile, lawyers took the case to court. In 1956, the Supreme Court of the United States ruled that separating passengers by race on buses broke the Constitution. In December 1956, Black passengers in Montgomery rode the buses again, sitting wherever they chose.`,
      [protestWords, rightsWords, evidence, academic3],
      [
        ask(
          t("What correction does the third paragraph make to a common story?", "第三段纠正了一个什么样的流行说法？"),
          t("Parks was an experienced activist, not just a tired woman", "帕克斯是一位经验丰富的活动家，而不只是一个疲惫的女人"),
          [
            t("Parks was not really arrested", "帕克斯其实没有被捕"),
            t("Parks was the bus driver", "帕克斯是公交车司机"),
            t("Parks moved to the back of the bus", "帕克斯坐到了车的后面"),
          ],
          t(
            "The paragraph says she was not simply a tired woman who happened to refuse, as some stories claimed, but an experienced activist who had worked for civil rights for years.",
            "这一段说她并不像某些故事所说的那样只是一个碰巧拒绝的疲惫女人，而是一位多年为民权奋斗的资深活动家。",
          ),
          [
            t("She was arrested, the passage says.", "文中说她被捕了。"),
            t("She was a passenger and seamstress.", "她是乘客，是女裁缝。"),
            t("She refused to give up her seat.", "她拒绝让座。"),
          ],
        ),
        ask(
          t("Why was the boycott effective against the bus company?", "为什么这次抵制对公交公司有效？"),
          t("Black riders were most of its passengers, so it lost much of its income", "黑人乘客占它乘客的大多数，所以它损失了大部分收入"),
          [
            t("The company's drivers joined the protest", "公司的司机加入了抗议"),
            t("The buses broke down without passengers", "没有乘客公交车就坏了"),
            t("The city closed the bus company", "市政府关闭了公交公司"),
          ],
          t(
            "The fourth paragraph says Black riders made up most of the company's passengers, and the fifth says the company lost much of its income.",
            "第四段说黑人乘客占公司乘客的大多数，第五段说公司损失了大部分收入。",
          ),
          [
            t("The drivers are not said to have joined.", "文中没说司机参加了。"),
            t("The buses still ran.", "公交车照常运行。"),
            t("The city did not close the company.", "市政府没有关闭公交公司。"),
          ],
        ),
        ask(
          t("Which two efforts together ended the bus laws in Montgomery?", "哪两方面的努力共同终结了蒙哥马利的公交法规？"),
          t("The long boycott and the court case", "长期的抵制和法庭诉讼"),
          [
            t("Carpools and new buses", "拼车和新公交车"),
            t("A petition and a march to the sea", "一份请愿书和一次向海边的进军"),
            t("The arrest of the leaders and a speech", "领导人被捕和一次演讲"),
          ],
          t(
            "The last paragraph describes both: the boycott lasted 381 days and cost the company its income, while lawyers took the case to court, and the Supreme Court ruled the separation unconstitutional.",
            "最后一段描述了两方面：抵制持续了381天，使公司失去收入；同时律师把案件提交法院，最高法院裁定隔离违宪。",
          ),
          [
            t("Carpools helped but did not end the law.", "拼车有帮助，但没有终结法律。"),
            t("The march to the sea was in India.", "向海边进军发生在印度。"),
            t("Arrests did not end the law.", "逮捕没有终结法律。"),
          ],
        ),
        ask(
          t("How many days did the boycott last?", "抵制运动持续了多少天？"),
          t("381 days", "381天"),
          [t("30 days", "30天"), t("7 days", "7天"), t("1,955 days", "1955天")],
          t("They kept going for 381 days.", "他们坚持了381天。"),
          [
            t("Thirty days would be about a month.", "三十天大约只有一个月。"),
            t("Seven days would be a week.", "七天只有一周。"),
            t("1955 is the year, not the number of days.", "1955 是年份，不是天数。"),
          ],
        ),
      ],
      [
        "Montgomery",
        "Alabama",
        "Black",
        "December",
        "Rosa",
        "Parks",
        "Martin",
        "Luther",
        "King",
        "Jr.",
        "Supreme",
        "Court",
        "United",
        "States",
        "Constitution",
      ],
    ),
    passage(
      "two-reports-of-one-march",
      t("Two Reports of One March", "同一场游行的两篇报道"),
      `On a Saturday morning, about two thousand students marched through the center of a city to ask the city council to build more bicycle lanes. Two local news websites reported the event. Read the opening of each.

Report A: "A mob of students swarmed downtown on Saturday, choking traffic for hours as they shouted demands at City Hall. The so-called safety march left frustrated drivers trapped in their cars while the noisy crowd paraded through the streets."

Report B: "About two thousand students marched downtown on Saturday to call for more bicycle lanes. Several streets were closed for two hours, and some drivers were delayed. Organizers presented a petition with eight thousand signatures to the city council."

Both reports describe the same event. Both mention that traffic was affected. But they leave the reader with very different impressions.

The difference lies in their words. Report A uses loaded language, words chosen to create strong feelings. A "mob" sounds dangerous and out of control; "marchers" or "students" does not. "Swarmed" makes the students sound like insects. "Choking traffic" sounds violent, while "streets were closed" simply states a fact. Calling it a "so-called" safety march hints that the students' reason is not genuine, without giving any evidence.

Report B uses neutral words. It also gives numbers that can be checked: two thousand students, two hours, eight thousand signatures. It tells the reader why the students marched, which Report A leaves out.

Loaded language is not always dishonest. Writers of opinion pieces and speeches use strong words openly, to persuade. But when a news report uses it, readers should notice. The facts may be the same, but the feelings have been chosen for them.`,
      [loaded, protestWords, academic1],
      [
        ask(
          t("Which word from Report A is the most loaded?", "报道A中哪个词最具感情色彩？"),
          t("Mob", "mob（暴民）"),
          [t("Saturday", "Saturday（星期六）"), t("Students", "students（学生）"), t("Traffic", "traffic（交通）")],
          t(
            "The fifth paragraph says a mob sounds dangerous and out of control, while marchers or students does not. Saturday and traffic are neutral facts.",
            "第五段说 mob 听起来危险而失控，而 marchers 或 students 则不会。Saturday 和 traffic 是中性的事实。",
          ),
          [
            t("Saturday is a plain date.", "星期六只是普通的日期。"),
            t("Students is the neutral word.", "“学生”是中性词。"),
            t("Traffic is plain; choking is the loaded part.", "traffic 是平常词，choking 才是带感情色彩的部分。"),
          ],
        ),
        ask(
          t("What important information does Report B give that Report A leaves out?", "报道B给出了哪条报道A遗漏的重要信息？"),
          t("Why the students marched", "学生们为什么游行"),
          [
            t("That traffic was affected", "交通受到了影响"),
            t("That the march happened on Saturday", "游行发生在星期六"),
            t("That the march was downtown", "游行在市中心"),
          ],
          t(
            "The sixth paragraph says Report B tells the reader why the students marched, to call for more bicycle lanes, which Report A leaves out.",
            "第六段说报道B告诉读者学生们为什么游行，即呼吁修建更多自行车道，而报道A没有提到。",
          ),
          [
            t("Report A also mentions traffic.", "报道 A 也提到了交通。"),
            t("Report A also says Saturday.", "报道 A 也说了星期六。"),
            t("Report A also says downtown.", "报道 A 也说了市中心。"),
          ],
        ),
        ask(
          t(
            "According to the author, when should readers especially notice loaded language?",
            "作者认为读者在什么时候尤其应该注意带感情色彩的语言？",
          ),
          t("When a news report uses it", "当新闻报道使用它时"),
          [
            t("When a speech uses it", "当演讲使用它时"),
            t("When numbers are given", "当给出数字时"),
            t("When a petition is presented", "当递交请愿书时"),
          ],
          t(
            "The last paragraph says loaded language is used openly in opinion pieces and speeches, but when a news report uses it, readers should notice.",
            "最后一段说观点文章和演讲公开使用带感情色彩的语言，但当新闻报道使用它时，读者应该留意。",
          ),
          [
            t("Speeches use strong words openly, to persuade.", "演讲公开使用强烈的词来说服人。"),
            t("Numbers are a sign of neutral writing.", "数字是中性写作的标志。"),
            t("Petitions are not discussed in this way.", "文中没这样讨论请愿书。"),
          ],
        ),
      ],
      ["Saturday", "City", "Hall", "Report"],
    ),
    passage(
      "the-speech-from-the-dock",
      t("The Speech from the Dock", "被告席上的演讲"),
      `In 1964, Nelson Mandela stood in a courtroom in Pretoria, South Africa, facing a possible death sentence. He and several other leaders had been charged with trying to overthrow the government. That government enforced apartheid, a system of laws that separated people by race and denied the Black majority the right to vote, to own land in most of the country and to live where they chose.

Mandela did not deny his actions. Instead of answering questions as a witness, he chose to make a statement from the dock, the place where an accused person stands. He spoke for about three hours.

He began by explaining his past. For years, he said, his organization had used only peaceful methods: protests, strikes and petitions. Each time, the government answered with new laws and with force. In 1960, police had opened fire on a crowd of peaceful protesters at Sharpeville, killing sixty-nine people. Peaceful protest had been made illegal. Only then, he explained, had he and others decided to use sabotage against government buildings and power lines, while trying to avoid harming people.

Next, he described the lives of Black South Africans: their poverty, their poor schools and the laws that broke up their families. He used facts and numbers, but he also spoke of dignity and of the simple wish to be treated as equals.

He ended with his ideal: a free society in which all people live together in harmony and with equal opportunities. He told the court that it was an ideal for which he was prepared to die.

Mandela was not sentenced to death, but he spent twenty-seven years in prison. In 1994, four years after his release, he became the first president of South Africa elected by all its people.`,
      [speechWords, speaker, rightsWords, academic3],
      [
        ask(
          t("What is apartheid, as the passage describes it?", "文章所描述的种族隔离是什么？"),
          t(
            "A system of laws that separated people by race and denied the Black majority basic rights",
            "一套按种族隔离人群、剥夺黑人多数基本权利的法律制度",
          ),
          [
            t("A peaceful method of protest", "一种和平抗议的方式"),
            t("The place where an accused person stands", "被告站立的地方"),
            t("A court in Pretoria", "比勒陀利亚的一个法庭"),
          ],
          t(
            "The first paragraph defines apartheid as a system of laws that separated people by race and denied the Black majority the right to vote, own land and live where they chose.",
            "第一段把种族隔离定义为一套按种族隔离人群的法律制度，剥夺了黑人多数的选举权、土地所有权和居住自由。",
          ),
          [
            t("Peaceful protest was what his group did earlier.", "和平抗议是他的组织早期的做法。"),
            t("The dock is where Mandela stood.", "被告席是曼德拉站的地方。"),
            t("Pretoria is the city of the trial.", "比勒陀利亚是受审的城市。"),
          ],
        ),
        ask(
          t("Why did Mandela begin by explaining his organization's past?", "曼德拉为什么首先解释他的组织的过去？"),
          t(
            "To show that they turned to sabotage only after peaceful methods were crushed",
            "为了说明他们是在和平手段被镇压之后才转向破坏行动的",
          ),
          [
            t("To deny that he had taken part in any actions", "为了否认他参与过任何行动"),
            t("To prove that the police had been peaceful", "为了证明警察是和平的"),
            t("To ask the court for a lighter sentence", "为了请求法庭从轻判决"),
          ],
          t(
            "He explains that for years they used only peaceful methods, the government answered with force, Sharpeville happened and peaceful protest was banned. Only then did they choose sabotage. This order makes his choice look like a last resort.",
            "他解释说多年来他们只用和平手段，政府却以武力回应，发生了沙佩维尔事件，和平抗议被禁止。只有在那时他们才选择了破坏行动。这种顺序让他的选择看起来是迫不得已。",
          ),
          [
            t("He did not deny his actions.", "他没有否认自己的行为。"),
            t("Police killed sixty-nine people.", "警察打死了六十九人。"),
            t("He said he was prepared to die, not asked for mercy.", "他说自己准备好赴死，没有请求宽大。"),
          ],
        ),
        ask(
          t(
            "How does Mandela combine different kinds of appeals in the middle of the speech?",
            "曼德拉在演讲中段是怎样结合不同类型的诉求的？",
          ),
          t("He gives facts and numbers and also speaks of dignity and equality", "他既列举事实和数字，也谈到尊严和平等"),
          [
            t("He tells jokes and then gives numbers", "他先讲笑话再给出数字"),
            t("He reads a petition and then sings", "他先读请愿书然后唱歌"),
            t("He questions the judge about the law", "他就法律问题质问法官"),
          ],
          t(
            "The fourth paragraph says he used facts and numbers about poverty, schools and families, but also spoke of dignity and the wish to be treated as equals, appealing to reason and to feeling.",
            "第四段说他用事实和数字讲述贫困、学校和家庭，同时也谈到尊严和希望被平等对待的愿望，既诉诸理性，也诉诸情感。",
          ),
          [
            t("He tells no jokes.", "他没讲笑话。"),
            t("He reads no petition and does not sing.", "他没念请愿书，也没唱歌。"),
            t("He makes a statement; he does not question the judge.", "他作陈述，没有质问法官。"),
          ],
        ),
      ],
      ["Nelson", "Mandela", "Pretoria", "South", "Africa", "Africans", "Black", "Sharpeville"],
    ),
  ],
};
