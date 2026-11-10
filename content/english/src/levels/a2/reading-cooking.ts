// The reading unit of the A2 theme Cooking: recipes, kitchen stories and food from home.

import { type ReadingUnitDef, t } from "@ga/content";
import { passageMaker } from "../pre-a1/reading-kit.ts";
import { readingWords } from "./reading-words.ts";

const passage = passageMaker(readingWords, [
  "a2-words-cooking",
  "a2-words-ingredients",
  "a2-words-taste",
  "a2-words-quantities",
  "quantifiers-a-few-and-a-little",
  "writing-steps-in-order",
]);

/** readingCooking is the reading unit of the theme Cooking. */
export const readingCooking: ReadingUnitDef = {
  id: "a2-reading-cooking",
  title: t("Cooking", "烹饪"),
  passages: [
    passage({
      id: "a2-cooking-dumplings-for-the-new-year",
      title: ["Dumplings for the New Year", "过年包饺子"],
      body: `In my family we always make dumplings for the Chinese New Year. On the day before the New Year, everyone comes to my grandparents' apartment: my parents, my aunts, my uncles and all my cousins. There are fifteen of us!

In the morning, Grandma mixes meat, onions and a little garlic in a big bowl. She adds a few spoons of oil, a bit of sauce and some salt. Grandpa mixes flour and water and cuts it into hundreds of small pieces.

In the afternoon we all sit around the big table and make the dumplings. The older people work quickly, but the children are slow, and our dumplings are not pretty. The dumplings of my little cousin always break when they boil.

Grandma also hides a piece of candy in one dumpling. The person who finds it will be lucky in the new year.

At twelve o'clock at night we boil the dumplings and eat them. Last year I found the candy! I don't know if I was luckier than the others, but I was very happy.`,
      grammar: ["quantifiers-a-few-and-a-little"],
      questions: [
        [
          ["Where does the family meet before the New Year?", "过年前一家人在哪里聚会？"],
          ["At the grandparents' apartment", "在爷爷奶奶家"],
          [
            ["At a restaurant", "在餐馆"],
            ["At the writer's house", "在作者家"],
          ],
          ['The passage says: "everyone comes to my grandparents\' apartment."', "大家都到爷爷奶奶的公寓里，一共十五个人。"],
        ],
        [
          ["What does Grandma hide in one dumpling?", "奶奶在一个饺子里藏了什么？"],
          ["A piece of candy", "一块糖"],
          [
            ["A lot of garlic", "很多大蒜"],
            ["A coin", "一枚硬币"],
          ],
          [
            'The passage says: "Grandma also hides a piece of candy in one dumpling."',
            "奶奶在一个饺子里藏了一块糖，吃到的人新的一年会有好运。",
          ],
        ],
        [
          ["When do they eat the dumplings?", "他们什么时候吃饺子？"],
          ["At twelve o'clock at night", "夜里十二点"],
          [
            ["In the morning", "早上"],
            ["In the afternoon", "下午"],
          ],
          [
            'The passage says: "At twelve o\'clock at night we boil the dumplings and eat them."',
            "早上准备馅，下午包饺子，夜里十二点煮了吃。",
          ],
        ],
      ],
    }),
    passage({
      id: "a2-cooking-how-to-make-pancakes",
      title: ["How to Make Pancakes", "怎样做煎饼"],
      body: `Pancakes are small, soft cakes that you cook in a pan. They are easy to make, and they are great for breakfast. This recipe makes about ten pancakes.

You need two cups of flour, two eggs, two cups of milk, a little butter, a bit of salt and a little sugar.

First, put the flour, the sugar and the salt in a bowl. Then add the eggs and a little milk, and mix them well. Next, add the rest of the milk slowly and mix again.

Heat a pan and add a little butter. Pour a small amount of the mix into the pan. Cook it for about a minute. Then turn it over and cook the other side for a minute more.

Finally, put your pancakes on a plate. You can eat them with honey, with lemon and sugar, or with fresh fruit. Be careful: the pan is very hot!`,
      grammar: ["writing-steps-in-order", "imperatives", "quantifiers-a-few-and-a-little"],
      glossed: ["pancakes"],
      questions: [
        [
          ["How many pancakes does this recipe make?", "这个食谱能做多少个煎饼？"],
          ["About ten", "大约十个"],
          [
            ["About two", "大约两个"],
            ["About twenty", "大约二十个"],
          ],
          ['The recipe says: "This recipe makes about ten pancakes."', "食谱开头说可以做大约十个。"],
        ],
        [
          ["What do you do after you add the eggs and a little milk?", "加入鸡蛋和少许牛奶后要做什么？"],
          ["Mix them well", "把它们搅拌均匀"],
          [
            ["Heat the pan", "把锅烧热"],
            ["Add the butter", "加黄油"],
          ],
          [
            'The recipe says: "Then add the eggs and a little milk, and mix them well."',
            "加入鸡蛋和少许牛奶后要搅拌均匀，然后再慢慢加剩下的牛奶。",
          ],
        ],
        [
          ["How long do you cook each side of a pancake?", "煎饼每一面要煎多久？"],
          ["About a minute", "大约一分钟"],
          [
            ["Five minutes", "五分钟"],
            ["Ten seconds", "十秒钟"],
          ],
          [
            'The recipe says: "Cook it for about a minute. Then turn it over and cook the other side for a minute more."',
            "每一面大约煎一分钟。",
          ],
        ],
      ],
    }),
    passage({
      id: "a2-cooking-too-much-salt",
      title: ["Too Much Salt!", "盐放多了！"],
      body: `Last Sunday I decided to cook dinner for my family for the first time. I wanted to make a vegetable soup. I found a recipe online and bought carrots, onions, beans, corn and some tomatoes at the market.

I cut the vegetables into small pieces and fried the onions in a little oil. Then I added the other vegetables and two liters of water, and the soup boiled for half an hour. It smelled great.

The recipe said, "Add 1 spoon of salt." But I read it badly. I thought it said ten, so I added ten spoons of salt.

At dinner, Dad tasted the soup first. His face went red, and he drank a whole glass of water. "It's very salty," he said with a smile.

Mom laughed. "Don't worry," she said. "We can fix it." She added more water, more vegetables and a few potatoes, and we cooked it for another twenty minutes. Now it wasn't too salty, and there was enough soup for three days!

I learned an important lesson: read the recipe carefully.`,
      grammar: ["past-simple-regular", "quantifiers-a-few-and-a-little"],
      questions: [
        [
          ["What did the writer want to cook?", "作者想做什么？"],
          ["A vegetable soup", "蔬菜汤"],
          [
            ["Fried fish", "煎鱼"],
            ["Pancakes", "煎饼"],
          ],
          ['The passage says: "I wanted to make a vegetable soup."', "作者第一次给家人做饭，想做蔬菜汤。"],
        ],
        [
          ["What was the writer's mistake?", "作者犯了什么错？"],
          ["Adding ten spoons of salt, not one", "放了十勺盐，而不是一勺"],
          [
            ["Boiling the soup for too long", "汤煮得太久"],
            ["Forgetting the water", "忘了加水"],
          ],
          ['The writer says: "I thought it said ten, so I added ten spoons of salt."', "食谱写的是一勺盐，作者看错了，放了十勺。"],
        ],
        [
          ["How did Mom fix the soup?", "妈妈是怎么补救这锅汤的？"],
          ["She added water, vegetables and a few potatoes", "加了水、蔬菜和几个土豆"],
          [
            ["She added some sugar", "加了一些糖"],
            ["She made a new soup", "重新做了一锅汤"],
          ],
          [
            'The passage says: "She added more water, more vegetables and a few potatoes."',
            "妈妈加了更多的水、蔬菜和几个土豆，汤就不那么咸了。",
          ],
        ],
      ],
    }),
    passage({
      id: "a2-cooking-a-recipe-from-grandma",
      title: ["A Recipe from Grandma", "奶奶的食谱"],
      body: `Hi Lin,

You asked for my recipe for tomatoes and eggs. Here it is! It's easy, and it's ready in ten minutes.

You need three eggs, two big tomatoes, a little oil, a bit of salt, a little sugar and a few pieces of green onion.

First, cut the tomatoes into pieces. Then mix the eggs in a bowl with a little salt. Heat some oil in a pan and fry the eggs quickly. When they are almost ready, put them on a plate.

Next, add a little more oil to the pan and fry the tomatoes for two or three minutes, until they are soft. Add the sugar. A little sugar makes the tomatoes less sour. Then put the eggs back in the pan and mix everything for one minute. Finally, add the green onion.

Eat it hot with rice. Your grandpa says it is the best dish in the world, but he says that about all my cooking!

Love,
Grandma`,
      grammar: ["writing-steps-in-order", "imperatives", "quantifiers-a-few-and-a-little"],
      names: ["Lin"],
      questions: [
        [
          ["How long does the dish take to make?", "这道菜要做多长时间？"],
          ["Ten minutes", "十分钟"],
          [
            ["An hour", "一个小时"],
            ["Three minutes", "三分钟"],
          ],
          ["Grandma writes: \"It's easy, and it's ready in ten minutes.\"", "奶奶说这道菜很简单，十分钟就能做好。"],
        ],
        [
          ["Why does Grandma add sugar?", "奶奶为什么加糖？"],
          ["It makes the tomatoes less sour", "让西红柿不那么酸"],
          [
            ["It makes the eggs sweet", "让鸡蛋变甜"],
            ["Grandpa likes sweet food", "爷爷喜欢吃甜的"],
          ],
          ['Grandma writes: "A little sugar makes the tomatoes less sour."', "less sour 是“不那么酸”，这就是加糖的原因。"],
        ],
        [
          ["What do you do with the eggs when they are almost ready?", "鸡蛋快熟时要怎么做？"],
          ["Put them on a plate", "把它们盛到盘子里"],
          [
            ["Add the tomatoes to them", "把西红柿加进去"],
            ["Add the green onion", "加葱"],
          ],
          ['Grandma writes: "When they are almost ready, put them on a plate."', "先把鸡蛋盛出来，炒完西红柿再把鸡蛋放回锅里。"],
        ],
      ],
    }),
    passage({
      id: "a2-cooking-bread-from-three-ingredients",
      title: ["Bread from Three Ingredients", "三种材料做的面包"],
      body: `People made bread a very long time ago, long before there were ovens in houses. The first bread was very easy to make. It had only three things in it: flour, water and salt.

You can still make this bread today. Mix two cups of flour with a little salt. Add water slowly and mix until it is soft but not wet. Then cut it into six pieces. Roll each piece with your hands until it is about as big as a plate.

Heat a dry pan. Cook each piece for about two minutes on each side, until it is a little brown. You don't need an oven or any oil.

This bread is not as tall and soft as the bread from a bakery, but it is fresh, warm and delicious. In many countries people still eat bread like this every day: in India, in Mexico and in many parts of Africa and China.

Try it with soup, or eat it with a little butter and honey.`,
      grammar: ["imperatives", "quantifiers-a-few-and-a-little"],
      names: ["India", "Mexico", "Africa", "China"],
      questions: [
        [
          ["What three things are in this bread?", "这种面包里有哪三样东西？"],
          ["Flour, water and salt", "面粉、水和盐"],
          [
            ["Flour, eggs and milk", "面粉、鸡蛋和牛奶"],
            ["Flour, oil and sugar", "面粉、油和糖"],
          ],
          ['The passage says: "It had only three things in it: flour, water and salt."', "最早的面包只有面粉、水和盐三样东西。"],
        ],
        [
          ["What do you cook the bread in?", "用什么来做这种面包？"],
          ["A dry pan", "一个干锅"],
          [
            ["An oven", "烤箱"],
            ["A pan with a lot of oil", "放很多油的锅"],
          ],
          ['The passage says: "Heat a dry pan... You don\'t need an oven or any oil."', "用干锅烙，不需要烤箱，也不用油。"],
        ],
        [
          ["How is it different from bread from a bakery?", "它和面包店的面包有什么不同？"],
          ["It is not as tall and soft", "没有那么高、那么软"],
          [
            ["It is sweeter", "更甜"],
            ["It is not fresh", "不新鲜"],
          ],
          [
            'The passage says: "This bread is not as tall and soft as the bread from a bakery."',
            "not as ... as 表示“不如……”：它没有面包店的面包高和软，但新鲜又好吃。",
          ],
        ],
      ],
    }),
    passage({
      id: "a2-cooking-the-spicy-soup-contest",
      title: ["The Spicy Soup Contest", "辣汤比赛"],
      body: `Every fall our town has a soup day in the big square. People cook their best soup, and everyone can taste it. At the end of the day there is a prize for the most delicious soup.

This year my uncle Marco decided to try. Uncle Marco loves spicy food, so he made a red soup with peppers, beans, corn, garlic and a lot of hot sauce. He cooked it for five hours.

Many people tasted it. Some people loved it. Others drank a lot of water and couldn't speak for a minute! A little boy tasted it and started to cough.

Next to Uncle Marco, an old woman made a soup of chicken, carrots and onions. It wasn't spicy at all. It was fresh and sweet, and it smelled great.

At five o'clock, a famous cook from the city tasted all the soups. The chicken soup won the prize. But there was a second prize for Uncle Marco: the prize for the spiciest soup. "Next year," he said, "I'll make it even spicier."`,
      grammar: ["comparatives-and-superlatives", "past-simple-irregular"],
      names: ["Marco"],
      questions: [
        [
          ["What did Uncle Marco put in his soup?", "马尔科叔叔的汤里放了什么？"],
          ["Peppers, beans, corn, garlic and hot sauce", "辣椒、豆子、玉米、大蒜和辣酱"],
          [
            ["Chicken, carrots and onions", "鸡肉、胡萝卜和洋葱"],
            ["Fish, lemon and rice", "鱼、柠檬和米饭"],
          ],
          [
            'The passage says he "made a red soup with peppers, beans, corn, garlic and a lot of hot sauce."',
            "鸡肉、胡萝卜和洋葱是那位老太太的汤。",
          ],
        ],
        [
          ["Which soup won the first prize?", "哪种汤得了一等奖？"],
          ["The chicken soup", "鸡汤"],
          [
            ["Uncle Marco's soup", "马尔科叔叔的汤"],
            ["A tomato soup", "番茄汤"],
          ],
          ['The passage says: "The chicken soup won the prize."', "老太太的鸡汤得了奖；马尔科叔叔得的是“最辣的汤”奖。"],
        ],
        [
          ["What will Uncle Marco do next year?", "马尔科叔叔明年要怎么做？"],
          ["Make his soup even spicier", "把汤做得更辣"],
          [
            ["Make chicken soup", "做鸡汤"],
            ["Not cook at all", "不参加了"],
          ],
          ['Uncle Marco says: "Next year I\'ll make it even spicier."', "even spicier 表示“更辣”。"],
        ],
      ],
    }),
    passage({
      id: "a2-cooking-cooking-without-an-oven",
      title: ["Cooking Without an Oven", "没有烤箱也能做饭"],
      body: `When my brother Jack moved to a new city for his job, he lived in a very small apartment. The kitchen had only one hot plate and a small cupboard. There was no oven.

"How can I cook without an oven?" he asked me on the phone. I gave him some ideas.

First, you can do a lot with one pan. You can fry eggs, vegetables, meat and fish, and you can cook noodles and rice. Second, you can boil things: potatoes, eggs, beans and soup. Third, some food doesn't need heat at all. Salads, fruit and sandwiches are healthy and fast.

Jack tried. His first week was difficult. His first rice was black and dry, and his eggs were almost raw. But he didn't stop. He watched cooking videos online and practiced every evening.

Now he can make fried rice, noodle soup and fish with lemon. Last month he cooked dinner for six friends in his tiny kitchen. "Who needs an oven?" he says.`,
      grammar: ["past-simple-irregular"],
      names: ["Jack"],
      questions: [
        [
          ["What did Jack's kitchen have?", "杰克的厨房里有什么？"],
          ["One hot plate and a small cupboard", "一个电炉和一个小柜子"],
          [
            ["A big oven", "一个大烤箱"],
            ["Nothing at all", "什么都没有"],
          ],
          [
            'The passage says: "The kitchen had only one hot plate and a small cupboard. There was no oven."',
            "厨房里只有一个电炉和一个小柜子，没有烤箱。",
          ],
        ],
        [
          ["How did Jack learn to cook?", "杰克是怎么学会做饭的？"],
          ["He watched videos online and practiced", "看网上的视频并练习"],
          [
            ["He went to a cooking school", "上烹饪学校"],
            ["His mother came to help him", "妈妈来帮他"],
          ],
          ['The passage says: "He watched cooking videos online and practiced every evening."', "他每天晚上看网上的烹饪视频并练习。"],
        ],
        [
          ["How many friends did Jack cook dinner for?", "杰克给几个朋友做了晚饭？"],
          ["Six", "六个"],
          [
            ["Two", "两个"],
            ["Ten", "十个"],
          ],
          [
            'The passage says: "Last month he cooked dinner for six friends in his tiny kitchen."',
            "上个月他在小厨房里给六个朋友做了晚饭。",
          ],
        ],
      ],
    }),
    passage({
      id: "a2-cooking-lemon-and-honey",
      title: ["Lemon and Honey", "柠檬蜂蜜水"],
      body: `When I have a cough or a cold, my mother always makes me a hot drink of lemon and honey. It is an old recipe in her family, and it is very easy.

Here is how to make it. Boil some water. Cut a fresh lemon in half and put the juice of one half in a cup. Add a spoon of honey. Then pour hot water into the cup, but not boiling water, and mix it well. Wait a few minutes until it is warm enough to drink.

Why does it help? The lemon is sour and fresh, and it is good for your body when you are ill. The honey is sweet, and it makes your throat feel better. The warm water helps too. When you are ill, you should drink plenty of water.

Lemon and honey is not medicine, and it can't stop a cold. If you have a high fever, you should see a doctor. But a hot cup of lemon and honey on a cold evening makes you feel warm and cared for. My mother says that is the most important part.`,
      grammar: ["imperatives", "should-and-must"],
      questions: [
        [
          ["When does the writer's mother make this drink?", "作者的妈妈什么时候做这种饮料？"],
          ["When the writer has a cough or a cold", "作者咳嗽或感冒时"],
          [
            ["Every morning", "每天早上"],
            ["Only in summer", "只在夏天"],
          ],
          [
            'The first sentence says: "When I have a cough or a cold, my mother always makes me a hot drink of lemon and honey."',
            "第一句说作者咳嗽或感冒时，妈妈总会做这种热饮。",
          ],
        ],
        [
          ["What does the honey do?", "蜂蜜有什么作用？"],
          ["It makes your throat feel better", "让喉咙舒服些"],
          [
            ["It makes the drink sour", "让饮料变酸"],
            ["It stops a fever", "退烧"],
          ],
          ['The passage says: "The honey is sweet, and it makes your throat feel better."', "蜂蜜是甜的，能让喉咙舒服些；酸的是柠檬。"],
        ],
        [
          ["What should you do if you have a high fever?", "发高烧时应该怎么做？"],
          ["See a doctor", "去看医生"],
          [
            ["Drink more lemon and honey", "多喝柠檬蜂蜜水"],
            ["Go outside in the cold", "到外面的冷空气里去"],
          ],
          ['The passage says: "If you have a high fever, you should see a doctor."', "文中说柠檬蜂蜜水不是药；发高烧应该去看医生。"],
        ],
      ],
    }),
  ],
};
