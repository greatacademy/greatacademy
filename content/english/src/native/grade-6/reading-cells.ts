// Grade 6: the reading unit of the sixth theme, cells and what they do, from the first look through a microscope
// to the traits a family shares.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grade-5/reading-kit.ts";

const cellWords = { topic: "words-of-the-cell", weight: 0.3 } as const;
const lifeWords = { topic: "words-of-life-processes", weight: 0.3 } as const;
const heredityWords = { topic: "words-of-heredity", weight: 0.3 } as const;
const supported = { topic: "supported-and-unsupported-claims", weight: 0.2 } as const;
const technical = { topic: "technical-words-in-context", weight: 0.2 } as const;
const academic1 = { topic: "academic-words-1", weight: 0.1 } as const;
const academic2 = { topic: "academic-words-2", weight: 0.1 } as const;

/** insideLivingThings is a reading unit of grade 6 on cells, the processes of life and heredity. */
export const insideLivingThings: ReadingUnitDef = {
  id: "inside-living-things",
  title: t("Inside Living Things", "生物的内部"),
  passages: [
    passage(
      "the-smallest-unit-of-life",
      t("The Smallest Unit of Life", "生命的最小单位"),
      `In 1665, an English scientist named Robert Hooke placed a thin slice of cork under his microscope. What he saw surprised him. The cork was made of thousands of tiny empty boxes, packed together like the rooms of a honeycomb. They reminded him of the small rooms in which monks lived, which were called cells. So Hooke gave the boxes the same name. He did not know it, but he had seen the remains of the building blocks of all life.

Over the next two hundred years, scientists looked at many other living things through better and better microscopes. Leaves, skin, blood, roots and pond water all turned out to be made of cells. In the 1830s, two German scientists, Matthias Schleiden and Theodor Schwann, put the evidence together. Schleiden studied plants and Schwann studied animals, and both found cells everywhere they looked. Later, a doctor named Rudolf Virchow showed that new cells come only from cells that already exist.

Their work became known as the cell theory. It has three parts. All living things are made of one or more cells. The cell is the smallest unit that can carry out the processes of life. And all cells come from other cells.

Some living things, such as bacteria, are unicellular, made of only a single cell. Others are multicellular. Your own body contains about thirty trillion cells, of more than two hundred different kinds. Yet each of them, like the empty boxes Hooke saw in his cork, is a tiny living unit of its own.`,
      [cellWords, supported, academic1, academic2],
      [
        ask(
          t("Why did Hooke call the boxes cells?", "胡克为什么把这些小格子叫作 cells？"),
          t("They reminded him of the small rooms in which monks lived", "它们让他想起修道士居住的小房间"),
          [
            t("They looked like the cells of a battery", "它们看起来像电池的电芯"),
            t("He named them after a German scientist", "他以一位德国科学家的名字命名"),
            t("They were full of living bacteria", "它们里面满是活细菌"),
          ],
          t(
            "The first paragraph says the boxes reminded him of the small rooms monks lived in, which were called cells, so he gave them the same name.",
            "第一段说，这些小格子让他想起修道士住的小房间，那些房间叫作 cells，所以他用了同样的名字。",
          ),
        ),
        ask(
          t(
            "What evidence supported the claim that all living things are made of cells?",
            "什么证据支持了“所有生物都由细胞构成”这一观点？",
          ),
          t("Scientists found cells in every plant and animal they studied", "科学家在他们研究的每一种植物和动物中都发现了细胞"),
          [
            t("Hooke said so after looking at cork", "胡克看过软木后这样说"),
            t("Monks had lived in small cells for centuries", "修道士几百年来都住在小房间里"),
            t("The human body has thirty trillion cells", "人体有三十万亿个细胞"),
          ],
          t(
            "The second paragraph says leaves, skin, blood, roots and pond water all turned out to be made of cells, and Schleiden and Schwann found cells everywhere they looked.",
            "第二段说，叶子、皮肤、血液、根和池塘水都被发现是由细胞构成的，施莱登和施旺在所观察的一切中都发现了细胞。",
          ),
        ),
        ask(
          t("What does unicellular mean?", "unicellular 是什么意思？"),
          t("Made of only a single cell", "只由一个细胞构成"),
          [
            t("Made of thirty trillion cells", "由三十万亿个细胞构成"),
            t("Having no cells at all", "完全没有细胞"),
            t("Found only in plants", "只存在于植物中"),
          ],
          t(
            "The last paragraph defines it right after the word: made of only a single cell, like bacteria.",
            "最后一段在这个词后面紧接着给出了定义：只由一个细胞构成，比如细菌。",
          ),
        ),
      ],
      ["Robert", "Hooke", "Matthias", "Schleiden", "Theodor", "Schwann", "Rudolf", "Virchow", "English"],
    ),
    passage(
      "a-look-inside-a-cell",
      t("A Look Inside a Cell", "细胞内部一瞥"),
      `A cell may be too small to see without a microscope, but it is not a simple bag of liquid. Inside, it is as busy as a city, with different parts doing different jobs. These parts are called organelles, which means "little organs," because each one does a job for the cell the way your heart or lungs do a job for your body.

Every cell is wrapped in a cell membrane, a thin, flexible layer that works like a security guard. It lets food, water and oxygen in and lets waste out, but it keeps harmful things away. Inside the membrane is the cytoplasm, a jelly-like fluid in which the organelles float.

In plant and animal cells, the largest organelle is usually the nucleus. It is the control center of the cell. It holds the cell's DNA, the set of instructions that tells the cell what to make and when to divide. Without its nucleus, a cell could not grow or make new cells.

Scattered through the cytoplasm are many small organelles called mitochondria. They are often called the power stations of the cell, because they turn food into energy the cell can use. Cells that work hard, such as muscle cells, can contain thousands of them.

Other organelles have jobs of their own. Ribosomes build proteins, the materials the cell uses to grow and repair itself. Vacuoles store water, food and waste. Each organelle has its own structure suited to its job. Like the workers in a city, they depend on one another, and if one fails, the whole cell suffers.`,
      [cellWords, technical],
      [
        ask(
          t("Why are the parts of a cell called organelles?", "为什么细胞的各个部分叫作 organelles？"),
          t("Each does a job for the cell the way an organ does for the body", "每个部分为细胞做一项工作，就像器官为身体工作一样"),
          [
            t("They were discovered by a scientist named Organ", "它们是一个叫 Organ 的科学家发现的"),
            t("They are larger than the organs of the body", "它们比身体的器官还大"),
            t("They float outside the cell membrane", "它们漂浮在细胞膜外面"),
          ],
          t(
            "The first paragraph says organelles means little organs, because each one does a job for the cell the way your heart or lungs do for your body.",
            "第一段说 organelles 意为小器官，因为每一个都像心脏或肺为身体工作那样为细胞工作。",
          ),
        ),
        ask(
          t("What is the job of the nucleus?", "细胞核的作用是什么？"),
          t("It holds the instructions that control what the cell makes and when it divides", "它保存着控制细胞制造什么、何时分裂的指令"),
          [
            t("It turns food into energy", "它把食物转化为能量"),
            t("It lets oxygen in and keeps harmful things out", "它让氧气进入，把有害物质挡在外面"),
            t("It stores water and waste", "它储存水和废物"),
          ],
          t(
            "The third paragraph calls the nucleus the control center, holding the DNA that tells the cell what to make and when to divide.",
            "第三段把细胞核称为控制中心，它保存着 DNA，告诉细胞制造什么、何时分裂。",
          ),
        ),
        ask(
          t("Why might muscle cells contain thousands of mitochondria?", "为什么肌肉细胞可能含有数千个线粒体？"),
          t("They work hard and need a lot of energy", "它们工作强度大，需要大量能量"),
          [
            t("They need to store a lot of water", "它们需要储存大量的水"),
            t("They have no nucleus", "它们没有细胞核"),
            t("They need to build a thick membrane", "它们需要构建很厚的膜"),
          ],
          t(
            "The fourth paragraph says mitochondria turn food into energy and that cells that work hard, such as muscle cells, can contain thousands.",
            "第四段说线粒体把食物转化为能量，而像肌肉细胞这样工作强度大的细胞可能含有数千个线粒体。",
          ),
        ),
      ],
      ["DNA"],
    ),
    passage(
      "plant-cells-and-animal-cells",
      t("Plant Cells and Animal Cells", "植物细胞和动物细胞"),
      `If you looked at a cell from an onion skin and a cell from the inside of your cheek under a microscope, you would see that they have a lot in common. Both have a cell membrane, cytoplasm and a nucleus. Both contain mitochondria to release energy and ribosomes to build proteins. But you would also notice some important differences.

The first difference is shape. Onion cells look like neat bricks in a wall, with straight edges and corners. Cheek cells are rounder and softer, and their shapes vary. The reason is that plant cells have a cell wall, a stiff layer outside the membrane made mostly of a material called cellulose. The wall gives the cell its shape and supports the whole plant. It is why a tree can stand tall without a skeleton. Animal cells have no cell wall, only a flexible membrane, which lets them take many shapes and allows animals to move and bend.

The second difference is green. Many plant cells, especially those in leaves, contain chloroplasts. These organelles hold a green substance called chlorophyll, which captures energy from sunlight so the plant can make its own food. Animals cannot do this, so their cells have no chloroplasts. They must get energy by eating.

The third difference is storage. Most plant cells have one large central vacuole, which can fill much of the cell. It stores water and pushes outward against the wall, helping the plant stay firm. When a plant is not watered, its vacuoles shrink and it wilts. Animal cells have smaller vacuoles, or none at all.`,
      [cellWords, technical],
      [
        ask(
          t("Why do onion cells have straight edges and corners?", "为什么洋葱细胞有平直的边和角？"),
          t("Plant cells have a stiff cell wall that gives them their shape", "植物细胞有坚硬的细胞壁，赋予它们形状"),
          [
            t("They are full of chloroplasts", "它们充满了叶绿体"),
            t("They have no nucleus", "它们没有细胞核"),
            t("They were cut with a knife", "它们是用刀切出来的"),
          ],
          t(
            "The second paragraph explains that plant cells have a cell wall, a stiff layer outside the membrane that gives the cell its shape.",
            "第二段解释说，植物细胞有细胞壁，那是膜外一层坚硬的结构，赋予细胞形状。",
          ),
        ),
        ask(
          t("Why do animal cells not need chloroplasts?", "为什么动物细胞不需要叶绿体？"),
          t("Animals get their energy by eating instead of from sunlight", "动物通过进食获取能量，而不是从阳光中获取"),
          [
            t("Animals live in places with no sunlight", "动物生活在没有阳光的地方"),
            t("Their cell walls are too thick", "它们的细胞壁太厚"),
            t("Their vacuoles make food instead", "它们的液泡会制造食物"),
          ],
          t(
            "The third paragraph says chloroplasts capture sunlight to make food, but animals cannot do this, so they must get energy by eating.",
            "第三段说，叶绿体捕获阳光来制造食物，而动物做不到这一点，所以必须通过进食获取能量。",
          ),
        ),
        ask(
          t("What happens to a plant's vacuoles when it is not watered?", "植物缺水时，它的液泡会怎样？"),
          t("They shrink, and the plant wilts", "它们会缩小，植物会枯萎"),
          [
            t("They turn green", "它们会变绿"),
            t("They grow into new cells", "它们会长成新细胞"),
            t("They build a new cell wall", "它们会建造新的细胞壁"),
          ],
          t(
            "The last paragraph says the vacuole stores water and keeps the plant firm, and when the plant is not watered its vacuoles shrink and it wilts.",
            "最后一段说，液泡储存水分，让植物保持挺立，植物缺水时液泡会缩小，植物就会枯萎。",
          ),
        ),
      ],
    ),
    passage(
      "living-on-light",
      t("Living on Light", "依靠阳光生活"),
      `About four hundred years ago, a Belgian scientist named Jan van Helmont wondered where a growing plant gets its material. Most people assumed that plants ate soil. To find out, van Helmont planted a small willow tree in a pot of carefully weighed soil. For five years, he gave it nothing but rainwater. At the end, the tree had gained about seventy-four kilograms, but the soil had lost only a few grams. The plant, he concluded, must have been made mostly from water.

He was partly right. Today we know that plants make their own food through a process called photosynthesis, a word that means "putting together with light." It takes place inside the chloroplasts of plant cells, mostly in the leaves.

For photosynthesis, a plant needs three things. It takes in water through its roots. It takes in carbon dioxide, a gas in the air, through tiny openings on the undersides of its leaves. And it captures energy from sunlight with the green chlorophyll in its chloroplasts. Using that energy, the plant joins the water and carbon dioxide together to make glucose, a kind of sugar that it uses for food and for building its body. Oxygen is released as a waste product.

So the material van Helmont's willow gained came not only from the water he gave it but also from the air around it. This is one of the most important processes on earth. Nearly every food chain begins with plants, and almost all of the oxygen we breathe was released by plants and other living things that use light to make their food.`,
      [lifeWords, supported, academic2],
      [
        ask(
          t("What evidence did van Helmont have that plants do not eat soil?", "范·海尔蒙特有什么证据证明植物不吃土？"),
          t("The tree gained about seventy-four kilograms, but the soil lost only a few grams", "树增重约七十四公斤，而土壤只少了几克"),
          [
            t("Most people believed that plants eat soil", "大多数人认为植物吃土"),
            t("The tree died after five years", "这棵树五年后死了"),
            t("He saw the chloroplasts in the leaves", "他看到了叶子里的叶绿体"),
          ],
          t(
            "The first paragraph gives his measurements: after five years the tree had gained about seventy-four kilograms while the soil had lost only a few grams.",
            "第一段给出了他的测量结果：五年后，树增重约七十四公斤，而土壤只少了几克。",
          ),
        ),
        ask(
          t("What three things does a plant need for photosynthesis?", "植物进行光合作用需要哪三样东西？"),
          t("Water, carbon dioxide and energy from sunlight", "水、二氧化碳和来自阳光的能量"),
          [
            t("Soil, oxygen and glucose", "土壤、氧气和葡萄糖"),
            t("Rainwater, sugar and darkness", "雨水、糖和黑暗"),
            t("Oxygen, roots and chlorophyll", "氧气、根和叶绿素"),
          ],
          t(
            "The third paragraph lists them: water through the roots, carbon dioxide through the leaves and energy from sunlight captured by chlorophyll.",
            "第三段列出了这三样：通过根吸收的水、通过叶子吸收的二氧化碳，以及叶绿素捕获的阳光能量。",
          ),
        ),
        ask(
          t("Why was van Helmont only partly right?", "为什么说范·海尔蒙特只对了一部分？"),
          t("The plant's material came from the air as well as from water", "植物的物质不仅来自水，也来自空气"),
          [
            t("The plant's material really came from the soil", "植物的物质其实来自土壤"),
            t("He weighed the tree incorrectly", "他称树的重量时出了错"),
            t("Willow trees do not use sunlight", "柳树不利用阳光"),
          ],
          t(
            "The last paragraph says the material came not only from the water he gave it but also from the air, as carbon dioxide.",
            "最后一段说，这些物质不仅来自他浇的水，也来自空气中的二氧化碳。",
          ),
        ),
      ],
      ["Belgian", "Jan", "van", "Helmont", "Helmont's"],
    ),
    passage(
      "how-cells-get-energy",
      t("How Cells Get Energy", "细胞怎样获得能量"),
      `Every moment of your life, even while you sleep, your cells are working. They pump substances in and out, build proteins, repair damage and divide. Your heart cells contract about a hundred thousand times a day. All of this takes energy, and that energy comes from the food you eat.

When you eat a sandwich, your digestive system breaks the food down into small molecules. One of the most important of these is glucose, the same sugar that plants make during photosynthesis. Glucose passes into your blood, and your blood vessels circulate it to every cell in your body. At the same time, your lungs take in oxygen, which the blood also carries to the cells.

Inside each cell, the mitochondria combine glucose with oxygen. This releases the energy stored in the glucose in a form the cell can use. The process is called cellular respiration. It also produces two waste products: carbon dioxide and water. Your blood carries the carbon dioxide back to your lungs, and you breathe it out.

Notice how neatly this fits with photosynthesis. Plants use carbon dioxide and water to make glucose and oxygen. Animals use glucose and oxygen and give back carbon dioxide and water. The two processes are like the two halves of a circle, and together they keep matter moving between living things.

All the chemical work that goes on inside your body, including respiration, is called your metabolism. When you exercise, your metabolism speeds up. You breathe faster and your heart beats harder, because your muscle cells need more oxygen and glucose to release the extra energy they are using.`,
      [lifeWords, technical, academic2],
      [
        ask(
          t("What is cellular respiration?", "细胞呼吸是什么？"),
          t("The process in which mitochondria combine glucose and oxygen to release energy", "线粒体把葡萄糖和氧结合起来释放能量的过程"),
          [
            t("The way your lungs take in air", "肺吸入空气的方式"),
            t("The way plants make glucose from light", "植物利用光制造葡萄糖的方式"),
            t("The breaking down of a sandwich in your stomach", "三明治在胃里被分解"),
          ],
          t(
            "The third paragraph describes the mitochondria combining glucose with oxygen to release energy and then says the process is called cellular respiration.",
            "第三段描述了线粒体把葡萄糖和氧结合以释放能量，然后说这个过程叫作细胞呼吸。",
          ),
        ),
        ask(
          t("Why does the passage compare the two processes to two halves of a circle?", "文章为什么把这两个过程比作一个圆的两半？"),
          t("Each process uses what the other one produces", "每个过程都使用另一个过程的产物"),
          [
            t("Both processes happen only in plants", "两个过程都只发生在植物中"),
            t("Both processes make oxygen", "两个过程都产生氧气"),
            t("Each process takes exactly half a day", "每个过程正好需要半天"),
          ],
          t(
            "The fourth paragraph shows that plants make glucose and oxygen from carbon dioxide and water, and animals turn glucose and oxygen back into carbon dioxide and water.",
            "第四段说明，植物用二氧化碳和水制造葡萄糖和氧气，动物则把葡萄糖和氧气变回二氧化碳和水。",
          ),
        ),
        ask(
          t("Why do you breathe faster when you exercise?", "为什么运动时呼吸会变快？"),
          t("Your muscle cells need more oxygen to release extra energy", "肌肉细胞需要更多氧气来释放额外的能量"),
          [
            t("Your body is trying to get rid of glucose", "身体在设法排出葡萄糖"),
            t("Your mitochondria stop working", "线粒体停止工作"),
            t("Your lungs make glucose", "肺在制造葡萄糖"),
          ],
          t(
            "The last paragraph says your muscle cells need more oxygen and glucose to release the extra energy they are using.",
            "最后一段说，肌肉细胞需要更多氧气和葡萄糖来释放它们所消耗的额外能量。",
          ),
        ),
      ],
    ),
    passage(
      "from-cells-to-systems",
      t("From Cells to Systems", "从细胞到系统"),
      `A single-celled living thing must do everything by itself. It must take in food, release energy, get rid of waste and make copies of itself, all inside one tiny cell. In a large multicellular body like yours, the work is shared. Cells become specialized, which means each kind has a special shape and job.

A nerve cell, for example, is long and thin, with branches at each end. Some nerve cells stretch from your spine all the way to your toes, more than a meter long. Their shape lets them carry signals quickly over long distances. A red blood cell is a small, flexible disc with no nucleus, which leaves more room for the substance that carries oxygen. A muscle cell is long and can contract, pulling on bones to move them.

Specialized cells do not work alone. Cells of the same kind group together to form a tissue. Muscle tissue, for instance, is made of many muscle cells working together. Different tissues then join to form an organ, a structure with a particular job. Your stomach is an organ made of muscle tissue that churns food, gland tissue that produces digestive juices and nerve tissue that controls it all.

Organs, in turn, work together in organ systems. The digestive system includes the mouth, stomach and intestines, which together break down food and absorb it. The circulatory system includes the heart and blood vessels. No system works alone either. The digestive system provides glucose, the respiratory system provides oxygen, and the circulatory system carries both to every cell, the place where the whole story began.`,
      [cellWords, lifeWords, supported],
      [
        ask(
          t("What does specialized mean in this passage?", "在这篇文章中，specialized 是什么意思？"),
          t("Having a special shape and job", "具有特定的形状和功能"),
          [
            t("Able to do every job alone", "能独自完成所有工作"),
            t("Made of only one cell", "只由一个细胞构成"),
            t("Joined together into a system", "组合成一个系统"),
          ],
          t(
            "The first paragraph defines it in the same sentence: each kind has a special shape and job.",
            "第一段在同一句中给出了定义：每一种都有特定的形状和功能。",
          ),
        ),
        ask(
          t("How does the passage support the claim that a cell's shape suits its job?", "文章怎样支持“细胞的形状适合其功能”这一观点？"),
          t(
            "It gives examples of nerve, blood and muscle cells and explains how their shapes help",
            "它举了神经细胞、血细胞和肌肉细胞的例子，并解释了它们的形状如何发挥作用",
          ),
          [
            t("It quotes a famous doctor", "它引用了一位名医的话"),
            t("It states the claim again in different words", "它换个说法把观点又说了一遍"),
            t("It gives the number of cells in the body", "它给出了人体细胞的数量"),
          ],
          t(
            "The second paragraph supports it with examples: the long nerve cell carries signals far, the red blood cell has room for oxygen, and the muscle cell can contract.",
            "第二段用例子支持了这一观点：长长的神经细胞把信号传得很远，红细胞有空间运载氧气，肌肉细胞能够收缩。",
          ),
        ),
        ask(
          t("Which list goes from the smallest level to the largest?", "哪一组是从最小层级到最大层级的？"),
          t("Cell, tissue, organ, organ system", "细胞、组织、器官、器官系统"),
          [
            t("Organ, cell, tissue, organ system", "器官、细胞、组织、器官系统"),
            t("Tissue, cell, organ system, organ", "组织、细胞、器官系统、器官"),
            t("Organ system, organ, cell, tissue", "器官系统、器官、细胞、组织"),
          ],
          t(
            "The passage builds up step by step: cells group into tissues, tissues join into organs, and organs work together in organ systems.",
            "文章一步步递进：细胞组成组织，组织组成器官，器官共同构成器官系统。",
          ),
        ),
      ],
    ),
    passage(
      "why-you-look-like-your-family",
      t("Why You Look Like Your Family", "为什么你长得像家人"),
      `Look at a family photograph, and you will probably see resemblances. A daughter may have her mother's curly hair, and a son his grandfather's nose. These features are called traits, and many of them are passed from parents to their offspring. The passing on of traits is called heredity.

For thousands of years, people knew that children resemble their parents, but no one understood how. The first clear answer came from an unexpected place: a monastery garden. In the 1850s and 1860s, a monk named Gregor Mendel grew and studied nearly thirty thousand pea plants. He chose peas because their traits were easy to see. Some plants were tall and some short; some had purple flowers and some white.

Mendel crossed tall plants with short ones. Surprisingly, all their offspring were tall. But when he crossed those tall offspring with each other, about one in four of the next generation was short. The trait for shortness had been hidden, not lost. Mendel concluded that each plant carries two "factors" for every trait, one from each parent. One factor can be dominant and hide the other, which is called recessive.

Today we call Mendel's factors genes. Genes are sections of DNA in the nucleus of every cell, and they carry the instructions for building traits. You inherit half your genes from your mother and half from your father, which is why you resemble both but are exactly like neither. Mendel's work was ignored for more than thirty years, but it is now seen as the beginning of the science of genetics.`,
      [heredityWords, supported],
      [
        ask(
          t("What is heredity?", "遗传（heredity）是什么？"),
          t("The passing on of traits from parents to offspring", "性状从父母传给后代"),
          [
            t("A kind of pea plant", "一种豌豆植物"),
            t("A family photograph", "一张家庭照片"),
            t("The study of monasteries", "对修道院的研究"),
          ],
          t(
            "The first paragraph ends by defining it: the passing on of traits is called heredity.",
            "第一段最后给出了定义：性状的传递叫作遗传。",
          ),
        ),
        ask(
          t(
            "What evidence showed Mendel that the trait for shortness was hidden, not lost?",
            "什么证据让孟德尔发现矮的性状是被隐藏了而不是消失了？",
          ),
          t("About one in four plants of the next generation was short", "下一代中约四分之一的植株是矮的"),
          [
            t("All the offspring of the first cross were tall", "第一次杂交的后代全都是高的"),
            t("He grew nearly thirty thousand plants", "他种了将近三万株植物"),
            t("Some plants had purple flowers", "有些植株开紫花"),
          ],
          t(
            "The third paragraph says that when the tall offspring were crossed with each other, about one in four of the next generation was short, so the trait had been hidden.",
            "第三段说，把高的后代彼此杂交后，下一代中约四分之一是矮的，所以这个性状只是被隐藏了。",
          ),
        ),
        ask(
          t("Why do you resemble both your parents but are exactly like neither?", "为什么你既像父母双方，又和谁都不完全一样？"),
          t("You inherit half your genes from each parent", "你从父母双方各继承一半基因"),
          [
            t("You inherit all your genes from one parent", "你的基因全部来自父母中的一方"),
            t("Genes change every year", "基因每年都会改变"),
            t("Traits are not passed on at all", "性状根本不会遗传"),
          ],
          t(
            "The last paragraph says you inherit half your genes from your mother and half from your father, which is why you resemble both but are exactly like neither.",
            "最后一段说，你一半基因来自母亲，一半来自父亲，所以你既像他们，又和谁都不完全一样。",
          ),
        ),
      ],
      ["Gregor", "Mendel", "Mendel's"],
    ),
    passage(
      "one-cell-many-lives",
      t("One Cell, Many Lives", "一个细胞，许多生命"),
      `Every person, every oak tree and every elephant begins life as a single cell. That cell divides into two, the two become four, and the four become eight. After about forty rounds of division, there are trillions of cells. Somehow, out of that one cell, a whole body grows, with bones, blood, skin and a brain. How can one cell produce so many different kinds?

The answer lies in the genes. Every cell in your body contains the same complete set of DNA instructions. But not every cell uses all of them. A cell in your eye switches on the genes for seeing light, while a cell in your stomach switches on the genes for making digestive juices. In this way, cells with the same instructions become specialized in different ways, like musicians reading different parts of the same score.

In the early days of growth, some cells have not yet chosen their job. These are called stem cells. A stem cell can divide again and again, and its daughter cells can become many different kinds of cells. Even in adults, some stem cells remain, for example in the bone marrow, where they make new blood cells every day.

Scientists are excited about stem cells because they might be able to replace damaged cells. Some doctors already use them to treat certain blood diseases, and many experiments are testing whether they could help repair hearts or nerves. Researchers say the work will take many years and must be done carefully. But it begins with a simple, astonishing fact: each of us was once a single cell.`,
      [cellWords, heredityWords, supported],
      [
        ask(
          t("How can cells with the same DNA become different kinds of cells?", "拥有相同 DNA 的细胞怎么会变成不同种类的细胞？"),
          t("Each kind switches on different genes from the same set", "每种细胞启用同一套基因中的不同部分"),
          [
            t("Each cell has a completely different set of DNA", "每个细胞的 DNA 完全不同"),
            t("Cells copy their jobs from nearby cells", "细胞从附近的细胞那里复制工作"),
            t("The cells lose their genes as they grow", "细胞在生长过程中失去了基因"),
          ],
          t(
            "The second paragraph says every cell has the same DNA but not every cell uses all of it; each switches on the genes for its own job.",
            "第二段说，每个细胞的 DNA 都相同，但并非每个细胞都用到全部；每个细胞都启用与自身工作相关的基因。",
          ),
        ),
        ask(
          t("What are stem cells?", "干细胞是什么？"),
          t("Cells that have not yet chosen their job and can become many kinds", "尚未确定功能、能够变成多种细胞的细胞"),
          [
            t("Cells found only in plant stems", "只存在于植物茎中的细胞"),
            t("Cells that have stopped dividing", "已经停止分裂的细胞"),
            t("Cells that switch on every gene at once", "同时启用所有基因的细胞"),
          ],
          t(
            "The third paragraph describes cells that have not yet chosen their job and says they are called stem cells, whose daughter cells can become many kinds.",
            "第三段描述了尚未确定功能的细胞，并说它们叫作干细胞，其子细胞可以变成多种细胞。",
          ),
        ),
        ask(
          t("Which claim in the last paragraph is supported by what doctors already do?", "最后一段中哪个观点有医生已经在做的事情作支持？"),
          t("Stem cells can help treat some blood diseases", "干细胞可以帮助治疗某些血液疾病"),
          [
            t("Stem cells will soon repair every damaged heart", "干细胞很快就能修复所有受损的心脏"),
            t("The work will be finished next year", "这项工作明年就能完成"),
            t("Stem cells are not worth studying", "干细胞不值得研究"),
          ],
          t(
            "The paragraph says some doctors already use stem cells to treat certain blood diseases; repairing hearts or nerves is still being tested.",
            "这一段说，一些医生已经用干细胞治疗某些血液疾病；修复心脏或神经还在试验中。",
          ),
        ),
      ],
      ["DNA"],
    ),
  ],
};
