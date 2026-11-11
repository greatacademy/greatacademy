// Grade 5: the reading unit of the third theme, the world under a microscope, from the first lenses to the microbes
// that live inside us.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "./reading-kit.ts";

const microbeWords = { topic: "words-of-cells-and-microbes", weight: 0.3 } as const;
const labWords = { topic: "words-of-the-lab", weight: 0.3 } as const;
const livingWords = { topic: "words-for-how-living-things-work", weight: 0.3 } as const;
const comparisons = { topic: "comparisons-that-explain", weight: 0.2 } as const;
const quoting = { topic: "quoting-accurately", weight: 0.2 } as const;
const academic2 = { topic: "academic-words-2", weight: 0.1 } as const;

/** theWorldUnderAMicroscope is a reading unit of grade 5 on cells and microbes, harmful and helpful. */
export const theWorldUnderAMicroscope: ReadingUnitDef = {
  id: "the-world-under-a-microscope",
  title: t("The World Under a Microscope", "显微镜下的世界"),
  passages: [
    passage(
      "the-first-microscopes",
      t("The First Microscopes", "最早的显微镜"),
      `About 350 years ago, a Dutch cloth seller named Antonie van Leeuwenhoek liked to grind tiny glass lenses in his spare time. He wanted to check the threads of the cloth he sold. But soon he began pointing his lenses at other things.

His microscopes were simple: a single small lens set in a metal plate, held close to the eye. Yet they could magnify things more than two hundred times. When he looked at a drop of rainwater, he saw something no one had ever seen before. The water was full of tiny moving creatures. He called them "little animals" and wrote that some of them were so small that a thousand of them together would be no bigger than a grain of sand.

People did not believe him at first. Then other scientists built their own microscopes and saw the same tiny creatures. Van Leeuwenhoek had discovered microbes, living things too small to see with the eye alone.

Today, microscopes can magnify things a million times. But it all began with a curious shopkeeper who wanted a closer look at his cloth.`,
      [labWords, quoting],
      [
        ask(
          t("Why did van Leeuwenhoek first make lenses?", "列文虎克最初为什么做镜片？"),
          t("To check the threads of the cloth he sold", "检查他所卖布料的线"),
          [
            t("To look for microbes in rainwater", "寻找雨水中的微生物"),
            t("To sell microscopes to scientists", "把显微镜卖给科学家"),
            t("To prove that people were wrong", "证明人们是错的"),
          ],
          t(
            "The first paragraph says he wanted to check the threads of the cloth he sold; he only later pointed his lenses at other things.",
            "第一段说他想检查所卖布料的线；后来他才把镜片对准别的东西。",
          ),
        ),
        ask(
          t("Which words does the passage quote from van Leeuwenhoek?", "文章引用了列文虎克的哪个说法？"),
          t('He called the creatures "little animals"', '他把这些生物称为 "little animals"'),
          [
            t('He called the creatures "tiny germs"', '他把这些生物称为 "tiny germs"'),
            t('He called the creatures "water bugs"', '他把这些生物称为 "water bugs"'),
            t('He called the creatures "small cells"', '他把这些生物称为 "small cells"'),
          ],
          t(
            'The second paragraph quotes him exactly: he called them "little animals." The other phrases are not in the passage.',
            '第二段准确地引用了他的话：他称它们为 "little animals"。其他说法文中没有。',
          ),
        ),
        ask(
          t("Why did people finally believe van Leeuwenhoek?", "人们最后为什么相信了列文虎克？"),
          t("Other scientists saw the same creatures through their own microscopes", "其他科学家用自己的显微镜看到了同样的生物"),
          [
            t("He showed them a creature as large as a grain of sand", "他给他们看了一个像沙粒那么大的生物"),
            t("His microscopes could magnify things a million times", "他的显微镜能把东西放大一百万倍"),
            t("He sold them cloth with microbes woven into it", "他卖给他们织进了微生物的布"),
          ],
          t(
            "The third paragraph says other scientists built their own microscopes and saw the same tiny creatures.",
            "第三段说，其他科学家自己制作了显微镜，也看到了同样的微小生物。",
          ),
        ),
      ],
    ),
    passage(
      "cells-the-building-blocks",
      t("Cells, the Building Blocks", "细胞：构成生命的基本单位"),
      `A brick wall is made of many bricks. In the same way, every living thing is made of tiny units called cells. Some living things, such as bacteria, are a single cell. Your body has trillions of them.

Most cells are far too small to see without a microscope. If you lined up a hundred of your skin cells, they would barely stretch across the head of a pin.

Cells come in many shapes, each suited to its job. Nerve cells are long and thin, like wires, so they can carry messages through your body. Red blood cells are round and flat, like tiny cushions, so they can squeeze through narrow tubes. Plant cells often have stiff walls that work like the frame of a house, holding the plant upright.

Although they look different, most cells share some parts. A thin membrane surrounds each cell like a bag, controlling what goes in and out. Inside, many cells have a nucleus, which works like a control center, directing what the cell does.

Cells also make more cells. A cell divides into two, then those two divide, and so on. That is how you grow, and how a cut on your knee heals.`,
      [microbeWords, comparisons],
      [
        ask(
          t("What does the comparison to a brick wall explain?", "把细胞和砖墙作比较，说明了什么？"),
          t("Living things are built from many small units", "生物由许多小单位构成"),
          [
            t("Cells are as hard and heavy as bricks", "细胞像砖一样又硬又重"),
            t("Walls are made of living cells", "墙是由活细胞构成的"),
            t("Bacteria are larger than bricks", "细菌比砖还大"),
          ],
          t(
            "Just as a wall is made of many bricks, every living thing is made of many cells.",
            "正如一堵墙由许多砖组成，每个生物都由许多细胞组成。",
          ),
        ),
        ask(
          t("Why are red blood cells round and flat?", "红细胞为什么又圆又扁？"),
          t("So they can squeeze through narrow tubes", "这样能挤过狭窄的管道"),
          [
            t("So they can carry messages like wires", "这样能像电线一样传递信息"),
            t("So they can hold the body upright", "这样能让身体保持直立"),
            t("So they can control what enters a cell", "这样能控制什么进入细胞"),
          ],
          t(
            "The third paragraph says red blood cells are round and flat, like cushions, so they can squeeze through narrow tubes.",
            "第三段说，红细胞又圆又扁，像小垫子一样，这样能挤过狭窄的管道。",
          ),
        ),
        ask(
          t("What does the nucleus do, according to the passage?", "根据文章，细胞核有什么作用？"),
          t("It directs what the cell does", "它指挥细胞的活动"),
          [
            t("It surrounds the cell like a bag", "它像袋子一样包住细胞"),
            t("It holds a plant upright", "它让植物保持直立"),
            t("It heals a cut on the knee", "它治好膝盖上的伤口"),
          ],
          t(
            "The fourth paragraph compares the nucleus to a control center that directs what the cell does. The membrane is the part like a bag.",
            "第四段把细胞核比作指挥中心，它指挥细胞的活动。像袋子的是细胞膜。",
          ),
        ),
      ],
    ),
    passage(
      "a-drop-of-pond-water",
      t("A Drop of Pond Water", "一滴池塘水"),
      `To most people, a jar of pond water looks like nothing but cloudy water. But put one drop on a glass slide under a microscope, and a whole crowded city comes to life.

The first thing you might notice is a green ball rolling slowly across the slide. It is a colony of algae, thousands of cells living together and making food from sunlight, just as plants do.

Then something darts past. It is shaped like the sole of a shoe and covered with tiny hairs that beat like oars, pushing it through the water. This is a paramecium, a single cell that hunts even smaller creatures.

In a corner, a blob seems to ooze along like spilled jelly. It is an amoeba. It has no fixed shape. To eat, it stretches out around its food, wraps it up and swallows it whole.

There may be tiny animals too, such as water fleas, with see-through bodies that let you watch their hearts beating.

Every one of these creatures is busy finding food, escaping danger and making copies of itself. A single drop of pond water, it turns out, holds a world as busy as any city street.`,
      [microbeWords, comparisons],
      [
        ask(
          t("How does a paramecium move?", "草履虫是怎样移动的？"),
          t("Tiny hairs beat like oars and push it along", "细小的毛像桨一样划动，推动它前进"),
          [
            t("It rolls slowly across the slide like a ball", "它像球一样慢慢滚过玻片"),
            t("It stretches out and oozes like jelly", "它伸展开来，像果冻一样缓缓流动"),
            t("It makes food from sunlight as it floats", "它一边漂浮一边利用阳光制造食物"),
          ],
          t(
            "The third paragraph says the paramecium is covered with tiny hairs that beat like oars, pushing it through the water.",
            "第三段说，草履虫身上有细小的毛，像桨一样划动，推动它在水中前进。",
          ),
        ),
        ask(
          t("How does an amoeba eat?", "变形虫怎样进食？"),
          t("It wraps itself around its food and swallows it", "它把食物包住，然后吞下去"),
          [
            t("It makes its food from sunlight", "它利用阳光制造食物"),
            t("It catches food with tiny oars", "它用小桨捕捉食物"),
            t("It waits for food to fall on it", "它等着食物落到身上"),
          ],
          t(
            "The fourth paragraph says the amoeba stretches out around its food, wraps it up and swallows it whole.",
            "第四段说，变形虫伸展身体包住食物，然后整个吞下去。",
          ),
        ),
        ask(
          t("Why does the author compare a drop of pond water to a city?", "作者为什么把一滴池塘水比作一座城市？"),
          t("It is crowded with busy living things", "里面挤满了忙碌的生物"),
          [
            t("It has streets and tall buildings", "里面有街道和高楼"),
            t("It is cloudy and dirty like city air", "它像城市的空气一样浑浊肮脏"),
            t("It is too large to fit on a slide", "它太大，放不到玻片上"),
          ],
          t(
            "The first and last paragraphs call the drop a crowded, busy city because so many creatures are finding food and escaping danger.",
            "第一段和最后一段把这滴水称为拥挤繁忙的城市，因为有这么多生物在觅食和躲避危险。",
          ),
        ),
      ],
    ),
    passage(
      "bacteria-everywhere",
      t("Bacteria Everywhere", "无处不在的细菌"),
      `Bacteria are among the smallest and oldest living things on Earth. Each one is a single cell, so small that a thousand of them could fit across the dot on this letter i. They have lived on our planet for more than three billion years, long before the first plants or animals.

Bacteria live almost everywhere: in soil, in the ocean, in boiling hot springs and in the ice of Antarctica. A spoonful of garden soil may hold more bacteria than there are people on Earth. They live on your skin and inside your body too.

Some bacteria are harmful. They can infect a cut or cause illnesses such as strep throat. When harmful bacteria get into the body, they multiply quickly. One bacterium can divide into two in about twenty minutes, so a few can become millions in a single day.

But most bacteria are harmless, and many are helpful. Bacteria in the soil break down dead leaves and turn them into food for new plants. Other bacteria help make cheese and yogurt.

Without bacteria, the world would be buried under dead plants and animals, and the soil would have no food for crops.`,
      [microbeWords, livingWords, academic2],
      [
        ask(
          t("How quickly can one bacterium become two?", "一个细菌多快能变成两个？"),
          t("In about twenty minutes", "大约二十分钟"),
          [t("In about three days", "大约三天"), t("In about a year", "大约一年"), t("In about an hour", "大约一小时")],
          t(
            "The third paragraph says one bacterium can divide into two in about twenty minutes.",
            "第三段说，一个细菌大约二十分钟就能分裂成两个。",
          ),
        ),
        ask(
          t("What is the main idea of the fourth paragraph?", "第四段的主要意思是什么？"),
          t("Most bacteria are harmless, and many help us", "大多数细菌无害，许多还对我们有益"),
          [
            t("Bacteria cause strep throat and other illnesses", "细菌会引起链球菌咽喉炎等疾病"),
            t("Bacteria live in hot springs and in ice", "细菌生活在温泉和冰里"),
            t("Bacteria are older than plants and animals", "细菌比植物和动物更古老"),
          ],
          t(
            "The fourth paragraph says most bacteria are harmless and many are helpful, then gives examples from soil and food.",
            "第四段说大多数细菌无害，许多是有益的，然后举了土壤和食物的例子。",
          ),
        ),
        ask(
          t("What would happen without bacteria, according to the passage?", "根据文章，如果没有细菌会怎样？"),
          t("Dead plants and animals would pile up, and soil would lack food", "死去的动植物会堆积起来，土壤会缺少养分"),
          [
            t("No one would ever catch an illness again", "再也不会有人生病"),
            t("Plants would grow faster than ever", "植物会长得比以往任何时候都快"),
            t("There would be more cheese and yogurt", "会有更多的奶酪和酸奶"),
          ],
          t(
            "The last paragraph says the world would be buried under dead things, and the soil would have no food for crops.",
            "最后一段说，世界会被死去的生物掩埋，土壤也没有养分供给庄稼。",
          ),
        ),
      ],
    ),
    passage(
      "molds-and-mushrooms",
      t("Molds and Mushrooms", "霉菌和蘑菇"),
      `Leave a slice of bread in a warm, damp place for a week, and fuzzy green or black spots will appear. That fuzz is mold, a kind of fungus.

Fungi are not plants, even though some of them grow in the ground. Plants make their own food from sunlight, but fungi cannot. Instead, they feed on other things, often dead or rotting ones. A mold on bread sends tiny threads into the slice and slowly digests it.

Mushrooms are fungi too. The mushroom you see above the ground is only a small part of the living thing. Under the soil spreads a huge web of threads. In one forest in the United States, the threads of a single fungus stretch across nearly ten square kilometers, which may make it one of the largest living things on Earth.

Fungi spread by making spores, tiny specks that float through the air like dust. When a spore lands somewhere warm, damp and full of food, it starts to grow.

Some fungi are dangerous. Certain wild mushrooms are poisonous, and only an expert should ever pick them. But others are very useful. One mold gave the world penicillin, a medicine that has saved millions of lives.`,
      [microbeWords, livingWords],
      [
        ask(
          t("How are fungi different from plants?", "真菌和植物有什么不同？"),
          t("Fungi cannot make their own food from sunlight", "真菌不能利用阳光制造自己的食物"),
          [
            t("Fungi never grow in the ground at all", "真菌从不生长在地里"),
            t("Fungi are always larger than plants", "真菌总比植物大"),
            t("Fungi make seeds instead of spores", "真菌产生种子而不是孢子"),
          ],
          t(
            "The second paragraph says plants make their own food from sunlight but fungi cannot, so they feed on other things.",
            "第二段说，植物利用阳光制造食物，而真菌不能，所以它们以别的东西为食。",
          ),
        ),
        ask(
          t("What does the passage say about the fungus in the American forest?", "文章怎样描述美国森林里的那种真菌？"),
          t("Its threads stretch across nearly ten square kilometers", "它的菌丝延伸近十平方公里"),
          [
            t("It is the most poisonous fungus in the world", "它是世界上最毒的真菌"),
            t("It gave the world the medicine penicillin", "它为世界带来了青霉素"),
            t("It grows only on slices of old bread", "它只长在放久了的面包片上"),
          ],
          t(
            "The third paragraph says the threads of a single fungus stretch across nearly ten square kilometers.",
            "第三段说，一种真菌的菌丝延伸了近十平方公里。",
          ),
        ),
        ask(
          t("Where does a spore start to grow?", "孢子在什么地方开始生长？"),
          t("In a warm, damp place full of food", "在温暖、潮湿、食物丰富的地方"),
          [
            t("In a cold, dry place in the sun", "在阳光下寒冷干燥的地方"),
            t("Only deep under the ocean", "只在深海里"),
            t("Only on living plants", "只在活的植物上"),
          ],
          t(
            "The fourth paragraph says a spore starts to grow when it lands somewhere warm, damp and full of food.",
            "第四段说，孢子落在温暖、潮湿、食物丰富的地方就开始生长。",
          ),
        ),
      ],
    ),
    passage(
      "yeast-makes-bread-rise",
      t("Yeast Makes Bread Rise", "酵母让面包膨胀"),
      `Grandma Lin's bread is famous on our street, and last Saturday she let me help. "The secret," she said, "is a tiny living helper."

She showed me a spoonful of yeast. It looked like brown sand, but Grandma said each grain was made of living cells, a kind of fungus that sleeps until it is fed. We stirred the yeast into warm water with a little sugar. In ten minutes, a foamy layer had formed on top. "It's awake," Grandma said, "and it's eating."

As yeast feeds on sugar, it gives off a gas called carbon dioxide. When we mixed the yeast into the flour and kneaded the dough, the gas was trapped inside in thousands of tiny bubbles. We covered the bowl with a cloth and waited. After an hour, the dough had doubled in size, like a balloon slowly filling with air.

In the hot oven, the bubbles grew larger still, and then the heat killed the yeast and set the bread. When Grandma cut the first warm slice, I could see the holes the bubbles had left.

"Remember," she said, "too hot, and you'll kill your helper before it works."`,
      [microbeWords, quoting],
      [
        ask(
          t('What does Grandma Lin mean when she says the yeast is "awake"?', '林奶奶说酵母 "awake" 是什么意思？'),
          t("The yeast has become active and is feeding", "酵母变得活跃，开始进食了"),
          [
            t("The yeast has been killed by the heat", "酵母被热量杀死了"),
            t("The yeast has turned into brown sand", "酵母变成了棕色的沙子"),
            t("The yeast has finished making the bread", "酵母已经做好了面包"),
          ],
          t(
            "Grandma says \"It's awake, and it's eating\" after the yeast forms a foamy layer, showing it has become active.",
            "酵母形成一层泡沫后，奶奶说 \"It's awake, and it's eating\"，说明它已经活跃起来了。",
          ),
        ),
        ask(
          t("Why does the dough double in size?", "面团为什么会涨大一倍？"),
          t("Gas from the yeast is trapped in tiny bubbles", "酵母产生的气体被困在小气泡里"),
          [
            t("The cloth over the bowl makes it grow", "盖在碗上的布让它长大"),
            t("The flour soaks up the warm water", "面粉吸收了温水"),
            t("The oven heat fills it with air", "烤箱的热量让它充满空气"),
          ],
          t(
            "The third paragraph says the yeast gives off carbon dioxide, which is trapped in thousands of bubbles, so the dough grows before it ever reaches the oven.",
            "第三段说，酵母放出二氧化碳，被困在成千上万的小气泡里，所以面团在进烤箱之前就涨大了。",
          ),
        ),
        ask(
          t("What warning does Grandma Lin give at the end?", "林奶奶最后给出了什么提醒？"),
          t("Water that is too hot will kill the yeast", "水太烫会杀死酵母"),
          [
            t("Too much sugar will make the bread bitter", "糖放多了面包会发苦"),
            t("The dough must rise for a whole day", "面团必须发酵一整天"),
            t("Bread must never be cut while it is warm", "面包热的时候绝不能切"),
          ],
          t(
            'She says "too hot, and you\'ll kill your helper before it works," meaning heat that is too strong kills the yeast.',
            '她说 "too hot, and you\'ll kill your helper before it works"，意思是温度太高会杀死酵母。',
          ),
        ),
      ],
    ),
    passage(
      "viruses-and-vaccines",
      t("Viruses and Vaccines", "病毒和疫苗"),
      `A virus is even smaller than a bacterium. Most viruses are so tiny that an ordinary microscope cannot show them; scientists need special microscopes that use beams of electrons instead of light.

A virus is a strange thing. On its own, it cannot eat, grow or multiply. It is little more than a set of instructions wrapped in a coat. But when a virus gets inside a living cell, it takes over the cell like a pirate capturing a ship. The cell is forced to make copies of the virus, sometimes hundreds of them, until it bursts and the new viruses spread to other cells. Colds and the flu are caused by viruses.

The body fights back. White blood cells find the invaders and destroy them, and the body remembers how to fight that virus next time.

A vaccine uses this memory. It shows the body a harmless piece or weakened form of a virus, so the body learns to recognize it without getting sick. If the real virus ever arrives, the body is ready. More than two hundred years ago, the doctor Edward Jenner made one of the first vaccines, against a deadly disease called smallpox. Today, smallpox has been wiped out.`,
      [livingWords, comparisons, academic2],
      [
        ask(
          t("What does the comparison to a pirate explain?", "把病毒比作海盗说明了什么？"),
          t("A virus takes control of a cell and uses it", "病毒控制细胞并利用它"),
          [
            t("A virus sails through the blood like a ship", "病毒像船一样在血液里航行"),
            t("A virus steals food and then leaves", "病毒偷走食物然后离开"),
            t("A virus is larger than the cell it attacks", "病毒比它攻击的细胞还大"),
          ],
          t(
            "Like a pirate capturing a ship, a virus takes over a cell and forces it to make copies of the virus.",
            "就像海盗劫持船只一样，病毒控制细胞，迫使它复制病毒。",
          ),
        ),
        ask(
          t("How does a vaccine protect the body?", "疫苗怎样保护身体？"),
          t("It teaches the body to recognize a virus without getting sick", "它让身体学会识别病毒而不生病"),
          [
            t("It kills every white blood cell in the body", "它杀死体内所有的白细胞"),
            t("It makes the cells burst and release the virus", "它让细胞破裂并释放病毒"),
            t("It makes the body grow a coat around each cell", "它让身体给每个细胞长一层外衣"),
          ],
          t(
            "The fourth paragraph says a vaccine shows the body a harmless form of a virus so it learns to recognize it.",
            "第四段说，疫苗让身体接触病毒的无害形式，从而学会识别它。",
          ),
        ),
        ask(
          t("Why do scientists need special microscopes to see most viruses?", "为什么科学家需要特殊的显微镜才能看到大多数病毒？"),
          t("Viruses are too small for ordinary microscopes", "病毒太小，普通显微镜看不见"),
          [
            t("Viruses hide inside white blood cells", "病毒藏在白细胞里"),
            t("Viruses only appear in the dark", "病毒只在黑暗中出现"),
            t("Viruses move too fast to see", "病毒移动太快，看不清"),
          ],
          t(
            "The first paragraph says most viruses are so tiny that an ordinary microscope cannot show them.",
            "第一段说，大多数病毒太小，普通显微镜看不到。",
          ),
        ),
      ],
    ),
    passage(
      "helpful-microbes-inside-you",
      t("Helpful Microbes Inside You", "你体内的有益微生物"),
      `Right now, trillions of microbes are living inside you, most of them in your gut. Together they weigh about as much as a large mango. That might sound alarming, but most of them are not invaders. They are partners.

Your gut microbes help you digest food. Some of the fiber in fruit, vegetables and beans cannot be broken down by your body alone. The microbes break it down for you and, in return, they get a warm home and a steady supply of food. Scientists call this kind of partnership, in which both sides benefit, mutualism.

The microbes do even more. Some make vitamins your body needs. Others take up space and food that harmful bacteria would otherwise use, a little like a full parking lot that leaves no room for troublemakers.

What you eat affects which microbes thrive. Foods with plenty of fiber feed the helpful ones. Yogurt and some other foods even contain live microbes that join the ones already there.

Scientists are only beginning to understand this hidden world. Some believe that gut microbes may affect our health in ways we have not yet discovered. One thing is clear: you are never truly alone.`,
      [livingWords, comparisons],
      [
        ask(
          t("What is mutualism, as the passage uses the word?", "文中的 mutualism 是什么意思？"),
          t("A partnership in which both sides benefit", "双方都受益的伙伴关系"),
          [
            t("An illness caused by bacteria in the gut", "肠道细菌引起的疾病"),
            t("A food that contains live microbes", "含有活微生物的食物"),
            t("A way of breaking down vitamins", "分解维生素的一种方式"),
          ],
          t(
            "The second paragraph defines mutualism as a partnership in which both sides benefit, like you and your gut microbes.",
            "第二段把 mutualism 定义为双方都受益的伙伴关系，就像你和你的肠道微生物。",
          ),
        ),
        ask(
          t("What does the comparison to a full parking lot explain?", "把肠道比作停满车的停车场说明了什么？"),
          t("Helpful microbes leave no room for harmful ones", "有益微生物不给有害微生物留空间"),
          [
            t("Microbes travel around the body in cars", "微生物开着车在体内移动"),
            t("The gut is too full to digest food", "肠道太满，无法消化食物"),
            t("Harmful bacteria make the gut larger", "有害细菌让肠道变大"),
          ],
          t(
            "The third paragraph says helpful microbes take up the space and food harmful bacteria would use, like a full parking lot with no room left.",
            "第三段说，有益微生物占据了有害细菌要用的空间和食物，就像停满车、没有空位的停车场。",
          ),
        ),
        ask(
          t("What do the microbes get from you?", "微生物从你这里得到了什么？"),
          t("A warm home and a steady supply of food", "温暖的家和稳定的食物来源"),
          [
            t("Vitamins that they cannot make themselves", "它们自己不能制造的维生素"),
            t("A place to hide from yogurt", "躲避酸奶的地方"),
            t("Fiber that they turn into mangoes", "它们能变成芒果的纤维"),
          ],
          t(
            "The second paragraph says the microbes get a warm home and a steady supply of food in return for their work.",
            "第二段说，微生物帮你干活，作为回报得到温暖的家和稳定的食物来源。",
          ),
        ),
      ],
    ),
  ],
};
