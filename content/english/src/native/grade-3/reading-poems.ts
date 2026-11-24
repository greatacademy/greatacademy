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
    "The bold part is **a line**—one single row of words in a poem.\n\n**Check.** Count the bold rows: there is just one row of a poem (not a whole block of rows, and not a numbered book chapter).",
    "粗体部分是**一行诗**——诗里单独的一排文字。\n\n**检验。** 数一数加粗的行数：只有诗里的单单一排（既不是一整节多行，也不是长故事里有编号的章节）。",
  ],
  "a stanza": [
    "The bold part is **a stanza**—a group of poem lines set off by a blank line.\n\n**Check.** Look at how the lines are grouped: several poem lines sit together between blank spaces, forming one stanza rather than a single line or a story chapter.",
    "粗体部分是**一节诗**——由空行隔开的一组诗行。\n\n**检验。** 看版面结构：几行诗紧挨在一起、上下有空行隔开，组成一个诗节，而不是单行或故事章节。",
  ],
  "a chapter": [
    "The bold part is **a chapter**—one numbered section of a longer story.\n\n**Check.** Look at its heading: it carries a chapter number and title inside a book of stories, not lines of a poem.",
    "粗体部分是**一章**——较长故事里有编号的一个部分。\n\n**检验。** 看标题格式：它带有章号和章题，属于故事书，而不是诗行或诗节。",
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
    "The bold chapter **introduces the characters and the setting**.\n\n**Check.** Check where it sits and what happens in it: it opens the book before any trouble begins, telling who is in the story and where they are.",
    "粗体这一章**介绍角色和背景**。\n\n**检验。** 看它在全书的位置和内容：它开篇交代人物和地点，此时麻烦还没出现。",
  ],
  [
    "The bold chapter **brings the problem of the story**.\n\n**Check.** Compare it with the chapter before and after: the characters are already introduced, and now trouble strikes without being solved yet.",
    "粗体这一章**引出故事的问题**。\n\n**检验。** 对比前后章节：人物前面已交代完毕，这里突然出现麻烦且尚未解决。",
  ],
  [
    "The bold chapter **solves the problem of the story**.\n\n**Check.** Look at the ending of the summary: the earlier trouble is settled so the story can wrap up.",
    "粗体这一章**解决了故事的问题**。\n\n**检验。** 看这一章的结尾：前面的麻烦终于化解，故事可以圆满收尾。",
  ],
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
    `The poem is about **${poem.subject}**.\n\n**Check.** Check both the title and every stanza: the images across all lines connect to **${poem.subject}**, not to the other two ideas.`,
    `这首诗写的是 **${poem.subject}**。\n\n**检验。** 对照标题和每一节诗：全诗的画面都围绕着 **${poem.subject}**，而不是另外两个说法。`,
  ),
  whyNot: poem.wrongSubjects.map((w, idx) =>
    idx === 0
      ? t(
          `The poem's lines do not support "${w}"—check the title and images in both stanzas.`,
          `诗行里并没有写到“${w}”——再对照标题和两节诗里的画面。`,
        )
      : t(
          `"${w}" misses what the whole poem describes; every stanza points elsewhere.`,
          `“${w}”和整首诗描绘的主题对不上，各节诗指向的是别的内容。`,
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
      `The line *${right}* shows that the speaker feels **${poem.feeling[0]}**.\n\n**Check.** Ask *what does the speaker do or feel in this line?* Unlike the other lines that only describe scenery, *${right}* reveals the speaker's reaction.`,
      `*${right}* 这一行表现了说话人感到**${poem.feeling[1]}**。\n\n**检验。** 问自己：*这一行里说话人做了什么或感受到了什么？* 另两行只写景物，只有 *${right}* 透出了说话人的情绪反应。`,
    ),
    whyNot: poem.flatLines.map((_, idx) =>
      idx === 0
        ? t(
            "That line describes the scene outside, but it does not show how the speaker feels inside.",
            "这一行只描写了眼前的景物，没有表现出说话人内心的感受。",
          )
        : t(
            "That line names what is happening around the speaker without showing the speaker's own reaction.",
            "这一行只说出周围发生了什么，没有写出说话人自己的情绪反应。",
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
          "A long story is divided into **chapters**, each numbered and often titled. A poem is written in **lines** (single rows of words), grouped into **stanzas** separated by blank lines.\n\n> **Watch out.** Do not mix up one *line* with a whole *stanza*, and remember that poems never have *chapters*.",
          "长故事分成若干**章节**，每章有编号，常带标题。诗由一行行**诗行**组成，几行诗按空行分组成为**诗节**。\n\n> **注意。** 不要把单行*诗行*和整组*诗节*混淆，而且诗是没有*章节*的。",
        ),
        askGenerator(partBank),
      ),
      point(
        "what-a-part-adds",
        t("What a Part Adds", "每部分增加了什么"),
        t(
          "Each chapter of a story **builds on** the one before: Chapter 1 usually introduces characters and setting, a middle chapter brings the problem, and the final chapter solves it.\n\n> **Watch out.** Read what actually changes in the bold chapter—do not guess from the chapter number alone.",
          "故事的每一章都在前一章基础上推进：第一章常交代人物和背景，中间章引出麻烦，末尾章解决问题。\n\n> **注意。** 要看粗体那一章实际推进了什么，不要只看章号瞎猜。",
        ),
        askGenerator(roleBank),
      ),
    ],
    14,
    t(
      "Open a chapter book and open a book of poems: they even *look* different on the page! Knowing how chapters, lines, and stanzas are built helps you see how each piece moves a story or poem forward.",
      "翻开一本章节故事书和一本诗集，它们连版面都长得不一样！分清章节、诗行和诗节，就能看懂每一部分是如何推进全篇的。",
    ),
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
          "The **subject** of a poem is what the whole poem is about. Combine the title with the word pictures across every stanza—for instance, boxes in the hall and bare walls point to moving house.\n\n> **Watch out.** A good subject fits *every* stanza, not just one stray word.",
          "诗的**主题**是整首诗写的内容。把标题和每一节诗里的画面合起来看——比如走廊里的箱子和空空的墙，合起来说明写的是搬家。\n\n> **注意。** 正确的主题要能覆盖*每一节*诗，而不能只抓个别字眼。",
        ),
        askGenerator(subjectBank),
      ),
      point(
        "lines-that-show-the-feeling",
        t("Lines That Show the Feeling", "表现感受的诗行"),
        t(
          "Poems pair scenery lines (*The thunder crashes overhead*) with feeling lines where the speaker reacts (*I pull the blanket to my chin* shows fear). Look for what the speaker does, wishes, or feels.\n\n> **Watch out.** A vivid weather or scenery line may set the mood, but look for the line that shows the *speaker's* own feeling.",
          "诗里既有写景的诗行（*The thunder crashes overhead*），也有通过说话人反应表现感受的诗行（*I pull the blanket to my chin* 表现害怕）。重点找说话人做了什么、希望什么或感受到了什么。\n\n> **注意。** 写景的句子虽然生动，但要选出直接流露*说话人*感受的那一行。",
        ),
        askGenerator(feelingBank),
      ),
    ],
    14,
    t(
      "A short poem can paint a whole season in just eight lines—and let you feel whether the speaker is thrilled, cozy, or scared. Let's read poems for both their subject and the lines that carry their feeling.",
      "一首短短八行的小诗，就能画出一个完整的季节，还能让你体会到说话人是兴奋、惬意还是害怕。这节课我们来读懂诗的主题和藏着感受的诗行。",
    ),
  ),
];
