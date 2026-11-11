// Grade 4: the reading units of two science themes: deserts, rainforests and polar lands, and energy.

import { type ReadingUnitDef, t } from "@ga/content";
import { edge, passage, q } from "./reading-kit.ts";

const biome = edge("words-of-climate-zones");
const desert = edge("words-of-deserts-and-rainforests");
const polar = edge("words-of-the-polar-lands");
const comparing = edge("words-for-comparing");
const compare = edge("compare-and-contrast-in-texts", 0.3);
const details = edge("supporting-details", 0.3);
const causes = edge("cause-and-effect-chains", 0.3);
const energy = edge("words-of-energy");
const lightSound = edge("words-of-light-and-sound");
const saving = edge("words-for-using-and-saving");
const how = edge("explanations-of-how-things-work", 0.3);
const academic1 = edge("academic-words-1");

/** biomesUnit is the reading unit of deserts, rainforests and polar lands. */
export const biomesUnit: ReadingUnitDef = {
  id: "deserts-rainforests-and-polar-lands",
  title: t("Deserts, Rainforests and Polar Lands", "沙漠、雨林和极地"),
  passages: [
    passage(
      "what-is-a-biome",
      ["What Is a Biome?", "什么是生物群落？"],
      `If you could fly around the world in a single day, you would see the land change again and again. You might pass over hot sand, then thick green forest, then flat fields of grass, then ice that sparkles in the sun.

      Each of these places is a biome. A biome is a large area with its own climate and its own kinds of plants and animals. The two things that matter most are how warm a place is and how much rain it gets. A desert is dry. A rainforest is warm and wet. The tundra is cold and dry, and a temperate forest has four seasons.

      Plants and animals are suited to the biome they live in. A cactus would not last long in a frozen land, and a polar bear would be miserable in the jungle. Each living thing has features that help it survive in its own home.

      Biomes are not divided by neat lines. A desert slowly turns into a grassland, and a grassland slowly turns into a forest. Scientists group the world into biomes to help us compare places and understand how life fits the land.`,
      [biome, comparing, compare, academic1],
      [
        q(
          ["What is a biome?", "什么是生物群落？"],
          ["A large area with its own climate, plants and animals", "一个有自己的气候、植物和动物的大区域"],
          [
            ["Any place where people have built a city", "任何人们建了城市的地方"],
            ["A map that shows where it rains most", "一张显示哪里雨水最多的地图"],
            ["A kind of plant that grows only in the hottest deserts", "一种只长在最炎热沙漠里的植物"],
          ],
          [
            "The second paragraph defines a biome as a large area with its own climate and its own kinds of plants and animals.",
            "第二段把生物群落定义为一个有自己的气候以及特有动植物的大区域。",
          ],
        ),
        q(
          ["According to the passage, which two things matter most in a biome?", "根据文章，生物群落中最重要的两点是什么？"],
          ["How warm it is and how much rain it gets", "有多温暖以及降雨有多少"],
          [
            ["How big it is and how many people live there", "有多大以及住了多少人"],
            ["How tall its trees grow and how old they are", "树长多高以及有多老"],
            ["How far it is from the sea and the mountains", "离大海和山有多远"],
          ],
          [
            "The second paragraph says the two things that matter most are how warm a place is and how much rain it gets.",
            "第二段说，最重要的两点是一个地方有多温暖、雨水有多少。",
          ],
        ),
        q(
          ["Why does the author say that biomes are not divided by neat lines?", "作者为什么说生物群落之间没有整齐的分界线？"],
          ["One biome slowly turns into the next", "一种群落会慢慢过渡到下一种"],
          [
            ["Scientists have not yet drawn their maps", "科学家还没有画出地图"],
            ["Every biome is exactly the same size", "每种生物群落的大小完全相同"],
            ["Animals move the lines between them", "动物会移动它们之间的分界线"],
          ],
          [
            "The last paragraph explains that a desert slowly turns into a grassland, and a grassland into a forest.",
            "最后一段解释说，沙漠慢慢变成草原，草原又慢慢变成森林。",
          ],
        ),
      ],
    ),
    passage(
      "life-in-the-sahara",
      ["Life in the Sahara", "撒哈拉的生活"],
      `The Sahara stretches across the north of Africa. It is the largest hot desert in the world, about as big as the whole United States. Some years, parts of it get no rain at all.

      In the daytime the Sahara is scorching. The sand can grow hot enough to burn bare feet. At night, though, the heat escapes into the clear sky, and the air can become cold. Desert animals must survive both extremes.

      Many of them hide from the sun. The fennec fox sleeps in a cool burrow during the day and hunts after dark. Its huge ears do two jobs: they help it hear insects moving under the sand, and they let extra heat leave its body. Beetles collect tiny drops of water from the morning fog on their backs.

      People live in the Sahara too. For thousands of years, herders have traveled with their camels and goats from one oasis to the next. An oasis is a place where water rises from under the ground, so date palms and gardens can grow there. In a land where water is so scarce, every oasis is precious.`,
      [desert, details],
      [
        q(
          ["How does the fennec fox avoid the heat of the day?", "耳廓狐怎样躲避白天的炎热？"],
          ["It sleeps in a burrow and hunts at night", "它在洞里睡觉，夜里捕猎"],
          [
            ["It swims in the water of an oasis", "它在绿洲的水里游泳"],
            ["It climbs date palms to find some shade", "它爬上枣椰树找阴凉"],
            ["It travels with herders and their camels", "它跟着牧民和骆驼一起走"],
          ],
          [
            "The third paragraph says the fennec fox sleeps in a cool burrow during the day and hunts after dark.",
            "第三段说，耳廓狐白天在凉爽的洞里睡觉，天黑后出来捕猎。",
          ],
        ),
        q(
          ["What are the two jobs of the fennec fox's ears?", "耳廓狐的耳朵有哪两个作用？"],
          ["Hearing insects and letting out heat", "听见昆虫和散发热量"],
          [
            ["Keeping out sand and finding water", "挡住沙子和寻找水源"],
            ["Scaring enemies and digging burrows", "吓跑敌人和挖洞"],
            ["Collecting fog and staying warm at night", "收集雾气和夜里保暖"],
          ],
          [
            "The third paragraph says the ears help the fox hear insects under the sand and let extra heat leave its body.",
            "第三段说，耳朵帮狐狸听到沙下的昆虫，也让多余的热量散出身体。",
          ],
        ),
        q(
          ["Why can gardens grow at an oasis?", "为什么绿洲能长出园圃？"],
          ["Water rises there from under the ground", "那里有水从地下涌出"],
          [
            ["It rains there almost every day", "那里几乎每天都下雨"],
            ["The sand there is never hot", "那里的沙子从来不热"],
            ["Herders carry water to it on camels", "牧民用骆驼把水运过去"],
          ],
          [
            "The last paragraph defines an oasis as a place where water rises from under the ground, so plants can grow.",
            "最后一段把绿洲定义为有水从地下涌出的地方，所以植物能生长。",
          ],
        ),
      ],
      { names: ["Sahara", "Africa", "United States"] },
    ),
    passage(
      "plants-that-store-water",
      ["Plants That Store Water", "储水的植物"],
      `In the desert, rain may fall only a few times a year. When it does come, it often arrives in a sudden storm and then soaks away into the sand. Desert plants have clever ways to catch that water and save it for months.

      The saguaro cactus is one of the best at this. Its thick stem is folded like the pleats of a skirt. After a storm, its shallow roots, which spread wide just under the surface, soak up as much water as they can. The pleats open out so that the stem can swell. A large saguaro can hold hundreds of liters, enough to last through a long dry season.

      Desert plants also keep the water they have stored. Instead of wide leaves, which would lose water into the air, a cactus has spines. The spines lose very little water, and they keep thirsty animals from taking a bite. A waxy skin seals the water inside.

      Other plants have their own tricks. Some grow very long roots that reach water deep underground. Others wait as seeds until rain falls, then sprout, bloom and make new seeds in just a few weeks.`,
      [desert, how],
      [
        q(
          ["What happens to the saguaro's stem after a storm?", "暴雨过后，巨柱仙人掌的茎会怎样？"],
          ["Its pleats open out so it can swell with water", "它的褶皱张开，让茎吸水膨胀"],
          [
            ["It grows new leaves to catch the rain", "它长出新叶子来接雨水"],
            ["It loses its spines into the sand", "它的刺掉进沙子里"],
            ["It folds its pleats tighter to keep the blowing sand out", "它把褶皱收得更紧，挡住飞沙"],
          ],
          [
            "The second paragraph says the pleats open out so that the stem can swell with the water the roots soak up.",
            "第二段说，褶皱张开，茎就能因根吸进的水而膨胀。",
          ],
        ),
        q(
          ["Why does a cactus have spines instead of wide leaves?", "仙人掌为什么长刺而不长宽叶子？"],
          ["Spines lose little water and keep animals away", "刺很少失水，还能挡住动物"],
          [
            ["Spines help it catch insects to eat", "刺帮它捕捉昆虫来吃"],
            ["Spines make the plant grow faster", "刺让植物长得更快"],
            ["Spines soak up water from the air", "刺能从空气中吸水"],
          ],
          [
            "The third paragraph says wide leaves would lose water, while spines lose very little and keep thirsty animals from biting.",
            "第三段说，宽叶子会失水，而刺几乎不失水，还能防止口渴的动物来咬。",
          ],
        ),
        q(
          ["Which detail shows another trick of desert plants?", "哪个细节说明了沙漠植物的另一种办法？"],
          ["Some wait as seeds until rain falls", "有些以种子的形式等到下雨"],
          [
            ["Some have a waxy skin", "有些有一层蜡质的皮"],
            ["Some spread their roots under the surface", "有些把根铺在地表下"],
            ["Some swell after a storm", "有些在暴雨后膨胀"],
          ],
          [
            "The last paragraph names other tricks: very long roots, or waiting as seeds until rain falls. The other details describe the cactus.",
            "最后一段讲了其他办法：很长的根，或以种子的形式等到下雨。其他细节说的都是仙人掌。",
          ],
        ),
      ],
      { names: ["saguaro"] },
    ),
    passage(
      "layers-of-the-rainforest",
      ["Layers of the Rainforest", "雨林的层次"],
      `A rainforest is like a tall building with several floors. Each floor, or layer, gets a different amount of light, so different plants and animals live on each one.

      At the very top is the emergent layer. Here a few giant trees poke out above all the others, sixty meters or more above the ground. They face strong sun and wind. Eagles build their nests in their branches.

      Below them is the canopy, a thick green roof of treetops. Most of the forest's animals live here, because the canopy is full of leaves, fruit and flowers. Monkeys, parrots and tree frogs may spend their whole lives in it.

      Under the canopy lies the understory. Little sunlight reaches it, so the plants here have large, dark leaves that can catch every bit of light. Vines twist up the trunks toward the sun, and jaguars rest on low branches.

      At the bottom is the forest floor. It is dark, damp and still. Leaves that fall here rot quickly in the warm, wet air, and their goodness goes back into the soil. Ants, beetles and fungi clean up the forest, and the cycle begins again.`,
      [desert, details],
      [
        q(
          ["Why do most of the rainforest's animals live in the canopy?", "为什么雨林中的大多数动物生活在树冠层？"],
          ["It is full of leaves, fruit and flowers", "那里有大量的叶子、果实和花"],
          [
            ["It is the darkest and stillest layer", "那是最暗、最静的一层"],
            ["It is the only layer with any trees", "那是唯一有树的一层"],
            ["It is safe from rain and wind", "那里不受风雨影响"],
          ],
          [
            "The third paragraph says most animals live in the canopy because it is full of leaves, fruit and flowers.",
            "第三段说，大多数动物生活在树冠层，因为那里有大量的叶子、果实和花。",
          ],
        ),
        q(
          ["Why do understory plants have large, dark leaves?", "为什么林下层的植物叶子又大又深？"],
          ["To catch the little light that reaches them", "为了接住照到它们的少量光线"],
          [
            ["To hide from the jaguars that hunt on the branches", "为了躲避在树枝上捕猎的美洲豹"],
            ["To keep the strong wind away", "为了挡住强风"],
            ["To store water for the dry season", "为了给旱季储水"],
          ],
          [
            "The fifth paragraph says little sunlight reaches the understory, so its plants have large, dark leaves to catch every bit of light.",
            "第五段说，林下层照到的阳光很少，所以那里的植物长着又大又深的叶子，好接住每一点光。",
          ],
        ),
        q(
          ["In what order does the passage describe the layers?", "文章是按什么顺序介绍各层的？"],
          ["From the top down to the floor", "从顶部往下到地面"],
          [
            ["From the floor up to the top", "从地面往上到顶部"],
            ["From the wettest to the driest", "从最湿到最干"],
            ["From the smallest to the largest", "从最小到最大"],
          ],
          [
            "The passage begins with the emergent layer at the very top and ends with the forest floor at the bottom.",
            "文章从最顶部的露生层开始，到最底部的地面层结束。",
          ],
        ),
      ],
      { glossed: ["emergent"] },
    ),
    passage(
      "animals-of-the-canopy",
      ["Animals of the Canopy", "树冠层的动物"],
      `High in the canopy of the rainforest, there is food everywhere, but getting around is not easy. The ground is far below, and one slip could mean a long fall. The animals that live here have bodies built for life in the treetops.

      Spider monkeys are some of the best climbers. Their long tails can wrap around a branch and hold their whole weight, so they work like a fifth hand. A spider monkey can hang by its tail while it uses its hands to pick fruit.

      The sloth takes a different approach. Instead of racing through the trees, it moves so slowly that it hardly uses any energy. It hangs upside down by its hooked claws and chews leaves all day. Tiny green plants grow in its fur, which helps it blend in with the leaves.

      Some animals do not climb at all; they glide. The flying frog has wide, webbed feet. When it leaps from a branch, it spreads its toes, and the webs act like small parachutes that carry it to the next tree.

      Toucans use their huge, bright beaks to reach fruit at the tips of thin branches. The beaks look heavy, but they are light and hollow inside.`,
      [desert, comparing, compare],
      [
        q(
          ["How is a spider monkey's tail like a fifth hand?", "蜘蛛猴的尾巴为什么像第五只手？"],
          ["It can wrap around a branch and hold its weight", "它能缠住树枝撑起全身的重量"],
          [
            ["It can pick fruit and carry it home", "它能摘果子带回家"],
            ["It spreads out like a parachute", "它像降落伞一样张开"],
            ["It is covered with tiny green plants", "它上面长满了绿色的小植物"],
          ],
          [
            "The second paragraph says the tail can wrap around a branch and hold the monkey's whole weight while its hands pick fruit.",
            "第二段说，尾巴能缠住树枝撑起猴子的全身重量，这时它的手可以摘果子。",
          ],
        ),
        q(
          ["How is the sloth different from the spider monkey?", "树懒和蜘蛛猴有什么不同？"],
          ["It moves slowly to save energy", "它行动缓慢以节省能量"],
          [
            ["It races quickly from tree to tree", "它在树间快速穿梭"],
            ["It glides on webbed feet", "它用有蹼的脚滑翔"],
            ["It eats only fruit at branch tips", "它只吃枝头的果子"],
          ],
          [
            "The third paragraph says that instead of racing through the trees, the sloth moves so slowly that it hardly uses any energy.",
            "第三段说，树懒不在树间飞奔，而是动得极慢，几乎不消耗能量。",
          ],
        ),
        q(
          ["What helps the sloth blend in with the leaves?", "什么帮助树懒与树叶融为一体？"],
          ["Tiny green plants growing in its fur", "长在它毛里的绿色小植物"],
          [
            ["Its huge, bright, hollow beak", "它又大又亮的空心喙"],
            ["Its long tail wrapped around a branch", "它缠在树枝上的长尾巴"],
            ["Its wide, webbed feet and toes", "它宽大的蹼足和脚趾"],
          ],
          [
            "The third paragraph says tiny green plants grow in the sloth's fur, which helps it blend in with the leaves.",
            "第三段说，树懒的毛里长着绿色的小植物，这帮它与树叶融为一体。",
          ],
        ),
      ],
    ),
    passage(
      "the-frozen-tundra",
      ["The Frozen Tundra", "冰冻的苔原"],
      `Near the top of the world lies the tundra, a cold, flat land with no tall trees. In winter, the sun may not rise for weeks, and the wind is harsh. Even in summer, which lasts only about two months, the ground does not fully thaw.

      Under the surface lies permafrost, ground that stays frozen all year. In summer the top layer of soil melts, but the water cannot sink into the frozen ground below. It collects in thousands of shallow ponds and bogs, and clouds of mosquitoes hatch above them.

      Because roots cannot grow deep, tundra plants stay small. Mosses, grasses and lichens grow close to the ground, out of the frigid wind. In the short summer, when the sun shines almost all day and night, tiny flowers bloom in bright patches of yellow, white and purple.

      Animals come and go with the seasons. Huge herds of caribou travel north to eat the summer plants and walk south again before winter. Millions of birds fly in to nest beside the ponds. A few animals, such as the arctic fox and the musk ox, stay all year. Their thick coats keep them warm through the long, dark winter.`,
      [polar, causes],
      [
        q(
          ["Why does summer water collect in ponds on the tundra?", "为什么夏天苔原上的水会积成池塘？"],
          ["It cannot sink into the frozen ground below", "它渗不进下面冻结的土地"],
          [
            ["It rains every day during the summer", "夏天每天都下雨"],
            ["The ponds are filled by icebergs that melt in summer", "池塘由夏天融化的冰山注满"],
            ["Caribou dig the ponds with their hooves", "驯鹿用蹄子挖出了池塘"],
          ],
          [
            "The second paragraph explains that the melted water cannot sink into the permafrost, so it collects in shallow ponds.",
            "第二段解释说，融化的水渗不进永久冻土，所以积成浅浅的池塘。",
          ],
        ),
        q(
          ["What causes tundra plants to stay small?", "是什么使苔原植物长得矮小？"],
          ["Their roots cannot grow deep", "它们的根扎不深"],
          [
            ["The caribou eat their tops", "驯鹿吃掉了它们的顶部"],
            ["There is too much sunlight", "阳光太多了"],
            ["The mosquitoes damage them", "蚊子损害了它们"],
          ],
          [
            "The third paragraph begins: because roots cannot grow deep, tundra plants stay small.",
            "第三段开头说：因为根扎不深，苔原植物长得矮小。",
          ],
        ),
        q(
          ["Which animals stay on the tundra all year?", "哪些动物全年都待在苔原上？"],
          ["The arctic fox and the musk ox", "北极狐和麝牛"],
          [
            ["The caribou and the mosquitoes", "驯鹿和蚊子"],
            ["The nesting birds and the caribou", "筑巢的鸟和驯鹿"],
            ["The musk ox and the nesting birds", "麝牛和筑巢的鸟"],
          ],
          [
            "The last paragraph says a few animals, such as the arctic fox and the musk ox, stay all year, while caribou and birds come and go.",
            "最后一段说，有几种动物全年留下，比如北极狐和麝牛，而驯鹿和鸟会来来去去。",
          ],
        ),
      ],
    ),
    passage(
      "living-on-the-ice",
      ["Living on the Ice", "生活在冰上"],
      `In the Arctic, the sea itself freezes. Each winter, a thick sheet of ice spreads across the ocean, and for months it is the main hunting ground of the polar bear.

      Polar bears are built for the cold. Under their fur is a layer of blubber, or thick fat, as much as ten centimeters deep. Their fur looks white, but each hair is hollow and clear, and their skin underneath is black, which soaks up the warmth of the sun. Wide paws spread their weight on thin ice and work like paddles in the water.

      A polar bear's main food is the seal. Seals swim under the ice but must come up to breathe at small holes. A bear may wait beside a hole for hours, perfectly still, until a seal appears.

      In summer, much of the ice melts and breaks into floes, floating pieces that drift apart. Then the bears must swim long distances or wait on land, where there is little to eat. As the Earth grows warmer, the ice melts earlier each spring and freezes later each autumn. Scientists worry that the bears will have less and less time to hunt.`,
      [polar, causes],
      [
        q(
          ["What is under a polar bear's fur?", "北极熊的毛下面是什么？"],
          ["Black skin and a thick layer of fat", "黑色的皮肤和厚厚的脂肪层"],
          [
            ["White skin and a layer of feathers", "白色的皮肤和一层羽毛"],
            ["Thin skin with no fat at all", "薄薄的皮肤，完全没有脂肪"],
            ["A second coat of hollow hair", "第二层空心的毛"],
          ],
          [
            "The second paragraph says there is a layer of blubber under the fur and that the skin underneath is black.",
            "第二段说，毛下面有一层脂肪，下面的皮肤是黑色的。",
          ],
        ),
        q(
          ["How does a polar bear catch a seal?", "北极熊怎样捕捉海豹？"],
          ["It waits beside a breathing hole in the ice", "它守在冰面的呼吸孔旁边"],
          [
            ["It chases the seal on land in summer", "它夏天在陆地上追海豹"],
            ["It dives deep under the floating floes to catch it", "它潜到浮冰下深处去抓"],
            ["It digs a burrow to trap the seal", "它挖洞来困住海豹"],
          ],
          [
            "The third paragraph says seals must come up to breathe at holes, and a bear waits beside a hole until a seal appears.",
            "第三段说，海豹必须到冰洞处换气，熊就守在洞旁直到海豹出现。",
          ],
        ),
        q(
          ["Why do scientists worry about the polar bears?", "科学家为什么担心北极熊？"],
          ["Melting ice leaves them less time to hunt", "冰融化使它们捕猎的时间变少"],
          [
            ["Their fur is turning from white to black", "它们的毛正从白变黑"],
            ["There are too many seals in the sea", "海里的海豹太多了"],
            ["Their paws are too wide for the ice", "它们的爪子对冰面来说太宽了"],
          ],
          [
            "The last paragraph says the ice melts earlier and freezes later, so the bears have less and less time to hunt.",
            "最后一段说，冰融化得更早、结冰得更晚，所以熊捕猎的时间越来越少。",
          ],
        ),
      ],
      { names: ["Arctic", "Earth"] },
    ),
    passage(
      "when-lands-change",
      ["When Lands Change", "土地变化的时候"],
      `Biomes may seem as if they will last forever, but they can change. Some changes take thousands of years. Others happen within a single lifetime.

      Long ago, the Sahara was not a desert at all. About eight thousand years ago, it was a green land of grass, lakes and rivers. People painted pictures of giraffes, cattle and swimmers on the rocks there. Then, slowly, the rains moved south, the lakes dried up and the sand spread. The paintings remain as a record of a greener time.

      Today some changes are much faster, and people bring about many of them. When a rainforest is cut down for farms, the soil is soon washed away by heavy rain, and the forest may never grow back. When grasslands are grazed too heavily, the plants that hold the soil in place disappear, and the land can turn to dust. This is one way that deserts spread.

      People can also help lands recover. In parts of Africa, farmers have planted millions of trees along the edge of the desert. The roots hold the soil, the shade keeps it damp, and crops grow again where there was only dust.`,
      [biome, causes],
      [
        q(
          ["What was the Sahara like about eight thousand years ago?", "大约八千年前，撒哈拉是什么样子？"],
          ["Green, with grass, lakes and rivers", "一片绿色，有草地、湖泊和河流"],
          [
            ["Covered with ice and snow", "被冰雪覆盖"],
            ["Exactly as dry as it is today", "和今天一样干旱"],
            ["A thick rainforest with tall trees", "长着高大树木的茂密雨林"],
          ],
          [
            "The second paragraph says that about eight thousand years ago, the Sahara was a green land of grass, lakes and rivers.",
            "第二段说，大约八千年前，撒哈拉是一片有草地、湖泊和河流的绿地。",
          ],
        ),
        q(
          ["What happens when grasslands are grazed too heavily?", "草原被过度放牧会怎样？"],
          ["The soil loses its plants and can turn to dust", "土壤失去植物，可能变成尘土"],
          [
            ["The grass grows back taller than before", "草长得比以前更高"],
            ["The land turns into a rainforest", "这片土地变成雨林"],
            ["More rain begins to fall there", "那里开始下更多的雨"],
          ],
          [
            "The third paragraph says the plants that hold the soil disappear, and the land can turn to dust; this is one way deserts spread.",
            "第三段说，固定土壤的植物消失了，土地可能变成尘土；这是沙漠扩张的一种方式。",
          ],
        ),
        q(
          ["How do the trees planted by farmers help the land?", "农民种的树怎样帮助这片土地？"],
          ["Their roots hold the soil and their shade keeps it damp", "树根固定土壤，树荫保持湿润"],
          [
            ["They bring the rains back from the south", "它们把雨水从南方带回来"],
            ["They are cut down to build new farms", "它们被砍掉来建新农场"],
            ["They keep the giraffes and the herds of cattle away from the land", "它们让长颈鹿和成群的牛远离这片土地"],
          ],
          [
            "The last paragraph says the roots hold the soil, the shade keeps it damp, and crops grow again.",
            "最后一段说，树根固定土壤，树荫保持土壤湿润，庄稼又能生长了。",
          ],
        ),
      ],
      { names: ["Sahara", "Africa"] },
    ),
  ],
};

/** energyUnit is the reading unit of energy: heat, light, sound and electricity, and saving it. */
export const energyUnit: ReadingUnitDef = {
  id: "energy-all-around",
  title: t("Energy All Around", "身边的能量"),
  passages: [
    passage(
      "what-is-energy",
      ["What Is Energy?", "什么是能量？"],
      `Energy is the power to make things move, grow, heat up or change. You cannot hold energy in your hand, but you can see what it does all around you. A ball rolls, a kettle boils, a plant grows toward the light, and a lamp lights up a dark room. Each of these takes energy.

      Energy comes in many forms. There is the energy of motion, which a rolling ball or a running child has. There is heat, which warms your hands by a fire. There is light, which travels from the sun. There is sound, and there is electricity, which flows through wires to our homes. Energy is also stored in food, in fuel such as wood and gas, and in batteries.

      One of the most important facts about energy is that it is never used up. It only changes from one form to another. When you eat breakfast, the energy stored in your food becomes the energy that moves your muscles. When you rub your hands together, the energy of motion turns into heat.

      Scientists say that energy is never made or lost, only changed. Every time something happens, energy is changing form.`,
      [energy, how],
      [
        q(
          ["How does the passage define energy?", "文章怎样定义能量？"],
          ["The power to make things move, grow, heat up or change", "使物体运动、生长、变热或改变的能力"],
          [
            ["Anything that you can hold in your hand", "任何可以拿在手里的东西"],
            ["The electricity that flows through the wires in a house", "流过房子里电线的电"],
            ["The food that people eat for breakfast", "人们早餐吃的食物"],
          ],
          [
            "The first sentence defines energy as the power to make things move, grow, heat up or change.",
            "第一句把能量定义为使物体运动、生长、变热或改变的能力。",
          ],
        ),
        q(
          ["What happens to energy when you rub your hands together?", "你搓手时能量发生了什么？"],
          ["Motion turns into heat", "运动转化为热"],
          [
            ["Heat turns into light", "热转化为光"],
            ["Energy is used up completely", "能量被完全耗尽"],
            ["Sound turns into electricity", "声音转化为电"],
          ],
          [
            "The third paragraph says that when you rub your hands together, the energy of motion turns into heat.",
            "第三段说，搓手时，运动的能量转化为热。",
          ],
        ),
        q(
          ["Which sentence states the most important idea of the passage?", "哪句话说出了文章最重要的观点？"],
          ["Energy is never used up; it only changes form", "能量永远不会用完，只是改变形式"],
          [
            ["A kettle boils when it is heated", "水壶加热后水会沸腾"],
            ["Batteries store energy so it can be used later", "电池储存能量，以后再用"],
            ["The sun sends light across space", "太阳把光传过太空"],
          ],
          [
            "The passage calls the fact that energy only changes from one form to another one of the most important, and repeats it at the end.",
            "文章称能量只是从一种形式变成另一种形式是最重要的事实之一，并在结尾再次强调。",
          ],
        ),
      ],
    ),
    passage(
      "energy-on-the-move",
      ["Energy on the Move", "运动中的能量"],
      `Think of a roller coaster. A chain pulls the cars slowly up the first big hill. At the top, they pause for a moment. Then they rush down the other side, faster and faster, and zoom up the next hill.

      The roller coaster shows energy changing form. As the chain pulls the cars up, it gives them stored energy, the energy of height. The higher the cars go, the more energy they store. At the top, the cars are barely moving, but they hold a great deal of stored energy.

      As the cars roll downhill, the stored energy turns into the energy of motion. The farther they fall, the faster they go. Then, as they climb the next hill, the energy of motion turns back into stored energy, and they slow down.

      Each hill on a roller coaster is a little lower than the one before. That is because some energy changes into heat and sound as the wheels rub against the track and rumble along it. The energy is not lost, but it is no longer pushing the cars. By the end of the ride, the cars need brakes to stop, and the energy of motion becomes heat in the brakes.`,
      [energy, how],
      [
        q(
          ["When do the cars hold the most stored energy?", "车厢什么时候储存的能量最多？"],
          ["At the top of the first big hill", "在第一座大坡的顶端"],
          [
            ["At the bottom of the first hill", "在第一座坡的底部"],
            ["When they are moving fastest", "在它们跑得最快的时候"],
            ["When the brakes stop them", "在刹车让它们停下的时候"],
          ],
          [
            "The second paragraph says the higher the cars go, the more energy they store, and at the top they hold a great deal of it.",
            "第二段说，车厢越高，储存的能量越多；到了顶端，它们储存了大量能量。",
          ],
        ),
        q(
          ["What happens to the energy as the cars roll downhill?", "车厢下坡时能量怎样变化？"],
          ["Stored energy turns into the energy of motion", "储存的能量转化为运动的能量"],
          [
            ["The energy of motion turns into stored energy", "运动的能量转化为储存的能量"],
            ["All of the energy turns into sound", "所有能量都变成声音"],
            ["The chain gives the cars more energy", "链条给车厢更多能量"],
          ],
          [
            "The third paragraph says that as the cars roll downhill, the stored energy turns into the energy of motion.",
            "第三段说，车厢下坡时，储存的能量转化为运动的能量。",
          ],
        ),
        q(
          ["Why is each hill a little lower than the one before?", "为什么每座坡都比前一座低一点？"],
          ["Some energy changes into heat and sound", "一部分能量变成了热和声音"],
          [
            ["The cars become a little lighter on each new hill", "车厢每上一座新坡都变轻一点"],
            ["The chain pulls them down the track", "链条把它们往下拉"],
            ["The energy is lost and disappears", "能量损失并消失了"],
          ],
          [
            "The last paragraph says some energy changes into heat and sound as the wheels rub and rumble, so it no longer pushes the cars.",
            "最后一段说，车轮摩擦、轰隆作响时，一部分能量变成热和声音，不再推动车厢。",
          ],
        ),
      ],
    ),
    passage(
      "heat-flows",
      ["Heat Flows", "热的流动"],
      `If you hold a cup of hot cocoa, your hands soon feel warm. If you hold an ice cube, your hand soon feels cold. In both cases, heat is moving. Heat always flows from something warmer to something cooler, until both are the same temperature.

      Heat can travel in three ways. The first is conduction, which happens when two things touch. A metal spoon left in hot soup grows hot all the way to the handle, because the heat passes along the metal.

      The second way is convection, which happens in liquids and gases. Warm air is lighter than cool air, so it rises. Cool air sinks to take its place, warms up and rises in turn. This is how a heater can warm a whole room.

      The third way is radiation. Heat from the sun travels through empty space and warms the Earth, and the heat of a campfire warms your face from a distance, without touching it.

      Some materials let heat pass easily. Others, called insulators, slow it down. Wool, feathers and the air trapped inside a thick coat are good insulators. That is why a coat keeps you warm: it slows the flow of heat out of your body.`,
      [energy, how],
      [
        q(
          ["Which way does heat always flow?", "热总是朝哪个方向流动？"],
          ["From something warmer to something cooler", "从较热的物体流向较冷的物体"],
          [
            ["From something cooler to something warmer", "从较冷的物体流向较热的物体"],
            ["Upward, away from the ground", "向上，远离地面"],
            ["Only through metal objects", "只通过金属物体"],
          ],
          [
            "The first paragraph says heat always flows from something warmer to something cooler.",
            "第一段说，热总是从较热的物体流向较冷的物体。",
          ],
        ),
        q(
          ["How does a heater warm a whole room?", "暖气怎样让整个房间变暖？"],
          ["Warm air rises and cool air sinks in turn", "热空气上升，冷空气依次下沉"],
          [
            ["Heat passes along a metal spoon", "热沿着金属勺传递"],
            ["It sends heat through empty space", "它把热穿过真空送出去"],
            ["It traps the air inside a coat", "它把空气困在外套里"],
          ],
          [
            "The third paragraph explains convection: warm air rises, cool air sinks, warms and rises in turn, which is how a heater warms a room.",
            "第三段解释了对流：热空气上升，冷空气下沉、变暖、再上升，暖气就是这样让房间变暖的。",
          ],
        ),
        q(
          ["Why does a coat keep you warm?", "外套为什么能让你暖和？"],
          ["It slows the flow of heat out of your body", "它减慢热量从身体流出"],
          [
            ["It makes heat inside the cloth", "它在布料里产生热量"],
            ["It pulls heat from the cold air", "它从冷空气中吸收热量"],
            ["It reflects the sunlight onto you", "它把阳光照到你身上"],
          ],
          [
            "The last paragraph says a coat is an insulator: it slows the flow of heat out of your body.",
            "最后一段说，外套是隔热体：它减慢热量从身体流出。",
          ],
        ),
      ],
      { glossed: ["conduction", "convection", "radiation", "insulators"] },
    ),
    passage(
      "light-travels",
      ["Light Travels", "光的传播"],
      `Light is the fastest thing we know. It travels about three hundred thousand kilometers in a single second. Sunlight takes only about eight minutes to cross the huge distance from the sun to the Earth.

      Light travels in straight lines. You can see this when a beam of sunlight shines through a gap in the curtains, or when a flashlight cuts a bright path through the dark. Because light cannot bend around corners, an object in its path makes a shadow.

      When light meets an object, three things can happen. Some materials, like clear glass and water, are transparent: light passes straight through them, so you can see what is behind. Others, like frosted glass or thin paper, are translucent: they let some light through, but things behind them look blurry. Still others, like wood, metal and your own body, are opaque: they block light completely.

      Light can also bounce. A mirror sends light back so neatly that you see yourself in it. Most objects bounce some light too, and that is how we see them. When light bounces off a red apple and enters your eye, you see the apple, and you see that it is red.`,
      [lightSound, how],
      [
        q(
          ["Why does an object in the path of light make a shadow?", "为什么挡住光的物体会形成影子？"],
          ["Light travels in straight lines and cannot bend around corners", "光沿直线传播，不能绕过拐角"],
          [
            ["Light is slower than the object", "光比物体慢"],
            ["Light takes eight minutes to arrive from the sun to the object", "光从太阳照到物体要八分钟"],
            ["The object makes its own dark light", "物体自己发出暗光"],
          ],
          [
            "The second paragraph says light travels in straight lines and cannot bend around corners, so an object in its path makes a shadow.",
            "第二段说，光沿直线传播，不能绕过拐角，所以挡路的物体会形成影子。",
          ],
        ),
        q(
          ["What is a translucent material?", "什么是半透明材料？"],
          ["One that lets some light through but looks blurry", "让部分光通过、但看起来模糊的材料"],
          [
            ["One that lets all of the light pass straight through", "让所有光直接穿过的"],
            ["One that blocks light completely", "完全挡住光的材料"],
            ["One that sends light back like a mirror", "像镜子一样把光反射回来的材料"],
          ],
          [
            "The third paragraph says translucent materials let some light through, but things behind them look blurry.",
            "第三段说，半透明材料让部分光通过，但后面的东西看起来模糊。",
          ],
        ),
        q(
          ["How do we see a red apple?", "我们是怎样看到红苹果的？"],
          ["Light bounces off it and enters our eyes", "光从苹果上反射进我们的眼睛"],
          [
            ["The apple makes its own red light", "苹果自己发出红光"],
            ["Light passes straight through the apple", "光直接穿过苹果"],
            ["The apple blocks the light completely", "苹果完全挡住了光"],
          ],
          [
            "The last paragraph says that when light bounces off a red apple and enters your eye, you see the apple and its color.",
            "最后一段说，光从红苹果上反射进入你的眼睛，你就看到了苹果和它的颜色。",
          ],
        ),
      ],
    ),
    passage(
      "sound-waves",
      ["Sound Waves", "声波"],
      `Every sound begins with something that vibrates, or shakes back and forth very quickly. When you pluck a guitar string, it vibrates. When you speak, two small folds in your throat vibrate. You can feel this if you rest your fingers gently on your throat and hum.

      The vibrating object pushes against the air around it. The air pushes on the air next to it, and so on, like a line of people passing along a push. This travels outward as a sound wave. When the wave reaches your ear, it makes your eardrum vibrate too, and your brain hears a sound.

      Sound needs something to travel through. It moves through air, through water and even through solid walls. It travels faster in water than in air, and faster still in solids. But sound cannot travel through empty space, where there is nothing to carry the push. Space is completely silent.

      Sounds can be high or low. Fast vibrations make high sounds, like a whistle or a bird's song. Slow vibrations make low sounds, like a drum or a big truck. Sounds can also be loud or soft, depending on how strong the vibrations are.`,
      [lightSound, how],
      [
        q(
          ["How does every sound begin?", "每个声音是怎样开始的？"],
          ["With something that vibrates", "从某个东西振动开始"],
          [
            ["With a beam of light", "从一束光开始"],
            ["With a push from your brain", "从大脑的推动开始"],
            ["With an empty space", "从一片真空开始"],
          ],
          ["The first sentence says every sound begins with something that vibrates.", "第一句说，每个声音都从某个东西振动开始。"],
        ),
        q(
          ["Why is space completely silent?", "为什么太空完全没有声音？"],
          ["There is nothing to carry the sound", "那里没有东西传递声音"],
          [
            ["It is too cold for sound", "那里太冷，声音无法存在"],
            ["Sound travels too fast there", "声音在那里传得太快"],
            ["There is too much light", "那里光线太多"],
          ],
          [
            "The third paragraph says sound cannot travel through empty space, where there is nothing to carry the push.",
            "第三段说，声音无法穿过真空，因为那里没有东西传递这种推动。",
          ],
        ),
        q(
          ["What kind of vibrations make a high sound?", "什么样的振动产生高音？"],
          ["Fast ones", "快的振动"],
          [
            ["Slow ones", "慢的振动"],
            ["Very strong ones", "很强的振动"],
            ["Ones in water only", "只在水中的振动"],
          ],
          [
            "The last paragraph says fast vibrations make high sounds and slow vibrations make low sounds; strength makes a sound loud or soft.",
            "最后一段说，快的振动产生高音，慢的振动产生低音；振动的强弱决定声音的大小。",
          ],
        ),
      ],
    ),
    passage(
      "making-electricity",
      ["Making Electricity", "发电"],
      `Electricity lights our lamps, runs our refrigerators and charges our phones. But where does it come from? Most of it is made in power stations, and most power stations work in a surprisingly similar way.

      Inside a power station is a machine called a generator. A generator has a coil of wire and a set of magnets. When the coil spins near the magnets, electricity begins to flow in the wire. To make a lot of electricity, the coil must keep spinning fast.

      The trick is to find something to turn it. In many power stations, fuel such as coal or gas is burned to boil water. The water turns into steam, and the rushing steam spins the blades of a turbine, a kind of giant fan. The turbine turns the generator.

      Other power stations use moving water or wind instead of steam. At a dam, water rushing downhill spins the turbines. On a windy hill, the wind turns the long blades of a wind turbine.

      From the power station, electricity travels along thick wires held up by tall towers. Smaller wires carry it into towns and streets, and at last into the sockets in the walls of our homes.`,
      [energy, how],
      [
        q(
          ["What happens when the coil of a generator spins near the magnets?", "发电机的线圈在磁铁旁转动时会怎样？"],
          ["Electricity begins to flow in the wire", "电开始在电线中流动"],
          [
            ["The water inside turns into steam", "里面的水变成蒸汽"],
            ["The magnets begin to melt", "磁铁开始熔化"],
            ["The turbine stops turning", "涡轮停止转动"],
          ],
          [
            "The second paragraph says that when the coil spins near the magnets, electricity begins to flow in the wire.",
            "第二段说，线圈在磁铁旁转动时，电就开始在电线中流动。",
          ],
        ),
        q(
          [
            "Put the steps in order: steam spins a turbine; fuel boils water; the turbine turns the generator.",
            "给步骤排序：蒸汽转动涡轮；燃料把水烧开；涡轮带动发电机。",
          ],
          ["Fuel boils water, steam spins a turbine, the turbine turns the generator", "燃料烧开水，蒸汽转动涡轮，涡轮带动发电机"],
          [
            ["Steam spins a turbine, fuel boils water, the turbine turns the generator", "蒸汽转动涡轮，燃料烧开水，涡轮带动发电机"],
            ["The turbine turns the generator, fuel boils water, steam spins a turbine", "涡轮带动发电机，燃料烧开水，蒸汽转动涡轮"],
            ["Fuel boils water, the turbine turns the generator, steam spins a turbine", "燃料烧开水，涡轮带动发电机，蒸汽转动涡轮"],
          ],
          [
            "The third paragraph gives the order: fuel is burned to boil water, the steam spins a turbine, and the turbine turns the generator.",
            "第三段给出了顺序：燃烧燃料烧开水，蒸汽转动涡轮，涡轮带动发电机。",
          ],
        ),
        q(
          ["What spins the turbines at a dam?", "在水坝，是什么转动涡轮？"],
          ["Water rushing downhill", "向下奔流的水"],
          [
            ["Steam from burning coal", "燃煤产生的蒸汽"],
            ["The wind on a hill", "山上的风"],
            ["Electricity from the towers", "电塔传来的电"],
          ],
          [
            "The fourth paragraph says that at a dam, water rushing downhill spins the turbines.",
            "第四段说，在水坝，向下奔流的水转动涡轮。",
          ],
        ),
      ],
    ),
    passage(
      "energy-from-the-sun-and-wind",
      ["Energy from the Sun and Wind", "来自太阳和风的能量"],
      `Coal, oil and gas have powered the world for more than two hundred years. But they have two big problems. They are limited, so one day they will run out. And burning them sends smoke and gases into the air that warm the planet.

      The sun and the wind offer another way. They are renewable sources of energy, which means they will not run out. The sun will keep shining, and the wind will keep blowing, for as long as we can imagine.

      Solar panels turn sunlight straight into electricity. They have no moving parts and make no smoke or noise. A panel on a roof can help power the house beneath it. Solar panels work best in sunny places, and they make the most electricity at midday.

      Wind turbines catch the wind with long blades that turn a generator. The best places for them are hills, coasts and the open sea, where the wind is strong and steady.

      Neither source is perfect. The sun does not shine at night, and the wind does not always blow. So engineers are building huge batteries that can store extra electricity on sunny, windy days and send it out when it is needed.`,
      [saving, compare, academic1],
      [
        q(
          ["What are the two problems with coal, oil and gas?", "煤、石油和天然气有哪两个问题？"],
          ["They will run out, and burning them warms the planet", "它们会用完，燃烧它们会使地球变暖"],
          [
            ["They are too heavy and too hard to find", "它们太重，也太难找到"],
            ["They only work at night and in winter", "它们只在夜里和冬天起作用"],
            ["They need wind and sun to burn", "它们需要风和阳光才能燃烧"],
          ],
          [
            "The first paragraph says they are limited and will run out, and burning them sends gases into the air that warm the planet.",
            "第一段说，它们是有限的，会用完；燃烧它们会向空气排放使地球变暖的气体。",
          ],
        ),
        q(
          ["What does renewable mean in this passage?", "在这篇文章中，renewable 是什么意思？"],
          ["Will not run out", "不会用完"],
          [
            ["Makes a lot of smoke", "产生大量烟雾"],
            ["Works only at midday", "只在中午起作用"],
            ["Is stored in batteries", "储存在电池里"],
          ],
          [
            "The second paragraph explains that renewable sources of energy are ones that will not run out.",
            "第二段解释说，可再生能源就是不会用完的能源。",
          ],
        ),
        q(
          ["Why are engineers building huge batteries?", "工程师为什么建造巨大的电池？"],
          ["To store electricity for when there is no sun or wind", "为了在没有阳光或风时储存电力备用"],
          [
            ["To replace the old solar panels on the roofs of houses", "替换房顶上旧的太阳能板"],
            ["To make the wind blow more steadily", "为了让风吹得更稳定"],
            ["To burn less coal in the daytime", "为了白天少烧煤"],
          ],
          [
            "The last paragraph says the sun does not always shine and the wind does not always blow, so batteries store extra electricity for when it is needed.",
            "最后一段说，太阳不总是照耀，风也不总是吹，所以用电池储存多余的电，需要时再送出。",
          ],
        ),
      ],
    ),
    passage(
      "saving-energy-at-home",
      ["Saving Energy at Home", "在家节约能源"],
      `Every home uses energy all day long. It heats the rooms, warms the water, keeps the food cold and lights the lamps. Much of that energy is wasted, but a family can reduce the waste with a few simple habits.

      The easiest place to start is with the lights. Switch them off when you leave a room. Replace old bulbs with LED bulbs, which use much less electricity and last many years longer.

      Heating often uses more energy than anything else in a home. Keeping doors and windows closed when the heating is on stops warm air from escaping. Insulation in the walls and roof works like a thick coat for the house, slowing the flow of heat outside. Even closing the curtains at night helps.

      Some machines use electricity even when they seem to be off. A television, a computer or a phone charger left plugged in can slowly waste energy all night. Unplugging them, or turning them off at the wall, stops this.

      Water is part of the story too, because it takes energy to heat it. A short shower uses far less hot water than a full bath. Small changes, made every day, add up to a big difference.`,
      [saving, details],
      [
        q(
          ["Which part of a home often uses the most energy?", "家中哪一部分通常耗能最多？"],
          ["Heating", "取暖"],
          [
            ["The lights", "照明"],
            ["The phone charger", "手机充电器"],
            ["The curtains", "窗帘"],
          ],
          [
            "The third paragraph says heating often uses more energy than anything else in a home.",
            "第三段说，取暖往往比家里其他任何东西用的能源都多。",
          ],
        ),
        q(
          ["How is insulation like a thick coat for a house?", "隔热层为什么像房子的厚外套？"],
          ["It slows the flow of heat outside", "它减慢热量流向室外"],
          [
            ["It makes the rooms brighter at night", "它让房间夜里更亮"],
            ["It keeps the food in the house cold", "它让屋里的食物保持冰冷"],
            ["It turns off machines left plugged in", "它关掉插着电的机器"],
          ],
          [
            "The third paragraph says insulation works like a thick coat for the house, slowing the flow of heat outside.",
            "第三段说，隔热层就像房子的厚外套，减慢热量流向室外。",
          ],
        ),
        q(
          ["Why does a short shower save energy?", "为什么短时间淋浴能节约能源？"],
          ["It uses less water that has to be heated", "它用的需要加热的水更少"],
          [
            ["It keeps the bathroom window closed", "它让浴室窗户保持关闭"],
            ["It needs no electricity to light it", "它不需要电来照明"],
            ["It unplugs the machines at night", "它在夜里拔掉机器的插头"],
          ],
          [
            "The last paragraph says it takes energy to heat water, and a short shower uses far less hot water than a full bath.",
            "最后一段说，加热水需要能源，短时间淋浴用的热水比泡澡少得多。",
          ],
        ),
      ],
      { names: ["LED"] },
    ),
  ],
};
