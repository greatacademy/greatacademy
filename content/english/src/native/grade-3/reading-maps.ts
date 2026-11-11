// Grade 3: the reading unit of the theme of maps: what maps are for, their keys and directions, the continents and
// oceans, the equator and the poles, landforms, and a map of a town.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, clues, passage, words } from "./reading-kit.ts";

const maps = words("words-of-maps");
const land = words("words-of-land-and-water");
const places = words("words-for-places-and-directions");

/** ourWorldOnAMap is the reading unit of grade 3 on maps and the shape of the world. */
export const ourWorldOnAMap: ReadingUnitDef = {
  id: "our-world-on-a-map",
  title: t("Our World on a Map", "地图上的世界"),
  passages: [
    passage(
      "why-we-make-maps",
      t("Why We Make Maps", "我们为什么画地图"),
      `Imagine that you are standing on a tall tower and looking down at your town. You can see the roads, the river, the park and the roofs of the houses. A map is a drawing of a place as it looks from high above.

People have made maps for thousands of years. Long ago, sailors drew maps of the coast so that they could find their way back to port. Travelers drew the routes between towns, and farmers drew the borders of their fields.

Today we still use maps every day. A map on a phone shows the fastest route to a friend's house. A map at the zoo shows where the lions and the penguins live. A map in a school book shows the countries and the seas of the whole world.

A map cannot show everything. It is much smaller than the real place, so the mapmaker chooses what to draw. A map for drivers shows roads, and a map for hikers shows paths and hills. Every map is made for a reason.`,
      [clues, maps, places],
      [
        ask(
          ["What is a map?", "什么是地图？"],
          ["A drawing of a place as it looks from above", "从高处往下看时一个地方的样子的图"],
          [
            ["A photo of a town taken from the street", "从街上拍的一张城镇照片"],
            ["A list of the roads in a town", "一份城镇道路的清单"],
            ["A story about a trip long ago", "一个关于很久以前一次旅行的故事"],
          ],
          [
            "The first paragraph says that a map is a drawing of a place as it looks from high above.",
            "第一段说，地图是一个地方从高处往下看时的样子的图。",
          ],
        ),
        ask(
          ["Why did sailors long ago draw maps of the coast?", "很久以前的水手为什么要画海岸的地图？"],
          ["To find their way back to port", "为了找到回港口的路"],
          [
            ["To show the borders of their fields", "为了标出他们田地的边界"],
            ["To find the lions at the zoo", "为了在动物园里找到狮子"],
            ["To sell them to farmers", "为了卖给农民"],
          ],
          [
            "The second paragraph says sailors drew maps of the coast so that they could find their way back to port.",
            "第二段说，水手画海岸的地图是为了能找到回港口的路。",
          ],
        ),
        ask(
          [
            "Why does a map for hikers show paths and hills but not every road?",
            "为什么给徒步者用的地图画了小路和山丘，却没有画出每条马路？",
          ],
          ["A map is made for a reason, so the mapmaker chooses what to draw", "地图是为某个目的而画的，所以画图的人会选择画什么"],
          [
            ["Hikers are not allowed to walk on roads", "徒步者不能在马路上走"],
            ["Roads are too small to see from above", "从高处看马路太小了，看不见"],
            ["Maps for hikers are drawn by sailors", "给徒步者用的地图是水手画的"],
          ],
          [
            "The last paragraph says a map is smaller than the real place, so the mapmaker chooses what to draw, and every map is made for a reason.",
            "最后一段说，地图比真实的地方小得多，所以画图的人要选择画什么，而且每张地图都是为某个目的而画的。",
          ],
        ),
      ],
    ),
    passage(
      "reading-a-map-key",
      t("Reading a Map Key", "看懂地图图例"),
      `A map uses small pictures and colors called symbols. A tiny tree might stand for a park, a blue line for a river, and a black square for a school. There is not enough room on a map to write the name of every thing, so symbols save space.

How do you know what each symbol means? You look at the map key, which is also called the legend. The key is usually a small box in one corner of the map. It shows each symbol and tells what it stands for.

Colors are part of the key too. On many maps, blue means water and green means land with trees or grass. Brown or orange can show high land, such as hills and mountains.

Some maps also have a scale. A scale is a short line marked with a distance, such as one mile. It tells you how far apart two places really are.

Whenever you open a new map, read the key first. Then the map will make sense.`,
      [clues, maps],
      [
        ask(
          ["Why do maps use symbols?", "地图为什么要用符号？"],
          ["There is not enough room to write the name of every thing", "地图上没有足够的地方写出每样东西的名字"],
          [
            ["Symbols are easier to color than words", "符号比文字更容易上色"],
            ["Mapmakers do not know how to spell the names", "画地图的人不会拼写那些名字"],
            ["Words on a map would show the distance", "地图上的文字会标出距离"],
          ],
          [
            "The first paragraph says there is not enough room to write the name of every thing, so symbols save space.",
            "第一段说，地图上没有足够的地方写出每样东西的名字，所以用符号来节省空间。",
          ],
        ),
        ask(
          ["What is another name for a map key?", "地图图例的另一个名字是什么？"],
          ["A legend", "图例（legend）"],
          [
            ["A scale", "比例尺"],
            ["A symbol", "符号"],
            ["A corner", "角落"],
          ],
          [
            "The second paragraph says you look at the map key, which is also called the legend.",
            "第二段说，你要看地图图例，它也叫作 legend。",
          ],
        ),
        ask(
          ["On many maps, what does the color blue show?", "在许多地图上，蓝色表示什么？"],
          ["Water", "水"],
          [
            ["High land", "高地"],
            ["Land with trees", "有树的陆地"],
            ["Schools", "学校"],
          ],
          ["The third paragraph says that on many maps blue means water.", "第三段说，在许多地图上，蓝色表示水。"],
        ),
      ],
    ),
    passage(
      "north-south-east-and-west",
      t("North, South, East and West", "东南西北"),
      `There are four main directions: north, south, east and west. On most maps, north is at the top, south is at the bottom, east is on the right and west is on the left.

To help you remember, many maps have a compass rose. It is a small drawing shaped like a star, with a letter at each point: N, S, E and W. Some compass roses also show the directions in between, such as northeast, which is between north and east.

Directions help us describe a location. Instead of saying that a lake is "over there," you can say that it is north of the town. A map might show that the forest is in the western part of a country and the big cities are in the eastern part.

The sun can help you find directions outside, too. Every morning it rises in the east, and every evening it sets in the west. If you face the rising sun, north is on your left.

With directions, a map turns into a set of clear instructions.`,
      [clues, places],
      [
        ask(
          ["On most maps, where is east?", "在大多数地图上，东方在哪里？"],
          ["On the right", "在右边"],
          [
            ["At the top", "在上面"],
            ["On the left", "在左边"],
            ["At the bottom", "在下面"],
          ],
          ["The first paragraph says that on most maps east is on the right.", "第一段说，在大多数地图上，东方在右边。"],
        ),
        ask(
          ["What is a compass rose?", "什么是指南针玫瑰图？"],
          ["A drawing shaped like a star that shows the directions", "一个形状像星星、标出方向的图"],
          [
            ["A flower that grows in the north", "一种长在北方的花"],
            ["A line that tells how far apart places are", "一条表示两地相距多远的线"],
            ["The box in the corner that lists the symbols", "角落里列出符号的方框"],
          ],
          [
            "The second paragraph says a compass rose is a small drawing shaped like a star, with a letter at each point for a direction.",
            "第二段说，指南针玫瑰图是一个形状像星星的小图，每个角上都有一个表示方向的字母。",
          ],
        ),
        ask(
          ["If you face the rising sun, which direction is on your left?", "如果你面朝升起的太阳，你的左边是哪个方向？"],
          ["North", "北方"],
          [
            ["South", "南方"],
            ["West", "西方"],
            ["East", "东方"],
          ],
          [
            "The fourth paragraph says the sun rises in the east, and if you face the rising sun, north is on your left.",
            "第四段说，太阳从东方升起，如果你面朝升起的太阳，北方就在你的左边。",
          ],
        ),
      ],
      ["N", "S", "E", "W"],
    ),
    passage(
      "seven-continents",
      t("Seven Continents", "七大洲"),
      `If you look at a globe, you will see that most of our planet is covered with water. The land is gathered into seven huge pieces called continents.

The biggest continent is Asia. More people live in Asia than on all the other continents put together, and it has the highest mountain in the world. Africa is the second biggest. It has the longest river, the Nile, and a desert larger than many countries.

North America and South America are joined by a narrow strip of land. Europe is a smaller continent with many countries close together, and it is joined to Asia by land. Australia is the smallest continent, and it is also a country.

The seventh continent is Antarctica, at the very bottom of the globe. It is covered with ice all year, and no one lives there for good. Only scientists stay there for a few months at a time, along with penguins and seals.

Each continent has its own animals, plants and weather. Together they make up the land of our world.`,
      [clues, maps],
      [
        ask(
          ["Which continent is the biggest?", "哪个洲最大？"],
          ["Asia", "亚洲"],
          [
            ["Africa", "非洲"],
            ["Australia", "澳洲"],
            ["Antarctica", "南极洲"],
          ],
          ["The second paragraph says the biggest continent is Asia.", "第二段说，最大的洲是亚洲。"],
        ),
        ask(
          ["Which continent is also a country?", "哪个洲同时也是一个国家？"],
          ["Australia", "澳洲"],
          [
            ["Europe", "欧洲"],
            ["South America", "南美洲"],
            ["Asia", "亚洲"],
          ],
          [
            "The third paragraph says Australia is the smallest continent, and it is also a country.",
            "第三段说，澳洲是最小的洲，它也是一个国家。",
          ],
        ),
        ask(
          ["Why does no one live in Antarctica for good?", "为什么没有人长期住在南极洲？"],
          ["It is covered with ice all year", "它一年到头都被冰覆盖"],
          [
            ["It is the biggest continent", "它是最大的洲"],
            ["It has too many penguins and seals", "那里的企鹅和海豹太多了"],
            ["It is joined to Asia by land", "它和亚洲由陆地相连"],
          ],
          [
            "The fourth paragraph says Antarctica is covered with ice all year, and only scientists stay there for a few months at a time.",
            "第四段说，南极洲一年到头都被冰覆盖，只有科学家每次在那里待几个月。",
          ],
        ),
      ],
      ["Asia", "Africa", "Nile", "America", "Europe", "Australia", "Antarctica"],
    ),
    passage(
      "five-oceans",
      t("Five Oceans", "五大洋"),
      `Water covers about seven out of every ten parts of Earth. Most of that water is in five great oceans, and they are all joined together.

The Pacific Ocean is the largest and the deepest. It is so wide that all the continents could fit inside it with room to spare. The Atlantic Ocean is the second largest. It lies between the Americas on the west and Europe and Africa on the east. Long ago, sailors spent many weeks crossing it in wooden ships.

The Indian Ocean is the warmest. It lies south of Asia, between Africa and Australia. The Southern Ocean flows all the way around Antarctica, and its icy water is home to whales and penguins. The smallest is the Arctic Ocean, in the far north. For much of the year, its surface is frozen.

Oceans are salty, so we cannot drink their water. But they give us fish to eat, and their winds and waves help shape the weather on land. Along every coast there are bays and gulfs, where the ocean reaches into the land.`,
      [clues, land],
      [
        ask(
          ["Which ocean is the largest and the deepest?", "哪个大洋最大、最深？"],
          ["The Pacific Ocean", "太平洋"],
          [
            ["The Atlantic Ocean", "大西洋"],
            ["The Indian Ocean", "印度洋"],
            ["The Arctic Ocean", "北冰洋"],
          ],
          ["The second paragraph says the Pacific Ocean is the largest and the deepest.", "第二段说，太平洋最大、最深。"],
        ),
        ask(
          ["Where is the Southern Ocean?", "南大洋在哪里？"],
          ["All the way around Antarctica", "环绕着整个南极洲"],
          [
            ["Between Africa and Australia", "在非洲和澳洲之间"],
            ["In the far north", "在遥远的北方"],
            ["Between the Americas and Europe", "在美洲和欧洲之间"],
          ],
          ["The third paragraph says the Southern Ocean flows all the way around Antarctica.", "第三段说，南大洋环绕着整个南极洲流动。"],
        ),
        ask(
          ["Why can we not drink ocean water?", "为什么我们不能喝海水？"],
          ["It is salty", "海水是咸的"],
          [
            ["It is frozen all year", "它一年到头都结着冰"],
            ["It is too deep", "它太深了"],
            ["It is full of whales", "里面全是鲸鱼"],
          ],
          ["The last paragraph says oceans are salty, so we cannot drink their water.", "最后一段说，海洋是咸的，所以我们不能喝海水。"],
        ),
      ],
      ["Earth", "Pacific", "Atlantic", "Americas", "Europe", "Africa", "Indian", "Asia", "Australia", "Antarctica", "Arctic"],
    ),
    passage(
      "the-equator-and-the-poles",
      t("The Equator and the Poles", "赤道和两极"),
      `Look closely at a globe and you will see a line drawn around its middle, like a belt. This line is called the equator. It is not a real line on the ground, but it helps us find places.

The equator divides the world into two halves. Each half is called a hemisphere. The northern hemisphere is the half above the equator, and the southern hemisphere is the half below it. Most of the world's land, and most of its people, are in the northern hemisphere.

Places near the equator are hot all year. The sun shines almost straight down on them, so there is no cold winter. Rainforests grow there, full of parrots, monkeys and huge trees.

At the very top of the globe is the North Pole, and at the very bottom is the South Pole. These are the coldest places on Earth. The sun's light reaches them at a low slant, so it gives little heat.

The farther a place is from the equator, the colder its winters usually are.`,
      [clues, maps, places],
      [
        ask(
          ["What is the equator?", "什么是赤道？"],
          ["A line drawn around the middle of the globe", "画在地球仪中间的一条线"],
          [
            ["A real wall built around the world", "一道真正绕着世界修建的墙"],
            ["The coldest place on Earth", "地球上最冷的地方"],
            ["A belt that sailors wear", "水手系的一种腰带"],
          ],
          [
            "The first paragraph says the equator is a line drawn around the middle of the globe, and it is not a real line on the ground.",
            "第一段说，赤道是画在地球仪中间的一条线，它并不是地面上真正的线。",
          ],
        ),
        ask(
          ["What is a hemisphere?", "什么是半球？"],
          ["Half of the world", "世界的一半"],
          [
            ["A line around a globe", "地球仪上的一条线"],
            ["A kind of rainforest", "一种雨林"],
            ["The top of the globe", "地球仪的顶端"],
          ],
          [
            "The second paragraph says the equator divides the world into two halves, and each half is called a hemisphere.",
            "第二段说，赤道把世界分成两半，每一半叫作一个半球。",
          ],
        ),
        ask(
          ["Why are the poles so cold?", "为什么两极这么冷？"],
          ["The sun's light reaches them at a low slant and gives little heat", "阳光斜斜地照到那里，带来的热量很少"],
          [
            ["They are covered with rainforests", "那里长满了雨林"],
            ["They are in the middle of the globe", "它们在地球仪的中间"],
            ["Most of the world's people live there", "世界上大多数人住在那里"],
          ],
          [
            "The fourth paragraph says the sun's light reaches the poles at a low slant, so it gives little heat.",
            "第四段说，阳光斜斜地照到两极，所以带来的热量很少。",
          ],
        ),
      ],
      ["Earth"],
    ),
    passage(
      "mountains-valleys-and-plains",
      t("Mountains, Valleys and Plains", "山、山谷和平原"),
      `The land of our world is not flat like a table. It rises and falls in many shapes.

Mountains are the highest land. Their tops can be so high that snow stays on them all summer. A long line of mountain tops is called a ridge. Between mountains there are often valleys, which are low strips of land. Rivers flow along the bottom of many valleys, and people build farms and villages beside them.

When a river cuts deep into rock for millions of years, it can make a canyon. A canyon has steep, rocky sides called cliffs. Some canyons are so deep that it takes a whole day to walk to the bottom.

A plateau is high land with a flat top. It is like a table raised above the land around it. A plain is low, flat land that stretches as far as you can see. Plains are good for growing wheat and corn, and many big cities are built on them.

Near the coast, the land may turn wet and soft. A swamp is land covered with shallow water, where trees and reeds grow.`,
      [clues, land],
      [
        ask(
          ["What is a ridge?", "什么是山脊？"],
          ["A long line of mountain tops", "一长排山顶"],
          [
            ["A low strip of land between mountains", "两座山之间低低的一条地"],
            ["High land with a flat top", "顶部平坦的高地"],
            ["Land covered with shallow water", "被浅水覆盖的土地"],
          ],
          ["The second paragraph says a long line of mountain tops is called a ridge.", "第二段说，一长排山顶叫作山脊。"],
        ),
        ask(
          ["How is a canyon made?", "峡谷是怎样形成的？"],
          ["A river cuts deep into rock for millions of years", "河流在几百万年里深深地切入岩石"],
          [
            ["People dig it to build a city", "人们为了建城市把它挖出来"],
            ["Snow stays on a mountain all summer", "雪整个夏天都留在山上"],
            ["Trees and reeds grow in shallow water", "树和芦苇长在浅水里"],
          ],
          [
            "The third paragraph says that when a river cuts deep into rock for millions of years, it can make a canyon.",
            "第三段说，河流在几百万年里深深地切入岩石，就能形成峡谷。",
          ],
        ),
        ask(
          ["How is a plateau different from a plain?", "高原和平原有什么不同？"],
          ["A plateau is high and flat, and a plain is low and flat", "高原又高又平，平原又低又平"],
          [
            ["A plateau is wet, and a plain is dry", "高原是湿的，平原是干的"],
            ["A plateau has steep sides, and a plain is a river", "高原有陡峭的边，平原是一条河"],
            ["A plateau is low, and a plain is high", "高原低，平原高"],
          ],
          [
            "The fourth paragraph says a plateau is high land with a flat top and a plain is low, flat land.",
            "第四段说，高原是顶部平坦的高地，平原是又低又平的土地。",
          ],
        ),
      ],
    ),
    passage(
      "a-map-of-our-town",
      t("A Map of Our Town", "我们小镇的地图"),
      `Mr. Hill's class made a map of their town, Riverton. First they drew the river, which runs from north to south through the middle of the town. Then they drew a grid of lines over the map, like the squares on a chessboard. Each row has a letter and each column has a number, so every square has a name, such as B3.

The children chose a symbol for each landmark. A small bell stands for the old clock tower in square B2, in the central square of the town. A book stands for the library, just east of the river in C2. A tent stands for the campground in the northern part of town, in A1.

Next they marked the route from the school to the library. You leave the school in C4, walk north along Oak Street, and cross the bridge. The library is nearby, on the right.

Last, they added a key in the corner and a compass rose. Now anyone who visits Riverton can find the way, even to the most distant corner of town.`,
      [clues, maps, places],
      [
        ask(
          ["Why did the class draw a grid over the map?", "全班为什么要在地图上画网格？"],
          ["So that every square has a name, such as B3", "这样每个方格都有一个名字，比如 B3"],
          [
            ["So that the river runs from north to south", "这样河流就能从北流向南"],
            ["So that the map looks like a chessboard game", "这样地图看起来就像棋盘游戏"],
            ["So that the library is east of the river", "这样图书馆就在河的东边"],
          ],
          [
            "The first paragraph says each row has a letter and each column has a number, so every square has a name, such as B3.",
            "第一段说，每一行有一个字母，每一列有一个数字，所以每个方格都有一个名字，比如 B3。",
          ],
        ),
        ask(
          ["What does the bell on the map stand for?", "地图上的铃铛代表什么？"],
          ["The old clock tower", "老钟楼"],
          [
            ["The library", "图书馆"],
            ["The campground", "露营地"],
            ["The school", "学校"],
          ],
          [
            "The second paragraph says a small bell stands for the old clock tower in square B2.",
            "第二段说，小铃铛代表 B2 方格里的老钟楼。",
          ],
        ),
        ask(
          ["To walk from the school to the library, which way do you go along Oak Street?", "从学校走到图书馆，沿着橡树街要往哪个方向走？"],
          ["North", "北"],
          [
            ["South", "南"],
            ["West", "西"],
            ["East", "东"],
          ],
          [
            "The third paragraph says you leave the school, walk north along Oak Street and cross the bridge.",
            "第三段说，你离开学校，沿着橡树街往北走，然后过桥。",
          ],
        ),
      ],
      ["Hill", "Hill's", "Riverton", "Oak", "B", "C"],
    ),
  ],
};
