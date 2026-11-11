// Grade 3: the parts of stories and poems (chapters, lines and stanzas), and what a short poem is about and feels.

import { type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-english";
import { type Ask, askGenerator, need, rows, topic } from "./kit.ts";

// Poems of two stanzas of two lines: title|four lines|subject|two wrong subjects|feeling|its Chinese|the line that
// shows the feeling and two lines that do not, by their places from 0.

const poemRows = rows(`
  Morning Rain|The rain taps softly on the glass,|It drums upon the garden grass.|I curl up warm and watch it fall,|And do not mind the gray at all.|a rainy morning seen from inside|a summer day at the beach|a storm that breaks a window|calm and cozy|平静、舒适|2,0,1
  My New Puppy|My puppy has a tail that wags,|He chews my socks and paper bags.|He licks my face and makes me grin,|I'm glad the day he tumbled in.|a new pet puppy|a lost cat|a trip to the zoo|happy and loving|开心、充满爱|2,0,1
  Moving Day|The boxes sit in every hall,|There are no pictures on the wall.|I wave goodbye to my old street,|My heart feels heavy as my feet.|leaving an old home|a birthday party|cleaning a classroom|sad|难过|3,0,1
  The Thunderstorm|The thunder crashes overhead,|The lightning flashes white and red.|I pull the blanket to my chin|And wish the storm would not come in.|a storm at night|a sunny picnic|a fireworks show|frightened|害怕|2,0,1
  First Day of School|My bag is packed, my shoes are new,|My lunch is in a box of blue.|My tummy flutters like a bird,|I hardly hear the teacher's word.|starting at a new school|a trip to the shoe shop|a pet bird|nervous|紧张|2,0,1
  The Kite|My kite climbs up on strings of air,|It dances high above the square.|I run and shout and laugh out loud|To see it touch a passing cloud.|flying a kite|a bird building a nest|a ride in an airplane|joyful|快乐|2,0,1
  Grandpa's Garden|Grandpa plants his seeds in rows,|He waters each one with the hose.|I kneel beside him in the sun|And wish the day was never done.|gardening with a grandparent|buying vegetables at a shop|a farm animal|happy and close|开心、亲近|3,0,1
  The Lost Mitten|One red mitten in the snow,|And where the other went, who knows?|I search the path from end to end|And miss it like a long-lost friend.|losing a mitten|building a snowman|a red bird in winter|sad|难过|3,0,2
  The Night Sky|The stars come out one by one,|Long after setting of the sun.|I lie and count them from the hill;|The world is wonderfully still.|looking at the stars at night|a sunny morning|a noisy storm|peaceful|宁静|3,0,1
  Losing the Race|I ran as fast as I could go,|But both my legs were far too slow.|I watched them cross the line ahead;|My cheeks grew hot, my face went red.|losing a race|winning a prize|a trip to the beach|disappointed and embarrassed|失望又难为情|3,0,2
  Baking with Mom|We measure flour, we crack the eggs,|The batter splashes on my legs.|The kitchen fills with warm, sweet air;|I'm glad that Mom and I are there.|baking with a parent|eating breakfast at a cafe|a broken oven|happy and warm|快乐、温暖|3,0,1
  The Spider|A spider spins her silver thread|Above the corner of my bed.|I watch her work by morning light|And wonder how she weaves so right.|a spider spinning a web|a scary monster|a sewing machine|curious and amazed|好奇、惊叹|3,0,1
  Snow Day|The snow came down all through the night|And turned the whole wide world to white.|No school today! We shout and cheer,|The best day of the whole long year!|a day off school because of snow|the first day of school|a hot summer day|excited|兴奋|2,0,1
  My Sister's Birthday|My sister's cake has nine bright lights,|Her presents shine in ribbons white.|I cross my arms and stamp my feet;|I wish that I could have her treat.|a sister's birthday|the speaker's own birthday|a visit to a cake shop|jealous|嫉妒|2,0,1
  The Old Oak|The old oak stands upon the hill;|Through wind and rain it's standing still.|I rest beneath its leafy arms|And feel so safe from any harm.|an old tree|a new house|a windy storm|safe|安全、安心|3,0,1
  Sick in Bed|My nose is red, my throat is sore,|I've sneezed a hundred times or more.|My friends are playing in the sun,|While I stay in and miss the fun.|being sick at home|playing in the park|a visit to the doctor|left out and gloomy|失落、郁闷|3,0,1
  The Ocean|The waves roll in and crash and spray,|They wash my sandcastle away.|The ocean is so big and wide,|I feel so small here at its side.|the ocean|a swimming pool|a boat on a river|small and amazed|渺小又惊叹|3,0,1
  The Broken Vase|My ball bounced high and hit the shelf,|Mom's vase fell down and broke itself.|I hold the pieces, cold and blue;|My stomach sinks. What will I do?|breaking something by accident|playing ball in the park|buying a vase as a gift|worried|担心|3,0,1
  Summer Night|The crickets sing, the air is warm,|The fireflies flicker in a swarm.|We sit outside on Grandma's stair,|And I'm so happy sitting there.|a warm summer evening|a snowy winter night|a bug in a jar|happy and content|快乐、满足|3,0,1
  Climbing the Hill|The hill was steep, the path was long,|I sang a little marching song.|And when I stood upon the top,|I felt so proud I did a hop!|climbing a hill|riding a bike downhill|a hot day at the pool|proud|自豪|3,0,2
  The Kitten|A kitten curled up in my lap|And settled down to take a nap.|Her purring is a gentle hum;|I love her more than bubble gum.|a kitten asleep in a lap|a puppy playing ball|a lion at the zoo|loving|喜爱|3,0,1
  The Dentist|The chair tips back, the light is bright,|The dentist hums and checks my bite.|My hands are squeezing very tight,|Though nothing hurts, and all's all right.|a visit to the dentist|brushing teeth at home|a trip to a candy shop|nervous|紧张|2,0,1
  Autumn Walk|The leaves are gold and red and brown;|They spin and tumble, floating down.|I kick them up and laugh with glee|As they come dancing down to me.|walking in autumn leaves|planting flowers in spring|a snowy day|cheerful|快活|2,0,1
  The Last Day of Summer|The pool is closed, the beach is bare,|There's chill and quiet in the air.|I pack away my bucket and spade|And wish that summer could have stayed.|the end of summer|the first snow of winter|a new swimming pool opening|a little sad|有点难过|3,0,1
  My Best Friend Moves|The truck drives off with Mia's bed,|Her boxes, chairs and bike of red.|I wave until it's out of sight;|I'll miss her every day and night.|a best friend moving away|a friend's birthday party|buying a red bike|sad and lonely|难过、孤单|3,0,1
  The Bee|A busy bee goes buzz and zoom|From flower bloom to flower bloom.|She never stops to take a rest;|I think that she's the very best.|a bee visiting flowers|a sting that hurts|a garden snail|admiring|欣赏|3,0,1
  The Drum|Boom goes my drum, and bang, and boom,|The noise goes bouncing round the room.|I play so loud the windows shake;|Such happy noise I love to make!|playing a drum|a thunderstorm at night|a quiet library|joyful and excited|快乐又兴奋|3,0,1
  Planting a Seed|I press a seed down in the ground|And pat the soil all around.|I check it early, check it late;|I hope it sprouts! I hate to wait.|planting a seed and waiting|picking apples from a tree|a lost toy in the garden|hopeful and impatient|期待又着急|3,0,1
  The Library|The library is hushed and tall,|With books that stretch along each wall.|I find a story, sit, and read;|It's all the treasure that I need.|reading at a library|a noisy classroom|a treasure hunt|content|满足|3,0,1
  The Spelling Prize|I spelled enormous, ocean, knee,|Each word as right as right can be.|They called my name and gave the prize,|And tears of joy came to my eyes.|winning a spelling contest|failing a spelling test|reading a book about the ocean|proud and happy|自豪、开心|3,0,1
  The Baby Brother|My baby brother's very new,|His hands are tiny, his eyes are blue.|He holds my finger, squeezing tight;|I want to keep him safe at night.|a new baby brother|a doll from the toy shop|a new puppy|loving and protective|疼爱、想保护他|3,0,1
  Winter Morning|Frost paints the windows white and thin,|The cold wind whistles to get in.|I sip hot cocoa, snug and warm,|Safe from the cold and from the storm.|a cold winter morning indoors|a summer picnic|a walk in the rain|cozy|舒适|2,0,1
`);

interface Poem {
  readonly title: string;
  readonly lines: readonly [string, string, string, string];
  readonly subject: string;
  readonly wrongSubjects: readonly [string, string];
  readonly feeling: readonly [string, string];
  readonly feelingLine: number;
  readonly flatLines: readonly [number, number];
}

const poems: readonly Poem[] = poemRows.map((row) => {
  const [title = "", l1 = "", l2 = "", l3 = "", l4 = "", subject = "", s1 = "", s2 = "", en = "", zh = "", places = ""] = need(row, 11);
  const [fi = 0, n1 = 0, n2 = 0] = places.split(",").map(Number);
  return { title, lines: [l1, l2, l3, l4], subject, wrongSubjects: [s1, s2], feeling: [en, zh], feelingLine: fi, flatLines: [n1, n2] };
});

/** show sets a poem out with its title, its two stanzas, and the lines given in bold. */
const show = (poem: Poem, bolded: ReadonlySet<number> = new Set()) => {
  const line = (i: number) => {
    const text = poem.lines[i] ?? "";
    return bolded.has(i) ? `**${text}**` : text;
  };
  return `*${poem.title}*\n\n${line(0)}\n${line(1)}\n\n${line(2)}\n${line(3)}`;
};

const unquote = (line: string) => line.replace(/[,;.:!?]+$/, "");

// Chapter books of three chapters: title|chapter titles and summaries, as title: summary.

const bookRows = rows(`
  The Raft|Two Friends by the River: Sam and Tess live by a wide river and love to build things together.|Swept Away: A flood carries away the bridge, and the village is cut off from the market.|The Big Raft: Sam and Tess build a raft and carry food across the river until the bridge is fixed.
  The Dragon Egg|The Girl in the Mountains: Lia lives with her grandmother in a stone house high in the mountains.|The Egg Hatches: A strange egg hatches into a baby dragon that sets the curtains on fire, and the villagers want it gone.|Fire for the Village: In the winter freeze, the dragon lights every stove in the village, and everyone welcomes it.
  Moon Bakery|Mr. Lu's Shop: Mr. Lu bakes round moon cakes in a little shop on a busy street.|No Flour: The night before the festival, rats get into his flour, and there is none left.|Neighbors Help: His neighbors each bring a bag of flour, and the cakes are ready by morning.
  The Lost Puppy|Max and Dot: Max has a little spotted puppy named Dot who follows him everywhere.|Gone!: One morning the gate is open, and Dot is nowhere to be found.|Home Again: Max follows her paw prints to the park and carries Dot home.
  Space Camp|Arriving at Camp: Priya arrives at space camp, where she shares a room with three other girls.|The Broken Model: The night before the rocket contest, the team's model rocket breaks in half.|Lift Off: The team works together to fix the rocket, and it flies the highest of all.
  The Talking Tree|The Old Forest: Ben lives at the edge of an old forest where one huge tree is said to talk.|The Axes: Workers arrive to cut down the forest and build a road.|A Path Around: Ben shows the town a map, and the road is built around the forest instead.
  The Quiet Drum|The Band: Kofi plays the drum in his school band, but he plays very softly.|The Big Parade: On the day of the parade, the leader of the drummers is ill, and someone must lead the beat.|Boom!: Kofi plays loud and strong, and the whole band marches in step behind him.
  Grandma's Quilt|Grandma's House: June visits her grandmother, who keeps an old quilt with a patch for every family story.|The Tear: June's dog drags the quilt outside and tears a big hole in it.|A New Patch: June and Grandma sew a new patch, and it tells the story of the dog.
  The Snow Fort|Winter on Elm Street: The children of Elm Street wait all year for the first deep snow.|Two Teams: They split into two teams, and the teams argue over who will build the best fort.|One Big Fort: When the snow runs low, they join their forts into one giant castle.
  Pirate Picnic|Captain Kim: Kim and her little brother play pirates in their back yard every Saturday.|The Map Blows Away: Their treasure map blows over the fence into a grumpy neighbor's garden.|A New Crew Member: Kim asks the neighbor for help, and he joins their pirate picnic.
  The Shy Owl|The Owl in the Barn: A small owl lives in a barn and is too shy to hoot.|Mice Everywhere: Mice fill the barn and eat the farmer's grain while the other owls are away.|The Night Watch: The shy owl catches the mice one by one, and the farmer thanks it.
`);

const books = bookRows.map((row) => {
  const [title = "", ...chapters] = need(row, 4);
  return { title, chapters };
});

/** showBook sets out the chapters of a book, with one of them in bold. */
const showBook = (book: { title: string; chapters: readonly string[] }, bolded: number) =>
  [
    `*${book.title}*`,
    ...book.chapters.map((c, i) => {
      const [name = "", summary = ""] = c.split(": ");
      const entry = `Chapter ${i + 1}, ${name}: ${summary}`;
      return i === bolded ? `**${entry}**` : entry;
    }),
  ].join("\n\n");

const partQuestion = t("What is the part in bold called?", "粗体的部分叫什么？");

const partWhy: Record<string, readonly [string, string]> = {
  "a line": [
    "A line of a poem is one row of words; a poem is written in lines, not in sentences that run on across the page.",
    "诗的一行就是一排文字；诗是一行一行写的，而不是像文章那样连着写满整页。",
  ],
  "a stanza": [
    "A stanza is a group of lines in a poem, set apart from the next group by a space, like a paragraph of a story.",
    "诗节是诗里的一组诗行，和下一组之间空一行隔开，就像故事里的段落。",
  ],
  "a chapter": [
    "A chapter is one of the main parts of a longer story; each has its own number and often its own title.",
    "章节是较长故事的主要部分之一；每一章都有编号，通常还有自己的标题。",
  ],
};

const partNot: Record<string, readonly [string, string]> = {
  "a line": [
    "A line is a single row of a poem, but the part in bold is not one row of a poem.",
    "诗行是诗里单独的一行，但粗体部分不是诗里的一行。",
  ],
  "a stanza": ["A stanza is a group of lines of a poem, but the part in bold is not that.", "诗节是诗里的一组诗行，但粗体部分不是诗节。"],
  "a chapter": [
    "A chapter is a numbered part of a long story, and a poem is not made of chapters.",
    "章节是长故事里有编号的部分，诗不是由章节组成的。",
  ],
};

const partAsk = (shown: string, right: string, wrong: readonly [string, string]): Ask => ({
  question: partQuestion,
  shown,
  right,
  wrong,
  why: t(...(partWhy[right] ?? ["", ""])),
  whyNot: wrong.map((w) => t(...(partNot[w] ?? ["", ""]))),
});

const partBank: readonly Ask[] = [
  ...poems.map((poem, i) => partAsk(show(poem, new Set([i % 4])), "a line", ["a stanza", "a chapter"])),
  ...poems.map((poem, i) => partAsk(show(poem, new Set(i % 2 === 0 ? [0, 1] : [2, 3])), "a stanza", ["a line", "a chapter"])),
  ...books.flatMap((book) => [0, 1, 2].map((c) => partAsk(showBook(book, c), "a chapter", ["a stanza", "a line"]))),
];

const roles = [
  "It introduces the characters and the setting.",
  "It brings the problem of the story.",
  "It solves the problem of the story.",
] as const;

const roleWhy: readonly (readonly [string, string])[] = [
  [
    "The first chapter tells who the characters are and where they live, before anything goes wrong.",
    "第一章介绍角色是谁、住在哪里，那时还没有出什么问题。",
  ],
  [
    "This chapter is where the trouble starts: it gives the characters a problem to deal with.",
    "这一章是麻烦开始的地方：它给角色带来了要应对的问题。",
  ],
  ["This chapter settles the trouble that came before, so the story can end.", "这一章解决了前面出现的麻烦，故事因此可以结束。"],
];

const roleNot: readonly (readonly [string, string])[] = [
  ["The characters and the setting were already introduced before this chapter.", "角色和背景在这一章之前已经介绍过了。"],
  ["Nothing goes wrong in this chapter; the trouble starts or is settled elsewhere.", "这一章里没有出问题；麻烦在别的章节开始或解决。"],
  [
    "The problem is not solved in this chapter; look at what happens at the end of the book.",
    "问题不是在这一章解决的；看看书的结尾发生了什么。",
  ],
];

const roleBank: readonly Ask[] = books.flatMap((book) =>
  [0, 1, 2].map(
    (c): Ask => ({
      question: t("What does the chapter in bold add to the whole story?", "粗体的这一章给整个故事增加了什么？"),
      shown: showBook(book, c),
      right: roles[c] ?? "",
      wrong: [0, 1, 2].filter((k) => k !== c).map((k) => roles[k] ?? ""),
      why: t(...(roleWhy[c] ?? ["", ""])),
      whyNot: [0, 1, 2].filter((k) => k !== c).map((k) => t(...(roleNot[k] ?? ["", ""]))),
    }),
  ),
);

const subjectBank: readonly Ask[] = poems.map((poem) => ({
  question: t("What is this poem about?", "这首诗写的是什么？"),
  shown: show(poem),
  right: poem.subject,
  wrong: [...poem.wrongSubjects],
  why: t(
    `The poem is about ${poem.subject}. Its title and the pictures in its lines all point to this subject.`,
    `这首诗写的是：${poem.subject}。诗的标题和诗行里的画面都指向这个主题。`,
  ),
  whyNot: poem.wrongSubjects.map(() =>
    t(
      "The poem's lines do not show that; a subject must fit the title and the pictures of every stanza.",
      "诗行里没有写到这一点；主题必须符合标题和每一节诗里的画面。",
    ),
  ),
}));

const feelingBank: readonly Ask[] = poems.map((poem) => {
  const right = unquote(poem.lines[poem.feelingLine] ?? "");
  return {
    question: t(
      `The speaker of this poem feels ${poem.feeling[0]}. Which line shows that feeling best?`,
      `这首诗的说话人感到${poem.feeling[1]}。哪一行最能表现这种感受？`,
    ),
    shown: show(poem),
    right,
    wrong: poem.flatLines.map((i) => unquote(poem.lines[i] ?? "")),
    why: t(
      `This line shows how the speaker feels: “${right}” It tells what the speaker does or feels, not only what is there.`,
      `这一行表现了说话人的感受：“${right}” 它写出了说话人做了什么或感到什么，而不只是写有什么东西。`,
    ),
    whyNot: poem.flatLines.map(() =>
      t(
        "That line paints a picture of what is there, but it does not show how the speaker feels.",
        "这一行描绘了眼前的景象，但没有表现出说话人的感受。",
      ),
    ),
  };
});

/** poemTopics are the reading topics of grade 3 on the parts of stories and poems and on what a poem is about. */
export const poemTopics: readonly TopicDef[] = [
  topic(
    "parts-of-stories-and-poems",
    t("Parts of Stories and Poems", "故事和诗的组成部分"),
    t(
      "Stories have chapters and poems have lines and stanzas, and each part adds to what came before.",
      "故事有章节，诗有诗行和诗节，每一部分都在前面的基础上增加内容。",
    ),
    ["setting-problem-and-solution"],
    [
      point(
        "naming-the-part",
        t("Naming the Part of a Text", "说出文本的组成部分"),
        t(
          "A long story is divided into **chapters**, each with a number and often a title. A poem is written in **lines**, rows of words that end where the poet chooses. Lines are grouped into **stanzas**, with a space between one stanza and the next.\n\nSo a line is one row, a stanza is a group of rows, and a chapter is a part of a story, not of a poem.",
          "较长的故事分成若干**章节**，每一章有编号，通常还有标题。诗是一行一行写的，**诗行**是在诗人选择的地方结束的一排文字。诗行组成**诗节**，诗节之间空一行。\n\n所以，诗行是一行，诗节是一组诗行，而章节是故事的部分，不是诗的部分。",
        ),
        askGenerator(partBank),
      ),
      point(
        "what-a-part-adds",
        t("What a Part Adds", "每部分增加了什么"),
        t(
          "Each chapter of a story **builds on** the one before. The first usually introduces the characters and the setting. A middle chapter brings the problem. The last one solves it.\n\nTo see what a chapter adds, ask what is new in it: new people and places, a new trouble, or the end of the trouble.",
          "故事的每一章都**建立在**前一章的基础上。第一章通常介绍角色和背景，中间的章节带来问题，最后一章解决问题。\n\n要看出一章增加了什么，就问问这一章有什么新内容：新的人物和地点，新的麻烦，还是麻烦的结束。",
        ),
        askGenerator(roleBank),
      ),
    ],
  ),
  topic(
    "what-a-poem-is-about",
    t("What a Poem Is About", "诗写的是什么"),
    t("A poem has a subject and a feeling, and its pictures in words show both.", "一首诗有主题和感受，诗中用文字描绘的画面表现了这两者。"),
    ["parts-of-stories-and-poems"],
    [
      point(
        "the-subject-of-a-poem",
        t("The Subject of a Poem", "诗的主题"),
        t(
          "The **subject** of a poem is what it is about. The title is the first clue, and the pictures in the lines are the others: boxes in every hall and pictures off the wall show that a poem is about moving out of a home.\n\nA good answer fits the whole poem, every stanza of it, and not just one word.",
          "诗的**主题**就是它写的内容。标题是第一个线索，诗行里的画面是其他线索：每个走廊里都是箱子、墙上的画都取下来了，说明这首诗写的是搬家。\n\n好的答案要符合整首诗、每一节诗，而不只是其中一个词。",
        ),
        askGenerator(subjectBank),
      ),
      point(
        "lines-that-show-the-feeling",
        t("Lines That Show the Feeling", "表现感受的诗行"),
        t(
          "A poem also has a **feeling**. Some lines only paint a picture of what is there: *The thunder crashes overhead*. Other lines show how the speaker feels about it, often by what the speaker does: *I pull the blanket to my chin* shows fear.\n\nTo find the feeling, look for the line where the speaker acts, wishes or says how they feel.",
          "诗还有**感受**。有些诗行只描绘眼前有什么：*The thunder crashes overhead*。另一些诗行表现说话人对它的感受，常常通过说话人的动作来表现：*I pull the blanket to my chin* 表现了害怕。\n\n要找出感受，就找说话人做了什么、希望什么或者说出自己感受的那一行。",
        ),
        askGenerator(feelingBank),
      ),
    ],
  ),
];
