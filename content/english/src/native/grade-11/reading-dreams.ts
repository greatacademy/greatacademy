// Grade 11: the reading unit of the fourth theme, the American dream, from the historian who named it and the
// stories of rags to riches to free land, a steelmaker's gospel, the suburbs, the data on mobility, a mountain of
// gold and the lottery.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grade-5/reading-kit.ts";

const wealth = { topic: "words-of-wealth-and-class", weight: 0.3 } as const;
const hope = { topic: "words-of-hope-and-disillusion", weight: 0.3 } as const;
const assumptions = { topic: "unstated-assumptions", weight: 0.2 } as const;
const academic6 = { topic: "academic-words-6", weight: 0.1 } as const;
const academic7 = { topic: "academic-words-7", weight: 0.1 } as const;
const academic1 = { topic: "academic-words-1", weight: 0.1 } as const;
const academic2 = { topic: "academic-words-2", weight: 0.1 } as const;
const academic3 = { topic: "academic-words-3", weight: 0.1 } as const;

/** dreamsAndPromises is a reading unit of grade 11 on the American dream, wealth and class, and hope and disillusion. */
export const dreamsAndPromises: ReadingUnitDef = {
  id: "dreams-and-promises",
  title: t("Dreams and Promises", "梦想与承诺"),
  passages: [
    passage(
      "the-historian-who-named-a-dream",
      t("The Historian Who Named a Dream", "为梦想命名的历史学家"),
      `In 1931, in the middle of the worst economic depression the United States had ever known, a historian named James Truslow Adams published a book called The Epic of America. Banks had failed, factories had closed and millions of people were out of work. It was a strange moment to write about hope. Yet the book gave the country a phrase it has used ever since: the American dream.

Adams was careful to say what he meant. The dream, he wrote, was not simply a dream of motor cars and high wages. It was the hope of a land in which life should be better, richer and fuller for everyone, with opportunity for each according to ability or achievement. He imagined a society in which people would be recognized for what they were, not for the circumstances of their birth. In other words, the dream was about dignity and fairness as much as about money.

Adams had a reason to make this distinction. In the 1920s, before the crash, many Americans had become affluent quickly, and the decade had been famous for ostentatious spending. Adams worried that the country had come to measure success only in dollars. A dream reduced to wealth, he suggested, would leave people disillusioned the moment the wealth disappeared, which is exactly what had happened in 1929.

It is striking how quickly the phrase changed after Adams introduced it. Within a generation, advertisers used it to sell houses, cars and refrigerators. The American dream came to mean, for many people, a particular kind of comfort: a house in the suburbs, two children and a steady job. That picture was not wrong, but it was narrower than what Adams had described.

Today, the phrase is used by politicians of every party, often to mean opposite things. Some say the dream is alive because anyone can still rise through hard work. Others say it is fading because rising has become harder. Both sides assume that the dream is about moving up. Adams might have reminded them that he also meant something harder to measure: a country in which every person is treated as a person of worth.

His book did not end the Depression. But it named an aspiration that has outlasted every crisis since, and it still invites the question he asked: better and fuller for whom?`,
      [hope, wealth, academic6],
      [
        ask(
          t("Why is it surprising that Adams wrote about the dream in 1931?", "为什么亚当斯在 1931 年写到这个梦想令人意外？"),
          t("Because the country was in a deep depression with millions out of work", "因为当时国家正处于严重的萧条之中，数百万人失业"),
          [
            t("Because the phrase had already been used for a hundred years", "因为这个说法已经被使用了一百年"),
            t("Because he had never written a book about history before", "因为他以前从未写过历史书"),
            t("Because most Americans were becoming rich at that time", "因为当时大多数美国人正在变富"),
          ],
          t(
            "The first paragraph says banks had failed and millions were out of work, so it was a strange moment to write about hope.",
            "第一段说银行倒闭、数百万人失业，所以那是一个写希望的奇怪时刻。",
          ),
        ),
        ask(
          t("According to Adams, what was the dream mainly about?", "在亚当斯看来，这个梦想主要关乎什么？"),
          t("A fuller life for everyone, with dignity and opportunity by ability", "每个人都能过上更充实的生活，有尊严，并按能力获得机会"),
          [
            t("Owning a motor car and earning high wages", "拥有汽车并赚取高工资"),
            t("Moving to the suburbs and buying a large house", "搬到郊区并买一座大房子"),
            t("Becoming as wealthy as the bankers of the 1920s", "变得像二十年代的银行家一样富有"),
          ],
          t(
            "The second paragraph says the dream was not simply about cars and wages but about a better life for everyone and recognition for who people are.",
            "第二段说这个梦想不只是关于汽车和工资，而是关于人人都有更好的生活，人们因其本身而受到认可。",
          ),
        ),
        ask(
          t(
            "What assumption do both sides of today's debate share, according to the passage?",
            "根据文章，当今争论的双方有什么共同的假设？",
          ),
          t("That the dream is mainly about moving up", "梦想主要关乎向上流动"),
          [
            t("That hard work no longer matters at all", "努力工作已经完全不重要了"),
            t("That the Depression is likely to return soon", "大萧条可能很快会重演"),
            t("That Adams was wrong about the meaning of the dream", "亚当斯对梦想含义的理解是错的"),
          ],
          t(
            "The fifth paragraph says that both sides assume the dream is about moving up, while Adams also meant treating every person as a person of worth.",
            "第五段说双方都假定梦想关乎向上流动，而亚当斯还指把每个人都当作有价值的人来对待。",
          ),
        ),
      ],
      ["James", "Truslow", "Adams", "American", "Americans", "Epic", "America"],
    ),
    passage(
      "rags-to-riches",
      t("Rags to Riches", "白手起家"),
      `Between 1868 and his death in 1899, a writer named Horatio Alger published more than a hundred novels for boys. Nearly all of them told the same story. A poor boy, often an orphan, shines shoes or sells newspapers on the streets of New York. He is honest, cheerful and hardworking. One day he performs a brave or kind act, such as saving a rich man's child from drowning, and the grateful man gives him a job. By the end of the book, the boy has risen from destitute to respectable.

The most famous of these books, Ragged Dick, sold widely and made Alger's name a shorthand for a particular idea. To this day, an "Alger story" means a story of rising from rags to riches through effort and good character. The books gave hope to many young readers who were poor themselves.

Yet a careful reading of the novels reveals something surprising. Alger's heroes rarely become rich. They usually reach a comfortable middle-class position, as a clerk in an office, for example. And their rise almost always depends on luck: the drowning child, the generous stranger, the lucky meeting. Hard work makes them worthy of good fortune, but good fortune does the lifting.

This matters because the Alger myth, as it came to be told, removed the luck. In speeches and newspaper editorials, the lesson became simple: anyone who works hard enough will succeed. The poor, by this logic, must have failed to work hard. The assumption behind that conclusion is rarely stated, and it is questionable. It supposes that effort is the main thing that separates the poor from the affluent, and that circumstances such as health, family and the economy count for little.

Critics have pointed out that the stories were written at a time of enormous inequality. Many boys who sold newspapers on the streets worked fourteen hours a day and never rose at all. For them, the cheerful message of the novels could feel like a quiet accusation.

None of this means that effort does not matter. Many people have improved their lives through determination. But Alger's own books, read closely, tell a more honest story than the myth they inspired. They suggest that hard work and kindness are necessary, and that a society which leaves everything else to luck is asking a great deal of its poorest children.`,
      [wealth, hope, assumptions, academic7],
      [
        ask(
          t("What usually causes the rise of Alger's heroes?", "阿尔杰笔下的主人公通常是因为什么而发迹的？"),
          t(
            "Luck, such as meeting a grateful rich man, after showing good character",
            "在表现出良好品格之后遇到的好运，比如遇到一位心存感激的富人",
          ),
          [
            t("Years of saving money until they can open a business", "多年攒钱，直到能开一家店"),
            t("An education at a famous university in New York", "在纽约一所名牌大学接受的教育"),
            t("Inheriting a fortune from a lost relative", "从一位失散的亲戚那里继承一笔财产"),
          ],
          t(
            "The third paragraph says their rise almost always depends on luck, such as the drowning child or the generous stranger.",
            "第三段说他们的发迹几乎总是靠运气，比如落水的孩子或慷慨的陌生人。",
          ),
        ),
        ask(
          t("What unstated assumption does the passage find in the later Alger myth?", "文章在后来的阿尔杰神话中发现了什么未言明的假设？"),
          t("That effort is the main thing that separates the poor from the rich", "努力是区分穷人和富人的主要因素"),
          [
            t("That newspapers were the best way to earn money", "卖报纸是最好的赚钱方式"),
            t("That most rich people were once orphans", "大多数富人曾经是孤儿"),
            t("That luck matters more than character", "运气比品格更重要"),
          ],
          t(
            "The fourth paragraph says the myth supposes that effort is what separates the poor from the affluent, and that circumstances count for little.",
            "第四段说这个神话假定努力是区分穷人和富人的因素，而环境几乎不起作用。",
          ),
        ),
        ask(
          t(
            "How could the novels feel to boys who worked long hours and never rose?",
            "对那些长时间工作却从未发迹的男孩来说，这些小说可能给人什么感觉？",
          ),
          t("Like a quiet accusation that they had not worked hard enough", "像一种无声的指责，好像他们不够努力"),
          [
            t("Like a promise that they would certainly become rich", "像一个他们一定会变富的承诺"),
            t("Like a funny story with no connection to their lives", "像一个与他们生活毫无关系的有趣故事"),
            t("Like a set of rules for selling more newspapers", "像一套卖更多报纸的规则"),
          ],
          t(
            "The fifth paragraph says that for those boys, the cheerful message could feel like a quiet accusation.",
            "第五段说对那些男孩来说，这种乐观的信息可能像一种无声的指责。",
          ),
        ),
      ],
      ["Horatio", "Alger", "Ragged", "Dick", "Dick's", "American", "Americans", "New", "York"],
    ),
    passage(
      "land-for-the-asking",
      t("Land for the Asking", "申请就能得到的土地"),
      `In 1862, in the middle of the Civil War, President Abraham Lincoln signed a law that offered something extraordinary: free land. Under the Homestead Act, any adult citizen, or anyone who intended to become one, could claim 160 acres of public land in the West. To keep it, the settler had to live on it for five years, build a home and farm it. At the end, the land was theirs, for a small filing fee.

The offer drew people from across the country and from Europe. Over the next seventy years, about 1.6 million claims were granted, covering an area larger than many nations. For families who had worked other people's land for generations, owning a farm meant independence. Women who were heads of households could claim land too, and so could formerly enslaved Black Americans after the war. For them, the promise of the law was a promise of a stake in the country.

The reality was harder than the promise. Much of the land, especially on the dry Great Plains, was not suited to small farms. A plot of 160 acres might support a family in a wet climate, but on the plains it was often too little. Drought, grasshoppers and bitter winters drove many settlers away before their five years were up. Some historians estimate that fewer than half of those who filed claims ever received their land. Many who stayed lived for years in houses built of sod, cut in blocks from the prairie itself.

There was also a deeper problem. The land was called public, but it was not empty. It was the home of Native nations such as the Lakota and the Pawnee, who had lived there for centuries. The Homestead Act assumed that land not farmed in the European way was unused and available. As settlers arrived, Native peoples were pushed onto reservations, often through broken treaties and war.

The Homestead Act is sometimes held up as the purest example of the American dream: hard work rewarded with ownership. It did give hope and property to many families who would otherwise have had neither. But its story also shows that one group's opportunity can rest on another's loss. A fair account of the dream must hold both of these truths together, the sod house built with hope and the people who were forced to leave before it was built.`,
      [hope, wealth, assumptions, academic6, academic1],
      [
        ask(
          t("What did a settler have to do to keep land under the Homestead Act?", "根据《宅地法》，定居者必须做什么才能保住土地？"),
          t("Live on it for five years, build a home and farm it", "在土地上住满五年，建造住房并耕种"),
          [
            t("Pay the government a large sum of money each year", "每年向政府支付一大笔钱"),
            t("Fight in the Civil War for at least two years", "在内战中服役至少两年"),
            t("Sell half of the land back to the railway", "把一半土地卖回给铁路公司"),
          ],
          t(
            "The first paragraph says the settler had to live on the land for five years, build a home and farm it.",
            "第一段说定居者必须在土地上住满五年、建造住房并耕种。",
          ),
        ),
        ask(
          t("Why did many settlers on the Great Plains fail?", "为什么许多大平原上的定居者失败了？"),
          t("The dry land and harsh weather made small farms hard to sustain", "干旱的土地和恶劣的天气使小农场难以维持"),
          [
            t("The government took the land back after two years", "政府在两年后收回了土地"),
            t("Most of them did not want to farm at all", "他们大多数根本不想务农"),
            t("The land was too wet for any kind of crop", "土地太湿，种不了任何庄稼"),
          ],
          t(
            "The third paragraph says the dry plains were not suited to small farms, and drought, grasshoppers and winters drove many away.",
            "第三段说干旱的平原不适合小农场，干旱、蝗虫和寒冬赶走了许多人。",
          ),
        ),
        ask(
          t("What assumption did the Homestead Act make about the land?", "《宅地法》对土地做了什么假设？"),
          t("That land not farmed in the European way was unused and free to take", "没有按欧洲方式耕种的土地就是闲置的，可以随意占用"),
          [
            t("That the land would be too dry for anyone to live on", "土地太干旱，任何人都无法居住"),
            t("That Native nations would be paid fairly for it", "原住民部族会因此得到公平的补偿"),
            t("That only women should be allowed to claim it", "只有女性可以申请土地"),
          ],
          t(
            "The fourth paragraph says the law assumed that land not farmed in the European way was unused and available, though Native nations lived there.",
            "第四段说该法假定没有按欧洲方式耕种的土地是闲置可用的，尽管原住民部族住在那里。",
          ),
        ),
      ],
      [
        "Homestead",
        "Act",
        "Abraham",
        "Lincoln",
        "Great",
        "Plains",
        "American",
        "Americans",
        "Native",
        "Black",
        "Europe",
        "Lakota",
        "Pawnee",
      ],
    ),
    passage(
      "the-gospel-of-wealth",
      t("The Gospel of Wealth", "财富的福音"),
      `Andrew Carnegie arrived in the United States from Scotland in 1848 as a poor boy of twelve. His first job, in a cotton mill, paid little more than a dollar a week. By the end of the century, he controlled the largest steel company in the world and was one of the richest men who had ever lived. His life seemed to prove that anyone could rise from poverty to fortune.

In 1889, Carnegie published an essay that became known as "The Gospel of Wealth." In it, he argued that great inequality was a natural result of progress. Industry made goods cheap and plentiful, he said, and it was inevitable that a few people would gather enormous fortunes as a result. But he added a striking claim: a rich man had a duty to give his fortune away while he was alive. "The man who dies rich," he wrote, "dies disgraced."

Carnegie did not believe in simply handing out money to the poor, which he thought would encourage idleness. Instead, he wanted to fund institutions that would help people improve themselves. He gave money for concert halls, universities and above all libraries. Between 1883 and 1929, his gifts built more than 2,500 public libraries, many of them in small towns that had never had one. A child of a poor family could walk into a Carnegie library and borrow any book for free.

Carnegie's critics, then and now, have pointed to the other side of his story. His wealth came from mills where men worked twelve-hour days in terrible heat, often seven days a week. In 1892, during a strike at his Homestead steel works near Pittsburgh, a battle between workers and armed guards left several people dead. Carnegie was in Scotland at the time, but his company crushed the union. Some workers said they would rather have had higher wages than libraries.

The debate over Carnegie raises a question that is still with us. Is it better for the rich to give generously, choosing which causes to support, or for a society to share wealth more fairly in the first place, through wages and taxes? Carnegie believed that the wealthy, as the most capable, were best placed to decide. His critics believed that this left too much power in too few hands.

The libraries still stand in many towns. So do the questions about how their builder made the money to pay for them.`,
      [wealth, hope, academic7, academic2],
      [
        ask(
          t("What duty did Carnegie say the rich have?", "卡内基说富人有什么责任？"),
          t("To give their fortunes away during their lifetimes", "在有生之年把财富捐出去"),
          [
            t("To pay higher wages than any other employer", "支付比其他任何雇主都高的工资"),
            t("To leave all their money to their children", "把所有的钱都留给子女"),
            t("To avoid building any more large factories", "避免再建大型工厂"),
          ],
          t(
            "The second paragraph quotes Carnegie's claim that the man who dies rich dies disgraced, so the rich must give their wealth away while alive.",
            "第二段引用了卡内基的话“死时富有的人死得不光彩”，所以富人必须在生前捐出财富。",
          ),
        ),
        ask(
          t(
            "Why did Carnegie prefer to fund libraries rather than give money directly to the poor?",
            "为什么卡内基更愿意资助图书馆，而不是直接把钱给穷人？",
          ),
          t(
            "He thought handing out money encouraged idleness, while libraries helped people improve themselves",
            "他认为直接发钱会助长懒惰，而图书馆能帮助人们自我提升",
          ),
          [
            t("He thought the poor did not deserve any help at all", "他认为穷人根本不值得任何帮助"),
            t("He wanted every library to carry his own books", "他想让每座图书馆都收藏他自己写的书"),
            t("He had been told to do so by the government", "是政府让他这么做的"),
          ],
          t(
            "The third paragraph says Carnegie thought direct gifts encouraged idleness and wanted institutions that would help people improve themselves.",
            "第三段说卡内基认为直接捐钱会助长懒惰，想要资助能帮助人们自我提升的机构。",
          ),
        ),
        ask(
          t("What do the two sides of the debate disagree about?", "争论的双方在什么问题上有分歧？"),
          t(
            "Whether the rich should choose how to give, or society should share wealth through wages and taxes",
            "是由富人选择如何捐赠，还是社会通过工资和税收来分配财富",
          ),
          [
            t("Whether libraries are useful to children", "图书馆对孩子是否有用"),
            t("Whether Carnegie was born in Scotland", "卡内基是否出生在苏格兰"),
            t("Whether steel is an important industry", "钢铁是否是一个重要的产业"),
          ],
          t(
            "The fifth paragraph asks whether it is better for the rich to give generously or for a society to share wealth more fairly through wages and taxes.",
            "第五段提出的问题是：是富人慷慨捐赠好，还是社会通过工资和税收更公平地分配财富好。",
          ),
        ),
      ],
      ["Andrew", "Carnegie", "Carnegie's", "Scotland", "Pittsburgh", "Homestead", "American", "Americans"],
    ),
    passage(
      "a-house-of-ones-own",
      t("A House of One's Own", "属于自己的房子"),
      `After the Second World War, millions of American soldiers came home, married and started families. There was nowhere for them to live. Cities were crowded, and many young couples moved in with their parents. A builder named William Levitt saw an opportunity. On potato fields on Long Island, near New York, he began building houses the way factories built cars.

Levitt's workers did not build one house at a time. Instead, they moved down the street in teams, each doing one task: one team poured the foundations, another put up the walls, another painted, another installed the kitchen. At the peak, the company finished thirty houses a day. The houses were small and nearly identical, but they were cheap, and they came with a refrigerator and a washing machine. With low-interest loans guaranteed by the government, a returning soldier could buy one for less than he would pay in rent.

The town that grew from the fields was called Levittown, and it became a symbol of a new version of the American dream: a house in the suburbs, a lawn and a car in the driveway. Similar developments spread across the country. Home ownership, once a privilege of the affluent, became a normal part of middle-class life. For families who had lived through the Depression and the war, it felt like arriving.

But not everyone was allowed to arrive. The contracts for Levittown houses stated that they could not be sold or rented to anyone who was not white. Levitt said he was only following the market. The government agencies that guaranteed the loans also refused to support mortgages in many Black neighborhoods, a practice later called redlining. As a result, Black veterans who had fought in the same war were largely shut out of the greatest expansion of home ownership in the country's history.

The effects lasted for generations. A house is not only a place to live; it is the main way most families build wealth. Families who bought a Levittown house in 1950 for about 8,000 dollars could pass on a valuable property to their children. Families who were excluded had nothing to pass on. Researchers today trace part of the large gap in wealth between white and Black Americans back to these years.

Levittown still stands, and many of its houses have been enlarged and changed beyond recognition. Its history is a reminder that a dream can be built quickly, and that who is allowed inside it matters as much as how it is built.`,
      [wealth, hope, assumptions, academic6, academic2],
      [
        ask(
          t("How did Levitt build houses so quickly?", "莱维特是怎样如此快速地建造房屋的？"),
          t("Teams moved down the street, each doing one task, like a factory line", "工作队沿街推进，每队只做一项工作，就像工厂的流水线"),
          [
            t("He bought houses that had already been built in the city", "他买下了城里已经建好的房子"),
            t("He let each family build its own house in its own way", "他让每户人家按自己的方式建自己的房子"),
            t("He used soldiers from the army as free workers", "他把军队的士兵当作免费劳动力"),
          ],
          t(
            "The second paragraph says teams moved down the street, each doing one task, and finished thirty houses a day.",
            "第二段说工作队沿街推进，每队做一项工作，每天能建成三十座房子。",
          ),
        ),
        ask(
          t("Who was shut out of buying houses in Levittown?", "谁被排除在莱维敦购房之外？"),
          t("Anyone who was not white, including Black veterans", "任何非白人，包括黑人退伍军人"),
          [
            t("Anyone who had not served in the army", "任何没有服过兵役的人"),
            t("Families with more than two children", "有两个以上孩子的家庭"),
            t("People who already owned a car", "已经拥有汽车的人"),
          ],
          t(
            "The fourth paragraph says the contracts forbade sale or rent to anyone not white, and Black veterans were largely shut out.",
            "第四段说合同禁止把房子卖给或租给非白人，黑人退伍军人在很大程度上被排除在外。",
          ),
        ),
        ask(
          t(
            "Why did exclusion from home ownership have effects that lasted for generations?",
            "为什么被排除在购房之外的影响延续了好几代？",
          ),
          t("Because a house is the main way most families build wealth to pass on", "因为房子是大多数家庭积累并传承财富的主要方式"),
          [
            t("Because the houses in Levittown fell down after a few years", "因为莱维敦的房子几年后就倒塌了"),
            t("Because rents in the cities became free after the war", "因为战后城市的房租变得免费了"),
            t("Because the excluded families moved to other countries", "因为被排除的家庭搬到了其他国家"),
          ],
          t(
            "The fifth paragraph says a house is the main way most families build wealth, so excluded families had nothing to pass on.",
            "第五段说房子是大多数家庭积累财富的主要方式，被排除的家庭就没有什么可以传给下一代。",
          ),
        ),
      ],
      ["Levittown", "Levitt", "William", "New", "York", "Long", "Island", "American", "Americans", "Black"],
    ),
    passage(
      "the-ladder-in-the-data",
      t("The Ladder in the Data", "数据中的阶梯"),
      `How likely is a child born poor to grow up and earn more than their parents? For most of history, the answer was a matter of belief. People who believed in the American dream said the chances were good; people who doubted it said they were poor. In the last fifteen years, economists have been able to answer the question with evidence.

A team led by the economist Raj Chetty used tax records, with names removed, for tens of millions of Americans. By linking the incomes of parents to the later incomes of their children, they could measure social mobility, the movement of people up or down the ladder of income, more precisely than ever before.

Their first finding was sobering. Of children born in 1940, about 90 percent grew up to earn more than their parents, after accounting for rising prices. Of children born in 1980, only about half did. The chance of doing better than one's parents, the most basic promise of the dream, had fallen from almost certain to a coin toss. Part of the reason was slower economic growth, but most of it was that the gains of growth had gone mainly to those at the top.

The second finding was about place. Mobility varied enormously from one city to another. A poor child growing up in Salt Lake City had a much better chance of reaching the top fifth of earners than a poor child in Charlotte. The researchers found that areas with more mobility tended to have less segregation, better schools, more two-parent families and stronger community groups.

The team also compared the United States with other wealthy countries. Despite the belief that America is a land of exceptional opportunity, a child born in the bottom fifth of incomes in Denmark or Canada had a better chance of rising to the top fifth than an American child did.

These findings do not mean that the dream is dead. They mean that it depends on conditions that can be measured and changed. Chetty's team has since worked with cities to test programs, such as helping families with young children move to neighborhoods with more opportunity. Early results suggest that such moves can raise children's later incomes significantly.

The data, in other words, turn an argument about faith into a question of design. The ladder exists, but its rungs are closer together in some places than others, and people can choose where to build them.`,
      [wealth, hope, assumptions, academic7, academic1, academic3],
      [
        ask(
          t(
            "What happened to the chance of earning more than one's parents between 1940 and 1980?",
            "在 1940 年到 1980 年间，收入超过父母的机会发生了什么变化？",
          ),
          t("It fell from about 90 percent to about half", "从大约百分之九十下降到大约一半"),
          [
            t("It rose from about half to about 90 percent", "从大约一半上升到大约百分之九十"),
            t("It stayed about the same for both groups", "两组人大致相同"),
            t("It fell to almost zero for everyone", "对所有人来说都下降到几乎为零"),
          ],
          t(
            "The third paragraph says about 90 percent of children born in 1940 out-earned their parents, but only about half of those born in 1980 did.",
            "第三段说 1940 年出生的孩子约百分之九十收入超过父母，而 1980 年出生的只有约一半。",
          ),
        ),
        ask(
          t("What did areas with more mobility tend to have?", "流动性较高的地区往往有什么特点？"),
          t("Less segregation, better schools and stronger community groups", "隔离较少、学校较好、社区团体较强"),
          [
            t("More expensive houses and fewer schools", "房子更贵，学校更少"),
            t("Higher taxes and larger factories", "税收更高，工厂更大"),
            t("More people moving away to other countries", "更多的人搬到其他国家"),
          ],
          t(
            "The fourth paragraph lists less segregation, better schools, more two-parent families and stronger community groups.",
            "第四段列出了隔离较少、学校较好、双亲家庭较多以及社区团体较强。",
          ),
        ),
        ask(
          t("What belief do the comparisons with Denmark and Canada challenge?", "与丹麦和加拿大的比较挑战了什么信念？"),
          t("That America offers exceptional opportunity to rise", "美国提供了格外多的向上流动机会"),
          [
            t("That Denmark is a wealthy country", "丹麦是一个富裕的国家"),
            t("That tax records can be used for research", "税务记录可以用于研究"),
            t("That incomes rise over time in most countries", "大多数国家的收入会随时间增长"),
          ],
          t(
            "The fifth paragraph says that despite the belief in exceptional American opportunity, poor children in Denmark or Canada had a better chance of rising.",
            "第五段说尽管人们相信美国机会格外多，丹麦或加拿大的穷孩子向上流动的机会却更大。",
          ),
        ),
      ],
      [
        "Raj",
        "Chetty",
        "Chetty's",
        "American",
        "Americans",
        "Harvard",
        "Denmark",
        "Canada",
        "Salt",
        "Lake",
        "City",
        "Charlotte",
        "Opportunity",
        "Insights",
      ],
    ),
    passage(
      "the-mountain-of-gold",
      t("The Mountain of Gold", "金山"),
      `In 1848, gold was discovered in California. Within a few years, news of it had crossed the Pacific Ocean to the villages of Guangdong province in southern China, where floods, war and poverty had made life desperately hard. In Cantonese, people began to call California by a new name: Gam Saan, the Gold Mountain.

Thousands of young men borrowed money for the long voyage. Most planned to stay only a few years, find gold and return home rich, to buy land and support their families. The dream was not of becoming American but of making a family prosperous in China. Many sent nearly all their earnings home, and the money built houses and schools in their villages.

The reality was harsh. By the time most Chinese miners arrived, the easiest gold had been taken. California passed a tax on foreign miners that fell mainly on the Chinese, and many were driven off their claims by violence. Those who stayed turned to other work: they ran laundries and restaurants, farmed and fished. In the 1860s, about 12,000 Chinese workers built the western part of the first railroad across the continent, for the Central Pacific company. They blasted tunnels through the granite of the Sierra Nevada in winter, and hundreds died. They were paid less than white workers for the same labor.

Instead of welcome, they met hostility. Politicians blamed Chinese workers for low wages, and riots broke out in several towns. In 1882, Congress passed a law banning almost all new Chinese immigration, the first American law to exclude people by nationality. Many men who had come for a few years found that they could neither bring their wives over nor easily return. Some lived and died as bachelors far from home.

And yet the Chinese communities survived. San Francisco's Chinatown, rebuilt after the earthquake of 1906, became one of the largest Chinese communities outside Asia. The children and grandchildren of the Gold Mountain men became doctors, engineers and writers, and they helped to change the laws that had excluded their families.

The story of the Gold Mountain is a dream that turned out very differently from what its dreamers imagined. Few found gold. Many found hardship and rejection. But their persistence built railroads, towns and communities, and it shows that the American dream was shaped not only by those who were welcomed but also by those who were turned away and stayed anyway.`,
      [hope, wealth, assumptions, academic6],
      [
        ask(
          t("What did most early Chinese migrants hope to do?", "大多数早期中国移民希望做什么？"),
          t("Earn money in California and return home to support their families", "在加利福尼亚赚钱，然后回家养家"),
          [
            t("Become American citizens and never return to China", "成为美国公民，永不回中国"),
            t("Buy land in California and start large farms", "在加利福尼亚买地，开大农场"),
            t("Build the railroad across the continent for free", "免费修建横贯大陆的铁路"),
          ],
          t(
            "The second paragraph says most planned to stay a few years, find gold and return home rich to support their families.",
            "第二段说大多数人打算待几年，找到金子，然后富裕地回家养家。",
          ),
        ),
        ask(
          t("How were Chinese railroad workers treated compared with white workers?", "与白人工人相比，中国铁路工人受到怎样的对待？"),
          t("They did dangerous work and were paid less for the same labor", "他们做危险的工作，同样的劳动报酬却更少"),
          [
            t("They were paid more because their work was harder", "因为工作更辛苦，他们拿的报酬更多"),
            t("They were given land in exchange for their work", "他们因工作而分得土地"),
            t("They were allowed to choose easier jobs", "他们可以选择更轻松的工作"),
          ],
          t(
            "The third paragraph says they blasted tunnels in winter, hundreds died, and they were paid less than white workers for the same labor.",
            "第三段说他们在冬天爆破隧道，数百人死亡，同样的劳动报酬却比白人工人少。",
          ),
        ),
        ask(
          t("What does the last paragraph suggest about the American dream?", "最后一段对美国梦有什么暗示？"),
          t("It was shaped also by people who were turned away and stayed anyway", "它也是由那些被拒之门外却依然留下来的人塑造的"),
          [
            t("It was only open to those who found gold", "它只对那些找到金子的人开放"),
            t("It ended completely with the law of 1882", "它随着 1882 年的法律彻底终结了"),
            t("It was invented by the railroad companies", "它是铁路公司发明出来的"),
          ],
          t(
            "The last paragraph says the dream was shaped by those who were welcomed and by those who were turned away and stayed anyway.",
            "最后一段说这个梦想既是由被接纳的人塑造的，也是由被拒之门外却依然留下的人塑造的。",
          ),
        ),
      ],
      [
        "Gold",
        "Mountain",
        "California",
        "Guangdong",
        "Cantonese",
        "Chinese",
        "American",
        "Americans",
        "San",
        "Francisco",
        "Central",
        "Pacific",
        "Sierra",
        "Nevada",
        "Gam",
        "Saan",
      ],
    ),
    passage(
      "the-price-of-a-ticket",
      t("The Price of a Ticket", "一张彩票的代价"),
      `Every week, millions of people around the world buy lottery tickets. They know, if they think about it, that the chance of winning a large jackpot is tiny, often less than one in a hundred million. They are more likely to be struck by lightning on the way to the shop. Yet they buy the ticket anyway. Why?

Part of the answer is that a ticket does not really buy money. It buys a few days of hope. Between buying the ticket and the draw, a person can imagine paying off debts, leaving a hated job or helping their children. For someone whose life offers few other ways to change suddenly, that brief reverie may feel worth a few dollars.

Studies support this idea in an uncomfortable way. In many countries, poorer households spend a larger share of their income on lottery tickets than richer ones do. Economists call this kind of spending regressive, because it takes the most from those who have the least. Some critics call lotteries a tax on hope. Governments that run lotteries often use the money for schools or parks, which means that some public services are partly paid for by the poorest buyers.

What happens to those who do win? Researchers who have followed lottery winners find a mixed picture. Most winners are happier with their finances, as one would expect. Their overall satisfaction with life also rises somewhat, though less than many people imagine. A few stories of winners who lost everything within years are famous, but careful studies suggest such disasters are less common than the stories imply. The money changes the winners' circumstances, but it does not change who they are.

The deeper question concerns what lotteries say about how a society thinks of success. A lottery is a pure form of luck. If many people believe that a jackpot is their most realistic route to a better life, it may suggest that they have stopped believing that steady effort will get them there. In that sense, the popularity of lotteries can be read as a measure of disillusionment with other kinds of hope.

Of course, many people buy tickets simply for fun, the way others buy a cinema ticket, and spend no more than they can afford. Not every hope is a sign of despair. But it is worth asking why a dream that once promised a better life through work is so often pictured today as a set of lucky numbers.`,
      [hope, wealth, assumptions, academic7],
      [
        ask(
          t("According to the passage, what does a lottery ticket really buy?", "根据文章，一张彩票真正买到的是什么？"),
          t("A few days of hope and imagining a different life", "几天的希望和对另一种生活的想象"),
          [
            t("A good chance of winning a large sum of money", "赢得一大笔钱的很大机会"),
            t("A share in the schools that the government builds", "政府所建学校的一份股权"),
            t("Protection from being struck by lightning", "免受雷击的保护"),
          ],
          t(
            "The second paragraph says a ticket does not really buy money but a few days of hope, in which a person can imagine a better life.",
            "第二段说彩票真正买的不是钱，而是几天的希望，让人可以想象更好的生活。",
          ),
        ),
        ask(
          t("Why do economists call lottery spending regressive?", "为什么经济学家称买彩票的支出是累退的？"),
          t("Poorer households spend a larger share of their income on it", "较穷的家庭在这上面花的收入比例更高"),
          [
            t("The prizes get smaller every year", "奖金每年都在变少"),
            t("Only rich people are allowed to win", "只有富人才被允许中奖"),
            t("The tickets cost more in poor countries", "在穷国彩票价格更高"),
          ],
          t(
            "The third paragraph says poorer households spend a larger share of income on tickets, so the spending takes the most from those who have the least.",
            "第三段说较穷的家庭在彩票上花的收入比例更高，所以这种支出从最穷的人那里拿走的最多。",
          ),
        ),
        ask(
          t("What do careful studies suggest about lottery winners?", "严谨的研究对彩票中奖者有什么发现？"),
          t("Disasters are less common than famous stories imply", "灾难性的结局比那些著名故事所暗示的要少"),
          [
            t("Almost all of them lose their money within a year", "他们几乎都在一年内把钱花光"),
            t("Their happiness falls below what it was before", "他们的幸福感降到比以前还低"),
            t("They usually stop buying tickets forever", "他们通常从此再也不买彩票"),
          ],
          t(
            "The fourth paragraph says that careful studies suggest stories of winners who lost everything are less common than the stories imply.",
            "第四段说严谨的研究表明，中奖者失去一切的故事比人们想象的要少。",
          ),
        ),
      ],
      ["American", "Americans"],
    ),
  ],
};
