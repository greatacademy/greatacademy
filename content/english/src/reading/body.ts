import type { ReadingUnitDef } from "@ga/content";
import { t } from "@ga/content";

import { academic2, clues } from "./topics.ts";

/** theHumanBody is a reading unit of grades 3 to 5 on the systems of the human body. */
export const theHumanBody: ReadingUnitDef = {
  id: "the-human-body",
  title: t("The Human Body", "人体"),
  passages: [
    {
      id: "made-of-cells",
      title: t("Made of Cells", "由细胞组成"),
      body: `Your body is built from tiny living parts called cells. They are so small that you need a microscope to see them. A single drop of blood holds millions of them, and your whole body has trillions.

Cells come in many shapes and sizes, and each kind has its own job. Skin cells are flat and fit together like tiles on a floor to cover and protect you. Nerve cells are long and thin, like wires, and carry messages. Muscle cells can pull together to make your body move.

Cells of the same kind work together in groups. A group of cells that does one kind of work is called a tissue. Muscle tissue moves, and nerve tissue carries messages.

Different tissues join to form organs. Your heart, lungs, stomach and brain are organs. Each organ has an important job.

Organs work together too, in teams called systems. In the passages that follow, you will meet some of these systems and learn how they keep you alive and healthy.`,
      topics: [clues],
      glossed: ["microscope", "tissue", "organs"],
      xp: 4,
      questions: [
        {
          prompt: t("What are cells?", "什么是细胞？"),
          right: t("Tiny living parts that the body is built from", "构成身体的微小的生命单位"),
          wrong: [
            t("Large organs such as the heart", "像心脏那样的大器官"),
            t("Tools for seeing small things", "看小东西的工具"),
            t("Drops of blood", "血滴"),
          ],
          solution: t(
            "The first paragraph says your body is built from tiny living parts called cells.",
            "第一段说你的身体由叫作细胞的微小生命单位构成。",
          ),
        },
        {
          prompt: t("Why are skin cells compared to tiles on a floor?", "为什么把皮肤细胞比作地板上的瓷砖？"),
          right: t("They are flat and fit together to cover the body", "它们扁平并紧密拼在一起覆盖身体"),
          wrong: [
            t("They are hard and shiny", "它们又硬又亮"),
            t("They carry messages", "它们传递信息"),
            t("They make the body move", "它们让身体活动"),
          ],
          solution: t(
            "The second paragraph says skin cells are flat and fit together like tiles to cover and protect you.",
            "第二段说皮肤细胞扁平，像瓷砖一样拼在一起，覆盖并保护你。",
          ),
        },
        {
          prompt: t("Which list goes from smallest to largest?", "哪一项是从小到大排列的？"),
          right: t("Cells, tissues, organs, systems", "细胞、组织、器官、系统"),
          wrong: [
            t("Organs, cells, systems, tissues", "器官、细胞、系统、组织"),
            t("Systems, organs, tissues, cells", "系统、器官、组织、细胞"),
            t("Tissues, cells, organs, systems", "组织、细胞、器官、系统"),
          ],
          solution: t(
            "The passage builds up in order: cells form tissues, tissues form organs, and organs work together in systems.",
            "文章按顺序说明：细胞组成组织，组织组成器官，器官协同组成系统。",
          ),
        },
      ],
    },
    {
      id: "bones",
      title: t("Your Skeleton", "你的骨骼"),
      body: `Without bones, your body would flop onto the floor like a sock. Your bones form a frame called the skeleton. It holds you up and gives your body its shape.

An adult has 206 bones. A newborn baby has more, close to 300, but as the baby grows, some of them join together.

Bones have other jobs besides holding you up. They protect the soft organs inside you. Your skull is a hard case around your brain. Your ribs form a cage around your heart and lungs.

Bones may seem hard and dead, but they are alive. They grow as you grow, and a broken bone can heal itself. Inside many bones is a soft material called marrow, which makes new blood cells every day.

The places where two bones meet are called joints. Some joints, like the one in your knee, bend back and forth like the hinge of a door. Others, like the joint in your shoulder, let you swing your arm in a full circle.

To keep your bones strong, eat foods with calcium, such as milk, cheese and leafy greens, and stay active.`,
      topics: [clues],
      glossed: ["skeleton", "skull", "marrow", "joints", "calcium"],
      xp: 4,
      questions: [
        {
          prompt: t("Why does a newborn baby have more bones than an adult?", "为什么新生儿的骨头比成年人多？"),
          right: t("Some of the baby's bones join together as it grows", "婴儿长大时有些骨头会长在一起"),
          wrong: [
            t("Adults lose bones when they break", "成年人骨折时会失去骨头"),
            t("Babies grow new bones every day", "婴儿每天都长出新骨头"),
            t("Adults have no skull", "成年人没有头骨"),
          ],
          solution: t(
            "The second paragraph says that as the baby grows, some of its bones join together.",
            "第二段说婴儿长大时，有些骨头会长在一起。",
          ),
        },
        {
          prompt: t("What does marrow do?", "骨髓起什么作用？"),
          right: t("It makes new blood cells", "它制造新的血细胞"),
          wrong: [
            t("It protects the brain", "它保护大脑"),
            t("It bends like a hinge", "它像铰链一样弯曲"),
            t("It holds the bones together", "它把骨头连在一起"),
          ],
          solution: t("The fourth paragraph says marrow makes new blood cells every day.", "第四段说骨髓每天制造新的血细胞。"),
        },
        {
          prompt: t("Which joint works most like the hinge of a door?", "哪个关节最像门的铰链？"),
          right: t("The knee", "膝盖"),
          wrong: [t("The shoulder", "肩膀"), t("The skull", "头骨"), t("The ribs", "肋骨")],
          solution: t(
            "The fifth paragraph says the knee bends back and forth like the hinge of a door.",
            "第五段说膝盖像门的铰链一样来回弯曲。",
          ),
        },
      ],
    },
    {
      id: "muscles",
      title: t("Muscles Make You Move", "肌肉让你活动"),
      body: `Every move you make, from a jump to a blink, is made by muscles. You have more than six hundred of them.

Muscles can only pull. They cannot push. So muscles that move bones work in pairs. Bend your arm and feel the muscle on the front of your upper arm. It tightens and pulls your lower arm up. To straighten your arm, the muscle on the back of your upper arm pulls the other way. One muscle of the pair pulls while the other relaxes.

Muscles are joined to bones by strong cords called tendons. You can feel one at the back of your ankle, just above your heel.

Some muscles work without your having to think about them. Your heart is a muscle that beats about one hundred thousand times a day, even while you sleep. Muscles in your stomach squeeze to mix your food.

Muscles grow stronger when you use them. Running, climbing, swimming and playing all give your muscles the exercise they need.`,
      topics: [clues],
      glossed: ["tendons"],
      xp: 4,
      questions: [
        {
          prompt: t("Why do muscles that move bones work in pairs?", "为什么带动骨头的肌肉要成对工作？"),
          right: t("Muscles can only pull, so a second muscle pulls the other way", "肌肉只能拉，所以要另一块肌肉往反方向拉"),
          wrong: [
            t("One muscle is always asleep", "总有一块肌肉在睡觉"),
            t("Muscles can only push", "肌肉只能推"),
            t("Each bone needs two tendons", "每块骨头需要两条肌腱"),
          ],
          solution: t(
            "The second paragraph says muscles can only pull, so one of the pair pulls while the other relaxes.",
            "第二段说肌肉只能拉，所以一对肌肉中一块拉，另一块放松。",
          ),
        },
        {
          prompt: t("What are tendons?", "什么是肌腱？"),
          right: t("Strong cords that join muscles to bones", "把肌肉连到骨头上的结实的索带"),
          wrong: [
            t("Muscles in the stomach", "胃里的肌肉"),
            t("Bones in the ankle", "脚踝里的骨头"),
            t("Places where bones meet", "骨头相接的地方"),
          ],
          solution: t(
            "The third paragraph says muscles are joined to bones by strong cords called tendons.",
            "第三段说肌肉通过叫作肌腱的结实索带连到骨头上。",
          ),
        },
        {
          prompt: t("Which muscle works without your having to think about it?", "哪块肌肉不用你去想就会工作？"),
          right: t("The heart", "心脏"),
          wrong: [
            t("The muscle that bends your arm", "让手臂弯曲的肌肉"),
            t("The muscles you use to jump", "跳跃时用的肌肉"),
            t("The muscles you use to climb", "攀爬时用的肌肉"),
          ],
          solution: t(
            "The fourth paragraph says the heart is a muscle that beats even while you sleep.",
            "第四段说心脏是一块即使在你睡觉时也在跳动的肌肉。",
          ),
        },
      ],
    },
    {
      id: "the-heart-and-blood",
      title: t("The Heart and Blood", "心脏和血液"),
      body: `Make a fist. Your heart is about that size. It sits in your chest, a little to the left, protected by your ribs. It is a strong muscle that works as a pump.

With every beat, the heart squeezes and pushes blood out through tubes called blood vessels. The vessels that carry blood away from the heart are arteries. They branch into smaller and smaller tubes, some thinner than a hair, that reach every cell in your body. Other vessels, called veins, bring the blood back to the heart. Then the trip begins again.

Blood is a delivery service. It carries oxygen from your lungs and food from your stomach to every cell. On the way back, it picks up wastes that the cells do not need and carries them away.

You can feel your heart working. Press two fingers gently on the inside of your wrist. Each little throb you feel, called your pulse, is a beat of your heart. Count the throbs for a minute, then run in place and count again. Your heart beats faster when your body needs more oxygen.`,
      topics: [clues],
      glossed: ["vessels", "arteries", "veins", "pulse"],
      xp: 4,
      questions: [
        {
          prompt: t("What is the difference between arteries and veins?", "动脉和静脉有什么不同？"),
          right: t("Arteries carry blood away from the heart; veins bring it back", "动脉把血液运离心脏，静脉把血液运回心脏"),
          wrong: [
            t("Arteries are in the arms; veins are in the legs", "动脉在手臂上，静脉在腿上"),
            t("Veins carry blood away from the heart; arteries bring it back", "静脉把血液运离心脏，动脉把血液运回心脏"),
            t("Arteries carry food; veins carry water", "动脉运送食物，静脉运送水"),
          ],
          solution: t(
            "The second paragraph says arteries carry blood away from the heart and veins bring it back.",
            "第二段说动脉把血液运离心脏，静脉把血液运回心脏。",
          ),
        },
        {
          prompt: t("Why does the writer call blood a delivery service?", "作者为什么把血液称为送货服务？"),
          right: t("It carries oxygen and food to cells and takes wastes away", "它把氧气和食物送到细胞，并把废物运走"),
          wrong: [
            t("It brings mail to your house", "它把信件送到你家"),
            t("It moves only in one direction", "它只朝一个方向流动"),
            t("It makes the heart beat", "它让心脏跳动"),
          ],
          solution: t(
            "The third paragraph says blood carries oxygen and food to every cell and picks up wastes on the way back.",
            "第三段说血液把氧气和食物送到每个细胞，回程时带走废物。",
          ),
        },
        {
          prompt: t("Why does your heart beat faster after running?", "跑步后心跳为什么会加快？"),
          right: t("Your body needs more oxygen", "你的身体需要更多氧气"),
          wrong: [
            t("Your ribs press on it", "肋骨压着它"),
            t("Your blood gets heavier", "血液变重了"),
            t("Your wrist stops the pulse", "手腕阻止了脉搏"),
          ],
          solution: t(
            "The last sentence says your heart beats faster when your body needs more oxygen.",
            "最后一句说身体需要更多氧气时，心跳会加快。",
          ),
        },
      ],
    },
    {
      id: "breathing",
      title: t("Every Breath You Take", "每一次呼吸"),
      body: `Take a deep breath. You just pulled air into your lungs, two spongy organs inside your chest. You breathe about twenty thousand times a day, usually without thinking about it.

Air enters through your nose or mouth and travels down a tube in your throat called the windpipe. The windpipe splits into two branches, one for each lung. Inside the lungs, the branches divide again and again, like the branches of an upside-down tree. They end in millions of tiny air sacs, each like a little balloon.

The air sacs are wrapped in the thinnest blood vessels. There, oxygen from the air passes into the blood, and the blood carries it to every cell. At the same time, carbon dioxide, a waste gas that cells make, passes from the blood into the air sacs. When you breathe out, you get rid of it.

A large, flat muscle under your lungs, called the diaphragm, does most of the work. When it tightens and moves down, air rushes in. When it relaxes and moves up, air is pushed out.

Exercise makes your lungs work harder, and that helps keep them strong.`,
      topics: [clues],
      glossed: ["windpipe", "sacs", "diaphragm"],
      xp: 4,
      questions: [
        {
          prompt: t("What happens in the tiny air sacs?", "在微小的肺泡里发生了什么？"),
          right: t("Oxygen passes into the blood, and carbon dioxide passes out", "氧气进入血液，二氧化碳排出"),
          wrong: [
            t("Food is turned into energy", "食物转变成能量"),
            t("New bones are made", "制造新的骨头"),
            t("Blood is pumped to the heart", "血液被泵到心脏"),
          ],
          solution: t(
            "The third paragraph says oxygen passes into the blood and carbon dioxide passes into the air sacs.",
            "第三段说氧气进入血液，二氧化碳进入肺泡。",
          ),
        },
        {
          prompt: t("Why does the writer compare the inside of the lungs to an upside-down tree?", "作者为什么把肺的内部比作倒立的树？"),
          right: t("The tubes branch again and again", "管道一次次地分支"),
          wrong: [
            t("The lungs are made of wood", "肺是木头做的"),
            t("The lungs grow leaves", "肺会长叶子"),
            t("The lungs are green", "肺是绿色的"),
          ],
          solution: t(
            "The second paragraph says the branches divide again and again, like the branches of an upside-down tree.",
            "第二段说这些分支一次次地分开，就像倒立的树的树枝。",
          ),
        },
        {
          prompt: t("What does the diaphragm do?", "膈肌起什么作用？"),
          right: t("It moves down and up to pull air in and push it out", "它向下和向上移动，把空气吸进来又推出去"),
          wrong: [
            t("It cleans the air in the nose", "它清洁鼻子里的空气"),
            t("It carries oxygen to the cells", "它把氧气运到细胞"),
            t("It splits the windpipe in two", "它把气管分成两支"),
          ],
          solution: t(
            "The fourth paragraph says when the diaphragm moves down air rushes in, and when it moves up air is pushed out.",
            "第四段说膈肌向下时空气涌入，向上时空气被推出。",
          ),
        },
      ],
    },
    {
      id: "digestion",
      title: t("The Journey of Your Food", "食物的旅程"),
      body: `Your body cannot use a sandwich as it is. The food must be broken down into tiny pieces small enough to pass into your blood. This process is called digestion, and it takes about a day from start to finish.

Digestion starts in your mouth. Your teeth chop and grind the food, and saliva makes it wet and soft and begins to break it down. When you swallow, a tube called the esophagus carries the food down to your stomach.

The stomach is a stretchy bag of muscle. It squeezes and churns the food and mixes it with strong juices, turning it into a thick soup.

Next, the food moves into the small intestine. It is not small at all: it is a coiled tube about as long as a school bus. Here, most of the food is finally broken down, and the useful parts pass through its walls into the blood.

What is left moves into the large intestine, where water is taken back into the body. The waste that remains leaves the body when you use the toilet.`,
      topics: [clues, academic2],
      glossed: ["digestion", "saliva", "esophagus", "intestine"],
      xp: 5,
      questions: [
        {
          prompt: t("Why must food be broken down?", "食物为什么必须被分解？"),
          right: t("So the pieces are small enough to pass into the blood", "使碎块小到能进入血液"),
          wrong: [
            t("So it tastes better", "让它更好吃"),
            t("So the stomach stays empty", "让胃保持空的"),
            t("So the teeth stay strong", "让牙齿保持坚固"),
          ],
          solution: t(
            "The first paragraph says food must be broken down into pieces small enough to pass into your blood.",
            "第一段说食物必须分解成小到能进入血液的碎块。",
          ),
        },
        {
          prompt: t("Where does most of the food get broken down and pass into the blood?", "大部分食物在哪里被分解并进入血液？"),
          right: t("In the small intestine", "在小肠里"),
          wrong: [t("In the mouth", "在嘴里"), t("In the esophagus", "在食道里"), t("In the large intestine", "在大肠里")],
          solution: t(
            "The fourth paragraph says that in the small intestine most of the food is broken down and the useful parts pass into the blood.",
            "第四段说大部分食物在小肠里被分解，有用的部分进入血液。",
          ),
        },
        {
          prompt: t("Which list follows food through the body in order?", "哪一项按顺序描述了食物在体内的路线？"),
          right: t("Mouth, esophagus, stomach, small intestine, large intestine", "口腔、食道、胃、小肠、大肠"),
          wrong: [
            t("Stomach, mouth, esophagus, large intestine, small intestine", "胃、口腔、食道、大肠、小肠"),
            t("Mouth, stomach, esophagus, large intestine, small intestine", "口腔、胃、食道、大肠、小肠"),
            t("Esophagus, mouth, small intestine, stomach, large intestine", "食道、口腔、小肠、胃、大肠"),
          ],
          solution: t(
            "The paragraphs follow the food in order from the mouth to the large intestine.",
            "各段按顺序讲述了食物从口腔到大肠的路线。",
          ),
        },
      ],
    },
    {
      id: "the-brain-and-nerves",
      title: t("The Brain in Charge", "大脑做主"),
      body: `Your brain is the control center of your body. It weighs about as much as a large bag of sugar, yet it handles everything you think, feel and do.

The brain sends and receives messages through nerves. Nerves are bundles of long nerve cells that run from your brain down your spinal cord, the thick cable of nerves inside your backbone, and out to every part of your body. Messages race along them faster than a speeding car.

Some messages come in. When you touch a hot pan, nerves in your skin send a message of pain to your brain. Other messages go out. Your brain sends a message to the muscles in your arm, telling them to pull your hand away.

Some messages are so urgent that the spinal cord answers them before the brain does. That is why you jerk your hand from a hot pan before you even feel the pain. This quick action is called a reflex.

Your brain also stores memories, solves problems and lets you learn, which you are doing right now as you read these words.`,
      topics: [clues],
      glossed: ["spinal", "reflex"],
      xp: 4,
      questions: [
        {
          prompt: t("What is the spinal cord?", "什么是脊髓？"),
          right: t("A thick cable of nerves inside the backbone", "脊柱里面的一束粗粗的神经"),
          wrong: [
            t("A bone in the arm", "手臂里的一块骨头"),
            t("A muscle that pulls the hand away", "把手拉开的肌肉"),
            t("A part of the skin", "皮肤的一部分"),
          ],
          solution: t(
            "The second paragraph explains the spinal cord as the thick cable of nerves inside your backbone.",
            "第二段解释说脊髓是脊柱里面的一束粗神经。",
          ),
        },
        {
          prompt: t("Why do you pull your hand from a hot pan before you feel the pain?", "为什么你在感到疼痛之前就把手从热锅上缩回来了？"),
          right: t("The spinal cord answers the urgent message before the brain does", "脊髓在大脑之前就对紧急信息作出了反应"),
          wrong: [
            t("The pan pushes your hand away", "热锅把你的手推开"),
            t("Your skin has no nerves", "你的皮肤没有神经"),
            t("Your brain is asleep", "你的大脑在睡觉"),
          ],
          solution: t(
            "The fourth paragraph says some messages are so urgent that the spinal cord answers them before the brain does.",
            "第四段说有些信息非常紧急，脊髓在大脑之前就作出反应。",
          ),
        },
        {
          prompt: t("What is a reflex?", "什么是反射？"),
          right: t("A quick action the body makes without waiting for the brain", "身体不等大脑就作出的快速动作"),
          wrong: [
            t("A memory stored in the brain", "储存在大脑里的记忆"),
            t("A message of pain", "疼痛的信息"),
            t("A kind of nerve cell", "一种神经细胞"),
          ],
          solution: t(
            "The fourth paragraph calls the quick action of jerking your hand away a reflex.",
            "第四段把迅速缩手这种快速动作称为反射。",
          ),
        },
      ],
    },
    {
      id: "the-senses",
      title: t("Five Senses", "五种感官"),
      body: `Everything you know about the world reaches your brain through your senses. You have five main ones: sight, hearing, smell, taste and touch.

Your eyes catch light. Light enters through the dark opening in the middle of each eye, called the pupil. At the back of the eye, special cells turn the light into nerve messages, and your brain turns those into the pictures you see.

Your ears catch sound. Sounds are tiny shakes in the air. They make your eardrum, a thin sheet of skin inside your ear, shake too. Small bones pass the shaking deeper into the ear, where it is turned into messages for the brain.

Your nose and tongue work as partners. The tongue can taste only a few kinds of flavor, such as sweet, salty, sour and bitter. Most of what you think of as taste is really smell. That is why food seems to have little flavor when you have a stuffy nose.

Your skin is your largest organ of touch. It can sense heat, cold, pressure and pain, and your fingertips are among the most sensitive places of all.`,
      topics: [clues],
      glossed: ["pupil", "eardrum"],
      xp: 4,
      questions: [
        {
          prompt: t("What turns light into nerve messages?", "什么把光变成神经信息？"),
          right: t("Special cells at the back of the eye", "眼睛后部的特殊细胞"),
          wrong: [t("The pupil", "瞳孔"), t("The eardrum", "鼓膜"), t("The fingertips", "指尖")],
          solution: t(
            "The second paragraph says special cells at the back of the eye turn the light into nerve messages.",
            "第二段说眼睛后部的特殊细胞把光变成神经信息。",
          ),
        },
        {
          prompt: t("Why does food seem to have little flavor when you have a stuffy nose?", "鼻塞时，食物为什么好像没什么味道？"),
          right: t("Most of what we call taste is really smell", "我们所说的味道大部分其实是气味"),
          wrong: [
            t("The tongue stops working", "舌头停止工作"),
            t("The food changes its flavor", "食物改变了味道"),
            t("The ears cannot hear the food", "耳朵听不到食物"),
          ],
          solution: t(
            "The fourth paragraph says most of what you think of as taste is really smell.",
            "第四段说你以为的味道大部分其实是气味。",
          ),
        },
        {
          prompt: t("What is the eardrum?", "鼓膜是什么？"),
          right: t("A thin sheet of skin inside the ear that shakes with sound", "耳朵里随声音振动的一层薄膜"),
          wrong: [
            t("A small bone in the ear", "耳朵里的一块小骨头"),
            t("A drum that people play", "人们演奏的鼓"),
            t("The opening of the eye", "眼睛的开口"),
          ],
          solution: t(
            "The third paragraph describes the eardrum as a thin sheet of skin inside your ear that shakes when sound reaches it.",
            "第三段说鼓膜是耳朵里的一层薄膜，声音传来时会随之振动。",
          ),
        },
      ],
    },
    {
      id: "fighting-germs",
      title: t("Fighting Germs", "对抗病菌"),
      body: `Germs are living things so small that you cannot see them. Most are harmless, and some are even helpful. But a few kinds can make you sick when they get inside your body.

Your body has several ways to keep germs out. Your skin is a wall that most germs cannot get through. Tears and the wet lining inside your nose trap germs and wash them away. Strong juices in your stomach kill many germs that you swallow with your food.

If germs do get in, your body fights back. Your blood carries white blood cells, which hunt down germs and destroy them. Some white blood cells make special weapons that fit one kind of germ, like a key that fits one lock. After you have beaten a germ once, your body remembers it. If the same germ comes back, your white blood cells can fight it much faster, often before you feel sick at all.

You can help your body too. Washing your hands with soap, covering your mouth when you cough, eating healthy food and getting enough sleep all make it harder for germs to win.`,
      topics: [clues],
      glossed: ["germs", "germ"],
      xp: 4,
      questions: [
        {
          prompt: t("Which of these keeps germs out of the body?", "下面哪一项能把病菌挡在身体外面？"),
          right: t("The skin", "皮肤"),
          wrong: [t("White blood cells", "白细胞"), t("The heart", "心脏"), t("The bones", "骨头")],
          solution: t(
            "The second paragraph says your skin is a wall that most germs cannot get through; white blood cells fight germs that are already inside.",
            "第二段说皮肤是大多数病菌无法穿过的墙；白细胞对付的是已经进入体内的病菌。",
          ),
        },
        {
          prompt: t("Why is the special weapon of a white blood cell compared to a key?", "为什么把白细胞的特殊武器比作钥匙？"),
          right: t("It fits only one kind of germ", "它只适合一种病菌"),
          wrong: [
            t("It opens the skin", "它能打开皮肤"),
            t("It is made of metal", "它是金属做的"),
            t("It locks germs inside the body", "它把病菌锁在体内"),
          ],
          solution: t(
            "The third paragraph says the weapons fit one kind of germ, like a key that fits one lock.",
            "第三段说这些武器只适合一种病菌，就像一把钥匙只能开一把锁。",
          ),
        },
        {
          prompt: t("Why might you not feel sick when the same germ comes back?", "同样的病菌再次进入时，你为什么可能不会生病？"),
          right: t("The body remembers the germ and fights it faster", "身体记得这种病菌，能更快地对付它"),
          wrong: [
            t("The germ forgets the way in", "病菌忘了怎么进来"),
            t("The skin grows thicker", "皮肤变厚了"),
            t("The stomach juices get stronger", "胃液变强了"),
          ],
          solution: t(
            "The third paragraph says your body remembers a germ it has beaten and can fight it much faster.",
            "第三段说身体会记住打败过的病菌，能更快地对付它。",
          ),
        },
      ],
    },
    {
      id: "staying-healthy",
      title: t("Taking Care of Your Body", "照顾好你的身体"),
      body: `You have read how your body's systems work together: bones and muscles to move, the heart and lungs to deliver oxygen, the stomach and intestines to turn food into fuel, and the brain to run it all. Each system depends on the others. Taking care of your body means taking care of every part of this team.

Food is the fuel. A healthy plate has plenty of fruits and vegetables, along with grains, and foods such as beans, fish, eggs or meat that help your body grow and repair itself. Sweets are fine as a treat, but they do not give your body much of what it needs.

Water matters too. Your body is more than half water, and you lose some every day when you sweat and breathe. Drinking water helps your blood flow and your body stay cool.

Exercise makes your heart, lungs, muscles and bones stronger. Try to be active for at least an hour a day.

Finally, sleep. While you sleep, your body repairs itself and your brain sorts out what you learned during the day. Children need about nine to twelve hours every night.`,
      topics: [clues],
      glossed: ["intestines"],
      xp: 4,
      questions: [
        {
          prompt: t("Why does the writer call the body's systems a team?", "作者为什么把身体的各个系统称为团队？"),
          right: t("Each system depends on the others", "每个系统都依赖其他系统"),
          wrong: [
            t("They play sports together", "它们一起运动"),
            t("They take turns sleeping", "它们轮流睡觉"),
            t("They all do the same job", "它们都做同样的工作"),
          ],
          solution: t(
            "The first paragraph says each system depends on the others, so caring for the body means caring for the whole team.",
            "第一段说每个系统都依赖其他系统，所以照顾身体就是照顾整个团队。",
          ),
        },
        {
          prompt: t("Why does the body need water, according to the passage?", "根据文章，身体为什么需要水？"),
          right: t("It helps the blood flow and the body stay cool", "它帮助血液流动并让身体保持凉爽"),
          wrong: [
            t("It makes the bones grow", "它让骨头生长"),
            t("It replaces sleep", "它能代替睡眠"),
            t("It gives the body sweets", "它给身体提供糖"),
          ],
          solution: t(
            "The third paragraph says drinking water helps your blood flow and your body stay cool.",
            "第三段说喝水帮助血液流动，让身体保持凉爽。",
          ),
        },
        {
          prompt: t("What does the body do during sleep, according to the passage?", "根据文章，身体在睡眠时做什么？"),
          right: t("It repairs itself, and the brain sorts out what was learned", "它自我修复，大脑整理学到的东西"),
          wrong: [
            t("It stops all its systems", "它停止所有系统"),
            t("It digests sweets only", "它只消化甜食"),
            t("It grows new teeth", "它长出新牙齿"),
          ],
          solution: t(
            "The last paragraph says the body repairs itself and the brain sorts out what you learned during the day.",
            "最后一段说身体会自我修复，大脑会整理白天学到的东西。",
          ),
        },
      ],
    },
  ],
};
