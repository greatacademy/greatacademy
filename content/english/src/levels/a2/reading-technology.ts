// The reading unit of the A2 theme Technology: phones, computers, robots and machines, with just, already and yet.

import { type ReadingUnitDef, t } from "@ga/content";
import { passageMaker } from "../pre-a1/reading-kit.ts";
import { readingWords } from "./reading-words.ts";

const perfect = "present-perfect-with-just-already-and-yet";

const passage = passageMaker(readingWords, [
  "a2-words-technology",
  "a2-words-using-tech",
  "a2-words-communication",
  "a2-words-machines",
  perfect,
]);

/** readingTechnology is the reading unit of the theme Technology. */
export const readingTechnology: ReadingUnitDef = {
  id: "a2-reading-technology",
  title: t("Technology", "科技"),
  passages: [
    passage({
      id: "a2-tech-the-first-telephone",
      title: ["The First Telephone", "第一部电话"],
      body: `Today almost everyone has a phone in their pocket. But a hundred and fifty years ago there were no phones at all. To speak to someone in another city, you had to travel there, or you had to write to them and wait for days.

In 1876 a young Scottish man in America, Alexander Graham Bell, invented the first phone. He was a teacher, and he spent years working on one idea: a machine that could carry words from one room to another.

On March 10, 1876, the machine worked for the first time. Bell was in one room, and his partner, Thomas Watson, was in another. Bell spoke into the machine: "Mr. Watson, come here. I want to see you." In the other room Watson heard every word. He ran to Bell, and they both laughed.

At first many people thought the phone was just a toy. "Who will want to talk to a machine?" they asked. But they were wrong. Ten years later there were more than a hundred thousand phones in America. Today there are more phones in the world than people!`,
      grammar: ["past-simple-irregular", "could-for-past-ability"],
      names: ["Scottish", "America", "Alexander", "Graham", "Bell", "Thomas", "Watson", "Mr"],
      questions: [
        [
          ["Before phones, how did people speak to someone in another city?", "有电话以前，人们怎样和另一个城市的人说话？"],
          ["They traveled there, or wrote and waited for days", "去那里，或者写信再等好几天"],
          [
            ["They sent photos", "寄照片"],
            ["They used computers", "用电脑"],
          ],
          [
            'The passage says: "you had to travel there, or you had to write to them and wait for days."',
            "那时要么亲自去，要么写信然后等上好几天。",
          ],
        ],
        [
          ["What were the first words on the phone?", "电话里说的第一句话是什么？"],
          ['"Mr. Watson, come here. I want to see you."', "“沃森先生，过来，我想见你。”"],
          [
            ['"Hello, can you hear me?"', "“你好，你能听见吗？”"],
            ['"This is a toy."', "“这是个玩具。”"],
          ],
          [
            'The passage says: Bell spoke into the machine: "Mr. Watson, come here. I want to see you."',
            "贝尔对着机器说的第一句话是让沃森过来。",
          ],
        ],
        [
          ["What did many people think of the phone at first?", "起初很多人怎么看电话？"],
          ["It was just a toy", "它只是个玩具"],
          [
            ["It was dangerous", "它很危险"],
            ["It was too expensive", "它太贵了"],
          ],
          ['The passage says: "At first many people thought the phone was just a toy."', "起初很多人认为电话只是个玩具，但他们错了。"],
        ],
      ],
    }),
    passage({
      id: "a2-tech-a-robot-in-the-kitchen",
      title: ["A Robot in the Kitchen", "厨房里的机器人"],
      body: `Last month my uncle bought a robot for his kitchen. It is about as tall as a child, and it has two arms, a screen for a face and wheels, not legs.

The robot can do a lot of things. It can wash the dishes, clean the floor and cut vegetables. It can also cook easy meals. You choose a recipe on its screen and put the food on the table, and the robot does the rest.

When I visited my uncle last weekend, the robot made us lunch: noodles with vegetables. It cut the vegetables very quickly and carefully, much faster than my uncle. The noodles were good, but my grandma makes better ones.

There are some problems. The robot is very expensive, and it is slow when it cleans. Last week it dropped three plates. And one evening my uncle forgot to charge it, so it stopped while it was making dinner. My uncle had to finish the soup himself!

"Has it made your life easier?" I asked him. He thought for a moment. "Yes," he said. "But I still haven't learned how to make it wash the windows."`,
      grammar: [perfect, "past-continuous", "one-and-ones"],
      questions: [
        [
          ["What can the robot do?", "这个机器人能做什么？"],
          ["Wash dishes, clean the floor, cut vegetables and cook", "洗碗、扫地、切菜和做饭"],
          [
            ["Drive a car", "开车"],
            ["Wash the windows", "擦窗户"],
          ],
          [
            'The passage says: "It can wash the dishes, clean the floor and cut vegetables. It can also cook easy meals."',
            "机器人能洗碗、扫地、切菜，还能做简单的饭；擦窗户叔叔还没学会让它做。",
          ],
        ],
        [
          ["What happened when the uncle forgot to charge the robot?", "叔叔忘了给机器人充电时发生了什么？"],
          ["It stopped while it was making dinner", "它做晚饭时停住了"],
          [
            ["It dropped three plates", "它摔了三个盘子"],
            ["It cleaned the floor very slowly", "它扫地很慢"],
          ],
          [
            'The passage says: "my uncle forgot to charge it, so it stopped while it was making dinner."',
            "没充电，机器人做晚饭做到一半就停了，叔叔只好自己做完汤。",
          ],
        ],
        [
          ["What hasn't the uncle learned yet?", "叔叔还没学会什么？"],
          ["How to make it wash the windows", "怎样让它擦窗户"],
          [
            ["How to cook noodles", "怎样煮面条"],
            ["How to charge it", "怎样给它充电"],
          ],
          [
            'The uncle says: "But I still haven\'t learned how to make it wash the windows."',
            "haven't learned ... yet 的意思是“还没学会”。",
          ],
        ],
      ],
    }),
    passage({
      id: "a2-tech-too-much-screen-time",
      title: ["Too Much Screen Time", "看屏幕的时间太多了"],
      body: `How many hours a day do you spend in front of a screen? If you add your phone, your computer, your tablet and the television together, the answer may surprise you. Many young people spend more than seven hours a day on screens, and that is without homework.

Screens are useful. We use them to learn, to chat with friends and to relax. But too much screen time can be bad for you. Your eyes get tired, and your neck and back can hurt. If you use a screen late at night, it is difficult to sleep. And when you are always online, you have less time for sport, books and friends in real life.

Doctors say that young people should spend less than two hours a day on screens in their free time. Here are some ideas to help. Switch off your phone during meals. Don't take it to bed. Go outside every day. And try a day with no screens once a week.

Last month our class tried it. On our first Sunday with no screens, I was bored for the first hour. Then I played football, read a book and helped my dad cook. It was the best Sunday I have had in a long time.`,
      grammar: ["should-and-must", "too-and-enough", "imperatives"],
      questions: [
        [
          ["What can happen if you use a screen late at night?", "深夜看屏幕会怎样？"],
          ["It is difficult to sleep", "难以入睡"],
          [
            ["Your eyes get better", "眼睛变好"],
            ["You sleep for longer", "睡得更久"],
          ],
          ['The passage says: "If you use a screen late at night, it is difficult to sleep."', "深夜看屏幕会让人难以入睡。"],
        ],
        [
          ["How much screen time in their free time do doctors say is right for young people?", "医生说年轻人业余时间看屏幕多久合适？"],
          ["Less than two hours a day", "每天少于两小时"],
          [
            ["Seven hours a day", "每天七小时"],
            ["As much as they want", "想看多久就看多久"],
          ],
          [
            'The passage says: "young people should spend less than two hours a day on screens in their free time."',
            "七小时是很多年轻人实际看屏幕的时间，医生建议业余时间少于两小时。",
          ],
        ],
        [
          ["What did the writer do on the Sunday with no screens?", "没有屏幕的那个星期天作者做了什么？"],
          ["Played football, read a book and helped Dad cook", "踢足球、看书、帮爸爸做饭"],
          [
            ["Slept all day", "睡了一整天"],
            ["Went shopping", "去购物"],
          ],
          [
            'The passage says: "Then I played football, read a book and helped my dad cook."',
            "作者头一个小时很无聊，后来踢了足球、看了书、帮爸爸做饭。",
          ],
        ],
      ],
    }),
    passage({
      id: "a2-tech-how-a-battery-works",
      title: ["How a Battery Works", "电池是怎样工作的"],
      body: `Phones, laptops, cars and even some toys need batteries. But what does a battery do?

A battery keeps power and gives it back when you need it. Every battery has two different ends. When you connect the two ends to a machine, tiny bits called electrons travel from one end, through the machine, to the other end. This is electric power, and it makes the machine work.

When the electrons have all moved, the battery is empty. Some batteries, like the ones in old clocks and toys, are then dead, and you have to buy new ones. But the batteries in phones and laptops can be charged again. When you connect your phone to the wall, power pushes the electrons back to the first end, and the battery is full again.

Batteries are getting better every year. Phone batteries last longer and charge faster, and electric cars can now travel all day without charging. But old batteries can hurt the earth, so never put them with your other old things. Take them back to the shop.`,
      grammar: ["one-and-ones", "present-simple"],
      glossed: ["electrons"],
      questions: [
        [
          ["What is electric power in a battery?", "电池里的电力是什么？"],
          ["Electrons that travel through the machine", "穿过机器移动的电子"],
          [
            ["Heat from the sun", "太阳的热量"],
            ["Water in the battery", "电池里的水"],
          ],
          [
            'The passage says electrons "travel from one end, through the machine, to the other end. This is electric power."',
            "电子从电池一端经过机器到另一端，这就是电力。",
          ],
        ],
        [
          ["What happens when you connect your phone to the wall?", "把手机接到墙上的插座会怎样？"],
          ["Power pushes the electrons back, and the battery is full again", "电力把电子推回去，电池又满了"],
          [
            ["The battery is dead", "电池没用了"],
            ["The battery gets empty", "电池变空了"],
          ],
          [
            'The passage says: "power pushes the electrons back to the first end, and the battery is full again."',
            "充电就是把电子推回原来那一端，电池又充满了。",
          ],
        ],
        [
          ["What should you do with old batteries?", "旧电池应该怎么处理？"],
          ["Take them back to the shop", "拿回商店"],
          [
            ["Keep them in a clock", "放在钟里"],
            ["Put them with other old things", "和其他旧东西放在一起"],
          ],
          [
            'The passage says: "never put them with your other old things. Take them back to the shop."',
            "旧电池会伤害地球，应该拿回商店。",
          ],
        ],
      ],
    }),
    passage({
      id: "a2-tech-the-password-problem",
      title: ["The Password Problem", "密码难题"],
      body: `Last week my mom had a problem. She wanted to open her email on her new laptop, but she couldn't remember her password.

She tried her birthday. Wrong. She tried the name of our dog. Wrong. She tried 123456. Wrong again. After five wrong passwords, the website stopped her. "Please try again in one hour," it said.

Mom was upset. "I have so many passwords," she said. "One for the bank, one for email, one for shopping, one for work. How can I remember them all?"

My brother, who studies computers at college, explained a few things to her. "First, your passwords should not be easy, like your birthday. Those are the first things that bad people try. Second, you should use a different password for every website. Then if someone finds one password, they can't open everything. Third, use a password app. It remembers all your passwords for you, so you only need to remember one."

Mom has already downloaded the app, and she has changed all her passwords. But she hasn't told us her one big password yet. "That one is only for me," she says.`,
      grammar: [perfect, "should-and-must", "one-and-ones"],
      questions: [
        [
          ["Why couldn't Mom open her email?", "妈妈为什么打不开邮箱？"],
          ["She couldn't remember her password", "她想不起密码了"],
          [
            ["Her laptop was broken", "她的笔记本电脑坏了"],
            ["There was no internet", "没有网络"],
          ],
          ['The passage says: "she couldn\'t remember her password."', "妈妈想不起密码，试了五次都错了。"],
        ],
        [
          ["Why should you use a different password for every website?", "为什么每个网站都要用不同的密码？"],
          ["Then one lost password can't open everything", "这样丢了一个密码也打不开所有东西"],
          [
            ["Websites don't let you use the same one", "网站不允许用同一个"],
            ["It is easier to remember", "这样更容易记住"],
          ],
          [
            'The brother says: "Then if someone finds one password, they can\'t open everything."',
            "每个网站密码不同，别人找到一个也打不开其他的。",
          ],
        ],
        [
          ["What has Mom already done?", "妈妈已经做了什么？"],
          ["Downloaded the app and changed her passwords", "下载了应用并改了所有密码"],
          [
            ["Told everyone her big password", "把总密码告诉了大家"],
            ["Bought a new laptop", "买了一台新笔记本电脑"],
          ],
          [
            'The passage says: "Mom has already downloaded the app, and she has changed all her passwords."',
            "has already downloaded 表示“已经下载了”；总密码她还没告诉家人。",
          ],
        ],
      ],
    }),
    passage({
      id: "a2-tech-grandma-sends-her-first-message",
      title: ["Grandma Sends Her First Message", "奶奶发出第一条消息"],
      body: `My grandma is seventy-five, and until last month she used her phone only for calls. She always said, "I'm too old for these new things."

Then my cousin moved abroad to study, and Grandma wanted to see her photos. So I visited Grandma every Saturday and taught her to use the phone.

First I showed her how to open the message app. Then we practiced typing. Her fingers were slow, and she often clicked the wrong button. "This screen is too small!" she said. We made the words on the screen bigger, and that helped.

After three weeks she was ready. She typed a message to my cousin: "Hello dear, how are you? I miss you. Love, Grandma." Then she added a photo of her cat and clicked "Send".

Ten minutes later a reply arrived, with a photo of my cousin in front of a big old building. Grandma laughed and laughed.

Now Grandma sends messages every day. She has already learned to make video calls, and yesterday she sent me a joke. I haven't told her yet, but it wasn't very funny.`,
      grammar: [perfect, "too-and-enough", "past-simple-irregular"],
      questions: [
        [
          ["Why did Grandma want to learn to use her phone?", "奶奶为什么想学用手机？"],
          ["To see the photos of her granddaughter abroad", "为了看在国外的孙女的照片"],
          [
            ["For her job", "为了工作"],
            ["Because she was bored", "因为她很无聊"],
          ],
          [
            'The passage says: "my cousin moved abroad to study, and Grandma wanted to see her photos."',
            "表姐出国留学，奶奶想看她的照片，所以开始学用手机。",
          ],
        ],
        [
          ["What problem did Grandma have at first?", "奶奶一开始遇到了什么困难？"],
          ["Her fingers were slow, and the screen was too small", "手指慢，屏幕太小"],
          [
            ["She had no internet", "她没有网络"],
            ["Her phone was broken", "她的手机坏了"],
          ],
          [
            "The passage says: \"Her fingers were slow, and she often clicked the wrong button. 'This screen is too small!'\"",
            "她手指慢、常点错按钮，还嫌屏幕太小，后来把字调大就好了。",
          ],
        ],
        [
          ["What has Grandma already learned?", "奶奶已经学会了什么？"],
          ["To make video calls", "打视频电话"],
          [
            ["To write emails on a laptop", "用笔记本电脑写邮件"],
            ["To make videos", "拍视频"],
          ],
          ['The passage says: "She has already learned to make video calls."', "has already learned 表示“已经学会了”。"],
        ],
      ],
    }),
    passage({
      id: "a2-tech-a-town-without-internet",
      title: ["A Town Without Internet", "没有网络的小镇"],
      body: `Last summer our family spent two weeks in Green Bank, a small town in the mountains of America. Green Bank is special: there is almost no internet, and phones can't connect there.

Why? Near the town there is a huge telescope, a machine that listens to space. It can hear very small things from very far, and phones and the internet stop it from working well. So the people in the town don't use them.

At first I was upset. I couldn't text my friends or watch videos. But after a few days, something changed. We played board games in the evenings and went for long walks. The children in the town played outside all day, and I joined them. People talked to each other in the shops and in the street.

When we left, I switched my phone on again. I had two hundred messages! But I didn't want to read them. I wanted to go back to Green Bank.`,
      grammar: ["could-for-past-ability", "past-simple-irregular"],
      names: ["Green", "Bank", "America"],
      glossed: ["telescope"],
      questions: [
        [
          ["Why can't phones connect in Green Bank?", "为什么格林班克的手机连不上网？"],
          ["Phones stop the telescope from working well", "手机会影响望远镜正常工作"],
          [
            ["The town has no money", "小镇没有钱"],
            ["The mountains are too high", "山太高了"],
          ],
          [
            'The passage says: "phones and the internet stop it from working well. So the people in the town don\'t use them."',
            "镇旁有一台监听太空的巨型望远镜，手机和网络会干扰它。",
          ],
        ],
        [
          ["What did the family do in the evenings?", "这家人晚上做什么？"],
          ["Played board games", "玩桌游"],
          [
            ["Watched videos", "看视频"],
            ["Texted their friends", "给朋友发短信"],
          ],
          [
            'The passage says: "We played board games in the evenings and went for long walks."',
            "没有网络，他们晚上玩桌游，还去散了很长时间的步。",
          ],
        ],
        [
          ["How did the writer feel at the end?", "最后作者有什么感受？"],
          ["The writer wanted to go back", "想回去"],
          [
            ["The writer was happy to leave", "很高兴离开"],
            ["The writer was bored", "很无聊"],
          ],
          ['The last sentence says: "I wanted to go back to Green Bank."', "作者一开始很不高兴，但最后想再回格林班克。"],
        ],
      ],
    }),
    passage({
      id: "a2-tech-machines-that-help-farmers",
      title: ["Machines That Help Farmers", "帮助农民的机器"],
      body: `A hundred years ago, work on a farm was very hard. Farmers worked from sunrise until dark, and they did almost everything with their hands or with horses. Today machines do a lot of that work.

Big machines with huge wheels can plant seeds, give water to the plants and pick the corn in a few hours. One farmer with one machine can do the work of fifty people.

Now farmers are also using new machines. Small flying machines called drones fly over the fields and take photos. The photos show the farmer which plants are ill or need more water. Some farms have robots that pick fruit, and some cows wear small computers that tell the farmer when they are ill.

These machines save time and money, and they help farmers grow more food with less water. But they are expensive, and many small farmers can't buy them yet. Some people also worry that machines will take the jobs of farm workers.

Still, the world needs more food every year, and machines will probably be an important part of the answer.`,
      grammar: [perfect, "will-for-the-future"],
      glossed: ["drones"],
      questions: [
        [
          ["How much work can one farmer with one big machine do?", "一个农民用一台大机器能做多少工作？"],
          ["The work of fifty people", "五十个人的工作"],
          [
            ["The work of five people", "五个人的工作"],
            ["The work of one horse", "一匹马的工作"],
          ],
          ['The passage says: "One farmer with one machine can do the work of fifty people."', "一个农民加一台机器能干五十个人的活。"],
        ],
        [
          ["What do the drones do?", "无人机做什么？"],
          ["They take photos of the fields", "给田地拍照"],
          [
            ["They pick fruit", "摘水果"],
            ["They give water to cows", "给奶牛喂水"],
          ],
          [
            'The passage says: "Small flying machines called drones fly over the fields and take photos."',
            "无人机在田地上空飞，拍照告诉农民哪些作物病了或缺水；摘水果的是机器人。",
          ],
        ],
        [
          ["What is one problem with the new machines?", "新机器的一个问题是什么？"],
          ["They are expensive", "它们很贵"],
          [
            ["They use too much water", "它们用水太多"],
            ["They are too slow", "它们太慢"],
          ],
          [
            'The passage says: "But they are expensive, and many small farmers can\'t buy them yet."',
            "机器很贵，很多小农户还买不起；也有人担心机器会抢走农场工人的工作。",
          ],
        ],
      ],
    }),
  ],
};
