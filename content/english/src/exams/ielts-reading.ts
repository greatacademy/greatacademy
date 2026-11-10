// The reading unit of IELTS: six academic passages of about 400 to 500 words in the words of B2 and below, with
// questions in the formats of IELTS Academic Reading. Every text is written for this course.

import { type ReadingUnitDef, t } from "@ga/content";
import { readingWords } from "../levels/b2/reading-words.ts";
import { passageMaker } from "../levels/pre-a1/reading-kit.ts";

const passage = passageMaker(readingWords, []);

/** ieltsReading is the reading unit of the IELTS course. */
export const ieltsReading: ReadingUnitDef = {
  id: "ielts-reading",
  title: t("IELTS Academic Reading", "雅思学术阅读"),
  passages: [
    passage({
      id: "ielts-reading-a-short-history-of-glass",
      title: ["A Short History of Glass", "玻璃简史"],
      body: `Glass is so common today that we hardly ever think about it. We drink from it, look through it and carry it in our pockets in the screens of our phones. Yet for most of history, glass was a scarce and expensive material, and the story of how it became ordinary is a story of patient experiment.

The first glass was probably made by accident. When sand is heated to a very high temperature together with certain minerals, it melts and becomes a clear liquid, which turns hard as it gets cool. Small pieces of glass have been found where ancient fires had burned, and experts believe that people first saw it there. More than four thousand years ago, workers in Mesopotamia were making small glass balls, which were worn by the rich and were worth as much as gold.

For the next two thousand years, glass stayed expensive because it was so difficult to shape. It was pushed around a piece of soft earth or poured into a shape, and the work was slow. Everything changed about two thousand years ago, when workers in the east of the Mediterranean discovered that they could breathe air into hot glass through a long, empty piece of metal. This new technique allowed a worker to produce a thin, light bottle in minutes instead of days. Within a few decades, glass cups and bottles were being used in ordinary homes across the Roman Empire.

Windows came much later. Roman glass was not clear enough to see through easily, and for many centuries even wealthy families used thin material or wooden boards in their windows. Large, even pieces of clear glass were very hard to make, and in the Middle Ages they were used mainly in churches, where windows of red, blue and gold told stories from the past to people who could not read.

The modern era of glass began in 1959, when an English engineer, Alastair Pilkington, introduced a new technique. Hot glass was poured onto a pool of liquid metal, where it spread out and became completely even. This technique made large, clear windows cheap enough for every building, and it is still used to produce most of the window glass in the world today.

Glass is now being asked to do more than ever. Some new types change color in strong light to keep a building cool, while others are so strong that they can be used for floors and bridges. Glass lines, thinner than a hair, carry internet signals across oceans. A material that was once worn only by rulers has become an essential part of modern life.`,
      grammar: ["ielts-true-false-not-given", "ielts-matching-headings"],
      names: ["Mesopotamia", "Mediterranean", "Roman", "Alastair", "Pilkington"],
      questions: [
        [
          [
            "True, False or Not given? The first glass was probably made on purpose.",
            "判断（True / False / Not given）：最早的玻璃可能是有意制造的。",
          ],
          ["False", "False（错误）"],
          [
            ["True", "True（正确）"],
            ["Not given", "Not given（未提及）"],
          ],
          ['False: "The first glass was probably made by accident."', "False：原文说“最早的玻璃可能是偶然制成的”。"],
        ],
        [
          [
            "True, False or Not given? Glass blowing made bottles much quicker to produce.",
            "判断（True / False / Not given）：吹制玻璃使瓶子的生产快了很多。",
          ],
          ["True", "True（正确）"],
          [
            ["False", "False（错误）"],
            ["Not given", "Not given（未提及）"],
          ],
          [
            'True: it "allowed a worker to produce a thin, light bottle in minutes instead of days."',
            "True：这种技术让工人“几分钟而不是几天”就能做出又薄又轻的瓶子。",
          ],
        ],
        [
          [
            "True, False or Not given? Roman glass was used mainly for windows.",
            "判断（True / False / Not given）：罗马玻璃主要用于窗户。",
          ],
          ["False", "False（错误）"],
          [
            ["True", "True（正确）"],
            ["Not given", "Not given（未提及）"],
          ],
          [
            'False: Roman glass "was not clear enough to see through easily", and windows "came much later"; cups and bottles were used in homes.',
            "False：罗马玻璃“不够透明，不容易看透”，窗户“出现得晚得多”，家里用的是杯子和瓶子。",
          ],
        ],
        [
          [
            "True, False or Not given? Pilkington's technique made him a wealthy man.",
            "判断（True / False / Not given）：皮尔金顿的技术使他成了富人。",
          ],
          ["Not given", "Not given（未提及）"],
          [
            ["True", "True（正确）"],
            ["False", "False（错误）"],
          ],
          [
            "Not given: the text says what the technique did, but nothing about Pilkington's money.",
            "Not given：原文说了这项技术的作用，却没有提到皮尔金顿的财富。",
          ],
        ],
        [
          [
            'Which heading best fits the paragraph that begins "Windows came much later"?',
            "哪个标题最适合以“Windows came much later”开头的段落？",
          ],
          ["Clear windows: a late and costly development", "透明窗户：出现晚且昂贵"],
          [
            ["How churches taught people to read", "教堂如何教人们识字"],
            ["The invention of glass blowing", "吹制玻璃的发明"],
          ],
          [
            "The paragraph explains why clear window glass was rare for centuries. Churches are only one detail, and glass blowing belongs to the paragraph before.",
            "这一段解释透明窗玻璃为什么几百年来都很稀少。教堂只是一个细节，吹制玻璃属于上一段。",
          ],
        ],
      ],
    }),
    passage({
      id: "ielts-reading-how-honeybees-choose-a-home",
      title: ["How Honeybees Choose a Home", "蜜蜂如何选择新家"],
      body: `Every spring, a healthy colony of honeybees must make a difficult decision. As the colony grows too large for its hive, the box or space where it lives, the old queen leaves with about half of the workers, perhaps ten thousand bees, to start a new home. For a few days, this swarm, as the flying group is called, waits on the branch of a tree while it decides where to live. The decision is a matter of life and death: a home that is too small, too wet or too open to the wind will not allow the colony to survive the winter.

Strange though it may seem, the queen plays no part in the decision. Instead, it is made by a few hundred older workers known as scouts, bees whose job is to search. They fly out in all directions to look for possible homes, usually an empty space inside a tree. When a scout finds a promising space, she examines it carefully, walking around inside to judge its size and checking how high it is above the ground and how small its entrance is.

On her return, the scout reports what she has found by performing a dance on the surface of the swarm. The direction of the dance shows the direction of the space, and how long it goes on shows the distance. Most important of all, the number of times she repeats the dance depends on the quality of the home. A scout who has found a very good home dances with great energy, while one who has found a poor space dances only for a short time.

Other scouts who watch the dances fly out to look at each space for themselves, and if they like them, they return and dance too. As a result, support for good homes grows quickly, while support for poor ones dies away. The scouts do not need to judge one space against another; the better ones just draw more and more bees to dance for them.

The final stage was discovered by the scientist Thomas Seeley, who spent many years watching swarms. He found that the bees do not wait for every scout to agree. Instead, when about fifteen scouts are at the same space at the same moment, they know that a decision has been made. They return to the swarm and produce a special sound that tells the other bees to warm their muscles for flight. Within an hour, the whole swarm takes off and flies to its new home.

Seeley argues that groups of people could learn from the bees. The scouts begin with no shared view, every space is examined by many bees on their own, and no single bee can control the result. In experiments, swarms chose the best of a number of boxes offered to them nearly every time. Some people who have read his work now try to run a meeting in a similar way, asking each person to explore every possible answer alone before the group discusses them.`,
      grammar: ["ielts-true-false-not-given", "ielts-matching-headings"],
      names: ["Thomas", "Seeley"],
      glossed: ["honeybees", "hive", "queen", "swarm", "swarms", "scout", "scouts"],
      questions: [
        [
          [
            "True, False or Not given? The queen decides where the swarm will live.",
            "判断（True / False / Not given）：蜂王决定蜂群住在哪里。",
          ],
          ["False", "False（错误）"],
          [
            ["True", "True（正确）"],
            ["Not given", "Not given（未提及）"],
          ],
          ['False: "the queen plays no part in the decision."', "False：原文说“蜂王在决定中不起任何作用”。"],
        ],
        [
          [
            "True, False or Not given? A scout dances for longer when she has found a better home.",
            "判断（True / False / Not given）：侦察蜂找到更好的家时跳舞时间更长。",
          ],
          ["True", "True（正确）"],
          [
            ["False", "False（错误）"],
            ["Not given", "Not given（未提及）"],
          ],
          [
            'True: "the number of times she repeats the dance depends on the quality of the home."',
            "True：原文说她重复舞蹈的次数“取决于新家的质量”。",
          ],
        ],
        [
          [
            "True, False or Not given? Scouts usually find their new home within a single day.",
            "判断（True / False / Not given）：侦察蜂通常在一天之内找到新家。",
          ],
          ["Not given", "Not given（未提及）"],
          [
            ["True", "True（正确）"],
            ["False", "False（错误）"],
          ],
          [
            'Not given: the swarm waits "for a few days", but the text does not say how long the scouts take to find a home.',
            "Not given：原文说蜂群等待“几天”，但没有说侦察蜂找到新家要多久。",
          ],
        ],
        [
          ["What tells the scouts that a decision has been made?", "什么让侦察蜂知道决定已经做出？"],
          ["About fifteen of them are at the same space at once", "约十五只侦察蜂同时出现在同一个地方"],
          [
            ["Every scout has danced for the same space", "每只侦察蜂都为同一个地方跳过舞"],
            ["The queen produces a special sound", "蜂王发出一种特殊的声音"],
          ],
          [
            '"When about fifteen scouts are at the same space at the same moment, they know that a decision has been made." The bees do not wait for every scout to agree, and the scouts, not the queen, make the sound.',
            "原文说约十五只侦察蜂同时在同一个地方时，它们就知道决定已经做出。蜜蜂不会等所有侦察蜂都同意，发出声音的也是侦察蜂而不是蜂王。",
          ],
        ],
      ],
    }),
    passage({
      id: "ielts-reading-why-we-sleep",
      title: ["Why We Sleep", "我们为什么睡觉"],
      body: `Every animal that has been studied sleeps, or at least rests in a way that looks very much like sleep. Some dolphins sleep with one half of the brain at a time, so that they can keep swimming and breathing. Yet sleep is also dangerous: a sleeping animal cannot watch for enemies or look for food. That it has survived in so many species suggests that it must do something very important. For a long time, however, scientists could not agree on what that was.

One early theory held that sleep just saves energy. A sleeping body uses a little less energy than one that is not sleeping, but the saving is small, about the energy in a slice of bread. This seems too little to explain why we spend a third of our lives sleeping.

A second theory, now accepted by most experts, is that sleep helps the brain to store memories. In a number of experiments, people who learned a list of words or a new skill in the evening performed better the next morning if they had slept than if they had not slept. Records of the brain show that during the heaviest sleep, the work of learning is repeated, as if the brain were practicing what it had learned during the day.

More recently, scientists have discovered another possible role for sleep. In 2013 a team led by Maiken Nedergaard reported that, in mice, the space between brain cells became much larger during sleep. This allowed liquid to move through the brain more quickly and wash away waste that builds up during the day. Some of this waste has been connected to diseases of memory in old age, although it has not yet been proved that poor sleep leads to such diseases in people.

No matter what the reasons for sleep are, the results of too little sleep are clear. After a single night without sleep, people respond more slowly, make more mistakes and find it harder to control their emotions. Drivers who have slept for less than five hours have a much higher risk of an accident than those who have slept for seven. Over months and years, lack of sleep has been connected to weight problems, heart disease and depression.

Despite this, many people see sleep as a luxury. Long working hours, bright screens late at night and the habit of checking messages in bed all reduce the time we sleep. Doctors advise that adults need between seven and nine hours a night, and teenagers more. Getting enough sleep, they argue, is not a waste of time but one of the best things we can do for our health.`,
      grammar: ["ielts-true-false-not-given", "ielts-matching-headings"],
      names: ["Maiken", "Nedergaard"],
      questions: [
        [
          ["True, False or Not given? Sleep saves a large amount of energy.", "判断（True / False / Not given）：睡眠能节省大量能量。"],
          ["False", "False（错误）"],
          [
            ["True", "True（正确）"],
            ["Not given", "Not given（未提及）"],
          ],
          [
            'False: "the saving is small, about the energy in a slice of bread."',
            "False：原文说节省的能量“很少，大约相当于一片面包的能量”。",
          ],
        ],
        [
          [
            "True, False or Not given? People remembered new skills better after a night's sleep.",
            "判断（True / False / Not given）：睡了一夜之后，人们对新技能记得更好。",
          ],
          ["True", "True（正确）"],
          [
            ["False", "False（错误）"],
            ["Not given", "Not given（未提及）"],
          ],
          [
            'True: they "performed better the next morning if they had slept than if they had not slept."',
            "True：原文说他们如果睡过觉，第二天早上表现得更好。",
          ],
        ],
        [
          [
            "True, False or Not given? Poor sleep has been proved to cause diseases of memory in people.",
            "判断（True / False / Not given）：已经证明睡眠不好会导致人的记忆疾病。",
          ],
          ["False", "False（错误）"],
          [
            ["True", "True（正确）"],
            ["Not given", "Not given（未提及）"],
          ],
          [
            'False: "it has not yet been proved that poor sleep leads to such diseases in people."',
            "False：原文说“尚未证明”睡眠不好会导致人患这类疾病。",
          ],
        ],
        [
          [
            "True, False or Not given? Teenagers need less sleep than adults.",
            "判断（True / False / Not given）：青少年需要的睡眠比成年人少。",
          ],
          ["False", "False（错误）"],
          [
            ["True", "True（正确）"],
            ["Not given", "Not given（未提及）"],
          ],
          ['False: adults need seven to nine hours, "and teenagers more."', "False：成年人需要七到九小时，“青少年需要更多”。"],
        ],
      ],
    }),
    passage({
      id: "ielts-reading-cities-that-make-their-own-weather",
      title: ["Cities That Make Their Own Weather", "自己制造天气的城市"],
      body: `On a summer evening, the center of a large city can be a few degrees warmer than the country around it. This difference, known as the urban heat island, was first described in the early nineteenth century by Luke Howard, a scientist who studied the weather in his free time and recorded temperatures in and around London. Today, with more than half of the people in the world living in cities, it has become a serious worry.

The reasons are well understood. Roads, roofs and walls made of dark materials take in the heat of the sun during the day and give it out slowly at night, which is why the difference between the city and the country is usually greatest after the sun goes down. Cities also have far less green space than the country. Plants cool the air around them by losing water from their leaves, so replacing fields with concrete takes away a natural way to make the air cooler. Finally, cars, factories and machines that cool homes all produce heat of their own.

The results can be serious. During heat waves, high temperatures at night prevent the body from recovering, and elderly people and those with heart problems are at special risk. In the European heat wave of 2003, thousands of deaths were connected to the high temperatures, many of them in cities. Heat islands also increase the demand for electricity, as people use more machines to cool their homes, which in turn produces more heat and more pollution.

Cities are now trying a number of answers. One of the simplest is to paint roofs white or light gray so that they reflect the light of the sun instead of taking it in. In some cities, this has reduced the temperature inside a building by a few degrees. Another approach is to plant trees along streets and create parks, which give shelter from the sun and make the air cooler. Some cities have done more, putting plants on roofs and building walls on which gardens grow.

These measures do not work as well in every place. White roofs work best in places with strong sun, while trees need water, which may be scarce in hot, dry areas. Designers of cities also warn that the benefits of a single park may be felt only in the streets close to it. For this reason, many experts argue that making a city cooler needs many small parks across it instead of one large one.

As the climate gets warmer, the heat island will make the hottest days in cities even more dangerous. Yet it is also one of the few parts of climate change that cities can control themselves, since it comes from how they are designed and built.`,
      grammar: ["ielts-true-false-not-given", "ielts-matching-headings"],
      names: ["Luke", "Howard", "London", "European"],
      questions: [
        [
          [
            "True, False or Not given? The difference in temperature between a city and the country is usually greatest at night.",
            "判断（True / False / Not given）：城市与乡村的温差通常在夜间最大。",
          ],
          ["True", "True（正确）"],
          [
            ["False", "False（错误）"],
            ["Not given", "Not given（未提及）"],
          ],
          ['True: it "is usually greatest after the sun goes down."', "True：原文说温差“通常在日落之后最大”。"],
        ],
        [
          [
            "True, False or Not given? Luke Howard was a professional weather scientist.",
            "判断（True / False / Not given）：卢克·霍华德是一位职业气象学家。",
          ],
          ["False", "False（错误）"],
          [
            ["True", "True（正确）"],
            ["Not given", "Not given（未提及）"],
          ],
          ['False: he was "a scientist who studied the weather in his free time."', "False：原文说他是“在业余时间研究天气的科学家”。"],
        ],
        [
          ["According to the passage, why are many small parks better than one large park?", "根据文章，为什么许多小公园比一个大公园好？"],
          ["A park cools mainly the streets close to it", "公园主要使附近的街道降温"],
          [
            ["Small parks need less water", "小公园需要的水更少"],
            ["Large parks are too expensive to build", "大公园建造成本太高"],
          ],
          [
            '"The benefits of a single park may be felt only in the streets close to it." The passage says nothing about the water or the cost of parks of different sizes.',
            "原文说一个公园的好处可能只在附近的街道感受得到；文章没有提到不同大小公园的用水或成本。",
          ],
        ],
        [
          [
            "True, False or Not given? White roofs work well in every climate.",
            "判断（True / False / Not given）：白色屋顶在任何气候下都很有效。",
          ],
          ["False", "False（错误）"],
          [
            ["True", "True（正确）"],
            ["Not given", "Not given（未提及）"],
          ],
          [
            'False: "White roofs work best in places with strong sun", and the measures "do not work as well in every place."',
            "False：原文说白色屋顶“在阳光强烈的地方效果最好”，这些措施“并非在每个地方都同样有效”。",
          ],
        ],
      ],
    }),
    passage({
      id: "ielts-reading-the-last-speakers",
      title: ["The Last Speakers", "最后的说话人"],
      body: `Of the roughly seven thousand languages spoken in the world today, about half are expected to disappear by the end of this century. Many are spoken by only a few hundred people, most of them elderly, and some have only one speaker left. When that person dies, a whole way of describing the world dies too.

Languages have always disappeared, but the speed of the loss today is new. The biggest reason is not violence but economic change. When people move from villages to cities, or when an area becomes part of a larger national economy, parents often decide that their children will have better jobs if they speak the language of the majority. Over two or three generations, the local language is used less and less, first in schools and workplaces and finally even at home. Children may understand their grandparents but answer them in another language.

Why should this matter? Some people argue that a smaller number of languages would make it easier for people to understand each other and that the loss is a natural result of progress. Experts on language, however, point out that each language holds knowledge that cannot be found in any other place. Many languages of the Pacific, for example, have precise words for winds, the way the sea moves and stars that helped people at sea to find their way across the ocean. Others hold names for hundreds of plants and their uses as medicine. When a language disappears before it is recorded, this knowledge may be lost for ever.

There is also a personal cost. For many communities, language is close to the heart of identity, and its loss can leave young people feeling cut off from their history. Studies in Canada have found that young people in communities that have kept their language are often healthier and happier than those in similar communities that have lost it, although the reasons for this connection are not simple.

Yet decline is not always permanent. Hebrew, which had not been spoken in ordinary life for many centuries, was brought back to life in the late nineteenth and early twentieth centuries and now has millions of speakers. In New Zealand, Maori was spoken by very few children in the years around 1975. Since then, schools in which young children are taught only in Maori have helped the number of young speakers to grow again, and the language is now heard on radio and television.

Technology may also help. Scientists now use cheap digital devices and smartphones to record speakers, and some communities have created apps and online dictionaries to teach their languages. Nothing of this kind can replace a family in which a language is spoken every day, but it may give endangered languages a better future than ever before.`,
      grammar: ["ielts-true-false-not-given", "ielts-matching-headings"],
      names: ["Pacific", "Canada", "Hebrew", "New", "Zealand", "Maori"],
      questions: [
        [
          ["What is the main reason why languages disappear today, according to the passage?", "根据文章，当今语言消失的主要原因是什么？"],
          ["Economic change leads parents to choose the majority language", "经济变化促使父母选择多数人的语言"],
          [
            ["Wars destroy the communities that speak them", "战争摧毁了说这些语言的群体"],
            ["Schools forbid children to speak them", "学校禁止孩子说这些语言"],
          ],
          [
            '"The biggest reason is not violence but economic change": parents decide that their children will have better jobs if they speak the language of the majority.',
            "原文说最大的原因“不是暴力，而是经济变化”：父母认为孩子说多数人的语言能找到更好的工作。",
          ],
        ],
        [
          [
            "True, False or Not given? Some languages of the Pacific contain knowledge that helped people to cross the ocean.",
            "判断（True / False / Not given）：太平洋地区的一些语言包含帮助人们横渡大洋的知识。",
          ],
          ["True", "True（正确）"],
          [
            ["False", "False（错误）"],
            ["Not given", "Not given（未提及）"],
          ],
          [
            'True: they "have precise words for winds, the way the sea moves and stars that helped people at sea to find their way across the ocean."',
            "True：这些语言有描述风、海流和星星的精确词语，帮助航海者横渡大洋。",
          ],
        ],
        [
          [
            "True, False or Not given? Hebrew was never spoken as an everyday language in the past.",
            "判断（True / False / Not given）：希伯来语过去从未作为日常语言使用。",
          ],
          ["False", "False（错误）"],
          [
            ["True", "True（正确）"],
            ["Not given", "Not given（未提及）"],
          ],
          [
            'False: it "had not been spoken in ordinary life for many centuries", so it had been spoken before.',
            "False：原文说它“已经好几个世纪没有在日常生活中使用”，说明它以前曾被使用过。",
          ],
        ],
        [
          [
            "True, False or Not given? Online dictionaries can fully replace a family that speaks a language.",
            "判断（True / False / Not given）：网上词典可以完全取代说某种语言的家庭。",
          ],
          ["False", "False（错误）"],
          [
            ["True", "True（正确）"],
            ["Not given", "Not given（未提及）"],
          ],
          [
            'False: "Nothing of this kind can replace a family in which a language is spoken every day."',
            "False：原文说“这类东西都无法取代每天说这种语言的家庭”。",
          ],
        ],
      ],
    }),
    passage({
      id: "ielts-reading-paying-for-museums",
      title: ["Paying for Museums", "博物馆该不该收费"],
      body: `In 2001 the British government made admission to the major national museums of the country free. The results were quick and dramatic. Within a year, the number of visitors to the museums that had charged before rose by around seventy percent, and some museums saw their visitor numbers double. Those in favor of the policy argued that it had opened the art and history of the nation to everyone.

The argument for free admission rests on the idea that museums are owned by the public. The things they show have often been paid for by taxes, and many of them were given to the nation by private people who expected that everyone would be able to see them. Charging for admission, people in favor say, keeps out those who cannot afford it, especially families with three or four children. Free museums are also a valuable resource for schools, which can bring classes without having to collect money from parents.

However, others doubt whether free admission really changed who visits museums. Studies after 2001 found that most of the extra visits were made by people who already visited museums, such as adults with a university education, who just came more often. The share of visitors from poorer homes rose only slightly. Price, these people argue, is only one barrier; many people do not visit museums because they feel that such places are not meant for them.

There is also the question of money. Museums that do not charge must rely on government funding, gifts and income from shops and restaurants. When public funding has been reduced, some free museums have had to cut staff, close rooms on certain days or offer less to see. In some countries, museums charge visitors from abroad while keeping admission free for local residents, an answer that raises money from tourists without keeping out the local public.

Many museum directors believe that the best approach mixes free admission with active efforts to draw new visitors. Some museums organize evening events with music and food for young adults, while others work with community groups to create exhibitions about local history. These events cost money, but they deal with the reasons for staying away that free admission alone cannot change.

The debate is not expected to end soon. What is clear is that free admission has made museums busier. Whether it has made them fairer depends on what else museums do to welcome people who have never walked through their doors.`,
      grammar: ["ielts-true-false-not-given", "ielts-matching-headings"],
      names: ["British"],
      questions: [
        [
          [
            "True, False or Not given? Visitor numbers rose quickly after admission became free.",
            "判断（True / False / Not given）：免费开放后，参观人数迅速上升。",
          ],
          ["True", "True（正确）"],
          [
            ["False", "False（错误）"],
            ["Not given", "Not given（未提及）"],
          ],
          [
            'True: "The results were quick and dramatic": within a year, visits rose by around seventy percent.',
            "True：原文说结果“迅速而显著”：一年之内参观人数增加了约百分之七十。",
          ],
        ],
        [
          [
            "True, False or Not given? Free admission greatly increased the share of poorer visitors.",
            "判断（True / False / Not given）：免费开放大大提高了较贫困参观者的比例。",
          ],
          ["False", "False（错误）"],
          [
            ["True", "True（正确）"],
            ["Not given", "Not given（未提及）"],
          ],
          ['False: "The share of visitors from poorer homes rose only slightly."', "False：原文说来自较贫困家庭的参观者比例“只略有上升”。"],
        ],
        [
          [
            "True, False or Not given? Most foreign tourists are happy to pay for admission.",
            "判断（True / False / Not given）：大多数外国游客乐意付门票钱。",
          ],
          ["Not given", "Not given（未提及）"],
          [
            ["True", "True（正确）"],
            ["False", "False（错误）"],
          ],
          [
            "Not given: some museums charge visitors from abroad, but the passage says nothing about how those visitors feel.",
            "Not given：有些博物馆向外国游客收费，但文章没有说这些游客怎么想。",
          ],
        ],
        [
          [
            "Does this agree with the writer's views? Free admission alone is enough to bring new kinds of visitors to museums.",
            "这与作者的观点一致吗？仅靠免费开放就足以吸引新类型的参观者。",
          ],
          ["No", "No（否）"],
          [
            ["Yes", "Yes（是）"],
            ["Not given", "Not given（未提及）"],
          ],
          [
            'No: the writer says museums must also do more, since events "deal with the reasons for staying away that free admission alone cannot change."',
            "No：作者认为博物馆还必须做更多，因为这些活动解决的是“仅靠免费开放无法改变的不来参观的原因”。",
          ],
        ],
      ],
    }),
  ],
};
