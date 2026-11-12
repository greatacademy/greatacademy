// Grade 6: the reading unit of the fifth theme, the moving plates of the earth and the volcanoes and earthquakes
// they cause.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grade-5/reading-kit.ts";

const plateWords = { topic: "words-of-plate-tectonics", weight: 0.3 } as const;
const volcanoWords = { topic: "words-of-volcanoes", weight: 0.3 } as const;
const measureWords = { topic: "words-of-measuring", weight: 0.3 } as const;
const technical = { topic: "technical-words-in-context", weight: 0.2 } as const;
const features = { topic: "text-features-in-science", weight: 0.2 } as const;
const academic1 = { topic: "academic-words-1", weight: 0.1 } as const;
const academic2 = { topic: "academic-words-2", weight: 0.1 } as const;
const academic3 = { topic: "academic-words-3", weight: 0.1 } as const;

/** theRestlessEarth is a reading unit of grade 6 on plate tectonics, volcanoes and earthquakes. */
export const theRestlessEarth: ReadingUnitDef = {
  id: "the-restless-earth",
  title: t("The Restless Earth", "躁动的地球"),
  passages: [
    passage(
      "the-puzzle-of-the-continents",
      t("The Puzzle of the Continents", "大陆的拼图"),
      `Look closely at a map of the world, and you may notice something strange. The east coast of South America and the west coast of Africa look as if they could fit together, like two pieces of a puzzle. For hundreds of years, people noticed this shape and wondered about it. In 1912, a German scientist named Alfred Wegener offered an answer that most scientists of his time thought was ridiculous.

Wegener argued that all the continents had once been joined in a single giant landmass, which he called Pangaea, meaning "all lands." Over millions of years, he said, Pangaea had broken apart, and the pieces had slowly drifted to where they are today. He called his idea continental drift.

Wegener did not rely on shapes alone. He showed that the same kinds of fossils were found on continents now separated by wide oceans. The remains of a small reptile called Mesosaurus, which lived in fresh water and could not have swum across an ocean, appear in both Brazil and southern Africa. Rocks of the same age and type also lined up across the oceans, like the lines of print on a torn newspaper.

Still, most scientists rejected the idea. Wegener could not explain what force was strong enough to move whole continents. He died in 1930 on an expedition in Greenland, his theory still unaccepted. Only in the 1960s, when scientists mapped the ocean floor and found evidence that it was spreading, did his idea return. It became part of a larger theory called plate tectonics, and Wegener was finally proved right.`,
      [plateWords, technical, academic1],
      [
        ask(
          t("What does continental drift mean in this passage?", "在这篇文章中，continental drift 是什么意思？"),
          t("The idea that continents slowly moved apart from one landmass", "大陆从一整块陆地慢慢漂移分开的观点"),
          [
            t("The way rivers carry mud to the sea", "河流把泥沙带入大海的方式"),
            t("The shape of South America on a map", "南美洲在地图上的形状"),
            t("A kind of fossil found in Brazil", "在巴西发现的一种化石"),
          ],
          t(
            "The second paragraph explains that Pangaea broke apart and its pieces slowly drifted, and then says he called this idea continental drift.",
            "第二段解释说盘古大陆分裂了，碎块慢慢漂移，然后说他把这个观点称为大陆漂移。",
          ),
        ),
        ask(
          t("Why do the Mesosaurus fossils support Wegener's idea?", "为什么中龙化石支持魏格纳的观点？"),
          t("The animal could not have crossed an ocean, yet it is found on two continents", "这种动物不可能横渡大洋，却出现在两块大陆上"),
          [
            t("The animal was a strong swimmer that crossed oceans", "这种动物是游泳健将，能横渡大洋"),
            t("The fossils were all found in Greenland", "化石都是在格陵兰发现的"),
            t("The fossils showed that the oceans were once dry", "化石表明海洋曾经是干涸的"),
          ],
          t(
            "The third paragraph says Mesosaurus lived in fresh water and could not have swum across an ocean, yet appears in both Brazil and southern Africa.",
            "第三段说中龙生活在淡水中，不可能游过大洋，却在巴西和非洲南部都有发现。",
          ),
        ),
        ask(
          t("Why did most scientists reject Wegener's idea at first?", "为什么大多数科学家起初反对魏格纳的观点？"),
          t("He could not explain what force moved the continents", "他无法解释是什么力量推动了大陆"),
          [
            t("He had no evidence from fossils", "他没有化石证据"),
            t("The continents do not look like puzzle pieces", "大陆看起来并不像拼图块"),
            t("He refused to share his maps", "他拒绝分享他的地图"),
          ],
          t(
            "The last paragraph says Wegener could not explain what force was strong enough to move whole continents.",
            "最后一段说，魏格纳无法解释是什么力量强大到足以推动整块大陆。",
          ),
        ),
      ],
      ["America", "Africa", "Alfred", "Wegener", "Wegener's", "Pangaea", "Mesosaurus", "Brazil", "Greenland"],
    ),
    passage(
      "the-layers-of-the-earth",
      t("Inside the Earth", "地球内部"),
      `No one has ever traveled to the center of the earth. The deepest hole ever drilled reaches only about twelve kilometers down, far less than one percent of the way. Yet scientists can describe the inside of our planet in surprising detail. They do it by studying earthquake waves, which change speed and direction as they pass through different materials.

From this evidence, scientists divide the earth into layers. The outer layer, the one we live on, is the crust. It is thin and rocky, like the skin of an apple. Under the oceans the crust is only about seven kilometers thick, but beneath the continents it can reach seventy.

Below the crust lies the mantle, the thickest layer of all, nearly 2,900 kilometers deep. The mantle is made of hot rock. It is solid, but over long periods of time it can flow very slowly, rather like a thick toffee that bends instead of breaking.

At the center is the core, which has two parts. The outer core is liquid metal, mostly iron and nickel. Scientists believe that the swirling of this liquid metal produces the earth's magnetic field, the force that makes a compass needle point north. The inner core is a solid ball of metal, as hot as the surface of the sun. It stays solid only because of the enormous pressure of all the layers above it.

The crust and the top of the mantle together are broken into giant pieces called tectonic plates. They float on the softer rock below, and their movement shapes mountains, oceans and continents.`,
      [plateWords, technical, features, academic1],
      [
        ask(
          t("How do scientists know what is inside the earth?", "科学家是怎样知道地球内部情况的？"),
          t("By studying how earthquake waves change as they pass through it", "通过研究地震波穿过地球时的变化"),
          [
            t("By drilling a hole to the center", "通过钻一个通往地心的洞"),
            t("By sending a camera into a volcano", "通过把相机送进火山"),
            t("By measuring the skin of an apple", "通过测量苹果皮"),
          ],
          t(
            "The first paragraph says scientists study earthquake waves, which change speed and direction as they pass through different materials.",
            "第一段说，科学家研究地震波，地震波穿过不同物质时会改变速度和方向。",
          ),
        ),
        ask(
          t("What clue helps you understand what the mantle is like?", "什么线索帮助你理解地幔是什么样的？"),
          t("It is compared to thick toffee that bends instead of breaking", "它被比作会弯曲而不会断裂的浓稠太妃糖"),
          [
            t("It is called the skin of an apple", "它被称为苹果皮"),
            t("It is said to point a compass north", "据说它让指南针指向北方"),
            t("It is described as a ball of liquid iron", "它被描述为一个液态铁球"),
          ],
          t(
            "The third paragraph explains that the mantle is solid but flows slowly, rather like a thick toffee that bends instead of breaking.",
            "第三段解释说，地幔是固态的，但会缓慢流动，就像会弯曲而不会断裂的浓稠太妃糖。",
          ),
        ),
        ask(
          t("Why does the inner core stay solid even though it is so hot?", "内核这么热，为什么仍然保持固态？"),
          t("Because of the enormous pressure of the layers above it", "因为上面各层的巨大压力"),
          [
            t("Because it is made of cold rock", "因为它是由冷的岩石构成的"),
            t("Because the magnetic field freezes it", "因为磁场把它冻住了"),
            t("Because it is close to the crust", "因为它靠近地壳"),
          ],
          t(
            "The fourth paragraph says the inner core stays solid only because of the enormous pressure of all the layers above it.",
            "第四段说，内核之所以保持固态，只是因为上面所有层的巨大压力。",
          ),
        ),
      ],
    ),
    passage(
      "where-plates-meet",
      t("Where Plates Meet", "板块交汇处"),
      `The earth's surface is broken into about fifteen large tectonic plates and many smaller ones. They move only a few centimeters a year, about as fast as your fingernails grow. But over millions of years, this slow movement can build mountains and open new oceans. Most of the action happens at the edges, where one plate meets another. These edges are called plate boundaries, and there are three main kinds.

At a divergent boundary, two plates move apart. Hot rock from the mantle rises to fill the gap, cools and forms new crust. In the middle of the Atlantic Ocean, a long underwater mountain range marks such a boundary. On land, a divergent boundary can create a rift, a long valley where the ground is slowly splitting, like the Great Rift Valley in East Africa.

At a convergent boundary, two plates move toward each other and collide. When an ocean plate meets a continental plate, the heavier ocean plate slides beneath the other one and sinks into the mantle. This process is called subduction, and it often forms a deep trench in the ocean floor. When two continental plates collide, neither one sinks. Instead, the crust crumples and is pushed upward. This uplift created the Himalayas, which are still growing by a few millimeters each year.

At a transform boundary, two plates slide past each other sideways. They do not move smoothly. They lock together, strain builds up, and then they suddenly slip. The San Andreas Fault in California is a famous example, and the sudden slips there cause many earthquakes.`,
      [plateWords, technical, academic2],
      [
        ask(
          t("What happens at a divergent boundary?", "在离散型板块边界会发生什么？"),
          t("Two plates move apart and new crust forms between them", "两个板块分开，中间形成新的地壳"),
          [
            t("Two plates slide past each other sideways", "两个板块侧向擦肩而过"),
            t("One plate sinks beneath the other", "一个板块俯冲到另一个下面"),
            t("Two plates crumple into tall mountains", "两个板块挤压成高山"),
          ],
          t(
            "The second paragraph says that at a divergent boundary two plates move apart and hot rock rises, cools and forms new crust.",
            "第二段说，在离散型边界，两个板块分开，炽热的岩石上升、冷却，形成新的地壳。",
          ),
        ),
        ask(
          t("Which clue tells you what subduction means?", "哪条线索告诉你 subduction 的意思？"),
          t("The sentence before it describes the ocean plate sliding beneath and sinking", "它前面那句描述了大洋板块俯冲下沉"),
          [
            t("It is compared to the speed of growing fingernails", "它被比作指甲生长的速度"),
            t("It is shown with the example of the San Andreas Fault", "用圣安德烈亚斯断层的例子说明"),
            t("It is defined in the first paragraph", "它在第一段中有定义"),
          ],
          t(
            "The passage first describes the heavier ocean plate sliding beneath the other and sinking, then says: This process is called subduction.",
            "文章先描述较重的大洋板块滑到另一个板块下面并下沉，然后说：这个过程叫作俯冲。",
          ),
        ),
        ask(
          t("Why do the Himalayas keep growing?", "为什么喜马拉雅山脉还在长高？"),
          t("Two continental plates are still colliding and pushing the crust up", "两个大陆板块仍在碰撞，把地壳向上推"),
          [
            t("New crust is rising from a rift valley", "新的地壳正从裂谷中升起"),
            t("An ocean plate is sinking beneath them", "一个大洋板块正在它们下面下沉"),
            t("Two plates are sliding past each other", "两个板块正在擦肩而过"),
          ],
          t(
            "The third paragraph says that when two continental plates collide, the crust crumples and is pushed upward, and this uplift created the Himalayas, which are still growing.",
            "第三段说，两个大陆板块碰撞时，地壳被挤皱并向上推起，这种抬升造就了仍在长高的喜马拉雅山脉。",
          ),
        ),
      ],
      ["Atlantic", "Africa", "Himalayas", "San", "Andreas", "California"],
    ),
    passage(
      "the-ring-of-fire",
      t("The Ring of Fire", "火环"),
      `If you drew a dot on a world map for every active volcano, a pattern would soon appear. Most of the dots would form a huge horseshoe around the edges of the Pacific Ocean. It runs up the west coast of South America, through Central America and the west of North America, across to Alaska, and then down through Japan, the Philippines, Indonesia and New Zealand. This great curve is known as the Ring of Fire.

The Ring of Fire is about 40,000 kilometers long, and it holds about three quarters of the world's active volcanoes. About nine out of every ten earthquakes also happen along it. Why are so many of them in one place?

The answer lies beneath the ocean. The Pacific Ocean sits on several tectonic plates, and all around its edges these plates are colliding with the plates that carry the continents. In most places, the heavy ocean plate is forced down under the lighter continental plate. As it sinks deep into the mantle, it heats up and helps rock above it to melt. This melted rock rises toward the surface and feeds a long chain of volcanoes. At the same time, the grinding of the plates against each other causes earthquakes.

Many millions of people live along the Ring of Fire, in cities such as Tokyo, Manila, Lima and Los Angeles. The volcanoes there have made the soil rich for farming, but they also bring danger. That is why countries on the Ring of Fire study their volcanoes closely and train people to act quickly when the ground begins to move.`,
      [plateWords, volcanoWords, features, academic2],
      [
        ask(
          t("What is the Ring of Fire?", "火环是什么？"),
          t("A curve of volcanoes and earthquakes around the edges of the Pacific", "环绕太平洋边缘的一条火山和地震带"),
          [
            t("A single huge volcano in Japan", "日本的一座巨大火山"),
            t("A ring of hot springs in the Atlantic", "大西洋里的一圈温泉"),
            t("A circle of fires lit by farmers", "农民点燃的一圈火"),
          ],
          t(
            "The first paragraph describes the horseshoe of volcanoes around the edges of the Pacific Ocean and says this curve is known as the Ring of Fire.",
            "第一段描述了环绕太平洋边缘的马蹄形火山带，并说这条弧线被称为火环。",
          ),
        ),
        ask(
          t("Why are there so many volcanoes along the Ring of Fire?", "为什么火环上有这么多火山？"),
          t("Ocean plates sink there and help rock melt and rise", "大洋板块在那里下沉，促使岩石熔化并上升"),
          [
            t("The ocean water heats the rock until it boils", "海水把岩石加热到沸腾"),
            t("The plates there are moving apart", "那里的板块正在分开"),
            t("People have built too many cities there", "人们在那里修建了太多城市"),
          ],
          t(
            "The third paragraph explains that the heavy ocean plate is forced down, heats up and helps rock above it melt, and the melted rock rises to feed volcanoes.",
            "第三段解释说，较重的大洋板块被迫下沉、升温，促使上方的岩石熔化，熔化的岩石上升，形成火山。",
          ),
        ),
        ask(
          t(
            "If you wanted to show readers where the Ring of Fire is, which feature would help most?",
            "如果你想让读者看到火环在哪里，哪种文本特征最有帮助？",
          ),
          t("A map with the volcanoes marked around the Pacific", "一张在太平洋周围标出火山的地图"),
          [
            t("A glossary entry for the word earthquake", "earthquake 一词的词汇表条目"),
            t("A heading that says The Answer", "写着 The Answer 的标题"),
            t("A photo of a single city street", "一张城市街道的照片"),
          ],
          t(
            "The passage describes a pattern on a world map; a map with the volcanoes marked would show that pattern at a glance.",
            "文章描述的是世界地图上的一种分布规律；标出火山的地图能让人一眼看出这种规律。",
          ),
        ),
      ],
      ["Pacific", "America", "Alaska", "Japan", "Philippines", "Indonesia", "Zealand", "Tokyo", "Manila", "Lima", "Los", "Angeles"],
    ),
    passage(
      "how-a-volcano-is-born",
      t("How a Volcano Is Born", "火山是怎样诞生的"),
      `In February 1943, a farmer named Dionisio Pulido was working in his cornfield in Mexico when he noticed something odd. A crack had opened in the ground, and smoke was rising from it. The earth rumbled, and the air smelled of rotten eggs. By the next morning, a small cone of rock and ash stood where the crack had been. Within a week it was as tall as a five-story building. Pulido was watching a volcano being born. It was named Parícutin, after a nearby village.

A volcano begins deep underground, where rock is so hot that it melts. This melted rock is called magma. Because magma is lighter than the solid rock around it, it slowly rises, collecting in a large pocket called a magma chamber. Gases dissolved in the magma, much like the bubbles in a bottle of soda, push upward as well.

When the pressure becomes too great, the magma forces its way to the surface through a crack, or fissure. Once it reaches the air, it is called lava. In an eruption, lava may pour out in glowing rivers, or the gases may explode, blasting rock and ash high into the sky. Some of this rock, filled with gas bubbles, cools into pumice, a stone so light that it can float on water.

Layer by layer, the lava and ash build up around the opening and form a cone. Parícutin grew for nine years, reaching a height of more than 400 meters. Its lava buried two villages, but because the people had time to evacuate, no one was killed by the flowing lava.`,
      [volcanoWords, technical],
      [
        ask(
          t("What is the difference between magma and lava?", "岩浆（magma）和熔岩（lava）有什么区别？"),
          t(
            "Magma is melted rock underground; lava is the same rock once it reaches the surface",
            "magma 是地下的熔融岩石；lava 是到达地表后的同一种岩石",
          ),
          [
            t("Magma is cold and lava is hot", "magma 是冷的，lava 是热的"),
            t("Magma is made of ash and lava of gas", "magma 由灰烬构成，lava 由气体构成"),
            t("They are two names for pumice", "它们都是浮石的名称"),
          ],
          t(
            "The second paragraph calls melted rock underground magma, and the third says that once it reaches the air it is called lava.",
            "第二段把地下的熔融岩石称为 magma，第三段说它一旦接触空气就叫作 lava。",
          ),
        ),
        ask(
          t("How does the passage help you understand the word fissure?", "文章怎样帮助你理解 fissure 一词？"),
          t("It gives a simpler word, crack, just before it", "它在前面紧接着给出了更简单的词 crack"),
          [
            t("It describes a stone that floats on water", "它描述了一种能浮在水面的石头"),
            t("It compares it to the bubbles in soda", "它把它比作汽水里的气泡"),
            t("It defines it in the last paragraph", "它在最后一段中给出了定义"),
          ],
          t(
            "The sentence says the magma forces its way through a crack, or fissure; the word or introduces the technical word for the same thing.",
            "句子说岩浆从一道裂缝（crack, or fissure）中冲出；or 引出了同一事物的专业词。",
          ),
        ),
        ask(
          t("Why does the passage begin with the story of Dionisio Pulido?", "文章为什么以迪奥尼西奥·普利多的故事开头？"),
          t("To show a real volcano being born before explaining how it happens", "在解释火山如何形成之前，先展示一座真实火山的诞生"),
          [
            t("To explain how to grow corn in Mexico", "解释如何在墨西哥种玉米"),
            t("To prove that volcanoes always kill people", "证明火山总会致人死亡"),
            t("To compare a farmer with a scientist", "把农民和科学家作比较"),
          ],
          t(
            "The opening tells what Pulido saw in his field, and the following paragraphs explain the process behind it.",
            "开头讲述了普利多在田里看到的情景，接下来的段落解释了背后的过程。",
          ),
        ),
      ],
      ["Dionisio", "Pulido", "Mexico", "Parícutin"],
    ),
    passage(
      "when-the-ground-shakes",
      t("When the Ground Shakes", "大地震动时"),
      `Deep underground, the rocks along a fault are pressed tightly together. A fault is a crack in the crust where two blocks of rock can move past each other. Most of the time, friction holds the blocks in place, even though the plates are slowly pushing on them. Strain builds up in the rock, the way energy builds in a bow when you pull back the string. Then, suddenly, the rock gives way. The blocks slip, and the stored energy is released all at once. That sudden release is an earthquake.

The place underground where the slip begins is called the focus. The point on the surface directly above it is the epicenter. From the focus, the energy spreads out in all directions as seismic waves, much like ripples spreading from a stone dropped into a pond.

There are several kinds of seismic waves. The fastest, called primary waves, push and pull the rock as they travel, squeezing it and stretching it. They arrive first, often as a sharp jolt. Secondary waves are slower, and they shake the ground from side to side or up and down. Last come the surface waves, which roll along the ground like waves on the sea. Although they are the slowest, surface waves usually do the most damage to buildings and roads.

Most earthquakes are so small that nobody feels them. Scientists record hundreds of thousands every year. But a few each year are strong enough to topple buildings, break bridges and set off landslides. Because no one can yet predict exactly when an earthquake will strike, learning what to do when the shaking starts can save lives.`,
      [plateWords, technical, measureWords],
      [
        ask(
          t("What is the epicenter of an earthquake?", "地震的震中是什么？"),
          t("The point on the surface directly above where the slip begins", "地表上正对着断层开始滑动处的那个点"),
          [
            t("The deepest point of the crust", "地壳最深的地方"),
            t("The crack where two plates move apart", "两个板块分开的裂缝"),
            t("The fastest kind of seismic wave", "最快的一种地震波"),
          ],
          t(
            "The second paragraph says the focus is where the slip begins underground and the epicenter is the point on the surface directly above it.",
            "第二段说，震源是地下开始滑动的地方，震中是震源正上方的地表点。",
          ),
        ),
        ask(
          t("What does the comparison with a bow help you understand?", "与弓的比较帮助你理解什么？"),
          t("How strain builds up in the rock and is then released all at once", "应变如何在岩石中积累，然后一下子释放出来"),
          [
            t("How fast primary waves travel", "纵波传播得有多快"),
            t("Why surface waves do the most damage", "为什么面波破坏性最大"),
            t("Where the epicenter is found", "震中在哪里"),
          ],
          t(
            "The first paragraph compares the strain in the rock to the energy in a bow when the string is pulled back, before it is suddenly released.",
            "第一段把岩石中的应变比作拉弓时储存在弓里的能量，随后能量会突然释放。",
          ),
        ),
        ask(
          t("Which seismic waves usually do the most damage?", "哪种地震波通常破坏性最大？"),
          t("Surface waves, even though they are the slowest", "面波，尽管它们最慢"),
          [
            t("Primary waves, because they arrive first", "纵波，因为它们最先到达"),
            t("Secondary waves, because they are the fastest", "横波，因为它们最快"),
            t("All the waves do the same damage", "所有波的破坏程度都一样"),
          ],
          t(
            "The third paragraph says surface waves come last and are the slowest, but they usually do the most damage to buildings and roads.",
            "第三段说，面波最后到达，速度最慢，但通常对建筑和道路破坏最大。",
          ),
        ),
      ],
    ),
    passage(
      "measuring-an-earthquake",
      t("Measuring an Earthquake", "测量地震"),
      `When an earthquake strikes, people want to know two things at once: how big was it, and where did it happen? To answer these questions, scientists use an instrument called a seismometer. It is so sensitive that it can detect the shaking from an earthquake on the other side of the world. The record it makes, a long line that jumps up and down when the ground moves, is called a seismogram.

To find where an earthquake happened, scientists compare the records of at least three seismometers in different places. Because primary waves travel faster than secondary waves, the gap between their arrival times tells each station how far away the earthquake was. The farther away it is, the longer the gap. Drawing a circle of that distance around each station on a map, scientists find the point where all three circles cross. That point is the epicenter.

The size of an earthquake is described by its magnitude. In 1935, an American scientist named Charles Richter created a scale to compare earthquakes. Today scientists use a newer, more reliable method called the moment magnitude scale, but the idea is similar. Each step up the scale means the ground shook about ten times more, and the earthquake released about thirty-two times more energy. A magnitude 6 earthquake, then, releases about a thousand times as much energy as a magnitude 4.

Magnitude alone does not tell the whole story. An earthquake of magnitude 7 deep under an empty desert may harm no one, while a smaller one under a crowded city can be a disaster. That is why scientists also record how strongly people felt the shaking in each place.`,
      [measureWords, technical, features, academic1, academic3],
      [
        ask(
          t("What is a seismogram?", "地震图（seismogram）是什么？"),
          t("The record a seismometer makes of the ground's movement", "地震仪记录下的地面运动"),
          [
            t("The instrument that detects shaking", "探测震动的仪器"),
            t("The point where three circles cross", "三个圆相交的那个点"),
            t("A scale for the size of an earthquake", "衡量地震大小的标度"),
          ],
          t(
            "The first paragraph says the record a seismometer makes, a line that jumps when the ground moves, is called a seismogram.",
            "第一段说，地震仪记录下的、地面运动时上下跳动的线条叫作地震图。",
          ),
        ),
        ask(
          t("How do scientists find the epicenter?", "科学家是怎样找到震中的？"),
          t("They draw circles around three stations and find where they cross", "他们以三个台站为中心画圆，找出圆的交点"),
          [
            t("They measure the energy with the Richter scale", "他们用里氏震级测量能量"),
            t("They ask people how strongly they felt the shaking", "他们询问人们感受到的震动有多强"),
            t("They look for the deepest crack in the ground", "他们寻找地面上最深的裂缝"),
          ],
          t(
            "The second paragraph explains that each station finds its distance from the gap between wave arrivals, and the point where the three circles cross is the epicenter.",
            "第二段解释说，每个台站根据波到达的时间差算出距离，三个圆的交点就是震中。",
          ),
        ),
        ask(
          t(
            "About how much more energy does a magnitude 6 earthquake release than a magnitude 5?",
            "6 级地震释放的能量大约是 5 级地震的多少倍？",
          ),
          t("About thirty-two times more", "大约 32 倍"),
          [
            t("Exactly the same amount", "完全一样"),
            t("About two times more", "大约 2 倍"),
            t("About a thousand times more", "大约 1000 倍"),
          ],
          t(
            "The third paragraph says each step up the scale means about thirty-two times more energy; a thousand times is the difference of two steps.",
            "第三段说，震级每升高一级，能量约增加 32 倍；1000 倍是相差两级的结果。",
          ),
        ),
      ],
      ["Charles", "Richter", "American"],
    ),
    passage(
      "living-with-a-restless-planet",
      t("Living with a Restless Planet", "与躁动的星球共处"),
      `No one can stop an earthquake or keep a volcano from erupting. But people can learn to live with them more safely. Around the world, scientists, engineers and ordinary families are finding ways to reduce the harm these events cause.

The first defense is good building. Most people who die in earthquakes are not killed by the shaking itself, but by buildings that fall on them. In Japan, which has more earthquakes than almost any other country, strict building rules require new buildings to bend and sway rather than crack. Some tall towers stand on giant rubber pads that soak up the shaking, while others have heavy weights near the top that swing against the motion and keep the building steady.

The second defense is warning. Volcanoes often give signs before they erupt: small earthquakes, rising ground and puffs of gas. Scientists watch these signs with instruments and satellites. When Mount Pinatubo in the Philippines began to stir in 1991, scientists warned the government, and tens of thousands of people were moved away in time. The eruption was one of the largest of the century, but thousands of lives were saved.

Earthquakes give much less warning. Still, some countries now have systems that detect the first, fast waves of an earthquake and send an alert to phones before the stronger shaking arrives. A few seconds may not sound like much, but it is enough to stop a train, open a fire station's doors or take cover under a sturdy table.

The final defense is being prepared. Schools hold drills, families plan where to meet, and emergency kits are packed with water, food and a flashlight. On a restless planet, knowledge is the best protection.`,
      [volcanoWords, plateWords, features, academic2, academic3],
      [
        ask(
          t("According to the passage, what kills most people in earthquakes?", "根据文章，地震中大多数人死于什么？"),
          t("Buildings that fall on them", "倒塌在他们身上的建筑"),
          [
            t("The shaking of the ground itself", "地面震动本身"),
            t("Lava flowing from the cracks", "从裂缝中流出的熔岩"),
            t("Alerts sent to their phones", "发送到他们手机上的警报"),
          ],
          t(
            "The second paragraph says most people who die in earthquakes are not killed by the shaking itself, but by buildings that fall on them.",
            "第二段说，地震中死亡的大多数人不是被震动本身夺去生命，而是被倒塌的建筑砸死。",
          ),
        ),
        ask(
          t("How is the passage organized?", "这篇文章是怎样组织的？"),
          t("It names three defenses and gives a paragraph or more to each", "它提出三种防御方式，并分别用一段或几段来说明"),
          [
            t("It tells the events of one day in time order", "它按时间顺序讲述某一天发生的事"),
            t("It compares two volcanoes point by point", "它逐点比较两座火山"),
            t("It argues for and against moving cities", "它论述赞成和反对搬迁城市的理由"),
          ],
          t(
            "The passage marks its parts with The first defense, The second defense and The final defense, each followed by details and examples.",
            "文章用 The first defense、The second defense 和 The final defense 划分各部分，每部分后面都有细节和例子。",
          ),
        ),
        ask(
          t("What example shows that warnings about volcanoes can save lives?", "哪个例子说明火山预警可以拯救生命？"),
          t("The people moved away before Mount Pinatubo erupted in 1991", "1991 年皮纳图博火山喷发前人们被疏散"),
          [
            t("The rubber pads under towers in Japan", "日本高楼下面的橡胶垫"),
            t("The emergency kits packed by families", "家庭准备的应急包"),
            t("The alerts that stop trains before shaking", "在震动前让火车停下的警报"),
          ],
          t(
            "The third paragraph tells how scientists warned the government about Mount Pinatubo and tens of thousands of people were moved away in time.",
            "第三段讲述了科学家如何就皮纳图博火山向政府发出警告，数万人得以及时撤离。",
          ),
        ),
      ],
      ["Japan", "Pinatubo", "Philippines"],
    ),
  ],
};
