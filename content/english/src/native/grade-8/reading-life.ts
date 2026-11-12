// Grade 8: the reading unit of the sixth theme, the story of life, from the first fossil hunters and the naming of
// species to Darwin's voyage, the rock record, the laws of heredity and the arguments scientists still have.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grade-5/reading-kit.ts";

const evolutionWords = { topic: "words-of-evolution", weight: 0.3 } as const;
const classifyingWords = { topic: "words-of-classifying-life", weight: 0.3 } as const;
const fossilWords = { topic: "words-of-fossils-and-genes", weight: 0.3 } as const;
const greekRoots = { topic: "greek-roots-5", weight: 0.1 } as const;
const scientificArgument = { topic: "evaluating-a-scientific-argument", weight: 0.2 } as const;
const irrelevant = { topic: "irrelevant-evidence", weight: 0.2 } as const;
const academic1 = { topic: "academic-words-1", weight: 0.1 } as const;
const academic2 = { topic: "academic-words-2", weight: 0.1 } as const;
const academic3 = { topic: "academic-words-3", weight: 0.1 } as const;

/** theStoryOfLife is a reading unit of grade 8 on fossils, classification, evolution and heredity. */
export const theStoryOfLife: ReadingUnitDef = {
  id: "the-story-of-life",
  title: t("The Story of Life", "生命的故事"),
  passages: [
    passage(
      "the-fossil-hunter-of-lyme",
      t("The Fossil Hunter of Lyme", "莱姆镇的化石猎人"),
      `In the early 1800s, the cliffs near the English town of Lyme Regis were crumbling into the sea. Each winter storm broke off chunks of soft gray rock, and in that rock lay the remains of strange creatures. A young woman named Mary Anning made her living by searching the beach for them and selling them to collectors and tourists.

Mary's family was poor, and her father died when she was eleven. She had little schooling, but she taught herself to read scientific papers and to draw what she found. When she was about twelve, she and her brother uncovered the skull and then the skeleton of an animal more than five meters long, with a long snout and huge eyes. Scientists later named it Ichthyosaurus, which means "fish lizard," although it was neither a fish nor a lizard. It was a reptile that had lived in the sea.

Over the following years, Anning made other remarkable finds, including the first complete skeleton of a plesiosaur, a sea reptile with a long neck and four flippers. Some experts at first refused to believe it was real and suspected that she had joined bones from different animals. When the skeleton was examined carefully, they had to admit that she was right.

Her discoveries helped convince scientists of something that many people found hard to accept: that whole kinds of animals had once lived on Earth and had since disappeared. The idea of extinction changed the way people understood the history of life.

Because she was a woman and not wealthy, Anning was not allowed to join the scientific societies of her day, and men often published descriptions of her finds without naming her. Today, she is recognized as one of the great pioneers of paleontology.`,
      [fossilWords, evolutionWords, classifyingWords, greekRoots],
      [
        ask(
          t("Why were fossils easy to find near Lyme Regis?", "为什么在莱姆里吉斯附近很容易找到化石？"),
          t("Storms kept breaking off chunks of the soft cliffs where the fossils lay", "风暴不断从埋着化石的松软悬崖上冲下大块岩石"),
          [
            t("Collectors buried them on the beach for tourists", "收藏家把它们埋在海滩上给游客找"),
            t("The town had a large museum of fossils", "镇上有一座大型化石博物馆"),
            t("Mary Anning's father had dug a mine there", "玛丽·安宁的父亲在那里挖了一座矿"),
          ],
          t(
            "The first paragraph says each winter storm broke off chunks of soft rock, and in that rock lay the remains of strange creatures.",
            "第一段说每次冬季风暴都会冲下大块松软的岩石，而岩石里埋着奇异生物的遗骸。",
          ),
        ),
        ask(
          t("Why did some experts doubt the plesiosaur skeleton at first?", "为什么一些专家起初怀疑蛇颈龙骨架？"),
          t("They suspected she had joined bones from different animals", "他们怀疑她把不同动物的骨头拼在了一起"),
          [
            t("They thought it was the skeleton of a modern whale", "他们认为那是现代鲸鱼的骨架"),
            t("They believed she had bought it from a collector", "他们认为她是从收藏家那里买来的"),
            t("They knew that she could not read", "他们知道她不识字"),
          ],
          t(
            "The third paragraph says some experts suspected that she had joined bones from different animals, until a careful examination proved her right.",
            "第三段说一些专家怀疑她把不同动物的骨头拼在一起，直到仔细检查证明她是对的。",
          ),
        ),
        ask(
          t("What idea did Anning's discoveries help scientists accept?", "安宁的发现帮助科学家接受了什么观点？"),
          t("Whole kinds of animals had lived on Earth and then disappeared", "整类动物曾生活在地球上，后来消失了"),
          [
            t("All reptiles once lived in the sea", "所有爬行动物曾经都生活在海里"),
            t("Fish and lizards are closely related", "鱼和蜥蜴是近亲"),
            t("The cliffs of England are the oldest in the world", "英格兰的悬崖是世界上最古老的"),
          ],
          t(
            "The fourth paragraph says her finds helped convince scientists that whole kinds of animals had once lived and had since disappeared, the idea of extinction.",
            "第四段说她的发现帮助科学家相信，整类动物曾经存在后来又消失了，也就是灭绝的观念。",
          ),
        ),
      ],
      ["English", "Lyme", "Regis", "Mary", "Anning", "Mary's", "Anning's", "Ichthyosaurus", "Earth"],
    ),
    passage(
      "a-name-for-every-living-thing",
      t("A Name for Every Living Thing", "给每一种生物一个名字"),
      `By the 1700s, explorers and naturalists were sending thousands of unknown plants and animals back to Europe. Scientists struggled to keep track of them, because each one might have several names in different languages, and a scientific name could be a long Latin description of a dozen words. A Swedish botanist named Carl Linnaeus decided that this confusion had to end.

Linnaeus proposed a simpler system. Every species would have a name of just two parts. The first part named its genus, a group of closely related species, and the second part named the species itself. Humans became Homo sapiens, meaning "wise human." The house cat became Felis catus. The system was short, it was the same in every country, and it showed at a glance which species were related.

Linnaeus also arranged living things into larger and larger groups, like boxes inside boxes. Related genera formed a family, families formed an order, orders formed a class, and so on up to a kingdom. Later scientists added the level of the phylum. In this taxonomy, a lion and a house cat share a family, while a lion and a whale share only the class of mammals.

Linnaeus based his groups mostly on what living things looked like, and he made mistakes. At first, he grouped whales with fish, before deciding that they belonged with mammals because they breathe air and feed their young on milk. Today, scientists also compare the genes of living things, which sometimes reveals that species that look alike are only distant relatives.

Linnaeus himself named more than ten thousand species. His two-part names are still used by every biologist in the world.`,
      [classifyingWords, evolutionWords, scientificArgument, academic1],
      [
        ask(
          t("What problem was Linnaeus trying to solve?", "林奈想要解决什么问题？"),
          t("Species had several names and long descriptions, which caused confusion", "物种有好几个名字和冗长的描述，造成了混乱"),
          [
            t("Explorers were not bringing back enough new species", "探险家带回的新物种不够多"),
            t("Scientists did not know how to speak Latin", "科学家不会说拉丁语"),
            t("Many plants were becoming extinct", "许多植物正在灭绝"),
          ],
          t(
            "The first paragraph says each species might have several names and a scientific name could be a dozen words long, and Linnaeus decided this confusion had to end.",
            "第一段说每个物种可能有好几个名字，学名可能长达十几个词，林奈决定结束这种混乱。",
          ),
        ),
        ask(
          t("In the name Felis catus, what does Felis name?", "在 Felis catus 这个名字中，Felis 指的是什么？"),
          t("The genus, a group of closely related species", "属，即一组亲缘关系很近的物种"),
          [
            t("The kingdom of all animals", "所有动物所属的界"),
            t("The country where the cat was found", "发现这种猫的国家"),
            t("The scientist who named the cat", "给这种猫命名的科学家"),
          ],
          t(
            "The second paragraph explains that the first part of a two-part name names the genus and the second names the species.",
            "第二段解释说，双名中的第一部分指属，第二部分指种。",
          ),
        ),
        ask(
          t("What evidence made Linnaeus move whales from the fish to the mammals?", "什么证据使林奈把鲸从鱼类移到哺乳动物中？"),
          t("Whales breathe air and feed their young on milk", "鲸呼吸空气并用乳汁喂养幼崽"),
          [
            t("Whales are larger than any fish", "鲸比任何鱼都大"),
            t("Whales live in every ocean", "鲸生活在每一个大洋中"),
            t("Whales have the same genes as cats", "鲸和猫有相同的基因"),
          ],
          t(
            "The fourth paragraph says he decided whales belonged with mammals because they breathe air and feed their young on milk; size and range do not decide the group.",
            "第四段说他认为鲸属于哺乳动物，因为它们呼吸空气并用乳汁喂养幼崽；体型和分布范围并不决定类别。",
          ),
        ),
      ],
      ["Europe", "Swedish", "Carl", "Linnaeus", "Latin", "Homo", "sapiens", "Felis", "catus"],
    ),
    passage(
      "the-finches-of-the-galapagos",
      t("The Finches of the Galápagos", "加拉帕戈斯群岛的雀鸟"),
      `In 1835, a British survey ship named the Beagle reached the Galápagos, an archipelago of volcanic islands in the Pacific Ocean about a thousand kilometers from South America. On board was a young naturalist named Charles Darwin. During the five weeks the ship spent there, Darwin collected rocks, plants, insects and birds, among them a number of small brown birds that he did not think were very important.

Back in England, Darwin gave his birds to an expert named John Gould, who made a surprising report. The birds were all finches, but they belonged to about a dozen different species, and most of them lived nowhere else on Earth. They differed mainly in their beaks. Some had thick, strong beaks for cracking hard seeds. Others had thin, pointed beaks for catching insects. One species even used cactus spines as tools to dig insects out of wood.

Darwin began to wonder why so many similar species should live on a small group of islands. He suggested that a few finches from the mainland had arrived long ago and that their descendants had slowly changed to fit the food on each island. Birds whose beaks were best suited to the available food survived and raised more young. Over many generations, the populations diverged into separate species. Darwin called this process natural selection.

In the 1970s, two biologists, Peter and Rosemary Grant, began studying the finches on a tiny island called Daphne Major. During a severe drought in 1977, most of the small, soft seeds disappeared. Finches with larger beaks, which could crack the remaining hard seeds, were more likely to survive, and the next generation had beaks that were measurably larger. The Grants had watched evolution happen.`,
      [evolutionWords, scientificArgument, academic3, academic2],
      [
        ask(
          t("What did John Gould discover about Darwin's birds?", "约翰·古尔德发现了达尔文的鸟有什么特点？"),
          t("They were about a dozen species of finch that differed mainly in their beaks", "它们是大约十几种雀鸟，主要区别在于喙"),
          [
            t("They were all one species of finch", "它们全是同一种雀鸟"),
            t("They had been brought from England by sailors", "它们是水手从英格兰带去的"),
            t("They were the same as the finches of South America", "它们与南美洲的雀鸟相同"),
          ],
          t(
            "The second paragraph says the birds were all finches but belonged to about a dozen species, differing mainly in their beaks.",
            "第二段说这些鸟都是雀鸟，但属于大约十几个不同的物种，主要区别在于喙。",
          ),
        ),
        ask(
          t(
            "According to Darwin's explanation, why did beaks differ from island to island?",
            "按照达尔文的解释，为什么各个岛上的鸟喙不同？",
          ),
          t("Birds with beaks suited to the local food survived and raised more young", "喙适合当地食物的鸟存活下来，并养育了更多后代"),
          [
            t("Each finch chose a new beak shape when it arrived", "每只雀鸟到达时都选择了新的喙形"),
            t("The volcanoes changed the birds' beaks", "火山改变了鸟的喙"),
            t("Sailors fed the birds different foods", "水手给鸟喂不同的食物"),
          ],
          t(
            "The third paragraph says birds whose beaks were best suited to the available food survived and raised more young, and over generations the populations diverged.",
            "第三段说喙最适合现有食物的鸟存活下来并养育了更多后代，经过许多代，种群逐渐分化。",
          ),
        ),
        ask(
          t("Why is the Grants' study strong evidence for natural selection?", "为什么格兰特夫妇的研究是自然选择的有力证据？"),
          t("They measured a change in beak size after a drought changed the food", "他们测量到干旱改变食物后，鸟喙尺寸发生了变化"),
          [
            t("They found finch fossils millions of years old", "他们发现了数百万年前的雀鸟化石"),
            t("They studied the same island Darwin visited for five weeks", "他们研究了达尔文停留五周的同一个岛"),
            t("They proved that finches use cactus spines as tools", "他们证明了雀鸟用仙人掌刺作工具"),
          ],
          t(
            "The Grants observed the cause, a drought that left only hard seeds, and measured the effect, larger beaks in the next generation, which tests Darwin's idea directly.",
            "格兰特夫妇观察到了原因（干旱只留下坚硬的种子），并测量了结果（下一代的喙更大），这直接检验了达尔文的观点。",
          ),
        ),
      ],
      [
        "British",
        "Beagle",
        "Galápagos",
        "Pacific",
        "Ocean",
        "South",
        "America",
        "Charles",
        "Darwin",
        "England",
        "John",
        "Gould",
        "Earth",
        "Peter",
        "Rosemary",
        "Grant",
        "Grants",
        "Daphne",
        "Major",
        "Darwin's",
        "Grants'",
      ],
    ),
    passage(
      "pages-of-stone",
      t("Pages of Stone", "石头书页"),
      `If you stand at the edge of the Grand Canyon in Arizona, you can see bands of rock in different colors stacked on top of one another, nearly two kilometers deep. Each band, or layer, was formed from mud, sand or the shells of sea creatures that settled at the bottom of an ancient sea, lake or desert and slowly hardened into stone. Geologists read these strata like the pages of a book.

The basic rule is simple. In layers that have not been disturbed, the lowest layer formed first and is the oldest, while the top layer is the youngest. A Danish scientist named Nicolas Steno described this rule in 1669. It means that fossils found in deeper layers are generally older than fossils found above them.

In the early 1800s, an English surveyor named William Smith noticed something else while he was digging canals. Each layer of rock contained its own particular set of fossils, and the same order of fossils appeared wherever the layers were found, even hundreds of kilometers apart. This allowed geologists to match layers in different places and to build a timeline of Earth's past, which they divided into eras and periods.

This timeline showed which rocks were older, but not how old they were in years. That answer came in the twentieth century, when scientists learned to measure the slow, steady decay of radioactive elements in certain rocks. Using this method, they found that the oldest rocks at the bottom of the Grand Canyon are nearly two billion years old, and that Earth itself is about four and a half billion years old.

In that vast span of geologic time, human beings are newcomers. If Earth's history were a single day, humans would appear only in the last few seconds before midnight.`,
      [fossilWords, greekRoots, academic3],
      [
        ask(
          t(
            "According to Steno's rule, which layer of undisturbed rock is the oldest?",
            "根据斯丹诺的规则，未受扰动的岩层中哪一层最古老？",
          ),
          t("The lowest layer", "最下面的一层"),
          [t("The top layer", "最上面的一层"), t("The thickest layer", "最厚的一层"), t("The most colorful layer", "颜色最鲜艳的一层")],
          t(
            "The second paragraph says that in layers that have not been disturbed, the lowest layer formed first and is the oldest.",
            "第二段说在未受扰动的岩层中，最下面的一层最先形成，也最古老。",
          ),
        ),
        ask(
          t("What did William Smith's discovery allow geologists to do?", "威廉·史密斯的发现使地质学家能够做什么？"),
          t("Match rock layers in different places by the fossils they contained", "根据所含化石来对应不同地方的岩层"),
          [
            t("Measure the age of rocks in years", "以年为单位测量岩石的年龄"),
            t("Dig canals more quickly", "更快地挖掘运河"),
            t("Find gold in the layers of rock", "在岩层中找到黄金"),
          ],
          t(
            "The third paragraph says each layer had its own set of fossils in the same order everywhere, which allowed geologists to match layers in different places.",
            "第三段说每一层都有自己特有的化石，而且到处顺序相同，这使地质学家能够对应不同地方的岩层。",
          ),
        ),
        ask(
          t("What is the purpose of the comparison in the last paragraph?", "最后一段中的比较有什么目的？"),
          t("To show how short human history is compared with Earth's history", "说明人类历史与地球历史相比是多么短暂"),
          [
            t("To explain how a day is measured", "解释一天是如何计算的"),
            t("To show that humans lived before the dinosaurs", "说明人类生活在恐龙之前"),
            t("To prove that the Grand Canyon formed in a day", "证明大峡谷是在一天内形成的"),
          ],
          t(
            "Compressing four and a half billion years into one day, with humans in the last seconds, makes the vast span of geologic time easy to picture.",
            "把四十五亿年压缩成一天、人类只出现在最后几秒，使人们容易想象地质时间的漫长。",
          ),
        ),
      ],
      ["Grand", "Canyon", "Arizona", "Danish", "Nicolas", "Steno", "English", "William", "Smith", "Earth's", "Earth", "Steno's", "Smith's"],
    ),
    passage(
      "the-great-dying",
      t("The Great Dying", "大灭绝"),
      `For almost three hundred million years, the seas of the world were full of trilobites. These hard-shelled animals, distant relatives of today's crabs and insects, crawled along the sea floor, swam in open water and burrowed in the mud. More than twenty thousand species have been identified from their fossils, from creatures smaller than a grain of rice to some longer than a person's arm. Then, about two hundred and fifty-two million years ago, they vanished.

The trilobites were victims of the worst disaster in the history of life, an event that scientists call the end-Permian extinction, or simply the Great Dying. Within a geologically short time, perhaps less than a hundred thousand years, about nine out of ten species in the sea and seven out of ten species on land died out.

What could kill so much life? The strongest evidence points to a series of enormous volcanic eruptions in what is now Siberia. For hundreds of thousands of years, lava poured out across an area almost the size of Europe, releasing vast amounts of carbon dioxide and other gases. The planet grew much hotter, the oceans became more acidic and lost much of their oxygen, and many animals could not survive the change.

The Great Dying is one of five mass extinctions that scientists have identified in the rock record. The most famous came about sixty-six million years ago, when an asteroid struck what is now Mexico and the large dinosaurs disappeared.

Each extinction was also a new beginning. With so many species gone, the survivors spread into empty habitats and evolved into new forms. After the Great Dying, the early ancestors of dinosaurs and mammals appeared. Some scientists warn that human activity today may be causing a sixth mass extinction.`,
      [fossilWords, evolutionWords, classifyingWords, scientificArgument, academic1, academic2],
      [
        ask(
          t("What does the strongest evidence suggest caused the Great Dying?", "最有力的证据表明大灭绝的原因是什么？"),
          t("Enormous volcanic eruptions that heated the planet and changed the oceans", "巨大的火山喷发，使地球变暖并改变了海洋"),
          [
            t("An asteroid that struck Mexico", "撞击墨西哥的一颗小行星"),
            t("Trilobites that ate all the other animals", "吃掉了所有其他动物的三叶虫"),
            t("A sudden ice age that froze the seas", "冰封海洋的突然冰期"),
          ],
          t(
            "The third paragraph says the strongest evidence points to enormous eruptions in Siberia; the asteroid is linked to a different extinction sixty-six million years ago.",
            "第三段说最有力的证据指向西伯利亚的巨大喷发；小行星与六千六百万年前的另一次灭绝有关。",
          ),
        ),
        ask(
          t("How does the author show the size of the Great Dying?", "作者如何表现大灭绝的规模？"),
          t("By giving the share of species that died in the sea and on land", "通过给出海洋和陆地上灭绝物种的比例"),
          [
            t("By describing the size of a trilobite", "通过描述三叶虫的大小"),
            t("By listing every species that died", "通过列出每一个灭绝的物种"),
            t("By comparing it with a single day", "通过把它与一天相比"),
          ],
          t(
            "The second paragraph says about nine out of ten species in the sea and seven out of ten on land died out, figures that show the scale.",
            "第二段说海洋中约十分之九、陆地上约十分之七的物种灭绝了，这些数字表明了规模。",
          ),
        ),
        ask(
          t('Why does the author call each extinction "a new beginning"?', "为什么作者把每次灭绝称为“新的开始”？"),
          t("Survivors spread into empty habitats and evolved into new forms", "幸存者扩散到空出的栖息地，并进化出新的形态"),
          [
            t("The species that died came back later", "灭绝的物种后来又回来了"),
            t("Each extinction ended the age of the dinosaurs", "每次灭绝都结束了恐龙时代"),
            t("Scientists began a new rock record each time", "科学家每次都开始一份新的岩石记录"),
          ],
          t(
            "The last paragraph says that with so many species gone, the survivors spread into empty habitats and evolved into new forms.",
            "最后一段说由于许多物种消失，幸存者扩散到空出的栖息地并进化出新的形态。",
          ),
        ),
      ],
      ["Permian", "Great", "Dying", "Siberia", "Europe", "Mexico"],
    ),
    passage(
      "the-monk-and-the-peas",
      t("The Monk and the Peas", "修道士与豌豆"),
      `Children often look like their parents, but for most of history no one understood why. Many people believed that the traits of a mother and father simply blended together in their children, like two colors of paint. The person who showed that this was wrong was a monk named Gregor Mendel, who worked in a monastery garden in what is now the Czech Republic.

Between 1856 and 1863, Mendel grew and studied about twenty-eight thousand pea plants. He chose peas because they grow quickly and have traits that are easy to see: tall or short stems, purple or white flowers, smooth or wrinkled seeds. He carefully transferred pollen from one plant to another to breed plants with known parents, and he counted the results.

When Mendel crossed a pure tall plant with a pure short plant, all the hybrid offspring were tall. The short trait seemed to have vanished. But when he let those hybrids breed with each other, about one in four of the next generation was short again. The trait had not blended away. It had been hidden.

Mendel explained his results by suggesting that each plant carries two "factors" for every trait, one from each parent. One factor can hide the effect of the other. Today we call these factors genes, and we know they are carried on chromosomes inside every cell.

Mendel published his findings in 1866, but almost no one paid attention. His paper was read by few scientists, and his use of mathematics in biology was unusual. In 1900, sixteen years after his death, three scientists working separately rediscovered his laws. Mendel is now known as the father of genetics, and in 2003 scientists completed the reading of the entire human genome.`,
      [fossilWords, classifyingWords, scientificArgument, academic2],
      [
        ask(
          t("Why did Mendel choose to study pea plants?", "孟德尔为什么选择研究豌豆？"),
          t("They grow quickly and have traits that are easy to see", "它们生长迅速，而且性状容易观察"),
          [
            t("They were the only plants in the monastery garden", "它们是修道院花园里唯一的植物"),
            t("They do not need pollen to grow", "它们生长不需要花粉"),
            t("Their traits always blend together", "它们的性状总是混合在一起"),
          ],
          t(
            "The second paragraph says he chose peas because they grow quickly and have traits that are easy to see.",
            "第二段说他选择豌豆是因为它们生长迅速，而且性状容易观察。",
          ),
        ),
        ask(
          t("Which result disproved the idea that traits simply blend?", "哪个结果推翻了性状只是混合的观点？"),
          t("Short plants reappeared in the generation after the all-tall hybrids", "在全是高茎的杂交后代之后的一代中又出现了矮茎植物"),
          [
            t("All the hybrid offspring were tall", "所有杂交后代都是高茎"),
            t("Mendel grew twenty-eight thousand plants", "孟德尔种植了两万八千株植物"),
            t("Some pea plants had purple flowers", "一些豌豆开紫色的花"),
          ],
          t(
            "If traits blended, the short trait could not return; its reappearance in about one in four plants showed it had been hidden, not mixed away.",
            "如果性状是混合的，矮茎性状就不可能再出现；它在约四分之一的植株中重新出现，说明它只是被隐藏了，而不是被混合掉了。",
          ),
        ),
        ask(
          t("Why was Mendel's work ignored at first?", "孟德尔的研究为什么起初被忽视？"),
          t(
            "Few scientists read his paper, and his use of mathematics in biology was unusual",
            "很少有科学家读过他的论文，而且他在生物学中使用数学很不寻常",
          ),
          [
            t("His experiments were shown to be false", "他的实验被证明是错误的"),
            t("He refused to publish his results", "他拒绝发表他的结果"),
            t("He studied animals instead of plants", "他研究的是动物而不是植物"),
          ],
          t(
            "The last paragraph says his paper was read by few scientists and his use of mathematics in biology was unusual.",
            "最后一段说他的论文很少有科学家读过，而且他在生物学中使用数学很不寻常。",
          ),
        ),
      ],
      ["Gregor", "Mendel", "Czech", "Republic", "Mendel's"],
    ),
    passage(
      "a-fish-with-legs",
      t("A Fish with Legs", "长腿的鱼"),
      `Scientists had long believed that the first animals with four legs evolved from fish that lived in shallow water. But for many years there was a gap in the fossil record. Rocks about 385 million years old held fossils of fish, and rocks about 365 million years old held fossils of early four-legged animals, but nothing in between had been found.

In 1999, a paleontologist named Neil Shubin and his colleagues decided to look for the missing creature. Instead of searching at random, they made a prediction. If such an animal had existed, its fossils should be in rocks about 375 million years old that had formed in shallow streams. Using geologic maps, they found rocks of the right age and type on Ellesmere Island, in the Arctic north of Canada.

The search was not easy. The team could work only during the short Arctic summer, and for four seasons they found little. Then, in 2004, they uncovered the flat head of an animal sticking out of the rock. They named it Tiktaalik, a word from the Inuktitut language of the region.

Tiktaalik had scales and gills like a fish, but it also had a flat head like a crocodile, a neck that let it turn its head, and strong front fins with bones inside that matched the upper arm, forearm and wrist of a four-legged animal. It could probably prop itself up in shallow water and perhaps drag itself onto mudflats.

The discovery was important not only for what was found but for how it was found. Shubin's team predicted the age and type of rock where the fossil should be and then found it there. A theory that makes predictions that can be tested, and passes the test, earns the trust of scientists.`,
      [fossilWords, evolutionWords, scientificArgument, academic2],
      [
        ask(
          t("Why did the team search on Ellesmere Island?", "研究小组为什么在埃尔斯米尔岛搜寻？"),
          t("It had rocks of the age and type their prediction called for", "那里有他们的预测所需年代和类型的岩石"),
          [
            t("Someone had already found a fossil there", "已经有人在那里发现了化石"),
            t("It was the easiest place in the Arctic to reach", "那是北极最容易到达的地方"),
            t("The Inuktitut people had told them where to dig", "因纽特人告诉了他们在哪里挖掘"),
          ],
          t(
            "The second paragraph says they predicted the fossils should be in 375-million-year-old rocks from shallow streams, and found such rocks on Ellesmere Island.",
            "第二段说他们预测化石应该在三亿七千五百万年前浅溪形成的岩石中，并在埃尔斯米尔岛找到了这种岩石。",
          ),
        ),
        ask(
          t("Which feature of Tiktaalik was like a four-legged animal?", "提塔利克鱼的哪个特征像四足动物？"),
          t("Bones in its front fins that matched an upper arm, forearm and wrist", "前鳍中的骨头与上臂、前臂和腕部相对应"),
          [t("Its scales", "它的鳞片"), t("Its gills", "它的鳃"), t("Its life in the water", "它生活在水中")],
          t(
            "The fourth paragraph says its scales and gills were like a fish's, while its fin bones matched the upper arm, forearm and wrist of a four-legged animal.",
            "第四段说它的鳞片和鳃像鱼，而鳍骨与四足动物的上臂、前臂和腕部相对应。",
          ),
        ),
        ask(
          t(
            "According to the last paragraph, why does the way Tiktaalik was found strengthen the scientific argument?",
            "根据最后一段，为什么找到提塔利克鱼的方式加强了这一科学论证？",
          ),
          t("The theory made a prediction that was tested and turned out to be correct", "这一理论作出了预测，经过检验证明是正确的"),
          [
            t("The team searched for four seasons before finding it", "研究小组搜寻了四个季节才找到它"),
            t("The fossil was given a name from a local language", "这块化石以当地语言命名"),
            t("The Arctic summer is very short", "北极的夏天非常短"),
          ],
          t(
            "The last paragraph says the team predicted where the fossil should be and found it there; a theory that makes testable predictions and passes them earns trust.",
            "最后一段说研究小组预测了化石应在的位置并在那里找到了它；能作出可检验预测并通过检验的理论会赢得信任。",
          ),
        ),
      ],
      ["Neil", "Shubin", "Ellesmere", "Island", "Arctic", "Canada", "Tiktaalik", "Inuktitut", "Shubin's"],
    ),
    passage(
      "should-we-bring-back-the-mammoth",
      t("Should We Bring Back the Mammoth?", "我们应该让猛犸象复活吗？"),
      `Woolly mammoths roamed the cold grasslands of Europe, Asia and North America during the last ice age. The last small group survived on Wrangel Island, off the coast of Siberia, until about four thousand years ago, when the pyramids of Egypt had already been built. Because mammoths lived in frozen regions, some of their bodies have been found preserved in ice, with hair, skin and even blood. Scientists have used these remains to read much of the mammoth's genome.

Some scientists now want to use this knowledge to bring the mammoth back, or at least to create an animal like it. The plan is to take cells from an Asian elephant, the mammoth's closest living relative, and change some of its genes to match the mammoth's, giving it thick hair, small ears and a layer of fat against the cold.

Supporters argue that herds of these animals could help protect the Arctic. When mammoths grazed, they trampled snow and knocked down trees, which kept the grasslands open and the frozen ground beneath them cold. Restoring that habitat, they say, could slow the melting of frozen soil that releases greenhouse gases. They also point out that the mammoth was a magnificent animal whose pictures appear in cave paintings made by early humans.

Critics raise serious objections. Elephants are intelligent, social animals, and the first animals produced would grow up without a herd of their own kind to learn from. The project would cost enormous sums that could be used to protect elephants and other species facing extinction today. And no one knows how a new animal would affect the plants and animals that live in the Arctic now.

The question is not only whether scientists can bring back the mammoth, but whether they should.`,
      [fossilWords, classifyingWords, evolutionWords, irrelevant, academic2],
      [
        ask(
          t(
            "Which argument in the third paragraph is irrelevant to whether bringing back the mammoth would help the Arctic?",
            "第三段中哪一个论点与让猛犸象复活是否有助于北极无关？",
          ),
          t("Mammoth pictures appear in cave paintings made by early humans", "早期人类的洞穴壁画中有猛犸象的图像"),
          [
            t("Grazing mammoths kept the grasslands open", "吃草的猛犸象使草原保持开阔"),
            t("Trampling snow kept the frozen ground cold", "踩踏积雪使冻土保持寒冷"),
            t("Frozen soil releases greenhouse gases when it melts", "冻土融化时会释放温室气体"),
          ],
          t(
            "Cave paintings show that early humans admired mammoths, but they say nothing about whether mammoths would protect the Arctic today.",
            "洞穴壁画说明早期人类欣赏猛犸象，但它们与猛犸象今天能否保护北极毫无关系。",
          ),
        ),
        ask(
          t("Why would scientists start with an Asian elephant?", "为什么科学家要从亚洲象入手？"),
          t("It is the mammoth's closest living relative", "它是猛犸象现存的最近亲缘物种"),
          [
            t("It already has thick hair and small ears", "它已经有浓密的毛和小耳朵"),
            t("It lives on Wrangel Island", "它生活在弗兰格尔岛上"),
            t("Its genome is the same as the mammoth's", "它的基因组与猛犸象的相同"),
          ],
          t(
            "The second paragraph names the Asian elephant as the mammoth's closest living relative, whose genes would be changed to match the mammoth's.",
            "第二段指出亚洲象是猛犸象现存的最近亲缘物种，科学家会改变它的基因使之与猛犸象相符。",
          ),
        ),
        ask(
          t("Which objection is about the welfare of the animals themselves?", "哪一个反对意见是关于动物本身福祉的？"),
          t("The first animals would grow up without a herd of their own kind", "第一批动物会在没有同类象群的环境中长大"),
          [
            t("The project would cost enormous sums", "这个项目将耗资巨大"),
            t("No one knows how the animal would affect the Arctic", "没有人知道这种动物会如何影响北极"),
            t("The last mammoths lived on an island", "最后的猛犸象生活在一个岛上"),
          ],
          t(
            "Growing up without a herd to learn from would harm intelligent, social animals; the other objections concern money and the Arctic.",
            "在没有象群可以学习的环境中长大会伤害聪明而合群的动物；其他反对意见涉及金钱和北极。",
          ),
        ),
      ],
      ["Europe", "Asia", "North", "America", "Wrangel", "Island", "Siberia", "Egypt", "Asian", "Arctic"],
    ),
  ],
};
