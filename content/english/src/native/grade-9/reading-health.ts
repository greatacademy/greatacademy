// Grade 9: the reading unit of the sixth theme, food, health and the body, from the sailors' disease that led to
// the first controlled trial to the placebo, the brain and the question of who pays for research.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grade-5/reading-kit.ts";

const dietWords = { topic: "words-of-diet-and-health", weight: 0.3 } as const;
const hospitalWords = { topic: "words-of-the-hospital", weight: 0.3 } as const;
const bodyWords = { topic: "words-of-the-body-and-brain", weight: 0.3 } as const;
const claims = { topic: "weighing-health-claims", weight: 0.2 } as const;
const academic1 = { topic: "academic-words-1", weight: 0.1 } as const;
const academic2 = { topic: "academic-words-2", weight: 0.1 } as const;
const academic3 = { topic: "academic-words-3", weight: 0.1 } as const;

/** foodHealthAndTheBody is a reading unit of grade 9 on nutrition, medicine and how health claims are tested. */
export const foodHealthAndTheBody: ReadingUnitDef = {
  id: "food-health-and-the-body",
  title: t("Food, Health and the Body", "饮食、健康与身体"),
  passages: [
    passage(
      "twelve-sailors",
      t("Twelve Sailors", "十二名水手"),
      `For centuries, the most dangerous enemy of sailors on long voyages was not storms or battles but a disease called scurvy. Its victims grew weak and tired. Their gums swelled and bled, their teeth loosened, and old wounds that had healed years before opened again. On some voyages, more than half the crew died. Doctors had many theories about the cause, from bad air to laziness, and many cures, most of which did nothing.

In 1747, a Scottish naval surgeon named James Lind decided to test some of these cures. On board the ship Salisbury, he chose twelve sailors who were sick with scurvy and whose symptoms were as similar as possible. He kept them in the same part of the ship and gave them the same basic diet. Then he divided them into six pairs and gave each pair a different treatment. One pair received cider, another drank diluted acid, a third took vinegar, a fourth drank seawater, a fifth took a paste of spices, and the last pair ate two oranges and a lemon every day.

The results were dramatic. Within six days, one of the sailors who ate citrus fruit was fit for duty, and the other was nearly recovered. The pair who drank cider improved slightly. The others did not improve.

Lind's experiment is often described as one of the first controlled clinical trials. He compared treatments fairly by making sure that the patients were alike and that the only important difference between the groups was the treatment.

Yet the lesson was not quickly learned. Lind himself was not sure why citrus worked, and he later recommended a boiled juice that had lost much of its power. It took nearly fifty years for the British navy to give sailors lemon juice regularly. In the twentieth century, scientists finally discovered the cause: scurvy is a deficiency of vitamin C, which the human body cannot make for itself.

Lind's twelve sailors still matter. Every time a new medicine is tested against a fair comparison, his simple method is at work.`,
      [dietWords, hospitalWords, claims, academic2, academic1, academic3],
      [
        ask(
          t("Why did Lind choose sailors whose symptoms were as similar as possible?", "林德为什么挑选症状尽可能相似的水手？"),
          t("So that the only important difference between the groups was the treatment", "使各组之间唯一重要的差别就是治疗方法"),
          [
            t("Because he had only twelve beds", "因为他只有十二张床"),
            t("So that they could share the same oranges", "这样他们可以分享同样的橙子"),
            t("Because the captain ordered it", "因为船长下了命令"),
          ],
          t(
            "The fourth paragraph says he compared treatments fairly by making sure the patients were alike and the only important difference was the treatment.",
            "第四段说他确保病人情况相似，使唯一重要的差别是治疗方法，从而公平地比较各种疗法。",
          ),
        ),
        ask(
          t("Which pair of sailors recovered fastest?", "哪一对水手恢复得最快？"),
          t("The pair who ate oranges and a lemon", "吃橙子和柠檬的那一对"),
          [
            t("The pair who drank cider", "喝苹果酒的那一对"),
            t("The pair who drank seawater", "喝海水的那一对"),
            t("The pair who took vinegar", "服用醋的那一对"),
          ],
          t(
            "The third paragraph says one sailor who ate citrus fruit was fit for duty within six days and the other nearly recovered.",
            "第三段说吃柑橘类水果的一名水手六天内就能执勤，另一名也几乎康复。",
          ),
        ),
        ask(
          t("Why was the lesson of the experiment not quickly learned?", "为什么这个实验的教训没有很快被吸取？"),
          t(
            "Lind was not sure why citrus worked and later recommended a weaker boiled juice",
            "林德不确定柑橘为何有效，后来还推荐了一种效力较弱的煮过的果汁",
          ),
          [
            t("The results of the experiment were lost at sea", "实验结果在海上丢失了"),
            t("Oranges were forbidden on British ships", "英国船上禁止携带橙子"),
            t("Other doctors proved Lind wrong", "其他医生证明林德错了"),
          ],
          t(
            "The fifth paragraph says Lind was not sure why citrus worked and later recommended a boiled juice that had lost much of its power.",
            "第五段说林德不确定柑橘为何有效，后来还推荐了一种失去大部分效力的煮过的果汁。",
          ),
        ),
      ],
      ["Scottish", "James", "Lind", "Salisbury", "Lind's", "British", "C"],
    ),
    passage(
      "the-sugar-papers",
      t("The Sugar Papers", "糖业文件"),
      `In the 1950s and 1960s, doctors in the United States were worried about a rise in heart disease. Scientists argued about the cause. Some blamed fat in the diet, especially saturated fat and cholesterol. Others, including a British scientist named John Yudkin, pointed to sugar.

In 1965, a group called the Sugar Research Foundation, which was funded by the sugar industry, paid three scientists at Harvard University to write a review of the research on diet and heart disease. A review is an article that summarizes many studies, and it can shape what doctors and the public believe. The review was published in 1967 in a respected medical journal. It concluded that fat was the main dietary problem and that the evidence against sugar was weak.

For decades, few people knew who had paid for the review. Then, in 2016, researchers at the University of California, San Francisco, published an article based on old letters they had found in archives. The letters showed that the Sugar Research Foundation had suggested the topic, paid the scientists, and seen drafts before publication. One official had written that the foundation's goal was to counter negative attitudes toward sugar. The journal had not required authors to report who funded their work, so readers had no way of knowing.

The 2016 researchers did not claim that fat is harmless or that sugar alone causes heart disease. Nutrition science is complicated, and both may play a part. Their point was about how evidence is produced. When a company with a financial interest pays for research, it may influence which questions are asked and how the answers are presented.

Today, most medical journals require authors to disclose their funding and any conflicts of interest. This does not mean that every industry-funded study is wrong. But it gives readers an important question to ask about any health claim: who paid for this research, and what did they hope it would show?`,
      [dietWords, claims, academic2, academic1, academic3],
      [
        ask(
          t("What did the 1967 review conclude?", "1967 年的那篇综述得出了什么结论？"),
          t("Fat was the main dietary problem and the evidence against sugar was weak", "脂肪是主要的饮食问题，而指控糖的证据薄弱"),
          [
            t("Sugar was the main cause of heart disease", "糖是心脏病的主要原因"),
            t("Diet had nothing to do with heart disease", "饮食与心脏病毫无关系"),
            t("Cholesterol was completely harmless", "胆固醇完全无害"),
          ],
          t(
            "The second paragraph says the review concluded that fat was the main dietary problem and that the evidence against sugar was weak.",
            "第二段说这篇综述的结论是脂肪是主要的饮食问题，而指控糖的证据薄弱。",
          ),
        ),
        ask(
          t("How did researchers discover in 2016 who had paid for the review?", "2016 年研究人员如何发现谁资助了那篇综述？"),
          t("They found old letters in archives", "他们在档案中找到了旧信件"),
          [
            t("The Harvard scientists confessed on television", "哈佛科学家在电视上承认了"),
            t("The journal had printed the funding all along", "期刊一直刊登着资助信息"),
            t("John Yudkin wrote a book about it", "约翰·尤德金为此写了一本书"),
          ],
          t(
            "The third paragraph says the 2016 article was based on old letters the researchers had found in archives.",
            "第三段说 2016 年的文章是根据研究人员在档案中找到的旧信件写成的。",
          ),
        ),
        ask(
          t("What question does the passage suggest readers ask about any health claim?", "文章建议读者对任何健康说法都问什么问题？"),
          t("Who paid for this research, and what did they hope it would show?", "谁资助了这项研究？他们希望它表明什么？"),
          [
            t("Is the scientist famous?", "这位科学家有名吗？"),
            t("Was the study published recently?", "这项研究是最近发表的吗？"),
            t("Does the claim agree with what I already believe?", "这个说法和我已有的看法一致吗？"),
          ],
          t(
            "The last paragraph says the question to ask is who paid for the research and what they hoped it would show.",
            "最后一段说要问的问题是谁资助了这项研究，他们希望它表明什么。",
          ),
        ),
      ],
      [
        "United",
        "States",
        "British",
        "John",
        "Yudkin",
        "Sugar",
        "Research",
        "Foundation",
        "Harvard",
        "University",
        "California",
        "San",
        "Francisco",
      ],
    ),
    passage(
      "the-power-of-belief",
      t("The Power of Belief", "信念的力量"),
      `During the Second World War, an American doctor named Henry Beecher was treating wounded soldiers in Italy. When supplies of morphine ran low, a nurse is said to have injected a wounded man with plain salt water while telling him it was a powerful painkiller. To Beecher's surprise, the soldier's pain seemed to ease. After the war, Beecher studied this effect carefully. In 1955 he published a famous paper called “The Powerful Placebo.”

A placebo is a treatment that has no active ingredient, such as a sugar pill or an injection of salt water. Yet patients who receive placebos often report feeling better. The placebo effect is strongest for symptoms that the brain helps to produce, such as pain, nausea and tiredness. It does not shrink tumors or cure infections.

Researchers have found that the details matter. In some studies, two placebo pills worked better than one, and injections worked better than pills. Even the price can make a difference: in one experiment, volunteers who were told a placebo painkiller was expensive reported more relief than those told it was cheap. Our expectations, it seems, shape how we experience our own bodies.

The placebo effect creates a problem for testing new medicines. If patients feel better after taking a new drug, how do we know whether the drug worked or whether their belief did? The answer is the placebo-controlled trial. Patients are divided at random into two groups. One receives the real drug and the other a placebo that looks identical. In a double-blind trial, neither the patients nor the doctors know who is getting which. Only if the drug group does clearly better than the placebo group can scientists conclude that the drug itself works.

The placebo effect has a dark twin, called the nocebo effect. Patients who are warned that a drug may cause headaches sometimes develop headaches even when they have been given a placebo.

Both effects remind us that the mind and the body are not separate. What we believe about a treatment can change how we feel, and good science must take that power into account.`,
      [hospitalWords, bodyWords, claims, academic2],
      [
        ask(
          t("For which kinds of symptoms is the placebo effect strongest?", "安慰剂效应对哪类症状最强？"),
          t("Symptoms the brain helps to produce, such as pain and nausea", "大脑参与产生的症状，如疼痛和恶心"),
          [
            t("Infections caused by bacteria", "细菌引起的感染"),
            t("Tumors and broken bones", "肿瘤和骨折"),
            t("Diseases caused by poor diet", "饮食不良引起的疾病"),
          ],
          t(
            "The second paragraph says the effect is strongest for symptoms the brain helps to produce, such as pain, nausea and tiredness.",
            "第二段说安慰剂效应对大脑参与产生的症状最强，如疼痛、恶心和疲劳。",
          ),
        ),
        ask(
          t("What does the experiment with the price of a placebo suggest?", "关于安慰剂价格的实验说明了什么？"),
          t("Our expectations shape how we experience our bodies", "我们的预期会影响我们对身体的感受"),
          [
            t("Expensive medicines are always better", "贵的药总是更好"),
            t("Cheap pills contain more sugar", "便宜的药片含糖更多"),
            t("Volunteers cannot tell pills apart", "志愿者分辨不出药片"),
          ],
          t(
            "The third paragraph says volunteers told the placebo was expensive reported more relief, showing that expectations shape how we experience our bodies.",
            "第三段说被告知安慰剂很贵的志愿者报告了更多缓解，表明预期会影响我们对身体的感受。",
          ),
        ),
        ask(
          t("What is a double-blind trial?", "什么是双盲试验？"),
          t("A trial in which neither patients nor doctors know who gets the real drug", "病人和医生都不知道谁服用了真药的试验"),
          [
            t("A trial in which patients wear blindfolds", "病人戴着眼罩的试验"),
            t("A trial tested twice on the same patients", "在同一批病人身上测试两次的试验"),
            t("A trial in which every patient gets two pills", "每个病人都服两片药的试验"),
          ],
          t(
            "The fourth paragraph says in a double-blind trial neither the patients nor the doctors know who is getting which.",
            "第四段说在双盲试验中，病人和医生都不知道谁服用的是哪一种。",
          ),
        ),
      ],
      ["Second", "World", "War", "American", "Henry", "Beecher", "Italy", "Beecher's", "Powerful", "Placebo"],
      ["morphine", "placebo", "placebos", "nocebo", "double-blind", "placebo-controlled"],
    ),
    passage(
      "the-doctor-who-said-wash",
      t("The Doctor Who Said Wash", "主张洗手的医生"),
      `In the 1840s, the General Hospital of Vienna had two clinics where women came to give birth. In the first clinic, babies were delivered by doctors and medical students. In the second, they were delivered by midwives. A young Hungarian doctor named Ignaz Semmelweis noticed something terrible. In the first clinic, about one mother in ten died of a fever after giving birth. In the second, the rate was far lower. Women knew this, and some begged not to be admitted to the first clinic.

Semmelweis searched for the cause. The two clinics had the same building, the same kind of patients and similar crowding. Then, in 1847, a colleague died after being cut by a student's knife during an autopsy, the examination of a dead body. His symptoms were the same as those of the dying mothers.

Semmelweis made a connection. The doctors and students often came directly from autopsies to the birthing clinic without washing their hands. He reasoned that they were carrying some kind of invisible “cadaverous particles” from the dead to the living. The midwives did not perform autopsies.

He ordered everyone in his clinic to wash their hands in a solution of chlorinated lime before examining patients. The death rate fell dramatically, to about the same level as the midwives' clinic.

The story should end in triumph. Instead, many senior doctors rejected his idea. Some were offended by the suggestion that gentlemen's hands could be unclean. Semmelweis did not explain his findings clearly in print for years, and he grew angry and bitter with his critics. He lost his position in Vienna and died in 1865, in a mental hospital.

Only after his death did the work of scientists such as Louis Pasteur and Joseph Lister show that germs cause infection, proving that Semmelweis had been right. Today, washing hands is one of the most important ways hospitals prevent disease. His story is also a warning: good evidence is not enough if people are unwilling to see it, and a true idea needs to be clearly explained to win acceptance.`,
      [hospitalWords, claims, academic2, academic1],
      [
        ask(
          t("What was the important difference between the two clinics?", "两个诊所之间的重要差别是什么？"),
          t("Doctors and students who performed autopsies delivered babies in the first clinic", "第一诊所由做过尸体解剖的医生和学生接生"),
          [
            t("The first clinic was in an older building", "第一诊所在一栋更旧的楼里"),
            t("The second clinic had sicker patients", "第二诊所的病人病得更重"),
            t("The first clinic was more crowded", "第一诊所更拥挤"),
          ],
          t(
            "The first and third paragraphs say doctors and students delivered babies in the first clinic and often came straight from autopsies, while midwives did not perform autopsies.",
            "第一段和第三段说第一诊所由医生和学生接生，他们常常直接从尸体解剖室过来，而助产士不做解剖。",
          ),
        ),
        ask(
          t("What made Semmelweis connect autopsies with the fever?", "是什么让塞麦尔维斯把尸体解剖与产褥热联系起来？"),
          t("A colleague cut during an autopsy died with the same symptoms", "一位在解剖时被割伤的同事死时症状与产妇相同"),
          [
            t("A midwife told him the cause", "一位助产士告诉了他原因"),
            t("He read a paper by Louis Pasteur", "他读了路易·巴斯德的论文"),
            t("He saw germs under a microscope", "他在显微镜下看到了病菌"),
          ],
          t(
            "The second paragraph says a colleague died after being cut during an autopsy, and his symptoms were the same as those of the dying mothers.",
            "第二段说一位同事在解剖时被割伤后去世，他的症状与垂死产妇的症状相同。",
          ),
        ),
        ask(
          t("Why did many senior doctors reject Semmelweis's idea?", "为什么许多资深医生拒绝塞麦尔维斯的观点？"),
          t("Some were offended by the suggestion that their hands could be unclean", "有些人被“他们的手可能不干净”这一说法冒犯了"),
          [
            t("His hand-washing did not lower the death rate", "他的洗手方法并没有降低死亡率"),
            t("Chlorinated lime was too expensive", "漂白粉太贵了"),
            t("He had published too many clear papers", "他发表了太多清晰的论文"),
          ],
          t(
            "The fifth paragraph says some were offended by the suggestion that gentlemen's hands could be unclean, and he did not explain his findings clearly in print.",
            "第五段说有些人被“绅士的手可能不干净”这一说法冒犯，而且他多年没有在出版物中清楚地解释他的发现。",
          ),
        ),
      ],
      ["General", "Hospital", "Vienna", "Hungarian", "Ignaz", "Semmelweis", "Louis", "Pasteur", "Joseph", "Lister", "Semmelweis's"],
      ["midwives", "autopsy", "autopsies", "cadaverous", "chlorinated", "birthing"],
    ),
    passage(
      "the-man-with-the-iron-rod",
      t("The Man with the Iron Rod", "铁棒穿颅的人"),
      `On September 13, 1848, a railroad construction foreman named Phineas Gage was preparing to blast rock in Vermont. His job was to pack explosive powder into a hole with a long iron rod. Something went wrong. A spark set off the powder, and the rod, more than a meter long and about three centimeters wide, shot upward through his left cheek, passed behind his eye and burst out of the top of his skull. It landed about twenty-five meters away.

Astonishingly, Gage survived. Within minutes he was talking. He rode in a cart to a nearby town, where a doctor named John Harlow treated his wounds. For weeks his life was in danger from infection, but he recovered. He could walk, speak and remember.

Yet something had changed. Before the accident, Gage had been considered an efficient, well-balanced worker, one of the best foremen on the line. Afterward, according to Harlow's later report, he became impatient, rude and unable to stick to plans. His friends said he was “no longer Gage.” His employers would not give him his old job back.

Gage's case became one of the most famous in the history of brain science. It suggested that particular parts of the brain, especially the front, are connected to personality, judgment and self-control, not just to movement or speech. At the time, this was a startling idea.

However, historians have since warned that the story has grown in the retelling. There are few reliable records of Gage's behavior, and later writers exaggerated his changes. Evidence discovered in recent decades shows that he later worked for years as a stagecoach driver in Chile, a job that required skill, planning and responsibility. Some scientists now believe he may have recovered much of his former self, as the brain slowly adapted to its injury.

Gage's story, then, teaches two lessons. One is about the brain's importance in making us who we are. The other is about evidence: even a famous case must be checked against the original sources, because a good story can travel further than the truth.`,
      [bodyWords, hospitalWords, claims, academic1, academic3],
      [
        ask(
          t("What did Gage's case suggest about the front of the brain?", "盖奇的病例表明了大脑前部的什么作用？"),
          t("It is connected to personality, judgment and self-control", "它与性格、判断力和自控力有关"),
          [
            t("It controls only movement and speech", "它只控制运动和言语"),
            t("It plays no part in behavior", "它与行为毫无关系"),
            t("It is where memories are stored", "它是储存记忆的地方"),
          ],
          t(
            "The fourth paragraph says the case suggested that parts of the brain, especially the front, are connected to personality, judgment and self-control.",
            "第四段说这个病例表明大脑的某些部分，特别是前部，与性格、判断力和自控力有关。",
          ),
        ),
        ask(
          t("Why have historians warned about the story of Gage?", "历史学家为什么对盖奇的故事提出警告？"),
          t("There are few reliable records, and later writers exaggerated his changes", "可靠的记录很少，后来的作者夸大了他的变化"),
          [
            t("The accident never really happened", "这起事故从未真正发生过"),
            t("Harlow invented Gage's name", "哈洛编造了盖奇的名字"),
            t("Gage was not injured in the head", "盖奇的头部并没有受伤"),
          ],
          t(
            "The fifth paragraph says there are few reliable records of Gage's behavior and later writers exaggerated his changes.",
            "第五段说关于盖奇行为的可靠记录很少，后来的作者夸大了他的变化。",
          ),
        ),
        ask(
          t("What does his later work as a stagecoach driver suggest?", "他后来当驿站马车车夫的工作说明了什么？"),
          t("He may have recovered much of his former self", "他可能恢复了以前的大部分自我"),
          [
            t("He never changed after the accident", "事故后他从未改变"),
            t("He could no longer plan anything", "他再也无法做任何计划"),
            t("He had to leave the country in shame", "他不得不羞愧地离开这个国家"),
          ],
          t(
            "The fifth paragraph says the job required skill, planning and responsibility, and some scientists believe he may have recovered much of his former self.",
            "第五段说这份工作需要技巧、计划和责任心，一些科学家认为他可能恢复了以前的大部分自我。",
          ),
        ),
      ],
      ["September", "Phineas", "Gage", "Vermont", "John", "Harlow", "Harlow's", "Gage's", "Chile"],
      ["stagecoach", "foremen"],
    ),
    passage(
      "the-first-painless-operation",
      t("The First Painless Operation", "第一次无痛手术"),
      `Before the middle of the nineteenth century, surgery was a horror. Patients were awake for every cut. They were held down by strong assistants, and the best surgeons were the fastest ones; a skilled surgeon could remove a leg in less than a minute. Many people chose to suffer from a disease rather than face the knife.

Some substances were known to dull pain. Alcohol and opium were used, but they did little against the agony of surgery. In the 1840s, young people in the United States held parties where they breathed nitrous oxide, or laughing gas, or the vapor of a liquid called ether, for fun. A few observers noticed that people under their influence sometimes injured themselves without seeming to feel it.

A Boston dentist named William Morton experimented with ether on animals and on himself. On October 16, 1846, at the Massachusetts General Hospital, he gave ether to a young man named Gilbert Abbott, who had a tumor on his neck. The surgeon, John Collins Warren, removed it while the patient lay still. When Abbott woke, he said he had felt no pain. Warren turned to the doctors watching and is reported to have said, “Gentlemen, this is no humbug.” The room where it happened is still called the Ether Dome.

News spread across the Atlantic within weeks. A London surgeon soon performed an amputation under ether, and within a year, anesthesia was being used in many countries. In 1853, Queen Victoria was given chloroform, another anesthetic, during the birth of one of her children, which helped make it acceptable to the public.

Anesthesia changed more than the experience of patients. Because surgeons no longer had to rush, they could perform longer and more careful operations. Combined with the later discovery of germs and the use of antiseptics, it turned surgery from a desperate last resort into a routine part of medicine.

Morton spent the rest of his life fighting with others who claimed to have discovered anesthesia first, and he died poor. But the patients of the world gained something priceless: the ability to sleep through the knife.`,
      [hospitalWords, bodyWords],
      [
        ask(
          t("Why were the best surgeons before anesthesia the fastest ones?", "在麻醉出现之前，为什么最好的外科医生是最快的？"),
          t("Patients were awake and in agony for every cut", "病人清醒地承受着每一刀的剧痛"),
          [
            t("Hospitals charged by the minute", "医院按分钟收费"),
            t("There were too many patients waiting", "等候的病人太多"),
            t("Surgeons were paid for speed", "外科医生按速度领报酬"),
          ],
          t(
            "The first paragraph says patients were awake for every cut and held down, so the best surgeons were the fastest.",
            "第一段说病人清醒地挨每一刀并被按住，所以最好的外科医生是最快的。",
          ),
        ),
        ask(
          t("What did Gilbert Abbott say when he woke up?", "吉尔伯特·阿博特醒来后说了什么？"),
          t("That he had felt no pain", "他没有感到疼痛"),
          [
            t("That the tumor was still there", "肿瘤还在"),
            t("That he wanted more ether", "他还想要更多乙醚"),
            t("That the operation was a humbug", "这次手术是骗局"),
          ],
          t("The third paragraph says that when Abbott woke, he said he had felt no pain.", "第三段说阿博特醒来后说他没有感到疼痛。"),
        ),
        ask(
          t("How did anesthesia change surgery beyond the patient's experience?", "除了病人的感受，麻醉还如何改变了外科手术？"),
          t("Surgeons could perform longer and more careful operations", "外科医生可以做更长、更细致的手术"),
          [
            t("Surgeons no longer needed assistants", "外科医生不再需要助手"),
            t("Operations became cheaper than medicine", "手术变得比药还便宜"),
            t("Germs were no longer a danger", "病菌不再构成危险"),
          ],
          t(
            "The fifth paragraph says that because surgeons no longer had to rush, they could perform longer and more careful operations.",
            "第五段说外科医生不必再匆忙，因而可以做更长、更细致的手术。",
          ),
        ),
      ],
      [
        "United",
        "States",
        "Boston",
        "William",
        "Morton",
        "October",
        "Massachusetts",
        "General",
        "Hospital",
        "Gilbert",
        "Abbott",
        "John",
        "Collins",
        "Warren",
        "Ether",
        "Dome",
        "Atlantic",
        "London",
        "Queen",
        "Victoria",
      ],
      ["opium", "nitrous", "ether", "humbug", "amputation", "chloroform", "antiseptics"],
    ),
    passage(
      "what-the-gut-knows",
      t("What the Gut Knows", "肠道知道什么"),
      `Your body is home to trillions of tiny living things. Most of them live in your gut, especially in the large intestine. Together, these bacteria, fungi and other microbes are called the gut microbiome, and scientists have only recently begun to understand how much they matter.

The microbes help with digestion. Humans cannot break down many kinds of fiber in plants, but some gut bacteria can. They ferment the fiber and produce substances that feed the cells lining the intestine and help to control inflammation. They also make certain vitamins and help to train the immune system to tell friends from enemies.

Different diets feed different microbes. Studies have found that people who eat a wide variety of plants tend to have a more diverse microbiome than people who eat mostly processed food. Diversity seems to be a sign of a healthy gut, in the same way that a forest with many species is often healthier than a field of one crop.

Some of the most surprising research suggests that the gut may affect the brain. The gut and brain are connected by nerves, and gut microbes produce chemicals that can influence mood. In experiments, mice raised without any gut microbes behaved differently from normal mice. When researchers transferred microbes from one mouse to another, some behaviors seemed to transfer as well.

This research has created great excitement and many products. Shops now sell probiotic drinks, pills and yogurts that promise to improve health by adding helpful bacteria. Here, careful readers should slow down. Many of the most dramatic findings come from studies of mice, not people. Many human studies are small, and they often show a link between the microbiome and a disease without showing which causes which. Probiotics help with some specific problems, but for many claims, the evidence is still weak.

Scientists are cautious but hopeful. The microbiome is real and important, and its study may change medicine. For now, though, the advice that has the strongest support is also the oldest: eat a wide variety of vegetables, fruits and whole grains, and be skeptical of any product that promises a miracle.`,
      [dietWords, bodyWords, claims, academic2, academic1],
      [
        ask(
          t("How do gut bacteria help with digestion?", "肠道细菌如何帮助消化？"),
          t("They break down fiber that humans cannot digest", "它们分解人类无法消化的纤维"),
          [
            t("They remove all fat from food", "它们去除食物中的所有脂肪"),
            t("They make food taste better", "它们让食物更美味"),
            t("They stop the stomach from making acid", "它们阻止胃分泌胃酸"),
          ],
          t(
            "The second paragraph says humans cannot break down many kinds of fiber, but some gut bacteria can.",
            "第二段说人类无法分解许多种纤维，但一些肠道细菌可以。",
          ),
        ),
        ask(
          t(
            "Why should careful readers slow down when reading about probiotic products?",
            "为什么谨慎的读者在看到益生菌产品时要放慢脚步？",
          ),
          t("Many findings come from mice or small studies that do not show cause", "许多发现来自老鼠实验或不能证明因果的小型研究"),
          [
            t("Probiotics have been proven to cure every disease", "益生菌已被证明能治愈所有疾病"),
            t("The microbiome does not really exist", "微生物组并不真正存在"),
            t("Yogurt is dangerous for the brain", "酸奶对大脑有害"),
          ],
          t(
            "The fifth paragraph says many dramatic findings come from studies of mice, and many human studies are small and show a link without showing which causes which.",
            "第五段说许多惊人的发现来自老鼠实验，许多人体研究规模小，只显示关联而未表明因果。",
          ),
        ),
        ask(
          t("What advice has the strongest support, according to the last paragraph?", "根据最后一段，哪条建议得到的支持最充分？"),
          t("Eat a wide variety of vegetables, fruits and whole grains", "多吃各种蔬菜、水果和全谷物"),
          [
            t("Take probiotic pills every day", "每天服用益生菌片"),
            t("Avoid all bacteria", "避开所有细菌"),
            t("Eat only processed food", "只吃加工食品"),
          ],
          t(
            "The last paragraph says the advice with the strongest support is to eat a wide variety of vegetables, fruits and whole grains.",
            "最后一段说支持最充分的建议是多吃各种蔬菜、水果和全谷物。",
          ),
        ),
      ],
      [],
      ["microbiome", "microbes", "probiotic", "probiotics", "fungi", "ferment"],
    ),
    passage(
      "why-we-sleep",
      t("Why We Sleep", "我们为什么睡觉"),
      `Humans spend about a third of their lives asleep. For most of history, people assumed that sleep was simply rest, a time when the brain switched off. Scientists now know that the sleeping brain is extremely busy.

Sleep comes in cycles of about ninety minutes. In the deepest stage, slow waves of electrical activity sweep across the cortex. During another stage, called REM sleep after the rapid eye movements that accompany it, the brain becomes almost as active as when awake, and most vivid dreams occur. Over a night, a person passes through four or five of these cycles.

One job of sleep is to strengthen memory. In experiments, people who learned a task and then slept performed better the next day than people who learned it and stayed awake. During deep sleep, the brain seems to replay the day's experiences, moving important memories into long-term storage and letting unimportant details fade.

Another job may be cleaning. In 2013, researchers studying mice found that during sleep, the spaces between brain cells widen, allowing fluid to wash away waste products that build up during the day. One of these waste products is linked to Alzheimer's disease. The research is still developing, and most of it has been done in animals, but it suggests that sleep may protect the brain over a lifetime.

Lack of sleep has clear costs. After a night without sleep, people react more slowly, make more mistakes and have more trouble controlling their emotions. Long-term lack of sleep is linked to problems including obesity, heart disease and depression, although in many of these cases scientists are still working out which is cause and which is effect.

Teenagers face a particular difficulty. During adolescence, the body's internal clock shifts later, so many teenagers do not feel sleepy until late at night. Yet school often starts early. Some districts that have moved their start times later have reported that students slept more and attended class more often. For a growing brain, sleep is not wasted time. It is when much of the important work gets done.`,
      [bodyWords, dietWords, claims, academic3, academic2],
      [
        ask(
          t("What happens in the brain during REM sleep?", "快速眼动睡眠期间大脑会发生什么？"),
          t("It becomes almost as active as when awake, and most vivid dreams occur", "它几乎和清醒时一样活跃，大多数生动的梦出现在这时"),
          [
            t("It switches off completely", "它完全关闭"),
            t("It produces slow waves only", "它只产生慢波"),
            t("It stops storing memories", "它停止储存记忆"),
          ],
          t(
            "The second paragraph says during REM sleep the brain becomes almost as active as when awake, and most vivid dreams occur.",
            "第二段说在快速眼动睡眠期间，大脑几乎和清醒时一样活跃，大多数生动的梦都出现在这时。",
          ),
        ),
        ask(
          t("What did researchers studying mice find in 2013?", "2013 年研究老鼠的科学家发现了什么？"),
          t("Spaces between brain cells widen during sleep so fluid can wash away waste", "睡眠时脑细胞之间的空隙变大，液体得以冲走废物"),
          [
            t("Mice do not need to sleep at all", "老鼠根本不需要睡觉"),
            t("Sleep causes Alzheimer's disease", "睡眠导致阿尔茨海默病"),
            t("Brain cells shrink permanently during sleep", "脑细胞在睡眠中永久缩小"),
          ],
          t(
            "The fourth paragraph says that during sleep the spaces between brain cells widen, allowing fluid to wash away waste products.",
            "第四段说睡眠时脑细胞之间的空隙变大，使液体能冲走废物。",
          ),
        ),
        ask(
          t("Why do many teenagers not feel sleepy until late at night?", "为什么许多青少年直到深夜才感到困？"),
          t("Their internal clock shifts later during adolescence", "青春期时他们的生物钟会推迟"),
          [
            t("They eat too much sugar in the evening", "他们晚上吃太多糖"),
            t("Their schools start too late", "他们的学校开学太晚"),
            t("They do not dream", "他们不做梦"),
          ],
          t(
            "The last paragraph says during adolescence the body's internal clock shifts later, so many teenagers do not feel sleepy until late at night.",
            "最后一段说青春期时身体的生物钟会推迟，所以许多青少年直到深夜才感到困。",
          ),
        ),
      ],
      ["REM", "Alzheimer's"],
    ),
  ],
};
