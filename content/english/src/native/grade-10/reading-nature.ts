// Grade 10: the reading unit of the fifth theme, the natural world, from a book that warned of a silent spring and
// wolves that changed rivers to rabbits that ate a continent, a forest that makes rain and a planet seen as a ship.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grade-5/reading-kit.ts";

const ecologyWords = { topic: "words-of-ecology-and-climate", weight: 0.3 } as const;
const landWords = { topic: "words-of-landscapes-and-weather", weight: 0.3 } as const;
const metaphor = { topic: "extended-metaphor", weight: 0.2 } as const;
const academic1 = { topic: "academic-words-1", weight: 0.1 } as const;
const academic2 = { topic: "academic-words-2", weight: 0.1 } as const;

/** theNaturalWorld is a reading unit of grade 10 on ecology, landscapes and how people describe the earth. */
export const theNaturalWorld: ReadingUnitDef = {
  id: "the-natural-world",
  title: t("The Natural World", "自然世界"),
  passages: [
    passage(
      "a-spring-without-birds",
      t("A Spring Without Birds", "没有鸟的春天"),
      `In 1962, an American scientist and writer named Rachel Carson published a book that began like a fairy tale. It described a town in the heart of America where all life seemed to live in harmony with its surroundings, until a strange blight crept over the area. Cattle and sheep sickened. Children fell ill. And in the spring, there was no birdsong. The mornings were silent.

The town was imaginary, Carson explained, but every one of the disasters she described had happened somewhere. The cause was not magic but chemistry. After the Second World War, farmers and governments had begun spraying huge quantities of new pesticides, especially one called DDT, over fields, forests and towns to kill insects. The chemicals worked. But they did not stay where they were sprayed.

Carson showed how pesticides moved through the natural world. Rain washed them into rivers. Small creatures absorbed them, and the animals that ate those creatures absorbed more. At each step up the food chain, the pollutant became more concentrated. Fish-eating birds such as eagles and ospreys were especially affected: DDT made the shells of their eggs so thin that they broke when the parents sat on them. In some areas, the populations of these birds collapsed.

The chemical companies attacked the book fiercely. They called Carson emotional and unscientific, and some suggested that a woman without a husband or children could not be trusted on the subject of the future. But Carson had spent years gathering evidence from scientists across the country, and her arguments held. The president asked his science advisers to investigate, and they largely confirmed her findings.

Carson did not live to see the results. She died of cancer in 1964, less than two years after the book appeared. But her work helped to change the way many people thought about nature. Instead of a set of resources to be controlled, she described it as a web in which every strand is connected, so that harm done in one place is felt in another. In 1972, the United States banned the use of DDT on crops.

The bald eagle, which had almost disappeared from much of the country, slowly recovered. Today it is common again. Each spring, when eagles return to rivers where they once could not breed, they are a reminder of a book that imagined silence so that it would never come.`,
      [ecologyWords, metaphor, academic2, academic1],
      [
        ask(
          t("Why does Carson begin her book with an imaginary town?", "卡森为什么用一个想象中的小镇作为书的开头？"),
          t("To make readers feel what the real harms of pesticides could add up to", "让读者感受到农药的真实危害累积起来会是什么样子"),
          [
            t("Because she had never visited a real town", "因为她从未去过真正的小镇"),
            t("To show that pesticides are a kind of magic", "表明农药是一种魔法"),
            t("Because the book was written for small children", "因为这本书是为小孩子写的"),
          ],
          t(
            "The second paragraph says the town was imaginary, but every disaster she described had happened somewhere.",
            "第二段说小镇是想象的，但她描写的每一场灾难都在某处发生过。",
          ),
        ),
        ask(
          t("How did DDT harm eagles and ospreys?", "滴滴涕怎样伤害了鹰和鹗？"),
          t("It made their eggshells so thin that they broke", "它使它们的蛋壳太薄而破裂"),
          [
            t("It poisoned the trees where they built nests", "它毒害了它们筑巢的树"),
            t("It killed them directly when it was sprayed", "喷洒时直接杀死了它们"),
            t("It made them leave America for other countries", "它使它们离开美国去了别的国家"),
          ],
          t(
            "The third paragraph says DDT made the shells of their eggs so thin that they broke when the parents sat on them.",
            "第三段说滴滴涕使它们的蛋壳太薄，亲鸟孵蛋时蛋就破了。",
          ),
        ),
        ask(
          t("What image does Carson use for nature, according to the fifth paragraph?", "根据第五段，卡森用什么意象来描述自然？"),
          t("A web in which every strand is connected", "一张每根丝都相互连接的网"),
          [
            t("A store of resources to be controlled", "一座有待控制的资源仓库"),
            t("A machine that can be repaired with chemicals", "一台可以用化学品修理的机器"),
            t("A fairy tale with a happy ending", "一个结局美满的童话"),
          ],
          t(
            "The fifth paragraph says she described nature as a web in which every strand is connected, so harm in one place is felt in another.",
            "第五段说她把自然描述为一张每根丝都相连的网，一处的伤害会在别处被感受到。",
          ),
        ),
      ],
      ["Rachel", "Carson", "America", "DDT"],
    ),
    passage(
      "the-wolves-that-moved-rivers",
      t("The Wolves That Moved Rivers", "让河流改道的狼"),
      `By the 1920s, the last gray wolves in Yellowstone National Park had been shot. For decades, wolves had been seen as dangerous pests that killed cattle and frightened visitors, and park rangers had helped to remove them. Few people imagined that the park would suffer from their absence.

Without wolves, the population of elk in Yellowstone grew rapidly. The elk had few enemies, and in winter they gathered in the river valleys, where they ate the young willow and aspen trees down to the ground. Over the following decades, the trees along the rivers began to disappear. Beavers, which depend on willows for food and for building their dams, became rare. Songbirds that nested in the trees declined.

In 1995 and 1996, after years of debate, scientists brought thirty-one wolves from Canada and released them into the park. What happened next has become one of the most famous stories in modern ecology.

The wolves hunted elk, and the number of elk fell. But scientists also noticed something more subtle. The elk began to behave differently. They spent less time in open valleys and along riverbanks, where wolves could easily catch them, and moved more often. In some areas, willows and aspens began to grow again. Beavers returned and built dams, creating ponds where fish, frogs and insects could live. The wolves also left the remains of their kills, which fed bears, eagles and ravens.

Some writers have claimed that the wolves even changed the shape of the rivers, because the returning trees held the banks together and slowed erosion. This version of the story has been widely shared in videos and articles. Many ecologists, however, think it has been exaggerated. They point out that the recovery has been uneven, that drought, hunting by people and the return of bears have also reduced the elk, and that some streams have hardly changed at all.

The true story is more complicated than the popular one, but its lesson remains important. Ecologists call it a trophic cascade: a change at the top of a food chain that flows down through the whole system, like water falling from step to step. Removing a single species, even a feared one, can have effects that no one predicted. Bringing it back does not simply rewind the clock, but it can set a damaged system moving again.`,
      [ecologyWords, metaphor, academic2],
      [
        ask(
          t("Why did trees along Yellowstone's rivers disappear after the wolves were gone?", "狼消失以后，黄石河边的树木为什么消失了？"),
          t("Elk, with few enemies, ate the young trees in the valleys", "几乎没有天敌的麋鹿吃掉了山谷里的幼树"),
          [
            t("Beavers cut down all the trees to build dams", "河狸砍光了所有的树来筑坝"),
            t("Park rangers removed the trees to help visitors", "公园管理员为方便游客移走了树"),
            t("A long drought dried up all the rivers", "长期干旱使所有河流干涸"),
          ],
          t(
            "The second paragraph says the elk population grew and the elk ate the young willow and aspen trees in the river valleys.",
            "第二段说麋鹿数量增长，它们吃掉了河谷里的柳树和白杨幼树。",
          ),
        ),
        ask(
          t("Why do many ecologists doubt the claim that wolves changed the rivers?", "为什么许多生态学家怀疑狼改变了河流的说法？"),
          t("The recovery was uneven and other causes also played a part", "恢复并不均衡，其他原因也起了作用"),
          [
            t("The wolves never actually arrived in the park", "狼实际上从未到达公园"),
            t("Rivers cannot be affected by trees in any way", "河流丝毫不会受到树木影响"),
            t("The elk population grew larger after 1995", "1995年以后麋鹿数量变得更多"),
          ],
          t(
            "The fifth paragraph says the recovery has been uneven, drought, hunting and bears also reduced the elk, and some streams hardly changed.",
            "第五段说恢复并不均衡，干旱、狩猎和熊也减少了麋鹿，而且有些溪流几乎没有变化。",
          ),
        ),
        ask(
          t("What comparison does the passage use to explain a trophic cascade?", "文章用什么比喻来解释营养级联？"),
          t("Water falling from step to step", "水从一级台阶落到下一级"),
          [
            t("A clock that can be rewound", "一座可以倒拨的钟"),
            t("A video shared around the world", "一段传遍世界的视频"),
            t("A dam built by beavers", "一座河狸筑的坝"),
          ],
          t(
            "The last paragraph describes a change that flows down through the whole system, like water falling from step to step.",
            "最后一段把这种变化描述为贯穿整个系统向下传递，就像水一级一级往下落。",
          ),
        ),
      ],
      ["Yellowstone", "Canada"],
    ),
    passage(
      "the-rabbits-that-ate-a-continent",
      t("The Rabbits That Ate a Continent", "吃掉一片大陆的兔子"),
      `In 1859, a farmer named Thomas Austin, living near Melbourne in southern Australia, asked a relative in England to send him twenty-four wild rabbits. Austin missed the hunting of his youth, and he wanted rabbits to shoot on his land. "The introduction of a few rabbits could do little harm," he is reported to have said, "and might provide a touch of home, in addition to a spot of hunting."

He was badly mistaken. Australia had no native rabbits and few animals that could hunt them. The climate was mild, so the rabbits could breed almost all year round. A single female can produce dozens of young in a year, and her young can breed within months. Within ten years, Austin's rabbits had multiplied so fast that millions were being shot or trapped every year with no noticeable effect on their numbers.

The rabbits spread across the continent faster than any other introduced mammal on record, moving more than a hundred kilometers a year. They ate grass that farmers needed for their sheep and cattle. They ate the seedlings of native trees and shrubs, so that old trees died without being replaced. They dug burrows that destroyed the soil, leaving land that blew away in the wind. Many small native animals, which depended on the same plants, declined or vanished.

Australians tried almost everything. They built fences thousands of kilometers long; one in Western Australia stretched for more than 1,800 kilometers. The rabbits dug under them or got through gaps. They poisoned the rabbits, gassed their burrows and released foxes and cats to hunt them, but the foxes and cats preferred to hunt native animals, which were easier to catch. Two invasive species had now been added to the first.

In 1950, scientists released a virus called myxoma, which killed about ninety-nine percent of the rabbits it infected. For a while, the land recovered. But the surviving rabbits were resistant, and their descendants slowly increased again. A second virus, released in the 1990s, has had similar results.

Today there are still hundreds of millions of rabbits in Australia. The story of Thomas Austin is often told as a warning: an invasive species, released carelessly, can transform an entire landscape. Once it has spread, it may never be removed. The safest moment to stop an invasion, ecologists say, is before it begins.`,
      [ecologyWords, landWords, academic2],
      [
        ask(
          t("Why did the rabbits multiply so quickly in Australia?", "兔子为什么在澳大利亚繁殖得这么快？"),
          t("They had few predators and a mild climate that let them breed all year", "它们天敌很少，温和的气候使它们全年都能繁殖"),
          [
            t("Farmers fed them grass meant for their sheep", "农民用给羊吃的草喂它们"),
            t("There were native rabbits for them to breed with", "那里有本地兔子可以和它们交配"),
            t("Austin released thousands of them at once", "奥斯汀一次放出了成千上万只"),
          ],
          t(
            "The second paragraph says Australia had few animals that could hunt rabbits and a mild climate, so they could breed almost all year.",
            "第二段说澳大利亚几乎没有能捕食兔子的动物，气候温和，所以它们几乎全年都能繁殖。",
          ),
        ),
        ask(
          t("Why did releasing foxes and cats make the problem worse?", "为什么放出狐狸和猫使问题更严重？"),
          t("They hunted native animals instead, adding two more invasive species", "它们转而捕食本地动物，又增加了两种入侵物种"),
          [
            t("They helped the rabbits dig under the fences", "它们帮兔子在篱笆下打洞"),
            t("They carried the myxoma virus to the sheep", "它们把黏液瘤病毒传给了羊"),
            t("They ate the grass that the cattle needed", "它们吃掉了牛需要的草"),
          ],
          t(
            "The fourth paragraph says the foxes and cats preferred native animals, which were easier to catch, so two invasive species were added to the first.",
            "第四段说狐狸和猫更喜欢捕食更容易抓到的本地动物，于是在兔子之外又多了两种入侵物种。",
          ),
        ),
        ask(
          t("What lesson does the last paragraph draw from the story?", "最后一段从这个故事中得出什么教训？"),
          t("An invasion is best stopped before it begins", "入侵最好在开始之前就加以阻止"),
          [
            t("Fences are the best way to stop any invasion", "篱笆是阻止任何入侵的最好办法"),
            t("Viruses can always remove an invasive species", "病毒总能清除入侵物种"),
            t("Rabbits are harmless if they are hunted", "兔子如果被猎杀就是无害的"),
          ],
          t(
            "The passage ends by saying the safest moment to stop an invasion is before it begins.",
            "文章结尾说阻止入侵最安全的时机是在它开始之前。",
          ),
        ),
      ],
      ["Thomas", "Austin", "Melbourne", "Australia", "Australians", "England", "myxoma"],
    ),
    passage(
      "the-forest-that-makes-rain",
      t("The Forest That Makes Rain", "制造雨水的森林"),
      `Most people think of rain as something that falls on forests. In the Amazon, the forest also makes its own rain.

The Amazon rainforest covers more than five million square kilometers of South America, an area larger than India. It holds more species of plants and animals than any other place on land. Its flora includes around sixteen thousand species of trees, and scientists believe that many of its insects have not yet been named. But one of its most important roles is invisible.

Every day, the trees of the Amazon draw water up from the soil through their roots and release it through their leaves as vapor. A single large tree can release hundreds of liters a day. Across the whole forest, this adds up to about twenty billion tons of water rising into the air each day, more than the Amazon River itself carries into the sea. The vapor forms clouds, and the clouds fall as rain further west, where trees take up the water and release it again.

Scientists call these streams of moisture in the air "flying rivers." Carried by the wind, they move across the continent until they meet the wall of the Andes mountains and turn south. They bring rain to farmland in Brazil, Paraguay and Argentina, thousands of kilometers from the forest. Some of the coffee, soybeans and beef grown in those regions depend on water that once rose from Amazon leaves.

This is why deforestation in the Amazon worries people far beyond it. In recent decades, large areas of forest have been cleared for cattle ranches, soybean farms and roads. Cleared land releases far less water into the air. Fires used to clear the forest add carbon dioxide to the atmosphere, which contributes to climate change, and climate change in turn brings longer droughts that exacerbate the danger of fire.

Some scientists warn that if too much of the forest is lost, perhaps a fifth to a quarter, the system could reach a tipping point. Large parts of the rainforest would no longer receive enough rain to survive and would slowly turn into dry grassland. No one knows exactly where that point lies.

The Amazon is often called the lungs of the planet, though in fact it uses most of the oxygen it produces. A better comparison might be a heart, pumping water through the body of a continent. A heart can be damaged slowly for a long time, and then fail all at once.`,
      [ecologyWords, landWords, metaphor, academic2],
      [
        ask(
          t('What are the "flying rivers" described in the passage?', '文中描述的"飞翔的河流"是什么？'),
          t("Streams of moisture released by the trees and carried by the wind", "由树木释放、被风带走的水汽流"),
          [
            t("Rivers that flood the forest every spring", "每年春天淹没森林的河流"),
            t("Water that falls from the Andes as waterfalls", "从安第斯山脉落下的瀑布"),
            t("Roads built through the forest for trucks", "为卡车修建的穿越森林的道路"),
          ],
          t(
            "The fourth paragraph says scientists call these streams of moisture in the air flying rivers, carried by the wind across the continent.",
            "第四段说科学家把空气中的这些水汽流称为飞翔的河流，它们被风带着穿越大陆。",
          ),
        ),
        ask(
          t("Why does deforestation in the Amazon matter to farms in Argentina?", "为什么亚马孙的森林砍伐对阿根廷的农场很重要？"),
          t("Those farms receive rain that depends on water released by the forest", "那些农场得到的雨水依赖于森林释放的水分"),
          [
            t("Argentina sells soybeans to the Amazon", "阿根廷向亚马孙出售大豆"),
            t("The forest blocks wind that would damage crops", "森林挡住会损害庄稼的风"),
            t("Cattle from Argentina graze in the forest", "阿根廷的牛在森林里吃草"),
          ],
          t(
            "The fourth and fifth paragraphs say the flying rivers bring rain to farmland far away, and cleared land releases far less water.",
            "第四段和第五段说飞翔的河流把雨水带到遥远的农田，而被砍伐的土地释放的水少得多。",
          ),
        ),
        ask(
          t("Why does the author suggest a heart is a better comparison than lungs?", "作者为什么认为心脏比肺是更好的比喻？"),
          t(
            "The forest pumps water through a continent and could fail suddenly after slow damage",
            "森林把水泵送到整片大陆，长期缓慢受损后可能突然衰竭",
          ),
          [
            t("The forest produces more oxygen than any lungs", "森林产生的氧气比任何肺都多"),
            t("Hearts and forests are both found in South America", "心脏和森林都在南美洲"),
            t("The trees of the forest are shaped like hearts", "森林里的树长得像心脏"),
          ],
          t(
            "The last paragraph says the forest uses most of its oxygen, but pumps water like a heart, and a heart damaged slowly can fail all at once.",
            "最后一段说森林消耗了它产生的大部分氧气，但它像心脏一样泵送水分，而缓慢受损的心脏可能突然衰竭。",
          ),
        ),
      ],
      ["Amazon", "America", "India", "Andes", "Brazil", "Paraguay", "Argentina"],
    ),
    passage(
      "the-black-blizzards",
      t("The Black Blizzards", "黑色暴风雪"),
      `On April 14, 1935, a Sunday, the sky over the southern Great Plains of the United States turned black in the middle of the afternoon. A wall of dust, hundreds of kilometers wide and more than a kilometer high, rolled across Oklahoma and Texas at the speed of a train. People caught outside could not see their own hands. Birds fled in front of it. Families who reached their homes stuffed wet towels under the doors, but the dust came in anyway, settling on food, furniture and the faces of sleeping children. The day became known as Black Sunday.

The storms of the 1930s were called black blizzards, and the region where they struck was named the Dust Bowl. They were caused partly by nature and partly by people.

For thousands of years, the southern plains had been grassland, like the great steppe of Central Asia. The roots of the native grasses formed a thick mat that held the soil in place through long droughts and fierce winds. In the early twentieth century, encouraged by high wheat prices and new tractors, farmers plowed up millions of hectares of this grass to plant wheat. For a few years, the rains were good and the harvests were rich.

Then, in the early 1930s, the rain stopped. The wheat died, and there was nothing left to hold the soil. The wind, which had always blown across the plains, now picked up the dry, loose earth and carried it away. Some storms carried dust as far as the cities of the east coast, darkening the sky over Washington and New York and settling on ships at sea.

The human cost was enormous. Crops failed year after year. Many families lost their farms. Children and older people suffered from a lung disease called dust pneumonia. About two and a half million people left the plains during the 1930s, many of them heading west to California in search of work, where they often met hostility and poverty.

The government responded by creating a service to teach farmers how to protect the soil. Farmers were paid to plant grass on the worst land, to plow along the curves of hills instead of in straight lines, and to plant long rows of trees to break the wind. More than two hundred million trees were planted. When the rains returned at the end of the decade, the land slowly began to recover.

The Dust Bowl is remembered as one of the worst environmental disasters in American history. It showed that the soil, which seems as permanent as the ground beneath our feet, can be lost in a few seasons, and that it takes far longer to replenish.`,
      [landWords, ecologyWords, academic2],
      [
        ask(
          t("What part did farmers play in causing the Dust Bowl?", "农民在造成沙尘碗的过程中起了什么作用？"),
          t("They plowed up the native grass whose roots had held the soil", "他们翻耕了根系能固定土壤的原生草地"),
          [
            t("They planted too many trees across the plains", "他们在平原上种了太多的树"),
            t("They moved to California before the storms began", "他们在风暴开始前就搬到了加利福尼亚"),
            t("They stopped growing wheat when prices rose", "小麦价格上涨时他们停止种植小麦"),
          ],
          t(
            "The third paragraph says farmers plowed up millions of hectares of grass whose roots held the soil, so nothing held it when the rain stopped.",
            "第三段说农民翻耕了数百万公顷草地，而草根原本固定着土壤，所以雨停后再也没有东西能固定它。",
          ),
        ),
        ask(
          t("Which detail shows how far the dust traveled?", "哪个细节表明沙尘传得有多远？"),
          t("It darkened the sky over Washington and New York and settled on ships", "它使华盛顿和纽约的天空变暗，并落在船上"),
          [
            t("People could not see their own hands", "人们看不见自己的手"),
            t("Families stuffed wet towels under their doors", "家家户户在门下塞湿毛巾"),
            t("Children suffered from dust pneumonia", "儿童患上了尘肺炎"),
          ],
          t(
            "The fourth paragraph says some storms carried dust to the east coast cities and onto ships at sea.",
            "第四段说一些风暴把沙尘带到了东海岸的城市和海上的船只。",
          ),
        ),
        ask(
          t("What lesson does the final paragraph draw?", "最后一段得出什么教训？"),
          t("Soil can be lost quickly but takes far longer to restore", "土壤可能很快流失，但恢复需要长得多的时间"),
          [
            t("Droughts can always be prevented by planting wheat", "种小麦总能防止干旱"),
            t("The plains should never have been farmed at all", "平原根本就不该被耕种"),
            t("Dust storms happen only in the United States", "沙尘暴只发生在美国"),
          ],
          t(
            "It says the soil seems permanent but can be lost in a few seasons, and takes far longer to replenish.",
            "它说土壤看似永恒，却可能在几个季节内流失，而补充它需要长得多的时间。",
          ),
        ),
      ],
      ["Oklahoma", "Texas", "Asia", "Washington", "York", "California", "American"],
    ),
    passage(
      "the-ice-that-carved-the-coast",
      t("The Ice That Carved the Coast", "雕刻海岸的冰"),
      `Sail into one of the great fjords of western Norway, and the land closes around you like the walls of a cathedral. Cliffs of gray rock rise more than a thousand meters straight out of the water. Waterfalls pour from their edges and dissolve into mist before they reach the sea. The water beneath the boat is dark and astonishingly deep, in places deeper than the surrounding mountains are high.

It is hard to believe that this landscape was made by something as slow as ice. Yet that is what happened.

During the ice ages, which began about two and a half million years ago, vast sheets of ice covered northern Europe. In places they were more than two kilometers thick. Ice is heavy, and under its own weight it flows, very slowly, like an enormously thick river. As glaciers crept down toward the sea, they followed the valleys that rivers had already cut. But rivers wear away the bottom of a valley in a narrow V. Glaciers, armed with stones frozen into their base, scraped away both the floor and the sides, grinding the valleys into a wide, deep U.

The glaciers did not stop at the old coastline. Because the sea level was lower during the ice ages, they carved their valleys far below the level of the present sea. When the climate warmed, about ten thousand years ago, the ice melted and retreated. The sea rose and flowed into the empty valleys, filling them like water poured into a mold. The result was the fjord: a long, narrow arm of the sea between steep walls.

The weight of the ice had pressed the land down. When it disappeared, the land began to rise again, a process that is still continuing. In some parts of Scandinavia, the ground is rising by almost a centimeter a year. Old beaches can be found high on the hillsides, far above the present shore.

Fjords are found wherever glaciers once met the sea: in Norway, Greenland, Chile, New Zealand, Alaska and Canada. Today, many of the glaciers that remain at the heads of fjords are shrinking quickly as the climate warms. Their meltwater adds to rising seas.

Standing on the deck beneath those cliffs, a visitor sees a landscape that seems eternal. It is, in fact, a moment in a long story, and the story is still being written.`,
      [landWords, ecologyWords, metaphor, academic2],
      [
        ask(
          t("How does a valley carved by a glacier differ from one cut by a river?", "冰川刻出的山谷与河流切出的山谷有什么不同？"),
          t("A glacier makes a wide U, while a river makes a narrow V", "冰川形成宽阔的U形，而河流形成狭窄的V形"),
          [
            t("A glacier makes a narrow V, while a river makes a wide U", "冰川形成狭窄的V形，而河流形成宽阔的U形"),
            t("A glacier valley is always shallower than a river valley", "冰川谷总是比河谷浅"),
            t("A river valley is always found beneath the sea", "河谷总是在海底"),
          ],
          t(
            "The third paragraph says rivers wear a narrow V, while glaciers scrape floor and sides into a wide, deep U.",
            "第三段说河流冲刷出狭窄的V形，而冰川刮削谷底和谷壁，形成宽而深的U形。",
          ),
        ),
        ask(
          t("Why is the land in parts of Scandinavia still rising?", "为什么斯堪的纳维亚部分地区的土地仍在上升？"),
          t("It is recovering from being pressed down by the weight of the ice", "它在从冰的重压下恢复"),
          [
            t("Volcanoes are pushing the land upward", "火山正把土地向上推"),
            t("The sea is slowly drying up", "大海正在慢慢干涸"),
            t("New glaciers are forming beneath it", "它下面正在形成新的冰川"),
          ],
          t(
            "The fifth paragraph says the weight of the ice pressed the land down, and when it disappeared the land began to rise again.",
            "第五段说冰的重量把土地压低，冰消失后土地又开始上升。",
          ),
        ),
        ask(
          t(
            'What does the last paragraph suggest by calling the landscape "a moment in a long story"?',
            '最后一段把这片风景称为"漫长故事中的一个瞬间"，暗示了什么？',
          ),
          t("The land looks permanent but is still changing", "这片土地看似永恒，其实仍在变化"),
          [
            t("The fjords were made in a single moment", "峡湾是在一瞬间形成的"),
            t("Visitors should stay only a short time", "游客只应该停留很短时间"),
            t("A famous novel was written about the fjords", "有一部著名小说写的就是峡湾"),
          ],
          t(
            "It seems eternal, but the land is rising, glaciers are shrinking and the story is still being written.",
            "它看似永恒，但土地在上升，冰川在退缩，这个故事仍在书写之中。",
          ),
        ),
      ],
      ["Norway", "Europe", "Scandinavia", "Greenland", "Chile", "Zealand", "Alaska", "Canada"],
    ),
    passage(
      "an-ocean-of-heather",
      t("An Ocean of Heather", "石南花的海洋"),
      `I had been warned about the moor. "It changes in an hour," said the woman at the inn, handing me a map I would not need for long. "Stay on the path, and if the mist comes down, stay where you are."

The morning was clear when I set out. Beyond the last stone wall of the village, the land opened out into an ocean of heather. It rolled away in long purple swells toward the horizon, rising and falling as if the earth itself were breathing. Here and there a gray crag broke the surface like a rock in the sea, and the wind passed over everything in waves, so that the heather bent and shone and bent again.

There were no trees. There were almost no landmarks at all, only the path, a pale thread laid across the surface, and the sky, which was enormous. Larks rose singing from the heather and vanished into the blue. A pair of sheep watched me without interest. For two hours I walked across that sea without seeing another person, and I felt as small and as free as a sailor in an open boat.

Then the weather turned. A dark line appeared in the west and came on faster than I could have believed. The light went gray. The wind dropped, and in the stillness I heard the first drops of rain, then the whole storm arrived at once, torrential and cold. Within minutes, the mist had swallowed the horizon, then the crags, then the path itself. The ocean had become a fog in which I could see no more than three steps in any direction.

I remembered the woman's advice and stopped. I crouched beside a boulder, pulled up my hood and waited. It is a strange experience to be lost while standing still. Every sound seemed close and unexplained: the drip of water, a bird calling somewhere, the rush of a stream I could not see.

After almost an hour, the mist began to lift, as suddenly as it had fallen. The heather appeared around me, dark and wet, then the crags, then the line of the path, not ten meters from where I sat. In the distance, sunlight touched the roofs of the village. The sea had become calm again.

I walked back slowly, soaked and oddly happy. I had crossed the moor, and for an hour it had let me know exactly how little it cared.`,
      [landWords, metaphor],
      [
        ask(
          t("What extended metaphor does the writer use for the moor?", "作者对荒原使用了什么延伸隐喻？"),
          t("The moor is an ocean, with swells, rocks and a sailor in a boat", "荒原是海洋，有浪涌、礁石和小船里的水手"),
          [
            t("The moor is a city, with streets and buildings", "荒原是一座城市，有街道和建筑"),
            t("The moor is a garden that the villagers tend", "荒原是村民照料的花园"),
            t("The moor is a book that the writer is reading", "荒原是作者正在读的一本书"),
          ],
          t(
            "The writer describes an ocean of heather with swells, crags like rocks in the sea and herself as a sailor in an open boat, and returns to the sea at the end.",
            "作者描写石南花的海洋，有浪涌，岩峰像海中礁石，自己像小船上的水手，结尾又回到大海的意象。",
          ),
        ),
        ask(
          t("Why did the writer stop and wait when the mist came down?", "雾降下来时，作者为什么停下来等待？"),
          t("She followed the advice to stay where she was in the mist", "她遵从了起雾时待在原地的建议"),
          [
            t("She had found another walker who was lost", "她找到了另一个迷路的行人"),
            t("She wanted to photograph the storm", "她想拍下暴风雨"),
            t("Her map showed that the path ended there", "她的地图显示小路在那里到了尽头"),
          ],
          t(
            "The woman at the inn had told her that if the mist came down, she should stay where she was, and the writer remembered this advice.",
            "旅店的女人告诉过她，如果起雾就待在原地，作者记起了这个建议。",
          ),
        ),
        ask(
          t("What does the last sentence suggest the writer learned?", "最后一句暗示作者明白了什么？"),
          t("Nature is indifferent to people, and that is part of its power", "大自然对人漠不关心，这正是它力量的一部分"),
          [
            t("The moor is a dangerous place that no one should visit", "荒原是一个任何人都不该去的危险地方"),
            t("The woman at the inn did not tell her the truth", "旅店的女人没有对她说实话"),
            t("Maps are always more useful than advice", "地图总是比建议更有用"),
          ],
          t(
            "She is soaked but oddly happy, because for an hour the moor showed how little it cared about her.",
            "她浑身湿透却出奇地快乐，因为在那一小时里荒原让她明白它对她毫不在意。",
          ),
        ),
      ],
      [],
    ),
    passage(
      "the-ship-called-earth",
      t("The Ship Called Earth", "名叫地球的飞船"),
      `In the 1960s, several writers began to describe the earth in a new way. They called it a spaceship. The American inventor Buckminster Fuller wrote a short book with the title Operating Manual for Spaceship Earth, and the British economist Barbara Ward used the same image in her speeches and books. The metaphor caught on quickly, and it is worth asking why.

The image of a ship has several parts, and each one carries a meaning. First, a ship is a closed vessel. Everything the passengers need must be carried on board: air, water, food, fuel. Nothing can be brought in from outside, except the energy of the sun. On a ship, it is impossible to pretend that resources are endless. When they are used up, they are gone.

Second, a ship has no "away." On land, people throw rubbish away, pour waste into rivers or release smoke into the sky, as if these things disappeared. On a ship, there is nowhere for them to go. Every pollutant remains on board with the crew, in the air they breathe and the water they drink. Waste must be dealt with, or it will poison the people who made it.

Third, a ship needs a crew that works together. Fuller argued that the earth had come without an operating manual, and that humanity had been learning to run it by trial and error. Ward insisted that the passengers were all on the same voyage, rich and poor alike. If the ship sank, she said, the first-class passengers would drown along with everyone else.

The timing of the metaphor was not an accident. In 1968, astronauts orbiting the moon took a photograph called Earthrise, showing the planet as a small blue sphere above a gray lunar landscape, surrounded by black space. For the first time, millions of people could see the earth as a single, fragile object, alone in the dark. It looked exactly like a ship.

Like every metaphor, this one has limits. A spaceship is a machine, designed and built by engineers, who can repair it. The earth is a living system, far more complex than any machine, and no one fully understands how it works. Some critics argue that the image encourages people to think that technology will always find a fix.

Even so, the metaphor endures because it captures something simple and true. We have only one vessel, and we are all on board.`,
      [ecologyWords, metaphor],
      [
        ask(
          t('What does the idea that "a ship has no away" mean?', "\"船上没有'别处'\"这个说法是什么意思？"),
          t("Waste cannot be sent anywhere; it stays with the people on board", "废物无处可去，它留在船上的人身边"),
          [
            t("A ship must never leave its home port", "船永远不能离开母港"),
            t("Passengers cannot go on holiday from a ship", "乘客不能离开船去度假"),
            t("The ship has no engine to carry it away", "船没有发动机把它开走"),
          ],
          t(
            "The third paragraph says that on a ship there is nowhere for waste to go, so every pollutant remains on board with the crew.",
            "第三段说船上废物无处可去，所以每种污染物都和船员一起留在船上。",
          ),
        ),
        ask(
          t("Why did the Earthrise photograph make the metaphor more powerful?", "为什么《地出》照片使这个隐喻更有力量？"),
          t("It showed the planet as a small, single object alone in space", "它把地球呈现为太空中孤零零的一个小物体"),
          [
            t("It proved that the earth was built by engineers", "它证明地球是工程师建造的"),
            t("It showed a ship flying above the moon", "它显示一艘船在月球上方飞行"),
            t("It was taken by Buckminster Fuller himself", "它是巴克敏斯特·富勒亲自拍的"),
          ],
          t(
            "The fifth paragraph says the photograph let millions see the earth as a single, fragile object alone in the dark, exactly like a ship.",
            "第五段说这张照片让数百万人看到地球是黑暗中孤独、脆弱的一个整体，就像一艘船。",
          ),
        ),
        ask(
          t("What limit of the metaphor do some critics point out?", "一些批评者指出了这个隐喻的什么局限？"),
          t("It may suggest that the earth, like a machine, can always be fixed by technology", "它可能暗示地球像机器一样总能用技术修好"),
          [
            t("It makes the earth seem much larger than it is", "它使地球显得比实际大得多"),
            t("It suggests that only rich people are on board", "它暗示只有富人在船上"),
            t("It was invented too late to be useful", "它发明得太晚，没有用处"),
          ],
          t(
            "The sixth paragraph says a spaceship is a machine engineers can repair, while the earth is a living system, so the image may encourage faith in a technical fix.",
            "第六段说飞船是工程师能修理的机器，而地球是一个有生命的系统，所以这个意象可能助长对技术解决方案的迷信。",
          ),
        ),
      ],
      ["Buckminster", "Fuller", "Barbara", "Ward", "Earthrise", "British"],
    ),
  ],
};
