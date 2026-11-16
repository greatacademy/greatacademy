// Grade 2: the reading units of the course, one for each theme: stories, fables, a letter and texts of facts, in words
// a second grader can sound out or knows by sight, three questions each.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage, words } from "../grade-3/reading-kit.ts";

const parts = words("beginning-middle-and-end", 0.3);
const topic = words("the-main-topic-of-a-text", 0.3);
const feel = words("how-characters-feel", 0.3);

/** longAgoAndToday is the reading unit of grade 2 on how life has changed. */
export const longAgoAndToday: ReadingUnitDef = {
  id: "long-ago-and-today",
  title: t("Long Ago and Today", "过去和现在"),
  passages: [
    passage(
      "toys-long-ago",
      t("Toys Long Ago", "过去的玩具"),
      `Long ago, children did not have toys that beeped or lit up. Most toys were made by hand, from wood, cloth or string.

A child might have a wooden top. You wound a string around it and pulled hard, and the top spun on the floor. Girls and boys played with dolls made of rags. Some children rolled a metal hoop down the road with a stick to see how far it could go.

Children also played games that needed no toys at all, such as tag and hide and seek. Today we have many new toys, but children still love to play the same old games.`,
      [topic],
      [
        ask(
          ["What were most toys made from long ago?", "过去的玩具大多是用什么做的？"],
          ["Wood, cloth or string", "木头、布或绳子"],
          [
            ["Plastic and glass", "塑料和玻璃"],
            ["Paper and glue", "纸和胶水"],
            ["Lights and wires", "灯和电线"],
          ],
          ["The text says most toys were made by hand, from wood, cloth or string.", "短文说过去的玩具大多是用木头、布或绳子手工做的。"],
        ),
        ask(
          ["How did a child make a top spin?", "孩子怎样让陀螺转起来？"],
          ["By winding a string around it and pulling hard", "把绳子绕在上面再用力一拉"],
          [
            ["By pushing a button", "按一个按钮"],
            ["By rolling it with a stick", "用棍子滚它"],
            ["By blowing on it", "对着它吹气"],
          ],
          ["The text says you wound a string around the top and pulled hard.", "短文说要把绳子绕在陀螺上，再用力一拉。"],
        ),
        ask(
          ["What is the text mostly about?", "这篇短文主要讲什么？"],
          ["How children played long ago", "过去的孩子怎样玩耍"],
          [
            ["How to make a doll", "怎样做布娃娃"],
            ["Toys that light up", "会发光的玩具"],
            ["A game of tag at school", "学校里的一场捉人游戏"],
          ],
          ["Every part tells about the toys and games of children long ago.", "每一部分都在讲过去孩子们的玩具和游戏。"],
        ),
      ],
    ),
    passage(
      "grans-school-days",
      t("Gran's School Days", "奶奶的上学时光"),
      `When my gran was seven, she went to a school with just one room. All the children sat in that room, from the little ones to the big ones. There was only one teacher for all of them.

Gran walked to school every day, even in the snow. She carried her lunch in a tin pail. In winter, the children took turns bringing wood for the stove that kept the room warm.

Gran wrote on a small slate with a piece of chalk. When she made a mistake, she wiped it off with a cloth. "We did not have much," Gran told me, "but we learned a lot, and we had fun."`,
      [topic, feel],
      [
        ask(
          ["How many rooms did Gran's school have?", "奶奶的学校有几间教室？"],
          ["Just one", "只有一间"],
          [
            ["Two", "两间"],
            ["Ten", "十间"],
            ["A room for each grade", "每个年级一间"],
          ],
          ["The text says Gran went to a school with just one room.", "短文说奶奶上的学校只有一间教室。"],
        ),
        ask(
          ["What kept the room warm in winter?", "冬天什么让教室保持温暖？"],
          ["A stove that burned wood", "烧木柴的炉子"],
          [
            ["Lots of blankets", "很多毯子"],
            ["The sun", "太阳"],
            ["A big fire outside", "外面的一大堆火"],
          ],
          ["The children brought wood for the stove that kept the room warm.", "孩子们轮流带木柴来烧炉子，让教室保持温暖。"],
        ),
        ask(
          ["How does Gran feel about her school days?", "奶奶对她的上学时光有什么感受？"],
          ["Glad, because they learned a lot and had fun", "很高兴，因为他们学到了很多，也很快乐"],
          [
            ["Angry, because the walk was long", "很生气，因为路很远"],
            ["Sad, because she had no friends", "很难过，因为她没有朋友"],
            ["Scared of the teacher", "害怕老师"],
          ],
          ["Gran says they did not have much, but they learned a lot and had fun.", "奶奶说他们东西不多，但学到了很多，也很快乐。"],
        ),
      ],
    ),
    passage(
      "how-we-get-light",
      t("How We Get Light", "我们怎样获得光亮"),
      `What do you do when it gets dark? You flip a switch, and a light comes on. But long ago, there were no light bulbs.

Long ago, people used candles made from fat or wax. A candle gave a small, soft light, and it could start a fire if it fell over. Later, people used lamps that burned oil. They gave more light, but they were smoky and needed to be filled again and again.

Then, about a hundred and fifty years ago, people made the electric light bulb. It was bright, clean and safe. Today, many homes use bulbs that save power. Light has changed a lot over time!`,
      [topic],
      [
        ask(
          ["What did people use for light long ago?", "很久以前人们用什么照明？"],
          ["Candles made from fat or wax", "用油脂或蜡做的蜡烛"],
          [
            ["Light bulbs", "电灯泡"],
            ["The moon only", "只用月亮"],
            ["Flashlights", "手电筒"],
          ],
          ["The text says long ago people used candles made from fat or wax.", "短文说很久以前人们用油脂或蜡做的蜡烛。"],
        ),
        ask(
          ["What was a problem with oil lamps?", "油灯有什么问题？"],
          ["They were smoky and had to be filled again and again", "它们冒烟，还得一次又一次地加油"],
          [
            ["They gave no light", "它们不发光"],
            ["They were too bright", "它们太亮了"],
            ["They cost no money", "它们不要钱"],
          ],
          ["The text says the lamps were smoky and needed to be filled again and again.", "短文说油灯会冒烟，而且得一次又一次地加油。"],
        ),
        ask(
          ["What is the main topic of the text?", "这篇短文的主题是什么？"],
          ["How the way we get light has changed", "我们获得光亮的方式是怎样变化的"],
          [
            ["How to make a candle", "怎样做蜡烛"],
            ["Why fires are dangerous", "火为什么危险"],
            ["What happens at night", "晚上会发生什么"],
          ],
          [
            "The text tells about candles, then oil lamps, then light bulbs: how light has changed over time.",
            "短文依次讲了蜡烛、油灯和电灯泡，也就是光亮随着时间发生的变化。",
          ],
        ),
      ],
    ),
  ],
};

/** ourNeighborhood is the reading unit of grade 2 on the people and places of a town. */
export const ourNeighborhood: ReadingUnitDef = {
  id: "our-neighborhood",
  title: t("Our Neighborhood", "我们的社区"),
  passages: [
    passage(
      "helpers-in-our-town",
      t("Helpers in Our Town", "我们镇上的帮手"),
      `Many people work to help our town. Each one has an important job.

Firefighters put out fires and keep people safe. They ride in a big red truck with a long ladder. Police officers help people who are lost, and they keep the roads safe.

Doctors and nurses care for people who are sick or hurt. Teachers help children learn to read, write and count. Mail carriers bring letters and boxes to every home, in rain or sun.

Some helpers work at night while we sleep. Bakers make fresh bread, and street sweepers clean the roads. Who are the helpers in your town?`,
      [topic],
      [
        ask(
          ["What do firefighters ride in?", "消防员乘坐什么？"],
          ["A big red truck with a long ladder", "带长梯子的红色大卡车"],
          [
            ["A small blue car", "一辆蓝色小汽车"],
            ["A bus", "一辆公共汽车"],
            ["A boat", "一条船"],
          ],
          ["The text says firefighters ride in a big red truck with a long ladder.", "短文说消防员乘坐一辆带长梯子的红色大卡车。"],
        ),
        ask(
          ["Who brings letters to every home?", "谁把信送到每户人家？"],
          ["Mail carriers", "邮递员"],
          [
            ["Police officers", "警察"],
            ["Bakers", "面包师"],
            ["Nurses", "护士"],
          ],
          ["The text says mail carriers bring letters and boxes to every home.", "短文说邮递员把信件和包裹送到每户人家。"],
        ),
        ask(
          ["What is the text mostly about?", "这篇短文主要讲什么？"],
          ["People whose jobs help the town", "工作能帮助小镇的人们"],
          [
            ["How to put out a fire", "怎样灭火"],
            ["Why bread is good", "面包为什么好"],
            ["What children learn at school", "孩子们在学校学什么"],
          ],
          ["The text tells about many helpers and their jobs in the town.", "短文讲了镇上的许多帮手和他们的工作。"],
        ),
      ],
    ),
    passage(
      "a-walk-to-the-market",
      t("A Walk to the Market", "去集市"),
      `On Saturday, Ravi and his mom walked to the market. Ravi held the shopping list. It said: apples, bread, eggs and flowers for Gran.

First, they stopped at the fruit stand. Ravi picked six shiny red apples. Next, they went to the baker. The shop smelled warm and sweet. The baker gave Ravi a little roll to try.

Then Ravi looked at the list again. Oh no! They had forgotten the eggs. They walked back past the fruit stand to the egg farmer.

At last, they bought yellow flowers for Gran. When Gran saw them, she smiled and gave Ravi a big hug.`,
      [parts, feel],
      [
        ask(
          ["Where did Ravi and his mom stop first?", "拉维和妈妈先去了哪里？"],
          ["The fruit stand", "水果摊"],
          [
            ["The baker", "面包店"],
            ["The egg farmer", "卖鸡蛋的农民那里"],
            ["Gran's house", "奶奶家"],
          ],
          ['The story says, "First, they stopped at the fruit stand."', "故事说：“他们先在水果摊停了下来。”"],
        ),
        ask(
          ["What problem came up in the middle?", "中间出现了什么问题？"],
          ["They had forgotten the eggs", "他们忘了买鸡蛋"],
          [
            ["They lost the list", "他们把清单弄丢了"],
            ["The baker had no bread", "面包师没有面包了"],
            ["It began to rain", "开始下雨了"],
          ],
          ["Ravi looked at the list again and saw that they had forgotten the eggs.", "拉维又看了一遍清单，发现他们忘了买鸡蛋。"],
        ),
        ask(
          ["How did Gran feel when she saw the flowers?", "奶奶看到花时有什么感受？"],
          ["Happy", "很开心"],
          [
            ["Angry", "很生气"],
            ["Sleepy", "很困"],
            ["Scared", "很害怕"],
          ],
          ["Gran smiled and gave Ravi a big hug, which shows she was happy.", "奶奶笑了，还给了拉维一个大大的拥抱，说明她很开心。"],
        ),
      ],
      ["Ravi"],
    ),
    passage(
      "the-new-library",
      t("The New Library", "新图书馆"),
      `For a long time, our town had a tiny library. It had only one room, and there was no place to sit. Then the town built a new library on Oak Street.

On the first day, Mia and her dad went to see it. The doors opened by themselves! Inside, there were rows and rows of books, and big soft chairs by the windows. There was a room just for children, with a rug shaped like a turtle.

Mia got her very own library card. She picked three books about space. "Can we come back next week?" she asked. Her dad laughed. "We can come back every week," he said.`,
      [feel, parts],
      [
        ask(
          ["What was the problem with the old library?", "旧图书馆有什么问题？"],
          ["It was tiny, with no place to sit", "它很小，没有地方坐"],
          [
            ["It had no books", "它没有书"],
            ["It was too far away", "它太远了"],
            ["It was always closed", "它总是关门"],
          ],
          ["The story says the old library had only one room and no place to sit.", "故事说旧图书馆只有一个房间，没有地方坐。"],
        ),
        ask(
          ["What was the rug in the children's room shaped like?", "儿童室的地毯是什么形状的？"],
          ["A turtle", "一只乌龟"],
          [
            ["A star", "一颗星星"],
            ["A rocket", "一枚火箭"],
            ["A book", "一本书"],
          ],
          ["The story says there was a rug shaped like a turtle.", "故事说有一块乌龟形状的地毯。"],
        ),
        ask(
          ["How does Mia feel about the new library?", "米娅觉得新图书馆怎么样？"],
          ["She loves it and wants to come back", "她很喜欢，想再来"],
          [
            ["She is bored", "她觉得无聊"],
            ["She is scared of the doors", "她害怕那扇门"],
            ["She wants to go home", "她想回家"],
          ],
          ["Mia asks if they can come back next week, which shows she loves it.", "米娅问下周能不能再来，说明她很喜欢这里。"],
        ),
      ],
      ["Mia", "Oak"],
    ),
  ],
};

/** animalsBigAndSmall is the reading unit of grade 2 on the biggest and smallest animals. */
export const animalsBigAndSmall: ReadingUnitDef = {
  id: "animals-big-and-small",
  title: t("Animals Big and Small", "大大小小的动物"),
  passages: [
    passage(
      "the-biggest-animal",
      t("The Biggest Animal", "最大的动物"),
      `What is the biggest animal that has ever lived? It is not a dinosaur. It is the blue whale!

A blue whale is longer than two buses in a row. Its heart is as big as a small car. Even a baby blue whale is bigger than an elephant.

You might think such a big animal eats big things, but it does not. A blue whale eats tiny animals called krill. It takes in a huge gulp of water, then pushes the water out and keeps the krill. In one day, it can eat more krill than you could count.

Blue whales sing to each other with low, deep sounds. Their songs can travel very far under the sea.`,
      [topic],
      [
        ask(
          ["What is the biggest animal that has ever lived?", "有史以来最大的动物是什么？"],
          ["The blue whale", "蓝鲸"],
          [
            ["A dinosaur", "恐龙"],
            ["An elephant", "大象"],
            ["A shark", "鲨鱼"],
          ],
          ["The text says the biggest animal that has ever lived is the blue whale.", "短文说有史以来最大的动物是蓝鲸。"],
        ),
        ask(
          ["What does a blue whale eat?", "蓝鲸吃什么？"],
          ["Tiny animals called krill", "一种叫磷虾的小动物"],
          [
            ["Big fish", "大鱼"],
            ["Sea plants", "海里的植物"],
            ["Other whales", "别的鲸"],
          ],
          ["The text says a blue whale eats tiny animals called krill.", "短文说蓝鲸吃一种叫磷虾的小动物。"],
        ),
        ask(
          ["Which detail shows how big a blue whale is?", "哪个细节说明了蓝鲸有多大？"],
          ["Its heart is as big as a small car", "它的心脏和一辆小汽车一样大"],
          [
            ["It sings with low sounds", "它用低沉的声音唱歌"],
            ["It eats krill", "它吃磷虾"],
            ["Its songs travel far", "它的歌声传得很远"],
          ],
          ["A heart as big as a small car tells how huge the whole whale must be.", "心脏和小汽车一样大，说明整头鲸一定非常巨大。"],
        ),
      ],
      [],
      ["krill"],
    ),
    passage(
      "tiny-hummingbirds",
      t("Tiny Hummingbirds", "小小的蜂鸟"),
      `Hummingbirds are some of the smallest birds in the world. The tiniest kind is not much bigger than a bee!

A hummingbird beats its wings so fast that you cannot see them. They make a humming sound, and that is how the bird got its name. It is the only bird that can fly backward, and it can stay still in the air like a helicopter.

Hummingbirds drink sweet juice from flowers with their long, thin beaks. They must eat many times a day, because flying so fast uses a lot of energy. At night, they rest and slow down to save their strength.`,
      [topic],
      [
        ask(
          ["How did the hummingbird get its name?", "蜂鸟的名字是怎么来的？"],
          ["Its wings make a humming sound", "它的翅膀发出嗡嗡声"],
          [
            ["It hums songs", "它会哼歌"],
            ["It lives near bees", "它住在蜜蜂附近"],
            ["It eats bees", "它吃蜜蜂"],
          ],
          [
            "The text says its wings make a humming sound, and that is how the bird got its name.",
            "短文说它的翅膀发出嗡嗡声，这就是它名字的由来。",
          ],
        ),
        ask(
          ["What can a hummingbird do that other birds cannot?", "蜂鸟能做哪件别的鸟做不到的事？"],
          ["Fly backward", "向后飞"],
          [
            ["Swim under water", "在水下游泳"],
            ["Sing at night", "在夜里唱歌"],
            ["Build a nest", "筑巢"],
          ],
          ["The text says it is the only bird that can fly backward.", "短文说它是唯一能向后飞的鸟。"],
        ),
        ask(
          ["Why must hummingbirds eat many times a day?", "蜂鸟为什么一天要吃很多次？"],
          ["Flying so fast uses a lot of energy", "飞得这么快要消耗很多能量"],
          [
            ["Flowers are hard to find", "花很难找到"],
            ["Their beaks are long", "它们的嘴很长"],
            ["They sleep all day", "它们整天睡觉"],
          ],
          [
            "The text says they must eat many times a day because flying so fast uses a lot of energy.",
            "短文说它们一天要吃很多次，因为飞得这么快要消耗很多能量。",
          ],
        ),
      ],
    ),
    passage(
      "the-lion-and-the-mouse",
      t("The Lion and the Mouse", "狮子和老鼠"),
      `A big lion was sleeping in the sun. A little mouse ran across his nose and woke him up. The lion grabbed the mouse with his huge paw.

"Please let me go," cried the mouse. "One day, I will help you." The lion laughed. How could a tiny mouse help a lion? But he let the mouse go.

A few days later, the lion was caught in a hunter's net. He roared and pulled, but he could not get out. The little mouse heard him. She ran to the net and chewed through the ropes until the lion was free.

"You laughed at me," said the mouse, "but even a small friend can be a big help."`,
      [parts, feel],
      [
        ask(
          ["What happens at the beginning of the story?", "故事开头发生了什么？"],
          ["The mouse wakes the lion, and he grabs her", "老鼠吵醒了狮子，狮子抓住了她"],
          [
            ["The lion is caught in a net", "狮子被网困住了"],
            ["The mouse chews the ropes", "老鼠咬断了绳子"],
            ["The hunter runs away", "猎人逃走了"],
          ],
          [
            "At the beginning, the mouse runs across the lion's nose, and he grabs her.",
            "故事开头，老鼠从狮子的鼻子上跑过，狮子抓住了她。",
          ],
        ),
        ask(
          ["How did the mouse solve the lion's problem?", "老鼠是怎样解决狮子的难题的？"],
          ["She chewed through the ropes of the net", "她咬断了网上的绳子"],
          [
            ["She called the other lions", "她叫来了别的狮子"],
            ["She scared the hunter away", "她吓跑了猎人"],
            ["She pulled the net with her paws", "她用爪子拉网"],
          ],
          ["The mouse chewed through the ropes until the lion was free.", "老鼠一直咬绳子，直到狮子脱身。"],
        ),
        ask(
          ["What is the lesson of the story?", "这个故事告诉我们什么道理？"],
          ["Even a small friend can be a big help", "即使是小小的朋友也能帮上大忙"],
          [
            ["Lions are always kind", "狮子总是很善良"],
            ["Do not sleep in the sun", "不要在太阳下睡觉"],
            ["Nets are strong", "网很结实"],
          ],
          [
            "The mouse says it at the end: even a small friend can be a big help.",
            "老鼠在结尾说出了这个道理：即使是小小的朋友也能帮上大忙。",
          ],
        ),
      ],
    ),
  ],
};

/** talesToTell is the reading unit of grade 2 on fables and folk tales. */
export const talesToTell: ReadingUnitDef = {
  id: "tales-to-tell",
  title: t("Tales to Tell", "讲故事"),
  passages: [
    passage(
      "the-ant-and-the-grasshopper",
      t("The Ant and the Grasshopper", "蚂蚁和蚱蜢"),
      `All summer long, a grasshopper sang and played in the warm grass. Each day, he saw an ant walk past, carrying a heavy seed on her back.

"Why do you work so hard?" asked the grasshopper. "Come and play with me!" "I am saving food for the winter," said the ant. "You should do the same." But the grasshopper just laughed and went on singing.

Then winter came. Snow covered the ground, and there was no food to be found. The grasshopper was cold and hungry. He went to the ant's home and asked for help. The kind ant shared some of her seeds, and the grasshopper learned to plan ahead.`,
      [parts, feel],
      [
        ask(
          ["What did the ant do all summer?", "蚂蚁整个夏天都在做什么？"],
          ["She saved food for the winter", "她为冬天储存食物"],
          [
            ["She sang in the grass", "她在草丛里唱歌"],
            ["She slept in the sun", "她在太阳下睡觉"],
            ["She played with the grasshopper", "她和蚱蜢一起玩"],
          ],
          ['The ant said, "I am saving food for the winter."', "蚂蚁说：“我在为冬天储存食物。”"],
        ),
        ask(
          ["How did the grasshopper feel when winter came?", "冬天来了，蚱蜢有什么感受？"],
          ["Cold and hungry", "又冷又饿"],
          [
            ["Happy and full", "又开心又饱"],
            ["Proud", "很骄傲"],
            ["Sleepy and warm", "又困又暖和"],
          ],
          ["The story says the grasshopper was cold and hungry.", "故事说蚱蜢又冷又饿。"],
        ),
        ask(
          ["What did the grasshopper learn?", "蚱蜢学到了什么？"],
          ["To plan ahead", "要提前做好打算"],
          [
            ["To sing louder", "唱得更大声"],
            ["To sleep all winter", "整个冬天睡觉"],
            ["To stay away from ants", "离蚂蚁远一点"],
          ],
          ["The last sentence says the grasshopper learned to plan ahead.", "最后一句说蚱蜢学会了提前做好打算。"],
        ),
      ],
    ),
    passage(
      "the-boy-who-cried-wolf",
      t("The Boy Who Cried Wolf", "狼来了"),
      `A boy watched the sheep on a hill near his village. The days were long, and he was bored.

One day, he had an idea. "Wolf! Wolf!" he shouted. The people of the village ran up the hill to help, but there was no wolf. The boy laughed and laughed. A few days later, he did it again. Once more, the people ran up the hill, and once more there was no wolf. They were angry.

Then one evening, a real wolf came out of the woods. "Wolf! Wolf!" the boy cried. But this time, nobody came. They thought he was playing a trick again. The boy learned that if you tell lies, people will not believe you, even when you tell the truth.`,
      [parts, feel],
      [
        ask(
          ['Why did the boy shout "Wolf!" the first time?', "男孩第一次为什么喊“狼来了”？"],
          ["He was bored and wanted to play a trick", "他觉得无聊，想捉弄人"],
          [
            ["He saw a real wolf", "他看见了一只真的狼"],
            ["He was lost", "他迷路了"],
            ["A sheep was sick", "一只羊病了"],
          ],
          [
            "The story says the boy was bored and laughed when the people came for no reason.",
            "故事说男孩觉得无聊，人们白跑一趟时他哈哈大笑。",
          ],
        ),
        ask(
          ["How did the people feel after the second trick?", "第二次被捉弄后，人们有什么感受？"],
          ["Angry", "很生气"],
          [
            ["Happy", "很开心"],
            ["Proud", "很骄傲"],
            ["Sleepy", "很困"],
          ],
          ['The story says, "They were angry."', "故事说：“他们很生气。”"],
        ),
        ask(
          ["Why did nobody come when the real wolf came?", "真的狼来时为什么没有人来？"],
          ["They thought he was playing a trick again", "他们以为他又在捉弄人"],
          [
            ["They could not hear him", "他们听不见他"],
            ["They were asleep", "他们睡着了"],
            ["They were scared of wolves", "他们害怕狼"],
          ],
          ["The story says nobody came because they thought he was playing a trick again.", "故事说没有人来，因为他们以为他又在捉弄人。"],
        ),
      ],
    ),
    passage(
      "the-little-red-hen",
      t("The Little Red Hen", "小红母鸡"),
      `The little red hen found some grains of wheat. "Who will help me plant this wheat?" she asked. "Not I," said the cat. "Not I," said the dog. "Not I," said the duck. So she planted it herself.

The wheat grew tall and golden. "Who will help me cut the wheat?" she asked. "Not I," they all said. So she cut it herself. Then she took it to the mill and made flour, and she baked a loaf of bread, all by herself.

The warm bread smelled so good. "Who will help me eat this bread?" asked the hen. "I will!" said the cat, the dog and the duck. "No," said the little red hen. "I did all the work, so my chicks and I will eat it."`,
      [parts, feel],
      [
        ask(
          ["What did the little red hen find?", "小红母鸡找到了什么？"],
          ["Some grains of wheat", "一些麦粒"],
          [
            ["A loaf of bread", "一条面包"],
            ["A bag of flour", "一袋面粉"],
            ["Some eggs", "一些鸡蛋"],
          ],
          ["The story begins when the hen finds some grains of wheat.", "故事从母鸡找到一些麦粒开始。"],
        ),
        ask(
          ["Who helped the hen plant and cut the wheat?", "谁帮母鸡种麦子、割麦子？"],
          ["Nobody, so she did it herself", "没有人，所以她自己做"],
          [
            ["The cat", "猫"],
            ["The dog and the duck", "狗和鸭子"],
            ["Her chicks", "她的小鸡"],
          ],
          ['Each time, the others said "Not I," so the hen did it herself.', "每次别的动物都说“我不干”，所以母鸡只好自己做。"],
        ),
        ask(
          ["Why did the hen not share the bread with the others?", "母鸡为什么不和别的动物分享面包？"],
          ["They did not help with any of the work", "它们一点活儿都没帮忙"],
          [
            ["There was not enough bread", "面包不够"],
            ["The bread was not done", "面包还没烤好"],
            ["They did not like bread", "它们不喜欢面包"],
          ],
          ['The hen says, "I did all the work, so my chicks and I will eat it."', "母鸡说：“所有的活儿都是我干的，所以我和我的小鸡来吃。”"],
        ),
      ],
    ),
  ],
};

/** howThingsWork is the reading unit of grade 2 on wheels, magnets and kites. */
export const howThingsWork: ReadingUnitDef = {
  id: "how-things-work",
  title: t("How Things Work", "东西是怎样工作的"),
  passages: [
    passage(
      "wheels-make-work-easy",
      t("Wheels Make Work Easy", "轮子让工作变轻松"),
      `Try to push a heavy box across the floor. It is hard work! The box rubs on the floor and does not want to move. Now put the box on a cart with wheels. It rolls along with just a small push.

Wheels make work easier because they roll instead of rubbing. That is why we put wheels on so many things. Cars, bikes, trains and wagons all roll on wheels. A shopping cart has wheels, and so does a suitcase.

People made the first wheels a very long time ago, from slices of wood. Since then, wheels have helped us carry heavy things, travel far and get places fast.`,
      [topic],
      [
        ask(
          ["Why is it hard to push a heavy box on the floor?", "为什么在地板上推重箱子很费劲？"],
          ["The box rubs on the floor", "箱子在地板上摩擦"],
          [
            ["The box has wheels", "箱子有轮子"],
            ["The floor is wet", "地板是湿的"],
            ["The box is empty", "箱子是空的"],
          ],
          ["The text says the box rubs on the floor and does not want to move.", "短文说箱子在地板上摩擦，不容易动。"],
        ),
        ask(
          ["Why do wheels make work easier?", "为什么轮子能让工作更轻松？"],
          ["They roll instead of rubbing", "它们滚动而不是摩擦"],
          [
            ["They are made of wood", "它们是木头做的"],
            ["They make things lighter", "它们让东西变轻"],
            ["They push by themselves", "它们会自己推"],
          ],
          [
            "The text says wheels make work easier because they roll instead of rubbing.",
            "短文说轮子能让工作更轻松，因为它们滚动而不是摩擦。",
          ],
        ),
        ask(
          ["What were the first wheels made from?", "最早的轮子是用什么做的？"],
          ["Slices of wood", "木头片"],
          [
            ["Metal", "金属"],
            ["Stone balls", "石球"],
            ["Rubber", "橡胶"],
          ],
          ["The text says people made the first wheels from slices of wood.", "短文说人们用木头片做了最早的轮子。"],
        ),
      ],
    ),
    passage(
      "magnets-pull",
      t("Magnets Pull", "磁铁会吸"),
      `A magnet is a special kind of metal. It can pull some things toward it without even touching them!

Hold a magnet near a paper clip, and the clip will jump to the magnet. Magnets pull on things made of iron, such as nails and pins. But they do not pull on wood, paper, glass or plastic. Try it with a spoon, a cork and a coin, and see what happens.

Every magnet has two ends. If you put two magnets together one way, they snap and stick. Turn one around, and they push each other away. You can feel the push in your hands. Magnets help us every day, from the door of the fridge to the speakers in a radio.`,
      [topic],
      [
        ask(
          ["Which things does a magnet pull?", "磁铁会吸哪些东西？"],
          ["Things made of iron, such as nails", "铁做的东西，比如钉子"],
          [
            ["Wood and paper", "木头和纸"],
            ["Glass", "玻璃"],
            ["Plastic toys", "塑料玩具"],
          ],
          ["The text says magnets pull on things made of iron, such as nails and pins.", "短文说磁铁会吸铁做的东西，比如钉子和别针。"],
        ),
        ask(
          ["What happens if you turn one of two magnets around?", "如果把两块磁铁中的一块掉个头，会怎样？"],
          ["They push each other away", "它们会互相推开"],
          [
            ["They melt", "它们会融化"],
            ["They stick even harder", "它们粘得更紧"],
            ["Nothing at all", "什么也不会发生"],
          ],
          ['The text says, "Turn one around, and they push each other away."', "短文说：“把一块掉个头，它们就会互相推开。”"],
        ),
        ask(
          ["What is the text mostly about?", "这篇短文主要讲什么？"],
          ["What magnets do", "磁铁的作用"],
          [
            ["How to make a radio", "怎样做收音机"],
            ["Paper clips", "回形针"],
            ["The door of the fridge", "冰箱门"],
          ],
          [
            "Every part tells about magnets: what they pull, their two ends and how they help us.",
            "每一部分都在讲磁铁：它吸什么、它的两端以及它怎样帮助我们。",
          ],
        ),
      ],
    ),
    passage(
      "how-a-kite-flies",
      t("How a Kite Flies", "风筝是怎样飞起来的"),
      `On a windy day, Leo and his sister took their new kite to the park. Leo held the string and ran as fast as he could. The kite bumped along the grass, but it would not go up.

"Wait for a strong wind," said his sister. "Then hold the kite up high and let the wind catch it." Leo waited. When the wind blew hard, he let go. The kite climbed up and up into the sky!

A kite flies because the wind pushes up under it. The string holds the kite at a slant, so the wind can lift it. If the wind stops, the kite falls. That is why kites need a windy day.`,
      [parts, topic],
      [
        ask(
          ["What was Leo's problem at first?", "利奥一开始遇到了什么问题？"],
          ["The kite would not go up", "风筝飞不起来"],
          [
            ["He lost the kite", "他把风筝弄丢了"],
            ["The string broke", "线断了"],
            ["It began to rain", "开始下雨了"],
          ],
          ["The story says the kite bumped along the grass, but it would not go up.", "故事说风筝在草地上一路磕碰，就是飞不起来。"],
        ),
        ask(
          ["How did Leo get the kite to fly?", "利奥是怎样让风筝飞起来的？"],
          ["He waited for a strong wind and let it catch the kite", "他等来一阵大风，让风托起风筝"],
          [
            ["He ran faster", "他跑得更快"],
            ["He threw the kite", "他把风筝扔了出去"],
            ["He cut the string", "他剪断了线"],
          ],
          [
            "His sister told him to wait for a strong wind, and when it blew hard, the kite climbed up.",
            "姐姐让他等一阵大风，风一大，风筝就升上去了。",
          ],
        ),
        ask(
          ["What makes a kite fly?", "是什么让风筝飞起来的？"],
          ["The wind pushing up under it", "从下面往上吹的风"],
          [
            ["The sun", "太阳"],
            ["Running on the grass", "在草地上跑"],
            ["A motor", "发动机"],
          ],
          ["The last part says a kite flies because the wind pushes up under it.", "最后一部分说风筝能飞是因为风从下面往上推它。"],
        ),
      ],
      ["Leo"],
    ),
  ],
};

/** lettersAndCelebrations is the reading unit of grade 2 on a letter, a festival and a party. */
export const lettersAndCelebrations: ReadingUnitDef = {
  id: "letters-and-celebrations",
  title: t("Letters and Celebrations", "书信和庆祝"),
  passages: [
    passage(
      "a-letter-to-gran",
      t("A Letter to Gran", "给奶奶的信"),
      `Dear Gran,

Thank you for the birthday gift! I love the blue backpack. It has a pocket for my pencils and a place for my water. I take it to school every day.

My birthday party was so much fun. Five friends came to our house. We played games in the yard, and Dad made a cake shaped like a rocket. When I blew out the candles, I made a wish. I wished that you could come and visit soon.

I miss you. Please write back and tell me about your garden.

Love,
Nora`,
      [feel],
      [
        ask(
          ["Why did Nora write to Gran?", "诺拉为什么给奶奶写信？"],
          ["To thank her for the birthday gift", "感谢她送的生日礼物"],
          [
            ["To ask for a cake", "向她要蛋糕"],
            ["To tell her about school", "告诉她学校里的事"],
            ["To invite her to the party", "邀请她来参加聚会"],
          ],
          ['The letter starts, "Thank you for the birthday gift!"', "信的开头写道：“谢谢您送的生日礼物！”"],
        ),
        ask(
          ["What was the cake shaped like?", "蛋糕是什么形状的？"],
          ["A rocket", "一枚火箭"],
          [
            ["A backpack", "一个背包"],
            ["A garden", "一个花园"],
            ["A star", "一颗星星"],
          ],
          ["Nora says Dad made a cake shaped like a rocket.", "诺拉说爸爸做了一个火箭形状的蛋糕。"],
        ),
        ask(
          ["What did Nora wish for?", "诺拉许了什么愿？"],
          ["That Gran could come and visit soon", "希望奶奶能很快来看她"],
          [
            ["A new backpack", "一个新背包"],
            ["More friends", "更多朋友"],
            ["A bigger cake", "更大的蛋糕"],
          ],
          ["Nora wished that Gran could come and visit soon.", "诺拉许愿奶奶能很快来看她。"],
        ),
      ],
      ["Nora"],
    ),
    passage(
      "the-moon-festival",
      t("The Moon Festival", "中秋节"),
      `In the fall, when the moon is round and bright, many families in China and other places have the Moon Festival.

On that night, families get together for a big dinner. After dinner, they go outside to look at the full moon. Children carry paper lanterns that glow in the dark. Some lanterns are shaped like rabbits, fish or stars.

Families also share mooncakes. A mooncake is a round cake with a sweet filling inside, such as bean paste or nuts. Its round shape stands for the full moon, and for a family that is all together.

People who live far from home look at the moon too, and think of the ones they love.`,
      [topic],
      [
        ask(
          ["When is the Moon Festival?", "中秋节在什么时候？"],
          ["In the fall, when the moon is round and bright", "秋天，月亮又圆又亮的时候"],
          [
            ["In spring, when it rains", "春天下雨的时候"],
            ["In summer, at the beach", "夏天在海滩上的时候"],
            ["In winter, when it snows", "冬天下雪的时候"],
          ],
          ["The text says the Moon Festival is in the fall, when the moon is round and bright.", "短文说中秋节在秋天，那时月亮又圆又亮。"],
        ),
        ask(
          ["What does the round shape of a mooncake stand for?", "月饼的圆形代表什么？"],
          ["The full moon and a family all together", "圆圆的月亮和团圆的家人"],
          [
            ["The sun", "太阳"],
            ["A lantern", "灯笼"],
            ["A rabbit", "兔子"],
          ],
          [
            "The text says its round shape stands for the full moon, and for a family that is all together.",
            "短文说它的圆形代表满月，也代表全家团圆。",
          ],
        ),
        ask(
          ["What is the text mostly about?", "这篇短文主要讲什么？"],
          ["How families celebrate the Moon Festival", "家人们怎样过中秋节"],
          [
            ["How to make a lantern", "怎样做灯笼"],
            ["Why the moon changes shape", "月亮为什么会变形状"],
            ["Rabbits and fish", "兔子和鱼"],
          ],
          ["Every part tells what families do at the Moon Festival.", "每一部分都在讲家人们在中秋节做什么。"],
        ),
      ],
      ["China"],
      ["mooncake", "mooncakes"],
    ),
    passage(
      "a-party-for-pedro",
      t("A Party for Pedro", "为佩德罗办的聚会"),
      `Pedro had been the school's gardener for many years. Now he was going to stop working. The children in Class Two wanted to say thank you.

"Let us have a party," said Ella. "But it must be a surprise!" The class made a big card and signed their names on it. They painted a picture of the school garden, with all the sunflowers Pedro had planted.

On his last day, the teacher asked Pedro to come to the classroom. When he opened the door, everyone shouted, "Surprise!" Pedro was so happy that he had tears in his eyes. "This is the best gift a gardener could get," he said. "You have all grown so well."`,
      [parts, feel],
      [
        ask(
          ["Why did the class want to have a party?", "全班为什么想办一个聚会？"],
          ["To say thank you to Pedro", "向佩德罗表示感谢"],
          [
            ["It was Ella's birthday", "那天是埃拉的生日"],
            ["To plant sunflowers", "为了种向日葵"],
            ["It was the first day of school", "那天是开学第一天"],
          ],
          [
            "The story says the children wanted to say thank you because Pedro was going to stop working.",
            "故事说佩德罗要退休了，孩子们想向他道谢。",
          ],
        ),
        ask(
          ["What did the class paint?", "全班画了什么？"],
          ["A picture of the school garden", "一幅学校花园的画"],
          [
            ["A picture of Pedro's house", "一幅佩德罗家的画"],
            ["A big rocket", "一枚大火箭"],
            ["Their classroom", "他们的教室"],
          ],
          [
            "The story says they painted a picture of the school garden, with all the sunflowers.",
            "故事说他们画了一幅学校花园的画，上面有所有的向日葵。",
          ],
        ),
        ask(
          ["How did Pedro feel at the surprise?", "看到惊喜时佩德罗有什么感受？"],
          ["So happy that he had tears in his eyes", "高兴得热泪盈眶"],
          [
            ["Angry", "很生气"],
            ["Scared", "很害怕"],
            ["Bored", "很无聊"],
          ],
          ["The story says Pedro was so happy that he had tears in his eyes.", "故事说佩德罗高兴得热泪盈眶。"],
        ),
      ],
      ["Pedro", "Ella"],
    ),
  ],
};

/** readingUnits2 are the reading units of grade 2, one for each unit of the course. */
export const readingUnits2: readonly ReadingUnitDef[] = [
  longAgoAndToday,
  ourNeighborhood,
  animalsBigAndSmall,
  talesToTell,
  howThingsWork,
  lettersAndCelebrations,
];
