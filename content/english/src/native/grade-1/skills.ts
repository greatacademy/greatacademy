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
  after: ["starting-a-sentence-with-a-capital"],
  xp: 10,
  points: [
    choose(
      "who-is-in-the-story",
      ["Who Is in the Story", "故事里有谁"],
      [
        "The people or animals a story is about are its **characters**. To find them, ask *who does something?* In *Pam ran to the bus. She had a red bag.*, the character is **Pam**.",
        "故事讲到的人或动物叫作**人物**。要找到他们，就问*谁做了事情？*。在 *Pam ran to the bus. She had a red bag.* 中，人物是 **Pam**。",
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
      (right) => [`The story tells what ${right} did, so it is about ${right}.`, `故事讲了 ${right} 做的事，所以讲的是 ${right}。`],
      [
        ["*{wrong}* is a place in the story, not who it is about.", "*{wrong}* 是故事里的地点，不是故事讲的人物。"],
        ["*{wrong}* is a thing in the story; things do not act in it.", "*{wrong}* 是故事里的一样东西，它在故事里没有做事。"],
      ],
    ),
    choose(
      "where-it-happens",
      ["Where It Happens", "在哪里发生"],
      [
        "Where a story happens is its **setting**. Look for words such as *in*, *at* or *on* and a place: *at the park*, *in the snow*, *on a ship*.",
        "故事发生的地方叫作**背景**。找一找 *in*、*at*、*on* 这样的词和地点：*at the park*、*in the snow*、*on a ship*。",
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
      (right) => [`The story says it happens ${right}.`, `故事说它发生在 ${right}。`],
      [
        ["*{wrong}* is a place, but not the one in this story.", "*{wrong}* 是一个地点，但不是这个故事里的地点。"],
        ["Read again: the story never goes *{wrong}*.", "再读一遍：故事里没有去过 *{wrong}*。"],
      ],
    ),
  ],
});

const order = topic("reading", {
  id: "what-happens-first-next-and-last",
  title: ["What Happens First, Next and Last", "先发生什么、再发生什么、最后发生什么"],
  summary: ["Tell the order of what happens in a story.", "说出故事里事情发生的顺序。"],
  after: ["who-and-where-in-a-story"],
  xp: 10,
  points: [
    choose(
      "what-happens-first",
      ["What Happens First", "最先发生什么"],
      [
        "A story tells things in the order they happen. What is told **first** happens first. Words like *first*, *then*, *next* and *last* help you keep track.",
        "故事按事情发生的顺序来讲。**先**讲到的事先发生。*first*、*then*、*next*、*last* 这样的词能帮你理清顺序。",
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
      (right) => [`It is told first: *${right}*`, `它最先被讲到：*${right}*`],
      [
        ["*{wrong}* happens later, after the first thing.", "*{wrong}* 发生得晚一些，在第一件事之后。"],
        ["*{wrong}* is the last thing, not the first.", "*{wrong}* 是最后一件事，不是第一件。"],
      ],
    ),
    choose(
      "what-happens-next",
      ["What Happens Next", "接下来发生什么"],
      [
        "Some things always come in an order: you plant a seed **before** it grows; you get wet **after** you jump in. Think about what must come next.",
        "有些事总是按顺序发生：先种下种子，它**才**会长大；跳进水里**之后**才会湿。想一想接下来一定会发生什么。",
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
      (right) => [`*${right}* comes next.`, `接下来是：*${right}*`],
      [
        ["*{wrong}* does not follow from what happened.", "*{wrong}* 和前面发生的事接不上。"],
        ["*{wrong}* happened before, not next.", "*{wrong}* 是之前发生的，不是接下来。"],
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
  after: ["reading-sight-words"],
  xp: 10,
  points: [
    choose(
      "answers-in-the-text",
      ["Answers in the Text", "答案就在文中"],
      [
        "A text that tells **facts** is about the real world. The answer to a question is in the words: find the sentence that tells it.",
        "讲**事实**的文章写的是真实的世界。问题的答案就在文字里：找到说出答案的那一句。",
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
      (right) => [`The text says it: *${right}*.`, `文中说了：*${right}*。`],
      [
        ["*{wrong}* is not what the text says.", "*{wrong}* 不是短文说的。"],
        ["Find the sentence again: it does not say *{wrong}*.", "再找一找那一句：它没有说 *{wrong}*。"],
      ],
    ),
    label(
      "story-or-facts",
      ["A Story or Facts", "故事还是事实"],
      [
        "A **story** is made up: animals may talk and things may happen that cannot really happen. A text of **facts** tells what is true about the real world.",
        "**故事**是编出来的：动物会说话，会发生现实中不可能发生的事。讲**事实**的文字说的是真实世界中真实的事。",
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
          "It tells something that is made up and could not really happen.",
          "它讲的是编出来的、不可能真正发生的事。",
          "Nothing in it is made up: it could be true.",
          "它没有编造的内容：它可能是真的。",
        ),
        facts: L(
          "事实",
          "It tells something true about the real world.",
          "它讲的是真实世界里的真事。",
          "It tells something that could not really happen.",
          "它讲的是不可能真正发生的事。",
        ),
      },
    ),
  ],
});

const rhymes = topic("reading", {
  id: "rhyming-words",
  title: ["Rhyming Words", "押韵的词"],
  summary: ["Words rhyme when they end with the same sound, like *cat* and *hat*.", "结尾发音相同的词押韵，比如 *cat* 和 *hat*。"],
  after: ["reading-short-vowel-words"],
  xp: 10,
  points: [
    choose(
      "which-word-rhymes",
      ["Which Word Rhymes", "哪个词押韵"],
      [
        "Words **rhyme** when they sound the same at the end: *c**at***, *h**at***, *m**at***. Only the first sound changes. Often the end is spelled the same too.",
        "结尾发音相同的词就**押韵**：*c**at***、*h**at***、*m**at***。只有开头的音不同。它们的结尾常常拼写也一样。",
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
      (right, shown) => [`*${shown}* and *${right}* end with the same sound.`, `*${shown}* 和 *${right}* 结尾的发音相同。`],
      [
        ["*{wrong}* starts the same, but a rhyme ends the same.", "*{wrong}* 开头相同，但押韵要结尾相同。"],
        ["*{wrong}* has a different ending sound.", "*{wrong}* 结尾的发音不同。"],
      ],
    ),
    choose(
      "finishing-the-rhyme",
      ["Finishing the Rhyme", "补全押韵"],
      [
        "In a poem, the last words of two lines often rhyme. Pick the word that rhymes **and** makes sense.",
        "诗里两行的最后一个词常常押韵。选一个既押韵**又**说得通的词。",
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
      (right, shown) => [
        `*${right}* rhymes and makes sense: ${shown.replace("___", right)}`,
        `*${right}* 既押韵又说得通：${shown.replace("___", right)}`,
      ],
      [
        ["*{wrong}* makes sense, but it does not rhyme.", "*{wrong}* 说得通，但不押韵。"],
        ["*{wrong}* does not rhyme with the word it should.", "*{wrong}* 和应该押韵的词不押韵。"],
      ],
    ),
  ],
});

const syllables = topic("reading", {
  id: "clapping-syllables",
  title: ["Clapping Syllables", "拍音节"],
  summary: ["Clap the parts of a word to count its syllables.", "拍出一个词的各个部分，数一数它有几个音节。"],
  after: ["reading-words-with-blends"],
  xp: 10,
  points: [
    choose(
      "how-many-claps",
      ["How Many Claps", "拍几下"],
      [
        "A **syllable** is a part of a word you can clap. Say the word slowly and clap each part: *cat* (one clap), *rab-bit* (two claps), *but-ter-fly* (three claps). Each part has a vowel sound.",
        "**音节**是一个词里可以拍出来的部分。慢慢说出这个词，每个部分拍一下：*cat*（拍一下）、*rab-bit*（拍两下）、*but-ter-fly*（拍三下）。每个部分都有一个元音。",
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
      (right, shown) => [
        `Clap *${shown}*: ${right} clap${right === "one" ? "" : "s"}.`,
        `拍一拍 *${shown}*：拍 ${right === "one" ? "一" : right === "two" ? "两" : "三"}下。`,
      ],
      [
        ["*{wrong}* is too many or too few: say the word slowly and clap again.", "*{wrong}* 多了或少了：慢慢说这个词，再拍一次。"],
        ["Count the vowel sounds: there are not *{wrong}*.", "数一数元音：不是 *{wrong}* 个。"],
      ],
    ),
    choose(
      "putting-parts-together",
      ["Putting Parts Together", "把部分拼起来"],
      [
        "A long word is easier to read part by part. Read each syllable, then put them together: *sun* + *set* = *sunset*; *pic* + *nic* = *picnic*.",
        "长词一部分一部分地读更容易。先读每个音节，再把它们拼起来：*sun* + *set* = *sunset*；*pic* + *nic* = *picnic*。",
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
      (right, shown) => [`*${shown}* makes *${right}*.`, `*${shown}* 拼成 *${right}*。`],
      [
        ["*{wrong}* starts like it, but the parts do not match.", "*{wrong}* 开头相似，但各部分对不上。"],
        ["*{wrong}* has a different part in it.", "*{wrong}* 里有一个不同的部分。"],
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
  after: ["action-words"],
  xp: 10,
  points: [
    choose(
      "is-it-a-whole-sentence",
      ["Is It a Whole Sentence?", "这是完整的句子吗？"],
      [
        "A **whole sentence** tells **who** and **what they do** (or what they are): *The dog runs.* Some words alone, like *The big dog.* or *Runs fast.*, leave you asking *what about it?* They are not whole sentences.",
        "**完整的句子**要说出**谁**和**做什么**（或是什么）：*The dog runs.*。只有一些词，比如 *The big dog.* 或 *Runs fast.*，会让人想问*它怎么了？*。它们不是完整的句子。",
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
      (right) => [`*${right}* tells who and what they do.`, `*${right}* 说出了谁和做什么。`],
      [
        ["*{wrong}* tells who, but not what they do.", "*{wrong}* 说了谁，但没说做什么。"],
        ["*{wrong}* does not say who.", "*{wrong}* 没有说是谁。"],
      ],
    ),
    choose(
      "finishing-a-sentence",
      ["Finishing a Sentence", "把句子补完整"],
      [
        "To finish a sentence that has only *who*, add **what they do**. To finish one that has only *what they do*, add **who**.",
        "如果句子只有*谁*，就补上**做什么**；如果只有*做什么*，就补上**谁**。",
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
      (right, shown) => [`*${filled(shown, right)}* is a whole sentence.`, `*${filled(shown, right)}* 是完整的句子。`],
      [
        ["*{wrong}* still leaves out what they do or who.", "*{wrong}* 还是缺了做什么或是谁。"],
        ["*{wrong}* does not finish the idea.", "*{wrong}* 没有把意思说完整。"],
      ],
    ),
  ],
});

const more = topic("writing", {
  id: "adding-a-describing-word",
  title: ["Adding a Describing Word", "加上一个描述词"],
  summary: ["Make a sentence tell more by adding a describing word.", "加上一个描述词，让句子说得更多。"],
  after: ["a-sentence-tells-a-whole-idea", "describing-words"],
  xp: 10,
  points: [
    choose(
      "the-sentence-that-tells-more",
      ["The Sentence That Tells More", "说得更多的句子"],
      [
        "A describing word helps the reader see the picture: *I have a hat.* tells less than *I have a **red** hat.* Put it just before the naming word.",
        "描述词帮读者看到画面：*I have a hat.* 不如 *I have a **red** hat.* 说得多。把它放在名称词的前面。",
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
      (right) => [`*${right}* puts the describing word just before the naming word.`, `*${right}* 把描述词放在了名称词的前面。`],
      [
        ["*{wrong}* puts the describing word after the naming word.", "*{wrong}* 把描述词放在了名称词的后面。"],
        ["*{wrong}* puts the describing word where it does not fit.", "*{wrong}* 把描述词放在了不合适的地方。"],
      ],
    ),
    choose(
      "a-word-that-fits-the-sense",
      ["A Word That Fits", "合适的描述词"],
      [
        "Choose a describing word that fits: snow is **cold**, not *hot*; a mouse is **small**, not *tall*. Think about what you see, hear or feel.",
        "选一个合适的描述词：雪是 **cold**（冷的），不是 *hot*；老鼠是 **small**（小的），不是 *tall*。想一想你看到、听到或摸到的是什么。",
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
      (right, shown) => [`*${filled(shown, right)}* fits what it describes.`, `*${filled(shown, right)}* 和它描述的东西相符。`],
      [
        ["*{wrong}* says the opposite of what it is like.", "*{wrong}* 说的正好相反。"],
        ["*{wrong}* does not fit this thing.", "*{wrong}* 不适合这个东西。"],
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
  after: ["what-happens-first-next-and-last", "a-sentence-tells-a-whole-idea"],
  xp: 10,
  points: [
    choose(
      "the-order-word",
      ["The Order Word", "顺序词"],
      [
        "When you tell how to do something, start with **First**, go on with **Next** or **Then**, and end with **Last**. The words show the reader the order.",
        "讲怎样做一件事时，用 **First** 开头，用 **Next** 或 **Then** 接着讲，用 **Last** 结尾。这些词向读者表明顺序。",
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
        `*${filled(shown, right)}*: *${right}* fits this step's place in the order.`,
        `*${filled(shown, right)}*：*${right}* 符合这一步在顺序中的位置。`,
      ],
      [
        ["*{wrong}* is for a different place in the order.", "*{wrong}* 用在顺序中的另一个位置。"],
        ["*{wrong}* does not fit here.", "*{wrong}* 在这里不合适。"],
      ],
    ),
    choose(
      "the-missing-step",
      ["The Missing Step", "缺少的步骤"],
      [
        "Steps must be complete and in order. If one is missing, the reader cannot do the job. Find the step that goes in the gap.",
        "步骤要完整，而且要按顺序。缺了一步，读者就做不成这件事。找出填在空缺处的那一步。",
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
      (right) => [`*${right}* fills the gap so that every step leads to the next.`, `*${right}* 填补了空缺，每一步都能接上下一步。`],
      [
        ["*{wrong}* does not lead to the last step.", "*{wrong}* 接不上最后一步。"],
        ["*{wrong}* would stop the job from getting done.", "*{wrong}* 会让这件事做不成。"],
      ],
    ),
  ],
});

/** readingTopics1 are the reading topics of grade 1 beyond phonics. */
export const readingTopics1: readonly TopicDef[] = [whoAndWhere, order, facts, rhymes, syllables];

/** writingTopics1 are the writing topics of grade 1: whole sentences, a describing word and steps in order. */
export const writingTopics1: readonly TopicDef[] = [whole, more, steps];
