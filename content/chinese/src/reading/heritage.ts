// The reading units of the heritage bridges (docs/chinese-curriculum.md §8.2): passages written for older learners who speak
// Chinese, a unit a bridge, each passage with a short check, in the characters the bridge has taught.

import type { ReadingUnitDef } from "@ga/content";

import { question, unitAfter } from "./kit.ts";

/** bridgeOneFamily is the first bridge's reading unit about a family across two countries. */
const bridgeOneFamily = unitAfter(
  "heritage-sound-alike",
  "chinese-reading-heritage-1-family",
  ["两个国家的一家人", "One Family, Two Countries"],
  [
    {
      id: "chinese-grandma-on-the-screen",
      title: ["电脑上的奶奶", "Grandma on the Screen"],
      body: `每个星期天早上，我都在电脑上和奶奶说话。我这里是早上，奶奶那里已经是晚上了。

奶奶问我：“学校怎么样？饭吃得好吗？”我说：“都很好，您别担心。”奶奶笑了，拿着电脑走到门外，让我看她种的花。

我们虽然离得很远，可是每个星期天，我们都离得很近。`,
      xp: 2,
      questions: [
        question(
          ["“我”什么时候和奶奶说话？", "When does the narrator talk with Grandma?"],
          ["每个星期天早上", "Every Sunday morning"],
          [
            ["每天晚上", "Every evening"],
            ["每个星期六下午", "Every Saturday afternoon"],
            ["过年的时候", "At New Year"],
          ],
          [
            "第一句说：“每个星期天早上，我都在电脑上和奶奶说话。”",
            "The first sentence says the narrator talks with Grandma every Sunday morning.",
          ],
        ),
        question(
          ["“我”这里是早上，奶奶那里是什么时候？", "When it is morning for the narrator, what time is it for Grandma?"],
          ["晚上", "Evening"],
          [
            ["也是早上", "Morning too"],
            ["中午", "Noon"],
            ["下午", "Afternoon"],
          ],
          [
            "文中说：“奶奶那里已经是晚上了。”两个国家的时间不一样。",
            "The text says it is already evening where Grandma is: the two countries keep different times.",
          ],
        ),
        question(
          ["奶奶让“我”看什么？", "What does Grandma show the narrator?"],
          ["她种的花", "The flowers she grows"],
          [
            ["她做的饭", "A meal she has cooked"],
            ["她新买的衣服", "Her new clothes"],
            ["家里的小猫", "The family cat"],
          ],
          ["奶奶“拿着电脑走到门外，让我看她种的花”。", "Grandma carries the computer outside to show the narrator the flowers she grows."],
        ),
      ],
    },
    {
      id: "chinese-new-year-far-from-home",
      title: ["在外国过春节", "New Year Far from Home"],
      body: `春节到了，可是我们家住在外国，这里的人不过春节，我和弟弟还要去学校上课。

妈妈说：“没关系，我们自己过。”下午放学回家，爸爸已经买来了鱼和肉，妈妈做了一大桌子菜。我和弟弟穿上了红衣服。

吃饭前，我们给爷爷奶奶打电话，大声说：“新年好！”窗外下着雪，家里很暖和。`,
      xp: 2,
      questions: [
        question(
          ["春节那天，“我”和弟弟白天做什么？", "What do the narrator and the brother do during the day at New Year?"],
          ["去学校上课", "They go to school"],
          [
            ["在家里休息", "They rest at home"],
            ["去看爷爷奶奶", "They visit their grandparents"],
            ["和爸爸去买鱼", "They go with Dad to buy fish"],
          ],
          [
            "文中说：“这里的人不过春节，我和弟弟还要去学校上课。”",
            "The text says people there do not keep the festival, so the children still have to go to school.",
          ],
        ),
        question(
          ["妈妈说“我们自己过”，是什么意思？", "What does Mum mean by 'we will keep it ourselves'?"],
          ["别人不过，我们家也要过春节", "Even if no one else does, the family will celebrate"],
          [
            ["今年不过春节了", "They will skip the festival this year"],
            ["一个人在家过春节", "Each person will celebrate alone"],
            ["回国去过春节", "They will go back to China for it"],
          ],
          [
            "后面写了爸爸买菜、妈妈做菜、全家打电话，一家人还是过了春节。",
            "Dad buys food, Mum cooks a feast and they all call home: the family keeps the festival anyway.",
          ],
        ),
        question(
          ["吃饭前，他们做了什么？", "What do they do before the meal?"],
          ["给爷爷奶奶打电话", "They call their grandparents"],
          [
            ["出去看雪", "They go out to see the snow"],
            ["给老师写信", "They write to their teacher"],
            ["去商店买衣服", "They go shopping for clothes"],
          ],
          [
            "文中说：“吃饭前，我们给爷爷奶奶打电话，大声说：‘新年好！’”",
            "Before eating, they phone their grandparents and call out 'Happy New Year!'",
          ],
        ),
      ],
    },
    {
      id: "chinese-the-words-we-speak-at-home",
      title: ["家里的话", "The Words We Speak at Home"],
      body: `我们家说的中文，和中文学校老师说的不太一样。妈妈说，我们说的是老家的话。

我们老家的人说话很快，听起来像在唱歌。有的字，老家的话和老师说的完全不一样。

在学校，我学老师的说法；回到家，我说老家的话。爷爷说：“两种话你都要会，这样你走到哪里，都能和人说上话。”`,
      xp: 2,
      questions: [
        question(
          ["“我们家说的中文”是什么话？", "What kind of Chinese does the family speak at home?"],
          ["老家的话", "The speech of their home town"],
          [
            ["老师教的话", "The Chinese the teacher teaches"],
            ["外国话", "A foreign language"],
            ["电视上的话", "The Chinese on television"],
          ],
          ["妈妈说：“我们说的是老家的话。”", "Mum says that what they speak is the speech of their home town."],
        ),
        question(
          ["老家的人说话听起来像什么？", "What does the home-town speech sound like?"],
          ["像在唱歌", "Like singing"],
          [
            ["像在哭", "Like crying"],
            ["像在生气", "Like being angry"],
            ["像在读书", "Like reading aloud"],
          ],
          [
            "文中说：“我们老家的人说话很快，听起来像在唱歌。”",
            "The text says people from their home town speak fast, and it sounds like singing.",
          ],
        ),
        question(
          ["爷爷为什么要“我”两种话都会？", "Why does Grandpa want the narrator to speak both?"],
          ["走到哪里都能和人说上话", "So the narrator can talk with people anywhere"],
          [
            ["这样考试能考好", "So the narrator does well in exams"],
            ["老师要这样做", "Because the teacher asks for it"],
            ["这样就不用学写字了", "So the narrator need not learn to write"],
          ],
          ["爷爷说：“这样你走到哪里，都能和人说上话。”", "Grandpa says that this way the narrator can talk with people wherever they go."],
        ),
      ],
    },
  ],
);

/** bridgeOneWeekends is the first bridge's reading unit about weekends: the family restaurant, Chinese school and a letter. */
const bridgeOneWeekends = unitAfter(
  "heritage-sound-alike",
  "chinese-reading-heritage-1-weekends",
  ["我的周末", "My Weekends"],
  [
    {
      id: "chinese-saturdays-at-the-restaurant",
      title: ["饭馆里的星期六", "Saturdays at the Restaurant"],
      body: `每个星期六，我都去爸爸妈妈的饭馆帮忙。我的工作是给客人送茶，客人走了，再把桌子收拾干净。

有一个老先生，每次来都要一碗牛肉面。他对我说：“你们家的面，是我吃过最好吃的。”我听了，心里很高兴。

晚上回到家，我的脚很累，可是我觉得自己长大了。`,
      xp: 2,
      questions: [
        question(
          ["“我”在饭馆做什么工作？", "What is the narrator's job at the restaurant?"],
          ["给客人送茶，收拾桌子", "Serving tea and clearing tables"],
          [
            ["在厨房做面", "Making noodles in the kitchen"],
            ["给客人拿钱", "Taking customers' money"],
            ["去商店买菜", "Buying food at the shop"],
          ],
          [
            "文中说：“我的工作是给客人送茶，客人走了，再把桌子收拾干净。”",
            "The text says the narrator serves tea and clears the tables when customers leave.",
          ],
        ),
        question(
          ["老先生每次来都要什么？", "What does the old gentleman always order?"],
          ["一碗牛肉面", "A bowl of beef noodles"],
          [
            ["一杯茶", "A cup of tea"],
            ["一条鱼", "A fish"],
            ["一碗鸡汤", "A bowl of chicken soup"],
          ],
          ["文中说：“有一个老先生，每次来都要一碗牛肉面。”", "The text says an old gentleman orders a bowl of beef noodles every time."],
        ),
        question(
          ["晚上回家，“我”觉得怎么样？", "How does the narrator feel at home that evening?"],
          ["脚很累，可是觉得自己长大了", "Tired feet, but grown up"],
          [
            ["很生气，不想再去了", "Angry and unwilling to go again"],
            ["一点儿也不累", "Not tired at all"],
            ["很饿，想吃牛肉面", "Hungry for beef noodles"],
          ],
          ["最后一段说：“我的脚很累，可是我觉得自己长大了。”", "The last paragraph says the narrator's feet ache but they feel grown up."],
        ),
      ],
    },
    {
      id: "chinese-sunday-chinese-school",
      title: ["星期天的中文学校", "Sunday Chinese School"],
      body: `星期天上午，我去中文学校上课。班里的同学和我一样，家里人都说中文，我们也都会说，可是不太会读，也不太会写。

老师说：“你们已经会说了，认字就快多了。”她说得对。很多字，我一看就知道它怎么读，因为我早就会说。

现在，我认识的字越来越多。上个星期，我自己读完了一本小书。`,
      xp: 2,
      questions: [
        question(
          ["班里的同学有什么一样的地方？", "What do the classmates have in common?"],
          ["会说中文，可是不太会读和写", "They speak Chinese but hardly read or write it"],
          [
            ["都不会说中文", "None of them speaks Chinese"],
            ["都是从中国来的", "They all came from China"],
            ["都会读很多书", "They can all read many books"],
          ],
          ["文中说：“我们也都会说，可是不太会读，也不太会写。”", "The text says they all speak it but cannot really read or write it."],
        ),
        question(
          ["为什么“我”一看字就知道它怎么读？", "Why does the narrator recall a character's sound at a glance?"],
          ["因为早就会说这个字", "Because they could already say the word"],
          [
            ["因为老师每天读给他听", "Because the teacher reads it every day"],
            ["因为字很简单", "Because the characters are simple"],
            ["因为在家写过很多次", "Because they have written it many times at home"],
          ],
          [
            "文中说：“我一看就知道它怎么读，因为我早就会说。”",
            "The text says the sound comes to mind because the narrator already knew how to say it.",
          ],
        ),
        question(
          ["上个星期，“我”做到了什么？", "What did the narrator manage last week?"],
          ["自己读完了一本小书", "Read a little book alone"],
          [
            ["写了一本小书", "Wrote a little book"],
            ["考了第一名", "Came first in a test"],
            ["教同学认字", "Taught classmates characters"],
          ],
          [
            "最后一句说：“上个星期，我自己读完了一本小书。”",
            "The last sentence says that last week the narrator read a little book alone.",
          ],
        ),
      ],
    },
    {
      id: "chinese-a-letter-from-grandpa",
      title: ["爷爷的信", "A Letter from Grandpa"],
      body: `今天，我收到了爷爷写的信。爷爷的字写得又大又好认，因为他知道我认识的字还不多。

信里说：“家门前的树又长高了。等你回来，我们一起去山上看花。”

我把信读了两遍，放在床头。晚上，我也给爷爷写了几句话：“爷爷，我想您。明年夏天，我们一起去看花。”`,
      xp: 2,
      questions: [
        question(
          ["爷爷为什么把字写得又大又好认？", "Why does Grandpa write in large, clear characters?"],
          ["他知道“我”认识的字还不多", "He knows the narrator cannot read many characters yet"],
          [
            ["他的眼睛不好", "His eyes are poor"],
            ["他的笔很大", "His pen is big"],
            ["老师让他这样写", "The teacher asked him to"],
          ],
          [
            "文中说：“爷爷的字写得又大又好认，因为他知道我认识的字还不多。”",
            "The text says he knows the narrator reads few characters, so he writes each one clearly.",
          ],
        ),
        question(
          ["爷爷在信里说了什么？", "What does Grandpa say in his letter?"],
          ["家门前的树长高了，等“我”回来一起看花", "The tree has grown, and they will see the flowers when the narrator comes"],
          [
            ["他要来外国看“我”", "He is coming abroad to visit"],
            ["他病了，要去医院", "He is ill and going to hospital"],
            ["家里买了新房子", "The family has bought a new house"],
          ],
          [
            "信里说：“家门前的树又长高了。等你回来，我们一起去山上看花。”",
            "The letter says the tree has grown taller, and they will go up the hill to see the flowers.",
          ],
        ),
        question(
          ["“我”是怎样对待这封信的？", "What does the narrator do with the letter?"],
          ["读了两遍，放在床头", "Reads it twice and keeps it by the bed"],
          [
            ["读了一遍就忘了", "Reads it once and forgets it"],
            ["拿给同学看", "Shows it to classmates"],
            ["放在书包里", "Puts it in a school bag"],
          ],
          ["文中说：“我把信读了两遍，放在床头。”", "The text says the narrator reads it twice and puts it by the bed."],
        ),
      ],
    },
  ],
);

/** bridgeTwoVisit is the second bridge's reading unit about a first visit to the grandparents' town. */
const bridgeTwoVisit = unitAfter(
  "heritage-written-forms",
  "chinese-reading-heritage-2-visit",
  ["回老家", "Back to the Home Town"],
  [
    {
      id: "chinese-the-first-trip-back",
      title: ["第一次回老家", "The First Trip Back"],
      body: `我十二岁那年夏天，爸爸带我回老家。飞机飞了十几个小时，又坐了三个小时的汽车，我们才到。

老家是一个小城，街道不宽，两边都是老房子。爷爷奶奶早就站在门口等我们。奶奶一见到我，就拉着我的手，说：“长这么高了！电脑上看着小，真人这么大！”

我本来有点紧张，怕自己的中文说得不好。可是奶奶说的话我都听得懂，我说的话奶奶也都听得懂。那天晚上，我们一直说到很晚，好像从来没有分开过。`,
      xp: 3,
      questions: [
        question(
          ["“我”和爸爸是怎样回到老家的？", "How do the narrator and Dad reach the home town?"],
          ["先坐飞机，再坐汽车", "First by plane, then by car"],
          [
            ["一直坐火车", "By train all the way"],
            ["只坐了飞机", "By plane only"],
            ["先坐船，再走路", "By boat, then on foot"],
          ],
          [
            "文中说：“飞机飞了十几个小时，又坐了三个小时的汽车，我们才到。”",
            "The text says they flew for over ten hours and then rode three hours by car.",
          ],
        ),
        question(
          ["奶奶说“电脑上看着小，真人这么大”，是什么意思？", "What does Grandma mean by 'small on the computer, so big in person'?"],
          ["她以前只在电脑上见过“我”，没想到“我”这么高", "She had only seen the narrator on screen and is surprised how tall they are"],
          [
            ["她觉得电脑太小了", "She thinks the computer is too small"],
            ["她想买一个大电脑", "She wants a bigger computer"],
            ["她认为“我”太瘦了", "She thinks the narrator is too thin"],
          ],
          [
            "奶奶一直在电脑上看孙子，这是第一次见到真人，所以觉得他长得这么高。",
            "Grandma had only seen the child on video, so meeting in person she is struck by how tall they have grown.",
          ],
        ),
        question(
          ["“我”本来担心什么？后来怎么样？", "What was the narrator worried about, and how did it turn out?"],
          ["怕中文说得不好，后来发现和奶奶都听得懂", "That their Chinese was poor; in fact they and Grandma understood each other"],
          [
            ["怕坐飞机，后来不怕了", "Flying, but they got over it"],
            ["怕老家太热，后来下雨了", "The heat, but then it rained"],
            ["怕爷爷生气，后来爷爷笑了", "Grandpa being cross, but he smiled"],
          ],
          [
            "文中说：“我本来有点紧张，怕自己的中文说得不好。可是奶奶说的话我都听得懂……”",
            "The text says the narrator feared their Chinese was poor, but they and Grandma understood each other completely.",
          ],
        ),
      ],
    },
    {
      id: "chinese-the-morning-market",
      title: ["早上的菜市场", "The Morning Market"],
      body: `在老家的第二天，奶奶六点就叫我起床，带我去菜市场。

市场里人很多，很热闹。卖菜的、卖鱼的、卖水果的，都在大声叫着。奶奶跟每个人都认识，走几步就要停下来说几句话。她总是把我拉到前面：“这是我孙子，从外国回来的。”

奶奶让我自己去买两斤苹果。我有点怕，可还是走过去说：“阿姨，苹果多少钱一斤？”阿姨笑着说：“你的中文说得真好！”她还多给了我一个。

回家的路上，奶奶说：“你看，你一开口，大家就知道你是我们这里的人。”`,
      xp: 3,
      questions: [
        question(
          ["奶奶在市场里为什么走几步就要停下来？", "Why does Grandma keep stopping at the market?"],
          ["她跟每个人都认识，要说几句话", "She knows everyone and stops to chat"],
          [
            ["她走累了，要休息", "She is tired and needs a rest"],
            ["她在找便宜的菜", "She is hunting for cheap vegetables"],
            ["市场里的路不好走", "The paths are hard to walk on"],
          ],
          [
            "文中说：“奶奶跟每个人都认识，走几步就要停下来说几句话。”",
            "The text says Grandma knows everyone and stops every few steps to chat.",
          ],
        ),
        question(
          ["“我”在市场里自己做了什么？", "What does the narrator do alone at the market?"],
          ["买了两斤苹果", "Buys a kilo of apples"],
          [
            ["买了一条鱼", "Buys a fish"],
            ["卖了一些水果", "Sells some fruit"],
            ["找到了回家的路", "Finds the way home"],
          ],
          ["奶奶让“我”自己去买两斤苹果，两斤就是一公斤。", "Grandma sends the narrator to buy two jin of apples, which is one kilogram."],
        ),
        question(
          ["卖苹果的阿姨为什么多给了“我”一个？", "Why does the stallholder give an extra apple?"],
          ["她喜欢“我”说中文", "She is pleased by the narrator's Chinese"],
          [
            ["苹果太小了", "The apples are too small"],
            ["奶奶让她给的", "Grandma told her to"],
            ["“我”多给了钱", "The narrator paid too much"],
          ],
          [
            "阿姨笑着说：“你的中文说得真好！”然后多给了一个，是喜欢这个孩子。",
            "She smiles and praises the narrator's Chinese, then adds one more as a kindness.",
          ],
        ),
      ],
    },
    {
      id: "chinese-saying-goodbye",
      title: ["说再见", "Saying Goodbye"],
      body: `一个月很快就过去了。走的那天早上，奶奶起得特别早，给我们做了一大碗面，里面放了两个鸡蛋。她说，这是老家的习惯，出远门前要吃面，路才会走得长长久久、平平安安。

爷爷不太说话，一直帮我们拿东西。到了车站，他从口袋里拿出一个红包，放在我手里：“好好学习，常回来看看。”

汽车开了，我从窗口看见爷爷奶奶还站在那里，越来越小。我心里很难过。爸爸拍拍我的肩说：“我们明年还回来。”我点点头，把红包拿得紧紧的。`,
      xp: 3,
      questions: [
        question(
          ["走的那天，奶奶为什么要给我们做面？", "Why does Grandma make noodles on the day they leave?"],
          ["老家的习惯，出远门前吃面，路上平安", "It is a home-town custom: noodles before a journey bring a safe road"],
          [
            ["因为家里只有面", "There is nothing else in the house"],
            ["因为“我”最爱吃面", "Noodles are the narrator's favourite"],
            ["因为面做起来最快", "Noodles are quickest to make"],
          ],
          [
            "文中说：“这是老家的习惯，出远门前要吃面，路才会走得长长久久、平平安安。”",
            "The text says it is a local custom to eat noodles before a long journey, for a long and safe road.",
          ],
        ),
        question(
          ["在车站，爷爷给了“我”什么？", "What does Grandpa give the narrator at the station?"],
          ["一个红包", "A red envelope"],
          [
            ["一本书", "A book"],
            ["一碗面", "A bowl of noodles"],
            ["一张照片", "A photograph"],
          ],
          [
            "文中说：“他从口袋里拿出一个红包，放在我手里。”",
            "The text says he takes a red envelope from his pocket and puts it in the narrator's hand.",
          ],
        ),
        question(
          ["最后，“我”为什么把红包拿得紧紧的？", "Why does the narrator hold the red envelope tightly at the end?"],
          ["舍不得爷爷奶奶，红包是爷爷的心意", "They miss their grandparents, and it holds Grandpa's love"],
          [
            ["怕红包里的钱被人拿走", "They fear someone will steal the money"],
            ["想马上去买东西", "They want to go shopping at once"],
            ["爸爸让他拿紧", "Dad told them to hold it tight"],
          ],
          [
            "“我”心里很难过，红包是爷爷给的，拿紧红包，就像拉着爷爷的手。",
            "The narrator is sad to leave; holding Grandpa's gift tight is a way of holding on to him.",
          ],
        ),
      ],
    },
  ],
);

/** bridgeTwoKitchen is the second bridge's reading unit about the family's food and festivals kept abroad. */
const bridgeTwoKitchen = unitAfter(
  "heritage-written-forms",
  "chinese-reading-heritage-2-kitchen",
  ["家里的味道", "The Taste of Home"],
  [
    {
      id: "chinese-mums-red-braised-pork",
      title: ["妈妈的红烧肉", "Mum's Red-Braised Pork"],
      body: `妈妈做的红烧肉，是我们家最有名的菜。每次有朋友来，大家都要问：“今天有红烧肉吗？”

这道菜是外公教妈妈的，外公又是跟他的妈妈学的。妈妈说，做红烧肉不能急。先把肉切成一块一块的，再放糖，用小火慢慢地烧，要烧一个多小时。

今年，妈妈开始教我做。第一次，我的火太大，肉烧得有点黑。妈妈没有生气，她说：“我第一次做，比你的还黑呢。”

我想，等我长大了，也要把这道菜教给我的孩子。`,
      xp: 3,
      questions: [
        question(
          ["妈妈是跟谁学做红烧肉的？", "Who taught Mum to make red-braised pork?"],
          ["外公", "Her father, the narrator's grandfather"],
          [
            ["她的朋友", "A friend of hers"],
            ["饭馆的老师", "A restaurant chef"],
            ["电视上的人", "Someone on television"],
          ],
          ["文中说：“这道菜是外公教妈妈的。”", "The text says Grandpa, Mum's father, taught her the dish."],
        ),
        question(
          ["妈妈说做红烧肉最要注意什么？", "What does Mum say matters most when making the dish?"],
          ["不能急，要用小火慢慢烧", "Not to rush, but to cook it slowly on a low flame"],
          [
            ["火要越大越好", "The bigger the flame the better"],
            ["肉要切得很大", "The pieces must be big"],
            ["糖要放得很多", "Use a lot of sugar"],
          ],
          [
            "文中说：“做红烧肉不能急……用小火慢慢地烧，要烧一个多小时。”",
            "The text says you cannot rush it: it simmers slowly on a low flame for over an hour.",
          ],
        ),
        question(
          ["“我”第一次把肉烧黑了，妈妈怎么做？", "How does Mum react when the narrator burns the pork?"],
          ["没有生气，说她第一次烧得更黑", "She is not cross, and says her first try was even darker"],
          [
            ["让“我”不要再做了", "She tells the narrator to give up"],
            ["很生气，把肉倒了", "She is angry and throws it away"],
            ["自己重新做了一次", "She remakes it herself"],
          ],
          [
            "妈妈说：“我第一次做，比你的还黑呢。”她用这句话让“我”不要难过。",
            "Mum says her first attempt was even darker, so the narrator need not feel bad.",
          ],
        ),
      ],
    },
    {
      id: "chinese-mooncakes-in-a-foreign-kitchen",
      title: ["厨房里的月饼", "Mooncakes in Our Kitchen"],
      body: `中秋节快到了。在我们住的城市，商店里买不到好吃的月饼，妈妈就说：“我们自己做！”

星期六下午，全家都在厨房里忙。妈妈和面，爸爸炒豆沙，我和妹妹把豆沙包进面里，再放进小木盒里压出花来。妹妹包的月饼大大小小，有的还破了口，可是她最开心。

月饼做好了，我们给邻居送去了几个，还教他们说“中秋快乐”。晚上，月亮又大又圆，我们坐在院子里，一边吃月饼，一边给国内的家人打电话。电话里，外公说：“我们看的是同一个月亮。”`,
      xp: 3,
      questions: [
        question(
          ["他们为什么自己做月饼？", "Why do they make mooncakes themselves?"],
          ["在他们住的城市买不到好吃的月饼", "Good mooncakes cannot be bought in their city"],
          [
            ["自己做的更便宜", "Homemade ones are cheaper"],
            ["老师让他们做", "The teacher asked them to"],
            ["家里的月饼吃完了", "They have run out of mooncakes"],
          ],
          ["文中说：“在我们住的城市，商店里买不到好吃的月饼。”", "The text says the shops in their city do not sell good mooncakes."],
        ),
        question(
          ["做月饼的时候，“我”和妹妹做什么？", "What do the narrator and the little sister do?"],
          ["把豆沙包进面里，放进木盒里压出花", "Wrap the bean paste in dough and press patterns with a wooden mould"],
          [
            ["和面", "Knead the dough"],
            ["炒豆沙", "Cook the bean paste"],
            ["去商店买月饼", "Buy mooncakes at the shop"],
          ],
          [
            "和面的是妈妈，炒豆沙的是爸爸，“我”和妹妹负责包和压。",
            "Mum makes the dough and Dad the bean paste; the children wrap and press.",
          ],
        ),
        question(
          ["外公说“我们看的是同一个月亮”，是什么意思？", "What does Grandpa mean by 'we are looking at the same moon'?"],
          ["虽然离得远，一家人的心还在一起", "Though far apart, the family is still together in heart"],
          [
            ["国内的月亮比较大", "The moon is bigger in China"],
            ["他也在外国", "He is abroad too"],
            ["他明天要来吃月饼", "He is coming tomorrow for mooncakes"],
          ],
          [
            "两个国家离得很远，可是大家看着同一个月亮过节，好像在一起。",
            "The family is split between two countries, but under one moon they feel together.",
          ],
        ),
      ],
    },
    {
      id: "chinese-learning-grandmas-soup-by-phone",
      title: ["电话里学做汤", "Learning Grandma's Soup by Phone"],
      body: `妈妈病了，在床上躺着。爸爸出门工作了，我想给妈妈做一碗她最爱喝的汤，可是我不会。

我用手机给国内的奶奶打电话，让她能看见我。奶奶一听，马上说：“别急，我教你。”她让我把手机放在桌子上，对着锅。

“先放水，水开了放姜，再放鸡肉……火小一点，好！”奶奶在电话那头看着，一步一步地教我。我手忙脚乱，可是奶奶一点儿也不急。

汤做好了，我端给妈妈。妈妈喝了一口，眼睛红了：“这就是你奶奶的味道。”我知道，这碗汤是我和奶奶一起做的。`,
      xp: 3,
      questions: [
        question(
          ["“我”为什么要做汤？", "Why does the narrator want to make soup?"],
          ["妈妈病了，想给她做她最爱喝的汤", "Mum is ill and the narrator wants to make her favourite soup"],
          [
            ["学校要考做饭", "There is a cooking test at school"],
            ["家里来了客人", "Guests have arrived"],
            ["爸爸让“我”做", "Dad asked the narrator to"],
          ],
          [
            "文中说：“妈妈病了……我想给妈妈做一碗她最爱喝的汤。”",
            "The text says Mum is ill and the narrator wants to make her favourite soup.",
          ],
        ),
        question(
          ["奶奶是怎样教“我”的？", "How does Grandma teach the narrator?"],
          ["在手机里看着，一步一步地教", "She watches on a video call and guides each step"],
          [
            ["写了一封信寄过来", "She posts a letter with the recipe"],
            ["坐飞机过来教", "She flies over to teach"],
            ["让“我”去看书", "She tells the narrator to look in a book"],
          ],
          [
            "文中说：“奶奶在电话那头看着，一步一步地教我。”",
            "The text says Grandma watches from the other end of the call and teaches step by step.",
          ],
        ),
        question(
          ["妈妈喝了汤，为什么眼睛红了？", "Why do Mum's eyes fill with tears?"],
          ["汤有奶奶的味道，她很感动", "The soup tastes like Grandma's and moves her"],
          [
            ["汤太辣了", "The soup is too spicy"],
            ["汤太热了", "The soup is too hot"],
            ["她不喜欢这碗汤", "She does not like it"],
          ],
          [
            "妈妈说：“这就是你奶奶的味道。”她想起了家，也为孩子感动。",
            "Mum says it tastes just like Grandma's: she is moved by home and by her child.",
          ],
        ),
      ],
    },
  ],
);

/** bridgeThreeWork is the third bridge's reading unit about work and helping others. */
const bridgeThreeWork = unitAfter(
  "heritage-register",
  "chinese-reading-heritage-3-work",
  ["在两种语言之间", "Between Two Languages"],
  [
    {
      id: "chinese-the-translator-at-table-six",
      title: ["六号桌的翻译", "The Translator at Table Six"],
      body: `暑假里，我在叔叔的饭馆打工。叔叔的饭馆在城市的中心，来吃饭的有本地人，也有刚从中国来旅游的客人。

一天中午，六号桌坐着一位老奶奶，她不会说英语，菜单上的字她又看不太清楚，正着急。服务员是本地人，听不懂她的话。叔叔让我过去帮忙。

我走过去，先问了一声：“奶奶，您好，您想吃点儿什么？”老奶奶一听我说中文，马上笑了。她说她从南方来看女儿，女儿在上班，她自己出来走走。我把菜单上的菜一个一个读给她听，又告诉她哪个菜不辣，哪个菜比较软，适合老人。

吃完饭，老奶奶拉着我的手说：“孩子，你的中文说得这么好，你爸妈一定很高兴。”我有点不好意思，因为平时在家，我常常不愿意说中文。

那天下班后，我想了很久。原来会说两种语言，不只是多一个本领，有时候，它能让一个在外面的人觉得像在家里一样。`,
      xp: 4,
      questions: [
        question(
          ["老奶奶为什么着急？", "Why is the old lady anxious?"],
          ["她不会说英语，也看不清菜单", "She speaks no English and cannot read the menu clearly"],
          [
            ["她找不到女儿了", "She has lost her daughter"],
            ["她的钱不够", "She does not have enough money"],
            ["饭菜上得太慢", "The food is slow to arrive"],
          ],
          [
            "文中说：“她不会说英语，菜单上的字她又看不太清楚，正着急。”",
            "The text says she speaks no English and cannot read the menu well, so she is anxious.",
          ],
        ),
        question(
          ["“我”是怎样帮老奶奶的？", "How does the narrator help her?"],
          ["把菜读给她听，还告诉她哪些菜适合老人", "Reads out the dishes and suggests ones suited to an older person"],
          [
            ["给她换了一张新菜单", "Brings her a new menu"],
            ["给她女儿打了电话", "Phones her daughter"],
            ["请她去别的饭馆", "Sends her to another restaurant"],
          ],
          [
            "文中说：“我把菜单上的菜一个一个读给她听，又告诉她哪个菜不辣，哪个菜比较软，适合老人。”",
            "The narrator reads each dish aloud and says which are mild and soft, suitable for an older person.",
          ],
        ),
        question(
          ["那天以后，“我”明白了什么？", "What does the narrator come to understand?"],
          ["会两种语言能让在外面的人觉得像在家里", "Speaking two languages can make someone far from home feel at home"],
          [
            ["在饭馆打工太累了", "Restaurant work is too tiring"],
            ["学英语比学中文重要", "English matters more than Chinese"],
            ["老人不应该一个人出门", "Older people should not go out alone"],
          ],
          [
            "最后一段说，会说两种语言，“有时候，它能让一个在外面的人觉得像在家里一样”。",
            "The last paragraph says two languages can make someone far from home feel at home.",
          ],
        ),
      ],
    },
    {
      id: "chinese-teaching-the-little-ones",
      title: ["当小老师", "Teaching the Little Ones"],
      body: `上了高中以后，中文学校的王老师问我愿不愿意来当助教，帮她带一年级的小朋友。我答应了。

第一次上课，我就发现这比我想的难多了。一年级的孩子坐不住，有的在桌子下面找铅笔，有的一直问什么时候下课。我说了好几遍“请安静”，教室里还是很吵。

下课后，王老师笑着对我说：“你小时候，跟他们一模一样。”她告诉我，跟小孩子说话，要用他们的话。不要说“请注意”，要说“看看谁的小眼睛最亮”。

下一次上课，我试了试王老师的办法。我还把生字编成小故事：“休”，就是一个人靠在树边休息。孩子们听得很认真，有的还举手要讲自己的故事。

现在我明白了，同一个意思，对不同的人要用不同的说法。对老师说话要有礼貌，对小朋友说话要亲切有趣，这也是学中文的一部分。`,
      names: ["王"],
      xp: 4,
      questions: [
        question(
          ["第一次上课，遇到了什么问题？", "What goes wrong in the first lesson?"],
          ["孩子们坐不住，教室里很吵", "The children cannot sit still and the room is noisy"],
          [
            ["孩子们都不会说中文", "None of the children speaks Chinese"],
            ["王老师没有来", "The teacher does not come"],
            ["教室里没有桌子", "There are no desks"],
          ],
          ["文中说：“一年级的孩子坐不住……教室里还是很吵。”", "The text says the first graders cannot sit still and the room stays noisy."],
        ),
        question(
          ["王老师给了“我”什么建议？", "What advice does the teacher give?"],
          ["跟小孩子说话，要用他们的话", "Speak to little children in their own words"],
          [
            ["说话声音要大", "Speak louder"],
            ["不听话就不让下课", "Keep them in if they misbehave"],
            ["多给他们写作业", "Give them more homework"],
          ],
          ["王老师说：“跟小孩子说话，要用他们的话。”", "The teacher says to talk to little children in their own language."],
        ),
        question(
          ["“我”是怎样教“休”字的？", "How does the narrator teach the character 休?"],
          ["编成一个人靠在树边休息的小故事", "As a little story of a person leaning on a tree to rest"],
          [
            ["让孩子们写十遍", "By having the children write it ten times"],
            ["只读给他们听", "By only reading it aloud"],
            ["用英语解释", "By explaining it in English"],
          ],
          [
            "文中说：“‘休’，就是一个人靠在树边休息。”“休”的左边是人，右边是木。",
            "The narrator explains 休 as a person (亻) leaning on a tree (木) to rest.",
          ],
        ),
      ],
    },
    {
      id: "chinese-grandpa-and-the-phone-company",
      title: ["替外公打电话", "Calling on Grandpa's Behalf"],
      body: `外公来我们家住了半年。他不会说英语，什么事都要我和妈妈帮忙。

有一次，外公的手机突然不能上网了。妈妈在上班，只好由我给手机公司打电话。电话那头的工作人员说得很快，用的词我有好多都没听过。我一边听，一边用中文告诉外公，再把外公的问题翻成英语。说了二十多分钟，问题终于解决了。

挂了电话，我出了一身汗。外公拍拍我的肩膀，说：“好孩子，没有你，外公在这里就像不会说话的人。”

我听了心里有点酸。在老家，外公是一个很有学问的人，大家都来请教他。可是到了这里，他连一个电话都打不了，买东西、看病，都要等别人有空。

从那以后，我每天晚上教外公几个英语句子，外公教我写毛笔字。外公说：“我们两个，一个是老学生，一个是小老师。”`,
      xp: 4,
      questions: [
        question(
          ["给手机公司打电话时，“我”做了什么？", "What does the narrator do during the call?"],
          ["在中文和英语之间来回翻译", "Translates back and forth between Chinese and English"],
          [
            ["让工作人员说中文", "Asks the agent to speak Chinese"],
            ["把电话给了妈妈", "Hands the phone to Mum"],
            ["自己把手机修好了", "Fixes the phone alone"],
          ],
          [
            "文中说：“我一边听，一边用中文告诉外公，再把外公的问题翻成英语。”",
            "The narrator relays the agent's words in Chinese and puts Grandpa's questions into English.",
          ],
        ),
        question(
          ["“我”听了外公的话，为什么心里有点酸？", "Why does Grandpa's remark make the narrator feel a pang?"],
          ["外公在老家很有学问，在这里却什么都要靠别人", "Grandpa is learned at home but here must depend on others"],
          [
            ["外公说“我”做得不好", "Grandpa criticises the narrator"],
            ["外公要回老家了", "Grandpa is about to go home"],
            ["打电话花了很多钱", "The call cost a lot"],
          ],
          [
            "文中说：“在老家，外公是一个很有学问的人……可是到了这里，他连一个电话都打不了，买东西、看病，都要等别人有空。”",
            "The text contrasts Grandpa's standing at home with his helplessness abroad.",
          ],
        ),
        question(
          ["外公说“一个是老学生，一个是小老师”，指的是什么？", "What does Grandpa mean by 'an old pupil and a young teacher'?"],
          ["“我”教外公英语，外公也教“我”写毛笔字", "The narrator teaches him English while he teaches calligraphy"],
          [
            ["外公去学校上课了", "Grandpa has enrolled in a school"],
            ["“我”当上了学校的老师", "The narrator has become a schoolteacher"],
            ["外公以前是老师", "Grandpa used to be a teacher"],
          ],
          [
            "上一句说：“我每天晚上教外公几个英语句子，外公教我写毛笔字。”两个人互相学习。",
            "The previous sentence says each evening they teach each other: English for him, brush writing for the narrator.",
          ],
        ),
      ],
    },
  ],
);

/** bridgeThreeRoots is the third bridge's reading unit about the family's past and its letters. */
const bridgeThreeRoots = unitAfter(
  "heritage-register",
  "chinese-reading-heritage-3-roots",
  ["家的来路", "Where the Family Came From"],
  [
    {
      id: "chinese-my-first-letter-in-chinese",
      title: ["第一封中文信", "My First Letter in Chinese"],
      body: `外公八十岁生日快到了。妈妈说，今年我们回不去，你给外公写一封信吧，用中文写。

我坐在桌前，半天写不出一个字。平时我给外公打电话，张口就说：“外公，你吃饭了没？”可是写信不一样。妈妈告诉我，给长辈写信，开头要写“亲爱的外公”，要用“您”，不用“你”；结尾要写“祝您身体健康”，最后写上自己的名字和日期。

我先用英语想好要说的话，再一句一句写成中文。我写了小时候外公带我去公园划船，写了我现在学校里的事，还写了我很想念他。有好几个字不会写，我就查字典，一笔一笔地写。

信写了整整一个晚上，只有一页纸。妈妈看了，说有三个错字。我想重新写，妈妈却说：“不用改，外公看到你自己写的字，比什么礼物都高兴。”

两个星期后，外公打来电话，声音有点哑：“你的信，我放在枕头边，每天都看一遍。”`,
      xp: 4,
      questions: [
        question(
          ["给长辈写信和打电话有什么不同？", "How does writing to an elder differ from phoning?"],
          ["写信要用“您”，开头结尾都有一定的写法", "A letter uses 您 and set forms for the opening and closing"],
          [
            ["写信可以随便写", "A letter can be written any way you like"],
            ["写信只能用英语", "A letter must be in English"],
            ["写信不用写名字", "A letter needs no signature"],
          ],
          [
            "妈妈说：开头写“亲爱的外公”，要用“您”，结尾写“祝您身体健康”。",
            "Mum explains the opening 'Dear Grandpa', the polite 您 and the closing wish for good health.",
          ],
        ),
        question(
          ["遇到不会写的字，“我”怎么办？", "What does the narrator do with characters they cannot write?"],
          ["查字典，一笔一笔地写", "Looks them up and writes them stroke by stroke"],
          [
            ["用拼音代替", "Writes them in pinyin"],
            ["让妈妈替“我”写", "Asks Mum to write them"],
            ["用英语写", "Writes them in English"],
          ],
          [
            "文中说：“有好几个字不会写，我就查字典，一笔一笔地写。”",
            "The text says the narrator looked them up and wrote them stroke by stroke.",
          ],
        ),
        question(
          ["妈妈为什么说不用改错字？", "Why does Mum say not to correct the mistakes?"],
          ["外公最在乎的是孩子自己写的字", "What Grandpa will treasure is the child's own handwriting"],
          [
            ["错字很少，没关系", "Three mistakes hardly matter"],
            ["时间来不及了", "There is no time left"],
            ["外公看不出来", "Grandpa will not notice"],
          ],
          [
            "妈妈说：“外公看到你自己写的字，比什么礼物都高兴。”",
            "Mum says Grandpa will be happier with the child's own writing than with any present.",
          ],
        ),
      ],
    },
    {
      id: "chinese-the-old-photo-album",
      title: ["老相册", "The Old Photo Album"],
      body: `搬家的时候，我在柜子最里面找到了一本旧相册。相册的皮已经破了，里面的照片都是黑白的。

晚饭后，我把相册拿给爸爸看。爸爸翻开第一页，指着一个穿长衣服的年轻人说：“这是你太爷爷。他年轻的时候，坐了一个多月的船，才到这个国家。”

我从来没听说过这些事。爸爸一页一页地讲：太爷爷先在码头上搬东西，后来开了一家小书店；爷爷在店里长大，白天上学，晚上帮忙；再后来，爸爸考上了大学，成了第一个上大学的人。

最后一页是空的。爸爸说：“这一页，留给你。”

那天晚上，我把相册里的故事写了下来，用中文写了一遍，又用英语写了一遍。我想，以后我的孩子也许只会说英语，可是他们应该知道，我们家是从哪里来的，是怎样一步一步走到今天的。`,
      xp: 4,
      questions: [
        question(
          ["太爷爷是怎样来到这个国家的？", "How did the great-grandfather come to this country?"],
          ["坐了一个多月的船", "On a voyage of more than a month"],
          [
            ["坐飞机", "By plane"],
            ["坐火车", "By train"],
            ["走路过来的", "On foot"],
          ],
          ["爸爸说：“他年轻的时候，坐了一个多月的船，才到这个国家。”", "Dad says he came as a young man on a boat that took over a month."],
        ),
        question(
          ["下面哪一项是按时间顺序说的这家人的经历？", "Which gives the family's story in the right order?"],
          ["码头搬东西、开书店、爸爸上大学", "Dock work, a bookshop, then Dad going to university"],
          [
            ["开书店、码头搬东西、爸爸上大学", "A bookshop, dock work, then university"],
            ["爸爸上大学、开书店、码头搬东西", "University, a bookshop, then dock work"],
            ["码头搬东西、爸爸上大学、开书店", "Dock work, university, then a bookshop"],
          ],
          [
            "文中说：太爷爷“先在码头上搬东西，后来开了一家小书店”，“再后来，爸爸考上了大学”。",
            "The text says the great-grandfather first worked the docks, then opened a bookshop, and later Dad went to university.",
          ],
        ),
        question(
          ["爸爸说最后一页“留给你”，是什么意思？", "What does Dad mean by saving the last page for the narrator?"],
          ["家的故事还要由“我”接着写下去", "The narrator will carry the family's story on"],
          [
            ["让“我”在上面画画", "The narrator can draw on it"],
            ["那一页的照片丢了", "That page's photo is lost"],
            ["相册是送给“我”的礼物", "The album is a birthday present"],
          ],
          [
            "空着的一页，是给下一代的。这家人的故事，要由“我”接着写下去。",
            "The empty page is for the next generation: the narrator will continue the family's story.",
          ],
        ),
      ],
    },
    {
      id: "chinese-two-ways-of-saying-it",
      title: ["一句话，两种说法", "Two Ways of Saying It"],
      body: `我们家说的是广东话，可是我在中文学校学的是普通话。小时候，我常常把两种话混在一起说，闹出不少笑话。

有一次，我跟中文学校的同学说“我好钟意你”，同学听了，脸一下子红了。后来老师告诉我，“钟意”是广东话，就是普通话里的“喜欢”，可是我这样说，听起来像是在说“我爱上你了”。全班都笑了，我也笑了。

还有，在家里，我们管冰箱叫“雪柜”，管出租车叫“的士”。第一次去北京，我跟司机说要去哪里，司机说：“你这话，我得想一想。”

长大以后，我慢慢明白了：什么时候说哪种话，也是一种学问。跟外婆聊天，我说广东话，她觉得亲；在学校上课，在正式的地方讲话，我说普通话，大家都听得懂。写文章的时候，还要用书面的说法，不能像说话一样随便。

一种意思，可以有好几种说法。会用对的说法，别人才会真正明白你的心。`,
      names: ["广东", "北京"],
      glossed: ["钟意", "雪柜", "的士"],
      xp: 4,
      questions: [
        question(
          ["同学听了“我好钟意你”，为什么脸红了？", "Why does the classmate blush at 我好钟意你?"],
          ["听起来像在说“我爱上你了”", "It sounds like 'I have fallen for you'"],
          [
            ["同学听不懂广东话", "The classmate cannot understand Cantonese"],
            ["同学生气了", "The classmate is angry"],
            ["教室里太热了", "The classroom is too hot"],
          ],
          ["老师说，“我这样说，听起来像是在说‘我爱上你了’”。", "The teacher explains that it came across as 'I have fallen for you'."],
        ),
        question(
          ["“雪柜”在普通话里叫什么？", "What is 雪柜 called in Mandarin?"],
          ["冰箱", "Fridge"],
          [
            ["衣柜", "Wardrobe"],
            ["出租车", "Taxi"],
            ["书柜", "Bookcase"],
          ],
          ["文中说：“在家里，我们管冰箱叫‘雪柜’。”", "The text says that at home the family calls the fridge 雪柜."],
        ),
        question(
          ["作者认为，在正式的地方讲话该用什么？", "What does the writer say to use when speaking in formal settings?"],
          ["普通话，大家都听得懂", "Mandarin, which everyone understands"],
          [
            ["广东话，听起来亲", "Cantonese, which sounds warm"],
            ["英语，更方便", "English, which is easier"],
            ["想说哪种就说哪种", "Whichever one feels like"],
          ],
          [
            "文中说：“在学校上课，在正式的地方讲话，我说普通话，大家都听得懂。”",
            "The text says that in class and in formal settings the writer uses Mandarin so everyone understands.",
          ],
        ),
      ],
    },
  ],
);

/** heritageReading are the reading units of the heritage bridges, with the bridge that offers each. */
export const heritageReading: readonly { readonly bridge: number; readonly unit: ReadingUnitDef }[] = [
  { bridge: 1, unit: bridgeOneFamily },
  { bridge: 1, unit: bridgeOneWeekends },
  { bridge: 2, unit: bridgeTwoVisit },
  { bridge: 2, unit: bridgeTwoKitchen },
  { bridge: 3, unit: bridgeThreeWork },
  { bridge: 3, unit: bridgeThreeRoots },
];
