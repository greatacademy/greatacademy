// The reading unit of the B2 theme Law, Rights and Justice: how a jury decides, an innocent man who was freed, prisons
// that punish or rehabilitate, freedoms won by protest, the first fingerprint, laws that disagree, breaking the law
// for a cause, and a small lawsuit that changed a great deal.

import { type ReadingUnitDef, t } from "@ga/content";
import { passageMaker } from "../pre-a1/reading-kit.ts";
import { readingWords } from "./reading-words.ts";

const passage = passageMaker(readingWords, [
  "b2-words-law",
  "b2-words-court",
  "b2-words-crime-2",
  "b2-words-punishment",
  "b2-words-rights",
  "b2-words-justice",
  "b2-words-policing",
  "b2-words-government",
  "b2-words-protest",
  "b2-words-formal-verbs",
  "b2-words-certainty",
  "linking-words-of-contrast",
  "misplaced-modifiers",
]);

/** readingLaw is the reading unit of the theme Law, Rights and Justice. */
export const readingLaw: ReadingUnitDef = {
  id: "b2-reading-law",
  title: t("Law, Rights and Justice", "法律、权利与正义"),
  passages: [
    passage({
      id: "b2-law-how-a-jury-decides",
      title: ["How a Jury Decides", "陪审团如何作出裁决"],
      body: `In many countries, the most serious decisions in criminal justice are made not by judges but by ordinary citizens. A jury, usually of twelve people, listens to the evidence at a trial and decides whether the defendant is guilty or innocent. Its members are picked by a computer from a list of all adult citizens, and most of them have never been inside a court before.

The idea is very old. It rests on the principle that a person charged with a crime should be judged by people like themselves, not only by civil servants of the state. A jury, those in favor argue, brings the experience of ordinary life and the values of the community into the courtroom, and it protects citizens against a government that might use the courts to punish its enemies.

During the trial, the jurors listen to the prosecutor, who explains why the defendant is guilty, and to the attorney of the defendant. They hear witnesses testify and see the evidence. They are not allowed to discuss the trial with anyone, or to search for information about it online, because their verdict must depend only on what is shown in court.

When the trial ends, the judge explains the law to the jury, and the jurors go to a private room to decide. Nobody else may go in. In many countries, they must agree that the defendant is guilty "beyond reasonable doubt": if they have a doubt that a reasonable person would have, they must find the defendant not guilty. This high level reflects a simple principle of justice: it is better for a guilty person to go free than for an innocent person to be punished.

Studies of mock juries show that the debate matters a great deal. Jurors often come into the room with different opinions. A juror who speaks strongly can influence the others, and people who disagree may feel pressure to go along with the majority. In a famous movie, a single juror slowly persuades eleven others to change their views, although such dramatic changes almost never happen in real life.

Not everyone admires the jury. Some argue that difficult trials, for example about fraud, are too hard for people without legal knowledge. Others point out that jurors, like everyone, can be influenced by prejudice. However, most countries that use juries still trust them. Despite its problems, the jury is still a strong sign of the idea that justice belongs to the people.`,
      grammar: ["linking-words-of-contrast"],
      glossed: ["jurors", "juror", "courtroom", "mock"],
      questions: [
        [
          ["How are the members of a jury chosen?", "陪审团成员是怎样选出来的？"],
          ["By a computer, from a list of all adult citizens", "由计算机从全体成年公民名单中挑选"],
          [
            ["By the judge, from among lawyers", "由法官从律师中挑选"],
            ["By the defendant and the prosecutor together", "由被告和检察官共同挑选"],
          ],
          [
            '"Its members are picked by a computer from a list of all adult citizens, and most of them have never been inside a court before."',
            "陪审员由计算机从全体成年公民名单中挑选，他们中的大多数以前从没进过法庭。",
          ],
        ],
        [
          ["Why may jurors not search for information about the trial online?", "陪审员为什么不能在网上搜索有关审判的信息？"],
          ["Their verdict must depend only on what is shown in court", "他们的裁决必须只依据法庭上出示的内容"],
          [
            ["The internet is not allowed in the court", "法庭里不允许上网"],
            ["The information online is always false", "网上的信息总是假的"],
          ],
          [
            'They may not search online "because their verdict must depend only on what is shown in court."',
            "他们不能上网搜索，因为裁决只能依据法庭上出示的内容。",
          ],
        ],
        [
          ['What principle does the standard of "beyond reasonable doubt" reflect?', '"排除合理怀疑"这一标准体现了什么原则？'],
          ["It is better to free a guilty person than to punish an innocent one", "放走一个有罪的人比惩罚一个无辜的人好"],
          [
            ["Every defendant is probably guilty", "每个被告很可能都有罪"],
            ["The majority of the jury is always right", "陪审团的多数意见总是对的"],
          ],
          [
            '"It is better for a guilty person to go free than for an innocent person to be punished."',
            "宁可放走有罪之人，也不能惩罚无辜之人。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-law-the-innocent-man-who-was-freed",
      title: ["The Innocent Man Who Was Freed", "重获自由的无辜者"],
      body: `In 1993, a young man called Daniel was arrested for an assault outside a shop late one night. The victim, who had been badly hurt, said that the man who hurt her was tall and wore a red jacket. Daniel was tall, he owned a red jacket, and he lived nearby. Two days later, the victim picked him out from a group of photos. Although Daniel insisted that he had been at home all evening, nobody could confirm his alibi, and the jury found him guilty. He was given twenty years in prison.

For the next eighteen years, Daniel wrote letters to anyone who might listen: lawyers, journalists, members of parliament. Most never replied. Then, in 2011, a group of law students working with a charity that investigates wrongful convictions agreed to look at his file. They discovered that the police had kept a sample of blood from the clothes of the victim, which had never been examined, because nobody knew how to do so at the time of the trial.

When the sample was finally examined with modern methods, the result was undeniable: the blood came from another man, whose record was already in a police database. He had committed several similar offenses in the same area. The verdict against Daniel was overturned, and he walked out of prison at the age of forty-one.

How could such an injustice happen? The answer is not a happy one. Nobody in the trial had told lies. The victim really believed that she had recognized the man; the police really believed they had the right suspect. Yet studies show that memory is far less reliable than most people assume, especially after a terrible event, and that witnesses can become more certain over time, even when they are wrong. Identification of the wrong person is one of the most common causes of wrongful convictions.

Since then, many police forces have changed the way they show photos to witnesses, and some countries keep evidence for much longer, so that it can be examined again. Daniel received compensation from the state, but he says that no amount of money can give him back the best years of his life. What he wants most is for the courts to admit their mistakes faster. "I was lucky," he says. "Somebody finally listened. Many people in my situation are still waiting."`,
      grammar: ["misplaced-modifiers"],
      names: ["Daniel"],
      glossed: ["identification"],
      questions: [
        [
          ["Why did the jury find Daniel guilty?", "陪审团为什么判丹尼尔有罪？"],
          ["The victim picked him out, and nobody could confirm his alibi", "受害者指认了他，而且没人能证实他的不在场证明"],
          [
            ["His fingerprints were found on the victim", "在受害者身上发现了他的指纹"],
            ["He confessed to the police", "他向警方认罪了"],
          ],
          [
            'The victim picked him out from a group of photos, and although Daniel insisted he had been at home, "nobody could confirm his alibi."',
            "受害者从一组照片中认出了他；虽然丹尼尔坚称自己在家，却没人能证实他的不在场证明。",
          ],
        ],
        [
          ["Why had the blood sample never been examined?", "为什么那份血样一直没有被检验？"],
          ["Nobody knew how to examine it at the time of the trial", "审判时还没有检验它的科学手段"],
          [
            ["The police had lost it for eighteen years", "警方把它弄丢了十八年"],
            ["Daniel refused to give a sample of his own", "丹尼尔拒绝提供自己的样本"],
          ],
          [
            'It "had never been examined, because nobody knew how to do so at the time of the trial."',
            "这份血样从未被检验，因为审判时还没有相应的科学手段。",
          ],
        ],
        [
          ["What does the passage say about the memory of witnesses?", "文章怎样评价证人的记忆？"],
          ["It is less reliable than most people think", "它不像大多数人以为的那样可靠"],
          [
            ["It becomes more accurate over time", "它会随着时间变得更准确"],
            ["It is never wrong after a frightening event", "在可怕的事件之后它从不出错"],
          ],
          [
            '"Memory is far less reliable than most people assume", and witnesses can become more certain over time, even when they are wrong.',
            "记忆远没有大多数人以为的那样可靠，证人还会随着时间推移越来越确信，即使他们是错的。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-law-should-prisons-punish-or-rehabilitate",
      title: ["Should Prisons Punish or Rehabilitate?", "监狱应该惩罚还是改造？"],
      body: `What are prisons for? For most of history, the answer seemed obvious: to punish people who had done wrong. Prison was meant to be hard, so that offenders would suffer for their crimes and others would be deterred from committing them. Today, however, many experts argue that this approach does not work, and that the main goal of prison should be to rehabilitate offenders, so that they do not commit crimes again.

The evidence for this view comes in part from what happens after people leave prison. In many countries, more than half of those who are let out are arrested again within a few years. Prison, some say, often makes people more dangerous, not less: inmates lose their jobs, homes and families, learn from other offenders and come out with few skills and a criminal record that makes honest work hard to find.

Norway is often given as an example of a different approach. Its prisons look more like small towns than like the prisons of movies. Inmates live in rooms of their own, cook their own meals, study and work. Prison officers study for two years and eat and play sport with the inmates. The idea is that life inside should be as similar as possible to life outside, so that the return to society is easier. Only about one in five people who leave prison in Norway commits another crime within two years, one of the lowest rates in the world.

Those who doubt this approach raise several points. Some say that it is unfair to victims and their families, who may feel that offenders are being given an easy life instead of punished. Others argue that what works in a small, rich country with low crime cannot just be copied in other places. And for the most dangerous offenders, they insist, the first job of prison is to protect the public.

Many countries are trying to do both. Offenders still lose their liberty, which is itself a serious penalty, but they also receive education, treatment and help in finding work. Those in favor point out that rehabilitation is not only kinder but also cheaper in the long run: every person who does not return to prison saves money and, even more important, prevents future victims. The question, in the end, is not whether to be soft or hard on crime, but what actually reduces it.`,
      grammar: ["linking-words-of-contrast"],
      names: ["Norway"],
      glossed: ["inmates"],
      questions: [
        [
          ["Why do critics say that prison often makes people more dangerous?", "批评者为什么说监狱常常让人变得更危险？"],
          ["Inmates lose jobs and homes and learn from other offenders", "囚犯失去工作和住所，还向其他罪犯学习"],
          [
            ["Prisons in most countries are too comfortable", "大多数国家的监狱太舒适了"],
            ["Guards encourage inmates to commit crimes", "看守鼓励囚犯犯罪"],
          ],
          [
            'Inmates "lose their jobs, homes and families, learn from other offenders and come out with few skills and a criminal record."',
            "囚犯失去工作、住所和家庭，向其他罪犯学习，出狱时几乎没有技能，还带着犯罪记录。",
          ],
        ],
        [
          ["What is the idea behind the prisons of Norway?", "挪威监狱背后的理念是什么？"],
          ["Life inside should be as similar as possible to life outside", "狱中生活应尽量接近外面的生活"],
          [
            ["Inmates should never leave their rooms", "囚犯永远不应离开自己的房间"],
            ["Prison should be as unpleasant as possible", "监狱应该尽可能让人难受"],
          ],
          [
            '"The idea is that life inside should be as similar as possible to life outside, so that the return to society is easier."',
            "理念是让狱中生活尽可能接近外面的生活，这样回归社会会更容易。",
          ],
        ],
        [
          ["Which objection to the model of Norway does the passage mention?", "文章提到了对挪威模式的哪一种反对意见？"],
          ["It may be unfair to victims and their families", "它可能对受害者及其家人不公平"],
          [
            ["It is more expensive than any other approach", "它比其他任何方法都贵"],
            ["Too many inmates commit another crime", "太多囚犯再次犯罪"],
          ],
          [
            '"Some say that it is unfair to victims and their families, who may feel that offenders are being given an easy life instead of punished."',
            "有人说这对受害者及其家人不公平，他们可能觉得罪犯受到了奖励而不是惩罚。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-law-rights-that-were-won-by-protest",
      title: ["Rights That Were Won by Protest", "通过抗议赢得的权利"],
      body: `Many of the freedoms that people in democracies now see as normal were not given by governments. They were won, often after long and difficult efforts, by ordinary people who were prepared to protest.

Consider the right of women to vote. At the beginning of the twentieth century, women could vote in national elections in almost no country in the world. In Britain, activists first tried polite methods: letters, petitions and visits to members of parliament. When these achieved little, some turned to stronger forms of protest. They held huge rallies, fixed themselves to railings and broke windows. Hundreds were imprisoned, and some refused to eat in prison. Their actions divided public opinion, but they made it impossible to pay no attention to the issue. In 1918, some British women finally won the vote, and in 1928, all women over twenty-one.

A generation later, in the United States, the campaign for civil liberty used different methods. In 1955, in the city of Montgomery, a black woman called Rosa Parks refused to give up her seat on a bus to a white passenger, as the law of the city required. She was arrested. In response, the black residents of the city organized a boycott of the buses that went on for more than a year. The boycott was peaceful and organized, and it worked: it ended when the highest court in the country decided that the law was against the constitution. Over the following ten years, through demonstrations, sit-ins and acts of civil disobedience, the activists helped to bring about laws against discrimination in voting, work and public places.

Workers, too, won many of their rights through protest. The weekend, the working day of eight hours and laws against work by children were all the result of strikes and demonstrations, often met with violence by employers or the police.

Not every protest succeeds, of course, and protests can turn into riots that harm innocent people. Experts on history point out that the protests that achieved most usually mixed protest with other strategies: legal challenges, organizing at the grassroots and the patient work of persuading the public. Nevertheless, history suggests that when ordinary people mobilize in large numbers and refuse to give up, even the strongest institutions can be made to change.`,
      grammar: ["linking-words-of-contrast"],
      names: ["Britain", "British", "United", "States", "Montgomery", "Rosa", "Parks"],
      glossed: ["railings", "sit-ins"],
      questions: [
        [
          ["Why did some campaigners in Britain turn to more radical protest?", "为什么英国的一些活动人士转向更激进的抗议？"],
          ["Polite methods had achieved little", "礼貌的方式收效甚微"],
          [
            ["The government had asked them to", "政府要求他们这样做"],
            ["Most women did not want the vote", "大多数妇女不想要选举权"],
          ],
          [
            'Campaigners first tried letters, petitions and meetings; "when these achieved little, some turned to more radical forms of protest."',
            "活动人士起初尝试写信、请愿和会见政治人物，收效甚微后，一些人转向了更激进的抗议方式。",
          ],
        ],
        [
          ["How did the boycott of the buses in Montgomery end?", "蒙哥马利的公交车抵制运动是怎样结束的？"],
          ["The highest court decided that the law was against the constitution", "最高法院裁定那项法律违宪"],
          [
            ["Rosa Parks was sent to prison for a year", "罗莎·帕克斯被判入狱一年"],
            ["The city stopped all its buses", "市政府停运了所有公交车"],
          ],
          [
            'The boycott "ended when the highest court in the country decided that the law was against the constitution."',
            "当国家最高法院裁定该法律违宪时，抵制运动才结束。",
          ],
        ],
        [
          ["What did the protests that achieved most usually do?", "最有成效的抗议通常怎么做？"],
          ["Combine protest with legal challenges and persuading the public", "把抗议与法律挑战和说服公众结合起来"],
          [
            ["Use violence against the police", "对警察使用暴力"],
            ["Avoid any contact with politicians", "避免与政治人物有任何接触"],
          ],
          [
            'They "mixed protest with other strategies: legal challenges, organizing at the grassroots and the patient work of persuading the public."',
            "它们把抗议与其他策略相结合：法律挑战、政治组织以及耐心说服公众。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-law-the-detective-and-the-fingerprint",
      title: ["The Detective and the Fingerprint", "侦探与指纹"],
      body: `In 1892, in a small town in Argentina, two young children were found dead in their home. Their mother, Francisca Rojas, was hurt too. She told the police that a neighbor had hurt the family, and the neighbor was arrested. Although he was interrogated for days, he insisted that he was innocent, and he had an alibi. The investigation seemed to have come to a dead end.

Then a detective called Eduardo Álvarez arrived from the city. He had recently learned about a new idea developed by a colleague, Juan Vucetich: that the lines on the fingertips of every person are different, and that they never change during life. At the scene of the crime, Álvarez noticed a mark of blood on a door. It was a fingerprint. He cut out the piece of wood and compared the print with those of the suspect. They were different. Then he compared it with the prints of the mother. They were exactly the same.

Shown the evidence, Rojas confessed. It was the first time in history that a criminal had been identified by a fingerprint, and the method soon spread around the world. Within twenty years, police forces in many countries were collecting fingerprints, and courts accepted them as evidence. For most of the twentieth century, a fingerprint at the scene of a crime was seen as almost indisputable evidence.

Fingerprints are still one of the most important tools of forensic science, but experts today are more cautious. Fingerprints at a crime scene are often not complete or not clear, and comparing them depends in part on the opinion of a person. In one famous example, the American police arrested a lawyer after a terrible crime on trains in Madrid, because experts said that his fingerprint was the same as one found on a bag. He was innocent. The print belonged to another man, and the lawyer was let go, and the government said that it was sorry.

As a result, forensic scientists now insist that fingerprint evidence should be checked by more than one expert, each working alone, and that its weak points should be explained to juries. A fingerprint can still be strong evidence. Nevertheless, like any evidence, it is only as reliable as the people who interpret it. The story of Álvarez shows the power of a good idea; the story of the lawyer shows why even good ideas must be used with care.`,
      grammar: ["misplaced-modifiers"],
      names: ["Argentina", "Francisca", "Rojas", "Eduardo", "Álvarez", "Juan", "Vucetich", "American", "Madrid"],
      glossed: ["fingertips"],
      questions: [
        [
          ["Why did the investigation seem to have reached a dead end?", "为什么调查似乎陷入了僵局？"],
          ["The neighbor insisted he was innocent and had an alibi", "邻居坚称自己无辜，并有不在场证明"],
          [
            ["The mother refused to talk to the police", "母亲拒绝和警察交谈"],
            ["There were no police officers in the town", "镇上没有警察"],
          ],
          ['The neighbor "insisted that he was innocent, and he had an alibi."', "那个邻居坚称自己是无辜的，而且有不在场证明。"],
        ],
        [
          ["What did Álvarez discover when he compared the fingerprint?", "阿尔瓦雷斯比对指纹时发现了什么？"],
          ["It matched the prints of the mother", "它与母亲的指纹完全吻合"],
          [
            ["It matched the prints of the neighbor", "它与邻居的指纹吻合"],
            ["It belonged to one of the children", "它属于其中一个孩子"],
          ],
          [
            'The print was different from that of the suspect. "Then he compared it with the prints of the mother. They were exactly the same."',
            "指纹与嫌疑人的不符，他又与母亲的指纹比对，结果完全吻合。",
          ],
        ],
        [
          ["Why are experts more cautious about fingerprints today?", "为什么如今专家对指纹更加谨慎？"],
          ["Comparing unclear prints depends partly on human judgment", "比对模糊的指纹部分取决于人的判断"],
          [
            ["Fingerprints change during a lifetime", "指纹在一生中会发生变化"],
            ["Courts no longer accept them as evidence", "法庭不再接受指纹作为证据"],
          ],
          [
            'Prints at a crime scene "are often not complete or not clear, and comparing them depends in part on the opinion of a person."',
            "犯罪现场的指纹往往不完整或不清楚，比对它们在一定程度上取决于人的判断。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-law-when-laws-disagree",
      title: ["When Laws Disagree", "当法律相互冲突时"],
      body: `Imagine that you live near the border between two states of the same country. On one side of the border, a certain action is completely legal; on the other side, a few kilometers away, it can lead to a fine or even prison. Situations like this are more common than many people think, and they raise difficult questions about how a country should be governed.

In federal countries such as the United States, Germany or Australia, power is divided between a national government and the governments of the states or regions. Each level has its own jurisdiction: the national government usually decides matters such as the army and the currency, while the states often decide on education, the police and many areas of criminal law. As a result, laws can be very different from one state to the next. In the United States, for example, the penalty for the same crime may be a few years in one state and many more in another, and some states have abolished the death penalty while others have not.

Sometimes the laws of different levels clearly contradict each other. In the United States, several states have legalized cannabis, while federal law still prohibits it. In theory, a shop selling it within the law of its state could be prosecuted under federal law. In practice, the federal government has usually chosen not to enforce the prohibition, but the conflict creates real uncertainty for businesses, banks and citizens.

When such conflicts get to the courts, judges must decide which law prevails. In most federal constitutions, national law takes priority in the areas where the national government has authority. However, the courts must also decide where that authority ends, and those decisions can be very controversial.

The same problem is found between countries. A company that operates online may have to comply with the laws of dozens of countries at the same time, and those laws may conflict. A message that is protected by the freedom to say what you think in one country may be illegal in another.

Those in favor of federal government argue that the differences are a benefit: states can experiment with different policies, learn from each other and reflect the values of their own residents. Others reply that justice should not depend on where you happen to live. Both sides agree on one thing: when laws disagree, ordinary people pay the price.`,
      grammar: ["linking-words-of-contrast"],
      names: ["United", "States", "Germany", "Australia"],
      glossed: ["cannabis", "prevails"],
      questions: [
        [
          ["What do states in federal countries often decide on?", "联邦制国家的各州通常决定哪些事务？"],
          ["Education, the police and many areas of criminal law", "教育、治安和刑法的许多领域"],
          [
            ["The army and the currency", "军队和货币"],
            ["The laws of other countries", "其他国家的法律"],
          ],
          [
            '"The national government usually decides matters such as the army and the currency, while the states often decide on education, the police and many areas of criminal law."',
            "国家政府通常决定国防和货币等事务，各州则常常决定教育、治安和刑法的许多领域。",
          ],
        ],
        [
          ["Why does the conflict over cannabis create uncertainty?", "为什么关于大麻的冲突会造成不确定性？"],
          ["It is legal under state law but prohibited under federal law", "它在州法律下合法，却被联邦法律禁止"],
          [
            ["Every state has the same law about it", "每个州对它的规定都一样"],
            ["Federal law has recently legalized it", "联邦法律最近已将其合法化"],
          ],
          [
            '"Several states have legalized cannabis, while federal law still prohibits it", so a legal shop could still be prosecuted.',
            "几个州已将大麻合法化，而联邦法律仍然禁止，所以合法经营的商店仍可能被起诉。",
          ],
        ],
        [
          ["What do those against federal government argue?", "反对联邦制的人认为什么？"],
          ["Justice should not depend on where you live", "正义不应取决于你住在哪里"],
          [
            ["States should be allowed to experiment more", "应该允许各州进行更多尝试"],
            ["National law should never take priority", "国家法律永远不应优先"],
          ],
          [
            'Others "reply that justice should not depend on where you happen to live." Experimenting is an argument of those in favor.',
            "批评者反驳说，正义不应取决于你碰巧住在哪里；可以尝试不同政策是支持者的论点。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-law-is-it-ever-right-to-break-the-law",
      title: ["Is It Ever Right to Break the Law?", "违法有时是正确的吗？"],
      body: `In 1846, the American writer Henry David Thoreau refused to pay a tax because he believed that the government was using the money to support slavery and an unjust war. He spent a night in prison, and after that he wrote an essay arguing that when a law is clearly wrong, a person who cares about right and wrong must disobey it. Few essays have had a greater influence. Gandhi read it in South Africa; Martin Luther King read it as a student.

The idea that it can be right to break the law is called civil disobedience. It does not mean just paying no attention to laws that we find inconvenient. Those who support it usually describe several conditions. First, the law must be very unjust, not only inconvenient. Second, legal ways of changing it must have been tried and failed. Third, the protest should be open and peaceful: the person breaks the law in public, not in secret, and does not harm others. Finally, and perhaps most important of all, the person accepts the punishment.

This last condition may seem strange, but it is essential to the argument. By accepting punishment, the person who protests shows respect for the rule of law as a whole, even while breaking one certain law. Gandhi encouraged his followers to go to prison in large numbers; King wrote one of his most famous letters from a prison cell. The fact that they were ready to suffer for their beliefs persuaded many people who had been indifferent that something was very wrong.

Others see serious risks in this approach. If every citizen may decide for themselves which laws are unjust, they argue, the result could be a society without order. People disagree strongly about what is just, and someone who blocks a road for a cause we support today may block it tomorrow for a cause we strongly oppose. In a democracy, they insist, the right response to a bad law is to vote, campaign and persuade, not to break it.

Those who support civil disobedience reply that democracies, too, can make terrible laws, especially laws that harm minorities who cannot win a vote. Many of the laws that we now see as completely wrong, such as those that allowed slavery or segregation, were completely legal at the time.

There may be no simple answer. Perhaps the most useful question is the one Thoreau himself asked: not only "Is this legal?", but also "Is this right?" The difficult part is being honest about the answer.`,
      grammar: ["linking-words-of-contrast"],
      names: ["American", "Henry", "David", "Thoreau", "Gandhi", "Africa", "Martin", "Luther", "King"],
      glossed: ["slavery", "segregation", "unjust", "disobey"],
      questions: [
        [
          ["Why did Thoreau refuse to pay a tax?", "梭罗为什么拒绝纳税？"],
          ["The money was being used to support slavery and an unjust war", "这笔钱被用来支持奴隶制和一场不义的战争"],
          [
            ["He did not have enough money", "他没有足够的钱"],
            ["He wanted to spend a night in prison", "他想在监狱里过一夜"],
          ],
          [
            'He "believed that the government was using the money to support slavery and an unjust war."',
            "他认为政府在用这笔钱支持奴隶制和一场不义的战争。",
          ],
        ],
        [
          ["Why is accepting the punishment essential to civil disobedience?", "为什么接受惩罚对公民不服从至关重要？"],
          ["It shows respect for the rule of law in general", "它表明对法治本身的尊重"],
          [
            ["It makes the punishment shorter", "它能让刑罚缩短"],
            ["It allows the protester to keep the protest secret", "它让抗议者能够秘密抗议"],
          ],
          [
            '"By accepting punishment, the person who protests shows respect for the rule of law as a whole, even while breaking one certain law."',
            "通过接受惩罚，抗议者在违反某一条法律的同时，表现出对法治本身的尊重。",
          ],
        ],
        [
          ["What is the main worry of those against civil disobedience?", "反对公民不服从的人主要担心什么？"],
          ["If everyone decides which laws to obey, the result could be disorder", "如果人人自行决定遵守哪些法律，结果可能是混乱"],
          [
            ["Protesters are punished too lightly", "抗议者受到的惩罚太轻"],
            ["Democracies never make bad laws", "民主国家从不制定坏法律"],
          ],
          [
            '"If every citizen may decide for themselves which laws are unjust, they argue, the result could be a society without order."',
            "他们认为，如果每个公民都可以自行决定哪些法律不公正，结果可能是混乱。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-law-the-smallest-court-case",
      title: ["The Smallest Court Case That Changed Everything", "改变一切的小官司"],
      body: `In 1992, a woman of seventy-nine bought a cup of coffee at the drive-through window of a restaurant that sold fast food in the United States. Sitting in the passenger seat of a car that had stopped, she held the cup between her knees to add milk and sugar. The cup fell over, and the hot coffee poured onto her legs. She suffered serious burns, spent eight days in hospital and needed skin grafts.

She asked the company to pay her hospital bills, about twenty thousand dollars. The company offered eight hundred. She went to court, and a jury gave her nearly three million dollars, most of it as a penalty against the company. Within days, the story was everywhere. People on television made jokes about it, and it became the most famous example of what many people saw as a legal culture gone wrong, in which anyone could get rich with a lawsuit about their own mistakes.

The facts that emerged at the trial, however, told a different story. The company served its coffee at a temperature far higher than most restaurants, hot enough to cause serious burns within seconds. It had received more than seven hundred complaints about burns over ten years, and it had decided not to lower the temperature. The jury decided that the company had known about the risk and done nothing. The judge later reduced the amount to about six hundred thousand dollars, and the two sides eventually agreed in private on less.

Why does the story still matter? In part because of what happened next. It was used in campaigns to reduce the right of citizens to take companies to court and to cap the amounts that juries can give. Those in favor of these reforms argued that frivolous lawsuits were raising costs for everyone. Those against them replied that the most famous example of a frivolous lawsuit was not frivolous at all.

The story is also a lesson in how facts can be changed in the telling. Most people who made jokes about it never heard about the burns, the complaints or the offer of eight hundred dollars. A difficult legal dispute was reduced to a single sentence: a woman spilled coffee on herself and became rich. That sentence was easy to remember, simple and false.

Today, coffee cups in many countries carry a small warning that what is inside is hot. For lawyers and journalists, the story is still a reminder to read the full story before deciding who is right.`,
      grammar: ["misplaced-modifiers"],
      names: ["United", "States"],
      glossed: ["drive-through", "grafts", "frivolous", "cap"],
      questions: [
        [
          ["What did the woman first ask the company to pay?", "那位女士最初要求公司支付什么？"],
          ["Her hospital bills of about twenty thousand dollars", "约两万美元的医疗费"],
          [
            ["Three million dollars", "三百万美元"],
            ["Eight hundred dollars", "八百美元"],
          ],
          [
            '"She asked the company to pay her hospital bills, about twenty thousand dollars. The company offered eight hundred."',
            "她请公司支付约两万美元的医疗费，公司只愿意给八百美元。",
          ],
        ],
        [
          ["What facts emerged at the trial?", "审判中揭示了哪些事实？"],
          ["The coffee was much hotter than usual, and the company had ignored complaints", "咖啡比一般的烫得多，而公司忽视了投诉"],
          [
            ["The woman had been driving the car at the time", "当时是那位女士在开车"],
            ["Nobody had ever complained about the coffee before", "以前从没有人投诉过咖啡"],
          ],
          [
            'The coffee was served "at a temperature far higher than most restaurants", and the company had received more than seven hundred complaints.',
            "咖啡的温度远高于大多数餐馆，而公司收到过七百多起投诉。",
          ],
        ],
        [
          ["Why does the writer call the popular version of the story misleading?", "作者为什么说这个故事流行的版本有误导性？"],
          ["It left out the burns, the complaints and the company's offer", "它省略了烫伤、投诉和公司的赔偿提议"],
          [
            ["The woman never actually went to court", "那位女士其实从未上法庭"],
            ["The jury awarded her nothing at all", "陪审团根本没有判给她任何赔偿"],
          ],
          [
            '"Most people who made jokes about it never heard about the burns, the complaints or the offer of eight hundred dollars."',
            "大多数拿这件事开玩笑的人从没听说过烫伤、投诉以及八百美元的提议。",
          ],
        ],
      ],
    }),
  ],
};
