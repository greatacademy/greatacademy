// The reading unit of the B2 theme Society and Change: cities, an emptied village, aging, four generations, the fall
// of Rome, refugees, measuring equality and a law against smoking.

import { type ReadingUnitDef, t } from "@ga/content";
import { passageMaker } from "../pre-a1/reading-kit.ts";
import { readingWords } from "./reading-words.ts";

const third = "third-conditional";

const passage = passageMaker(readingWords, [
  "b2-words-society",
  "b2-words-population",
  "b2-words-change-verbs",
  "b2-words-history",
  "b2-words-war-and-peace",
  "b2-words-politics",
  "b2-words-social-issues",
  "b2-words-trends",
  "b2-words-generations",
  "b2-words-linking-1",
  "b2-words-opinion-verbs",
  third,
]);

/** readingSociety is the reading unit of the theme Society and Change. */
export const readingSociety: ReadingUnitDef = {
  id: "b2-reading-society",
  title: t("Society and Change", "社会与变迁"),
  passages: [
    passage({
      id: "b2-society-why-cities-grow",
      title: ["Why Cities Grow", "城市为什么扩张"],
      body: `In 1950, less than 30 percent of the people in the world lived in cities. Today the number is more than half, and the United Nations estimates that it will rise to about 68 percent by 2050. This change, known as urbanization, is one of the biggest in history.

Why do people move to cities? Experts usually describe two types of forces: forces that push people and forces that pull them. Push forces drive people away from rural areas. Increasingly, machines do the work on farms, so farms need a smaller number of workers; droughts and floods can destroy the food of a whole year; and in many villages there is a lack of schools, hospitals and jobs.

Pull forces bring people to cities. The most important is work: wages in cities are, on average, considerably higher than in rural areas. Cities also offer better education, health care and entertainment, and for many young people, the opportunity to live free from the norms of village life.

Migration to cities has transformed whole countries. China, for example, has undergone the largest migration in history: since 1980, hundreds of millions of people have migrated from farms to cities, and the share of the population living in urban areas has risen from about 20 percent to roughly 66 percent.

Nevertheless, rapid growth brings serious problems. When people arrive faster than housing can be built, they settle wherever they can, often in settlements that nobody planned, without clean water or electricity. Roughly one billion people around the world live in such settlements today. Congestion, pollution and pressure on schools and hospitals are common in cities that grow fast.

Despite these problems, most experts maintain that urbanization is, on the whole, a positive force. Cities are where new ideas emerge, where most wealth is created and where people have the most opportunities. The challenge for governments is not to stop people from moving, but to plan for them, so that the cities of the future are places where new inhabitants can build a good life.`,
      names: ["United", "Nations", "China"],
      questions: [
        [
          ['Which of these is a "push force"?', "下面哪一项属于“推力”？"],
          ["A lack of schools and jobs in villages", "村里缺少学校和工作"],
          [
            ["Higher wages in cities", "城市里更高的工资"],
            ["Better entertainment in cities", "城市里更好的娱乐"],
          ],
          [
            'Push forces "drive people away from rural areas", such as "a lack of schools, hospitals and jobs". Wages and entertainment in cities are pull forces.',
            "推力把人推离农村，比如缺少学校、医院和工作；城市的高工资和娱乐属于拉力。",
          ],
        ],
        [
          ["How has China changed since 1980?", "1980 年以来中国发生了怎样的变化？"],
          ["About two thirds of its people now live in urban areas", "现在约三分之二的人口住在城市地区"],
          [
            ["Most of its people have moved from cities back to farms", "大多数人从城市搬回了农村"],
            ["Its total population has fallen to about a fifth", "它的总人口下降到约五分之一"],
          ],
          [
            '"The share of the population living in urban areas has risen from about 20 percent to roughly 66 percent."',
            "城镇人口比例从约五分之一上升到大约三分之二。",
          ],
        ],
        [
          ["What do most experts maintain about urbanization?", "大多数专家对城市化持什么观点？"],
          ["Overall it is positive, but cities must plan for newcomers", "总体上是积极的，但城市必须为新来者做好规划"],
          [
            ["Governments should stop people from moving to cities", "政府应该阻止人们迁往城市"],
            ["It mainly causes pollution and should be reduced", "它主要造成污染，应该加以减少"],
          ],
          [
            '"Most experts maintain that urbanization is, on the whole, a positive force... The challenge for governments is not to stop people from moving, but to plan for them."',
            "专家认为城市化总体上是积极的，政府的任务不是阻止迁移，而是为新来者做好规划。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-society-the-village-that-emptied",
      title: ["The Village That Emptied", "人去村空"],
      body: `When Anna Rossi was born in the mountain village of Valdoria in 1948, it had more than nine hundred inhabitants, two schools, a church, three shops and a bakery. When she returned to live there after she retired in 2012, it had forty-one, and she was one of the youngest.

The decline of Valdoria was gradual, and its story is similar to the story of thousands of villages across the south of Europe, as well as in Japan, the east of Europe and rural China.

The first wave of people emigrated between 1950 and 1970. Young men left to work in the factories of cities in the north, or emigrated to Germany and Switzerland, where there were plenty of jobs. Many planned to come back once they had saved enough money. Most never did. They married, had children and settled where they worked.

As the young people left, the birth rate fell. The first school closed in 1971, the second in 1985. Without a school, young families had no reason to stay, and those who stayed were increasingly elderly. The shops closed one by one. The bus to the nearest town, which had once run five times a day, was reduced to two times a week.

By 1995, more than half of the houses stood empty. Roofs fell in, and gardens turned back into forest. "It was like watching someone you love grow old and ill," Anna says.

Recently, however, there have been small signs of change. During the pandemic, when many people could work from home, a few families from the city bought cheap houses in Valdoria and restored them. A young couple opened a small hotel for people who come to walk in the mountains. The council has proposed opening the school again if at least eight children enroll.

Whether these changes will be enough is uncertain. The village still lacks a doctor, and the internet connection is poor. Nevertheless, Anna has hope. "Last summer, I heard children playing in the square for the first time in thirty years," she says. "If you had told me that ten years ago, I wouldn't have believed you."`,
      grammar: [third],
      names: ["Anna", "Rossi", "Valdoria", "Europe", "Japan", "China", "Germany", "Switzerland"],
      glossed: ["pandemic"],
      questions: [
        [
          ["Why did many young men leave Valdoria in the 1950s and 1960s?", "二十世纪五六十年代，为什么很多年轻男子离开了瓦尔多里亚？"],
          ["To work in factories in northern cities or abroad", "去北方城市或国外的工厂工作"],
          [
            ["Because both schools in the village had closed", "因为村里的两所学校都关了"],
            ["Because the bus to the town had been reduced", "因为去镇上的班车减少了"],
          ],
          [
            '"Young men left to work in the factories of cities in the north, or emigrated to Germany and Switzerland." The schools closed later, in 1971 and 1985.',
            "年轻人去北方城市或德国、瑞士的工厂打工；学校是后来在 1971 年和 1985 年才关闭的。",
          ],
        ],
        [
          ["Why did young families stop staying after the schools closed?", "学校关闭后，为什么年轻家庭不再留下？"],
          ["Without a school, they had no reason to stay", "没有学校，他们就没有理由留下"],
          [
            ["The houses had become too expensive to buy", "房子变得太贵买不起"],
            ["The council asked them to move to the town", "村委会要求他们搬到镇上"],
          ],
          [
            '"Without a school, young families had no reason to stay, and those who stayed were increasingly elderly."',
            "没有学校，年轻家庭就没有理由留下，留下的人越来越老。",
          ],
        ],
        [
          ["What change has happened recently?", "最近发生了什么变化？"],
          ["Some families from the city have restored old houses", "一些城里的家庭修复了旧房子"],
          [
            ["A doctor has come to live and work in the village", "一位医生来村里生活和工作"],
            ["The bus runs five times a day again", "班车又恢复了每天五趟"],
          ],
          [
            '"A few families from the city bought cheap houses in Valdoria and restored them." The village still lacks a doctor.',
            "几户城里人买下便宜的房子并加以修复；村里仍然没有医生。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-society-living-longer-working-longer",
      title: ["Living Longer, Working Longer", "活得更久，工作更久"],
      body: `In 1900, a baby born in a rich country could expect to live to about fifty. Today, life expectancy in many of those countries is over eighty, and in Japan it is nearly eighty-five. This is one of the greatest successes of modern civilization, made possible by clean water, vaccines, better food and progress in medicine.

However, longer lifespans, together with lower birth rates, have created a demographic challenge. In many countries the number of people over sixty-five is rising rapidly, while the number of young adults is declining. In Japan, roughly three in ten people are now over sixty-five; in Italy and Germany, it is more than one in five.

This matters because pensions and health care for seniors are largely paid for by the taxes of people who are working. In 1960, many European countries had more than five workers for every person who received a pension. Today they have about three, and by 2050 they may have only two.

Governments have responded in a number of ways. The most common, and the one that people argue about most, is raising the age at which people can receive a pension. France, for example, raised it from sixty-two to sixty-four in 2023, despite months of protests.

People who support such reforms emphasize that we are not only living longer but also staying healthy for longer, so it is reasonable to work a few more years. People who oppose them insist that the change is not fair. A university professor may be happy to keep teaching at sixty-six, whereas a person who builds houses or a nurse, whose work is hard on the body, may not be able to.

Other answers have been proposed. Some countries encourage young workers to migrate from abroad. Others offer flexible hours, so that older employees can reduce their hours gradually instead of stopping all at once. Many companies are also learning to value older workers for their experience and for being reliable.

What seems certain is that the traditional shape of life, in which people study, work and retire at sixty, is changing. For the teenagers of today, a working life of fifty years may become the norm.`,
      names: ["Japan", "Italy", "Germany", "European", "France"],
      questions: [
        [
          ['What has created a "demographic challenge"?', "是什么造成了“人口挑战”？"],
          ["Longer lifespans combined with lower birth rates", "寿命延长加上出生率下降"],
          [
            ["Higher birth rates in wealthy countries", "富裕国家出生率上升"],
            ["Shorter working lives for young people", "年轻人的工作年限缩短"],
          ],
          [
            '"Longer lifespans, together with lower birth rates, have created a demographic challenge."',
            "寿命延长和出生率下降共同造成了人口挑战。",
          ],
        ],
        [
          ["Why do some people say that raising the pension age is not fair?", "为什么有些人认为提高退休年龄不公平？"],
          ["Some jobs are too hard physically to do at an older age", "有些工作体力消耗大，年纪大了干不动"],
          [
            ["Professors want to stop teaching at an earlier age", "教授们想更早停止教书"],
            ["People are not living any longer than before", "人们的寿命并没有比以前长"],
          ],
          [
            '"A university professor may be happy to keep teaching at sixty-six, whereas a person who builds houses or a nurse, whose work is hard on the body, may not be able to."',
            "教授六十六岁可能还乐意教书，而建筑工人或护士的工作很耗体力，可能干不动了。",
          ],
        ],
        [
          ["Which solution lets older employees stop working gradually?", "哪种办法让年长员工可以逐步停止工作？"],
          ["Flexible hours, so that they work less and less", "弹性工时，让他们逐步减少工作"],
          [
            ["Raising the age at which people receive a pension", "提高领取养老金的年龄"],
            ["Encouraging the immigration of young workers", "鼓励年轻劳动力移民"],
          ],
          [
            '"Others offer flexible hours, so that older employees can reduce their hours gradually instead of stopping all at once."',
            "灵活安排让年长员工逐步减少工作时间，而不是一下子完全停止。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-society-a-century-in-one-family",
      title: ["A Century of Change in One Family", "一个家庭的百年变迁"],
      body: `The grandmother of my mother, Wang Lan, was born in 1921 in a village in Shandong. She never went to school. Like most girls of her generation, she could not read or write, and she was married at sixteen to a man she had met only once. She had seven children, two of whom died as infants. She spent her whole life within twenty kilometers of the village where she was born.

Her son, my grandfather, was born in 1945, the year the war ended. He went to school for six years before he had to work on the family farm. Between 1960 and 1980, life was hard; there were years when the family hardly had enough to eat. Still, he made sure that all his children went to school. "He used to say that education was the only thing nobody could take away from you," my mother remembers.

My mother was born in 1972. She was the first person in the family to finish high school, and, in 1990, the first to go to university. She studied engineering in Shanghai, a city of skyscrapers that her grandmother could never have imagined. She married a man she had chosen herself, and they had one child: me.

I was born in 2005, in an apartment on the twentieth floor. I have never worked on a farm, and I have been to five countries. Wang Lan had never seen a car until she was thirty; I learned to use a tablet before I could read. I am studying in Singapore now, and I talk to my parents on video every evening.

When I think about these four lives, I am surprised by how dramatically my country has been transformed. In a single century, my family moved from a village without electricity to cities that are as modern as any in the world.

But not everything has improved. Wang Lan lived with her relatives all her life; she was never alone. My parents live a thousand kilometers from their brothers and sisters, and I see my grandparents only once a year. If Wang Lan had seen the way we live now, I wonder whether she would have wished to live like us, or felt sorry for us.`,
      grammar: [third],
      names: ["Wang", "Lan", "Shandong", "Shanghai", "Singapore"],
      questions: [
        [
          ["What was life like for Wang Lan?", "王兰的一生是怎样的？"],
          ["She never went to school and stayed near her village", "她从没上过学，一直生活在村子附近"],
          [
            ["She studied engineering in a big city", "她在大城市学习工程"],
            ["She chose her own husband at the age of twenty", "她二十岁时自己选择了丈夫"],
          ],
          [
            '"She never went to school... She spent her whole life within twenty kilometers of the village where she was born." It was the writer\'s mother who studied engineering.',
            "王兰没上过学，一辈子没离开出生地二十公里；学工程的是作者的母亲。",
          ],
        ],
        [
          ["Why did the grandfather make sure that his children went to school?", "祖父为什么一定要让孩子们上学？"],
          ["He believed that education could not be taken away", "他相信教育是别人夺不走的"],
          [
            ["The government paid him to send them there", "政府付钱让他送孩子上学"],
            ["He wanted them to work on the farm later", "他希望他们以后在农场干活"],
          ],
          ['"He used to say that education was the only thing nobody could take away from you."', "他常说教育是唯一谁也拿不走的东西。"],
        ],
        [
          ["What does the writer think has become worse?", "作者认为什么变得更糟了？"],
          ["Families now live far away from their relatives", "家人现在住得离亲戚很远"],
          [
            ["People travel to other countries less than before", "人们出国比以前少了"],
            ["Children learn to read at a later age", "孩子们识字的年龄更晚了"],
          ],
          [
            '"My parents live a thousand kilometers from their brothers and sisters, and I see my grandparents only once a year."',
            "作者的父母与兄弟姐妹相隔一千公里，作者一年只见祖父母一次，家人不再像过去那样生活在一起。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-society-the-end-of-an-empire",
      title: ["The End of an Empire", "帝国的终结"],
      body: `For about four hundred years, the Roman Empire was the strongest power in the Western world. At its largest, around the year 117, it stretched from Britain in the north to Egypt in the south, and from Spain in the west to the borders of Persia in the east. Roughly sixty million people, perhaps a quarter of the population of the world, lived under Roman rule.

Yet by 476, the western half of the empire had disappeared. In that year, a Germanic leader took power from the last emperor in Rome, a teenager called Romulus Augustulus, and did not choose a new one. Why did such a great empire fall?

Experts on history have argued about this question for centuries, and they have proposed dozens of explanations. Most now agree that there was no single cause. Instead, a number of problems came together and made one another worse.

The first was about power. In the third century alone, Rome had more than twenty emperors, many of whom lost their lives at the hands of their own soldiers. Constant wars inside the empire made the army and the economy weak.

The second was about money. Protecting such long borders required a huge army, which was very expensive. To pay for it, emperors raised taxes and reduced the amount of silver in their coins, which caused prices to rise rapidly.

The third was pressure from outside. From the late fourth century, Goths, Vandals and other groups crossed the borders, some of them running from invasions from farther east. Rome increasingly relied on these groups as allies and soldiers, but it could not always control them. In 410, an army of Goths took Rome itself, an event that the whole Mediterranean world could hardly believe.

It is worth emphasizing that the half of the empire in the east, with its capital at Constantinople, survived for nearly another thousand years, until 1453. For the people who lived there, the Roman Empire had not ended at all. This reminds us that the "fall" of an empire is often not a sudden end but a slow change.`,
      names: [
        "Roman",
        "Western",
        "Britain",
        "Egypt",
        "Spain",
        "Persia",
        "Germanic",
        "Rome",
        "Romulus",
        "Augustulus",
        "Goths",
        "Vandals",
        "Mediterranean",
        "Constantinople",
      ],
      glossed: ["emperor", "emperors"],
      questions: [
        [
          ["What happened in 476?", "476 年发生了什么？"],
          ["The last emperor in the west was removed and not replaced", "西部最后一位皇帝被废，且无人接替"],
          [
            ["Rome was captured by an army of Goths", "罗马被哥特人的军队攻占"],
            ["The empire reached its largest size", "帝国的疆域达到最大"],
          ],
          [
            '"In that year, a Germanic leader took power from the last emperor in Rome... and did not choose a new one." The Goths took Rome in 410.',
            "476 年一位日耳曼首领废黜了罗马最后一位皇帝且不再另立；哥特人攻占罗马是在 410 年。",
          ],
        ],
        [
          ["According to most historians, why did the western empire fall?", "大多数历史学家认为西罗马帝国为什么灭亡？"],
          ["A number of problems combined; there was no single cause", "多种问题叠加，没有单一原因"],
          [
            ["Its army was always too small to fight", "它的军队一直太小，无法作战"],
            ["The emperors moved the capital to the east", "皇帝们把首都迁到了东方"],
          ],
          [
            '"Most now agree that there was no single cause. Instead, a number of problems came together and made one another worse."',
            "多数历史学家认为没有单一原因，而是政治、经济和外部压力等问题相互叠加、彼此加剧。",
          ],
        ],
        [
          ["What does the survival of the eastern half show?", "东半部帝国的延续说明了什么？"],
          ['The "fall" of an empire can be a slow transformation', "帝国的“衰亡”可能是缓慢的转变"],
          [
            ["The western half was stronger than the eastern", "西半部比东半部更强大"],
            ["Empires always end suddenly and completely", "帝国总是突然而彻底地终结"],
          ],
          [
            "\"This reminds us that the 'fall' of an empire is often not a sudden end but a slow change.\"",
            "东罗马又延续了近千年，这提醒我们帝国的“灭亡”往往不是突然崩溃，而是缓慢的转变。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-society-refugees-who-rebuilt-a-town",
      title: ["Refugees Who Rebuilt a Town", "重建小镇的难民"],
      body: `In 2010, the small hill town of Montelago was dying. Its population had fallen from three thousand to under eight hundred, most of them elderly. Half the houses were empty, the school was about to close, and the last baker had retired.

Then the mayor proposed something that surprised everyone. At that time, thousands of refugees running from war and violence were arriving by boat on the coast nearby, and the government was looking for places to house them. Instead of rejecting them, as many towns did, Montelago offered to welcome two hundred.

Many residents were against the idea. Some were afraid of crime; others worried that the new inhabitants would take their jobs or change the character of the town. At a tense public meeting, one man insisted that the refugees "would never adapt to our way of life". The mayor acknowledged these fears, but he maintained that without new inhabitants, the town would soon disappear.

The first families arrived from Syria, Afghanistan, Eritrea and Nigeria. The town gave them empty houses, which they restored themselves with help from local workers. Their children enrolled at the school, which stayed open. Adults took Italian classes, and those who had worked with wood, made clothes or cooked in their own countries opened small shops and restaurants.

Not everything went well. Some refugees left for larger cities or other countries, and people on both sides often did not understand each other. Money from the government was sometimes delayed for months, and the town found it hard to pay its bills.

Nevertheless, ten years later, the population had risen to more than a thousand. The school had more pupils than at any time since 1985. Tourists came to eat at the new restaurants, and journalists came to write about the town.

The man who had spoken against the plan at the meeting now buys his bread from a baker from Syria. "I was wrong," he admits. "If they hadn't come, there would be no town left. They didn't change us. They saved us."`,
      grammar: [third],
      names: ["Montelago", "Syria", "Afghanistan", "Eritrea", "Nigeria", "Italian"],
      questions: [
        [
          ["What problem did Montelago have in 2010?", "2010 年蒙特拉戈面临什么问题？"],
          ["Its population was falling and growing older", "人口在减少，并且日益老龄化"],
          [
            ["It had too many new inhabitants to house", "新居民太多，住不下"],
            ["It had no space left for new houses", "已经没有空地建新房"],
          ],
          [
            '"Its population had fallen from three thousand to under eight hundred, most of them elderly. Half the houses were empty."',
            "小镇人口从三千降到不足八百，大多是老人，一半的房子空着。",
          ],
        ],
        [
          ["What did the man at the public meeting insist?", "那位男子在公众会议上坚持什么观点？"],
          ["That the refugees would never adapt to local life", "难民永远无法适应当地的生活方式"],
          [
            ["That the town badly needed new inhabitants", "小镇急需新居民"],
            ["That the school should close at once", "学校应该马上关闭"],
          ],
          [
            "He \"insisted that the refugees 'would never adapt to our way of life'\". It was the mayor who said the town needed new inhabitants.",
            "他坚称难民永远无法适应当地生活；认为小镇需要新居民的是镇长。",
          ],
        ],
        [
          ["How does the man feel now?", "这位男子现在怎么想？"],
          ["He admits he was wrong and thinks they saved the town", "他承认自己错了，认为是难民救了小镇"],
          [
            ["He still believes they changed the town for the worse", "他仍然认为难民让小镇变糟了"],
            ["He has decided to move to a larger city", "他决定搬到更大的城市去"],
          ],
          [
            '"I was wrong... If they hadn\'t come, there would be no town left... They saved us."',
            "他承认自己错了：要不是难民到来，小镇早就不存在了。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-society-measuring-equality",
      title: ["Measuring Equality", "衡量平等"],
      body: `How much equality is there in a society? It sounds like a simple question, but answering it is harder than it seems.

The most common measure of the inequality of income is the Gini coefficient. It takes its name from Corrado Gini, an Italian who developed it in 1912. It is a number between 0 and 1. A score of 0 would mean complete equality: everyone has exactly the same income. A score of 1 would mean that one person has all the income and everyone else has nothing.

In fact, no country is close to either end. Countries such as Slovakia, Slovenia and Norway have scores of about 0.25, which means that income is shared in a relatively fair way. South Africa, on the other hand, has one of the highest scores in the world, about 0.63, in part because of decades of discrimination against black people. The United States and China both score around 0.4.

However, the Gini coefficient has its problems. Two countries with the same score can be very different. Furthermore, it measures income, the money people earn each year, and not wealth, the things and money that people own. Wealth is usually shared in a far less fair way than income: in many countries, the richest tenth of the population own more than half of all wealth.

For this reason, experts increasingly use a number of measures together. Some compare the income of the richest tenth with that of the poorest tenth. Others look beyond money, at differences in life expectancy, education and access to health care between groups. The United Nations, for example, publishes a measure that adjusts the level of development of each country for inequality.

Why does any of this matter? Research suggests that societies with great inequality usually have lower levels of trust, worse health and less social mobility, meaning that children born poor find it harder to get out of poverty. Nevertheless, experts dispute how much inequality a society should accept, and what governments should do about it. Measuring equality is only the beginning; deciding what to do with the numbers is a question for politics.`,
      names: ["Gini", "Corrado", "Italian", "Slovakia", "Slovenia", "Norway", "South", "Africa", "United", "States", "China", "Nations"],
      glossed: ["coefficient", "mobility"],
      questions: [
        [
          ["What would a Gini score of 0 mean?", "基尼系数为 0 意味着什么？"],
          ["Everyone has exactly the same income", "每个人的收入完全相同"],
          [
            ["One person has all of the income", "一个人拥有全部收入"],
            ["Nobody in the country has any income", "这个国家没有人有收入"],
          ],
          [
            '"A score of 0 would mean complete equality: everyone has exactly the same income." A score of 1 means one person has everything.',
            "0 表示完全平等，人人收入相同；1 表示一个人拥有全部收入。",
          ],
        ],
        [
          ["What is one limit of the Gini coefficient?", "基尼系数有什么局限？"],
          ["It measures income, not wealth", "它衡量的是收入，而不是财富"],
          [
            ["It only works for wealthy countries", "它只适用于富裕国家"],
            ["It cannot be calculated for large countries", "大国无法计算它"],
          ],
          [
            '"It measures income, the money people earn each year, and not wealth, the things and money that people own."',
            "基尼系数衡量的是每年的收入，而不是人们拥有的财富。",
          ],
        ],
        [
          ["According to research, what tends to happen in very unequal societies?", "研究表明，在非常不平等的社会里往往会出现什么情况？"],
          ["Trust is lower and health is worse", "信任度更低，健康状况更差"],
          [
            ["Children born poor usually become rich", "出身贫困的孩子通常会变富"],
            ["People trust one another more than elsewhere", "人们比其他地方更信任彼此"],
          ],
          [
            '"Societies with great inequality usually have lower levels of trust, worse health and less social mobility."',
            "非常不平等的社会往往信任度低、健康差，社会流动性也小。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-society-how-a-law-changed-daily-life",
      title: ["How a Law Changed Daily Life", "一部法律如何改变了日常生活"],
      body: `On 29 March 2004, Ireland became the first country in the world to ban smoking inside all workplaces, such as restaurants, offices and pubs, the places where people in Ireland meet to drink.

Not many people believed that it would work. The pub was at the heart of Irish social life, and for generations, a cigarette and a drink had gone together. Owners of pubs warned that customers would stay at home and that thousands of jobs would be lost. Some people in politics predicted that most people would not follow the law, and that the police would not be able to make them.

The government made an argument about health. Studies had shown that people who worked in pubs, breathing the smoke of other people for eight hours a day, had a much higher risk of disease. The minister of health insisted that every worker had the right to breathe clean air, and that this right was more important than the right of customers to smoke.

To the surprise of almost everyone, people followed the law from the first day. Within a year, surveys showed that more than ninety percent of pubs were following the rules. People who smoked adapted by going outside, and many pubs built areas with roofs for them. Public opinion changed considerably: a majority of people, and many people who smoked, came to support the ban.

The effects on health were significant. Studies found that the air in pubs became dramatically cleaner, and that the number of people taken to hospital with heart problems fell in the following years. Furthermore, the number of people who smoke in Ireland declined, in part because it became harder to smoke with friends.

The example of Ireland spread quickly. Within a few years, Norway, Italy, Britain, France and many other countries had introduced similar laws, and today public places without smoke are normal in much of the world.

The story shows how a law can change not only behavior but also social norms. Twenty years later, most young Irish people cannot imagine a pub full of smoke. If someone started smoking in a restaurant today, the other customers would be surprised, just as people in 2003 would have been surprised by the idea of a pub without smoke.`,
      names: ["March", "Ireland", "Irish", "Norway", "Italy", "Britain", "France"],
      glossed: ["pub", "pubs"],
      questions: [
        [
          ["Why did owners of pubs oppose the law?", "酒吧老板为什么反对这项法律？"],
          ["They feared that customers would stay at home", "他们担心顾客会待在家里不来"],
          [
            ["They thought pubs would become too crowded", "他们认为酒吧会变得太拥挤"],
            ["They wanted to ban smoking in offices first", "他们想先在办公室禁烟"],
          ],
          [
            '"Owners of pubs warned that customers would stay at home and that thousands of jobs would be lost."',
            "酒吧老板警告说顾客会待在家里，成千上万的工作岗位会丢失。",
          ],
        ],
        [
          ["What was the main argument of the government?", "政府的主要论点是什么？"],
          ["Every worker had the right to breathe clean air", "每个工作者都有呼吸清洁空气的权利"],
          [
            ["Smoking made pubs too expensive for customers", "吸烟让酒吧对顾客来说太贵了"],
            ["Most customers wanted to stop smoking", "大多数顾客想戒烟"],
          ],
          [
            '"The minister of health insisted that every worker had the right to breathe clean air, and that this right was more important than the right of customers to smoke."',
            "卫生部长坚持认为，工作者呼吸清洁空气的权利比顾客吸烟的权利更重要。",
          ],
        ],
        [
          ["What happened after the law was introduced?", "法律实施后发生了什么？"],
          ["Most pubs followed the rules, and opinion changed", "大多数酒吧遵守规定，舆论也改变了"],
          [
            ["The police could not make people follow it", "警察无法让人们遵守它"],
            ["Thousands of pubs closed within a year", "一年内数千家酒吧关门"],
          ],
          [
            '"Within a year, surveys showed that more than ninety percent of pubs were following the rules... a majority of people, and many people who smoked, came to support the ban."',
            "一年内九成以上的酒吧遵守规定，大多数人（包括许多吸烟者）转而支持禁令。",
          ],
        ],
      ],
    }),
  ],
};
