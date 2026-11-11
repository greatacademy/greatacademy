// Grade 3: how words relate and how to look them up: synonyms and antonyms, compound words, homophones, shades of
// meaning, dictionaries and glossaries, and phrases that do not mean what their words say.

import { type TopicDef, t } from "@ga/content";
import { point, typedGenerator } from "@ga/subject-english";
import { type Arrange, type Ask, arrangeGenerator, askGenerator, gapFill, need, rows, topic } from "./kit.ts";

// Synonyms and antonyms: sentence with the word in bold|word|synonym|antonym|a word of neither kind.

const synonymRows = rows(`
  The giant let out a **furious** roar.|furious|angry|calm|curious
  The walls of the castle were **ancient**.|ancient|old|new|tall
  The children began to **shout** across the field.|shout|yell|whisper|run
  The puppy in the basket was **tiny**.|tiny|small|huge|soft
  Mia felt **glad** when her friend arrived.|glad|happy|sad|tired
  The path through the woods was **narrow**.|narrow|thin|wide|dark
  The first question on the test was **simple**.|simple|easy|hard|long
  The library was **quiet** in the evening.|quiet|silent|noisy|cold
  The baker **began** to mix the dough.|began|started|finished|tried
  The fox in the story was **clever**.|clever|smart|foolish|quick
  The kitten is **timid** around strangers.|timid|shy|bold|hungry
  Please **close** the door when you leave.|close|shut|open|paint
  The water in the old pond was **filthy**.|filthy|dirty|clean|deep
  The king in the tale was very **wealthy**.|wealthy|rich|poor|kind
  The hikers felt **weary** after the long climb.|weary|tired|rested|lost
  The hare was very **fast** and won every race.|fast|quick|slow|loud
  The nurse gave the child a **gentle** pat.|gentle|soft|rough|bright
  Climbing the mountain was **difficult**.|difficult|hard|easy|short
  The boy was **brave** in the dark cave.|brave|fearless|afraid|careful
  The whale was **enormous**.|enormous|huge|tiny|bright
  The baby began to **giggle** at the puppet.|giggle|laugh|cry|sleep
  The soup at the camp tasted **awful**.|awful|terrible|delicious|warm
  The clown's act was very **funny**.|funny|amusing|serious|long
  The dog **grabbed** the bone from the plate.|grabbed|seized|dropped|sniffed
  The lake looked **calm** this morning.|calm|still|stormy|blue
  The bread left on the table was **stale**.|stale|old|fresh|sweet
  The new ladder was very **sturdy**.|sturdy|strong|weak|wooden
  Your answer to the riddle was **correct**.|correct|right|wrong|short
  The hallway was **bright** with sunshine.|bright|light|dim|long
  The lion in the cage looked **fierce**.|fierce|wild|tame|hungry
  The sky before the storm was **gloomy**.|gloomy|dark|sunny|windy
  The farmer **gathered** the eggs into a basket.|gathered|collected|scattered|cooked
`).map((row) => need(row, 5));

const swap = (shown: string, word: string, other: string) => shown.replace(`**${word}**`, `**${other}**`);

const synonymBank: readonly Ask[] = synonymRows.map(([shown = "", word = "", syn = "", ant = "", other = ""]) => ({
  question: t("Which word means nearly the same as the word in bold?", "哪个词与加粗的词意思几乎相同？"),
  shown,
  right: syn,
  wrong: [ant, other],
  why: t(
    `*${syn}* is a synonym of *${word}*: put it in place of the word in bold and the sentence still says the same thing. ${swap(shown, word, syn)}`,
    `*${syn}* 是 *${word}* 的同义词：用它替换加粗的词，句子意思不变。${swap(shown, word, syn)}`,
  ),
  whyNot: [
    t(
      `*${ant}* means the opposite of *${word}*, so it is an antonym. Put it in the sentence and the meaning turns around.`,
      `*${ant}* 的意思与 *${word}* 相反，是反义词。把它放进句子，意思就反过来了。`,
    ),
    t(
      `*${other}* is neither the same nor the opposite: it is a different idea. The sentence would tell us something new.`,
      `*${other}* 既不是同义也不是反义，而是另一个意思。句子会说出另一件事。`,
    ),
  ],
}));

const antonymBank: readonly Ask[] = synonymRows.map(([shown = "", word = "", syn = "", ant = "", other = ""]) => ({
  question: t("Which word means the opposite of the word in bold?", "哪个词与加粗的词意思相反？"),
  shown,
  right: ant,
  wrong: [syn, other],
  why: t(
    `*${ant}* is an antonym of *${word}*: put it in place of the word in bold and the sentence turns around. ${swap(shown, word, ant)}`,
    `*${ant}* 是 *${word}* 的反义词：用它替换加粗的词，句子的意思就反过来了。${swap(shown, word, ant)}`,
  ),
  whyNot: [
    t(
      `*${syn}* means nearly the same as *${word}*, so it is a synonym, not an antonym. The sentence would not change.`,
      `*${syn}* 与 *${word}* 意思几乎相同，是同义词而不是反义词。句子的意思不会改变。`,
    ),
    t(
      `*${other}* is not the opposite of *${word}*; it is a different idea, so it does not turn the sentence around.`,
      `*${other}* 不是 *${word}* 的反义词，而是另一个意思，所以不能把句子的意思反过来。`,
    ),
  ],
}));

// Compound words: compound|first word|second word|sentence|meaning|meaning of one word only|meaning that mixes up the
// two words|a compound sharing a word|its meaning|another such compound|its meaning.

const compoundRows = rows(`
  sunflower|sun|flower|The **sunflower** in our garden is taller than my dad.|a tall flower that turns to face the sun|the bright star that warms the Earth|a flower that makes sunshine|sunlight|light that comes from the sun|wildflower|a flower that grows on its own in nature
  earthworm|earth|worm|The **earthworm** wriggled back into the soil.|a worm that lives in the soil|the planet that we live on|soil that is made by worms|earthquake|a shaking of the ground|silkworm|a caterpillar that spins silk
  rainbow|rain|bow|After the storm, a **rainbow** stretched across the sky.|a curve of colors in the sky when sun shines through rain|water that falls from the clouds|a bow that makes it start to rain|raindrop|a single drop of rain|raincoat|a coat that keeps off the rain
  backpack|back|pack|I put my lunch and my books in my **backpack**.|a bag that you carry on your back|the part of your body behind you|a way of packing your things backward|backyard|the yard behind a house|backbone|the row of bones down your back
  toothbrush|tooth|brush|I use my **toothbrush** every morning and every night.|a small brush for cleaning teeth|one of the hard white parts in your mouth|a tooth that is shaped like a brush|toothpaste|a paste for cleaning teeth|hairbrush|a brush for your hair
  snowman|snow|man|We built a **snowman** with a carrot for a nose.|a figure of a person made of snow|white flakes that fall in winter|a man whose job is to shovel snow|snowball|a ball of packed snow|snowflake|one small piece of falling snow
  doghouse|dog|house|The puppy slept in its **doghouse** in the yard.|a small shelter for a dog to sleep in|a pet that barks and wags its tail|a dog that lives inside a house|birdhouse|a small box where birds can nest|lighthouse|a tower with a light that guides ships
  bedroom|bed|room|I keep my books on a shelf in my **bedroom**.|a room where you sleep|a piece of furniture you sleep on|a bed that has a lot of room|bedtime|the time when you go to bed|classroom|a room where a class learns
  football|foot|ball|After school, we play **football** in the park.|a game played by kicking a ball|the part of your leg you stand on|a ball that is shaped like a foot|footprint|a mark left by a foot|baseball|a game played with a bat and a ball
  cupcake|cup|cake|Mom baked a **cupcake** for each child in my class.|a small cake baked in a paper cup|something you drink from|a cup that is made of cake|pancake|a flat cake cooked in a pan|cupboard|a cabinet with shelves for cups and dishes
  starfish|star|fish|We found a **starfish** in a pool on the beach.|a sea animal shaped like a star|a tiny bright light in the night sky|a fish that lives up in the stars|goldfish|a small orange fish kept as a pet|starlight|the light that comes from stars
  bookshelf|book|shelf|The **bookshelf** in the library was full of stories.|a shelf for holding books|pages bound together for reading|a book that is all about shelves|bookmark|a strip that marks your place in a book|notebook|a book of blank pages for notes
  seashell|sea|shell|I held the **seashell** to my ear and heard a soft roar.|a shell found by the sea|the salty water that covers much of the Earth|a shell that is full of sea water|seaweed|a plant that grows in the sea|eggshell|the hard outside of an egg
  firefly|fire|fly|A **firefly** blinked its light in the dark garden.|an insect whose body glows like a tiny fire|hot, bright flames that burn|a fire that was started by flies|fireplace|a place in a wall for a fire|dragonfly|an insect with long wings that flies near water
  mailbox|mail|box|The letter from Grandma was waiting in the **mailbox**.|a box where letters are left|letters and packages that are sent to you|a box that you send in the mail|mailbag|a bag for carrying letters|lunchbox|a box for carrying lunch
  raincoat|rain|coat|I wore my yellow **raincoat** to school today.|a coat that keeps off the rain|water that falls from the clouds|a coat that is made of rain|rainfall|the amount of rain that falls|overcoat|a long, warm coat worn over other clothes
  moonlight|moon|light|The path was silver in the **moonlight**.|the light that comes from the moon|the round object we see in the night sky|a moon that is made of light|moonbeam|a single ray of light from the moon|daylight|the light of the day
  playground|play|ground|At recess, we ran to the **playground**.|an outdoor place where children play|to have fun with games and toys|ground that likes to play games|playtime|a time for playing|underground|below the surface of the ground
  haircut|hair|cut|Dad took me to get a **haircut** before school started.|the cutting of someone's hair|the strands that grow on your head|hair that can cut things|hairbrush|a brush for your hair|shortcut|a quicker way to get somewhere
  sandcastle|sand|castle|The waves washed away our **sandcastle** at the beach.|a castle that is built of sand|the tiny grains on a beach|sand that is found inside a castle|sandbox|a box of sand for children to play in|sandpaper|rough paper used to smooth wood
  teapot|tea|pot|Grandma poured hot water into the **teapot**.|a pot for making and pouring tea|a hot drink made from leaves|tea that tastes like a pot|teacup|a cup for drinking tea|flowerpot|a pot for growing a plant
  grasshopper|grass|hopper|A green **grasshopper** jumped out of the lawn.|an insect that hops through the grass|the green plants of a lawn|grass that hops up and down|grassland|a wide area of land covered with grass|seashore|the land beside the sea
  waterfall|water|fall|We heard the **waterfall** before we saw it.|water falling over a cliff or rocks|the clear liquid that we drink|a fall that you take into water|watermelon|a big, juicy fruit with a green skin|rainfall|the amount of rain that falls
  homework|home|work|I finished my math **homework** before dinner.|schoolwork that you do at home|the place where you live|work on building a home|homesick|sad because you miss your home|housework|cleaning and other jobs in a house
  weekend|week|end|On the **weekend**, we visit my cousins.|Saturday and Sunday, at the end of the week|seven days in a row|a week that has no end|weekday|any day from Monday to Friday|bookend|a support that holds up a row of books
  airplane|air|plane|The **airplane** flew high above the clouds.|a machine with wings that flies in the air|what we breathe in and out|air that is kept inside a plane|airport|a place where planes take off and land|seaplane|a plane that can land on water
  doorbell|door|bell|When the **doorbell** rang, the dog barked.|a bell that you ring at a door|something that opens and closes a room|a door that is shaped like a bell|doorway|the opening where a door is|bluebell|a small blue flower shaped like a bell
  footprint|foot|print|We found a muddy **footprint** on the kitchen floor.|a mark that a foot leaves|the part of your leg you stand on|words that are printed on a foot|football|a game played by kicking a ball|fingerprint|a mark that a finger leaves
  houseboat|house|boat|My uncle lives on a **houseboat** on the river.|a boat that people live on|a building where people live|a building where boats are kept|housefly|a fly that buzzes around homes|sailboat|a boat that is moved by the wind in its sail
  boathouse|boat|house|The rowers keep their canoes in the **boathouse**.|a building where boats are kept|something that floats and carries people on water|a boat that people live on|boatyard|a place where boats are built or fixed|greenhouse|a glass building where plants grow
  bluebird|blue|bird|A **bluebird** sang on the fence.|a small bird with blue feathers|the color of a clear sky|a blue color that is named after a bird|blueberry|a small, round blue fruit|blackbird|a bird with black feathers
  pancake|pan|cake|For breakfast, I ate a **pancake** with syrup.|a flat cake cooked in a pan|a metal dish for cooking|a pan that is made of cake|pantry|a small room where food is kept|cupcake|a small cake baked in a paper cup
`).map((row) => need(row, 11));

const compoundMeaningBank: readonly Ask[] = compoundRows.map(
  ([word = "", a = "", b = "", shown = "", meaning = "", onePart = "", mixed = ""]) => ({
    question: t(
      "The word in bold is a compound word, made of two words. What does it mean?",
      "加粗的词是复合词，由两个词组成。它是什么意思？",
    ),
    shown,
    right: meaning,
    wrong: [onePart, mixed],
    why: t(
      `Split it into its two words: *${a}* + *${b}*. Its meaning comes from both of them: *${word}* is ${meaning}.`,
      `把它拆成两个词：*${a}* + *${b}*。它的意思来自这两个词：*${word}* 是 ${meaning}。`,
    ),
    whyNot: [
      t(
        `That is what *${a}* means on its own. A compound takes its meaning from both words, so *${b}* must count too.`,
        `这只是 *${a}* 单独的意思。复合词的意思来自两个词，*${b}* 也必须算进去。`,
      ),
      t(
        `That joins *${a}* and *${b}* the wrong way round. In a compound, the second word names the thing, and the first tells what kind: *${word}* is a kind of ${b}.`,
        `这样把 *${a}* 和 *${b}* 的关系弄反了。复合词中，后一个词说出是什么东西，前一个词说明是哪一种：*${word}* 是一种 ${b}。`,
      ),
    ],
  }),
);

const compoundBuildBank: readonly Ask[] = compoundRows.map(
  ([word = "", a = "", b = "", , meaning = "", , , n1 = "", m1 = "", n2 = "", m2 = ""]) => ({
    question: t(`Which compound word means "${meaning}"?`, `哪个复合词的意思是“${meaning}”？`),
    shown: "",
    right: word,
    wrong: [n1, n2],
    why: t(
      `*${a}* + *${b}* = **${word}**, ${meaning}. Each of its two words gives part of the meaning.`,
      `*${a}* + *${b}* = **${word}**，意思是 ${meaning}。它的两个词各自提供一部分意思。`,
    ),
    whyNot: [
      t(`*${n1}* is a compound too, but it means ${m1}.`, `*${n1}* 也是复合词，但它的意思是 ${m1}。`),
      t(`*${n2}* is a compound too, but it means ${m2}.`, `*${n2}* 也是复合词，但它的意思是 ${m2}。`),
    ],
  }),
);

// Homophones: word|its meaning|its meaning in Chinese|a sentence|another sentence; each pair of lines is one pair
// of homophones, with a spelling a reader might invent for them.

const homophonePairs = rows(`
  bear|a big, furry wild animal|熊|A brown ___ caught a fish in the river.|The ___ slept in its den all winter.|bare|bair
  bare|with nothing covering it|光秃秃的，没有遮盖的|In winter, the trees are ___ without their leaves.|I walked on the warm sand in my ___ feet.|bear|bair
  tail|the part at the back end of an animal's body|尾巴|The dog wagged its ___ when I came home.|A monkey can hang from a branch by its ___.|tale|tayl
  tale|a story|故事|Grandpa told us a ___ about a magic fish.|The ___ of the three bears is my sister's favorite.|tail|tayl
  flower|the colorful part of a plant that blooms|花|A bee landed on the yellow ___.|I picked a ___ for my teacher.|flour|flowr
  flour|a powder made from grain, used to bake bread|面粉|Mix the ___ with eggs and milk to make pancakes.|The baker's apron was white with ___.|flower|flowr
  hole|an opening or an empty space in something|洞|The rabbit hid in a ___ under the tree.|There is a ___ in my sock.|whole|hoal
  whole|all of something, with nothing left out|全部的，整个的|The hungry boy ate the ___ pizza by himself.|We stayed at the beach the ___ day.|hole|hoal
  knight|a soldier long ago who wore armor and rode a horse|骑士|The ___ rode his horse to the castle.|A brave ___ fought the dragon.|night|nite
  night|the time when it is dark outside|夜晚|The owl hunts at ___.|We saw many stars in the sky last ___.|knight|nite
  pair|two things that go together|一双，一对|I need a new ___ of shoes.|She wore a ___ of red gloves.|pear|paer
  pear|a sweet green or yellow fruit|梨|The ___ was soft and juicy.|I packed a ___ and a sandwich for lunch.|pair|paer
  sea|the salty water that covers much of the Earth|海|The ship sailed across the ___.|Fish and whales live in the ___.|see|sie
  see|to notice with your eyes|看见|I can ___ the mountains from my window.|Put on your glasses so you can ___ the board.|sea|sie
  weak|not strong|虚弱的，无力的|After being sick, I felt ___ and tired.|The ___ bridge could not hold the heavy truck.|week|weke
  week|seven days|星期，一周|We go swimming once a ___.|School starts again next ___.|weak|weke
  right|correct, or the side opposite the left|正确的；右边的|Turn ___ at the corner.|You got every answer ___ on the test.|write|rihgt
  write|to put words on paper|写|Please ___ your name at the top of the page.|I will ___ a letter to my aunt.|right|rihgt
  blew|moved air, or was pushed by moving air|吹（blow 的过去式）|The wind ___ my hat off my head.|She ___ out all the candles on her cake.|blue|bloo
  blue|the color of a clear sky|蓝色的|The sky is ___ on a sunny day.|He wore a ___ shirt to the party.|blew|bloo
  meat|food that comes from animals|肉|The lion ate the ___.|We grilled some ___ and vegetables for dinner.|meet|meit
  meet|to come together with someone|见面，遇见|Let us ___ at the park after school.|I would like you to ___ my best friend.|meat|meit
  plain|simple, with nothing added|朴素的，简单的|I like my yogurt ___, with no fruit.|She wore a ___ white dress.|plane|plaen
  plane|a machine with wings that flies|飞机|The ___ landed at the airport.|We took a ___ to visit Grandma.|plain|plaen
`).map((row) => need(row, 7));

const meaningOf = new Map(homophonePairs.map(([word = "", en = "", zh = ""]) => [word, [en, zh] as const]));

const homophoneChoiceBank: readonly Ask[] = [0, 1].flatMap((r) =>
  homophonePairs.map(([word = "", en = "", zh = "", s1 = "", s2 = "", other = "", made = ""]): Ask => {
    const shown = r === 0 ? s1 : s2;
    const [oen, ozh] = meaningOf.get(other) ?? ["", ""];
    return {
      question: t("Which word completes the sentence?", "哪个词能补全句子？"),
      shown,
      right: word,
      wrong: [other, made],
      why: t(
        `${gapFill(shown, word)} *${word}* means ${en}, which is what the sentence needs. Homophones sound alike, so choose by meaning.`,
        `${gapFill(shown, word)} *${word}* 的意思是“${zh}”，正是句子需要的。同音词读音相同，要按意思来选。`,
      ),
      whyNot: [
        t(
          `*${other}* sounds the same, but it means ${oen}, which does not fit this sentence.`,
          `*${other}* 读音相同，但意思是“${ozh}”，放进这个句子说不通。`,
        ),
        t(`*${made}* sounds right, but it is not how any English word is spelled.`, `*${made}* 听起来对，但英语里没有这样拼写的词。`),
      ],
    };
  }),
);

const homophoneFixBank = [0, 1].flatMap((r) =>
  homophonePairs.map(([word = "", en = "", zh = "", s1 = "", s2 = "", other = ""]) => {
    const sentence = (r === 0 ? s1 : s2).replace("___", other);
    const [oen, ozh] = meaningOf.get(other) ?? ["", ""];
    return {
      shown: sentence.charAt(0).toUpperCase() + sentence.slice(1),
      accepted: [word],
      canonical: word,
      wrong: [other],
      zh,
      en,
      oen,
      ozh,
      other,
    };
  }),
);

const homophoneFixWhy = new Map(homophoneFixBank.map((i) => [`${i.canonical}|${i.shown}`, i] as const));

// Shades of meaning: three words from weakest to strongest|a sentence that needs one of them|which one, 0 to 2.

const shadeRows = rows(`
  cool|chilly|freezing|It was so ___ that the pond froze solid overnight.|2
  warm|hot|scorching|The afternoon was ___, so we sat in the sun with our jackets off, nice but not too hot.|0
  damp|wet|soaked|After an hour in the storm, I was ___ from my hair to my socks.|2
  glad|happy|overjoyed|When she won the lottery, the woman was so ___ that she danced in the street and cried with joy.|2
  sad|miserable|heartbroken|Leo felt a little ___ when the game ended, but he cheered up at dinner.|0
  small|tiny|microscopic|The germs were so ___ that we could only see them through a microscope.|2
  big|huge|gigantic|The box was ___, but I could still carry it by myself.|0
  good|great|fantastic|The soup was ___, not the best I ever had, but nice and warm.|0
  nervous|scared|terrified|Mia was a bit ___ before the spelling bee, so she took a deep breath.|0
  annoyed|angry|furious|My brother was ___ when I hummed the same song for the fifth time, but he just rolled his eyes.|0
  like|love|adore|I ___ my grandma more than anyone in the whole world; I think about her every day.|2
  walk|jog|sprint|With the bus about to leave, Sam had to ___ as fast as his legs could go.|2
  whisper|speak|shout|In the library, you should ___ so that you do not disturb anyone.|0
  drizzle|rain|downpour|It was only a light ___, so we did not need umbrellas.|0
  breeze|wind|gale|The ___ was so strong that it knocked down trees and tore roofs off houses.|2
  pretty|beautiful|stunning|The sunset was so ___ that everyone on the beach stopped talking to stare at it.|2
  smart|clever|brilliant|Only a truly ___ scientist could solve a puzzle that had stumped the world for a hundred years.|2
  interested|excited|thrilled|The class was ___ in the new book and asked a few questions about it.|0
  sip|drink|gulp|The tea was very hot, so Grandpa took only a tiny ___.|0
  tap|knock|pound|The angry giant began to ___ on the door so hard that the house shook.|2
  dim|dark|pitch-black|The cave was ___; we could not see our hands in front of our faces.|2
  bright|dazzling|blinding|The flash was so ___ that I could not see anything for a minute afterward.|2
  quiet|hushed|silent|The room was completely ___; there was not one sound.|2
  messy|dirty|filthy|My room is a little ___, with a few socks on the floor.|0
  worried|anxious|panicked|When the fire alarm rang and the smoke grew thick, the people ___ and ran in every direction.|2
  loud|booming|deafening|The music at the concert was so ___ that we had to cover our ears and could not hear for an hour.|2
  hard|difficult|impossible|The puzzle was ___, but we finished it with a little help.|0
  pleased|delighted|ecstatic|Dad was ___ with my report card and gave me a small smile.|0
  toss|throw|hurl|Just ___ the ball gently to the baby so she can catch it.|0
  sniffle|cry|sob|My little sister began to ___ so hard that her whole body shook.|2
`).map((row) => need(row, 5));

const shadeArrangeBank: readonly Arrange[] = shadeRows.map(([a = "", b = "", c = ""]) => ({
  question: t("Put these words in order from the weakest to the strongest.", "把这些词按程度从弱到强排列。"),
  shown: "",
  steps: [a, b, c],
  why: t(
    `From weakest to strongest: *${a}*, *${b}*, *${c}*. The words share a meaning, but *${c}* says it most strongly and *${a}* least.`,
    `从弱到强：*${a}*、*${b}*、*${c}*。这些词意思相近，但 *${c}* 程度最强，*${a}* 最弱。`,
  ),
}));

const shadeChoiceBank: readonly Ask[] = shadeRows.map(([a = "", b = "", c = "", shown = "", which = "0"]) => {
  const words = [a, b, c];
  const k = Number(which);
  const right = words[k] ?? a;
  const wrong = words.filter((_, i) => i !== k);
  return {
    question: t("Which word is exactly as strong as the sentence needs?", "哪个词的程度正好符合句子的需要？"),
    shown,
    right,
    wrong,
    why: t(
      `${gapFill(shown, right)} The clues in the sentence show how strong the word must be, and *${right}* is the one of *${a}*, *${b}* and *${c}* that matches.`,
      `${gapFill(shown, right)} 句中的线索说明了这个词需要多强的程度，在 *${a}*、*${b}*、*${c}* 中只有 *${right}* 合适。`,
    ),
    whyNot: wrong.map((w) =>
      words.indexOf(w) < k
        ? t(
            `*${w}* has the right meaning but is too weak for what the sentence describes.`,
            `*${w}* 意思对，但程度太弱，配不上句子描述的情形。`,
          )
        : t(
            `*${w}* has the right meaning but is too strong for what the sentence describes.`,
            `*${w}* 意思对，但程度太强，超过了句子描述的情形。`,
          ),
    ),
  };
});

// Dictionaries: words to put in order; guide words|a word between|a word before|a word after; entries.

const orderRows = rows(`
  bread|brick|bring|brown
  cab|cake|camp|cap
  dash|deep|dinner|dot
  sand|seal|shell|snail
  table|tent|thumb|town
  map|melon|milk|mop
  river|road|robin|rope
  plant|plate|play|plum
  stamp|star|start|stay
  grape|grass|great|green
  chain|chair|chalk|chart
  fable|face|farm|fast
  hand|happy|hat|have
  lamp|land|lane|last
  pear|peas|pen|pet
  boat|boil|bone|book
  snack|snail|snake|snow
  water|wave|weed|wind
  trace|track|train|trap
  cloud|clown|club|clue
  spice|spider|spill|spin
  frog|from|front|frost
  bead|beak|beam|bean
  crab|crack|craft|crane
  glad|glass|globe|glue
  heap|hear|heat|heavy
  mice|might|mild|mind
  shade|shake|shape|share
  storm|story|stove|straw
  tiger|tight|time|tiny
  moon|moose|mop|more
  flag|flame|flap|flat
`).map((row) => need(row, 4));

const orderBank: readonly Arrange[] = orderRows.map((words) => {
  const sorted = [...words].sort();
  if (sorted.join() !== words.join()) throw new Error(`not in order: ${words.join(" ")}`);
  return {
    question: t("Put these words in alphabetical order.", "把这些词按字母顺序排列。"),
    shown: "",
    steps: words,
    why: t(
      `In alphabetical order: ${words.join(", ")}. When the first letters are the same, compare the second letters, and if those match too, the third.`,
      `按字母顺序：${words.join("、")}。首字母相同时比较第二个字母，第二个也相同就比较第三个。`,
    ),
  };
});

const guideRows = rows(`
  maple|market|march|magic|mask
  bake|bark|bang|baby|base
  candle|cast|carrot|camel|cat
  dish|dock|dive|dirt|dog
  feather|fern|fence|feast|ferry
  gate|gift|giant|garden|glow
  hill|horse|hive|high|hose
  jacket|jelly|jar|ivy|jewel
  kettle|kitten|kick|kangaroo|kiwi
  ladder|leaf|lamb|lace|learn
  nail|nest|needle|nag|nose
  ocean|oil|office|oak|old
  paint|park|pan|pad|part
  quack|quiet|queen|puzzle|quilt
  rabbit|rain|race|quit|raise
  sail|scale|salt|safe|scarf
  tank|team|taste|tan|tear
  uncle|up|under|umbrella|upset
  vase|violin|vest|van|visit
  wagon|weather|wave|wade|web
  bell|bird|berry|beg|bite
  chick|chop|chin|chew|chorus
  door|drum|dragon|dome|duck
  fog|fox|fork|fly|frame
  pine|pit|pink|pillow|pizza
  shelf|ship|shine|sheep|shirt
  tomato|tooth|tool|toast|top
  bucket|bun|bug|brush|bunny
  coast|coin|coat|coach|cold
  lemon|lily|light|leg|lime
`).map((row) => need(row, 5));

const guideBank: readonly Ask[] = guideRows.map(([g1 = "", g2 = "", between = "", before = "", after = ""]) => {
  if (!(g1 < between && between < g2 && before < g1 && after > g2)) throw new Error(`guide words out of order: ${g1} ${g2}`);
  return {
    question: t(
      `The guide words at the top of a dictionary page are *${g1}* and *${g2}*. Which word is on this page?`,
      `一页词典顶部的导词是 *${g1}* 和 *${g2}*。哪个词在这一页上？`,
    ),
    shown: "",
    right: between,
    wrong: [before, after],
    why: t(
      `*${between}* comes after *${g1}* and before *${g2}* in alphabetical order, so it is on this page. Guide words show the first and the last word of a page.`,
      `按字母顺序，*${between}* 在 *${g1}* 之后、*${g2}* 之前，所以在这一页。导词表示一页上的第一个词和最后一个词。`,
    ),
    whyNot: [
      t(
        `*${before}* comes before *${g1}* in alphabetical order, so it is on an earlier page.`,
        `按字母顺序，*${before}* 在 *${g1}* 之前，所以在前面的页上。`,
      ),
      t(
        `*${after}* comes after *${g2}* in alphabetical order, so it is on a later page.`,
        `按字母顺序，*${after}* 在 *${g2}* 之后，所以在后面的页上。`,
      ),
    ],
  };
});

const entryRows = rows(`
  bat|The **bat** flew out of the cave at sunset.|a small animal with wings that flies at night|a stick used to hit a ball|to blink your eyes quickly
  bark|The **bark** of the old tree was rough.|the hard outer covering of a tree|the short, loud sound a dog makes|a kind of sailing ship
  bank|We had a picnic on the grassy **bank** of the river.|the land along the side of a river|a place where people keep money|to tip an airplane to one side
  fair|It is not **fair** that he got two turns.|treating everyone in the same way|a show with rides, games and prizes|light in color
  light|This box is so **light** that I can lift it with one finger.|not heavy|the brightness that lets us see|to start a fire burning
  ring|The phone began to **ring** in the kitchen.|to make the sound of a bell|a circle of metal worn on a finger|a space where a show or a match takes place
  rock|Mom will **rock** the baby to sleep.|to move gently back and forth|a hard piece of stone|a kind of loud music
  wave|Grandma waved goodbye with a **wave** of her hand.|a movement of the hand to greet someone|a moving ridge of water on the sea|a curl in the hair
  spring|The flowers bloom in **spring**.|the season after winter|a coil of metal that bounces back|a place where water comes out of the ground
  star|She was the **star** of the school play.|the most important performer in a show|a ball of burning gas in the sky|a shape with five or more points
  trunk|The elephant lifted the log with its **trunk**.|the long nose of an elephant|the thick stem of a tree|a large box for storing things
  pitch|Do you know how to **pitch** a tent?|to set up|to throw a ball to a batter|how high or low a sound is
  park|Dad had to **park** the car far from the store.|to leave a car in a place for a time|a green place where people play and walk|an area kept for wild animals
  match|Strike the **match** to light the candle.|a small stick that makes a flame when rubbed|a game between two players or teams|to go well with something
  bowl|Let us **bowl** at the new alley on Saturday.|to roll a ball at pins in a game|a deep, round dish|the hollow part of a spoon
  letter|The word "cat" begins with the **letter** c.|a sign that stands for a sound in writing|a written message sent to someone|a large, flat sheet of paper
  kind|What **kind** of dog is that?|a type or sort|friendly and gentle|in a way that is close to
  block|We live two **block**s from the school.|the part of a street between two corners|a solid piece of wood or stone|to stop something from passing
  train|The coach will **train** the team every Tuesday.|to teach and practice a skill|a line of railway cars pulled by an engine|the long back part of a dress
  saw|I **saw** a deer in the woods.|noticed with your eyes|a tool with a sharp blade for cutting wood|an old saying
  row|We sat in the front **row** of the theater.|a line of seats or things side by side|to move a boat with oars|a noisy fight
  nail|Hang the picture on the **nail**.|a thin metal spike you hammer into wood|the hard covering at the end of a finger|to catch or get hold of
  fan|Turn on the **fan** when it gets hot.|a machine with blades that moves air|a person who loves a sport or a star|to spread out like a fan
  tie|Can you **tie** your shoelaces?|to fasten with a knot or a bow|a long strip of cloth worn around the neck|a game that ends with the same score
  roll|I ate a warm **roll** with butter.|a small round piece of bread|to move by turning over and over|a list of names
  check|Please **check** your answers before you hand in the test.|to look at something to make sure it is right|a pattern of squares|a written order to a bank to pay money
  scale|Stand on the **scale** to see how much you weigh.|a machine for weighing things|one of the small, hard plates on a fish|a set of musical notes going up or down
  file|Use a **file** to smooth your nails.|a tool with a rough surface for smoothing|a folder for keeping papers|a line of people one behind another
  bill|The duck dipped its **bill** into the water.|the beak of a bird|a paper that tells how much you must pay|a plan for a new law
  slip|Be careful not to **slip** on the ice.|to slide and lose your balance|a small piece of paper|a light dress worn under another
`).map((row) => need(row, 5));

const entryBank: readonly Ask[] = entryRows.map(([word = "", shown = "", right = "", m2 = "", m3 = ""], i) => {
  const meanings = [
    [right, m2, m3],
    [m2, right, m3],
    [m2, m3, right],
  ][i % 3] ?? [right, m2, m3];
  const entry = `**${word}** 1. ${meanings[0]} 2. ${meanings[1]} 3. ${meanings[2]}`;
  return {
    question: t(
      "Read the dictionary entry and the sentence. Which meaning of the word fits the sentence?",
      "阅读词典词条和句子。这个词的哪个意思符合句子？",
    ),
    shown: `${entry}\n\n${shown}`,
    right,
    wrong: [m2, m3],
    why: t(
      `In this sentence, *${word}* means ${right}. An entry lists each meaning separately, so try each one in the sentence and keep the one that makes sense.`,
      `在这个句子里，*${word}* 的意思是 ${right}。词条把每个意思分开列出，把每个意思代入句子，保留说得通的那个。`,
    ),
    whyNot: [m2, m3].map((m) =>
      t(
        `That is another meaning of *${word}* in the entry, but put "${m}" in the sentence and it stops making sense.`,
        `这是词条中 *${word}* 的另一个意思，但把“${m}”放进这个句子就说不通了。`,
      ),
    ),
  };
});

// Literal and nonliteral phrases: phrase|literal sentence|nonliteral sentence.

const usePairs = rows(`
  a piece of cake|Grandma cut **a piece of cake** for each of us.|The spelling test was **a piece of cake**.
  break the ice|We had to **break the ice** on the pond so the ducks could drink.|Lily told a joke to **break the ice** on the first day of school.
  take a step back|Please **take a step back** from the hot stove.|When you are angry, **take a step back** and think before you speak.
  cold feet|After playing in the snow, I had **cold feet** and wet socks.|Max got **cold feet** before his solo and almost did not sing.
  let the cat out of the bag|The kitten climbed into the shopping bag, so I **let the cat out of the bag**.|Ben **let the cat out of the bag** and told Mom about her surprise party.
  in hot water|Put the frozen bottle **in hot water** to melt the ice.|Sam was **in hot water** after he broke the window.
  hold your horses|**Hold your horses** tightly by the reins so they do not run off.|**Hold your horses**! We cannot open the presents until everyone is here.
  a fish out of water|The cat knocked the bowl over and left **a fish out of water**, flopping on the floor.|On my first day at the new school, I felt like **a fish out of water**.
  in the same boat|The two friends sat **in the same boat** and rowed across the lake.|We all forgot our homework, so we were **in the same boat**.
  ring a bell|At noon, the teacher will **ring a bell** for lunch.|Her name does not **ring a bell**; I don't think I have met her.
  get the ball rolling|Give it a push to **get the ball rolling** down the hill.|Let us **get the ball rolling** by choosing a name for our club.
  spill the beans|Be careful not to **spill the beans** when you carry the pot to the table.|Please do not **spill the beans** about the gift before her birthday.
  on thin ice|The skaters were **on thin ice** that began to crack.|After being late three times, Leo is **on thin ice** with his coach.
  a heart of gold|The pirate's chest held **a heart of gold**, a locket made of shining metal.|Our neighbor has **a heart of gold** and helps everyone on the street.
  hit the hay|The farmer's pitchfork **hit the hay** as he tossed it into the barn.|I was so tired that I wanted to **hit the hay** right after dinner.
  a drop in the bucket|We heard **a drop in the bucket** each time the roof leaked.|The ten cents we found is just **a drop in the bucket** compared with what the bike costs.
`).map((row) => need(row, 3));

const literalBank: readonly Ask[] = usePairs.flatMap(([phrase = "", literal = "", figurative = ""], i): Ask[] => {
  const next = usePairs[(i + 1) % usePairs.length] ?? [];
  const [, nextLiteral = "", nextFigurative = ""] = next;
  return [
    {
      question: t(
        "Which sentence uses its phrase literally, so that the words mean exactly what they say?",
        "哪个句子是按字面意思使用短语的，也就是词语的意思和字面完全一样？",
      ),
      shown: "",
      right: literal,
      wrong: [figurative, nextFigurative],
      why: t(
        `In "${literal}", the words mean exactly what they say: picture it, and that is what happens. The other sentences use their phrases to mean something else.`,
        `在“${literal}”中，词语就是字面意思：想象一下，事情正是这样发生的。其他句子中的短语表示的是另外的意思。`,
      ),
      whyNot: [figurative, nextFigurative].map((s) =>
        t(
          `Here the phrase does not mean what its words say; nobody in "${s}" is really doing that. It is nonliteral.`,
          `这里的短语并不是字面意思，“${s}”中没有人真的那样做。它是非字面用法。`,
        ),
      ),
    },
    {
      question: t(
        "Which sentence uses its phrase nonliterally, so that it means something other than what its words say?",
        "哪个句子是非字面地使用短语的，也就是短语的意思和字面不同？",
      ),
      shown: "",
      right: figurative,
      wrong: [literal, nextLiteral],
      why: t(
        `In "${figurative}", *${phrase}* does not mean what its words say; it is a nonliteral phrase with a meaning of its own.`,
        `在“${figurative}”中，*${phrase}* 不是字面意思，而是有自己含义的非字面短语。`,
      ),
      whyNot: [literal, nextLiteral].map((s) =>
        t(
          `In "${s}", the words mean exactly what they say, so the phrase is used literally.`,
          `在“${s}”中，词语就是字面意思，所以短语是按字面使用的。`,
        ),
      ),
    },
  ];
});

const idiomRows = rows(`
  The spelling test was **a piece of cake**.|very easy|a slice of a sweet food|very hard to do
  It's **raining cats and dogs**, so take an umbrella.|raining very hard|pets are falling from the sky|it is a little cloudy
  Our neighbor has **a heart of gold**.|is very kind|has a heart made of metal|is very rich
  Lily told a joke to **break the ice** on the first day of school.|to help people start talking|to crack frozen water|to make people angry
  Sam stayed home because he was **under the weather**.|a little sick|standing under the clouds|very happy
  I have a test tomorrow, so I need to **hit the books** tonight.|study hard|knock books off a shelf|go to bed early
  Max got **cold feet** before his solo and almost did not sing.|felt too nervous to do something|his toes were chilly|felt very brave
  Ben **let the cat out of the bag** about the surprise party.|told a secret|freed a pet from a sack|kept a secret well
  Sam was **in hot water** after he broke the window.|in trouble|in a warm bath|in a good mood
  Tell me your story; I'm **all ears**.|listening carefully|covered in ears|not interested
  Before the race, I had **butterflies in my stomach**.|felt nervous|ate some insects|felt sleepy
  When she got the puppy, Ana was **on cloud nine**.|very happy|high in the sky|very worried
  **Hold your horses**! We cannot open the presents yet.|wait a moment|grab some animals|hurry up
  That new bike must have **cost an arm and a leg**.|cost a lot of money|hurt the rider|was very cheap
  Could you **lend a hand** with these boxes?|help|give away part of your arm|watch from far away
  Please **keep an eye on** your little brother.|watch carefully|put your eye on him|ignore him
  My best friend and I **see eye to eye** about pizza.|agree|stare at each other|argue
  The idea came to me **out of the blue**.|suddenly, without warning|from the sky|after a long time
  **Time flies** when you are having fun.|time seems to pass quickly|clocks have wings|time stops
  We have no plan for the trip, so we will **play it by ear**.|decide as we go|listen to music|plan every step
  Leo **bit off more than he could chew** when he joined five clubs.|tried to do too much|ate too big a bite|did too little
  I was so tired that I **hit the hay** right after dinner.|went to bed|knocked over the straw|went outside to play
  Mia **jumped the gun** and started running before the whistle.|started too soon|leaped over a toy|started too late
  The nurse **went the extra mile** to make me feel better.|did more than she had to|walked a long way|did as little as she could
  We all forgot our homework, so we were **in the same boat**.|in the same situation|sitting in a boat together|in different places
  Now **the ball is in your court**: will you join the team or not?|it is your turn to decide|the ball landed near you|the game is over
  Let us **get the ball rolling** by choosing a name for our club.|get started|push a ball down a hill|give up
  Sara was **green with envy** when she saw my new bike.|very jealous|turning green from sickness|very proud
  Her name doesn't **ring a bell**; I don't think I have met her.|seem familiar|make a ringing sound|sound strange
  On my first day at the new school, I felt like **a fish out of water**.|uncomfortable in a new place|wet and slippery|right at home
`).map((row) => need(row, 4));

const idiomBank: readonly Ask[] = idiomRows.map(([shown = "", meaning = "", literal = "", wrongMeaning = ""]) => ({
  question: t("The phrase in bold is not meant literally. What does it mean?", "加粗的短语不是字面意思。它是什么意思？"),
  shown,
  right: meaning,
  wrong: [literal, wrongMeaning],
  why: t(
    `Here the phrase means **${meaning}**. A nonliteral phrase has a meaning of its own, and the rest of the sentence is the clue to it.`,
    `这里这个短语的意思是 **${meaning}**。非字面短语有它自己的意思，句子的其余部分就是线索。`,
  ),
  whyNot: [
    t(
      `"${literal}" is what the words say literally, but nothing like that is happening in the sentence.`,
      `“${literal}”是词语的字面意思，但句子里并没有发生这样的事。`,
    ),
    t(
      `"${wrongMeaning}" does not fit the clues in the rest of the sentence; it nearly turns the meaning around.`,
      `“${wrongMeaning}”不符合句子其余部分的线索，几乎把意思弄反了。`,
    ),
  ],
}));

/** wordStudyTopics are the topics of grade 3 on how words relate and how to look them up. */
export const wordStudyTopics: readonly TopicDef[] = [
  topic(
    "synonyms-and-antonyms",
    t("Synonyms and Antonyms", "同义词和反义词"),
    t(
      "Words that mean nearly the same, like shout and yell, and words that mean the opposite, like ancient and new.",
      "意思几乎相同的词（如 shout 和 yell）和意思相反的词（如 ancient 和 new）。",
    ),
    ["context-clues"],
    [
      point(
        "choosing-the-synonym",
        t("Choosing the Synonym", "选择同义词"),
        t(
          "A **synonym** is a word that means nearly the same as another word: *shout* and *yell*, *tiny* and *small*. To test a synonym, put it in place of the word in the sentence. If the sentence still says the same thing, it is a synonym.\n\nBe careful: a word about the same subject is not always a synonym. *Whisper* is also about the voice, but it means the opposite of *shout*.",
          "**同义词**是和另一个词意思几乎相同的词：*shout* 和 *yell*，*tiny* 和 *small*。检验方法是把它替换到句子里，如果句子意思不变，它就是同义词。\n\n要注意：说同一件事的词不一定是同义词。*whisper* 也和说话的声音有关，但它和 *shout* 意思相反。",
        ),
        askGenerator(synonymBank),
      ),
      point(
        "choosing-the-antonym",
        t("Choosing the Antonym", "选择反义词"),
        t(
          "An **antonym** is a word that means the opposite of another word: *ancient* and *new*, *wide* and *narrow*. Put an antonym in place of a word, and the sentence turns around: *The path was narrow* becomes *The path was wide*.\n\nA word that only changes the subject, such as *dark* for *narrow*, is not an antonym: it says something different, not the opposite.",
          "**反义词**是和另一个词意思相反的词：*ancient* 和 *new*，*wide* 和 *narrow*。用反义词替换一个词，句子的意思就反过来：*The path was narrow* 变成 *The path was wide*。\n\n只是换了话题的词（比如用 *dark* 替换 *narrow*）不是反义词：它说的是另一件事，而不是相反的意思。",
        ),
        askGenerator(antonymBank),
      ),
    ],
  ),
  topic(
    "compound-words",
    t("Compound Words", "复合词"),
    t(
      "Two words joined into one whose meaning comes from both, like sun and flower, or earth and worm.",
      "由两个词合成一个词，意思来自这两个词，比如 sun 和 flower，earth 和 worm。",
    ),
    ["base-words-and-affixes"],
    [
      point(
        "splitting-a-compound",
        t("Splitting a Compound", "拆分复合词"),
        t(
          "A **compound word** is two words joined into one: *sun* + *flower* = *sunflower*, *earth* + *worm* = *earthworm*. To find its meaning, split it into its two words. Usually the second word names the thing, and the first tells what kind: an *earthworm* is a worm that lives in the earth, and a *houseboat* is a boat that is a house.\n\nUse both words. A meaning that uses only one of them, or joins them the wrong way round, is not the meaning of the compound.",
          "**复合词**是由两个词合成的一个词：*sun* + *flower* = *sunflower*，*earth* + *worm* = *earthworm*。要弄清它的意思，就把它拆成两个词。通常后一个词说出是什么东西，前一个词说明是哪一种：*earthworm* 是生活在泥土里的虫，*houseboat* 是当作住房的船。\n\n两个词都要用上。只用了其中一个词的意思，或者把两个词的关系弄反了，都不是这个复合词的意思。",
        ),
        askGenerator(compoundMeaningBank),
      ),
      point(
        "building-a-compound",
        t("Building a Compound", "组成复合词"),
        t(
          "To build the compound that fits a meaning, find the thing it names and what kind it is. *A bag you carry on your back* is a pack for the back: *back* + *pack* = *backpack*.\n\nMany compounds share a word: *backpack*, *backyard* and *backbone* all begin with *back*. Check the other word too, because it decides the meaning.",
          "要组成符合某个意思的复合词，先找出它指的是什么东西，以及是哪一种。*A bag you carry on your back* 是背在背上的包：*back* + *pack* = *backpack*。\n\n许多复合词共用一个词：*backpack*、*backyard* 和 *backbone* 都以 *back* 开头。还要检查另一个词，因为它决定了意思。",
        ),
        askGenerator(compoundBuildBank),
      ),
    ],
  ),
  topic(
    "homophones",
    t("Homophones", "同音词"),
    t(
      "Words that sound the same but are spelled differently and mean different things: bear and bare, tail and tale, right and write.",
      "读音相同但拼写和意思不同的词：bear 和 bare，tail 和 tale，right 和 write。",
    ),
    ["context-clues"],
    [
      point(
        "choosing-the-homophone",
        t("Choosing the Homophone", "选择同音词"),
        t(
          "**Homophones** are words that sound the same but are spelled differently and mean different things: a *bear* is an animal, and *bare* means with nothing covering it. Because you cannot hear the difference, decide by meaning.\n\nThe pairs of this topic are *bear* and *bare*, *tail* and *tale*, *flower* and *flour*, *hole* and *whole*, *knight* and *night*, *pair* and *pear*, *sea* and *see*, *weak* and *week*, *right* and *write*, *blew* and *blue*, *meat* and *meet*, and *plain* and *plane*.",
          "**同音词**是读音相同、拼写和意思不同的词：*bear* 是一种动物，*bare* 的意思是没有遮盖的。因为听不出区别，所以要按意思来判断。\n\n本主题的同音词有：*bear* 和 *bare*，*tail* 和 *tale*，*flower* 和 *flour*，*hole* 和 *whole*，*knight* 和 *night*，*pair* 和 *pear*，*sea* 和 *see*，*weak* 和 *week*，*right* 和 *write*，*blew* 和 *blue*，*meat* 和 *meet*，*plain* 和 *plane*。",
        ),
        askGenerator(homophoneChoiceBank),
      ),
      point(
        "fixing-the-homophone",
        t("Fixing the Wrong Homophone", "改正用错的同音词"),
        t(
          "A spell checker will not catch a wrong homophone, because each word is spelled correctly. You have to read for meaning. Read each word and ask: is this the word that means what the sentence needs? *The dog wagged its tale* sounds right, but a *tale* is a story; the dog wags its *tail*.",
          "拼写检查发现不了用错的同音词，因为每个词本身拼写都没错，只能靠理解意思。读每一个词时都问一问：这个词的意思是不是句子需要的？*The dog wagged its tale* 听起来没错，但 *tale* 是故事，狗摇的是 *tail*（尾巴）。",
        ),
        typedGenerator(
          "word-form",
          t(
            "One word in this sentence sounds right but is spelled wrong for its meaning. Type the word that should be there.",
            "这个句子里有一个词读音没错，但拼写与意思不符。输入应该用的词。",
          ),
          homophoneFixBank,
          (right, shown) => {
            const item = homophoneFixWhy.get(`${right}|${shown}`);
            return t(
              `The word should be **${right}**, which means ${item?.en ?? ""}. *${item?.other ?? ""}* sounds the same, but it means ${item?.oen ?? ""}.`,
              `应该用 **${right}**，意思是“${item?.zh ?? ""}”。*${item?.other ?? ""}* 读音相同，但意思是“${item?.ozh ?? ""}”。`,
            );
          },
        ),
      ),
    ],
  ),
  topic(
    "shades-of-meaning",
    t("Shades of Meaning", "词义的细微差别"),
    t(
      "Words of one meaning that differ in strength: cool, chilly and freezing; damp, wet and soaked; glad, happy and overjoyed.",
      "意思相同但程度不同的词：cool、chilly、freezing；damp、wet、soaked；glad、happy、overjoyed。",
    ),
    ["synonyms-and-antonyms"],
    [
      point(
        "ordering-by-strength",
        t("Ordering by Strength", "按程度排序"),
        t(
          "Some words share a meaning but differ in how strong they are. *Cool*, *chilly* and *freezing* all describe cold, but *freezing* is the coldest. *Damp* is a little wet, and *soaked* is as wet as you can be.\n\nTo put words in order, picture each one. Ask which is the mildest, and which is the most extreme.",
          "有些词意思相同，但程度强弱不同。*cool*、*chilly* 和 *freezing* 都表示冷，但 *freezing* 最冷。*damp* 是有点湿，*soaked* 是湿透了。\n\n给这些词排序时，想象每个词描述的情景，问一问哪个最轻，哪个最极端。",
        ),
        arrangeGenerator(shadeArrangeBank),
      ),
      point(
        "choosing-the-right-strength",
        t("Choosing the Right Strength", "选择程度合适的词"),
        t(
          "A good writer chooses the word of exactly the right strength. If the pond froze solid, *cool* is too weak; if you just want your jacket off, *scorching* is too strong.\n\nLook for clues in the sentence that tell how strong the feeling or the weather is, such as *so ... that*, *a little* or *not too*, and choose the word that matches them.",
          "好的写作者会选程度正好合适的词。如果池塘冻得结结实实，*cool* 就太弱了；如果只是想脱掉外套，*scorching* 又太强了。\n\n在句子里找表示程度的线索，比如 *so ... that*、*a little* 或 *not too*，然后选出与之相符的词。",
        ),
        askGenerator(shadeChoiceBank),
      ),
    ],
  ),
  topic(
    "using-a-dictionary-and-glossary",
    t("Using a Dictionary and a Glossary", "使用词典和词汇表"),
    t(
      "Words in a dictionary or a glossary are in alphabetical order, guide words show the first and last word of a page, and an entry lists each meaning.",
      "词典和词汇表中的词按字母顺序排列，导词表示一页的第一个和最后一个词，词条分别列出每个意思。",
    ),
    ["context-clues"],
    [
      point(
        "alphabetical-order",
        t("Alphabetical Order", "字母顺序"),
        t(
          "A dictionary, and the glossary at the back of a book, list words in **alphabetical order**. When two words begin with the same letter, look at the second letter: *bread* comes before *brown* because *e* comes before *o*. If the second letters match too, look at the third: *star* comes before *stay*, because *r* comes before *y*.",
          "词典和书后的词汇表都按**字母顺序**排列单词。两个词首字母相同时，看第二个字母：*bread* 排在 *brown* 前面，因为 *e* 在 *o* 前面。如果第二个字母也相同，就看第三个：*star* 排在 *stay* 前面，因为 *r* 在 *y* 前面。",
        ),
        arrangeGenerator(orderBank),
      ),
      point(
        "guide-words",
        t("Guide Words", "导词"),
        t(
          "At the top of each dictionary page are two **guide words**: the first and the last word on that page. A word is on the page if it comes after the first guide word and before the second in alphabetical order.\n\nIf the guide words are *maple* and *market*, then *march* is on the page, *magic* is on an earlier page, and *mask* is on a later one.",
          "词典每页顶部有两个**导词**：这一页的第一个词和最后一个词。如果一个词按字母顺序排在第一个导词之后、第二个导词之前，它就在这一页。\n\n如果导词是 *maple* 和 *market*，那么 *march* 在这一页，*magic* 在前面的页，*mask* 在后面的页。",
        ),
        askGenerator(guideBank),
      ),
      point(
        "choosing-the-meaning",
        t("Choosing the Meaning", "选择词义"),
        t(
          "Many words have more than one meaning, and a dictionary entry numbers them: *bat* 1. a small animal with wings 2. a stick used to hit a ball. To find the one you need, read the sentence, try each meaning in place of the word, and keep the one that makes sense. *The bat flew out of the cave* needs the animal, not the stick.",
          "许多词有不止一个意思，词典词条会给它们编号：*bat* 1. 一种有翅膀的小动物 2. 用来击球的棒子。要找到需要的那个意思，先读句子，再把每个意思代入替换这个词，保留说得通的那个。*The bat flew out of the cave* 指的是动物，而不是球棒。",
        ),
        askGenerator(entryBank),
      ),
    ],
  ),
  topic(
    "literal-and-nonliteral-phrases",
    t("Literal and Nonliteral Phrases", "字面义和非字面义短语"),
    t(
      "Some phrases mean exactly what their words say, and some mean something else: it's raining cats and dogs, a heart of gold.",
      "有些短语就是字面意思，有些则另有含义：it's raining cats and dogs、a heart of gold。",
    ),
    ["context-clues"],
    [
      point(
        "literal-or-not",
        t("Literal or Not", "是否字面义"),
        t(
          "A phrase is **literal** when its words mean exactly what they say: *Grandma cut a piece of cake* is about real cake. The same phrase can be **nonliteral**, with a meaning of its own: *The test was a piece of cake* means the test was easy.\n\nTo tell them apart, picture the words. If that could really be happening in the sentence, the phrase is literal. If it could not, such as a test made of cake, it is nonliteral.",
          "如果短语的词语就是字面意思，它就是**字面用法**：*Grandma cut a piece of cake* 说的是真的蛋糕。同一个短语也可以是**非字面用法**，有它自己的意思：*The test was a piece of cake* 的意思是考试很容易。\n\n要区分它们，就想象一下这些词描述的情景。如果句子里真的可能发生这样的事，就是字面用法；如果不可能（比如用蛋糕做的考试），就是非字面用法。",
        ),
        askGenerator(literalBank),
      ),
      point(
        "what-the-phrase-means",
        t("What the Phrase Means", "短语的含义"),
        t(
          "A nonliteral phrase, or idiom, has a meaning you have to learn or work out from the sentence around it. *It's raining cats and dogs, so take an umbrella* cannot mean that pets are falling; the umbrella tells you it is raining very hard.\n\nUse the clues of the sentence, and choose the meaning that fits them, not the picture the words make.",
          "非字面短语，也就是习语，有一个需要学习或从上下文推断的意思。*It's raining cats and dogs, so take an umbrella* 不可能是说宠物从天而降；雨伞告诉你雨下得很大。\n\n利用句子中的线索，选择与线索相符的意思，而不是词语描绘的画面。",
        ),
        askGenerator(idiomBank),
      ),
    ],
  ),
];
