import type { ReadingUnitDef } from "@ga/content";
import { t } from "@ga/content";

import { clues, cluesAcademic } from "./topics.ts";

/** waterOnEarth is a reading unit of grades 3 to 5 on where Earth's water is and how it moves. */
export const waterOnEarth: ReadingUnitDef = {
  id: "water-on-earth",
  title: t("Water on Earth", "地球上的水"),
  passages: [
    {
      id: "where-earths-water-is",
      title: t("Where Earth's Water Is", "地球上的水在哪里"),
      body: `From space, Earth looks like a blue ball. That is because water covers most of its surface. If you could pour all of Earth's water into one hundred cups, more than ninety-seven of them would be filled from the oceans.

Ocean water is salty. People cannot drink it, and most farm plants cannot grow with it. Water that is not salty is called fresh water. Rivers, lakes, rain and snow are fresh water.

Only about three of the hundred cups would hold fresh water, and most of that is frozen. It is locked away as ice near the North Pole and the South Pole and on high mountains. Some more of it is hidden under the ground.

So the fresh water that people can easily reach in rivers and lakes would barely wet the bottom of the last cup. All the people, animals and plants on land share that small amount. That is one reason why water is so important to protect.`,
      topics: [clues],
      xp: 4,
      questions: [
        {
          prompt: t("Where is most of Earth's water?", "地球上的大部分水在哪里？"),
          right: t("In the oceans", "在海洋里"),
          wrong: [
            t("In rivers and lakes", "在河流和湖泊里"),
            t("Frozen near the poles", "冻结在两极附近"),
            t("Under the ground", "在地下"),
          ],
          solution: t(
            "The first paragraph says that more than ninety-seven of the hundred cups would be filled from the oceans.",
            "第一段说，一百杯水中有九十七杯以上来自海洋。",
          ),
        },
        {
          prompt: t("What does the passage call water that is not salty?", "文章把不咸的水叫作什么？"),
          right: t("Fresh water", "淡水"),
          wrong: [t("Ocean water", "海水"), t("Frozen water", "冻结的水"), t("Rain water only", "只有雨水")],
          solution: t(
            'The second paragraph says: "Water that is not salty is called fresh water."',
            "第二段说：“Water that is not salty is called fresh water.”",
          ),
        },
        {
          prompt: t("Why does the writer say water is important to protect?", "作者为什么说保护水很重要？"),
          right: t("Very little fresh water is easy to reach, and everyone on land shares it", "容易获得的淡水很少，陆地上的生物都要共用"),
          wrong: [
            t("Ocean water is running out", "海水快用完了"),
            t("Ice near the poles is easy to drink", "两极附近的冰很容易饮用"),
            t("Plants grow best in salty water", "植物在咸水里长得最好"),
          ],
          solution: t(
            "The last paragraph explains that the easy-to-reach fresh water is a tiny amount that all living things on land share.",
            "最后一段解释说，容易获得的淡水只有很少一点，陆地上所有生物都要共用。",
          ),
        },
      ],
    },
    {
      id: "three-forms-of-water",
      title: t("Three Forms of Water", "水的三种形态"),
      body: `Water can be a solid, a liquid or a gas. It is the same water in each form. Only its temperature is different.

When water is very cold, it freezes into ice. Ice is a solid. A solid keeps its own shape. An ice cube stays a cube, even when you move it from one plate to another.

When ice warms up, it melts into liquid water. A liquid has no shape of its own. It takes the shape of whatever holds it. Pour water from a tall glass into a flat bowl, and the water becomes flat too.

When liquid water gets warm enough, some of it turns into a gas called water vapor. Water vapor is all around us in the air, but we cannot see it. The steam you see above a pot of hot soup is really tiny drops of water that formed when the vapor cooled.

Water keeps changing from one form to another, and back again, all over the world, every day.`,
      topics: [clues],
      glossed: ["vapor"],
      xp: 4,
      questions: [
        {
          prompt: t("What makes the three forms of water different?", "水的三种形态有什么不同的原因？"),
          right: t("Their temperature", "它们的温度"),
          wrong: [t("Their color", "它们的颜色"), t("Where they come from", "它们从哪里来"), t("How salty they are", "它们有多咸")],
          solution: t(
            "The first paragraph says it is the same water in each form and only its temperature is different.",
            "第一段说，每种形态都是同样的水，只是温度不同。",
          ),
        },
        {
          prompt: t("Which form of water takes the shape of whatever holds it?", "哪种形态的水会随着容器改变形状？"),
          right: t("Liquid water", "液态水"),
          wrong: [t("Ice", "冰"), t("Water vapor", "水蒸气"), t("Snow", "雪")],
          solution: t(
            "The third paragraph says a liquid has no shape of its own and takes the shape of whatever holds it.",
            "第三段说，液体没有自己的形状，会随着容器改变形状。",
          ),
        },
        {
          prompt: t("According to the passage, what is the steam above hot soup?", "根据文章，热汤上方的“蒸汽”是什么？"),
          right: t("Tiny drops of water formed when vapor cooled", "水蒸气冷却后形成的小水滴"),
          wrong: [
            t("Water vapor that we can see", "我们能看见的水蒸气"),
            t("Smoke from the soup", "汤冒出的烟"),
            t("Tiny pieces of ice", "小冰粒"),
          ],
          solution: t(
            "The fourth paragraph says we cannot see water vapor; the steam is tiny drops that formed when the vapor cooled.",
            "第四段说我们看不见水蒸气；那些“蒸汽”其实是水蒸气冷却后形成的小水滴。",
          ),
        },
      ],
    },
    {
      id: "evaporation",
      title: t("Where Puddles Go", "水坑去了哪里"),
      body: `After a rainstorm, the sidewalk is covered with puddles. A few hours later, on a sunny day, the puddles are gone. No one mopped them up. Where did the water go?

The sun warmed the water, and the water slowly turned into water vapor. The vapor rose into the air. This change from liquid to gas is called evaporation.

Heat makes evaporation happen faster. A puddle in the sun disappears sooner than a puddle in the shade. Wind helps too, because it carries the vapor away so that more water can take its place.

Evaporation happens on a much larger scale over the oceans. Every day the sun warms the surface of the sea, and huge amounts of water rise into the air as vapor. When ocean water evaporates, the salt stays behind. Only the water itself goes up.

You can see this for yourself. Leave a dish of salty water on a sunny window for a few days. When the water is gone, a thin white layer of salt will be left in the dish.`,
      topics: [clues],
      glossed: ["evaporation", "evaporates"],
      xp: 4,
      questions: [
        {
          prompt: t("What is evaporation?", "什么是蒸发？"),
          right: t("Water changing from a liquid to a gas", "水从液体变成气体"),
          wrong: [
            t("Water changing from a gas to a liquid", "水从气体变成液体"),
            t("Water freezing into ice", "水结成冰"),
            t("Rain falling on the sidewalk", "雨落在人行道上"),
          ],
          solution: t(
            'The second paragraph says: "This change from liquid to gas is called evaporation."',
            "第二段说：“This change from liquid to gas is called evaporation.”",
          ),
        },
        {
          prompt: t("Which puddle would most likely disappear first?", "哪个水坑最可能最先消失？"),
          right: t("One in the sun on a windy day", "刮风天在阳光下的水坑"),
          wrong: [
            t("One in the shade on a still day", "无风天在阴凉处的水坑"),
            t("One in the shade on a windy day", "刮风天在阴凉处的水坑"),
            t("They would all disappear at the same time", "它们会同时消失"),
          ],
          solution: t(
            "The third paragraph says heat makes evaporation faster, and wind helps too.",
            "第三段说，热量让蒸发更快，风也有帮助。",
          ),
        },
        {
          prompt: t("What is left in the dish when salty water evaporates?", "咸水蒸发后，盘子里会留下什么？"),
          right: t("Salt", "盐"),
          wrong: [t("Nothing at all", "什么也不剩"), t("Fresh water", "淡水"), t("Ice", "冰")],
          solution: t(
            "The last two paragraphs say the salt stays behind and a thin white layer of salt is left.",
            "最后两段说盐会留下来，盘子里会留下一层薄薄的白色盐。",
          ),
        },
      ],
    },
    {
      id: "condensation-and-clouds",
      title: t("How Clouds Form", "云是怎样形成的"),
      body: `Take a cold glass of juice out of the refrigerator on a warm day. Soon its outside is wet. The juice did not leak through the glass. The water came from the air.

Remember that the air holds water vapor we cannot see. When warm air touches something cold, the vapor in it cools and turns back into tiny drops of liquid water. This change from gas to liquid is called condensation. It is the opposite of evaporation.

Clouds form in the same way. Warm air carrying water vapor rises high into the sky, where the air is much colder. There the vapor cools and condenses into tiny drops of water, so small and light that they float. Billions of these drops together make a cloud.

When the air high up is cold enough, the drops freeze into tiny pieces of ice. Many of the thin, feathery clouds you see high in a summer sky are made of ice, not liquid water.

So a cloud is not smoke or cotton. It is water, the same water that rose from puddles, lakes and oceans.`,
      topics: [clues],
      glossed: ["condensation", "condenses"],
      xp: 4,
      questions: [
        {
          prompt: t("Where does the water on the outside of the cold glass come from?", "冷杯子外面的水是从哪里来的？"),
          right: t("From water vapor in the air", "来自空气中的水蒸气"),
          wrong: [
            t("From juice leaking through the glass", "来自渗出杯子的果汁"),
            t("From melting ice in the juice", "来自果汁里融化的冰"),
            t("From the refrigerator", "来自冰箱"),
          ],
          solution: t(
            "The first paragraph says the juice did not leak and the water came from the air.",
            "第一段说果汁并没有渗出来，水来自空气。",
          ),
        },
        {
          prompt: t("Why does the passage call condensation the opposite of evaporation?", "文章为什么说凝结是蒸发的反面？"),
          right: t("Condensation turns gas into liquid, and evaporation turns liquid into gas", "凝结把气体变成液体，蒸发把液体变成气体"),
          wrong: [
            t("Condensation happens only in the sky", "凝结只发生在天上"),
            t("Condensation needs heat, and evaporation needs cold", "凝结需要热，蒸发需要冷"),
            t("Condensation makes water salty", "凝结让水变咸"),
          ],
          solution: t(
            "The second paragraph defines condensation as a change from gas to liquid; evaporation goes the other way.",
            "第二段说凝结是从气体变成液体；蒸发方向相反。",
          ),
        },
        {
          prompt: t("What are many thin, feathery clouds high in the sky made of?", "高空中很多又薄又像羽毛的云是由什么组成的？"),
          right: t("Tiny pieces of ice", "小冰粒"),
          wrong: [t("Smoke", "烟"), t("Water vapor we cannot see", "看不见的水蒸气"), t("Large drops of rain", "大雨滴")],
          solution: t(
            "The fourth paragraph says many thin, feathery clouds high in a summer sky are made of ice.",
            "第四段说，夏天高空中很多又薄又像羽毛的云是由冰组成的。",
          ),
        },
      ],
    },
    {
      id: "rain-snow-and-hail",
      title: t("Rain, Snow and Hail", "雨、雪和冰雹"),
      body: `The drops in a cloud are tiny. As they move around, they bump into each other and join together. The drops grow bigger and heavier. When they are too heavy to float, they fall to the ground as rain.

If the air is cold all the way from the cloud to the ground, the water does not fall as rain. Instead it falls as snow. Each snowflake begins as a tiny piece of ice and grows as more water freezes onto it. Most snowflakes have six sides or six points.

Hail is different. Hail falls from tall storm clouds in which strong winds push pieces of ice up and down. Each time a piece of ice is pushed up into the cold top of the cloud, a new layer of ice freezes around it. When a hailstone becomes too heavy for the wind to hold up, it falls. If you cut a large hailstone in half, you can see its layers, a little like the rings inside a tree.

Rain, snow and hail all bring water from the sky back to the land and the sea.`,
      topics: [clues],
      glossed: ["hailstone"],
      xp: 4,
      questions: [
        {
          prompt: t("Why do drops of water fall from a cloud?", "水滴为什么会从云里落下来？"),
          right: t("They join together until they are too heavy to float", "它们合在一起，直到重得飘不住"),
          wrong: [
            t("The wind pushes them down", "风把它们往下推"),
            t("The cloud becomes warm", "云变暖了"),
            t("They freeze into ice", "它们结成了冰"),
          ],
          solution: t(
            "The first paragraph says the drops join together, grow heavier and fall when they are too heavy to float.",
            "第一段说水滴合在一起，越来越重，重得飘不住时就落下来。",
          ),
        },
        {
          prompt: t("When does water fall as snow instead of rain?", "水什么时候会以雪而不是雨的形式落下？"),
          right: t("When the air is cold all the way from the cloud to the ground", "从云到地面的空气都很冷时"),
          wrong: [
            t("When the cloud is very tall", "云很高的时候"),
            t("When the wind is strong", "风很大的时候"),
            t("When the drops are very small", "水滴很小的时候"),
          ],
          solution: t(
            "The second paragraph says snow falls when the air is cold all the way from the cloud to the ground.",
            "第二段说，从云到地面的空气都很冷时就会下雪。",
          ),
        },
        {
          prompt: t("Why does a large hailstone have layers?", "大冰雹为什么有一层一层的结构？"),
          right: t("Wind pushes it up again and again, and a new layer freezes each time", "风一次次把它往上推，每次都冻上新的一层"),
          wrong: [
            t("It grows like a tree", "它像树一样生长"),
            t("Several snowflakes stick together", "几片雪花粘在一起"),
            t("It melts and freezes on the ground", "它在地面上融化又冻结"),
          ],
          solution: t(
            "The third paragraph says each time a piece of ice is pushed up into the cold top of the cloud, a new layer freezes around it. The tree rings are only a comparison.",
            "第三段说，冰块每次被推到冷的云顶，就会冻上新的一层。树的年轮只是一个比喻。",
          ),
        },
      ],
    },
    {
      id: "the-water-cycle",
      title: t("A Journey Without an End", "没有终点的旅程"),
      body: `Imagine one drop of water in the ocean. The sun warms it, and it evaporates. As water vapor, it rises with warm air until it reaches the cold air high above. There it condenses into a tiny drop in a cloud.

The cloud drifts over the land. The drop joins with others, grows heavy and falls as rain on a hill. It soaks into the ground or runs down the hill into a stream. The stream flows into a river, and the river carries the drop back to the ocean. Then the journey can begin again.

This never-ending trip of water from the sea to the sky to the land and back to the sea is called the water cycle. A cycle is something that happens over and over in the same order.

The water cycle has been going on for billions of years. Earth does not get new water, and it does not lose its old water. The same water keeps going around. The water in your glass today may once have fallen as snow on a mountain, or been part of a cloud above the sea long before there were any people.`,
      topics: [clues],
      xp: 4,
      questions: [
        {
          prompt: t("In the passage, what happens to the drop right after it evaporates?", "文中的水滴蒸发之后，紧接着发生了什么？"),
          right: t("It rises with warm air as water vapor", "它以水蒸气的形式随暖空气上升"),
          wrong: [
            t("It falls as rain on a hill", "它以雨的形式落在山上"),
            t("It flows into a river", "它流进一条河"),
            t("It freezes into snow", "它冻成雪"),
          ],
          solution: t(
            "The first paragraph says that after it evaporates, the drop rises with warm air as water vapor.",
            "第一段说，水滴蒸发后以水蒸气的形式随暖空气上升。",
          ),
        },
        {
          prompt: t("What does the word *cycle* mean in this passage?", "这篇文章中 *cycle* 是什么意思？"),
          right: t("Something that happens over and over in the same order", "按相同顺序一遍遍发生的事"),
          wrong: [
            t("A trip that happens only once", "只发生一次的旅程"),
            t("A kind of cloud", "一种云"),
            t("A river that flows to the sea", "流入大海的河"),
          ],
          solution: t(
            'The third paragraph explains the word: "A cycle is something that happens over and over in the same order."',
            "第三段解释了这个词：“A cycle is something that happens over and over in the same order.”",
          ),
        },
        {
          prompt: t("What can you tell about the water in your glass?", "关于你杯子里的水，可以得出什么结论？"),
          right: t("It is very old water that has gone around the cycle many times", "它是很古老的水，已经循环过很多次"),
          wrong: [
            t("It is new water that Earth just made", "它是地球刚产生的新水"),
            t("It has never been in a cloud", "它从来没有在云里待过"),
            t("It came only from the ocean", "它只来自海洋"),
          ],
          solution: t(
            "The last paragraph says Earth does not get new water; the same water keeps going around.",
            "最后一段说地球不会得到新的水；同样的水一直在循环。",
          ),
        },
      ],
    },
    {
      id: "rivers",
      title: t("The Life of a River", "一条河的一生"),
      body: `Every river starts somewhere. The place where a river begins is called its source. A source may be a spring bubbling out of the ground, a lake, or snow melting high in the mountains.

Near its source, a river is usually small and fast. It rushes downhill over rocks. As it flows, smaller streams join it. A stream or river that flows into a bigger river is called a tributary. With every tributary, the river grows wider and carries more water.

On flatter land, the river slows down. It bends and curves from side to side. Fast water can carry sand and small stones, but slow water drops them. So the river leaves sand and mud along its banks.

At last the river reaches its mouth, the place where it empties into a lake or the sea. The mouth of a large river is often very wide, and the land around it is flat and full of mud the river has carried from far away.

A single river can carry water from rain that fell in many different places, sometimes thousands of miles apart.`,
      topics: [clues, cluesAcademic],
      glossed: ["tributary"],
      xp: 4,
      questions: [
        {
          prompt: t("What is the source of a river?", "河流的 source 是什么？"),
          right: t("The place where it begins", "它开始的地方"),
          wrong: [
            t("The place where it empties into the sea", "它流入大海的地方"),
            t("A smaller stream that joins it", "汇入它的小溪"),
            t("The mud along its banks", "河岸边的泥"),
          ],
          solution: t(
            'The first paragraph says: "The place where a river begins is called its source."',
            "第一段说：“The place where a river begins is called its source.”",
          ),
        },
        {
          prompt: t("Why does a river leave sand and mud on flatter land?", "河流为什么会在平坦的地方留下沙子和泥？"),
          right: t("It slows down, and slow water drops what it carries", "水流变慢了，慢水会把带着的东西放下"),
          wrong: [
            t("Tributaries bring sand there", "支流把沙子带到那里"),
            t("The river becomes smaller", "河流变小了"),
            t("People put it there", "人们把它放在那里"),
          ],
          solution: t(
            "The third paragraph says the river slows down on flatter land, and slow water drops sand and stones.",
            "第三段说河流在平坦的地方变慢，慢水会放下沙子和石头。",
          ),
        },
        {
          prompt: t("Which list follows a river in order, from start to end?", "哪一项按从头到尾的顺序描述了一条河？"),
          right: t("Source, tributaries join, slow curves, mouth", "源头、支流汇入、缓慢弯曲、河口"),
          wrong: [
            t("Mouth, slow curves, tributaries join, source", "河口、缓慢弯曲、支流汇入、源头"),
            t("Slow curves, source, mouth, tributaries join", "缓慢弯曲、源头、河口、支流汇入"),
            t("Source, mouth, tributaries join, slow curves", "源头、河口、支流汇入、缓慢弯曲"),
          ],
          solution: t(
            "The paragraphs follow the river in order: its source, then tributaries joining, then flatter land, then its mouth.",
            "各段按顺序讲述这条河：源头、支流汇入、平坦的地方、河口。",
          ),
        },
      ],
    },
    {
      id: "water-underground",
      title: t("Water Under Our Feet", "我们脚下的水"),
      body: `When rain falls on a field, some of it runs off into streams. Some evaporates. But a lot of it soaks down into the ground, and that water does not simply disappear.

The ground is full of tiny spaces between bits of soil, sand and rock. Water trickles down through these spaces, the way water moves through a sponge. Deep enough down, every space is full. The water stored there is called groundwater.

People have dug wells to reach groundwater for thousands of years. A well is a deep hole that goes down to where the ground is full of water. Water seeps into the bottom of the well, and people lift it out with a bucket or a pump.

Groundwater moves too, but very slowly. Some of it flows into lakes and rivers from below, so a river can keep flowing even when it has not rained for weeks.

Groundwater can run low. If people pump water out faster than rain can soak in to replace it, wells can go dry. Taking care of groundwater means not using it up faster than nature can refill it.`,
      topics: [clues],
      glossed: ["groundwater"],
      xp: 4,
      questions: [
        {
          prompt: t("What does the writer compare the ground to?", "作者把地面比作什么？"),
          right: t("A sponge", "海绵"),
          wrong: [t("A bucket", "水桶"), t("A river", "河流"), t("A cloud", "云")],
          solution: t(
            "The second paragraph says water moves through the spaces in the ground the way water moves through a sponge.",
            "第二段说，水在地下的空隙中移动，就像水在海绵中移动一样。",
          ),
        },
        {
          prompt: t("How can a river keep flowing when it has not rained for weeks?", "几个星期没下雨，河流为什么还能继续流淌？"),
          right: t("Groundwater flows into it from below", "地下水从下面流进河里"),
          wrong: [
            t("Wells pump water into it", "水井把水抽进河里"),
            t("Water vapor turns into river water", "水蒸气变成了河水"),
            t("The river stops evaporating", "河水停止蒸发"),
          ],
          solution: t(
            "The fourth paragraph says some groundwater flows into lakes and rivers from below.",
            "第四段说，一些地下水会从下面流进湖泊和河流。",
          ),
        },
        {
          prompt: t("Why might a well go dry?", "水井为什么可能干涸？"),
          right: t("People pump water out faster than rain can replace it", "人们抽水的速度比雨水补充的速度快"),
          wrong: [
            t("The well is too deep", "井挖得太深"),
            t("Groundwater moves too fast", "地下水流动太快"),
            t("Rain washes the well away", "雨水冲走了水井"),
          ],
          solution: t(
            "The last paragraph says wells can go dry if people pump water out faster than rain can soak in to replace it.",
            "最后一段说，如果人们抽水比雨水渗入补充得快，水井就会干涸。",
          ),
        },
      ],
    },
    {
      id: "glaciers",
      title: t("Rivers of Ice", "冰的河流"),
      body: `In some very cold places, more snow falls each winter than melts each summer. Year after year, the snow piles up. The weight of the new snow presses down on the old snow below until it turns into hard, thick ice. A huge mass of this ice that moves slowly over the land is called a glacier.

It may be hard to believe that ice can move, but a glacier does. It is so heavy that it slides and creeps downhill, like very thick honey. Most glaciers move only a few inches or feet each day, too slowly to see.

As a glacier moves, it scrapes the ground beneath it. It picks up rocks and carries them along, sometimes for many miles. Over thousands of years, glaciers can carve deep valleys into mountains.

Glaciers hold a large share of Earth's fresh water. In many places, the water that melts from glaciers in summer fills rivers that people depend on. When glaciers shrink, those rivers may carry less water in the years to come.`,
      topics: [clues],
      glossed: ["glacier", "glaciers"],
      xp: 4,
      questions: [
        {
          prompt: t("How does a glacier form?", "冰川是怎样形成的？"),
          right: t("Snow piles up year after year and is pressed into ice", "雪年复一年地堆积，被压成冰"),
          wrong: [
            t("A river freezes in winter", "河流在冬天结冰"),
            t("Rain falls on a cold mountain", "雨落在寒冷的山上"),
            t("Ocean water freezes near the poles", "两极附近的海水结冰"),
          ],
          solution: t(
            "The first paragraph says the weight of new snow presses the old snow into hard, thick ice.",
            "第一段说，新雪的重量把下面的旧雪压成又硬又厚的冰。",
          ),
        },
        {
          prompt: t("Why does the writer compare a glacier to thick honey?", "作者为什么把冰川比作浓稠的蜂蜜？"),
          right: t("Both move slowly downhill", "两者都缓慢地向下流动"),
          wrong: [
            t("Both are sweet", "两者都是甜的"),
            t("Both are made of water", "两者都由水组成"),
            t("Both melt in the summer", "两者都在夏天融化"),
          ],
          solution: t(
            "The second paragraph says a glacier slides and creeps downhill, like very thick honey.",
            "第二段说冰川像非常浓稠的蜂蜜一样缓慢向下滑动。",
          ),
        },
        {
          prompt: t("What might happen when glaciers shrink?", "冰川缩小时可能会发生什么？"),
          right: t("Some rivers may carry less water", "一些河流的水可能会变少"),
          wrong: [
            t("Glaciers will move faster than a car", "冰川会比汽车移动得还快"),
            t("Rivers will fill with more water every year", "河流每年的水会越来越多"),
            t("Valleys will disappear", "山谷会消失"),
          ],
          solution: t(
            "The last paragraph says that when glaciers shrink, the rivers they fill may carry less water.",
            "最后一段说，冰川缩小时，由它们补给的河流水量可能会减少。",
          ),
        },
      ],
    },
    {
      id: "saving-fresh-water",
      title: t("Every Drop Counts", "每一滴水都很重要"),
      body: `You have read that only a small share of Earth's water is fresh water that people can reach. That water is needed for drinking, cooking, washing, growing food and making almost everything we buy.

Some places have plenty of fresh water. Others have very little. In dry places, people may have to walk a long way to fetch water each day. Even in rainy places, a long dry spell can leave lakes low and wells empty.

There is good evidence that small changes add up. A dripping tap can waste many gallons of water in a single week. Turning off the tap while you brush your teeth saves water every morning and night. A shorter shower uses less water than a long one.

Farms use more fresh water than anything else. Some farmers now water their crops through small tubes that drip water right onto the roots, so less of it evaporates in the sun.

Keeping water clean matters as much as saving it. Trash and chemicals that are dumped on the ground can wash into rivers or soak down into groundwater. Clean water is a gift that the water cycle gives us again and again, but only if we take care of it.`,
      topics: [clues, cluesAcademic],
      xp: 4,
      questions: [
        {
          prompt: t("What uses the most fresh water, according to the passage?", "根据文章，什么用掉的淡水最多？"),
          right: t("Farms", "农场"),
          wrong: [t("Showers", "淋浴"), t("Brushing teeth", "刷牙"), t("Drinking", "饮用")],
          solution: t(
            'The fourth paragraph says: "Farms use more fresh water than anything else."',
            "第四段说：“Farms use more fresh water than anything else.”",
          ),
        },
        {
          prompt: t("Why do some farmers water crops through small tubes at the roots?", "为什么有些农民用小管子在根部浇水？"),
          right: t("So that less water evaporates in the sun", "这样在阳光下蒸发掉的水更少"),
          wrong: [
            t("So that the plants grow taller", "为了让植物长得更高"),
            t("Because tubes clean the water", "因为管子能净化水"),
            t("Because rain cannot reach the roots", "因为雨水到不了根部"),
          ],
          solution: t(
            "The fourth paragraph says the tubes drip water onto the roots, so less of it evaporates in the sun.",
            "第四段说，管子把水滴到根部，所以在阳光下蒸发得更少。",
          ),
        },
        {
          prompt: t("What is the main idea of the passage?", "这篇文章的主要意思是什么？"),
          right: t("Fresh water is limited, so saving it and keeping it clean matters", "淡水有限，所以节约用水和保持水的清洁很重要"),
          wrong: [
            t("Every place on Earth has plenty of fresh water", "地球上每个地方都有充足的淡水"),
            t("Showers waste more water than farms", "淋浴比农场更浪费水"),
            t("Groundwater can never be polluted", "地下水永远不会被污染"),
          ],
          solution: t(
            "Each paragraph gives a reason or a way to save fresh water or keep it clean, and the last sentence sums this up.",
            "每一段都讲了节约淡水或保持水清洁的原因或方法，最后一句作了总结。",
          ),
        },
      ],
    },
  ],
};
