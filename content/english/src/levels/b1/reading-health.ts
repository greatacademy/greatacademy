// The reading unit of the B1 theme Health and Fitness: illness and treatment, food, exercise, sleep and stress.

import { type ReadingUnitDef, t } from "@ga/content";
import { passageMaker } from "../pre-a1/reading-kit.ts";
import { readingWords } from "./reading-words.ts";

const conditional = "first-conditional";

const passage = passageMaker(readingWords, [
  "b1-words-illness",
  "b1-words-healthcare",
  "b1-words-fitness",
  "b1-words-nutrition",
  "b1-words-body-and-mind",
  "b1-words-health-verbs",
  "b1-words-symptoms",
  "b1-words-healthy-habits",
  conditional,
]);

/** readingHealth is the reading unit of the theme Health and Fitness. */
export const readingHealth: ReadingUnitDef = {
  id: "b1-reading-health",
  title: t("Health and Fitness", "健康与健身"),
  passages: [
    passage({
      id: "b1-health-how-vaccines-work",
      title: ["How Vaccines Work", "疫苗是怎样起作用的"],
      body: `Every year vaccines prevent millions of people from getting serious diseases. But how does a small injection in your arm protect your whole body?

To understand vaccines, we first need to understand how the body deals with an infection. When a virus gets into the body, it starts to make copies of itself very quickly. The body notices that something is wrong and sends special cells, tiny living parts of the body, to destroy it. These cells are part of the immune system, the way the body protects itself. It takes time, often a week or more, for them to learn how to beat a new virus. During that time we can become very ill.

Something important happens after we recover. The immune system remembers the virus. If the same virus gets into the body again, the cells know it at once and destroy it before it can cause any harm. This is why most people get some illnesses only once.

A vaccine uses this memory. It shows the body a dead or very weak form of a virus, or only a small part of it. This form cannot make us ill, but the immune system still learns what the virus looks like. Later, if the real virus arrives, the body is ready.

Some people feel a little sore or tired for a day after an injection. This is normal; it means the body is learning. Serious problems almost never happen.

Vaccines also protect people who cannot have them, like tiny babies or patients with certain diseases. If most people in a community are protected, a virus cannot spread easily, and everyone is safer.`,
      grammar: [conditional],
      glossed: ["cells", "immune", "system"],
      questions: [
        [
          ["What does the immune system do after we recover from an illness?", "我们从疾病中康复后，免疫系统会做什么？"],
          ["It remembers the virus", "它会记住这种病毒"],
          [
            ["It stops working for a week", "它会停止工作一周"],
            ["It makes copies of the virus", "它会复制这种病毒"],
          ],
          [
            '"The immune system remembers the virus." If the virus comes again, the cells know it at once and destroy it.',
            "免疫系统会记住病毒，病毒再次进入时就能立刻认出并消灭它。",
          ],
        ],
        [
          ["What does a vaccine show the body?", "疫苗给身体看的是什么？"],
          ["A dead or very weak form of a virus", "死的或非常弱的病毒"],
          [
            ["A strong virus that makes us ill for a week", "一种让人病一周的强病毒"],
            ["A special medicine that kills every virus", "一种能杀死所有病毒的特效药"],
          ],
          [
            "A vaccine shows the body a dead or weak form of a virus, or a small part of it, so the immune system can learn without the person becoming ill.",
            "疫苗让免疫系统认识病毒的样子，但不会让人真的生病。",
          ],
        ],
        [
          ["Why do vaccines also protect people who cannot have them?", "为什么疫苗也能保护那些不能接种的人？"],
          ["A virus cannot spread easily if most people are protected", "如果大多数人受到保护，病毒就难以传播"],
          [
            ["Their doctors give them a different medicine", "医生会给他们别的药"],
            ["Babies are never ill", "婴儿从来不生病"],
          ],
          [
            '"If most people in a community are protected, a virus cannot spread easily, and everyone is safer."',
            "这里用了第一条件句：如果大多数人都接种了，病毒就难以传播，大家都更安全。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-health-the-truth-about-sugar",
      title: ["The Truth About Sugar", "关于糖的真相"],
      body: `Most of us love sweet food. A piece of cake or a glass of cold juice can make a bad day feel better. But doctors around the world are warning that we eat far too much sugar, and that it is harming our health.

The problem is not the sugar in an apple or a banana. Fruit also has fiber and vitamins, and the body takes in its sugar slowly. The problem is the extra sugar that companies add to food and drinks. One bottle of a sweet drink from a shop can have eight or nine spoons of it, more than doctors say we should have in a whole day.

Extra sugar gives us a lot of calories but very little nutrition. If we eat more calories than we use, the body keeps the rest as fat. Over time this can make people overweight and increase the risk of heart disease and other serious illnesses. Sugar also damages our teeth, and it can affect our mood: after a sweet snack, many people feel full of energy for an hour and then suddenly tired.

The hardest part is that sugar is often hidden. We expect to find it in candy and cookies, but it is also in bread, sauces, soups and even in food that is sold as healthy, like some fruit drinks and breakfast foods.

So what can we do? Doctors say we don't need to avoid sugar totally. Instead, we can choose water over sweet drinks, read what is in our food before we buy it, and keep candy for special days. If you reduce sugar slowly, your taste will change too. After a few weeks, many people find that their old favorite drinks taste much too sweet.`,
      grammar: [conditional],
      questions: [
        [
          ["Why is the sugar in fruit less of a problem?", "为什么水果里的糖问题较小？"],
          ["Fruit also has fiber and vitamins, and the body takes its sugar in slowly", "水果还含有纤维和维生素，身体吸收其中的糖较慢"],
          [
            ["Fruit has no calories at all", "水果完全没有热量"],
            ["Companies add extra vitamins to fruit", "公司在水果里加了额外的维生素"],
          ],
          [
            'The passage says fruit "also has fiber and vitamins, and the body takes in its sugar slowly". The problem is the extra sugar added to food and drinks.',
            "问题在于额外添加到食品和饮料中的糖，而不是水果里的糖。",
          ],
        ],
        [
          ["What happens if we eat more calories than we use?", "如果我们摄入的热量多于消耗的会怎样？"],
          ["The body keeps the rest as fat", "身体会把多余的储存为脂肪"],
          [
            ["The body turns them into vitamins", "身体会把它们变成维生素"],
            ["We feel tired for a whole week", "我们会累上整整一周"],
          ],
          [
            '"If we eat more calories than we use, the body keeps the rest as fat." This can make people overweight.',
            "多余的热量会变成脂肪，长期下来可能导致超重和心脏病。",
          ],
        ],
        [
          ["Why is it hard to avoid extra sugar?", "为什么很难避开额外的糖？"],
          ["It is hidden in food such as bread and sauces", "它藏在面包、酱汁等食物里"],
          [
            ["Doctors say we must eat it every day", "医生说我们每天都必须吃糖"],
            ["Sweet food is very expensive", "甜食非常贵"],
          ],
          [
            'The passage says sugar "is often hidden": it is also in bread, sauces, soups and even food sold as healthy.',
            "糖常常隐藏在面包、酱汁、汤，甚至一些号称健康的食品里。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-health-training-for-a-first-marathon",
      title: ["Training for a First Marathon", "为第一次马拉松做训练"],
      body: `A year ago, Lucas Moreau could not run to the bus stop without stopping to breathe. Last Sunday he finished his first marathon, forty-two kilometers through the streets of his city, in four hours and thirty-one minutes.

"I wasn't an athlete at all," he says. "I worked in an office, I ate a lot of junk food, and my only exercise was walking to the car." Then his doctor told him that he was overweight and that his heart was working too hard. "She said that if I didn't change my lifestyle, I would have serious problems by fifty. That made me scared."

Lucas started slowly. In the first month he jogged for ten minutes, three times a week. Every week he added a few minutes. He joined a running club, where the coach taught him to stretch before and after every workout and to rest when his muscles were sore. "The coach said: if you run too much too soon, you will get an injury. He was right. When I didn't listen, I hurt my knee and couldn't run for three weeks."

He also changed his diet. He stopped buying snacks and started cooking balanced meals with more vegetables and protein. He drank less alcohol and more water. Over the year he lost eighteen kilos.

The last five kilometers of the marathon were the hardest. "My legs hurt so much," Lucas laughs. "But people at the side of the road were cheering, and I kept going."

What is his advice for people who are just starting? "Don't think about the whole marathon. Think about the next run. If you do that every week, you'll be surprised where you end up."`,
      grammar: [conditional],
      names: ["Lucas", "Moreau"],
      questions: [
        [
          ["Why did Lucas start running?", "卢卡斯为什么开始跑步？"],
          ["His doctor warned him about his health", "医生提醒他注意健康问题"],
          [
            ["His company asked all workers to run", "公司要求所有员工跑步"],
            ["He wanted to win a race", "他想赢得一场比赛"],
          ],
          [
            "His doctor said he was overweight and his heart was working too hard, and that he would have serious problems if he didn't change his lifestyle.",
            "医生说他超重、血压高，如果不改变生活方式，五十岁前就会出大问题。",
          ],
        ],
        [
          ["What happened when Lucas didn't listen to his coach?", "卢卡斯不听教练的话时发生了什么？"],
          ["He hurt his knee and couldn't run for three weeks", "他伤了膝盖，三周不能跑步"],
          [
            ["He lost eighteen kilos in a month", "他一个月瘦了十八公斤"],
            ["He finished the marathon faster", "他更快地跑完了马拉松"],
          ],
          [
            'The coach warned: "if you run too much too soon, you will get an injury." When Lucas didn\'t listen, he hurt his knee.',
            "教练说跑太多太快会受伤；卢卡斯没听，结果伤了膝盖。",
          ],
        ],
        [
          ["What is Lucas's advice for beginners?", "卢卡斯给初学者的建议是什么？"],
          ["Think only about the next run", "只考虑下一次跑步"],
          [
            ["Run a marathon in the first month", "第一个月就去跑马拉松"],
            ["Never rest when your muscles are sore", "肌肉酸痛时也不要休息"],
          ],
          [
            '"Don\'t think about the whole marathon. Think about the next run." Small steps every week add up.',
            "他建议别去想整场马拉松，只想下一次跑步，每周坚持就会有惊喜。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-health-why-we-need-sleep-and-naps",
      title: ["Why We Need Sleep and Naps", "我们为什么需要睡眠和小睡"],
      body: `We spend about a third of our lives sleeping. For a long time scientists were not sure why. Today they know that sleep is not a waste of time. It is one of the most important things we do for our health.

While we sleep, the brain is busy. It organizes the information of the day and keeps the important memories, so that we can find them for years. That is why students who sleep well after studying remember more than students who stay up all night. Sleep also helps the body repair muscles, protect itself from infections and control weight.

Most people need seven to nine hours a night, and young people need even more. But many people get much less. They work late, look at their phones in bed or drink coffee in the evening. If you sleep badly for a few nights, you will notice the effects: you will feel tense and in a bad mood, you will make more mistakes, and you will probably eat more snacks.

What about naps? In many countries, a short sleep after lunch is a normal part of the day. Research shows that a nap of ten to twenty minutes can improve attention and mood for a few hours. But a long nap can make you feel worse, not better, and it may stop you from sleeping at night.

Doctors give simple advice for better sleep. Go to bed and get up at the same time every day, even at weekends. Keep your bedroom cool, dark and quiet. Avoid coffee after lunch, and put your phone in another room. If you follow these rules for a few weeks, sleep usually improves.`,
      grammar: [conditional],
      questions: [
        [
          ["What does the brain do while we sleep?", "我们睡觉时大脑在做什么？"],
          ["It keeps the important memories for later", "把重要的记忆保存下来"],
          [
            ["It stops working completely", "它完全停止工作"],
            ["It makes us hungry for snacks", "它让我们想吃零食"],
          ],
          [
            'The brain "organizes the information of the day and keeps the important memories", so students who sleep well remember more.',
            "睡眠时大脑整理一天的信息，把重要内容存入长期记忆，所以睡得好的学生记得更多。",
          ],
        ],
        [
          ["What can happen if you sleep badly for a few nights?", "连续几晚睡不好会怎样？"],
          ["You make more mistakes and eat more snacks", "你会犯更多错误，吃更多零食"],
          [
            ["You remember more information", "你会记住更多信息"],
            ["You need less sleep", "你需要的睡眠时间会减少"],
          ],
          [
            "The passage says you will feel tense, be in a bad mood, make more mistakes and probably eat more snacks.",
            "睡眠不足会让人紧张、情绪差、犯更多错，还可能吃更多零食。",
          ],
        ],
        [
          ["What does the passage say about naps?", "文章怎样谈论小睡？"],
          ["A short nap helps, but a long one can make you feel worse", "短暂小睡有好处，但睡太久反而更难受"],
          [
            ["Naps are always bad for your health", "小睡总是对健康有害"],
            ["A long nap is better than a short one", "睡得久比睡得短好"],
          ],
          [
            "A nap of ten to twenty minutes can improve attention and mood, but a long nap can make you feel worse and stop you from sleeping at night.",
            "十到二十分钟的小睡能提升注意力和情绪，长时间午睡却可能让人更难受、晚上睡不着。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-health-allergies-on-the-rise",
      title: ["Allergies on the Rise", "日益增多的过敏"],
      body: `When Maya was six, she ate a cookie at a birthday party and, a few minutes later, her face was swollen and she could not breathe well. An ambulance took her to hospital, where doctors gave her an injection. Later a specialist diagnosed an allergy to peanuts.

An allergy happens when the body thinks that something safe, like a peanut, a flower or a cat, is dangerous. The result can be mild, like sneezing or eyes that itch, or very serious, like what happened to Maya.

Allergies are increasing in many parts of the world. In some countries, two times as many children have food allergies today as thirty years ago. Nobody knows exactly why, but scientists have a few ideas.

One idea is that modern homes are too clean. In the past, children grew up with animals, dirty hands and many brothers and sisters, and their bodies learned early what was dangerous and what was not. Today many children grow up in cities with little contact with nature. Another idea is about food: in the past, parents were advised to wait before giving young children foods like peanuts and eggs. Now research suggests that trying them early, in small amounts, may actually prevent allergies.

For people like Maya, life needs careful planning. She is now fifteen. She reads the list of what is in every product, asks questions in restaurants and always carries her medicine. "It used to make me scared," she says. "Now it is just part of my routine. If I am careful, I can do everything my friends do."`,
      names: ["Maya", "Maya's"],
      glossed: ["peanuts", "peanut"],
      questions: [
        [
          ["What is an allergy, according to the passage?", "根据文章，什么是过敏？"],
          ["The body thinks that something safe is dangerous", "身体把无害的东西当成危险的东西"],
          [
            ["A virus that spreads from cats", "一种从猫身上传播的病毒"],
            ["An illness caused by eating too much", "一种吃得太多引起的疾病"],
          ],
          [
            '"An allergy happens when the body thinks that something safe, like a peanut, a flower or a cat, is dangerous."',
            "过敏是身体把花生、花、猫等无害的东西当成危险物来对付。",
          ],
        ],
        [
          ["What is one idea about why allergies are rising?", "关于过敏增多的原因，有一种说法是什么？"],
          ["Modern homes are too clean", "现代家庭太干净了"],
          [
            ["Children eat too many vegetables", "孩子吃了太多蔬菜"],
            ["Doctors give too many injections", "医生打了太多针"],
          ],
          [
            "One idea is that modern homes are too clean, so children's bodies do not learn early what is dangerous and what is not.",
            "一种说法是现代家庭太干净，孩子的身体从小没有机会学会分辨什么危险、什么不危险。",
          ],
        ],
        [
          ["How does Maya feel about her allergy now?", "玛雅现在怎样看待自己的过敏？"],
          ["It is part of her routine, and she can do what her friends do", "这已是生活的一部分，她能做朋友们做的一切"],
          [
            ["She is still too scared to eat in restaurants", "她仍然害怕在餐馆吃饭"],
            ["She doesn't need her medicine any more", "她已经不需要带药了"],
          ],
          [
            '"It used to make me scared. Now it is just part of my routine. If I am careful, I can do everything my friends do."',
            "她以前害怕，现在只要小心，就能和朋友们一样生活。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-health-a-day-in-a-hospital-ward",
      title: ["A Day in a Hospital Ward", "病房里的一天"],
      body: `Grace Lin is a nurse on the ward for children in a large city hospital. Her shift starts at seven in the morning and finishes at seven in the evening. We spent a day with her.

6:45. Grace arrives and talks to the night nurse, who tells her about each of the twelve patients. A boy of nine had surgery on his leg yesterday. A girl of four has a high fever. A baby is recovering from a serious infection.

8:00. The doctors arrive. Grace goes with them from bed to bed. A surgeon examines the leg of the boy and says that it is getting better. The girl with the fever needs an x-ray of her chest. Grace writes everything down, because she will prepare the medicine later.

10:30. Grace takes the girl to the x-ray department in a wheelchair. The girl is scared, so Grace tells her a story about a brave rabbit on the way. "Half of my job is medicine," she says. "The other half is making people feel safe."

13:00. Lunch, for fifteen minutes. Then the parents start to visit. A mother asks many questions about the treatment of her baby. Grace answers every one. "If parents understand what is happening, they worry less," she explains.

16:00. An emergency: a child arrives with a bad injury after falling from a tree. For an hour the whole team works quickly together and stays calm.

19:15. Grace finally goes home. Her feet are sore and she is very tired. Would she choose another job? "Never," she smiles. "When a child leaves this ward healthy, that is the best feeling in the world."`,
      grammar: [conditional],
      names: ["Grace", "Lin"],
      questions: [
        [
          ["What does Grace do at 6:45?", "格蕾丝在六点四十五分做什么？"],
          ["She hears about each patient from the night nurse", "她听夜班护士介绍每位病人的情况"],
          [
            ["She takes a girl to the x-ray department", "她带一个女孩去做X光"],
            ["She has lunch with the doctors", "她和医生们一起吃午饭"],
          ],
          [
            "At 6:45 Grace arrives and the night nurse tells her about each of the twelve patients.",
            "六点四十五分她到岗，夜班护士向她交接十二位病人的情况。",
          ],
        ],
        [
          ["Why does Grace tell the girl a story?", "格蕾丝为什么给女孩讲故事？"],
          ["The girl is scared", "女孩很害怕"],
          [
            ["The girl cannot sleep at night", "女孩晚上睡不着"],
            ["The doctor asks her to", "医生让她这样做"],
          ],
          [
            '"The girl is scared, so Grace tells her a story." Grace says half of her job is "making people feel safe".',
            "女孩害怕，所以格蕾丝讲故事让她安心；她说工作的一半就是让人感到安全。",
          ],
        ],
        [
          ["Why does Grace answer the parents' questions carefully?", "格蕾丝为什么耐心回答家长的问题？"],
          ["Parents worry less if they understand what is happening", "家长了解情况后就不那么担心"],
          [
            ["The parents must give the medicine", "家长必须亲自给药"],
            ["The doctors do not talk to parents", "医生不和家长说话"],
          ],
          [
            '"If parents understand what is happening, they worry less," Grace explains.',
            "格蕾丝用条件句解释：如果家长明白发生了什么，就会少担心一些。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-health-stress-and-the-body",
      title: ["Stress and the Body", "压力与身体"],
      body: `Imagine that you are walking in a forest and you suddenly see a bear. Your heart beats faster, you breathe quickly, your muscles become tense and you feel ready to run. This is stress, and at this moment it is very useful. It prepares the body to deal with something dangerous.

The problem is that the body does the same thing when we have modern problems, like an exam, a deadline or arguing with a friend. These problems do not go away in a few minutes, like a bear. They can go on for weeks or months. When stress goes on for a long time, it starts to harm both our physical and our mental health.

People who suffer from stress for months often have headaches, a sore neck or stomach problems. They may sleep badly and feel tired all day. Stress can also affect the heart and make it harder for the body to protect itself from infections. It can also make people anxious or depressed, and they may stop caring about things they used to love.

We cannot avoid every cause of stress, but we can reduce its effects. Physical exercise is one of the best ways: a walk of thirty minutes helps the body use the energy that stress gives it. Meditation and slow breathing can calm the nerves. Talking to a friend also helps, because problems often seem smaller when we share them.

Finally, it is important to notice the symptoms early. If you feel tense and tired for weeks, don't just wait for it to go away. Talk to someone you trust, or see a doctor. Asking for help does not mean that you are weak. It means that you care about your health.`,
      questions: [
        [
          ["Why is stress useful when you see a bear?", "为什么看见熊时压力是有用的？"],
          ["It prepares the body to deal with danger", "它让身体准备好应对危险"],
          [
            ["It helps you fall asleep quickly", "它帮你很快入睡"],
            ["It makes the bear go away", "它让熊走开"],
          ],
          [
            'Your heart beats faster and your muscles become tense, so you are ready to run: stress "prepares the body to deal with something dangerous".',
            "心跳加快、肌肉紧绷，身体随时准备逃跑，这时压力是有用的。",
          ],
        ],
        [
          ["Why are modern problems harder for the body?", "为什么现代的问题对身体伤害更大？"],
          ["They can last for weeks or months", "它们可能持续几周甚至几个月"],
          [
            ["They are more dangerous than bears", "它们比熊更危险"],
            ["They happen only at night", "它们只在夜里发生"],
          ],
          [
            'Problems such as exams and deadlines "do not go away in a few minutes, like a bear". Long stress harms our health.',
            "考试、截止日期等问题不会几分钟就消失，长期压力会损害身心健康。",
          ],
        ],
        [
          ["Which way to reduce stress does the passage mention?", "文章提到了哪种减轻压力的方法？"],
          ["Taking a walk of thirty minutes", "散步三十分钟"],
          [
            ["Drinking more coffee", "多喝咖啡"],
            ["Working until late at night", "工作到深夜"],
          ],
          [
            "The passage mentions exercise such as a walk of thirty minutes, meditation, slow breathing and talking to a friend.",
            "文章提到运动（如散步三十分钟）、冥想、慢呼吸和与朋友交谈。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-health-small-habits-big-changes",
      title: ["Small Habits, Big Changes", "小习惯，大改变"],
      body: `Every January, millions of people make big promises. They will go to the gym every day, stop eating sugar and learn a new language. By February, most of them have given up. Why is it so hard to change our habits, and what actually works?

Research suggests that big changes often fail because they ask too much of us at once. A person who has never exercised cannot suddenly train for two hours a day. After a few days their muscles are sore, they feel tired, and they quit.

A better way is to start with a habit so small that it seems almost funny. Instead of "I will run five kilometers every day", try "I will put on my running shoes after breakfast". Instead of "I will read for an hour", try "I will read one page before bed". These tiny actions are easy to repeat, and repeating is what turns an action into a habit.

It also helps to connect a new habit to something you already do. For example: after I brush my teeth, I will drink a glass of water. After I sit down on the bus, I will practice ten new words. The old habit reminds you to do the new one.

Finally, be kind to yourself. If you skip a day, don't think that you have failed. Just start again the next day. Scientists say that it takes about two months, not three weeks, for a new action to become automatic.

Small habits may not look important. But if you do a little more every week, after a year you will be surprised how much your lifestyle has changed.`,
      grammar: [conditional],
      questions: [
        [
          ["Why do big changes often fail?", "为什么大的改变常常失败？"],
          ["They ask too much of us at once", "它们一下子对我们要求太多"],
          [
            ["They are too easy to repeat", "它们太容易重复了"],
            ["Nobody makes promises in January", "没有人在一月份许下承诺"],
          ],
          [
            '"Big changes often fail because they ask too much of us at once." People feel sore and tired, and they quit.',
            "一下子要求太多，肌肉酸痛又疲惫，人们就放弃了。",
          ],
        ],
        [
          ["Which is an example of a small habit from the passage?", "下面哪个是文章中小习惯的例子？"],
          ["Reading one page before bed", "睡前读一页书"],
          [
            ["Running five kilometers every day", "每天跑五公里"],
            ["Training for two hours a day", "每天训练两小时"],
          ],
          [
            "The passage suggests tiny actions such as putting on your running shoes or reading one page before bed.",
            "文章建议从很小的动作开始，比如睡前读一页书；每天跑五公里是要避免的大目标。",
          ],
        ],
        [
          ["What should you do if you skip a day?", "如果有一天没做到，应该怎么办？"],
          ["Start again the next day", "第二天重新开始"],
          [
            ["Give up the habit", "放弃这个习惯"],
            ["Do twice as much the next day", "第二天做双倍的量"],
          ],
          [
            '"If you skip a day, don\'t think that you have failed. Just start again the next day."',
            "错过一天不代表失败，第二天接着做就行。",
          ],
        ],
      ],
    }),
  ],
};
