// Grade 8: the reading unit of the fifth theme, the industrial age, from the first cotton mills and the steam engine to
// coal, railways, crowded cities and the workers who fought for better lives.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grade-5/reading-kit.ts";

const factoryWords = { topic: "words-of-factories-and-mills", weight: 0.3 } as const;
const coalWords = { topic: "words-of-coal-and-railways", weight: 0.3 } as const;
const workerWords = { topic: "words-of-workers-and-cities", weight: 0.3 } as const;
const centralIdea = { topic: "tracking-a-central-idea", weight: 0.2 } as const;
const judgments = { topic: "facts-interpretations-and-judgments", weight: 0.2 } as const;
const academic1 = { topic: "academic-words-1", weight: 0.1 } as const;
const academic2 = { topic: "academic-words-2", weight: 0.1 } as const;
const academic3 = { topic: "academic-words-3", weight: 0.1 } as const;

/** smokeAndSteam is a reading unit of grade 8 on the Industrial Revolution and the lives it changed. */
export const smokeAndSteam: ReadingUnitDef = {
  id: "smoke-and-steam",
  title: t("Smoke and Steam", "烟与蒸汽"),
  passages: [
    passage(
      "from-cottage-to-factory",
      t("From Cottage to Factory", "从农舍到工厂"),
      `Three hundred years ago, most cloth in Britain was made at home. A family in a country cottage might spin wool or cotton into thread on a spinning wheel and then weave the thread into cloth on a hand loom. A merchant brought them the raw material and came back later to collect the finished cloth. The work was slow, but families could set their own hours and work beside their children.

In the 1760s and 1770s, a series of inventions changed this way of life. James Hargreaves built the spinning jenny, which let one worker spin eight threads at once. Richard Arkwright designed a spinning machine so large that it had to be driven by a water wheel. Machines like these were too big and too expensive for a cottage, so they were placed in large buildings beside fast rivers. These buildings were the first factories.

In 1771, Arkwright opened a cotton mill at Cromford, in the north of England. It ran day and night in two shifts of twelve hours, and he built rows of houses nearby for the families who came to work there. Workers no longer chose their own hours. A bell rang to start the day, and those who arrived late lost part of their wages.

When James Watt improved the steam engine in the 1770s and 1780s, factories no longer needed to stand beside rivers. They could be built anywhere there was coal to burn, and they spread rapidly into the towns. By 1850, Britain produced more cotton cloth than the rest of the world combined, and millions of people had moved from cottages to factory towns.`,
      [factoryWords, coalWords, centralIdea],
      [
        ask(
          t("What is the central idea of the passage?", "这篇文章的中心思想是什么？"),
          t(
            "New machines moved cloth-making from homes into factories and changed how people worked",
            "新机器把织布从家庭转移到工厂，改变了人们的工作方式",
          ),
          [
            t("Arkwright was the richest man in England", "阿克莱特是英格兰最富有的人"),
            t("Spinning wheels were better than spinning machines", "纺车比纺纱机更好"),
            t("Britain stopped making wool in the 1770s", "英国在18世纪70年代停止了生产羊毛"),
          ],
          t(
            "Each paragraph traces one step in the same change: from cloth made in cottages, to machines in mills, to factories spreading into towns.",
            "每一段都追溯同一变化中的一步：从农舍里织布，到工厂里的机器，再到工厂扩散到城镇。",
          ),
        ),
        ask(
          t("Why were the first factories built beside fast rivers?", "为什么最早的工厂建在湍急的河流旁边？"),
          t("Their machines were driven by water wheels", "它们的机器是由水车驱动的"),
          [
            t("The workers needed water for washing cloth", "工人需要用水洗布"),
            t("Merchants traveled by boat to collect the cloth", "商人乘船来收取布匹"),
            t("Coal could only be found near rivers", "只有在河边才能找到煤"),
          ],
          t(
            "The passage says Arkwright's machine was so large that it had to be driven by a water wheel, so the buildings were placed beside fast rivers.",
            "文章说阿克莱特的机器太大，必须用水车驱动，所以厂房建在湍急的河流旁边。",
          ),
        ),
        ask(
          t("How did the steam engine change where factories could be built?", "蒸汽机如何改变了工厂的选址？"),
          t("They could be built anywhere there was coal to burn", "只要有煤可烧，哪里都可以建工厂"),
          [
            t("They had to be built in the countryside", "它们必须建在乡下"),
            t("They could be built only in London", "它们只能建在伦敦"),
            t("They had to be built next to cottages", "它们必须建在农舍旁边"),
          ],
          t(
            "The last paragraph says that after Watt improved the steam engine, factories could be built anywhere there was coal to burn.",
            "最后一段说瓦特改进蒸汽机后，只要有煤可烧，哪里都可以建工厂。",
          ),
        ),
      ],
      ["Britain", "James", "Hargreaves", "Richard", "Arkwright", "Cromford", "England", "Watt"],
    ),
    passage(
      "children-of-the-mills",
      t("Children of the Mills", "工厂里的孩子们"),
      `In the early cotton mills, many of the workers were children. Mill owners hired them because they could be paid far less than adults and because small hands could reach into the machines to tie broken threads or clear away cotton waste. Some children started work at the age of six or seven.

Their days were long and hard. In many mills, children worked twelve to fourteen hours a day, six days a week, with short breaks for meals. The air was hot and damp, to keep the threads from breaking, and it was full of cotton dust that filled their lungs. The machines had no guards, and a moment of tiredness could cost a child a finger or a hand. Overseers sometimes beat children who fell asleep or worked too slowly.

In 1832, a committee of Parliament heard evidence from mill workers. A man named Samuel Coulson described how his young daughters went to the mill at three in the morning during busy times and returned at ten or eleven at night. He said that he and his wife often had to carry them to bed asleep.

Not everyone agreed that mill work was harmful. Some owners argued that work kept children out of trouble and that poor families needed their wages to survive. Others, like the mill owner Robert Owen, disagreed. At his mill in New Lanark, in Scotland, he refused to hire children under ten and built a school for them instead.

In 1833, Parliament passed a Factory Act that banned children under nine from working in textile mills and limited the hours of older children. It was a start, but there were only four inspectors to enforce it.`,
      [factoryWords, judgments, academic1],
      [
        ask(
          t("Why did mill owners hire children?", "为什么工厂主雇用儿童？"),
          t("They were paid far less, and their small hands could reach into the machines", "他们的工钱少得多，而且小手能伸进机器里"),
          [
            t("Children were stronger than adult workers", "儿童比成年工人更强壮"),
            t("The law required every mill to hire children", "法律要求每家工厂都要雇用儿童"),
            t("Children could read the instructions better", "儿童更能读懂说明书"),
          ],
          t(
            "The first paragraph gives both reasons: children could be paid far less than adults, and small hands could reach into the machines.",
            "第一段给出了两个原因：儿童的工钱比成人少得多，而且小手能伸进机器里。",
          ),
        ),
        ask(
          t("Which sentence from the passage states a judgment rather than a fact?", "文章中哪个句子表达的是判断而不是事实？"),
          t("Some owners argued that work kept children out of trouble.", "一些工厂主认为工作能让孩子们不惹麻烦。"),
          [
            t("In 1833, Parliament passed a Factory Act.", "1833年，议会通过了一项《工厂法》。"),
            t("There were only four inspectors to enforce it.", "只有四名督察负责执行这项法律。"),
            t("Some children started work at the age of six or seven.", "有些孩子六七岁就开始工作了。"),
          ],
          t(
            "That work kept children out of trouble is the owners' opinion, which others disputed; the other sentences report facts that can be checked.",
            "工作能让孩子们不惹麻烦是工厂主的观点，别人对此有异议；其他句子报告的是可以核实的事实。",
          ),
        ),
        ask(
          t("How did Robert Owen's mill differ from many others?", "罗伯特·欧文的工厂与许多其他工厂有什么不同？"),
          t("He refused to hire children under ten and built a school for them", "他拒绝雇用十岁以下的儿童，并为他们建了一所学校"),
          [
            t("He paid children more than adults", "他付给儿童的工钱比成人多"),
            t("His mill ran for twenty hours a day", "他的工厂每天运转二十个小时"),
            t("He hired only children from Scotland", "他只雇用来自苏格兰的儿童"),
          ],
          t(
            "The fourth paragraph says that at New Lanark, Owen refused to hire children under ten and built a school for them instead.",
            "第四段说欧文在新拉纳克拒绝雇用十岁以下的儿童，而是为他们建了一所学校。",
          ),
        ),
      ],
      ["Parliament", "Samuel", "Coulson", "Robert", "Owen", "New", "Lanark", "Scotland", "Factory", "Act"],
    ),
    passage(
      "the-power-of-coal",
      t("The Power of Coal", "煤的力量"),
      `The Industrial Revolution ran on coal. It heated the boilers of steam engines, fired the furnaces that made iron and warmed millions of homes. Britain was fortunate to have huge deposits of coal under its ground, and between 1800 and 1900 its production rose from about ten million tons a year to more than two hundred million.

Getting the coal out was dangerous work. Miners went down deep shafts in cages or buckets and then walked, crawled or crouched through narrow tunnels to the coal face, where they cut the coal with picks. Some tunnels were less than a meter high. Water seeped in constantly and had to be pumped out, and the air could be filled with invisible gases. One gas, called firedamp, could explode at the touch of a candle flame. Another, called blackdamp, could suffocate a miner without warning.

Disasters were common. In 1862, at the Hartley Colliery in the north of England, the iron beam of the pumping engine broke and fell down the only shaft, trapping more than two hundred men and boys underground. All of them died. After the disaster, Parliament required every mine to have at least two shafts, so that miners would always have a way out.

Coal also changed the air above ground. In mining and factory towns, smoke from thousands of chimneys darkened the sky and coated buildings with soot. Visitors described towns where the sun seemed to shine through a brown fog. People accepted the smoke as the price of progress, and few understood how much it harmed their lungs.`,
      [coalWords, factoryWords, centralIdea, academic3],
      [
        ask(
          t("Which sentence best states the central idea of the passage?", "哪个句子最能概括这篇文章的中心思想？"),
          t(
            "Coal powered the Industrial Revolution, but mining and burning it came at a high cost",
            "煤为工业革命提供了动力，但开采和燃烧它付出了高昂的代价",
          ),
          [
            t("Coal mines were the safest places to work", "煤矿是最安全的工作场所"),
            t("Britain had less coal than other countries", "英国的煤比其他国家少"),
            t("Firedamp was the most common gas in mines", "沼气是矿井里最常见的气体"),
          ],
          t(
            "The first paragraph shows how much the age depended on coal, and the others describe its dangers below ground and its smoke above.",
            "第一段说明那个时代多么依赖煤，其余段落描述了它在地下的危险和地上的烟雾。",
          ),
        ),
        ask(
          t("Why did the Hartley disaster lead to a new law?", "为什么哈特利灾难促成了一项新法律？"),
          t(
            "The miners died because the mine had only one shaft, which was blocked",
            "矿工们之所以遇难，是因为矿井只有一个竖井，而它被堵住了",
          ),
          [
            t("The miners were killed by an explosion of firedamp", "矿工们死于沼气爆炸"),
            t("The mine had been flooded by a river", "矿井被河水淹没了"),
            t("The miners had gone on strike", "矿工们举行了罢工"),
          ],
          t(
            "The passage says the beam fell down the only shaft and trapped the men, so Parliament required every mine to have at least two shafts.",
            "文章说横梁掉进了唯一的竖井，困住了矿工，所以议会要求每座矿井至少有两个竖井。",
          ),
        ),
        ask(
          t("What does the last paragraph suggest about people's view of the smoke?", "最后一段暗示了人们对烟雾的什么看法？"),
          t("They saw it as the price of progress and did not understand its harm", "他们把它看作进步的代价，并不了解它的危害"),
          [
            t("They campaigned to ban all chimneys", "他们发起运动要求禁止所有烟囱"),
            t("They believed the smoke was good for their health", "他们认为烟雾对健康有益"),
            t("They moved to the countryside to escape it", "他们搬到乡下以躲避烟雾"),
          ],
          t(
            "The last paragraph says people accepted the smoke as the price of progress, and few understood how much it harmed their lungs.",
            "最后一段说人们把烟雾当作进步的代价来接受，很少有人明白它对肺的伤害有多大。",
          ),
        ),
      ],
      ["Industrial", "Revolution", "Britain", "Hartley", "Colliery", "England", "Parliament"],
    ),
    passage(
      "the-iron-road",
      t("The Iron Road", "铁路"),
      `For centuries, the fastest way to travel over land was on horseback. A coach pulled by horses took about four days to travel the four hundred miles from London to Edinburgh, and moving heavy goods such as coal was slow and expensive. The railway changed all of this within a single lifetime.

The first steam locomotives were built to pull coal wagons at mines. In 1825, the Stockton and Darlington Railway carried both coal and passengers, but the great turning point came in 1830, when the Liverpool and Manchester Railway opened. It was the first line built to carry passengers on a timetable, with every train pulled by steam. Its most famous engine, the Rocket, designed by George and Robert Stephenson, reached the astonishing speed of nearly thirty miles an hour.

Not everyone welcomed the railways. Some landowners refused to let lines cross their fields. Coach companies and canal owners feared ruin. A few doctors even warned that traveling at such speeds might harm the human body. Yet the public crowded onto the trains. In the 1840s, during a time later called railway mania, investors poured money into hundreds of new lines, and thousands of workers dug cuttings, built bridges and laid track across the country.

By 1850, Britain had more than six thousand miles of railway. Fresh food could be carried to cities overnight, and newspapers could be read across the country on the day they were printed. Ordinary people could visit the seaside for a day. Railways even changed time itself: to keep timetables accurate, the whole country began to set its clocks to London time.`,
      [coalWords, judgments],
      [
        ask(
          t("Why was the Liverpool and Manchester Railway a turning point?", "为什么利物浦—曼彻斯特铁路是一个转折点？"),
          t(
            "It was the first line built to carry passengers on a timetable with steam trains",
            "它是第一条按时刻表用蒸汽火车运送乘客的线路",
          ),
          [
            t("It was the first railway to carry coal", "它是第一条运煤的铁路"),
            t("It was the longest railway in the world", "它是世界上最长的铁路"),
            t("It used horses instead of engines", "它用马代替发动机"),
          ],
          t(
            "The second paragraph says it was the first line built to carry passengers on a timetable, with every train pulled by steam.",
            "第二段说它是第一条按时刻表运送乘客、每列火车都由蒸汽牵引的线路。",
          ),
        ),
        ask(
          t("Which is an interpretation or judgment rather than a plain fact?", "哪一项是解读或判断，而不是单纯的事实？"),
          t("Some doctors warned that such speeds might harm the human body.", "一些医生警告说，这样的速度可能会损害人体。"),
          [
            t("By 1850, Britain had more than six thousand miles of railway.", "到1850年，英国拥有六千多英里的铁路。"),
            t("The Liverpool and Manchester Railway opened in 1830.", "利物浦—曼彻斯特铁路于1830年开通。"),
            t("The Rocket reached nearly thirty miles an hour.", "“火箭号”的速度接近每小时三十英里。"),
          ],
          t(
            "The doctors' warning was their own belief about what might happen, and it proved wrong; the other choices report measurable facts.",
            "医生的警告是他们对可能发生的事情的看法，后来被证明是错的；其他选项报告的是可以测量的事实。",
          ),
        ),
        ask(
          t("How did railways change the way the country kept time?", "铁路如何改变了全国的计时方式？"),
          t("The whole country began to set its clocks to London time", "全国开始把时钟调成伦敦时间"),
          [
            t("Every town kept its own time by the sun", "每个城镇都按太阳来计时"),
            t("Clocks were banned on trains", "火车上禁止使用时钟"),
            t("Trains ran only during daylight", "火车只在白天运行"),
          ],
          t(
            "The last sentence says that to keep timetables accurate, the whole country began to set its clocks to London time.",
            "最后一句说为了让时刻表准确，全国开始把时钟调成伦敦时间。",
          ),
        ),
      ],
      [
        "London",
        "Edinburgh",
        "Stockton",
        "Darlington",
        "Railway",
        "Liverpool",
        "Manchester",
        "Rocket",
        "George",
        "Robert",
        "Stephenson",
        "Britain",
      ],
    ),
    passage(
      "shock-city",
      t("Shock City", "震惊之城"),
      `In 1800, Manchester was a busy market town. Fifty years later, it was one of the largest cities in Britain, and visitors came from all over the world to see it. They called it the "shock city" of the age, because it showed both the wealth and the misery that the factories could create.

Cotton made Manchester grow. By the 1830s, the city and the towns around it held hundreds of mills, and people poured in from the countryside and from Ireland to find work. The city's population rose from about seventy-five thousand in 1801 to about three hundred thousand in 1851. Builders could not keep up. Landlords packed families into cheap houses built back to back, with no gardens, no running water and no proper drains. The poorest people lived in damp cellars.

A young German named Friedrich Engels, whose father owned a mill in the city, walked through its working-class districts in the 1840s. He described narrow courts where one toilet was shared by more than a hundred people and where heaps of rubbish and waste lay in the streets. Disease spread easily. In the poorest districts, many children died before the age of five.

Visitors who saw only the city center told a different story. They admired grand warehouses, new banks and railway stations, and the energy of a city that seemed to be building the future. Both views were true. Manchester was a place of great invention and great wealth, and also a place where the people who created that wealth often lived in terrible conditions.`,
      [workerWords, factoryWords, centralIdea],
      [
        ask(
          t('Why was Manchester called the "shock city" of the age?', "为什么曼彻斯特被称为那个时代的“震惊之城”？"),
          t("It showed both the wealth and the misery the factories could create", "它同时展现了工厂所能创造的财富和苦难"),
          [
            t("It was destroyed by an earthquake", "它被一场地震摧毁了"),
            t("It had no factories at all", "它根本没有工厂"),
            t("It was the oldest city in Britain", "它是英国最古老的城市"),
          ],
          t(
            "The first paragraph says it showed both the wealth and the misery that the factories could create.",
            "第一段说它同时展现了工厂所能创造的财富和苦难。",
          ),
        ),
        ask(
          t("What problem do the details in the second paragraph show?", "第二段的细节说明了什么问题？"),
          t("Housing could not keep up with the city's rapid growth", "住房跟不上城市的快速增长"),
          [
            t("The mills were closing and workers were leaving", "工厂纷纷倒闭，工人纷纷离开"),
            t("The city had too many gardens", "城市里花园太多"),
            t("Builders refused to work in the city", "建筑工人拒绝在城里干活"),
          ],
          t(
            "The paragraph says the population quadrupled and builders could not keep up, so families were packed into cheap houses and cellars.",
            "这一段说人口翻了两番，建筑工人跟不上，于是许多家庭挤进廉价房屋和地下室。",
          ),
        ),
        ask(
          t("How does the last paragraph treat the two different accounts of the city?", "最后一段如何对待关于这座城市的两种不同说法？"),
          t("It says both views were true", "它说两种看法都是对的"),
          [
            t("It says Engels invented his account", "它说恩格斯编造了他的说法"),
            t("It says the visitors never saw the city center", "它说参观者从未见过市中心"),
            t("It says only the visitors' view was correct", "它说只有参观者的看法是正确的"),
          ],
          t(
            "The last paragraph says that both views were true: the city had great wealth and invention, and many of its people lived in terrible conditions.",
            "最后一段说两种看法都是对的：这座城市有巨大的财富和发明，而许多市民生活在可怕的条件下。",
          ),
        ),
      ],
      ["Manchester", "Britain", "Ireland", "German", "Friedrich", "Engels"],
    ),
    passage(
      "the-luddites",
      t("The Luddites", "卢德分子"),
      `On a night in 1811, in the county of Nottinghamshire, a group of men with blackened faces broke into a workshop and smashed its knitting machines with heavy hammers. Over the following months, similar attacks spread across the north of England. The attackers signed their threatening letters with the name of "General Ludd" or "King Ludd," an imaginary leader, and they became known as the Luddites.

Today, the word Luddite is often used for someone who hates new technology. But historians have shown that the real Luddites were not against machines in general. Most were skilled weavers and knitters who had served long apprenticeships. Their quarrel was with employers who used new machines to make cheap, poorly made goods with unskilled workers, while cutting the wages of skilled ones. In many cases, the Luddites broke only the machines of employers who paid less than the agreed rates and left others alone.

The times were desperate. Britain was at war with France, trade was disrupted and the price of bread had soared. A skilled weaver's weekly wages had fallen to a fraction of what they had been twenty years before. Many families were close to starving, and workers had no vote and no legal right to form a union.

The government responded harshly. It sent twelve thousand soldiers to the affected areas, more than had been sent to fight in Portugal that year, and made machine breaking a crime punishable by death. In 1813, seventeen men were hanged in York. The movement faded, but the questions it raised, about who benefits from new technology and who pays its price, have never gone away.`,
      [workerWords, factoryWords, judgments],
      [
        ask(
          t("According to historians, what were the Luddites really against?", "据历史学家说，卢德分子真正反对的是什么？"),
          t("Employers who used machines to cut skilled workers' wages", "利用机器削减熟练工人工资的雇主"),
          [
            t("All new technology of every kind", "各种各样的新技术"),
            t("The war between Britain and France", "英法之间的战争"),
            t("The price of knitting machines", "织袜机的价格"),
          ],
          t(
            "The second paragraph says their quarrel was with employers who used new machines to make cheap goods while cutting the wages of skilled workers.",
            "第二段说他们的不满针对的是那些用新机器生产廉价商品、同时削减熟练工人工资的雇主。",
          ),
        ),
        ask(
          t(
            "Which detail supports the interpretation that the Luddites chose their targets carefully?",
            "哪个细节支持卢德分子谨慎选择目标这一解读？",
          ),
          t("They broke only the machines of employers who paid less than the agreed rates", "他们只砸毁那些支付低于约定工资的雇主的机器"),
          [
            t("They signed their letters with the name General Ludd", "他们在信上署名“卢德将军”"),
            t("They blackened their faces before the attacks", "他们在袭击前把脸涂黑"),
            t("They used heavy hammers to smash the machines", "他们用重锤砸毁机器"),
          ],
          t(
            "Breaking only the machines of employers who underpaid and leaving others alone shows that the attacks were aimed, not random.",
            "只砸毁少付工资的雇主的机器而放过其他人，说明这些袭击是有针对性的，而不是随意的。",
          ),
        ),
        ask(
          t("How did the government respond to the machine breaking?", "政府如何应对砸机器的行为？"),
          t("It sent thousands of soldiers and made machine breaking punishable by death", "它派出数千名士兵，并规定砸机器可处死刑"),
          [
            t("It raised the wages of all weavers", "它提高了所有织工的工资"),
            t("It gave workers the right to vote", "它给予工人选举权"),
            t("It banned all new machines", "它禁止了所有新机器"),
          ],
          t(
            "The last paragraph says the government sent twelve thousand soldiers and made machine breaking a crime punishable by death.",
            "最后一段说政府派出一万二千名士兵，并把砸机器定为可处死刑的罪行。",
          ),
        ),
      ],
      ["Nottinghamshire", "England", "General", "Ludd", "King", "Luddites", "Luddite", "Britain", "France", "Portugal", "York"],
    ),
    passage(
      "the-match-girls-strike",
      t("The Match Girls' Strike", "火柴女工罢工"),
      `In the 1880s, the Bryant and May factory in East London employed about fourteen hundred women and girls to make matches. Many of them were teenagers, and some were as young as thirteen. They worked up to fourteen hours a day for very low wages, and they could be fined for small offenses such as talking, dropping matches or arriving with dirty feet. The fines could take away a large part of a week's pay.

The work was also dangerous. The matches were made with white phosphorus, a poisonous substance. Over time, it could cause a terrible disease called "phossy jaw," which made the bones of the jaw rot and could lead to death. The company's owners knew the risks, and safer phosphorus was available, but it was more expensive.

In June 1888, a writer and campaigner named Annie Besant published an article called "White Slavery in London," describing the conditions at the factory. The company tried to force the workers to sign a statement saying that the article was false. When they refused and one worker was dismissed, the women walked out. Within a day, the whole factory had stopped.

The strikers marched through London, met with members of Parliament and gained the support of newspapers and the public. After about three weeks, the company gave way. It ended the fines and agreed to improve conditions. The women went on to form a union, one of the first for unskilled women workers.

The strike was small, but it inspired other unskilled workers, including the dock workers of London, who went on strike the following year and won.`,
      [workerWords, factoryWords, centralIdea, academic2],
      [
        ask(
          t("Why was white phosphorus dangerous to the workers?", "为什么白磷对工人有危险？"),
          t("It could cause a disease that made the jawbones rot", "它会引发一种使颌骨腐烂的疾病"),
          [
            t("It caused fires that destroyed the factory", "它引发了烧毁工厂的火灾"),
            t("It made the matches too heavy to carry", "它使火柴太重而搬不动"),
            t("It was too expensive for the company to buy", "它太贵，公司买不起"),
          ],
          t(
            "The second paragraph says white phosphorus could cause phossy jaw, which made the bones of the jaw rot and could lead to death.",
            "第二段说白磷会引起“磷毒性颌骨坏死”，使颌骨腐烂，甚至导致死亡。",
          ),
        ),
        ask(
          t("What finally started the strike?", "罢工最终是由什么引发的？"),
          t("Workers refused to sign a false statement, and one of them was dismissed", "工人拒绝签署一份虚假声明，其中一人被解雇"),
          [
            t("The company doubled the workers' fines", "公司把工人的罚款翻了一倍"),
            t("The factory caught fire", "工厂着火了"),
            t("Parliament ordered the factory to close", "议会下令关闭工厂"),
          ],
          t(
            "The third paragraph says that when the workers refused to sign the statement and one was dismissed, the women walked out.",
            "第三段说当工人们拒绝签署声明、其中一人被解雇时，女工们罢工了。",
          ),
        ),
        ask(
          t("What does the last paragraph add to the central idea of the passage?", "最后一段为文章的中心思想补充了什么？"),
          t("The strike's success inspired other unskilled workers to act", "罢工的成功鼓舞了其他非熟练工人采取行动"),
          [
            t("The strike failed and was soon forgotten", "罢工失败了，很快就被遗忘"),
            t("The dock workers opposed the match girls", "码头工人反对火柴女工"),
            t("The factory closed the following year", "工厂在第二年关闭了"),
          ],
          t(
            "The last paragraph shows that the strike mattered beyond the factory, inspiring the London dock workers, who struck and won the next year.",
            "最后一段表明这次罢工的意义超出了工厂本身，它鼓舞了伦敦码头工人，后者第二年罢工并取得胜利。",
          ),
        ),
      ],
      ["Bryant", "May", "East", "London", "June", "Annie", "Besant", "White", "Slavery", "Parliament"],
    ),
    passage(
      "cleaning-up-the-city",
      t("Cleaning Up the City", "清理城市"),
      `By the middle of the nineteenth century, the industrial cities of Britain were among the unhealthiest places on Earth. In 1842, a lawyer named Edwin Chadwick published a report on the living conditions of the working classes. He found that in Liverpool, the average laborer died at about fifteen, while the average gentleman lived to thirty-five. Chadwick argued that much of this disease was caused by filth: by sewage in the streets, polluted water and overcrowded homes.

Many people at the time believed that diseases such as cholera were spread by "miasma," a bad smell in the air. A doctor named John Snow thought otherwise. During an outbreak of cholera in London in 1854, he marked every death on a map and found that most of them were clustered around a single water pump on Broad Street. When the pump handle was removed, the number of new cases fell. Snow's work suggested that cholera was carried by dirty water, not by bad air.

The city of London was slow to act until the summer of 1858, when hot weather turned the River Thames, into which the city's sewage flowed, into a stinking open drain. The smell, known as the Great Stink, was so bad that members of Parliament hung curtains soaked in chemicals in their windows. Within weeks, Parliament approved a plan by the engineer Joseph Bazalgette to build a vast system of sewers.

Bazalgette's sewers, more than a thousand miles of them, carried waste away from the city. Outbreaks of cholera in London became much rarer, and many of his tunnels are still in use today.`,
      [workerWords, centralIdea, judgments, academic2],
      [
        ask(
          t("What did Edwin Chadwick argue caused much of the disease in the cities?", "埃德温·查德威克认为城市中许多疾病是由什么引起的？"),
          t("Filth, such as sewage, polluted water and overcrowded homes", "污秽，比如污水、被污染的水和拥挤的住房"),
          [
            t("The long hours worked in the factories", "工厂里漫长的工作时间"),
            t("A bad smell in the air called miasma", "一种被称为“瘴气”的空气中的恶臭"),
            t("The cold weather of northern England", "英格兰北部寒冷的天气"),
          ],
          t(
            "The first paragraph says Chadwick argued that much of the disease was caused by filth: sewage in the streets, polluted water and overcrowded homes.",
            "第一段说查德威克认为许多疾病是由污秽引起的：街上的污水、被污染的水和拥挤的住房。",
          ),
        ),
        ask(
          t("How did John Snow's evidence challenge the miasma theory?", "约翰·斯诺的证据如何挑战了瘴气理论？"),
          t("Deaths clustered around one water pump and fell when it was closed", "死亡病例集中在一个水泵周围，水泵关闭后病例减少"),
          [
            t("He proved that bad smells caused every disease", "他证明了恶臭会引起所有疾病"),
            t("He found that cholera was spread by rats", "他发现霍乱是由老鼠传播的"),
            t("He showed that only gentlemen caught cholera", "他表明只有绅士才会感染霍乱"),
          ],
          t(
            "Snow mapped the deaths around the Broad Street pump and saw cases fall when its handle was removed, which pointed to water, not air.",
            "斯诺在地图上标出宽街水泵周围的死亡病例，并发现拆掉水泵把手后病例减少，这表明病因是水而不是空气。",
          ),
        ),
        ask(
          t("What finally pushed Parliament to act?", "最终是什么促使议会采取行动？"),
          t("The Great Stink of the River Thames in 1858", "1858年泰晤士河的“大恶臭”"),
          [
            t("Chadwick's report of 1842", "查德威克1842年的报告"),
            t("A strike by London's workers", "伦敦工人的罢工"),
            t("The closing of the Broad Street pump", "宽街水泵的关闭"),
          ],
          t(
            "The third paragraph says London was slow to act until the Great Stink of 1858; within weeks, Parliament approved Bazalgette's plan.",
            "第三段说伦敦一直行动迟缓，直到1858年的大恶臭；几周之内，议会就批准了巴泽尔杰特的计划。",
          ),
        ),
      ],
      [
        "Britain",
        "Earth",
        "Edwin",
        "Chadwick",
        "Liverpool",
        "John",
        "Snow",
        "Snow's",
        "London",
        "Broad",
        "Street",
        "River",
        "Thames",
        "Great",
        "Stink",
        "Parliament",
        "Joseph",
        "Bazalgette",
        "Bazalgette's",
      ],
    ),
  ],
};
