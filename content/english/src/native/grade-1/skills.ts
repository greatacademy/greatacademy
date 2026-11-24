// Grade 1: the first skills of reading and writing beyond decoding: who and where a story is about, what happens in
// order, facts in a short text, rhymes and syllables, telling a story from facts; and writing a whole sentence, adding a
// describing word and telling steps in order.

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

const whoAndWhere = topic("reading", {
  id: "who-and-where-in-a-story",
  title: ["Who and Where in a Story", "故事里的人物和地点"],
  summary: ["Find who a story is about and where it happens.", "找出故事讲的是谁，发生在哪里。"],
  intro: [
    "Before you tell a friend about a cartoon, they always ask two things: *Who is in it?* and *Where are they?* Stories work the same way! Let's spot the characters and the place in short stories.",
    "你给朋友讲动画片时，朋友总会问两个问题：*里面有谁？* 和 *在哪里发生？* 读故事也是一样！这节课我们来找出短故事里的人物和地点。",
  ],
  after: ["starting-a-sentence-with-a-capital"],
  xp: 10,
  points: [
    choose(
      "who-is-in-the-story",
      ["Who Is in the Story", "故事里有谁"],
      [
        "The people or animals a story is about are its **characters**. Ask *who does something?* In *Pam ran to the bus. She had a red bag.*, **Pam** runs and carries the bag, so **Pam** is the character.\n\n> **Watch out.** Places like *the bus* and things like *a red bag* are in the story, but they are not characters.",
        "故事讲到的人或动物叫作**人物**。问一问*谁做了事情？* 在 *Pam ran to the bus. She had a red bag.* 里，是 **Pam** 在跑、拎着包，所以 **Pam** 是人物。\n\n> **注意。** 像 *the bus* 这样的地点或 *a red bag* 这样的物品虽在故事里出现，但不是人物。",
      ],
      ["Who is this story about?", "这个故事讲的是谁？"],
      `
      Pam ran to the bus. She had a red bag.|Pam|the bus|a red bag
      A fox sat on a hill. It looked at the sun.|a fox|the sun|a hill
      Ben got a cake. He gave it to Mom.|Ben|a cake|the box
      The pup dug in the sand. Then it ran home.|the pup|the sand|a ball
      Kim and Dad went to the pond. They fed the ducks.|Kim and Dad|the pond|the bread
      A little hen sat on her eggs. She kept them warm.|a little hen|the eggs|the barn
      Max the cat hid in a box. He napped all day.|Max the cat|a box|the day
      Gran made soup. She let me help.|Gran|soup|the pot
      The frog sat on a log. He sang a song.|the frog|a log|a song
      Lily and Ann swam in the lake. They had fun.|Lily and Ann|the lake|the fun
      Tom ran up the hill. He saw a kite.|Tom|the hill|a kite
      A duck swam in the pond. It ate some bread.|a duck|the pond|some bread
      Mia got a new hat at the shop. She put it on.|Mia|the shop|a new hat
      The pig sat in the mud. It had a ball.|the pig|the mud|a ball
      Dad and Ben went to the shop. They got milk.|Dad and Ben|the shop|the milk
      A big bear sat by a tree. He ate some honey.|a big bear|a tree|some honey
      Rex the dog dug a hole. He hid a bone.|Rex the dog|a hole|a bone
      Mom read a book. She sat on the bed.|Mom|the bed|a book
      The owl sat in a tree. It looked for a mouse.|the owl|a tree|a mouse
      Sam and Kim made a fort in the yard. They sat in it.|Sam and Kim|the yard|a fort
      A cat sat on a mat. It licked its paw.|a cat|a mat|its paw
      Uncle Joe got a fish. He gave it to me.|Uncle Joe|a fish|the lake
      The bunny hid in the grass. It ate a carrot.|the bunny|the grass|a carrot
      Ella went to the zoo. She saw a lion.|Ella|the zoo|a lion
      The ant went up a hill. It had a crumb.|the ant|a hill|a crumb
      Gramps sat on the porch. He drank some tea.|Gramps|the porch|some tea
      A little bird sat in a nest. She sang a song.|a little bird|a nest|a song
      Nick and Pam played in the snow. They made a snowman.|Nick and Pam|the snow|a snowman
      The cow stood in the field. She ate grass.|the cow|the field|the grass
      Leo played a drum in his room. He played all day.|Leo|his room|a drum
      `,
      (right) => [
        `The story is about **${right}**—the person or animal who does the actions.\n\n**Check.** Find the action words in the story and ask *who did that?* The answer is **${right}**.`,
        `这个故事讲的是 **${right}**——故事里做动作的人或动物。\n\n**检验。** 找出故事里的动作词，问*是谁做的？* 答案正是 **${right}**。`,
      ],
      [
        ["*{wrong}* is a place or thing here, not the character the story is about.", "*{wrong}* 在这里是地点或东西，不是故事的主角人物。"],
        [
          "*{wrong}* does not act in the story, so it is not who the story is about.",
          "*{wrong}* 在故事里没有做动作，所以不是故事讲的人物。",
        ],
      ],
    ),
    choose(
      "where-it-happens",
      ["Where It Happens", "在哪里发生"],
      [
        "Where a story happens is its **setting**. Look for small place words like *in*, *at*, or *on* followed by a place: *at the park*, *in the snow*, *on a ship*.\n\n> **Watch out.** Check the exact place named in the story—do not guess a place that is not mentioned.",
        "故事发生的地方叫作**背景**。找一找 *in*、*at*、*on* 后面跟着的地点：*at the park*、*in the snow*、*on a ship*。\n\n> **注意。** 要看故事里实际写出的地点，不要猜文中没提的地方。",
      ],
      ["Where does this story happen?", "这个故事发生在哪里？"],
      `
      Sam and his dog play at the park. They run on the grass.|at the park|in a ship|at school
      It is cold in the snow. Ann makes a snowman.|in the snow|at the beach|in bed
      The kids sit in class. The teacher reads a book.|in class|at the zoo|in the pond
      Dad and I fish on a boat. We get three fish.|on a boat|in a shop|on a bus
      The ducks swim in the pond. A frog sits on a log.|in the pond|in the sky|at a shop
      We shop at the store. Mom gets milk and eggs.|at the store|at the pond|on a hill
      Meg sits in the sand at the beach. The sun is hot.|at the beach|in the snow|in a barn
      The cow eats in the barn. The pig naps in the mud.|in the barn|at school|on a ship
      The pup sleeps in bed with Ben. It is late at night.|in bed|on a boat|at the park
      Kim looks up at the sky from the hill. She sees a kite.|on the hill|in a shop|in the pond
      The pigs roll in the mud on the farm. The farmer feeds them.|on the farm|at school|in the sea
      We read books at the library. It is quiet there.|at the library|at the beach|on a farm
      Sam rides the bus to school. He sits by Kim.|on the bus|in a boat|in bed
      The fish swim in the sea. A crab walks on the sand.|in the sea|in a barn|at the shop
      Mom bakes in the kitchen. The cake smells good.|in the kitchen|in the yard|at the zoo
      The lion naps at the zoo. Kids look at him.|at the zoo|on a boat|in the snow
      I plant seeds in the garden. Then I give them water.|in the garden|in the bath|on a bus
      Ben takes a bath in the tub. He plays with a duck.|in the tub|in the pond|at school
      We swing in the yard. Dad pushes me.|in the yard|in a shop|on a ship
      The kids eat lunch in the lunchroom. It is noisy.|in the lunchroom|in the sea|on a hill
      The plane flies in the sky. It is high up.|in the sky|in the pond|at the store
      Gran naps on the couch. The cat naps there too.|on the couch|in a boat|at the zoo
      We camp in the woods. We sleep in a tent.|in the woods|at school|in a shop
      The ducks swim at the lake. We feed them bread.|at the lake|in the kitchen|on a bus
      Kim sees a doctor at the clinic. She gets a check-up.|at the clinic|at the beach|in a barn
      We ride on a train. We look out the window.|on a train|in a pond|in bed
      The hen lays eggs in the coop. The farmer gets them.|in the coop|in the sky|at school
      Dad cuts the grass in the park. The kids play there.|in the park|on a boat|in the tub
      Pam finds shells at the beach. She puts them in a pail.|at the beach|in the snow|at the shop
      We sing in the music room. Ms. Lee plays the drum.|in the music room|on a farm|in the sea
      `,
      (right) => [
        `The story takes place **${right}**.\n\n**Check.** Point to the place word in the story (*in*, *at*, or *on*): it points right to **${right}**, while the other two places are never in the story.`,
        `故事发生在 **${right}**。\n\n**检验。** 找到故事里表示方位的词（*in*、*at* 或 *on*），后面指的正是 **${right}**，而另外两个地方文里根本没出现。`,
      ],
      [
        ["*{wrong}* is a real place, but this story does not happen there.", "*{wrong}* 虽然是个地点，但这个故事不是在那里发生的。"],
        ["Read the sentences again: the characters are never *{wrong}*.", "再读一遍句子：故事里的人物没有去过 *{wrong}*。"],
      ],
    ),
  ],
});

const order = topic("reading", {
  id: "what-happens-first-next-and-last",
  title: ["What Happens First, Next and Last", "先发生什么、再发生什么、最后发生什么"],
  summary: ["Tell the order of what happens in a story.", "说出故事里事情发生的顺序。"],
  intro: [
    "Think about getting dressed for rain: you put on your boots before you splash in a puddle! Stories follow an order too—first, next, and last. Let's track what happens in order.",
    "想想下雨天出门：你总是先穿上雨靴，再去踩水坑！故事也讲究先后顺序——先发生什么、再发生什么、最后发生什么。这节课我们来理清故事的顺序。",
  ],
  after: ["who-and-where-in-a-story"],
  xp: 10,
  points: [
    choose(
      "what-happens-first",
      ["What Happens First", "最先发生什么"],
      [
        "A story tells events in the order they happen. Look at the very beginning to find what happens **first**. Words like *First*, *Then*, *Next*, and *Last* are clues.\n\n> **Watch out.** Do not pick the most exciting part at the end—check which event comes at step 1.",
        "故事按事情发生的先后顺序来讲。看故事最开头就能找到**最先**发生的事，*First*、*Then*、*Next*、*Last* 这些词都是线索。\n\n> **注意。** 不要选结尾最热闹的那件事，要看排在第 1 步的是什么。",
      ],
      ["What happens first?", "最先发生的是什么？"],
      `
      Sam got up. Then he ate. Last, he went to school.|Sam got up.|Sam ate.|Sam went to school.
      First, Kim dug a hole. Next, she put in a seed. Then she gave it water.|Kim dug a hole.|Kim put in a seed.|Kim gave it water.
      The hen sat on an egg. The egg cracked. A chick came out.|The hen sat on an egg.|The egg cracked.|A chick came out.
      Mom got the pan. She made eggs. We ate them.|Mom got the pan.|Mom made eggs.|We ate the eggs.
      Ben put on his socks. Then he put on his shoes. He ran out.|Ben put on his socks.|Ben put on his shoes.|Ben ran out.
      It got dark. The rain fell. Then the sun came back.|It got dark.|The rain fell.|The sun came back.
      First, we got the paint. Then we made a picture. Last, we hung it up.|We got the paint.|We made a picture.|We hung it up.
      The cat saw a bug. It ran to the bug. The bug flew away.|The cat saw a bug.|The cat ran to the bug.|The bug flew away.
      Dad filled the tub. I got in. Then I washed my hair.|Dad filled the tub.|I got in the tub.|I washed my hair.
      The kids lined up. They went in the bus. The bus went to the zoo.|The kids lined up.|They went in the bus.|The bus went to the zoo.
      Pam got a box. She put a toy in it. Then she gave it to Ben.|Pam got a box.|Pam put a toy in it.|Pam gave it to Ben.
      The cat woke up. It ate its food. Then it went back to sleep.|The cat woke up.|The cat ate its food.|The cat went back to sleep.
      First, I get my bag. Then I go to the bus. Last, I ride to school.|I get my bag.|I go to the bus.|I ride to school.
      The seed got water. A sprout came up. Then a flower grew.|The seed got water.|A sprout came up.|A flower grew.
      Dad got the bread. He made a sandwich. We ate it.|Dad got the bread.|Dad made a sandwich.|We ate the sandwich.
      The bird made a nest. She laid eggs. Then the eggs hatched.|The bird made a nest.|She laid eggs.|The eggs hatched.
      Kim got wet in the rain. She went home. Then she put on dry socks.|Kim got wet in the rain.|Kim went home.|Kim put on dry socks.
      First, we got the ball. Then we went to the park. Last, we played.|We got the ball.|We went to the park.|We played.
      The dog saw the cat. It barked. The cat ran up a tree.|The dog saw the cat.|The dog barked.|The cat ran up a tree.
      Mom got the soap. She washed the dishes. Then she dried them.|Mom got the soap.|Mom washed the dishes.|Mom dried the dishes.
      The snow fell. We made a snowman. Then the sun melted it.|The snow fell.|We made a snowman.|The sun melted it.
      Ben woke up. He brushed his teeth. Then he ate eggs.|Ben woke up.|Ben brushed his teeth.|Ben ate eggs.
      First, Gran got the yarn. Then she made a hat. Last, she gave it to me.|Gran got the yarn.|Gran made a hat.|Gran gave me the hat.
      The frog sat on a log. It saw a fly. It ate the fly.|The frog sat on a log.|The frog saw a fly.|The frog ate the fly.
      The kids got paper. They made a card. Then they gave it to Mom.|The kids got paper.|They made a card.|They gave it to Mom.
      The bell rang. We went out. Then we played tag.|The bell rang.|We went out.|We played tag.
      Sam got a cup. He filled it with water. Then he gave it to the plant.|Sam got a cup.|Sam filled it with water.|Sam gave it to the plant.
      The sun came up. The hen woke. Then she pecked at the corn.|The sun came up.|The hen woke.|The hen pecked at the corn.
      First, Mia put on her coat. Then she went out. Last, she played in the snow.|Mia put on her coat.|Mia went out.|Mia played in the snow.
      The car got dirty. Dad washed it. Then it was clean.|The car got dirty.|Dad washed it.|The car was clean.
      `,
      (right) => [
        `*${right}* happens first—it is the opening event of the story.\n\n**Check.** Number the three sentences 1, 2, 3 in order: *${right}* is number 1, before the other two happen.`,
        `*${right}* 最先发生，是故事开头的第一件事。\n\n**检验。** 给故事里的三句话标上 1、2、3：*${right}* 排在第 1 位，发生在另外两件事之前。`,
      ],
      [
        ["*{wrong}* happens in the middle, after the first step.", "*{wrong}* 发生在中间，不是最先发生的。"],
        ["*{wrong}* happens at the end, not at the start.", "*{wrong}* 发生在最后，不是最开始。"],
      ],
    ),
    choose(
      "what-happens-next",
      ["What Happens Next", "接下来发生什么"],
      [
        "One event leads to the next: you plant a seed **before** it grows; you get wet **after** you jump in water. Think about what must come right after what just happened.\n\n> **Watch out.** Do not pick something that already happened *before* the sentence you read.",
        "一件事会引出下一件事：先种下种子，它**才**会长大；跳进水里**之后**才会变湿。想一想刚才那件事之后顺理成章会发生什么。\n\n> **注意。** 不要选在这句话*之前*就已经做过的事。",
      ],
      ["What happens next?", "接下来会发生什么？"],
      `
      Ann plants a seed and gives it water.|The seed grows.|Ann eats lunch first.|The seed was in a bag.
      Ben jumps in the pond.|Ben gets wet.|Ben gets in the pond.|Ben puts on his hat.
      The cat sees a ball and runs to it.|The cat hits the ball.|The cat was asleep.|The cat sees the ball.
      Mom puts the cake in the hot oven.|The cake bakes.|Mom gets the eggs.|The cake is in the box.
      The bell rings at the end of the day.|The kids go home.|The kids get to school.|The kids eat lunch.
      Dad blows on the hot soup.|The soup gets cool.|The soup gets hot.|Dad makes the soup.
      It rains on the grass all day.|The grass is wet.|The grass is dry.|The sun comes out first.
      Kim drops her cup on the hard floor.|The cup breaks.|Kim fills the cup.|Kim gets a cup.
      The chick pecks at the shell.|The chick comes out.|The hen lays the egg.|The egg is in the nest.
      I put on my coat and hat.|I go out in the cold.|I take off my coat.|I get my coat.
      Ben kicks the ball very hard.|The ball flies far.|The ball gets bigger.|The ball was in a box.
      The ice cream sits in the hot sun.|The ice cream melts.|The ice cream gets cold.|Mom buys the ice cream.
      Kim gives her dog a bath.|The dog gets wet.|The dog gets muddy.|Kim gets the soap.
      The baby is tired and yawns.|The baby goes to sleep.|The baby wakes up.|The baby was in the crib.
      Sam trips on a rock.|Sam falls down.|Sam wins a prize.|Sam walks down the path.
      Mom turns off the light at night.|The room gets dark.|The room gets light.|Mom goes in the room.
      The cat sees a mouse.|The cat runs after it.|The cat eats a plum.|The cat was walking by.
      I blow up a balloon too much.|The balloon pops.|The balloon gets small.|I get a balloon.
      Dad plants a seed in the spring.|A plant grows.|The seed turns into a rock.|Dad gets a seed.
      The wind blows the kite up.|The kite flies high.|The kite falls in a box.|Kim gets the kite.
      Pam paints a picture.|She hangs it up.|The picture runs away.|She gets the paint.
      The pond freezes in the cold.|We skate on the ice.|We swim in the pond.|It gets cold.
      Ann drops an egg on the floor.|The egg cracks.|The egg bounces up.|Ann gets an egg.
      Ben is very hungry at lunch.|Ben eats his lunch.|Ben is full.|Ben packs his lunch.
      The dog hears the doorbell.|The dog barks.|The dog naps.|A friend walks up to the door.
      It snows all night.|The ground is white.|The ground is green.|The sky gets dark.
      Gran puts bread in the toaster.|The bread gets toasty.|The bread gets wet.|Gran gets the bread.
      I fill my glass with milk.|I drink the milk.|I wash the glass.|I get a glass.
      The bird finds a worm.|The bird eats the worm.|The worm eats the bird.|The bird looks for a worm.
      Mom says it is time for bed.|I put on my pajamas.|I get up.|I eat dinner.
      `,
      (right, shown) => [
        `*${right}* follows right after *${shown}*\n\n**Check.** Connect the two with *so*: *${shown.replace(/\.$/u, "")}, so ${right[0]?.toLowerCase() ?? ""}${right.slice(1)}* That makes real-life sense.`,
        `在 *${shown}* 之后，接下来顺理成章会发生：*${right}*\n\n**检验。** 用“所以”把两句连起来读：因为前面发生了那件事，所以 *${right}*，符合生活常理。`,
      ],
      [
        ["*{wrong}* does not make sense as the result of what just happened.", "*{wrong}* 不是前面那件事会带来的合理结果。"],
        ["*{wrong}* happened earlier (or repeats the start), not next.", "*{wrong}* 是之前发生过的事（或重复了开头），不是接下来发生的。"],
      ],
    ),
  ],
});

const facts = topic("reading", {
  id: "finding-facts-in-a-text",
  title: ["Finding Facts in a Text", "在文中找事实"],
  summary: [
    "Answer what, where and how many from a short text about the real world.",
    "根据一篇讲真实世界的短文回答什么、哪里和多少的问题。",
  ],
  intro: [
    "Open a book about frogs and you might read: *Frogs have long sticky tongues.* That is a **fact**—something true about the real world. Let's practice finding facts right inside the text and telling facts apart from made-up stories.",
    "翻开一本讲青蛙的书，你会读到：*Frogs have long sticky tongues.*（青蛙有又长又黏的舌头。）这是一条**事实**——真实世界里真的如此。这节课我们来在短文里找事实，并分辨故事和事实。",
  ],
  after: ["reading-sight-words"],
  xp: 10,
  points: [
    choose(
      "answers-in-the-text",
      ["Answers in the Text", "答案就在文中"],
      [
        "A text that tells **facts** shares true information about the real world. Find the sentence that matches the question—the answer is right in the words.\n\n> **Watch out.** Do not guess from memory; point to the exact words in the text that answer the question.",
        "讲**事实**的短文介绍真实世界里的真事。找到和问题对应的那一句，答案就在文字里。\n\n> **注意。** 不要凭印象猜，要在短文里指着原话找出答案。",
      ],
      ["Read the short text, then answer the question after *Q*.", "读这段短文，然后回答 *Q* 后面的问题。"],
      `
      Bees make honey. They keep it in a hive. Q: Where do bees keep honey?|in a hive|in a nest|in a pond
      A frog can jump far. It has strong back legs. Q: What helps a frog jump far?|strong back legs|a long tail|big eyes
      Cows eat grass. They give us milk. Q: What do cows give us?|milk|eggs|honey
      A duck has webbed feet. They help it swim. Q: What helps a duck swim?|webbed feet|soft wings|a long neck
      The sun is a star. It gives us light. Q: What does the sun give us?|light|rain|snow
      A spider has eight legs. An ant has six legs. Q: How many legs does a spider have?|eight|six|four
      Fish live in water. They breathe with gills. Q: What do fish breathe with?|gills|fins|tails
      Some birds fly south in the fall. It is warm there. Q: Why do some birds fly south?|it is warm there|they like rain|they want snow
      A seed needs water and sun. Then it can grow. Q: What does a seed need?|water and sun|snow and wind|milk and bread
      Owls hunt at night. They sleep in the day. Q: When do owls hunt?|at night|in the day|at lunch
      Bats sleep in the day. They hang upside down. Q: How do bats sleep?|upside down|on their backs|in the water
      A cat has whiskers. They help it feel its way. Q: What do whiskers help a cat do?|feel its way|swim fast|see colors
      Ducks eat plants and bugs. They find them in ponds. Q: Where do ducks find food?|in ponds|in trees|in the snow
      Snow is made of ice. It falls when it is cold. Q: When does snow fall?|when it is cold|when it is hot|at lunch
      A turtle has a hard shell. The shell keeps it safe. Q: What keeps a turtle safe?|a hard shell|soft fur|long legs
      A camel can go days with no water. It lives in the desert. Q: Where does a camel live?|in the desert|in the sea|in the woods
      Apples grow on trees. They can be red or green. Q: Where do apples grow?|on trees|under the ground|in the water
      A giraffe has a long neck. It eats leaves from tall trees. Q: What does a giraffe eat?|leaves from tall trees|fish from the sea|grass under the snow
      We have five fingers on each hand. We use them to hold things. Q: How many fingers are on each hand?|five|four|ten
      Bears sleep in the winter. They wake up in the spring. Q: When do bears wake up?|in the spring|in the winter|at night
      Rain comes from clouds. It helps plants grow. Q: Where does rain come from?|clouds|the sun|the ground
      A butterfly starts as an egg. Then it is a caterpillar. Q: What does a butterfly start as?|an egg|a seed|a worm
      Dogs smell well with their noses. They can find lost things. Q: What do dogs smell with?|their noses|their ears|their paws
      The moon shines at night. We can see it from home. Q: When does the moon shine?|at night|at noon|at lunch
      Penguins cannot fly. They swim in cold water. Q: What can penguins do?|swim in cold water|fly in the sky|climb trees
      Pumpkins grow on vines. They are big and orange. Q: What color are pumpkins?|orange|blue|pink
      A beaver builds a dam. It uses sticks and mud. Q: What does a beaver use?|sticks and mud|rocks and sand|leaves and snow
      Milk helps your bones grow strong. Q: What does milk help grow strong?|your bones|your hair|your eyes
      A crab has ten legs. It walks to the side. Q: How does a crab walk?|to the side|up and down|in circles
      Hens lay eggs in a nest. The farmer collects them. Q: Where do hens lay eggs?|in a nest|in a pond|in a tree
      `,
      (right) => [
        `The text states the answer right in its words: **${right}**.\n\n**Check.** Put **${right}** back next to the question and match it against the text: the exact words **${right}** appear there as the answer.`,
        `短文里直接写出了答案：**${right}**。\n\n**检验。** 把 **${right}** 对照问题放回短文核对：原句里明明白白写着 **${right}**。`,
      ],
      [
        ["*{wrong}* does not match what the text says for this question.", "*{wrong}* 和短文针对这个问题说的内容对不上。"],
        ["Check the sentences again: they never give *{wrong}* as the answer.", "再看一遍短文：原文没有把 *{wrong}* 当作答案。"],
      ],
    ),
    label(
      "story-or-facts",
      ["A Story or Facts", "故事还是事实"],
      [
        "A **story** is made up—animals may talk or wear clothes, and silly things can happen. A text of **facts** tells what is really true in our world.\n\n> **Watch out.** Even if a sentence has a real animal like a pig or a bear, it is a *story* if the animal talks or bakes a pie.",
        "**故事**是编出来的——动物会说话、穿衣服，还会发生现实里不可能的事。讲**事实**的文字说的是真实世界里真的如此的事。\n\n> **注意。** 就算句子里写的是真的动物（比如猪或熊），只要它会说话或烤派，那就是故事而不是事实。",
      ],
      ["Is this from a story or a text of facts?", "这段话来自故事，还是讲事实的短文？"],
      `
      The pig put on a hat and said, "Let us go to the moon!"|story
      Pigs like to roll in mud to stay cool.|facts
      The little bus sang a song as it went up the hill.|story
      A bus can take lots of kids to school.|facts
      The cat and the dog had tea and cake on the rug.|story
      Cats can see well at night.|facts
      The tree waved at Sam and said hello.|story
      Trees grow from seeds.|facts
      The moon came down to play with the kids.|story
      The moon goes around the earth.|facts
      The fish told the frog a joke.|story
      Fish have fins to help them swim.|facts
      The rabbit put on a coat and went to the shop.|story
      Rabbits have long ears.|facts
      The cloud cried because it was sad.|story
      Rain falls from clouds.|facts
      The sock and the shoe went on a trip.|story
      We wear shoes to keep our feet safe.|facts
      The cow jumped over the moon and laughed.|story
      Cows eat grass and give milk.|facts
      The little seed said, "I want to be a tree!"|story
      A seed needs water to grow.|facts
      The bear baked a pie for his friends.|story
      Bears sleep all winter.|facts
      The car told the truck a secret.|story
      A car has four wheels.|facts
      The duck sang a song to the stars.|story
      Ducks have webbed feet.|facts
      The snowman danced in the yard.|story
      Snow melts when it gets warm.|facts
      `,
      {
        story: L(
          "故事",
          "It tells something made up that cannot happen in real life.",
          "它讲的是编出来的、现实生活中不可能发生的事。",
          "*{shown}* is something really true—nothing in it is made up.",
          "*{shown}* 是真实世界里真的事，里面没有编造的成分。",
        ),
        facts: L(
          "事实",
          "It tells something true about the real world.",
          "它讲的是真实世界里的真事。",
          "*{shown}* cannot really happen—it is made up for a story.",
          "*{shown}* 在现实里不可能发生，是编出来的故事。",
        ),
      },
      (right, _shown, entry) => [
        `This is from **${right === "story" ? "a story" : "a text of facts"}**. ${entry.why[0]}\n\n**Check.** Ask yourself: *Could I really see this happen outside or in nature?* ${right === "facts" ? "Yes—so it is a fact." : "No—so it is a made-up story."}`,
        `这段话来自**${entry.zh}**。${entry.why[1]}\n\n**检验。** 问自己：*在现实世界里真的能看到这件事吗？* ${right === "facts" ? "能——所以这是事实。" : "不能——所以这是编出来的故事。"}`,
      ],
    ),
  ],
});

const rhymes = topic("reading", {
  id: "rhyming-words",
  title: ["Rhyming Words", "押韵的词"],
  summary: ["Words rhyme when they end with the same sound, like *cat* and *hat*.", "结尾发音相同的词押韵，比如 *cat* 和 *hat*。"],
  intro: [
    "Sing a playground chant: *One, two, buckle my shoe!* Notice how *two* and *shoe* sound the same at the end? That match is a **rhyme**. Let's spot rhyming words and finish short rhymes.",
    "念一句童谣：*One, two, buckle my shoe!* 注意到了吗，*two* 和 *shoe* 结尾的发音一样？这就是**押韵**。这节课我们来找押韵词，并把小诗的韵脚补全。",
  ],
  after: ["reading-short-vowel-words"],
  xp: 10,
  points: [
    choose(
      "which-word-rhymes",
      ["Which Word Rhymes", "哪个词押韵"],
      [
        "Words **rhyme** when they end with the same sound: *c**at***, *h**at***, *m**at***. Only the opening sound changes.\n\n> **Watch out.** Two words that start with the same sound (*cat* and *cup*) do not rhyme—listen to the *end*.",
        "结尾发音相同的词就**押韵**：*c**at***、*h**at***、*m**at***。只有开头的音不同。\n\n> **注意。** 开头相同的词（如 *cat* 和 *cup*）不押韵——要听*结尾*的音。",
      ],
      ["Which word rhymes with the word shown?", "哪个词和给出的词押韵？"],
      `
      cat|hat|cup|can
      pig|wig|pin|pot
      sun|run|sit|sad
      bed|red|bad|bus
      dog|log|dig|den
      hen|ten|hat|hop
      bug|rug|bag|bud
      top|hop|tip|ten
      fox|box|fan|fix
      cake|lake|cap|cook
      mat|bat|map|mug
      pen|men|pet|pan
      bun|fun|bus|bin
      hop|mop|hot|hip
      lid|kid|lip|lad
      net|jet|nut|nap
      cub|tub|cup|cab
      jam|ham|jet|jog
      pot|dot|pod|pit
      rug|mug|run|rag
      fan|man|fat|fun
      sit|bit|sip|set
      cap|map|cat|cup
      wet|pet|web|wit
      hug|bug|hum|hog
      fin|pin|fit|fun
      ring|king|rat|rung
      nose|rose|nut|nice
      coat|boat|cot|cut
      bell|well|bed|ball
      `,
      (right, shown) => [
        `**${shown}** and **${right}** end with the same sound, so they rhyme.\n\n**Check.** Say *${shown}, ${right}* aloud and drop the first sound of each: the endings match completely.`,
        `**${shown}** 和 **${right}** 结尾的发音相同，所以押韵。\n\n**检验。** 把 *${shown}、${right}* 连起来大声读，去掉各自开头的第一个音，剩下的韵尾完全一样。`,
      ],
      [
        ["*{wrong}* starts with the same sound, but rhyming words match at the end.", "*{wrong}* 只是开头音相同，但押韵要看结尾音相同。"],
        ["Say *{wrong}* aloud: its ending sound does not match.", "把 *{wrong}* 大声读出来：它的结尾音对不上。"],
      ],
    ),
    choose(
      "finishing-the-rhyme",
      ["Finishing the Rhyme", "补全押韵"],
      [
        "In a short poem, two lines work together with a rhyme: *I see a **bee** / Up in a **tree**.* Pick the word that both rhymes **and** makes sense.\n\n> **Watch out.** Do not pick a word just because it makes sense—say the two lines aloud to hear the rhyme.",
        "小诗里两行常常押韵呼应：*I see a **bee** / Up in a **tree**.* 要选一个既押韵**又**说得通的词。\n\n> **注意。** 不要只因为意思通顺就选它——把两行大声读出来，听一听押不押韵。",
      ],
      ["Which word finishes the rhyme?", "哪个词能补全押韵？"],
      `
      I see a cat. / It sat on a ___.|mat|rug|cup
      The sun is hot. / Put it in a ___.|pot|pan|bag
      I have a pig. / It is very ___.|big|small|fat
      The bug is snug / Under the ___.|rug|bed|box
      The hen has ten / Chicks in the ___.|pen|nest|barn
      The frog on a ___ / Sat in the fog.|log|hill|rock
      Look at the fox / Jump in the ___.|box|pond|bag
      Let us run / In the ___.|sun|park|mud
      The goat in the ___ / Has a red coat.|boat|barn|van
      I like the cake / By the ___.|lake|pond|sea
      I have a hat. / It fell on the ___.|cat|dog|rug
      The bee in the ___ / Can see me.|tree|sky|yard
      I see a bug / On the ___.|rug|bed|mat
      The man in the van / Has a ___.|fan|cup|hat
      My red ___ / Is on the bed.|sled|ball|toy
      The cat in the ___ / Is very wet.|net|box|tub
      The duck in the ___ / Is stuck.|truck|car|mud
      I ran in the sun / Just for ___.|fun|play|lunch
      The cub in the ___ / Had a rub.|tub|bath|pond
      The big ___ / Sat on the mop.|top|pot|cat
      I sat very ___ / Up on the hill.|still|long|tall
      The mouse in the ___ / Ran to the door.|house|barn|shop
      A bear in a ___ / Sat by the stair.|chair|bed|box
      The fish in the ___ / Made a wish.|dish|pond|sea
      I can see a ___ / From the car.|star|cat|hat
      The dog on the ___ / Can jog.|log|hill|rug
      The king can ___ / In the spring.|sing|run|play
      My coat is in the ___ / By the goat.|boat|van|barn
      A snake by the ___ / Ate a cake.|lake|pond|tree
      The hen and the ___ / Ran to the den.|men|kids|cats
      `,
      (right, shown) => {
        const line = shown.replace("___", right);
        return [
          `**${right}** completes both the rhyme and the meaning: *${line}*\n\n**Check.** Read *${line}* aloud: listen for the matching ending sound and check that the picture makes sense.`,
          `**${right}** 既押韵又通顺：*${line}*\n\n**检验。** 大声读一遍 *${line}*：听听两个押韵词的结尾音是不是一致，再看看画面说不说得通。`,
        ];
      },
      [
        ["*{wrong}* makes sense in the picture, but it does not rhyme.", "*{wrong}* 意思说得通，但不押韵。"],
        ["Say the two lines with *{wrong}*: its ending sound breaks the rhyme.", "把 *{wrong}* 代进去读两行：结尾音对不上，破了韵。"],
      ],
    ),
  ],
});

const syllables = topic("reading", {
  id: "clapping-syllables",
  title: ["Clapping Syllables", "拍音节"],
  summary: ["Clap the parts of a word to count its syllables.", "拍出一个词的各个部分，数一数它有几个音节。"],
  intro: [
    "Say your own name slowly and clap on each beat—*Li-ly* gets two claps, *Sam* gets one! Every word has beats called **syllables**. Clapping them helps you read longer words one piece at a time.",
    "慢慢念自己的名字，每读一拍就拍一下手——*Li-ly* 拍两下，*Sam* 拍一下！每个词都有节奏，叫做**音节**。拍出音节，就能把长词拆成小块来读。",
  ],
  after: ["reading-words-with-blends"],
  xp: 10,
  points: [
    choose(
      "how-many-claps",
      ["How Many Claps", "拍几下"],
      [
        "A **syllable** is one beat of a word: *cat* (one clap), *rab-bit* (two claps), *but-ter-fly* (three claps). Every syllable has one vowel sound.\n\n> **Watch out.** Do not count every letter—count the beats your voice makes when you say the word.",
        "**音节**是一个词里可以拍出来的一拍：*cat*（拍一下）、*rab-bit*（拍两下）、*but-ter-fly*（拍三下）。每个音节都带一个元音。\n\n> **注意。** 不要数有几个字母，要数读出这个词时嘴里发出几拍。",
      ],
      ["How many syllables does the word have?", "这个词有几个音节？"],
      `
      cat|one|two|three
      rabbit|two|one|three
      butterfly|three|two|one
      dog|one|two|three
      apple|two|one|three
      banana|three|two|one
      sun|one|two|three
      pencil|two|three|one
      elephant|three|two|one
      frog|one|two|three
      basket|two|one|three
      kangaroo|three|two|one
      bed|one|two|three
      tiger|two|one|three
      dinosaur|three|two|one
      hat|one|two|three
      monkey|two|one|three
      tomato|three|two|one
      ship|one|two|three
      window|two|three|one
      octopus|three|two|one
      cup|one|two|three
      pumpkin|two|one|three
      umbrella|three|two|one
      fish|one|two|three
      garden|two|one|three
      popcorn|two|three|one
      lemon|two|one|three
      pajamas|three|two|one
      bus|one|two|three
      `,
      (right, shown) => {
        const zhCount = right === "one" ? "一" : right === "two" ? "两" : "三";
        return [
          `Say **${shown}** slowly and clap each beat: it has **${right}** syllable${right === "one" ? "" : "s"}.\n\n**Check.** Rest your hand lightly under your chin and say **${shown}**: your chin drops **${right}** time${right === "one" ? "" : "s"} (once for each vowel sound).`,
          `慢慢读出 **${shown}** 并拍手：一共拍 **${zhCount}** 下，有 **${zhCount}** 个音节。\n\n**检验。** 把手轻轻放在下巴下面再读一遍 **${shown}**：下巴向下动了 **${zhCount}** 次（每发一个元音动一次）。`,
        ];
      },
      [
        [
          "Clap *{shown}* again slowly—*{wrong}* does not match the number of beats you hear.",
          "慢慢再拍一遍 *{shown}*——*{wrong}* 和听到的拍数对不上。",
        ],
        [
          "Hold your hand under your chin as you say *{shown}*: count each drop—it is not *{wrong}*.",
          "把手放在下巴下面读 *{shown}*：数一数下巴动了几次——不是 *{wrong}*。",
        ],
      ],
    ),
    choose(
      "putting-parts-together",
      ["Putting Parts Together", "把部分拼起来"],
      [
        "A long word is easy when you read it beat by beat and blend the parts: *sun* + *set* = **sunset**; *pic* + *nic* = **picnic**.\n\n> **Watch out.** Check both parts—do not pick a word that only matches the first part.",
        "长词一拍一拍地读，再拼在一起就简单了：*sun* + *set* = **sunset**；*pic* + *nic* = **picnic**。\n\n> **注意。** 前后两部分都要核对，不要只看开头像就选它。",
      ],
      ["Which word do the parts make?", "这几个部分组成哪个词？"],
      `
      sun + set|sunset|sunny|subset
      pic + nic|picnic|picking|panic
      rab + bit|rabbit|rabbits|robin
      kit + ten|kitten|kitchen|written
      nap + kin|napkin|pumpkin|napping
      bas + ket|basket|blanket|bucket
      pup + pet|puppet|puppy|pocket
      cup + cake|cupcake|cupboard|pancake
      mag + net|magnet|market|magic
      wag + on|wagon|dragon|wagging
      rain + bow|rainbow|rainy|ribbon
      pop + corn|popcorn|popping|acorn
      sand + box|sandbox|sandy|sandal
      tooth + brush|toothbrush|toothpaste|tooth
      gold + fish|goldfish|golden|catfish
      bed + room|bedroom|bedtime|broom
      snow + man|snowman|snowing|showman
      mon + key|monkey|money|donkey
      pen + cil|pencil|penny|stencil
      ti + ger|tiger|timer|tiny
      rob + in|robin|rabbit|robot
      mit + ten|mitten|kitten|mitt
      win + dow|window|winding|widow
      gar + den|garden|garage|golden
      lem + on|lemon|melon|lemony
      ham + mer|hammer|hamster|hummer
      but + ton|button|butter|bottom
      in + sect|insect|inside|infect
      pump + kin|pumpkin|pumping|napkin
      tum + ble|tumble|tummy|humble
      `,
      (right, shown) => [
        `Putting *${shown}* together makes **${right}**.\n\n**Check.** Split **${right}** back into its two beats: the first part and the second part match *${shown}* letter for letter.`,
        `把 *${shown}* 拼在一起就是 **${right}**。\n\n**检验。** 把 **${right}** 按两拍拆回去，前半部分和后半部分和 *${shown}* 逐字吻合。`,
      ],
      [
        ["*{wrong}* starts like the first part, but its second part does not match.", "*{wrong}* 开头和第一部分像，但第二部分对不上。"],
        ["*{wrong}* changes one of the parts, so it is a different word.", "*{wrong}* 改掉了其中一个部分，变成了别的词。"],
      ],
    ),
  ],
});

const whole = topic("writing", {
  id: "a-sentence-tells-a-whole-idea",
  title: ["A Sentence Tells a Whole Idea", "句子要表达完整的意思"],
  summary: [
    "A sentence tells who and what they do; a few words alone are not a sentence.",
    "句子要说出谁和做什么；只有几个词不能构成句子。",
  ],
  intro: [
    "Imagine a friend runs up and says only, *The brown puppy.* You blink and ask, *What did the puppy do?* To share a whole idea, a sentence needs both **who** and **what they do**.",
    "想象朋友跑过来只说了一句：*The brown puppy.* 你一定会眨眨眼问：*小狗怎么了？* 要把意思说完整，一个句子必须既有**谁**，又有**做什么**。",
  ],
  after: ["action-words"],
  xp: 10,
  points: [
    choose(
      "is-it-a-whole-sentence",
      ["Is It a Whole Sentence?", "这是完整的句子吗？"],
      [
        "A **whole sentence** tells **who** and **what they do** (or what they are): *The dog runs.* Half a thought like *The big dog.* or *Runs fast.* leaves you asking *what about it?*\n\n> **Watch out.** A capital letter and a period alone do not make a whole sentence—it must have both parts.",
        "**完整的句子**要说出**谁**和**做什么**（或是什么）：*The dog runs.* 像 *The big dog.* 或 *Runs fast.* 这样的半截话会让人追问*怎么了？*\n\n> **注意。** 光有句首大写和句末句号还不够，必须把“谁”和“做什么”都说全。",
      ],
      ["Which is a whole sentence?", "哪个是完整的句子？"],
      `
      dog, runs|The big dog runs.|The big dog.|Runs fast.
      cat, naps|The cat naps on the bed.|On the bed.|The cat on the bed.
      Kim, swims|Kim swims in the pond.|In the pond.|Swims in the pond.
      bird, sings|A bird sings in the tree.|A bird in the tree.|In the tree.
      we, eat|We eat lunch at noon.|Lunch at noon.|At noon.
      sun, is hot|The sun is hot.|The hot sun.|Is hot.
      Dad, fixes|Dad fixes the van.|Fixes the van.|Dad and the van.
      frog, hops|The green frog hops.|The green frog.|Hops on a log.
      kids, play|The kids play tag.|The kids and tag.|Play tag.
      ship, sails|The ship sails away.|The big ship.|Sails away.
      pig, rolls|The pig rolls in the mud.|The pig in the mud.|Rolls in the mud.
      Mom, bakes|Mom bakes a cake.|Mom and a cake.|Bakes a cake.
      duck, swims|The duck swims fast.|The fast duck.|Swims fast.
      I, read|I read a book.|A good book.|Read a book.
      bus, stops|The bus stops here.|The yellow bus.|Stops here.
      baby, naps|The baby naps in the crib.|The baby in the crib.|Naps in the crib.
      Ben, kicks|Ben kicks the ball.|Ben and the ball.|Kicks the ball.
      bee, buzzes|A bee buzzes by.|A little bee.|Buzzes by.
      we, plant|We plant seeds.|The seeds in the dirt.|Plant seeds.
      cow, eats|The cow eats grass.|The cow and the grass.|Eats grass.
      Gran, sings|Gran sings to me.|Gran and me.|Sings to me.
      kite, flies|The kite flies high.|The red kite.|Flies high.
      fish, swim|The fish swim in the tank.|The fish in the tank.|Swim in the tank.
      Dad, drives|Dad drives the car.|Dad and the car.|Drives the car.
      bell, rings|The bell rings at noon.|The loud bell.|Rings at noon.
      cat, purrs|My cat purrs.|My soft cat.|Purrs on my lap.
      Kim, draws|Kim draws a house.|Kim and a house.|Draws a house.
      hen, pecks|The hen pecks at corn.|The brown hen.|Pecks at corn.
      they, run|They run to the park.|The kids and the park.|Run to the park.
      moon, shines|The moon shines at night.|The big moon.|Shines at night.
      `,
      (right) => [
        `*${right}* is a whole sentence because it tells both who (or what) and what happens.\n\n**Check.** Ask two questions about *${right}*: *Who or what?* and *What do they do?* You can answer both right from the sentence.`,
        `*${right}* 是完整的句子，因为它既说了谁（或什么），又说了做什么。\n\n**检验。** 对着 *${right}* 问两个问题：*是谁或什么？* 和 *做什么/怎么样？* 两个问题都能直接从句子里答出来。`,
      ],
      [
        [
          "*{wrong}* is missing one of the two parts, so it leaves you asking *what about it?*",
          "*{wrong}* 缺了必要的一部分，读完会让人想问“然后呢？”。",
        ],
        [
          "*{wrong}* does not give a whole idea—either *who* or *what happens* is missing.",
          "*{wrong}* 没有把意思说完整——缺了“谁”或者缺了“做什么”。",
        ],
      ],
    ),
    choose(
      "finishing-a-sentence",
      ["Finishing a Sentence", "把句子补完整"],
      [
        "If a sentence gives only *who* (*The little pup ___*), add **what it does** (*wags its tail*). If it gives only *what happens* (*___ hops on a log.*), add **who** (*The frog*).\n\n> **Watch out.** Adding a place like *in the pond* does not tell what someone *does*—look for the missing action or missing subject.",
        "如果句子只说了*谁*（*The little pup ___*），就补上**做什么**（*wags its tail*）；如果只说了*做什么*（*___ hops on a log.*），就补上**谁**（*The frog*）。\n\n> **注意。** 补上 *in the pond* 这样的地点并不能说明“做什么”，要找真正缺少的动作或主语。",
      ],
      ["Which words finish the sentence?", "哪些词能把句子补完整？"],
      `
      The little pup ___.|wags its tail|and the cat|with a ball
      ___ hops on a log.|The frog|On the log|The green
      My mom ___.|makes a cake|and my dad|in the van
      ___ sings a song.|The bird|A song|In the tree
      The kids ___.|run to the bus|at the bus|and the bus
      ___ swim in the pond.|The ducks|In the pond|The wet
      The red ball ___.|rolls down the hill|down the hill|and the hill
      ___ reads a book.|Sam|A book|The big
      The sun ___.|is very hot|very hot|and the sky
      ___ naps in the sun.|The cat|In the sun|The soft
      The big dog ___.|barks at the cat|and the cat|at the cat
      ___ flies in the sky.|The bird|In the sky|The blue
      My dad ___.|drives the car|and my mom|in the car
      ___ swims in the sea.|The fish|In the sea|The wet
      The baby ___.|naps in the crib|in the crib|and the crib
      ___ eats the grass.|The cow|The green|On the grass
      The kids ___.|play in the snow|in the snow|and the snow
      ___ rings at noon.|The bell|At noon|The loud
      The little cat ___.|drinks the milk|and the milk|with the milk
      ___ hops on the grass.|The bunny|On the grass|The soft
      Gran ___.|bakes a pie|and a pie|with a pie
      ___ shines at night.|The moon|At night|The round
      The bus ___.|stops at school|at school|and the school
      ___ reads to me.|My mom|To me|The good
      The frog ___.|jumps in the pond|in the pond|and the pond
      ___ buzzes in the garden.|The bee|In the garden|The busy
      My friend ___.|plays with me|with me|and me
      ___ falls from the sky.|The rain|From the sky|The wet
      The duck ___.|quacks at the pond|at the pond|and the pond
      ___ digs a hole.|The dog|A hole|The brown
      `,
      (right, shown) => [
        `*${filled(shown, right)}* now tells both who and what happens.\n\n**Check.** Read *${filled(shown, right)}* aloud as if telling a friend: it sounds complete all by itself, with nothing left hanging.`,
        `*${filled(shown, right)}* 既有“谁”又有“做什么”，成了一句完整的话。\n\n**检验。** 像讲给朋友听一样大声读出 *${filled(shown, right)}*：听起来完整顺畅，不会让人觉得话只说了一半。`,
      ],
      [
        ["Adding *{wrong}* still leaves out who does it or what they do.", "补上 *{wrong}* 还是缺了“谁”或“做什么”。"],
        [
          "*{wrong}* adds a detail or place, but the sentence still does not tell a whole idea.",
          "*{wrong}* 只加了细节或地点，句子还是没有把意思说完整。",
        ],
      ],
    ),
  ],
});

const more = topic("writing", {
  id: "adding-a-describing-word",
  title: ["Adding a Describing Word", "加上一个描述词"],
  summary: ["Make a sentence tell more by adding a describing word.", "加上一个描述词，让句子说得更多。"],
  intro: [
    "Compare two sentences: *I saw a bug.* vs. *I saw a **shiny** bug.* Adding one describing word turns a plain sentence into a vivid picture! Let's put describing words in the right spot and pick ones that fit.",
    "比一比这两句话：*I saw a bug.* 和 *I saw a **shiny** bug.* 加上一个描述词，平淡的句子立刻有了画面感！这节课我们来把描述词放到对的位置，并选出贴切的词。",
  ],
  after: ["a-sentence-tells-a-whole-idea", "describing-words"],
  xp: 10,
  points: [
    choose(
      "the-sentence-that-tells-more",
      ["The Sentence That Tells More", "说得更多的句子"],
      [
        "A describing word helps the reader picture the thing: *I have a hat.* → *I have a **red** hat.* In English, put the describing word **right before** the naming word.\n\n> **Watch out.** Put the describing word *before* the naming word (*a red hat*), not after it (*a hat red*).",
        "描述词能让读者看到画面：*I have a hat.* → *I have a **red** hat.* 在英语里，描述词要放在名称词**前面**。\n\n> **注意。** 描述词要放在名称词*前面*（*a red hat*），不能放在后面（*a hat red*）。",
      ],
      ["Which sentence adds a describing word in the right place?", "哪个句子在正确的位置加上了描述词？"],
      `
      I have a hat.|I have a red hat.|I have a hat red.|I red have a hat.
      The dog ran.|The big dog ran.|The dog big ran.|The dog ran big dog.
      We saw a frog.|We saw a green frog.|We saw a frog green.|We green saw a frog.
      She has a cat.|She has a soft cat.|She has a cat soft.|She soft has a cat.
      I sat on the bed.|I sat on the little bed.|I sat on the bed little.|I little sat on the bed.
      The sun is up.|The hot sun is up.|The sun hot is up.|The sun is up hot sun.
      He got a cup.|He got a new cup.|He got a cup new.|He new got a cup.
      A bug sat on me.|A tiny bug sat on me.|A bug tiny sat on me.|A bug sat tiny on me.
      Mom made a cake.|Mom made a big cake.|Mom made a cake big.|Mom big made a cake.
      I see a ship.|I see a tall ship.|I see a ship tall.|I tall see a ship.
      I have a bike.|I have a new bike.|I have a bike new.|I new have a bike.
      The cat sat.|The fat cat sat.|The cat fat sat.|The cat sat fat cat.
      We ate a plum.|We ate a sweet plum.|We ate a plum sweet.|We sweet ate a plum.
      He has a ball.|He has a red ball.|He has a ball red.|He red has a ball.
      I sat on a rug.|I sat on a soft rug.|I sat on a rug soft.|I soft sat on a rug.
      The bird sang.|The little bird sang.|The bird little sang.|The bird sang little bird.
      She got a box.|She got a big box.|She got a box big.|She big got a box.
      A frog hid.|A green frog hid.|A frog green hid.|A frog hid green.
      Dad has a van.|Dad has a blue van.|Dad has a van blue.|Dad blue has a van.
      I see a tree.|I see a tall tree.|I see a tree tall.|I tall see a tree.
      We have a pup.|We have a cute pup.|We have a pup cute.|We cute have a pup.
      The kid ran.|The fast kid ran.|The kid fast ran.|The kid ran fast kid.
      I want a cake.|I want a big cake.|I want a cake big.|I big want a cake.
      He got a hat.|He got a warm hat.|He got a hat warm.|He warm got a hat.
      A duck swam.|A wet duck swam.|A duck wet swam.|A duck swam wet.
      Mom has a bag.|Mom has a pink bag.|Mom has a bag pink.|Mom pink has a bag.
      I drank from a cup.|I drank from a blue cup.|I drank from a cup blue.|I blue drank from a cup.
      The dog dug.|The happy dog dug.|The dog happy dug.|The dog dug happy dog.
      She has a doll.|She has a little doll.|She has a doll little.|She little has a doll.
      We saw a ship.|We saw a long ship.|We saw a ship long.|We long saw a ship.
      `,
      (right, shown) => [
        `*${right}* puts the describing word right before the naming word.\n\n**Check.** Take out the new describing word from *${right}*: you get back the original sentence *${shown}*, and the extra word sits right in front of the thing it describes.`,
        `*${right}* 把描述词放在了名称词的正前面。\n\n**检验。** 从 *${right}* 里拿掉新加的描述词，正好还原成原句 *${shown}*，且这个词紧挨在它描述的名称词前面。`,
      ],
      [
        [
          "*{wrong}* puts the describing word *after* the naming word instead of before it.",
          "*{wrong}* 把描述词放到了名称词*后面*，应该放在前面。",
        ],
        [
          "*{wrong}* places the describing word in a spot where English sentences do not put it.",
          "*{wrong}* 把描述词放错了位置，不符合英语句子的语序。",
        ],
      ],
    ),
    choose(
      "a-word-that-fits-the-sense",
      ["A Word That Fits", "合适的描述词"],
      [
        "Choose a describing word that matches real life: snow is **cold**, not *hot*; a mouse is **small**, not *tall*. Think about what you see, taste, hear, or feel.\n\n> **Watch out.** All three choices are describing words, so picture the real thing before you pick.",
        "选一个符合现实的描述词：雪是 **cold**（冷的），不是 *hot*；老鼠是 **small**（小的），不是 *tall*。想一想你看到、尝到、听到或摸到的感觉。\n\n> **注意。** 三个选项都是描述词，选之前先在脑海里想一想真实的样子。",
      ],
      ["Which describing word fits?", "哪个描述词合适？"],
      `
      The snow is ___.|cold|hot|sad
      A mouse is ___.|small|tall|loud
      The fire is ___.|hot|wet|cold
      The bunny has ___ fur.|soft|hard|sharp
      The sky is ___ today.|blue|tall|soft
      The lemon is ___.|sour|sweet|loud
      An elephant is ___.|big|tiny|thin
      The drum is ___.|loud|soft|quiet
      My socks got ___ in the rain.|wet|dry|hot
      The rock is ___.|hard|soft|wet
      The ice is ___.|cold|hot|loud
      A giraffe is ___.|tall|short|tiny
      The sun is ___.|hot|cold|wet
      A kitten is ___.|soft|sharp|hard
      The grass is ___.|green|pink|loud
      Candy is ___.|sweet|sour|salty
      A mouse is ___.|little|huge|tall
      The bell is ___.|loud|quiet|soft
      My hands got ___ in the mud.|dirty|clean|dry
      The pillow is ___.|soft|hard|sharp
      A turtle is ___.|slow|fast|loud
      The night is ___.|dark|bright|sunny
      The soup is ___.|hot|icy|frozen
      A cheetah is ___.|fast|slow|still
      A whale is ___.|huge|tiny|sharp
      The stove is ___.|hot|cold|soft
      My towel is ___ after the bath.|wet|dry|hot
      A snail is ___.|slow|fast|loud
      The feather is ___.|light|heavy|hard
      The sky at noon is ___.|bright|dark|black
      `,
      (right, shown) => [
        `*${filled(shown, right)}* matches what it really looks, sounds, or feels like.\n\n**Check.** Imagine touching, seeing, tasting, or hearing it in real life: **${right}** fits, while the other two words do not.`,
        `*${filled(shown, right)}* 符合它真实的样子、声音或触感。\n\n**检验。** 想象在现实中摸一摸、看一看、尝一尝或听一听：**${right}** 贴切自然，另外两个词都不符合实际。`,
      ],
      [
        ["*{wrong}* means the opposite of what this thing is really like.", "*{wrong}* 的意思和这个东西真实的样子正好相反。"],
        ["*{wrong}* does not fit the sense of this sentence.", "*{wrong}* 和这个东西的特点搭不上。"],
      ],
    ),
  ],
});

const steps = topic("writing", {
  id: "writing-steps-with-first-and-next",
  title: ["Writing Steps with First and Next", "用 first 和 next 写步骤"],
  summary: [
    "Tell how to do something in order, with *first*, *next*, *then* and *last*.",
    "用 *first*、*next*、*then* 和 *last* 按顺序说明怎样做一件事。",
  ],
  intro: [
    "Want to teach a friend how to make a paper plane? You have to tell the steps in order—fold this, then fold that! Words like **First**, **Next**, **Then**, and **Last** act like signposts from start to finish.",
    "想教朋友折纸飞机吗？你得把步骤按顺序讲清楚——先折这一步，再折那一步！**First**、**Next**、**Then**、**Last** 就像路标，带着读者从头做到尾。",
  ],
  after: ["what-happens-first-next-and-last", "a-sentence-tells-a-whole-idea"],
  xp: 10,
  points: [
    choose(
      "the-order-word",
      ["The Order Word", "顺序词"],
      [
        "When you write how-to steps, start with **First**, keep going with **Next** or **Then**, and finish with **Last**: ***First**, get a cup. **Next**, pour the water. **Last**, drink it.*\n\n> **Watch out.** Check where the blank sits—step 1 takes *First*, a middle step takes *Next* or *Then*, and the final step takes *Last*.",
        "写做事步骤时，第一步用 **First**，中间用 **Next** 或 **Then**，最后一步用 **Last**：***First**, get a cup. **Next**, pour the water. **Last**, drink it.*\n\n> **注意。** 先看空格在第几步——第一步用 *First*，中间步用 *Next* 或 *Then*，最后一步用 *Last*。",
      ],
      ["Which word fits the step?", "哪个词适合这个步骤？"],
      `
      ___, get a cup. Then fill it with milk.|First|Last|Next
      First, get the bread. ___, put on the jam.|Next|First|Last
      First, dig a hole. Next, put in the seed. ___, give it water.|Last|First|Before
      ___, wash your hands. Then dry them.|First|Last|Then
      First, put on your socks. ___, put on your shoes.|Then|First|Last
      First, get a pen. Then draw a cat. ___, give it a name.|Last|First|Before
      ___, open the book. Then read the first page.|First|Last|Next
      First, fill the tub. ___, get in.|Next|First|Last
      First, mix the eggs. Then add milk. ___, bake it.|Last|First|Before
      ___, take the lid off the box. Then look in.|First|Last|Then
      ___, get the paint. Then paint the box.|First|Last|Next
      First, get a bowl. ___, pour in the milk.|Next|First|Last
      First, wash the plate. Then dry it. ___, put it away.|Last|First|Before
      ___, put on your coat. Then go out.|First|Last|Then
      First, get in the car. ___, put on your seat belt.|Then|First|Last
      First, fold the paper. Then cut it. ___, glue it on the card.|Last|First|Before
      ___, get the leash. Then walk the dog.|First|Last|Next
      First, get the soap. ___, wash your hands.|Next|First|Last
      First, get a seed. Then plant it. ___, watch it grow.|Last|First|Before
      ___, get your toothbrush. Then brush your teeth.|First|Last|Then
      First, open the door. ___, walk in.|Next|First|Last
      First, get the ball. Then throw it. ___, run after it.|Last|First|Before
      ___, pick up the toys. Then put them in the box.|First|Last|Next
      First, get the bread. ___, toast it.|Then|First|Last
      First, crack the egg. Then mix it. ___, cook it.|Last|First|Before
      ___, put the water in the pot. Then heat it.|First|Last|Then
      First, take off your shoes. ___, get into bed.|Next|First|Last
      First, get the cup. Then fill it. ___, drink it up.|Last|First|Before
      ___, find a book. Then sit and read.|First|Last|Next
      First, put on your helmet. ___, ride your bike.|Then|First|Last
      `,
      (right, shown) => [
        `*${filled(shown, right)}* — **${right}** matches this step's spot in the sequence.\n\n**Check.** Count the steps in *${filled(shown, right)}* from 1 to the end: **${right}** sits at the ${right === "First" ? "very start (step 1)" : right === "Last" ? "very end (final step)" : "next step in the middle"}.`,
        `*${filled(shown, right)}* —— **${right}** 正好对上这一步在顺序里的位置。\n\n**检验。** 从第 1 步往后数 *${filled(shown, right)}*：**${right}** 放在${right === "First" ? "最开头（第 1 步）" : right === "Last" ? "最末尾（最后一步）" : "中间承接的这一步"}，顺序完全顺畅。`,
      ],
      [
        ["*{wrong}* belongs at a different spot in the order (start vs. end).", "*{wrong}* 用在顺序里的另一个位置（开头或结尾）。"],
        ["*{wrong}* does not match where this step comes in the sequence.", "*{wrong}* 和这一步在顺序中的位置不匹配。"],
      ],
    ),
    choose(
      "the-missing-step",
      ["The Missing Step", "缺少的步骤"],
      [
        "A good how-to leaves no gap in the middle. Read step 1 and the last step, then find the middle step that bridges them.\n\n> **Watch out.** Check that the middle step actually leads into the *Last* step instead of undoing the job.",
        "好的步骤说明中间不能跳步。先看第一步和最后一步，再找出把它们连起来的中间一步。\n\n> **注意。** 核对一下中间这一步是不是真能接上最后一步，而不是把事情搞砸或提前收摊。",
      ],
      ["Which step is missing?", "缺少哪一步？"],
      `
      First, get a cup. ___ Last, drink it.|Next, fill it with milk.|Next, wash the cup.|Next, put it away.
      First, get a pot. ___ Last, put the plant in it.|Next, fill it with soil.|Next, eat the plant.|Next, put the pot away.
      First, get a sock. ___ Last, put on your shoe.|Next, put on the sock.|Next, take off the shoe.|Next, wash the sock.
      First, get the toothbrush. ___ Last, brush your teeth.|Next, put on the toothpaste.|Next, put the brush away.|Next, go to bed.
      First, get some paper. ___ Last, hang up the picture.|Next, draw a picture.|Next, throw away the paper.|Next, fold the paper.
      First, get the bread. ___ Last, eat the sandwich.|Next, put the ham on the bread.|Next, wash the bread.|Next, put the bread back.
      First, get a ball. ___ Last, the dog brings it back.|Next, throw the ball.|Next, put the ball away.|Next, hide the dog.
      First, get the seeds. ___ Last, give them water.|Next, plant the seeds in the soil.|Next, eat the seeds.|Next, put the seeds in a box.
      First, fill the tub. ___ Last, dry off.|Next, get in and wash.|Next, empty the tub.|Next, get your coat.
      First, open the box. ___ Last, close the box.|Next, take out a toy.|Next, tape the box.|Next, throw away the box.
      First, get a bowl. ___ Last, eat the cereal.|Next, pour in the cereal and milk.|Next, wash the bowl.|Next, put the bowl away.
      First, get the leash. ___ Last, walk the dog.|Next, put the leash on the dog.|Next, take off the leash.|Next, give the dog a bath.
      First, get a brush. ___ Last, let the paint dry.|Next, paint the box.|Next, wash the brush.|Next, throw the box away.
      First, get a book. ___ Last, put the book back.|Next, read the book.|Next, buy a book.|Next, lose the book.
      First, get the soap. ___ Last, dry your hands.|Next, wash your hands.|Next, put the soap away.|Next, eat lunch.
      First, get on the bike. ___ Last, stop and get off.|Next, ride down the path.|Next, fix the bike.|Next, put the bike away.
      First, get a pan. ___ Last, eat the eggs.|Next, cook the eggs in the pan.|Next, wash the pan.|Next, put the eggs back.
      First, get a pot of water. ___ Last, the plant grows.|Next, water the plant.|Next, dig up the plant.|Next, empty the pot.
      First, open the gate. ___ Last, close the gate.|Next, walk in.|Next, lock the gate.|Next, paint the gate.
      First, get a cup of seeds. ___ Last, watch the birds eat.|Next, put the seeds in the feeder.|Next, eat the seeds.|Next, wash the cup.
      First, find your shoes. ___ Last, tie the laces.|Next, put on the shoes.|Next, take off the shoes.|Next, put the shoes away.
      First, get the blocks. ___ Last, show Mom the tower.|Next, build a tower.|Next, put the blocks away.|Next, knock it down.
      First, get a sheet of paper. ___ Last, mail the letter.|Next, write the letter.|Next, throw away the paper.|Next, fold up the stamp.
      First, get some snow. ___ Last, put a hat on the snowman.|Next, roll the snow into balls.|Next, melt the snow.|Next, go inside.
      First, get the dog food. ___ Last, the dog eats.|Next, put the food in the bowl.|Next, wash the bowl.|Next, close the bag.
      First, fill a bucket. ___ Last, the car is clean.|Next, wash the car.|Next, dump the bucket.|Next, drive the car in the mud.
      First, get a towel. ___ Last, lie in the sun.|Next, put the towel on the sand.|Next, fold the towel.|Next, wash the towel.
      First, get the crayons. ___ Last, put up the picture.|Next, color a picture.|Next, break the crayons.|Next, put the crayons away.
      First, pick some apples. ___ Last, eat the pie.|Next, bake an apple pie.|Next, plant an apple seed.|Next, wash the pie dish.
      First, take out the puzzle. ___ Last, the picture is whole.|Next, fit the pieces together.|Next, put the puzzle away.|Next, lose a piece.
      `,
      (right, shown) => [
        `*${right}* bridges the first step and the last step.\n\n**Check.** Act out all three steps in order—*${filled(shown, right)}*—each step makes the next step possible.`,
        `*${right}* 把第一步和最后一步顺畅地连了起来。\n\n**检验。** 按顺序在脑海里做一遍这三步——*${filled(shown, right)}*——每一步都正好为下一步做好准备。`,
      ],
      [
        ["*{wrong}* does not lead into the last step—the job would stay unfinished.", "*{wrong}* 接不上最后一步，事情会卡在半路。"],
        ["*{wrong}* goes the wrong way and stops the last step from happening.", "*{wrong}* 走反了方向，会让最后一步没法发生。"],
      ],
    ),
  ],
});

/** readingTopics1 are the reading topics of grade 1 beyond phonics. */
export const readingTopics1: readonly TopicDef[] = [whoAndWhere, order, facts, rhymes, syllables];

/** writingTopics1 are the writing topics of grade 1: whole sentences, a describing word and steps in order. */
export const writingTopics1: readonly TopicDef[] = [whole, more, steps];
