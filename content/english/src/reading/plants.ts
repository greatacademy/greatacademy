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
          why: [
            t(
              "Food and animals are not on the list. The passage says plants make their own food, and animals are what must find food.",
              "食物和动物不在清单上。文中说植物自己制造食物，要找食物的是动物。",
            ),
            t(
              "Stones, rain and wind are not the four things. Soil is mentioned, but as the place to grow.",
              "石头、雨和风不是那四样。文中提到土壤，但它是生长的地方。",
            ),
            t(
              "Darkness is the opposite. A plant kept in a dark closet grows pale and thin.",
              "黑暗正好相反。放在黑柜子里的植物会长得又白又瘦。",
            ),
          ],
        },
        {
          prompt: t("What does the word *droops* most likely mean in the third paragraph?", "第三段中的 *droops* 最可能是什么意思？"),
          right: t("Hangs down weakly", "无力地垂下来"),
          wrong: [t("Grows taller", "长得更高"), t("Turns green", "变绿"), t("Makes new leaves", "长出新叶")],
          solution: t(
            "The paragraph says the plant gets too little water and its leaves turn brown and dry, so droops describes a weak plant hanging down.",
            "这一段说植物缺水，叶子变得又干又黄，所以 droops 描述的是植物无力地垂下来。",
          ),
          why: [
            t(
              "Growing taller is the opposite of what a thirsty plant does in the third paragraph.",
              "长高和第三段里缺水植物的样子正好相反。",
            ),
            t("Turning green is wrong. Its leaves turn brown and dry.", "变绿不对。它的叶子变得又黄又干。"),
            t("Making new leaves is wrong. The plant is weak from too little water.", "长新叶不对。植物因为缺水变得无力。"),
          ],
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
          why: [
            t(
              "Hunting for food is what plants cannot do. The first paragraph says a plant cannot hunt for its dinner.",
              "捕食正是植物做不到的。第一段说植物不能去猎取食物。",
            ),
            t(
              "Not needing water is wrong. Water is one of the four things every plant needs.",
              "不需要水不对。水是每种植物都需要的四样东西之一。",
            ),
            t("Walking is the opposite. A plant stays in one place its whole life.", "走动正好相反。植物一辈子都待在一个地方。"),
          ],
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
          why: [
            t("Making seeds is the job of flowers, and catching light is the job of leaves.", "结种子是花的工作，接收阳光是叶子的工作。"),
            t(
              "Growing leaves and storing air are not the jobs named. Some roots store food, not air.",
              "长叶子和储存空气不是文中说的工作。有些根储存的是食物，不是空气。",
            ),
            t("Scaring animals and making flowers are not in the passage.", "吓跑动物和开花都不在文中。"),
          ],
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
          why: [
            t(
              "Thick and strong is the opposite. Root hairs are so thin you need a magnifying glass.",
              "又粗又壮正好相反。根毛细得要用放大镜才看得清。",
            ),
            t(
              "Growing above the ground is wrong. Root hairs are at the ends of roots, under the soil.",
              "长在地面上不对。根毛在根尖上，在土里。",
            ),
            t(
              "Storing food is a job of some whole roots, like carrots, not of root hairs.",
              "储存食物是胡萝卜这类整个根的事，不是根毛的。",
            ),
          ],
        },
        {
          prompt: t("What is a carrot, according to the passage?", "根据文章，胡萝卜是什么？"),
          right: t("A root that stores food", "储存食物的根"),
          wrong: [t("A kind of leaf", "一种叶子"), t("A seed that has not grown", "还没发芽的种子"), t("A root hair", "一根根毛")],
          solution: t(
            "The last paragraph says carrots are roots full of food the plant saved for later.",
            "最后一段说胡萝卜是装满了植物储存起来的食物的根。",
          ),
          why: [
            t(
              "A leaf is wrong. The passage lists carrots with beets and sweet potatoes as roots.",
              "叶子不对。文中把胡萝卜和甜菜、红薯一起列为根。",
            ),
            t("A seed is wrong. Carrots are roots full of food the plant saved for later.", "种子不对。胡萝卜是储存了养分的根。"),
            t("A root hair is far too thin to see. A carrot is a whole root.", "根毛细得几乎看不见。胡萝卜是一整条根。"),
          ],
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
          why: [
            t(
              "Hard and gray describes a road, but the passage compares the traffic, not the color.",
              "又硬又灰是说路的，但文中比的是交通，不是颜色。",
            ),
            t(
              'Cars driving on it is too literal. The "traffic" is water going up and food going down.',
              "车在上面开太按字面理解了。“交通”指水往上、养分往下。",
            ),
            t("Always very long is wrong. A small plant has a short, soft stem.", "总是很长不对。小植物的茎又短又软。"),
          ],
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
          why: [
            t(
              "Spilled food coloring is wrong. The dots appear inside the stalk when you cut it across.",
              "洒出来的食用色素不对。这些点是横切开茎后在里面看到的。",
            ),
            t("Seeds are not in celery stalks. Each dot is the end of a tube.", "芹菜茎里没有种子。每个点都是一根管子的末端。"),
            t(
              "Holes that let air in are on leaves. These dots carried colored water up.",
              "让空气进入的小孔在叶子上。这些点是运送彩色水的管子。",
            ),
          ],
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
          why: [
            t("Escaping from animals is not mentioned. The reason is weak stems and light.", "躲避动物文中没提。原因是茎软弱和需要阳光。"),
            t("Roots in the air are not in the passage.", "长在空中的根文中没有。"),
            t("Walls giving water is wrong. Vines climb to reach the light.", "墙提供水分不对。藤蔓攀爬是为了够到阳光。"),
          ],
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
          why: [
            t("Carrying water up the stem is the job of tubes in the stem.", "把水运上茎是茎里管道的工作。"),
            t("Storing sugar in roots happens after the sugar travels down the stem.", "把糖存在根里是糖沿茎往下运之后的事。"),
            t(
              "Making holes is not what chlorophyll does. It gives leaves their green color and catches light.",
              "开小孔不是叶绿素的工作。它让叶子变绿、捕捉阳光。",
            ),
          ],
        },
        {
          prompt: t("What does a leaf give off as it makes sugar?", "叶子在制造糖的时候会放出什么？"),
          right: t("Oxygen", "氧气"),
          wrong: [t("Carbon dioxide", "二氧化碳"), t("Water vapor only", "只有水蒸气"), t("Chlorophyll", "叶绿素")],
          solution: t(
            "The third paragraph says that as it makes sugar, the leaf gives off oxygen.",
            "第三段说叶子在制造糖的时候会放出氧气。",
          ),
          why: [
            t(
              "Carbon dioxide is what the leaf takes in from the air, not what it gives off.",
              "二氧化碳是叶子从空气中吸收的，不是放出的。",
            ),
            t("Water vapor is not named. The gas it gives off is oxygen.", "文中没提水蒸气。叶子放出的气体是氧气。"),
            t("Chlorophyll stays in the leaf. It is the green material, not a gas.", "叶绿素留在叶子里，它是绿色物质，不是气体。"),
          ],
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
          why: [
            t("Cleaning houses is not in the passage. The thanks is for oxygen.", "打扫房子文中没有。感谢的是氧气。"),
            t("Giving us water is wrong. Plants take water in through their roots.", "给我们水喝不对。植物是用根吸水。"),
            t("Making sugar for people is wrong. The sugar is the plant's own food.", "为人制造糖不对。糖是植物自己的食物。"),
          ],
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
          why: [
            t("Drinking water is what roots do. Photosynthesis makes food.", "喝水是根做的事。光合作用是制造食物。"),
            t("Seeds traveling is a different topic. Photosynthesis happens in leaves.", "种子传播是另一个话题。光合作用在叶子里进行。"),
            t(
              "The green color comes from chlorophyll. Photosynthesis is the way food is made.",
              "绿色来自叶绿素。光合作用是制造食物的过程。",
            ),
          ],
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
          why: [
            t(
              "Pleasing people is what the first lines deny: a flower does not bloom to please us.",
              "取悦人正是开头否定的：花开不是为了让我们高兴。",
            ),
            t("Making food from light is the job of leaves.", "用光制造食物是叶子的工作。"),
            t("Taking in water is the job of roots.", "吸收水分是根的工作。"),
          ],
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
          why: [
            t("Making nectar is wrong. Flowers make the nectar; bees drink it.", "制造花蜜不对。花蜜是花产生的，蜜蜂是来喝的。"),
            t("Bright colors belong to the flower itself. They are signals to animals.", "鲜艳的颜色属于花本身，是给动物的信号。"),
            t("Planting seeds is not what bees do here. They carry pollen.", "种种子不是这里蜜蜂做的事。它们是传粉。"),
          ],
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
          why: [
            t("Having no pollen is wrong. Their pollen is carried by the wind.", "没有花粉不对。它们的花粉靠风传播。"),
            t("Animals eating bright flowers is not in the passage.", "动物吃鲜艳的花文中没有。"),
            t(
              "Growing in the dark is not the reason. Grasses grow in light like other plants.",
              "生长在黑暗中不是原因。草和别的植物一样长在阳光下。",
            ),
          ],
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
          why: [
            t(
              "Floating away is how a coconut travels, not the problem of falling straight down.",
              "漂走是椰子的传播方式，不是种子直接落下的问题。",
            ),
            t("Animals not finding seeds is not the problem named.", "动物找不到种子不是文中说的问题。"),
            t("The parent plant stopping flowers is not in the passage.", "母株不再开花文中没有。"),
          ],
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
          why: [
            t("Spinning in the wind is how maple seeds travel.", "在风中旋转是枫树种子的传播方式。"),
            t("Catching on fur is how hooked seeds travel.", "挂在毛上是带钩种子的传播方式。"),
            t("Bees carry pollen, not coconuts.", "蜜蜂传的是花粉，不是椰子。"),
          ],
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
          why: [
            t("Flat wings spin in the wind, like maple seeds.", "扁平的翅膀会在风中旋转，像枫树种子。"),
            t("A seed full of air floats on water, like a coconut.", "充满空气的种子会浮在水上，像椰子。"),
            t("An umbrella of soft hairs is a dandelion seed, carried by a breeze.", "带着软毛小伞的是蒲公英种子，靠微风传播。"),
          ],
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
          why: [
            t("Opening leaves comes later, after the shoot breaks through.", "长出叶子是后来的事，在嫩芽破土之后。"),
            t("Making flowers comes weeks later, at the end.", "开花是几周以后、最后的事。"),
            t("The shoot breaking through comes after the root grows down.", "嫩芽破土是在根往下长之后。"),
          ],
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
          why: [
            t(
              "Its leaves have not opened yet. Until the shoot reaches light, there are no working leaves.",
              "它的叶子还没展开。嫩芽见光前，没有能工作的叶子。",
            ),
            t("Animals in the soil are not in the passage.", "土里的动物文中没有。"),
            t("The sun directly is wrong. The shoot has not reached the light yet.", "直接来自太阳不对。嫩芽还没见到光。"),
          ],
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
          why: [
            t("Eaten at lunchtime is too literal.", "在午饭时被吃掉太按字面理解了。"),
            t("Tasting like sandwiches is not the point.", "尝起来像三明治不是重点。"),
            t("A lunch box is not real here. The seed carries its own food.", "这里没有真的饭盒。种子自带食物。"),
          ],
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
          why: [
            t("No plants is wrong. The passage says many plants live there.", "没有植物不对。文中说那里生活着很多植物。"),
            t("Always cold is not in the passage. It speaks of the hot sun.", "总是很冷文中没有。文中说的是烈日。"),
            t("Sand and water is wrong. A desert gets very little rain.", "沙和水不对。沙漠很少下雨。"),
          ],
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
          why: [
            t("Catching sunlight better is not the reason given.", "更好地接收阳光不是文中给的原因。"),
            t("Storing water is the job of the thick stem, not the spines.", "储水是粗茎的工作，不是刺的。"),
            t("Helping it climb is what vines do. Cactus spines do not climb.", "帮助攀爬是藤蔓的事。仙人掌的刺不攀爬。"),
          ],
        },
        {
          prompt: t("What does the word *sprout* most likely mean in the last paragraph?", "最后一段中的 *sprout* 最可能是什么意思？"),
          right: t("Begin to grow", "开始生长"),
          wrong: [t("Dry out", "变干"), t("Fall asleep", "睡着"), t("Blow away", "被吹走")],
          solution: t(
            "The seeds have been waiting in the dry ground; after rain they sprout and then flower, so sprout means begin to grow.",
            "种子一直在干燥的土里等待；下雨后它们 sprout，然后开花，所以 sprout 的意思是开始生长。",
          ),
          why: [
            t("Drying out is the opposite. They sprout after heavy rain.", "变干正好相反。它们在大雨后发芽。"),
            t("Falling asleep is what the seeds were doing for years before the rain.", "沉睡是种子在下雨前几年里的状态。"),
            t("Blowing away is not in the passage. They sprout, flower and make seeds.", "被吹走文中没有。它们发芽、开花、结籽。"),
          ],
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
          why: [
            t("Frost painting leaves is not in the passage.", "霜给叶子上色文中没有。"),
            t("Making extra chlorophyll is the opposite. Trees stop making it.", "制造更多叶绿素正好相反。树停止制造它了。"),
            t("More sunlight is wrong. Autumn days grow shorter.", "更多阳光不对。秋天白天变短了。"),
          ],
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
          why: [
            t("Becoming too heavy is not the reason given.", "变得太重不是文中的原因。"),
            t("Animals eating leaves is not in the passage.", "动物吃叶子文中没有。"),
            t(
              "Room for flowers is not the reason. In spring the tree grows new leaves, not just flowers.",
              "给花腾地方不是原因。春天树长出的是新叶。",
            ),
          ],
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
          why: [
            t("Staying green all year describes pines with needles.", "全年常绿说的是长针叶的松树。"),
            t("Having needles describes pines, the opposite group.", "长针叶说的是松树，是相反的一类。"),
            t(
              "Deserts are in a different passage. Deciduous trees grow where winters are cold.",
              "沙漠是另一篇的内容。落叶树长在冬天寒冷的地方。",
            ),
          ],
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
          why: [
            t(
              "Foxes secretly eating leaves is wrong. The passage says the fox never eats a leaf.",
              "狐狸偷吃叶子不对。文中说狐狸从不吃叶子。",
            ),
            t("Foxes living in trees is not in the passage. Birds nest in trees.", "狐狸住在树上文中没有。在树上筑巢的是鸟。"),
            t("Plants eating foxes is backwards.", "植物吃狐狸是反的。"),
          ],
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
          why: [
            t("Giving sunlight is wrong. Light comes from the sun, not animals.", "提供阳光不对。阳光来自太阳，不是动物。"),
            t("Making chlorophyll is wrong. Leaves make their own.", "制造叶绿素不对。叶子自己制造叶绿素。"),
            t(
              "Keeping plants from making seeds is the opposite. Animals help carry pollen and seeds.",
              "阻止植物结籽正好相反。动物帮忙传粉、传播种子。",
            ),
          ],
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
          why: [
            t("Foxes are only one example in the food chain.", "狐狸只是食物链里的一个例子。"),
            t("Plants not needing animals is the opposite of the third paragraph.", "植物不需要动物和第三段正好相反。"),
            t("Bees disappearing is one piece of evidence, and only in some places.", "蜜蜂消失只是一个证据，而且只发生在某些地方。"),
          ],
        },
      ],
    },
  ],
};
