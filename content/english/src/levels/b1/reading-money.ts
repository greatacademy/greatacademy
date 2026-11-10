// The reading unit of the B1 theme Money and Consumers: a first bank account, buying on impulse, a lost parcel,
// saving against spending, a charity, interest, second-hand goods and the cost of cheap clothes.

import { type ReadingUnitDef, t } from "@ga/content";
import { passageMaker } from "../pre-a1/reading-kit.ts";
import { readingWords } from "./reading-words.ts";

const gerunds = "gerunds-and-infinitives";

const passage = passageMaker(readingWords, [
  "b1-words-personal-finance",
  "b1-words-consumers",
  "b1-words-value",
  "b1-words-money-verbs",
  "b1-words-online-shopping",
  gerunds,
]);

/** readingMoney is the reading unit of the theme Money and Consumers. */
export const readingMoney: ReadingUnitDef = {
  id: "b1-reading-money",
  title: t("Money and Consumers", "金钱与消费"),
  passages: [
    passage({
      id: "b1-money-your-first-bank-account",
      title: ["Your First Bank Account", "你的第一个银行账户"],
      body: `Opening your first bank account is a big moment. It means that you are starting to manage your own money. Many banks let teenagers open an account from the age of fourteen or sixteen, often with a parent. Here is what you need to know.

There are two types of account. A current account is for the money you use every day: your wages from a part-time job go into it, and you use a card to pay for things or to withdraw cash. A savings account is for money you don't need now. You usually can't use a card with it, but the bank pays you interest, a small amount of extra money, for keeping your money there.

Before you choose a bank, compare a few. Some charge a fee every month, while others are free for young people. Check whether there is a fee for withdrawing cash from machines, or for paying in a foreign currency when you travel. Look at the interest rate on savings, too: a higher rate means your money grows faster.

To open an account, you will usually need a document with your photo, such as a passport, and a letter that shows your address. Many banks now let you do everything on an app.

Once your account is open, keep it secure. Never tell anyone your password, not even a friend, and don't click on links in emails that say they are from your bank. A real bank will never ask you to give your password by email.

Finally, learn to check your account often. It is easy to spend more than you think when you pay by card or phone, because you never see the money leave your hand. Many people find it useful to decide how much they can spend each week and to move a little money into savings each month, even if it is only a small amount. It might not feel like much, but by the time you finish school, you could have saved enough for something you really want.`,
      grammar: [gerunds],
      glossed: ["savings"],
      questions: [
        [
          ["What is a savings account for?", "储蓄账户是用来做什么的？"],
          ["Money you don't need now, which earns interest", "存放暂时不用的钱，并赚取利息"],
          [
            ["Everyday money that you spend by card", "日常用卡消费的钱"],
            ["Money that you send to people abroad", "汇给国外的人的钱"],
          ],
          [
            '"A savings account is for money you don\'t need now... the bank pays you interest." Everyday money goes in a current account.',
            "储蓄账户存放暂时不用的钱，银行会付利息；日常用的钱放在活期账户里。",
          ],
        ],
        [
          ["What should you compare before you choose a bank?", "选择银行之前应该比较什么？"],
          ["Its fees and the interest rate on savings", "它的各项费用和储蓄利率"],
          [
            ["How many of your friends use the bank", "你有多少朋友用这家银行"],
            ["Whether it asks for passwords by email", "它是否通过邮件索要密码"],
          ],
          [
            '"Some charge a monthly fee... Check whether there is a fee for withdrawing cash... Look at the interest rate on savings, too." A real bank never asks for a password by email.',
            "要比较月费、取现费和储蓄利率；真正的银行从不通过邮件索要密码。",
          ],
        ],
        [
          ["Why is it easy to spend too much by card?", "为什么用卡消费容易花得太多？"],
          ["You never see the money leave your hand", "你看不到钱从手里花出去"],
          [
            ["Cards always charge a very high fee", "用卡总是收很高的费用"],
            ["The bank does not show what you spend", "银行不显示你花了多少"],
          ],
          [
            '"It is easy to spend more than you think when you pay by card or phone, because you never see the money leave your hand."',
            "用卡或手机付款时看不到现金离手，所以容易不知不觉多花钱。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-money-why-we-buy-what-we-dont-need",
      title: ["Why We Buy What We Don't Need", "我们为什么买不需要的东西"],
      body: `Have you ever come home from the shops with something you didn't plan to buy? Maybe it was a shirt that was on sale, or a gadget that looked useful in the shop but has stayed in a cupboard ever since. You are not alone. Studies suggest that a large part of what we buy is not planned. Shops and the companies that advertise in them know a lot about how our brains work, and they use this to persuade us to spend.

One method is the sale. When we see that a price has been reduced from 80 dollars to 40, we feel that we are saving 40 dollars, even if we never wanted the product at 80. Signs that say "only three left" or "offer ends today" make us afraid of missing something, so we decide quickly instead of thinking.

Supermarkets are designed carefully too. Essential goods such as bread and milk are often at the back of the shop, so that we walk past many other products to get them. Candy and snacks are put next to the checkout, where children waiting with their parents can see them.

Online shops have their own methods. They remember what you looked at and show you advertisements for it for days. They suggest products that "other customers also bought". And buying with one click is so easy that we hardly notice the money we are spending.

So how can you avoid buying things you don't need? Experts suggest a few simple rules. Write a list before you go shopping, and keep to it. If you want something that is not on the list, wait for a day before you buy it; often you will find that you no longer want it. And before every purchase, ask yourself: "Would I buy this if it wasn't on sale?"`,
      grammar: [gerunds],
      questions: [
        [
          ['Why do signs such as "offer ends today" work?', "为什么“优惠今天结束”这样的标语有效？"],
          ["They make us afraid of missing something", "它们让我们害怕错过什么"],
          [
            ["They show that the goods are of high quality", "它们表明商品质量很好"],
            ["They tell us the real price of the product", "它们告诉我们产品的真实价格"],
          ],
          [
            "\"Signs that say 'only three left' or 'offer ends today' make us afraid of missing something, so we decide quickly instead of thinking.\"",
            "这类标语让人害怕错过，于是不加思考就匆忙决定。",
          ],
        ],
        [
          ["Why are bread and milk often at the back of a supermarket?", "为什么面包和牛奶常常放在超市的最里面？"],
          ["So that we walk past many other products", "让我们路过许多其他商品"],
          [
            ["Because they must be kept in a cold place", "因为它们必须放在冷的地方"],
            ["So that children cannot see them easily", "让孩子们不容易看到它们"],
          ],
          [
            '"Essential goods such as bread and milk are often at the back of the shop, so that we walk past many other products to get them."',
            "必需品放在后面，顾客去拿时要经过很多其他商品。",
          ],
        ],
        [
          ["What do experts suggest when you want something that is not on your list?", "想买清单上没有的东西时，专家有什么建议？"],
          ["Wait for a day before you buy it", "等一天再买"],
          [
            ["Buy it only when it is on sale", "只在打折时买"],
            ["Ask a friend to buy it for you", "请朋友替你买"],
          ],
          [
            '"If you want something that is not on the list, wait for a day before you buy it; often you will find that you no longer want it."',
            "等一天再决定，往往你会发现自己已经不想要了。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-money-the-parcel-that-never-came",
      title: ["The Parcel That Never Came", "一直没到的包裹"],
      body: `Last month, Daniel ordered a pair of running shoes from an online shop. They were not cheap, but they were on offer, and the website promised delivery within three working days. He paid by card at the checkout and got an email with a number to track the parcel.

On the third day, he checked the tracking page. It said: "Your parcel is on its way." On the fifth day, it said the same. On the seventh day, it said: "Delivered." But there was no parcel at Daniel's door.

He asked his neighbors whether the courier had left it with them. Nobody had seen it. He looked behind the bins, in the garden and under the stairs. Nothing.

Daniel called the shop. A voice told him to wait, and after forty minutes, a customer service worker answered. She said that the courier had a photo of the parcel at the door. When she sent it to him, Daniel saw that the door in the photo was blue. His door is red.

"So it was delivered to the wrong address," Daniel said. The worker agreed, but she said that the shop could not give him a refund until the courier company had investigated, and that this could take up to thirty days.

Daniel decided to write a complaint. He explained what had happened, added the photo of the blue door, and asked for either a refund or a new pair of shoes within seven days. He also mentioned that he had written down the date and time of all his calls.

Four days later, a new pair arrived, with a voucher for his next purchase and a letter saying sorry. A week after that, a woman from the next street came to his door. She was holding a box. "I think this is yours," she said. "It was outside my blue door."`,
      grammar: [gerunds],
      names: ["Daniel", "Daniel's"],
      questions: [
        [
          ["What did the tracking page say on the seventh day?", "第七天物流页面显示什么？"],
          ["That the parcel had been delivered", "包裹已经送达"],
          [
            ["That the parcel was still on its way", "包裹仍在运送途中"],
            ["That the parcel had gone back to the shop", "包裹已经退回商店"],
          ],
          [
            "\"On the seventh day, it said: 'Delivered.' But there was no parcel at Daniel's door.\"",
            "第七天页面显示“已送达”，但丹尼尔家门口并没有包裹。",
          ],
        ],
        [
          ["How did Daniel know that the parcel went to the wrong address?", "丹尼尔怎么知道包裹送错了地址？"],
          ["The door in the courier's photo was a different color", "快递员照片里的门颜色不一样"],
          [
            ["His neighbors told him that they had it", "邻居告诉他包裹在他们那里"],
            ["The tracking page showed a different street", "物流页面显示的是另一条街"],
          ],
          ['"Daniel saw that the door in the photo was blue. His door is red."', "照片里的门是蓝色的，而丹尼尔家的门是红色的。"],
        ],
        [
          ["What did the shop send after his written complaint?", "书面投诉之后，商店寄来了什么？"],
          ["A new pair of shoes and a voucher", "一双新鞋和一张代金券"],
          [
            ["A refund and a letter from the courier", "退款和快递员的一封信"],
            ["The first parcel and an apology", "原来的包裹和一份道歉"],
          ],
          [
            '"Four days later, a new pair arrived, with a voucher for his next purchase." The first parcel was brought later by a woman from the next street.',
            "四天后新鞋和代金券送到了；原来的包裹后来是邻街的一位女士送来的。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-money-saving-or-spending",
      title: ["Saving or Spending?", "存钱还是花钱？"],
      body: `We asked two young people whether it is better to save money or to enjoy it now.

Hana, 19: "I started saving when I got my first job at sixteen. Every time I'm paid, I put a third of my wages into a savings account before I spend anything. My friends think I'm boring, but I don't care. Last year my laptop broke, and I could afford a new one without borrowing money from anyone. I also want to study abroad, and that will be expensive. For me, money in the bank means being free. If something goes wrong, I don't have to depend on my parents or get into debt. Of course I spend money on things I enjoy, but I plan it. I avoid buying things just because everyone else has them."

Leo, 22: "I think people worry too much about saving. I'm young, and this is the time to have experiences. Last summer I spent most of what I had earned on a trip around Asia with two friends. I'm not sorry about it at all. I will remember those weeks for the rest of my life, but I won't remember the money. Things you buy lose their value, but memories are priceless. I'm not careless: I pay my rent first, and I never borrow money for fun. But if I can afford something that I will enjoy, why wait? Nobody knows what will happen tomorrow."

Both agree on one thing: it is important to know where your money goes. "Most people have no idea how much they spend on coffee and snacks," says Hana. Leo laughs. "That's true. I once counted mine. It was enough for a plane ticket."`,
      grammar: [gerunds],
      names: ["Hana", "Leo", "Asia"],
      glossed: ["savings"],
      questions: [
        [
          ["How does Hana save money?", "哈娜是怎样存钱的？"],
          ["She puts a third of her pay into savings first", "她先把三分之一的工资存起来"],
          [
            ["She never spends money on things she enjoys", "她从不在喜欢的东西上花钱"],
            ["She borrows money from her parents each month", "她每月向父母借钱"],
          ],
          [
            '"Every time I\'m paid, I put a third of my wages into a savings account before I spend anything." She does spend on things she enjoys, but she plans it.',
            "她每次领工资都先存三分之一；她也会花钱买喜欢的东西，只是有计划。",
          ],
        ],
        [
          ["Why does Leo not regret spending money on his trip?", "利奥为什么不后悔在旅行上花钱？"],
          ["He will remember the trip, but not the money", "他会记住这次旅行，而不会记得那些钱"],
          [
            ["His friends gave him the money back later", "朋友们后来把钱还给了他"],
            ["He borrowed the money and has not paid it back", "钱是借的，他还没还"],
          ],
          [
            '"I will remember those weeks for the rest of my life, but I won\'t remember the money." He never borrows money for fun.',
            "他说会一辈子记住那几周，却不会记得花了多少钱；他从不借钱去玩。",
          ],
        ],
        [
          ["What do Hana and Leo agree on?", "哈娜和利奥在哪一点上意见一致？"],
          ["It is important to know where your money goes", "知道钱花在哪里很重要"],
          [
            ["Young people should travel before they save", "年轻人应该先旅行再存钱"],
            ["Everyone should save a third of what they earn", "每个人都应该存下收入的三分之一"],
          ],
          ['"Both agree on one thing: it is important to know where your money goes."', "两人都认为，清楚自己的钱花在哪里很重要。"],
        ],
      ],
    }),
    passage({
      id: "b1-money-a-charity-from-one-coin",
      title: ["A Charity That Grew from One Coin", "从一枚硬币发展起来的慈善机构"],
      body: `In 2009, a girl of eight called Rosa found a coin on the sidewalk outside her school. That morning, her teacher had told the class about children in another country who could not go to school because their families could not afford books. Rosa decided to donate the coin.

"It was only one coin," she remembers. "But I thought: what if everyone in my school gave one coin?"

She made a sign and put a jar on the desk of her teacher. In the first week, the class collected enough to buy twenty books. The next month, the whole school joined in. A local newspaper wrote about the jar, and people who read the story started sending money too.

Rosa's parents helped her to start a small charity. At first it was run from their kitchen table. Volunteers counted the coins every Saturday, and Rosa's father, who worked with numbers in an office, wrote down every dollar. "People trust you with their money," he told her. "You have to show them exactly where it goes."

Being honest became the most important thing about the charity. Every year, it publishes a report that shows how the money was divided: how much went to books, how much to the wages of teachers, and how much to the costs of running the charity. People who give money can even see photos of the schools they have supported.

Today, the charity has an office, six employees and people who support it in many countries. It has built eleven schools and supplied books to thousands of students. Rosa is now studying economics at university, but she still goes to the office every Saturday.

The first coin is now on the wall of the office, behind glass. "People sometimes ask me how to change the world," she says. "I tell them to start with what they have in their pocket."`,
      grammar: [gerunds],
      names: ["Rosa", "Rosa's"],
      glossed: ["jar"],
      questions: [
        [
          ["What gave Rosa the idea of giving the coin?", "是什么让罗莎想到要捐出这枚硬币？"],
          ["A story her teacher told about children without books", "老师讲的一个关于没有书的孩子的故事"],
          [
            ["A jar of coins that she saw in a newspaper", "她在报纸上看到的一罐硬币"],
            ["Her father asked her to collect money for his office", "爸爸让她为他的办公室收钱"],
          ],
          [
            '"Her teacher had told the class about children in another country who could not go to school because their families could not afford books."',
            "老师讲了另一个国家的孩子因买不起书而上不了学，罗莎于是决定捐出硬币。",
          ],
        ],
        [
          ["Why did Rosa's father write down every dollar?", "罗莎的爸爸为什么把每一美元都记下来？"],
          ["People need to see exactly where their money goes", "人们需要清楚地看到自己的钱用在哪里"],
          [
            ["The newspaper wanted to write about the money", "报纸想报道这些钱"],
            ["The volunteers often lost some of the coins", "志愿者们经常弄丢硬币"],
          ],
          [
            '"People trust you with their money... You have to show them exactly where it goes."',
            "人们把钱托付给你，你必须让他们清楚钱的去向。",
          ],
        ],
        [
          ["What does Rosa tell people who ask how to change the world?", "有人问怎样改变世界时，罗莎怎么回答？"],
          ["To start with what they have in their pocket", "从自己口袋里有的东西开始"],
          [
            ["To study economics at a university first", "先去大学学经济学"],
            ["To wait until they have a lot of money", "等到有很多钱的时候再说"],
          ],
          ['"I tell them to start with what they have in their pocket."', "她告诉人们从口袋里已有的东西做起。"],
        ],
      ],
    }),
    passage({
      id: "b1-money-how-interest-works",
      title: ["How Interest Works", "利息是怎样运作的"],
      body: `If you put money in a savings account, the bank pays you interest. If you borrow money from a bank, you pay interest to the bank. But what is interest, and why does it matter so much?

Interest is the price of using money from another person. When you deposit money in a bank, the bank lends it to other people, for example to someone who wants to buy a house. That person pays the bank interest on the loan, and the bank pays you a smaller amount of interest for using your money. The difference is how the bank earns money.

Interest is usually given as a percentage for each year. Imagine that you deposit 1,000 dollars at a rate of 5 percent. After one year, you will have 1,050 dollars. But in the second year, you earn interest not only on your 1,000 dollars but also on the 50 dollars of interest. This is called compound interest, and over many years it makes a big difference. If you leave the money for fourteen years at 5 percent, it will almost double, without you adding anything.

Compound interest works the other way too, and this is where it can become dangerous. If you owe money on a credit card and don't pay it back, the interest is added to your debt, and the next month you pay interest on the interest. Credit cards often charge 20 percent a year or more. At that rate, a debt of 1,000 dollars can double in about four years.

So the lesson is simple. Start saving early, because time makes your money grow. And avoid borrowing money for things you don't need, especially at high rates, because time makes debts grow too. People who understand interest earn it; people who don't understand it pay it.`,
      grammar: [gerunds],
      glossed: ["savings", "compound"],
      questions: [
        [
          ["How does a bank earn money from interest?", "银行怎样通过利息赚钱？"],
          ["It charges more interest on loans than it pays on savings", "它收取的贷款利息高于它支付的存款利息"],
          [
            ["It keeps all the money that people deposit", "它留下人们存入的所有钱"],
            ["It charges a fee every time you deposit money", "你每次存钱它都收手续费"],
          ],
          [
            '"That person pays the bank interest on the loan, and the bank pays you a smaller amount of interest... The difference is how the bank earns money."',
            "借款人付给银行的利息多，银行付给储户的利息少，差额就是银行的收入。",
          ],
        ],
        [
          ["What is compound interest?", "什么是复利？"],
          ["Interest that you also earn on earlier interest", "在之前所得利息上继续产生的利息"],
          [
            ["Interest that the bank pays only once", "银行只支付一次的利息"],
            ["Interest that gets smaller every year", "每年都在减少的利息"],
          ],
          [
            '"In the second year, you earn interest not only on your 1,000 dollars but also on the 50 dollars of interest. This is called compound interest."',
            "第二年不仅本金生息，第一年的利息也生息，这就是复利。",
          ],
        ],
        [
          ["Why can a debt on a credit card be dangerous?", "信用卡欠款为什么可能很危险？"],
          ["The interest is added to the debt, so it grows quickly", "利息计入欠款，所以欠款增长很快"],
          [
            ["You must pay all of it back within one month", "你必须在一个月内全部还清"],
            ["The bank can close your savings account at once", "银行会立刻关闭你的储蓄账户"],
          ],
          [
            '"The interest is added to your debt, and the next month you pay interest on the interest... a debt of 1,000 dollars can double in about four years."',
            "利息加进欠款，下个月连利息也要付利息，欠款可能约四年就翻倍。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-money-second-hand-is-the-new-new",
      title: ["Second-Hand Is the New New", "二手才是新时尚"],
      body: `Ten years ago, many teenagers would have felt embarrassed to wear second-hand clothes. Today, buying used things is cool. On apps and websites, millions of people sell clothes, shoes, books, tables and chairs that they no longer need, and the market for second-hand goods is growing much faster than the market for new ones.

There are a few reasons. The first is money. A jacket that cost 120 dollars new might cost 30 dollars a year later, and often it has hardly been worn. For students and young workers, this can mean the difference between affording something and not.

The second reason is the environment. Making new clothes uses a huge amount of water and energy, and much of what we buy is thrown away after a few years. Buying second-hand gives a product a longer life and reduces waste.

The third reason is that many young people don't want to look like everyone else. In a second-hand shop, you can find special pieces that are no longer made, and the search is part of the fun. "Every time I go, I find something different," says Ella, 17. "It's always a surprise."

Selling has become common too. Instead of leaving old things in a cupboard, people take photos of them, put them online and earn a little money. Some teenagers have even started small businesses, buying things at markets and selling them online for more.

But there are risks. Not everyone who sells is honest: some things are faulty or look different from the photos, and it can be hard to get a refund. Experts suggest checking what other people say about the person who is selling, asking questions before you pay, and paying through the app instead of in cash.

And remember: second-hand is only a good deal if you really need it. Buying ten cheap jackets that you never wear is not better for the planet than buying one new one.`,
      grammar: [gerunds],
      names: ["Ella"],
      glossed: ["second-hand"],
      questions: [
        [
          ["Why is buying second-hand good for the environment?", "为什么买二手货对环境有好处？"],
          ["It gives products a longer life and reduces waste", "它延长了物品的寿命，减少了浪费"],
          [
            ["Second-hand clothes need no water to wash them", "二手衣服不需要用水洗"],
            ["It makes new clothes cheaper to make in factories", "它让工厂生产新衣服更便宜"],
          ],
          ['"Buying second-hand gives a product a longer life and reduces waste."', "买二手货延长了物品的使用寿命，也减少了垃圾。"],
        ],
        [
          ["Why does Ella enjoy second-hand shops?", "埃拉为什么喜欢二手店？"],
          ["She always finds something different there", "她每次都能找到不一样的东西"],
          [
            ["Everything there is new and has never been worn", "那里的东西都是全新的，没人穿过"],
            ["She can sell her own old clothes there", "她可以在那里卖自己的旧衣服"],
          ],
          ['"Every time I go, I find something different... It\'s always a surprise."', "埃拉说每次去都能发现不一样的东西，总有惊喜。"],
        ],
        [
          ["What does the passage advise buyers to do?", "文章建议买家怎么做？"],
          ["Ask questions before paying, and pay through the app", "付款前先提问，并通过应用付款"],
          [
            ["Always pay the seller in cash when you meet", "见面时总是用现金付给卖家"],
            ["Buy as many cheap jackets as they can find", "能找到多少便宜夹克就买多少"],
          ],
          [
            '"Experts suggest checking what other people say about the person who is selling, asking questions before you pay, and paying through the app instead of in cash."',
            "专家建议看看其他买家的评价、付款前先问清楚，并通过应用而不是现金付款。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-money-the-true-cost-of-cheap-clothes",
      title: ["The True Cost of Cheap Clothes", "廉价衣服的真正代价"],
      body: `A T-shirt for five dollars sounds like a great deal. But if a shop sells it for five dollars, how much did the people who made it earn? And who pays the rest of the cost?

Most cheap clothes are made in factories in countries where wages are low. A worker in such a factory may earn only a few dollars a day, and work twelve hours or more, six days a week. In 2013, a factory building in Bangladesh fell down, and more than 1,100 workers died. The day before, workers had seen cracks in the walls, but they were told to return to work. The disaster made millions of consumers ask where their clothes came from.

There is also a cost to the environment. Growing cotton needs a lot of water and chemicals, and the colors used in factories can pollute rivers. Many cheap clothes are made of plastic, which leaves very small pieces of plastic in the water every time we wash them. And because the clothes are so cheap, we buy more and wear them less. Some studies suggest that many clothes are worn only a few times before they are thrown away.

What can consumers do? Some people choose companies that guarantee fair wages and publish information about their factories. Others buy clothes less often, but of better quality, so that they last longer. Some repair their clothes instead of buying new ones, or exchange them with friends.

Not one of these answers is easy. Clothes from fair companies are often more expensive, and not everyone can afford them. But the next time you see a very cheap T-shirt, it is worth asking: if I am paying so little, who is paying the rest?`,
      grammar: [gerunds],
      names: ["Bangladesh"],
      glossed: ["cracks"],
      questions: [
        [
          ["What happened the day before the factory fell down?", "工厂倒塌的前一天发生了什么？"],
          ["Cracks appeared, but the workers were told to return", "墙上出现了裂缝，但工人被要求回去上班"],
          [
            ["The factory closed and sent the workers home", "工厂停工，让工人回家"],
            ["The workers asked for higher wages and left", "工人要求加薪后离开了"],
          ],
          [
            '"The day before, workers had seen cracks in the walls, but they were told to return to work."',
            "倒塌前一天墙上已出现裂缝，工人们却被要求回去工作。",
          ],
        ],
        [
          ["How do cheap clothes harm the environment?", "廉价衣服怎样危害环境？"],
          ["Making them uses water and chemicals and pollutes rivers", "生产过程耗水、使用化学品并污染河流"],
          [
            ["They are worn too many times before they are thrown away", "它们被扔掉之前穿的次数太多"],
            ["Cotton is a kind of plastic that never disappears", "棉花是一种永远不会消失的塑料"],
          ],
          [
            '"Growing cotton needs a lot of water and chemicals, and the colors used in factories can pollute rivers." Clothes are often worn only a few times.',
            "种棉花需要大量水和化学品，染料会污染河流；而且很多衣服只穿几次就被扔掉。",
          ],
        ],
        [
          ["What is one problem with clothes from fair companies?", "公平贸易公司的衣服有什么问题？"],
          ["They are often more expensive", "它们往往更贵"],
          [
            ["They are made in dangerous factories", "它们是在危险的工厂里生产的"],
            ["They wear out faster than cheap ones", "它们比廉价衣服更容易穿坏"],
          ],
          [
            '"Clothes from fair companies are often more expensive, and not everyone can afford them."',
            "公平贸易公司的衣服往往更贵，不是每个人都买得起。",
          ],
        ],
      ],
    }),
  ],
};
