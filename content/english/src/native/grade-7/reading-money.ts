// Grade 7: the reading unit of the sixth theme, money and business, from barter and the first coins to banks,
// prices, profit and the choices every budget forces.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grade-5/reading-kit.ts";

const moneyWords = { topic: "words-of-money", weight: 0.3 } as const;
const businessWords = { topic: "words-of-business", weight: 0.3 } as const;
const choiceWords = { topic: "words-of-choices-and-costs", weight: 0.3 } as const;
const sections = { topic: "how-sections-of-a-text-work-together", weight: 0.2 } as const;
const checking = { topic: "checking-a-claim-against-the-evidence", weight: 0.1 } as const;
const adjectives = { topic: "suffixes-that-form-adjectives", weight: 0.1 } as const;
const academic1 = { topic: "academic-words-1", weight: 0.1 } as const;
const academic2 = { topic: "academic-words-2", weight: 0.1 } as const;
const academic3 = { topic: "academic-words-3", weight: 0.1 } as const;

/** whatMoneyDoes is a reading unit of grade 7 on money, banks, prices and the choices of businesses and families. */
export const whatMoneyDoes: ReadingUnitDef = {
  id: "what-money-does",
  title: t("What Money Does", "钱的作用"),
  passages: [
    passage(
      "before-there-was-money",
      t("Before There Was Money", "在有钱之前"),
      `Imagine that you are a farmer with a basket of eggs, and you need a new pair of shoes. Without money, you would have to find a shoemaker who wants eggs. If the shoemaker wants fish instead, you would first have to find a fisher who wants eggs, trade with them and then carry the fish back to the shoemaker. This kind of direct trade, goods for goods, is called barter.

Barter works well in small communities, where people know one another and trade often. But it has a serious problem. A trade can happen only when each person has something the other wants at the same time. Economists call this a double coincidence of wants, and it is surprisingly rare. Barter also makes it hard to compare values. How many eggs is a pair of shoes worth? How many shoes is a cow worth?

Money solves these problems. It serves three purposes. First, it is a medium of exchange: something everyone accepts in trade, so the farmer can sell eggs to anyone and use the money to buy shoes from anyone. Second, it is a unit of account: a common measure of value, so the price of shoes and the price of a cow can be compared in the same terms. Third, it is a store of value: it can be saved and spent later, unlike eggs, which spoil.

Over the centuries, people have used many things as money, including shells, salt, cattle, metal coins and printed paper. What they share is not what they are made of but what they do. Anything can serve as money as long as people trust that others will accept it.`,
      [moneyWords, sections, choiceWords, academic1],
      [
        ask(
          t("What is the main problem with barter?", "以物易物的主要问题是什么？"),
          t("Each person must have something the other wants at the same time", "每个人必须同时拥有对方想要的东西"),
          [
            t("Eggs and shoes are hard to carry", "鸡蛋和鞋子很难携带"),
            t("It works only in very large cities", "它只在很大的城市里行得通"),
            t("Shoemakers never want eggs", "鞋匠从来不想要鸡蛋"),
          ],
          t(
            "The second paragraph says a trade can happen only when each person has something the other wants at the same time, which economists call a double coincidence of wants.",
            "第二段说只有当双方同时拥有对方想要的东西时交易才能发生，经济学家称之为需求的双重巧合。",
          ),
        ),
        ask(
          t("How does the third paragraph relate to the second?", "第三段与第二段是什么关系？"),
          t("It explains how money solves the problems the second paragraph describes", "它解释了钱如何解决第二段所描述的问题"),
          [
            t("It gives a second example of barter", "它给出了以物易物的第二个例子"),
            t("It argues that barter is better than money", "它论证以物易物比钱更好"),
            t("It tells the history of shells and coins", "它讲述了贝壳和硬币的历史"),
          ],
          t(
            "The second paragraph sets out two problems of barter; the third opens with Money solves these problems and explains how, so the two sections work as problem and solution.",
            "第二段提出了以物易物的两个问题；第三段以“钱解决了这些问题”开头并解释如何解决，所以这两部分是问题与解决方案的关系。",
          ),
        ),
        ask(
          t("What does it mean that money is a store of value?", "钱是一种价值储存手段，这是什么意思？"),
          t("It can be saved and spent later without spoiling", "它可以存起来以后再花，不会变质"),
          [
            t("It is kept in a store", "它被放在商店里"),
            t("It measures the price of shoes and cows", "它衡量鞋子和牛的价格"),
            t("Everyone accepts it in trade", "每个人都接受用它交易"),
          ],
          t(
            "The third paragraph says a store of value can be saved and spent later, unlike eggs, which spoil. Measuring prices is a unit of account, and being accepted in trade is a medium of exchange.",
            "第三段说价值储存手段可以存起来以后再花，不像鸡蛋会变质。衡量价格是记账单位，被交易接受是交换媒介。",
          ),
        ),
      ],
      [],
    ),
    passage(
      "from-coins-to-paper",
      t("From Coins to Paper", "从硬币到纸币"),
      `For thousands of years, people used valuable metals as money. At first, traders weighed lumps of silver or gold on scales for each sale. This was slow, and it invited cheating, since a lump might be mixed with cheaper metal.

Around 600 BCE, in the kingdom of Lydia, in what is now Turkey, rulers began to make coins: small pieces of metal of a fixed weight, stamped with a royal mark. The stamp was a promise that the coin contained the right amount of metal. Now traders could simply count coins instead of weighing metal. The idea spread quickly through the Greek and Persian worlds. In China, a different tradition grew, and coins there were often cast with a square hole in the middle so they could be strung together.

Coins had their own problem, though. Large amounts were heavy. In China during the Song dynasty, about a thousand years ago, merchants in the province of Sichuan, where the local coins were made of heavy iron, began to leave their coins with trusted shops and receive written receipts in return. The receipts could be traded as if they were the coins themselves. Soon the government took over and began printing official paper money, the first in the world.

Paper money is worth almost nothing as paper. It works only because people trust that it will be accepted. When governments printed too much of it, that trust could collapse, and prices would soar.

Today, most money is not even paper. It exists as numbers in the computers of banks, moved by cards and phones. From lumps of silver to numbers on a screen, money has become lighter and lighter. What has not changed is that it depends on trust.`,
      [moneyWords, sections],
      [
        ask(
          t("What did the stamp on a Lydian coin promise?", "吕底亚硬币上的印记承诺了什么？"),
          t("That the coin contained the right amount of metal", "这枚硬币含有足量的金属"),
          [
            t("That the coin could be traded for paper", "这枚硬币可以换成纸币"),
            t("That the coin had a hole in the middle", "这枚硬币中间有一个孔"),
            t("That the coin was made of iron", "这枚硬币是铁做的"),
          ],
          t(
            "The second paragraph says the stamp was a promise that the coin contained the right amount of metal, so traders could count coins instead of weighing metal.",
            "第二段说印记承诺硬币含有足量的金属，所以商人可以数硬币而不必称金属。",
          ),
        ),
        ask(
          t("Why did merchants in Sichuan begin using paper receipts?", "四川的商人为什么开始使用纸质收据？"),
          t("Their iron coins were too heavy to carry in large amounts", "他们的铁钱太重，大量携带很不方便"),
          [
            t("The government banned coins", "政府禁止使用硬币"),
            t("Iron coins were easy to fake", "铁钱很容易伪造"),
            t("They wanted to trade with Lydia", "他们想和吕底亚做生意"),
          ],
          t(
            "The third paragraph says coins were heavy in large amounts, and in Sichuan the local coins were made of heavy iron, so merchants left them with shops and traded the receipts.",
            "第三段说大量硬币很重，而四川当地的钱是沉重的铁钱，所以商人把钱存放在店铺里，用收据进行交易。",
          ),
        ),
        ask(
          t("What idea connects every section of the passage?", "什么观点贯穿了文章的每一部分？"),
          t("Money works because people trust it", "钱之所以有用，是因为人们信任它"),
          [
            t("Metal is the only true money", "金属是唯一真正的钱"),
            t("China invented every kind of money", "中国发明了所有种类的钱"),
            t("Money has become heavier over time", "钱随着时间推移变得越来越重"),
          ],
          t(
            "Each step, the stamped coin, the trusted receipt, paper money and numbers in a bank, depends on trust, and the last sentence names it: what has not changed is that money depends on trust.",
            "每一步，盖印的硬币、可靠的收据、纸币和银行里的数字，都依赖信任，最后一句点明了这一点：不变的是钱依赖于信任。",
          ),
        ),
      ],
      ["Lydia", "Lydian", "Turkey", "Greek", "Persian", "China", "Song", "Sichuan", "BCE"],
    ),
    passage(
      "the-cost-of-a-choice",
      t("The Cost of a Choice", "选择的代价"),
      `Maya had saved forty dollars from babysitting, and she had two plans for it. She could buy a ticket to a concert on Saturday night, or she could buy a new pair of running shoes for the track season. She could not afford both.

Every choice has a cost, even when no money changes hands. Economists call it opportunity cost: the value of the best thing you give up when you make a choice. If Maya buys the concert ticket, the opportunity cost is the running shoes. If she buys the shoes, the opportunity cost is the concert.

Opportunity cost exists because of scarcity. People, businesses and governments all have limited resources, such as money, time and materials, but their wants are almost unlimited. Because they cannot have everything, they must choose, and every choice means giving something up.

Time is a resource, too. An hour spent watching videos is an hour not spent practicing the piano, sleeping or seeing friends. The opportunity cost of that hour depends on what you would have done instead.

Governments face the same problem on a much larger scale. Money spent building a new highway cannot also be spent on schools or hospitals. When leaders argue about a budget, they are really arguing about opportunity costs.

Thinking about opportunity cost does not tell you what to choose. It helps you see the whole choice clearly. Maya realized that the concert would last one evening, while the shoes would help her all season. She also learned that her friends were planning a free concert in the park the next month. She bought the shoes, and she felt she had given up less than she gained.`,
      [choiceWords, moneyWords],
      [
        ask(
          t("What is opportunity cost?", "什么是机会成本？"),
          t("The value of the best thing you give up when you choose", "作选择时放弃的最佳选项的价值"),
          [
            t("The price written on a ticket", "票面上写的价格"),
            t("The money left over after a purchase", "购买后剩下的钱"),
            t("The total amount of money a person has saved", "一个人存下的全部钱"),
          ],
          t(
            "The second paragraph defines it as the value of the best thing you give up when you make a choice, even when no money changes hands.",
            "第二段把它定义为作选择时放弃的最佳选项的价值，即使没有花钱也是如此。",
          ),
        ),
        ask(
          t("Why does opportunity cost exist?", "机会成本为什么存在？"),
          t("Resources are limited but wants are almost unlimited", "资源有限，而欲望几乎无限"),
          [
            t("Concerts and shoes cost the same amount", "音乐会和鞋子价格相同"),
            t("Governments set the price of every choice", "政府为每个选择定价"),
            t("People always choose the cheaper thing", "人们总是选择更便宜的东西"),
          ],
          t(
            "The third paragraph says opportunity cost exists because of scarcity: resources are limited, wants are almost unlimited, so every choice means giving something up.",
            "第三段说机会成本因稀缺而存在：资源有限，欲望几乎无限，所以每个选择都意味着放弃某些东西。",
          ),
        ),
        ask(
          t("What made Maya's opportunity cost of buying the shoes smaller?", "是什么让玛雅买鞋的机会成本变小了？"),
          t("There would be a free concert in the park the next month", "下个月公园里会有一场免费音乐会"),
          [
            t("The shoes cost less than forty dollars", "鞋子不到四十美元"),
            t("Her friends gave her more money", "朋友们给了她更多的钱"),
            t("The track season was cancelled", "田径赛季取消了"),
          ],
          t(
            "The last paragraph says she learned her friends were planning a free concert next month, so giving up the ticket cost her less than it first seemed.",
            "最后一段说她得知朋友们下个月打算去一场免费音乐会，所以放弃这张票的代价比最初看起来要小。",
          ),
        ),
      ],
      ["Maya", "Maya's", "Saturday"],
    ),
    passage(
      "what-a-bank-does-with-your-money",
      t("What a Bank Does with Your Money", "银行如何使用你的钱"),
      `When you put money into a savings account, it might seem that the bank simply locks it in a safe until you want it back. In fact, most of it is not there at all. The bank has lent it to someone else.

A bank is a business that stands between savers and borrowers. Savers make deposits: they put money into accounts. The bank keeps a small part of this money ready, so that customers who want to withdraw cash can get it. It lends most of the rest to people and businesses who need it: a family buying a house, a farmer buying a tractor, a company building a factory.

Borrowers must pay back more than they borrowed. The extra amount is called interest, and it is the price of using someone else's money. For example, a bank might lend a family money at six percent interest a year. At the same time, it might pay savers two percent interest on their deposits. The difference between what the bank earns from borrowers and what it pays to savers covers its costs and gives it a profit.

This system helps everyone, as long as it works. Savers earn interest on money they are not using. Borrowers can buy a home or start a business years before they could save enough. And the economy grows, because money that would sit idle is put to work.

But the system depends on trust. If too many savers become frightened and try to withdraw their money at the same moment, the bank will not have enough cash. This is called a bank run, and in the past, runs caused many banks to fail. Today, many governments insure deposits, promising that savers will get their money back even if a bank fails, so there is less reason to panic.`,
      [moneyWords, businessWords, sections, academic2],
      [
        ask(
          t("What does a bank do with most of the money in savings accounts?", "银行用储蓄账户里的大部分钱做什么？"),
          t("It lends it to people and businesses", "把它借给个人和企业"),
          [
            t("It locks it in a safe", "把它锁在保险箱里"),
            t("It gives it back as interest", "把它作为利息返还"),
            t("It spends it on its own buildings", "把它花在自己的楼房上"),
          ],
          t(
            "The first two paragraphs say most of the money is not in the bank; it keeps a small part ready and lends most of the rest.",
            "前两段说大部分钱并不在银行里；银行只留一小部分备用，把其余大部分借出去。",
          ),
        ),
        ask(
          t("How does the bank in the example make a profit?", "例子中的银行是怎样获利的？"),
          t("It charges borrowers more interest than it pays savers", "它向借款人收取的利息高于付给储户的利息"),
          [
            t("It charges savers to keep their money", "它向储户收取保管费"),
            t("It prints new money", "它印新钱"),
            t("It never pays savers any interest", "它从不付给储户利息"),
          ],
          t(
            "The third paragraph says the bank earns six percent from borrowers and pays two percent to savers, and the difference covers its costs and gives it a profit.",
            "第三段说银行从借款人那里赚取百分之六，付给储户百分之二，差额用于支付成本并带来利润。",
          ),
        ),
        ask(
          t("What is the purpose of the last paragraph?", "最后一段的作用是什么？"),
          t("To show the risk in the system and how governments reduce it", "说明这个体系的风险以及政府如何降低风险"),
          [
            t("To explain how interest is calculated", "解释利息是怎样计算的"),
            t("To argue that people should not use banks", "论证人们不应该使用银行"),
            t("To give another example of a loan", "举出另一个贷款的例子"),
          ],
          t(
            "After the paragraphs on how the system works and helps, the last one turns to what can go wrong, a bank run, and ends with how deposit insurance makes panic less likely.",
            "在讲述体系如何运作和带来好处的段落之后，最后一段转向可能出现的问题，即挤兑，并以存款保险如何降低恐慌的可能性作结。",
          ),
        ),
      ],
      [],
    ),
    passage(
      "why-strawberries-cost-more-in-winter",
      t("Why Strawberries Cost More in Winter", "为什么冬天的草莓更贵"),
      `In early summer, the markets are full of strawberries, and a basket might cost two dollars. In the middle of winter, the same basket can cost three times as much. The strawberries have not changed. What has changed is supply and demand.

Supply is the amount of something that sellers are willing to sell at different prices. Demand is the amount that buyers are willing to buy at different prices. The price of a good settles where the two meet.

In summer, local farms are harvesting strawberries by the ton, so the supply is large. Farmers must sell them quickly before they spoil, so they compete for buyers by lowering their prices. In winter, local fields are bare. Strawberries must be grown in heated greenhouses or flown in from warmer countries, which costs much more. The supply is small, and sellers can charge more.

Demand can change, too. Before a holiday when people traditionally give chocolate-dipped strawberries, demand rises. If supply stays the same, the price goes up, because more buyers are competing for the same berries.

Prices also send signals. When strawberries are expensive in winter, some buyers choose apples or oranges instead, so demand falls. Meanwhile, high prices encourage growers to build more greenhouses, which increases supply. In this way, prices help balance what people want with what is available, without anyone giving orders.

Economists often show this on a graph, with one line for supply and another for demand. Where the lines cross is the price at which the amount buyers want equals the amount sellers offer. When either line shifts, the price moves, just as it does at the market every winter.`,
      [businessWords, sections, choiceWords],
      [
        ask(
          t("Why are strawberries cheap in early summer?", "为什么初夏的草莓便宜？"),
          t("Local farms have a large supply that must be sold quickly", "本地农场供应量大，而且必须尽快卖掉"),
          [
            t("People do not like strawberries in summer", "人们夏天不喜欢吃草莓"),
            t("Greenhouses are cheaper in summer", "夏天的温室更便宜"),
            t("The government sets a low price", "政府规定了低价"),
          ],
          t(
            "The third paragraph says farms harvest by the ton in summer, so supply is large, and farmers lower prices to sell before the berries spoil.",
            "第三段说夏天农场大量收获，所以供应充足，农民为了在草莓变质前卖出而降价。",
          ),
        ),
        ask(
          t(
            "What happens to the price when demand rises before a holiday and supply stays the same?",
            "节日前需求上升而供应不变时，价格会怎样？",
          ),
          t("It goes up, because more buyers compete for the same berries", "价格上涨，因为更多买家争购同样多的草莓"),
          [
            t("It goes down, because sellers want to be generous", "价格下降，因为卖家想表示大方"),
            t("It stays the same, because supply did not change", "价格不变，因为供应没有变化"),
            t("It falls to zero after the holiday", "节后价格降为零"),
          ],
          t(
            "The fourth paragraph says that if supply stays the same, the price goes up, because more buyers are competing for the same berries.",
            "第四段说如果供应不变，价格就会上涨，因为更多的买家在争购同样多的草莓。",
          ),
        ),
        ask(
          t("How do high winter prices help balance supply and demand?", "冬季的高价是如何帮助平衡供需的？"),
          t("Some buyers switch to other fruit, and growers build more greenhouses", "一些买家改买其他水果，种植者则建造更多温室"),
          [
            t("They force farmers to plant strawberries in the snow", "它们迫使农民在雪地里种草莓"),
            t("They make strawberries spoil more slowly", "它们让草莓腐烂得更慢"),
            t("They make all buyers buy more strawberries", "它们让所有买家买更多草莓"),
          ],
          t(
            "The fifth paragraph says high prices lead some buyers to choose apples or oranges, lowering demand, and encourage growers to build greenhouses, raising supply.",
            "第五段说高价让一些买家选择苹果或橙子，从而降低需求，同时鼓励种植者建造温室，从而增加供应。",
          ),
        ),
      ],
      [],
    ),
    passage(
      "the-dog-walking-business",
      t("The Dog-Walking Business", "遛狗生意"),
      `When Theo turned thirteen, he decided to start a business. Many families on his street had dogs, and many of those families worked long hours. Theo loved dogs. He would walk them after school.

Before he began, his aunt, who ran a bakery, helped him write a simple business plan. "A business plan answers three questions," she said. "Who are your customers? What will it cost you? And how much will you earn?"

Theo's customers would be busy dog owners within walking distance of his home. To reach them, he printed flyers for ten dollars and bought a set of leashes and a supply of dog treats for thirty dollars. These were his start-up costs, the money he had to spend before earning anything.

Next, he set his price. He asked what other dog walkers in town charged and decided on eight dollars for a thirty-minute walk. In his first month, he had four regular customers and made forty walks. His revenue, the total money he took in, was three hundred and twenty dollars.

But revenue is not the same as profit. Theo spent twenty dollars on more treats and fifteen dollars on bags. "Profit is what's left after you pay your costs," his aunt reminded him. After his first month, including his start-up costs, Theo's profit was two hundred and forty-five dollars.

The next month brought a problem. Two families went on vacation, and his revenue fell. Theo realized that his business depended on too few customers. He made new flyers offering to feed pets while families were away. By summer, he had eight customers and a waiting list.

His aunt was impressed. "You found a need, you counted your costs, and when things went wrong, you adapted," she said. "That's what every good business does."`,
      [businessWords, moneyWords],
      [
        ask(
          t("What were Theo's start-up costs?", "西奥的启动成本是什么？"),
          t("The flyers, leashes and treats he bought before earning anything", "他在挣钱之前买的传单、牵引绳和零食"),
          [
            t("The eight dollars he charged for each walk", "他每次遛狗收取的八美元"),
            t("The bags he bought in the first month", "他第一个月买的袋子"),
            t("The money families paid while on vacation", "各家庭度假期间付的钱"),
          ],
          t(
            "The third paragraph says the flyers, leashes and treats were his start-up costs, the money he had to spend before earning anything.",
            "第三段说传单、牵引绳和零食是他的启动成本，即在挣到钱之前必须花的钱。",
          ),
        ),
        ask(
          t("Why was Theo's profit less than his revenue?", "西奥的利润为什么比收入少？"),
          t("He had to pay his costs out of the money he took in", "他必须从收入中支付各项成本"),
          [
            t("Some customers did not pay him", "有些顾客没有付钱给他"),
            t("He charged less than other dog walkers", "他的收费比其他遛狗者低"),
            t("His aunt kept part of his money", "他的姑姑拿走了一部分钱"),
          ],
          t(
            "The fifth paragraph says revenue is not the same as profit: profit is what is left after you pay your costs, including treats, bags and start-up costs.",
            "第五段说收入不等于利润：利润是支付成本之后剩下的钱，包括零食、袋子和启动成本。",
          ),
        ),
        ask(
          t("How did Theo solve the problem of depending on too few customers?", "西奥是怎样解决顾客太少的问题的？"),
          t("He offered a new service, feeding pets while families were away", "他提供了一项新服务：在主人外出时喂宠物"),
          [
            t("He raised the price of each walk", "他提高了每次遛狗的价格"),
            t("He stopped walking dogs during vacations", "他在假期停止遛狗"),
            t("He asked his aunt to buy his business", "他请姑姑买下他的生意"),
          ],
          t(
            "The sixth paragraph says he made new flyers offering to feed pets while families were away, and by summer he had eight customers.",
            "第六段说他制作了新传单，提供主人外出时喂宠物的服务，到夏天他有了八位顾客。",
          ),
        ),
      ],
      ["Theo", "Theo's"],
    ),
    passage(
      "when-prices-run-away",
      t("When Prices Run Away", "当物价失控时"),
      `Your grandparents may remember when a candy bar cost a few cents. Today it costs much more. This slow, steady rise in prices over time is called inflation. When there is inflation, each dollar buys a little less than it did before.

A little inflation is normal. Many central banks, which manage a country's money, aim for prices to rise by about two percent a year. But when a government prints far too much money, inflation can run out of control. This is called hyperinflation, and one of the most famous examples happened in Germany in the early 1920s.

After losing the First World War, Germany had huge debts, including payments it was required to make to the countries that had won. To pay its bills, the government printed more and more money. With so much money chasing the same amount of goods, prices rose, so the government printed even more.

By 1923, prices were rising so fast that they changed during the day. Workers were paid twice a day and rushed to spend their wages before prices went up again. A loaf of bread that had cost less than one mark before the war cost about two hundred billion marks by November 1923. People carried money in wheelbarrows, and some burned banknotes in their stoves because they were cheaper than firewood.

Hyperinflation was a disaster for ordinary families. People who had saved for years found that their savings could not buy a cup of coffee. Many lost faith in their government.

At the end of 1923, Germany introduced a new currency and strictly limited how much was printed. Prices became stable again. The lesson is one that governments still remember: money keeps its value only when it stays scarce.`,
      [moneyWords, sections, adjectives, academic3],
      [
        ask(
          t("What is inflation?", "什么是通货膨胀？"),
          t("A rise in prices over time, so each dollar buys less", "物价随时间上涨，每一美元能买的东西变少"),
          [
            t("A fall in prices over time", "物价随时间下降"),
            t("The printing of new banknotes", "印制新钞票"),
            t("A payment made after losing a war", "战败后支付的赔款"),
          ],
          t(
            "The first paragraph defines inflation as the slow, steady rise in prices over time, in which each dollar buys a little less than before.",
            "第一段把通货膨胀定义为物价随时间缓慢而持续地上涨，每一美元能买的东西比以前少一点。",
          ),
        ),
        ask(
          t("What caused hyperinflation in Germany?", "德国恶性通货膨胀的原因是什么？"),
          t("The government printed far too much money to pay its debts", "政府为偿还债务印了太多的钱"),
          [
            t("Workers demanded to be paid twice a day", "工人要求一天发两次工资"),
            t("Bread became scarce after a bad harvest", "歉收之后面包变得稀缺"),
            t("A new currency was introduced", "引入了一种新货币"),
          ],
          t(
            "The third paragraph says the government printed more and more money to pay its huge debts, and with so much money chasing the same goods, prices rose.",
            "第三段说政府为偿还巨额债务印了越来越多的钱，这么多钱追逐同样多的商品，物价就上涨了。",
          ),
        ),
        ask(
          t("Why are the details about bread, wheelbarrows and stoves included?", "为什么要写面包、手推车和炉子这些细节？"),
          t("To show how extreme and damaging the price rises became", "为了说明物价上涨变得多么极端、危害多大"),
          [
            t("To explain how central banks set their goals", "为了解释中央银行如何设定目标"),
            t("To show that firewood was expensive", "为了说明木柴很贵"),
            t("To prove that a little inflation is normal", "为了证明轻微的通货膨胀是正常的"),
          ],
          t(
            "These details in the fourth paragraph make the numbers concrete: bread costing billions, money carried in wheelbarrows and banknotes burned as fuel show how useless the money had become.",
            "第四段的这些细节让数字变得具体：面包要几千亿马克，钱用手推车装，钞票被当柴烧，都说明了钱变得多么一文不值。",
          ),
        ),
      ],
      ["Germany", "First", "World", "War", "November"],
    ),
    passage(
      "the-power-of-starting-early",
      t("The Power of Starting Early", "早起步的力量"),
      `Imagine two friends, Ana and Ben. Ana starts saving at age twenty-five. She puts one thousand dollars a year into a savings account for ten years and then stops, having saved ten thousand dollars in all. Ben waits until he is thirty-five. Then he saves one thousand dollars a year for thirty years, until he is sixty-five, saving thirty thousand dollars in all.

Who has more money at sixty-five? It seems obvious that Ben should, since he saved three times as much. But if both of them earn seven percent interest a year, Ana ends up with more. The reason is compound interest.

Simple interest is paid only on the money you put in. Compound interest is paid on the money you put in and on the interest you have already earned. Suppose you save one hundred dollars at ten percent a year. After one year, you have one hundred and ten dollars. In the second year, you earn ten percent on one hundred and ten, not just on one hundred, so you have one hundred and twenty-one. Each year, the interest itself earns interest, and the growth speeds up.

Over a few years, the difference is small. Over decades, it becomes enormous. Ana's money had ten extra years to grow, and those early years made all the difference.

Compound interest works in reverse, too. When people borrow money on a credit card and do not pay it back, the interest they owe is added to their debt, and then they pay interest on that interest. A small debt left unpaid can grow surprisingly fast.

The lesson is simple, though not always easy: start saving early, and pay off debts quickly. Time is the most powerful ingredient in compound interest.`,
      [moneyWords, choiceWords, checking],
      [
        ask(
          t("What is the difference between simple and compound interest?", "单利和复利有什么区别？"),
          t("Compound interest is also paid on interest already earned", "复利还要对已经获得的利息计息"),
          [
            t("Simple interest is always higher", "单利总是更高"),
            t("Compound interest is paid only once", "复利只支付一次"),
            t("Simple interest is paid on debts only", "单利只用于债务"),
          ],
          t(
            "The third paragraph says simple interest is paid only on the money you put in, while compound interest is paid on that money and on the interest already earned.",
            "第三段说单利只对你存入的钱计息，而复利既对本金计息，也对已获得的利息计息。",
          ),
        ),
        ask(
          t("Why does Ana end up with more money than Ben, even though she saved less?", "为什么安娜存的钱少，最后却比本多？"),
          t("Her money had ten extra years to grow with compound interest", "她的钱多了十年时间以复利增长"),
          [
            t("She earned a higher rate of interest", "她获得了更高的利率"),
            t("Ben stopped saving after ten years", "本在十年后停止了储蓄"),
            t("Ben borrowed money on a credit card", "本用信用卡借了钱"),
          ],
          t(
            "The passage says both earned seven percent. The fourth paragraph explains that Ana's money had ten extra years to grow, and those early years made all the difference.",
            "文章说两人的利率都是百分之七。第四段解释说安娜的钱多了十年增长时间，正是这些早年的时间造成了全部差别。",
          ),
        ),
        ask(
          t("How does compound interest work in reverse?", "复利如何反向起作用？"),
          t("Unpaid debt grows because interest is charged on interest", "未偿还的债务会增长，因为利息也要计息"),
          [
            t("Savings shrink when you stop adding money", "停止存钱后存款会减少"),
            t("Banks pay less interest to older savers", "银行付给年长储户的利息更少"),
            t("Interest is paid before the money is saved", "在存钱之前就支付利息"),
          ],
          t(
            "The fifth paragraph says unpaid credit card interest is added to the debt, and then interest is charged on that interest, so a small debt can grow fast.",
            "第五段说未还的信用卡利息会加入债务，然后又对这些利息计息，所以一笔小债务可能增长得很快。",
          ),
        ),
      ],
      ["Ana", "Ana's", "Ben"],
    ),
  ],
};
