// Grade 6: the reading unit of the eighth theme, how the world grows, shares and wastes its food, with passages that
// argue a case beside passages that explain.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grade-5/reading-kit.ts";

const nutritionWords = { topic: "words-of-nutrition", weight: 0.3 } as const;
const farmingWords = { topic: "words-of-modern-farming", weight: 0.3 } as const;
const hungerWords = { topic: "words-of-hunger-and-plenty", weight: 0.3 } as const;
const argument = { topic: "tracing-an-argument", weight: 0.2 } as const;
const pointOfView = { topic: "inferring-an-authors-point-of-view", weight: 0.2 } as const;
const academic1 = { topic: "academic-words-1", weight: 0.1 } as const;
const academic2 = { topic: "academic-words-2", weight: 0.1 } as const;

/** feedingTheWorld is a reading unit of grade 6 on food, farming and hunger. */
export const feedingTheWorld: ReadingUnitDef = {
  id: "feeding-the-world",
  title: t("Feeding the World", "养活世界"),
  passages: [
    passage(
      "what-is-in-your-lunch",
      t("What Is in Your Lunch?", "你的午餐里有什么？"),
      `Open your lunch box and look inside. You might see a sandwich, an apple, a carton of milk and perhaps a cookie. Each of these foods gives your body something different, and together they make up part of your diet, which simply means the food you usually eat.

Scientists sort the substances in food into groups called nutrients. Carbohydrates, found in bread, rice, pasta and fruit, are the body's main source of energy. The amount of energy a food provides is measured in calories. An active twelve-year-old needs roughly two thousand calories a day, although the exact number depends on the person.

Proteins, found in meat, fish, eggs, beans and milk, are the building materials of the body. They help you grow and repair muscles, skin and other tissues. Fats, found in oils, nuts and butter, store energy and help the body take in certain vitamins. A small amount of fat is necessary, but too much can harm the heart.

Vitamins and minerals are needed only in tiny amounts, but the body cannot work without them. Vitamin C, found in oranges and peppers, helps heal cuts. Calcium, a mineral found in milk and green vegetables, builds strong bones. Fiber, found in whole grains, fruit and vegetables, is not digested at all, yet it keeps the digestive system working smoothly.

No single food contains everything the body needs. That is why doctors recommend eating a wide variety of foods, with plenty of vegetables and fruit, and limiting foods with a lot of added sugar or sodium, the main part of salt. A nutritious lunch is not about one perfect food. It is about balance.`,
      [nutritionWords, pointOfView, academic1],
      [
        ask(
          t("What is the main job of carbohydrates?", "碳水化合物的主要作用是什么？"),
          t("To give the body energy", "为身体提供能量"),
          [
            t("To build strong bones", "强健骨骼"),
            t("To repair muscles and skin", "修复肌肉和皮肤"),
            t("To help heal cuts", "帮助伤口愈合"),
          ],
          t("The second paragraph says carbohydrates are the body's main source of energy.", "第二段说，碳水化合物是身体的主要能量来源。"),
          [
            t("Building strong bones is calcium's job.", "强健骨骼是钙的作用。"),
            t("Repairing muscles and skin is what proteins do.", "修复肌肉和皮肤是蛋白质的作用。"),
            t("Healing cuts is vitamin C's job.", "愈合伤口是维生素C的作用。"),
          ],
        ),
        ask(
          t("Why does the body need fiber if it is not digested?", "既然纤维不被消化，身体为什么还需要它？"),
          t("It keeps the digestive system working smoothly", "它让消化系统顺畅运作"),
          [
            t("It provides most of the body's calories", "它提供了身体的大部分热量"),
            t("It is the main part of salt", "它是盐的主要成分"),
            t("It stores energy for later", "它为以后储存能量"),
          ],
          t(
            "The fourth paragraph says fiber is not digested at all, yet it keeps the digestive system working smoothly.",
            "第四段说，纤维根本不被消化，但它能让消化系统顺畅运作。",
          ),
          [
            t("Calories come mostly from carbohydrates. Fiber is not digested at all.", "热量主要来自碳水化合物。纤维根本不被消化。"),
            t("The main part of salt is sodium.", "盐的主要成分是钠。"),
            t("Storing energy is what fats do.", "储存能量是脂肪的作用。"),
          ],
        ),
        ask(
          t("What is the author's main point about a healthy lunch?", "关于健康的午餐，作者的主要观点是什么？"),
          t("It needs a balance of many foods, not one perfect food", "它需要多种食物的均衡搭配，而不是某一种完美的食物"),
          [
            t("It should contain only fruit and vegetables", "它应该只包含水果和蔬菜"),
            t("It should have as many calories as possible", "它应该含有尽可能多的热量"),
            t("It should never include any fat", "它绝不应该含有任何脂肪"),
          ],
          t(
            "The last paragraph says no single food contains everything and ends: A nutritious lunch is not about one perfect food. It is about balance.",
            "最后一段说，没有一种食物包含身体所需的一切，结尾写道：营养午餐不在于某一种完美的食物，而在于均衡。",
          ),
          [
            t("Only fruit and vegetables is too narrow. The author wants variety.", "只吃水果和蔬菜太窄了。作者主张多样。"),
            t("As many calories as possible is never advised.", "文中从没建议摄入尽可能多的热量。"),
            t("A small amount of fat is necessary, the passage says.", "文中说少量脂肪是必需的。"),
          ],
        ),
        ask(
          t("Which mineral builds strong bones?", "哪种矿物质能让骨骼强壮？"),
          t("Calcium", "钙"),
          [t("Vitamin C", "维生素C"), t("Sodium", "钠"), t("Fiber", "纤维")],
          t("Calcium, a mineral found in milk and green vegetables, builds strong bones.", "牛奶和绿色蔬菜中的矿物质钙能让骨骼强壮。"),
          [
            t("Vitamin C helps heal cuts.", "维生素C帮助伤口愈合。"),
            t("Sodium is the main part of salt.", "钠是盐的主要成分。"),
            t("Fiber keeps digestion smooth.", "纤维让消化顺畅。"),
          ],
        ),
      ],
    ),
    passage(
      "the-green-revolution",
      t("The Green Revolution", "绿色革命"),
      `In the 1960s, many experts feared that the world was heading toward disaster. The population was growing faster than ever, especially in Asia, and farms could not keep up. In India, millions of people depended on food sent from abroad. Some writers predicted that hundreds of millions would starve within a few decades.

That disaster did not happen, largely because of a change in farming now called the Green Revolution. Its best-known leader was an American scientist named Norman Borlaug. Working in Mexico, Borlaug spent years crossing thousands of varieties of wheat. He developed new plants with short, strong stems that could hold up heavy heads of grain without falling over. These plants could also resist a disease that had destroyed many crops.

The new wheat, and similar new kinds of rice, had a much higher yield, meaning they produced far more grain from the same field. But they needed help to do it. Farmers had to give them plenty of water, chemical fertilizer to feed the soil and pesticides to protect them from insects. Where farmers could get these things, harvests doubled or even tripled. India and Pakistan, which had faced famine, were growing enough wheat for themselves within a few years.

The Green Revolution saved many lives, and in 1970 Borlaug received the Nobel Peace Prize. Yet it also had costs. Heavy use of fertilizer and pesticides polluted rivers, and pumping water for crops lowered the water underground. Small farmers who could not afford the new seeds and chemicals were sometimes left behind. Today, scientists are looking for ways to grow as much food while doing less harm to the land.`,
      [farmingWords, hungerWords, argument],
      [
        ask(
          t("What does yield mean in this passage?", "在这篇文章中，yield 是什么意思？"),
          t("The amount of grain a field produces", "一块田地生产的粮食数量"),
          [
            t("A disease that destroys crops", "一种毁坏庄稼的病害"),
            t("A chemical that feeds the soil", "一种滋养土壤的化学物质"),
            t("A prize given to scientists", "授予科学家的奖项"),
          ],
          t(
            "The third paragraph defines it right after the word: meaning they produced far more grain from the same field.",
            "第三段在这个词后面紧接着给出了定义：意思是同一块田地能产出多得多的粮食。",
          ),
          [
            t("The disease is a separate problem the new wheat resisted.", "病害是新小麦能抵抗的另一个问题。"),
            t("Fertilizer is the chemical that feeds the soil.", "肥料才是给土壤提供养分的化学品。"),
            t("The prize is the Nobel Peace Prize, a different word.", "奖项是诺贝尔和平奖，是另一个词。"),
          ],
        ),
        ask(
          t("Why were the short, strong stems of Borlaug's wheat important?", "布劳格培育的小麦茎秆短而结实，这为什么重要？"),
          t("They could hold up heavy heads of grain without falling over", "它们能撑起沉甸甸的麦穗而不倒伏"),
          [
            t("They needed no water at all", "它们完全不需要水"),
            t("They made the wheat taste sweeter", "它们让小麦更甜"),
            t("They kept insects away without pesticides", "它们不用农药就能驱虫"),
          ],
          t(
            "The second paragraph says the short, strong stems could hold up heavy heads of grain without falling over.",
            "第二段说，短而结实的茎秆能撑起沉甸甸的麦穗而不倒伏。",
          ),
          [
            t("The new crops needed plenty of water.", "新作物需要大量的水。"),
            t("Taste is never mentioned.", "文中从没提到味道。"),
            t("Pesticides were still needed against insects.", "仍然需要农药来对付昆虫。"),
          ],
        ),
        ask(
          t("How does the author treat the Green Revolution in the last paragraph?", "在最后一段，作者如何看待绿色革命？"),
          t("The author praises its success but also describes its costs", "作者赞扬它的成就，也描述了它的代价"),
          [
            t("The author says it was a complete failure", "作者说它彻底失败了"),
            t("The author says it had no problems at all", "作者说它一点问题也没有"),
            t("The author refuses to give any opinion", "作者拒绝发表任何看法"),
          ],
          t(
            "The paragraph says it saved many lives and won a prize, then begins Yet it also had costs and lists pollution, falling water and small farmers left behind.",
            "这一段先说它拯救了许多生命并获奖，然后以 Yet it also had costs 转折，列举了污染、地下水下降和小农被落下。",
          ),
          [
            t("It saved many lives, so it was not a complete failure.", "它挽救了许多生命，所以不是彻底失败。"),
            t("The author lists real costs, like pollution.", "作者列出了真实的代价，比如污染。"),
            t("The author does judge it, naming both success and costs.", "作者确实作了评价，指出了成功和代价。"),
          ],
        ),
        ask(
          t("What prize did Norman Borlaug receive in 1970?", "诺曼·博洛格在1970年获得了什么奖？"),
          t("The Nobel Peace Prize", "诺贝尔和平奖"),
          [t("An Olympic medal", "奥运奖牌"), t("A prize for farming in Mexico", "墨西哥的农业奖"), t("No prize at all", "没有获奖")],
          t("In 1970 Borlaug received the Nobel Peace Prize.", "1970年博洛格获得了诺贝尔和平奖。"),
          [
            t("An Olympic medal is not mentioned.", "文中没提奥运奖牌。"),
            t("His prize was not just for farming in Mexico.", "他的奖项不是专门为墨西哥农业设的。"),
            t("He did receive a prize, in 1970.", "他确实在1970年获了奖。"),
          ],
        ),
      ],
      ["Asia", "India", "American", "Norman", "Borlaug", "Borlaug's", "Mexico", "Pakistan", "Nobel"],
    ),
    passage(
      "farms-in-the-city",
      t("Farms in the City", "城市里的农场"),
      `On the roof of a warehouse in Brooklyn, New York, rows of lettuce, tomatoes and peppers grow in long beds of soil, with the city's skyscrapers rising behind them. In Singapore, a crowded island with very little farmland, vegetables grow on tall towers of shelves inside buildings, under purple lights. These are urban farms, and they are spreading in cities around the world.

Supporters argue that urban farming has three main benefits. First, it brings fresh food closer to the people who eat it. Most food in a city travels hundreds or even thousands of kilometers from the farm. Vegetables grown on a nearby roof can be picked in the morning and sold that afternoon, fresher and with less fuel burned to carry them.

Second, urban farms can help neighborhoods where healthy food is hard to find. In some city areas, there are many fast-food shops but no stores selling fresh vegetables. A community garden can give families a place to grow their own.

Third, urban farms can make cities greener. Plants on roofs absorb rainwater, which would otherwise rush into the drains, and they cool buildings in hot weather.

Critics point out that urban farms are small and expensive. Indoor farms need a great deal of electricity for their lights, and land in a city costs far more than land in the countryside. Few urban farms can grow grains such as wheat or rice, which feed most of the world. Urban farming will not replace traditional farms. But for fresh vegetables, it may become an important part of how cities feed themselves.`,
      [farmingWords, argument, pointOfView],
      [
        ask(
          t("What are the three benefits that supporters of urban farming give?", "城市农业的支持者提出了哪三个好处？"),
          t("Fresher food, healthy food for more neighborhoods and greener cities", "更新鲜的食物、让更多社区吃到健康食物、让城市更绿"),
          [
            t("Cheaper land, more wheat and fewer skyscrapers", "更便宜的土地、更多的小麦和更少的摩天大楼"),
            t("More fast-food shops, more drains and more electricity", "更多快餐店、更多排水沟和更多电力"),
            t("Bigger farms, fewer cities and more fuel", "更大的农场、更少的城市和更多的燃料"),
          ],
          t(
            "The passage marks the reasons with First, Second and Third: fresh food closer to people, help for neighborhoods without healthy food, and greener cities.",
            "文章用 First、Second 和 Third 标出了这些理由：食物离人更近更新鲜、帮助缺乏健康食物的社区、让城市更绿。",
          ),
          [
            t("City land costs more, and few urban farms grow wheat.", "城市土地更贵，城市农场也很少种小麦。"),
            t("Fast-food shops are the problem, not a benefit.", "快餐店是问题，不是好处。"),
            t("Urban farms are small, and they save fuel.", "城市农场很小，而且节省燃料。"),
          ],
        ),
        ask(
          t(
            "Which piece of evidence supports the reason that urban farms make cities greener?",
            "哪条证据支持“城市农场让城市更绿”这一理由？",
          ),
          t("Plants on roofs absorb rainwater and cool buildings", "屋顶上的植物吸收雨水，为建筑降温"),
          [
            t("Vegetables can be picked in the morning and sold that afternoon", "蔬菜可以早上采摘、下午出售"),
            t("Some areas have many fast-food shops", "有些地区快餐店很多"),
            t("Indoor farms need a lot of electricity", "室内农场需要大量电力"),
          ],
          t(
            "The fourth paragraph gives the evidence for the third reason: roof plants absorb rainwater that would rush into the drains and cool buildings.",
            "第四段给出了第三个理由的证据：屋顶植物吸收原本会涌入下水道的雨水，并为建筑降温。",
          ),
          [
            t("Fresh picking supports the first benefit, fresher food.", "当天采摘支持的是第一个好处：更新鲜。"),
            t("Fast-food shops support the second benefit, about neighborhoods.", "快餐店支持的是第二个好处，关于街区。"),
            t("Electricity is a criticism, not a benefit.", "耗电是批评，不是好处。"),
          ],
        ),
        ask(
          t("What is the author's own view of urban farming?", "作者本人对城市农业持什么看法？"),
          t("It will not replace traditional farms but may matter for fresh vegetables", "它不会取代传统农业，但对新鲜蔬菜可能很重要"),
          [
            t("It will soon feed the whole world", "它很快就能养活全世界"),
            t("It is a waste of money and should stop", "它浪费钱，应该停止"),
            t("It is better than every kind of traditional farm", "它比所有传统农业都好"),
          ],
          t(
            "After giving both sides, the author concludes that urban farming will not replace traditional farms but may become important for fresh vegetables.",
            "在列出双方观点后，作者总结说，城市农业不会取代传统农业，但在新鲜蔬菜方面可能变得重要。",
          ),
          [
            t("Feeding the whole world is too much. Few grow grains.", "养活全世界说得太过了。很少有城市农场种粮食。"),
            t("The author sees value, so it should not stop.", "作者看到了价值，所以并不主张停止。"),
            t("The author says it will not replace traditional farms.", "作者说它不会取代传统农场。"),
          ],
        ),
        ask(
          t("Where do vegetables grow on tall towers of shelves under purple lights?", "在哪里蔬菜长在紫光下的高层架子上？"),
          t("In Singapore", "在新加坡"),
          [t("In Brooklyn", "在布鲁克林"), t("In California", "在加利福尼亚"), t("In India", "在印度")],
          t(
            "In Singapore, vegetables grow on tall towers of shelves inside buildings, under purple lights.",
            "在新加坡，蔬菜长在室内紫光下的高层架子上。",
          ),
          [
            t("Brooklyn has a rooftop farm in soil.", "布鲁克林是在土里种的屋顶农场。"),
            t("California is the almond example in another passage.", "加州是另一篇里杏仁的例子。"),
            t("India is from the Green Revolution passage.", "印度出自绿色革命那篇。"),
          ],
        ),
      ],
      ["Brooklyn", "York", "Singapore"],
    ),
    passage(
      "bees-and-our-food",
      t("Bees and Our Food", "蜜蜂与我们的食物"),
      `Think about the last time you ate an apple, a strawberry or an almond. You probably did not think about bees. But without them, those foods might not have existed.

Many plants cannot make fruit or seeds unless pollen is carried from one flower to another. This is called pollination. Some plants are pollinated by the wind, but many depend on animals, especially insects. As a bee visits flowers to collect nectar, pollen sticks to the tiny hairs on its body and rubs off on the next flower it visits. Scientists estimate that about a third of the food we eat depends at least partly on pollinators like bees.

Some crops depend on bees almost completely. In California, which grows most of the world's almonds, the trees bloom for only a few weeks each spring. Farmers rent more than a million beehives and bring them to the orchards in trucks. Without the bees, the almond harvest would be tiny.

In recent years, beekeepers in many countries have reported losing large numbers of their bees. Wild bees are also declining in many places. Scientists believe there is no single cause. Pesticides can harm bees or confuse them so they cannot find their way home. Diseases and tiny mites attack hives. And as wild meadows are turned into large fields of a single crop, bees lose the variety of flowers they need through the year.

There are ways to help. Farmers can use fewer pesticides and plant strips of wildflowers between fields. Even a small garden with flowers that bloom at different times can feed bees. Protecting these tiny workers is one of the simplest ways to protect our food.`,
      [farmingWords, argument, academic1, academic2],
      [
        ask(
          t("What is pollination?", "授粉是什么？"),
          t(
            "Carrying pollen from one flower to another so the plant can make fruit or seeds",
            "把花粉从一朵花带到另一朵花，使植物能结出果实或种子",
          ),
          [
            t("Collecting nectar to make honey", "采集花蜜酿蜜"),
            t("Renting beehives to farmers", "把蜂箱租给农民"),
            t("Spraying crops to kill insects", "给庄稼喷药杀虫"),
          ],
          t(
            "The second paragraph says many plants cannot make fruit or seeds unless pollen is carried from one flower to another, and this is called pollination.",
            "第二段说，许多植物只有在花粉从一朵花被带到另一朵花时才能结出果实或种子，这叫作授粉。",
          ),
          [
            t("Collecting nectar is what the bee does, not pollination itself.", "采花蜜是蜜蜂的行为，不是授粉本身。"),
            t("Renting hives is the almond farmers' practice.", "租蜂箱是杏仁农场主的做法。"),
            t("Spraying crops harms bees. It is not pollination.", "喷农药会伤害蜜蜂，不是授粉。"),
          ],
        ),
        ask(
          t("What example does the author use to show how much some crops depend on bees?", "作者用什么例子说明有些庄稼多么依赖蜜蜂？"),
          t("Farmers in California bring more than a million hives to the almond trees", "加利福尼亚的农民把一百多万个蜂箱运到杏仁树林"),
          [
            t("Bees have tiny hairs on their bodies", "蜜蜂身上长着细小的绒毛"),
            t("Some plants are pollinated by the wind", "有些植物靠风授粉"),
            t("A garden can have flowers that bloom at different times", "花园里可以种不同时节开花的植物"),
          ],
          t(
            "The third paragraph describes the almond orchards of California, where farmers rent more than a million hives because without bees the harvest would be tiny.",
            "第三段描述了加利福尼亚的杏仁园，农民租用一百多万个蜂箱，因为没有蜜蜂收成会很少。",
          ),
          [
            t("Tiny hairs explain how pollen sticks, not how much crops depend on bees.", "细毛说明花粉怎样粘上，不说明作物多依赖蜜蜂。"),
            t("Wind pollination shows the opposite, plants that do not need bees.", "风媒授粉说明的正相反：有的植物不需要蜜蜂。"),
            t("Flowers in a garden are a way to help, not the example.", "花园的花是帮助蜜蜂的办法，不是这个例子。"),
          ],
        ),
        ask(
          t("What reasons does the passage give for the loss of bees?", "文章给出了蜜蜂减少的哪些原因？"),
          t("Pesticides, diseases and mites, and the loss of varied flowers", "农药、疾病和螨虫，以及花卉种类的减少"),
          [
            t("Too many wildflowers and too much rain", "野花太多和雨水太多"),
            t("Bees flying to other countries", "蜜蜂飞到了别的国家"),
            t("Farmers renting too few hives", "农民租的蜂箱太少"),
          ],
          t(
            "The fourth paragraph says there is no single cause and lists pesticides, diseases and mites, and meadows turned into fields of a single crop.",
            "第四段说原因不止一个，并列举了农药、疾病和螨虫，以及草地变成单一作物的农田。",
          ),
          [
            t("Wildflowers help bees, and rain is not mentioned.", "野花帮助蜜蜂，文中没提雨。"),
            t("Bees flying abroad is never mentioned.", "文中从没提到蜜蜂飞到别国。"),
            t("Farmers rent over a million hives, not too few.", "农场主租了一百多万个蜂箱，不是太少。"),
          ],
        ),
        ask(
          t("About what share of our food depends partly on pollinators?", "我们的食物大约有多少部分依赖传粉者？"),
          t("About a third", "大约三分之一"),
          [t("About a tenth", "大约十分之一"), t("Almost all of it", "几乎全部"), t("None of it", "一点也没有")],
          t(
            "Scientists estimate that about a third of the food we eat depends at least partly on pollinators.",
            "科学家估计我们吃的食物约有三分之一至少部分依赖传粉者。",
          ),
          [
            t("A tenth is too small.", "十分之一太少了。"),
            t("Almost all is too much. Some plants use the wind.", "几乎全部太多了。有些植物靠风传粉。"),
            t("None is wrong. Some crops depend on bees almost completely.", "完全没有是错的。有的作物几乎完全依赖蜜蜂。"),
          ],
        ),
      ],
      ["California"],
    ),
    passage(
      "wasted-food",
      t("Wasted Food", "浪费的食物"),
      `Every year, about a third of all the food produced in the world is lost or thrown away. That is more than a billion tonnes, enough to feed every hungry person on earth several times over. I believe that reducing this waste is one of the most important things we can do, and that each of us can help.

Food is wasted at every step of its journey. On farms, crops may rot in the field when there are not enough workers to harvest them, or because they are not the perfect shape that stores demand. In poorer countries, much food spoils on the way to market because there are no refrigerated trucks or good roads. In richer countries, most waste happens at the end, in stores, restaurants and homes. Supermarkets throw away food that has passed its "best before" date, even though much of it is still safe to eat. Families buy more than they need and let it go bad in the refrigerator.

This waste is not only a loss of food. Growing it used water, land, fuel and work. When it rots in a landfill, it also releases a gas that warms the planet.

Some people say that one family's waste is too small to matter. But small actions add up when millions of people take them. Plan your meals before you shop. Eat leftovers instead of throwing them out. Learn the difference between "best before," which is about quality, and "use by," which is about safety. And if a carrot is crooked, eat it anyway. It tastes exactly the same.`,
      [hungerWords, argument, pointOfView],
      [
        ask(
          t("What is the author's claim?", "作者的观点是什么？"),
          t("Reducing food waste is very important, and each of us can help", "减少食物浪费非常重要，而且我们每个人都可以出一份力"),
          [
            t("Supermarkets should stop selling food", "超市应该停止卖食物"),
            t("Only farmers can reduce food waste", "只有农民才能减少食物浪费"),
            t("Food waste does not affect the planet", "食物浪费不会影响地球"),
          ],
          t(
            "The first paragraph states it directly: I believe that reducing this waste is one of the most important things we can do, and that each of us can help.",
            "第一段直接说明了观点：我认为减少这种浪费是我们能做的最重要的事情之一，而且我们每个人都可以出一份力。",
          ),
          [
            t("Supermarkets are criticized, but closing them is not proposed.", "超市受到批评，但作者没主张关掉它们。"),
            t("The author says each of us can help, not only farmers.", "作者说我们每个人都能出力，不只是农民。"),
            t("Rotting food releases a gas that warms the planet.", "腐烂的食物会释放让地球变暖的气体。"),
          ],
        ),
        ask(
          t(
            "How does the author answer people who say one family's waste is too small to matter?",
            "对于“一个家庭的浪费微不足道”的说法，作者是怎样回应的？",
          ),
          t("By saying small actions add up when millions of people take them", "说小行动在数百万人共同参与时就会积少成多"),
          [
            t("By agreeing that families do not matter", "同意家庭无关紧要"),
            t("By saying such people are lazy", "说这些人很懒"),
            t("By changing the subject to farming", "把话题转到农业上"),
          ],
          t(
            "The last paragraph names the other view and replies: But small actions add up when millions of people take them.",
            "最后一段提到了另一种观点，并回应说：但当数百万人都行动起来时，小行动就会积少成多。",
          ),
          [
            t("The author disagrees with them.", "作者不同意他们。"),
            t("Calling people lazy is never done.", "作者从没说人懒。"),
            t("The author stays on family actions.", "作者一直在讲家庭的做法。"),
          ],
        ),
        ask(
          t("Which reason does the third paragraph give for why food waste matters?", "第三段给出了食物浪费为什么重要的哪个理由？"),
          t(
            "Wasted food also wastes the water, land and fuel used to grow it, and warms the planet",
            "浪费的食物也浪费了种植它所用的水、土地和燃料，还会使地球变暖",
          ),
          [
            t("Wasted food makes refrigerators break", "浪费的食物会让冰箱坏掉"),
            t("Wasted food is the perfect shape for stores", "浪费的食物形状正适合商店"),
            t("Wasted food helps crops grow faster", "浪费的食物能帮助庄稼长得更快"),
          ],
          t(
            "The paragraph says growing the food used water, land, fuel and work, and that rotting food in a landfill releases a gas that warms the planet.",
            "这一段说，种植这些食物用了水、土地、燃料和劳动，而食物在垃圾填埋场腐烂会释放使地球变暖的气体。",
          ),
          [
            t("Broken refrigerators are never mentioned.", "文中从没提到冰箱坏了。"),
            t("Perfect shape is about stores rejecting crops.", "完美形状说的是商店挑剔农产品。"),
            t("Waste does not help crops grow.", "浪费不会让作物长得更快。"),
          ],
        ),
        ask(
          t('What does "use by" on a label tell you about?', "标签上的“use by”说的是什么？"),
          t("Safety", "安全"),
          [t("Quality", "品质"), t("Price", "价格"), t("Shape", "形状")],
          t('"Best before" is about quality, and "use by" is about safety.', "“best before”说的是品质，“use by”说的是安全。"),
          [
            t("Quality is what best before is about.", "质量是“最佳食用期”说的事。"),
            t("Price is never mentioned for these labels.", "这些标签与价格无关。"),
            t("Shape is about crooked carrots.", "形状说的是弯曲的胡萝卜。"),
          ],
        ),
      ],
    ),
    passage(
      "a-famine-remembered",
      t("A Famine Remembered", "铭记一场饥荒"),
      `In the summer of 1845, farmers in Ireland noticed that the leaves of their potato plants were turning black. When they dug up the potatoes, many were soft and rotten. A disease called potato blight, caused by a tiny living thing carried on the wind, had arrived from across the Atlantic. Within weeks it had spread across the country.

For the poorest families in Ireland, this was a catastrophe. Millions of people lived almost entirely on potatoes. A family might eat several kilograms a day, because potatoes grew well on small plots of poor land and were cheap. When the crop failed, they had almost nothing else. The blight returned the next year and the year after that.

The result was the Great Famine. Between 1845 and 1852, about one million people died of starvation and the diseases that came with it. Another million or more left Ireland, many crowding onto ships bound for America, Canada and Britain. Ireland's population fell by about a quarter.

Historians point out that the famine was not caused only by a plant disease. Throughout the worst years, Ireland continued to send large amounts of grain, butter and meat to Britain, because poor farmers had to sell their crops to pay rent to landowners. The government in London sent some help, but it was slow and far too small, and many officials believed it was wrong to give food away. In other words, there was food in Ireland, but the hungry could not get it.

Today, the famine is remembered with memorials in Dublin and in cities where its survivors settled. It is also a lesson: famines are often caused as much by how food is shared as by how much there is.`,
      [hungerWords, pointOfView, argument, academic2],
      [
        ask(
          t("Why was the potato blight so terrible for the poorest families?", "为什么马铃薯晚疫病对最贫穷的家庭如此可怕？"),
          t("They lived almost entirely on potatoes and had little else to eat", "他们几乎完全靠马铃薯为生，几乎没有别的东西可吃"),
          [
            t("They had planted only wheat that year", "那一年他们只种了小麦"),
            t("They were all living on ships", "他们都住在船上"),
            t("They sold all their potatoes to America", "他们把马铃薯全卖给了美国"),
          ],
          t(
            "The second paragraph says millions lived almost entirely on potatoes, so when the crop failed they had almost nothing else.",
            "第二段说，数百万人几乎完全靠马铃薯生活，所以庄稼歉收时他们几乎一无所有。",
          ),
          [
            t("Wheat is never said to be their crop.", "文中从没说他们种的是小麦。"),
            t("Some left on ships later. They did not live on them.", "一些人后来乘船离开，并不住在船上。"),
            t("Potatoes were not sold to America. Grain went to Britain.", "土豆没有卖到美国。粮食被运到了英国。"),
          ],
        ),
        ask(
          t("What does the author think caused the famine?", "作者认为是什么导致了这场饥荒？"),
          t("The blight, together with the way food and help were shared", "晚疫病，再加上粮食和救济的分配方式"),
          [
            t("Only the plant disease", "只是植物病害"),
            t("The weather in America", "美国的天气"),
            t("People leaving Ireland", "人们离开爱尔兰"),
          ],
          t(
            "The fourth paragraph says the famine was not caused only by a plant disease and explains that food left Ireland while help was slow and small.",
            "第四段说，饥荒不只是由植物病害造成的，并解释说粮食被运出爱尔兰，而救济又慢又少。",
          ),
          [
            t("The author says it was not only the disease.", "作者说不只是病害。"),
            t("America is where the blight came from, not the weather.", "美洲是病菌的来源，不是天气。"),
            t("Leaving Ireland was a result of the famine.", "离开爱尔兰是饥荒的结果。"),
          ],
        ),
        ask(
          t("What does the phrase In other words do in the fourth paragraph?", "第四段中的 In other words 起什么作用？"),
          t("It introduces a simpler restatement of the point", "它引出对观点更简单的重述"),
          [
            t("It introduces a new topic about potatoes", "它引出一个关于马铃薯的新话题"),
            t("It gives the other side of the argument", "它给出论证的另一方"),
            t("It begins a story about a family", "它开始讲述一个家庭的故事"),
          ],
          t(
            "After the details about exports and slow help, In other words sums them up simply: there was food in Ireland, but the hungry could not get it.",
            "在讲述了出口和迟缓的救济之后，In other words 简单地总结道：爱尔兰有粮食，但饥饿的人得不到。",
          ),
          [
            t("Potatoes are not a new topic there.", "土豆在那里并不是新话题。"),
            t("It restates the same point, not the other side.", "它重述同一个观点，不是对立面。"),
            t("No family story starts there.", "那里并没有开始讲一个家庭的故事。"),
          ],
        ),
        ask(
          t("When did the potato blight first appear in Ireland?", "马铃薯晚疫病最早在什么时候出现在爱尔兰？"),
          t("In the summer of 1845", "1845年夏天"),
          [t("In 1852", "1852年"), t("In 1921", "1921年"), t("In 1896", "1896年")],
          t(
            "In the summer of 1845, Irish farmers noticed the leaves of their potato plants turning black.",
            "1845年夏天，爱尔兰农民发现马铃薯的叶子变黑了。",
          ),
          [
            t("1852 is when the famine ended.", "1852年是饥荒结束的年份。"),
            t("1921 is not in the passage.", "1921年不在文中。"),
            t("1896 is not in the passage.", "1896年不在文中。"),
          ],
        ),
      ],
      ["Ireland", "Ireland's", "Atlantic", "America", "Canada", "Britain", "London", "Dublin"],
    ),
    passage(
      "the-seed-vault",
      t("The Seed Vault", "种子库"),
      `On a frozen mountainside on the island of Spitsbergen, far north of mainland Norway, a narrow concrete entrance sticks out of the snow. It looks like the door to a secret base. Behind it, a tunnel runs more than a hundred meters into the rock, to three rooms kept at minus eighteen degrees Celsius. Inside, on rows of shelves, are more than a million packets of seeds. This is the Svalbard Global Seed Vault, sometimes called the "doomsday vault."

Why would anyone store seeds in a mountain near the North Pole? The answer is that the world's crops are less varied than they used to be. Over the last century, farmers have come to rely on a small number of high-yield varieties. Thousands of older varieties, each suited to a particular soil, climate or disease, have stopped being grown and could disappear forever. Yet those old varieties may hold exactly the traits farmers will need in the future, such as resistance to drought or a new pest.

Countries around the world keep seed banks to protect these varieties. But seed banks can be damaged by war, floods or simple accidents. The vault in Svalbard is a backup for all of them. Each country sends copies of its seeds, and only that country can take them out again.

The location was chosen carefully. The rock is cold even without electricity, so the seeds would stay frozen if the power failed. The vault sits high enough to stay dry even if the polar ice melts.

The vault has already proved its worth. In 2015, scientists whose seed bank had been damaged by war in Syria withdrew seeds from Svalbard and began growing them again.`,
      [farmingWords, argument],
      [
        ask(
          t("Why are old varieties of crops worth saving?", "为什么值得保存古老的作物品种？"),
          t("They may have traits farmers will need, such as resistance to drought", "它们可能具有农民将来需要的性状，比如抗旱"),
          [
            t("They produce more grain than new varieties", "它们比新品种产量更高"),
            t("They can only grow near the North Pole", "它们只能在北极附近生长"),
            t("They taste exactly like modern crops", "它们的味道和现代作物一模一样"),
          ],
          t(
            "The second paragraph says the old varieties may hold exactly the traits farmers will need in the future, such as resistance to drought or a new pest.",
            "第二段说，古老品种可能恰好具有农民将来需要的性状，比如抗旱或抗新害虫。",
          ),
          [
            t("High yield is what modern varieties give.", "高产是现代品种的特点。"),
            t("They are not limited to the North Pole. They are only stored there.", "它们不只能在北极生长，只是存放在那里。"),
            t("Taste is never discussed.", "文中从没讨论味道。"),
          ],
        ),
        ask(
          t("Which detail supports the claim that the location was chosen carefully?", "哪个细节支持“选址经过精心考虑”这一说法？"),
          t("The rock stays cold even without electricity", "即使没有电，岩石也能保持低温"),
          [
            t("The entrance looks like a secret base", "入口看起来像一个秘密基地"),
            t("It is sometimes called the doomsday vault", "它有时被称为末日种子库"),
            t("It holds more than a million packets", "它存有一百多万包种子"),
          ],
          t(
            "The fourth paragraph supports the claim: the rock is cold without electricity, and the vault sits high enough to stay dry if the ice melts.",
            "第四段支持了这一说法：岩石在没有电的情况下也是冷的，而且种子库地势够高，即使冰川融化也能保持干燥。",
          ),
          [
            t("The entrance's look says nothing about the choice of place.", "入口的样子说明不了选址。"),
            t("The nickname is not evidence of careful choice.", "绰号不能证明选址谨慎。"),
            t("The number of packets is about size, not location.", "种子包的数量说的是规模，不是位置。"),
          ],
        ),
        ask(
          t("How does the last paragraph support the passage's point?", "最后一段是怎样支持文章观点的？"),
          t("It gives a real case in which the vault's seeds were used after a war", "它给出了一个战后使用种子库种子的真实案例"),
          [
            t("It describes the shape of the entrance", "它描述了入口的形状"),
            t("It explains why seeds must be frozen", "它解释了种子为什么必须冷冻"),
            t("It lists every country that sends seeds", "它列出了所有寄送种子的国家"),
          ],
          t(
            "It says the vault has already proved its worth and gives the example of scientists from Syria who withdrew seeds and began growing them again.",
            "它说种子库已经证明了自己的价值，并举了叙利亚科学家取回种子重新种植的例子。",
          ),
          [
            t("The entrance is described at the start.", "入口在开头描写。"),
            t("Freezing is explained in the paragraph before.", "冷冻的原因在前一段解释。"),
            t("No list of countries is given.", "文中没有国家名单。"),
          ],
        ),
      ],
      ["Spitsbergen", "Norway", "Celsius", "Svalbard", "Syria"],
    ),
    passage(
      "should-schools-grow-their-own-food",
      t("Should Schools Grow Their Own Food?", "学校应该自己种粮食吗？"),
      `At Hillcrest Middle School, the lunch salad sometimes comes from just outside the window. Three years ago, students and teachers turned an empty corner of the playground into a garden. Now it produces lettuce, beans, tomatoes and herbs for the cafeteria. I think every school should have a garden like this one.

The most important reason is that a garden changes the way students eat. Studies of school gardens have found that students who grow vegetables are more willing to try them. At Hillcrest, the cafeteria manager reports that students eat nearly twice as much salad on days when it comes from the garden. When you have planted a seed, watered it and watched it grow, a tomato is no longer just something on a plate.

A second reason is that a garden is an outdoor classroom. Students measure plant growth in math, test the soil in science and write about the harvest in English. They learn where food comes from and how much work it takes to grow it.

Some people argue that school gardens cost too much and take time away from regular lessons. These are fair concerns. A garden does need tools, seeds and someone to care for it in summer. But many gardens are paid for by local businesses or parent groups, and the lessons in them are regular lessons, taught in a different place. At Hillcrest, the garden cost less than the school spends on paper in a year.

A school garden will not feed every student every day. But it teaches lessons that last a lifetime. That makes it worth every seed.`,
      [nutritionWords, argument, pointOfView],
      [
        ask(
          t("What is the author's claim?", "作者的观点是什么？"),
          t("Every school should have a garden", "每所学校都应该有一个菜园"),
          [
            t("Schools should stop serving salad", "学校应该停止供应沙拉"),
            t("Gardens cost too much for schools", "菜园对学校来说太贵了"),
            t("Students should grow all their own food at home", "学生应该在家种自己吃的所有食物"),
          ],
          t(
            "The first paragraph ends with the claim: I think every school should have a garden like this one.",
            "第一段最后提出了观点：我认为每所学校都应该有一个这样的菜园。",
          ),
          [
            t("Salad is served more, not stopped.", "沙拉吃得更多了，不是停止供应。"),
            t("Cost is the critics' worry, which the author answers.", "成本是批评者的担忧，作者作了回应。"),
            t("Home gardens are not the claim. It is about schools.", "论点不是家庭菜园，而是学校。"),
          ],
        ),
        ask(
          t(
            "Which evidence supports the reason that a garden changes the way students eat?",
            "哪条证据支持“菜园改变学生的饮食方式”这一理由？",
          ),
          t("Students eat nearly twice as much salad when it comes from the garden", "沙拉来自菜园时，学生吃的量几乎是平时的两倍"),
          [
            t("Students measure plant growth in math", "学生在数学课上测量植物的生长"),
            t("The garden cost less than the school's paper", "菜园的花费比学校的纸张费用还少"),
            t("Local businesses pay for many gardens", "当地企业资助了许多菜园"),
          ],
          t(
            "The second paragraph backs the first reason with studies and with the cafeteria manager's report that students eat nearly twice as much garden salad.",
            "第二段用研究以及食堂经理的报告来支持第一个理由：学生吃来自菜园的沙拉几乎是平时的两倍。",
          ),
          [
            t("Math lessons support the outdoor classroom reason.", "数学课支持的是户外课堂这个理由。"),
            t("The cost of paper answers the critics.", "纸张的花费是回应批评者的。"),
            t("Business funding also answers the cost concern.", "企业资助同样是回应成本问题的。"),
          ],
        ),
        ask(
          t("How does the author treat the view that school gardens cost too much?", "作者如何对待“学校菜园花费太大”这一观点？"),
          t("The author calls it a fair concern and then answers it with facts", "作者称之为合理的担忧，然后用事实回应"),
          [
            t("The author ignores it completely", "作者完全无视它"),
            t("The author agrees and drops the claim", "作者表示同意并放弃了自己的观点"),
            t("The author makes fun of people who hold it", "作者嘲笑持这种观点的人"),
          ],
          t(
            "The fourth paragraph says These are fair concerns, then answers with how gardens are paid for and what the Hillcrest garden cost.",
            "第四段说 These are fair concerns，然后用菜园的资金来源和希尔克雷斯特菜园的花费作出回应。",
          ),
          [
            t("The author does not ignore it. A whole paragraph answers it.", "作者没有忽视它，用了一整段来回应。"),
            t("The author keeps the claim.", "作者坚持自己的观点。"),
            t("The author calls it fair, not foolish.", "作者说这是合理的担忧，并没有嘲笑。"),
          ],
        ),
      ],
      ["Hillcrest"],
    ),
  ],
};
