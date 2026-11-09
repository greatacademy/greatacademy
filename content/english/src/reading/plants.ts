import type { ReadingUnitDef } from "@ga/content";
import { t } from "@ga/content";

import { clues, cluesAcademic } from "./topics.ts";

/** howPlantsLive is a reading unit of grades 3 to 5 on the parts of plants and how they grow and spread. */
export const howPlantsLive: ReadingUnitDef = {
  id: "how-plants-live",
  title: t("How Plants Live", "植物怎样生活"),
  passages: [
    {
      id: "what-plants-need",
      title: t("What Plants Need", "植物需要什么"),
      body: `A plant cannot walk to a stream for a drink or hunt for its dinner. It stays in one place its whole life. Yet it grows, makes new leaves and often lives for many years. How does it do it?

Every plant needs four things: light, water, air and a place to grow. Most plants get light from the sun. They take in water through their roots. They take in air through tiny holes in their leaves. And most of them grow in soil, which holds them up and gives them small amounts of the minerals they need to stay healthy.

If a plant is missing one of these things, it will show it. A plant kept in a dark closet grows pale and thin as it stretches toward any light it can find. A plant that gets too little water droops, and its leaves turn brown and dry.

Animals must find their food. Plants are different. As you will read, a plant makes its own food from light, water and air.`,
      topics: [clues],
      xp: 4,
      questions: [
        {
          prompt: t("Which list names the four things every plant needs?", "哪一项列出了每种植物都需要的四样东西？"),
          right: t("Light, water, air and a place to grow", "光、水、空气和生长的地方"),
          wrong: [
            t("Light, water, food and animals", "光、水、食物和动物"),
            t("Soil, stones, rain and wind", "土壤、石头、雨和风"),
            t("Water, air, heat and darkness", "水、空气、热量和黑暗"),
          ],
          solution: t(
            'The second paragraph says: "Every plant needs four things: light, water, air and a place to grow."',
            "第二段说：“Every plant needs four things: light, water, air and a place to grow.”",
          ),
        },
        {
          prompt: t("What does the word *droops* most likely mean in the third paragraph?", "第三段中的 *droops* 最可能是什么意思？"),
          right: t("Hangs down weakly", "无力地垂下来"),
          wrong: [t("Grows taller", "长得更高"), t("Turns green", "变绿"), t("Makes new leaves", "长出新叶")],
          solution: t(
            "The paragraph says the plant gets too little water and its leaves turn brown and dry, so droops describes a weak plant hanging down.",
            "这一段说植物缺水，叶子变得又干又黄，所以 droops 描述的是植物无力地垂下来。",
          ),
        },
        {
          prompt: t("How are plants different from animals, according to the passage?", "根据文章，植物和动物有什么不同？"),
          right: t("Plants make their own food", "植物自己制造食物"),
          wrong: [
            t("Plants hunt for their food", "植物会捕食"),
            t("Plants do not need water", "植物不需要水"),
            t("Plants walk to find light", "植物会走动去寻找光"),
          ],
          solution: t(
            "The last paragraph says animals must find their food, but a plant makes its own food.",
            "最后一段说动物必须寻找食物，而植物自己制造食物。",
          ),
        },
      ],
    },
    {
      id: "roots",
      title: t("Roots at Work", "根在工作"),
      body: `When you look at a tree, you see its trunk, branches and leaves. But a large part of the tree is hidden. Under the ground, its roots spread out in every direction, often farther than its branches do.

Roots have two main jobs. The first is to hold the plant in place. Strong roots grip the soil so that wind and rain cannot easily knock the plant over or wash it away.

The second job is to take in water. Most of the water a plant drinks enters through the very ends of its roots. These ends are covered with root hairs, so thin that you would need a magnifying glass to see them clearly. There are so many root hairs that they touch a huge amount of soil, and they soak up water and minerals from all of it.

Some plants also store food in their roots. Carrots, beets and sweet potatoes are roots that are full of food the plant saved for later. When we eat them, we are eating the plant's food supply.`,
      topics: [clues],
      xp: 4,
      questions: [
        {
          prompt: t("What are the two main jobs of roots?", "根的两项主要工作是什么？"),
          right: t("Holding the plant in place and taking in water", "固定植物和吸收水分"),
          wrong: [
            t("Making seeds and catching light", "制造种子和吸收光"),
            t("Growing leaves and storing air", "长叶子和储存空气"),
            t("Scaring animals and making flowers", "吓走动物和开花"),
          ],
          solution: t(
            "The second and third paragraphs say roots hold the plant in place and take in water.",
            "第二段和第三段说，根固定植物并吸收水分。",
          ),
        },
        {
          prompt: t("Why can root hairs soak up so much water?", "根毛为什么能吸收那么多水？"),
          right: t("There are so many of them that they touch a huge amount of soil", "根毛数量很多，接触到大量的土壤"),
          wrong: [
            t("They are thick and strong", "它们又粗又壮"),
            t("They grow above the ground", "它们长在地面上"),
            t("They store food for later", "它们储存食物以备后用"),
          ],
          solution: t(
            "The third paragraph says there are so many root hairs that they touch a huge amount of soil.",
            "第三段说根毛非常多，接触到大量的土壤。",
          ),
        },
        {
          prompt: t("What is a carrot, according to the passage?", "根据文章，胡萝卜是什么？"),
          right: t("A root that stores food", "储存食物的根"),
          wrong: [t("A kind of leaf", "一种叶子"), t("A seed that has not grown", "还没发芽的种子"), t("A root hair", "一根根毛")],
          solution: t(
            "The last paragraph says carrots are roots full of food the plant saved for later.",
            "最后一段说胡萝卜是装满了植物储存起来的食物的根。",
          ),
        },
      ],
    },
    {
      id: "stems",
      title: t("The Plant's Highway", "植物的公路"),
      body: `The stem is the part of a plant that holds up its leaves and flowers. In a small plant, the stem may be soft and green. In a tree, the stem is the trunk, hard and covered in bark.

A stem works like a highway with traffic going both ways. Inside it are bundles of tiny tubes. Some tubes carry water and minerals up from the roots to the leaves. Other tubes carry food made in the leaves down to the roots and to every other part of the plant.

You can watch the upward traffic for yourself. Put a stalk of celery in a glass of water with a few drops of food coloring. After a day, the leaves at the top will begin to change color. If you cut the stalk across, you will see small colored dots. Each dot is the end of a tube that carried the colored water up.

Stems also help plants reach the light. Many plants grow tall stems so that their leaves rise above the plants around them. Vines have weak stems, so they climb up walls, fences and trees instead.`,
      topics: [clues],
      xp: 4,
      questions: [
        {
          prompt: t("Why does the writer compare a stem to a highway?", "作者为什么把茎比作公路？"),
          right: t("Things travel through it in two directions", "东西在里面朝两个方向运输"),
          wrong: [
            t("It is hard and gray", "它又硬又灰"),
            t("Cars can drive on it", "汽车可以在上面开"),
            t("It is always very long", "它总是很长"),
          ],
          solution: t(
            "The second paragraph says a stem works like a highway with traffic going both ways: water goes up, and food goes down.",
            "第二段说茎像双向通行的公路：水往上运，食物往下运。",
          ),
        },
        {
          prompt: t("In the celery activity, what are the small colored dots?", "在芹菜实验里，那些彩色的小点是什么？"),
          right: t("The ends of tubes that carried the colored water up", "把彩色的水往上运送的管子的末端"),
          wrong: [
            t("Drops of food coloring spilled on the stalk", "洒在茎上的食用色素"),
            t("Seeds inside the celery", "芹菜里面的种子"),
            t("Holes that let air in", "让空气进入的小孔"),
          ],
          solution: t(
            "The third paragraph says each dot is the end of a tube that carried the colored water up.",
            "第三段说每个小点都是把彩色的水往上运送的管子的末端。",
          ),
        },
        {
          prompt: t("Why do vines climb up walls and trees?", "藤蔓为什么要爬上墙和树？"),
          right: t("Their stems are weak, and climbing helps them reach the light", "它们的茎很弱，攀爬帮助它们获得光"),
          wrong: [
            t("They want to escape from animals", "它们想躲避动物"),
            t("Their roots grow in the air", "它们的根长在空中"),
            t("Walls give them water", "墙给它们提供水"),
          ],
          solution: t(
            "The last paragraph says stems help plants reach the light, and vines have weak stems, so they climb instead.",
            "最后一段说茎帮助植物获得光，藤蔓的茎很弱，所以它们通过攀爬来做到。",
          ),
        },
      ],
    },
    {
      id: "leaves-make-food",
      title: t("Leaves Make Food", "叶子制造食物"),
      body: `A leaf may look simple, but it is a busy food factory. Inside every green leaf, the plant makes its own food from sunlight, water and air.

The green color of leaves comes from a material called chlorophyll. Chlorophyll catches energy from sunlight. The leaf uses that energy to join water from the roots with a gas from the air called carbon dioxide. The result is a kind of sugar, which is the plant's food. This way of making food from light is called photosynthesis.

As it makes sugar, the leaf gives off another gas: oxygen. Oxygen leaves through the tiny holes in the leaf and goes into the air. People and animals need oxygen to breathe. So every time you take a breath, you can thank a plant somewhere.

Some of the sugar is used right away to give the plant energy to grow. The rest travels down the stem and is stored for later in roots, seeds or fruit.

Leaves come in many shapes and sizes, from thin needles to leaves wider than an umbrella. But almost all of them do the same important work.`,
      topics: [clues],
      glossed: ["chlorophyll", "photosynthesis", "dioxide"],
      xp: 5,
      questions: [
        {
          prompt: t("What does chlorophyll do?", "叶绿素起什么作用？"),
          right: t("It catches energy from sunlight", "它从阳光中吸收能量"),
          wrong: [
            t("It carries water up the stem", "它把水沿着茎往上运"),
            t("It stores sugar in the roots", "它把糖储存在根里"),
            t("It makes holes in the leaf", "它在叶子上打孔"),
          ],
          solution: t(
            'The second paragraph says: "Chlorophyll catches energy from sunlight."',
            "第二段说：“Chlorophyll catches energy from sunlight.”",
          ),
        },
        {
          prompt: t("What does a leaf give off as it makes sugar?", "叶子在制造糖的时候会放出什么？"),
          right: t("Oxygen", "氧气"),
          wrong: [t("Carbon dioxide", "二氧化碳"), t("Water vapor only", "只有水蒸气"), t("Chlorophyll", "叶绿素")],
          solution: t(
            "The third paragraph says that as it makes sugar, the leaf gives off oxygen.",
            "第三段说叶子在制造糖的时候会放出氧气。",
          ),
        },
        {
          prompt: t('Why does the writer say "you can thank a plant somewhere"?', "作者为什么说“you can thank a plant somewhere”？"),
          right: t("Plants put the oxygen we breathe into the air", "植物把我们呼吸的氧气释放到空气中"),
          wrong: [
            t("Plants clean our houses", "植物清洁我们的房子"),
            t("Plants give us water to drink", "植物给我们提供饮用水"),
            t("Plants make sugar for people to eat", "植物为人类制造糖来吃"),
          ],
          solution: t(
            "The third paragraph says people need oxygen to breathe, and leaves give it off into the air.",
            "第三段说人需要氧气来呼吸，而叶子把氧气释放到空气中。",
          ),
        },
        {
          prompt: t("What is photosynthesis?", "什么是光合作用？"),
          right: t("The way a plant makes food from light", "植物利用光制造食物的方式"),
          wrong: [
            t("The way a plant drinks water", "植物喝水的方式"),
            t("The way seeds travel", "种子传播的方式"),
            t("The green color of leaves", "叶子的绿色"),
          ],
          solution: t(
            "The second paragraph says this way of making food from light is called photosynthesis.",
            "第二段说这种利用光制造食物的方式叫作光合作用。",
          ),
        },
      ],
    },
    {
      id: "flowers",
      title: t("Why Flowers Bloom", "花为什么开放"),
      body: `People love flowers for their colors and sweet smells. But a flower does not bloom to please us. A flower is the part of the plant that makes seeds.

To make seeds, a flower needs pollen. Pollen is a fine powder, often yellow, made in the flower. When pollen from one flower reaches another flower of the same kind, the second flower can begin to make seeds. Moving pollen from flower to flower is called pollination.

A plant cannot carry its own pollen, so it needs help. Many flowers get help from animals. Bees, butterflies and even some birds visit flowers to drink a sweet juice called nectar. As they feed, pollen sticks to their bodies. When they fly to the next flower, some of that pollen rubs off.

This is why so many flowers are bright and sweet smelling. Their colors and smells are signals that tell animals where to find nectar.

Other plants, such as grasses and many trees, let the wind carry their pollen. Their flowers are usually small and plain. They do not need to attract animals, so they do not waste energy on bright colors.`,
      topics: [clues],
      glossed: ["pollination", "nectar"],
      xp: 4,
      questions: [
        {
          prompt: t("What is the main job of a flower?", "花的主要工作是什么？"),
          right: t("To make seeds", "制造种子"),
          wrong: [t("To please people", "让人高兴"), t("To make food from light", "利用光制造食物"), t("To take in water", "吸收水分")],
          solution: t("The first paragraph says a flower is the part of the plant that makes seeds.", "第一段说花是植物制造种子的部分。"),
        },
        {
          prompt: t("How do bees help flowers?", "蜜蜂怎样帮助花？"),
          right: t("They carry pollen from one flower to another", "它们把花粉从一朵花带到另一朵花"),
          wrong: [
            t("They make nectar for the flowers", "它们为花制造花蜜"),
            t("They give the flowers bright colors", "它们让花有鲜艳的颜色"),
            t("They plant the seeds in the soil", "它们把种子种进土里"),
          ],
          solution: t(
            "The third paragraph says pollen sticks to animals as they feed and rubs off on the next flower.",
            "第三段说动物吃花蜜时花粉粘在身上，到了下一朵花上又蹭掉一些。",
          ),
        },
        {
          prompt: t("Why are the flowers of grasses usually small and plain?", "草的花为什么通常又小又不起眼？"),
          right: t("The wind carries their pollen, so they do not need to attract animals", "风帮它们传播花粉，所以不需要吸引动物"),
          wrong: [
            t("They have no pollen", "它们没有花粉"),
            t("Animals eat bright flowers", "动物会吃鲜艳的花"),
            t("They grow in the dark", "它们长在黑暗的地方"),
          ],
          solution: t(
            "The last paragraph says wind carries their pollen, so they do not need to attract animals with bright colors.",
            "最后一段说风帮它们传播花粉，所以不需要用鲜艳的颜色吸引动物。",
          ),
        },
      ],
    },
    {
      id: "seeds-travel",
      title: t("Seeds on the Move", "旅行的种子"),
      body: `A seed holds a tiny baby plant and a small supply of food to help it start growing. But if every seed fell straight down under its parent plant, the young plants would be crowded. They would have to share light, water and soil with the big plant above them. So plants have many ways to send their seeds away.

Some seeds travel by wind. A dandelion seed hangs from a little umbrella of soft white hairs. A breeze can carry it across a whole field. Maple seeds have flat wings that spin like the blades of a helicopter as they fall, so the wind can push them far from the tree.

Some seeds travel by water. A coconut is a large seed with a hard shell full of air. It can float on the ocean for weeks and grow on a beach far away.

Many seeds travel with animals. Some have tiny hooks that catch on fur or socks. Others are inside sweet fruits. An animal eats the fruit, walks or flies somewhere else, and drops the seeds in its waste, ready to grow.`,
      topics: [clues],
      glossed: ["dandelion", "maple"],
      xp: 4,
      questions: [
        {
          prompt: t("Why is it a problem if all seeds fall right under the parent plant?", "如果所有种子都落在母株正下方，会有什么问题？"),
          right: t("The young plants would be crowded and have to share light, water and soil", "幼苗会很拥挤，不得不共享光、水和土壤"),
          wrong: [
            t("The seeds would float away", "种子会漂走"),
            t("Animals could not find the seeds", "动物找不到种子"),
            t("The parent plant would stop making flowers", "母株会停止开花"),
          ],
          solution: t(
            "The first paragraph says the young plants would be crowded and have to share light, water and soil with the big plant.",
            "第一段说幼苗会很拥挤，不得不和大植物共享光、水和土壤。",
          ),
        },
        {
          prompt: t("How does a coconut travel?", "椰子是怎样旅行的？"),
          right: t("It floats on the ocean", "它漂浮在海上"),
          wrong: [
            t("It spins in the wind", "它在风中旋转"),
            t("It catches on animal fur", "它挂在动物的皮毛上"),
            t("It is carried by bees", "它被蜜蜂带走"),
          ],
          solution: t("The third paragraph says a coconut can float on the ocean for weeks.", "第三段说椰子能在海上漂浮好几个星期。"),
        },
        {
          prompt: t("Which seed would most likely travel by catching on a dog's fur?", "哪种种子最可能挂在狗的毛上传播？"),
          right: t("A seed with tiny hooks", "带小钩子的种子"),
          wrong: [
            t("A seed with flat wings", "带扁平翅膀的种子"),
            t("A seed full of air", "充满空气的种子"),
            t("A seed with an umbrella of soft hairs", "带一把软毛“伞”的种子"),
          ],
          solution: t(
            "The last paragraph says some seeds have tiny hooks that catch on fur.",
            "最后一段说有些种子带有小钩子，会挂在皮毛上。",
          ),
        },
      ],
    },
    {
      id: "from-seed-to-plant",
      title: t("From Seed to Plant", "从种子到植物"),
      body: `A dry bean seed can sit in a jar for a year and seem completely dead. But plant it in warm, damp soil, and something amazing happens.

First, the seed soaks up water and swells. Its hard coat splits open. This first stage of growth is called germination.

Next, a tiny root pushes out of the seed and grows down into the soil. It always grows down, even if the seed was planted upside down. Soon after, a small shoot pushes up toward the surface.

Until the shoot reaches the light, the young plant lives on the food stored inside the seed. That is why a seed carries its own supply of food, like a packed lunch for a long trip.

When the shoot breaks through the soil, it opens its first leaves. Now the leaves can catch sunlight and begin to make food. The young plant, called a seedling, no longer needs the seed's food. It grows taller, adds more leaves, and after some weeks it may grow flowers and make new seeds of its own. Then the cycle begins again.`,
      topics: [clues, cluesAcademic],
      glossed: ["germination", "seedling"],
      xp: 4,
      questions: [
        {
          prompt: t("What happens first when a bean seed is planted in warm, damp soil?", "豆子种在温暖潮湿的土壤里，首先会发生什么？"),
          right: t("It soaks up water and swells", "它吸水膨胀"),
          wrong: [
            t("It opens its first leaves", "它长出第一片叶子"),
            t("It makes flowers", "它开花"),
            t("A shoot breaks through the soil", "嫩芽破土而出"),
          ],
          solution: t(
            'The second paragraph begins with "First" and says the seed soaks up water and swells.',
            "第二段以“First”开头，说种子吸水膨胀。",
          ),
        },
        {
          prompt: t("How does a young plant get food before its shoot reaches the light?", "嫩芽见到光之前，幼小的植物从哪里获得食物？"),
          right: t("From the food stored inside the seed", "从种子里储存的食物"),
          wrong: [
            t("From its leaves", "从它的叶子"),
            t("From animals in the soil", "从土里的动物"),
            t("From the sun directly", "直接从太阳"),
          ],
          solution: t(
            "The fourth paragraph says the young plant lives on the food stored inside the seed until the shoot reaches the light.",
            "第四段说嫩芽见到光之前，幼小的植物靠种子里储存的食物生活。",
          ),
        },
        {
          prompt: t("Why does the writer compare the seed's food to a packed lunch?", "作者为什么把种子里的食物比作带着的午餐？"),
          right: t("The seed carries its food with it until it can get more", "种子随身带着食物，直到能获得更多食物"),
          wrong: [
            t("The seed is eaten at lunchtime", "种子在午饭时被吃掉"),
            t("Seeds taste like sandwiches", "种子尝起来像三明治"),
            t("The seed travels in a lunch box", "种子装在午餐盒里旅行"),
          ],
          solution: t(
            "The fourth paragraph says a seed carries its own supply of food, like a packed lunch for a long trip.",
            "第四段说种子带着自己的食物，就像长途旅行时带的午餐。",
          ),
        },
      ],
    },
    {
      id: "plants-in-the-desert",
      title: t("Living in the Desert", "生活在沙漠里"),
      body: `A desert is a place that gets very little rain. Some deserts get less rain in a whole year than a rainy city gets in a single month. Yet many plants live there. They survive because they have special ways to find water and keep it.

A cactus is a good example. Its thick stem is like a water tank. When rain falls, the cactus soaks up as much water as it can and stores it inside. The stem swells when it is full and shrinks as the plant uses the water during dry months.

A cactus has no wide, flat leaves. Wide leaves would let too much water evaporate in the hot sun. Instead, it has sharp spines. The spines lose almost no water, and they also keep thirsty animals from biting into the juicy stem.

Other desert plants spread their roots wide, just under the surface, to catch rain the moment it falls. Some have roots that reach very deep to find groundwater.

And some desert plants simply wait. Their seeds lie in the dry ground for years. After a heavy rain, they sprout, flower and make new seeds within a few weeks, before the ground dries out again.`,
      topics: [clues],
      glossed: ["cactus"],
      xp: 4,
      questions: [
        {
          prompt: t("What is a desert, according to the passage?", "根据文章，什么是沙漠？"),
          right: t("A place that gets very little rain", "降雨很少的地方"),
          wrong: [
            t("A place with no plants", "没有植物的地方"),
            t("A place that is always cold", "总是很冷的地方"),
            t("A place covered in sand and water", "被沙子和水覆盖的地方"),
          ],
          solution: t(
            'The first paragraph says: "A desert is a place that gets very little rain."',
            "第一段说：“A desert is a place that gets very little rain.”",
          ),
        },
        {
          prompt: t("Why does a cactus have spines instead of wide leaves?", "仙人掌为什么长刺而不长宽大的叶子？"),
          right: t("Spines lose almost no water and protect the stem from animals", "刺几乎不流失水分，还能保护茎不被动物啃咬"),
          wrong: [
            t("Spines catch sunlight better", "刺能更好地吸收阳光"),
            t("Spines store water", "刺能储存水"),
            t("Spines help the cactus climb", "刺帮助仙人掌攀爬"),
          ],
          solution: t(
            "The third paragraph says wide leaves would lose too much water, while spines lose almost none and keep animals away.",
            "第三段说宽大的叶子会流失太多水分，而刺几乎不流失水分，还能赶走动物。",
          ),
        },
        {
          prompt: t("What does the word *sprout* most likely mean in the last paragraph?", "最后一段中的 *sprout* 最可能是什么意思？"),
          right: t("Begin to grow", "开始生长"),
          wrong: [t("Dry out", "变干"), t("Fall asleep", "睡着"), t("Blow away", "被吹走")],
          solution: t(
            "The seeds have been waiting in the dry ground; after rain they sprout and then flower, so sprout means begin to grow.",
            "种子一直在干燥的土里等待；下雨后它们 sprout，然后开花，所以 sprout 的意思是开始生长。",
          ),
        },
      ],
    },
    {
      id: "trees-through-the-year",
      title: t("A Tree Through the Year", "一棵树的一年"),
      body: `In places with cold winters, many trees change a great deal from season to season.

In spring, buds swell on the bare branches and open into soft new leaves. Through the summer, the leaves are busy making food in the sunshine, and the tree grows.

In autumn, the days grow shorter and cooler. Trees such as maples and oaks get ready for winter. They stop making chlorophyll, and as the green fades, yellow and orange colors that were hidden in the leaves all summer begin to show. Some leaves also turn red. Then the leaves fall.

Why drop all those leaves? In winter, the ground may freeze, and frozen water cannot travel up through the roots. Broad leaves would keep losing water into the dry winter air, and the tree could not replace it. Without its leaves, the tree rests until spring, living on food it stored in summer.

Trees that lose all their leaves each autumn are called deciduous. Pines and many other trees with needles stay green all year. Their narrow needles have a waxy coat that loses very little water, so they can keep them through the winter.`,
      topics: [clues],
      glossed: ["deciduous"],
      xp: 4,
      questions: [
        {
          prompt: t("Why do the leaves of maples turn yellow and orange in autumn?", "枫树的叶子秋天为什么会变黄、变橙？"),
          right: t("The green fades and colors that were hidden begin to show", "绿色褪去，原本藏着的颜色显现出来"),
          wrong: [
            t("The leaves are painted by frost", "霜把叶子染了色"),
            t("The tree makes extra chlorophyll", "树制造了更多的叶绿素"),
            t("The leaves get more sunlight", "叶子得到了更多阳光"),
          ],
          solution: t(
            "The third paragraph says the trees stop making chlorophyll, and as the green fades, hidden yellow and orange colors show.",
            "第三段说树停止制造叶绿素，绿色褪去后，原本藏着的黄色和橙色就显现出来。",
          ),
        },
        {
          prompt: t("Why do some trees drop their leaves before winter?", "为什么有些树在冬天之前落叶？"),
          right: t("Their leaves would lose water that the tree could not replace", "叶子会流失水分，而树无法补充"),
          wrong: [
            t("The leaves become too heavy", "叶子变得太重"),
            t("Animals eat all the leaves", "动物把叶子全吃了"),
            t("The tree needs room for new flowers", "树需要给新花腾出地方"),
          ],
          solution: t(
            "The fourth paragraph says frozen water cannot travel up the roots, and broad leaves would keep losing water the tree could not replace.",
            "第四段说冻住的水无法通过根往上运，宽大的叶子会不断流失树无法补充的水分。",
          ),
        },
        {
          prompt: t("What does *deciduous* mean?", "*deciduous* 是什么意思？"),
          right: t("Losing all its leaves each autumn", "每年秋天叶子全部落光"),
          wrong: [
            t("Staying green all year", "全年保持绿色"),
            t("Having needles", "长着针叶"),
            t("Growing only in deserts", "只长在沙漠里"),
          ],
          solution: t(
            "The last paragraph says trees that lose all their leaves each autumn are called deciduous.",
            "最后一段说每年秋天叶子全部落光的树叫作 deciduous（落叶树）。",
          ),
        },
      ],
    },
    {
      id: "plants-and-animals",
      title: t("Plants and Animals Together", "植物与动物相互依存"),
      body: `You have read that plants make their own food, that they give off oxygen, and that animals help carry their pollen and seeds. Now compare what plants and animals give each other, and you will see how closely their lives are linked.

Animals depend on plants. Plants are the first link in almost every food chain. A rabbit eats clover. A fox eats the rabbit. Even though the fox never eats a leaf, its food came from a plant in the end. Animals also use plants for shelter. Birds build nests in trees, and many insects live their whole lives on a single kind of plant.

Plants depend on animals too. Bees and butterflies carry pollen. Birds and other animals spread seeds. When animals breathe out, they give off carbon dioxide, which plants use to make food. When animals die and break down, they add minerals to the soil that plants take in through their roots.

There is good evidence that when one part of this web is harmed, other parts suffer. In places where many bees have disappeared, some fruit trees make less fruit. Protecting plants means protecting animals, and protecting animals means protecting plants.`,
      topics: [clues, cluesAcademic],
      glossed: ["clover"],
      xp: 5,
      questions: [
        {
          prompt: t(
            'Why does the writer say the fox\'s food "came from a plant in the end"?',
            "作者为什么说狐狸的食物“came from a plant in the end”？",
          ),
          right: t("The fox eats the rabbit, and the rabbit eats plants", "狐狸吃兔子，而兔子吃植物"),
          wrong: [
            t("Foxes secretly eat leaves", "狐狸偷偷吃叶子"),
            t("Foxes live in trees", "狐狸住在树上"),
            t("Plants eat foxes", "植物吃狐狸"),
          ],
          solution: t(
            "The second paragraph traces the food chain: clover, then the rabbit that eats it, then the fox that eats the rabbit.",
            "第二段追溯了食物链：三叶草，吃三叶草的兔子，吃兔子的狐狸。",
          ),
        },
        {
          prompt: t("Which of these is a way that animals help plants?", "下面哪一项是动物帮助植物的方式？"),
          right: t("They breathe out carbon dioxide that plants use to make food", "它们呼出植物用来制造食物的二氧化碳"),
          wrong: [
            t("They give plants sunlight", "它们给植物提供阳光"),
            t("They make chlorophyll for leaves", "它们为叶子制造叶绿素"),
            t("They keep plants from making seeds", "它们阻止植物产生种子"),
          ],
          solution: t(
            "The third paragraph says animals give off carbon dioxide, which plants use to make food.",
            "第三段说动物呼出二氧化碳，植物用它来制造食物。",
          ),
        },
        {
          prompt: t("What is the main idea of the passage?", "这篇文章的主要意思是什么？"),
          right: t("Plants and animals depend on each other", "植物和动物相互依存"),
          wrong: [
            t("Foxes are the most important animals", "狐狸是最重要的动物"),
            t("Plants do not need animals at all", "植物完全不需要动物"),
            t("Bees are disappearing everywhere", "蜜蜂正在各地消失"),
          ],
          solution: t(
            "The second and third paragraphs show each side depending on the other, and the last sentence sums it up.",
            "第二段和第三段说明双方相互依赖，最后一句作了总结。",
          ),
        },
      ],
    },
  ],
};
