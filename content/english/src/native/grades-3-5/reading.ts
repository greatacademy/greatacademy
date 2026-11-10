// Grades 3 to 5: the reading unit of the last theme, the solar system. The other units of the course are the
// existing reading units of grades 3 to 5 in src/reading.

import { type ReadingUnitDef, t } from "@ga/content";

const clues = { topic: "context-clues", weight: 0.3 } as const;
const spaceWords = { topic: "words-of-the-solar-system", weight: 0.2 } as const;

/** ourSolarSystem is a reading unit of grades 3 to 5 on the sun, the moon, the planets and the people who explore them. */
export const ourSolarSystem: ReadingUnitDef = {
  id: "our-solar-system",
  title: t("Our Solar System", "我们的太阳系"),
  passages: [
    {
      id: "our-star-the-sun",
      title: t("Our Star, the Sun", "我们的恒星：太阳"),
      body: `When you look up on a clear day, the brightest thing in the sky is the sun. It may look like a small yellow circle, but the sun is a star, just like the tiny stars we see at night. It only looks bigger and brighter because it is much closer to us than any other star.

The sun is a giant ball of hot, glowing gas. It is so big that more than one million Earths could fit inside it. Its surface is thousands of degrees hotter than the hottest oven.

The sun is the center of our solar system. Its gravity holds the earth and seven other planets as they travel around it. Each planet follows its own path, called an orbit.

Without the sun, there would be no life on Earth. Its light lets plants grow, and plants feed animals and people. Its heat keeps the oceans from freezing. Even the wind and the rain depend on the sun, because it warms the air and the water.

Never look straight at the sun, even for a moment. Its light is strong enough to hurt your eyes.`,
      topics: [clues, spaceWords],
      names: ["Earth", "Earths"],
      xp: 4,
      questions: [
        {
          prompt: t("Why does the sun look bigger and brighter than the stars we see at night?", "为什么太阳看起来比夜里的星星更大更亮？"),
          right: t("It is much closer to us than any other star", "它离我们比任何其他恒星都近得多"),
          wrong: [
            t("It is not a star at all", "它根本不是恒星"),
            t("It is the only star that glows", "它是唯一会发光的恒星"),
            t("It is closer to the moon", "它离月球更近"),
          ],
          solution: t(
            "The first paragraph says the sun only looks bigger and brighter because it is much closer to us than any other star.",
            "第一段说，太阳看起来更大更亮，只是因为它离我们比任何其他恒星都近得多。",
          ),
        },
        {
          prompt: t("What holds the planets as they travel around the sun?", "是什么在行星绕太阳运行时拉住它们？"),
          right: t("The sun's gravity", "太阳的引力"),
          wrong: [t("The sun's light", "太阳的光"), t("The wind", "风"), t("The moon", "月球")],
          solution: t(
            "The third paragraph says the sun's gravity holds the earth and seven other planets as they travel around it.",
            "第三段说，太阳的引力拉住地球和其他七颗行星，让它们绕着它运行。",
          ),
        },
        {
          prompt: t("Which sentence best states the main idea of the fourth paragraph?", "哪一句最能概括第四段的主要意思？"),
          right: t("Life on Earth depends on the sun", "地球上的生命依靠太阳"),
          wrong: [
            t("Plants feed animals and people", "植物养活动物和人"),
            t("The oceans never freeze", "海洋从不结冰"),
            t("Rain falls only on sunny days", "只有晴天才下雨"),
          ],
          solution: t(
            'The paragraph opens with "Without the sun, there would be no life on Earth," and every other sentence gives an example of it.',
            "这一段以“Without the sun, there would be no life on Earth”开头，其他每个句子都是它的例子。",
          ),
        },
      ],
    },
    {
      id: "why-we-have-day-and-night",
      title: t("Why We Have Day and Night", "为什么有白天和黑夜"),
      body: `Every morning the sun seems to rise in the east, and every evening it seems to set in the west. For thousands of years, people believed that the sun traveled across the sky around the earth. Today we know that the sun is not moving across our sky at all. The earth is turning.

Imagine a line running through the earth from the North Pole to the South Pole. This line is called the earth's axis. The earth spins around its axis like a top, and it makes one full turn every twenty-four hours.

At any moment, half of the earth faces the sun. On that half, it is day. The other half faces away from the sun into dark space, so it is night there. As the earth keeps turning, your home moves out of the darkness and into the sunlight. That is your sunrise. Hours later, it turns away from the sun again, and you see the sunset.

So when it is lunchtime for you, it is the middle of the night for children on the other side of the world.`,
      topics: [clues, spaceWords],
      names: ["North", "South", "Pole"],
      xp: 4,
      questions: [
        {
          prompt: t("What really causes day and night?", "白天和黑夜真正的原因是什么？"),
          right: t("The earth spinning on its axis", "地球绕着地轴自转"),
          wrong: [
            t("The sun traveling around the earth", "太阳绕着地球运行"),
            t("The moon covering the sun", "月球遮住太阳"),
            t("The sun turning off at night", "太阳在夜里熄灭"),
          ],
          solution: t(
            "The first paragraph says the sun is not moving across our sky; the earth is turning. The second says it spins around its axis.",
            "第一段说太阳并没有在天空中移动，是地球在转动；第二段说地球绕着地轴自转。",
          ),
        },
        {
          prompt: t("In this passage, what does the word *axis* mean?", "在这篇文章中，*axis* 是什么意思？"),
          right: t("An imaginary line through the earth that it spins around", "穿过地球、地球绕着它自转的假想线"),
          wrong: [
            t("The path of the earth around the sun", "地球绕太阳运行的路线"),
            t("The half of the earth that faces the sun", "地球朝向太阳的那一半"),
            t("A kind of spinning toy", "一种会旋转的玩具"),
          ],
          solution: t(
            "The second paragraph asks us to imagine a line from the North Pole to the South Pole and says this line is called the earth's axis.",
            "第二段让我们想象一条从北极到南极的线，并说这条线叫作地球的 axis（地轴）。",
          ),
        },
        {
          prompt: t("What can you infer from the last paragraph?", "从最后一段可以推断出什么？"),
          right: t("It is day and night in different places at the same time", "同一时刻，不同地方有的是白天，有的是黑夜"),
          wrong: [
            t("Children on the other side of the world do not eat lunch", "地球另一边的孩子不吃午饭"),
            t("The whole earth has night at the same time", "整个地球同时是黑夜"),
            t("Lunchtime is the same everywhere", "所有地方的午饭时间都一样"),
          ],
          solution: t(
            "Because half of the earth faces the sun while the other half is dark, your lunchtime is night for children far away.",
            "因为地球一半朝向太阳、另一半处在黑暗中，所以你的午饭时间正是远方孩子的夜晚。",
          ),
        },
      ],
    },
    {
      id: "the-changing-moon",
      title: t("The Changing Moon", "变化的月亮"),
      body: `The moon is the earth's closest neighbor in space. It is a ball of gray rock, and it travels around the earth in an orbit that takes about one month.

The moon does not make any light of its own. It shines because sunlight bounces off its surface, the way light bounces off a mirror. Half of the moon is always lit by the sun, but we cannot always see that whole half.

As the moon moves along its orbit, we see different amounts of its bright side. When the lit half faces away from us, the moon seems to disappear. This is called a new moon. A few nights later, a thin curve of light appears, called a crescent. Night after night, the bright part grows, until we see the whole round face. This is a full moon. Then the bright part slowly shrinks again, back to a new moon.

These changing shapes are called the phases of the moon. Long ago, people used them as a calendar. In fact, the word month comes from an old word for moon.`,
      topics: [clues, spaceWords],
      glossed: ["crescent", "phases"],
      xp: 4,
      questions: [
        {
          prompt: t("Why does the moon shine?", "月亮为什么会发光？"),
          right: t("Sunlight bounces off its surface", "阳光从它的表面反射回来"),
          wrong: [
            t("It makes its own light", "它自己发光"),
            t("It is a small star", "它是一颗小恒星"),
            t("Light from the earth reaches it", "地球的光照到它上面"),
          ],
          solution: t(
            "The second paragraph says the moon does not make any light of its own; it shines because sunlight bounces off it.",
            "第二段说月亮自己不发光，它发亮是因为阳光从它上面反射回来。",
          ),
        },
        {
          prompt: t("What happens right after a new moon?", "新月之后紧接着会出现什么？"),
          right: t("A thin crescent of light appears", "出现一弯细细的月牙"),
          wrong: [t("A full moon appears", "出现满月"), t("The moon stops moving", "月亮停止移动"), t("The moon turns red", "月亮变红")],
          solution: t(
            "The third paragraph says that a few nights after the new moon, a thin curve of light called a crescent appears.",
            "第三段说，新月之后几个晚上，会出现一弯叫作 crescent（月牙）的细光。",
          ),
        },
        {
          prompt: t("Why did people long ago use the moon as a calendar?", "很久以前人们为什么用月亮当日历？"),
          right: t("Its phases repeat about once a month", "它的月相大约每个月重复一次"),
          wrong: [
            t("It rises at the same time every night", "它每晚在同一时间升起"),
            t("It is closer than the sun", "它比太阳近"),
            t("It is made of gray rock", "它由灰色岩石构成"),
          ],
          solution: t(
            "The moon's orbit takes about a month, and its phases go from new to full and back, so people could count months by them.",
            "月亮绕地球一圈大约一个月，月相从新月到满月再回到新月，所以人们可以用它来计算月份。",
          ),
        },
      ],
    },
    {
      id: "the-rocky-planets",
      title: t("The Rocky Planets", "岩石行星"),
      body: `The four planets closest to the sun are Mercury, Venus, Earth and Mars. They are called the rocky planets, because each one has a hard, rocky surface that you could stand on.

Mercury is the smallest planet and the closest to the sun. It has almost no air to hold in heat, so its days are burning hot and its nights are freezing cold.

Venus is about the same size as Earth, but it would be a terrible place to visit. Thick clouds trap the sun's heat, which makes Venus the hottest planet of all, even hotter than Mercury.

Earth, the third planet, is the only one we know of with liquid water on its surface and living things. It is not too hot and not too cold.

Mars, the fourth planet, is called the Red Planet because its dusty soil is red with rust. It has the tallest volcano in the solar system, which is almost three times as tall as the highest mountain on Earth. Scientists have sent robots to explore Mars, and they have found signs that rivers once flowed there long ago.`,
      topics: [clues, spaceWords],
      names: ["Mercury", "Venus", "Earth", "Mars", "Red", "Planet"],
      xp: 4,
      questions: [
        {
          prompt: t("Why are these four planets called the rocky planets?", "为什么这四颗行星被称为岩石行星？"),
          right: t("Each has a hard, rocky surface", "每一颗都有坚硬的岩石表面"),
          wrong: [
            t("They are covered with rocks that fly through space", "它们被在太空中飞行的岩石覆盖"),
            t("They are the smallest planets", "它们是最小的行星"),
            t("They have no air", "它们没有空气"),
          ],
          solution: t(
            "The first paragraph says they are called the rocky planets because each has a hard, rocky surface you could stand on.",
            "第一段说，它们被称为岩石行星，是因为每一颗都有可以站立的坚硬岩石表面。",
          ),
        },
        {
          prompt: t(
            "Why is Venus hotter than Mercury, even though Mercury is closer to the sun?",
            "水星离太阳更近，为什么金星反而比水星更热？",
          ),
          right: t("Thick clouds trap the sun's heat on Venus", "厚厚的云层把太阳的热量困在金星上"),
          wrong: [
            t("Venus is bigger than the sun", "金星比太阳大"),
            t("Venus has many volcanoes", "金星上有很多火山"),
            t("Mercury has rivers that cool it", "水星上有河流给它降温"),
          ],
          solution: t(
            "The third paragraph says thick clouds trap the sun's heat, which makes Venus the hottest planet; the second says Mercury has almost no air to hold heat.",
            "第三段说厚厚的云层困住了太阳的热量，使金星成为最热的行星；第二段说水星几乎没有空气来保持热量。",
          ),
        },
        {
          prompt: t("What does the passage say robots found on Mars?", "文章说机器人在火星上发现了什么？"),
          right: t("Signs that rivers once flowed there", "那里曾经有河流的迹象"),
          wrong: [
            t("Living animals", "活着的动物"),
            t("Liquid water on its surface today", "如今表面上的液态水"),
            t("Thick clouds", "厚厚的云层"),
          ],
          solution: t(
            "The last sentence says scientists' robots found signs that rivers once flowed on Mars long ago.",
            "最后一句说，科学家的机器人发现了火星上很久以前曾有河流流过的迹象。",
          ),
        },
      ],
    },
    {
      id: "the-giant-planets",
      title: t("The Giant Planets", "巨行星"),
      body: `Beyond Mars, far from the sun, are four huge planets: Jupiter, Saturn, Uranus and Neptune. They are very different from the rocky planets. They are mostly made of gas and ice, so a spaceship could never land on them. There is no solid ground to stand on.

Jupiter is the largest planet of all. More than one thousand Earths could fit inside it. A giant storm called the Great Red Spot has been spinning on Jupiter for hundreds of years, and it is wider than our whole planet.

Saturn is famous for its rings. From far away they look like solid bands, but they are really made of billions of pieces of ice and rock, from tiny grains to chunks as big as a house, all circling the planet.

Uranus and Neptune are so far from the sun that they are bitterly cold. Both look blue. Uranus is unusual because it spins on its side, as if it had been knocked over long ago.

The giant planets also have many moons. Jupiter and Saturn each have more than ninety.`,
      topics: [clues, spaceWords],
      names: ["Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Earths", "Great", "Red", "Spot"],
      xp: 4,
      questions: [
        {
          prompt: t("Why could a spaceship never land on the giant planets?", "为什么宇宙飞船永远无法在巨行星上着陆？"),
          right: t("They are mostly gas and ice, with no solid ground", "它们主要由气体和冰构成，没有坚实的地面"),
          wrong: [
            t("They are too close to the sun", "它们离太阳太近"),
            t("Their rings are in the way", "它们的环挡住了路"),
            t("They spin on their sides", "它们侧着身子自转"),
          ],
          solution: t(
            "The first paragraph says they are mostly made of gas and ice, and there is no solid ground to stand on.",
            "第一段说它们主要由气体和冰构成，没有可以站立的坚实地面。",
          ),
        },
        {
          prompt: t("What are Saturn's rings made of?", "土星环是由什么构成的？"),
          right: t("Billions of pieces of ice and rock", "数十亿块冰和岩石"),
          wrong: [
            t("Solid bands of metal", "坚固的金属带"),
            t("Clouds of gas", "气体云"),
            t("Small moons as big as Jupiter", "像木星一样大的小卫星"),
          ],
          solution: t(
            "The third paragraph says the rings look solid from far away but are made of billions of pieces of ice and rock.",
            "第三段说，土星环从远处看像坚固的带子，其实由数十亿块冰和岩石构成。",
          ),
        },
        {
          prompt: t("What is unusual about Uranus?", "天王星有什么不寻常之处？"),
          right: t("It spins on its side", "它侧着身子自转"),
          wrong: [
            t("It is the largest planet", "它是最大的行星"),
            t("It has no moons", "它没有卫星"),
            t("It is the hottest planet", "它是最热的行星"),
          ],
          solution: t(
            "The fourth paragraph says Uranus is unusual because it spins on its side, as if it had been knocked over.",
            "第四段说天王星不寻常，因为它侧着身子自转，好像很久以前被撞倒了一样。",
          ),
        },
      ],
    },
    {
      id: "pictures-in-the-stars",
      title: t("Pictures in the Stars", "星空中的图画"),
      body: `On a clear, dark night, you can see thousands of stars. Long ago, people looked up at them and imagined pictures. They connected the bright stars with lines in their minds, the way you might connect dots on a page. Each picture is called a constellation.

Different peoples saw different pictures in the same stars. Seven bright stars in the northern sky look to some people like a big spoon called the Big Dipper. Others saw a plow, and still others saw a great bear.

The stars of a constellation look close together, but they are not. One star might be much farther from us than its neighbor. They only seem to be side by side because we see them from the earth.

Constellations were useful as well as beautiful. Sailors used them to find their way across the ocean at night. Farmers watched for certain constellations to know when to plant their seeds.

As the earth travels around the sun, we see different constellations in different seasons. The stars you see on a winter night are not the same as the ones you see in summer.`,
      topics: [clues, spaceWords],
      names: ["Big", "Dipper"],
      xp: 4,
      questions: [
        {
          prompt: t("What is a constellation?", "什么是星座？"),
          right: t("A picture people imagine by connecting bright stars", "人们把亮星连起来想象出的图形"),
          wrong: [
            t("A group of stars that are close together in space", "在太空中彼此靠近的一群星星"),
            t("A very bright star", "一颗非常亮的星星"),
            t("A map that sailors drew", "水手画的一张地图"),
          ],
          solution: t(
            "The first paragraph says people connected bright stars with lines in their minds, and each picture is called a constellation.",
            "第一段说，人们在脑海中用线把亮星连起来，每一幅这样的图画叫作 constellation（星座）。",
          ),
        },
        {
          prompt: t("According to the passage, how did sailors use constellations?", "根据文章，水手怎样利用星座？"),
          right: t("To find their way at night", "在夜里辨认方向"),
          wrong: [
            t("To know when to plant seeds", "知道什么时候播种"),
            t("To measure the ocean", "测量海洋"),
            t("To tell stories to children", "给孩子讲故事"),
          ],
          solution: t(
            "The fourth paragraph says sailors used constellations to find their way across the ocean at night; it was farmers who used them to plan planting.",
            "第四段说水手用星座在夜里横渡海洋时辨认方向；用星座安排播种的是农民。",
          ),
        },
        {
          prompt: t("Why do we see different constellations in winter and in summer?", "为什么冬天和夏天看到的星座不同？"),
          right: t("The earth travels around the sun", "地球绕着太阳运行"),
          wrong: [
            t("The stars move closer together in winter", "星星冬天会靠得更近"),
            t("People imagine new pictures every year", "人们每年都想象出新的图形"),
            t("Some stars stop shining in summer", "有些星星夏天就不亮了"),
          ],
          solution: t(
            "The last paragraph says that as the earth travels around the sun, we see different constellations in different seasons.",
            "最后一段说，随着地球绕太阳运行，我们在不同季节看到不同的星座。",
          ),
        },
      ],
    },
    {
      id: "comets-and-asteroids",
      title: t("Comets and Asteroids", "彗星和小行星"),
      body: `Planets and moons are not the only things that travel around the sun. Millions of smaller objects do too. Two kinds are comets and asteroids.

An asteroid is a chunk of rock or metal. Some are as small as a pebble, and a few are hundreds of miles wide. Most asteroids circle the sun between Mars and Jupiter, in a wide ring called the asteroid belt.

A comet is often called a dirty snowball, because it is a lump of ice mixed with dust and rock. For most of its long orbit, a comet is far from the sun and frozen solid. But when it swings close to the sun, the heat turns some of its ice into gas. The gas and dust stream out behind it in a glowing tail that can stretch for millions of miles. Then people on Earth may see it shining in the night sky.

Sometimes small pieces of rock from space fall toward the earth. Most burn up in the air, making bright streaks that people call shooting stars. They are not stars at all.`,
      topics: [clues, spaceWords],
      names: ["Mars", "Jupiter", "Earth"],
      xp: 4,
      questions: [
        {
          prompt: t("Where do most asteroids travel?", "大多数小行星在哪里运行？"),
          right: t("Between Mars and Jupiter", "在火星和木星之间"),
          wrong: [t("Close to the earth", "靠近地球的地方"), t("Inside the sun", "太阳内部"), t("Around the moon", "绕着月球")],
          solution: t(
            "The second paragraph says most asteroids circle the sun between Mars and Jupiter, in the asteroid belt.",
            "第二段说大多数小行星在火星和木星之间的小行星带里绕太阳运行。",
          ),
        },
        {
          prompt: t("What causes a comet to grow a tail?", "是什么让彗星长出尾巴？"),
          right: t("The sun's heat turns some of its ice into gas", "太阳的热量把它的一部分冰变成了气体"),
          wrong: [
            t("It crashes into an asteroid", "它撞上了一颗小行星"),
            t("It freezes solid far from the sun", "它在远离太阳的地方冻得结结实实"),
            t("It burns up in the air", "它在空气中燃烧殆尽"),
          ],
          solution: t(
            "The third paragraph says that when a comet comes close to the sun, the heat turns some of its ice into gas, and gas and dust stream out in a tail.",
            "第三段说彗星靠近太阳时，热量把它的一部分冰变成气体，气体和尘埃向后流出形成尾巴。",
          ),
        },
        {
          prompt: t('Why does the writer say shooting stars "are not stars at all"?', "作者为什么说流星“根本不是星星”？"),
          right: t("They are small pieces of rock burning up in the air", "它们是在空气中燃烧的小石块"),
          wrong: [
            t("They are comets with long tails", "它们是拖着长尾巴的彗星"),
            t("They are planets far away", "它们是遥远的行星"),
            t("They are only seen in the day", "只有白天才能看到它们"),
          ],
          solution: t(
            "The last paragraph explains that shooting stars are small pieces of rock from space that burn up in the air.",
            "最后一段解释说，流星是来自太空、在空气中燃烧的小石块。",
          ),
        },
      ],
    },
    {
      id: "exploring-space",
      title: t("Exploring Space", "探索太空"),
      body: `For most of history, people could only study the sky with their eyes. About four hundred years ago, an Italian scientist named Galileo pointed a telescope at the night sky. He saw mountains on the moon and four small moons circling Jupiter. No one had ever seen these things before.

In the last hundred years, people learned to build rockets powerful enough to escape the earth's gravity. In 1969, two astronauts became the first people to walk on the moon. They collected rocks, planted a flag and left footprints that are still there today, because the moon has no wind to blow them away.

Most of the solar system is too far or too dangerous for people to visit, so scientists send robots instead. Robot rovers have rolled across the dusty ground of Mars, taking pictures and testing the soil. Other spacecraft have flown past every planet, sending back photos of storms, rings and icy moons.

Today, astronauts from many countries live and work together on a space station that circles the earth. Someday, some of you may travel even farther.`,
      topics: [clues, spaceWords],
      names: ["Italian", "Galileo", "Jupiter", "Mars"],
      xp: 4,
      questions: [
        {
          prompt: t("What did Galileo see with his telescope?", "伽利略用望远镜看到了什么？"),
          right: t("Mountains on the moon and moons circling Jupiter", "月球上的山和绕木星运行的卫星"),
          wrong: [
            t("Astronauts walking on the moon", "在月球上行走的宇航员"),
            t("Robots on Mars", "火星上的机器人"),
            t("A space station", "一座空间站"),
          ],
          solution: t(
            "The first paragraph says Galileo saw mountains on the moon and four small moons circling Jupiter.",
            "第一段说伽利略看到了月球上的山和绕着木星运行的四颗小卫星。",
          ),
        },
        {
          prompt: t("Why are the astronauts' footprints still on the moon?", "为什么宇航员的脚印至今还留在月球上？"),
          right: t("The moon has no wind to blow them away", "月球上没有风把它们吹走"),
          wrong: [
            t("The astronauts went back to protect them", "宇航员回去保护它们"),
            t("The footprints are made of rock", "脚印是石头做的"),
            t("Robots keep them clean", "机器人让它们保持干净"),
          ],
          solution: t(
            "The second paragraph says the footprints are still there because the moon has no wind to blow them away.",
            "第二段说脚印至今还在，因为月球上没有风把它们吹走。",
          ),
        },
        {
          prompt: t("Why do scientists send robots to most of the solar system?", "为什么科学家把机器人送往太阳系的大部分地方？"),
          right: t("Most places are too far or too dangerous for people", "大多数地方对人来说太远或太危险"),
          wrong: [
            t("Robots can see better than telescopes", "机器人比望远镜看得更清楚"),
            t("People are not allowed in space", "人类不允许进入太空"),
            t("Robots are cheaper than rockets", "机器人比火箭便宜"),
          ],
          solution: t(
            "The third paragraph says most of the solar system is too far or too dangerous for people to visit, so scientists send robots instead.",
            "第三段说太阳系的大部分地方对人来说太远或太危险，所以科学家改派机器人去。",
          ),
        },
      ],
    },
  ],
};
