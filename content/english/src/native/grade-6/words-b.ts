// Grade 6: the batches of words of the last five units, from living cells and memories to food, sport and the
// histories of words.

import { t } from "@ga/content";
import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const cell = batch(
  "words-of-the-cell",
  ["Words of the Cell", "细胞的词"],
  ["the parts of a cell", "细胞的组成部分"],
  `
  cytoplasm|the jelly-like substance that fills a cell|细胞质|All the parts of the cell float in the jelly-like ___ that fills it.|Under the microscope, the clear ___ filled every gap between the cell's parts.|Many chemical reactions take place in the ___, the jelly that fills the space around the nucleus.|vacuole,organelle
  chloroplast|the green part of a plant cell where food is made from sunlight|叶绿体|Each ___ holds the green pigment that traps sunlight.|Animal cells have no ___, so animals cannot make food from light.|In a leaf cell, each green ___ uses sunlight to make sugar.|mitochondrion,vacuole|chloroplasts
  mitochondrion|the part of a cell that releases energy from food|线粒体|The ___ turns sugar into energy the cell can use.|A muscle cell works hard, so it needs plenty of energy released by each ___ inside it.|The ___ is often called the powerhouse of the cell.|chloroplast,vacuole|mitochondria
  vacuole|a space in a cell that stores water, food or waste|液泡|A plant cell has one large ___ full of stored water.|When the water-storing ___ shrinks, the plant wilts.|The ___ stores waste until the cell can get rid of it.|cytoplasm,chloroplast|vacuoles
  organelle|a tiny part inside a cell that does a special job|细胞器|Every kind of ___ inside a cell has a different job, just as each organ in the body has its own.|The nucleus is the largest ___ in most cells.|Scientists stained the cell so that every ___, from the nucleus to the smallest part, showed up clearly.|cytoplasm,mitochondrion|organelles
  unicellular|made of only one cell|单细胞的|Bacteria are ___ living things: each one is a single cell that must do every job by itself.|A ___ creature does everything inside its one single cell, with no other cells to help.|The amoeba is a ___ organism, a single cell that moves and feeds on its own.|multicellular,specialized
  multicellular|made of many cells|多细胞的|Plants and animals are ___ living things, built from millions of cells.|A ___ animal has billions of cells, and they share many different jobs.|Mushrooms are ___, but yeast is made of single cells.|unicellular,specialized
  structure|the way the parts of something are arranged; also a building|结构；建筑物|Staining shows the ___ of a cell: where each part sits and how the parts fit together.|A bridge is a ___ that must carry great weight.|Scientists studied the ___ of the leaf to learn how its layers of cells are arranged.|organelle,cytoplasm|structures
  cellular|having to do with cells|细胞的|Exercise causes ___ changes inside the cells of your muscles.|___ biology is the study of how cells work.|The doctor looked under the microscope for ___ damage inside the patient's cells.|unicellular,multicellular
  specialized|made for one particular job|专门的，特化的|Red blood cells are ___ to carry oxygen.|Nerve cells are ___ for sending signals.|The hospital has a ___ team that treats only burns.|multicellular,cellular
  `,
  "context-clues",
  {
    intro: t(
      "Inside a leaf cell, a green **chloroplast** makes sugar, a busy **mitochondrion** turns that sugar into energy, and a big **vacuole** holds water, all floating in the jelly of the **cytoplasm**. These ten words name the parts of a cell and say what each part does.",
      "在叶片细胞里，绿色的叶绿体（**chloroplast**）制造糖分，忙碌的线粒体（**mitochondrion**）把糖变成能量，大液泡（**vacuole**）储存水分，它们都漂浮在细胞质（**cytoplasm**）的胶状物里。这十个词说出细胞的各个部分和它们的工作。",
    ),
    watchOut: {
      meanings: t(
        "Tell **chloroplast** (the green part that *makes* sugar from sunlight, found only in plants) apart from **mitochondrion** (the part that *releases energy* from sugar, found in plant and animal cells alike).",
        "分清 **chloroplast**（只在植物细胞里、利用阳光制造糖分的绿色部分）和 **mitochondrion**（动植物细胞都有、从糖分中释放能量的部分）。",
      ),
      use: t(
        "Tell **unicellular** (one cell doing every job) apart from **multicellular** (many cells sharing the jobs) and **specialized** (one cell built for just one job, like a nerve cell).",
        "分清 **unicellular**（一个细胞包揽所有工作）、**multicellular**（许多细胞分担工作）和 **specialized**（细胞专门只做一件事，如神经细胞）。",
      ),
      spelling: t(
        "Watch **mitochondrion** (*ch* says /k/; the plural is *mitochondria*), **cytoplasm** (*y* says long *i*), and **vacuole** (*u* before *-ole*).",
        "注意 **mitochondrion** 中读 /k/ 的 **ch**（复数是 *mitochondria*）、**cytoplasm** 中读长 i 的 **y**，以及 **vacuole** 中 **-ole** 前的 **u**。",
      ),
    },
    notes: `
      cytoplasm|all the cell's parts floating in a jelly that fills it|clear jelly filling every gap between a cell's parts|chemical reactions in the jelly around the nucleus|cytoplasm is the jelly filling the whole cell; a vacuole is one storage space inside it|cytoplasm 是充满整个细胞的胶状物；vacuole 是其中一个储存空间|vacuole is a single space that stores water, food or waste, not the jelly that fills the whole cell around every part|vacuole 是储存水、养料或废物的一个空间，不是包围所有部分、充满整个细胞的胶状物|organelle is one tiny working part of a cell, not the jelly that all those parts float in|organelle 是细胞里的一个小部件，不是所有部件漂浮其中的胶状物|cy · to · plasm|y saying long i, and -plasm ending in m, not -plazem|y 读长 i，结尾 -plasm 以 m 收尾
      chloroplast|a part holding the green pigment that traps sunlight|a part animal cells lack, so animals cannot make food from light|a green part of a leaf cell using sunlight to make sugar|chloroplast makes sugar from sunlight; mitochondrion releases energy from sugar|chloroplast 用阳光制造糖分；mitochondrion 从糖分中释放能量|mitochondrion releases energy from food in plant and animal cells alike, not a green part that makes food from sunlight|mitochondrion 在动植物细胞里都有，负责从养料中释放能量，不是用阳光造养料的绿色部分|vacuole is a space that stores water, food or waste, not a green part that makes sugar|vacuole 是储存水、养料或废物的空间，不是制造糖分的绿色部分|chlo · ro · plast|chl- where ch says /k/, as in chlorine|开头 chl- 中的 ch 读 /k/，和 chlorine 一样
      mitochondrion|a part turning sugar into energy the cell can use|parts inside a hard-working muscle cell releasing plenty of energy|the part of a cell called its powerhouse|mitochondrion releases energy from food; chloroplast makes food from sunlight|mitochondrion 从养料中释放能量；chloroplast 用阳光制造养料|chloroplast is the green part of a plant cell that makes food from sunlight, not the part that releases energy from food|chloroplast 是植物细胞里用阳光制造养料的绿色部分，不是从养料中释放能量的部分|vacuole is a space that stores water, food or waste, not the part that turns food into energy|vacuole 是储存水、养料或废物的空间，不负责把养料变成能量|mi · to · chon · dri · on|ch saying /k/, and the plural changes -on to -a (mitochondria)|ch 读 /k/，复数把 -on 改成 -a（mitochondria）
      vacuole|one large space in a plant cell full of stored water|a water-storing space whose shrinking makes a plant wilt|a space storing waste until the cell gets rid of it|vacuole stores water, food or waste; cytoplasm is the jelly filling the cell|vacuole 储存水、养料或废物；cytoplasm 是充满细胞的胶状物|cytoplasm is the jelly that fills the whole cell, not one space set aside to store water or waste|cytoplasm 是充满整个细胞的胶状物，不是专门储存水或废物的一个空间|chloroplast is the green part that makes sugar from sunlight, not a space that stores water or waste|chloroplast 是用阳光制造糖分的绿色部分，不是储存水或废物的空间|vac · u · ole|vac + u + -ole, with a u many writers forget|vac 加 u 再加 -ole，中间的 u 容易漏写
      organelle|every kind of tiny cell part having its own job, like the organs of the body|the nucleus as the largest working part of a cell|every working part of a stained cell, from the nucleus to the smallest|organelle is any tiny working part of a cell; a mitochondrion is one kind of organelle|organelle 泛指细胞里的任何小部件；mitochondrion 只是其中一种|cytoplasm is the jelly that fills a cell, not one of the separate working parts that float in it|cytoplasm 是充满细胞的胶状物，不是漂浮其中的某个独立部件|mitochondrion is one particular part that releases energy, not the name for every kind of cell part, such as the nucleus|mitochondrion 只是释放能量的那一种部件，不能用来统称细胞核等各种部件|or · gan · elle|organ + -elle, with double l and a silent e|organ 加 -elle，双写 l 且词尾 e 不发音
      unicellular|bacteria that are each one cell doing every job alone|a creature doing everything inside its one single cell|an amoeba that is a single cell moving and feeding on its own|unicellular means made of one cell; multicellular means made of many cells|unicellular 指单细胞的；multicellular 指多细胞的|multicellular means made of many cells, the opposite of a living thing that is just one single cell|multicellular 指由许多细胞构成，和只有一个细胞正相反|specialized means built for one particular job, not a single cell that has to do every job by itself|specialized 指专门只做一件事，不是一个细胞独自包揽所有工作|u · ni · cel · lu · lar|uni- (one) + cell + -ular, with double l|uni-（一）加 cell 和 -ular，双写 l
      multicellular|plants and animals built from millions of cells|an animal whose billions of cells share many jobs|mushrooms made of many cells, unlike single-celled yeast|multicellular means made of many cells; unicellular means made of one cell|multicellular 指多细胞的；unicellular 指单细胞的|unicellular means made of only one cell, not of the millions or billions of cells a body is built from|unicellular 指只有一个细胞，不是由成百万上亿个细胞构成|specialized means made for one particular job, not made of many cells that share many jobs|specialized 指专做一件事，不是说由许多分担工作的细胞组成|mul · ti · cel · lu · lar|multi- (many) + cell + -ular, with double l|multi-（多）加 cell 和 -ular，双写 l
      structure|the arrangement of a stained cell's parts and how they fit together|a bridge built to carry great weight|how the layers of cells in a leaf are arranged|structure is how parts are arranged or a building; an organelle is one part of a cell|structure 指各部分的排列方式或建筑物；organelle 是细胞的一个部件|organelle is one tiny working part inside a cell, not the way all the parts are arranged, and never a building|organelle 是细胞里的一个小部件，不是各部分的排列方式，更不是建筑物|cytoplasm is the jelly that fills a cell, not the arrangement of parts or a building|cytoplasm 是充满细胞的胶状物，不是部件的排列方式，也不是建筑物|struc · ture|struc- + -ture, ending in -ture, not -cher|struc- 加 -ture，结尾是 -ture 不是 -cher
      cellular|changes inside the cells of exercised muscles|the study of how cells work|damage inside a patient's cells seen under a microscope|cellular means having to do with cells; unicellular means made of only one cell|cellular 指与细胞有关的；unicellular 指单细胞的|unicellular describes a living thing made of one cell, not changes, damage or a study that has to do with cells|unicellular 形容只有一个细胞的生物，不能形容与细胞有关的变化、损伤或学科|multicellular describes a living thing made of many cells, not something that simply has to do with cells|multicellular 形容多细胞生物，不能泛指与细胞有关的事物|cel · lu · lar|cell + -ular, keeping the double l|cell 加 -ular，保留双写 l
      specialized|red blood cells built only to carry oxygen|nerve cells built only for sending signals|a hospital team that treats only burns|specialized means made for one job; multicellular means made of many cells|specialized 指专做一件事的；multicellular 指多细胞的|multicellular means made of many cells, not made for one particular job such as carrying oxygen or treating burns|multicellular 指由许多细胞构成，不表示专门做运送氧气或治疗烧伤这一件事|cellular means having to do with cells in general, not made for one particular job|cellular 泛指与细胞有关，不表示专为某一件事而生|spe · cial · ized|special + -ized, where ci says /sh/|special 加 -ized，ci 读 /ʃ/
    `,
  },
);

const life = batch(
  "words-of-life-processes",
  ["Words of Life Processes", "生命活动的词"],
  ["how living things stay alive", "生物怎样维持生命"],
  `
  respiration|the process by which cells release energy from food, using oxygen|呼吸作用|___ in our cells uses oxygen to turn sugar into energy.|Plants carry out ___ at night too, even when there is no sunlight to make food.|Carbon dioxide is a waste product of ___.|photosynthesis,glucose
  photosynthesis|the way plants use sunlight to make food from water and air|光合作用|During ___, leaves take in carbon dioxide and give off oxygen.|Without sunlight, ___ stops.|The sugar made in ___ feeds the whole plant.|respiration,glucose
  circulate|to move around through a system and back again|循环，流通|The heart pumps to ___ blood through the body.|Fans help the air ___ in a hot room.|The rumor began to ___ around the school.|secrete,excrete|circulated,circulates,circulation
  metabolism|all the chemical processes that keep a body alive|新陈代谢|A hummingbird has such a fast ___ that it must eat every few minutes.|Your ___ slows down when you sleep.|Exercise can speed up your ___.|enzyme,hormone
  glucose|a simple sugar that cells use for energy|葡萄糖|Plants make ___ from sunlight, water and air.|The blood carries sweet ___ to every cell to be burned for energy.|Runners eat fruit to get quick ___.|hormone,enzyme
  excrete|to get rid of waste from the body|排泄|Kidneys ___ waste by sending it out of the body in urine.|Fish ___ waste through their gills.|Every living thing must ___ the waste it makes.|secrete,circulate|excreted,excretes
  secrete|to produce and release a liquid|分泌|Glands in the stomach ___ juices that break down food.|Some frogs ___ poison through their skin.|Trees ___ sap when their bark is cut.|excrete,circulate|secreted,secretes
  enzyme|a substance in living things that speeds up a chemical change|酶|One ___ in saliva starts to break down bread.|Each ___ works on only one kind of food.|The ___ in this washing powder breaks down food stains.|hormone,glucose|enzymes
  hormone|a chemical made in the body that tells organs what to do|激素|A growth ___ makes children grow taller.|When you are scared, a ___ makes your heart beat faster.|The ___ travels through the blood from a gland to tell the heart what to do.|enzyme,vessel|hormones
  vessel|a tube that carries blood or sap; also a ship|血管；船|A blood ___ carries blood to the brain.|The doctor checked the swollen ___ that carries blood through his leg.|A fishing ___ came into the harbor.|hormone,sewer|vessels
  `,
  "context-clues",
  {
    intro: t(
      "After lunch, your blood starts to **circulate** **glucose** to every cell, where **respiration** turns it into energy, while glands **secrete** juices to break down the rest. These ten words describe the busy chemistry that keeps a body alive.",
      "午饭后，血液开始把葡萄糖（**glucose**）循环（**circulate**）送到每个细胞，呼吸作用（**respiration**）把它变成能量，腺体同时分泌（**secrete**）消化液分解剩下的食物。这十个词描述维持生命的身体化学。",
    ),
    watchOut: {
      meanings: t(
        "Tell **respiration** (cells *using* sugar and oxygen to release energy, day and night) apart from **photosynthesis** (plants *making* sugar from sunlight, only while there is light).",
        "分清 **respiration**（细胞日夜都在用糖和氧气释放能量）和 **photosynthesis**（植物只在有光时用阳光制造糖分）。",
      ),
      use: t(
        "Tell **secrete** (produce and release a *useful* liquid, like stomach juice or sap) apart from **excrete** (get rid of *waste*, like urine) and **circulate** (move round and back again).",
        "分清 **secrete**（分泌胃液、树液等有用的液体）、**excrete**（排出尿液等废物）和 **circulate**（循环流动）。",
      ),
      spelling: t(
        "Watch **glucose** (*-ose*, the ending of sugar names), **enzyme** (*y* in the middle), and **photosynthesis** (*ph* for /f/ and *y* for short *i*).",
        "注意 **glucose** 结尾表示糖类的 **-ose**、**enzyme** 中间的 **y**，以及 **photosynthesis** 中读 /f/ 的 **ph** 和读短 i 的 **y**。",
      ),
    },
    notes: `
      respiration|cells using oxygen to turn sugar into energy|plants releasing energy at night with no sunlight for food|a process that gives off carbon dioxide as waste|respiration uses sugar and oxygen to release energy; photosynthesis makes sugar from sunlight|respiration 用糖和氧气释放能量；photosynthesis 用阳光制造糖分|photosynthesis makes food from sunlight and gives off oxygen, the reverse of using oxygen to release energy from food|photosynthesis 借阳光制造养料并放出氧气，和消耗氧气、从养料中释放能量正相反|glucose is the sugar itself, not the process that turns sugar into energy|glucose 是糖本身，不是把糖变成能量的过程|res · pi · ra · tion|re- + spir (breathe) + -ation|re- 加表示呼吸的 spir 和 -ation
      photosynthesis|leaves taking in carbon dioxide and giving off oxygen|a food-making process that stops without sunlight|the process making the sugar that feeds a whole plant|photosynthesis makes sugar from sunlight; respiration releases energy from sugar|photosynthesis 用阳光制造糖分；respiration 从糖分中释放能量|respiration uses up oxygen and sugar day and night, not a sunlight-powered process that makes sugar|respiration 日夜消耗氧气和糖分，不是靠阳光制造糖分的过程|glucose is the sugar a plant makes, not the process of making it|glucose 是植物造出的糖，不是造糖的过程|pho · to · syn · the · sis|ph for /f/, y for short i, and -thesis at the end|ph 读 /f/，y 读短 i，结尾 -thesis
      circulate|a heart pumping blood around the body|fans moving air around a hot room|a rumor passing around a school|circulate means move around and back again; secrete means release a liquid|circulate 指循环流动；secrete 指分泌液体|secrete means produce and release a liquid from a gland or skin, not move something round and back again|secrete 指从腺体或皮肤分泌液体，不是让东西来回循环流动|excrete means get rid of waste out of the body, not keep something moving around and back|excrete 指把废物排出体外，不是让东西不停循环|cir · cu · late|two c's: soft c in cir-, hard c in -cu-|两个 c：cir- 中读 /s/，-cu- 中读 /k/
      metabolism|a hummingbird's body processes so fast it must eat every few minutes|body processes slowing down during sleep|body processes sped up by exercise|metabolism is all the chemical processes of a body; an enzyme is one substance that speeds up a change|metabolism 是身体全部化学过程；enzyme 是加速某个变化的一种物质|enzyme is one substance that speeds up a single chemical change, not all the processes that keep a body alive|enzyme 是加快某一个化学变化的物质，不是维持生命的全部过程|hormone is one chemical messenger that tells organs what to do, not all the body's chemical processes together|hormone 是指挥器官的一种化学信使，不是全部化学过程的总和|me · tab · o · lism|me- + tab + -olism, with one t and one b|me- 加 tab 和 -olism，t 和 b 都只写一个
      glucose|the food plants make from sunlight, water and air|a sweet sugar carried by blood to be burned for energy|quick energy runners get from fruit|glucose is a sugar used for energy; a hormone is a chemical messenger|glucose 是供能的糖；hormone 是化学信使|hormone is a chemical messenger that tells organs what to do, not a sugar burned for energy|hormone 是指挥器官的化学信使，不是燃烧供能的糖|enzyme speeds up a chemical change but is not itself a sugar that gives energy|enzyme 加快化学变化，本身不是供能的糖|glu · cose|glu- + -ose, the ending of sugar names|glu- 加表示糖类的结尾 -ose
      excrete|kidneys sending waste out of the body in urine|fish getting rid of waste through their gills|every living thing getting rid of the waste it makes|excrete means get rid of waste; secrete means release a useful liquid|excrete 指排出废物；secrete 指分泌有用的液体|secrete means produce and release a useful liquid such as stomach juice or sap, not get rid of the body's waste|secrete 指分泌胃液、树液等有用的液体，不是排出身体废物|circulate means move round through a system and back again, not send waste out for good|circulate 指在系统中循环往复，不是把废物彻底排出|ex · crete|ex- (out) + -crete, ending in silent e|ex-（出）加 -crete，词尾 e 不发音
      secrete|stomach glands releasing juices that break down food|frogs releasing poison through their skin|trees releasing sap from cut bark|secrete means produce and release a useful liquid; excrete means get rid of waste|secrete 指分泌液体；excrete 指排出废物|excrete means get rid of waste the body does not need, not produce a juice, poison or sap that does a job|excrete 指排出身体不需要的废物，不是分泌有用途的汁液、毒液或树液|circulate means move round and back again, not produce a new liquid and release it|circulate 指循环流动，不是生成并释放新的液体|se · crete|se- + -crete, like excrete with se- in front|se- 加 -crete，和 excrete 只差开头
      enzyme|a substance in saliva starting to break down bread|a substance working on only one kind of food|a substance in washing powder breaking down food stains|enzyme speeds up a chemical change; a hormone carries a message to organs|enzyme 加快化学变化；hormone 向器官传递信息|hormone is a chemical messenger that tells organs what to do, not a substance that breaks food down|hormone 是指挥器官的化学信使，不负责分解食物|glucose is a sugar that gives energy, not a substance that breaks other foods down|glucose 是供能的糖，不会去分解别的食物|en · zyme|en- + -zyme, with y saying long i|en- 加 -zyme，y 读长 i
      hormone|a growth chemical making children grow taller|a chemical making a scared person's heart beat faster|a chemical sent through the blood from a gland to the heart|hormone tells organs what to do; an enzyme speeds up a chemical change|hormone 指挥器官工作；enzyme 加快化学变化|enzyme speeds up a chemical change such as breaking down food, not a messenger that tells organs to grow or work faster|enzyme 加快分解食物等化学变化，不是让器官生长或加速的信使|vessel is a tube that carries blood, not the chemical message carried inside it|vessel 是运送血液的管道，不是其中携带的化学信使|hor · mone|hor- + -mone, ending in silent e|hor- 加 -mone，词尾 e 不发音
      vessel|a tube carrying blood to the brain|a swollen tube carrying blood through a leg|a fishing boat coming into a harbor|vessel is a tube for blood or a ship; a hormone is a chemical carried in the blood|vessel 是血管或船；hormone 是血液中运送的化学物质|hormone is a chemical carried in the blood, not the tube or ship that carries things|hormone 是血液里运送的化学物质，不是运送东西的管道或船|sewer is an underground pipe for waste water, not a tube that carries blood and never a ship|sewer 是地下排污管，不是运送血液的管道，更不是船|ves · sel|double s in the middle, ending in -el|中间双写 s，结尾 -el
    `,
  },
);

const heredity = batch(
  "words-of-heredity",
  ["Words of Heredity", "遗传的词"],
  ["how traits pass from parents to offspring", "性状怎样从亲代传给后代"],
  `
  trait|a feature, such as eye color, that a living thing has|特征，性状|Curly hair is a ___ that her mother, her grandmother and she all share.|Kindness is his best ___.|Each ___ is controlled by one or more genes.|gene,mutation|traits
  inherit|to receive traits from your parents; also to receive money or things after someone dies|遗传；继承|Children ___ half their genes from each parent.|When her grandmother dies, she will ___ the old house, which the will leaves to her.|Did you ___ your father's red hair?|evolve,distribute|inherited,inherits
  gene|a part of a cell that passes on a trait from parent to child|基因|One ___ decides whether a pea plant is tall or short.|Scientists found the ___ that carries the instructions for the disease.|Every ___ is a tiny set of instructions stored inside a cell.|trait,heredity|genes
  offspring|the young of a person, animal or plant|后代|A mother cat may have four ___ in one litter.|Puppies are the ___ of their mother and father.|A plant's seeds grow into its ___, young plants that look like it.|sibling,species
  species|a group of living things of the same kind that can breed together|物种|The tiger is an endangered ___.|Scientists discover a new ___ of insect every day, a kind never named before.|Each ___ of bird builds its own kind of nest.|offspring,variation
  variation|a difference between things of the same kind|变异，差异|There is great ___ in the color of the shells: some are white and some are pink.|Some ___ in size among puppies of one litter is normal.|The ___ in temperature between day and night was greater in the desert.|mutation,characteristic|variations
  characteristic|a typical quality or feature|特征（的）|Long ears are a ___ of rabbits.|Wings are a ___ of birds.|It is ___ of her to help others.|gene,species|characteristics
  heredity|the passing of traits from parents to children|遗传|Your height depends partly on ___.|Gregor Mendel studied ___ by watching how pea plants passed traits to their young.|Eye color passes from parents to children through ___.|variation,mutation
  dominant|stronger, so that it shows up over another|显性的；占优势的|Brown eyes are ___ over blue eyes, so a child with one gene for each has brown eyes.|A ___ trait appears even if only one parent passes it on.|Because the gene for dark fur is ___, it hides the gene for light fur.|specialized,permanent
  mutation|a change in a gene|突变|A ___ changed one of the moth's genes, so it had darker wings than its parents.|Strong sunlight can cause a ___ in the genes of skin cells.|The white tiger's pale fur comes from a rare ___ that changed one of its genes.|gene,heredity|mutations
  `,
  "context-clues",
  {
    intro: t(
      "Two brown-eyed parents can still have a blue-eyed baby, because each child will **inherit** one **gene** for eye color from each parent, and brown is **dominant** over blue. These ten words explain how traits pass from parents to their young.",
      "两个棕色眼睛的父母仍可能生下蓝眼睛的宝宝，因为孩子从父母双方各遗传（**inherit**）一个决定眼色的基因（**gene**），而棕色相对蓝色是显性的（**dominant**）。这十个词解释性状怎样从亲代传给后代。",
    ),
    watchOut: {
      meanings: t(
        "Tell **trait** (the feature you can see, such as curly hair) apart from **gene** (the instructions inside a cell that pass the feature on) and **mutation** (a change in those instructions).",
        "分清 **trait**（看得见的特征，如卷发）、**gene**（细胞里把特征传下去的指令）和 **mutation**（这些指令发生的改变）。",
      ),
      use: t(
        "Tell **offspring** (the young of a parent) apart from **species** (a whole group of the same kind) and **sibling** (a brother or sister): puppies are their mother's offspring and one another's siblings.",
        "分清 **offspring**（亲代生下的后代）、**species**（同一种类的整个群体）和 **sibling**（兄弟姐妹）：小狗是母狗的后代，彼此是兄弟姐妹。",
      ),
      spelling: t(
        "Watch **heredity** (*here-* + *-dity*, with an *e* after the *r*), **species** (the same spelling for one and for many), and **characteristic** (*ch* says /k/).",
        "注意 **heredity** 中 r 后面的 **e**、**species** 单复数同形，以及 **characteristic** 中读 /k/ 的 **ch**。",
      ),
    },
    notes: `
      trait|curly hair shared by a girl, her mother and her grandmother|kindness as the best feature of a person|a feature controlled by one or more genes|trait is a feature you can see or notice; a gene is the instruction that passes it on|trait 是看得出的特征；gene 是把特征传下去的指令|gene is the instruction inside a cell that passes a feature on, not the feature itself such as curly hair or kindness|gene 是细胞里传递特征的指令，不是卷发、善良这类特征本身|mutation is a change in a gene, not a feature that a family shares or a person shows|mutation 是基因发生的改变，不是一家人共有或一个人表现出的特征|trait|tr blend + ai saying long a, ending in t|tr 连缀加读长 a 的 ai，以 t 结尾
      inherit|children receiving half their genes from each parent|receiving a grandmother's house left by her will|receiving a father's red hair|inherit means receive from a parent or someone who has died; distribute means give out to many|inherit 指从父母或逝者那里得到；distribute 指分发给许多人|evolve means change slowly over a long time, not receive something from a parent or from a will|evolve 指长期慢慢演变，不是从父母或遗嘱那里得到东西|distribute means give things out to many people, the opposite of receiving something passed down to you|distribute 指把东西分发给许多人，和接受传给自己的东西正相反|in · her · it|in + her + it, three small words in a row|in、her、it 三个小词连写
      gene|an instruction deciding whether a pea plant is tall or short|cell instructions behind a disease|a tiny set of instructions stored inside a cell|gene is the cell's instruction for a feature; a trait is the feature itself|gene 是细胞里决定特征的指令；trait 是特征本身|trait is the feature you can see, such as tallness, not the instruction inside a cell that decides it|trait 是看得出的特征（如高矮），不是细胞里决定它的指令|heredity is the whole passing of traits from parents to children, not one countable set of instructions in a cell|heredity 是性状从父母传给子女的整个过程，不是细胞里一份可数的指令|gene|g saying /j/ + long e + silent final e|g 读 /dʒ/，e 读长音，词尾 e 不发音
      offspring|four kittens born to a mother cat in one litter|puppies as the young of their parents|young plants grown from a plant's seeds|offspring are the young of a parent; siblings are brothers and sisters of one another|offspring 是亲代生下的后代；sibling 是彼此之间的兄弟姐妹|sibling is a brother or sister of someone, not the young that a mother or a plant produces|sibling 指某人的兄弟姐妹，不是母亲或植物生出的后代|species is a whole group of living things of one kind, not the young of particular parents|species 是同一种类的整个生物群体，不是某对父母的后代|off · spring|off + spring, the same for one and for many|off 加 spring，单复数同形
      species|tigers as an endangered kind of animal|a new kind of insect never named before|each kind of bird with its own kind of nest|species is a group of the same kind; offspring are the young of parents|species 是同种生物群体；offspring 是父母的后代|offspring are the young of particular parents, not a whole kind of animal that can breed together|offspring 是某对父母的后代，不是能互相繁殖的一整类动物|variation is a difference between things of the same kind, not a kind of living thing itself|variation 是同类事物之间的差异，不是一类生物本身|spe · cies|spe- + -cies, with ci saying /sh/ and no change for the plural|spe- 加 -cies，ci 读 /ʃ/，单复数同形
      variation|white and pink shells differing in color|puppies of one litter differing a little in size|day and night temperatures differing in a desert|variation is a difference among things of one kind; a mutation is a change in a gene|variation 是同类之间的差异；mutation 是基因的改变|mutation is a change inside a gene, not an ordinary difference in color, size or temperature|mutation 是基因内部的改变，不是颜色、大小或温度上的一般差异|characteristic is a typical feature that things share, not a difference between them|characteristic 是事物共有的典型特征，不是它们之间的差异|var · i · a · tion|vary with y changed to i + -ation|vary 把 y 改成 i 再加 -ation
      characteristic|long ears as a typical feature of rabbits|wings as a typical feature of birds|helping others as typical of a person|characteristic is a typical feature of a whole kind; a gene is a cell's instruction|characteristic 是某一类事物的典型特征；gene 是细胞里的指令|gene is an instruction inside a cell, not a typical feature such as long ears, wings or helpfulness|gene 是细胞里的指令，不是长耳朵、翅膀或乐于助人这样的典型特征|species is a whole group of living things, not a feature that the group has|species 是一整类生物，不是这类生物具有的特征|char · ac · ter · is · tic|character + -istic, with ch saying /k/|character 加 -istic，ch 读 /k/
      heredity|height that partly depends on what passes from parents|Mendel watching pea plants pass traits to their young|eye color passing from parents to children|heredity is the passing of traits to children; variation is the difference between them|heredity 是性状传给子女；variation 是彼此之间的差异|variation is a difference between living things of one kind, not the passing of traits from parents to children|variation 指同类生物之间的差异，不是性状从父母传给子女|mutation is a sudden change in one gene, not the regular passing of traits down a family|mutation 是某个基因的突然改变，不是性状在家族中的正常传递|her · ed · i · ty|here + -dity, keeping the e after r|here 加 -dity，r 后面的 e 要保留
      dominant|brown eyes showing up over blue eyes in a child|a trait appearing when only one parent passes it on|a dark-fur gene hiding a light-fur gene|dominant means it shows up over another; specialized means made for one job|dominant 指压过另一个而显现；specialized 指专做一件事|specialized means made for one particular job, not stronger so that it shows up over another gene|specialized 指专为一件事而生，不是更强而能压过另一个基因|permanent means lasting forever, which says nothing about one gene showing up over another|permanent 指永久的，和一个基因压过另一个毫无关系|dom · i · nant|dom + i + -nant, ending -ant, not -ent|dom 加 i 和 -nant，结尾是 -ant 不是 -ent
      mutation|a changed gene giving a moth darker wings than its parents|strong sunlight causing a change in skin-cell genes|a rare gene change behind a white tiger's pale fur|mutation is a change in a gene; a gene is the instruction itself|mutation 是基因的改变；gene 是指令本身|gene is the instruction itself, not a change that happens to it|gene 是指令本身，不是指令发生的改变|heredity is the regular passing of traits from parents, not a sudden change inside one gene|heredity 是性状从父母的正常传递，不是某个基因的突然改变|mu · ta · tion|mute with e dropped + -ation|mute 去掉 e 再加 -ation
    `,
  },
);

const memory = batch(
  "words-of-memory",
  ["Words of Memory", "记忆的词"],
  ["memory and growing up", "记忆与成长"],
  `
  nostalgia|a sad but pleasant longing for the past|怀旧|Looking at old photos filled her with ___ for the summers of her childhood.|The song gave him a feeling of ___ for his school days.|Homesick and full of ___, he longed to go back to the days when he was small.|recollection,souvenir
  adolescent|a young person between a child and an adult|青少年（的）|Every growing ___ needs plenty of sleep during the teenage years.|During his ___ years, between childhood and adulthood, he grew twenty centimeters.|The book is written for a young ___ of thirteen or fourteen.|upbringing,hometown|adolescents,adolescence
  reminisce|to talk or think about happy times in the past|追忆，缅怀|My grandparents love to ___ about their first house.|At the reunion, old friends sat down to ___ about the years they spent at school together.|We stayed up late to ___ about summer camp last year.|confide,foretell|reminisced
  memento|an object you keep to remember a person or event|纪念品|She kept the ticket as a ___ of the concert.|The shell on my desk is a ___ of our day at the beach.|The coach gave each player a small silver ___ of the season.|recollection,upbringing|mementos
  recollection|a memory of something|回忆，记忆|I have a clear ___ of my first day at school.|His ___ of the accident was hazy.|To the best of my ___, the door was locked.|nostalgia,memento|recollections
  upbringing|the way a child is raised and cared for|教养，养育|Her strict ___ taught her to be on time.|He had a happy ___ on a farm, where his parents raised him with care.|Parents who raise children with care and patience give them a good ___.|adolescent,hometown
  keepsake|a small object kept because it reminds you of someone|纪念物|Grandma's ring is a ___ I will never sell.|She gave me a lock of her hair to keep as a ___.|I keep her old letter in a box as a precious ___ of my grandmother.|recollection,nostalgia|keepsakes
  souvenir|something you buy or keep to remember a place you visited|（旅游）纪念品|We bought a little model of the Eiffel Tower in Paris as a ___.|The ___ shop at the museum sold mugs and postcards.|He brought back a rock from the canyon as a ___.|recollection,hometown|souvenirs
  bittersweet|both happy and sad at the same time|苦乐参半的|Graduation was a ___ day: we were proud to finish but sad to say goodbye.|The movie had a ___ ending, in which the hero won but lost her best friend.|Leaving the old house was ___: we were excited about the new one but sad to go.|apprehensive,reluctant
  hometown|the town where someone was born or grew up|家乡|She returned to her ___ after twenty years.|The singer gave a concert in his ___, where he was born.|Our ___ is a small, friendly town by the river.|upbringing,souvenir|hometowns
  `,
  "context-clues",
  {
    intro: t(
      "Every summer, Grandpa visits his **hometown**, opens a box of old letters, and sits on the porch to **reminisce** with a sigh of **nostalgia**, turning each **keepsake** over in his hands. These ten words help you talk about memories and about growing up.",
      "每年夏天，爷爷都会回到家乡（**hometown**），打开一盒旧信件，坐在门廊上追忆（**reminisce**）往事，怀旧之情（**nostalgia**）涌上心头，把每件纪念物（**keepsake**）拿在手里细看。这十个词帮你谈论记忆和成长。",
    ),
    watchOut: {
      meanings: t(
        "Tell **recollection** (a memory *in your mind*) apart from **memento** (an *object* you keep to remember an event) and **nostalgia** (the sad, sweet *feeling* of longing for the past).",
        "分清 **recollection**（脑海中的回忆）、**memento**（用来纪念某件事的物品）和 **nostalgia**（怀念过去时那种又甜又伤感的情绪）。",
      ),
      use: t(
        "Tell **souvenir** (bought or kept to remember a *place* you visited) apart from **keepsake** (kept to remember a *person*) and **memento** (kept to remember a person or an *event*).",
        "分清 **souvenir**（为纪念去过的地方而买或保留的）、**keepsake**（为怀念某个人而保存的）和 **memento**（为纪念某人或某件事而保存的）。",
      ),
      spelling: t(
        "Watch **reminisce** (*-isce* with a silent *c*), **souvenir** (*sou-* with *ou* and the ending *-nir*), and **memento** (*me-*, not *mo-*, from *memory*).",
        "注意 **reminisce** 结尾 **-isce** 中不发音的 **c**、**souvenir** 中的 **ou** 和结尾 **-nir**，以及 **memento** 以 **me-** 开头（不是 *mo-*，和 memory 同源）。",
      ),
    },
    notes: `
      nostalgia|old photos stirring a longing for childhood summers|a song stirring a longing for school days|a homesick longing to go back to childhood|nostalgia is a feeling of longing for the past; a recollection is one memory|nostalgia 是怀念过去的情绪；recollection 是一段回忆|recollection is a single memory of something, not the sad, sweet feeling of longing that fills a person|recollection 是对某事的一段记忆，不是充满心头的那种又甜又伤感的怀念之情|souvenir is an object bought to remember a place, not a feeling of longing for the past|souvenir 是纪念某地的物品，不是对过去的怀念之情|nos · tal · gi · a|nost- + -algia, with g saying /j/|nost- 加 -algia，g 读 /dʒ/
      adolescent|a growing teenager who needs plenty of sleep|the teenage years between childhood and adulthood|a young reader of thirteen or fourteen|adolescent is a young person between child and adult; upbringing is how a child is raised|adolescent 指青少年；upbringing 指孩子受到的养育|upbringing is the way a child is raised, not the young person who is growing up|upbringing 是孩子被抚养的方式，不是正在长大的那个人|hometown is the town where someone grew up, not a young person between a child and an adult|hometown 是某人长大的城镇，不是介于孩子和成人之间的年轻人|ad · o · les · cent|-escent with sc saying /s/|-escent 中的 sc 读 /s/
      reminisce|grandparents talking happily about their first house|old friends at a reunion talking about their school years|staying up late to talk about last year's summer camp|reminisce means talk about happy times in the past; confide means tell a secret to someone you trust|reminisce 指追忆往日的美好时光；confide 指向信任的人吐露秘密|confide means tell a secret to someone you trust, not talk together about happy times long ago|confide 指向信任的人吐露秘密，不是一起追忆往日的美好时光|foretell means say what will happen in the future, the opposite of looking back at the past|foretell 指预言将来会发生的事，和回顾过去正相反|rem · i · nisce|-isce at the end, with sc saying /s/|结尾 -isce，sc 读 /s/
      memento|a concert ticket kept to remember the night|a shell on a desk kept from a day at the beach|a small silver object given to remember a season|memento is an object kept to remember; a recollection is a memory in the mind|memento 是保存下来作纪念的物品；recollection 是脑海里的回忆|recollection is a memory in the mind, not an object such as a ticket or shell that you can keep|recollection 是脑海里的记忆，不是可以保存的票根、贝壳之类的物品|upbringing is the way a child is raised, not an object kept to remember an event|upbringing 是孩子受到的养育，不是纪念某件事的物品|me · men · to|me- (as in memory), not mo-|以 me- 开头（和 memory 一样），不是 mo-
      recollection|a clear memory of a first day at school|a hazy memory of an accident|what a person remembers about a locked door|recollection is a memory in the mind; a memento is an object kept to remember|recollection 是脑海里的回忆；memento 是用来纪念的物品|nostalgia is a feeling of longing for the past, not a memory of one particular moment that can be clear or hazy|nostalgia 是怀念过去的情绪，不是对某一刻清晰或模糊的记忆|memento is an object you can hold, not a memory inside your mind|memento 是能拿在手里的物品，不是脑海中的记忆|rec · ol · lec · tion|re- + collect + -ion, with double l|re- 加 collect 和 -ion，双写 l
      upbringing|a strict raising that taught punctuality|a happy childhood raised with care on a farm|children raised with care and patience|upbringing is the way a child is raised; an adolescent is a young person|upbringing 是孩子受到的养育；adolescent 是青少年|adolescent is a young person between a child and an adult, not the way parents raise a child|adolescent 是青少年，不是父母抚养孩子的方式|hometown is the place where someone grew up, not the way that person was raised|hometown 是某人长大的地方，不是他受到的养育方式|up · bring · ing|up + bring + -ing, a compound word|up 加 bring 和 -ing 组成的合成词
      keepsake|a grandmother's ring never to be sold|a lock of hair given to keep|an old letter kept in a box to remember a grandmother|keepsake is an object kept to remember a person; a recollection is a memory in the mind|keepsake 是怀念某人的物品；recollection 是脑海里的记忆|recollection is a memory in the mind, not a ring, lock of hair or letter you can keep in a box|recollection 是脑海里的记忆，不是能放进盒子里的戒指、头发或信件|nostalgia is a feeling of longing for the past, not a small object you can hold or sell|nostalgia 是怀旧之情，不是能拿在手里或卖掉的小物件|keep · sake|keep + sake, a compound word ending in silent e|keep 加 sake 组成合成词，词尾 e 不发音
      souvenir|a model of the Eiffel Tower bought in Paris|mugs and postcards sold at a museum shop|a rock brought back from a canyon trip|souvenir is something kept to remember a place you visited; a hometown is where you grew up|souvenir 是纪念去过的地方的物品；hometown 是长大的地方|recollection is a memory in the mind, not an object bought or brought back from a trip|recollection 是脑海里的记忆，不是旅行中买回或带回的物品|hometown is the town where someone grew up, not an object brought back from a place visited|hometown 是某人长大的城镇，不是从游览地带回的物品|sou · ve · nir|ou saying /oo/ and the French ending -nir|ou 读 /uː/，结尾是法语式的 -nir
      bittersweet|a graduation that was proud and sad at once|a movie ending where the hero won but lost a friend|leaving an old house with both excitement and sadness|bittersweet means happy and sad at once; apprehensive means worried about what may happen|bittersweet 指悲喜交加；apprehensive 指担心会出事|apprehensive means worried that something bad may happen, not happy and sad at the same moment|apprehensive 指担心坏事发生，不是同时又高兴又难过|reluctant means not wanting to do something, not feeling joy and sadness together|reluctant 指不情愿做某事，不是悲喜交加|bit · ter · sweet|bitter + sweet, with double t|bitter 加 sweet，双写 t
      hometown|a town returned to after twenty years|the town where a singer was born|a small, friendly town by a river|hometown is the town where you grew up; upbringing is how you were raised there|hometown 是长大的城镇；upbringing 是在那里受到的养育|upbringing is the way a child is raised, not a town you can return to or live in|upbringing 是孩子受到的养育，不是可以回去或居住的城镇|souvenir is an object you keep from a place, not the town itself|souvenir 是从某地带回的物品，不是那座城镇本身|home · town|home + town, a compound word|home 加 town 组成的合成词
    `,
  },
);

const friends = batch(
  "words-for-friends-and-family",
  ["Words for Friends and Family", "朋友与家人的词"],
  ["friends and family", "朋友与家人"],
  `
  sibling|a brother or sister|兄弟姐妹|Do you have a ___, or are you an only child?|Mom says my younger ___ and I must share a bedroom because we are family.|My parents give every ___ in our family, my two brothers and me, a chore.|companion,acquaintance|siblings
  companion|a person or animal you spend time with|同伴|The dog was his faithful ___ for fifteen years.|She was a cheerful ___ who stayed by my side for the whole long trip.|The old woman hired a ___ to keep her company.|sibling,acquaintance|companions
  rivalry|a long competition between people or groups|竞争，较劲|There is a friendly ___ between the two schools.|The sisters' ___ to get the best grades ended when they grew up.|Their ___ made both players better.|feud,quarrel|rivalries
  confide|to tell someone a secret because you trust them|吐露，倾诉|She decided to ___ in her aunt about her worries.|You can ___ in me; I will not tell anyone.|He was too shy to ___ in his parents about his fears.|reconcile,betray|confided,confides
  reconcile|to become friends again after an argument|和解|The brothers finally agreed to ___ after years of silence.|Their mother helped them ___ and become friends again after the fight.|It is never too late to ___ with an old friend and end an argument.|confide,betray|reconciled
  betray|to be disloyal to someone who trusts you|背叛，出卖|A true friend would never ___ you by telling your secret to the whole class.|He felt that his teammates chose to ___ him when they took the rival's side.|The spy would not ___ her country, even for a fortune.|confide,reconcile|betrayed,betrays
  grudge|a feeling of anger at someone that lasts a long time|怨恨|He held a ___ against her for years after the argument.|Do not keep a ___ against him; forgive him and talk.|She bears no ___ toward the boy who broke her bike.|feud,rivalry|grudges
  acquaintance|a person you know a little but who is not a close friend|熟人|Tom is just a school ___, not a close friend.|I barely know Mr. Lee; he is a passing ___ from the market.|A neighbor I have met only twice is just a casual ___.|companion,sibling|acquaintances
  quarrel|an angry argument|争吵|The friends had a ___ about who would go first.|After their short, loud ___ at lunch, they did not speak for the rest of the day.|The children had a noisy ___ over the toy, shouting until Mom came.|grudge,feud|quarrels,quarreled
  feud|a long, bitter fight between two families or groups|世仇，长期不和|The ___ between the two families lasted a hundred years, with fights in every generation.|The old ___ between the two clans began so long ago that nobody remembered how it had started.|The families' long ___ ended at last when a son of one married a daughter of the other.|quarrel,grudge|feuds
  `,
  "context-clues",
  {
    intro: t(
      "After a silly **quarrel**, my **sibling** and I stopped talking, but I would not **betray** her trust, and by dinner we were ready to **reconcile**. These ten words help you talk about the people close to you and how you get along.",
      "一次无聊的争吵（**quarrel**）之后，我和我的姐妹（**sibling**）不说话了，但我不愿背叛（**betray**）她的信任，到晚饭时我们就准备和好（**reconcile**）了。这十个词帮你谈论身边的人以及怎样相处。",
    ),
    watchOut: {
      meanings: t(
        "Tell **quarrel** (one short, angry argument) apart from **feud** (a bitter fight between families that lasts for years) and **grudge** (anger one person keeps inside for a long time).",
        "分清 **quarrel**（一次短暂的争吵）、**feud**（家族之间持续多年的仇怨）和 **grudge**（一个人长期憋在心里的怨恨）。",
      ),
      use: t(
        "Tell **companion** (someone who spends time by your side) apart from **acquaintance** (someone you know only a little) and **sibling** (your brother or sister).",
        "分清 **companion**（常陪在身边的同伴）、**acquaintance**（只是略有认识的人）和 **sibling**（兄弟姐妹）。",
      ),
      spelling: t(
        "Watch **acquaintance** (*acq-* with a silent *c*, and *-ance*), **quarrel** (double *r*), and **feud** (*eu* says /yoo/).",
        "注意 **acquaintance** 中不发音的 **c** 和结尾 **-ance**、**quarrel** 的双写 **r**，以及 **feud** 中读 /juː/ 的 **eu**。",
      ),
    },
    notes: `
      sibling|a brother or sister rather than being an only child|a younger brother or sister sharing a bedroom as family|each brother or sister in a family getting a chore|sibling is a brother or sister; a companion is anyone you spend time with|sibling 是兄弟姐妹；companion 是陪伴你的人|companion is anyone who spends time with you, not someone born into your family as a brother or sister|companion 是陪你作伴的任何人，不一定是家里的兄弟姐妹|acquaintance is someone you know only a little, not a brother or sister you live with|acquaintance 是只略有认识的人，不是一起生活的兄弟姐妹|sib · ling|sib + -ling, with one b|sib 加 -ling，只有一个 b
      companion|a faithful dog by its owner for fifteen years|a cheerful person staying by someone's side on a long trip|a person hired to keep an old woman company|companion is someone who spends time with you; an acquaintance is someone you barely know|companion 是陪伴你的人；acquaintance 是只略有认识的人|sibling is a brother or sister in your family, not a pet or a person hired or chosen to keep you company|sibling 是家里的兄弟姐妹，不是宠物或请来作伴的人|acquaintance is someone you know only a little, not someone who stays by your side for years or a whole trip|acquaintance 是略有认识的人，不是多年或整趟旅程都陪在身边的人|com · pan · ion|com- + pan + -ion, with i saying /y/|com- 加 pan 和 -ion，i 读 /j/
      rivalry|a friendly contest between two schools|sisters competing for the best grades|a contest that made two players better|rivalry is a long competition; a feud is a long, bitter fight|rivalry 是长期的竞争；feud 是长期的仇怨|feud is a bitter fight between families, not a contest to win that can be friendly or make both sides better|feud 是家族间的仇怨，不是可以友好、还能让双方进步的竞争|quarrel is one angry argument, not a long contest to win that can make both sides better|quarrel 是一次争吵，不是让双方都进步的长期较量|ri · val · ry|rival + -ry, with one v and one l|rival 加 -ry，v 和 l 都只写一个
      confide|telling an aunt about secret worries|telling a trusted friend something that will not be repeated|a shy boy telling his parents about his fears|confide means tell a secret to someone you trust; betray means let down someone who trusts you|confide 指向信任的人吐露秘密；betray 指辜负信任你的人|reconcile means become friends again after an argument, not tell someone your private worries|reconcile 指吵架后重归于好，不是向人倾诉心事|betray means be disloyal to someone who trusts you, the opposite of trusting someone with a secret|betray 指背叛信任你的人，和把秘密托付给人正相反|con · fide|con- + fide, ending in silent e|con- 加 fide，词尾 e 不发音
      reconcile|brothers making up after years of silence|a mother helping her sons become friends again|making up with an old friend to end an argument|reconcile means become friends again; confide means tell someone a secret|reconcile 指重归于好；confide 指吐露秘密|confide means tell a secret to someone you trust, not end an argument and become friends again|confide 指吐露秘密，不是结束争吵、重新做朋友|betray means be disloyal to someone who trusts you, the opposite of making peace with them|betray 指背叛信任你的人，和与对方和好正相反|rec · on · cile|re- + con + -cile, with c saying /s/|re- 加 con 和 -cile，c 读 /s/
      betray|telling a friend's secret to the whole class|teammates taking a rival's side against a friend|a spy refusing to sell out her country|betray means be disloyal to someone who trusts you; confide means tell a secret to someone you trust|betray 指背叛信任你的人；confide 指向信任的人吐露秘密|confide means trust someone with your own secret, not be disloyal to someone who trusts you|confide 指把自己的秘密托付给别人，不是背叛信任你的人|reconcile means become friends again after a fight, the opposite of being disloyal to a friend|reconcile 指吵架后和好，和背叛朋友正相反|be · tray|be- + tray, with ay saying long a|be- 加 tray，ay 读长 a
      grudge|anger held against someone for years after an argument|anger kept against someone instead of forgiving|no anger toward a boy who broke a bike|grudge is anger one person keeps for a long time; a feud is a long fight between groups|grudge 是一个人长期怀有的怨恨；feud 是群体间的长期争斗|feud is a long fight between two families or groups, not the anger one person keeps inside|feud 是两个家族或群体之间的长期争斗，不是一个人心里的怨恨|rivalry is a contest to win, not anger one person holds against another|rivalry 是一场争胜的较量，不是一个人对另一个人的怨恨|grudge|-dge at the end, with a silent d|结尾 -dge，d 不发音
      acquaintance|a school friend who is not a close friend|a passing person from the market barely known|a neighbor met only twice|acquaintance is someone you know a little; a companion spends time by your side|acquaintance 是略有认识的人；companion 是常陪在身边的人|companion is someone who spends a lot of time with you, not someone you have met only a few times|companion 是常陪着你的人，不是只见过几面的人|sibling is your brother or sister, not someone you barely know|sibling 是你的兄弟姐妹，不是你几乎不认识的人|ac · quain · tance|acq- with a silent c, ai, and the -ance ending|acq- 中的 c 不发音，中间 ai，结尾 -ance
      quarrel|friends arguing about who goes first|a short, loud argument at lunch|children shouting over a toy|quarrel is one angry argument; a grudge is anger kept for a long time|quarrel 是一次争吵；grudge 是长期怀有的怨恨|grudge is anger someone keeps quietly for a long time, not an argument that people have out loud|grudge 是长期默默怀着的怨恨，不是当面吵出来的争执|feud is a bitter fight that lasts for years between families, not one short argument|feud 是家族间持续多年的仇怨，不是一次短暂的争吵|quar · rel|qu + ar + double r + -el|qu 加 ar，双写 r，结尾 -el
      feud|a hundred-year fight between two families|a fight between clans so old nobody remembers its start|a long family fight ended by a marriage|feud is a long, bitter fight between families; a quarrel is one argument|feud 是家族间长期的仇怨；quarrel 是一次争吵|quarrel is one short angry argument, not a fight that lasts for generations|quarrel 是一次短暂的争吵，不是延续好几代的争斗|grudge is the anger one person holds inside, not open fighting between two whole families|grudge 是一个人心里的怨恨，不是两个家族之间公开的争斗|feud|eu saying /yoo/, ending in d|eu 读 /juː/，以 d 结尾
    `,
  },
);

const fear = batch(
  "words-for-fear-and-courage",
  ["Words for Fear and Courage", "恐惧与勇气的词"],
  ["fear and courage", "恐惧与勇气"],
  `
  daunting|making you feel worried that you cannot do something|令人畏惧的|Climbing the steep mountain was a ___ task.|The huge pile of homework looked ___ to the tired students.|The long list of chores looked so ___ that he did not know where to start.|apprehensive,wary
  reluctant|not wanting to do something|不情愿的|He was ___ to jump into the icy water and kept finding reasons to stay on the dock.|The lazy puppy was ___ to leave its warm basket, so it stayed curled up.|She was ___ to lend her new bike, because she wanted to keep it for herself.|courageous,wary
  apprehensive|worried that something bad may happen|忧虑的|She felt ___ before her first piano recital, afraid she would forget the notes.|The ___ traveler kept checking the map, worried she would get lost.|We were ___ about the coming storm and feared it would flood the house.|daunting,courageous
  falter|to lose strength or courage; to stop moving steadily|动摇；蹒跚|His voice began to ___ and shake as he spoke to the huge crowd.|Her courage started to ___ when she looked down from the high diving board.|Tired after twenty kilometers, the old horse began to ___ and stumble.|flinch,surrender|faltered,falters
  hesitant|slow to act because you are unsure|犹豫的|The ___ swimmer stood at the edge for a long time, unsure whether to jump.|She gave a slow, ___ answer, stopping to think after every word.|He was ___ to raise his hand because he was not sure of the answer.|courageous,daunting
  flinch|to make a quick, small movement away from pain or fear|畏缩，退缩|She did not ___ when the nurse pushed the needle into her arm.|He tried not to ___ as the ball flew at his face.|The loud bang made us all ___ and jump back.|stagger,surrender|flinched,flinches
  bravado|a show of courage that is not real|虚张声势|His boasting ___ vanished the moment the big dog barked, and he ran.|She spoke with ___, but her hands shook.|The boy's ___ did not fool anyone.|valor,qualm
  qualm|a feeling of doubt about whether something is right|疑虑，不安|She had no ___ about telling the truth.|He felt a small ___, unsure if it was right to take the last cookie.|If you have any ___ about whether the plan is fair, tell us now.|bravado,grudge|qualms
  wary|careful because you think something might be dangerous|谨慎的，警惕的|The deer was ___ of the hunters.|Be ___ of strangers who ask for money.|The cat was ___ of the new dog.|hesitant,daunting
  courageous|very brave|勇敢的|The ___ firefighter ran into the burning house.|It took a ___ girl to stand up to the bully in front of the whole class.|The ___ boy climbed down the steep cliff to save the kitten.|reluctant,apprehensive
  `,
  "context-clues",
  {
    intro: t(
      "On the high diving board, Mia felt **apprehensive**; the drop looked **daunting**, and her legs began to **falter**, but she took a breath and made a **courageous** leap. These ten words help you describe fear and the courage to face it.",
      "站在高高的跳台上，米娅很忧虑（**apprehensive**）；下面的高度令人畏惧（**daunting**），她的双腿开始发软（**falter**），但她深吸一口气，勇敢地（**courageous**）跳了下去。这十个词帮你描写恐惧和面对恐惧的勇气。",
    ),
    watchOut: {
      meanings: t(
        "Tell **daunting** (describes a *task* that makes you worry you cannot do it) apart from **apprehensive** (describes a *person* who is worried something bad will happen).",
        "分清 **daunting**（形容让人担心做不到的任务）和 **apprehensive**（形容担心坏事发生的人）。",
      ),
      use: t(
        "Tell **reluctant** (you do not *want* to do it) apart from **hesitant** (you are *unsure*, so you are slow to act) and **wary** (you are careful because of *danger*).",
        "分清 **reluctant**（不想做）、**hesitant**（拿不准，所以迟迟不动）和 **wary**（因为有危险而小心）。",
      ),
      spelling: t(
        "Watch **qualm** (silent *l*, like *calm*), **courageous** (keep the *e* of *courage* before *-ous*), and **daunting** (*au* in *daunt*).",
        "注意 **qualm** 中不发音的 **l**（和 calm 一样）、**courageous** 在 **-ous** 前保留 courage 的 **e**，以及 **daunting** 中的 **au**。",
      ),
    },
    notes: `
      daunting|a steep mountain climb as a worrying task|a huge pile of homework facing tired students|a chore list so long he did not know where to start|daunting describes a task that worries you; apprehensive describes a worried person|daunting 形容令人畏惧的任务；apprehensive 形容忧虑的人|apprehensive describes a person who feels worried, not a task, pile or list that makes people worry|apprehensive 形容感到忧虑的人，不能形容让人发愁的任务或清单|wary describes someone careful about danger, not a hard job that looks too big to finish|wary 形容提防危险的人，不能形容看起来做不完的难事|daunt · ing|au saying /aw/ in daunt + -ing|daunt 中 au 读 /ɔː/，再加 -ing
      reluctant|a boy finding reasons not to jump into icy water|a lazy puppy not wanting to leave its warm basket|a girl not wanting to lend her new bike|reluctant means not wanting to do something; hesitant means slow because unsure|reluctant 指不想做；hesitant 指拿不准而迟疑|courageous means very brave, not unwilling and full of excuses to avoid doing something|courageous 指非常勇敢，不是不情愿、找借口躲着不做|wary means careful because of danger, not simply not wanting to do something|wary 指因有危险而小心，不是单纯不想做某事|re · luc · tant|re- + luc + -tant, ending -ant|re- 加 luc 和 -tant，结尾 -ant
      apprehensive|a girl afraid of forgetting the notes at her first piano recital|a traveler worried about getting lost|people afraid a coming storm will flood their house|apprehensive describes a person worried about what may happen; daunting describes a hard task|apprehensive 形容担心会出事的人；daunting 形容令人畏惧的任务|daunting describes a task that makes people worry, not the worried person who feels it|daunting 形容让人发愁的任务，不能形容感到担心的人|courageous means very brave, not worried that something bad will happen|courageous 指非常勇敢，不是担心坏事发生|ap · pre · hen · sive|double p, then -hens- + -ive|双写 p，再加 -hens- 和 -ive
      falter|a voice shaking before a huge crowd|courage weakening at the top of a high diving board|a tired horse slowing and stumbling|falter means lose strength or stop moving steadily; flinch means jerk quickly away|falter 指气力或勇气减弱、步子不稳；flinch 指猛地一缩|flinch means make one quick movement away from pain, not slowly lose strength, courage or a steady pace|flinch 指因疼痛猛地一缩，不是气力、勇气或步伐慢慢减弱|surrender means stop fighting and accept defeat, not shake or weaken while still going on|surrender 指停止抵抗、认输，不是仍在坚持时声音发抖或力气减弱|fal · ter|fal + -ter, with al saying /awl/|fal 加 -ter，al 读 /ɔːl/
      hesitant|a swimmer standing long at the edge, unsure whether to jump|a slow answer with a pause after every word|a boy unsure of the answer and slow to raise his hand|hesitant means slow because unsure; reluctant means not wanting to|hesitant 指拿不准而迟疑；reluctant 指不愿意|courageous means very brave, not unsure and slow to act|courageous 指非常勇敢，不是拿不准、迟迟不动|daunting describes a task that worries people, not a person who is slow because unsure|daunting 形容令人畏惧的任务，不能形容因拿不准而迟疑的人|hes · i · tant|hesit- + -ant, ending -ant|hesit- 加 -ant，结尾 -ant
      flinch|a girl keeping still as a needle goes in|a boy trying not to jerk as a ball flies at his face|people jerking back at a loud bang|flinch means make a quick move away from pain or fear; falter means slowly lose strength|flinch 指因痛或怕猛地一缩；falter 指慢慢失去力气或勇气|stagger means walk unsteadily, almost falling, not make one quick jerk away from pain or a sudden scare|stagger 指走路摇摇晃晃，不是因疼痛或惊吓猛地一缩|surrender means stop fighting and give up, not a quick body movement away from pain|surrender 指放弃抵抗，不是身体因疼痛猛地一缩|flinch|fl blend + short i + -nch|fl 连缀、短 i 加 -nch
      bravado|boasting courage that vanished when a dog barked|bold-sounding words while her hands shook|a show of courage that fooled no one|bravado is a show of courage that is not real; valor is real courage|bravado 是假装的勇敢；valor 是真正的英勇|valor is real, great courage, not a bold show that hides fear|valor 是真正的英勇，不是掩盖恐惧的逞强|qualm is a doubt about whether something is right, not a show of false courage|qualm 是对是否正确的疑虑，不是假装勇敢|bra · va · do|brave without the e + -ado|brave 去 e 再加 -ado
      qualm|a girl with no doubt about telling the truth|a doubt about whether taking the last cookie is right|doubts about whether a plan is fair|qualm is a doubt about whether something is right; bravado is a show of false courage|qualm 是对是否正确的疑虑；bravado 是假装的勇敢|bravado is a show of courage that is not real, not a doubt about whether something is fair or right|bravado 是假装勇敢，不是对是否公平、正确的疑虑|grudge is anger held against someone, not a doubt about whether an action is right|grudge 是对人的怨恨，不是对某个做法是否正确的疑虑|qualm|qu + a + silent l + m, like calm|qu 加 a，l 不发音，再加 m（和 calm 一样）
      wary|a deer careful around hunters|people careful around strangers who ask for money|a cat careful around a new dog|wary means careful because of danger; hesitant means slow because unsure|wary 指因有危险而小心；hesitant 指拿不准而迟疑|hesitant means slow to act because unsure, not on guard against something that might be dangerous|hesitant 指拿不准而迟疑，不是提防可能有危险的东西|daunting describes a hard task, not an animal or person on guard against danger|daunting 形容令人畏惧的任务，不能形容提防危险的动物或人|wa · ry|w + ar saying /air/ + y|w 加读 /eə/ 的 ar，再加 y
      courageous|a firefighter running into a burning house|a girl standing up to a bully in front of the class|a boy climbing down a steep cliff to save a kitten|courageous means very brave; reluctant means not wanting to act|courageous 指非常勇敢；reluctant 指不情愿|reluctant means not wanting to do something, the opposite of rushing bravely to act|reluctant 指不情愿做事，和勇敢地冲上去正相反|apprehensive means worried something bad will happen, not acting bravely in spite of danger|apprehensive 指担心坏事发生，不是不顾危险勇敢行动|cou · ra · geous|courage + -ous, keeping the e so g stays soft|courage 加 -ous，保留 e 使 g 读软音
    `,
  },
);

const nutrition = batch(
  "words-of-nutrition",
  ["Words of Nutrition", "营养的词"],
  ["food and health", "食物与健康"],
  `
  protein|a substance in food such as meat, eggs and beans that builds muscle|蛋白质|Eggs, meat and fish are full of ___.|Your body needs ___ to build muscle.|Fish is a good source of the ___ that repairs your muscles.|fiber,carbohydrate|proteins
  vitamin|a substance in food that the body needs in small amounts|维生素|Oranges are rich in ___ C.|A ___ helps your body fight illness, even though you need only a tiny amount.|Sunlight helps your body make ___ D.|calorie,sodium|vitamins
  calorie|a unit for measuring the energy in food|卡路里|Each ___ in food is a small amount of energy for your body.|Running burns more than one ___ a minute.|This diet soda has almost no ___, so it gives you almost no energy.|vitamin,diet|calories
  diet|the food a person or animal usually eats|饮食|Wild cats hunt for their food; their ___ is mostly mice and birds.|Pandas live on a ___ of bamboo.|Koalas eat almost nothing but leaves; their whole ___ is eucalyptus.|calorie,regimen|diets
  nutrition|the food that you eat and how it affects your health|营养|The ___ facts on the cereal box list its sugar, fat and salt.|In health class we studied ___, the science of how food keeps the body healthy.|Good ___, from eating many kinds of healthy food, helps children grow strong.|protein,vitamin
  carbohydrate|a substance in foods such as bread, rice and pasta that gives energy|碳水化合物|Rice is mostly ___.|Runners eat pasta, which is full of ___, for quick energy.|Sugar is a simple ___.|protein,fiber|carbohydrates
  fiber|the part of plants that the body cannot digest but needs|膳食纤维|Bran and the skins of fruit are full of ___ that your body cannot digest.|Apples and celery are full of ___, the rough plant part your body cannot break down.|___ helps food move through your body.|protein,sodium
  nutritious|full of things that keep you healthy|有营养的|Even a small ___ breakfast of an egg and some fruit gives your body what it needs.|Each nut is tiny but ___, packed with protein and vitamins.|The school serves small but ___ lunches that keep students healthy.|plentiful,bittersweet
  sodium|a chemical in salt|钠|Salty chips contain a lot of ___.|Too much ___ from salt is bad for your heart.|The label lists the salt, or ___, in each serving.|vitamin,fiber
  wholesome|good for your health and well-being|健康的，有益的|Grandma cooked a small but ___ meal of vegetable soup and bread that was good for us.|Fresh air, sleep and simple food make a ___ life that keeps you well in body and mind.|A small apple is a ___ snack that is good for your body.|plentiful,bittersweet
  `,
  "context-clues",
  {
    intro: t(
      "A bowl of beans with brown rice makes a **nutritious** lunch: the beans give **protein** and **fiber**, the rice gives **carbohydrate** for energy, and a little lemon adds a **vitamin**. These ten words help you read food labels and choose what keeps you healthy.",
      "一碗豆子配糙米就是一顿有营养的（**nutritious**）午餐：豆子提供蛋白质（**protein**）和膳食纤维（**fiber**），米饭提供供能的碳水化合物（**carbohydrate**），一点柠檬还能补充维生素（**vitamin**）。这十个词帮你看懂食品标签，选择有益健康的食物。",
    ),
    watchOut: {
      meanings: t(
        "Tell **protein** (builds muscle; in meat, eggs and fish) apart from **carbohydrate** (gives quick energy; in rice, bread and sugar) and **fiber** (the plant part you cannot digest that keeps food moving).",
        "分清 **protein**（构建肌肉，存在于肉、蛋、鱼中）、**carbohydrate**（提供快速能量，存在于米饭、面包和糖中）和 **fiber**（无法消化、帮助食物通过肠道的植物部分）。",
      ),
      use: t(
        "Tell **diet** (the foods a person or animal *usually* eats) apart from **nutrition** (how food affects your *health*, and the study of it) and **calorie** (one *unit* of energy in food).",
        "分清 **diet**（人或动物平常吃的食物）、**nutrition**（食物对健康的影响及相关学问）和 **calorie**（食物能量的计量单位）。",
      ),
      spelling: t(
        "Watch **protein** (*ei* after *t*, breaking the *i* before *e* rule), **carbohydrate** (*carbo-* + *hydr-* + *-ate*), and **nutritious** (*-tious*, not *-shus*).",
        "注意 **protein** 中 t 后面的 **ei**（打破了 i 在 e 前的规则）、**carbohydrate**（carbo- 加 hydr- 加 -ate），以及 **nutritious** 结尾的 **-tious**。",
      ),
    },
    notes: `
      protein|eggs, meat and fish as muscle-building food|a substance the body uses to build muscle|a part of fish that repairs muscles|protein builds muscle; carbohydrate gives quick energy|protein 构建肌肉；carbohydrate 提供快速能量|fiber is the plant part the body cannot digest, which eggs, meat and fish do not have and which builds no muscle|fiber 是人体无法消化的植物部分，蛋、肉、鱼里没有，也不能构建肌肉|carbohydrate is the energy food in rice and bread, not the part of meat, eggs and fish that builds muscle|carbohydrate 是米饭面包里的供能物质，不是肉蛋鱼里构建肌肉的成分|pro · tein|ei after t, breaking the i-before-e rule|t 后面是 ei，打破 i 在 e 前的规则
      vitamin|vitamin C found in oranges|a substance needed in tiny amounts to fight illness|vitamin D made with the help of sunlight|vitamin is a substance needed in small amounts; a calorie is a unit of energy|vitamin 是需要少量摄入的营养素；calorie 是能量单位|calorie is a unit for measuring energy, not a substance with a letter name like C or D that helps fight illness|calorie 是计量能量的单位，不是以 C、D 等字母命名、帮助抵抗疾病的营养素|sodium is a chemical in salt that is harmful in large amounts, not a substance named by a letter that keeps you well|sodium 是盐里的化学成分，吃多了有害，不是以字母命名、帮助身体健康的营养素|vi · ta · min|vit + a + -min, ending -in, not -ine|vit 加 a 和 -min，结尾是 -in 不是 -ine
      calorie|one small amount of food energy|energy burned each minute of running|almost no energy in a diet soda|calorie is a unit of food energy; a vitamin is a substance needed in tiny amounts|calorie 是食物能量单位；vitamin 是少量需要的营养素|vitamin is a substance the body needs to stay well, not a unit for counting how much energy food gives or burns|vitamin 是身体需要的营养素，不是计算食物提供或消耗多少能量的单位|diet is all the food a person usually eats, not one unit of energy that running burns|diet 是一个人平常吃的全部食物，不是跑步消耗的能量单位|cal · o · rie|cal + o + -rie, ending -ie|cal 加 o 和 -rie，结尾 -ie
      diet|wild cats usually eating mice and birds|bamboo as the usual food of pandas|eucalyptus leaves as all a koala eats|diet is the food usually eaten; a regimen is a strict plan to follow|diet 是平常吃的食物；regimen 是必须严格执行的计划|calorie is one unit of energy in food, not all the foods an animal usually eats|calorie 是食物能量的一个单位，不是动物平常吃的全部食物|regimen is a strict plan of exercise, diet or medicine that a person follows, not simply what an animal eats in the wild|regimen 是人严格执行的锻炼、饮食或服药计划，不是野生动物平常吃的东西|di · et|di + et, with i saying long i|di 加 et，i 读长音
      nutrition|nutrition facts on a cereal box listing sugar, fat and salt|the science of how food keeps the body healthy|healthy eating that helps children grow strong|nutrition is food and how it affects health; protein is one substance in food|nutrition 是饮食及其对健康的影响；protein 只是食物中的一种成分|protein is one muscle-building substance, not the whole subject of how all foods affect your health|protein 只是构建肌肉的一种成分，不是关于各种食物怎样影响健康的整体|vitamin is one substance needed in tiny amounts, not the whole of how eating affects health|vitamin 是少量需要的一种营养素，不是饮食对健康影响的全部|nu · tri · tion|nu + tri + -tion, with -tion saying /shun/|nu 加 tri 和读 /ʃən/ 的 -tion
      carbohydrate|the main substance in rice|pasta's energy food eaten by runners|sugar as a simple energy food|carbohydrate gives energy; protein builds muscle|carbohydrate 提供能量；protein 构建肌肉|protein builds muscle and is found in meat and eggs, not the quick-energy food that rice, pasta and sugar are made of|protein 构建肌肉，存在于肉和蛋里，不是米饭、面食和糖里的快速供能物质|fiber is the plant part the body cannot digest, so it gives no quick energy|fiber 是无法消化的植物部分，不能提供快速能量|car · bo · hy · drate|carbo- + hydr- (y for short i) + -ate|carbo- 加读短 i 的 hydr- 再加 -ate
      fiber|the undigested part of bran and fruit skins|the rough plant part of apples and celery|a plant part helping food move through the body|fiber is the plant part the body cannot digest; protein builds muscle|fiber 是无法消化的植物部分；protein 构建肌肉|protein is a substance the body digests to build muscle, not a rough plant part it cannot digest|protein 是被身体消化、用来构建肌肉的成分，不是无法消化的粗糙植物部分|sodium is a chemical in salt, not the rough part of plants that helps food move through the body|sodium 是盐里的化学成分，不是帮助食物通过肠道的粗糙植物部分|fi · ber|long i + -ber, spelled fibre in British English|长 i 加 -ber，英式拼法是 fibre
      nutritious|a small breakfast of egg and fruit giving the body what it needs|tiny nuts packed with protein and vitamins|small school lunches keeping students healthy|nutritious means full of things that keep you healthy; plentiful means existing in large amounts|nutritious 指有营养的；plentiful 指数量充足的|plentiful means there is a large amount of something, not that a small breakfast, nut or lunch is good for your health|plentiful 指数量多，不是说一份小早餐、一颗坚果或一份午餐有营养|bittersweet means happy and sad at once, a feeling, not food full of protein and vitamins|bittersweet 指悲喜交加的心情，不是富含蛋白质和维生素的食物|nu · tri · tious|-tious ending, with ti saying /sh/|结尾 -tious，ti 读 /ʃ/
      sodium|the salty part of chips|salt's chemical that harms the heart in large amounts|the salt amount listed on a food label|sodium is a chemical in salt; a vitamin is a substance the body needs in small amounts|sodium 是盐里的化学成分；vitamin 是少量需要的营养素|vitamin is a substance that helps you stay well, not the chemical in salt that harms your heart in large amounts|vitamin 是帮助身体健康的营养素，不是吃多了伤心脏的盐中成分|fiber is the undigested part of plants, not the chemical that makes chips salty|fiber 是无法消化的植物部分，不是让薯片变咸的化学成分|so · di · um|so + di + -um, the ending of many chemical names|so 加 di 和许多化学名称共有的结尾 -um
      wholesome|a small but healthy meal of soup and bread|a simple life that keeps body and mind well|a small apple as a healthy snack|wholesome means good for your health and well-being; plentiful means existing in large amounts|wholesome 指有益身心健康的；plentiful 指数量充足的|plentiful means there is a lot of something, not that a small meal, snack or simple life is good for you|plentiful 指数量多，不是说一顿小饭、一份零食或简单生活有益健康|bittersweet means both happy and sad, a feeling, not something good for your body and mind|bittersweet 指悲喜交加的心情，不是有益身心的东西|whole · some|silent w in whole, then -some|whole 开头的 w 不发音，再加 -some
    `,
  },
);

const farming = batch(
  "words-of-modern-farming",
  ["Words of Modern Farming", "现代农业的词"],
  ["modern farming", "现代农业"],
  `
  pesticide|a chemical used to kill insects that harm crops|杀虫剂|The farmer sprayed ___ on the apple trees to kill the insects eating the leaves.|Some ___ can harm bees as well as pests.|Wash fruit to remove any bug-killing ___ left on its skin.|fertilizer,erosion|pesticides
  fertilizer|a substance added to soil to help plants grow|肥料|Farmers spread ___ on the fields in spring to feed the soil.|Too much ___ washing into rivers can make weeds grow wild in the water.|Compost is a natural ___ that helps vegetables grow.|pesticide,yield|fertilizers
  yield|the amount a field produces; also to produce|产量；出产|Each field's ___ of corn this year was the biggest the farm had ever grown.|Healthy soil can ___ more wheat.|Rain helped increase the ___ of each rice field.|surplus,fertilizer|yields
  livestock|animals kept on a farm, such as cows and sheep|家畜，牲畜|The farmer fed his ___ every morning before milking the cows.|Floods drowned many of the farm's ___, including cows and sheep.|Cows, pigs and goats raised on farms are all ___.|pasture,fertilizer
  organic|grown without man-made chemicals|有机的|Because ___ farmers use no man-made sprays, their vegetables cost more.|The farm switched to ___ methods, using compost instead of chemicals.|The farm earned its ___ label after it stopped using man-made sprays.|fallow,nutritious
  cultivate|to prepare land and grow crops on it|耕作，种植|The settlers began to ___ the land along the river, plowing it and planting wheat.|You must ___ the soil before you plant.|Farmers there ___ rice by planting and tending it in flooded fields.|graze,yield|cultivated,cultivates,cultivation
  graze|to eat grass in a field|吃草，放牧|Sheep ___ on the hillside all summer.|The farmer let the cows ___ in the meadow.|Deer come out at dusk to ___ on the grass at the edge of the woods.|cultivate,yield|grazed,grazing
  fallow|plowed but left without crops for a season|休耕的|The farmer left one field ___ each year to rest the soil.|Land left ___, with no crops for a season, slowly gets its strength back.|The ___ field had no crops this year, only weeds.|organic,plentiful
  erosion|the slow wearing away of land by wind or water|侵蚀|Tree roots help stop the ___ of the hillside.|Heavy rain caused ___ along the river bank.|Wind ___ carried the topsoil away.|fertilizer,pesticide
  pasture|land covered with grass where animals feed|牧场|The horses ate grass all day in the green ___ behind the barn.|The farmer moved his sheep to a fresh ___ with long, new grass.|A fence kept the cows in the ___ where they grazed.|livestock,fertilizer|pastures
  `,
  "context-clues",
  {
    intro: t(
      "On a modern farm, cows **graze** in the **pasture** while the farmer spreads **fertilizer** on one field and leaves another **fallow** so its soil can rest. These ten words describe how farms grow crops and raise animals today.",
      "在现代农场里，奶牛在牧场（**pasture**）上吃草（**graze**），农民给一块地施肥料（**fertilizer**），又让另一块地休耕（**fallow**），好让土壤休养。这十个词描写今天的农场怎样种庄稼、养牲畜。",
    ),
    watchOut: {
      meanings: t(
        "Tell **fertilizer** (fed to soil to make plants *grow*) apart from **pesticide** (sprayed to *kill* the insects that eat crops).",
        "分清 **fertilizer**（施在土里让植物生长的肥料）和 **pesticide**（喷洒来杀死吃庄稼害虫的药剂）。",
      ),
      use: t(
        "Tell **cultivate** (people plow and plant the land) apart from **graze** (animals eat the grass) and **yield** (the land produces a crop).",
        "分清 **cultivate**（人耕地种庄稼）、**graze**（动物吃草）和 **yield**（土地产出庄稼）。",
      ),
      spelling: t(
        "Watch **yield** (*ie*, as in *field*), **pesticide** (*pest* + *-icide*, meaning killer), and **fallow** (double *l*, then *-ow*).",
        "注意 **yield** 中的 **ie**（和 field 一样）、**pesticide**（pest 加表示“杀”的 -icide），以及 **fallow** 的双写 **l** 和结尾 **-ow**。",
      ),
    },
    notes: `
      pesticide|a spray killing insects that eat apple leaves|a chemical that harms bees along with pests|a bug-killing chemical left on fruit skin|pesticide kills insects that harm crops; fertilizer helps plants grow|pesticide 杀死危害庄稼的昆虫；fertilizer 帮助植物生长|fertilizer feeds the soil to help plants grow, not a chemical that kills insects and pests|fertilizer 给土壤施肥让植物生长，不是杀死昆虫害虫的药剂|erosion is the slow wearing away of land, not a chemical that can be sprayed or washed off|erosion 是土地被慢慢侵蚀，不是可以喷洒或洗掉的化学药剂|pes · ti · cide|pest + -icide, the ending that means killer|pest 加表示“杀”的 -icide
      fertilizer|a substance spread on spring fields to feed the soil|a plant food that makes river weeds grow wild|compost as a natural plant food|fertilizer helps plants grow; pesticide kills insects|fertilizer 帮助植物生长；pesticide 杀死昆虫|pesticide kills insects, not a substance that feeds soil and makes plants or weeds grow|pesticide 用来杀虫，不能给土壤施肥让植物或杂草生长|yield is the amount a field produces, not a substance spread on soil|yield 是田地的产量，不是撒在土里的东西|fer · til · iz · er|fertile without the e + -izer|fertile 去 e 再加 -izer
      yield|a field's record crop of corn|healthy soil producing more wheat|the amount each rice field produced|yield is the amount a field produces; a surplus is what is left over after needs are met|yield 是田地的产量；surplus 是满足需要后剩下的部分|surplus is the amount left over after needs are met, not the whole amount a field grows|surplus 是满足需要后的剩余，不是一块田的全部产量|fertilizer is what is put into the soil, not what the field produces|fertilizer 是施进土里的东西，不是田地的产出|yield|ie saying long e, as in field|ie 读长 e，和 field 一样
      livestock|farm animals fed before the cows are milked|cows and sheep drowned in a flood|cows, pigs and goats raised on farms|livestock are farm animals; a pasture is the grassy land they feed on|livestock 是农场牲畜；pasture 是它们吃草的草地|pasture is the grassy land where animals feed, not the animals themselves that are fed or drowned|pasture 是牲畜吃草的草地，不是被喂养或被淹死的牲畜|fertilizer is a substance put on soil, not the animals raised on a farm|fertilizer 是施在土里的东西，不是农场饲养的动物|live · stock|live (long i) + stock, a compound word with no plural s|live（读长 i）加 stock 组成合成词，不加复数 s
      organic|farmers whose vegetables cost more because they use no man-made sprays|a farm using compost instead of chemicals|a label earned by stopping man-made sprays|organic means grown without man-made chemicals; fallow means left without crops|organic 指不用人工化学品种植的；fallow 指休耕的|fallow means left without crops for a season, not farming that uses no man-made chemicals|fallow 指一季不种庄稼，不是不用人工化学品的种植方式|nutritious means full of things that keep you healthy, which says nothing about farming without chemical sprays|nutritious 指有营养的，和不用化学药剂种植无关|or · gan · ic|organ + -ic|organ 加 -ic
      cultivate|settlers plowing river land and planting wheat|preparing soil before planting|planting and tending rice in flooded fields|cultivate means prepare land and grow crops; graze means eat grass|cultivate 指耕地种庄稼；graze 指吃草|graze means animals eat grass in a field, not people plowing and planting crops|graze 指动物在田里吃草，不是人耕地种庄稼|yield means a field produces a crop, not people preparing the land and planting|yield 指田地产出庄稼，不是人整地播种|cul · ti · vate|cult + i + -vate|cult 加 i 和 -vate
      graze|sheep eating grass on a hillside all summer|cows eating grass in a meadow|deer eating grass at the edge of the woods at dusk|graze means eat grass in a field; cultivate means prepare land and grow crops|graze 指吃草；cultivate 指耕地种庄稼|cultivate means people plow land and grow crops, not animals eating grass|cultivate 指人耕地种庄稼，不是动物吃草|yield means produce a crop, not animals eating the grass of a field|yield 指出产庄稼，不是动物吃田里的草|graze|a-e saying long a, with z, not s|a-e 读长 a，中间是 z 不是 s
      fallow|one field left unplanted each year to rest the soil|land left with no crops for a season|a field with weeds but no crops this year|fallow means left without crops for a season; organic means grown without man-made chemicals|fallow 指休耕的；organic 指不用人工化学品种植的|organic describes crops grown without chemicals, not a field left with no crops at all|organic 形容不用化学品种出的庄稼，不是完全不种庄稼的田|plentiful means existing in large amounts, the opposite of a field with no crops|plentiful 指数量充足，和田里没有庄稼正相反|fal · low|double l + -ow|双写 l 再加 -ow
      erosion|tree roots holding a hillside together|heavy rain wearing away a river bank|wind carrying topsoil away|erosion is the wearing away of land; fertilizer is a substance that helps plants grow|erosion 是土地被侵蚀；fertilizer 是帮助植物生长的肥料|fertilizer is a substance added to soil, not the slow wearing away of land by wind or water|fertilizer 是施进土里的物质，不是风或水把土地慢慢侵蚀|pesticide is a chemical that kills insects, not land being worn away by rain or wind|pesticide 是杀虫的化学药剂，不是土地被雨水或风侵蚀|e · ro · sion|erode without the de + -sion saying /zhun/|erode 去掉 de 再加读 /ʒən/ 的 -sion
      pasture|a green field behind a barn where horses eat grass|a fresh field of long new grass for sheep|a fenced field where cows eat grass|pasture is grassy land where animals feed; livestock are the animals|pasture 是牲畜吃草的草地；livestock 是牲畜本身|livestock are the farm animals themselves, not the grassy land they feed on|livestock 是农场牲畜本身，不是它们吃草的草地|fertilizer is a substance spread on soil to feed plants, not a grassy field where animals feed|fertilizer 是撒在土里给植物的养料，不是牲畜吃草的草地|pas · ture|past + -ure, with t saying /ch/|past 加 -ure，t 读 /tʃ/
    `,
  },
);

const plenty = batch(
  "words-of-hunger-and-plenty",
  ["Words of Hunger and Plenty", "饥饿与富足的词"],
  ["hunger and plenty", "饥饿与富足"],
  `
  shortage|a situation in which there is not enough of something|短缺|A water ___ forced the town to close the pools.|The ___ of teachers meant larger classes.|During the war there was a ___ of sugar, so each family got only a little.|famine,surplus|shortages
  famine|a time when there is so little food that many people go hungry or die|饥荒|The ___ lasted three years, a terrible time when whole villages had no food.|Millions of people died in the great ___.|Aid workers brought food to the villages during the ___, when the crops had failed for two years.|feast,malnutrition|famines
  distribute|to give things out to many people|分发，分配|Volunteers ___ food to families in need.|The teacher will ___ the tests, putting one on each desk.|Trucks ___ rice to the villages.|hoard,starve|distributed,distributing
  feast|a large, special meal|盛宴|The village held a ___ after the harvest.|We ate a holiday ___ of roast chicken and pies at the long table.|The wedding ___ lasted all night.|famine,abundance|feasts
  abundance|a very large amount; more than enough|丰富，大量|The garden produced such ___ that we gave tomatoes away to the neighbors.|Fishermen love the lake because of its great ___ of fish.|In summer the market has a huge ___ of fruit, more than people can buy.|scarcity,shortage
  starve|to suffer or die because you have no food|挨饿，饿死|Without help, the cattle would ___ in the drought.|Many people began to ___ when no food could reach the city during the siege.|Do not ___ yourself; eat some lunch.|hoard,distribute|starved,starving
  hoard|to collect and hide a large supply of something|囤积|Squirrels ___ nuts for the winter.|During the shortage, some people began to ___ flour.|It is unfair to ___ food when others are hungry.|distribute,starve|hoarded,hoarding
  plentiful|existing in large amounts|充足的，丰富的|After the good harvest, food was so ___ that every barn was full.|Rain is ___ in the spring, when it falls almost every day.|Jobs were ___ in the growing city, and anyone could find work.|nutritious,fallow
  malnutrition|poor health caused by not eating enough good food|营养不良|Doctors weighed each thin child to check for signs of ___.|Eating too little good food led to ___, which stopped the child from growing properly.|Doctors treated the ___ with special food.|nutrition,shortage
  scarcity|a lack of something that is needed|缺乏，稀缺|The ___ of water made farming hard.|Prices rise when there is a ___ of goods.|Because of the ___ of doctors, sick villagers had to travel far to see one.|abundance,surplus
  `,
  "context-clues",
  {
    intro: t(
      "In a dry year, a **shortage** of rain can turn into a **famine**, and some people **hoard** grain while aid workers race to **distribute** food to the hungry. These ten words help you talk about having too little and having more than enough.",
      "干旱的年份里，雨水短缺（**shortage**）可能演变成饥荒（**famine**），有人囤积（**hoard**）粮食，救援人员则争分夺秒地把食物分发（**distribute**）给饥饿的人。这十个词帮你谈论匮乏与富足。",
    ),
    watchOut: {
      meanings: t(
        "Tell **famine** (a *time* when there is almost no food and many people die) apart from **malnutrition** (the poor *health* of a body that gets too little good food).",
        "分清 **famine**（几乎没有粮食、许多人饿死的时期）和 **malnutrition**（身体因缺少好的食物而健康受损）。",
      ),
      use: t(
        "Tell **hoard** (collect and hide a supply for yourself) apart from **distribute** (give things out to many people) and **starve** (suffer because you have no food).",
        "分清 **hoard**（为自己收集藏起大量物资）、**distribute**（把东西分发给许多人）和 **starve**（因没有食物而挨饿）。",
      ),
      spelling: t(
        "Watch **famine** (*fam-* + *-ine*, not *-in*), **plentiful** (*plenty* changes *y* to *i*, and *-ful* has one *l*), and **scarcity** (*scarce* drops its *e* before *-ity*).",
        "注意 **famine** 结尾的 **-ine**、**plentiful**（plenty 把 y 改成 i，-ful 只有一个 l），以及 **scarcity**（scarce 去掉 e 再加 -ity）。",
      ),
    },
    notes: `
      shortage|too little water forcing a town to close its pools|too few teachers making classes larger|too little sugar in wartime for each family|shortage means not enough of something; a famine is a time with almost no food at all|shortage 指某物不够；famine 指几乎完全没有粮食的时期|famine is a time when there is almost no food and people die, not simply not enough water, teachers or sugar|famine 是几乎没粮、有人饿死的时期，不是单纯缺水、缺老师或缺糖|surplus is an amount left over after needs are met, the opposite of not having enough|surplus 是满足需要后的剩余，和不够正相反|short · age|short + -age|short 加 -age
      famine|three terrible years when whole villages had no food|a great hunger in which millions died|villages fed by aid workers after two years of failed crops|famine is a time of almost no food; malnutrition is the poor health it causes|famine 是几乎没粮的时期；malnutrition 是由此造成的健康问题|feast is a large, special meal, the opposite of a time when villages have no food|feast 是丰盛的大餐，和村庄没有粮食的时期正相反|malnutrition is the poor health of a body that eats too little good food, not a whole period of hunger that hits villages|malnutrition 是身体缺乏好的食物导致的健康问题，不是席卷村庄的饥荒时期|fam · ine|fam + -ine, ending -ine, not -in|fam 加 -ine，结尾是 -ine 不是 -in
      distribute|volunteers giving out food to families in need|a teacher giving out tests to each desk|trucks giving out rice to villages|distribute means give things out to many; hoard means collect and hide them|distribute 指分发给许多人；hoard 指收集藏起来|hoard means collect and hide a supply for yourself, the opposite of giving things out to many people|hoard 指为自己收集藏起物资，和把东西分给许多人正相反|starve means suffer from having no food, not hand things out to others|starve 指因没有食物而挨饿，不是把东西分给别人|dis · trib · ute|dis- + trib + -ute|dis- 加 trib 和 -ute
      feast|a large meal held by a village after the harvest|a holiday meal of roast chicken and pies|a wedding meal lasting all night|feast is a large, special meal; abundance is a very large amount of anything|feast 是丰盛的大餐；abundance 是任何东西的大量|famine is a time with almost no food, the opposite of a large, special meal|famine 是几乎没粮的时期，和丰盛的大餐正相反|abundance is a very large amount of anything, not a special meal that people hold or eat|abundance 指任何东西数量很多，不是人们举办或享用的一顿大餐|feast|ea saying long e + st|ea 读长 e 再加 st
      abundance|so many tomatoes that they were given away|a great amount of fish in a lake|more summer fruit than people can buy|abundance is more than enough; scarcity is a lack|abundance 指充足有余；scarcity 指缺乏|scarcity is a lack of something needed, the opposite of having more than enough to give away|scarcity 指缺乏所需之物，和多到可以送人正相反|shortage means not enough of something, the opposite of a very large amount|shortage 指数量不够，和数量很多正相反|a · bun · dance|abound becomes abund- + -ance|abound 变成 abund- 再加 -ance
      starve|cattle dying for lack of food in a drought|people going hungry when no food reached a city under siege|someone going without lunch|starve means suffer from having no food; hoard means collect and hide a supply|starve 指因没有食物而挨饿；hoard 指囤积物资|hoard means collect and hide a large supply, not suffer from having no food at all|hoard 指囤积大量物资，不是因为完全没有食物而受苦|distribute means give food out to others, not go without food yourself|distribute 指把食物分给别人，不是自己没有饭吃|starve|st + ar + -ve, ending in silent e|st 加 ar 和 -ve，词尾 e 不发音
      hoard|squirrels storing up nuts for winter|people storing up flour during a shortage|keeping food to yourself while others are hungry|hoard means collect and hide a supply; distribute means give things out|hoard 指囤积藏起；distribute 指分发|distribute means give things out to many people, the opposite of keeping a hidden supply for yourself|distribute 指把东西分给许多人，和为自己藏起一大堆正相反|starve means suffer from having no food, not collect a large supply of it|starve 指没有食物而挨饿，不是囤积大量食物|hoard|oar saying /or/, not horde|oar 读 /ɔː/，别和 horde 混淆
      plentiful|so much food after a harvest that every barn was full|rain falling almost every spring day|so many jobs that anyone could find work|plentiful means existing in large amounts; nutritious means healthy to eat|plentiful 指数量充足；nutritious 指有营养|nutritious means full of things that keep you healthy, not existing in large amounts like full barns, daily rain or many jobs|nutritious 指有营养，不是像满仓粮食、天天下雨或工作很多那样数量充足|fallow means left without crops, the opposite of having large amounts of something|fallow 指休耕不种庄稼，和数量充足正相反|plen · ti · ful|plenty changes y to i + -ful with one l|plenty 把 y 改成 i，再加只有一个 l 的 -ful
      malnutrition|thin children weighed for signs of poor health from bad eating|poor health from too little good food stopping growth|poor health treated with special food|malnutrition is poor health from too little good food; nutrition is food and how it affects health|malnutrition 指营养不良；nutrition 指营养|nutrition is food and how it keeps you healthy, the opposite of the poor health doctors look for and treat|nutrition 指营养及其对健康的作用，和医生要检查、治疗的营养不良正相反|shortage is a lack of something such as water or teachers, not the poor health of a child's body|shortage 指缺水、缺老师等短缺，不是孩子身体的健康问题|mal · nu · tri · tion|mal- (bad) + nutrition|mal-（坏）加 nutrition
      scarcity|a lack of water making farming hard|a lack of goods making prices rise|a lack of doctors forcing villagers to travel far|scarcity is a lack of something needed; abundance is more than enough|scarcity 指缺乏；abundance 指充足有余|abundance is more than enough of something, the opposite of a lack that makes things hard|abundance 指数量充足有余，和造成困难的缺乏正相反|surplus is an amount left over after needs are met, the opposite of not having what is needed|surplus 是满足需要后的剩余，和缺少所需之物正相反|scar · ci · ty|scarce drops its e before -ity|scarce 去掉 e 再加 -ity
    `,
  },
);

const competition = batch(
  "words-of-competition",
  ["Words of Competition", "比赛的词"],
  ["competition and sport", "比赛与体育"],
  `
  opponent|the person or team you play against|对手|Shake hands with the ___ you are about to play against before the match.|In the final, her ___ across the net was taller but slower.|The chess player studied his ___'s moves before each turn.|contender,spectator|opponents
  championship|a competition to find the best player or team|锦标赛，冠军|Our team won the city ___ trophy after beating every other team.|She is training for the national swimming ___, where the best swimmers race for the title.|The ___ game on Saturday will decide which team is the best in the city.|victory,contender|championships
  referee|an official who makes sure players follow the rules|裁判|The ___ blew the whistle to stop the game.|Players must respect the ___'s decision.|The ___ showed him a yellow card.|spectator,opponent|referees
  spectator|a person who watches an event|观众|Every ___ in the stands stood up to cheer.|Each ___ in the stadium paid for a ticket.|One excited ___ climbed out of the stands and ran onto the field.|referee,contender|spectators
  compete|to try to win against others|比赛，竞争|Athletes from many countries ___ in the Olympics.|Two stores ___ for the same customers.|She will ___ against ten other girls in the long jump.|rally,defeat|competed,competition
  victory|a win|胜利|The team celebrated its 3–1 ___ over the visitors with a party.|We won by one point, a narrow ___ that the fans will never forget.|The general led his army to ___.|defeat,championship|victories
  defeat|a loss; also to beat someone|失败；击败|The team lost badly, but it learned a lot from its ___.|Can our school ___ the champions?|After the 5–0 ___, the coach comforted the crying players.|victory,rally|defeated,defeats
  league|a group of teams that play against each other|联赛，联盟|Our soccer ___ is a group of ten teams that play each other all season.|She plays every week in a girls' basketball ___ with eight teams.|Teams in the ___ play one another every Saturday from spring to fall.|championship,contender|leagues
  contender|a person or team that has a chance of winning|竞争者|She is a strong ___ for the gold medal.|Every ___ for the title must win its last game.|He was never a real ___ for the prize.|opponent,spectator|contenders
  rally|to come back strongly after being behind; also a long exchange of shots|重振，反攻；（球类）多拍对打|Behind by three goals, the team began to ___ and came back to win.|The tennis ___ lasted thirty shots.|Fans cheered as their team, far behind, tried to ___ in the last minutes.|compete,defeat|rallied,rallies
  `,
  "context-clues",
  {
    intro: t(
      "In the **championship** final, every **spectator** held their breath as our team, two goals behind, began to **rally** against a tough **opponent** and snatched a late **victory**. These ten words help you talk about games, matches and the people in them.",
      "锦标赛（**championship**）决赛中，每位观众（**spectator**）都屏住了呼吸：落后两球的我们开始反攻（**rally**），面对强劲的对手（**opponent**），最后时刻拿下了胜利（**victory**）。这十个词帮你谈论比赛和比赛中的人。",
    ),
    watchOut: {
      meanings: t(
        "Tell **opponent** (the one you play against in a game) apart from **contender** (anyone with a real chance of winning the prize) and **spectator** (someone who only watches).",
        "分清 **opponent**（比赛中与你交手的对手）、**contender**（有希望夺冠的竞争者）和 **spectator**（只观看的观众）。",
      ),
      use: t(
        "Tell **league** (a group of teams that play each other all season) apart from **championship** (the contest that decides the best) and **victory** (one win).",
        "分清 **league**（整个赛季互相比赛的一组球队）、**championship**（决出最强者的锦标赛）和 **victory**（一场胜利）。",
      ),
      spelling: t(
        "Watch **league** (*ea* + silent *-gue*), **referee** (*ref-* + double *e* at the end), and **opponent** (double *p*).",
        "注意 **league** 中的 **ea** 和不发音的 **-gue**、**referee** 结尾的双写 **e**，以及 **opponent** 的双写 **p**。",
      ),
    },
    notes: `
      opponent|the player you are about to play against, greeted with a handshake|the taller, slower player across the net in a final|the chess player whose moves are studied|opponent is the one you play against; a contender is anyone with a chance to win|opponent 是与你交手的对手；contender 是有望获胜的竞争者|contender is anyone with a real chance of winning a prize, not the particular player across the net or board from you|contender 指有望夺冠的人，不特指隔网或隔棋盘与你交手的那个人|spectator only watches the event, not the one who plays against you|spectator 只观看比赛，不是与你交手的人|op · po · nent|double p, then -nent with -ent|双写 p，再加 -nent
      championship|a city trophy won after beating every other team|the national swim contest where the best race for the title|the Saturday game deciding the best team in the city|championship is the contest to find the best; a victory is one win|championship 是决出最强者的锦标赛；victory 是一场胜利|victory is one win in any game, not the whole contest held to find the very best player or team|victory 是任何一场比赛的胜利，不是为决出最强者而举行的整个赛事|contender is a player with a chance of winning, not the contest itself|contender 是有望获胜的选手，不是赛事本身|cham · pi · on · ship|champion + -ship|champion 加 -ship
      referee|an official blowing a whistle to stop a game|an official whose decision players must respect|an official showing a yellow card|referee makes sure players follow the rules; a spectator only watches|referee 确保选手遵守规则；spectator 只是观看|spectator only watches from the stands and cannot blow a whistle, make decisions or show cards|spectator 只在看台上观看，不能吹哨、判罚或出示黄牌|opponent is a player trying to beat you, not the official who enforces the rules|opponent 是想打败你的选手，不是执行规则的裁判|ref · er · ee|ref + er + -ee, with double e at the end|ref 加 er 和 -ee，结尾双写 e
      spectator|fans in the stands standing up to cheer|people in a stadium who paid for tickets|an excited fan who ran onto the field from the stands|spectator watches an event; a referee runs the game|spectator 观看比赛；referee 执法比赛|referee is the official on the field who makes decisions, not someone who sits in the stands with a ticket|referee 是在场上判罚的裁判，不是拿着票坐在看台上的人|contender is a player who might win, not someone in the stands who only watches|contender 是可能获胜的选手，不是只在看台上观看的人|spec · ta · tor|spect (look) + -ator, ending -or|spect（看）加 -ator，结尾 -or
      compete|athletes from many countries taking part in the Olympics|two stores trying to win the same customers|a girl trying to win against ten others in the long jump|compete means try to win against others; rally means come back strongly from behind|compete 指与他人争胜；rally 指落后时奋起反击|rally means come back strongly after being behind, not simply take part and try to win against others|rally 指落后时奋起追赶，不是一般地参赛争胜|defeat means beat someone, the result of a game, not the act of taking part and trying to win|defeat 指击败某人，是比赛结果，不是参赛争胜的过程|com · pete|com- + pete, ending in silent e|com- 加 pete，词尾 e 不发音
      victory|a 3–1 win over the visitors celebrated with a party|a one-point win the fans will never forget|an army led to winning a war|victory is a win; defeat is a loss|victory 是胜利；defeat 是失败|defeat is a loss, the opposite of a win that people celebrate and remember|defeat 是失败，和值得庆祝纪念的胜利正相反|championship is a whole contest to find the best, not a single win|championship 是决出最强者的整个赛事，不是一场胜利|vic · to · ry|vict + -ory, ending -ory|vict 加 -ory
      defeat|a bad loss the team learned from|beating the champions|a 5–0 loss that left players crying|defeat is a loss or to beat someone; victory is a win|defeat 指失败或击败；victory 指胜利|victory is a win, the opposite of a loss that leaves players crying or learning from mistakes|victory 是胜利，和让队员哭泣或吸取教训的失败正相反|rally means come back strongly from behind, not lose a game or beat another team outright|rally 指落后时奋起追赶，不是输掉比赛或直接击败对手|de · feat|de- + feat, with ea saying long e|de- 加 feat，ea 读长 e
      league|ten soccer teams playing each other all season|a girls' basketball group of eight teams|teams playing one another every Saturday from spring to fall|league is a group of teams that play each other; a championship is the contest to find the best|league 是互相比赛的一组球队；championship 是决出最强者的锦标赛|championship is a contest that decides one winner, not a group of teams that plays each other all season|championship 是决出冠军的赛事，不是整个赛季互相比赛的一组球队|contender is one player or team with a chance to win, not a whole group of teams|contender 是有望获胜的一名选手或一支球队，不是一整组球队|league|ea saying long e + silent -gue|ea 读长 e，结尾 -gue 不发音
      contender|a strong chance of winning the gold medal|a team with a chance of the title if it wins its last game|someone who never had a real chance at the prize|contender is anyone with a chance of winning; an opponent is the one you play against|contender 是有望获胜的人；opponent 是与你交手的对手|opponent is the one player or team you face in a game, not anyone with a real chance of winning a prize|opponent 是比赛中与你交手的对手，不是泛指有望夺冠的人|spectator only watches, with no chance of winning anything|spectator 只是观看，根本没有获胜的机会|con · tend · er|contend + -er|contend 加 -er
      rally|a team three goals behind coming back to win|a long exchange of thirty tennis shots|a team far behind trying to catch up in the last minutes|rally means come back from behind or a long exchange of shots; compete means try to win|rally 指落后时奋起追赶或多拍对打；compete 指争胜|compete means simply take part and try to win, not come back strongly after being far behind|compete 只指参赛争胜，不是落后很多时奋起追赶|defeat means lose or beat someone, not a comeback or a long exchange of shots|defeat 指输掉或击败对手，不是反攻追赶或多拍对打|ral · ly|double l + y|双写 l 再加 y
    `,
  },
);

const rules = batch(
  "words-of-rules-and-fair-play",
  ["Words of Rules and Fair Play", "规则与公平竞争的词"],
  ["rules and fair play", "规则与公平竞争"],
  `
  penalty|a punishment for breaking a rule|处罚，罚球|The referee gave a ___ for the late tackle.|The ___ for parking here is a large fine.|She scored from the ___ spot after a defender handled the ball.|foul,regulation|penalties
  foul|an action that breaks the rules of a game|犯规|The player was sent off after his third ___, a hard push on another player.|Pushing another player is a ___ in basketball.|The referee did not see the ___ when the defender tripped him.|penalty,regulation|fouls,fouled
  violate|to break a rule, law or agreement|违反|Players who ___ the rules will be punished.|The factory was fined because it chose to ___ safety laws.|Do not ___ the trust of your friends.|disqualify,suspend|violated,violates,violation
  regulation|an official rule|规定，条例|Every ball must meet the league ___ for size.|A new ___ bans phones during exams.|A safety ___ requires helmets on bikes.|penalty,sportsmanship|regulations
  eligible|allowed to do or have something because you meet the rules|有资格的|Only students under twelve are ___ for the junior team.|She turned eighteen, so she is ___ to vote this year.|Players must keep good grades to stay ___ to play.|reliable,reluctant
  disqualify|to stop someone from taking part because they broke a rule|取消资格|The judges will ___ any runner who starts early, removing her from the race.|Cheating can ___ you from the contest.|They had to ___ the swimmer for a false start.|violate,forfeit|disqualified,disqualifies
  cheat|to break the rules to get an advantage|作弊|Players who ___ by peeking at the other team's cards spoil the game.|It is wrong to ___ on a test.|He would rather lose than ___ to win.|violate,forfeit|cheated,cheating,cheats
  sportsmanship|playing fairly and being polite whether you win or lose|体育精神|She won an award for ___ after she helped a fallen rival up.|Shaking hands after the game shows good ___.|The coach cares more about ___ than winning.|regulation,rivalry
  forfeit|to lose a game or right because you broke a rule or did not show up|弃权，被罚丧失|The team had to ___ the game and lose it because only six players came.|If you are late, you ___ your turn.|They chose to ___ and give the win to the other team rather than play unfairly.|disqualify,suspend|forfeited
  suspend|to stop someone from taking part for a time as a punishment|暂停（资格）|The league decided to ___ the player for two games.|The school may ___ students who fight, keeping them home for three days.|The coach will ___ any player who skips practice, benching him for one week.|disqualify,violate|suspended,suspension
  `,
  "context-clues",
  {
    intro: t(
      "When a defender tripped our striker, the referee called a **foul** and gave a **penalty**; if he does it again, the league may **suspend** him, because players who **violate** the rules are punished. These ten words help you talk about rules and playing fair.",
      "后卫绊倒了我们的前锋，裁判判他犯规（**foul**）并判罚点球（**penalty**）；如果他再犯，联赛可能会对他禁赛（**suspend**），因为违反（**violate**）规则的球员都要受罚。这十个词帮你谈论规则和公平竞争。",
    ),
    watchOut: {
      meanings: t(
        "Tell **foul** (the *action* that breaks a rule, like a push) apart from **penalty** (the *punishment* given for it) and **regulation** (the official *rule* itself).",
        "分清 **foul**（推人之类违反规则的动作）、**penalty**（因此受到的处罚）和 **regulation**（官方规定本身）。",
      ),
      use: t(
        "Tell **suspend** (stop a player from taking part *for a time*) apart from **disqualify** (put a player *out of the contest* for breaking a rule) and **forfeit** (*lose* a game or right by not playing or breaking a rule).",
        "分清 **suspend**（暂时禁赛一段时间）、**disqualify**（因违规被取消比赛资格）和 **forfeit**（因弃权或违规而丧失比赛或权利）。",
      ),
      spelling: t(
        "Watch **forfeit** (*ei* says short *i*), **eligible** (*-gible*, not *-gable*), and **disqualify** (*qu*, then *-ify*).",
        "注意 **forfeit** 中读短 i 的 **ei**、**eligible** 结尾是 **-gible** 不是 *-gable*，以及 **disqualify** 中的 **qu** 和结尾 **-ify**。",
      ),
    },
    notes: `
      penalty|a referee's punishment for a late tackle|a large fine for parking in the wrong place|the spot a punishment kick is taken from after a handball|penalty is the punishment; a foul is the action that breaks the rule|penalty 是处罚；foul 是违规的动作|foul is the rule-breaking action itself, such as a push, not the punishment, fine or kick given for it|foul 是推人这类违规动作本身，不是因此给出的处罚、罚款或罚球|regulation is the official rule, not the punishment for breaking it|regulation 是官方规定本身，不是违反规定后的处罚|pen · al · ty|penal + -ty|penal 加 -ty
      foul|a hard push that got a player sent off|pushing another player in basketball|a defender tripping an attacker|foul is an action that breaks a game's rules; a penalty is the punishment|foul 是违反比赛规则的动作；penalty 是处罚|penalty is the punishment given afterward, not the push or trip that broke the rules|penalty 是事后的处罚，不是违反规则的推人或绊人动作|regulation is the official rule itself, not an action that breaks it|regulation 是官方规定本身，不是违反规定的动作|foul|ou saying /ow/, sounding like fowl|ou 读 /aʊ/，和 fowl 同音
      violate|players breaking the rules|a factory breaking safety laws|breaking the trust of friends|violate means break a rule or agreement; disqualify means put someone out of a contest|violate 指违反规则或约定；disqualify 指取消比赛资格|disqualify means put someone out of a contest, which a player or factory does not do to rules, laws or trust|disqualify 指取消某人的比赛资格，不能用来说违反规则、法律或信任|suspend means stop someone from taking part for a time, not break a rule, law or promise|suspend 指暂停某人的参赛资格，不是违反规则、法律或承诺|vi · o · late|vi + o + -late|vi 加 o 和 -late
      regulation|the league rule for the size of every ball|a new rule banning phones during exams|a safety rule requiring helmets on bikes|regulation is an official rule; a penalty is the punishment for breaking one|regulation 是官方规定；penalty 是违反规定的处罚|penalty is the punishment for breaking a rule, not the official rule that sets sizes, bans phones or requires helmets|penalty 是违规后的处罚，不是规定尺寸、禁止手机或要求戴头盔的条文|sportsmanship is playing fairly and politely, not an official written rule|sportsmanship 指公平有礼的竞技精神，不是官方的成文规定|reg · u · la · tion|regulate drops its e + -ion|regulate 去掉 e 再加 -ion
      eligible|students under twelve allowed on the junior team|an eighteen-year-old allowed to vote|players allowed to play because of good grades|eligible means allowed because you meet the rules; reliable means able to be trusted|eligible 指符合条件、有资格的；reliable 指可靠的|reliable means able to be trusted every time, not allowed to join because you meet an age or grade rule|reliable 指每次都靠得住，不是因符合年龄或成绩要求而有资格|reluctant means not wanting to do something, not allowed to by the rules|reluctant 指不情愿做某事，不是按规则有资格做|el · i · gi · ble|-gible with g saying /j/, not -gable|结尾 -gible，g 读 /dʒ/，不是 -gable
      disqualify|judges removing a runner who starts early|cheating putting someone out of a contest|a swimmer removed for a false start|disqualify means put someone out of a contest for breaking a rule; violate means break the rule|disqualify 指因违规取消资格；violate 指违反规则|violate means break a rule yourself, not put another person out of a race or contest|violate 指自己违反规则，不是取消别人的比赛资格|forfeit means lose a game or right yourself, not remove another player from a race|forfeit 指自己丧失比赛或权利，不是把别的选手逐出比赛|dis · qual · i · fy|dis- + qualify, with qu and -ify|dis- 加 qualify，含 qu，结尾 -ify
      cheat|players peeking at the other team's cards|breaking the rules on a test|breaking the rules to win|cheat means break the rules to get an advantage; violate means break a rule|cheat 指为占便宜而作弊；violate 指违反规则|violate needs a rule, law or trust after it and does not mean secretly tricking others to get ahead|violate 后面要接规则、法律或信任，不表示偷偷耍手段占便宜|forfeit means give up or lose a game, not break the rules to win it|forfeit 指放弃或丧失比赛，不是为赢而作弊|cheat|ch + ea saying long e + t|ch 加读长 e 的 ea 再加 t
      sportsmanship|an award for helping a fallen rival up|a handshake after the game showing fair play|caring more about fair play than winning|sportsmanship is playing fairly and politely; a regulation is an official rule|sportsmanship 是公平有礼的竞技精神；regulation 是官方规定|regulation is an official written rule, not a player's fair and polite way of winning or losing|regulation 是官方的成文规定，不是选手赢输都公平有礼的风度|rivalry is a long competition between people, not fair and polite behavior toward them|rivalry 是人与人之间的长期竞争，不是对对手公平有礼的风度|sports · man · ship|sports + man + -ship, a compound word|sports 加 man 和 -ship 组成的合成词
      forfeit|a team losing a game because only six players came|losing a turn by being late|giving the win away rather than play unfairly|forfeit means lose a game or right; disqualify means put someone out of a contest|forfeit 指丧失比赛或权利；disqualify 指取消别人的资格|disqualify is something judges do to a player who broke a rule, not a team or player giving up a game or turn|disqualify 是裁判对违规选手的处置，不是球队或选手自己丢掉比赛或机会|suspend means stop someone for a time, usually as a punishment, not lose a game or a turn outright|suspend 指暂时禁赛，不是直接丢掉一场比赛或一次机会|for · feit|ei saying short i, not -fit|ei 读短 i，别写成 -fit
      suspend|a league stopping a player for two games|a school keeping fighting students home for three days|a coach benching a player for one week for skipping practice|suspend means stop someone for a time; disqualify means put someone out of a contest|suspend 指暂时禁止参加；disqualify 指取消比赛资格|disqualify means put someone out of a whole contest for breaking its rules, not keep them out for a set time such as two games, three days or a week|disqualify 指取消整场比赛的资格，不是禁赛两场、停课三天或一周这样的一段时间|violate means break a rule, not punish the person who broke it|violate 指违反规则，不是惩罚违规的人|sus · pend|sus- + pend, ending -end|sus- 加 pend，结尾 -end
    `,
  },
);

const training = batch(
  "words-of-training",
  ["Words of Training", "训练的词"],
  ["training for sport", "体育训练"],
  `
  stamina|the strength to keep going for a long time|耐力|Long-distance runners need great ___ to keep going for hours.|Swimming for an hour every day built up her ___, so she no longer got tired.|He ran out of ___ halfway through the race.|agility,coordination
  agility|the ability to move quickly and easily|敏捷|Goalkeepers need ___ to dive quickly from side to side.|The cat jumped onto the fence with great ___.|Quick-feet ladder drills improve ___, so players can change direction fast.|stamina,conditioning
  strain|an injury from stretching a muscle too far; also to try very hard|拉伤；竭力|He felt a ___ in the muscle of his thigh after the sprint.|Don't ___ your eyes reading in the dark.|She had to ___ to lift the heavy box.|sprain,drill|strained,strains
  coordination|the ability to make your body parts work well together|协调性|Juggling takes good hand-eye ___.|Dancing improves ___, helping your arms and legs move together.|A baby is still developing the ___ to make its hands and eyes work together.|agility,conditioning
  drill|an exercise that is repeated to practice a skill|练习，训练|The coach ran a passing ___ for twenty minutes.|We had a fire ___ at school today.|Each ___, repeated again and again, helps the players react faster.|sprint,regimen|drills
  sprain|an injury to a joint, such as an ankle, from twisting it|扭伤|She got a ___ in her ankle when it twisted as she landed.|A badly twisted wrist, or ___, can take weeks to heal.|Put ice on the ___ to bring down the swelling in your twisted knee.|strain,sprint|sprained
  hydrate|to drink enough water so your body has what it needs|补充水分|Remember to ___ by drinking water before and after the race.|Players stop to ___ with sips of water during hot games.|Carry a bottle so you can ___ often on a long, hot hike.|sprint,drill|hydrated,hydration
  sprint|a short, very fast run; also to run very fast|冲刺|She won the 100-meter ___.|He had to ___ to catch the bus.|The last ___ to the finish line was exciting.|drill,stamina|sprinted,sprints
  conditioning|training that makes your body fit and strong|体能训练|Summer ___, with hard running and lifting, makes the team fit and strong.|___ includes running, lifting and stretching.|The players groaned through an hour of ___, running and lifting weights.|coordination,stamina
  regimen|a strict plan of exercise, diet or medicine|养生法，训练计划|Her training ___ includes running every morning.|The doctor gave him a new ___ of exercise and medicine to follow each day.|Olympic swimmers follow a strict daily ___ of sleep, food and practice.|conditioning,drill|regimens
  `,
  "context-clues",
  {
    intro: t(
      "Before the season, our coach planned a strict **regimen**: a passing **drill** every morning, a final **sprint** every evening, and plenty of breaks to **hydrate** so nobody got a **strain**. These ten words help you talk about how athletes train their bodies.",
      "赛季开始前，教练制定了严格的训练计划（**regimen**）：每天早上一组传球练习（**drill**），每天傍晚最后一次冲刺（**sprint**），还安排足够的休息补充水分（**hydrate**），免得有人拉伤（**strain**）。这十个词帮你谈论运动员怎样训练身体。",
    ),
    watchOut: {
      meanings: t(
        "Tell **strain** (an injury to a *muscle* stretched too far) apart from **sprain** (an injury to a *joint*, such as an ankle, from twisting it).",
        "分清 **strain**（肌肉拉得太过造成的拉伤）和 **sprain**（脚踝等关节扭到造成的扭伤）。",
      ),
      use: t(
        "Tell **stamina** (keeping going for a *long time*) apart from **agility** (moving *quickly and easily*) and **coordination** (making body parts *work together*).",
        "分清 **stamina**（能长时间坚持的耐力）、**agility**（快速灵活的敏捷）和 **coordination**（身体各部分配合的协调性）。",
      ),
      spelling: t(
        "Watch **regimen** (*-men*, not *-ment*), **coordination** (*co-* + *ordination*, with two *o*'s side by side), and **hydrate** (*y* says long *i*).",
        "注意 **regimen** 结尾是 **-men** 不是 *-ment*、**coordination** 开头 co- 加 ordination（两个 **o** 相连），以及 **hydrate** 中读长 i 的 **y**。",
      ),
    },
    notes: `
      stamina|runners keeping going for hours|daily swimming that stopped her from getting tired|running out of strength halfway through a race|stamina is the strength to keep going for a long time; agility is moving quickly and easily|stamina 是长时间坚持的耐力；agility 是快速灵活的敏捷|agility is moving quickly and easily, not the strength to keep going for hours without getting tired|agility 指动作快速灵活，不是能坚持几个小时不累的耐力|coordination is making body parts work together, not lasting a long time before you tire|coordination 指身体各部分配合，不是能坚持很久才累|stam · i · na|stam + i + -na, ending in a|stam 加 i 和 -na，以 a 结尾
      agility|goalkeepers diving quickly from side to side|a cat leaping quickly onto a fence|ladder drills helping players change direction fast|agility is moving quickly and easily; stamina is keeping going a long time|agility 是快速灵活的敏捷；stamina 是长时间坚持的耐力|stamina is lasting a long time without tiring, not a quick dive, leap or change of direction|stamina 指长时间不累，不是快速扑救、跳跃或转向|conditioning is training that makes the body fit, not the quick, easy movement itself|conditioning 是让身体强健的训练，不是快速灵活的动作本身|a · gil · i · ty|agile drops its e + -ity, with g saying /j/|agile 去掉 e 再加 -ity，g 读 /dʒ/
      strain|a pulled thigh muscle after a sprint|eyes worked too hard in the dark|trying very hard to lift a heavy box|strain is an injury to a muscle or trying very hard; sprain is an injury to a twisted joint|strain 是肌肉拉伤或竭力；sprain 是关节扭伤|sprain is an injury to a twisted joint such as an ankle, not a pulled muscle or a hard effort|sprain 是脚踝等关节扭伤，不是肌肉拉伤或用尽全力|drill is an exercise repeated to practice a skill, not an injury or a hard effort to lift something|drill 是反复练习技能的训练，不是受伤或用力抬东西|strain|str blend + ai saying long a|str 连缀加读长 a 的 ai
      coordination|hands and eyes working together to juggle|arms and legs moving together in a dance|a baby learning to make hands and eyes work together|coordination is making body parts work together; agility is moving quickly|coordination 是身体各部分配合；agility 是动作敏捷|agility is moving quickly and easily, not getting two body parts such as hands and eyes to work together|agility 指动作快速灵活，不是让手和眼这样的身体部位协同工作|conditioning is training to make the body fit and strong, not the skill of making body parts work together|conditioning 是让身体强健的训练，不是身体各部分配合的能力|co · or · di · na · tion|co- + ordination, with two o's side by side|co- 加 ordination，两个 o 相连
      drill|a twenty-minute passing exercise|a practice of leaving school in a fire|an exercise repeated to help players react faster|drill is one exercise repeated to practice a skill; a regimen is a whole strict plan|drill 是反复做的一项练习；regimen 是整套严格计划|sprint is one short, very fast run, not an exercise repeated again and again to practice a skill|sprint 是一次短距离快跑，不是反复练习某项技能|regimen is a whole strict plan of exercise or diet, not one short practice exercise|regimen 是整套严格的锻炼或饮食计划，不是一项短小的练习|drill|dr blend + short i + double l|dr 连缀、短 i 加双写 l
      sprain|a twisted ankle hurt in a landing|a badly twisted wrist taking weeks to heal|a swollen, twisted knee treated with ice|sprain is an injury to a twisted joint; strain is an injury to a muscle stretched too far|sprain 是关节扭伤；strain 是肌肉拉伤|strain is a muscle stretched too far, not a joint such as an ankle, wrist or knee that has been twisted|strain 是肌肉拉得太过，不是脚踝、手腕或膝盖这样的关节扭伤|sprint is a short, very fast run, not an injury to a twisted joint|sprint 是短距离快跑，不是关节扭伤|sprain|spr blend + ai saying long a|spr 连缀加读长 a 的 ai
      hydrate|drinking water before and after a race|sipping water during hot games|drinking often from a bottle on a long hike|hydrate means drink enough water; sprint means run very fast|hydrate 指补充水分；sprint 指快速冲刺|sprint means run very fast, not take in water that the body needs|sprint 指快速奔跑，不是补充身体需要的水分|drill means practice a skill again and again, not drink water to refill the body|drill 指反复练习技能，不是喝水补充身体|hy · drate|hydr- (water), with y saying long i, + -ate|表示水的 hydr-，y 读长 i，再加 -ate
      sprint|a 100-meter race won by a fast runner|a very fast run to catch a bus|a very fast dash to the finish line|sprint is a short, very fast run; a drill is an exercise repeated to practice a skill|sprint 是短距离快跑；drill 是反复练习的训练|drill is an exercise repeated to practice a skill, not one short, very fast run or race|drill 是反复练习技能的训练，不是一次短距离快跑或赛跑|stamina is the strength to keep going for a long time, not a short burst of speed|stamina 是长时间坚持的耐力，不是短暂的爆发速度|sprint|spr blend + short i + -nt|spr 连缀、短 i 加 -nt
      conditioning|summer running and lifting that make a team fit|training made of running, lifting and stretching|an hour of hard running and weight lifting|conditioning is training to make the body fit and strong; coordination is body parts working together|conditioning 是让身体强健的训练；coordination 是身体协调|coordination is the skill of making body parts work together, not the running and lifting that build fitness|coordination 是身体各部分配合的能力，不是增强体能的跑步和举重|stamina is the strength that training builds, not the training itself|stamina 是训练练出的耐力，不是训练本身|con · di · tion · ing|condition + -ing|condition 加 -ing
      regimen|a training plan with running every morning|a doctor's daily plan of exercise and medicine|a strict daily plan of sleep, food and practice|regimen is a strict plan of exercise, diet or medicine; conditioning is training for fitness|regimen 是严格的锻炼、饮食或服药计划；conditioning 是体能训练|conditioning is the running and lifting itself, not a whole plan that includes medicine, sleep or food|conditioning 是跑步举重等训练本身，不是包含服药、睡眠或饮食的整套计划|drill is one exercise repeated to practice a skill, not a whole daily plan to follow|drill 是反复练习的一项训练，不是每天要遵守的整套计划|reg · i · men|reg + i + -men, not -ment|reg 加 i 和 -men，不是 -ment
    `,
  },
);

const named = batch(
  "words-named-after-people",
  ["Words Named After People", "以人名命名的词"],
  ["words named after people", "以人名命名的词"],
  `
  sandwich|two pieces of bread with food between them, named after the Earl of Sandwich|三明治|I had a cheese ___ on brown bread for lunch.|The Earl of Sandwich asked for his meat between bread, and the ___ got his name.|She cut the ___ into four triangles, careful not to spill the filling.|cardigan,saxophone|sandwiches
  boycott|to refuse to buy or use something as a protest, after Charles Boycott|抵制|People decided to ___ the store after it treated workers badly.|The word ___ comes from a land agent whom his neighbors refused to deal with.|The students agreed to ___ the cafeteria until it served better food.|pasteurize,betray|boycotted,boycotts
  cardigan|a knitted sweater that opens at the front, after the Earl of Cardigan|开襟毛衣|She buttoned up her ___ against the cold.|The Earl of Cardigan's soldiers wore a knitted jacket, and the ___ was named after him.|Grandpa wears a brown knitted ___ with buttons down the front.|leotard,sandwich|cardigans
  saxophone|a curved metal musical instrument, invented by Adolphe Sax|萨克斯管|He plays the ___ in the jazz band.|The ___ is named after its inventor, Adolphe Sax.|A ___ solo opened the song.|diesel,braille|saxophones
  diesel|a fuel for engines, named after Rudolf Diesel|柴油|Trucks and buses often run on ___.|Rudolf Diesel built the engine that gave ___ its name.|The ___ engine made a loud rumble.|saxophone,braille
  braille|a system of raised dots that blind people read with their fingers, invented by Louis Braille|盲文|She is blind, so she reads books in ___ with her fingertips.|Louis Braille, who was blind himself, created ___ when he was fifteen.|The elevator buttons have ___ on them for people who cannot see.|silhouette,saxophone
  leotard|a tight one-piece garment worn for dance, after Jules Léotard|紧身连衣裤|The gymnast wore a tight blue ___ for her routine on the beam.|The ___ is named after a French acrobat.|Each dancer changed into a stretchy one-piece ___ before ballet class.|cardigan,silhouette|leotards
  silhouette|a dark outline against a light background, after Étienne de Silhouette|剪影，轮廓|We saw the ___ of a man against the sunset.|The artist cut a ___ of my face out of black paper.|The ___ of the mountains was beautiful at dusk.|braille,leotard|silhouettes
  maverick|a person who thinks and acts differently from others, after Samuel Maverick|特立独行的人|She was a ___ who never followed the crowd.|The ___ scientist tested an idea everyone laughed at.|Samuel Maverick did not brand his cattle, and so a ___ came to mean an independent thinker.|nomad,boycott|mavericks
  pasteurize|to heat milk to kill germs, after Louis Pasteur|巴氏消毒|Dairies ___ milk to make it safe to drink.|Louis Pasteur showed that heat could kill germs, so we ___ milk in his name.|Factories ___ juice by heating it to kill germs before they bottle it.|boycott,hydrate|pasteurized
  `,
  "context-clues",
  {
    intro: t(
      "At the school concert, a girl in a **cardigan** played the **saxophone** while a dancer in a **leotard** made a dark **silhouette** against the bright stage lights. Each of these ten words began as a person's name.",
      "学校音乐会上，一个穿开襟毛衣（**cardigan**）的女孩吹萨克斯管（**saxophone**），一位穿紧身连衣裤（**leotard**）的舞者在明亮的舞台灯光下映出黑色剪影（**silhouette**）。这十个词原本都是人名。",
    ),
    watchOut: {
      meanings: t(
        "Tell **boycott** (people *refuse to buy or use* something as a protest) apart from **betray** (be disloyal to someone who trusts you): a boycott is open, a betrayal is secret.",
        "分清 **boycott**（人们为抗议而拒绝购买或使用）和 **betray**（背叛信任你的人）：抵制是公开的，背叛往往是暗中的。",
      ),
      use: t(
        "Tell **cardigan** (a knitted sweater that buttons down the front) apart from **leotard** (a tight one-piece outfit for dance or gymnastics) and **silhouette** (a dark outline, not something you wear).",
        "分清 **cardigan**（前面系扣的开襟毛衣）、**leotard**（跳舞或体操穿的紧身连衣裤）和 **silhouette**（黑色轮廓，不是衣服）。",
      ),
      spelling: t(
        "Watch **silhouette** (silent *h* and the French ending *-ette*), **saxophone** (*ph* says /f/), and **braille** (*ai* + double *l* + silent *e*).",
        "注意 **silhouette** 中不发音的 **h** 和法语结尾 **-ette**、**saxophone** 中读 /f/ 的 **ph**，以及 **braille** 的 **ai**、双写 **l** 和不发音的 **e**。",
      ),
    },
    notes: `
      sandwich|cheese between slices of brown bread for lunch|meat served between bread for the Earl of Sandwich|bread and filling cut into four triangles|sandwich is food between two pieces of bread; a cardigan is a sweater|sandwich 是夹着食物的两片面包；cardigan 是毛衣|cardigan is a knitted sweater you wear, not food you eat between slices of bread|cardigan 是穿在身上的针织毛衣，不是夹在面包里吃的食物|saxophone is a musical instrument you play, not bread with a filling you eat|saxophone 是演奏的乐器，不是夹馅的面包|sand · wich|sand + wich, with -wich, not -which|sand 加 wich，结尾是 -wich 不是 -which
      boycott|people refusing to shop at a store that treated workers badly|a land agent whose neighbors refused to deal with him|students refusing to use a cafeteria as a protest|boycott means refuse to buy or use something as a protest; betray means be disloyal to someone who trusts you|boycott 指为抗议而拒绝购买或使用；betray 指背叛信任你的人|pasteurize means heat milk or juice to kill germs, not refuse to buy or use something as a protest|pasteurize 指加热牛奶或果汁杀菌，不是为抗议拒绝购买或使用|betray means secretly let down someone who trusts you, not openly refuse to buy or use something|betray 指暗中辜负信任你的人，不是公开拒绝购买或使用|boy · cott|boy + cott, with double t|boy 加 cott，双写 t
      cardigan|a sweater buttoned up against the cold|a knitted jacket worn by the Earl of Cardigan's soldiers|a brown knitted sweater with buttons down the front|cardigan is a knitted sweater that opens at the front; a leotard is a tight one-piece outfit|cardigan 是前开襟的针织毛衣；leotard 是紧身连衣裤|leotard is a tight one-piece outfit for dance with no buttons down the front, not a warm knitted sweater|leotard 是跳舞穿的紧身连衣裤，前面没有扣子，不是保暖的针织毛衣|sandwich is food between bread, not a sweater you button up|sandwich 是夹馅面包，不是系扣的毛衣|car · di · gan|car + di + -gan, ending -gan, not -gen|car 加 di 和 -gan，结尾是 -gan 不是 -gen
      saxophone|an instrument played in a jazz band|an instrument named after its inventor, Adolphe Sax|an instrument playing a solo to open a song|saxophone is a musical instrument; diesel is a fuel|saxophone 是乐器；diesel 是燃料|diesel is a fuel that engines burn, not an instrument you play in a band|diesel 是发动机燃烧的燃料，不是在乐队里演奏的乐器|braille is a system of raised dots for reading, not an instrument that plays music|braille 是供盲人阅读的凸点文字，不是演奏音乐的乐器|sax · o · phone|sax + o + -phone, with ph saying /f/|sax 加 o 和 -phone，ph 读 /f/
      diesel|fuel that trucks and buses run on|fuel named after Rudolf Diesel's engine|an engine fuel that makes a loud rumble|diesel is a fuel for engines; a saxophone is an instrument|diesel 是发动机燃料；saxophone 是乐器|saxophone is a musical instrument, not a fuel that trucks and engines burn|saxophone 是乐器，不是卡车和发动机燃烧的燃料|braille is raised dots for reading by touch, not a fuel for engines|braille 是凭触摸阅读的凸点文字，不是发动机燃料|die · sel|ie saying long e + -sel|ie 读长 e 再加 -sel
      braille|books read with the fingertips by a blind reader|a reading system Louis Braille created at fifteen|raised dots on elevator buttons for people who cannot see|braille is raised dots read by touch; a silhouette is a dark outline seen by the eyes|braille 是用手摸读的凸点文字；silhouette 是用眼睛看到的黑色轮廓|silhouette is a dark outline you see with your eyes, not raised dots that blind people read with their fingers|silhouette 是用眼睛看到的黑色轮廓，不是盲人用手指摸读的凸点|saxophone is a musical instrument, not a system of dots for reading|saxophone 是乐器，不是供阅读的凸点文字|braille|br + ai + double l + silent e|br 加 ai，双写 l，词尾 e 不发音
      leotard|a tight blue outfit worn for a gymnastics routine|an outfit named after a French acrobat|a stretchy one-piece outfit for ballet class|leotard is a tight one-piece outfit for dance; a cardigan is a knitted sweater|leotard 是跳舞穿的紧身连衣裤；cardigan 是针织毛衣|cardigan is a loose knitted sweater that buttons at the front, not a tight one-piece outfit for dance or gymnastics|cardigan 是前面系扣的宽松毛衣，不是跳舞或体操穿的紧身连衣裤|silhouette is a dark outline, not something a dancer or gymnast wears|silhouette 是黑色轮廓，不是舞者或体操运动员穿的衣服|le · o · tard|le + o + tard, ending -ard|le 加 o 和 tard，结尾 -ard
      silhouette|a man's dark outline against the sunset|a face outline cut out of black paper|the dark outline of mountains at dusk|silhouette is a dark outline against light; braille is raised dots for reading|silhouette 是亮光衬托下的黑色轮廓；braille 是凸点盲文|braille is raised dots read by touch, not a dark shape seen against light|braille 是凭触摸阅读的凸点，不是亮光下看到的黑色形状|leotard is a tight outfit worn for dance, not a dark outline of a shape|leotard 是跳舞穿的紧身衣，不是物体的黑色轮廓|sil · hou · ette|silent h, ou saying /oo/, and the French ending -ette|h 不发音，ou 读 /uː/，结尾是法语式的 -ette
      maverick|a woman who never followed the crowd|a scientist testing an idea everyone laughed at|an independent thinker named after a rancher who did not brand his cattle|maverick is someone who thinks and acts differently; a nomad is someone who moves from place to place|maverick 是特立独行的人；nomad 是四处迁徙的人|nomad is a person who moves from place to place, not someone who thinks differently from the crowd|nomad 是四处迁徙的人，不是想法与众不同的人|boycott is a refusal to buy or use something, not a person who thinks independently|boycott 是拒绝购买或使用，不是独立思考的人|mav · er · ick|mav + er + -ick, ending -ick|mav 加 er 和 -ick
      pasteurize|dairies heating milk to make it safe|heating milk to kill germs in Louis Pasteur's name|factories heating juice to kill germs before bottling|pasteurize means heat milk or juice to kill germs; boycott means refuse to buy something as a protest|pasteurize 指加热杀菌；boycott 指为抗议拒绝购买|boycott means refuse to buy or use something as a protest, not heat a drink to make it safe|boycott 指为抗议拒绝购买或使用，不是把饮料加热使其安全|hydrate means drink enough water, not heat milk or juice to kill its germs|hydrate 指补充水分，不是加热牛奶或果汁杀菌|pas · teur · ize|Pasteur's name with eu + -ize|Pasteur 的姓（含 eu）加 -ize
    `,
  },
);

const language = batch(
  "words-about-language",
  ["Words About Language", "关于语言的词"],
  ["language and how people speak", "语言与说话方式"],
  `
  dialect|a form of a language spoken in one area|方言|People in the north speak a different ___, with its own words and grammar, from those in the south.|The old man spoke a ___ of the mountain villages that I could barely understand.|Cantonese is sometimes called a ___ of Chinese.|accent,slang|dialects
  accent|the way people from one place pronounce words|口音|She uses the same words as we do, but her Scottish ___ makes them sound different.|I could tell from how he pronounced "y'all" that he spoke with a Texas ___.|After years in London, her ___ changed, and she began to pronounce words like the British.|dialect,idiom|accents
  slang|very informal words used by a group, often young people|俚语|"Cool" is ___ for good.|Teenagers' ___ like "lit" does not belong in a formal essay.|Every generation of teenagers invents its own new ___.|jargon,idiom
  jargon|special words used by people in one job that others may not understand|行话，术语|Doctors use medical ___ that patients find confusing.|The computer manual was full of engineers' ___ that only experts understand.|The lawyer explained the contract without legal ___, so we understood it.|slang,dialect
  idiom|a phrase whose meaning is different from its separate words|习语|Translated word by word, the ___ "under the weather" makes no sense, since it means "ill."|"It's raining cats and dogs" is a funny ___: no animals fall; it just means heavy rain.|The teacher explained the ___ "spill the beans," which means "tell a secret."|slang,vocabulary|idioms
  fluent|able to speak a language easily and well|流利的|Though she speaks just one language, she is ___ in it and never stops to search for a word.|After two years of practice, his English became smooth and ___.|He reads slowly, but his spoken Chinese is ___ and quick.|bilingual,literate
  bilingual|able to speak two languages well|双语的|The ___ sign was written in both English and Spanish.|Our school runs ___ classes, taught half in English and half in Chinese.|The ___ dictionary gives every word in English on the left and Chinese on the right.|fluent,literate
  pronunciation|the way a word is said|发音|The ___ of "colonel" surprises many learners, because it sounds like "kernel."|She practiced saying "th" every day until her ___ of the word "three" was perfect.|Check the dictionary for the correct ___ of "February."|accent,vocabulary
  vocabulary|all the words a person knows or uses|词汇|Reading helps you build a large ___.|The list of new ___ for this unit is on the board, with the meaning of each word.|She knows so many words that her ___ is amazing for a six-year-old.|pronunciation,jargon
  translate|to change words from one language into another|翻译|Can you ___ this letter into English?|It took two years to ___ the book into thirty languages.|She will ___ the guide's Chinese into English for the visitors.|decipher,evolve|translated,translation
  `,
  "context-clues",
  {
    intro: t(
      "My cousin is **bilingual**: she can **translate** a Chinese **idiom** into English, and even her friends' **slang** never confuses her. These ten words help you talk about languages and the different ways people speak.",
      "我表姐会说两种语言（**bilingual**）：她能把一个中文习语（**idiom**）翻译（**translate**）成英文，就连朋友们的俚语（**slang**）也难不倒她。这十个词帮你谈论语言以及人们不同的说话方式。",
    ),
    watchOut: {
      meanings: t(
        "Tell **accent** (only the *sound* of the words changes) apart from **dialect** (the words and grammar change too) and **pronunciation** (the way *one word* is said).",
        "分清 **accent**（只是读音不同）、**dialect**（连用词和语法都不同）和 **pronunciation**（某一个词的读法）。",
      ),
      use: t(
        "Tell **slang** (informal words of a group, often young people) apart from **jargon** (special words of one *job*, like doctors or lawyers) and **idiom** (a whole *phrase* whose meaning differs from its words).",
        "分清 **slang**（某个群体、常是年轻人的非正式用语）、**jargon**（医生、律师等某一行业的专门用语）和 **idiom**（整体意思不同于字面的短语）。",
      ),
      spelling: t(
        "Watch **pronunciation** (*-nun-*, not *-noun-*, even though the verb is *pronounce*), **bilingual** (*bi-* + *lingu-* + *-al*), and **vocabulary** (*-ary*, not *-ery*).",
        "注意 **pronunciation** 中间是 **-nun-** 不是 *-noun-*（虽然动词是 pronounce）、**bilingual**（bi- 加 lingu- 加 -al），以及 **vocabulary** 结尾的 **-ary**。",
      ),
    },
    notes: `
      dialect|a northern form of a language with its own words and grammar|a mountain-village form of speech that is hard to understand|Cantonese as a regional form of Chinese|dialect is a form of a language with its own words and grammar; an accent is only how words sound|dialect 是有自己用词和语法的语言变体；accent 只是读音|accent is only the way words sound, not a whole form of a language with its own words and grammar|accent 只指读音，不是有自己用词和语法的语言变体|slang is informal words used by a group such as teenagers, not the regular speech of a whole region|slang 是青少年等群体的非正式用语，不是整个地区的日常语言|di · a · lect|di + a + -lect, like dialogue|di 加 a 和 -lect，开头和 dialogue 一样
      accent|the same words sounding different in a Scottish voice|a Texas way of pronouncing words|a London way of pronouncing words picked up over years|accent is the way words are pronounced; a dialect also changes the words and grammar|accent 指读音；dialect 连用词和语法都不同|dialect changes the words and grammar too, not just the sound of the same words|dialect 连用词和语法都变了，不只是同样的词读起来不同|idiom is a phrase whose meaning differs from its words, not the way a person pronounces words|idiom 是整体意思不同于字面的短语，不是一个人发音的方式|ac · cent|double c: the first says /k/, the second /s/|双写 c：第一个读 /k/，第二个读 /s/
      slang|cool used informally to mean good|teenage words like lit that do not belong in an essay|new informal words invented by each generation of teenagers|slang is informal words of a group; jargon is special words of one job|slang 是某群体的非正式用语；jargon 是某行业的专门用语|jargon is the special words of one job, such as medicine, not casual words that teenagers invent|jargon 是医学等某一行业的专门用语，不是青少年自创的随意说法|idiom is a whole phrase whose meaning differs from its words, not a casual single word like cool or lit|idiom 是整体意思不同于字面的短语，不是 cool、lit 这样的随意单词|slang|sl blend + short a + -ng|sl 连缀、短 a 加 -ng
      jargon|doctors' medical words confusing to patients|engineers' words in a manual only experts understand|legal words a lawyer left out to be understood|jargon is the special words of one job; slang is informal words of a group such as teenagers|jargon 是某行业的专门用语；slang 是青少年等群体的非正式用语|slang is casual words of a group such as teenagers, not the special words of doctors, engineers or lawyers|slang 是青少年等群体的随意用语，不是医生、工程师或律师的专业术语|dialect is the speech of one region, not the special words of one job|dialect 是某一地区的语言，不是某一行业的专门用语|jar · gon|jar + -gon, ending -gon, not -gun|jar 加 -gon，结尾是 -gon 不是 -gun
      idiom|under the weather meaning ill, which makes no sense word by word|raining cats and dogs meaning heavy rain|spill the beans meaning tell a secret|idiom is a phrase whose meaning differs from its words; slang is informal words of a group|idiom 是整体意思不同于字面的短语；slang 是群体的非正式用语|slang is casual words used by a group, not a fixed phrase whose real meaning is different from its separate words|slang 是群体的随意用语，不是整体意思与字面不同的固定短语|vocabulary is all the words a person knows, not one phrase with a hidden meaning|vocabulary 是一个人掌握的全部词汇，不是一个有隐含意思的短语|id · i · om|id + i + -om, ending -om, not -um|id 加 i 和 -om，结尾是 -om 不是 -um
      fluent|someone with one language who never stops to search for a word|English that became smooth after two years of practice|quick, smooth spoken Chinese from a slow reader|fluent means able to speak a language easily; bilingual means able to speak two languages|fluent 指说得流利；bilingual 指会说两种语言|bilingual means able to speak two languages, not speaking one language smoothly without stopping|bilingual 指会说两种语言，不是把一种语言说得顺畅不停顿|literate means able to read and write, not speaking smoothly and quickly|literate 指能读会写，不是说话流畅快速|flu · ent|flu + -ent, with u saying /oo/|flu 加 -ent，u 读 /uː/
      bilingual|a sign written in both English and Spanish|classes taught half in English and half in Chinese|a dictionary with English on the left and Chinese on the right|bilingual means using two languages; fluent means speaking one language smoothly|bilingual 指使用两种语言；fluent 指说得流利|fluent describes a person who speaks smoothly, not a sign, class or dictionary that uses two languages|fluent 形容说话流利的人，不能形容使用两种语言的标牌、课程或词典|literate means able to read and write, not using two languages side by side|literate 指能读会写，不是两种语言并用|bi · lin · gual|bi- (two) + lingu (tongue) + -al|bi-（二）加 lingu（舌头、语言）再加 -al
      pronunciation|colonel sounding like kernel|practicing th until three is said perfectly|the correct way to say February|pronunciation is how one word is said; an accent is how a whole group of people sounds|pronunciation 是一个词的读法；accent 是一群人的口音|accent is the way people from one place sound in general, not the correct way to say one particular word|accent 是某地人整体的口音，不是某个词的正确读法|vocabulary is all the words a person knows, not how one word is said|vocabulary 是一个人掌握的全部词汇，不是一个词的读法|pro · nun · ci · a · tion|-nun-, not -noun-, even though the verb is pronounce|中间是 -nun- 不是 -noun-，虽然动词是 pronounce
      vocabulary|the words a reader builds up|the new words of a unit listed with their meanings|so many known words for a six-year-old|vocabulary is all the words a person knows; pronunciation is how a word is said|vocabulary 是掌握的全部词汇；pronunciation 是一个词的读法|pronunciation is the way a word is said, not the number of words a person knows or learns|pronunciation 是词的读法，不是一个人知道或要学的词有多少|jargon is the special words of one job, not all the words a reader or child knows|jargon 是某一行业的专门用语，不是读者或孩子掌握的全部词汇|vo · cab · u · lar · y|vocab + -ulary, ending -ary, not -ery|vocab 加 -ulary，结尾是 -ary 不是 -ery
      translate|changing a letter into English|changing a book into thirty languages|changing a guide's Chinese into English for visitors|translate means change words into another language; decipher means work out something hard to read|translate 指译成另一种语言；decipher 指破解难认的文字|decipher means work out the meaning of something hard to read, not turn words from one language into another|decipher 指弄懂难认的文字，不是把一种语言换成另一种语言|evolve means change slowly over a long time, not change words into another language for someone|evolve 指长期慢慢演变，不是替人把话译成另一种语言|trans · late|trans- (across) + late|trans-（跨越）加 late
    `,
  },
);

const time = batch(
  "words-of-time-and-change",
  ["Words of Time and Change", "时间与变化的词"],
  ["time and change", "时间与变化"],
  `
  obsolete|no longer used because something newer exists|过时的，淘汰的|Typewriters became ___ when computers arrived, and offices stopped using them.|This map is ___ because the roads have changed.|Many old words like "thee" are now ___, and nobody uses them anymore.|temporary,contemporary
  evolve|to change and develop slowly over time|逐渐演变，进化|Languages ___ as people invent new words.|Over millions of years, land animals slowly changed and began to ___ into whales.|The small shop began to ___ into a big company.|inherit,circulate|evolved,evolves,evolution
  permanent|lasting forever or for a very long time|永久的|The ink is ___ and will not wash out.|After years of short summer jobs, she finally got a ___ job she could keep for life.|The scar on his arm is ___; it will never fade.|temporary,obsolete
  temporary|lasting only a short time|暂时的|The school is in a ___ building while the new one is built.|The pain was only ___ and was gone by the next morning.|She found a ___ job for the summer.|permanent,contemporary
  epoch|a long period of history marked by special events|时代，纪元|The invention of printing began a new ___ in the history of books.|Dinosaurs lived in a distant ___, millions of years before people.|The moon landing marked the start of a new ___ of space travel.|millennium,antique|epochs
  prehistoric|from the time before people wrote things down|史前的|Long before writing, ___ people painted animals on cave walls.|The museum has a ___ skeleton of a mammoth from long before writing.|Mammoths were ___ animals that died out long before people could write.|chronological,contemporary
  contemporary|belonging to the present time; also living at the same time|当代的；同时代的|The museum shows ___ art made by artists living today.|Shakespeare was a ___ of Queen Elizabeth.|She writes ___ songs about life in today's cities.|prehistoric,obsolete|contemporaries
  millennium|a period of a thousand years|千年|The year 2000 began a new ___, the next thousand years of the calendar.|The castle has stood for almost a ___, about a thousand years.|Ancient Rome lasted more than a ___, over a thousand years in all.|epoch,antique|millennia
  chronological|arranged in the order that things happened|按时间顺序的|Put the events of the story in ___ order.|The museum displays tools in ___ order, from the oldest to the newest.|Her diary is a ___ record of the trip, written day by day in order.|prehistoric,permanent
  antique|old and valuable|古董（的）|Grandma's ___ clock from 1850 is worth a lot of money and still works.|The shop sells old, valuable ___ furniture.|That carved chair from 1790 is a real ___.|obsolete,contemporary|antiques
  `,
  "context-clues",
  {
    intro: t(
      "In the museum, a **prehistoric** spearhead sits beside an **antique** clock and a **contemporary** painting, all set out in **chronological** order. These ten words help you talk about time, the past, and how things change.",
      "博物馆里，一枚史前的（**prehistoric**）矛头旁边放着一座古董（**antique**）钟和一幅当代的（**contemporary**）画，全都按时间顺序（**chronological**）陈列。这十个词帮你谈论时间、过去以及事物的变化。",
    ),
    watchOut: {
      meanings: t(
        "Tell **antique** (old and *valuable*, still prized) apart from **obsolete** (no longer *used* because something newer has replaced it).",
        "分清 **antique**（年代久远而珍贵，仍受珍视）和 **obsolete**（已被新东西取代、不再使用）。",
      ),
      use: t(
        "Tell **epoch** (a long period marked by special events, of any length) apart from **millennium** (exactly a thousand years).",
        "分清 **epoch**（以重大事件为标志的长时期，长短不定）和 **millennium**（正好一千年）。",
      ),
      spelling: t(
        "Watch **millennium** (double *l* and double *n*), **chronological** (*chr-* with a silent *h*), and **epoch** (*ch* says /k/).",
        "注意 **millennium** 的双写 **l** 和双写 **n**、**chronological** 开头 **chr-** 中不发音的 **h**，以及 **epoch** 中读 /k/ 的 **ch**。",
      ),
    },
    notes: `
      obsolete|typewriters no longer used after computers arrived|a map out of date because roads changed|old words like thee that nobody uses anymore|obsolete means no longer used because something newer exists; antique means old and valuable|obsolete 指被淘汰不再使用的；antique 指古老珍贵的|temporary means lasting only a short time, not replaced and no longer used|temporary 指只持续短时间，不是被取代、不再使用|contemporary means belonging to the present time, the opposite of replaced and no longer used|contemporary 指属于当今时代，和被淘汰不再使用正相反|ob · so · lete|ob- + so + -lete, ending in silent e|ob- 加 so 和 -lete，词尾 e 不发音
      evolve|languages changing as new words are invented|land animals slowly changing into whales|a small shop growing into a big company|evolve means change and develop slowly over time; inherit means receive from parents|evolve 指慢慢演变发展；inherit 指从父母那里得到|inherit means receive traits or things from parents, not slowly change and develop into something new|inherit 指从父母那里得到性状或财物，不是慢慢演变成新的样子|circulate means move round through a system and back again, not develop into something new over time|circulate 指循环流动，不是随时间演变成新的东西|e · volve|e- + volve, ending in silent e|e- 加 volve，词尾 e 不发音
      permanent|ink that will not wash out|a job kept for life after years of short summer jobs|a scar that will never fade|permanent means lasting forever; temporary means lasting a short time|permanent 指永久的；temporary 指暂时的|temporary means lasting only a short time, the opposite of something that never fades or lasts for life|temporary 指只是暂时的，和永不褪去、终身保留正相反|obsolete means no longer used, not lasting forever|obsolete 指被淘汰不再使用，不是永久保持|per · ma · nent|per + ma + -nent, ending -ent, not -ant|per 加 ma 和 -nent，结尾是 -ent 不是 -ant
      temporary|a building used only while a new school is built|pain gone by the next morning|a job only for the summer|temporary means lasting only a short time; permanent means lasting forever|temporary 指暂时的；permanent 指永久的|permanent means lasting forever, the opposite of something used only for a summer or a few weeks|permanent 指永久的，和只用一个夏天或几周正相反|contemporary means belonging to the present time, not lasting only a short while|contemporary 指属于当今时代，不是只持续一小段时间|tem · po · rar · y|tempor + -ary, with -rar- in the middle|tempor 加 -ary，中间是 -rar-
      epoch|a new period in the history of books begun by printing|the distant age of the dinosaurs|a new period of space travel begun by the moon landing|epoch is a long period marked by special events; a millennium is exactly a thousand years|epoch 是以重大事件为标志的时代；millennium 正好是一千年|millennium is exactly a thousand years on the calendar, not a period of any length marked by an invention or event|millennium 是日历上正好一千年，不是由某项发明或事件开启、长短不定的时代|antique is an old, valuable object, not a period of time|antique 是古老珍贵的物品，不是一段时期|ep · och|ep + och, with ch saying /k/|ep 加 och，ch 读 /k/
      prehistoric|people before writing painting animals on cave walls|a mammoth skeleton from before writing|mammoths that died out before people could write|prehistoric means from before writing; chronological means in the order things happened|prehistoric 指有文字以前的；chronological 指按时间顺序的|chronological means arranged in the order things happened, not from the time before people wrote|chronological 指按时间顺序排列，不是有文字以前的|contemporary means belonging to the present time, the opposite of from before writing existed|contemporary 指属于当今，和文字出现以前正相反|pre · his · tor · ic|pre- (before) + historic|pre-（之前）加 historic
      contemporary|art made by artists living today|someone living at the same time as Queen Elizabeth|songs about life in today's cities|contemporary means of the present or of the same time; prehistoric means from before writing|contemporary 指当代的或同时代的；prehistoric 指史前的|prehistoric means from the time before people wrote, not of today or of the same time as someone|prehistoric 指有文字以前的，不是当今的，也不是和某人同时代的|obsolete means no longer used, not belonging to the present time|obsolete 指被淘汰不再使用，不是属于当今时代|con · tem · po · rar · y|con- + tempor + -ary|con- 加 tempor 和 -ary
      millennium|the next thousand years beginning in 2000|about a thousand years of a castle standing|over a thousand years of Ancient Rome|millennium is exactly a thousand years; an epoch is a period of any length marked by events|millennium 正好是一千年；epoch 是长短不定的时代|epoch is a long period marked by special events, not a period of exactly a thousand years|epoch 是以重大事件为标志的长时期，不是正好一千年|antique is an old, valuable object, not a length of time|antique 是古老珍贵的物品，不是一段时间|mil · len · ni · um|double l and double n, then -ium|双写 l 和双写 n，再加 -ium
      chronological|story events put in the order they happened|tools displayed from oldest to newest|a diary written day by day in order|chronological means in the order things happened; prehistoric means from before writing|chronological 指按时间顺序的；prehistoric 指史前的|prehistoric means from before writing, not arranged from first to last|prehistoric 指有文字以前的，不是从先到后排列|permanent means lasting forever, not arranged in time order|permanent 指永久的，不是按时间顺序排列|chron · o · log · i · cal|chr- with a silent h + -ological|chr- 中 h 不发音，再加 -ological
      antique|a valuable clock from 1850 that still works|old, valuable furniture in a shop|a carved chair from 1790|antique means old and valuable; obsolete means no longer used|antique 指古老珍贵的；obsolete 指被淘汰的|obsolete means no longer used because something newer exists, not old and worth a lot of money|obsolete 指被新东西取代、不再使用，不是古老而值钱|contemporary means belonging to the present time, the opposite of old and valuable from long ago|contemporary 指属于当今，和古老珍贵正相反|an · tique|an + -tique, with -ique saying /eek/|an 加 -tique，-ique 读 /iːk/
    `,
  },
);

/** batchesB are the batches of the last five units of grade 6. */
export const batchesB: readonly BatchSpec[] = [
  cell,
  life,
  heredity,
  memory,
  friends,
  fear,
  nutrition,
  farming,
  plenty,
  competition,
  rules,
  training,
  named,
  language,
  time,
];
