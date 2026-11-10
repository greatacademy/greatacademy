// The reading unit of the A2 theme Jobs and Dreams: people at work, how they got there and what they hope for.

import { type ReadingUnitDef, t } from "@ga/content";
import { passageMaker } from "../pre-a1/reading-kit.ts";
import { readingWords } from "./reading-words.ts";

const questionsGrammar = "subject-and-object-questions";

const passage = passageMaker(readingWords, ["a2-words-jobs-2", "a2-words-work-life", "a2-words-ambitions", questionsGrammar]);

/** readingJobs is the reading unit of the theme Jobs and Dreams. */
export const readingJobs: ReadingUnitDef = {
  id: "a2-reading-jobs",
  title: t("Jobs and Dreams", "职业与梦想"),
  passages: [
    passage({
      id: "a2-jobs-a-pilots-long-day",
      title: ["A Pilot's Long Day", "飞行员漫长的一天"],
      body: `Sara is a pilot. She flies big planes for a company in Canada, and yesterday was a long day.

She woke up at four in the morning. She washed quickly, put on her uniform and drove to the airport. At five she met the other pilot and the rest of the staff. Together they checked the weather and the plan for the day: three flights, to New York, then to Chicago, and then home.

The first flight was easy. The weather was good, and the passengers were quiet. But on the second flight there was a storm near Chicago. The plane shook, and some passengers were scared. Sara stayed calm and spoke to them: "Please stay in your seats. We will be on the ground in twenty minutes." She brought the plane down, and everybody was safe. The passengers cheered.

Sara got home at ten in the evening, very tired. "Who wants to be a pilot?" people sometimes ask her. "It is hard work, and the hours are long," she says. "But when I see the sunrise from the sky, I know I have the best job in the world."`,
      grammar: [questionsGrammar, "past-simple-irregular", "adverbs-of-manner"],
      names: ["Sara", "Canada", "New", "York", "Chicago"],
      questions: [
        [
          ["What time did Sara wake up?", "萨拉几点起床的？"],
          ["At four in the morning", "早上四点"],
          [
            ["At five in the morning", "早上五点"],
            ["At ten in the evening", "晚上十点"],
          ],
          ['The passage says: "She woke up at four in the morning."', "她四点起床，五点她和同事见面，晚上十点才到家。"],
        ],
        [
          ["What happened on the second flight?", "第二趟航班发生了什么？"],
          ["There was a storm, and the plane shook", "遇到暴风雨，飞机颠簸"],
          [
            ["A passenger was ill", "一位乘客生病了"],
            ["The plane was late", "飞机晚点了"],
          ],
          [
            'The passage says: "on the second flight there was a storm near Chicago. The plane shook."',
            "第二趟航班在芝加哥附近遇到暴风雨。",
          ],
        ],
        [
          ["Why does Sara love her job?", "萨拉为什么热爱她的工作？"],
          ["She sees the sunrise from the sky", "她能在天上看日出"],
          [
            ["The hours are short", "工作时间短"],
            ["It is easy", "工作很轻松"],
          ],
          [
            'Sara says: "when I see the sunrise from the sky, I know I have the best job in the world."',
            "工作辛苦，但在天上看日出让她觉得这是最好的工作。",
          ],
        ],
      ],
    }),
    passage({
      id: "a2-jobs-the-chef-who-was-a-scientist",
      title: ["The Chef Who Was a Scientist", "当过科学家的厨师"],
      body: `When Hana was at university, she studied science. She was very good at it, and after she graduated she got a job as a scientist at a big food company. Her job was to find out why some foods taste better than others.

Hana earned a good salary, but she wasn't happy. She spent all day with computers and numbers. "I want to cook food, not study it," she told her husband.

So at thirty-two she did something difficult: she left her job and went back to college to study cooking. Her family was worried. "What will you do if you fail?" her father asked. Hana didn't know, but she wanted to try.

After the course she worked in a restaurant kitchen for three years. The work was hard and the salary was low, but she learned a lot. Then she opened her own small restaurant.

Today Hana's restaurant is one of the most famous in the city. Her science helps her every day. She knows how hot the oil must be and how long to cook the meat. "My two careers are really one career," she says with a smile.`,
      grammar: ["verbs-followed-by-to", "past-simple-irregular", "will-for-the-future"],
      names: ["Hana", "Hana's"],
      questions: [
        [
          ["What was Hana's first job?", "哈娜的第一份工作是什么？"],
          ["A scientist at a food company", "食品公司的科学家"],
          [
            ["A waiter in a restaurant", "餐馆服务员"],
            ["A teacher at a college", "大学老师"],
          ],
          ['The passage says: "she got a job as a scientist at a big food company."', "哈娜毕业后在一家大食品公司当科学家。"],
        ],
        [
          ["Why wasn't Hana happy in her first job?", "哈娜为什么在第一份工作中不开心？"],
          ["She wanted to cook food, not study it", "她想做饭，而不是研究食物"],
          [
            ["Her salary was low", "工资低"],
            ["Her boss was angry", "老板很凶"],
          ],
          ['Hana says: "I want to cook food, not study it."', "她工资不错，但整天对着电脑和数字，她想亲自做饭。"],
        ],
        [
          ["How does science help Hana now?", "科学现在怎样帮助哈娜？"],
          ["She knows how hot the oil must be and how long to cook the meat", "她知道油要多热、肉要做多久"],
          [
            ["She sells her food to scientists", "她把食物卖给科学家"],
            ["She uses computers in her kitchen", "她在厨房用电脑"],
          ],
          [
            'The passage says: "She knows how hot the oil must be and how long to cook the meat."',
            "她的科学知识帮助她精确掌握火候和时间。",
          ],
        ],
      ],
    }),
    passage({
      id: "a2-jobs-my-first-interview",
      title: ["My First Interview", "我的第一次面试"],
      body: `Last summer I wanted a part-time job, so I sent my information to a bookstore near my home. Two days later the manager called me. "Can you come for an interview on Friday?" she asked.

I was very nervous. I had never had an interview before. My mom helped me to get ready. "Think about the questions they will ask," she said. "Why do you want this job? What skills do you have? What are you good at?" I wrote my answers on a piece of paper and practiced them in my bedroom.

On Friday I put on my best shirt and arrived ten minutes early. The manager, Mrs. Okafor, was friendly. She asked me about school, about my favorite books and about my experience. I didn't have much experience, but I told her that I love books and that I am hard-working.

Then she asked a difficult question: "Who usually helps customers at your school library?" I said, "I do. I help there every Wednesday." She smiled.

The next day she called me again. I got the job! I learned that the most important thing in an interview is to be yourself.`,
      grammar: [questionsGrammar, "present-perfect-with-ever-and-never", "verbs-followed-by-to"],
      names: ["Mrs", "Okafor"],
      questions: [
        [
          ["Who helped the writer to get ready for the interview?", "谁帮作者准备面试？"],
          ["The writer's mom", "作者的妈妈"],
          [
            ["The manager", "经理"],
            ["A teacher", "一位老师"],
          ],
          ['The passage says: "My mom helped me to get ready."', "妈妈帮作者想可能的问题并练习回答。"],
        ],
        [
          ["What did the writer tell the manager?", "作者告诉经理什么？"],
          ["That they love books and are hard-working", "自己热爱书籍而且很勤奋"],
          [
            ["That they have a lot of experience", "自己经验丰富"],
            ["That they need a lot of money", "自己需要很多钱"],
          ],
          ['The passage says: "I told her that I love books and that I am hard-working."', "作者经验不多，但说了自己爱书又勤奋。"],
        ],
        [
          ["What did the writer learn?", "作者学到了什么？"],
          ["The most important thing is to be yourself", "最重要的是做你自己"],
          [
            ["You should always arrive late", "应该总是迟到"],
            ["You need a lot of experience", "需要很多经验"],
          ],
          ['The passage says: "the most important thing in an interview is to be yourself."', "作者的体会是面试时要做真实的自己。"],
        ],
      ],
    }),
    passage({
      id: "a2-jobs-from-waiter-to-manager",
      title: ["From Waiter to Manager", "从服务员到经理"],
      body: `When Tom was eighteen, he didn't want to go to university. He wanted to earn money, so he got a job as a waiter in a big hotel restaurant.

The work was hard. He worked long hours, often until midnight, and he was on his feet all day. Some customers were rude, and the boss was often angry. But Tom was hard-working, and he always smiled at the guests. He learned the names of the customers who came often and remembered what they liked to eat.

After two years, the manager of the restaurant noticed him. "You are good with people," she said. "Do you want to learn more?" She gave Tom more jobs: he taught new waiters, ordered food and planned the hours of the staff. Tom got things wrong at first, but he improved quickly.

When the manager moved to another hotel, the company gave her job to Tom. He was only twenty-four. Some of his colleagues were older than him, and at first it wasn't easy. But they knew him, and they knew he was fair.

Today Tom is the manager of three restaurants. "Many people think that working as a waiter is not a real career," he says. "They are wrong. I learned everything I know about my job when I was carrying plates."`,
      grammar: ["past-simple-irregular", "comparatives-and-superlatives", "subordinating-conjunctions"],
      names: ["Tom"],
      questions: [
        [
          ["Why did Tom get a job at eighteen?", "汤姆为什么十八岁就去工作？"],
          ["He wanted to earn money", "他想挣钱"],
          [
            ["His family told him to", "家人让他去"],
            ["He failed at university", "他大学没读好"],
          ],
          ['The passage says: "He wanted to earn money, so he got a job as a waiter."', "汤姆不想上大学，想挣钱，于是当了服务员。"],
        ],
        [
          ["What did the manager notice about Tom?", "经理注意到汤姆什么？"],
          ["He was good with people", "他擅长和人打交道"],
          [
            ["He was very fast", "他非常快"],
            ["He was a good cook", "他很会做饭"],
          ],
          ['The manager says: "You are good with people."', "汤姆总是对客人微笑，还记得常客的名字和喜好。"],
        ],
        [
          ["How old was Tom when he became the manager?", "汤姆当上经理时多大？"],
          ["Twenty-four", "二十四岁"],
          [
            ["Eighteen", "十八岁"],
            ["Twenty", "二十岁"],
          ],
          ['The passage says: "the company gave her job to Tom. He was only twenty-four."', "汤姆二十四岁就当上了经理。"],
        ],
      ],
    }),
    passage({
      id: "a2-jobs-firefighters-at-work",
      title: ["Firefighters at Work", "工作中的消防员"],
      body: `What do firefighters do all day? Most people think they only stop fires. But fires are only a small part of their work.

Ali is a firefighter in a big city. He works for twenty-four hours, then he has two days at home. During his twenty-four hours, he and his colleagues live at the fire station. They cook together, eat together and sleep there.

On most days, they get about eight calls. Some are fires, but many are car accidents, people who are ill, or people who can't get out of a lift. Once Ali helped a cat that was too scared to come down from a tree. "The cat didn't even say thanks," he says with a laugh.

When there are no calls, the firefighters are not resting. They check their machines and tools, exercise and visit schools. At the schools, they teach children what to do if there is a fire at home.

Who can become a firefighter? "You have to be strong and healthy," Ali says. "But the most important skill is to stay calm. People are afraid, and they need someone who isn't."`,
      grammar: [questionsGrammar, "have-to", "too-and-enough"],
      names: ["Ali"],
      glossed: ["fire", "fires"],
      questions: [
        [
          ["How long does Ali work before he has two days at home?", "阿里工作多久后能回家休息两天？"],
          ["Twenty-four hours", "二十四小时"],
          [
            ["Eight hours", "八小时"],
            ["Two days", "两天"],
          ],
          ['The passage says: "He works for twenty-four hours, then he has two days at home."', "阿里工作二十四小时，然后休息两天。"],
        ],
        [
          ["What do the firefighters do when there are no calls?", "没有求助电话时消防员做什么？"],
          ["Check their machines, practice and visit schools", "检查设备、训练、去学校"],
          [
            ["They sleep all day", "整天睡觉"],
            ["They go home", "回家"],
          ],
          ['The passage says: "They check their machines and tools, exercise and visit schools."', "没有出警时他们也不休息。"],
        ],
        [
          ["What is the most important skill for a firefighter, says Ali?", "阿里说消防员最重要的技能是什么？"],
          ["To stay calm", "保持冷静"],
          [
            ["To run fast", "跑得快"],
            ["To cook well", "做饭好"],
          ],
          ['Ali says: "the most important skill is to stay calm."', "人们在害怕时，需要一个不慌张的人。"],
        ],
      ],
    }),
    passage({
      id: "a2-jobs-a-dream-that-came-true",
      title: ["A Dream That Came True", "梦想成真"],
      body: `When Mei was seven, her grandpa gave her an old guitar. From that day, she had one dream: she wanted to become a singer.

Her parents loved her music, but they were worried. "It is very difficult to succeed as a singer," her mother said. "You should study something useful too." So Mei studied hard at school, and in the evenings she practiced the guitar and wrote songs.

At eighteen she went to university to study science. But she never forgot her dream. Every weekend she sang in small coffee shops. Sometimes only five people listened. Sometimes the people didn't even look at her. She failed many times, and she often wanted to stop.

Then one evening a man from a music company heard her in a coffee shop. He liked her songs and asked her to sing them for his company. A year later Mei's first song came out, and soon millions of people were listening to it on their phones.

Today Mei sings in concerts all over the world. "Who helped you most?" someone asked her in an interview last month. Mei thought about it. "My grandpa," she said. "He gave me the guitar. And he told me never to give up."`,
      grammar: [questionsGrammar, "past-simple-irregular", "should-and-must"],
      names: ["Mei", "Mei's"],
      questions: [
        [
          ["What did Mei's grandpa give her?", "梅的爷爷给了她什么？"],
          ["An old guitar", "一把旧吉他"],
          [
            ["A piano", "一架钢琴"],
            ["A computer", "一台电脑"],
          ],
          ['The passage says: "her grandpa gave her an old guitar."', "七岁时爷爷给了她一把旧吉他。"],
        ],
        [
          ["What did Mei study at university?", "梅在大学学什么？"],
          ["Science", "理科"],
          [
            ["Music", "音乐"],
            ["Business", "商科"],
          ],
          ['The passage says: "At eighteen she went to university to study science."', "她在大学学理科，但周末去咖啡馆唱歌。"],
        ],
        [
          ["Who heard Mei sing in a coffee shop?", "谁在咖啡馆听到了梅唱歌？"],
          ["A man from a music company", "一位音乐公司的人"],
          [
            ["Her grandpa", "她的爷爷"],
            ["A teacher", "一位老师"],
          ],
          [
            'The passage says: "one evening a man from a music company heard her in a coffee shop."',
            "音乐公司的人听了她的歌，请她录唱片。",
          ],
        ],
      ],
    }),
    passage({
      id: "a2-jobs-the-mechanics-daughter",
      title: ["The Mechanic's Daughter", "机修工的女儿"],
      body: `Lucy's father is a mechanic. When she was little, she spent every Saturday with him at his small shop, where he fixed cars. Other girls played with toys, but Lucy played with tools.

When she was twelve, she could change a wheel and check the oil faster than the colleagues of her father. "You're a better mechanic than me!" her father said with a laugh.

At school Lucy was good at math and science, and her teachers told her to become an engineer. She studied science at university. She was one of only five women in her class of sixty, but she was the best student in her year.

After she graduated, Lucy got a job at a big car company. She builds electric cars. Her team has just finished a new car that can travel from one city to another on one charge.

Last month the company showed the car for the first time. Lucy's father was there. When the car came out, he stood up and cheered louder than everybody.

"Who taught you everything?" a colleague asked her. Lucy looked at her father. "He did," she said. "In a small shop, on Saturdays."`,
      grammar: [questionsGrammar, "present-perfect-with-just-already-and-yet", "comparatives-and-superlatives"],
      names: ["Lucy", "Lucy's"],
      questions: [
        [
          ["Where did Lucy spend her Saturdays when she was little?", "露西小时候星期六在哪里度过？"],
          ["At her father's shop", "在爸爸的修车铺"],
          [
            ["At the park with other girls", "和其他女孩在公园"],
            ["At her grandmother's house", "在奶奶家"],
          ],
          [
            'The passage says: "she spent every Saturday with him at his small shop, where he fixed cars."',
            "露西每个星期六都在爸爸的修车铺度过。",
          ],
        ],
        [
          ["What does Lucy do now?", "露西现在做什么？"],
          ["She builds electric cars", "她制造电动汽车"],
          [
            ["She fixes cars in a small shop", "她在小店修车"],
            ["She teaches science", "她教科学"],
          ],
          ['The passage says: "She builds electric cars."', "露西在一家大汽车公司制造电动汽车。"],
        ],
        [
          ["Who taught Lucy everything, she says?", "露西说谁教会了她一切？"],
          ["Her father", "她的爸爸"],
          [
            ["Her teachers", "她的老师们"],
            ["Her colleagues", "她的同事们"],
          ],
          ['Lucy looked at her father. "He did," she said.', "这是对主语提问的问题：Who taught you? 答案是 He did。"],
        ],
      ],
    }),
    passage({
      id: "a2-jobs-jobs-that-robots-cant-do",
      title: ["Jobs That Robots Can't Do", "机器人做不了的工作"],
      body: `Robots and computers are doing more jobs every year. They build cars, answer phone calls, drive trains and even write stories. Many people are worried. Will there be any jobs for us in the future?

Scientists say that some jobs will probably be lost. But they also say that there are many jobs that robots can't do well, and these jobs will be important in the future.

First, jobs where you care for people. A robot can give a sick person a pill, but it can't really understand how the person feels. Nurses, doctors and teachers need to listen and to be kind.

Second, jobs where you make new things. Robots are good at following rules, but people are better at new ideas. Artists, writers and scientists will always be important.

Third, jobs where you work with your hands in different places every day. A mechanic or a firefighter has a different problem at every job, and that is very difficult for a robot.

So what should young people do? Scientists say: learn to work with other people, never stop learning, and use robots as tools, not as a problem.`,
      grammar: ["will-for-the-future", "should-and-must", "comparatives-and-superlatives"],
      questions: [
        [
          ["Why are many people worried?", "为什么很多人担心？"],
          ["Robots and computers are doing more jobs", "机器人和电脑做的工作越来越多"],
          [
            ["Robots are dangerous", "机器人很危险"],
            ["Robots are too expensive", "机器人太贵"],
          ],
          [
            'The passage says: "Robots and computers are doing more jobs every year... Many people are worried."',
            "人们担心将来没有工作可做。",
          ],
        ],
        [
          ["Why do nurses, doctors and teachers have jobs robots can't do?", "为什么护士、医生和老师的工作机器人做不了？"],
          ["They need to understand how people feel and to be kind", "他们要理解人的感受并且友善"],
          [
            ["They work at night", "他们晚上工作"],
            ["They use a lot of tools", "他们用很多工具"],
          ],
          [
            'The passage says a robot "can\'t really understand how the person feels. Nurses, doctors and teachers need to listen and to be kind."',
            "照顾人的工作需要倾听和善意。",
          ],
        ],
        [
          ["What do scientists say young people should do?", "科学家建议年轻人做什么？"],
          ["Work with others, keep learning and use robots as tools", "与人合作、不断学习、把机器人当工具"],
          [
            ["Stop using computers", "不再用电脑"],
            ["Build their own robots", "自己造机器人"],
          ],
          [
            'The passage says: "learn to work with other people, never stop learning, and use robots as tools, not as a problem."',
            "科学家的三条建议。",
          ],
        ],
      ],
    }),
  ],
};
