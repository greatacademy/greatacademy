// The reading unit of the B1 theme Education and Learning: how people learn, remember and study, at school and after.

import { type ReadingUnitDef, t } from "@ga/content";
import { passageMaker } from "../pre-a1/reading-kit.ts";
import { readingWords } from "./reading-words.ts";

const tenses = "present-perfect-or-past-simple";

const passage = passageMaker(readingWords, [
  "b1-words-school-life",
  "b1-words-learning",
  "b1-words-school-people",
  "b1-words-subjects-2",
  "b1-words-thinking",
  "b1-words-qualities",
  "b1-words-study-skills",
  "b1-words-little-words-4",
  tenses,
]);

/** readingEducation is the reading unit of the theme Education and Learning. */
export const readingEducation: ReadingUnitDef = {
  id: "b1-reading-education",
  title: t("Education and Learning", "教育与学习"),
  passages: [
    passage({
      id: "b1-education-learning-a-language-at-sixty",
      title: ["Learning a Language at Sixty", "六十岁学外语"],
      body: `Elena Ruiz stopped working when she was sixty. She was a nurse for thirty-five years, and she was ready for a quieter life. But after a few months at home, she felt bored. "I need something new to think about," she told her husband.

Her daughter lives in Japan with her family. Elena visits them every summer, but she could never really talk to the children of her daughter, because they speak Japanese and she didn't. So she decided to learn it.

She enrolled in an evening class at the local college. On the first day she was nervous. Most of the other students were young, and they looked very confident. The first semester was hard. Elena couldn't memorize the new words, and she often forgot them by the next lesson.

Her tutor, a patient young man called Kenji, gave her some advice. "Don't try to learn everything at once. Learn ten words a day, and repeat them before you go to sleep." He also told her to stop worrying about mistakes. "Everyone makes mistakes. That is how we learn."

Elena followed his advice. She wrote new words on small cards and put them on the walls of her kitchen. She listened to Japanese songs while she cooked. Slowly, she made progress.

Last summer Elena visited her daughter again. At dinner, the youngest child asked her a question in Japanese, and she answered him. Everybody at the table laughed and cheered.

"It has taken me two years," Elena says, "and I still make lots of mistakes. But I have learned something important: you are never too old to learn."`,
      grammar: [tenses],
      names: ["Elena", "Ruiz", "Japan", "Japanese", "Kenji"],
      questions: [
        [
          ["Why did Elena decide to learn Japanese?", "埃琳娜为什么决定学日语？"],
          ["To talk to her daughter's children", "为了和女儿的孩子们交谈"],
          [
            ["To find a new job in Japan", "为了在日本找一份新工作"],
            ["Because her tutor asked her to", "因为她的辅导老师让她学"],
          ],
          [
            "The passage says she \"could never really talk to her daughter's children, because they speak Japanese and she didn't. So she decided to learn it.\"",
            "她的外孙们说日语，她听不懂，所以决定学日语。",
          ],
        ],
        [
          ["What was Kenji's advice?", "健二给了什么建议？"],
          ["Learn ten words a day and repeat them before sleep", "每天学十个词，睡前复习"],
          [
            ["Study for many hours every night", "每天晚上学习好几个小时"],
            ["Never make a mistake in class", "上课时绝不犯错"],
          ],
          ['Kenji says: "Learn ten words a day, and repeat them before you go to sleep."', "他还让她别担心犯错，因为人人都会犯错。"],
        ],
        [
          ["What is the main idea of Elena's story?", "埃琳娜的故事主要想说明什么？"],
          ["You are never too old to learn", "学习永远不嫌晚"],
          [
            ["Japanese is easy for older people", "日语对老年人来说很容易"],
            ["Young students always learn faster", "年轻学生总是学得更快"],
          ],
          ['Elena ends with the lesson of her story: "you are never too old to learn."', "故事的最后一句点明了主旨：活到老，学到老。"],
        ],
      ],
    }),
    passage({
      id: "b1-education-why-we-forget",
      title: ["Why We Forget", "我们为什么会忘记"],
      body: `Have you ever studied hard for a test and then forgotten almost everything a week later? You are not alone. Scientists have studied memory for more than a hundred years, and they have found that we forget new information very quickly.

More than a hundred and forty years ago, a German scientist called Hermann Ebbinghaus checked his own memory. He memorized hundreds of short words that had no meaning. Then he checked how many he could remember after an hour, a day and a week. What he found surprised him. After one hour, more than half of the words were gone. After a day, he remembered only about a third of them.

Why does this happen? Every day we see and hear thousands of things, and most of them do not matter. Our memory cannot keep everything, so it keeps what we use and lets the rest go.

The good thing is that we can forget less. Ebbinghaus found that repeating helps. When he went back to the words a day later, he learned them again faster, and he forgot them more slowly. Each time he repeated them, they stayed in his memory longer.

Today, many students learn in this way. They revise new material after one day, then after three days, then after a week. Sleep matters too. While we sleep, our memory works on what we have learned during the day. So if you stay up all night before an exam, you might remember less, not more.

Forgetting is not a problem with your memory; it is how memory works. The important thing is to come back to what you learn, again and again.`,
      grammar: [tenses],
      names: ["German", "Hermann", "Ebbinghaus"],
      questions: [
        [
          ["What did Ebbinghaus find after one hour?", "艾宾浩斯发现一小时后会怎样？"],
          ["More than half of the words were gone", "一半以上的词已经忘了"],
          [
            ["He remembered almost all of the words", "他几乎记得所有的词"],
            ["He remembered only a third of the words", "他只记得三分之一的词"],
          ],
          [
            'The passage says: "After one hour, more than half of the words were gone." Only a third were left after a day.',
            "一小时后忘了一半以上；一天后只剩约三分之一。",
          ],
        ],
        [
          ["Why does our memory let things go, according to the passage?", "根据文章，记忆为什么会放掉一些东西？"],
          ["Most of what we see and hear does not matter", "我们看到听到的大多数东西并不重要"],
          [
            ["We sleep too little", "我们睡得太少"],
            ["We learn too many languages", "我们学了太多种语言"],
          ],
          [
            'The passage says: "most of them do not matter. Our memory cannot keep everything, so it keeps what we use and lets the rest go."',
            "记忆装不下一切，所以只留下我们用得到的。",
          ],
        ],
        [
          ["What does the passage suggest to remember more?", "文章建议怎样记得更多？"],
          ["Revise after a day, three days and a week", "隔一天、三天、一周各复习一次"],
          [
            ["Stay up all night before the exam", "考试前熬一个通宵"],
            ["Learn everything once, very carefully", "认真地把一切只学一遍"],
          ],
          [
            "Coming back to what you learn helps it stay longer; staying up all night may make you remember less.",
            "反复回顾所学的内容能让记忆更持久；通宵反而可能记得更少。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-education-a-school-without-exams",
      title: ["A School Without Exams", "没有考试的学校"],
      body: `Riverside School, in a small town in Norway, has not given its pupils any exams for ten years. Pupils do not get grades or marks either. So how do the teachers know if the pupils are learning?

Every pupil works on projects. Last term, one class studied the river near the school. The pupils took photos of the birds and fish, checked the water, and talked to farmers about how the river has changed. At the end of the term, they gave a presentation to their parents and to people from the town.

The teachers write notes about the progress of each pupil: what they are good at, where they need more effort, and what they should try next. Pupils also write about their own work. "At my old school I memorized things for tests and forgot them a week later," says Ida, who is fourteen. "Here I have learned how to ask questions and find the answers myself."

Not everyone agrees with this way of learning. Some parents worry that their children will have problems later, when they go to university and have to pass exams. "My son is confident and creative," says one father, "but can he write an essay in two hours with no help?"

The principal, Anders Berg, understands the worry. "We are not against exams," he says. "Our older pupils practice them before they leave. But we believe that learning is more than a mark on a piece of paper." So far, most pupils who have left Riverside have done well at university.`,
      grammar: [tenses],
      names: ["Riverside", "Norway", "Ida", "Anders", "Berg"],
      questions: [
        [
          ["How do the pupils of Riverside show what they have learned?", "河畔学校的学生怎样展示所学？"],
          ["With projects and presentations", "通过项目和展示"],
          [
            ["With exams at the end of each term", "通过每学期末的考试"],
            ["With grades from their parents", "通过父母给的分数"],
          ],
          [
            'The passage says: "Every pupil works on projects", and at the end of the term "they gave a presentation".',
            "学校没有考试和分数，学生做项目，学期末做展示。",
          ],
        ],
        [
          ["What worries some parents?", "一些家长担心什么？"],
          ["Their children may have problems with exams later", "孩子以后考试可能会有困难"],
          [
            ["Their children do not like the river project", "孩子不喜欢河流项目"],
            ["The teachers do not write notes", "老师不写评语"],
          ],
          [
            'Some parents worry that their children "will have problems later, when they go to university and have to pass exams."',
            "家长担心孩子上大学后要考试时会吃亏。",
          ],
        ],
        [
          ["What does the principal believe?", "校长相信什么？"],
          ["Learning is more than a mark on paper", "学习不只是纸上的一个分数"],
          [
            ["Exams are always bad for pupils", "考试对学生总是有害"],
            ["Older pupils do not need to practice exams", "高年级学生不需要练习考试"],
          ],
          [
            'Anders Berg says: "We are not against exams... But we believe that learning is more than a mark on a piece of paper."',
            "他并不反对考试，高年级学生也会练习考试。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-education-the-scholarship-letter",
      title: ["The Scholarship Letter", "奖学金通知"],
      body: `Hi Tom,

How are you? I'm sorry I haven't written for so long. The last two months have been really busy, but something exciting has happened, and you are the first person I want to tell.

Do you remember the scholarship I told you about? It's for students who want to study engineering at the University of Toronto. I wrote an essay for it in March and sent it with my grades and a note from my physics teacher. Then in April I had an interview online. I was so nervous that I forgot my own address! I was sure I had failed.

Yesterday morning an email arrived from the university. At first I didn't want to open it, and my hands were shaking. When I finally read it, I shouted so loudly that my mom ran in from the kitchen. I have won the scholarship! It will pay for my classes for four years, and for a room in a dormitory on campus.

I haven't decided everything yet. I have to choose my courses before the deadline in June, and I'm wondering whether to take chemistry or economics in my first semester. You studied economics, didn't you? What do you think? Was it difficult?

Why don't we meet before I leave? I'll be in your city for a week in July. We could go to that noodle restaurant near the station, and I'll pay this time!

Write soon,
Mei`,
      grammar: [tenses, "writing-an-informal-email"],
      names: ["Tom", "Toronto", "Mei"],
      questions: [
        [
          ["Why is Mei writing to Tom?", "梅为什么给汤姆写信？"],
          ["To tell him she has won a scholarship", "告诉他自己获得了奖学金"],
          [
            ["To tell him she failed her interview", "告诉他面试没通过"],
            ["To ask him for money for her classes", "向他借钱交学费"],
          ],
          [
            'Mei writes: "I have won the scholarship!" She thought she had failed, but she was wrong.',
            "她以为面试失败了，结果却获得了奖学金。",
          ],
        ],
        [
          ["What will the scholarship pay for?", "奖学金将支付什么？"],
          ["Her classes for four years and a room on campus", "四年的课程费用和校内的宿舍"],
          [
            ["Her flight to Toronto", "她飞往多伦多的机票"],
            ["Her first year only", "只有第一年的费用"],
          ],
          [
            'Mei writes: "It will pay for my classes for four years, and for a room in a dormitory on campus."',
            "奖学金包括四年学费和校园宿舍。",
          ],
        ],
        [
          ["What does Mei suggest at the end?", "梅在信的结尾提议什么？"],
          ["Meeting at a noodle restaurant in July", "七月在一家面馆见面"],
          [
            ["Studying economics together", "一起学经济学"],
            ["Visiting her in Toronto in June", "六月去多伦多看她"],
          ],
          [
            "Mei writes: \"Why don't we meet before I leave? I'll be in your city for a week in July.\"",
            "她会在七月去汤姆的城市，提议一起去车站附近的面馆。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-education-how-to-revise-for-a-test",
      title: ["How to Revise for a Test", "如何为考试复习"],
      body: `Many students revise by reading their notes again and again. It feels useful, but scientists who study learning say it is one of the weakest ways to learn. Here are five better ways to revise.

1. Test yourself. Close your book and try to write down everything you remember. Then check your notes and correct your mistakes. Remembering is hard work, and that effort is what helps your memory.

2. Start early. Do not leave everything until the night before the exam. Revise a little every day for two weeks, and come back to each part more than once. Short times of study on many days work better than one long night.

3. Explain it to someone. Imagine that you are the teacher. If you can explain an idea to a friend so that they understand it, you really know it. If you cannot, you have found what you need to study again.

4. Make a plan and focus. Write an outline of what you need to revise, and give each part a time. Switch off your phone while you study, because even one message on the screen can break your focus.

5. Look after yourself. Sleep, food and exercise matter as much as books. Take a short break every forty minutes: walk around, drink some water and rest your eyes.

Revising well is not about working longer. It is about working in a better way. Try one of these ideas this week, and see what happens to your marks.`,
      grammar: ["identifying-topic-sentences"],
      questions: [
        [
          ["What should you do after you test yourself?", "自测之后应该做什么？"],
          ["Check your notes and correct your mistakes", "对照笔记，改正错误"],
          [
            ["Read your notes again and again", "一遍又一遍地读笔记"],
            ["Stop studying for the day", "当天不再学习"],
          ],
          ['The first idea says: "Then check your notes and correct your mistakes."', "第一条方法：自测后对照笔记改错。"],
        ],
        [
          ["Why does explaining an idea to a friend help?", "为什么给朋友讲解有帮助？"],
          ["It shows you whether you really understand it", "它能让你知道自己是否真的懂了"],
          [
            ["Your friend can do the test for you", "朋友能替你考试"],
            ["It makes the exam shorter", "它能让考试变短"],
          ],
          [
            'The passage says: "If you can explain an idea to a friend so that they understand it, you really know it. If you cannot, you have found what you need to study again."',
            "讲得出来说明真懂了，讲不出来就知道该复习什么。",
          ],
        ],
        [
          ["What is the main idea of the article?", "这篇文章的主旨是什么？"],
          ["Revise in a better way, not for longer", "用更好的方法复习，而不是复习更久"],
          [
            ["Reading notes is the best way to revise", "读笔记是最好的方法"],
            ["Phones help you revise", "手机能帮你复习"],
          ],
          [
            'The article ends: "Revising well is not about working longer. It is about working in a better way."',
            "结尾一句点明主旨：复习的关键在于方法。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-education-two-ways-to-learn-math",
      title: ["Two Ways to Learn Math", "学数学的两种方法"],
      body: `Leo and Sam are classmates, and both of them are good at math. But they learn it in very different ways.

Leo likes to understand why. When his teacher shows the class a new way to solve a problem, he wants to know where it comes from. He draws pictures, tries examples and asks questions until he really understands. At first he is slow. On a test with many short questions, he sometimes runs out of time. But when a problem is new and difficult, he can usually solve it, because he can see how the parts connect.

Sam prefers practice. He memorizes the way to do it and then does fifty exercises, one after another, until he can do them without thinking. He is fast, and he almost never makes mistakes with numbers. But when a question looks different from the exercises in the book, he sometimes doesn't know where to begin.

Their teacher, Ms. Okafor, believes that both ways are important. "If you only practice, you can follow the rules, but you can't think about them," she says. "If you only try to understand, you know the idea, but you are too slow to use it." So in her class, students first discuss a new idea in groups, and then they practice it.

This term, Leo and Sam have started to study together. Leo explains the ideas, and Sam shows him faster ways to work out the answers. Both of them have improved. "I thought Leo was just slow," Sam says, laughing. "Now I realize he was thinking."`,
      grammar: [tenses],
      names: ["Leo", "Sam", "Ms", "Okafor"],
      questions: [
        [
          ["How does Leo learn math?", "利奥怎样学数学？"],
          ["He asks why and tries examples until he understands", "他追问原因、尝试例子，直到弄懂"],
          [
            ["He does fifty exercises without thinking", "他不假思索地做五十道练习"],
            ["He memorizes the answers in the book", "他背下书里的答案"],
          ],
          [
            'The passage says Leo "draws pictures, tries examples and asks questions until he really understands."',
            "做大量练习的是萨姆，不是利奥。",
          ],
        ],
        [
          ["When does Sam have a problem?", "萨姆在什么时候会遇到困难？"],
          ["When a question looks different from the exercises", "题目和练习不一样的时候"],
          [
            ["When a test has many short questions", "考试有很多简短题目的时候"],
            ["When he works with numbers", "做数字计算的时候"],
          ],
          [
            'The passage says: "when a question looks different from the exercises in the book, he sometimes doesn\'t know where to begin."',
            "题目很多时出问题的是利奥；萨姆计算很少出错。",
          ],
        ],
        [
          ["What does Ms. Okafor believe?", "奥卡福老师相信什么？"],
          ["Practice and understanding are both important", "练习和理解都很重要"],
          [
            ["Practice is more important than understanding", "练习比理解更重要"],
            ["Students should always work alone", "学生应该总是独立学习"],
          ],
          [
            'She "believes that both ways are important", so her students discuss a new idea first and then practice it.',
            "她的课先分组讨论，再做练习。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-education-life-in-a-dormitory",
      title: ["Life in a Dormitory", "宿舍生活"],
      body: `When I left home to study biology at university, I had never shared a room with another person. Now I have lived in a dormitory for a whole semester, and I have learned a lot, and not only about biology.

My room is small. There are two beds, two desks, two cupboards and one window. I share it with a girl called Priya, who studies law. In the first week we didn't talk much. She went to bed at ten; I liked to study until midnight with my lamp on. She was upset, and I felt bad. So we sat down and made some rules: no lights after eleven from Monday to Thursday, no phone calls in the room after ten, and we clean the room together on Sundays. After that, everything was easier, and now we are good friends.

There are forty students on our floor, and we share a kitchen and two bathrooms. The kitchen is the heart of the dormitory. Someone is always cooking something, and people stop to chat. I have tasted food from ten different countries this semester. On Friday nights we sometimes have a party, and the music is very loud.

Of course, there are problems too. The internet is slow, the bathrooms are always busy in the morning, and someone keeps taking my milk from the kitchen. Some nights it is too noisy to concentrate, so I go to the library.

But I am glad I chose to live on campus. I have become more independent and more responsible. I cook for myself, I wash my own clothes, and I have made friends who will be my friends for life.`,
      grammar: [tenses],
      names: ["Priya"],
      questions: [
        [
          ["What problem did the writer and Priya have at first?", "作者和普丽娅一开始有什么问题？"],
          ["Priya went to bed early, and the writer studied late with a light on", "普丽娅睡得早，作者却开着灯学到很晚"],
          [
            ["Priya played loud music at night", "普丽娅晚上放很响的音乐"],
            ["They did not want to clean the kitchen", "她们都不想打扫厨房"],
          ],
          [
            'The writer says: "She went to bed at ten; I liked to study until midnight with my lamp on."',
            "她们定了规矩之后，一切就容易多了。",
          ],
        ],
        [
          ["Why does the writer call the kitchen the heart of the dormitory?", "作者为什么说厨房是宿舍的中心？"],
          ["People cook there and stop to chat", "大家在那里做饭、停下来聊天"],
          [
            ["It is the only quiet room", "那是唯一安静的房间"],
            ["It is where students study", "那是学生学习的地方"],
          ],
          ['The passage says: "Someone is always cooking something, and people stop to chat."', "作者在厨房尝到了十个国家的食物。"],
        ],
        [
          ["How has the writer changed?", "作者有了什么变化？"],
          ["She has become more independent and responsible", "她变得更独立、更有责任感"],
          [
            ["She has become lazier", "她变得更懒了"],
            ["She has stopped studying biology", "她不再学生物了"],
          ],
          [
            'The writer says: "I have become more independent and more responsible. I cook for myself, I wash my own clothes."',
            "她自己做饭、洗衣服，还交到了一辈子的朋友。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-education-curious-minds",
      title: ["Curious Minds", "好奇的头脑"],
      body: `Young children ask a lot of questions. Some scientists believe that a child of four asks about a hundred questions a day. Why is the sky blue? Where does the sun go at night? Why can't dogs talk? Parents sometimes get tired of all these questions, but each one is a small piece of learning.

As children get older, many of them stop asking. At school they learn that the teacher asks the questions and the pupils give the answers. They worry that a question will make them look less clever than their classmates. So they stay quiet, even when they do not understand.

This is a problem, because wondering is where knowledge begins. Many great inventors and scientists were people who never stopped asking "why?" They noticed something that didn't fit what they already knew, and they didn't stop until they understood it.

How can we keep that wonder alive? Teachers can help by asking questions that have more than one answer, and by giving pupils time to think before the first answer. They can also thank pupils for good questions, not only for right answers. Parents can say, "That's a good question. I don't know. Let's find out together."

And all of us can try something small. Every day, notice one thing that you don't understand, and ask a question about it. You might be surprised where the answer takes you.`,
      questions: [
        [
          [
            "How many questions does a child of four ask a day, according to some scientists?",
            "根据一些科学家的说法，四岁的孩子一天问多少个问题？",
          ],
          ["About a hundred", "大约一百个"],
          [
            ["About ten", "大约十个"],
            ["About a thousand", "大约一千个"],
          ],
          ['The passage says: "a child of four asks about a hundred questions a day."', "文章说四岁的孩子一天大约问一百个问题。"],
        ],
        [
          ["Why do many older pupils stop asking questions?", "为什么很多大一点的学生不再提问？"],
          ["They worry about looking less clever", "他们担心显得不够聪明"],
          [
            ["They already know all the answers", "他们已经知道所有答案"],
            ["Their teachers do not allow it", "老师不允许他们提问"],
          ],
          [
            'The passage says: "They worry that a question will make them look less clever than their classmates."',
            "所以即使不懂，他们也保持沉默。",
          ],
        ],
        [
          ["What can parents say, according to the passage?", "根据文章，家长可以怎么说？"],
          ["\"I don't know. Let's find out together.\"", "“我不知道。我们一起去查吧。”"],
          [
            ['"Stop asking so many questions."', "“别问那么多问题了。”"],
            ['"Ask your teacher, not me."', "“去问老师，别问我。”"],
          ],
          [
            "The passage says parents can say: \"That's a good question. I don't know. Let's find out together.\"",
            "家长可以和孩子一起寻找答案。",
          ],
        ],
      ],
    }),
  ],
};
