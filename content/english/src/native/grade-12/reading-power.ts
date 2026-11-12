// Grade 12: the reading unit of the second theme, power and conscience, from a reporter who took on an oil
// company and a doctor who said no to a drug to a laboratory of obedience, a company that hid its debts, a
// historian's warning, secret papers, a policeman who would not take money and a judge of old China.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grade-5/reading-kit.ts";

const power = { topic: "words-of-power-and-corruption", weight: 0.3 } as const;
const conscience = { topic: "words-of-conscience-and-duty", weight: 0.3 } as const;
const investigative = { topic: "reading-an-investigative-report", weight: 0.2 } as const;
const academic10 = { topic: "academic-words-10", weight: 0.1 } as const;
const academic11 = { topic: "academic-words-11", weight: 0.1 } as const;
const academic1 = { topic: "academic-words-1", weight: 0.1 } as const;
const academic2 = { topic: "academic-words-2", weight: 0.1 } as const;
const academic3 = { topic: "academic-words-3", weight: 0.1 } as const;

/** powerAndCorruption is a reading unit of grade 12 on power and corruption, conscience and duty, and the reporting that brings wrongdoing to light. */
export const powerAndCorruption: ReadingUnitDef = {
  id: "power-and-corruption",
  title: t("Power and Corruption", "权力与腐败"),
  passages: [
    passage(
      "the-reporter-and-the-oil-company",
      t("The Reporter and the Oil Company", "记者与石油公司"),
      `In 1872, when Ida Tarbell was fourteen, her father's small oil business in western Pennsylvania was nearly ruined. A group of refiners had made a secret deal with the railroads. The railroads would charge them low rates to ship oil and charge everyone else high ones, and they would even pay the group part of what its rivals paid. The scheme, run through a company with the harmless name of the South Improvement Company, was soon exposed and cancelled, but the man behind much of it, John D. Rockefeller, went on to buy or crush almost every refinery in the region. Tarbell never forgot what she had seen.

Thirty years later she was a writer for McClure's, a popular magazine, and she set out to tell the story of Rockefeller's company, Standard Oil. She did not rely on rumor. She spent years in courthouses and state offices, reading the records of lawsuits and the testimony that company officials had given under oath. She found contracts, letters and the accounts of small refiners who had been forced to sell. Where a fact could not be checked, she left it out.

Her series ran from 1902 to 1904. It showed, with dates and documents, how Standard Oil had used secret rebates from the railroads, how it had cut prices in one town until its rivals failed and then raised them again, and how it had spied on the shipments of competitors. None of these practices was simple graft, the bribing of officials, but together they showed a company using its size to make fair competition impossible.

The articles made Tarbell famous, and they angered many readers. Theodore Roosevelt later called reporters like her "muckrakers," people who raked through the dirt. She disliked the name. She thought of herself as a careful historian, and her method was what made her work hard to dismiss: it was difficult to ascertain anything wrong in a claim backed by a court record.

In 1911, the Supreme Court ruled that Standard Oil had broken the law against monopolies and ordered it broken into more than thirty separate companies. Tarbell's articles were not the only cause, but they had shown the public, in plain evidence, what the company had done.`,
      [power, investigative, academic10, academic2, academic3, academic1],
      [
        ask(
          t("Why did Tarbell's articles prove hard to dismiss?", "为什么塔贝尔的文章很难被驳斥？"),
          t("She backed her claims with court records, testimony and documents", "她用法庭记录、证词和文件支持自己的说法"),
          [
            t("She was a close friend of the president of the United States", "她是美国总统的好朋友"),
            t("She had worked for Standard Oil before she wrote about it", "她在写标准石油公司之前曾为它工作"),
            t("She repeated the rumors that everyone in Pennsylvania believed", "她重复了宾夕法尼亚州人人都相信的传言"),
          ],
          t(
            "The second and fourth paragraphs say she read lawsuits and sworn testimony, left out what could not be checked, and that her method made her work hard to dismiss.",
            "第二段和第四段说她查阅诉讼和宣誓证词，删去无法核实的内容，而这种方法使她的作品难以被驳斥。",
          ),
        ),
        ask(
          t("What did the South Improvement Company scheme do?", "南方改进公司的计划做了什么？"),
          t("It gave one group of refiners cheap shipping while rivals paid more", "它让一群炼油商享受低廉运费，而对手要付更多"),
          [
            t("It improved the roads of southern Pennsylvania for oil trucks", "它为运油卡车改善了宾夕法尼亚州南部的道路"),
            t("It paid small refiners a fair price for their businesses", "它为小炼油商的生意支付了公平的价格"),
            t("It built a new railroad that every refiner could use freely", "它修建了一条每个炼油商都能免费使用的新铁路"),
          ],
          t(
            "The first paragraph says the railroads would charge the group low rates and everyone else high ones, and even pay the group part of what rivals paid.",
            "第一段说铁路会向这群人收取低价，向其他所有人收取高价，甚至把对手支付的一部分运费交给这群人。",
          ),
        ),
        ask(
          t(
            'According to the passage, why were Standard Oil\'s practices not "simple graft"?',
            "根据文章，为什么标准石油公司的做法不是“简单的贪污受贿”？",
          ),
          t("They did not bribe officials but used size to block fair competition", "它们没有贿赂官员，而是利用规模阻止公平竞争"),
          [
            t("They were all approved in advance by the Supreme Court", "它们都事先得到了最高法院的批准"),
            t("They were invented by the railroads and not by the company", "它们是铁路发明的，不是这家公司"),
            t("They helped small refiners more than they hurt them", "它们对小炼油商的帮助多于伤害"),
          ],
          t(
            "The third paragraph defines graft as the bribing of officials and says the practices instead showed a company using its size to make fair competition impossible.",
            "第三段把贪污受贿定义为贿赂官员，并说这些做法表明的是一家公司利用其规模使公平竞争变得不可能。",
          ),
        ),
      ],
      [
        "Ida",
        "Tarbell",
        "Tarbell's",
        "Standard",
        "Oil",
        "McClure's",
        "Pennsylvania",
        "John",
        "D.",
        "Rockefeller",
        "Rockefeller's",
        "Theodore",
        "Roosevelt",
        "South",
        "Improvement",
        "Company",
      ],
    ),
    passage(
      "the-doctor-who-said-no",
      t("The Doctor Who Said No", "说“不”的医生"),
      `In the autumn of 1960, a doctor named Frances Kelsey started a new job at the Food and Drug Administration, the government office that decides whether a medicine may be sold in the United States. One of her first files was an application from a company that wanted to sell a sleeping pill called Kevadon. The drug, known in Europe as thalidomide, was already sold in dozens of countries. It was said to be so safe that a person could not take enough of it to die. The company expected a quick approval.

Kelsey did not give one. The studies in the file seemed thin to her, and the company's claims of safety were not supported by the kind of evidence she expected. She asked for more data. The company sent more and pressed her to decide; its representatives called and visited again and again. Then, early in 1961, she read a letter in a British medical journal reporting that some patients who took the drug for a long time had developed damage to their nerves. If the drug could harm adult nerves, she asked, what might it do to an unborn child? She asked for still more proof.

By the end of 1961, doctors in Germany and Australia had found the answer. Thalidomide, taken by women early in pregnancy, caused terrible birth defects. Thousands of babies around the world were born with shortened or missing arms and legs, and many others died. The drug was withdrawn. Because Kelsey had held her ground, it had never been approved for sale in the United States, although some American patients had received it in tests.

Kelsey herself spoke of the case modestly. She said that she had simply done her job and that her colleagues had supported her. Yet doing that job had meant resisting more than a year of pressure from a powerful company, with nothing to rely on but a principled refusal to approve what had not been proved. In 1962, President Kennedy gave her the highest award for a civilian in government service.

The same year, Congress passed a law that required drug companies to show that a medicine was effective, not only safe, and to tell patients when a drug was still being tested. Her misgiving had become the rule.`,
      [conscience, investigative, academic11, academic1, academic3, academic2],
      [
        ask(
          t("Why did Kelsey refuse to approve the drug at first?", "凯尔西起初为什么拒绝批准这种药？"),
          t("The company's evidence of safety seemed too thin to her", "她觉得公司提供的安全证据太单薄"),
          [
            t("She already knew that it caused birth defects", "她已经知道它会导致出生缺陷"),
            t("The drug had never been sold in any other country", "这种药从未在任何其他国家销售过"),
            t("Her colleagues had ordered her to stop the application", "她的同事命令她停止这份申请"),
          ],
          t(
            "The second paragraph says the studies seemed thin and the claims of safety were not supported by the evidence she expected, so she asked for more data.",
            "第二段说研究显得单薄，安全性的说法没有她所期望的证据支持，所以她要求提供更多数据。",
          ),
        ),
        ask(
          t("What question did the report about damaged nerves lead Kelsey to ask?", "关于神经损伤的报告让凯尔西提出了什么问题？"),
          t("What the drug might do to a child before birth", "这种药可能对出生前的孩子造成什么影响"),
          [
            t("Whether the company had paid the British journal", "公司是否给英国期刊付了钱"),
            t("How many pills a person would need to sleep", "一个人需要吃多少片药才能入睡"),
            t("Why the drug was so cheap in Europe", "为什么这种药在欧洲如此便宜"),
          ],
          t(
            "The second paragraph says she asked what the drug might do to an unborn child if it could harm adult nerves.",
            "第二段说她问：如果这种药能损伤成人的神经，它会对未出生的孩子造成什么影响。",
          ),
        ),
        ask(
          t('What does the last sentence, "Her misgiving had become the rule," mean?', "最后一句“她的疑虑成了规则”是什么意思？"),
          t("The new law required the kind of proof that she had demanded", "新法律要求的正是她曾要求的那种证明"),
          [
            t("Every doctor in government now had to share her personal doubts", "政府里的每个医生现在都必须分享她个人的疑虑"),
            t("She was given the power to write all the country's laws", "她被赋予了制定国家所有法律的权力"),
            t("The company admitted that it had been wrong from the start", "公司承认自己从一开始就错了"),
          ],
          t(
            "The last paragraph says Congress required companies to show that a medicine was effective and safe, which turned her careful doubt into law.",
            "最后一段说国会要求公司证明药物有效且安全，这把她审慎的怀疑变成了法律。",
          ),
        ),
      ],
      [
        "Frances",
        "Kelsey",
        "Kelsey's",
        "Kevadon",
        "Europe",
        "European",
        "Germany",
        "Kennedy",
        "John",
        "F.",
        "Food",
        "Drug",
        "Administration",
      ],
    ),
    passage(
      "the-laboratory-of-obedience",
      t("The Laboratory of Obedience", "服从的实验室"),
      `In 1961, a young psychologist at Yale University named Stanley Milgram placed an advertisement in a Connecticut newspaper. He offered a small payment to people who would take part in a study of memory. What the volunteers did not know was that the study was really about something else: how far ordinary people would go in obeying an authority who told them to hurt someone.

Each volunteer was given the role of "teacher." In the next room sat a "learner," who was really an actor working with Milgram. The teacher read pairs of words, and whenever the learner made a mistake, the teacher was told to give him an electric shock by pressing a switch. The switches were labeled from 15 to 450 volts, with words such as "Danger: Severe Shock" near the top. No shocks were actually given, but the teacher did not know this. As the voltage rose, the actor shouted, complained of his heart, and then fell silent.

When teachers hesitated, a calm man in a gray coat said things like "The experiment requires that you continue." In the best-known version of the study, about two in three of the forty volunteers kept pressing switches all the way to 450 volts. Many sweated, trembled and protested, but they did not stop. Before the study, experts Milgram asked had predicted that almost no one would go so far.

Milgram also changed the conditions. When the man in the gray coat gave orders by telephone instead of in person, far fewer people obeyed. When two other "teachers," also actors, refused to go on, most volunteers refused as well. Obedience, it seemed, was not an intrinsic trait of certain people but something shaped by the situation.

The study has been criticized ever since. Some argue that it was cruel to the volunteers, who left believing they might have hurt someone. Others question whether people truly believed the shocks were real. Yet its main lesson has proved hard to forget. Doing wrong does not always require bad people. It may require only someone in authority, an orderly setting and a series of small steps, each only a little worse than the last. Those who refused showed that the steps could be resisted.`,
      [conscience, power, academic10, academic3],
      [
        ask(
          t("What was the real purpose of Milgram's study?", "米尔格拉姆研究的真正目的是什么？"),
          t("To see how far people would obey an authority who told them to hurt someone", "看人们会在多大程度上服从让他们伤害别人的权威"),
          [
            t("To test whether electric shocks could improve people's memory", "测试电击是否能提高人们的记忆力"),
            t("To find out how much money volunteers would accept", "弄清志愿者愿意接受多少钱"),
            t("To train actors to pretend to be in pain", "训练演员假装痛苦"),
          ],
          t(
            "The first paragraph says the study was presented as one of memory but was really about how far ordinary people would obey an authority.",
            "第一段说这项研究表面上是关于记忆的，实际上是关于普通人会在多大程度上服从权威。",
          ),
        ),
        ask(
          t('What happened when two other "teachers" refused to continue?', "当另外两位“老师”拒绝继续时发生了什么？"),
          t("Most volunteers also refused", "大多数志愿者也拒绝了"),
          [
            t("The man in the gray coat ended the study", "穿灰大褂的人结束了研究"),
            t("The volunteers gave even stronger shocks", "志愿者施加了更强的电击"),
            t("The learner admitted that he was an actor", "学习者承认自己是演员"),
          ],
          t(
            "The fourth paragraph says that when two actors playing teachers refused to go on, most volunteers refused as well.",
            "第四段说，当两个扮演老师的演员拒绝继续时，大多数志愿者也拒绝了。",
          ),
        ),
        ask(
          t("What lesson does the writer draw from the study?", "作者从这项研究中得出了什么教训？"),
          t(
            "Ordinary people can do wrong in small steps under authority, but they can resist",
            "普通人可能在权威之下一步步做错事，但他们也能抵抗",
          ),
          [
            t("Only people with cruel personalities will obey harmful orders", "只有性格残忍的人才会服从有害的命令"),
            t("Experts can always predict how people will behave", "专家总能预测人们会如何行事"),
            t("Psychology studies should never use actors or advertisements", "心理学研究绝不应使用演员或广告"),
          ],
          t(
            "The last paragraph says doing wrong may require only authority, order and small steps, and that those who refused showed the steps could be resisted.",
            "最后一段说做错事可能只需要权威、秩序和一系列小步骤，而那些拒绝的人表明这些步骤是可以抵抗的。",
          ),
        ),
      ],
      ["Stanley", "Milgram", "Milgram's", "Yale", "Connecticut"],
    ),
    passage(
      "the-company-that-hid-its-debts",
      t("The Company That Hid Its Debts", "隐藏债务的公司"),
      `At the end of the 1990s, Enron, an energy company based in Houston, Texas, was one of the most admired businesses in the United States. Magazines praised it as a model of new thinking. Its stock price rose year after year, and many of its employees put their retirement savings into it. Enron reported huge profits from trading energy and other goods.

Much of that success was ostensible. The company had set up hundreds of separate partnerships, which it controlled but did not include in its main accounts. Enron moved its debts and its failing investments into these partnerships, so that its own books looked healthy. Some of the partnerships were run by Enron's own financial officers, who earned millions from them. The arrangement was tantamount to hiding the company's losses from the people who owned it.

In August 2001, a vice president named Sherron Watkins wrote a memo to the head of the company, Kenneth Lay. She warned that Enron might "implode in a wave of accounting scandals." She was forthright about what she had found, and she urged him to investigate. The company did hire lawyers to look into her concerns, but they did not dig deeply, and the warnings went no further.

Within months the truth came out. In October, Enron announced a large loss and admitted that its profits had been overstated for years. Investors fled. In December 2001, the company declared bankruptcy, at the time the largest in American history. Thousands of employees lost their jobs, and many lost their savings, because the shares in their retirement accounts became nearly worthless.

The collapse spread. Arthur Andersen, the accounting firm that had approved Enron's books, was convicted of destroying documents; the conviction was later overturned, but the firm had already fallen apart. Several Enron leaders were sent to prison. In 2002, Congress passed a law requiring the heads of companies to swear that their accounts were accurate and protecting employees who report fraud.

Watkins became one of the best-known figures of the scandal. She had not gone to the press or the government; she had spoken up inside the company. Her case showed both the value of such a voice and its limits: a warning helps only if those in power are willing to hear it.`,
      [power, conscience, investigative, academic11],
      [
        ask(
          t(
            'What does "Much of that success was ostensible" mean in the second paragraph?',
            "第二段中“那种成功大多是表面上的”是什么意思？",
          ),
          t("The success appeared real but was largely an illusion", "那种成功看起来真实，但很大程度上是假象"),
          [
            t("The success was earned slowly through honest work", "那种成功是通过诚实的工作慢慢获得的"),
            t("The success was kept secret from the newspapers", "那种成功对报纸保密"),
            t("The success belonged only to the company's employees", "那种成功只属于公司的员工"),
          ],
          t(
            "The paragraph explains that Enron hid its debts in partnerships so its books looked healthy, which shows the success was only apparent.",
            "这一段解释说安然把债务藏在合伙企业中，使账目看起来健康，这说明那种成功只是表面的。",
          ),
        ),
        ask(
          t("Why did many employees lose their savings?", "为什么许多员工失去了积蓄？"),
          t("Their retirement accounts held Enron shares that became nearly worthless", "他们的退休账户里持有的安然股票几乎变得一文不值"),
          [
            t("The partnerships stole the money directly from their banks", "合伙企业直接从他们的银行偷走了钱"),
            t("The government took the money to pay Enron's debts", "政府拿走这笔钱去偿还安然的债务"),
            t("They spent it all on lawyers during the bankruptcy", "他们在破产期间把钱都花在了律师身上"),
          ],
          t(
            "The fourth paragraph says many lost their savings because the shares in their retirement accounts became nearly worthless.",
            "第四段说许多人失去积蓄，是因为他们退休账户中的股票几乎变得一文不值。",
          ),
        ),
        ask(
          t("What does the writer say Watkins's case shows?", "作者说沃特金斯的事例说明了什么？"),
          t("A warning helps only if people in power are willing to listen", "只有当掌权者愿意倾听时，警告才有用"),
          [
            t("Employees should never speak up inside their own company", "员工绝不应在自己的公司内部发声"),
            t("Going to the press is always the wrong choice", "向媒体反映总是错误的选择"),
            t("Accounting firms can be trusted to find every fraud", "会计师事务所值得信赖，能发现每一起欺诈"),
          ],
          t(
            "The last paragraph says her case showed the value and the limits of an inside voice: a warning helps only if those in power are willing to hear it.",
            "最后一段说她的事例显示了内部发声的价值和局限：只有掌权者愿意听，警告才有用。",
          ),
        ),
      ],
      ["Enron", "Enron's", "Houston", "Texas", "Sherron", "Watkins", "Kenneth", "Lay", "Arthur", "Andersen", "Congress"],
    ),
    passage(
      "a-historians-warning",
      t("A Historian's Warning", "一位历史学家的警告"),
      `"Power tends to corrupt, and absolute power corrupts absolutely." The sentence is quoted so often that many people think it is an old proverb. In fact it comes from a letter written in 1887 by a British historian, Lord Acton, and it was part of an argument about how historians should write.

Acton was a Catholic and one of the most learned men in Europe. His friend Mandell Creighton, a scholar who later became a bishop, had written a history of the popes of the late Middle Ages, a time when several popes had used their office to enrich their families, practiced open nepotism and even ordered violence. Creighton described these men calmly and tried to understand the pressures of their time. Acton thought this was a mistake.

In his letter, Acton argued that the powerful should be judged not by a lower standard than other people but by a higher one. A historian, he wrote, should not excuse a ruler because the ruler was great; great men are almost always bad men, he added, because power itself tempts those who hold it. If ordinary people are blamed for small wrongs, the leaders who commit great ones deserve more blame, not less. To excuse them was to teach readers that power places a person above morality.

Acton's famous sentence is often shortened to "Power corrupts," but the word "tends" matters. He did not claim that every powerful person becomes corrupt. He claimed that power pushes people in that direction, and that the more power has no limit, the stronger the push becomes. That is why he valued laws, courts and divided authority: they check the push before it turns into impunity.

Creighton replied politely and did not change his view. He believed a historian should understand before judging. The two men's disagreement is still alive. Some historians try to describe the past in its own terms; others insist that some acts are wrong in any age.

Yet Acton's sentence has outlived the argument that produced it. It is quoted by people who have never heard of Creighton or the popes, because it seems to describe something that each generation discovers again: that the people who most need to be watched are often the ones with the fewest people watching them.`,
      [power, conscience, academic10],
      [
        ask(
          t("What was the argument in which Acton's famous sentence first appeared?", "阿克顿的名言最初出现在什么争论中？"),
          t("A disagreement about how historians should judge powerful people", "一场关于历史学家应如何评判有权势者的分歧"),
          [
            t("A debate in parliament about raising taxes on the rich", "议会中关于向富人加税的辩论"),
            t("A quarrel between two popes about who should rule the church", "两位教皇之间关于谁应统治教会的争吵"),
            t("A lecture at Cambridge about the history of proverbs", "剑桥一场关于谚语历史的讲座"),
          ],
          t(
            "The first and second paragraphs say the sentence came from a letter in an argument about how historians should write about powerful men such as the popes.",
            "第一段和第二段说这句话出自一封信，信中争论的是历史学家应如何书写教皇等有权势的人。",
          ),
        ),
        ask(
          t('Why does the writer say the word "tends" matters?', "作者为什么说“倾向于”这个词很重要？"),
          t(
            "Acton claimed power pushes people toward corruption, not that it always corrupts",
            "阿克顿认为权力把人推向腐败，而不是说它总会使人腐败",
          ),
          [
            t("It shows that Acton was not sure his sentence was correct", "它说明阿克顿不确定自己的话是否正确"),
            t("It proves that Creighton had written the sentence first", "它证明克赖顿先写了这句话"),
            t("It means that only absolute rulers are ever corrupted", "它意味着只有专制统治者才会腐败"),
          ],
          t(
            "The fourth paragraph says Acton did not claim every powerful person becomes corrupt, only that power pushes people in that direction.",
            "第四段说阿克顿并没有说每个有权势的人都会腐败，只是说权力把人推向那个方向。",
          ),
        ),
        ask(
          t("Why did Acton value laws, courts and divided authority?", "阿克顿为什么重视法律、法院和分权？"),
          t("They limit power before it lets people escape all punishment", "它们在权力让人逃脱一切惩罚之前限制它"),
          [
            t("They made historians' work easier to publish", "它们使历史学家的作品更容易出版"),
            t("They gave the popes more freedom to act", "它们给了教皇更多的行动自由"),
            t("They removed the need to judge anyone at all", "它们消除了评判任何人的必要"),
          ],
          t(
            "The fourth paragraph says these institutions check the push of power before it turns into impunity.",
            "第四段说这些制度在权力的推动变成有恃无恐之前加以制约。",
          ),
        ),
      ],
      ["Lord", "Acton", "Acton's", "John", "Dalberg-Acton", "Mandell", "Creighton", "Creighton's", "Cambridge", "Europe", "Catholic"],
    ),
    passage(
      "the-secret-history-of-a-war",
      t("The Secret History of a War", "一场战争的秘史"),
      `In 1967, Robert McNamara, the American secretary of defense, ordered a secret study of how the United States had become involved in the war in Vietnam. A team of researchers worked through the government's own files from 1945 onward. Their report, finished in 1969, filled about seven thousand pages. It became known as the Pentagon Papers.

One of the researchers was a military analyst named Daniel Ellsberg. He had once supported the war, but reading the full history changed his mind. The papers showed that several presidents had told the public one thing while privately believing another: that they had expanded the war while saying they would not, and that they had doubted it could be won while saying victory was near. Ellsberg came to believe that the American people had been misled for years, and that the war, which was still killing thousands, would continue unless they knew.

He had a misgiving about breaking the law, which forbade sharing secret documents. Yet he decided that keeping silent would be worse. In 1969, working at night, he copied the report page by page. After he failed to persuade members of Congress to release it, he gave copies to the New York Times.

On June 13, 1971, the newspaper began to publish the papers. The administration of President Richard Nixon went to court, and a judge ordered the Times to stop, the first time a court had stopped an American newspaper from publishing a story about national security. Other newspapers began to print parts of the papers instead. Within two weeks, the Supreme Court ruled, six votes to three, that the government had not shown that publication would cause the kind of harm that justified stopping it.

Ellsberg was charged with crimes that could have sent him to prison for more than a hundred years. But during his trial it came out that men working for the White House had broken into his psychiatrist's office, looking for information to discredit him. In 1973 the judge dismissed the case because of the government's misconduct.

Ellsberg always said that he had acted on conscience and was prepared to accept the punishment. Whether he was right to break the law is still debated. What is not debated is that the papers changed how many Americans viewed the word of their leaders.`,
      [conscience, investigative, academic11, academic2],
      [
        ask(
          t("What did the Pentagon Papers show, according to the passage?", "根据文章，五角大楼文件显示了什么？"),
          t(
            "Presidents had said one thing in public about the war while believing another",
            "总统们在公开场合对战争说的是一回事，心里想的是另一回事",
          ),
          [
            t("The war in Vietnam had been won years before it ended", "越南战争在结束前好几年就已经打赢了"),
            t("McNamara had started the war without telling any president", "麦克纳马拉在没有告诉任何总统的情况下发动了战争"),
            t("Ellsberg had written most of the report by himself", "埃尔斯伯格独自写了报告的大部分"),
          ],
          t(
            "The second paragraph says the papers showed presidents telling the public one thing while privately believing another about the war.",
            "第二段说这些文件表明，总统们在战争问题上对公众说一套，私下却另有看法。",
          ),
        ),
        ask(
          t("Why did the Supreme Court allow the newspapers to publish?", "最高法院为什么允许报纸发表？"),
          t("The government had not shown publication would cause enough harm", "政府没有证明发表会造成足够严重的伤害"),
          [
            t("The newspapers promised to publish only the harmless pages", "报纸承诺只发表无害的部分"),
            t("Ellsberg had already been found innocent in court", "埃尔斯伯格已经在法庭上被判无罪"),
            t("The president asked the court to let them publish", "总统请求法院允许他们发表"),
          ],
          t(
            "The fourth paragraph says the Court ruled that the government had not shown the kind of harm that justified stopping publication.",
            "第四段说法院裁定政府没有证明那种足以阻止发表的伤害。",
          ),
        ),
        ask(
          t("Why was the case against Ellsberg dismissed?", "针对埃尔斯伯格的案件为什么被驳回？"),
          t("Men working for the White House had broken into his psychiatrist's office", "为白宫工作的人闯入了他的心理医生的办公室"),
          [
            t("He proved that the papers had never been secret", "他证明了这些文件从来不是机密"),
            t("Congress passed a law that pardoned him", "国会通过了一项赦免他的法律"),
            t("The newspaper agreed to pay his fine", "报社同意替他支付罚款"),
          ],
          t(
            "The fifth paragraph says the judge dismissed the case because of government misconduct, including the break-in at his psychiatrist's office.",
            "第五段说法官因政府的不当行为驳回了此案，其中包括闯入他的心理医生办公室。",
          ),
        ),
      ],
      [
        "Americans",
        "Richard",
        "Daniel",
        "Ellsberg",
        "Ellsberg's",
        "Vietnam",
        "Pentagon",
        "Papers",
        "New",
        "York",
        "Times",
        "Nixon",
        "Robert",
        "McNamara",
        "RAND",
      ],
    ),
    passage(
      "the-policeman-who-would-not-take-money",
      t("The Policeman Who Would Not Take Money", "不收钱的警察"),
      `When Frank Serpico joined the New York City police in 1959, he wanted to be the kind of officer he had admired as a boy. Within a few years he learned that many of his fellow officers saw the job differently. In some precincts, officers collected regular payments from illegal gambling operations and other businesses in return for leaving them alone. The money was divided among officers, and a man who refused it was treated with suspicion.

Serpico refused. He did not want to be paid for looking away, and he knew that an officer who took money could not enforce the law fairly. His refusal made him an outsider. Officers who took the payments wondered whether he would report them, and some made it clear that he was not welcome.

He did try to report them. For several years he went to his superiors and to officials in the city government, describing what he had seen. He was told to be patient, or that the matter would be looked into, or that he should forget it. Little happened. The corruption was so pervasive that the people he reported it to often had reasons of their own to keep it quiet.

In 1970, Serpico and another officer took their story to the New York Times. The newspaper's report, describing payments of millions of dollars a year, forced the mayor to act. A commission, named after its chairman, Whitman Knapp, was formed to investigate. Its hearings showed that corruption reached through many parts of the department.

Before Serpico could testify, he was shot in the face during a drug raid in Brooklyn in 1971. He survived, though he lost hearing in one ear. Many people believed that the officers with him had been slow to help, although this was never proved. Months later, he told the commission that the problem was not a few bad officers but a culture that protected them.

Serpico was not a perfect hero, and he never claimed to be. But his case shows what doing one's duty can cost when the people around you are doing something else, and why an upright officer needs more than personal honesty: he needs an institution willing to listen.`,
      [power, conscience, academic10],
      [
        ask(
          t("Why did Serpico's refusal make him an outsider?", "为什么塞尔皮科的拒绝使他成了局外人？"),
          t("Officers who took payments feared he might report them", "收钱的警察担心他可能会举报他们"),
          [
            t("He did not speak the same language as the other officers", "他和其他警察说的语言不一样"),
            t("He asked to be paid more than the other officers", "他要求比其他警察拿更多的钱"),
            t("His superiors had told him to stay away from them", "他的上司让他远离他们"),
          ],
          t(
            "The second paragraph says officers who took payments wondered whether he would report them, so he was not welcome.",
            "第二段说收钱的警察怀疑他会举报他们，所以他不受欢迎。",
          ),
        ),
        ask(
          t("Why did Serpico's reports to his superiors lead to little action?", "为什么塞尔皮科向上级的举报几乎没有结果？"),
          t("Corruption was so widespread that many officials wanted it kept quiet", "腐败如此普遍，许多官员都希望把它压下去"),
          [
            t("He reported it only once and then gave up", "他只举报了一次就放弃了"),
            t("His reports were written in a way no one could understand", "他的举报写得没人能看懂"),
            t("There was no law against taking such payments", "当时没有法律禁止收这种钱"),
          ],
          t(
            "The third paragraph says the corruption was so pervasive that the people he reported it to often had reasons to keep it quiet.",
            "第三段说腐败如此普遍，他举报的对象往往有自己的理由要把事情压下去。",
          ),
        ),
        ask(
          t("What did Serpico tell the commission was the real problem?", "塞尔皮科告诉委员会真正的问题是什么？"),
          t("A culture in the department that protected corrupt officers", "部门里一种保护腐败警察的风气"),
          [
            t("A small number of bad officers in one precinct", "一个辖区里的少数坏警察"),
            t("The newspaper's habit of exaggerating its stories", "报纸夸大报道的习惯"),
            t("The low salaries that the mayor paid the police", "市长给警察的低工资"),
          ],
          t(
            "The fifth paragraph says he told the commission that the problem was not a few bad officers but a culture that protected them.",
            "第五段说他告诉委员会，问题不在于几个坏警察，而在于一种保护他们的风气。",
          ),
        ),
      ],
      ["Frank", "Serpico", "Serpico's", "New", "York", "Knapp", "Whitman", "Commission", "Brooklyn", "City"],
    ),
    passage(
      "the-judge-who-took-no-inkstone",
      t("The Judge Who Took No Inkstone", "不持一砚的清官"),
      `Nearly a thousand years ago, in the Song dynasty of China, an official named Bao Zheng was sent to govern Duanzhou, a district in the south. The district was famous for its inkstones, the flat stones on which scholars ground ink for writing. Duanzhou inkstones were among the finest in the country, and they were sent every year as tribute to the emperor's court.

Officials before Bao had used this duty for their own profit. They demanded many more inkstones than the court required and gave the extra ones as gifts to powerful friends in the capital. The craftsmen who made the stones paid the cost. Bao ordered that only the number the court required should be made. According to the official history of the dynasty, when he left the district after his years of service, he did not take a single inkstone with him.

The story is small, but it was remembered because it was rare. In an age when gifts and favors were the ordinary way to advance, a man who refused even the kind of present that every scholar would want was showing that his rectitude did not depend on the size of the temptation.

Bao later served in the capital, Kaifeng, where he became famous for treating the powerful and the humble alike. He is said to have opened the doors of his court so that ordinary people could bring their complaints to him directly, without paying the clerks who usually stood in the way. Relatives of the emperor and high officials who broke the law found that their rank did not protect them.

Before he died, Bao left an instruction for his family. Any descendant who took a bribe while in office, he wrote, should not be allowed to return home or be buried in the family graves. For a family of that time, there were few punishments more serious.

Over the centuries, Bao Zheng became a hero of stories and operas, in which "Judge Bao" solves crimes and punishes the wicked, sometimes with powers no real judge ever had. The legends grew far beyond the facts. But they grew from a real reputation: that of an official whose probity was unimpeachable and who believed that the law should reach everyone.`,
      [conscience, power, academic11, academic3],
      [
        ask(
          t("Why did earlier officials of Duanzhou demand extra inkstones?", "端州以前的官员为什么索要额外的砚台？"),
          t("To give them as gifts to powerful people in the capital", "把它们当作礼物送给京城的权贵"),
          [
            t("To sell them to scholars in other countries", "把它们卖给其他国家的学者"),
            t("To replace the inkstones the court had lost", "补上朝廷丢失的砚台"),
            t("To pay the craftsmen who made the stones", "用来支付制砚工匠的报酬"),
          ],
          t(
            "The second paragraph says they demanded more than the court required and gave the extra ones as gifts to powerful friends in the capital.",
            "第二段说他们索要的比朝廷要求的多，并把多出来的送给京城里有权势的朋友。",
          ),
        ),
        ask(
          t("Why does the writer say the inkstone story was remembered?", "作者说为什么砚台的故事会被记住？"),
          t("Because refusing such gifts was rare at a time when favors were normal", "因为在送礼求助很平常的时代，拒绝这种礼物很少见"),
          [
            t("Because the inkstone Bao refused was the largest ever made", "因为包拯拒绝的砚台是有史以来最大的"),
            t("Because the emperor wrote a poem about it", "因为皇帝为此写了一首诗"),
            t("Because Bao told the story in every one of his speeches", "因为包拯在每次讲话中都讲这个故事"),
          ],
          t(
            "The third paragraph says the story was remembered because it was rare in an age when gifts and favors were the ordinary way to advance.",
            "第三段说这个故事之所以被记住，是因为在送礼和人情是升迁常道的时代，这样的事很少见。",
          ),
        ),
        ask(
          t('How does the writer treat the legends of "Judge Bao"?', "作者如何看待“包青天”的传说？"),
          t("As exaggerations that grew from a real reputation for honesty", "是从真实的清廉名声中生发出来的夸张故事"),
          [
            t("As exact records of crimes that Bao actually solved", "是包拯真正破过的案件的准确记录"),
            t("As stories invented with no connection to any real person", "是与任何真实人物都无关的虚构故事"),
            t("As proof that Bao had magical powers as a judge", "是包拯作为法官拥有神奇力量的证据"),
          ],
          t(
            "The last paragraph says the legends grew far beyond the facts but grew from a real reputation for unimpeachable probity.",
            "最后一段说传说远远超出了事实，但它们源于一种真实的名声：无可指摘的清廉。",
          ),
        ),
      ],
      ["Bao", "Zheng", "Zheng's", "Duanzhou", "Kaifeng", "Song", "China", "Chinese"],
    ),
  ],
};
