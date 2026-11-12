// Grade 9: the reading unit of the fourth theme, coming of age, from the rites that mark it around the world and the
// science of the teenage brain to the novels and diaries of young people growing up.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grade-5/reading-kit.ts";

const growingWords = { topic: "words-of-growing-up", weight: 0.3 } as const;
const familyWords = { topic: "words-of-family-and-belonging", weight: 0.3 } as const;
const courageWords = { topic: "words-of-courage-and-fear", weight: 0.3 } as const;
const theme = { topic: "how-a-theme-develops", weight: 0.2 } as const;
const time = { topic: "manipulating-time-in-a-story", weight: 0.2 } as const;
const academic3 = { topic: "academic-words-3", weight: 0.1 } as const;

/** comingOfAge is a reading unit of grade 9 on growing up, in life, in science and in literature. */
export const comingOfAge: ReadingUnitDef = {
  id: "coming-of-age",
  title: t("Coming of Age", "成长"),
  passages: [
    passage(
      "rites-of-passage",
      t("Rites of Passage", "成年礼"),
      `Every human society has to answer the same question: when does a child become an adult? Many cultures answer it with a ceremony, a rite of passage that marks the moment publicly. In 1909, the French scholar Arnold van Gennep noticed that these rites, however different they look, often share three stages. First, the young person is separated from childhood. Next comes a period of transition, which may involve a test. Finally, the young person returns to the community with a new status.

The test can be severe. Among the Sateré-Mawé people of the Amazon, boys who wish to be recognized as men must put their hands into gloves woven with hundreds of bullet ants, whose sting is among the most painful of any insect. They must wear the gloves for several minutes, and they repeat the ordeal many times over months. The point is not cruelty but endurance: a man, the ritual says, must bear pain without giving up.

Other rites are celebrations. In much of Latin America, a girl's fifteenth birthday is marked by a quinceañera, which usually begins with a religious service and continues with a party, a formal dress and a dance with her father. In Japan, every year on the second Monday of January, cities hold ceremonies for everyone who has reached adulthood that year. Young people dress in their finest clothes, many in traditional kimono, and listen to speeches about the responsibilities they now carry.

In many modern societies, though, the line is blurred. A young person may be allowed to drive at one age, vote at another and drink at a third. Some sociologists argue that without a clear rite, the passage to adulthood has become longer and more confusing.

Perhaps that is why so many young people create their own rites: a first job, a first trip alone, a graduation. Each says the same thing that the ancient ceremonies said. Something has ended. Something new has begun.`,
      [growingWords, familyWords, courageWords],
      [
        ask(
          t("What three stages did van Gennep find in many rites of passage?", "范热内普在许多成年礼中发现了哪三个阶段？"),
          t("Separation, transition and return with a new status", "分离、过渡、以新身份回归"),
          [
            t("Birth, marriage and death", "出生、结婚、死亡"),
            t("Learning, testing and failing", "学习、考验、失败"),
            t("Praying, dancing and feasting", "祈祷、跳舞、宴饮"),
          ],
          t(
            "The first paragraph says the young person is separated from childhood, goes through a transition and returns with a new status.",
            "第一段说年轻人先与童年分离，经历过渡期，然后以新身份回到群体中。",
          ),
        ),
        ask(
          t("What is the point of the bullet ant ritual, according to the passage?", "根据文章，子弹蚁仪式的意义是什么？"),
          t("Endurance: bearing pain without giving up", "忍耐：承受痛苦而不放弃"),
          [
            t("Learning to catch dangerous insects", "学会捕捉危险的昆虫"),
            t("Punishing boys who have misbehaved", "惩罚行为不端的男孩"),
            t("Protecting the village from ants", "保护村庄免受蚂蚁侵害"),
          ],
          t(
            "The second paragraph says the point is not cruelty but endurance: a man must bear pain without giving up.",
            "第二段说其意义不在于残酷，而在于忍耐：男人必须承受痛苦而不放弃。",
          ),
        ),
        ask(
          t(
            "Why do some sociologists think the passage to adulthood has become more confusing?",
            "为什么一些社会学家认为步入成年变得更令人困惑了？",
          ),
          t("Without a clear rite, different adult rights come at different ages", "没有明确的仪式，各种成人权利在不同年龄才获得"),
          [
            t("Young people no longer want to become adults", "年轻人不再想成为成年人"),
            t("The old ceremonies have become too painful", "古老的仪式变得太痛苦了"),
            t("Schools have stopped holding graduations", "学校不再举行毕业典礼"),
          ],
          t(
            "The fourth paragraph says the line is blurred, with driving, voting and drinking at different ages, and that without a clear rite the passage has become more confusing.",
            "第四段说界线模糊了，开车、投票、饮酒的年龄各不相同，没有明确的仪式，步入成年就变得更令人困惑。",
          ),
        ),
      ],
      ["French", "Arnold", "van", "Gennep", "Sateré-Mawé", "Amazon", "Latin", "America", "Japan", "Monday", "January", "Gennep's"],
      ["quinceañera", "kimono"],
    ),
    passage(
      "the-teenage-brain",
      t("The Teenage Brain", "青少年的大脑"),
      `For a long time, scientists believed that the human brain was mostly finished by the end of childhood. A child's brain reaches about ninety percent of its adult size by the age of six. Surely, people thought, the important building was over.

In the 1990s, brain scanning changed that view. Researchers who scanned the same young people again and again, year after year, discovered that the brain goes through a second great period of change during adolescence. Some of the changes continue into the mid-twenties.

One change is a kind of pruning. In childhood, the brain grows huge numbers of connections between nerve cells. In the teenage years, connections that are used often become stronger and faster, while those that are rarely used are cut away. In a sense, the brain is shaping itself around what a person actually does. A teenager who practices the piano or speaks two languages is building a brain that is good at those things.

Another change has to do with timing. The parts of the brain that respond to rewards and to emotions become very active in early adolescence. The front part of the brain, which helps people plan, control impulses and think about consequences, matures more slowly. For several years, the accelerator is strong and the brakes are still being built.

This may help explain why teenagers are more likely than adults to take risks, especially when their friends are watching. In one well-known experiment, teenagers playing a driving game took far more risks when they knew their friends were in the next room. Adults did not.

Scientists warn against using this research to dismiss young people as foolish. The same features that lead to risks also make the teenage years a time of courage, curiosity and fast learning. Adolescence is not a broken version of adulthood. It is a stage with its own purpose: to leave the safety of childhood and learn to live in a wider world.`,
      [growingWords, courageWords],
      [
        ask(
          t("What happens to connections between nerve cells during the teenage years?", "青少年时期神经细胞之间的连接会发生什么变化？"),
          t("Often-used connections grow stronger, and rarely used ones are cut away", "常用的连接变强，很少用的被修剪掉"),
          [
            t("All connections grow at the same speed", "所有连接以相同速度增长"),
            t("The brain stops making connections entirely", "大脑完全停止建立连接"),
            t("Connections double in number every year", "连接数量每年翻倍"),
          ],
          t(
            "The third paragraph says connections that are used often become stronger and faster, while those rarely used are cut away.",
            "第三段说常用的连接变得更强更快，而很少用的则被修剪掉。",
          ),
        ),
        ask(
          t("What does the passage mean by the accelerator and the brakes?", "文中的“油门”和“刹车”指什么？"),
          t(
            "The reward and emotion areas are strong while the planning area is still maturing",
            "负责奖赏与情绪的区域很活跃，而负责计划的区域仍在发育",
          ),
          [
            t("Teenagers learn to drive before they learn to stop", "青少年先学会开车再学会停车"),
            t("The brain grows quickly and then stops growing", "大脑先快速生长然后停止生长"),
            t("Friends speed up learning and parents slow it down", "朋友加速学习，父母减缓学习"),
          ],
          t(
            "The fourth paragraph says reward and emotion areas become very active early, while the front part, which controls impulses, matures more slowly.",
            "第四段说奖赏与情绪区域很早就很活跃，而控制冲动的前部发育较慢。",
          ),
        ),
        ask(
          t("What did the driving game experiment show?", "驾驶游戏实验表明了什么？"),
          t("Teenagers took more risks when they knew friends were nearby", "青少年知道朋友在附近时会冒更多风险"),
          [
            t("Adults took more risks than teenagers", "成年人比青少年冒更多风险"),
            t("Teenagers drove more carefully with friends present", "朋友在场时青少年开得更小心"),
            t("Nobody took risks in the game", "游戏中没有人冒险"),
          ],
          t(
            "The fifth paragraph says teenagers took far more risks when they knew their friends were in the next room, and adults did not.",
            "第五段说青少年知道朋友在隔壁房间时冒了多得多的风险，而成年人没有。",
          ),
        ),
      ],
    ),
    passage(
      "novels-of-growing-up",
      t("Novels of Growing Up", "成长小说"),
      `In the late eighteenth century, the German writer Johann Wolfgang von Goethe published a novel about a young man named Wilhelm Meister, who leaves his merchant family to join a traveling theater company and slowly discovers who he is. Critics later used a German word for this kind of book: Bildungsroman, a novel of formation or education. In English it is often simply called a coming-of-age novel.

A Bildungsroman follows a young person from childhood or adolescence into adulthood. Usually the hero leaves home, suffers losses and disappointments, makes mistakes and gradually reaches maturity. The real subject is not the adventures themselves but the growth of a mind.

The form became especially popular in nineteenth-century England. In Charles Dickens's Great Expectations, an orphan named Pip receives money from a secret benefactor and is sent to London to become a gentleman. He grows ashamed of the kind blacksmith who raised him. Only after his fortune collapses does Pip understand what he has lost, and the novel's title becomes ironic: his great expectations were the wrong ones.

Charlotte Brontë's Jane Eyre, published in 1847, follows a poor, plain orphan girl through a cruel childhood and a harsh school to a job as a governess. Jane is told again and again to accept her place. Instead she insists on her own worth. “I am no bird,” she says, “and no net ensnares me.” Readers at the time were startled by a heroine with such a strong inner voice.

Many of these novels are told by an older narrator looking back. This creates two voices at once: the young person who does not yet understand, and the adult who does. The gap between them is where much of the meaning lies.

The form is still alive. Novels about young people from many backgrounds, finding their way between families, cultures and expectations, continue to be written all over the world, because every generation must grow up in its own way.`,
      [growingWords, familyWords, theme, time],
      [
        ask(
          t("What is the real subject of a Bildungsroman, according to the passage?", "根据文章，成长小说真正的主题是什么？"),
          t("The growth of a mind", "心智的成长"),
          [
            t("The history of a country", "一个国家的历史"),
            t("The adventures of a traveling theater", "一个巡回剧团的冒险"),
            t("The life of a merchant family", "一个商人家庭的生活"),
          ],
          t(
            "The second paragraph says the real subject is not the adventures themselves but the growth of a mind.",
            "第二段说真正的主题不是冒险本身，而是心智的成长。",
          ),
        ),
        ask(
          t("Why does the title Great Expectations become ironic?", "为什么《远大前程》这个书名具有讽刺意味？"),
          t("Pip's expectations turn out to be the wrong ones", "皮普的期望原来是错误的"),
          [
            t("Pip never receives any money", "皮普从未得到任何钱"),
            t("The blacksmith becomes a gentleman instead", "铁匠反而成了绅士"),
            t("Pip never leaves home", "皮普从未离开家"),
          ],
          t(
            "The third paragraph says only after his fortune collapses does Pip understand what he has lost, and his great expectations were the wrong ones.",
            "第三段说直到财富破灭，皮普才明白自己失去了什么，他的远大前程是错误的期望。",
          ),
        ),
        ask(
          t("What effect does an older narrator looking back create?", "一位回顾往事的年长叙述者会产生什么效果？"),
          t("Two voices: the young person who does not understand and the adult who does", "两种声音：尚不明白的年轻人和已经明白的成年人"),
          [
            t("A story told only in the present tense", "一个只用现在时讲述的故事"),
            t("A narrator who cannot be trusted at all", "一个完全不可信的叙述者"),
            t("A story with no memories in it", "一个没有任何回忆的故事"),
          ],
          t(
            "The fifth paragraph says looking back creates two voices at once, the young person who does not yet understand and the adult who does.",
            "第五段说回顾往事同时产生两种声音：尚不明白的年轻人和已经明白的成年人。",
          ),
        ),
      ],
      [
        "German",
        "Johann",
        "Wolfgang",
        "von",
        "Goethe",
        "Wilhelm",
        "Meister",
        "Bildungsroman",
        "English",
        "England",
        "Charles",
        "Dickens's",
        "Great",
        "Expectations",
        "Pip",
        "London",
        "Charlotte",
        "Brontë's",
        "Jane",
        "Eyre",
      ],
      ["ensnares"],
    ),
    passage(
      "a-diary-in-hiding",
      t("A Diary in Hiding", "藏身处的日记"),
      `On her thirteenth birthday, in June 1942, a Jewish girl named Anne Frank received a red-and-white checked notebook. She decided to use it as a diary and addressed her entries to an imaginary friend she called Kitty.

Anne lived in Amsterdam, in the Netherlands, which had been occupied by Nazi Germany since 1940. Jewish people there faced growing persecution. A few weeks after her birthday, her older sister Margot received an order to report to a labor camp. The family went into hiding at once, in secret rooms behind her father's office. Four more people later joined them. For more than two years, eight people lived in a small space hidden behind a movable bookcase, helped by a few brave office workers who brought them food and news.

The diary records the fear of hiding: the need to stay silent during working hours, the sound of bombers overhead, the terror of a break-in downstairs. But it also records something more ordinary and more surprising. Anne argues with her mother, feels misunderstood, falls in love for the first time and wonders what kind of person she wants to become. She writes about her ambition to be a journalist and a writer. In the cramped rooms, a teenager is growing up.

In 1944, Anne heard a radio broadcast asking Dutch people to keep their diaries as records of the war. She began to rewrite her diary, hoping to publish it as a book.

She never had the chance. In August 1944, the hiding place was discovered. Anne and her sister died in a concentration camp early in 1945, only weeks before it was freed. Of the eight who hid together, only her father, Otto, survived. One of the helpers had saved the diary, and she gave it to him.

Otto Frank published it in 1947. It has since been translated into more than seventy languages. Readers return to it not only as a record of a terrible time, but as the voice of a young writer who, even in the darkest place, kept trying to understand herself and the world.`,
      [growingWords, familyWords, courageWords],
      [
        ask(
          t("Why did Anne's family go into hiding?", "安妮一家为什么躲藏起来？"),
          t("Her sister received an order to report to a labor camp", "她姐姐接到了去劳动营报到的命令"),
          [
            t("Their house was destroyed by bombers", "他们的房子被轰炸机炸毁了"),
            t("Her father lost his office", "她父亲失去了办公室"),
            t("Anne wanted a quiet place to write", "安妮想要一个安静的地方写作"),
          ],
          t(
            "The second paragraph says Margot received an order to report to a labor camp, and the family went into hiding at once.",
            "第二段说玛戈特接到去劳动营报到的命令，全家立即躲藏起来。",
          ),
        ),
        ask(
          t("What surprising side of Anne's life does the diary record?", "日记记录了安妮生活中哪个令人意外的方面？"),
          t("Ordinary growing up: arguments, first love and ambitions", "平常的成长：争吵、初恋和抱负"),
          [
            t("Her adventures traveling across Europe", "她周游欧洲的冒险"),
            t("Her work as a journalist during the war", "她在战时当记者的工作"),
            t("Her plans to escape to America", "她逃往美国的计划"),
          ],
          t(
            "The third paragraph says she argues with her mother, falls in love for the first time and wonders what kind of person she wants to become.",
            "第三段说她和母亲争吵，第一次恋爱，并思考自己想成为什么样的人。",
          ),
        ),
        ask(
          t("Why did Anne begin to rewrite her diary in 1944?", "安妮为什么在 1944 年开始改写日记？"),
          t(
            "A radio broadcast asked people to keep diaries as records, and she hoped to publish it",
            "一则广播请人们保存日记作为记录，她希望出版它",
          ),
          [
            t("Her father told her the first version was too short", "她父亲说第一版太短了"),
            t("The original notebook had been lost", "原来的笔记本丢了"),
            t("The helpers asked her to write about them", "帮助者们请她写写他们"),
          ],
          t(
            "The fourth paragraph says she heard a broadcast asking Dutch people to keep their diaries as records and began to rewrite hers, hoping to publish it.",
            "第四段说她听到广播请荷兰人保存日记作为战争记录，于是开始改写日记，希望出版。",
          ),
        ),
      ],
      [
        "June",
        "Jewish",
        "Anne",
        "Frank",
        "Kitty",
        "Amsterdam",
        "Netherlands",
        "Nazi",
        "Germany",
        "Margot",
        "Dutch",
        "August",
        "Otto",
        "Anne's",
      ],
    ),
    passage(
      "the-girl-who-spoke-up",
      t("The Girl Who Spoke Up", "敢于发声的女孩"),
      `In 2009, an eleven-year-old girl in the Swat Valley of Pakistan began writing an online diary for the BBC under a false name. Her real name was Malala Yousafzai. The Taliban, an armed group that had taken control of much of the valley, had ordered girls' schools to close. Malala wrote about her fear, her love of learning and her wish to go on studying.

Her father, Ziauddin, ran a school and was an outspoken campaigner for education. Malala grew up listening to him argue that every child, boy or girl, had a right to learn. Over time, she began speaking publicly herself, giving interviews to newspapers and television. As her voice grew louder, so did the danger.

On October 9, 2012, a gunman stopped her school bus, asked which girl was Malala and shot her in the head. Two other girls were also wounded. Malala was flown to a hospital in Britain, where doctors saved her life. Many people expected that the attack would silence her.

It did the opposite. Less than a year later, on her sixteenth birthday, Malala spoke at the United Nations in New York. “They thought that the bullets would silence us,” she said, “but they failed.” She argued that one child, one teacher, one book and one pen could change the world.

In 2014, at the age of seventeen, Malala became the youngest person ever to receive the Nobel Peace Prize. She went on to study at the University of Oxford and to lead a fund that supports girls' education in many countries.

Malala has often said that she does not want to be remembered as the girl who was shot, but as the girl who stood up. Her story shows a coming of age that happened in public, under extreme pressure. Yet the qualities it required, the courage to say what one believes and the patience to keep saying it, are the same ones every young person needs to find a voice.`,
      [growingWords, courageWords, familyWords, academic3],
      [
        ask(
          t("What had the Taliban ordered in the Swat Valley?", "塔利班在斯瓦特河谷下达了什么命令？"),
          t("That girls' schools be closed", "关闭女子学校"),
          [
            t("That all newspapers stop printing", "所有报纸停止印刷"),
            t("That families leave the valley", "各家各户离开河谷"),
            t("That boys study abroad", "男孩出国学习"),
          ],
          t("The first paragraph says the Taliban had ordered girls' schools to close.", "第一段说塔利班已下令关闭女子学校。"),
        ),
        ask(
          t("How did Malala's father influence her?", "马拉拉的父亲如何影响了她？"),
          t(
            "He argued that every child had a right to learn, and she began to speak out too",
            "他主张每个孩子都有受教育的权利，她也开始公开发声",
          ),
          [
            t("He forbade her to give interviews", "他禁止她接受采访"),
            t("He wrote her online diary for her", "他替她写网络日记"),
            t("He moved the family to Britain before the attack", "他在袭击前把全家搬到了英国"),
          ],
          t(
            "The second paragraph says she grew up hearing him argue that every child had a right to learn, and over time she began speaking publicly herself.",
            "第二段说她从小听父亲主张每个孩子都有受教育的权利，后来她自己也开始公开发声。",
          ),
        ),
        ask(
          t("How does Malala want to be remembered?", "马拉拉希望人们怎样记住她？"),
          t("As the girl who stood up", "作为挺身而出的女孩"),
          [
            t("As the girl who was shot", "作为中枪的女孩"),
            t("As the youngest student at Oxford", "作为牛津最年轻的学生"),
            t("As her father's daughter", "作为她父亲的女儿"),
          ],
          t(
            "The last paragraph says she wants to be remembered not as the girl who was shot, but as the girl who stood up.",
            "最后一段说她希望人们记住的不是中枪的女孩，而是挺身而出的女孩。",
          ),
        ),
      ],
      [
        "Swat",
        "Valley",
        "Pakistan",
        "BBC",
        "Malala",
        "Yousafzai",
        "Taliban",
        "Ziauddin",
        "October",
        "Britain",
        "United",
        "Nations",
        "New",
        "York",
        "Nobel",
        "Peace",
        "Prize",
        "University",
        "Oxford",
        "Malala's",
      ],
    ),
    passage(
      "four-sisters",
      t("Four Sisters", "四姐妹"),
      `In 1868, an American publisher asked Louisa May Alcott to write a book for girls. Alcott was not enthusiastic. She had written thrillers and stories for adults, and she said she did not know many girls except her own sisters. So she wrote about them. The result, Little Women, became one of the most loved novels of growing up ever written.

The book follows the four March sisters during and after the American Civil War, while their father is away serving in the army. Meg, the eldest, is gentle and longs for pretty things. Jo, the second, is a fierce, clumsy tomboy who wants to be a writer. Beth is shy and kind, and Amy, the youngest, is artistic and a little vain. The family is poor, and their mother, whom they call Marmee, teaches them to value kindness and hard work over money.

Each sister has a fault to overcome. Jo struggles most with her temper. In one famous scene, Amy, angry at being left out, burns the manuscript of a book Jo has been writing. Jo refuses to forgive her. The next day, Amy follows her sister to a frozen river, falls through thin ice and nearly drowns. Jo is horrified to realize how close her anger came to hurting someone she loves.

Jo is the heart of the book, and many readers have seen Alcott herself in her. Like Jo, Alcott sold stories to help support her family. Readers were disappointed when Jo did not marry her charming neighbor, Laurie, and Alcott, under pressure from her publisher, gave Jo a different husband in the end. She privately complained about the demand to marry off her heroine.

Little Women is about how four very different young women grow up within one family. Its lasting appeal lies partly in that difference. Readers argue about which sister they resemble most, and in recognizing themselves, they recognize how many ways there are to become an adult.`,
      [growingWords, familyWords, theme],
      [
        ask(
          t("Why did Alcott write about her own sisters?", "奥尔科特为什么写她自己的姐妹？"),
          t("She said she did not know many girls except her sisters", "她说除了自己的姐妹，她不认识多少女孩"),
          [
            t("Her sisters asked her to write about them", "她的姐妹们请她写她们"),
            t("Her publisher gave her their diaries", "她的出版商给了她她们的日记"),
            t("She wanted to make them famous", "她想让她们出名"),
          ],
          t(
            "The first paragraph says she did not know many girls except her own sisters, so she wrote about them.",
            "第一段说她除了自己的姐妹不认识多少女孩，于是就写了她们。",
          ),
        ),
        ask(
          t("What does Jo realize after Amy falls through the ice?", "艾美掉进冰窟后，乔意识到了什么？"),
          t("How close her anger came to hurting someone she loves", "她的怒气差点伤害了她所爱的人"),
          [
            t("That Amy had not burned the manuscript", "艾美并没有烧掉手稿"),
            t("That she should stop writing", "她应该停止写作"),
            t("That Marmee had caused the accident", "是玛米造成了这次事故"),
          ],
          t(
            "The third paragraph says Jo is horrified to realize how close her anger came to hurting someone she loves.",
            "第三段说乔惊恐地意识到她的怒气差点伤害了她所爱的人。",
          ),
        ),
        ask(
          t("Why did Alcott give Jo a husband in the end?", "奥尔科特最后为什么给乔安排了丈夫？"),
          t("She was under pressure from her publisher", "她受到出版商的压力"),
          [
            t("Jo was based on a married friend", "乔是以一位已婚朋友为原型的"),
            t("Her sisters insisted on it", "她的姐妹们坚持要这样"),
            t("She believed every heroine should marry", "她认为每个女主人公都应该结婚"),
          ],
          t(
            "The fourth paragraph says Alcott, under pressure from her publisher, gave Jo a different husband and privately complained about it.",
            "第四段说奥尔科特在出版商的压力下给乔安排了另一位丈夫，并私下抱怨过此事。",
          ),
        ),
      ],
      ["American", "Louisa", "May", "Alcott", "Little", "Women", "March", "Civil", "War", "Meg", "Jo", "Beth", "Amy", "Marmee", "Laurie"],
      ["tomboy"],
    ),
    passage(
      "the-invention-of-the-teenager",
      t("The Invention of the Teenager", "“青少年”的发明"),
      `People between the ages of thirteen and nineteen have always existed, of course. But for most of history, they were not thought of as a separate group. In many societies, children began working on farms or in workshops at an early age and were treated as young adults as soon as they could do an adult's job. The word teenager did not become common in English until the 1940s.

Several changes made the teenager possible. The first was school. In the early twentieth century, laws in many countries began to keep young people in school longer and to limit child labor. Instead of spending their days among adults at work, young people now spent them among others their own age. They developed their own slang, fashions and friendships.

The second change was money. After the Second World War, the economy of the United States boomed. Many teenagers had part-time jobs or allowances, and for the first time, they had money of their own to spend. Businesses noticed. Magazines, clothing companies and record labels began to sell directly to young people, and advertisers spoke of the teenage market.

The third change was music. In the 1950s, rock and roll became the sound of a generation. Many adults disliked it, which made it even more attractive to the young. Music, films and clothes allowed teenagers to express an identity different from their parents'.

Not everyone welcomed the new group. Newspapers in the 1950s were full of worried articles about juvenile delinquents, young people who broke the law. Each generation since has had its own panic about the young, from comic books to video games to smartphones.

Historians point out that the idea of the teenager is now spread around the world, though it takes different forms in different cultures. It reminds us that even something that seems natural, like the stage between childhood and adulthood, has a history of its own.`,
      [growingWords, familyWords],
      [
        ask(
          t("How did longer schooling help create the teenager?", "更长的学校教育如何促成了“青少年”的出现？"),
          t(
            "Young people spent their days with others their own age and developed their own culture",
            "年轻人整天和同龄人在一起，形成了自己的文化",
          ),
          [
            t("Schools taught a class called teenage studies", "学校开设了一门叫青少年研究的课"),
            t("Schools paid students to attend", "学校付钱让学生上学"),
            t("Young people worked longer hours at school", "年轻人在学校工作更长时间"),
          ],
          t(
            "The second paragraph says that instead of spending their days among adults at work, young people spent them among others their own age and developed their own slang, fashions and friendships.",
            "第二段说年轻人不再整天和成年人一起工作，而是与同龄人相处，形成了自己的俚语、时尚和友谊。",
          ),
        ),
        ask(
          t("Why did businesses begin to sell directly to young people?", "为什么商家开始直接向年轻人推销？"),
          t("For the first time, teenagers had money of their own to spend", "青少年第一次有了可以自己支配的钱"),
          [
            t("Laws required them to do so", "法律要求他们这样做"),
            t("Parents refused to buy anything", "父母拒绝买任何东西"),
            t("Young people owned most of the businesses", "大多数企业由年轻人拥有"),
          ],
          t(
            "The third paragraph says many teenagers had part-time jobs or allowances and money of their own, and businesses noticed.",
            "第三段说许多青少年有兼职或零花钱，有了自己的钱，商家注意到了这一点。",
          ),
        ),
        ask(
          t("What point do historians make in the last paragraph?", "历史学家在最后一段提出了什么观点？"),
          t("Even something that seems natural has a history of its own", "即便看似自然的事物也有自己的历史"),
          [
            t("Teenagers did not exist before the 1940s", "20 世纪 40 年代以前不存在十几岁的人"),
            t("Every culture has the same kind of teenager", "每种文化中的青少年都一样"),
            t("Rock and roll will never be popular again", "摇滚乐再也不会流行了"),
          ],
          t(
            "The last paragraph says the idea reminds us that even something that seems natural, like the stage between childhood and adulthood, has a history of its own.",
            "最后一段说这个概念提醒我们，即使像童年与成年之间的阶段这样看似自然的事物，也有它自己的历史。",
          ),
        ),
      ],
      ["English", "Second", "World", "War", "United", "States"],
    ),
    passage(
      "the-night-of-the-key",
      t("The Night of the Key", "钥匙之夜"),
      `On the night I turned fifteen, my grandmother gave me the key to the shop.

It was not a beautiful key. It was brass, scratched and bent slightly at the tip, hanging from a loop of red string. But I knew what it meant. For forty years, only two people had carried that key: my grandfather, who had died before I was born, and my grandmother, who opened the tailor's shop on Bridge Street every morning at seven.

“From Monday,” she said, “you open.”

I had spent every summer of my childhood in that shop, sorting buttons, sweeping threads, sitting under the cutting table while she worked. I knew where every spool lived. But I had always been the helper. Opening the shop meant being the first one there, deciding whether to turn the sign, answering the customers who came early with torn coats and impatient faces.

On Monday morning, I stood at the door at five to seven. The street was still gray. I put the key in the lock and it would not turn. I pushed and pulled and rattled it until my hands were sweating. A man waiting with a suit over his arm sighed loudly.

Then I remembered something I had seen a thousand times without noticing: my grandmother always lifted the door slightly, with her knee, before she turned the key. I lifted. The lock clicked.

When she arrived at nine, the lights were on, the sign was turned and the man's suit was hanging on the rail with a ticket pinned to its sleeve. She looked around, nodded once and went to her chair. She did not praise me. I understood, later, that this was the praise.

I am older now, and the shop has been closed for years. But I still have the key on its red string. I keep it not to open anything, but to remember the morning I learned that growing up is mostly made of small things you have watched for years, until one day you have to do them yourself.`,
      [growingWords, familyWords, time, theme],
      [
        ask(
          t("Why does the key matter so much to the narrator?", "这把钥匙为什么对叙述者如此重要？"),
          t("Only her grandparents had carried it, so it means she is trusted", "只有她的祖父母带过它，所以它意味着她被信任"),
          [
            t("It is made of gold and very valuable", "它是金子做的，非常值钱"),
            t("It opens a secret room in the shop", "它能打开店里的一个密室"),
            t("She found it after searching for years", "她找了好多年才找到它"),
          ],
          t(
            "The second paragraph says only her grandfather and grandmother had carried the key for forty years, and she knew what it meant.",
            "第二段说四十年来只有她的祖父和祖母带过这把钥匙，她明白它意味着什么。",
          ),
        ),
        ask(
          t("How does the narrator finally open the door?", "叙述者最后是怎么打开门的？"),
          t("She remembers to lift the door with her knee before turning the key", "她想起转钥匙前要用膝盖把门稍稍抬起"),
          [
            t("The waiting man opens it for her", "等候的那个人替她打开了"),
            t("Her grandmother arrives early and helps", "她祖母提早来帮忙"),
            t("She breaks the lock with a tool", "她用工具撬开了锁"),
          ],
          t(
            "The sixth paragraph says she remembered that her grandmother always lifted the door slightly with her knee before turning the key.",
            "第六段说她想起祖母总是先用膝盖把门稍稍抬起再转钥匙。",
          ),
        ),
        ask(
          t("What does the narrator understand about her grandmother's silence?", "叙述者如何理解祖母的沉默？"),
          t("The silence was the praise", "沉默就是赞扬"),
          [
            t("Her grandmother was angry with her", "祖母在生她的气"),
            t("Her grandmother had not noticed the work", "祖母没注意到她做的事"),
            t("Her grandmother wanted to close the shop", "祖母想关掉这家店"),
          ],
          t(
            "The seventh paragraph says her grandmother did not praise her, and she understood later that this was the praise.",
            "第七段说祖母没有表扬她，她后来明白这本身就是表扬。",
          ),
        ),
      ],
      ["Bridge", "Street", "Monday"],
    ),
  ],
};
