// Grades 9 to 12: the reading unit of the fourth theme, rights and laws, from old codes of law to the courtroom.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grades-6-8/reading-kit.ts";

const clues = { topic: "context-clues", weight: 0.2 } as const;
const law = { topic: "words-of-government-and-law", weight: 0.3 } as const;
const fallacies = { topic: "logical-fallacies", weight: 0.2 } as const;
const academic = { topic: "academic-words-1", weight: 0.1 } as const;

/** rightsAndLaws is a reading unit of grades 9 to 12 on how laws are made, judged and changed, and on rights won. */
export const rightsAndLaws: ReadingUnitDef = {
  id: "rights-and-laws",
  title: t("Rights and Laws", "权利与法律"),
  passages: [
    passage(
      "laws-carved-in-stone",
      t("Laws Carved in Stone", "刻在石头上的法律"),
      `Nearly four thousand years ago, a king named Hammurabi ruled the city of Babylon, in what is now Iraq. Near the end of his reign, he ordered a set of laws to be carved onto a tall black stone and placed where people could see it. The stone, which stands more than two meters high, was discovered by archaeologists in 1901 and is now kept in a museum in Paris.

The code contains about 280 laws. They cover almost every part of daily life: trade, farming, marriage, debts, property and crime. One law says that if a builder makes a house that falls down and kills its owner, the builder must be put to death. Another says that a person who rents a field but fails to grow crops must still pay the owner as if the harvest had been normal.

Many of the punishments seem harsh today. The code is famous for the idea of "an eye for an eye": a person who blinds another may lose an eye in return. Punishments also depended on social class. Harming a rich man brought a much heavier penalty than harming a poor man or a slave.

Yet the code was also an important step. By writing the laws down and displaying them in public, Hammurabi made them the same for everyone in each class, and difficult for a judge to change at will. A person accused of a crime could, at least in principle, know what the law said. The code also included the idea that an accused person should be judged on evidence, and it punished people who made false accusations.

Hammurabi presented himself as a protector of the weak. At the top of the stone, he is shown standing before a god of justice, receiving the authority to rule. The image was a message: the laws came not just from the king but from heaven, and they were meant to last.`,
      [clues, law, academic],
      [
        ask(
          t("Why was it important that the laws were carved in stone and displayed in public?", "为什么把法律刻在石头上并公开展示很重要？"),
          t("People could know the laws, and judges could not easily change them", "人们可以知道法律，法官也不能随意更改"),
          [
            t("Stone was the only material available", "石头是唯一能用的材料"),
            t("It made the punishments less harsh", "这让刑罚变得不那么严厉"),
            t("It allowed the king to hide the laws from the poor", "这让国王能对穷人隐瞒法律"),
          ],
          t(
            "The fourth paragraph says writing and displaying the laws made them hard for a judge to change at will, and an accused person could know what the law said.",
            "第四段说，把法律写下来并公开，法官就难以随意更改，被告也能知道法律的内容。",
          ),
        ),
        ask(
          t("What does the passage show about justice and social class in the code?", "关于法典中的正义与社会阶层，文章说明了什么？"),
          t("Punishments depended on whether the victim was rich or poor", "刑罚取决于受害者是富人还是穷人"),
          [
            t("All people were treated exactly the same", "所有人受到的待遇完全一样"),
            t("Only slaves could be punished", "只有奴隶才会受罚"),
            t("Only the rich could be punished", "只有富人才会受到惩罚"),
          ],
          t(
            "The passage says harming a rich man brought a much heavier penalty than harming a poor man or a slave.",
            "文章说，伤害富人受到的惩罚比伤害穷人或奴隶重得多。",
          ),
        ),
        ask(
          t("What message did the image at the top of the stone send?", "石碑顶部的图像传达了什么信息？"),
          t("The laws had the authority of the gods as well as the king", "这些法律既有国王的权威，也有神的权威"),
          [
            t("The king was afraid of the gods", "国王害怕众神"),
            t("The laws would soon be changed", "这些法律很快就会被修改"),
            t("Judges were more powerful than kings", "法官比国王更有权力"),
          ],
          t(
            "The image shows Hammurabi receiving authority from a god of justice, so the laws seemed to come from heaven and were meant to last.",
            "图像显示汉谟拉比从正义之神那里接受权力，因此这些法律仿佛来自上天，意在长存。",
          ),
        ),
      ],
      ["Hammurabi", "Babylon", "Iraq", "Paris"],
    ),
    passage(
      "the-great-charter",
      t("The Great Charter", "大宪章"),
      `In June 1215, in a meadow beside the River Thames, King John of England met a group of angry barons. The king had lost wars in France, raised taxes again and again and punished his enemies without trial. The barons had had enough. They had captured London, and they demanded that the king accept limits on his power. The document he agreed to became known as Magna Carta, Latin for "Great Charter."

Most of the charter dealt with the barons' own complaints, such as taxes and the rights of widows to inherit property. But a few of its clauses expressed ideas that would echo for centuries. The most famous says that no free man shall be arrested, imprisoned or deprived of his property except by the lawful judgment of his equals or by the law of the land. Another promises: "To no one will we sell, to no one deny or delay right or justice."

The charter did not bring peace. Within weeks, King John asked the pope to cancel it, and war broke out again. John died the next year, but the charter was reissued several times by later kings, each time slightly changed, and parts of it became part of English law.

Its real importance grew over time. Magna Carta established the principle that even a king was subject to the law. Later generations read its words more broadly than the barons had intended. "Free man" came to mean every person, and the right to judgment by one's equals became the idea of trial by jury.

When the founders of the United States wrote their constitution more than five centuries later, they drew on these ideas. The promise of due process of law, that the government cannot take a person's life, liberty or property without fair legal procedures, can be traced back to that meadow by the Thames.`,
      [clues, law, { topic: "academic-words-2", weight: 0.1 }],
      [
        ask(
          t("Why did the barons force King John to accept the charter?", "贵族们为什么迫使约翰国王接受这份宪章？"),
          t("He had raised taxes and punished enemies without trial", "他一再加税，并且不经审判就惩罚敌人"),
          [
            t("He wanted to give up his throne", "他想放弃王位"),
            t("The pope had ordered it", "教皇下令这样做"),
            t("He had won too many wars in France", "他在法国打赢了太多战争"),
          ],
          t(
            "The first paragraph says the king had lost wars, raised taxes again and again and punished his enemies without trial.",
            "第一段说，国王打了败仗，一再加税，并且不经审判就惩罚敌人。",
          ),
        ),
        ask(
          t("What principle did Magna Carta establish, according to the passage?", "根据文章，大宪章确立了什么原则？"),
          t("Even a king is subject to the law", "即使是国王也要受法律约束"),
          [
            t("Kings may change the law whenever they wish", "国王可以随时修改法律"),
            t("Only barons have rights", "只有贵族享有权利"),
            t("Taxes must never be raised", "永远不得加税"),
          ],
          t(
            "The fourth paragraph says that Magna Carta established the principle that even a king was subject to the law.",
            "第四段说，大宪章确立了即使国王也要受法律约束的原则。",
          ),
        ),
        ask(
          t('How did the meaning of "free man" change over time?', "“自由人”一词的含义随着时间如何变化？"),
          t("It came to include every person, not only the barons' class", "它逐渐涵盖每一个人，而不只是贵族阶层"),
          [
            t("It came to mean only the king", "它逐渐只指国王"),
            t("It stopped being used at all", "它完全不再被使用"),
            t("It came to mean a person who pays no taxes", "它逐渐指不交税的人"),
          ],
          t(
            'Later generations read the words more broadly than the barons intended, and "free man" came to mean every person.',
            "后人对这些词的理解比贵族们原本的意思更宽泛，“自由人”逐渐指每一个人。",
          ),
        ),
      ],
      ["John", "England", "Thames", "France", "London", "Magna", "Carta", "Latin", "English", "United", "States"],
    ),
    passage(
      "how-a-jury-decides",
      t("How a Jury Decides", "陪审团如何作出裁决"),
      `In many countries, when a person is accused of a serious crime, the question of guilt is decided not by a judge alone but by a jury, a group of ordinary citizens chosen at random. The idea is old, but it rests on a simple belief: that the community itself should decide whether one of its members has broken the law.

A jury usually has twelve members, though the number varies. Before a trial, lawyers for both sides question possible jurors to make sure they have no strong connection to the case and can judge it fairly. A juror who knows the accused, or who has already made up their mind, may be sent home.

During the trial, the jurors listen to witnesses, look at evidence and hear the arguments of the lawyers. They are not allowed to investigate the case themselves or to read news reports about it. The judge decides questions of law, such as which evidence may be shown, while the jury decides questions of fact: what really happened.

In a criminal trial, the prosecution must prove its case "beyond a reasonable doubt." This is a high standard. Jurors do not have to be absolutely certain, but if a reasonable person would still have serious doubts about the guilt of the accused, the jury must find them not guilty. The rule reflects a belief that it is worse to punish an innocent person than to let a guilty one go free.

After the trial, the jurors meet in private to discuss the case. They must reach a verdict together, and in many places it must be unanimous. Discussions can last hours or days. Jurors must base their decision only on the evidence, not on sympathy, prejudice or the personality of the lawyers. Serving on a jury is one of the few duties that a democracy asks of almost every adult citizen.`,
      [clues, law, academic],
      [
        ask(
          t("What is the difference between the work of the judge and the jury?", "法官和陪审团的工作有什么区别？"),
          t("The judge decides questions of law; the jury decides questions of fact", "法官决定法律问题；陪审团决定事实问题"),
          [
            t("The judge chooses the jurors; the jury chooses the judge", "法官挑选陪审员；陪审团挑选法官"),
            t("The jury writes laws; the judge enforces them", "陪审团制定法律；法官执行法律"),
            t("There is no difference between them", "两者没有区别"),
          ],
          t(
            "The third paragraph says the judge decides which evidence may be shown, while the jury decides what really happened.",
            "第三段说，法官决定哪些证据可以出示，而陪审团决定究竟发生了什么。",
          ),
        ),
        ask(
          t('What does "beyond a reasonable doubt" require?', "“排除合理怀疑”要求什么？"),
          t(
            "If a reasonable person would still seriously doubt guilt, the verdict is not guilty",
            "如果一个理性的人仍对有罪存有严重怀疑，就必须判无罪",
          ),
          [
            t("Jurors must be absolutely certain of everything", "陪审员必须对一切都绝对确定"),
            t("Any small doubt means the accused is guilty", "任何一点怀疑都意味着被告有罪"),
            t("The judge decides guilt alone", "由法官一人决定是否有罪"),
          ],
          t(
            "The passage says jurors need not be absolutely certain, but serious doubt in a reasonable person's mind means a verdict of not guilty.",
            "文章说，陪审员不必绝对确定，但如果理性的人仍有严重怀疑，就必须判无罪。",
          ),
        ),
        ask(
          t("What does the word unanimous most likely mean in the last paragraph?", "最后一段中的 unanimous 最可能是什么意思？"),
          t("Agreed on by every member", "全体成员一致同意"),
          [t("Decided by the judge alone", "由法官一人决定"), t("Reached very quickly", "很快作出"), t("Kept secret forever", "永远保密")],
          t(
            "Context clue: the jurors must reach a verdict together, and in many places it must be unanimous, that is, all must agree.",
            "上下文线索：陪审员必须共同作出裁决，在许多地方这一裁决必须 unanimous，也就是全体一致。",
          ),
        ),
      ],
    ),
    passage(
      "the-long-road-to-the-vote",
      t("The Long Road to the Vote", "争取选举权的漫长道路"),
      `For most of history, the right to vote belonged to very few people. In the early democracies of the modern world, only men who owned property could usually vote. Women, the poor and many minorities were shut out. The story of suffrage, the right to vote, is the story of how those excluded groups fought to be included.

The campaign for women's suffrage began in earnest in the nineteenth century. In 1848, about three hundred people met in Seneca Falls, New York, and signed a declaration stating that "all men and women are created equal." Many people laughed at them. For the next seventy years, activists gave speeches, organized marches, wrote petitions and lobbied lawmakers.

Different countries moved at different speeds. New Zealand became the first self-governing country to give women the vote, in 1893, after a petition signed by nearly a quarter of the country's adult women. Finland followed in 1906. In Britain, some campaigners, frustrated by decades of polite requests, broke windows, chained themselves to railings and went on hunger strikes in prison. Their opponents called them dangerous; they replied that they had been patient long enough.

The First World War changed many minds. With men at the front, women ran factories, farms and offices. It became harder to argue that they could not be trusted with a vote. Britain gave the vote to many women in 1918, and the United States amended its constitution to forbid denying the vote because of sex in 1920.

Yet winning the vote on paper did not always mean being able to use it. In parts of the United States, Black citizens were kept from voting for decades by unfair tests, taxes and threats of violence. Only in 1965 did a new law protect their rights in practice. In some countries, women could not vote until the 1970s or later. The road has been long, and in places it is still being traveled.`,
      [clues, law, academic],
      [
        ask(
          t("Why did the First World War help the cause of women's suffrage?", "为什么第一次世界大战推动了妇女选举权运动？"),
          t("Women did essential work, which made it harder to deny them the vote", "妇女承担了重要工作，人们因此更难拒绝给予她们选举权"),
          [
            t("Soldiers voted to give women the vote", "士兵们投票给予妇女选举权"),
            t("The war ended all elections", "战争终止了所有选举"),
            t("Women refused to work during the war", "妇女在战争期间拒绝工作"),
          ],
          t(
            "With men at the front, women ran factories, farms and offices, so it became harder to argue that they could not be trusted with a vote.",
            "男人们上了前线，妇女管理工厂、农场和办公室，于是人们更难再说她们不能被托付选举权。",
          ),
        ),
        ask(
          t(
            "How did some British campaigners respond to decades of polite requests failing?",
            "当几十年的礼貌请求都没有结果时，一些英国活动人士如何回应？",
          ),
          t("They used more dramatic protests, such as breaking windows and hunger strikes", "他们采取了更激烈的抗议方式，如砸窗户和绝食"),
          [
            t("They gave up the campaign", "他们放弃了运动"),
            t("They moved to New Zealand", "他们搬到了新西兰"),
            t("They wrote a new declaration at Seneca Falls", "他们在塞尼卡福尔斯写了新的宣言"),
          ],
          t(
            "The third paragraph says they broke windows, chained themselves to railings and went on hunger strikes in prison.",
            "第三段说，她们砸窗户，把自己锁在栏杆上，并在狱中绝食。",
          ),
        ),
        ask(
          t("What is the main point of the last paragraph?", "最后一段的主要观点是什么？"),
          t("Winning a right in law did not always mean being able to use it", "在法律上赢得一项权利，并不总意味着能够行使它"),
          [
            t("All citizens could vote freely after 1920", "1920年以后所有公民都能自由投票"),
            t("Voting tests were fair to everyone", "投票测试对每个人都公平"),
            t("Women never won the vote anywhere", "妇女在任何地方都没有赢得选举权"),
          ],
          t(
            "The paragraph explains that Black citizens were kept from voting for decades despite the law, until a new law in 1965.",
            "这一段说明，尽管法律有规定，黑人公民仍被阻止投票长达几十年，直到1965年的新法律出台。",
          ),
        ),
      ],
      ["Seneca", "Falls", "New", "York", "Zealand", "Finland", "Britain", "British", "United", "States", "Black"],
    ),
    passage(
      "three-branches",
      t("Three Branches, One Government", "三个分支，一个政府"),
      `Why should no single person or group hold all the power in a government? An eighteenth-century French writer named Montesquieu gave an answer that shaped many modern constitutions. If the same people make the laws, carry them out and judge disputes about them, he argued, nothing can stop them from becoming tyrants. Power, he believed, must be divided so that each part can check the others.

Most modern democracies divide power among three branches. The legislature, often called a parliament or congress, makes the laws. Its members are elected by citizens and debate proposals before voting on them. The executive, led by a president or a prime minister, carries out the laws: it runs government departments, collects taxes, directs the armed forces and deals with other countries. The judiciary, the system of courts, interprets the laws and decides whether they have been broken.

The branches do not simply work side by side; they limit each other. In some systems, the president can veto a law passed by the legislature, but the legislature can override the veto with a large majority. The legislature controls the budget, so the executive cannot spend money without its approval. Judges are often appointed by the executive and approved by the legislature, but once appointed, they may serve for many years so that they can rule without fear of losing their jobs.

Courts have a particularly important check. In many countries, a high court can declare a law unconstitutional, meaning that it conflicts with the constitution and cannot be enforced. This power, called judicial review, protects the rights written in the constitution even when a majority in the legislature would like to ignore them.

The system is slow on purpose. Laws must pass many stages and survive many challenges. Critics complain that this makes government inefficient, but its defenders reply that efficiency is not the only goal. A government that can act quickly can also make mistakes quickly.`,
      [clues, law, academic, { topic: "academic-words-3", weight: 0.1 }],
      [
        ask(
          t("What danger did Montesquieu believe the division of power would prevent?", "孟德斯鸠认为分权可以防止什么危险？"),
          t("People holding all power becoming tyrants", "掌握全部权力的人变成暴君"),
          [
            t("Governments running out of money", "政府资金耗尽"),
            t("Courts deciding too slowly", "法院判决太慢"),
            t("Citizens refusing to vote", "公民拒绝投票"),
          ],
          t(
            "The first paragraph says that if the same people make, carry out and judge the laws, nothing can stop them from becoming tyrants.",
            "第一段说，如果同一批人既制定法律、又执行法律、还裁决法律纠纷，就没有什么能阻止他们成为暴君。",
          ),
        ),
        ask(
          t("What is judicial review?", "什么是司法审查？"),
          t("A court's power to declare a law unconstitutional", "法院宣布某项法律违宪的权力"),
          [
            t("The legislature's power to elect judges", "立法机构选举法官的权力"),
            t("A president's power to veto a law", "总统否决法律的权力"),
            t("A review of judges' salaries", "对法官薪水的审查"),
          ],
          t(
            "The fourth paragraph defines judicial review as the power of a high court to declare a law unconstitutional.",
            "第四段把司法审查定义为高等法院宣布某项法律违宪的权力。",
          ),
        ),
        ask(
          t("How do defenders answer the complaint that the system is slow?", "对于这个制度太慢的批评，支持者如何回应？"),
          t("A government that acts quickly can also make mistakes quickly", "行动快的政府也可能很快犯错"),
          [
            t("The system is actually very fast", "这个制度其实非常快"),
            t("Speed does not matter in any way", "速度一点都不重要"),
            t("Only the courts are slow", "只有法院很慢"),
          ],
          t(
            "The last paragraph says that efficiency is not the only goal, since a government that can act quickly can also make mistakes quickly.",
            "最后一段说，效率不是唯一的目标，因为行动快的政府也可能很快犯错。",
          ),
        ),
      ],
      ["French", "Montesquieu"],
    ),
    passage(
      "the-case-of-the-borrowed-bicycle",
      t("The Case of the Borrowed Bicycle", "借来的自行车一案"),
      `Every spring, the students of Riverside High hold a mock trial. This year's case was invented by their teacher, Ms. Adeyemi, but it was designed to feel real. A student named Theo was accused of stealing a bicycle from outside the library. He said he had only borrowed it, believing it belonged to his cousin.

The prosecution went first. Their main witness, a girl who had been sitting on the library steps, said she saw Theo cut the lock with a tool and ride away quickly. "He looked around before he did it," she said, "like he didn't want anyone to see." The prosecution also showed a photograph of the cut lock.

Then the defense cross-examined her. "How far away were you sitting?" asked the defense lawyer, a tall boy named Sami. About thirty meters, she admitted. "And was it raining that afternoon?" It was. "So you saw this, at thirty meters, through the rain?" The witness hesitated. "I'm pretty sure," she said.

The defense called Theo's cousin, who testified that she owned a bicycle of the same color and model and had told Theo he could use it whenever he liked. She had lost the key to her lock weeks before.

In his closing argument, Sami did not claim that Theo was a perfect person. Instead, he focused on doubt. "The prosecution must prove that Theo meant to steal," he said. "A boy who thinks a bike belongs to his cousin, and who knows the key is lost, might cut the lock without any intention to steal at all." The prosecution answered that Theo should have checked.

The jury of classmates argued for forty minutes. In the end, they found Theo not guilty. Afterward, Ms. Adeyemi asked the class what they had learned. One juror said, "That being sure is harder than it looks."`,
      [clues, law],
      [
        ask(
          t("How did the defense lawyer weaken the witness's testimony?", "辩护律师是如何削弱证人证词的？"),
          t("By showing she saw the event from far away in the rain", "通过指出她是在雨中从远处看到这件事的"),
          [
            t("By proving she was not at the library", "通过证明她当时不在图书馆"),
            t("By showing the photograph was fake", "通过证明照片是伪造的"),
            t("By getting her to say Theo was innocent", "通过让她说西奥是无辜的"),
          ],
          t(
            "Sami's questions revealed she was about thirty meters away in the rain, and she then hesitated and said only \"I'm pretty sure.\"",
            "萨米的提问揭示出她当时在雨中约三十米外，随后她犹豫了，只说“我很确定”。",
          ),
        ),
        ask(
          t("What was the main idea of Sami's closing argument?", "萨米结案陈词的主要观点是什么？"),
          t("There was reasonable doubt that Theo meant to steal", "对于西奥是否有意偷窃存在合理怀疑"),
          [
            t("Theo was a perfect person", "西奥是个完美的人"),
            t("The bicycle was never taken", "自行车从来没有被拿走"),
            t("The witness was lying on purpose", "证人故意撒谎"),
          ],
          t(
            "Sami focused on doubt: Theo may have cut the lock without any intention to steal, believing the bike was his cousin's.",
            "萨米着重于怀疑：西奥可能以为那是他表姐的车，剪断锁时并没有偷窃的意图。",
          ),
        ),
        ask(
          t("What does the juror's final comment suggest about the trial?", "陪审员最后的话对这次审判有什么暗示？"),
          t("Deciding guilt with real certainty is more difficult than people expect", "真正确定地判定有罪比人们想象的更难"),
          [
            t("The jury thought the case was very easy", "陪审团认为这个案子非常简单"),
            t("The juror was sure Theo was guilty", "这位陪审员确信西奥有罪"),
            t("Mock trials are a waste of time", "模拟审判是浪费时间"),
          ],
          t(
            "The juror says being sure is harder than it looks, which reflects how doubt about the evidence shaped the verdict.",
            "这位陪审员说，要确定比看上去难，这反映出对证据的怀疑如何影响了裁决。",
          ),
        ),
      ],
      ["Riverside", "Adeyemi", "Theo", "Theo's", "Sami"],
    ),
    passage(
      "arguments-that-fail",
      t("Arguments That Fail in Court", "在法庭上站不住脚的论证"),
      `Courtrooms are places where arguments are tested more carefully than almost anywhere else. Lawyers try to persuade judges and juries, and their opponents look for every weakness. Some of the most common weaknesses are logical fallacies, errors in reasoning that can make a bad argument sound convincing.

One of the oldest is the ad hominem attack, which targets a person instead of their argument. A lawyer might say that a witness cannot be trusted because she has been divorced twice. But her marriages have nothing to do with whether she saw a car run a red light. Judges often stop such questions because they are irrelevant: they do not help decide the facts of the case.

Another is the false dilemma, which pretends that there are only two choices. "Either the defendant is a liar, or the police officer is." In reality, both may be honest but mistaken, or the truth may lie somewhere between their accounts. A careful juror looks for the options that the argument has left out.

The slippery slope fallacy claims that one small step will lead to a chain of disasters. "If we allow this evidence, soon any rumor will be allowed in court, and trials will mean nothing." The argument skips the steps in between, each of which would need its own proof.

Then there is the hasty generalization: drawing a broad conclusion from too few examples. "The defendant was late to work twice, so he is clearly an irresponsible person who would neglect his child." Two late arrivals do not show a pattern of neglect.

Spotting fallacies does not mean that the conclusion is false. A person attacked unfairly might still be lying; a hasty generalization might happen to be right. It means only that the argument, as given, does not prove its point. In court, as in life, that difference matters.`,
      [clues, law, fallacies, academic],
      [
        ask(
          t("Why do judges often stop ad hominem questions about a witness?", "为什么法官常常制止针对证人的人身攻击式提问？"),
          t("They are irrelevant to the facts of the case", "这些问题与案件事实无关"),
          [
            t("They take too long to answer", "回答这些问题太费时间"),
            t("They always prove the witness is lying", "它们总能证明证人在撒谎"),
            t("Witnesses are not allowed to speak about themselves", "证人不得谈论自己"),
          ],
          t(
            "The passage says the witness's marriages have nothing to do with what she saw, so such questions do not help decide the facts.",
            "文章说，证人的婚姻与她看到的事情毫无关系，所以这类问题无助于判定事实。",
          ),
        ),
        ask(
          t('Which fallacy is "Either the defendant is a liar, or the police officer is"?', "“要么被告在撒谎，要么警官在撒谎”是哪种谬误？"),
          t("A false dilemma", "虚假两难"),
          [t("A slippery slope", "滑坡谬误"), t("An ad hominem attack", "人身攻击"), t("A hasty generalization", "以偏概全")],
          t(
            "It pretends there are only two choices, when both people may be honest but mistaken.",
            "它假装只有两种选择，而实际上两个人可能都诚实但都弄错了。",
          ),
        ),
        ask(
          t("What does the last paragraph say spotting a fallacy shows?", "最后一段说，发现一个谬误说明了什么？"),
          t("The argument as given does not prove its point", "这个论证本身并没有证明其观点"),
          [
            t("The conclusion must be false", "结论一定是错的"),
            t("The speaker is lying", "说话者在撒谎"),
            t("The case should be closed", "案件应当结案"),
          ],
          t(
            "The last paragraph says spotting a fallacy does not mean the conclusion is false, only that the argument does not prove it.",
            "最后一段说，发现谬误并不意味着结论是错的，只说明这个论证没能证明它。",
          ),
        ),
      ],
    ),
    passage(
      "a-petition-that-changed-a-town",
      t("A Petition That Changed a Town", "改变一座小镇的请愿书"),
      `In the small town of Millbrook, the only crossing over the busy highway near the middle school was a painted line with no lights. For years, parents complained. Cars rarely slowed down, and twice in one winter a student was nearly hit. The town council said that a traffic light was too expensive and would have to wait.

Lena Ortiz, a fifteen-year-old in ninth grade, decided that waiting was not good enough. In her civics class, she had learned that citizens have the right to petition their government, to ask it formally to take action. She wrote a short, clear statement: "We, the undersigned residents of Millbrook, ask the town council to install a traffic light at the highway crossing before the next school year."

Then she started collecting signatures. She stood outside the grocery store on Saturday mornings and knocked on doors after school. Some people signed immediately. Others asked questions she could not answer, such as how much a light would cost. So she called the state transportation office, found out, and added the figure to her petition: about the same as the town spent each year on decorations for its summer festival.

That comparison changed many minds. After six weeks, she had more than nine hundred signatures, nearly a third of the town's adults. She asked to speak at the council's monthly meeting. Her hands shook as she read her statement and handed over the pages.

One council member argued that the town could not afford it. Another pointed out that the legislature of the state offered grants for school safety, and that the town had never applied. The council voted to apply for the grant and, if it failed, to cancel the festival decorations for a year.

The grant came through. By September, a traffic light stood at the crossing. A small sign beneath it, put up by the parents, simply says: "Thank you, Lena."`,
      [clues, law, academic],
      [
        ask(
          t("What right did Lena use to try to change the town's decision?", "莉娜运用了什么权利来尝试改变小镇的决定？"),
          t("The right to petition the government", "向政府请愿的权利"),
          [
            t("The right to a trial by jury", "接受陪审团审判的权利"),
            t("The right to vote in elections", "在选举中投票的权利"),
            t("The right to build a traffic light herself", "自己修建红绿灯的权利"),
          ],
          t(
            "The second paragraph says she learned that citizens have the right to petition their government, to ask it formally to take action.",
            "第二段说，她了解到公民有向政府请愿、正式要求政府采取行动的权利。",
          ),
        ),
        ask(
          t("Why did the comparison with the festival decorations change many minds?", "为什么与节日装饰的比较改变了许多人的想法？"),
          t("It showed the light cost no more than something the town already paid for", "它表明红绿灯的花费不比小镇已经在付的某项开支多"),
          [
            t("People disliked the festival", "人们不喜欢那个节日"),
            t("It proved the light would be free", "它证明了红绿灯是免费的"),
            t("The decorations were dangerous", "那些装饰很危险"),
          ],
          t(
            "The light cost about the same as the yearly decorations, so the claim that the town could not afford it seemed weaker.",
            "红绿灯的费用与每年的装饰费差不多，所以“小镇负担不起”的说法就显得没那么有力了。",
          ),
        ),
        ask(
          t("What does the sign beneath the light suggest about how the town sees Lena?", "红绿灯下的牌子暗示了小镇如何看待莉娜？"),
          t("They are grateful to her for making the crossing safe", "他们感谢她让路口变得安全"),
          [
            t("They are annoyed that the festival lost its decorations", "他们因节日没了装饰而恼火"),
            t("They think she broke the law", "他们认为她违反了法律"),
            t("They do not know who she is", "他们不知道她是谁"),
          ],
          t(
            'The parents put up a sign that says "Thank you, Lena," which shows their gratitude.',
            "家长们立了一块写着“谢谢你，莉娜”的牌子，表达了他们的感激。",
          ),
        ),
      ],
      ["Millbrook", "Lena", "Ortiz"],
    ),
  ],
};
