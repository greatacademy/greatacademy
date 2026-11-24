// Grade 4: the reading skills of stories and poems: puns, patterns tales share across cultures, why characters act,
// summaries of stories, imagery, and proverbs.

import { type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-english";
import { capital, fields, type Item, itemGenerator, pick } from "./kit.ts";
import { after } from "./prior.ts";

// Wordplay and puns.

const punLines = `
  Why was the math book sad? It had too many problems.|problems|book|sad|exercises to solve in math|troubles that make you unhappy|pages bound together inside a cover
  The dog sat by the old oak and listened to its bark.|bark|oak|listened|the sound a dog makes|the rough outer layer of a tree|a park where many old trees grow
  Why did the cookie go to the doctor? It felt crummy.|crummy|cookie|doctor|full of crumbs|feeling ill and miserable|baked until it turns hard and brown
  The bicycle could not stand up by itself because it was two-tired.|two-tired|bicycle|stand|having two tires|too tired to stand up|built with two seats for two riders
  Why did the student eat his homework? The teacher said it was a piece of cake.|piece of cake|student|homework|a slice of a sweet baked food|something very easy to do|a prize for finishing your work early
  Never trust stairs. They are always up to something.|up to something|stairs|trust|leading to a higher place|planning a trick in secret|too steep to climb safely
  The baker stopped making doughnuts because he was tired of the hole business.|hole|baker|doughnuts|the empty middle of a doughnut|whole, meaning all of something|a shop that sells bread every morning
  What has four wheels and flies? A garbage truck.|flies|wheels|truck|moves through the air|small insects that buzz around trash|carries heavy loads along a road
  Why are fish so smart? They live in schools.|schools|fish|smart|large groups of fish swimming together|places where children go to learn|the rivers and lakes where fish live
  The farmer won a prize because he was outstanding in his field.|outstanding in his field|farmer|prize|standing outside in a field of crops|excellent at his kind of work|working hard from morning to night
  Why did the golfer bring two pairs of pants? In case he got a hole in one.|hole in one|golfer|pants|a rip in a pair of pants|getting the ball in the hole with one hit|losing a ball somewhere in the long grass
  What do you call a sleeping bull? A bulldozer.|bulldozer|sleeping|bull|a bull that dozes, or naps|a big machine that pushes earth|a farmer who looks after cattle
  Why can't a nose be twelve inches long? Then it would be a foot.|foot|nose|inches|a length of twelve inches|the body part at the end of your leg|the part of your face that smells
  The pony could not sing because it was a little hoarse.|hoarse|pony|sing|having a rough, sore voice|horse, an animal like a big pony|singing in a loud and happy voice
  Why did the computer go to the doctor? It had a virus.|virus|computer|doctor|a germ that makes a person ill|a program that harms a computer|a visit to check that you are healthy
  I used to work in a bank, but I lost interest.|interest|bank|lost|money a bank pays on savings|the feeling of wanting to know more|the building where a bank keeps money
  What did the ocean say to the beach? Nothing, it just waved.|waved|ocean|beach|moved in waves|moved a hand to say hello|washed sand from the shore into the sea
  The music teacher locked the classroom and hid the keys in her piano.|keys|teacher|piano|the black and white parts you press on a piano|small metal tools that open locks|songs written in one set of notes
  What do you call a bear with no teeth? A gummy bear.|gummy|bear|teeth|having only gums and no teeth|a soft, chewy sweet|a small and very gentle kind of bear
  Why did the belt go to jail? It held up a pair of pants.|held up|belt|jail|kept something from falling down|robbed someone with a threat|tied tightly around a person's waist
  The calendar is popular because it has so many dates.|dates|calendar|popular|days of the month|times when friends go out together|the pages that show each month
  Why did the clock get in trouble at school? It tocked too much.|tocked|clock|school|made the sound of a clock|talked|rang loudly to wake people up
  What room has no doors or windows? A mushroom.|mushroom|room|doors|a small plant-like thing that grows in woods|a room made for mush|a room with walls but no roof
  Why did the tomato blush? It saw the salad dressing.|dressing|tomato|salad|a sauce poured on a salad|putting on clothes|cutting vegetables into small pieces
  Why was the broom late? It over-swept.|over-swept|broom|late|swept too much|overslept, or slept too long|swept only half of the floor
  What did one plate say to the other? Lunch is on me.|on me|plate|lunch|sitting on top of me|paid for by me|served late in the afternoon
  Why do cows wear bells? Because their horns do not work.|horns|cows|bells|hard, pointed parts on an animal's head|parts of a car that beep|long ropes that tie a gate shut
  The class average on the math test was mean.|mean|class|test|the average of a set of numbers|unkind|a small number at the end of a sum
  Why did the picture go to jail? It was framed.|framed|picture|jail|put in a frame|blamed for something it did not do|painted in bright colors on a wall
  A boiled egg in the morning is hard to beat.|beat|egg|morning|stir quickly, as you do with eggs|do better than something|cook slowly in a pot of hot water
  What kind of tree fits in your hand? A palm tree.|palm|tree|hand|a tall tree with big leaves at the top|the inside of your hand|a branch broken off a tree
  Why did the sun not go to college? It already had a million degrees.|degrees|sun|college|units that measure heat|diplomas from a college|lessons taught in a classroom
  Elephants never forget to pack their trunks for a trip.|trunks|elephants|trip|the long noses of elephants|big boxes for carrying clothes|the thick middles of trees
`;

const puns = fields(punLines).map(([joke, word, other1, other2, a, b, c]) => {
  if (!joke || !word || !other1 || !other2 || !a || !b || !c) throw new Error(`a pun needs seven fields: ${joke}`);
  if (!joke.toLowerCase().includes(word.toLowerCase())) throw new Error(`the pun is not in the joke: ${word}`);
  return { joke, word, others: [other1, other2] as const, a, b, c };
});

/** punWordBank asks which word a joke turns on. */
const punWordBank: readonly Item[] = puns.map((p) => ({
  question: t("Which word or phrase does this joke turn on?", "这个笑话的笑点在哪个词或短语上？"),
  shown: p.joke,
  right: p.word,
  wrong: [...p.others],
  why: t(
    `The joke turns on **${p.word}**, which can mean ${p.a} and also ${p.b}. A pun is funny because one word carries two meanings, or sounds like another word, at the same time.\n\n**Check.** Try replacing **${p.word}** with a plain synonym—the joke vanishes immediately, proving **${p.word}** carries the double meaning.`,
    `笑点在 **${p.word}** 上：它既可以表示“${p.a}”，也可以表示“${p.b}”。双关语之所以好笑，是因为一个词同时带有两种意思，或者听起来像另一个词。\n\n**检验。** 把 **${p.word}** 换成一个普通同义词——笑点立刻消失，说明正是 **${p.word}** 承载了双关。`,
  ),
  whyNot: [
    t(
      `“${p.others[0]}” is used in only one plain sense here, not as a play on words.`,
      `“${p.others[0]}”在这里只有一种普通意思，没有双关。`,
    ),
    t(
      `“${p.others[1]}” sets up the joke's scene, but it does not carry two meanings at once.`,
      `“${p.others[1]}”只是交代笑话的情境，并没有同时承载两种意思。`,
    ),
  ],
}));

/** punMeaningBank asks for the two meanings that make a joke funny. */
const punMeaningBank: readonly Item[] = puns.map((p) => {
  const right = `${p.a}; ${p.b}`;
  const wrong = [`${p.a}; ${p.c}`, `${p.c}; ${p.b}`];
  return {
    question: t(`Which two meanings of “${p.word}” make this joke funny?`, `“${p.word}”的哪两种意思让这个笑话好笑？`),
    shown: p.joke,
    right,
    wrong,
    why: t(
      `The joke needs both meanings: ${p.a}, and ${p.b}. The first fits what is going on, and the second gives the surprise.\n\n**Check.** Connect each meaning to a part of the joke—both “${p.a}” and “${p.b}” lock into the setup and punchline.`,
      `这个笑话两种意思都需要：“${p.a}”和“${p.b}”。一种符合正在发生的事，另一种带来意外。\n\n**检验。** 把两种意思分别对应到笑话的前半句和笑点——两者缺一不可。`,
    ),
    whyNot: [
      t(
        `“${p.c}” is not a meaning of “${p.word}” that the joke plays on, so the second half of this pair is wrong.`,
        `“${p.c}”不是笑话所利用的“${p.word}”的意思，所以这一对的后半部分不对。`,
      ),
      t(
        `“${p.c}” is not a meaning of “${p.word}” that the joke plays on, so the first half of this pair is wrong.`,
        `“${p.c}”不是笑话所利用的“${p.word}”的意思，所以这一对的前半部分不对。`,
      ),
    ],
  };
});

// One pattern in many cultures.

const patterns = [
  ["a clever small animal outwits a strong one", "聪明的小动物智胜强大的动物"],
  ["the third of three succeeds where the first two fail", "三个之中的第三个在前两个失败之处取得成功"],
  ["a kind person is rewarded and a greedy one is punished", "善良的人得到奖赏，贪心的人受到惩罚"],
  ["a mistreated girl is helped by magic and marries a ruler", "受虐待的女孩得到魔法帮助，嫁给了统治者"],
  ["a trickster brings fire or light to people", "一个机智的角色把火或光带给人们"],
  ["a tale explains why an animal looks the way it does", "故事解释某种动物为什么长成现在的样子"],
] as const;

const taleLines = `
  0|Ashanti|Anansi the spider|tricks a huge python into lying along a branch to be measured, then ties him to it
  0|Malaysian|Sang Kancil the mouse deer|gets the crocodiles to line up across a river to be counted, then walks over their backs
  0|Indian|a little hare|leads a hungry lion to a well, where the lion leaps at his own reflection and falls in
  0|African American|Brer Rabbit|begs Brer Fox not to throw him into the briar patch, which is just where he wants to go
  0|Central American|Uncle Rabbit|tells Coyote to hold up a cliff that is about to fall, and runs off while Coyote holds it
  1|Russian|Prince Ivan|catches the Firebird after his two older brothers come home with nothing
  1|Norwegian|Cinderlad|rides his horse to the top of the glass hill after the older brothers slide back down
  1|English|the third little pig|builds a house of bricks that the wolf cannot blow down, unlike the houses of straw and sticks
  1|Zhuang|Leyi, the youngest son|brings back his mother's magic brocade after his two older brothers give up the search
  1|German|the youngest son, called Simpleton|shares his food with a little old man and wins a golden goose, after his brothers refuse
  2|Korean|kind Heungbu|mends a swallow's broken leg and finds treasure in the gourds it brings, while his greedy brother finds goblins
  2|Japanese|a kind old man|chooses the small basket from the sparrows and finds gold, while his greedy wife's large basket holds monsters
  2|French|a polite young girl|drops jewels from her lips each time she speaks, while her rude sister drops toads
  2|German|a hard-working girl|is showered with gold by Mother Holle, while her lazy sister is covered in sticky tar
  2|Russian|a gentle stepdaughter|is given furs and riches by Father Frost, while the spoiled daughter is sent home with nothing
  3|Chinese|Ye Xian|is helped by the bones of a magic fish and loses a golden slipper that leads a king to her
  3|French|Cinderella|is dressed by a fairy godmother and leaves a glass slipper behind at the prince's ball
  3|Egyptian|Rhodopis|has her rose-red sandal carried off by an eagle and dropped in the lap of the pharaoh
  3|Vietnamese|Tam|is helped by a magic fish and loses an embroidered slipper that a crow carries to the king
  3|Mi'kmaq|the Rough-Face Girl|is the only one honest enough to see the Invisible Being, who then marries her
  4|Greek|Prometheus|steals fire from the gods on Mount Olympus and carries it to people inside a hollow stalk
  4|Cherokee|Grandmother Spider|weaves a little clay pot and carries a piece of the sun back home in it
  4|Haida|Raven|tricks a chief into opening the box where he keeps the sun, then flies off with the light
  4|Maori|Maui|tricks the fire goddess Mahuika into giving up her flames, one fingernail at a time
  4|Karuk|Coyote|steals a burning coal from the fire people and passes it from animal to animal as they are chased
  5|Igbo|Tortoise|falls from the sky after a feast with the birds, and his shell cracks into pieces when he lands
  5|Aboriginal Australian|the emu|is tricked by the bush turkey into cutting off its own wings, so now it cannot fly
  5|Cherokee|Possum|is tricked by Rabbit into having his fluffy tail shaved, so now it is bare
  5|Indian|a little squirrel|helps build a bridge for Rama, who strokes its back and leaves three stripes
  5|Norwegian|Bear|is tricked by Fox into fishing through the ice with his tail, which freezes and snaps off
`;

const tales = fields(taleLines).map(([p, culture, hero, how]) => {
  const pattern = Number(p);
  if (!(pattern >= 0 && pattern < patterns.length) || !culture || !hero || !how) throw new Error(`a tale needs four fields: ${hero}`);
  return { pattern, culture, hero, how };
});

const taleText = (tale: (typeof tales)[number]) => `A ${tale.culture} tale: ${capital(tale.hero)} ${tale.how}.`;

/** pairs joins each tale to the next tale of its pattern, so that every tale is in two pairs. */
const talePairs = tales.map((tale) => {
  const same = tales.filter((o) => o.pattern === tale.pattern);
  const next = pick(same, same.indexOf(tale) + 1);
  return [tale, next] as const;
});

/** sharedPatternBank asks which pattern two tales share. */
const sharedPatternBank: readonly Item[] = talePairs.map(([a, b], i) => {
  const right = patterns[a.pattern] ?? patterns[0];
  const wrong = [pick(patterns, a.pattern + 1 + (i % 2)), pick(patterns, a.pattern + 3 + (i % 2))];
  return {
    question: t("Which pattern do these two tales share?", "这两个故事有什么共同的模式？"),
    shown: `${taleText(a)}\n\n${taleText(b)}`,
    right: right[0],
    wrong: wrong.map((w) => w[0]),
    why: t(
      `Both tales follow the pattern: **${right[0]}**. The heroes and places differ, but the shape of what happens is the same.\n\n**Check.** Test “${right[0]}” against both the ${a.culture} tale and the ${b.culture} tale—it describes the plot shape of each one.`,
      `两个故事都遵循这个模式：**${right[1]}**。主人公和地点不同，但事情的经过是同一种样子。\n\n**检验。** 用“${right[1]}”分别对照这两个故事——两篇的情节走向都完全吻合。`,
    ),
    whyNot: wrong.map((w, idx) =>
      idx === 0
        ? t(
            `Neither tale matches “${w[0]}”—look at what actually happens to the main characters in both summaries.`,
            `两个故事都不是“${w[1]}”——看看两段摘要里主人公真正经历了什么。`,
          )
        : t(
            `“${w[0]}” belongs to a different group of folktales and does not fit these two stories.`,
            `“${w[1]}”属于另一类民间故事模式，不符合这两个故事。`,
          ),
    ),
  };
});

/** differenceBank asks how two tales of one pattern tell it differently. */
const differenceBank: readonly Item[] = talePairs.map(([a, b], i) => {
  const c = talePairs[i + 1]?.[1] ?? pick(talePairs, i + 2)[1];
  const say = (x: (typeof tales)[number], how: string) => `In the ${x.culture} tale, ${x.hero} ${how}`;
  const right = `${say(a, a.how)}; ${say(b, b.how)}.`;
  const swapped = `${say(a, b.how)}; ${say(b, a.how)}.`;
  const other = `${say(a, a.how)}; ${say(b, c.how)}.`;
  const wrong = c.how === b.how ? [swapped, `${say(a, c.how)}; ${say(b, b.how)}.`] : [swapped, other];
  return {
    question: t(
      `Both tales follow the pattern “${patterns[a.pattern]?.[0]}”. How does each culture tell it?`,
      `两个故事都遵循“${patterns[a.pattern]?.[1]}”这个模式。每种文化是怎样讲的？`,
    ),
    shown: `${taleText(a)}\n\n${taleText(b)}`,
    right,
    wrong,
    why: t(
      `Each culture fills the pattern with its own hero and its own events: ${a.hero} ${a.how}, and ${b.hero} ${b.how}.\n\n**Check.** Match each culture's hero (${a.hero} and ${b.hero}) directly to their own summary above—neither detail is swapped or borrowed from outside.`,
      `每种文化都用自己的主人公和情节来填充这个模式。比较时，要把每个情节和讲它的那个故事对应起来。\n\n**检验。** 把两个故事的主人公分别与上面的原文核对——没有对调，也没有混入第三个故事的情节。`,
    ),
    whyNot: [
      t(
        "This swaps the events of the two tales. Match each event to the hero who does it in the text.",
        "这个选项把两个故事的情节对调了。要把每个情节和文中做这件事的主人公对应起来。",
      ),
      t(
        "One of these events comes from a third tale, not from the two shown. Check each event against the text.",
        "其中一个情节来自第三个故事，而不是这里的两个。把每个情节和原文核对。",
      ),
    ],
  };
});

// Why characters act.

const motiveLines = `
  Why does Leo hide the drawing?|Leo's sister's birthday was on Saturday.|He had spent a week on the drawing of her favorite horse.|When she walked in, he slid it under his pillow.|1|He wants it to be a surprise for her.|He is ashamed of how badly he drew it.|He wants to keep the drawing for himself.
  Why does Amira stay after class?|Amira's hand shook as the teacher handed back the tests.|She looked at the red mark at the top for a long time.|When the bell rang, she waited by the teacher's desk.|1|She wants help with what she got wrong.|She wants to tell the teacher about her weekend.|She is waiting for a friend from another class.
  Why does Sam give away his lunch?|Sam saw the new boy sitting alone with an empty table in front of him.|Sam's stomach was rumbling too.|Still, he walked over and set his sandwich down.|0|He sees the new boy has nothing to eat.|He does not like the kind of sandwich he has.|He wants the new boy to do his homework.
  Why does Grandma keep the old coat?|The coat had a torn pocket and faded buttons.|Grandpa had worn it every winter for forty years.|Grandma folded it carefully and put it back in the closet.|1|It reminds her of Grandpa.|She plans to sell it at a yard sale.|She thinks it will fit her next winter.
  Why does Mei practice every night?|The spelling bee was only a week away.|Last year Mei had missed the final word by one letter.|Every night she spelled lists aloud to her cat.|1|She wants to win this time after losing last year.|Her cat enjoys hearing long lists of words.|She is bored and has nothing else to do.
  Why does Carlos run back into the house?|The family had loaded the car for the trip.|Halfway down the drive, Carlos patted his empty pocket.|He jumped out and ran to the front door.|1|He has forgotten something he needs.|He wants to stay home instead of going.|He wants to say goodbye to the neighbors.
  Why does Nadia speak so softly?|Nadia's baby brother had cried all afternoon.|At last his eyes had closed.|She whispered to her friend on the phone.|1|She does not want to wake her brother.|She has a sore throat from a cold.|She is telling her friend a secret.
  Why does the fox leave the grapes?|The fox jumped for the grapes again and again.|They hung far above his reach.|At last he walked away, saying they were sour anyway.|1|He cannot reach them and pretends not to care.|He has found sweeter grapes somewhere else.|He has suddenly lost his appetite.
  Why does Omar check the window again and again?|Omar's dad had been away for six months.|His plane had landed an hour ago.|Omar pressed his face to the window each time a car passed.|1|He is waiting eagerly for his dad to come home.|He is afraid that a storm is coming.|He is watching for the mail carrier.
  Why does Priya tell the truth?|Priya had knocked the vase off the shelf.|Her mother blamed the dog.|Priya looked at the dog's sad eyes and stepped forward.|2|She does not want the dog to be blamed.|She wants to be punished for fun.|She wants her mother to buy a new vase.
  Why does Ben climb the tree?|Ben was afraid of high places.|His little sister's kite was caught in the top branches, and she was crying.|Ben took a deep breath and grabbed the lowest branch.|1|He wants to get his sister's kite back.|He loves climbing tall trees.|He wants to see the view from the top.
  Why does Hana save her coins?|Hana dropped every coin she found into a jar.|In the shop window was a red bicycle with a bell.|Each day she counted the coins and looked at the bicycle.|1|She wants to buy the red bicycle.|She likes the sound coins make in a jar.|Her parents told her to save for school.
  Why does Felix refuse to play?|Felix had always been the fastest in the class.|Yesterday the new girl had beaten him in the race.|Today, when the teacher said they would race again, he sat on the bench.|1|He is afraid of losing again.|His shoes are too tight to run in.|He wants to watch the others race.
  Why does Lena wake up early?|Lena set her alarm for five o'clock.|The newspaper said the comet would be brightest before dawn.|She crept outside with her blanket and her telescope.|1|She wants to see the comet.|She has to deliver the newspapers.|She wants to finish her homework.
  Why does Tom leave the party early?|Tom's best friend Jack had just moved to a new school.|At the party, everyone talked about Jack's new friends.|Tom said he had a headache and went home.|1|He feels left out and sad about losing his friend.|He really does have a bad headache.|He wants to get home before dark.
  Why does the old man plant a tree he will not see grow tall?|The old man dug a hole for the tiny tree.|A boy asked why he bothered, since the tree would take fifty years to grow.|The old man said his grandfather had planted trees for him.|2|He wants to do for others what was done for him.|He thinks he will live another fifty years.|He wants to sell the tree's fruit next year.
  Why does Rosa cross the street?|Rosa saw Mrs. Kim struggling with heavy bags of groceries.|The light turned green.|Rosa hurried across and took one of the bags.|0|She wants to help Mrs. Kim carry her bags.|She wants to see what Mrs. Kim bought.|She is late for school and in a rush.
  Why does Jamal practice his speech in the mirror?|Jamal had never spoken in front of the whole school.|His voice shook when he even thought about it.|He stood in front of the mirror and read his speech five times.|1|He is nervous and wants to feel ready.|He likes to look at himself in mirrors.|He has forgotten what his speech is about.
  Why does Ella give the puppy back?|Ella found a puppy in the park and took it home.|The next day she saw a poster of the same puppy with the words Please Help.|She put on the puppy's leash and walked to the address.|1|She knows its owners are missing it.|She does not like puppies very much.|She wants a reward from the owners.
  Why does Kenji paint over his picture?|Kenji's teacher had praised his painting of the sea.|But Kenji thought the waves looked flat and lifeless.|He took a brush and began again.|1|He is not happy with how the waves look.|He wants the teacher to praise him again.|He has run out of paper for a new picture.
  Why does the girl give the stranger her umbrella?|The rain poured down on the bus stop.|An old woman stood there without a coat, shivering.|The girl handed her the umbrella and ran home through the rain.|1|She feels sorry for the shivering woman.|Her umbrella is broken and leaks.|She likes getting wet in the rain.
  Why does Max hide under the bed?|Thunder boomed so loudly the windows rattled.|Max's dog had been afraid of storms since he was a puppy.|Max crawled under the bed beside him and stroked his ears.|1|He wants to comfort his frightened dog.|He is looking for a lost toy under the bed.|He wants to play hide-and-seek with his dog.
  Why does Sofia quit the team?|Sofia loved playing soccer.|But her grandmother had fallen ill, and someone had to sit with her after school.|Sofia handed her jersey back to the coach.|1|She needs to look after her grandmother.|She is tired of playing soccer.|She has joined a better team.
  Why does Ali tear up the letter?|Ali had written a letter telling his friend he was angry.|He read it again the next morning.|Then he tore it up and wrote a short note asking to meet.|1|He has calmed down and wants to talk instead.|He has spilled juice on the letter.|He has decided never to speak to his friend again.
  Why does Ruby keep reading under the blanket?|It was long past bedtime.|The detective in Ruby's book was just about to name the thief.|Ruby switched on her flashlight under the blanket.|1|She cannot wait to find out who the thief is.|She is afraid of the dark in her room.|She has a book report due the next day.
  Why does the boy ring the bell again and again?|The boy saw smoke pouring from the barn.|The farmer was far off in the field.|He grabbed the rope of the old bell and pulled with all his strength.|0|He wants to warn the farmer about the fire.|He likes the loud sound the bell makes.|He wants to call everyone in for lunch.
  Why does Zoe share her prize?|Zoe and her partner had worked together on the science project.|But the judge called only Zoe's name.|Zoe pulled her partner up onto the stage beside her.|0|She knows the prize belongs to both of them.|She is too shy to go on stage alone.|She wants her partner to carry the prize home.
  Why does Dev walk the long way home?|The short way passed a yard with a big barking dog.|Dev had been bitten once when he was small.|He turned left and took the long way past the park.|1|He is afraid of the dog after being bitten.|He wants to see his friends in the park.|He is lost and does not know the way.
  Why does Anna wear her old shoes to the wedding?|Anna's new shoes were shiny and stiff.|Her old shoes were scuffed, but they had danced at every family party.|She left the new shoes in the box.|1|She wants to be comfortable while she dances.|Her new shoes have been lost.|She does not care about the wedding.
  Why does Luis count the sheep twice?|The storm had blown down part of the fence.|Luis's uncle had trusted him to watch the flock.|Luis counted the sheep, frowned, and counted them again.|1|He is worried that a sheep has escaped.|He is trying to fall asleep.|He is practicing his counting for school.
  Why does Yuki stay silent in the game?|The game was to guess who had taken the teacher's pen.|Yuki had seen her best friend slip it into her bag.|When the teacher asked, Yuki stared at her shoes.|1|She does not want to get her friend in trouble.|She has no idea who took the pen.|She is too tired to join the game.
  Why does the knight put down his sword?|The young dragon was smaller than a horse.|It curled up and covered its eyes with its wings.|The knight lowered his sword and knelt beside it.|1|He sees the dragon is frightened and harmless.|His sword is too heavy to hold.|He wants to sell the dragon at the market.
`;

const motives = fields(motiveLines).map(([question, s1, s2, s3, d, motive, w1, w2]) => {
  const detail = Number(d);
  if (!question || !s1 || !s2 || !s3 || !(detail >= 0 && detail < 3) || !motive || !w1 || !w2)
    throw new Error(`a motive line needs eight fields: ${question}`);
  return { question, sentences: [s1, s2, s3] as const, detail, motive, wrong: [w1, w2] as const };
});

const motiveText = (m: (typeof motives)[number]) => m.sentences.join(" ");

/** motiveBank asks the motive behind an action. */
const motiveBank: readonly Item[] = motives.map((m) => ({
  question: t(m.question, `${m.question}（角色为什么这样做？）`),
  shown: motiveText(m),
  right: m.motive,
  wrong: [...m.wrong],
  why: t(
    `${m.motive} The story does not say so in those words; the reader infers it from a detail: “${m.sentences[m.detail]}”\n\n**Check.** Link that clue directly to the final action—it explains why the character made that exact choice.`,
    `${m.motive} 故事没有直接这样说；读者从一个细节推断出来：“${m.sentences[m.detail]}”\n\n**检验。** 把这条线索和最后的行为连起来看——它正好解释了角色为什么做出这个决定。`,
  ),
  whyNot: [
    t(`“${m.wrong[0]}” is not supported by any clue in these three sentences.`, `“${m.wrong[0]}”在这三句话里找不到任何线索支持。`),
    t(
      `“${m.wrong[1]}” clashes with the key clue “${m.sentences[m.detail]}” in the passage.`,
      `“${m.wrong[1]}”与文中的关键线索“${m.sentences[m.detail]}”不符。`,
    ),
  ],
}));

/** motiveDetailBank asks which sentence shows the motive. */
const motiveDetailBank: readonly Item[] = motives.map((m) => {
  const right = m.sentences[m.detail] ?? "";
  const wrong = m.sentences.filter((_, i) => i !== m.detail);
  return {
    question: t(
      `The character acts because of this: ${m.motive.charAt(0).toLowerCase()}${m.motive.slice(1)} Which sentence shows it best?`,
      `角色这样做的原因是：${m.motive} 哪句话最能说明这一点？`,
    ),
    shown: motiveText(m),
    right,
    wrong,
    why: t(
      `“${right}” is the detail that explains the action. A motive is shown by what the character knows, wants or feels before acting.\n\n**Check.** Imagine removing “${right}” from the story—without it, the character's reason for acting would no longer be clear.`,
      `“${right}”是解释这个行为的细节。动机通过角色行动之前知道、想要或感受的东西表现出来。\n\n**检验。** 试着把“${right}”从故事里删掉——少了它，角色为什么这样做就说不通了。`,
    ),
    whyNot: wrong.map((w, idx) =>
      idx === 0
        ? t(
            `“${w}” sets up the scene or names the action itself rather than the reason behind it.`,
            `“${w}”只是交代背景或写出动作本身，并没有说明背后的原因。`,
          )
        : t(
            `“${w}” does not reveal what drives the character—look for the sentence that shows what the character wants, knows, or feels.`,
            `“${w}”没有揭示角色的驱动力——找找哪一句写出了角色想要、知道或感受到什么。`,
          ),
    ),
  };
});

// Summarizing a story.

/** Story is a short story with four summaries: the best one, and three that fail in different ways. */
interface Story {
  readonly text: string;
  readonly best: string;
  readonly detail: string;
  readonly opinion: string;
  readonly unfinished: string;
}

const storyLines = `
  Kai wanted to win the kite contest, but his kite kept crashing. His grandmother showed him how to add a longer tail. On the day of the contest the wind was strong. Other kites tore, but Kai's kite rose steadily higher than any other, and he won first prize.|Kai's kite kept crashing until his grandmother helped him add a longer tail. On the windy day of the contest, his kite flew highest and won first prize.|Kai, who had a blue kite with yellow stripes and a red string, wanted to win. His grandmother, who wore glasses, added a tail. The wind was strong, some kites tore, and Kai won.|Kai is a very lucky boy with the best grandmother ever. His kite contest is the most exciting thing I have ever read about, and I loved every part of it.|Kai wanted to win the kite contest, but his kite kept crashing. His grandmother showed him how to add a longer tail to it before the contest day.
  A mouse found a lion caught in a hunter's net. The lion had once let the mouse go free. The mouse gnawed the ropes all night. By morning the lion was free, and the two became friends.|When a lion who had once spared a mouse was trapped in a net, the mouse chewed through the ropes all night and set him free, and they became friends.|A small gray mouse with a long tail found a lion with a golden mane in a net made of thick brown ropes near a tall tree, and it chewed and chewed.|This is a sweet story that shows mice are better than lions. I think everybody should read it, because it is the cutest fable of all.|A mouse found a lion caught in a hunter's net. The mouse remembered that the lion had once let it go free, so it began to gnaw at the thick ropes.
  Lucia's family moved to a new city where she knew no one. At school she sat alone at lunch. One day she brought her grandfather's guitar and played in the yard. A group of children gathered to listen, and soon she had friends to sit with.|After moving to a new city, Lucia was lonely at school until she played her grandfather's guitar in the yard, and the children who came to listen became her friends.|Lucia moved in June to a city with tall buildings and a river. At lunch she ate a cheese sandwich alone. Her grandfather's guitar was old and brown with six strings.|Moving is the worst thing that can happen to anyone. Lucia's story made me feel sad and then happy, and I think it is a great story.|Lucia's family moved to a new city where she knew no one. At school she sat alone at lunch every day, so one morning she brought her grandfather's guitar.
  The village well had dried up. A girl named Ama walked to the mountain to find the spring her grandmother told of. She followed a line of green plants up the hillside. At the top she found the spring and led the villagers to dig a channel home.|When the village well dried up, Ama followed a line of green plants up the mountain to a hidden spring, and the villagers dug a channel to bring its water home.|Ama wore sandals and carried a gourd. The green plants were ferns and moss. The path was steep and rocky, and she passed three big stones and a fallen log.|Ama is the bravest girl in any story. Her village is lucky to have her, and this story is much better than most stories about water.|The village well had dried up. A girl named Ama remembered her grandmother's tale of a spring and set off up the mountain to look for it.
  Tom borrowed his brother's bike without asking and left it outside the library. When he came out, it was gone. Tom searched the whole street. Finally he told his brother the truth. His brother was angry, but they found the bike together at the police station.|Tom took his brother's bike without asking and lost it, but after he told the truth, the brothers found it together at the police station.|Tom borrowed the green bike with the silver bell at three o'clock and left it by the library's red door, near a bench and a bin.|Tom was very silly to borrow the bike. I would never do that, and I think his brother was right to be angry with him for so long.|Tom borrowed his brother's bike without asking and left it outside the library. When he came out, it was gone, so he searched the whole street.
  A farmer had a goose that laid one golden egg each day. He grew impatient and wanted all the gold at once. He cut the goose open, but there was no gold inside. Now he had no goose and no more eggs.|A farmer who wanted all of his goose's gold at once cut it open, found nothing, and lost the golden eggs it had laid each day.|The farmer lived in a small house with a red roof. The goose was white with an orange beak, and each egg was round, shiny and heavy.|The farmer is the greediest person in the world. This fable is my favorite, and it is much better than the one about the fox.|A farmer had a goose that laid one golden egg each day. He grew impatient and decided that he wanted all of the gold at once.
  Jin was afraid of the water and never swam. At camp, his friend fell off the dock into the lake. Jin forgot his fear, grabbed a float and threw it to his friend. Afterward, he asked the coach to teach him to swim.|Jin was afraid of water until his friend fell into the lake at camp; Jin threw him a float, and then asked the coach to teach him to swim.|The camp was by a blue lake with a wooden dock. Jin's friend wore a green shirt. The float was orange and round, and the coach had a whistle.|Jin is a hero and I want to be like him. Camp is the best place in the world, and every kid should go to one in the summer.|Jin was afraid of the water and never swam. At camp, his friend slipped and fell off the end of the wooden dock into the lake.
  A crow was very thirsty and found a pitcher with a little water at the bottom. Its beak could not reach. The crow dropped pebbles into the pitcher one by one. The water rose until the crow could drink.|A thirsty crow could not reach the water in a pitcher, so it dropped in pebbles one by one until the water rose high enough to drink.|The crow was black with shiny feathers. The pitcher was made of clay, and the pebbles were small, smooth and gray, from the path nearby.|Crows are the smartest birds, and this story proves it. I like it better than any other story about birds that I have read.|A crow was very thirsty and found a pitcher with a little water at the bottom. Its beak could not reach the water, so it looked around.
  Maya's class planted a garden, but rabbits ate the lettuce every night. Maya watched and saw them squeeze under the fence. She and her classmates buried the bottom of the fence. The next week the lettuce grew, and the class made a salad.|When rabbits kept eating the class garden's lettuce, Maya found how they got in, the class buried the bottom of the fence, and the lettuce grew.|The garden was behind the gym. It had lettuce, carrots and beans. The rabbits were brown, and the fence was made of wire and was painted green.|Gardens are a lot of work and I think rabbits are cute. This is a nice story, but it could use more pictures to make it better.|Maya's class planted a garden, but rabbits ate the lettuce every night. Maya decided to stay late one evening to watch how they got in.
  An old king had three sons and asked each to fill a hall with something. The first filled it with straw, the second with sand. The youngest lit a single candle, and its light filled every corner. The king made him the next ruler.|A king asked his sons to fill a hall; the older two used straw and sand, but the youngest filled it with the light of one candle and became the next king.|The king had a gray beard and a gold crown. The hall had tall windows. The straw was yellow, the sand was brown, and the candle was white wax.|The youngest son is clever, and the other two are silly. I think this is a very good story for a king, and I would like it read aloud.|An old king had three sons and asked each to fill a hall with something. The first son filled it with straw, and the second filled it with sand.
  Nora found a baby bird on the ground after a storm. She could not reach the nest. She made a nest in a basket and fed the bird with a dropper. When its wings grew strong, she opened the basket and it flew away.|Nora cared for a baby bird she found after a storm, feeding it in a basket nest until its wings were strong enough for it to fly away.|The storm was on Tuesday. The bird was gray and tiny. The basket was made of straw and lined with a blue towel, and the dropper was plastic.|Nora is so kind, and I love birds. This is the nicest story in the whole book, and I think it should win a prize for being sweet.|Nora found a baby bird on the ground after a storm. She could not reach the nest, so she made a soft nest for it in a basket.
  Two friends argued over who would be captain of the team. The coach said they would each lead for one game. In the first game, each friend saw how hard the job was. By the end of the week they agreed to share the job.|Two friends who argued about being captain each led one game, saw how hard the job was, and agreed to share it.|The team wore blue shirts. The first game was on Monday at the park, and the second was on Wednesday at the school field near the trees.|Arguing is bad and friends should always share. I think the coach is the smartest person in the story, and the friends were rude.|Two friends argued over who would be captain of the team. The coach said they would each lead the team for one game before anyone chose.
`;

const stories: readonly Story[] = fields(storyLines).map(([text, best, detail, opinion, unfinished]) => {
  if (!text || !best || !detail || !opinion || !unfinished) throw new Error(`a story needs five fields: ${text}`);
  return { text, best, detail, opinion, unfinished };
});

const faults = [
  ["detail", "too many small details", "太多小细节"],
  ["opinion", "the reader's opinion, not the story", "读者的看法，而不是故事内容"],
  ["unfinished", "a missing ending", "缺少结局"],
] as const;

const faultWhy: Readonly<Record<(typeof faults)[number][0], readonly [string, string]>> = {
  detail: [
    "It lists small details, such as colors and times, and leaves out what the story is about. A summary keeps only the main events.",
    "它罗列了颜色、时间之类的小细节，却漏掉了故事讲的主要内容。摘要只保留主要情节。",
  ],
  opinion: [
    "It tells what the reader thinks of the story instead of what happens in it. A summary leaves out opinions.",
    "它说的是读者对故事的看法，而不是故事中发生了什么。摘要不写个人看法。",
  ],
  unfinished: [
    "It stops before the story is over, so the reader never learns how the problem is solved. A summary includes the ending.",
    "它在故事结束前就停了，读者不知道问题是怎样解决的。摘要要包括结局。",
  ],
};

/** bestSummaryBank asks for the best summary of a story, against two of the three faulty ones. */
const bestSummaryBank: readonly Item[] = stories.flatMap((s) =>
  [
    ["detail", "opinion"],
    ["opinion", "unfinished"],
    ["detail", "unfinished"],
  ].map((pair) => {
    const kinds = pair as (typeof faults)[number][0][];
    return {
      question: t("Which is the best summary of this story?", "哪个是这个故事最好的摘要？"),
      shown: s.text,
      right: s.best,
      wrong: kinds.map((k) => s[k]),
      why: t(
        "The best summary names the main character, the problem, the key events and the ending in a few sentences, in its own words.\n\n**Check.** Verify all three summary rules: it covers the beginning, problem, and ending; skips tiny details like colors; and stays free of personal opinions.",
        "最好的摘要用几句话、用自己的语言，说出主要人物、问题、关键情节和结局。\n\n**检验。** 核对摘要的三条标准：涵盖开头、问题和结局；省略颜色之类的小细节；不夹带个人评价。",
      ),
      whyNot: kinds.map((k) => t(faultWhy[k][0], faultWhy[k][1])),
    };
  }),
);

/** faultBank asks why a faulty summary is not a good one. */
const faultBank: readonly Item[] = stories.flatMap((s) =>
  faults.map(([kind, en, zh]) => {
    const others = faults.filter(([k]) => k !== kind);
    return {
      question: t("Why is this not a good summary of the story?", "为什么这不是这个故事的好摘要？"),
      shown: `${s.text}\n\nSummary: ${s[kind]}`,
      right: en,
      wrong: others.map(([, w]) => w),
      why: t(
        `The problem is ${en}. ${faultWhy[kind][0]}\n\n**Check.** Compare the summary directly against the ending and wording of the story—this exact fault (${en}) stands out immediately.`,
        `问题在于${zh}。${faultWhy[kind][1]}\n\n**检验。** 把摘要与原文的结局和措辞对照——“${zh}”这个问题一眼就能看出来。`,
      ),
      whyNot: others.map(([k, w, wz]) =>
        t(`It is not ${w}. ${faultWhy[k][0]} This summary does not do that.`, `不是${wz}。${faultWhy[k][1]} 这个摘要并没有这样。`),
      ),
    };
  }),
);

// Imagery.

const imageLines = `
  The frost had painted silver feathers across the window.|thin, feathery patterns of ice on the glass|a silver bird sitting outside on the windowsill|a painter working on a picture outside the house
  The old house groaned and creaked in the wind.|a house making low sounds as the wind pushes it|a sick person lying in bed in a cold, old house|a family arguing loudly inside a house
  The kettle shrieked on the stove.|a kettle whistling loudly as it boils|a person screaming in fright in the kitchen|a kettle that has fallen to the floor and broken
  The fog crept over the hills on soft gray feet.|fog moving slowly and quietly over the hills|a gray cat walking quietly along the hilltops|people climbing slowly up the hills in the morning
  The sun was a hot coin in the white sky.|a small, round, burning sun in a pale sky|a gold coin lost on a dusty road on a sunny day|money falling down from the sky like rain
  Leaves skittered across the road like tiny crabs.|dry leaves scuttling along the road|crabs walking up from the beach across the road|children chasing each other down a road
  The lake lay flat and still as a mirror.|a smooth lake reflecting the sky|a big mirror lying on the grass beside a lake|a lake frozen over with thick, white ice
  Thunder rumbled like a giant clearing his throat.|a deep, rolling sound of thunder|a giant walking with heavy steps over the hills|a man coughing loudly in the next room
  The bread came out of the oven golden and steaming.|a warm loaf with a brown crust|bread that has burned black in a hot oven|a cold, hard loaf left on a plate for days
  Rain drummed on the tin roof all night.|rain hitting the roof with a steady beat|a band practicing on the roof late at night|a roof leaking water into a bucket on the floor
  The desert stretched away, empty and shimmering.|wide, bare land wavering in the heat|a desert crowded with travelers and their camels|a desert lying quiet at night under the stars
  Her laugh tumbled out like bells.|a light, ringing, happy laugh|bells falling out of a tall church tower|a girl falling down the stairs while laughing
  The streetlights blinked awake one by one.|lights coming on one after another|lights that are broken and flashing all night|people opening their sleepy eyes in the morning
  Snow muffled the whole town in white silence.|snow hushing every sound in the town|a town where nobody is allowed to speak at all|a blizzard howling loudly through the streets
  The angry sea hurled itself at the rocks.|huge waves crashing hard against rocks|a person throwing heavy rocks into the sea|a calm sea lapping gently at the sandy shore
  Sunlight spilled across the kitchen floor.|bright light spreading over the floor|a glass of orange juice knocked onto the floor|a dark kitchen with no windows at all
  The puppy's fur was soft as a cloud.|very light, fluffy, gentle fur|a little puppy flying high up in the sky|a puppy with wet, muddy, tangled fur
  The wind whistled through the cracks in the wall.|a thin, high sound of air through gaps|a person whistling a happy song outside|a wall falling down in a terrible storm
  The garden smelled of wet earth and roses.|the fresh smell of damp soil and flowers|a garden after a long, dry, dusty summer|a shop that sells roses, candles and soap
  The marching band's drums shook the windows.|deep drumbeats that make the glass rattle|a band throwing their drums at a house's windows|a soft, slow song played on a single flute
  The candle's flame shivered in the draft.|a small flame trembling in moving air|a person shaking with cold in a dark room|a candle that has gone out and left smoke
  The pond was a bowl of green soup.|a still pond thick with green plants|a bowl of hot soup on a kitchen table|a clear blue pond full of bright fish
  The crowd roared as the ball flew into the net.|a huge, loud cheer from many people|lions roaring at each other in a stadium|a crowd sitting in silence, waiting for news
  Icicles hung from the roof like glass teeth.|sharp, clear, pointed icicles in a row|a monster with a mouth full of sharp teeth|glass windows that have broken on a roof
  The pages of the old book were brittle and yellow.|dry, fragile pages faded with age|a new book with bright, clean white pages|a book with pictures of yellow flowers
  The children's voices bubbled up from the playground.|happy sounds rising from the playground|water boiling hard in a big pot on the stove|children blowing soap bubbles in the yard
  The mountain wore a cap of snow.|snow covering the top of a mountain|a person on a mountain wearing a white hat|a bare, brown mountain with no snow at all
  The hot sand burned the soles of my feet.|sand so hot it hurts to walk on|sand that is cold and wet from the waves|feet in shiny new shoes on the beach
  The stars were scattered like spilled sugar.|many small stars spread across the sky|sugar spilled all over a kitchen table|a few stars shining in a straight row
  The engine coughed, sputtered and died.|an engine making rough sounds, then stopping|a sick person in bed with a bad cold and fever|an engine running smoothly and quietly all day
  The orange tasted like a mouthful of sunshine.|a sweet, bright, juicy taste|an orange left out in the sun for too long|a sour, bitter orange that is not yet ripe
  The wet dog shook itself and sprayed us all.|water flying off a shaking dog|a dog that is cold and shivering in the rain|a garden hose spraying water over the lawn
`;

const images = fields(imageLines).map(([phrase, right, w1, w2]) => {
  if (!phrase || !right || !w1 || !w2) throw new Error(`an image line needs four fields: ${phrase}`);
  return { phrase, right, wrong: [w1, w2] as const };
});

/** imageBank asks what picture a phrase creates. */
const imageBank: readonly Item[] = images.map((im) => ({
  question: t("What does this phrase make you see, hear or feel?", "这个短语让你看到、听到或感受到什么？"),
  shown: im.phrase,
  right: im.right,
  wrong: [...im.wrong],
  why: t(
    `It creates the image of ${im.right}. Imagery uses words of the senses, and often a comparison, to make a picture in the reader's mind.\n\n**Check.** Picture the scene in “${im.phrase}” using your senses—it matches “${im.right}” rather than a literal or opposite reading.`,
    `它营造出这样的画面：${im.right}。意象用感官词语，常常还用比较，在读者脑中形成画面。\n\n**检验。** 用感官想象“${im.phrase}”的画面——它对应的是“${im.right}”，而不是死板字面或相反的意思。`,
  ),
  whyNot: [
    t(
      `“${im.wrong[0]}” reads the figurative comparison too literally instead of picturing the real sensory impression.`,
      `“${im.wrong[0]}”把比喻按字面理解得太死，没有想出真正的感官画面。`,
    ),
    t(
      `“${im.wrong[1]}” does not match the sights, sounds, or feelings suggested by the words in the phrase.`,
      `“${im.wrong[1]}”与短语中词语唤起的视觉、听觉或触觉感受不符。`,
    ),
  ],
}));

const moodLines = `
  The wind howled around the cabin. Branches scraped the window like claws, and somewhere in the dark a door banged and banged.|fear|joy|boredom
  Sunlight poured through the leaves. Birds sang from every branch, and the grass was warm and soft under our bare feet.|happy calm|sadness|fear
  The empty playground was gray with rain. One swing creaked back and forth, and a forgotten teddy bear lay face down in a puddle.|loneliness|excitement|anger
  Drums pounded, flags snapped in the wind, and the crowd surged forward, shouting and waving as the runners came around the bend.|excitement|calm|sadness
  The snow fell without a sound. The world was white and still, and the only light came from the windows of the little houses.|peace|panic|anger
  Smoke stung our eyes. Sirens wailed, and people ran past us down the street, clutching their children and their pets.|panic|peace|boredom
  The kitchen smelled of cinnamon and warm bread. Grandma hummed as she stirred, and the windows were fogged from the oven's heat.|cozy comfort|fear|loneliness
  The house was silent. Dust lay on the piano, and the clocks had all stopped at the same minute long ago.|sadness|joy|excitement
  The dark water lapped at the dock. A single light bobbed far out on the lake, and something splashed in the reeds.|mystery|cheerfulness|anger
  Balloons bobbed against the ceiling. Music thumped, the cake glowed with candles, and everyone shouted surprise at once.|joy|loneliness|fear
  The sky turned a heavy green. The air grew still and thick, and the birds suddenly stopped singing.|unease|happiness|boredom
  Waves whispered on the sand. The sun sank slowly, painting the water pink and gold, and the gulls drifted home.|calm|panic|anger
  Her fists were clenched. Her face burned red, and she slammed the book down so hard the table shook.|anger|peace|joy
  The cave was black and cold. Water dripped somewhere ahead, and our flashlight flickered and grew dim.|fear|cheerfulness|boredom
  Fireflies blinked over the meadow. Crickets sang, and the warm night smelled of cut grass and honeysuckle.|peaceful wonder|terror|anger
  The bus pulled away. Through the back window I watched my mother get smaller and smaller until she was gone.|sadness|excitement|anger
  Thunder cracked, and the lights went out. In the sudden dark, the floorboards above our heads began to creak.|fear|calm|joy
  The fair was a whirl of lights. The rides spun and screamed, and the air smelled of popcorn and sugar.|excitement|loneliness|calm
  The garden was overgrown and gray. Dead leaves rattled on the path, and the gate hung by one rusty hinge.|gloom|joy|excitement
  The puppy tumbled over its own paws, chased its tail and sneezed, then wagged so hard its whole body wiggled.|playful joy|sadness|fear
  The hallway was long and empty. Our footsteps echoed, and at the end a door stood open just a crack.|suspense|cheerfulness|boredom
  Steam rose from the hot spring. Snowflakes melted on our warm faces, and the mountains glowed in the last light.|peace|panic|anger
  The judge opened the envelope slowly. The room held its breath, and my heart thudded in my ears.|nervous hope|boredom|anger
  Frost covered the fields. The trees stood bare and black, and the cold wind cut through my thin coat.|bleak cold|warm comfort|excitement
  Laughter rang out across the picnic. Children splashed in the creek, and the smell of grilled corn drifted over the field.|cheerfulness|fear|loneliness
  The ship creaked and rolled. Giant gray waves rose higher than the mast, and the wind tore at the sails.|danger|calm|boredom
  The library was hushed. Sunlight lay in warm squares on the tables, and the only sound was the turning of pages.|quiet calm|panic|anger
  The streets were deserted. Shutters banged in the wind, and a single dog barked far away, then stopped.|loneliness|joy|excitement
  The parade was a river of color. Dancers twirled, trumpets blared, and confetti rained down on everyone.|celebration|sadness|fear
  Shadows stretched across the floor. The clock ticked loudly, and a cold draft lifted the curtain.|unease|joy|boredom
  The baby giggled and grabbed at the bubbles. Each time one popped, she squealed and clapped her chubby hands.|delight|anger|fear
  Ashes drifted where the old barn had stood. A blackened weathervane lay in the mud, still pointing north.|sorrow|excitement|cheerfulness
`;

const moods = fields(moodLines).map(([passage, right, w1, w2]) => {
  if (!passage || !right || !w1 || !w2) throw new Error(`a mood line needs four fields: ${passage}`);
  return { passage, right, wrong: [w1, w2] as const };
});

/** moodBank asks what feeling the imagery of a passage gives. */
const moodBank: readonly Item[] = moods.map((m) => ({
  question: t("What feeling does the imagery of this passage give?", "这段文字的意象给人什么感觉？"),
  shown: m.passage,
  right: m.right,
  wrong: [...m.wrong],
  why: t(
    `The images give a feeling of **${m.right}**. Look at what the passage makes you see, hear, smell and feel: together these details set the mood.\n\n**Check.** List two or three sensory details from the passage—each one reinforces **${m.right}** rather than ${m.wrong[0]} or ${m.wrong[1]}.`,
    `这些意象给人**${m.right}**的感觉。看看这段文字让你看到、听到、闻到和感受到什么：这些细节合在一起营造出气氛。\n\n**检验。** 挑出文中的两三个感官细节——它们都在强化**${m.right}**，而不是“${m.wrong[0]}”或“${m.wrong[1]}”。`,
  ),
  whyNot: [
    t(`The sensory details in the passage do not create a feeling of ${m.wrong[0]}.`, `文中的感官细节并没有营造出“${m.wrong[0]}”的气氛。`),
    t(
      `Nothing in the sights or sounds here suggests ${m.wrong[1]}—combine all the clues to find the shared mood.`,
      `这里的景象和声音都没有指向“${m.wrong[1]}”——把所有感官线索合起来看整体气氛。`,
    ),
  ],
}));

// Adages and proverbs.

const proverbLines = `
  Practice makes perfect.|Doing something again and again makes you good at it.|Only people who are perfect should practice.|Practicing is the most perfect hobby there is.
  Where there's a will, there's a way.|If you want something enough, you can find a way to do it.|People who write a will always find their way home.|A road can only be built where people want it.
  Look before you leap.|Think carefully before you act.|Always check the ground before you jump over it.|Jumping is safer than looking around.
  Don't count your chickens before they hatch.|Don't be sure of something good until it has happened.|Count chickens only after they come out of their eggs.|Chickens are hard to count when they are still small.
  The early bird catches the worm.|People who start early get the best chances.|Birds that wake early eat more worms than others.|Worms are easier to catch in the morning.
  Actions speak louder than words.|What you do shows more than what you say.|Doing things makes more noise than talking.|People should act instead of ever speaking.
  Two heads are better than one.|Two people thinking together solve problems better.|A person with two heads is smarter than others.|Two hats are better than one on a cold day.
  Slow and steady wins the race.|Patient, steady work succeeds in the end.|The slowest runner always wins every race.|Races are won by those who stop to rest.
  Every cloud has a silver lining.|Something good can come from a bad thing.|Clouds have silver edges when the sun is behind them.|Rain clouds are made of shiny silver.
  Don't put all your eggs in one basket.|Don't risk everything on one plan.|Carry eggs in many baskets so they do not break.|Baskets are not a good place to keep eggs.
  Many hands make light work.|A job is easier when many people help.|People with many hands can lift heavy things.|Hands make a room light when they switch on lamps.
  Honesty is the best policy.|Telling the truth is always the wisest choice.|Companies should write honest rules.|Honest people always win prizes.
  A friend in need is a friend indeed.|A friend who helps you in hard times is a true friend.|A friend who needs things is a bad friend.|Friends should never ask for help.
  Better late than never.|Doing something late is better than not doing it at all.|Being late is better than being on time.|People who are never late are not good friends.
  Don't judge a book by its cover.|Don't decide what someone is like from how they look.|Books with plain covers are always the best ones.|Only read books with nice covers.
  The grass is always greener on the other side.|Other people's lives often seem better than yours, even when they are not.|The neighbor's lawn always gets more rain.|Grass grows faster on the far side of a fence.
`;

const proverbs = fields(proverbLines).map(([proverb, meaning, w1, w2]) => {
  if (!proverb || !meaning || !w1 || !w2) throw new Error(`a proverb line needs four fields: ${proverb}`);
  return { proverb, meaning, wrong: [w1, w2] as const };
});

/** proverbMeaningBank asks what a proverb means, from the proverb alone and from the proverb used in a sentence. */
const proverbMeaningBank: readonly Item[] = proverbs.flatMap((p) =>
  [
    ["", t(`What does the proverb “${p.proverb}” mean?`, `谚语“${p.proverb}”是什么意思？`)],
    [
      `When Grandpa saw how worried I was, he smiled and said, “${p.proverb}”`,
      t("What does Grandpa mean by the proverb he says?", "爷爷说的这句谚语是什么意思？"),
    ],
  ].map(([shown, question]) => ({
    question: question as ReturnType<typeof t>,
    shown: shown as string,
    right: p.meaning,
    wrong: [...p.wrong],
    why: t(
      `“${p.proverb}” means: ${p.meaning} A proverb is a short, old saying that gives advice; its meaning is a lesson about life, not about the things it names.\n\n**Check.** Apply “${p.meaning}” to a real-life situation—it gives useful everyday advice, unlike the literal readings.`,
      `“${p.proverb}”的意思是：${p.meaning} 谚语是给人忠告的简短古老的说法；它的意思是关于生活的道理，而不是关于它字面上提到的东西。\n\n**检验。** 把这个道理放回日常生活情境里——它给出了实用的忠告，而不是字面上的事。`,
    ),
    whyNot: [
      t(
        `“${p.wrong[0]}” reads the proverb too literally, treating the image as a plain fact.`,
        `“${p.wrong[0]}”按字面意思理解得太死，把比喻当成了字面事实。`,
      ),
      t(
        `“${p.wrong[1]}” twists the proverb's advice instead of stating the life lesson it teaches.`,
        `“${p.wrong[1]}”歪曲了这句谚语的忠告，不是它要传达的生活道理。`,
      ),
    ],
  })),
);

const situationLines = `
  As a boy, the inventor built and rebuilt his model plane fifty times before it flew across the room.|0
  She had no money for lessons, so she borrowed books from the library and taught herself to play the piano.|1
  Before she signed up for the long hike, she checked the weather, the map and how much water she would need.|2
  He told everyone he would win the prize, but the judges had not even read the stories yet.|3
  The young baker opened her shop at five every morning, and she sold her bread before the shops nearby even opened.|4
  He promised to help clean the park many times, but she was the one who showed up every Saturday with a rake.|5
  The two scientists could not solve the puzzle alone, but together they found the answer in a week.|6
  The patient scientist worked on her experiment for ten years, one small step at a time, until it finally worked.|7
  When the factory closed, he lost his job, but he used the free time to start the business he had always dreamed of.|8
  The farmer planted rice, beans and corn, so when the beans failed one dry year, she still had food.|9
  The whole village helped build the new school, and it was finished in one summer.|10
  The boy admitted he had broken the window, and the neighbor was so pleased with his truth that she forgave him.|11
  When she was sick, it was her quiet classmate who brought her homework every day.|12
  He learned to read when he was seventy, and he said it was the happiest year of his life.|13
  The shy new student looked plain, but she turned out to be the best storyteller in the school.|14
  He always wished he lived in the city like his cousin, until he learned his cousin wished to live on a farm.|15
  She practiced her speech every night for a month, and on the day she spoke without a single note.|0
  Though no school would take her, she studied the stars on her own and became a famous astronomer.|1
  The explorer studied the ice carefully before he crossed the frozen river.|2
  The team began to celebrate in the second half, and the other team scored three goals.|3
  The first farmer at the market each morning got the best place to sell his apples.|4
  He never talked about being kind, but every winter he quietly gave coats to children who had none.|5
  The writer and the artist made the picture book together, and it was better than anything either had made alone.|6
  She did not rush the bridge; she checked each beam, and her bridge has stood for a hundred years.|7
  Her first painting was rejected, but the teacher who saw it offered to give her lessons.|8
  The town got its power from the sun, the wind and the river, so it never went dark when one failed.|9
  Each family brought one dish, and soon there was a feast for the whole street.|10
  The shopkeeper gave back the extra money a customer had paid by mistake, and the customer came back every week.|11
  When the storm wrecked her house, the neighbor she had always helped was the first to arrive.|12
  She finished her degree at sixty-five, forty years after she had started it.|13
  The plain little seed packet held the most beautiful flowers in the garden.|14
  The girl envied her friend's big family, but her friend envied her quiet room of her own.|15
`;

const situations = fields(situationLines).map(([situation, n]) => {
  const index = Number(n);
  if (!situation || !(index >= 0 && index < proverbs.length)) throw new Error(`a situation needs a proverb: ${situation}`);
  return { situation, index };
});

/** proverbFitBank asks which proverb fits a situation of a life story. */
const proverbFitBank: readonly Item[] = situations.map((s, i) => {
  const p = proverbs[s.index] ?? proverbs[0];
  const wrong = [pick(proverbs, s.index + 3 + (i % 3)), pick(proverbs, s.index + 7 + (i % 5))];
  return {
    question: t("Which proverb fits this part of a life story?", "哪句谚语适合这段人生故事？"),
    shown: s.situation,
    right: p?.proverb ?? "",
    wrong: wrong.map((w) => w?.proverb ?? ""),
    why: t(
      `“${p?.proverb}” fits: ${p?.meaning} The events of the story show this lesson.\n\n**Check.** Summarize the story's lesson in one sentence and compare it with “${p?.proverb}”—they state the same piece of wisdom.`,
      `“${p?.proverb}”适合：${p?.meaning} 故事中的事情正说明了这个道理。\n\n**检验。** 用一句话概括这段故事的道理，再与“${p?.proverb}”对照——两者说的正是同一条智慧。`,
    ),
    whyNot: wrong.map((w) =>
      t(
        `“${w?.proverb}” means: ${w?.meaning} That is not the lesson of these events.`,
        `“${w?.proverb}”的意思是：${w?.meaning} 这不是这些事情说明的道理。`,
      ),
    ),
  };
});

/** taleTopics4 are the reading topics of grade 4 about stories, poems and sayings. */
export const taleTopics4: readonly TopicDef[] = [
  {
    id: "wordplay-and-puns",
    title: t("Wordplay and Puns", "文字游戏和双关语"),
    summary: t(
      "A pun is funny because a word has two meanings or sounds like another word.",
      "双关语之所以好笑，是因为一个词有两种意思，或者听起来像另一个词。",
    ),
    intro: t(
      "“Why did the bicycle fall over? Because it was two-tired!” One phrase pulls your mind in two directions at once—having two tires and being too tired. Spotting the word that carries both meanings is how you unlock a pun.",
      "“为什么自行车会倒？因为它 two-tired（有两个轮胎 / 太累了）！”一个短语同时把思路拉向两个方向。找出承载双层意思的关键词，就能看懂双关语的妙处。",
    ),
    prerequisites: after("multiple-meaning-words", "homophones"),
    encompasses: [{ topic: "multiple-meaning-words", weight: 0.2 }],
    xp: 14,
    strand: "reading",
    knowledgePoints: [
      point(
        "the-word-a-joke-turns-on",
        t("The Word a Joke Turns On", "笑话的关键词"),
        t(
          "A **pun** is a joke that plays with a word. Most jokes of this kind turn on a single word or phrase: *Why are fish so smart? They live in schools.* To find it, ask which word makes you think of two things at once: here, *schools* of fish and the schools children go to.\n\n> **Watch out.** Do not pick a setup word like *fish* or *smart*—the pun word is the one that clicks into two different meanings or sounds.",
          "**双关语**是玩弄词语的笑话。这类笑话大多靠一个词或短语制造笑点：*Why are fish so smart? They live in schools.* 要找到它，就问哪个词让你同时想到两样东西：这里是成群的鱼（schools of fish）和孩子们上的学校。\n\n> **注意。** 不要选 *fish*、*smart* 这类铺垫词——双关词一定是那个同时触发两种意思或谐音的词。",
        ),
        itemGenerator(punWordBank),
      ),
      point(
        "the-two-meanings-of-a-pun",
        t("The Two Meanings of a Pun", "双关语的两种意思"),
        t(
          "A pun needs **two meanings** at once. One fits the situation of the joke; the other is the surprise. Some puns use one word with two meanings (*bark*); others use two words that sound alike (*hoarse* and *horse*). Name both meanings to explain why the joke is funny.\n\n> **Watch out.** Check *both* halves of the answer choice—a distractor often keeps one true meaning and slips a made-up or unrelated meaning into the other half.",
          "双关语需要同时有**两种意思**。一种符合笑话的情境，另一种带来意外。有的双关语用一个有两种意思的词（*bark*），有的用两个发音相同的词（*hoarse* 和 *horse*）。说出两种意思，才能解释笑话为什么好笑。\n\n> **注意。** 选项的前后两半都要核对——干扰项常保留一个对的意思，另一半却塞进无关的解释。",
        ),
        itemGenerator(punMeaningBank),
      ),
    ],
  },
  {
    id: "same-pattern-different-cultures",
    title: t("One Pattern in Many Cultures", "多种文化中的同一模式"),
    summary: t(
      "Tales from many cultures share patterns, such as the clever small animal who outwits a strong one, or the quest in three tries.",
      "许多文化的故事都有共同的模式，比如聪明的小动物智胜强大的动物，或者三次尝试的探险。",
    ),
    intro: t(
      "In China, Ye Xian loses a golden slipper; in France, Cinderella leaves a glass slipper; in Egypt, an eagle drops Rhodopis's rose-red sandal. Across continents and centuries, cultures tell stories with the same underlying pattern in their own local colors.",
      "在中国，叶限丢了金鞋；在法国，灰姑娘落下水晶鞋；在埃及，老鹰叼走了罗多皮斯的玫瑰红凉鞋。跨越山海与年代，不同文化常常用各自的色彩讲述同一个故事模式。",
    ),
    prerequisites: after("comparing-two-stories"),
    encompasses: [],
    xp: 14,
    strand: "reading",
    knowledgePoints: [
      point(
        "the-pattern-two-tales-share",
        t("The Pattern Two Tales Share", "两个故事共有的模式"),
        t(
          "Folktales travel. People in many lands tell tales with the same **pattern**: a small, clever animal outwits a big, strong one; the youngest of three succeeds; kindness is rewarded and greed punished. To find the pattern, look past the names and places and ask what shape the events take in both tales.\n\n> **Watch out.** Make sure the pattern fits *both* tales, not just one detail from the first story.",
          "民间故事会流传。许多地方的人讲着**模式**相同的故事：聪明的小动物智胜强大的动物；三个之中最小的成功了；善良得到奖赏，贪心受到惩罚。要找出模式，就要越过名字和地点，问两个故事的情节是什么样子。\n\n> **注意。** 选出的模式必须同时符合*两个*故事，不能只套得上其中一个。",
        ),
        itemGenerator(sharedPatternBank),
      ),
      point(
        "how-each-culture-tells-it",
        t("How Each Culture Tells It", "每种文化怎样讲述"),
        t(
          "Each culture fills a shared pattern with its own heroes, animals and events: a spider in West Africa, a mouse deer in Malaysia, a rabbit in the American South. When you compare two tales, keep each detail with the tale it comes from.\n\n> **Watch out.** Read carefully to catch swapped heroes or an event borrowed from a third tale not shown above.",
          "每种文化都用自己的主人公、动物和情节来填充共同的模式：西非是蜘蛛，马来西亚是鼠鹿，美国南方是兔子。比较两个故事时，要让每个细节对应它所来自的故事。\n\n> **注意。** 仔细核对每个文化对应的主人公和情节，谨防选项把两个故事对调，或混入第三个故事的情节。",
        ),
        itemGenerator(differenceBank),
      ),
    ],
  },
  {
    id: "why-characters-act",
    title: t("Why Characters Act", "角色为什么这样做"),
    summary: t(
      "A character's actions come from what they want, feel or believe, which a reader infers from details.",
      "角色的行为来自他们想要的、感受到的或相信的东西，读者从细节中推断出来。",
    ),
    intro: t(
      "When Ben—who is terrified of heights—grabs the lowest tree branch to rescue his crying little sister's kite, the story never writes “he loved his sister.” You infer his motive from the clues around his action.",
      "恐高的 Ben 看到妹妹因为风筝挂在树梢而哭泣，深吸一口气抓住最低的树枝往上爬——故事没直说“他很疼爱妹妹”，但你能从行动前后的细节推断出他的动机。",
    ),
    prerequisites: ["characters"],
    encompasses: [{ topic: "making-inferences", weight: 0.2 }],
    xp: 14,
    strand: "reading",
    knowledgePoints: [
      point(
        "the-motive-behind-an-action",
        t("The Motive Behind an Action", "行为背后的动机"),
        t(
          "A **motive** is the reason a character acts: what they want, what they feel, or what they believe. Stories seldom name it. The reader infers it from details: *Leo's sister's birthday was on Saturday. When she walked in, he slid the drawing under his pillow.* Leo wants the drawing to be a surprise.\n\n> **Watch out.** Base your inference on the clues actually in the passage—do not invent a reason the text never hints at.",
          "**动机**是角色行动的原因：他们想要什么、感受到什么或相信什么。故事很少直接说出来，读者要从细节中推断：*Leo's sister's birthday was on Saturday. When she walked in, he slid the drawing under his pillow.* Leo 想给姐姐一个惊喜。\n\n> **注意。** 推断必须紧扣文中的线索——不要凭空脑补文章毫无暗示的原因。",
        ),
        itemGenerator(motiveBank),
      ),
      point(
        "the-detail-that-shows-a-motive",
        t("The Detail That Shows a Motive", "显示动机的细节"),
        t(
          "An inference must rest on the text. The sentence that shows a motive tells what the character knows, wants or feels before acting (for example, *Last year Mei had missed the final word by one letter* explains why she practices every night). The sentence that only tells what the character does is the action itself, not its reason.\n\n> **Watch out.** Do not pick the sentence that merely repeats the character's action—pick the clue that explains *why* they did it.",
          "推断必须以文本为依据。显示动机的句子告诉我们角色在行动前知道、想要或感受到什么（例如“去年小梅差一个字母错失最后一词”解释了她为什么每晚练习）。只讲角色做了什么的句子是行为本身，而不是原因。\n\n> **注意。** 不要选只重复动作本身的句子——要选解释“为什么这么做”的线索句。",
        ),
        itemGenerator(motiveDetailBank),
      ),
    ],
  },
  {
    id: "summarizing-a-story",
    title: t("Summarizing a Story", "概括故事"),
    summary: t(
      "A summary of a story names the main character, the problem, the key events and the ending in a few sentences, without small details or opinions.",
      "故事的摘要用几句话说出主要人物、问题、关键情节和结局，不写小细节，也不写个人看法。",
    ),
    intro: t(
      "If a friend asks what *The Crow and the Pitcher* is about, you do not describe the color of every pebble or say “crows are the coolest birds”—you state the problem, the key action, and how it ends in one or two crisp sentences.",
      "如果朋友问《乌鸦喝水》讲了什么，你不会细数每颗石子的颜色，也不会说“乌鸦是最棒的鸟”——你会用一两句简洁的话说出难题、关键做法和结局。",
    ),
    prerequisites: after("retelling-key-events"),
    encompasses: [{ topic: "sequence-in-texts", weight: 0.2 }],
    xp: 14,
    strand: "reading",
    knowledgePoints: [
      point(
        "the-best-summary-of-a-story",
        t("The Best Summary of a Story", "故事最好的摘要"),
        t(
          "A **summary** tells a story in a few sentences. It names the main character, the problem, the key events and how it ends, in the reader's own words. For example, for Kai's kite contest: *Kai's kite kept crashing until his grandmother helped him add a longer tail. On the windy day of the contest, his kite flew highest and won first prize.*\n\n> **Watch out.** Reject any summary that stops before the ending, piles on tiny details (shirt colors, times), or adds “I think this is the best story.”",
          "**摘要**用几句话讲述一个故事。它用读者自己的话说出主要人物、问题、关键情节和结局。例如小凯放风筝的故事：“小凯的风筝老是坠落，直到奶奶帮他加长了尾巴。比赛那天风很大，他的风筝飞得最高，拿了第一名。”\n\n> **注意。** 排除任何没写结局、堆砌小细节（衣服颜色、具体钟点）或夹带“我觉得这故事太棒了”的选项。",
        ),
        itemGenerator(bestSummaryBank),
      ),
      point(
        "why-a-summary-falls-short",
        t("Why a Summary Falls Short", "摘要哪里不足"),
        t(
          "A summary can fail in three ways. It can be crowded with **small details**, such as colors and times. It can give the reader's **opinion** instead of the story (*I think*, *the cutest*). Or it can **stop before the ending**, so the problem is never solved. Name the fault to fix it.\n\n> **Watch out.** Read the summary all the way to its last word—a smooth beginning can still hide a missing ending.",
          "摘要可能有三种问题：塞满了颜色、时间之类的**小细节**；写的是读者的**看法**而不是故事（如 *I think*、*the cutest*）；或者**在结局之前就停了**，问题始终没有解决。说出问题所在，才能改正它。\n\n> **注意。** 一定把摘要读到最后一个词——开头写得再通顺，也可能漏掉了结局。",
        ),
        itemGenerator(faultBank),
      ),
    ],
  },
  {
    id: "imagery",
    title: t("Imagery", "意象"),
    summary: t(
      "Imagery is language that makes a picture, a sound or a feeling in the reader's mind.",
      "意象是在读者脑中形成画面、声音或感觉的语言。",
    ),
    intro: t(
      "“The fog crept over the hills on soft gray feet.” You never see actual feet, yet your mind instantly pictures quiet, slow-moving mist. Writers use sensory language—imagery—to let readers see, hear, smell, and feel a scene.",
      "“雾迈着轻柔的灰脚丫悄悄爬过山丘。”画面里并没有真正的脚，但脑海立刻浮现出悄无声息蔓延的浓雾。作者用意象调动感官，让读者看见、听见、闻到并感受到场景。",
    ),
    prerequisites: after("sensory-words", "what-a-poem-is-about"),
    encompasses: [{ topic: "sensory-words", weight: 0.2 }],
    xp: 14,
    strand: "reading",
    knowledgePoints: [
      point(
        "the-image-a-phrase-creates",
        t("The Image a Phrase Creates", "短语营造的意象"),
        t(
          "**Imagery** is language that appeals to the senses: sight, sound, smell, taste and touch. *The kettle shrieked on the stove* makes you hear a loud, high whistle. Writers often use comparisons, so do not read the words literally: a kettle cannot scream, but the image tells you how it sounds.\n\n> **Watch out.** Avoid literal traps—*silver feathers of frost on the window* means icy patterns on glass, not a real silver bird outside.",
          "**意象**是诉诸感官的语言：视觉、听觉、嗅觉、味觉和触觉。*The kettle shrieked on the stove* 让你听到尖锐的哨声。作者常用比较，所以不要只按字面理解：水壶不会尖叫，但这个意象告诉你它的声音是什么样的。\n\n> **注意。** 避开字面陷阱——“窗上的银色霜羽”指的是玻璃上羽毛状的冰花，而不是窗外停着一只银鸟。",
        ),
        itemGenerator(imageBank),
      ),
      point(
        "the-feeling-imagery-gives",
        t("The Feeling Imagery Gives", "意象带来的感觉"),
        t(
          "Images together create a **mood**, the feeling a passage gives the reader. Howling wind, scraping branches and a banging door make you afraid; warm bread and humming make you feel cozy. To name the mood, list the images, then ask what feeling they share.\n\n> **Watch out.** Look at *all* the images together—one word like *light* can feel cozy in a kitchen, yet eerie when it is a lone bobbing light on a dark lake.",
          "意象合在一起营造出**气氛**，也就是一段文字给读者的感觉。呼啸的风、刮擦的树枝和砰砰作响的门让人害怕；温暖的面包和哼歌声让人感到温馨。要说出气氛，先列出意象，再问它们有什么共同的感觉。\n\n> **注意。** 要把*所有*意象合起来看——同样是“灯光”，厨房里的灯光温馨，漆黑湖面远处摇曳的孤灯却营造出神秘感。",
        ),
        itemGenerator(moodBank),
      ),
    ],
  },
  {
    id: "adages-and-proverbs",
    title: t("Adages and Proverbs", "格言和谚语"),
    summary: t(
      "A proverb is a short old saying that gives advice, such as Practice makes perfect.",
      "谚语是给人忠告的简短古老的说法，比如 Practice makes perfect（熟能生巧）。",
    ),
    intro: t(
      "When someone warns *Don't count your chickens before they hatch*, they are rarely talking about a barn full of eggs—they are advising you not to celebrate a win before it actually happens. Proverbs pack timeless life advice into vivid, memorable sayings.",
      "有人提醒你 *Don't count your chickens before they hatch*（蛋还没孵出别先数小鸡）时，说的多半不是鸡窝，而是劝你事情没成别过早高兴。谚语把代代相传的人生忠告装进了生动好记的短句里。",
    ),
    prerequisites: ["idioms"],
    encompasses: [{ topic: "idioms", weight: 0.2 }],
    xp: 14,
    strand: "reading",
    knowledgePoints: [
      point(
        "what-a-proverb-means",
        t("What a Proverb Means", "谚语的意思"),
        t(
          "A **proverb**, or adage, is a short old saying that gives advice about life: *Look before you leap* means think before you act. Its words name everyday things, chickens, eggs, birds, but its meaning is a lesson. Ask what advice the saying would give a person.\n\n> **Watch out.** Reject any choice that reads the proverb literally (about real birds, clouds, or book covers)—a proverb always teaches a broader lesson about life.",
          "**谚语**或格言是关于生活的简短古老的忠告：*Look before you leap* 的意思是三思而后行。它的字面说的是鸡、蛋、鸟之类的日常事物，但意思是一个道理。问问这句话会给人什么忠告。\n\n> **注意。** 排除按字面意思理解的选项（真的谈鸟、云或书皮）——谚语讲的总是更广的人生道理。",
        ),
        itemGenerator(proverbMeaningBank),
      ),
      point(
        "the-proverb-that-fits",
        t("The Proverb That Fits", "适合的谚语"),
        t(
          "Writers of life stories use proverbs to sum up a lesson. To choose the one that fits, first say what the events teach in your own words, *she kept trying until it worked*, then find the proverb with that meaning: *Practice makes perfect*.\n\n> **Watch out.** Match the *lesson* of the whole story, not a surface word—a story about a farmer planting three crops fits *Don't put all your eggs in one basket*, even though no eggs appear.",
          "写人生故事的作者用谚语来总结道理。要选出合适的谚语，先用自己的话说出这些事情说明了什么，*she kept trying until it worked*，再找出意思相同的谚语：*Practice makes perfect*。\n\n> **注意。** 要匹配整个故事的*道理*，而不是表面字眼——农夫种三种庄稼防旱灾，虽然没提鸡蛋，却正合“别把所有鸡蛋放在一个篮子里”。",
        ),
        itemGenerator(proverbFitBank),
      ),
    ],
  },
];
