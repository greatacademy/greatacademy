// Grade 3: the reading unit of the theme of ancient China: the Yellow River, millet farming, the floods, oracle bones,
// bronze, writing with a brush, the Great Wall and silk.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, clues, passage, words } from "./reading-kit.ts";

const china = words("words-of-ancient-china");
const walls = words("words-of-walls-and-watchtowers");
const thinking = words("words-for-thinking-and-wondering");

/** alongTheYellowRiver is the reading unit of grade 3 on the early civilization of China along the Yellow River. */
export const alongTheYellowRiver: ReadingUnitDef = {
  id: "along-the-yellow-river",
  title: t("Along the Yellow River", "黄河两岸"),
  passages: [
    passage(
      "the-mother-river",
      t("The Mother River", "母亲河"),
      `The Yellow River is one of the longest rivers in the world. It begins high in the mountains of western China and winds east for thousands of miles until it reaches the sea.

The river gets its name from its color. As it flows across the land, it picks up fine yellow soil and carries it along. The water looks like thick soup the color of sand.

More than four thousand years ago, people began to farm along the banks of the river. The soil there was soft and rich, and the river gave them water for their crops. Villages grew into towns, and towns grew into the first kingdoms of China. That is why many Chinese people call the Yellow River the "Mother River." Like a mother, it fed the people and helped them grow.

But the river could also be dangerous. When heavy rains fell, it burst over its banks and swept away fields and homes. People both loved the river and feared it.

The story of ancient China begins on the banks of this mighty yellow river.`,
      [clues, china],
      [
        ask(
          ["How did the Yellow River get its name?", "黄河的名字是怎么来的？"],
          ["It carries fine yellow soil that colors the water", "它带着细细的黄土，把河水染成了黄色"],
          [
            ["Yellow flowers grow along its banks", "河岸边长着黄色的花"],
            ["It begins high in yellow mountains", "它发源于黄色的高山"],
            ["The sun shines yellow on its water", "阳光照在河面上是黄色的"],
          ],
          [
            "The second paragraph says the river picks up fine yellow soil as it flows and carries it along.",
            "第二段说，黄河流过大地时卷起细细的黄土，并带着它一起流动。",
          ],
        ),
        ask(
          ["Why do many Chinese people call it the Mother River?", "为什么许多中国人把它叫作母亲河？"],
          ["Like a mother, it fed the people and helped them grow", "它像母亲一样养育人们，帮助他们成长"],
          [
            ["It is the oldest river in the world", "它是世界上最古老的河"],
            ["It never floods or harms anyone", "它从不泛滥，也从不伤害任何人"],
            ["A queen named it after her mother", "一位王后用她母亲的名字给它命名"],
          ],
          [
            "The third paragraph says that like a mother, the river fed the people and helped them grow.",
            "第三段说，这条河像母亲一样养育人们，帮助他们成长。",
          ],
        ),
        ask(
          ["Why did people both love the river and fear it?", "为什么人们既爱这条河又怕它？"],
          ["It gave them water and rich soil, but it also flooded", "它给人们水和肥沃的土壤，但也会泛滥"],
          [
            ["It was too far from their villages", "它离村子太远了"],
            ["Its water was too salty to drink", "它的水太咸，不能喝"],
            ["It changed its color every year", "它每年都会改变颜色"],
          ],
          [
            "The river gave water and rich soil for crops, but the fourth paragraph says that in heavy rains it swept away fields and homes.",
            "这条河为庄稼提供了水和肥沃的土壤，但第四段说，下大雨时它会冲走田地和房屋。",
          ],
        ),
      ],
      ["China", "Chinese"],
    ),
    passage(
      "millet-in-yellow-earth",
      t("Millet in Yellow Earth", "黄土地上的小米"),
      `The first farmers along the Yellow River did not grow rice. The land in the north was too dry for rice paddies, which need to be flooded with water. Instead, they grew a small, tough grain called millet.

Millet was a good choice for the yellow earth. Its seeds are tiny and round, like beads. The plants need only a little rain, and they grow quickly in the short, hot summer. Even in a dry year, a field of millet could still feed a family.

Farmers dug the soft soil with tools made of stone, wood and bone. In spring they planted the seeds in rows, and in autumn they cut the stalks and beat them to shake out the grain. They stored the millet in deep pits lined with clay, so that it would stay dry all winter.

Families cooked millet into a thick, warm porridge. They also raised pigs and chickens and kept dogs. Far to the south, along another great river, people learned to grow rice. In time, millet and rice became the two main grains of China.`,
      [clues, china],
      [
        ask(
          ["Why did the first farmers in the north grow millet instead of rice?", "为什么北方最早的农民种小米而不种水稻？"],
          ["The land was too dry for rice paddies", "那里的土地太干，没法种水稻田"],
          [
            ["Rice was too expensive to buy", "大米太贵买不起"],
            ["Millet tasted sweeter than rice", "小米比大米更甜"],
            ["The river was too far away from the hills", "河离山太远了"],
          ],
          [
            "The first paragraph says the land in the north was too dry for rice paddies, which need to be flooded with water.",
            "第一段说，北方的土地太干，种不了需要灌满水的水稻田。",
          ],
        ),
        ask(
          ["How did farmers keep their millet dry all winter?", "农民怎样让小米整个冬天保持干燥？"],
          ["They stored it in deep pits lined with clay", "他们把它存放在用黏土抹过的深坑里"],
          [
            ["They hung it from the roofs of their homes", "他们把它挂在屋顶上"],
            ["They cooked all of it into porridge", "他们把它全都煮成了粥"],
            ["They carried it to the south", "他们把它运到南方"],
          ],
          [
            "The third paragraph says farmers stored the millet in deep pits lined with clay, so that it would stay dry all winter.",
            "第三段说，农民把小米存放在用黏土抹过的深坑里，好让它整个冬天保持干燥。",
          ],
        ),
        ask(
          ["What are millet seeds like?", "小米的种子是什么样的？"],
          ["Tiny and round, like beads", "又小又圆，像珠子一样"],
          [
            ["Long and flat, like leaves", "又长又扁，像叶子一样"],
            ["Large and soft, like plums", "又大又软，像李子一样"],
            ["Sharp and hard, like stone tools", "又尖又硬，像石头工具一样"],
          ],
          ["The second paragraph says millet seeds are tiny and round, like beads.", "第二段说，小米的种子又小又圆，像珠子一样。"],
        ),
      ],
      ["China"],
    ),
    passage(
      "taming-the-floods",
      t("Taming the Floods", "治理洪水"),
      `The yellow soil that made the river's fields so rich also made it dangerous. Year after year, the soil sank to the bottom of the river, and the riverbed slowly rose. When summer rains came, the water had nowhere to go but over the banks.

An old Chinese story tells of a man named Yu who lived more than four thousand years ago. In his time, a great flood covered the land for many years. Yu's father had tried to stop it by building walls of earth, but the water broke through them.

Yu chose a different way. Instead of trying to hold the water back, he and thousands of laborers dug canals to lead it away to the sea. The story says that Yu worked for thirteen years and was so busy that he passed his own home three times without going in. At last the flood went down, and the people made him their king.

For thousands of years after, people kept building levees along the river and digging canals. Taming the Yellow River was a job that never ended.`,
      [clues, china, walls],
      [
        ask(
          ["Why did the riverbed slowly rise?", "为什么河床会慢慢升高？"],
          ["Yellow soil sank to the bottom of the river year after year", "黄土年复一年地沉到河底"],
          [
            ["People threw stones into the river", "人们往河里扔石头"],
            ["The river froze every winter", "河水每年冬天都会结冰"],
            ["Laborers built canals on the riverbed", "工人们在河床上挖运河"],
          ],
          [
            "The first paragraph says that year after year the soil sank to the bottom of the river, and the riverbed slowly rose.",
            "第一段说，泥土年复一年地沉到河底，河床就慢慢升高了。",
          ],
        ),
        ask(
          ["How was Yu's way different from his father's?", "禹的办法和他父亲的有什么不同？"],
          ["Yu dug canals to lead the water away instead of holding it back", "禹挖运河把水引走，而不是把水挡住"],
          [
            ["Yu built taller walls of earth", "禹筑起了更高的土墙"],
            ["Yu moved all the people to the mountains", "禹把所有人都迁到了山里"],
            ["Yu waited for the flood to end by itself", "禹等着洪水自己退去"],
          ],
          [
            "The second and third paragraphs say Yu's father built walls of earth, but Yu dug canals to lead the water away to the sea.",
            "第二段和第三段说，禹的父亲修筑土墙，而禹挖运河把水引到海里。",
          ],
        ),
        ask(
          ["What does the story about Yu passing his home three times show?", "禹三次经过家门而不入的故事说明了什么？"],
          ["He was so busy with his work that he would not stop", "他工作非常忙，不肯停下来"],
          [
            ["He did not like his family", "他不喜欢他的家人"],
            ["He was lost and could not find his house", "他迷路了，找不到自己的家"],
            ["His home had been washed away", "他的家已经被冲走了"],
          ],
          [
            "The third paragraph says Yu was so busy that he passed his own home three times without going in.",
            "第三段说，禹太忙了，三次经过自己的家都没有进去。",
          ],
        ),
      ],
      ["Chinese", "Yu", "Yu's"],
    ),
    passage(
      "bones-that-asked-questions",
      t("Bones That Asked Questions", "会提问的骨头"),
      `About three thousand years ago, the kings of a kingdom called Shang wanted to know what the future would bring. Would it rain? Would the harvest be good? Should the army go to war? To find out, they asked their ancestors.

The kings believed that the spirits of their ancestors could see the future. To ask them a question, a priest took a flat piece of bone, often from an ox, or the shell of a turtle. He carved the question onto it. Then he pressed a hot metal rod against the back until the bone cracked. The priest studied the shape of the cracks and decided what the answer was. Sometimes the answer was carved onto the bone too.

For a long time, these bones lay forgotten under the ground. Then, a little more than a hundred years ago, people noticed strange marks on old bones that were being sold as medicine. The marks turned out to be the oldest Chinese writing ever found.

Today, experts have read thousands of these bones. They tell us what the Shang kings wondered about and what they feared.`,
      [clues, china, thinking],
      [
        ask(
          ["Why did the Shang kings carve questions onto bones?", "商朝的国王为什么要把问题刻在骨头上？"],
          ["To ask their ancestors about the future", "为了向祖先询问将来的事"],
          [
            ["To sell them as medicine", "为了把它们当作药卖掉"],
            ["To teach children how to write", "为了教孩子写字"],
            ["To keep a list of their soldiers", "为了记下他们士兵的名单"],
          ],
          [
            "The first two paragraphs say the kings wanted to know the future, and they believed the spirits of their ancestors could see it.",
            "前两段说，国王们想知道将来会怎样，他们相信祖先的灵魂能看见将来。",
          ],
        ),
        ask(
          ["How did the priest get an answer from a bone?", "祭司怎样从骨头上得到答案？"],
          ["He cracked it with a hot rod and studied the cracks", "他用烧热的棒子把骨头烫裂，再观察裂纹"],
          [
            ["He listened to it with his ear", "他把耳朵贴上去听"],
            ["He buried it under the ground for a year", "他把它埋在地下一年"],
            ["He asked a turtle to read it", "他请一只乌龟来读"],
          ],
          [
            "The second paragraph says the priest pressed a hot metal rod against the bone until it cracked, then studied the shape of the cracks.",
            "第二段说，祭司把烧热的金属棒压在骨头背面，直到骨头裂开，再观察裂纹的形状。",
          ],
        ),
        ask(
          ["Why are these bones important today?", "这些骨头今天为什么很重要？"],
          ["Their marks are the oldest Chinese writing ever found", "上面的刻痕是迄今发现的最古老的汉字"],
          [
            ["They can still tell the future", "它们现在还能预知未来"],
            ["They are the biggest bones ever found", "它们是迄今发现的最大的骨头"],
            ["They show how to cure every sickness", "它们写着怎样治好所有的病"],
          ],
          [
            "The third paragraph says the marks on the bones turned out to be the oldest Chinese writing ever found.",
            "第三段说，骨头上的刻痕原来是迄今发现的最古老的中文文字。",
          ],
        ),
      ],
      ["Shang", "Chinese"],
    ),
    passage(
      "bells-and-pots-of-bronze",
      t("Bells and Pots of Bronze", "青铜的钟和鼎"),
      `Long before people in China used iron, they learned to make a hard, shiny metal called bronze. Bronze is a mix of two softer metals, copper and tin. When the two are melted together, they make a metal that is much stronger than either one alone.

Making bronze was hard work. Workers dug the metal out of the ground and heated it in fires hotter than any kitchen oven. They made a mold out of clay and poured the glowing liquid metal into it. When the metal cooled, they broke the mold open, and the bronze object was inside.

The Shang and the kings who came after them used bronze for their finest things. They made huge pots with three or four legs, called ding, for cooking meat for their ancestors. They made swords, axes and the wheels of chariots. Some pots were covered with patterns of dragons and other animals.

They also made sets of bronze bells. Each bell rang a different note, and musicians struck them with wooden hammers to play songs. A set found in one tomb has sixty-five bells, and it can still be played today.`,
      [clues, china],
      [
        ask(
          ["What is bronze made of?", "青铜是用什么做的？"],
          ["A mix of copper and tin", "铜和锡的混合物"],
          [
            ["Iron and clay", "铁和黏土"],
            ["Gold and silver", "金和银"],
            ["Stone and wood", "石头和木头"],
          ],
          [
            "The first paragraph says bronze is a mix of two softer metals, copper and tin.",
            "第一段说，青铜是两种较软的金属——铜和锡——的混合物。",
          ],
        ),
        ask(
          ["Why did workers break the clay mold open?", "工人为什么要把黏土模子打破？"],
          ["The bronze object was inside it after the metal cooled", "金属冷却后，青铜器就在模子里面"],
          [
            ["The mold was too hot to touch", "模子太烫，没法碰"],
            ["They needed the clay for cooking pots", "他们需要用黏土做煮饭的锅"],
            ["The king did not like the shape", "国王不喜欢它的形状"],
          ],
          [
            "The second paragraph says that when the metal cooled, they broke the mold open, and the bronze object was inside.",
            "第二段说，金属冷却以后，他们把模子打破，青铜器就在里面。",
          ],
        ),
        ask(
          ["How did musicians play the bronze bells?", "乐师怎样演奏青铜钟？"],
          ["They struck them with wooden hammers", "他们用木槌敲击它们"],
          [
            ["They blew into them like flutes", "他们像吹笛子一样往里吹气"],
            ["They shook them like rattles", "他们像摇拨浪鼓一样摇它们"],
            ["They rubbed them with their hands", "他们用手摩擦它们"],
          ],
          [
            "The last paragraph says musicians struck the bells with wooden hammers to play songs.",
            "最后一段说，乐师用木槌敲击编钟来演奏乐曲。",
          ],
        ),
      ],
      ["China", "Shang"],
      ["ding"],
    ),
    passage(
      "writing-with-a-brush",
      t("Writing with a Brush", "用毛笔写字"),
      `Chinese writing is very different from English. English uses twenty-six letters that stand for sounds. Chinese uses thousands of characters, and each one stands for a word or a part of a word. Some of the oldest characters began as pictures. The character for "mountain" still looks a little like three peaks, and the character for "tree" looks like a tree with roots and branches.

For more than two thousand years, people in China wrote with a brush made of animal hair. They dipped it in black ink and painted each character with strokes in a set order. Writing beautifully with a brush is called calligraphy, and it is an art in China, just like painting.

Long ago, people wrote on strips of bamboo tied together, or on silk. Then, about two thousand years ago, the Chinese learned to make paper from bark and old rags. Paper was cheap and light, so books could be copied and shared. Long poems and stories were written on scrolls that rolled up for keeping.

Today, many children in China still practice calligraphy. A good teacher says that a calm mind makes a steady hand.`,
      [clues, china],
      [
        ask(
          ["How is Chinese writing different from English writing?", "中文和英文的书写有什么不同？"],
          ["Chinese uses thousands of characters that stand for words", "中文用几千个代表词语的字"],
          [
            ["Chinese uses twenty-six letters for sounds", "中文用二十六个代表读音的字母"],
            ["Chinese has no characters at all", "中文根本没有字"],
            ["Chinese is written only on paper", "中文只能写在纸上"],
          ],
          [
            "The first paragraph says English uses twenty-six letters for sounds, while Chinese uses thousands of characters that each stand for a word or a part of one.",
            "第一段说，英文用二十六个代表读音的字母，而中文用几千个字，每个字代表一个词或词的一部分。",
          ],
        ),
        ask(
          ["What is calligraphy?", "什么是书法？"],
          ["Writing beautifully with a brush", "用毛笔把字写得很美"],
          [
            ["Making paper from bark and rags", "用树皮和破布造纸"],
            ["Tying strips of bamboo together", "把竹片绑在一起"],
            ["Carving questions onto bones", "把问题刻在骨头上"],
          ],
          ["The second paragraph says writing beautifully with a brush is called calligraphy.", "第二段说，用毛笔把字写得很美叫作书法。"],
        ),
        ask(
          ["Why did paper help books to be shared?", "为什么纸让书更容易流传？"],
          ["It was cheap and light, so books could be copied", "它又便宜又轻，所以书可以被抄写"],
          [
            ["It was stronger than bamboo or silk", "它比竹子和丝绸更结实"],
            ["It could be rolled into a brush", "它可以卷成一支毛笔"],
            ["It made the ink turn black", "它能让墨变黑"],
          ],
          [
            "The third paragraph says paper was cheap and light, so books could be copied and shared.",
            "第三段说，纸又便宜又轻，所以书可以被抄写和分享。",
          ],
        ),
      ],
      ["Chinese", "English", "China"],
    ),
    passage(
      "the-long-wall",
      t("The Long Wall", "长城"),
      `In the north of China, a wall winds over mountains and across deserts for thousands of miles. It is called the Great Wall, and it was built to keep out invaders.

For hundreds of years, horse riders from the grasslands to the north attacked the farms and towns of China. Kings ordered their people to build walls of packed earth to stop them. More than two thousand years ago, the first emperor of all China joined many of these walls into one long barrier.

Later rulers made the wall longer and stronger. The part that most visitors see today was built of brick and stone about five hundred years ago. Its top is so wide that soldiers could march along it five in a row. Laborers carried every heavy block up steep hills by hand, and many of them died at the work.

Along the wall stand thousands of watchtowers. A garrison of soldiers lived in them and kept watch day and night. When they saw invaders, they lit a beacon fire. The smoke could be seen from the next tower, and the warning raced along the wall faster than any horse.`,
      [clues, walls],
      [
        ask(
          ["Why was the Great Wall built?", "长城是为什么修建的？"],
          ["To keep out invaders from the north", "为了挡住北方来的入侵者"],
          [
            ["To keep the Yellow River from flooding", "为了防止黄河泛滥"],
            ["To give soldiers a place to grow millet", "为了给士兵一个种小米的地方"],
            ["To mark the road to the sea", "为了标出通往大海的路"],
          ],
          [
            "The first paragraph says the Great Wall was built to keep out invaders, and the second says riders from the north attacked China's farms and towns.",
            "第一段说长城是为了挡住入侵者而修建的，第二段说北方的骑兵会袭击中国的农田和城镇。",
          ],
        ),
        ask(
          ["What did the first emperor of all China do with the old walls?", "统一中国的第一位皇帝怎样处理那些旧城墙？"],
          ["He joined many of them into one long barrier", "他把许多段城墙连成了一道长长的屏障"],
          [
            ["He knocked them all down", "他把它们全部推倒了"],
            ["He built them out of brick and stone", "他用砖和石头修建了它们"],
            ["He moved them to the south", "他把它们搬到了南方"],
          ],
          [
            "The second paragraph says the first emperor of all China joined many of these walls into one long barrier.",
            "第二段说，统一中国的第一位皇帝把许多段城墙连成了一道长长的屏障。",
          ],
        ),
        ask(
          ["How did soldiers on the wall send a warning?", "城墙上的士兵怎样传递警报？"],
          ["They lit a beacon fire that the next tower could see", "他们点燃烽火，让下一座烽火台看见"],
          [
            ["They rode horses along the top of the wall", "他们骑马沿着城墙顶跑"],
            ["They rang bronze bells in the towers", "他们敲响塔里的青铜钟"],
            ["They wrote letters on scrolls", "他们在卷轴上写信"],
          ],
          [
            "The last paragraph says soldiers lit a beacon fire, and the smoke could be seen from the next tower.",
            "最后一段说，士兵点燃烽火，下一座烽火台就能看见烟。",
          ],
        ),
      ],
      ["China", "Great", "Wall"],
    ),
    passage(
      "a-thread-from-a-cocoon",
      t("A Thread from a Cocoon", "蚕茧里的一根丝"),
      `An old Chinese story tells how silk was found. One day a queen was sitting under a mulberry tree, drinking a cup of hot tea. A small white cocoon fell from the branches into her cup. As she lifted it out, a fine, shining thread began to unwind. It went on and on, longer than the garden. The queen had an idea: what if this thread could be woven into cloth?

Whether or not the story is true, people in China were making silk at least five thousand years ago. Silk comes from silkworms, which are caterpillars that eat only mulberry leaves. When a silkworm is ready to change into a moth, it spins a cocoon around itself from one very long thread.

Workers dropped the cocoons into hot water to loosen the thread. Then they unwound it and twisted several threads together. Weavers made the threads into soft, light cloth that shone in the sun.

For a long time, only China knew how to make silk. Traders carried it thousands of miles west, along roads that came to be called the Silk Road. Silk was worth so much that it was sometimes used instead of money.`,
      [clues, china],
      [
        ask(
          ["In the old story, how did the queen find silk?", "在古老的故事里，王后是怎样发现丝的？"],
          ["A cocoon fell into her tea, and a thread began to unwind", "一个蚕茧掉进她的茶里，一根丝开始散开"],
          [
            ["She found a moth weaving cloth in the garden", "她在花园里发现一只飞蛾在织布"],
            ["A trader brought it to her from the west", "一个商人从西方给她带来了丝"],
            ["She bought it at a market by the river", "她在河边的集市上买到了丝"],
          ],
          [
            "The first paragraph says a cocoon fell into the queen's cup, and as she lifted it out, a shining thread began to unwind.",
            "第一段说，一个蚕茧掉进了王后的杯子，她把它捞出来时，一根闪亮的丝开始散开。",
          ],
        ),
        ask(
          ["What do silkworms eat?", "蚕吃什么？"],
          ["Only mulberry leaves", "只吃桑叶"],
          [
            ["Millet and rice", "小米和大米"],
            ["Tea leaves", "茶叶"],
            ["Other caterpillars", "别的毛毛虫"],
          ],
          ["The second paragraph says silkworms are caterpillars that eat only mulberry leaves.", "第二段说，蚕是只吃桑叶的毛毛虫。"],
        ),
        ask(
          ["Why did workers drop the cocoons into hot water?", "工人为什么要把蚕茧放进热水里？"],
          ["To loosen the thread", "为了让丝松开"],
          [
            ["To cook them for dinner", "为了把它们煮来当晚饭"],
            ["To make them change into moths", "为了让它们变成飞蛾"],
            ["To wash the yellow soil off them", "为了洗掉上面的黄土"],
          ],
          [
            "The third paragraph says workers dropped the cocoons into hot water to loosen the thread.",
            "第三段说，工人把蚕茧放进热水里，是为了让丝松开。",
          ],
        ),
      ],
      ["Chinese", "China", "Silk", "Road"],
    ),
  ],
};
