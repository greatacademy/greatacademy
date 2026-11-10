// The reading unit of the B1 theme Work and Careers: first jobs, changing careers, shifts, companies and retiring.

import { type ReadingUnitDef, t } from "@ga/content";
import { passageMaker } from "../pre-a1/reading-kit.ts";
import { readingWords } from "./reading-words.ts";

const usedTo = "used-to";
const continuous = "present-perfect-continuous";

const passage = passageMaker(readingWords, [
  "b1-words-applying",
  "b1-words-workplace",
  "b1-words-business",
  "b1-words-work-verbs",
  "b1-words-jobs-3",
  "b1-words-work-qualities",
  "b1-words-office",
  "b1-words-little-words-5",
  usedTo,
  continuous,
]);

/** readingWork is the reading unit of the theme Work and Careers. */
export const readingWork: ReadingUnitDef = {
  id: "b1-reading-work",
  title: t("Work and Careers", "工作与职业"),
  passages: [
    passage({
      id: "b1-work-the-first-day-at-a-new-job",
      title: ["The First Day at a New Job", "新工作的第一天"],
      body: `Dear Grandma,

I have just finished my first week at my new company, and I want to tell you all about it.

On Monday morning I woke up at five, two hours earlier than I needed to. I was so nervous that I couldn't eat breakfast. I arrived at the office forty minutes early, so I waited in a coffee shop across the street and read my contract again.

At nine o'clock the receptionist gave me a card for the door and took me to my department. My manager, Mrs. Okafor, is very professional, but she is also kind. She showed me my desk, my computer and a drawer full of folders. Then she gave me a schedule for the week. There was a meeting with clients, a short course about the computer tools we use, and a lot of reading.

The hardest part was remembering names. There are twenty-two people in my department, and by lunch I had forgotten almost all of them. Then a designer called Tom made me a list with a small drawing next to each name. I still have it on my desk.

On Wednesday I made my first mistake. I sent a document to the wrong client. I felt terrible, but Mrs. Okafor said, "Everyone does that once. Just tell me when it happens, and we will deal with it." That made me feel much better.

By Friday I had completed two small tasks on my own. I am tired, but I am happy. I think I chose the right job.

Love,
Amara`,
      grammar: ["present-perfect-or-past-simple"],
      names: ["Grandma", "Mrs", "Okafor", "Tom", "Amara"],
      questions: [
        [
          ["Why did Amara wait in a coffee shop on Monday morning?", "周一早上阿玛拉为什么在咖啡店等着？"],
          ["She arrived at the office too early", "她到办公室太早了"],
          [
            ["The office was closed for the day", "办公室那天关门了"],
            ["She wanted to eat a big breakfast", "她想吃一顿丰盛的早餐"],
          ],
          [
            'She "arrived at the office forty minutes early, so I waited in a coffee shop across the street". She was too nervous to eat.',
            "她提前四十分钟到了办公室，所以去街对面的咖啡馆等着；她紧张得吃不下早饭。",
          ],
        ],
        [
          ["How did Tom help Amara?", "汤姆是怎样帮助阿玛拉的？"],
          ["He made her a list of names with drawings", "他给她做了一张带小画的名单"],
          [
            ["He sent a document to a client for her", "他替她把文件发给了客户"],
            ["He taught her the new computer tools", "他教她使用新的电脑工具"],
          ],
          [
            "Amara could not remember the names of her colleagues, so Tom made her a list with a small drawing next to each name.",
            "阿玛拉记不住同事的名字，汤姆就给她做了一张名单，每个名字旁边画了一幅小画。",
          ],
        ],
        [
          ["What did Mrs. Okafor do after Amara's mistake?", "阿玛拉犯错后，奥卡福女士是怎么做的？"],
          ["She told her that everyone makes it once", "她告诉阿玛拉每个人都会犯一次这种错"],
          [
            ["She was angry and gave her extra tasks", "她很生气，给了她额外的任务"],
            ["She asked her to call the client and say sorry", "她让阿玛拉给客户打电话道歉"],
          ],
          [
            'Mrs. Okafor said: "Everyone does that once. Just tell me when it happens, and we will deal with it."',
            "经理说人人都会犯一次这种错，只要告诉她，她们会一起处理，这让阿玛拉好受多了。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-work-why-people-change-careers",
      title: ["Why People Change Careers", "人们为什么转行"],
      body: `In the past, many people stayed in the same job for their whole life. A man who started work in a bank at eighteen often retired from the same bank at sixty-five. Today this happens much less often. Studies in many countries show that most people change jobs ten or more times, and many change their whole career at least once.

Why do they do it? The first reason is money. Some people realize that their industry does not pay well, or that the number of positions goes down every year. Others want a job with a better income, so they get new qualifications and move into a different field.

The second reason is feeling happy. A lawyer may earn a lot but feel bored and tired every day. An accountant may realize that she prefers working with people to working with numbers. Many people say they used to think that a good job was a job with a high salary. Now they think that a good job is one that they enjoy.

The third reason is change in the world itself. New machines and computers have taken the place of many jobs, and they have brought new ones that nobody had twenty years ago. Nobody was a programmer of phone apps in 1990.

Changing careers is not easy. It can mean studying again, earning less for a few years and starting again with the easiest tasks. But people who have done it often say it was the best thing they ever decided. As one engineer who became a teacher put it: "I used to wait for Friday all week. Now I don't even notice what day it is."`,
      grammar: [usedTo],
      questions: [
        [
          ["What was common in the past, according to the passage?", "根据文章，过去常见的是什么？"],
          ["Staying in the same job for life", "一辈子做同一份工作"],
          [
            ["Changing jobs ten or more times", "换十次或更多次工作"],
            ["Retiring before the age of fifty", "五十岁之前退休"],
          ],
          [
            'The passage begins: "In the past, many people stayed in the same job for their whole life."',
            "文章开头说，过去很多人一辈子只做同一份工作；如今换工作才更常见。",
          ],
        ],
        [
          ["Which reason for changing careers is about happiness?", "哪个转行理由与幸福感有关？"],
          ["A lawyer earns a lot but feels bored", "律师收入很高却觉得乏味"],
          [
            ["An industry has a smaller number of positions every year", "一个行业的职位每年都在减少"],
            ["New machines have taken the place of many jobs", "新机器取代了许多工作"],
          ],
          [
            "The second reason is feeling happy: a lawyer may earn a lot but feel bored, and an accountant may prefer working with people.",
            "第二个理由是幸福感，例如律师赚得多却每天觉得无聊；另外两个选项分别属于金钱和世界变化的理由。",
          ],
        ],
        [
          ["What does the engineer who became a teacher mean?", "那位前工程师的话是什么意思？"],
          ["He enjoys his new job much more", "他更喜欢现在的新工作"],
          [
            ["He works less as a teacher", "当老师后他工作时间更短"],
            ["He wants to be an engineer again", "他想再当工程师"],
          ],
          [
            'He "used to wait for Friday all week" because he was unhappy. Now he does not even notice what day it is, because he enjoys teaching.',
            "他以前整周盼着周五，现在连今天星期几都不在意，说明他很喜欢现在的工作。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-work-working-night-shifts",
      title: ["Working Night Shifts", "上夜班"],
      body: `While most of the city is sleeping, thousands of people are at work. Nurses look after patients in hospitals, drivers deliver food to shops, and workers clean offices and trains. Their shifts start in the evening and finish early in the morning.

Daniel Price has been working night shifts at a large hospital for six years. "People think it is quiet at night," he says, "but it isn't. Patients still need medicine, and emergencies happen at three in the morning too."

Night work has some good sides. The pay is usually higher, and there is less traffic on the way to work. Some people also like the calm. "There isn't a meeting every hour, and the managers are at home," Daniel laughs. "I can actually finish my tasks."

But it is not easy for the body. Our bodies expect to sleep when it is dark, and it is hard to sleep well during the day. Daniel used to wake up every afternoon feeling more tired than before. He also missed family dinners and weekends with friends.

Over the years he has learned a few things. He keeps his bedroom completely dark, he turns off his phone, and he eats a small meal before he goes to bed instead of a big one. On his days off, he tries not to change his sleeping times too much. "It is especially important to sleep and eat at the same times every day," he says. "Otherwise you feel like you are always flying to another country."

Would he change to day shifts? "Maybe one day," he says. "But for now, I like working while the city sleeps."`,
      grammar: [continuous, usedTo],
      names: ["Daniel", "Price"],
      questions: [
        [
          ["How long has Daniel been working night shifts?", "丹尼尔上夜班多久了？"],
          ["For six years", "六年"],
          [
            ["Since three in the morning", "从凌晨三点开始"],
            ["For six months", "六个月"],
          ],
          [
            'The passage says: "Daniel Price has been working night shifts at a large hospital for six years."',
            "现在完成进行时 has been working 加 for six years，表示他已经上了六年夜班，现在仍在上。",
          ],
        ],
        [
          ["Which is a benefit of night work, according to Daniel?", "丹尼尔认为夜班有什么好处？"],
          ["He can finish his tasks because there are not so many meetings", "会议少，他能把任务做完"],
          [
            ["It is easy to sleep well during the day", "白天很容易睡好"],
            ["He can have dinner with his family", "他可以和家人一起吃晚饭"],
          ],
          [
            'Daniel says: "There isn\'t a meeting every hour, and the managers are at home. I can actually finish my tasks." Sleeping in the day is hard, and he misses family dinners.',
            "丹尼尔说夜里会议和经理都少，他能真正完成工作；白天难以入睡、错过家庭晚餐都是夜班的坏处。",
          ],
        ],
        [
          ["Why does Daniel keep the same sleeping times on his days off?", "丹尼尔为什么在休息日也保持相同的睡眠时间？"],
          ["Changing them makes him feel as if he is always traveling", "改变作息会让他感觉总像在倒时差"],
          [
            ["His manager tells him to do it", "他的经理要求他这样做"],
            ["He works at the hospital on those days", "那些天他也在医院上班"],
          ],
          [
            'He says: "Otherwise you feel like you are always flying to another country", that is, as if the body never knows what time it is.',
            "他说如果不这样，就感觉自己总是在飞往另一个国家，身体一直分不清时间。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-work-a-company-that-grew-from-a-garage",
      title: ["A Company That Grew from a Garage", "从车库起家的公司"],
      body: `In 2009 Sofia Mendes lost her job as a secretary. She was thirty-four, she had two small children and very little money. "I was scared," she remembers. "But I also had an idea."

Sofia had always loved making soap. She used to make it in her kitchen as gifts for friends, with oils, flowers and honey from the farm of her parents. Her friends kept asking for more, and some of them wanted to pay. So she decided to turn her hobby into a business.

She had no office and no shop, only a garage, the small building next to the house where the family kept its car. She moved the car into the street, put two long tables in the garage and started work. Every morning she took the children to school and then made soap until three o'clock. In the evenings she sold it online and at weekend markets.

The first year was hard. She made a loss, and she often worked until midnight. But slowly people began to believe in the brand. A shop in the city ordered five hundred pieces, then a thousand. In 2012 she employed her first two workers.

Today the company has its headquarters in a modern building, sixty employees and customers in twelve countries. Sofia is the manager, but she still makes the first piece of every new product herself.

"People ask me about my plan," she says. "To be honest, I didn't have one. I just made something good, I was honest with my customers, and I never stopped working."`,
      grammar: [usedTo],
      names: ["Sofia", "Mendes"],
      glossed: ["garage", "soap"],
      questions: [
        [
          ["How did Sofia start making soap?", "索菲娅是怎样开始做肥皂的？"],
          ["As a hobby, making presents for friends", "作为爱好，给朋友做礼物"],
          [
            ["In a course at a business school", "在商学院的课程上"],
            ["As a secretary in a soap company", "在一家肥皂公司当秘书"],
          ],
          [
            'The passage says: "She used to make it in her kitchen as gifts for friends." The business grew from this hobby.',
            "她以前在厨房里做肥皂送给朋友，生意是从这个爱好发展起来的。",
          ],
        ],
        [
          ["What happened in her first year of business?", "她做生意的第一年怎么样？"],
          ["She lost money and worked very late", "她亏了钱，还工作到很晚"],
          [
            ["She employed sixty workers", "她雇了六十名员工"],
            ["A shop ordered a thousand bars at once", "一家商店一下子订了一千块"],
          ],
          [
            'The passage says: "The first year was hard. She made a loss, and she often worked until midnight." The big orders came later.',
            "第一年她亏损了，常常工作到半夜；大订单和更多员工都是后来的事。",
          ],
        ],
        [
          ["What does Sofia say about her success?", "索菲娅怎样谈论自己的成功？"],
          ["She had no plan, but she made a good product and worked hard", "她没有计划，但产品好，而且一直努力"],
          [
            ["She followed a careful business plan", "她按照一份周密的商业计划去做"],
            ["She was lucky to meet rich investors", "她幸运地遇到了有钱的投资人"],
          ],
          [
            'Sofia says: "To be honest, I didn\'t have one. I just made something good, I was honest with my customers, and I never stopped working."',
            "她坦言自己没有计划，只是做出好东西、诚实对待顾客、从不停止工作。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-work-what-employers-look-for",
      title: ["What Employers Look For", "雇主看重什么"],
      body: `Every year a large agency that helps people find work asks hundreds of employers the same question: when you have a vacancy, what do you look for in a candidate? The answers may surprise you.

Of course, qualifications matter. A pharmacist needs a degree, and an electrician needs a license. But most employers say that qualifications only get a candidate to the interview. After that, other things are more important.

The thing that employers talk about most often is that a worker must be reliable. They want people who arrive on time, finish tasks and do what they promise. "I can teach someone how to use our computer tools in a week," says the manager of a printing business. "I can't teach them to be punctual."

The second thing they want is a flexible worker. Plans change, clients change their plans, and a schedule that worked on Monday may not work on Wednesday. Employers want people who can handle these changes and stay calm.

Many employers also want people who are good at working with others. This means writing clear emails, listening carefully in a meeting and asking questions when something is not clear. A candidate who says "I don't know, but I will find out" often makes a better impression than one who says they know everything.

Finally, employers look for people who are motivated. In an interview they ask why you applied for the position and what you know about the company. Someone who has read about the business and prepared good questions shows that they really want the job.

So when you write your next application, think about examples that show you are reliable, flexible and motivated. A good example is better than a long list of words.`,
      glossed: ["agency", "license", "impression"],
      questions: [
        [
          ["What do most employers say about qualifications?", "大多数雇主怎样看待资格证书？"],
          ["They only get a candidate to the interview", "它们只能让应聘者进入面试"],
          [
            ["They are the most important thing of all", "它们是所有条件中最重要的"],
            ["They do not matter for any job", "它们对任何工作都不重要"],
          ],
          [
            '"Most employers say that qualifications only get a candidate to the interview. After that, other things are more important."',
            "资格证书很重要，但大多数雇主认为它只是进入面试的门槛，之后其他品质更重要。",
          ],
        ],
        [
          ["What does the manager of the printing business mean?", "印刷公司经理的话是什么意思？"],
          ["Skills can be taught, but punctual habits cannot", "技能可以教，守时却教不会"],
          [
            ["Their computer tools are too hard to learn", "他们的电脑工具太难学了"],
            ["Punctual people do not need training", "守时的人不需要培训"],
          ],
          [
            "He can teach someone the computer tools in a week, but he can't teach them to be on time. Being reliable must come from the person.",
            "他一周就能教会别人用软件，却没法教人守时，可靠的品质要靠本人。",
          ],
        ],
        [
          ["What advice does the passage end with?", "文章最后给出了什么建议？"],
          ["Give examples that show your qualities", "用例子来展示你的品质"],
          [
            ["Write a long list of your qualities", "列出一长串自己的优点"],
            ["Pretend to know everything in the interview", "面试时假装什么都懂"],
          ],
          [
            'The passage ends: "think about examples that show you are reliable, flexible and motivated. A good example is better than a long list of words."',
            "文章最后说，一个好例子胜过一长串形容词。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-work-working-from-home",
      title: ["Working from Home", "居家办公"],
      body: `Ten years ago, very few office workers did their jobs from home. Today millions of people work from their kitchen table, at least for part of the week. Is this a good change? We asked two people who have been doing it for a few years.

Priya, 29, programmer: "I love it. I used to spend almost two hours a day on the bus. Now I spend that time sleeping, cooking or going swimming. I'm also more efficient. In the office my colleagues came to my desk to chat all the time, but at home I can concentrate. We still have a meeting with the whole department every Monday, and that is enough for me. Besides, I save a lot of money on lunches and tickets."

Martin, 47, accountant: "At first I thought it was great. But after a year I started to feel lonely. I missed chatting with people at the coffee machine. Those small chats are actually important, because that is how you hear news and solve problems quickly. Also, work and home become the same place. My office is in the bedroom, so I check emails late at night. Now I go into the office three days a week, and I feel much better."

Scientists who study work say both of them are right. Working from home is better for some people and some tasks than for others. It works best when workers have a quiet place, a clear schedule and a manager who believes in them. Many companies have therefore chosen a mix: a few days at home and a few days together.`,
      grammar: [continuous, usedTo],
      names: ["Priya", "Martin"],
      questions: [
        [
          ["Why is Priya more efficient at home?", "为什么普丽娅在家工作效率更高？"],
          ["Nobody interrupts her, so she can concentrate", "没人打扰她，她能集中精力"],
          [
            ["She works much longer hours at home", "她在家工作的时间长得多"],
            ["Her manager checks her work every day", "她的经理每天检查她的工作"],
          ],
          [
            'Priya says: "In the office my colleagues came to my desk to chat all the time, but at home I can concentrate."',
            "她说在办公室同事总打断她，在家就能专心工作。",
          ],
        ],
        [
          ["What problem did Martin have?", "马丁遇到了什么问题？"],
          ["He felt lonely and worked late at night", "他感到孤独，而且深夜还在工作"],
          [
            ["He spent two hours a day on the bus", "他每天在公交车上花两个小时"],
            ["He could not use the computer tools at home", "他在家用不了电脑工具"],
          ],
          [
            "Martin missed talking to people, and because his office is in the bedroom, he checked emails late at night.",
            "马丁想念和同事聊天，而且办公桌在卧室里，深夜还在查邮件；坐车两小时是普丽娅以前的问题。",
          ],
        ],
        [
          ["What have many companies chosen, according to the passage?", "根据文章，很多公司选择了什么？"],
          ["A mix of days at home and days in the office", "一部分时间在家，一部分时间在公司"],
          [
            ["Working from home every day", "每天都在家工作"],
            ["Bringing everyone back to the office", "让所有人都回到办公室"],
          ],
          [
            'The passage ends: "Many companies have therefore chosen a mix: a few days at home and a few days together."',
            "因为居家办公适合一些人和一些任务，许多公司选择了混合模式。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-work-the-plumber-who-became-a-boss",
      title: ["The Plumber Who Became a Boss", "当上老板的水管工"],
      body: `When Joe Barnes left school at sixteen, his teachers did not expect much from him. He was bad at exams and he couldn't sit still. "Everyone said I should get a practical job," he says, "so I did."

He became an assistant to an old plumber called Mr. Hall. For four years he carried tools, repaired kitchens and bathrooms and cleaned up after jobs. He learned fast. Mr. Hall was hard on him but fair, and he taught Joe something that was not about water at all: "Always arrive when you say you will, and always tell the customer the real price."

At twenty-one Joe got his qualifications and started working on his own. He had a van, a small car with a lot of room for tools, a phone and a small book for his invoices. Customers liked him because he was punctual and honest, and they told their friends. Soon he had more work than he could handle, so he employed a second plumber, then a third.

Joe has been running his own business for eighteen years now. He employs twenty-five people: plumbers, electricians and a secretary who arranges the schedule. He spends most of his time in the office, dealing with clients, budgets and taxes. "I used to think business was for people in expensive jackets," he laughs. "Now I wear one sometimes."

Every summer Joe visits his old school to talk to students. He tells them that there are many ways to succeed. "Not everyone is good at exams," he says. "But if you work hard and you are reliable, people will remember you. That is more important than any test result."`,
      grammar: [continuous, usedTo],
      names: ["Joe", "Barnes", "Mr", "Hall"],
      glossed: ["van"],
      questions: [
        [
          ["What did Mr. Hall teach Joe that was not about water?", "霍尔先生教了乔什么与水无关的道理？"],
          ["Be on time and tell customers the real price", "按时到达，并告诉顾客真实的价格"],
          [
            ["Always choose the cheapest tools", "总是选最便宜的工具"],
            ["Never work on your own", "永远不要单干"],
          ],
          [
            'Mr. Hall said: "Always arrive when you say you will, and always tell the customer the real price."',
            "霍尔先生教他守时和诚实报价，这些品质后来让顾客信任乔。",
          ],
        ],
        [
          ["Why did Joe employ more plumbers?", "乔为什么雇了更多水管工？"],
          ["He had more work than he could handle", "他的活多到忙不过来"],
          [
            ["Mr. Hall asked him to", "霍尔先生让他这么做"],
            ["He wanted to stop working as a plumber", "他不想再当水管工了"],
          ],
          [
            'Customers told their friends about him, and "soon he had more work than he could handle, so he employed a second plumber".',
            "顾客把他介绍给朋友，活越来越多，他一个人做不完，就雇了人。",
          ],
        ],
        [
          ["What does Joe tell students?", "乔对学生们说了什么？"],
          ["There are many ways to succeed", "成功的路有很多条"],
          [
            ["Exams are the only way to a good job", "考试是找到好工作的唯一途径"],
            ["Everyone should become a plumber", "每个人都应该当水管工"],
          ],
          [
            'Joe says: "Not everyone is good at exams. But if you work hard and you are reliable, people will remember you."',
            "乔告诉学生成功的方式很多，努力和可靠比任何考试成绩都更有价值。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-work-retiring-at-fifty",
      title: ["Retiring at Fifty", "五十岁退休"],
      body: `For most people, retiring means stopping work at sixty or sixty-five. But a growing number of people are trying to retire much earlier, at fifty or even forty. How do they do it, and is it a good idea?

The plan is simple to explain but hard to follow. People who want to retire early save a very large part of their income, often half or more, for fifteen or twenty years. They invest the money carefully, and they spend as little as possible. They cook at home, live in small apartments, drive old cars and almost never travel. When their savings are large enough to live on, they leave their jobs.

Helen and Mark Davies retired last year, when they were both fifty-one. They used to work long hours as architects in the city. "We were earning well, but we never saw our children," says Helen. "Every evening we were too tired to talk." For twenty years they saved, and now they live in a small house by the sea.

Not everyone agrees that retiring early is wise. Some scientists who study money say that prices can go up faster than the money people have saved, and that people live longer than they expect. Others say that work gives people more than money. It gives them friends, a plan for the day and a reason to get up in the morning.

Helen and Mark understand this. Mark gives free advice to young architects, and Helen has been teaching drawing at the local school since the spring. "We haven't really stopped working," Mark says. "We have just stopped working for money."`,
      grammar: [usedTo, continuous],
      names: ["Helen", "Mark", "Davies"],
      glossed: ["savings"],
      questions: [
        [
          ["How do people who want to retire early get enough money?", "想提早退休的人是怎样攒够钱的？"],
          ["They save half or more of their income for many years", "他们多年来存下一半或更多的收入"],
          [
            ["They work two jobs until they are forty", "他们四十岁前同时做两份工作"],
            ["They sell their houses and cars", "他们卖掉自己的房子和汽车"],
          ],
          [
            'The passage says they "save a very large part of their income, often half or more, for fifteen or twenty years" and spend as little as possible.',
            "他们十五到二十年里存下一半以上的收入，并尽量少花钱。",
          ],
        ],
        [
          ["Why did Helen and Mark decide to save?", "海伦和马克为什么决定存钱？"],
          ["They worked so much that they never saw their children", "他们工作太多，几乎见不到孩子"],
          [
            ["They did not earn enough as architects", "他们当建筑师赚得不够多"],
            ["Their company told them to retire", "公司让他们退休"],
          ],
          [
            'Helen says: "We were earning well, but we never saw our children."',
            "他们收入不错，但工作时间太长，见不到孩子，晚上也累得没力气说话。",
          ],
        ],
        [
          ['What does Mark mean by "We have just stopped working for money"?', "马克说“我们只是不再为钱工作了”是什么意思？"],
          ["They still work, but not to earn money", "他们仍在工作，但不是为了赚钱"],
          [
            ["They have stopped doing anything at all", "他们什么都不做了"],
            ["They now earn more money than before", "他们现在赚的钱比以前多"],
          ],
          [
            "Mark gives free advice to young architects and Helen teaches drawing: they are still busy, but money is not the reason.",
            "马克免费指导年轻建筑师，海伦在学校教画画，他们依然在工作，只是不为赚钱。",
          ],
        ],
      ],
    }),
  ],
};
