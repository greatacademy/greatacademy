// The reading unit of the A2 theme Shopping and Money: saving, spending, bargains and shops, with too and enough.

import { type ReadingUnitDef, t } from "@ga/content";
import { passageMaker } from "../pre-a1/reading-kit.ts";
import { readingWords } from "./reading-words.ts";

const passage = passageMaker(readingWords, [
  "a2-words-money",
  "a2-words-shops",
  "a2-words-things-we-buy",
  "a2-words-materials",
  "too-and-enough",
  "one-and-ones",
]);

/** readingMoney is the reading unit of the theme Shopping and Money. */
export const readingMoney: ReadingUnitDef = {
  id: "a2-reading-money",
  title: t("Shopping and Money", "购物和钱"),
  passages: [
    passage({
      id: "a2-money-saving-for-a-bike",
      title: ["Saving for a Bike", "攒钱买自行车"],
      body: `Last spring Ben saw a beautiful blue bike in the window of a shop. It cost three hundred dollars. "Can I have it for my birthday?" he asked his parents. "It's too expensive," said Dad. "But you can save for it."

Ben had only forty dollars in his wallet, so he made a plan. Every week his parents gave him five dollars, and he decided to save all of it. He also found small jobs. He washed the cars of the neighbors, walked their dogs and helped Mrs. Green in her garden. Every job paid five or ten dollars.

It wasn't easy. His friends bought candy and comics after school, but Ben didn't. Sometimes he wanted to spend his money, but he looked at a photo of the bike on his wall and said no.

After five months Ben had three hundred and ten dollars. He went back to the shop. The blue bike was still there, and it was on sale for two hundred and fifty! Ben bought it and a new lamp for it. "It's the best thing I have ever bought," he says, "because I paid for it myself."`,
      grammar: ["too-and-enough", "past-simple-irregular"],
      names: ["Ben", "Mrs", "Green"],
      questions: [
        [
          ["How much did the bike cost at first?", "这辆自行车原价多少钱？"],
          ["Three hundred dollars", "三百美元"],
          [
            ["Two hundred and fifty dollars", "二百五十美元"],
            ["Forty dollars", "四十美元"],
          ],
          ['The passage says: "It cost three hundred dollars."', "原价三百美元；二百五十美元是打折后的价格，四十美元是本一开始有的钱。"],
        ],
        [
          ["How did Ben get more money?", "本是怎样挣到更多钱的？"],
          ["He did small jobs for his neighbors", "给邻居做些小活"],
          [
            ["He sold his toys", "卖掉自己的玩具"],
            ["His grandparents gave it to him", "爷爷奶奶给他的"],
          ],
          [
            'The passage says: "He washed the cars of the neighbors, walked their dogs and helped Mrs. Green in her garden."',
            "他给邻居洗车、遛狗、帮忙打理花园，每次能挣五到十美元。",
          ],
        ],
        [
          ["Why was the bike cheaper when Ben went back?", "本回去时自行车为什么便宜了？"],
          ["It was on sale", "正在打折"],
          [
            ["It was broken", "它坏了"],
            ["It was very old", "它很旧了"],
          ],
          ['The passage says: "it was on sale for two hundred and fifty!"', "on sale 表示打折出售。"],
        ],
      ],
    }),
    passage({
      id: "a2-money-the-coin-collector",
      title: ["The Coin Collector", "收藏硬币的人"],
      body: `My grandpa has collected coins for fifty years. He has more than three thousand coins from a hundred and twenty countries. He keeps them in thick books, and every coin has its own little place.

When I visit him, we look at his coins together. Some are very old. His oldest coin is from China, and it is more than two thousand years old. It is small and brown, and it has Chinese words on it. Some coins are big and heavy, and some are tiny and thin. A few are gold or silver, but most are made of metal that is not expensive.

Grandpa doesn't collect coins because they cost a lot. Most of his coins are cheap. He collects them because every coin tells a story. "Look at this one," he says. "It is from a country that is gone now. You can't find its name on a map."

Last year he gave me my first coins: ten coins from ten different countries. Now I collect coins too. When my friends travel abroad, they bring me coins. I have forty-two now. Grandpa says that is a good start.`,
      grammar: ["present-perfect-with-ever-and-never", "one-and-ones", "comparatives-and-superlatives"],
      names: ["China"],
      questions: [
        [
          ["How long has Grandpa collected coins?", "爷爷收藏硬币多久了？"],
          ["Fifty years", "五十年"],
          [
            ["Ten years", "十年"],
            ["Two thousand years", "两千年"],
          ],
          [
            'The first sentence says: "My grandpa has collected coins for fifty years."',
            "爷爷收藏了五十年；两千年是他最老的那枚硬币的年龄。",
          ],
        ],
        [
          ["Why does Grandpa collect coins?", "爷爷为什么收藏硬币？"],
          ["Every coin tells a story", "每枚硬币都有一个故事"],
          [
            ["They cost a lot", "它们很值钱"],
            ["He wants to be rich", "他想变得富有"],
          ],
          ['The passage says: "He collects them because every coin tells a story."', "他的硬币大多很便宜，他收藏是因为每枚硬币都有故事。"],
        ],
        [
          ["How many coins does the writer have now?", "作者现在有多少枚硬币？"],
          ["Forty-two", "四十二枚"],
          [
            ["Ten", "十枚"],
            ["Three thousand", "三千枚"],
          ],
          ['The writer says: "I have forty-two now."', "爷爷给了作者十枚，现在作者有四十二枚；三千多枚是爷爷的。"],
        ],
      ],
    }),
    passage({
      id: "a2-money-a-bargain-at-the-market",
      title: ["A Bargain at the Market", "在市场捡了个便宜"],
      body: `Every Sunday there is a big market in the old town. You can buy almost anything there: fruit, clothes, old books, old chairs and tables, and even old cameras.

Last Sunday my mother wanted a bag for her work. At the first table she saw a nice brown leather bag. "How much is it?" she asked. "Eighty dollars," said the man. "That's too expensive," said Mom. "I can pay forty." The man laughed. "Seventy," he said. "Fifty," said Mom. In the end she bought it for sixty.

I was surprised. "You can't do that in a shop!" I said. "No," said Mom, "but at a market you can. No one pays the first price here."

Then I found an old camera for twenty dollars. I tried to get a bargain too. "Ten dollars?" I asked quietly. The old woman smiled. "Fifteen, because you're polite."

At home Dad looked at the camera. "This is a very good camera," he said. "In the shops it costs two hundred dollars!" It was the best bargain of the day.`,
      grammar: ["too-and-enough", "past-simple-irregular"],
      questions: [
        [
          ["How much did Mom pay for the bag?", "妈妈花多少钱买了那个包？"],
          ["Sixty dollars", "六十美元"],
          [
            ["Eighty dollars", "八十美元"],
            ["Forty dollars", "四十美元"],
          ],
          ['The passage says: "In the end she bought it for sixty."', "卖家开价八十，妈妈还价四十，最后六十成交。"],
        ],
        [
          ["Why did the old woman give a lower price?", "老太太为什么给了更低的价格？"],
          ["The writer was polite", "作者很有礼貌"],
          [
            ["The camera was broken", "相机坏了"],
            ["Mom asked her", "妈妈请她便宜点"],
          ],
          ['The old woman says: "Fifteen, because you\'re polite."', "因为作者很有礼貌，她以十五美元卖了相机。"],
        ],
        [
          ["What did Dad say about the camera?", "爸爸怎么说这台相机？"],
          ["It costs two hundred dollars in the shops", "在商店里要卖两百美元"],
          [
            ["It is broken", "它坏了"],
            ["It is too old", "它太旧了"],
          ],
          [
            'Dad says: "In the shops it costs two hundred dollars!"',
            "爸爸说这是一台很好的相机，商店里要两百美元，所以是当天最划算的买卖。",
          ],
        ],
      ],
    }),
    passage({
      id: "a2-money-cash-or-card",
      title: ["Cash or Card?", "现金还是卡？"],
      body: `Thirty years ago most people paid for everything with cash. Today more and more people pay with a card or with their phone. Which is better?

Cards and phones are fast and easy. You don't have to carry a heavy wallet full of coins, and you don't have to wait for your change. When you shop online, you have to pay with a card. And if you lose your card, the bank can stop it, but if you lose cash, it is gone.

But cash has good points too. When you pay with cash, you can see your money, and you know how much you have left. Many people spend more when they use a card, because it doesn't feel like real money. Also, some small shops and markets only take cash.

In some countries, like Sweden, almost no one uses cash now. In other countries cash is still very important, most of all for older people.

What about you? Do you use cash, a card or your phone? Many people use all three: a card for big things and cash for small ones.`,
      grammar: ["one-and-ones", "have-to", "comparatives-and-superlatives"],
      names: ["Sweden"],
      questions: [
        [
          ["Why can a card be safer than cash?", "为什么卡可能比现金更安全？"],
          ["The bank can stop a lost card", "丢了卡银行可以冻结"],
          [
            ["Cards are free", "卡是免费的"],
            ["Shops like cards more", "商店更喜欢卡"],
          ],
          [
            'The passage says: "if you lose your card, the bank can stop it, but if you lose cash, it is gone."',
            "卡丢了银行可以停用，现金丢了就没了。",
          ],
        ],
        [
          ["Why do many people spend more with a card?", "为什么很多人用卡花得更多？"],
          ["It doesn't feel like real money", "感觉不像真钱"],
          [
            ["Things are cheaper with a card", "用卡买东西更便宜"],
            ["Banks give them extra money", "银行会多给他们钱"],
          ],
          [
            'The passage says: "Many people spend more when they use a card, because it doesn\'t feel like real money."',
            "because 后面说明原因：用卡付钱感觉不像在花真钱。",
          ],
        ],
        [
          ["How do many people use all three?", "很多人怎样同时使用这三种方式？"],
          ["A card for big things and cash for small ones", "大额用卡，小额用现金"],
          [
            ["Cash online and a card in shops", "网上用现金，商店里用卡"],
            ["Only their phone at home", "在家只用手机"],
          ],
          ['The last sentence says: "a card for big things and cash for small ones."', "small ones 里的 ones 代替 things。"],
        ],
      ],
    }),
    passage({
      id: "a2-money-the-scarf-that-was-too-short",
      title: ["The Scarf That Was Too Short", "太短的围巾"],
      body: `Last month Anna ordered a red wool scarf from a website. It looked long and warm in the photo, and it was on sale. She was very pleased.

A week later the scarf arrived. Anna opened the envelope and put on the scarf. It was too short! It went around her neck only once. It was also too thin, and the color wasn't red. It was pink.

Anna wrote to the shop:

Hello,
I ordered a red scarf from your website on the third of March. It arrived yesterday, but there is a problem. It is too short and too thin, and it is pink, not red. Can I send it back and get my money back, or can you send me a longer one? I have the receipt.
Thank you,
Anna Ross

Two days later the shop replied. "We're very sorry. We sent you a scarf for a child! We will send you the right one today, and you can keep the small one."

Anna gave the pink scarf to her little sister. It was long enough for her!`,
      grammar: ["too-and-enough", "one-and-ones", "writing-a-message-to-a-shop"],
      names: ["Anna", "Ross"],
      questions: [
        [
          ["What was wrong with the scarf?", "围巾有什么问题？"],
          ["It was too short, too thin and pink", "太短、太薄，而且是粉色的"],
          [
            ["It was too long and too heavy", "太长、太重"],
            ["It was broken", "它坏了"],
          ],
          ['Anna writes: "It is too short and too thin, and it is pink, not red."', "too short、too thin 表示“太短”“太薄”，颜色也不对。"],
        ],
        [
          ["What did the shop say?", "商店怎么说？"],
          ["They sent her a scarf for a child", "他们寄错了，寄了一条儿童围巾"],
          [
            ["Anna was wrong about the color", "安娜把颜色弄错了"],
            ["She couldn't get her money back", "她不能退款"],
          ],
          ['The shop replied: "We sent you a scarf for a child!"', "商店道歉说寄成了儿童围巾，会寄一条对的，小的那条她可以留着。"],
        ],
        [
          ["What did Anna do with the pink scarf?", "安娜怎么处理那条粉色围巾？"],
          ["She gave it to her little sister", "送给了妹妹"],
          [
            ["She sent it back", "寄回去了"],
            ["She wore it to school", "戴着去上学"],
          ],
          [
            'The passage says: "Anna gave the pink scarf to her little sister. It was long enough for her!"',
            "long enough 表示“足够长”：对妹妹来说正合适。",
          ],
        ],
      ],
    }),
    passage({
      id: "a2-money-why-gold-costs-so-much",
      title: ["Why Gold Costs So Much", "黄金为什么这么贵"],
      body: `For thousands of years people have loved gold. Rich people wore gold rings and necklaces, and countries kept gold to show that they were rich. Even today, a small gold ring can cost more than a new phone. Why?

First, there is not much gold in the world. If you put all the gold that people have ever found together, it would fit in a few big houses.

Second, gold is beautiful, and it doesn't change. Many metals become brown and ugly when they are wet, but gold stays yellow and clean for thousands of years. Gold coins from two thousand years ago still look new.

Third, gold is useful. It is soft, so it is easy to make into rings and other things. It is also used in phones and computers.

Finally, people think that gold is safe. When money becomes cheaper, people buy gold. So when times are difficult, the price of gold often goes up.`,
      grammar: ["present-perfect-with-ever-and-never", "comparatives-and-superlatives"],
      questions: [
        [
          ["What is one reason that gold is expensive?", "黄金昂贵的一个原因是什么？"],
          ["There is not much gold in the world", "世界上的黄金不多"],
          [
            ["It is very heavy", "它很重"],
            ["It is easy to find", "它很容易找到"],
          ],
          ['The passage says: "First, there is not much gold in the world."', "文中给出的原因有：数量少、美丽不变、有用、让人觉得安全。"],
        ],
        [
          ["What happens to many metals when they are wet?", "很多金属受潮后会怎样？"],
          ["They become brown and ugly", "变成褐色，很难看"],
          [
            ["They turn into gold", "变成金子"],
            ["They become soft", "变软"],
          ],
          [
            'The passage says: "Many metals become brown and ugly when they are wet, but gold stays yellow and clean."',
            "很多金属受潮会变褐变丑，金子却能保持金黄干净。",
          ],
        ],
        [
          ["When does the price of gold often go up?", "金价常常在什么时候上涨？"],
          ["When times are difficult", "在困难时期"],
          [
            ["In the summer", "在夏天"],
            ["When people find more gold", "人们找到更多金子时"],
          ],
          [
            'The passage says: "So when times are difficult, the price of gold often goes up."',
            "人们认为黄金安全，困难时期会买黄金，所以金价常常上涨。",
          ],
        ],
      ],
    }),
    passage({
      id: "a2-money-lending-money-to-a-friend",
      title: ["Lending Money to a Friend", "借钱给朋友"],
      body: `Last month my friend Leo asked me to lend him fifty dollars. "I need it for a concert ticket," he said. "I'll pay you back next week. I promise."

I wasn't sure. Fifty dollars was a lot of money for me, and I was saving for a new phone. But Leo is my best friend, so I lent it to him.

A week later he didn't say anything about the money. Two weeks later he went to the movies and bought new jeans. I was upset, but I didn't want to argue with him.

My sister said, "You should talk to him. Be calm and polite, but tell him what you feel." So the next day I said, "Leo, do you remember the fifty dollars? I need it for my phone."

Leo went red. "I'm so sorry," he said. "I forgot! I'm not good with money." He gave me twenty dollars that day and the rest a week later.

We are still friends. But now I have a rule: I only lend money that I don't need.`,
      grammar: ["past-simple-irregular", "should-and-must", "verbs-followed-by-to"],
      names: ["Leo"],
      questions: [
        [
          ["Why did Leo want the money?", "利奥为什么要借钱？"],
          ["For a concert ticket", "买音乐会的票"],
          [
            ["For new jeans", "买新牛仔裤"],
            ["For a new phone", "买新手机"],
          ],
          ['Leo says: "I need it for a concert ticket."', "利奥说要买音乐会门票；新手机是作者自己要攒钱买的。"],
        ],
        [
          ["What did the writer's sister say?", "作者的姐姐说了什么？"],
          ["Talk to him calmly and politely", "冷静、有礼貌地跟他谈"],
          [
            ["Forget about the money", "忘了那笔钱吧"],
            ["Tell your parents", "告诉父母"],
          ],
          [
            'The sister says: "You should talk to him. Be calm and polite, but tell him what you feel."',
            "姐姐建议作者冷静而礼貌地说出自己的感受。",
          ],
        ],
        [
          ["What is the writer's rule now?", "作者现在的规矩是什么？"],
          ["Only lend money you don't need", "只借出自己不需要的钱"],
          [
            ["Never lend money to anyone", "从不借钱给任何人"],
            ["Lend money only to your best friend", "只借给最好的朋友"],
          ],
          ['The last sentence says: "I only lend money that I don\'t need."', "作者的规矩是只借出自己用不着的钱。"],
        ],
      ],
    }),
    passage({
      id: "a2-money-shopping-online",
      title: ["Shopping Online", "网上购物"],
      body: `Today you can buy almost anything without leaving your home. You find what you want on a website or an app, click a button and pay with a card, and a few days later someone delivers it to your door.

Shopping online has a lot of good points. It is fast and easy, and you can do it at any time, even at midnight. You can look at the prices in many shops in a few minutes and choose the cheapest one. And there are often discounts and sales online.

But there are problems too. You can't hold the things you buy or try clothes on, so sometimes they are the wrong size or color. Then you have to send them back, and that takes time. Some people buy too much because it is so easy. And some websites take your money and send nothing.

Here is some advice. Buy from websites you know. Read what other customers say. Check the size before you order. And before you click "buy", ask yourself: Do I really need this?`,
      grammar: ["too-and-enough", "one-and-ones", "should-and-must"],
      questions: [
        [
          ["When can you shop online?", "什么时候可以网上购物？"],
          ["At any time", "任何时候"],
          [
            ["Only in the day", "只在白天"],
            ["Only on weekends", "只在周末"],
          ],
          ['The passage says: "you can do it at any time, even at midnight."', "网上购物任何时候都可以，连半夜也行。"],
        ],
        [
          ["Why are things you buy online sometimes wrong?", "为什么网上买的东西有时不合适？"],
          ["You can't hold them or try them on", "你不能拿在手里看，也不能试穿"],
          [
            ["The shops are too slow", "商店太慢"],
            ["They are too cheap", "它们太便宜"],
          ],
          [
            'The passage says: "You can\'t hold the things you buy or try clothes on, so sometimes they are the wrong size or color."',
            "so 前面说明原因：不能拿在手里看、不能试穿。",
          ],
        ],
        [
          ["What is one piece of advice in the passage?", "文中给出的一条建议是什么？"],
          ["Buy from websites you know", "在你熟悉的网站上买"],
          [
            ["Always buy the cheapest one", "总是买最便宜的"],
            ["Buy a lot when there is a sale", "打折时多买点"],
          ],
          [
            'The passage says: "Buy from websites you know."',
            "建议有：在熟悉的网站买、看其他顾客的评价、下单前核对尺码、问自己是否真的需要。",
          ],
        ],
      ],
    }),
  ],
};
