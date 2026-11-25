// Grades 6 to 8: the words of each unit's theme, ten to a batch: myths, tone, Rome, argument, ecosystems, character,
// technology and exploration.

import type { TopicDef } from "@ga/content";
import { t } from "@ga/content";
import type { WordBatch } from "../../pack.ts";
import { type BatchSpec, batchTopicWithPool, batchWords, wordPool } from "../batch.ts";

const fromClues = [{ topic: "context-clues", weight: 0.1 }] as const;

const myths: BatchSpec = {
  id: "words-from-myths",
  title: t("Words from Myths", "源自神话的词"),
  summary: t(
    "Ten everyday words that began in Greek myths: echo, panic, chaos, mentor, labyrinth and more.",
    "十个源自希腊神话的常用词：echo、panic、chaos、mentor、labyrinth 等。",
  ),
  intro: t(
    "In the dark **labyrinth**, Theo's footsteps came back to him as an **echo**, and **panic** rose in his chest until he remembered his **mentor**'s advice: keep one hand on the wall. These words, born in Greek myths, help you name feelings, journeys, places and challenges in everyday English.",
    "在漆黑的迷宫（**labyrinth**）里，西奥的脚步声化作回声（**echo**）传回耳边，一阵恐慌（**panic**）涌上心头，直到他想起导师（**mentor**）的叮嘱：一只手始终扶着墙。这些源自希腊神话的词，帮你在日常英语里说出感受、旅程、地方和挑战。",
  ),
  watchOut: {
    meanings: t(
      "**Titanic** describes something huge in size, while **herculean** describes a job that needs huge effort; a ship can be titanic, but scrubbing its whole deck by hand is herculean.",
      "**titanic** 形容东西本身体积巨大，**herculean** 形容一件事需要极大的力气；轮船可以是 titanic 的，而亲手擦洗整个甲板才是 herculean 的。",
    ),
    use: t(
      "**Chaos** is disorder in a place, and **panic** is the fear inside a person; a messy room is in chaos, but the frightened boy who cannot find the door feels panic.",
      "**chaos** 是某个地方乱成一团，**panic** 是人心里的恐惧；乱糟糟的房间处于 chaos，找不到门的害怕男孩感到的是 panic。",
    ),
    spelling: t(
      "**Labyrinth** hides a y after lab-, **odyssey** has a y and a double s, and **panic** adds a k before -ed and -ing: panicked, panicking.",
      "**labyrinth** 在 lab- 后藏着 y；**odyssey** 有 y 还双写 s；**panic** 加 -ed、-ing 前要先加 k：panicked、panicking。",
    ),
  },
  domain: ["myths and the words they gave us", "神话及其留下的词语"],
  prerequisites: ["context-clues"],
  encompasses: fromClues,
  words: [
    {
      word: "echo",
      forms: ["echoes", "echoed", "echoing"],
      meaning: ["a sound that bounces back so that you hear it again", "回声，反射回来的声音"],
      sentences: [
        "When we shouted into the canyon, our voices came back as a faint ___.",
        "In the empty gym, we heard the ___ of each footstep bounce back from the far wall.",
        "She called her brother's name in the cave and heard only her own ___.",
      ],
      confusions: ["siren", "chaos"],
      clues: [
        "voices shouted into a canyon coming back faint",
        "each footstep in an empty gym bouncing back from the far wall",
        "a name called in a cave that came back to the caller",
      ],
      contrast: [
        "an echo is your own sound coming back; a siren is a machine's loud warning wail",
        "echo 是自己的声音反射回来；siren 是机器发出的响亮警报声",
      ],
      conflicts: [
        [
          "siren is a loud warning sound made by a device, not a sound that bounces back to the one who made it",
          "siren 是装置发出的响亮警报声，不是反射回发声者耳中的声音",
        ],
        [
          "chaos is complete disorder, not a sound heard again after it bounces off a surface",
          "chaos 是完全的混乱，不是碰到物体后又被听到的声音",
        ],
      ],
      spelling: ["ech · o", "the ch that sounds like k, and the plural echoes with -es", "ch 读作 k，复数 echoes 要加 -es"],
    },
    {
      word: "panic",
      forms: ["panicked", "panicking", "panics"],
      meaning: ["a sudden fear so strong that people stop thinking clearly", "恐慌，使人无法冷静思考的突然恐惧"],
      sentences: [
        "When the lights went out, Mia's heart pounded, and in her ___ she forgot where the exits were.",
        "Feeling a rush of ___, the lost hiker stopped thinking clearly and ran blindly into the trees.",
        "Terrified by the smoke, he ran the wrong way in his ___ and missed the exit.",
      ],
      confusions: ["chaos", "melancholy"],
      clues: [
        "a pounding heart that made Mia forget where the exits were",
        "a rush of fear that sent a lost hiker running blindly into the trees",
        "a man terrified by smoke who ran the wrong way and missed the exit",
      ],
      contrast: [
        "panic is a sudden fear inside a person; chaos is the disorder around them",
        "panic 是人内心突然的恐惧；chaos 是周围的混乱",
      ],
      conflicts: [
        [
          "chaos is disorder in a place or a crowd, not a fear felt inside one person's mind",
          "chaos 是某个地方或人群的混乱，不是一个人心里的恐惧",
        ],
        [
          "melancholy is a quiet, lasting sadness, not a sudden fear that makes someone act without thinking",
          "melancholy 是安静而持久的忧伤，不是让人不假思索乱跑的突然恐惧",
        ],
      ],
      spelling: ["pan · ic", "a k is added before -ed and -ing: panicked, panicking", "加 -ed、-ing 时要先加 k：panicked、panicking"],
    },
    {
      word: "titanic",
      meaning: ["enormous in size, strength or importance", "巨大的，力量或规模极大的"],
      sentences: [
        "The ___ statue was so tall that visitors standing at its feet looked like ants.",
        "The ___ tree trunk was so wide that ten children holding hands could not reach around it.",
        "Next to the ___ cargo ship, the tugboats pulling it looked like toys.",
      ],
      confusions: ["herculean", "perilous"],
      clues: [
        "a statue so tall that visitors at its feet looked like ants",
        "a tree trunk too wide for ten children holding hands to reach around",
        "a cargo ship so big that its tugboats looked like toys",
      ],
      contrast: [
        "titanic means huge in size or strength; herculean means needing huge effort",
        "titanic 指体积或力量巨大；herculean 指需要极大的力气",
      ],
      conflicts: [
        [
          "herculean describes a task that needs enormous effort, not a thing that is simply enormous in size",
          "herculean 形容需要极大力气的任务，不是形容本身体积巨大的东西",
        ],
        ["perilous means full of danger, not huge in size", "perilous 是危险重重，不是体积巨大"],
      ],
      spelling: ["ti · tan · ic", "the word *Titan* inside it, and the -ic ending", "里面藏着 *Titan*，结尾是 -ic"],
    },
    {
      word: "odyssey",
      forms: ["odysseys"],
      meaning: ["a long journey full of adventures and changes", "漫长而充满经历的旅程"],
      sentences: [
        "Their trip across three countries by bus turned into a month-long ___.",
        "The book follows one girl's ___ on foot and by train, from a small farm to the stage of a great city.",
        "After a long ___ of delayed flights, missed trains and lost bags, we finally reached Grandma's house.",
      ],
      confusions: ["voyage", "labyrinth"],
      clues: [
        "a bus trip across three countries that stretched to a month",
        "one girl's journey on foot and by train from a small farm to a city stage",
        "a trip of delayed flights, missed trains and lost bags",
      ],
      contrast: [
        "an odyssey is a long journey full of adventures and changes; a voyage is a long trip by sea or through space",
        "odyssey 是充满经历和变化的漫长旅程；voyage 是海上或太空中的长途旅行",
      ],
      conflicts: [
        [
          "voyage is a long journey by ship or spacecraft, not a winding trip full of changes made by bus, train or plane",
          "voyage 是乘船或飞船的长途航行，不是坐汽车、火车或飞机、一路波折的旅程",
        ],
        [
          "labyrinth is a maze of winding paths, not a journey from one place to another",
          "labyrinth 是曲折的迷宫，不是从一地到另一地的旅程",
        ],
      ],
      spelling: ["od · ys · sey", "the y after od- and the double s before -ey", "od- 后是 y，-ey 前双写 s"],
    },
    {
      word: "nemesis",
      meaning: ["an enemy or rival that you cannot seem to beat", "宿敌，似乎永远打不败的对手"],
      sentences: [
        "The detective finally caught his old ___, the thief who had escaped him for years.",
        "Our soccer team has lost to the school across the river every year for a decade; that school is our ___.",
        "Math was Leo's ___ until a new teacher showed him a different way to think about it.",
      ],
      confusions: ["mentor", "gladiator"],
      clues: [
        "a detective finally catching the thief who had escaped him for years",
        "a school across the river that has beaten our team every year for a decade",
        "a school subject that defeated Leo until a new teacher helped",
      ],
      contrast: [
        "a nemesis is the rival you cannot seem to beat; a mentor is the guide who helps you",
        "nemesis 是似乎永远打不败的对手；mentor 是帮助你的导师",
      ],
      conflicts: [
        [
          "mentor is a trusted guide who helps you, not a rival you keep failing to beat",
          "mentor 是帮助你的可靠导师，不是你屡战屡败的对手",
        ],
        [
          "gladiator is a fighter trained for a Roman arena, not a rival you can never seem to defeat",
          "gladiator 是在罗马竞技场搏斗的人，不是你总也打不败的对手",
        ],
      ],
      spelling: ["nem · e · sis", "three short vowels in a row: e, e, i", "连续三个短元音：e、e、i"],
    },
    {
      word: "chaos",
      meaning: ["complete confusion and disorder", "混乱，完全无序的状态"],
      sentences: [
        "After the storm, the garage was in total ___: tools, bikes and boxes lay piled everywhere.",
        "My little brother's room is pure ___, with toys, socks and books scattered across every inch of the floor.",
        "The ancient Greeks told of a time of ___ before the world had any order or shape.",
      ],
      confusions: ["panic", "labyrinth"],
      clues: [
        "a garage with tools, bikes and boxes piled everywhere after a storm",
        "a bedroom with toys, socks and books scattered over the floor",
        "the time before the world had any order or shape in Greek myth",
      ],
      contrast: ["chaos is complete disorder; panic is a sudden fear", "chaos 是完全的混乱；panic 是突然的恐惧"],
      conflicts: [
        ["panic is a sudden fear felt by people, not a mess with no order at all", "panic 是人感到的突然恐惧，不是毫无秩序的一团糟"],
        [
          "labyrinth is a maze built with winding paths on purpose, not a state of total disorder",
          "labyrinth 是特意建造的曲折迷宫，不是完全无序的状态",
        ],
      ],
      spelling: ["cha · os", "the ch that sounds like k, and the a and o said apart", "ch 读作 k，a 和 o 分开读"],
    },
    {
      word: "labyrinth",
      forms: ["labyrinths"],
      meaning: ["a maze of winding paths that is hard to find your way through", "迷宫，难以找到出路的曲折通道"],
      sentences: [
        "The old city's narrow streets twisted into one great ___, and we got lost within minutes.",
        "In the myth, a monster lived at the center of the ___ that no one could escape.",
        "The hospital's basement was one long ___ of hallways that all looked the same.",
      ],
      confusions: ["odyssey", "chaos"],
      clues: [
        "old city streets twisting so that we got lost in minutes",
        "the place at whose center a monster of myth lived",
        "a hospital basement of hallways that all looked the same",
      ],
      contrast: ["a labyrinth is a maze you walk through; chaos is plain disorder", "labyrinth 是要穿行的迷宫；chaos 只是一片混乱"],
      conflicts: [
        [
          "odyssey is a long journey full of adventures, not a place of winding paths where you get lost",
          "odyssey 是充满经历的漫长旅程，不是让人迷路的曲折通道",
        ],
        ["chaos is complete disorder, not a set of paths built to twist and turn", "chaos 是完全的混乱，不是修得弯弯曲曲的通道"],
      ],
      spelling: ["lab · y · rinth", "the y in the middle and the -inth ending", "中间是 y，结尾是 -inth"],
    },
    {
      word: "herculean",
      meaning: ["needing enormous strength or effort", "需要极大力气或努力的"],
      sentences: [
        "Scrubbing every one of the school's three hundred desks by hand was a ___ task that took the whole summer.",
        "Pushing the stalled truck up the steep hill took a ___ amount of strength from all six of us.",
        "Reading all two thousand books in the library in one summer would be a ___ challenge, even for the fastest reader.",
      ],
      confusions: ["perilous", "conscientious"],
      clues: [
        "scrubbing three hundred school desks by hand over a whole summer",
        "six people pushing a stalled truck up a steep hill",
        "reading two thousand library books in one summer",
      ],
      contrast: ["herculean means needing huge effort; perilous means full of danger", "herculean 指需要极大的力气；perilous 指危险重重"],
      conflicts: [
        ["perilous means full of danger, not needing enormous strength or effort", "perilous 是危险重重，不是需要极大的力气或努力"],
        [
          "conscientious describes a careful person who does work well, not a job so huge it needs enormous effort",
          "conscientious 形容认真做事的人，不是形容大得要费极大力气的活儿",
        ],
      ],
      spelling: ["her · cu · le · an", "the -ean ending, from the hero Hercules", "结尾是 -ean，来自英雄 Hercules"],
    },
    {
      word: "mentor",
      forms: ["mentors"],
      meaning: ["a wise, trusted person who guides someone younger or less experienced", "导师，指导年轻人或新手的可靠长者"],
      sentences: [
        "The old carpenter became Sam's ___, teaching him to build his first table.",
        "Every new nurse at the hospital is paired with a ___ who has worked there for years.",
        "Looking back, she said her music teacher was the ___ who guided her toward a life in music.",
      ],
      confusions: ["nemesis", "gladiator"],
      clues: [
        "an old carpenter teaching Sam to build his first table",
        "an experienced nurse paired with each new nurse",
        "a music teacher who guided a girl toward a life in music",
      ],
      contrast: ["a mentor guides and helps you; a nemesis keeps defeating you", "mentor 指导和帮助你；nemesis 一次次打败你"],
      conflicts: [
        ["nemesis is a rival you cannot beat, not a trusted guide who teaches you", "nemesis 是打不败的对手，不是教导你的可靠导师"],
        [
          "gladiator is a fighter trained for the arena, not a wise guide for someone less experienced",
          "gladiator 是为竞技场训练的斗士，不是指导新手的智者",
        ],
      ],
      spelling: ["men · tor", "the -or ending, not -er", "结尾是 -or，不是 -er"],
    },
    {
      word: "siren",
      forms: ["sirens"],
      meaning: ["a device that makes a loud, rising warning sound", "警报器，发出尖锐警报声的装置"],
      sentences: [
        "The ambulance switched on its ___, and the loud, rising wail made the cars pull over.",
        "When the tornado ___ began to wail, everyone hurried into the basement.",
        "Every Monday at noon, the town tests the warning ___ on the roof of the fire station.",
      ],
      confusions: ["echo", "panic"],
      clues: [
        "an ambulance's loud, rising wail making cars pull over",
        "a tornado warning wailing as everyone hurried to the basement",
        "a warning device tested each Monday on a fire station roof",
      ],
      contrast: ["a siren is a device's warning wail; an echo is a sound coming back", "siren 是装置发出的警报声；echo 是传回来的声音"],
      conflicts: [
        [
          "echo is a sound that bounces back off a wall or cliff, not a loud warning made by a device",
          "echo 是从墙壁或悬崖反射回来的声音，不是装置发出的响亮警报",
        ],
        ["panic is a sudden fear that people feel, not a machine that sounds a warning", "panic 是人感到的突然恐惧，不是发出警报的机器"],
      ],
      spelling: ["si · ren", "the single r and the -en ending", "单写 r，结尾是 -en"],
    },
  ],
};

const tone: BatchSpec = {
  id: "words-for-tone-and-feeling",
  title: t("Words for Tone and Feeling", "描述语气与情感的词"),
  summary: t(
    "Ten words for the feeling of a poem, a scene or a person: wistful, somber, jubilant, ominous and more.",
    "十个描述诗歌、场景或人物情感的词：wistful、somber、jubilant、ominous 等。",
  ),
  intro: t(
    "On the last day of summer, the **exuberant** children raced down to the beach, Grandma watched them with a **wistful** smile, and **ominous** clouds over the sea hinted at rain. These words help you name the feeling of a poem, a scene or a person.",
    "暑假最后一天，兴高采烈的（**exuberant**）孩子们冲向海滩，奶奶带着一丝惆怅的（**wistful**）微笑望着他们，海面上不祥的（**ominous**）乌云预示着要下雨。这些词帮你说出一首诗、一个场景或一个人的情感。",
  ),
  watchOut: {
    meanings: t(
      "**Wistful** longs for something you cannot have, while **nostalgic** longs for something you once had; a bike in a shop window makes you wistful, an old photo of your first home makes you nostalgic.",
      "**wistful** 是渴望得不到的东西，**nostalgic** 是怀念曾经拥有的东西；橱窗里买不起的自行车让人 wistful，老家的旧照片让人 nostalgic。",
    ),
    use: t(
      "**Melancholy** is a noun for a lasting sadness, so it follows words like *a feeling of* or *filled with*; the other nine words are adjectives that describe a person, a scene or a mood.",
      "**melancholy** 在这里是名词，表示持久的忧伤，所以跟在 *a feeling of*、*filled with* 之类的词后面；其余九个词都是形容词，用来描写人、场景或氛围。",
    ),
    spelling: t(
      "**Somber** ends in -ber in American spelling, **whimsical** keeps a silent h after w, and **exuberant** and **jubilant** both end in -ant.",
      "**somber** 美式拼写结尾是 -ber；**whimsical** 的 w 后有不发音的 h；**exuberant** 和 **jubilant** 都以 -ant 结尾。",
    ),
  },
  domain: ["the tone and mood of poems and stories", "诗歌和故事的语气与氛围"],
  prerequisites: ["context-clues"],
  encompasses: fromClues,
  words: [
    {
      word: "wistful",
      meaning: ["gently sad and longing for something you cannot have", "带着淡淡忧伤地渴望得不到的东西的"],
      sentences: [
        "She gave a ___ look at the bicycles in the shop window, knowing she could not afford one.",
        "Watching the other children leave for summer camp, Ben felt ___ and a little left out.",
        "The poem ends on a ___ note, as the speaker watches a ship he will never sail on.",
      ],
      confusions: ["nostalgic", "jubilant"],
      clues: [
        "a girl gazing at shop-window bicycles she could not afford",
        "a boy watching other children leave for summer camp without him",
        "a poem's speaker watching a ship he will never sail on",
      ],
      contrast: [
        "wistful longs for what you cannot have; nostalgic longs for what you once had",
        "wistful 是渴望得不到的东西；nostalgic 是怀念曾经拥有的东西",
      ],
      conflicts: [
        [
          "nostalgic means longing for the past, not sadly wanting something you have never had",
          "nostalgic 是怀念过去，不是惆怅地渴望从未拥有的东西",
        ],
        [
          "jubilant means full of joy at a success, not gently sad about something out of reach",
          "jubilant 是因成功而欢欣，不是为够不着的东西淡淡忧伤",
        ],
      ],
      spelling: ["wist · ful", "the -ful ending with one l", "结尾 -ful 只有一个 l"],
    },
    {
      word: "somber",
      meaning: ["serious, dark and sad", "严肃而阴沉的，忧郁的"],
      sentences: [
        "The mood at the funeral was quiet and ___.",
        "Dressed in ___ gray suits, the judges filed silently into the courtroom.",
        "The news of the accident left the whole class silent and ___ for the rest of the day.",
      ],
      confusions: ["whimsical", "exuberant"],
      clues: [
        "a quiet funeral",
        "judges in gray suits filing silently into a courtroom",
        "a class left silent all day by news of an accident",
      ],
      contrast: ["somber is serious and dark; whimsical is playful and light", "somber 严肃而阴沉；whimsical 俏皮而轻快"],
      conflicts: [
        ["whimsical means playful and fanciful, not serious and dark", "whimsical 是俏皮奇特，不是严肃阴沉"],
        ["exuberant means bursting with cheerful energy, not quiet, serious and sad", "exuberant 是充满欢快的活力，不是安静、严肃而忧伤"],
      ],
      spelling: ["som · ber", "the American -ber ending (British spelling: sombre)", "美式结尾 -ber（英式拼作 sombre）"],
    },
    {
      word: "jubilant",
      meaning: ["full of joy because of a success or a victory", "因成功或胜利而欢欣鼓舞的"],
      sentences: [
        "The ___ fans poured onto the field after their team won the championship.",
        "Her ___ shout told us she had passed the exam.",
        "The town was ___ when the lost children were found safe.",
      ],
      confusions: ["bleak", "somber"],
      clues: [
        "fans pouring onto a field after a championship win",
        "a shout after passing an exam",
        "a town whose lost children were found safe",
      ],
      contrast: ["jubilant is joy at a success; somber is serious sadness", "jubilant 是因成功而欢欣；somber 是严肃的忧伤"],
      conflicts: [
        ["bleak means cold, empty and without hope, not joyful about a success", "bleak 是荒凉而没有希望，不是因成功而喜悦"],
        ["somber means serious, dark and sad, not bursting with the joy of a victory", "somber 是严肃、阴沉、忧伤，不是充满胜利的喜悦"],
      ],
      spelling: ["ju · bi · lant", "the -ant ending, not -ent", "结尾是 -ant，不是 -ent"],
    },
    {
      word: "bleak",
      meaning: ["cold, empty and without hope or comfort", "荒凉的，冷清而没有希望的"],
      sentences: [
        "The ___ moor stretched for miles, with icy wind and no tree or house to shelter in.",
        "After the factory closed, the future of the little town looked ___.",
        "January brought short, ___ days of gray sky and freezing wind.",
      ],
      confusions: ["serene", "whimsical"],
      clues: [
        "a moor of icy wind with no tree or house for shelter",
        "a little town's future after its factory closed",
        "short January days of gray sky and freezing wind",
      ],
      contrast: ["bleak is cold and hopeless; serene is calm and peaceful", "bleak 荒凉无望；serene 宁静平和"],
      conflicts: [
        ["serene means calm and peaceful, not cold, empty and without hope", "serene 是宁静平和，不是荒凉冷清、没有希望"],
        ["whimsical means playful and fanciful, not cold and hopeless", "whimsical 是俏皮奇特，不是寒冷无望"],
      ],
      spelling: ["bleak", "the ea that says a long e, as in *speak*", "ea 发长音 e，同 *speak*"],
    },
    {
      word: "serene",
      meaning: ["calm, peaceful and untroubled", "宁静的，平和安详的"],
      sentences: [
        "The lake was ___ at dawn, without a single ripple on its surface.",
        "Even during the storm, the old captain's face stayed ___.",
        "The poem paints the ___ scene of snow falling softly on a sleeping village.",
      ],
      confusions: ["ominous", "exuberant"],
      clues: [
        "a lake at dawn without a single ripple",
        "an old captain's face that stayed calm through a storm",
        "snow falling softly on a sleeping village",
      ],
      contrast: ["serene is peaceful; ominous hints at trouble ahead", "serene 平和安详；ominous 预示麻烦将至"],
      conflicts: [
        ["ominous means warning that something bad is coming, not calm and untroubled", "ominous 是预示坏事要来，不是平静安详"],
        ["exuberant means full of lively, excited energy, not quiet and peaceful", "exuberant 是充满兴奋的活力，不是安静平和"],
      ],
      spelling: ["se · rene", "the -ene ending with a silent final e", "结尾 -ene，末尾 e 不发音"],
    },
    {
      word: "ominous",
      meaning: ["suggesting that something bad is about to happen", "不祥的，预示坏事将要发生的"],
      sentences: [
        "Dark clouds piled up over the hills, and the ___ rumble of distant thunder warned us to head home.",
        "In the dark, empty house, the ___ creak of the stairs told her that someone was sneaking up.",
        'The letter\'s ___ last line said only, "We need to talk about your future."',
      ],
      confusions: ["serene", "nostalgic"],
      clues: [
        "a rumble of distant thunder under piling dark clouds",
        "a stair creak in a dark, empty house as someone sneaked up",
        'a letter ending with "We need to talk about your future"',
      ],
      contrast: ["ominous warns of something bad ahead; serene feels safe and calm", "ominous 预示坏事将至；serene 让人感到安宁"],
      conflicts: [
        ["serene means calm and untroubled, not warning of trouble to come", "serene 是平静安详，不是预示麻烦要来"],
        [
          "nostalgic means fondly remembering the past, not hinting that something bad lies ahead",
          "nostalgic 是深情怀念过去，不是暗示前面有坏事",
        ],
      ],
      spelling: ["om · i · nous", "the single m and the -ous ending", "单写 m，结尾是 -ous"],
    },
    {
      word: "whimsical",
      meaning: ["playful and unusual in a fanciful, amusing way", "异想天开的，俏皮而奇特的"],
      sentences: [
        "The children's book is full of ___ creatures, like a cat that rides a teapot.",
        "Her ___ garden had a gnome on every rock and a bathtub full of flowers.",
        "The poem has a ___ tone, imagining the moon as a lost button from a giant's coat.",
      ],
      confusions: ["somber", "bleak"],
      clues: [
        "a cat riding a teapot in a children's book",
        "a garden with a gnome on every rock and a bathtub of flowers",
        "the moon imagined as a giant's lost button",
      ],
      contrast: ["whimsical is playful and odd; somber is serious and sad", "whimsical 俏皮奇特；somber 严肃忧伤"],
      conflicts: [
        ["somber means serious, dark and sad, not playful and fanciful", "somber 是严肃、阴沉、忧伤，不是俏皮奇特"],
        ["bleak means cold and without hope, not amusing and full of fancy", "bleak 是荒凉无望，不是有趣又充满奇想"],
      ],
      spelling: ["whim · si · cal", "the silent h after w, and the -ical ending", "w 后的 h 不发音，结尾是 -ical"],
    },
    {
      word: "nostalgic",
      meaning: ["fondly remembering and longing for the past", "怀旧的，深情怀念过去的"],
      sentences: [
        "Looking at old photos of his first home made Grandpa ___.",
        "The smell of fresh bread always makes me ___ for my aunt's kitchen.",
        "The song is ___, looking back on long summer evenings of childhood.",
      ],
      confusions: ["ominous", "jubilant"],
      clues: [
        "old photos of Grandpa's first home",
        "the smell of bread that recalls an aunt's kitchen",
        "a song looking back on childhood summer evenings",
      ],
      contrast: ["nostalgic looks back fondly; ominous looks ahead with dread", "nostalgic 深情回望过去；ominous 让人对未来感到不安"],
      conflicts: [
        ["ominous means hinting that something bad is coming, not fondly remembering the past", "ominous 是暗示坏事要来，不是深情怀念过去"],
        ["jubilant means full of joy at a victory, not longing for days gone by", "jubilant 是因胜利而欢欣，不是怀念逝去的日子"],
      ],
      spelling: ["nos · tal · gic", "the -gic ending, with a soft g as in *magic*", "结尾 -gic，g 发软音，同 *magic*"],
    },
    {
      word: "melancholy",
      meaning: ["a deep, quiet sadness that lasts", "持久而深沉的忧郁"],
      sentences: [
        "A feeling of ___ settled over the house in the weeks after the dog died.",
        "The slow violin music filled the room with ___.",
        "The poet writes of the ___ of autumn, when every leaf seems to say goodbye.",
      ],
      confusions: ["panic", "chaos"],
      clues: ["the weeks after the family dog died", "slow violin music filling a room", "autumn leaves that seem to say goodbye"],
      contrast: ["melancholy is a slow, lasting sadness; panic is a sudden fear", "melancholy 是缓慢持久的忧伤；panic 是突然的恐惧"],
      conflicts: [
        ["panic is a sudden, wild fear, not a deep, quiet sadness that lasts", "panic 是突然的极度恐惧，不是深沉安静而持久的忧伤"],
        ["chaos is complete disorder, not a quiet, lasting sadness", "chaos 是完全的混乱，不是安静持久的忧伤"],
      ],
      spelling: ["mel · an · chol · y", "the ch that sounds like k, and the -oly ending", "ch 读作 k，结尾是 -oly"],
    },
    {
      word: "exuberant",
      meaning: ["full of energy, excitement and cheerfulness", "精力充沛的，兴高采烈的"],
      sentences: [
        "The ___ puppy leaped and spun in circles when the children came home.",
        "The dancers' ___ performance, all fast steps and laughing faces, brought the audience to its feet.",
        "After a week of rain, the ___ kids raced outside to splash in the sunshine.",
      ],
      confusions: ["somber", "serene"],
      clues: [
        "a puppy leaping and spinning when the children came home",
        "a dance of fast steps and laughing faces",
        "kids racing out to splash in the sun after a week of rain",
      ],
      contrast: ["exuberant is lively and excited; serene is calm and still", "exuberant 活泼兴奋；serene 平静安宁"],
      conflicts: [
        ["somber means serious, dark and sad, not bursting with cheerful energy", "somber 是严肃阴沉、忧伤，不是充满欢快的活力"],
        ["serene means calm and still, not full of excited, lively energy", "serene 是平静安宁，不是充满兴奋活泼的劲头"],
      ],
      spelling: ["ex · u · ber · ant", "the x before u, and the -ant ending", "x 后接 u，结尾是 -ant"],
    },
  ],
};

const rome: BatchSpec = {
  id: "words-of-ancient-rome",
  title: t("Words of Ancient Rome", "古罗马的词汇"),
  summary: t(
    "Ten words for the government, army and city of ancient Rome: republic, senate, consul, aqueduct and more.",
    "十个关于古罗马政府、军队和城市的词：republic、senate、consul、aqueduct 等。",
  ),
  intro: t(
    "In the busy **forum**, a **citizen** stood on a platform and argued that the **senate** should pay for a new **aqueduct**, while a **legion** marched past toward the northern border. These words help you read about how ancient Rome was governed, defended and built.",
    "在热闹的广场（**forum**）上，一位公民（**citizen**）站在台上，主张元老院（**senate**）出钱修一条新的引水渠（**aqueduct**），一支军团（**legion**）正从旁边开往北方边境。这些词帮你读懂古罗马是如何治理、防守和建设的。",
  ),
  watchOut: {
    meanings: t(
      "A **republic** chooses its leaders, while an **empire** is ruled by one power over many lands; Rome had two yearly **consuls** as a republic before it became an empire under one **emperor**.",
      "**republic** 由公民选出领导人，**empire** 是一个强权统治众多地区；罗马作为共和国时每年有两位 **consul**，后来才变成由一位 **emperor** 统治的帝国。",
    ),
    use: t(
      "The **senate** is a council of people, while the **forum** is a place, an open square; people meet and trade *in* the forum, but lawmakers sit *in* the senate to debate.",
      "**senate** 是由人组成的议事机构，**forum** 是一个地方，一片露天广场；人们在 forum 里集会、做买卖，而议员们在 senate 里辩论。",
    ),
    spelling: t(
      "**Aqueduct** starts aque-, not aqua-; **emperor** and **gladiator** end in -or; and **legion** has a g that sounds like j.",
      "**aqueduct** 开头是 aque-，不是 aqua-；**emperor** 和 **gladiator** 结尾是 -or；**legion** 里的 g 读作 j。",
    ),
  },
  domain: ["ancient Rome", "古罗马"],
  prerequisites: ["context-clues"],
  encompasses: fromClues,
  words: [
    {
      word: "republic",
      forms: ["republics"],
      meaning: ["a state ruled by leaders that citizens choose, with no king", "共和国，由公民选出领导人、没有国王的国家"],
      sentences: [
        "After driving out their last king, the Romans formed their ___, a state ruled by leaders the citizens elected.",
        "In any ___, the people choose who will govern them for a fixed time.",
        "Because its people elect their president and it has no king, France is officially called the French ___.",
      ],
      confusions: ["empire", "forum"],
      clues: [
        "Romans driving out their last king and electing leaders",
        "people choosing who governs them for a fixed time",
        "France, whose people elect a president and have no king",
      ],
      contrast: [
        "a republic's citizens elect their leaders; an empire is ruled by one power over many lands",
        "republic 由公民选举领导人；empire 由一个强权统治众多地区",
      ],
      conflicts: [
        [
          "empire is a group of lands ruled by one powerful ruler or state, not a state whose citizens choose their leaders",
          "empire 是由一个强大统治者或国家统治的众多地区，不是由公民选领导人的国家",
        ],
        [
          "forum is a public square in a Roman town, not a whole state with elected leaders",
          "forum 是罗马城镇里的公共广场，不是有民选领导人的国家",
        ],
      ],
      spelling: ["re · pub · lic", "the -ic ending with no k", "结尾是 -ic，没有 k"],
    },
    {
      word: "senate",
      forms: ["senates", "senator", "senators"],
      meaning: ["a council of leaders who debate and help make a state's laws", "元老院，参议院，讨论并参与制定法律的议事机构"],
      sentences: [
        "In Rome, the ___ was a council of powerful men who advised the consuls and debated the laws.",
        "Three hundred elected members debated the new law in the ___ for three days and then voted to pass it.",
        "Members of the Roman ___ wore togas with a broad purple stripe as they met to debate the laws.",
      ],
      confusions: ["legion", "forum"],
      clues: [
        "a council of powerful men advising the consuls and debating laws",
        "three hundred members debating a law for three days before a vote",
        "toga-wearing members meeting to debate the laws",
      ],
      contrast: [
        "the senate is a council of lawmakers; the forum is the square where people gathered",
        "senate 是立法者组成的议事机构；forum 是人们聚集的广场",
      ],
      conflicts: [
        [
          "legion is a unit of about five thousand soldiers, not a council that debates laws",
          "legion 是约五千名士兵组成的军队单位，不是辩论法律的议事机构",
        ],
        [
          "forum is an open public square for markets and meetings, not a council of lawmakers",
          "forum 是用于集市和集会的露天广场，不是立法者的议事机构",
        ],
      ],
      spelling: ["sen · ate", "the -ate ending, said like *it*", "结尾 -ate，读音近 *it*"],
    },
    {
      word: "empire",
      forms: ["empires"],
      meaning: ["a group of lands and peoples ruled by one powerful ruler or state", "帝国，由一个强大统治者或国家统治的众多地区"],
      sentences: [
        "Under its emperors, the Roman ___ stretched from Britain to Egypt.",
        "By conquering one land after another, the ___ came to rule over many peoples who had once governed themselves.",
        "When Augustus took power alone, Rome became the ___ that one man ruled until his death.",
      ],
      confusions: ["republic", "legion"],
      clues: [
        "Roman lands stretching from Britain to Egypt under emperors",
        "one power conquering many peoples who once governed themselves",
        "Rome under Augustus, ruled by one man until his death",
      ],
      contrast: [
        "an empire is ruled by one power; a republic by leaders its citizens elect",
        "empire 由一个强权统治；republic 由公民选出的领导人治理",
      ],
      conflicts: [
        [
          "republic is a state whose citizens choose their leaders, not lands ruled by one powerful ruler",
          "republic 是由公民选领导人的国家，不是由一个强大统治者统治的众多地区",
        ],
        [
          "legion is one army unit of about five thousand soldiers, not a group of lands under one ruler",
          "legion 是约五千名士兵的一个军队单位，不是归一位统治者管辖的众多地区",
        ],
      ],
      spelling: ["em · pire", "the silent e at the end, as in *fire*", "末尾 e 不发音，同 *fire*"],
    },
    {
      word: "aqueduct",
      forms: ["aqueducts"],
      meaning: ["a channel or bridge built to carry water over a long distance", "引水渠，把水输送到远处的渠道或桥"],
      sentences: [
        "The Romans built the ___ to carry fresh water from the mountains into the city.",
        "You can still see the tall stone arches of an old ___ that once carried water to a town in southern France.",
        "Each ___ sloped gently downhill so that the water would keep flowing.",
      ],
      confusions: ["forum", "legion"],
      clues: [
        "a channel carrying fresh water from the mountains into the city",
        "tall stone arches that once carried water to a French town",
        "a channel sloping gently downhill to keep water flowing",
      ],
      contrast: ["an aqueduct carries water; a forum is a square for people", "aqueduct 输送水；forum 是供人聚集的广场"],
      conflicts: [
        [
          "forum is a public square for markets and meetings, not a channel that carries water",
          "forum 是用于集市和集会的公共广场，不是输水的渠道",
        ],
        ["legion is a unit of soldiers, not a stone channel built to carry water", "legion 是士兵组成的单位，不是为输水而建的石渠"],
      ],
      spelling: ["aq · ue · duct", "aque-, not aqua-: an e comes before duct", "是 aque-，不是 aqua-：duct 前是 e"],
    },
    {
      word: "gladiator",
      forms: ["gladiators"],
      meaning: ["a man trained to fight other fighters or animals in an arena for a crowd", "角斗士，在竞技场为观众搏斗的人"],
      sentences: [
        "The crowd roared as the ___ stepped into the arena with his sword and shield.",
        "Many a ___ was a slave or a prisoner forced to fight in the arena for the crowd's entertainment.",
        "The ___ trained for months at a special school before his first fight.",
      ],
      confusions: ["consul", "citizen"],
      clues: [
        "a fighter stepping into the arena with sword and shield",
        "slaves and prisoners forced to fight for a crowd's entertainment",
        "a fighter training for months at a special school before his first fight",
      ],
      contrast: ["a gladiator fought in the arena; a consul led the Republic", "gladiator 在竞技场搏斗；consul 领导共和国"],
      conflicts: [
        [
          "consul is one of the two elected leaders of the Republic, not a fighter in the arena",
          "consul 是共和国选出的两位领导人之一，不是竞技场里的斗士",
        ],
        [
          "citizen is a free member of the state with rights such as voting, not someone forced to fight for a crowd",
          "citizen 是享有投票等权利的自由公民，不是被迫为观众搏斗的人",
        ],
      ],
      spelling: ["glad · i · a · tor", "the -or ending", "结尾是 -or"],
    },
    {
      word: "legion",
      forms: ["legions"],
      meaning: ["a large unit of the Roman army, of about five thousand soldiers", "军团，约五千人的罗马军队单位"],
      sentences: [
        "A Roman ___ of five thousand soldiers marched north to guard the border.",
        "Each ___ carried a bronze eagle on a pole into battle as its proud symbol.",
        "The ___ camped each night inside a ditch and a wall that its five thousand men dug in a few hours.",
      ],
      confusions: ["senate", "empire"],
      clues: [
        "five thousand Roman soldiers marching north to guard the border",
        "an army unit carrying a bronze eagle into battle",
        "five thousand men digging a ditch and wall around their camp each night",
      ],
      contrast: [
        "a legion is one unit of soldiers; an empire is all the lands they guarded",
        "legion 是一个军队单位；empire 是他们守卫的全部疆土",
      ],
      conflicts: [
        ["senate is a council of lawmakers, not a unit of soldiers", "senate 是立法者组成的议事机构，不是军队单位"],
        [
          "empire is a whole group of lands under one ruler, not a single army unit of about five thousand men",
          "empire 是归一位统治者管辖的众多地区，不是约五千人的一个军队单位",
        ],
      ],
      spelling: ["le · gion", "the g that sounds like j before -ion", "g 在 -ion 前读作 j"],
    },
    {
      word: "forum",
      forms: ["forums"],
      meaning: [
        "the public square at the center of a Roman town, for markets, meetings and courts",
        "广场，罗马城镇中心用于集市、集会和审判的公共场所",
      ],
      sentences: [
        "Merchants, lawyers and shoppers crowded the ___ at the heart of the city.",
        "Speakers stood on platforms in the ___ and argued with the crowds.",
        "The temples and law courts of the ___ were the busiest buildings in Rome.",
      ],
      confusions: ["aqueduct", "senate"],
      clues: [
        "merchants, lawyers and shoppers crowding the heart of the city",
        "speakers on platforms arguing with crowds",
        "temples and law courts that were the busiest buildings in Rome",
      ],
      contrast: [
        "the forum is an open square; the senate is a council that met to make laws",
        "forum 是露天广场；senate 是开会立法的议事机构",
      ],
      conflicts: [
        [
          "aqueduct is a channel that carries water, not a square where people meet and trade",
          "aqueduct 是输水的渠道，不是人们集会、交易的广场",
        ],
        [
          "senate is a council of lawmakers, not an open square full of merchants and crowds",
          "senate 是立法者组成的议事机构，不是挤满商人和人群的露天广场",
        ],
      ],
      spelling: ["fo · rum", "the -um ending of a Latin word", "拉丁词的结尾 -um"],
    },
    {
      word: "citizen",
      forms: ["citizens", "citizenship"],
      meaning: ["a member of a state with rights such as voting and protection by its laws", "公民，享有投票等权利并受法律保护的成员"],
      sentences: [
        "Only a Roman ___ could vote in elections or serve in a legion.",
        "As a Roman ___, he had the right to a trial before he could be punished.",
        "Every ___ of a country has rights as well as duties.",
      ],
      confusions: ["gladiator", "emperor"],
      clues: [
        "the right to vote in elections or serve in a legion",
        "the right to a trial before being punished",
        "rights as well as duties held by every member of a country",
      ],
      contrast: [
        "a citizen is an ordinary member of the state with rights; an emperor rules over everyone",
        "citizen 是享有权利的普通公民；emperor 统治所有人",
      ],
      conflicts: [
        [
          "gladiator is a fighter, often a slave, made to fight in the arena, not a free member of the state with rights",
          "gladiator 是被迫在竞技场搏斗的斗士，常是奴隶，不是享有权利的自由公民",
        ],
        [
          "emperor is the single ruler of an empire, not an ordinary member of the state with the right to vote",
          "emperor 是帝国唯一的统治者，不是有投票权的普通公民",
        ],
      ],
      spelling: ["cit · i · zen", "the c that sounds like s, and the -zen ending", "c 读作 s，结尾是 -zen"],
    },
    {
      word: "consul",
      forms: ["consuls"],
      meaning: ["one of the two leaders elected each year to run the Roman Republic", "执政官，罗马共和国每年选出的两位最高长官之一"],
      sentences: [
        "Each year, Romans elected two leaders, and each ___ could stop the other's decisions.",
        "The ___ led the army into battle during his single year in power.",
        "A man had to be at least forty-two years old to be elected ___.",
      ],
      confusions: ["emperor", "gladiator"],
      clues: [
        "two leaders elected each year who could stop each other's decisions",
        "a leader taking the army into battle in his single year in power",
        "the minimum age of forty-two to be elected leader",
      ],
      contrast: [
        "a consul was elected for one year with a partner; an emperor ruled alone for life",
        "consul 与同僚一起任职一年；emperor 终身独揽大权",
      ],
      conflicts: [
        [
          "emperor ruled alone for life, not as one of two leaders elected for a single year",
          "emperor 终身独自统治，不是每年选出的两位领导人之一",
        ],
        ["gladiator fought in the arena, not an elected leader of the Republic", "gladiator 在竞技场搏斗，不是共和国选出的领导人"],
      ],
      spelling: ["con · sul", "the -ul ending, not -el as in *counsel*", "结尾是 -ul，不同于 *counsel* 的 -el"],
    },
    {
      word: "emperor",
      forms: ["emperors"],
      meaning: ["the single ruler of an empire, holding power for life", "皇帝，终身掌权的帝国统治者"],
      sentences: [
        "Augustus became the first Roman ___, ruling alone for over forty years.",
        "Unlike the consuls, the ___ was not elected and ruled until he died.",
        "Coins across the empire showed the face of the ___ who ruled it.",
      ],
      confusions: ["consul", "citizen"],
      clues: [
        "Augustus ruling alone for over forty years",
        "a ruler who was never elected and ruled until he died",
        "coins across the empire showing the face of its ruler",
      ],
      contrast: ["an emperor ruled alone for life; a consul was elected for one year", "emperor 终身独自统治；consul 选举产生、任期一年"],
      conflicts: [
        [
          "consul was one of two leaders elected for a single year, not a single ruler who held power for life",
          "consul 是每年选出的两位领导人之一，不是终身掌权的唯一统治者",
        ],
        [
          "citizen is an ordinary member of the state, not the one ruler of a whole empire",
          "citizen 是国家的普通成员，不是整个帝国唯一的统治者",
        ],
      ],
      spelling: ["em · per · or", "the -or ending, not -er", "结尾是 -or，不是 -er"],
    },
  ],
};

const argument: BatchSpec = {
  id: "words-of-argument",
  title: t("Words of Argument", "论证的词汇"),
  summary: t(
    "Ten words for making and judging an argument: assert, justify, valid, bias, concede, refute and more.",
    "十个用于提出和评判论证的词：assert、justify、valid、bias、concede、refute 等。",
  ),
  intro: t(
    "In the class debate, Omar began to **assert** that phones help students learn, then had to **concede** that they can distract, and finally tried to **refute** the claim that every phone should be banned. These words help you make an argument and judge whether someone else's holds up.",
    "课堂辩论中，奥马尔先断言（**assert**）手机有助于学习，接着不得不承认（**concede**）手机会让人分心，最后又设法驳斥（**refute**）“应当禁止所有手机”的说法。这些词帮你提出论证，并判断别人的论证站不站得住。",
  ),
  watchOut: {
    meanings: t(
      "**Bias** is an unfair leaning, while a **perspective** is simply a point of view; everyone sees from some perspective, but a fair referee shows no bias.",
      "**bias** 是不公正的偏向，**perspective** 只是看问题的角度；每个人都有自己的角度，但公正的裁判不能有偏见。",
    ),
    use: t(
      "You **concede** a point you admit, you **refute** a point you prove wrong, and you **persuade** a person, not a claim; check what comes after the blank.",
      "**concede** 是承认某个观点，**refute** 是证明某个观点错误，**persuade** 的对象是人，不是观点；看看空格后面跟的是什么。",
    ),
    spelling: t(
      "**Concede** ends in -cede, **credible** ends in -ible, and **relevant** ends in -ant.",
      "**concede** 结尾是 -cede，**credible** 结尾是 -ible，**relevant** 结尾是 -ant。",
    ),
  },
  domain: ["arguments and debates", "论证与辩论"],
  prerequisites: ["context-clues", "fact-and-opinion"],
  encompasses: fromClues,
  words: [
    {
      word: "assert",
      forms: ["asserts", "asserted", "asserting"],
      meaning: ["to state something firmly as true", "断言，坚定地声称某事为真"],
      sentences: [
        "The author chose to ___ her main claim in the very first line: every school should teach cooking.",
        "Confident in their data, the scientists ___ that the climate is warming faster than ever before.",
        "It is easy to ___ that your idea is true; it is much harder to prove it with evidence.",
      ],
      confusions: ["concede", "refute"],
      clues: [
        "an author stating her main claim in the very first line",
        "confident scientists stating that the climate is warming faster than ever",
        "claiming your idea is true without the evidence to prove it",
      ],
      contrast: [
        "assert states your own claim firmly; concede admits a point you would rather not",
        "assert 是坚定地提出自己的主张；concede 是勉强承认不愿承认的观点",
      ],
      conflicts: [
        [
          "concede means to admit, often unwillingly, that the other side has a point, not to state your own claim firmly",
          "concede 是勉强承认对方有理，不是坚定地提出自己的主张",
        ],
        [
          "refute means to prove that a claim is wrong, not to state firmly that something is true",
          "refute 是证明某个说法错误，不是坚定地声称某事为真",
        ],
      ],
      spelling: ["as · sert", "the double s", "双写 s"],
    },
    {
      word: "justify",
      forms: ["justifies", "justified", "justifying"],
      meaning: ["to give good reasons that show something is right", "证明……有理，给出充分理由说明某事正确"],
      sentences: [
        "Can you ___ spending the whole budget on one trip?",
        "The mayor tried to ___ the new tax by pointing to the broken roads.",
        "A good essay gives three strong reasons to ___ the decision to close the old bridge.",
      ],
      confusions: ["persuade", "assert"],
      clues: [
        "spending a whole budget on one trip",
        "a mayor pointing to broken roads to defend a new tax",
        "three strong reasons given for closing an old bridge",
      ],
      contrast: [
        "justify gives the reasons that something is right; assert only states it firmly",
        "justify 是给出理由证明某事正确；assert 只是坚定地声称",
      ],
      conflicts: [
        [
          "persuade means to get a person to believe or do something, so it needs a person after it, not a decision or a plan",
          "persuade 是让某人相信或去做某事，后面要跟人，不跟决定或计划",
        ],
        [
          "assert means to state firmly that something is true, not to give the reasons that show an action was right",
          "assert 是坚定地声称某事为真，不是给出理由说明某个做法正确",
        ],
      ],
      spelling: ["jus · ti · fy", "the y that changes to i before -es and -ed: justified", "加 -es、-ed 时 y 变 i：justified"],
    },
    {
      word: "valid",
      meaning: ["based on sound reasoning or fact, and so acceptable", "有效的，合理的，有事实或合理推理依据的"],
      sentences: [
        "Your conclusion is ___: it follows step by step from facts that we all agree on.",
        "His reason is on the topic and comes from a trusted source, but it is still not ___, because its logic does not hold.",
        "The judge ruled that the will was ___, because it had been signed and witnessed exactly as the law requires.",
      ],
      confusions: ["relevant", "credible"],
      clues: [
        "a conclusion following step by step from facts everyone agrees on",
        "a reason on the topic and from a trusted source whose logic still fails",
        "a will signed and witnessed exactly as the law requires",
      ],
      contrast: [
        "valid means the reasoning holds up; relevant only means it is on the topic",
        "valid 指推理站得住；relevant 只是说与话题相关",
      ],
      conflicts: [
        [
          "relevant means connected to the subject, not built on sound reasoning or rules that make it acceptable",
          "relevant 是与话题相关，不是建立在合理推理或规则之上而能被接受",
        ],
        [
          "credible means believable because the source can be trusted, not resting on sound logic or rules",
          "credible 是因来源可靠而可信，不是有合理的逻辑或规则作依据",
        ],
      ],
      spelling: ["val · id", "the single l and the -id ending", "单写 l，结尾是 -id"],
    },
    {
      word: "bias",
      forms: ["biases", "biased"],
      meaning: ["an unfair leaning for or against something that affects judgment", "偏见，影响判断的不公正倾向"],
      sentences: [
        "The study was paid for by a candy company, so readers should watch for ___.",
        "A good referee shows no ___ toward either team.",
        "His ___ against city life made him ignore every good thing about it.",
      ],
      confusions: ["perspective", "credible"],
      clues: [
        "a study paid for by a candy company",
        "a referee who favors neither team",
        "a dislike of city life that made him ignore all its good points",
      ],
      contrast: ["bias is an unfair leaning; perspective is just a point of view", "bias 是不公正的偏向；perspective 只是看问题的角度"],
      conflicts: [
        [
          "perspective is simply a way of seeing something, not an unfair leaning that twists judgment",
          "perspective 只是看待事物的角度，不是扭曲判断的不公正倾向",
        ],
        [
          "credible describes a source that can be trusted, the opposite of an unfair leaning that makes judgment untrustworthy",
          "credible 形容可以信赖的来源，恰恰与让判断不可信的偏见相反",
        ],
      ],
      spelling: ["bi · as", "the i and the a said apart: bi-as", "i 和 a 分开读：bi-as"],
    },
    {
      word: "perspective",
      forms: ["perspectives"],
      meaning: ["a particular way of seeing or thinking about something", "视角，看待或思考事物的特定方式"],
      sentences: [
        "From a farmer's ___, the rain was a blessing, not a problem.",
        "The article tells the story from the ___ of a nurse who was there.",
        "Talking with my grandparents gave me a new ___ on how much the town has changed.",
      ],
      confusions: ["bias", "relevant"],
      clues: [
        "a farmer seeing rain as a blessing",
        "a story told through the eyes of a nurse who was there",
        "talks with grandparents showing how much a town has changed",
      ],
      contrast: ["a perspective is a point of view; a bias is an unfair leaning", "perspective 是看问题的角度；bias 是不公正的偏向"],
      conflicts: [
        [
          "bias is an unfair leaning that twists judgment, not simply one person's way of seeing things",
          "bias 是扭曲判断的不公正倾向，不只是某个人看事物的角度",
        ],
        [
          "relevant describes something connected to the subject, not a point of view from which something is seen",
          "relevant 形容与话题相关的东西，不是看事物的角度",
        ],
      ],
      spelling: ["per · spec · tive", "per-, not pre-, at the start", "开头是 per-，不是 pre-"],
    },
    {
      word: "concede",
      forms: ["concedes", "conceded", "conceding"],
      meaning: ["to admit, often unwillingly, that something is true", "（常勉强地）承认，让步"],
      sentences: [
        "I ___ that uniforms cost money, but they save families more in the long run.",
        "After the recount, the losing candidate had to ___ the election.",
        "A strong writer will ___ a fair point made by the other side.",
      ],
      confusions: ["refute", "assert"],
      clues: [
        "admitting that uniforms cost money before arguing they save more",
        "a losing candidate admitting defeat after a recount",
        "a writer admitting a fair point made by the other side",
      ],
      contrast: ["concede admits the other side's point; refute proves it wrong", "concede 承认对方的观点；refute 证明它是错的"],
      conflicts: [
        ["refute means to prove a claim wrong, not to admit that it is true", "refute 是证明某个说法错误，不是承认它正确"],
        [
          "assert means to state your own claim firmly, not to admit unwillingly that another view is right",
          "assert 是坚定地提出自己的主张，不是勉强承认别人的看法有理",
        ],
      ],
      spelling: ["con · cede", "the -cede ending, as in *precede*, not -ceed", "结尾是 -cede（同 *precede*），不是 -ceed"],
    },
    {
      word: "refute",
      forms: ["refutes", "refuted", "refuting"],
      meaning: ["to prove that a statement or argument is wrong", "驳斥，证明某说法或论点是错误的"],
      sentences: [
        "She used the city's own records to ___ the false claim that the park was unsafe.",
        "No one could ___ his evidence, so the committee accepted his plan.",
        "To ___ an argument, you must show where its reasoning or facts go wrong.",
      ],
      confusions: ["concede", "justify"],
      clues: [
        "city records used against a false claim that a park was unsafe",
        "evidence no one could prove wrong, so a committee accepted the plan",
        "showing where an argument's reasoning or facts go wrong",
      ],
      contrast: ["refute proves a claim wrong; justify gives reasons that it is right", "refute 证明说法错误；justify 给出理由证明它正确"],
      conflicts: [
        ["concede means to admit that something is true, not to show that it is wrong", "concede 是承认某事属实，不是证明它是错的"],
        [
          "justify means to give reasons that something is right, the opposite of proving it wrong",
          "justify 是给出理由证明某事正确，恰恰与证明它错误相反",
        ],
      ],
      spelling: ["re · fute", "the silent e at the end, as in *flute*", "末尾 e 不发音，同 *flute*"],
    },
    {
      word: "persuade",
      forms: ["persuades", "persuaded", "persuading", "persuasive"],
      meaning: ["to cause someone to believe or do something by giving reasons", "说服，用理由使人相信或去做某事"],
      sentences: [
        "Maya tried to ___ her parents to let her join the robotics club.",
        "The ad uses a famous athlete to ___ people to buy the shoes.",
        "Facts alone may not ___ a reader who already disagrees.",
      ],
      confusions: ["justify", "assert"],
      clues: [
        "a girl trying to get her parents to let her join a club",
        "an ad using a famous athlete to get people to buy shoes",
        "facts failing to win over a reader who already disagrees",
      ],
      contrast: [
        "persuade changes someone's mind; justify defends a choice with reasons",
        "persuade 改变某人的想法；justify 用理由为某个选择辩护",
      ],
      conflicts: [
        [
          "justify means to give reasons that an action is right, not to get a person to believe or do something",
          "justify 是给出理由说明某个做法正确，不是让某人相信或去做某事",
        ],
        [
          "assert means to state something firmly, not to win someone over to an idea or an action",
          "assert 是坚定地声称某事，不是让某人接受某个想法或去做某事",
        ],
      ],
      spelling: ["per · suade", "the u that sounds like w after s: per-swade", "s 后的 u 读作 w：per-swade"],
    },
    {
      word: "credible",
      meaning: ["able to be believed; trustworthy", "可信的，值得信赖的"],
      sentences: [
        "A doctor who studied for years is a more ___ source on health than a stranger online who hides his name.",
        "The jury believed the witness, whose ___ account matched the camera footage in every detail.",
        "To be ___, a website should name its authors and its sources.",
      ],
      confusions: ["valid", "relevant"],
      clues: [
        "a trained doctor compared with a nameless stranger online",
        "a witness whose account matched the camera footage in every detail",
        "a website that names its authors and its sources",
      ],
      contrast: [
        "credible means it can be believed and trusted; valid means its reasoning holds up",
        "credible 指可以相信、值得信赖；valid 指推理站得住",
      ],
      conflicts: [
        [
          "valid describes reasoning that holds together, not a source or a witness that people can believe",
          "valid 形容推理严密，不是形容人们可以相信的来源或证人",
        ],
        ["relevant means connected to the subject, not trustworthy enough to be believed", "relevant 是与话题相关，不是可靠得足以让人相信"],
      ],
      spelling: ["cred · i · ble", "the -ible ending, not -able", "结尾是 -ible，不是 -able"],
    },
    {
      word: "relevant",
      forms: ["relevance"],
      meaning: ["closely connected to the subject being discussed", "相关的，与所讨论的话题紧密相关的"],
      sentences: [
        "The size of the gym is not ___ to an argument about school lunches.",
        "Only include evidence that is ___ to your claim.",
        "The lawyer asked whether the witness's old job was ___ to the case.",
      ],
      confusions: ["credible", "valid"],
      clues: [
        "the size of a gym in an argument about school lunches",
        "evidence that connects to your claim",
        "whether a witness's old job connects to the case",
      ],
      contrast: ["relevant means connected to the subject; credible means trustworthy", "relevant 指与话题相关；credible 指值得信赖"],
      conflicts: [
        [
          "credible means trustworthy enough to believe, not connected to the subject at hand",
          "credible 是可靠得足以让人相信，不是与所谈话题相关",
        ],
        [
          "valid means based on sound reasoning, not closely linked to the topic being discussed",
          "valid 是有合理推理作依据，不是与所讨论的话题紧密相关",
        ],
      ],
      spelling: ["rel · e · vant", "the -ant ending, not -ent", "结尾是 -ant，不是 -ent"],
    },
  ],
};

const ecosystems: BatchSpec = {
  id: "words-of-ecosystems",
  title: t("Words of Ecosystems", "生态系统的词汇"),
  summary: t(
    "Ten words for how living things depend on one another: producer, consumer, decomposer, symbiosis and more.",
    "十个关于生物相互依存的词：producer、consumer、decomposer、symbiosis 等。",
  ),
  intro: t(
    "On the reef, **plankton** drift past the **coral**, a clownfish shelters in an anemone in perfect **symbiosis**, and an **endangered** sea turtle glides overhead. These words help you explain how living things depend on one another and on the place they live.",
    "在珊瑚礁上，浮游生物（**plankton**）从珊瑚（**coral**）旁漂过，一条小丑鱼躲在海葵里，二者完美共生（**symbiosis**），一只濒危的（**endangered**）海龟从头顶游过。这些词帮你解释生物之间、生物与环境之间如何相互依存。",
  ),
  watchOut: {
    meanings: t(
      "An **organism** is one living thing, while an **ecosystem** is all the living things of a place together with their water, soil and air; a frog is an organism, and the pond it lives in is an ecosystem.",
      "**organism** 是单个生物，**ecosystem** 是一个地方的全部生物加上水、土壤和空气；青蛙是 organism，它生活的池塘是 ecosystem。",
    ),
    use: t(
      "A **producer** makes its own food, a **consumer** eats other living things, and a **decomposer** breaks down the dead; ask where each one's energy comes from before you choose.",
      "**producer** 自己制造食物，**consumer** 吃其他生物，**decomposer** 分解死去的生物；选词前先问一问它的能量从哪里来。",
    ),
    spelling: t(
      "**Biodiversity** is bio- plus diversity, **symbiosis** has a y after the s, and **plankton** keeps a k before -ton.",
      "**biodiversity** 是 bio- 加 diversity；**symbiosis** 的 s 后是 y；**plankton** 在 -ton 前有 k。",
    ),
  },
  domain: ["ecosystems and the ocean", "生态系统与海洋"],
  prerequisites: ["context-clues"],
  encompasses: fromClues,
  words: [
    {
      word: "ecosystem",
      forms: ["ecosystems"],
      meaning: ["all the living things in an area together with their surroundings", "生态系统，一个区域内的全部生物及其环境"],
      sentences: [
        "A pond is a small ___ where frogs, insects, plants and water all depend on one another.",
        "When wolves returned to the park, the whole ___ changed: elk moved, trees grew back and even the rivers shifted course.",
        "Pollution from the factory harmed every part of the river's ___, from the fish to the water itself.",
      ],
      confusions: ["organism", "biodiversity"],
      clues: [
        "a pond where frogs, insects, plants and water all depend on one another",
        "a park where wolves changed the elk, the trees and even the rivers",
        "a river harmed by pollution, from its fish to the water itself",
      ],
      contrast: [
        "an ecosystem is all the life of a place plus its surroundings; an organism is one living thing",
        "ecosystem 是一个地方的全部生物加上环境；organism 是单个生物",
      ],
      conflicts: [
        [
          "organism is one single living thing, not all the living things of an area together with their surroundings",
          "organism 是单个生物，不是一个区域内的全部生物及其环境",
        ],
        [
          "biodiversity is the variety of kinds of living things, not the whole community of life together with its water, soil and air",
          "biodiversity 是生物种类的多少，不是全部生物连同水、土壤和空气构成的整体",
        ],
      ],
      spelling: ["e · co · sys · tem", "eco- plus *system*, with a y", "eco- 加 *system*，里面是 y"],
    },
    {
      word: "organism",
      forms: ["organisms"],
      meaning: ["a single living thing, such as a plant, an animal or a bacterium", "生物体，单个的生物，如植物、动物或细菌"],
      sentences: [
        "Under the microscope, we saw a tiny ___ swimming in the drop of water.",
        "Every ___ needs energy to grow and stay alive.",
        "The blue whale is the largest ___ that has ever lived.",
      ],
      confusions: ["ecosystem", "biodiversity"],
      clues: [
        "a tiny living thing swimming in a drop of water under a microscope",
        "a living thing needing energy to grow and stay alive",
        "the blue whale, the largest living thing ever",
      ],
      contrast: [
        "an organism is one living thing; an ecosystem is a whole community with its surroundings",
        "organism 是单个生物；ecosystem 是生物群体连同环境",
      ],
      conflicts: [
        [
          "ecosystem is a whole community of living things and their surroundings, not one single living thing",
          "ecosystem 是全部生物及其环境构成的整体，不是单个生物",
        ],
        [
          "biodiversity is the variety of kinds of life in a place, not a single plant, animal or bacterium",
          "biodiversity 是一个地方生物种类的多少，不是单个植物、动物或细菌",
        ],
      ],
      spelling: ["or · gan · ism", "*organ* plus -ism", "*organ* 加 -ism"],
    },
    {
      word: "producer",
      forms: ["producers"],
      meaning: ["a living thing that makes its own food, usually from sunlight", "生产者，能自己制造食物（通常利用阳光）的生物"],
      sentences: [
        "Grass is a ___ because it makes its own food from sunlight.",
        "In the ocean, tiny floating plants are the main ___, using sunlight to make the food that every other creature depends on.",
        "Every food chain begins with a ___, such as a tree or a plant.",
      ],
      confusions: ["consumer", "decomposer"],
      clues: [
        "grass making its own food from sunlight",
        "tiny floating plants using sunlight to make the ocean's food",
        "the start of every food chain, such as a tree or a plant",
      ],
      contrast: [
        "a producer makes its own food; a consumer must eat other living things",
        "producer 自己制造食物；consumer 必须吃其他生物",
      ],
      conflicts: [
        [
          "consumer gets its energy by eating other living things, not by making its own food from sunlight",
          "consumer 靠吃其他生物获得能量，不是利用阳光自己制造食物",
        ],
        [
          "decomposer breaks down dead plants and animals, not making fresh food from sunlight",
          "decomposer 分解死去的动植物，不是利用阳光制造新的食物",
        ],
      ],
      spelling: ["pro · duc · er", "the soft c before -er", "c 在 -er 前发 s 音"],
    },
    {
      word: "consumer",
      forms: ["consumers"],
      meaning: ["a living thing that gets energy by eating other living things", "消费者，靠吃其他生物获取能量的生物"],
      sentences: [
        "A rabbit is a ___ because it must eat plants to get energy.",
        "The shark is a top ___ that eats fish, seals and squid.",
        "An animal cannot make its own food, so every animal is a ___.",
      ],
      confusions: ["producer", "decomposer"],
      clues: ["a rabbit eating plants to get energy", "a shark eating fish, seals and squid", "animals that cannot make their own food"],
      contrast: ["a consumer eats other living things; a producer makes its own food", "consumer 吃其他生物；producer 自己制造食物"],
      conflicts: [
        [
          "producer makes its own food from sunlight, not eating other living things for energy",
          "producer 利用阳光自己制造食物，不是靠吃其他生物获得能量",
        ],
        [
          "decomposer breaks down dead remains, not hunting or grazing on other living things",
          "decomposer 分解死去的遗骸，不是捕食或啃食活的生物",
        ],
      ],
      spelling: ["con · sum · er", "con- plus *sum*, and the -er ending", "con- 加 *sum*，结尾是 -er"],
    },
    {
      word: "decomposer",
      forms: ["decomposers"],
      meaning: ["a living thing that breaks down dead plants and animals", "分解者，分解死去动植物的生物"],
      sentences: [
        "A mushroom is a ___ that breaks down fallen logs into soil.",
        "Without a single ___, dead leaves would pile up on the forest floor forever.",
        "The worm is a busy ___, turning dead plants into rich earth.",
      ],
      confusions: ["producer", "consumer"],
      clues: [
        "a mushroom breaking down fallen logs into soil",
        "dead leaves that would pile up forever without it",
        "a worm turning dead plants into rich earth",
      ],
      contrast: ["a decomposer breaks down the dead; a consumer eats the living", "decomposer 分解死去的生物；consumer 吃活的生物"],
      conflicts: [
        [
          "producer makes new food from sunlight, not breaking down dead plants and animals",
          "producer 利用阳光制造新的食物，不是分解死去的动植物",
        ],
        [
          "consumer eats living things for energy, not turning dead remains back into soil",
          "consumer 吃活的生物获取能量，不是把遗骸变回土壤",
        ],
      ],
      spelling: ["de · com · pos · er", "de- plus *compose*, with the e dropped before -er", "de- 加 *compose*，加 -er 时去掉 e"],
    },
    {
      word: "biodiversity",
      meaning: ["the variety of different kinds of living things in a place", "生物多样性，一个地方生物种类的丰富程度"],
      sentences: [
        "The rain forest has amazing ___, with thousands of kinds of plants and animals.",
        "Clearing the forest for one crop greatly reduced the area's ___.",
        "Scientists count the kinds of beetles on an island to measure its ___.",
      ],
      confusions: ["symbiosis", "ecosystem"],
      clues: [
        "a rain forest with thousands of kinds of plants and animals",
        "a forest cleared for one crop, leaving fewer kinds of life",
        "scientists counting the kinds of beetles on an island",
      ],
      contrast: [
        "biodiversity is how many kinds of life a place has; an ecosystem is the whole community",
        "biodiversity 是一个地方生物种类的多少；ecosystem 是整个生物群体",
      ],
      conflicts: [
        [
          "symbiosis is a close partnership between two kinds of living things, not the variety of all the kinds in a place",
          "symbiosis 是两种生物之间的紧密关系，不是一个地方所有生物种类的多样",
        ],
        [
          "ecosystem is the whole community of life and its surroundings, not a count of how many different kinds live there",
          "ecosystem 是全部生物及其环境，不是那里生物种类的数量",
        ],
      ],
      spelling: ["bi · o · di · ver · si · ty", "bio- plus *diversity*, with the -ity ending", "bio- 加 *diversity*，结尾是 -ity"],
    },
    {
      word: "symbiosis",
      meaning: [
        "a close relationship between two different kinds of living things, often helping both",
        "共生，两种不同生物之间往往互利的紧密关系",
      ],
      sentences: [
        "The clownfish and the sea anemone live in ___: each protects the other.",
        "Bees and flowers are a classic example of ___, since each helps the other survive.",
        "In this ___, a tiny fish cleans the shark's teeth and gets a free meal.",
      ],
      confusions: ["biodiversity", "plankton"],
      clues: [
        "a clownfish and a sea anemone protecting each other",
        "bees and flowers each helping the other survive",
        "a tiny fish cleaning a shark's teeth for a free meal",
      ],
      contrast: [
        "symbiosis is a partnership of two kinds; biodiversity is the variety of many kinds",
        "symbiosis 是两种生物的伙伴关系；biodiversity 是众多生物种类的多样",
      ],
      conflicts: [
        [
          "biodiversity is the variety of many kinds of life, not a close partnership between two of them",
          "biodiversity 是众多生物种类的多样，不是其中两种之间的紧密关系",
        ],
        [
          "plankton is the tiny life drifting in water, not a relationship between two different creatures",
          "plankton 是水中漂流的微小生物，不是两种生物之间的关系",
        ],
      ],
      spelling: ["sym · bi · o · sis", "sym- with a y, and the -osis ending", "sym- 里是 y，结尾是 -osis"],
    },
    {
      word: "plankton",
      meaning: ["tiny plants and animals that drift in the water of seas and lakes", "浮游生物，在海洋和湖泊中漂流的微小动植物"],
      sentences: [
        "The huge whale feeds on ___, swallowing millions of tiny drifting creatures at once.",
        "Most ___ is too small to see without a microscope.",
        "Fish larvae and tiny plants that drift with the currents are called ___.",
      ],
      confusions: ["coral", "organism"],
      clues: [
        "a whale swallowing millions of tiny drifting creatures",
        "tiny life too small to see without a microscope",
        "fish larvae and tiny plants drifting with the currents",
      ],
      contrast: ["plankton drifts in the water; coral stays fixed and builds reefs", "plankton 在水中漂流；coral 固定不动并建造礁石"],
      conflicts: [
        [
          "coral builds hard reefs fixed in warm water, not tiny life that drifts with the currents",
          "coral 在温暖海水中建造固定的坚硬礁石，不是随水流漂荡的微小生物",
        ],
        [
          "organism is any single living thing, big or small, not the drifting mass of tiny plants and animals in water",
          "organism 是任何单个生物，不论大小，不是水中成群漂流的微小动植物",
        ],
      ],
      spelling: ["plank · ton", "the k before -ton", "-ton 前有 k"],
    },
    {
      word: "coral",
      forms: ["corals"],
      meaning: [
        "tiny sea animals that build hard, rocky reefs in warm water, or the reefs they build",
        "珊瑚，在温暖海水中建造礁石的微小海洋动物，或其形成的礁石",
      ],
      sentences: [
        "The reef is built by ___, tiny animals that grow hard skeletons together.",
        "Warm water can turn ___ white and kill the reef.",
        "Divers must never touch the ___, because it breaks easily and grows back slowly.",
      ],
      confusions: ["plankton", "decomposer"],
      clues: [
        "tiny animals growing hard skeletons together into a reef",
        "warm water turning a reef white and killing it",
        "a reef that breaks easily and grows back slowly",
      ],
      contrast: ["coral builds fixed reefs; plankton drifts freely", "coral 建造固定的礁石；plankton 自由漂流"],
      conflicts: [
        ["plankton drifts freely in the water, not building hard, rocky reefs", "plankton 在水中自由漂流，不建造坚硬的礁石"],
        ["decomposer breaks down dead remains, not building a reef out of hard skeletons", "decomposer 分解遗骸，不是用坚硬的骨骼建造礁石"],
      ],
      spelling: ["cor · al", "a single r and the -al ending (not *choral*)", "单写 r，结尾是 -al（不是 *choral*）"],
    },
    {
      word: "endangered",
      meaning: ["at risk of disappearing completely from the earth", "濒危的，面临彻底灭绝危险的"],
      sentences: [
        "Only a few hundred of these ___ turtles are left in the wild.",
        "The tiger is ___ because hunters and farms have taken so much of its forest.",
        "Laws protect ___ animals from being hunted or sold.",
      ],
      confusions: ["perilous", "resilient"],
      clues: [
        "only a few hundred turtles left in the wild",
        "tigers losing their forest to hunters and farms",
        "laws protecting animals from being hunted or sold",
      ],
      contrast: [
        "endangered means a kind of animal could die out; perilous means a place or journey is dangerous",
        "endangered 指某种动物可能灭绝；perilous 指地方或旅程危险",
      ],
      conflicts: [
        [
          "perilous describes a place or a journey full of danger, not a kind of animal at risk of dying out",
          "perilous 形容危险重重的地方或旅程，不是形容面临灭绝的动物",
        ],
        [
          "resilient means able to bounce back from trouble, not so few in number that a species could vanish",
          "resilient 是能从困境中恢复，不是少到整个物种可能消失",
        ],
      ],
      spelling: ["en · dan · gered", "en- plus *danger*, and the -ed ending", "en- 加 *danger*，结尾是 -ed"],
    },
  ],
};

const character: BatchSpec = {
  id: "words-for-character-and-motive",
  title: t("Words for Character and Motive", "描述性格与动机的词"),
  summary: t(
    "Ten words for what drives a character: resentful, envious, resilient, impulsive, remorseful and more.",
    "十个描述人物内在动因的词：resentful、envious、resilient、impulsive、remorseful 等。",
  ),
  intro: t(
    "When the coach left Kai on the bench, he felt **resentful**, but the **resilient** boy kept training, and a **sympathetic** teammate stayed late every evening to practice with him. These words help you describe what a character feels and what drives the choices they make.",
    "教练让凯坐冷板凳，他心里愤愤不平（**resentful**），但这个有韧性的（**resilient**）男孩坚持训练，一位富有同情心的（**sympathetic**）队友每天晚上都留下来陪他练习。这些词帮你描述人物的感受，以及驱动他们做选择的原因。",
  ),
  watchOut: {
    meanings: t(
      "**Resentful** is bitter about a wrong done to you, while **remorseful** is sorry for a wrong you did; the cheated girl is resentful, and the cheater who apologizes is remorseful.",
      "**resentful** 是因别人亏待自己而怨恨，**remorseful** 是为自己做错的事而懊悔；被骗的女孩 resentful，道歉的骗子 remorseful。",
    ),
    use: t(
      "An **impulsive** character acts before thinking, a **conscientious** one checks every step, and a **defiant** one refuses an order; look at what the character does to tell them apart.",
      "**impulsive** 的人物不假思索就行动，**conscientious** 的人物每一步都仔细核对，**defiant** 的人物拒不服从命令；看人物做了什么来区分它们。",
    ),
    spelling: t(
      "**Conscientious** hides *sci* as in science, **remorseful** keeps the e of remorse, and **envious** turns the y of envy into i.",
      "**conscientious** 里藏着 science 的 *sci*；**remorseful** 保留 remorse 的 e；**envious** 把 envy 的 y 变成 i。",
    ),
  },
  domain: ["characters and what drives them", "人物及其动机"],
  prerequisites: ["context-clues", "characters"],
  encompasses: fromClues,
  words: [
    {
      word: "resentful",
      meaning: ["feeling bitter and angry about being treated unfairly", "愤愤不平的，因受到不公对待而怨恨的"],
      sentences: [
        "Mara was ___ that her brother got the bigger room just because he was older.",
        "The workers felt quietly ___ for months after the boss took credit for their idea, though no one said a word.",
        "He stayed ___ for weeks about being left off the team.",
      ],
      confusions: ["remorseful", "defiant"],
      clues: [
        "a girl whose brother got the bigger room just for being older",
        "workers quietly bitter for months after the boss took credit for their idea",
        "a boy bitter for weeks about being left off the team",
      ],
      contrast: [
        "resentful is bitter about a wrong done to you; remorseful is sorry for a wrong you did",
        "resentful 是因受亏待而怨恨；remorseful 是为自己的过错懊悔",
      ],
      conflicts: [
        [
          "remorseful means sorry for a wrong you did yourself, not bitter about a wrong done to you",
          "remorseful 是为自己做的错事懊悔，不是因别人亏待自己而怨恨",
        ],
        [
          "defiant means openly refusing to obey, not quietly bitter about unfair treatment",
          "defiant 是公然拒不服从，不是因不公对待而暗自怨恨",
        ],
      ],
      spelling: ["re · sent · ful", "*resent* plus -ful, with one l", "*resent* 加 -ful，只有一个 l"],
    },
    {
      word: "envious",
      meaning: ["wanting something that someone else has", "嫉妒的，羡慕别人所拥有的"],
      sentences: [
        "Jake was ___ of his friend's new phone and wished with all his heart that it were his.",
        "The other gardeners were ___ of her prize-winning roses and wanted roses just like them.",
        "Seeing her cousin's shiny new bike, Lily felt ___ and wished she had one too.",
      ],
      confusions: ["resentful", "sympathetic"],
      clues: [
        "a boy wishing his friend's new phone were his",
        "gardeners wanting prize-winning roses just like hers",
        "a girl wishing she had a bike like her cousin's",
      ],
      contrast: [
        "envious wants what another person has; resentful is bitter about unfair treatment",
        "envious 想要别人拥有的东西；resentful 因受不公对待而怨恨",
      ],
      conflicts: [
        [
          "resentful means bitter about being treated unfairly, not wishing you had what someone else has",
          "resentful 是因受不公对待而怨恨，不是希望拥有别人的东西",
        ],
        [
          "sympathetic means caring about someone's trouble, not wanting their things for yourself",
          "sympathetic 是关心别人的困难，不是想把别人的东西据为己有",
        ],
      ],
      spelling: ["en · vi · ous", "*envy* with the y changed to i before -ous", "*envy* 的 y 变成 i，再加 -ous"],
    },
    {
      word: "resilient",
      meaning: ["able to recover quickly after something hard or painful", "有韧性的，能从困难或痛苦中迅速恢复的"],
      sentences: [
        "After losing her home in the fire, the ___ girl was back at school in a week, smiling.",
        "Children can be surprisingly ___, bouncing back from setbacks that would flatten adults.",
        "The team was ___: after three losses in a row, they recovered quickly and won their next game.",
      ],
      confusions: ["impulsive", "defiant"],
      clues: [
        "a girl back at school and smiling a week after a fire took her home",
        "children bouncing back from setbacks that would flatten adults",
        "a team recovering quickly from three losses to win the next game",
      ],
      contrast: ["resilient bounces back from hardship; defiant refuses to obey", "resilient 能从困境中恢复；defiant 拒不服从"],
      conflicts: [
        [
          "impulsive means acting suddenly without thinking, not recovering well after something hard",
          "impulsive 是不假思索突然行动，不是在困难后很快恢复",
        ],
        [
          "defiant means openly refusing to obey someone, not bouncing back after a painful loss",
          "defiant 是公然拒绝服从，不是在痛苦的挫折后重新振作",
        ],
      ],
      spelling: ["re · sil · i · ent", "the -ient ending", "结尾是 -ient"],
    },
    {
      word: "impulsive",
      meaning: ["acting suddenly without thinking first", "冲动的，不加思考就突然行动的"],
      sentences: [
        "In one ___ moment, Leo spent all his savings on a guitar he never learned to play.",
        "Her ___ decision to jump into the river nearly cost her life.",
        "Being ___, he said the first thing that came into his head and hurt her feelings.",
      ],
      confusions: ["conscientious", "aloof"],
      clues: [
        "a boy spending all his savings on a guitar he never learned",
        "a sudden decision to jump into a river that nearly cost a life",
        "a boy saying the first thing in his head and hurting a friend",
      ],
      contrast: [
        "impulsive acts without thinking; conscientious thinks carefully first",
        "impulsive 不假思索就行动；conscientious 先仔细考虑",
      ],
      conflicts: [
        [
          "conscientious means careful to do one's duty well, not acting suddenly without thinking",
          "conscientious 是认真尽责，不是不假思索地突然行动",
        ],
        ["aloof means cool and distant from others, not rushing into action without a thought", "aloof 是冷淡疏远，不是想都不想就冲动行事"],
      ],
      spelling: ["im · pul · sive", "the -sive ending with a silent e", "结尾是 -sive，末尾 e 不发音"],
    },
    {
      word: "conscientious",
      meaning: ["careful to do one's work and duty well", "认真尽责的，细心做好工作和本分的"],
      sentences: [
        "Always the most ___ student in class, Priya checked every answer twice before handing in her test.",
        "The ___ night guard walked every hallway each hour without fail.",
        "Because he was so ___, the teacher trusted him to feed the class pets all summer.",
      ],
      confusions: ["impulsive", "defiant"],
      clues: [
        "a student checking every answer twice before handing in a test",
        "a night guard walking every hallway each hour without fail",
        "a boy trusted to feed the class pets all summer",
      ],
      contrast: [
        "conscientious works carefully and dutifully; impulsive acts without thinking",
        "conscientious 认真尽责；impulsive 不假思索",
      ],
      conflicts: [
        [
          "impulsive means acting suddenly without thinking, not checking work carefully",
          "impulsive 是不假思索地突然行动，不是仔细检查工作",
        ],
        ["defiant means refusing to obey, not faithfully doing one's duty", "defiant 是拒不服从，不是忠实地履行职责"],
      ],
      spelling: [
        "con · sci · en · tious",
        "*science* hidden inside as sci, then the -tious ending",
        "里面藏着 *science* 的 sci，结尾是 -tious",
      ],
    },
    {
      word: "defiant",
      meaning: ["openly refusing to obey or give in", "公然反抗的，拒不服从或屈服的"],
      sentences: [
        "With her arms crossed, the ___ girl refused to leave until the manager listened.",
        "The ___ prisoner would not answer a single question.",
        "Told to sit down, he stayed standing, ___ to the end.",
      ],
      confusions: ["sympathetic", "conscientious"],
      clues: [
        "a girl with crossed arms refusing to leave until the manager listened",
        "a prisoner who would not answer a single question",
        "a boy told to sit down who stayed standing to the end",
      ],
      contrast: ["defiant refuses to obey; conscientious faithfully does what is asked", "defiant 拒不服从；conscientious 尽职地完成要求"],
      conflicts: [
        ["sympathetic means caring about another's trouble, not openly refusing to obey", "sympathetic 是关心别人的困难，不是公然拒绝服从"],
        [
          "conscientious means carefully doing what one should, the opposite of refusing to obey",
          "conscientious 是认真做好分内事，恰恰与拒不服从相反",
        ],
      ],
      spelling: ["de · fi · ant", "*defy* with the y changed to i, and the -ant ending", "*defy* 的 y 变成 i，结尾是 -ant"],
    },
    {
      word: "sympathetic",
      meaning: ["showing that you understand and care about someone's trouble", "同情的，表示理解并关心他人困难的"],
      sentences: [
        "The ___ nurse held the frightened boy's hand during the shot.",
        "When I told her about my lost dog, she hugged me and spoke in a soft, ___ voice.",
        "The judge was ___ to the family and gave them more time to pay.",
      ],
      confusions: ["envious", "aloof"],
      clues: [
        "a nurse holding a frightened boy's hand during a shot",
        "a soft voice and a hug for someone whose dog was lost",
        "a judge giving a struggling family more time to pay",
      ],
      contrast: ["sympathetic cares about someone's trouble; aloof stays cool and distant", "sympathetic 关心别人的困难；aloof 冷淡疏远"],
      conflicts: [
        ["envious means wanting what someone else has, not caring about their trouble", "envious 是想要别人拥有的东西，不是关心别人的困难"],
        ["aloof means cool and distant, not warmly caring about someone in trouble", "aloof 是冷淡疏远，不是热心关怀身处困境的人"],
      ],
      spelling: ["sym · pa · thet · ic", "the y after s and the th in the middle", "s 后是 y，中间是 th"],
    },
    {
      word: "aloof",
      meaning: ["cool and distant, not friendly or involved", "冷淡的，疏远而不合群的"],
      sentences: [
        "The new boy seemed ___, sitting alone and never joining the games.",
        "The famous actor stayed ___ from the crowd, refusing to sign autographs.",
        "Though she seemed ___ at first, Ana turned out to be shy rather than unfriendly.",
      ],
      confusions: ["sympathetic", "earnest"],
      clues: [
        "a new boy sitting alone and never joining the games",
        "a famous actor keeping away from the crowd and refusing autographs",
        "a girl who seemed distant at first but was only shy",
      ],
      contrast: ["aloof is cool and distant; sympathetic is warm and caring", "aloof 冷淡疏远；sympathetic 温暖关怀"],
      conflicts: [
        ["sympathetic means warmly caring about others, not cool and distant from them", "sympathetic 是热心关怀别人，不是对人冷淡疏远"],
        ["earnest means serious and sincere, not standing coldly apart from others", "earnest 是认真真诚，不是冷冷地与人保持距离"],
      ],
      spelling: ["a · loof", "a- plus *loof*, with a double o", "a- 加 loof，双写 o"],
    },
    {
      word: "earnest",
      meaning: ["serious and sincere in what one says or does", "认真的，真诚而严肃的"],
      sentences: [
        "In an ___ voice, Tom promised he would never lie to her again.",
        "She was so ___ about saving the park that the council agreed to listen.",
        "The ___ young reporter checked every fact before writing a word.",
      ],
      confusions: ["impulsive", "aloof"],
      clues: [
        "a sincere promise never to lie again",
        "a girl so serious about saving a park that the council listened",
        "a young reporter checking every fact before writing a word",
      ],
      contrast: ["earnest is serious and sincere; impulsive acts without thinking", "earnest 认真真诚；impulsive 不假思索"],
      conflicts: [
        ["impulsive means acting without thinking, not serious and sincere", "impulsive 是不假思索就行动，不是认真真诚"],
        [
          "aloof means cool and uninvolved, not sincerely serious about what one says or does",
          "aloof 是冷淡、置身事外，不是对自己的言行认真真诚",
        ],
      ],
      spelling: ["ear · nest", "*ear* plus *nest*", "由 *ear* 和 *nest* 组成"],
    },
    {
      word: "remorseful",
      meaning: ["feeling deeply sorry for something wrong one has done", "懊悔的，为自己做错的事深感内疚的"],
      sentences: [
        "The ___ boy returned the stolen bike and apologized to its owner.",
        "She felt ___ about the cruel words she had shouted at her sister.",
        "Looking ___, the driver admitted that he had been texting at the wheel.",
      ],
      confusions: ["resentful", "envious"],
      clues: [
        "a boy returning a stolen bike and apologizing to its owner",
        "a girl sorry for the cruel words she shouted at her sister",
        "a driver admitting he had been texting at the wheel",
      ],
      contrast: [
        "remorseful is sorry for your own wrong; resentful is bitter about a wrong done to you",
        "remorseful 为自己的过错懊悔；resentful 因受亏待而怨恨",
      ],
      conflicts: [
        [
          "resentful means bitter about a wrong done to you, not sorry for a wrong you did",
          "resentful 是因别人亏待自己而怨恨，不是为自己做错的事懊悔",
        ],
        ["envious means wanting what others have, not regretting your own wrong", "envious 是想要别人拥有的东西，不是后悔自己的过错"],
      ],
      spelling: ["re · morse · ful", "*remorse* keeps its e before -ful", "*remorse* 加 -ful 时保留 e"],
    },
  ],
};

const technology: BatchSpec = {
  id: "words-of-technology",
  title: t("Words of Technology", "技术的词汇"),
  summary: t(
    "Ten words for how machines are invented and how they work: prototype, patent, circuit, mechanism and more.",
    "十个关于机器的发明及其工作原理的词：prototype、patent、circuit、mechanism 等。",
  ),
  intro: t(
    "Ana's first **prototype**, a robot that waters plants, kept tipping over, but after twenty tries her **invention** worked so well that she applied for a **patent**. These words help you describe how machines are invented, how they work and how they change the way we live.",
    "安娜的第一个原型（**prototype**）是一台给植物浇水的机器人，总是翻倒；试了二十次以后，她的发明（**invention**）好用极了，于是她申请了专利（**patent**）。这些词帮你描述机器如何被发明、如何运转，以及它们如何改变我们的生活。",
  ),
  watchOut: {
    meanings: t(
      "An **invention** is the new device itself, a **prototype** is its first test model, and a **patent** is the right to be its only maker; one invention may need many prototypes before it earns a patent.",
      "**invention** 是新装置本身，**prototype** 是它的第一个试验模型，**patent** 是独家制造它的权利；一项发明往往要做很多个原型才拿到专利。",
    ),
    use: t(
      "An **engine** burns fuel to make motion, a **circuit** is a loop for electricity, and a **mechanism** is a set of moving parts; ask what the thing runs on before you choose.",
      "**engine** 燃烧燃料产生动力，**circuit** 是电流的回路，**mechanism** 是一组活动部件；选词前先问一问它靠什么运转。",
    ),
    spelling: t(
      "**Circuit** has a silent u, **efficient** has a double f, and **transmit** doubles its t before -ed and -ing: transmitted.",
      "**circuit** 里有不发音的 u；**efficient** 双写 f；**transmit** 加 -ed、-ing 时双写 t：transmitted。",
    ),
  },
  domain: ["inventions and machines", "发明与机器"],
  prerequisites: ["context-clues"],
  encompasses: fromClues,
  words: [
    {
      word: "invention",
      forms: ["inventions"],
      meaning: ["a new device or process that someone has created", "发明，某人创造的新装置或新方法"],
      sentences: [
        "Of all the things people have ever created, the wheel may be the most important ___ in human history.",
        "Her ___, a shoe that charges a phone as you walk, now sells in shops around the world.",
        "The telephone was such a useful ___ that within twenty years millions of homes had one.",
      ],
      confusions: ["patent", "prototype"],
      clues: [
        "the wheel, perhaps the most important thing people ever created",
        "a phone-charging shoe that now sells around the world",
        "the telephone, which millions of homes had within twenty years",
      ],
      contrast: [
        "an invention is the new device; a patent is the right to be its only maker",
        "invention 是新装置；patent 是独家制造它的权利",
      ],
      conflicts: [
        [
          "patent is the official right to be the only seller of an invention, not the device itself",
          "patent 是独家销售某项发明的官方权利，不是装置本身",
        ],
        [
          "prototype is only the first test model, not a finished device that people use",
          "prototype 只是第一个试验模型，不是人们使用的成品",
        ],
      ],
      spelling: ["in · ven · tion", "*invent* plus -ion", "*invent* 加 -ion"],
    },
    {
      word: "engine",
      forms: ["engines"],
      meaning: ["a machine that turns fuel into motion or power", "发动机，引擎，把燃料转化为动力的机器"],
      sentences: [
        "The steam ___ burned coal to boil water and turn the train's wheels.",
        "The car's ___ roared to life when she turned the key.",
        "Each jet ___ on the plane's wings burns fuel to push huge amounts of air backward.",
      ],
      confusions: ["circuit", "mechanism"],
      clues: [
        "a steam machine burning coal to turn a train's wheels",
        "a car's machine roaring to life at the turn of a key",
        "jet machines on a plane's wings burning fuel to push air backward",
      ],
      contrast: [
        "an engine turns fuel into motion; a mechanism is any set of moving parts",
        "engine 把燃料变成动力；mechanism 是任何一组活动部件",
      ],
      conflicts: [
        [
          "circuit is a path that electricity flows around, not a machine that burns fuel to make motion",
          "circuit 是电流流动的回路，不是燃烧燃料产生动力的机器",
        ],
        [
          "mechanism is a set of moving parts such as gears, not a machine that turns fuel into power",
          "mechanism 是齿轮之类的一组活动部件，不是把燃料变成动力的机器",
        ],
      ],
      spelling: ["en · gine", "the g that sounds like j, and the silent e", "g 读作 j，末尾 e 不发音"],
    },
    {
      word: "circuit",
      forms: ["circuits"],
      meaning: ["a complete path around which electricity flows", "电路，电流流动的完整回路"],
      sentences: [
        "The bulb will light only when the wires form a closed ___.",
        "A loose wire broke the ___, and the radio went silent.",
        "Inside every phone is a tiny ___ printed on a green board.",
      ],
      confusions: ["engine", "prototype"],
      clues: [
        "wires forming a closed loop so a bulb can light",
        "a loose wire breaking the path and silencing a radio",
        "a tiny path for electricity printed on a phone's green board",
      ],
      contrast: [
        "a circuit is a path for electricity; an engine is a machine that burns fuel",
        "circuit 是电流的通路；engine 是燃烧燃料的机器",
      ],
      conflicts: [
        [
          "engine is a machine that burns fuel to make motion, not a loop that electricity flows around",
          "engine 是燃烧燃料产生动力的机器，不是电流流动的回路",
        ],
        ["prototype is a first test model of a machine, not a path for electricity", "prototype 是机器的第一个试验模型，不是电流的通路"],
      ],
      spelling: ["cir · cuit", "the silent u in -cuit, said like *kit*", "-cuit 中 u 不发音，读如 *kit*"],
    },
    {
      word: "patent",
      forms: ["patents", "patented"],
      meaning: [
        "an official right to be the only one to make and sell an invention for a time",
        "专利，在一定时期内独家制造和销售某项发明的官方权利",
      ],
      sentences: [
        "The inventor applied for the ___ so that no one could copy her design.",
        "Thomas Edison held the ___ on the phonograph, so no one else could sell one without his permission.",
        "Once the ___ ran out, other companies were free to make the same medicine.",
      ],
      confusions: ["prototype", "invention"],
      clues: [
        "an inventor making sure no one could copy her design",
        "Edison's right that stopped others from selling the phonograph",
        "the right that ran out so other companies could make the same medicine",
      ],
      contrast: ["a patent is a legal right; a prototype is a test model", "patent 是法定权利；prototype 是试验模型"],
      conflicts: [
        [
          "prototype is a first working model built for testing, not a legal right that stops others copying",
          "prototype 是为测试而造的第一个模型，不是阻止别人仿制的法定权利",
        ],
        [
          "invention is the new device itself, not the official right to be its only maker",
          "invention 是新装置本身，不是独家制造它的官方权利",
        ],
      ],
      spelling: ["pat · ent", "the -ent ending", "结尾是 -ent"],
    },
    {
      word: "prototype",
      forms: ["prototypes"],
      meaning: ["the first working model of a new machine, built to test it", "原型，为测试而制造的新机器的第一个工作模型"],
      sentences: [
        "The team's first ___, a rough test model of the drone, crashed after ten seconds.",
        "Engineers built a cardboard ___ before making the real chair from steel.",
        "Before building a thousand bikes, the company made a single ___ to test the new design.",
      ],
      confusions: ["patent", "invention"],
      clues: [
        "a rough test model of a drone that crashed after ten seconds",
        "a cardboard model built before the real steel chair",
        "one bike made to test a design before building a thousand",
      ],
      contrast: ["a prototype is a test model; an invention is the new thing itself", "prototype 是试验模型；invention 是新东西本身"],
      conflicts: [
        [
          "patent is a legal right to be the only maker, not a model built to be tested",
          "patent 是独家制造的法定权利，不是造出来做测试的模型",
        ],
        [
          "invention is the new device as a whole, not one early model built only to try the design out",
          "invention 是整个新装置，不是只为试验设计而造的早期模型",
        ],
      ],
      spelling: ["pro · to · type", "proto- with two o's, then *type* with a y", "proto- 有两个 o，后接带 y 的 *type*"],
    },
    {
      word: "efficient",
      forms: ["efficiency"],
      meaning: ["working well without wasting time, energy or materials", "高效的，不浪费时间、能源或材料的"],
      sentences: [
        "LED bulbs are more ___ than old bulbs because they turn more electricity into light.",
        "The new assembly line was so ___ that a car was finished every ninety minutes.",
        "The more ___ engine travels farther on the same amount of fuel.",
      ],
      confusions: ["conscientious", "resilient"],
      clues: [
        "LED bulbs turning more electricity into light than old bulbs",
        "an assembly line finishing a car every ninety minutes",
        "an engine going farther on the same amount of fuel",
      ],
      contrast: ["efficient means wasting nothing; conscientious means working carefully", "efficient 指不浪费；conscientious 指认真尽责"],
      conflicts: [
        [
          "conscientious describes a careful, dutiful person, not a machine or process that wastes nothing",
          "conscientious 形容认真尽责的人，不是形容毫不浪费的机器或流程",
        ],
        [
          "resilient means able to recover after something hard, not getting more work out of less energy",
          "resilient 是能在困难后恢复，不是用更少的能量做更多的事",
        ],
      ],
      spelling: ["ef · fi · cient", "the double f and the -cient ending", "双写 f，结尾是 -cient"],
    },
    {
      word: "mechanism",
      forms: ["mechanisms"],
      meaning: ["a set of moving parts that work together to do a job", "机械装置，协同工作的一组活动部件"],
      sentences: [
        "The clock's ___ of tiny gears and springs keeps it ticking for years.",
        "A simple ___ inside the lock lets the key turn only one way.",
        "When the tiny drum and metal comb of its ___ jammed, the music box stopped playing.",
      ],
      confusions: ["engine", "innovation"],
      clues: [
        "tiny gears and springs keeping a clock ticking for years",
        "a simple set of parts inside a lock letting the key turn one way",
        "a music box's drum and metal comb jamming",
      ],
      contrast: [
        "a mechanism is a set of moving parts; an engine burns fuel for power",
        "mechanism 是一组活动部件；engine 燃烧燃料产生动力",
      ],
      conflicts: [
        [
          "engine is a machine that burns fuel to make power, not a small set of parts such as gears and springs",
          "engine 是燃烧燃料产生动力的机器，不是齿轮、弹簧之类的一小组部件",
        ],
        ["innovation is a new idea or way of doing things, not a set of moving parts", "innovation 是新想法或新做法，不是一组活动部件"],
      ],
      spelling: ["mech · a · nism", "the ch that sounds like k, and the -ism ending", "ch 读作 k，结尾是 -ism"],
    },
    {
      word: "automate",
      forms: ["automates", "automated", "automating", "automation"],
      meaning: ["to make a process run by machine instead of by people", "使自动化，让机器代替人来完成某个过程"],
      sentences: [
        "The factory plans to ___ the packing, so machines will box every order.",
        "Many banks ___ simple tasks, such as sorting checks, to save time.",
        "Using robots, the warehouse will ___ jobs that once took dozens of workers.",
      ],
      confusions: ["transmit", "patent"],
      clues: [
        "a factory having machines box every order",
        "banks letting machines sort checks to save time",
        "a warehouse using robots for jobs that once took dozens of workers",
      ],
      contrast: ["automate hands a job to machines; transmit sends a signal", "automate 把工作交给机器；transmit 发送信号"],
      conflicts: [
        [
          "transmit means to send a signal or message somewhere, not to hand a job over to machines",
          "transmit 是把信号或信息发送到别处，不是把工作交给机器",
        ],
        [
          "to patent something is to get the right to be its only maker, not to make machines do work people once did",
          "patent 作动词是取得独家制造权，不是让机器去做原本由人做的工作",
        ],
      ],
      spelling: ["au · to · mate", "auto- with au, as in *automobile*", "开头 auto-，同 *automobile*"],
    },
    {
      word: "innovation",
      forms: ["innovations"],
      meaning: ["a new idea or way of doing something that improves on the old one", "创新，改进旧事物的新想法或新方法"],
      sentences: [
        "The assembly line, a new way of building cars, was the ___ that made them cheap enough for ordinary families.",
        "The company gives a prize for each ___ its workers suggest, such as a faster way to pack boxes.",
        "Touch screens were a great ___ in how people use phones.",
      ],
      confusions: ["mechanism", "prototype"],
      clues: [
        "the assembly line, a new way of building cars that made them cheap",
        "a better way of working, such as a faster way to pack boxes",
        "touch screens changing how people use phones",
      ],
      contrast: [
        "an innovation is a new way of doing things; a mechanism is a set of moving parts",
        "innovation 是新的做法；mechanism 是一组活动部件",
      ],
      conflicts: [
        [
          "mechanism is a set of moving parts inside a machine, not a new way of doing something",
          "mechanism 是机器里的一组活动部件，不是新的做事方法",
        ],
        [
          "prototype is a first test model of one machine, not a new idea that changes how things are done",
          "prototype 是某台机器的第一个试验模型，不是改变做事方式的新想法",
        ],
      ],
      spelling: ["in · no · va · tion", "the double n after in-", "in- 后双写 n"],
    },
    {
      word: "transmit",
      forms: ["transmits", "transmitted", "transmitting", "transmission"],
      meaning: ["to send a signal or a message from one place to another", "传送，把信号或信息从一处发送到另一处"],
      sentences: [
        "Radio towers ___ signals that travel through the air to millions of homes.",
        "The telegraph could ___ a message across the country in minutes.",
        "Satellites ___ pictures of storms back to the weather station.",
      ],
      confusions: ["automate", "navigate"],
      clues: [
        "radio towers sending signals through the air to millions of homes",
        "a telegraph sending a message across the country in minutes",
        "satellites sending storm pictures back to a weather station",
      ],
      contrast: ["transmit sends a signal; automate hands a job to machines", "transmit 发送信号；automate 把工作交给机器"],
      conflicts: [
        [
          "automate means to make machines do a job people once did, not to send a signal to another place",
          "automate 是让机器做原本由人做的工作，不是把信号发送到别处",
        ],
        [
          "navigate means to find the way and steer a course, not to send a message from one place to another",
          "navigate 是辨明方向、驾驶前行，不是把信息从一处发送到另一处",
        ],
      ],
      spelling: ["trans · mit", "the t doubled before -ed and -ing: transmitted", "加 -ed、-ing 时双写 t：transmitted"],
    },
  ],
};

const exploration: BatchSpec = {
  id: "words-of-exploration",
  title: t("Words of Exploration", "探险的词汇"),
  summary: t(
    "Ten words for journeys into the unknown: expedition, navigate, latitude, longitude, uncharted and more.",
    "十个关于未知之旅的词：expedition、navigate、latitude、longitude、uncharted 等。",
  ),
  intro: t(
    "The **expedition** sailed for weeks into **uncharted** waters, using a **compass** and the stars to **navigate** past icy rocks that no sailor had ever seen. These words help you follow explorers on their journeys into the unknown and the places they reached.",
    "探险队（**expedition**）一连几周驶入未经勘测的（**uncharted**）水域，靠指南针（**compass**）和星星导航（**navigate**），绕过从没有水手见过的冰冷礁石。这些词帮你跟随探险家走进未知的旅程，了解他们到达的地方。",
  ),
  watchOut: {
    meanings: t(
      "**Latitude** measures how far north or south of the equator a place is, while **longitude** measures how far east or west; lines of latitude circle the globe, and lines of longitude run from pole to pole.",
      "**latitude** 衡量一个地方在赤道以北或以南多远，**longitude** 衡量它在东西方向上有多远；纬线环绕地球，经线从一极连到另一极。",
    ),
    use: t(
      "A **colony** is a settlement ruled from far away, while the **frontier** is the wild edge beyond settled land; settlers live in a colony and push out toward the frontier.",
      "**colony** 是受远方统治的定居点，**frontier** 是已开发土地以外的荒野边缘；移民住在 colony 里，并向 frontier 开拓。",
    ),
    spelling: t(
      "**Expedition** ends in -tion, **frontier** ends in -tier, and **perilous** keeps the single l of peril.",
      "**expedition** 结尾是 -tion，**frontier** 结尾是 -tier，**perilous** 保留 peril 的单个 l。",
    ),
  },
  domain: ["explorers and their voyages", "探险家及其航行"],
  prerequisites: ["context-clues"],
  encompasses: fromClues,
  words: [
    {
      word: "expedition",
      forms: ["expeditions"],
      meaning: ["a journey made by a group of people for a special purpose, such as exploring", "远征，探险，一群人为特定目的进行的旅程"],
      sentences: [
        "The ___ to the South Pole took months of planning and a team of twelve.",
        "The scientists' ___ into the rain forest went on foot for six weeks to search for new plants.",
        "The ___ set out with sleds, dogs and enough food for a year.",
      ],
      confusions: ["voyage", "colony"],
      clues: [
        "a team of twelve planning for months to reach the South Pole",
        "scientists going on foot into a rain forest to search for new plants",
        "a group setting out with sleds, dogs and a year of food",
      ],
      contrast: [
        "an expedition is a group journey with a purpose; a voyage is a long trip by sea or through space",
        "expedition 是有特定目的的集体旅程；voyage 是海上或太空中的长途旅行",
      ],
      conflicts: [
        [
          "voyage is a long journey by sea or through space, not a group's trek over land on foot or by sled",
          "voyage 是海上或太空中的长途旅行，不是一群人徒步或乘雪橇的陆上跋涉",
        ],
        [
          "colony is a settlement ruled by a faraway country, not a journey made for a purpose",
          "colony 是受远方国家统治的定居点，不是为特定目的而进行的旅程",
        ],
      ],
      spelling: ["ex · pe · di · tion", "the i after d, and the -tion ending", "d 后是 i，结尾是 -tion"],
    },
    {
      word: "voyage",
      forms: ["voyages"],
      meaning: ["a long journey by sea or through space", "航行，海上或太空中的长途旅行"],
      sentences: [
        "The ship's ___ across the Atlantic took six stormy weeks.",
        "During the long ___, the sailors ran short of fresh water.",
        "The spacecraft's ___ to Mars lasted seven months.",
      ],
      confusions: ["frontier", "compass"],
      clues: [
        "a ship crossing the Atlantic in six stormy weeks",
        "sailors running short of fresh water on a long trip at sea",
        "a spacecraft's seven-month journey to Mars",
      ],
      contrast: [
        "a voyage is a long trip by sea or through space; a compass is the tool that guides it",
        "voyage 是海上或太空中的长途旅行；compass 是为它指路的工具",
      ],
      conflicts: [
        [
          "frontier is the edge of settled land, not a long trip by ship or spacecraft",
          "frontier 是已开发土地的边缘，不是乘船或飞船的长途旅行",
        ],
        ["compass is a tool whose needle points north, not a long journey", "compass 是指针指向北方的工具，不是长途旅行"],
      ],
      spelling: ["voy · age", "the oy and the -age ending", "中间是 oy，结尾是 -age"],
    },
    {
      word: "navigate",
      forms: ["navigates", "navigated", "navigating", "navigator", "navigators"],
      meaning: ["to find the way and steer a course from one place to another", "导航，确定方向并驾驶前往某处"],
      sentences: [
        "Long ago, sailors learned to ___ by watching the stars.",
        "Without a map, it was hard to ___ through the thick forest.",
        "Pilots use instruments to ___ the plane through thick clouds when they cannot see the ground.",
      ],
      confusions: ["transmit", "automate"],
      clues: [
        "sailors finding their way by watching the stars",
        "finding a way through thick forest without a map",
        "pilots steering through thick clouds with instruments",
      ],
      contrast: [
        "navigate means to find the way and steer; transmit means to send a signal",
        "navigate 是辨明方向并驾驶前行；transmit 是发送信号",
      ],
      conflicts: [
        [
          "transmit means to send a signal or message, not to find the way from place to place",
          "transmit 是发送信号或信息，不是在两地之间辨明方向",
        ],
        [
          "automate means to make a machine do a job instead of people, not to steer a course toward a place",
          "automate 是让机器代替人工作，不是朝某地驾驶前行",
        ],
      ],
      spelling: ["nav · i · gate", "the -gate ending, as in *gate*", "结尾是 -gate，同 *gate*"],
    },
    {
      word: "compass",
      forms: ["compasses"],
      meaning: ["a tool with a magnetic needle that always points north", "指南针，指针总是指向北方的工具"],
      sentences: [
        "The hiker pulled the ___ out of her pocket, waited for it to point north, and set off toward the river.",
        "Chinese sailors were among the first to use a magnetic ___ at sea.",
        "The needle of the ___ spun wildly near the iron rocks.",
      ],
      confusions: ["latitude", "frontier"],
      clues: [
        "a hiker taking a tool from her pocket and waiting for it to point north",
        "Chinese sailors using a magnetic tool at sea",
        "a needle spinning wildly near iron rocks",
      ],
      contrast: [
        "a compass is a tool that points north; latitude is a distance measured in degrees",
        "compass 是指向北方的工具；latitude 是以度计量的距离",
      ],
      conflicts: [
        [
          "latitude is a distance north or south of the equator, not a tool you hold in your hand",
          "latitude 是赤道以北或以南的距离，不是拿在手里的工具",
        ],
        [
          "frontier is the edge of settled land, not a tool with a needle that points north",
          "frontier 是已开发土地的边缘，不是指针指北的工具",
        ],
      ],
      spelling: ["com · pass", "*com* plus *pass*, with a double s", "*com* 加 *pass*，双写 s"],
    },
    {
      word: "latitude",
      meaning: ["the distance north or south of the equator, measured in degrees", "纬度，赤道以北或以南的距离，以度计量"],
      sentences: [
        "Sailors could find how far north they were, their ___, by measuring how high the sun stood at noon.",
        "Places at a high ___, far from the equator, have long, cold winters.",
        "Lines of ___ run east and west around the globe, parallel to the equator.",
      ],
      confusions: ["longitude", "compass"],
      clues: [
        "sailors finding how far north they were from the sun at noon",
        "places far from the equator with long, cold winters",
        "lines running east and west around the globe, parallel to the equator",
      ],
      contrast: ["latitude is north or south of the equator; longitude is east or west", "latitude 指赤道以南或以北；longitude 指东西方向"],
      conflicts: [
        [
          "longitude measures how far east or west a place is, not how far north or south of the equator",
          "longitude 衡量东西方向的距离，不是赤道以南或以北的距离",
        ],
        [
          "compass is a tool with a needle, not a distance measured in degrees from the equator",
          "compass 是带指针的工具，不是从赤道算起、以度计量的距离",
        ],
      ],
      spelling: ["lat · i · tude", "the -tude ending", "结尾是 -tude"],
    },
    {
      word: "longitude",
      meaning: [
        "the distance east or west of a fixed line on the earth, measured in degrees",
        "经度，地球上某一固定线以东或以西的距离，以度计量",
      ],
      sentences: [
        "Until accurate clocks were made, sailors had no reliable way to measure their ___ east or west.",
        "Lines of ___ run from the North Pole to the South Pole.",
        "To know how far east or west it had sailed, its ___, a ship had to know the exact time back home.",
      ],
      confusions: ["latitude", "frontier"],
      clues: [
        "sailors with no reliable way to measure how far east or west they were",
        "lines running from the North Pole to the South Pole",
        "a ship needing the exact time back home to know how far east or west it had sailed",
      ],
      contrast: ["longitude is east or west; latitude is north or south of the equator", "longitude 指东西方向；latitude 指赤道以南或以北"],
      conflicts: [
        [
          "latitude measures how far north or south of the equator a place is, not how far east or west",
          "latitude 衡量赤道以南或以北的距离，不是东西方向的距离",
        ],
        ["frontier is the edge of settled land, not a distance measured in degrees", "frontier 是已开发土地的边缘，不是以度计量的距离"],
      ],
      spelling: ["lon · gi · tude", "the g that sounds like j, and the -tude ending", "g 读作 j，结尾是 -tude"],
    },
    {
      word: "colony",
      forms: ["colonies", "colonist", "colonists"],
      meaning: ["a settlement in a new land that is ruled by a faraway country", "殖民地，受远方国家统治的新定居点"],
      sentences: [
        "The settlers founded the ___ on the coast, but it was still ruled from across the ocean.",
        "The ___ had to send much of its cotton and sugar back to the mother country.",
        "In 1776, each ___ in America declared that it was free from British rule.",
      ],
      confusions: ["expedition", "frontier"],
      clues: [
        "settlers on a coast still ruled from across the ocean",
        "a settlement sending its cotton and sugar back to the mother country",
        "American settlements declaring themselves free from British rule in 1776",
      ],
      contrast: [
        "a colony is a settlement ruled from far away; the frontier is the wild edge beyond settled land",
        "colony 是受远方统治的定居点；frontier 是已开发土地之外的荒野边缘",
      ],
      conflicts: [
        [
          "expedition is a journey made for a purpose, not a settlement ruled by a faraway country",
          "expedition 是为特定目的进行的旅程，不是受远方国家统治的定居点",
        ],
        [
          "frontier is the wild edge of settled land, not a settlement governed from overseas",
          "frontier 是已开发土地的荒野边缘，不是由海外统治的定居点",
        ],
      ],
      spelling: ["col · o · ny", "the single l and the -ony ending", "单写 l，结尾是 -ony"],
    },
    {
      word: "frontier",
      forms: ["frontiers"],
      meaning: ["the edge of settled or known land, beyond which lies the unknown", "边疆，已开发或已知土地的边缘"],
      sentences: [
        "Families moved west to the ___, the wild edge of the settled land, where there were no towns or roads yet.",
        "For scientists, the deep sea is the last great ___ on Earth.",
        "Life on the ___ was lonely and hard, far from doctors and stores.",
      ],
      confusions: ["colony", "latitude"],
      clues: [
        "families moving west to the wild edge of settled land with no towns or roads",
        "the deep sea, the last great unknown place on Earth",
        "a lonely, hard life far from doctors and stores",
      ],
      contrast: [
        "the frontier is the edge of the known land; a colony is a settlement ruled from far away",
        "frontier 是已知土地的边缘；colony 是受远方统治的定居点",
      ],
      conflicts: [
        [
          "colony is a settlement ruled by a faraway country, not the unknown edge beyond settled land",
          "colony 是受远方国家统治的定居点，不是已开发土地之外的未知边缘",
        ],
        [
          "latitude is a distance from the equator in degrees, not the edge of the known world",
          "latitude 是以度计量的与赤道的距离，不是已知世界的边缘",
        ],
      ],
      spelling: ["fron · tier", "the -tier ending", "结尾是 -tier"],
    },
    {
      word: "uncharted",
      meaning: ["not yet mapped or explored", "未经勘测的，未知的"],
      sentences: [
        "On calm, safe seas, the explorers sailed into ___ waters that no map had ever shown.",
        "Much of the ocean floor is still ___, because no ship has ever measured it for a map.",
        "They hiked deep into ___ forest, marking trees as they went so they could find their way back.",
      ],
      confusions: ["perilous", "bleak"],
      clues: [
        "calm, safe seas that no map had ever shown",
        "an ocean floor that no ship has ever measured for a map",
        "a forest so unknown that hikers marked trees to find their way back",
      ],
      contrast: ["uncharted means not yet mapped; perilous means dangerous", "uncharted 指尚未测绘；perilous 指危险"],
      conflicts: [
        ["perilous means full of danger, not missing from every map", "perilous 是危险重重，不是在所有地图上都没有"],
        ["bleak means cold, empty and hopeless, not never yet explored or mapped", "bleak 是荒凉冷清、没有希望，不是从未被探索或测绘"],
      ],
      spelling: ["un · chart · ed", "un- plus *chart* plus -ed", "un- 加 *chart* 加 -ed"],
    },
    {
      word: "perilous",
      meaning: ["full of danger", "危险重重的"],
      sentences: [
        "The ___ climb up the icy cliff took all of their courage.",
        "Crossing the desert without water would be ___, since a person can die of thirst in a single day.",
        "The old rope bridge over the canyon was so ___ that one broken plank could send a walker falling.",
      ],
      confusions: ["uncharted", "ominous"],
      clues: [
        "a climb up an icy cliff that took all their courage",
        "a desert crossing without water where a person could die of thirst in a day",
        "an old rope bridge where one broken plank could send a walker falling",
      ],
      contrast: [
        "perilous is full of danger now; ominous only hints at trouble to come",
        "perilous 指眼下危险重重；ominous 只是预示麻烦将至",
      ],
      conflicts: [
        ["uncharted means not yet mapped, not full of danger", "uncharted 是尚未测绘，不是危险重重"],
        [
          "ominous means hinting that something bad will happen, not being full of danger right now",
          "ominous 是预示坏事会发生，不是眼下就危险重重",
        ],
      ],
      spelling: ["per · il · ous", "*peril* plus -ous, with one l", "*peril* 加 -ous，单写 l"],
    },
  ],
};

const batches: readonly BatchSpec[] = [myths, tone, rome, argument, ecosystems, character, technology, exploration];

const pool = wordPool(batches);

/** wordTopics68 are the vocabulary topics of grades 6 to 8. */
export const wordTopics68: readonly TopicDef[] = batches.map((b) => batchTopicWithPool(b, pool));

/** vocabulary68 are the words the batches of grades 6 to 8 teach. */
export const vocabulary68: readonly WordBatch[] = batches.map(batchWords);
