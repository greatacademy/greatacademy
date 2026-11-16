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
  after: ["what-happens-first-next-and-last"],
  xp: 10,
  points: [
    label(
      "which-part-is-it",
      ["Which Part Is It", "这是哪一部分"],
      [
        "The **beginning** of a story tells who is in it and where. In the **middle**, a problem comes up and the characters try to fix it. At the **end**, the problem is solved.",
        "故事的**开头**交代人物和地点。在**中间**部分，出现了一个问题，人物们设法解决它。到了**结尾**，问题解决了。",
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
          "It tells who is in the story and where, before anything goes wrong.",
          "它交代了故事中的人物和地点，问题还没有出现。",
          "It does not just tell who and where; something is already happening.",
          "它不只是交代人物和地点，事情已经在发生了。",
        ),
        middle: L(
          "中间",
          "A problem comes up, and it is not solved yet.",
          "出现了一个问题，还没有解决。",
          "There is no problem here that still needs to be solved.",
          "这里没有一个尚待解决的问题。",
        ),
        end: L(
          "结尾",
          "The problem is solved and the story finishes.",
          "问题解决了，故事结束了。",
          "The problem is not solved yet, so it is not the end.",
          "问题还没有解决，所以不是结尾。",
        ),
      },
    ),
    choose(
      "how-the-problem-is-solved",
      ["How the Problem Is Solved", "问题是怎样解决的"],
      [
        "To understand a story, find the **problem** in the middle and how it is **solved** at the end. Ask: *What went wrong? What fixed it?*",
        "要读懂一个故事，就要找到中间部分的**问题**，以及结尾时它是怎样**解决**的。问一问：*出了什么问题？是什么解决了它？*",
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
      (right) => [`The end of the story tells it: ${right}`, `故事的结尾说明了这一点：${right}`],
      [
        ["*{wrong}* is not what the story says.", "故事里没有这样说：*{wrong}*。"],
        ["*{wrong}* would not solve the problem.", "*{wrong}* 并不能解决这个问题。"],
      ],
    ),
  ],
});

const mainTopic = topic("reading", {
  id: "the-main-topic-of-a-text",
  title: ["The Main Topic of a Text", "短文的主题"],
  summary: ["Tell what a whole text of facts is mostly about.", "说出一篇讲事实的短文主要讲了什么。"],
  after: ["finding-facts-in-a-text"],
  xp: 10,
  points: [
    choose(
      "what-is-it-mostly-about",
      ["What Is It Mostly About", "主要讲什么"],
      [
        "The **main topic** is what the whole text is about, not just one fact in it. Ask: *What do all the sentences tell about?* The title often helps.",
        "**主题**是整篇短文讲的内容，而不只是其中一个事实。问一问：*所有的句子都在讲什么？*。标题常常能帮上忙。",
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
      (right) => [`Every sentence tells about ${right}, so that is the main topic.`, `每个句子都在讲 ${right}，所以这就是主题。`],
      [
        ["*{wrong}* is only in one sentence, so it is a detail.", "*{wrong}* 只出现在一个句子里，所以只是一个细节。"],
        ["*{wrong}* is mentioned, but the text is not mostly about it.", "短文提到了 *{wrong}*，但主要不是讲它。"],
      ],
    ),
    choose(
      "the-best-title",
      ["The Best Title", "最好的标题"],
      [
        "A good **title** names the main topic. It covers the whole text, not just one fact.",
        "好的**标题**要说出主题。它要概括整篇短文，而不只是其中一个事实。",
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
      (right) => [`*${right}* names what the whole text is about.`, `*${right}* 说出了整篇短文讲的内容。`],
      [
        ["*{wrong}* names only one detail.", "*{wrong}* 只说出了一个细节。"],
        ["*{wrong}* is too small to cover the whole text.", "*{wrong}* 范围太小，概括不了整篇短文。"],
      ],
    ),
  ],
});

const feelings = topic("reading", {
  id: "how-characters-feel",
  title: ["How Characters Feel", "人物的感受"],
  summary: ["Tell how a character feels from what they say and do.", "从人物说的话和做的事判断他们的感受。"],
  after: ["who-and-where-in-a-story"],
  xp: 10,
  points: [
    choose(
      "feelings-from-actions",
      ["Feelings from Actions", "从行为看感受"],
      [
        "A story does not always say how a character feels. Look at what they **do** and **say**: someone who jumps and claps is happy; someone who hides their face may be shy or scared.",
        "故事不总是直接说出人物的感受。看看他们**做了什么**、**说了什么**：又蹦又拍手的人很开心；把脸藏起来的人可能是害羞或害怕。",
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
      (right) => [`What the character does shows that they feel ${right}.`, `人物的行为表明他们感到 ${right}。`],
      [
        ["*{wrong}* does not fit what the character does.", "*{wrong}* 和人物的行为不相符。"],
        ["Look again at what the character does: it does not show *{wrong}*.", "再看看人物做了什么：并没有表现出 *{wrong}*。"],
      ],
    ),
    choose(
      "why-they-feel-that-way",
      ["Why They Feel That Way", "为什么会有这种感受"],
      [
        "Feelings have **reasons**. A character is sad because something went wrong, or glad because something good happened. Find what happened just before.",
        "感受都有**原因**。人物难过是因为出了问题，高兴是因为发生了好事。找一找就在这之前发生了什么。",
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
      (right) => [`The story gives the reason: ${right}`, `故事给出了原因：${right}`],
      [
        ["*{wrong}* would cause a different feeling.", "*{wrong}* 会引起另一种感受。"],
        ["*{wrong}* is not in the story.", "故事里没有提到：*{wrong}*。"],
      ],
    ),
  ],
});

const prefixes = topic("vocabulary", {
  id: "prefixes-un-and-re",
  title: ["The Prefixes Un- and Re-", "前缀 un- 和 re-"],
  summary: ["*Un-* means *not* or undoes an action; *re-* means *again*.", "*un-* 表示*不*或撤销一个动作；*re-* 表示*再一次*。"],
  after: ["reading-words-with-silent-e"],
  xp: 10,
  points: [
    choose(
      "what-the-new-word-means",
      ["What the New Word Means", "新词的意思"],
      [
        "A **prefix** goes at the front of a word and changes its meaning. **Un-** means *not*: *unhappy* is *not happy*; or it undoes something: *unlock*. **Re-** means *again*: *redo* is *do again*.",
        "**前缀**放在词的前面，会改变词的意思。**un-** 表示*不*：*unhappy* 就是*不开心*；也可以表示撤销：*unlock*（开锁）。**re-** 表示*再一次*：*redo* 就是*再做一次*。",
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
      (right, shown) => [`*${shown}* means *${right}*.`, `*${shown}* 的意思是 *${right}*。`],
      [
        ["*{wrong}* gives the meaning of the other prefix.", "*{wrong}* 是另一个前缀的意思。"],
        ["*{wrong}* is not what the prefix means.", "*{wrong}* 不是这个前缀的意思。"],
      ],
    ),
    choose(
      "the-word-that-fits",
      ["The Word That Fits", "合适的词"],
      [
        "Read the sentence and think about the meaning you need: *not* or *undo* calls for **un-**; *again* calls for **re-**.",
        "读一读句子，想一想需要的意思：表示*不*或*撤销*用 **un-**；表示*再一次*用 **re-**。",
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
      (right, shown) => [`*${filled(shown, right)}* has the meaning the sentence needs.`, `*${filled(shown, right)}* 符合句子需要的意思。`],
      [
        ["*{wrong}* uses the wrong prefix for this meaning.", "*{wrong}* 用的前缀不符合这个意思。"],
        ["*{wrong}* does not make sense here.", "*{wrong}* 在这里说不通。"],
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
  after: ["describing-words"],
  xp: 10,
  points: [
    choose(
      "the-strongest-word",
      ["The Strongest Word", "最强烈的词"],
      [
        "Some words mean almost the same, but one is **stronger**: *big* → *huge* → *giant*; *walk* → *run* → *dash*. Choosing the right one tells the reader exactly how much.",
        "有些词意思差不多，但其中一个**更强烈**：*big* → *huge* → *giant*；*walk* → *run* → *dash*。选对词，读者就能确切知道程度有多深。",
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
      old, ancient|ancient|old|aged
      bright, shiny|dazzling|bright|shiny
      cry, sob|wail|cry|sob
      talk, shout|scream|talk|shout
      surprised, shocked|stunned|surprised|shocked
      `,
      (right, shown) => [
        `*${right}* is the strongest of *${shown}* and *${right}*.`,
        `在 *${shown}* 和 *${right}* 中，*${right}* 最强烈。`,
      ],
      [
        ["*{wrong}* is the weakest of the three.", "*{wrong}* 是三个词中最弱的。"],
        ["*{wrong}* is in the middle, not the strongest.", "*{wrong}* 居中，不是最强烈的。"],
      ],
    ),
    choose(
      "the-word-that-fits-best",
      ["The Word That Fits Best", "最合适的词"],
      [
        "Pick the word whose strength fits the sentence: a cup of tea is *hot*, but an oven at full heat is *boiling hot*. A small sip is not a *gulp*.",
        "选一个强弱程度适合句子的词：一杯茶是 *hot*（热的），但开到最大火的烤箱是 *boiling hot*（滚烫的）。小口抿不是 *gulp*（大口吞）。",
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
        `*${filled(shown, right)}*: the strength of *${right}* fits.`,
        `*${filled(shown, right)}*：*${right}* 的强弱程度合适。`,
      ],
      [
        ["*{wrong}* is too weak or too strong for this sentence.", "*{wrong}* 对这个句子来说太弱或太强了。"],
        ["*{wrong}* means the opposite here.", "*{wrong}* 在这里意思正好相反。"],
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
  after: ["writing-steps-with-first-and-next", "past-tense-with-ed"],
  xp: 10,
  points: [
    choose(
      "the-time-word",
      ["The Time Word", "时间词"],
      [
        "Time words help a reader follow a story: ***One day*** starts it, ***Then*** and ***After that*** move it along, and ***In the end*** finishes it.",
        "时间词帮助读者理解故事：***One day*** 开始故事，***Then*** 和 ***After that*** 推动故事，***In the end*** 结束故事。",
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
      (right, shown) => [
        `*${filled(shown, right)}*: *${right}* fits this part of the story.`,
        `*${filled(shown, right)}*：*${right}* 适合故事的这一部分。`,
      ],
      [
        ["*{wrong}* belongs at another part of the story.", "*{wrong}* 应该用在故事的另一部分。"],
        ["*{wrong}* starts or ends a story, but this part is in the middle.", "*{wrong}* 用来开始或结束故事，但这一部分在中间。"],
      ],
    ),
    choose(
      "the-sentence-out-of-order",
      ["The Sentence Out of Order", "顺序错了的句子"],
      [
        "Check that each event comes after what causes it. A sentence about eating the cake cannot come before the cake is baked.",
        "检查每件事是否都在导致它的事之后发生。吃蛋糕的句子不能出现在烤蛋糕之前。",
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
      (right) => [`In *${right}*, each event comes after what causes it.`, `在 *${right}* 中，每件事都在导致它的事之后。`],
      [
        ["*{wrong}* puts the end first.", "*{wrong}* 把结尾放在了最前面。"],
        ["*{wrong}* puts the first event last.", "*{wrong}* 把第一件事放在了最后。"],
      ],
    ),
  ],
});

const belong = topic("writing", {
  id: "facts-that-belong-together",
  title: ["Facts That Belong Together", "属于同一主题的事实"],
  summary: ["Keep a short report on its topic: every fact should be about it.", "让短小的报告紧扣主题：每个事实都要和主题有关。"],
  after: ["the-main-topic-of-a-text", "a-sentence-tells-a-whole-idea"],
  xp: 10,
  points: [
    choose(
      "the-fact-that-does-not-belong",
      ["The Fact That Does Not Belong", "不属于这里的事实"],
      [
        "A short report is about **one topic**. Every fact in it should tell about that topic. A fact about something else does not belong, even if it is true.",
        "短小的报告只讲**一个主题**。其中的每个事实都要说明这个主题。讲别的东西的事实不属于这里，即使它是真的。",
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
      (right, shown) => [
        `*${right}* is not about the topic of the report (${shown.replace("Report: ", "")}).`,
        `*${right}* 和报告的主题（${shown.replace("Report: ", "")}）无关。`,
      ],
      [
        ["*{wrong}* is about the topic, so it belongs.", "*{wrong}* 和主题有关，所以属于这里。"],
        ["*{wrong}* tells about the topic, so keep it.", "*{wrong}* 说明了主题，所以应该保留。"],
      ],
    ),
    choose(
      "a-closing-sentence",
      ["A Closing Sentence", "结尾句"],
      [
        "End a short report with a **closing sentence** that sums up the topic: *Bees are small, but they do a big job!* It should not bring in a new topic.",
        "用一个总结主题的**结尾句**来结束短小的报告：*Bees are small, but they do a big job!*。它不应该引入新的主题。",
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
      (right) => [`*${right}* sums up the topic.`, `*${right}* 总结了主题。`],
      [
        ["*{wrong}* brings in something new.", "*{wrong}* 引入了新的内容。"],
        ["*{wrong}* does not sum up the report.", "*{wrong}* 没有总结报告的内容。"],
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
  after: ["commas-in-letters"],
  xp: 10,
  points: [
    label(
      "parts-of-a-note",
      ["Parts of a Note", "便条的组成部分"],
      [
        "A thank-you note has a **greeting** (*Dear Gran,*), a **body** that says what you are thankful for and why, and a **closing** with your name (*Love, Sam*).",
        "感谢便条包括**称呼**（*Dear Gran,*）、说明感谢什么和为什么的**正文**，以及带有你名字的**结束语**（*Love, Sam*）。",
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
          "It greets the person the note is for.",
          "它问候收便条的人。",
          "It does not greet the person.",
          "它不是问候对方的话。",
        ),
        body: L(
          "正文",
          "It says what you are thankful for and why.",
          "它说明你感谢什么和为什么。",
          "It does not say what you are thankful for.",
          "它没有说明你感谢什么。",
        ),
        closing: L(
          "结束语",
          "It ends the note with your name.",
          "它用你的名字结束便条。",
          "It does not end the note with a name.",
          "它没有用名字结束便条。",
        ),
      },
    ),
    choose(
      "saying-why",
      ["Saying Why", "说明原因"],
      [
        "A good thank-you note says **why** the gift or help matters to you. *Thank you for the ball.* is fine, but *Thank you for the ball. **I play with it every day at recess.*** is better.",
        "好的感谢便条会说明礼物或帮助对你**为什么**重要。*Thank you for the ball.* 可以，但 *Thank you for the ball. **I play with it every day at recess.*** 更好。",
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
      (right) => [`*${right}* tells why it matters to you.`, `*${right}* 说明了它为什么对你重要。`],
      [
        ["*{wrong}* is true, but it does not say why you are thankful.", "*{wrong}* 也许是真的，但没有说明你为什么感谢。"],
        ["*{wrong}* has nothing to do with the thanks.", "*{wrong}* 和感谢无关。"],
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
