import type { ReadingUnitDef } from "@ga/content";
import { t } from "@ga/content";

import { academic2, clues } from "./topics.ts";

/** weatherAndClimate is a reading unit of grades 3 to 5 on the air, the weather it makes, and climate. */
export const weatherAndClimate: ReadingUnitDef = {
  id: "weather-and-climate",
  title: t("Weather and Climate", "天气与气候"),
  passages: [
    {
      id: "the-air-around-us",
      title: t("The Air Around Us", "我们周围的空气"),
      body: `Earth is wrapped in a thick blanket of air called the atmosphere. You cannot see it, but you can feel it when the wind blows against your face, and you breathe it in all day long.

The atmosphere is made of gases. Most of it is nitrogen, and about one fifth of it is oxygen, the gas that people and animals need. It also holds a little carbon dioxide and some water vapor.

Air has weight. The air above you presses down on you all the time, though you do not notice it because the pressure is the same on every side of your body. This push of the air is called air pressure.

The atmosphere is thickest close to the ground. The higher you go, the thinner the air becomes. That is why mountain climbers on the tallest peaks often carry tanks of oxygen.

Almost all of our weather happens in the lowest layer of the atmosphere, within a few miles of the ground. Clouds, rain, wind and storms all form there.`,
      topics: [clues],
      glossed: ["atmosphere", "nitrogen"],
      xp: 4,
      questions: [
        {
          prompt: t("What is the atmosphere?", "什么是大气层？"),
          right: t("The blanket of air that surrounds Earth", "包围地球的空气层"),
          wrong: [t("A kind of cloud", "一种云"), t("The top of a mountain", "山顶"), t("A tank of oxygen", "一罐氧气")],
          solution: t(
            "The first sentence says Earth is wrapped in a thick blanket of air called the atmosphere.",
            "第一句说地球被一层厚厚的空气包裹着，这叫作大气层。",
          ),
        },
        {
          prompt: t("Why do we not notice the air pressing on us?", "我们为什么感觉不到空气在压着我们？"),
          right: t("The pressure is the same on every side of the body", "身体各个方向受到的压力相同"),
          wrong: [
            t("Air has no weight", "空气没有重量"),
            t("The air only presses on mountains", "空气只压在山上"),
            t("We breathe the pressure out", "我们把压力呼出去了"),
          ],
          solution: t(
            "The third paragraph says we do not notice it because the pressure is the same on every side of the body.",
            "第三段说我们感觉不到，是因为身体各个方向受到的压力相同。",
          ),
        },
        {
          prompt: t("Why do climbers on the tallest peaks carry oxygen?", "攀登最高山峰的人为什么要带氧气？"),
          right: t("The air is thinner high up", "高处的空气更稀薄"),
          wrong: [
            t("There is no wind on mountains", "山上没有风"),
            t("The air is thicker high up", "高处的空气更稠密"),
            t("Oxygen keeps them warm", "氧气能让他们保暖"),
          ],
          solution: t("The fourth paragraph says the higher you go, the thinner the air becomes.", "第四段说越往高处，空气越稀薄。"),
        },
      ],
    },
    {
      id: "the-sun-warms-the-earth",
      title: t("The Sun Warms the Earth", "太阳让地球变暖"),
      body: `All weather begins with the sun. Sunlight travels through space and warms Earth's land and water. The warm ground and sea then warm the air above them.

The sun does not warm every place the same amount. Near the equator, the imaginary line around the middle of Earth, sunlight shines almost straight down. Its energy is packed into a small area, so these places are hot all year.

Near the poles, sunlight arrives at a low slant. The same amount of energy is spread over a much larger area, like the light of a flashlight tilted across a table. So the poles stay cold.

Land and water warm up differently too. On a sunny summer day, sand on a beach can become too hot to walk on, while the sea stays cool. Land heats up quickly and cools down quickly. Water heats up slowly and holds its warmth for a long time.

Because some places are warmer than others, the air above them is warmer too. These differences set the air moving, and moving air brings us our weather.`,
      topics: [clues],
      glossed: ["equator"],
      xp: 4,
      questions: [
        {
          prompt: t("Why is it hot near the equator all year?", "赤道附近为什么全年都很热？"),
          right: t("Sunlight shines almost straight down, packing its energy into a small area", "阳光几乎直射，能量集中在一小块地方"),
          wrong: [
            t("The equator is closer to the moon", "赤道离月亮更近"),
            t("There is no air near the equator", "赤道附近没有空气"),
            t("Sunlight arrives there at a low slant", "阳光以很低的角度斜射到那里"),
          ],
          solution: t(
            "The second paragraph says sunlight shines almost straight down near the equator, so its energy is packed into a small area.",
            "第二段说赤道附近阳光几乎直射，能量集中在一小块地方。",
          ),
        },
        {
          prompt: t("What does the flashlight tilted across a table help explain?", "斜照在桌上的手电筒帮助说明了什么？"),
          right: t("How slanted sunlight spreads its energy over a larger area", "斜射的阳光如何把能量分散到更大的面积上"),
          wrong: [
            t("Why the sea stays cool", "为什么海水保持凉爽"),
            t("How the sun travels through space", "太阳光如何穿过太空"),
            t("Why sand gets hot", "为什么沙子会变热"),
          ],
          solution: t(
            "The third paragraph compares slanted sunlight at the poles to the light of a tilted flashlight spread over a larger area.",
            "第三段把两极的斜射阳光比作斜照的手电筒光，光被分散到更大的面积上。",
          ),
        },
        {
          prompt: t("How is water different from land, according to the passage?", "根据文章，水和陆地有什么不同？"),
          right: t("Water heats up slowly and holds its warmth longer", "水升温慢，保温时间更长"),
          wrong: [
            t("Water heats up faster than land", "水比陆地升温快"),
            t("Water never gets warm", "水从来不会变暖"),
            t("Water cools down quickly", "水降温很快"),
          ],
          solution: t(
            "The fourth paragraph says land heats and cools quickly, while water heats slowly and holds its warmth for a long time.",
            "第四段说陆地升温和降温都很快，而水升温慢，保温时间长。",
          ),
        },
      ],
    },
    {
      id: "wind",
      title: t("Why the Wind Blows", "风为什么会吹"),
      body: `You cannot see wind, but you can see what it does. It bends trees, pushes sailboats and carries kites high into the sky. Wind is simply air that is moving. But what makes the air move?

The answer is differences in temperature. When air is warmed, it spreads out and becomes lighter, so it rises. Cooler, heavier air then flows in to take its place. That flow of air along the ground is wind.

You can feel this at the beach. During the day, the land warms up faster than the sea. Warm air rises over the land, and cool air from over the water rushes in to replace it. That is why a cool breeze often blows from the sea in the afternoon.

At night, the pattern turns around. The land cools faster than the water, so the air over the sea is now the warmer air. It rises, and a breeze blows from the land out toward the sea.

The same thing happens on a much larger scale all over the world. Huge differences between warm and cold places drive the great winds that sweep across oceans and continents.`,
      topics: [clues],
      glossed: ["continents"],
      xp: 4,
      questions: [
        {
          prompt: t("What makes the air move, according to the passage?", "根据文章，是什么让空气流动？"),
          right: t("Differences in temperature", "温度的差异"),
          wrong: [
            t("Trees bending back and forth", "树木来回摆动"),
            t("Sailboats pushing the air", "帆船推动空气"),
            t("The air becoming heavier when warm", "空气变暖后变重"),
          ],
          solution: t(
            "The second paragraph says the answer is differences in temperature: warm air rises and cooler air flows in.",
            "第二段说答案是温度差异：暖空气上升，较冷的空气流进来。",
          ),
        },
        {
          prompt: t("Why does a breeze often blow from the sea in the afternoon?", "为什么下午常常有风从海上吹来？"),
          right: t("Warm air rises over the land, and cool air from the sea moves in", "陆地上的暖空气上升，海上的冷空气流进来"),
          wrong: [
            t("The sea is warmer than the land in the day", "白天海水比陆地暖"),
            t("The land cools faster in the day", "白天陆地降温更快"),
            t("Waves push the air toward the land", "海浪把空气推向陆地"),
          ],
          solution: t(
            "The third paragraph says the land warms faster in the day, warm air rises over it, and cool air from over the water rushes in.",
            "第三段说白天陆地升温更快，暖空气在陆地上空上升，海上的冷空气就涌了过来。",
          ),
        },
        {
          prompt: t(
            "What does *the pattern turns around* mean in the fourth paragraph?",
            "第四段中的 *the pattern turns around* 是什么意思？",
          ),
          right: t("The breeze blows the opposite way", "风向变成相反的方向"),
          wrong: [
            t("The wind stops completely", "风完全停了"),
            t("The sea turns into land", "海变成了陆地"),
            t("The breeze grows stronger", "风变得更大"),
          ],
          solution: t(
            "The paragraph explains that at night the breeze blows from the land toward the sea, the opposite of the day.",
            "这一段解释说，夜里风从陆地吹向大海，和白天的方向相反。",
          ),
        },
      ],
    },
    {
      id: "measuring-weather",
      title: t("Measuring the Weather", "测量天气"),
      body: `People who study the weather use special tools to measure what the air is doing.

A thermometer measures temperature, how hot or cold the air is. A rain gauge is a tube that collects rain. After a storm, a mark on the side of the tube shows how much rain fell.

A barometer measures air pressure. When the pressure starts to fall, it often means that clouds and rain are on the way. When it rises, clear skies may be coming.

A wind vane, sometimes shaped like an arrow or a rooster, turns to point into the wind and shows which way it is blowing. An anemometer has small cups on spinning arms. The faster the wind blows, the faster the cups spin, so it measures the speed of the wind.

Today, weather stations around the world take these measurements every hour. Weather balloons carry instruments high into the sky, and satellites far above Earth take pictures of the clouds. Computers gather all of this information and use it to forecast, or tell ahead of time, what the weather will be.`,
      topics: [clues],
      glossed: ["thermometer", "gauge", "barometer", "anemometer", "forecast"],
      xp: 4,
      questions: [
        {
          prompt: t("What does a barometer measure?", "气压计测量什么？"),
          right: t("Air pressure", "气压"),
          wrong: [t("Temperature", "温度"), t("The speed of the wind", "风速"), t("How much rain fell", "降雨量")],
          solution: t('The third paragraph says: "A barometer measures air pressure."', "第三段说：“A barometer measures air pressure.”"),
        },
        {
          prompt: t("How does an anemometer show the speed of the wind?", "风速计怎样显示风速？"),
          right: t("Its cups spin faster when the wind blows faster", "风越大，它的小杯转得越快"),
          wrong: [
            t("It points into the wind", "它指向风吹来的方向"),
            t("It collects the wind in a tube", "它把风收集在管子里"),
            t("It takes pictures from space", "它从太空拍照"),
          ],
          solution: t(
            "The fourth paragraph says the faster the wind blows, the faster the cups spin.",
            "第四段说风吹得越快，小杯转得越快。",
          ),
        },
        {
          prompt: t("What does *forecast* mean in the last paragraph?", "最后一段中的 *forecast* 是什么意思？"),
          right: t("Tell ahead of time", "提前预告"),
          wrong: [t("Measure rain", "测量雨量"), t("Spin quickly", "快速旋转"), t("Collect pictures", "收集图片")],
          solution: t(
            'The passage explains the word right after it: "to forecast, or tell ahead of time."',
            "文章紧接着解释了这个词：“to forecast, or tell ahead of time.”",
          ),
        },
      ],
    },
    {
      id: "thunderstorms",
      title: t("Thunder and Lightning", "雷电"),
      body: `On a hot summer afternoon, a small white cloud can grow into a towering dark one in less than an hour. Inside it, a thunderstorm is forming.

Warm, damp air rises quickly, and its water vapor condenses into a tall cloud. Inside the cloud, strong winds toss drops of water and bits of ice up and down. As they rub and crash together, they build up electric charges, a little like the charge you build up when you shuffle your feet across a rug.

When the charge grows large enough, it jumps in a giant spark. That spark is lightning. A bolt of lightning is hotter than the surface of the sun, and it heats the air around it in a split second. The heated air expands so suddenly that it makes a loud boom. That boom is thunder.

Light travels much faster than sound, so you see the flash before you hear the thunder. Count the seconds between them. If you count about five seconds, the lightning was about a mile away.

When you hear thunder, go inside a building. Do not stand under a tree, which lightning often strikes.`,
      topics: [clues],
      xp: 4,
      questions: [
        {
          prompt: t("What builds up electric charges inside a storm cloud?", "是什么让雷雨云中积累起电荷？"),
          right: t("Drops of water and bits of ice rubbing and crashing together", "水滴和冰粒互相摩擦和碰撞"),
          wrong: [
            t("Lightning striking a tree", "闪电击中大树"),
            t("Thunder shaking the cloud", "雷声震动云层"),
            t("The sun shining on the cloud", "阳光照在云上"),
          ],
          solution: t(
            "The second paragraph says drops and bits of ice rub and crash together and build up electric charges.",
            "第二段说水滴和冰粒互相摩擦碰撞，积累起电荷。",
          ),
        },
        {
          prompt: t("What causes the sound of thunder?", "雷声是怎样产生的？"),
          right: t("Air heated by lightning expands suddenly", "被闪电加热的空气突然膨胀"),
          wrong: [
            t("Clouds bumping into each other", "云彼此相撞"),
            t("Ice falling to the ground", "冰落到地上"),
            t("Wind blowing through trees", "风吹过树林"),
          ],
          solution: t(
            "The third paragraph says the heated air expands so suddenly that it makes a loud boom, which is thunder.",
            "第三段说被加热的空气突然膨胀，发出巨响，这就是雷声。",
          ),
        },
        {
          prompt: t(
            "You see lightning and count ten seconds before the thunder. About how far away was it?",
            "你看到闪电后数了十秒才听到雷声。闪电大约离你多远？",
          ),
          right: t("About two miles", "大约两英里"),
          wrong: [t("About ten miles", "大约十英里"), t("About half a mile", "大约半英里"), t("Right above you", "就在头顶")],
          solution: t(
            "The fourth paragraph says about five seconds means about a mile, so ten seconds means about two miles.",
            "第四段说大约五秒相当于一英里，所以十秒大约是两英里。",
          ),
        },
      ],
    },
    {
      id: "hurricanes",
      title: t("Giant Storms from the Sea", "来自海上的巨型风暴"),
      body: `The largest storms on Earth begin over warm tropical oceans. In some parts of the world they are called hurricanes. In others they are called typhoons. They are the same kind of storm.

A hurricane starts as a group of thunderstorms over water that is warmer than the air above it. The warm water heats the air, which rises and pulls in more air from all around. Because Earth is spinning, the incoming air begins to swirl, and the storm turns like a giant wheel.

As long as it stays over warm water, the storm keeps getting energy and growing. A strong hurricane can be hundreds of miles wide, with winds faster than a car on a highway.

At the center of the storm is the eye, a calm area where the sky may even be clear. Around the eye is a wall of the strongest winds and heaviest rain.

When a hurricane moves over land or cold water, it loses its supply of warm, damp air. It slowly weakens and dies out. But before it does, its wind, rain and high waves can do great damage to places along the coast.`,
      topics: [clues],
      glossed: ["hurricanes", "hurricane", "typhoons", "tropical"],
      xp: 4,
      questions: [
        {
          prompt: t("How are hurricanes and typhoons related?", "飓风和台风是什么关系？"),
          right: t("They are the same kind of storm with different names", "它们是同一种风暴，只是名称不同"),
          wrong: [
            t("Typhoons form over land", "台风在陆地上形成"),
            t("Hurricanes are smaller", "飓风更小"),
            t("Typhoons have no eye", "台风没有风眼"),
          ],
          solution: t(
            "The first paragraph says they are called hurricanes in some places and typhoons in others, and they are the same kind of storm.",
            "第一段说它们在有些地方叫飓风，在另一些地方叫台风，是同一种风暴。",
          ),
        },
        {
          prompt: t("What is the eye of a hurricane?", "飓风的风眼是什么？"),
          right: t("A calm area at the center of the storm", "风暴中心平静的区域"),
          wrong: [
            t("The wall of the strongest winds", "最强风构成的风墙"),
            t("The place where the storm begins", "风暴开始的地方"),
            t("A high wave on the coast", "海岸上的大浪"),
          ],
          solution: t(
            "The fourth paragraph says the eye is a calm area at the center, and the strongest winds are around it.",
            "第四段说风眼是中心平静的区域，最强的风在它周围。",
          ),
        },
        {
          prompt: t("Why does a hurricane weaken over land?", "飓风为什么在陆地上会减弱？"),
          right: t("It loses its supply of warm, damp air", "它失去了温暖潮湿空气的供应"),
          wrong: [
            t("Mountains break it into pieces", "山把它撞碎了"),
            t("Earth stops spinning under it", "地球在它下面停止转动"),
            t("The eye closes up", "风眼关闭了"),
          ],
          solution: t(
            "The last paragraph says that over land or cold water it loses its supply of warm, damp air and weakens.",
            "最后一段说在陆地或冷水上空，它失去温暖潮湿空气的供应，于是减弱。",
          ),
        },
      ],
    },
    {
      id: "seasons",
      title: t("Why We Have Seasons", "为什么会有四季"),
      body: `Many people think it is warm in summer because Earth is closer to the sun. That is not the reason. In fact, Earth is a little closer to the sun in January, when it is winter in the northern half of the world.

The real reason is that Earth is tilted. Picture a line running through Earth from the North Pole to the South Pole. Earth spins around this line, called its axis, and the axis leans to one side. As Earth travels around the sun during the year, the axis keeps leaning the same way.

For part of the year, the northern half of Earth leans toward the sun. Sunlight shines down more directly there, and the days are long. That is summer in the north. Six months later, Earth is on the other side of the sun, and the northern half leans away. Sunlight arrives at a low slant, the days are short, and it is winter.

The southern half always has the opposite season. When children in the north are building snowmen, children in the south may be swimming at the beach.`,
      topics: [clues],
      glossed: ["axis"],
      xp: 4,
      questions: [
        {
          prompt: t("What mistaken idea does the passage correct?", "文章纠正了什么错误的想法？"),
          right: t("That summer happens because Earth is closer to the sun", "夏天是因为地球离太阳更近"),
          wrong: [
            t("That Earth spins around its axis", "地球绕着地轴自转"),
            t("That the days are long in summer", "夏天白天很长"),
            t("That Earth travels around the sun", "地球绕着太阳运行"),
          ],
          solution: t(
            "The first paragraph says many people think it is warm in summer because Earth is closer to the sun, and that this is not the reason.",
            "第一段说很多人认为夏天热是因为地球离太阳更近，但这不是原因。",
          ),
        },
        {
          prompt: t("What is the real reason for the seasons?", "四季形成的真正原因是什么？"),
          right: t("Earth's axis is tilted", "地轴是倾斜的"),
          wrong: [
            t("The sun grows hotter in summer", "夏天太阳变得更热"),
            t("Earth stops spinning in winter", "冬天地球停止自转"),
            t("The moon blocks the sun", "月亮挡住了太阳"),
          ],
          solution: t(
            'The second paragraph begins: "The real reason is that Earth is tilted."',
            "第二段开头说：“The real reason is that Earth is tilted.”",
          ),
        },
        {
          prompt: t("If it is summer in the north, what season is it in the south?", "如果北半球是夏天，南半球是什么季节？"),
          right: t("Winter", "冬天"),
          wrong: [t("Summer", "夏天"), t("Spring", "春天"), t("It has no season", "没有季节")],
          solution: t("The last paragraph says the southern half always has the opposite season.", "最后一段说南半球的季节总是相反的。"),
        },
      ],
    },
    {
      id: "weather-is-not-climate",
      title: t("Weather Is Not Climate", "天气不等于气候"),
      body: `People often mix up two words: weather and climate. They are related, but they are not the same.

Weather is what the air is doing at one place right now or over a few days. It might be sunny this morning, rainy tonight and windy tomorrow. Weather changes quickly, sometimes from one hour to the next.

Climate is the usual pattern of weather in a place over many years. To describe the climate of a city, scientists look at its weather over thirty years or more. They ask how hot the summers usually are, how cold the winters are, and how much rain falls in a typical year.

Here is one way to remember the difference. Weather tells you what to wear today. Climate tells you what kinds of clothes to keep in your closet.

A single cold week does not change a place's climate, in the same way that one bad day does not change who you are. But when the pattern of weather over many years slowly shifts, the climate is changing.`,
      topics: [clues],
      xp: 4,
      questions: [
        {
          prompt: t("What is the difference between weather and climate?", "天气和气候有什么区别？"),
          right: t(
            "Weather is the air right now; climate is the usual pattern over many years",
            "天气是此时此刻的空气状况；气候是多年来的通常规律",
          ),
          wrong: [
            t("Weather is about rain; climate is about wind", "天气指雨，气候指风"),
            t("Weather lasts many years; climate changes every hour", "天气持续多年，气候每小时都在变"),
            t("They mean exactly the same thing", "它们的意思完全相同"),
          ],
          solution: t(
            "The second and third paragraphs define weather as what the air is doing now and climate as the usual pattern over many years.",
            "第二段和第三段把天气定义为空气此刻的状况，把气候定义为多年的通常规律。",
          ),
        },
        {
          prompt: t(
            "How many years of weather do scientists look at to describe a climate?",
            "科学家要看多少年的天气来描述一个地方的气候？",
          ),
          right: t("Thirty years or more", "三十年或更久"),
          wrong: [t("A few days", "几天"), t("One year", "一年"), t("Exactly one week", "正好一周")],
          solution: t(
            "The third paragraph says scientists look at the weather over thirty years or more.",
            "第三段说科学家要看三十年或更久的天气。",
          ),
        },
        {
          prompt: t("Why does the writer mention clothes in a closet?", "作者为什么提到衣柜里的衣服？"),
          right: t("To show that climate is about what is usual over a long time", "为了说明气候指的是长期的通常情况"),
          wrong: [
            t("To give advice about shopping", "为了给购物建议"),
            t("To show that weather never changes", "为了说明天气从不变化"),
            t("To explain how clouds form", "为了解释云是怎样形成的"),
          ],
          solution: t(
            "The fourth paragraph compares what to wear today to weather, and the clothes you keep for the whole year to climate.",
            "第四段把今天穿什么比作天气，把一年四季都要备着的衣服比作气候。",
          ),
        },
      ],
    },
    {
      id: "climate-zones",
      title: t("Hot, Cold and In Between", "热的、冷的和介于其间的"),
      body: `Scientists divide the world into large areas that have similar climates. Each is called a climate zone. A region's climate zone depends mostly on how far it is from the equator, but mountains and oceans matter too.

The tropical zone lies near the equator. It is warm all year, and many tropical places get heavy rain almost every day. Rain forests, full of tall trees and more kinds of plants and animals than anywhere else, grow there.

The polar zones lie near the North Pole and the South Pole. They are cold all year, with long, dark winters. Much of the land and sea there is covered by ice.

Between them are the temperate zones. Most places there have four seasons: a warm summer, a cold winter, and spring and autumn in between.

Within each zone, other things make a difference. A city by the ocean has milder winters and cooler summers than a city far inland, because water warms and cools slowly. A town high in the mountains is colder than a town in the valley below. Deserts can be found in several zones, wherever little rain falls.`,
      topics: [clues, academic2],
      glossed: ["temperate", "inland"],
      xp: 5,
      questions: [
        {
          prompt: t("What does a region's climate zone depend on most?", "一个地区的气候带主要取决于什么？"),
          right: t("How far it is from the equator", "它离赤道有多远"),
          wrong: [
            t("How many people live there", "那里住着多少人"),
            t("How many trees grow there", "那里长着多少树"),
            t("Whether it has a desert", "那里是否有沙漠"),
          ],
          solution: t(
            "The first paragraph says a climate zone depends mostly on how far a region is from the equator.",
            "第一段说气候带主要取决于一个地区离赤道有多远。",
          ),
        },
        {
          prompt: t("Which zone has four seasons in most places?", "哪个气候带的大多数地方有四季？"),
          right: t("The temperate zones", "温带"),
          wrong: [t("The tropical zone", "热带"), t("The polar zones", "寒带"), t("The deserts", "沙漠")],
          solution: t(
            "The fourth paragraph says most places in the temperate zones have four seasons.",
            "第四段说温带的大多数地方有四季。",
          ),
        },
        {
          prompt: t("Why does a city by the ocean have milder winters than a city far inland?", "为什么海边城市的冬天比内陆城市温和？"),
          right: t("Water warms and cools slowly", "水升温和降温都很慢"),
          wrong: [
            t("Oceans are always hot", "海洋总是很热"),
            t("The ocean blocks the wind", "海洋挡住了风"),
            t("Cities by the ocean are near the equator", "海边城市都在赤道附近"),
          ],
          solution: t(
            "The last paragraph says the ocean city is milder because water warms and cools slowly.",
            "最后一段说海边城市更温和，是因为水升温和降温都很慢。",
          ),
        },
      ],
    },
    {
      id: "a-changing-climate",
      title: t("A Changing Climate", "变化中的气候"),
      body: `Earth's climate has changed many times over its long history. There were ice ages, when great sheets of ice covered much of the land, and warm periods in between. Those changes usually took thousands of years.

Today, scientists have measured a faster change. Over the last one hundred and fifty years, the average temperature of Earth has risen. The main cause is the burning of coal, oil and gas in cars, factories and power plants. Burning them adds carbon dioxide to the air. Carbon dioxide traps heat near the ground, a little like a blanket on a bed.

A warmer climate has many effects. Glaciers and polar ice are melting, and as the ice melts and ocean water warms, the level of the sea slowly rises. In some regions, heat waves and dry spells are becoming more common. In others, the heaviest rains are getting heavier.

People around the world are working on ways to slow this change. They are building power plants that use sunlight and wind, making cars that run on electricity, and planting trees, which take in carbon dioxide as they grow.`,
      topics: [clues, academic2],
      xp: 5,
      questions: [
        {
          prompt: t("How is today's climate change different from the changes of the past?", "如今的气候变化和过去的变化有什么不同？"),
          right: t("It is happening much faster", "它发生得快得多"),
          wrong: [
            t("It is the first change ever", "这是有史以来第一次变化"),
            t("It is making Earth colder", "它让地球变冷"),
            t("It takes thousands of years", "它需要几千年"),
          ],
          solution: t(
            "The first paragraph says past changes usually took thousands of years, and the second says scientists have measured a faster change today.",
            "第一段说过去的变化通常需要几千年，第二段说科学家测量到如今的变化更快。",
          ),
        },
        {
          prompt: t("What is the main cause of the rise in temperature, according to the passage?", "根据文章，气温上升的主要原因是什么？"),
          right: t("Burning coal, oil and gas", "燃烧煤、石油和天然气"),
          wrong: [t("Planting too many trees", "种了太多树"), t("Ice ages", "冰期"), t("The sea level rising", "海平面上升")],
          solution: t(
            "The second paragraph says the main cause is the burning of coal, oil and gas.",
            "第二段说主要原因是燃烧煤、石油和天然气。",
          ),
        },
        {
          prompt: t("Why does the writer compare carbon dioxide to a blanket?", "作者为什么把二氧化碳比作毯子？"),
          right: t("Both keep heat in", "两者都能把热量留住"),
          wrong: [
            t("Both are soft", "两者都很柔软"),
            t("Both can be washed", "两者都能清洗"),
            t("Both cover the ocean", "两者都覆盖着海洋"),
          ],
          solution: t(
            "The second paragraph says carbon dioxide traps heat near the ground, a little like a blanket on a bed.",
            "第二段说二氧化碳把热量困在地面附近，有点像床上的毯子。",
          ),
        },
      ],
    },
  ],
};
