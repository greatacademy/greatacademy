// Grade 5: the reading unit of the seventh theme, bridges, towers and domes, and the forces their builders must
// balance.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "./reading-kit.ts";

const buildingWords = { topic: "words-of-building-and-engineering", weight: 0.3 } as const;
const forceWords = { topic: "words-of-forces-on-structures", weight: 0.3 } as const;
const planningWords = { topic: "words-for-planning-and-solving", weight: 0.3 } as const;
const cityWords = { topic: "words-of-cities", weight: 0.3 } as const;
const comparisons = { topic: "comparisons-that-explain", weight: 0.2 } as const;
const points = { topic: "matching-points-and-evidence", weight: 0.2 } as const;
const structures = { topic: "comparing-structures-of-two-texts", weight: 0.2 } as const;

/** bridgesTowersAndDomes is a reading unit of grade 5 on how great structures stand up and why some fall. */
export const bridgesTowersAndDomes: ReadingUnitDef = {
  id: "bridges-towers-and-domes",
  title: t("Bridges, Towers and Domes", "桥梁、高塔与穹顶"),
  passages: [
    passage(
      "why-bridges-stand",
      t("Why Bridges Stand", "桥为什么能立住"),
      `Lay a sheet of paper across two books and put a coin in the middle. The paper sags and the coin falls. Now fold the same sheet back and forth into a fan and try again. This time, the paper holds the coin, and perhaps several more. The paper has not changed, but its shape has.

Every bridge has to deal with two kinds of forces. Compression is a pushing force that squeezes material together. Tension is a pulling force that stretches material apart. When a load such as a truck crosses a simple beam bridge, the top of the beam is squeezed while the bottom is stretched.

Different materials handle these forces in different ways. Stone and concrete are very strong in compression; you can pile great weights on them. But they crack easily when they are pulled. Steel is strong in both compression and tension, which is why most modern bridges use it.

Engineers choose the shape of a bridge to send the forces where the materials can best handle them. An arch turns the weight into compression. A suspension bridge hangs the road from cables in tension.

So the secret of a bridge is not only what it is made of, but how it is shaped.`,
      [forceWords, points],
      [
        ask(
          t("What does the experiment with the folded paper show?", "折纸实验说明了什么？"),
          t("Shape can make the same material much stronger", "形状能让同样的材料坚固得多"),
          [
            t("Paper is stronger than any metal", "纸比任何金属都结实"),
            t("Coins are too heavy for bridges", "硬币对桥来说太重了"),
            t("Books make the best supports", "书是最好的支撑物"),
          ],
          t(
            "The paper did not change, but its shape did, and the folded shape held the coin. The last sentence states this main point.",
            "纸没有变，变的是形状，折过的形状托住了硬币。最后一句说明了这个要点。",
          ),
        ),
        ask(
          t("What is tension?", "什么是拉力？"),
          t("A pulling force that stretches material apart", "把材料向两边拉伸的力"),
          [
            t("A pushing force that squeezes material together", "把材料挤压在一起的推力"),
            t("The weight of a truck on a bridge", "卡车压在桥上的重量"),
            t("The shape of a folded fan", "折扇的形状"),
          ],
          t(
            "The second paragraph defines tension as a pulling force that stretches material apart. Squeezing is compression.",
            "第二段把 tension 定义为把材料拉开的拉力。挤压是 compression。",
          ),
        ),
        ask(
          t("Why do most modern bridges use steel?", "为什么大多数现代桥梁使用钢材？"),
          t("Steel is strong in both compression and tension", "钢在受压和受拉时都很坚固"),
          [
            t("Steel never cracks when it is squeezed", "钢被挤压时从不开裂"),
            t("Steel is lighter than paper", "钢比纸还轻"),
            t("Steel is the cheapest material there is", "钢是最便宜的材料"),
          ],
          t(
            "The third paragraph says stone and concrete crack when pulled, but steel is strong in both compression and tension.",
            "第三段说，石头和混凝土被拉时会开裂，而钢在受压和受拉时都很坚固。",
          ),
        ),
      ],
    ),
    passage(
      "the-strength-of-an-arch",
      t("The Strength of an Arch", "拱的力量"),
      `Try to crush a raw egg by squeezing it from end to end in your hand. It is surprisingly hard to do. The egg's curved shell spreads the push all around itself, so no single spot takes all the force. An arch works in the same way.

An arch is a curved structure that spans an opening. When weight presses down on top of an arch, the curve carries the force outward and down along both sides to the ground. Every stone in the arch is squeezed against its neighbors, and that squeezing is exactly what holds the arch together.

The stones of an arch cannot stand on their own while it is being built. Builders first make a wooden frame in the shape of the curve and lay the stones on it. The last stone to go in is the keystone, at the very top. Once the keystone is in place, the frame can be taken away, and the arch stands by itself.

There is one danger. As the arch pushes outward, its feet can slide apart. So builders brace the ends against solid rock or heavy walls.

The ancient Romans built arches so well that some of their arched bridges still carry traffic after 2,000 years.`,
      [forceWords, comparisons],
      [
        ask(
          t("What does the comparison to an egg help explain?", "用鸡蛋作比较帮助说明了什么？"),
          t("A curved shape spreads a force so no spot takes it all", "弯曲的形状把力分散开，没有哪一点承受全部的力"),
          [
            t("Arches break as easily as eggs do", "拱和蛋一样容易碎"),
            t("Builders used eggs to hold stones together", "建筑工人用鸡蛋把石头粘在一起"),
            t("Arches are always the shape of an egg", "拱总是蛋的形状"),
          ],
          t(
            "The first paragraph says the egg's curved shell spreads the push around, and that an arch works in the same way.",
            "第一段说，蛋的弯曲外壳把压力分散开，而拱的原理也一样。",
          ),
        ),
        ask(
          t("When can the wooden frame be taken away?", "什么时候可以拆掉木架？"),
          t("Once the keystone is in place at the top", "顶部的拱心石一放好就可以"),
          [
            t("Before the first stone is laid", "在放第一块石头之前"),
            t("As soon as half the stones are laid", "石头一放好一半就可以"),
            t("Only after the feet have slid apart", "只能在拱脚滑开之后"),
          ],
          t(
            "The third paragraph says the keystone goes in last, and once it is in place the frame can be taken away.",
            "第三段说，拱心石最后放入，一旦放好，木架就可以拆掉了。",
          ),
        ),
        ask(
          t("Why do builders brace the ends of an arch?", "建造者为什么要加固拱的两端？"),
          t("The arch pushes outward, and its feet could slide apart", "拱向外推，拱脚可能会滑开"),
          [
            t("The keystone might fall out of the top", "拱心石可能会从顶上掉下来"),
            t("Rain would wash the stones away", "雨水会把石头冲走"),
            t("The arch pulls its ends toward the middle", "拱会把两端拉向中间"),
          ],
          t(
            "The fourth paragraph names the danger: as the arch pushes outward, its feet can slide apart, so the ends are braced.",
            "第四段指出了危险：拱向外推时，拱脚可能滑开，所以要加固两端。",
          ),
        ),
      ],
    ),
    passage(
      "domes-that-cover-a-crowd",
      t("Domes That Cover a Crowd", "容纳众人的穹顶"),
      `Imagine an arch, and then imagine spinning it around in a full circle. The shape it would trace is a dome. Because a dome is like many arches joined at the top, it can cover a huge open space without a single column in the middle.

Nearly 1,900 years ago, the Romans built the Pantheon in Rome. Its concrete dome is more than 43 meters across, and it is still the largest dome of unreinforced concrete in the world. The Roman builders used a clever trick: they made the concrete heavier near the bottom, mixing it with heavy stone, and lighter near the top, mixing it with light volcanic rock. At the very top they left a round opening, the oculus, which lets in sunlight and rain and removes weight where the dome is weakest.

About 600 years ago in Florence, Italy, a builder named Filippo Brunelleschi faced a problem no one had solved: how to build a dome too wide for any wooden frame. His answer was to build two shells, one inside the other, and to lay the bricks in a spiraling pattern so that each ring held itself up as it rose.

Today, domes cover sports stadiums, train stations and museums, sheltering thousands of people at once.`,
      [buildingWords, planningWords],
      [
        ask(
          t("Why can a dome cover a large space with no column in the middle?", "穹顶为什么能覆盖很大的空间而中间不用柱子？"),
          t("It works like many arches joined at the top", "它像许多在顶部相连的拱"),
          [
            t("It is held up by cables from the sky", "它被空中的缆索吊着"),
            t("It is made from light volcanic rock only", "它只用轻质火山岩建成"),
            t("It has an opening that lets in sunlight", "它有一个让阳光照进来的开口"),
          ],
          t(
            "The first paragraph explains that a dome is like many arches joined at the top, so it needs no column in the middle.",
            "第一段解释说，穹顶就像许多在顶部相连的拱，所以中间不需要柱子。",
          ),
        ),
        ask(
          t("Why did the Romans use lighter rock near the top of the Pantheon's dome?", "罗马人为什么在万神殿穹顶的上部使用较轻的石料？"),
          t("To reduce the weight where the dome is weakest", "减轻穹顶最薄弱处的重量"),
          [
            t("Heavy rock was too hard to carry up", "重石太难运上去"),
            t("Light rock let more sunlight through", "轻石能透过更多阳光"),
            t("Light rock kept the rain out of the dome", "轻石能挡住雨水"),
          ],
          t(
            "The second paragraph says the concrete was lighter near the top, and the oculus removes weight where the dome is weakest.",
            "第二段说，上部的混凝土较轻，顶部的圆孔也去掉了穹顶最薄弱处的重量。",
          ),
        ),
        ask(
          t("What problem did Brunelleschi solve?", "布鲁内莱斯基解决了什么问题？"),
          t("Building a dome too wide for a wooden frame", "建造一个宽得没法用木架支撑的穹顶"),
          [
            t("Making concrete that never cracks", "制造永不开裂的混凝土"),
            t("Keeping rain out of the oculus", "让雨水不从圆孔进来"),
            t("Building a dome for a sports stadium", "为体育场建穹顶"),
          ],
          t(
            "The third paragraph states the problem: how to build a dome too wide for any wooden frame. Two shells and spiraling bricks were his answer.",
            "第三段说明了这个问题：怎样建造一个宽得任何木架都撑不住的穹顶。双层外壳和螺旋砌砖是他的办法。",
          ),
        ),
      ],
    ),
    passage(
      "a-stone-bridge-1400-years-old",
      t("A Stone Bridge 1,400 Years Old", "一座一千四百年的石桥"),
      `In Hebei Province in northern China, a stone bridge crosses the Xiao River. It is called the Zhaozhou Bridge, and it was built around the year 600 by a craftsman named Li Chun. It has stood through floods, wars and at least eight major earthquakes, and it is the oldest stone arch bridge in China that is still standing.

Most stone arch bridges of that time were tall half-circles. To span a river, they needed high, steep roads and thick piers standing in the water. Li Chun had a better idea. He built one long, shallow arch, about 37 meters across but only about 7 meters high. The flatter curve made the bridge easier for carts to climb.

His second idea was even more clever. Above each end of the main arch, he built two small open arches. These openings made the bridge lighter by hundreds of tons, saved stone and, during floods, let water rush through instead of pushing against a solid wall.

In Europe, builders did not use open arches like these until many centuries later.

Today, the Zhaozhou Bridge is closed to traffic to protect it, but visitors can still walk beside it and admire the work of a builder who solved problems no one else had.`,
      [buildingWords, planningWords],
      [
        ask(
          t("Why did Li Chun build a long, shallow arch?", "李春为什么建了一个又长又平缓的拱？"),
          t("A flatter curve was easier for carts to climb", "较平的弧度让车更容易爬上去"),
          [
            t("A flatter curve needed more piers in the water", "较平的弧度需要更多桥墩"),
            t("He had too little stone for a half-circle", "他的石头不够建半圆"),
            t("The river was too shallow for boats", "河水太浅，船过不去"),
          ],
          t(
            "The second paragraph contrasts tall half-circle bridges with steep roads; the flatter curve made the bridge easier for carts to climb.",
            "第二段对比了路面陡峭的高半圆拱桥；较平的弧度让车更容易上桥。",
          ),
        ),
        ask(
          t("Which is NOT a benefit of the small open arches?", "下面哪一项不是小拱的好处？"),
          t("They made the bridge tall enough for ships", "它们让桥高得能通过大船"),
          [
            t("They made the bridge lighter", "它们让桥更轻"),
            t("They saved stone", "它们节省了石料"),
            t("They let floodwater rush through", "它们让洪水能冲过去"),
          ],
          t(
            "The third paragraph lists three benefits: lighter, less stone, and a path for floodwater. It says nothing about ships.",
            "第三段列出了三个好处：更轻、省石料、给洪水留出通道。文中没有提到船。",
          ),
        ),
        ask(
          t("Which detail best supports the idea that the bridge is very strong?", "哪个细节最能支持这座桥非常坚固的观点？"),
          t("It has survived at least eight major earthquakes", "它经受住了至少八次大地震"),
          [
            t("It was built by a craftsman named Li Chun", "它是一位名叫李春的工匠建造的"),
            t("It is closed to traffic today", "它现在禁止车辆通行"),
            t("It crosses the Xiao River in Hebei", "它横跨河北的洨河"),
          ],
          t(
            "Standing through floods, wars and eight major earthquakes is evidence of strength. The other details are facts about the bridge that do not show it.",
            "历经洪水、战争和八次大地震仍然屹立，这是坚固的证据。其他细节是关于桥的事实，并不能说明这一点。",
          ),
        ),
      ],
    ),
    passage(
      "building-upward",
      t("Building Upward", "向高处建造"),
      `For thousands of years, the tallest buildings in the world had thick stone or brick walls. The walls held up all the weight, so the taller a building was, the thicker its lower walls had to be. In the 1880s, one sixteen-story building in Chicago had walls nearly two meters thick at the bottom. Building much higher in this way would have left almost no room inside.

Two inventions changed everything. The first was the steel frame. Instead of relying on the walls, builders made a skeleton of steel beams and columns that carried the weight down to the ground. The outer walls became a light skin hung on the frame, and windows could be as large as builders wished. The second was the safe passenger elevator. Without it, no one would want to climb to the twentieth floor.

With these two inventions, cities began to grow upward. As land in crowded city centers became more and more expensive, building higher let more people work and live on the same small piece of ground.

Tall towers face a special force: wind. Near the top, strong winds push hard against the building and can make it sway. Some skyscrapers have huge weights hanging near their tops that swing against the motion and keep the building steady.`,
      [cityWords, structures],
      [
        ask(
          t("What was the problem with building very tall brick buildings?", "建造很高的砖楼有什么问题？"),
          t("The lower walls had to be so thick there was little room inside", "底层墙壁必须很厚，里面几乎没有空间"),
          [
            t("Bricks were too light to stay in place", "砖太轻，放不稳"),
            t("Brick buildings could not have any windows", "砖楼不能开任何窗户"),
            t("No one could find enough land for them", "没人能找到足够的地来建"),
          ],
          t(
            "The first paragraph says the taller the building, the thicker the lower walls had to be, which left almost no room inside.",
            "第一段说，楼越高，底层墙壁就得越厚，结果里面几乎没有空间。",
          ),
        ),
        ask(
          t("How is the passage mainly organized?", "这篇文章主要是怎样组织的？"),
          t("A problem, then the inventions that solved it", "先提出问题，再讲解决它的发明"),
          [
            t("A list of the tallest towers in order of height", "按高度排列的最高建筑清单"),
            t("A story told by a builder in Chicago", "芝加哥一位建筑工人讲的故事"),
            t("A comparison of two cities in the same year", "同一年两座城市的比较"),
          ],
          t(
            'The first paragraph describes the problem of thick walls, and the second begins "Two inventions changed everything," giving the solutions.',
            '第一段描述了墙太厚的问题，第二段以 "Two inventions changed everything" 开头，给出了解决办法。',
          ),
        ),
        ask(
          t("What do the huge weights near the top of some skyscrapers do?", "一些摩天大楼顶部附近的巨大重物有什么作用？"),
          t("They swing against the motion and keep the building steady", "它们逆着晃动摆动，让大楼保持稳定"),
          [
            t("They hold the outer walls onto the frame", "它们把外墙固定在框架上"),
            t("They carry people up to the top floors", "它们把人送到顶层"),
            t("They push the building down into the ground", "它们把大楼压进地里"),
          ],
          t(
            "The last paragraph says the weights swing against the motion caused by wind and keep the building steady.",
            "最后一段说，这些重物逆着风引起的晃动摆动，让大楼保持稳定。",
          ),
        ),
      ],
    ),
    passage(
      "bridges-that-hang",
      t("Bridges That Hang", "悬挂的桥"),
      `When a river or a bay is too wide for an arch or a beam, engineers often build a suspension bridge. In a suspension bridge, the road does not rest on supports underneath. It hangs.

Two tall towers stand near each end of the bridge. Huge main cables run over the tops of the towers and are fixed into massive blocks of concrete, called anchorages, buried in the ground at each end. From the main cables, thinner cables called hangers drop straight down and hold up the road. The weight of the road and the traffic pulls on the hangers, the hangers pull on the main cables, and the cables carry the force to the towers and the anchorages.

The main cables are not single ropes of steel. Each is made of thousands of thin steel wires bundled tightly together. The Golden Gate Bridge in San Francisco, finished in 1937, has two main cables with about 27,000 wires in each, enough wire to wrap around the Earth three times.

The idea of hanging a path is very old. Long before steel, people in the mountains of China, Peru and the Himalayas hung walkways from ropes of vines, grass and later iron chains across deep valleys.`,
      [forceWords, buildingWords],
      [
        ask(
          t("What holds up the road of a suspension bridge?", "什么支撑着悬索桥的桥面？"),
          t("Hangers that drop from the main cables", "从主缆垂下的吊索"),
          [
            t("Thick piers standing under the road", "立在桥面下方的粗大桥墩"),
            t("An arch that pushes up from below", "从下面向上推的拱"),
            t("Weights that swing near the towers", "在塔附近摆动的重物"),
          ],
          t(
            "The second paragraph says thinner cables called hangers drop from the main cables and hold up the road; the road does not rest on supports underneath.",
            "第二段说，叫作吊索的细缆从主缆垂下，托起桥面；桥面下没有支撑。",
          ),
        ),
        ask(
          t("What are anchorages?", "什么是锚碇？"),
          t("Concrete blocks in the ground that hold the cable ends", "埋在地下、固定主缆两端的混凝土块"),
          [
            t("The tall towers near each end", "两端附近的高塔"),
            t("The thin wires inside each cable", "每根主缆里的细钢丝"),
            t("Walkways made of vines and grass", "用藤和草做的步道"),
          ],
          t(
            "The second paragraph defines anchorages as massive concrete blocks buried at each end, where the main cables are fixed.",
            "第二段把锚碇定义为埋在两端地下的巨大混凝土块，主缆就固定在那里。",
          ),
        ),
        ask(
          t("What does the last paragraph add to the passage?", "最后一段给文章补充了什么？"),
          t("The idea of hanging bridges is very old", "悬挂桥的想法由来已久"),
          [
            t("Steel cables are made of thin wires", "钢缆由细钢丝组成"),
            t("The Golden Gate Bridge was finished in 1937", "金门大桥于 1937 年建成"),
            t("Suspension bridges are best for narrow rivers", "悬索桥最适合窄河"),
          ],
          t(
            "The last paragraph moves back in time, showing that people hung paths across valleys long before steel. The wires and the date belong to the paragraph before.",
            "最后一段回溯历史，说明早在钢材出现之前，人们就在山谷间悬挂步道。钢丝和年份属于前一段。",
          ),
        ),
      ],
    ),
    passage(
      "when-a-bridge-fails",
      t("When a Bridge Fails", "当桥梁倒塌时"),
      `On November 7, 1940, a new suspension bridge across the Tacoma Narrows in Washington State began to twist in the wind. It had been open for only four months. People had already nicknamed it "Galloping Gertie," because its road rose and fell in waves even on calm days.

That morning, the wind was steady but not unusually strong, about 64 kilometers an hour. Yet the road began to twist, one side rising while the other dropped, again and again. The motion grew larger and larger. No one was killed, though a dog trapped in a car did not survive. Then, just before eleven o'clock, a section of the road tore loose and fell into the water below.

What went wrong? The road deck was very narrow and shallow, which made it light and graceful but also flexible. The wind flowing past the deck set up a twisting motion that fed on itself, each twist making the next one bigger.

Engineers learned a hard lesson from the collapse. Today, every design for a large bridge is tested with models in wind tunnels before it is built, and decks are made stiffer and shaped to let the wind slip past.

A new, safer bridge opened on the same spot in 1950.`,
      [forceWords, planningWords],
      [
        ask(
          t('Why was the bridge nicknamed "Galloping Gertie"?', '这座桥为什么被戏称为 "Galloping Gertie"？'),
          t("Its road rose and fell in waves, even on calm days", "即使在无风的日子，桥面也会起伏如浪"),
          [
            t("It had been built by a woman named Gertie", "它是一位叫格蒂的女士建造的"),
            t("Horses often galloped across it", "马常常在桥上奔跑"),
            t("It fell down on the day it opened", "它在通车当天就倒塌了"),
          ],
          t(
            "The first paragraph says the nickname came from the way its road rose and fell in waves even on calm days.",
            "第一段说，这个绰号来自桥面即使在平静的日子也会像波浪一样起伏。",
          ),
        ),
        ask(
          t("What caused the bridge to collapse?", "是什么导致了这座桥倒塌？"),
          t("Wind set up a twisting motion that kept growing", "风引起的扭动越来越大"),
          [
            t("An unusually strong storm hit it", "一场异常猛烈的风暴袭击了它"),
            t("Too many cars crossed at once", "同时过桥的车太多"),
            t("Its towers sank into the water", "它的塔沉进了水里"),
          ],
          t(
            "The third paragraph says the wind set up a twisting motion that fed on itself. The second paragraph says the wind was not unusually strong.",
            "第三段说，风引起的扭动不断自我加强。第二段说当时的风并不特别大。",
          ),
        ),
        ask(
          t("What lesson did engineers learn from the collapse?", "工程师从这次倒塌中吸取了什么教训？"),
          t("Test bridge designs in wind tunnels and make decks stiffer", "在风洞中测试桥梁设计，并让桥面更坚固"),
          [
            t("Never build suspension bridges again", "再也不建悬索桥"),
            t("Build bridges only where there is no wind", "只在没有风的地方建桥"),
            t("Make every deck narrower and lighter", "让每座桥面都更窄更轻"),
          ],
          t(
            "The fourth paragraph says designs are now tested with models in wind tunnels and decks are made stiffer. A new suspension bridge was built on the same spot.",
            "第四段说，现在设计都要用模型在风洞中测试，桥面也做得更坚固。原址上又建了一座新的悬索桥。",
          ),
        ),
      ],
    ),
    passage(
      "testing-before-building",
      t("Testing Before Building", "建造之前先测试"),
      `Our class had one week and one box of supplies: 100 craft sticks, a bottle of glue and some string. The challenge was to build a bridge that could span the gap between two desks, 40 centimeters apart, and hold as much weight as possible.

My team's first idea was a flat beam made of sticks glued side by side. We tested it on Tuesday by hanging a bucket from the middle and adding sand one cup at a time. It sagged badly and snapped after only six cups.

On Wednesday, we studied what had gone wrong. The middle was the weakest part, because nothing held it up. Ms. Okafor suggested we look at real bridges for ideas. We noticed that many of them had a frame of crisscrossing beams along the sides, called a truss.

So we built two truss sides and joined them with sticks across the top and bottom. Before gluing everything, we tested one side alone and found a weak joint, which we fixed with extra glue and string.

On Friday, our truss bridge held thirty-one cups of sand before a joint finally cracked. It was not the strongest in the class, but it was five times stronger than our first try. The biggest lesson was this: test early, learn from what breaks, and try again.`,
      [planningWords, points],
      [
        ask(
          t("Why did the team's first bridge snap?", "这个小组的第一座桥为什么断了？"),
          t("Nothing held up its weak middle", "它薄弱的中间部分没有支撑"),
          [
            t("They used too much glue", "他们用了太多胶水"),
            t("The desks were too close together", "两张桌子靠得太近"),
            t("They added all the sand at once", "他们一次把沙子全倒进去了"),
          ],
          t(
            "The third paragraph says the middle was the weakest part, because nothing held it up. The sand was added one cup at a time.",
            "第三段说，中间是最薄弱的部分，因为没有东西支撑它。沙子是一杯一杯加的。",
          ),
        ),
        ask(
          t("Why did the team test one truss side before gluing everything?", "小组为什么在全部粘好之前先测试一侧桁架？"),
          t("To find and fix weak spots early", "为了及早发现并修好薄弱处"),
          [
            t("Because they had run out of sticks", "因为他们的木棍用完了"),
            t("Because their teacher told them to stop", "因为老师叫他们停下"),
            t("To make the bridge look more like a beam", "为了让桥更像梁"),
          ],
          t(
            "Testing one side alone let them find a weak joint and fix it before building the rest, which matches the lesson to test early.",
            "单独测试一侧让他们在建好其余部分之前发现并修好了一个薄弱的接头，这符合“尽早测试”的教训。",
          ),
        ),
        ask(
          t("Which detail supports the claim that the second bridge was much better?", "哪个细节支持第二座桥好得多的说法？"),
          t("It held thirty-one cups, five times as many as the first", "它承受了三十一杯沙，是第一座的五倍"),
          [
            t("It was not the strongest in the class", "它不是全班最结实的"),
            t("The box had 100 craft sticks", "盒子里有一百根木棍"),
            t("The desks were 40 centimeters apart", "两张桌子相距四十厘米"),
          ],
          t(
            "Thirty-one cups compared with six is the evidence that the truss bridge was much stronger. The other details do not compare the two bridges.",
            "三十一杯对六杯，是桁架桥坚固得多的证据。其他细节没有比较两座桥。",
          ),
        ),
      ],
    ),
  ],
};
