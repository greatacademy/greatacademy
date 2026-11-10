// The reading unit of the B1 theme Arts and Entertainment: a lost painting, sad songs, a school play, a street artist,
// writing a novel, the violin, the circus and fame.

import { type ReadingUnitDef, t } from "@ga/content";
import { passageMaker } from "../pre-a1/reading-kit.ts";
import { readingWords } from "./reading-words.ts";

const phrasal = "phrasal-verbs";

const passage = passageMaker(readingWords, [
  "b1-words-arts",
  "b1-words-film-and-theater",
  "b1-words-music-2",
  "b1-words-books-and-stories",
  "b1-words-entertainment",
  "b1-words-describing-art",
  "b1-words-going-out",
  phrasal,
]);

/** readingArts is the reading unit of the theme Arts and Entertainment. */
export const readingArts: ReadingUnitDef = {
  id: "b1-reading-arts",
  title: t("Arts and Entertainment", "艺术与娱乐"),
  passages: [
    passage({
      id: "b1-arts-the-painting-in-the-attic",
      title: ["The Painting That Was Found in an Attic", "在阁楼里发现的画"],
      body: `When Marie's grandmother died, the family had to empty her old house in the country. Most of the things under the roof were worthless: broken chairs, old magazines and boxes of clothes. But behind some boxes, Marie found a small painting wrapped in an old shirt.

It was a portrait of a young woman in a blue dress, sitting by a window. The colors were dark and dirty, and there was no name on the front. On the back, someone had written a date in pencil: 1887.

Marie almost put it with the things to throw away. But her brother, who loved art, thought that he had seen the style before. He took a photo and sent it to an auction house in the city.

A week later, an expert called. She wanted to see the painting herself. When she arrived, she studied it for a long time under a strong light, looked carefully at the back of the canvas, and took tiny samples of the paint.

The tests took three months. Finally, the expert gave them the result: the painting was very probably the work of a famous French painter. It had been missing for more than a hundred years. Nobody knew how it had ended up in the house of their grandmother.

After it was carefully cleaned, the portrait looked completely different. The dark colors became bright and vivid, and the face of the woman seemed to come alive. The expert called it a masterpiece.

Then the family had to decide something difficult. The painting was worth a fortune: experts estimated that it could be sold for more than two million dollars. But it had been in her house all her life. "It felt wrong to sell her memories," says Marie.

In the end, they found an answer. They lent the painting to a museum, where thousands of people can see it every year, and the family can visit it whenever they want. "Grandma never showed it to anyone," Marie says. "Now the whole world can see it."`,
      grammar: [phrasal],
      names: ["Marie", "Marie's", "French", "Grandma"],
      glossed: ["auction"],
      questions: [
        [
          ["What did Marie almost do with the painting?", "玛丽差点怎样处理那幅画？"],
          ["Put it with the things to throw away", "把它和要扔掉的东西放在一起"],
          [
            ["Send it to an auction house herself", "自己把它寄给拍卖行"],
            ["Give it to her brother as a present", "把它作为礼物送给哥哥"],
          ],
          [
            '"Marie almost put it with the things to throw away." It was her brother who sent a photo to the auction house.',
            "玛丽差点把画扔掉；是她哥哥把照片寄给了拍卖行。",
          ],
        ],
        [
          ["How did the expert check the painting?", "专家是怎样鉴定这幅画的？"],
          ["She studied it closely and took tiny samples of the paint", "她仔细研究并取了极少量颜料样本"],
          [
            ["She asked the family about their grandmother's life", "她向家人询问祖母的生平"],
            ["She cleaned it at once and looked for a name", "她立刻清洗画作并寻找署名"],
          ],
          [
            '"She studied it for a long time under a strong light, looked carefully at the back of the canvas, and took tiny samples of the paint."',
            "专家在强光下长时间研究画作，查看画布背面，并取了微量颜料做检测。",
          ],
        ],
        [
          ["What did the family decide to do in the end?", "这家人最后决定怎么做？"],
          ["Lend the painting to a museum", "把画借给博物馆展出"],
          [
            ["Sell it for two million dollars", "以两百万美元卖掉它"],
            ["Keep it in their own house", "把它留在自己家里"],
          ],
          [
            '"They lent the painting to a museum, where thousands of people can see it every year." They felt it was wrong to sell it.',
            "他们觉得卖掉祖母的回忆不合适，于是把画借给了博物馆。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-arts-why-we-love-sad-songs",
      title: ["Why We Love Sad Songs", "我们为什么喜欢悲伤的歌"],
      body: `Most of us try to avoid feeling sad. We don't choose to fail exams or lose friends. So why do millions of people listen to sad songs again and again, and even say that these songs are their favorites?

Scientists have studied this question, and they have found a few possible answers.

The first is that sad music lets us feel emotions in a safe way. When we listen to a song about a lost love, we feel sad, but nothing bad has really happened to us. We can experience the emotion and then turn the music off. Some scientists compare it to watching a movie that makes us afraid: we enjoy the feeling because we know that we are safe.

The second answer is that sad songs can help us. When we are going through a hard time, a sad song can make us feel understood. The singer seems to know exactly how we feel, and we realize that we are not alone. Many people say that they listen to sad songs after a relationship ends, not to feel worse, but to feel better.

The third answer is about the music itself. Sad songs are often slow, with a simple melody and lyrics that tell a story. Many people who listen to them describe them as beautiful and moving. Some people even feel a sudden cold on their skin when they hear a certain part of a song, and studies suggest that this happens more often with sad music than with happy music.

Not everyone enjoys sad songs. In studies, people who are more open to new experiences, and who feel the emotions of other people strongly, seem to like them the most.

So the next time you play the same sad song for the tenth time, don't worry. It might be just what you need.`,
      grammar: [phrasal],
      questions: [
        [
          ["Why can we enjoy sadness in music, according to the first answer?", "根据第一种解释，我们为什么能在音乐中享受悲伤？"],
          ["We feel the emotion, but nothing bad has happened to us", "我们感受到情绪，但并没有真的遭遇坏事"],
          [
            ["Sad songs make us forget our emotions completely", "悲伤的歌让我们完全忘记情绪"],
            ["We usually listen to them together with friends", "我们通常和朋友一起听"],
          ],
          [
            '"When we listen to a song about a lost love, we feel sad, but nothing bad has really happened to us."',
            "听失恋的歌时我们感到悲伤，但现实中并没有发生坏事，所以感觉是安全的。",
          ],
        ],
        [
          ["Why do some people listen to sad songs after a relationship ends?", "为什么有些人在感情结束后听悲伤的歌？"],
          ["The songs make them feel understood and not alone", "这些歌让他们觉得被理解、不孤单"],
          [
            ["They want to feel even worse for a while", "他们想暂时感觉更糟"],
            ["The songs give them advice about love", "这些歌给他们恋爱建议"],
          ],
          [
            '"A sad song can make us feel understood... we realize that we are not alone." They listen "not to feel worse, but to feel better".',
            "悲伤的歌让人觉得被理解、并不孤单；人们听它是为了感觉好一些，而不是更糟。",
          ],
        ],
        [
          ["Who seems to like sad songs the most?", "什么样的人似乎最喜欢悲伤的歌？"],
          ["People who feel the emotions of others strongly", "能强烈感受他人情绪的人"],
          [
            ["People who never feel sad themselves", "自己从不感到悲伤的人"],
            ["People who only listen to slow music", "只听慢节奏音乐的人"],
          ],
          [
            '"People who are more open to new experiences, and who feel the emotions of other people strongly, seem to like them the most."',
            "更乐于接受新体验、对他人情绪感受强烈的人最喜欢悲伤的歌。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-arts-behind-the-scenes-of-a-school-play",
      title: ["Behind the Scenes of a School Play", "校园戏剧的幕后"],
      body: `On the night of the performance, the audience sees two hours of lights, music and acting. What they don't see are the three months of work behind it. Here is how the drama club at Riverside High School put on its play this year, a comedy about a family hotel.

The work began in January, when the director, Ms. Okafor, chose the script and held auditions. Forty students tried out for twelve roles. "Saying no to students is the hardest part of my job," she says. Those who did not get a role were not left out: they joined the teams that make the lights, the sound and the costumes.

The actors rehearsed three afternoons a week. At first, the actors read the script sitting around a table. Then they started to move on the stage, learning where to stand and when to come in. By March, they had to know all their lines by heart. "I wrote mine on cards and practiced on the bus," says Sam, 16, who played the father.

At the same time, the art students were building the front of a hotel for the stage, made of wood and painted to look like stone. The music students wrote a short tune for the beginning of each scene.

Things went wrong, of course. Two weeks before the premiere, the actress with the biggest role broke her arm. She decided to perform anyway, and the director added a few lines to the script to explain why her character had a broken arm. The audience thought it was part of the plot.

On the first night, the hall was full. When the play ended, there was loud applause, and the actors came back on the stage three times. "That moment makes all the work worth it," says Ms. Okafor. "And next week, we start planning the next one."`,
      grammar: [phrasal],
      names: ["Riverside", "High", "Ms", "Okafor", "Sam"],
      glossed: ["auditions"],
      questions: [
        [
          ["What happened to the students who did not get a role?", "没有得到角色的学生怎么样了？"],
          ["They joined the teams for lights, sound and costumes", "他们加入了灯光、音响和服装小组"],
          [
            ["They had to leave the drama club", "他们不得不退出戏剧社"],
            ["They watched the rehearsals as the audience", "他们作为观众观看排练"],
          ],
          [
            '"Those who did not get a role were not left out: they joined the teams that make the lights, the sound and the costumes."',
            "没得到角色的学生并没有被排除在外，而是加入了灯光、音响和服装小组。",
          ],
        ],
        [
          ["How did Sam learn his lines?", "萨姆是怎样背台词的？"],
          ["He wrote them on cards and practiced on the bus", "他把台词写在卡片上，在公交车上练习"],
          [
            ["He read them around a table every evening", "他每天晚上围坐在桌旁读台词"],
            ["The director recorded them for him to hear", "导演把台词录下来给他听"],
          ],
          ['"I wrote mine on cards and practiced on the bus," says Sam.', "萨姆说他把台词写在卡片上，在公交车上练习。"],
        ],
        [
          ["What did the director do when the actress broke her arm?", "女演员摔断胳膊后，导演做了什么？"],
          ["She added lines to explain the broken arm", "她加了几句台词来解释断臂"],
          [
            ["She gave the role to another student", "她把角色给了另一个学生"],
            ["She moved the premiere to a later date", "她把首演推迟了"],
          ],
          [
            '"The director added a few lines to the script to explain why her character had a broken arm." The actress decided to perform anyway.',
            "女演员坚持演出，导演在剧本里加了几句台词，解释角色为什么断了胳膊。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-arts-the-street-artist",
      title: ["The Street Artist", "街头艺术家"],
      body: `Ten years ago, the walls of the old factory near the station were gray and full of graffiti. Today, people travel from other cities to see them. The reason is a street artist who calls herself Lumi.

Lumi does not show her face, and she never gives her real name. She works at night, usually alone, with paint and a ladder. In the morning, people find a new picture on a wall: a huge child holding a bird, an old man reading a newspaper made of leaves, a cat that seems to walk off the wall.

Her early works were painted without asking the owners of the walls, which is against the law. Some residents called them vandalism, and the city council painted over two of them. But other people loved them. They started a petition to protect her pictures, and thousands of people signed it. In the end, the council changed its opinion and asked Lumi to paint the whole factory wall.

Since then, Lumi has become famous. Her pictures can be seen in magazines, and a gallery in the capital has offered to hold an exhibition of her art. Some people have even tried to cut pieces out of walls to sell them.

This has led to a debate. Is street art still street art if it is in a gallery? Who should own it: the owner of the wall, the artist, or everyone who walks past?

Lumi's answer is clear. In one of her few interviews, she said: "I paint for people who will never go to a gallery. A bus driver, a child on the way to school, an old woman with her shopping. If my work makes them stop for a moment and smile, it has done its job." She has turned down the exhibition.`,
      grammar: [phrasal],
      names: ["Lumi", "Lumi's"],
      glossed: ["ladder"],
      questions: [
        [
          ["Why did some residents not like Lumi's early works?", "为什么有些居民不喜欢卢米早期的作品？"],
          ["She painted them without asking, so they saw vandalism", "她未经允许就画，他们认为这是破坏公物"],
          [
            ["The pictures were too small to see from the street", "画太小，从街上看不见"],
            ["She painted over the work of other artists", "她把其他艺术家的作品涂掉了"],
          ],
          [
            '"Her early works were painted without asking the owners of the walls, which is against the law. Some residents called them vandalism."',
            "她早期未经墙主允许就作画，这是违法的，一些居民称之为破坏公物。",
          ],
        ],
        [
          ["What did the council do in the end?", "市政府最后做了什么？"],
          ["It asked Lumi to paint the whole factory wall", "请卢米画整面工厂墙"],
          [
            ["It painted over all of her pictures", "把她所有的画都涂掉了"],
            ["It sold her pictures to a gallery", "把她的画卖给了画廊"],
          ],
          [
            '"In the end, the council changed its opinion and asked Lumi to paint the whole factory wall." It painted over only two works earlier.',
            "市政府后来改变看法，请卢米画整面墙；之前只涂掉了她的两幅画。",
          ],
        ],
        [
          ["Why has Lumi turned down the exhibition?", "卢米为什么拒绝了画展？"],
          ["She paints for people who never go to galleries", "她为从不去画廊的人作画"],
          [
            ["The gallery offered her too little money", "画廊给的钱太少"],
            ["She is afraid that people will see her face", "她害怕别人看到她的脸"],
          ],
          [
            '"I paint for people who will never go to a gallery... If my work makes them stop for a moment and smile, it has done its job."',
            "卢米说她为那些从不去画廊的普通人作画，能让他们驻足一笑就够了。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-arts-how-a-novel-is-written",
      title: ["How a Novel Is Written", "小说是怎样写成的"],
      body: `Many people dream of writing a novel. But how does an author turn an idea into a book of three hundred pages? We asked three writers about their methods.

Some authors plan everything before they write a word. Grace, who writes crime fiction, spends two months on a plan before she starts. "I need to know who the villain is and how the police will find out," she says. "I write a few lines about every chapter, and I put cards on my wall so that I can see the whole plot. If I didn't, I would get lost."

Others prefer to discover the story as they go. Omar, whose first novel came out last year, starts with only a character and a situation. "I had a picture in my head of a girl waiting at a bus stop in the snow," he says. "I didn't know who she was or where she was going. I wrote to find out." He admits that this method has problems. "I threw away almost half of what I wrote. But the surprises are the best part."

Most writers agree that the first draft is never good. "The first draft of every writer is bad," says Ruth, who has written eleven novels. "The real work is writing it again." She usually writes each chapter four or five times. She reads her work out loud to hear whether the sentences sound right, and she cuts anything that is dull.

Then the book goes to an editor, who suggests changes, and the work starts again. From the first idea to the day that the book is in the shops can take two or three years.

What is their advice for young writers? All three gave the same answer: read a lot, write every day, and finish what you start. "A bad book that is finished is better than a great book that you never write," says Ruth.`,
      grammar: [phrasal],
      names: ["Grace", "Omar", "Ruth"],
      glossed: ["draft"],
      questions: [
        [
          ["How does Grace plan her novels?", "格蕾丝是怎样构思小说的？"],
          ["She describes every chapter and puts cards on her wall", "她写下每章概要，把卡片贴在墙上"],
          [
            ["She starts with a character and finds out the story", "她从一个人物出发，边写边发现故事"],
            ["She writes the last chapter first and then the rest", "她先写最后一章，再写其余部分"],
          ],
          [
            '"I write a few lines about every chapter, and I put cards on my wall so that I can see the whole plot." Starting with a character is Omar\'s method.',
            "格蕾丝为每章写简介并把卡片贴在墙上；从人物出发是奥马尔的方法。",
          ],
        ],
        [
          ["What does Omar like about his method?", "奥马尔喜欢自己方法的哪一点？"],
          ["The surprises he finds while he writes", "写作过程中遇到的惊喜"],
          [
            ["He never has to throw anything away", "他从来不用扔掉任何东西"],
            ["He always knows who the villain is", "他总是知道反派是谁"],
          ],
          [
            '"I threw away almost half of what I wrote. But the surprises are the best part."',
            "他扔掉了几乎一半的稿子，但他说惊喜是最好的部分。",
          ],
        ],
        [
          ['What does Ruth say is "the real work"?', "露丝说什么才是“真正的工作”？"],
          ["Writing the first draft again", "把初稿重写"],
          [
            ["Planning every chapter first", "先规划好每一章"],
            ["Finding a good editor", "找到一位好编辑"],
          ],
          [
            '"The first draft of every writer is bad... The real work is writing it again." She writes each chapter four or five times.',
            "露丝认为初稿都不好，真正的工作是重写，她每章要改写四五遍。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-arts-learning-the-violin-as-an-adult",
      title: ["Learning the Violin as an Adult", "成年后学小提琴"],
      body: `I always wanted to play the violin. As a child, I asked my parents for lessons, but we couldn't afford them, and later there was never time. Then, when I turned forty, my daughter gave me a gift: a second-hand violin and ten lessons with a teacher. "Now you have no reason to wait," she said.

The first lesson was a surprise. I had imagined myself playing beautiful melodies. Instead, I spent half an hour learning how to hold the instrument, and when I finally played a note, it was like the cry of a cat in pain. My teacher, a patient young musician called Elena, just smiled. "Everyone sounds like that at the beginning," she said.

Learning as an adult is different from learning as a child. Children are not afraid of making bad sounds, and they have more time. Adults are busy, and we are used to being good at things. I felt embarrassed to practice when my neighbors could hear me. In the first two months, I almost gave up three times.

But being an adult also helped me in some ways. I could understand the theory of music more easily, and I was practicing because I wanted to, not because my parents told me to. Elena taught me to practice for twenty minutes every day instead of for two hours on Sundays. "Little and often," she said. "That's the secret."

Slowly, the sounds got better. After six months, I could play a simple tune that my daughter recognized. After a year, I joined a small orchestra for adults who are just starting. Not one of us is very good, but we have a lot of fun.

Last month, we gave our first concert in a church hall. My daughter sat in the front row. When we finished, she stood up and applauded louder than anyone. It was one of the best moments of my life.

If you have always wanted to learn an instrument, my advice is simple: start now. You will never be younger than you are today.`,
      grammar: [phrasal],
      names: ["Elena"],
      glossed: ["second-hand"],
      questions: [
        [
          ["How did the writer's first lesson go?", "作者的第一节课怎么样？"],
          ["The writer's first note was like a cat in pain", "作者拉出的第一个音像一只痛苦的猫"],
          [
            ["The writer played a beautiful melody at once", "作者马上拉出了一段优美的旋律"],
            ["The teacher sent the writer home early", "老师让作者提早回家了"],
          ],
          [
            '"When I finally played a note, it was like the cry of a cat in pain." The writer had only imagined playing beautiful melodies.',
            "第一个音听起来像猫在痛苦地叫；优美的旋律只是作者的想象。",
          ],
        ],
        [
          ["What was Elena's advice about practice?", "埃琳娜对练习有什么建议？"],
          ["Practice a little every day", "每天练一点"],
          [
            ["Practice for two hours on Sundays", "每周日练两个小时"],
            ["Practice only when the neighbors are out", "只在邻居不在家时练"],
          ],
          [
            "\"Elena taught me to practice for twenty minutes every day instead of for two hours on Sundays. 'Little and often.'\"",
            "埃琳娜让作者每天练二十分钟，而不是周日一次练两小时：少量多次。",
          ],
        ],
        [
          ["Which was an advantage of learning as an adult?", "成年后学习有什么优势？"],
          ["Understanding the theory of music more easily", "更容易理解乐理"],
          [
            ["Having more free time than children", "比孩子有更多空闲时间"],
            ["Not being afraid of making bad sounds", "不怕拉得难听"],
          ],
          [
            '"I could understand the theory of music more easily." Children, not adults, have more time and are not afraid of making bad sounds.',
            "作者更容易理解乐理；时间更多、不怕难听的是孩子。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-arts-a-night-at-the-circus",
      title: ["A Night at the Circus", "马戏团之夜"],
      body: `I hadn't been to a circus since I was a child, and I didn't expect much. I remembered a tent that smelled of animals, a clown who scared me, and a man who put his head in the mouth of a lion. So when my friend got tickets for a show called Skyline, I almost said no.

I'm glad I didn't. Skyline was nothing like the circus I remembered. There were no animals at all. Instead, there were twenty artists from eight countries, live music from a small band, and a stage that changed with every act.

The show began with all the lights off. Then one light came on, high above the audience, and we saw a woman who was holding a long piece of red material. She climbed, turned and fell, and every time she fell, the audience shouted, until the material caught her just above the ground. It was so dramatic that I forgot to breathe.

The best act was a group of six young men and women who stood on the shoulders of one another to make a tower, four people high. Then the one at the top jumped and turned in the air before coming down on the stage. The applause went on for almost a minute.

There were quieter moments too. A clown, who never said a word, came into the audience, borrowed the hat of a man, and made the whole tent laugh. Another artist kept seven balls in the air at the same time while the band played faster and faster.

The spectators around me were of all ages: grandparents, teenagers, and small children sitting on the knees of their parents. Everyone looked surprised and happy.

If Skyline comes to your city, I strongly recommend it. Book early, because the shows are often sold out. And if you can, sit near the front.`,
      grammar: [phrasal],
      names: ["Skyline"],
      glossed: ["clown"],
      questions: [
        [
          ["Why did the writer almost say no to the tickets?", "作者为什么差点拒绝那些票？"],
          ["The circus the writer remembered was not good", "作者记忆中的马戏团并不好"],
          [
            ["The show was sold out on that night", "那天晚上的票已经卖光了"],
            ["The writer does not like live music", "作者不喜欢现场音乐"],
          ],
          [
            '"I remembered a tent that smelled of animals, a clown who scared me... So when my friend got tickets... I almost said no."',
            "作者记得的马戏团有动物的气味和吓人的小丑，所以差点不想去。",
          ],
        ],
        [
          ["How was Skyline different from the circus the writer remembered?", "《天际线》和作者记忆中的马戏团有什么不同？"],
          ["There were no animals at all", "完全没有动物"],
          [
            ["There was no music at all", "完全没有音乐"],
            ["There were no clowns at all", "完全没有小丑"],
          ],
          [
            '"There were no animals at all. Instead, there were twenty artists... live music from a small band." A clown came into the audience.',
            "《天际线》没有动物，但有乐队现场演奏，也有小丑走进观众席。",
          ],
        ],
        [
          ["What was the best act, according to the writer?", "作者认为最精彩的节目是哪个？"],
          ["Six performers who made a tower four people high", "六位演员搭起四人高的人塔"],
          [
            ["A woman who climbed a long red cloth", "一位攀爬长长红布的女子"],
            ["A clown who borrowed a man's hat", "一个借走男士帽子的小丑"],
          ],
          [
            '"The best act was a group of six young men and women who stood on the shoulders of one another to make a tower, four people high."',
            "作者说最精彩的是六位年轻演员叠成四人高的人塔。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-arts-is-fame-worth-it",
      title: ["Is Fame Worth It?", "出名值得吗？"],
      body: `Ask a group of teenagers what they want to be, and many will say "famous". In one survey, more young people chose fame as their goal than chose being rich or being kind. The internet has made fame seem nearer than ever: anyone with a phone can put a video online, and a few of them become celebrities almost at once.

But is fame really as good as it looks?

Celebrities often say that it is not. The first problem is privacy. A famous actor cannot go to the supermarket or take their children to the park without people recognizing them, taking photos of them and following them. Every mistake they make can be shared with millions of people within minutes.

The second problem is pressure. Fame often depends on staying popular, and trends change fast. A singer who is a star this year may be forgotten next year. Many celebrities say that they feel they must always look good, always be happy and always have something new to offer. Some have talked about stress and depression.

The third problem is relationships. When you are famous, it can be hard to know who your real friends are. Some people want to be close to you only because of your name or your money.

Of course, fame has its rewards. Famous people can earn huge amounts of money, and many use their fame to support charities or to raise awareness of important problems. Some say that being recognized for their work is a great feeling.

Perhaps the question is not whether fame is good or bad, but what type of fame you want. Being known for something you have made or done, such as a great album, a novel or a scientific breakthrough, is different from being famous just for being famous. As one actress put it: "Fame should come after the work. If it's the only thing you want, you will never have enough of it."`,
      grammar: [phrasal],
      glossed: ["depression"],
      questions: [
        [
          ["What did one survey find about young people?", "一项调查发现了年轻人的什么情况？"],
          ["More of them chose fame as a goal than being rich", "选择出名作为目标的人比选择富有的多"],
          [
            ["Most of them wanted to become scientists", "他们大多数想成为科学家"],
            ["More of them chose being kind than being famous", "选择善良的人比选择出名的多"],
          ],
          [
            '"In one survey, more young people chose fame as their goal than chose being rich or being kind."',
            "调查中，选择出名作为目标的年轻人比选择富有或善良的都多。",
          ],
        ],
        [
          ['What is "the first problem" of fame?', "出名的“第一个问题”是什么？"],
          ["Famous people lose their privacy", "名人失去了隐私"],
          [
            ["Famous people earn too much money", "名人挣钱太多"],
            ["Famous people cannot find any work", "名人找不到工作"],
          ],
          [
            '"The first problem is privacy. A famous actor cannot go to the supermarket... without people recognizing them, taking photos of them and following them."',
            "第一个问题是隐私：名人去超市或公园都会被认出、拍照和跟踪。",
          ],
        ],
        [
          ["What does the actress mean at the end?", "结尾那位女演员是什么意思？"],
          ["Fame should come from your work, not be your only goal", "名气应该来自作品，而不应是唯一目标"],
          [
            ["Fame is the best reward for very hard work", "名气是对辛勤工作最好的回报"],
            ["Famous people should stop working for a while", "名人应该暂停工作一段时间"],
          ],
          [
            '"Fame should come after the work. If it\'s the only thing you want, you will never have enough of it."',
            "她认为名气应该随作品而来；如果只追求名气，就永远不会满足。",
          ],
        ],
      ],
    }),
  ],
};
