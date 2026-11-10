// Grades 9 to 12: the reading unit of the eighth theme, essays of experience: original personal essays, each telling
// a moment and reflecting on what it meant.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grades-6-8/reading-kit.ts";

const clues = { topic: "context-clues", weight: 0.2 } as const;
const reflection = { topic: "words-for-reflection", weight: 0.3 } as const;
const essays = { topic: "reading-personal-essays", weight: 0.2 } as const;

/** essaysOfExperience is a reading unit of grades 9 to 12 of original personal essays and how they are made. */
export const essaysOfExperience: ReadingUnitDef = {
  id: "essays-of-experience",
  title: t("Essays of Experience", "经验之文"),
  passages: [
    passage(
      "the-lost-sweater",
      t("The Sweater I Lost", "我弄丢的那件毛衣"),
      `My grandmother knitted me a sweater the winter I turned ten. It was dark green, with a pattern of small white birds across the chest, and it was slightly too big, because she said I would grow into it. I hated it immediately. Nobody at school wore anything handmade. I wore it once, to please her, and then left it at the back of my closet.

Two years later, my grandmother had a stroke. She lived another year, but she could no longer use her hands. The needles she had carried everywhere in a cloth bag stayed in a drawer.

After she died, I went looking for the sweater. I searched my closet, the attic and the boxes in the garage. My mother thought we might have given it away with a bag of old clothes. I remember standing in the garage, surrounded by boxes, feeling a kind of panic that surprised me. It was only a sweater. I had never even liked it.

I never found it. For a long time, I felt guilty, as if losing it meant I had not loved her enough. Then, one evening, I asked my mother to teach me to knit. She had learned from my grandmother, too. My first attempts were terrible: uneven, full of holes, too tight in one place and too loose in another. But slowly my hands learned the rhythm.

It took me most of a winter to make a scarf. It is dark green. I tried to add a white bird, and it looks more like a potato with wings. I wear it anyway.

I think now that the sweater was never really the point. What my grandmother gave me was not an object but a patience, a way of making something slowly, one loop at a time. I had not lost that. I had only not yet picked it up.`,
      [clues, reflection, essays],
      [
        ask(
          t("Why did the writer feel panic when the sweater could not be found?", "找不到毛衣时，作者为什么感到恐慌？"),
          t("It had become a connection to her grandmother after the grandmother died", "祖母去世后，它成了与祖母的联系"),
          [
            t("She needed it for a school event", "她学校活动要用它"),
            t("Her mother was angry about it", "她妈妈为此生气"),
            t("It was very expensive", "它非常昂贵"),
          ],
          t(
            "She says it was only a sweater she never liked, yet after her grandmother died, losing it felt like losing something of her.",
            "她说那只是一件她从未喜欢过的毛衣，可祖母去世后，弄丢它就像失去了祖母的一部分。",
          ),
        ),
        ask(
          t(
            'Why does the writer mention that her bird "looks more like a potato with wings"?',
            "作者为什么提到她织的鸟“更像一个长了翅膀的土豆”？",
          ),
          t("To add humor and honesty about her imperfect skill", "为了以幽默和坦诚的方式表现她不够完美的手艺"),
          [
            t("To show she is an expert at knitting", "为了表明她是编织高手"),
            t("To explain why she lost the sweater", "为了解释她为什么弄丢了毛衣"),
            t("To criticize her grandmother's pattern", "为了批评祖母的图案"),
          ],
          t(
            "The joke shows the scarf is imperfect, yet she wears it anyway, which makes the essay's feeling honest rather than sentimental.",
            "这个玩笑表明围巾并不完美，但她照样戴着，这让文章的情感真诚而不煽情。",
          ),
        ),
        ask(
          t("What does the writer realize in the last paragraph?", "作者在最后一段领悟到了什么？"),
          t("Her grandmother's real gift was a patient way of making things", "祖母真正的礼物是一种耐心制作东西的方式"),
          [
            t("The sweater was in the attic all along", "毛衣其实一直在阁楼里"),
            t("She should never have learned to knit", "她本不该学编织"),
            t("Objects are more important than memories", "物品比回忆更重要"),
          ],
          t(
            "She says the gift was not an object but a patience, one loop at a time, which she had not lost.",
            "她说，那份礼物不是一件物品，而是一种一针一线的耐心，而她并没有失去它。",
          ),
        ),
      ],
    ),
    passage(
      "what-the-essay-does",
      t("What a Personal Essay Does", "个人随笔做什么"),
      `A personal essay is a piece of writing about the writer's own experience, but it is not simply a diary entry or a story. What makes it an essay is reflection: the writer looks back at what happened and tries to understand what it meant.

Most personal essays move between two kinds of writing. The first is narration: telling what happened, in scenes with specific details, dialogue and actions. The second is reflection: stepping back from the scene to think about it. A good essay balances the two. Too much narration, and the reader wonders why the story matters. Too much reflection, and the essay becomes a lecture without anything real to hold on to.

One useful way to think about a personal essay is to imagine two versions of the writer. There is the younger self who lived through the experience, who did not yet understand it. And there is the older self who is writing now, looking back with new knowledge. The tension between these two voices often gives an essay its power. "At the time, I thought she was being cruel," a writer might say. "I understand now that she was frightened."

Personal essays are usually written in the first person and in a voice that sounds like a real person talking. They tend to be candid, admitting mistakes, confusion or embarrassment. Readers trust a writer who is willing to show their own weaknesses more than one who presents themselves as always right.

The subject of a personal essay does not need to be dramatic. Some of the best essays are about small things: a meal, an argument, a walk, an object. What matters is what the writer discovers by thinking carefully about them. A good essay often ends not with a neat lesson but with an insight, a new understanding that feels earned by everything that came before.`,
      [clues, reflection, essays],
      [
        ask(
          t("According to the passage, what makes a personal essay more than a story?", "根据文章，是什么让个人随笔不仅仅是一个故事？"),
          t("Reflection on what the experience meant", "对经历意义的反思"),
          [
            t("A dramatic subject", "一个戏剧性的主题"),
            t("A happy ending", "一个圆满的结局"),
            t("Writing in the third person", "用第三人称写作"),
          ],
          t(
            "The first paragraph says that what makes it an essay is reflection: looking back to understand what happened.",
            "第一段说，使它成为随笔的是反思：回顾过去，理解发生的事。",
          ),
        ),
        ask(
          t('What are the "two versions of the writer" described in the third paragraph?', "第三段描述的“作者的两个版本”是什么？"),
          t("The younger self who lived it and the older self looking back", "亲身经历的年少自我和回顾过去的年长自我"),
          [
            t("The writer and the editor", "作者和编辑"),
            t("The hero and the villain", "英雄和反派"),
            t("The writer's real name and a pen name", "作者的真名和笔名"),
          ],
          t(
            "The paragraph describes the younger self who did not yet understand and the older self who writes now with new knowledge.",
            "这一段描述了当时尚未理解的年少自我，以及如今带着新认识写作的年长自我。",
          ),
        ),
        ask(
          t("What does the word candid most likely mean in the fourth paragraph?", "第四段中的 candid 最可能是什么意思？"),
          t("Honest and open", "坦诚直率的"),
          [t("Sweet and pleasant", "甜美宜人的"), t("Secret and hidden", "隐秘的"), t("Very formal", "非常正式的")],
          t(
            "Context clue: candid essays admit mistakes, confusion or embarrassment, which is what an honest and open writer does.",
            "上下文线索：candid 的随笔承认错误、困惑或尴尬，这正是坦诚直率的作者会做的事。",
          ),
        ),
      ],
    ),
    passage(
      "learning-my-fathers-language",
      t("Learning My Father's Language", "学习父亲的语言"),
      `My father speaks four languages, and for most of my childhood I was embarrassed by all of them. At parent-teacher meetings, his English came out slowly, with an accent that made other parents glance at each other. At the supermarket, he would answer a stranger's question in Spanish, then turn to me and say something in Tagalog, then mutter to himself in a language from his village that even my mother did not fully understand. I wanted him to be like other fathers. I wanted him to be quiet.

When I was fourteen, he was invited to speak at my school's career day. I begged him not to go. He went anyway, wearing his one good suit, and stood in front of my class to talk about his job as a nurse.

I prepared to be humiliated. Instead, I watched something I had never seen. He told a story about a patient, an old man who had been brought into the emergency room confused and frightened, speaking only a language no one on the staff recognized. My father had recognized it. It was the language of his village. He sat beside the old man for an hour, calming him, translating for the doctors, and the man's family later came to the hospital to thank him.

The class was silent. Then a girl in the front row asked him to say something in each of his languages. He did, smiling, and the class applauded.

Walking home that afternoon, I felt ashamed, but not of him. I had spent years treating his languages as a weakness, when they were exactly what made him able to help people others could not.

I have started learning his village language. I am slow and make mistakes, and he laughs at my accent. It is a fair revenge. But when I manage a whole sentence, he looks at me with a kind of pride that I did not know I wanted until I saw it.`,
      [clues, reflection, essays],
      [
        ask(
          t("Why did the writer want her father to be quiet when she was younger?", "作者小时候为什么希望父亲安静？"),
          t("She was embarrassed by his accent and his many languages", "她为他的口音和多种语言感到难堪"),
          [
            t("He talked too loudly in the hospital", "他在医院说话太大声"),
            t("He refused to speak English", "他拒绝说英语"),
            t("He told too many jokes", "他讲太多笑话"),
          ],
          t(
            "The first paragraph says she was embarrassed by all of his languages and wanted him to be like other fathers.",
            "第一段说，她为父亲的每一种语言感到难堪，希望他像别的父亲一样。",
          ),
        ),
        ask(
          t("What changed the writer's view of her father?", "是什么改变了作者对父亲的看法？"),
          t("Hearing how his village language let him help a frightened patient", "听他讲述家乡话如何帮助了一位受惊的病人"),
          [
            t("Seeing him in his good suit", "看到他穿上好西装"),
            t("A teacher punishing her", "老师惩罚了她"),
            t("Her mother explaining his job", "母亲解释了他的工作"),
          ],
          t(
            "His story about calming and translating for an old man showed that his languages were a strength, not a weakness.",
            "他讲述的安抚老人并为其翻译的故事表明，他的语言是一种优势，而不是缺点。",
          ),
        ),
        ask(
          t('What does the writer mean by "It is a fair revenge"?', "作者说“这是公平的报复”是什么意思？"),
          t(
            "Her father laughing at her accent repays her years of embarrassment at his",
            "父亲笑她的口音，算是回敬她多年来对父亲口音的难堪",
          ),
          [
            t("She is angry at her father", "她在生父亲的气"),
            t("Her father refuses to teach her", "父亲拒绝教她"),
            t("She wants to stop learning", "她想停止学习"),
          ],
          t(
            "The line is gently humorous: she once felt embarrassed by his accent, and now he laughs at hers.",
            "这句话带着温和的幽默：她曾为父亲的口音难堪，如今父亲笑她的口音。",
          ),
        ),
      ],
      ["English", "Spanish", "Tagalog"],
    ),
    passage(
      "the-race-i-did-not-win",
      t("The Race I Did Not Win", "我没有赢的那场比赛"),
      `I had trained for the regional cross-country championship for a whole year. I ran before school in the dark and after school in the rain. I gave up sweets, went to bed at nine and kept a notebook of every run: the distance, the time, how my legs felt. By the autumn of my junior year, I was the fastest runner on my team, and my coach said I had a real chance to win.

On the day of the race, the course was muddy from a week of rain. I started well, near the front. By the second mile, there were only three of us in the lead. I could hear my own breathing and the squelch of mud under my shoes.

Then, on a steep downhill, the girl beside me slipped and fell hard. I heard her cry out. Without really deciding, I stopped. She was holding her ankle, and her face was white. I helped her sit up and waved for an official. By the time someone arrived, a dozen runners had passed us.

I finished nineteenth. My coach did not say anything at the finish line; he just put his hand on my shoulder. On the bus home, I stared out of the window, furious with myself. A whole year of training, and I had thrown it away in a minute.

It took me months to see it differently. I had trained for a year to win a race, but in that minute on the hill, I found out something that no training could have told me: what I would do when no one was asking me to do anything. I was relieved by the answer.

I won the regional championship the next year. I remember it less clearly than the race I lost. The girl with the hurt ankle came to watch, and she cheered louder than anyone. We are still friends.`,
      [clues, reflection, essays],
      [
        ask(
          t("Why does the writer describe her training in such detail at the start?", "作者为什么在开头详细描写她的训练？"),
          t("To show how much she sacrificed, so her choice in the race means more", "为了表明她付出了多少，使她在比赛中的选择更有分量"),
          [
            t("To teach readers how to train for a race", "为了教读者如何为比赛训练"),
            t("To complain about her coach", "为了抱怨教练"),
            t("To explain why she disliked running", "为了解释她为什么不喜欢跑步"),
          ],
          t(
            "A year of dark mornings, rain and a careful notebook makes clear what she gave up when she stopped to help.",
            "一年的清晨摸黑、风雨无阻和细致的训练笔记，清楚地表明了她停下来帮忙时放弃了什么。",
          ),
        ),
        ask(
          t('What does the phrase "Without really deciding, I stopped" suggest?', "“没有真正做决定，我就停了下来”这句话暗示了什么？"),
          t("Her choice came from instinct, not careful thought", "她的选择出于本能，而不是深思熟虑"),
          [
            t("She was too tired to keep running", "她太累了，跑不动了"),
            t("Her coach told her to stop", "教练让她停下"),
            t("She had planned to stop all along", "她早就计划要停下"),
          ],
          t(
            "She did not weigh the choice; she simply acted, which is why the moment revealed who she was.",
            "她并没有权衡这个选择，而是直接行动，这正是那一刻揭示出她本性的原因。",
          ),
        ),
        ask(
          t(
            "Why does the writer remember the race she lost more clearly than the one she won?",
            "作者为什么对输掉的比赛比赢下的比赛记得更清楚？",
          ),
          t("It taught her something important about herself", "它让她认识到关于自己的重要一点"),
          [
            t("She hit her head during the race", "她在比赛中撞到了头"),
            t("The race she won was very short", "她赢的那场比赛很短"),
            t("She was not really at the second race", "她其实没参加第二场比赛"),
          ],
          t(
            "In that minute on the hill, she found out what she would do when no one was asking, which mattered more than winning.",
            "在山坡上的那一分钟，她发现了在无人要求时自己会怎么做，这比获胜更重要。",
          ),
        ),
      ],
    ),
    passage(
      "the-kitchen-table",
      t("The Kitchen Table", "厨房的餐桌"),
      `Our kitchen table is too big for our kitchen. You have to turn sideways to get past it to the refrigerator, and its corners have bruised every hip in the family. My parents bought it secondhand when I was born, from a family that was moving away, and it has been the center of our house ever since.

I did my homework at that table, crying over fractions while my mother washed dishes and pretended not to notice. My brother broke his front tooth on its edge when he was four and, according to family legend, did not cry at all. On the night my father lost his job, my parents sat there long after we had gone to bed, and I heard their voices rising and falling through the floor, too quiet to understand.

Every birthday cake has sat at the center of that table. Every argument about chores, curfews and phone bills has been fought across it. When my grandfather died, the whole family gathered around it, and for once nobody minded the lack of space.

Last month, my parents announced that they want to buy a new table, a smaller one, round and modern, that would actually fit. I was surprised by how upset I was. I argued that the old table was perfectly good. My mother pointed out the scratches, the wobble and the stain shaped like a map of Africa where someone had spilled tea in 2014.

She is right, of course. It is an ugly table. But I have realized that I am not really arguing about furniture. In a year and a half, I will leave for college, and the table is one of the few things in my life that has never changed. I am afraid that if it goes, the house will start to forget me.

We have agreed on a compromise: the new table will come, and the old one will go to the garage. I suspect I will visit it.`,
      [clues, reflection, essays],
      [
        ask(
          t("Why does the writer list so many family events at the table?", "作者为什么列举了这么多在餐桌旁发生的家庭事件？"),
          t("To show that the table holds the family's shared history", "为了表明这张桌子承载着全家的共同历史"),
          [
            t("To prove the table is valuable", "为了证明这张桌子很值钱"),
            t("To show that the family argues too much", "为了表明这家人吵架太多"),
            t("To explain how the table was made", "为了解释这张桌子是怎么做的"),
          ],
          t(
            "Homework, a broken tooth, a lost job, birthdays and a funeral all happened there, so the table holds the family's memories.",
            "写作业、摔断牙、失业、生日和葬礼都在那里发生，所以这张桌子承载着家庭的记忆。",
          ),
        ),
        ask(
          t("What does the writer realize she is really upset about?", "作者意识到她真正难过的是什么？"),
          t("Leaving home soon and feeling that things are changing", "很快要离家，感觉一切都在改变"),
          [
            t("The cost of the new table", "新桌子的价格"),
            t("The stain on the old table", "旧桌子上的污渍"),
            t("Her brother's broken tooth", "她弟弟摔断的牙"),
          ],
          t(
            "She says she is not really arguing about furniture: she will leave for college, and the table is one of the few things that has never changed.",
            "她说她其实不是在为家具争论：她即将去上大学，而这张桌子是少数从未改变的东西之一。",
          ),
        ),
        ask(
          t('What does the final sentence, "I suspect I will visit it," suggest?', "最后一句“我想我会去看它”暗示了什么？"),
          t("She remains attached to the table and the memories it holds", "她依然依恋这张桌子及其承载的记忆"),
          [
            t("She plans to sell the table", "她打算卖掉这张桌子"),
            t("She will eat all her meals in the garage", "她将在车库里吃所有饭"),
            t("She does not care about the table at all", "她完全不在乎这张桌子"),
          ],
          t(
            "The gentle, humorous ending shows she has accepted the change but still cherishes what the table means.",
            "温和而幽默的结尾表明，她接受了改变，但仍珍惜这张桌子的意义。",
          ),
        ),
      ],
      ["Africa"],
    ),
    passage(
      "the-year-i-stopped-talking",
      t("The Year I Stopped Talking", "那一年我不再说话"),
      `In seventh grade, I stopped speaking in class. It happened gradually. First I stopped raising my hand. Then I stopped answering when teachers called on me, shrugging instead or saying, "I don't know," even when I did. By the spring, some of my teachers had stopped calling on me at all, which was what I wanted, and also what made me feel invisible.

I could not have explained it then. Our family had moved that year, and I had left behind the friends I had known since kindergarten. The new school was bigger and louder, and the other students seemed to know a set of rules that nobody had told me. Silence felt safer. If I said nothing, I could not say anything wrong.

The person who changed it was not a teacher or a counselor. It was a boy named Felix who sat behind me in science. One day, during a group project, he asked me what I thought about our experiment. I shrugged. He waited. He did not repeat the question or make a joke. He simply waited, looking at me with genuine curiosity, as if my answer might actually be interesting.

The silence stretched until it became uncomfortable, and then, to end it, I answered. I said I thought our hypothesis was wrong. He asked why. I told him. He thought about it and said, "Huh. You're right."

It was a tiny moment. But it was the first time in months that someone had treated my words as worth waiting for. Over the next weeks, Felix kept asking. Slowly I began to answer other people, too.

I am not naturally talkative, and I never will be. But I learned that year that silence can be a wall as well as a shelter. And I learned the power of waiting for someone, the patience to leave room for a voice that is not yet ready to speak.`,
      [clues, reflection, essays],
      [
        ask(
          t("Why did the writer stop speaking in class?", "作者为什么在课堂上不再说话？"),
          t("After moving to a new school, silence felt safer than risking mistakes", "转到新学校后，沉默比冒险出错更让人有安全感"),
          [
            t("The teachers told her to be quiet", "老师让她安静"),
            t("She did not know any answers", "她一个答案都不知道"),
            t("She was ill for most of the year", "她那一年大部分时间都在生病"),
          ],
          t(
            "The second paragraph explains that her family had moved, the new school felt confusing and silence felt safer.",
            "第二段解释说，她家搬了家，新学校让她无所适从，沉默让她觉得更安全。",
          ),
        ),
        ask(
          t("What did Felix do that was different from others?", "费利克斯做了什么与别人不同的事？"),
          t("He waited patiently for her answer, as if it mattered", "他耐心地等她回答，好像她的回答很重要"),
          [
            t("He made a joke to get her to talk", "他开了个玩笑逗她说话"),
            t("He told the teacher about her silence", "他把她不说话的事告诉了老师"),
            t("He answered the question for her", "他替她回答了问题"),
          ],
          t(
            "Felix did not repeat the question or joke; he simply waited, with genuine curiosity.",
            "费利克斯没有重复问题，也没有开玩笑；他只是带着真诚的好奇心等待。",
          ),
        ),
        ask(
          t(
            'What does the writer mean by "silence can be a wall as well as a shelter"?',
            "作者说“沉默既可以是一面墙，也可以是一处庇护所”是什么意思？",
          ),
          t("Silence protected her, but it also cut her off from others", "沉默保护了她，但也把她和别人隔开了"),
          [
            t("Silence is always the best choice", "沉默永远是最好的选择"),
            t("She built a wall in her house", "她在家里砌了一面墙"),
            t("Talking is dangerous", "说话是危险的"),
          ],
          t(
            "Silence felt safe, like a shelter, but it also made her invisible and isolated, like a wall.",
            "沉默让她感到安全，像一处庇护所，但也让她变得隐形和孤立，像一面墙。",
          ),
        ),
      ],
      ["Felix"],
    ),
    passage(
      "a-letter-to-my-younger-self",
      t("A Letter to My Younger Self", "写给年少的自己的一封信"),
      `Some personal essays take an unusual form. This one is written as a letter from a high school senior to herself at twelve.

Dear Twelve,

You are sitting on the bathroom floor right now, I think, because Sofia did not invite you to her party and everyone else is going. You have decided that this means you will never have friends, that something is wrong with you, and that it will be like this forever. I want to tell you some things, though I know you will not believe most of them.

First: Sofia moves away next year, and you will barely remember her. In two years, you will meet a girl named Priya in the library, arguing with you about whether a book's ending was fair. She will become your best friend. You will argue about books for the rest of high school.

Second: the things you are embarrassed about now will matter less than you think. Nobody will remember the day you tripped in the cafeteria. You will, for a while, and then you will tell it as a funny story.

Third, and this is the hard one: you will feel this way again. Not about Sofia, but about other things. A test you fail. A friendship that ends. A college that says no. Each time, it will feel permanent. It will not be. I am not saying it will not hurt. I am saying you will get up from the floor, every time, and the getting up gets a little easier.

Finally, be kinder to yourself. You talk to yourself in a voice you would never use with a friend. You would not tell Priya that she was stupid or unlovable. Do not say it to yourself.

I am proud of you. You do not know yet how much you will grow.

Love,

Seventeen

The letter form lets the writer reflect on her past while speaking directly to it, and the distance between the two ages becomes the subject of the essay.`,
      [clues, reflection, essays],
      [
        ask(
          t('Why is the letter addressed to "Twelve" and signed "Seventeen"?', "为什么这封信写给“十二岁”，署名为“十七岁”？"),
          t("The writer at seventeen is writing to herself at twelve", "十七岁的作者在给十二岁的自己写信"),
          [
            t("Twelve and Seventeen are two friends", "十二和十七是两个朋友"),
            t("They are the ages of two sisters", "这是两姐妹的年龄"),
            t("It is a letter about numbers", "这是一封关于数字的信"),
          ],
          t(
            "The introduction says the essay is a letter from a high school senior to herself at twelve.",
            "引言说，这篇随笔是一名高三学生写给十二岁的自己的信。",
          ),
        ),
        ask(
          t('What does the writer call "the hard one" to say?', "作者把哪一点称为“最难说的”？"),
          t("That painful feelings will come again, but she will recover each time", "痛苦的感受还会再来，但她每次都会重新站起来"),
          [
            t("That Sofia will invite her next year", "索菲亚明年会邀请她"),
            t("That she will never feel sad again", "她再也不会难过"),
            t("That Priya will move away", "普丽娅会搬走"),
          ],
          t(
            "The third point says she will feel this way again about other things, but she will get up from the floor every time.",
            "第三点说，她还会因为别的事情有同样的感受，但她每次都会从地上站起来。",
          ),
        ),
        ask(
          t("What does the last paragraph say the letter form allows the writer to do?", "最后一段说，书信这种形式让作者能够做什么？"),
          t("Reflect on her past while speaking directly to it", "一边反思过去，一边直接与过去对话"),
          [
            t("Hide her identity from readers", "向读者隐藏身份"),
            t("Avoid writing about her feelings", "避免写自己的感受"),
            t("Tell a story about someone else", "讲述别人的故事"),
          ],
          t(
            "The final paragraph says the letter form lets the writer reflect on her past while speaking directly to it.",
            "最后一段说，书信形式让作者能够一边反思过去，一边直接对过去说话。",
          ),
        ),
      ],
      ["Sofia", "Priya", "Twelve", "Seventeen"],
    ),
    passage(
      "the-night-shift-at-the-diner",
      t("The Night Shift at the Diner", "餐馆的夜班"),
      `The summer before my senior year, I took a job washing dishes at a diner that stayed open all night. I took it for the money. I thought I would hate it, and for the first two weeks, I did. The kitchen was hot, the dishwasher leaked and my hands were permanently wrinkled. I came home at two in the morning smelling of grease.

The diner's night customers were not the people I saw during the day. There were truck drivers stopping for coffee on long routes, nurses coming off late shifts, a man who came in every night at midnight and ordered pie without ever saying a word. There was an old woman named Mrs. Delacroix who sat in the corner booth doing crossword puzzles with a pen and tipped the waitress in coins she counted out carefully.

The cook, Marcus, had worked nights for eleven years. He was fifty, had two grown children and sang old soul songs while he worked, badly and loudly. In my first week, I dropped a stack of plates, and I braced for him to yell. Instead, he laughed and said, "Now you're one of us. Everyone breaks the first stack."

Over the summer, Marcus taught me things that had nothing to do with dishes. He taught me to notice the customers: who was tired, who was lonely, who needed their coffee refilled without being asked. "People don't come here at three in the morning for the food," he told me. "They come because the lights are on."

On my last night, the silent man who ordered pie looked up as I passed and said, "Good luck at school." I had never told him I was going anywhere. Marcus must have.

I went into that job thinking it was a way to earn money. I left understanding that work, even the humblest kind, can be a way of looking after people. I still think about the lights being on.`,
      [clues, reflection, essays],
      [
        ask(
          t("Why did Marcus laugh when the writer dropped the plates?", "作者打碎盘子时，马库斯为什么笑了？"),
          t("He saw it as a normal part of starting the job, not a disaster", "他把这看作开始这份工作的正常经历，而不是灾难"),
          [
            t("He wanted to embarrass the writer", "他想让作者难堪"),
            t("The plates were very cheap", "盘子很便宜"),
            t("He had not noticed what happened", "他没注意到发生了什么"),
          ],
          t(
            'He said, "Now you\'re one of us. Everyone breaks the first stack," treating the mistake as a kind of welcome.',
            "他说：“现在你是我们中的一员了。每个人都会打碎第一摞盘子。”把这个失误当作一种欢迎。",
          ),
        ),
        ask(
          t('What does Marcus mean by "They come because the lights are on"?', "马库斯说“他们来是因为灯亮着”是什么意思？"),
          t("People come at night for comfort and company, not only for food", "人们深夜来这里是为了慰藉和陪伴，而不只是为了食物"),
          [
            t("The diner has the brightest lights in town", "这家餐馆的灯是镇上最亮的"),
            t("People cannot see in the dark", "人们在黑暗中看不见"),
            t("The food at the diner is bad", "餐馆的食物很难吃"),
          ],
          t(
            "Marcus says people do not come at three in the morning for the food; an open, lit place offers them comfort.",
            "马库斯说，人们凌晨三点来不是为了食物；一个开着灯的地方给了他们慰藉。",
          ),
        ),
        ask(
          t("What does the writer learn by the end of the summer?", "到夏天结束时，作者学到了什么？"),
          t("Even humble work can be a way of caring for people", "即使是最卑微的工作，也可以是照顾他人的一种方式"),
          [
            t("Washing dishes pays very well", "洗碗的报酬很高"),
            t("She should never work at night", "她永远不该上夜班"),
            t("Customers are always rude", "顾客总是很粗鲁"),
          ],
          t(
            "The last paragraph says she left understanding that work, even the humblest kind, can be a way of looking after people.",
            "最后一段说，她离开时明白了，工作哪怕再平凡，也可以是一种照顾他人的方式。",
          ),
        ),
      ],
      ["Delacroix", "Marcus"],
    ),
  ],
};
