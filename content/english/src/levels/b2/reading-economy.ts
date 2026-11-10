// The reading unit of the B2 theme Work and the Economy: inflation, a startup that failed, the four-day week, exports,
// freelance work, a factory town, who owns a company and the cost of a cup of coffee.

import { type ReadingUnitDef, t } from "@ga/content";
import { passageMaker } from "../pre-a1/reading-kit.ts";
import { readingWords } from "./reading-words.ts";

const passive = "passive-with-modals-and-perfect-forms";
const causative = "causative-have-and-get";

const passage = passageMaker(readingWords, [
  "b2-words-economy",
  "b2-words-companies",
  "b2-words-management",
  "b2-words-employment",
  "b2-words-finance",
  "b2-words-work-conditions",
  "b2-words-production",
  "b2-words-skills",
  "b2-words-success",
  "b2-words-linking-2",
  "b2-words-quantity",
  passive,
  causative,
]);

/** readingEconomy is the reading unit of the theme Work and the Economy. */
export const readingEconomy: ReadingUnitDef = {
  id: "b2-reading-economy",
  title: t("Work and the Economy", "工作与经济"),
  passages: [
    passage({
      id: "b2-economy-what-causes-inflation",
      title: ["What Causes Inflation", "通货膨胀的原因"],
      body: `If you have ever heard your grandparents talk about the price of bread when they were young, you already know something about inflation. Inflation is the rate at which prices rise over time. When it is 3 percent a year, something that costs 100 dollars today will cost 103 dollars next year. In other words, the same amount of money buys a little less.

Experts usually describe two important causes. The first is that people want to buy more than the economy can produce. In a boom, when wages are high and jobs are easy to find, people spend more. If shops and factories cannot increase their output quickly enough, the goods become scarce, and prices go up. This is sometimes called "demand-pull" inflation.

The second cause comes from the side of production. When the cost of energy, materials or wages rises, manufacturers and suppliers have to pay more to make the same goods, and they usually pass these costs on to their customers. In 2022, for example, the price of oil and gas rose very quickly, and inflation in many countries rose to levels that had not been seen for forty years.

A third cause is the amount of money in the economy. If a government just prints more money to pay for its expenditure, there is more money but not more goods, so each dollar is worth less. At its worst, this can lead to hyperinflation, when prices double every few days. In Zimbabwe in 2008, notes of one hundred trillion dollars were printed, and they were still not sufficient to buy bread.

A modest level of inflation, about 2 percent a year, is usually considered healthy, because it encourages people to spend and invest instead of keeping cash. Excessive inflation, however, is bad, especially for people on low incomes and for those who depend on their savings. To control it, central banks usually raise interest rates, which makes borrowing more expensive and reduces spending. Accordingly, when inflation rises, the news is often followed by a report that interest rates have been increased.`,
      grammar: [passive],
      names: ["Zimbabwe"],
      glossed: ["demand-pull", "hyperinflation", "trillion", "central"],
      questions: [
        [
          ['What is "demand-pull" inflation?', "什么是“需求拉动型”通货膨胀？"],
          ["Prices rise because people want more than can be produced", "人们想买的东西超过了能生产的数量，导致价格上涨"],
          [
            ["Prices rise because wages fall during a boom", "繁荣时期工资下降，导致价格上涨"],
            ["Prices rise because a government prints too little money", "政府印的钱太少，导致价格上涨"],
          ],
          [
            'It happens when "people want to buy more than the economy can produce", so goods become scarce and prices go up.',
            "当人们想买的东西超过经济能生产的数量时，商品变得稀缺，价格上涨。",
          ],
        ],
        [
          ["Why did inflation rise in many countries in 2022?", "2022 年许多国家的通货膨胀为什么上升？"],
          ["The cost of oil and gas went up sharply", "石油和天然气的价格大幅上涨"],
          [
            ["Central banks printed notes of a trillion dollars", "中央银行印了面值一万亿元的钞票"],
            ["People saved more and spent less", "人们存得更多、花得更少"],
          ],
          [
            '"The price of oil and gas rose very quickly", so producers paid more and passed the costs on to customers.',
            "石油和天然气价格大涨，生产者成本上升，并把成本转嫁给顾客。",
          ],
        ],
        [
          ["What do central banks usually do to control inflation?", "中央银行通常怎样控制通货膨胀？"],
          ["They raise interest rates so that people borrow and spend less", "提高利率，让人们少借钱、少消费"],
          [
            ["They print more money so that prices fall", "多印钱，让价格下降"],
            ["They reduce interest rates to encourage spending", "降低利率以鼓励消费"],
          ],
          [
            'They "raise interest rates, which makes borrowing more expensive and reduces spending."',
            "提高利率会让借钱更贵，从而减少消费。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-economy-the-startup-that-failed-and-tried-again",
      title: ["The Startup That Failed and Tried Again", "失败后重来的初创公司"],
      body: `When Lena Fischer was twenty-six, she left a job that paid well at a bank to start her own business. Her idea was simple: an app that would connect people who wanted to rent out their tools with neighbors who needed them for a day. Why should every family own a drill that it uses for ten minutes a year?

Initially, everything went well. Lena and two friends built the app in a few months, and a small investor gave them 200,000 dollars of funding. Hundreds of people signed up in the first weeks, and a local newspaper called them "the most innovative startup in the city".

Then the problems began. People were happy to lend their tools, but very few wanted to borrow them, and the company earned a small fee only when something was rented. Revenue was minimal, while the costs of salaries and advertising were substantial. Eighteen months later, the money had run out. The company went bankrupt, and Lena had to tell her team that they would be dismissed.

"It was the worst day of my life," she says. "I felt that I had let everybody down." For many months she did not want to talk about business at all.

Eventually, however, she began to analyze what had gone wrong. She realized that she had been so excited about her idea that she had never checked whether people really needed it. "We built the product first and asked questions later. The questions should have been asked first."

Her second company started in a very different way. Before building anything, Lena spent three months talking to small building firms, and she discovered that they wasted hours every week trying to find out where their equipment was. Her new startup sells a simple app that helps building firms find their tools. This time, the first customers paid before the product was even finished.

Today the company employs forty people and is growing steadily. Lena now gives talks to young entrepreneurs, and her message is always the same: "A setback is not the end. Failing taught me more than any success could have. The important thing is to learn from it, and to persevere."`,
      grammar: [passive],
      names: ["Lena", "Fischer", "Lena's"],
      glossed: ["drill", "entrepreneurs"],
      questions: [
        [
          ["Why did Lena's first company fail?", "莉娜的第一家公司为什么失败？"],
          ["Few people wanted to borrow tools, so it earned too little", "很少有人想借工具，所以收入太少"],
          [
            ["Nobody wanted to lend their tools", "没有人愿意出借工具"],
            ["The investor took back the funding", "投资者收回了资金"],
          ],
          [
            '"Very few wanted to borrow them", so revenue "was minimal, while the costs ... were substantial."',
            "很少有人借工具，收入极少，而成本很高。",
          ],
        ],
        [
          ["What did Lena realize she had done wrong?", "莉娜意识到自己错在哪里？"],
          ["She had not checked whether people needed the product", "她没有确认人们是否真的需要这个产品"],
          [
            ["She had spent too long talking to customers", "她花了太多时间和客户交谈"],
            ["She had hired too few people", "她雇的人太少"],
          ],
          [
            'She "had never checked whether people really needed it": "We built the product first and asked questions later."',
            "她从未确认人们是否真的需要，先做产品、后提问题。",
          ],
        ],
        [
          ["What was different about her second company?", "她的第二家公司有什么不同？"],
          ["She studied the customers' problem before building anything", "她在做任何东西之前先研究了客户的问题"],
          [
            ["She sold the same app to building firms", "她把同一个应用卖给了建筑公司"],
            ["She worked alone without a team", "她独自工作，没有团队"],
          ],
          [
            "She spent three months talking to building firms before building anything, and the first customers paid before the product was finished.",
            "她先花三个月和建筑公司交谈，再写代码，第一批客户在产品完成前就付了钱。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-economy-working-four-days-a-week",
      title: ["Working Four Days a Week", "每周工作四天"],
      body: `For about a hundred years, the normal working week in most rich countries has been five days long. Recently, however, a growing number of companies have been trying something different: four days of work for the same pay.

The largest experiment so far took place in the United Kingdom in 2022. Sixty-one companies, from small software firms to a fish restaurant, agreed to reduce working hours by about a fifth for six months, without reducing wages. The results were evaluated by experts from different universities.

The outcomes were impressive. Revenue at the companies stayed roughly the same, and at some firms it rose slightly. The number of employees who left fell by more than half, and the number of days lost to illness fell by about 65 percent. Employees reported that they slept better, felt less worried and had more time for their families. At the end of the experiment, fifty-six of the sixty-one companies decided to keep the shorter week, and eighteen made the change permanent.

How is it possible to produce the same output in less time? Managers in the experiment said that they had to decide on clear priorities. Many meetings were made shorter or stopped completely, emails were answered at fixed times, and tasks that added little value were dropped. "We discovered how much of our week was wasted," said one manager.

Nevertheless, a shorter week is not right for everyone. In hospitals, schools and shops, someone has to be there every day, so a shorter week for each employee means that more people have to be recruited, which costs money. Some employees in the experiment also found that their workload had just been squeezed into four longer days, which made them more tired, not less.

Some people also point out that the companies chose to take part, so they were presumably the ones that would do best. It is not clear whether the same results could be achieved by every firm.

Undoubtedly, however, the experiment has changed the debate. Before it, a week of four days seemed like a dream. Now it is being discussed by governments, unions and employers in many countries.`,
      grammar: [passive],
      names: ["United", "Kingdom"],
      glossed: ["squeezed", "meetings"],
      questions: [
        [
          ["What happened to revenue during the UK experiment?", "英国试验期间，公司的收入怎样？"],
          ["It stayed about the same or rose a little", "基本不变，有的略有上升"],
          [
            ["It fell by about a fifth", "下降了约五分之一"],
            ["It fell by more than half", "下降了一半以上"],
          ],
          ['"Revenue at the companies stayed roughly the same, and at some firms it rose slightly."', "公司收入基本持平，有的还略有增长。"],
        ],
        [
          ["How did managers keep output the same in fewer hours?", "经理们怎样在更少的时间里保持产出？"],
          ["They set priorities and cut meetings and low-value tasks", "设定优先事项，减少会议和价值不大的任务"],
          [
            ["They recruited many more workers", "他们招聘了更多员工"],
            ["They made employees work at weekends", "他们让员工周末上班"],
          ],
          [
            'Managers "had to decide on clear priorities": meetings were shortened or cancelled and tasks of little value were dropped.',
            "经理们设定明确的优先事项，缩短或取消会议，去掉价值不大的任务。",
          ],
        ],
        [
          ["Why might the results not apply to every company?", "为什么这些结果不一定适用于所有公司？"],
          ["The firms chose to take part, so they were likely to succeed", "这些公司是自愿参加的，本来就更可能成功"],
          [
            ["The experiment lasted only six days", "试验只持续了六天"],
            ["Most of the companies were hospitals and schools", "大多数参与公司是医院和学校"],
          ],
          [
            'Critics say the companies "chose to take part, so they were presumably the ones that would do best."',
            "批评者指出，这些公司是自愿参加的，大概本来就最可能成功。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-economy-why-some-countries-export-more",
      title: ["Why Some Countries Export More", "为什么有些国家出口更多"],
      body: `Look at the labels on the things around you, and you will probably find that they were made in many different countries: a phone assembled in China, coffee from Brazil, a car from Germany. Every country exports some goods and imports others. But why do some countries export so much more than others?

The first reason is natural resources. Countries such as Saudi Arabia and Norway have abundant oil and gas, and a large part of their exports comes from these. Australia exports huge amounts of iron and coal, and Chile produces more copper than any other country. However, natural resources can also bring risks. When prices fall, countries that depend on a single product can quickly fall into recession.

The second reason is skills and technology. Germany, Japan and South Korea have few natural resources, yet they are some of the countries that export the most in the world. Their success comes from a skilled workforce, decades of investment in education and research, and firms that are famous for their quality. They export products that are hard to copy, such as machines, cars and computer chips.

The third reason is cost. Over the last forty years, a great deal of manufacturing has moved to countries where wages are lower. China's exports grew very fast after 1980, when the country opened up to foreign companies, and today it exports more goods than any other country. Vietnam and Bangladesh have followed a similar path, beginning with clothes and shoes and gradually moving to products that need more skill.

Finally, government policy plays an important role. Good roads, ports and electricity make it cheaper to move goods, and deals between countries reduce the taxes that are paid when goods cross a border. Some governments also offer subsidies to companies that export, although their competitors often say that this is not fair.

Exporting more than you import is not always a sign of a healthy economy, however. A country with a large trade deficit, like the United States, can still be wealthy, because it receives investment from all over the world. What matters ultimately is not the difference between exports and imports, but whether people's lives are getting better.`,
      grammar: [passive],
      names: [
        "China",
        "Brazil",
        "Germany",
        "Saudi",
        "Arabia",
        "Norway",
        "Australia",
        "Chile",
        "Japan",
        "South",
        "Korea",
        "Vietnam",
        "Bangladesh",
        "United",
        "States",
        "China's",
        "people's",
      ],
      glossed: ["assembled", "iron", "copper", "chips", "ports"],
      questions: [
        [
          ["Why can natural resources be a risk?", "为什么自然资源可能带来风险？"],
          ["Countries that depend on one product suffer when its price falls", "依赖单一产品的国家在价格下跌时会受损"],
          [
            ["They are always used up within a few years", "它们总会在几年内用完"],
            ["They make it hard to build roads and ports", "它们让修路建港变得困难"],
          ],
          [
            '"When prices fall, countries that depend on a single product can quickly fall into recession."',
            "价格下跌时，依赖单一产品的国家很快会陷入衰退。",
          ],
        ],
        [
          ["What explains the exports of Germany, Japan and South Korea?", "德国、日本和韩国的出口靠什么？"],
          ["Skilled workers, investment in education and quality products", "熟练的劳动力、对教育的投资和高质量产品"],
          [
            ["Large amounts of oil and gas", "大量石油和天然气"],
            ["Very low wages", "非常低的工资"],
          ],
          [
            'Their success "is based on a skilled workforce, decades of investment in education and research, and firms ... famous for their quality."',
            "它们的成功基于熟练的劳动力、数十年的教育和研究投资以及以质量著称的企业。",
          ],
        ],
        [
          ["What does the writer say about a trade deficit?", "作者对贸易逆差怎么看？"],
          ["It does not necessarily mean that a country is poor", "它不一定说明一个国家贫穷"],
          [
            ["It always leads to a recession", "它总会导致经济衰退"],
            ["It is the best measure of a healthy economy", "它是衡量经济健康的最好标准"],
          ],
          [
            'A country with a large trade deficit "can still be wealthy"; what matters is "whether people\'s lives are getting better."',
            "贸易逆差大的国家仍可能很富有，重要的是人们的生活是否在变好。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-economy-the-rise-of-freelance-work",
      title: ["The Rise of Freelance Work", "自由职业的兴起"],
      body: `Twenty years ago, most young people who finished their studies hoped to find a permanent job with one employer. Today, a growing number of them work freelance: instead of receiving a salary, they sell their services to different clients, one project at a time. In some countries, more than a third of the workforce now does at least some freelance work.

Technology is the biggest reason for this change. Websites and apps make it easy for a designer in Manila to work for a company in London, or for a writer in Madrid to find clients in Tokyo. Companies like it because they can pay experts for a single project without the costs of a permanent employee, such as holidays and pensions.

Many freelancers say they would never go back to an office. "I choose my projects, I decide when I work, and I can work from any place with an internet connection," says Daniel, a video editor from Lisbon. Freelancers who have expertise that few others have, such as programmers and data experts, can often earn much more than they would in a permanent job.

But freelance work has a darker side. Freelancers are not usually entitled to sick pay, paid holidays or maternity and paternity leave. Their income can be very different from one month to the next, which makes it difficult to plan or to get a mortgage. Many of them work on apps that deliver food or give rides, where the pay for each job is low and the app decides who gets work. Some people say this is a form of exploitation, and in a number of countries, courts have decided that drivers for such apps should be considered employees, not freelancers.

Freelancers who do well say it requires special skills. Besides being good at their job, they must be resourceful at finding clients, careful about deadlines and adaptable when the market changes. They also need to be good with money. "In a good month, you have to save money for a bad month," says Daniel. "Nobody else will do it for you."

Whether freelance work is a good thing or a bad thing probably depends on who you are. For a skilled professional, it can be the best of both worlds. For a worker who has no other way to earn money, it can mean working long hours with nothing to protect them.`,
      names: ["Manila", "London", "Madrid", "Tokyo", "Daniel", "Lisbon"],
      glossed: ["freelancers"],
      questions: [
        [
          ["Why do companies like using freelancers?", "公司为什么喜欢雇用自由职业者？"],
          ["They can hire experts for one project without long-term costs", "可以为单个项目雇专家，而不承担长期成本"],
          [
            ["Freelancers always work for lower pay", "自由职业者总是收费更低"],
            ["Freelancers must work in the company's office", "自由职业者必须在公司办公室工作"],
          ],
          [
            "Companies can hire experts for a single project without paying for holidays and pensions.",
            "公司可以为单个项目雇用专家，而不必支付假期、养老金和培训的费用。",
          ],
        ],
        [
          ["What is one disadvantage of freelance work?", "自由职业的一个缺点是什么？"],
          ["Freelancers usually get no sick pay or paid holidays", "自由职业者通常没有病假工资或带薪假期"],
          [
            ["Freelancers cannot choose their projects", "自由职业者不能选择项目"],
            ["Freelancers must live near their clients", "自由职业者必须住在客户附近"],
          ],
          [
            'Freelancers "are not usually entitled to sick pay, paid holidays or maternity and paternity leave."',
            "自由职业者通常无权享受病假工资、带薪假期以及产假和陪产假。",
          ],
        ],
        [
          ["What advice does Daniel give?", "丹尼尔给出了什么建议？"],
          ["Save money in good months for bad months", "在收入好的月份为不好的月份存钱"],
          [
            ["Always choose a permanent job", "总是选择长期工作"],
            ["Work only for clients in your own city", "只为本市的客户工作"],
          ],
          ['"In a good month, you have to save money for a bad month."', "收入好的月份要为收入差的月份存下钱。"],
        ],
      ],
    }),
    passage({
      id: "b2-economy-a-factory-town-after-the-factory-closed",
      title: ["A Factory Town After the Factory Closed", "工厂关闭后的工厂小镇"],
      body: `For almost a century, life in the small town of Millbrook depended on one building: the steel factory by the river. At its best, around 1975, it employed more than six thousand people, nearly half of the town's workforce. Fathers got their sons jobs there, the factory paid for the local football team, and its whistle told everyone when it was time for lunch.

Then, in 2009, the company that owned it announced that the factory would be closed. Steel could be produced at a lower cost abroad, and despite years of negotiations between the union and the managers, nobody could be found to buy it. Within a few weeks, three thousand people were made redundant.

The effects were felt far beyond the factory gates. Shops and restaurants lost their customers, and many of them had to close. Young people left to look for work in the cities, and house prices collapsed. Within five years, the population had fallen by a fifth, and problems with mental health and alcohol had increased very quickly.

For a long time, many people in Millbrook believed that the factory would open again. "We kept waiting for someone to save us," says Karen Doyle, who worked in the office for twenty-two years. "Eventually we realized that nobody was coming."

The turning point came when a group of workers who had lost their jobs, the local college and the town council decided to work together. The old factory was converted into offices and rooms for small workshops, which were rented at low prices to small businesses. The college started courses to retrain workers, from welding for wind turbines to computer skills. Grants from the government helped to fund the project.

Today, about two hundred small firms have offices in the old factory, employing roughly two thousand people. A company that builds parts for wind turbines has become the biggest employer, and the town is slowly beginning to thrive again.

However, not everyone has been helped. Many older workers never found another job, and the new jobs are often less well paid than the old ones. "The town has been saved," says Karen, "but it is not the same town. Something has been lost that cannot be replaced."`,
      grammar: [passive, causative],
      names: ["Millbrook", "Karen", "Doyle", "town's"],
      glossed: ["whistle", "welding", "turbines", "retrain", "workshops"],
      questions: [
        [
          ["Why was the steel factory closed?", "钢厂为什么关闭？"],
          ["Steel could be made more cheaply in other countries", "钢在其他国家生产更便宜"],
          [
            ["The union refused to negotiate", "工会拒绝谈判"],
            ["The workers moved to the cities", "工人们搬去了城市"],
          ],
          ['"Steel could be produced at a lower cost abroad", and no buyer could be found.', "钢在国外生产更便宜，而且找不到买家。"],
        ],
        [
          ["What happened to the town in the five years after the closure?", "工厂关闭后的五年里，小镇发生了什么？"],
          ["A fifth of the population left and house prices fell sharply", "五分之一的人口离开，房价暴跌"],
          [
            ["The factory reopened under a new owner", "工厂在新主人手下重新开工"],
            ["The shops and restaurants found new customers", "商店和餐馆找到了新顾客"],
          ],
          ['"House prices collapsed. Within five years, the population had fallen by a fifth."', "房价暴跌，五年内人口减少了五分之一。"],
        ],
        [
          ['What does Karen mean by "it is not the same town"?', "卡伦说“它已经不是原来的小镇了”是什么意思？"],
          ["The town has recovered, but something important is gone", "小镇恢复了，但一些重要的东西消失了"],
          [
            ["The town has been given a new name", "小镇换了新名字"],
            ["The town is now richer than before", "小镇现在比以前更富裕"],
          ],
          [
            '"The town has been saved ... but ... something has been lost that cannot be replaced."',
            "小镇得救了，但失去了一些无法替代的东西。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-economy-who-owns-a-company",
      title: ["Who Owns a Company?", "公司归谁所有？"],
      body: `When you buy something from a big corporation, you might imagine that it is owned by one rich person. In fact, most large companies are owned by thousands, or even millions, of people, many of whom have never been to the company's offices.

A small business is usually owned by the person who started it, sometimes with a partner. When it grows, however, it often needs more money than its owners have. One way to get it is to borrow from a bank. Another is to sell part of the company to investors. In return for their money, the investors receive shares, small pieces of the company. If a company has a million shares and you own ten thousand of them, you own one percent of it.

When a company becomes large enough, it may decide to sell its shares to the public on a stock exchange. From then on, anyone can buy them. Shareholders have two important advantages: they receive a part of the profits, which is paid as a dividend, and they can vote on important decisions, such as who sits on the board of directors.

So who are these shareholders? Some are ordinary people who buy shares through an app. However, the largest shareholders are usually big funds that invest the savings of millions of people. If you have a pension or a savings account, part of your money has probably been invested in the shares of companies you use every day. In this way, many of us are owners without knowing it.

In practice, the shareholders do not run the company. They elect the board, which appoints managers to implement the strategy and supervise the work. Because the owners and the managers are different people, this can cause problems. Managers may follow their own interests, such as large salaries, instead of the interests of the owners.

There is also a debate about whom a company should serve. Some argue that its only objective should be to make money for its shareholders. Others maintain that it has responsibilities to its employees, its customers and the community as well. Increasingly, investors themselves are asking companies to show that they are fair to workers and protect the environment, not only that they make a profit.`,
      grammar: [passive],
      names: ["company's"],
      glossed: ["advantages", "appoints"],
      questions: [
        [
          ["What do investors receive in return for their money?", "投资者出钱后得到什么？"],
          ["Shares, which are small pieces of the company", "股份，也就是公司的一小部分"],
          [
            ["A loan from a bank", "银行贷款"],
            ["A job as one of the managers", "一份经理的工作"],
          ],
          [
            '"In return for their money, the investors receive shares, small pieces of the company."',
            "投资者出钱后获得股份，也就是公司的一小部分。",
          ],
        ],
        [
          ['Why are many people "owners without knowing it"?', "为什么很多人“不知不觉成了股东”？"],
          ["Their pensions and savings have been invested in shares", "他们的养老金和储蓄被投资到了股票中"],
          [
            ["They have bought shares through an app by mistake", "他们误用应用买了股票"],
            ["They work for a large corporation", "他们在大公司工作"],
          ],
          [
            '"If you have a pension or a savings account, part of your money has probably been invested in the shares of companies."',
            "如果你有养老金或储蓄账户，你的部分钱很可能被投资到了公司股票中。",
          ],
        ],
        [
          ["What problem can the separation of owners and managers cause?", "所有者和管理者分离会造成什么问题？"],
          ["Managers may act in their own interests, not the owners'", "管理者可能为自己而不是为所有者的利益行事"],
          [
            ["Shareholders may refuse to receive dividends", "股东可能拒绝领取股息"],
            ["The board may sell all the shares to the public", "董事会可能把所有股份卖给公众"],
          ],
          [
            '"Managers may follow their own interests, such as large salaries, instead of the interests of the owners."',
            "管理者可能追随自己的利益，比如高薪，而不是所有者的利益。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-economy-the-cost-of-a-cup-of-coffee",
      title: ["The Cost of a Cup of Coffee", "一杯咖啡的成本"],
      body: `In a coffee shop in a big European city, a cup of coffee might cost you four euros. Have you ever wondered where that money goes? The answer tells us a great deal about how the world economy works.

The journey begins on a farm, perhaps on a hill in Ethiopia, Colombia or Vietnam. About 25 million families around the world grow coffee, and most of them work on small farms of a few hectares. The coffee is picked by hand, dried and sold to a local business. For the coffee in your cup, the farmer usually receives between two and five cents.

The beans then pass through many hands. Export companies ship them across the ocean. Roasters, often large multinational corporations, roast and pack them, and wholesale suppliers distribute them to coffee shops. Each stage adds to the price, but the stage that adds the most is the last one. Of the four euros you pay, the coffee shop needs most of it for rent, wages, milk, cups, electricity and taxes. Its profit is often only a few cents for each cup, which is why so many coffee shops close within their first few years.

So the farmer receives about one percent of the price, while the costs in the rich country are far higher. This is not only because of greed. It reflects the simple fact that rent and wages in a European city are many times higher than in rural Ethiopia. Nevertheless, it means that many coffee farmers live in poverty, and when the price of coffee falls on world markets, they may not even earn enough to pay their costs.

Many efforts have been made to change this. "Fair trade" schemes guarantee farmers a minimum price and pay an extra amount for community projects such as schools. Some roasters buy straight from farmers and pay well above the market price. Other farmers have started cooperatives to prepare and sell their coffee themselves, which allows them to keep more of its value.

Some people argue that these schemes help only a small number of farmers and that the extra money is modest. Those who support them reply that they have shown that fairer trade is possible. Either way, the next time you have your coffee made by a barista, it might be worth thinking about the person who grew it.`,
      grammar: [causative],
      names: ["European", "Ethiopia", "Colombia", "Vietnam"],
      glossed: ["euros", "hectares", "roasters", "roast", "greed", "schemes", "cooperatives", "barista"],
      questions: [
        [
          ["How much of a four-euro coffee does the farmer usually receive?", "一杯四欧元的咖啡，农民通常得到多少？"],
          ["Between two and five cents", "两到五欧分"],
          [
            ["About one euro", "大约一欧元"],
            ["About half of the price", "大约一半的价格"],
          ],
          [
            '"For the coffee in your cup, the farmer usually receives between two and five cents."',
            "你杯中的咖啡，农民通常只得到两到五欧分。",
          ],
        ],
        [
          ["Where does most of the four euros go?", "四欧元中的大部分去了哪里？"],
          ["To the coffee shop's costs, such as rent, wages and taxes", "用于咖啡馆的成本，比如租金、工资和税"],
          [
            ["To the coffee shop's owner as profit", "作为利润给了咖啡馆老板"],
            ["To the exporters who ship the beans", "给了运送咖啡豆的出口商"],
          ],
          [
            'The coffee shop needs most of it "for rent, wages, milk, cups, electricity and taxes", and its profit is often only a few cents.',
            "咖啡馆把大部分钱用于租金、工资、牛奶、杯子、电费和税，利润往往只有几分钱。",
          ],
        ],
        [
          ['What do "fair trade" schemes do?', "“公平贸易”计划做什么？"],
          ["Guarantee farmers a minimum price and fund community projects", "保证农民的最低价格，并资助社区项目"],
          [
            ["Close coffee shops that charge too much", "关闭收费过高的咖啡馆"],
            ["Buy farms from small farmers", "从小农手中买下农场"],
          ],
          [
            'They "guarantee farmers a minimum price and pay an extra amount for community projects such as schools."',
            "它们保证农民的最低价格，并为学校等社区项目额外付钱。",
          ],
        ],
      ],
    }),
  ],
};
