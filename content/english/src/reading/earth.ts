import type { ReadingUnitDef } from "@ga/content";
import { t } from "@ga/content";

import { academic3, clues, cluesAcademic } from "./topics.ts";

/** ourChangingEarth is a reading unit of grades 3 to 5 on rocks, the moving crust and the forces that shape the land. */
export const ourChangingEarth: ReadingUnitDef = {
  id: "our-changing-earth",
  title: t("Our Changing Earth", "变化的地球"),
  passages: [
    {
      id: "inside-the-earth",
      title: t("Inside the Earth", "地球内部"),
      body: `If you could cut the Earth in half like a peach, you would see that it is made of layers.

The outside layer is the crust. It is the rock and soil that we live on, and the ground under the oceans. Compared with the whole Earth, the crust is very thin, like the skin of a peach.

Below the crust is the mantle, the thickest layer. The mantle is made of rock so hot that, over many years, it can slowly bend and flow, a little like very thick toothpaste.

At the center is the core, which is like the stone of the peach. The outer part of the core is melted metal, mostly iron. The inner part is metal too, but it is pressed so hard by everything above it that it stays solid, even though it is as hot as the surface of the sun.

No one has ever dug down to the mantle, let alone the core. The deepest hole people have drilled goes only a small part of the way through the crust. So how do scientists know what is down there? They study the waves that earthquakes send through the planet and use them to infer what the inside is like.`,
      topics: [clues, cluesAcademic, academic3],
      glossed: ["crust", "mantle", "core"],
      xp: 5,
      questions: [
        {
          prompt: t("Why does the writer compare the Earth to a peach?", "作者为什么把地球比作桃子？"),
          right: t("Both have a thin outer layer, a thick middle and a center", "两者都有薄薄的外层、厚厚的中层和中心"),
          wrong: [
            t("Both are soft and sweet", "两者都又软又甜"),
            t("Both grow on trees", "两者都长在树上"),
            t("Both are the same size", "两者大小相同"),
          ],
          solution: t(
            "The crust is like the thin skin, the mantle like the thick fruit, and the core like the stone in the middle.",
            "地壳像薄薄的果皮，地幔像厚厚的果肉，地核像中间的果核。",
          ),
        },
        {
          prompt: t("Why is the inner core solid even though it is very hot?", "内核温度很高，为什么仍是固体？"),
          right: t("It is pressed so hard by everything above it", "它受到上面所有东西的巨大挤压"),
          wrong: [
            t("It is made of ice", "它是冰做的"),
            t("It is cooler than the crust", "它比地壳还凉"),
            t("It is far from the sun", "它离太阳很远"),
          ],
          solution: t(
            "The fourth paragraph says the inner core is pressed so hard by everything above it that it stays solid.",
            "第四段说内核受到上方一切的巨大挤压，所以保持固态。",
          ),
        },
        {
          prompt: t("How do scientists learn about the inside of the Earth?", "科学家怎样了解地球内部？"),
          right: t("By studying waves that earthquakes send through the planet", "研究地震穿过地球的波"),
          wrong: [
            t("By digging down to the core", "一直挖到地核"),
            t("By cutting the Earth in half", "把地球切成两半"),
            t("By looking at peaches", "观察桃子"),
          ],
          solution: t(
            "The last paragraph says no one has dug to the mantle, so scientists study earthquake waves and infer what the inside is like.",
            "最后一段说没有人挖到过地幔，所以科学家研究地震波，从而推断地球内部的样子。",
          ),
        },
      ],
    },
    {
      id: "three-kinds-of-rock",
      title: t("Three Kinds of Rock", "三类岩石"),
      body: `Pick up a rock, and you are holding a piece of the Earth's history. Scientists sort rocks into three groups by the way they were made.

Some rocks begin as melted rock deep underground. When the melted rock cools and hardens, it becomes rock again. Rocks made this way are called igneous rocks. Granite, which is often used for kitchen counters, is one of them. So is the dark, glassy rock that forms when lava from a volcano cools very quickly.

Other rocks are made of layers. Wind and water carry bits of sand, mud and shells and drop them in lakes and seas. Over thousands of years, the layers pile up, and the weight of the top layers presses the lower ones into rock. These are sedimentary rocks. Sandstone is one kind, and you can often see its layers like the pages of a closed book.

The third group are changed rocks. Heat and pressure deep inside the Earth can squeeze an old rock until it turns into a new one. Limestone can become marble this way. Rocks made like this are called metamorphic rocks, from words that mean "change of shape."`,
      topics: [clues],
      glossed: ["igneous", "granite", "lava", "sedimentary", "sandstone", "limestone", "marble", "metamorphic"],
      xp: 5,
      questions: [
        {
          prompt: t("How are igneous rocks made?", "火成岩是怎样形成的？"),
          right: t("Melted rock cools and hardens", "熔化的岩石冷却并变硬"),
          wrong: [
            t("Layers of sand are pressed together", "一层层沙子被压在一起"),
            t("Heat and pressure change an old rock", "高温和压力改变了旧岩石"),
            t("Shells grow into stone", "贝壳长成石头"),
          ],
          solution: t(
            "The second paragraph says rocks made when melted rock cools and hardens are called igneous rocks.",
            "第二段说熔化的岩石冷却变硬形成的岩石叫作火成岩。",
          ),
        },
        {
          prompt: t("Why does the writer compare sandstone to the pages of a closed book?", "作者为什么把砂岩比作合上的书页？"),
          right: t("You can often see its layers", "常常能看到它的一层层"),
          wrong: [t("It has words written on it", "上面写着字"), t("It is very light", "它很轻"), t("It can be opened", "它可以打开")],
          solution: t(
            "The third paragraph says you can often see the layers of sandstone like the pages of a closed book.",
            "第三段说常常能看到砂岩的层，就像合上的书页。",
          ),
        },
        {
          prompt: t("What does the word metamorphic come from?", "metamorphic 这个词来自什么意思？"),
          right: t('Words that mean "change of shape"', "意为“形状改变”的词"),
          wrong: [
            t("The name of a scientist", "一位科学家的名字"),
            t('Words that mean "melted rock"', "意为“熔化的岩石”的词"),
            t('Words that mean "layers of mud"', "意为“一层层泥土”的词"),
          ],
          solution: t(
            'The last sentence says metamorphic comes from words that mean "change of shape."',
            "最后一句说 metamorphic 来自意为“形状改变”的词。",
          ),
        },
      ],
    },
    {
      id: "the-moving-plates",
      title: t("The Moving Plates", "移动的板块"),
      body: `Look at a map of the world, and you may notice something strange. The east coast of South America and the west coast of Africa look as if they could fit together like pieces of a puzzle.

They once did. The Earth's crust is not one solid shell. It is broken into huge pieces called plates, which float on the hot, slowly flowing rock of the mantle below. The plates move about as fast as your fingernails grow, only a few centimeters a year. That seems slow, but over millions of years it adds up to thousands of kilometers.

About two hundred million years ago, all the continents were joined in one giant piece of land. Since then, the plates have carried them apart to where they are today.

Scientists have found evidence for this. The same kinds of fossils of the same ancient animals turn up on both sides of the Atlantic Ocean, and the rocks along the two coasts match.

Where plates meet, a lot happens. They may push together, pull apart or grind past each other. As the next passages show, this is where most mountains, volcanoes and earthquakes occur.`,
      topics: [clues, cluesAcademic, academic3],
      names: ["Africa", "America", "Atlantic"],
      glossed: ["plates", "fossils", "centimeters", "kilometers"],
      xp: 5,
      questions: [
        {
          prompt: t("What are plates?", "什么是板块？"),
          right: t("Huge pieces that the Earth's crust is broken into", "地壳分裂成的巨大碎块"),
          wrong: [t("Dishes for food", "盛食物的盘子"), t("Pieces of a puzzle", "拼图的碎片"), t("Layers inside the core", "地核内部的层")],
          solution: t(
            "The second paragraph says the crust is broken into huge pieces called plates.",
            "第二段说地壳分裂成叫作板块的巨大碎块。",
          ),
        },
        {
          prompt: t("Which evidence shows that the continents were once joined?", "哪项证据表明大陆曾经连在一起？"),
          right: t("The same fossils and matching rocks on both sides of the Atlantic", "大西洋两岸有同样的化石和相匹配的岩石"),
          wrong: [
            t("The plates move as fast as fingernails grow", "板块移动得和指甲生长一样快"),
            t("The mantle flows like toothpaste", "地幔像牙膏一样流动"),
            t("Maps show many oceans", "地图上有许多大洋"),
          ],
          solution: t(
            "The fourth paragraph gives the evidence: the same fossils turn up on both sides of the Atlantic, and the rocks match.",
            "第四段给出了证据：大西洋两岸出现同样的化石，岩石也相匹配。",
          ),
        },
        {
          prompt: t("Why do the plates move such a long way even though they are slow?", "板块移动很慢，为什么却能移动很远？"),
          right: t("They keep moving for millions of years", "它们持续移动了数百万年"),
          wrong: [
            t("They sometimes jump", "它们有时会跳"),
            t("The wind pushes them", "风推动它们"),
            t("They float on the ocean", "它们漂在海洋上"),
          ],
          solution: t(
            "The second paragraph says a few centimeters a year adds up to thousands of kilometers over millions of years.",
            "第二段说每年几厘米，经过数百万年就累积成几千公里。",
          ),
        },
      ],
    },
    {
      id: "volcanoes",
      title: t("Volcanoes", "火山"),
      body: `A volcano is an opening in the Earth's crust where melted rock comes out. Deep underground, the melted rock is called magma. Once it reaches the surface, it is called lava.

Magma is lighter than the solid rock around it, so it slowly rises, collecting in a chamber below the volcano. Magma also holds gases, like the bubbles in a bottle of soda. When enough pressure builds up, the magma bursts out. Some volcanoes explode with great force, throwing ash and rocks high into the sky. Others let lava pour out gently, in glowing rivers that flow down their sides.

Each time lava and ash pile up and harden, the volcano grows taller. Many famous mountains, such as Mount Fuji in Japan, were built this way. The islands of Hawaii are the tops of huge volcanoes that rose from the floor of the Pacific Ocean.

Most volcanoes are found where plates meet. A ring of them circles the Pacific Ocean, and it is called the Ring of Fire.

Volcanoes can be dangerous, but they also make some of the richest soil on Earth, and farmers often grow crops on their slopes.`,
      topics: [clues],
      names: ["Fuji", "Japan", "Hawaii", "Pacific"],
      glossed: ["magma", "chamber", "ash"],
      xp: 5,
      questions: [
        {
          prompt: t("What is the difference between magma and lava?", "岩浆（magma）和熔岩（lava）有什么区别？"),
          right: t("Magma is underground; lava has reached the surface", "magma 在地下，lava 已到达地面"),
          wrong: [
            t("Magma is cold; lava is hot", "magma 是冷的，lava 是热的"),
            t("Magma is rock; lava is water", "magma 是岩石，lava 是水"),
            t("Lava is underground; magma has reached the surface", "lava 在地下，magma 已到达地面"),
          ],
          solution: t(
            "The first paragraph says melted rock is called magma underground and lava once it reaches the surface.",
            "第一段说熔化的岩石在地下叫 magma，到达地面后叫 lava。",
          ),
        },
        {
          prompt: t("Why does the writer compare magma to soda?", "作者为什么把岩浆比作汽水？"),
          right: t("Both hold gases that can burst out under pressure", "两者都含有气体，压力大时会喷出"),
          wrong: [t("Both are sweet", "两者都是甜的"), t("Both are cold", "两者都是冷的"), t("Both come in bottles", "两者都装在瓶子里")],
          solution: t(
            "The second paragraph says magma holds gases like the bubbles in soda, and it bursts out when pressure builds up.",
            "第二段说岩浆像汽水里的气泡一样含有气体，压力积聚时就会喷出。",
          ),
        },
        {
          prompt: t("What good thing do volcanoes do, according to the passage?", "根据文章，火山有什么好处？"),
          right: t("They make very rich soil", "它们造就非常肥沃的土壤"),
          wrong: [
            t("They stop earthquakes", "它们阻止地震"),
            t("They cool the Earth", "它们让地球变凉"),
            t("They make the plates stop moving", "它们让板块停止移动"),
          ],
          solution: t(
            "The last paragraph says volcanoes make some of the richest soil on Earth.",
            "最后一段说火山造就了地球上一些最肥沃的土壤。",
          ),
        },
      ],
    },
    {
      id: "earthquakes",
      title: t("Earthquakes", "地震"),
      body: `Most of the time, the ground under your feet feels perfectly still. But in some places, it can suddenly start to shake. This is an earthquake.

Earthquakes usually occur where two plates grind past each other. The edges of the plates are rough, so instead of sliding smoothly, they get stuck. The plates keep pushing, and pressure builds up for years. At last the rock gives way and the plates jump forward all at once. The energy that was stored races out through the ground in waves, like the ripples when you drop a stone into a pond.

Most earthquakes are too small for people to feel. Scientists record them with sensitive instruments called seismographs, which draw a wavy line on paper or a screen. The bigger the earthquake, the taller the waves on the line. A strong earthquake can crack roads and knock down buildings.

No one can say yet exactly when an earthquake will strike. But scientists collect data about where they happen most often, and engineers use this information to design buildings that can bend and sway without falling down. In places such as Japan, children practice what to do: drop to the floor, take cover under a strong table and hold on.`,
      topics: [clues, academic3],
      names: ["Japan"],
      glossed: ["seismographs", "engineers", "sway"],
      xp: 5,
      questions: [
        {
          prompt: t("Why does pressure build up where plates meet?", "为什么板块相接的地方会积聚压力？"),
          right: t("The rough edges get stuck while the plates keep pushing", "粗糙的边缘卡住了，而板块仍在推挤"),
          wrong: [
            t("The plates are melting", "板块正在熔化"),
            t("Water fills the cracks", "水填满了裂缝"),
            t("The ground is perfectly still", "地面完全静止"),
          ],
          solution: t(
            "The second paragraph says the rough edges get stuck, the plates keep pushing, and pressure builds up for years.",
            "第二段说粗糙的边缘卡住了，板块继续推挤，压力积聚多年。",
          ),
        },
        {
          prompt: t("What does a seismograph do?", "地震仪有什么作用？"),
          right: t("It records earthquakes as a wavy line", "它用波浪线记录地震"),
          wrong: [
            t("It stops earthquakes", "它阻止地震"),
            t("It says exactly when an earthquake will strike", "它准确说出地震何时发生"),
            t("It builds strong buildings", "它建造坚固的建筑"),
          ],
          solution: t(
            "The third paragraph says seismographs record earthquakes by drawing a wavy line.",
            "第三段说地震仪通过画波浪线来记录地震。",
          ),
        },
        {
          prompt: t("How does data about earthquakes help people?", "地震数据怎样帮助人们？"),
          right: t("Engineers use it to design buildings that bend without falling", "工程师用它设计能弯曲而不倒塌的建筑"),
          wrong: [
            t("It tells people the exact day of the next earthquake", "它告诉人们下一次地震的确切日期"),
            t("It makes the plates stop", "它让板块停止移动"),
            t("It makes earthquakes smaller", "它让地震变小"),
          ],
          solution: t(
            "The last paragraph says no one can yet say exactly when an earthquake will strike, but engineers use the data to design buildings that bend and sway.",
            "最后一段说还没有人能准确说出地震何时发生，但工程师利用这些数据设计能弯曲摇摆的建筑。",
          ),
        },
      ],
    },
    {
      id: "how-mountains-form",
      title: t("How Mountains Form", "山是怎样形成的"),
      body: `Put two rugs on a smooth floor and push them toward each other. Where they meet, the rugs fold and rise up. Something like this happens when two plates of the Earth push together, only much more slowly and with solid rock.

When plates collide, the crust has nowhere to go but up. Over millions of years, the rock is folded, crumpled and pushed higher and higher. The Himalayas, which include Mount Everest, the tallest mountain in the world, formed this way. The plate carrying India has been pushing into the rest of Asia for about fifty million years, and it is still pushing. The Himalayas grow taller by a few millimeters every year.

Not all mountains form like this. Some, as you have read, are volcanoes built up by lava and ash. Others form where the crust cracks into giant blocks, and some blocks are lifted up while others drop down.

Climbers on Mount Everest have found fossils of sea animals near the top. These shells give a clue to the mountain's history: the rock at the top of the world was once at the bottom of a sea.`,
      topics: [clues],
      names: ["Himalayas", "Everest", "India", "Asia"],
      glossed: ["collide", "crumpled", "millimeters"],
      xp: 5,
      questions: [
        {
          prompt: t("Why does the writer describe pushing two rugs together?", "作者为什么描述把两块地毯推到一起？"),
          right: t("To show how rock folds and rises when plates push together", "说明板块相互挤压时岩石怎样褶皱隆起"),
          wrong: [
            t("To explain how to clean a floor", "说明怎样清洁地板"),
            t("To show that mountains are soft", "说明山是软的"),
            t("To explain why rugs are useful", "说明地毯为什么有用"),
          ],
          solution: t(
            "The rugs fold and rise where they meet, just as the crust folds and rises when two plates push together.",
            "地毯相接处会褶皱隆起，就像两个板块相互挤压时地壳褶皱隆起一样。",
          ),
        },
        {
          prompt: t("How did the Himalayas form?", "喜马拉雅山脉是怎样形成的？"),
          right: t("The plate carrying India pushed into the rest of Asia", "载着印度的板块挤向亚洲其余部分"),
          wrong: [
            t("A volcano poured out lava", "火山喷出了熔岩"),
            t("The crust cracked into blocks", "地壳裂成了块"),
            t("The wind piled up sand", "风堆起了沙子"),
          ],
          solution: t(
            "The second paragraph says the Himalayas formed as the plate carrying India pushed into the rest of Asia.",
            "第二段说喜马拉雅山脉是载着印度的板块挤向亚洲其余部分而形成的。",
          ),
        },
        {
          prompt: t("What do the fossils of sea animals near the top of Everest show?", "珠穆朗玛峰顶附近的海洋动物化石说明了什么？"),
          right: t("The rock at the top was once at the bottom of a sea", "峰顶的岩石曾经位于海底"),
          wrong: [
            t("Sea animals climbed the mountain", "海洋动物爬上了山"),
            t("Climbers left shells there", "登山者把贝壳留在那里"),
            t("The sea is on top of the mountain", "海在山顶上"),
          ],
          solution: t(
            "The last paragraph says the shells show that the rock at the top of the world was once at the bottom of a sea.",
            "最后一段说这些贝壳表明世界之巅的岩石曾经在海底。",
          ),
        },
      ],
    },
    {
      id: "weathering-and-erosion",
      title: t("Weathering and Erosion", "风化和侵蚀"),
      body: `Mountains may look as if they will last forever, but they are slowly being worn away.

The breaking down of rock into smaller pieces is called weathering. Water is one of its strongest tools. Rain seeps into cracks in rocks. When the water freezes, it expands and pushes the crack wider. After it has frozen and melted many times, the rock splits apart. Plant roots can do the same as they grow into cracks. Even the gentle rain slowly dissolves some kinds of rock, such as limestone.

Once the rock is broken into pieces, it is carried away. This moving of rock and soil from one place to another is called erosion. Rivers carry sand and pebbles downstream. Waves pound the coast and carry away the beach. In deserts, wind blows sand against rocks and carves them into strange shapes. In cold places, glaciers scrape the land as they slide and drag rocks along with them.

Over a long time, weathering and erosion can wear a mountain down to a hill. The Grand Canyon, more than a kilometer deep, was carved by the Colorado River, which has been cutting through the rock for millions of years.`,
      topics: [clues],
      names: ["Grand", "Canyon", "Colorado"],
      glossed: ["weathering", "dissolves", "erosion", "pebbles", "downstream", "kilometer"],
      xp: 5,
      questions: [
        {
          prompt: t("What is the difference between weathering and erosion?", "风化和侵蚀有什么区别？"),
          right: t("Weathering breaks rock down; erosion carries the pieces away", "风化把岩石分解，侵蚀把碎块搬走"),
          wrong: [
            t("Erosion breaks rock down; weathering carries the pieces away", "侵蚀把岩石分解，风化把碎块搬走"),
            t("Weathering happens only in deserts; erosion happens only in rivers", "风化只发生在沙漠，侵蚀只发生在河里"),
            t("They are two words for building mountains", "它们是造山的两种说法"),
          ],
          solution: t(
            "The second paragraph defines weathering as breaking rock down, and the third defines erosion as moving the pieces from place to place.",
            "第二段把风化定义为把岩石分解，第三段把侵蚀定义为把碎块从一处搬到另一处。",
          ),
        },
        {
          prompt: t("How does freezing water split a rock?", "结冰的水怎样使岩石裂开？"),
          right: t("It expands in a crack and pushes it wider", "它在裂缝里膨胀，把裂缝撑大"),
          wrong: [
            t("It makes the rock melt", "它让岩石熔化"),
            t("It glues the pieces together", "它把碎块粘在一起"),
            t("It pulls the rock into the ground", "它把岩石拉进地下"),
          ],
          solution: t(
            "The second paragraph says water in a crack expands when it freezes and pushes the crack wider.",
            "第二段说裂缝里的水结冰时膨胀，把裂缝撑大。",
          ),
        },
        {
          prompt: t("What carved the Grand Canyon?", "是什么切割出了大峡谷？"),
          right: t("The Colorado River, over millions of years", "科罗拉多河，经过数百万年"),
          wrong: [
            t("A glacier, in one winter", "冰川，在一个冬天里"),
            t("Wind blowing sand, in a few years", "风吹沙子，在几年里"),
            t("An earthquake, in one day", "地震，在一天之内"),
          ],
          solution: t(
            "The last paragraph says the Colorado River has been cutting through the rock for millions of years.",
            "最后一段说科罗拉多河已经切割岩石数百万年了。",
          ),
        },
      ],
    },
    {
      id: "fossils",
      title: t("Fossils", "化石"),
      body: `A fossil is what remains of a living thing from long ago, kept in rock. It may be a bone, a shell, a leaf or even a footprint.

Most living things never become fossils. When an animal dies, it is usually eaten or rots away. But sometimes an animal dies in a place where it is quickly covered by mud or sand, such as the bottom of a lake. Over thousands of years, more layers pile on top, and the mud slowly hardens into rock. Water seeping through the rock carries minerals into the bones or shell, and the minerals harden too. In the end, the shape of the animal is kept in stone.

Fossils are found mostly in sedimentary rock, the kind made of layers. This is a useful fact for scientists. The deeper layers were laid down first, so fossils in the deeper layers are usually older than fossils in the layers above them.

By studying fossils, scientists can tell what living things were like long ago. We know about dinosaurs only from their fossils, since no person ever saw one alive. Fossils also show how plants and animals have changed over time, and how the land itself has changed.`,
      topics: [clues],
      glossed: ["minerals", "dinosaurs"],
      xp: 5,
      questions: [
        {
          prompt: t("Why do most living things never become fossils?", "为什么大多数生物不会变成化石？"),
          right: t("They are eaten or rot away before they are covered", "它们在被掩埋之前就被吃掉或腐烂了"),
          wrong: [
            t("They are too small", "它们太小了"),
            t("They live in lakes", "它们生活在湖里"),
            t("They are made of stone", "它们是石头做的"),
          ],
          solution: t(
            "The second paragraph says a dead animal is usually eaten or rots away; only one covered quickly by mud or sand may become a fossil.",
            "第二段说动物死后通常会被吃掉或腐烂，只有迅速被泥沙掩埋的才可能变成化石。",
          ),
        },
        {
          prompt: t("Why are fossils in deeper layers usually older?", "为什么较深地层里的化石通常更古老？"),
          right: t("The deeper layers were laid down first", "较深的地层先形成"),
          wrong: [
            t("Older animals were heavier", "古老的动物更重"),
            t("Fossils sink over time", "化石会随时间下沉"),
            t("Deeper layers are softer", "较深的地层更软"),
          ],
          solution: t(
            "The third paragraph says the deeper layers were laid down first, so their fossils are usually older.",
            "第三段说较深的地层先形成，所以其中的化石通常更古老。",
          ),
        },
        {
          prompt: t("How do we know about dinosaurs?", "我们怎么知道恐龙的？"),
          right: t("Only from their fossils", "只能通过它们的化石"),
          wrong: [
            t("From people who saw them alive", "从见过活恐龙的人那里"),
            t("From pictures drawn long ago", "从很久以前画的图里"),
            t("From dinosaurs living today", "从现在还活着的恐龙身上"),
          ],
          solution: t(
            "The last paragraph says we know about dinosaurs only from their fossils, since no person ever saw one alive.",
            "最后一段说我们只能通过化石了解恐龙，因为没有人见过活的恐龙。",
          ),
        },
      ],
    },
    {
      id: "soil",
      title: t("The Story of Soil", "土壤的故事"),
      body: `Soil is so common that people often call it dirt. Yet almost all the food we eat depends on it.

Soil begins with rock. Over hundreds of years, weathering breaks rock into tiny pieces of sand, silt and clay. Sand grains are the largest; you can feel them between your fingers. Clay pieces are so small that wet clay feels smooth and sticky.

But crushed rock alone is not soil. Soil also needs humus, the dark material made from dead leaves, roots and animals. Worms, insects and tiny living things break these down and mix them into the ground. Humus holds water and gives plants the nutrients they require to grow.

Good soil has air and water in the spaces between its pieces. Earthworms help by digging tunnels that let air and water in.

Making soil takes a very long time. It can take hundreds of years to make just a few centimeters. Yet soil can be lost quickly. When forests are cut down or fields are left bare, wind and rain can carry the soil away. Farmers protect it by planting trees as windbreaks and by keeping the ground covered with plants.`,
      topics: [clues, academic3],
      glossed: ["silt", "clay", "humus", "nutrients", "earthworms", "windbreaks"],
      xp: 5,
      questions: [
        {
          prompt: t("What is humus?", "腐殖质是什么？"),
          right: t("Dark material made from dead leaves, roots and animals", "由枯叶、根和动物遗体形成的深色物质"),
          wrong: [
            t("The smallest pieces of rock", "最小的岩石碎屑"),
            t("A kind of worm", "一种蠕虫"),
            t("Water between pieces of soil", "土壤颗粒之间的水"),
          ],
          solution: t(
            "The third paragraph says humus is the dark material made from dead leaves, roots and animals.",
            "第三段说腐殖质是由枯叶、根和动物遗体形成的深色物质。",
          ),
        },
        {
          prompt: t("Which piece of soil is the largest?", "土壤中哪种颗粒最大？"),
          right: t("Sand", "沙"),
          wrong: [t("Clay", "黏土"), t("Silt", "粉砂"), t("Humus", "腐殖质")],
          solution: t(
            "The second paragraph says sand grains are the largest, and clay pieces are very small.",
            "第二段说沙粒最大，黏土颗粒非常小。",
          ),
        },
        {
          prompt: t("Why must soil be protected?", "为什么必须保护土壤？"),
          right: t("It takes hundreds of years to make but can be lost quickly", "它需要几百年才能形成，却会很快流失"),
          wrong: [
            t("It is made of gold", "它是金子做的"),
            t("Worms eat it all", "蠕虫会把它吃光"),
            t("It turns back into rock each year", "它每年都会变回岩石"),
          ],
          solution: t(
            "The last paragraph says soil takes a very long time to make, yet wind and rain can carry it away quickly.",
            "最后一段说土壤形成需要很长时间，风雨却能很快把它带走。",
          ),
        },
      ],
    },
    {
      id: "studying-the-earth",
      title: t("How Scientists Study the Earth", "科学家怎样研究地球"),
      body: `The scientists who study rocks, mountains, volcanoes and earthquakes are called geologists. Their work is a little like detective work, since most of what they want to know happened long ago or deep underground, where no one can see it.

Geologists use many methods. In the field, they collect rocks and look closely at the layers in cliffs and canyons. Each layer is a clue, and reading the layers from bottom to top is like reading a history book from its first page to its last.

Back in the lab, they study the rocks under microscopes and test what minerals are in them. Instruments near volcanoes measure small changes in the ground and in the gases coming out, which can warn that an eruption may occur soon.

Today, satellites help too. From space, they can measure how far the plates move each year and take pictures that show how coasts and rivers change.

Geologists often survey a whole area, making maps of the rocks that lie under the soil. Builders use these maps to choose safe places for roads and bridges. Collecting data and interpreting it carefully helps people live safely on a planet that never stops changing.`,
      topics: [clues, academic3],
      glossed: ["geologists", "detective", "lab", "eruption"],
      xp: 5,
      questions: [
        {
          prompt: t("Why is the work of geologists compared to detective work?", "为什么把地质学家的工作比作侦探工作？"),
          right: t("They use clues to work out things no one can see", "他们根据线索推断出没人能看到的事情"),
          wrong: [
            t("They catch people who break rocks", "他们抓捕破坏岩石的人"),
            t("They work only at night", "他们只在晚上工作"),
            t("They write history books", "他们写历史书"),
          ],
          solution: t(
            "The first paragraph says most of what geologists want to know happened long ago or deep underground, so they work from clues like detectives.",
            "第一段说地质学家想了解的大多发生在很久以前或地下深处，所以他们像侦探一样根据线索工作。",
          ),
        },
        {
          prompt: t("How can instruments near volcanoes help people?", "火山附近的仪器怎样帮助人们？"),
          right: t("They can warn that an eruption may occur soon", "它们能预警火山可能即将喷发"),
          wrong: [
            t("They can stop an eruption", "它们能阻止火山喷发"),
            t("They make maps from space", "它们从太空绘制地图"),
            t("They test minerals under microscopes", "它们在显微镜下检测矿物"),
          ],
          solution: t(
            "The third paragraph says instruments measure changes in the ground and gases, which can warn that an eruption may occur soon.",
            "第三段说仪器测量地面和气体的变化，可以预警火山即将喷发。",
          ),
        },
        {
          prompt: t("What do builders use geologists' maps for?", "建筑者用地质学家的地图做什么？"),
          right: t("To choose safe places for roads and bridges", "为道路和桥梁选择安全的位置"),
          wrong: [
            t("To find dinosaurs", "寻找恐龙"),
            t("To measure how fast plates move", "测量板块移动的速度"),
            t("To grow crops", "种植庄稼"),
          ],
          solution: t(
            "The last paragraph says builders use these maps to choose safe places for roads and bridges.",
            "最后一段说建筑者用这些地图为道路和桥梁选择安全的位置。",
          ),
        },
      ],
    },
  ],
};
