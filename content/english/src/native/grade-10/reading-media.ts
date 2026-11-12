// Grade 10: the reading unit of the sixth theme, media and truth, from a hoax about life on the moon and a reporter
// who went undercover to a war sold by newspapers, a poll that asked the wrong people and a feed built to hold us.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grade-5/reading-kit.ts";

const pressWords = { topic: "words-of-journalism-and-ethics", weight: 0.3 } as const;
const mediaWords = { topic: "words-of-media-and-attention", weight: 0.3 } as const;
const bias = { topic: "identifying-bias-in-the-news", weight: 0.2 } as const;
const numbers = { topic: "how-numbers-can-mislead", weight: 0.2 } as const;
const academic1 = { topic: "academic-words-1", weight: 0.1 } as const;
const academic2 = { topic: "academic-words-2", weight: 0.1 } as const;
const academic3 = { topic: "academic-words-3", weight: 0.1 } as const;

/** mediaAndTruth is a reading unit of grade 10 on journalism, its failures and the fight for attention. */
export const mediaAndTruth: ReadingUnitDef = {
  id: "media-and-truth",
  title: t("Media and Truth", "媒体与真相"),
  passages: [
    passage(
      "the-men-on-the-moon",
      t("The Men on the Moon", "月球上的人"),
      `In August 1835, readers of the New York Sun opened their newspaper to an astonishing report. The famous British astronomer Sir John Herschel, it said, had built an enormous new telescope at the Cape of Good Hope in southern Africa. Through it, he had seen the surface of the moon in extraordinary detail, and he had discovered that it was full of life.

Over six days, the Sun described what Herschel had found. There were forests and seas, herds of brown animals like small bison, and a blue creature with a single horn, like a goat. There were beaches of white sand and great purple crystals. Most amazing of all, there were beings about a meter tall, covered in copper-colored hair, with wings like those of a bat. They walked upright, talked to each other with lively gestures and appeared to build temples.

The articles claimed to come from a scientific journal in Edinburgh, and they were full of technical details about lenses and light. That made them sound convincing. Many readers believed every word. Other newspapers reprinted the story. The Sun's sales soared, and for a time it claimed to have the largest circulation of any newspaper in the world.

None of it was true. There was no scientific journal of that name, and Herschel, who was indeed working at the Cape, knew nothing about the articles. They had almost certainly been written by a reporter at the Sun named Richard Adams Locke. Some historians think he intended them as satire, mocking writers who claimed that the moon and planets were full of intelligent life. If so, most of his readers missed the joke.

Within a few weeks, rival papers were calling the story a hoax. The Sun never fully admitted that it had invented it. Herschel himself was said to be amused at first, but he grew tired of answering letters about the bat-people for years afterward.

The Great Moon Hoax, as it came to be called, is often remembered as a funny episode from a more innocent time. It also shows something that has not changed. People are more likely to believe a story that is exciting, that sounds technical and that comes from a source they cannot easily check. A newspaper can profit from sensationalism, even if it costs it some credibility in the end. Today, false stories travel much faster than they did in 1835, but the reasons people share them are remarkably similar.`,
      [pressWords, bias, academic1],
      [
        ask(
          t("Why did many readers find the moon articles convincing?", "为什么许多读者觉得这些关于月球的文章令人信服？"),
          t("They claimed a scientific source and were full of technical details", "它们声称来自科学刊物，而且充满技术细节"),
          [
            t("Herschel had confirmed them in a letter to the Sun", "赫歇尔在给《太阳报》的信中证实了它们"),
            t("They included photographs taken through the telescope", "它们附有用望远镜拍摄的照片"),
            t("Every other newspaper had already printed the same story", "其他所有报纸都已刊登过同样的故事"),
          ],
          t(
            "The third paragraph says the articles claimed to come from a scientific journal and were full of technical details, which made them sound convincing.",
            "第三段说文章声称来自一份科学刊物，并充满技术细节，所以听起来很有说服力。",
          ),
        ),
        ask(
          t("What did the Sun gain from the hoax?", "《太阳报》从这场骗局中得到了什么？"),
          t("A large rise in sales", "销量大幅上升"),
          [
            t("A prize for scientific reporting", "一个科学报道奖"),
            t("A new telescope from Herschel", "赫歇尔送的一台新望远镜"),
            t("An apology from its rival papers", "竞争对手报纸的道歉"),
          ],
          t(
            "The third paragraph says the Sun's sales soared and it claimed the largest circulation in the world.",
            "第三段说《太阳报》销量猛增，并声称拥有世界上最大的发行量。",
          ),
        ),
        ask(
          t("What lasting point does the final paragraph make?", "最后一段提出了什么持久的观点？"),
          t("People still believe exciting stories from sources they cannot check", "人们仍然相信来自无法核实来源的刺激性故事"),
          [
            t("Newspapers today never print false stories", "今天的报纸从不刊登虚假新闻"),
            t("Scientists should not build large telescopes", "科学家不应该建造大型望远镜"),
            t("The moon may really have life on it after all", "月球上也许真的有生命"),
          ],
          t(
            "It says people are more likely to believe exciting, technical-sounding stories from sources they cannot check, and the reasons have not changed.",
            "它说人们更容易相信听起来刺激、技术性强、来源又无法核实的故事，而这些原因至今未变。",
          ),
        ),
      ],
      ["Sun", "Sir", "John", "Herschel", "Cape", "Africa", "Edinburgh", "Richard", "Adams", "Locke", "British"],
    ),
    passage(
      "ten-days-inside",
      t("Ten Days Inside", "在里面的十天"),
      `In 1887, a twenty-three-year-old reporter who wrote under the name Nellie Bly was given a dangerous assignment by the New York World. There were rumors of cruelty at the city's asylum for women on Blackwell's Island, a narrow strip of land in the East River. The only way to find out the truth, her editor suggested, was to get inside.

Bly practiced looking confused in front of a mirror. Then she checked into a boarding house for women, stayed awake all night and acted strangely, talking about her missing trunks and refusing to go to bed. The other residents became frightened and called the police. Within days, she had been examined by several doctors, all of whom declared that she was insane. She was sent to the island.

Once inside, she stopped pretending. She behaved exactly as she normally did, calmly and sensibly. It made no difference. The more sanely she acted, she later wrote, the crazier she was thought to be.

What she found was worse than the rumors. The patients were given bread that was almost inedible and meat that was often spoiled. They sat for hours on hard benches in cold rooms, forbidden to talk or move. They were plunged into tubs of icy water and scrubbed with harsh soap. Nurses mocked and slapped them. Bly met women who seemed perfectly sane, including some immigrants who had been sent there simply because they could not speak English well enough to explain themselves to the doctors.

After ten days, a lawyer from the World arrived to secure her release. Her report, published in two parts and later as a book, caused a sensation. Readers were shocked not only by the cruelty but by how easily a sane woman had been declared insane. A grand jury investigated the asylum and visited the island with Bly. The city greatly increased the money it spent on the care of patients, and the examinations used to commit people became more careful.

Bly's work helped to create a new kind of journalism, sometimes called investigative or undercover reporting. Instead of repeating what officials said, a reporter could go and see for herself. Her methods raised questions that journalists still debate. Is it ever right for a reporter to lie about who she is? Bly would probably have answered that the lie was small and the truth it revealed was large. The women on the island had no other way to be heard.`,
      [pressWords, bias, academic2, academic3],
      [
        ask(
          t("Why did Bly pretend to be insane?", "布莱为什么假装精神失常？"),
          t("It was the only way to see the conditions inside the asylum", "这是了解精神病院内部状况的唯一办法"),
          [
            t("She wanted to stay in a boarding house for free", "她想免费住在寄宿公寓"),
            t("Her editor wanted to test the city's police", "她的编辑想考验城市的警察"),
            t("She had lost her trunks and needed help", "她丢了箱子，需要帮助"),
          ],
          t(
            "The first paragraph says the only way to find out the truth about the rumored cruelty was to get inside.",
            "第一段说，要查明传闻中的虐待真相，唯一的办法就是进去。",
          ),
        ),
        ask(
          t("What did Bly's experience suggest about the doctors' examinations?", "布莱的经历表明医生的检查怎样？"),
          t(
            "They were so careless that a sane woman could easily be declared insane",
            "检查如此草率，一个正常的女人很容易就被判定为精神失常",
          ),
          [
            t("They were the most careful examinations in the world", "它们是世界上最仔细的检查"),
            t("They were done only by lawyers from the World", "检查只由《世界报》的律师进行"),
            t("They found every patient to be perfectly sane", "它们发现每个病人都完全正常"),
          ],
          t(
            "Several doctors declared her insane, and readers were shocked by how easily a sane woman had been declared insane.",
            "几位医生都判定她精神失常，读者对一个正常女人如此轻易地被判定为疯子感到震惊。",
          ),
        ),
        ask(
          t("What question about Bly's method does the passage raise?", "关于布莱的方法，文章提出了什么问题？"),
          t("Whether a reporter may ever lie about who she is", "记者是否可以在身份上撒谎"),
          [
            t("Whether a book should be published in two parts", "一本书是否应该分两部分出版"),
            t("Whether a grand jury should visit an island", "大陪审团是否应该去一座岛上视察"),
            t("Whether nurses should be allowed to speak English", "护士是否应该被允许讲英语"),
          ],
          t(
            "The last paragraph asks whether it is ever right for a reporter to lie about who she is.",
            "最后一段问记者在身份上撒谎是否在任何时候都是正当的。",
          ),
        ),
      ],
      ["Nellie", "Bly", "Bly's", "Blackwell's", "World", "English"],
    ),
    passage(
      "remember-the-maine",
      t("Remember the Maine", "记住缅因号"),
      `On the night of February 15, 1898, an American warship called the Maine exploded in the harbor of Havana, Cuba. The blast tore apart the front of the ship, and it sank within minutes. Two hundred and sixty-six sailors were killed.

At the time, Cuba was a colony of Spain, and Cuban rebels had been fighting for independence for three years. Spain's army had responded harshly, forcing hundreds of thousands of country people into crowded camps, where many died of hunger and disease. Many Americans sympathized with the rebels. The Maine had been sent to Havana to protect American citizens and to show American power.

No one knew what had caused the explosion. But two of the most popular newspapers in New York did not wait to find out. William Randolph Hearst's Journal and Joseph Pulitzer's World were fighting a fierce battle for readers, and they had discovered that dramatic stories about Cuba sold papers. Within days, the Journal printed a headline across its whole front page claiming that the warship had been destroyed by an enemy's secret weapon. It offered a reward for information about the guilty. It printed drawings of the explosion as if an artist had seen it, though none had.

This kind of reporting came to be called yellow journalism. It used huge headlines, dramatic pictures, invented details and an appeal to emotion rather than to evidence. A popular slogan spread across the country: "Remember the Maine!" A famous story claims that Hearst told an artist in Cuba, "You furnish the pictures, and I'll furnish the war." Historians doubt that he ever said it, but the story survived because it seemed to fit.

In April 1898, the United States declared war on Spain. The war lasted less than four months. Spain lost Cuba, and the United States took control of Puerto Rico, Guam and the Philippines. The newspapers sold millions of copies.

How much the press caused the war is still debated. Many historians argue that other forces, including business interests and politicians who wanted an empire, mattered more. But the newspapers shaped how ordinary Americans felt, and they made calm discussion difficult.

And what destroyed the Maine? A navy investigation in 1898 blamed a mine. In 1976, a new study led by an American admiral concluded that the most likely cause was a fire in the ship's own coal store, which set off its ammunition. If that is true, the war began with an accident that newspapers had turned into an attack.`,
      [pressWords, bias, academic2, academic1],
      [
        ask(
          t(
            "Why were the Journal and the World eager to print dramatic stories about Cuba?",
            "为什么《新闻报》和《世界报》急于刊登有关古巴的耸人听闻的故事？",
          ),
          t("They were competing for readers, and such stories sold papers", "它们在争夺读者，而这样的故事能卖报"),
          [
            t("They had proof that Spain had sunk the Maine", "它们有证据证明西班牙击沉了缅因号"),
            t("The government had ordered them to support the war", "政府命令它们支持战争"),
            t("Their reporters had seen the explosion themselves", "它们的记者亲眼看见了爆炸"),
          ],
          t(
            "The third paragraph says the two papers were fighting a fierce battle for readers and had discovered that dramatic stories about Cuba sold papers.",
            "第三段说这两家报纸在激烈争夺读者，并发现有关古巴的戏剧性故事能卖报。",
          ),
        ),
        ask(
          t("Which of these is a sign of bias in the Journal's coverage?", "下面哪一项是《新闻报》报道中存在偏见的迹象？"),
          t("It blamed an enemy weapon before anyone knew the cause", "在任何人知道原因之前，它就归咎于敌人的武器"),
          [
            t("It reported the number of sailors who died", "它报道了死亡水兵的人数"),
            t("It described where Havana harbor is", "它描述了哈瓦那港的位置"),
            t("It said that the war lasted four months", "它说战争持续了四个月"),
          ],
          t(
            "No one knew the cause, yet the Journal claimed a secret enemy weapon and printed invented drawings, choosing a conclusion before the evidence.",
            "当时没人知道原因，《新闻报》却声称是敌人的秘密武器，还刊登了虚构的图画，在证据出现前就下了结论。",
          ),
        ),
        ask(
          t('Why does the passage say the Hearst quotation "survived"?', '文章为什么说赫斯特那句话"流传了下来"？'),
          t("It seemed to fit what people believed, though it was probably never said", "它似乎符合人们的看法，尽管很可能从未说过"),
          [
            t("It was recorded on film by a reporter", "一位记者用胶片记录了它"),
            t("Hearst repeated it in every newspaper", "赫斯特在每份报纸上都重复它"),
            t("It was printed on the side of the Maine", "它被印在缅因号的船身上"),
          ],
          t(
            "The fourth paragraph says historians doubt he said it, but the story survived because it seemed to fit.",
            "第四段说历史学家怀疑他说过这句话，但这个故事因为似乎符合事实而流传下来。",
          ),
        ),
      ],
      [
        "Maine",
        "Havana",
        "Cuba",
        "Cuban",
        "Spain",
        "William",
        "Randolph",
        "Hearst",
        "Hearst's",
        "Journal",
        "Joseph",
        "Pulitzer's",
        "World",
        "Puerto",
        "Rico",
        "Guam",
        "Philippines",
        "Americans",
        "American",
      ],
    ),
    passage(
      "follow-the-money",
      t("Follow the Money", "顺着钱查下去"),
      `Early on the morning of June 17, 1972, a security guard at the Watergate office building in Washington, D.C., noticed a piece of tape holding a door unlocked. He called the police, who arrested five men inside the headquarters of the Democratic Party. They were wearing gloves and carrying cameras and listening devices.

At first, it seemed like a minor crime. The White House called it a "third-rate burglary." But two young reporters at the Washington Post, Bob Woodward and Carl Bernstein, began to ask questions. Why did one of the burglars have the phone number of a White House official in his address book? Where had the money in their pockets come from?

Over the following months, Woodward and Bernstein knocked on hundreds of doors, often late at night. Most people refused to talk. Some were frightened. Slowly, the reporters traced the burglars' money to a fund controlled by President Richard Nixon's re-election campaign. They discovered that the break-in was only one part of a wider campaign of spying and dirty tricks against Nixon's political opponents.

The Post's editors were cautious. A story that accused the president's men of crimes would be attacked fiercely, and a single mistake could destroy the paper's credibility. They insisted that every important fact be confirmed by at least two independent sources before it was printed. When the reporters made an error in one story, the White House used it to attack the whole investigation, and the Post had to correct it.

One of Woodward's most important sources was a senior government official who would meet him only in secret, in an underground car park. The Post's editors gave him the nickname "Deep Throat." He rarely gave new information, but he confirmed or denied what the reporters had found, and he urged them to "follow the money." His identity was kept secret for more than thirty years. In 2005, he revealed that he was Mark Felt, who had been the second most senior official at the FBI.

The reporting led to investigations by the Senate and by a special prosecutor. Recordings that Nixon had secretly made in his own office showed that he had helped to cover up the crime. Facing almost certain removal from office, he resigned in August 1974, the only American president ever to do so.

Watergate made investigative reporting famous, and many young people became journalists because of it. It also showed how much patient, careful work stands behind a single true story.`,
      [pressWords, academic1],
      [
        ask(
          t(
            "What first made the reporters suspect the burglary was more than a minor crime?",
            "最初是什么让记者怀疑这起入室盗窃不只是小案？",
          ),
          t(
            "A burglar had a White House official's number, and the money's source was unclear",
            "一名窃贼有白宫官员的电话号码，钱的来源也不清楚",
          ),
          [
            t("The president announced that it was a serious crime", "总统宣布这是一起严重的犯罪"),
            t("The security guard told them about a secret fund", "保安告诉他们有一笔秘密资金"),
            t("Deep Throat called them on the night of the arrest", '"深喉"在逮捕当晚给他们打了电话'),
          ],
          t(
            "The second paragraph says they asked why a burglar had a White House official's number and where the money in their pockets came from.",
            "第二段说他们追问一名窃贼为什么有白宫官员的电话号码，以及他们口袋里的钱从哪儿来。",
          ),
        ),
        ask(
          t(
            "Why did the Post insist on two independent sources for every important fact?",
            "《华盛顿邮报》为什么坚持每个重要事实都要有两个独立来源？",
          ),
          t("A single mistake could be used to destroy the paper's credibility", "一个错误就可能被用来摧毁报纸的公信力"),
          [
            t("The law required every newspaper to do so", "法律要求每家报纸都这样做"),
            t("Woodward and Bernstein disagreed about everything", "伍德沃德和伯恩斯坦在每件事上都意见不一"),
            t("Deep Throat refused to speak to only one reporter", '"深喉"拒绝只和一位记者交谈'),
          ],
          t(
            "The fourth paragraph says a story accusing the president's men would be attacked fiercely, and one mistake could destroy the paper's credibility.",
            "第四段说指控总统手下的报道会遭到猛烈攻击，一个错误就可能毁掉报纸的公信力。",
          ),
        ),
        ask(
          t("What finally proved that Nixon had helped cover up the crime?", "最终是什么证明尼克松帮助掩盖了罪行？"),
          t("Recordings he had secretly made in his own office", "他在自己办公室秘密录制的录音"),
          [
            t("A confession he gave to the Washington Post", "他向《华盛顿邮报》作出的供认"),
            t("Photographs taken by the five burglars", "五名窃贼拍摄的照片"),
            t("A letter from Mark Felt to the Senate", "马克·费尔特写给参议院的信"),
          ],
          t(
            "The sixth paragraph says recordings Nixon had secretly made in his office showed he had helped cover up the crime.",
            "第六段说尼克松在办公室秘密录制的录音表明他帮助掩盖了罪行。",
          ),
        ),
      ],
      [
        "Watergate",
        "Washington",
        "D.C.",
        "Democratic",
        "Post",
        "Post's",
        "Bob",
        "Woodward",
        "Woodward's",
        "Carl",
        "Bernstein",
        "Richard",
        "Nixon",
        "Nixon's",
        "Mark",
        "Felt",
        "FBI",
        "American",
      ],
    ),
    passage(
      "the-poll-that-asked-the-wrong-people",
      t("The Poll That Asked the Wrong People", "问错了人的民意调查"),
      `In 1936, the United States was in the middle of the Great Depression, and Americans were choosing a president. The Democrat Franklin Roosevelt was seeking a second term. His opponent was the Republican Alf Landon, the governor of Kansas.

The most famous poll in the country was run by a popular magazine called the Literary Digest. It had correctly predicted the winner of every presidential election since 1916. In 1936, it mailed questionnaires to about ten million people, an enormous number. About 2.4 million sent them back. The magazine counted the answers and announced its prediction with confidence: Landon would win easily, with about 57 percent of the vote.

On election day, Roosevelt won one of the largest victories in American history. He took about 61 percent of the vote and won every state but two. The Digest's prediction was wrong by almost twenty points. Within two years, the magazine had closed.

How could a survey of more than two million people be so wrong? The answer is that the size of a sample matters far less than whether it represents the whole population.

The Digest had chosen the people it wrote to from lists that were easy to obtain: telephone directories, lists of car owners and its own subscribers. In 1936, during the Depression, people who owned telephones and cars were wealthier than average, and wealthier voters were more likely to support Landon. Millions of poorer Americans, who strongly supported Roosevelt, were left out.

There was a second problem. Of the ten million people who received questionnaires, most did not reply. Those who did were not a random group. People who were angry with the government and wanted change were more eager to send their answers back. So the sample was distorted twice: once by who was asked, and again by who answered.

That same year, a young researcher named George Gallup predicted Roosevelt's victory using a sample of only about fifty thousand people. Instead of collecting as many answers as possible, he carefully chose people to match the population in age, income, region and other characteristics. His method became the basis of modern polling.

The lesson of 1936 still applies whenever a number is used to describe what "people" think. A large figure can look impressive. Before trusting it, ask who was counted, who was left out and who chose not to answer.`,
      [numbers, bias, academic3, academic2],
      [
        ask(
          t("What was the main reason the Literary Digest poll was wrong?", "《文学文摘》的民意调查出错的主要原因是什么？"),
          t("Its sample did not represent the whole population of voters", "它的样本不能代表全体选民"),
          [
            t("It asked far too few people to be useful", "它调查的人太少，没有用"),
            t("It counted the answers from the wrong year", "它统计了错误年份的答案"),
            t("Landon paid the magazine to change the results", "兰登花钱让杂志修改结果"),
          ],
          t(
            "The fourth and fifth paragraphs say the size of a sample matters less than whether it represents the population, and the Digest's lists left out poorer voters.",
            "第四段和第五段说样本大小远不如其代表性重要，而《文摘》的名单漏掉了较穷的选民。",
          ),
        ),
        ask(
          t("Why did using telephone directories and lists of car owners distort the sample?", "为什么用电话簿和车主名单会使样本失真？"),
          t("People with phones and cars were wealthier and more likely to favor Landon", "有电话和汽车的人更富裕，更可能支持兰登"),
          [
            t("People with phones never voted in elections", "有电话的人从不参加选举投票"),
            t("Car owners lived only in the state of Kansas", "车主只住在堪萨斯州"),
            t("The lists were printed before 1916", "这些名单是在1916年之前印制的"),
          ],
          t(
            "The fifth paragraph says owners of phones and cars were wealthier than average during the Depression, and wealthier voters favored Landon.",
            "第五段说大萧条期间有电话和汽车的人比一般人富裕，而较富裕的选民支持兰登。",
          ),
        ),
        ask(
          t("How did Gallup's method differ from the Digest's?", "盖洛普的方法与《文摘》有什么不同？"),
          t("He chose a smaller sample carefully to match the population", "他精心挑选较小的样本，使其与总体相符"),
          [
            t("He mailed questionnaires to even more people", "他把问卷寄给了更多的人"),
            t("He asked only the magazine's own subscribers", "他只调查杂志自己的订户"),
            t("He counted only the answers of angry voters", "他只统计愤怒选民的答案"),
          ],
          t(
            "The seventh paragraph says Gallup used about fifty thousand people chosen to match the population in age, income, region and more.",
            "第七段说盖洛普用了大约五万人，他们是按年龄、收入、地区等与总体相匹配挑选出来的。",
          ),
        ),
      ],
      [
        "Depression",
        "Americans",
        "American",
        "Democrat",
        "Franklin",
        "Roosevelt",
        "Roosevelt's",
        "Republican",
        "Alf",
        "Landon",
        "Kansas",
        "Literary",
        "Digest",
        "Digest's",
        "George",
        "Gallup",
      ],
    ),
    passage(
      "the-planes-that-came-back",
      t("The Planes That Came Back", "飞回来的飞机"),
      `During the Second World War, a group of mathematicians in New York worked on problems for the American military. One of them was Abraham Wald, a quiet man who had fled from Europe to escape the Nazis. One of the questions put to the group seemed simple. Where should the air force add armor to its bombers?

Armor protects a plane from bullets, but it is heavy. A plane covered in it would be too slow and would use too much fuel. So the military wanted to put armor only where it was most needed.

The officers had collected data. When bombers returned from missions over Europe, mechanics recorded where they had been hit. The pattern was clear. The planes had many bullet holes in the wings, in the body and around the tail. They had far fewer in the engines. The obvious conclusion was to add armor to the areas with the most holes, since those were the areas being hit most often.

Wald saw the problem at once. The officers were studying only the planes that had come back. The planes that had been shot down were not in the data at all. If returning planes had few holes in their engines, it was not because engines were rarely hit. It was because planes that were hit in the engines usually did not return. The holes in the wings and body showed where a plane could be damaged and still survive. The armor, Wald said, should go where the holes were not.

This kind of mistake is now called survivorship bias. It happens whenever people study only the examples that survived some kind of test and forget the ones that did not. It appears in many places outside war.

Books about successful businesses often describe what famous companies did, such as taking bold risks or following a dream. But many companies that did the same things failed, and nobody writes books about them. People sometimes say that old buildings were made better than new ones, because the old buildings that remain are so solid. But the badly built old buildings fell down or were demolished long ago, so we no longer see them.

Survivorship bias is dangerous because the missing data is, by its nature, invisible. No one notices what is not there. The best protection is a simple question that Wald asked: what am I not seeing, and why?`,
      [numbers, academic3],
      [
        ask(
          t("Why did the returning planes have few holes in their engines?", "为什么飞回来的飞机发动机上弹孔很少？"),
          t("Planes hit in the engines usually did not make it back", "发动机中弹的飞机通常飞不回来"),
          [
            t("The enemy never aimed at the engines", "敌人从不瞄准发动机"),
            t("The engines were already covered in thick armor", "发动机已经覆盖了厚厚的装甲"),
            t("Mechanics forgot to count holes in the engines", "机械师忘了数发动机上的弹孔"),
          ],
          t(
            "The fourth paragraph says it was not because engines were rarely hit but because planes hit in the engines usually did not return.",
            "第四段说这不是因为发动机很少中弹，而是因为发动机中弹的飞机通常回不来。",
          ),
        ),
        ask(
          t("How do books about successful businesses show survivorship bias?", "关于成功企业的书怎样体现幸存者偏差？"),
          t("They ignore the many companies that did the same things and failed", "它们忽视了许多做了同样事情却失败的公司"),
          [
            t("They describe only companies that have closed", "它们只描写已经倒闭的公司"),
            t("They advise companies never to take risks", "它们建议公司永远不要冒险"),
            t("They are written by the owners of the companies", "它们是由公司老板写的"),
          ],
          t(
            "The sixth paragraph says many companies that did the same things failed, and nobody writes books about them.",
            "第六段说许多做了同样事情的公司失败了，却没有人写关于它们的书。",
          ),
        ),
        ask(
          t("Why does the passage call survivorship bias dangerous?", "文章为什么说幸存者偏差很危险？"),
          t("The missing examples are invisible, so no one notices them", "缺失的例子是看不见的，所以没人注意到它们"),
          [
            t("It is used only by the military in wartime", "只有军队在战时才使用它"),
            t("It makes planes too heavy to fly", "它使飞机太重而飞不起来"),
            t("It causes old buildings to fall down", "它导致旧建筑倒塌"),
          ],
          t(
            "The last paragraph says the missing data is invisible by its nature, and no one notices what is not there.",
            "最后一段说缺失的数据本质上是看不见的，没有人会注意到不存在的东西。",
          ),
        ),
      ],
      ["Abraham", "Wald", "Europe", "Nazis", "American"],
    ),
    passage(
      "built-to-keep-you-scrolling",
      t("Built to Keep You Scrolling", "让你不停滑动的设计"),
      `Pick up a phone and open almost any social media app. Before you have decided what you want to see, the app has already decided for you. A feed of posts appears, chosen and arranged by a computer program. When you reach the bottom, there is no bottom. More posts load automatically, and the feed goes on forever.

This feature, called infinite scroll, was created in the mid-2000s by a designer named Aza Raskin, who wanted to make websites easier to use. Years later, he said that he regretted it. By removing the natural stopping point at the end of a page, he had helped to create a tool that kept people scrolling long after they would otherwise have stopped. He has estimated that it wastes the equivalent of hundreds of thousands of human lifetimes every day.

Most social media platforms earn money from advertising. The more time people spend on an app, the more advertisements they see, and the more the company earns. So the companies measure engagement: how long people stay, how often they return and how much they click, like and share. Much of the design of these apps has been shaped to increase these numbers.

Some features borrow ideas from psychology. A notification, with its red badge and its sound, draws attention like a tap on the shoulder. Pulling down a feed to refresh it works a little like a slot machine: sometimes there is something exciting, often there is not, and that uncertainty keeps people pulling. Researchers have found that unpredictable rewards are especially powerful in forming habits.

The programs that curate the feed learn what holds each user's attention. They often find that strong emotions, especially anger and outrage, produce the most engagement. A calm, careful post may be seen by a few hundred people; an angry or shocking one may reach millions. Clickbait headlines, which promise more than the article delivers, are written for the same reason.

Not everyone agrees about how harmful this is. Some studies link heavy use of social media to anxiety and poor sleep in teenagers, while others find the effects small or unclear. Many people use these platforms to stay in touch with friends, learn new things and find communities.

What is certain is that the apps are not neutral. They are designed by skilled people with a clear goal. Knowing that goal is the first step toward deciding, for yourself, how much of your attention to give.`,
      [mediaWords, bias, academic1, academic2],
      [
        ask(
          t("Why did Aza Raskin come to regret inventing infinite scroll?", "阿扎·拉斯金为什么后悔发明了无限滚动？"),
          t("It removed a natural stopping point and kept people scrolling too long", "它去掉了自然的停止点，让人们滑动太久"),
          [
            t("It made websites much harder for people to use", "它使网站变得更难用"),
            t("It was copied by a company that did not pay him", "它被一家没付他钱的公司抄袭了"),
            t("It caused phones to run out of battery", "它导致手机电量耗尽"),
          ],
          t(
            "The second paragraph says that by removing the stopping point at the end of a page, he helped create a tool that kept people scrolling long after they would have stopped.",
            "第二段说他去掉了页面末尾的停止点，帮助制造了一种让人们在本该停下后仍长时间滑动的工具。",
          ),
        ),
        ask(
          t("Why do social media companies care so much about engagement?", "社交媒体公司为什么如此在意参与度？"),
          t("More time on the app means more advertisements seen and more money", "在应用上花的时间越多，看到的广告越多，赚的钱也越多"),
          [
            t("Governments pay them for every post that is shared", "政府为每条被分享的帖子付钱给它们"),
            t("Engagement makes the phones themselves cheaper", "参与度使手机本身更便宜"),
            t("Users pay a fee each time they click a post", "用户每点击一次帖子就要付费"),
          ],
          t(
            "The third paragraph says most platforms earn money from advertising, so more time spent means more advertisements and more earnings.",
            "第三段说大多数平台靠广告赚钱，所以使用时间越长，广告越多，收入也越多。",
          ),
        ),
        ask(
          t("Why might an angry post reach far more people than a calm one?", "为什么愤怒的帖子可能比平静的帖子传播得更广？"),
          t("The programs learn that strong emotions produce the most engagement", "程序发现强烈的情绪能带来最多的参与"),
          [
            t("Angry posts are always more accurate than calm ones", "愤怒的帖子总是比平静的更准确"),
            t("Calm posts are deleted by the platforms", "平静的帖子会被平台删除"),
            t("Only angry people use social media", "只有愤怒的人才使用社交媒体"),
          ],
          t(
            "The fifth paragraph says the programs often find that anger and outrage produce the most engagement, so such posts are shown to more people.",
            "第五段说程序常常发现愤怒和激愤能带来最多参与，所以这类帖子会被推送给更多人。",
          ),
        ),
      ],
      ["Aza", "Raskin"],
    ),
    passage(
      "the-clip-that-went-everywhere",
      t("The Clip That Went Everywhere", "传遍各处的片段"),
      `The video was eleven seconds long. It showed a man in a gray jacket shouting at a teenage cashier in a supermarket, waving his arms while she shrank back behind the counter. Someone had added a caption in large white letters: "This is how he treats kids. Share until he's found."

Priya saw it on Tuesday evening, when it had a few hundred views. By Wednesday morning it had two million. An influencer with a huge following had posted it with an angry comment, and it had become a meme, the man's red face pasted onto other pictures with jokes about bad customers. Someone online claimed to have identified him by his jacket and posted his name, his workplace and a photograph of his house.

Priya wrote for her school's online newspaper, and her editor, a senior named Marcus, wanted a story by the afternoon. "Everyone's talking about it," he said. "We need to be part of the conversation."

But something bothered Priya. The video began in the middle of the argument. Nobody knew what had happened before it. And the only source for the man's name was an anonymous account that had been created that same week.

So instead of writing, she called the supermarket. The manager would not talk to her at first, but when she explained that she was a student reporter trying to get the facts right, he agreed to tell her what he could. The man in the video, he said, had not been shouting at the cashier. He had been shouting at someone behind her, a man who had just grabbed the cashier's bag from under the counter and run out of the store. The full security video showed it clearly. The man in the gray jacket had then chased the thief into the car park.

And the name that had been posted online belonged to someone else entirely, a teacher in another city who happened to own a similar jacket. He was now receiving hundreds of threatening messages.

Priya wrote her story that night, with every detail confirmed by two sources. It was shared a few hundred times. The original video had been viewed eight million times.

The influencer eventually posted a short apology and deleted the clip. Several news sites that had repeated the false claim quietly changed their articles. But the teacher told a local newspaper that strangers still recognized him in the street.

"A lie can travel halfway around the world," Marcus said when he read Priya's story, "while the truth is still putting on its shoes." Then he added, "Next time, we wait for the shoes."`,
      [mediaWords, pressWords, bias, academic1],
      [
        ask(
          t("What made Priya suspicious of the video before she wrote anything?", "普丽娅在写之前，是什么让她对视频起了疑心？"),
          t(
            "It started mid-argument, and the man's name came from a brand-new anonymous account",
            "它从争吵中间开始，而那人的名字来自一个刚注册的匿名账号",
          ),
          [
            t("The cashier in the video was one of her classmates", "视频里的收银员是她的同学"),
            t("Marcus told her that the video was a fake", "马库斯告诉她那个视频是假的"),
            t("The supermarket had already denied the story", "超市已经否认了这件事"),
          ],
          t(
            "The fourth paragraph says the video began in the middle of the argument and the only source for the name was an anonymous account created that week.",
            "第四段说视频从争吵中间开始，而名字的唯一来源是当周才创建的匿名账号。",
          ),
        ),
        ask(
          t("What did the full security video show?", "完整的监控录像显示了什么？"),
          t("The man was shouting at a thief who had stolen the cashier's bag", "那个男人是在冲一个偷了收银员包的小偷大喊"),
          [
            t("The man was shouting at the cashier for being slow", "那个男人在因收银员动作慢而冲她大喊"),
            t("The cashier had started the argument herself", "是收银员自己挑起了争吵"),
            t("The man was a teacher from another city", "那个男人是另一座城市的老师"),
          ],
          t(
            "The manager said the man was shouting at someone who had grabbed the cashier's bag, and then chased the thief.",
            "经理说那个男人是在冲一个抓走收银员包的人大喊，然后去追那个小偷。",
          ),
        ),
        ask(
          t("What contrast do the numbers in the story emphasize?", "故事中的数字强调了什么对比？"),
          t("The false clip spread far more widely than the careful correction", "虚假片段的传播远比严谨的更正广泛"),
          [
            t("More people read school newspapers than watch videos", "读校报的人比看视频的人多"),
            t("The supermarket earned more money after the video", "视频之后超市赚了更多钱"),
            t("The influencer had fewer followers than Priya", "那位网红的粉丝比普丽娅少"),
          ],
          t(
            "Priya's confirmed story was shared a few hundred times, while the original video was viewed eight million times.",
            "普丽娅核实过的报道只被分享了几百次，而原视频被观看了八百万次。",
          ),
        ),
      ],
      ["Priya", "Priya's", "Marcus"],
    ),
  ],
};
