// Grade 8: the batches of words of the last five units, from evolution and gothic tales to the stage, migration,
// right and wrong, politics and the words for talking about language.

import { t } from "@ga/content";
import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const evolution = batch(
  "words-of-evolution",
  ["Words of Evolution", "进化的词"],
  ["evolution", "进化"],
  `
  fossilize|to turn into a fossil over a very long time|成为化石|Bones buried quickly in mud are more likely to ___ over millions of years.|Soft bodies rarely ___, so we know little about the earliest worms.|Buried for millions of years, the tree trunk slowly began to ___ as minerals replaced the wood.|excavate,diverge|fossilized,fossilizes
  extinction|the dying out of a whole kind of living thing|灭绝|The ___ of the dinosaurs came about sixty-six million years ago, when the last of them died.|Many frogs face ___ because their ponds are drying up and none of them may survive.|Hunting drove the dodo to ___, and not a single bird is left.|selection,lineage|extinctions
  naturalist|a person who studies plants and animals in nature|博物学家|The young ___ collected beetles and pressed flowers in every field she crossed.|Darwin sailed on the Beagle as the ship's ___, studying the living plants and animals of each shore.|The ___ wrote careful notes on each bird he saw in the woods.|paleontologist,cartographer|naturalists
  finch|a small songbird with a short, thick beak for cracking seeds|雀科鸣鸟|Each ___ on the islands had a beak shaped for the seeds it ate.|A ___ landed on the feeder, sang a short song and cracked open a seed.|Darwin noticed that each little ___ on one island had a different beak from those on the next.|primate,grazer|finches
  archipelago|a group of islands|群岛|The Galápagos Islands together make up the ___ that Darwin explored in the Pacific.|Ships sailed slowly through the ___, from one island to the next.|Indonesia, with thousands of islands, is the largest ___ in the world.|wetland,enclave|archipelagos
  diverge|to separate and go in different directions, or to become different|分化，分歧|Over many generations, the two groups of birds began to ___ until they looked like different kinds.|The paths ___ at the old oak tree, one going left and one going right.|When populations are cut off from each other, their features slowly ___ and grow more different.|assimilate,fossilize|diverges,diverged,divergence
  lineage|the line of ancestors from which a person, animal or plant comes|血统，世系|Scientists traced the whale's ___ back through its ancestors to animals that lived on land.|Her family's ___ goes back five generations to a fishing village.|The horse's ___ includes a small ancestor the size of a dog.|extinction,selection|lineages
  hominid|any member of the family that includes humans and the great apes and their extinct relatives|人科动物|The skull came from the early ___ that walked on two legs, long before modern humans.|Every ___, from humans to gorillas, shares a common ancestor.|Footprints of the ___ were found in hardened ash, showing that it walked upright like us.|mammoth,naturalist|hominids
  primate|a member of the group of animals that includes monkeys, apes and humans|灵长类动物|The gorilla is the largest ___, a group that also includes monkeys and us.|Like every ___, the lemur has hands that can grip branches.|The zoo's ___ house has chimpanzees, gibbons and monkeys.|mammoth,reptile|primates
  selection|the process by which living things better suited to their surroundings survive and have more young|选择（自然选择）|Natural ___ explains how the finches' beaks changed to suit their food.|Through ___, moths with darker wings survived better and became common in sooty cities.|Darwin's idea that the best-suited survive, natural ___, shocked many readers.|extinction,lineage
  `,
  "context-clues",
  {
    intro: t(
      "On the **archipelago**, the young **naturalist** watched one **finch** crack seeds while another picked insects out of the bark. These ten words help you explain how living things change over many generations.",
      "在群岛（**archipelago**）上，年轻的博物学家（**naturalist**）看到一只雀（**finch**）在啄开种子，另一只却在树皮里啄虫子。这十个词帮你讲清生物怎样在许多代中慢慢改变。",
    ),
    watchOut: {
      meanings: t(
        "**Extinction** is a whole kind of living thing dying out for good; **selection** is which living things survive and have young; **lineage** is the line of ancestors a living thing comes from.",
        "**extinction** 是一个物种彻底消失；**selection** 是哪些生物能存活并繁衍；**lineage** 是一种生物的祖先世系。",
      ),
      use: t(
        "**Diverge** means to split apart and grow different; **fossilize** is what buried remains do over millions of years, and **excavate** is what scientists do to dig them out.",
        "**diverge** 是分开并变得不同；**fossilize** 是埋藏的遗骸历经亿万年变成化石；**excavate** 是科学家把它们挖出来。",
      ),
      spelling: t(
        "Watch the **ch** that says /k/ in **archipelago**, the double **s** in **fossilize**, the **e** kept in **lineage** and the **-nid** of **hominid**.",
        "注意 **archipelago** 中 **ch** 读 /k/、**fossilize** 的双写 **s**、**lineage** 保留的 **e**，以及 **hominid** 的 **-nid**。",
      ),
    },
    notes: `
      fossilize|bones buried quickly in mud turning to stone over millions of years|soft bodies that rarely last as stone, so little is known of early worms|a buried tree trunk slowly turning to stone as minerals replace the wood|fossilize is what remains do over ages; excavate is what scientists do to dig them out|fossilize 是遗骸历经漫长岁月变成化石；excavate 是科学家把它们挖出来|excavate means to dig something buried out of the ground, an action of people, not what bones do as they turn to stone|excavate 是人把埋着的东西挖出来，不是骨头变成石头的过程|diverge means to split apart and become different, not to turn slowly into stone|diverge 是分开并变得不同，不是慢慢变成石头|fos · sil · ize|the double s and the -ize ending|双写 s，结尾是 -ize
      extinction|the last dinosaurs dying about sixty-six million years ago|frogs that may not survive at all as their ponds dry up|a bird hunted until not a single one is left|extinction is a kind dying out; selection is which ones survive|extinction 是物种灭绝；selection 是哪些个体存活|selection is the process by which better-suited living things survive and have young, not the end of a whole kind|selection 是更适应环境的生物存活并繁衍的过程，不是整个物种的终结|lineage is the line of ancestors a living thing comes from, not its dying out|lineage 是一种生物的祖先世系，不是它的灭绝|ex · tinc · tion|the c before -tion|-tion 前面有 c
      naturalist|a young woman collecting beetles and pressing flowers in every field|a man on a ship studying the living plants and animals of each shore|a man writing careful notes on each bird he saw in the woods|naturalist studies living plants and animals; paleontologist studies fossils|naturalist 研究活着的动植物；paleontologist 研究化石|paleontologist studies fossils of ancient life, not living beetles and birds|paleontologist 研究远古生物的化石，不是活着的甲虫和鸟|cartographer draws maps, not notes on plants and animals|cartographer 绘制地图，不是记录动植物|nat · u · ral · ist|natural plus -ist, with the u kept|natural 加 -ist，保留 u
      finch|birds whose beaks were shaped for the seeds they ate|a small bird landing on a feeder, singing and cracking a seed|little birds whose beaks differed from island to island|finch is a small seed-eating songbird; primate is a monkey or an ape|finch 是吃种子的小鸣禽；primate 是猴子或猿|primate is a monkey, ape or human with gripping hands, not a small bird with a beak|primate 是有抓握能力的手的猴、猿或人，不是长着喙的小鸟|grazer is an animal that eats grass in fields, not a songbird that cracks seeds with its beak|grazer 是在田野里吃草的动物，不是用喙啄开种子的鸣禽|finch|the -nch ending|结尾是 -nch
      archipelago|the Galápagos Islands that Darwin explored together|ships sailing from one island to the next|a country made of thousands of islands|archipelago is a group of islands; enclave is one district inside a city|archipelago 是一群岛屿；enclave 是城市里的一个聚居区|wetland is marshy land, not a group of islands in the sea|wetland 是沼泽地，不是海中的一群岛屿|enclave is a part of a city where one group lives together, not a chain of islands|enclave 是城市里一个群体聚居的地方，不是一串岛屿|ar · chi · pel · a · go|the ch that says /k/ and the -ago ending|ch 读 /k/，结尾是 -ago
      diverge|two groups of birds growing apart until they look like different kinds|paths splitting at an oak tree, one left and one right|cut-off populations whose features slowly grow more different|diverge means to split apart and grow different; assimilate means to blend into a group|diverge 是分开并变得不同；assimilate 是融入群体|assimilate means to become part of a group and more like it, the opposite of splitting apart|assimilate 是融入群体、变得和它相像，正好和分开相反|fossilize means to turn into stone over ages, not to split and go different ways|fossilize 是历经漫长岁月变成石头，不是分开各走各路|di · verge|the -erge ending with a soft g|结尾是 -erge，g 发软音
      lineage|a whale's ancestors traced back to animals that lived on land|a family line going back five generations to a fishing village|a horse's ancestors including a small animal the size of a dog|lineage is the line of ancestors; extinction is the end of a kind|lineage 是祖先世系；extinction 是物种的终结|extinction is the dying out of a whole kind, not the chain of ancestors it came from|extinction 是整个物种灭绝，不是它所来自的祖先链条|selection is the process that decides which living things survive, not a family line traced back in time|selection 是决定哪些生物存活的过程，不是往前追溯的家族世系|lin · e · age|line plus -age, with the e kept, in three syllables|line 加 -age，保留 e，读三个音节
      hominid|an early relative walking on two legs long before modern humans|humans and gorillas sharing a common ancestor|footprints in hardened ash left by a relative that walked upright like us|hominid is a human or great ape; mammoth is a hairy elephant|hominid 是人类或类人猿；mammoth 是长毛的象|mammoth is a hairy elephant of the Ice Age that walked on four legs, not a relative of humans and apes|mammoth 是冰河时期用四条腿走路的长毛象，不是人和猿的近亲|naturalist is a person who studies nature today, not an ancient relative of humans|naturalist 是今天研究大自然的人，不是人类的远古近亲|hom · i · nid|the -nid ending, with an i, not an e|结尾是 -nid，是 i 不是 e
      primate|the gorilla, largest of the group that includes monkeys and us|a lemur with hands that can grip branches|a zoo house for chimpanzees, gibbons and monkeys|primate is the group of monkeys, apes and humans; reptile is scaly and cold-blooded|primate 是猴、猿和人这一类；reptile 有鳞且是冷血动物|mammoth is an extinct hairy elephant with tusks, not a monkey or ape with gripping hands|mammoth 是长着象牙、已灭绝的长毛象，不是有抓握能力的猴或猿|reptile is a scaly, cold-blooded animal like a lizard, not a monkey or ape|reptile 是蜥蜴那样有鳞的冷血动物，不是猴或猿|pri · mate|the i that says its name, and the -ate ending|i 读长音 /aɪ/，结尾是 -ate
      selection|the process that changed the finches' beaks to suit their food|darker moths surviving better and becoming common in sooty cities|Darwin's idea that the best-suited survive|selection decides who survives; extinction ends a kind|selection 决定谁存活；extinction 让一个物种消失|extinction is the dying out of every member of a kind, not the survival of the best suited|extinction 是一个物种全部死光，不是最适应者的存活|lineage is a line of ancestors, not the process that picks which living things survive|lineage 是祖先世系，不是挑选哪些生物存活的过程|se · lec · tion|select plus -ion|select 加 -ion
    `,
  },
);

const classifying = batch(
  "words-of-classifying-life",
  ["Words of Classifying Life", "生物分类的词"],
  ["sorting living things", "生物分类"],
  `
  taxonomy|the science of naming and sorting living things into groups|分类学|Linnaeus created the system of ___ that scientists still use to name living things.|Students of ___ give every species a two-part Latin name and a place among the groups.|The scientist spent her career on ___, naming and sorting thousands of beetles.|genus,phylum
  genus|a group of closely related species; the first part of a scientific name|属|Lions and tigers belong to the same ___, Panthera, the first part of their scientific names.|The name of the ___ is always written first, with a capital letter.|Wolves, coyotes and jackals, close cousins, share one ___, Canis.|phylum,taxonomy|genera
  phylum|a large group of living things that share a basic body plan|门（生物分类）|Insects, spiders and crabs, with their jointed legs, all belong to the same ___.|A ___ is bigger than a class but smaller than a kingdom.|Every animal with a backbone, from fish to humans, is in one ___.|genus,taxonomy|phyla
  vertebrate|an animal with a backbone|脊椎动物|The frog counts as a true ___ because it has a backbone.|Fish, birds and people all share the mark of the ___: a backbone.|Fish were the first ___ to swim in the sea, the first animals with backbones.|invertebrate,mammal|vertebrates
  invertebrate|an animal without a backbone|无脊椎动物|The octopus is a clever ___ with no bones at all.|The snail, a soft-bodied ___, carries a shell but has no backbone.|The pond was full of ___ life with no backbones: beetles, snails and worms.|vertebrate,reptile|invertebrates
  mammal|an animal that has hair or fur and feeds its young on milk|哺乳动物|The whale breathes air and feeds its calf on milk, like every other ___.|Every ___ feeds its babies on milk.|The bat, covered in fur, is the only ___ that can truly fly.|reptile,amphibian|mammals
  reptile|a cold-blooded animal with dry, scaly skin, such as a snake or lizard|爬行动物|The crocodile is the largest living ___, with thick, scaly skin.|Each ___ lays eggs with tough, leathery shells on dry land.|The lizard warmed itself on a rock, as any cold-blooded ___ with scales must.|amphibian,mammal|reptiles
  amphibian|a cold-blooded animal that lives both in water and on land, such as a frog|两栖动物|A young ___, like a tadpole, lives in water and breathes through gills.|The newt is the kind of ___ that returns to the pond every spring to lay its soft eggs.|This ___ can breathe through its moist skin as well as its lungs.|reptile,mammal|amphibians
  hybrid|a plant or animal whose parents are of two different kinds|杂交种|A mule is a ___ of a horse and a donkey.|The farmer grew a ___ corn, bred from two different kinds, that resisted drought.|The ___ rose has the color of one parent plant and the scent of the other.|breed,genus|hybrids
  breed|a particular type of animal, especially one developed by people; to keep animals to produce young|品种；繁殖|The sheepdog is a ___ known for its intelligence and its skill with sheep.|People developed the dachshund, a ___ with short legs, to hunt badgers.|This ___ of chicken, raised on farms for a hundred years, lays brown eggs.|hybrid,genus|breeds,bred,breeding
  `,
  "context-clues",
  {
    intro: t(
      "Along the museum wall stood a frog, a crocodile and a whale: an **amphibian**, a **reptile** and a **mammal**, each one a **vertebrate**. These ten words help you sort living things into groups and name each group.",
      "博物馆的墙边依次摆着一只青蛙、一条鳄鱼和一头鲸：两栖动物（**amphibian**）、爬行动物（**reptile**）和哺乳动物（**mammal**），它们都是脊椎动物（**vertebrate**）。这十个词帮你把生物分门别类，并说出每一类的名称。",
    ),
    watchOut: {
      meanings: t(
        "A **genus** is a small group of close cousins, a **phylum** a huge group sharing one body plan, and **taxonomy** the science that names them all.",
        "**genus** 是近亲组成的小类群，**phylum** 是共享同一身体构造的大类群，**taxonomy** 则是给它们命名的学科。",
      ),
      use: t(
        "Tell an **amphibian** (moist skin, starts life in water) from a **reptile** (dry scales, leathery eggs) and a **mammal** (fur and milk).",
        "分清 **amphibian**（皮肤湿润，幼时生活在水中）、**reptile**（干燥的鳞片，卵壳像皮革）和 **mammal**（有毛，用乳汁哺育幼崽）。",
      ),
      spelling: t(
        "Watch the **ph** that says /f/ in **phylum** and **amphibian**, the double **m** in **mammal** and the **in-** that turns **vertebrate** into **invertebrate**.",
        "注意 **phylum** 和 **amphibian** 中 **ph** 读 /f/、**mammal** 的双写 **m**，以及把 **vertebrate** 变成 **invertebrate** 的前缀 **in-**。",
      ),
    },
    notes: `
      taxonomy|the system Linnaeus created for naming living things|giving every species a two-part Latin name and a place among the groups|a career spent naming and sorting thousands of beetles|taxonomy is the whole science of naming and sorting; genus is one group in it|taxonomy 是命名和分类的整门学科；genus 只是其中的一个类群|genus is one small group of closely related species, not the science of sorting all life|genus 是由近缘物种组成的一个小类群，不是给所有生物分类的学科|phylum is one large group with a shared body plan, not the science of naming|phylum 是共享身体构造的一个大类群，不是命名的学科|tax · on · o · my|the -onomy ending, as in astronomy|结尾是 -onomy（同 astronomy）
      genus|lions and tigers sharing Panthera, the first part of their names|a group name always written first with a capital letter|wolves, coyotes and jackals, close cousins, sharing Canis|genus is small, a set of close cousins; phylum is huge, a whole body plan|genus 很小，是一群近亲；phylum 很大，涵盖一整类身体构造|phylum is a huge group, such as all animals with backbones, too big to hold only close cousins|phylum 是很大的类群，比如所有有脊椎的动物，不只是几个近亲|taxonomy is the science of naming and sorting, not one group of species|taxonomy 是命名和分类的学科，不是一个物种类群|ge · nus|the soft g, and the plural genera|g 发软音，复数是 genera
      phylum|insects, spiders and crabs grouped together by their jointed legs|a group bigger than a class but smaller than a kingdom|every animal with a backbone, from fish to humans, in one group|phylum is a big group sharing a body plan; genus is a small group of close relatives|phylum 是共享身体构造的大类群；genus 是近亲组成的小类群|genus holds only a few close relatives, like lions and tigers, not animals as different as fish and humans|genus 只包括几个近亲，比如狮子和老虎，容不下鱼和人这样差别巨大的动物|taxonomy is the whole science of sorting, not one group in it|taxonomy 是整门分类学，不是其中的一个类群|phy · lum|the ph that says /f/, and the plural phyla|ph 读 /f/，复数是 phyla
      vertebrate|a frog counted among the animals with a backbone|fish, birds and people sharing a backbone|fish as the first animals with backbones to swim in the sea|vertebrate has a backbone; invertebrate has none|vertebrate 有脊椎；invertebrate 没有|invertebrate is an animal with no backbone at all, the very thing these animals have|invertebrate 是完全没有脊椎的动物，而这些动物恰恰有脊椎|mammal is only the group with fur that feeds its young on milk, which leaves out frogs and fish|mammal 只是有毛、用乳汁哺育幼崽的那一类，青蛙和鱼都不算|ver · te · brate|the -brate ending, not -bret|结尾是 -brate，不是 -bret
      invertebrate|a clever octopus with no bones at all|a soft-bodied snail carrying a shell but no backbone|beetles, snails and worms filling a pond, none with a backbone|invertebrate has no backbone; vertebrate has one|invertebrate 没有脊椎；vertebrate 有脊椎|vertebrate is an animal with a backbone, the very thing these creatures lack|vertebrate 是有脊椎的动物，而这些生物恰恰没有脊椎|reptile is a scaly animal with a backbone, such as a snake, not a boneless creature|reptile 是蛇那样有鳞、有脊椎的动物，不是没有骨头的生物|in · ver · te · brate|in- (without) before vertebrate|vertebrate 前加 in-（无）
      mammal|a whale breathing air and feeding its calf on milk|every animal that feeds its babies on milk|a furry bat, the only one of its group that can truly fly|mammal has fur and milk; reptile has scales and lays eggs|mammal 有毛、哺乳；reptile 有鳞、产卵|reptile has dry, scaly skin and does not feed its young on milk|reptile 皮肤干燥有鳞，不用乳汁哺育幼崽|amphibian has moist skin with no fur and never feeds its young on milk|amphibian 皮肤湿润、没有毛，从不用乳汁哺育幼崽|mam · mal|the double m and the -al ending|双写 m，结尾是 -al
      reptile|a crocodile with thick, scaly skin|an animal laying leathery-shelled eggs on dry land|a cold-blooded lizard with scales warming itself on a rock|reptile has dry scales; amphibian has moist skin|reptile 有干燥的鳞片；amphibian 皮肤湿润|amphibian has moist skin and lays soft eggs in water, not dry scales and leathery eggs on land|amphibian 皮肤湿润，在水里产软卵，不是长干燥鳞片、在陆地产革质卵|mammal has fur and is warm-blooded, not scaly and cold-blooded|mammal 有毛且是恒温动物，不是有鳞的冷血动物|rep · tile|the -tile ending, as in tile|结尾是 -tile（同 tile）
      amphibian|a young animal like a tadpole living in water and breathing through gills|a newt returning to the pond each spring to lay soft eggs|an animal breathing through its moist skin as well as its lungs|amphibian starts life in water; reptile has dry scales|amphibian 幼时生活在水中；reptile 有干燥的鳞片|reptile has dry, scaly skin and never breathes through gills or through its skin|reptile 皮肤干燥有鳞，从不用鳃或皮肤呼吸|mammal has fur and feeds milk to its young, which never live in water with gills|mammal 有毛并用乳汁哺育幼崽，幼崽从不在水里用鳃呼吸|am · phib · i · an|the ph that says /f/ after amphi- (both)|amphi-（两种）后面的 ph 读 /f/
      hybrid|a mule born of a horse and a donkey|corn bred from two different kinds to resist drought|a rose with one parent's color and the other parent's scent|hybrid has parents of two different kinds; breed is one type developed by people|hybrid 的父母属于两个不同种类；breed 是人工培育的一个品种|breed is one type of animal kept by people, like a sheepdog, not a mix of two different kinds|breed 是人们饲养的某一类动物，比如牧羊犬，不是两个种类的混合|genus is a group of related species in science, not one plant or animal with mixed parents|genus 是科学上由近缘物种组成的类群，不是父母混血的一株植物或一只动物|hy · brid|the y that says /aɪ/|y 读 /aɪ/
      breed|a type of dog known for its skill with sheep|a short-legged dog developed by people to hunt badgers|a type of chicken raised on farms for a hundred years|breed is a type people developed within one kind; hybrid mixes two kinds|breed 是人们在同一种类中培育出的品种；hybrid 是两个种类的混合|hybrid has parents of two different kinds, not one type of dog or chicken kept pure by people|hybrid 的父母来自两个不同种类，不是人们保持纯种的某类狗或鸡|genus is a scientific group of several species, not a type of farm animal or pet|genus 是由几个物种组成的科学类群，不是某种家畜或宠物|breed|the double e, with one e in the past tense bred|双写 e，过去式 bred 只有一个 e
    `,
  },
);

const fossils = batch(
  "words-of-fossils-and-genes",
  ["Words of Fossils and Genes", "化石与基因的词"],
  ["fossils and genes", "化石与基因"],
  `
  eon|an extremely long period of time, the longest unit of geological time|亿万年，宙|Life on Earth began in the earliest ___, billions of years before the dinosaurs.|Wind and water shaped the rocks over a whole ___ of time, far longer than all of human history.|The bus was so late that the wait felt like an ___, as if years were passing.|interlude,aftermath|eons
  strata|layers of rock, one on top of another|地层|The canyon walls show ___ of red and yellow rock, one stacked on another.|Older fossils lie in the deeper ___ of rock.|Geologists read the ___ like the pages of a book, layer by layer.|eon,canopy|stratum
  geologic|relating to the study of the Earth's rocks and their history|地质的|The ___ record in the rocks shows several great extinctions.|A ___ map shows the types of rock found in each area.|Mountains rise over ___ time, not in a single lifetime.|petrified,desolate|geological
  genome|the complete set of genes of a living thing|基因组|Scientists read the whole human ___, every one of our genes, in 2003.|Parts of a banana's ___ match our own genes surprisingly well.|The ___ of the ancient wolf was pieced together, gene by gene, from a bone.|chromosome,lineage|genomes
  chromosome|a thread-like structure in a cell that carries the genes|染色体|Humans have forty-six of them, and each ___ is a long strand of DNA.|A missing ___ in every cell can cause serious illness.|Each ___ comes in a pair, one from the mother and one from the father.|genome,platelet|chromosomes
  paleontologist|a scientist who studies fossils to learn about ancient life|古生物学家|The ___ brushed sand from the giant dinosaur bone.|From one fossil tooth, a ___ can tell what an extinct animal ate.|The ___ spent ten summers digging for fossils in the desert.|naturalist,cartographer|paleontologists,paleontology
  trilobite|a sea animal with a hard, three-part shell that died out long before the dinosaurs|三叶虫|The ___ crawled along the sea floor five hundred million years ago.|She split a piece of slate and found a ___ with its three-part shell.|Each ___ had eyes made of tiny crystals and legs under its shell.|mammoth,hominid|trilobites
  mammoth|a large, hairy kind of elephant that lived in the Ice Age; very large|猛犸象；巨大的|A baby ___ was found frozen in the Siberian ice, its fur still on.|Cave painters drew the ___ with long curved tusks.|Each ___ grew a thick, woolly coat to survive the cold of the Ice Age.|trilobite,hominid|mammoths
  excavate|to dig carefully to uncover something buried, such as fossils or ruins|发掘|Next summer the team will ___ the site, digging carefully with brushes and spades.|It took a month to ___ the whole skeleton from the hard ground.|Students helped to ___ the buried ruins of the old village.|fossilize,forge|excavated,excavates,excavation
  petrified|turned to stone over a very long time; also, extremely frightened|石化的；吓呆的|In the ___ forest, every fallen tree has turned to stone.|She was ___ when the lights went out and something touched her arm.|The ___ log, hard as rock, still shows every ring of the tree it once was.|geologic,ingenious
  `,
  "context-clues",
  {
    intro: t(
      "At the dig, the **paleontologist** knelt beside the canyon wall, where the **strata** of rock held a curled **trilobite** and, much higher up, a **mammoth** tooth. These ten words help you talk about deep time, the rocks that record it and the genes that link living things.",
      "在发掘现场，古生物学家（**paleontologist**）跪在峡谷岩壁旁，岩层（**strata**）里嵌着一只蜷曲的三叶虫（**trilobite**），更高处还有一颗猛犸象（**mammoth**）的牙齿。这十个词帮你谈论漫长的地质时间、记录它的岩石，以及把生物联系起来的基因。",
    ),
    watchOut: {
      meanings: t(
        "A **genome** is the complete set of a living thing's genes; a **chromosome** is one thread of it, and a human cell holds forty-six.",
        "**genome** 是一种生物的全套基因；**chromosome** 只是其中的一条，人的细胞里有四十六条。",
      ),
      use: t(
        "An **eon** is the longest stretch of time, far longer than any **aftermath** or **interlude**; **strata** is a plural word for layers of rock.",
        "**eon** 是最漫长的时间单位，远比 **aftermath** 或 **interlude** 长；**strata** 是表示岩层的复数词。",
      ),
      spelling: t(
        "Watch the **ch** that says /k/ in **chromosome**, **paleo-** in **paleontologist**, **tri-** in **trilobite** and the double **m** in **mammoth**.",
        "注意 **chromosome** 中 **ch** 读 /k/、**paleontologist** 的 **paleo-**、**trilobite** 的 **tri-**，以及 **mammoth** 的双写 **m**。",
      ),
    },
    notes: `
      eon|the earliest stretch of time, billions of years before the dinosaurs|wind and water shaping rocks over far longer than all of human history|a wait so long that it felt as if years were passing|eon is the longest stretch of time; interlude is a short break|eon 是最漫长的时间；interlude 是短暂的间歇|interlude is a short break between two longer parts, the opposite of an endlessly long time|interlude 是两段较长部分之间的短暂间歇，正好和无比漫长的时间相反|aftermath is the time just after a bad event and its effects, not a huge stretch of geological time|aftermath 是坏事刚过之后的时期及其影响，不是极其漫长的地质时间|e · on|the e before o, also spelled aeon in British books|e 在 o 前，英式书中也拼作 aeon
      strata|red and yellow layers of rock stacked one on another in a canyon wall|deeper layers of rock holding older fossils|layers of rock read like the pages of a book|strata are layers of rock; canopy is the top layer of a forest|strata 是岩石的层；canopy 是森林的最上层|eon is a huge stretch of time, not layers of rock you can see|eon 是极其漫长的时间，不是能看见的岩层|canopy is the leafy top layer of a forest, not layers of stone|canopy 是森林顶上那层树叶，不是石头的层|stra · ta|the -a plural; one layer is a stratum|复数以 -a 结尾，单数是 stratum
      geologic|the record of great extinctions kept in the rocks|a map showing the types of rock in each area|the slow time over which mountains rise|geologic means having to do with the Earth's rocks and history; petrified means turned to stone|geologic 指与地球岩石和历史有关；petrified 指已变成石头|petrified means turned to stone or frozen with fear, not having to do with the study of rocks|petrified 是变成石头或吓呆了，不是与岩石研究有关|desolate means empty and lonely, which says nothing about rocks or their history|desolate 是荒凉孤寂，和岩石及其历史无关|ge · o · log · ic|geo- (earth) and the -ic ending; geological adds -al|geo-（地球）加 -ic；geological 再加 -al
      genome|every one of the human genes, read in 2003|a banana's genes matching parts of our own|an ancient wolf's genes pieced together from a bone|genome is all the genes; chromosome is one thread that carries some of them|genome 是全部基因；chromosome 是承载其中一部分的一条|chromosome is one thread in a cell carrying part of the genes, not the complete set|chromosome 是细胞里承载部分基因的一条丝状结构，不是全套基因|lineage is a line of ancestors, not a set of genes|lineage 是祖先世系，不是一套基因|ge · nome|gene changed to geno- and the -ome ending|gene 变为 geno-，结尾是 -ome
      chromosome|forty-six long strands of DNA in a human cell|a missing strand in every cell causing serious illness|strands that come in pairs, one from each parent|chromosome is one thread of DNA; genome is the whole set|chromosome 是一条 DNA；genome 是全套|genome is the complete set of genes, not one strand that comes in pairs|genome 是全套基因，不是成对出现的一条|platelet is a tiny piece of cell in the blood that helps it clot, not a thread of DNA|platelet 是血液里帮助凝血的细胞碎片，不是一条 DNA|chro · mo · some|the ch that says /k/ and the -some ending|ch 读 /k/，结尾是 -some
      paleontologist|a scientist brushing sand from a giant dinosaur bone|a scientist telling from one fossil tooth what an extinct animal ate|a scientist digging for fossils in the desert for ten summers|paleontologist studies fossils; naturalist studies living nature|paleontologist 研究化石；naturalist 研究活着的大自然|naturalist studies living plants and animals, not the fossils of extinct ones|naturalist 研究活着的动植物，不是已灭绝生物的化石|cartographer makes maps, not a scientist who digs up bones|cartographer 绘制地图，不是挖掘骨头的科学家|pa · le · on · tol · o · gist|paleo- (old) and the -ologist ending|paleo-（古）加 -ologist
      trilobite|a creature crawling on the sea floor five hundred million years ago|a three-part shell found in a split piece of slate|eyes made of tiny crystals and legs under a shell|trilobite is a small shelled sea animal; mammoth is a hairy Ice Age elephant|trilobite 是有壳的小型海洋动物；mammoth 是冰河时期的长毛象|mammoth is a huge hairy elephant that lived on land, not a small shelled creature of the sea floor|mammoth 是生活在陆地上的巨大长毛象，不是海底有壳的小动物|hominid is a human or ape relative with no shell, which never lived on the sea floor|hominid 是没有壳的人类或猿类近亲，从没在海底生活过|tri · lo · bite|tri- (three) and the -bite ending|tri-（三）加 -bite
      mammoth|a baby frozen in the Siberian ice with its fur still on|cave paintings of an animal with long curved tusks|a woolly coat grown to survive the cold of the Ice Age|mammoth is the hairy tusked elephant; trilobite is a small sea creature|mammoth 是长着象牙的长毛象；trilobite 是海里的小动物|trilobite is a small shelled sea animal with no fur or tusks|trilobite 是有壳的小型海洋动物，没有毛也没有象牙|hominid is a human or ape relative, not an elephant with tusks|hominid 是人类或猿类的近亲，不是长着象牙的象|mam · moth|the double m and moth at the end|双写 m，结尾是 moth
      excavate|a team digging a site carefully with brushes and spades|a whole skeleton dug out of hard ground in a month|students digging out the buried ruins of a village|excavate is digging something out; fossilize is turning to stone|excavate 是把东西挖出来；fossilize 是变成化石|fossilize means to turn slowly into stone while buried, not to dig something up|fossilize 是埋在地下慢慢变成石头，不是把东西挖出来|forge means to shape hot metal by hammering it, not to dig in the ground|forge 是锤打热金属使其成形，不是在地里挖掘|ex · ca · vate|the c after ex-, not a k|ex- 后接 c，不是 k
      petrified|a forest where every fallen tree has turned to stone|a woman frozen with fear when the lights went out and something touched her|a log hard as rock that still shows every ring|petrified means turned to stone or frozen with fear; geologic means about rocks|petrified 指变成石头或吓呆；geologic 指与岩石有关|geologic means having to do with the study of rocks, which describes a map or a record, not a log or a frightened person|geologic 指与岩石研究有关，形容的是地图或记录，不是木头或受惊的人|ingenious means clever and original, not turned to stone or frozen with fear|ingenious 是聪明巧妙，不是变成石头或吓呆了|pet · ri · fied|petrify with y changed to i before -ed|来自 petrify，y 变 i 再加 -ed
    `,
  },
);

const gloom = batch(
  "words-of-gloom-and-horror",
  ["Words of Gloom and Horror", "阴郁与恐怖的词"],
  ["gloom and horror", "阴郁与恐怖"],
  `
  macabre|disturbing because it is connected with death|恐怖的，与死亡有关的|The tale has a ___ ending, with the hero buried alive in the graveyard.|The museum showed a ___ display of skulls and old tools for cutting up the dead.|Each year the town holds a ___ parade of dancing skeletons and coffins.|dank,pallid
  foreboding|a strong feeling that something bad is going to happen|不祥的预感|As she opened the creaking gate, a quiet ___ told her that something bad was waiting inside.|Watching the dark clouds roll in, he sat still, full of ___ about the storm to come.|The story opens with an air of ___, hinting at the danger ahead.|resentment,hysteria|forebodings
  grotesque|strange and ugly in a way that is frightening or shocking|怪诞的|The roof was lined with ___ stone faces, with bulging eyes and twisted mouths.|The mask was ___, with crooked teeth and huge, staring eyes.|In the painting, the bare trees bend into ___ shapes like clawed hands.|dank,pallid
  ghastly|causing horror or fear; very pale and ill-looking|可怕的；苍白的|A ___ scream that froze their blood came from the cellar.|His face was a ___ white in the candlelight, like the face of a corpse.|The crime was so ___ that the reporters could not bear to describe it.|gaunt,dank
  gloomy|dark, or sad and without hope|阴暗的；忧郁的|The old house had long, ___ halls where hardly any light came in.|He felt ___ and hopeless after hearing that his team had lost again.|The ___ gray sky hid the sun all week.|grotesque,morbid
  uncanny|strange and hard to explain, in a way that is a little frightening|离奇的，神秘的|Her ability to guess what he was thinking was ___, almost like magic.|The doll looked ___ like a real child, which made everyone uneasy.|The silence in the forest was ___: not a single bird sang, and no one knew why.|spectral,ghastly
  morbid|having a strong interest in death or unpleasant things|病态的，对死亡感兴趣的|He had a ___ fascination with old graveyards and read every gravestone.|Her ___ jokes about coffins and funerals upset the guests.|The crowd's ___ curiosity drew them to stare at the scene of the crash.|wretched,gaunt
  dank|unpleasantly cold and wet|阴冷潮湿的|They crept down into the ___ cellar, where water dripped from the cold walls.|The ___ smell of wet stone rose from the well.|The prisoners shivered in ___ cells, cold and wet, under the castle.|spectral,ashen
  shudder|to shake suddenly, especially from fear or cold|颤抖，战栗|She began to ___ with fear when she heard the howl.|The thought of the icy water made him ___.|The whole house seemed to ___ and rattle in the wind.|lurk,haunt|shudders,shuddered
  lurk|to wait somewhere secretly, often to do something bad|潜伏|Something seemed to ___ behind the curtains, waiting to jump out.|Wolves ___ in the shadows of the forest, waiting for dark.|Danger may ___ around any corner, hidden and waiting.|shudder,haunt|lurks,lurked,lurking
  `,
  "context-clues",
  {
    intro: t(
      "On the stormy night, the travelers crept into the **dank** cellar, and a **foreboding** told them that something might **lurk** in the dark. One of them began to **shudder**. These ten words help you describe the fear and gloom of a horror story.",
      "暴风雨之夜，旅人们摸进阴冷潮湿的（**dank**）地窖，一种不祥的预感（**foreboding**）告诉他们，黑暗里可能潜伏着（**lurk**）什么东西。其中一人开始发抖（**shudder**）。这十个词帮你描写恐怖故事里的恐惧和阴郁。",
    ),
    watchOut: {
      meanings: t(
        "**Macabre** describes things tied to death; **morbid** describes a person's interest in death; **grotesque** describes something strangely ugly.",
        "**macabre** 形容与死亡相关的事物；**morbid** 形容一个人对死亡的病态兴趣；**grotesque** 形容怪异丑陋的东西。",
      ),
      use: t(
        "To **shudder** is to shake with fear or cold and to **lurk** is to hide and wait; a **dank** cellar is cold and wet, while a **gloomy** one is simply dark.",
        "**shudder** 是因害怕或寒冷而发抖，**lurk** 是躲着等待；**dank** 的地窖又冷又湿，**gloomy** 的地窖只是昏暗。",
      ),
      spelling: t(
        "Watch the **-esque** of **grotesque**, the French **-bre** of **macabre**, the silent **h** in **ghastly** and **fore-** (not *for-*) in **foreboding**.",
        "注意 **grotesque** 的 **-esque**、**macabre** 的法语式结尾 **-bre**、**ghastly** 中不发音的 **h**，以及 **foreboding** 的 **fore-**（不是 for-）。",
      ),
    },
    notes: `
      macabre|a tale ending with the hero buried alive in a graveyard|a display of skulls and old tools for cutting up the dead|a parade of dancing skeletons and coffins|macabre is about death; dank is about cold and damp|macabre 与死亡有关；dank 与阴冷潮湿有关|dank describes cold, wet air or places, not things connected with death|dank 形容阴冷潮湿的空气或地方，不是与死亡相关的事物|pallid describes a pale, unhealthy face or light, not things tied to death and the dead|pallid 形容苍白病态的脸色或光线，不是与死亡和死者相关的事物|ma · ca · bre|the French -bre ending|法语式结尾 -bre
      foreboding|a quiet feeling at a creaking gate that something bad was waiting inside|a man watching dark clouds and sensing the storm to come|a story opening with hints of danger ahead|foreboding is a feeling that bad things are coming; resentment is anger about something already done|foreboding 是坏事将至的感觉；resentment 是对已发生之事的愤恨|resentment is bitter anger about something unfair that has already happened, not a feeling about what is coming|resentment 是对已发生的不公之事的愤恨，不是对将来之事的预感|hysteria is wild, uncontrolled fear or excitement, not a quiet sense of danger ahead|hysteria 是失控的恐惧或激动，不是对前方危险的隐隐感觉|fore · bod · ing|fore- (before), not for-|前缀是 fore-（之前），不是 for-
      grotesque|stone faces on a roof with bulging eyes and twisted mouths|a mask with crooked teeth and huge, staring eyes|bare trees bent into shapes like clawed hands|grotesque is strangely ugly; pallid is only pale|grotesque 是怪异丑陋；pallid 只是苍白|dank describes cold, wet places like cellars, not a strange and ugly shape|dank 形容地窖那样阴冷潮湿的地方，不是怪异丑陋的形状|pallid means unhealthily pale, which is about color, not twisted, ugly shapes|pallid 是病态的苍白，说的是颜色，不是扭曲丑陋的形状|gro · tesque|the -esque ending, said /esk/|结尾是 -esque，读 /esk/
      ghastly|a scream from a cellar that froze their blood|a face as white as a corpse's in the candlelight|a crime too horrible for reporters to describe|ghastly causes horror; gaunt means very thin|ghastly 令人恐惧；gaunt 是极瘦|gaunt means very thin from hunger or illness, not causing horror|gaunt 是因饥饿或疾病而极瘦，不是令人恐惧|dank means cold and wet, not horrifying or deathly white|dank 是阴冷潮湿，不是令人恐惧或惨白|ghast · ly|the silent h after g|g 后面的 h 不发音
      gloomy|long halls in an old house where hardly any light came in|a man feeling hopeless after his team lost again|a gray sky hiding the sun all week|gloomy is dark or sad; morbid is drawn to death|gloomy 是昏暗或忧郁；morbid 是对死亡有病态兴趣|grotesque means strangely ugly, not dark or sad|grotesque 是怪异丑陋，不是昏暗或忧郁|morbid means interested in death and horrible things, not simply dark or without hope|morbid 是对死亡和可怕事物感兴趣，不只是昏暗或没有希望|gloom · y|gloom plus -y, with the double o|gloom 加 -y，双写 o
      uncanny|a woman guessing his thoughts in a way almost like magic|a doll looking so like a real child that everyone felt uneasy|a forest where no bird sang and no one knew why|uncanny is strange and hard to explain; spectral is ghostlike|uncanny 是离奇难解；spectral 是像鬼魂一样|spectral means like a ghost, pale and see-through, not strangely hard to explain|spectral 是像鬼魂一样苍白透明，不是离奇难解|ghastly means horrible or deathly pale, not strangely clever or hard to explain|ghastly 是可怕或惨白，不是神奇得难以解释|un · can · ny|un- plus canny, with the double n|un- 加 canny，双写 n
      morbid|a man fascinated by old graveyards who read every gravestone|jokes about coffins and funerals that upset the guests|a crowd's curiosity drawing them to stare at a crash|morbid is drawn to death; wretched is miserable|morbid 对死亡有病态兴趣；wretched 是悲惨|wretched means very unhappy or very poor, not drawn to death|wretched 是非常不幸或非常糟糕，不是对死亡有兴趣|gaunt means thin and bony, which describes a body, not an interest in death|gaunt 是瘦骨嶙峋，形容的是身体，不是对死亡的兴趣|mor · bid|the -id ending, not -ed|结尾是 -id，不是 -ed
      dank|a cellar where water dripped from the cold walls|a smell of wet stone rising from a well|prisoners shivering in cold, wet cells under a castle|dank is cold and wet; ashen is pale gray|dank 是阴冷潮湿；ashen 是灰白|spectral means ghostly, not cold and wet|spectral 是像鬼魂一样，不是阴冷潮湿|ashen means pale gray from fear or shock, not damp and chilly|ashen 是因恐惧或震惊而灰白，不是阴冷潮湿|dank|the -nk ending, as in bank|结尾是 -nk（同 bank）
      shudder|a woman shaking with fear at a howl|a man shaking at the thought of icy water|a house shaking and rattling in the wind|shudder is to shake; lurk is to hide and wait|shudder 是发抖；lurk 是躲着等待|lurk means to wait somewhere in secret, not to shake|lurk 是偷偷躲在某处等待，不是发抖|haunt means to appear in a place as a ghost, not to tremble with fear or cold|haunt 是鬼魂在某处出没，不是因害怕或寒冷而颤抖|shud · der|the double d|双写 d
      lurk|something hiding behind curtains, waiting to jump out|wolves waiting in the shadows of the forest for dark|danger hidden around a corner, waiting|lurk is hidden waiting; haunt is a ghost appearing|lurk 是躲着等待；haunt 是鬼魂出没|shudder means to shake suddenly, not to hide and wait|shudder 是突然颤抖，不是躲着等待|haunt means a ghost appearing in a place, not something hiding until it can strike|haunt 是鬼魂在某处出没，不是躲着等机会下手|lurk|the ur that says /ɜː/, as in turn|ur 读 /ɜː/（同 turn）
    `,
  },
);

const ghosts = batch(
  "words-of-ghosts-and-haunting",
  ["Words of Ghosts and Haunting", "鬼魂与闹鬼的词"],
  ["ghosts and haunted places", "鬼魂与闹鬼之地"],
  `
  spectral|like a ghost|幽灵般的|A ___ glow, pale and see-through like a ghost, drifted over the marsh.|The fog gave the bare trees a ___ look, as if ghosts stood among them.|They heard ___ footsteps on the stairs, though no living person was there.|dank,morbid
  apparition|a ghost, or something strange that suddenly appears|幽灵，鬼魂|A pale ___ in a white dress drifted across the lawn and vanished.|She was sure the ___ she saw by the window was her dead grandmother.|The ___ vanished as soon as he lit the candle.|premonition,mansion|apparitions
  phantom|a ghost; something that seems real but is not|幽灵；幻影|A ___ ship, seen by many but never touched, is said to sail the bay on stormy nights.|He heard a ___ voice call his name, but no one was in the room.|The ___ he saw on the dark road turned out to be only a trick of the moonlight.|ghoul,premonition|phantoms
  crypt|an underground room beneath a church, often used for burying people|地下墓室|The family is buried in the ___ under the chapel.|They carried candles down the stone steps into the ___ beneath the church.|The ___ under the church, full of old coffins, had not been opened for a hundred years.|mansion,tenement|crypts
  mansion|a very large and grand house|宅邸，大厦|The ___ on the hill had forty rooms and a ballroom.|No one had lived in the grand old ___ for decades.|A rich merchant built the ___, with marble stairs and a garden of roses.|crypt,tenement|mansions
  haunt|to appear in a place as a ghost; to stay in someone's mind and trouble them|（鬼魂）出没；萦绕心头|The ghost of the old captain is said to ___ the lighthouse every winter night.|The memory of her mistake would ___ her for years.|Do you believe that spirits ___ this castle?|lurk,banish|haunts,haunted,haunting
  wraith|a ghost, especially a pale, thin one|幽灵，鬼魂|A thin, pale ___ stood silently at the foot of his bed.|After her long illness she was so pale and thin that she looked like a ___.|The ___ drifted silently through the mist, so pale it was almost invisible.|ghoul,premonition|wraiths
  ghoul|an evil spirit said to rob graves; a person who enjoys things connected with death|食尸鬼|In the tale, a hungry ___ crept out at midnight to dig up fresh graves.|The ___ in the story feeds on the bodies of the dead.|He was the kind of ___ who loved to read about murders and visit the scenes of crimes.|wraith,apparition|ghouls
  specter|a ghost; something frightening that may happen|幽灵；令人担忧的事|A ___, the ghost of a drowned girl, rose from the old well.|The ___ of war, a danger that might come at any time, hung over the country.|He was troubled by the ___ of failure.|ghoul,crypt|specters
  premonition|a feeling that something, usually bad, is going to happen|预感|She had a strong ___ that the ship would sink, and she refused to board it.|His ___ that something bad would happen came true the next morning.|A strange ___ of danger kept him from boarding the train.|apparition,obsession|premonitions
  `,
  "context-clues",
  {
    intro: t(
      "Inside the empty **mansion**, a cold draft rose from the **crypt**, and for a moment a **spectral** figure seemed to **haunt** the stairs. These ten words help you name ghosts and haunted places and tell them apart.",
      "空荡荡的宅邸（**mansion**）里，一股冷风从地下墓室（**crypt**）升上来，有一瞬间，一个幽灵般的（**spectral**）身影似乎在楼梯上出没（**haunt**）。这十个词帮你说出各种鬼魂和闹鬼的地方，并把它们区分开。",
    ),
    watchOut: {
      meanings: t(
        "An **apparition**, a **phantom**, a **wraith** and a **specter** are all ghosts, but a **ghoul** is a monster that robs graves, and a **premonition** is only a feeling.",
        "**apparition**、**phantom**、**wraith** 和 **specter** 都是鬼魂，但 **ghoul** 是盗墓吃尸的怪物，**premonition** 只是一种预感。",
      ),
      use: t(
        "**Spectral** is the adjective (*a spectral glow*); **specter** is the noun (*a specter rose from the well*).",
        "**spectral** 是形容词（*a spectral glow*）；**specter** 是名词（*a specter rose from the well*）。",
      ),
      spelling: t(
        "Watch the silent **w** in **wraith**, the silent **h** in **ghoul**, the **ph** of **phantom** and the double **p** of **apparition**.",
        "注意 **wraith** 中不发音的 **w**、**ghoul** 中不发音的 **h**、**phantom** 的 **ph**，以及 **apparition** 的双写 **p**。",
      ),
    },
    notes: `
      spectral|a pale, see-through glow drifting over a marsh like a ghost|bare trees in fog looking as if ghosts stood among them|footsteps on the stairs with no living person there|spectral is ghostlike; dank is cold and wet|spectral 是像鬼魂一样；dank 是阴冷潮湿|dank describes cold, damp air and places, not something pale and ghostly|dank 形容阴冷潮湿的空气和地方，不是苍白如鬼的东西|morbid describes an unhealthy interest in death, not a ghostly look or sound|morbid 形容对死亡的病态兴趣，不是像鬼一样的样子或声音|spec · tral|the -tral ending, from specter|结尾是 -tral（来自 specter）
      apparition|a pale figure in a white dress drifting across a lawn and vanishing|a figure by a window that a woman took for her dead grandmother|a figure vanishing as soon as a candle was lit|apparition is a ghost you see; premonition is a feeling about the future|apparition 是看得见的鬼魂；premonition 是对未来的预感|premonition is a feeling that something bad will happen, not a ghostly figure you can see|premonition 是觉得会出事的预感，不是能看见的鬼影|mansion is a very large house, not a figure that appears and vanishes|mansion 是一座很大的房子，不是忽隐忽现的身影|ap · pa · ri · tion|the double p and the -ition ending|双写 p，结尾是 -ition
      phantom|a ship seen by many but never touched|a voice calling a name in an empty room|a figure on a dark road that was only a trick of the moonlight|phantom seems real but is not; ghoul is an evil grave robber|phantom 看似真实却不存在；ghoul 是邪恶的盗墓怪|ghoul is an evil spirit said to rob graves and eat the dead, not a figure or sound that only seems real|ghoul 是传说中盗墓吃尸的恶灵，不是只是看似真实的身影或声音|premonition is a feeling about what will happen, not a ghostly ship, voice or figure|premonition 是对将要发生之事的预感，不是幽灵船、鬼声或鬼影|phan · tom|the ph that says /f/|ph 读 /f/
      crypt|a family buried in a room under a chapel|stone steps leading down to a room beneath a church|a room under a church full of old coffins, unopened for a hundred years|crypt is an underground room under a church; mansion is a grand house|crypt 是教堂下的地下室；mansion 是豪华的大宅|mansion is a grand house where rich people live, not a room under a church for the dead|mansion 是富人住的豪宅，不是教堂下安放死者的房间|tenement is a crowded apartment building, not an underground burial room|tenement 是拥挤的公寓楼，不是地下墓室|crypt|the y that says /ɪ/|y 读 /ɪ/
      mansion|a house on a hill with forty rooms and a ballroom|a grand old house no one had lived in for decades|a house with marble stairs and a rose garden built by a rich merchant|mansion is a grand house; tenement is a crowded, poor building|mansion 是豪华大宅；tenement 是拥挤破旧的楼房|crypt is a burial room under a church, not a house with forty rooms|crypt 是教堂下的墓室，不是有四十个房间的房子|tenement is a crowded, run-down building for poor families, not a grand house|tenement 是穷人住的拥挤破旧的楼，不是豪宅|man · sion|the -sion ending|结尾是 -sion
      haunt|a captain's ghost appearing at a lighthouse every winter night|the memory of a mistake troubling a woman for years|spirits appearing in a castle|haunt is a ghost appearing or a memory staying; lurk is hiding to strike|haunt 是鬼魂出没或回忆萦绕；lurk 是躲着伺机而动|lurk means to hide and wait to do harm, not to appear as a ghost or stay in someone's mind|lurk 是躲着等待害人，不是鬼魂出没或萦绕心头|banish means to send someone away, the opposite of staying and coming back|banish 是把人赶走，正好和留下、反复出现相反|haunt|the au that says /ɔː/, as in taught|au 读 /ɔː/（同 taught）
      wraith|a thin, pale figure standing silently at the foot of a bed|a woman so pale and thin after illness that she looked like a ghost|a figure drifting through mist, so pale it was almost invisible|wraith is a pale, thin ghost; ghoul is an evil grave robber|wraith 是苍白瘦削的鬼魂；ghoul 是邪恶的盗墓怪|ghoul is a monster that digs up graves and eats the dead, not a pale, thin ghost that drifts quietly|ghoul 是挖坟吃尸的怪物，不是静静飘荡的苍白瘦鬼|premonition is a feeling about the future, not a pale figure you can see|premonition 是对未来的感觉，不是看得见的苍白身影|wraith|the silent w at the start|开头的 w 不发音
      ghoul|a hungry creature creeping out at midnight to dig up fresh graves|a creature in a story that feeds on the bodies of the dead|a man who loved reading about murders and visiting crime scenes|ghoul feeds on the dead; wraith is a thin, pale ghost|ghoul 以死者为食；wraith 是苍白瘦削的鬼魂|wraith is a pale, thin ghost that drifts silently, not a hungry monster that digs up graves or a person who enjoys death|wraith 是静静飘荡的苍白瘦鬼，不是挖坟的饿鬼，也不是喜欢死亡话题的人|apparition is a ghost that suddenly appears and vanishes, not a creature that feeds on the dead|apparition 是忽然出现又消失的鬼魂，不是以死者为食的怪物|ghoul|the silent h and the ou that says /uː/|h 不发音，ou 读 /uː/
      specter|the ghost of a drowned girl rising from a well|the danger of war that might come at any time|a fear of failure troubling a man|specter is a ghost or a feared danger; ghoul is a grave-robbing monster|specter 是鬼魂或令人担忧的危险；ghoul 是盗墓怪物|ghoul is a monster that eats the dead, not a ghost or a danger that may come|ghoul 是吃死人的怪物，不是鬼魂，也不是可能到来的危险|crypt is a burial room under a church, not a ghost or a fear about the future|crypt 是教堂下的墓室，不是鬼魂，也不是对未来的恐惧|spec · ter|the American -er ending (British spectre)|美式结尾是 -er（英式拼作 spectre）
      premonition|a woman sensing a ship would sink and refusing to board|a feeling that something bad would happen, which came true the next morning|a strange sense of danger keeping a man off a train|premonition is a feeling about the future; apparition is a ghost you see|premonition 是对未来的预感；apparition 是看得见的鬼魂|apparition is a ghostly figure you see, not a feeling about what will happen|apparition 是看得见的鬼影，不是对将来之事的感觉|obsession is an idea you cannot stop thinking about, not a warning feeling about the future|obsession 是挥之不去的念头，不是对未来的警示性预感|pre · mo · ni · tion|pre- (before) and the -ition ending|pre-（之前）加 -ition
    `,
  },
);

const madness = batch(
  "words-of-madness-and-despair",
  ["Words of Madness and Despair", "疯狂与绝望的词"],
  ["madness and despair", "疯狂与绝望"],
  `
  wretched|very unhappy or ill; of very poor quality|悲惨的；极差的|She felt ___ and cried all night after the argument.|They lived in that ___ little hut with a leaking roof and no fire.|Alone, cold and hopeless, he spent one ___ night on the station floor.|gaunt,ashen
  gaunt|very thin, especially because of hunger, illness or worry|憔悴的，瘦削的|After the hungry winter the horses were ___, and you could count every rib.|His face was ___, with hollow cheeks and sharp bones.|The ___ old man, thin as a rake, opened the door.|pallid,ashen
  pallid|pale, in a way that looks unhealthy|苍白的|Her ___ skin, almost white, showed that she had been ill for weeks.|The ___ light of the winter moon made everything look white and sickly.|The sick child's lips were ___, not rosy as they used to be.|gaunt,dank
  ashen|very pale gray, often from shock or fear|灰白的，面如死灰|Her face turned ___, gray as cold ashes, when she read the letter.|The shock drained the color from his cheeks and left them ___.|Before the storm, the sky turned ___, the pale gray of burnt wood.|gaunt,wretched
  frenzy|a state of wild excitement or uncontrolled activity|狂乱，疯狂|The crowd worked itself into a ___, shouting and pushing toward the stage.|In a wild ___ of activity, he tore every drawer open looking for the key.|The sharks fed in a ___, snapping at anything that moved.|delirium,paranoia|frenzies,frenzied
  madness|serious mental illness; very foolish behavior|疯狂，精神失常|It would be pure ___ to sail out in this storm.|The king's ___ made him believe that he was made of glass.|Spending all your savings on lottery tickets is ___.|obsession,frenzy
  delirium|a state of confused thinking caused by illness or fever|谵妄，神志不清|In her ___ from the high fever, she called out the names of people long dead.|A very high fever can cause ___, so the patient does not know where she is.|He woke from his ___ when the fever broke and asked where he was.|frenzy,paranoia
  obsession|an idea or feeling that fills someone's mind so that they cannot stop thinking about it|痴迷，执念|His ___ with the old man's eye drove him to the crime.|Her ___ with winning, which filled her every thought, cost her friends.|Collecting stamps became his ___; he thought of nothing else.|madness,paranoia|obsessions,obsessive
  paranoia|an unreasonable belief that others are trying to harm you|偏执，多疑|His ___ made him lock every door three times, sure that someone was coming to hurt him.|She suffered from ___ and believed that even her friends were spying on her.|In the story, the captain's ___ grows each night until he trusts no one on board.|obsession,hysteria
  hysteria|uncontrolled fear, excitement or emotion, often in a crowd|歇斯底里|Rumors of a monster caused ___ in the village, with people screaming and running into the streets.|She burst into ___, laughing and sobbing at once after the shock.|The ___ spread from house to house as panic took hold.|delirium,obsession
  `,
  "context-clues",
  {
    intro: t(
      "In the old story, the **gaunt** narrator sits alone in the dark, his face **pallid**, while his **obsession** with a ticking sound slowly grows into **paranoia**. These ten words help you describe a troubled mind and the way it shows on a face.",
      "在那个古老的故事里，憔悴的（**gaunt**）叙述者独自坐在黑暗中，脸色苍白（**pallid**），他对滴答声的执念（**obsession**）慢慢变成了偏执（**paranoia**）。这十个词帮你描写一颗不安的心，以及它怎样显露在脸上。",
    ),
    watchOut: {
      meanings: t(
        "**Delirium** comes from fever and confuses the mind; **paranoia** is the fear that others want to harm you; **obsession** is one idea you cannot drop.",
        "**delirium** 由发烧引起，让人神志不清；**paranoia** 是总怕别人要害你；**obsession** 是一个放不下的念头。",
      ),
      use: t(
        "**Gaunt** is about thinness; **pallid** and **ashen** are about color, and **ashen** is the sudden gray of shock.",
        "**gaunt** 说的是瘦；**pallid** 和 **ashen** 说的是脸色，其中 **ashen** 是受惊后突然变成的灰白。",
      ),
      spelling: t(
        "Watch the silent **w** in **wretched**, the double **l** in **pallid**, the double **s** in **obsession** and the **y** that says /ɪ/ in **hysteria**.",
        "注意 **wretched** 中不发音的 **w**、**pallid** 的双写 **l**、**obsession** 的双写 **s**，以及 **hysteria** 中读 /ɪ/ 的 **y**。",
      ),
    },
    notes: `
      wretched|a woman crying all night after an argument|a little hut with a leaking roof and no fire|a lonely, cold, hopeless night on a station floor|wretched is miserable or poor; gaunt is thin|wretched 是悲惨或糟糕；gaunt 是消瘦|gaunt describes a bony, thin body or face, not a miserable feeling or a poor place|gaunt 形容瘦骨嶙峋的身体或脸，不是悲惨的心情或糟糕的地方|ashen means gray-pale from shock, not unhappy or badly made|ashen 是受惊后的灰白，不是不幸或做工差|wretch · ed|the silent w and the -tch in the middle|w 不发音，中间是 -tch
      gaunt|horses after a hungry winter with every rib showing|a face with hollow cheeks and sharp bones|an old man as thin as a rake|gaunt is thin; pallid is pale|gaunt 是消瘦；pallid 是苍白|pallid is about a pale, unhealthy color, not how thin someone is|pallid 说的是苍白病态的颜色，不是一个人有多瘦|ashen is a gray color of the face, not thinness|ashen 是脸色灰白，不是消瘦|gaunt|the au, as in haunt|au 的拼法同 haunt
      pallid|almost white skin showing weeks of illness|winter moonlight making everything look white and sickly|a sick child's lips no longer rosy|pallid is unhealthily pale; gaunt is thin|pallid 是病态的苍白；gaunt 是消瘦|gaunt means bony and thin, which is about shape, not a pale, sickly color|gaunt 是瘦骨嶙峋，说的是体形，不是苍白病态的颜色|dank means cold and damp, which describes air or a place, not pale skin or light|dank 是阴冷潮湿，形容空气或地方，不是苍白的皮肤或光线|pal · lid|the double l|双写 l
      ashen|a face turning gray as cold ashes at a letter|cheeks drained of color by shock|a sky turning the pale gray of burnt wood before a storm|ashen is gray-pale from shock; gaunt is thin|ashen 是受惊后的灰白；gaunt 是消瘦|gaunt means very thin, not drained of color by shock|gaunt 是极瘦，不是受惊后失去血色|wretched means miserable or poor, not gray and pale|wretched 是悲惨或糟糕，不是灰白|ash · en|ash plus -en|ash 加 -en
      frenzy|a crowd shouting and pushing toward the stage|a man in a wild rush tearing every drawer open|sharks snapping at anything that moved|frenzy is wild activity; delirium is confused thinking from fever|frenzy 是疯狂的举动；delirium 是发烧引起的神志不清|delirium is confused thinking caused by fever or illness, not wild, excited action|delirium 是发烧或疾病引起的神志不清，不是狂乱激动的举动|paranoia is a false belief that others want to hurt you, not wild excitement|paranoia 是以为别人要害自己的错误想法，不是狂乱的激动|fren · zy|the z and the -y ending, which becomes frenzies|有一个 z，结尾 -y，复数变为 frenzies
      madness|sailing out in a storm as a foolish idea|a king's illness of mind making him believe he was made of glass|spending all your savings on lottery tickets|madness is mental illness or great foolishness; obsession is one idea you cannot drop|madness 是精神失常或极其愚蠢；obsession 是一个放不下的念头|obsession is one idea that fills the mind, not a loss of reason or a very foolish act|obsession 是占满脑子的一个念头，不是失去理智或极其愚蠢的举动|frenzy is a short burst of wild activity, not a lasting illness of the mind or a foolish plan|frenzy 是一阵狂乱的举动，不是长期的精神疾病或愚蠢的计划|mad · ness|mad plus -ness, with the double s|mad 加 -ness，双写 s
      delirium|a woman with high fever calling out the names of the dead|a fever so high the patient does not know where she is|a man waking when his fever broke and asking where he was|delirium comes from fever and confuses; paranoia is a fear that others mean harm|delirium 由发烧引起、让人糊涂；paranoia 是怕别人加害|frenzy is wild excitement or rushing about, not confused thinking from a fever|frenzy 是狂乱的激动或乱忙，不是发烧引起的糊涂|paranoia is a lasting fear that others want to harm you, not confusion caused by fever|paranoia 是长期担心别人要加害自己，不是发烧引起的糊涂|de · lir · i · um|the -ium ending|结尾是 -ium
      obsession|a fixed interest in an old man's eye that drove a man to crime|a need to win that filled a woman's every thought|stamp collecting that a man thought of and nothing else|obsession is one idea filling the mind; paranoia is fear of being harmed|obsession 是占满脑子的一个念头；paranoia 是怕被加害|madness is a loss of reason or a very foolish act, not one fixed idea about one thing|madness 是失去理智或极其愚蠢的举动，不是对一件事的执念|paranoia is a fear that others are out to hurt you, not a fixed interest in one thing|paranoia 是怕别人要害自己，不是对一件事的执着兴趣|ob · ses · sion|the double s before -ion|-ion 前双写 s
      paranoia|a man locking every door three times, sure someone would hurt him|a woman believing even her friends were spying on her|a captain who trusts no one on board|paranoia is distrust and fear of harm; hysteria is wild emotion|paranoia 是多疑、怕被加害；hysteria 是失控的情绪|obsession is an idea you cannot stop thinking about, not a belief that others are out to harm you|obsession 是挥之不去的念头，不是认为别人要害你|hysteria is a wild outburst of fear or emotion, not a quiet distrust of everyone|hysteria 是恐惧或情绪的失控爆发，不是对所有人的暗自猜疑|par · a · noi · a|the oi before the final a|结尾 a 前面是 oi
      hysteria|a village screaming and running into the streets over a monster|a woman laughing and sobbing at once after a shock|panic spreading from house to house|hysteria is wild emotion; delirium is confused thinking from fever|hysteria 是失控的情绪；delirium 是发烧引起的神志不清|delirium is confused thinking from a fever, not panic that spreads through a crowd|delirium 是发烧引起的糊涂，不是在人群中蔓延的恐慌|obsession is a single idea that fills one person's mind, not wild fear or emotion|obsession 是占满一个人脑子的念头，不是失控的恐惧或情绪|hys · te · ri · a|the y that says /ɪ/|y 读 /ɪ/
    `,
  },
);

const stage = batch(
  "words-of-the-elizabethan-stage",
  ["Words of the Elizabethan Stage", "伊丽莎白时代舞台的词"],
  ["the theater in Shakespeare's time and since", "莎士比亚时代及之后的戏剧"],
  `
  stagecraft|the skill of putting on a play: sets, lighting, movement and timing|舞台技巧|The director's ___, from the lighting to the timing of the thunder, made the storm scene feel real.|Working backstage for years, she learned every part of ___, from building sets to timing the lights.|Clever ___, using only lights and a few boxes, turned the bare stage into a ship.|blocking,backdrop
  backdrop|a painted cloth hung at the back of a stage; the setting in which something happens|背景幕；背景|The painted ___ at the back of the stage showed a castle on a hill.|The war is the ___ of the whole novel.|Stagehands rolled down a new painted ___ between the acts.|footlights,stagecraft|backdrops
  footlights|a row of lights along the front of a stage floor|舞台脚灯|The actor stepped forward into the glow of the ___ at the front of the stage.|Shining up from the stage floor, the ___ lit the actors' faces from below.|Someone switched off the ___, and the front of the stage went dark.|backdrop,blocking
  blocking|the planned movements and positions of actors on a stage|走位|The director spent the morning on the ___, showing each actor where to stand and move.|The ___ puts the two rivals at opposite ends of the stage.|Write the ___ in pencil, every step and turn, because it will change.|stagecraft,ensemble
  dramatist|a person who writes plays|剧作家|Shakespeare, who wrote comedies, histories and tragedies, is the most famous ___ in English.|The young ___ sold her first play, a comedy, at twenty.|The ___ sat at her desk, writing the last scene of her funny new play.|tragedian,theatergoer|dramatists
  groundling|in Shakespeare's theater, a person who paid a penny to stand in the yard in front of the stage|（剧场）站票观众|For a penny, a ___ could stand in the open yard and shout at the actors.|Each ___ stood in the yard in front of the stage, rain or shine, with no seat.|The rude jokes were written to make every ___ in the cheap standing area laugh.|jester,tragedian|groundlings
  matinee|a performance of a play or film in the afternoon|午后场|We went to the Saturday ___ at two o'clock and were home by dinner.|The afternoon ___ was full of schoolchildren.|Tickets for the ___ are cheaper than for the evening show.|interlude,ensemble|matinees
  ensemble|a group of actors, dancers or musicians who perform together|全体演员，合奏团|The whole ___ of actors came out to bow at the end.|The play has no single star; it belongs to the whole ___.|She joined a small ___ of musicians that played in village halls.|dramatist,coalition|ensembles
  theatergoer|a person who often goes to the theater|戏迷，常去剧院的人|The keen ___ waited outside the door for an hour to get a seat.|As a regular ___, he could tell good acting the moment he saw it.|From her seat in the third row, the ___ clapped until her hands hurt.|matinee,ensemble|theatergoers
  tragedian|an actor who plays tragic roles, or a writer of tragedies|悲剧演员；悲剧作家|The great ___ played Hamlet and other tragic heroes more than a thousand times.|Famous for sad roles, the ___ was never cast in comedies.|The old ___ wept real tears on stage as King Lear.|dramatist,theatergoer|tragedians
  `,
  "context-clues",
  {
    intro: t(
      "Before the **matinee**, the director checked the **blocking** one last time while stagehands lowered the painted **backdrop** behind the **ensemble**. These ten words help you talk about how plays are written, staged and watched, in Shakespeare's time and now.",
      "午后场（**matinee**）开演前，导演最后一次检查走位（**blocking**），舞台工作人员则在全体演员（**ensemble**）身后放下彩绘的背景幕（**backdrop**）。这十个词帮你谈论戏剧怎样写成、怎样上演、怎样被观看，从莎士比亚时代一直到今天。",
    ),
    watchOut: {
      meanings: t(
        "A **dramatist** writes plays; a **tragedian** acts in tragic roles; a **theatergoer** and a **groundling** watch, and the groundling stood in the yard for a penny.",
        "**dramatist** 写剧本；**tragedian** 演悲剧角色；**theatergoer** 和 **groundling** 都是看戏的人，而 groundling 花一便士站在院子里看。",
      ),
      use: t(
        "The **backdrop** hangs at the back, the **footlights** shine at the front, and **blocking** is where the actors move between them.",
        "**backdrop** 挂在后面，**footlights** 在前沿发光，**blocking** 则是演员在两者之间怎样走位。",
      ),
      spelling: t(
        "Watch the French endings, **-ee** in **matinee** and **en-** and **-ble** in **ensemble**, and the **-edian** of **tragedian**, as in *comedian*.",
        "注意法语式拼写：**matinee** 的 **-ee**、**ensemble** 的 **en-** 和 **-ble**；还有 **tragedian** 的 **-edian**（同 comedian）。",
      ),
    },
    notes: `
      stagecraft|lighting and thunder timed to make a storm scene feel real|everything from building sets to timing the lights, learned backstage|lights and a few boxes turning a bare stage into a ship|stagecraft is the whole skill of staging; blocking is only the actors' movements|stagecraft 是整套舞台技巧；blocking 只是演员的走位|blocking is only the planned moves of the actors, not the whole skill of sets, lights and timing|blocking 只是演员事先安排的走位，不是布景、灯光和时机的整套技巧|backdrop is one painted cloth at the back of the stage, not a skill|backdrop 是舞台后方的一块画布，不是一种技巧|stage · craft|stage plus craft|stage 加 craft
      backdrop|a painted castle on a hill at the back of the stage|a war as the setting of a whole novel|a new painted cloth rolled down between the acts|backdrop hangs at the back; footlights shine at the front|backdrop 挂在后面；footlights 在前沿发光|footlights are lamps along the front edge of the stage floor, not a painted cloth at the back or the setting of a story|footlights 是舞台地板前沿的一排灯，不是后方的画布，也不是故事的背景|stagecraft is the skill of staging a play, not a cloth or a setting|stagecraft 是上演戏剧的技巧，不是一块布或一种背景|back · drop|back plus drop|back 加 drop
      footlights|an actor stepping into a glow at the front of the stage|lamps shining up from the floor onto actors' faces|lamps switched off so the front of the stage went dark|footlights are lamps at the front edge; backdrop is a cloth at the back|footlights 是前沿的灯；backdrop 是后方的画布|backdrop is a painted cloth at the back, which gives no light|backdrop 是后方的画布，不会发光|blocking is the plan of where actors move, not a row of lamps|blocking 是演员走位的安排，不是一排灯|foot · lights|foot plus lights, with the silent gh|foot 加 lights，gh 不发音
      blocking|a director showing each actor where to stand and move|a plan placing two rivals at opposite ends of the stage|every step and turn written in pencil because it will change|blocking is where actors move; ensemble is the group of actors|blocking 是演员怎样走位；ensemble 是演员群体|stagecraft is the whole art of staging, sets and lights included, not just where actors stand|stagecraft 是包括布景和灯光在内的整套舞台艺术，不只是演员站在哪里|ensemble is the group of performers, not the plan of where they move|ensemble 是表演者群体，不是他们走位的安排|block · ing|the ck before -ing|-ing 前面是 ck
      dramatist|Shakespeare, who wrote comedies, histories and tragedies|a young woman selling her first play, a comedy|a woman at her desk writing the last scene of a funny new play|dramatist writes plays of any kind; tragedian acts in or writes only tragedies|dramatist 写各种剧本；tragedian 只演或只写悲剧|tragedian acts in or writes tragedies only, not comedies|tragedian 只演或只写悲剧，不写喜剧|theatergoer watches plays from a seat, not someone who writes them|theatergoer 坐在座位上看戏，不是写剧本的人|dra · ma · tist|drama plus -tist, with a t added|drama 后加 t 再加 -ist
      groundling|someone paying a penny to stand in the yard and shout at actors|people standing in front of the stage in rain or shine with no seat|rude jokes written for the cheap standing area|groundling paid a penny to stand and watch; jester entertained at a royal court|groundling 花一便士站着看戏；jester 在宫廷里逗乐|jester is an entertainer at a royal court, not someone paying to watch a play|jester 是宫廷里的逗乐艺人，不是花钱看戏的人|tragedian performs or writes tragedies, not someone standing in the yard to watch|tragedian 演出或写作悲剧，不是站在院子里看戏的人|ground · ling|ground plus the -ling ending, meaning a small or lowly one|ground 加 -ling（表示小或卑微的人）
      matinee|a Saturday show at two o'clock that ends before dinner|an afternoon show full of schoolchildren|a show with cheaper tickets than the evening one|matinee is an afternoon show; interlude is a break within a show|matinee 是午后场演出；interlude 是演出中的间歇|interlude is a short break between two parts, not a whole afternoon performance|interlude 是两段之间的短暂间歇，不是一整场午后演出|ensemble is a group of performers, not a show at a certain time|ensemble 是表演者群体，不是某个时段的演出|mat · i · nee|the French -ee ending, said /eɪ/ (also matinée)|法语式结尾 -ee，读 /eɪ/（也写作 matinée）
      ensemble|all the actors coming out to bow at the end|a play with no single star that belongs to the whole group|a small group of musicians playing in village halls|ensemble is performers together; coalition is parties or countries joined|ensemble 是一起表演的人；coalition 是联合起来的政党或国家|dramatist is one person who writes plays, not a group of performers|dramatist 是一个写剧本的人，不是表演者群体|coalition is a group of political parties or countries, not of actors or musicians|coalition 是政党或国家的联盟，不是演员或乐手|en · sem · ble|the French en- and the -ble ending|法语式 en- 和结尾 -ble
      theatergoer|a keen fan waiting an hour outside the door for a seat|a regular who can tell good acting at once|a woman in the third row clapping until her hands hurt|theatergoer watches plays; ensemble performs them|theatergoer 是看戏的人；ensemble 是演戏的人|matinee is an afternoon show, not a person who watches it|matinee 是午后场演出，不是看戏的人|ensemble is a group of performers on stage, not one person in the audience|ensemble 是台上的表演者群体，不是台下的一名观众|the · a · ter · go · er|the American -er of theater, then goer|美式拼写 theater 的 -er，再加 goer
      tragedian|an actor playing Hamlet and other tragic heroes a thousand times|an actor famous for sad roles who was never cast in comedies|an old actor weeping real tears on stage as King Lear|tragedian acts in tragedies; dramatist writes plays|tragedian 演悲剧；dramatist 写剧本|dramatist writes plays at a desk, not an actor who plays tragic heroes|dramatist 在书桌前写剧本，不是扮演悲剧英雄的演员|theatergoer sits in the audience, not on the stage playing tragic roles|theatergoer 坐在台下看戏，不是在台上演悲剧角色|tra · ge · di · an|the -edian ending, as in comedian|结尾是 -edian（同 comedian）
    `,
  },
);

const courts = batch(
  "words-of-courts-and-feuds",
  ["Words of Courts and Feuds", "宫廷与世仇的词"],
  ["royal courts and family feuds", "宫廷与家族世仇"],
  `
  jester|a person kept at a royal court to entertain with jokes and tricks|弄臣，小丑|The ___ was the only one allowed to make fun of the king.|In the play, the ___ in his cap and bells speaks the wisest lines.|The ___ juggled apples and told jokes at the feast.|friar,usurper|jesters
  doublet|a close-fitting jacket worn by men in the 1400s to 1600s|紧身上衣|The actor wore a velvet ___ buttoned tightly over his shirt.|His ___ was buttoned to the throat, and its sleeves were slashed with silk.|A torn ___ lay on the floor after the fight, one sleeve ripped away.|rapier,potion|doublets
  usurper|a person who takes power or a position that does not belong to them|篡位者|The ___ killed the rightful king and put the stolen crown on his own head.|The people never accepted the ___, because the throne was not his by right.|In the end, the ___ is defeated, and the true prince takes back his throne.|jester,friar|usurpers,usurp
  villainy|very wicked behavior|恶行，邪恶|The audience hissed at each act of ___ by the wicked duke.|His ___, every cruel trick he played, is revealed in the last act.|She refused to take part in such ___ as poisoning a guest.|virtue,humility
  banish|to send someone away from a place as a punishment|放逐，驱逐|The prince decided to ___ him from the city forever as a punishment.|To ___ a man from his home city was almost as harsh as to kill him.|She tried to ___ the frightening thought from her mind.|maroon,renounce|banished,banishes,banishment
  duel|a formal fight between two people with weapons, to settle a quarrel|决斗|The two men met at dawn with pistols to fight a ___ over her honor.|The ___ ended when one swordsman dropped his weapon and gave up.|He slapped his rival with a glove and challenged him to a ___.|rapier,mutiny|duels,dueling
  rapier|a long, thin sword with a sharp point|长剑，细剑|He drew his ___ from its sheath and stepped forward.|The thin blade of the ___ flashed in the torchlight.|Long and sharply pointed, the ___ was a gentleman's weapon.|doublet,duel|rapiers
  friar|a member of a religious order who lives a simple life and serves the poor|修士|The ___ agreed to marry the young couple in secret in his chapel.|A kindly ___ who had given up all riches gave them shelter for the night.|The ___ wore a simple brown robe tied with rope and prayed each morning.|apothecary,jester|friars
  apothecary|a person who in the past made and sold medicines|药剂师|The poor ___ sold Romeo a deadly poison from his shop.|Jars of herbs and powders lined the shelves of the ___'s shop.|The ___ weighed the medicine on his scales and took her coins.|friar,jester|apothecaries
  potion|a drink believed to have magical, medicinal or poisonous powers|药水，魔药|She drank the ___ and fell into a deep sleep.|The witch stirred a bubbling ___ in her black pot.|The ___ was meant to make him fall in love with the first person he saw.|apothecary,rapier|potions
  `,
  "context-clues",
  {
    intro: t(
      "At the royal feast, the **jester** juggled while a young lord in a velvet **doublet** touched his **rapier** and glared across the hall, ready for a **duel**. These ten words help you follow the courts, quarrels and feuds in plays like *Romeo and Juliet*.",
      "王室宴会上，弄臣（**jester**）正在抛球，一位身穿天鹅绒紧身上衣（**doublet**）的年轻贵族按住长剑（**rapier**），怒视大厅另一头，准备决斗（**duel**）。这十个词帮你看懂《罗密欧与朱丽叶》这类戏剧里的宫廷、争吵和世仇。",
    ),
    watchOut: {
      meanings: t(
        "A **friar** is a humble man of the church; an **apothecary** sells medicine and poison; a **usurper** seizes a throne that is not his.",
        "**friar** 是清贫的修士；**apothecary** 卖药也卖毒药；**usurper** 是夺取不属于自己王位的人。",
      ),
      use: t(
        "A **duel** is the fight, a **rapier** is the sword, and a **doublet** is the jacket the fighter wears.",
        "**duel** 是决斗本身，**rapier** 是用的剑，**doublet** 是决斗者穿的上衣。",
      ),
      spelling: t(
        "Watch the **-ar** of **friar**, the **-el** of **duel**, the **ai** kept in **villainy** and the **-ary** of **apothecary**.",
        "注意 **friar** 的 **-ar**、**duel** 的 **-el**、**villainy** 中保留的 **ai**，以及 **apothecary** 的 **-ary**。",
      ),
    },
    notes: `
      jester|the only person allowed to make fun of the king|a man in cap and bells speaking the wisest lines of a play|a man juggling apples and telling jokes at a feast|jester entertains at court; friar is a man of the church|jester 在宫廷逗乐；friar 是修士|friar is a religious man who lives simply and serves the poor, not a joker at court|friar 是生活简朴、服务穷人的修士，不是宫廷里的逗乐者|usurper seizes a throne that is not his, not someone who entertains the king|usurper 是夺取不属于自己王位的人，不是给国王逗乐的人|jest · er|jest plus -er|jest 加 -er
      doublet|a velvet jacket buttoned tightly over an actor's shirt|a jacket buttoned to the throat with silk-slashed sleeves|a torn jacket on the floor after a fight, one sleeve ripped away|doublet is a close-fitting jacket; rapier is a sword|doublet 是紧身上衣；rapier 是剑|rapier is a thin sword, not a jacket you wear|rapier 是细长的剑，不是穿在身上的上衣|potion is a magic or poisonous drink, not clothing|potion 是魔法药水或毒药，不是衣服|dou · blet|the ou of double and the -let ending|保留 double 的 ou，结尾是 -let
      usurper|a man killing the rightful king and taking his crown|a ruler the people never accepted because the throne was not his by right|a false ruler defeated so the true prince takes back the throne|usurper seizes power; jester only entertains|usurper 篡夺权力；jester 只是逗乐|jester tells jokes at court and has no claim to the throne|jester 在宫廷讲笑话，无权觊觎王位|friar is a humble religious man who seeks no crown or power|friar 是谦卑的修士，不追求王冠和权力|u · surp · er|the s that says /z/ and the -er ending|s 读 /z/，结尾是 -er
      villainy|a wicked duke's acts that the audience hissed at|every cruel trick a man played, revealed in the last act|wicked deeds such as poisoning a guest|villainy is wickedness; virtue is goodness|villainy 是邪恶；virtue 是美德|virtue is goodness, the very opposite of wicked acts|virtue 是善良，正好和恶行相反|humility is not thinking yourself better than others, a good quality, not wickedness|humility 是不自以为高人一等，是好品质，不是恶行|vil · lain · y|the ai of villain kept before -y|保留 villain 的 ai，再加 -y
      banish|a prince sending a man out of the city forever as a punishment|sending a man away from his home city, almost as harsh as death|a woman pushing a frightening thought out of her mind|banish sends someone away; maroon leaves someone stranded|banish 是驱逐出去；maroon 是把人困在某处|maroon means to leave someone stranded on an island or in a place with no escape, not to send them out of a city|maroon 是把人困在岛上或无法逃离的地方，不是把人赶出城|renounce means to give up a right or a belief yourself, not to send someone or something away|renounce 是自己放弃权利或信仰，不是把人或东西赶走|ban · ish|one n and the -ish ending|只有一个 n，结尾是 -ish
      duel|two men meeting at dawn with pistols to fight over her honor|a sword fight ending when one man dropped his weapon|a rival slapped with a glove and challenged to fight|duel is a fight between two people; mutiny is a revolt by sailors|duel 是两人之间的决斗；mutiny 是水手的叛乱|rapier is the thin sword used in a fight, not the fight itself|rapier 是打斗用的细剑，不是打斗本身|mutiny is a revolt by sailors or soldiers against their officers, not a fight between two people|mutiny 是水手或士兵反抗长官的叛乱，不是两个人之间的决斗|du · el|the -el ending, not -al|结尾是 -el，不是 -al
      rapier|a weapon drawn from its sheath before stepping forward|a thin blade flashing in the torchlight|a long, sharply pointed gentleman's weapon|rapier is a sword; duel is the fight|rapier 是剑；duel 是决斗|doublet is a jacket, which has no blade|doublet 是上衣，没有剑刃|duel is a fight between two people, not the sword they use|duel 是两人的决斗，不是他们用的剑|ra · pi · er|the -ier ending|结尾是 -ier
      friar|a man agreeing to marry a young couple in secret in his chapel|a kindly man who had given up all riches sheltering travelers|a man in a brown robe tied with rope who prayed each morning|friar serves the church; apothecary sells medicine|friar 侍奉教会；apothecary 卖药|apothecary makes and sells medicines and has no power to marry people or lead prayers|apothecary 制药卖药，无权为人主持婚礼或带领祈祷|jester is a joker at court, not a man of the church|jester 是宫廷里的逗乐者，不是教会中人|fri · ar|the -ar ending, not -er|结尾是 -ar，不是 -er
      apothecary|a poor man selling Romeo a deadly poison from his shop|a shop whose shelves were lined with jars of herbs and powders|a man weighing medicine on his scales and taking coins|apothecary sells medicine; friar serves the church|apothecary 卖药；friar 侍奉教会|friar is a man of the church who lives on gifts, not a shopkeeper selling medicines|friar 是靠施舍生活的修士，不是卖药的店主|jester entertains a royal court, not someone who mixes medicines|jester 在宫廷逗乐，不是配药的人|a · poth · e · car · y|the th and the -ary ending|中间有 th，结尾是 -ary
      potion|a drink that put a woman into a deep sleep|a bubbling brew stirred by a witch in her black pot|a drink meant to make a man fall in love|potion is the drink; apothecary is the person who mixes medicine|potion 是药水；apothecary 是配药的人|apothecary is the person who makes medicines, not the drink|apothecary 是制药的人，不是药水本身|rapier is a sword, not something you drink|rapier 是剑，不是能喝的东西|po · tion|the -tion ending, said /ʃən/|结尾是 -tion，读 /ʃən/
    `,
  },
);

const migration = batch(
  "words-of-migration",
  ["Words of Migration", "移民的词"],
  ["leaving one's country", "离开祖国"],
  `
  emigrant|a person who leaves their own country to live in another|移民（移出者）|Each ___ on the ship had left the old country forever, carrying only one suitcase.|Years after she left Italy for good, the ___ still missed the food of her childhood.|The young ___ said goodbye to his village, sure he would never live there again.|diaspora,diplomat|emigrants
  emigrate|to leave your own country to live in another|移居国外|Her grandparents decided to ___ from Ireland to Canada in 1955, leaving their farm behind.|Millions chose to ___ during the famine, leaving their own country to find food abroad.|He hoped to ___ to America once he had saved enough money for the ticket.|assimilate,deport|emigrated,emigrates,emigration
  asylum|protection given by a country to someone who has fled danger in their own|庇护|Threatened with prison at home, the writer asked a foreign government to shelter her by granting ___.|The country granted ___ to the families fleeing the war, promising they would not be sent back into danger.|His claim for ___ as a refugee was approved, so at last he was safe from the soldiers who had hunted him.|visa,passport
  diaspora|people who have spread from their original homeland to many other places|散居族群，海外侨民|The Irish ___ now lives on every continent, millions of people spread far from Ireland.|Members of the ___, scattered across a dozen countries, send money home each month.|The festival brings together the worldwide ___ of Armenians, whose families scattered a century ago.|homeland,emigrant|diasporas
  visa|an official mark in a passport that allows you to enter or stay in a country|签证|The embassy stamped a student ___ into her passport, allowing her to study abroad for two years.|His tourist ___ allowed him to stay in the country for only six months.|Without an entry ___ stamped in his passport, the guard would not let him cross the border.|passport,asylum|visas
  passport|an official document that proves who you are and lets you travel to other countries|护照|Show your ___, the booklet with your photo and name, to the guard at the border.|She lost her ___ and had to ask her country's embassy for a new booklet proving who she was.|A new ___, the document that proves your citizenship, lasts ten years.|visa,homeland|passports
  assimilate|to become part of a group or culture, or to make someone do so|同化，融入|Some newcomers chose to ___ quickly into their new culture, while others kept their old ways.|Schools were expected to ___ immigrant children, teaching them the language and customs of their new land.|It took him years to ___ fully, but at last he felt part of the town's way of life.|emigrate,diverge|assimilated,assimilates,assimilation
  homeland|the country where someone was born or where their family came from|祖国，家乡|She dreamed of returning one day to her ___, the country where she was born.|The old songs remind them of their ___ across the ocean, where their families came from.|He had not seen his ___, the land of his birth, in forty years.|diaspora,enclave|homelands
  displaced|forced to leave the place where you live|流离失所的|The flood left thousands of people ___, their homes under water and nowhere to live.|Tents were set up for ___ families whose village had burned in the wildfire.|Driven from their homes by the earthquake, the ___ villagers slept in tents for a year.|enslaved,becalmed
  persecution|cruel or unfair treatment of people, especially because of their religion, race or beliefs|迫害|They fled ___ for their religion after soldiers burned their church and jailed their priest.|The cruel ___ that the government aimed at writers, hunting and jailing them for their beliefs, drove many into exile.|New laws protect people from ___ because of their faith, so no one is punished for how they pray.|sedition,servitude
  `,
  "context-clues",
  {
    intro: t(
      "At the dock, the **emigrant** clutched her **passport** and **visa**; she was fleeing **persecution** and hoped a new country would grant her **asylum**. These ten words help you follow stories of people who leave their country behind.",
      "码头上，这位移民（**emigrant**）紧紧攥着护照（**passport**）和签证（**visa**）；她在逃离迫害（**persecution**），希望新的国家能给她庇护（**asylum**）。这十个词帮你读懂离开祖国的人的故事。",
    ),
    watchOut: {
      meanings: t(
        "A **visa** is a stamp that lets you enter a country; a **passport** is the booklet that proves who you are; **asylum** is the protection given to someone fleeing danger.",
        "**visa** 是允许你入境的签注；**passport** 是证明身份的护照本；**asylum** 是给逃离危险者的庇护。",
      ),
      use: t(
        "An **emigrant** is one person who leaves; a **diaspora** is a whole people scattered across many lands. You **emigrate** when you leave and **assimilate** as you blend into the new place.",
        "**emigrant** 是一个离开祖国的人；**diaspora** 是散居各地的整个族群。离开时用 **emigrate**，融入新地方时用 **assimilate**。",
      ),
      spelling: t(
        "**Emigrate** and **emigrant** have one **m**; **asylum** has a **y** after the **s**; **persecution** begins **per-**, not the **pro-** of prosecution.",
        "**emigrate** 和 **emigrant** 只有一个 **m**；**asylum** 的 **s** 后面是 **y**；**persecution** 以 **per-** 开头，不是 prosecution 的 **pro-**。",
      ),
    },
    notes: `
      emigrant|a person who had left the old country forever with one suitcase|a woman who left Italy for good and still missed its food|a young man saying goodbye to his village, never to live there again|emigrant is one person who leaves; diaspora is a whole scattered people|emigrant 是一个离开的人；diaspora 是散居的整个族群|diaspora is a whole people scattered over many lands, not one person with a suitcase|diaspora 是散居各地的整个族群，不是提着箱子的某一个人|diplomat represents a country abroad and goes home again, not someone who leaves for good|diplomat 是代表国家驻外、之后还会回国的人，不是永远离开的人|em · i · grant|one m and the -ant ending|只有一个 m，结尾是 -ant
      emigrate|grandparents leaving their farm in Ireland to live in Canada|millions leaving their own country during a famine to find food abroad|a man saving money for a ticket to leave for America|emigrate is leaving your country; assimilate is blending into the new one|emigrate 是离开祖国；assimilate 是融入新地方|assimilate means to blend into a new culture, not to leave your own country|assimilate 是融入新的文化，不是离开自己的国家|deport means to force someone else out of a country, not something people choose to do themselves|deport 是强迫别人离境，不是人们自己选择去做的事|em · i · grate|one m and the -ate ending|只有一个 m，结尾是 -ate
      asylum|a threatened writer asking a foreign government to shelter her|families fleeing war promised they would not be sent back into danger|a refugee's claim approved so he was safe from soldiers hunting him|asylum is protection; visa is permission to enter|asylum 是庇护；visa 是入境许可|visa is only a stamp allowing a stay, not protection from danger at home|visa 只是允许停留的签注，不是让人免受本国危险的保护|passport is issued by your own country to prove who you are, not protection given by another|passport 是本国发给你的身份证件，不是别国给的保护|a · sy · lum|the y after the s|s 后面是 y
      diaspora|millions of people spread from Ireland over every continent|members scattered across a dozen countries sending money home|Armenian families who scattered a century ago, brought together by a festival|diaspora is the scattered people; homeland is the country they came from|diaspora 是散居的族群；homeland 是他们来自的国家|homeland is the country people came from, not the people spread across other lands|homeland 是人们来自的国家，不是散布到其他国家的人群|emigrant is one person, not millions scattered across many countries|emigrant 是一个人，不是散布在多国的数百万人|di · as · po · ra|the -ora ending|结尾是 -ora
      visa|a student stamp placed in a passport to study abroad for two years|a tourist permit allowing a stay of only six months|an entry stamp the guard needed to see before letting a man cross|visa is the stamp; passport is the booklet it goes in|visa 是签注；passport 是盖签注的本子|passport is the booklet itself, so it cannot be stamped into a passport or limit a stay|passport 就是那个本子，不能盖进护照里，也不规定停留期限|asylum is protection for someone fleeing danger, not a stamp for students, tourists or crossing a border|asylum 是给逃难者的庇护，不是学生、游客或过境用的签注|vi · sa|the s that sounds like /z/|s 读 /z/
      passport|a booklet with your photo and name shown to a border guard|a booklet proving who a woman was, replaced by her country's embassy|a document proving your citizenship that lasts ten years|passport proves who you are; visa allows entry|passport 证明你是谁；visa 允许你入境|visa is a stamp inside the booklet, not the booklet that proves who you are|visa 是本子里的签注，不是证明身份的本子|homeland is your home country, not a document you carry or lose|homeland 是祖国，不是可以携带或丢失的证件|pass · port|pass and port joined, with double s|pass 和 port 相连，有两个 s
      assimilate|newcomers blending quickly into their new culture|schools teaching immigrant children the language and customs of their new land|a man coming to feel part of a town's way of life|assimilate is blending in; emigrate is leaving|assimilate 是融入；emigrate 是离开|emigrate means to leave your country, not to blend into a new culture or make children do so|emigrate 是离开祖国，不是融入新文化或让孩子融入|diverge means to split off in different directions, the opposite of blending in|diverge 是分道扬镳，正好与融入相反|as · sim · i · late|double s and one m|两个 s，一个 m
      homeland|the country where a woman was born and hoped to return|the land across the ocean where their families came from|the land of a man's birth, unseen for forty years|homeland is the home country; diaspora is the people who left it|homeland 是祖国；diaspora 是离开祖国的人群|diaspora is a scattered people, not a country you are born in or return to|diaspora 是散居的人群，不是出生地或可以回去的国家|enclave is a neighborhood in a new city, not the faraway land of your birth|enclave 是新城市里的聚居区，不是远方的出生地|home · land|home and land joined|home 和 land 相连
      displaced|thousands left with homes under water and nowhere to live|families whose village had burned in a wildfire|villagers driven from their homes by an earthquake|displaced means forced from home; enslaved means forced to work for an owner|displaced 是被迫离家；enslaved 是被迫为主人劳作|enslaved means owned and forced to work, not driven from home by a disaster|enslaved 是被人占有、被迫劳作，不是因灾难被赶出家园|becalmed describes a sailing ship stuck with no wind, not people who lost their homes|becalmed 指帆船因无风而停滞，不是失去家园的人|dis · placed|the dis- prefix and the -ced ending|dis- 前缀，结尾是 -ced
      persecution|soldiers burning a church and jailing a priest because of religion|a government hunting and jailing writers for their beliefs|people punished for how they pray|persecution is cruel treatment of people; sedition is stirring up rebellion|persecution 是对人的迫害；sedition 是煽动叛乱|sedition is speech or action stirring up rebellion against a government, not cruelty aimed at believers or writers|sedition 是煽动反抗政府的言行，不是针对信徒或作家的迫害|servitude is being forced to work as a servant or slave, not being punished for your faith or beliefs|servitude 是被迫当仆人或奴隶，不是因信仰受罚|per · se · cu · tion|per- at the start, not pro-|开头是 per-，不是 pro-
    `,
  },
);

const newLives = batch(
  "words-of-new-lives",
  ["Words of New Lives", "新生活的词"],
  ["starting a new life in a new country", "在新国家开始新生活"],
  `
  resettle|to move people to a new place to live|重新安置|After the dam flooded the valley, the government helped ___ the families in new homes on higher ground.|It took a year to ___ everyone from the camp in apartments across the country.|The charity found houses and jobs to ___ the refugees in a quiet town by the sea.|deport,naturalize|resettled,resettles,resettlement
  naturalize|to make someone from another country a citizen|使入籍|The state will ___ her as a citizen after five years of living there legally.|Before a judge can ___ an immigrant, he must pass a test on the nation's laws and swear loyalty to it.|At the ceremony, the court will ___ forty new citizens, each of whom will receive a certificate of citizenship.|deport,resettle|naturalized,naturalizes,naturalization
  deport|to force someone to leave a country, usually because they have no legal right to be there|驱逐出境|The court ordered officials to ___ him against his will, forcing him onto a plane back to the country he had fled.|They feared the police would ___ their father, sending him out of the country because his papers were not in order.|Officials may ___ anyone whose visa has run out, forcing them to leave the country.|resettle,naturalize|deported,deports,deportation
  ancestry|the people your family came from in the past|祖先，血统|She is proud of her Chinese ___, the great-grandparents who sailed from Canton.|He traced his ___ back through old records to a Scottish farmer born in 1790.|Her ___ includes a grandfather from Ghana and a great-grandmother from Poland.|identity,belonging|ancestries
  newcomer|a person who has recently arrived somewhere|新来者|The ___ to the chess club did not know anyone yet, having joined only that week.|The neighbors brought soup to welcome the ___ who had just rented the apartment next door.|Still a ___ at the office in her first week, she kept getting lost on the way to the meeting room.|settler,host|newcomers
  settler|a person who goes to live in a new country or area|定居者，移民|Each ___ on the prairie was given a piece of wild land to clear, plow and farm for life.|The first ___ in the valley cut down trees and built a log cabin where no one had lived before.|Life was hard for every ___ on the frontier, far from any town, building a farm from nothing.|newcomer,enclave|settlers
  belonging|the feeling of being accepted as part of a group or place|归属感|Joining the choir gave her a sense of ___, as if she had finally found her people.|Many immigrants struggle for years to find a sense of ___ in their new town instead of feeling like outsiders.|A feeling of ___, of being welcomed and accepted, makes a new town feel like home.|ancestry,enclave
  identity|who a person is, and what makes them different from others|身份，认同|Language is an important part of her ___, of who she is.|His ___ was both Korean and American, and he never felt he had to choose who he was.|The story is about a girl searching for her true ___, trying to understand who she really is.|belonging,enclave|identities
  enclave|a part of a city where people of one culture or group live together|聚居区，飞地|The Chinese ___ of the city had its own shops, temples and newspapers, all within a few streets.|She grew up in the Italian ___ of Boston, where every neighbor spoke Italian.|Within the small ___, a few blocks of the city, the families kept their language for three generations.|homeland,archipelago|enclaves
  remittance|money sent by a worker abroad to their family at home|汇款|Each month the family lived on the ___ their son sent home from his job abroad.|The village school was built with ___ from workers abroad who sent part of their pay home.|One ___ of fifty dollars from her daughter overseas fed the family for weeks.|balance,overdraft|remittances
  `,
  "context-clues",
  {
    intro: t(
      "In her new country, the **newcomer** found a sense of **belonging** in the Korean **enclave**, though she still sent a **remittance** home each month. These ten words help you talk about how people build a life, and an identity, in a new land.",
      "在新的国家，这位新来者（**newcomer**）在韩国人聚居区（**enclave**）找到了归属感（**belonging**），但她每个月仍往家里寄一笔汇款（**remittance**）。这十个词帮你谈论人们如何在新土地上建立生活和身份认同。",
    ),
    watchOut: {
      meanings: t(
        "**Resettle** moves people into new homes, **naturalize** makes them citizens, and **deport** forces them out of the country.",
        "**resettle** 是把人安置到新家，**naturalize** 是让人入籍，**deport** 是把人驱逐出境。",
      ),
      use: t(
        "**Ancestry** is the family you come from, **identity** is who you are, and **belonging** is the feeling of being accepted; an **enclave** is a place, not a feeling.",
        "**ancestry** 是你的祖辈，**identity** 是你是谁，**belonging** 是被接纳的感觉；**enclave** 是一个地方，不是感觉。",
      ),
      spelling: t(
        "**Naturalize** keeps the **-al** of natural before **-ize**; **remittance** has a double **t** and ends in **-ance**; **ancestry** ends in **-ry**, unlike ancest**or**.",
        "**naturalize** 在 **-ize** 前保留 natural 的 **-al**；**remittance** 有两个 **t**，结尾是 **-ance**；**ancestry** 结尾是 **-ry**，和 ancestor 不同。",
      ),
    },
    notes: `
      resettle|a government moving flooded-out families into new homes on higher ground|moving everyone from a camp into apartments across the country|a charity finding houses and jobs for refugees in a seaside town|resettle moves people into new homes; deport forces them out|resettle 是安置到新家；deport 是驱逐出境|deport means to force someone out of a country, not to give them new homes|deport 是把人赶出国境，不是给他们安排新家|naturalize means to make someone a citizen, not to find people houses in a new place|naturalize 是让人入籍，不是给人在新地方找住处|re · set · tle|re- plus settle, with double t|re- 加 settle，有两个 t
      naturalize|a state making a woman a citizen after five years of living there legally|a judge making an immigrant a citizen after a test and an oath of loyalty|a court ceremony giving forty people certificates of citizenship|naturalize makes a citizen; deport throws someone out|naturalize 是让人入籍；deport 是驱逐出境|deport means to force someone out of the country, not to make them a citizen|deport 是把人赶出国境，不是让人成为公民|resettle means to move people to new homes, which needs no test, oath or certificate of citizenship|resettle 是把人迁到新家，不需要考试、宣誓或公民证书|nat · u · ral · ize|natural kept whole before -ize|完整保留 natural，再加 -ize
      deport|officials forcing a man onto a plane back to the country he had fled|police sending a father out of the country because his papers were not in order|officials forcing people whose visas have run out to leave|deport forces someone out; resettle gives them a new home|deport 是驱逐出去；resettle 是给人新家|resettle means to help people into new homes, not to force them out of the country|resettle 是帮人住进新家，不是把人赶出国境|naturalize means to make someone a citizen, the opposite of forcing them to leave|naturalize 是让人成为公民，正好和驱逐相反|de · port|de- plus port|de- 加 port
      ancestry|great-grandparents who sailed from Canton|old records traced back to a Scottish farmer born in 1790|a grandfather from Ghana and a great-grandmother from Poland|ancestry is the family you come from; identity is who you are|ancestry 是你的祖辈；identity 是你是谁|identity is who a person is, not the grandparents and forebears a family came from|identity 是一个人是谁，不是家族的祖父母和先辈|belonging is a feeling of being accepted, not the people your family came from|belonging 是被接纳的感觉，不是你家族的祖先|an · ces · try|the c that sounds like /s/ and the -ry ending|c 读 /s/，结尾是 -ry
      newcomer|someone at the chess club who had joined only that week|a person who had just rented the apartment next door|a woman in her first week at the office who kept getting lost|newcomer has just arrived; settler goes to build a home in a new land|newcomer 是刚到的人；settler 是去新土地安家的人|settler goes to build a home in a new country or wild area, not someone who just joined a club, apartment or office|settler 是去新国家或荒地安家的人，不是刚加入俱乐部、搬进公寓或进入公司的人|host is the one who welcomes others, not the person who has just arrived|host 是接待别人的人，不是刚到的人|new · com · er|new plus comer, joined|new 和 comer 相连
      settler|a person given wild land on the prairie to clear, plow and farm|the first person to build a log cabin where no one had lived before|a person building a farm from nothing on the frontier|settler makes a home in a new land; newcomer has just arrived anywhere|settler 在新土地安家；newcomer 只是刚到某处|newcomer only says someone has just arrived, not that they are clearing wild land to farm for life|newcomer 只说明刚到，不表示要开垦荒地、终身耕作|enclave is a neighborhood, not a person who builds a cabin or a farm|enclave 是聚居区，不是盖木屋、建农场的人|set · tler|double t and the -tler ending|两个 t，结尾是 -tler
      belonging|a choir making a woman feel she had found her people|immigrants trying to stop feeling like outsiders in their new town|being welcomed and accepted so a new town feels like home|belonging is a feeling of acceptance; ancestry is your forebears|belonging 是被接纳的感觉；ancestry 是你的祖先|ancestry is the people your family came from, which joining a choir or a town cannot give you|ancestry 是家族的祖先，加入合唱团或小镇都给不了|enclave is a neighborhood, not a feeling of being welcomed and accepted|enclave 是聚居区，不是被欢迎和接纳的感觉|be · long · ing|belong plus -ing|belong 加 -ing
      identity|the part of a woman that language helps make, who she is|a man both Korean and American who never had to choose who he was|a girl searching to understand who she really is|identity is who you are; belonging is feeling accepted by others|identity 是你是谁；belonging 是被他人接纳的感觉|belonging is a feeling of being accepted by a group, not who a person is|belonging 是被群体接纳的感觉，不是一个人是谁|enclave is a neighborhood of a city, not who a person is|enclave 是城市里的聚居区，不是一个人是谁|i · den · ti · ty|the -ti- in the middle and the -ty at the end|中间的 -ti- 和结尾的 -ty
      enclave|a few streets of a city with their own Chinese shops, temples and newspapers|the Italian part of Boston where every neighbor spoke Italian|a few blocks of a city where families kept their language|enclave is a neighborhood inside a city; homeland is a whole country far away|enclave 是城里的聚居区；homeland 是远方的整个国家|homeland is the country where your family came from, not a few streets inside a city|homeland 是家族来自的国家，不是城里的几条街|archipelago is a group of islands in the sea, not a neighborhood of a city|archipelago 是海上的群岛，不是城市里的街区|en · clave|en- plus the clave of conclave|en- 加 clave
      remittance|money a son sent home from his job abroad|money from workers abroad that built a village school|fifty dollars a daughter overseas sent to feed her family|remittance is money sent home; balance is the amount left in an account|remittance 是寄回家的钱；balance 是账户余额|balance is the amount left in an account, not money a worker sends home to family|balance 是账户里剩下的钱，不是工人寄回家的钱|overdraft is money borrowed by spending more than your account holds, not money sent home to support a family|overdraft 是超支透支的钱，不是寄回家养家的钱|re · mit · tance|double t and the -ance ending|两个 t，结尾是 -ance
    `,
  },
);

const diplomacy = batch(
  "words-of-diplomacy",
  ["Words of Diplomacy", "外交的词"],
  ["diplomacy and government", "外交与政府"],
  `
  ambassador|the official sent by a country to live in another and represent it|大使|Our ___ in Tokyo met the Japanese prime minister to discuss the treaty on behalf of our country.|She lived in Japan for four years, serving as her country's ___ there.|After the quarrel between the two nations, the ___ was called home from the foreign capital.|dissident,lobbyist|ambassadors
  diplomacy|the work of managing relations between countries; skill in dealing with people without upsetting them|外交；交际手腕|The war was avoided through careful ___ between the two countries' leaders, who talked for months.|She used tact and ___ to calm the angry customers without upsetting anyone.|Quiet ___, months of patient talks between the two governments, freed the prisoners.|coalition,mandate
  diplomat|a person whose job is to represent their country abroad|外交官|The ___ spoke four languages, which helped him represent his country at embassies abroad.|As a ___ at the embassy in Paris, she must choose her words carefully when speaking for her government.|He worked for his government as a ___ in Paris before he became a writer.|dissident,demonstrator|diplomats,diplomatic
  coalition|a group of parties or countries that join together to act|联盟，联合政府|Three parties joined together in the ___ that formed the new government.|The ___ of nations, twelve countries acting together, sent aid to the region.|The ___ broke apart after a year when one of the allied parties walked out.|cabinet,envoy|coalitions
  mandate|the authority given to a government or person by the people to carry out a plan|授权，任期|The landslide election gave the party a ___ to change the tax laws, the clear authority the voters had handed it.|When her ___ from the voters ends next year, she will no longer have the authority to govern.|After winning by millions of votes, the leader claimed a ___ for sweeping reform.|referendum,coalition|mandates
  dissident|a person who openly disagrees with a government, often at great risk|持不同政见者|The ___ was jailed for years for writing books against the regime.|Every ___ in the country, every writer who openly criticized the government, knew the risk of speaking out.|The former ___, once jailed for openly opposing the old regime in print, later became president.|demonstrator,diplomat|dissidents
  demonstrator|a person who takes part in a public protest|示威者|Each ___ at the rally against the new road carried a sign and chanted.|Police asked the ___ with the megaphone to step back from the factory gate during the protest.|A young ___ at the climate protest spoke to the crowd.|dissident,lobbyist|demonstrators
  parliament|the group of elected people who make the laws of a country|议会，国会|The members of ___, elected by the people, voted to pass the new law.|She was elected to ___ at the age of thirty, winning a seat where laws are made.|The prime minister defended the bill before ___, where hundreds of elected lawmakers debated it.|cabinet,coalition|parliaments,parliamentary
  cabinet|the group of senior ministers who advise the head of a government|内阁|The prime minister met with her ___, the senior ministers who advise her.|The president chose him as the youngest member of his ___, in charge of the defense ministry.|Around the table, the ___ of twelve senior ministers agreed on the budget to put before the lawmakers.|parliament,coalition|cabinets
  envoy|a messenger sent by one government to another on a special mission|特使|The king sent his ___ to the enemy's court to carry an offer of peace.|The president's ___ carried a secret letter to the leader of the rebel nation.|A special ___ was sent abroad by the government to bargain for the release of the hostages.|lobbyist,demonstrator|envoys
  `,
  "context-clues",
  {
    intro: t(
      "The **ambassador** and a special **envoy** spent weeks of quiet **diplomacy** abroad, while at home **parliament** argued over the treaty. These ten words help you follow how governments run and how countries talk to each other.",
      "大使（**ambassador**）和一位特使（**envoy**）在国外进行了数周低调的外交（**diplomacy**），而国内的议会（**parliament**）正为条约争论不休。这十个词帮你理解政府如何运作、国家之间如何交涉。",
    ),
    watchOut: {
      meanings: t(
        "An **ambassador** lives abroad for years to represent a country; an **envoy** is sent on one special mission; a **diplomat** is anyone whose job is this kind of work.",
        "**ambassador** 长驻国外多年代表国家；**envoy** 为一项特殊使命被派出；**diplomat** 泛指从事这类工作的人。",
      ),
      use: t(
        "**Parliament** is the elected body that makes laws; the **cabinet** is the few ministers who advise the leader; a **coalition** is parties or countries joining forces.",
        "**parliament** 是选出来立法的机构；**cabinet** 是辅佐首脑的少数部长；**coalition** 是政党或国家联手。",
      ),
      spelling: t(
        "**Parliament** hides an **i** after **parl-**; **ambassador** has a double **s** and ends in **-or**; **diplomacy** ends in **-acy**, though **diplomat** ends in **-at**.",
        "**parliament** 在 **parl-** 后藏着一个 **i**；**ambassador** 有两个 **s**，结尾是 **-or**；**diplomacy** 结尾是 **-acy**，而 **diplomat** 结尾是 **-at**。",
      ),
    },
    notes: `
      ambassador|an official in Tokyo meeting the prime minister on behalf of our country|a woman living in Japan for four years to serve her country there|an official called home from a foreign capital after a quarrel between nations|ambassador represents a country abroad; dissident opposes a government at home|ambassador 在国外代表国家；dissident 在国内反对政府|dissident openly opposes a government, not someone who speaks for a country abroad|dissident 公开反对政府，不是在国外代表国家的人|lobbyist is paid to persuade lawmakers for a business, not sent abroad to represent a nation|lobbyist 受雇游说议员，不是被派往国外代表国家的人|am · bas · sa · dor|double s and the -or ending|两个 s，结尾是 -or
      diplomacy|months of careful talks between two countries' leaders that avoided a war|tact used to calm angry customers without upsetting anyone|patient talks between two governments that freed prisoners|diplomacy is managing relations through talk; coalition is a group that joins together|diplomacy 是通过交谈处理关系；coalition 是联合起来的团体|coalition is a group of parties or countries, not the skill of talking calmly and carefully|coalition 是政党或国家的联盟，不是冷静谨慎交谈的本领|mandate is authority given by voters, not careful talks or tact|mandate 是选民授予的权力，不是谨慎交谈或手腕|di · plo · ma · cy|the -acy ending, not -asy|结尾是 -acy，不是 -asy
      diplomat|a man speaking four languages to represent his country at embassies|a woman at the embassy in Paris speaking for her government|a man who worked for his government in Paris before becoming a writer|diplomat works for a government abroad; dissident works against a government|diplomat 为政府驻外工作；dissident 反对政府|dissident opposes the government, so he would never speak for it at an embassy|dissident 反对政府，绝不会在使馆代表政府发言|demonstrator joins a protest in the street, not a job at an embassy for the government|demonstrator 是街头示威者，不是在使馆为政府工作的人|dip · lo · mat|the -at ending, not -ate|结尾是 -at，不是 -ate
      coalition|three parties joining together to form a government|twelve countries acting together to send aid|allied parties that broke apart when one walked out|coalition is parties or countries joining forces; cabinet is the leader's ministers|coalition 是政党或国家联手；cabinet 是首脑的部长班子|cabinet is the small group of ministers a leader picks, not parties or nations joining forces|cabinet 是首脑挑选的部长班子，不是政党或国家联手|envoy is one messenger, not a group of parties or nations|envoy 是一位使者，不是政党或国家组成的团体|co · a · li · tion|the -tion ending after coali-|coali- 后接 -tion
      mandate|clear authority handed to a party by voters in a landslide election|authority from the voters that ends next year|a leader's claim to power for reform after winning by millions of votes|mandate is the authority voters give; referendum is a vote on one question|mandate 是选民授予的权力；referendum 是就一个问题的全民投票|referendum is a single vote on one question, not authority handed to a party or leader|referendum 是就单一问题的投票，不是授予政党或领导人的权力|coalition is a group of parties, not the authority voters give|coalition 是政党联盟，不是选民授予的权力|man · date|man plus date|man 加 date
      dissident|a writer jailed for years for books against the regime|writers who openly criticized the government and knew the risk|a man once jailed for opposing the old regime in print|dissident opposes a government openly over years; demonstrator joins one protest|dissident 长期公开反对政府；demonstrator 参加某次示威|demonstrator joins a public protest in the street, not someone who writes against the regime for years|demonstrator 是参加街头示威的人，不是长年撰文反对政权的人|diplomat speaks for the government, the opposite of openly criticizing it|diplomat 代表政府发言，正好和公开批评政府相反|dis · si · dent|double s and the -ent ending|两个 s，结尾是 -ent
      demonstrator|a person at a rally against a new road, carrying a sign|a protester with a megaphone at a factory gate|a young protester at a climate rally speaking to the crowd|demonstrator joins a protest; dissident openly opposes a whole government|demonstrator 参加示威；dissident 公开反对整个政府|dissident opposes a whole government at great risk, not someone joining one protest about a road, a factory or the climate|dissident 冒险反对整个政府，不是参加一次关于道路、工厂或气候的示威的人|lobbyist quietly persuades lawmakers in their offices, not someone carrying signs at a protest|lobbyist 在办公室游说议员，不是举牌示威的人|dem · on · stra · tor|the -or ending, not -er|结尾是 -or，不是 -er
      parliament|members elected by the people who voted to pass a law|a body a woman was elected to, where laws are made|hundreds of elected lawmakers debating a bill|parliament is the elected lawmaking body; cabinet is the leader's ministers|parliament 是选出的立法机构；cabinet 是首脑的部长班子|cabinet is a few ministers chosen by the leader, not hundreds of lawmakers elected by the people|cabinet 是首脑挑选的少数部长，不是人民选出的数百名议员|coalition is parties joining forces, not the chamber people are elected to|coalition 是政党联手，不是人们当选进入的议院|par · lia · ment|the hidden i after parl-|parl- 后面藏着 i
      cabinet|the senior ministers who advise the prime minister|a group a president chose a young man to join, in charge of defense|twelve senior ministers around a table agreeing on a budget|cabinet is the leader's ministers; parliament is the elected lawmakers|cabinet 是首脑的部长；parliament 是选出的议员|parliament is hundreds of elected lawmakers, not a few senior ministers the leader chooses|parliament 是选出的数百名议员，不是首脑挑选的几位部长|coalition is parties or countries joining forces, not the ministers around the leader's table|coalition 是政党或国家联手，不是首脑身边的部长|cab · i · net|the i in the middle and the -net ending|中间是 i，结尾是 -net
      envoy|a messenger sent by a king to the enemy's court with an offer of peace|a messenger carrying a president's secret letter to a rebel leader|a messenger sent abroad to bargain for hostages|envoy is a government's messenger on a mission; lobbyist works for a business|envoy 是政府派出执行使命的使者；lobbyist 为企业游说|lobbyist persuades lawmakers for a business, not a messenger sent by a ruler to another nation|lobbyist 为企业游说议员，不是统治者派往他国的使者|demonstrator protests in the street, not a messenger sent on a mission by a government|demonstrator 在街头示威，不是政府派出执行使命的使者|en · voy|the -voy ending|结尾是 -voy
    `,
  },
);

const rightWrong = batch(
  "words-of-right-and-wrong",
  ["Words of Right and Wrong", "是非对错的词"],
  ["right and wrong", "是非对错"],
  `
  integrity|the quality of being honest and having strong moral principles|正直，诚信|The judge was known for her ___: she never took a bribe and always told the truth.|He showed ___ by returning the money, though no one would ever have known he had found it.|A leader without ___, who lies whenever it helps him, cannot be trusted.|hypocrisy,temptation
  virtue|a good quality in a person, or goodness in general|美德|Patience is a ___, a good quality that everyone should try to build.|The old story praises courage as the highest ___ a person can have.|She believed that goodness, or ___, is its own reward.|temptation,hypocrisy|virtues,virtuous
  conscience|the inner sense of right and wrong that makes you feel guilty when you do wrong|良心|His ___, the inner voice telling him lying was wrong, would not let him lie.|She acted according to her ___, doing what she believed was right even when it cost her.|The thief had a guilty ___ and could not sleep, knowing he had done wrong.|temptation,resentment|consciences
  morality|ideas about what is right and wrong behavior|道德|The book asks hard questions about ___, about what is right and wrong in war.|People hotly debated the ___ of the decision: was it right to keep the truth from the public?|Different cultures share many ideas of ___, such as that stealing and lying are wrong.|temptation,humility
  scruple|a feeling that stops you from doing something you think is wrong|顾虑，良心不安|He had no ___ about taking the credit for her work, though he knew it was wrong.|She had a ___ about lying, a moral doubt that stopped her even when a lie would protect a friend.|A man without a single ___ will do anything for money, however wrong.|temptation,grievance|scruples,scrupulous
  rationalize|to try to explain or excuse a wrong action with reasons that sound good|为……找借口|He tried to ___ taking the money by telling himself he would pay it back someday.|People often ___ their bad habits with excuses, saying that everyone does them.|She tried to ___ the lie, explaining that it was only to spare her friend's feelings.|repent,forgive|rationalized,rationalizes
  temptation|the wish to do or have something, especially something wrong|诱惑|He fought the ___ to read her diary, though it lay open on the desk.|The open box of chocolates was too great a ___ for the hungry boy to resist.|The hero resists every ___ the villain offers him: gold, power and fame.|scruple,hypocrisy|temptations
  corrupt|willing to act dishonestly in return for money or power|腐败的|The ___ official took bribes in exchange for building permits.|The newspaper exposed the ___ mayor, who had stolen money from the city.|Police who are ___ will let criminals go free for a bribe.|accountable,selfless|corrupted,corrupts,corruption
  hypocrisy|pretending to have beliefs or virtues that you do not really have|虚伪|It is ___ to preach honesty and then cheat on your own taxes.|Readers saw the ___ in his speech: he praised saving money while buying a third yacht.|The novel attacks the ___ of rich people who claim to care for the poor but pay their servants nothing.|temptation,integrity
  accountable|responsible for your actions and expected to explain them|负有责任的|Leaders must be held ___ for their decisions and made to explain them to the public.|She felt ___ to her team, knowing she would have to answer for any mistake.|The report made the company ___ for the oil spill, so it had to explain and pay for the cleanup.|corrupt,righteous|accountability
  `,
  "context-clues",
  {
    intro: t(
      "Faced with the **temptation** of a bribe, the judge listened to her **conscience**; her **integrity** stood out among so many **corrupt** officials. These ten words help you talk about right and wrong and the choices characters make.",
      "面对贿赂的诱惑（**temptation**），法官听从了自己的良心（**conscience**）；在众多腐败（**corrupt**）官员中，她的正直（**integrity**）格外突出。这十个词帮你谈论是非对错和人物做出的选择。",
    ),
    watchOut: {
      meanings: t(
        "**Integrity** is honesty that holds firm; **hypocrisy** is pretending to virtues you lack; **temptation** is the pull toward doing wrong.",
        "**integrity** 是坚守的诚实；**hypocrisy** 是假装拥有自己没有的美德；**temptation** 是把人拉向错事的诱惑。",
      ),
      use: t(
        "A **scruple** holds you back before you do wrong; to **rationalize** is to make excuses after you have done it.",
        "**scruple** 在你做错事之前拦住你；**rationalize** 是做了错事之后找借口。",
      ),
      spelling: t(
        "**Conscience** hides the word **science**, unlike conscious; **scruple** ends in **-ple**; **hypocrisy** begins **hypo-** and ends **-isy**.",
        "**conscience** 里藏着 **science**，和 conscious 不同；**scruple** 结尾是 **-ple**；**hypocrisy** 以 **hypo-** 开头、以 **-isy** 结尾。",
      ),
    },
    notes: `
      integrity|a judge who never took a bribe and always told the truth|returning money no one would ever have known was found|the quality a lying leader lacks, so that he cannot be trusted|integrity is real honesty; hypocrisy is pretended goodness|integrity 是真正的诚实；hypocrisy 是假装的善良|hypocrisy is pretending to be good, the very opposite of refusing bribes and returning money|hypocrisy 是假装善良，和拒收贿赂、归还钱财正好相反|temptation is the pull toward doing wrong, not the strength to stay honest|temptation 是做错事的诱惑，不是坚守诚实的品质|in · teg · ri · ty|the -teg- in the middle, not -tig-|中间是 -teg-，不是 -tig-
      virtue|a good quality everyone should try to build, like patience|courage praised as the highest good quality a person can have|goodness, which is its own reward|virtue is goodness; temptation pulls you toward wrong|virtue 是美德；temptation 把人拉向错事|temptation is a pull toward doing wrong, not a good quality to build or praise|temptation 是做错事的诱惑，不是值得培养或赞扬的好品质|hypocrisy is pretended goodness, which no story praises as its highest good|hypocrisy 是假装的善良，没有故事会把它当作最高美德来赞颂|vir · tue|the -tue ending|结尾是 -tue
      conscience|an inner voice telling a man that lying was wrong|a woman doing what she believed was right even when it cost her|a guilty inner sense that kept a thief from sleeping|conscience is the inner sense of right and wrong; temptation is the pull to do wrong|conscience 是内心的是非感；temptation 是做错事的诱惑|temptation pushes you toward doing wrong, so it would never stop a lie or make a thief feel guilty|temptation 推人去做错事，不会阻止说谎，也不会让小偷内疚|resentment is anger at being treated unfairly, not an inner sense of right and wrong|resentment 是对不公平对待的怨恨，不是内心的是非感|con · science|science hidden after con-|con- 后面藏着 science
      morality|hard questions about what is right and wrong in war|whether it was right to keep the truth from the public|shared ideas that stealing and lying are wrong|morality is ideas of right and wrong; temptation is a pull toward wrong|morality 是是非观念；temptation 是做错事的诱惑|temptation is the wish to do something wrong, not ideas about what is right and wrong|temptation 是想做错事的念头，不是关于是非的观念|humility is not thinking yourself better than others, not ideas about right and wrong in general|humility 是不自以为高人一等，不是一般的是非观念|mo · ral · i · ty|moral plus -ity|moral 加 -ity
      scruple|a feeling a man lacked when he took the credit for her work|a moral doubt that stopped a woman from lying|the feeling a man lacks when he will do anything for money|scruple holds you back from wrong; temptation pulls you toward it|scruple 拦住你不做错事；temptation 拉你去做错事|temptation pulls you toward doing wrong, the opposite of a doubt that stops you|temptation 拉人去做错事，和拦住你的顾虑正好相反|grievance is a complaint about being treated unfairly, not a moral doubt that holds you back|grievance 是对受到不公平对待的抱怨，不是让你止步的道德顾虑|scru · ple|the -ple ending, not -pel|结尾是 -ple，不是 -pel
      rationalize|a man telling himself he would pay back money he took|excusing bad habits by saying that everyone does them|excusing a lie as only sparing a friend's feelings|rationalize is making excuses; repent is feeling sorry|rationalize 是找借口；repent 是悔过|repent means to feel truly sorry for a wrong, not to make excuses for it|repent 是真心悔过，不是为错事找借口|forgive means to stop being angry at someone else, not to excuse your own wrong with reasons|forgive 是不再生别人的气，不是为自己的错找理由|ra · tion · al · ize|rational kept whole before -ize|完整保留 rational，再加 -ize
      temptation|an urge to read a diary lying open on the desk|a box of chocolates too hard for a hungry boy to resist|gold, power and fame a villain offers a hero|temptation is the pull toward something; scruple is what holds you back|temptation 是诱惑；scruple 是让你止步的顾虑|scruple holds you back from wrong, so you would not fight it or find it hard to resist|scruple 让人不做错事，不需要抵抗，也不难抗拒|hypocrisy is pretending to be good, not something offered to you or hard to resist|hypocrisy 是假装善良，不是别人摆在你面前、让你难以抗拒的东西|temp · ta · tion|the p after tem- and the -tion ending|tem- 后有 p，结尾是 -tion
      corrupt|an official who took bribes for building permits|a mayor who had stolen money from the city|police who let criminals go free for a bribe|corrupt means dishonest for money; accountable means answerable for your actions|corrupt 是贪污受贿的；accountable 是要为行为负责的|accountable people answer for their actions, not ones who take bribes and steal|accountable 是要对行为负责的人，不是受贿偷钱的人|selfless people care for others, not ones who take bribes for themselves|selfless 是关心他人的人，不是为自己受贿的人|cor · rupt|double r and the -upt ending|两个 r，结尾是 -upt
      hypocrisy|preaching honesty and then cheating on your own taxes|praising saving money while buying a third yacht|rich people claiming to care for the poor while paying servants nothing|hypocrisy is saying one thing and doing another; temptation is a pull to do wrong|hypocrisy 是言行不一；temptation 是做错事的诱惑|temptation is a pull toward wrong, not the gap between what someone preaches and what they do|temptation 是做错事的诱惑，不是说一套做一套|integrity is real honesty, the opposite of preaching one thing and doing another|integrity 是真正的诚实，和说一套做一套正好相反|hy · poc · ri · sy|the y after h and the -isy ending|h 后面是 y，结尾是 -isy
      accountable|leaders made to explain their decisions to the public|a woman who would have to answer to her team for any mistake|a company made to explain and pay for an oil spill|accountable means you must answer for your actions; corrupt means dishonest|accountable 是要对行为负责；corrupt 是腐败的|corrupt means dishonest for money, not made to explain and answer for decisions|corrupt 是为钱而不诚实，不是要为决定作出解释和负责|righteous means morally right, not being made to answer for a mistake or a spill|righteous 是道德正直的，不是要为错误或泄漏负责|ac · count · a · ble|double c and the -able ending|两个 c，结尾是 -able
    `,
  },
);

const character = batch(
  "words-of-good-character",
  ["Words of Good Character", "良好品格的词"],
  ["character", "品格"],
  `
  honesty|the quality of telling the truth and not cheating|诚实|Her ___ won the trust of the whole class: she never cheated and always told the truth.|He was praised for his ___ when he returned the lost wallet with every coin still inside.|His ___ meant he admitted he had broken the window instead of blaming his brother.|dignity,obligation
  hypocrite|a person who claims to have beliefs or virtues that they do not have|伪君子|He called the mayor a ___ for flying a private jet to a meeting about saving fuel.|She did not want to be a ___, so she followed the same advice she gave others.|Only a ___ would scold others for lying while telling lies himself.|patriot,lobbyist|hypocrites
  sincerity|the quality of meaning what you say|真诚|No one doubted the ___ of her apology; she clearly meant every word.|He spoke with such ___ that everyone knew he truly meant his promise.|The ___ in his letter, every word of it heartfelt and true, moved her to tears.|empathy,obligation
  selfless|caring more about others than about yourself|无私的|The nurse's ___ work through the night, with no thought for her own rest, saved many lives.|Giving away his only coat to a freezing stranger was truly ___.|She was ___ in caring for her sick brother, putting his needs before her own.|corrupt,accountable
  altruism|caring about others and helping them without wanting anything in return|利他主义|Freely donating blood to strangers, expecting nothing in return, is an act of ___.|Scientists study ___ in animals, such as birds that risk their lives to warn the flock.|Her ___, helping every struggling student for no reward, made her a beloved teacher.|obligation,hypocrisy
  compassion|a strong feeling of sympathy for someone who is suffering, and a wish to help|同情，怜悯|She treated the injured dog with ___, gently cleaning its wounds.|The judge showed ___ to the young offender, feeling sorry for his hard life and giving him a second chance.|Moved by ___ for the starving families, he gave away half his harvest.|sincerity,resentment
  empathy|the ability to understand and share another person's feelings|共情，同理心|Reading novels can build ___, helping you feel what other people feel.|Her ___ helped her comfort her friend, since she could imagine exactly how sad he felt.|A good doctor needs ___ as well as skill, to understand how frightened patients feel.|sincerity,humility
  obligation|something you must do because of a law, a promise or duty|义务，责任|He felt a strong ___ to help his neighbors, since he had promised their father he would.|Voting is both a right and a legal ___ in some countries, where you are fined if you do not vote.|She had no ___ to stay after work, but she did anyway.|dignity,altruism|obligations
  righteous|morally right, or feeling sure that you are|正义的；自以为是的|She was filled with ___ anger at the unfair rule, sure that she was in the right.|The ___ judge punished the guilty and freed the innocent, always doing what was morally right.|His ___ tone, as if he alone knew what was right, annoyed the others.|selfless,penitent
  dignity|the quality of being worthy of respect, and a calm, serious manner|尊严|Every person deserves to be treated with ___, with the respect that all human beings are owed.|She lost the race but kept her ___, shaking the winner's hand with her head held high.|He faced the judge with quiet ___, standing tall and calm.|honesty,resentment
  `,
  "context-clues",
  {
    intro: t(
      "The nurse's **selfless** work, her **compassion** for the sick and her quiet **dignity** earned everyone's respect. These ten words help you describe the qualities that make someone good, and the people who only pretend to have them.",
      "这位护士无私（**selfless**）的工作、对病人的同情（**compassion**）和沉静的尊严（**dignity**）赢得了所有人的尊重。这十个词帮你描述让人成为好人的品质，以及只是假装拥有这些品质的人。",
    ),
    watchOut: {
      meanings: t(
        "**Compassion** is feeling sorry for someone and wanting to help; **empathy** is feeling what they feel; **altruism** is actually helping while asking nothing back.",
        "**compassion** 是同情别人、想要帮忙；**empathy** 是感受别人的感受；**altruism** 是真正去帮忙且不求回报。",
      ),
      use: t(
        "**Honesty** is telling the truth; **sincerity** is meaning what you say; a **hypocrite** says one thing and does another.",
        "**honesty** 是说真话；**sincerity** 是真心实意；**hypocrite** 是说一套做一套的人。",
      ),
      spelling: t(
        "**Righteous** ends in **-teous**, not -chous; **compassion** has a double **s**; **honesty** begins with a silent **h**.",
        "**righteous** 结尾是 **-teous**，不是 -chous；**compassion** 有两个 **s**；**honesty** 开头的 **h** 不发音。",
      ),
    },
    notes: `
      honesty|a girl who never cheated and always told the truth|returning a lost wallet with every coin still inside|admitting to breaking a window instead of blaming a brother|honesty is telling the truth; dignity is being worthy of respect|honesty 是说真话；dignity 是值得尊重的尊严|dignity is a calm, respected manner, not telling the truth or owning up|dignity 是沉稳、受尊重的风度，不是说真话或承认错误|obligation is a duty you must do, not the quality of never cheating or lying|obligation 是必须履行的义务，不是从不作弊撒谎的品质|hon · es · ty|the silent h at the start|开头的 h 不发音
      hypocrite|a mayor flying a private jet to a meeting about saving fuel|a person who does not follow the advice she gives others|someone scolding others for lying while telling lies himself|hypocrite does what he tells others not to; patriot loves his country|hypocrite 说一套做一套；patriot 热爱祖国|patriot is someone who loves and defends their country, not someone who breaks the rules they preach|patriot 是热爱并保卫祖国的人，不是违背自己所宣扬准则的人|lobbyist is paid to persuade lawmakers, not someone who does what he scolds others for|lobbyist 受雇游说议员，不是做自己指责别人的事的人|hyp · o · crite|the y after h and the -crite ending|h 后面是 y，结尾是 -crite
      sincerity|an apology in which a woman clearly meant every word|a man speaking so that everyone knew he truly meant his promise|a letter in which every word was heartfelt and true|sincerity is meaning what you say; empathy is sharing another's feelings|sincerity 是真心实意；empathy 是感同身受|empathy is feeling what someone else feels, not meaning your own words|empathy 是感受别人的感受，不是自己说话真心|obligation is a duty you must do, not meaning every word you say|obligation 是必须履行的义务，不是说话真心实意|sin · cer · i · ty|sincere drops its last e before -ity|sincere 去掉末尾 e 再加 -ity
      selfless|a nurse working through the night with no thought for her own rest|giving away an only coat to a freezing stranger|a woman putting her sick brother's needs before her own|selfless puts others first; corrupt takes for itself|selfless 先人后己；corrupt 为己谋私|corrupt means dishonest for money, the opposite of putting others first|corrupt 是为钱而不诚实，正好和先人后己相反|accountable means having to answer for your actions, not putting others' needs before your own|accountable 是要为行为负责，不是把别人的需要放在自己前面|self · less|self plus -less, with double s at the end|self 加 -less，结尾两个 s
      altruism|freely giving blood to strangers and expecting nothing in return|birds that risk their lives to warn the flock|a teacher helping every struggling student for no reward|altruism is helping freely; obligation is helping because you must|altruism 是自愿帮助；obligation 是因为必须而帮助|obligation is something you must do by duty, not help given freely for no reward|obligation 是按义务必须做的事，不是不求回报的自愿帮助|hypocrisy is pretended goodness, not real help given with nothing in return|hypocrisy 是假装的善良，不是不求回报的真正帮助|al · tru · ism|the altru- start and the -ism ending|开头是 altru-，结尾是 -ism
      compassion|gently cleaning an injured dog's wounds|a judge feeling sorry for a young offender's hard life and giving a second chance|a man moved to give away half his harvest to starving families|compassion is sympathy that wants to help; sincerity is meaning what you say|compassion 是想帮忙的同情；sincerity 是真心实意|sincerity is meaning what you say, not feeling sorry for someone who suffers|sincerity 是说话真心，不是同情受苦的人|resentment is bitter anger at unfair treatment, not sympathy that makes you help|resentment 是对不公平待遇的怨恨，不是让人出手相助的同情|com · pas · sion|double s before -ion|-ion 前面有两个 s
      empathy|feeling what other people feel through reading novels|imagining exactly how sad a friend felt in order to comfort him|a doctor understanding how frightened patients feel|empathy is sharing a feeling; sincerity is meaning your words|empathy 是感同身受；sincerity 是真心实意|sincerity is meaning what you say, not imagining how another person feels|sincerity 是说话真心，不是体会别人的感受|humility is not thinking yourself better than others, not sharing another person's feelings|humility 是不自以为高人一等，不是分担别人的感受|em · pa · thy|the -pathy ending, as in sympathy|结尾是 -pathy，和 sympathy 一样
      obligation|a duty to help neighbors because of a promise to their father|a legal duty to vote, with a fine for not doing it|a duty to stay after work that a woman did not have|obligation is a duty you must do; altruism is help given freely|obligation 是必须做的义务；altruism 是自愿的帮助|dignity is being worthy of respect, not a duty, a promise or a law you must obey|dignity 是值得尊重，不是必须遵守的义务、承诺或法律|altruism is help given freely, not something a promise or a law makes you do|altruism 是自愿的帮助，不是承诺或法律逼你做的事|ob · li · ga · tion|the i after obl- and the -gation ending|obl- 后是 i，结尾是 -gation
      righteous|anger at an unfair rule from someone sure she was in the right|a judge punishing the guilty and freeing the innocent|a tone as if one man alone knew what was right|righteous means morally right; selfless means putting others first|righteous 是道德正直的；selfless 是先人后己的|selfless means putting others first, not being sure you are in the right or judging fairly|selfless 是先人后己，不是自认为正确或公正审判|penitent means sorry for having done wrong, the opposite of being sure you are right|penitent 是为做错事而悔恨，和自认为正确正好相反|right · eous|the -eous ending, said like chus|结尾是 -eous，读音像 chus
      dignity|the respect that all human beings are owed|a woman who lost a race but shook the winner's hand with her head high|a man facing the judge standing tall and calm|dignity is being worthy of respect; honesty is telling the truth|dignity 是值得尊重的尊严；honesty 是说真话|honesty is telling the truth, not the respect owed to every person or a calm, proud manner|honesty 是说真话，不是每个人应得的尊重，也不是沉稳自尊的风度|resentment is bitter anger, not a calm, proud way of facing loss or a judge|resentment 是怨恨，不是平静自尊地面对失败或法官|dig · ni · ty|the gn split across dig- and -ni-|g 和 n 分属 dig- 和 -ni-
    `,
  },
);

const politics = batch(
  "words-of-politics-and-power",
  ["Words of Politics and Power", "政治与权力的词"],
  ["politics and elections", "政治与选举"],
  `
  incumbent|the person who holds an office at present|现任者|The ___, who has held the office for eight years, won the election again by a wide margin.|It is hard for a challenger to defeat the ___ who already holds the seat.|The ___ mayor, now finishing her second term in office, is running for a third.|constituent,lobbyist|incumbents
  constituent|a voter who lives in the area that an elected official represents|选民|The senator answered every letter from each ___ living in her state.|One ___ from the senator's district wrote to complain about the potholes on her street.|She listened to every ___ in her district who called her office, and changed her vote.|electorate,incumbent|constituents
  partisan|strongly supporting one party or side, often without considering the other|党派性的，偏袒的|The vote split along ___ lines, with every member of each party voting with their own side.|His ___ speech, praising his own party and mocking the other, angered the opposition.|The newspaper was accused of ___ reporting that always favored one party.|bipartisan,federal
  referendum|a vote by all the people on a single question|全民公投|The country held its first ___ on leaving the union, letting every citizen vote yes or no.|The ___ on the new bridge passed with sixty percent of the vote of all the town's people.|Every citizen will vote yes or no on the new law in next spring's ___.|caucus,inauguration|referendums,referenda
  inauguration|the ceremony at which a new leader formally begins their time in office|就职典礼|Thousands watched the president's ___, where she took the oath of office.|The ___ took place on a cold January day, when the new president was sworn in.|She gave a short speech at her ___ after promising to serve faithfully as governor.|referendum,caucus|inaugurations,inaugurate
  electorate|all the people in a country or area who have the right to vote|全体选民|The ___, the millions of voters across the country, was tired of the old party.|Young voters are a growing part of the nation's ___.|The candidate spoke directly to the whole ___, everyone in the country with the right to vote.|constituent,caucus|electorates
  caucus|a meeting of the members of a political party to choose candidates or make plans|党团会议|The party held a ___, a meeting of its members, to pick its candidate.|The ___ of party members lasted late into the night as they argued over plans.|Party members in each state gather at a ___ to send delegates to the convention.|referendum,filibuster|caucuses
  filibuster|a very long speech made to delay or block a vote|冗长演说（阻挠议事）|The senator spoke for twenty-four hours without stopping in a ___ to delay the vote.|The ___, hours of speeches meant to block the vote, stopped the bill from passing.|To end a ___ and force a vote, the Senate needs sixty votes.|caucus,mandate|filibusters
  lobbyist|a person paid to try to persuade lawmakers to support a cause or business|说客|The ___, paid by an oil company, met with lawmakers about the new tax.|Each ___ in the hallway represented a different company trying to win lawmakers' votes.|The ___ hired by the factory owners argued to the senators that the law would cost jobs.|incumbent,constituent|lobbyists
  bipartisan|supported by both of the main political parties|两党的|The bill had ___ support, with members of both parties voting for it.|A ___ committee, with five members from each party, studied the problem.|It is rare for a vote to be ___ these days, with both parties agreeing.|partisan,federal
  `,
  "context-clues",
  {
    intro: t(
      "The **incumbent** senator met a **lobbyist** in the morning and spoke to the **electorate** at night, promising **bipartisan** answers. These ten words help you follow elections, votes and the people who try to sway them.",
      "这位现任（**incumbent**）参议员上午会见说客（**lobbyist**），晚上向全体选民（**electorate**）演讲，承诺提出两党（**bipartisan**）都支持的方案。这十个词帮你看懂选举、投票，以及试图左右它们的人。",
    ),
    watchOut: {
      meanings: t(
        "A **referendum** is a vote by all the people on one question; a **caucus** is a meeting of one party's members; an **inauguration** is the ceremony that starts a leader's term.",
        "**referendum** 是全体人民就一个问题投票；**caucus** 是一个政党成员的会议；**inauguration** 是领导人开始任期的典礼。",
      ),
      use: t(
        "A **constituent** is one voter; the **electorate** is all the voters together. **Partisan** takes one side; **bipartisan** brings both sides together.",
        "**constituent** 是一位选民；**electorate** 是全体选民。**partisan** 偏向一方；**bipartisan** 让两党走到一起。",
      ),
      spelling: t(
        "**Caucus** has **au** then **u**; **inauguration** starts **inaug-**, with **au** again; **filibuster** keeps an **i**, never an **e**, in **fil-** and **-i-**.",
        "**caucus** 先是 **au** 后是 **u**；**inauguration** 以 **inaug-** 开头，同样有 **au**；**filibuster** 的 **fil-** 和 **-i-** 都是 **i**，不是 **e**。",
      ),
    },
    notes: `
      incumbent|a person who has held an office for eight years and won again|the one who already holds a seat a challenger wants|a mayor finishing her second term in office|incumbent holds the office now; constituent votes for whoever holds it|incumbent 是现任者；constituent 是投票给现任者的选民|constituent is a voter in a district, not the person who holds the office|constituent 是选区里的选民，不是担任职务的人|lobbyist is paid to persuade officials, not the person who holds the office and runs again|lobbyist 受雇游说官员，不是担任职务并竞选连任的人|in · cum · bent|the -bent ending, not -bant|结尾是 -bent，不是 -bant
      constituent|a voter in a senator's state whose letter she answered|a voter from the senator's district complaining about potholes|voters in a district calling an official's office|constituent is one voter; electorate is all voters together|constituent 是一位选民；electorate 是全体选民|electorate is all the voters together, so it cannot be one person writing a letter or calling|electorate 是全体选民，不可能是写信或打电话的某一个人|incumbent is the official who holds office, not the voter writing or calling to that official|incumbent 是在任官员，不是写信或打电话给官员的选民|con · stit · u · ent|the -stit- in the middle and the -ent ending|中间是 -stit-，结尾是 -ent
      partisan|a vote in which every member of each party sided with their own|a speech praising one party and mocking the other|newspaper reporting that always favored one party|partisan takes one side; bipartisan has both sides agreeing|partisan 偏向一方；bipartisan 两党一致|bipartisan means both parties agree, the opposite of each side voting only for itself or mocking the other|bipartisan 是两党一致，和各自只投自己一方或嘲讽对方正好相反|federal describes a national government, not favoring one party over another|federal 指联邦政府的，不是偏袒某一党派|par · ti · san|the -san ending, not -zan|结尾是 -san，不是 -zan
      referendum|a vote in which every citizen says yes or no on leaving the union|a vote of all a town's people on a new bridge|every citizen voting yes or no on a new law|referendum is a vote by all the people; caucus is a meeting of one party|referendum 是全民投票；caucus 是一个政党的会议|caucus is a meeting of one party's members, not a vote by every citizen|caucus 是一个政党成员的会议，不是全体公民投票|inauguration is the ceremony starting a leader's term, not a yes-or-no vote|inauguration 是领导人就职典礼，不是是否投票|ref · er · en · dum|the -dum ending|结尾是 -dum
      inauguration|a president taking the oath of office before thousands|a new president sworn in on a cold January day|a speech given after promising to serve faithfully as governor|inauguration starts a term; referendum is a vote on one question|inauguration 开启任期；referendum 是就一个问题投票|referendum is a vote of all the people, not a ceremony where a leader takes an oath|referendum 是全民投票，不是领导人宣誓的典礼|caucus is a party meeting to choose candidates, not the swearing-in of a winner|caucus 是挑选候选人的政党会议，不是胜选者的宣誓就职|in · au · gu · ra · tion|the au after in- and the -ration ending|in- 后是 au，结尾是 -ration
      electorate|millions of voters across a country tired of the old party|the voters of a nation, of which the young are a growing part|everyone in the country with the right to vote|electorate is all the voters; constituent is one voter|electorate 是全体选民；constituent 是一位选民|constituent is one voter in a district, not millions of voters across a whole country|constituent 是选区里的一位选民，不是全国数百万选民|caucus is a meeting of party members, not every person in the country who can vote|caucus 是政党成员的会议，不是全国所有有投票权的人|e · lec · tor · ate|elector plus -ate|elector 加 -ate
      caucus|a meeting of a party's members to pick its candidate|party members arguing over plans late into the night|a gathering of party members in each state to send delegates|caucus is a party meeting; referendum is a vote of all the people|caucus 是政党会议；referendum 是全民投票|referendum is a vote of all the people on one question, not a meeting of party members|referendum 是全民就一个问题投票，不是政党成员的会议|filibuster is a very long speech to block a vote, not a meeting where members choose candidates|filibuster 是阻挠表决的冗长演说，不是成员挑选候选人的会议|cau · cus|au first, then u|先是 au，后是 u
      filibuster|a senator speaking for twenty-four hours to delay a vote|hours of speeches meant to block a vote|something the Senate needs sixty votes to end and force a vote|filibuster is a long speech to block a vote; caucus is a party meeting|filibuster 是阻挠表决的冗长演说；caucus 是政党会议|caucus is a meeting of party members, not a speech that goes on for hours to block a vote|caucus 是政党成员的会议，不是连讲数小时阻挠表决的演说|mandate is authority from voters, not hours of speeches to block a vote|mandate 是选民授予的权力，不是阻挠表决的长篇演说|fil · i · bus · ter|i in fil- and -i-, then -buster|fil- 和 -i- 都是 i，后接 -buster
      lobbyist|a person paid by an oil company to meet lawmakers about a tax|people in a hallway representing companies trying to win lawmakers' votes|a person hired by factory owners to argue to senators|lobbyist persuades lawmakers for pay; incumbent holds an office|lobbyist 受雇游说议员；incumbent 是现任官员|incumbent is the person who holds an office, not someone paid by a company to persuade lawmakers|incumbent 是在任者，不是受公司雇用去游说议员的人|constituent is a voter in a district, not someone hired by a company to sway lawmakers|constituent 是选区选民，不是受公司雇用去左右议员的人|lob · by · ist|lobby plus -ist, keeping the y|lobby 加 -ist，保留 y
      bipartisan|support for a bill from members of both parties|a committee with five members from each party|a vote with both parties agreeing|bipartisan has both parties; partisan takes one side|bipartisan 是两党都支持；partisan 偏向一方|partisan means favoring one side, the opposite of support from both parties|partisan 是偏向一方，和两党都支持正好相反|federal describes a national government, not an agreement between both parties|federal 指联邦政府的，不是两党达成一致|bi · par · ti · san|bi- plus partisan|bi- 加 partisan
    `,
  },
);

const language = batch(
  "words-for-talking-about-language",
  ["Words for Talking About Language", "谈论语言的词"],
  ["language and style", "语言与文风"],
  `
  colloquial|used in everyday conversation rather than in formal writing|口语的|"Gonna" is the ___ way to say "going to," fine when chatting with friends but not in an essay.|The novel's dialogue is ___ and lively, full of the slang real teenagers use.|Avoid ___ words like "kids" and "stuff" in a formal report.|verbose,articulate
  articulate|able to express ideas clearly in words|善于表达的|She is the most ___ speaker in the class, able to explain any idea clearly in a few words.|Calm and ___, the student won the debate with clear, well-chosen words.|Even at six, he was ___ enough to explain exactly how he felt in clear sentences.|verbose,colloquial|articulated,articulates
  vernacular|the ordinary language spoken by the people of a place|方言，本地话|The poet wrote in the ___ of his village, the everyday speech of farmers, not in fancy Latin.|Dante chose to write in the Italian ___ that ordinary people spoke, instead of Latin.|The ___ of the dockyard, the everyday language the sailors spoke among themselves, is full of colorful words.|diction,cliche
  connotation|a feeling or idea that a word suggests in addition to its basic meaning|内涵，隐含意义|The word "home" has a warm ___, a feeling of safety beyond its plain meaning of a place to live.|"Cheap" has a negative ___, suggesting poor quality, while "inexpensive" does not, though both mean low in price.|Writers choose words for the feelings they suggest, their ___, as well as for their dictionary meaning.|denotation,cliche|connotations
  denotation|the exact, literal meaning of a word|本义，字面意义|The ___ of "snake" is simply a long reptile with no legs, without any feeling of danger or evil.|A dictionary gives the exact, literal ___ of a word.|The words "thin" and "skinny" have the same ___, the same literal meaning, but different feelings.|connotation,nuance|denotations
  nuance|a very small difference in meaning, feeling or color|细微差别|A skilled listener can hear every ___ in a friend's tone of voice, every slight shift of feeling.|The actor's voice gave each line a different ___, a slight change of feeling only careful listeners noticed.|The painter mixed her blues to catch every ___ of color in the evening sky.|connotation,cliche|nuances
  cliche|a phrase or idea used so often that it has lost its force|陈词滥调|"As cold as ice" is a ___, a phrase used so often that it no longer surprises anyone.|Her essay used one tired ___ after another, like "at the end of the day."|Try to replace each worn-out ___ with a fresh image of your own.|nuance,connotation|cliches,cliched
  verbose|using more words than are needed|冗长的，啰嗦的|His ___ report ran to forty pages when four would have done.|Cut the ___ opening, with its long paragraphs that say nothing, and start with the action.|That writer is so ___ that she never uses one word where ten will do.|succinct,articulate
  succinct|clear and short, using few words|简洁的|Her ___ answer, just five words, settled the argument.|Write a ___ summary of the chapter in no more than three sentences.|The best slogans are ___: short, clear and easy to remember.|verbose,colloquial
  diction|the choice of words a writer or speaker uses|措辞|The poet's ___ is simple and plain: she chooses short, everyday words.|Formal ___, careful choices of words like "Your Honor," suits a speech to the court.|Notice how the author's ___ changes when the narrator is angry, as she picks harsher words.|vernacular,connotation
  `,
  "context-clues",
  {
    intro: t(
      "The editor told her to cut the **verbose** opening, drop each **cliche** and choose her **diction** with care, so that every **nuance** came through. These ten words help you talk about how writers and speakers use words.",
      "编辑让她删掉冗长（**verbose**）的开头、去掉每一句陈词滥调（**cliche**）、仔细斟酌措辞（**diction**），让每个细微差别（**nuance**）都能体现出来。这十个词帮你谈论作者和说话者如何用词。",
    ),
    watchOut: {
      meanings: t(
        "**Denotation** is a word's dictionary meaning; **connotation** is the feeling it carries; a **nuance** is a tiny shade of difference in meaning, tone or color.",
        "**denotation** 是词典里的本义；**connotation** 是词带有的感情色彩；**nuance** 是意思、语气或颜色上的细微差别。",
      ),
      use: t(
        "**Colloquial** describes everyday talk; the **vernacular** is the everyday language of a whole place; **diction** is the words one writer chooses.",
        "**colloquial** 形容日常口语；**vernacular** 是一个地方的日常语言；**diction** 是某位作者选用的词。",
      ),
      spelling: t(
        "**Succinct** has a double **c** that sounds like /ks/; **colloquial** has a double **l** and a **qu**; **cliche** ends in **e**, from French.",
        "**succinct** 有两个 **c**，读 /ks/；**colloquial** 有两个 **l** 和一个 **qu**；**cliche** 来自法语，结尾是 **e**。",
      ),
    },
    notes: `
      colloquial|a way of saying "going to" fine for chatting but not for an essay|lively dialogue full of the slang real teenagers use|words like "kids" and "stuff" to avoid in a formal report|colloquial is casual everyday talk; verbose uses too many words|colloquial 是随意的日常口语；verbose 是用词太多|verbose means using far too many words, not short casual slang like "gonna" or "kids"|verbose 是用词过多，不是 "gonna" 或 "kids" 这样简短随意的俚语|articulate means clear and well expressed, not the casual slang you keep out of a formal report|articulate 是表达清楚得体，不是正式报告里要避免的随意俚语|col · lo · qui · al|double l and the qu|两个 l，还有 qu
      articulate|a speaker able to explain any idea clearly in a few words|a calm student who won a debate with clear, well-chosen words|a six-year-old explaining exactly how he felt in clear sentences|articulate means clear and well expressed; verbose means wordy|articulate 是表达清楚；verbose 是啰嗦|verbose means using too many words, not explaining clearly in few, well-chosen ones|verbose 是用词太多，不是用少而精的词清楚表达|colloquial means casual and slangy, not clear and well-chosen words that win a debate|colloquial 是随意的口语，不是能赢得辩论的清晰精选的词|ar · tic · u · late|the -tic- in the middle and the -late ending|中间是 -tic-，结尾是 -late
      vernacular|the everyday speech of a village's farmers rather than Latin|the Italian ordinary people spoke, chosen over Latin|the everyday language sailors spoke among themselves at a dockyard|vernacular is the everyday language of a place; diction is one writer's word choice|vernacular 是一个地方的日常语言；diction 是某位作者的用词|diction is the words one writer chooses, not the language a whole village, people or dockyard speaks|diction 是某位作者选用的词，不是整个村庄、民族或码头的人说的语言|cliche is one worn-out phrase, not the everyday language of a whole place|cliche 是一句用滥的话，不是一个地方的日常语言|ver · nac · u · lar|the -nac- in the middle and the -ular ending|中间是 -nac-，结尾是 -ular
      connotation|a feeling of safety that "home" carries beyond its plain meaning|a suggestion of poor quality that "cheap" carries|the feelings words suggest, besides their dictionary meaning|connotation is the feeling a word carries; denotation is its literal meaning|connotation 是词的感情色彩；denotation 是字面意思|denotation is the plain dictionary meaning, the very thing the feeling goes beyond|denotation 是词典上的字面意思，正是感情色彩所超出的部分|cliche is a worn-out phrase, not a feeling one word suggests|cliche 是用滥的话，不是一个词带有的感情|con · no · ta · tion|double n after co-|co- 后面两个 n
      denotation|the plain meaning of "snake" without any feeling of danger|the exact, literal meaning a dictionary gives|the literal meaning "thin" and "skinny" share|denotation is the literal meaning; connotation is the feeling behind it|denotation 是字面意思；connotation 是背后的感情色彩|connotation is the feeling a word carries, not its exact, literal meaning|connotation 是词带有的感情，不是确切的字面意思|nuance is a slight shade of difference, not the plain meaning two words share|nuance 是细微差别，不是两个词共有的字面意思|de · no · ta · tion|one n after de-|de- 后只有一个 n
      nuance|a slight shift of feeling heard in a friend's tone of voice|a slight change of feeling an actor gave each line|a shade of color in the evening sky a painter tried to catch|nuance is a tiny shade of difference in anything; connotation belongs to a word|nuance 是任何事物中的细微差别；connotation 属于词语|connotation is the feeling a single word suggests, not a shift in a voice or a shade of color|connotation 是一个词带有的感情，不是语气的变化或颜色的深浅|cliche is a worn-out phrase, not a slight shift of feeling or color|cliche 是用滥的话，不是感情或颜色的细微变化|nu · ance|the u before -ance|-ance 前面是 u
      cliche|"as cold as ice," a phrase that no longer surprises anyone|tired phrases like "at the end of the day" in an essay|a worn-out phrase to replace with a fresh image of your own|cliche is a worn-out phrase; nuance is a fine shade of difference|cliche 是用滥的话；nuance 是细微差别|nuance is a fine shade of meaning, not a tired phrase used too often|nuance 是意思上的细微差别，不是用滥的老话|connotation is the feeling a word suggests, not a whole worn-out phrase like "as cold as ice"|connotation 是词带有的感情，不是像 "as cold as ice" 这样用滥的整句话|cli · che|the ch said /ʃ/ and the final e|ch 读 /ʃ/，结尾是 e
      verbose|a forty-page report when four pages would have done|an opening with long paragraphs that say nothing|a writer who never uses one word where ten will do|verbose uses too many words; succinct uses few|verbose 用词太多；succinct 用词简洁|succinct means short and to the point, the opposite of forty pages and long empty paragraphs|succinct 是简短切题，和四十页长报告、空洞的长段落正好相反|articulate means clear and well expressed, not stuffed with more words than needed|articulate 是表达清楚，不是堆砌多余的词|ver · bose|verb plus -ose|verb 加 -ose
      succinct|an answer of just five words that settled an argument|a chapter summary in no more than three sentences|slogans that are short, clear and easy to remember|succinct is short and clear; verbose is long and wordy|succinct 简短清楚；verbose 冗长啰嗦|verbose means using too many words, the opposite of five words or three sentences|verbose 是用词太多，和五个词或三句话正好相反|colloquial means casual and slangy, not short and clear|colloquial 是随意的口语，不是简短清楚|suc · cinct|double c, said /ks/, and the -inct ending|两个 c 读 /ks/，结尾是 -inct
      diction|a poet choosing short, everyday words|careful choices of words like "Your Honor" for a speech to the court|an author picking harsher words when the narrator is angry|diction is a writer's choice of words; vernacular is a place's everyday language|diction 是作者的用词选择；vernacular 是一个地方的日常语言|vernacular is the everyday language of a whole place, not the words one poet or author picks|vernacular 是一个地方的日常语言，不是某位诗人或作者挑选的词|connotation is the feeling one word carries, not a speaker's whole choice of words|connotation 是一个词带有的感情，不是说话者整体的用词选择|dic · tion|the -tion ending after dic-|dic- 后接 -tion
    `,
  },
);

/** batchesB are the batches of words of units 6 to 10 of grade 8. */
export const batchesB: readonly BatchSpec[] = [
  evolution,
  classifying,
  fossils,
  gloom,
  ghosts,
  madness,
  stage,
  courts,
  migration,
  newLives,
  diplomacy,
  rightWrong,
  character,
  politics,
  language,
];
