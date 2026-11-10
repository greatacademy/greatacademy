// The reading unit of the B2 theme Climate and Sustainability: what ice remembers, an island that went carbon
// neutral, nuclear power, farming in heat, a cyclone, fast fashion, drinking the sea and two pictures of 2050.

import { type ReadingUnitDef, t } from "@ga/content";
import { passageMaker } from "../pre-a1/reading-kit.ts";
import { readingWords } from "./reading-words.ts";

const passage = passageMaker(readingWords, [
  "b2-words-climate-change",
  "b2-words-energy",
  "b2-words-ecosystems",
  "b2-words-sustainability",
  "b2-words-farming",
  "b2-words-environmental-action",
  "b2-words-disasters",
  "b2-words-water",
  "b2-words-cause-and-effect",
  "b2-words-the-future",
  "b2-words-materials-2",
  "future-continuous-and-future-perfect",
]);

/** readingClimate is the reading unit of the theme Climate and Sustainability. */
export const readingClimate: ReadingUnitDef = {
  id: "b2-reading-climate",
  title: t("Climate and Sustainability", "气候与可持续发展"),
  passages: [
    passage({
      id: "b2-climate-how-a-glacier-remembers",
      title: ["How a Glacier Remembers", "冰川如何记住过去"],
      body: `Every winter, snow falls on the great areas of ice that lie over Antarctica and Greenland. Because it is so cold there, the snow never melts. Instead, the snow of each year is pushed down by the snow that falls on top of it, and slowly it turns into ice. Over hundreds of thousands of years, the ice has become more than three kilometers thick, and every layer holds a message from the past.

To read that message, scientists cut down into the ice and bring up long pieces of it, known as ice cores: long samples of ice, as thick as an arm. Each sample is like a book of history. Near the top, the layers are thin and easy to count, like the rings of a tree. Lower down, they are pushed together so hard that scientists must use other methods to determine their age. The oldest ice that has been found is about 800,000 years old.

What makes ice cores so valuable is the air inside them. When snow turns into ice, tiny amounts of air are caught in it. That air is a sample of the atmosphere at the time when the snow fell. By measuring the gases in it, scientists can establish how much carbon and methane the atmosphere held thousands of years ago, and they can estimate the temperature of the time from the ice itself.

The results are impressive. For 800,000 years, the amount of carbon in the atmosphere went up and down in slow cycles, as the Earth moved between ice ages and warmer times. It never rose above a certain level. Since the Industrial Revolution, however, when people began burning fossil fuels such as coal and oil, it has risen far above that level, and it is still rising. Ice cores reveal that this increase is unprecedented, both in its size and in its speed.

The samples also demonstrate a close connection between carbon and temperature: when one went up, the other followed. This is one of the clearest pieces of evidence that the greenhouse gases we emit are contributing to the warming of the planet.

Today, the ice itself is at risk. Glaciers in the Alps, the Andes and the Himalayas are losing ice faster than at any time in measured history, and some will have disappeared by 2050. Scientists are therefore hurrying to collect ice cores from mountain glaciers before they melt. They store them in a cave of ice in Antarctica, where they will be safe for future generations of scientists. The memory of the ice, they say, is too important to lose.`,
      grammar: ["future-continuous-and-future-perfect"],
      names: ["Antarctica", "Greenland", "Alps", "Andes", "Himalayas"],
      glossed: ["cores"],
      questions: [
        [
          ["Why is the air inside ice cores so valuable?", "为什么冰芯里的空气如此珍贵？"],
          ["It is a sample of the atmosphere from the time the snow fell", "它是降雪当时大气的样本"],
          [
            ["It shows how thick the ice was thousands of years ago", "它显示了数千年前冰有多厚"],
            ["It contains tiny living organisms from the past", "它含有来自过去的微小生物"],
          ],
          [
            '"That air is a sample of the atmosphere at the time when the snow fell." Measuring its gases shows how much carbon and methane there was.',
            "这些空气是降雪当时大气的样本，测量其中的气体就能知道当时的碳和甲烷含量。",
          ],
        ],
        [
          ["What do ice cores reveal about the carbon in the atmosphere today?", "冰芯揭示了当今大气中的碳有什么特点？"],
          ["Its rise is unprecedented in size and speed", "它的上升在幅度和速度上都是前所未有的"],
          [
            ["It is at the same level as in the last warm period", "它和上一个温暖时期的水平相同"],
            ["It has gone up and down in slow cycles since 1800", "自 1800 年以来它一直在缓慢地循环升降"],
          ],
          [
            '"Ice cores reveal that this increase is unprecedented, both in its size and in its speed." The slow cycles were before the Industrial Revolution.',
            "冰芯显示，这种增长在幅度和速度上都是前所未有的；缓慢的循环发生在工业革命之前。",
          ],
        ],
        [
          ["Why are scientists hurrying to collect ice from mountain glaciers?", "科学家为什么急于采集山地冰川的冰？"],
          ["Some glaciers will have melted by 2050", "到 2050 年一些冰川将已经融化"],
          [
            ["Mountain ice is older than the ice of Antarctica", "山地的冰比南极的冰更古老"],
            ["The cave in Antarctica will soon be full", "南极的冰洞很快就会装满"],
          ],
          [
            'Glaciers are "losing ice faster than at any time in measured history, and some will have disappeared by 2050."',
            "冰川正以有记录以来最快的速度消失，一些冰川到 2050 年将已消失。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-climate-the-island-that-went-carbon-neutral",
      title: ["The Island That Went Carbon Neutral", "实现碳中和的小岛"],
      body: `In 1997, the government of Denmark held a competition. It wanted to find a community that could show the rest of the country how to stop depending on fossil fuels. The winner was Samsø, a small island of about four thousand inhabitants, most of them farmers. At the time, nearly all of its energy came from oil and coal brought in by ship.

The people of the island were not activists. Many of them were uncertain, and some were strongly against the idea. A local teacher, Søren Hermansen, was given the job of persuading them. He did not talk about saving the planet. Instead, he went to every village meeting and talked about money. "If we generate our own energy," he told them, "the money we now pay for oil will stay on the island."

His argument worked. Over the next ten years, the inhabitants built eleven large wind turbines on land and ten more in the sea. Just as important, the turbines were not owned by a company from outside. Farmers and ordinary families bought shares in them, so that whenever there was wind, they earned money. The turbines generated more electricity than the island needed, and the rest was sold to the national grid.

Heating was the next challenge. A number of villages built plants that burn dried grass and other waste from agriculture, to heat water that is sent under the ground to every house. Other families replaced their old oil heating with solar energy, and improved the insulation of their homes to increase their efficiency.

By 2007, Samsø produced more energy from renewable sources than it used, which made it carbon neutral: the carbon it saved by selling clean electricity was greater than the carbon it still emitted. Transport is still the hardest part. Most cars and farm vehicles on the island still run on gasoline and diesel, and the ferry to the rest of Denmark uses a great deal of fuel. The inhabitants have committed themselves to becoming completely free of fossil fuels by 2030.

Today, thousands of visitors come to Samsø every year to learn how it was done. Hermansen believes the lesson is simple. "People will not change because you tell them that the world is ending," he says. "They will change when they can see that it is good for them and for their neighbors." By 2030, if all goes to plan, Samsø will have shown that a whole community can live without fossil fuels.`,
      grammar: ["future-continuous-and-future-perfect"],
      names: ["Samsø", "Denmark", "Søren", "Hermansen"],
      questions: [
        [
          ["How did Søren Hermansen persuade the people of Samsø?", "瑟伦·赫曼森是怎样说服萨姆索岛居民的？"],
          ["He told them that the money for energy would stay on the island", "他告诉他们，花在能源上的钱会留在岛上"],
          [
            ["He warned them about the dangers to the planet", "他提醒他们地球面临的危险"],
            ["He promised that the government would pay for everything", "他承诺政府会承担所有费用"],
          ],
          [
            '"He did not talk about saving the planet. Instead, he... talked about money."',
            "他没有谈拯救地球，而是谈钱：能源自己生产，钱就留在岛上。",
          ],
        ],
        [
          ["Why was it important that families bought shares in the turbines?", "为什么家庭购买风机的股份很重要？"],
          ["They earned money whenever there was wind", "只要有风，他们就能赚钱"],
          [
            ["It was the only way to connect the island to the grid", "这是让岛屿接入电网的唯一办法"],
            ["A company from outside refused to build them", "外地公司拒绝建造风机"],
          ],
          [
            '"Farmers and ordinary families bought shares in them, so that whenever there was wind, they earned money."',
            "农民和普通家庭买了风机的股份，只要有风就能赚钱。",
          ],
        ],
        [
          ["Which part of the plan is still the hardest?", "计划中哪一部分仍然最难？"],
          ["Transport", "交通"],
          [
            ["Heating the homes of the island", "为岛上住房供暖"],
            ["Generating electricity", "发电"],
          ],
          [
            '"Transport is still the hardest part." Most cars and farm vehicles still run on gasoline and diesel.',
            "交通仍然是最难的部分，岛上大多数汽车和农用车辆仍在使用汽油和柴油。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-climate-nuclear-power-friend-or-foe",
      title: ["Nuclear Power: Friend or Foe?", "核能：是友是敌？"],
      body: `Few sources of energy divide people as strongly as nuclear power. For some, it is the cleanest and most reliable way to produce large amounts of electricity; for others, its risks are too great.

The argument for nuclear power begins with the climate. A nuclear reactor does not burn anything, so it emits almost no greenhouse gases while it is working. Over its whole life, with the building of the plant, it is responsible for about as little carbon as wind power. And while wind and solar energy depend on the weather, a reactor generates electricity day and night, in summer and in winter. France, which gets most of its electricity from nuclear power, has some of the cleanest electricity in the world.

Those who support it also point out that nuclear power is far safer than many people believe. Coal, they argue, causes millions of early deaths every year through air pollution, while nuclear power has caused very few. For the amount of electricity it produces, it is one of the safest sources of all.

Those who oppose it reply that when nuclear power goes wrong, the consequences can be catastrophic. In 1986, a reactor caught fire at Chernobyl in Ukraine, spreading dangerous material across much of the continent. Over a hundred thousand people were evacuated, and the area around the plant is still closed today. In 2011, a huge wave caused by an earthquake hit the Fukushima plant in Japan and destroyed the equipment that kept its reactors cool. Although very few people died from the material that got out, more than a hundred thousand people had to leave their homes, and many have never returned.

There is also the problem of waste. Used nuclear fuel is dangerous for thousands of years, and no country has yet opened a permanent place to keep it. Finally, nuclear plants are very expensive and slow to build. A new plant can take fifteen years and cost many billions of dollars, while wind and solar farms can be built in months and are becoming cheaper every year.

After Fukushima, Germany decided to close all its nuclear plants, and it closed the last three in 2023. Some argue that the decision made it burn more coal. Other countries, such as France, have decided to build new reactors.

Whether nuclear power is a friend or an enemy may depend on the question we ask. If the question is how to cut emissions as fast as possible, the arguments for it are strong. If the question is how to produce energy with the smallest risk of disaster, the answer is less clear.`,
      names: ["France", "Chernobyl", "Ukraine", "Fukushima", "Japan", "Germany"],
      questions: [
        [
          ["What advantage does nuclear power have over wind and solar energy?", "与风能和太阳能相比，核能有什么优势？"],
          ["It does not depend on the weather", "它不受天气影响"],
          [
            ["It is cheaper and faster to build", "它的建造更便宜、更快"],
            ["It produces no waste at all", "它完全不产生废料"],
          ],
          [
            '"While wind and solar energy depend on the weather, a reactor generates electricity day and night." Nuclear plants are in fact expensive and slow to build.',
            "风能和太阳能依赖天气，而核反应堆日夜都能发电；核电站其实造价高、建得慢。",
          ],
        ],
        [
          ["What happened after the disaster at Fukushima?", "福岛灾难之后发生了什么？"],
          ["More than a hundred thousand people had to leave their homes", "十多万人不得不离开家园"],
          [
            ["Thousands of people died from the material that got out", "数千人死于泄漏的物质"],
            ["Japan closed all of its nuclear plants for good", "日本永久关闭了所有核电站"],
          ],
          [
            '"Although very few people died from the material that got out, more than a hundred thousand people had to leave their homes." It was Germany that closed its plants.',
            "虽然死于泄漏物质的人很少，但十多万人被迫离家；关闭所有核电站的是德国。",
          ],
        ],
        [
          ["What does the writer conclude?", "作者的结论是什么？"],
          ["The answer depends on the question we ask", "答案取决于我们提出的问题"],
          [
            ["Nuclear power is too dangerous to use", "核能太危险，不能使用"],
            ["Every country should build new reactors", "每个国家都应该建新的反应堆"],
          ],
          [
            '"Whether nuclear power is a friend or an enemy may depend on the question we ask": cutting emissions fast, or the smallest risk of disaster.',
            "核能是友是敌，可能取决于我们问的问题：是尽快减排，还是把灾难风险降到最低。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-climate-farming-in-a-hotter-world",
      title: ["Farming in a Hotter World", "更热世界里的农业"],
      body: `Agriculture has always depended on the weather, but for most of history farmers could at least predict it. They knew when the rains would come, when to plant their crops and when to harvest them. Climate change is making that knowledge less reliable, and the consequences may be felt by everyone who eats.

Heat is the most obvious threat. Most crops grow best between certain temperatures, and when it gets too hot, yields fall. Studies indicate that, without changes in the way we farm, every extra degree of warming could reduce the global harvest of rice by about three percent, and of corn by more than seven. Livestock suffer too: cattle produce less milk in hot weather, which affects dairy farmers.

Water is the second problem. In many regions, rain is becoming less regular: long droughts are followed by heavy rain that falls too quickly for the ground to take in. In the Punjab, in the north of India, farmers have taken so much groundwater for irrigation that the water level is falling by about a meter a year in some places. When the groundwater runs out, the fields that feed millions of people may become barren.

Yet farmers are not just waiting for disaster. Across the world, they are adapting. Grace Wanjiru, who has a small farm in Kenya, used to grow only corn, like her parents. After three bad harvests in five years, she replaced half of it with sorghum and millet, traditional crops that need far less water. "My grandmother grew these," she says. "We forgot about them, but they are stronger than corn in a dry year."

Scientists are helping too. People who breed plants are developing new types of rice that can survive under water for two weeks during floods, and types that can survive great heat. Simple methods can also make a big difference: planting trees between fields protects the ground from erosion, and putting dead plants on the ground keeps the water in.

However, farmers can only adapt so far. If the planet becomes more than two degrees warmer, some regions may become too hot or too dry for agriculture at all, and poorer countries, where agriculture employs a large share of the population, will be hit hardest. The best way to protect our food, most experts agree, is not only to adapt to climate change, but to slow it down. Agriculture is also part of the problem: cattle emit large amounts of methane, and the use of fertilizers and the cutting down of forests for farms produce a large share of global emissions.`,
      names: ["India", "Punjab", "Kenya", "Grace", "Wanjiru"],
      glossed: ["sorghum", "millet"],
      questions: [
        [
          ["What is happening to the groundwater in the Punjab?", "旁遮普的地下水正在发生什么？"],
          ["Its level is falling because so much is used for irrigation", "由于大量用于灌溉，水位正在下降"],
          [
            ["It has been contaminated by fertilizers from the farms", "它被农场的化肥污染了"],
            ["It is rising because of heavy rain after droughts", "由于旱后暴雨，水位正在上升"],
          ],
          [
            'Farmers "have taken so much groundwater for irrigation that the water level is falling by about a meter a year in some places."',
            "农民为灌溉抽取了大量地下水，有些地方的水位每年下降约一米。",
          ],
        ],
        [
          ["Why did Grace Wanjiru start growing sorghum and millet?", "格蕾丝·万吉鲁为什么开始种高粱和小米？"],
          ["They need less water and do better than corn in a dry year", "它们需水更少，干旱年份比玉米长得好"],
          [
            ["They sell for a much higher price than corn at the market", "它们在市场上比玉米卖得贵得多"],
            ["Scientists gave her new types of seeds", "科学家给了她新品种的种子"],
          ],
          [
            'She replaced half of her corn with "traditional crops that need far less water". "They are stronger than corn in a dry year."',
            "她把一半玉米换成了需水少得多的传统作物，它们在干旱年份比玉米更耐旱。",
          ],
        ],
        [
          ["How is agriculture also part of the problem?", "为什么说农业本身也是问题的一部分？"],
          ["Cattle, fertilizers and cutting down forests produce emissions", "牛、化肥和砍伐森林都会产生排放"],
          [
            ["Farmers use too much of the freshwater of cities", "农民用掉了城市太多的淡水"],
            ["New types of rice need far more fertilizer than the old ones", "新品种水稻比老品种需要多得多的化肥"],
          ],
          [
            '"Cattle emit large amounts of methane, and the use of fertilizers and the cutting down of forests for farms produce a large share of global emissions."',
            "牛排放大量甲烷，使用化肥和为农场砍伐森林也产生了全球很大一部分排放。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-climate-the-aftermath-of-a-cyclone",
      title: ["The Aftermath of a Cyclone", "气旋过后"],
      body: `On the night of 14 March 2019, Cyclone Idai hit the coast of Mozambique near the city of Beira. Winds of nearly two hundred kilometers an hour pulled the roofs off houses, brought down power lines and pulled trees out of the ground. Then came the rain. In the following days, rivers rose over their banks, and an area of land larger than a small country disappeared under water.

Fátima Joaquim, a mother of four, spent two days with her children on the roof of a school, waiting for help. "The water rose so fast," she remembers. "We could see people in the trees around us, calling for help. Some of them were still there when the boats came. Some were not."

The cyclone was one of the worst ever recorded in the south of the world. Across Mozambique, Malawi and Zimbabwe, more than a thousand people died, and three million were affected. In Beira, about ninety percent of the city was damaged or destroyed.

The first task in the aftermath of a disaster is to rescue the people who survived and to offer them shelter, food and clean water. Helicopters and boats searched for people cut off by the flooding, and schools and churches became emergency shelters for many thousands. Within weeks, however, a second threat came. With sanitation destroyed and drinking water contaminated, cholera, a disease spread through dirty water, broke out. Thanks to a fast campaign of vaccines, the disease was controlled, but it showed that the casualties of a cyclone do not end when the wind stops.

Building everything again took years. Many families lost not only their homes but also their crops and livestock, which meant losing their income. Charities gave out seeds so that farmers could plant again, and engineers built new roads, bridges and schools to be stronger than before.

Scientists warn that it is difficult to link a single storm to climate change. Nevertheless, they agree that warmer oceans give cyclones more energy, and that higher sea levels make the flooding they cause worse. Storms like Idai will therefore probably become more dangerous.

For Beira, the lesson has been to prepare. The city has improved the way it warns people, so that people can be evacuated before a cyclone arrives, and it has restored wetlands and mangroves, trees that grow in salt water, along the coast, which reduce the force of the waves. "We cannot stop the next cyclone," a city official said. "But we can make sure that not so many people die."`,
      names: ["Mozambique", "Beira", "Idai", "Fátima", "Joaquim", "Malawi", "Zimbabwe"],
      glossed: ["cholera", "mangroves"],
      questions: [
        [
          ["What second threat appeared weeks after the cyclone?", "气旋过后几周出现了什么新威胁？"],
          ["A disease spread through dirty water", "一种通过脏水传播的疾病"],
          [
            ["A second cyclone from the ocean", "来自海上的第二个气旋"],
            ["A lack of seeds for the next harvest", "下一季收成缺少种子"],
          ],
          [
            '"With sanitation destroyed and drinking water contaminated, cholera, a disease spread through dirty water, broke out."',
            "卫生设施被毁、饮用水被污染，通过脏水传播的霍乱暴发了。",
          ],
        ],
        [
          ["Why was losing crops and livestock so serious for many families?", "为什么失去庄稼和牲畜对许多家庭如此严重？"],
          ["It meant losing their income", "这意味着失去了收入"],
          [
            ["It meant they could not get shelter", "这意味着他们得不到住处"],
            ["It meant they had to leave Mozambique", "这意味着他们必须离开莫桑比克"],
          ],
          [
            '"Many families lost not only their homes but also their crops and livestock, which meant losing their income."',
            "许多家庭不仅失去了家，还失去了庄稼和牲畜，也就失去了收入。",
          ],
        ],
        [
          ["How has Beira prepared for the next cyclone?", "贝拉为下一次气旋做了什么准备？"],
          ["It warns people earlier and has restored wetlands on the coast", "更早地发出预警，并恢复了沿海湿地"],
          [
            ["It has built a wall to stop the next cyclone", "修了一道墙来挡住下一次气旋"],
            ["It has moved the whole city further away from the sea", "把整座城市迁到了离海更远的地方"],
          ],
          [
            "The city improved the way it warns people so that they can be evacuated, and restored wetlands and mangroves, which reduce the force of the waves.",
            "这座城市改进了预警方式以便及时疏散，并恢复了湿地和红树林来减弱海浪的力量。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-climate-fast-fashion-and-the-planet",
      title: ["Fast Fashion and the Planet", "快时尚与地球"],
      body: `Twenty years ago, an ordinary clothes shop changed its styles four times a year, once for each season. Today, some fashion brands offer new designs every week, and they sell them at prices so low that a T-shirt can cost less than a sandwich. This way of selling, known as fast fashion, has made clothes cheaper than ever. It has also made them one of the most wasteful products we buy.

Consider the numbers. Between 2000 and 2014, the number of clothes produced in the world roughly doubled, while the average number of times each piece was worn fell by more than a third. Many people now see clothes as disposable: they buy a dress for one party and throw it away after a few washes.

The cost to the environment begins long before the clothes get to the shop. Growing cotton requires huge amounts of water and pesticides; producing a single pair of jeans can use thousands of liters of freshwater. Synthetic fabrics such as polyester are made from crude oil, and every time they are washed, they let out tiny pieces of plastic that end up in rivers and oceans. The chemicals used to color textiles are a major source of water pollution in the countries where clothes are made.

There is a cost to people too. Most fast fashion is produced in factories in Asia, where wages are low and conditions can be dangerous. In 2013, a building called Rana Plaza in Bangladesh, which held a number of clothes factories, fell down, and more than eleven hundred workers died.

And then there is the waste. Only a tiny share of old clothes is recycled into new ones. Much of what people give to charity is sold abroad, and some countries have more than they can use. In Accra, the capital of Ghana, mountains of old clothes from Europe and North America end up in landfills, places where waste is put under the ground, and on beaches.

What can be done? Some brands have launched initiatives to collect old clothes and to use recyclable materials, although some say these plans are small compared with the amount they produce. Some governments are considering regulations that would make companies pay for the waste their clothes create.

Consumers can make a difference too. The simplest thing to do is to buy less and to choose durable clothes that last for years. Buying used clothes, repairing what we have and upcycling old clothes into something new are all ways of saying no to the consumerism that drives fast fashion. As one designer put it, "The most sustainable shirt is the one already in your cupboard."`,
      names: ["Bangladesh", "Rana", "Plaza", "Ghana", "Accra", "Asia", "Europe", "North", "America"],
      questions: [
        [
          ["What happened between 2000 and 2014?", "2000 年到 2014 年之间发生了什么？"],
          ["People bought more clothes but wore each piece less", "人们买的衣服更多，但每件穿得更少"],
          [
            ["Clothes became more durable and lasted longer", "衣服变得更耐穿，用得更久"],
            ["The number of clothes produced fell by a third", "生产的衣服数量下降了三分之一"],
          ],
          [
            "The number of clothes produced roughly doubled, while the number of times each piece was worn fell by more than a third.",
            "生产的衣服数量大约翻了一番，而每件衣服被穿的次数下降了三分之一以上。",
          ],
        ],
        [
          ["How do synthetic fabrics harm rivers and oceans?", "合成面料怎样危害河流和海洋？"],
          ["They let out tiny pieces of plastic when they are washed", "洗涤时会释放微小的塑料碎片"],
          [
            ["They need huge amounts of pesticides to grow", "种植时需要大量农药"],
            ["Factories throw the old fabrics into rivers and the sea", "工厂把旧面料扔进河里和海里"],
          ],
          [
            'Polyester is made from crude oil, and "every time they are washed, they release tiny pieces of plastic". Pesticides are used for cotton.',
            "涤纶由原油制成，每次洗涤都会释放微小的塑料碎片；农药用于种植棉花。",
          ],
        ],
        [
          ["What does the designer's remark suggest?", "那位设计师的话说明了什么？"],
          ["The most sustainable choice is to keep wearing what you have", "最可持续的选择是继续穿已有的衣服"],
          [
            ["Shirts made of recyclable materials are the best", "用可回收材料做的衬衫最好"],
            ["People should give their old clothes to charity", "人们应该把旧衣服捐给慈善机构"],
          ],
          [
            '"The most sustainable shirt is the one already in your cupboard": buy less, and use what you already own.',
            "最可持续的衬衫就是你衣柜里已有的那件：少买，用好已有的。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-climate-can-we-make-seawater-drinkable",
      title: ["Can We Make Seawater Drinkable?", "海水能变成饮用水吗？"],
      body: `About 97 percent of the water on Earth is in the oceans. It is too salty to drink and would destroy crops if it were used for irrigation. Meanwhile, the demand for freshwater is growing, and in many regions, rivers, lakes and groundwater are running low. It is no surprise, therefore, that many countries are asking an old question again, and in a hurry: can we make sea water drinkable?

The answer is yes, and it is already being done in large amounts. The method is called desalination. There are more than fifteen thousand desalination plants in the world, and they produce water for about three hundred million people. Israel, a country that is mostly desert, now gets the majority of its drinking water from the sea. Its plant at Sorek is one of the largest in the world.

There are two important methods. The older one copies nature: sea water is heated until it turns into steam, which leaves the salt behind, and the steam is then made cold again to produce clean water. The more common method today, called reverse osmosis, pushes sea water at high pressure through very fine filters. The filters let water pass through but stop the salt.

If desalination works, why don't all dry countries use it? The first problem is energy. Pushing water through filters requires a great deal of electricity, and if that electricity is generated by burning fossil fuels, desalination contributes to climate change, which in turn worsens droughts. The second problem is cost. Although the price has fallen considerably, water from the sea is still more expensive than water from rivers or reservoirs.

The third problem is what is left behind. For every liter of drinking water, a desalination plant produces more than a liter of brine, water that is about two times as salty as the sea. When it is sent back into the ocean, it can harm the plants and animals near the coast.

Engineers are working on all three problems. New plants increasingly run on solar energy, and better filters require less electricity. Some scientists are trying to derive useful minerals from the brine, so that it becomes a product instead of waste.

Even so, most experts argue that desalination should be the last answer, not the first. Repairing leaks in the water networks of cities, cleaning dirty water so that it can be used again and using less water in agriculture are usually far cheaper ways to alleviate water scarcity. The sea can help us, but only if we stop wasting the freshwater we already have.`,
      names: ["Israel", "Sorek"],
      glossed: ["reverse", "osmosis", "brine"],
      questions: [
        [
          ["How does reverse osmosis work?", "反渗透是怎样工作的？"],
          ["Sea water is pushed through fine filters that stop the salt", "把海水压过能挡住盐分的细密滤膜"],
          [
            ["Sea water is heated until it turns into steam", "把海水加热直到变成蒸汽"],
            ["Salt is taken out by plants that grow in the sea", "用海里生长的植物去除盐分"],
          ],
          [
            'Reverse osmosis "pushes sea water at high pressure through very fine filters". Heating sea water into steam is the older method.',
            "反渗透是用高压把海水压过非常细的滤膜；把海水加热成蒸汽是较老的方法。",
          ],
        ],
        [
          ["Why can desalination contribute to climate change?", "为什么海水淡化可能加剧气候变化？"],
          ["It uses a lot of electricity, often from fossil fuels", "它耗电很多，而电常来自化石燃料"],
          [
            ["The brine it produces releases greenhouse gases", "它产生的浓盐水会释放温室气体"],
            ["It takes water away from rivers and reservoirs", "它从河流和水库里抽走了水"],
          ],
          [
            'It "requires a great deal of electricity, and if that electricity is generated by burning fossil fuels, desalination contributes to climate change."',
            "它需要大量电力，如果电力来自燃烧化石燃料，海水淡化就会加剧气候变化。",
          ],
        ],
        [
          ["What do most experts think about desalination?", "大多数专家怎么看海水淡化？"],
          ["It should be the last answer, after cheaper ways of saving water", "它应该是最后的办法，先用更便宜的节水方式"],
          [
            ["It should replace all other sources of water", "它应该取代所有其他水源"],
            ["It harms the coast too much and should be stopped soon", "它对海岸危害太大，应该尽快停止"],
          ],
          [
            '"Most experts argue that desalination should be the last answer, not the first." Repairing leaks and reusing water are far cheaper.',
            "大多数专家认为海水淡化应是最后而不是首选的办法，修漏和循环用水便宜得多。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-climate-what-2050-might-look-like",
      title: ["What 2050 Might Look Like", "2050 年可能的样子"],
      body: `It is 2050, and Lena, a nurse in Lisbon, is going to work. What will her day look like? Nobody can know for sure. Scientists do not predict the future; they build scenarios that describe what might happen, depending on the decisions we make now. Two of these scenarios show how different her world could be.

In the first scenario, the world has kept its pledges. Governments have imposed a price on carbon, and fossil fuels have become expensive. By 2050, most countries will have arrived at net zero, meaning that they take as much carbon out of the atmosphere as they emit. Lena will be riding to work on an electric bus, through streets with more trees and less traffic. The electricity in her apartment will come from wind turbines and solar farms, and her building will have such good insulation that it hardly needs heating.

Even in this scenario, the planet will already be about one and a half degrees warmer, and some changes, such as the melting of glaciers and the rise of the sea, will be irreversible. Summers in Lisbon will be hotter, and heat waves will be more common. But the worst consequences will have been avoided.

In the second scenario, emissions have kept growing. By 2050, the planet will be more than two degrees warmer, and the outlook for the rest of the century will be much worse. In this world, Lena will be working in a hospital full of elderly patients suffering from the heat. Droughts will have reduced the harvests of the south of Europe, and food prices will be high. Some towns on the coast will be preparing to evacuate, and millions of people around the world will be leaving regions where it has become too hot or too dry to live.

Which of these two worlds will Lena be living in? It depends largely on decisions made in the next ten or twenty years. The technology for the first scenario is already here: solar and wind power are now the cheapest sources of electricity in most of the world. What is missing, many experts argue, is the will of leaders.

There are reasons for hope. In 2015, almost every country signed the Paris Agreement, committing to keep warming well below two degrees, and the projected warming for 2100 has fallen since then.

The year 2050 may seem a long way off. But a child born today will be an adult by then, and the houses, power plants and roads that we build this decade will still be in use. The future is not something that will happen to us. It is something we are building now.`,
      grammar: ["future-continuous-and-future-perfect"],
      names: ["Lena", "Lisbon", "Paris", "Europe"],
      glossed: ["net"],
      questions: [
        [
          ["Why do scientists build scenarios instead of predicting the future?", "科学家为什么构建情景而不是预测未来？"],
          ["The future depends on the decisions we make now", "未来取决于我们现在做出的决定"],
          [
            ["Their computers are not yet strong enough", "他们的计算机还不够强大"],
            ["Governments have asked them not to predict", "政府要求他们不要预测"],
          ],
          [
            '"Scientists do not predict the future; they build scenarios that describe what might happen, depending on the decisions we make now."',
            "科学家不预测未来，而是根据我们现在的决定构建可能发生的情景。",
          ],
        ],
        [
          ["In the first scenario, what will still have happened by 2050?", "在第一种情景中，到 2050 年什么仍将已经发生？"],
          ["Some changes, like the melting of glaciers, will be irreversible", "冰川融化等一些变化将无法逆转"],
          [
            ["Food prices in Europe will be very high", "欧洲的食品价格会很高"],
            ["Millions of people will be leaving regions that are too hot", "数百万人将离开过热的地区"],
          ],
          [
            'Even in this scenario, the planet will be about one and a half degrees warmer, and some changes "will be irreversible". High prices and people leaving belong to the second scenario.',
            "即使在这一情景中，地球也会升温约 1.5 度，一些变化不可逆转；高物价和人口迁离属于第二种情景。",
          ],
        ],
        [
          ["What does the writer say is missing?", "作者认为缺少的是什么？"],
          ["The will of leaders to act", "领导者采取行动的意愿"],
          [
            ["The technology to produce clean energy", "生产清洁能源的技术"],
            ["Cheap sources of electricity", "廉价的电力来源"],
          ],
          [
            '"The technology for the first scenario is already here... What is missing, many experts argue, is the will of leaders."',
            "实现第一种情景的技术已经存在，许多专家认为缺少的是领导者的意愿。",
          ],
        ],
      ],
    }),
  ],
};
