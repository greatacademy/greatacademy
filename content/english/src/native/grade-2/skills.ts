// Grade 2: reading a story's beginning, middle and end, the main topic of a text and how characters feel; the prefixes
// *un-* and *re-* and shades of meaning; and writing a story in order, a short report of facts that belong together, and
// a thank-you note.

import type { TopicDef } from "@ga/content";
import { choose, type Label, label, topic } from "../grade-6/kit.ts";

/** L builds a label from its Chinese name, why it is right and why it is not. */
const L = (zh: string, whyEn: string, whyZh: string, notEn: string, notZh: string): Label => ({
  zh,
  why: [whyEn, whyZh],
  not: [notEn, notZh],
});

/** filled is a sentence with its blank filled by the right word. */
const filled = (shown: string, right: string) => shown.replace("___", right);

const parts = topic("reading", {
  id: "beginning-middle-and-end",
  title: ["Beginning, Middle and End", "开头、中间和结尾"],
  summary: [
    "A story has a beginning, a middle with a problem, and an end where the problem is solved.",
    "故事有开头、遇到问题的中间部分和解决问题的结尾。",
  ],
  intro: [
    "Think of a good bedtime story: first you meet the character, then something goes wrong, and finally things get fixed! Every story has a **beginning**, a **middle**, and an **end**. Let's spot each part and see how problems get solved.",
    "想想一个好听的睡前故事：先认识主角，接着出了点麻烦，最后麻烦解决了！每个故事都有**开头**、**中间**和**结尾**。这节课我们来分辨故事的三个部分，并找出问题是怎么解决的。",
  ],
  after: ["what-happens-first-next-and-last"],
  xp: 10,
  points: [
    label(
      "which-part-is-it",
      ["Which Part Is It", "这是哪一部分"],
      [
        "The **beginning** introduces who is in the story and where. The **middle** brings a problem that is not solved yet. The **end** solves the problem and wraps up the story.\n\n> **Watch out.** Look for clue words like *Once upon a time* (beginning) and *At last* or *In the end* (end).",
        "故事的**开头**交代人物和地点；**中间**出现尚未解决的问题；**结尾**把问题解决，故事收尾。\n\n> **注意。** 留意线索词：*Once upon a time* 常在开头，*At last* 或 *In the end* 常在结尾。",
      ],
      ["Which part of a story is this from?", "这句话来自故事的哪一部分？"],
      `
      Once upon a time, a little fox lived in a big wood.|beginning
      The fox could not find its way home.|middle
      At last, the fox was safe at home with its mom.|end
      Tim was a boy who lived on a farm with his dad.|beginning
      One day, the cow got out of the barn and ran away.|middle
      Tim and his dad put the cow back, and they all went to bed.|end
      Mia had a new red kite.|beginning
      The wind took the kite, and it got stuck in a tall tree.|middle
      A kind man got the kite down, and Mia thanked him.|end
      Long ago, a king lived in a castle by the sea.|beginning
      The king lost his crown, and nobody could find it.|middle
      The crown was in the garden, and the king was happy again.|end
      Once there was a little bear who lived in a cave.|beginning
      The bear woke up and could not find any food.|middle
      At last, the bear found berries and ate until he was full.|end
      Pam was a girl who loved to sing.|beginning
      On the day of the show, Pam lost her voice.|middle
      In the end, Pam sang the next week, and everyone clapped.|end
      Long ago, a small duck lived on a quiet pond.|beginning
      A big storm came, and the duck was blown far away.|middle
      The duck flew back, and it was home at last.|end
      There once was a boy named Raj who wanted a dog.|beginning
      Raj saved his coins, but he did not have enough.|middle
      On his birthday, Raj got a puppy, and he was so happy.|end
      One sunny morning, Ana went to the beach with her dad.|beginning
      A wave took Ana's pail out to sea.|middle
      A boy swam out and brought it back, and they all built a castle together.|end
      Once upon a time, a mouse lived in a hole in the wall.|beginning
      A cat sat by the hole all day, and the mouse could not get out.|middle
      When the cat fell asleep, the mouse ran out, and it was free at last.|end
      `,
      {
        beginning: L(
          "开头",
          "It introduces who is in the story and where, before any trouble starts.",
          "它交代了故事里的人物和地点，麻烦还没出现。",
          "This line does not just set the scene—a problem is happening or being solved.",
          "这句话不只是交代背景，而是正在发生问题或解决问题。",
        ),
        middle: L(
          "中间",
          "A problem pops up, and it is not fixed yet.",
          "出现了一个麻烦，而且还没有解决。",
          "There is no unsolved problem in this line.",
          "这句话里没有尚未解决的问题。",
        ),
        end: L(
          "结尾",
          "The problem is solved and the story wraps up.",
          "问题解决了，故事收尾了。",
          "Nothing is solved or wrapped up yet, so this is not the end.",
          "问题还没有解决收尾，所以不是结尾。",
        ),
      },
      (right, _shown, entry) => [
        `This line comes from the **${right}** of the story. ${entry.why[0]}\n\n**Check.** Ask: *Is there a problem here, and is it fixed?* ${right === "beginning" ? "No problem has started yet → **beginning**." : right === "middle" ? "A problem just happened and is still unfixed → **middle**." : "The problem is now fixed → **end**."}`,
        `这句话来自故事的**${entry.zh}**。${entry.why[1]}\n\n**检验。** 问自己：*这里有问题吗？解决了吗？* ${right === "beginning" ? "麻烦还没开始 → **开头**。" : right === "middle" ? "麻烦刚出现还没解决 → **中间**。" : "麻烦已经解决收尾 → **结尾**。"}`,
      ],
    ),
    choose(
      "how-the-problem-is-solved",
      ["How the Problem Is Solved", "问题是怎样解决的"],
      [
        "Every story has a **problem** in the middle and a **solution** at the end. Read the first sentence for what went wrong, then the second sentence for what fixed it.\n\n> **Watch out.** Pick the fix that the story *actually* gives—not another idea you could imagine.",
        "每个故事中间都有一个**问题**，结尾有一个**解决办法**。先看第一句出了什么麻烦，再看第二句是怎么解决的。\n\n> **注意。** 要选故事里*真正写出*的办法，不要选自己猜想的其他办法。",
      ],
      ["How is the problem solved?", "问题是怎样解决的？"],
      `
      Ella's cat was stuck up a tree. She called her dad, and he got a ladder.|Dad used a ladder to get the cat.|The cat jumped into a pond.|Ella went to bed.
      Leo's bike had a flat tire. His mom showed him how to fix it with a patch.|Leo fixed the tire with a patch.|Leo got a new bike.|Leo walked to school.
      The ants could not get over the stream. They made a bridge with a leaf.|The ants crossed on a leaf.|The ants swam across.|The ants went home.
      Nora forgot her lunch. Her friend Jack gave her half of his sandwich.|Jack shared his sandwich.|Nora went home to eat.|Nora bought a cake.
      The kids could not reach the ball on the roof. A tall girl used a long stick to knock it down.|A tall girl knocked it down with a stick.|The ball fell by itself.|The kids got a new ball.
      Pip the puppy was lost in the park. He followed the smell of his home and found the way back.|Pip followed the smell of his home.|A man took Pip home.|Pip stayed in the park.
      The bird's nest fell in the wind. The bird built a new one with twigs and mud.|The bird built a new nest.|The bird flew away for good.|The bird slept on the ground.
      Ravi's tower of blocks kept falling. He made the bottom wider, and it stood up.|Ravi made the bottom wider.|Ravi gave up.|Ravi used glue.
      The farmer's field was too dry. He dug a ditch to bring water from the river.|The farmer brought water in a ditch.|It rained the next day.|The farmer sold the field.
      Zoe could not open the jar. Her gran tapped the lid, and it came off.|Gran tapped the lid to open it.|Zoe broke the jar.|Zoe asked for a new jar.
      Kim's kite was stuck in a bush. Her brother used a rake to pull it out.|Her brother pulled it out with a rake.|The kite flew away.|Kim got a new kite.
      The dog was too hot. Sam filled a bowl with cold water and put it in the shade.|Sam gave the dog cold water in the shade.|The dog went to sleep.|Sam took the dog to the vet.
      Ann could not reach the top shelf. She stood on a stool to get the book.|Ann stood on a stool.|Ann asked for a new book.|Ann read a different book.
      The class plant was dying. The kids moved it to a sunny window.|The kids put it in a sunny window.|The kids threw it away.|The plant got new leaves by itself.
      Ben spilled milk on the floor. He wiped it up with a towel.|Ben wiped it up with a towel.|The cat drank it.|Ben went outside.
      The mice were hungry in winter. They had saved nuts in the fall, so they ate those.|They ate the nuts they had saved.|They went to sleep.|A boy gave them cheese.
      Lily's sock had a hole. Her gran sewed it closed.|Gran sewed up the hole.|Lily threw the sock away.|Lily wore two socks on one foot.
      The little bird could not fly yet. Its mom fed it until its wings were strong.|Its mom fed it until it could fly.|The bird walked home.|A boy took it to school.
      Max could not find his shoe. He looked under the bed and found it there.|He looked under the bed.|He wore boots.|His dog brought it back.
      The sandcastle kept falling down. Mia added water to the sand so it would stick.|Mia made the sand wet.|Mia went home.|Mia used rocks.
      The bus was late, and Tom had to get to school. His mom drove him there.|His mom drove him.|Tom stayed home.|Tom walked in the rain.
      The squirrel could not crack the nut. It dropped the nut on a rock until it broke.|It dropped the nut on a rock.|It gave the nut to a bird.|It ate a leaf.
      Nora's team needed one more player. Nora asked her new neighbor to join.|Nora asked her neighbor to play.|The team did not play.|Nora played two times.
      The room was too dark to read. Leo turned on the lamp.|Leo turned on the lamp.|Leo went to sleep.|Leo read in the dark.
      The puppy kept chewing shoes. Dad gave it a chew toy instead.|Dad gave the puppy a chew toy.|Dad hid all the shoes.|The puppy went away.
      Grace forgot her lines in the play. Her friend whispered them to her.|Her friend whispered the lines.|Grace ran off the stage.|The play stopped.
      The garden had too many weeds. The whole family pulled them out on Saturday.|The family pulled the weeds.|They let the weeds grow.|It rained on the weeds.
      Jack's balloon floated up to the ceiling. He stood on a chair and grabbed the string.|Jack grabbed the string from a chair.|The balloon popped.|Jack got a new balloon.
      The fish tank was dirty. Sara and her dad cleaned it and put in fresh water.|They cleaned the tank.|They got a new fish.|The fish cleaned it.
      The ducks could not find the pond in the fog. They followed the sound of the frogs.|They followed the frogs' sound.|They flew south.|They waited for the sun.
      `,
      (right) => [
        `The story solves the problem this way: *${right}*\n\n**Check.** Look back at the first sentence (the problem) and the second sentence (the fix): *${right}* directly fixes the problem and matches what the text says.`,
        `故事是这样解决问题的：*${right}*\n\n**检验。** 回看第一句（遇到的问题）和第二句（解决办法）：*${right}* 正好解决了开头的问题，而且和原文一致。`,
      ],
      [
        ["*{wrong}* is never mentioned in this story.", "这个故事里根本没提到 *{wrong}*。"],
        ["*{wrong}* does not match what the characters actually did to fix the problem.", "*{wrong}* 不是故事里人物真正采取的解决办法。"],
      ],
    ),
  ],
});

const mainTopic = topic("reading", {
  id: "the-main-topic-of-a-text",
  title: ["The Main Topic of a Text", "短文的主题"],
  summary: ["Tell what a whole text of facts is mostly about.", "说出一篇讲事实的短文主要讲了什么。"],
  intro: [
    "Suppose a friend asks, *What is your book about?* You do not read every single page—you name the big idea in a few words, like *sharks* or *how rain falls*. That big idea is the **main topic**.",
    "假如朋友问你：*你这本书讲什么？* 你不会把每一页都背出来，而是用几个词说出大意，比如“鲨鱼”或“雨是怎么下的”。这个大意就是**主题**。",
  ],
  after: ["finding-facts-in-a-text"],
  xp: 10,
  points: [
    choose(
      "what-is-it-mostly-about",
      ["What Is It Mostly About", "主要讲什么"],
      [
        "The **main topic** is what *every* sentence in the paragraph connects to, not just one detail. Ask: *What do all three sentences talk about?*\n\n> **Watch out.** A word that appears in only one sentence is a detail, not the main topic.",
        "**主题**是段落里*每一句话*都围绕的核心内容，而不只是一个细节。问一问：*这三句话都在讲什么？*\n\n> **注意。** 只在其中一句里出现过的词只是细节，不是整段话的主题。",
      ],
      ["What is the text mostly about?", "这篇短文主要讲什么？"],
      `
      Whales live in the sea. They breathe air at the top of the water. A baby whale drinks milk from its mom.|whales|the sea|milk
      Bees fly from flower to flower. They take a sweet juice back to the hive. There they make it into honey.|how bees make honey|flowers|a hive
      A fire truck is red. It has a long ladder and a hose. Firefighters ride it to put out fires.|a fire truck|ladders|the color red
      Owls hunt at night. They have big eyes to see in the dark. They can turn their heads far around.|owls|the dark|eyes
      Penguins are birds, but they cannot fly. They swim fast in cold water. They slide on their bellies on the ice.|penguins|cold water|ice
      The moon goes around the earth. It shines with light from the sun. Its shape seems to change each night.|the moon|the sun|the earth
      Frogs lay eggs in water. The eggs become tadpoles. The tadpoles grow legs and become frogs.|how frogs grow|water|legs
      Trains carry people from town to town. Some trains carry coal or wood. Fast trains can go very far in a day.|trains|coal|towns
      Teeth help us bite and chew. We brush them two times a day. A dentist checks them to keep them healthy.|our teeth|the dentist|chewing
      Rain falls from clouds. It fills rivers and lakes. Plants and animals need rain to live.|rain|clouds|lakes
      Snakes have no legs. They move by sliding on the ground. Some snakes can climb trees.|snakes|trees|legs
      Pandas live in China. They eat bamboo all day. Baby pandas are very small.|pandas|bamboo|China
      A dentist helps keep teeth healthy. She checks for holes. She shows kids how to brush.|what a dentist does|holes|brushing
      Pumpkins grow on vines. They start as small green balls. They turn orange in the fall.|how pumpkins grow|vines|the fall
      Kangaroos can jump far. They carry their babies in a pouch. They live in Australia.|kangaroos|Australia|babies
      Clouds are made of tiny drops of water. Some are white and puffy. Dark clouds can bring rain.|clouds|rain|water drops
      A library has many books. You can borrow them for free. You must bring them back on time.|the library|books|time
      Spiders spin webs. They catch bugs in the sticky silk. Most spiders have eight legs.|spiders|bugs|legs
      Ice cream is cold and sweet. It is made from milk and sugar. It melts in the sun.|ice cream|sugar|the sun
      Elephants are very big. They use their long trunks to drink and eat. They flap their ears to stay cool.|elephants|trunks|ears
      Corn grows tall in fields. Farmers pick it in late summer. We can eat it on the cob.|corn|farmers|summer
      Turtles have hard shells. They can pull their heads inside. Some turtles live in the sea.|turtles|the sea|heads
      Wind is moving air. It can push sailboats. Strong wind can knock down trees.|wind|sailboats|trees
      Ducks have webbed feet. They paddle on ponds. Their feathers keep them dry.|ducks|ponds|feathers
      A farm has many animals. Cows give milk. Hens lay eggs.|farm animals|milk|eggs
      The heart pumps blood. It beats all day and night. Exercise makes it strong.|the heart|blood|exercise
      Mail carriers bring letters. They walk or drive from house to house. They work in rain and snow.|mail carriers|snow|houses
      Volcanoes are mountains with openings. Hot rock comes out of them. Some are asleep for a long time.|volcanoes|rock|mountains
      Leaves change color in the fall. They turn red, orange and yellow. Then they fall off the trees.|leaves in the fall|the color red|trees
      Camels live in the desert. They can go a long time without water. Their humps store fat.|camels|water|humps
      `,
      (right) => [
        `The whole text is mostly about **${right}**—all three sentences add facts about it.\n\n**Check.** Test **${right}** against sentence 1, sentence 2, and sentence 3: each sentence connects to **${right}**, while the other choices fit only one sentence.`,
        `整篇短文主要讲的是 **${right}**——三句话都在补充关于它的事实。\n\n**检验。** 用 **${right}** 逐一核对第 1、2、3 句：每一句都和 **${right}** 有关，而另外两个选项只沾到其中一句的边。`,
      ],
      [
        ["*{wrong}* shows up in just one sentence, so it is a small detail.", "*{wrong}* 只在一句话里出现过，只是一个小细节。"],
        ["*{wrong}* is mentioned once, but the other sentences are not about it.", "短文只顺带提了 *{wrong}*，其余句子并不是讲它。"],
      ],
    ),
    choose(
      "the-best-title",
      ["The Best Title", "最好的标题"],
      [
        "A good **title** acts like an umbrella: it covers *all* the sentences under it, not just one fact.\n\n> **Watch out.** Skip titles that name only a single tiny detail from one sentence.",
        "好的**标题**就像一把雨伞，能把下面*所有*句子都罩住，而不只是其中一个小事实。\n\n> **注意。** 只说到其中一句话里某个小细节的标题范围太窄，不能选。",
      ],
      ["Which is the best title?", "哪个标题最好？"],
      `
      Cats sleep a lot. They clean their fur with their tongues. They use their whiskers to feel their way.|All About Cats|Cat Tongues|Sleep
      Seeds can travel. Some float on the wind. Some stick to animals' fur. Some are carried by water.|How Seeds Travel|The Wind|Animal Fur
      Long ago, people wrote with feathers. Later, they used pencils. Now many people type on computers.|How People Have Written|Feathers|Computers
      Snow is made of tiny bits of ice. No two flakes are the same. Snow falls when it is very cold.|What Snow Is|Ice|Cold Days
      Some animals sleep all winter. Bears sleep in dens. Bats sleep in caves. They wake up in spring.|Animals That Sleep All Winter|Bears|Spring
      Bikes have two wheels. You push the pedals to make them go. A helmet keeps your head safe.|Riding a Bike|Helmets|Wheels
      Ants live in big groups. Some ants find food. Some take care of the eggs. They all work together.|How Ants Work Together|Eggs|Food
      Dogs can help people. Some dogs guide people who cannot see. Some find people who are lost.|Dogs That Help|Lost People|Seeing
      A tree has roots, a trunk, branches and leaves. Each part helps the tree live.|The Parts of a Tree|Roots|Leaves
      Butterflies have four wings. They drink from flowers. They taste with their feet.|Facts About Butterflies|Flowers|Feet
      Frogs can jump far. They catch bugs with their long tongues. They lay eggs in water.|All About Frogs|Frog Tongues|Water
      Some birds fly south in fall. They find food where it is warm. They come back in spring.|Why Birds Fly South|Spring|Food
      Long ago, people rode horses. Then they drove cars. Now some people fly in planes.|How People Have Traveled|Horses|Planes
      Ice is frozen water. It melts when it gets warm. It floats on top of water.|What Ice Is|Warm Days|Floating
      Some animals live in the ocean. Fish swim there. Whales and crabs live there too.|Animals of the Ocean|Whales|Crabs
      To plant a seed, dig a hole. Put the seed in. Cover it and give it water.|How to Plant a Seed|Water|Holes
      Doctors help sick people. They check our hearts. They give us medicine.|What Doctors Do|Hearts|Medicine
      Bats sleep in the day. They fly at night. They eat bugs and fruit.|Facts About Bats|Fruit|Night
      Wheat is used to make bread. Farmers grow it in fields. Mills grind it into flour.|From Wheat to Bread|Mills|Fields
      Our eyes help us see. Our ears help us hear. Our noses help us smell.|Our Five Senses|Noses|Eyes
      Rainbows come after rain. Sunlight shines through drops of water. We see many colors.|How Rainbows Form|Rain|Colors
      Beavers cut down trees with their teeth. They build dams in rivers. They live in lodges.|How Beavers Live|Teeth|Rivers
      Recycling saves trees. We can recycle paper, cans and bottles. Then they are made into new things.|Why We Recycle|Cans|Bottles
      Firefighters put out fires. They also teach fire safety. They save people and pets.|What Firefighters Do|Pets|Fire Safety
      Plants need sun, water and air. Without them, plants die.|What Plants Need|Air|Sun
      Horses can run fast. They eat hay and oats. Some horses pull carts.|All About Horses|Oats|Carts
      The earth has seasons. It is hot in summer. It is cold in winter.|The Seasons|Summer|Cold
      Squirrels gather nuts in fall. They bury them in the ground. They dig them up in winter.|How Squirrels Get Ready for Winter|Nuts|The Ground
      Sharks have many teeth. Their teeth fall out and grow back. Some sharks are bigger than a bus.|Facts About Sharks|Teeth|Buses
      Kids can help at home. They can make their beds. They can set the table.|Ways Kids Help at Home|Beds|Tables
      `,
      (right) => [
        `**${right}** is the best title because it covers every sentence in the text.\n\n**Check.** Put **${right}** at the top of the page and reread all the sentences: every single fact fits neatly under that title.`,
        `**${right}** 是最好的标题，因为它能概括短文里的每一句话。\n\n**检验。** 把 **${right}** 放在短文最上方再通读一遍：每个事实都能稳稳地归在这个标题下面。`,
      ],
      [
        ["*{wrong}* names only one detail from a single sentence.", "*{wrong}* 只提到了其中一句里的一个细节。"],
        ["*{wrong}* is too narrow to cover the whole paragraph.", "*{wrong}* 范围太窄，盖不住整段话。"],
      ],
    ),
  ],
});

const feelings = topic("reading", {
  id: "how-characters-feel",
  title: ["How Characters Feel", "人物的感受"],
  summary: ["Tell how a character feels from what they say and do.", "从人物说的话和做的事判断他们的感受。"],
  intro: [
    "When your friend grins and bounces on their toes, you know they are excited—even before they say a word! Writers show how characters feel through their faces, actions, and words. Let's read those clues.",
    "朋友咧嘴笑、踮着脚蹦来蹦去，不用开口你也知道他很兴奋！作家也是通过表情、动作和说话来表现人物感受的。这节课我们来读懂这些线索。",
  ],
  after: ["who-and-where-in-a-story"],
  xp: 10,
  points: [
    choose(
      "feelings-from-actions",
      ["Feelings from Actions", "从行为看感受"],
      [
        "A story often *shows* a feeling instead of naming it. Look at what the character **does** and **says**: jumping and clapping shows *happy*; hiding behind Mom shows *scared*.\n\n> **Watch out.** Picture the action in your own body—how would *you* feel if you did that?",
        "故事常常通过画面*表现*感受，而不直接说出来。看人物**做了什么**、**说了什么**：又蹦又拍手表示开心，躲到妈妈身后表示害怕。\n\n> **注意。** 想象自己做出同样的动作——如果你这样做，心里是什么感觉？",
      ],
      ["How does the character feel?", "这个人物有什么感受？"],
      `
      Lucy jumped up and down and clapped her hands when she saw the puppy.|happy|sad|angry
      Max sat alone on the step and a tear rolled down his cheek.|sad|happy|proud
      Ava stamped her foot and shouted, "That is not fair!"|angry|sleepy|happy
      Sam hid behind his mom when the big dog barked.|scared|proud|bored
      Mia showed everyone the picture she made and smiled wide.|proud|scared|sad
      Ben yawned and rubbed his eyes.|sleepy|angry|proud
      Zoe looked at the gift and said, "Wow! What can it be?"|excited|bored|sad
      Leo looked out the window at the rain and sighed. There was nothing to do.|bored|excited|proud
      Nina's hands shook as she walked onto the stage.|nervous|bored|angry
      Tom's face went red when he dropped his tray in front of the class.|embarrassed|proud|excited
      Ana grinned and hugged her dad when he came home from his trip.|happy|angry|bored
      Leo kicked the wall and crossed his arms.|angry|happy|sleepy
      Rosa sniffed and looked down at her broken doll.|sad|excited|proud
      Ben's knees shook when he heard a noise in the dark.|scared|proud|bored
      Kim held up her trophy and stood tall.|proud|scared|sad
      Max could hardly keep his eyes open at the end of the movie.|sleepy|excited|angry
      Zara bounced on her toes and kept asking, "Is it time yet?"|excited|bored|sad
      Omar sat with his chin in his hands, tapping his foot. Nothing was happening.|bored|excited|proud
      Ella bit her nails as she waited for her turn to read.|nervous|bored|angry
      Sam covered his face when everyone laughed at his mistake.|embarrassed|proud|excited
      Mia laughed and spun around in the snow.|happy|sad|angry
      Jack slammed his book shut and frowned.|angry|happy|calm
      Lena wiped her eyes and hugged her old teddy bear.|sad|happy|proud
      Nick froze and held his breath when the thunder boomed.|scared|bored|happy
      Pam smiled as she showed her dad her good grade.|proud|sad|scared
      Tom rested his head on his desk and yawned.|sleepy|excited|angry
      Ivy jumped up and shouted, "We are going to the zoo!"|excited|sad|bored
      Ray stared at the clock and sighed again and again.|bored|excited|happy
      Lucy's voice was very quiet, and she held her mom's hand tight on the first day of school.|nervous|angry|bored
      Eli's cheeks turned pink when he tripped on stage.|embarrassed|proud|happy
      `,
      (right) => [
        `The character's actions and words show that they feel **${right}**.\n\n**Check.** Picture yourself doing what the character just did: that body language matches feeling **${right}**, not the other two feelings.`,
        `人物的动作和话语表现出他们感到 **${right}**。\n\n**检验。** 想象自己做出同样的举动和表情：这种反应对应的正是 **${right}**，而不是另外两种情绪。`,
      ],
      [
        ["*{wrong}* does not match the body language or words shown here.", "*{wrong}* 和这里描写的人物动作或话语不符。"],
        [
          "Picture someone feeling *{wrong}*—they would not act the way this character does.",
          "想想感到 *{wrong}* 的人会怎样表现——和这里人物的做法对不上。",
        ],
      ],
    ),
    choose(
      "why-they-feel-that-way",
      ["Why They Feel That Way", "为什么会有这种感受"],
      [
        "Feelings always have a **cause**. Read the sentence right after the feeling to see *what happened* to make the character feel that way.\n\n> **Watch out.** Pick the reason written in the story—even if another choice could also cause a feeling.",
        "感受都有**原因**。看紧跟在感受后面的那句话，找出*发生了什么事*让人物产生这种感受。\n\n> **注意。** 要选故事里写出来的那个原因，即使另一个选项听起来也可能让人有情绪。",
      ],
      ["Why does the character feel this way?", "这个人物为什么会有这种感受？"],
      `
      Jack was sad. His best friend had moved to a new town.|His best friend moved away.|He got a new bike.|It was his birthday.
      Mia was proud. She had read a whole book on her own.|She read a whole book by herself.|She lost her book.|She was late for school.
      Ben was scared. The lights went out during the storm.|The lights went out in a storm.|He won a prize.|His friend came to play.
      Lily was happy. Her gran came to visit from far away.|Her gran came to visit.|Her cat ran off.|She fell down.
      Sam was angry. His little brother broke his toy truck.|His brother broke his toy.|He got a gift.|He went to the park.
      Ella was excited. Tomorrow they were going to the beach.|They were going to the beach.|It was raining.|Her toy was lost.
      Leo was nervous. It was his first day at a new school.|It was his first day at a new school.|He was at home in bed.|He won a game.
      Kim was tired. She had run all the way home.|She ran all the way home.|She slept all day.|She sat and read.
      Max was glad. He found the ring that Mom had lost.|He found Mom's lost ring.|He lost his shoe.|It was cold out.
      Zoe was sorry. She had said something unkind to her friend.|She was unkind to her friend.|Her friend gave her a gift.|She won the race.
      Ava was happy. She had found a lost kitten and brought it home.|She found a kitten.|She lost her bag.|It was raining.
      Leo was sad. His goldfish had died.|His goldfish died.|He got a new game.|He went to a party.
      Kim was scared. She heard a loud crash in the night.|She heard a loud crash.|She got a hug.|She ate a cookie.
      Ben was proud. He had tied his own shoes for the first time.|He tied his shoes by himself.|He lost his shoes.|He fell down.
      Mia was angry. Someone had knocked over her block tower.|Someone knocked over her tower.|She got a gift.|She won a race.
      Tom was excited. His cousins were coming to stay for a week.|His cousins were coming to stay.|He had to clean his room.|He was sick.
      Nina was nervous. She had to sing alone in front of the school.|She had to sing alone.|She was at home.|She ate lunch.
      Sam was tired. He had played soccer all afternoon.|He played soccer all afternoon.|He slept all morning.|He sat on the couch.
      Lily was glad. Her lost dog came home by itself.|Her lost dog came home.|Her dog ran away.|It was cold.
      Raj was sorry. He had broken his sister's crayon.|He broke his sister's crayon.|His sister gave him a crayon.|He won a prize.
      Ella was bored. It had rained all day, and she could not go out.|She could not go out in the rain.|She went to the park.|She got a new puppy.
      Max was embarrassed. He had called his teacher "Mom" by mistake.|He called his teacher "Mom."|He got a good grade.|He found a dime.
      Zoe was surprised. Her friends jumped out and yelled, "Happy birthday!"|Her friends surprised her.|She was sad.|She went to bed early.
      Jack was worried. His little sister was late coming home.|His sister was late.|His sister was home.|It was a sunny day.
      Ana was proud. She had saved enough money to buy a gift for her mom.|She saved money for a gift.|She lost her money.|She broke a cup.
      Ben was lonely. All his friends were away on vacation.|His friends were away.|His friends came over.|He had a party.
      Kim was thankful. Her neighbor had helped her find her cat.|Her neighbor helped find her cat.|Her cat scratched her.|She lost her cat.
      Leo was frustrated. His puzzle had too many pieces, and none would fit.|His puzzle pieces would not fit.|He finished the puzzle.|He got a snack.
      Pam was calm. She had practiced her speech many times.|She had practiced a lot.|She forgot her speech.|She was late.
      Owen was jealous. His brother got a new bike, and he did not.|His brother got a new bike.|He got a new bike too.|His bike was fixed.
      `,
      (right) => [
        `The second sentence gives the reason: *${right}*\n\n**Check.** Join the two sentences with *because*: the feeling happens *because* *${right[0]?.toLowerCase() ?? ""}${right.slice(1)}* That matches both the text and real life.`,
        `第二句话给出了原因：*${right}*\n\n**检验。** 用“因为”把感受和 *${right}* 连起来读：顺理成章，而且原文里明明白白写着这件事。`,
      ],
      [
        ["*{wrong}* would bring a different feeling, and it did not happen here.", "*{wrong}* 会带来另一种感受，而且故事里没发生这件事。"],
        ["Read the story again: *{wrong}* is not in the text.", "再读一遍故事：原文里没有提到 *{wrong}*。"],
      ],
    ),
  ],
});

const prefixes = topic("vocabulary", {
  id: "prefixes-un-and-re",
  title: ["The Prefixes Un- and Re-", "前缀 un- 和 re-"],
  summary: ["*Un-* means *not* or undoes an action; *re-* means *again*.", "*un-* 表示*不*或撤销一个动作；*re-* 表示*再一次*。"],
  intro: [
    "Snap a small word part onto the front of *pack* and watch what happens: **un**pack means take things out, and **re**pack means pack again! Those front parts are called **prefixes**.",
    "在 *pack* 前面扣上一个小词头，意思立刻就变了：**un**pack 是把东西拿出来，**re**pack 是重新打包！这些加在词前面的小部件叫做**前缀**。",
  ],
  after: ["reading-words-with-silent-e"],
  xp: 10,
  points: [
    choose(
      "what-the-new-word-means",
      ["What the New Word Means", "新词的意思"],
      [
        "A **prefix** sits at the front of a base word and changes its meaning. **Un-** means *not* (*unhappy* = not happy) or *undo* (*unlock* = open the lock). **Re-** means *again* (*redo* = do again).\n\n> **Watch out.** Do not mix up *un-* (not / undo) and *re-* (again).",
        "**前缀**加在词根前面，改变词的意思。**un-** 表示“不”（*unhappy* = 不开心）或“撤销”（*unlock* = 开锁）；**re-** 表示“再一次”（*redo* = 重做）。\n\n> **注意。** 不要把 *un-*（不/撤销）和 *re-*（再一次）弄混。",
      ],
      ["What does the word mean?", "这个词是什么意思？"],
      `
      unhappy|not happy|happy again|very happy
      reread|read again|not read|read fast
      unlock|open the lock|lock again|lock fast
      refill|fill again|not full|fill a little
      unkind|not kind|kind again|very kind
      retell|tell again|not tell|tell fast
      unsafe|not safe|safe again|very safe
      repaint|paint again|not paint|paint fast
      untie|undo the knot|tie again|tie tight
      rebuild|build again|not build|build fast
      unfair|not fair|fair again|very fair
      replay|play again|not play|play fast
      unpack|take out of the bag|pack again|pack tight
      rewrite|write again|not write|write fast
      unwell|not well|well again|very well
      reuse|use again|not use|use a lot
      unzip|open the zipper|zip again|zip fast
      reheat|heat again|not hot|heat a lot
      unlucky|not lucky|lucky again|very lucky
      recheck|check again|not check|check fast
      unclear|not clear|clear again|very clear
      refold|fold again|not fold|fold fast
      unwrap|take the paper off|wrap again|wrap tight
      revisit|visit again|not visit|visit fast
      unsure|not sure|sure again|very sure
      restart|start again|not start|start fast
      unbutton|open the buttons|button again|button tight
      reopen|open again|not open|open wide
      unable|not able|able again|very able
      retry|try again|not try|try hard
      `,
      (right, shown) => {
        const pre = shown.startsWith("un") ? "un-" : "re-";
        const base = shown.slice(2);
        return [
          `**${shown}** means **${right}**.\n\n**Check.** Split **${shown}** into **${pre}** + **${base}**: *${pre}* means *${pre === "un-" ? "not / undo" : "again"}*, which combines with *${base}* to give **${right}**.`,
          `**${shown}** 的意思是 **${right}**。\n\n**检验。** 把 **${shown}** 拆成 **${pre}** + **${base}**：*${pre}* 表示${pre === "un-" ? "“不”或“撤销”" : "“再一次”"}，合上 *${base}* 正好是 **${right}**。`,
        ];
      },
      [
        [
          "*{wrong}* uses the meaning of the other prefix (*un-* vs. *re-*).",
          "*{wrong}* 用成了另一个前缀的意思（把 *un-* 和 *re-* 弄反了）。",
        ],
        [
          "*{wrong}* adds a meaning (*very*, *fast*, *tight*) that neither *un-* nor *re-* gives.",
          "*{wrong}* 加上了 *un-* 和 *re-* 都没有的程度意思。",
        ],
      ],
    ),
    choose(
      "the-word-that-fits",
      ["The Word That Fits", "合适的词"],
      [
        "Read the whole sentence to see which prefix fits: if the sentence needs *not* or *undo*, choose **un-**; if it needs *again*, choose **re-**.\n\n> **Watch out.** Do not pick the plain base word when the sentence needs the opposite or a repeat.",
        "读完整句话判断需要哪个前缀：表示“不”或“撤销”选 **un-**；表示“再一次”选 **re-**。\n\n> **注意。** 句子需要反义或“再来一次”时，不要选没加前缀的原词。",
      ],
      ["Which word fits?", "哪个词合适？"],
      `
      The ice is thin, so it is ___ to skate.|unsafe|resafe|safe
      My cup is empty. Can you ___ it?|refill|unfill|fill out
      I did not like my picture, so I will ___ it.|redraw|undraw|draw up
      The box is shut tight. Can you ___ it?|unlock|relock|lock
      The story was fun. Please ___ it!|retell|untell|tell off
      Ben was ___ because he lost his ball.|unhappy|rehappy|happy
      The rain hit our tower, so we had to ___ it.|rebuild|unbuild|build in
      My shoe came off. I need to ___ it and tie it again.|untie|retie|tie up
      It is ___ to push in line.|unkind|rekind|kind
      I forgot what it said, so I will ___ the page.|reread|unread|read up
      The test was hard, so it felt ___.|unfair|refair|fair
      The game was fun. Let's ___ it!|replay|unplay|play out
      We got home, so let's ___ the bags.|unpack|repack|pack
      My story had mistakes, so I will ___ it.|rewrite|unwrite|write off
      The soup got cold. Can you ___ it?|reheat|unheat|heat
      I was ___ about the answer, so I asked.|unsure|resure|sure
      My coat is stuck. Can you ___ it?|unzip|rezip|zip
      We can ___ the jar for paint water.|reuse|unuse|use up
      The computer froze, so I will ___ it.|restart|unstart|start
      I tore the gift paper to ___ my present.|unwrap|rewrap|wrap
      The note was messy and ___.|unclear|reclear|clear
      The store is closed now, but it will ___ at nine.|reopen|unopen|open up
      I fell and did not win. I was ___.|unlucky|relucky|lucky
      I missed the ball. Let me ___.|retry|untry|try out
      I folded the map wrong, so I will ___ it.|refold|unfold|fold up
      Ben felt ___ and stayed home.|unwell|rewell|well
      We will ___ the zoo next year.|revisit|unvisit|visit
      Please ___ your work before you hand it in.|recheck|uncheck|check out
      The baby was ___ to reach the toy.|unable|reable|able
      I need to ___ my shirt to take it off.|unbutton|rebutton|button
      `,
      (right, shown) => {
        const isUn = right.startsWith("un");
        return [
          `*${filled(shown, right)}* — **${right}** adds *${isUn ? "un- (not / undo)" : "re- (again)"}* to match the sentence.\n\n**Check.** Swap **${right}** for its meaning (*${isUn ? "not / undo" : "do again"}*) inside *${shown}*: the sentence makes complete sense.`,
          `*${filled(shown, right)}* —— **${right}** 加上了 *${isUn ? "un-（不/撤销）" : "re-（再一次）"}*，正好符合句意。\n\n**检验。** 把 **${right}** 换成“${isUn ? "不/解开" : "重新……一次"}”代入原句读一遍，意思完全通顺。`,
        ];
      },
      [
        [
          "*{wrong}* puts the wrong prefix (*un-* vs. *re-*) on the word—some of those are not even real words.",
          "*{wrong}* 用错了前缀（把 *un-* 和 *re-* 弄反了），有的甚至根本不是真词。",
        ],
        [
          "*{wrong}* leaves off the prefix needed here, which changes or flips the meaning.",
          "*{wrong}* 少了需要的前缀，句子的意思变味甚至说反了。",
        ],
      ],
    ),
  ],
});

const shades = topic("vocabulary", {
  id: "stronger-and-weaker-words",
  title: ["Stronger and Weaker Words", "强弱不同的词"],
  summary: [
    "Words close in meaning can be stronger or weaker: *warm*, *hot*, *boiling*.",
    "意思相近的词有强有弱：*warm*、*hot*、*boiling*。",
  ],
  intro: [
    "Touch bathwater: it feels *warm*. Touch a soup pot on the stove: it is *boiling*! Words in the same family can climb a ladder from mild to strong. Let's pick the exact rung on the ladder.",
    "摸一摸洗澡水，是 *warm*（温热的）；摸一摸炉子上的汤锅，是 *boiling*（滚烫的）！意思相近的词就像梯子，从轻到重一级一级往上爬。这节课我们来选准程度最合适的那一级。",
  ],
  after: ["describing-words"],
  xp: 10,
  points: [
    choose(
      "the-strongest-word",
      ["The Strongest Word", "最强烈的词"],
      [
        "Words with close meanings climb from mild to strong: *big* → *huge* → **giant**; *walk* → *jog* → **sprint**. The strongest word sits at the top of the ladder.\n\n> **Watch out.** Do not stop at the middle rung—compare all three words to find the very strongest one.",
        "意思相近的词从弱到强排成梯子：*big* → *huge* → **giant**；*walk* → *jog* → **sprint**。最强烈的词在梯子最顶上。\n\n> **注意。** 不要停在中间那一级，三个词都比一比，找出最顶上最强的那个。",
      ],
      ["Which word is the strongest?", "哪个词最强烈？"],
      `
      warm, hot|boiling|warm|hot
      big, huge|giant|big|huge
      sad, upset|heartbroken|sad|upset
      glad, happy|thrilled|glad|happy
      cool, cold|freezing|cool|cold
      small, tiny|teeny|small|tiny
      walk, jog|sprint|walk|jog
      wet, damp|soaked|damp|wet
      look, stare|glare|look|stare
      tired, sleepy|exhausted|tired|sleepy
      cool, chilly|icy|cool|chilly
      quiet, soft|silent|quiet|soft
      good, great|amazing|good|great
      bad, awful|terrible|bad|awful
      mad, angry|furious|mad|angry
      fast, quick|speedy|quick|fast
      afraid, scared|terrified|afraid|scared
      hungry, starving|famished|hungry|starving
      like, love|adore|like|love
      pretty, beautiful|gorgeous|pretty|beautiful
      loud, noisy|deafening|loud|noisy
      dirty, messy|filthy|dirty|messy
      smart, clever|brilliant|smart|clever
      funny, silly|hilarious|funny|silly
      full, stuffed|bursting|full|stuffed
      old, aged|ancient|old|aged
      bright, shiny|dazzling|bright|shiny
      cry, sob|wail|cry|sob
      talk, shout|scream|talk|shout
      surprised, shocked|stunned|surprised|shocked
      `,
      (right, shown) => [
        `**${right}** is the strongest word among *${shown}* and **${right}**.\n\n**Check.** Line the three words up on a ladder from weakest to strongest: *${shown.replace(", ", " → ")} → **${right}*** — **${right}** sits at the very top.`,
        `在 *${shown}* 和 **${right}** 中，**${right}** 的程度最强烈。\n\n**检验。** 把三个词从弱到强排成梯子：*${shown.replace(", ", " → ")} → **${right}*** —— **${right}** 排在最顶上。`,
      ],
      [
        ["*{wrong}* is the mildest rung of the three.", "*{wrong}* 是三个词里程度最轻的一个。"],
        ["*{wrong}* sits in the middle of the ladder—there is a stronger word above it.", "*{wrong}* 排在中间，上面还有一个程度更强的词。"],
      ],
    ),
    choose(
      "the-word-that-fits-best",
      ["The Word That Fits Best", "最合适的词"],
      [
        "Match the strength of the word to the clues in the sentence: a cup of tea is *hot*, while a pond turned to ice is **frozen**; someone very thirsty **gulps** water instead of sipping it.\n\n> **Watch out.** Look for clue words like *so*, *quiet*, or *all at once*—they tell you whether you need a gentle word or a strong one.",
        "根据句子里的线索选强弱合适的词：一杯茶是 *hot*，结冰的池塘是 **frozen**；渴极了的人会 **gulp**（大口灌）而不是小口抿。\n\n> **注意。** 留意 *so*、*quiet*、*all at once* 这些线索词，它们告诉你该选轻的词还是重的词。",
      ],
      ["Which word fits best?", "哪个词最合适？"],
      `
      I was so thirsty that I ___ all the water at once.|gulped|sipped|tasted
      The baby is asleep, so please ___.|whisper|shout|yell
      The ant is so ___ that I can hardly see it.|tiny|big|huge
      After the long race, I was ___.|exhausted|awake|rested
      We had to ___ to catch the bus before it left.|dash|stroll|creep
      I fell in the pond and got ___.|soaked|dry|damp
      The elephant is ___.|enormous|little|small
      It was so cold that the pond was ___.|frozen|warm|cool
      She was ___ when she won the big prize.|thrilled|okay|calm
      The kitten ___ quietly to the bowl.|crept|stomped|raced
      The lion let out a loud ___.|roar|squeak|hum
      I was so hungry I ___ my dinner.|gobbled|nibbled|tasted
      The library is quiet, so we ___.|whisper|scream|shout
      The mouse is so ___ it fits in my hand.|tiny|giant|huge
      After running all day, I was ___.|worn out|full of energy|rested
      The baby ___ softly in her crib.|slept|stomped|raced
      The storm made us ___ inside.|hurry|stroll|wander
      The sun was so hot it was ___.|scorching|cool|chilly
      I was ___ when I saw the big spider.|terrified|calm|bored
      The kitten ___ the milk.|lapped|gulped down|chugged
      The giant ___ through the forest.|stomped|tiptoed|crept
      My shirt was ___ after the mud fight.|filthy|clean|neat
      The joke was so ___ we could not stop laughing.|hilarious|dull|sad
      The snail ___ along the leaf.|crept|raced|dashed
      I ___ my friend tight when she came back.|hugged|poked|patted
      The cheetah ___ across the field.|raced|crawled|strolled
      The wind ___ all night in the storm.|howled|whispered|hummed
      The old castle was ___.|ancient|new|modern
      I ___ the tiny bit of cake to make it last.|nibbled|gobbled|gulped
      The fireworks were ___ in the dark sky.|dazzling|dull|dim
      `,
      (right, shown) => [
        `*${filled(shown, right)}* — **${right}** matches the exact strength the clues call for.\n\n**Check.** Picture the scene in *${filled(shown, right)}*: the clues in the sentence match the strength of **${right}**, while the other choices are too mild, too strong, or go the opposite way.`,
        `*${filled(shown, right)}* —— **${right}** 的强弱程度正好吻合句子里的线索。\n\n**检验。** 想象 *${filled(shown, right)}* 的画面：**${right}** 力度贴切，另外两个词要么太轻太重，要么意思反了。`,
      ],
      [
        [
          "*{wrong}* has the wrong strength (or goes the opposite way) for the clues in this sentence.",
          "*{wrong}* 的程度太轻或太重（甚至意思相反），和句子线索不符。",
        ],
        [
          "Put *{wrong}* in the sentence and picture it—its strength does not fit the scene.",
          "把 *{wrong}* 放进句子里想一想画面，它的强弱和场景不搭。",
        ],
      ],
    ),
  ],
});

const storyOrder = topic("writing", {
  id: "telling-a-story-in-order",
  title: ["Telling a Story in Order", "按顺序讲故事"],
  summary: [
    "Write the events of a story in order, with time words such as *one day*, *then* and *in the end*.",
    "用 *one day*、*then*、*in the end* 等时间词按顺序写出故事。",
  ],
  intro: [
    "Imagine telling a friend about your weekend starting with going to bed and ending with waking up—they would be totally lost! Time words like **One day**, **Then**, **After that**, and **In the end** keep a story moving forward.",
    "想象你给朋友讲周末的事，却先讲晚上睡觉、最后才讲早上起床——朋友肯定听懵了！**One day**、**Then**、**After that**、**In the end** 这些时间词能让故事稳稳往前走。",
  ],
  after: ["writing-steps-with-first-and-next", "past-tense-with-ed"],
  xp: 10,
  points: [
    choose(
      "the-time-word",
      ["The Time Word", "时间词"],
      [
        "Time words tell the reader where they are in a story: **One day** or **Once upon a time** opens it, **Then** and **After that** carry the middle, and **In the end** wraps it up.\n\n> **Watch out.** Check whether the blank opens a brand-new story, continues a sentence before it, or finishes the story.",
        "时间词告诉读者故事讲到了哪里：**One day** 或 **Once upon a time** 开头，**Then** 和 **After that** 推进中间，**In the end** 收尾。\n\n> **注意。** 先看空格是在开启新故事、承接上一句，还是在给故事收尾。",
      ],
      ["Which time word fits?", "哪个时间词合适？"],
      `
      ___, a little duck walked to the pond.|One day|In the end|After that
      The duck jumped in. ___, it swam to the other side.|Then|One day|In the end
      It met a frog. ___, they played all afternoon.|After that|One day|Once upon a time
      ___, the duck went home tired and happy.|In the end|One day|Then
      ___, a boy found a map in the attic.|One day|In the end|After that
      He read the map. ___, he dug by the old tree.|Then|One day|In the end
      He found a box. ___, he opened it slowly.|After that|One day|Once upon a time
      ___, the box was full of his grandpa's old toys.|In the end|One day|Then
      ___, a girl planted a bean.|One day|In the end|After that
      The bean grew tall. ___, it touched the clouds.|In the end|One day|Once upon a time
      ___, a small bunny lived in a garden.|Once upon a time|In the end|After that
      The bunny saw a carrot. ___, it hopped over to eat it.|Then|Once upon a time|In the end
      A dog came by. ___, the bunny ran to its hole.|After that|One day|Once upon a time
      ___, the bunny was safe and fell asleep.|In the end|One day|Then
      ___, Max found a lost puppy in the rain.|One day|In the end|After that
      He took the puppy home. ___, he gave it a warm bath.|Then|One day|In the end
      He made signs. ___, a girl called and said it was hers.|After that|Once upon a time|One day
      ___, the puppy went home with the happy girl.|In the end|One day|Then
      ___, a girl named Rosa wanted to fly a kite.|One day|In the end|After that
      She made a kite out of paper. ___, she took it to the hill.|Then|One day|In the end
      The wind was strong. ___, the kite went up high.|After that|One day|Once upon a time
      ___, Rosa flew her kite until the sun went down.|In the end|One day|Then
      ___, two friends wanted to build a fort.|One day|In the end|After that
      They found some sticks. ___, they tied them together.|Then|One day|In the end
      They added a blanket for a roof. ___, they sat inside.|After that|Once upon a time|One day
      ___, their fort was the best one on the street.|In the end|One day|Then
      ___, a little seed fell into the dirt.|Once upon a time|In the end|After that
      Rain fell on the seed. ___, it began to grow roots.|Then|Once upon a time|In the end
      The sun shone. ___, a green sprout came up.|After that|One day|Once upon a time
      ___, the seed became a tall sunflower.|In the end|One day|Then
      `,
      (right, shown) => {
        const part =
          right === "One day" || right === "Once upon a time"
            ? ["opening", "开头"]
            : right === "In the end"
              ? ["ending", "结尾"]
              : ["next step in the middle", "中间承接"];
        return [
          `*${filled(shown, right)}* — **${right}** fits the **${part[0]}** of the story.\n\n**Check.** Read *${filled(shown, right)}* aloud: **${right}** matches where this sentence sits (beginning, middle, or end).`,
          `*${filled(shown, right)}* —— **${right}** 适合故事的**${part[1]}**部分。\n\n**检验。** 大声读一遍 *${filled(shown, right)}*：**${right}** 和这句话在故事里的位置（开头、中间或结尾）完全吻合。`,
        ];
      },
      [
        [
          "*{wrong}* belongs at a different part of a story (beginning, middle, or end).",
          "*{wrong}* 应该用在故事的另一部分（开头、中间或结尾）。",
        ],
        [
          "Put *{wrong}* in the blank—it does not fit whether this sentence opens, continues, or finishes the story.",
          "把 *{wrong}* 填进空格读一读，它和这句话是在开头、承接还是收尾对不上。",
        ],
      ],
    ),
    choose(
      "the-sentence-out-of-order",
      ["The Sentence Out of Order", "顺序错了的句子"],
      [
        "Every event in a story must come *after* what makes it happen: you have to bake a cake before you can eat it!\n\n> **Watch out.** Check the first sentence and the last sentence—if the ending shows up first, the order is backwards.",
        "故事里的每件事都必须发生在导致它的事*之后*：总得先烤好蛋糕，才能吃蛋糕！\n\n> **注意。** 重点看第一句和最后一句——如果结果跑到了最前面，顺序就反了。",
      ],
      ["Which story is in the right order?", "哪个故事的顺序是对的？"],
      `
      baking a cake|We mixed the batter. Then we baked it. In the end, we ate the cake.|We ate the cake. Then we baked it. In the end, we mixed the batter.|We baked it. We ate the cake. In the end, we mixed the batter.
      planting a seed|I planted a seed. Then I watered it. In the end, a flower grew.|A flower grew. Then I planted a seed. In the end, I watered it.|I watered it. A flower grew. In the end, I planted a seed.
      a lost dog|My dog ran off. Then we looked all over. In the end, we found him.|We found him. Then my dog ran off. In the end, we looked all over.|We looked all over. We found him. In the end, my dog ran off.
      a snowman|Snow fell all night. Then we made a snowman. In the end, it melted.|It melted. Then snow fell all night. In the end, we made a snowman.|We made a snowman. It melted. In the end, snow fell all night.
      a birthday|Mom lit the candles. Then I made a wish. In the end, I blew them out.|I blew them out. Then Mom lit the candles. In the end, I made a wish.|I made a wish. I blew them out. In the end, Mom lit the candles.
      a broken toy|My toy broke. Then Dad glued it. In the end, it worked again.|It worked again. Then my toy broke. In the end, Dad glued it.|Dad glued it. It worked again. In the end, my toy broke.
      a trip|We packed our bags. Then we got on the train. In the end, we got to Gran's house.|We got to Gran's house. Then we packed our bags. In the end, we got on the train.|We got on the train. We got to Gran's house. In the end, we packed our bags.
      a race|The race began. Then I ran as fast as I could. In the end, I crossed the line.|I crossed the line. Then the race began. In the end, I ran fast.|I ran fast. I crossed the line. In the end, the race began.
      a rainy day|Dark clouds came. Then it rained. In the end, the sun came out.|The sun came out. Then dark clouds came. In the end, it rained.|It rained. The sun came out. In the end, dark clouds came.
      a letter|I wrote a letter. Then I mailed it. In the end, my friend read it.|My friend read it. Then I wrote a letter. In the end, I mailed it.|I mailed it. My friend read it. In the end, I wrote a letter.
      washing the car|We got a bucket of soap. Then we scrubbed the car. In the end, the car was shiny.|The car was shiny. Then we scrubbed the car. In the end, we got a bucket of soap.|We scrubbed the car. The car was shiny. In the end, we got a bucket of soap.
      a picnic|We packed a basket. Then we went to the park. In the end, we ate on a blanket.|We ate on a blanket. Then we went to the park. In the end, we packed a basket.|We went to the park. We ate on a blanket. In the end, we packed a basket.
      a lost tooth|My tooth got loose. Then it fell out. In the end, I put it under my pillow.|I put it under my pillow. Then it fell out. In the end, my tooth got loose.|It fell out. I put it under my pillow. In the end, my tooth got loose.
      making a card|I folded the paper. Then I drew a heart on it. In the end, I gave it to Mom.|I gave it to Mom. Then I drew a heart on it. In the end, I folded the paper.|I drew a heart on it. I gave it to Mom. In the end, I folded the paper.
      a new puppy|We picked out a puppy. Then we brought it home. In the end, it slept in its new bed.|It slept in its new bed. Then we brought it home. In the end, we picked out a puppy.|We brought it home. It slept in its new bed. In the end, we picked out a puppy.
      a sand castle|We filled the pail with sand. Then we turned it over. In the end, we had a castle.|We had a castle. Then we turned it over. In the end, we filled the pail with sand.|We turned it over. We had a castle. In the end, we filled the pail with sand.
      a bath|I filled the tub. Then I washed with soap. In the end, I dried off with a towel.|I dried off with a towel. Then I washed with soap. In the end, I filled the tub.|I washed with soap. I dried off with a towel. In the end, I filled the tub.
      a sick day|I woke up with a cold. Then I stayed in bed. In the end, I felt better.|I felt better. Then I stayed in bed. In the end, I woke up with a cold.|I stayed in bed. I felt better. In the end, I woke up with a cold.
      a pumpkin|We picked a pumpkin. Then we carved a face. In the end, we put a light inside.|We put a light inside. Then we carved a face. In the end, we picked a pumpkin.|We carved a face. We put a light inside. In the end, we picked a pumpkin.
      a soccer game|The game started. Then I kicked the ball. In the end, we won the game.|We won the game. Then I kicked the ball. In the end, the game started.|I kicked the ball. We won the game. In the end, the game started.
      a lemonade stand|We made lemonade. Then we set up a table. In the end, we sold every cup.|We sold every cup. Then we set up a table. In the end, we made lemonade.|We set up a table. We sold every cup. In the end, we made lemonade.
      a haircut|I sat in the chair. Then the barber cut my hair. In the end, I looked in the mirror.|I looked in the mirror. Then the barber cut my hair. In the end, I sat in the chair.|The barber cut my hair. I looked in the mirror. In the end, I sat in the chair.
      a sleepover|My friend came over. Then we watched a movie. In the end, we fell asleep.|We fell asleep. Then we watched a movie. In the end, my friend came over.|We watched a movie. We fell asleep. In the end, my friend came over.
      a pet fish|We got a tank. Then we filled it with water. In the end, we put the fish in.|We put the fish in. Then we filled it with water. In the end, we got a tank.|We filled it with water. We put the fish in. In the end, we got a tank.
      a block tower|I stacked the blocks. Then the tower got tall. In the end, it fell down.|It fell down. Then the tower got tall. In the end, I stacked the blocks.|The tower got tall. It fell down. In the end, I stacked the blocks.
      a garden|We dug the soil. Then we planted beans. In the end, we picked the beans.|We picked the beans. Then we planted beans. In the end, we dug the soil.|We planted beans. We picked the beans. In the end, we dug the soil.
      a trip to the store|We made a list. Then we drove to the store. In the end, we bought the food.|We bought the food. Then we drove to the store. In the end, we made a list.|We drove to the store. We bought the food. In the end, we made a list.
      a pancake breakfast|Dad mixed the batter. Then he cooked the pancakes. In the end, we ate them with syrup.|We ate them with syrup. Then he cooked the pancakes. In the end, Dad mixed the batter.|He cooked the pancakes. We ate them with syrup. In the end, Dad mixed the batter.
      a library visit|We walked to the library. Then I picked a book. In the end, I checked it out.|I checked it out. Then I picked a book. In the end, we walked to the library.|I picked a book. I checked it out. In the end, we walked to the library.
      a play|We practiced our lines. Then we put on our costumes. In the end, we did the show.|We did the show. Then we put on our costumes. In the end, we practiced our lines.|We put on our costumes. We did the show. In the end, we practiced our lines.
      `,
      (right) => [
        `*${right}* puts all three events in cause-and-effect order.\n\n**Check.** Ask between each pair of sentences: *Can the second thing happen without the first?* No—so step 1, step 2, and step 3 are in the right order.`,
        `*${right}* 按先因后果的顺序排好了三件事。\n\n**检验。** 逐一检查相邻两句：*没有前面那一步，后面那一步能发生吗？* 不能——所以第 1、2、3 步顺序完全正确。`,
      ],
      [
        [
          "*{wrong}* puts the ending at the very start, before the cause even happens.",
          "*{wrong}* 把结尾放到了最开头，结果跑在了原因前面。",
        ],
        ["*{wrong}* puts the starting step at the very end, which is backwards.", "*{wrong}* 把最先做的那一步放到了最后，顺序颠倒了。"],
      ],
    ),
  ],
});

const belong = topic("writing", {
  id: "facts-that-belong-together",
  title: ["Facts That Belong Together", "属于同一主题的事实"],
  summary: ["Keep a short report on its topic: every fact should be about it.", "让短小的报告紧扣主题：每个事实都要和主题有关。"],
  intro: [
    "Suppose you are writing a mini-report on penguins, and you suddenly add, *My bike is blue!* Even if your bike really is blue, it does not belong in a penguin report. Let's keep every fact on topic and wrap up with a strong closing sentence.",
    "假如你在写一篇关于企鹅的小报告，却突然加了一句：*My bike is blue!* 就算你的自行车真的是蓝色的，它也不属于企鹅报告。这节课我们来筛掉跑题的句子，并选出好的结尾句。",
  ],
  after: ["the-main-topic-of-a-text", "a-sentence-tells-a-whole-idea"],
  xp: 10,
  points: [
    choose(
      "the-fact-that-does-not-belong",
      ["The Fact That Does Not Belong", "不属于这里的事实"],
      [
        "A report stays focused on **one topic**. Every fact must teach about that topic—even a true fact gets cut if it is about something else.\n\n> **Watch out.** Do not keep a sentence just because it is true; check whether it is about the report's topic.",
        "一篇报告只围绕**一个主题**。每个事实都要说明这个主题——就算一句话本身是真的，只要讲的是别的东西，也得删掉。\n\n> **注意。** 不要因为一句话说的是真事就留着它，要看它和报告主题有没有关系。",
      ],
      ["Which fact does not belong in a report on this topic?", "哪个事实不属于这个主题的报告？"],
      `
      Report: Sharks|Cows eat grass.|Sharks have lots of teeth.|Sharks live in the sea.
      Report: The Sun|My bike is blue.|The sun is a star.|The sun gives us light.
      Report: Frogs|Kites fly high.|Frogs can jump far.|Frogs lay eggs in water.
      Report: Apples|Snow is cold.|Apples grow on trees.|Apples can be red or green.
      Report: Owls|Fish have fins.|Owls hunt at night.|Owls have big eyes.
      Report: Rain|Dogs bark.|Rain falls from clouds.|Plants need rain.
      Report: Bees|Ships sail on the sea.|Bees make honey.|Bees live in hives.
      Report: Trains|Bananas are yellow.|Trains run on tracks.|Some trains carry coal.
      Report: Teeth|Birds build nests.|We use teeth to chew.|We brush our teeth.
      Report: Snow|Lemons are sour.|Snow is made of ice.|Snow falls when it is cold.
      Report: Whales|Cars have wheels.|Whales live in the sea.|Whales breathe air.
      Report: Bats|Pizza is hot.|Bats fly at night.|Bats sleep upside down.
      Report: Cows|Rockets go to space.|Cows eat grass.|Cows give milk.
      Report: Spiders|Grapes are purple.|Spiders spin webs.|Spiders have eight legs.
      Report: The Moon|My cat is black.|The moon goes around the earth.|The moon shines at night.
      Report: Penguins|Trucks are loud.|Penguins cannot fly.|Penguins swim fast.
      Report: Corn|Ships float.|Corn grows in fields.|Corn is yellow.
      Report: Turtles|Pianos have keys.|Turtles have hard shells.|Some turtles live in the sea.
      Report: Clouds|I like soup.|Clouds are made of water.|Dark clouds bring rain.
      Report: Ants|Kites are fun.|Ants live in groups.|Ants carry food.
      Report: Camels|Bikes have pedals.|Camels live in the desert.|Camels have humps.
      Report: Pumpkins|Fish swim.|Pumpkins grow on vines.|Pumpkins are orange.
      Report: Elephants|My hat is red.|Elephants have trunks.|Elephants are very big.
      Report: Wind|Cats like milk.|Wind is moving air.|Wind can push sailboats.
      Report: Butterflies|Buses are yellow.|Butterflies have four wings.|Butterflies drink from flowers.
      Report: Ducks|Books have pages.|Ducks have webbed feet.|Ducks swim on ponds.
      Report: The Heart|Kites fly high.|The heart pumps blood.|The heart beats all day.
      Report: Squirrels|Lemons are sour.|Squirrels bury nuts.|Squirrels climb trees.
      Report: Volcanoes|Dogs wag their tails.|Volcanoes are mountains.|Hot rock comes out of volcanoes.
      Report: Beavers|Snow is white.|Beavers build dams.|Beavers cut trees with their teeth.
      `,
      (right, shown) => {
        const subject = shown.replace("Report: ", "");
        return [
          `*${right}* does not belong because it is not about **${subject}**.\n\n**Check.** Put **${subject}** next to *${right}*: it teaches nothing about **${subject}**, whereas the other two sentences both give facts about **${subject}**.`,
          `*${right}* 不属于这里，因为它和主题 **${subject}** 无关。\n\n**检验。** 把 **${subject}** 和 *${right}* 放在一起看：这句话完全没讲 **${subject}**，而另外两句都在介绍 **${subject}**。`,
        ];
      },
      [
        ["*{wrong}* teaches a real fact about this report's topic, so it belongs.", "*{wrong}* 讲的正是本报告主题的事实，应该保留。"],
        [
          "*{wrong}* stays right on topic—we are looking for the sentence that drifts off topic.",
          "*{wrong}* 紧扣主题——我们要找的是跑题的那一句。",
        ],
      ],
    ),
    choose(
      "a-closing-sentence",
      ["A Closing Sentence", "结尾句"],
      [
        "End a short report with a **closing sentence** that wraps up the big idea: *Bees make honey. They help flowers grow. **Bees are small, but they do a big job!***\n\n> **Watch out.** A closing sentence should wrap up the same topic—never jump to a brand-new subject.",
        "用一句总结大意的**结尾句**收尾：*Bees make honey. They help flowers grow. **Bees are small, but they do a big job!***\n\n> **注意。** 结尾句要收束同一个主题，不要突然跳到毫不相干的新话题。",
      ],
      ["Which is the best closing sentence for this report?", "哪个是这篇报告最好的结尾句？"],
      `
      Bees make honey. They help flowers grow.|Bees are small, but they do a big job!|I like cake.|Some birds eat bees.
      Owls hunt at night. They see well in the dark.|Owls are great night hunters.|My cat sleeps at night.|The moon is bright.
      Trees give us shade. They give us wood and fruit.|Trees help us in many ways.|I climbed a hill.|Some trees are tall.
      Frogs start as eggs. Then they become tadpoles.|Frogs change a lot as they grow.|Fish live in ponds.|I saw a duck.
      Dogs can guide people. They can find lost people.|Dogs are good helpers.|Cats like milk.|I have a red ball.
      The sun gives light. It keeps the earth warm.|We could not live without the sun.|The moon is at night.|I wear a hat.
      Penguins cannot fly. They are great swimmers.|Penguins are birds that swim instead of fly.|Bats can fly.|It is cold today.
      Rain fills rivers. Plants drink the rain.|Rain is important for all living things.|I have a red coat.|Clouds can be white.
      Teeth help us chew. Brushing keeps them clean.|Take good care of your teeth!|Bread is soft.|My dad has a car.
      Ants carry food. They work together.|Ants are tiny, but they are strong team workers.|Bees are yellow.|I went to the park.
      Bats fly at night. They eat lots of bugs.|Bats are helpful night flyers.|I like the day.|Owls fly too.
      Cows give milk. Milk makes cheese and butter.|Cows give us many good foods.|Pigs like mud.|I had juice.
      Spiders spin webs. Webs catch bugs.|Spiders are clever hunters.|Ants are small.|I saw a bug.
      Whales are huge. They breathe air like us.|Whales are amazing sea animals.|Fish have gills.|The sea is blue.
      Squirrels bury nuts. They dig them up in winter.|Squirrels plan ahead for winter.|Birds fly south.|I like nuts.
      Camels live in the desert. They can go days without water.|Camels are made for dry places.|Fish need water.|The sun is hot.
      Turtles have shells. Their shells keep them safe.|A turtle's shell is like a little house.|Snails are slow.|I have a pet cat.
      Elephants use their trunks to eat. They also use them to drink.|An elephant's trunk is very useful.|Giraffes are tall.|I saw a zoo.
      Leaves fall in autumn. New leaves grow in spring.|Trees change with the seasons.|I like winter.|Flowers smell nice.
      Butterflies start as eggs. Then they are caterpillars.|Butterflies change in amazing ways.|Moths fly at night.|I saw a bee.
      Firefighters put out fires. They teach fire safety too.|Firefighters keep us safe.|Police cars are fast.|I have a red hat.
      Ducks have webbed feet. Their feathers stay dry.|Ducks are made for the water.|Chickens lay eggs.|It rained today.
      Recycling saves trees. It keeps trash out of the ground.|Recycling helps our planet.|Trucks are big.|I ate a plum.
      Plants need sun. They also need water.|Plants need care to grow.|Rocks do not grow.|I have a bike.
      Beavers build dams. They live in lodges.|Beavers are busy builders.|Otters swim.|I like rivers.
      Bread starts as wheat. Mills grind wheat into flour.|Bread takes many steps to make.|Cake is sweet.|I went to school.
      Clouds hold water. They let it fall as rain.|Clouds give the earth its rain.|Kites fly in the sky.|My shoes are new.
      Pandas eat bamboo. They eat for many hours a day.|Pandas spend their days eating.|Bears sleep in winter.|I like green.
      Snakes have no legs. They slide on the ground.|Snakes move in their own way.|Worms are long.|I saw a frog.
      Our hearts pump blood. Exercise makes them strong.|Keep your heart healthy by moving!|Lungs take in air.|I have a dog.
      `,
      (right, shown) => [
        `*${right}* wraps up the whole report cleanly.\n\n**Check.** Read the report aloud with *${right}* at the end: *${shown} ${right}* — it stays on the same topic and ties both facts together.`,
        `*${right}* 稳稳地收束了整篇报告。\n\n**检验。** 把 *${right}* 接在末尾通读一遍：*${shown} ${right}* —— 紧扣同一主题，把前面两个事实串成了一个总结。`,
      ],
      [
        ["*{wrong}* switches to a different topic instead of closing this report.", "*{wrong}* 跳到了别的话题，没有收束这篇报告。"],
        ["*{wrong}* adds a side thought instead of summing up the report's main idea.", "*{wrong}* 只是旁枝末节，没有总结报告的主旨。"],
      ],
    ),
  ],
});

const thanks = topic("writing", {
  id: "writing-a-thank-you-note",
  title: ["Writing a Thank-You Note", "写感谢便条"],
  summary: [
    "A thank-you note greets the person, says what you are thankful for and why, and closes with your name.",
    "感谢便条要先问候对方，说明感谢什么和为什么，最后署上自己的名字。",
  ],
  intro: [
    "Your aunt sends you a warm scarf for winter. Writing a **thank-you note** shows you noticed and care! A great note has three parts—a greeting, a body that says *why*, and a closing with your name.",
    "阿姨冬天寄给你一条暖和的围巾。写一张**感谢便条**，能让她知道你很喜欢也很感激！一张好的感谢便条有三个部分：称呼、说明原因的正文，以及带署名的结束语。",
  ],
  after: ["commas-in-letters"],
  xp: 10,
  points: [
    label(
      "parts-of-a-note",
      ["Parts of a Note", "便条的组成部分"],
      [
        "A thank-you note has three parts: a **greeting** (*Dear Gran,*), a **body** (what you are thankful for and why), and a **closing** with your name (*Love, Sam*).\n\n> **Watch out.** Do not confuse the greeting (who the note is *to*) with the closing (who the note is *from*).",
        "感谢便条有三个部分：**称呼**（*Dear Gran,*）、**正文**（感谢什么和为什么），以及带署名的**结束语**（*Love, Sam*）。\n\n> **注意。** 别把称呼（写给*谁*）和结束语（*谁*写的）弄混。",
      ],
      ["Which part of a thank-you note is this?", "这是感谢便条的哪一部分？"],
      `
      Dear Aunt May,|greeting
      Thank you for the red scarf. It keeps me warm at the bus stop.|body
      Love, Kim|closing
      Dear Mr. Lee,|greeting
      Thank you for teaching me to swim. Now I can swim across the pool.|body
      Your student, Ben|closing
      Dear Grandpa,|greeting
      Thank you for the book about stars. I read it every night.|body
      Best wishes, Ann|closing
      Dear Coach,|greeting
      Thank you for helping our team. We had so much fun this year.|body
      Your friend, Tom|closing
      Dear Uncle Joe,|greeting
      Thank you for the puzzle. We did it together on a rainy day.|body
      Your nephew, Sam|closing
      Dear Ms. Park,|greeting
      Thank you for reading to our class. The story about the whale was my favorite.|body
      Love, Mia|closing
      Dear Grandma,|greeting
      Thank you for the cookies. I shared them with my friends.|body
      Thanks again, Leo|closing
      Dear Mrs. Diaz,|greeting
      Thank you for helping me find my lost dog. He is safe at home now.|body
      Sincerely, Ava|closing
      Dear Cousin Ray,|greeting
      Thank you for the game. We play it every night after dinner.|body
      Your cousin, Nina|closing
      Dear Nurse Kim,|greeting
      Thank you for taking care of me when I hurt my knee.|body
      From, Omar|closing
      `,
      {
        greeting: L(
          "称呼",
          "It greets the person the note is written to.",
          "它向收便条的人打招呼。",
          "*{shown}* does not start with *Dear* to greet the reader.",
          "*{shown}* 不是以 *Dear* 开头向收信人问候。",
        ),
        body: L(
          "正文",
          "It tells what you are thankful for and why.",
          "它写出了你感谢什么以及为什么感谢。",
          "*{shown}* is too short to be the main message—it does not explain the thanks.",
          "*{shown}* 并不是正文内容，没有写出具体感谢的事。",
        ),
        closing: L(
          "结束语",
          "It signs off the note with the writer's name.",
          "它用告别语和写信人的名字来收尾。",
          "*{shown}* does not sign off at the bottom with the writer's name.",
          "*{shown}* 不是便条末尾的结束语和署名。",
        ),
      },
      (right, shown, entry) => [
        `*${shown}* is the **${right}** of the note. ${entry.why[0]}\n\n**Check.** Picture where *${shown}* sits on the page: ${right === "greeting" ? "at the very top, starting with *Dear* → **greeting**." : right === "body" ? "in the middle, giving the full thank-you sentences → **body**." : "at the very bottom, with a sign-off and name → **closing**."}`,
        `*${shown}* 是便条的**${entry.zh}**。${entry.why[1]}\n\n**检验。** 想象 *${shown}* 在信纸上的位置：${right === "greeting" ? "在最开头，以 *Dear* 打招呼 → **称呼**。" : right === "body" ? "在中间，写出完整的感谢句子 → **正文**。" : "在最末尾，带着告别语和署名 → **结束语**。"}`,
      ],
    ),
    choose(
      "saying-why",
      ["Saying Why", "说明原因"],
      [
        "A thoughtful thank-you note tells **why** the gift or help matters to you: *Thank you for the ball. **I play with it every day at recess.***\n\n> **Watch out.** A random fact about the gift (*Balls are round.*) does not show why *you* are thankful.",
        "真诚的感谢便条会说出礼物或帮助对你**为什么**重要：*Thank you for the ball. **I play with it every day at recess.***\n\n> **注意。** 只说一句关于礼物的泛泛事实（如 *Balls are round.*），并没有说出*你*为什么感谢。",
      ],
      ["Which sentence best says why?", "哪个句子最好地说明了原因？"],
      `
      Thank you for the ball.|I play with it every day at recess.|I have a dog.|It is Monday.
      Thank you for the books.|I read one every night before bed.|My room is blue.|I like pizza.
      Thank you for helping me fix my bike.|Now I can ride to school again.|Bikes have wheels.|It was hot.
      Thank you for the warm hat.|My ears stay warm in the snow.|Hats can be red.|I have a cat.
      Thank you for the paints.|I painted a picture of our house.|Paint is wet.|I went to the shop.
      Thank you for coming to my party.|It was more fun with you there.|Parties have cake.|I am seven.
      Thank you for the seeds.|We planted them, and now we have beans.|Seeds are small.|I like the rain.
      Thank you for teaching me to read.|Now I can read stories to my sister.|Books have pages.|School is big.
      Thank you for the kite.|It flew so high at the beach.|Kites need wind.|I ate a plum.
      Thank you for walking my dog.|He was so happy to go out.|Dogs have tails.|It is cold.
      Thank you for the puzzle.|We finished it on a rainy day.|Puzzles have pieces.|I am six.
      Thank you for the socks.|My feet are warm on cold mornings.|Socks come in pairs.|I like apples.
      Thank you for reading to us.|Now our class loves stories.|Books are on shelves.|It was Tuesday.
      Thank you for the crayons.|I drew a picture for you.|Crayons can break.|My bag is red.
      Thank you for fixing the swing.|Now we can swing at recess again.|Swings are fun.|I ate lunch.
      Thank you for the game.|We play it every night after dinner.|Games have rules.|It is sunny.
      Thank you for the cookies.|I shared them with my friends.|Cookies have sugar.|My shoe is new.
      Thank you for the flowers.|They make our kitchen smell sweet.|Flowers grow in dirt.|I have a cat.
      Thank you for helping me find my cat.|She is safe at home now.|Cats like to nap.|I went to school.
      Thank you for the jacket.|I wore it to the snowy park.|Jackets have zippers.|I like soup.
      Thank you for the trip to the zoo.|I loved seeing the lions.|Zoos are big.|It was hot.
      Thank you for the card.|It made me smile when I was sick.|Cards are paper.|My dog barks.
      Thank you for the backpack.|All my books fit inside it.|Bags can be blue.|I am tall.
      Thank you for teaching me to swim.|Now I can swim across the pool.|Pools are wet.|I like pie.
      Thank you for the music lessons.|I can play a song on the piano now.|Pianos are big.|I have a hat.
      Thank you for the lunch.|The sandwich was so good.|Bread is soft.|It is Friday.
      Thank you for the stickers.|I put them on my notebook.|Stickers are sticky.|I have a fish.
      Thank you for the ride.|I got to school on time.|Cars have wheels.|I like rain.
      Thank you for the plant.|It grew a new leaf this week.|Plants are green.|I ate a snack.
      Thank you for visiting.|We had so much fun playing together.|Visits are short.|My room is big.
      `,
      (right, shown) => [
        `*${right}* tells why the gift or help mattered to you.\n\n**Check.** Read the two sentences together—*${shown} ${right}*—and imagine getting this note: you can tell right away how the gift or help was used and enjoyed.`,
        `*${right}* 说出了这份礼物或帮助为什么对你很重要。\n\n**检验。** 把两句连起来读——*${shown} ${right}*——想象收到这张便条的人，一眼就能感受到这份心意派上了用场。`,
      ],
      [
        [
          "*{wrong}* may be a true fact, but it does not say how the gift or help mattered to you.",
          "*{wrong}* 也许是真的，但没有说明礼物或帮助对你有什么意义。",
        ],
        ["*{wrong}* is off topic and has nothing to do with the thank-you.", "*{wrong}* 跑题了，和感谢的事情无关。"],
      ],
    ),
  ],
});

/** readingTopics2 are the reading topics of grade 2 beyond phonics. */
export const readingTopics2: readonly TopicDef[] = [parts, mainTopic, feelings];

/** wordTopics2 are the vocabulary topics of grade 2. */
export const wordTopics2: readonly TopicDef[] = [prefixes, shades];

/** writingTopics2 are the writing topics of grade 2. */
export const writingTopics2: readonly TopicDef[] = [storyOrder, belong, thanks];
