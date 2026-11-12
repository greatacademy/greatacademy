// Grade 8: the reading unit of the eighth theme, the Globe and its plays, from the building of Shakespeare's theater
// and an afternoon among the groundlings to the language, the feuds and the villains of the plays and how they are staged today.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grade-5/reading-kit.ts";

const stageWords = { topic: "words-of-the-elizabethan-stage", weight: 0.3 } as const;
const courtWords = { topic: "words-of-courts-and-feuds", weight: 0.3 } as const;
const ghostWords = { topic: "words-of-ghosts-and-haunting", weight: 0.3 } as const;
const madnessWords = { topic: "words-of-madness-and-despair", weight: 0.3 } as const;
const earlyModern = { topic: "early-modern-english-words", weight: 0.1 } as const;
const shakespeareScene = { topic: "reading-a-scene-of-shakespeare", weight: 0.2 } as const;
const production = { topic: "comparing-a-play-and-its-production", weight: 0.2 } as const;
const academic1 = { topic: "academic-words-1", weight: 0.1 } as const;
const academic2 = { topic: "academic-words-2", weight: 0.1 } as const;

/** theGlobeAndItsPlays is a reading unit of grade 8 on Shakespeare's theater, his language and his plays on stage and screen. */
export const theGlobeAndItsPlays: ReadingUnitDef = {
  id: "the-globe-and-its-plays",
  title: t("The Globe and Its Plays", "环球剧场及其戏剧"),
  passages: [
    passage(
      "the-theater-that-crossed-the-river",
      t("The Theater That Crossed the River", "渡河而来的剧场"),
      `On a cold night in December 1598, a group of men gathered outside a building called the Theatre, on the northern edge of London. They carried swords, axes and saws. Over the next few days, they took the building apart, beam by beam, and carried the timbers across the frozen city to the south bank of the River Thames. There, they used them to build a new playhouse. They called it the Globe.

The men were members of an acting company called the Lord Chamberlain's Men, and one of them was a young dramatist named William Shakespeare. The company had performed at the Theatre for years, but the lease on the land had run out, and the landlord planned to keep the building for himself. By taking it apart before he could stop them, the actors kept their timber and avoided paying for a new one. The landlord took them to court, but he lost.

The Globe opened in 1599. It was a round, wooden building, open to the sky in the middle, with three levels of covered galleries around a central yard. The stage stuck out into the yard, so the audience surrounded the actors on three sides. Up to three thousand people could fit inside.

For the next fourteen years, the Globe was the home of Shakespeare's greatest plays, including Hamlet, Othello, King Lear and Macbeth. Then, in 1613, during a performance of Henry VIII, a cannon fired as a sound effect set fire to the thatched roof. Within an hour, the building had burned to the ground. No one was killed, although one man's trousers caught fire and had to be put out with a bottle of ale.

The Globe was rebuilt the next year, and a modern copy now stands near the original site.`,
      [stageWords, courtWords, academic2],
      [
        ask(
          t("Why did the actors take apart the Theatre?", "演员们为什么拆掉了大剧场？"),
          t(
            "The lease had run out, and they wanted to keep the timber before the landlord could",
            "租约到期了，他们想在地主动手之前保住木材",
          ),
          [
            t("The building had burned down", "那座建筑被烧毁了"),
            t("The queen had ordered them to leave London", "女王命令他们离开伦敦"),
            t("They wanted a theater with a thatched roof", "他们想要一座茅草顶的剧场"),
          ],
          t(
            "The second paragraph says the lease had run out and the landlord planned to keep the building, so the actors took it apart first and kept the timber.",
            "第二段说租约到期，地主打算把建筑据为己有，所以演员们抢先拆掉它，保住了木材。",
          ),
        ),
        ask(
          t("How was the stage of the Globe arranged?", "环球剧场的舞台是如何布置的？"),
          t("It stuck out into the yard, with the audience on three sides", "它伸进院子里，观众围在三面"),
          [
            t("It was hidden behind a curtain at one end", "它藏在一端的幕布后面"),
            t("It was on the roof of the building", "它在建筑物的屋顶上"),
            t("It was below the ground in a pit", "它在地下的一个坑里"),
          ],
          t(
            "The third paragraph says the stage stuck out into the yard, so the audience surrounded the actors on three sides.",
            "第三段说舞台伸进院子，观众从三面围住演员。",
          ),
        ),
        ask(
          t("What caused the fire of 1613?", "1613年的火灾是由什么引起的？"),
          t("A cannon fired as a sound effect during a play", "演出中作为音效发射的一门炮"),
          [
            t("The landlord set fire to the building", "地主放火烧了这座建筑"),
            t("Lightning struck the roof during a storm", "暴风雨中闪电击中了屋顶"),
            t("An actor dropped a candle on the stage", "一名演员把蜡烛掉在了舞台上"),
          ],
          t(
            "The fourth paragraph says a cannon fired as a sound effect during Henry VIII set fire to the thatched roof.",
            "第四段说在演出《亨利八世》时作为音效发射的炮点燃了茅草屋顶。",
          ),
        ),
      ],
      [
        "December",
        "Theatre",
        "London",
        "River",
        "Thames",
        "Globe",
        "Lord",
        "Chamberlain's",
        "Men",
        "William",
        "Shakespeare",
        "Shakespeare's",
        "Hamlet",
        "Othello",
        "King",
        "Lear",
        "Macbeth",
        "Henry",
        "VIII",
      ],
    ),
    passage(
      "an-afternoon-at-the-globe",
      t("An Afternoon at the Globe", "环球剧场的一个下午"),
      `Imagine that it is a summer afternoon in 1600. A flag is flying from the top of the Globe to show that there will be a play today, and a trumpet sounds to tell the crowds that it will begin soon. You have walked across London Bridge or paid a boatman to row you across the river, and now you join the crowd at the door.

If you have only a penny, you will stand in the open yard in front of the stage, packed in with hundreds of others. These standing spectators are called groundlings. If it rains, you will get wet. If you have two pennies, you can sit on a bench in one of the covered galleries, and for three you can have a cushion. The wealthiest theatergoers might even sit in the "lords' rooms," right beside the stage, where everyone can see their fine clothes.

There are no electric lights, so plays are performed in the afternoon, by daylight. There is little scenery: no painted backdrop, just a few pieces of furniture such as a throne or a bed. Instead, the words do the work. When a character says that it is night, or that they are standing on a battlement in a storm, the audience imagines it. The costumes, on the other hand, are rich and expensive.

The audience is noisy. People eat nuts and oranges, call out to the actors and cheer or boo. Sellers move through the crowd with food and drink. If the play is dull, the groundlings let the actors know.

All the parts are played by men and boys. Women were not allowed to act on the English stage until 1660, so the roles of young women, like Juliet, were played by boys whose voices had not yet broken.`,
      [stageWords, courtWords],
      [
        ask(
          t("Who were the groundlings?", "“站票观众”是谁？"),
          t("Spectators who paid a penny to stand in the open yard", "花一便士站在露天院子里看戏的观众"),
          [
            t("The wealthiest people in the lords' rooms", "坐在贵宾席上的最富有的人"),
            t("The actors who played the parts of women", "扮演女性角色的演员"),
            t("The boatmen who rowed people across the river", "划船送人过河的船夫"),
          ],
          t(
            "The second paragraph says those who paid a penny stood in the open yard in front of the stage and were called groundlings.",
            "第二段说花一便士的人站在舞台前的露天院子里，被称为“站票观众”。",
          ),
        ),
        ask(
          t("How did the audience know a scene took place at night?", "观众怎么知道一场戏发生在夜里？"),
          t("The characters said so, and the audience imagined it", "角色在台词中说出来，观众自己想象"),
          [
            t("The theater lights were turned off", "剧场的灯被关掉了"),
            t("A painted backdrop showed the moon", "一块彩绘背景上画着月亮"),
            t("Plays at night were performed in the evening", "夜景戏在晚上演出"),
          ],
          t(
            "The third paragraph says there was little scenery and plays were performed by daylight, so when a character said it was night, the audience imagined it.",
            "第三段说那时几乎没有布景，戏在白天演出，所以当角色说现在是夜里时，观众就自己想象。",
          ),
        ),
        ask(
          t("Why was Juliet played by a boy?", "为什么朱丽叶由男孩扮演？"),
          t("Women were not allowed to act on the English stage until 1660", "直到1660年，女性才被允许在英国舞台上演戏"),
          [
            t("Boys were better actors than women", "男孩比女人演得好"),
            t("Shakespeare wrote the part for a boy", "莎士比亚是为男孩写的这个角色"),
            t("No women came to the theater", "没有女人来剧场"),
          ],
          t(
            "The last paragraph says all parts were played by men and boys because women were not allowed to act on the English stage until 1660.",
            "最后一段说所有角色都由男人和男孩扮演，因为直到1660年女性才被允许在英国舞台上表演。",
          ),
        ),
      ],
      ["Globe", "London", "Bridge", "English", "Juliet"],
    ),
    passage(
      "the-man-from-stratford",
      t("The Man from Stratford", "来自斯特拉特福的人"),
      `William Shakespeare was born in 1564 in Stratford-upon-Avon, a market town in the middle of England. His father was a glove maker who became an important man in the town, and William probably went to the local grammar school, where boys studied Latin, read the Roman poets and practiced speaking in public. At eighteen, he married Anne Hathaway, and they had three children.

Then, for several years, he disappears from the records. Historians call this period the "lost years." When he reappears, in 1592, he is in London, and he is already well known enough as an actor and playwright for a jealous rival to call him an "upstart crow." Over the next twenty years, he wrote or helped to write about thirty-seven plays and more than one hundred and fifty poems.

Shakespeare wrote every kind of play. His comedies, such as A Midsummer Night's Dream, are full of mistaken identities, clever servants and happy marriages. His histories, such as Henry V, bring the kings of England's past to the stage. His tragedies, such as Hamlet and King Lear, show great men and women destroyed by their own choices and by forces they cannot control. He borrowed many of his plots from older books, but he turned them into something new.

Shakespeare also shaped the English language. He used more than twenty thousand different words in his plays, and he is the first known writer to use hundreds of words and phrases that we still use, such as "lonely," "bedroom," "break the ice" and "wild-goose chase."

He retired to Stratford and died there in 1616. Seven years later, two of his fellow actors collected his plays in a single book, now called the First Folio. Without it, half of his plays might have been lost.`,
      [stageWords, earlyModern],
      [
        ask(
          t('What are the "lost years" of Shakespeare\'s life?', "莎士比亚生平中的“失踪的岁月”是指什么？"),
          t("A period of several years for which there are no records of him", "有好几年关于他没有任何记录的时期"),
          [
            t("The years when his plays were lost in a fire", "他的剧本在火灾中丢失的那些年"),
            t("The years he spent at grammar school", "他在文法学校度过的那些年"),
            t("The years after he retired to Stratford", "他退休回到斯特拉特福之后的那些年"),
          ],
          t(
            "The second paragraph says that for several years he disappears from the records, and historians call this period the lost years.",
            "第二段说他有好几年从记录中消失了，历史学家称这段时期为“失踪的岁月”。",
          ),
        ),
        ask(
          t("What do Shakespeare's tragedies show, according to the passage?", "根据文章，莎士比亚的悲剧表现了什么？"),
          t(
            "Great people destroyed by their own choices and by forces beyond their control",
            "伟大的人物被自己的选择和无法控制的力量所毁灭",
          ),
          [
            t("Mistaken identities and happy marriages", "身份误会和美满的婚姻"),
            t("The kings of England's past", "英格兰过去的国王们"),
            t("Clever servants who fool their masters", "愚弄主人的聪明仆人"),
          ],
          t(
            "The third paragraph says his tragedies show great men and women destroyed by their own choices and by forces they cannot control; the other choices describe the comedies and histories.",
            "第三段说他的悲剧表现伟大的男男女女被自己的选择和无法控制的力量所毁灭；其他选项描述的是喜剧和历史剧。",
          ),
        ),
        ask(
          t("Why is the First Folio important?", "为什么《第一对开本》很重要？"),
          t("Without it, half of Shakespeare's plays might have been lost", "没有它，莎士比亚一半的剧本可能已经失传"),
          [
            t("It was the first play Shakespeare wrote", "它是莎士比亚写的第一部剧"),
            t("It records his lost years", "它记录了他失踪的岁月"),
            t("It was written by Shakespeare himself", "它是莎士比亚亲手写的"),
          ],
          t(
            "The last paragraph says two fellow actors collected his plays in the First Folio, and without it, half of them might have been lost.",
            "最后一段说两位同事把他的剧本收集成《第一对开本》，没有它，其中一半可能已经失传。",
          ),
        ),
      ],
      [
        "William",
        "Shakespeare",
        "Stratford-upon-Avon",
        "England",
        "Latin",
        "Roman",
        "Anne",
        "Hathaway",
        "London",
        "Midsummer",
        "Night's",
        "Dream",
        "Henry",
        "Hamlet",
        "King",
        "Lear",
        "England's",
        "English",
        "Stratford",
        "First",
        "Folio",
        "Shakespeare's",
      ],
    ),
    passage(
      "two-houses-both-alike",
      t("Two Houses, Both Alike", "两个家族，同样显赫"),
      `Romeo and Juliet begins with a fight in the street. Servants of two great families of the Italian city of Verona, the Montagues and the Capulets, insult each other, and soon swords are drawn. The fight grows until the Prince of Verona arrives and stops it. He warns that if the families disturb the peace again, those responsible will pay with their lives. No one remembers how the feud began. It simply goes on.

That same night, Romeo, the son of Lord Montague, slips into a party at the Capulets' house and falls in love at first sight with Juliet, the Capulets' only daughter. Only afterward does each learn who the other is. "My only love sprung from my only hate," Juliet says. The next day, they are secretly married by Friar Laurence, who hopes that their marriage might end the feud.

But within an hour of the wedding, everything goes wrong. Juliet's hot-tempered cousin Tybalt challenges Romeo to a duel. Romeo refuses, because Tybalt is now his relative, but his friend Mercutio fights instead and is killed. In a rage, Romeo kills Tybalt. The Prince banishes Romeo from Verona.

The friar devises a desperate plan. He gives Juliet a potion that will make her seem dead for two days, so that she can escape and join Romeo. But the message explaining the plan never reaches Romeo. Believing Juliet is dead, he buys poison from a poor apothecary, goes to her tomb and drinks it beside her. Juliet wakes, finds him dead and stabs herself with his dagger.

Only then, standing over the bodies of their children, do the two families agree to end their feud.`,
      [courtWords, shakespeareScene],
      [
        ask(
          t("Why do Romeo and Juliet marry in secret?", "罗密欧和朱丽叶为什么秘密结婚？"),
          t("Their families are locked in a feud", "他们的家族陷入了世仇"),
          [
            t("The Prince has forbidden all marriages", "亲王禁止了所有婚姻"),
            t("Romeo has been banished from Verona", "罗密欧已被逐出维罗纳"),
            t("Juliet is already married to Tybalt", "朱丽叶已经嫁给了提伯尔特"),
          ],
          t(
            "Romeo is a Montague and Juliet a Capulet, two families in a long feud, so they are married secretly by the friar; the banishment comes only after the wedding.",
            "罗密欧是蒙太古家族的人，朱丽叶是凯普莱特家族的人，两家是世仇，所以他们由神父秘密主婚；放逐是在婚礼之后才发生的。",
          ),
        ),
        ask(
          t('What does Juliet mean by "My only love sprung from my only hate"?', "朱丽叶说“我唯一的爱来自我唯一的恨”是什么意思？"),
          t("The only person she loves belongs to the family she has been taught to hate", "她唯一爱的人属于她从小被教导去恨的家族"),
          [
            t("She hates Romeo as much as she loves him", "她恨罗密欧就像爱他一样多"),
            t("She has never loved anyone before", "她以前从未爱过任何人"),
            t("Her love for Romeo has turned to hate", "她对罗密欧的爱变成了恨"),
          ],
          t(
            "Juliet has just learned that Romeo is a Montague, the family of her family's enemy, so her love has come from the only thing she was taught to hate.",
            "朱丽叶刚得知罗密欧是蒙太古家族的人，即她家族的仇敌，所以她的爱来自她被教导去恨的唯一对象。",
          ),
        ),
        ask(
          t("Which event leads directly to Romeo's banishment?", "哪件事直接导致了罗密欧被放逐？"),
          t("He kills Tybalt after Tybalt kills Mercutio", "在提伯尔特杀死茂丘西奥后，他杀死了提伯尔特"),
          [
            t("He goes to the Capulets' party", "他去了凯普莱特家的舞会"),
            t("He marries Juliet in secret", "他与朱丽叶秘密结婚"),
            t("He buys poison from an apothecary", "他从药剂师那里买了毒药"),
          ],
          t(
            "The third paragraph says Romeo kills Tybalt in a rage after Mercutio is killed, and then the Prince banishes him from Verona.",
            "第三段说茂丘西奥被杀后，罗密欧一怒之下杀了提伯尔特，随后亲王把他逐出维罗纳。",
          ),
        ),
      ],
      [
        "Romeo",
        "Juliet",
        "Italian",
        "Verona",
        "Montagues",
        "Capulets",
        "Prince",
        "Lord",
        "Montague",
        "Capulets'",
        "Friar",
        "Laurence",
        "Juliet's",
        "Tybalt",
        "Mercutio",
        "Romeo's",
      ],
    ),
    passage(
      "speaking-shakespeare",
      t("Speaking Shakespeare", "读懂莎士比亚的语言"),
      `Many students opening a play by Shakespeare for the first time feel that they are reading a foreign language. In fact, it is English, the same language we speak today, but in the form used about four hundred years ago. Historians call it Early Modern English. Once you know a few of its habits, it becomes much easier to understand.

The first habit is the use of "thou" and "thee." In Shakespeare's time, these were the words for "you" when speaking to one person who was a close friend, a family member, a child or a servant. "You" was more formal and polite. So when a character suddenly switches from "you" to "thou," it can show affection, or it can be an insult. Verbs changed to match: "thou art" meant "you are," and "thou hast" meant "you have."

The second habit is that some words have changed their meanings. When Juliet asks, "Wherefore art thou Romeo?" she does not mean "Where are you?" "Wherefore" meant "why." She is asking why he has to be Romeo, a member of the family her family hates. Other words have changed in the same way: "anon" meant "soon," "ere" meant "before," and "hie" meant "hurry."

The third habit is word order. To fit the rhythm of a line of verse, Shakespeare often moved words around. A character might say "Him have I seen" instead of "I have seen him." When a sentence seems confusing, try putting the subject and verb back in their usual order.

Above all, remember that these plays were written to be heard, not read silently. Speak the lines aloud. The meaning often becomes clear when you hear the rhythm and feel the emotion in the words.`,
      [earlyModern, shakespeareScene, stageWords],
      [
        ask(
          t('What does Juliet mean when she asks "Wherefore art thou Romeo?"', "朱丽叶问“Wherefore art thou Romeo?”是什么意思？"),
          t("Why are you Romeo, a member of my family's enemy?", "你为什么偏偏是罗密欧，我家仇人家族的人？"),
          [
            t("Where are you hiding, Romeo?", "罗密欧，你躲在哪里？"),
            t("What time is it, Romeo?", "罗密欧，现在几点了？"),
            t("How are you feeling, Romeo?", "罗密欧，你感觉怎么样？"),
          ],
          t(
            "The third paragraph explains that wherefore meant why, so she is asking why he has to be Romeo, a member of the family hers hates.",
            "第三段解释说 wherefore 的意思是“为什么”，所以她是在问他为什么偏偏是罗密欧，她家族所憎恨的家族的一员。",
          ),
        ),
        ask(
          t('What could a sudden switch from "you" to "thou" show?', "突然从 you 换成 thou 可能表示什么？"),
          t(
            "Affection or an insult, because thou was used for close friends, family or servants",
            "亲密或侮辱，因为 thou 用于亲密的朋友、家人或仆人",
          ),
          [
            t("That the character has forgotten the other person's name", "这个角色忘记了对方的名字"),
            t("That the scene is taking place at night", "这场戏发生在夜里"),
            t("That the character is speaking to a large crowd", "这个角色在对一大群人讲话"),
          ],
          t(
            "The second paragraph says thou was used with close friends, family, children or servants, so switching to it can show affection or be an insult.",
            "第二段说 thou 用于亲密的朋友、家人、孩子或仆人，所以换用它可以表示亲密，也可以是一种侮辱。",
          ),
        ),
        ask(
          t('How would you put "Him have I seen" in modern word order?', "“Him have I seen”用现代语序应该怎么说？"),
          t("I have seen him", "I have seen him（我见过他）"),
          [
            t("Have I seen him?", "Have I seen him?（我见过他吗？）"),
            t("He has seen me", "He has seen me（他见过我）"),
            t("Him I will see", "Him I will see（我将见他）"),
          ],
          t(
            "The fourth paragraph gives this example and advises putting the subject and verb back in their usual order: I have seen him.",
            "第四段给出了这个例子，建议把主语和动词放回通常的位置：I have seen him。",
          ),
        ),
      ],
      ["Shakespeare", "English", "Early", "Modern", "Shakespeare's", "Juliet", "Romeo"],
    ),
    passage(
      "the-usurper-of-scotland",
      t("The Usurper of Scotland", "苏格兰的篡位者"),
      `Macbeth, written around 1606, is Shakespeare's shortest tragedy and one of his darkest. It begins on a lonely heath in Scotland, in thunder and lightning, where three witches wait for a soldier returning from battle.

The soldier is Macbeth, a brave and loyal general of King Duncan. As he and his friend Banquo ride home from victory, the witches greet him with three titles. The third is the most startling: he "shalt be king hereafter." Soon afterward, part of the prophecy comes true when Duncan rewards Macbeth with a new title. Macbeth begins to wonder whether the rest might come true as well, and whether he should help it along.

When he writes to his wife about the prophecy, Lady Macbeth is determined that he will be king, and she fears that he is "too full of the milk of human kindness" to seize the crown. When Duncan comes to stay at their castle, she persuades her husband to murder him in his sleep. Macbeth does it, and he becomes king. But the crime does not bring him peace. To protect his throne, he orders the murder of Banquo, and later the killing of an innocent family.

As the play goes on, guilt destroys both of them. Macbeth sees the ghost of Banquo at a feast and cannot sleep. Lady Macbeth, who once seemed so strong, walks in her sleep, trying to wash invisible blood from her hands. "Out, damned spot!" she cries. At last, an army led by Duncan's son Malcolm marches against the usurper, and Macbeth is killed in battle.

The play asks whether Macbeth's fate was decided by the witches or by his own choices. The witches only told him what might happen. It was Macbeth who chose villainy to make it happen.`,
      [courtWords, ghostWords, madnessWords, shakespeareScene],
      [
        ask(
          t("What does Lady Macbeth fear about her husband?", "麦克白夫人担心她丈夫什么？"),
          t("That he is too kind to seize the crown", "他太过仁慈，不敢夺取王位"),
          [
            t("That the witches have lied to him", "女巫们欺骗了他"),
            t("That he will be killed in battle", "他会在战斗中阵亡"),
            t("That Duncan will discover the prophecy", "邓肯会发现那个预言"),
          ],
          t(
            'The third paragraph says she fears he is "too full of the milk of human kindness" to seize the crown, meaning too kind.',
            "第三段说她担心他“满怀人情的乳汁”而不敢夺取王位，意思是他太仁慈了。",
          ),
        ),
        ask(
          t("What does Lady Macbeth's sleepwalking show?", "麦克白夫人的梦游表明了什么？"),
          t("Guilt over the murders has broken her mind", "谋杀带来的罪恶感摧垮了她的精神"),
          [
            t("She has become stronger than her husband", "她变得比丈夫更坚强"),
            t("She is planning a new murder", "她在策划一场新的谋杀"),
            t("The witches have put a spell on her", "女巫给她施了魔法"),
          ],
          t(
            "The fourth paragraph says guilt destroys both of them; trying to wash invisible blood from her hands shows that she cannot escape what she has done.",
            "第四段说罪恶感摧毁了他们两人；她试图洗掉手上看不见的血，说明她无法摆脱自己的所作所为。",
          ),
        ),
        ask(
          t("According to the last paragraph, who is responsible for Macbeth's fate?", "根据最后一段，谁应该为麦克白的命运负责？"),
          t("Macbeth himself, who chose to make the prophecy come true", "麦克白自己，是他选择让预言成真"),
          [
            t("The witches, who forced him to kill", "女巫，是她们逼他杀人"),
            t("King Duncan, who gave him a new title", "邓肯国王，是他给了他新头衔"),
            t("Malcolm, who led the army against him", "马尔康，是他率军讨伐他"),
          ],
          t(
            "The last paragraph says the witches only told him what might happen, and it was Macbeth who chose villainy to make it happen.",
            "最后一段说女巫只是告诉他可能会发生什么，是麦克白自己选择用罪恶让它成真。",
          ),
        ),
      ],
      ["Macbeth", "Shakespeare's", "Scotland", "King", "Duncan", "Banquo", "Lady", "Duncan's", "Malcolm", "Macbeth's"],
    ),
    passage(
      "the-wisdom-of-fools",
      t("The Wisdom of Fools", "傻瓜的智慧"),
      `In the great houses and royal courts of Shakespeare's time, some lords kept a jester, or fool, whose job was to entertain them with jokes, songs and clever wordplay. A fool usually wore bright clothes, sometimes a coat of many colors or a cap with bells. Because a fool was not taken seriously, he was often allowed to say things that no one else dared to say, even to a king.

Shakespeare saw the dramatic possibilities of this. In his plays, the fools are often the wisest characters on stage. They see the truth that others miss, and they speak it through riddles and songs.

The most famous of them is the Fool in King Lear. At the start of the play, the old King Lear decides to divide his kingdom among his three daughters, giving the largest share to the one who says she loves him most. His two elder daughters flatter him with grand speeches. His youngest, Cordelia, who truly loves him, refuses to flatter and says only that she loves him as a daughter should. In his anger, Lear banishes her and gives everything to the other two, who soon turn against him.

Only the Fool tells Lear the truth. He jokes that Lear has made his daughters his mothers, and that the king is now a fool himself, with nothing left. The jokes are funny, but they are also painful, and Lear warns him to be careful.

In another play, Twelfth Night, the clown Feste observes that it takes wit to play the fool well. Another character agrees, saying that Feste is "wise enough to play the fool." For Shakespeare, foolishness and wisdom were often two sides of the same coin.`,
      [courtWords, stageWords, shakespeareScene],
      [
        ask(
          t("Why could a fool say things that no one else dared to say?", "为什么弄臣可以说别人不敢说的话？"),
          t("Because a fool was not taken seriously", "因为没有人把弄臣当真"),
          [
            t("Because a fool was the king's eldest son", "因为弄臣是国王的长子"),
            t("Because a fool always spoke in Latin", "因为弄臣总是说拉丁语"),
            t("Because a fool was paid more than the lords", "因为弄臣的报酬比领主还多"),
          ],
          t(
            "The first paragraph says that because a fool was not taken seriously, he was often allowed to say things no one else dared to say.",
            "第一段说因为没有人把弄臣当真，所以他常常被允许说别人不敢说的话。",
          ),
        ),
        ask(
          t("Why does Lear banish Cordelia?", "李尔王为什么放逐考狄利娅？"),
          t("She refuses to flatter him with a grand speech", "她拒绝用华丽的言辞奉承他"),
          [
            t("She has turned against him", "她背叛了他"),
            t("She wants the largest share of the kingdom", "她想要王国最大的一份"),
            t("The Fool has told him to", "弄臣叫他这么做"),
          ],
          t(
            "The third paragraph says Cordelia, who truly loves him, refuses to flatter and says only that she loves him as a daughter should, and in his anger he banishes her.",
            "第三段说真心爱他的考狄利娅拒绝奉承，只说她像女儿应当的那样爱他，李尔一怒之下放逐了她。",
          ),
        ),
        ask(
          t("What is the main idea of the passage?", "这篇文章的主旨是什么？"),
          t(
            "In Shakespeare's plays, fools are often the characters who see and speak the truth",
            "在莎士比亚的戏剧中，弄臣往往是看清并说出真相的人物",
          ),
          [
            t("Fools in Shakespeare's plays are always foolish", "莎士比亚戏剧中的弄臣总是很愚蠢"),
            t("King Lear is Shakespeare's funniest comedy", "《李尔王》是莎士比亚最有趣的喜剧"),
            t("Only royal courts had jesters", "只有王宫里才有弄臣"),
          ],
          t(
            "The second paragraph states it, and the examples of Lear's Fool and Feste support it: the fools see the truth others miss and speak it through jokes.",
            "第二段点明了这一点，李尔的弄臣和费斯特的例子支持了它：弄臣看到别人看不到的真相，并通过笑话说出来。",
          ),
        ),
      ],
      ["Shakespeare's", "Shakespeare", "Fool", "King", "Lear", "Cordelia", "Lear's", "Twelfth", "Night", "Feste", "Latin"],
    ),
    passage(
      "one-play-many-stages",
      t("One Play, Many Stages", "一部戏，多种演绎"),
      `The words of Romeo and Juliet have barely changed in four hundred years, but no two productions of the play are the same. Every director must make choices about setting, costumes, casting and which lines to cut, and those choices can change how the audience understands the story.

In 1968, the Italian director Franco Zeffirelli made a film of the play set in the Renaissance Italy that Shakespeare imagined, with sunlit stone streets, rich velvet costumes and duels fought with rapiers. His most famous choice was to cast actors who were close to the ages of the characters. Olivia Hussey, who played Juliet, was fifteen, and Leonard Whiting, who played Romeo, was seventeen. Audiences saw the lovers as truly young, which made their haste and their deaths feel even more tragic.

In 1996, the Australian director Baz Luhrmann took a very different approach. His film kept Shakespeare's language but moved the story to a modern city called Verona Beach, where the Montagues and Capulets were rival business families. The young men carried guns instead of swords, with the brand name "Sword" printed on them so that the lines still made sense. Loud music, fast cutting and bright colors made the feud feel like a modern gang war.

Some productions change even more. The musical West Side Story, first staged in 1957, kept the plot but replaced Shakespeare's words entirely. Its lovers, Tony and Maria, belong to rival gangs in New York City, one of white Americans and one of Puerto Rican immigrants, so the old feud becomes a story about prejudice.

Each production shows something different in the play. Comparing them helps us see which parts of the story are Shakespeare's and which are the choices of the people who bring it to the stage.`,
      [stageWords, courtWords, production, academic1],
      [
        ask(
          t("How did Zeffirelli's casting choice affect the audience?", "泽菲雷里的选角如何影响了观众？"),
          t(
            "Casting actors near the characters' ages made the lovers' haste and deaths feel more tragic",
            "选用与角色年龄相近的演员，使恋人的匆忙和死亡显得更加悲惨",
          ),
          [
            t("It made the film feel like a modern gang war", "它使电影感觉像一场现代帮派战争"),
            t("It replaced Shakespeare's words with new songs", "它用新歌取代了莎士比亚的台词"),
            t("It moved the story to New York City", "它把故事搬到了纽约"),
          ],
          t(
            "The second paragraph says audiences saw the lovers as truly young, which made their haste and their deaths feel even more tragic.",
            "第二段说观众看到的恋人确实很年轻，这使他们的匆忙和死亡显得更加悲惨。",
          ),
        ),
        ask(
          t('Why did Luhrmann\'s guns carry the brand name "Sword"?', "为什么鲁尔曼电影里的枪上印着“剑”这个品牌名？"),
          t("So that Shakespeare's lines about swords still made sense", "这样莎士比亚关于剑的台词仍然说得通"),
          [
            t("Because guns were not allowed in films", "因为电影里不允许出现枪"),
            t("Because the film was set in Renaissance Italy", "因为电影的背景是文艺复兴时期的意大利"),
            t("Because the actors could not use real swords", "因为演员不会用真剑"),
          ],
          t(
            'The third paragraph says the film kept Shakespeare\'s language, so printing "Sword" on the guns let the lines about swords still make sense.',
            "第三段说电影保留了莎士比亚的语言，所以在枪上印上“剑”使有关剑的台词仍然合理。",
          ),
        ),
        ask(
          t("How does West Side Story change the meaning of the feud?", "《西区故事》如何改变了世仇的含义？"),
          t("It turns the feud into a story about prejudice between groups", "它把世仇变成了一个关于群体间偏见的故事"),
          [
            t("It shows that the families were never really enemies", "它表明两个家族从来不是真正的敌人"),
            t("It makes the feud about money and business", "它把世仇变成了关于金钱和生意的争斗"),
            t("It removes the feud from the story", "它把世仇从故事中删除了"),
          ],
          t(
            "The fourth paragraph says the rival gangs are white Americans and Puerto Rican immigrants, so the old feud becomes a story about prejudice.",
            "第四段说对立的帮派是美国白人和波多黎各移民，所以古老的世仇变成了一个关于偏见的故事。",
          ),
        ),
      ],
      [
        "Romeo",
        "Juliet",
        "Italian",
        "Franco",
        "Zeffirelli",
        "Renaissance",
        "Italy",
        "Shakespeare",
        "Olivia",
        "Hussey",
        "Leonard",
        "Whiting",
        "Australian",
        "Baz",
        "Luhrmann",
        "Shakespeare's",
        "Verona",
        "Beach",
        "Montagues",
        "Capulets",
        "Sword",
        "West",
        "Side",
        "Story",
        "Tony",
        "Maria",
        "New",
        "York",
        "City",
        "Americans",
        "Puerto",
        "Rican",
        "Zeffirelli's",
        "Luhrmann's",
      ],
    ),
  ],
};
