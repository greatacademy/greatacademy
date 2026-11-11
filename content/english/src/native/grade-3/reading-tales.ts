// Grade 3: making predictions from the clues of a short text, and comparing two folk tales from different places.

import { type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-english";
import { type Ask, askGenerator, need, rows, topic } from "./kit.ts";

// Predictions: text|prediction|wrong|wrong|a new detail that changes it|a detail that supports it|a detail of no weight.

const predictionRows = rows(`
  Dark clouds piled up over the park, and the wind began to blow the leaves around. Mom looked up at the sky and reached for her umbrella.|It will soon start to rain.|The sun will come out and get hotter.|It will start to snow heavily.|The clouds blow away, and the sky turns blue.|Thunder rumbles in the distance.|A boy on the swings is wearing a bright red cap and blue boots.
  Sam's dog Rex ran to the door with his leash in his mouth. He wagged his tail and barked at Sam, who was putting on his shoes.|Sam will take Rex for a walk.|Sam will give Rex a bath.|Rex will go to sleep in his bed.|Sam's mother says it is raining too hard to go out.|Sam picks up a bag for the walk.|Rex has a brown spot on one ear and a short, curly white tail.
  Lena had a spelling test on Friday. Every night that week she wrote her words three times and asked her father to quiz her.|Lena will do well on her test.|Lena will forget all of her words.|Lena will tear up her list of words.|On Friday morning, Lena wakes up with a high fever.|Her father says she spelled every word right.|Lena's pencil case is blue.
  The ice cream truck played its song at the end of the street. Kim grabbed some coins from her jar and ran outside.|Kim will buy an ice cream.|Kim will put the coins in a bank.|Kim will hide from the truck.|The truck drives away before Kim reaches it.|Kim waves at the driver to stop.|Kim's coin jar is shaped like a fat pink pig with a curly tail.
  A baby bird sat on the edge of its nest, flapping its wings. Its mother flew to a branch nearby and called to it.|The baby bird will try to fly.|The baby bird will build a new nest.|The mother bird will fly away forever.|The baby bird tucks its head under its wing and falls asleep.|The baby bird hops to the very edge.|The nest is high up in an old apple tree at the bottom of the garden.
  Leo yawned again and again during dinner. His eyes kept closing, and his head nodded over his plate.|Leo will go to bed early.|Leo will run outside to play soccer.|Leo will ask for a second dinner.|Leo's friend calls with exciting news, and Leo jumps up wide awake.|Leo rubs his eyes and asks for his pajamas.|Leo is eating a big bowl of noodles with a pair of green chopsticks.
  The wheat in the fields was tall and golden. The farmer checked his big machine and filled it with fuel.|The farmer will start to harvest the wheat.|The farmer will plant new seeds.|The farmer will sell his machine.|The farmer finds that the machine's engine is broken.|The farmer calls his helpers to the fields.|The farm has a red barn.
  Maria packed a swimsuit, a towel and a bottle of sunscreen. Then she put on her sandals and her sun hat.|Maria will go swimming.|Maria will go skiing in the mountains.|Maria will stay home and clean her room.|Her friend calls to say the pool and the beach are closed today.|Her mother gets the car keys and a beach umbrella.|Maria's towel has wide yellow and orange stripes and a fringe at each end.
  The children built a snowman in the morning. By noon the sun was hot, and water dripped from the snowman's nose.|The snowman will melt.|The snowman will grow bigger.|The snowman will freeze harder.|Clouds cover the sun, and the air turns freezing cold.|The snowman's carrot nose falls into a puddle.|The snowman wears a long striped scarf and an old black hat.
  Grandma took out flour, eggs, sugar and butter. She turned on the oven and found her big mixing bowl.|Grandma will bake something.|Grandma will plant a garden.|Grandma will take a nap.|The oven makes a loud pop and stops working.|Grandma reaches for her cake pan.|Grandma's kitchen has yellow walls.
  Ben's kite rose high above the hill. Then the wind suddenly stopped, and the kite began to wobble.|The kite will fall to the ground.|The kite will fly higher than ever.|The kite will stay still in the sky all day.|A strong gust of wind blows across the hill.|The kite dips lower and lower.|Ben's kite is shaped like a big fish with long, flowing ribbons.
  Ana planted bean seeds in a cup of soil. She put the cup on a sunny windowsill and watered it every day.|The beans will sprout and grow.|The seeds will stay the same forever.|The seeds will turn into stones.|Ana's little brother knocks the cup over and spills all the soil.|A small green shoot pokes out of the soil.|The cup that the seed is planted in is made of white paper with blue dots.
  Omar held a tall ice cream cone in the hot sun. He was so busy talking to his friend that he forgot to eat it.|The ice cream will melt and drip.|The ice cream will freeze solid.|Omar will give the cone to a bird.|Omar steps into a cold, shady shop and eats it quickly.|A drop of ice cream rolls down his hand.|Omar's friend is named Theo.
  The new puppy sniffed Dad's slipper and began to chew the end. Dad was in the kitchen and could not see.|The puppy will chew a hole in the slipper.|The puppy will put the slipper on a shelf.|Dad will buy the puppy new slippers.|Dad walks in and gives the puppy a chew toy instead.|The puppy shakes the slipper with its teeth.|The slipper is gray and fluffy, and it belongs to Dad's left foot.
  The movie was nearly over. The hero had found the treasure, and the music grew louder and happier.|The movie will have a happy ending.|The movie will start again from the beginning.|The hero will lose the treasure and cry.|The lights flicker, and the screen suddenly goes dark.|The hero smiles and waves goodbye.|The theater smells of hot buttered popcorn, and the seats are soft.
  Jin stacked block after block until his tower was taller than he was. It began to sway each time he added another.|The tower will fall over.|The tower will stay standing forever.|Jin will paint the tower.|Jin stops adding blocks and steadies the tower with both hands.|The top block wobbles as he adds another.|The blocks are made of wood and painted red, yellow, green and blue.
  A voice said, "The museum closes in five minutes." People began walking toward the doors and putting on their coats.|The visitors will leave the museum.|The visitors will start a new tour.|The museum will stay open all night.|The voice adds that the museum will stay open late tonight for a show.|A guard holds the door open.|The museum has a dinosaur skeleton in the big hall and a shop by the door.
  It had rained for five days. The river was rising fast, and water was creeping up the steps of the houses on the bank.|The river will flood the houses.|The river will dry up.|The river will freeze over.|The rain stops, and the water starts to go down.|People pile sandbags in front of their doors.|The houses have green roofs.
  A new bakery is opening on Main Street. Its sign says "Free cookies on opening day!" and the date is tomorrow.|Many people will come to the bakery tomorrow.|The bakery will close forever tomorrow.|No one will want the cookies.|A big storm closes every shop in town tomorrow.|People are already talking about the free cookies.|The bakery's sign is painted blue, with a picture of a loaf on it.
  Mia climbed to the top of the high diving board. She stood at the edge, looked down at the water, and took a deep breath.|Mia will jump into the water.|Mia will build a sandcastle.|Mia will fall asleep on the board.|Mia's legs start to shake, and she turns back toward the ladder.|Mia holds her nose and bends her knees.|Mia's swimsuit is purple with white stars, and her goggles are pink.
  A cat crouched low in the grass, its tail twitching. A few steps away, a bird pecked at seeds on the ground.|The cat will pounce at the bird.|The cat will chase its own tail.|The bird will chase the cat.|A dog barks loudly, and the cat runs off under the porch.|The cat creeps a little closer.|The grass has just been cut, and it smells fresh and green.
  Ella baked twelve cookies and left them to cool on the table. Her three brothers came home hungry from soccer practice.|The brothers will eat some cookies.|The brothers will bake more cookies for Ella.|The cookies will be thrown away.|Ella has put a sign on the plate: "For the school sale. Do not eat!"|One brother sniffs the air and smiles.|The table in the kitchen is round, and it has a blue and white cloth.
  Rosa had played outside all day. After a big dinner and a warm bath, she lay down on the sofa with a book.|Rosa will fall asleep soon.|Rosa will run a race.|Rosa will start her homework at midnight.|Her best friend knocks on the door with a new game.|Rosa's eyes start to close as she reads.|The book is about a dragon.
  The musicians took their seats and tuned their instruments. The conductor walked onto the stage and raised her stick.|The orchestra will start to play.|The musicians will go home.|The conductor will sing a song alone.|The lights go out, and a voice says the concert is cancelled.|The audience becomes quiet.|The stage curtains are made of heavy red velvet with gold tassels.
  No one had watered the tomato plants for two weeks of hot, dry weather. Their leaves were starting to curl and turn brown.|The plants will wilt and may die.|The plants will grow lots of tomatoes.|The plants will turn bright green.|A gardener soaks the plants with water that evening.|The leaves droop even lower.|The plants are in a wooden box.
  Drums boomed down the street, and people crowded along the sidewalks with flags. A police officer stopped all the cars.|A parade will pass by.|A race car will speed down the street.|The shops will close for the night.|The officer says the parade has been called off because of a storm.|The first marching band comes around the corner.|Some of the flags along the street are red and white, and some are blue.
  Tom set his toy car at the top of a steep ramp. He let go of it and watched.|The car will roll down the ramp.|The car will roll up into the air.|The car will stay at the top.|Tom sees that a book is blocking the car's wheels.|The car starts to move.|The car is painted dark green, and it has a dent in one door.
  In class, Ms. Lee held two magnets so that their north ends faced each other. She slowly pushed them together.|The magnets will push away from each other.|The magnets will snap together.|The magnets will lose all their power.|Ms. Lee turns one magnet so its south end faces the other.|Ms. Lee feels the magnets pushing against her hands.|The magnets are shaped like bars.
  Hugo got his allowance every Saturday. This week he saw a toy rocket in a shop window and started saving every coin.|Hugo will buy the rocket when he has enough money.|Hugo will spend his money on candy.|Hugo will give the rocket to the shop.|The shop sells its last rocket to someone else.|Hugo counts his coins every night.|The shop window has a striped awning.
  Autumn came, and the bear ate and ate until it was fat. Then it began dragging leaves into a deep cave.|The bear will sleep in the cave all winter.|The bear will swim in the river all winter.|The bear will build a nest in a tree.|The bear finds another bear already asleep in the cave.|The bear yawns and curls up on the leaves.|The cave is near a tall waterfall that splashes into a pool of cold water.
  It was the day before Mother's Day. Liam got out paper, crayons and glue and closed his bedroom door.|Liam will make a card for his mother.|Liam will clean out his closet.|Liam will build a model airplane.|Liam's teacher says he must finish a school poster by tomorrow.|Liam writes "I love you, Mom" on the paper.|Liam keeps his crayons in an old round tin that once held cookies.
  The phone rang, and Dad said, "Grandma and Grandpa are on their way. They'll be here in ten minutes." Mom began to tidy the living room.|Grandma and Grandpa will arrive soon.|Grandma and Grandpa will stay home.|Mom will leave the house.|Grandpa calls again to say their car has broken down.|A car pulls into the driveway.|The living room has a green rug.
`);

const predictBank: readonly Ask[] = predictionRows.map((row) => {
  const [text = "", right = "", w1 = "", w2 = ""] = need(row, 7);
  return {
    question: t("Which prediction do the clues in the text best support?", "文中的线索最能支持哪个预测？"),
    shown: text,
    right,
    wrong: [w1, w2],
    why: t(
      `The clues in the text point to this: ${right} A good prediction follows from what the characters do and what the text shows.`,
      `文中的线索指向这个预测：${right} 好的预测来自角色的行为和文中写出的情况。`,
    ),
    whyNot: [
      t("That goes against the clues: the text points the other way.", "这和线索相反：文中的内容指向另一个方向。"),
      t("Nothing in the text points to that; a prediction needs clues to support it.", "文中没有任何内容指向它；预测需要有线索支持。"),
    ],
  };
});

const changeBank: readonly Ask[] = predictionRows.map((row) => {
  const [text = "", pred = "", , , change = "", keep = "", idle = ""] = need(row, 7);
  return {
    question: t(
      `A reader predicts: “${pred}” Which new detail would make the reader change that prediction?`,
      `一位读者预测：“${pred}” 哪个新细节会让这位读者改变预测？`,
    ),
    shown: text,
    right: change,
    wrong: [keep, idle],
    why: t(
      `This new fact goes against the clues, so the prediction should change: ${change} A reader keeps checking a guess against each new fact.`,
      `这个新事实和原来的线索相反，所以预测应该改变：${change} 读者会用每个新事实来检验自己的猜测。`,
    ),
    whyNot: [
      t(
        "That detail fits the prediction: it makes it more likely, not less, so the reader would keep it.",
        "这个细节符合预测：它让预测更可能成真，所以读者会保留预测。",
      ),
      t(
        "That detail has nothing to do with what will happen next, so it would not change the prediction.",
        "这个细节和接下来会发生什么无关，所以不会改变预测。",
      ),
    ],
  };
});

/** TalePair is two folk tales from different places and what a reader finds when comparing them. */
interface TalePair {
  readonly a: readonly [title: string, text: string];
  readonly b: readonly [title: string, text: string];
  /** shared are two things both tales have. */
  readonly shared: readonly [string, string];
  readonly onlyA: string;
  readonly onlyB: string;
  readonly neither: string;
  /** diffs are two differences, each as what the first tale has and what the second has instead. */
  readonly diffs: readonly [readonly [string, string], readonly [string, string]];
  /** falseDiff claims a difference the tales do not have. */
  readonly falseDiff: string;
}

const talePairs: readonly TalePair[] = [
  {
    a: [
      "The Lion and the Mouse",
      "A lion caught a little mouse and was about to eat it. “Let me go,” squeaked the mouse, “and one day I will help you.” The lion laughed but let it go. Later the lion was trapped in a hunter's net. The mouse heard him roar and chewed through the ropes until he was free.",
    ],
    b: [
      "The Dove and the Ant",
      "An ant fell into a stream and was being carried away. A dove saw it and dropped a leaf into the water. The ant climbed onto the leaf and floated to shore. Soon after, a hunter aimed his net at the dove. The ant bit the hunter's foot, he jumped, and the dove flew away safely.",
    ],
    shared: ["A small creature saves a bigger one.", "A kindness is paid back later."],
    onlyA: "A small animal begs for its life.",
    onlyB: "A creature is saved from drowning.",
    neither: "Two animals have a race to see which of them is faster.",
    diffs: [
      ["the helper chews through ropes", "the helper bites a hunter's foot"],
      ["the small creature is let go", "the small creature is saved from a stream"],
    ],
    falseDiff: "In Tale 1 the kindness is paid back; in Tale 2 it is never paid back.",
  },
  {
    a: [
      "The Tortoise and the Hare",
      "A hare laughed at a slow tortoise, so the tortoise challenged him to a race. The hare ran far ahead, then lay down under a tree for a nap. The tortoise kept walking, step by step. When the hare woke up, the tortoise was crossing the finish line.",
    ],
    b: [
      "The Snail and the Deer",
      "A deer teased a snail for being slow and agreed to race it to the top of a hill. The deer ran off but stopped in a meadow to eat sweet clover, and then more, and more. The snail kept sliding upward without stopping. When the deer finally looked up, the snail was already at the top.",
    ],
    shared: ["A slow animal wins a race.", "A fast animal stops because it is too sure of itself."],
    onlyA: "The fast animal takes a nap.",
    onlyB: "The fast animal stops to eat.",
    neither: "The two animals help each other.",
    diffs: [
      ["the fast animal takes a nap", "the fast animal stops to eat"],
      ["the race ends at a finish line", "the race ends at the top of a hill"],
    ],
    falseDiff: "In Tale 1 the slow animal wins; in Tale 2 the fast animal wins.",
  },
  {
    a: [
      "The Ant and the Grasshopper",
      "All summer a grasshopper sang in the fields while an ant carried grain to its nest. “Come and sing!” said the grasshopper. “I am storing food for winter,” said the ant. When winter came, the grasshopper had nothing to eat and went to the ant's door, cold and hungry.",
    ],
    b: [
      "The Squirrel and the Bluebird",
      "In autumn a squirrel gathered nuts each day, while a bluebird sang in the branches and laughed at him for working so hard. When the snow fell, the bluebird could find no berries. She came shivering to the squirrel's hollow and asked for help. The squirrel shared his nuts and told her to plan ahead next year.",
    ],
    shared: ["One animal works to save food while another plays.", "The animal that played is hungry in winter."],
    onlyA: "The worker carries grain to a nest.",
    onlyB: "The worker shares food at the end.",
    neither: "The animals live together in a big, busy city full of people.",
    diffs: [
      ["the hungry animal is a grasshopper", "the hungry animal is a bluebird"],
      ["the tale ends at the worker's door", "the tale ends with the worker sharing food"],
    ],
    falseDiff: "In Tale 1 one animal works; in Tale 2 both animals play all year.",
  },
  {
    a: [
      "The Boy Who Cried Wolf",
      "A shepherd boy was bored watching sheep, so he shouted, “Wolf! Wolf!” The villagers ran up the hill, but there was no wolf. He laughed and did it again the next day. Then a real wolf came. The boy shouted and shouted, but no one believed him, and the wolf scattered the sheep.",
    ],
    b: [
      "The Girl Who Rang the Bell",
      "A girl in a fishing town liked to ring the harbor bell, which meant a storm was coming. Each time, the fishermen rushed home, and each time the sky was clear. One evening black clouds really did roll in. She rang the bell with all her strength, but the fishermen stayed out, and their boats were tossed by the waves.",
    ],
    shared: ["A child gives false warnings.", "No one believes the child when the danger is real."],
    onlyA: "The danger is a wolf.",
    onlyB: "The danger is a storm at sea.",
    neither: "The child is rewarded with a bag of gold for being honest.",
    diffs: [
      ["the child shouts a warning", "the child rings a bell"],
      ["the sheep are scattered", "the boats are tossed by waves"],
    ],
    falseDiff: "In Tale 1 people stop believing the child; in Tale 2 they always believe her.",
  },
  {
    a: [
      "The Fox and the Grapes",
      "A hungry fox saw a bunch of grapes hanging from a high vine. He jumped and jumped, but he could not reach them. At last he walked away with his nose in the air. “Those grapes are sour anyway,” he said.",
    ],
    b: [
      "The Cat and the Cream",
      "A cat smelled a jug of cream on a high shelf. She stretched and climbed, but the shelf was too high and slippery. Finally she sat down and licked her paw. “I never liked cream,” she said, though her whiskers were still twitching.",
    ],
    shared: ["An animal cannot reach the food it wants.", "The animal pretends it never wanted the food."],
    onlyA: "The food hangs from a vine.",
    onlyB: "The food is on a shelf indoors.",
    neither: "Another animal comes along and helps it reach the food at last.",
    diffs: [
      ["the animal wants grapes", "the animal wants cream"],
      ["the animal jumps for the food", "the animal climbs for the food"],
    ],
    falseDiff: "In Tale 1 the animal gives up; in Tale 2 it gets the food in the end.",
  },
  {
    a: [
      "The North Wind and the Sun",
      "The North Wind and the Sun argued about who was stronger. They saw a traveler in a coat. “Whoever makes him take off his coat wins,” said the Sun. The Wind blew hard, but the man held his coat tighter. Then the Sun shone gently, and soon the man took off his coat himself.",
    ],
    b: [
      "The Two Brothers and the Goat",
      "Two brothers wanted their stubborn goat to come into the barn. The older brother pulled and shouted, but the goat dug in its hooves. The younger brother held out a handful of fresh hay and spoke softly. The goat followed him straight into the barn.",
    ],
    shared: ["Gentleness works better than force.", "Two characters try to make someone do the same thing."],
    onlyA: "The characters are the wind and the sun.",
    onlyB: "The gentle one offers food.",
    neither: "The one who uses force and pushes hardest wins in the end.",
    diffs: [
      ["the gentle one shines warmly", "the gentle one offers hay"],
      ["the one being moved is a traveler", "the one being moved is a goat"],
    ],
    falseDiff: "In Tale 1 gentleness wins; in Tale 2 shouting wins.",
  },
  {
    a: [
      "The Crow and the Pitcher",
      "A thirsty crow found a pitcher with a little water at the bottom. Her beak could not reach it. She thought for a moment, then dropped pebbles into the pitcher, one by one. The water rose higher and higher until she could drink.",
    ],
    b: [
      "The Girl and the Ball in the Pipe",
      "Ana's ball rolled into a narrow pipe in the park, too deep for her arm to reach. She thought hard. Then she filled her bottle at the fountain and poured water into the pipe, again and again. The ball floated up until she could grab it.",
    ],
    shared: ["A character solves a problem by thinking.", "Something rises up so that it can be reached."],
    onlyA: "The character drops pebbles.",
    onlyB: "The character pours water.",
    neither: "The character gives up and asks a friend to bring some water.",
    diffs: [
      ["the crow drops pebbles to raise the water", "the girl pours water to raise the ball"],
      ["the character is thirsty", "the character wants her ball"],
    ],
    falseDiff: "In Tale 1 the character thinks of a plan; in Tale 2 she gives up.",
  },
  {
    a: [
      "Stone Soup",
      "Hungry travelers came to a village where no one would share food. They put a stone in a pot of water and said they were making stone soup. “It needs only a carrot,” they said. One by one, the villagers added carrots, onions and beans. Soon everyone shared a pot of delicious soup.",
    ],
    b: [
      "The Village Quilt",
      "A girl brought one square of cloth to the village square and said she was making a quilt big enough for everyone. A neighbor added a blue square, another a red one. Soon the whole village was sewing, and that winter the quilt kept the children warm at the school.",
    ],
    shared: ["Everyone gives a little to make something for all.", "One person starts with almost nothing."],
    onlyA: "They make a pot of soup.",
    onlyB: "What they make keeps children warm.",
    neither: "The villagers argue with one another and give up on the work.",
    diffs: [
      ["they cook soup in a pot", "they sew a quilt"],
      ["travelers start it", "a girl of the village starts it"],
    ],
    falseDiff: "In Tale 1 the villagers share; in Tale 2 no one helps the girl.",
  },
  {
    a: [
      "The Town Mouse and the Country Mouse",
      "A country mouse invited his cousin from town to dinner, but the town mouse sniffed at the plain seeds. “Come to town,” he said. There they ate cake and cheese, until a cat leaped at them and they fled. The country mouse went home. “Plain food in peace is better than cake in fear,” he said.",
    ],
    b: [
      "The River Fish and the Fountain Fish",
      "A fish from a city fountain bragged to a river fish about the coins and the bright lights. The river fish visited, but the water was shallow, and children's hands kept splashing in. He swam home to his quiet, deep river, glad of his simple life.",
    ],
    shared: ["A simple, safe life is better than a fancy one.", "A character visits a fancy place and goes home."],
    onlyA: "A cat leaps at the visitors.",
    onlyB: "Children's hands splash in the water.",
    neither: "Both characters pack their things and move to the city forever.",
    diffs: [
      ["the characters are mice", "the characters are fish"],
      ["the danger is a cat", "the danger is children's hands"],
    ],
    falseDiff: "In Tale 1 the visitor goes home; in Tale 2 he stays in the city.",
  },
  {
    a: [
      "The Goose That Laid Golden Eggs",
      "A farmer had a goose that laid one golden egg each day. He grew rich, but he wanted more. “There must be a pile of gold inside her,” he thought. He cut the goose open, but there was no gold inside, and now there were no more eggs.",
    ],
    b: [
      "The Magic Rice Pot",
      "A woman had a pot that filled with one bowl of rice each morning. It was enough for her family. But she wanted more, so she shook the pot and shouted, “Give me all your rice at once!” The pot cracked in two, and it never filled again.",
    ],
    shared: ["A character has something that gives a little each day.", "Wanting more ruins everything."],
    onlyA: "The gift is a golden egg.",
    onlyB: "The magic thing cracks in two.",
    neither: "The character shares everything with the village and is thanked.",
    diffs: [
      ["the gift comes from a goose", "the gift comes from a pot"],
      ["the farmer cuts the goose open", "the woman shakes the pot"],
    ],
    falseDiff: "In Tale 1 the character is greedy; in Tale 2 she is happy with what she has.",
  },
  {
    a: [
      "The Bundle of Sticks",
      "An old man's sons were always quarreling. He gave each of them a single stick, and each broke it easily. Then he tied a bundle of sticks together, and none of them could break it. “Together you are strong,” he said. “Apart you are weak.”",
    ],
    b: [
      "The Five Fingers",
      "Five fingers argued about which was the most important. The thumb said he was strongest, and the pointer said he was smartest. Then a girl tried to pick up a cup with one finger, and it fell. When all five worked together, she lifted it easily. The fingers stopped arguing.",
    ],
    shared: ["Characters who argue learn to work together.", "Many together are stronger than one alone."],
    onlyA: "A father teaches his sons.",
    onlyB: "A cup is lifted.",
    neither: "One character shows that he can do everything alone, without help.",
    diffs: [
      ["sticks are tied in a bundle", "fingers lift a cup"],
      ["the ones who argue are brothers", "the ones who argue are fingers"],
    ],
    falseDiff: "In Tale 1 the characters learn to work together; in Tale 2 they keep arguing.",
  },
  {
    a: [
      "The Ugly Duckling",
      "A gray, clumsy bird hatched among the ducklings, and they teased him all summer for being ugly. He wandered off alone and spent a hard winter in the reeds. In spring he saw his reflection in the lake. He had grown into a beautiful white swan.",
    ],
    b: [
      "The Plain Seed",
      "In a garden of bright flowers, one seed grew into a plain green stalk. The roses and tulips laughed at it. All summer it stood quietly while they bloomed. Then, late in autumn, when the other flowers had faded, it opened into a tall golden flower that shone in the cold air.",
    ],
    shared: ["Others laugh at a character for being plain.", "The character becomes beautiful in time."],
    onlyA: "The character spends a hard winter alone.",
    onlyB: "It blooms when the others have faded.",
    neither: "The character laughs at the others and is punished for it.",
    diffs: [
      ["the character is a bird", "the character is a plant"],
      ["the change comes in spring", "the change comes late in autumn"],
    ],
    falseDiff: "In Tale 1 others tease the character; in Tale 2 everyone praises it.",
  },
  {
    a: [
      "Anansi and the Pot of Wisdom",
      "Anansi the spider gathered all the wisdom in the world into a pot and tried to carry it up a tall tree to hide it. He tied the pot to his front, but it kept getting in his way. His little son called up, “Tie it to your back!” Anansi was so cross that a child knew better that he dropped the pot, and wisdom spilled out over the world.",
    ],
    b: [
      "The Know-It-All Owl",
      "An owl believed he knew everything and would not listen to anyone. One night he set out to fly to the moon to prove how wise he was. A young sparrow called, “It's too far! You'll get tired!” The owl kept flapping until he dropped, worn out, onto a haystack. He laughed at himself and began to listen.",
    ],
    shared: ["A character thinks he is the wisest of all.", "A young character gives wise advice."],
    onlyA: "Wisdom spills out over the world.",
    onlyB: "The character tries to fly to the moon.",
    neither: "The character wins a prize for being wise.",
    diffs: [
      ["the character is a spider", "the character is an owl"],
      ["the advice comes from a son", "the advice comes from a sparrow"],
    ],
    falseDiff: "In Tale 1 a young character gives advice; in Tale 2 no one advises the owl.",
  },
  {
    a: [
      "The Little Red Hen",
      "The little red hen found some grains of wheat. “Who will help me plant them?” she asked. “Not I,” said the dog, the cat and the duck. No one helped her cut, grind or bake. When the bread was ready, all of them wanted some. “I did the work,” she said, “so I will eat it.”",
    ],
    b: [
      "Marco's Treehouse",
      "Marco asked his friends to help him build a treehouse. They were all too busy playing ball. He carried boards and hammered nails by himself for a week. When it was done, his friends came running to climb up. “Next time, help build it,” Marco said, but he let them in.",
    ],
    shared: ["One character does all the work.", "Others want to enjoy what they did not help make."],
    onlyA: "The worker keeps the result for herself.",
    onlyB: "The worker lets the others in anyway.",
    neither: "Everyone helps with the work from the very start of the tale.",
    diffs: [
      ["the worker is a hen", "the worker is a boy"],
      ["the worker makes bread", "the worker builds a treehouse"],
    ],
    falseDiff: "In Tale 1 the others refuse to help; in Tale 2 everyone helps.",
  },
  {
    a: [
      "The Shoemaker and the Elves",
      "A poor shoemaker had leather for just one pair of shoes. He cut it out and went to bed. In the morning he found a perfect pair of shoes on his table, and this happened night after night. One night he hid and saw two tiny elves at work in ragged clothes. He and his wife sewed them little coats, and the elves danced away happily.",
    ],
    b: [
      "The Fisherman and the Seal",
      "A poor fisherman found a seal tangled in his net and set it free. The next morning his net was full of fish, and every day it was the same. One dawn he saw the seal pushing fish into his net. He carved it a wooden ball to play with, and the seal barked with joy.",
    ],
    shared: ["A poor worker is helped in secret.", "The worker gives a gift to say thank you."],
    onlyA: "The helpers are tiny elves.",
    onlyB: "The worker helped the animal first.",
    neither: "The worker becomes a rich king and lives in a golden palace.",
    diffs: [
      ["the helpers make shoes", "the helper brings fish"],
      ["the gift is clothes", "the gift is a wooden ball"],
    ],
    falseDiff: "In Tale 1 the worker thanks his helpers; in Tale 2 he never thanks the seal.",
  },
  {
    a: [
      "The Monkeys and the Moon",
      "One night a young monkey looked into a well and cried, “The moon has fallen in!” The monkeys made a chain, holding tails, to reach down and save it. The branch above them bent and snapped, and they all splashed into the water. Looking up, they saw the moon still shining in the sky.",
    ],
    b: [
      "The Dog and Its Reflection",
      "A dog crossed a bridge with a bone in its mouth. Looking down, he saw another dog with a bigger bone in the water. He barked to scare it, and his own bone fell into the stream. Too late, he saw that the other dog was only his reflection.",
    ],
    shared: ["A character takes a reflection in water for something real.", "The mistake ends with a splash into water."],
    onlyA: "Many animals work together.",
    onlyB: "The character is greedy for more.",
    neither: "The character gets everything it wants and is happy at the end.",
    diffs: [
      ["the reflection is of the moon", "the reflection is of the dog himself"],
      ["the animals want to save something", "the dog wants to take something"],
    ],
    falseDiff: "In Tale 1 the animals are fooled by a reflection; in Tale 2 the dog knows it is one.",
  },
];

const twoTales = (p: TalePair) => `**Tale 1: ${p.a[0]}**\n${p.a[1]}\n\n**Tale 2: ${p.b[0]}**\n${p.b[1]}`;

const sharedBank: readonly Ask[] = talePairs.flatMap((p) =>
  p.shared.map(
    (shared, i): Ask => ({
      question: t("What do the two tales have in common?", "这两个故事有什么共同点？"),
      shown: twoTales(p),
      right: shared,
      wrong: [i === 0 ? p.onlyA : p.onlyB, p.neither],
      why: t(
        `Both tales have this: ${shared} Something in common must be true of each tale, not only of one.`,
        `两个故事都有这一点：${shared} 共同点必须对两个故事都成立，而不只是其中一个。`,
      ),
      whyNot: [
        t(
          `That is true of only one of the tales; the other tale does not have it, so it is not something they share.`,
          "这只在其中一个故事里成立；另一个故事没有，所以它不是共同点。",
        ),
        t(
          "Neither tale has that; read both again and look for what happens in each.",
          "两个故事都没有这一点；再读一遍两个故事，看看各自发生了什么。",
        ),
      ],
    }),
  ),
);

const diffBank: readonly Ask[] = talePairs.flatMap((p) =>
  p.diffs.map(
    ([a, b]): Ask => ({
      question: t("How are the two tales different?", "这两个故事有什么不同？"),
      shown: twoTales(p),
      right: `In Tale 1 ${a}; in Tale 2 ${b}.`,
      wrong: [`In Tale 1 ${b}; in Tale 2 ${a}.`, p.falseDiff],
      why: t(
        `In Tale 1 ${a}, but in Tale 2 ${b}. A difference names what each tale has in place of the other's.`,
        `故事一里 ${a}，而故事二里 ${b}。说不同之处时，要说出每个故事各自有什么。`,
      ),
      whyNot: [
        t(
          "That mixes up the tales: it gives each tale what happens in the other one.",
          "这把两个故事弄混了：它把一个故事里的事说成了另一个故事里的。",
        ),
        t(
          "That is not true of the tales: on this point they are alike, so it is not a real difference.",
          "这和故事不符：在这一点上两个故事是相同的，所以它不是真正的不同之处。",
        ),
      ],
    }),
  ),
);

/** taleTopics are the reading topics of grade 3 on predictions and on comparing two folk tales. */
export const taleTopics: readonly TopicDef[] = [
  topic(
    "making-predictions",
    t("Making Predictions", "做出预测"),
    t(
      "A reader guesses what will happen next from clues in the text and changes the guess when new facts come.",
      "读者根据文中的线索猜测接下来会发生什么，并在出现新事实时修改猜测。",
    ),
    ["making-inferences"],
    [
      point(
        "choosing-the-best-prediction",
        t("Choosing the Best Prediction", "选择最好的预测"),
        t(
          "A **prediction** is a guess about what will happen next, made from **clues** in the text. If a dog runs to the door with its leash, the clues say it is time for a walk.\n\nA good prediction fits all the clues. A guess that goes against them, or that nothing in the text points to, is not a good prediction, even if it could happen.",
          "**预测**是根据文中的**线索**对接下来会发生什么的猜测。如果一只狗叼着牵绳跑到门口，线索就告诉我们该去散步了。\n\n好的预测符合所有线索。和线索相反的猜测，或者文中没有任何内容指向的猜测，即使可能发生，也不是好的预测。",
        ),
        askGenerator(predictBank),
      ),
      point(
        "changing-a-prediction",
        t("Changing a Prediction", "修改预测"),
        t(
          "Good readers **check** their predictions as they read. A new fact can support a prediction, change it, or make no difference.\n\nIf the dog runs to the door but then it starts to pour with rain, the walk may not happen: that fact changes the prediction. A fact that fits the guess, or has nothing to do with it, does not.",
          "好的读者在阅读时会不断**检验**自己的预测。一个新事实可能支持预测、改变预测，或者毫无影响。\n\n如果狗跑到门口，但随后下起了大雨，散步可能就去不成了：这个事实改变了预测。符合猜测的事实，或者和猜测无关的事实，都不会改变它。",
        ),
        askGenerator(changeBank),
      ),
    ],
  ),
  topic(
    "comparing-two-stories",
    t("Comparing Two Stories", "比较两个故事"),
    t(
      "Two folk tales from different places can share characters, problems or lessons, and differ in how they tell them.",
      "来自不同地方的两个民间故事可能有相同的角色、问题或道理，讲述的方式却不同。",
    ),
    ["lesson-of-a-story"],
    [
      point(
        "what-two-tales-share",
        t("What Two Tales Share", "两个故事的共同点"),
        t(
          "Folk tales from different places often tell the same kind of story: a small creature saves a big one, or a fast animal loses a race. To **compare** two tales, look for what is true of **both**: the kind of characters, the problem, or the lesson.\n\nCheck each choice against both tales. If it is true of only one, it is not something they share.",
          "来自不同地方的民间故事常常讲同一类故事：小动物救了大动物，或者跑得快的动物输了比赛。**比较**两个故事时，要找对**两个**都成立的东西：角色的类型、问题或者道理。\n\n用两个故事分别检验每个选项。如果只对其中一个成立，它就不是共同点。",
        ),
        askGenerator(sharedBank),
      ),
      point(
        "how-two-tales-differ",
        t("How Two Tales Differ", "两个故事的不同点"),
        t(
          "Two tales with the same lesson still tell it in their own way: the characters are different animals, the danger is different, or the ending is different.\n\nA **difference** says what each tale has: *in Tale 1 the helper chews through ropes; in Tale 2 the helper bites a foot*. Make sure each part belongs to the right tale.",
          "道理相同的两个故事，讲法仍然各不相同：角色是不同的动物，危险不同，或者结局不同。\n\n说**不同点**时，要说出每个故事各有什么：*故事一里帮忙的动物咬断了绳子；故事二里帮忙的动物咬了猎人的脚*。确保每一部分都对应正确的故事。",
        ),
        askGenerator(diffBank),
      ),
    ],
  ),
];
