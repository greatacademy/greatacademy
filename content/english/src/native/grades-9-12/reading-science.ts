// Grades 9 to 12: the reading unit of the fifth theme, science and society: how science finds things out, and what
// people do with what it finds.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grades-6-8/reading-kit.ts";

const clues = { topic: "context-clues", weight: 0.2 } as const;
const inquiry = { topic: "words-of-scientific-inquiry", weight: 0.3 } as const;
const sources = { topic: "evaluating-sources", weight: 0.2 } as const;

/** scienceAndSociety is a reading unit of grades 9 to 12 on scientific method, evidence and their place in society. */
export const scienceAndSociety: ReadingUnitDef = {
  id: "science-and-society",
  title: t("Science and Society", "科学与社会"),
  passages: [
    passage(
      "the-doctor-who-washed-his-hands",
      t("The Doctor Who Washed His Hands", "洗手的医生"),
      `In the 1840s, the largest hospital in Vienna had two clinics where women gave birth. In the first, run by doctors and medical students, about one mother in ten died of a terrible fever after giving birth. In the second, run by midwives, far fewer died. Women knew this, and some begged not to be taken to the first clinic. A few even chose to give birth in the street rather than go there.

A young Hungarian doctor named Ignaz Semmelweis was troubled by the difference. He tested one idea after another. Did the women in the two clinics lie in different positions? He made them the same, and nothing changed. Was it the priest who walked through the first clinic ringing a bell? He changed the priest's route. Still nothing.

Then a colleague died after cutting his finger while examining a dead body, and his symptoms were the same as those of the mothers. Semmelweis formed a hypothesis: the doctors and students, who often came straight from examining bodies, were carrying something on their hands to the women. The midwives did no such work.

He ordered everyone in the first clinic to wash their hands in a chlorine solution before examining patients. Within months, deaths fell sharply, to about the same rate as in the second clinic.

It should have been a triumph. Instead, many doctors rejected his idea. Some were offended by the suggestion that they themselves were causing deaths. Others pointed out, correctly, that Semmelweis could not explain what the "something" was; germs had not yet been discovered. He was dismissed from his job and died, sadly, in 1865.

Within a few decades, the work of other scientists showed that germs cause disease, and Semmelweis was proved right. His story is a reminder that evidence alone does not always persuade people, especially when it threatens their pride.`,
      [clues, inquiry, { topic: "academic-words-2", weight: 0.1 }, { topic: "academic-words-1", weight: 0.1 }],
      [
        ask(
          t("Why did Semmelweis change the priest's route through the clinic?", "塞麦尔维斯为什么改变了神父穿过诊室的路线？"),
          t("To test whether the priest was a cause of the deaths", "为了检验神父是否是造成死亡的原因之一"),
          [
            t("Because the priest asked him to", "因为神父要求他这样做"),
            t("Because the bell disturbed the doctors' work", "因为铃声干扰了医生的工作"),
            t("To make room for more students", "为了给更多学生腾出空间"),
          ],
          t(
            "Semmelweis tested one idea after another; changing the route tested whether the priest made a difference, and it did not.",
            "塞麦尔维斯逐一检验各种猜想；改变路线是为了检验神父是否有影响，结果并没有。",
          ),
        ),
        ask(
          t("What evidence supported his hypothesis about the doctors' hands?", "什么证据支持了他关于医生双手的假设？"),
          t("Deaths fell sharply after everyone washed their hands", "所有人洗手后，死亡人数急剧下降"),
          [
            t("He discovered the germ that caused the fever", "他发现了引起发热的病菌"),
            t("The midwives began examining bodies", "助产士开始检查尸体"),
            t("The women stopped giving birth in the street", "妇女不再在街上分娩"),
          ],
          t(
            "After hand washing in chlorine was ordered, deaths in the first clinic fell to about the rate of the second.",
            "下令用氯溶液洗手之后，第一诊室的死亡率下降到与第二诊室大致相同。",
          ),
        ),
        ask(
          t("What lesson does the last paragraph draw from the story?", "最后一段从这个故事中得出了什么教训？"),
          t("Evidence does not always persuade people, especially when it hurts their pride", "证据并不总能说服人，尤其当它伤及人的自尊时"),
          [
            t("Doctors should never be trusted", "永远不该信任医生"),
            t("Hand washing has no effect on disease", "洗手对疾病没有作用"),
            t("A scientist must always explain every cause", "科学家必须总能解释每一个原因"),
          ],
          t(
            "The passage ends by saying evidence alone does not always persuade people, especially when it threatens their pride.",
            "文章结尾说，仅有证据并不总能说服人，尤其当证据威胁到他们的自尊时。",
          ),
        ),
      ],
      ["Vienna", "Hungarian", "Ignaz", "Semmelweis", "Semmelweis's"],
    ),
    passage(
      "correlation-is-not-causation",
      t("Correlation Is Not Causation", "相关不等于因果"),
      `In many towns, ice cream sales and drowning deaths rise and fall together. In months when people buy more ice cream, more people drown. Does eating ice cream make people drown? Of course not. Both rise in summer, when the weather is hot: people buy cold treats, and more people swim. The heat is a third factor that drives both.

This is the most important warning in reading about science: a correlation between two things does not prove that one causes the other. Two things are correlated when they tend to change together. But there are several possible reasons why.

First, A might cause B. Smoking and lung cancer are correlated, and decades of careful research have shown that smoking does cause the disease.

Second, B might cause A, the reverse of what we first assume. Studies once found that people who used a certain type of bed were more likely to be ill. But the beds did not cause illness; ill people were given those beds.

Third, a hidden factor might cause both, as heat does with ice cream and drowning. Scientists call this a confounding variable. A study might find that children who eat breakfast do better at school, but families that provide breakfast every morning may also offer other advantages, such as quiet places to study.

Finally, the correlation might be coincidence. If you compare enough sets of numbers, some will match by pure chance. One researcher showed that the number of films a famous actor made each year matched the number of people who drowned in swimming pools.

How do scientists find out which is true? The strongest method is a controlled experiment, in which researchers change one variable on purpose and keep everything else the same. When that is impossible, they look for many studies, in different places, that point to the same conclusion.`,
      [
        clues,
        inquiry,
        sources,
        { topic: "academic-words-2", weight: 0.1 },
        { topic: "academic-words-1", weight: 0.1 },
        { topic: "academic-words-3", weight: 0.1 },
      ],
      [
        ask(
          t("Why do ice cream sales and drowning deaths rise together?", "为什么冰淇淋销量和溺水死亡人数会一起上升？"),
          t("Hot weather causes both", "炎热的天气导致了两者"),
          [
            t("Eating ice cream makes swimming dangerous", "吃冰淇淋让游泳变得危险"),
            t("Drowning makes people buy ice cream", "溺水让人们去买冰淇淋"),
            t("It is a pure coincidence", "这纯属巧合"),
          ],
          t(
            "The first paragraph says both rise in summer: heat is a third factor that drives both.",
            "第一段说，两者都在夏天上升：高温是驱动两者的第三个因素。",
          ),
        ),
        ask(
          t("What is a confounding variable?", "什么是混杂变量？"),
          t("A hidden factor that causes both of two correlated things", "同时导致两个相关事物的隐藏因素"),
          [
            t("A variable that scientists change on purpose", "科学家有意改变的变量"),
            t("A mistake in measuring the results", "测量结果时的错误"),
            t("A number that matches another by chance", "偶然与另一个数字吻合的数字"),
          ],
          t(
            "The passage calls a hidden factor that causes both a confounding variable, using breakfast and family advantages as an example.",
            "文章把同时导致两者的隐藏因素称为混杂变量，并以早餐与家庭优势为例。",
          ),
        ),
        ask(
          t("Why is a controlled experiment the strongest method?", "为什么对照实验是最有力的方法？"),
          t("It changes one variable on purpose while keeping everything else the same", "它有意改变一个变量，同时保持其他一切不变"),
          [
            t("It uses the largest number of people", "它使用的人数最多"),
            t("It is the cheapest kind of study", "它是最便宜的研究"),
            t("It never needs to be repeated", "它永远不需要重复"),
          ],
          t(
            "If only one variable changes, any difference in the result can be traced to it rather than to a hidden factor.",
            "如果只有一个变量改变，结果的任何差异都可以归因于它，而不是某个隐藏因素。",
          ),
        ),
      ],
    ),
    passage(
      "the-sugar-pill",
      t("The Power of the Sugar Pill", "糖丸的力量"),
      `Imagine that you have a headache and a doctor gives you a pill. Twenty minutes later, the pain is gone. Did the pill work? Surprisingly, it might have worked even if it contained nothing but sugar.

This effect is called the placebo effect. A placebo is a treatment with no active ingredient, such as a sugar pill or an injection of salt water. When patients believe they are receiving real medicine, many of them report feeling better. Placebos have been shown to reduce pain, nausea and even some symptoms of depression for a time. Scientists are still studying exactly why, but expectation seems to play a powerful role: the brain, expecting relief, may release its own natural painkillers.

The placebo effect creates a serious problem for anyone testing a new medicine. If patients who take a new pill feel better, how do we know whether the pill helped or whether they simply expected to feel better?

The answer is the randomized controlled trial. Patients are divided by chance into two groups. One group receives the real medicine; the other receives a placebo that looks exactly the same. Neither the patients nor, ideally, the doctors know who is getting which. This is called a double-blind trial, and it prevents the expectations of either patients or doctors from affecting the results.

At the end of the trial, researchers compare the groups. If the medicine group improves much more than the placebo group, the medicine has a real effect beyond expectation. If both groups improve equally, the medicine is probably no better than a sugar pill.

Such trials are expensive and slow, but they are one of the great achievements of modern science. Before they became common, many useless or even harmful treatments were widely used because patients and doctors honestly believed in them.`,
      [clues, inquiry, { topic: "academic-words-2", weight: 0.1 }, { topic: "academic-words-1", weight: 0.1 }],
      [
        ask(
          t("What is a placebo?", "什么是安慰剂？"),
          t("A treatment with no active ingredient", "不含有效成分的治疗"),
          [
            t("A very strong painkiller", "一种很强的止痛药"),
            t("A kind of headache", "一种头痛"),
            t("A test that uses only doctors", "只有医生参与的测试"),
          ],
          t(
            "The second paragraph defines a placebo as a treatment with no active ingredient, such as a sugar pill.",
            "第二段把安慰剂定义为不含有效成分的治疗，例如糖丸。",
          ),
        ),
        ask(
          t(
            "Why is a double-blind trial designed so that neither patients nor doctors know who gets the real medicine?",
            "为什么双盲试验要设计成病人和医生都不知道谁服用了真药？",
          ),
          t("So that their expectations cannot affect the results", "这样他们的预期就不会影响结果"),
          [
            t("So that the trial costs less", "这样试验花费更少"),
            t("So that patients do not feel any better", "这样病人就不会感觉好转"),
            t("So that doctors can give more pills", "这样医生可以开更多的药"),
          ],
          t(
            "The passage says the double-blind design prevents the expectations of either patients or doctors from affecting the results.",
            "文章说，双盲设计可以防止病人或医生的预期影响结果。",
          ),
        ),
        ask(
          t("What can researchers conclude if both groups improve equally?", "如果两组的好转程度相同，研究人员可以得出什么结论？"),
          t("The medicine is probably no better than a sugar pill", "这种药可能并不比糖丸更有效"),
          [
            t("The medicine works extremely well", "这种药效果极好"),
            t("The placebo is a dangerous drug", "安慰剂是一种危险的药物"),
            t("The trial must have been double-blind", "这次试验一定是双盲的"),
          ],
          t(
            "The fifth paragraph says that if both groups improve equally, the medicine is probably no better than a sugar pill.",
            "第五段说，如果两组改善程度相同，这种药很可能并不比糖丸好。",
          ),
        ),
      ],
    ),
    passage(
      "when-results-cannot-be-repeated",
      t("When Results Cannot Be Repeated", "当结果无法重复时"),
      `One of the most important rules in science is that a result should not be trusted until it has been repeated. If an experiment shows something true, other scientists, following the same method, should be able to get the same result. Scientists call this replication.

In the last twenty years, researchers in several fields have discovered an uncomfortable problem. When they tried to replicate famous studies, many of the results did not hold up. In one large project, scientists repeated one hundred studies from respected psychology journals. Only about forty percent produced similar results the second time.

Why does this happen? Rarely because of dishonesty. More often, the original studies were small, and small studies can produce striking results by chance. Imagine flipping a coin ten times and getting eight heads; you might wrongly conclude that the coin is unfair. Flip it a thousand times, and the result will be close to half heads.

There is also a problem with what gets published. Journals and newspapers prefer exciting, surprising findings. A study showing that a new method works is more likely to be published than one showing that it does not. As a result, the published record can make some effects look stronger than they are. Scientists sometimes call this the "file drawer problem": studies with dull results sit unseen in a drawer.

Science is responding. Many researchers now publish their plans before collecting data, so that they cannot quietly change their methods after seeing the results. Journals have begun to publish replications and studies that found no effect. Large teams in many countries now repeat important experiments together.

For readers, the lesson is clear. A single surprising study, however widely reported, is a starting point, not a final answer. Before trusting a claim, ask whether others have found the same thing.`,
      [clues, inquiry, sources, { topic: "academic-words-3", weight: 0.1 }, { topic: "academic-words-2", weight: 0.1 }],
      [
        ask(
          t("What does replication mean in science?", "科学中的“重复验证”是什么意思？"),
          t("Repeating an experiment to see whether the same result appears", "重复实验，看能否得到相同的结果"),
          [
            t("Publishing a study in a journal", "在期刊上发表研究"),
            t("Collecting data from many countries", "从许多国家收集数据"),
            t("Copying another scientist's words", "抄袭其他科学家的文字"),
          ],
          t(
            "The first paragraph says other scientists following the same method should get the same result, and calls this replication.",
            "第一段说，其他科学家按同样方法应得到同样结果，这被称为重复验证。",
          ),
        ),
        ask(
          t("Why does the writer describe flipping a coin?", "作者为什么要描述抛硬币？"),
          t("To show how small studies can produce striking results by chance", "为了说明小规模研究如何会偶然产生惊人的结果"),
          [
            t("To explain how scientists choose which study to repeat", "为了解释科学家如何选择要重复的研究"),
            t("To prove that coins are unfair", "为了证明硬币是不公平的"),
            t("To show that psychology is a game", "为了说明心理学是一场游戏"),
          ],
          t(
            "Ten flips can give eight heads by chance, while a thousand flips come close to half, just as small studies are more easily misleading.",
            "抛十次可能偶然出现八次正面，而抛一千次就会接近一半，正如小规模研究更容易误导人。",
          ),
        ),
        ask(
          t('What is the "file drawer problem"?', "什么是“抽屉问题”？"),
          t("Studies with dull or negative results often go unpublished", "结果平淡或否定的研究常常没有发表"),
          [
            t("Scientists lose their notes in drawers", "科学家把笔记丢在抽屉里"),
            t("Journals have too little space", "期刊版面太少"),
            t("Researchers hide dishonest results on purpose", "研究人员故意隐藏不诚实的结果"),
          ],
          t(
            "The fourth paragraph says studies with dull results sit unseen in a drawer, which makes published effects look stronger than they are.",
            "第四段说，结果平淡的研究被放在抽屉里无人问津，这让已发表的效果看起来比实际更强。",
          ),
        ),
      ],
    ),
    passage(
      "reading-a-science-headline",
      t("Reading a Science Headline", "读懂科学新闻标题"),
      `"Chocolate Makes You Smarter, Scientists Say." Headlines like this appear every week. They are exciting, easy to share and often misleading. Learning to read them carefully is one of the most useful skills a citizen can have.

Start by asking who did the study and where it was published. A study in a peer-reviewed journal, where other experts checked the methods before publication, deserves more trust than a press release from a company or a claim in an advertisement. If a chocolate maker paid for the research, that does not prove the results are false, but it is a reason to look closely.

Next, ask who or what was studied. Many studies that reach the news were done on mice or on cells in a dish. A substance that helps a mouse's memory may have no effect on people. Other studies involve only a few dozen volunteers, too few to draw strong conclusions.

Then look at what was actually measured. Perhaps the study found that people who ate chocolate scored slightly higher on one memory test. That is a long way from "makes you smarter." Perhaps the difference was so small that it would hardly matter in daily life.

Ask whether the study showed cause or only correlation. If people who eat more chocolate do better on tests, it might be because they are wealthier, sleep more or simply enjoy treats while studying. Without a controlled experiment, we cannot say that chocolate caused the difference.

Finally, look for the consensus. What do other studies say? A single result that contradicts many earlier findings is more likely to be wrong than to overturn them all.

None of this means that science news is useless. It means that a headline is an invitation to ask questions, not a reason to stop asking. The best science reporters ask these questions for you, and they say so in their articles.`,
      [clues, inquiry, sources, { topic: "academic-words-3", weight: 0.1 }, { topic: "academic-words-2", weight: 0.1 }],
      [
        ask(
          t("Why might a study done on mice be weak evidence about people?", "为什么用老鼠做的研究可能不足以说明人的情况？"),
          t("A substance that helps mice may have no effect on humans", "对老鼠有效的物质可能对人没有作用"),
          [
            t("Mice cannot take memory tests", "老鼠不会做记忆测试"),
            t("Studies on mice are never published", "关于老鼠的研究从不发表"),
            t("Mice do not like chocolate", "老鼠不喜欢巧克力"),
          ],
          t(
            "The third paragraph says a substance that helps a mouse's memory may have no effect on people.",
            "第三段说，有助于老鼠记忆的物质可能对人没有效果。",
          ),
        ),
        ask(
          t("What is a peer-reviewed journal?", "什么是同行评审期刊？"),
          t("A journal in which other experts check the methods before publication", "在发表前由其他专家审查研究方法的期刊"),
          [
            t("A journal written by students", "由学生撰写的期刊"),
            t("A company's advertisement", "公司的广告"),
            t("A newspaper's science page", "报纸的科学版"),
          ],
          t(
            "The second paragraph explains that in a peer-reviewed journal, other experts checked the methods before publication.",
            "第二段解释说，在同行评审期刊中，其他专家会在发表前审查研究方法。",
          ),
        ),
        ask(
          t('What does the writer mean by "a headline is an invitation to ask questions"?', "作者说“标题是一份提问的邀请”是什么意思？"),
          t("A headline should lead readers to check the study, not accept it at once", "标题应引导读者去核查研究，而不是立刻接受"),
          [
            t("Headlines should be written as questions", "标题应写成问句"),
            t("Science news is useless", "科学新闻毫无用处"),
            t("Readers should write to the scientists", "读者应该给科学家写信"),
          ],
          t(
            "The last paragraph says science news is not useless; a headline should start careful questioning rather than end it.",
            "最后一段说，科学新闻并非无用；标题应当开启审慎的提问，而不是结束提问。",
          ),
        ),
      ],
    ),
    passage(
      "the-hole-in-the-sky",
      t("The Hole in the Sky", "天空中的洞"),
      `In 1985, three British scientists working in Antarctica published a startling discovery. For several years, their instruments had shown that the layer of ozone high above the continent was thinning dramatically every spring. At first, they assumed their equipment was faulty and ordered new instruments. The new ones showed the same thing. The ozone layer had a hole in it.

This mattered because the ozone layer protects life on Earth from the sun's harmful ultraviolet rays, which can cause skin cancer and damage crops and sea life. Without it, the planet would be a far more dangerous place.

Scientists already had a suspect. In 1974, two chemists had warned that gases called CFCs, used in refrigerators, air conditioners and spray cans, could rise into the upper atmosphere and destroy ozone. Many companies dismissed the warning as unproven. The Antarctic measurements, followed by flights directly into the hole that found the chemicals responsible, turned the theory into a consensus.

What happened next was remarkable. In 1987, countries around the world signed an agreement called the Montreal Protocol, promising to phase out CFCs. Industry developed safer replacements. Over the following years, the agreement was strengthened several times, and eventually every country in the United Nations joined it.

The results have been slow but real. CFCs remain in the atmosphere for decades, so the hole did not close at once. But measurements now show that the ozone layer is recovering, and scientists expect it to return to its earlier condition around the middle of this century.

The story is often held up as proof that the world can act together on an environmental problem. It also shows how science works at its best: careful measurement, a skeptical check of one's own instruments, a theory tested by evidence, and a consensus that led to action. Had the scientists trusted their first instinct and thrown out the readings, the world might have learned the truth years later.`,
      [clues, inquiry, { topic: "academic-words-2", weight: 0.1 }, { topic: "academic-words-1", weight: 0.1 }],
      [
        ask(
          t("Why did the scientists first order new instruments?", "科学家们起初为什么订购了新仪器？"),
          t("They thought their equipment might be faulty", "他们以为自己的设备可能出了故障"),
          [
            t("Their old instruments had been stolen", "他们的旧仪器被偷了"),
            t("They wanted to measure CFCs in refrigerators", "他们想测量冰箱里的氟氯化碳"),
            t("The government ordered them to", "政府命令他们这样做"),
          ],
          t(
            "The first paragraph says they assumed their equipment was faulty, but the new instruments showed the same thing.",
            "第一段说，他们以为设备有故障，但新仪器显示了同样的结果。",
          ),
        ),
        ask(
          t("What turned the theory about CFCs into a consensus?", "是什么让关于氟氯化碳的理论成为共识的？"),
          t(
            "Measurements in Antarctica and flights that found the chemicals in the hole",
            "南极的测量数据，以及在臭氧洞中发现这些化学物质的飞行观测",
          ),
          [
            t("Companies agreeing that the theory was proven", "公司们同意该理论已被证实"),
            t("A new kind of spray can", "一种新型喷雾罐"),
            t("The signing of the Montreal Protocol", "《蒙特利尔议定书》的签署"),
          ],
          t(
            "The third paragraph says the Antarctic measurements, followed by flights that found the chemicals responsible, made the theory a consensus.",
            "第三段说，南极的测量数据，加上飞入臭氧洞发现相关化学物质的观测，使这一理论成为共识。",
          ),
        ),
        ask(
          t("Why did the ozone hole not close as soon as CFCs were phased out?", "为什么氟氯化碳被逐步淘汰后，臭氧洞没有立即闭合？"),
          t("CFCs remain in the atmosphere for decades", "氟氯化碳会在大气中残留几十年"),
          [
            t("Some countries never joined the agreement", "有些国家从未加入该协议"),
            t("The replacements were even more harmful", "替代品危害更大"),
            t("Scientists stopped measuring the hole", "科学家停止了对臭氧洞的测量"),
          ],
          t(
            "The fifth paragraph says CFCs remain in the atmosphere for decades, so the hole did not close at once.",
            "第五段说，氟氯化碳会在大气中停留几十年，所以臭氧洞没有立即闭合。",
          ),
        ),
      ],
      ["British", "Antarctica", "Antarctic", "Earth", "CFCs", "Montreal", "Protocol", "United", "Nations"],
    ),
    passage(
      "should-we-edit-genes",
      t("Should We Edit Our Genes?", "我们应该编辑基因吗？"),
      `For most of history, people could not change the instructions written in their own cells. That changed in 2012, when scientists described a tool called CRISPR that can cut DNA at a chosen spot, allowing researchers to remove, replace or repair genes with remarkable precision. The tool was cheaper and easier to use than anything before it, and laboratories around the world adopted it within a few years.

The possible benefits are enormous. Many diseases are caused by a single faulty gene. In early trials, doctors have used gene editing to treat patients with sickle cell disease, a painful blood disorder, by editing cells taken from their own bodies and returning them. Researchers hope to treat certain forms of blindness and cancer in similar ways. Farmers may grow crops that resist drought or disease.

But gene editing also raises difficult ethical questions. Editing the cells of a patient affects only that person. Editing an embryo, however, would change every cell of the future child, and the change would pass to their children and grandchildren. In 2018, a scientist announced that he had edited the genes of twin babies before birth. Scientists around the world condemned the experiment as unsafe and unethical, and he was sent to prison.

Critics raise other concerns. Gene editing might have effects that no one can predict. If it becomes possible to choose traits such as height or intelligence, wealthy families might gain new advantages over poor ones. Some worry about a future in which people with disabilities are seen as mistakes that should have been corrected.

Supporters respond that refusing to use the tool also has costs: every year without new treatments, people suffer and die from diseases that might be cured. Most scientists now agree on a middle path: careful use to treat disease, strict rules, and open public debate before any changes that would be passed on.`,
      [clues, inquiry, { topic: "academic-words-2", weight: 0.1 }],
      [
        ask(
          t(
            "Why does editing an embryo raise more concern than editing a patient's cells?",
            "为什么编辑胚胎比编辑病人的细胞引起更多担忧？",
          ),
          t("The change would pass to future generations", "这种改变会传给后代"),
          [
            t("Embryos cannot be edited at all", "胚胎根本无法编辑"),
            t("It is much cheaper", "它便宜得多"),
            t("It affects only one cell", "它只影响一个细胞"),
          ],
          t(
            "The third paragraph says editing an embryo would change every cell of the child and pass to their children and grandchildren.",
            "第三段说，编辑胚胎会改变孩子的每一个细胞，并遗传给他们的子孙。",
          ),
        ),
        ask(
          t("How did scientists react to the 2018 experiment on twin babies?", "科学家们对2018年的双胞胎婴儿实验作何反应？"),
          t("They condemned it as unsafe and unethical", "他们谴责它不安全、不道德"),
          [
            t("They praised it as a great success", "他们称赞它是巨大的成功"),
            t("They tried to repeat it at once", "他们立刻尝试重复这项实验"),
            t("They ignored it completely", "他们完全无视它"),
          ],
          t(
            "The passage says scientists around the world condemned the experiment as unsafe and unethical.",
            "文章说，世界各地的科学家谴责这项实验不安全、不道德。",
          ),
        ),
        ask(
          t('What is the "middle path" most scientists agree on?', "大多数科学家认同的“中间道路”是什么？"),
          t("Careful use to treat disease, strict rules and public debate", "谨慎地用于治疗疾病，制定严格规则，并开展公开讨论"),
          [
            t("Banning gene editing forever", "永远禁止基因编辑"),
            t("Letting families choose any traits they want", "让家庭选择任何他们想要的特征"),
            t("Using it only on crops", "只把它用于农作物"),
          ],
          t(
            "The last paragraph describes the middle path: careful use to treat disease, strict rules and open debate before inherited changes.",
            "最后一段描述了这条中间道路：谨慎地用于治病、严格的规则，以及在作出可遗传改变之前开展公开讨论。",
          ),
        ),
      ],
      ["CRISPR", "DNA"],
    ),
    passage(
      "the-science-fair-surprise",
      t("The Science Fair Surprise", "科学展上的意外"),
      `Ayaan was sure his experiment would work. For his school science fair, he wanted to show that music helps plants grow. He bought twelve bean plants, put six in his bedroom with a speaker playing classical music all day and left six in the kitchen in silence. After four weeks, he would measure them.

His older sister, a university student, looked at his setup and frowned. "How will you know it was the music?" she asked. "Your bedroom gets the afternoon sun. The kitchen doesn't." Ayaan hadn't thought about that. If the bedroom plants grew taller, it might be the light, not the music.

He started again. This time, he put all twelve plants in the same room, on the same shelf, with the same window. He gave them the same amount of water each morning, measured with a cup. Six were placed in a box lined with foam, with a small speaker; the other six were in an identical box with a speaker that stayed silent. He flipped a coin to decide which plants went in which box. The only variable he changed was the music.

After four weeks, he measured every plant to the millimeter. The plants with music averaged 21.4 centimeters. The plants without music averaged 21.1 centimeters. The difference was tiny, smaller than the difference between some plants in the same box.

Ayaan was disappointed. His hypothesis had not been supported. He almost wanted to change his poster to make the result sound more exciting.

His teacher stopped him. "This is a good result," she said. "You designed a fair test, and you found no real effect. That tells us something." At the fair, a judge spent ten minutes asking him about his controls. He did not win first prize. But he won the award for best experimental design, and he learned that an honest result is worth more than an exciting one.`,
      [clues, inquiry, { topic: "academic-words-2", weight: 0.1 }],
      [
        ask(
          t("What was wrong with Ayaan's first plan?", "阿扬最初的计划有什么问题？"),
          t("The two groups got different amounts of light as well as different music", "两组植物除了音乐不同，光照也不同"),
          [
            t("He had too many plants", "他的植物太多了"),
            t("Bean plants cannot hear music", "豆苗听不见音乐"),
            t("The experiment lasted too long", "实验持续时间太长"),
          ],
          t(
            "His sister pointed out that the bedroom got afternoon sun and the kitchen did not, so light could explain any difference.",
            "他姐姐指出，卧室有午后的阳光而厨房没有，所以任何差别都可能是光照造成的。",
          ),
        ),
        ask(
          t("Why did Ayaan flip a coin to decide which plants went in which box?", "阿扬为什么抛硬币来决定哪些植物放进哪个盒子？"),
          t("So that his own choices could not make one group stronger", "这样他自己的选择就不会让某一组更强壮"),
          [
            t("Because he could not count the plants", "因为他数不清植物"),
            t("Because the judge told him to", "因为评委让他这么做"),
            t("To decide whether to play music at all", "为了决定是否播放音乐"),
          ],
          t(
            "Choosing by chance prevents him from, even without meaning to, putting the healthier plants in the music box.",
            "随机选择可以防止他即使无意中也把更健康的植物放进有音乐的盒子。",
          ),
        ),
        ask(
          t('What does the teacher mean when she says "This is a good result"?', "老师说“这是个好结果”是什么意思？"),
          t("A fair test that finds no effect still tells us something true", "一个公平的测试即使没发现效果，也告诉了我们真实的信息"),
          [
            t("The music made the plants grow much taller", "音乐让植物长高了很多"),
            t("Ayaan will certainly win first prize", "阿扬一定会得一等奖"),
            t("He should make the result sound more exciting", "他应该让结果听起来更激动人心"),
          ],
          t(
            "The teacher says he designed a fair test and found no real effect, which is valuable information.",
            "老师说他设计了一个公平的测试，并发现没有真正的效果，这本身就是有价值的信息。",
          ),
        ),
      ],
      ["Ayaan"],
    ),
  ],
};
