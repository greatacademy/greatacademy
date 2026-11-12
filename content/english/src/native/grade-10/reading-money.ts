// Grade 10: the reading unit of the seventh theme, money and work, from a fortune paid for a flower and a wage that
// doubled overnight to a decade that stood still, an average that misleads and a first job that had to be negotiated.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grade-5/reading-kit.ts";

const economyWords = { topic: "words-of-economics", weight: 0.3 } as const;
const careerWords = { topic: "words-of-careers-and-employment", weight: 0.3 } as const;
const numbers = { topic: "how-numbers-can-mislead", weight: 0.2 } as const;
const motives = { topic: "complex-characters-and-motives", weight: 0.2 } as const;
const academic1 = { topic: "academic-words-1", weight: 0.1 } as const;
const academic2 = { topic: "academic-words-2", weight: 0.1 } as const;
const academic3 = { topic: "academic-words-3", weight: 0.1 } as const;

/** moneyAndWork is a reading unit of grade 10 on economies, wages and careers, and the numbers that describe them. */
export const moneyAndWork: ReadingUnitDef = {
  id: "money-and-work",
  title: t("Money and Work", "金钱与工作"),
  passages: [
    passage(
      "a-fortune-for-a-flower",
      t("A Fortune for a Flower", "一朵花的财富"),
      `In the early seventeenth century, the Dutch Republic was one of the richest places on Earth. Its merchants traded across the world, its cities were full of new houses and paintings, and its wealthy citizens were eager for beautiful and unusual things to display. One of the most fashionable was a flower that had arrived from Turkey only a few decades earlier: the tulip.

Tulips with plain colors were common and cheap. But some bulbs produced flowers with dramatic streaks and flames of color, white feathered with red or purple. These were the most admired, and the rarest. No one at the time knew that the patterns were caused by a virus, which also weakened the plants and made them hard to multiply. A collector could not simply grow more. The supply was small, and the demand was rising.

By the 1630s, the price of the rarest bulbs had risen to astonishing levels. According to some reports, a single bulb of the most famous variety was offered for the price of a fine house in Amsterdam. Ordinary people began to join the trade. Most never saw the bulbs they bought, which were still in the ground. Instead, they traded contracts, promises to buy a bulb at a fixed price when it was dug up in summer. Many hoped to sell the contract to someone else at a higher price before then.

In February 1637, at an auction in the city of Haarlem, buyers suddenly failed to appear. Within days, prices across the country collapsed. People who had promised to pay huge sums for bulbs now refused, and those who had sold the contracts could not collect. The courts largely declined to enforce the agreements.

For centuries, the episode was told as a story of national madness, in which thousands of people were ruined. Some modern historians have questioned this. After studying the records, they found little evidence of widespread bankruptcy, and they believe that the trade involved a fairly small group of merchants and craftsmen. The famous accounts of ruin, they argue, came largely from pamphlets written by moralists who disapproved of speculation.

Whether it was a national disaster or a smaller event, the tulip trade has given its name to a pattern that has repeated many times since: a bubble. Prices rise because people expect them to keep rising, and they keep rising because people expect it, until one day the buyers disappear. The thing being traded, whether a flower, a share or a house, may have changed very little. What has changed is belief.`,
      [economyWords, numbers, academic2, academic1],
      [
        ask(
          t("Why were the streaked tulips so rare?", "为什么带条纹的郁金香如此稀少？"),
          t("A virus caused the patterns and made the plants hard to multiply", "一种病毒造成了这些花纹，并使植株难以繁殖"),
          [
            t("They could grow only in the soil of Turkey", "它们只能在土耳其的土壤中生长"),
            t("The government had banned people from growing them", "政府禁止人们种植它们"),
            t("They bloomed only once every ten years", "它们每十年才开一次花"),
          ],
          t(
            "The second paragraph says the patterns were caused by a virus, which weakened the plants and made them hard to multiply.",
            "第二段说花纹是病毒造成的，病毒还削弱了植株，使它们难以繁殖。",
          ),
        ),
        ask(
          t("How have some modern historians changed the usual story?", "一些现代历史学家怎样改变了通常的说法？"),
          t(
            "They found little evidence of widespread ruin and doubt the old pamphlets",
            "他们发现几乎没有大范围破产的证据，并怀疑旧时的小册子",
          ),
          [
            t("They proved that a bulb really cost a house", "他们证明一个球茎真的值一栋房子"),
            t("They discovered that tulips came from America", "他们发现郁金香来自美洲"),
            t("They showed that prices never fell at all", "他们表明价格根本没有下跌"),
          ],
          t(
            "The fifth paragraph says they found little evidence of widespread bankruptcy and believe the accounts of ruin came from moralists' pamphlets.",
            "第五段说他们发现几乎没有大范围破产的证据，并认为关于破产的记载来自道德家的小册子。",
          ),
        ),
        ask(
          t("According to the last paragraph, what drives a bubble?", "根据最后一段，是什么推动了泡沫？"),
          t("People's belief that prices will keep rising", "人们相信价格会继续上涨"),
          [
            t("A real change in the value of the thing traded", "所交易物品价值的真实变化"),
            t("A shortage of money in the whole country", "全国范围的货币短缺"),
            t("Laws that force people to buy more", "强迫人们多买的法律"),
          ],
          t(
            "It says prices rise because people expect them to, and what has changed is belief, not the thing being traded.",
            "它说价格上涨是因为人们预期它会上涨，变化的是信念，而不是所交易的东西。",
          ),
        ),
      ],
      ["Dutch", "Turkey", "Amsterdam", "Haarlem"],
    ),
    passage(
      "the-wage-that-doubled-overnight",
      t("The Wage That Doubled Overnight", "一夜翻倍的工资"),
      `In January 1914, the Ford Motor Company made an announcement that astonished the business world. Starting that month, it would pay most of the workers in its factory near Detroit five dollars for an eight-hour day. At the time, the usual wage for factory work was a little over two dollars for a day of nine hours. Ford had, in effect, doubled its pay.

Other business owners were horrified. One newspaper called the decision a crime against business. Some predicted that the company would soon be insolvent. Why would anyone pay workers twice what they could get elsewhere?

The answer lay in Ford's new way of making cars. The year before, the company had introduced the moving assembly line. Instead of building a car in one place, workers stood in a line while the car moved past them, and each worker repeated a single small task, again and again, all day. The method was enormously efficient. The time needed to build a Model T fell from about twelve hours to about ninety minutes.

But the work was also brutally boring, and many workers could not stand it. In 1913, the company had to hire more than fifty thousand people to keep a workforce of about fourteen thousand, because so many quit. Training new workers constantly was expensive and slowed production. The five-dollar day was partly an attempt to solve this problem. When the announcement was made, thousands of men lined up outside the factory in freezing weather hoping for a job.

The plan worked. Workers stayed, and the cost of constantly training new ones fell. Productivity rose. Henry Ford later called the five-dollar day one of the finest cost-cutting moves the company ever made. He also argued that well-paid workers could afford to buy the cars they made, which would increase sales, though economists still debate how much this mattered.

The higher wage came with conditions. Not every worker qualified. To receive the full amount, a worker had to have worked at the company for six months, and the company created a department whose staff visited workers' homes to check that they did not drink too much, kept their houses clean and lived in ways the company approved of. Women were at first mostly excluded.

The five-dollar day is often remembered as an act of generosity. It was also a calculation. Perhaps the most interesting lesson is that the two do not have to be opposites. Paying people well can be good for them and good for business at the same time.`,
      [careerWords, economyWords, motives, academic2, academic3],
      [
        ask(
          t("What problem was the five-dollar day partly meant to solve?", "五美元工作日在一定程度上是为了解决什么问题？"),
          t("So many workers quit that the company was always training new ones", "辞职的工人太多，公司总是在培训新人"),
          [
            t("The company did not have enough cars to sell", "公司没有足够的汽车可卖"),
            t("The government had ordered higher wages", "政府命令提高工资"),
            t("Workers had refused to use the assembly line", "工人拒绝使用流水线"),
          ],
          t(
            "The fourth paragraph says the company had to hire over fifty thousand people to keep fourteen thousand, and constant training was expensive.",
            "第四段说公司要雇用五万多人才能维持一万四千人的劳动力，而不断培训的成本很高。",
          ),
        ),
        ask(
          t("What does the passage say about the conditions attached to the higher wage?", "关于高工资附带的条件，文章怎么说？"),
          t("Workers had to meet the company's rules, even about their home lives", "工人必须遵守公司的规定，甚至涉及家庭生活"),
          [
            t("Every worker received it from the first day", "每个工人从第一天起就能拿到"),
            t("Only women were allowed to receive it", "只有女性才能领取"),
            t("Workers had to buy a car to qualify", "工人必须买一辆车才有资格"),
          ],
          t(
            "The sixth paragraph says workers needed six months of service, and company staff checked their homes and habits.",
            "第六段说工人需要工作满六个月，公司员工还会检查他们的家庭和习惯。",
          ),
        ),
        ask(
          t("What is the main point of the final paragraph?", "最后一段的主要观点是什么？"),
          t("Generosity and good business sense can go together", "慷慨与精明的经营可以并存"),
          [
            t("Ford paid well only because he was generous", "福特高薪只是因为他慷慨"),
            t("High wages always ruin a company in the end", "高工资最终总会毁掉一家公司"),
            t("Workers should never trust their employers", "工人永远不应该信任雇主"),
          ],
          t(
            "It says the five-dollar day was both generosity and calculation, and that paying well can be good for workers and for business.",
            "它说五美元工作日既是慷慨也是算计，高薪可以既有利于工人，也有利于企业。",
          ),
        ),
      ],
      ["Ford", "Ford's", "Detroit", "Model", "T", "Henry"],
    ),
    passage(
      "the-decade-that-stood-still",
      t("The Decade That Stood Still", "停滞的十年"),
      `In the late 1980s, Japan seemed unstoppable. Its companies made many of the world's best cars, cameras and electronics. Its economy was the second largest on Earth, and some experts predicted that it would soon overtake the United States. In Tokyo, land prices had risen so high that, according to a popular calculation, the grounds of the Imperial Palace were worth more than all the land in California.

That calculation should have been a warning. Much of Japan's apparent wealth rested on a bubble. Banks lent money freely, and companies and individuals used it to buy land and shares, expecting prices to keep rising. Rising prices made people feel richer, so they borrowed and bought more.

At the end of 1989, the central bank began to raise interest rates to cool the economy. The bubble burst. Over the next few years, share prices fell by more than half, and land prices fell for more than a decade. Companies and families that had borrowed heavily found that what they owned was now worth far less than what they owed.

What followed came to be called the Lost Decade. There was no single dramatic collapse. Instead, the economy simply stopped growing. Year after year, growth was close to zero. Wages stagnated, and young people found it much harder to get the secure jobs for life that their parents had enjoyed.

One reason for the stagnation was the state of the banks. Many had made loans that would never be repaid, but they did not want to admit their losses. So they kept lending to companies that were already insolvent, allowing them to survive as what economists later called zombie companies, too weak to grow but kept alive by fresh loans. Meanwhile, healthy new businesses struggled to borrow.

Another problem was deflation, a steady fall in prices. Falling prices sound pleasant, but they can be harmful. If people expect things to be cheaper next year, they delay buying. Companies sell less, cut wages and investment, and prices fall further.

The government tried to help through fiscal policy, spending large sums on roads, bridges and other public works. This raised the national debt to one of the highest levels in the world, and economists still argue about whether the spending was too little, too late or simply aimed at the wrong things.

Japan remained a rich and stable country throughout. But its experience became a lesson studied by every government that has faced a burst bubble since: the damage is not only in the fall, but in the long, slow years that follow.`,
      [economyWords, numbers],
      [
        ask(
          t("Why should the calculation about the Imperial Palace have been a warning?", "为什么关于皇宫的那个计算本应是一个警告？"),
          t("It showed land prices had risen to unrealistic levels in a bubble", "它表明地价在泡沫中涨到了不切实际的水平"),
          [
            t("It proved the palace was about to be sold", "它证明皇宫即将被出售"),
            t("It showed that California was very poor", "它表明加利福尼亚很穷"),
            t("It meant Japan had no land left to build on", "它意味着日本已经没有土地可以建房"),
          ],
          t(
            "The second paragraph says much of Japan's apparent wealth rested on a bubble, in which people borrowed to buy land expecting prices to rise.",
            "第二段说日本表面上的财富很大一部分建立在泡沫之上，人们借钱买地，期待价格上涨。",
          ),
        ),
        ask(
          t('What were "zombie companies"?', '"僵尸企业"是什么？'),
          t("Insolvent firms kept alive by fresh loans from banks", "靠银行新贷款维持生存的资不抵债的公司"),
          [
            t("Companies that made films about monsters", "制作怪物电影的公司"),
            t("New businesses that grew very quickly", "迅速成长的新企业"),
            t("Banks that refused to lend any money", "拒绝放贷的银行"),
          ],
          t(
            "The fifth paragraph says banks kept lending to insolvent companies, which survived as zombie companies, too weak to grow.",
            "第五段说银行继续向资不抵债的公司放贷，这些公司作为僵尸企业苟延残喘，弱得无法成长。",
          ),
        ),
        ask(
          t("Why can falling prices harm an economy, according to the passage?", "根据文章，物价下跌为什么会损害经济？"),
          t("People delay buying, so companies sell less and cut wages", "人们推迟购买，于是公司卖得更少并削减工资"),
          [
            t("Falling prices make all goods disappear from shops", "物价下跌使所有商品从商店消失"),
            t("Companies are forced by law to raise wages", "法律强制公司提高工资"),
            t("People spend too much money too quickly", "人们花钱太多太快"),
          ],
          t(
            "The sixth paragraph says if people expect things to be cheaper next year they delay buying, so companies sell less, cut wages and investment.",
            "第六段说如果人们预期明年东西更便宜，就会推迟购买，于是公司卖得更少，削减工资和投资。",
          ),
        ),
      ],
      ["Japan", "Japan's", "Tokyo", "Imperial", "California"],
    ),
    passage(
      "the-average-that-lies",
      t("The Average That Lies", "会撒谎的平均数"),
      `Imagine a small café where ten people are drinking coffee. Each of them earns about 40,000 dollars a year. Their average income is, of course, about 40,000 dollars.

Now imagine that one of the richest people in the world walks in and sits down, someone who earns, say, a billion dollars a year. Suddenly, the average income of the eleven people in the café is more than ninety million dollars. Not one of the original ten has received a single extra cent. Yet if you reported only the average, you could truthfully say that the people in the café were, on average, fabulously rich.

This example is extreme, but it shows a real problem. The word "average" usually refers to the mean: add up all the values and divide by how many there are. The mean is easily pulled upward or downward by a few very large or very small values. When a group contains a few people with enormous incomes, the mean tells you very little about what a typical member earns.

For this reason, economists who describe incomes often prefer another measure, the median. To find the median, put all the values in order and choose the one in the middle. In the café, the median income stays at about 40,000 dollars, whether or not the billionaire is there. It describes the typical person far better.

In many countries, the mean income is much higher than the median, because a small number of people earn very large amounts. A government that wanted its economy to sound successful might choose to report mean incomes. A union arguing for higher wages might prefer to report the median, or the wages of the lowest-paid workers. Both figures could be accurate. They would simply tell different stories.

The same problem appears in many places. A company might boast that its employees earn an average of 90,000 dollars a year, when most of them earn far less and a few executives earn millions. A report might say that the average house in a town costs 600,000 dollars, when a few mansions have raised the figure far above what most families pay.

None of this means that averages are useless. It means that when you see one, you should ask a few questions. Which average is it? Are there extreme values that might distort it? And what would the median, or the full range of values, show? A single number can hide as much as it reveals.`,
      [numbers, economyWords],
      [
        ask(
          t("What does the café example show about the mean?", "咖啡馆的例子说明了平均值的什么问题？"),
          t("One extreme value can pull it far from what is typical", "一个极端值就能使它远离典型情况"),
          [
            t("It is always the most accurate kind of average", "它总是最准确的一种平均数"),
            t("It cannot be calculated for small groups", "它不能用于计算小团体"),
            t("It always equals the median income", "它总是等于收入中位数"),
          ],
          t(
            "When one billionaire joins, the mean jumps to over ninety million dollars though no one else earns more, showing how one value distorts it.",
            "一位亿万富翁加入后，平均值跃升到九千多万美元，而其他人的收入一分没多，说明一个数值就能扭曲它。",
          ),
        ),
        ask(
          t("Why do economists often prefer the median when describing incomes?", "为什么经济学家描述收入时常常更喜欢中位数？"),
          t("It is not pulled up by a few very large incomes", "它不会被少数极高收入拉高"),
          [
            t("It is easier to calculate than the mean", "它比平均值更容易计算"),
            t("It always shows that people are richer", "它总是显示人们更富有"),
            t("It includes only the lowest-paid workers", "它只包括收入最低的工人"),
          ],
          t(
            "The fourth paragraph says the median stays about the same whether or not the billionaire is there and describes the typical person better.",
            "第四段说不管亿万富翁在不在，中位数都基本不变，更能描述典型的人。",
          ),
        ),
        ask(
          t(
            "Why might a government and a union report different figures for the same incomes?",
            "为什么政府和工会可能对同样的收入报出不同的数字？",
          ),
          t("Each would choose the accurate figure that best supports its own story", "双方都会选择最能支持自己说法的准确数字"),
          [
            t("One of them would always be lying about the data", "其中一方总是在数据上撒谎"),
            t("They would be measuring different countries", "他们测量的是不同的国家"),
            t("Unions are not allowed to use the mean", "工会不被允许使用平均值"),
          ],
          t(
            "The fifth paragraph says a government might prefer the mean and a union the median; both could be accurate but tell different stories.",
            "第五段说政府可能偏好平均值而工会偏好中位数；两者都可能准确，却讲述不同的故事。",
          ),
        ),
      ],
      [],
    ),
    passage(
      "learning-on-the-job",
      t("Learning on the Job", "在工作中学习"),
      `At sixteen, Jonas left school in the morning and went to work. Three days a week, he worked at a company in Stuttgart that builds machines for factories, learning to read technical drawings, operate tools and repair electrical systems under the eye of an experienced engineer. The other two days, he attended a vocational school, where he studied mathematics, physics and the theory behind his trade. He was paid a monthly wage from the first week.

Jonas is an apprentice, one of more than a million young people in Germany training in what is called the dual system. It combines learning in a workplace with learning in a classroom, usually over three years. About half of young Germans who finish school go through it, training for more than three hundred different occupations, from baker to bank clerk and from mechanic to medical assistant.

The system has deep roots. In the Middle Ages, young people learned crafts by living and working with a master for years. The modern version, though, is carefully organized. Employers, trade unions and the government agree on what each apprenticeship must teach. At the end, apprentices take an exam set by local chambers of industry and commerce, and those who pass receive a credential that is recognized by employers across the country.

Supporters argue that the system brings real benefits. Germany has one of the lowest rates of youth unemployment in Europe, partly because so many young people move straight from training into work, often with the company that trained them. Employers get workers with exactly the skills they need. Apprentices earn money, gain experience and avoid the large debts that many university students in other countries take on.

The system has critics too. Students must choose a career path at an early age, often around fifteen or sixteen, when many do not yet know what they want to do. Some apprenticeships offer limited chances for later promotion. And in recent years, more young Germans have chosen university, leaving some trades, such as plumbing and building, struggling to find apprentices.

Many other countries have tried to copy the German model, with mixed success. It depends on employers who are willing to invest years in training young people who might later leave, and on a culture that treats skilled trades with respect.

For Jonas, the choice has been a good one. "My friends at university talk about theory," he says. "I can explain the theory, and then I can go and fix the machine." His company has already offered him a permanent job.`,
      [careerWords],
      [
        ask(
          t('What is the "dual system" of training?', '"双元制"培训是什么？'),
          t("Learning in a workplace combined with learning in a vocational school", "工作场所学习与职业学校学习相结合"),
          [
            t("Studying two subjects at university at once", "在大学同时学习两个专业"),
            t("Working for two different companies each week", "每周为两家不同的公司工作"),
            t("Training to be both a baker and a bank clerk", "同时接受面包师和银行职员的培训"),
          ],
          t(
            "The second paragraph says the dual system combines learning in a workplace with learning in a classroom, usually over three years.",
            "第二段说双元制把工作场所的学习与课堂学习结合起来，通常为期三年。",
          ),
        ),
        ask(
          t("Which is a criticism of the system mentioned in the passage?", "文章提到了对这一制度的哪一种批评？"),
          t(
            "Students must choose a career when many are too young to know what they want",
            "学生必须在许多人还太年轻、不知道自己想要什么时选择职业",
          ),
          [
            t("Apprentices are not paid for their work", "学徒的工作没有报酬"),
            t("No employers recognize the final credential", "没有雇主认可最后的证书"),
            t("It leads to very high youth unemployment", "它导致很高的青年失业率"),
          ],
          t(
            "The fifth paragraph says students must choose a path around fifteen or sixteen, when many do not yet know what they want to do.",
            "第五段说学生要在十五六岁左右选择道路，而那时许多人还不知道自己想做什么。",
          ),
        ),
        ask(
          t("What does Jonas's comment suggest about his training?", "约纳斯的话说明他的培训怎样？"),
          t("It has given him both theory and the practical skill to use it", "它使他既懂理论，又有运用理论的实际技能"),
          [
            t("He regrets not going to university instead", "他后悔没有去上大学"),
            t("His friends at university cannot fix machines", "他上大学的朋友不会修机器"),
            t("He does not understand the theory of his trade", "他不懂自己行业的理论"),
          ],
          t(
            "He says he can explain the theory and then go and fix the machine, showing that his training joins knowledge and practice.",
            "他说他能解释理论，然后去修好机器，表明他的培训把知识和实践结合了起来。",
          ),
        ),
      ],
      ["Jonas", "Jonas's", "Stuttgart", "Germany", "Germans", "German", "Europe", "Middle", "Ages"],
    ),
    passage(
      "a-debt-and-a-country",
      t("A Debt and a Country", "一笔债务与一个国家"),
      `In October 2009, a newly elected government in Greece made an alarming announcement. The country's budget deficit, the gap between what the government spent and what it collected in taxes, was far larger than previous governments had reported. Instead of about 6 percent of the size of the economy, it was more than 12 percent, and it later turned out to be even higher. The national debt was larger than the entire economy.

The news shook the financial markets. Greece used the euro, the currency shared by many European countries, so it could not simply print more money or lower the value of its currency to help itself. Investors began to fear that Greece could not repay what it owed. They demanded much higher interest rates to lend it money, which made its debts even harder to pay. By 2010, Greece was close to being unable to borrow at all.

Other countries that used the euro, together with the International Monetary Fund, agreed to lend Greece enormous sums. But the loans came with strict conditions. Greece had to adopt a program of austerity: cutting government spending sharply and raising taxes, in order to reduce its deficit. Pensions and public wages were cut. Thousands of government jobs were eliminated. Taxes on goods and income rose.

The results were severe. The Greek economy shrank by about a quarter over several years, a fall comparable to the Great Depression in the United States. Unemployment rose above 27 percent, and among young people it reached about 60 percent. Many businesses closed. Hundreds of thousands of young Greeks, many of them highly educated, left the country to find work abroad. There were large protests in Athens, some of them violent.

People still disagree sharply about who was to blame and what should have been done. Some argue that Greece had spent beyond its means for years, collected taxes poorly and hidden the true size of its debts, and that painful reforms were unavoidable. Others argue that the lenders' demands were too harsh, that cutting spending in the middle of a deep recession made the recession worse, and that banks which had lent carelessly should have shared more of the losses.

Greece's economy began to grow again in the late 2010s, and in 2018 it left the last of its rescue programs. But the crisis left deep marks. For economists, it became a central example in a long debate: when a country is in debt and its economy is shrinking, should the government cut spending, or spend more until the economy recovers?`,
      [economyWords, numbers],
      [
        ask(
          t("Why could Greece not solve its problem by printing more money?", "为什么希腊不能靠多印钞票来解决问题？"),
          t("It used the euro, a currency shared with other countries", "它使用欧元，一种与其他国家共用的货币"),
          [
            t("It had no machines for printing money", "它没有印钞机"),
            t("The International Monetary Fund forbade it", "国际货币基金组织禁止它这样做"),
            t("Its banks had already printed too much", "它的银行已经印得太多了"),
          ],
          t(
            "The second paragraph says Greece used the euro, so it could not simply print more money or lower the value of its currency.",
            "第二段说希腊使用欧元，所以不能简单地多印钞票或让本国货币贬值。",
          ),
        ),
        ask(
          t("What did the program of austerity require?", "紧缩计划要求什么？"),
          t("Sharp cuts in government spending and higher taxes", "大幅削减政府开支并提高税收"),
          [
            t("More government jobs and higher pensions", "更多的政府岗位和更高的养老金"),
            t("Leaving the euro and printing a new currency", "退出欧元并印发新货币"),
            t("Lending money to the other countries of Europe", "向其他欧洲国家贷款"),
          ],
          t(
            "The third paragraph says Greece had to cut government spending sharply and raise taxes to reduce its deficit.",
            "第三段说希腊必须大幅削减政府开支并提高税收以减少赤字。",
          ),
        ),
        ask(
          t("How does the fifth paragraph treat the question of blame?", "第五段怎样处理责任问题？"),
          t("It sets out the arguments of both sides without choosing one", "它摆出双方的论点，而不选择其中一方"),
          [
            t("It blames only the Greek government", "它只怪罪希腊政府"),
            t("It blames only the foreign lenders", "它只怪罪外国债权人"),
            t("It says that no one was to blame at all", "它说根本没有人该负责"),
          ],
          t(
            "It gives the view that Greece overspent and hid its debts, then the view that the lenders' demands were too harsh, and leaves the debate open.",
            "它先给出希腊过度开支、隐瞒债务的观点，再给出债权人要求过于苛刻的观点，并让争论保持开放。",
          ),
        ),
      ],
      ["Greece", "Greece's", "Greek", "Greeks", "Athens", "International", "Monetary", "Fund", "European"],
    ),
    passage(
      "the-graph-that-started-at-ninety",
      t("The Graph That Started at Ninety", "从九十开始的图表"),
      `The chart in the advertisement was impressive. It showed two bars, one short and one very tall. The short bar was labeled "Other brands." The tall bar was labeled "Fresha toothpaste." At a glance, Fresha seemed to clean teeth three or four times better than its rivals.

But look at the numbers along the side of the chart. The scale did not begin at zero. It began at 90. The short bar reached 92, and the tall bar reached 96. In other words, Fresha's result was about four percent higher than its competitors', a small difference made to look enormous by cutting off the bottom of the chart.

This is one of the most common ways that graphs can mislead. Our eyes compare the heights of bars, not the numbers beside them. When the bottom of the scale is removed, small differences appear huge. Sometimes there is a good reason to start a scale above zero, for example when showing small changes in body temperature. But when the purpose of a chart is to compare amounts, a scale that does not start at zero should make a careful reader suspicious.

There are other tricks. A line graph can be stretched tall and narrow to make a gentle rise look like a dramatic climb, or squashed flat to make a steep fall look like a gentle decline. A chart can show only the years that support a claim, leaving out earlier or later years that would tell a different story. A company might show its profits rising from one year to the next, without mentioning that the first year was its worst in a decade.

Percentages can mislead in a similar way. A headline that says a new medicine "doubles the risk" of a side effect sounds frightening. But if the risk rises from one person in a million to two in a million, the danger is still tiny. On the other hand, "only a two percent increase" in a large number, such as the number of people out of work in a big country, can mean hundreds of thousands of people.

Even accurate numbers can be arranged to persuade. A government might announce that it is spending more on schools than ever before, which may be true simply because prices and the number of students have risen. Compared to the size of the economy, the spending might actually have fallen.

None of these tricks require false data. That is what makes them effective. The best defense is to slow down, read the labels and the scale, and ask a simple question: compared to what?`,
      [numbers, academic1, academic2, academic3],
      [
        ask(
          t("Why did Fresha's bar look so much taller than the other brands'?", "为什么Fresha的柱子看起来比其他品牌的高那么多？"),
          t("The scale began at 90 instead of zero, exaggerating a small difference", "刻度从90而不是从零开始，夸大了微小的差别"),
          [
            t("Fresha cleaned teeth four times better than its rivals", "Fresha的清洁效果是竞争对手的四倍"),
            t("The other brands had refused to be tested", "其他品牌拒绝接受测试"),
            t("The chart showed the results of many more years", "图表显示了更多年份的结果"),
          ],
          t(
            "The second paragraph says the scale began at 90, so a result of 96 against 92 was made to look enormous.",
            "第二段说刻度从90开始，所以96对92的结果被弄得看起来差距巨大。",
          ),
        ),
        ask(
          t('Why can "doubles the risk" be misleading?', '为什么"风险加倍"可能具有误导性？'),
          t("A doubled risk can still be tiny if the starting risk was very small", "如果起始风险很小，加倍后的风险仍可能微乎其微"),
          [
            t("Medicines never have any side effects", "药物从来没有任何副作用"),
            t("A risk can never be measured as a number", "风险永远无法用数字衡量"),
            t("Headlines are not allowed to use percentages", "标题不允许使用百分比"),
          ],
          t(
            "The fifth paragraph says a rise from one in a million to two in a million doubles the risk but leaves it tiny.",
            "第五段说从百万分之一升到百万分之二是风险加倍，但仍然微乎其微。",
          ),
        ),
        ask(
          t("Why does the passage say these tricks are effective?", "文章为什么说这些手法很有效？"),
          t("They do not need any false data", "它们不需要任何虚假数据"),
          [
            t("They are hidden in very small print", "它们藏在很小的字里"),
            t("They are approved by every government", "每个政府都认可它们"),
            t("Readers always check the scale first", "读者总是先查看刻度"),
          ],
          t(
            "The last paragraph says none of these tricks require false data, and that is what makes them effective.",
            "最后一段说这些手法都不需要虚假数据，这正是它们有效的原因。",
          ),
        ),
      ],
      ["Fresha", "Fresha's"],
    ),
    passage(
      "the-first-invoice",
      t("The First Invoice", "第一张发票"),
      `Mei had been drawing since she could hold a pencil, and by seventeen she was good enough that people had started to notice. Her illustrations, mostly animals in strange and funny situations, had gathered a small following online. So when a message arrived from the owner of a new bakery in her town, asking whether she would design a logo and a set of drawings for the shop's menus and paper bags, she was thrilled.

"How much would you charge?" the owner, a woman named Mrs. Delgado, asked.

Mei had no idea. She had never been paid for her art. She thought about saying she would do it for free, just for the experience. Then she thought about the hours it would take, at least twenty, probably more. She asked her aunt, who worked as a freelance graphic designer, for advice.

Her aunt was firm. "Never work for nothing," she said. "If you value your work at zero, so will everyone else." She helped Mei research what other young illustrators charged, and suggested a price that made Mei's stomach turn over. It seemed far too much.

Mei sent the figure to Mrs. Delgado with an apologetic message. Mrs. Delgado replied that it was more than she had budgeted for. Mei almost lowered the price at once. But her aunt had told her what to do. Instead of dropping the price, she offered a choice: she could do the full set of drawings for the price she had named, or the logo alone for less. Mrs. Delgado thought for a day and chose the full set.

Her aunt also insisted on a written agreement. It stipulated what Mei would deliver, when she would deliver it, how many rounds of changes were included and when she would be paid. Mei thought it seemed unfriendly. It turned out to be essential. Halfway through the project, Mrs. Delgado asked for an extra set of drawings for a website. Because of the agreement, Mei could say politely that this was additional work and send a separate price.

The drawings took twenty-eight hours. When the bakery opened, Mei's foxes and owls were on every bag and every menu, and customers asked who had drawn them. Mrs. Delgado gave her name and recommended her to two other shops.

The first invoice Mei ever sent was for the largest sum of money she had ever earned. But what she remembered most was something else: the moment she had chosen not to apologize for asking to be paid.`,
      [careerWords, motives],
      [
        ask(
          t("Why did Mei's aunt tell her never to work for nothing?", "梅的姑姑为什么告诉她永远不要白干？"),
          t("If Mei valued her work at zero, others would value it that way too", "如果梅把自己的工作看得一文不值，别人也会这样看"),
          [
            t("Free work is against the law for young people", "年轻人免费工作是违法的"),
            t("Mrs. Delgado would never accept free drawings", "德尔加多太太绝不会接受免费的画"),
            t("Her aunt wanted a share of the money", "她的姑姑想分一部分钱"),
          ],
          t(
            'Her aunt says, "If you value your work at zero, so will everyone else."',
            '她的姑姑说："如果你把自己的工作估价为零，其他人也会这样。"',
          ),
        ),
        ask(
          t("How did Mei respond when Mrs. Delgado said the price was too high?", "德尔加多太太说价格太高时，梅是怎样回应的？"),
          t("She offered a choice between the full set and a cheaper, smaller job", "她提供了全套作品和更便宜的较小工作之间的选择"),
          [
            t("She lowered her price by half at once", "她立刻把价格降了一半"),
            t("She refused to do any work at all", "她拒绝做任何工作"),
            t("She asked her aunt to do the drawings", "她请姑姑来画"),
          ],
          t(
            "The fifth paragraph says she offered the full set at her price or the logo alone for less.",
            "第五段说她提出按原价做全套作品，或者以更低的价格只做标志。",
          ),
        ),
        ask(
          t("How did the written agreement help Mei?", "书面协议怎样帮助了梅？"),
          t("It let her treat the extra website drawings as separate, paid work", "它使她能把额外的网站绘画当作单独付费的工作"),
          [
            t("It forced Mrs. Delgado to pay double", "它迫使德尔加多太太付双倍的钱"),
            t("It allowed Mei to finish the work early", "它使梅能提前完成工作"),
            t("It stopped other shops from hiring her", "它阻止其他商店雇用她"),
          ],
          t(
            "Because the agreement stipulated what was included, Mei could politely say the website drawings were additional work with a separate price.",
            "因为协议规定了包含的内容，梅可以礼貌地说网站绘画是额外工作，需另行报价。",
          ),
        ),
      ],
      ["Mei", "Mei's", "Delgado"],
    ),
  ],
};
